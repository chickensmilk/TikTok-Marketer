# Email UTM Naming Conventions

All links in an email campaign need a UTM for proper traffic attribution.
**Builder:** https://ga-dev-tools.web.app/campaign-url-builder/
**Use lowercase letters and underscores between words.**

## UTM Parameters

**Source** (which campaign type):
- `drip_series`, `newsletter`, `promo`, `announcement`

**Medium:** `email`

**Campaign Name:**
- Monthly newsletters: `month_year` (e.g., `april_2026`)
- Bi-weekly/weekly newsletters: `month_year_#` (e.g., `april_2026_2`)
- Promo/Announcement: `month_year_topic` (1–2 words max, e.g., `april_2026_spring_sale`)
- Drips: `typeofdrip_email#` (e.g., `welcome_1`, `abandoned_cart_1`, `review_request_1`)

**Campaign Term:** N/A

**Campaign Content** (what is the CTA?):
- If clear CTA: `cta` descriptor (e.g., `promo_20_off`, `quiz`, `learn_more`, `contact_us`)
- If multiple sections lead to same link or no clear CTA: `section_of_email` (e.g., `header_cta`, `body_section_1`)

## Designer Note
UTMs are part of the **Build** phase, not the Design phase. The designer creates the visual; the UTMs are added during the build/link step.
