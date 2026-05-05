# API Surface Audit

Monthly audit detecting drift between Nx's public API surface and its documentation.

## What This Covers
- Barrel exports (`index.ts`) vs documented API reference pages
- Generator/executor schemas vs `packages.json` documentation registry
- `@nx/devkit` public API: JSDoc coverage, deprecated APIs, internal leaks
- Ocean/Nx Cloud publishable packages (when available)

## Reports
| Month | File | Severity | Findings |
|-------|------|----------|----------|
| 2026-05 | [2026-05.md](2026-05.md) | LOW-MEDIUM | 1H/4M/3L/2I — no new drift; 4 carried items unchanged; v21-marked devkit deprecations now 2 majors overdue at v23.0.0-beta.4. Several v23 breaking removals (detox executors deprecated, angular `move`/module-federation entry-point removed, stylesheet options removed) shipped without doc drift thanks to auto-doc pipeline |
| 2026-04 | [2026-04.md](2026-04.md) | LOW-MEDIUM | 1H/4M/3L/2I — JsonInput still undocumented; new vite `compiler` option + `nx.sync.ignoredDependencies` introduced this window without docs |
| 2026-03 | [2026-03.md](2026-03.md) | HIGH | 13H/50M/18L — 13 undocumented packages, 50 undocumented generators, systemic rename drift |

## Key Systemic Issues (2026-04 post-plateau-break)
1. **`@nx/angular-rsbuild` package documented but doesn't exist** in repo (new High)
2. **Stale `webpack-browser`/`webpack-server` references** in 3 Angular guides (executors removed)
3. **7 past-deadline deprecated APIs** (v19/v20) still publicly exported
4. **7 `devkit-exports.ts` blocks lack `@category`** (breaks TypeDoc)
5. **`create-nx-plugin` has no reference page** (CNW does; parity gap)
6. **v22/v23/v24 deprecation waves** (9/15+/3 items) have no migration docs
7. **`devkit-internals` leak**: 30 exports, 48 consumer files (improving from 58)

## Methodology (2026-04 revised)
Documentation is now auto-generated via `astro-docs/src/plugins/`:
- `PluginLoader` reads `packages/*/generators.json` and `executors.json`, respects `hidden: true`
- `NxReferencePackagesLoader` handles `nx`, `devkit`, `plugin`, `web`, `workspace`, CNW, CLI
- `CommunityPluginsLoader` handles `approved-community-plugins.json`

Audit now focuses on:
- Stale guide content (prose referencing removed executors/generators)
- Deprecated APIs past their stated removal deadline
- `@category` JSDoc gaps blocking TypeDoc output
- Discrepancies between `pluginToTechnology` mapping and actual `packages/` directories
- `devkit-internals.ts` consumer spread (internal API leak trendline)
- Recent git log for new APIs without corresponding `@category` / examples
