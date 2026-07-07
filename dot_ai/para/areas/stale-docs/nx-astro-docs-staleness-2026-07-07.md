# Nx Astro Docs Staleness Audit — 2026-07-07

Scanned all 503 `.mdoc` files under `astro-docs/src/content/docs/` in `nrwl/nx` (branch `claude/nifty-euler-v5edd2`, HEAD `94de1b8`).
Baseline verified live this run: **`npm view nx version` → 23.0.1** (current major: 23). Node 20 EOL: April 2026 (still in support). React 19, Angular ~22.0.4, Vue ^3.5.13 current per `packages/*/src/utils/versions.ts`.

Method: 15 parallel research agents, one per doc subtree, each cross-checking every claim (version numbers, CLI flags, generator/executor options) against live source in `packages/*/src/**/schema.json` and `packages/*/package.json` rather than training-data assumptions, per the verification rules below.

**Linear MCP unavailable again — 6th consecutive scan (since 2026-06-11) where tickets could not be filed.** See "Linear Issues to Create" and the note at the bottom.

---

## Recurring problem: prior HIGH findings are still unfixed

These were flagged as HIGH severity in the **2026-06-29** audit and independently reconfirmed by this run's agents, still present, still broken:

| Prior ID | File | Status |
|---|---|---|
| H-5 | `extending-nx/compose-executors.mdoc` | **Still broken.** `"builder"` key instead of `"executor"`; `tsConfig` option doesn't exist on `@nx/cypress:cypress` schema. New this round: that executor is now also marked `x-deprecated` (removed in v24) with no notice in the doc. |
| H-6 | `extending-nx/migration-generators.mdoc` | **Still broken.** `--project=pluginName` flag does not exist on `@nx/plugin:migration` schema (`additionalProperties: false`). |
| H-9 | `guides/Nx Release/publish-rust-crates.mdoc` | **Still broken.** Central recipe still depends on `useLegacyVersioning`, now confirmed via source comment as `@deprecated Compat shim for @nx/js@21`, slated for removal. |
| H-10 | `guides/Tasks & Caching/terminal-ui.mdoc` | **Still broken.** "We are currently working on Windows support, so stay tuned" — `is-tui-enabled.ts` has had Windows capability detection since v21; 2 majors have passed with no doc update. |
| M-3 | `technologies/test-tools/storybook/Guides/{overview-react,overview-angular,storybook-interaction-tests}.mdoc` | **Still broken.** Still import `@storybook/testing-library` / `@storybook/jest`; current generator templates use `storybook/test`. |
| M-6 | `technologies/node/Guides/bundling-node-projects.mdoc` | **Still broken.** Vite example still targets `node18`, below Nx 23's supported floor (`^22.12.0`). |

None of these require design decisions — they're mechanical corrections (rename a key, delete a flag, swap an import, update a target string). The blocker every time has been ticket creation, not triage.

---

## Summary (this run)

| Category | High | Medium | Low / Needs Input |
|---|---|---|---|
| Old Nx version reference | 1 | 2 | 3 |
| Old Node/package version | 1 | 2 | 4 |
| Mismatched CLI/feature (deprecated or nonexistent options) | 11 | 3 | 3 |
| **Total** | **13** | **7** | **10** |

---

## HIGH Severity

### H-1 — `extending-nx/compose-executors.mdoc` (recurring, see above)
`"builder": "@nx/cypress:cypress"` should be `"executor"`; `tsConfig` isn't a real option on that executor's schema.json; the executor itself is now deprecated (removed in Nx v24) with no callout. `packages/nx/src/config/workspace-json-project-json.ts`, `packages/cypress/src/executors/cypress/schema.json`.

### H-2 — `extending-nx/migration-generators.mdoc` (recurring, see above)
Example passes `--project=pluginName`; `packages/plugin/src/generators/migration/schema.json` has no `project` property and `additionalProperties: false`.

### H-3 — `guides/Nx Release/publish-rust-crates.mdoc` (recurring, see above)
Recipe's core workaround (`useLegacyVersioning: true`) is a deprecated compat shim per `packages/nx/src/command-line/release/config/use-legacy-versioning.ts`.

### H-4 — `guides/Tasks & Caching/terminal-ui.mdoc` (recurring, see above)
"Coming soon" language for Windows TUI support that's already implemented in `is-tui-enabled.ts`.

### H-5 — Storybook deprecated test-library imports (recurring, see above)
`overview-react.mdoc`, `overview-angular.mdoc`, `storybook-interaction-tests.mdoc` import `@storybook/testing-library` / `@storybook/jest`; current generator template (`packages/react/.../__componentFileName__.stories.tsx__tmpl__`) uses `storybook/test`.

### H-6 — `technologies/node/Guides/bundling-node-projects.mdoc` (recurring, see above)
`target: 'node18'` in Vite example, below Nx 23's supported Node floor.

### H-7 — Module Federation guides teach deprecated generators/executors with no deprecation notice
**Files:** `technologies/module-federation/Guides/create-a-host.mdoc`, `create-a-remote.mdoc`, `federate-a-module.mdoc`, `technologies/module-federation/concepts/faster-builds-with-module-federation.mdoc`, `nx-module-federation-technical-overview.mdoc`, `module-federation-and-nx.mdoc`, `micro-frontend-architecture.mdoc`.
**Issue:** `@nx/react:host`, `:remote`, `:federate-module`, and the `module-federation-dev-server`/`-ssr-dev-server`/`-static-server` executors are all marked `x-deprecated` ("Removed in Nx v24") in current schema.json files (verified in `packages/react/src/utils/module-federation-deprecation.ts` and matching `schema.json`s), superseded by `@nx/react:consumer`/`:provider`. Only `consumer-and-provider.mdoc` in this doc set mentions the new model; the other 7 files present the old generators as the current, prescriptive path.

### H-8 — `reference/nx-json.mdoc` overstates which task options work at nx.json root
**File:** `reference/nx-json.mdoc` (line ~194).
**Issue:** Table claims `captureStderr`, `skipNxCache`, `encryptionKey`, `selectivelyHashTsConfig` "can be set at the root of `nx.json`." Verified against `packages/nx/src/config/nx-json.ts` and `packages/nx/schemas/nx-schema.json`: only `parallel` and `cacheDirectory` are actually wired as root-level properties; the other four are only read from `tasksRunnerOptions.<runner>.options`. Setting them at root is silently ignored.

### H-9 — `reference/releases.mdoc` supported-versions table one major behind
**File:** `reference/releases.mdoc` (line ~36).
**Issue:** Lists v22 as "Current"; actual current is v23.0.1. Per the page's own 18-month support policy, v20 (released 2024-10-06) should already show as out of support. Same root cause as June 29's H-1 (compatibility tables not updated at release time) — this table needs a process fix, not just a one-off edit, or it will drift again next release.

### H-10 — `guides/Nx Cloud/setup-ci.mdoc` — invalid `--ci=azure-pipelines` flag
**File:** `guides/Nx Cloud/setup-ci.mdoc` (line 180).
**Issue:** Azure tab says `nx g ci-workflow --ci=azure-pipelines`; `packages/workspace/src/generators/ci-workflow/schema.json` enum is `["github", "circleci", "azure", "bitbucket-pipelines", "gitlab"]` — no `azure-pipelines` value. Command as written fails schema validation.

### H-11 — `guides/Nx Release/configure-changelog-format.mdoc` — wrong import
**File:** `guides/Nx Release/configure-changelog-format.mdoc` (lines ~116-127).
**Issue:** Custom changelog renderer example does `import { ChangelogRenderer, ChangelogRenderOptions } from '@nx/js/release'`. No `@nx/js/release` entry point exists. Real source: default export `DefaultChangelogRenderer` from `nx/release/changelog-renderer` (`packages/nx/release/changelog-renderer/index.ts`; confirmed via `packages/nx/package.json` exports map).

### H-12 — `technologies/typescript/Guides/compile-multiple-formats.mdoc` — deprecated executor taught as current
**File:** `technologies/typescript/Guides/compile-multiple-formats.mdoc` (line 48), duplicated in `define-secondary-entrypoints.mdoc` (line 93).
**Issue:** Documents `@nx/rollup:rollup` as a current alternative; `packages/rollup/src/executors/rollup/schema.json` marks it `x-deprecated`, removal planned Nx v24.

### H-13 — `technologies/test-tools/detox/introduction.mdoc` — contradicts itself on target names
**File:** `technologies/test-tools/detox/introduction.mdoc` (lines 96-106 vs 74-94).
**Issue:** "Using detox" section documents `test-ios`/`build-ios`/`build-android` targets, which only exist under the deprecated non-inferred-plugin generator path (`packages/detox/src/generators/application/lib/add-project.ts`). With the (now-default) `@nx/detox/plugin` registered, targets are named `build`/`start`/`test` instead — as the doc's own earlier section states. The corresponding executors (`packages/detox/src/executors/{test,build}/schema.json`) are `x-deprecated`, removed in v24.

---

## MEDIUM Severity

### M-1 — `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc` — wrong default value
**Issue:** States `NxAppWebpackPlugin`'s `externalDependencies` option "Default is `none`." Actual default per `packages/webpack/src/plugins/nx-webpack-plugin/lib/apply-base-config.ts:53` (`options.externalDependencies ??= 'all'`) and the option's own JSDoc is `all`. Backwards from real behavior — a real footgun, not just stale prose.

### M-2 — `technologies/react/Guides/adding-assets-react.mdoc` — SVGR removal already happened, documented as future
**Issue:** "As of Nx 22, SVGR is removed for Webpack and Next.js, and deprecated for Rspack (will be removed in Nx 23)." Current is 23.0.1 — this already shipped in 23.0.0 per `packages/rspack/src/migrations/update-23-0-0/add-svgr-to-rspack-config.md`. The doc's generic Rspack SVGR recipe also doesn't match the pattern the real migration generates (`withSvgr(...)` composable vs. a hand-rolled `file-loader` rule).

### M-3 — `knowledge-base/troubleshooting/troubleshoot-convert-to-inferred.mdoc` — option casing typo
**Issue:** Remix section says `generateLockFile` (capital F); actual `@nx/remix:build` schema property is `generateLockfile`. The Next.js section two paragraphs above correctly uses lowercase for the equivalent option, confirming this is a typo.

### M-4 — Storybook `addon-essentials`/`core.builder` pattern stale across 7 guides
**Files:** `configuring-storybook.mdoc`, `angular-configuring-styles.mdoc`, `angular-storybook-compodoc.mdoc`, `one-storybook-for-all.mdoc`, `one-storybook-per-scope.mdoc`, `one-storybook-with-composition.mdoc`, `storybook-composition-setup.mdoc` (all under `technologies/test-tools/storybook/Guides/`).
**Issue:** Sample `main.ts` snippets show `addons: ['@storybook/addon-essentials', '@storybook/addon-interactions']` and (in one file) `core: { builder: '@storybook/builder-webpack5' }`. Verified against current v10 generator template (`packages/storybook/src/generators/configuration/files/v10/.../main.ts__tmpl__`): neither addon nor that builder config shape appears in what Nx actually generates today (folded into Storybook core by v9). Broader/more-file version of June 29's M-4.

### M-5 — `technologies/test-tools/cypress/Guides/cypress-component-testing.mdoc` — stale minimum version, now confirmed
**Issue:** "Component testing requires Cypress v10 and above." Actual supported range per `packages/cypress/package.json` is `>= 13 < 16` — 3 majors stale. (June 29 listed this as a Needs-Input question — now confirmed as a real finding since the actual floor is verifiable in `package.json`.)

### M-6 — `guides/Tips-n-Tricks/standalone-to-monorepo.mdoc` — legacy ESLint config shown as current default
**Issue:** Config-file reference tables list `.eslintrc.json`/`.eslintrc.base.json` as the current root/project config files. `packages/eslint/src/generators/utils/config-file.ts` shows Nx now defaults to flat config (`eslint.config.mjs`, `eslint.base.config.mjs`). Still technically supported, so following the guide won't break, but it no longer matches what current generators scaffold.

### M-7 — `guides/Tips-n-Tricks/keep-nx-versions-in-sync.mdoc` — flag usage example is wrong shape
**Issue:** "Run `nx migrate --from=[minimumVersion] --to=[maximumVersion]`" implies a bare version number. `packages/nx/src/command-line/migrate/migrate.ts` (`versionOverrides`) requires `package@version` format and throws otherwise.

---

## Needs Input

- **rsbuild/introduction.mdoc & rspack/introduction.mdoc** — "Default Installed" version pins (`2.0.6`/`2.0.3`) are one patch behind actual (`2.0.7`/`2.0.4` in `versions.ts`). Low value as individual tickets — this is routine patch churn that will re-drift immediately; better addressed by generating these tables from source at build time than by hand-fixing each patch bump. Flagging the process gap, not asking for a one-off edit.
- **`reference/Nx Cloud/bring-your-own-compute.mdoc`** — `NX_CLOUD_DISTRIBUTED_EXECUTION: true` env var shown as the DTE-enabling mechanism, but `reference/environment-variables.mdoc` now describes that var as "typically not needed, disables DTE when `false`"; the same code block already calls `nx start-ci-run --distribute-on=`, the actual current mechanism. Possible leftover/contradiction — needs a docs-team call on which mechanism to lead with.
- **GitHub Actions / CircleCI orb version drift across CI guides** (`bring-your-own-compute.mdoc` uses `checkout@v4`/`setup-node@v3`/orb `1.5.1` vs. `setup-ci.mdoc`'s `setup-node@v4`/orb `1.7.0`; `adding-to-existing-project.mdoc`/`adding-to-monorepo.mdoc` use `setup-node@v3`) — third-party action/orb versions aren't verifiable from this repo's source (no network access to check actions/setup-node's actual latest release this run), so confidence is low on which pin is "right." Recommend the docs team spot-check current majors directly rather than trust this audit's guess.
- **`getting-started/installation.mdoc`** — sample `nx --version` output shows `22.5.0` vs. actual current `23.0.1`; purely illustrative text, low priority, but drifts every release.
- **Storybook Angular docgen options** (`angular-storybook-compodoc.mdoc`) — includes React-specific `reactDocgen`/`reactDocgenTypescriptOptions` in an Angular-only guide. Might be a copy-paste bug rather than staleness; needs a docs-team look rather than a source-code cross-check.
- **Illustrative example text that reads dated but isn't prescriptive** — `yarn-pnp.mdoc` (`yarn@3.6.1` in a generated-file example), `browser-support.mdoc` (2020-era browserslist sample output), `root-level-scripts.mdoc` (`yarn run v1.22.19` in a terminal transcript). Cosmetic; not filing tickets, noting for awareness only.
- **`technologies/module-federation/concepts/module-federation-and-nx.mdoc`** — "As of Nx 19.5" framing was flagged stale in the June 29 audit (M-13) but this round's agent judged it still factually accurate (package.json still requires `@module-federation/enhanced ^2.0.0`) and declined to flag it. Splitting the difference: leaving as Needs Input rather than re-queuing as a confirmed bug — a human call on whether the historical framing itself is worth removing, independent of accuracy.

---

## Linear Issues to Create (queued — MCP unavailable, 6th consecutive scan)

Group into these issues for the **Docs** team, **Triage** state, labeled **"Good for AI agents"**, assignee: **Linear agent** if assignable, otherwise unassigned:

| # | Title | Severity | Files | Status |
|---|---|---|---|---|
| 1 | Fix compose-executors.mdoc: "executor" not "builder", drop nonexistent tsConfig option, note cypress executor deprecation | High | 1 | Recurring since 06-29 |
| 2 | Fix migration-generators.mdoc: remove nonexistent --project flag from example | High | 1 | Recurring since 06-29 |
| 3 | Fix or archive publish-rust-crates.mdoc: useLegacyVersioning is a deprecated shim | High | 1 | Recurring since 06-29 |
| 4 | Fix terminal-ui.mdoc: remove stale "Windows support coming soon" notice | High | 1 | Recurring since 06-29 |
| 5 | Replace deprecated @storybook/testing-library / @storybook/jest imports with storybook/test | High | 3 | Recurring since 06-29 |
| 6 | Update bundling-node-projects.mdoc: node18 target below Nx 23's supported floor | High | 1 | Recurring since 06-29 |
| 7 | Add deprecation notices to Module Federation host/remote/federate-module guides, point to consumer/provider | High | 7 | New |
| 8 | Fix nx-json.mdoc: 4 task options incorrectly documented as settable at nx.json root | High | 1 | New |
| 9 | Update releases.mdoc supported-versions table (shows v22 as current; actual is v23) | High | 1 | New |
| 10 | Fix setup-ci.mdoc: --ci=azure-pipelines is not a valid value, should be --ci=azure | High | 1 | New |
| 11 | Fix configure-changelog-format.mdoc: wrong import path/name for ChangelogRenderer | High | 1 | New |
| 12 | Update compile-multiple-formats.mdoc / define-secondary-entrypoints.mdoc: @nx/rollup:rollup is deprecated | High | 2 | New |
| 13 | Fix detox/introduction.mdoc: self-contradicting target names, deprecated executor path | High | 1 | New |
| 14 | Fix webpack-plugins.mdoc: externalDependencies default is documented backwards (says none, is all) | Medium | 1 | New |
| 15 | Fix adding-assets-react.mdoc: SVGR-for-Rspack already removed in 23.0.0, not "will be removed in 23" | Medium | 1 | New |
| 16 | Fix troubleshoot-convert-to-inferred.mdoc: generateLockFile casing typo (Remix section) | Medium | 1 | New |
| 17 | Update Storybook addon-essentials/core.builder examples across 7 guide pages to match current v9/v10 templates | Medium | 7 | Expanded from 06-29 M-4 |
| 18 | Update cypress-component-testing.mdoc: minimum version v10 is 3 majors stale, actual floor is v13 | Medium | 1 | Confirmed from 06-29 NI-9 |
| 19 | Update standalone-to-monorepo.mdoc: legacy .eslintrc shown as current default, Nx now defaults to flat config | Medium | 1 | New |
| 20 | Fix keep-nx-versions-in-sync.mdoc: nx migrate --from example implies bare version, flag requires package@version | Medium | 1 | New |

**20 issues queued this run, 6 of them repeats of tickets queued (and never filed) on 2026-06-29, 06-24, 06-17, 06-12, and/or 06-11.** The audit process is working — verification against live source is catching real, reproducible bugs — but the loop from "found" to "fixed" is broken because Linear write access has not worked in any of the last 6 runs. Recommend a human either (a) fixes the Linear MCP connection so future scans can actually file these, or (b) manually creates this run's 20 issues (and the 6 recurring ones) from this file so the docs team has visibility independent of the MCP status.
