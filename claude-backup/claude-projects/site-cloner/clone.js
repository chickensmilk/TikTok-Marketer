const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const urlModule = require('url');

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const TARGET_URL = process.argv[2];
const OUTPUT_DIR = process.argv[3] || path.join(process.env.HOME, 'Desktop', 'cloned-site');
const DELAY_MS   = 1500; // polite delay between pages
const MAX_PAGES  = 200;  // safety cap
// ──────────────────────────────────────────────────────────────────────────────

if (!TARGET_URL) {
  console.error('\n  Usage: node clone.js <url> [output-folder]\n');
  console.error('  Example: node clone.js https://www.example.com ~/Desktop/my-site\n');
  process.exit(1);
}

const baseUrl    = new URL(TARGET_URL);
const baseDomain = baseUrl.hostname;
const visited    = new Set();
const queue      = [TARGET_URL];
const assets     = new Set();

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function sanitizePath(urlStr) {
  try {
    const u = new URL(urlStr);
    let filePath = u.pathname;
    if (filePath.endsWith('/')) filePath += 'index.html';
    if (!path.extname(filePath)) filePath += '/index.html';
    return path.join(OUTPUT_DIR, u.hostname, filePath);
  } catch {
    return null;
  }
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function downloadFile(urlStr) {
  return new Promise((resolve) => {
    const dest = sanitizePath(urlStr);
    if (!dest) return resolve();
    if (fs.existsSync(dest)) return resolve();
    ensureDir(dest);

    const protocol = urlStr.startsWith('https') ? https : http;
    const req = protocol.get(urlStr, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirect = res.headers.location;
        if (redirect) return downloadFile(redirect).then(resolve);
        return resolve();
      }
      if (res.statusCode !== 200) return resolve();

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', () => resolve());
    });
    req.on('error', () => resolve());
    req.setTimeout(15000, () => { req.destroy(); resolve(); });
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function isSameDomain(urlStr) {
  try {
    return new URL(urlStr).hostname === baseDomain;
  } catch {
    return false;
  }
}

function normalizeUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    u.hash = '';
    return u.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║         SITE CLONER — Playwright         ║');
  console.log('╚══════════════════════════════════════════╝\n');
  console.log(`  Target : ${TARGET_URL}`);
  console.log(`  Output : ${OUTPUT_DIR}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: false,          // visible browser — bypasses Cloudflare
    args: [
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
    ],
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
  });

  // Remove automation signals
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  const page = await context.newPage();

  // Intercept network — collect all asset URLs
  page.on('response', async (response) => {
    const url = response.url();
    const ct  = response.headers()['content-type'] || '';
    if (
      ct.includes('text/css') ||
      ct.includes('javascript') ||
      ct.includes('image/') ||
      ct.includes('font/') ||
      ct.includes('application/font') ||
      url.match(/\.(css|js|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot|ico)(\?|$)/i)
    ) {
      assets.add(url);
    }
  });

  let pageCount = 0;

  while (queue.length > 0 && pageCount < MAX_PAGES) {
    const currentUrl = queue.shift();
    const normalized = normalizeUrl(currentUrl);
    if (!normalized || visited.has(normalized)) continue;
    visited.add(normalized);
    pageCount++;

    console.log(`  [${pageCount}] Crawling: ${currentUrl}`);

    try {await page.goto(currentUrl, { waitUntil: 'domcontentloaded', timeout: 180000 });
await page.waitForTimeout(4000);      await page.goto(currentUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await sleep(DELAY_MS);

      // Save HTML
      const html      = await page.content();
      const savePath  = sanitizePath(currentUrl);
      if (savePath) {
        ensureDir(savePath);
        fs.writeFileSync(savePath, html, 'utf8');
        console.log(`     ✓ Saved HTML → ${savePath.replace(OUTPUT_DIR, '.')}`);
      }

      // Collect internal links
      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href]')).map(a => a.href)
      );

      for (const link of links) {
        const norm = normalizeUrl(link);
        if (norm && isSameDomain(norm) && !visited.has(norm) && !queue.includes(norm)) {
          queue.push(norm);
        }
      }

      // Collect assets from page
      const pageAssets = await page.evaluate(() => {
        const urls = [];
        document.querySelectorAll('img[src], source[src], img[data-src]').forEach(el => {
          if (el.src || el.dataset.src) urls.push(el.src || el.dataset.src);
        });
        document.querySelectorAll('link[rel="stylesheet"]').forEach(el => {
          if (el.href) urls.push(el.href);
        });
        document.querySelectorAll('script[src]').forEach(el => {
          if (el.src) urls.push(el.src);
        });
        return urls;
      });

      pageAssets.forEach(a => assets.add(a));

    } catch (err) {
      console.log(`     ✗ Failed: ${err.message}`);
    }
  }

  await page.close();

  // ─── DOWNLOAD ALL ASSETS ────────────────────────────────────────────────────
  console.log(`\n  Downloading ${assets.size} assets (CSS, images, fonts, JS)...\n`);

  let downloaded = 0;
  for (const assetUrl of assets) {
    try {
      await downloadFile(assetUrl);
      downloaded++;
      if (downloaded % 10 === 0) {
        process.stdout.write(`  Progress: ${downloaded}/${assets.size}\r`);
      }
    } catch {
      // silently skip failed assets
    }
  }

  await browser.close();

  // ─── SUMMARY ────────────────────────────────────────────────────────────────
  console.log(`\n\n╔══════════════════════════════════════════╗`);
  console.log(`║               COMPLETE ✓                 ║`);
  console.log(`╚══════════════════════════════════════════╝`);
  console.log(`\n  Pages crawled : ${pageCount}`);
  console.log(`  Assets saved  : ${downloaded}`);
  console.log(`  Output folder : ${OUTPUT_DIR}\n`);
  console.log(`  Open in Finder:`);
  console.log(`  open "${OUTPUT_DIR}"\n`);

})();
