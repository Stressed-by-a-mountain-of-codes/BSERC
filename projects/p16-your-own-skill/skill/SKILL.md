---
name: one-page-revision
description: Turn a chapter or study notes into a concise, well-structured one-page revision sheet. Use when the user asks for a one-page revision, revision sheet, cheat sheet, or quick summary from notes/chapter content.
---

# One-Page Revision

Produce a single-page, exam-friendly revision sheet from the provided chapter/notes.

## When to use
- User provides notes, a chapter summary, or a topic and asks for "one-page revision", "revision sheet", "cheat sheet", or "summarize for revision".
- Input can be plain text, bullet notes, or pasted content.

## Workflow
1. **Identify scope:** topic, key subtopics, and what matters for recall/exams.
2. **Extract essentials:** definitions, core concepts, formulas/rules/facts, processes/steps, comparisons, and common pitfalls.
3. **Compress aggressively:** remove filler/examples except one short anchor example if critical; prefer bullets and tables over paragraphs.
4. **Fit one page:** prioritize high-yield content; keep it scannable (target ~300-500 words depending on density).

## Required output format
Use this structure (omit a section only if truly not applicable, but keep it tight):

# <Topic> — One-Page Revision

## Key ideas (must-know)
- 3-6 bullets capturing the central concepts.

## Definitions / Terms
- **Term:** short definition (or a compact table if many).

## Formulas / Rules / Key facts
- List formulas, rules, dates, or facts to memorize.

## Process / Steps / Diagram-in-words (if applicable)
- Numbered steps or a simple flow (A → B → C).

## Common mistakes & exam tips
- 2-4 pitfalls/misconceptions and how to avoid them.

## Quick self-check (3 questions)
1. ...
2. ...
3. (include brief answers inline in parentheses or after an em dash)

## Style rules
- Clear headings, bullets, **bold** key terms; no long paragraphs.
- Be accurate to the provided material; do not invent details. If input is thin, state assumptions briefly.
- Aim for a layout that would reasonably fit on one printed page.
