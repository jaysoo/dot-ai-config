---
name: linear-issue-style
description: >
  Enforce caveman-lite prose style on every Linear issue description written or updated
  via the Linear MCP tools. Descriptions must be succinct: no filler, no hedging, no
  marketing recap. Keep articles and full sentences; drop everything else. Applies to
  ALL Linear issue create/update operations — no user keyword required.
  Triggers automatically when about to call:
    - mcp__claude_ai_Linear__save_issue
    - mcp__claude_ai_Linear__create_comment (if comment is issue-description-like)
  Also triggers on phrases like "make this Linear issue shorter", "caveman-lite the
  issue", "trim the description".
---

# Linear issue style — caveman lite, always

All Linear issue descriptions MUST be caveman-lite. This is a blocking rule, not a preference.

## What caveman-lite means here

- Keep articles (a/an/the) and full sentences — it's a Linear issue, not a shell prompt
- Drop filler words: just, really, basically, actually, simply, essentially, clearly
- Drop hedging: I think, it seems, probably, might be worth, perhaps
- Drop pleasantries: "this is a great opportunity to", "we could consider"
- Drop marketing recap: don't restate the summary at the end
- Drop transitional throat-clearing: "With that said", "That being said", "Moving on"
- Short synonyms (use ≠ utilize, fix ≠ implement a solution for)
- Technical terms stay exact

## Structure rules

Use this shape unless the issue genuinely doesn't fit:

```markdown
## Summary
One paragraph, 2–3 sentences. Problem + proposed action.

## Current code (or Current behavior)
File path + line number. Minimal quote. What it does.

## Proposed code (or Proposed behavior)
Code block or short description. No restating "this is better because".

## Measured impact (if applicable)
Table. Before / After / Delta only.

## Edge cases handled (if applicable)
Bullet list. One line per case. Input → outcome.

## Repro (if applicable)
One line: repo + branch + command.
```

Not every section is required — drop the ones that don't apply. Order can vary.

## What NOT to do

- DON'T write "## Context" sections that restate the summary in more words
- DON'T write multi-paragraph rationales — the reader can infer from the table
- DON'T use em-dash transitions to pad a sentence out ("— which means that — ")
- DON'T recap at the end. End on the last table row or the last bullet.
- DON'T include sentences like "This patch addresses the single largest slice"
  unless the issue is a survey that needs to justify priority
- DON'T include phrases like "Zero behavior change" more than once
- DON'T include the Corepack-is-a-Node-tool history. Assume reader knows
  the surrounding ecosystem.

## Before calling save_issue

Check the description against these, in order:

1. Can any paragraph be cut to one sentence without losing info? Cut it.
2. Any sentence start with "This"? Likely restating — consider removing.
3. Any word ending in "-ly" in a non-technical context? Probably filler.
4. Two sentences saying the same thing with different words? Keep one.
5. Does the last paragraph add a new fact, or just "wrap up"? Wrap-ups go.

Applies the same way on updates: re-check the existing description against
these rules and rewrite rather than append.

## Example of the transformation

BAD (verbose):
> This patch addresses the single largest slice of that bootstrap. The measured
> impact is significant and worth pursuing. In fact, 99%+ of "time to cache
> fully restored" is not the cache — it's bootstrap overhead, and this change
> directly reduces that overhead by avoiding a subprocess spawn.

GOOD (caveman-lite):
> 99%+ of "time to cache fully restored" is bootstrap, not cache. This cut
> removes the largest slice of the bootstrap.

Two sentences, same information, 1/3 the tokens. The reader does not need to
be told the change is worth pursuing — the numbers say so.
