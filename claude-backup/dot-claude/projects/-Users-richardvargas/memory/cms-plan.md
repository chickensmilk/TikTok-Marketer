# CMS Plan

## Current Phase: Agency Workflow (Phase 0)
Start here before building any custom product.

## Phase 0 — Agency Workflow (Active)
Use existing tools per client project. No custom build needed.

### Recommended Approach (per project)
- **Payload CMS** — best when everything lives in one repo (Next.js project). Client gets `/admin`. Easier to maintain.
- **Sanity** — best when CMS needs to be decoupled from the codebase. Client gets their own URL. Two deployments.
- **In practice**: Describe what the client needs to edit in Cursor → Claude/Cursor implements it → verify `/admin` loads, client can log in, changes appear on live site.

### When to use Payload vs Sanity
- Single dev/small team editing → **Payload** (one repo, simpler)
- Larger client team editing content → **Sanity** (decoupled, better for collaboration)

---

## Phase 1 — Custom CMS Product (Future)
Build only after agency workflow is validated and pain points are clear.

### What to Build (Option B — Focused)
- Target: Static HTML/CSS/JS sites only (to start)
- Core unique feature: Figma ↔ CMS roundtrip (diff/preview + manual field re-mapping)
- Business model: White-label SaaS for agencies

### What Makes It Unique (vs Duda, Webflow, Builder.io, Sanity)
No product does: **CMS → Figma → designer edits → diff/preview → re-mapping → deploy**
That's the only genuinely differentiated feature worth building.

### Closest Competitors
- **Duda** — agency-focused, white-label, hosting, site import. No Figma workflow.
- **Builder.io** — visual CMS + Figma plugin. No site import, no hosting.
- **Webflow** — best visual editor + hosting + CMS. Can't import existing sites.
- **Sanity** — best headless CMS. No visual editor, no hosting, no import.

### Recommended Tech Stack
- App framework: Next.js 14+ (App Router)
- Database: PostgreSQL via Supabase
- Auth: Supabase Auth (OAuth2, MFA, RLS for tenant isolation)
- File/asset storage: Supabase Storage / S3
- Client site hosting: S3 + CloudFront
- Visual editor: iframe + postMessage overlay
- Claude integration: Anthropic SDK (claude-sonnet-4-6, configurable)
- Payments: Stripe
- Styling: Tailwind CSS

### Security Requirements (non-negotiable)
- Row Level Security (RLS) — tenant isolation at DB level
- JWT with refresh rotation
- org_id on every data row
- HTTPS enforced, CSP headers, rate limiting
- File upload validation + sandbox
- OWASP Top 10 compliance

### Phased Build Plan
| Phase | Scope | Est. Credits |
|-------|-------|-------------|
| POC | Core edit loop (upload HTML → edit text → preview) | $15–25 |
| Phase 1 MVP | Import + visual edit + S3 deploy + basic auth | $75–100 |
| Phase 2 | Multi-tenant + collections + WordPress import | $75–100 |
| Phase 3 | Framework support + Figma workflow + Stripe | $100–150 |
| Phase 4 | Version history + advanced permissions + analytics | $75–100 |
| **Total** | | **$340–475** |

### White-Label Features (priority order)
1. Custom domain (cms.youragency.com) — Low complexity
2. Custom logo + brand colors — Low
3. Remove all platform traces — Low
4. Custom client email notifications — Low
5. Agency manages client billing — Medium
6. Custom pricing tiers per reseller — Medium
7. Reseller dashboard — Medium
8. Multi-level white-label — High (build last)
