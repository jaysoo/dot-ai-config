# Nx Astro Docs Staleness Audit — 2026-07-06

Scanned all 503 `.mdoc` files under `astro-docs/src/content/docs/` in `nrwl/nx` (branch `claude/nifty-euler-av32yx`), fanned out across ~30 parallel research agents covering every top-level section, then cross-checked every version/flag/option claim against the actual source in `packages/`.

**Live-verified baselines** (per this folder's "Agent Instructions" — never trust training data or the docs' own claims about themselves):
- `npm view nx dist-tags` → **latest: 23.0.1**, previous: 22.7.6. **The docs' own "current version" claims (v22) are now one major behind reality.** This is the same mistake flagged in the 2026-06-29 audit ("wrong Nx baseline") — it recurred because the baseline was read from the docs instead of npm. Corrected mid-scan; see H-1 below.
- Node.js: v22/v24 are the active LTS lines; v20 EOL'd April 2026, v18 EOL'd April 2025, v16 long EOL.
- `actions/checkout` latest **v7.0.0**; `actions/setup-node` latest **v6.4.0**; `docker/login-action` latest **v4.4.0** — every doc using `@v3`/`@v4`/`@v2` is 2-3 majors behind.

Linear MCP is unavailable in this session (same as 2026-06-29 — appears to require interactive OAuth not available in headless/remote runs). All issues below are **queued for manual creation** in Linear (Docs team, triage, "Good for AI agents" label).

---

## Summary

| Category | High | Medium | Low/Needs-input |
|---|---|---|---|
| Old Nx version reference | 2 | 3 | 2 |
| Old Node/package version | 1 | 6 | 3 |
| Feature/CLI/option drift (docs vs `packages/` source) | 18 | 8 | 6 |
| **Total** | **21** | **17** | **11** |

Roughly a third of the confirmed findings are **repeats of unfixed issues from the 2026-06-29 audit** (marked "recurring" below) — those Linear issues were never actually created because Linear MCP was unavailable then too.

---

## HIGH severity

### H-1 — `reference/releases.mdoc` support table is stale: shows v22 as "Current"
**File:** `reference/releases.mdoc`
**Category:** old-nx-version
**Verified:** `npm view nx dist-tags` → `latest: 23.0.1`. The doc's table lists `v22 Current / v21 LTS / v20 LTS`. Per the page's own 18-month LTS policy, v20 (released 2024-10-06) should already be past end-of-support, and the table should read `v23 Current / v22 LTS / v21 LTS`.
**Confidence:** confirmed
**Note:** This is the exact same baseline error the 2026-06-29 audit called out (H-1 there, re: v23 being mislabeled "not yet current" in compatibility tables) — except now the underlying reality flipped: v23 **has** shipped (23.0.1 on npm, `next` is 23.1.0-beta.7). Several individual compatibility tables that the 2026-06-29 audit flagged as premature (e.g. `technologies/typescript/introduction.mdoc` showing "23.x (current)") are **now correct** and should not be "fixed" back to v22.

### H-2 — Deprecation policy's stated 2-major grace period doesn't match actual code
**File:** `reference/releases.mdoc`
**Category:** code-mismatch
**Description:** Doc states deprecated APIs "remain functional for a whole major version" — example given is deprecated-in-v21.1.0 → removed-in-v23.0.0 (a 2-major gap). Actual `@deprecated` comments in source show only a 1-major gap: `packages/nx/src/command-line/migrate/resolve-package-version.ts:57`, `packages/nx/src/command-line/watch/command-object.ts:46,100`, `packages/nx/src/project-graph/plugins/public-api.ts:22,31` all say "deprecated in Nx 23, removed in Nx 24." Either the policy changed and the doc needs updating, or the code comments are wrong — worth a maintainer call either way.
**Confidence:** confirmed

### H-3 — `reference/nx-json.mdoc` "Task options" table lists non-root properties as root-level
**File:** `reference/nx-json.mdoc`
**Category:** code-mismatch
**Description:** Table (lines 194-201) lists `captureStderr`, `skipNxCache`, `encryptionKey`, `selectivelyHashTsConfig` as settable "at the root of nx.json." Per `packages/nx/src/config/nx-json.ts` (`NxJsonConfiguration`) and `packages/nx/schemas/nx-schema.json`, the only real root-level task properties are `parallel` and `cacheDirectory`. `captureStderr`/`skipNxCache`/`encryptionKey` actually live nested under `tasksRunnerOptions.<name>.options`. `selectivelyHashTsConfig` isn't in the schema at all — it's read ad hoc in `packages/nx/src/hasher/task-hasher.ts:197`. Root `encryptionKey` is actually named `nxCloudEncryptionKey` (`nx-json.ts:967`).
**Confidence:** confirmed

### H-4 — `reference/nx-json.mdoc` "Max cache size" default is wrong
**File:** `reference/nx-json.mdoc`
**Category:** code-mismatch
**Description:** Doc says the default is "10% of disk size, up to a maximum of 10GB." `packages/nx/src/native/cache/cache.rs:470-483` (`get_default_max_cache_size`) computes `disk.total_space() * 0.1` with **no upper cap**, falling back to **100GB** (not 10GB) when disk size can't be resolved. On a 500GB disk the real default is ~50GB.
**Confidence:** confirmed

### H-5 — `extending-nx/compose-executors.mdoc` uses obsolete `"builder"` key and pre-Cypress-10 config
**File:** `extending-nx/compose-executors.mdoc`
**Category:** code-mismatch (recurring from 2026-06-29 H-5, still unfixed)
**Description:** Example `project.json` uses `"builder": "@nx/cypress:cypress"` — `TargetConfiguration` (`packages/nx/src/config/workspace-json-project-json.ts:233`) has no `builder` field, only `executor`. Same example sets `cypressConfig` to `cypress.json` (pre-v10 format) and a `tsConfig` option that doesn't exist in `packages/cypress/src/executors/cypress/schema.json` at all. The whole `@nx/cypress:cypress` executor is itself now `x-deprecated`, slated for removal in v24, in favor of the inferred `@nx/cypress/plugin`.
**Confidence:** confirmed

### H-6 — `extending-nx/migration-generators.mdoc` documents non-existent `--project` flag
**File:** `extending-nx/migration-generators.mdoc`
**Category:** code-mismatch (recurring from 2026-06-29 H-6, still unfixed)
**Description:** Example command passes `--project=pluginName`, but `packages/plugin/src/generators/migration/schema.json` has `"additionalProperties": false` and no `project` property. Running the example as written fails schema validation. Also, the `migrations.json` entry example includes a `"cli": "nx"` field that doesn't exist on `MigrationsJsonEntry` (`packages/nx/src/config/misc-interfaces.ts:104-118`) — `cli` only applies to `generators.json` entries.
**Confidence:** confirmed

### H-7 — `extending-nx/project-graph-plugins.mdoc` and `tooling-plugin.mdoc` present deprecated `createNodesV2` as current
**Files:** `extending-nx/project-graph-plugins.mdoc`, `extending-nx/tooling-plugin.mdoc`
**Category:** code-mismatch
**Description:** Both treat `createNodesV2` as the primary/recommended plugin export. `packages/nx/src/project-graph/plugins/public-api.ts` marks `CreateNodesV2` `@deprecated - use CreateNodes instead` (line 71) and the `NxPlugin.createNodesV2` field `@deprecated Prefer 'createNodes' for new plugins` (line 146). This directly contradicts the sibling doc `performant-project-graph-plugins.mdoc`, which correctly says `createNodes` is for Nx 22+ and `createNodesV2` is the pre-21 equivalent.
**Confidence:** confirmed

### H-8 — `guides/Nx Release/publish-rust-crates.mdoc` instructs a dead workaround (recurring from 2026-06-29 H-9, still unfixed)
**File:** `guides/Nx Release/publish-rust-crates.mdoc`
**Category:** code-mismatch
**Description:** Tells readers to set `useLegacyVersioning: true` because `@monodon/rust` lacks a `VersionActions` implementation, promising this "will be added in a minor release of Nx v21." `shouldUseLegacyVersioning()` (`packages/nx/src/command-line/release/config/use-legacy-versioning.ts`) is now itself `@deprecated` (`// TODO(v23): remove`) and isn't referenced anywhere in the actual version pipeline — the setting is a no-op today. The guide's own caution box even admits "In Nx v22, the legacy versioning implementation has been removed entirely," directly contradicting its own instructions two paragraphs up.
**Confidence:** confirmed

### H-9 — `guides/Tasks & Caching/terminal-ui.mdoc` — stale "Windows TUI still being worked on" note (recurring from 2026-06-29 H-10, still unfixed)
**File:** `guides/Tasks & Caching/terminal-ui.mdoc`
**Category:** code-mismatch
**Description:** "The initial Nx 21 release disables the Terminal UI on Windows. We are currently working on Windows support, so stay tuned." `packages/nx/src/tasks-runner/is-tui-enabled.ts` (`isUnicodeSupported()`) shows no blanket Windows disable — it checks for specific supported terminals (Windows Terminal, ConEmu/cmder, VS Code) like every other platform. Windows support shipped; the note was never removed.
**Confidence:** confirmed

### H-10 — GitHub Actions versions are 2-3 majors behind across CI examples (recurring theme from 2026-06-29 M-2/M-17, now worse)
**Files (non-exhaustive):** `guides/Adopting Nx/adding-to-existing-project.mdoc`, `guides/Adopting Nx/adding-to-monorepo.mdoc`, `guides/Nx Release/publish-in-ci-cd.mdoc`
**Category:** code-mismatch
**Description:** Docs use `actions/checkout@v3`/`@v4`, `actions/setup-node@v3`/`@v4`, `docker/login-action@v2`. Live-verified current majors: `actions/checkout` **v7.0.0**, `actions/setup-node` **v6.4.0**, `docker/login-action` **v4.4.0**. Even the `@v4` references treated as "current" by individual file-level consistency checks are actually stale relative to reality. `adding-to-existing-project.mdoc`/`adding-to-monorepo.mdoc` also drift from their own generator template output (`packages/workspace/src/generators/ci-workflow/files/.../__workflowFileName__.yml__tmpl__` uses `setup-node@v4`, not `@v3`).
**Confidence:** confirmed

### H-11 — `technologies/module-federation/` — 7 files present generators deprecated-for-removal-in-v24 as the primary path
**Files:** `Guides/create-a-host.mdoc`, `Guides/create-a-remote.mdoc`, `Guides/federate-a-module.mdoc`, `concepts/faster-builds-with-module-federation.mdoc`, `concepts/micro-frontend-architecture.mdoc`, `concepts/module-federation-and-nx.mdoc`, `concepts/nx-module-federation-technical-overview.mdoc`, `concepts/manage-library-versions-with-module-federation.mdoc`
**Category:** code-mismatch
**Description:** All present `nx g @nx/react:host`/`:remote`/`:federate-module` (and Angular equivalents) as current, default guidance. `packages/react/generators.json` marks all three `"x-deprecated"`, removed in Nx v24, in favor of the new `@nx/react:consumer`/`:provider` model already documented in the sibling `consumer-and-provider.mdoc`. `module-federation-and-nx.mdoc` additionally claims Angular Module Federation is still supported — it's explicitly dropped per `consumer-and-provider.mdoc` ("no longer supported, use `@angular-architects/native-federation`"). `manage-library-versions-with-module-federation.mdoc` also imports `ModuleFederationConfig` from `@nx/webpack` instead of the current `@nx/module-federation` (recurring from 2026-06-29 M-12).
**Confidence:** confirmed

### H-12 — `guides/Adopting Nx/from-turborepo.mdoc` — `nx show target` flag syntax doesn't exist
**File:** `guides/Adopting Nx/from-turborepo.mdoc`
**Category:** code-mismatch
**Description:** Maps Turborepo's `--dry-run` to `nx show target <project>:<target> --inputs --outputs`. Actual CLI (`packages/nx/src/command-line/show/command-object.ts`) implements this as separate subcommands: `nx show target inputs <project>:<target>` and `nx show target outputs <project>:<target>` — there's no `--inputs`/`--outputs` flag form. The documented command would fail as written.
**Confidence:** confirmed

### H-13 — `technologies/test-tools/storybook/` — 8 files use packages/config removed in Storybook 9+
**Files:** `introduction.mdoc`, `Guides/overview-react.mdoc`, `Guides/overview-angular.mdoc`, `Guides/storybook-interaction-tests.mdoc`, `Guides/angular-configuring-styles.mdoc`, `Guides/angular-storybook-compodoc.mdoc`, `Guides/configuring-storybook.mdoc`, `Guides/one-storybook-for-all.mdoc`, `Guides/one-storybook-per-scope.mdoc`, `Guides/one-storybook-with-composition.mdoc`, `Guides/storybook-composition-setup.mdoc`
**Category:** code-mismatch (recurring from 2026-06-29 M-3/M-4, still unfixed, now scoped wider)
**Description:** `introduction.mdoc` lists an invalid `uiFramework` value `@storybook/vue-vite` (schema only allows `@storybook/vue3-vite`). Multiple guides import `within`/`userEvent` from `@storybook/testing-library` and `expect` from `@storybook/jest` — both actively removed by `packages/storybook/src/migrations/update-21-2-0/remove-addon-dependencies.ts`, which strips `@storybook/addon-essentials`/`@storybook/addon-interactions` and logs "no longer needed in Storybook 9+." Current generator templates use `storybook/test` and pass `canvas` directly to `play()`. Half a dozen guides still show `addons: ['@storybook/addon-essentials', '@storybook/addon-interactions']` in sample `main.ts` configs as the expected pattern.
**Confidence:** confirmed

### H-14 — `technologies/test-tools/detox/introduction.mdoc` mislabels Detox config as ESLint config
**File:** `technologies/test-tools/detox/introduction.mdoc`
**Category:** code-mismatch
**Description:** Says the plugin infers tasks for projects with an "ESLint configuration file" present, listing `.detoxrc.js`/`.detoxrc.json`/`detox.config.js`/`detox.config.json`. `packages/detox/src/plugins/plugin.ts` globs these exact filenames as **Detox** config, unrelated to ESLint — copy/paste labeling error.
**Confidence:** confirmed

### H-15 — `technologies/test-tools/playwright/` — 2 files use pre-ESM config pattern
**Files:** `introduction.mdoc`, `Guides/merge-atomized-outputs.mdoc`
**Category:** code-mismatch
**Description:** Config samples use `nxE2EPreset(__filename, { testDir: './e2e' })`. The actual generator template (`packages/playwright/src/generators/configuration/files/playwright.config.mts.template`) produces `nxE2EPreset(import.meta.dirname, ...)` — the file is deliberately generated as `.mts` specifically to use `import.meta.dirname` (ESM). Docs show the old CJS pattern.
**Confidence:** confirmed

### H-16 — `technologies/angular/introduction.mdoc` and `dynamic-module-federation-with-angular.mdoc` reference a non-existent generator
**Files:** `technologies/angular/introduction.mdoc`, `technologies/angular/Guides/dynamic-module-federation-with-angular.mdoc`
**Category:** code-mismatch
**Description:** Both show `nx g @nx/angular:service ...`. `packages/angular/generators.json` has no `service` generator and no `packages/angular/src/generators/service` directory exists. The command would fail.
**Confidence:** confirmed

### H-17 — `technologies/angular/angular-rspack/create-config.mdoc` documents ~20 fewer options than actually exist
**File:** `technologies/angular/angular-rspack/create-config.mdoc`
**Category:** code-mismatch
**Description:** `AngularRspackPluginOptions` reference omits `allowedCommonJsDependencies`, `appShell`, `baseHref`, `budgets`, `crossOrigin`, `deleteOutputPath`, `deployUrl`, `externalDependencies`, `i18nMetadata`, `i18nMissingTranslation`, `i18nDuplicateTranslation`, `localize`, `ngswConfigPath`, `poll`, `prerender`, `preserveSymlinks`, `progress`, `serviceWorker`, `statsJson`, `subresourceIntegrity`, `verbose`, `watch`, `watchOptions`, `webWorkerTsConfig` — all present in `packages/angular-rspack/src/lib/models/angular-rspack-plugin-options.ts:191-349`. Looks like a stale snapshot of a much smaller, earlier options surface.
**Confidence:** confirmed

### H-18 — `technologies/vue/nuxt/index.mdoc` documents a plugin option that doesn't exist there
**File:** `technologies/vue/nuxt/index.mdoc`
**Category:** code-mismatch
**Description:** Claims `testTargetName` is a `@nx/nuxt/plugin` option (default `test`), including a config example setting it inside `@nx/nuxt/plugin` options. `NuxtPluginOptions` (`packages/nuxt/src/plugins/plugin.ts:32-39`) has no such field — `testTargetName` actually belongs to the separate `@nx/vite/plugin` entry that the Nuxt `init` generator adds alongside it (`packages/nuxt/src/generators/init/lib/utils.ts:78-89`). `@nx/nuxt/plugin` itself never infers a test task.
**Confidence:** confirmed

### H-19 — `technologies/react/next/index.mdoc` states the wrong minimum Next.js version
**File:** `technologies/react/next/index.mdoc`
**Category:** code-mismatch
**Description:** Requirements table says `next: >=15.0.0 <17.0.0`. Actual peer range in `packages/next/package.json` is `>=14.0.0 <17.0.0`, and `packages/next/src/utils/versions.ts:5` defines `minSupportedNextVersion = '14.0.0'` (enforced via `assertSupportedPackageVersion`). The doc's floor is stricter than what the code actually supports.
**Confidence:** confirmed

### H-20 — `guides/Enforce Module Boundaries/tags-allow-list.mdoc` misplaces the `allow` option
**File:** `guides/Enforce Module Boundaries/tags-allow-list.mdoc`
**Category:** code-mismatch
**Description:** States `allow` is set "in the project configuration" (i.e. `project.json`). Per the rule schema (`packages/eslint-plugin/src/rules/enforce-module-boundaries.ts:118`), `allow` is a top-level option of the `@nx/enforce-module-boundaries` **ESLint rule config** (in `eslint.config.mjs`/`.eslintrc.json`) — exactly as every sibling doc in the same folder correctly shows. This page is the sole outlier.
**Confidence:** confirmed

### H-21 — `guides/Installation/install-non-javascript.mdoc` is missing the current install flow
**File:** `guides/Installation/install-non-javascript.mdoc`
**Category:** code-mismatch
**Description:** Implies `.nx/installation` setup happens automatically when running `nx init` without a `package.json`. `packages/nx/src/command-line/init/init-v2.ts` (~lines 217-256) shows `nx init` now prompts interactively to choose between ".nx installation" and "package.json installation" — choosing the latter creates a `package.json` and skips `.nx` entirely. The doc never mentions the prompt or the `--useDotNxInstallation` flag needed to force it non-interactively.
**Confidence:** confirmed

---

## MEDIUM severity

### M-1 — `getting-started/Tutorials/react-monorepo-tutorial.mdoc` shows a deprecated Vite option without a deprecation note
Shows `"serveTargetName": "serve"` alongside `"devTargetName": "dev"` in a `@nx/vite/plugin` example. `packages/vite/src/plugins/plugin.ts:35-37` marks `serveTargetName` `@deprecated Use devTargetName instead. This option will be removed in Nx 22` — and Nx 22 is no longer even current (see H-1). **Confidence:** confirmed.

### M-2 — `reference/project-configuration.mdoc` claims default output locations come from shipped presets that are actually empty
Says defaults like `{workspaceRoot}/dist/{projectRoot}` are "imported in nx.json" from Nx's shipped presets. `packages/nx/presets/core.json` and `npm.json` are both `{}` — no `targetDefaults`/`outputs` in either. Likely a holdover from pre-inferred-tasks Nx. **Confidence:** needs-input.

### M-3 — `reference/Conformance/overview.mdoc` config sample is missing documented schema fields
Omits the rule-level `explanation` string and `status` enum (`"enforced"|"evaluated"|"disabled"`, default `"enforced"`) that exist in `packages/nx/schemas/nx-schema.json`, and undersells `projects` matcher-object support (`{ matcher, explanation }`, not just plain strings). **Confidence:** confirmed.

### M-4 — `reference/Nx Cloud/config.mdoc` still shows ancient version-gated tabs as live choices
Tabs split on `Nx >= 19.7 / <= 19.6` and `Nx >= 17 / < 17` for `nxCloudId`/token/encryption-key config. With v23 now current, these are 4-6 majors stale — presented as equally valid contemporary options. **Confidence:** confirmed (recurring from 2026-06-29 M-16).

### M-5 — `reference/Nx Cloud/release-notes.mdoc` hasn't been updated in ~6 months
Most recent entry dated 2026.01, no newer entries as of 2026-07-06 — unusual gap for an actively-shipping product. **Confidence:** needs-input (may just mean nothing shipped, can't confirm from this repo).

### M-6 — `concepts/buildable-and-publishable-libraries.mdoc` plugin list is incomplete
States `--buildable`/`--publishable` are available for "Angular, React, NestJs, Node." A `publishable` schema option actually exists in 9 plugins: `angular`, `expo`, `js`, `nest`, `next`, `node`, `react-native`, `react`, `vue`. Missing: Vue, React Native, Next.js, Expo, and the generic `js` library generator. **Confidence:** confirmed.

### M-7 — `rsbuild`/`rspack` introduction pages show one-patch-stale default versions
`technologies/build-tools/rsbuild/introduction.mdoc` lists `@rsbuild/core` default-installed as `2.0.6`; source (`packages/rsbuild/src/utils/versions.ts`) sets `2.0.7`. Same pattern for `rspack/introduction.mdoc` (`2.0.3` doc vs `2.0.4` source). Likely just needs a doc regen. **Confidence:** confirmed.

### M-8 — `technologies/dotnet/Guides/migrate-from-nx-dotnet-core.mdoc` omits real CLI flags in its command table
Shows simplified `dotnet restore`/`publish`/`pack` commands; the analyzer actually adds `--no-dependencies`, `--no-build`, `--no-restore`, `--configuration Release` (`packages/dotnet/analyzer/Utilities/TargetBuilder.*.cs`). Inconsistent with the sibling `incremental-builds.mdoc` guide, which documents these flags correctly. **Confidence:** confirmed.

### M-9 — `technologies/eslint/eslint-plugin/Guides/enforce-module-boundaries.mdoc` omits the `buildTargets` option
`packages/eslint-plugin/src/rules/enforce-module-boundaries.ts` (lines 58, 119, 204, 629-630) has a real, actively-used `buildTargets` option (default `['build']`) controlling which target names count as "build" for `enforceBuildableLibDependency` checks — not documented in the options table. **Confidence:** confirmed.

### M-10 — `technologies/eslint/Guides/custom-workspace-rules.mdoc` has a stale TODO implying missing ESLint v9 support
TODO comments say a generator quick-start section is pending "once `@nx/eslint:workspace-rule` supports ESLint v9." The generator already requires and works with ESLint ≥9.0.0 (`assertSupportedEslintVersion`, `packages/eslint/src/generators/workspace-rule/workspace-rule.ts`) — the premise is stale and the page never mentions the generator at all. **Confidence:** confirmed.

### M-11 — `guides/Nx Release/publish-in-ci-cd.mdoc` has an internally-inconsistent, doubly-stale Docker example
The Docker workflow example uses `actions/checkout@v3`/`setup-node@v3`/`docker/login-action@v2` while every other example in the same file uses `@v4` — and per H-10, even `@v4` is stale against the real current majors. **Confidence:** confirmed.

### M-12 — `technologies/test-tools/cypress/Guides/cypress-v11-migration.mdoc` is dead legacy content
Entire guide covers migrating from Cypress 8/9 to 11. Current `@nx/cypress` peer range is `>=13 <16` (`packages/cypress/package.json`) — versions 8-11 are all below the supported floor. The `migrate-to-cypress-11` generator still exists in code, so it's not a broken link, just guidance nobody on a supported version needs. **Confidence:** confirmed.

### M-13 — `technologies/node/Guides/bundling-node-projects.mdoc` targets an EOL Node version
Vite build example sets `target: 'node18'`. Node 18 EOL'd April 2025; should target `node22` or later. **Confidence:** confirmed (recurring from 2026-06-29 M-6, still unfixed).

### M-14 — `technologies/node/Guides/node-serverless-functions-netlify.mdoc` references a plugin not in this monorepo
References `@nx/netlify`; no such package exists under `packages/`. The sibling `node-aws-lambda.mdoc` already carries a "deprecated and unmaintained" banner for the equivalent `@nx/aws-lambda` reference — this one has no such disclaimer. **Confidence:** needs-input (may be a legitimately separate community plugin).

### M-15 — `guides/Tips-n-Tricks/yarn-pnp.mdoc` shows a stale Yarn version as "stable"
Example shows `yarn set version stable` producing `"packageManager": "yarn@3.6.1"`. Yarn 4.x has been the stable major for a while. **Confidence:** confirmed on the version being old; needs-input on the exact current figure (not independently re-verified via registry).

### M-16 — `guides/Tasks & Caching/root-level-scripts.mdoc` sample output shows Yarn Classic
Terminal output samples show `yarn run v1.22.19` (Yarn 1.x) in two places — illustrative rather than an instruction to use Yarn 1, but reads as outdated. **Confidence:** needs-input (cosmetic).

### M-17 — `technologies/eslint/Guides/flat-config.mdoc` "since version 16.8.0" trivia (recurring from 2026-06-29 M-21, still unfixed)
Opens with "Since version 16.8.0, Nx supports flat config" — six-plus majors behind current, and given `@nx/eslint`'s actual peer range (`^9.0.0 || ^10.0.0`) no supported workspace could ever hit pre-flat-config ESLint anyway. Low-value historical framing on what should be a current-state page. **Confidence:** needs-input (the "16.8.0" figure itself isn't independently verifiable from this repo, but the framing is stale regardless of the exact number).

---

## Needs Input

- **`reference/environment-variables.mdoc`** — several Nx Cloud env vars (`NX_CLOUD_DISABLE_METRICS_COLLECTION`, `NX_CI_EXECUTION_ENV`, `NX_AGENT_LAUNCH_TEMPLATE`, `NX_CLOUD_CONTINUOUS_ASSIGNMENT`, `NX_NO_OUTPUT_TIMEOUT`, `NX_WORKING_DIRECTORY`, `NX_RUN_GROUP`, `NX_CLOUD_DISTRIBUTED_EXECUTION_STOP_AGENTS_ON_FAILURE`) have zero matches under `packages/` — Nx Cloud's client is closed-source, so these can't be confirmed or denied from this repo. Someone with access to the Nx Cloud codebase should spot-check.
- **`reference/Conformance/*` and `reference/Owners/*`** — `@nx/conformance` and `@nx/owners` are closed-source enterprise plugins not present in this repo; generator/executor option tables in `create-conformance-rule.mdoc`, `test-conformance-rule.mdoc`, `Executors.mdoc`, `Generators.mdoc` couldn't be verified against source.
- **`technologies/dotnet/introduction.mdoc`** — claims ".NET SDK 8.0 or newer" and "available since Nx 22.0.0"; no source-level version gate found to confirm either figure (the CI-workflow template actually scaffolds `.NET 10`, not 8).
- **`technologies/java/introduction.mdoc`** — "Java >= 17" isn't backed by an explicit version-gate constant in `packages/gradle/src`; not necessarily wrong (Java 17 is current LTS) but unconfirmed.
- **`getting-started/Tutorials/crafting-your-workspace.mdoc`** — illustrative `tsconfig.base.json` shows `"target": "ES2020"` vs. the real `@nx/js:init` generator default of `es2022`; likely intentionally simplified for the tutorial, but worth a check.
- **`troubleshooting/troubleshoot-nx-install-issues.mdoc`** — native-module troubleshooting section is scoped to "Nx between 15.8 and 16.4," an EOL range; unclear whether the underlying npm optional-dependency bug still matters on current Nx/npm, or whether this section should just be archived.
- **`guides/Nx Console/editor-setup.mdoc`, `reference/nx-cloud-cli.mdoc`, `reference/nx-console-settings.mdoc`, `reference/nx-mcp.mdoc`** — Nx Console and Nx Cloud CLI live in separate repos; version-gated tabs and marketplace IDs couldn't be verified from `nrwl/nx` alone.

---

## Clean / no issues found (notable areas with full coverage)

`concepts/`, `how-nx-works/`, `features/` (49 files, 1 issue — see M-6), `knowledge-base/` (24 files, all auto-generated stub pages), `platform-features/` (9 files, all stub pages), `getting-started/` top-level + `Tutorials/` (21 files, 2 minor needs-input only), `enterprise/` (mostly clean, 1 JSON-syntax typo in `owners.mdoc` not itemized above as it's a trivial trailing-comma/semicolon fix), `troubleshooting/` (10 files, 1 needs-input), `guides/Tasks & Caching/` (15 files, clean apart from H-9/M-16), `guides/Tips-n-Tricks/` (17 files, clean apart from M-15), `technologies/build-tools/webpack` + `vite` + `esbuild` + `rollup` (all deprecation notices verified accurate against source), `technologies/typescript/`, `technologies/node/` (mostly clean apart from M-13/M-14), `technologies/eslint/` (mostly clean apart from M-9/M-10/M-17), `technologies/test-tools/jest/` (fully verified against source, no issues), all per-tool `reference/<tool>/index.mdoc` stub pages across ~20 plugins (auto-generated at build time from `schema.json`, nothing to go stale in the static file itself).

---

## Linear Issues to Create (queued — MCP unavailable, same as 2026-06-29)

| # | Title | Severity | Files |
|---|---|---|---|
| 1 | Update reference/releases.mdoc support table: v23 is current, not v22 | High | 1 |
| 2 | Reconcile deprecation-policy grace period (doc says 2 majors, code comments say 1) | High | 1 |
| 3 | Fix nx.json reference: task-options table lists nested tasksRunnerOptions keys as root-level | High | 1 |
| 4 | Fix nx.json reference: maxCacheSize default has no 10GB cap in source (falls back to 100GB) | High | 1 |
| 5 | Fix compose-executors.mdoc: "builder"→"executor", cypress.json→cypress.config.ts (recurring, unfixed since 06-29) | High | 1 |
| 6 | Fix migration-generators.mdoc: remove non-existent --project flag and cli field (recurring, unfixed since 06-29) | High | 1 |
| 7 | Fix project-graph-plugins.mdoc + tooling-plugin.mdoc: createNodesV2 is deprecated, promote createNodes | High | 2 |
| 8 | Fix or archive publish-rust-crates.mdoc: useLegacyVersioning is dead code (recurring, unfixed since 06-29) | High | 1 |
| 9 | Remove stale "Windows TUI still being worked on" note from terminal-ui.mdoc (recurring, unfixed since 06-29) | High | 1 |
| 10 | Bump GitHub Actions versions across CI examples: checkout→v7, setup-node→v6, docker/login-action→v4 (recurring theme, now worse) | High | 5+ |
| 11 | Update Module Federation docs (7 files) to lead with consumer/provider, mark host/remote/federate-module deprecated | High | 7 |
| 12 | Fix from-turborepo.mdoc: `nx show target --inputs --outputs` doesn't exist, use subcommand form | High | 1 |
| 13 | Fix Storybook docs (11 files): replace @storybook/testing-library + @storybook/jest + addon-essentials/interactions examples | High | 11 |
| 14 | Fix Detox introduction.mdoc: config files are Detox config, not ESLint config | High | 1 |
| 15 | Fix Playwright docs: use import.meta.dirname, not __filename, in config samples | High | 2 |
| 16 | Fix Angular docs: remove non-existent @nx/angular:service generator references | High | 2 |
| 17 | Fix angular-rspack/create-config.mdoc: add ~20 missing AngularRspackPluginOptions fields | High | 1 |
| 18 | Fix nuxt/index.mdoc: testTargetName belongs to @nx/vite/plugin, not @nx/nuxt/plugin | High | 1 |
| 19 | Fix react/next/index.mdoc: minimum supported Next.js is 14.0.0, not 15.0.0 | High | 1 |
| 20 | Fix tags-allow-list.mdoc: `allow` is an ESLint rule option, not a project.json field | High | 1 |
| 21 | Update install-non-javascript.mdoc for the new interactive prompt / --useDotNxInstallation flag | High | 1 |
| 22 | Fix react-monorepo-tutorial.mdoc: flag serveTargetName as deprecated (removed in Nx 22, already past) | Medium | 1 |
| 23 | Verify/fix project-configuration.mdoc default-output-location claim vs empty shipped presets | Medium | 1 |
| 24 | Add missing status/explanation/projects-matcher-object fields to Conformance overview.mdoc | Medium | 1 |
| 25 | Update Nx Cloud config.mdoc: drop or clearly archive Nx>=17/<17 and >=19.7/<=19.6 tabs | Medium | 1 |
| 26 | Check Nx Cloud release-notes.mdoc: no entries since Jan 2026 | Medium | 1 |
| 27 | Add missing plugins (vue, react-native, next, expo, js) to buildable-and-publishable-libraries.mdoc | Medium | 1 |
| 28 | Regen rsbuild/rspack introduction.mdoc default-installed versions (one patch stale) | Medium | 2 |
| 29 | Fix migrate-from-nx-dotnet-core.mdoc: add missing CLI flags to default-targets table | Medium | 1 |
| 30 | Add missing buildTargets option to enforce-module-boundaries.mdoc options table | Medium | 1 |
| 31 | Remove stale ESLint-v9-unsupported TODO from custom-workspace-rules.mdoc | Medium | 1 |
| 32 | Fix publish-in-ci-cd.mdoc Docker example: inconsistent/stale action versions | Medium | 1 |
| 33 | Archive or clearly flag cypress-v11-migration.mdoc as legacy (current floor is v13) | Medium | 1 |
| 34 | Bump bundling-node-projects.mdoc Vite target from node18 to node22 (recurring, unfixed since 06-29) | Medium | 1 |
| 35 | Verify node-serverless-functions-netlify.mdoc: does @nx/netlify still exist/get published? | Medium | 1 |
| 36 | Update yarn-pnp.mdoc example version from yarn@3.6.1 to current stable | Medium | 1 |
| 37 | Clean up eslint/flat-config.mdoc "since version 16.8.0" framing (recurring, unfixed since 06-29) | Low | 1 |
| 38 | Fix trailing-comma/stray-semicolon JSON syntax error in enterprise/owners.mdoc example | Low | 1 |

---

## Recurring Checks to Run

- After each Nx major release: `npm view nx dist-tags` first, then grep for `Nx {prev_major}` caveats in non-deprecated docs. **Do not read the current-version baseline from the docs themselves** — that's how the 06-29 and 07-06 audits both initially mis-set their baseline.
- Annually (April/October): grep `node-version:`, `node:XX`, `Node.js.*vXX` against Node.js release schedule EOL dates.
- Quarterly: check `actions/checkout`, `actions/setup-node`, `docker/login-action` latest majors via `gh api repos/<owner>/<repo>/releases/latest` (or WebFetch the GitHub releases page if `gh` isn't scoped) — these move faster than Nx majors and are consistently 2-3 versions stale across the docs.
- When a package is deprecated: grep for `@nrwl/` scope if any `@nx/` migration happened.
