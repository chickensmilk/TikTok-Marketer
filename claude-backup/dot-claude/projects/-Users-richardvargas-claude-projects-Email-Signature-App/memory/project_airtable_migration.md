---
name: Airtable to Google Sheets Migration
description: Migration tool location, what was migrated, and how to run it again
type: project
originSessionId: fd2d19b1-9e2c-41ef-818a-a67b36046d49
---
All 30 Airtable bases were migrated to Google Sheets on 2026-04-22.

**Tool lives at:** `~/Desktop/airtable-migration/`

**Commands:**
- `node migrate.js` — migrate bases to Google Sheets (reads from UNMIGRATED_BASES list)
- `node update-tracker.js` — updates tracking sheet with URLs + marks column C as TRUE
- `node rerun.js` — re-run specific bases that had errors
- `node auth.js` — re-authenticate Google OAuth if token expires

**Tracking sheet:** https://docs.google.com/spreadsheets/d/1qJD5h359BBQWRjkI31RR2Y-Dt6r2mhpsaQoD7LH9Igc

**Google Cloud project:** starry-descent-493918-p6 (My First Project)
- Google Sheets API: enabled
- Google Drive API: enabled
- OAuth Desktop client: "Desktop client 1"

**Airtable token:** patNx01pEBTTUjFzU — needs to be regenerated (was shared in plain text)

**Known issues from last run:**
- Some bases with many tables hit Google Sheets write quota (60 req/min). Fixed with 1.1s delay between table writes.
- Web - Values and DR - Hierarchy - Mastersheet had incomplete tabs — rerun.js created clean replacements.

**Why:** Migration away from Airtable paid plan. All 30 remaining unmigrated bases are now in Google Sheets.

**How to apply:** If user asks to migrate more Airtable bases, add them to UNMIGRATED_BASES in migrate.js and run node migrate.js.
