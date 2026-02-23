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

### Other

- **CS-84: Connect Pylon to Linear** — Task plan created (`.ai/2026-02-23/tasks/cs-84-connect-pylon-to-linear.md`)
