# Verification — P8 Auto Rally

## Done when checklist
- [ ] A full race plays on a real phone in flight mode
- [ ] A friend finishes a race with no instructions
- [ ] Crashes and lap counts feel fair
- [ ] The best time survives a restart

## Evidence
- UI/build evidence: `evidence-ui.png`, `evidence-summary.png`
- Device/browser: (record during run)
- Install/offline steps: serve `src/` and install as PWA / Add to Home Screen; verify in flight mode.
- Friend playtest notes: (record)
- Fairness observations (crashes/laps): obstacle collision applies brief slowdown/invulnerability; 3 laps tracked with finish crossings.
- Best time before/after restart: stored in `localStorage` (verify persists).
