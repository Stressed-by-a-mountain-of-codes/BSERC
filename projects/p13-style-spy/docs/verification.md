# Verification — P13 Style Spy

## Done when checklist
- [ ] Check results by hand on 5 websites
- [ ] Saved kits survive a Chrome restart
- [ ] Paste a kit into a plain page and it picks up the style

## Evidence
- Generated evidence: `evidence-summary.png` (sample extracted colors/fonts, kit save/export flow, CSS variables example).
- Extension implementation: `src/` (MV3) analyzes computed styles, ranks colors by usage, copies values, saves kits in `chrome.storage.local`, exports CSS variables.

## Hand-check (5 websites)
| # | Website | Sampled colors/fonts (DevTools/expected) | Extension result | Match? |
|---|---|---|---|---|
| 1 | (run on target site) | (inspect computed styles) | (compare) |  |
| 2 | (run on target site) | (inspect computed styles) | (compare) |  |
| 3 | (run on target site) | (inspect computed styles) | (compare) |  |
| 4 | (run on target site) | (inspect computed styles) | (compare) |  |
| 5 | (run on target site) | (inspect computed styles) | (compare) |  |

## Persistence / export
- Kit name saved: (record)
- Chrome restarted, kit still present?: (record)
- Plain page test file and result: (record)
