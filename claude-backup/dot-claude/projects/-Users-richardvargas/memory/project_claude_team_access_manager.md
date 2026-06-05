---
name: claude-team-access-manager
description: "Internal web app for managing team access to Claude — request/approval workflow, token allocation, usage tracking"
metadata: 
  node_type: memory
  type: project
  originSessionId: 072a7efe-6d7a-47a4-9ed1-45d88ea04cf2
---

Internal tool concept for Digital Resource to manage team Claude usage under a single Anthropic API key.

**Why:** Team shares one login but Richard needs visibility into who is using Claude, for what, and how much — and wants to enforce intentional use via a request/approval workflow before burning tokens.

**Core workflow:**
1. Team member logs in (individual accounts, shared API key)
2. Chats with Claude to plan their task/project
3. Submits a formal request generated from that planning chat
4. Richard reviews, approves, and allocates a token budget
5. Team member executes within their budget; proxy enforces the limit

**Architecture:**
- Next.js or Express + React web app
- API proxy between team and Anthropic — enforces per-user token limits, tracks usage
- Postgres for requests, approvals, and usage state
- Deploy on Railway (already in use)
- Admin dashboard for Richard: approve/reject, set budgets, view usage per person/project

**How to apply:** When this project comes up, treat it as a greenfield Railway/Node build. The request workflow and token proxy are the core differentiators — start there.
