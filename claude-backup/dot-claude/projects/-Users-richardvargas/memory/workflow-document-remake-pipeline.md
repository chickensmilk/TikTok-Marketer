---
name: workflow-document-remake-pipeline
description: Proven pipeline for remaking a PDF guide into a new Canva presentation with fresh copy and AI images
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 604f6cc7-f7af-4046-b86d-23c00ce8b06a
---

When asked to "make a new version" of an existing PDF document, use this pipeline:

1. **Read the PDF** — extract structure, copy, image style, page count
2. **Write all new copy** — reframe headings and body text completely; keep topic parity but change angle, tone, and phrasing
3. **Generate images with Higgsfield** — submit all jobs without `--wait` first to collect IDs, then batch-wait; use `gpt_image_2` with a consistent style prompt across all images for cohesion; respect the 8 concurrent job limit on creator plan
4. **Upload images to Canva** — use `upload-asset-from-url` for each; collect asset IDs
5. **Build outline** — call `request-outline-review` with full page structure and bullet-format descriptions
6. **Generate presentation** — after user approves outline, call `generate-design-structured` with all asset IDs (max 10)
7. **Present candidates** — show cover thumbnails for each variation; let user pick
8. **Confirm before saving** — do NOT auto-call `create-design-from-candidate`; wait for explicit approval

**Why:** Validated end-to-end in May 2026 on Craig Danto restaurant guide remake. Took ~25–30 min, mostly Higgsfield generation time.

**How to apply:** Use for any "redo this document," "make a new version," or "remake this PDF" request.
