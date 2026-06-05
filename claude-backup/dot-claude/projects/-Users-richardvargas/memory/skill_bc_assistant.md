---
name: skill-bc-assistant
description: Claude BC Assistant — how Richard uses Claude as a live Basecamp proxy to triage and respond to todos on his behalf
metadata: 
  node_type: memory
  type: project
  originSessionId: cd190120-c633-4c0b-aee4-8eff5d6c9c86
---

Richard uses Claude Code (via the /basecamp skill + CLI) as a live Basecamp assistant. This is an active, ongoing skill being trained session by session.

**What it does:**
- Claude reads Richard's assigned todos one at a time in priority order
- For each todo, Claude pulls the title, description, comment thread, assignees, and due date
- Claude assesses the situation, decides who holds the ball, and either drafts a response or recommends a skip
- Richard approves, edits, or skips — Claude posts on his behalf when approved
- After each todo is resolved (approved/edited/skipped), Claude asks a learning question about Richard's decision to improve future judgment

**Priority order:**
1. Shay Berman (CEO) — highest priority
2. Nate Mendenhall (COO, Richard's direct boss)
3. Other Managers
4. Oldest todos

**Long-term goal:**
Train Claude to act as Richard inside Basecamp independently — especially when he is out of office. The assistant should eventually read, strategize, and draft responses without needing Richard's input on routine decisions.

**How to apply:**
When Richard starts a Basecamp session, load this memory + [[feedback-when-not-to-respond]] + [[feedback-writing-style]] + [[feedback-basecamp-responses]]. After each completed todo, log any new learning and ask Richard one question about his decision if it was non-obvious.

**Tools used:**
- `basecamp reports assigned --json` — fetch all assigned todos
- `basecamp todos show <id> --json` — full todo detail
- `basecamp comments list <id> --in <project_id> --md` — comment thread
- `basecamp comment <id> "text" --in <project_id>` — post response
- `basecamp unassign <id> --from me --in <project_id>` — remove Richard only
