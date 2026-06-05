---
name: feedback_google_drive_mcp_readonly
description: Google Drive MCP in Claude Code is read-only for Sheets; Chrome extension can write because it has browser DOM access
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 513bf2eb-7530-4a92-a360-1f3e2c860831
---

The Google Drive MCP connector available in Claude Code can read Google Sheets but cannot update cell values. There is no `update_file_content` or Sheets API write endpoint exposed.

**Why:** The MCP connector uses the Drive API, not the Sheets API write endpoints (`spreadsheets.values.update`). The Claude Chrome extension can write because it has direct browser DOM access and interacts with the Sheets web UI like a user would.

**How to apply:** Do not attempt to write cell values to an existing Google Sheet via Google Drive MCP tools in Claude Code — it will fail. If the user needs cell writes, suggest they use the Chrome extension or enter values manually. Do not imply write access is possible without confirming the environment.
