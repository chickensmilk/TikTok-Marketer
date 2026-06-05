---
name: "Wrap this up" command
description: When Richard says "wrap this up", update the CLAUDE.md in the current project folder with full session context
type: feedback
---

When Richard says "wrap this up", update the `CLAUDE.md` file in the current working directory project folder with a complete summary of the session so he can pick up exactly where he left off next time he opens a terminal from that folder.

**Why:** Richard works across multiple projects and wants a reliable save point without having to manually summarize conversations.

**How to apply:**
- Update the "Last Session" section in `CLAUDE.md` with today's date
- Include: what was built/changed, decisions made, open items, warnings, anything relevant for next session
- Keep it concise but complete — bullet points, not paragraphs
- If no `CLAUDE.md` exists in the folder, create one
