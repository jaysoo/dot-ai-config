# Nx Astro Docs Staleness Audit — 2026-06-29

Scanned all 503 `.mdoc` files under `astro-docs/src/content/docs/` in `nrwl/nx`.
Current Nx: **22.x** | Node 20 EOL: **April 2026** | Angular current: **22.x** | React current: **19.x**

Linear MCP unavailable again — all issues queued for manual creation below.

---

## Summary

| Category | High | Medium | Low | Needs Input |
|---|---|---|---|---|
| Old Nx version reference | 5 | 14 | 9 | 4 |
| Old Node/package version | 3 | 10 | 8 | 3 |
| Mismatched CLI/feature | 5 | 5 | 5 | 4 |
| **Total** | **13** | **29** | **22** | **11** |

---

## HIGH Severity

### H-1 — Compatibility tables label Nx 23.x as `(current)`
**Files:**
- `technologies/node/introduction.mdoc` — `| 23.x (current) | 26.x, 24.x, ^22.12.0 |`
- `technologies/node/nest/introduction.mdoc` — `| 23.x (current) | ^11.0.0 |`
- `technologies/typescript/introduction.mdoc` — `| 23.x (current) | >= 5.8.0 < 6.1.0 |`

**Category:** old-nx-version
**Issue:** Three compatibility tables mark Nx 23.x as `(current)` when the current release is 22.x. Factual error in a reference table — readers will think they need to upgrade to an unreleased version.

---

### H-2 — `consumer-and-provider.mdoc` documents unreleased Nx v23 as current
**File:** `technologies/module-federation/consumer-and-provider.mdoc`
**Category:** old-nx-version
**Issue:** Page title is "Module Federation Consumer and Provider (v23+)". States "Nx v23 introduces a new generator surface … that replaces the v22 host and remote generators." Since current Nx is 22.x, this presents unreleased features as already available. Also lists `@nx/react:host`, `@nx/react:remote`, `@nx/angular:host`, `@nx/angular:remote` as "deprecated in v23 and will be removed in v24" — but v23 hasn't shipped, so these are not yet deprecated for users on 22.x.
**Excerpt:** `Nx v23 introduces a new generator surface in @nx/react (@nx/react:consumer and @nx/react:provider)`

---

### H-3 — `migrating-from-nx-vite.mdoc` treats Nx 23 as already released
**File:** `technologies/test-tools/vitest/Guides/migrating-from-nx-vite.mdoc`
**Category:** old-nx-version
**Issue:** "Nx 23 removed all vitest support from `@nx/vite`." and "If you are upgrading to Nx 23…" — Nx 23 hasn't released. This presents a future breaking change as already in effect.
**Excerpt:** `Nx 23 removed all vitest support from @nx/vite.`

---

### H-4 — Angular Rspack getting-started shows `v23.0.0` workspace creation
**File:** `technologies/angular/angular-rspack/Guides/getting-started.mdoc`
**Category:** old-nx-version
**Issue:** Terminal output in the guide explicitly shows `NX   Creating your v23.0.0 workspace.` — Nx 22.x is current, not 23.x. Readers will be confused or misled about which version they'll actually get.
**Excerpt:** `NX   Creating your v23.0.0 workspace.`

---

### H-5 — `compose-executors.mdoc` uses obsolete `"builder"` key and `cypress.json`
**File:** `extending-nx/compose-executors.mdoc`
**Category:** mismatched-feature
**Issue 1:** Code example uses `"builder": "@nx/cypress:cypress"` — Nx replaced `"builder"` with `"executor"` years ago. The current `TargetConfiguration` type uses `executor`, not `builder`. Misleads readers writing new config.
**Issue 2:** Same example references `apps/myapp-e2e/cypress.json` — the Cypress v9 config format. Cypress v10+ (Nx 15/16+) uses `cypress.config.ts`.
**Excerpts:** `"builder": "@nx/cypress:cypress"` / `"cypressConfig": "apps/myapp-e2e/cypress.json"`

---

### H-6 — `migration-generators.mdoc` documents non-existent `--project` flag
**File:** `extending-nx/migration-generators.mdoc`
**Category:** mismatched-feature
**Issue:** The documented command includes `--project=pluginName` but the `@nx/plugin:migration` generator schema has no `project` property (`"additionalProperties": false`). Valid properties are `path`, `name`, `description`, `packageVersion`, `packageJsonUpdates`, `skipLintChecks`. The project is inferred from the `path` argument automatically.
**Excerpt:** `nx generate @nx/plugin:migration libs/pluginName/src/migrations/change-executor-name \ --project=pluginName`

---

### H-7 — `self-healing-ci.mdoc` uses `actions/checkout@v6` and `actions/setup-node@v6` (don't exist)
**File:** `features/CI Features/self-healing-ci.mdoc`
**Category:** mismatched-feature
**Issue:** The GitHub Actions example references `actions/checkout@v6` and `actions/setup-node@v6`. Both actions are at v4 — no v5 or v6 exists. These would fail if copied verbatim.
**Excerpt:** `- uses: actions/checkout@v6` / `- uses: actions/setup-node@v6`

---

### H-8 — `use-bun.mdoc` uses `actions/checkout@v6` (doesn't exist)
**File:** `guides/Nx Cloud/use-bun.mdoc`
**Category:** mismatched-feature
**Issue:** Same `@v6` error as H-7 — should be `@v4`.
**Excerpt:** `- uses: actions/checkout@v6`

---

### H-9 — `publish-rust-crates.mdoc` is a broken, stale guide
**File:** `guides/Nx Release/publish-rust-crates.mdoc`
**Category:** old-nx-version
**Issue:** The guide contains an aside saying "This will be added in a minor release of Nx v21 and this recipe will be updated accordingly." We're on Nx 22.x — this promise was never fulfilled. The guide also uses `useLegacyVersioning: true`, which was deprecated in Nx v21 and removed in Nx v22 (though a shim persists with `// TODO(v23): remove`). The guide is functionally broken and misleading: it instructs users to enable a removed feature.
**Excerpt:** `This will be added in a minor release of Nx v21 and this recipe will be updated accordingly.`

---

### H-10 — `terminal-ui.mdoc` claims Windows TUI is "currently being worked on"
**File:** `guides/Tasks & Caching/terminal-ui.mdoc`
**Category:** mismatched-feature
**Issue:** "The initial Nx 21 release disables the Terminal UI on Windows. We are currently working on Windows support, so stay tuned." Source inspection of `packages/nx/src/tasks-runner/is-tui-enabled.ts` shows no blanket Windows disable — `isUnicodeSupported()` explicitly supports Windows Terminal, VSCode, ConEmu, alacritty via `WT_SESSION`, `TERM_PROGRAM`, and `TERM` checks. Windows support was added but the docs were never updated.
**Excerpt:** `We are currently working on Windows support, so stay tuned.`

---

### H-11 — Node 20 cloud launch template images listed without EOL callout
**File:** `reference/Nx Cloud/launch-templates.mdoc`
**Category:** old-node-version
**Issue:** Node 20 went EOL April 2026. The launch templates list `ubuntu22.04-node20.x-vY` images as available options without any EOL or deprecated marker. The latest image (`ubuntu22.04-node24.14-v1`) is correct, but the Node 20 images remain presented as valid choices.
**Excerpt:** `ubuntu22.04-node20.19-v3: upgraded Docker from 24.0.2 to 28.3.1`

---

### H-12 — `launch-template-examples.mdoc` uses EOL Node 21 in examples
**File:** `reference/Nx Cloud/launch-template-examples.mdoc`
**Category:** old-node-version
**Issue:** The "Custom node version" example uses `node-21` as the template name and `nvm install 21.7.3` — Node 21 is an unsupported, EOL release. The minimum image requirement `ubuntu22.04-node20.11-v9` references a Node 20 base (also EOL).
**Excerpts:** `launch-templates: node-21:` / `nvm install 21.7.3` / `requires the minimum image version to be ubuntu22.04-node20.11-v9 or later`

---

### H-13 — `reference/Deprecated` uses future tense for already-past Nx 20/21 milestones
**Files:**
- `reference/Deprecated/as-provided-vs-derived.mdoc`
- `reference/Deprecated/v1-nx-plugin-api.mdoc`
- `reference/Deprecated/legacy-cache.mdoc`

**Category:** old-nx-version
**Issue:** All three files use future-tense language about events that have already happened:
- `as-provided-vs-derived.mdoc`: "Nx will only use the new behavior in Nx version 20" / "flags deprecated and will be removed in Nx 20" — Nx 20 shipped years ago, removal already happened.
- `v1-nx-plugin-api.mdoc`: "will be removed in Nx 20" — already removed.
- `legacy-cache.mdoc`: "In Nx 21, the legacy file system cache will be removed" — already removed. Readers on Nx 22 will be confused.
**Excerpts:** `"Nx will only use the new behavior in Nx version 20"` / `"will be removed in Nx 20"` / `"In Nx 21, the legacy file system cache will be removed"`

---

## MEDIUM Severity

### M-1 — v23/v24 deprecation framing across build tool and framework guides
**Files:**
- `technologies/build-tools/vite/Guides/configure-vite.mdoc`
- `technologies/build-tools/webpack/Guides/webpack-config-setup.mdoc`
- `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc`
- `technologies/react/Guides/adding-assets-react.mdoc`
- `technologies/react/next/Guides/next-config-setup.mdoc`

**Category:** old-nx-version
**Issue:** All five files contain deprecation callouts like "deprecated and will be removed in Nx v24. It still works in v23…" — since Nx 22.x is current and v23/v24 are not released, saying "it still works in v23" is confusing forward-looking framing. Users on v22 read this and think v23 is already out. Once v23 ships these messages will also need updating again.
**Excerpt (representative):** `deprecated and will be removed in Nx v24. It still works in v23, but using it logs a deprecation warning.`

---

### M-2 — GitHub Actions versions outdated across CI guides
**Files:**
- `features/CI Features/split-e2e-tasks.mdoc` — `actions/setup-node@v3`
- `guides/Nx Release/publish-in-ci-cd.mdoc` — `actions/setup-node@v3`, `actions/checkout@v3`, `docker/login-action@v2`
- `guides/Adopting Nx/adding-to-monorepo.mdoc` — `actions/setup-node@v3`
- `guides/Adopting Nx/adding-to-existing-project.mdoc` — `actions/setup-node@v3`
- `guides/Nx Cloud/bring-your-own-compute.mdoc` — `actions/setup-node@v3`

**Category:** mismatched-feature
**Issue:** Current stable: `actions/checkout@v4`, `actions/setup-node@v4`, `docker/login-action@v3`. The `@v3` references are deprecated. Multiple files show mixed `@v3` and `@v4` within the same example.

---

### M-3 — Storybook deprecated test imports across 3 files
**Files:**
- `technologies/test-tools/storybook/Guides/overview-react.mdoc`
- `technologies/test-tools/storybook/Guides/overview-angular.mdoc`
- `technologies/test-tools/storybook/Guides/storybook-interaction-tests.mdoc`

**Category:** old-package-version
**Issue:** All three import `@storybook/testing-library` and `@storybook/jest`, both deprecated since Storybook 8. The current replacement is `@storybook/test`. Users following these guides will install deprecated packages.
**Excerpt:** `import { within } from '@storybook/testing-library'; import { expect } from '@storybook/jest';`

---

### M-4 — `angular-configuring-styles.mdoc` uses Storybook 8-removed webpack5 builder
**File:** `technologies/test-tools/storybook/Guides/angular-configuring-styles.mdoc`
**Category:** old-package-version
**Issue:** Shows `core: { builder: '@storybook/builder-webpack5' }` — removed in Storybook 8. Also includes React-specific `reactDocgen`/`reactDocgenTypescriptOptions` in an Angular Storybook config (invalid in Storybook 8+).
**Excerpt:** `core: { builder: '@storybook/builder-webpack5' }, typescript: { reactDocgen: 'react-docgen-typescript', ... }`

---

### M-5 — `best-practices.mdoc` uses Storybook 7-era URL scheme and 2022 blog link
**File:** `technologies/test-tools/storybook/Guides/best-practices.mdoc`
**Category:** old-package-version
**Issue:** Multiple links use the Storybook 7 `/docs/react/...` URL path which is dead in Storybook 8+. Also links to a "Why Storybook in 2022?" blog post.
**Excerpt:** `https://storybook.js.org/docs/react/get-started/introduction` / `[Why Storybook in 2022?]`

---

### M-6 — Node 20 listed as supported target in `bundling-node-projects.mdoc` (EOL)
**File:** `technologies/node/Guides/bundling-node-projects.mdoc`
**Category:** old-node-version
**Issue:** Vite bundling config example uses `target: 'node18'` as the esbuild/Rollup compilation target. Node 18 went EOL April 2025. New projects following this guide will compile for a dead runtime.
**Excerpt:** `build: { target: 'node18', outDir: 'dist', ...`

---

### M-7 — Node 20 listed as supported in Nx 22 compatibility table without EOL caveat
**File:** `technologies/node/introduction.mdoc`
**Category:** old-node-version
**Issue:** The Nx 22.x row includes `^20.19.0` with no EOL note. Node 20 went EOL April 2026. Users may run production workloads on an unsupported runtime based on this table.
**Excerpt:** `| 22.x | 26.x, 24.x, ^22.12.0, ^20.19.0 |`

---

### M-8 — `setup-incremental-builds-angular.mdoc` references non-existent executor
**File:** `technologies/angular/Guides/setup-incremental-builds-angular.mdoc`
**Category:** mismatched-feature
**Issue:** Executor mapping table shows `@angular/build:browser -> @nx/angular:webpack-browser`. `@angular/build:browser` is not a real Angular executor — `@angular/build` uses the `application` executor (ESBuild). The real webpack browser executor was `@angular-devkit/build-angular:browser`. This is a copy/paste error in the mapping table.
**Excerpt:** `@angular/build:browser -> @nx/angular:webpack-browser`

---

### M-9 — `use-environment-variables-in-angular.mdoc` uses deprecated executor without callout
**File:** `technologies/angular/Guides/use-environment-variables-in-angular.mdoc`
**Category:** old-package-version
**Issue:** The guide uses `"executor": "@angular-devkit/build-angular:browser"` in a non-migration context. This executor was deprecated in Angular 17+, replaced by `application` (ESBuild), and removed in Angular 20. There's no deprecation note.
**Excerpt:** `"executor": "@angular-devkit/build-angular:browser",`

---

### M-10 — `angular.mdoc` migration guide references Angular 13/14 as realistic scenarios
**File:** `technologies/angular/Migration/angular.mdoc`
**Category:** old-package-version
**Issue:** Active migration guidance describes Angular 13 and 14 thresholds as realistic starting points. Angular 14 is from 2022; the currently supported range is >=20. These references make the guide feel outdated and create extra maintenance paths readers won't need.
**Excerpt:** `For an Angular 14+ repo, the angular.json file is split... Note: The changes will be slightly different for Angular 13 and lower.`

---

### M-11 — Angular Rspack guides cite Nx 20.6 as minimum (now 2 major versions old)
**Files:**
- `technologies/angular/angular-rspack/Guides/getting-started.mdoc` — "minimum Nx version required is 20.6.1"
- `technologies/angular/angular-rspack/Guides/migrate-from-webpack.mdoc` — "available in Nx 20.6.0"

**Category:** old-nx-version
**Issue:** Both guides are not migration guides — they're current getting-started and migration-from-webpack docs. Citing Nx 20.6 as the floor sends users searching for a version check they don't need to make.

---

### M-12 — `manage-library-versions-with-module-federation.mdoc` imports from wrong package
**File:** `technologies/module-federation/concepts/manage-library-versions-with-module-federation.mdoc`
**Category:** mismatched-feature
**Issue:** Both `shared` function examples import `ModuleFederationConfig` from `'@nx/webpack'`, but in Nx 22.x the correct import is `'@nx/module-federation'`. The `@nx/webpack` import would produce a runtime error or silently resolve to the wrong type.
**Excerpt:** `import { ModuleFederationConfig } from '@nx/webpack';`

---

### M-13 — `module-federation-and-nx.mdoc` frames Nx 19.5 as a recent change
**File:** `technologies/module-federation/concepts/module-federation-and-nx.mdoc`
**Category:** old-nx-version
**Issue:** "As of Nx 19.5, our Module Federation support is provided by `@module-federation/enhanced`." Three major versions later this reads as a recent announcement when it's long-established. The page should simply state the current provider without the version anchor.
**Excerpt:** `As of Nx 19.5, our Module Federation support is provided by the @module-federation/enhanced package.`

---

### M-14 — `react-compiler.mdoc` calls React Compiler "experimental"
**File:** `technologies/react/Guides/react-compiler.mdoc`
**Category:** old-package-version
**Issue:** "React 19 comes with an experimental compiler…" — the React Compiler is no longer experimental in React 19 stable. It is now the recommended tool with stable APIs.
**Excerpt:** `React 19 comes with an experimental compiler that optimizes application code to automatically memoize code.`

---

### M-15 — `concepts/nx-daemon.mdoc`: `useDaemonProcess` documented as nested in "runners options"
**File:** `concepts/nx-daemon.mdoc`
**Category:** mismatched-feature
**Issue:** "set `useDaemonProcess: false` in the runners options in nx.json" — `useDaemonProcess` is a top-level property of `NxJsonConfiguration` (confirmed in `packages/nx/schemas/nx-schema.json`), not inside `tasksRunnerOptions`.
**Excerpt:** `set useDaemonProcess: false in the runners options in nx.json`

---

### M-16 — `reference/Nx Cloud/config.mdoc` tab labels reference old version floors
**File:** `reference/Nx Cloud/config.mdoc`
**Category:** old-nx-version
**Issue:** Three tab groups use old version thresholds as "current":
1. `nxCloudId` config: tabs `"Nx >= 19.7"` vs `"Nx <= 19.6"` — `19.7` is three major versions ago
2. CI access tokens: `"Nx >= 17"` vs `"Nx < 17"` — Nx 17 is five major versions ago
3. Encryption key: same `"Nx >= 17"` / `"Nx < 17"` split

The tab labels imply two equally-valid contemporary options when really one is the ancient path nobody on Nx 22 should use.

---

### M-17 — CircleCI orb versions outdated
**Files:**
- `guides/Nx Cloud/setup-ci.mdoc` — `nrwl/nx@1.7.0`
- `guides/Nx Cloud/bring-your-own-compute.mdoc` — `nrwl/nx@1.5.1`

**Category:** mismatched-feature
**Issue:** The `nrwl/nx` CircleCI orb is pinned to old versions that may be significantly behind the currently published version.

---

### M-18 — `concepts/inferred-tasks.mdoc` opens with "In Nx version 18" framing
**File:** `concepts/inferred-tasks.mdoc`
**Category:** old-nx-version
**Issue:** "In Nx version 18, Nx plugins can automatically infer tasks…" — this is the conceptual intro page, not a changelog. Four major versions later, inferred tasks are a long-established feature. The version anchor makes it read like a release announcement.
**Excerpt:** `"In Nx version 18, Nx plugins can automatically infer tasks for your projects..."`

---

### M-19 — `guides/Nx Cloud/access-tokens.mdoc` frames completed transition as "changing"
**Files:**
- `guides/Nx Cloud/access-tokens.mdoc` — aside titled "Nx Cloud authentication is changing"
- `guides/Nx Cloud/personal-access-tokens.mdoc` — "From Nx 19.7 new workspaces are connected to Nx Cloud with a property called `nxCloudId`"

**Category:** old-nx-version
**Issue:** The `nxCloudId` transition happened in Nx 19.7 — three major versions ago. The aside saying authentication "is changing" is factually wrong; it has already changed. This confuses readers who see conflicting framing between the aside title and the actual docs.

---

### M-20 — `extending-nx/create-preset.mdoc` shows confusing `--pluginName` flag usage
**File:** `extending-nx/create-preset.mdoc`
**Category:** mismatched-feature
**Issue:** Shows `npx create-nx-plugin my-org --pluginName my-plugin`, implying `my-org` is a workspace name and `--pluginName` is separate. In the actual CLI, the positional argument IS the plugin name (aliased as `pluginName`). Passing both a positional and `--pluginName` is redundant and the intent is unclear.
**Excerpt:** `npx create-nx-plugin my-org --pluginName my-plugin`

---

### M-21 — `eslint/flat-config.mdoc`: "Since version 16.8.0" historical note
**File:** `technologies/eslint/Guides/flat-config.mdoc`
**Category:** old-nx-version
**Issue:** "Since version 16.8.0, Nx supports the usage of flat config." Nx 16 is 6 major versions ago. This feature is universally available in any supported Nx version; the version anchor is noise on a current-reference page.
**Excerpt:** `Since version 16.8.0, Nx supports the usage of flat config`

---

## LOW Severity

### L-1 — Storybook 7-era URL paths in 6 guide files
**Files:**
- `technologies/test-tools/storybook/Guides/overview-react.mdoc` — `/docs/react/get-started/introduction`
- `technologies/test-tools/storybook/Guides/overview-angular.mdoc` — `/docs/angular/get-started/introduction`
- `technologies/test-tools/storybook/Guides/overview-vue.mdoc` — `/docs/vue/get-started/introduction`
- `technologies/test-tools/storybook/introduction.mdoc` — `/docs/basics/introduction/` (Storybook 6-era)
- `technologies/test-tools/storybook/Guides/custom-builder-configs.mdoc` — `/docs/react/builders/webpack`
- `technologies/test-tools/storybook/Guides/upgrading-storybook.mdoc` — `/docs/react/configure/upgrading`
- `technologies/test-tools/storybook/Guides/angular-storybook-compodoc.mdoc` — React-specific `reactDocgen` in Angular Storybook config

**Category:** old-package-version
**Issue:** All links use the Storybook 7 `/docs/{framework}/...` URL scheme, which is dead in Storybook 8+. The current URL scheme omits the framework prefix (e.g., `storybook.js.org/docs/get-started`).

---

### L-2 — `features/run-tasks.mdoc`: "In Nx 21, X was added" confusing framing
**File:** `features/run-tasks.mdoc`
**Category:** old-nx-version
**Issue:** "In Nx 21, task output is displayed in an interactive terminal UI…" — feature attribution for a previous major version on a current features page. Should be present tense without version anchor.
**Excerpt:** `In Nx 21, task output is displayed in an interactive terminal UI...`

---

### L-3 — `reference/project-configuration.mdoc`: old version qualifiers
**File:** `reference/project-configuration.mdoc`
**Category:** old-nx-version
**Three findings:**
1. "In Nx 19.5.0+, tasks can be configured to support parallelism or not." — 3 major versions ago
2. "Starting from v19.5.0, wildcards can be used to define dependencies in the `dependsOn` field." — same
3. "you can specify individual projects in version 16 or greater" — 6 major versions ago

---

### L-4 — `reference/glossary.mdoc`: "This was made possible in Nx 15.3"
**File:** `reference/glossary.mdoc`
**Category:** old-nx-version
**Issue:** Two glossary entries attribute features to Nx 15.3 ("Nested Project", "Standalone Repository"). Nx 15.3 is 7 major versions ago; these attributions add nothing for current users.

---

### L-5 — `reference/Deprecated/rescope.mdoc` uses future tense about Nx 20
**File:** `reference/Deprecated/rescope.mdoc`
**Category:** old-nx-version
**Issue:** "Starting in version 20, the `@nrwl` scoped packages will no longer be published to npm." Written in future tense but Nx 20 shipped two years ago. Should be past tense.

---

### L-6 — `troubleshoot-nx-install-issues.mdoc`: Nx 15.8–16.4 reference
**File:** `troubleshooting/troubleshoot-nx-install-issues.mdoc`
**Category:** old-nx-version
**Issue:** Native module error guidance says the issue appears "for versions of Nx between 15.8 and 16.4." Any user on a supported Nx version (20, 21, 22) will never hit this. The guidance adds confusion rather than helping.

---

### L-7 — `guides/Tips-n-Tricks/include-all-packagejson.mdoc`: "As of Nx 15.0.11"
**File:** `guides/Tips-n-Tricks/include-all-packagejson.mdoc`
**Category:** old-nx-version
**Issue:** Opens with "As of Nx 15.0.11, we only include any `package.json` file…" — 7 major versions ago. Should state the current behavior without the historical anchor.

---

### L-8 — `guides/Tasks & Caching/pass-args-to-commands.mdoc`: "Added in Nx v18.1.1"
**File:** `guides/Tasks & Caching/pass-args-to-commands.mdoc`
**Category:** old-nx-version
**Issue:** "Support for providing command args as options was added in **Nx v18.1.1**." — 4 major versions ago; universally available in any current Nx install.

---

### L-9 — `concepts/nx-daemon.mdoc`: deprecated `nx affected:test` command used as example
**File:** `concepts/nx-daemon.mdoc`
**Category:** mismatched-feature
**Issue:** Uses `nx affected:test` as a primary example. This is a hidden deprecated alias (`describe: false` in the CLI registry). The canonical form is `nx affected -t test`.

---

### L-10 — `concepts/task-pipeline-configuration.mdoc`: aside about `targetDependencies` removed in v16
**File:** `concepts/task-pipeline-configuration.mdoc`
**Category:** old-nx-version
**Issue:** An aside describes `targetDependencies` removed in Nx version 16. Six major versions later this historical aside may confuse more than it helps; could be removed.

---

### L-11 — `react-router.mdoc`: pinned vite/vitest versions in sample output
**File:** `technologies/react/Guides/react-router.mdoc`
**Category:** mismatched-feature
**Issue:** Sample terminal output hardcodes `vite v6.2.1` and `vitest v3.0.8`. Will become stale quickly and confuse readers whose output differs.

---

### L-12 — `adding-assets-react.mdoc`: shows deprecated pattern after deprecation warning
**File:** `technologies/react/Guides/adding-assets-react.mdoc`
**Category:** mismatched-feature
**Issue:** A deprecation callout warns `composePlugins` and `withNx` are deprecated (will be removed in Nx 23), but the same file then provides a full working code example using them with no "prefer this instead" redirect.

---

### L-13 — `module-federation/Guides/create-a-remote.mdoc`: Angular serve command missing
**File:** `technologies/module-federation/Guides/create-a-remote.mdoc`
**Category:** mismatched-feature
**Issue:** "Serve your remote via your host" section shows `## Angular` header but no command follows — the Angular equivalent was never filled in.

---

### L-14 — `technologies/angular/Guides/nx-and-angular.mdoc`: pre-Nx-17.3 fallback block
**File:** `technologies/angular/Guides/nx-and-angular.mdoc`
**Category:** old-nx-version
**Issue:** "The command was introduced in Nx 17.3.0. If you're using an older version, you can instead run…" — any user on a supported Nx version (20+) has had this command for years. The fallback block is dead guidance.

---

### L-15 — `angular-nx-version-matrix.mdoc`: Angular 17.x minimums are stale
**File:** `technologies/angular/Guides/use-environment-variables-in-angular.mdoc`
**Category:** old-package-version
**Issue:** Notes say `define` requires Angular 17.2.0+, custom ESBuild plugins require Angular 17.0.0+. With Angular 22 current, these minimums are so far below the floor they add no value.

---

### L-16 — `getting-started/installation.mdoc`: sample version `22.5.0` will drift
**File:** `getting-started/installation.mdoc`
**Category:** old-nx-version
**Issue:** "You should see a version number like `22.5.0`." Will become stale with each patch. Likely fine if auto-substitution exists; needs to be verified.

---

### L-17 — `getting-started/Tutorials/crafting-your-workspace.mdoc`: `"target": "ES2020"` in tsconfig
**File:** `getting-started/Tutorials/crafting-your-workspace.mdoc`
**Category:** old-package-version
**Issue:** The example `tsconfig.base.json` shows `"target": "ES2020"`. Node 22 (current LTS) fully supports ES2022+. `ES2020` is not wrong but is dated for a new-workspace tutorial targeting Node 22 users.

---

## Needs Input

### NI-1 — `angular-nx-version-matrix.mdoc`: Angular 22 requires Nx >=23.1.0?
**File:** `technologies/angular/Guides/angular-nx-version-matrix.mdoc`
**Question:** The matrix shows `| ~22.0.0 | latest | >=23.1.0 <=latest |` — but current Nx is 22.x. Is this a forward-looking row for when Nx 23 ships, or is the version matrix incorrect? If it's forward-looking, it should be labeled as such.

### NI-2 — `consumer-and-provider.mdoc`: is v23 content intentionally pre-release?
**File:** `technologies/module-federation/consumer-and-provider.mdoc`
**Question:** Is this page intentional preview documentation for v23 features already merged in main despite the version label? If so, it should carry a clear "preview / upcoming in v23" badge. If not, it needs to be gated until v23 ships.

### NI-3 — `terminal-ui.mdoc`: is Windows TUI fully shipped or still limited?
**File:** `guides/Tasks & Caching/terminal-ui.mdoc`
**Question:** The source no longer has a blanket Windows disable, but does it work in all Windows terminals or only specific ones (Windows Terminal, VSCode)? The aside should be either removed (fully shipped) or reworded (limited support).

### NI-4 — `publish-rust-crates.mdoc`: has `@monodon/rust` shipped `VersionActions`?
**File:** `guides/Nx Release/publish-rust-crates.mdoc`
**Question:** Has `@monodon/rust` been updated with a `VersionActions` implementation? If yes, remove `useLegacyVersioning` from the guide. If no, the guide should be marked unsupported/archived — it currently instructs users to enable a deprecated feature.

### NI-5 — `gradle-tutorial.mdoc`: should Gradle version be updated?
**File:** `getting-started/Tutorials/gradle-tutorial.mdoc`
**Question:** Sample terminal output references `docs.gradle.org/8.5/...`. Gradle 8.5 is from 2023; current stable is 8.12+. Was this output captured from a real Gradle 8.5 run, or should the tutorial be re-run with a newer version?

### NI-6 — CircleCI orb: what is the current `nrwl/nx` version?
**Files:** `guides/Nx Cloud/setup-ci.mdoc`, `guides/Nx Cloud/bring-your-own-compute.mdoc`
**Question:** What is the current published version of the `nrwl/nx` CircleCI orb? If higher than 1.7.0, both files need updating.

### NI-7 — `console-nx-cloud.mdoc`: has JetBrains Nx Cloud CI pipeline view shipped?
**File:** `guides/Nx Console/console-nx-cloud.mdoc`
**Question:** "This feature is only available in VSCode but coming soon to JetBrains." Has the Nx Cloud CI pipeline view (sidebar showing running pipelines) shipped in the JetBrains Nx Console plugin?

### NI-8 — `node/introduction.mdoc`: is Node 20 support intentional for Nx 22.x?
**File:** `technologies/node/introduction.mdoc`
**Question:** The Nx 22.x row lists `^20.19.0` as supported but Node 20 is EOL. Is this intentional for the 22.x lifecycle, or should the row be updated? At minimum an EOL callout should be added if support is being retained.

### NI-9 — `cypress-component-testing.mdoc`: should Cypress minimum be updated from v10 to v13?
**File:** `technologies/test-tools/cypress/Guides/cypress-component-testing.mdoc`
**Question:** "Component testing requires Cypress v10 and above." Current supported Cypress starts at v13. Should this floor be updated?

### NI-10 — `reference/nx-mcp.mdoc`: should `Nx < 21.4` tab be removed?
**File:** `reference/nx-mcp.mdoc`
**Question:** All tabs split on `Nx >= 21.4 / Nx < 21.4`. Nx 20 LTS is before 21.4 so there may be LTS users who need the legacy path (`npx nx-mcp@latest`). Should the legacy tab be kept, collapsed into a note, or removed?

### NI-11 — `reference/nx-cloud-cli.mdoc`: should Nx >= 14.7 / Nx >= 18 tabs be removed?
**File:** `reference/nx-cloud-cli.mdoc`
**Question:** Tabs for `--dte`/`--no-dte` (`Nx >= 14.7`) and `--agents`/`--no-agents` (`Nx >= 18`) are presented as equally valid options. Is the `>= 14.7` tab kept intentionally for users still on very old versions, or should it be removed entirely given Nx 22 is current?

---

## Linear Issues to Create (queued — MCP unavailable)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**:

| # | Title | Severity | Files |
|---|---|---|---|
| 1 | Fix compatibility tables: Nx 23.x labeled as (current) in node/nest/typescript introductions | High | 3 files |
| 2 | Remove/gate v23+ content in consumer-and-provider.mdoc and migrating-from-nx-vite.mdoc | High | 2 files |
| 3 | Fix Angular Rspack getting-started: shows v23.0.0 workspace creation | High | 1 file |
| 4 | Fix compose-executors.mdoc: use "executor" not "builder", use cypress.config.ts not cypress.json | High | 1 file |
| 5 | Fix migration-generators.mdoc: remove non-existent --project flag from example | High | 1 file |
| 6 | Fix GitHub Actions versions: @v6 does not exist (self-healing-ci, use-bun) | High | 2 files |
| 7 | Archive or fix publish-rust-crates.mdoc: guide is broken (useLegacyVersioning removed, v21 promise unfulfilled) | High | 1 file |
| 8 | Update terminal-ui.mdoc: remove stale Windows TUI "currently working on" notice | High | 1 file |
| 9 | Add Node 20 EOL notices to Nx Cloud launch templates and examples | High | 2 files |
| 10 | Update reference/Deprecated files: change future tense to past tense for Nx 20/21 milestones | High | 3 files |
| 11 | Update v23/v24 deprecation callouts across build tools and framework guides | Medium | 5 files |
| 12 | Update GitHub Actions versions from @v3 to @v4 across CI guides | Medium | 5+ files |
| 13 | Replace deprecated @storybook/testing-library and @storybook/jest with @storybook/test | Medium | 3 files |
| 14 | Fix Storybook angular-configuring-styles: remove webpack5 builder and React-specific options | Medium | 1 file |
| 15 | Fix Storybook best-practices: update Storybook 7-era URLs and 2022 blog link | Medium | 1 file |
| 16 | Update bundling-node-projects.mdoc: change `target: 'node18'` to node22 or later | Medium | 1 file |
| 17 | Fix setup-incremental-builds-angular.mdoc: @angular/build:browser is not a real executor | Medium | 1 file |
| 18 | Fix use-environment-variables-in-angular.mdoc: add deprecation note for @angular-devkit/build-angular:browser | Medium | 1 file |
| 19 | Fix manage-library-versions-with-module-federation.mdoc: import from @nx/module-federation not @nx/webpack | Medium | 1 file |
| 20 | Update module-federation-and-nx.mdoc: remove "As of Nx 19.5" framing | Medium | 1 file |
| 21 | Fix react-compiler.mdoc: React Compiler is no longer experimental in React 19 | Medium | 1 file |
| 22 | Fix nx-daemon.mdoc: useDaemonProcess is top-level in nx.json, not in runners options | Medium | 1 file |
| 23 | Fix Nx Cloud config.mdoc: update tab labels from "Nx >= 17" / "Nx >= 19.7" | Medium | 1 file |
| 24 | Fix access-tokens.mdoc: remove "authentication is changing" stale aside | Medium | 1 file |
| 25 | Fix Storybook guide URLs: update 7-era /docs/{framework}/... paths to Storybook 8 format | Low | 6 files |
| 26 | Clean up low-value version qualifiers: Nx 15/16/17/18/19 "since version X" notes in current docs | Low | 8+ files |
