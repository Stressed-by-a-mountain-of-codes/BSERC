# P14 — Tab Goblin (Section C, Chrome Extension)

**Status:** Implemented  
**Goal:** Manage many tabs: show count/mood, list by ignored time, sleep (discard) tabs without closing, Keep list, save/restore sessions.

## Requirements coverage
### What to build
- [x] Show tab count and a goblin whose mood changes with it
- [x] List tabs by how long they have been ignored
- [x] Put tabs to sleep without closing them (`chrome.tabs.discard`)
- [x] A Keep list the goblin never touches
- [x] Save a session and restore it

### Done when (pending verification)
- [ ] Handles 30 open tabs smoothly
- [ ] A half-filled form is never lost
- [ ] A saved session restores after a Chrome restart
- [ ] Sleeping tabs wake correctly when clicked

## Install (unpacked)
1. `chrome://extensions` → Developer mode → Load unpacked → select `src/`.
2. Click extension icon to open popup.

## Notes
- **Sleep:** uses Chrome’s built-in tab discard (frees memory, tab remains; wakes on click). Active/audible/pinned tabs and Keep-listed tabs are excluded from auto/feed actions.
- **Keep list:** stored in `chrome.storage.local` by URL; never discarded/restored-closed by goblin actions.
- **Sessions:** saved as URL lists in `chrome.storage.local` and restored by opening tabs (survives restart).

## Verification
Record in `docs/verification.md`.
