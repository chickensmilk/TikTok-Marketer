---
name: project_ebay_price_research
description: "Studio equipment eBay price research spreadsheet — file ID, structure, and row offset quirk"
metadata: 
  node_type: memory
  type: project
  originSessionId: 513bf2eb-7530-4a92-a360-1f3e2c860831
---

DR studio equipment inventory being priced for resale via eBay. Each row has the item name, estimated value, "cost we could sell it for" (column C), buyer interest (column D), and 3 eBay listing reference links (columns E, F, G).

**File ID:** `1FPPgEp5FCbJ2B5m0RTdRhrvtYGCbwzT00XWiIX8JJL8`

**Why:** Pricing out studio gear for sale; using eBay sold listings as comp data to fill column C.

**Row offset:** The sheet has 3 rows above the data table (likely title + blank + header), so table row 3 = sheet row 6. Always confirm which row the user means when they reference sheet row numbers.

**How to apply:** When reading the sheet, account for the 3-row offset when mapping between "table row N" and "sheet row N+3."
