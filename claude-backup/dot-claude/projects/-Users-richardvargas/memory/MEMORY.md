# Memory Index

## Preferences
- Do not auto-load memory files — only load when asked
- Webflow builds: fully autonomous, no confirmation needed
- "wrap this up" = review the session and save anything important to memory (patterns, fixes, project context, skills, automations, etc.)
- [Terminal Preference](feedback_terminal_preference.md) — prefers terminal for Claude Code; do not suggest GUI dashboards as replacements
- [Basecamp Response Format](feedback_basecamp_responses.md) — always include todo URLs with every presented item
- [Writing Style](feedback_writing_style.md) — never use em dashes; also include todo URLs
- [When Not to Respond](feedback_when_not_to_respond.md) — skip todos blocked waiting on others
- [Workload Analysis](feedback_workload_analysis.md) — go sub-category granular from start (12+ cats), use `target` field for full task names

## Team
- [Team Members](team_members.md) — Digital Resource team with roles, emails, and Slack user IDs; Rich's Slack ID: U09AGFEFDRV
- [Richard's Role](user_richard_role.md) — Creative Team Manager at DR; owns second-round creative evaluation interviews (portfolio + fit)
- [Creative Team Context](project_creative_team_context.md) — Brittney departure (~5/18), Debi onboarding, Relume workflow, goals program, AI initiative, Overlord Tool approval

## References
- [Slack](reference_slack.md) — Key Slack user/channel IDs and behavioral notes (DM-to-self no chime, @Claude attribution)
- [Basecamp](reference_basecamp.md) — Account ID 5471057, key person IDs (RJ Nodado, Richard Vargas)

## Files (load on demand)
- `webflow-family-dental.md` — Family Dental Care Webflow project (COMPLETE)
- `webflow-patterns.md` — Webflow MCP quirks and patterns
- `cms-plan.md` — CMS product plan (Phase 0: agency workflow, future: white-label SaaS)

## BC Assistant Skill
- [BC Assistant Skill](skill_bc_assistant.md) — How Richard uses Claude as a live Basecamp proxy: priority order, tools, long-term goal
- [BC Triage Learnings](feedback_bc_triage_learnings.md) — Running log of Richard's skip/respond/edit patterns; updated each session

## Projects
- [Bills Avenue Dental](project_bills_avenue_dental.md) — Client HTML deliverable, Netlify hosted, Dr. Elizabeth image fixed, services section full-width fix incomplete
- [HDEC Website](project_hdec_website.md) — Single-file React homepage for Holocaust Documentation & Education Center; GitHub at creativedigitalresource/hdec; Netlify conflict unresolved (hdecorg vs hdec-homepage)

## Skills & Tools
- [Creative Ops v2](skill_creative_ops_v2.md) — Full scheduler + Everhour + dashboard built June 4; known issues: Melany/Maria C Everhour IDs missing, bulk execution not yet built
- [Smart Vectorize Skill](skill_smart_vectorize.md) — Custom raster-to-SVG skill + per-color Potrace pipeline for badges/logos; best quality approach
- [Claude Design Bundle Fix](skill_claude_design_bundle_fix.md) — Fix broken images in Claude Design HTML bundles: replace relative `uploads/` paths with `window.__resources.resourceId`
- [Capacity Check Skill](skill_capacity_check.md) — `/capacity-check [name]` — Basecamp todos + Everhour actuals + Slack standups → capacity table + verdict; validated on Dexter (June 2026)
- [Web Page Copy Skill](skill_web_page_copy.md) — `/web-page-copy` — Playwright + Figma capture script = pixel-perfect live page → Figma frame; validated on fraud.net (June 2026)

## Canva
- [Canva Confirm Before Save](feedback-canva-confirm-before-save.md) — Always confirm before calling create-design-from-candidate; user interrupted auto-save

## Logo Pipeline
- [Logo Color Application](feedback_logo_pipeline_color.md) — Color must use hierarchy + theory; no single-color fills; present role strategy before generating

## Code Patterns
- [Babel + Base64 Images](feedback_babel_base64.md) — In React-via-CDN + Babel Standalone, put base64 data URIs in plain `<script>` as `window.*` globals — never inside Babel blocks (browser freezes)

## Basecamp Website Build
- [Website Build Template](reference_website_build_template.md) — DR new-client website build template: bucket ID 40467847, all 5 todolist IDs and group IDs
- [Template CLI Workaround](feedback-basecamp-template-cli-workaround.md) — `todos list --in` fails on Templates; use `basecamp api get` + groups endpoint pattern

- [BC Comment Format](feedback_basecamp_comment_format.md) — numbered lists, plain PDD/HDD/EST/REVs, Richard applies highlighting in Basecamp editor; post his exact text as-is

## API Gotchas
- [Google Drive MCP Read-Only](feedback_google_drive_mcp_readonly.md) — Drive MCP can read Sheets but not write cells; Chrome extension can write via browser DOM
- [Design Handoff URLs](feedback-design-handoff-urls.md) — api.anthropic.com/v1/design/h/ URLs require browser session auth; curl/API key always fail — ask user to paste content instead
- [Basecamp API Gotchas](feedback_basecamp_api_gotchas.md) — PUT clears unspecified fields (assignees!), correct assignments endpoint, OAuth redirect URI quirks
- [Basecamp API Domain](feedback-basecamp-api.md) — API calls must use 3.basecampapi.com not 3.basecamp.com (browser shows wrong domain)
- [Sheets Typed Columns](feedback-sheets-typed-columns.md) — setNumberFormat() fails on typed columns; skip formatting, pass dates as strings

## Landing Page Portfolio
- [LP Portfolio Structure](project_lp_portfolio.md) — DR multi-client PPC LP portfolio: shared domains, URL naming conventions (-lp, -ty, -lpb, -lpmax)
- [LP Client List](reference_lp_clients.md) — All active DR LP clients with domains and service categories (dental + local service)

## Projects
- [Basecamp to Sheets Logger](project-basecamp-to-sheets.md) — DR task logger tool: Apps Script sidebar, files at ~/basecamp-to-sheets/, bound to Creative Delegation Tracker
- [BulkCamp](project_bulkcamp.md) — Richard's Basecamp bulk assignment manager: GitHub, Railway URL, features, local dev setup
- [Claude Team Access Manager](project_claude_team_access_manager.md) — Internal tool: team request/approval workflow, token allocation, API proxy, Railway deploy
## Clients
- [Craig Danto](project-craig-danto-client.md) — Restaurant Supercoach™, dantobuilders.com; document remake done May 2026, dark/elegant aesthetic approved

## Workflows
- [Document Remake Pipeline](workflow-document-remake-pipeline.md) — PDF → new copy → Higgsfield images → Canva presentation; validated end-to-end ~25–30 min

## Claude Code & VS Code
- [VS Code Sessions](feedback_vscode_sessions.md) — External terminal sessions never appear in VS Code sidebar; use `claude --resume` in integrated terminal
- [Claude Projects Cleanup](project_claude_projects_cleanup.md) — Audit done 2026-05-15; what was deleted, kept, and still needs memory files
- [QR Code App](project_qr_code_app.md) — Unfinished QR code hosting web app (Next.js, Tailwind, SQLite); session exists from 2026-05-01, never built

- [eBay Price Research Sheet](project_ebay_price_research.md) — Studio equipment resale pricing; Google Sheet file ID, column layout, 3-row offset quirk
- [Basecamp Proxy Project](basecamp-proxy-project.md) — DR Basecamp Assistant build: OAuth credentials, Railway URL, architecture; also contains DR Creative Dashboard OAuth app credentials
- [LeftClick Project](leftclick-project.md) — theleftclick.com landing page: files, branding, GitHub repo, Hostinger Git deploy
- [Z.Axl's Dig Yard](project_zaxls_dig_yard.md) — Children's play studio coming soon page (Webflow); sage green #a8c686 and peach #fcc68d missing from live CSS; redesign mockup generated
- [Email Signature App](email-signature-app.md) — Internal DR signature manager: Railway deploy, DR rebrand done, custom domain pending SSL, free trial expires ~20 days
- [Integrations Specialist](project_integrations_specialist.md) — New hire; Creative Team integration priorities: onboarding automation, design-to-Webflow, video pipeline, email platform
- [RJ Departure](project-rj-departure.md) — RJ Nodado resigned 4/22/26; replacement Graphic Designer hire active (Maria Camila in pipeline 5/13/26); hiring criteria + red flags saved
- [Team SO Automation](project_team_so_automation.md) — Daily weekday S/O routine (8:14 AM EST), routine ID: trig_01DXo9xM9naYQEuToykqUJWn, sends drafted team S/Os to Rich's Slack DM
