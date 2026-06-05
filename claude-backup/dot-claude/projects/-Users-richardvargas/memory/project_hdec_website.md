---
name: project-hdec-website
description: "HDEC Homepage project — file location, GitHub repo, Netlify deployment, backup/revert mechanism, design system files"
metadata: 
  node_type: memory
  type: project
  originSessionId: 932f7823-e39d-46a7-be0b-e3699950553b
---

Holocaust Documentation & Education Center homepage — single self-contained HTML file built with React 18 via CDN + Babel Standalone.

**Files:**
- `/Users/richardvargas/hdec-website/index.html` — main deliverable (~1.3MB)
- `/Users/richardvargas/hdec-website/index.backup.html` — backup before Ken Burns + UpcomingEvents additions
- `/Users/richardvargas/hdec-website/DESIGN.md` — full design system spec
- `/Users/richardvargas/hdec-website/.impeccable/design.json` — machine-readable design system for Impeccable skill

**Revert mechanism:** If user says "lets go back" → `cp /Users/richardvargas/hdec-website/index.backup.html /Users/richardvargas/hdec-website/index.html`

**GitHub:** `creativedigitalresource/hdec` (main branch) — https://github.com/creativedigitalresource/hdec.git

**Netlify (UNRESOLVED):** CLI deployed to `hdec-homepage.netlify.app` (siteId: d9e9c783-0ffd-40bf-ad64-927af5d25622), but user already has an existing project at `https://app.netlify.com/projects/hdecorg/overview`. Still needs: delete/ignore the CLI-created site and link the GitHub repo to the `hdecorg` project for continuous deployment.

**Why:** Client deliverable for HDEC South Florida — built as part of a design system exploration using the Impeccable skill and "The Memorial Library" north star.

**How to apply:** When resuming this project, check git log for latest state and address the Netlify conflict first before any new deploys.
