# Nx Astro Docs Staleness Audit — 2026-07-28

**Scope note:** same targeted methodology as the [2026-07-10 audit](./nx-astro-docs-staleness-2026-07-10.md) — a 3-agent pass scoped to exactly the three requested staleness smells: (1) old Nx major version mentions, (2) old Node/npm/framework version mentions, (3) documented CLI/generator/config options that no longer match source. Not a full re-sweep of all ~503 `.mdoc` files (476 counted this cycle under `astro-docs/src/content/docs`) — treat the [2026-06-29 audit](./nx-astro-docs-staleness-2026-06-29.md)'s backlog as still the base full-sweep list.

Current Nx: **23.2.0-beta.2** (verified live from root `package.json` "nx" devDependency and `packages/nx/migrations.json`, which has entries up through `23-0-0-*` — per this file's own verification rules, training data was not used). Node current LTS: **24.x** (Active), **22.x** (Maintenance) — matches what `technologies/node/introduction.mdoc` already states, no drift found there. React current: **19.x**, also correctly reflected in docs.

**Linear MCP still unavailable — 7th consecutive audit cycle.** This time the symptom is different again: `ListConnectors` reports the Linear connector as `connected: true` at the org level but **`enabledInChat: false`** for this session — i.e. it's authenticated but toggled off for chat use, and since this is an unattended scheduled run there's no live user to flip it on. Prior cycles saw "SSE transport removed" (06-17) and "enabledInChat: true but zero tools exposed" (07-10). Three different failure modes across seven runs — see escalation section at the bottom. All issues below remain queued for manual creation.

---

## Summary

| Category | Confirmed (new or re-verified) | Needs Input |
|---|---|---|
| Old Nx version reference | 3 (1 re-verified = prior C-1; 2 new, more specific than prior NI-4) | 3 |
| Old Node/npm/framework version | 2 (1 re-verified = prior backlog #16; 1 new) | 1 (re-verified = prior NI-5) |
| Mismatched CLI/config vs. source | 4 (**all new**) | 1 (= prior NI-7, still unverifiable) |
| **Total** | **9** | **5** |

---

## Confirmed Findings

### C-1 — `reference/Deprecated/v1-nx-plugin-api.mdoc` still uses future tense for Nx 20 (re-verified, = prior C-1 / H-13)
**File:** `astro-docs/src/content/docs/reference/Deprecated/v1-nx-plugin-api.mdoc` (line 11, body lines 26–243)
**Category:** old-nx-version
**Issue:** "This API has been superceded by the v2 API and **will be removed in Nx 20**." Current Nx is 23.x — three majors past the stated removal. Worse, the rest of the page still teaches `registerProjectTargets`/`processProjectGraph` in present tense as if the v1 API is live; grep confirms those hooks are no longer part of the plugin-loading path in `packages/nx/src`. Still unfixed since 06-29.

---

### C-2 — `reference/Deprecated/as-provided-vs-derived.mdoc` tells readers to add flags that no longer exist (new detail on prior NI-4)
**File:** `astro-docs/src/content/docs/reference/Deprecated/as-provided-vs-derived.mdoc` (lines 29, 93, 110, 118–127)
**Category:** old-nx-version / mismatched-feature
**Issue:** The "Writing scripts" section instructs readers to add `--projectNameAndRootFormat as-provided` and `--nameAndDirectoryFormat as-provided` to their generator scripts as a concrete, actionable migration step. `grep -r "projectNameAndRootFormat\|nameAndDirectoryFormat" packages/` returns **zero matches** anywhere in the current codebase — these flags don't exist in Nx 23 and following the example will error out. This is more actionable/severe than the general "future tense" framing noted in prior audits.

---

### C-3 — `reference/Deprecated/legacy-cache.mdoc` frames an already-completed removal as pending (new detail on prior NI-4)
**File:** `astro-docs/src/content/docs/reference/Deprecated/legacy-cache.mdoc` (lines 10, 15, 21)
**Category:** old-nx-version
**Issue:** "In Nx 21, the legacy file system cache **will be removed**..." / "...**can still be used in Nx 20** by setting `useLegacyCache: true`." Confirmed via `packages/nx/src/migrations/update-21-0-0/remove-legacy-cache.ts` ("the property is not functional in nx v21") that this happened two majors ago. A reader on Nx 23 could be misled into thinking `useLegacyCache`/`tasksRunnerOptions` still function.

---

### C-4 — `kb/bundling-node-projects.mdoc` still targets EOL Node 18 (re-verified, = prior backlog #16)
**File:** `astro-docs/src/content/docs/kb/bundling-node-projects.mdoc` (line 115)
**Category:** old-node-version
**Issue:** `target: 'node18',` in the Vite `build.target` example, presented as current guidance. Node 18 EOL'd April 2025. The Webpack/esbuild tabs alongside it don't hardcode an EOL runtime — only the Vite tab is stale. Still unfixed since first flagged 06-29.

---

### C-5 — `kb/yarn-pnp.mdoc` shows Yarn 3.6.1 as the output of `yarn set version stable` (new finding)
**File:** `astro-docs/src/content/docs/kb/yarn-pnp.mdoc` (line 40)
**Category:** old-node-version / package-version
**Issue:** `"packageManager": "yarn@3.6.1",` is shown as the literal result of running `yarn set version stable`. By now "stable" resolves to Yarn 4.x — this docs site's own `kb/yarn-workspaces.mdoc:83` references "Yarn 4.10+" catalogs as current elsewhere, so this page is internally inconsistent with the rest of the site, not just with reality.

---

### C-6 — `reference/nx-json.mdoc` lists `tasksRunnerOptions`-only properties as valid at the nx.json root (new finding)
**File:** `astro-docs/src/content/docs/reference/nx-json.mdoc` (lines 194–201, "Task options" table)
**Category:** mismatched-config
**Issue:** The table claims `captureStderr`, `skipNxCache`, `encryptionKey`, and `selectivelyHashTsConfig` "affect the way Nx runs tasks and can be set at the root of `nx.json`." Checked against `packages/nx/src/config/nx-json.ts:971-979` and `packages/nx/schemas/nx-schema.json:817-855`: only `parallel` and `cacheDirectory` are actually root-level `NxJsonConfiguration` properties. The other four only exist nested under `tasksRunnerOptions.<runner>.options` (confirmed at the read site, e.g. `this.options.captureStderr` in `packages/nx/src/tasks-runner/task-orchestrator.ts:121`, where `this.options` is the runner's options object, not nx.json's root). `selectivelyHashTsConfig` doesn't appear in the nx.json schema/type at all — only read off the same nested options object in `packages/nx/src/hasher/task-hasher.ts:197`. Setting these at the nx.json root is silently ignored — likely a holdover from a pre-plugin-architecture nx.json shape.

---

### C-7 — `reference/environment-variables.mdoc` documents `NX_RUNNER`, which doesn't exist in code (new finding)
**File:** `astro-docs/src/content/docs/reference/environment-variables.mdoc` (line 228, cf. line 238)
**Category:** mismatched-config
**Issue:** Docs list `NX_RUNNER` as a real env var read at runtime ("Not read if `NX_TASKS_RUNNER` is set"). `packages/nx/src/utils/command-line-utils.ts:211-244` (`normalizeNxArgsRunner`) only reads `process.env['NX_TASKS_RUNNER']`. `NX_RUNNER` appears solely in `command-line-utils.spec.ts` as a decoy value used to prove it has **no** effect. The `NX_RUNNER` row should be removed, and the `NX_TASKS_RUNNER` row's "Preferred over `NX_RUNNER`" phrasing corrected.

---

### C-8 — `reference/nx-json.mdoc` documents `preferDockerVersion` type incompletely (new finding)
**File:** `astro-docs/src/content/docs/reference/nx-json.mdoc` (line 592, Release Tag "Configuration options" table)
**Category:** mismatched-config
**Issue:** Documented as `boolean` only ("Whether to prefer Docker-compatible version format in git tags"). Actual type in `packages/nx/src/config/nx-json.ts` (lines 604 and 714) is `boolean | 'both'`, where `'both'` has distinct, undocumented behavior ("Create tags and changelog entries for both docker and semver versions").

---

### C-9 — `reference/project-configuration.mdoc` says `syncGenerator` (singular); the real field is `syncGenerators` (new finding)
**File:** `astro-docs/src/content/docs/reference/project-configuration.mdoc` (line 588, contradicted by its own example at line 594)
**Category:** mismatched-config
**Issue:** Prose reads "the `syncGenerator` property tells Nx to run a generator..." — but `packages/nx/schemas/project-schema.json:162` only defines `syncGenerators` (plural), and the doc's own code sample two lines later correctly uses `"syncGenerators": [...]`. Internally inconsistent within the same page.

---

## Needs Input

### NI-1 — `reference/Deprecated/global-implicit-dependencies.mdoc`: unfulfilled removal prediction
"This field will be removed in v17" (re: `implicitDependencies` in nx.json) never happened — `packages/nx/src/config/nx-json.ts` (~line 848) still declares it, marked `@deprecated` but not removed. Low reader impact since the page already correctly says the field is ignored as of v16; borderline whether this crosses the "misleads a reader about current behavior" bar.

### NI-2 — `reference/Deprecated/rescope.mdoc`: "As of version 20, `@nrwl` packages will no longer be published" — stale tense, accurate fact
Future-tense phrasing never updated 3 majors later, but the underlying claim remains true today. Stylistically dated, not factually wrong.

### NI-3 — `reference/Deprecated/workspace-generators.mdoc`: entire page describes an obsolete Nx 13.10-era concept with live-sounding setup instructions
Commands likely still technically work, but nobody creates "workspace generators" starting fresh on Nx 23. Judgment call on whether a Deprecated/hidden page needs this level of currency.

### NI-4 — `reference/Nx Cloud/launch-template-examples.mdoc`: Node 21 still used as the illustrative override example (re-verified, = prior NI-5 / H-12, still open)
`node_version: '21'` and `nvm install 21.7.3`. Node 21 was never LTS and has been EOL a long time. Plausibly an arbitrary placeholder — the surrounding image example correctly uses `ubuntu22.04-node24.14-v1` — but confusing as the one non-current number on the page.

### NI-5 — `reference/nx-cloud-cli.mdoc` and CI Features pages: flags reference the closed-source `nx-cloud` binary (re-verified, = prior NI-7)
Still can't verify `--fix-tasks`, `--stop-agents-after`, etc. from this repo — `packages/nx/src/command-line/nx-cloud/start-ci-run/command-object.ts` confirms these just shell out to a package not present in this checkout.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Items 1–27 carried forward unchanged from the [2026-07-10 audit](./nx-astro-docs-staleness-2026-07-10.md) (not all individually re-sampled this cycle; items re-verified this pass are noted). Items 28–32 are new this cycle.

| # | Title | Severity | Files |
|---|---|---|---|
| 1 | Fix compatibility tables: Nx version labeled as (current) incorrectly in node/nest/typescript introductions | High | 3 files |
| 2 | Remove/gate version-ahead content in consumer-and-provider.mdoc and migrating-from-nx-vite.mdoc | High | 2 files |
| 3 | Fix Angular Rspack getting-started: workspace-creation version in sample output | High | 1 file |
| 4 | Fix compose-executors.mdoc: use "executor" not "builder", use cypress.config.ts not cypress.json | High | 1 file |
| 5 | Fix migration-generators.mdoc: remove non-existent --project flag from example | High | 1 file |
| 6 | Fix GitHub Actions versions: nonexistent action majors (self-healing-ci, use-bun) | High | 2 files |
| 7 | Archive or fix publish-rust-crates.mdoc: guide is broken (useLegacyVersioning removed, unfulfilled version promise) | High | 1 file |
| 8 | Update terminal-ui.mdoc: remove stale Windows TUI "currently working on" notice | High | 1 file |
| 9 | Add Node 20 EOL notices to Nx Cloud launch templates and examples | High | 2 files |
| 10 | Update reference/Deprecated files: change future tense to past tense for Nx 20/21 milestones (still open — re-verified via C-1 this cycle) | High | 3 files |
| 11 | Update version-ahead deprecation callouts across build tools and framework guides | Medium | 5 files |
| 12 | Update GitHub Actions versions to current majors across CI guides | Medium | 5+ files |
| 13 | Replace deprecated @storybook/testing-library and @storybook/jest with @storybook/test | Medium | 3 files |
| 14 | Fix Storybook angular-configuring-styles: remove webpack5 builder and React-specific options | Medium | 1 file |
| 15 | Fix Storybook best-practices: update stale Storybook URLs and old blog link | Medium | 1 file |
| 16 | Update bundling-node-projects.mdoc: bump EOL `target: 'node18'` esbuild/Rollup target (still open — re-verified via C-4 this cycle) | Medium | 1 file |
| 17 | Fix setup-incremental-builds-angular.mdoc: @angular/build:browser is not a real executor | Medium | 1 file |
| 18 | Fix use-environment-variables-in-angular.mdoc: add deprecation note for @angular-devkit/build-angular:browser | Medium | 1 file |
| 19 | Fix manage-library-versions-with-module-federation.mdoc: import from @nx/module-federation not @nx/webpack | Medium | 1 file |
| 20 | Update module-federation-and-nx.mdoc: remove "As of Nx 19.5" framing | Medium | 1 file |
| 21 | Fix react-compiler.mdoc: React Compiler is no longer experimental in React 19 | Medium | 1 file |
| 22 | Fix nx-daemon.mdoc: useDaemonProcess is top-level in nx.json, not in runners options | Medium | 1 file |
| 23 | Fix Nx Cloud config.mdoc: update stale version-tab labels | Medium | 1 file |
| 24 | Fix access-tokens.mdoc: remove "authentication is changing" stale aside re: Nx 19.7 (still open — re-verified this cycle, note: file has moved to `kb/access-tokens.mdoc`) | Medium | 1 file |
| 25 | Fix Storybook guide URLs: update old framework-prefixed doc paths | Low | 6 files |
| 26 | Clean up low-value version qualifiers: old "since version X" notes in current docs | Low | 8+ files |
| 27 | Fix react/introduction.mdoc: `--bundler` option list conflates application vs. library enums, missing `rsbuild`, wrongly includes `rollup` for applications (still open — re-verified this cycle) | Medium | 1 file |
| **28** | **Fix as-provided-vs-derived.mdoc: remove non-existent `--projectNameAndRootFormat`/`--nameAndDirectoryFormat` flags from "Writing scripts" migration example — following it errors out on Nx 23** | **High** | **1 file** |
| **29** | **Fix legacy-cache.mdoc: change future tense ("will be removed in Nx 21", "can still be used in Nx 20") to past tense — removal completed 2 majors ago** | **Medium** | **1 file** |
| **30** | **Fix yarn-pnp.mdoc: `yarn set version stable` example shows Yarn 3.6.1 output, inconsistent with yarn-workspaces.mdoc's "Yarn 4.10+" and with actual current stable** | **Medium** | **1 file** |
| **31** | **Fix nx-json.mdoc: `captureStderr`/`skipNxCache`/`encryptionKey`/`selectivelyHashTsConfig` documented as root-level nx.json properties but only functional nested under `tasksRunnerOptions.<runner>.options`; also `preferDockerVersion` type missing the `'both'` option** | **High** | **1 file** |
| **32** | **Fix environment-variables.mdoc: remove `NX_RUNNER` (not read anywhere in source, only `NX_TASKS_RUNNER` is); correct the "preferred over NX_RUNNER" cross-reference** | **Medium** | **1 file** |
| **33** | **Fix project-configuration.mdoc: prose says `syncGenerator` (singular), schema and the page's own example both use `syncGenerators` (plural)** | **Low** | **1 file** |

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-28) where Linear issue creation could not be completed programmatically, and the **third distinct failure mode**:
- 06-17: "SSE transport removed"
- 07-10: `ListConnectors` showed `enabledInChat: true`, but `ToolSearch` returned zero Linear tools for any query
- 07-28 (this cycle): `ListConnectors` shows `connected: true` at the org level but **`enabledInChat: false`** — authenticated, just switched off for this chat session. Since this run is an unattended scheduled task, there is no live user available to toggle it on mid-run.

Three different symptoms across seven cycles suggests this isn't one transient bug but either a flaky connector or a chat-session-scoping issue that resets between sessions. Recommend Jack check the Linear connector's chat-enablement setting directly (claude.ai connector settings) rather than expecting it to self-resolve, and consider whether scheduled/unattended sessions need a different mechanism than the interactive per-chat toggle to reach org-connected MCP servers.

## Recurring Checks to Run

(unchanged from prior audits — see top of this file's README for the checklist)
