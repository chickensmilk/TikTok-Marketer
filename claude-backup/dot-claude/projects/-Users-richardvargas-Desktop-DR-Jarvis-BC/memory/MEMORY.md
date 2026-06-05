# DR Jarvis BC — Project Memory

## DR CMS Project
- **Location:** `~/Desktop/dr-cms`
- **Stack:** Next.js 16.1.6 (App Router) + TypeScript + Tailwind v4 + Supabase + TipTap
- **Status:** Built & passing `npm run build`. Needs `.env.local` configured with Supabase credentials.
- **Supabase SQL schema:** `~/Desktop/dr-cms/supabase-setup.sql`

## Key Brand Colors (Bethlehem DDS / Wolfe Dental Spa)
- Primary: `#30228e`
- Gold: `#c5a26f`
- Text gray: `#7c8196`
- Font: Poppins (300,400,500,600,700)
- Container max: `80rem`
- Hero gradient: `linear-gradient(-30deg, rgba(0,0,0,0.13), #30228e)`

## CDN Assets (Webflow)
- Logo: `https://cdn.prod.website-files.com/68ee9de0af8f73471751af47/68f0109924ec4798a7974d63_logo%20(1).avif`
- Front office image: `https://cdn.prod.website-files.com/68ee9de0af8f73471751af47/68efd3b659ac64f5fc4392ea_front.avif`
- Dr. Mrinal Ganti: `https://cdn.prod.website-files.com/68ee9de0af8f73471751af67/68efd482f3b35289f9d96d56_dr-mrinal-ganti.jpg`

## Supabase Setup Instructions
1. Create free project at supabase.com
2. Run `supabase-setup.sql` in SQL Editor
3. Copy URL + anon key to `.env.local`
4. Optionally add service role key for admin write ops

## Architecture Notes
- Tailwind v4: no separate config file — CSS vars in `globals.css`
- Supabase client is lazy (returns null if env vars missing) — build works without credentials
- `createServerClient()` used in Server Components & API routes
- TipTap editor loaded with `dynamic(..., { ssr: false })`

## Cloned Site Source
`~/Desktop/cloned-site/www.thebethlehemdds.com/index.html`

## Next Feature to Build
- [Website Editor — Visual /admin/editor](project_website_editor.md) — Click-to-edit text, image upload, live preview. Basic editor agreed on. Pick up here next session.
