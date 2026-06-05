---
name: feedback_basecamp_api_gotchas
description: Non-obvious Basecamp API behaviors that have caused bugs
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d7af772f-cd67-4ee9-bedc-0de2ef8b085e
---

## Basecamp PUT todos clears unspecified fields

When calling `PUT /buckets/{bucket_id}/todos/{todo_id}.json`, any field NOT included in the request body gets cleared — including `assignee_ids`.

**Why:** Discovered after a bulk due-date update accidentally unassigned everyone from selected todos.

**How to apply:** Always fetch the current todo first, extract its `assignee_ids`, and re-include them in any PUT update. Never send a partial update to a Basecamp todo endpoint.

## 37signals OAuth redirect URI quirks

- `localhost` is rejected as a redirect URI ("not a valid URI") during app registration
- `127.0.0.1` is accepted
- Next.js 16 dev server blocks cross-origin requests from `127.0.0.1` by default — fix with `allowedDevOrigins: ['127.0.0.1']` in `next.config.ts`

## Assignments endpoint

- `GET /{account_id}/assignments.json` → 404
- `GET /{account_id}/my/assignments.json` → correct endpoint for current user's assignments

## Basecamp CLI: `--due` alone doesn't write

When running `basecamp todos update <id> --due <date>`, the CLI reports "Updated todo" and returns 200 but the `due_on` field does not actually change. The fix: always pair `--due` with `--title` (passing the current title), which forces a real write.

**Why:** Discovered when bulk-updating 23 todos — due dates appeared to succeed but stayed unchanged in Basecamp UI.

**How to apply:** Always use `basecamp todos update <id> --title "<current title>" --due <date>` when changing due dates via the CLI.

## Basecamp CLI: `assign` command can revert `due_on`

Running `basecamp assign <id> --to <person>` after a due date update can revert the `due_on` back to its previous value.

**Why:** The assign command appears to issue a PUT that omits `due_on`, effectively clearing it. Discovered when re-assigning 23 todos after a bulk due date change reset all dates.

**How to apply:** If you need to both update a due date and reassign, do the assign step first, then update the due date last.
