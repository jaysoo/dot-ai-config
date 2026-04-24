# 2026-04-24 — Summary

## Accomplished

### Callout → aside/deep_dive migration (astro-docs)

Triggered by a reviewer note in `~/projects/nx-worktrees/issue-33331/REVIEW_REPORT.md` that waved off a `{% callout %}` concern because the tag was still registered. Tightened the rule instead.

- Removed `{% callout %}` from `astro-docs/markdoc.config.mjs` so build hard-errors on reuse.
- Added `{% deep_dive %}` Markdoc tag (transform fixes `type: 'deepdive'`, reuses `Callout.astro`).
- Migrated all 8 existing callouts: 5 → `{% deep_dive %}`, 2 → `{% aside type="note" %}`, 1 → `{% aside type="caution" %}` (was `caution`), 1 → `{% aside type="caution" %}` (was `warning`, no warning type in Starlight).
- `astro-docs/STYLE_GUIDE.md`: new "Markdoc tags" section with old→new mapping table.
- `.vale/styles/Nx/MarkdocCallout.yml`: error-level Vale rule. Pattern `callout\s+(type|title)` — Vale's `TokenIgnores` blocks any regex containing `{`, `%`, `/` from matching Markdoc braces even with `scope: raw`, so the rule anchors on the required attribute instead. Verified against positive/negative cases + clean full-docs run.
- Not verified: full `astro-docs:build` — worktree missing `node_modules`. Markdoc config passes `node --check`.

Details: `dot_ai/2026-04-24/tasks/callout-to-aside-migration.md`. Changes sit on `fix/issue-33331` branch, uncommitted.

## Pending / deferred

- Commit the callout cleanup on `fix/issue-33331` (or separate branch if preferred) after `pnpm install` + full build verifies.

## Files

- `dot_ai/2026-04-24/tasks/callout-to-aside-migration.md`
- `~/projects/nx-worktrees/issue-33331/astro-docs/markdoc.config.mjs`
- `~/projects/nx-worktrees/issue-33331/astro-docs/STYLE_GUIDE.md`
- `~/projects/nx-worktrees/issue-33331/astro-docs/.vale/styles/Nx/MarkdocCallout.yml`
- 8 `.mdoc` files under `astro-docs/src/content/docs/`
