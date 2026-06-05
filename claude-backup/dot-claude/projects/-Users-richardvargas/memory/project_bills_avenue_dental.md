---
name: bills-avenue-dental
description: "Bills Avenue Dental client deliverable — Claude Design HTML file, Netlify hosted, based on hillsborovillagedental.com"
metadata: 
  node_type: memory
  type: project
  originSessionId: d77ada46-44fd-4517-a020-d7fa89987c74
---

Client deliverable: a redesigned homepage for Bills Avenue Dental (Nashville, TN).

**File:** `/Users/richardvargas/Downloads/Bills Avenue Dental.html`
**Netlify URL:** `taupe-alfajores-e28d6c.netlify.app`
**Reference site:** https://www.hillsborovillagedental.com/

**Why:** Client wants updated branding (fonts, colors) applied to the existing site layout using Claude Design.

**Status / known issues:**
- Dr. Elizabeth Bills image fix applied — was using relative path, now uses `window.__resources.drElizabeth`
- Services section: background image and overlay are constrained (shows gray sides) — needs to be made full-width; fix was interrupted and not completed

**How to apply:** When resuming work, re-read the file and look for the Services section (`const Services`) which has `background: T.cream`. The fix involves making the background image extend edge-to-edge rather than being constrained to the inner `maxWidth: 1100px` container.
