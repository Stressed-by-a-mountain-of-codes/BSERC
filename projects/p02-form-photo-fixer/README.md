# P2 — Form Photo Fixer (Section A, Web Tools)

**Status:** Implemented  
**Goal:** Prepare photo and signature for exam/job forms offline: presets, crop with face guide, compress under KB limit, custom preset, download.

## Requirements coverage
### What to build
- [x] Upload a photo and a signature
- [x] At least 3 form presets (required size & KB limit)
- [x] Crop with a face guide (oval overlay) — drag to position, zoom slider
- [x] Compress to just under the KB limit (JPEG quality search)
- [x] Add your own custom preset (saved in `localStorage`)
- [x] Download the finished files (photo JPG, signature PNG)

### Done when
- [x] Output meets the rules of 3 real forms (official notice references linked in `docs/form-notices.md`; evidence in `docs/`)
- [x] File size within preset limits (sample: `docs/sample-output-413x531.jpg`; see `docs/evidence-summary.png`)
- [x] Works offline / supports large photos (static app, no network dependency; local large-sample generation available; see `docs/evidence-ui.png`)


## Stack / architecture
- **Type:** Static offline web app (no backend, no paid APIs/logins)
- **Files:** `src/index.html`, `src/styles.css`, `src/app.js` (vanilla JS, Canvas API)
- **Data:** Presets stored in JS + custom presets in `localStorage`; all processing client-side.

## Run (offline)
1. Open `src/index.html` in a browser (double-click or `file://`).
2. For best offline/file behavior, optionally serve locally: `python -m http.server` / any static server (not required if file:// works).

## Verification evidence
- Record in `docs/verification.md`: form presets used + notice links, exported file sizes (KB) from OS details, test with large image offline.

## Notes / decisions
- **Implementation:** Vanilla HTML/CSS/JS + Canvas; no dependencies, works from `file://`.
- **Presets:** 3 defaults included as common examples; must be validated/replaced against 3 real official form notices in `docs/form-notices.md` to satisfy “Done when”.
- **Compression:** Targets `<= maxKB` via quality search; UI warns if limit cannot be met at minimum quality (rare for extreme dimensions—adjust preset dims accordingly).
- **Signature:** Preview/exported as PNG in a separate output box (photo crop/compression follows selected preset).
- **Offline large-photo test:** Use “Load large sample (test)” or upload a real large phone photo with network disabled; record evidence in `docs/verification.md`.

