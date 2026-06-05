---
name: email-signature-app
description: "Full project state for the DR Email Signature Manager — stack, files, deployment, design, and current status"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0079b4f4-e404-45c7-8c81-c0f15f436b76
---

## What It Is
An internal web app for Digital Resource (~90–100 employees) to manage and self-serve their email signatures. Admins manage a Master Template (company-wide settings) and individual employee records. Employees visit a personal URL to copy their signature.

## Live URLs
- **Production (Railway):** https://email-signature-app-production.up.railway.app/
- **Custom domain (pending full SSL):** https://signatures.yourdigitalresource.com
- **Local dev:** http://localhost:3000

## Project Location
- **Local files:** `/Users/richardvargas/claude-projects/Email Signature App/`
- **GitHub:** Connected to Railway for auto-deploy (push to main = auto-deploy)

## Stack
- Node.js + Express
- SQLite via `better-sqlite3`
- Multer for image uploads
- Vanilla JS frontend (no frameworks — keep it that way)
- Railway PaaS hosting with persistent volume at `/app/data`
- Volume covers both `signatures.db` and `uploads/` folder

## Key Files
| File | Purpose |
|------|---------|
| `server.js` | Express server, all API routes, DB setup, migration columns |
| `public/index.html` | Dashboard — employee list, master template card, admin auth |
| `public/edit.html` | Split-pane signature editor |
| `public/signature.html` | Employee-facing page to copy their signature |
| `public/sig-builder.js` | Shared signature HTML builder (used by all three pages) |
| `public/dr-logo.png` | DR dark mode logo (local file, uploaded to Railway) |
| `data/signatures.db` | SQLite database (on Railway persistent volume) |
| `data/uploads/` | Uploaded images (photos, banners, logos) |

## Database
- **Table: employees** — all employee fields including styling (name_font, label_color, etc.)
- **Table: settings** — company-wide master template settings + social icon rows (10 slots)
- Migration pattern: `ALTER TABLE ADD COLUMN` with try/catch for idempotency
- Admin password stored in settings table (key: `admin_password`)

## Auth
- In-memory session tokens (`adminSessions` Set in server.js)
- Token stored in `sessionStorage` on client as `adminToken`
- Passed via `x-admin-token` header on all admin requests

## Design System (DR Brand)
- **Font:** Inter Tight (Google Fonts) — weights 400/600/700/800
- **Colors:** Navy `#010F37`, Lime `#D5DE23`, Blue `#26A9E1`, Orange `#F6931E`, Gray `#404041`
- **Logo:** `/dr-logo.png` (local file) — DR dark mode logo with 4-square color strip built in. Clicking it always goes to `/`
- **Light mode default** with dark mode toggle (🌙/☀️), persists via `localStorage` key `dr-theme`
- **Primary CTA:** Lime pill buttons (`#D5DE23` bg, `#010F37` text, `border-radius: 999px`)
- **Cards:** White surface, lime top-border (`border-top: 3px solid #D5DE23`)
- **Table header:** Navy bg with white text
- **Toast:** Navy pill with lime left-border accent
- **Dark mode:** Navy grid texture background, dark surfaces (`#0c1840`)

## Railway Setup
- **Port:** 8080 (set via PORT env variable)
- **Volume:** `/app/data` — single volume covering DB + uploads
- **Custom domain:** `signatures.yourdigitalresource.com`
  - CNAME: `signatures` → (Railway-assigned value, currently working — do NOT change)
  - TXT: `_railway-verify.signatures` → railway-verify token
- **Plan:** Free trial ($5 credit, ~20 days) — needs upgrade to Hobby ($5/month) before trial expires or app goes offline

## Migration History
- Originally hosted on Hostinger VPS at `76.13.127.140:3001` (Docker/docker-compose)
- Migrated to Railway via temporary HTTP endpoint pattern
- Data: VPS → tar → scp to local Mac → curl upload to Railway endpoint → redeploy
- Uploads path moved from `./uploads` to `./data/uploads` to fit single Railway volume

## Current Status (as of 2026-05-15)
- ✅ App live on Railway at production URL
- ✅ DR brand redesign deployed (index, edit, signature pages)
- ✅ New DR dark mode logo in use
- ✅ Custom domain `signatures.yourdigitalresource.com` live with SSL — do NOT change DNS records
- ✅ Railway upgraded to Hobby plan ($5/month) — app stays online
- 💡 Feature discussed but NOT yet built: admin "Send All" button to email every employee their copy link via Nodemailer

## Comparison vs NewOldStamp (90-sig plan)
- NewOldStamp 90-signature plan: $1,439/month ($17,268/year)
- This app: $5/month on Railway
- Annual savings: ~$17,208
- Key differentiator: employees self-serve via web app URL — no admin distribution bottleneck
- NewOldStamp advantage: can auto-push signatures into Gmail/Outlook via Google Workspace / M365 integration

## Admin Notes
- Admin password is stored in the DB settings table
- To change password: log in as admin → (no UI yet for this — would need direct DB edit or new feature)
- `node_modules/better-sqlite3` must be rebuilt if Node.js version changes: `npm rebuild better-sqlite3`
