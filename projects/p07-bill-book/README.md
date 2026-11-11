# P7 — Bill Book (Section B, Phone Apps and Games)

**Status:** In progress  
**Goal:** Billing app for a small shop: bills, UPI QR for exact total, share as image, history/daily totals. Offline-capable and installable on phone (PWA).

## Requirements coverage
### What to build
- [x] A shop profile and an item list with prices
- [x] Bills with quantity, discount and tax
- [x] A UPI QR code for the exact total
- [x] Share a bill as an image
- [x] Bill history and a daily total

### Done when (pending verification)
- [ ] Totals match hand calculation on 5 bills
- [ ] Works in flight mode, and old bills stay saved
- [ ] A UPI app scans the QR and shows the right amount (no payment required)
- [ ] Installs on a real phone

## Stack / architecture
- **Type:** Offline-capable web app / PWA (vanilla HTML/CSS/JS, no paid APIs/logins)
- **Files:** `src/index.html`, `src/styles.css`, `src/app.js`, `src/manifest.webmanifest`, `src/sw.js`, `src/qrcode.js` (vendored minimal QR generator)
- **Storage:** `localStorage` (shop profile, items, bills) — persists across restarts
- **QR:** UPI intent/link `upi://pay?pa=<vpa>&pn=<name>&am=<amount>&cu=INR&tn=<note>` rendered as QR locally
- **Share:** Bill rendered to canvas and shared/downloaded as image

## Run / install
- **Local:** serve `src/` over HTTP for PWA install/SW (e.g. `uv run python -m http.server 8000` from `src/`), open on phone/desktop browser.
- **Install:** use browser “Install app/Add to Home Screen”.
- **Offline:** service worker caches app shell; data in localStorage.

## Verification evidence
- Record in `docs/verification.md`: 5 hand-calculated bills, flight-mode test, QR scan amount check, phone install steps.

## Notes / decisions
- Implemented as PWA to satisfy “installs on a real phone” and flight-mode/offline behavior without native build tooling.
- UPI QR amount is formatted to 2 decimals in the UPI link; confirm with a UPI app scanner (amount shown, no need to pay).
- Tax/discount applied per line as configurable percentages/values (documented in UI) — verify with 5 manual bill calculations.
