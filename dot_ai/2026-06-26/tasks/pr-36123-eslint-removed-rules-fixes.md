# PR #36123 ESLint Removed Rules Fixes

## Goal

Fix review findings on https://github.com/nrwl/nx/pull/36123.

## Context

- Local checkout: `/Users/jack/.polygraph/sessions/nx-23.1.0-beta.0-Migration-24e91166/repos/nrwl/nx`
- Branch: `feat/migrate-removed-ts-eslint-extension-rules`
- Related Polygraph session: `review-eslint-migration-226db278`
- Reference session: `migration-failed-ocean-ec23eb4f`

## Plan

1. Expand the migration rule list to include other active typescript-eslint v8 removed rules that break flat config loading.
2. Avoid formatting files when the migration made no content changes.
3. Add regression tests for the expanded rule set and no-op behavior.
4. Run focused Prettier and Nx test validation.

## Progress

- 2026-06-26 09:35: Created task and confirmed local PR branch.
- 2026-06-26 09:45: Added missing non-format removed rules, guarded formatting to changed files, and verified focused tests/build/lint.
