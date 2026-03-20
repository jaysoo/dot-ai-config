# API Surface vs Documentation Drift Audit

Recurring audit comparing the actual public API surface of Nx packages against what is documented on nx.dev and in `docs/packages.json`.

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

1. Clone/scan `nrwl/nx` master at current HEAD
2. Enumerate all `packages/*/generators.json` and `packages/*/executors.json`
3. Compare against `docs/packages.json` schema listings
4. Scan `devkit-exports.ts` and `public-api.ts` for public symbols
5. Grep `@deprecated` annotations and check removal timelines
6. Identify `devkit-internals` consumers

## Reports

| Month   | File                       | Nx Version               |
| ------- | -------------------------- | ------------------------ |
| 2026-02 | [2026-02.md](./2026-02.md) | v22.5 (commit `0975384`) |
| 2026-03 | [2026-03.md](./2026-03.md) | v22.x (commit `56acdf7`, last updated 2026-03-20) — expanded generator/executor drift analysis, CLI command audit |

## Cadence

Monthly, or when a major Nx version ships.
