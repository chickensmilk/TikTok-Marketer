/**
 * Instapage GDP Workspace Creator
 *
 * Reads client website URLs from the Google Sheet, extracts business names,
 * creates Instapage workspaces named "[Business Name] (GDP)", adds web@ as
 * manager, and connects the client domain via Playwright.
 *
 * Usage:
 *   node create-workspaces.js           # Full run
 *   node create-workspaces.js --test    # First unprocessed row only
 */

const { chromium } = require('playwright');
const https = require('https');
const http = require('http');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1tuqHPmFIBXnu78KOatH6Sggocrf2qjuMTkQzS2zYBGk/export?format=csv&gid=0';

const API_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImFwaS0yMDI0In0.eyJwYXlsb2FkIjp7ImtleSI6IjcyNDY1MTk5Njc0MTQ1XzE3NzUxNjczMjEzODMifSwic3ViIjoiYXBpOjIzMDQyNDciLCJuYmYiOjE3NzUxNjczMjF9.FLcruH20k6YVzmjc1RwqIsyP_sxRgoImCmJ2hzinGL_vNzzibIcOkTvUJqbmOKUqQ2hD7ANu3PbIsOOB4WWlV2dldSr08aahjAyKzkwnFJE-vmHFcQKYTPcr_ev7ylarMYaCzGOGn6navn_JsCwYMnIcS5lgTBiWN_yN3KQMk8Qa1Yst9XpmGfaAcBM_kZGK0I2iVTT3UchXYSgnqAIkx7XwxA2foR_0N7ZbifqzlEC8cinF7zN8qnlEu9NUyuttriRbvOYIIb18M2xe252VxBkidTqd0iiVZDl4Mk9Bap1TSgyVi7Nsx1-PDjNyfbxBmGTFvcynfkaQl6MydkS4cQ';

const TEAM_MEMBERS = [
  { email: 'web@yourdigitalresource.com', accessLevel: 'manager' },
];

const PROGRESS_FILE = path.join(__dirname, 'progress.json');
const FAILED_FILE   = path.join(__dirname, 'failed.json');
const INSTAPAGE_LOGIN = 'https://app.instapage.com';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(msg) {
  console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
}

function prompt(question, hidden = false) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    if (hidden) {
      rl.stdoutMuted = true;
      rl._writeToOutput = s => { if (!rl.stdoutMuted) rl.output.write(s); };
    }
    rl.question(question, answer => {
      if (hidden) process.stdout.write('\n');
      rl.close();
      resolve(answer);
    });
  });
}

function fetchUrl(url, options = {}, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects === 0) return reject(new Error('Too many redirects'));
    const lib = url.startsWith('https') ? https : http;
    const reqOptions = { ...options };
    reqOptions.headers = reqOptions.headers || {};
    reqOptions.headers['User-Agent'] = 'Mozilla/5.0 (compatible; bot/1.0)';

    lib.get(url, reqOptions, res => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.resume();
        return fetchUrl(res.headers.location, options, maxRedirects - 1).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    }).on('error', reject);
  });
}

function apiRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.instapage.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Accept': 'application/json',
        ...(postData ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) } : {}),
      },
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null }));
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function parseCSV(text) {
  const rows = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const fields = [];
    let cur = '', inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { fields.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    fields.push(cur.trim());
    rows.push(fields);
  }
  return rows;
}

function loadJSON(file, fallback) {
  try { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback; }
  catch { return fallback; }
}

function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function stripDomain(url) {
  // https://www.example.com/ → example.com
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').split('/')[0];
}

// ─── Extract Business Name from Website ───────────────────────────────────────

async function extractBusinessName(siteUrl) {
  try {
    const { body } = await fetchUrl(siteUrl);

    // Try og:site_name first (most reliable)
    let match = body.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i)
                || body.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i);
    if (match) return match[1].trim();

    // Try <title> tag — strip common suffixes
    match = body.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (match) {
      return match[1]
        .replace(/\s*[|\-–—:,]\s*.*/g, '') // strip "| tagline" or "- City, ST"
        .trim();
    }

    // Try h1
    match = body.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (match) return match[1].trim();

  } catch (err) {
    log(`  Warning: could not fetch ${siteUrl} — ${err.message}`);
  }
  return null;
}

// ─── Instapage API ────────────────────────────────────────────────────────────

async function createWorkspace(name) {
  const res = await apiRequest('POST', '/v1/workspaces', { name });
  if (res.status !== 201) throw new Error(`Create workspace failed (${res.status}): ${JSON.stringify(res.body)}`);
  return res.body.data.workspaceId;
}

async function addTeamMembers(workspaceId) {
  const res = await apiRequest('POST', `/v1/workspaces/${workspaceId}/team-members`, TEAM_MEMBERS);
  if (res.status !== 201) throw new Error(`Add team members failed (${res.status}): ${JSON.stringify(res.body)}`);
}

async function workspaceExists(name) {
  // Check both pages of workspaces for a name match
  for (let page = 1; page <= 3; page++) {
    const res = await apiRequest('GET', `/v1/workspaces?page=${page}`);
    if (res.status !== 200) break;
    const match = res.body.data.find(w => w.workspaceName === name);
    if (match) return match.workspaceId;
    if (page >= res.body.meta.pagination.totalPagesCount) break;
  }
  return null;
}

// ─── Playwright: Connect Domain ───────────────────────────────────────────────

async function login(page, email, password) {
  log('Logging in to Instapage...');
  await page.goto(INSTAPAGE_LOGIN, { waitUntil: 'networkidle' });

  // Screenshot to see what page actually loaded
  await page.screenshot({ path: path.join(__dirname, 'debug-login-page.png') });
  log(`Login page URL: ${page.url()}`);

  // Wait for any text input — broad selector to catch whatever auth form is present
  await page.waitForSelector('input[type="email"], input[type="text"], input[name="email"]', { timeout: 30000 });

  await page.fill('input[type="email"], input[type="text"], input[name="email"]', email);
  await page.waitForSelector('input[type="password"], input[name="password"]', { timeout: 10000 });
  await page.fill('input[type="password"], input[name="password"]', password);
  await page.click('button[type="submit"], input[type="submit"], button:has-text("Log in"), button:has-text("Sign in"), button:has-text("Continue")');

  // url param in waitForURL is a URL object — use .href
  await page.waitForURL(
    url => !url.href.includes('/login') && !url.href.includes('/sign_in') && !url.href.includes('/auth'),
    { timeout: 30000 }
  );
  log('Logged in.');
}

async function switchToWorkspace(page, workspaceName) {
  log(`  Switching to "${workspaceName}"...`);
  const switcherSelectors = [
    '[data-testid="workspace-switcher"]', '[class*="WorkspaceSwitcher"]',
    '[class*="workspace-switcher"]', '[class*="account-name"]', 'header button',
  ];
  for (const sel of switcherSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 })) { await el.click(); break; }
    } catch { /* try next */ }
  }
  await page.waitForTimeout(600);
  for (const sel of ['input[placeholder*="search" i]', 'input[type="search"]', '[role="combobox"] input']) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 })) { await el.fill(workspaceName); break; }
    } catch { /* try next */ }
  }
  await page.waitForTimeout(600);
  try {
    await page.click(`text="${workspaceName}"`, { timeout: 5000 });
  } catch {
    await page.locator(`[role="option"]:has-text("${workspaceName}")`).first().click();
  }
  await page.waitForLoadState('networkidle');
}

async function connectDomainPlaywright(page, workspaceName, workspaceId, domain) {
  log(`  Connecting domain "${domain}" via browser...`);
  await switchToWorkspace(page, workspaceName);

  // Try direct URLs to domain settings
  const urls = [
    `https://app.instapage.com/workspaces/${workspaceId}/domains`,
    `https://app.instapage.com/workspaces/${workspaceId}/settings/domains`,
    `https://app.instapage.com/workspaces/${workspaceId}/settings`,
  ];
  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      if (!page.url().includes('/login')) break;
    } catch { /* try next */ }
  }

  // Click Domains nav link if not already there
  try {
    const domainsLink = page.locator('a:has-text("Domains"), text="Domains"').first();
    if (await domainsLink.isVisible({ timeout: 3000 })) {
      await domainsLink.click();
      await page.waitForLoadState('networkidle');
    }
  } catch { /* already on domains */ }

  // Click Add/Connect Domain button
  const addSelectors = [
    'button:has-text("Connect Domain")', 'button:has-text("Add Domain")',
    'button:has-text("Connect a domain")', 'a:has-text("Connect Domain")',
    '[data-testid*="add-domain"]', '[data-testid*="connect-domain"]',
  ];
  let addClicked = false;
  for (const sel of addSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 3000 })) { await el.click(); addClicked = true; break; }
    } catch { /* try next */ }
  }
  if (!addClicked) throw new Error('Could not find "Add/Connect Domain" button.');

  await page.waitForTimeout(1000);

  // Type the domain
  const inputSelectors = [
    'input[placeholder*="domain" i]', 'input[placeholder*="example.com" i]',
    'input[type="text"]', 'input[type="url"]',
  ];
  let typed = false;
  for (const sel of inputSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 3000 })) { await el.fill(domain); typed = true; break; }
    } catch { /* try next */ }
  }
  if (!typed) throw new Error('Could not find domain input field.');

  // Save
  const saveSelectors = [
    'button:has-text("Save")', 'button:has-text("Connect")',
    'button:has-text("Add")', 'button:has-text("Confirm")', 'button[type="submit"]',
  ];
  for (const sel of saveSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 3000 })) { await el.click(); break; }
    } catch { /* try next */ }
  }

  await page.waitForTimeout(2000);
  log(`  Domain "${domain}" connected.`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const testMode = process.argv.includes('--test');

  console.log('='.repeat(60));
  console.log(testMode ? ' GDP Workspace Creator — TEST MODE (1 row)' : ' GDP Workspace Creator');
  console.log('='.repeat(60));

  // 1. Fetch sheet
  log('Fetching Google Sheet...');
  const { body: csv } = await fetchUrl(SHEET_CSV_URL);
  const rows = parseCSV(csv);
  const header = rows[0];
  const data = rows.slice(1).filter(r => r[0]); // skip empty rows, Col A = domain URL

  // 2. Load progress
  const progress = loadJSON(PROGRESS_FILE, { completed: [] });
  const failed   = loadJSON(FAILED_FILE, []);
  const remaining = data.filter(r => !progress.completed.includes(r[0]));

  log(`Total rows: ${data.length} | Completed: ${progress.completed.length} | Remaining: ${remaining.length}`);

  const queue = testMode ? remaining.slice(0, 1) : remaining;
  if (!queue.length) { console.log('\nAll rows processed. Done!'); return; }

  // 3. Prompt for credentials
  console.log('');
  const email    = await prompt('Instapage email: ');
  const password = await prompt('Instapage password: ', true);
  console.log('');

  // 4. Launch browser
  const browser  = await chromium.launch({ headless: false, slowMo: 200 });
  const context  = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page     = await context.newPage();

  try {
    await login(page, email, password);

    for (let i = 0; i < queue.length; i++) {
      const row       = queue[i];
      const siteUrl   = row[0];
      const domain    = stripDomain(siteUrl);

      console.log('');
      log(`[${i + 1}/${queue.length}] ${siteUrl}`);

      try {
        // Extract business name from website
        log('  Extracting business name...');
        const bizName = await extractBusinessName(siteUrl);
        if (!bizName) throw new Error('Could not extract business name from website.');
        const workspaceName = `${bizName} (GDP)`;
        log(`  Business name: "${bizName}" → workspace: "${workspaceName}"`);

        // Check if workspace already exists
        let workspaceId = await workspaceExists(workspaceName);
        if (workspaceId) {
          log(`  Workspace already exists (ID: ${workspaceId}) — skipping creation.`);
        } else {
          log('  Creating workspace...');
          workspaceId = await createWorkspace(workspaceName);
          log(`  Workspace created (ID: ${workspaceId}).`);

          log('  Adding team members...');
          await addTeamMembers(workspaceId);
          log('  Team members added.');
        }

        // Connect domain via Playwright
        await connectDomainPlaywright(page, workspaceName, workspaceId, domain);

        log(`  ✓ DONE`);
        progress.completed.push(siteUrl);
        saveJSON(PROGRESS_FILE, progress);

      } catch (err) {
        log(`  ✗ FAILED: ${err.message}`);
        failed.push({ url: siteUrl, error: err.message, timestamp: new Date().toISOString() });
        saveJSON(FAILED_FILE, failed);
      }
    }

  } finally {
    await browser.close();
  }

  console.log('');
  console.log('='.repeat(60));
  console.log(` Done! Completed: ${progress.completed.length} | Failed: ${failed.length}`);
  if (failed.length) console.log(`  Failed entries saved to: ${FAILED_FILE}`);
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});
