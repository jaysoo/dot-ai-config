# Nx Astro-Docs Staleness Audit — 2026-06-20

**Nx version at audit time:** 23.0.0-rc.4  
**Node.js EOL context:** Node 16 EOL 2023-09-11; Node 18 EOL 2025-04-30; Node 20 EOL 2026-04-25  
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (499 files)  
**Method:** 5 parallel sub-agent scans across concepts, enterprise, extending-nx, features, getting-started, guides, technologies, reference, troubleshooting  
**Previous audits:**
- [2026-06-17](./nx-astro-docs-staleness-2026-06-17.md) — tasksRunnerOptions/cacheableOperations tabs, Nx ≤ 19.6 dead conditionals, stale TS 4.7 ref
- [2026-06-12](./nx-astro-docs-staleness-2026-06-12.md) — svgr option removed from source, Nx 15.7 linkcard
- [2026-06-11](./nx-astro-docs-staleness-2026-06-11.md) — Full initial scan; Node 20/18/16 CI configs, Nx 15-17 version notes, @nrwl scope

Items already logged in prior audits are excluded unless there is new context or overlap is especially egregious.

---

## 1. Functionally Broken Documentation (Critical)

### `guides/Nx Release/publish-rust-crates.mdoc` — Recipe broken since Nx 22

Lines 11–16 contain an aside explaining that the Rust crates recipe "currently requires legacy versioning." The aside says `useLegacyVersioning` was removed entirely in Nx 22. However, the recipe body (line 52) still instructs users to set `release.version.useLegacyVersioning: true`. We are now on Nx 23. Verified in source: `/home/user/nx/packages/nx/src/command-line/release/config/use-legacy-versioning.ts` confirms it's only a deprecated compat shim for `@nx/js@21`, not a user-facing option.

| File | Lines | Issue |
|------|-------|-------|
| `guides/Nx Release/publish-rust-crates.mdoc` | 11–16, 52 | Recipe requires `useLegacyVersioning: true` which was removed in Nx 22; recipe is broken for Nx 22+ |

**Fix:** Update the recipe to use the new versioning approach once `@monodon/rust` ships `VersionActions`, or add a prominent banner that this guide is broken and link to a tracking issue. The "will be added in a minor release of Nx v21" promise was never fulfilled.

---

### `features/CI Features/self-healing-ci.mdoc` — Non-existent GitHub Actions versions

Lines 59–60 reference `actions/checkout@v6` and `actions/setup-node@v6`. Neither version exists — current is `@v4` for both. This is not a case of "outdated" but actively broken — any user who copies this YAML will get an action resolution failure.

| File | Lines | Issue |
|------|-------|-------|
| `features/CI Features/self-healing-ci.mdoc` | 59–60 | `actions/checkout@v6` and `actions/setup-node@v6` — these version tags do not exist |

**Fix:** Replace `@v6` with `@v4` for both actions. Also update `image: node:22` at line 129 (Node 22 is still active, so not stale).

---

### `guides/Tasks & Caching/terminal-ui.mdoc` — Windows TUI support is live, docs say "working on it"

Lines 13–15 contain a callout: `"The initial Nx 21 release disables the Terminal UI on Windows. We are currently working on Windows support, so stay tuned."` This is false — Windows support is fully implemented. Verified in `/home/user/nx/packages/nx/src/tasks-runner/is-tui-enabled.ts` which contains complete Windows terminal detection (Windows Terminal, VSCode, ConEmu, JetBrains, etc.).

Additionally, line 7 says "In version 21, Nx provides…" and line 19 says "in Nx v21 and later" — these version qualifiers are stale (Nx 21 is 2 major versions back).

| File | Lines | Issue |
|------|-------|-------|
| `guides/Tasks & Caching/terminal-ui.mdoc` | 13–15 | Windows TUI disclaimer is false; Windows IS supported |
| `guides/Tasks & Caching/terminal-ui.mdoc` | 7, 19 | "In version 21" / "in Nx v21 and later" qualifiers |

**Fix:** Remove the Windows disclaimer entirely. Remove the "In Nx 21" version anchors.

---

### `troubleshooting/unknown-local-cache.mdoc` — Workaround for removed feature

Line 51 documents `NX_REJECT_UNKNOWN_LOCAL_CACHE=0` as a way to ignore errors from the legacy file system cache. However, the legacy cache was removed in Nx 21 (deprecated in Nx 20). This env var workaround no longer applies at Nx 23 — setting it has no effect.

| File | Lines | Issue |
|------|-------|-------|
| `troubleshooting/unknown-local-cache.mdoc` | 51–54 | `NX_REJECT_UNKNOWN_LOCAL_CACHE=0` workaround for the removed legacy cache |

**Fix:** Remove the paragraph or add a note that it only applied when using the legacy cache (removed in Nx 21).

---

### `reference/nx-json.mdoc` — "Old properties work until Nx 23" callout is now false

Lines 12–13:
```
{% aside type="note" title="Nx 22 Changes" %}
Release tag configuration now uses a nested `releaseTag` object. Old properties work until Nx 23.
```
We are now on Nx 23.0.0-rc.4. The old flat `releaseTag*` properties have been removed. This callout implies they still work, which is false.

| File | Lines | Issue |
|------|-------|-------|
| `reference/nx-json.mdoc` | 12–13 | "Old properties work until Nx 23" — they have now been removed |

**Fix:** Update to "Old properties were removed in Nx 23. Use the nested `releaseTag` object." or remove the callout since the surrounding text already covers it.

---

## 2. EOL Node.js Versions (High Priority)

### `extending-nx/local-executors.mdoc` + `extending-nx/local-generators.mdoc` — node16 tsconfig

Both files (line 145 and line 116 respectively) contain an aside that says:
> "Nx uses the paths from tsconfig.base.json when running plugins locally, but uses the recommended tsconfig for **node 16** for other compiler options. See https://github.com/tsconfig/bases/blob/main/bases/node16.json"

Node 16 reached EOL September 2023. The `node16` tsconfig base is obsolete. This recommendation in a plugin development guide sends plugin authors to a 3-year-old baseline.

| File | Lines | Issue |
|------|-------|-------|
| `extending-nx/local-executors.mdoc` | 145 | References `node16` tsconfig (Node 16 EOL Sep 2023) |
| `extending-nx/local-generators.mdoc` | 116 | Same — references `node16` tsconfig |

**Fix:** Update both asides to reference `node22` (current LTS) tsconfig base.

---

### `technologies/node/Guides/bundling-node-projects.mdoc` — `target: 'node18'`

Line 113 has `target: 'node18'` in a Vite config code example. Node 18 EOL was April 2025. This is an actionable code snippet users will copy.

| File | Line | Issue |
|------|------|-------|
| `technologies/node/Guides/bundling-node-projects.mdoc` | 113 | `target: 'node18'` — Node 18 is EOL |

**Fix:** Update to `target: 'node22'` (current LTS).

---

### Node 20 EOL in CI examples (ongoing — 12 additional files)

Node 20 reached EOL April 2026. The following files contain `node-version: 20` or `image: node:20` in CI YAML examples. These were partly noted in the June 11 audit but additional instances were found in this scan:

| File | Lines | Issue |
|------|-------|-------|
| `features/CI Features/split-e2e-tasks.mdoc` | 464 | `node-version: 20` |
| `features/CI Features/distribute-task-execution.mdoc` | 66 | `node-version: 20` |
| `getting-started/Tutorials/angular-monorepo-tutorial.mdoc` | 21 | "Node.js (v20.19 or later)" prerequisite |
| `getting-started/Tutorials/react-monorepo-tutorial.mdoc` | 22 | "Node.js (v20.19 or later)" prerequisite |
| `getting-started/Tutorials/typescript-packages-tutorial.mdoc` | 22 | "Node.js (v20.19 or later)" prerequisite |
| `guides/Nx Release/publish-in-ci-cd.mdoc` | 157, 235, 391 | `node-version: 20` |
| `guides/Adopting Nx/adding-to-monorepo.mdoc` | 390 | `node-version: 20` |
| `guides/Adopting Nx/adding-to-existing-project.mdoc` | 372 | `node-version: 20` |
| `guides/Nx Cloud/setup-ci.mdoc` | 63, 143, 324 | `node-version: 20` and `image: node:20` |
| `guides/Nx Cloud/bring-your-own-compute.mdoc` | 56, 98, 297, 354 | `node-version: 20`, `image: node:20`, `image: node:18` |
| `reference/Nx Cloud/assignment-rules.mdoc` | 375, 403 | `node-version: 20` |
| `reference/Nx Cloud/launch-templates.mdoc` | 97–107 | Node 20 image changelog entries lack EOL notice |

Special note: `guides/Nx Cloud/bring-your-own-compute.mdoc` line 354 still uses `image: node:18` in the GitLab CI example — Node 18 has been EOL for over a year.

**Fix (bulk):** Replace `node-version: 20` → `node-version: 22`, `image: node:20` → `image: node:22`, `image: node:18` → `image: node:22`, and tutorial prerequisites to "Node.js 22 or later".

---

## 3. Outdated GitHub Actions / CI Tool Versions (High Priority)

### `actions/setup-node@v3` and `actions/checkout@v3` in CI examples

Current is `@v4` for both. Found in:

| File | Lines | Issue |
|------|-------|-------|
| `features/CI Features/split-e2e-tasks.mdoc` | 463 | `actions/setup-node@v3` |
| `guides/Nx Release/publish-in-ci-cd.mdoc` | 386, 389 | `actions/checkout@v3`, `actions/setup-node@v3` |
| `guides/Nx Release/publish-in-ci-cd.mdoc` | 341, 400 | `docker/login-action@v2` (current v3) |
| `guides/Adopting Nx/adding-to-monorepo.mdoc` | 388 | `actions/setup-node@v3` |
| `guides/Adopting Nx/adding-to-existing-project.mdoc` | 370 | `actions/setup-node@v3` |
| `guides/Nx Cloud/bring-your-own-compute.mdoc` | 54, 96 | `actions/setup-node@v3` |

**Fix (bulk):** Replace all `@v3` with `@v4`, `docker/login-action@v2` with `@v3`.

---

## 4. Old Nx Version Qualifiers in Active Docs (Medium Priority)

These are "available since Nx X" notes that no longer help any current reader. They should be removed or rewritten as plain present-tense facts.

| File | Lines | Stale Text | Nx version |
|------|-------|------------|-----------|
| `concepts/inferred-tasks.mdoc` | 9 | "In Nx version 18, Nx plugins can automatically infer tasks…" | Nx 18 (5 major versions old) |
| `concepts/task-pipeline-configuration.mdoc` | 85 | "targetDependencies was removed in version 16" | Nx 16 (7 major versions) |
| `extending-nx/create-install-package.mdoc` | 24 | "Starting with Nx 16.5 you can now have such a create-{x} package" | Nx 16 (7 major versions) |
| `extending-nx/task-running-lifecycle.mdoc` | 12 | "This feature is available since Nx 20.4+" | Nx 20 (3 major versions) |
| `extending-nx/project-graph-plugins.mdoc` | 372 | "This functionality is available in Nx 17 or higher" | Nx 17 (6 major versions) |
| `extending-nx/createnodes-compatibility.mdoc` | 27–31, 85, 124–134 | Entire compatibility table section covering Nx 17–20; code examples for "V1 API for Nx 17-20" | Nx 17–20 |
| `reference/nx-json.mdoc` | 340 | "In Nx 17 and higher, caching is configured by specifying `cache: true`" | Nx 17 (6 major versions) |
| `reference/project-configuration.mdoc` | 212 | "In Nx 17 and higher, caching is configured by specifying `cache: true`" | Nx 17 (6 major versions) |
| `reference/project-configuration.mdoc` | 533 | "Additionally…you can specify individual projects in version 16 or greater" | Nx 16 (7 major versions) |
| `reference/glossary.mdoc` | 154, 231 | "This was made possible in Nx 15.3" (×2) | Nx 15 (8 major versions) |
| `troubleshooting/troubleshoot-nx-install-issues.mdoc` | 13–24 | Troubleshooting guide for Nx 15.8 and 16.4 native module install issues | Nx 15–16 |
| `troubleshooting/troubleshoot-cache-misses.mdoc` | 12–14 | "If you're using a version lower than Nx 17.2.0, check…" | Nx 17 |
| `guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc` | 17–21 | "Requires Nx 15.3" aside | Nx 15 (8 major versions) |
| `guides/Tips-n-Tricks/include-all-packagejson.mdoc` | 7 | "As of Nx 15.0.11, we only include…" | Nx 15 (8 major versions) |
| `guides/Tasks & Caching/pass-args-to-commands.mdoc` | 173 | "Support for providing command args as options was added in **Nx v18.1.1**" | Nx 18 (5 major versions) |
| `guides/Tasks & Caching/convert-to-inferred.mdoc` | 20 | "At minimum, you should be on Nx version 19.6" | Nx 19 (4 major versions) |
| `guides/Tasks & Caching/self-hosted-caching.mdoc` | 44, 53 | "Starting in Nx version 20.8, you can build your own caching server" | Nx 20 (3 major versions) |
| `guides/Nx Cloud/access-tokens.mdoc` | 277 | "From Nx 19.7 new workspaces are connected to Nx Cloud with a property called `nxCloudId`" | Nx 19 (4 major versions) |
| `guides/Nx Cloud/personal-access-tokens.mdoc` | 11 | "From Nx 19.7 repositories are connected to Nx Cloud via…`nxCloudId`" | Nx 19 (4 major versions) |
| `reference/nx-cloud-cli.mdoc` | 106 | Migration guidance for Nx 19.6/19.7 `nxCloudId` rollout | Nx 19 (4 major versions) |
| `technologies/typescript/Guides/enable-tsc-batch-mode.mdoc` | 9–10 | "Available since Nx 16.6.0" | Nx 16 (7 major versions) |
| `technologies/typescript/Guides/define-secondary-entrypoints.mdoc` | 36 | "as of Nx 16.8, you can specify `additionalEntryPoints`" | Nx 16 (7 major versions) |
| `technologies/eslint/Guides/flat-config.mdoc` | 168 | "Since version 16.8.0, Nx supports flat config" | Nx 16 (7 major versions; flat config is now required) |
| `technologies/angular/Guides/nx-and-angular.mdoc` | 214 | "The command was introduced in **Nx 17.3.0**. If you're using an older version, you can instead run…" | Nx 17 (6 major versions) |
| `technologies/module-federation/concepts/module-federation-and-nx.mdoc` | 10 | "As of Nx 19.5, our Module Federation support is provided by…`@module-federation/enhanced`" | Nx 19 (4 major versions) |
| `technologies/module-federation/concepts/module-federation-and-nx.mdoc` | 115 | "With the introduction of Continuous Tasks in Nx 21…" | Nx 21 (2 major versions) |
| `technologies/module-federation/concepts/nx-module-federation-technical-overview.mdoc` | 37 | "Continuous Tasks are a new feature in Nx 21" | Nx 21 (2 major versions) |
| `technologies/angular/Guides/angular-nx-version-matrix.mdoc` | 12 | "The support for multiple versions of Angular in the latest version of Nx was added in **v15.7.0**" | Nx 15 (8 major versions) |
| `technologies/node/Guides/deploying-node-projects.mdoc` | 3, 195 | "Replaces the deprecated generatePackageJson option in Nx 20+" | Nx 20 (3 major versions) |
| `features/explore-graph.mdoc` | 427 | "Composite View (Nx 20+)" label | Nx 20 (3 major versions) |
| `getting-started/installation.mdoc` | 56 | Example version `22.5.0` shown for current Nx | Nx 22 — current is 23.x |

**Fix (bulk):** Remove or rewrite these as present-tense statements. Do NOT simply update the version number — remove the version qualifier entirely unless there is a real support matrix reason to keep it.

---

## 5. Stale External Package Versions and Guides (Medium Priority)

### `technologies/test-tools/cypress/Guides/cypress-v11-migration.mdoc` — Entire file is obsolete

This is a migration guide from Cypress v8/v9 to v11. Cypress is currently at v14, and Nx only supports Cypress ≥13 per `introduction.mdoc`. Nobody should be migrating from v8/v9 to v11 anymore. The generator `nx g @nx/cypress:migrate-to-cypress-11` may no longer exist.

| File | Issue |
|------|-------|
| `technologies/test-tools/cypress/Guides/cypress-v11-migration.mdoc` | Entire guide is stale; Cypress is now at v14, min supported ≥13 |

**Fix:** Archive the guide (move to `Deprecated/` or delete). If the migration generator still exists but no one needs it, add a deprecation notice and link to the current Cypress docs.

---

### `technologies/test-tools/cypress/Guides/cypress-component-testing.mdoc` — "Requires Cypress v10"

Lines 9–10: `"Component testing requires Cypress v10 and above. See our guide for more information to migrate to Cypress v10."` This links to the stale `cypress-v11-migration.mdoc`. The practical minimum is now Cypress 13+.

| File | Lines | Issue |
|------|-------|-------|
| `technologies/test-tools/cypress/Guides/cypress-component-testing.mdoc` | 9–10 | "Requires Cypress v10" + link to v11 migration guide |

**Fix:** Update minimum to "Cypress 13+" and remove the migration link (or link to official Cypress docs).

---

### `technologies/react/Guides/adding-assets-react.mdoc` — "Will be removed in Nx 23" is now past tense

Lines 48 and 175: SVGR support for Rspack was described as "deprecated and will be removed in Nx 23." We are now on Nx 23. The removal has happened; the text should reflect that.

| File | Lines | Issue |
|------|-------|-------|
| `technologies/react/Guides/adding-assets-react.mdoc` | 48 | "will be removed in Nx 23" — removal has occurred |
| `technologies/react/Guides/adding-assets-react.mdoc` | 175 | "As of Nx 22, SVGR support for Next.js is no longer included by default" — correct but the framing is stale |

**Fix:** Change future-tense "will be removed" to past-tense "was removed in Nx 23." Verified against June 12 audit which documented the source removal.

---

### `technologies/angular/Migration/angular.mdoc` — Angular 13/14 conditional notes

Lines 25 and 27 contain special-casing for "Angular 14+" and "Angular 13 and lower." Angular 13 went EOL May 2023, Angular 14 went EOL November 2023. No active developer should be migrating from these versions.

| File | Lines | Issue |
|------|-------|-------|
| `technologies/angular/Migration/angular.mdoc` | 25, 27 | "For Angular 14+…" / "The changes will be slightly different for Angular 13 and lower" |

**Fix:** Remove the Angular 13 conditional. Assume Angular 15+ as baseline.

---

### `technologies/module-federation/concepts/manage-library-versions-with-module-federation.mdoc` — React 18.2.0 pinned example

Line 138: `react: { singleton: true, eager: true, version: '18.2.0' }` — React 18.2.0 is from May 2022. React 19 is current (released Dec 2024).

| File | Line | Issue |
|------|------|-------|
| `technologies/module-federation/concepts/manage-library-versions-with-module-federation.mdoc` | 138 | `version: '18.2.0'` pinned React example |

**Fix:** Update to `version: '19.0.0'` or use a variable like `'x.y.z'` to indicate it's a placeholder.

---

### `technologies/angular/Guides/nx-and-angular.mdoc` — `@nx/react@18.1.0` pinned example

Line 208 uses `@nx/react@18.1.0` to illustrate pinned version installs. Nx 18 is 5 major versions old.

| File | Line | Issue |
|------|------|-------|
| `technologies/angular/Guides/nx-and-angular.mdoc` | 208 | `@nx/react@18.1.0` as pinned version example |

**Fix:** Change to `@nx/react@latest` or a current version number.

---

## 6. Potentially Stale CI Tool Versions (Needs Input)

### CircleCI Nx orb pinning — `nrwl/nx@1.5.1` vs `nrwl/nx@1.7.0`

- `guides/Nx Cloud/setup-ci.mdoc` line 94: `nx: nrwl/nx@1.7.0`
- `guides/Nx Cloud/bring-your-own-compute.mdoc` line 136: `nx: nrwl/nx@1.5.1`

These are two different versions in two docs, suggesting the `bring-your-own-compute.mdoc` hasn't been updated as recently. Cannot verify current orb version without network access.

**Needs:** Someone to check the current Nx CircleCI orb version at [circleci.com/developer/orbs/orb/nrwl/nx](https://circleci.com/developer/orbs/orb/nrwl/nx) and update both files to the latest.

---

### `guides/Nx Cloud/bring-your-own-compute.mdoc` line 32 — `NX_CLOUD_DISTRIBUTED_EXECUTION: true` comment

The comment says `# this enables DTE` but `reference/environment-variables.mdoc` states this variable is "typically not needed" and that DTE is enabled via `nx start-ci-run`, not this env var. The comment may be misleading.

**Needs:** Confirmation from the DTE team on whether setting this env var to `true` has any effect in current Nx Cloud.

---

## Proposed Linear Issues (Queued — Linear MCP unavailable)

Linear MCP connection is broken in this session (SSE transport issue, same as June 17 audit). Create these manually in the Docs team triage with label "Good for AI agents":

| # | Title | Priority | Files |
|---|-------|----------|-------|
| 1 | Rust crates publish guide broken in Nx 22+ (useLegacyVersioning removed) | Critical | `guides/Nx Release/publish-rust-crates.mdoc` |
| 2 | `self-healing-ci.mdoc` references non-existent GitHub Actions @v6 | Critical | `features/CI Features/self-healing-ci.mdoc` |
| 3 | Windows Terminal UI documented as unsupported but is fully supported | High | `guides/Tasks & Caching/terminal-ui.mdoc` |
| 4 | `NX_REJECT_UNKNOWN_LOCAL_CACHE=0` workaround documented for removed feature | High | `troubleshooting/unknown-local-cache.mdoc` |
| 5 | "Old release tag properties work until Nx 23" callout is now false | High | `reference/nx-json.mdoc` |
| 6 | node16 tsconfig recommended in plugin development guides (Node 16 EOL Sep 2023) | High | `extending-nx/local-executors.mdoc`, `extending-nx/local-generators.mdoc` |
| 7 | EOL Node.js versions in CI examples: node-version 20, image node:20/18 (12 files) | High | See Section 2 table above |
| 8 | Outdated GitHub Actions: actions/setup-node@v3, checkout@v3, docker/login-action@v2 | High | See Section 3 table above |
| 9 | Remove pre-Nx 21 version qualifiers from 30+ active docs pages | Medium | See Section 4 table above |
| 10 | Cypress v11 migration guide is entirely obsolete (Cypress now at v14) | Medium | `technologies/test-tools/cypress/Guides/cypress-v11-migration.mdoc` |
| 11 | SVGR "will be removed in Nx 23" text should be updated to past tense | Medium | `technologies/react/Guides/adding-assets-react.mdoc` |
| 12 | Angular 13/14 conditional migration notes (both EOL) | Low | `technologies/angular/Migration/angular.mdoc` |
| 13 | React 18.2.0 pinned in module federation example (React 19 is current) | Low | `technologies/module-federation/concepts/manage-library-versions-with-module-federation.mdoc` |
