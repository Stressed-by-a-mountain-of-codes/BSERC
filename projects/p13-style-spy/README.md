# P13 — Style Spy (Section C, Chrome Extension)

**Status:** Implemented  
**Goal:** Inspect any page’s colors and fonts, copy values, save named kits, export as CSS variables. All local (no server).

## Requirements coverage
### What to build
- [x] Show the page's main colors, ranked by how much they are used
- [x] Show its fonts, weights and sizes
- [x] Click anything to copy it
- [x] Save kits under a name
- [x] Export a kit as CSS variables

### Done when (pending verification)
- [ ] Check results by hand on 5 websites
- [ ] Saved kits survive a Chrome restart
- [ ] Paste a kit into a plain page and it picks up the style

## Install (unpacked)
1. Open `chrome://extensions` → enable **Developer mode**.
2. Click **Load unpacked** → select `projects/p13-style-spy/src`.
3. Open any website, click the extension icon to analyze.

## Stack
- Manifest V3 extension: `manifest.json`, `popup.html/js/css`, `content.js`
- Storage: `chrome.storage.local` for kits (survives restart)
- Analysis: computed styles of visible elements (color/background/border/fill/stroke, font-family/weight/size), ranked by element area/usage.

## Verification
Record in `docs/verification.md` (5-site hand check, restart persistence, CSS variables applied to plain page). Include install steps for a friend in this README.
