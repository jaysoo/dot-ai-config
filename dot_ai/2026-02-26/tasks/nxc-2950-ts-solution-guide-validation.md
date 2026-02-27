# NXC-2950: TS Solution Migration Guide — Validation & Update

**Started:** 2026-02-26
**Branch:** NXC-2950
**Status:** COMPLETE (2 iterations, guide verified end-to-end)
**Guide file:** `astro-docs/src/content/docs/technologies/typescript/Guides/switch-to-workspaces-project-references.mdoc`

## Phase 1: Guide Update — COMPLETE

All gaps from the ocean generator analysis added (8 total):

1. **`.gitignore` section** — new section after "Enable Package Manager Workspaces" with `out-tsc`, `dist`, `test-output` patterns
2. **Root tsconfig expansion** — clarified: remove `paths` entirely (not `{}`), move non-compilerOptions properties to project configs, `declaration` can be omitted, remove `baseUrl` and `rootDir`. Added "Order of Operations" caution: run `npm install` BEFORE removing paths.
3. **Package.json `./package.json` self-export** — added to both non-buildable and buildable library examples
4. **Nested path alias strategy** — expanded callout with table of flattening strategies + multi-entrypoint `exports` example
5. **"Update Import Paths" section** — new section covering find/replace for renamed packages
6. **"Bundler Configuration Updates" section** — added webpack auto-detect note (`NxAppWebpackPlugin` needs no changes), vitest `nxViteTsPaths` removal note
7. **"Update Build Targets" section** — remove `@nx/js:tsc` build targets for non-buildable libs (discovered during Phase 3)
8. **"Future Plans"** — softened language

## Phase 2: Test Workspace — COMPLETE

**Location:** `/private/tmp/nx-test-workspace`
**Nx version:** 22.5.3

### Workspace Structure:
- 5 JS libs: `utils`, `models`, `helpers`, `validators`, `shared` (tsc bundler, vitest)
- 2 React apps: `app-webpack` (webpack+jest), `app-vite` (vite+vitest)
- Cross-project imports: `helpers→models`, `validators→models`, `shared→utils+models`, both apps→all libs
- Baseline passes: `nx run-many -t build,test,lint` all green

### Key Finding: CLAUDECODE Env Var
`CLAUDECODE=1` forces `create-nx-workspace` to use TS solution preset. Must unset `CLAUDECODE` and use `HOME=/tmp` (to bypass local `.npmrc` with verdaccio registry) when creating an integrated workspace for testing.

## Phase 3: First Conversion — COMPLETE (issues found)

### Issues Found:
1. **`@nx/js:tsc` build targets fail with TS5090** — `Non-relative paths are not allowed when 'baseUrl' is not set`. The old `@nx/js:tsc` executor doesn't work in TS solution mode for libs with cross-project imports. Solution: remove these build targets (non-buildable libs don't need them).
2. **`nxViteTsPaths` in vitest configs** — all 5 lib vitest configs had it, plus the vite app. Guide already covered this but the vitest note was validated.
3. **`baseUrl` removal** — guide needed to mention removing `baseUrl` from `tsconfig.base.json`.

## Phase 4: Second Iteration — COMPLETE (all green)

Clean conversion from baseline using automated script following the guide:
- typecheck: 7/7 passed
- test: 7/7 passed
- lint: 7/7 passed
- app-webpack build: passed
- app-vite build: passed

No further issues found. Guide is validated end-to-end.

## Phase 5: Edge Case Audit — COMPLETE

Cross-referenced all 11 edge cases from the plan against the guide. Added 5 missing items:

1. **Non-standard project locations** — caution box after workspace tabs about custom patterns and root-level projects
2. **Circular dependencies** — caution box warning that TS project references don't support circular deps, use `nx graph` to find them
3. **E2E projects** — note that Cypress/Playwright projects don't need `tsconfig.lib.json` or build targets
4. **Jest resolver** — new "Jest Configuration" subsection under Bundler Configuration Updates; `@nx/jest/plugins/resolver` auto-falls back to TS module resolution
5. **tsconfig include/exclude patterns** — note to verify patterns after restructuring extends chain

Previously covered (no changes needed):
- Order of operations (install before removing paths) — caution box
- `nxViteTsPaths` removal — Vite + Vitest sections
- Multiple entrypoints per lib — multi-entrypoint exports example
- `outputPath` in project.json — covered by "Task Outputs Within the Project" note + "Update Build Targets" section

## Reference Files
- Ocean generator: `~/projects/ocean/libs/nx-cloud-plugin/src/generators/convert-ts-solution/convert-ts-solution.ts`
- Webpack auto-detect: `packages/webpack/src/plugins/nx-webpack-plugin/lib/apply-base-config.ts:265-266`
- TS solution detection: `packages/js/src/utils/typescript/ts-solution-setup.ts`
- Jest resolver: `packages/jest/plugins/resolver.ts` (fallback to TS module resolution at line 80)
- Vite TS paths: `packages/vite/plugins/nx-tsconfig-paths.plugin.ts`
