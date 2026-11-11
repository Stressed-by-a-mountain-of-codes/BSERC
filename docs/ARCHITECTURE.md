# Project Notes & Conventions

## Workspace layout
```
Week2-Submission/
  README.md                 # overview and project index
  docs/
    PROJECT_PLAN.md         # scope and acceptance criteria
    ARCHITECTURE.md         # this file (conventions/structure)
    NOTES.md                # progress and verification notes
  projects/
    p02-form-photo-fixer/
    p03-resume-builder/
    p07-bill-book/
    p08-auto-rally/
    p13-style-spy/
    p14-tab-goblin/
    p16-your-own-skill/
    p17-same-page-new-design/
```

## Per-project structure
Each project folder contains:
- `README.md` — purpose, features, tech/stack, run/install steps, offline notes, and a checklist mapped to “Done when”.
- `prompts.md` — chronological log of prompts used while building.
- `src/` (or equivalent source/app files) — implementation.
- `assets/` — sample/harmless test files as needed.
- `docs/` — decisions, references, and verification/test records (e.g. form notices, comparison notes).

> Structure varies slightly by project type (static web app, PWA, Chrome extension, skill files, or plain HTML pages).

## Conventions
- **Offline-first / no paid dependencies:** no paid APIs, no login-required services, and no required runtime CDN for core functionality.
- **UI:** clear layout, readable text, and descriptive button labels.
- **Test data:** harmless/sample data only.
- **Verification:** “Done when” checks recorded in each project’s `docs/verification.md` with notes/evidence where applicable.
- **Paths:** relative paths within each project where possible.
