# Nx Astro Docs Staleness Audit — 2026-07-11

**Scope:** Full sweep of all 511 `.mdoc` files under `astro-docs/src/content/docs/` — the first exhaustive re-sweep since [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md). Ran as ~25 parallel section-owner agents (one per technology/guide subdirectory), each cross-checking doc claims against the live source in `packages/` rather than training-data assumptions, per this folder's verification rules.

**Verified baseline (from live repo, not training data):**
- Current Nx: **23.0.2** (latest git tag `23.0.2`; previous major topped out at `22.7.7`)
- Node.js: **24.x** current active LTS, **22.x** maintenance LTS, **20.x EOL as of April 2026** (already past, per today's date), 18.x long EOL
- React: `^18||^19` still supported; Next.js `>=14.0.0 <17.0.0` per source (docs table wrongly states `>=15`, see finding below)

**Linear MCP still unavailable — 7th consecutive audit cycle.** See escalation note at the bottom. All issues below are queued for manual creation.

---

## Summary

| Category | Confirmed (high/medium confidence) | Needs Input |
|---|---|---|
| Old Nx version presented as current | 9 | 5 |
| Old Node/npm/package version presented as current | 4 | 3 |
| Deprecated executor/generator/API presented as current | 13 (spanning ~35 files) | 2 |
| CLI/config/feature drift vs. source | 15 | 6 |
| **Total** | **41 grouped findings** (~90+ individual file instances) | **16** |

This cycle's agents independently re-surfaced several items already in the running backlog (module-federation import bug, `compose-executors.mdoc`, `publish-rust-crates.mdoc`, `terminal-ui.mdoc`, Node-18 in `bundling-node-projects.mdoc`, Storybook deprecated test packages) — those are marked **(re-verified, still open — prior #N)** below, cross-referencing the [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) numbering. Everything else is new.

---

## Confirmed Findings

### Group A — Deprecated executors/generators/APIs documented as current, no warning

This is the largest and highest-value cluster: many pages teach an executor, generator, or devkit API that source code has already marked `x-deprecated` / `@deprecated`, with a stated removal in **Nx v24** (one release away) — with zero warning to the reader.

**A-1. Angular & React Module Federation generators (`host`, `remote`, `federate-module`, `setup-mf`) — deprecated, removed in Nx v24; Angular MF "no longer supported."**
Verified: `packages/react/generators.json` and `packages/angular/generators.json` both mark these `x-deprecated`, with Angular's note reading *"Angular Module Federation in Nx is no longer supported... Removed in Nx v24."* The replacement (`@nx/react:consumer`/`provider`, see `technologies/module-federation/consumer-and-provider.mdoc`) exists but the entire rest of the Module Federation guide tree still teaches the old generators as first-class, unqualified:
- `technologies/angular/Guides/dynamic-module-federation-with-angular.mdoc`
- `technologies/angular/Guides/module-federation-with-ssr.mdoc` (React tab too — `@nx/react:host` also deprecated)
- `technologies/angular/introduction.mdoc` ("Set up Module Federation" section)
- `technologies/module-federation/Guides/create-a-host.mdoc`
- `technologies/module-federation/Guides/create-a-remote.mdoc` (also wrongly says the serve target uses webpack-dev-server; the generator's actual default bundler is rspack)
- `technologies/module-federation/Guides/federate-a-module.mdoc`
- `technologies/module-federation/Guides/nx-module-federation-plugin.mdoc`
- `technologies/module-federation/concepts/module-federation-and-nx.mdoc`
- `technologies/module-federation/concepts/nx-module-federation-technical-overview.mdoc`
- `technologies/module-federation/concepts/faster-builds-with-module-federation.mdoc`
- `technologies/module-federation/concepts/manage-library-versions-with-module-federation.mdoc`
- `technologies/module-federation/concepts/micro-frontend-architecture.mdoc`
- `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc` and `webpack-config-setup.mdoc`

Confidence: high.

**A-2. `@nx/vitest:test` executor deprecated (removed in v24), presented as the current end-state in two migration guides.**
Verified `packages/vitest/src/executors/test/schema.json`: `x-deprecated` pointing at `nx g @nx/vitest:convert-to-inferred`.
- `technologies/test-tools/vitest/Guides/migrating-from-nx-vite.mdoc`
- `technologies/test-tools/vitest/Guides/testing-without-building-dependencies.mdoc`
Confidence: high.

**A-3. `@nx/eslint:lint` executor deprecated (removed in v24), presented as current manual-setup instructions.**
Verified `packages/eslint/src/executors/lint/schema.json`. File: `technologies/eslint/eslint-plugin/Guides/dependency-checks.mdoc`. Confidence: high.
Same directory also missing the real `buildTargets` option from the `enforce-module-boundaries.mdoc` options table (present in `packages/eslint-plugin/src/rules/enforce-module-boundaries.ts`, and already documented correctly in the sibling `dependency-checks.mdoc`).

**A-4. `@nx/cypress:cypress` executor deprecated (removed in v24), presented as a valid current alternative.**
Verified `packages/cypress/src/executors/cypress/schema.json`. Files: `technologies/test-tools/cypress/introduction.mdoc`, `Guides/cypress-component-testing.mdoc`. (Jest/Playwright docs correctly avoid naming their equally-deprecated executors — no issue there.) Confidence: high.

**A-5. `createNodesV2`/`CreateNodesV2`/`NxPluginV2` deprecated types taught as the primary/recommended pattern across `extending-nx/`.**
Verified `packages/nx/src/project-graph/plugins/public-api.ts`: `CreateNodesV2` is `@deprecated - use CreateNodes instead`, `CreateNodesContextV2` is `@deprecated - removed in Nx 24`, `NxPluginV2` is `@deprecated - see NxPlugin`.
- `extending-nx/project-graph-plugins.mdoc` — primary "how to add nodes" guide defaults to `createNodesV2`; also uses a `CandidateDependency` type that **does not exist anywhere in source** (repo-wide grep confirms), and a `dependencyType` field name that should be `type` (per `StaticDependency`/`DynamicDependency`/`ImplicitDependency` in `project-graph-builder.ts`) — every dependency example in the file is wrong.
- `extending-nx/tooling-plugin.mdoc` — the "build a plugin from scratch" tutorial types its example as `CreateNodesV2` instead of `CreateNodes`.
- `extending-nx/createnodes-compatibility.mdoc` — labels the deprecated `CreateNodesV2`/`CreateNodesContextV2` combo as the "recommended pattern," and frames the (already-shipped) v23 deprecation as a "future deprecation timeline."
- `concepts/inferred-tasks.mdoc` — presents `createNodesV2` as an equally-current option alongside `createNodes`.
Confidence: high.

**A-6. `extending-nx` devkit code examples don't compile against current API signatures.**
- `extending-nx/compose-executors.mdoc` **(re-verified, still open — prior #4)**: uses `"builder"` in `project.json` (field doesn't exist; should be `"executor"`); calls `parseTargetString(opts.devServerTarget)` with one arg (current signature requires a second `context`/`projectGraph` arg).
- `extending-nx/composing-generators.mdoc` and `extending-nx/local-generators.mdoc`: call `libraryGenerator(tree, { name: schema.name })`, omitting the now-required `directory` field on `LibraryGeneratorSchema`.
- `extending-nx/migration-generators.mdoc` **(related to prior #5, different specific bug)**: example `migrations.json` entry includes a `"cli": "nx"` field that doesn't exist on `MigrationsJsonEntry` and that the real `@nx/plugin:migration` generator never writes.
Confidence: high on all four.

---

### Group B — CLI reference errors (verified against `packages/nx/src/command-line/`)

**B-1. `nx show target --inputs --outputs` is not a real flag — it's two positional subcommands.**
Verified `packages/nx/src/command-line/show/command-object.ts`: the correct forms are `nx show target inputs <project>:<target>` / `nx show target outputs <project>:<target>`. The wrong `--inputs`/`--outputs` flag syntax appears, gated behind an inaccurate "Nx 22.6+ Required" aside, in **two independent files**:
- `features/CI Features/sandboxing.mdoc`
- `guides/Adopting Nx/from-turborepo.mdoc`
Confidence: high — running the documented command fails.

**B-2. `guides/Nx Cloud/setup-ci.mdoc` uses `--ci=azure-pipelines`; the real enum value is `azure`.**
Verified `packages/workspace/src/generators/ci-workflow/schema.json` (`enum: [github, circleci, azure, bitbucket-pipelines, gitlab]`) and `ci-workflow.ts`. The other four provider values in the same doc are correct — only Azure is wrong. Confidence: high.

**B-3. `reference/nx-json.mdoc` "Task options" table lists properties that don't exist at nx.json root.**
`captureStderr`, `skipNxCache`, `encryptionKey`, `selectivelyHashTsConfig` are shown as settable at nx.json root; only `parallel`/`cacheDirectory` actually are (per `packages/nx/src/config/nx-json.ts`/`nx-schema.json`). The other three only exist nested under the deprecated `tasksRunnerOptions.<name>.options`, and `selectivelyHashTsConfig` isn't in the schema at all. `encryptionKey` should be `nxCloudEncryptionKey`. Confidence: high.

**B-4. `reference/environment-variables.mdoc` documents `NX_RUNNER`, which current source never reads.**
Grep of `packages/nx/src` shows only `NX_TASKS_RUNNER` is consumed (`command-line-utils.ts`); `NX_RUNNER` appears only in test fixtures. Confidence: high.

**B-5. `reference/nx-cloud-cli.mdoc` — several problems in one file:**
- A `{% tabitem label="Nx >= 14.7" %}` section teaches `--dte`/`--no-dte` flags — ~9 majors stale, pre-dating the current `--agents` terminology entirely.
- Four real, current `nx-cloud` subcommands (`record`, `fix-ci`, `apply-locally`, `download-cloud-client` — confirmed live in `packages/nx/src/command-line/nx-cloud/*/command-object.ts`) are **entirely undocumented** on this page; their `describe` strings link to a dead `/ci/reference/nx-cloud-cli#...` path prefix that doesn't exist in the current `/docs/` site structure, indicating these sections were dropped during a docs-site migration and never restored.
Confidence: high.

**B-6. `reference/releases.mdoc` "Supported Versions" table is out of date.**
Shows v22 as "Current" and v21/v20 as "LTS," with **v23 absent entirely**. By the page's own stated policy (prior major → LTS for 12 months), v20's LTS window (since 2025-05-05) should have ended 2026-05-05 — over two months before today. Confidence: high.

**B-7. `reference/Deprecated/*` pages describe already-completed removals in future tense.**
- `as-provided-vs-derived.mdoc`: "Nx will only use the new behavior in Nx version 20" — confirmed via grep that `--projectNameAndRootFormat`/`--nameAndDirectoryFormat` are fully gone from `packages/nx/src` and `packages/devkit`.
- `legacy-cache.mdoc`: "In Nx 21, the legacy file system cache will be removed" — confirmed removed via `packages/nx/src/migrations/update-21-0-0/remove-legacy-cache.ts`.
- `v1-nx-plugin-api.mdoc` **(re-verified, still open — prior #10)**: "will be removed in Nx 20."
- `global-implicit-dependencies.mdoc` — the **inverse** problem: states "will be removed in v17," but `implicitDependencies` is still present in `packages/nx/src/config/nx-json.ts` today (marked `@deprecated`, not removed) — the doc's own claim is contradicted by current code.
Confidence: high (four separate pages, same root cause — worth one issue with a shared fix pattern).

**B-8. `reference/Nx Cloud/custom-images.mdoc` Dockerfile snippet pins a stale Docker base image.**
`COPY --from=docker:24.0.2 ...` in the "manual setup" section, while `launch-templates.mdoc` documents that the *default* image already upgraded from Docker 24.0.2 → 28.3.1. The manual-setup instructions never got the same update. Confidence: medium-high.

---

### Group C — Nx Release doc bugs

**C-1. `guides/Nx Release/configure-changelog-format.mdoc`: custom `ChangelogRenderer` example is broken on two counts.**
`import { ChangelogRenderer, ChangelogRenderOptions } from '@nx/js/release';` — `@nx/js` exports no such thing; the real class is a **default export** from `nx/release/changelog-renderer` (confirmed via `packages/nx/src/config/nx-json.ts` and `packages/nx/release/changelog-renderer/index.ts`). The example also overrides a `renderMarkdown()` method that doesn't exist — the real base class only has `render()`. Confidence: high.

**C-2. `guides/Nx Release/publish-rust-crates.mdoc` self-contradicts** **(re-verified, still open — prior #7)**.
States "In Nx v22, the legacy versioning implementation has been removed entirely," then instructs the reader to set `"useLegacyVersioning": true` as if it still works. `packages/nx/src/command-line/release/config/use-legacy-versioning.ts` confirms it's now a non-functional compat shim (`@deprecated Compat shim for @nx/js@21`). Confidence: high — whole recipe needs a rewrite or an archive notice.

---

### Group D — Vite/Vitest split fallout (Nx 22.2/23.0 moved Vitest out of `@nx/vite`)

Verified against `packages/vite/src/migrations/update-23-0-0/ensure-vitest-package-migration.md`, `packages/vite/src/plugins/plugin.ts` (no `testTargetName` anymore), and `packages/vitest/src/plugins/plugin.ts` (where it now lives).

**D-1. `guides/Tasks & Caching/convert-to-inferred.mdoc`: Atomizer-supporting plugin list omits `@nx/vitest`.**
`packages/vitest/src/plugins/plugin.ts` has an explicit `/** Atomizer for vitest */` `ciTargetName` option; the doc's list (cypress/jest/gradle/playwright) doesn't mention it. Confidence: high.

**D-2. `getting-started/Tutorials/reducing-configuration-boilerplate.mdoc`: three separate stale claims from the same root cause.**
- `nx.json` example still shows `"testTargetName": "test"` under `@nx/vite/plugin` options — that field no longer exists there.
- Claims `nx add @nx/vite` creates `build`/`test`/`serve` tasks — the vite init generator never registers a `test` target.
- `project_details` JSON sample attributes the `test` target's `sourceMap` to `vite.config.ts`/`@nx/vite/plugin` — it's `@nx/vitest` now.
Confidence: high.

**D-3. `getting-started/Tutorials/understanding-your-workspace.mdoc`: same stale `sourceMap` attribution for the `test` target.**
Confidence: high.

**D-4. `getting-started/Tutorials/angular-monorepo-tutorial.mdoc`: `--unitTestRunner=vitest` is not a valid enum value.**
`packages/angular/src/generators/library/schema.json` enum is `["vitest-angular", "vitest-analog", "jest", "none"]` — plain `"vitest"` isn't accepted; this command fails schema validation as written. Confidence: high.

---

### Group E — Framework ecosystem plugin-option drift (React/Vue/Node families)

All verified against each plugin's `*PluginOptions` interface / `normalizeOptions()` in `packages/*/src/plugins/plugin.ts`.

- **`technologies/vue/nuxt/introduction.mdoc`**: documents a `testTargetName` option that doesn't exist on `NuxtPluginOptions` — the plugin creates no inferred `test` target at all. High confidence.
- **`technologies/react/next/introduction.mdoc`**: (a) lists `serveStaticTargetName` as a normal current option; it's actually `@deprecated Use startTargetName instead`. (b) Requirements table states Next.js `>=15.0.0 <17.0.0`; source (`minSupportedNextVersion`/`packages/next/package.json`) supports `>=14.0.0`. High confidence on both.
- **`technologies/react/expo/introduction.mdoc`**: Requirements table caps at `^55.0.0`; source (`packages/expo/src/utils/version-utils.ts`) already defaults new installs to Expo v56. High confidence.
- **`technologies/react/react-native/introduction.mdoc`**: plugin-options table omits `syncDepsTargetName` and `upgradeTargetName`, both real, wired-in options on `ReactNativePluginOptions`. High confidence.
- **`technologies/react/remix/introduction.mdoc`**: plugin-options table omits `serveStaticTargetName`, which backs a real, actively-created `serve-static` inferred target. High confidence.
- **`technologies/react/Guides/adding-assets-react.mdoc`**: says SVGR "will be removed in Nx 23" for Rspack — current version is 23.0.2 and `packages/rspack/src/migrations/update-23-0-0/add-svgr-to-rspack-config.md` confirms it **already happened**. Future tense should be past tense. Medium confidence.
- **`technologies/node/Guides/bundling-node-projects.mdoc`** **(re-verified, still open — prior #16, plus one new bug in the same file)**: (a) Vite bundling example uses `target: 'node18'` (EOL). (b) esbuild `external: ["^[^./].*$", "!@my-org/utils"]` example uses regex/negation syntax that `packages/esbuild/src/executors/esbuild/schema.json` and the real esbuild passthrough don't support — only `*`-glob strings work, and there's no `!`-negation mechanism (that's what the separate `excludeFromExternal` option is for). High confidence on both.

---

### Group F — Build-tools bugs

- **`technologies/build-tools/webpack/Guides/webpack-plugins.mdoc`**: (a) states `externalDependencies` default is `'none'`; source (`apply-base-config.ts`, `nx-app-webpack-plugin-options.ts`) confirms default is `'all'` — doc has it backwards. (b) Lists `deleteOutputPath` as merely "deprecated, use `output.clean`"; it was actually **fully removed** in the 22.0.0 migration (`remove-deprecated-options.ts` strips it from configs). High confidence on both.
- **`technologies/module-federation/concepts/manage-library-versions-with-module-federation.mdoc`** **(re-verified, still open — prior #19)**: imports `ModuleFederationConfig` from `@nx/webpack`; it's exported from `@nx/module-federation` (confirmed by grep — zero exports of that name anywhere in `@nx/webpack`). High confidence.
- **`technologies/build-tools/vite/Guides/configure-vite.mdoc`** (needs input, see below): Vitest config examples set `test.cache.dir`, an option removed from Vitest since 1.0 in favor of top-level `cacheDir`. No Vitest install present in this repo to directly confirm against Vitest's own types, but no current Nx-generated code anywhere uses the old pattern either. Medium confidence.

---

### Group G — Storybook: deprecated companion packages taught as current

**(re-verified, still open — prior #13)**, expanded with new files this cycle. Verified against `packages/storybook/src/migrations/update-21-2-0/remove-addon-dependencies.ts` ("Removed deprecated Storybook addon dependencies... no longer needed in Storybook 9+") and current generator templates, which only ever emit `import { expect } from 'storybook/test'`.

- `technologies/test-tools/storybook/Guides/storybook-interaction-tests.mdoc` — claims `--interactionTests=true` installs `@storybook/addon-interactions`, `@storybook/testing-library`, `@storybook/jest`; the generator installs none of these.
- `Guides/overview-angular.mdoc` and `Guides/overview-react.mdoc` — example story files import from `@storybook/testing-library`/`@storybook/jest`; actual generator output imports only from `storybook/test`.
- `Guides/configuring-storybook.mdoc` — claims all generated `main.ts` files contain `@storybook/addon-essentials`; current v9/v10 templates don't include it at all.
- Several more files show illustrative `addons: [...]` arrays containing `@storybook/addon-essentials`/`@storybook/addon-interactions` as if still current: `one-storybook-per-scope.mdoc`, `angular-storybook-compodoc.mdoc`, `angular-configuring-styles.mdoc`, `one-storybook-for-all.mdoc`, `storybook-composition-setup.mdoc`, `one-storybook-with-composition.mdoc`, `introduction.mdoc`.

High confidence on the first three; medium on the illustrative-snippet group (teaches a now-actively-removed pattern, lower materiality since it's not "generator output" framing).

---

### Group H — Single-file bugs (each independently verified, high confidence)

| File | Bug |
|---|---|
| `troubleshooting/troubleshoot-convert-to-inferred.mdoc` | Wrong executor name `@nx/storybook:build-storybook` — the registered executor is `@nx/storybook:build` (`packages/storybook/executors.json`); `build-storybook` is only the conventional *target name*. |
| `guides/Tasks & Caching/terminal-ui.mdoc` | **(re-verified, still open — prior #8)** "The initial Nx 21 release disables the Terminal UI on Windows... currently working on Windows support" — `packages/nx/src/tasks-runner/is-tui-enabled.ts` has real Windows-capability detection logic today; support already shipped. |
| `guides/Nx Console/console-nx-cloud.mdoc` | "This feature is only available in VSCode but coming soon to JetBrains" — directly contradicted by `reference/nx-console-settings.mdoc`, which documents the shipped JetBrains-specific `nxCloudNotifications` setting UI. |
| `guides/Nx Cloud/record-commands.mdoc` | Gates the (now ubiquitous, long-standing) `nx record --` feature behind "Nx Cloud 13.3 and above" — a defunct version-numbering scheme predating Nx Cloud's current calendar-based versions (per `reference/Nx Cloud/release-notes.mdoc`). |
| `guides/Tips-n-Tricks/yarn-pnp.mdoc` | Shows `yarn set version stable` producing `"packageManager": "yarn@3.6.1"` — Yarn Berry's stable line is now 4.x. |
| `guides/Adopting Nx/adding-to-monorepo.mdoc` | "Lerna v6 is powering Nx underneath" — Lerna is at major 9 now. Same file (+ `adding-to-existing-project.mdoc`) also shows a sample CI workflow that no longer matches the real `ci-workflow` generator output: `actions/setup-node@v3`/`node-version: 22` in the doc vs. the generator's actual `@v4`/`node-version: 20` template, and the doc's excerpt omits the generator's `nx fix-ci` step entirely. |
| `getting-started/Tutorials/crafting-your-workspace.mdoc` | "Recommended setup" `tsconfig.base.json` shows `target: ES2020` + universal `moduleResolution: nodenext`; the actual current template (`packages/js/src/generators/init/files/ts-solution/tsconfig.base.json__tmpl__`) defaults to `es2022` with conditional (not universal) module resolution. |
| `technologies/angular/introduction.mdoc` | States defaults are "Jest for unit tests, Cypress for e2e tests" for `@nx/angular:app`/`:lib`; for Angular ≥21 (the norm now, since the plugin floor is Angular ≥20) the actual defaults are Vitest (`vitest-angular`/`vitest-analog`) and Playwright — Jest/Cypress are only the fallback for old Angular. |

---

## Needs Input

1. **Version-footnote policy** (recurring theme, unchanged from prior audits — NI-2/NI-3 in [07-10](./nx-astro-docs-staleness-2026-07-10.md)): many pages carry accurate-but-very-old "as of Nx X.Y" attributions (`concepts/inferred-tasks.mdoc` "Nx 18", `guides/Tips-n-Tricks/include-all-packagejson.mdoc` "Nx 15.0.11", `technologies/module-federation/concepts/module-federation-and-nx.mdoc` "Nx 19.5", `troubleshooting/troubleshoot-nx-install-issues.mdoc`'s dead Nx 15.8–16.4 bug section). None are factually wrong, but they read as stale. Needs a docs-team policy call: prune once a feature has been default for 3+ majors, or keep for historical clarity?
2. **`technologies/build-tools/vite/Guides/configure-vite.mdoc`** — `test.cache.dir` Vitest option (see Group F) — couldn't fully verify without a Vitest install in this repo; worth a maintainer with Vitest tooling double-checking.
3. **`guides/Enforce Module Boundaries/tags-allow-list.mdoc`** — "project configuration" phrasing for the `allow` option is ambiguous (it's an ESLint-config option, not `project.json`); could be misread. Low confidence, wording nit.
4. **`technologies/eslint/Guides/custom-workspace-rules.mdoc`** — two TODO comments gate a "Quick Start with the Generator" section on "once `@nx/eslint:workspace-rule` supports ESLint v9," but the generator already requires ESLint ≥9 (whole package floor is v9+) — the gating condition looks already satisfied. Editorial call on whether to un-gate the content.
5. **`guides/Installation/update-global-installation.mdoc`** — `yarn dlx list nx` doesn't read as a standard Yarn Berry command (`dlx` executes, it doesn't list). Couldn't verify against Yarn's own docs from this repo.
6. **`reference/Nx Cloud/release-notes.mdoc`** — most recent entry is `2026.01`, a 6-month gap versus today given a previously ~monthly cadence. Might just be an unmaintained page, might be a real gap — worth a maintainer check.
7. **`reference/Nx Cloud/launch-template-examples.mdoc`** — Node 21 (never LTS, long EOL) used repeatedly as the "custom node version" example, inconsistent with Node 22 used later in the same file. **(carried forward, still open — prior NI-5)**
8. Several closed-source-boundary items carried forward unchanged from [07-10](./nx-astro-docs-staleness-2026-07-10.md) NI-6/NI-7/NI-8 (`nx-mcp.mdoc` flags, Nx Cloud CLI flags, some `NX_CLOUD_*`/`NX_AGENT_*` env vars) — can't verify without the closed-source `nx-cloud`/`nx-mcp` packages.
9. `reference/Owners/overview.mdoc` — not a staleness issue but a content bug: prose text appears merged directly into a JSON `"description"` string in a code sample. Flagging for docs-team awareness.
10. `technologies/angular/angular-rsbuild/*` (3 files) — `@nx/angular-rsbuild` package doesn't exist anywhere in this repo (unlike `@nx/angular-rspack`, which does) — likely published from an external repo not vendored here. Can't verify the documented `PluginAngularOptions`/`createConfig`/`createServer` API or the `@rsbuild/core ^1.1.0` peer range (which also disagrees with the `>=1.0.5 <2.0.0` range stated for the sibling `angular-rspack-compiler` package).

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Group into issues for the **Docs** team, status **Triage**, label **"Good for AI agents"**, assignee: **Linear agent if available, else unassigned**.

Carrying forward the full 27-item backlog from [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md)/[2026-07-10](./nx-astro-docs-staleness-2026-07-10.md) unchanged (items 1–27 below), with re-verified items marked, plus **28 new grouped issues** from this cycle's full sweep (items 28–55).

| # | Title | Severity | Files |
|---|---|---|---|
| 1 | Fix compatibility tables: Nx version labeled as (current) incorrectly in node/nest/typescript introductions | High | 3 files |
| 2 | Remove/gate version-ahead content in consumer-and-provider.mdoc and migrating-from-nx-vite.mdoc | High | 2 files |
| 3 | Fix Angular Rspack getting-started: workspace-creation version in sample output | High | 1 file |
| 4 | Fix compose-executors.mdoc: "builder"→"executor", cypress.json→cypress.config.ts (**re-verified this cycle, +new parseTargetString signature bug**) | High | 1 file |
| 5 | Fix migration-generators.mdoc: remove non-existent `--project` flag (**+new: also has a fabricated `"cli"` field in its migrations.json example**) | High | 1 file |
| 6 | Fix GitHub Actions versions: nonexistent action majors (self-healing-ci, use-bun) | High | 2 files |
| 7 | Archive or fix publish-rust-crates.mdoc: broken/self-contradictory (**re-verified this cycle**) | High | 1 file |
| 8 | Update terminal-ui.mdoc: remove stale Windows TUI "currently working on" notice (**re-verified this cycle**) | High | 1 file |
| 9 | Add Node 20 EOL notices to Nx Cloud launch templates and examples | High | 2 files |
| 10 | Update reference/Deprecated files: future tense → past tense for Nx 20/21 milestones (**re-verified + 2 new pages this cycle: legacy-cache.mdoc, global-implicit-dependencies.mdoc**) | High | 5 files |
| 11 | Update version-ahead deprecation callouts across build tools and framework guides | Medium | 5 files |
| 12 | Update GitHub Actions versions to current majors across CI guides | Medium | 5+ files |
| 13 | Replace deprecated @storybook/testing-library and @storybook/jest with storybook/test (**re-verified + 4 new files this cycle**) | Medium | 7 files |
| 14 | Fix Storybook angular-configuring-styles: remove webpack5 builder and React-specific options | Medium | 1 file |
| 15 | Fix Storybook best-practices: update stale Storybook URLs and old blog link | Medium | 1 file |
| 16 | Update bundling-node-projects.mdoc: bump EOL `target: 'node18'` (**re-verified + new esbuild `external` regex/negation bug in same file**) | Medium | 1 file |
| 17 | Fix setup-incremental-builds-angular.mdoc: @angular/build:browser is not a real executor | Medium | 1 file |
| 18 | Fix use-environment-variables-in-angular.mdoc: add deprecation note for @angular-devkit/build-angular:browser | Medium | 1 file |
| 19 | Fix manage-library-versions-with-module-federation.mdoc: import from @nx/module-federation not @nx/webpack (**re-verified this cycle**) | Medium | 1 file |
| 20 | Update module-federation-and-nx.mdoc: remove "As of Nx 19.5" framing | Medium | 1 file |
| 21 | Fix react-compiler.mdoc: React Compiler is no longer experimental in React 19 | Medium | 1 file |
| 22 | Fix nx-daemon.mdoc: useDaemonProcess is top-level in nx.json, not in runners options | Medium | 1 file |
| 23 | Fix Nx Cloud config.mdoc: update stale version-tab labels | Medium | 1 file |
| 24 | Fix access-tokens.mdoc: remove "authentication is changing" stale aside | Medium | 1 file |
| 25 | Fix Storybook guide URLs: update old framework-prefixed doc paths | Low | 6 files |
| 26 | Clean up low-value version qualifiers: old "since version X" notes in current docs | Low | 8+ files |
| 27 | Fix react/introduction.mdoc `--bundler` option list: conflates app vs. library enums, missing rsbuild, wrongly includes rollup for apps | Medium | 1 file |
| **28** | **Angular & React Module Federation guide tree teaches deprecated `host`/`remote`/`federate-module` generators (removed in Nx v24); Angular MF is "no longer supported"** | **High** | **13 files (Group A-1)** |
| **29** | **`@nx/vitest:test` executor deprecated (removed v24), presented as current end-state in Vitest migration guides** | **High** | **2 files (Group A-2)** |
| **30** | **`@nx/eslint:lint` executor deprecated, presented as current manual setup; also fix missing `buildTargets` option in enforce-module-boundaries.mdoc** | **High** | **2 files (Group A-3)** |
| **31** | **`@nx/cypress:cypress` executor deprecated, presented as valid current alternative in Cypress docs** | **High** | **2 files (Group A-4)** |
| **32** | **`createNodesV2`/`CreateNodesV2`/`NxPluginV2` (all deprecated, removed v24) taught as the primary pattern across extending-nx/; `CandidateDependency` type doesn't exist, wrong `dependencyType` field name (should be `type`)** | **High** | **4 files (Group A-5)** |
| **33** | **extending-nx devkit code examples don't compile: missing required `directory` arg to libraryGenerator (2 files); nonexistent `"cli"` field in migration example (dup of #5)** | **High** | **2 files (Group A-6, minus #5)** |
| **34** | **`nx show target --inputs --outputs` flag doesn't exist — should be positional subcommands `nx show target inputs/outputs`** | **High** | **2 files (Group B-1: sandboxing.mdoc, from-turborepo.mdoc)** |
| **35** | **guides/Nx Cloud/setup-ci.mdoc: `--ci=azure-pipelines` should be `--ci=azure`** | **High** | **1 file (Group B-2)** |
| **36** | **reference/nx-json.mdoc: task-options table lists nonexistent root-level properties (captureStderr, skipNxCache, encryptionKey, selectivelyHashTsConfig); encryptionKey should be nxCloudEncryptionKey** | **High** | **1 file (Group B-3)** |
| **37** | **reference/environment-variables.mdoc: NX_RUNNER documented but never read by current source** | **Medium** | **1 file (Group B-4)** |
| **38** | **reference/nx-cloud-cli.mdoc: remove dead Nx>=14.7 `--dte` section; document missing real subcommands (record/fix-ci/apply-locally/download-cloud-client); fix broken /ci/ cross-reference links** | **High** | **1 file (Group B-5)** |
| **39** | **reference/releases.mdoc: Supported Versions table missing v23, wrong LTS status for v20/v21/v22** | **High** | **1 file (Group B-6)** |
| **40** | **reference/Nx Cloud/custom-images.mdoc: manual-setup Dockerfile pins stale Docker 24.0.2 (default image already upgraded to 28.3.1)** | **Medium** | **1 file (Group B-8)** |
| **41** | **guides/Nx Release/configure-changelog-format.mdoc: custom ChangelogRenderer example is broken (wrong import path, nonexistent renderMarkdown method)** | **High** | **1 file (Group C-1)** |
| **42** | **guides/Tasks & Caching/convert-to-inferred.mdoc: Atomizer-supporting plugin list omits @nx/vitest** | **Medium** | **1 file (Group D-1)** |
| **43** | **Vite/Vitest split fallout in getting-started tutorials: stale testTargetName under @nx/vite/plugin, wrong claim that `nx add @nx/vite` creates a test target, wrong sourceMap attribution for test target** | **High** | **2 files (Group D-2, D-3)** |
| **44** | **angular-monorepo-tutorial.mdoc: `--unitTestRunner=vitest` is an invalid enum value (should be vitest-angular/vitest-analog)** | **High** | **1 file (Group D-4)** |
| **45** | **technologies/vue/nuxt/introduction.mdoc: documents nonexistent `testTargetName` plugin option** | **Medium** | **1 file (Group E)** |
| **46** | **technologies/react/next/introduction.mdoc: serveStaticTargetName shown as current (actually deprecated); Next.js version floor wrong (docs say >=15, source supports >=14)** | **Medium** | **1 file (Group E)** |
| **47** | **technologies/react/expo/introduction.mdoc: Requirements table missing already-default Expo v56 support** | **Medium** | **1 file (Group E)** |
| **48** | **technologies/react/react-native/introduction.mdoc: plugin options table missing syncDepsTargetName and upgradeTargetName** | **Medium** | **1 file (Group E)** |
| **49** | **technologies/react/remix/introduction.mdoc: plugin options table missing serveStaticTargetName / undocumented serve-static target** | **Medium** | **1 file (Group E)** |
| **50** | **technologies/build-tools/webpack/Guides/webpack-plugins.mdoc: externalDependencies default documented backwards ('none' vs actual 'all'); deleteOutputPath shown as deprecated when it was fully removed** | **High** | **1 file (Group F)** |
| **51** | **troubleshooting/troubleshoot-convert-to-inferred.mdoc: wrong executor name @nx/storybook:build-storybook (should be @nx/storybook:build)** | **Medium** | **1 file (Group H)** |
| **52** | **guides/Nx Console/console-nx-cloud.mdoc: "coming soon to JetBrains" contradicts already-shipped feature documented in reference/nx-console-settings.mdoc** | **Medium** | **1 file (Group H)** |
| **53** | **guides/Nx Cloud/record-commands.mdoc: nx record feature gated behind defunct "Nx Cloud 13.3" version marker from old numbering scheme** | **Low** | **1 file (Group H)** |
| **54** | **guides/Tips-n-Tricks/yarn-pnp.mdoc: yarn@3.6.1 example stale (Yarn Berry now 4.x)** | **Low** | **1 file (Group H)** |
| **55** | **guides/Adopting Nx/adding-to-monorepo.mdoc + adding-to-existing-project.mdoc: "Lerna v6" stale (now v9); sample CI workflow doesn't match actual ci-workflow generator output (setup-node@v3 vs v4, node-version 22 vs 20, missing nx fix-ci step)** | **Medium** | **2 files (Group H)** |
| **56** | **getting-started/Tutorials/crafting-your-workspace.mdoc: "recommended" tsconfig.base.json example (ES2020, universal nodenext) doesn't match current generator template (es2022, conditional resolution)** | **Medium** | **1 file (Group H)** |
| **57** | **technologies/angular/introduction.mdoc: states Jest/Cypress are the defaults for @nx/angular:app/:lib; actual default for Angular ≥21 is Vitest/Playwright** | **High** | **1 file (Group H)** |

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit cycle** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-11) where Linear issue creation could not be completed programmatically. `ListConnectors` reports Linear as `enabledInChat: true` with `installState: "unknown"`, but every `ToolSearch` query this cycle (`Linear`, `mcp__Linear`, `create_issue`, `triage`, `list_teams`/`list_issues`, `create issue triage backlog assign`) returned **zero Linear tools** — identical to the 07-10 symptom. Every other connector reachable this session (GitHub, Slack, Notion, Google Calendar) resolved its tools normally via the same search mechanism. This strongly suggests the Linear connector's OAuth/install state is stuck rather than a transient search-indexing issue — **recommend Jack check/reconnect it directly in claude.ai connector settings** rather than letting this keep auto-retrying weekly. The backlog above (57 items now) is the full manually-creatable queue whenever it's fixed.

## Recurring Checks to Run

(unchanged from prior audits — see top of this file's README for the checklist)
