/**
 * Instapage Bulk Unpublisher
 *
 * Reads landing pages from a Google Sheet and unpublishes each one in Instapage.
 * Progress is saved to progress.json so the script can resume if interrupted.
 *
 * Usage: node unpublish.js
 */

const { chromium } = require('playwright');
const https = require('https');
const http = require('http');
const readline = require('readline');
const fs = require('fs');

// ─── Config ────────────────────────────────────────────────────────────────────
const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1HZKlucyNgJrgCA55e4tZfUyLhMnHYpkzqMb1kCFSNC4/export?format=csv&gid=0';
const PROGRESS_FILE = 'progress.json';
const INSTAPAGE_LOGIN = 'https://app.instapage.com/login';
const FAILED_FILE = 'failed.json';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function prompt(question, hidden = false) {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    if (hidden) {
      // Mask password input
      rl.stdoutMuted = true;
      rl._writeToOutput = s => {
        if (rl.stdoutMuted) rl.output.write('');
        else rl.output.write(s);
      };
    }
    rl.question(question, answer => {
      if (hidden) process.stdout.write('\n');
      rl.close();
      resolve(answer);
    });
  });
}

function fetchWithRedirects(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects === 0) return reject(new Error('Too many redirects'));
    const lib = url.startsWith('https') ? https : http;
    lib
      .get(url, res => {
        const { statusCode, headers } = res;
        if ([301, 302, 307, 308].includes(statusCode) && headers.location) {
          res.resume();
          return fetchWithRedirects(headers.location, maxRedirects - 1)
            .then(resolve)
            .catch(reject);
        }
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

function parseCSV(csvText) {
  const rows = [];
  const lines = csvText.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());
    rows.push(fields);
  }
  return rows;
}

function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    } catch {
      return { completed: [] };
    }
  }
  return { completed: [] };
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function loadFailed() {
  if (fs.existsSync(FAILED_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(FAILED_FILE, 'utf8'));
    } catch {
      return [];
    }
  }
  return [];
}

function saveFailed(failed) {
  fs.writeFileSync(FAILED_FILE, JSON.stringify(failed, null, 2));
}

function log(msg) {
  const ts = new Date().toLocaleTimeString();
  console.log(`[${ts}] ${msg}`);
}

// ─── Instapage Actions ─────────────────────────────────────────────────────────

async function login(page, email, password) {
  log('Navigating to login page...');
  await page.goto(INSTAPAGE_LOGIN, { waitUntil: 'networkidle' });

  await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', email);
  await page.fill(
    'input[type="password"], input[name="password"], input[placeholder*="password" i]',
    password
  );
  await page.click(
    'button[type="submit"], input[type="submit"], button:has-text("Log in"), button:has-text("Sign in")'
  );

  // Wait for redirect away from login page
  await page.waitForURL(url => !url.includes('/login'), { timeout: 30000 });
  log('Login successful.');
}

async function switchToClient(page, clientName) {
  log(`  Switching to client workspace: "${clientName}"`);

  // Click the workspace / account switcher in the top-left
  const switcherSelectors = [
    '[data-testid="workspace-switcher"]',
    '[data-testid="account-switcher"]',
    '[class*="WorkspaceSwitcher"]',
    '[class*="workspace-switcher"]',
    '[class*="account-name"]',
    '[class*="AccountName"]',
    'button[class*="workspace"]',
    // Fallback: find a button near the top-left that contains text
    'header button',
    '.sidebar button',
    'nav button:first-child',
  ];

  let clicked = false;
  for (const sel of switcherSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 })) {
        await el.click();
        clicked = true;
        break;
      }
    } catch {
      // try next selector
    }
  }

  if (!clicked) {
    throw new Error('Could not find workspace switcher — selector may have changed.');
  }

  await page.waitForTimeout(600);

  // Type client name in the search box that appears
  const searchSelectors = [
    'input[placeholder*="search" i]',
    'input[placeholder*="filter" i]',
    'input[type="search"]',
    '[role="combobox"] input',
    '[role="listbox"] input',
  ];

  for (const sel of searchSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 })) {
        await el.fill(clientName);
        break;
      }
    } catch {
      // try next
    }
  }

  await page.waitForTimeout(600);

  // Click the matching result (exact or partial match)
  try {
    await page.click(`text="${clientName}"`, { timeout: 5000 });
  } catch {
    // Try partial match
    const option = page.locator(`[role="option"]:has-text("${clientName}")`).first();
    if (await option.isVisible({ timeout: 3000 })) {
      await option.click();
    } else {
      throw new Error(`Client "${clientName}" not found in workspace switcher dropdown.`);
    }
  }

  await page.waitForLoadState('networkidle');
  log(`  Switched to: "${clientName}"`);
}

async function findAndOpenPage(page, url) {
  log(`  Searching for page: ${url}`);

  // Search for the URL in the pages dashboard
  const searchSelectors = [
    'input[placeholder*="search" i]',
    'input[placeholder*="Search" i]',
    'input[type="search"]',
    '[data-testid="search-input"]',
    '[class*="search"] input',
  ];

  for (const sel of searchSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 3000 })) {
        await el.clear();
        await el.fill(url);
        break;
      }
    } catch {
      // try next
    }
  }

  await page.waitForTimeout(1000);

  // Find the card that shows this URL, then click the bold title above it
  // Instapage shows: [Bold Title] on top, [URL] beneath it in a card
  try {
    // Find the element containing the URL text
    const urlEl = page.locator(`text="${url}"`).first();
    await urlEl.waitFor({ timeout: 10000 });

    // The clickable title is typically a sibling or parent element
    // Try going up to the card container and finding the title link
    const card = urlEl.locator('xpath=ancestor::*[contains(@class,"page") or contains(@class,"card") or contains(@class,"item")][1]');
    const titleLink = card.locator('a, h1, h2, h3, h4, strong, [class*="title"], [class*="name"]').first();

    if (await titleLink.isVisible({ timeout: 3000 })) {
      await titleLink.click();
    } else {
      // Fallback: click directly on the URL text area
      await urlEl.click();
    }
  } catch {
    throw new Error(`Page with URL "${url}" not found in this workspace.`);
  }

  // Wait for the flyout / side panel to open
  await page.waitForTimeout(1000);
  log(`  Page flyout opened.`);
}

async function unpublishPage(page) {
  // Scroll down in the flyout to find "URL Settings"
  const flyoutSelectors = [
    '[class*="flyout"]',
    '[class*="sidebar"]',
    '[class*="panel"]',
    '[role="dialog"]',
    '[class*="drawer"]',
  ];

  for (const sel of flyoutSelectors) {
    try {
      const flyout = page.locator(sel).last();
      if (await flyout.isVisible({ timeout: 2000 })) {
        await flyout.evaluate(el => el.scrollTo(0, el.scrollHeight));
        break;
      }
    } catch {
      // try next
    }
  }

  await page.waitForTimeout(500);

  // Click "URL Settings"
  try {
    await page.click('text="URL Settings"', { timeout: 5000 });
  } catch {
    throw new Error('"URL Settings" button not found in the flyout.');
  }

  await page.waitForTimeout(800);

  // Click "Unpublish"
  try {
    await page.click('button:has-text("Unpublish"), text="Unpublish"', { timeout: 5000 });
  } catch {
    throw new Error('"Unpublish" button not found.');
  }

  await page.waitForTimeout(800);

  // Click "Confirm" (or "Yes", "OK")
  try {
    await page.click(
      'button:has-text("Confirm"), button:has-text("Yes"), button:has-text("OK")',
      { timeout: 5000 }
    );
  } catch {
    throw new Error('"Confirm" button not found.');
  }

  await page.waitForTimeout(1000);
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const testMode = process.argv.includes('--test');

  console.log('='.repeat(60));
  console.log(testMode ? ' Instapage Unpublisher — TEST MODE (1 page)' : ' Instapage Bulk Unpublisher');
  console.log('='.repeat(60));

  // 1. Fetch and parse the Google Sheet
  log('Fetching Google Sheet...');
  let csvText;
  try {
    csvText = await fetchWithRedirects(SHEET_CSV_URL);
  } catch (err) {
    console.error('Failed to fetch Google Sheet:', err.message);
    process.exit(1);
  }

  const rows = parseCSV(csvText);
  // Col A=0 (TRUE/FALSE), Col B=1 (URL), Col C=2 (Title), Col D=3 (Client name)
  const toProcess = rows.filter(
    row =>
      row[0] &&
      row[0].toUpperCase() === 'FALSE' &&
      row[1] &&
      row[3]
  );

  log(`Total pages to unpublish: ${toProcess.length}`);

  // 2. Load progress and filter already-completed
  const progress = loadProgress();
  const failed = loadFailed();
  const remaining = toProcess.filter(row => !progress.completed.includes(row[1]));

  log(`Already completed: ${progress.completed.length}`);
  log(`Remaining: ${remaining.length}`);

  // In test mode, only process the first page
  const queue = testMode ? remaining.slice(0, 1) : remaining;
  if (testMode) log(`TEST MODE: will only process 1 page → ${queue[0]?.[1]}`);

  if (remaining.length === 0) {
    console.log('\nAll pages have already been processed. Done!');
    return;
  }

  // 3. Prompt for credentials
  console.log('');
  const email = await prompt('Instapage email: ');
  const password = await prompt('Instapage password: ', true);
  console.log('');

  // 4. Launch browser (headed so you can watch / intervene)
  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();

  try {
    // 5. Login
    await login(page, email, password);

    let currentClient = null;

    // 6. Process each page
    for (let i = 0; i < queue.length; i++) {
      const row = queue[i];
      const pageUrl = row[1];
      const title = row[2];
      const clientName = row[3];

      console.log('');
      log(`[${i + 1}/${queue.length}] ${title}`);
      log(`  URL: ${pageUrl}`);
      log(`  Client: ${clientName}`);

      try {
        // Switch workspace only if client changed
        if (clientName !== currentClient) {
          await page.goto('https://app.instapage.com/dashboard2', { waitUntil: 'networkidle' });
          await switchToClient(page, clientName);
          currentClient = clientName;
        }

        await findAndOpenPage(page, pageUrl);
        await unpublishPage(page);

        log(`  ✓ UNPUBLISHED`);
        progress.completed.push(pageUrl);
        saveProgress(progress);

      } catch (err) {
        log(`  ✗ FAILED: ${err.message}`);
        failed.push({ url: pageUrl, title, clientName, error: err.message });
        saveFailed(failed);
        currentClient = null; // Reset so next iteration re-navigates
      }
    }

  } finally {
    await browser.close();
  }

  // 7. Summary
  console.log('');
  console.log('='.repeat(60));
  console.log(` Done!`);
  console.log(`  Completed: ${progress.completed.length}`);
  console.log(`  Failed:    ${failed.length}`);
  if (failed.length > 0) {
    console.log(`\n  Failed pages saved to: ${FAILED_FILE}`);
    console.log('  Review and re-run the script to retry them,');
    console.log('  or handle them manually.');
  }
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});
