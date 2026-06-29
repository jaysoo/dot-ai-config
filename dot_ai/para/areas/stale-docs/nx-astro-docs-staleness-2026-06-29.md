# Nx Astro-Docs Staleness Audit — 2026-06-29

**Nx version at audit time:** 23.x (latest migration is `23-0-0-*`)
**Node.js EOL context:** Node 18 EOL 2025-04-30; Node 20 EOL 2026-04-25; Node 22 is current LTS; Node 24 is current stable
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (503 files)
**Previous audits:**
- [2026-06-24](./nx-astro-docs-staleness-2026-06-24.md) — 2 new issues (dead Nx < 17.2 cache check, "Nx 20+" explore-graph label); 18 total open issues; Linear MCP unavailable.
- [2026-06-17](./nx-astro-docs-staleness-2026-06-17.md) — deprecated cacheableOperations/tasksRunnerOptions, dead Nx ≤ 19.6 conditionals, stale TS 4.7 ref.
- [2026-06-12](./nx-astro-docs-staleness-2026-06-12.md) — svgr option removed in Nx 22 still in docs.
- [2026-06-11](./nx-astro-docs-staleness-2026-06-11.md) — Full initial scan.

**Purpose:** Fifth scan. Focuses on CI/CD action versions and code example staleness not previously captured. Also reports confirmed fixes from prior audits.

---

## Linear Issue Status

**⚠️ Linear MCP still unavailable.** New issues are documented below and in the aggregated table. All prior open issues remain un-created in Linear.

---

## Confirmed Fixes from Prior Audits

| Prior Issue | Fix Verified |
|-------------|--------------|
| H3 — Tutorial Node.js minimum "v20.19 or later" | **Fixed** — all 3 tutorial files (`angular-monorepo-tutorial.mdoc:21`, `react-monorepo-tutorial.mdoc:21`, `typescript-packages-tutorial.mdoc:21`) now say "(v22 or later)" |
| H4 — `node-version: 20` in CI YAML examples | **Partially fixed** — `node-version` is now `22` across affected files. However, `actions/setup-node@v3` (the GitHub Actions action version) was not bumped alongside the node version. See new issue M-new-1 below. |

---

## New Findings

### M-new-1 — `actions/setup-node@v3` and `actions/checkout@v3` still in 5+ files (Medium)

When `node-version` was updated to 22 in the CI examples, the *action* versions were not updated. `actions/setup-node@v4` and `actions/checkout@v4` have been the current stable versions since late 2023.

| File | Line(s) | Stale reference |
|------|---------|-----------------|
| `features/CI Features/split-e2e-tasks.mdoc` | 462 | `actions/setup-node@v3` |
| `guides/Nx Release/publish-in-ci-cd.mdoc` | 386, 389 | `actions/checkout@v3`, `actions/setup-node@v3` |
| `guides/Adopting Nx/adding-to-monorepo.mdoc` | 388 | `actions/setup-node@v3` |
| `guides/Adopting Nx/adding-to-existing-project.mdoc` | 370 | `actions/setup-node@v3` |
| `guides/Nx Cloud/bring-your-own-compute.mdoc` | 54, 96 | `actions/setup-node@v3` |

**Fix:** Replace `@v3` with `@v4` for both `actions/checkout` and `actions/setup-node` in all affected files.

---

### M-new-2 — CircleCI Nx orb pinned to very old versions (Medium)

Two CI setup docs show a CircleCI orb pinned to `nrwl/nx@1.7.0` and `nrwl/nx@1.5.1`. The orb is published to the CircleCI orb registry; these versions are from 2022–2023 and are almost certainly outdated.

| File | Line | Stale reference |
|------|------|-----------------|
| `guides/Nx Cloud/setup-ci.mdoc` | 94 | `nx: nrwl/nx@1.7.0` |
| `guides/Nx Cloud/bring-your-own-compute.mdoc` | 136 | `nx: nrwl/nx@1.5.1` |

**Fix:** Update both to the latest published version of the `nrwl/nx` CircleCI orb (check https://circleci.com/developer/orbs/orb/nrwl/nx for the current version).

---

### M-new-3 — Vite bundling example targets EOL Node 18 (Medium)

`technologies/node/Guides/bundling-node-projects.mdoc` line 113 shows a Vite config that sets `target: 'node18'`. Node 18 reached EOL on 2025-04-30.

```ts
// vite.config.ts
export default defineConfig({
  build: {
    target: 'node18',   // ← EOL
```

**Fix:** Update to `target: 'node22'` (current LTS) or remove the hardcoded target and add a note to match the project's actual minimum Node requirement.

---

### M-new-4 — `nx-cloud-workflows` steps pinned to `main` branch instead of `v6` (Medium)

Most launch template examples in the docs use the versioned `nrwl/nx-cloud-workflows/v6/...` path, but two places use the unversioned `main` branch, which means they silently pick up breaking changes:

| File | Line | Unversioned reference |
|------|------|-----------------------|
| `features/CI Features/docker-layer-caching.mdoc` | 44 | `nrwl/nx-cloud-workflows/main/workflow-steps/setup-docker-buildx/main.yaml` |
| `reference/Nx Cloud/launch-templates.mdoc` | 289 | `nrwl/nx-cloud-workflows/main/workflow-steps/install-node-modules/main.yaml` |

The rest of `launch-templates.mdoc` consistently uses `v6`. The `docker-layer-caching.mdoc` is a newer page and was likely written before the `v6` pin was established.

**Fix:** Replace `main` with `v6` (or the current latest tag) in both references.

---

### L-new-1 — `nx affected:test` deprecated colon syntax in nx-daemon.mdoc (Low)

`concepts/nx-daemon.mdoc` line 13 uses the old `nx affected:test` colon syntax (deprecated since Nx 15) in an explanatory paragraph:

> "...or run affected commands, such `nx affected:test`, Nx first needs to generate..."

Note: Prior audit L1 covers *line 9* of this file ("stale intro note"), but line 13 uses the colon syntax, which is a different issue.

**Fix:** Replace `nx affected:test` with `nx affected -t test` (or `nx affected --target=test`).

---

### L-new-2 — TypeScript intro describes `--template nrwl/typescript-template` "as of Nx 20" (Low)

`technologies/typescript/introduction.mdoc` line 98:

> "The `--template nrwl/typescript-template` uses the modern setup with workspaces and project references as of Nx 20."

Nx 20 is now 3 major versions behind (current: 23). The phrase "as of Nx 20" implies this is a recent addition when it is now baseline behavior for all current users.

**Fix:** Remove "as of Nx 20" or rephrase as "This template uses the modern setup with workspaces and project references."

---

## Needs Input (New)

1. **`nrwl/nx-set-shas@v5`** — Used consistently across 7 files (`setup-ci.mdoc`, `bring-your-own-compute.mdoc`, `split-e2e-tasks.mdoc`, `adding-to-monorepo.mdoc`, `adding-to-existing-project.mdoc`, `use-bun.mdoc`, `file-based-versioning-version-plans.mdoc`). Cannot verify without external network access whether v5 is still the latest version of the action. Check https://github.com/nrwl/nx-set-shas/releases.

2. **`ubuntu22.04-node20.11-v9` as minimum in `launch-template-examples.mdoc:214`** — The `install-node` step docs state it "requires the minimum image version to be `ubuntu22.04-node20.11-v9` or later". This uses an EOL Node 20 image as the minimum, though the current recommended image is `ubuntu22.04-node24.14-v1`. Is the minimum requirement still accurate, or has it been updated to a Node 22/24 base image?

---

## All Open Issues (Aggregated Across All Audits)

Items marked **[new]** were first found in this (June 29) audit. Items marked **[fixed]** were confirmed resolved.

### Priority: High

| # | Title | File(s) | First Found | Status |
|---|-------|---------|-------------|--------|
| H1 | Remove deprecated "Nx < 17" tab from `cache-task-results.mdoc` | `features/cache-task-results.mdoc` lines 20–59 | 2026-06-17 | Open |
| H2 | Remove "Nx <= 19.6" tabs from Nx Cloud authentication docs | `guides/Nx Cloud/access-tokens.mdoc`, `personal-access-tokens.mdoc` | 2026-06-17 | Open |
| H3 | Update tutorial Node.js minimum from v20.19 to v22+ | `getting-started/Tutorials/*.mdoc:21` | 2026-06-11 | **Fixed** |
| H4 | Update `node-version: 20` / `node:20` / `node:18` in CI YAML examples | Multiple files | 2026-06-11 | **Partially fixed** — node-version is now 22; action version `@v3` still stale → see M-new-1 |

### Priority: Medium

| # | Title | File(s) | First Found | Status |
|---|-------|---------|-------------|--------|
| M1 | Remove dead Nx <= 19.6 conditional from `nx-cloud-cli` reference | `reference/nx-cloud-cli.mdoc:106` | 2026-06-17 | Open |
| M2 | Remove "prior to Nx 18" proxy configuration block from Node guide | `technologies/node/Guides/application-proxies.mdoc:96–106` | 2026-06-17 | Open |
| M3 | Update TypeScript 4.7 version reference in compile-multiple-formats guide | `technologies/typescript/Guides/compile-multiple-formats.mdoc:94,97` | 2026-06-17 | Open |
| M4 | Update `@nrwl/workspace:library` to `@nx/workspace:library` in nx-console-settings | `reference/nx-console-settings.mdoc:225,244` | 2026-06-11 | Open |
| M5 | Update Node 16 tsconfig base reference in plugin authoring docs | `extending-nx/local-generators.mdoc:116`, `local-executors.mdoc:145` | 2026-06-11 | Open |
| M6 | Remove dead Nx < 17 parallel tab from run-tasks-in-parallel | `guides/Tasks & Caching/run-tasks-in-parallel.mdoc:22–48` | 2026-06-24 | Open |
| M7 | Remove dead "Nx < 17.2.0" version check from cache troubleshooting | `troubleshooting/troubleshoot-cache-misses.mdoc:12` | 2026-06-24 | Open |
| M8 | Remove "prior to Nx 18" storybook fallback note | `technologies/test-tools/storybook/Guides/one-storybook-for-all.mdoc:41` | 2026-06-17 | Open |
| M9 | Fix `svgr` option still documented after removal in Nx 22 | `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc:360–378,545–568` | 2026-06-12 | Open |
| M10 | Raise or remove stale "minimum Nx 19.6" constraint in convert-to-inferred guide | `guides/Tasks & Caching/convert-to-inferred.mdoc:20` | 2026-06-11 | Open |
| M-new-1 | Update `actions/setup-node@v3` → `@v4` (and `actions/checkout@v3` → `@v4`) in 5+ CI YAML files | `split-e2e-tasks.mdoc`, `publish-in-ci-cd.mdoc`, `adding-to-monorepo.mdoc`, `adding-to-existing-project.mdoc`, `bring-your-own-compute.mdoc` | **[new]** 2026-06-29 | Open |
| M-new-2 | Update CircleCI Nx orb from `nrwl/nx@1.7.0` / `nrwl/nx@1.5.1` to current version | `guides/Nx Cloud/setup-ci.mdoc:94`, `bring-your-own-compute.mdoc:136` | **[new]** 2026-06-29 | Open |
| M-new-3 | Update Vite bundling example from EOL `target: 'node18'` to `node22` | `technologies/node/Guides/bundling-node-projects.mdoc:113` | **[new]** 2026-06-29 | Open |
| M-new-4 | Pin `nx-cloud-workflows` steps to `v6` instead of unversioned `main` | `features/CI Features/docker-layer-caching.mdoc:44`, `reference/Nx Cloud/launch-templates.mdoc:289` | **[new]** 2026-06-29 | Open |

### Priority: Low

| # | Title | File(s) | First Found | Status |
|---|-------|---------|-------------|--------|
| L1 | Clean up stale "Introduced in Nx X" intro notes (Nx 13, 19.8) | `concepts/nx-daemon.mdoc:9`, `concepts/sync-generators.mdoc:9`, `reference/project-configuration.mdoc:588`, `guides/Adopting Nx/preserving-git-histories.mdoc:11` | 2026-06-17 | Open |
| L2 | Remove "Available since Nx 16.x" asides from TypeScript guides | `technologies/typescript/Guides/enable-tsc-batch-mode.mdoc:9`, `define-secondary-entrypoints.mdoc:36`, `extending-nx/create-install-package.mdoc:24` | 2026-06-11 | Open |
| L3 | Remove "In Nx 17 and higher" caveats from caching reference pages | `reference/nx-json.mdoc:378`, `reference/project-configuration.mdoc:212`, `extending-nx/project-graph-plugins.mdoc:368` | 2026-06-11 | Open |
| L4 | Update terminal output version in angular-rspack getting-started guide | `technologies/angular/angular-rspack/Guides/getting-started.mdoc:37,57` — shows `v20.8.0` | 2026-06-17 | Open |
| L5 | Reword or remove Nx 15.7 YouTube linkcard in Node fly.io guide | `technologies/node/Guides/node-server-fly-io.mdoc:25` | 2026-06-12 | Open |
| L6 | Update example versions in advanced-update guide (jest@22, cypress@3.4.0) | `guides/Tips-n-Tricks/advanced-update.mdoc:201` | 2026-06-11 | Open |
| L7 | Remove "Requires Nx 15.3" aside from identify-dependencies guide | `guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc:17` | 2026-06-11 | Open |
| L8 | Remove `(Nx 20+)` version tag from Composite View in explore-graph | `features/explore-graph.mdoc:427,429` | 2026-06-24 | Open |
| L-new-1 | Replace deprecated `nx affected:test` colon syntax in nx-daemon.mdoc | `concepts/nx-daemon.mdoc:13` | **[new]** 2026-06-29 | Open |
| L-new-2 | Remove "as of Nx 20" qualifier from TypeScript template description | `technologies/typescript/introduction.mdoc:98` | **[new]** 2026-06-29 | Open |

---

## Needs Input (Accumulated)

1. **`reference/Nx Cloud/config.mdoc` `tasksRunnerOptions` examples** — Are lines 24/66/121 in deprecated-context tab sections or displayed as active config patterns? Need human review of page context/tabs.

2. **`extending-nx/createnodes-compatibility.mdoc` Nx 17-20 rows** — Compatibility table covers Nx 17-20 (3–6 versions behind). Prune to Nx 21+ or keep for plugin authors supporting old workspaces?

3. **`technologies/node/Guides/application-proxies.mdoc` `--frontendProject`** — Confirm the flag is fully removed from all `@nx/node`, `@nx/nest`, `@nx/express` generators before removing the docs section.

4. **`guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc`** — "Requires Nx 15.3" aside describes nested projects. Whole page may need a refresh to verify it works with Nx 23.

5. **`technologies/angular/Guides/nx-and-angular.mdoc:214`** — "Introduced in Nx 17.3.0. If you're using an older version..." Confirm fallback command has been removed from generators before stripping the note.

6. **`technologies/build-tools/webpack/Guides/webpack-plugins.mdoc` `composePlugins`/`withReact`** — Was marked "will be removed in Nx v24". Nx 24 exists now; verify removal status and update docs accordingly.

7. **`reference/Nx Cloud/launch-templates.mdoc`** — Node 20 image names are changelog entries. Keep or prune old entries?

8. **`technologies/module-federation/consumer-and-provider.mdoc`** — Says Angular Module Federation no longer supported but still shows Angular MFe code. Remove or redirect?

9. **`nrwl/nx-set-shas@v5`** — Verify this is still the latest version (check GitHub releases). Used in 7 files. **[new]** 2026-06-29

10. **`reference/Nx Cloud/launch-template-examples.mdoc:214`** — States `install-node` step requires minimum `ubuntu22.04-node20.11-v9`. Is this minimum still accurate, or should it reference a Node 22/24 minimum? **[new]** 2026-06-29
