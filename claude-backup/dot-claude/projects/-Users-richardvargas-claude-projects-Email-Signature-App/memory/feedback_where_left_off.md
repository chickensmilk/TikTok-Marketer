---
name: "Where did we leave off" behavior
description: When user asks where we left off, check the current working directory files and git log — not just memory
type: feedback
---

When asked "where did we leave off", check the actual current working directory (ls, git log, git status) to answer accurately.

**Why:** User corrected me for relying only on memory/git log without inspecting the live folder state.

**How to apply:** Always run `ls` and `git log` on the current directory when answering this question.
