---
name: project-basecamp-to-sheets
description: "DR Basecamp-to-Sheets task logger — built tool, file locations, sheet details"
metadata: 
  node_type: memory
  type: project
  originSessionId: 6b225b97-37f1-4258-ae2b-f954771d825f
---

Built a Google Apps Script sidebar tool that pulls Basecamp todo data into the Creative Delegation Tracker sheet.

**Files:** `~/basecamp-to-sheets/` — Code.gs, Sidebar.html, get_token.py (one-time auth, done)

**Sheet:** Creative Delegation Tracker  
- ID: `1yKt3YFhIk0egX6t3JtjZZND2-3m_JGbjnSk8p4yPINE`  
- Tab: MASTERSHEET 2026 (gid: 1970451898)

**How it works:** DR Tools → Log Basecamp Task → paste URL → review fields → Add to Sheet  
Pulls: Client (breadcrumb), Title, Assigned To, PDD, HDD, EST top end, Project Type (rule-based)

**Auth:** Uses DR Basecamp Assistant OAuth app. Tokens stored in Apps Script Script Properties (BC_ACCESS_TOKEN, BC_REFRESH_TOKEN). Refresh token expires 2036 — self-managing, no maintenance needed.

**Why:** Replaces manual copy-paste when logging tasks to the delegation tracker.  
**How to apply:** If extending this tool, files are at ~/basecamp-to-sheets/. The Apps Script is bound to the sheet via Extensions → Apps Script.
