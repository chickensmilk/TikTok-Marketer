---
name: feedback-babel-base64
description: "In React-via-CDN + Babel Standalone setups, large base64 data URIs must be in a plain <script> block, never inside <script type=\"text/babel\">"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 932f7823-e39d-46a7-be0b-e3699950553b
---

Never put large base64 data URIs (images, fonts, etc.) inside a `<script type="text/babel">` block. Babel Standalone parses the entire string content before executing — multi-hundred-KB base64 strings cause the browser to freeze or hang for minutes.

**Why:** Burned mid-session on the HDEC project when 3 hero images (~350KB each as data URIs) were placed inside a Babel block. Browser locked up parsing them.

**Fix pattern:**
```html
<!-- BEFORE React/Babel CDN loads: -->
<script>
  window.BUILDING_IMG = "data:image/jpeg;base64,...";
  window.HERO_IMG_1   = "data:image/jpeg;base64,...";
</script>

<!-- Then in Babel JSX, reference the global: -->
<img src={window.BUILDING_IMG} />
```

**How to apply:** Any time building a self-contained HTML file with React via CDN + Babel Standalone and inline images — always move data URIs to a plain `<script>` block as `window.*` globals before the CDN `<script>` tags.
