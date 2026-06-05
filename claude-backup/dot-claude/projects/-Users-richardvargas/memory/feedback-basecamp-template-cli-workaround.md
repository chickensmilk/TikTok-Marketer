---
name: feedback-basecamp-template-cli-workaround
description: Basecamp CLI fails on Template-type projects; use basecamp api get + groups endpoint as workaround
metadata: 
  node_type: memory
  type: feedback
  originSessionId: cb49791d-87fa-4602-bd10-6fe098ee88b3
---

`basecamp todos list --in <id>` and most project-scoped commands fail on **Template-type** projects with:
> `Resource not found: https://3.basecampapi.com/5471057/projects/<id>.json`

This is because the CLI validates project existence via the `/projects/` endpoint, which doesn't list templates.

**Why:** Templates are a separate Basecamp resource type (`"type": "Template"`). They don't appear in `projects list` and can't be accessed via standard `--in` project scoping for most commands.

**How to apply:** When working with a Template project, use these patterns instead:

1. **`basecamp show <url>`** — works for individual items (todoset, todolist) via their full app URL
2. **`basecamp api get <api_url>`** — raw API call, bypasses project validation entirely
3. **Todos are often nested in groups** — the direct `todos.json` endpoint may return empty; always check `/todolists/<id>/groups.json` first, then fetch todos from each group's own `todos_url`

**Access pattern for template todos:**
```bash
# 1. Show the todoset to get todolist IDs
basecamp show "https://3.basecamp.com/5471057/buckets/<bucket_id>/todosets/<todoset_id>" --json

# 2. Get groups for each todolist (todos may be grouped, not flat)
basecamp api get "https://3.basecampapi.com/5471057/buckets/<bucket_id>/todolists/<list_id>/groups.json" --json

# 3. Fetch todos from each group
basecamp api get "https://3.basecampapi.com/5471057/buckets/<bucket_id>/todolists/<group_id>/todos.json" --json
```

See [[reference-website-build-template]] for the DR website build template IDs.
