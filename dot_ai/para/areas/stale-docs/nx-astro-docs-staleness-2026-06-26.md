# Nx Astro-Docs Staleness Audit — 2026-06-26

**Nx version at audit time:** 23.0.0 (migrations confirm 23.x branch; package.json version is 0.0.1 dev sentinel)
**Node.js EOL context:** Node 16 EOL 2023-09-11; Node 18 EOL 2025-04-30; Node 20 EOL 2026-04-25; Node 22 is current LTS
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (503 files)
**Previous audits:**
- [2026-06-24](./nx-astro-docs-staleness-2026-06-24.md) — dead Nx < 17.2 cache troubleshooting step, stale "Nx 20+" label in explore-graph; 18 total issues queued.
- [2026-06-17](./nx-astro-docs-staleness-2026-06-17.md) — deprecated cacheableOperations/tasksRunnerOptions, dead Nx ≤ 19.6 conditionals, stale TS 4.7 ref.
- [2026-06-12](./nx-astro-docs-staleness-2026-06-12.md) — svgr option removed in Nx 22, stale Nx 15.7 linkcard.
- [2026-06-11](./nx-astro-docs-staleness-2026-06-11.md) — Node 20/18/16 CI configs, Nx 15-17 version notes, @nrwl scope.

**Purpose of this audit:** Fifth scan. Focused on three staleness categories the user specified: (1) old Nx versions, (2) old Node/package versions, (3) features/options that don't match CLI/plugin code.

---

## Linear Issue Status

**⚠️ Linear MCP still unavailable (fifth consecutive session).** All 18 issues from prior audits remain un-created. See the full aggregated list at the bottom of the [June 24 audit](./nx-astro-docs-staleness-2026-06-24.md).

New findings from this scan are listed below and added to the queue.

---

## New Findings (Not in Prior Audits)

### 1. `getting-started/installation.mdoc` — Version example is one major behind (Medium)

**File:** `astro-docs/src/content/docs/getting-started/installation.mdoc:56`

Line 56 reads:
> You should see a version number like `22.5.0`.

Nx is on 23.x. A user running `nx --version` on the latest release will see `23.x.y`, not `22.5.0`. This creates confusion when the output doesn't match docs.

**Fix:** Change to `23.x.x` or a concrete current version like `23.0.0`.

---

### 2. `guides/Tips-n-Tricks/advanced-update.mdoc:207` — `@nx/jest@12` override example extremely old (Low)

**File:** `astro-docs/src/content/docs/guides/Tips-n-Tricks/advanced-update.mdoc:207`

```shell
nx migrate --to="@nx/jest@12.0.0"
```

`@nx/jest@12` shipped with Nx 12 (~2021), which is 11 major versions behind. This version number is used as the illustrative example for `--to` overrides and will mislead users into thinking 12.x is a valid target version. *(Note: L6 from the June 2026-06-11 audit covers line 201 with outdated `jest@22, cypress@3.4.0` — that line now reads `jest@30.0.0,cypress@15.0.0` and appears updated. Line 207 was not covered.)*

**Fix:** Replace `@nx/jest@12.0.0` with a version that is within a plausible historical range, e.g. `@nx/jest@22.0.0`, or make it generic: `@nx/jest@<version>`.

---

### 3. `technologies/node/Guides/bundling-node-projects.mdoc:113` — Vite config targets Node 18 (EOL) (Medium)

**File:** `astro-docs/src/content/docs/technologies/node/Guides/bundling-node-projects.mdoc:113`

Code example:
```ts
export default defineConfig({
  build: {
    target: 'node18',
    ...
  },
});
```

Node 18 went EOL on 2025-04-30. Any user following this guide and deploying to a modern environment will be targeting an unsupported runtime. Prior audit H4 covers CI YAML node versions in CI files — this is a bundling guide with a Vite build config, a separate file and context.

**Fix:** Change `target: 'node18'` to `'node22'` (current LTS) or at minimum `'node20'`.

---

### 4. `guides/Tips-n-Tricks/include-all-packagejson.mdoc:7` — Wrong pnpm workspace filename (Medium)

**File:** `astro-docs/src/content/docs/guides/Tips-n-Tricks/include-all-packagejson.mdoc:7`

```
As of Nx 15.0.11, we only include any `package.json` file that is referenced in
the `workspaces` property of the root `package.json` file in the graph.
(`lerna.json` for Lerna repos or `pnpm-workspaces.yml` for pnpm repos)
```

The filename `pnpm-workspaces.yml` is wrong on two counts:
- It has a spurious **`s`** — the real filename is `pnpm-workspace.yaml` (singular)
- pnpm canonical extension is `.yaml`, not `.yml`

Confirmed correct name via Nx source: `packages/nx/src/command-line/init/implementation/utils.ts:401` reads `'pnpm-workspace.yaml'`. The incorrect name will cause users to create the wrong file.

**Fix:** Change `pnpm-workspaces.yml` → `pnpm-workspace.yaml`.

Secondary note: `reference/project-configuration.mdoc:880` uses `pnpm-workspace.yml` (singular, `.yml` extension). pnpm does accept `.yml` as an alias, so this is lower-severity but inconsistent with the canonical name. See Needs Input #1.

---

### 5. `technologies/angular/Migration/angular.mdoc:25,27` — Angular 13 references in migration guide (Low)

**File:** `astro-docs/src/content/docs/technologies/angular/Migration/angular.mdoc:25,27`

```
For an Angular 14+ repo, the `angular.json` file is split into separate `project.json` files...
Note: The changes will be slightly different for Angular 13 and lower.
```

Angular 13 shipped November 2021 (~5 years ago). Angular 14 shipped June 2022. The current Angular is 20. Anyone migrating from Angular CLI today is almost certainly on Angular 18+. The Angular 13/14 split logic is noise for any modern reader and could cause confusion.

**Fix:** Update the description to assume Angular 17+ (reasonable floor for any active project). Remove or archive the Angular 13 caveat. See Needs Input #2 — this page may need broader freshness review.

---

### 6. `reference/releases.mdoc:14` — Version lockstep example uses Nx 22 (Low)

**File:** `astro-docs/src/content/docs/reference/releases.mdoc:14`

```
e.g. `nx@22.2.0` and `@nx/js@22.2.0` should be used together.
```

Now one major version behind. A user on Nx 23 might mistakenly think 22.x is recommended.

**Fix:** Update to `nx@23.x.y` and `@nx/js@23.x.y`, or use a version-agnostic phrasing like "the same version of each package (e.g. `nx@23.0.0` and `@nx/js@23.0.0`)."

---

## Needs Input (New)

1. **`reference/project-configuration.mdoc:880` pnpm-workspace.yml** — pnpm officially supports both `pnpm-workspace.yaml` and `pnpm-workspace.yml` (added ~pnpm 6.x). The `.yml` form is valid but non-canonical. Docs currently say `pnpm-workspace.yml` (no 's', `.yml` extension). Worth standardizing to `.yaml` for consistency with other docs and Nx source, but this is a style call rather than a correctness bug.

2. **`technologies/angular/Migration/angular.mdoc` scope** — The page describes migrating FROM Angular CLI. Historical Angular 13/14 context may be intentional for users on old codebases. Need to confirm: does the Docs team want migration guides to support users on Angular ≤ 14, or is there a minimum Angular version for Nx support? If Nx 23 requires Angular ≥ 17, the page should note this and drop the Angular 13 section.

3. **`nrwl/*-template` GitHub repos in docs** — Docs reference `nrwl/express-api-template`, `nrwl/nestjs-template`, `nrwl/nextjs-template`, `nrwl/react-mfe-template`. Code only maps shorthands for `angular`, `react`, `typescript`, `empty`. The others are passed through as GitHub org/repo references. Confirm these GitHub repos exist and are maintained — couldn't verify in the sandboxed environment.

---

## Items Confirmed Still Present (Overlap with Prior Audits)

| Prior Issue | File | Status |
|-------------|------|--------|
| H3 | Node 20 minimum in tutorials | Still present (lines 21 in 3 tutorial files) |
| H4 | `node-version: 20` in CI YAML | Still present across 8+ files |
| M2 | "prior to Nx 18" proxy block | Still present in `application-proxies.mdoc` — NOTE: `--frontendProject` flag IS still in `packages/node/src/generators/application/schema.json`, so those docs are accurate. The "Not recommended for new projects" caveat is current. M2 only needs to remove the Nx < 18 config block, not the `--frontendProject` docs. |
| L6 | advanced-update example versions | Line 201 appears updated (`jest@30.0.0,cypress@15.0.0`). The L6 issue from June 11 audit may already be resolved — the new finding is line 207 (above, issue #2 in this audit). |

---

## All Open Issues — Aggregated Queue for Linear

*(All items carry label "Good for AI agents", Docs team, triage state)*

### Priority: High

| # | Title | File(s) | First Found |
|---|-------|---------|-------------|
| H1 | Remove deprecated "Nx < 17" tab from `cache-task-results.mdoc` | `features/cache-task-results.mdoc` lines 20–59 | 2026-06-17 |
| H2 | Remove "Nx <= 19.6" tabs from Nx Cloud authentication docs | `guides/Nx Cloud/access-tokens.mdoc`, `personal-access-tokens.mdoc` | 2026-06-17 |
| H3 | Update tutorial Node.js minimum from v20.19 to v22+ (Node 20 EOL) | `getting-started/Tutorials/angular-monorepo-tutorial.mdoc:21`, `react-monorepo-tutorial.mdoc:21`, `typescript-packages-tutorial.mdoc:21` | 2026-06-11 |
| H4 | Update CI YAML `node-version: 20` / `node:20` / `node:18` in 9+ files | `split-e2e-tasks.mdoc`, `distribute-task-execution.mdoc`, `assignment-rules.mdoc`, `publish-in-ci-cd.mdoc`, `adding-to-monorepo.mdoc`, `adding-to-existing-project.mdoc`, `setup-ci.mdoc`, `bring-your-own-compute.mdoc` | 2026-06-11 |

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
| M11 | Fix version example in installation guide (`22.5.0` → `23.x.x`) | `getting-started/installation.mdoc:56` | **[new]** 2026-06-26 |
| M12 | Update Vite config `target: 'node18'` to node22 (Node 18 EOL April 2025) | `technologies/node/Guides/bundling-node-projects.mdoc:113` | **[new]** 2026-06-26 |
| M13 | Fix wrong pnpm workspace filename `pnpm-workspaces.yml` → `pnpm-workspace.yaml` | `guides/Tips-n-Tricks/include-all-packagejson.mdoc:7` | **[new]** 2026-06-26 |

### Priority: Low

| # | Title | File(s) | First Found |
|---|-------|---------|-------------|
| L1 | Clean up stale "Introduced in Nx X" intro notes (Nx 13, 19.8) | `concepts/nx-daemon.mdoc:9`, `concepts/sync-generators.mdoc:9`, `reference/project-configuration.mdoc:588`, `guides/Adopting Nx/preserving-git-histories.mdoc:11` | 2026-06-17 |
| L2 | Remove "Available since Nx 16.x" asides from TypeScript guides | `technologies/typescript/Guides/enable-tsc-batch-mode.mdoc:9`, `define-secondary-entrypoints.mdoc:36`, `extending-nx/create-install-package.mdoc:24` | 2026-06-11 |
| L3 | Remove "In Nx 17 and higher" caveats from caching reference pages | `reference/nx-json.mdoc:378`, `reference/project-configuration.mdoc:212`, `extending-nx/project-graph-plugins.mdoc:368` | 2026-06-11 |
| L4 | Update terminal output version in angular-rspack getting-started guide | `technologies/angular/angular-rspack/Guides/getting-started.mdoc:37,57` (shows `v20.8.0`) | 2026-06-17 |
| L5 | Reword or remove Nx 15.7 YouTube linkcard in Node fly.io guide | `technologies/node/Guides/node-server-fly-io.mdoc:25` | 2026-06-12 |
| L6 | ~~Update example versions in advanced-update guide~~ | ~~`guides/Tips-n-Tricks/advanced-update.mdoc:201`~~ | *Likely resolved — line 201 now shows `jest@30.0.0,cypress@15.0.0`.* Verify and close. |
| L7 | Remove "Requires Nx 15.3" aside from identify-dependencies guide | `guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc:17` | 2026-06-11 |
| L8 | Remove `(Nx 20+)` version tag from Composite View in explore-graph | `features/explore-graph.mdoc:427,429` | 2026-06-24 |
| L9 | Update `@nx/jest@12.0.0` override example in advanced-update guide | `guides/Tips-n-Tricks/advanced-update.mdoc:207` | **[new]** 2026-06-26 |
| L10 | Update `nx@22.2.0` version lockstep example in releases.mdoc | `reference/releases.mdoc:14` | **[new]** 2026-06-26 |
| L11 | Remove Angular 13/14 split logic from Angular CLI migration guide | `technologies/angular/Migration/angular.mdoc:25,27` | **[new]** 2026-06-26 |

---

## Needs Input — Running List

*(Unresolved questions requiring human decision before work can start)*

1. **`reference/project-configuration.mdoc:880` `pnpm-workspace.yml`** — pnpm supports `.yml` as an alias for `.yaml`. This is valid but non-canonical. Standardize to `.yaml`?

2. **`technologies/angular/Migration/angular.mdoc` Angular 13 scope** — Does the Docs team want to maintain Angular CLI migration guidance for Angular ≤ 14? Nx 23 likely requires Angular ≥ 17. If so, the Angular 13 section can be removed.

3. **`nrwl/*-template` GitHub repos** — `nrwl/express-api-template`, `nrwl/nestjs-template`, `nrwl/nextjs-template`, `nrwl/react-mfe-template` used in docs. Verify these GitHub repos exist and are actively maintained. Can't confirm in sandboxed environment.

4. **`reference/Nx Cloud/config.mdoc` `tasksRunnerOptions`** (from June 17) — Are the `tasksRunnerOptions` blocks at lines 24/66/121 inside deprecated-context tabs or shown as live config? Need human review.

5. **`extending-nx/createnodes-compatibility.mdoc` Nx 17-20 rows** — Compatibility table includes Nx 17-20 (3-6 versions behind). Prune to Nx 21+, or keep for plugin authors supporting old workspaces?

6. **`technologies/node/Guides/application-proxies.mdoc` `--frontendProject`** — Flag IS still in `packages/node/src/generators/application/schema.json`. M2 should only remove the "prior to Nx 18 config block", not the `--frontendProject` documentation itself.

7. **`technologies/angular/Guides/nx-and-angular.mdoc:214`** — "Introduced in Nx 17.3.0, if using older version..." Confirm no users are expected to be on < 17.3.0 before removing the fallback.

8. **`technologies/build-tools/webpack/Guides/webpack-plugins.mdoc` `composePlugins`/`withReact`** — Marked "will be removed in Nx v24". Confirm if Nx 24 has shipped and whether these need immediate removal.
