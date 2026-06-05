# Photo Editor — Client Image Curation & Color Grading

End-to-end photo editing workflow: pull images from Google Drive, import into Lightroom Classic via MCP, curate the best shots, apply a consistent professional color grade, and export finalized versions back to Drive.

## When to use

- Richard shares a Google Drive folder of client photos and wants them edited and curated
- Invoked as `/photo-editor`
- Works with RAW files (CR3, ARW, NEF, RAF) or JPEGs
- Supported client types: dental, home services, or any local service business

---

## Prerequisites

- Lightroom Classic must be open and the **Lightroom MCP plugin must be running** (File → Plug-in Manager → Lightroom MCP → Start Server)
- `gdown` must be installed: `pip3 install gdown`
- Google Drive MCP must be authenticated

---

## Phase 1 — Get the Drive folder and identify files

Ask Richard for:
1. The Google Drive folder link
2. Client type (dental, home services, etc.) — affects curation criteria

Extract the folder ID from the URL (the string after `/folders/`).

Search for RAW files in the folder:
```
mcp__claude_ai_Google_Drive__search_files(
  query="parentId = '{FOLDER_ID}' and title contains '.CR3'",
  pageSize=50
)
```

Repeat for other extensions if needed (`.ARW`, `.NEF`, `.JPG`).

Report back: total count, file sizes, filenames found.

---

## Phase 2 — Download to local folder

Create a local working directory:
```bash
mkdir -p ~/Downloads/client-photos-{CLIENT_NAME}
```

Download using gdown (one at a time — parallel downloads can fail):
```bash
export PATH="$PATH:/Users/richardvargas/Library/Python/3.9/bin"
gdown {FILE_ID} -O ~/Downloads/client-photos-{CLIENT_NAME}/{FILENAME}
```

Confirm all files downloaded and show sizes.

---

## Phase 3 — Import into Lightroom

**Note:** The Lightroom MCP `import_photos` tool has a known bug with both file paths and folder paths. Always use manual import:

Tell Richard:
> "Files are ready at `~/Downloads/client-photos-{CLIENT_NAME}/`. Please go to **File → Import Photos and Video** in Lightroom, navigate to that folder, select all files, and click Import. Let me know when done."

Once confirmed, verify with:
```
mcp__lightroom__search_photos(filename="{PARTIAL_FILENAME}", limit=100)
```

Record all photo IDs returned.

---

## Phase 4 — Export previews and curate

Create a previews folder:
```bash
mkdir -p ~/Downloads/client-photos-{CLIENT_NAME}/previews
```

Export previews one at a time (batch exports time out):
```
mcp__lightroom__export_photos(
  photo_ids=["{ID}"],
  destination="~/Downloads/client-photos-{CLIENT_NAME}/previews",
  format="jpeg",
  quality=85,
  width=2000
)
```

Read each exported JPEG to visually review it. Evaluate each photo on:
- **Exposure quality** — not blown out, not crushed
- **Composition** — clean, professional framing
- **Uniqueness** — no duplicate angles or near-identical shots; keep only the single best version of each scene
- **Client relevance** — for dental: office interiors, team, signage, patient experience; for home services: work in progress, before/after, crew, equipment
- **Technical quality** — sharp focus, no motion blur
- **Variety** — ensure the final set covers different spaces, subjects, and angles for website + social use

### Tiered selection

After reviewing all photos, produce three tiers:

**Tier 1 — Top 25 (Hero deliverable)**
The absolute best 25 photos. These are the ones you'd put on the website homepage, Google Business Profile, and social media. Prioritize: variety of subject matter, best lighting, strongest composition, no duplicates. Label each with a one-line reason.

**Tier 2 — Top 50 (Full deliverable)**
Expand to 50 total. Add supporting shots that add context or variety — secondary rooms, detail shots, staff moments. Still no duplicates or weak images. Label additions.

**Tier 3 — Cuts**
Everything not in the top 50. Log with brief reason (duplicate, blown highlights, poor composition, etc.).

Present all three tiers to Richard before starting any edits. Wait for approval or revisions to the selection before proceeding to Phase 5.

If the full batch has fewer than 50 usable photos, note the actual count and deliver the best available.

---

## Phase 5 — Apply professional color grade

### Establish the reference photo

Pick the **best single photo** (strongest exposure, most neutral lighting) as the style reference. Apply and dial in settings manually on that photo first, exporting and reviewing after each change until approved.

### Approved base style (dental/professional interiors)

```
Temperature:   3500–5500 (adjust per lighting: 3500 for tungsten, 5500 for daylight)
Tint:          8–12 (tungsten) / 3–5 (daylight)
Contrast:      25
Clarity:       15
Texture:       20
Dehaze:        8 (tungsten) / 5 (daylight)
Vibrance:      15
Saturation:    -15 (tungsten) / -8 (daylight)
Sharpness:     50
LensProfile:   1
```

### Copy style to all other photos

```
mcp__lightroom__copy_develop_settings(
  source_id="{REFERENCE_PHOTO_ID}",
  target_ids=["{ID2}", "{ID3}", ...],
  settings=["Temperature", "Tint", "Contrast2012", "Clarity2012", "Texture",
            "Dehaze", "Vibrance", "Saturation", "Sharpness", "LensProfileEnable",
            "ToneCurveName2012"]
)
```

### Set exposure individually per photo

After copying style, adjust per photo:
```
mcp__lightroom__set_develop_settings(
  photo_id="{ID}",
  settings={
    "Exposure2012": {value},     # bright rooms: +0.2–0.4 / dark rooms: +0.6–1.0
    "Highlights2012": {value},   # -45 to -100 depending on window blowout
    "Shadows2012": {value},      # +30 to +60 to open shadow detail
    "Whites2012": {value},       # -10 to -70 to prevent clipping
    "Blacks2012": {value}        # -5 to -15 for depth
  }
)
```

Export and review each photo after setting exposure. Adjust until correct.

---

## Phase 6 — Review loop

After each round of edits, export previews and read them visually. Report:
- What's working
- What still needs adjustment
- Any photos to cut

Do not ask Richard to screenshot — use the export → read loop directly.

If Richard requests changes ("too yellow", "too dark", etc.):
- **Too yellow/warm** → lower Temperature, lower Saturation
- **Too dark** → raise Exposure, raise Shadows
- **Too bright/blown** → lower Highlights, lower Whites, lower Exposure
- **Flat/dull** → raise Contrast, raise Clarity, raise Texture
- **Inconsistent** → use `copy_develop_settings` from the approved reference photo

---

## Phase 7 — Create Lightroom collection

```
mcp__lightroom__create_collection(name="{CLIENT_NAME} - Version 1 Edits")
mcp__lightroom__add_to_collection(
  collection_name="{CLIENT_NAME} - Version 1 Edits",
  photo_ids=[list of all kept photo IDs]
)
```

---

## Phase 8 — Final export

Export full-resolution JPEGs to a finalized folder:
```bash
mkdir -p ~/Downloads/client-photos-{CLIENT_NAME}/final
```

```
mcp__lightroom__export_photos(
  photo_ids=["{ID}"],
  destination="~/Downloads/client-photos-{CLIENT_NAME}/final",
  format="jpeg",
  quality=95
)
```

Export one at a time. Do not set a width limit — export at full original resolution.

---

## Phase 9 — Upload finals to Google Drive

Create a new folder in the client's Drive:
```
mcp__claude_ai_Google_Drive__create_file(
  name="Version 1 Edits",
  mimeType="application/vnd.google-apps.folder",
  parents=["{ORIGINAL_FOLDER_ID}"]
)
```

Upload each final JPEG using the Drive MCP.

Confirm upload and share the folder link with Richard.

---

## Known limitations

- **Lightroom MCP import bug** — `import_photos` fails for both files and folders. Manual import is always required.
- **Batch export timeouts** — Export one photo at a time. Batch of 5+ consistently times out.
- **No HSL panel** — Cannot target specific color channels (orange/yellow) independently. White balance is the only color correction lever.
- **No local adjustments** — No radial filters or adjustment brushes. Cannot selectively brighten one area of a photo.
- **Tungsten lighting** — Photos shot under warm tungsten lights cannot be fully neutralized without looking artificially blue. Flag these for reshoot if color accuracy is critical.
- **Dark carpet/floors** — Compositions with heavy dark floor coverage will not brighten cleanly in post. Flag for reshoot or cut.
- **Drive MCP** — Can read files but writing large binary files (images) back may be limited. Test on first upload.

---

## Example invocation

```
/photo-editor
```

Richard will then provide the Drive link and client type. Proceed through phases in order.
