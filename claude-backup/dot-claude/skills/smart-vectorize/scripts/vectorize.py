"""
smart-vectorize — high-fidelity raster-to-SVG converter.

Pipeline:
  1. LAB-space K-means to find perceptual color palette
  2. Pre-flatten: snap every pixel to nearest palette color (removes anti-aliasing)
  3. Per-color contour extraction with hole support (RETR_CCOMP)
  4. B-spline → Catmull-Rom cubic Bezier smoothing on each contour
  5. SVG assembly with correct fill-rule and clipPath

Optional badge mode:
  - Auto-detects circular badge boundary via HoughCircles
  - Pixel-scans to measure ring widths and colors
  - Injects precise SVG <circle> rings, clips scene content inside them
"""

import cv2
import numpy as np
import re
import subprocess
from pathlib import Path
from scipy.interpolate import splprep, splev
from sklearn.cluster import MiniBatchKMeans


# ── Bezier fitting ─────────────────────────────────────────────────────────────

def contour_to_bezier_path(cnt, scale: float, smoothing: float = 1.5):
    """Fit a closed cubic Bezier path to an OpenCV contour."""
    pts = cv2.approxPolyDP(cnt, 0.8, True).reshape(-1, 2).astype(float)
    n = len(pts)
    if n < 3:
        return None
    pts_s = pts * scale
    x, y = pts_s[:, 0], pts_s[:, 1]
    # Close loop
    x = np.append(x, x[0])
    y = np.append(y, y[0])
    try:
        tck, _ = splprep([x, y], s=smoothing, k=3, per=True)
    except Exception:
        d = f"M {pts_s[0,0]:.2f},{pts_s[0,1]:.2f}"
        for p in pts_s[1:]:
            d += f" L {p[0]:.2f},{p[1]:.2f}"
        return d + " Z"
    n_out = max(n, 20)
    t_new = np.linspace(0, 1, n_out, endpoint=False)
    sx, sy = splev(t_new, tck)
    # Catmull-Rom → Cubic Bezier
    px = np.append(sx, sx[:3])
    py = np.append(sy, sy[:3])
    d = f"M {px[0]:.2f},{py[0]:.2f}"
    for i in range(n_out):
        i2, i3 = i + 2, i + 3
        cp1x = px[i+1] + (px[i2] - px[i])   / 6
        cp1y = py[i+1] + (py[i2] - py[i])   / 6
        cp2x = px[i2]  - (px[i3] - px[i+1]) / 6
        cp2y = py[i2]  - (py[i3] - py[i+1]) / 6
        d += (f" C {cp1x:.2f},{cp1y:.2f}"
              f" {cp2x:.2f},{cp2y:.2f}"
              f" {px[i2]:.2f},{py[i2]:.2f}")
    return d + " Z"


# ── Badge detection ────────────────────────────────────────────────────────────

def detect_badge_circle(img: np.ndarray):
    """Find circular badge boundary via HoughCircles. Returns (cx, cy, r) or None."""
    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (9, 9), 2)
    circles = cv2.HoughCircles(
        blurred, cv2.HOUGH_GRADIENT, dp=1.2,
        minDist=w // 2,
        param1=100, param2=30,
        minRadius=int(w * 0.35),
        maxRadius=int(w * 0.55),
    )
    if circles is None:
        return None
    c = np.round(circles[0][0]).astype(int)
    return int(c[0]), int(c[1]), int(c[2])


def scan_badge_rings(img: np.ndarray, cx: int, cy: int, r_outer: int) -> dict:
    """
    Scan a horizontal line inward from the badge edge to find ring structure.
    Returns dict with r_brown_outer, r_cream_outer, r_scene, brown_hex, cream_hex.
    """
    def hex_at(x, y):
        b, g, rv = [int(v) for v in img[y, x]]
        return f"#{rv:02x}{g:02x}{b:02x}", (rv, g, b)

    # Walk inward from outer edge
    results = {"r_brown_outer": r_outer, "r_cream_outer": r_outer - 15,
               "r_scene": r_outer - 25, "brown_hex": "#8b3a1a", "cream_hex": "#f5e8d0"}

    brown_samples, cream_samples = [], []
    in_brown = False
    in_cream = False

    for r in range(r_outer, max(r_outer - 80, 0), -1):
        x = cx - r
        if x < 0 or x >= img.shape[1]:
            continue
        _, rgb = hex_at(x, cy)
        luminance = 0.299*rgb[0] + 0.587*rgb[1] + 0.114*rgb[2]
        saturation = max(rgb) - min(rgb)

        is_white = luminance > 240
        is_brown = (rgb[0] > 120 and rgb[0] > rgb[2] * 2 and saturation > 60
                    and not is_white and luminance < 200)
        is_cream = (luminance > 200 and saturation < 60 and not is_white)

        if is_brown and not in_brown:
            in_brown = True
            results["r_brown_outer"] = r
        if in_brown and is_brown:
            brown_samples.append(rgb)
        if in_brown and not is_brown and not in_cream:
            results["r_brown_inner"] = r
            in_brown = False
        if is_cream and not in_brown and not in_cream:
            in_cream = True
            results["r_cream_outer"] = r
        if in_cream and is_cream:
            cream_samples.append(rgb)
        if in_cream and not is_cream:
            results["r_scene"] = r
            in_cream = False
            break

    if brown_samples:
        m = np.mean(brown_samples, axis=0).astype(int)
        results["brown_hex"] = f"#{m[0]:02x}{m[1]:02x}{m[2]:02x}"
    if cream_samples:
        m = np.mean(cream_samples, axis=0).astype(int)
        results["cream_hex"] = f"#{m[0]:02x}{m[1]:02x}{m[2]:02x}"

    return results


# ── Main entry point ───────────────────────────────────────────────────────────

def vectorize(
    src: str,
    out_svg: str,
    n_colors: int = 32,
    smoothing: float = 1.5,
    min_area: int = 80,
    svg_width: int = 1400,
    badge_mode: bool = True,
) -> str:
    """
    Convert a raster image to SVG.

    Args:
        src:        Path to source PNG/JPG.
        out_svg:    Output SVG path.
        n_colors:   Color palette size for quantization (16–64 typical).
        smoothing:  Bezier smoothing factor (0=tight, 1=very smooth).
        min_area:   Minimum shape area in source pixels to include.
        svg_width:  Output SVG width in units.
        badge_mode: Auto-detect and reconstruct circular badge rings.

    Returns:
        Path to written SVG.
    """
    img = cv2.imread(src)
    if img is None:
        raise FileNotFoundError(f"Cannot read: {src}")
    h, w = img.shape[:2]
    scale = svg_width / w
    svg_h = int(h * scale)

    # ── 1. Badge detection ────────────────────────────────────────────────────
    badge = None
    if badge_mode:
        circle = detect_badge_circle(img)
        if circle:
            cx, cy, r_outer = circle
            rings = scan_badge_rings(img, cx, cy, r_outer)
            badge = {"cx": cx, "cy": cy, **rings}
            print(f"Badge detected: cx={cx}, cy={cy}, r_outer={r_outer}")
            print(f"  brown={rings['brown_hex']}  cream={rings['cream_hex']}")
            print(f"  r_scene={rings['r_scene']}")

    # ── 2. Determine scene boundary ───────────────────────────────────────────
    if badge:
        Y, X = np.mgrid[0:h, 0:w]
        dist = np.sqrt((X - badge["cx"])**2 + (Y - badge["cy"])**2)
        scene_mask = dist <= badge["r_scene"]
    else:
        scene_mask = np.ones((h, w), dtype=bool)

    # ── 3. LAB flat-quantize ──────────────────────────────────────────────────
    print(f"Quantizing to {n_colors} colors in LAB space ...")
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    km = MiniBatchKMeans(n_clusters=n_colors, n_init=10, random_state=42, batch_size=8192)
    km.fit(lab[scene_mask])
    label_map = km.predict(lab.reshape(-1, 3)).reshape(h, w)

    # ── 4. Trace each color layer ─────────────────────────────────────────────
    print("Tracing color layers with Bezier curves ...")
    layer_paths = []
    for lbl in range(n_colors):
        mask = ((label_map == lbl) & scene_mask).astype(np.uint8) * 255
        if mask.sum() < min_area * 255:
            continue

        c_lab = km.cluster_centers_[lbl].astype(np.uint8)
        c_bgr = cv2.cvtColor(np.array([[c_lab]], dtype=np.uint8), cv2.COLOR_LAB2BGR)[0, 0]
        hex_col = "#{:02x}{:02x}{:02x}".format(int(c_bgr[2]), int(c_bgr[1]), int(c_bgr[0]))

        mask_d = cv2.dilate(mask, np.ones((2, 2), np.uint8))
        cnts, _ = cv2.findContours(mask_d, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
        parts = []
        for cnt in cnts:
            if cv2.contourArea(cnt) < min_area:
                continue
            d = contour_to_bezier_path(cnt, scale, smoothing)
            if d:
                parts.append(d)
        if parts:
            layer_paths.append(
                f'<path d="{" ".join(parts)}" fill="{hex_col}" '
                f'stroke="{hex_col}" stroke-width="0.3" fill-rule="evenodd"/>'
            )

    print(f"  {len(layer_paths)} paths")

    # ── 5. Assemble SVG ───────────────────────────────────────────────────────
    scene_content = "\n    ".join(layer_paths)

    if badge:
        cx_s  = badge["cx"] * scale
        cy_s  = badge["cy"] * scale
        r_b   = badge["r_brown_outer"] * scale
        r_c   = badge["r_cream_outer"] * scale
        r_s   = badge["r_scene"] * scale
        brown = badge["brown_hex"]
        cream = badge["cream_hex"]

        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{svg_width}" height="{svg_h}" viewBox="0 0 {svg_width} {svg_h}">
  <defs>
    <clipPath id="bc"><circle cx="{cx_s:.1f}" cy="{cy_s:.1f}" r="{r_b:.1f}"/></clipPath>
    <clipPath id="sc"><circle cx="{cx_s:.1f}" cy="{cy_s:.1f}" r="{r_s:.1f}"/></clipPath>
  </defs>
  <rect width="{svg_width}" height="{svg_h}" fill="white"/>
  <g clip-path="url(#bc)">
    <circle cx="{cx_s:.1f}" cy="{cy_s:.1f}" r="{r_b:.1f}" fill="{brown}"/>
    <circle cx="{cx_s:.1f}" cy="{cy_s:.1f}" r="{r_c:.1f}" fill="{cream}"/>
    <g clip-path="url(#sc)">
    {scene_content}
    </g>
  </g>
  <circle cx="{cx_s:.1f}" cy="{cy_s:.1f}" r="{r_b-2:.1f}" fill="none" stroke="{brown}" stroke-width="2.5"/>
  <circle cx="{cx_s:.1f}" cy="{cy_s:.1f}" r="{r_c+1:.1f}" fill="none" stroke="{cream}" stroke-width="3"/>
</svg>'''
    else:
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{svg_width}" height="{svg_h}" viewBox="0 0 {svg_width} {svg_h}">
  <rect width="{svg_width}" height="{svg_h}" fill="white"/>
  {scene_content}
</svg>'''

    Path(out_svg).write_text(svg)
    print(f"SVG → {out_svg}")
    return out_svg


def render_png(svg_path: str, png_path: str, width: int = 1400) -> str:
    """Render SVG to PNG via rsvg-convert."""
    subprocess.run(["rsvg-convert", "-w", str(width), svg_path, "-o", png_path], check=True)
    return png_path


def compare(orig_path: str, rendered_path: str, out_path: str, height: int = 900):
    """Save side-by-side comparison image."""
    from PIL import Image
    orig = Image.open(orig_path)
    rend = Image.open(rendered_path)
    orig_r = orig.resize((int(orig.width * height / orig.height), height))
    rend_r = rend.resize((int(rend.width * height / rend.height), height))
    gap = 24
    c = Image.new("RGB", (orig_r.width + rend_r.width + gap, height), (220, 220, 220))
    c.paste(orig_r, (0, 0))
    c.paste(rend_r, (orig_r.width + gap, 0))
    c.save(out_path)
    return out_path
