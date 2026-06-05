---
name: reference-slack
description: "Slack user IDs, channel IDs, and behavioral notes for Digital Resource workspace"
metadata: 
  node_type: memory
  type: reference
  originSessionId: ccac1d95-bb49-442d-9386-96b1209d25fc
---

## Key User IDs
- **Rich Vargas (self):** U09AGFEFDRV
- See [[team-members]] for full team Slack user IDs

## Key Channels
- **#teamkudos:** CCGP68LUS — public channel where the DR team posts shout outs; used as S/O format reference
- **#creativesassemble:** C016DNBSQ2W — private Creative Team channel; huddle notes (Slack canvases) are posted here after each meeting

## DM Search Pattern
- To search a DM conversation, use `in:<@USER_ID>` with `channel_types: im` — name-based queries (`from:Name to:me`) return no results
- Example: `query="in:<@U01S46XJU8G>"` + `channel_types="im"` pulls all DMs with Dexter

## Behavioral Notes
- Sending a Slack message to your own user ID (DM to self) delivers the message but does NOT trigger a chime or push notification — this is a Slack client limitation, not an API issue
- Messages sent via the Slack MCP show "Sent using @Claude" attribution automatically — this cannot be removed from the API side
