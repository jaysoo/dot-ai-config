# Nx Astro-Docs Staleness Audit — 2026-06-22

**Scope**: All 499 `.mdoc` files under `astro-docs/src/content/docs/` (skipped `Deprecated/` subdirs)
**Nx version**: 23.0.0-rc.4 (so Nx ≤ 20 = >2 major versions back)
**Node EOL context**: Node 18 EOL April 2025, Node 20 EOL April 2026 — both fully stale
**Linear**: Linear MCP not available in this session — issues queued for manual creation

---

## Issues Grouped for Linear Tickets

### TICKET 1 — EOL Node.js versions in CI/build examples (Node 18 & 20)

**Severity**: HIGH — CI templates actively teach users to pin EOL runtimes

| File | Line | Stale content |
|------|------|---------------|
| `technologies/node/Guides/bundling-node-projects.mdoc` | 113 | `target: 'node18'` in Vite build config |
| `guides/Nx Cloud/bring-your-own-compute.mdoc` | 354 | `image: node:18` in GitLab CI example |
| `guides/Nx Cloud/bring-your-own-compute.mdoc` | 56, 98, 297 | `node-version: 20` (GitHub/Bitbucket) and `image: node:20` (GitLab) |
| `guides/Nx Cloud/setup-ci.mdoc` | 63, 143, 324 | `node-version: 20` and `image: node:20` |
| `guides/Nx Release/publish-in-ci-cd.mdoc` | 157, 235, 391 | `node-version: 20` in three separate job definitions |
| `guides/Adopting Nx/adding-to-monorepo.mdoc` | 388–391 | `node-version: 20` |
| `guides/Adopting Nx/adding-to-existing-project.mdoc` | 370–373 | `node-version: 20` |
| `features/CI Features/distribute-task-execution.mdoc` | 66 | `node-version: 20` |
| `features/CI Features/split-e2e-tasks.mdoc` | 464 | `node-version: 20` |
| `reference/Nx Cloud/assignment-rules.mdoc` | 375, 403 | `node-version: 20` |

**Fix**: Replace `node18`/`node:18`/`node-version: 18` → `node24`/`node:24`/`node-version: 24`; same for 20 → 24.

---

### TICKET 2 — Deprecated `createNodesV2` API taught as primary pattern

**Severity**: HIGH — plugin authors following these guides will implement a deprecated API

| File | Issue |
|------|-------|
| `extending-nx/project-graph-plugins.mdoc` | All code examples export `createNodesV2`; Nx 23 deprecates this in favor of `createNodes` (v2 signature) |
| `extending-nx/tooling-plugin.mdoc` | Tutorial's primary example exports `createNodesV2` as the main export |

> The `createnodes-compatibility.mdoc` already documents this: "Nx 23: `createNodesV2` will be marked as deprecated. Use `createNodes` with v2 signature instead."

**Fix**: Update examples to export `createNodes` (v2 signature); note `createNodesV2` as deprecated alias.

---

### TICKET 3 — `@angular-devkit/build-angular:browser` executor in active Angular docs

**Severity**: HIGH — the `browser` builder was removed in Angular 18+; config snippet will not work on supported Angular versions

| File | Line | Stale content |
|------|------|---------------|
| `technologies/angular/Guides/use-environment-variables-in-angular.mdoc` | 328 | `"executor": "@angular-devkit/build-angular:browser"` in a file-replacement example |

Angular 20–22 are supported per `technologies/angular/introduction.mdoc`. The `browser` builder was deprecated in Angular 17 and removed in Angular 18.

**Fix**: Replace with `@angular-devkit/build-angular:application` (or `@nx/angular:application` for Nx-managed projects).

---

### TICKET 4 — SVGR deprecation note says "will be removed in Nx 23" — already removed

**Severity**: HIGH — the future-tense claim is false on Nx 23

| File | Line | Stale content |
|------|------|---------------|
| `technologies/react/Guides/adding-assets-react.mdoc` | 48 | `"deprecated for Rspack (will be removed in Nx 23)"` |

Migrations in `packages/rspack/src/migrations/update-23-0-0/` confirm it was removed. The note should say "removed in Nx 23" (past tense) and remove "will be".

---

### TICKET 5 — Removed `nx affected:test` colon syntax in nx-daemon.mdoc

**Severity**: HIGH — colon syntax was removed in Nx 16; any user running this command will get an error

| File | Line | Stale content |
|------|------|---------------|
| `concepts/nx-daemon.mdoc` | 13 | `"run affected commands, such nx affected:test"` |
| `concepts/nx-daemon.mdoc` | 40 | `"set useDaemonProcess: false in the runners options in nx.json"` — `useDaemonProcess` is a top-level `nx.json` field, not in `tasksRunnerOptions` |

**Fix**: `nx affected:test` → `nx affected -t test`; fix `useDaemonProcess` placement description.

---

### TICKET 6 — `reference/releases.mdoc` shows Nx v22 as "Current"

**Severity**: HIGH — the version table is the canonical support lifecycle reference

| File | Lines | Stale content |
|------|-------|---------------|
| `reference/releases.mdoc` | 36–38 | Version table lists v22 as "Current"; example versions show `nx@22.2.0` |

**Fix**: Update table: v23 = Current, v22 = LTS (or Active), check v21/v20 LTS expiry dates. Update example version numbers.

---

### TICKET 7 — `nx-json.mdoc` aside says "Old [release tag] properties work until Nx 23" — they're already removed

**Severity**: HIGH — misleads users into thinking the old properties still work

| File | Lines | Stale content |
|------|-------|---------------|
| `reference/nx-json.mdoc` | 12–16 | `"Old properties work until Nx 23."` in "Nx 22 Changes" aside |
| `reference/nx-json.mdoc` | 499 | Elsewhere says "were removed in Nx 23" (correct) |

**Fix**: Update aside to say the old properties have been removed as of Nx 23.

---

### TICKET 8 — Stale GitHub Actions versions in CI workflow templates

**Severity**: MEDIUM — outdated action versions may behave differently or show deprecation warnings

| File | Issue |
|------|-------|
| `guides/Adopting Nx/adding-to-monorepo.mdoc` | `actions/setup-node@v3` (current: v4) |
| `guides/Adopting Nx/adding-to-existing-project.mdoc` | `actions/setup-node@v3` (current: v4) |
| `guides/Nx Cloud/bring-your-own-compute.mdoc` | `actions/setup-node@v3` (current: v4) |
| `features/CI Features/split-e2e-tasks.mdoc` | `actions/setup-node@v3` (current: v4) |
| `guides/Nx Release/publish-in-ci-cd.mdoc` | `actions/checkout@v3`, `actions/setup-node@v3`, `docker/login-action@v2` (all one version behind) |

**Fix**: Bump `actions/checkout` → v4, `actions/setup-node` → v4, `docker/login-action` → v3.

---

### TICKET 9 — `NX_CLOUD_DISTRIBUTED_EXECUTION: true` deprecated env var in docs

**Severity**: MEDIUM — replaced by `nx start-ci-run --distribute-on=...`

| File | Line | Stale content |
|------|------|---------------|
| `guides/Nx Cloud/bring-your-own-compute.mdoc` | 32 | `NX_CLOUD_DISTRIBUTED_EXECUTION: true # this enables DTE` |

**Fix**: Replace with the recommended `nx start-ci-run --distribute-on=...` approach.

---

### TICKET 10 — "We are working on NxVitePlugin… Stay tuned" placeholder never removed

**Severity**: MEDIUM — `@nx/vite/plugin` has existed for years; the note falsely implies it doesn't exist yet

| File | Line | Stale content |
|------|------|---------------|
| `guides/ci-deployment.mdoc` | 203 | `"We are working on an NxVitePlugin plugin for Vite…Stay tuned for updates."` |

**Fix**: Remove the note entirely, or replace with a link to the Vite plugin docs.

---

### TICKET 11 — `NX_CLOUD_AUTH_TOKEN` described as alias in config.mdoc but deprecated in env-vars.mdoc

**Severity**: MEDIUM — internal contradiction between two reference docs

| File | Line | Issue |
|------|------|-------|
| `reference/Nx Cloud/config.mdoc` | 51 | Says `NX_CLOUD_AUTH_TOKEN` and `NX_CLOUD_ACCESS_TOKEN` are "aliases of each other" |
| `reference/environment-variables.mdoc` | 150 | Lists `NX_CLOUD_AUTH_TOKEN` as **deprecated**: "No longer needed. Use `NX_CLOUD_ACCESS_TOKEN` instead." |

**Fix**: Update `config.mdoc` to match: `NX_CLOUD_AUTH_TOKEN` is a deprecated alias; use `NX_CLOUD_ACCESS_TOKEN`.

---

### TICKET 12 — `useLegacyVersioning` still referenced in publish-rust-crates guide (removed in Nx 22)

**Severity**: MEDIUM — the workaround it described was for an Nx 21 transition; the option was removed in Nx 22

| File | Lines | Stale content |
|------|-------|---------------|
| `guides/Nx Release/publish-rust-crates.mdoc` | 11–17, 52 | Aside describing the `useLegacyVersioning` workaround + config example using it |

The aside says "In Nx v22, the legacy versioning was removed entirely" but the recipe still shows `"useLegacyVersioning": true` in a config example.

**Fix**: Remove the `useLegacyVersioning` aside and the config example using it; update the recipe for Nx 23.

---

### TICKET 13 — Pervasive "In Nx X.Y / as of Nx X.Y / available since Nx X.Y" phrasing for versions ≤ 20

**Severity**: MEDIUM (a few LOW) — clutters docs with version qualifiers that no longer gate anything

These are scattered across ~15 files. They don't break things but create noise and imply recency for ancient features.

| File | Line | Stale phrasing |
|------|------|----------------|
| `technologies/typescript/Guides/enable-tsc-batch-mode.mdoc` | 9–11 | "Available since Nx 16.6.0" aside |
| `technologies/typescript/Guides/define-secondary-entrypoints.mdoc` | 36 | "as of Nx 16.8" |
| `technologies/typescript/introduction.mdoc` | 98 | "as of Nx 20" for template |
| `technologies/module-federation/concepts/module-federation-and-nx.mdoc` | 10 | "As of Nx 19.5" for `@module-federation/enhanced` |
| `technologies/module-federation/concepts/module-federation-and-nx.mdoc` | 115 | "With the introduction of Continuous Tasks in Nx 21" |
| `technologies/module-federation/concepts/nx-module-federation-technical-overview.mdoc` | 37 | "Continuous Tasks are a new feature in Nx 21" |
| `technologies/angular/Guides/nx-and-angular.mdoc` | 214–244 | "`nx add` introduced in Nx 17.3.0" with fallback instructions for pre-17 |
| `technologies/node/Guides/deploying-node-projects.mdoc` | 3, 195 | "Nx 20+" framing for `generatePackageJson` deprecation |
| `extending-nx/create-install-package.mdoc` | 24 | "Starting with Nx 16.5 you can now…" |
| `extending-nx/task-running-lifecycle.mdoc` | 12 | "new API… available since Nx 20.4+" |
| `troubleshooting/troubleshoot-cache-misses.mdoc` | 12–14 | Branch for "version lower than Nx 17.2.0" |
| `troubleshooting/troubleshoot-nx-install-issues.mdoc` | 13, 24 | References to Nx 15.8–16.4 native module era |
| `guides/Tasks & Caching/run-tasks-in-parallel.mdoc` | 32–48 | "Nx < 17" tab showing deprecated `tasksRunnerOptions` |
| `guides/Tasks & Caching/convert-to-inferred.mdoc` | 20 | "At minimum, you should be on Nx version 19.6" |
| `guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc` | 17–21 | "Requires Nx 15.3" aside |
| `guides/Tips-n-Tricks/include-all-packagejson.mdoc` | 7 | "As of Nx 15.0.11" |
| `guides/Nx Cloud/access-tokens.mdoc` | 272 | `nxCloudAccessToken` caution note (changed in Nx 19.7) |
| `concepts/inferred-tasks.mdoc` | 9 | "In Nx version 18, Nx plugins can automatically infer tasks" |
| `reference/nx-json.mdoc` | 340 | "In Nx 17 and higher, caching is configured by `cache: true`" |
| `reference/project-configuration.mdoc` | 212 | Same "In Nx 17 and higher" phrasing |
| `reference/project-configuration.mdoc` | 533 | "version 16 or greater" qualifier |
| `reference/Nx Cloud/config.mdoc` | 54, 63, 106, 116 | Tabs labeled "Nx >= 17" and "Nx < 17" |
| `reference/task-pipeline-configuration.mdoc` | 85 | "`targetDependencies` was removed in version 16" |
| `reference/glossary.mdoc` | 154, 231 | "Made possible in Nx 15.3" |
| `features/explore-graph.mdoc` | 427, 429 | "Composite View (Nx 20+)" heading |
| `features/run-tasks.mdoc` | 109 | "In Nx 21, task output is displayed in an interactive terminal UI" |
| `reference/nx-json.mdoc` | 563–566 | "Breaking Changes in Nx v22" aside (migration history, not useful for Nx 23 users) |
| `reference/nx-json.mdoc` | 571–572 | "Programmatic API (Nx 22+)" aside title |
| `reference/nx-console-settings.mdoc` | 225, 244 | `@nrwl/workspace:library` example (old namespace) |
| `extending-nx/project-graph-plugins.mdoc` | 372 | "This functionality is available in Nx 17 or higher" |

**Fix**: Remove or rewrite these phrases to describe current behavior without the historical version qualifier.

---

### TICKET 14 — React 18.2.0 hardcoded in Module Federation shared library example

**Severity**: MEDIUM — teaches users to pin an old React version; React 19 is current

| File | Line | Stale content |
|------|------|---------------|
| `technologies/module-federation/concepts/manage-library-versions-with-module-federation.mdoc` | 138 | `react: { singleton: true, eager: true, version: '18.2.0' }` |

**Fix**: Update example to React 19.x or use a placeholder like `'INSTALLED_VERSION'`.

---

### TICKET 15 — Cypress v11 migration guide outside Deprecated folder

**Severity**: MEDIUM — covers Cypress v8/v9 → v11 migration; current Cypress is v13+

| File | Issue |
|------|-------|
| `technologies/test-tools/cypress/Guides/cypress-v11-migration.mdoc` | Entire file covers an ancient migration path; not under `Deprecated/` |

**Fix**: Move to a `Deprecated/` subfolder or add a prominent banner linking to a current migration guide.

---

## Needs Input

These require a human decision before fixing:

1. **`technologies/test-tools/storybook/introduction.mdoc` line 20** — Peer dep listed as `>=8.0.0 <11.0.0`. Is Storybook 11 released/supported yet? If yes, the range is wrong. If no, it may be correct.

2. **`troubleshooting/unknown-local-cache.mdoc` line 51** — "When using the legacy file system cache (deprecated in Nx 20)" section still advises `NX_REJECT_UNKNOWN_LOCAL_CACHE=0`. Is this env var still honoured in Nx 23, or was the legacy cache fully removed?

3. **`guides/Nx Release/publish-rust-crates.mdoc`** — The aside promises the recipe will be updated once a Rust `useLegacyVersioning` equivalent is available in Nx 21. Was this promise fulfilled? The recipe still shows the workaround.

4. **`guides/Nx Cloud/setup-ci.mdoc` line 94 / `bring-your-own-compute.mdoc` line 136** — CircleCI orb pinned at `nrwl/nx@1.7.0` and `nrwl/nx@1.5.1`. What is the latest stable orb version? Should the docs pin a version at all, or use `@volatile`?

5. **`reference/Nx Cloud/config.mdoc`** — "Nx >= 17" / "Nx < 17" tabs: what is the actual minimum supported Nx version for Nx Cloud today? If it's 19+, the Nx < 17 tab is long dead and the whole branching structure should be removed.

---

## Summary Counts

| Severity | Ticket count | Approx. files affected |
|----------|-------------|------------------------|
| HIGH | 7 | ~12 |
| MEDIUM | 8 | ~30 |
| MEDIUM (batched) | 1 (Ticket 13) | ~30 |
| Needs Input | 5 | 6 |
| **Total** | **16** | **~48** |

Linear MCP was not available in this session. The 15 action tickets above are ready to be filed manually (or re-run when Linear MCP is restored).
