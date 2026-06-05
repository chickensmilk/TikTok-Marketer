---
name: skill-smart-vectorize
description: "Custom raster-to-SVG skill location, and the per-color Potrace pipeline that produces the best vectorization quality for badges and flat illustrations"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 8949a15b-80ee-462b-b71e-65e9003fa559
---

## Skill location

`~/.claude/skills/smart-vectorize/scripts/vectorize.py`
SKILL.md at `~/.claude/skills/smart-vectorize/SKILL.md`

Uses LAB K-means + B-spline Bezier fitting with badge-mode ring detection. Good but not the best approach for high-fidelity output.

## Best-quality pipeline (per-color Potrace)

For badges, logos, and flat illustrations, this produces better results than VTracer alone:

1. **LAB K-means quantize** the scene-masked source image (24–32 colors)
2. **Per-layer binary mask** → save as PBM (inverted: potrace traces black)
3. **Run potrace** `-b svg` on each PBM at source resolution
4. **Apply combined Y-flip + scale transform** when embedding in final SVG:
   `translate(0, {H*scale}) scale({0.1*scale}, {-0.1*scale})`
5. **Stack layers largest→smallest** (painter's algorithm)
6. **Clip scene** to inner scene radius with `<clipPath>`
7. **Inject SVG `<circle>` rings** on top (measured from source pixels)

**Why:** Potrace produces cleaner, smoother paths than VTracer for flat color regions. VTracer is faster but its monolithic tracing picks up ring-area artifacts when the full badge image is used as input. The fix: mask to scene interior before tracing, so ring pixels are never in the input.

## Key badge geometry pattern

- Detect center/radius with `cv2.HoughCircles`
- Pixel-scan inward to measure brown ring width, cream ring width, scene radius
- Convert source-pixel measurements to SVG units: `r_svg = r_src * (svg_width / img_width)`
- Scene clip `r` = inner edge of cream ring; rings are drawn as `<circle>` strokes on top

## Dependencies

```bash
brew install potrace librsvg
pip install opencv-python-headless scikit-learn scipy Pillow vtracer
```
