# Nx Astro-Docs Staleness Audit — 2026-06-28

**Nx version at audit time:** 23.x (migrations.json confirms 23-0-0 generators)
**Node.js EOL context:** Node 16 EOL 2023-09-11; Node 18 EOL 2025-04-30; Node 20 EOL 2026-04-25; Node 22 is current LTS; Node 24 released 2025
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (503 files)
**Previous audits:**
- [2026-06-24](./nx-astro-docs-staleness-2026-06-24.md) — Nx 17.2/20+ version tags, run-tasks-in-parallel "Nx < 17" tab. 18 total issues aggregated.
- [2026-06-17](./nx-astro-docs-staleness-2026-06-17.md) — deprecated cacheableOperations/tasksRunnerOptions, dead Nx ≤ 19.6 conditionals, stale TS 4.7 ref.
- [2026-06-12](./nx-astro-docs-staleness-2026-06-12.md) — svgr option removed in Nx 22, stale Nx 15.7 linkcard.
- [2026-06-11](./nx-astro-docs-staleness-2026-06-11.md) — Node 20 EOL, Nx 15–19 version refs, @nrwl/ package names.

---

## Linear Issue Status

**⚠️ Linear MCP unavailable again** (`mcp__Linear__*` tool namespace did not appear in this session). All queued issues remain un-created. See the aggregated table at the end.

---

## Closed / Fixed Since June 24

Verified fixed in this scan — remove from the open list:

| # | Item | Status |
|---|------|--------|
| H3 | Tutorial Node.js minimum "v20.19" | **Fixed** — both tutorial MDOCs already say "v22 or later" |
| H4 (node-version numbers) | `node-version: 20` / `node:18` in CI YAML | **Largely fixed** — all checked files now use `node-version: 22`. The remaining action-version issue (`setup-node@v3`) is a new distinct finding (N2 below). |

---

## New Findings (Not in Prior Audits)

### N1. Old GitHub Action versions in CI YAML examples (Medium)

Six doc files still reference `actions/setup-node@v3` (current: v4, released Oct 2023). Two more reference `actions/checkout@v3` and `docker/login-action@v2` (current: `@v4` and `@v3` respectively). These are distinct from the `node-version: 20` issue fixed in H4 — the action *version* tags haven't been updated.

| File | Line | Stale ref | Should be |
|------|------|-----------|-----------|
| `features/CI Features/split-e2e-tasks.mdoc` | 462 | `actions/setup-node@v3` | `@v4` |
| `guides/Nx Release/publish-in-ci-cd.mdoc` | 386 | `actions/checkout@v3` | `@v4` |
| `guides/Nx Release/publish-in-ci-cd.mdoc` | 389 | `actions/setup-node@v3` | `@v4` |
| `guides/Nx Release/publish-in-ci-cd.mdoc` | 341, 400 | `docker/login-action@v2` | `@v3` |
| `guides/Adopting Nx/adding-to-monorepo.mdoc` | 388 | `actions/setup-node@v3` | `@v4` |
| `guides/Adopting Nx/adding-to-existing-project.mdoc` | 370 | `actions/setup-node@v3` | `@v4` |
| `guides/Nx Cloud/bring-your-own-compute.mdoc` | 54, 96 | `actions/setup-node@v3` | `@v4` |

**Fix:** Bump all stale action versions in the affected YAML snippets.

---

### N2. `target: 'node18'` in Vite bundling example (Medium)

`technologies/node/Guides/bundling-node-projects.mdoc` line 113 shows a Vite config with `target: 'node18'`. Node 18 reached EOL on 2025-04-30. New projects should target `node22` (current LTS) at minimum.

```ts
// line 113 — stale
target: 'node18',
```

**Fix:** Update to `target: 'node22'`.

---

### N3. Generator output shows `.eslintrc.json` but flat config is now default (Medium)

`technologies/module-federation/Guides/create-a-remote.mdoc` shows terminal output from `nx g @nx/react:remote` and `nx g @nx/angular:remote` where the generator creates `.eslintrc.json`. However, since Nx requires ESLint v9+, flat config (`eslint.config.mjs`) is now the default for new workspaces. The generator itself uses `useFlatConfig()` to detect which format to use.

| File | Lines | Issue |
|------|-------|-------|
| `technologies/module-federation/Guides/create-a-remote.mdoc` | 42, 68, 150, 177 | `CREATE …/.eslintrc.json` in generator output |

The corresponding inferred-task examples in two other pages also show `.eslintrc.json` as a cache input, suggesting those examples were generated with a legacy config:

| File | Lines | Issue |
|------|-------|-------|
| `features/explore-graph.mdoc` | ~122–123 | `.eslintrc.json` in inferred lint task inputs |
| `concepts/inferred-tasks.mdoc` | ~174–175 | `.eslintrc.json` in inferred lint task inputs |

**Fix:** Re-run the generators in a default workspace (which will use flat config) and update the terminal output snippets. Update the inferred-task JSON examples to reference `eslint.config.mjs` / `eslint.config.js` instead of `.eslintrc.json`.

---

### N4. Wrong `pnpm-workspaces.yml` filename (Low)

pnpm's workspace config file is named `pnpm-workspace.yaml` (no trailing `s`, `.yaml` extension). Two docs use the incorrect name `pnpm-workspaces.yml` or `pnpm-workspace.yml`:

| File | Line | Stale ref | Should be |
|------|------|-----------|-----------|
| `guides/Tips-n-Tricks/include-all-packagejson.mdoc` | 7 | `pnpm-workspaces.yml` | `pnpm-workspace.yaml` |
| `reference/project-configuration.mdoc` | 880 | `pnpm-workspace.yml` | `pnpm-workspace.yaml` |

(Other files in the repo use `pnpm-workspace.yaml` correctly — these two are outliers.)

---

### N5. "As of Nx 15.0.11" historical context in active guide (Low)

`guides/Tips-n-Tricks/include-all-packagejson.mdoc` opens with:

> "As of Nx 15.0.11, we only include any `package.json` file that is referenced in the `workspaces` property…"

Nx 15.0.11 is 8 major versions behind (current: 23). The "as of" framing implies this is recent news; for users on Nx 23 it's ancient history and adds confusion rather than clarity.

**Fix:** Remove or reword the historical callout. Just state the current behavior without version attribution.

---

## All Open Issues (Aggregated Across All Audits)

Items marked **[new]** were first found in this audit. All others are from prior audits and not yet fixed.

### Priority: High

| # | Title | File(s) | First Found |
|---|-------|---------|-------------|
| H1 | Remove deprecated "Nx < 17" tab from `cache-task-results.mdoc` | `features/cache-task-results.mdoc` lines 20–59 | 2026-06-17 |
| H2 | Remove "Nx <= 19.6" tabs from Nx Cloud authentication docs | `guides/Nx Cloud/access-tokens.mdoc`, `personal-access-tokens.mdoc` | 2026-06-17 |

### Priority: Medium

| # | Title | File(s) | First Found |
|---|-------|---------|-------------|
| M1 | Remove dead Nx <= 19.6 conditional from `nx-cloud-cli` reference | `reference/nx-cloud-cli.mdoc:106` | 2026-06-17 |
| M2 | Remove "prior to Nx 18" proxy configuration block from Node guide | `technologies/node/Guides/application-proxies.mdoc:96–106` | 2026-06-17 |
| M3 | Update TypeScript 4.7 version reference in compile-multiple-formats guide | `technologies/typescript/Guides/compile-multiple-formats.mdoc:94,97` | 2026-06-17 |
| M4 | Update `@nrwl/workspace:library` to `@nx/workspace:library` in nx-console-settings | `reference/nx-console-settings.mdoc:225,244` | 2026-06-11 |
| M5 | Update Node 16 tsconfig base reference in plugin authoring docs | `extending-nx/local-generators.mdoc:116`, `local-executors.mdoc:145` | 2026-06-11 |
| M6 | Remove dead Nx < 17 parallel tab from run-tasks-in-parallel | `guides/Tasks & Caching/run-tasks-in-parallel.mdoc:22–48` | 2026-06-24 |
| M7 | Remove dead "Nx < 17.2.0" version check from cache troubleshooting | `troubleshooting/troubleshoot-cache-misses.mdoc:12` | 2026-06-24 |
| M8 | Remove "prior to Nx 18" storybook fallback note | `technologies/test-tools/storybook/Guides/one-storybook-for-all.mdoc:41` | 2026-06-17 |
| M9 | Fix `svgr` option still documented after removal in Nx 22 | `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc:360–378,545–568` | 2026-06-12 |
| M10 | Raise or remove stale "minimum Nx 19.6" constraint in convert-to-inferred guide | `guides/Tasks & Caching/convert-to-inferred.mdoc:20` | 2026-06-11 |
| N1 | Update stale GitHub Actions version tags (`setup-node@v3`→v4, `checkout@v3`→v4, `docker/login-action@v2`→v3) | 6 files — see N1 table above | **[new]** 2026-06-28 |
| N2 | Update Vite bundling example `target: 'node18'` → `'node22'` (Node 18 EOL) | `technologies/node/Guides/bundling-node-projects.mdoc:113` | **[new]** 2026-06-28 |
| N3 | Generator output shows `.eslintrc.json` but flat config is default | `technologies/module-federation/Guides/create-a-remote.mdoc:42,68,150,177`; `features/explore-graph.mdoc:122–123`; `concepts/inferred-tasks.mdoc:174–175` | **[new]** 2026-06-28 |

### Priority: Low

| # | Title | File(s) | First Found |
|---|-------|---------|-------------|
| L1 | Clean up stale "Introduced in Nx X" intro notes (Nx 13, 19.8) | `concepts/nx-daemon.mdoc:9`, `concepts/sync-generators.mdoc:9`, `reference/project-configuration.mdoc:588`, `guides/Adopting Nx/preserving-git-histories.mdoc:11` | 2026-06-17 |
| L2 | Remove "Available since Nx 16.x" asides from TypeScript guides | `technologies/typescript/Guides/enable-tsc-batch-mode.mdoc:9`, `define-secondary-entrypoints.mdoc:36`, `extending-nx/create-install-package.mdoc:24` | 2026-06-11 |
| L3 | Remove "In Nx 17 and higher" caveats from caching reference pages | `reference/nx-json.mdoc:378`, `reference/project-configuration.mdoc:212`, `extending-nx/project-graph-plugins.mdoc:368` | 2026-06-11 |
| L4 | Update terminal output version in angular-rspack getting-started guide | `technologies/angular/angular-rspack/Guides/getting-started.mdoc:37,57` — shows `v20.8.0` | 2026-06-17 |
| L5 | Reword or remove Nx 15.7 YouTube linkcard in Node fly.io guide | `technologies/node/Guides/node-server-fly-io.mdoc:25` | 2026-06-12 |
| L6 | Update example versions in advanced-update guide (jest@22, cypress@3.4.0) | `guides/Tips-n-Tricks/advanced-update.mdoc:201` | 2026-06-11 |
| L7 | Remove "Requires Nx 15.3" aside from identify-dependencies guide | `guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc:17` | 2026-06-11 |
| L8 | Remove `(Nx 20+)` version tag from Composite View in explore-graph | `features/explore-graph.mdoc:427,429` | 2026-06-24 |
| N4 | Fix wrong `pnpm-workspaces.yml` filename → `pnpm-workspace.yaml` | `guides/Tips-n-Tricks/include-all-packagejson.mdoc:7`; `reference/project-configuration.mdoc:880` | **[new]** 2026-06-28 |
| N5 | Remove "As of Nx 15.0.11" historical callout from include-all-packagejson | `guides/Tips-n-Tricks/include-all-packagejson.mdoc:7` | **[new]** 2026-06-28 |

---

## Needs Input

1. **`reference/Nx Cloud/config.mdoc` `tasksRunnerOptions` examples** (June 17) — Are lines 24/66/121 in deprecated-context sections or active config patterns? Needs human page review.

2. **`extending-nx/createnodes-compatibility.mdoc` Nx 17–20 rows** — Table covers Nx 17–20 (3–6 versions behind). Should it be pruned to Nx 21+, or kept for plugin authors still supporting old workspaces?

3. **`technologies/node/Guides/application-proxies.mdoc` `--frontendProject`** — Confirm the flag is fully removed from all generators before removing the docs section.

4. **`guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc`** — The "Requires Nx 15.3" aside describes nested projects. Verify the whole page still works correctly with Nx 23.

5. **`technologies/angular/Guides/nx-and-angular.mdoc:214`** — "The command was introduced in Nx 17.3.0. If you're using an older version…" Confirm fallback command has been removed from generators.

6. **`technologies/build-tools/webpack/Guides/webpack-plugins.mdoc` `composePlugins`/`withReact`** — Marked "will be removed in Nx v24". If Nx 24 is shipping, immediate docs update needed.

7. **`technologies/module-federation/consumer-and-provider.mdoc`** — Page says Angular Module Federation no longer supported but still shows Angular MFe code. Remove or redirect?

8. **ESLint flat-config examples in `explore-graph.mdoc` / `inferred-tasks.mdoc` (N3)** — Need to verify: are these intentionally showing a legacy-config workspace, or were they just not regenerated? If showing legacy, a callout explaining "this is a legacy .eslintrc workspace" would help.

---

## Items Cleared in This Scan

| Pattern | Outcome |
|---------|---------|
| H3: Tutorial Node.js minimum "v20.19" | **Fixed** — tutorials already say "v22 or later" |
| H4: `node-version: 20/18` in CI YAML | **Largely fixed** — checked files now use `node-version: 22`; remaining action-version staleness is tracked as N1 |
| Angular version matrix (historical pairings) | Expected — reference table for plugin authors, not stale |
| `reference/Nx Cloud/launch-templates.mdoc` node20 image changelog | Historical entries, cleared as N/A |
| `features/CI Features/split-e2e-tasks.mdoc` node-version | Fixed — uses 22 now; action `@v3` tracked as N1 |
