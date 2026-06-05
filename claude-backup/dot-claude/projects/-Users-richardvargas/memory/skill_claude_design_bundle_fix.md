---
name: claude-design-bundle-fix
description: Fix pattern for broken images in Claude Design-generated HTML bundles — relative paths vs window.__resources
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d77ada46-44fd-4517-a020-d7fa89987c74
---

When Claude Design generates a self-contained HTML file (using the `__bundler` system), all images are embedded in the `__bundler/manifest` as base64 data and mapped to named resource IDs in `__bundler/ext_resources`.

**The fix:** If an image shows as broken (displaying alt text instead of the photo), check the template for a relative file path like `uploads/filename.webp`. Change it to use the bundled resource:

```js
// Broken — relative path doesn't exist when hosted
photo: 'uploads/66788ab23426b24f74541344_dr-elizabeth.webp'

// Fixed — pulls from embedded bundle with fallback
photo: (window.__resources.drElizabeth || 'uploads/66788ab23426b24f74541344_dr-elizabeth.webp')
```

**Why:** Claude Design bundles assets by resource ID (e.g. `drElizabeth`, `teamKaren`). If the template hardcodes a relative path instead of referencing `window.__resources.resourceId`, the image only works locally — it breaks on any hosted URL.

**How to apply:** When a bundled HTML file has broken images after deploying to Netlify or any host, grep the template for `uploads/` or any relative image path and replace with the `window.__resources` pattern. The resource ID mapping is in the `__bundler/ext_resources` script tag.
