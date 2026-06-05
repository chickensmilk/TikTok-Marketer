---
name: feedback-terminal-preference
description: Richard prefers the terminal for Claude Code — do not suggest GUI dashboards as replacements
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 072a7efe-6d7a-47a4-9ed1-45d88ea04cf2
---

Do not suggest building or switching to a web dashboard or GUI as an alternative to the terminal for Claude Code usage.

**Why:** Richard finds the terminal faster, cleaner, and more capable. He explored the idea and explicitly concluded the terminal is the right tool.

**How to apply:** If Claude Code UX comes up, default to terminal-based solutions (flags, config, CLAUDE.md, hooks). Only suggest a web UI when the use case genuinely requires it (e.g., multi-user access, approval workflows) — not as a convenience layer over the CLI.
