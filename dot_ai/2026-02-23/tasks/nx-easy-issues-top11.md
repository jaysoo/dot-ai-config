# Nx Easy Issues: Top 11 AI-Suitable Issues

Generated: 2026-02-23

## Summary

381 open issues scanned from nrwl/nx (past year). Ranked by AI suitability and engineering impact.

## Not Done

### [#32126](https://github.com/nrwl/nx/issues/32126) — Publishing fails with bun (hardcoded `npm view`)

- **Priority: HIGH | AI Suitability: HIGH**
- **Core contributor:** JamesHenry invited a PR
- **Fix:** In `packages/js/src/executors/release-publish/release-publish.impl.ts`, `npm view` is hardcoded. Use `bun pm view` when bun is detected. Single file change.
- **Duplicate:** #34372 (same issue with proposed code solution)

### [#34542](https://github.com/nrwl/nx/issues/34542) — Independent release: workspace-level file changes trigger bumps

- **Priority: HIGH | AI Suitability: MEDIUM**
- **Core contributor:** Coly010 confirmed the related Regression 2 in #34211 is a bug.
- **Fix:** In independent release mode, commits touching only workspace-level files (package-lock.json, root README) should not trigger version bumps for all projects.

### [#34300](https://github.com/nrwl/nx/issues/34300) — Angular standalone + Vitest/Analog setup broken for new libraries

- **Priority: HIGH | AI Suitability: MEDIUM**
- **Fix:** Generated library's `test-setup.ts` not included in vitest configuration. Check `packages/angular/src/generators/library/` templates.

### [#32832](https://github.com/nrwl/nx/issues/32832) — Docker setup missing transitive workspace dependencies

- **Priority: HIGH | AI Suitability: MEDIUM**
- **Fix:** When app imports pkg-a which imports pkg-b, only pkg-a is included in docker dist. Docker module copy logic needs transitive resolution. Full repro repo available.

### [#31495](https://github.com/nrwl/nx/issues/31495) — `run-commands` does not honor `readyWhen` for single command

- **Priority: MEDIUM | AI Suitability: MEDIUM**
- **Fix:** Single-command code path in `packages/nx/src/executors/run-commands/run-commands.impl.ts` uses PTY and doesn't check `readyWhen`. Multi-command path works fine. Has repro repo: https://github.com/techfg/nx-21-continuous-tasks-repros


## Done

### [#34399](https://github.com/nrwl/nx/issues/34399) — @nx/plugin generates unnecessary vite.config.ts

- **Priority: MEDIUM | AI Suitability: HIGH**
- **Fix:** When generating a plugin with `tsc` compiler + vitest, both `vite.config.ts` and `vitest.config.mts` are created. The `vite.config.ts` uses `import.meta.dirname` which fails typecheck under CJS. Skip generating `vite.config.ts` when compiler=tsc, or generate as `.mts`.

### [#34172](https://github.com/nrwl/nx/issues/34172) — VersionDataEntry interface has wrong type for dockerVersion

- **Priority: LOW | AI Suitability: HIGH**
- **Fix:** Trivial type-only fix. PR #34171 already shows the exact change needed.

### [#34391](https://github.com/nrwl/nx/issues/34391) / [#34382](https://github.com/nrwl/nx/issues/34382) / [#33890](https://github.com/nrwl/nx/issues/33890) — `{version}` not interpolated in git tags

- **Priority: HIGH | AI Suitability: HIGH**
- **Fix:** 3-issue cluster. At `packages/nx/src/command-line/release/config/config.ts#L934`, `dockerVersion` used instead of `newVersion`. User in #33890 provided a patch file. Fixes 3 issues at once.

### [#34492](https://github.com/nrwl/nx/issues/34492) — esbuild executor runs pointless type-check in TS Solution Setup

- **Priority: HIGH | AI Suitability: HIGH**
- **Fix:** In `packages/esbuild/src/executors/esbuild/esbuild.impl.ts`, condition `!options.skipTypeCheck || options.isTsSolutionSetup` forces type-checking even when `skipTypeCheck: true` and `declaration: false`. Author provided exact line numbers and diff. Change to only force type-check when declarations are needed.

### [#34279](https://github.com/nrwl/nx/issues/34279) — Webpack `process.env` no longer parsed after v22.2.2

- **Priority: HIGH | AI Suitability: MEDIUM**
- **Fix:** Regression from PR [#30826](https://github.com/nrwl/nx/pull/30826). Env vars load at build time but aren't passed to the built app. Bounded scope in `@nx/webpack` env handling. `priority: high` label.

### [#32481](https://github.com/nrwl/nx/issues/32481) — Graph: project names with `/` break focus

- **Priority: MEDIUM | AI Suitability: HIGH**
- **Core contributor:** nartc pointed to PR #32490 as the fix. URL encoding issue in graph routing.

---

## Issues to Avoid (Active Core Team Work)

| Issue | Reason |
|-------|--------|
| #32438 | leosvelperez actively working on process cleanup |
| #30146 | jaysoo/Coly010 working via PRs #31545, #31557 |
| #33366 | Architecture-level bun lockfile parser performance |
| #34117 | Not a bug — intentional design (leosvelperez explained) |

## Key Code Paths

| Area | Path |
|------|------|
| Release publish | `packages/js/src/executors/release-publish/release-publish.impl.ts` |
| Release versioning | `packages/nx/src/command-line/release/` |
| Release tags | `packages/nx/src/command-line/release/utils/shared.ts` |
| esbuild executor | `packages/esbuild/src/executors/esbuild/esbuild.impl.ts` |
| Plugin generators | `packages/plugin/src/generators/` |
| Angular generators | `packages/angular/src/generators/` |
| Graph UI | `graph/client/`, `graph/ui-project-details/` |
| Run-commands | `packages/nx/src/executors/run-commands/run-commands.impl.ts` |
| Webpack | `packages/webpack/` |
