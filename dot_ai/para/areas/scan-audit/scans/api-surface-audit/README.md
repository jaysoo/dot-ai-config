# API Surface vs Documentation Drift Audit

Recurring audit comparing the actual public API surface of Nx packages against what is documented on nx.dev (astro-docs). Note: `docs/packages.json` was deleted in PR #35315 (April 2026) — drift now measured against `astro-docs/` content collections and the auto-discovery loader in `astro-docs/src/plugins/plugin.loader.ts`.

## Purpose

Detect:

- Exported symbols, generators, or executors with no corresponding documentation page
- Documentation pages referencing generators/executors that have been removed or renamed
- `@deprecated` annotations past their stated removal deadline
- Internal APIs leaking into public surface (`devkit-internals` consumers)

## Scope

**Primary packages** (deep audit): `nx`, `@nx/devkit`, `@nx/js`, `@nx/webpack`, `@nx/vite`, `@nx/react`, `@nx/angular`, `@nx/next`, `@nx/jest`, `@nx/playwright`, `@nx/rspack`, `@nx/esbuild`

**Secondary** (package-level): All remaining `packages/*` entries.

## Methodology

1. Clone/scan `nrwl/nx` master at current HEAD (use local clone, NOT WebFetch raw.githubusercontent.com — it strips comments/blanks and undercounts)
2. Enumerate all `packages/*/generators.json` and `packages/*/executors.json`
3. Verify every package has an entry in `astro-docs/src/plugins/utils/plugin-mappings.ts` (auto-discovery)
4. Scan `devkit-exports.ts`, `public-api.ts`, `devkit-internals.ts` for public/internal symbols — only re-count if `gh api repos/nrwl/nx/commits path=<file>` shows commits in window
5. Check new feats (env vars, input types, CLI commands, config properties) for corresponding updates to `astro-docs/src/content/docs/reference/*.mdoc`
6. Grep `@deprecated` annotations and check removal timelines
7. Identify `devkit-internals` consumers

## Reports

| Month   | File                       | Nx Version               |
| ------- | -------------------------- | ------------------------ |
| 2026-02 | [2026-02.md](./2026-02.md) | v22.5 (commit `0975384`) |
| 2026-03 | [2026-03.md](./2026-03.md) | v22.x (commit `a4e8ce9`, last updated 2026-03-27) — expanded generator/executor drift analysis, CLI command audit, devkit-internals tracking, new `nx/release/changelog-renderer` export, Vite 8 support, devkit-exports growth (39->62 statements), docs symbol count 152 |
| 2026-04 | [2026-04.md](./2026-04.md) | v22.7.0-beta.16 (commit `4bbd4b1`, 2026-04-22) — methodology narrowed; `docs/` folder deleted (PR #35315), drift measurement moved to astro-docs auto-discovery. Total 7 findings (2H, 3M, 2L); delta -6 vs March. New drift: `json` input type undocumented (PR #35248). Resolved: H3/H4/H5/H6/M6-M11 either by consolidation or explicit docs. Corrects prior overcount of devkit-exports (stable at 39 exports, not 62) |

## Cadence

Monthly, or when a major Nx version ships.
