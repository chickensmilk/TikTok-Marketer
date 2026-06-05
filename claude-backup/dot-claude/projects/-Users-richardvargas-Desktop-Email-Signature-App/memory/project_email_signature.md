---
name: Email Signature App — Full Project State
description: Complete state of the email signature manager app — stack, features, deployment, decisions, and conversation history
type: project
---

# Email Signature App

**Local path:** `/Users/richardvargas/Desktop/Email Signature App`
**GitHub:** https://github.com/creativedigitalresource/email-signature-app
**Live URL:** `http://76.13.127.140:3001`
**VPS:** Hostinger VPS, Ubuntu 24.04, IP `76.13.127.140`, hostname `srv1334433`

**Why it exists:** Replace New Old Stamp (NOS) subscription. Manage 90+ employee email signatures in one place with a master template + per-employee overrides.

---

## Stack
- Node.js + Express
- SQLite via `better-sqlite3`
- Vanilla HTML/CSS/JS — no build tools, no frameworks
- Docker + docker-compose on VPS
- Multer for image uploads
- UUID for IDs and session tokens

**How to apply:** Keep it simple. No build tools. No frameworks. Vanilla JS only.

---

## Architecture

### Two-table database
- `employees` — per-employee data (name, title, photo, mobile, styling, banner override)
- `settings` — key/value store for master template (company name, phone, address, website, social icons, banner, logo, photo shape)

### Master template vs employee overrides
- Company-wide fields (phone, address, website, social icons, banner, logo) live in `settings`
- Employee-specific fields (name, title, photo, mobile, colors, typography, banner override) live in `employees`
- `buildSig(emp, settings, baseUrl)` in `sig-builder.js` merges both — employee values take priority where applicable

### Shared signature builder
- `public/sig-builder.js` — IIFE loaded by both `edit.html` and `signature.html`
- Exported as `window.buildSig` and `module.exports` for Node if needed

### Auth
- In-memory admin sessions: `const adminSessions = new Set()`
- Token: UUID stored in `sessionStorage` as `adminToken`
- Header: `x-admin-token`
- Password stored in `settings` table under key `admin_password` (default: `admin`)
- `requireAuth` middleware on PUT/POST/DELETE endpoints
- Regular users can view and copy signature links without logging in

### Image uploads
- Multer saves to `/uploads` directory (served statically)
- `/logo` endpoint proxies logo URL (stable URL — update once, all sigs update)
- `/btn-icons/:name` endpoint serves SVG icons (currently unused after Apps tab removal)
- `migrate-images.js` — one-time script to download external images to local `/uploads`

---

## Files

### `server.js`
- Express server, SQLite setup, migrations, all API routes
- `GET /api/employees`, `POST`, `PUT`, `DELETE`
- `GET /api/settings`, `PUT /api/settings`
- `POST /api/upload` (requireAuth)
- `GET /logo` — proxy redirect to logo URL
- `GET /icons/:platform` — SVG social icons (filled-circle, filled-square, outline, mono styles)
- Social icon brands: linkedin, facebook, instagram, youtube, pinterest, twitter, tiktok

### `public/sig-builder.js`
- `buildSig(emp, settings, baseUrl)` — builds full signature HTML
- Banner: prefers `emp.banner_url/link` over `settings.banner_url/link`
- Photo: fixed 147x147px with HTML width/height attributes (prevents Gmail mobile warp)
- Address: inserts U+200C (zero-width non-joiner) after street number to defeat Gmail iOS address auto-detection
- Outer table: `width:600px;max-width:100%` for responsive Gmail scaling
- Contact rows: two-column table, `word-break:break-word` on value cell

### `public/index.html`
- Dashboard: employee list + Master Template card
- Master Template: company info, photo shape toggle, 10 social icon slots, banner
- Auth: login modal, `isAdmin` flag, `.admin-only` elements hidden/shown
- `copyLink()` uses textarea fallback for HTTP (clipboard API requires HTTPS)
- `adminFetch()` helper adds `x-admin-token` header

### `public/edit.html`
- Split-pane editor: sidebar nav (Text/Style, Image), panel, preview
- Text/Style tab: User Details + Design sub-tabs
- Image tab: Photo section (upload + URL) + Banner override section (upload + URL + link URL)
- Banner override: if set, replaces master banner for this employee only; leave blank to use master
- `getData()` returns all employee fields including `banner_url` and `banner_link`

### `public/signature.html`
- Employee-facing page; `copySignature()` uses ClipboardItem for rich HTML copy with textarea fallback

### `docker-compose.yml`
```yaml
services:
  signature-app:
    build: .
    restart: always
    ports: ["3001:3000"]
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
```

### `migrate-images.js`
- Downloads all external images (employee photos, banner, social icons) to `/uploads`
- Already run successfully: 97 migrated, 0 failed

---

## Features Built (chronological)

1. Basic CRUD for employees + signature builder
2. Split-pane editor UI (NOS-style)
3. Master template architecture (settings table)
4. Social icons: 10 custom slots with icon URL + link URL + live preview
5. Photo shape control (circle/square) in master template
6. Admin password protection (login modal, session tokens)
7. Image upload (Multer) — photos, banners, social icons
8. VPS deployment via Docker + GitHub
9. Image migration script (external → local /uploads)
10. Gmail mobile fixes:
    - Address auto-detection: U+200C after street number
    - Photo warp: fixed 147x147 HTML attributes
    - Banner cutoff: max-width:100% on outer table
    - Address alignment: word-break:break-word
11. Per-employee banner override (Image tab) — replaces master banner per employee
12. ~~Apps tab with custom button~~ — REMOVED, replaced by banner override

---

## Deployment Process (VPS)

```bash
# On local machine — commit and push
git add . && git commit -m "message" && git push

# On VPS (SSH into srv1334433 / 76.13.127.140)
cd ~/signature-app && git pull && docker compose up -d --build
```

**Important:** The app is on the VPS with hostname `srv1334433` (IP: `76.13.127.140`). There is a second VPS (N8N server, different IP) — do NOT deploy there.

---

## Hosting Discussion (2026-03-25)

User is considering migrating from VPS to a managed PaaS for:
- Automatic security updates
- Managed backups
- No SSH/DevOps overhead

**Recommended: Railway** (railway.app — independent company)
- Auto-deploys from GitHub
- Persistent volumes (SQLite + uploads stay safe)
- Automatic SSL
- ~$5–10/mo

**V2 consideration:** If app becomes a SaaS offered to other companies, Railway becomes limiting. V2 would need:
- Multi-tenant architecture
- PostgreSQL (managed)
- Cloudflare R2 or AWS S3 for images
- Proper auth (Clerk/Auth0)
- AWS/GCP/DigitalOcean hosting

**Decision:** Don't over-engineer V1. Ship V1 on Railway, validate V2 idea, then rebuild V2 properly.
Migration to Railway not yet started as of 2026-03-27.

---

## Known Issues / Notes
- Admin password change: done via direct DB edit or add a UI (not yet built)
- No automated database backups set up yet
- `git config --global` shows auto-configured name/email — not an issue but can be cleaned up
- Copy link on HTTP uses `execCommand` fallback (works but deprecated)
