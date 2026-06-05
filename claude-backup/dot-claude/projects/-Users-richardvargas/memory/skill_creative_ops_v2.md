---
name: skill-creative-ops-v2
description: "Status and architecture of the Creative Ops Assistant skill as of June 4, 2026 session — scheduler, Everhour, dashboard, sitemap workflow"
metadata: 
  node_type: memory
  type: project
  originSessionId: 36f526bb-f032-40cf-815e-d5b04908a05b
---

## What Was Built (June 4, 2026 session)

Full Creative Ops Assistant skill with live Basecamp + Everhour integration.

### Scheduler (`references/scheduler.py`)
- Day-by-day schedule per designer using HDD priority sort
- 7h/day capacity, 1h daily buffer for unplanned work
- Everhour remaining hours: `GET /tasks/b3:{todo_id}` — subtract logged from EST+REVS
- Staleness flags: 7d = ⏱, 14d+ = 🚨 (from assignment comment created_at)
- Sitemap child page detection (Web Team → Sitemap Tasks grandparent check)
- External task flagging (no ➡️ HDD + no CM comment)

### Team Dashboard (`references/team_dashboard.py`)
- 4-week lookahead window (far-future tasks excluded)
- Weekly load + first open slot per designer
- ⚠️ flag at ≥90% weekly capacity

### Everhour Integration
- API key: `EVERHOUR_API_KEY` env var
- Use `/users/{eh_id}/time` endpoint — NEVER `/team/time` (wrong date field)
- Designer user IDs in SKILL.md Basecamp & Everhour Team IDs table

### Key Rules Learned
- Projects stack together — never sequential unless told to
- Web Team Sitemap Tasks → Main Pages is the ONLY correct source for template pages
- Internal template naming: "Dropdown: First Internal Page"
- EST: 1h/template, REVS: 0.5h/template
- Comment format: Richard's exact text, numbered lists, he applies highlighting

### Known Issues / Still To Build
- Melany and Maria Camila Everhour user IDs unknown
- Everhour not yet validated for all 7 designers (only Dexter fully confirmed)
- Unassigned queue workflow not yet fully automated
- Basecamp execution covers single tasks — bulk assignment not yet built

**Why:** This skill replaces manual Basecamp assignment sessions, capacity checking, and schedule math.
**How to apply:** Load `/creative-ops-assistant-NEW` at session start. Run dashboard, pull queue, present recommendations, confirm, execute.
