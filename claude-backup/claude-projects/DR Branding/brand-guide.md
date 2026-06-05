# Digital Resource (DR) Brand Guide
> For building DR web applications and digital products
> Last updated from real ad references — patterns reflect actual usage, not theory.

---

## Brand Philosophy

Digital Resource's visual identity is **boldly digital, human-centered, and committed to growth through connection.** The brand communicates:

- **Trust & Expertise** — clean structure, bold typography, consistent hierarchy
- **Innovation & Momentum** — vibrant color accents, subtle gradients, forward-thinking energy
- **Approachability & Culture** — flat iconography, friendly photography, warm tone-of-voice

**Brand voice examples:** *"Made Possible by You"*, *"#WeAreDR"*, *"Proof > Promises"*

---

## Universal Brand Identifier

**Every single DR design includes the 4-square color strip:**
```
[Orange] [Blue] [Lime] [Gray]
```
- Always placed at the **top center** of the layout
- This is the brand watermark — treat it as mandatory
- Order never changes: Orange → Blue → Lime → Gray

---

## The Two Layout Modes

DR design operates in exactly two background modes. Choosing the right one is the first decision in any layout.

### Mode 1 — Dark (Navy) — ~60% of layouts
Used for: **high-impact statements, pain points, lead generation, bold claims**

| Element | Spec |
|---------|------|
| Background | `#010F37` navy |
| Grid texture | Always present — subtle geometric grid overlay at low opacity |
| Headline text | White, extra bold |
| Accent text | Lime highlight box OR vibrant gradient text |
| Icons | 3D glossy/glass style (blue-tinted or transparent) |
| CTA button | Lime pill, navy text |
| Soft corner blur | Never — dark mode uses grid, not blurs |

**When to use:** Problem/pain-point messaging, bold claims, carousels, closing CTAs, lead gen posts.

**Examples:** "Wasted ad spend?", "Is Your Strategy Leaking Revenue?", "We optimize REVENUE.", "Save this post to build your flow!"

---

### Mode 2 — Light (White) — ~40% of layouts
Used for: **education, social proof, team features, approachability, trust-building**

| Element | Spec |
|---------|------|
| Background | `#FFFFFF` or very light off-white |
| Soft corner blurs | Always present — soft orange/green/blue blur in one or two corners |
| Gray dot grid | Present as subtle texture on white areas |
| Headline text | `#010F37` navy, extra bold |
| Accent text | Lime highlight box OR blue underline/inline color |
| Icons | Flat gray outlined icons (`#E5E5E5`) OR 3D blue glass icons |
| Vibrant gradient tubes | Present — wraps around content or bleeds from edges |
| CTA button | Blue pill (softer CTA) or lime pill (strong CTA) |

**When to use:** Educational content, social proof/reviews, team spotlights, methodology explanations, "approachable" messaging.

**Examples:** "Still Thinking About Your Digital Marketing Strategy?", "Meet the Magic Makers", "Don't say it. Show it.", "Your brand isn't competing with AI."

---

## Color Palette

### Primary Colors

| Name | Hex | Frequency | Role |
|------|-----|-----------|------|
| DR Navy | `#010F37` | Always | Background (dark mode) or primary text (light mode) |
| DR Lime | `#D5DE23` | Always | Primary CTA, highlight boxes, badges — most used accent |
| DR Blue | `#26A9E1` | Very often | 3D icons, inline accent words, secondary CTA buttons, gradient element |
| DR Orange | `#F6931E` | Often | Color strip marker, accent dots, gradient endpoints, email/web CTAs |

### Secondary Colors

| Name | Hex | Frequency | Role |
|------|-----|-----------|------|
| White | `#FFFFFF` | Always | Light mode bg, text on dark |
| DR Dark Gray | `#404041` | Moderate | Body text, subheadlines on light bg |
| DR Lime Dark | `#C3CB1D` | Occasional | Lime hover state, lime badge variant |
| DR Gray (strip) | `#808285` | Always | 4th square in color strip watermark |

### Utility Colors

| Name | Hex | Role |
|------|-----|------|
| Gray Line | `#D1D3D4` | Dash lines, dot grid texture, dividers |
| Gray Icon | `#E5E5E5` | Flat outlined icon fills on light backgrounds |

### Color Usage Proportions (per layout)

**Dark Mode layout:**
- Navy: ~75% (background)
- White: ~20% (text, card fills)
- Lime: ~5% (CTA button, 1 highlight box, 1 badge)
- Blue: appears in icons/gradients, not large fills
- Orange: accent dots only (1–2 small dots max)

**Light Mode layout:**
- White/off-white: ~65% (background)
- Navy: ~20% (text, headline)
- Lime: ~10% (highlight box, CTA, badge)
- Blue: ~5% (inline accents, soft corner blur)
- Orange: ~5% (corner blur, gradient endpoints)

### Gradient Rules

**Vibrant gradient order — never reversed:**
```
Blue (#26A9E1) → Lime/Green (#D5DE23) → Orange (#F6931E)
```
- Applied to: tube/pipe shapes, inline text emphasis words, gradient borders on cards
- Never apply gradient behind a vibrant-line element (neon effect)
- Use flat shadow only, never realistic/blurred
- Light mode only for tube shapes — never on dark backgrounds

---

## Typography

### Typeface: Inter Tight — only

**Download:** [Google Fonts — Inter Tight](https://fonts.google.com/specimen/Inter+Tight)

### Two-Tone Headline Pattern (the DR rhythm)

Nearly every DR headline follows this structure:
```
[Regular/Light weight]  → setup, context
[Extra Bold weight]     → punchline, key claim
```

**Examples from ads:**
- "Still Thinking About Your" (regular) + "**Digital Marketing Strategy?**" (bold)
- "We don't optimize ads." (regular) + "**We optimize REVENUE.**" (bold)
- "ROAS only tells part of the story." (bold) + "It ignores everything **happening** around it." (regular + lime word)
- "Stop Blasting." (bold) + "**Start Segmenting.**" (bold — both bold when equal contrast desired)

### Type Scale

| Role | Size | Weight | Notes |
|------|------|--------|-------|
| Display / Hero | 56–72px | 800 | Dark mode hero headlines |
| H1 | 40–48px | 700–800 | Page-level, carousel leads |
| H2 | 32–36px | 700 | Section headings |
| H3 | 24–28px | 600 | Sub-sections, card titles |
| Body Large | 18px | 400 | Lead paragraphs, supporting text |
| Body | 16px | 400 | Default copy |
| Caption / Label | 12–14px | 400–500 | Tags, metadata, badge text |

### Typography Rules
- Inter Tight for ALL text without exception
- The setup line is always noticeably lighter weight than the punchline
- Never use italic as a primary emphasis — use weight and color instead
- Inline colored words (blue, lime gradient) replace italic for emphasis

---

## Logo Usage

- Primary logo: default in **~90% of cases**
- White logo: only on brand-colored backgrounds (Orange, Blue, Lime, Gray)
- Dark Mode logo: only on navy/dark backgrounds
- Alternate logos are support tools, not replacements (~10% of usage)
- Color strip (4 squares) always accompanies the logo or stands alone as identifier

---

## Button System

### Lime Pill — Primary CTA (most common)
**Background:** `#D5DE23` | **Text:** `#010F37` navy | **Shape:** Full pill (border-radius: 9999px)

Used in: ~80% of ads with a CTA
- "Get in touch with us! ↗"
- "See What's Possible ↗"
- "Learn More Below ↓"
- "Get in touch with us! ↗"
- "Get Help From the Experts"
- "Contact Us"

**Icon:** Small circled arrow (↗) on the right side of the button — used in ~70% of lime pill CTAs

**Purpose:** The definitive DR action button. Always the strongest visual CTA on the page.

---

### Blue Pill — Softer / Secondary CTA
**Background:** `#26A9E1` | **Text:** White | **Shape:** Full pill

Used when: the CTA is genuine but less urgent, or on light mode layouts where lime would dominate too aggressively
- "Book a FREE Strategy Call ↗"

**Purpose:** Softer commitment — consultation, booking, exploration. Not contact/lead-gen.

---

### Outlined — Navigation & Filters
**Background:** Transparent | **Border:** Brand color | **Text:** Brand color

Used for:
- Website section navigation
- Filtering projects/services
- Category browsing ("Web Design", "Social Media")

---

### Circled Arrow (→) — Carousel Navigation
**Style:** Thin-stroke circle with arrow inside | **Color:** Navy on light bg, white on dark bg

Used **exclusively** in carousel/multi-slide posts — always in the **top-right corner**. Signals "swipe for more." Never used as a primary CTA.

---

### Circled Swipe Hand — Series Closer
**Style:** Outlined circle with pointing hand icon | **Color:** Lime outline or blue outline

Used at the **bottom-right corner** of the final slide in educational/carousel series. Signals "tap to act."

---

## Design Elements (with real usage frequency)

### The Color Strip Watermark — 100% of designs
Four colored squares: Orange, Blue, Lime, Gray — always top-center. Never skip this.

---

### Lime Highlight Box — ~60% of designs
The most visible DR pattern. A lime/green filled rounded rectangle behind a key word or phrase in the headline.

**Rules confirmed from real ads:**
- One highlight box per layout maximum
- Applied to THE most important word or phrase (the "answer" or "claim")
- Used in both dark and light mode
- On dark bg: white text inside the highlight box
- On light bg: navy text inside the highlight box
- Width fits the text — not full-width unless the phrase fills the line
- Can span 1–2 words ("trust.", "Full picture.", "Passive") or a full phrase ("Digital Marketing Strategy?", "Browse Abandonment")
- Used in body text stats when the stat IS the headline ("94% of visitors")

---

### Lime Circle Badge — ~30% of designs
A circular lime badge with an icon (warning triangle ⚠, bookmark, etc.) and short curved italic text inside. Used as a meta-commentary callout — appears as an "aside" overlapping a corner of the content.

**Placement:** Bottom-left or bottom-right, always overlapping an edge
**Text style:** Curved/italic short phrase — typically 3–6 words
**Purpose:** Commentary on the message, humor, or secondary insight
- "That's the difference!"
- "Generated. Generic. Forgettable."
- "Build brands people believe in."
- "This is what AI can't fake."

**Never use:** As the primary message, in the center of the layout, more than once per design

---

### Grid Texture — dark mode ONLY (~70% of dark layouts)
A subtle geometric grid overlaid on navy backgrounds at low opacity. Creates a "tech/digital" feel.
- Never use on white/light backgrounds
- Keep opacity low — texture, not pattern
- Use the blue-tinted grid (not grayscale)

---

### Soft Corner Blurs — light mode ONLY (~80% of light layouts)
Soft, blurred color blobs in corners of white/light backgrounds. Typical positions: top-left (orange/green), bottom-right (blue/green), or diagonal opposite corners.
- Colors used: orange, lime, blue — always very low opacity, high blur
- Never use on dark/navy backgrounds
- Creates warmth and energy without adding visual clutter
- Never place content over the blurs — background only

---

### Vibrant Gradient Tube/Pipe — light mode mostly (~25% of designs)
A thick, rounded tube shape filled with the Blue→Lime→Orange gradient. Wraps around content or bleeds from canvas edges.
- Always in light mode layouts
- Used as a structural, decorative framing element — not content
- Has a subtle flat shadow/depth (not realistic)
- Can enter from any corner and wrap around a content block
- The flat gray/white shadow behind the tube gives it dimension

---

### 3D Glossy Icons — dark mode mostly (~50% of dark layouts)
High-quality 3D rendered icons (gears, rockets, megaphones, user avatars, magnifiers, glass objects). Color: predominantly blue glass/transparent with highlights.
- Dominant in dark navy layouts
- Add visual interest where text alone would feel flat
- 2–4 icons max per layout
- Never mix flat and 3D icons in the same layout

---

### Gray Outlined Icons — light mode mostly (~40% of light layouts)
Flat, thin-outlined icons in `#E5E5E5` or similar light gray. Used to suggest concepts without competing with content.
- Used on white/light backgrounds only
- 2–3 per layout max
- Placed in negative space, never overlapping text
- Applications: email icons, database, magnifier, browser windows, document icons

---

### Frosted Glass Cards — dark mode (~30% of dark layouts)
Semi-transparent rounded rectangle cards with a frosted/blur fill, used to frame formulas, stats, or supporting content within a dark layout.
- Border: thin line in blue or orange-to-lime gradient
- Content inside: white or light-colored text
- Used for: metric explanations, stat callouts, formula displays
- Never used as primary headline containers — supporting info only

---

### Dashed Border Box — Figma-style edit frame (~25% of designs)
White or orange dashed-line rectangle with small colored squares at corners (orange, blue, lime, or gray), mimicking a Figma selection frame.
- Frames the main headline or primary content block
- Corner squares match brand colors
- Used in both dark and light mode
- Signals "design thinking" / meta-awareness of the design process

---

### Orange Accent Dot — ~80% of designs
A single small solid orange circle (`#F6931E`), placed floating in negative space.
- Always small — decorative, not informational
- Usually 1 per layout, never more than 2
- Position: wherever there's an empty corner or to balance visual weight

---

### Dot Accent (Blue or Lime) — ~40% of designs
Same as orange dot but in blue or lime. Usually accompanies dashed lines or is used as an endpoint on connecting lines.

---

### Gray Arrow — light mode only (~15% of designs)
A hand-drawn-style curved gray arrow, pointing at something in the layout (photo, badge, element).
- Gives a "handmade" or "editorial" feel
- Always pointing at a specific element — never decorative without purpose

---

## Layout Templates (confirmed patterns)

### Template 1 — Dark Bold Statement
**When:** Lead generation, pain points, bold claims
**Structure:**
1. Color strip (top center)
2. Large white headline (2 lines: setup + bold punchline) with lime highlight box
3. 3D icon cluster (top/center visual)
4. Optional frosted glass supporting card
5. Lime pill CTA (bottom center)
6. Orange accent dot (floating)
7. Grid texture on navy bg

---

### Template 2 — Dark Carousel Slide
**When:** Multi-slide educational series
**Structure:**
1. Color strip (top center)
2. Circled arrow → (top right)
3. Large white headline
4. 3D illustrated central object
5. Supporting text or frosted card
6. Swipe hand circle (bottom right, final slide only)
7. Grid texture on navy bg

---

### Template 3 — Light Educate/Approachable
**When:** Education, team features, methodology, trust-building
**Structure:**
1. Color strip (top center)
2. Navy headline (2 lines: setup + bold) with lime highlight box
3. Soft corner blurs (light mode bg)
4. Gray dot grid texture
5. Gray outlined icons in negative space
6. Optional lime circle badge (bottom corner)
7. Dashed border box framing headline
8. Blue or lime CTA (if needed)

---

### Template 4 — Light Vibrant
**When:** Brand energy, announcements, email banners
**Structure:**
1. DR logo (top left)
2. Navy headline with blue inline accent
3. Vibrant gradient tube (entering from corner, wrapping content)
4. 3D blue icon (rocket, etc.)
5. Orange accent dot
6. Gray outlined icons (email, cursor, etc.)
7. White background with soft corner blurs

---

### Template 5 — Light Social Proof
**When:** Reviews, testimonials, results
**Structure:**
1. Color strip (top center)
2. Circled arrow → (top right)
3. Frosted white card (review/quote)
4. Navy bold headline below (2 lines)
5. Vibrant gradient inline word on headline
6. 3D icon accent
7. Soft corner blurs (light bg)
8. Gray dot grid texture

---

### Template 6 — Mockup/Data
**When:** Showing product, emails, results, metrics
**Structure:**
1. Color strip (top center)
2. Navy headline with lime highlight box
3. Phone mockup (black bezel) showing DR product/email
4. Stat callout cards (frosted or white)
5. Gray outlined icons in negative space
6. Swipe hand circle (bottom right)
7. Light background with soft corner blurs

---

## Imagery Guidelines

### Photography
- Real DR team members and real clients — never stock-style posed groups
- Authentic moments: laughing, collaborating, at desks
- Place inside white-bordered frame (with slight shadow) in light mode layouts
- Lime circle badge overlapping the photo frame is a common pattern

### 3D Icons
- Blue-tinted glass or glossy (rocket, gear, megaphone, user avatar, magnifier)
- Used on dark backgrounds for visual weight
- Slightly tilted/angled — never perfectly flat/front-facing

### Mockups
- Phone mockups: black bezel, dark frame
- Browser mockups: white card with red/orange/green dot menu bar
- Always show real DR content inside the mockup — never lorem ipsum

---

## Web App Component System

### Navigation

**Top Nav (dark)**
- Background: `#010F37` navy
- Height: 64px
- Logo: left-aligned, white/light version
- Nav links: white, weight 500, 16px — active link gets lime underline or lime text
- CTA in nav: Lime pill button, right-aligned
- Border-bottom: 1px solid rgba(255,255,255,0.08)

**Sidebar (dark)**
- Background: `#010F37` or slightly lighter `#051533`
- Width: 240px (collapsed: 64px icon-only)
- Active item: lime left border (3px) + lime text
- Hover item: white/10% bg tint
- Icons: 20px, white at 60% opacity → 100% on hover/active
- Section labels: uppercase, 11px, 400 weight, white at 40% opacity

**Breadcrumbs**
- Text: `#404041` → active page: `#010F37` bold
- Separator: `/` or `›` in gray
- Never more than 4 levels deep

---

### Buttons — All States

**Lime Primary (`.dr-btn-primary`)**
```
Default:   bg #D5DE23, text #010F37, no border
Hover:     bg #C3CB1D
Active:    bg #b8bf19, scale(0.98)
Focus:     outline 2px #26A9E1 offset 2px
Disabled:  bg #E5E5E5, text #9CA3AF, cursor not-allowed
Loading:   show spinner, text hidden, same bg
```

**Blue Secondary (`.dr-btn-secondary`)**
```
Default:   bg #26A9E1, text #FFFFFF
Hover:     bg #1d96cc
Active:    bg #1882b3, scale(0.98)
Focus:     outline 2px #D5DE23 offset 2px
Disabled:  bg #E5E5E5, text #9CA3AF
```

**Outlined (`.dr-btn-outline`)**
```
Default:   bg transparent, border 2px #010F37, text #010F37
Hover:     bg #010F37, text white
Active:    bg #051533
Focus:     outline 2px #26A9E1 offset 2px
Disabled:  border #D1D3D4, text #D1D3D4
On dark bg: border white, text white → hover bg white/10
```

**Sizes**
```
sm:  padding 0.4em 1em,  font 14px, height 36px
md:  padding 0.6em 1.5em, font 16px, height 44px  (default)
lg:  padding 0.75em 2em, font 18px, height 52px
```

**Arrow icon on CTA buttons:** 20px circle with ↗ inside — right side of button, always

---

### Form Elements

**Text Input**
```
Default:  border 1.5px #D1D3D4, bg white, text #010F37, radius 8px, height 44px, padding 0 16px
Focus:    border 2px #26A9E1, outline none, shadow 0 0 0 3px rgba(38,169,225,0.15)
Error:    border 2px #EF4444, shadow 0 0 0 3px rgba(239,68,68,0.12)
Success:  border 2px #22C55E
Disabled: bg #F9FAFB, text #9CA3AF, cursor not-allowed
```

**Label:** 14px, weight 600, `#010F37`, margin-bottom 6px
**Helper text:** 13px, weight 400, `#404041`, margin-top 4px
**Error message:** 13px, weight 500, `#EF4444`, margin-top 4px

**Select / Dropdown**
- Same border/radius as text input
- Chevron icon: `#010F37` on the right
- Option hover: lime bg at 10% opacity

**Checkbox**
```
Unchecked: border 2px #D1D3D4, bg white, 18px × 18px, radius 4px
Checked:   bg #D5DE23, border #D5DE23, white checkmark inside
Focus:     outline 2px #26A9E1
```

**Toggle/Switch**
```
Off: bg #D1D3D4, thumb white
On:  bg #D5DE23, thumb white
Size: 44px × 24px, thumb 20px
```

**Search Input**
- Magnifier icon left-side (16px, `#9CA3AF`)
- Keyboard shortcut badge right-side (⌘K style) when applicable
- Border radius: 9999px (pill shape) — search inputs are always pill

---

### Cards

**Default Card (light sections)**
```
bg: white
border: 1px solid #F3F4F6
border-radius: 16px
padding: 24px
shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)
hover shadow: 0 4px 12px rgba(0,0,0,0.1)
```

**Dark Card (dark sections)**
```
bg: rgba(255,255,255,0.05)
border: 1px solid rgba(255,255,255,0.1)
border-radius: 16px
padding: 24px
```

**Frosted Glass Card (dark sections — metrics, formulas)**
```
bg: rgba(255,255,255,0.08)
backdrop-filter: blur(12px)
border: 1px solid rgba(255,255,255,0.15)
border-radius: 16px
— OR gradient border: linear-gradient(#26A9E1, #D5DE23) as border
```

**Stat Card**
```
Contains: label (12px, uppercase, gray), value (32px, extrabold, white or navy),
          trend indicator (↑ lime / ↓ red), sparkline optional
Padding: 20px 24px
```

**Feature Card (lime accent top border)**
```
border-top: 3px solid #D5DE23
otherwise same as Default Card
```

---

### Badges & Tags

| Style | Bg | Text | Use |
|-------|----|------|-----|
| Lime | `#D5DE23` | `#010F37` | Primary status, active, featured |
| Blue | `rgba(38,169,225,0.15)` | `#26A9E1` | Info, in-progress |
| Orange | `rgba(246,147,30,0.15)` | `#c97200` | Pending, warning |
| Success | `rgba(34,197,94,0.15)` | `#16a34a` | Completed, live |
| Error | `rgba(239,68,68,0.15)` | `#dc2626` | Failed, error |
| Gray | `#F3F4F6` | `#404041` | Neutral, default |

Shape: border-radius 9999px (pill) | Padding: 4px 10px | Font: 12px weight 600 uppercase

---

### Alerts & Notifications

```
Success: left border 4px #22C55E, bg rgba(34,197,94,0.08), icon ✓ green
Error:   left border 4px #EF4444, bg rgba(239,68,68,0.08), icon ✗ red
Warning: left border 4px #F6931E, bg rgba(246,147,30,0.08), icon ⚠ orange
Info:    left border 4px #26A9E1, bg rgba(38,169,225,0.08), icon ℹ blue
```
All: border-radius 8px (right side), padding 16px, white bg

**Toast notifications:** Same color coding, appear bottom-right, max-width 360px, shadow-md

---

### Tables

**Header row:** bg `#010F37`, text white, weight 600, 13px uppercase, letter-spacing 0.05em
**Body rows:** alternating white / `#F9FAFB`
**Row hover:** `rgba(38,169,225,0.06)` bg tint
**Active/selected row:** left border 3px `#D5DE23`, bg `rgba(213,222,35,0.06)`
**Border:** 1px solid `#F3F4F6` between rows
**Pagination:** outlined buttons for prev/next, lime for current page number

---

### Page States

**Empty State**
```
Center-aligned in container
Large gray icon (64px, #E5E5E5) or illustration
H3 headline: "No [items] yet" — navy, weight 700
Subtext: helpful next step — gray, 400 weight
CTA: Lime pill button below
Optional: dashed border box around the whole empty state area
```

**Loading / Skeleton**
```
Skeleton blocks: bg linear-gradient(90deg, #F3F4F6, #E9EBEF, #F3F4F6)
background-size: 400% 100%
animation: shimmer 1.5s ease infinite
border-radius: matches the real element's radius
```

**Error State (page-level)**
```
Same structure as empty state
Icon: red/orange warning symbol
Headline: "Something went wrong"
CTA: "Try again" (outlined) + "Contact support" (text link in lime)
```

**Success State**
```
Icon: lime checkmark circle (64px)
Headline: confirmation message — navy, weight 700
Subtext: next steps — gray
CTA: "Go to [destination]" lime pill
```

---

### Data Visualization

Use DR brand colors in this priority order for chart series:
1. `#26A9E1` — blue (primary data)
2. `#D5DE23` — lime (secondary / comparison)
3. `#F6931E` — orange (tertiary / benchmark)
4. `#010F37` — navy (total / baseline)
5. `#D1D3D4` — gray (inactive / disabled series)

**Chart backgrounds:** white (light sections) or `rgba(255,255,255,0.05)` (dark sections)
**Grid lines:** `#F3F4F6` (light) or `rgba(255,255,255,0.08)` (dark)
**Axis labels:** 12px, `#9CA3AF`

---

### Spacing System

Base unit: **4px**

| Token | Value | Common use |
|-------|-------|-----------|
| `--dr-space-1` | 4px | Tight icon gaps |
| `--dr-space-2` | 8px | Inner badge padding |
| `--dr-space-3` | 12px | Small gaps |
| `--dr-space-4` | 16px | Default padding unit |
| `--dr-space-6` | 24px | Card padding, section gap |
| `--dr-space-8` | 32px | Between cards |
| `--dr-space-12` | 48px | Section vertical padding |
| `--dr-space-16` | 64px | Large section spacing |
| `--dr-space-20` | 80px | Hero padding |
| `--dr-space-24` | 96px | Between major page sections |

---

### Page Layout Templates (Web Apps)

**Dashboard Shell**
```
[Top Nav — navy, 64px]
[Sidebar — navy, 240px] | [Main content — white/light, flex-1]
                        | [Content padding: 32px]
```

**Landing Page Section Order**
```
1. Hero       — dark navy, full-width, centered, grid texture
2. Services   — white, 3-column card grid
3. Proof      — dark navy, stat cards or testimonials
4. How it works — white, numbered steps with icons
5. CTA banner — dark navy, centered headline + lime button
6. Footer     — dark navy
```

**Auth Pages (Login / Signup)**
```
Left panel:  dark navy, DR branding, headline, social proof stat
Right panel: white, form, logo top-left
Mobile:      single column, white, logo top-center
```

---

## Web App Rules (specific to digital products)

1. Always Inter Tight — no exceptions, no fallback display fonts in brand materials
2. **Dark mode sections:** Navy bg + grid texture + white text + lime CTAs
3. **Light mode sections:** White bg + soft blurs + navy text + lime CTAs
4. Lime pill button = primary CTA. Always. One per section max.
5. Blue pill button = softer secondary CTA (consultations, demos)
6. Outlined button = nav/filter only, never primary action
7. Highlight box on 1 key phrase per section — headline level only
8. Lime circle badge = optional callout/aside — 1 per design, corner placement only
9. Frosted glass cards = metrics, formulas, supporting data — dark sections only
10. Gradient tubes = light sections only — never dark
11. 3D icons = dark sections | Gray outlined icons = light sections (don't mix)
12. Color strip watermark = every major section header or card
13. Orange dots = always decorative, always small, 1–2 per layout
14. Circled arrow → = carousel/pagination only, top-right corner
15. Vibrant gradient word = used sparingly (1 impactful word), never whole headlines

---

## Quick Reference

```
BACKGROUNDS
Dark mode:   #010F37 + grid texture (60% of layouts)
Light mode:  #FFFFFF + soft corner blurs (40% of layouts)

COLORS
Navy:         #010F37   — bg (dark) or primary text (light)
Lime:         #D5DE23   — CTA, highlight box, badge (every layout)
Blue:         #26A9E1   — 3D icons, inline accent, secondary CTA
Orange:       #F6931E   — color strip, accent dots, gradient endpoint
Gray strip:   #808285   — 4th square of color watermark
Lime Dark:    #C3CB1D   — lime hover state
Dark Gray:    #404041   — body text (light mode)
Gray Line:    #D1D3D4   — dash lines, dot grid
Gray Icon:    #E5E5E5   — flat outlined icons (light mode)

FONT
Family:   Inter Tight
Weights:  400 (regular) / 700 (bold) / 800 (extrabold)
Pattern:  Line 1 regular weight → Line 2 extrabold (setup + punchline)

BUTTONS (priority order)
1. Lime pill + ↗ icon  → primary CTA (contact, lead gen, main action)
2. Blue pill + ↗ icon  → secondary CTA (book a call, explore)
3. Outlined            → navigation/filter only
4. Circled arrow →     → carousel next-slide (top-right, never CTA)
5. Swipe hand circle   → series closer (bottom-right, final slide)

GRADIENT ORDER
Blue (#26A9E1) → Lime (#D5DE23) → Orange (#F6931E)
Never reversed. Used on tubes (light mode) and inline text accents.

UNIVERSAL ELEMENTS (every layout)
- 4-square color strip [Orange][Blue][Lime][Gray] — top center
- Lime accent in some form (CTA, highlight, or badge)
- Orange accent dot (1–2 small, decorative)

DARK MODE ONLY          LIGHT MODE ONLY
Grid texture            Soft corner blurs
3D glass/glossy icons   Gray flat outlined icons
Frosted glass cards     Vibrant gradient tubes
                        Gray dot grid texture
                        Gray curved arrows
```
