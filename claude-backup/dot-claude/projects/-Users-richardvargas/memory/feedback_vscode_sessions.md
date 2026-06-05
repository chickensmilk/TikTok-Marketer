---
name: feedback_vscode_sessions
description: "VS Code sidebar only shows sessions started inside VS Code — external terminal sessions won't appear there"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f03e50ce-4861-4a75-90aa-7abdc92a785c
---

Sessions started in an external terminal (Terminal.app, iTerm2) are saved to `~/.claude/projects/` but never appear in the VS Code sidebar. The sidebar only surfaces sessions initiated through the VS Code extension.

**Why:** The VS Code extension only tracks sessions it started. External sessions exist on disk but the extension has no awareness of them.

**How to apply:** If asked why a session isn't in the sidebar, check whether it was started outside VS Code. To resume an external session inside VS Code, use `claude --resume` in the integrated terminal to pick from a list. Going forward, always start sessions from the VS Code integrated terminal or sidebar to keep history visible there.
