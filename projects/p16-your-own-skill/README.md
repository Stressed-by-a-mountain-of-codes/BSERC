# P16 — Your Own Skill (Section D, Video, Skills and Design)

**Status:** Implemented  
**Choice:** **`/one-page-revision`** — turns a chapter/topic note into a one-page revision sheet.

## Requirements coverage
### What to build (pick one)
- [x] `/one-page-revision`: Turns a chapter into a one-page revision sheet. (see `skill/SKILL.md`)

### Done when (pending verification)
- [ ] It starts correctly in a fresh session (install/copy `skill/` per agent convention and invoke in fresh session)
- [ ] It works well on 3 different inputs (see `evidence/comparison.md` examples; validate with real runs)
- [ ] Run the same task without the skill. Show what got better (see `evidence/comparison.md`)

## Skill artifact
- `skill/SKILL.md` — skill definition (name, description, instructions, output format).  
  - To use: place/copy the `skill/` folder as a skill named `one-page-revision` in your agent’s skills directory (per your agent’s convention) and invoke `/one-page-revision` (or ask to use the skill) in a fresh session.

## Evidence
- `evidence/` contains 3 sample inputs and **without-skill vs with-skill** comparison outputs demonstrating improvements (structure, brevity, exam-focus, scanability).
- Record fresh-session and real-run verification in `docs/verification.md`.

## Why this skill helps
Consistent one-page structure (key ideas, definitions, formulas/facts, pitfalls, quick checks) makes revision faster and more complete than ad-hoc summaries.
