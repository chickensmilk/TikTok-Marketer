---
name: skill-capacity-check
description: "Capacity Check skill — /capacity-check [name] — cross-references Basecamp todos, Everhour actuals, and Slack standups to produce a capacity table and verdict for a DR team member"
metadata: 
  node_type: memory
  type: project
  originSessionId: 08e51712-510f-46c9-b8b2-e13009485526
---

Skill file: `~/.claude/skills/capacity-check/SKILL.md`
Registered in settings.json under `additionalDirectories`.

## Confirmed team member IDs

| Name | Basecamp Person ID | Everhour User ID |
|------|--------------------|------------------|
| Dexter Ramos | 44800252 | 1327353 |
| Richard Vargas | — | 1415584 |

IDs for Lezly, Gabriela, Odette, Melany, Debi are not yet confirmed — look up on first run.

## Status

- Validated on Dexter Ramos (June 2026)
- Not yet validated on other team members
- Known gap: historical/completed todos are pulled but not yet fully analyzed
- Known gap: Beachside Dental multi-user attribution was unresolved at skill creation time

## Key data sources

- Basecamp CLI for todos and comment threads
- Everhour API (`https://api.everhour.com/tasks/b3:{todo_id}/time`) for actuals
- Slack #creativesassemble (C016DNBSQ2W) for standup history

**Why:** [[feedback_bc_triage_learnings]] — Basecamp built-in time fields not accessible via CLI; Everhour is the real time tracking layer.
