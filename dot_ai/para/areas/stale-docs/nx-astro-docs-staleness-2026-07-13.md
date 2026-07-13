# Nx Astro Docs Staleness Audit — 2026-07-13

**Scope:** full sweep of all **511** `.mdoc` files under `astro-docs/src/content/docs/` (10 parallel top-level agents, each fanning out into further sub-agents per subfolder — ~35 leaf audits total). This is the broadest pass since the 2026-06-29 full sweep, and specifically targeted the three smells requested this cycle: (1) old Nx major version presented as current, (2) old Node/npm/framework version presented as current, (3) documented CLI flags/config keys/generator options that don't match `packages/` source.

Baseline verified live from this repo (not training data): current Nx is **23.1.0-beta.7** (root `package.json`). Node 20 EOL'd April 2026 (already passed as of today); Node 22/24 are current LTS. Default React scaffolded by Nx is **^19.0.0** (peer range `>=18.0.0 <20.0.0`).

**Linear MCP unavailable again — 7th consecutive audit cycle.** See escalation note at the bottom. All issues below are queued for manual creation, merged into the running backlog from prior audits.

---

## Summary

| Category | Confirmed (new) | Confirmed (re-verified from prior backlog) | Needs Input |
|---|---|---|---|
| Old Nx version presented as current | 1 | 2 | ~20 (mostly "Nx 21/22" historical-footnote framing, borderline by design) |
| Old Node/npm/framework version presented as current | 2 | 0 | 2 |
| Mismatched CLI/config/generator option vs. source | ~30 | 4 | ~15 |
| **Total** | **~33** | **6** | **~37** |

This cycle surfaced substantially more than 07-10's targeted pass because it covered all 511 files rather than a 3-agent sample. The single biggest theme: **deprecated generators/executors presented as the current, first-class way to do something, with zero deprecation notice** — this pattern repeats across Module Federation (React + Angular), Cypress, Rollup, ESLint, React Native, and Storybook docs.

---

## Confirmed Findings

### Deprecated features presented as current (highest-impact theme)

**Module Federation — React + Angular (NEW, High severity, 10 files)**
`consumer-and-provider.mdoc` correctly states that as of Nx 23, `@nx/react:host`/`:remote`/`:federate-module` and the Angular equivalents are deprecated and removed in Nx v24 (confirmed via `warnReactHostGeneratorDeprecation` etc. in `packages/react/src/generators/`, and `x-deprecated` in `packages/angular/generators.json`). But the following files never mention this and teach the deprecated generators as the standard path:
- `technologies/module-federation/Guides/create-a-host.mdoc`
- `technologies/module-federation/Guides/create-a-remote.mdoc`
- `technologies/module-federation/Guides/federate-a-module.mdoc`
- `technologies/module-federation/concepts/module-federation-and-nx.mdoc`
- `technologies/module-federation/concepts/micro-frontend-architecture.mdoc`
- `technologies/module-federation/concepts/faster-builds-with-module-federation.mdoc`
- `technologies/module-federation/concepts/nx-module-federation-technical-overview.mdoc`
- `technologies/angular/Guides/dynamic-module-federation-with-angular.mdoc`
- `technologies/angular/Guides/module-federation-with-ssr.mdoc`
- `technologies/angular/introduction.mdoc` (the most visible entry point for the technology)

Also in `dynamic-module-federation-with-angular.mdoc`: the "what was generated" explanation wrongly claims both host and remote get `@nx/angular:dev-server` — only the remote does; the host gets `@nx/angular:module-federation-dev-server` (confirmed in `packages/angular/src/generators/setup-mf/lib/setup-serve-target.ts`).

**Other deprecated executors/generators shown with no migration notice (NEW, High severity, 4 files)**
- `technologies/test-tools/cypress/introduction.mdoc` — `@nx/cypress:cypress` executor (deprecated, removed in v24 per its schema's `x-deprecated`) shown as an equally valid alternative to inferred tasks.
- `technologies/typescript/Guides/compile-multiple-formats.mdoc` — same issue for `@nx/rollup:rollup` executor.
- `technologies/eslint/eslint-plugin/Guides/dependency-checks.mdoc` — same issue for `@nx/eslint:lint` executor.
- `technologies/react/react-native/introduction.mdoc` — documents an `upgrade-native` **generator** that doesn't exist at all (`packages/react-native/generators.json` has no such entry); the closest thing is the `@nx/react-native:upgrade` **executor**, itself deprecated.

### Config/CLI reference drift (verified wrong against source)

- **`reference/nx-json.mdoc`** and **`reference/environment-variables.mdoc`** (NEW, High) — the "Task options" table lists `captureStderr` and `skipNxCache` as root `nx.json` properties; neither exists there (`NxJsonConfiguration` in `packages/nx/src/config/nx-json.ts` has no such fields — they only ever existed under the deprecated `tasksRunnerOptions.<runner>.options`). `encryptionKey` is documented as a root property, but the real property is `nxCloudEncryptionKey` (confirmed in `packages/nx/src/tasks-runner/run-command.ts`). `selectivelyHashTsConfig` isn't a documented root config path in the type or schema at all.
- **`reference/releases.mdoc`** (NEW, High) — the Nx version support table lists **v22 as "Current"**. Current is v23; by the doc's own 6-month cadence, v22 should now show as LTS and v20 should have aged out of the 18-month support window entirely. Easiest, highest-confidence fix in this whole audit.
- **`reference/Deprecated/as-provided-vs-derived.mdoc`** (re-verified, = prior backlog #10, new detail) — `--projectNameAndRootFormat`/`--nameAndDirectoryFormat` flags and the interactive "As provided/Derived" prompt have been **fully removed from source**, not merely deprecated (zero matches anywhere in `packages/`). The doc's "Writing scripts" fix section gives commands that would fail with an unknown-flag error today.
- **`reference/Deprecated/v1-nx-plugin-api.mdoc`** (re-verified, = prior backlog #10 / prior C-1) — still says "will be removed in Nx 20" in future tense; `processProjectGraph`/`registerProjectTargets` are confirmed already fully removed from the call path.
- **`extending-nx/migration-generators.mdoc`** (re-verified, = prior backlog #5) — `--project=pluginName` flag still doesn't exist on the migration generator's schema (`additionalProperties: false`).
- **`concepts/nx-daemon.mdoc`** (re-verified, = prior backlog #22) — still says to set `useDaemonProcess: false` "in the runners options"; it's a top-level `nx.json` property, confirmed via the very migrations (`update-17-0-0`, `update-20-0-0`) that moved it there.
- **`guides/Nx Release/publish-rust-crates.mdoc`** (re-verified, = prior backlog #7, new detail) — confirmed the core workaround is now **dead code**: `useLegacyVersioning` is tagged `@deprecated` / `// TODO(v23): remove` and is no longer consulted anywhere in the version pipeline, so the doc's central recipe silently does nothing on Nx 23.
- **`guides/Nx Release/configure-changelog-format.mdoc`** (NEW, High) — the custom changelog renderer example imports a nonexistent `ChangelogRenderer` named export from `@nx/js/release` and overrides a `renderMarkdown()` method. The real base class is the **default** export `DefaultChangelogRenderer` from `nx/release/changelog-renderer`, and the method to override is `render()`. A renderer written per this doc would fail to import.
- **`features/CI Features/sandboxing.mdoc`** (NEW, Medium) — documents `nx show target <project>:<target> --inputs --outputs` as flags; `inputs`/`outputs` are actually subcommands (`nx show target inputs ...` / `nx show target outputs ...`), confirmed in `packages/nx/src/command-line/show/command-object.ts`.
- **`guides/Nx Cloud/setup-ci.mdoc`** (NEW, Medium) — `nx g ci-workflow --ci=azure-pipelines` is invalid; the schema only accepts `azure` (among others).
- **`guides/Nx Cloud/enable-ai-features.mdoc`** (NEW, Medium) — the `helm-values.yaml` example is invalid YAML (missing colons after the `nxApi` and `frontend` keys).
- **`guides/Nx Cloud/record-commands.mdoc`** (NEW, Low) — cites an ancient "Nx Cloud 13.3" minimum version, and one screenshot uses a dead absolute `nx.dev` URL while the other two in the same file correctly use the current relative asset path.
- **`technologies/build-tools/webpack/Guides/webpack-plugins.mdoc`** (NEW, Medium) — `deleteOutputPath` is documented as merely "Deprecated"; it has actually been fully removed from `NxAppWebpackPluginOptions` (there's even a migration, `update-22-0-0/remove-deprecated-options.ts`, that strips it from existing configs).
- **`technologies/react/next/index.mdoc`** and **`technologies/react/expo/introduction.mdoc`** (NEW, Medium) — Next.js floor documented as `15.0.0` but the actual enforced/declared floor is `14.0.0`; Expo's supported-version table is missing v56, which is now the default for new projects.
- **`technologies/vue/nuxt/index.mdoc`** (NEW, Medium) — documents a fabricated `testTargetName` plugin option; `@nx/nuxt` infers no test target at all (confirmed against `NuxtPluginOptions` in `packages/nuxt/src/plugins/plugin.ts`).
- **`technologies/dotnet/Guides/incremental-builds.mdoc`** and **`migrate-from-nx-dotnet-core.mdoc`** (NEW, Medium) — the `restore` target example wrongly shows `"cache": true` (restore is never cacheable per source); the `watch`-as-`serve` example places `"args"` as a direct sibling of `targetName` instead of nested under `options`.
- **`guides/Tips-n-Tricks/include-all-packagejson.mdoc`** (NEW, High — whole recipe is obsolete) — three compounding issues: cites Nx 15.0.11 as the behavioral baseline; names the file `pnpm-workspaces.yml` (real name is `pnpm-workspace.yaml`); and tells users to opt in via `"plugins": ["nx/plugins/package-json"]` in `nx.json`, but the real plugin name is `nx/core/package-json` and it's already loaded automatically for every workspace — the actual current toggle is the `NX_INFER_ALL_PACKAGE_JSONS` env var.
- **`guides/Tips-n-Tricks/analyze-source-files.mdoc`** (NEW, Medium) — oversimplifies `analyzeSourceFiles`'s default logic as "true except for Lerna repos"; actual logic (`packages/nx/src/plugins/js/utils/config.ts`) branches on whether the root `package.json` depends on specific `@nx/*` packages, unrelated to Lerna.
- **`guides/Tips-n-Tricks/standalone-to-monorepo.mdoc`** (NEW, Medium) — config-file table only lists legacy `.eslintrc.json`/`.eslintignore`; Nx's ESLint generators default to flat config (`eslint.config.mjs`) now, which isn't mentioned at all.
- **`guides/ci-deployment.mdoc`** (NEW, Medium) — stale "we're working on an `NxVitePlugin`... stay tuned" note; `generatePackageJson` already shipped on `@nx/vite:build`.

### Storybook (NEW, High — spans 8+ files)

- `introduction.mdoc`, `Guides/configuring-storybook.mdoc`, `Guides/angular-configuring-styles.mdoc`, `Guides/angular-storybook-compodoc.mdoc`, `Guides/one-storybook-for-all.mdoc`, `Guides/one-storybook-per-scope.mdoc`, `Guides/one-storybook-with-composition.mdoc`, `Guides/storybook-composition-setup.mdoc` all show/imply the generator adds `@storybook/addon-essentials` and `@storybook/addon-interactions` to the generated config. Verified against the actual `main.ts` generator templates: the addons array is empty except a conditional Nx plugin entry; `addon-essentials` folded into core Storybook 9+, and `addon-interactions` is never installed by the generator at all.
- `Guides/storybook-interaction-tests.mdoc` — `--interactionTests=true` is claimed to add `@storybook/addon-interactions` plus the `@storybook/testing-library`/`@storybook/jest` packages; verified it only adds a `test-storybook` target, none of those packages.
- `Guides/overview-angular.mdoc`, `Guides/overview-react.mdoc`, `Guides/storybook-interaction-tests.mdoc` (**re-verified, = prior backlog #13**) — still show `import { within, userEvent } from '@storybook/testing-library'` / `import { expect } from '@storybook/jest'`; current generator snapshots use `import { expect } from 'storybook/test'` with no manual `within(canvasElement)`.
- `introduction.mdoc` (NEW, Low) — lists `@storybook/vue-vite` as a selectable framework; the real enum value is `@storybook/vue3-vite`.

---

## Needs Input (condensed — full detail in each sub-agent's findings above)

**Borderline "Nx 21/22 as version-gate" mentions (~20 instances)** — these read as historical/feature-introduction framing rather than "current version" claims, so were not flagged as hard findings, but are numerous enough to warrant a docs-team policy call (prune once a feature has been default for 2+ majors, or leave for historical clarity): `playwright/merge-atomized-outputs.mdoc`, `cypress/cypress-component-testing.mdoc`, `typescript/introduction.mdoc`, `java/introduction.mdoc` + `maven/introduction.mdoc` ("experimental, requires Nx 22+"), `guides/Tasks & Caching/terminal-ui.mdoc`, `concepts/Decisions/dependency-management.mdoc`, `features/run-tasks.mdoc`, `features/CI Features/sandboxing.mdoc` + `resource-usage.mdoc`, `getting-started/installation.mdoc` (example output "22.5.0"), `dotnet/introduction.mdoc` + `migrate-from-nx-dotnet-core.mdoc`, `build-tools/vite/introduction.mdoc`, `guides/Nx Release/*` (several "Nx 22+" tabs), `guides/Nx Cloud/bring-your-own-compute.mdoc` (7 instances), `reference/nx-json.mdoc` (cluster of Nx 22/23 badges), `angular-rspack/getting-started.mdoc` + `migrate-from-webpack.mdoc`.

**Version numbers in code-example output (not setup requirements) — deliberately not flagged**, e.g. Vite/Vitest CLI output in `react-router.mdoc`.

**Unverifiable — closed-source Nx Cloud / Nx Console / external packages (~15 instances)**: `@nx/conformance` and `@nx/owners` (enterprise-only, not in this OSS repo); Nx Cloud server-side SCIM/SAML contracts; `nx-cloud` CLI subcommands (`onboard connect-workspace`, `get sandbox-reports`, etc.); `nx mcp` flags (thin passthrough to a separate `nx-mcp` package); `@nx/netlify` and `@nx/aws-lambda` generators (package not in this repo); `npx skills add` (external tool); Homebrew/Chocolatey/apt install channels for `nx`.

**Possible discrepancy to double-check next cycle**: prior backlog item #18 ("Fix `use-environment-variables-in-angular.mdoc`: add deprecation note for `@angular-devkit/build-angular:browser`") — today's full re-read of that file reported **no discrepancy found**. Worth confirming whether it was already fixed since 07-10, or whether today's agent missed it.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Items 1–27 carried forward unchanged from the [2026-07-10](./nx-astro-docs-staleness-2026-07-10.md) / [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) audits. Re-verified this cycle: **#5, #7, #10, #13 (expanded, see #30 below), #22**. New items start at #28.

| # | Title | Severity | Files |
|---|---|---|---|
| 1–27 | *(unchanged — see 2026-07-10 audit for full list)* | — | — |
| 28 | Add deprecation notice + link to consumer-and-provider.mdoc across all Module Federation host/remote/federate-module docs (React + Angular) | **High** | 10 files |
| 29 | Fix dynamic-module-federation-with-angular.mdoc: host uses `module-federation-dev-server`, not `dev-server` | Medium | 1 file |
| 30 | Fix Storybook fabricated `addon-essentials`/`addon-interactions` in generated-config examples (expands prior #13) | **High** | 8 files |
| 31 | Fix storybook-interaction-tests.mdoc: `--interactionTests` doesn't install addon-interactions/testing-library/jest | Medium | 1 file |
| 32 | Fix Storybook introduction.mdoc: `@storybook/vue-vite` → `@storybook/vue3-vite` | Low | 1 file |
| 33 | Fix configure-changelog-format.mdoc: wrong import/class/method for custom changelog renderer | **High** | 1 file |
| 34 | Fix reference/releases.mdoc: version support table stale (v22 shown as "Current") | **High** | 1 file |
| 35 | Fix nx-json.mdoc + environment-variables.mdoc: fake root properties (`captureStderr`, `skipNxCache`, `selectivelyHashTsConfig`) and `encryptionKey` → `nxCloudEncryptionKey` | **High** | 2 files |
| 36 | Fix as-provided-vs-derived.mdoc: flags are fully removed, not just deprecated (expands prior #10) | **High** | 1 file |
| 37 | Fix include-all-packagejson.mdoc: wrong filename, wrong/nonexistent plugin registration, stale Nx 15 baseline | **High** | 1 file |
| 38 | Fix analyze-source-files.mdoc: oversimplified/wrong `analyzeSourceFiles` default logic | Medium | 1 file |
| 39 | Fix standalone-to-monorepo.mdoc: missing flat-config (eslint.config.mjs) as current default | Medium | 1 file |
| 40 | Fix CI Features/sandboxing.mdoc: `nx show target` inputs/outputs are subcommands, not flags | Medium | 1 file |
| 41 | Fix ci-deployment.mdoc: stale "NxVitePlugin coming soon" note | Medium | 1 file |
| 42 | Fix dotnet incremental-builds.mdoc + migrate-from-nx-dotnet-core.mdoc: wrong cache/args config examples | Medium | 2 files |
| 43 | Fix Vue nuxt/index.mdoc: fabricated `testTargetName` plugin option | Medium | 1 file |
| 44 | Add deprecation notices for `@nx/cypress:cypress`, `@nx/rollup:rollup`, `@nx/eslint:lint` executors + fix nonexistent `upgrade-native` generator in react-native docs | **High** | 4 files |
| 45 | Fix Nx Cloud setup-ci.mdoc: `--ci=azure-pipelines` → `--ci=azure` | Medium | 1 file |
| 46 | Fix Nx Cloud enable-ai-features.mdoc: invalid YAML in helm-values example | Medium | 1 file |
| 47 | Fix Nx Cloud record-commands.mdoc: ancient version citation + dead image URL | Low | 1 file |
| 48 | Fix webpack-plugins.mdoc: `deleteOutputPath` is fully removed, not "deprecated" | Medium | 1 file |
| 49 | Fix react/next + expo version tables: wrong Next.js floor (15.0.0 vs actual 14.0.0), missing Expo v56 | Medium | 2 files |
| 50 | Fix createnodes-compatibility.mdoc: future tense for already-shipped `createNodesV2` deprecation | Low | 1 file |
| 51 | Fix project-graph-plugins.mdoc + tooling-plugin.mdoc: tutorials model deprecated createNodesV2-only export pattern | Low | 2 files |

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-13) where Linear issue creation could not be completed programmatically. Same symptom as 07-10: `ListConnectors` reports Linear as `enabledInChat: true`, but `ToolSearch` returns zero matching tools for any Linear-related query — no Linear tools are exposed to the session at all. This has now failed seven times running; strongly recommend investigating directly in claude.ai connector settings (re-auth or reinstall the Linear connector) rather than continuing to retry per-audit.

## Recurring Checks to Run

(unchanged — see top-level README checklist)
