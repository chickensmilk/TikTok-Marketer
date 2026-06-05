---
name: logo-pipeline
description: >
  14-stage agency-grade logo and brand identity pipeline for Digital Resource.
  Replaces manual research, ideation, competitor analysis, and documentation so
  designers focus on creative direction, judgment, and refinement. Every design
  decision is backed by research data and logged in a structured Brand Brief.
  Button-driven UX throughout — designers click, not type. Stages: Onboarding →
  Discovery + Positioning → Research → Mood Board → Concept Development → Logo
  Generation → Refinement → Revisions → Internal Review → Logo Lock → Variations →
  Color + Type → Production Assets → Brand Guide → Internal Cost Report.
  Trigger on "/logo-pipeline", "start a logo project", "brand identity project",
  "build a brand guide", "new logo project".
---

# Logo Pipeline — Agency Brand Identity System

A 14-stage pipeline: Onboarding → Discovery → Research → Mood Board → Concept
Development → Logo Generation → Refinement → Revisions → Internal Review →
Logo Lock → Variations → Color + Type → Production Assets → Brand Guide →
Internal Cost Report.

**Purpose:** Eliminate the grunt work. Claude handles all research, analysis,
ideation, generation, and documentation. Designers handle creative direction at
every gate, model selection, prompt refinement, and final vector production.
Every pixel in the final logo has a documented reason.

**Goal for AI generation:** 90%+ complete logos ready for vectorization. Clean,
flat, vector-suitable marks — not concepts to redesign from scratch.

---

## UX RULES — HARD

**Button-driven.** Every gate, every question, every confirmation is an
AskUserQuestion call with 2–4 concrete option buttons. No free-form navigation.
Only content the designer must originate (client name, custom notes) requires
typing — and even then, always offer a smart default they can accept in one click.

**No-pause rule.** Bundle all clarifying questions into a single AskUserQuestion
call. Never ask questions sequentially that could be asked together.

**Stage banners.** Send one clear banner at the start of each stage:

> **[emoji] Stage [N]: [friendly name] — starting now.**
> *Plain-language description, 1–2 sentences. No tool names.*

**Silent internals.** Never narrate tool names, search queries, MCP calls, or
technical mechanics to the designer. A short status line is fine; a tool log is not.

**Decision logging.** After every gate, log the decision to the Brand Brief's
DECISION_LOG section. Every approval, kill, revision, and rationale is recorded.

**Three gate states.** Every concept at every gate has exactly one status:
- **Pass** — advances to next stage as-is
- **Revise** — advances but with specific changes required
- **Fail** — killed, archived with reason logged

**Stage banners reference:**

| Stage | Banner |
|---|---|
| 0 | **📋 Stage 0: Onboarding — starting now.** Getting the project brief, naming protection, and design constraints locked before anything else. |
| 1 | **🎯 Stage 1: Discovery + Positioning — starting now.** Building the strategic foundation: who this brand is, what it stands for, and how it needs to show up. |
| 2 | **🔍 Stage 2: Research + Competitor Analysis — starting now.** Scanning the competitive landscape, surfacing visual trends, and identifying where this brand can own territory. |
| 3 | **🎨 Stage 3: Mood Board — starting now.** Generating visual references to align on aesthetic direction before any concept work begins. |
| 4 | **💡 Stage 4: Concept Development — starting now.** Word mapping, concept directions, sketch-level concepts, and the kill gate. Weak ideas die here — not after generation. |
| 5 | **⚡ Stage 5: Logo Generation — starting now.** Generating polished logo concepts from approved directions. Clean, flat, vector-ready. |
| 6 | **✏️ Stage 6: Refinement — handing off.** Flagging AI artifacts and geometry issues. Designer rebuilds in vector. |
| 7 | **✅ Stage 7: Revisions + Trademark Validation — starting now.** Refining approved marks and running final trademark clearance. |
| 8 | **👁️ Stage 8: Internal Review — starting now.** Scoring concepts on strategy, design quality, differentiation, and technical execution before client sees anything. |
| 9 | **🔒 Stage 9: Logo Lock — starting now.** Locking the primary mark. Archiving all other directions. Freezing the rationale trail. |
| 10 | **📐 Stage 10: Variations + Expansion Check — starting now.** Generating the full lockup set and testing against all real-world use cases. |
| 11 | **🎨 Stage 11: Color + Typography — starting now.** Building the color system and type pairing from the approved mark and brand brief. |
| 12 | **📦 Stage 12: Production Assets — starting now.** Preparing the full file export package: SVG, PNG, favicon, social, print specs. |
| 13 | **📖 Stage 13: Brand Guide — starting now.** Assembling the full brand identity document with rationale behind every decision. |
| 14 | **💰 Stage 14: Internal Cost Report — generating silently.** DR-only. Never shown to client. |

---

## BRAND BRIEF SCHEMA

The Brand Brief is a structured document maintained throughout the entire pipeline.
Every stage reads from and writes to specific sections. Save as
`/mnt/user-data/outputs/[client-slug]-brand-brief.json` after each stage.
This file is the single source of truth for all generation prompts and the
rationale trail.

```
BRAND_BRIEF {
  CLIENT_PROFILE {
    name: string
    industry: string
    business_description: string
    target_audience: string
    existing_brand_equity: string | null
  }

  CONSTRAINTS {
    embroidery_needed: boolean
    vehicle_wraps: boolean
    franchise_rollout: boolean
    single_color_printing: boolean
    favicon_critical: boolean
    packaging: boolean
    signage: boolean
    merchandise: boolean
    notes: string
  }

  NAMING_PROTECTION {
    domain_available: boolean | "not_checked"
    social_handles: { platform: string, available: boolean }[]
    trademark_preliminary: "pass" | "caution" | "conflict"
    attorney_recommended: boolean
  }

  POSITIONING {
    archetype: string
    brand_promise: string
    key_differentiator: string
    want_words: string[]   // exactly 3
    avoid_words: string[]  // exactly 3
    audience_aesthetics: string
  }

  RESEARCH_FINDINGS {
    industry_visual_trends: string[]
    dominant_styles: string[]
    emerging_styles: string[]
    sources: string[]
  }

  COMPETITOR_AUDIT {
    competitors: {
      name: string
      logo_style: string        // wordmark | lettermark | icon | combination | emblem
      primary_color: string
      mark_type: string
      notes: string
    }[]
    overused_elements: string[]
    visual_cliches: string[]
  }

  COLOR_ANALYSIS {
    highly_owned: { color: string, owners: string[] }[]
    moderately_owned: { color: string, owners: string[] }[]
    opportunity: { color: string, rationale: string }[]
  }

  EARLY_TRADEMARK_FILTER {
    style_conflicts: string[]
    cliche_warnings: string[]
    risk_flags: string[]
    symbols_to_avoid: string[]
  }

  MOOD_DIRECTION {
    keywords: string[]      // 5–8 approved direction words
    color_direction: string
    reference_notes: string
  }

  CONCEPT_DIRECTIONS {
    directions: {
      id: string            // A, B, C, D, E
      name: string
      symbol_idea: string
      typography_anchor: string
      color_family: string
      strategic_rationale: {
        why_symbol_exists: string
        business_goal_supported: string
        competitors_differentiated_from: string
        visual_territory_owned: string
        customer_perception_created: string
      }
      vectorizability_score: "high" | "medium" | "low"
      trademark_risk: "low" | "medium" | "high"
      constraint_compatibility: string
      score_summary: string   // qualitative, data-backed — no invented numbers
      status: "pending" | "advance" | "revise" | "kill"
      kill_reason: string | null
    }[]
  }

  GENERATION_HISTORY {
    runs: {
      direction_id: string
      model: string
      prompt: string
      outputs: string[]     // job IDs or image URLs
      selected: string[]
    }[]
  }

  REFINEMENT_NOTES {
    direction_id: string
    artifacts_to_fix: string[]
    geometry_notes: string
    typography_notes: string
    designer_notes: string
    status: "pending" | "complete"
  }

  TRADEMARK_FINDINGS {
    wipo_search: string
    uspto_search: string
    reverse_image_notes: string
    risk_level: "low" | "medium" | "high"
    attorney_recommended: boolean
  }

  LOGO_LOCK {
    selected_direction_id: string
    rationale: string
    locked_at: string         // stage and date
    archived_directions: string[]
  }

  FINAL_SPECIFICATIONS {
    primary_colors: { name: string, hex: string, rgb: string, cmyk: string }[]
    secondary_colors: { name: string, hex: string, rgb: string, cmyk: string }[]
    accent_colors: { name: string, hex: string, rgb: string, cmyk: string }[]
    primary_font: { name: string, weight: string, use: string }
    secondary_font: { name: string, weight: string, use: string }
    logo_clear_space: string
    minimum_size: string
    usage_rules: string[]
  }

  DECISION_LOG {
    entries: {
      stage: string
      decision: string
      rationale: string
      rejected_options: { option: string, reason: string }[]
    }[]
  }
}
```

---

## GENERATION ENGINES

Four models available via Higgsfield `generate_image`. Designer selects per
concept direction — different models produce different aesthetics. Engine choice
is surfaced to the designer as a decision, not a technical detail.

| Model | `model` param | Cost | Best for |
|---|---|---|---|
| **GPT Image 2** | `"gpt_image_2"` | Paid | Clean, precise, minimal. Sharpest vector-ready output. Best for final polish pass. |
| **Nano Banana Pro** | `"nano_banana_pro"` | Free | Higher-fidelity stylized. Good for personality-heavy brands. Iterate freely. |
| **Nano Banana 2** | `"nano_banana_2"` | Free | Expressive, loose, painterly. Best for early concept exploration. |
| **Flux 2** | `"flux_2"` | Paid | Artistic, strong visual character. Good for brand-forward marks. |

**Usage strategy (present to designer as a recommendation, not a rule):**
- Nano Banana Pro / Nano Banana 2 for concept exploration — free, iterate aggressively
- GPT Image 2 for final quality pass once direction is locked
- Flux 2 for directions needing strong artistic character
- Run multiple models on the same direction when the designer wants to compare

---

## VECTOR-READY PROMPT CONSTRAINTS

These constraints are **mandatory** in every logo generation call. They are what
get outputs to 90%+ vector-ready. Prepend them to every prompt. Never omit.

```
Flat vector logo design. Clean geometric forms. Solid fill colors only.
No gradients. No texture. No shadows. No photorealism. No fine detail.
White background. Simple enough to trace as SVG vector. Suitable for
single-color printing and embroidery. Professional logo mark.
```

For wordmark-style logos, also add:
```
Clean typographic logo. Precise letterforms. No hand-drawn distortion.
Legible at small sizes.
```

For icon + wordmark combinations, also add:
```
Simple icon mark paired with clean wordmark. Icon and wordmark share consistent
visual characteristics. Balanced composition. Both elements readable at favicon size.
```

Total prompt length: ≤80 words including constraints and concept specifics.
Long prompts degrade output quality — distill, do not dump.

---

## HARD LIMITS — GENERATION

| Limit | Value | Why |
|---|---|---|
| Max concept directions generated | 5 | Quality drops beyond this |
| Max directions advancing past kill gate | 3 | Best presentations show 2–3 |
| Max logos generated per direction | 10 | Iterate within, not across |
| Max polished concepts total | 30 | Quality over quantity |

If the designer tries to advance more than 3 directions, prompt:
> "Best brand presentations show 2–3 directions. Which 3 are strongest?"

---

## STAGE 0 — Onboarding + Naming Protection + Constraints

> Send Stage 0 banner. Collect everything needed before a single research call
> fires. All questions in ONE AskUserQuestion — never sequential.

**Single AskUserQuestion covering A + B + C + D:**

**A — Starting stage**
- "Full pipeline — new project from scratch (Recommended)"
- "Jump to Stage 4 — I have research and a brief"
- "Jump to Stage 5 — I have approved directions ready to generate"
- "Jump to Stage 13 — logo approved, need the brand guide"

**B — Client constraints (multiSelect — check all that apply)**
- Embroidery needed
- Vehicle / truck wraps
- Franchise rollout
- Single-color printing critical
- Favicon size critical
- Packaging application
- Signage / large format
- Merchandise / apparel

**C — Existing brand equity**
- "Completely new brand — no existing assets"
- "Refresh — evolving an existing logo"
- "Rebrand — existing equity to consider"

**D — Naming protection**
- "Name is established — skip naming check"
- "Name is new — run naming protection now"

**Also ask for client name inline** if not provided in the trigger args.

**If D = "Name is new" — run silently after onboarding:**
1. Web search: `[client name] .com domain available`
2. Web search: `[client name] trademark registered`
3. Web search: `[client name] Instagram handle available`
4. Web search: `[client name] LinkedIn company page`

Report findings as a single naming protection summary before Stage 1 starts.
Flag conflicts clearly. Recommend attorney if trademark results are ambiguous.

Write all findings to `BRAND_BRIEF.CLIENT_PROFILE`, `BRAND_BRIEF.CONSTRAINTS`,
and `BRAND_BRIEF.NAMING_PROTECTION`.

**Gate:** AskUserQuestion
- "Onboarding complete — start Stage 1 (Recommended)"
- "Adjust constraints before continuing"

Log to `BRAND_BRIEF.DECISION_LOG`.

---

## STAGE 1 — Discovery + Positioning

> Send Stage 1 banner. This is the strategic foundation. Every generation prompt,
> every concept direction, and every rationale in the brand guide traces back here.

### Step 1 — Discovery questionnaire

Single AskUserQuestion — all buttons, smart defaults auto-derived from industry:

- **Target audience:** 4 demographic/psychographic options derived from industry + "Other"
- **Brand personality (multiSelect — pick up to 5):**
  Professional · Playful · Bold · Minimal · Warm · Innovative · Traditional ·
  Luxurious · Approachable · Authoritative · Edgy · Trustworthy · Fun · Sophisticated
- **Brand archetype:**
  Hero · Sage · Creator · Caregiver · Ruler · Explorer · Innocent · Jester ·
  Lover · Magician · Outlaw · Everyman
- **Three words client WANTS associated (multiSelect — pick exactly 3)**
- **Three words client WANTS TO AVOID (multiSelect — pick exactly 3)**
- **Brand promise:** "Help me draft one based on the brief" / "I'll write it"

### Step 2 — Positioning synthesis (internal — silent)

From questionnaire answers, generate and present:

- **Brand archetype** with explanation (why this archetype fits this business)
- **Brand promise** (1 sentence — what the brand delivers and to whom)
- **Key differentiator** (what separates them from the generic category)
- **Want/Avoid word rationale** (why these words matter for visual direction)
- **Audience aesthetics** (what visual language appeals to this specific audience)

Write to `BRAND_BRIEF.POSITIONING`.

**Gate:** AskUserQuestion
- "Positioning is accurate — proceed to Research (Recommended)"
- "Adjust the archetype"
- "Rework the brand promise"
- "Change the want/avoid words"

Log to `BRAND_BRIEF.DECISION_LOG`.

---

## STAGE 2 — Research + Competitor Analysis + Early Trademark Filter

> Send Stage 2 banner. All research runs silently. Present findings as a
> structured report — not a search log, not a URL dump.

### Step 1 — Competitor identification

AskUserQuestion:
- "Find competitors automatically based on industry (Recommended)"
- "I'll name the main competitors"
- "Both — I'll name some, you find more"

If designer names competitors, record them. Then supplement via research.

### Step 2 — Research (8 web searches, run in parallel, internal — silent)

Replace `[industry]`, `[client name]`, `[location]` as relevant:

1. `[industry] logo design trends 2026`
2. `[industry] brand identity visual styles`
3. `[industry] competitor logos [location if local]`
4. `top [industry] brands visual identity`
5. `[industry] color psychology branding`
6. `[industry] logo clichés to avoid`
7. `[client name] competitors logos`
8. `[industry] logo trademark conflicts common`

Fetch 2 most useful result pages for deeper content extraction.

### Step 3 — Competitor visual audit

For each competitor, extract:
- Logo style: wordmark | lettermark | icon | combination | emblem
- Primary brand color (specific — not just "blue," but "navy" or "cobalt")
- Mark characteristics: geometric / illustrative / typographic / abstract
- Visual territory occupied

### Step 4 — Color gap analysis

Map all competitor primary colors across the spectrum. Output three tiers:

**Highly Owned** — 3+ competitors use this color family. High risk entering this
territory without strong differentiation strategy.

**Moderately Owned** — 1–2 competitors. Ownable with the right execution.

**Opportunity** — Unused or underused in this competitive set. Clearest path to
visual ownership. Explain why each opportunity color is appropriate for the industry.

Present confidence levels honestly — note if the competitor sample is small.
"Based on 6 competitors researched" is more credible than a fake certainty score.

### Step 5 — Early trademark filter

Before any concept work begins, flag:
- Overused visual clichés in this industry (the mountain for a summit brand,
  the tooth for a dental brand, etc.) — don't generate these
- Common symbols likely to have trademark conflicts in the category
- Visual styles that are already crowded in the space
- Specific symbols or mark styles to avoid for this client

Write to:
- `BRAND_BRIEF.RESEARCH_FINDINGS`
- `BRAND_BRIEF.COMPETITOR_AUDIT`
- `BRAND_BRIEF.COLOR_ANALYSIS`
- `BRAND_BRIEF.EARLY_TRADEMARK_FILTER`

**Gate:** Present:
1. Competitor visual audit table
2. Color opportunity map (Highly Owned / Moderately Owned / Opportunity)
3. Early trademark filter (what to avoid in concept development)

AskUserQuestion:
- "Research looks right — proceed to Mood Board (Recommended)"
- "Add more competitors"
- "Adjust the color opportunity read"
- "Flag additional symbols to avoid"

Log to `BRAND_BRIEF.DECISION_LOG`.

---

## STAGE 3 — Mood Board

> Send Stage 3 banner. Generate visual reference imagery — aesthetic, color, and
> texture anchors. Not logos. These align the team on feel before concept work starts.

### Step 1 — Mood board direction

From positioning and research, auto-derive 3 aesthetic directions with names
that feel like creative directions, not config options. Present as AskUserQuestion:

Example options (adapt to actual brand):
- "Clean & Authoritative — precise, minimal, corporate confidence"
- "Warm & Approachable — friendly, human, accessible"
- "Bold & Modern — high-contrast, energetic, forward-thinking"
- "Blend two directions"

### Step 2 — Generate mood board (silent)

Generate 6–9 reference images via Higgsfield `generate_image` using
`model: "nano_banana_pro"` (free — iterate without credit cost).

Include three categories:
- **Color / texture / material references** (2–3 images): palette mood, material feel
- **Typographic mood** (2–3 images): type-in-environment, editorial tone — not logos
- **Brand world / lifestyle** (2–3 images): the world this brand lives in

Prompts must NOT produce logos. These are aesthetic anchors only.

### Step 3 — Approve and extract direction

Show mood board. AskUserQuestion:
- "This direction is right — lock it (Recommended)"
- "Keep some images, regenerate others"
- "This isn't right — regenerate with different direction"

On approval, extract and write to `BRAND_BRIEF.MOOD_DIRECTION`:
- 5–8 locked direction keywords
- Color direction (specific tone, temperature, palette family)
- Reference notes for prompting

Log to `BRAND_BRIEF.DECISION_LOG`.

---

## STAGE 4 — Concept Development

> Send Stage 4 banner. This is the most critical stage. Word mapping, concept
> directions, concept scoring, and the kill gate. Weak ideas die here — not
> after generation credits are spent.

### Step 1 — Word mapping (internal — silent)

Pull from `BRAND_BRIEF.POSITIONING`, `BRAND_BRIEF.MOOD_DIRECTION`, and
`BRAND_BRIEF.RESEARCH_FINDINGS`.

Build a word association chain:
- Core brand words → visual metaphors → symbol categories → shape language → form families

Use this map to generate concept directions. Do not show the raw word map —
it feeds the concept cards below.

### Step 2 — Generate concept direction cards

Generate up to 5 directions. Each direction card must answer all five strategic
questions before it is presented. Any direction that cannot answer them is killed
internally and never shown.

**Required fields per concept direction:**

```
Direction [A–E]: [Name]

Symbol idea:         [specific — not "a geometric shape" but "a hexagon
                      formed from overlapping letterforms"]
Typography anchor:   [specific category + personality — e.g., "geometric
                      sans-serif, precise, modern — similar to Futura weight"]
Color family:        [derived from COLOR_ANALYSIS.opportunity — cite the gap]

Strategic rationale:
  Why this symbol exists:              [tied to brand promise]
  Business goal supported:             [specific — awareness / trust / premium feel]
  Competitors differentiated from:     [name them specifically]
  Visual territory owned:              [reference color gap analysis]
  Customer perception created:         [tied to want_words]

Vectorizability:     HIGH | MEDIUM | LOW
Trademark risk:      LOW | MEDIUM | HIGH  [reference EARLY_TRADEMARK_FILTER]
Constraint flags:    [any issues with embroidery, wraps, favicon, etc.]
```

### Step 3 — Concept scoring

Score each direction. Scores are qualitative assessments backed by brief data —
not invented percentages. Lead with the data, not the number.

| Factor | Weight | Evaluate via |
|---|---|---|
| Differentiation | 30% | Competitor audit — how many competitors share this territory? |
| Memorability | 25% | Simplicity + distinctiveness of the mark concept |
| Constraint fit | 20% | CONSTRAINTS — embroidery, wraps, favicon, single-color |
| Trademark safety | 15% | EARLY_TRADEMARK_FILTER + trademark risk rating |
| Vectorizability | 10% | How clean will AI output likely be for this concept |

Example of correct scoring language:
> "Direction B scores strongest on differentiation — 0 of 9 competitors in this
> space use abstract geometric marks. It also passes all 8 constraint checks."

Example of incorrect scoring language:
> "Differentiation: 92%. Memorability: 88%." ← do not do this.

### Step 4 — Kill gate (designer decision — REQUIRED gate)

Present all direction cards with scores. AskUserQuestion (multiSelect):

For each direction, the designer assigns one of three states:
- **Pass** — advance as-is
- **Revise** — advance with specific changes (designer specifies)
- **Fail** — kill, log reason

Maximum 3 directions advance. If more than 3 are marked Pass, prompt:
> "Strong pipeline — but best presentations show 2–3 directions. Which 3
> are you most confident in?"

For every failed direction, log immediately:
```
DECISION_LOG entry:
  Stage: 4 — Kill Gate
  Decision: Failed Direction [X] — [Name]
  Rationale: [designer's stated reason or Claude's recommendation with data]
  Rejected options: []
```

Write to `BRAND_BRIEF.CONCEPT_DIRECTIONS` and `BRAND_BRIEF.DECISION_LOG`.

---

## STAGE 5 — Logo Generation + Simplicity Gate

> Send Stage 5 banner. Generate polished, vector-ready logo concepts from
> approved directions only. Hard limits apply. Different models, different
> aesthetics — designer chooses per direction.

### Step 1 — Model selection (per direction)

For each approved direction, AskUserQuestion:

> "Which engines for Direction [X]: [Name]?"
> - "All engines — compare across models (GPT Image 2 + Nano Banana Pro + Flux 2)"
> - "GPT Image 2 only — cleanest vector output"
> - "Nano Banana Pro only — free, stylized, iterate freely"
> - "Nano Banana Pro first, then GPT Image 2 for final polish"
> - "Flux 2 only — strong artistic character"

Different models produce different logos from the same prompt. Surface outputs
grouped by model so the designer can see aesthetic differences clearly.

### Step 2 — Prompt distillation (internal — silent)

For each direction + model combination, build the generation prompt:

1. Start with vector-ready constraints (mandatory, always first)
2. Add symbol idea (specific, from direction card)
3. Add typography anchor (specific typeface category)
4. Add color from `COLOR_ANALYSIS.opportunity` (specific)
5. Add max 3 brand personality adjectives from `POSITIONING`
6. Add 1-phrase industry context
7. Add avoid terms from `EARLY_TRADEMARK_FILTER`

Total: ≤80 words. Distill — never dump the full brief into a prompt.

### Step 3 — Per-direction permission gate (REQUIRED — never skip)

Before generating any batch, AskUserQuestion:

> "Ready to generate Direction [X]: [Name]?"
> "[Selected model(s)] · white background · flat vector · up to 10 variations"
> - "Yes — generate (Recommended)"
> - "Start with 3 for a quality check first"
> - "Adjust the prompt before generating"
> - "Skip this direction"

Only generate on explicit approval.

### Step 4 — Generate (internal — silent)

Call `generate_image` with:
- Distilled prompt (≤80 words)
- `quality: "high"`, `resolution: "2k"`
- White background

Present outputs grouped by model — show all models' outputs for a direction
side-by-side so the designer can compare aesthetics across engines.

### Step 5 — Simplicity gate

After each batch, present outputs with a simplicity checklist for designer
evaluation. Every output gets evaluated:

```
☐ Recognizable at 32×32px (favicon size)?
☐ Works in single color?
☐ Could be embroidered? [if CONSTRAINTS.embroidery_needed = true]
☐ Clean enough to trace as vector without redesigning?
☐ Free of fine detail that won't survive printing?
☐ Letterforms accurate and clean? [wordmarks]
☐ Would this survive a truck wrap at 100mph? [if CONSTRAINTS.vehicle_wraps = true]
```

Outputs failing 2+ checks → flagged with specific issues noted.
Designer decides: retry with tighter prompt | advance with known cleanup | kill.

### Step 6 — Shortlist and iterate

Designer selects best outputs per direction. Option to regenerate any direction
with prompt adjustments before advancing. When satisfied:

AskUserQuestion:
- "These directions advance to Refinement (Recommended)"
- "Regenerate Direction [X] with adjustments"
- "Kill a direction and consolidate"

Write to `BRAND_BRIEF.GENERATION_HISTORY`.
Log to `BRAND_BRIEF.DECISION_LOG`.

---

## STAGE 6 — Refinement (Human Vector Rebuild)

> Send Stage 6 banner. This is the agency moat. AI generation targets 90%.
> This stage completes the remaining 10% and is the step that justifies agency
> pricing. Claude prepares the brief — designer executes in vector software.

### Step 1 — Refinement brief per shortlisted logo

For each selected output, generate a detailed, specific refinement note:

```
Direction [X]: [Name]
Selected output: [reference ID]

Artifacts to address:
- [Specific — e.g., "slight letterform distortion on descender of 'g'"]
- [Specific — e.g., "circle in mark is not mathematically round — fix in Illustrator"]
- [Specific — e.g., "stroke weight inconsistent between icon and wordmark"]

Typography:
- Current match to direction's typography anchor: [Yes / Close / No]
- Recommendation: [e.g., "Replace with Futura PT — matches the geometric
  precision of the mark better than what was generated"]
- Kerning: [specific letter pairs to adjust]

Geometry:
- [Shapes to clean — e.g., "simplify the 3-point node cluster at top of icon"]
- [Proportions — e.g., "icon is too heavy relative to wordmark — reduce to 60%"]
- [Stroke normalization — e.g., "all strokes should be 2pt on a 100pt canvas"]

Preserve:
- [What's working — e.g., "the negative space arrow is the strongest element — keep it"]

Target: Production-ready SVG. Every line intentional. No AI artifacts.
```

### Step 2 — Handoff and resume

Pipeline pauses here. Designer works in Illustrator, Figma, or Affinity Designer.

AskUserQuestion:
- "Vector rebuild complete — continue to Revisions"
- "Need more time — save progress and pause"

Write to `BRAND_BRIEF.REFINEMENT_NOTES`.

---

## STAGE 7 — Revisions + Final Trademark Validation

> Send Stage 7 banner.

### Step 1 — Revision review

Present refined marks. AskUserQuestion:
- "These are ready — proceed to trademark validation (Recommended)"
- "One more round of adjustments"
- "Regenerate one direction before validating"

### Step 2 — Final trademark validation (internal — 4 searches per mark)

For each final mark's concept, run:
1. `[brand name] trademark registered` — web search
2. `[brand name] USPTO trademark` — web search
3. `[brand name] WIPO trademark` — web search
4. `[symbol concept] trademark logo [industry]` — web search (concept conflict check)

Risk level: **LOW | MEDIUM | HIGH**

- LOW: No conflicts found. Note in brief.
- MEDIUM: Similar marks exist in adjacent categories. Flag for attorney review.
- HIGH: Direct conflict found. Recommend killing direction or significant redesign.

Write to `BRAND_BRIEF.TRADEMARK_FINDINGS`.

AskUserQuestion:
- "Trademark clear — proceed to Internal Review (Recommended)"
- "Flag for attorney review — proceed with caution noted"
- "Trademark conflict found — kill this direction"

Log to `BRAND_BRIEF.DECISION_LOG`.

---

## STAGE 8 — Internal Review

> Send Stage 8 banner. This gate happens BEFORE the client sees anything.
> Catches weak outputs before they reach a client presentation.

### Step 1 — Evaluate each advancing direction

Score against four criteria. All evaluations are qualitative and data-backed —
never invented scores.

| Criterion | Evaluate via |
|---|---|
| **Strategy alignment** | Does the mark express the archetype, brand promise, and want_words? Pull direct quotes from `POSITIONING`. |
| **Design quality** | Is this production-ready? Clean geometry, balanced proportions, intentional spacing, no artifacts? |
| **Differentiation** | Does this mark stand apart from the competitor audit? Name specific competitors it outperforms and why. |
| **Technical execution** | Passes simplicity gate? Constraint-compatible per `CONSTRAINTS`? Ready for production? |

Assign: **Pass | Revise | Fail** per direction.

### Step 2 — Internal review output

Present each direction with:
- Status: Pass / Revise / Fail
- Strongest point (specific, data-backed)
- Weakest point (specific)
- Recommendation with rationale

AskUserQuestion (designer final call):
- "All passing directions advance to Logo Lock (Recommended)"
- "Revise [direction] before advancing"
- "Fail [direction] — kill it now"

Log to `BRAND_BRIEF.DECISION_LOG`.

---

## STAGE 9 — Logo Lock

> Send Stage 9 banner. One mark. Locked. Everything else archived.

### Step 1 — Lock confirmation

If multiple directions passed Internal Review, present side-by-side for
final comparison. AskUserQuestion:

> "Which mark becomes the primary logo for [client name]?"
> [One button per passing direction with name and key differentiator]
> "I need to compare them one more time"

### Step 2 — Lock execution

On confirmation:
1. Record selected direction ID to `BRAND_BRIEF.LOGO_LOCK.selected_direction_id`
2. Write rationale pulling from ALL research data:
   - Why this mark won (archetype fit, differentiation, constraint compliance)
   - What competitive territory it owns (cite specific competitors)
   - What customer perception it creates (cite want_words and audience_aesthetics)
   - What was rejected and why (reference DECISION_LOG entries)
3. Record all other direction IDs to `BRAND_BRIEF.LOGO_LOCK.archived_directions`
4. Mark locked_at with current stage and date

This rationale entry becomes the centerpiece of the Brand Guide's rationale
section. It should be complete enough to stand alone as an explanation to the
client of why this logo was the right choice.

Write to `BRAND_BRIEF.LOGO_LOCK`.
Log to `BRAND_BRIEF.DECISION_LOG`.

---

## STAGE 10 — Variations + Expansion Check

> Send Stage 10 banner. Generate the full lockup set from the locked direction.
> Test against every real-world application in CONSTRAINTS.

### Step 1 — Variation generation

Use GPT Image 2 (`model: "gpt_image_2"`) for all variations — consistency
requires the highest-fidelity engine at this stage.

Use vector-ready constraints + locked direction prompt for every call.

Permission gate before generating. AskUserQuestion:
- "Generate full variation set (Recommended)"
- "Generate specific variations only"

| Variation | Aspect ratio | Notes |
|---|---|---|
| Primary — horizontal lockup | flexible | Icon + wordmark side by side |
| Stacked lockup | square-ish | Icon above wordmark |
| Icon only | 1:1 | Mark without wordmark |
| Wordmark only | horizontal | Type treatment without icon |
| Dark background version | match primary | White/reversed mark |
| Light background version | match primary | Standard mark on white |

### Step 2 — Expansion checklist

Present all variations with application checklist. Designer evaluates each:

```
☐ Business card — works at 50mm wide?
☐ Email signature — readable at 200px?
☐ Website header — balanced at full width?
☐ Social profile avatar — icon-only at 100×100px?
☐ Signage / large format — scales cleanly?
☐ Merchandise / apparel — wearable, not overcomplicated?
☐ Vehicle wrap — bold enough at distance? [if CONSTRAINTS.vehicle_wraps]
☐ Embroidery — no thin lines, no small text? [if CONSTRAINTS.embroidery_needed]
☐ Favicon — icon recognizable at 16×16px?
☐ Packaging — works at label scale? [if CONSTRAINTS.packaging]
☐ Franchise applications — consistent across locations? [if CONSTRAINTS.franchise_rollout]
```

Any failures → flag with specific fix recommendation before advancing.

Log to `BRAND_BRIEF.DECISION_LOG`.

---

## STAGE 11 — Color + Typography

> Send Stage 11 banner. Build the full color system and type pairing from
> the approved mark and Brand Brief — not from scratch.

### Step 1 — Color palette

Derive from:
- Locked direction's color family (what was generated and approved)
- `BRAND_BRIEF.COLOR_ANALYSIS.opportunity` (the competitive gap this color owns)
- `BRAND_BRIEF.POSITIONING` (archetype and audience aesthetics)

Build and present:
- **Primary color** — dominant brand color (pulled from locked mark)
- **Secondary color** — complementary or analogous, supports primary
- **Accent color** — used sparingly for emphasis and highlights
- **Neutral(s)** — for backgrounds, body text, supporting elements

For each color: Name · HEX · RGB · CMYK · Pantone (closest approximate)

Include one line of rationale per color — why it fits the brand and what it
communicates (tied to POSITIONING).

AskUserQuestion:
- "Palette approved — lock it (Recommended)"
- "Adjust primary color"
- "Adjust secondary or accent"
- "Show alternative palette options"

### Step 2 — Typography pairing

Based on `CONCEPT_DIRECTIONS[locked].typography_anchor` and `POSITIONING.archetype`:

Research and present:
- **Primary / heading font:** name, weights, use case, why it fits
- **Secondary / body font:** name, weights, use case, why it pairs
- **Web-safe fallback:** Google Fonts or system font equivalent if primary is print-only

One line of rationale per font — how it expresses the brand archetype.

AskUserQuestion:
- "Typography approved — lock it (Recommended)"
- "Show alternative heading options"
- "Show alternative body options"

Write to `BRAND_BRIEF.FINAL_SPECIFICATIONS`.
Log to `BRAND_BRIEF.DECISION_LOG`.

---

## STAGE 12 — Production Assets

> Send Stage 12 banner. Prepare the complete file export specification.
> Files come from the designer's vector rebuild — Claude generates the
> naming convention, folder structure, and export specification.

### Step 1 — Asset package selection

AskUserQuestion:
- "Full package — web + print + social (Recommended)"
- "Web only — SVG, PNG, Favicon"
- "Print only — SVG, PDF, CMYK-ready"
- "Custom selection"

### Step 2 — Export specification

Generate a complete export spec document the designer follows in their vector
tool. Include:

**Naming convention:** `[client-slug]-[variation]-[color-mode].[ext]`
- Example: `acme-primary-horizontal-color.svg`
- Example: `acme-icon-only-black.png`

**Folder structure:**
```
/[client-slug]-brand-assets/
  /logos/
    [client-slug]-primary-horizontal-color.svg
    [client-slug]-primary-horizontal-color.png  (2000px)
    [client-slug]-primary-horizontal-color.png  (500px)
    [client-slug]-primary-stacked-color.svg
    [client-slug]-primary-stacked-color.png
    [client-slug]-icon-only-color.svg
    [client-slug]-icon-only-color.png
    [client-slug]-wordmark-only-color.svg
    [client-slug]-primary-horizontal-black.svg
    [client-slug]-primary-horizontal-black.png
    [client-slug]-primary-horizontal-white.svg
    [client-slug]-primary-horizontal-white.png
  /favicon/
    favicon.ico
    favicon-16x16.png
    favicon-32x32.png
    favicon-64x64.png
    favicon-128x128.png
    apple-touch-icon.png  (180x180)
  /social/
    [client-slug]-social-avatar.png  (400x400)
    [client-slug]-social-avatar-square.png  (1080x1080)
  /print/
    [client-slug]-brand-mark-sheet.pdf
```

**Export settings per format:**
- SVG: artboard clipped, outline fonts, no embedded rasters
- PNG: transparent background, RGB, 72dpi for web / 300dpi for print
- PDF: CMYK, outline fonts, crop marks for print-ready mark sheet
- ICO: multi-resolution (16/32/64) embedded

Save spec to `/mnt/user-data/outputs/[client-slug]-asset-spec.md`.

---

## STAGE 13 — Brand Guide

> Send Stage 13 banner. Assemble the full brand identity document. Every
> decision backed by research from the Brand Brief. This is the deliverable.

Generate as a single polished HTML file.
Save to `/mnt/user-data/outputs/[client-slug]-brand-guide.html`.

**Visual style:** Uses the brand's approved color palette and typography.
No generic templates. The brand guide should feel like it belongs to this brand.

---

### Required sections:

**1. Brand Overview**
- Client name, industry, year established
- Brand promise (from `POSITIONING.brand_promise`)
- Brand archetype + brief explanation
- Target audience description
- Want/Avoid words displayed prominently

**2. The Logo**
- Primary mark displayed large
- All variations displayed in context
- Each variation labeled with its use case

**3. Logo Rationale** *(The Paget Principle — every pixel explained)*

Pull directly from `LOGO_LOCK.rationale` and `CONCEPT_DIRECTIONS[locked].strategic_rationale`:

- **Why this symbol:** tied to brand promise and archetype
- **Competitive differentiation:** specific competitors it distinguishes from and how
- **Visual territory owned:** what gap in the market this mark occupies (cite color analysis)
- **Customer perception:** what this creates in the audience's mind (cite want_words)
- **What was considered:** brief reference to other directions explored and why this won

**4. Color System**
- Each color displayed as a full swatch
- HEX, RGB, CMYK, Pantone per color
- Color name (branded if appropriate)
- One line of rationale: why this color, what it communicates, what gap it owns

**5. Typography**
- Each font displayed at heading, subheading, and body weight
- Usage hierarchy: when to use each font and at what weight
- Letter spacing and line height guidelines
- One line of rationale per font

**6. Logo Usage Rules**
- Clear space: visual diagram with minimum clear space defined
- Minimum sizes: screen (px) and print (mm)
- Approved backgrounds: show mark on each approved background
- Do's: at least 6 correct usage examples specific to this brand
- Don'ts: at least 6 incorrect usage examples specific to this brand
  (no stretching, no recoloring outside approved palette, no drop shadows, etc.)

**7. Real-World Applications**
- Reference the approved variation mockups from Stage 10
- Business card, social profile, signage, and any constraint-specific
  applications from `CONSTRAINTS`

**8. Decision Trail** *(Internal reference — can be toggled visible/hidden in HTML)*
- Key decisions from `BRAND_BRIEF.DECISION_LOG`
- What was considered, what was killed, and why
- Trademark clearance status and attorney recommendation if applicable
- This section is for DR internal use and should be clearly labeled as such

---

**Gate:** AskUserQuestion
- "Brand guide approved — finalize and deliver (Recommended)"
- "Adjust a specific section"
- "Add an application section"

---

## STAGE 14 — Internal Cost Report *(DR Only — Never Shown to Client)*

> Generate silently after brand guide is approved. No stage banner shown.
> This is a DR business intelligence artifact.

A client paying for brand strategy does not need to see the AI generation
cost. Showing them that number shifts their evaluation from strategic value
to hourly effort — which undercuts the work.

**Pull from `BRAND_BRIEF.GENERATION_HISTORY`:**
- Count image generation calls by model
- Estimate credit spend (Nano Banana = free; GPT Image 2, Flux 2 = paid credits)

**Traditional cost comparison:**

| Service | Industry average (2026) |
|---|---|
| Brand discovery + strategy | $1,500–$5,000 |
| Competitor research + analysis | $500–$2,000 |
| Logo design (3 concept directions) | $2,500–$10,000 |
| Brand guide document | $2,000–$8,000 |
| Production asset package | $500–$2,000 |
| **Total traditional range** | **$7,000–$27,000** |

Report includes:
- Actual Higgsfield credit spend (itemized by model)
- Pipeline time: stage-by-stage duration estimate
- Traditional cost equivalent range
- DR margin analysis (actual cost vs. what was billed or estimated)

Save to `/mnt/user-data/outputs/[client-slug]-internal-cost-report.html`.

Do not reference this report, link to it, or mention it in any client-facing output.

---

## GENERAL GUIDELINES

**Designer is creative director.** Claude presents options, data, and
recommendations. The designer makes every creative decision. Claude never
overrides a gate decision.

**Every decision logged.** Pass, Revise, or Fail — always recorded with
rationale. The brand guide's credibility depends on this trail being complete.

**Brief is the source of truth.** Every generation prompt is derived from the
Brand Brief. Prompts are never invented on the fly. If a section of the brief
isn't filled in yet, fill it before generating.

**Vectors are the designer's job.** Claude gets to 90% through prompt
engineering and model selection. The final 10% — clean geometry, precise
typography, balanced proportions — is the designer's craft. Respect that
boundary and prepare detailed refinement notes accordingly.

**Vector-ready or flag it.** If a generated output wouldn't trace cleanly,
flag it before advancing. Never let weak outputs slip through to later stages.

**Trademark is not legal clearance.** Web searches surface conflicts and reduce
risk. Always recommend attorney review for MEDIUM or HIGH risk findings.
The pipeline cannot substitute for professional trademark counsel.

**Nano Banana for exploration, GPT Image 2 for polish.** Free models for
concept iteration. Paid models for final quality pass. Designer can always
override this guidance at any model selection gate.

**Failure handling.** If a generation call fails, log the failed direction
and model, and offer: Retry with same prompt | Adjust prompt and retry |
Skip this model. Never silently skip a failed generation.

**Client-facing language only.** All communication during the pipeline uses
plain language. No tool names, no model slugs, no MCP calls, no "running 8
parallel searches." The pipeline is invisible. The strategy and the design
are what the client — and the designer — experiences.
