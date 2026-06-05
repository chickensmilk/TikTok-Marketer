---
name: feedback-sheets-typed-columns
description: Google Sheets typed columns reject setNumberFormat from Apps Script — skip it
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6b225b97-37f1-4258-ae2b-f954771d825f
---

Do not call `setNumberFormat()` on columns that have a Google Sheets column type set (dates, checkboxes, etc.). It throws "You can't set the number format of cells in a typed column" and blocks the entire write.

**Why:** The Creative Delegation Tracker uses typed columns. The sheet handles its own formatting.  
**How to apply:** When writing to this sheet via Apps Script, just use `appendRow()` with the raw values and skip any post-write formatting calls. Pass dates as strings (e.g. "4/29/2026") rather than Date objects to avoid type conflicts.
