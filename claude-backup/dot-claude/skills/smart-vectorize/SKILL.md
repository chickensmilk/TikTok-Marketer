# Smart Vectorize — High-Fidelity Raster-to-SVG

Convert raster images (PNG, JPG) into clean, smooth SVG vector files using perceptual color quantization and cubic Bezier curve fitting. Designed to handle rasterized flat illustrations, badges, logos, and icons with near-vectorizer.ai quality.

## When to use this skill

- User uploads a raster image and asks to vectorize, trace, or convert to SVG/EPS/vector
- Image is a flat illustration, badge, sticker, logo, or icon
- User wants a clean scalable SVG without jagged edges
- Previous `image-to-svg` skill produced blotchy or inaccurate results

## Quick start

```bash
pip install opencv-python-headless scikit-image scipy scikit-learn --break-system-packages -q
brew install librsvg  # for rsvg-convert (rendering only)
```

```python
import sys
sys.path.insert(0, '/mnt/skills/user/smart-vectorize/scripts')
from vectorize import vectorize, render_png, compare

svg = vectorize("badge.png", "badge.svg", n_colors=32, svg_width=1400)
render_png("badge.svg", "badge_render.png")
compare("badge.png", "badge_render.png", "comparison.png")
# ALWAYS inspect comparison.png before reporting done
```

## Key parameters

| Param | Default | Notes |
|-------|---------|-------|
| `n_colors` | 32 | Palette size. 24–32 for flat illustrations, 48–64 for photos |
| `smoothing` | 0.3 | Bezier smoothness. 0=tight to contour, 1=very smooth |
| `min_area` | 80 | Min shape area (source px²) to include. Raise to reduce noise |
| `svg_width` | 1400 | Output width in SVG units |
| `badge_mode` | True | Auto-detect circular badge, inject precise SVG ring circles |

## Pipeline

```
load image
  → LAB-space MiniBatchKMeans (n_colors clusters)
  → snap every pixel to nearest cluster center    ← kills anti-aliasing
  → for each color:
      binary mask → dilate(1px) → findContours(RETR_CCOMP)
      → for each contour: B-spline fit → Catmull-Rom cubic Bezier path
  → SVG assembly with fill-rule="evenodd" (correct holes)
  [badge_mode]:
      HoughCircles → detect outer boundary
      pixel scan → measure ring widths + colors
      inject <circle> rings + <clipPath> for scene
```

## Why this beats `image-to-svg`

| | `image-to-svg` | `smart-vectorize` |
|--|--|--|
| Color space | RGB K-means | LAB (perceptual) |
| Edge handling | Blur + K-means contours | Pre-flatten quantization |
| Curve type | Polylines (L x,y) | Cubic Bezier (C ...) |
| Badge rings | Approximated | Pixel-measured, SVG circles |
| Anti-aliasing | Partially handled | Eliminated before tracing |

## Tuning guide

**Mountain snow blobs / ragged edges**: Lower `smoothing` (try 0.1) — curves are over-smoothing sharp corners.

**Too many tiny artifacts**: Raise `min_area` (try 150–300).

**Wrong ring colors**: Set `badge_mode=False` and pass ring geometry manually.

**Too few colors / posterized look**: Raise `n_colors` (try 48).

**Text looks rough**: Expected — text at low resolution becomes abstract shapes. For legible text, manually add `<text>` SVG elements post-processing.

## Verification (mandatory)

```python
compare("original.png", "rendered.svg.png", "comparison.png")
# Open comparison.png. Check:
# 1. Overall shape matches
# 2. Colors accurate
# 3. No large white blobs or missing regions
# 4. Rings crisp (badge mode)
```

## Dependencies

```bash
pip install opencv-python-headless scipy scikit-learn Pillow
brew install librsvg  # macOS — for rsvg-convert
# Linux: apt-get install -y librsvg2-bin
```
