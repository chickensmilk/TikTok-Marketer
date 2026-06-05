# Instapage Bulk Unpublisher

Reads landing pages from the Google Sheet and unpublishes each one in Instapage automatically.

## Setup (one time)

```bash
# From this folder:
npm install
npx playwright install chromium
```

## Run

```bash
node unpublish.js
```

You'll be prompted for your Instapage email and password. The browser will open visibly so you can watch.

## How it works

1. Fetches the Google Sheet CSV
2. Filters rows where Column A = FALSE (not yet unpublished)
3. Skips any already in `progress.json`
4. For each page: switches to the client workspace → searches for the URL → opens flyout → URL Settings → Unpublish → Confirm
5. Saves completed URLs to `progress.json` after each success

## Resume after interruption

Just re-run `node unpublish.js` — completed pages are skipped automatically.

## Failed pages

Any pages that fail are saved to `failed.json` with the error message. Re-run the script after fixing the issue, or handle them manually.

## Notes

- The Google Sheet checkbox (Column A) is **not** automatically updated — do that manually after confirming completion via `progress.json`.
- The browser runs in headed (visible) mode intentionally so you can intervene if needed.
