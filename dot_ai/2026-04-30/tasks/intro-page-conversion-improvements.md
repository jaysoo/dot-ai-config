# Intro Page Conversion Improvements (P0/P1)

**Branch:** `docs/intro-conversion-improvements`
**Worktree:** `/Users/jack/projects/nx-worktrees/intro-conversion`
**Date:** 2026-04-30
**Source plan:** `~/.claude/plans/can-you-do-a-witty-quail.md`

## Goal

Optimize `astro-docs/src/content/docs/getting-started/intro.mdoc` to:

1. **Primary** — drive more `nx` installs (NPM downloads). The page is the most-trafficked docs URL; today it has no copy-able install command anywhere on it.
2. **Secondary** — make Nx Cloud earn its sign-up by pain-point framing, not feature lists. Don't push Cloud early — soft seed only.

## Non-goals

- Changing the marketing homepage (different audience, different page).
- Adding a cache-hit GIF/asciinema asset (separate workflow — handled by `terminal-demo-recorder` skill in a follow-up; not blocking this PR).
- Broadening the headline to non-monorepo users (P1, more controversial — leave for a follow-up so this PR doesn't get held up on copy debate).
- Adding a project-graph thumbnail (P2).

## Scope (minimum-for-most-value)

| # | Change | Priority | Risk |
|---|--------|----------|------|
| 1 | Add tabbed install block above the fold (under lede, before video) | P0 | Low |
| 2 | Demote YouTube embed below install + value props | P1 | Low |
| 3 | Reframe Cloud row in the table from features to outcomes | P0 | Low |
| 4 | Add 1-sentence "use CLI first; reach for Cloud when CI gets slow" + soft `npx nx connect` seed | P0 | Low |
| 5 | Light trim of "What Nx does" prose (preserve all 5 points, cut explanatory tail) | P1 | Low |

## Files

- **Edit:** `astro-docs/src/content/docs/getting-started/intro.mdoc` (the only content file touched)
- **Read first:** `astro-docs/README.md` (per CLAUDE.md mandate)
- **Style check:** run `nx-docs-style-check` skill after edits (mandatory per CLAUDE.md)

## Markdoc reminders (per CLAUDE.md)

- Use underscores in tag names: `side_by_side` not `side-by-side`
- Code block filenames go INSIDE the fence as `// filename` first line, NOT `title=` attribute
- Markdoc tag attributes: numeric values unquoted (`cols=2` not `cols="2"`)
- `{% aside %}` with list children needs blank line before `{% /aside %}` or prettier indents into list and breaks parsing
- Don't escape template blocks — `{% %}` not `\{% %\}`
- Prefer existing Starlight components (`{% aside %}`) over custom Astro components

## Install block design

Use whatever existing tabs pattern the docs already use (check Starlight `Tabs` syntax in repo before writing). Show:

```
# Add Nx to an existing repo
npx nx@latest init

# Or start fresh with a new workspace
npx create-nx-workspace@latest my-workspace
```

Show npm/pnpm/yarn/bun variants if the repo's convention is multi-tab; otherwise pick npx (works regardless of package manager) and call out that pnpm/yarn/bun also work.

## Cloud row reframe

Today's row:

> **Nx Cloud** — Remote caching, affected commands, and self-healing CI.

Proposed:

> **Nx Cloud** — Share cache hits across your team and CI. Skip work for projects that didn't change. Stop manually re-running flaky tests.

Outcome-framed, no marketing language.

## Soft Cloud seed

After the table, add a 1–2 sentence aside (using `{% aside %}` if appropriate):

> Most teams start with the open-source CLI. When CI starts to feel slow or flaky, that's when Cloud earns its keep — `npx nx connect` to wire it up.

No CTA button, no email gate, no link push. Just a seed.

## What stays the same

- Frontmatter, title, sidebar order
- "Challenges of monorepos" section (good problem framing)
- 5 numbered capability bullets in "What Nx does" (just lighter prose around them)
- Code block showing cache hit
- "Start small, grow as needed" framing + table structure
- Both deepdive callouts ("How does Nx run tasks?" and "Can I add Nx to a single-project repo?")
- "Where to go from here" branched CTAs
- Community links footer

## Verification

1. `nx serve astro-docs` from the worktree; load `/docs/getting-started/intro` and confirm:
   - Install block renders correctly desktop + mobile (commands shouldn't wrap awkwardly)
   - Tabbed install (if used) cycles correctly
   - YouTube embed is below the install moment, not above
   - Cloud row reads as outcome statements, not feature list
   - Soft Cloud seed is non-pushy (gut check: would I be annoyed if I were a first-time visitor?)
2. Run `nx-docs-style-check` skill — fix any flagged issues before commit.
3. `git diff` review — should be a single-file change, ~30–60 lines net.
4. Commit with `docs(misc):` scope (per Nx conventional commit rules — `docs` is valid for Nx).

## PR notes

- Title: `docs(misc): improve intro page conversion (install block, cloud framing)`
- Body sections (per Nx PR template): Current Behavior / Expected Behavior / Related Issue(s)
- Caveman commit body — terse fragments, not paragraphs (per memory feedback)
- No related issue number unless one exists; this is product-driven not issue-driven

## Follow-ups (not in this PR)

- Cache-hit asciinema asset (terminal-demo-recorder skill)
- Project-graph thumbnail
- Headline broadening A/B test
- A/B test current vs new on click-through to `/start-new-project` and `/start-with-existing-project`
