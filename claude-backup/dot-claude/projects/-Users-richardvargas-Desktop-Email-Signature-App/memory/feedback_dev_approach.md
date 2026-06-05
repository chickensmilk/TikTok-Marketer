---
name: Development approach preferences
description: How the user wants code written and changes made for this project
type: feedback
---

Keep the stack simple — no build tools, no frameworks, vanilla JS only.

**Why:** The app is intentionally lightweight. Adding React, bundlers, or ORMs would add complexity without benefit for an internal tool.

**How to apply:** When suggesting new features, always reach for vanilla HTML/CSS/JS + Express patterns. Don't introduce new dependencies unless absolutely necessary.

---

Don't over-engineer for hypothetical V2 requirements. V1 is an internal tool; V2 (SaaS) would be a complete rebuild anyway.

**Why:** User is aware of the V2 possibility but wants V1 shipped cleanly first.

**How to apply:** Resist the urge to add multi-tenancy, abstractions, or scalability patterns to V1 code.
