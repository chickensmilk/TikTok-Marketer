/**
 * Instapage Bulk Unpublisher — API-based Web UI Server
 * Run: node server.js
 * Then open: http://localhost:3333
 */

const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();
const PORT = 3333;

// ─── Config ────────────────────────────────────────────────────────────────────
const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1HZKlucyNgJrgCA55e4tZfUyLhMnHYpkzqMb1kCFSNC4/export?format=csv&gid=0';
const INSTAPAGE_API = 'api.instapage.com';
const PROGRESS_FILE = path.join(__dirname, 'progress.json');
const FAILED_FILE = path.join(__dirname, 'failed.json');
const URL_INDEX_FILE = path.join(__dirname, 'url-index.json');

// ─── State ─────────────────────────────────────────────────────────────────────
let state = {
  status: 'idle',
  total: 0,
  completed: 0,
  failed: 0,
  remaining: 0,
  current: null,
};
let sseClients = [];
let pauseRequested = false;
let stopRequested = false;

// ─── SSE ───────────────────────────────────────────────────────────────────────
function broadcast(type, payload) {
  const data = JSON.stringify({ type, payload, ts: Date.now() });
  sseClients = sseClients.filter(res => {
    try { res.write(`data: ${data}\n\n`); return true; }
    catch { return false; }
  });
}

function log(msg, level = 'info') {
  console.log(msg);
  broadcast('log', { msg, level });
}

// ─── HTTP helpers ──────────────────────────────────────────────────────────────
function fetchWithRedirects(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects === 0) return reject(new Error('Too many redirects'));
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, res => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.resume();
        return fetchWithRedirects(res.headers.location, maxRedirects - 1).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function apiRequest(method, path, token, retries = 5) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await new Promise((resolve, reject) => {
        const options = {
          hostname: INSTAPAGE_API,
          path,
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        };
        const req = https.request(options, res => {
          let data = '';
          res.on('data', chunk => (data += chunk));
          res.on('end', () => {
            if (res.statusCode === 429) {
              const retryAfter = parseInt(res.headers['retry-after'] || '60', 10);
              return reject(Object.assign(new Error('Rate limited'), { retryAfter }));
            }
            if (res.statusCode >= 400) {
              return reject(new Error(`API error ${res.statusCode}: ${data}`));
            }
            try { resolve(data ? JSON.parse(data) : {}); }
            catch { resolve({}); }
          });
        });
    req.on('error', reject);
        req.end();
      });
      return result;
    } catch (err) {
      if (err.retryAfter && attempt < retries) {
        const wait = Math.min(err.retryAfter, 120) * 1000; // cap at 2 minutes
        const displayWait = Math.min(err.retryAfter, 120);
        log(`Rate limited — waiting ${displayWait}s before retry...`, 'warn');
        await sleep(wait);
        continue;
      }
      throw err;
    }
  }
}

async function apiGet(path, token) {
  return apiRequest('GET', path, token);
}

async function apiDelete(path, token) {
  return apiRequest('DELETE', path, token);
}

// ─── CSV helpers ───────────────────────────────────────────────────────────────
function parseCSV(csvText) {
  const rows = [];
  for (const line of csvText.split('\n')) {
    if (!line.trim()) continue;
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === ',' && !inQuotes) { fields.push(current.trim()); current = ''; }
      else { current += ch; }
    }
    fields.push(current.trim());
    rows.push(fields);
  }
  return rows;
}

function loadProgress() {
  try { return fs.existsSync(PROGRESS_FILE) ? JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')) : { completed: [] }; }
  catch { return { completed: [] }; }
}
function saveProgress(p) { fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2)); }

function loadFailed() {
  try { return fs.existsSync(FAILED_FILE) ? JSON.parse(fs.readFileSync(FAILED_FILE, 'utf8')) : []; }
  catch { return []; }
}
function saveFailed(f) { fs.writeFileSync(FAILED_FILE, JSON.stringify(f, null, 2)); }

// ─── Instapage API helpers ─────────────────────────────────────────────────────

// Get all workspaces (handles pagination)
async function getAllWorkspaces(token) {
  let workspaces = [];
  let page = 1;
  while (true) {
    const res = await apiGet(`/v1/workspaces?page=${page}&limit=100`, token);
    const items = res.data || res.workspaces || res.items || (Array.isArray(res) ? res : []);
    if (!items.length) break;
    workspaces = workspaces.concat(items);
    const meta = res.meta || res.pagination || {};
    if (!meta.next && items.length < 100) break;
    page++;
  }
  return workspaces;
}

// Get all pages in a workspace (handles pagination)
async function getAllPages(workspaceId, token) {
  let pages = [];
  let page = 1;
  while (true) {
    const res = await apiGet(`/v1/workspaces/${workspaceId}/pages?page=${page}&limit=100`, token);
    const items = res.data || res.pages || res.items || (Array.isArray(res) ? res : []);
    if (!items.length) break;
    pages = pages.concat(items);
    const meta = res.meta || res.pagination || {};
    if (!meta.next && items.length < 100) break;
    page++;
  }
  return pages;
}

// Normalize a URL for comparison (strip protocol, trailing slash, lowercase)
function normalizeUrl(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase().trim();
}

// ─── Main job ──────────────────────────────────────────────────────────────────
async function runJob({ token, batchSize, delaySeconds }) {
  state.status = 'running';
  pauseRequested = false;
  stopRequested = false;
  broadcast('state', state);

  // 1. Fetch Google Sheet
  log('Fetching Google Sheet...');
  let csvText;
  try {
    csvText = await fetchWithRedirects(SHEET_CSV_URL);
  } catch (err) {
    log(`Failed to fetch sheet: ${err.message}`, 'error');
    state.status = 'error'; broadcast('state', state); return;
  }

  const rows = parseCSV(csvText).slice(1); // skip header row
  // Col A=0 (checkbox), Col B=1 (URL), Col C=2 (client name / workspace name)
  const toProcess = rows.filter(r =>
    r[0]?.toUpperCase() === 'FALSE' && r[1] && r[2]
  );

  log(`Found ${toProcess.length} pages to unpublish`);

  const progress = loadProgress();
  const failed = loadFailed();
  let queue = toProcess.filter(r => !progress.completed.includes(r[1]));

  if (batchSize && batchSize < queue.length) {
    queue = queue.slice(0, batchSize);
    log(`Batch size: ${batchSize} page${batchSize > 1 ? 's' : ''} — ${delaySeconds}s delay between each`);
  } else {
    log(`Processing all ${queue.length} remaining pages — ${delaySeconds}s delay between each`);
  }

  state.total = toProcess.length;
  state.completed = progress.completed.length;
  state.failed = failed.length;
  state.remaining = queue.length;
  broadcast('state', state);

  if (queue.length === 0) {
    log('Nothing left to process.', 'success');
    state.status = 'done'; broadcast('state', state); return;
  }

  // 2. Build a URL → {workspaceId, pageId} map — load from cache if available
  let urlMap = {};
  if (fs.existsSync(URL_INDEX_FILE)) {
    urlMap = JSON.parse(fs.readFileSync(URL_INDEX_FILE, 'utf8'));
    log(`Loaded URL index from cache (${Object.keys(urlMap).length} pages) — delete ${URL_INDEX_FILE} to rebuild`, 'success');
  } else {
    log('Building URL index across all workspaces (one-time, will be cached)...');
    let workspaces;
    let wsAttempt = 0;
    while (true) {
      try {
        workspaces = await getAllWorkspaces(token);
        log(`Found ${workspaces.length} workspaces — loading all pages...`);
        break;
      } catch (err) {
        wsAttempt++;
        if (wsAttempt > 3) {
          log('Still rate limited after 3 attempts. Wait a few minutes and try again.', 'error');
          state.status = 'error'; broadcast('state', state); return;
        }
        const wait = 60 * wsAttempt; // 60s, 120s, 180s
        log(`Rate limited — waiting ${wait}s before retry (attempt ${wsAttempt}/3)...`, 'warn');
        await sleep(wait * 1000);
      }
    }

    for (const ws of workspaces) {
      const wsId = ws.id || ws.workspaceId;
      try {
        const pages = await getAllPages(wsId, token);
        for (const p of pages) {
          const urls = [
            p.url, p.pageUrl, p.slug,
            ...(p.urls || []),
            p.published_url, p.publishedUrl,
          ].filter(Boolean);
          for (const u of urls) {
            urlMap[normalizeUrl(u)] = { workspaceId: wsId, pageId: p.id || p.pageId };
          }
        }
        await sleep(300); // gentle pacing while indexing
      } catch { /* skip inaccessible workspaces */ }
    }
    fs.writeFileSync(URL_INDEX_FILE, JSON.stringify(urlMap, null, 2));
    log(`Indexed ${Object.keys(urlMap).length} pages — saved to cache`, 'success');
  }

  // 3. Process each page
  for (let i = 0; i < queue.length; i++) {
    if (stopRequested) { log('Stopped by user.', 'warn'); break; }
    while (pauseRequested && !stopRequested) {
      if (state.status !== 'paused') { state.status = 'paused'; broadcast('state', state); log('Paused.', 'warn'); }
      await new Promise(r => setTimeout(r, 500));
    }
    if (stopRequested) { log('Stopped by user.', 'warn'); break; }
    if (state.status === 'paused') { state.status = 'running'; broadcast('state', state); log('Resumed.'); }

    const rawUrl = queue[i][1];

    state.current = { url: rawUrl, title: rawUrl, clientName: rawUrl, index: i + 1, total: queue.length };
    broadcast('state', state);
    log(`[${i + 1}/${queue.length}] ${rawUrl}`);

    try {
      const entry = urlMap[normalizeUrl(rawUrl)];
      if (!entry) throw new Error(`URL not found in any workspace: ${rawUrl}`);

      const { workspaceId, pageId } = entry;
      log(`  Found — workspace: ${workspaceId}, page: ${pageId} — unpublishing...`);

      // Unpublish
      await apiDelete(`/v1/workspaces/${workspaceId}/pages/${pageId}/publication`, token);

      log(`  ✓ Unpublished`, 'success');
      progress.completed.push(rawUrl);
      saveProgress(progress);
      state.completed++;
      state.remaining--;
      state.current = null;
      broadcast('state', state);

      // User-configured delay between unpublishes
      if (i < queue.length - 1) {
        log(`  Waiting ${delaySeconds}s before next page...`);
        await sleep(delaySeconds * 1000);
      }

    } catch (err) {
      if (err.retryAfter) {
        log(`  Rate limited — waiting ${err.retryAfter}s...`, 'warn');
        await new Promise(r => setTimeout(r, err.retryAfter * 1000));
        i--; // retry this item
        continue;
      }
      log(`  ✗ Failed: ${err.message}`, 'error');
      failed.push({ url: rawUrl, clientName: rawUrl, error: err.message });
      saveFailed(failed);
      state.failed++;
      state.remaining--;
      state.current = null;
      broadcast('state', state);
    }
  }

  state.status = stopRequested ? 'idle' : 'done';
  state.current = null;
  broadcast('state', state);
  log(stopRequested ? 'Job stopped.' : `All done! ${progress.completed.length} unpublished, ${failed.length} failed.`,
    stopRequested ? 'warn' : 'success');
}

// ─── Express routes ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  sseClients.push(res);
  res.write(`data: ${JSON.stringify({ type: 'state', payload: state })}\n\n`);
  req.on('close', () => { sseClients = sseClients.filter(c => c !== res); });
});

app.get('/api/status', async (req, res) => {
  try {
    const csvText = await fetchWithRedirects(SHEET_CSV_URL);
    const rows = parseCSV(csvText).slice(1);
    const toProcess = rows.filter(r => r[0]?.toUpperCase() === 'FALSE' && r[1] && r[2]);
    const progress = loadProgress();
    const failed = loadFailed();
    res.json({
      total: toProcess.length,
      completed: progress.completed.length,
      failed: failed.length,
      remaining: toProcess.filter(r => !progress.completed.includes(r[1])).length,
      status: state.status,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/failed', (req, res) => res.json(loadFailed()));

app.post('/api/start', async (req, res) => {
  if (state.status === 'running') return res.status(400).json({ error: 'Already running' });
  const { token, batchSize, delaySeconds } = req.body;
  if (!token) return res.status(400).json({ error: 'API token required' });
  res.json({ ok: true });
  runJob({ token, batchSize: parseInt(batchSize) || 128, delaySeconds: parseInt(delaySeconds) || 12 }).catch(err => {
    log(`Fatal error: ${err.message}`, 'error');
    state.status = 'error'; broadcast('state', state);
  });
});

app.post('/api/pause', (req, res) => {
  if (state.status !== 'running') return res.status(400).json({ error: 'Not running' });
  pauseRequested = true; res.json({ ok: true });
});

app.post('/api/resume', (req, res) => {
  if (state.status !== 'paused') return res.status(400).json({ error: 'Not paused' });
  pauseRequested = false; res.json({ ok: true });
});

app.post('/api/stop', (req, res) => {
  stopRequested = true; pauseRequested = false; res.json({ ok: true });
});

app.post('/api/clear-progress', (req, res) => {
  if (state.status === 'running' || state.status === 'paused')
    return res.status(400).json({ error: 'Cannot clear while running' });
  if (fs.existsSync(PROGRESS_FILE)) fs.unlinkSync(PROGRESS_FILE);
  if (fs.existsSync(FAILED_FILE)) fs.unlinkSync(FAILED_FILE);
  state = { status: 'idle', total: 0, completed: 0, failed: 0, remaining: 0, current: null };
  broadcast('state', state);
  res.json({ ok: true });
});

app.post('/api/clear-index', (req, res) => {
  if (state.status === 'running' || state.status === 'paused')
    return res.status(400).json({ error: 'Cannot clear while running' });
  if (fs.existsSync(URL_INDEX_FILE)) fs.unlinkSync(URL_INDEX_FILE);
  log('URL index cleared — will rebuild on next run.', 'warn');
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`\n  Instapage Unpublisher UI`);
  console.log(`  Open: http://localhost:${PORT}\n`);
});
