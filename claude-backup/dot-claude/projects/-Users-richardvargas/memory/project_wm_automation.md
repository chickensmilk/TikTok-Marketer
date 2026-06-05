---
name: project-wm-automation
description: "Automation opportunities identified from Jackie's Simple Frequent WM Clients todo — tools similar to the MAPC bulletin uploader"
metadata: 
  node_type: memory
  type: project
  originSessionId: cd190120-c633-4c0b-aee4-8eff5d6c9c86
---

From the "Simple Frequent WM Clients" Basecamp todo, Richard and Claude identified 5 recurring website maintenance tasks that could be turned into web app tools, similar to the MAPC bulletin uploader Richard already built (https://mapc.up.railway.app/).

**Opportunities ranked by ease:**

1. **Friedman Dental - Monthly Offer Update** (VERY HIGH / easiest) — One field, enter new expiration date, tool updates Webflow directly. Could be fully automated with no human input.
2. **FELC Calendar & Events** (HIGH) — Form where AM enters event details, pushes to Webflow CMS. Could auto-parse Pastor Dan's email format.
3. **Connected Smile Solutions - Blog Post Addition** (HIGH) — Title, body, publish date form that pushes directly to Webflow CMS. Weekly cadence.
4. **Athens Dental - RevenueWell Testimonials** (MEDIUM) — Background job/scraper that checks RevenueWell on a schedule and auto-creates a Basecamp WM todo only when new reviews are found.
5. **Smalltown Dental - Career Page Weekly Updates** (TBD) — Details not pulled yet, likely same content-entry pattern.

**Master Dashboard idea:** All follow the same shape (client/AM provides content, Web manually implements). A single dashboard with client-specific forms, each pushing to their respective Webflow site via API, would eliminate the Basecamp ping-pong for all of them. MAPC tool is the proof of concept.

**Why:** Reduce manual WM hours, eliminate Basecamp back-and-forth, scale across more clients.

**How to apply:** Revisit when Richard is ready to build. Start with Friedman Dental (simplest) or pitch master dashboard concept.
