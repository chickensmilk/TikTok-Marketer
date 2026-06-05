---
name: project-bulkcamp
description: "BulkCamp — Richard's personal Basecamp bulk assignment manager app, deployed on Railway"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4e623475-be49-44dd-ac01-8b8fbc960d90
---

BulkCamp is a Next.js PWA that connects to Basecamp via OAuth and lets Richard manage assignments in bulk — ways Basecamp's native UI doesn't support.

**Why:** Basecamp has no native bulk due-date change or bulk complete. Richard needed a faster way to triage and reorganize assignments across projects.

**How to apply:** When Richard mentions BulkCamp, this is the app. Use the repo and URLs below as starting context.

## Key details
- **GitHub:** github.com/creativedigitalresource/BulkCamp
- **Live URL:** https://bulkcamp-production.up.railway.app
- **Deploy:** Railway, auto-deploys from GitHub main branch (Nixpacks builder, port $PORT)
- **Stack:** Next.js 16.2.4 (App Router), React 19, Tailwind 4, iron-session, TypeScript
- **Auth:** Basecamp OAuth via launchpad.37signals.com — redirect URI registered for both local (127.0.0.1:3000) and production

## Features built (as of 2026-05-15)
- Bulk change due date on selected assignments
- Bulk mark complete on selected assignments
- Basecamp-style UI: two-column date layout, flat items, orange todolist headers, cream + white card
- PWA manifest + home screen icon (BC Assignments)
- **Quick Notes** panel — textarea, auto-saves to localStorage
- **My Priorities Today** panel — star any assignment to pin it to the top, persists via localStorage
- **New assignments indicator** — snapshots seen IDs in localStorage; shows "New" section on next visit with per-item and bulk "mark as seen"

## Local dev
- Run from `/Users/richardvargas/basecamp-assignments/`
- `.env.local` has real Basecamp OAuth credentials
- Access via `http://127.0.0.1:3000` (not localhost — registered redirect URI uses 127.0.0.1)
