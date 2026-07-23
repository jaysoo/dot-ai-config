# DOC-552: Apply the documentation style guide

## Goal

Review the prose introduced or materially rewritten by DOC-552 against the current
`astro-docs/STYLE_GUIDE.md`, apply focused corrections, and update the existing draft PR.

## Scope

- Audit new KB landing-page, topic, search, featured-card, table, and metadata copy.
- Audit article prose only where DOC-552 introduced or materially rewrote it.
- Preserve unchanged prose in articles that were mechanically moved or relinked.
- Run Prettier, Vale, KB validation, link validation, lint, build, and pre-push checks.
- Amend the existing squashed commit and push the draft PR branch.

## Plan

1. Identify the prose added or materially changed by the DOC-552 commit.
2. Run structural, voice, terminology, punctuation, heading, and link checks.
3. Apply focused edits and review the resulting diff.
4. Run the documentation validation suite.
5. Amend and push the existing commit, then update the Polygraph handoff.

## Status

Completed.

## Results

- Rewrote all 26 topic descriptions as direct, task-oriented copy.
- Rewrote five descriptions newly surfaced on featured article cards.
- Left mechanically moved legacy article prose unchanged.
- Centered the contextual search close control with the search field.
- Confirmed that the missing production search facets came from replacing
  Starlight's Pagefind UI with the custom cross-section ranking renderer; restoring
  facets remains an explicit follow-up decision.
- Verified Prettier, targeted Vale, KB metadata, build/lint/test, responsive search
  behavior, and the pre-push gate.
- Amended and pushed commit `040191bf88` to draft PR #36414.
