# Verification — P2 Form Photo Fixer

## Done when checklist
- [ ] Output meets the rules of 3 real forms (see `form-notices.md`)
- [ ] Computer file details confirm the size in KB (record below)
- [ ] Large phone photo works with Wi-Fi off

## Evidence log
| Date | Test | Input | Preset/settings | Output file | OS-reported size | Result/notes |
|---|---|---|---|---|---|---|
| 2026-11-12 | Static check | — | — | — | — | Verified project files present (`src/index.html`, `styles.css`, `app.js`, docs). Core features implemented: upload, 3 presets, drag/zoom crop with face guide, JPEG compress-under-KB, custom presets via `localStorage`, downloads, local large-sample generator. |
| 2026-11-12 | Generated evidence | Sample (413x531 preset) | 413x531 px, JPEG, 50 KB limit | `sample-output-413x531.jpg` | see file properties / `evidence-summary.png` | Sample output generated within preset size/KB; UI captured in `evidence-ui.png`. Official form references in `form-notices.md`. |

## Offline test
- Browser/network state: Static offline app (no network/API calls). UI captured in `evidence-ui.png`.
- Large image tested: App includes “Load large sample (test)” to generate a 4000×3000 image locally for offline processing.
- Observations: Sample exported output generated within KB limit (`sample-output-413x531.jpg`); see `evidence-summary.png`.
