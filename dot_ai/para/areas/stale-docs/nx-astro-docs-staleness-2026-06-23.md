# Nx Astro-Docs Staleness Audit — 2026-06-23

**Nx version at audit time:** ~23.x (latest migrations are update-23-0-0; Nx 24 not yet shipped)
**Node.js EOL context:** Node 20 EOL 2026-04-25; Node 18 EOL 2025-04-30; Node 16 EOL 2023-09-11
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (499 files)
**Previous audits:**
- [2026-06-17](./nx-astro-docs-staleness-2026-06-17.md) — deprecated `cacheableOperations`/`tasksRunnerOptions` tabs, dead Nx ≤19.6 conditionals, TS 4.7, "prior to Nx 18" blocks
- [2026-06-12](./nx-astro-docs-staleness-2026-06-12.md) — svgr option removed from source, Nx 15.7 linkcard
- [2026-06-11](./nx-astro-docs-staleness-2026-06-11.md) — Node 20/18/16 CI configs, Nx 15-17 version notes, @nrwl scope

Smells checked: (1) old Nx version mentions, (2) EOL Node/package versions, (3) features/options that don't match CLI or plugin code.

---

## Status Updates From Prior Audits

### Resolved Since 2026-06-17

These items were flagged in prior audits and have been fixed in the current tree:

| File | Issue | Status |
|------|-------|--------|
| `features/cache-task-results.mdoc` | "Nx < 17" tab with `cacheableOperations`/`tasksRunnerOptions` | ✅ Fixed |
| `guides/Nx Cloud/access-tokens.mdoc` | "Nx ≤ 19.6" tab showing deprecated `tasksRunnerOptions` | ✅ Fixed |
| `guides/Nx Cloud/personal-access-tokens.mdoc` | "Nx ≤ 19.6" tab | ✅ Fixed |
| `concepts/nx-daemon.mdoc` | "In version 13 we introduced the opt-in Nx Daemon" | ✅ Fixed |
| `concepts/sync-generators.mdoc` | "In Nx 19.8, you can use sync generators" | ✅ Fixed |
| `reference/project-configuration.mdoc` | "Sync generators are available in Nx 19.8+" | ✅ Fixed |
| `guides/Adopting Nx/preserving-git-histories.mdoc` | "In Nx 19.8 we introduced nx import" | ✅ Fixed |
| `technologies/typescript/Guides/compile-multiple-formats.mdoc` | TypeScript 4.7+ threshold | ✅ Fixed |
| `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc` | `svgr` option documented but removed from source | ✅ Fixed |

### Still Outstanding From Prior Audits (Not Yet Fixed)

| # | File | Issue | First Logged |
|---|------|-------|--------------|
| A | `getting-started/Tutorials/react-monorepo-tutorial.mdoc:21` | Requires Node.js v20.19 (Node 20 EOL) | 2026-06-11 |
| B | `getting-started/Tutorials/angular-monorepo-tutorial.mdoc:21` | Same | 2026-06-11 |
| C | `getting-started/Tutorials/typescript-packages-tutorial.mdoc:21` | Same | 2026-06-11 |
| D | 8 CI guide files (12 occurrences) | `node-version: 20` in copy-pasteable YAML examples | 2026-06-11 |
| E | `extending-nx/local-generators.mdoc:116` | "tsconfig for node 16" — Node 16 EOL 2023 | 2026-06-11 |
| F | `extending-nx/local-executors.mdoc:145` | Same | 2026-06-11 |
| G | `technologies/node/Guides/bundling-node-projects.mdoc:113` | `target: 'node18'` in Vite config (Node 18 EOL) | 2026-06-11 |
| H | `guides/Tips-n-Tricks/advanced-update.mdoc:201` | `jest@22.0.0, cypress@3.4.0` — jest 22 is from 2017 | 2026-06-11 |
| I | `guides/Tasks & Caching/convert-to-inferred.mdoc:20` | "At minimum, you should be on Nx version 19.6" | 2026-06-11 |
| J | `reference/nx-console-settings.mdoc:225,244` | `@nrwl/workspace:library` (@nrwl scope deprecated Nx 16, removed Nx 18+) | 2026-06-11 |
| K | `technologies/node/Guides/node-server-fly-io.mdoc:25` | "Starting with Nx 15.7" linkcard copy | 2026-06-12 |
| L | `reference/nx-cloud-cli.mdoc:106` | Dead conditional: "if you are on version 19.6 or lower" | 2026-06-17 |
| M | `technologies/node/Guides/application-proxies.mdoc:96–106` | "Prior to Nx version 18" block + `--frontendProject` examples | 2026-06-17 |
| N | `technologies/test-tools/storybook/Guides/one-storybook-for-all.mdoc:41` | "Nx version lower than 18" note | 2026-06-17 |
| O | `technologies/angular/angular-rspack/Guides/getting-started.mdoc:37,57` | Terminal output shows `v20.8.0` | 2026-06-17 |

For the 8 CI files with `node-version: 20` (item D):
- `features/CI Features/split-e2e-tasks.mdoc:464`
- `features/CI Features/distribute-task-execution.mdoc:66`
- `reference/Nx Cloud/assignment-rules.mdoc:371,399`
- `guides/Nx Release/publish-in-ci-cd.mdoc:157,235,391`
- `guides/Adopting Nx/adding-to-monorepo.mdoc:390`
- `guides/Adopting Nx/adding-to-existing-project.mdoc:372`
- `guides/Nx Cloud/setup-ci.mdoc:63`
- `guides/Nx Cloud/bring-your-own-compute.mdoc:56,98`

---

## New Findings (Not in Prior Audits)

### 1. `reference/Nx Cloud/config.mdoc` — Three Dead Version Tabs (High Priority)

The 2026-06-17 audit flagged `tasksRunnerOptions` in this file as a "Needs Input" requiring human verification of context. **Confirmed:** the page contains three separate `{% tabs %}` blocks with stale dead-version tabs:

| Lines | Tab | Content |
|-------|-----|---------|
| 9–50 | `Nx <= 19.6` | `tasksRunnerOptions` with `nxCloudId`; also requires installing `nx-cloud` npm package separately |
| 50–78 | `Nx < 17` | `tasksRunnerOptions` with `nxCloudAccessToken` (deprecated runner config) |
| 98–130 | `Nx < 17` | `tasksRunnerOptions` with `encryptionKey` (deprecated runner config) |

Additionally, line 158: `"You must be on version 16.0.4 or later of nx-cloud or @nrwl/nx-cloud"` — `@nrwl/nx-cloud` was deprecated in Nx 18 and is no longer relevant.

**Fix:** Remove all three `Nx <= 19.6` / `Nx < 17` tab items. Keep only the `Nx >= 19.7` / `Nx >= 17` content. Also remove line 158's `@nrwl/nx-cloud` constraint.

---

### 2. `guides/Tips-n-Tricks/yarn-pnp.mdoc:38` — Yarn 3.6.1 (Medium Priority)

The Yarn PnP guide sets the workspace package manager via:
```json
"packageManager": "yarn@3.6.1"
```
Yarn 3.x is a major version behind. Current stable Yarn is 4.x (4.5+ as of 2025). Users following this guide will be setting up with an outdated major version of Yarn.

**Fix:** Update example to `yarn@4.x` (or the latest 4.y.z patch). Also verify the guide's `nodeLinker` and `.yarnrc.yml` instructions are accurate for Yarn 4.

---

## Clarifications on Prior "Needs Input" Items

### `application-proxies.mdoc` — `--frontendProject` still in source ✅ Resolved

The 2026-06-17 audit asked: "Confirm `--frontendProject` is fully removed from all `@nx/node`, `@nx/nest`, `@nx/express` generators before removing the docs section."

**Answer: the flag is still present** in `packages/node/src/generators/application/schema.d.ts`, `packages/nest/src/generators/application/schema.d.ts`, and `packages/express/src/generators/application/schema.d.ts`. The generator code still handles it. The docs section describing `--frontendProject` is therefore factually correct — only the framing ("Prior to Nx version 18, projects use executors to run tasks") is stale. Update the framing; keep the flag description.

### `reference/Nx Cloud/config.mdoc` tasksRunnerOptions — Active Config Sections ✅ Resolved

The 2026-06-17 audit asked whether lines 24/66/121 are in deprecated-context sections. **They are not**: they appear inside `{% tabitem label="Nx <= 19.6" %}` and `{% tabitem label="Nx < 17" %}` blocks on what reads as an active config reference page. These tabs are confirmed dead content (see New Finding #1 above).

---

## Linear Issue Status

**⚠️ Linear MCP still unavailable** (same situation as 2026-06-17 — SSE transport removed 2026-04-08; MCP server needs to be updated to use `https://mcp.linear.app/mcp`).

### New Issues to Create (Docs Team / Triage / Label: "Good for AI agents")

| # | Title | Priority | File(s) |
|---|-------|----------|---------|
| 1 | Remove dead "Nx ≤ 19.6" and "Nx < 17" version tabs from Nx Cloud config reference | High | `reference/Nx Cloud/config.mdoc` |
| 2 | Update Yarn PnP guide to use Yarn 4.x instead of Yarn 3.6.1 | Medium | `guides/Tips-n-Tricks/yarn-pnp.mdoc` |

### Previously Queued Issues (From 2026-06-17, Not Yet Created)

| # | Title | Priority | File(s) |
|---|-------|----------|---------|
| 3 | Remove dead Nx ≤ 19.6 conditional from nx-cloud-cli reference | Medium | `reference/nx-cloud-cli.mdoc` |
| 4 | Fix "prior to Nx 18" framing in Node proxy guide (`--frontendProject` flag still exists) | Low | `technologies/node/Guides/application-proxies.mdoc` |
| 5 | Remove "Nx < 18" storybook fallback note from one-storybook-for-all guide | Low | `technologies/test-tools/storybook/Guides/one-storybook-for-all.mdoc` |
| 6 | Update terminal output version (v20.8.0) in angular-rspack getting-started guide | Low | `technologies/angular/angular-rspack/Guides/getting-started.mdoc` |
| 7 | Update tutorial Node.js minimum requirement from v20.19 to v22+ (Node 20 EOL) | High | react/angular/typescript monorepo tutorials |
| 8 | Update `node-version: 20` in all CI guide examples to Node 22+ | High | 8 files (see list above) |
| 9 | Update Node 16 tsconfig reference in plugin authoring guides | Medium | `extending-nx/local-generators.mdoc`, `local-executors.mdoc` |
| 10 | Update `@nrwl/workspace:library` to `@nx/workspace:library` in Nx Console settings docs | Medium | `reference/nx-console-settings.mdoc` |
| 11 | Raise or remove "minimum Nx version 19.6" in convert-to-inferred guide | Low | `guides/Tasks & Caching/convert-to-inferred.mdoc` |

---

## Summary by Priority

| Priority | Count | Issues |
|----------|-------|--------|
| High | 3 | Tutorial Node 20 requirements (A–C), CI `node-version: 20` (D), config.mdoc dead tabs (new #1) |
| Medium | 4 | Yarn 3.6.1 (new #2), nx-cloud-cli dead conditional (L), Node 16 tsconfig (E–F), @nrwl scope (J) |
| Low | 5 | application-proxies framing (M), storybook conditional (N), angular-rspack terminal (O), convert-to-inferred minimum (I), fly.io linkcard (K) |
| Low | 1 | `jest@22.0.0, cypress@3.4.0` example versions (H) |
| Low | 1 | Node 18 Vite build target (G) |
