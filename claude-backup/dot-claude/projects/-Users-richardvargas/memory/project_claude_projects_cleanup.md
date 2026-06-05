---
name: project_claude_projects_cleanup
description: "Audit and partial cleanup of ~/claude-projects/ — what was done and what's still pending"
metadata: 
  node_type: memory
  type: project
  originSessionId: f03e50ce-4861-4a75-90aa-7abdc92a785c
---

On 2026-05-15, audited all folders in `~/claude-projects/` and `~/.claude/projects/`.

**Completed:**
- Deleted `example-site` (HTTrack test scrape of example.com)
- Deleted `thebethlehemdds` (HTTrack scrape artifacts only)
- Moved `dr-logo.jpg` and `dr-logo-banner.jpg` from `DR Branding for Claude` → `DR Branding`, then deleted `DR Branding for Claude`

**Kept (intentionally):**
- `cloned-site` — scrape of thebethlehemdds.com, user wants to keep
- `dr-cms` — older Next.js CMS attempt, user wants to keep
- `DR Jarvis BC` — early Basecamp prototype HTML, user wants to keep
- `site-cloner` — Node.js site-cloning utility, still useful
- `Email Signature App OLD` — older app version, kept as backup

**Still pending — missing memory files for these projects:**
- Creative Ops Assistant (`~/claude-projects/Creative Ops Assistant/`)
- Instapage (`~/claude-projects/Instapage/`)
- Madison Webflow Claude CMS Update (`~/claude-projects/Madison Webflow Claude CMS Update/`)
- DR Jarvis BC (`~/claude-projects/DR Jarvis BC/`)
- Wolf Dental Spa (`~/claude-projects/Wolf Dental Spa/`)

**Why:** Organized so future sessions have context on each project without re-exploring the filesystem.

**How to apply:** When working in any of the "still pending" projects above, note the lack of memory and offer to create one at session end.
