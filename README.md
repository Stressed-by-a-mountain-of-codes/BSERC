# GenAI Internship — Week 2 Projects

**Name:** Sayan Karmakar  
**Course:** Bharat Space Education Research Centre, GenAI Internship (Week 2)  
**Instructor:** Karan Bagul

This repository contains 8 projects completed for Week 2, covering web tools, phone apps/games, Chrome extensions, and skills/design tasks (minimum: 8 projects total with at least 2 from each section).

## Projects

| # | Section | Project | Folder | Status |
|---|---|---|---|---|
| 1 | A — Web tools | **Form Photo Fixer** | [`projects/p02-form-photo-fixer`](projects/p02-form-photo-fixer) | Implemented (testing/verification notes in project docs) |
| 2 | A — Web tools | **Resume Builder** | [`projects/p03-resume-builder`](projects/p03-resume-builder) | Implemented |
| 3 | B — Phone apps & games | **Bill Book** | [`projects/p07-bill-book`](projects/p07-bill-book) | Implemented |
| 4 | B — Phone apps & games | **Auto Rally** | [`projects/p08-auto-rally`](projects/p08-auto-rally) | Implemented |
| 5 | C — Chrome extensions | **Style Spy** | [`projects/p13-style-spy`](projects/p13-style-spy) | Implemented |
| 6 | C — Chrome extensions | **Tab Goblin** | [`projects/p14-tab-goblin`](projects/p14-tab-goblin) | Implemented |
| 7 | D — Video, skills & design | **Your Own Skill** (`/one-page-revision`) | [`projects/p16-your-own-skill`](projects/p16-your-own-skill) | Implemented |
| 8 | D — Video, skills & design | **Same Page, New Design** | [`projects/p17-same-page-new-design`](projects/p17-same-page-new-design) | Implemented |

## Repository structure

- `projects/<project>/` — source code and project files
  - `README.md` — overview, features, setup/run steps, and requirement checklist
  - `prompts.md` — prompts used during development (in order)
  - `docs/` — notes, references, and verification/test records
- `docs/` — overall plan and project notes

## General notes

- Projects are built to run **without paid APIs or logins**; web projects are designed to work offline where specified.
- Sample/harmless data is used for testing.
- See each project’s `README.md` for setup, usage, and how it meets the “Done when” criteria.

## Quick start

- **P2 Form Photo Fixer:** open `projects/p02-form-photo-fixer/src/index.html` in a browser.
- **P3 Resume Builder:** open `projects/p03-resume-builder/src/index.html` (use Print → Save as PDF to export).
- **P7 Bill Book / P8 Auto Rally (PWA):** serve the project `src/` folder locally (e.g. `python -m http.server`) for install/service-worker support, then open in a browser.
- **P13 Style Spy / P14 Tab Goblin:** load the project `src/` folder as an unpacked extension in `chrome://extensions` (Developer mode).
- **P16 Your Own Skill:** see `projects/p16-your-own-skill/skill/SKILL.md` and `evidence/comparison.md`.
- **P17 Same Page, New Design:** open `projects/p17-same-page-new-design/before.html` and `after.html`.
