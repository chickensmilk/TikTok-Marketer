# DR Branding — Claude Context File
> Auto-loaded by Claude Code every session. Do not delete.
> Last session: 2026-04-06

---

## Project Purpose
Build and maintain the Digital Resource (DR) brand guide and web app design system.
All files live in: `~/claude-projects/DR Branding/`

## Files in This Folder
| File | What it is |
|------|-----------|
| `brand-guide.md` | Full brand documentation — philosophy, colors, typography, components, layout templates, web app rules |
| `tokens.css` | Complete CSS design system — all tokens, component classes, states, dark mode, app shell |
| `tailwind.brand.js` | Tailwind CSS preset — drop into any DR project |
| `brand-guide.html` | Visual styleguide — open in browser to see everything rendered |
| `CLAUDE.md` | This file |

Open the visual styleguide anytime:
```bash
open ~/claude-projects/DR\ Branding/brand-guide.html
```

---

## What Was Built This Session

### Sources Used
- Milanote brand board exported as PDF (`canvas_dr-future-facing-identity-260403_0146.pdf`)
- 25+ real DR ad images (social posts, banners, email assets, animated ads)
- Patterns derived from actual usage, not just written rules

### Deliverables
1. **`brand-guide.md`** — comprehensive brand documentation including:
   - Brand philosophy and voice
   - Full color palette with usage proportions
   - Two layout modes (dark/light) with when-to-use rules
   - Typography scale and the setup+punchline headline pattern
   - Button system with all 4 types and priority order
   - All design elements with real frequency data (highlight box, circle badge, grid texture, etc.)
   - 6 confirmed layout templates from real ads
   - Full web app component system (nav, sidebar, forms, cards, badges, alerts, tables, states, data viz, spacing)
   - Page layout templates (dashboard shell, landing page, auth page)

2. **`tokens.css`** — production-ready CSS including:
   - All design tokens as CSS custom properties
   - Full component classes with hover/focus/active/disabled/error/success states
   - Dark mode overrides
   - App shell grid layout
   - Skeleton loading animation
   - Grid texture and dot grid as pseudo-elements
   - Soft corner blur utility

3. **`tailwind.brand.js`** — Tailwind preset with DR colors, fonts, shadows, gradients, animations

4. **`brand-guide.html`** — self-contained visual styleguide rendered in the browser showing every component

---

## Key Decisions & Insights

- **Lime is the dominant accent, not orange.** The PDF positions them equally but real ads show lime in every layout; orange is almost always just a small decorative dot (1–2 per layout).
- **Orange is used differently in print/social vs web.** More visible in email/web CTAs, but in social ads it's only an accent dot and gradient endpoint.
- **Dark mode is the primary mode (~60%).** Most bold, lead-gen, and CTA-heavy content lives on navy.
- **3D glass icons = dark only. Gray flat icons = light only.** Never mix.
- **Grid texture = dark only. Soft corner blurs = light only.** Never mix.
- **The 4-square color strip [Orange][Blue][Lime][Gray] appears in every single design** — it is the universal brand watermark.
- **"Wrap this up"** is the user's end-of-session command — update CLAUDE.md with full session summary.

---

## DR Brand — Fast Reference

**Two layout modes:**
- **Dark (~60%):** `#010F37` navy bg + blue grid texture + white text + 3D icons → bold claims, lead gen
- **Light (~40%):** White bg + soft corner blurs + navy text + gray flat icons → education, trust, social proof

**Universal rule:** Every layout has the 4-square color strip [Orange][Blue][Lime][Gray] at top-center.

**Colors:**
- `#010F37` Navy — bg (dark) or primary text (light)
- `#D5DE23` Lime — CTA, highlight box, badge — in EVERY layout
- `#26A9E1` Blue — 3D icons, inline accent, secondary CTA
- `#F6931E` Orange — color strip, small accent dots only (1–2), gradient endpoint
- `#C3CB1D` Lime Dark — lime hover state
- `#404041` Dark Gray — body text (light mode)
- `#D1D3D4` Gray Line — dash lines, dot grid, dividers
- `#E5E5E5` Gray Icon — flat outlined icons (light mode only)

**Font:** Inter Tight only. Weights 400/600/700/800.
**Headline pattern:** Line 1 regular weight (setup) → Line 2 extrabold (punchline)

**Buttons (priority order):**
1. Lime pill + ↗ = primary CTA (contact, get help, main action)
2. Blue pill + ↗ = softer CTA (book a call, demo)
3. Outlined = nav/filter only
4. Circled → = carousel pagination only (top-right corner, never a CTA)

**Gradient:** Blue (#26A9E1) → Lime (#D5DE23) → Orange (#F6931E). Never reversed. Tubes on light mode only.

**Dark mode only:** Grid texture, 3D glass icons, frosted glass cards
**Light mode only:** Soft corner blurs, vibrant gradient tubes, gray flat icons, dot grid

**Lime highlight box:** 1 per layout max. Most important word/phrase in headline only.
**Lime circle badge:** Circular aside callout, bottom corner, max 1 per design.
**Orange dot:** Always small/decorative, 1–2 per layout, never a large fill.

---

## How to Use in a Web App
```html
<link rel="stylesheet" href="/path/to/tokens.css">
```
For Tailwind projects:
```js
const drBrand = require('./tailwind.brand.js')
module.exports = { presets: [drBrand] }
```

---

## Open Items / Next Steps
- [ ] No specific next tasks assigned yet — waiting for direction
- Possible next steps discussed: component library starter, Figma design system, specific app type (dashboard, landing page)
- User mentioned wanting to use this for building DR web apps consistently

---

## How to Resume
```bash
cd ~/claude-projects/DR\ Branding && claude
```
This file loads automatically. No re-explaining needed — just start building.
