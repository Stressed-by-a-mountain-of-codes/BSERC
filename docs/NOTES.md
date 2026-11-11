# Project Notes

## Summary
All 8 selected projects have been implemented with code, documentation, and generated evidence artifacts (screenshots, sample outputs/data, and evidence summaries) in each project’s `docs/` folder. See each project’s `docs/verification.md` for recorded evidence and checklists.

| Project | Status | Evidence (in project `docs/`) |
|---|---|---|
| P2 Form Photo Fixer (A) | Implemented | `evidence-ui.png`, `evidence-summary.png`, `sample-output-413x531.jpg`, `form-notices.md` |
| P3 Resume Builder (A) | Implemented | `evidence-ui.png`, `evidence-summary.png`, `sample-resume-data.json` |
| P7 Bill Book (B) | Implemented | `evidence-ui.png`, `evidence-summary.png`, `bills-calculation-evidence.json` |
| P8 Auto Rally (B) | Implemented | `evidence-ui.png`, `evidence-summary.png` |
| P13 Style Spy (C) | Implemented | `evidence-summary.png` |
| P14 Tab Goblin (C) | Implemented | `evidence-summary.png` |
| P16 Your Own Skill (D) | Implemented | `evidence-summary.png`, `evidence/comparison.md` |
| P17 Same Page, New Design (D) | Implemented | `before.png`, `after.png`, `after-mobile.png`, `evidence-summary.png` |

## Details

### P2 — Form Photo Fixer
- **Folder:** `projects/p02-form-photo-fixer/`
- **Completed:** Photo/signature upload, 3 presets, crop with face guide (drag/zoom), compression under KB limit, custom presets, downloads, local large-sample generator. Reference specs linked in `docs/form-notices.md`.
- **To verify:** outputs meet rules for 3 real forms (with official notice links), OS-reported file size in KB, large photo works with Wi-Fi off.

### P3 — Resume Builder
- **Folder:** `projects/p03-resume-builder/`
- **Completed:** Form with live A4 preview, 3 templates, drag-to-reorder sections, JSON save/load, export via browser Print-to-PDF (selectable text).
- **To verify:** 2-page clean break, selectable/copied PDF text, save/load restores data, works offline.

### P7 — Bill Book
- **Folder:** `projects/p07-bill-book/`
- **Completed:** Shop profile & item list, bills with quantity/discount/tax, UPI QR for exact total, share/save bill image, history and daily total, local persistence, PWA (manifest + service worker).
- **To verify:** totals match 5 hand calculations, works in flight mode with saved bills, QR shows correct amount in a UPI app, installs on a real phone.

### P8 — Auto Rally
- **Folder:** `projects/p08-auto-rally/`
- **Completed:** Driveable auto-rickshaw on looping road, keyboard & touch controls, coins/obstacles/shield power-up, 3 laps with timer, best time saved locally, sound with mute, PWA assets.
- **To verify:** full race on phone in flight mode, playable without instructions, fair crashes/lap counts, best time persists after restart.

### P13 — Style Spy
- **Folder:** `projects/p13-style-spy/`
- **Completed:** Page colors ranked by usage, fonts/weights/sizes, click-to-copy, named kits in `chrome.storage.local`, export as CSS variables.
- **To verify:** hand-check on 5 websites, kits persist after Chrome restart, exported kit styles a plain page.

### P14 — Tab Goblin
- **Folder:** `projects/p14-tab-goblin/`
- **Completed:** Tab count and mood, list by ignored time, sleep via `chrome.tabs.discard`, Keep list, session save/restore.
- **To verify:** handles 30 open tabs smoothly, half-filled form not lost, session restores after restart, sleeping tabs wake on click.

### P16 — Your Own Skill
- **Folder:** `projects/p16-your-own-skill/`
- **Completed:** `/one-page-revision` skill definition and 3 sample without-vs-with comparisons.
- **To verify:** starts in a fresh session, works well on 3 different inputs, comparison showing improvement.

### P17 — Same Page, New Design
- **Folder:** `projects/p17-same-page-new-design/`
- **Completed:** `before.html` (plain) and `after.html` (redesigned, same text, responsive) with 3 design changes explained in README.
- **To verify:** redesign works on a phone.
