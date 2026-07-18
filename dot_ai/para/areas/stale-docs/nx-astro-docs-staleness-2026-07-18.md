# Nx Astro Docs Staleness Audit — 2026-07-18

**Scope:** full exhaustive sweep of all 509 `.mdoc` files under `astro-docs/src/content/docs/` (up from 503 at the 2026-06-29 audit — file count grew). Split across 13 parallel sub-agents by directory, each cross-checking claims against live source (`packages/*/schema.json`, generator/executor implementations, `nx-schema.json`) rather than training-data memory, per this repo's verification rules.

**Verified live baseline (not training data):**
- Current Nx: **23.1.0** published (`npm view nx version`); `23.2.0-beta.0` in dev; previous major's final release `22.7.7`.
- Node.js: Node 18 EOL April 2025, **Node 20 EOL April 2026 (already passed as of today)**. Node 22 in LTS to ~2027. Node 24 is current Active LTS — confirmed by the repo's own `reference/Nx Cloud/launch-templates.mdoc`, whose newest image already defaults to `node24.14`.
- "More than 2 majors back" threshold used for flagging: Nx ≤ 20 presented as current/recommended guidance (not historical/deprecated context).

Two directories turned out to contain **no auditable content** — `reference/<tool>/index.mdoc` (21 files) and all of `knowledge-base/` (26 files) are thin auto-generated `{% sidebar_group_cards %}` stub pages; the real generator/executor reference tables they link to are generated dynamically at build time from `schema.json`, not stored as static `.mdoc` files, so they can't be diffed against source from this repo. Noting this so future audits don't re-waste a cycle on them.

**Linear MCP unavailable again — 7th consecutive audit cycle.** See escalation note at the bottom; this cycle's symptom is `enabledInChat: false` (via `ListConnectors`), a still-different signature from the last two cycles ("SSE transport removed", then "zero tools despite enabledInChat: true"). All issues below are queued for manual creation, merged into the running backlog.

---

## Summary

| Category | New this cycle | Re-verified still-open (from prior backlog) | Needs Input |
|---|---|---|---|
| Old Nx version reference | 3 | 0 | 2 |
| Old Node/npm/framework version | 3 | 1 (#16) | 3 |
| Mismatched CLI/feature vs. source | 19 | 5 (#4, #7, #8, #13, #19) | 12 |
| **Total** | **25** | **6** | **17** |

This is a much larger haul than the 2026-07-10 targeted pass (3 confirmed) because this cycle re-ran a full 509-file sweep (last done 2026-06-29) with deeper per-directory source cross-checks (schema.json diffing, deprecation-annotation grepping) rather than a sampled re-check.

---

## Confirmed Findings — New This Cycle

### Cluster A: Module Federation guides teach deprecated generators as current (HIGH — 10 files)

`@nx/react:host`, `@nx/react:remote`, and `@nx/react:federate-module` (plus the `module-federation-dev-server`/`ssr-dev-server`/`static-server` executors) are deprecated as of Nx 23 (removal in v24) per source deprecation strings in `packages/react/src/utils/module-federation-deprecation.ts`, replaced by `@nx/react:consumer`/`@nx/react:provider`. One page (`consumer-and-provider.mdoc`) documents this correctly and states **Angular Module Federation support was dropped entirely in v23**. The following pages were never updated and still teach the old workflow as unqualified current guidance:

- `technologies/module-federation/Guides/create-a-host.mdoc` — `nx g @nx/react:host` with no deprecation notice
- `technologies/module-federation/Guides/create-a-remote.mdoc` — `nx g @nx/react:remote`; also says webpack-dev-server is used, but default bundler for host/remote is now `rspack` per `packages/react/src/generators/remote/schema.json`
- `technologies/module-federation/Guides/federate-a-module.mdoc` — `nx g @nx/react:federate-module`
- `technologies/module-federation/Guides/nx-module-federation-plugin.mdoc` — documents old `module-federation.config.ts` wrapper with no mention of the new model
- `technologies/module-federation/Guides/nx-module-federation-dev-server-plugin.mdoc` — ties to deprecated dev-server executors
- `technologies/module-federation/concepts/module-federation-and-nx.mdoc` — says "Nx offers ... support for Module Federation with React **and Angular**" (Angular MF dropped in v23) and "`nx serve <host>` will serve all the dependent remotes automatically" (no longer true under dynamic federation) — directly contradicted by `consumer-and-provider.mdoc`
- `technologies/module-federation/concepts/nx-module-federation-technical-overview.mdoc` — fully describes pre-v23 serving flow as current default
- `technologies/module-federation/concepts/faster-builds-with-module-federation.mdoc` — entire walkthrough built on deprecated generators
- `technologies/module-federation/concepts/manage-library-versions-with-module-federation.mdoc` — imports `ModuleFederationConfig` from `@nx/webpack`; it's actually exported from `@nx/module-federation` (`packages/module-federation/src/utils/module-federation-config.ts`) — **this file is already tracked as backlog item #19, but the fix scope is broader than previously known: the whole page's generator-based approach is also stale, not just the import path**
- `technologies/react/Guides/module-federation-with-ssr.mdoc` — `@nx/react:host --ssr` and `--devRemotes` are deprecated; `consumer-and-provider.mdoc` states SSR isn't first-classed in the new generators

**Confidence:** high across the cluster (verified against `packages/react/src/utils/module-federation-deprecation.ts` and cross-page contradiction with `consumer-and-provider.mdoc`).

---

### Cluster B: Angular Rsbuild package appears discontinued, wrong package name, phantom generator (HIGH — 5 files)

- `technologies/angular/angular-rsbuild/index.mdoc`, `introduction.mdoc`, `create-server.mdoc` — document `@nx/angular-rsbuild`, which **does not exist** in current `packages/` (only `packages/rsbuild`, `packages/angular-rspack`, `packages/angular-rspack-compiler` do). npm shows `@nx/angular-rsbuild`'s last published version is **21.2.0** while `@nx/angular-rspack` (the apparent successor, present in the source tree) is actively published at 23.1.0 in lockstep with Nx core. No deprecation/redirect notice on any of the three pages.
- `technologies/angular/angular-rspack/introduction.mdoc` — calls the package "`@angular-rspack/nx`"; the real name (per `packages/angular-rspack/package.json`) is `@nx/angular-rspack`. Every other doc in the same section uses the correct name — this looks like a leftover from before the package moved into the Nx monorepo.
- `technologies/angular/Guides/dynamic-module-federation-with-angular.mdoc` and `technologies/angular/introduction.mdoc` — both show `nx g @nx/angular:service ...`. `@nx/angular` has **no `service` generator** (`packages/angular/generators.json` full list checked); the correct invocation, per the sibling doc `nx-and-angular.mdoc`, is `nx g @schematics/angular:service`.

**Confidence:** high (verified against `packages/angular-rspack/package.json`, `packages/angular/generators.json`, and npm dist-tags for `@nx/angular-rsbuild`).

---

### Cluster C: Flagship plugin-authoring tutorial teaches deprecated `createNodesV2` as primary API (HIGH — 2 files)

- `extending-nx/project-graph-plugins.mdoc` and `extending-nx/tooling-plugin.mdoc` (the "build your first plugin" walkthrough) both use `createNodesV2` as the sole/primary exported pattern in their main code samples. Per `packages/nx/src/project-graph/plugins/public-api.ts`, `CreateNodesV2` is now `@deprecated - use CreateNodes instead` and the `createNodesV2` export is `@deprecated Prefer createNodes for new plugins` — matching the doc's *own* `createnodes-compatibility.mdoc` page, which states that as of Nx 23 "createNodesV2 export will be marked as deprecated ... Use createNodes with v2 signature instead." Compare with `performant-project-graph-plugins.mdoc`, which correctly shows `createNodes` as primary. This is the flagship new-plugin-author tutorial and it's internally inconsistent with the compatibility guide it links to.

**Confidence:** high.

---

### Cluster D: Core reference schema pages document properties that don't exist (HIGH — 2 files)

- `reference/nx-json.mdoc` — "Task options" table lists `captureStderr`, `skipNxCache`, `encryptionKey`, `selectivelyHashTsConfig` as settable "at the root of `nx.json`". None exist on the root `NxJsonConfiguration` interface (`packages/nx/src/config/nx-json.ts`) or `nx-schema.json`; they only ever existed inside the deprecated `tasksRunnerOptions.<name>.options` object. The real root-level encryption property is `nxCloudEncryptionKey`, not `encryptionKey`.
- `reference/nx-json.mdoc` also has a leading "Nx 22 Changes" aside saying "Old properties work until Nx 23" — confusing now that Nx 23 is current and a separate "Nx 23 Changes" aside further down the same page already documents the actual removal.
- `reference/environment-variables.mdoc` — the `NX_CLOUD_ENCRYPTION_KEY` row says "Can also be set via the `encryptionKey` property in `nx.json`" — should be `nxCloudEncryptionKey` (same root cause as above, confirmed `packages/nx/src/config/nx-json.ts:967`).
- `reference/environment-variables.mdoc` — the `NX_RUNNER` row says it's used to pick a task runner and "Not read if `NX_TASKS_RUNNER` is set." Source only ever reads `NX_TASKS_RUNNER` (`packages/nx/src/utils/command-line-utils.ts`); `NX_RUNNER` doesn't appear anywhere in non-test source — it isn't read at all.

**Confidence:** high.

---

### Cluster E: `reference/releases.mdoc` Node support table is out of date (HIGH — 1 file)

Table shows `v22 | Current`, `v21 | LTS`, `v20 | LTS | 2024-10-06` and an example using `nx@22.2.0`. Actual current major is **23** (not listed at all); v22 should now read as LTS/Maintenance, not Current; v20 (released 2024-10-06) is past its stated 18-month support window as of today (2026-07-18) and should show as unsupported, not LTS. The illustrative version-pairing example (`nx@22.2.0` and `@nx/js@22.2.0`) should use the current v23 line.

**Confidence:** high.

---

### Cluster F: `getting-started/installation.mdoc` shows a stale version in "Verify installation" (HIGH — 1 file, highest-traffic page in the whole site)

Line 56: "You should see a version number like `22.5.0`." Current major is 23 (23.1.0). This is the very first command a brand-new user runs.

**Confidence:** high.

---

### Other new confirmed findings (Medium/Low)

| File | Issue | Confidence |
|---|---|---|
| `extending-nx/compose-executors.mdoc` | project.json example uses `"builder"` key — no `"builder"` property exists in current `TargetConfiguration`, only `"executor"` (Angular Devkit leftover) — **already tracked as backlog #4, re-verified still broken** | medium |
| `extending-nx/creating-files.mdoc` | Example generator output shows `CREATE .babelrc`, `.eslintrc.json`, `jest.config.ts` — current defaults are `eslint.config.mjs` (flat config) and commonly Vitest | medium |
| `concepts/nx-daemon.mdoc` | "run affected commands, such `nx affected:test`" — the colon-style `affected:test` subcommand no longer exists (`packages/nx/src/command-line/affected/command-object.ts` only wires up unified `nx affected -t <target>`) | high |
| `features/CI Features/sandboxing.mdoc` | `nx show target <project>:<target> --inputs --outputs` — actual CLI implements `inputs`/`outputs` as **subcommands** (`nx show target inputs <project:target>`), not boolean flags (`packages/nx/src/command-line/show/command-object.ts`) | high |
| `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc` | `externalDependencies` documented default is `none`; actual default in `packages/webpack/src/plugins/nx-webpack-plugin/lib/apply-base-config.ts:48` is `all` | high |
| `technologies/eslint/Guides/flat-config.mdoc` | Claims `--rulesdir`/`--resolve-plugins-relative-to` and the matching `@nx/eslint:lint` options were removed; `packages/eslint/src/executors/lint/schema.json` still defines `rulesdir` and `resolvePluginsRelativeTo` | high |
| `technologies/test-tools/detox/introduction.mdoc` | Says the `@nx/detox` plugin recognizes "an ESLint configuration file" (`.detoxrc.js` etc.) to create tasks — copy-paste bug, those are Detox config files, not ESLint (`packages/detox/src/plugins/plugin.ts`) | high |
| `technologies/test-tools/playwright/introduction.mdoc` | Documents `includeMobileBrowsers`/`includeBrandedBrowsers` preset options; `NxPlaywrightOptions` in `packages/playwright/src/utils/preset.ts` only has `testDir`/`openHtmlReport`/`generateBlobReports` — real mechanism is commented-out `projects` entries in the generated config | high |
| `technologies/test-tools/storybook/Guides/*` (8 files: `storybook-interaction-tests.mdoc`, `overview-react.mdoc`, `angular-storybook-compodoc.mdoc`, `angular-configuring-styles.mdoc`, `one-storybook-for-all.mdoc`, `one-storybook-per-scope.mdoc`, `one-storybook-with-composition.mdoc`, `storybook-composition-setup.mdoc`) | All show `addons: ['@storybook/addon-essentials', '@storybook/addon-interactions']` and/or import `within` from `@storybook/testing-library` + `expect` from `@storybook/jest`; current generator (`packages/storybook/src/generators/configuration/lib/ensure-dependencies.ts`) only adds `addon-essentials` for legacy Storybook v8, and current story templates import `expect`/`within` from `storybook/test` directly — **backlog #13 already tracked 3 of these files; this cycle found 5 more** | high (2 files), medium (6 files) |
| `guides/Nx Release/publish-rust-crates.mdoc` | Instructs setting `release.version.useLegacyVersioning: true` as required, while the same page states "legacy versioning has been removed entirely" in Nx v22 — self-contradictory; `useLegacyVersioning` is no longer consumed by `packages/nx/src/command-line/release/config/config.ts`, only a deprecated compat shim remains — **already tracked as backlog #7, re-verified still broken** | high |
| `guides/ci-deployment.mdoc` | "We are working on an `NxVitePlugin`... Stay tuned" — `@nx/vite`'s build executor already ships `generatePackageJson` today (`packages/vite/src/executors/build/schema.json`) | high |
| `guides/Adopting Nx/adding-to-monorepo.mdoc` | "Lerna v6 is powering Nx underneath" framed as current news; published Lerna is now 9.0.7 | medium |
| `guides/Tips-n-Tricks/browser-support.mdoc` | Claims Nx generators ship a `.browserslistrc` file by default; no current generator template does this anymore (searched all of `packages/*`) | high |
| `guides/Tips-n-Tricks/standalone-to-monorepo.mdoc` | Config-file migration table lists `.eslintignore`/`.eslintrc.base.json`/`.eslintrc.json`; current default is flat config (`eslint.config.js/.mjs/.cjs/.ts`) | medium |
| `guides/Tasks & Caching/terminal-ui.mdoc` | "The initial Nx 21 release disables the Terminal UI on Windows... stay tuned" — `packages/nx/src/tasks-runner/is-tui-enabled.ts` has no Windows-specific disable anymore (capability-based only) — **already tracked as backlog #8, re-verified still broken** | medium-high |
| `reference/Deprecated/global-implicit-dependencies.mdoc` | "As of Nx v16 ... this field will be removed in v17" — `implicitDependencies` is still defined (marked `@deprecated`) in `packages/nx/src/config/nx-json.ts:846` and actively detected at runtime; it was never removed | medium |
| `reference/Nx Cloud/custom-images.mdoc` | Manual setup Dockerfile copies `docker:24.0.2` binaries; the same doc's own `launch-templates.mdoc` changelog says the platform "upgraded Docker from 24.0.2 to 28.3.1" — internally inconsistent | high |
| `troubleshooting/troubleshoot-convert-to-inferred.mdoc` | Explains a `@nx/next:build` `outputPath` behavior but links to the **Remix** executors reference page instead of Next.js — copy-paste error | medium |

---

## Needs Input

New this cycle:

- **`technologies/react/Guides/react-compiler.mdoc`** — "React 19 comes with an experimental compiler." Nx-side implementation matches source exactly; can't verify from this repo whether React Compiler has exited "experimental" upstream by mid-2026.
- **`reference/Nx Cloud/launch-template-examples.mdoc`** — `node-21` custom template example installs Node 21.7.3 (never LTS, EOL since mid-2024); surrounding base image correctly uses `node24.14`, so this may be an intentional "how to pin an arbitrary version" placeholder rather than a recommendation. Same file also references workflow-steps `v6` as current — can't verify against the external `nx-cloud-workflows` repo.
- **`reference/Nx Cloud/launch-templates.mdoc`** — "Images also have go 1.22 installed" — Nx Cloud infra fact, not verifiable from this repo; likely stale by mid-2026.
- **`reference/Deprecated/v1-nx-plugin-api.mdoc`** — claims API "will be removed in Nx 20" (future tense). `hasProcessProjectGraph` detection code still exists in `packages/nx/src/utils/plugins/plugin-capabilities.ts` but appears vestigial/unconsumed — needs deeper tracing than a grep to confirm whether this is truly dead. **This is the same file as prior backlog item C-1 from 2026-07-10 (re-verified as still open there); this cycle adds the nuance that the underlying capability-detection code isn't fully gone, so "will be removed" may need "already removed, mostly" instead of a flat past-tense fix.**
- **`reference/Deprecated/rescope.mdoc`** — "Starting in version 20, `@nrwl` scoped packages will no longer be published to npm" — couldn't verify against live npm/CHANGELOG without deeper package-by-package checking.
- **`guides/Tips-n-Tricks/include-all-packagejson.mdoc`** — "As of Nx 15.0.11..." still accurate per source but an 8-major-old anchor. **Same as prior backlog NI-3** — policy question, not a bug.
- **`guides/Tips-n-Tricks/keep-nx-versions-in-sync.mdoc`** — "except for plugins still in nx-labs" — can't verify whether `nx-labs` carve-out is still relevant or those plugins were promoted into `@nx/` scope.
- **`technologies/angular/angular-rspack/introduction.mdoc`** — "Angular Rspack support is still experimental" — the package versions in lockstep with core Nx (23.1.0) which might suggest graduation, but the underlying plugin package.json still shows `0.0.1` internally; no changelog confirms either way.
- **`technologies/angular/Guides/angular-nx-version-matrix.mdoc`** — intentional historical Angular 8–22 compatibility table, but lives under `Guides/` rather than a clearly-historical path; worth confirming this placement doesn't mislead skimmers.
- **`technologies/test-tools/cypress/Guides/cypress-v11-migration.mdoc`** — migrates from Cypress v8/9, but `@nx/cypress` now only supports `>=13 <16`, so no supported workspace could actually be on v8/9. Generator still exists in source; page's practical relevance today is questionable but not "wrong."
- **`enterprise/Single Tenant/*`** (7 files: auth-github, auth-gitlab, auth-bitbucket, auth-bitbucket-data-center, custom-github-app, azure-saml, okta-saml) — screenshot-driven third-party console walkthroughs (GitHub/GitLab/Bitbucket/Azure/Okta); these UIs drift independently of Nx releases and can't be verified from this repo.
- **`enterprise/conformance.mdoc`, `configure-conformance-rules-in-nx-cloud.mdoc`, `publish-conformance-rules-to-nx-cloud.mdoc`, `owners.mdoc`** and **`reference/Conformance/create-conformance-rule.mdoc`, `test-conformance-rule.mdoc`, `Executors.mdoc`, `Generators.mdoc`** — `@nx/conformance`/`@nx/owners` are proprietary Nx Cloud packages not present in this OSS repo; rule IDs, generator/executor option names, and the `createConformanceRule`/`ConformanceViolation` authoring API can't be cross-checked against source.
- **`enterprise/custom-workflows.mdoc`** — "In a future release of Nx Cloud, custom workflow creation will be released" — roadmap language that may already be outdated given the fast pace of Nx Cloud shipping.
- **`enterprise/Single Tenant/overview.mdoc`** — "Single tenant instances trail multi-tenant by about a month" — SaaS operational claim, unverifiable here.
- **`troubleshooting/troubleshoot-nx-install-issues.mdoc`** — references "Nx between 15.8 and 16.4" as historical bug context (not current guidance, so doesn't meet the SMELL 1 bar), but is ~7 majors stale and likely dead weight — human call on prune-vs-keep.
- **`reference/Owners/overview.mdoc`** — not a staleness smell, but a formatting bug: prose text appears to have been pasted directly into a `// comment` inside a JSONC example around line 367, breaking the example's validity. Flagging for a docs-quality fix alongside the staleness backlog.

Carried forward, still open (see 2026-06-29 / 2026-07-10 audits for full text):
- NI-2 — scattered "as of Nx X.Y" footnotes in current non-deprecated pages (project-configuration.mdoc, self-hosted-caching.mdoc, task-running-lifecycle.mdoc, typescript/introduction.mdoc)
- NI-6, NI-7, NI-8 — CLI flags/env vars that shell out to closed-source `nx-mcp`/`nx-cloud` binaries, can't verify from this repo

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**, unassigned (or assigned to the Linear agent if the integration is ever restored). Items 1–27 carried forward unchanged from prior audits (see 2026-06-29 and 2026-07-10 files for original text); items marked **(still open, re-verified 07-18)** were independently re-confirmed broken this cycle. Items 28+ are new.

| # | Title | Severity | Files | Status |
|---|---|---|---|---|
| 1 | Fix compatibility tables: Nx version labeled as (current) incorrectly in node/nest/typescript introductions | High | 3 files | carried forward |
| 2 | Remove/gate version-ahead content in consumer-and-provider.mdoc and migrating-from-nx-vite.mdoc | High | 2 files | carried forward |
| 3 | Fix Angular Rspack getting-started: workspace-creation version in sample output | High | 1 file | carried forward |
| 4 | Fix compose-executors.mdoc: use "executor" not "builder", use cypress.config.ts not cypress.json | High | 1 file | **re-verified still open** |
| 5 | Fix migration-generators.mdoc: remove non-existent --project flag from example | High | 1 file | carried forward |
| 6 | Fix GitHub Actions versions: nonexistent action majors (self-healing-ci, use-bun) | High | 2 files | carried forward (spot-checks this cycle found current node-version/actions versions elsewhere, e.g. Adopting Nx/ and Nx Release/ guides — may be partially fixed; needs a targeted re-check) |
| 7 | Archive or fix publish-rust-crates.mdoc: guide is broken (useLegacyVersioning removed, unfulfilled version promise) | High | 1 file | **re-verified still open** |
| 8 | Update terminal-ui.mdoc: remove stale Windows TUI "currently working on" notice | High | 1 file | **re-verified still open** |
| 9 | Add Node 20 EOL notices to Nx Cloud launch templates and examples | High | 2 files | carried forward |
| 10 | Update reference/Deprecated files: change future tense to past tense for Nx 20/21 milestones | High | 3 files | carried forward — see Needs Input note re: v1-nx-plugin-api.mdoc nuance |
| 11 | Update version-ahead deprecation callouts across build tools and framework guides | Medium | 5 files | carried forward |
| 12 | Update GitHub Actions versions to current majors across CI guides | Medium | 5+ files | carried forward |
| 13 | Replace deprecated @storybook/testing-library and @storybook/jest with storybook/test | Medium | 3→**8 files** | **re-verified still open, scope expanded** — see Cluster list above |
| 14 | Fix Storybook angular-configuring-styles: remove webpack5 builder and React-specific options | Medium | 1 file | carried forward |
| 15 | Fix Storybook best-practices: update stale Storybook URLs and old blog link | Medium | 1 file | carried forward |
| 16 | Update bundling-node-projects.mdoc: bump EOL `target: 'node18'` esbuild/Rollup target | Medium | 1 file | **re-verified still open** |
| 17 | Fix setup-incremental-builds-angular.mdoc: @angular/build:browser is not a real executor | Medium | 1 file | carried forward |
| 18 | Fix use-environment-variables-in-angular.mdoc: add deprecation note for @angular-devkit/build-angular:browser | Medium | 1 file | carried forward |
| 19 | Fix manage-library-versions-with-module-federation.mdoc: import from @nx/module-federation not @nx/webpack | Medium→**High** | 1 file | **re-verified still open, scope expanded — whole MF generator workflow is stale, not just the import (see Cluster A)** |
| 20 | Update module-federation-and-nx.mdoc: remove "As of Nx 19.5" framing | Medium→**High** | 1 file | **re-verified still open, scope expanded — page also wrongly claims Angular MF support and host auto-serve behavior (see Cluster A)** |
| 21 | Fix react-compiler.mdoc: React Compiler is no longer experimental in React 19 | Medium | 1 file | carried forward — see Needs Input, still unverifiable from this repo |
| 22 | Fix nx-daemon.mdoc: useDaemonProcess is top-level in nx.json, not in runners options | Medium | 1 file | carried forward (distinct issue from #33 below, same file) |
| 23 | Fix Nx Cloud config.mdoc: update stale version-tab labels | Medium | 1 file | carried forward |
| 24 | Fix access-tokens.mdoc: remove "authentication is changing" stale aside | Medium | 1 file | carried forward |
| 25 | Fix Storybook guide URLs: update old framework-prefixed doc paths | Low | 6 files | carried forward |
| 26 | Clean up low-value version qualifiers: old "since version X" notes in current docs | Low | 8+ files | carried forward |
| 27 | Fix react/introduction.mdoc: `--bundler` option list conflates application vs. library enums, missing `rsbuild`, wrongly includes `rollup` for applications | Medium | 1 file | carried forward |
| **28** | **Module Federation guides teach deprecated `@nx/react:host`/`remote`/`federate-module` generators and pre-v23 serving model as current, contradicting `consumer-and-provider.mdoc`** | **High** | **10 files (Cluster A above)** | **new** |
| **29** | **Angular Rsbuild docs (`angular-rsbuild/*`, 3 files) describe an apparently-discontinued package (`@nx/angular-rsbuild`, last published 21.2.0) with no pointer to its replacement `@nx/angular-rspack`** | **High** | **3 files** | **new** |
| **30** | **`angular-rspack/introduction.mdoc` calls the package `@angular-rspack/nx` instead of the correct `@nx/angular-rspack`** | **Medium** | **1 file** | **new** |
| **31** | **Two Angular docs reference a nonexistent `@nx/angular:service` generator — correct invocation is `@schematics/angular:service`** | **High** | **2 files** | **new** |
| **32** | **Flagship "build your first plugin" tutorial (`project-graph-plugins.mdoc`, `tooling-plugin.mdoc`) teaches deprecated `createNodesV2` as the primary API, contradicting the site's own `createnodes-compatibility.mdoc`** | **High** | **2 files** | **new** |
| **33** | **`nx-json.mdoc` documents 4 nonexistent root-level properties (`captureStderr`, `skipNxCache`, `encryptionKey`, `selectivelyHashTsConfig`) and has a confusing outdated "Nx 22 Changes" banner** | **High** | **1 file** | **new** |
| **34** | **`environment-variables.mdoc`: `NX_CLOUD_ENCRYPTION_KEY` row cites wrong nx.json property name (`encryptionKey` → should be `nxCloudEncryptionKey`); `NX_RUNNER` row documents an env var that's never actually read by source** | **Medium** | **1 file** | **new** |
| **35** | **`reference/releases.mdoc` Node/Nx support table is missing the current major (v23) entirely and shows outdated LTS/EOL status for v20/v22, plus a stale version-pairing example** | **High** | **1 file** | **new** |
| **36** | **`getting-started/installation.mdoc` "Verify installation" step shows expected output `22.5.0` — current major is 23** | **High** | **1 file** | **new** |
| **37** | **`extending-nx/creating-files.mdoc` example generator output lists `.babelrc`/`.eslintrc.json`/`jest.config.ts` — no longer matches current generator defaults (flat config, commonly Vitest)** | **Medium** | **1 file** | **new** |
| **38** | **`concepts/nx-daemon.mdoc` references dead `nx affected:test` colon-syntax subcommand** | **Medium** | **1 file** | **new** |
| **39** | **`features/CI Features/sandboxing.mdoc` documents `nx show target ... --inputs --outputs` as boolean flags; actual CLI implements these as subcommands (`nx show target inputs ...`)** | **High** | **1 file** | **new** |
| **40** | **`webpack-plugins.mdoc`: documented default for `externalDependencies` is `none`, actual source default is `all`** | **Medium** | **1 file** | **new** |
| **41** | **`eslint/Guides/flat-config.mdoc` incorrectly claims `--rulesdir`/`--resolve-plugins-relative-to` and their `@nx/eslint:lint` executor options were removed — they still exist in schema.json** | **Medium** | **1 file** | **new** |
| **42** | **`test-tools/detox/introduction.mdoc` mislabels Detox config files as "ESLint configuration files" (copy-paste bug)** | **Low** | **1 file** | **new** |
| **43** | **`test-tools/playwright/introduction.mdoc` documents nonexistent preset options `includeMobileBrowsers`/`includeBrandedBrowsers`** | **High** | **1 file** | **new** |
| **44** | **`guides/ci-deployment.mdoc` says NxVitePlugin's package.json generation is "coming soon" — it already shipped (`@nx/vite` build executor `generatePackageJson` option)** | **Medium** | **1 file** | **new** |
| **45** | **`guides/Adopting Nx/adding-to-monorepo.mdoc` frames "Lerna v6 is powering Nx" as current news; Lerna is now at v9** | **Low** | **1 file** | **new** |
| **46** | **`guides/Tips-n-Tricks/browser-support.mdoc` claims Nx generators ship a `.browserslistrc` by default — no current template does this** | **Medium** | **1 file** | **new** |
| **47** | **`guides/Tips-n-Tricks/standalone-to-monorepo.mdoc` config-migration table lists legacy `.eslintrc.*`/`.eslintignore` files instead of current flat-config files** | **Low** | **1 file** | **new** |
| **48** | **`reference/Deprecated/global-implicit-dependencies.mdoc` says `implicitDependencies` "will be removed in v17" — it's still present (deprecated) in current schema and actively detected at runtime** | **Low** | **1 file** | **new** |
| **49** | **`reference/Nx Cloud/custom-images.mdoc` manual Dockerfile example copies Docker 24.0.2 binaries; the platform's own changelog says it upgraded to 28.3.1** | **Low** | **1 file** | **new** |
| **50** | **`troubleshooting/troubleshoot-convert-to-inferred.mdoc` links to the Remix executors reference page when explaining a Next.js `outputPath` behavior (wrong link)** | **Low** | **1 file** | **new** |
| **51** | **`reference/Owners/overview.mdoc` has a corrupted JSONC example (prose pasted into a `//` comment mid-object) — docs-quality bug, not staleness, but same team/fix batch** | **Low** | **1 file** | **new** |

**Total backlog: 51 issues** (27 carried forward, 24 net-new; #19 and #20 had their scope expanded this cycle).

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-18) where Linear issue creation could not be completed programmatically. Symptom this cycle: `ListConnectors` reports Linear with `enabledInChat: false` and `installState: "unknown"` — a *third* distinct symptom across the run (06-17: "SSE transport removed"; 07-10: `enabledInChat: true` but zero tools exposed via `ToolSearch`; 07-18 today: `enabledInChat: false` outright). The shifting symptom signature across cycles suggests this isn't one static misconfiguration but something that flips state between runs — possibly a per-session connector toggle that isn't being persisted, or an auth token that periodically expires and needs re-authorization.

**Recommendation:** this has now cost 7 audit cycles' worth of "queue it for manual creation" — worth Jack checking the Linear connector directly in claude.ai connector settings (toggle it on for chat, and/or re-authorize it) rather than letting this scheduled task keep silently discovering the same blocker. Once fixed, someone should batch-create all 51 queued issues in one pass rather than 51 individual ones.

---

## Recurring Checks to Run

(unchanged from prior audits — see `README.md` in this folder for the full checklist and the "Agent Instructions — Preventing False Positives" verification rules, which this cycle followed: all version claims above were checked against live `npm view`/repo source, not model training data.)
