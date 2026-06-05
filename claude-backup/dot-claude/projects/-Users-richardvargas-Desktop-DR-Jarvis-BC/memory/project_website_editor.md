---
name: Website Editor Feature — Next to Build
description: User wants a visual website editor inside the DR CMS admin. Agreed on starting with basic editor (click-to-edit text + image upload + live preview).
type: project
---

## Next Feature: Visual Website Editor at `/admin/editor`

User wants to build a website editor as part of the DR CMS (`~/Desktop/dr-cms`).

**Why:** Clients need to edit homepage content visually without touching Figma or code.

**Agreed approach:** Start with the basic editor (covers 90% of client needs):
- Click-to-edit text (hero heading, about text, phone, address, etc.)
- Live preview of changes before saving
- Image upload for hero background + doctor photos (Supabase Storage already set up)

**Deferred for later:**
- Section reordering (drag sections)
- Color/font controls
- Full block editor (add/remove sections)

**How to apply:** When user says "pick back up" or "continue the CMS", start here. The settings infrastructure is already in place (`/admin/settings` + `/api/settings`). The editor is essentially a live-preview wrapper around those settings.

## Current CMS Status (as of 2026-03-30)

- Full Next.js + Supabase CMS is built and running at `~/Desktop/dr-cms`
- `npm run dev` → `http://localhost:3000`
- Admin panel at `http://localhost:3000/admin`
- Blog, settings, and API routes all working
- Hero image uploaded to Supabase Storage: `https://dyghitxvwjnxjdjybtvz.supabase.co/storage/v1/object/public/images/hero-background.png`
- Homepage pushed to Figma: `https://www.figma.com/design/vYxTM0ulM0TX4lloW9gGI7/Wolfe-Dental-Spa-—-Homepage`
- Figma design changes from that session already implemented in code (navbar gold phone, hero rounded corner, services centered, CTA white bg, footer gold phone)
- Supabase project ID: `dyghitxvwjnxjdjybtvz`
