# Nx Astro Docs Staleness Audit — 2026-07-03

Scanned all 503 `.mdoc` files under `astro-docs/src/content/docs/` in `nrwl/nx` (full re-sweep, not a diff-only pass).

**Live baseline (fetched from npm registry today, not training data):**
Nx **23.0.1** (stable; `23.0.0` shipped 2026-06-16; `23.1.0` is beta-only) | Node 20 LTS **EOL April 2026** (confirmed past) | Node 18 EOL April 2025 | React 19.2.7 | TypeScript 6.0.3 | Angular 22.0.5 | Cypress 15.18.0 | **Storybook 10.4.6** (not 8) | Vite 8.1.3

Linear MCP still unavailable this session — all issues queued for manual creation at the bottom, same as every prior audit.

---

## ⚠️ Corrections to the 2026-06-29 audit

The prior audit used the wrong Nx baseline for part of its scan (its own note flagged this) and treated Nx 23 as unreleased. **Nx 23.0.0 actually shipped 2026-06-16 — before that audit ran.** Live-verified today: Nx 23.0.1 is genuinely current. The following prior findings are **false positives and should be retracted / closed, not filed**:

| ID | File(s) | Why it's actually fine |
|---|---|---|
| H-1 | `technologies/node/introduction.mdoc`, `technologies/node/nest/introduction.mdoc`, `technologies/typescript/introduction.mdoc` | "23.x (current)" is correct — Nx 23.0.1 **is** current. Verified all three tables live today. |
| H-2 / NI-2 | `technologies/module-federation/consumer-and-provider.mdoc` | The "(v23+)" page and its content are accurate now that v23 shipped. Not pre-release content — verified the `@nx/react:consumer`/`:provider` framing matches a released version. |
| H-3 | `technologies/test-tools/vitest/Guides/migrating-from-nx-vite.mdoc` | "Nx 23 removed vitest support from `@nx/vite`" is now factually correct (v23 is out). |
| H-4 | `technologies/angular/angular-rspack/Guides/getting-started.mdoc` | Showing `v23.0.0` workspace creation output is accurate — that's what a real `create-nx-workspace` run produces today. |
| M-1 | `configure-vite.mdoc`, `webpack-config-setup.mdoc`, `webpack-plugins.mdoc`, `adding-assets-react.mdoc`, `next-config-setup.mdoc` | "Deprecated, removed in v24, still works in v23" is now exactly correct framing (v23 current, v24 future). Re-verified all five asides live today — text unchanged, and now accurate. |

Everything else in the 2026-06-29 report (H-5 through H-13, M-2 through M-21 except M-1, L-1 through L-17, remaining Needs-Input items) was **not** part of the version-baseline confusion and was spot-checked as still open today — no evidence any of it has been fixed. Carry forward as-is; see that file for full detail. Not re-listing here to avoid duplication.

**Lesson for future scans:** always run `npm view nx version` (and check `npm view nx time --json` for release dates) before asserting *any* Nx version claim is stale or forward-looking. This is now the second audit in a row that had to retract findings because of a stale internal assumption about "current."

---

## New Findings — 2026-07-03

### HIGH

**H1 — `reference/releases.mdoc`: supported-versions table is out of date**
The table lists `v22 Current / v21 LTS / v20 LTS`. Per the page's own policy (18 months of support per major, LTS for 12 months after superseded), with Nx 23.0.1 now current: **v22 should read LTS, not Current**, and **v20 (released 2024-10-06) fell out of its 18-month support window in April 2026** — it should no longer be listed as supported at all. This is the single highest-traffic version-support reference on the site and it's wrong on the exact axis it exists to answer.

**H2 — `features/CI Features/sandboxing.mdoc`: wrong `nx show target` syntax**
Shows `nx show target <project>:<target> --inputs --outputs`. Verified against `packages/nx/src/command-line/show/command-object.ts`: `inputs`/`outputs` are positional **subcommands** (`nx show target inputs ...` / `nx show target outputs ...`), not flags. As written, the command fails/is misparsed by yargs. (Independently confirmed by two separate audit passes.)

**H3 — `guides/ci-deployment.mdoc`: `previewStaticTargetName` doesn't exist**
Example `@nx/webpack/plugin` config sets `"previewStaticTargetName": "preview"`. Verified in `packages/webpack/src/plugins/plugin.ts`: the real option is `previewTargetName`. The documented key is silently ignored — copying this snippet will not rename the preview target.

**H4 — `getting-started/Tutorials/angular-monorepo-tutorial.mdoc`: invalid `--unitTestRunner=vitest`**
Command `npx nx g @nx/angular:library libs/ui --unitTestRunner=vitest` will fail schema validation. Verified `packages/angular/src/generators/library/schema.json`: valid enum is `["vitest-angular", "vitest-analog", "jest", "none"]` — no normalization from plain `vitest`. This is in the flagship Angular tutorial.

**H5 — `technologies/angular/angular-rspack/introduction.mdoc`: wrong package name**
States `The @angular-rspack/nx plugin supports...`. The real package (per `packages/angular-rspack/package.json`, and used correctly everywhere else in the same doc set) is `@nx/angular-rspack`. Scope and name are reversed.

**H6 — `technologies/react/react-native/introduction.mdoc`: non-existent `upgrade-native` generator**
Instructs `nx generate @nx/react-native:upgrade-native apps/<app>`. No such generator exists. It's an **executor** named `upgrade` (`packages/react-native/src/executors/upgrade/schema.json`), and that executor is itself deprecated (`x-deprecated`, removal in Nx v24) in favor of an inferred `upgrade` target from the plugin. The documented command will fail outright.

**H7 — `technologies/vue/nuxt/introduction.mdoc`: `testTargetName` plugin option doesn't exist**
Plugin-options example/prose documents `testTargetName: "test"` as an inferred-task option. `NuxtPluginOptions` (`packages/nuxt/src/plugins/plugin.ts`) has no such field — the plugin never creates a test target. Setting this in `nx.json` is silently ignored.

**H8 — `technologies/react/next/introduction.mdoc`: `serveStaticTargetName` presented as current, is deprecated/aliased; wrong Next.js floor**
`serveStaticTargetName` is marked `@deprecated Use startTargetName instead` in `packages/next/src/plugins/plugin.ts` and now just aliases the same target object as `startTargetName` — not distinct static-export behavior as described. Separately, the compat table states `next >=15.0.0 <17.0.0`; actual peerDependency in `packages/next/package.json` is `>=14.0.0 <17.0.0` — the doc's floor is one major too high.

**H9 — 5 Storybook guides: `@storybook/addon-essentials` claim wrong for Storybook 10**
`Guides/configuring-storybook.mdoc`, `one-storybook-for-all.mdoc`, `one-storybook-per-scope.mdoc`, `one-storybook-with-composition.mdoc`, `storybook-composition-setup.mdoc`. Verified against `packages/storybook/src/generators/configuration/files/v10/.../main.ts__tmpl__` (current default, `storybookVersion = '^10.1.0'`): the generated `addons` array is now **empty by default**. `packages/storybook/src/migrations/update-21-2-0/remove-addon-dependencies.ts` explicitly strips `@storybook/addon-essentials`/`@storybook/addon-interactions`. `configuring-storybook.mdoc`'s claim that every project "contains the `@storybook/addon-essentials` addon" is flatly wrong for current setups; the other four show it in copy-pasteable sample configs.

**H10 — `technologies/test-tools/playwright/introduction.mdoc`: preset options don't exist**
`includeMobileBrowsers`/`includeBrandedBrowsers` passed to `nxE2EPreset(...)`. Verified `packages/playwright/src/utils/preset.ts` — `NxPlaywrightOptions` only has `testDir`, `openHtmlReport`, `generateBlobReports`. Mobile/branded browser config moved into the generated `playwright.config.mts` template as commented-out `projects` entries, not preset options.

**H11 — `technologies/test-tools/detox/introduction.mdoc`: calls Detox config files "ESLint configuration files"**
Twice states "Any of the following files will be recognized as an **ESLint configuration file**" then lists `.detoxrc.js`, `detox.config.json`, etc. Copy-paste error — these are Detox config files (glob confirmed correct in `packages/detox/src/plugins/plugin.ts`), the label is just wrong.

**H12 — `technologies/eslint/Guides/custom-workspace-rules.mdoc`: TODO gates content on already-shipped support**
Two `<!-- TODO: ... once @nx/eslint:workspace-rule supports ESLint v9 -->` comments gate writing a "Quick Start with the Generator" section on ESLint v9 support. `packages/eslint/src/generators/workspace-rule/workspace-rule.ts` already requires ESLint 9+ and has shipped v9-specific templates/tests. The gate condition is already satisfied; the section should be written.

**H13 — `technologies/eslint/eslint-plugin/Guides/dependency-checks.mdoc`: teaches deprecated executor as the standard path**
Shows `"executor": "@nx/eslint:lint"` with manual `lintFilePatterns` setup as the default "Manual setup" flow, no deprecation note. `packages/eslint/src/executors/lint/schema.json` marks this executor `x-deprecated`, removal in Nx v24, replaced by the inferred `@nx/eslint/plugin` (which has no `lintFilePatterns` concept at all).

**H14/H15 — `extending-nx/tooling-plugin.mdoc` and `extending-nx/project-graph-plugins.mdoc`: flagship tutorials teach deprecated `CreateNodesV2` as primary API**
`packages/nx/src/project-graph/plugins/public-api.ts` marks `CreateNodesV2`/`CreateNodesContextV2`/`CreateNodesFunctionV2` `@deprecated` in favor of `CreateNodes`/`CreateNodesContext`. Nx 23 ships an automated codemod renaming these (`packages/devkit/src/migrations/update-23-0-0/rename-create-nodes-v2-types.ts`). Both the Astro Content Loader tutorial (`tooling-plugin.mdoc`) and the plugin-authoring conceptual guide (`project-graph-plugins.mdoc`) teach `createNodesV2` as the primary/only pattern. Notably, `extending-nx/performant-project-graph-plugins.mdoc` in the *same folder* already has this right ("Use `createNodes` for Nx 22 and later... For Nx 21 and earlier, the equivalent export is `createNodesV2`") — proof the correct guidance exists but wasn't propagated to the other two pages.

### MEDIUM

- **`guides/ci-deployment.mdoc`** — "We are working on an `NxVitePlugin`... Stay tuned" roadmap claim is stale: `@nx/vite:build`'s schema already has `generatePackageJson`/`skipOverrides`/`skipPackageManager` with webpack-plugin parity.
- **`getting-started/Tutorials/react-monorepo-tutorial.mdoc`** — sample `nx.json` shows `"serveTargetName": "serve"` as current default config; `packages/vite/src/plugins/plugin.ts` marks it `@deprecated ... removed in Nx 22` — and Nx 22 has already shipped, so this is past its own stated removal milestone with zero callout in the doc.
- **`technologies/typescript/Guides/compile-multiple-formats.mdoc`** and **`define-secondary-entrypoints.mdoc`** — both present/recommend the `@nx/rollup:rollup` executor with no deprecation note; schema marks it `x-deprecated`, removal in v24, replaced by `@nx/rollup:convert-to-inferred`. `define-secondary-entrypoints.mdoc` actively tells readers to switch *to* the deprecated executor.
- **`technologies/react/react-native/introduction.mdoc`** — plugin-options table omits `syncDepsTargetName`/`upgradeTargetName`, both real options in `ReactNativePluginOptions`.
- **`technologies/react/next/introduction.mdoc`, `technologies/vue/nuxt/introduction.mdoc`, `technologies/react/remix/introduction.mdoc`, `technologies/react/expo/introduction.mdoc`** — all four Plugin-options tables omit `buildDepsTargetName`/`watchDepsTargetName`, present in each plugin's source via the shared `addBuildAndWatchDepsTargets` utility (already documented for `@nx/vite`, just missing here).
- **`technologies/angular/angular-rspack/create-server.mdoc`** — prose calls the return type `RsbuildAngularServer` (copy-pasted from the Rsbuild variant); the file's own interface/signature two lines later correctly says `RspackAngularServer`. Also documents `import { createServer } from '@nx/angular-rspack/ssr'` — no `./ssr` export or SSR server code found in `packages/angular-rspack/src` (flagged with caveat — package may be developed upstream and out of sync with this monorepo's vendored copy; see Needs Input).
- **`technologies/dotnet/introduction.mdoc`** (watch-target example) — shows top-level `"args": ["run"]` in a target config; `TargetConfiguration` has no top-level `args` (only inside `options`), so `mergeUserTargetConfigurations` won't apply it — `dotnet watch run` silently never gets the arg.
- **4 more Storybook guides** (`one-storybook-for-all.mdoc`, `one-storybook-per-scope.mdoc`, `one-storybook-with-composition.mdoc`, `storybook-composition-setup.mdoc`) — same `@storybook/addon-essentials` staleness as H9, in copy-pasteable `main.ts` samples rather than prose.
- **`technologies/eslint/Guides/eslint.mdoc`** — lead-in prose only discusses `.eslintrc.json`/`parserOptions.project`, even though flat config (`eslint.config.mjs`) is listed first in the tabs below and `@nx/eslint`'s peerDependency is `^9.0.0 || ^10.0.0` (flat-config-only ESLint majors).
- **`technologies/eslint/eslint-plugin/Guides/enforce-module-boundaries.mdoc`** — options table omits `buildTargets` (real option, `packages/eslint-plugin/src/rules/enforce-module-boundaries.ts`, default `['build']`).
- **`extending-nx/createnodes-compatibility.mdoc`** — internally inconsistent: its own compat table (line 19) correctly says Nx 23.x+ prefers `createNodes` and treats `createNodesV2` as a deprecated alias, but the "Recommended implementation pattern" section (lines 34-83) still teaches `createNodesV2`-first code, and a "Future deprecation timeline" section describes the v23 deprecation in future tense even though 23.0.1 is already shipped.
- **`extending-nx/task-running-lifecycle.mdoc`** — "available since Nx 20.4+" citation; content itself (verified against `packages/nx/src/project-graph/plugins/public-api.ts`) is accurate, only the version anchor is stale (3 majors behind).
- **`technologies/build-tools/rsbuild/introduction.mdoc`, `technologies/build-tools/rspack/introduction.mdoc`** — "Default Installed" version cells show `2.0.6`/`2.0.3`; live source (`packages/rsbuild/src/utils/versions.ts`, `packages/rspack/src/utils/versions.ts`) is at `2.0.7`/`2.0.4`. Patch-level drift, will recur — consider not pinning exact patch in prose.

### LOW

- `guides/Tips-n-Tricks/yarn-pnp.mdoc` — sample output shows `"packageManager": "yarn@3.6.1"`; Yarn Berry stable has moved well into 4.x.
- `guides/Tasks & Caching/root-level-scripts.mdoc` — two sample transcripts show `yarn run v1.22.19` (Yarn Classic) as flavor text.
- `features/CI Features/distribute-task-execution.mdoc` — example CI snippet uses `actions/checkout@v4`/`actions/setup-node@v4`; this repo's own `.github/workflows/*.yml` has already moved to `@v5`. Also `node-version: 22` (Maintenance LTS by now, not wrong, just not the newest example).
- `guides/Nx Cloud/Source Control Integration/azure-devops.mdoc` — example URL uses project `my-monorepo-project` then the next sentence claims the project name is `large-monorepo` — self-contradictory sample, not version-related.
- `guides/Nx Cloud/record-commands.mdoc` — "Nx Cloud 13.3 and above is capable of..." is dead legacy phrasing (`nx record` has no version gate in current source, Nx Cloud is continuously deployed). Also one image uses an absolute external URL while its two neighbors use relative paths — inconsistent, should match.
- `guides/Nx Console/console-migrate-ui.mdoc` — AI-prompt badge aside cites "Nx 23.0.0-beta.24 or later" as the version gate; now that 23.0.1 is stable, this reads as an odd/very-specific pre-release pin — likely just needs to say "Nx 23".
- `reference/Nx Cloud/release-notes.mdoc` — dead anchor `#assignment-rules-beta` in a changelog entry; `assignment-rules.mdoc` has no "beta" heading anymore (feature graduated).
- `extending-nx/creating-files.mdoc` — sample `nx generate` output shows `CREATE libs/mylib/.eslintrc.json`; current `@nx/js:library` + `@nx/eslint` defaults to flat config (`eslint.config.mjs`).
- `extending-nx/local-generators.mdoc` — leftover "Note that `latest` should match the version of the `nx` plugins installed" text with no corresponding `@latest` anywhere in the surrounding commands — looks like doc debris from an older revision.
- `technologies/react/expo/introduction.mdoc`, `technologies/react/react-native/introduction.mdoc` — compat tables omit `@expo/metro`/`metro-resolver` peer dependency floors that exist in `packages/expo/package.json` / `packages/react-native/package.json`.

---

## Needs Input

- **`technologies/angular/Guides/angular-nx-version-matrix.mdoc`** — row `~22.0.0 | latest | >=23.1.0 <=latest`. Angular 22 (current, released) apparently requires Nx **>=23.1.0**, which is still in **beta** (23.0.1 is the current stable). Is Angular 22 support genuinely gated behind an unreleased Nx minor, or is this floor wrong? If genuine, worth a callout that Angular 22 users need the 23.1 prerelease channel.
- **`technologies/react/Guides/adding-assets-react.mdoc`** (carried forward from 06-29 as L-12, now with new evidence) — claims SVGR is "deprecated for Rspack (will be removed in Nx 23)." Nx 23 ships an `add-svgr-to-rspack-config` migration (`packages/rspack/src/migrations/update-23-0-0/`), suggesting SVGR/Rspack was migrated/preserved rather than removed. Does the doc need updating to reflect what actually happened in the 23.0.0 migration?
- **`technologies/angular/angular-rspack/create-server.mdoc`** — the `@nx/angular-rspack/ssr` subpath export and `createServer` SSR function referenced in the doc were not found in this monorepo's `packages/angular-rspack/src`. `angular-rspack` may be developed upstream (github.com/nrwl/angular-rspack) and not fully vendored here — needs a check against the actually-published npm package before editing.
- **`technologies/node/Guides/node-serverless-functions-netlify.mdoc`** — references `@nx/netlify`, not present in `packages/`. The sibling `node-aws-lambda.mdoc` self-flags as deprecated/unmaintained; this one has no such notice. Same treatment needed, or is `@nx/netlify` still maintained externally?
- **`technologies/dotnet/introduction.mdoc`, `technologies/java/introduction.mdoc`** — exact minor version `@nx/dotnet`/`@nx/maven` first became available (22.0 vs 22.1) couldn't be pinned from this shallow clone.
- **`concepts/Decisions/dependency-management.mdoc`** — pnpm/Yarn catalog support floor cited as "Nx 22+ / Nx 22.6+" — plausible but not independently confirmed from source/changelog.
- Multiple closed-source-plugin claims (Nx Cloud sandboxing/dynamic-agents/custom-steps/credits-pricing, `@nx/conformance`, `@nx/owners`, Nx Console extension settings/UI copy) are **unverifiable from this OSS repo** — flagged throughout the scan wherever encountered, not repeated here individually. A human with access to those private repos/the live product should spot-check them periodically; this class of doc is structurally unauditable from `nrwl/nx` alone.

---

## Linear Issues to Create (queued — MCP unavailable again this session)

No Linear connector/tools were reachable in this session (checked via `ListConnectors` and `ToolSearch` — Linear shows as an installed connector but exposes no callable tools here, and it wasn't among the servers still connecting). Queuing for manual creation, same as every prior audit. Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**, assignee **Linear agent if available, else unassigned**:

| # | Title | Severity | Files |
|---|---|---|---|
| 1 | Retract false-positive "Nx 23 unreleased" findings from 2026-06-29 audit (H-1–H-4, M-1) — Nx 23 shipped 2026-06-16, content is correct | Info/cleanup | 8 files (see corrections table above) |
| 2 | Fix reference/releases.mdoc: supported-versions table stale (v22 should be Current, v20 past 18-month support window) | High | 1 file |
| 3 | Fix sandboxing.mdoc / features docs: `nx show target` uses `--inputs --outputs` flags that don't exist, should be subcommands | High | 1 file |
| 4 | Fix ci-deployment.mdoc: `previewStaticTargetName` doesn't exist, real option is `previewTargetName`; also remove stale "NxVitePlugin coming soon" claim | High | 1 file |
| 5 | Fix angular-monorepo-tutorial.mdoc: `--unitTestRunner=vitest` is invalid, use `vitest-angular`/`vitest-analog` | High | 1 file |
| 6 | Fix angular-rspack/introduction.mdoc: wrong package name `@angular-rspack/nx` → `@nx/angular-rspack` | High | 1 file |
| 7 | Fix react-native/introduction.mdoc: `upgrade-native` generator doesn't exist (deprecated `upgrade` executor / inferred plugin instead); also missing `syncDepsTargetName`/`upgradeTargetName` options and metro-resolver peer dep | High | 1 file |
| 8 | Fix nuxt/introduction.mdoc: `testTargetName` plugin option doesn't exist | High | 1 file |
| 9 | Fix next/introduction.mdoc: `serveStaticTargetName` deprecated/aliased but shown as current; Next.js floor should be 14.0.0 not 15.0.0 | High | 1 file |
| 10 | Fix Storybook addon-essentials staleness across 5 guides (Storybook 10 no longer installs it by default) | High | 5 files |
| 11 | Fix playwright/introduction.mdoc: `includeMobileBrowsers`/`includeBrandedBrowsers` preset options don't exist | High | 1 file |
| 12 | Fix detox/introduction.mdoc: config files mislabeled "ESLint configuration files"; missing `start` target default | High | 1 file |
| 13 | Fix eslint custom-workspace-rules.mdoc: remove stale TODO gating on already-shipped ESLint v9 generator support | High | 1 file |
| 14 | Fix eslint dependency-checks.mdoc: teaches deprecated `@nx/eslint:lint` executor with no deprecation note | High | 1 file |
| 15 | Fix tooling-plugin.mdoc and project-graph-plugins.mdoc: flagship tutorials teach deprecated `CreateNodesV2` API — align with performant-project-graph-plugins.mdoc's correct `createNodes` guidance | High | 2 files |
| 16 | Fix createnodes-compatibility.mdoc: internally inconsistent — recommended pattern still uses deprecated V2 names, deprecation timeline in wrong tense | Medium | 1 file |
| 17 | Update react-monorepo-tutorial.mdoc: `serveTargetName` shown as default despite deprecation past its stated Nx 22 removal | Medium | 1 file |
| 18 | Fix compile-multiple-formats.mdoc and define-secondary-entrypoints.mdoc: `@nx/rollup:rollup` executor deprecated, one guide actively recommends switching to it | Medium | 2 files |
| 19 | Add missing `buildDepsTargetName`/`watchDepsTargetName` options to next/nuxt/remix/expo plugin-options tables | Medium | 4 files |
| 20 | Fix angular-rspack/create-server.mdoc: wrong return type name (Rsbuild vs Rspack), verify `/ssr` subpath export against published package | Medium | 1 file |
| 21 | Fix dotnet watch-target example: top-level `args` should be nested under `options` | Medium | 1 file |
| 22 | Fix eslint.mdoc lead-in prose to mention flat config primarily (ESLint 9+ is flat-config-only); add missing `buildTargets` option to enforce-module-boundaries.mdoc | Medium | 2 files |
| 23 | Update rsbuild/rspack introduction.mdoc "Default Installed" version cells (patch-level drift: 2.0.6→2.0.7, 2.0.3→2.0.4) | Medium | 2 files |
| 24 | Clean up low-value/stale example version strings: yarn@3.6.1, yarn v1.22.19, actions/checkout@v4→v5, Nx Cloud "13.3+" phrasing, dead #assignment-rules-beta anchor, self-contradictory azure-devops.mdoc project name example | Low | 6 files |
| 25 | Update creating-files.mdoc sample output (.eslintrc.json → flat config) and remove stale "latest" text debris in local-generators.mdoc | Low | 2 files |
| 26 | Investigate: angular-nx-version-matrix.mdoc requires Nx >=23.1.0 (beta) for Angular 22 support — confirm floor or add prerelease callout | Needs Input | 1 file |
| 27 | Investigate: has SVGR actually been removed from Rspack in Nx 23, or migrated (per the add-svgr-to-rspack-config migration)? Update adding-assets-react.mdoc accordingly | Needs Input | 1 file |
| 28 | Investigate: is @nx/netlify guide still current/maintained, or does it need the same deprecation notice as node-aws-lambda.mdoc? | Needs Input | 1 file |

**All prior audits' still-open queued issues (2026-06-11 through 2026-06-24, plus the non-retracted 06-29 items) remain open and are not re-listed here** — see the individual dated files. Nothing in this scan found evidence any of them were fixed.
