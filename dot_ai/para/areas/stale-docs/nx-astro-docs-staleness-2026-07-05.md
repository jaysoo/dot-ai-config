# Nx Astro Docs Staleness Audit — 2026-07-05

Scanned all 503 `.mdoc` files under `astro-docs/src/content/docs/` in `nrwl/nx`, using 13 parallel agents split by section (technologies/*, concepts, extending-nx, features, getting-started, guides, knowledge-base, reference/*), each cross-checking claims against the actual source under `packages/`.

**Baseline (verified from live repo state, not training data):**
- Current Nx: **23.x** — `package.json` is at `23.1.0-beta.6`; multiple docs describe things "removed in Nx 23" in the past tense (e.g. vitest split out of `@nx/vite`), confirming 23.0.0 already shipped GA and 23.1 is the in-progress minor. 22.x is the prior stable major.
- Node support: Nx 23.x → 26.x/24.x/^22.12.0; Nx 22.x → also ^20.19.0 (per `technologies/node/introduction.mdoc`, itself accurate). Node 18 has been EOL since April 2025; Node 20 EOL April 2026 (already past, per today's date).
- GitHub Actions ground truth: verified directly against the `nrwl/nx` repo's own `.github/workflows/*.yml` — pinned to `actions/checkout@v5.0.0` and `actions/setup-node@v5.0.0`. Any doc still showing `@v3` is 2 majors behind, confirmed (not a baseline error).

Linear MCP was **not available** in this session (no `mcp__Linear__*` tools were exposed despite the connector showing as connected) — this is the **5th consecutive audit** with this blocker (see 06-17, 06-24, 06-29 notes below). All issues are queued at the bottom for manual creation. Worth escalating separately: something about the Linear MCP server setup itself needs fixing.

---

## Summary

| Category | Confirmed | Needs Input |
|---|---|---|
| Old/stale Nx version or version-support claims | 9 | 1 |
| Old Node/npm/tool versions presented as current | 6 | 2 |
| Feature/CLI/schema drift (option-mismatch) | 28 | 4 |
| **Total** | **43** | **7** |

---

## HIGH Severity

### H-1 — Module Federation docs teach generators being removed in Nx v24, with zero warning
**Files (8):**
- `technologies/angular/Guides/dynamic-module-federation-with-angular.mdoc`
- `technologies/angular/Guides/module-federation-with-ssr.mdoc`
- `technologies/angular/introduction.mdoc` ("Set up Module Federation" section)
- `technologies/module-federation/Guides/create-a-host.mdoc`
- `technologies/module-federation/Guides/create-a-remote.mdoc`
- `technologies/module-federation/Guides/federate-a-module.mdoc`
- `technologies/module-federation/concepts/faster-builds-with-module-federation.mdoc`
- `technologies/module-federation/concepts/micro-frontend-architecture.mdoc`

**Verified against source:** `packages/react/generators.json` and `packages/angular/generators.json` mark `host`, `remote`, `federate-module` (React) and `host`/`remote`/`federate-module`/`module-federation-dev-server`/`module-federation-ssr-dev-server` (Angular) all `x-deprecated`, e.g.:
> "Angular Module Federation in Nx is no longer supported. Use `@angular-architects/native-federation` instead... Removed in Nx v24."

These 8 files are full tutorials/guides built entirely around the deprecated generators, presented as the current, first-class way to do Module Federation, with no pointer to the replacement (`@nx/react:consumer`/`:provider`; native-federation for Angular). One sibling doc (`consumer-and-provider.mdoc`) already documents the new model and the deprecation correctly — these 8 are simply out of sync with it.

**Needs input:** `technologies/module-federation/concepts/module-federation-and-nx.mdoc` links to the deprecated guides above as "the way to learn this" — same root cause, lower confidence since it's an indirect reference.

---

### H-2 — Doc-generation script silently drops `x-deprecated` schema annotations (systemic, root cause)
**Files:** `reference/angular/index.mdoc`, `reference/cypress/index.mdoc` (and, by construction, every generated executor/generator reference page for every plugin)

The `reference/<plugin>/index.mdoc` pages are thin stubs — the actual options tables are generated at build time by `astro-docs/src/plugins/utils/generate-plugin-markdown.ts` directly from each package's `schema.json`. That script builds each row from `property.type`/`description`/`default`/`required` only; it **never reads `x-deprecated`** (confirmed: zero matches for "deprecated" in the file). Concretely:
- `@nx/angular:module-federation-dev-server` / `module-federation-ssr-dev-server` executors are marked deprecated (removed in v24) but render as normal, current executors.
- `@nx/angular:application`'s `ssr.experimentalPlatform` option is marked `x-deprecated: "Use 'platform' instead."` but renders like any other option.
- `@nx/cypress:cypress` is deprecated (removed in v24) but renders as current.
- `@nx/cypress:cypress`'s `headless` option was marked for removal **in Nx v23** (already current) — it's still in the schema, still undocumented as deprecated, and now overdue.

This is a doc-tooling bug, not a content bug — fixing `generate-plugin-markdown.ts` to render `x-deprecated` text would fix every affected page at once, including ones not caught in this pass.

---

### H-3 — extending-nx guides teach the deprecated `createNodesV2` as the primary plugin API
**Files:** `extending-nx/tooling-plugin.mdoc`, `extending-nx/project-graph-plugins.mdoc`

Both guides exclusively use `createNodesV2`/`CreateNodesV2`/`CreateNodesContextV2` in every code example, framed as *the* API ("This is the API that Nx uses under the hood"). Per `packages/nx/src/project-graph/plugins/public-api.ts`, these are `@deprecated` aliases ("will be removed in Nx 24") for `createNodes`/`CreateNodes`/`CreateNodesContext`, confirmed by a dedicated codemod (`packages/devkit/src/migrations/update-23-0-0/rename-create-nodes-v2-types.ts`) and by the sibling doc `extending-nx/createnodes-compatibility.mdoc`'s own compatibility table ("23.x+ ... Prefers `createNodes`; `createNodesV2` is a deprecated alias"). `extending-nx/performant-project-graph-plugins.mdoc` already gets this right — these two don't.

---

### H-4 — Angular tutorial uses an invalid generator flag value (breaks as written)
**File:** `getting-started/Tutorials/angular-monorepo-tutorial.mdoc`

`npx nx g @nx/angular:library libs/ui --unitTestRunner=vitest` — `packages/angular/src/generators/library/schema.json` defines `unitTestRunner` as `enum: ["vitest-angular", "vitest-analog", "jest", "none"]` with `additionalProperties: false`. Plain `vitest` isn't a valid value and isn't aliased. Copy-pasting this step from the tutorial fails schema validation.

---

### H-5 — Jest docs teach a CLI flag that isn't real
**File:** `technologies/test-tools/jest/introduction.mdoc`

Docs show `nx test my-app --testFile user-profile.spec.ts` as the way to run a single file. The default inferred Jest target is a `run-commands`-backed `jest` command with `forwardAllArgs: true`, so `--testFile` gets forwarded verbatim to the real Jest CLI, which has no such flag (only positional args / `testPathPatterns`) — it errors. `testFile` was only ever a property of the now-deprecated `@nx/jest:jest` executor (`x-deprecated`, removal in v24).

---

### H-6 — `reference/releases.mdoc` "Supported versions" table is stale
**File:** `reference/releases.mdoc`

Table still shows `v22 | Current | 2025-10-22`, with v20/v21 as LTS — no v23 row at all. Per the page's **own stated policy** (new major every ~6 months, 18 months of total support), and given the repo is already on 23.1.0-beta (i.e. v23.0.0 already shipped GA — confirmed by other docs describing Nx-23 changes in past tense), v23 should now be "Current", v22 should have moved to LTS, and v20 (released 2024-10-06) should already have fallen out of its own 18-month support window as of ~2026-04. This is the docs' own reference table for support timelines being behind the product.

---

### H-7 — `nx-json.mdoc` / `environment-variables.mdoc` document the wrong Nx Cloud encryption-key property name
**Files:** `reference/nx-json.mdoc`, `reference/environment-variables.mdoc`

Both say the cache-encryption env var "can also be set via the `encryptionKey` property in `nx.json`." The real `NxJsonConfiguration` field (`packages/nx/src/config/nx-json.ts`) is `nxCloudEncryptionKey`; `encryptionKey` is only an internal runner-options key it gets copied into (see `packages/nx/src/tasks-runner/run-command.ts` and the Nx 17 migration `use-minimal-config-for-tasks-runner-options.ts` that renamed it). A user adding `encryptionKey` to `nx.json` as documented has it silently ignored.

---

### H-8 — `publish-rust-crates.mdoc` still recommends a dead config flag (recurring, unresolved since ≥3 prior audits)
**File:** `guides/Nx Release/publish-rust-crates.mdoc`

Instructs setting `release.version.useLegacyVersioning: true` to work around a `@monodon/rust` gap. `packages/nx/src/command-line/release/config/use-legacy-versioning.ts` is now just `// TODO(v23): remove — kept only so @nx/js@21's library generator can load via ensurePackage. @deprecated Compat shim for @nx/js@21.` — the flag is a no-op today. **This exact guide was flagged broken in the 2026-06-29 audit (H-9/NI-4) and is still unfixed.**

---

## MEDIUM Severity

### M-1 — `nx-json.mdoc`: three properties documented as settable "at the root of nx.json" that aren't
**File:** `reference/nx-json.mdoc`
`captureStderr` and `skipNxCache` are CLI-only flags (`packages/nx/src/command-line/yargs-utils/shared-options.ts`); `selectivelyHashTsConfig` is only read from the deprecated `tasksRunnerOptions.<runner>.options` shape (`packages/nx/src/hasher/task-hasher.ts:197`). None exist on the current `NxJsonConfiguration` interface.

### M-2 — `nx-json.mdoc`: TUI section missing the real `suppressHints` option
**File:** `reference/nx-json.mdoc`
Only documents `enabled`/`autoExit`; `packages/nx/src/config/nx-json.ts:1019-1037` also defines `tui.suppressHints` (current, not deprecated).

### M-3 — `webpack-plugins.mdoc`: wrong default + incomplete enum for `NxAppWebpackPlugin`
**File:** `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc`
`externalDependencies` default is documented as `none` (wrong per source); `outputHashing` is documented as `'none' | 'all'` but the real type also allows `'media'`/`'bundles'`.

### M-4 — `enforce-module-boundaries.mdoc` is missing the real `buildTargets` option
**File:** `technologies/eslint/eslint-plugin/Guides/enforce-module-boundaries.mdoc`
`packages/eslint-plugin/src/rules/enforce-module-boundaries.ts` defines `buildTargets: string[]` (default `['build']`), actively used to power the `enforceBuildableLibDependency` check — absent from the docs' options table.

### M-5 — `nuxt/introduction.mdoc` documents a `testTargetName` option that doesn't exist
**File:** `technologies/vue/nuxt/introduction.mdoc`
`NuxtPluginOptions` (`packages/nuxt/src/plugins/plugin.ts`) has no `testTargetName` — the plugin never infers a test task. Doc also omits the real `buildDepsTargetName`/`watchDepsTargetName`.

### M-6 — Module Federation library-versions guide imports from the wrong package
**File:** `technologies/module-federation/concepts/manage-library-versions-with-module-federation.mdoc`
Imports `ModuleFederationConfig` from `@nx/webpack`, which doesn't export it (zero matches repo-wide) — every sibling MF doc correctly imports it from `@nx/module-federation`.

### M-7 — Next.js plugin docs: wrong minimum version + undisclosed deprecated option
**File:** `technologies/react/next/introduction.mdoc`
States `next` floor as `>=15.0.0 <17.0.0`; actual (`packages/next/src/utils/versions.ts`, `assert-supported-next-version.ts`) is `>=14.0.0 <17.0.0`. Separately, `serveStaticTargetName` is listed as a normal option; source marks it `@deprecated Use startTargetName instead`.

### M-8 — React Native plugin docs missing two real options
**File:** `technologies/react/react-native/introduction.mdoc`
`ReactNativePluginOptions` (`packages/react-native/plugins/plugin.ts`) defines `syncDepsTargetName` and `upgradeTargetName`, both undocumented; the doc's own "Upgrade React Native" section describes manual steps for exactly what `upgradeTargetName`'s inferred target already automates.

### M-9 — Detox docs: copy-paste error calls Detox config files "ESLint configuration files"
**File:** `technologies/test-tools/detox/introduction.mdoc`
"The `@nx/detox` plugin will create a task for any project that has an ESLint configuration file present... `.detoxrc.js`, `.detoxrc.json`..." — source (`packages/detox/src/plugins/plugin.ts`) globs for Detox config files; nothing to do with ESLint.

### M-10 — Storybook docs list a removed framework option and two nonexistent generators
**Files:** `technologies/test-tools/storybook/introduction.mdoc`, `technologies/test-tools/storybook/Guides/best-practices.mdoc`
Lists `@storybook/vue-vite` as a valid `uiFramework` — removed from the schema (Storybook 8+ dropped Vue 2; only `@storybook/vue3-vite` remains). Both files also claim React Native and Nuxt have dedicated `storybook-configuration` generators; only Angular/React/Vue actually have one (verified via `Glob`).

### M-11 — Cypress component-testing floor is stale
**File:** `technologies/test-tools/cypress/Guides/cypress-component-testing.mdoc`
States "requires Cypress v10 and above"; actual `@nx/cypress` peer range is `>=13 <16` (matches the plugin's own requirements table elsewhere).

### M-12 — Node bundling guide pins an EOL build target
**File:** `technologies/node/Guides/bundling-node-projects.mdoc`
Vite config example: `target: 'node18'`. Node 18 has been EOL since April 2025.

### M-13 — Three guides pin CI examples to `actions/setup-node@v3` (recurring, still open)
**Files:** `guides/Adopting Nx/adding-to-existing-project.mdoc`, `guides/Adopting Nx/adding-to-monorepo.mdoc`, `guides/Nx Cloud/bring-your-own-compute.mdoc`
nx's own CI is pinned to `@v5.0.0` (verified directly in `.github/workflows/*.yml`). Flagged as M-2 in the 2026-06-29 audit too — still unfixed, and `@v3` is now 2 majors behind rather than 1.

### M-14 — `concepts/nx-daemon.mdoc`: two stale technical claims (recurring, partially still open)
**File:** `concepts/nx-daemon.mdoc`
(a) Says to set `useDaemonProcess: false` "in the runners options in nx.json" — moved to the nx.json root by the Nx 20 migration (`packages/nx/src/migrations/update-20-0-0/move-use-daemon-process.ts`). Flagged as M-15 in 2026-06-29. (b) Uses `nx affected:test` as example syntax — a hidden legacy alias (`describe: false`); canonical form is `nx affected -t test`. Flagged as L-9 in 2026-06-29.

### M-15 — `concepts/how-caching-works.mdoc` misstates the default cache-output fallback
**File:** `concepts/how-caching-works.mdoc`
Claims "If neither is defined, Nx defaults to caching `dist` and `build` at the root of the repository." Actual behavior (`packages/nx/src/tasks-runner/utils.ts:393-407`) only applies a fallback for `build`/`prepare` targets, using project-relative paths — other targets get `[]` (nothing cached).

---

## LOW Severity

### L-1 — `reference/Nx Cloud/custom-images.mdoc` pins an outdated Docker version
Dockerfile snippet copies `docker:24.0.2` binaries; Nx Cloud's own launch-template changelog (`launch-templates.mdoc`) already moved to Docker 28.3.1.

### L-2 — `technologies/angular/angular-rspack/introduction.mdoc` names the wrong package
Requirements section calls it `@angular-rspack/nx`; the real package (and every sibling doc in the same set) is `@nx/angular-rspack`.

---

## Needs Input

### NI-1 — `module-federation-and-nx.mdoc` points readers at the deprecated MF guides
**File:** `technologies/module-federation/concepts/module-federation-and-nx.mdoc`
Same root cause as H-1 but indirect (links out rather than demonstrating the deprecated generators itself) — bundle with H-1's fix or file separately, your call.

### NI-2 — `angular-rsbuild/introduction.mdoc` ssr option may be behind `angular-rspack`'s
Angular rsbuild's `ssr.experimentalPlatform` shape doesn't show the newer `platform` option that the sibling `angular-rspack` doc has. `@nx/angular-rsbuild` source lives outside this checkout, so this couldn't be directly verified.

### NI-3 — `reference/nx-json.mdoc` is missing several current, non-deprecated properties
`workspaceLayout`, `useDaemonProcess`, `useInferencePlugins`, `neverConnectToCloud`, `installation`, `pluginsConfig`, `defaultProject`, `cli` — all defined in `packages/nx/src/config/nx-json.ts`, none documented on the page. This is a coverage gap more than "staleness" — worth a docs team call on whether it's in scope for this audit's issues or a separate backlog item.

### NI-4 — `reference/project-configuration.mdoc` missing `release.version` and `defaultConfiguration` docs
Both are real, current `ProjectConfiguration`/`TargetConfiguration` fields with no documentation on the page.

### NI-5 — `guides/Tips-n-Tricks/standalone-to-monorepo.mdoc` only covers legacy ESLint config files
Root-vs-project file table lists `.eslintrc.json`/`.eslintrc.base.json`/`.eslintignore` but not flat config (`eslint.config.mjs`), which `@nx/eslint:init` now defaults to.

### NI-6 — `guides/Tips-n-Tricks/browser-support.mdoc` claims a `.browserslistrc` is generated by default
Couldn't find any current application generator template that produces this file — may be describing removed behavior.

### NI-7 — `reference/Nx Cloud/launch-template-examples.mdoc` uses Node 21 (non-LTS, EOL) as its "custom node version" example
Same class of issue as the 2026-06-29 H-12 finding for this file — appears not to have been fixed.

---

## Linear Issues to Create (queued — MCP unavailable, 5th consecutive audit)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**, assignee **Linear agent** if available (else unassigned):

| # | Title | Severity | Files |
|---|---|---|---|
| 1 | Module Federation guides (Angular + React + generic) teach generators removed in Nx v24 with no deprecation notice | High | 8 |
| 2 | Doc-gen script drops `x-deprecated` schema annotations site-wide — fix `generate-plugin-markdown.ts` | High | systemic (2+ confirmed) |
| 3 | extending-nx guides teach deprecated `createNodesV2` as the primary plugin API | High | 2 |
| 4 | Angular tutorial's `--unitTestRunner=vitest` is an invalid generator value | High | 1 |
| 5 | Jest docs teach a non-existent `--testFile` CLI flag | High | 1 |
| 6 | `releases.mdoc` supported-versions table is stale (v22 shown as Current, v23 missing) | High | 1 |
| 7 | `nx-json.mdoc`/`environment-variables.mdoc` document wrong Nx Cloud encryption-key property name | High | 2 |
| 8 | Fix or archive `publish-rust-crates.mdoc` — recommends a dead config flag (open since ≥3 audits) | High | 1 |
| 9 | `nx-json.mdoc`: remove non-existent root properties (`captureStderr`, `skipNxCache`, `selectivelyHashTsConfig`) | Medium | 1 |
| 10 | `nx-json.mdoc`: add missing `tui.suppressHints` option | Medium | 1 |
| 11 | `webpack-plugins.mdoc`: fix `externalDependencies` default and `outputHashing` enum | Medium | 1 |
| 12 | `enforce-module-boundaries.mdoc`: document missing `buildTargets` option | Medium | 1 |
| 13 | `nuxt/introduction.mdoc`: remove non-existent `testTargetName` option | Medium | 1 |
| 14 | Fix wrong `ModuleFederationConfig` import path (`@nx/webpack` → `@nx/module-federation`) | Medium | 1 |
| 15 | Next.js docs: fix minimum version (14.0.0 not 15.0.0) and flag `serveStaticTargetName` as deprecated | Medium | 1 |
| 16 | React Native docs: document `syncDepsTargetName`/`upgradeTargetName` | Medium | 1 |
| 17 | Detox docs: fix "ESLint configuration file" copy-paste error | Medium | 1 |
| 18 | Storybook docs: remove `@storybook/vue-vite`, remove nonexistent react-native/nuxt generator claims | Medium | 2 |
| 19 | Cypress component-testing floor: update v10 → v13 | Medium | 1 |
| 20 | Node bundling guide: update EOL `target: 'node18'` | Medium | 1 |
| 21 | Update `actions/setup-node@v3` → current major across 3 CI guides (recurring, still open) | Medium | 3 |
| 22 | `nx-daemon.mdoc`: fix `useDaemonProcess` location + legacy `affected:test` syntax (recurring, partially open) | Medium | 1 |
| 23 | `how-caching-works.mdoc`: fix incorrect default cache-output claim | Medium | 1 |
| 24 | `custom-images.mdoc`: update pinned Docker version | Low | 1 |
| 25 | `angular-rspack/introduction.mdoc`: fix wrong package name | Low | 1 |

---

## Agent Instructions — Preventing False Positives (unchanged from 2026-06-29, still holding up)

See the top-level [README.md](./README.md) for the verification rules. This run followed them: baseline versions were pulled from the live repo (`package.json`, in-repo docs describing already-shipped Nx-23 changes) rather than training-data assumptions, and the GitHub Actions claim was independently checked against `nrwl/nx`'s own `.github/workflows/*.yml` before inclusion. No baseline-related false positives are expected this round, unlike 2026-06-29.
