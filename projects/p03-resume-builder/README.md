# P3 — Resume Builder (Section A, Web Tools)

**Status:** Not started  
**Goal:** Fill a form and generate a clean A4 resume with live preview; export PDF, save/load data; works offline.

## Requirements coverage
### What to build
- [x] A form with a live A4 preview
- [x] 3 templates that look truly different (Classic/Modern/Minimal)
- [x] Drag sections into a new order (HTML5 drag-drop list with show/hide toggles)
- [x] Export as PDF (browser Print-to-PDF for selectable text)
- [x] Save your data as a file and load it back (JSON download/upload)

### Done when (pending verification)
- [ ] A long resume breaks cleanly across 2 pages
- [ ] The text in the PDF can be selected and copied
- [ ] Loading the saved file restores everything
- [ ] It works with Wi-Fi off

## Stack / architecture
- **Type:** Static offline web app (vanilla HTML/CSS/JS, no backend/paid APIs/logins)
- **Planned files:** `src/index.html`, `src/styles.css`, `src/app.js`, templates/styles in `src/`
- **Export:** Browser Print-to-PDF (to keep text selectable) with `@page`/A4 CSS
- **Persistence:** JSON save/load + local state

## Run (offline)
1. Open `src/index.html` in a browser.

## Verification evidence
- Record in `docs/verification.md`: 2-page break test, PDF text select/copy check, save/load restore, offline run.

## Notes / decisions
- **Offline/static:** Vanilla HTML/CSS/JS, no dependencies or network calls.
- **A4 & export:** Preview uses 210mm×297mm page; export uses browser Print-to-PDF (`@media print`, `@page { size: A4; margin:0 }`) to preserve selectable text.
- **Templates:** Classic (serif, centered), Modern (two-column sidebar accent), Minimal (clean typographic). Modern distributes sections (skills/summary/achievements to sidebar).
- **Pagination:** Sections/entries use `break-inside: avoid` hints to reduce awkward splits; long content can span pages—verify 2-page clean break in `docs/verification.md`.
- **Persistence:** Full state saved/loaded as JSON.
