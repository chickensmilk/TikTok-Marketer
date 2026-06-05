---
name: skill-web-page-copy
description: How to pixel-perfectly capture any live external website into Figma using Playwright + generate_figma_design. Validated on fraud.net resource center and article pages.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 1a4e8d65-763b-4438-856c-ff95fcce2d27
---

Pixel-perfect website capture to Figma works via Playwright injecting the Figma capture script into the live DOM — not a screenshot. Produces real editable Figma frames with actual fonts, colors, images, and layout.

**Why:** Used successfully to capture fraud.net pages for author bio mockups (June 2026). Richard called the result "perfect" and wants this reusable.

**How to apply:** Use `/web-page-copy` skill whenever Richard asks to copy, recreate, or capture a live web page into Figma. The skill file is at `~/.claude/skills/web-page-copy`.

**Critical rules learned:**
1. Strip BOTH CSP headers (`content-security-policy` AND `content-security-policy-report-only`) in Playwright route handler BEFORE `page.goto` — not after
2. Scroll to bottom then back to top before injecting script — loads all lazy images
3. After capture, add overlay components as direct children of the ROOT capture frame (layoutMode: NONE), NOT inner auto-layout containers — inner containers collapse children to 0 height
4. Get ALL capture IDs upfront before running any Playwright — run captures in parallel via `run_in_background: true`
5. Poll with `generate_figma_design(fileKey, captureId)` every 5s until status = "completed"

See [[skill_figma_patterns]] for related Figma component insertion patterns.
