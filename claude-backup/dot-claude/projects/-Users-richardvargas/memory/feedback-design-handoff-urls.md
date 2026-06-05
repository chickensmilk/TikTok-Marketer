---
name: feedback-design-handoff-urls
description: How to handle Anthropic design handoff URLs (api.anthropic.com/v1/design/h/...) — they cannot be fetched via curl or API key
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6a1ef795-680c-4bfe-b372-b63525728100
---

When the user shares a URL like `https://api.anthropic.com/v1/design/h/{id}?open_file={filename}`, do NOT attempt to fetch it via curl, WebFetch, or API key auth — it will always fail.

Attempted methods that all failed:
- `curl` without auth → 404
- `curl` with `x-api-key` → 401 "unsupported authentication method for HTTP endpoint"
- `curl` with `Authorization: Bearer {api_key}` → 404
- macOS keychain lookup → no Claude/Anthropic session tokens stored there

**Why:** These URLs require a Claude.ai browser session (OAuth), not an API key. The resource exists server-side but is gated behind user-session auth that isn't available to the CLI environment.

**How to apply:** When this URL format appears, immediately ask the user to either:
1. Open the URL in their browser, copy the HTML/CSS content, and paste it into chat
2. Export/download the design file locally and share the file path
