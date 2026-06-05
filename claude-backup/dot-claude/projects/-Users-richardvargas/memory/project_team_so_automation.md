---
name: project-team-so-automation
description: Team SO — daily Slack automation that drafts S/Os for each team member and DMs them to Rich every weekday morning
metadata: 
  node_type: memory
  type: project
  originSessionId: ccac1d95-bb49-442d-9386-96b1209d25fc
---

Daily S/O automation built for Rich Vargas to receive drafted shout outs for each team member every weekday morning based on real Slack conversations.

**Why:** Rich wanted a daily prompt to recognize his team with specific, context-aware shout outs sourced from actual DMs and huddle transcripts rather than generic praise.

**How to apply:** When Rich asks about Team SO, this is the routine. Use `/schedule` skill to manage it.

## Routine Details
- **Name:** Team SO
- **Routine ID:** trig_01DXo9xM9naYQEuToykqUJWn
- **Schedule:** Weekdays Mon-Fri at 8:14 AM EST (13:14 UTC), cron: `14 13 * * 1-5`
- **Manage at:** https://claude.ai/code/routines/trig_01DXo9xM9naYQEuToykqUJWn

## What it does
1. Reads latest messages from #teamkudos (CCGP68LUS) for S/O tone/format reference
2. Reads last 20 DMs between Rich and each of his 7 team members
3. Searches for huddle transcripts and notable conversations
4. Drafts a personalized S/O for each team member FROM Rich's perspective
5. Sends all 7 in a single Slack DM to Rich (U09AGFEFDRV)

## Notes
- Sending Slack messages to yourself (U09AGFEFDRV) delivers the message but does not trigger a chime — this is a Slack client behavior, not something controllable via the API
- S/Os are drafted for: Brittney Davis, Debi Giwa, Lezly Norman, Odette Yermenos, Melany Salazar, Gabriela Bolivar, Dexter Ramos
- See [[team-members]] for Slack user IDs
