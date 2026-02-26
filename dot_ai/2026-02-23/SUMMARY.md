# Summary — 2026-02-23

## Issue #30146: Pruning docs guide + error message improvement

**Issue:** https://github.com/nrwl/nx/issues/30146
**Context:** 34-comment issue, users migrating to Nx 20 TS Solution Setup lost `generatePackageJson` support with no docs on the replacement prune workflow. At least one team left Nx over this.

### Phase 1: Documentation (branch `issues-30146`)

Created a dedicated pruning guide and updated the existing bundling guide so the two articles form a pair covering the two deployment approaches:

- **New:** `astro-docs/src/content/docs/technologies/node/Guides/deploying-node-projects.mdoc` — "Pruning Projects for Deployment"
  - When to prune vs bundle (comparison table with cross-links)
  - How the 4 prune targets work (`build` → `prune-lockfile` + `copy-workspace-modules` → `prune`)
  - Target configuration (package.json / project.json tabs, matching real generated output)
  - Dockerfile example (matches actual `nx g @nx/node:app --docker` output)
  - Step-by-step migration from `generatePackageJson` (esbuild / webpack / rollup tabs)
- **Updated:** `bundling-node-projects.mdoc` — "Bundling Projects for Deployment"
  - Restructured intro to match pruning guide (comparison table, bullet criteria)
  - Style guide compliance (sentence case headings, no em dashes, no bold for emphasis, line wrapping)
  - Cross-link to pruning guide in table and "When not to bundle" section
- **Updated:** `ci-deployment.mdoc` — Added aside directing TS Solution Setup users to the pruning guide

### Phase 2: Error message improvement (branch `issues-30146-error-msg`)

Updated the `generatePackageJson` error messages in `@nx/esbuild` and `@nx/rollup` to include a link to the new docs page so users can find the migration steps immediately.

- `packages/esbuild/src/executors/esbuild/lib/normalize.ts`
- `packages/rollup/src/plugins/with-nx/with-nx.ts`

## PR #34493: Fix esbuild noEmit/composite tsbuildinfo

**PR:** https://github.com/nrwl/nx/pull/34493
**Branch:** `fix/js-noEmit-composite-tsbuildinfo`

Monitored CI pipeline via `/ci-monitor`. CI passed successfully on first attempt — no self-healing needed. CIPE: https://staging.nx.app/cipes/699cd370bfad71a77bca474e

Related to issue #34492 from the easy issues scan (esbuild type-check skip when `skipTypeCheck: true`).

## Nx Easy Issues Scan

Scanned 381 open issues from nrwl/nx (past year), ranked 11 by AI suitability and engineering impact. Analysis saved to `.ai/2026-02-23/tasks/nx-easy-issues-top11.md`. Top picks: #32126 (bun publish), #34492 (esbuild type-check), #34391 cluster (git tag interpolation).

### Other

- **CS-84: Connect Pylon to Linear** — Task plan created (`.ai/2026-02-23/tasks/cs-84-connect-pylon-to-linear.md`)
