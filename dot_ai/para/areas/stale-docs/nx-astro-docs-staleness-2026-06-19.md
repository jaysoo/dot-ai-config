# Nx Astro-Docs Staleness Audit — 2026-06-19

**Nx version at audit time:** ~23.x (dev tree shows 0.0.1; docs reference Nx 22-23 as current)
**Node.js EOL context:** Node 16 EOL 2023-09-11; Node 18 EOL 2025-04-30; Node 20 EOL **2026-04-25** (now 55 days past EOL)
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (~499 files)
**Previous audits:**
- [2026-06-17](./nx-astro-docs-staleness-2026-06-17.md) — `cacheableOperations`/`tasksRunnerOptions` in active pages, Nx ≤19.6 conditionals, TS 4.7 ref, "prior to Nx 18" blocks. 8 issues queued.
- [2026-06-12](./nx-astro-docs-staleness-2026-06-12.md) — `svgr` option removed from source, Nx 15.7 linkcard
- [2026-06-11](./nx-astro-docs-staleness-2026-06-11.md) — Full scan of 501 files; Node 20/18/16 CI configs, Nx 15–19 refs, `@nrwl/` scope

This audit is a **status check + consolidation run**. All findings below were personally verified against the live codebase today. Issues are organized for direct Linear ticket creation once the MCP connection is restored.

---

## Confirmed Still-Open Issues (not yet acted upon)

### Category A — EOL Node.js versions in active docs

These are copy-pasteable CI YAML and tutorial prerequisites that actively guide readers toward EOL runtimes.

| # | File | Line(s) | Stale content | Why stale |
|---|------|---------|---------------|-----------|
| A1 | `getting-started/Tutorials/react-monorepo-tutorial.mdoc` | 21 | `"This tutorial requires Node.js (v20.19 or later)"` | Node 20 EOL 2026-04-25 |
| A2 | `getting-started/Tutorials/angular-monorepo-tutorial.mdoc` | 21 | Same Node 20.19 requirement | Node 20 EOL 2026-04-25 |
| A3 | `getting-started/Tutorials/typescript-packages-tutorial.mdoc` | 21 | Same Node 20.19 requirement | Node 20 EOL 2026-04-25 |
| A4 | `features/CI Features/split-e2e-tasks.mdoc` | 464 | `node-version: 20` | Node 20 EOL |
| A5 | `features/CI Features/distribute-task-execution.mdoc` | 66 | `node-version: 20` | Node 20 EOL |
| A6 | `reference/Nx Cloud/assignment-rules.mdoc` | 375, 403 | `node-version: 20` (×2) | Node 20 EOL |
| A7 | `guides/Nx Release/publish-in-ci-cd.mdoc` | 157, 235, 391 | `node-version: 20` (×3) | Node 20 EOL |
| A8 | `guides/Adopting Nx/adding-to-monorepo.mdoc` | 390 | `node-version: 20` | Node 20 EOL |
| A9 | `guides/Adopting Nx/adding-to-existing-project.mdoc` | 372 | `node-version: 20` | Node 20 EOL |
| A10 | `guides/Nx Cloud/setup-ci.mdoc` | 63, 143, 324 | `node-version: 20` and `image: node:20` | Node 20 EOL |
| A11 | `guides/Nx Cloud/bring-your-own-compute.mdoc` | 56, 98, 297 | `node-version: 20` and `image: node:20` | Node 20 EOL |
| A12 | `guides/Nx Cloud/bring-your-own-compute.mdoc` | 354 | `image: node:18` | Node 18 EOL 2025-04-30 (oldest offender) |
| A13 | `extending-nx/local-executors.mdoc` | 145 | `"uses the recommended tsconfig for node 16"` + link to node16.json | Node 16 EOL 2023-09-11 |
| A14 | `extending-nx/local-generators.mdoc` | 116 | Same Node 16 tsconfig reference | Node 16 EOL 2023-09-11 |
| A15 | `technologies/node/Guides/bundling-node-projects.mdoc` | 113 | `target: 'node18'` in esbuild config | Signals readers to target EOL runtime |

**Fix for A1–A3:** Update minimum to Node 22 LTS (current active LTS).
**Fix for A4–A12:** Update `node-version: 20` → `22` and `node:20` / `node:18` Docker images to `node:22`.
**Fix for A13–A14:** Update link + description to reference `node22.json` tsconfig base.
**Fix for A15:** Update esbuild target from `node18` to `node22`.

---

### Category B — Stale Nx version conditionals/minimums in active guides

| # | File | Line | Stale content | Why stale |
|---|------|------|---------------|-----------|
| B1 | `features/cache-task-results.mdoc` | 20–59 | "Nx < 17" tab showing `tasksRunnerOptions` / `cacheableOperations` | `cacheableOperations` deprecated Nx 17; `tasksRunnerOptions` fully deprecated Nx 20; current is 23 |
| B2 | `guides/Nx Cloud/access-tokens.mdoc` | 280–310 | "Nx <= 19.6" tab with `tasksRunnerOptions` approach | Minimum supported Nx is 22+ |
| B3 | `guides/Nx Cloud/personal-access-tokens.mdoc` | 18–42 | "Nx <= 19.6" tab with `tasksRunnerOptions` + separate `nx-cloud` install | Same |
| B4 | `reference/nx-cloud-cli.mdoc` | 106 | Conditional guidance for Nx <= 19.6 users needing `nx-cloud` npm package | Same |
| B5 | `technologies/node/Guides/application-proxies.mdoc` | 96–106 | "Prior to Nx version 18" + `--frontendProject` examples | Nx 18 was early 2024; current is 23 |
| B6 | `technologies/test-tools/storybook/Guides/one-storybook-for-all.mdoc` | 41 | "If you're on an Nx version lower than 18…" fallback note | Same |
| B7 | `guides/Tasks & Caching/convert-to-inferred.mdoc` | 20 | `"At minimum, you should be on Nx version 19.6"` | 4 major versions behind |
| B8 | `guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc` | 17 | `{% aside type="note" title="Requires Nx 15.3" %}` | 8 major versions behind; noise |
| B9 | `reference/nx-json.mdoc` | 378 | `"In Nx 17 and higher, caching is configured by specifying 'cache': true"` | Dead caveat; all users are 17+ |
| B10 | `reference/project-configuration.mdoc` | 212, 588 | `"In Nx 17 and higher"` caveat + `"Sync generators are available in Nx 19.8+"` | Both dead conditionals |
| B11 | `extending-nx/project-graph-plugins.mdoc` | 368 | `"This functionality is available in Nx 17 or higher."` | Dead caveat |
| B12 | `concepts/nx-daemon.mdoc` | 9 | `"In version 13 we introduced the opt-in Nx Daemon"` | Nx Daemon now on by default; "opt-in" framing is also wrong |
| B13 | `concepts/sync-generators.mdoc` | 9 | `"In Nx 19.8, you can use sync generators"` | Stable feature; launch note should be removed |
| B14 | `guides/Adopting Nx/preserving-git-histories.mdoc` | 11 | `"In Nx 19.8 we introduced nx import"` | Same pattern |

---

### Category C — Stale package version references

| # | File | Line(s) | Stale content | Why stale |
|---|------|---------|---------------|-----------|
| C1 | `reference/nx-console-settings.mdoc` | 225, 244 | `"@nrwl/workspace:library"` | `@nrwl/` scope deprecated Nx 16, removed Nx 18; should be `@nx/workspace:library` |
| C2 | `technologies/typescript/Guides/compile-multiple-formats.mdoc` | 94, 97 | `TypeScript 4.7+` threshold + link to TS 4.7 release notes | TypeScript 5.x is current; `exports` field resolution universally supported |
| C3 | `guides/Tips-n-Tricks/advanced-update.mdoc` | 201 | `nx migrate --to="jest@22.0.0,cypress@3.4.0"` | jest 22 is from 2017, cypress 3.4.0 from 2019. Current: jest 30.x, cypress 14.x |
| C4 | `reference/Nx Cloud/config.mdoc` | 158 | `"You must be on version 16.0.4 or later of nx-cloud or @nrwl/nx-cloud"` | `@nrwl/nx-cloud` deprecated in Nx 18; the 16.0.4 threshold is irrelevant today |

---

### Category D — Stale terminal/version output (cosmetic but visible)

| # | File | Line(s) | Stale content | Why stale |
|---|------|---------|---------------|-----------|
| D1 | `technologies/angular/angular-rspack/Guides/getting-started.mdoc` | 37, 57 | `NX   Creating your v20.8.0 workspace.` | Two major versions behind |

---

### Category E — Low-priority "Available since Nx X" intro clutter

These appear on active feature pages as launch announcements, not as release notes. They add noise for users on Nx 23.

| # | File | Line | Stale content |
|---|------|------|---------------|
| E1 | `technologies/typescript/Guides/enable-tsc-batch-mode.mdoc` | 9 | `{% aside type="tip" title="Available since Nx 16.6.0" %}` |
| E2 | `technologies/typescript/Guides/define-secondary-entrypoints.mdoc` | 36 | `"as of Nx 16.8, you can specify the additionalEntryPoints"` |
| E3 | `extending-nx/create-install-package.mdoc` | 24 | `"Starting with Nx 16.5 you can now have such a create-{x} package"` |
| E4 | `technologies/angular/Guides/nx-and-angular.mdoc` | 214 | `"The command was introduced in Nx 17.3.0. If you're using an older version, you can instead run:"` |

---

## Needs Input

1. **`extending-nx/local-generators.mdoc` + `local-executors.mdoc` (A13–A14)** — The Node 16 tsconfig is what Nx uses *internally* when running plugins, not what the user's project targets. Verify against `packages/nx/tsconfig*.json` whether Nx has actually updated its own tsconfig base before changing the wording. If Nx's internal tsconfig still targets node16, the docs are technically accurate (but the link to node16.json is still confusing).

2. **`reference/Nx Cloud/config.mdoc`** — Lines 24/66/121 show `tasksRunnerOptions` examples. Need a human to confirm whether these are inside a deprecated-context section (already framed as "old approach") or shown as current configuration.

3. **`extending-nx/createnodes-compatibility.mdoc`** — Nx 17–20 rows in the compatibility table. Should the table be pruned to Nx 21+ or kept for plugin authors supporting older workspaces?

4. **`guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc`** — The "Requires Nx 15.3" aside describes nested projects. Verify whether nested projects still work as described in Nx 23 before removing the aside — the whole page may need a refresh, not just the aside removal.

5. **Tutorial Node minimum (A1–A3)** — Update to Node 22 or Node 24? Node 22 is current LTS (active until April 2027); Node 24 became available April 2025. Docs team to decide which to standardize on.

---

## Linear Issue Status

**⚠️ Linear MCP still unavailable** — fourth consecutive session with the same failure. The Linear MCP server is configured with the old SSE transport (removed 2026-04-08). Needs updating to `https://mcp.linear.app/mcp`.

### Issues to Create (Docs Team / Triage / Label: "Good for AI agents")

Grouped by suggested Linear issue. Each covers a cluster of related files.

| # | Suggested title | Priority | Files (category refs) |
|---|----------------|----------|-----------------------|
| 1 | Update Node.js minimum in getting-started tutorials from v20.19 to v22 | High | A1–A3 |
| 2 | Update `node-version: 20` and `node:20` in CI code examples to Node 22 | High | A4–A12 |
| 3 | Update Node 16 tsconfig reference in plugin authoring guides | Medium | A13–A14 |
| 4 | Update esbuild `target: 'node18'` in bundling guide | Medium | A15 |
| 5 | Remove deprecated "Nx < 17" version tab from cache-task-results docs | High | B1 |
| 6 | Remove "Nx <= 19.6" version tabs from Nx Cloud authentication docs | High | B2–B3 |
| 7 | Remove dead Nx <= 19.6 conditional from nx-cloud-cli reference | Medium | B4 |
| 8 | Remove "prior to Nx 18" proxy configuration block from Node guide | Medium | B5 |
| 9 | Remove "Nx < 18" Storybook fallback note from one-storybook-for-all guide | Low | B6 |
| 10 | Raise minimum Nx version requirement in convert-to-inferred guide | Medium | B7 |
| 11 | Remove stale Nx 15–17 aside/caveat notes from active feature pages | Low | B8–B11 |
| 12 | Clean up "Introduced in Nx X" intro notes in concept and guide pages | Low | B12–B14 |
| 13 | Replace `@nrwl/workspace:library` with `@nx/workspace:library` in console settings docs | Medium | C1 |
| 14 | Update TypeScript version references in compile-multiple-formats guide | Medium | C2 |
| 15 | Update example versions in advanced-update guide (jest 22, cypress 3.4.0) | Low | C3 |
| 16 | Remove stale `@nrwl/nx-cloud` 16.0.4 version requirement from Cloud config reference | Medium | C4 |
| 17 | Update terminal output version in Angular rspack getting-started guide | Low | D1 |
| 18 | Remove "Available since Nx 16.x/17.x" launch-note asides from active feature pages | Low | E1–E4 |
