---
name: LeftClick Project
description: Landing page build and Hostinger deployment for theleftclick.com
type: project
---

# LeftClick Project

Repository for simple AI and automation tools. Landing page built and deployed to theleftclick.com.

**Why:** Richard wants a central hub for practical AI/automation guides built from real workflows.

**How to apply:** When adding new tools, add a card to the tools grid in `/Users/richardvargas/LeftClick/index.html` and drop the HTML file in `/Users/richardvargas/LeftClick/tools/`.

## Files
- `/Users/richardvargas/LeftClick/index.html` — main landing page
- `/Users/richardvargas/LeftClick/leftclick-logo.png` — actual logo file (copied from Downloads/google-workspace-logo.png)
- `/Users/richardvargas/LeftClick/tools/basecamp-install.html` — first tool page

## Branding
- Primary color: `#3B72B8` (from logo)
- Style: Apple.com inspired (SF Pro fonts, frosted nav, pill buttons, large type, generous whitespace)
- Logo: real PNG image at `leftclick-logo.png`, height 53px in nav, 45px in footer

## GitHub
- Repo: https://github.com/chickensmilk/theleftclick.git
- Branch: main
- GitHub username: chickensmilk

## Hosting
- Host: Hostinger
- Domain: theleftclick.com
- Deploy method: Git (hPanel → Advanced → GIT)
- public_html contains: index.html, leftclick-logo.png, tools/basecamp-install.html
- Nameservers updated 2026-04-01 — DNS propagation in progress (up to 24hrs)

## First Tool
- Basecamp CLI Install — sourced from `/Users/richardvargas/Documents/Claude/Projects/Basecamp CLI Install/basecamp-install.html`

## Deploy Workflow (future updates)
1. Edit files in `/Users/richardvargas/LeftClick/`
2. `git -C /Users/richardvargas/LeftClick add . && git commit -m "message" && git push`
3. Go to hPanel → Advanced → GIT → Deploy
