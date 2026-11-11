# Verification — P14 Tab Goblin

## Done when checklist
- [ ] Handles 30 open tabs smoothly
- [ ] A half-filled form is never lost
- [ ] A saved session restores after a Chrome restart
- [ ] Sleeping tabs wake correctly when clicked

## Evidence
- Generated evidence: `evidence-summary.png` (tab count/mood, ignored-time listing, sleep/keep/session behavior).
- Extension implementation: `src/` (MV3) uses tab metadata/`chrome.tabs.discard`, Keep list and sessions in `chrome.storage.local`.

| Date | Scenario | Result | Notes |
|---|---|---|---|
| 2026-11-12 | Implementation/features | Documented | Count+mood, ignored-time sort, sleep/discard, Keep list, session save/restore implemented |
|  | 30+ tabs open, popup/list performance | (record) |  |
|  | Half-filled form tab (kept/not discarded) | (record) | Keep/active tabs excluded from sleep actions |
|  | Save session, restart Chrome, restore | (record) |  |
|  | Discarded tab clicked/wakes | (record) |  |
