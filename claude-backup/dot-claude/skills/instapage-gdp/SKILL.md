# Instapage GDP Workspace Creator

Creates Instapage workspaces for clients in the GDP Google Sheet — extracts the business name from each client's website, creates the workspace as `[Business Name] (GDP)`, adds `web@yourdigitalresource.com` as manager, and connects the client domain via Playwright.

## When to use this skill

- User asks to create GDP workspaces in Instapage
- User asks to run the Instapage GDP script or add new client workspaces
- User says "add workspaces from the GDP sheet"

## Setup (one time)

```bash
cd ~/.claude/skills/instapage-gdp/scripts
npm install
npx playwright install chromium
```

## Run

```bash
# Test mode — processes only the first unprocessed row
cd ~/.claude/skills/instapage-gdp/scripts
node create-workspaces.js --test

# Full run — processes all remaining rows
node create-workspaces.js
```

Prompts for Instapage credentials (`creative@yourdigitalresource.com`).

## What it does per row

1. Fetches the client website (Column A of sheet) → extracts business name from `og:site_name` or `<title>`
2. Creates workspace via API: `POST /v1/workspaces` → `[Business Name] (GDP)`
3. Adds `web@yourdigitalresource.com` as manager via API
4. Connects the client domain via Playwright browser automation

## Config

| Setting | Value |
|---------|-------|
| Google Sheet | `1tuqHPmFIBXnu78KOatH6Sggocrf2qjuMTkQzS2zYBGk` |
| Team members added | `web@yourdigitalresource.com` (manager) |
| Workspace suffix | `(GDP)` |
| API token location | Hardcoded in `scripts/create-workspaces.js` |

## Resume after interruption

Re-run the script — completed rows are tracked in `scripts/progress.json` and skipped automatically.

## Failed rows

Saved to `scripts/failed.json` with error messages. Fix the issue and re-run to retry.

## Updating the API token

When the token expires, replace the `API_TOKEN` value at the top of `scripts/create-workspaces.js`.
