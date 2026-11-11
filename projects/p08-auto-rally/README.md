# P8 — Auto Rally (Section B, Phone Apps and Games)

**Status:** Implemented  
**Goal:** Cute auto-rickshaw racing game (HTML5 canvas), playable on phone with touch/keyboard, offline-capable PWA.

## Requirements coverage
### What to build
- [x] A driveable auto-rickshaw on a looping road
- [x] Keyboard and touch controls
- [x] Coins, obstacles and at least one power-up
- [x] 3 laps with a timer
- [x] A best time that stays saved
- [x] Sound with a mute button

### Done when (pending verification)
- [ ] A full race plays on a real phone in flight mode
- [ ] A friend finishes a race with no instructions
- [ ] Crashes and lap counts feel fair
- [ ] The best time survives a restart

## Stack / architecture
- **Type:** Offline-capable web app / PWA (vanilla HTML/CSS/JS Canvas, WebAudio beeps)
- **Files:** `src/index.html`, `src/styles.css`, `src/game.js`, `src/manifest.webmanifest`, `src/sw.js`, `src/icon.svg`
- **Persistence:** `localStorage` for best time

## Run / install
- Serve `src/` over HTTP for install/SW (e.g. `uv run python -m http.server 8001`), open on device, “Add to Home Screen”. Works offline after first load.

## Verification evidence
- Record in `docs/verification.md` (flight mode, friend playtest, fairness notes, restart/best-time check).
