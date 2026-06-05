/**
 * Instapage Bulk Publisher — API-based Web UI Server
 * Run: node publish-server.js  →  open http://localhost:3334/publish.html
 */

const express = require('express');
const path    = require('path');
const https   = require('https');
const http    = require('http');
const fs      = require('fs');

const app  = express();
const PORT = 3334;

// ─── Config ────────────────────────────────────────────────────────────────────
const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1HZKlucyNgJrgCA55e4tZfUyLhMnHYpkzqMb1kCFSNC4/export?format=csv&gid=0';
const INSTAPAGE_API          = 'api.instapage.com';
const UNPUBLISH_PROGRESS_FILE = path.join(__dirname, 'progress.json');
const PROGRESS_FILE           = path.join(__dirname, 'publish-progress.json');
const FAILED_FILE             = path.join(__dirname, 'publish-failed.json');
const URL_INDEX_FILE          = path.join(__dirname, 'url-index.json');

// ─── State ─────────────────────────────────────────────────────────────────────
let state = { status: 'idle', total: 0, completed: 0, failed: 0, remaining: 0, current: null };
let sseClients     = [];
let pauseRequested = false;
let stopRequested  = false;

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
const sleep = ms => new Promise(r => setTimeout(r, ms));

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

function parseCSV(csvText) {
  const rows = [];
  for (const line of csvText.split('\n')) {
    if (!line.trim()) continue;
    const fields = [];
    let current = '', inQuotes = false;
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

async function apiRequest(method, reqPath, token, body = null, retries = 5) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await new Promise((resolve, reject) => {
        const bodyStr = body ? JSON.stringify(body) : null;
        const options = {
          hostname: INSTAPAGE_API, path: reqPath, method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
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
            if (res.statusCode >= 400) return reject(new Error(`API error ${res.statusCode}: ${data}`));
            try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
          });
        });
        req.on('error', reject);
        if (bodyStr) req.write(bodyStr);
        req.end();
      });
      return result;
    } catch (err) {
      if (err.retryAfter && attempt < retries) {
        const wait = Math.min(err.retryAfter, 120) * 1000;
        log(`Rate limited — waiting ${Math.min(err.retryAfter, 120)}s before retry...`, 'warn');
        await sleep(wait);
        continue;
      }
      throw err;
    }
  }
}

async function apiGet(reqPath, token) { return apiRequest('GET', reqPath, token); }
async function apiPost(reqPath, token, body = {}) { return apiRequest('POST', reqPath, token, body); }

async function apiGetSafe(reqPath, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: INSTAPAGE_API, path: reqPath, method: 'GET',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        if (res.statusCode === 404) return resolve(null);
        if (res.statusCode === 429) {
          const retryAfter = parseInt(res.headers['retry-after'] || '60', 10);
          return reject(Object.assign(new Error('Rate limited'), { retryAfter }));
        }
        if (res.statusCode >= 400) return reject(new Error(`API error ${res.statusCode}: ${data}`));
        try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// Determine publication method from URL structure.
// We no longer pre-check the API for published status — that check produced
// false positives (API said "published" but the page wasn't actually live).
// Instead we always attempt the POST and handle the response.
function getPublicationMethod(rawUrl) {
  const labels = rawUrl.split('/')[0].split('.');
  if (rawUrl.includes('.instapage.io')) return 'instapage';
  return labels.length <= 2 ? 'wordPress' : 'customDomain';
}

function isAlreadyPublishedError(msg) {
  const m = msg.toLowerCase();
  return m.includes('already published') || m.includes('alreadypublished') ||
         m.includes('already live') || m.includes('already active');
}

// ─── Progress helpers ──────────────────────────────────────────────────────────
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

function loadUnpublishProgress() {
  try { return fs.existsSync(UNPUBLISH_PROGRESS_FILE) ? JSON.parse(fs.readFileSync(UNPUBLISH_PROGRESS_FILE, 'utf8')) : { completed: [] }; }
  catch { return { completed: [] }; }
}

function normalizeUrl(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase().trim();
}

// ─── Workspace/page indexing ──────────────────────────────────────────────────
async function getAllWorkspaces(token) {
  let workspaces = [], page = 1;
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

async function getAllPages(workspaceId, token) {
  let pages = [], page = 1;
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

// ─── Main job ──────────────────────────────────────────────────────────────────
async function runJob({ token, delaySeconds, selectedUrls }) {
  state.status = 'running';
  pauseRequested = false;
  stopRequested  = false;
  broadcast('state', state);

  const unpublishProgress = loadUnpublishProgress();
  const allUrls = unpublishProgress.completed || [];

  if (allUrls.length === 0) {
    log('No unpublished pages found in progress.json.', 'warn');
    state.status = 'done'; broadcast('state', state); return;
  }

  const progress = loadProgress();
  const failed   = loadFailed();

  let queue;
  if (selectedUrls && selectedUrls.length > 0) {
    queue = selectedUrls.filter(url => !progress.completed.includes(url));
    log(`Processing ${queue.length} selected page${queue.length !== 1 ? 's' : ''} — ${delaySeconds}s delay between each`);
  } else {
    queue = allUrls.filter(url => !progress.completed.includes(url));
    log(`Processing all ${queue.length} remaining pages — ${delaySeconds}s delay between each`);
  }

  state.total     = allUrls.length;
  state.completed = progress.completed.length;
  state.failed    = failed.length;
  state.remaining = queue.length;
  broadcast('state', state);

  if (queue.length === 0) {
    log('All selected pages are already published.', 'success');
    state.status = 'done'; broadcast('state', state); return;
  }

  // Build URL → {workspaceId, pageId} index
  let urlMap = {};
  if (fs.existsSync(URL_INDEX_FILE)) {
    urlMap = JSON.parse(fs.readFileSync(URL_INDEX_FILE, 'utf8'));
    log(`Loaded URL index from cache (${Object.keys(urlMap).length} pages)`, 'success');
  } else {
    log('Building URL index across all workspaces (one-time, will be cached)...');
    let workspaces, wsAttempt = 0;
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
        const wait = 60 * wsAttempt;
        log(`Rate limited — waiting ${wait}s (attempt ${wsAttempt}/3)...`, 'warn');
        await sleep(wait * 1000);
      }
    }
    for (const ws of workspaces) {
      const wsId = ws.id || ws.workspaceId;
      try {
        const pages = await getAllPages(wsId, token);
        for (const p of pages) {
          const urls = [p.url, p.pageUrl, p.slug, ...(p.urls || []), p.published_url, p.publishedUrl].filter(Boolean);
          for (const u of urls) urlMap[normalizeUrl(u)] = { workspaceId: wsId, pageId: p.id || p.pageId };
        }
        await sleep(300);
      } catch { /* skip inaccessible workspaces */ }
    }
    fs.writeFileSync(URL_INDEX_FILE, JSON.stringify(urlMap, null, 2));
    log(`Indexed ${Object.keys(urlMap).length} pages — saved to cache`, 'success');
  }

  // Process each page
  for (let i = 0; i < queue.length; i++) {
    if (stopRequested) { log('Stopped by user.', 'warn'); break; }
    while (pauseRequested && !stopRequested) {
      if (state.status !== 'paused') { state.status = 'paused'; broadcast('state', state); log('Paused.', 'warn'); }
      await new Promise(r => setTimeout(r, 500));
    }
    if (stopRequested) { log('Stopped by user.', 'warn'); break; }
    if (state.status === 'paused') { state.status = 'running'; broadcast('state', state); log('Resumed.'); }

    const rawUrl = queue[i];
    state.current = { url: rawUrl, index: i + 1, total: queue.length };
    broadcast('state', state);
    broadcast('page_status', { url: rawUrl, status: 'processing' });
    log(`[${i + 1}/${queue.length}] ${rawUrl}`);

    try {
      const entry = urlMap[normalizeUrl(rawUrl)];
      if (!entry) throw new Error(`URL not found in any workspace: ${rawUrl}`);

      const { workspaceId, pageId } = entry;
      const publicationMethod = getPublicationMethod(rawUrl);
      const publishBody = { publicationMethod, targetUrl: rawUrl };

      log(`  workspace: ${workspaceId}, page: ${pageId}`);
      log(`  Publishing via "${publicationMethod}"${publicationMethod !== 'wordPress' ? ` → ${rawUrl}` : ''}`);

      try {
        await apiPost(`/v1/workspaces/${workspaceId}/pages/${pageId}/publication`, token, publishBody);
        log(`  ✓ Published`, 'success');
      } catch (postErr) {
        if (isAlreadyPublishedError(postErr.message)) {
          log(`  ✓ Already published`, 'success');
        } else {
          throw postErr;
        }
      }

      progress.completed.push(rawUrl);
      saveProgress(progress);
      broadcast('page_status', { url: rawUrl, status: 'published' });
      state.completed++;
      state.remaining--;
      state.current = null;
      broadcast('state', state);

      if (i < queue.length - 1) {
        log(`  Waiting ${delaySeconds}s...`);
        await sleep(delaySeconds * 1000);
      }

    } catch (err) {
      if (err.retryAfter) {
        log(`  Rate limited — waiting ${err.retryAfter}s...`, 'warn');
        await sleep(err.retryAfter * 1000);
        i--; continue;
      }
      log(`  ✗ Failed: ${err.message}`, 'error');
      failed.push({ url: rawUrl, error: err.message });
      saveFailed(failed);
      broadcast('page_status', { url: rawUrl, status: 'failed' });
      state.failed++;
      state.remaining--;
      state.current = null;
      broadcast('state', state);
    }
  }

  state.status = stopRequested ? 'idle' : 'done';
  state.current = null;
  broadcast('state', state);
  log(
    stopRequested ? 'Job stopped.' : `All done! ${progress.completed.length} published, ${failed.length} failed.`,
    stopRequested ? 'warn' : 'success'
  );
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

// Returns the full page list enriched with titles/client names from the sheet
app.get('/api/pages', async (req, res) => {
  try {
    const unpublishProgress = loadUnpublishProgress();
    const allUrls           = unpublishProgress.completed || [];
    const progress          = loadProgress();
    const failed            = loadFailed();
    const completedSet      = new Set(progress.completed);
    const failedSet         = new Set(failed.map(f => f.url));

    // Try to pull titles and client names from Google Sheet
    let sheetMeta = {};
    try {
      const csvText = await fetchWithRedirects(SHEET_CSV_URL);
      for (const row of parseCSV(csvText)) {
        const url = row[1];
        if (url && url.toLowerCase() !== 'url') {
          sheetMeta[normalizeUrl(url)] = { title: row[2] || '', clientName: row[3] || '' };
        }
      }
    } catch { /* proceed without sheet data */ }

    const pages = allUrls.map(url => {
      const meta   = sheetMeta[normalizeUrl(url)] || {};
      const status = completedSet.has(url) ? 'published' : failedSet.has(url) ? 'failed' : 'pending';
      return { url, title: meta.title || '', clientName: meta.clientName || '', status };
    });

    res.json(pages);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/status', (req, res) => {
  try {
    const allUrls  = loadUnpublishProgress().completed || [];
    const progress = loadProgress();
    const failed   = loadFailed();
    res.json({
      total: allUrls.length,
      completed: progress.completed.length,
      failed: failed.length,
      remaining: allUrls.filter(u => !progress.completed.includes(u)).length,
      status: state.status,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/failed', (req, res) => res.json(loadFailed()));

// Diagnostic: check the publication info for a specific page
// Usage: GET /api/probe?token=TOKEN&workspaceId=WS&pageId=PG
app.get('/api/probe', async (req, res) => {
  const { token, workspaceId, pageId } = req.query;
  if (!token || !workspaceId || !pageId) return res.status(400).json({ error: 'token, workspaceId, pageId required' });
  try {
    const info = await apiGetSafe(`/v1/workspaces/${workspaceId}/pages/${pageId}/publication`, token);
    res.json(info);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/start', async (req, res) => {
  if (state.status === 'running') return res.status(400).json({ error: 'Already running' });
  const { token, delaySeconds, selectedUrls } = req.body;
  if (!token) return res.status(400).json({ error: 'API token required' });
  res.json({ ok: true });
  runJob({
    token,
    delaySeconds: parseInt(delaySeconds) || 12,
    selectedUrls: Array.isArray(selectedUrls) && selectedUrls.length ? selectedUrls : null,
  }).catch(err => {
    log(`Fatal error: ${err.message}`, 'error');
    state.status = 'error'; broadcast('state', state);
  });
});

app.post('/api/pause',  (req, res) => {
  if (state.status !== 'running') return res.status(400).json({ error: 'Not running' });
  pauseRequested = true; res.json({ ok: true });
});
app.post('/api/resume', (req, res) => {
  if (state.status !== 'paused') return res.status(400).json({ error: 'Not paused' });
  pauseRequested = false; res.json({ ok: true });
});
app.post('/api/stop',   (req, res) => { stopRequested = true; pauseRequested = false; res.json({ ok: true }); });

app.post('/api/clear-progress', (req, res) => {
  if (state.status === 'running' || state.status === 'paused')
    return res.status(400).json({ error: 'Cannot clear while running' });
  if (fs.existsSync(PROGRESS_FILE)) fs.unlinkSync(PROGRESS_FILE);
  if (fs.existsSync(FAILED_FILE))   fs.unlinkSync(FAILED_FILE);
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
  console.log(`\n  Instapage Publisher UI`);
  console.log(`  Open: http://localhost:${PORT}/publish.html\n`);
});
