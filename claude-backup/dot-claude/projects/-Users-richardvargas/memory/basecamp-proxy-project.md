---
name: basecamp-proxy-project
description: DR Basecamp Assistant — proxy + web app build details and credentials
metadata: 
  node_type: memory
  type: project
  originSessionId: 8872d5ce-bdfb-400e-9b3e-3cd1ba8ef191
---

## Basecamp OAuth App: DR Basecamp Assistant
- Client ID: 38b03859297d1a9b0dd52b7754ef09d45cd125dc
- Client Secret: f9fa64d922cf3e122d08b0ea233d1782c0df7ecd
- Redirect URI: https://basecamp-proxy-production.up.railway.app/auth/callback
- Registered at: launchpad.37signals.com/integrations

## Railway Deployment
- URL: https://basecamp-proxy-production.up.railway.app
- Repo: github.com/creativedigitalresource/basecamp-proxy
- Account: creative-adaptation

## Architecture
- Go proxy server on Railway
- Basecamp OAuth login (Login with Basecamp button)
- Shared Anthropic API key (Richard manages, invisible to users)
- Claude queries Basecamp via tool use (read-only)
- Users authenticate via Basecamp OAuth

## Basecamp Account
- Account ID: 5471057
- Account Name: Digital Resource

## Key Projects
- **Employee: Richard Vargas** — Project ID: 43484427 — Richard's personal todo/tracking project; General todolist ID: 9432242590

**Why:** Building a read-only Basecamp AI assistant for the DR team. Users log in with Basecamp, ask questions in plain English, Claude fetches and summarizes Basecamp data.
**How to apply:** When continuing this build, these are the credentials and deployment details needed.

## Basecamp OAuth App: DR Creative Dashboard
- Client ID: 0ca67e8bd32156d5da352c5c75c85d5dfd20e88c
- Client Secret: 2c004a1b98104f5eebb8d5c1c16c85881caa012a
- Redirect URIs:
  - https://dr-creative-dashboard-production.up.railway.app/auth/callback
  - http://localhost:8000/auth/callback
- Registered at: launchpad.37signals.com/integrations
