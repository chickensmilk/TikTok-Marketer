---
name: feedback-basecamp-api
description: Basecamp API uses 3.basecampapi.com not 3.basecamp.com — critical gotcha
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6b225b97-37f1-4258-ae2b-f954771d825f
---

Always use `https://3.basecampapi.com/` for Basecamp API calls, NOT `https://3.basecamp.com/`.

**Why:** The browser address bar shows `3.basecamp.com` but the actual REST API endpoint is `3.basecampapi.com`. Using the wrong domain returns a silent 404 with an empty body.  
**How to apply:** Any time writing code that calls the Basecamp API, use `3.basecampapi.com` as the base. The URL regex for parsing user-pasted URLs still matches `3.basecamp.com` (correct), but the fetch calls must go to `3.basecampapi.com`.
