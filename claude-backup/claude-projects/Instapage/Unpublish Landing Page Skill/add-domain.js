/**
 * Instapage Domain Connector
 *
 * Logs into Instapage, switches to a given workspace, and connects a custom domain.
 *
 * Usage:
 *   node add-domain.js
 *
 * Hardcoded for test: workspace "A Dental Center (GDP)", domain "adentalcenterinriverview.com"
 */

const { chromium } = require('playwright');
const readline = require('readline');

// ─── Config ───────────────────────────────────────────────────────────────────
const WORKSPACE_NAME = 'A Dental Center (GDP)';
const WORKSPACE_ID   = 4478602;
const DOMAIN         = 'adentalcenterinriverview.com';
const INSTAPAGE_LOGIN = 'https://app.instapage.com/login';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function log(msg) {
  console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
}

// ─── Instapage Actions ────────────────────────────────────────────────────────

async function login(page, email, password) {
  log('Navigating to login...');
  await page.goto(INSTAPAGE_LOGIN, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', email);
  await page.fill('input[type="password"], input[name="password"], input[placeholder*="password" i]', password);
  await page.click('button[type="submit"], input[type="submit"], button:has-text("Log in"), button:has-text("Sign in")');
  await page.waitForURL(url => !url.includes('/login'), { timeout: 30000 });
  log('Login successful.');
}

async function switchToWorkspace(page) {
  log(`Switching to workspace: "${WORKSPACE_NAME}"...`);

  const switcherSelectors = [
    '[data-testid="workspace-switcher"]',
    '[data-testid="account-switcher"]',
    '[class*="WorkspaceSwitcher"]',
    '[class*="workspace-switcher"]',
    '[class*="account-name"]',
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
    } catch { /* try next */ }
  }
  if (!clicked) throw new Error('Could not find workspace switcher.');

  await page.waitForTimeout(600);

  // Type name in search box
  const searchSelectors = [
    'input[placeholder*="search" i]',
    'input[placeholder*="filter" i]',
    'input[type="search"]',
    '[role="combobox"] input',
  ];
  for (const sel of searchSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 })) {
        await el.fill(WORKSPACE_NAME);
        break;
      }
    } catch { /* try next */ }
  }

  await page.waitForTimeout(600);

  try {
    await page.click(`text="${WORKSPACE_NAME}"`, { timeout: 5000 });
  } catch {
    const option = page.locator(`[role="option"]:has-text("${WORKSPACE_NAME}")`).first();
    if (await option.isVisible({ timeout: 3000 })) {
      await option.click();
    } else {
      throw new Error(`Workspace "${WORKSPACE_NAME}" not found in switcher.`);
    }
  }

  await page.waitForLoadState('networkidle');
  log(`Switched to "${WORKSPACE_NAME}".`);
}

async function connectDomain(page) {
  log(`Navigating to workspace domains settings...`);

  // Try direct URL to workspace settings first
  const settingsUrls = [
    `https://app.instapage.com/workspaces/${WORKSPACE_ID}/domains`,
    `https://app.instapage.com/workspaces/${WORKSPACE_ID}/settings`,
    `https://app.instapage.com/workspaces/${WORKSPACE_ID}/settings/domains`,
  ];

  let landed = false;
  for (const url of settingsUrls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      const current = page.url();
      if (!current.includes('/login')) {
        log(`Landed on: ${current}`);
        landed = true;
        break;
      }
    } catch { /* try next */ }
  }

  if (!landed) {
    // Fall back: navigate via UI — look for Settings link
    log('Direct URL failed, trying UI navigation...');
    await page.goto(`https://app.instapage.com/dashboard2`, { waitUntil: 'networkidle' });
    await switchToWorkspace(page);

    const settingsSelectors = [
      'a[href*="settings"]',
      'a[href*="domains"]',
      '[data-testid="settings"]',
      'text="Settings"',
      'text="Domains"',
    ];
    for (const sel of settingsSelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 3000 })) {
          await el.click();
          await page.waitForLoadState('networkidle');
          break;
        }
      } catch { /* try next */ }
    }
  }

  await page.screenshot({ path: 'step1-settings-page.png' });
  log('Screenshot saved: step1-settings-page.png');

  // Look for a Domains section or link within settings
  const domainNavSelectors = [
    'a:has-text("Domains")',
    'text="Domains"',
    '[href*="domain"]',
    'li:has-text("Domain")',
  ];
  for (const sel of domainNavSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 3000 })) {
        await el.click();
        await page.waitForLoadState('networkidle');
        log('Navigated to Domains section.');
        break;
      }
    } catch { /* try next */ }
  }

  await page.screenshot({ path: 'step2-domains-section.png' });
  log('Screenshot saved: step2-domains-section.png');

  // Click "Connect Domain", "Add Domain", or similar button
  const addDomainSelectors = [
    'button:has-text("Connect Domain")',
    'button:has-text("Add Domain")',
    'button:has-text("Connect a domain")',
    'button:has-text("Add")',
    'a:has-text("Connect Domain")',
    '[data-testid*="add-domain"]',
    '[data-testid*="connect-domain"]',
  ];

  let addClicked = false;
  for (const sel of addDomainSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 3000 })) {
        await el.click();
        addClicked = true;
        log('Clicked "Add/Connect Domain" button.');
        break;
      }
    } catch { /* try next */ }
  }

  if (!addClicked) {
    await page.screenshot({ path: 'step2b-no-add-button.png' });
    throw new Error('Could not find "Connect Domain" / "Add Domain" button. See step2b-no-add-button.png');
  }

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'step3-add-domain-modal.png' });
  log('Screenshot saved: step3-add-domain-modal.png');

  // Type the domain into the input field
  const inputSelectors = [
    'input[placeholder*="domain" i]',
    'input[placeholder*="example.com" i]',
    'input[type="text"]',
    'input[type="url"]',
    '[data-testid*="domain-input"]',
  ];

  let typed = false;
  for (const sel of inputSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 3000 })) {
        await el.fill(DOMAIN);
        typed = true;
        log(`Typed domain: ${DOMAIN}`);
        break;
      }
    } catch { /* try next */ }
  }

  if (!typed) {
    await page.screenshot({ path: 'step3b-no-input.png' });
    throw new Error(`Could not find domain input field. See step3b-no-input.png`);
  }

  await page.screenshot({ path: 'step4-domain-typed.png' });
  log('Screenshot saved: step4-domain-typed.png');

  // Click Save / Connect / Submit
  const saveSelectors = [
    'button:has-text("Save")',
    'button:has-text("Connect")',
    'button:has-text("Add")',
    'button:has-text("Confirm")',
    'button[type="submit"]',
  ];

  let saved = false;
  for (const sel of saveSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 3000 })) {
        await el.click();
        saved = true;
        log('Clicked Save/Connect button.');
        break;
      }
    } catch { /* try next */ }
  }

  if (!saved) {
    throw new Error('Could not find Save/Connect button.');
  }

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'step5-after-save.png' });
  log('Screenshot saved: step5-after-save.png');
  log(`Domain "${DOMAIN}" submitted successfully.`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('='.repeat(60));
  console.log(` Instapage Domain Connector`);
  console.log(`  Workspace : ${WORKSPACE_NAME}`);
  console.log(`  Domain    : ${DOMAIN}`);
  console.log('='.repeat(60));

  const email    = await prompt('Instapage email: ');
  const password = await prompt('Instapage password: ', true);

  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page    = await context.newPage();

  try {
    await login(page, email, password);
    await page.goto('https://app.instapage.com/dashboard2', { waitUntil: 'networkidle' });
    await switchToWorkspace(page);
    await connectDomain(page);

    console.log('\n' + '='.repeat(60));
    console.log(` Done! Check the screenshots to confirm.`);
    console.log('='.repeat(60));
  } catch (err) {
    console.error(`\nFailed: ${err.message}`);
    await page.screenshot({ path: 'error.png' });
    console.error('Screenshot saved: error.png');
  } finally {
    console.log('\nBrowser will stay open for 30 seconds so you can inspect...');
    await page.waitForTimeout(30000);
    await browser.close();
  }
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
