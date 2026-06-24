# Nx Astro-Docs Staleness Audit — 2026-06-24

**Nx version at audit time:** 23.0.0-rc.4
**Node.js EOL context:** Node 16 EOL 2023-09-11; Node 18 EOL 2025-04-30; Node 20 EOL 2026-04-25; Node 22 is current LTS
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (499 files)
**Previous audits:**
- [2026-06-17](./nx-astro-docs-staleness-2026-06-17.md) — deprecated cacheableOperations/tasksRunnerOptions in active feature pages, dead Nx ≤ 19.6 conditionals in cloud docs, stale TS 4.7 ref, "prior to Nx 18" blocks. 8 issues queued but not created (Linear MCP broken).
- [2026-06-12](./nx-astro-docs-staleness-2026-06-12.md) — svgr option documented but removed from source in Nx 22, stale Nx 15.7 linkcard.
- [2026-06-11](./nx-astro-docs-staleness-2026-06-11.md) — Node 20/18/16 CI configs, Nx 15-17 version notes, @nrwl scope.

**Purpose of this audit:** Fourth scan. Focuses on issues not captured in prior scans, and re-aggregates all still-open issues from previous audits with a fresh attempt to create Linear tickets.

---

## Linear Issue Status

**⚠️ Linear MCP still unavailable:** The `mcp__Linear__*` tool namespace did not appear in this session. All 8 issues from the June 17 audit remain un-created.

Issues from all four audits are compiled in the **"Issues to Create"** table at the end of this document for manual Linear entry.

---

## New Findings (Not in Prior Audits)

### 1. Dead "Nx 17.2.0" Version Gate in Cache Troubleshooting Doc (Medium)

`troubleshooting/troubleshoot-cache-misses.mdoc` line 12 says:

> "If you're using a version lower than Nx 17.2.0, check: the target configuration in the project's project.json file has `"cache": true` set..."

Nx 17.2 shipped in late 2023. No user on Nx 23 is below 17.2. The step is dead weight and will confuse readers who follow Check 1 and think something might be wrong with their setup.

| File | Line | Issue |
|------|------|-------|
| `troubleshooting/troubleshoot-cache-misses.mdoc` | 12 | Conditional check for Nx < 17.2.0 users |

**Fix:** Remove the version-gated bullet. The simpler "check the target has `"cache": true`" instruction is fine without a version guard.

---

### 2. "Composite View (Nx 20+)" Label Now Three Versions Old (Low)

`features/explore-graph.mdoc` lines 427 and 429 annotate the Composite View with `(Nx 20+)`:

```
**Composite View (Nx 20+):**
{% graph height="450px" title="Composite View (Nx 20+)" %}
```

Nx 20 is now 3 major versions behind (current: 23). The "(Nx 20+)" tag implies the feature is new/optional when it's been baseline for all current users. Previous audit (2026-06-17) cleared items "within 2 major versions" — this now crosses that threshold.

| File | Lines | Issue |
|------|-------|-------|
| `features/explore-graph.mdoc` | 427, 429 | `(Nx 20+)` version tag on Composite View |

**Fix:** Remove the version qualifier or replace with a non-dated description.

---

### 3. Confirmed: `guides/Tasks & Caching/run-tasks-in-parallel.mdoc` — "Nx < 17" tab (Medium)

The June 17 audit flagged `features/cache-task-results.mdoc` for having a "Nx < 17" tab. The same pattern exists in `run-tasks-in-parallel.mdoc` (line 32: `{% tabitem label="Nx < 17" %}`), which shows the deprecated `tasksRunnerOptions` config. This specific file was not included in the June 17 issue list.

| File | Lines | Issue |
|------|-------|-------|
| `guides/Tasks & Caching/run-tasks-in-parallel.mdoc` | 22–48 | "Nx < 17" tab showing deprecated `tasksRunnerOptions` for setting `parallel` |

**Fix:** Remove the "Nx < 17" tab. The `nx.json` `"parallel": 5` approach from the "Nx >= 17" tab is sufficient.

---

## All Open Issues (Aggregated Across All Audits)

Items marked **[new]** were first found in this audit. All others are from prior audits and have not yet been fixed.

### Priority: High

| # | Title | File(s) | First Found |
|---|-------|---------|-------------|
| H1 | Remove deprecated "Nx < 17" tab from `cache-task-results.mdoc` | `features/cache-task-results.mdoc` lines 20–59 | 2026-06-17 |
| H2 | Remove "Nx <= 19.6" tabs from Nx Cloud authentication docs | `guides/Nx Cloud/access-tokens.mdoc`, `personal-access-tokens.mdoc` | 2026-06-17 |
| H3 | Update tutorial Node.js minimum from v20.19 to v22+ (Node 20 is EOL) | `getting-started/Tutorials/angular-monorepo-tutorial.mdoc:21`, `react-monorepo-tutorial.mdoc:21`, `typescript-packages-tutorial.mdoc:21` | 2026-06-11 |
| H4 | Update CI YAML `node-version: 20` / `node:20` / `node:18` in 9+ files | `features/CI Features/split-e2e-tasks.mdoc`, `distribute-task-execution.mdoc`, `reference/Nx Cloud/assignment-rules.mdoc`, `guides/Nx Release/publish-in-ci-cd.mdoc`, `guides/Adopting Nx/adding-to-monorepo.mdoc`, `adding-to-existing-project.mdoc`, `guides/Nx Cloud/setup-ci.mdoc`, `bring-your-own-compute.mdoc` | 2026-06-11 |

### Priority: Medium

| # | Title | File(s) | First Found |
|---|-------|---------|-------------|
| M1 | Remove dead Nx <= 19.6 conditional from `nx-cloud-cli` reference | `reference/nx-cloud-cli.mdoc:106` | 2026-06-17 |
| M2 | Remove "prior to Nx 18" proxy configuration block from Node guide | `technologies/node/Guides/application-proxies.mdoc:96–106` | 2026-06-17 |
| M3 | Update TypeScript 4.7 version reference in compile-multiple-formats guide | `technologies/typescript/Guides/compile-multiple-formats.mdoc:94,97` | 2026-06-17 |
| M4 | Update `@nrwl/workspace:library` to `@nx/workspace:library` in nx-console-settings | `reference/nx-console-settings.mdoc:225,244` | 2026-06-11 |
| M5 | Update Node 16 tsconfig base reference in plugin authoring docs | `extending-nx/local-generators.mdoc:116`, `local-executors.mdoc:145` | 2026-06-11 |
| M6 | Remove dead Nx < 17 parallel tab from run-tasks-in-parallel | `guides/Tasks & Caching/run-tasks-in-parallel.mdoc:22–48` | **[new]** 2026-06-24 |
| M7 | Remove dead "Nx < 17.2.0" version check from cache troubleshooting | `troubleshooting/troubleshoot-cache-misses.mdoc:12` | **[new]** 2026-06-24 |
| M8 | Remove "prior to Nx 18" storybook fallback note | `technologies/test-tools/storybook/Guides/one-storybook-for-all.mdoc:41` | 2026-06-17 |
| M9 | Fix `svgr` option still documented after removal in Nx 22 | `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc:360–378,545–568` | 2026-06-12 |
| M10 | Raise or remove stale "minimum Nx 19.6" constraint in convert-to-inferred guide | `guides/Tasks & Caching/convert-to-inferred.mdoc:20` | 2026-06-11 |

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
| L8 | Remove `(Nx 20+)` version tag from Composite View in explore-graph | `features/explore-graph.mdoc:427,429` | **[new]** 2026-06-24 |

---

## Needs Input (Unresolved from Previous Audits)

1. **`reference/Nx Cloud/config.mdoc` `tasksRunnerOptions` examples** (June 17 item) — Are lines 24/66/121 in deprecated-context sections or displayed as active config patterns? Needs a human review of page context/tabs before removing.

2. **`extending-nx/createnodes-compatibility.mdoc` Nx 17-20 rows** — The compatibility table covers Nx 17-20 which are 3-6 versions behind. Should it be pruned to Nx 21+, or kept for plugin authors still supporting old workspaces?

3. **`technologies/node/Guides/application-proxies.mdoc` `--frontendProject`** — Confirm the flag is fully removed from all `@nx/node`, `@nx/nest`, `@nx/express` generators before removing the docs section.

4. **`guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc`** — The "Requires Nx 15.3" aside describes nested projects. The whole page may need a refresh to verify it works correctly with Nx 23.

5. **`technologies/angular/Guides/nx-and-angular.mdoc:214`** — "The command was introduced in Nx 17.3.0. If you're using an older version..." Confirm the fallback command has been removed from Nx generators before stripping the note.

6. **`technologies/build-tools/webpack/Guides/webpack-plugins.mdoc` `composePlugins`/`withReact`** — Marked as "will be removed in Nx v24". If Nx 24 ships these need immediate docs update. Monitor.

7. **`reference/Nx Cloud/launch-templates.mdoc`** — Node 20 image names (`ubuntu22.04-node20.xx-vY`) are documented as historical changelog entries. Are these intended to be preserved or pruned? No action needed if they're just a changelog.

8. **`technologies/module-federation/consumer-and-provider.mdoc`** — Page says Angular Module Federation is no longer supported but still shows Angular MFe code. Should this page be removed or redirected? Decision needed.

---

## Items Cleared in This Scan (Not Stale)

| Pattern | Outcome |
|---------|---------|
| Next.js version range `>=14.0.0 <17.0.0` in `next/introduction.mdoc` | Next.js 16 doesn't exist yet (current is 15.x); range is correct |
| Angular version matrix (angular-nx-version-matrix.mdoc) | Reference table for users on old Angular — intentionally includes historical pairings |
| `reference/Nx Cloud/launch-templates.mdoc` node20 image names | Historical changelog entries, not recommendations; Node 22/24 images also listed |
| `features/explore-graph.mdoc` "Composite View (Nx 20+)" | Flagged as **new Low priority issue** L8 — 3 major versions old now |
| `reference/nx-json.mdoc` "In Nx 17 and higher" caching note | Already tracked as L3 from June 11 audit |
| `guide/Tasks & Caching/self-hosted-caching.mdoc` "Nx 20.8+" | Within 2 major versions for June 17 audit; now 3 back — borderline, not creating separate issue |
