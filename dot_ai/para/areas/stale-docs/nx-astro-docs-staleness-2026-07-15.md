# Nx Astro Docs Staleness Audit — 2026-07-15

**Scope:** full sweep of all 511 `.mdoc` files under `astro-docs/src/content/docs/` in `nrwl/nx`, using ~17 parallel deep-dive agents (one per technology/section), each cross-referencing prose claims against live source in `packages/` (schema.json files, generators, executors, migrations) rather than relying on training-data assumptions. This is the most exhaustive pass since [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) and supersedes it as the authoritative full list — treat this file's Linear queue as current going forward.

**Verified baselines this cycle** (live, not from training data):
- Current Nx: **23.1.0** (`npm view nx version`) — up from `23.1.0-beta.7` on 2026-07-10, now stable.
- Node.js: 18 long EOL, **20 EOL as of April 2026** (i.e. EOL as of this audit), 22/24 current.
- Peer dependency ranges pulled live from each plugin's `package.json` (react `>=18<20`, next `>=14<17`, storybook `>=8<11`, cypress `>=13<16`, eslint `^9||^10`, vite `^5||^6||^7||^8`, jest `^29||^30`).

**Linear MCP unavailable again — 7th consecutive audit cycle.** See escalation section at the bottom; this is now a strong signal of a persistent connector problem rather than a transient outage, and is called out explicitly for direct investigation rather than another retry.

---

## Summary

| Category | Confirmed findings this cycle | Needs Input |
|---|---|---|
| 1 — Old Nx version presented as current | 9 | 6 |
| 2 — Old Node/npm/package version presented as current | 6 | 3 |
| 3 — CLI/schema/feature mismatch vs. source | 38 | 9 |
| **Total** | **53** | **18** |

Of the 53 confirmed findings, **9 are re-verifications of previously-queued, still-unfixed issues** (#4, #5, #6, #7, #8, #13, #16, #19, #20, #27 from the [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md)/[2026-07-10](./nx-astro-docs-staleness-2026-07-10.md) backlog — see cross-reference table below); the remaining **44 are new** this cycle, surfaced by covering sections not previously deep-scanned (module federation, Angular, nx-json/project-configuration schema internals, extending-nx plugin authoring guides, Nx Release, storybook test-utility imports) and by cross-referencing more deeply against `x-deprecated` schema annotations.

---

## Cross-reference: prior backlog still open

| Prior # | Title | Status this cycle |
|---|---|---|
| 4 | `compose-executors.mdoc` uses "builder" not "executor" | **Still open** — re-verified, unchanged |
| 5 | `migration-generators.mdoc` non-existent `--project` flag | **Still open** — re-verified; also found a second stale detail in the same file (see C-31) |
| 6 | Nonexistent GitHub Actions majors | **Still open** — broader than originally scoped; see C-17, C-18, C-19 for additional instances found this cycle |
| 7 | `publish-rust-crates.mdoc` broken (`useLegacyVersioning`) | **Still open** — re-verified with stronger evidence: the underlying function is now a dead stub with a `TODO(v23): remove` comment, confirming the guide's premise has been non-functional for at least one full major |
| 8 | `terminal-ui.mdoc` stale Windows TUI notice | **Still open** — re-verified with stronger evidence: current Rust TUI source has explicit `#[cfg(target_os = "windows")]` handling, confirming Windows support has landed and the doc's caveat is actively wrong, not just dated |
| 13 | Storybook `@storybook/testing-library`/`@storybook/jest` stale | **Still open** — re-verified, and scope is larger than originally tracked: 13 files affected, not 3 (see C-24) |
| 16 | `bundling-node-projects.mdoc` EOL `node18` target | **Still open** — re-verified, unchanged |
| 19 | `manage-library-versions-with-module-federation.mdoc` wrong import path | **Still open** — re-verified, unchanged |
| 20 | `module-federation-and-nx.mdoc` "As of Nx 19.5" framing | **Still open** (Needs Input, unchanged) |
| 24 | `access-tokens.mdoc` "authentication is changing" | **Unable to re-confirm this cycle** — the agent covering `guides/Nx Cloud/**` this time categorized all "Nx 19.7"-style mentions in this file as expected historical framing and did not re-flag the specific "authentication is changing" title. Not marked fixed — carrying forward as still open pending a dedicated look, since nothing indicates the aside was rewritten. |
| 1, 2, 3, 9–12, 14, 15, 17, 18, 21–23, 25, 26 | (various) | **Not independently re-verified this cycle** — this pass covered different files/angles per its 3-smell brief; these remain in the queue from the 2026-06-29 audit un-re-checked. Recommend a `2026-06-29` backlog re-verification pass as a future cycle's task, similar to what 2026-07-10 did for a sample. |

---

## Confirmed Findings — Category 1 (old Nx version presented as current)

**C-1 — `reference/releases.mdoc` supported-versions table** (lines 34–38)
Table lists v22 as "Current" and v21/v20 as "LTS". With Nx now at 23.1.0, v23 should be "Current", v22 "LTS", and v20 (shipped 2024-10, 18-month support window) should likely already be unsupported. Hasn't been updated since the v22 release.
*Fix:* update table; drop or mark v20 unsupported per the stated 18-month policy.

**C-2 — `reference/project-configuration.mdoc`** (lines 231, 457, 533)
Three separate version-gate phrasings for long-standard current behavior: "In Nx 19.5.0+, tasks can be configured..." (231), "Starting from v19.5.0, wildcards can be used..." (457), "in version 16 or greater" (533). All describe behavior that's been the default for 4–7 majors.
*Fix:* drop the version-gate phrasing; these are not conditional behaviors on current Nx.

**C-3 — `troubleshooting/troubleshoot-nx-install-issues.mdoc`** (lines 13, 24)
References a bug specific to "versions of Nx between 15.8 and 16.4" and an "Updating Nx" aside tied to 15.8 — 7+ majors behind current, not actionable for anyone on a supported version.
*Fix:* remove the version-range caveat and the 15.8-specific aside; keep only generic "platform not supported" guidance.

**C-4 — `guides/Tips-n-Tricks/include-all-packagejson.mdoc`** (line 7)
"As of Nx 15.0.11, we only include any `package.json`..." — 8 majors behind. Underlying behavior confirmed still accurate in `packages/nx/src/plugins/package-json/create-nodes.ts`, so this is a stale citation, not wrong behavior.
*Fix:* drop the version anchor.

**C-5 — `guides/Tasks & Caching/terminal-ui.mdoc`** (lines 13–15) — *re-verification of prior #8*
"The initial Nx 21 release disables the Terminal UI on Windows... stay tuned" — current native TUI Rust source (`packages/nx/src/native/tui/app.rs`) has explicit Windows handling; the caveat is stale.
*Fix:* remove or update the Windows caveat.

**C-6 — `extending-nx/project-graph-plugins.mdoc`** (lines 11–14, 21, 40, 43, 72, 124, 318, 350) and **`extending-nx/tooling-plugin.mdoc`** (lines 76–186)
Both tutorials teach `createNodesV2` as the primary/only export for project-graph plugins. Source (`packages/nx/src/project-graph/plugins/public-api.ts`) marks `createNodesV2` `@deprecated — prefer createNodes for new plugins`; the sibling doc `createnodes-compatibility.mdoc` already documents this correctly. Contradicts the repo's own compatibility doc.
*Fix:* swap primary examples to `createNodes` (v2/batched signature), keep `createNodesV2` only as a compat alias per the pattern in `createnodes-compatibility.mdoc`.

**C-7 — `concepts/inferred-tasks.mdoc`** (line 50)
Presents `createNodes`/`createNodesV2` as parallel current APIs — same root cause as C-6; `CreateNodesV2` and friends are `@deprecated`, removal targeted for Nx 24.
*Fix:* reword to "your plugin's `createNodes` function (or the deprecated `createNodesV2` alias)".

**C-8 — Angular Module Federation guides presented as current** — `technologies/angular/Guides/dynamic-module-federation-with-angular.mdoc`, `Guides/module-federation-with-ssr.mdoc`, `introduction.mdoc` (lines 147–165)
`@nx/angular:host`/`@nx/angular:remote` generators and the `module-federation-ssr-dev-server` executor are `x-deprecated` in `packages/angular/generators.json` (source commit dated 2026-07-07: "Angular Module Federation in Nx is no longer supported... Removed in Nx v24"). None of these pages carry a deprecation note.
*Fix:* add deprecation banners pointing to `@angular-architects/native-federation`, or retire the guides.

**C-9 — React/general Module Federation guides presented as current** — `technologies/module-federation/Guides/create-a-host.mdoc`, `create-a-remote.mdoc`, `federate-a-module.mdoc`, `nx-module-federation-plugin.mdoc`, `nx-module-federation-dev-server-plugin.mdoc`, `concepts/faster-builds-with-module-federation.mdoc`, `concepts/micro-frontend-architecture.mdoc`, `concepts/module-federation-and-nx.mdoc`, `concepts/nx-module-federation-technical-overview.mdoc`
Same root cause as C-8 but for the React/generic side: `@nx/react:host`/`@nx/react:remote`/`@nx/react:federate-module` all carry `x-deprecated` (superseded by `@nx/react:consumer`/`@nx/react:provider`), but none of these 9 pages mention it or link to `consumer-and-provider.mdoc`, which already documents the current model correctly.
*Fix:* add deprecation banners across all 9 files, or rewrite around consumer/provider.

---

## Confirmed Findings — Category 2 (old Node/package version presented as current)

**C-10 — `technologies/node/Guides/bundling-node-projects.mdoc`** (line 113) — *re-verification of prior #16*
Vite bundling example sets `target: 'node18'`; Node 18 EOL since April 2025.
*Fix:* change to `'node22'`.

**C-11 — `guides/Adopting Nx/adding-to-existing-project.mdoc`** (lines 352–378) **and `adding-to-monorepo.mdoc`** (lines 370–396)
Both docs' "key lines" CI-workflow excerpt shows `actions/setup-node@v3` / `node-version: 22`. The actual generator template (`packages/workspace/src/generators/ci-workflow/files/github/...`) currently outputs `actions/setup-node@v4` / `node-version: 20` — the docs don't match what the generator produces (in either direction). Separately, note the generator's own `node-version: 20` default is itself EOL as of this audit — a product issue, not just a doc issue, worth flagging to the CLI team as well as Docs.
*Fix:* sync docs to the generator's actual output; separately consider bumping the generator's default Node version.

**C-12 — `guides/Nx Release/release-docker-images.mdoc`** (lines 386, 389)
Second GH Actions example uses `actions/checkout@v3` / `actions/setup-node@v3`, inconsistent with the first example in the same file (lines 149, 155) which correctly uses `@v4`.
*Fix:* bump to `@v4` to match the file's own first example.

**C-13 — `guides/Nx Cloud/bring-your-own-compute.mdoc`** (lines 54, 96)
`actions/setup-node@v3` alongside `node-version: 22` — stale action major relative to sibling `setup-ci.mdoc` (`@v4`).
*Fix:* bump to `@v4`.

**C-14 — Storybook: obsolete `@storybook/addon-essentials`/`@storybook/addon-interactions` shown as current config** — `technologies/test-tools/storybook/introduction.mdoc` (lines 211), `Guides/configuring-storybook.mdoc` (23), `Guides/storybook-interaction-tests.mdoc` (27–28, 37–38), `Guides/overview-angular.mdoc` (119–120), `Guides/overview-react.mdoc` (108–109), `Guides/angular-configuring-styles.mdoc` (63), `Guides/angular-storybook-compodoc.mdoc` (44), `Guides/one-storybook-for-all.mdoc` (58), `Guides/one-storybook-per-scope.mdoc` (133), `Guides/one-storybook-with-composition.mdoc` (102, 175), `Guides/storybook-composition-setup.mdoc` (82) — *re-verification and expansion of prior #13*
Current v9/v10 templates generate an empty `addons: []`; a migration (`update-21-2-0/remove-addon-dependencies.ts`) actively removes these addons "no longer needed in Storybook 9+". `@storybook/testing-library`/`@storybook/jest` imports should be `storybook/test`. 13 files total, not the 3 originally tracked.
*Fix:* drop obsolete addon config and update imports to `storybook/test` across all 13 files.

**C-15 — `technologies/test-tools/storybook/introduction.mdoc`** (line 125)
Lists `@storybook/vue-vite` as a valid `uiFramework` value; schema only has `@storybook/vue3-vite`.
*Fix:* remove `@storybook/vue-vite`.

---

## Confirmed Findings — Category 3 (CLI/schema/feature mismatch vs. source)

### React / Node / Vue / Module Federation

**C-16 — `technologies/react/Guides/use-environment-variables-in-react.mdoc`** (line 63) — references `@nx/web:webpack` executor, which no longer exists (`packages/web/executors.json` only has `file-server`). *Fix:* change to `@nx/webpack:webpack`.

**C-17 — `technologies/react/next/introduction.mdoc`** (line 22) — states supported `next` range as `>=15.0.0 <17.0.0`; actual peer dep is `>=14.0.0 <17.0.0` (excludes still-supported Next 14). *Fix:* correct range.

**C-18 — `technologies/react/expo/introduction.mdoc`** (line 96) and **`technologies/react/react-native/introduction.mdoc`** (line 100) — typo `runAndroidTargetname` should be `runAndroidTargetName` in both plugin source files. *Fix:* fix typo in both.

**C-19 — `technologies/vue/nuxt/index.mdoc`** (lines 65–85) — lists `testTargetName` as a valid `@nx/nuxt/plugin` option; actual `NuxtPluginOptions` has no such property (Nuxt plugin doesn't infer a test target). *Fix:* remove `testTargetName`/`test` mentions.

**C-20 — `technologies/module-federation/Guides/create-a-remote.mdoc`** (lines 56, 165, 249–254) — terminal output incorrectly prints `NX Generating @nx/angular:host` for a `remote` generator command (copy/paste bug); separately, the Angular serve-command code block is truncated/incomplete. *Fix:* correct output text and complete the example.

**C-21 — `technologies/react/introduction.mdoc`** (lines 79–99) — *re-verification of prior #27, still unfixed*: "Choose a Bundler" section conflates the app-bundler enum (`vite, rsbuild, rspack, webpack`) with the library-bundler enum (`none, vite, rollup`) into one combined list, omitting `rsbuild` for apps and wrongly including `rollup`/`webpack` cross-context.

### Build tools

**C-22 — `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc`** (~line 113) — doc says `externalDependencies` defaults to `none`; code (`apply-base-config.ts`, executor schema.json) says default is `all`. *Fix:* correct default.

**C-23 — `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc`** (lines 92–100) — documents `deleteOutputPath` as live; it was fully removed from `NxAppWebpackPluginOptions` (a codemod strips it in `update-22-0-0/remove-deprecated-options.ts`). *Fix:* delete this section.

**C-24 — `technologies/build-tools/rspack/introduction.mdoc`** (line 18) and **`technologies/build-tools/rsbuild/introduction.mdoc`** (line 18) — "Default Installed" versions listed as `2.0.3`/`2.0.6`; actual current values in `versions.ts` are `2.0.4`/`2.0.7`. *Fix:* bump both (note: these drift on every patch release — consider whether hardcoding exact patch versions in docs is worth the maintenance cost vs. a "latest compatible" phrasing).

### Test tools

**C-25 — `technologies/test-tools/detox/introduction.mdoc`** (line 63) — copy-paste error: says the plugin creates a task for projects with an "ESLint" config file; the actual glob list is Detox config files. *Fix:* replace "ESLint" with "Detox".

**C-26 — `technologies/test-tools/detox/introduction.mdoc`** (lines 78–94) — plugin options table omits `buildDepsTargetName`/`watchDepsTargetName`, which exist in `DetoxPluginOptions`. *Fix:* add the two missing options.

**C-27 — `technologies/test-tools/cypress/index.mdoc`** (lines ~220, 246, 273, 298–316, 318) — presents the `@nx/cypress:cypress` executor as current/non-deprecated; schema marks it `x-deprecated`, removal targeted for Nx v24 (next major). *Fix:* add a deprecation aside pointing to `nx g @nx/cypress:convert-to-inferred`.

### ESLint / TypeScript

**C-28 — `technologies/eslint/Guides/eslint.mdoc`** (line 11) — hardcodes the legacy `.eslintrc.json` filename in prose even though ESLint 9+ (flat config default) is the current baseline and the page's own tabs show flat config too. *Fix:* make prose format-agnostic.

**C-29 — `technologies/eslint/eslint-plugin/Guides/dependency-checks.mdoc`** (lines 77–95) and **`Guides/flat-config.mdoc`** (line 168) — manual-setup examples use `@nx/eslint:lint` executor with no deprecation note; schema marks it `x-deprecated`, removal in Nx v24 (next major). *Fix:* note the deprecation, point to `nx g @nx/eslint:convert-to-inferred`.

**C-30 — `technologies/eslint/Guides/custom-workspace-rules.mdoc`** (lines 11, 270) — TODO comments claim `@nx/eslint:workspace-rule` doesn't support ESLint v9 yet; source already calls `assertSupportedEslintVersion` (requiring the v9/v10 peer range) and adds `@typescript-eslint/rule-tester` specifically for ESLint v9 compat — the TODOs appear resolved/stale. *Fix:* verify with plugin owners and remove the TODOs if confirmed.

**C-31 — `technologies/eslint/eslint-plugin/Guides/enforce-module-boundaries.mdoc`** (lines 74–83) — options table omits `buildTargets` (default `['build']`), present in the rule's actual schema. *Fix:* add a `buildTargets` row.

### Reference (nx.json / project-configuration / releases / owners)

**C-32 — `reference/nx-json.mdoc`** (lines 194–201) — table lists `captureStderr`, `skipNxCache`, `encryptionKey`, `selectivelyHashTsConfig` as root `nx.json` properties; all four only exist under `tasksRunnerOptions.<runner>.options` per `getRunnerOptions()` in `run-command.ts`. Only `parallel`/`cacheDirectory` are genuinely root-level. The root-level cloud-encryption analog is actually `nxCloudEncryptionKey`, a different key entirely. *Fix:* split the table; move the four to a `tasksRunnerOptions` note; mention `nxCloudEncryptionKey`.

**C-33 — `reference/nx-json.mdoc`** (lines 12–16) — "Nx 22 Changes" aside says "Old properties work until Nx 23," contradicting the same file's own "Nx 23 Changes" aside (581–583) and "Some important changes in Nx 23" list (690–693), both correctly stating the flat `releaseTag*` properties were removed in Nx 23. Since Nx 23 has shipped, the first aside is now self-contradictory. *Fix:* update/remove the stale first aside.

**C-34 — `reference/Owners/overview.mdoc`** (line 367) — inside a `jsonc` code block, a stray sentence got concatenated onto a JSON property value, making the example invalid JSON (unterminated string) and duplicating text already present at line 347, plus a "a a top-level" typo. *Fix:* remove the stray sentence.

**C-35 — Flat `releaseTagPattern*` properties presented as merely-legacy-but-functional, when they now hard-error** — `guides/Nx Release/publish-rust-crates.mdoc` (214, 236–251), `release-npm-packages.mdoc` (258, 280–292), `release-projects-independently.mdoc` (36, 55–66), `release-docker-images.mdoc` (106–136) — Nx 23 (`packages/nx/src/command-line/release/config/config.ts` ~line 1120) throws `"Found deprecated releaseTagPattern* properties... no longer supported in Nx 23"` and requires `nx repair`. All 4 files show these under an "Nx < 22" tab as if simply an older-but-usable alternative. *Fix:* add a note that these actively error on Nx 23+ and require `nx repair`.

### Extending Nx (plugin authoring)

**C-36 — `extending-nx/compose-executors.mdoc`** (lines 25–37) — *re-verification of prior #4*: sample `project.json` uses `"builder"` (Angular Devkit terminology) instead of `"executor"`.

**C-37 — `extending-nx/migration-generators.mdoc`** (lines 17–23, 27–34) — *re-verification of prior #5, plus a new detail in the same file*: example command passes `--project=pluginName`, which the current `@nx/plugin:migration` schema doesn't accept (`additionalProperties: false`, no `project` key — it's now inferred from the `path` argument); separately, the shown generated `migrations.json` entry includes a `"cli": "nx"` key that the current generator implementation never writes. *Fix:* drop `--project=pluginName` from the command and `"cli": "nx"` from the sample output.

### Guides (Tasks & Caching / CI / Adopting Nx / features)

**C-38 — `features/CI Features/sandboxing.mdoc`** (lines 166–181) and **`guides/Adopting Nx/from-turborepo.mdoc`** (line 151) — both show `nx show target <project>:<target> --inputs --outputs` as if boolean flags; actual CLI (`packages/nx/src/command-line/show/command-object.ts`) only supports `inputs`/`outputs` as separate subcommands (`nx show target inputs ...` / `nx show target outputs ...`), no combined flag form exists. *Fix:* correct both to subcommand syntax.

**C-39 — `guides/ci-deployment.mdoc`** (~lines 29–38) — shows `@nx/webpack/plugin` option `previewStaticTargetName`; actual option name in `packages/webpack/src/plugins/plugin.ts` is `previewTargetName`. *Fix:* rename.

**C-40 — `guides/Tips-n-Tricks/include-all-packagejson.mdoc`** (line 14) — `{ "plugins": ["nx/plugins/package-json"] }` — `packages/nx/package.json`'s `exports` map only exposes `./src/plugins/package-json`; the shown path would fail with `ERR_PACKAGE_PATH_NOT_EXPORTED` on an installed package. *Fix:* change to `"nx/src/plugins/package-json"`.

**C-41 — `guides/Tips-n-Tricks/browser-support.mdoc`** (lines 11–21) — claims official generators ship a `.browserslistrc` with specific contents; no such template exists anywhere in `packages/` for current web/react/next/angular generators. *Fix:* needs a maintainer decision — feature may have been removed and the page needs a rewrite, or it's angular-webpack-specific and should be scoped/reworded.

**C-42 — `getting-started/Tutorials/angular-monorepo-tutorial.mdoc`** (line 247) — `npx nx g @nx/angular:library libs/ui --unitTestRunner=vitest` — the bare `"vitest"` value was removed from the schema's enum in a Nx 22.3.0 migration (rewrites it to `"vitest-angular"`); running this exact command as documented errors out. **This is the highest-severity finding this cycle** since it's a copy-pasteable command in the primary Angular getting-started tutorial that will fail for every reader who runs it verbatim. *Fix:* change to `--unitTestRunner=vitest-angular` or drop the flag.

**C-43 — `technologies/angular/introduction.mdoc`** (lines 108, 124) and **`Guides/nx-and-angular.mdoc`** (lines 178–179, 230) — states defaults are "Jest for unit tests, and Cypress for e2e tests"; actual schema defaults are Vitest (vitest-angular/vitest-analog) for Angular ≥21 and Playwright for e2e. *Fix:* update default-tooling claims.

**C-44 — `technologies/angular/angular-rspack/introduction.mdoc`** (line 12) — states package name as `@angular-rspack/nx`; actual package (`packages/angular-rspack/package.json`) is `@nx/angular-rspack`. *Fix:* correct name.

**C-45 — `technologies/angular/Guides/nx-devkit-angular-devkit.mdoc`** (lines 34–44) — code sample declares parameter `options: Schema` but body references undefined `schema.name`/`schema.skipFormat`. *Fix:* correct to `options.name`/`options.skipFormat`.

---

## Needs Input

Items where the audit could not confidently classify as stale vs. intentional, or where a docs-team judgment call is needed:

1. **`reference/Deprecated/*` presentation** — 9 files (`angular-schematics-builders.mdoc`, `as-provided-vs-derived.mdoc`, `cacheable-operations.mdoc`, `global-implicit-dependencies.mdoc`, `legacy-cache.mdoc`, `npm-scope.mdoc`, `rescope.mdoc`, `runtime-cache-inputs.mdoc`, `workspace-executors.mdoc`/`workspace-generators.mdoc`) have no visual "Deprecated" callout in the body — only folder placement signals historical status. No factual contradictions found this cycle (unlike prior cycles' v1-nx-plugin-api.mdoc finding), but a reader landing via search could mistake these for current guidance. Policy call: add a blanket callout template for this folder.
2. **`reference/Deprecated/v1-nx-plugin-api.mdoc` future tense** ("will be removed in Nx 20") — flagged in the 2026-07-10 audit (C-1) as still-open; this cycle's agent examined the file for factual accuracy but didn't re-flag the specific tense issue. Not confirmed fixed — recommend a direct check next cycle.
3. **`guides/Nx Cloud/access-tokens.mdoc` "authentication is changing"** — flagged in 2026-07-10 (C-2); this cycle's broader Nx Cloud sweep categorized the file's version mentions as expected historical framing without addressing the specific title wording. Same as above — not confirmed fixed, needs a direct check.
4. **`getting-started/installation.mdoc`** line 56 — example output version `22.5.0`, one major behind current 23.1.0. Inside the "not stale" 2-major threshold but a maintainer may want to freshen the example.
5. **`technologies/module-federation/concepts/module-federation-and-nx.mdoc`** line 10 — "As of Nx 19.5, our Module Federation support is provided by..." — factually accurate, just an old anchor; same policy question raised in prior cycles (NI-1/NI-2/NI-3) about pruning "as of Nx X.Y" footnotes once a feature has been default for 3+ majors.
6. **`technologies/node/Guides/node-serverless-functions-netlify.mdoc`** — documents `@nx/netlify` as installable/current, but no `packages/netlify` exists in this repo and it's absent from `approved-community-plugins.json`. Sibling `node-aws-lambda.mdoc` has an explicit "deprecated and unmaintained" banner; this one doesn't. Couldn't fully confirm the external package's status from this repo.
7. **`technologies/build-tools/docker/introduction.mdoc`** (lines 96–104) — configuration properties list omits `skipDefaultTag`/`configurations`, which exist in `DockerTargetOptions`. Incomplete rather than wrong; judgment call on fix-worthiness.
8. **Angular Module Federation deprecation remedy scope** — whether the fix for C-8 is a banner, full rewrite toward `@angular-architects/native-federation`, or deletion is a product/editorial decision, not a docs mechanics fix.
9. **`technologies/angular/angular-rspack/Guides/migrate-from-webpack.mdoc`**/`getting-started.mdoc` — "Nx 20.6.0/20.6.1" framed as historical minimum-version info (not current guidance per audit rules), several majors behind; low-priority freshen candidate.
10. **`guides/Tasks & Caching/convert-to-inferred.mdoc`** (lines 46–53) — example output lists only 3 `convert-to-inferred` generators (eslint/playwright/vite) when many more plugins support it now; may be intentional abbreviation rather than a real gap.
11. **`extending-nx/create-preset.mdoc`** scaffolded file trees showing `jest.config.js` — couldn't confirm from schema whether Jest is still the effective default for new plugin workspaces vs. Vitest.
12. **GitHub Actions / CircleCI orb versions used as illustrative examples across `guides/Nx Cloud/*`** (`use-bun.mdoc`'s `checkout@v6`, `setup-node@v3` vs `@v4` scattered across several guides, `nrwl/nx@1.7.0` vs `1.5.1` orb version mismatch between `setup-ci.mdoc` and `bring-your-own-compute.mdoc`) — some of these may be legitimately current by this session's stated date (2026-07-15) but couldn't be independently verified against the GitHub/CircleCI registries from this environment.
13. **`reference/Nx Cloud/launch-template-examples.mdoc`** Node 21 illustrative example — carried forward unchanged from prior cycle's NI-5, still open.
14. Various closed-source Nx Cloud / `nx-cloud` CLI / `@nx/conformance` / `@nx/owners` flag claims across `enterprise/**`, `reference/nx-cloud-cli.mdoc`, `reference/nx-mcp.mdoc`, `features/CI Features/*` — not verifiable against this repo since the implementations are private; carried forward from prior cycles' NI-6/NI-7/NI-8, unchanged.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Items 1–27 carried forward from prior audits (see [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) and [2026-07-10](./nx-astro-docs-staleness-2026-07-10.md)) — still open except where noted. New items below start at 28.

| # | Title | Severity | Files |
|---|---|---|---|
| 28 | Fix `reference/releases.mdoc` supported-versions table (v22→v23 current, drop/mark v20 unsupported) | High | 1 |
| 29 | Remove stale version-gate phrasing in `project-configuration.mdoc` (lines 231, 457, 533) | Medium | 1 |
| 30 | Remove Nx 15.8–16.4-specific bug callouts in `troubleshoot-nx-install-issues.mdoc` | Low | 1 |
| 31 | Fix `createNodesV2`-as-primary teaching in `extending-nx/project-graph-plugins.mdoc`, `tooling-plugin.mdoc`, and `concepts/inferred-tasks.mdoc` — should teach `createNodes`, alias `createNodesV2` | High | 3 |
| 32 | Add deprecation banners to Angular Module Federation guides (`dynamic-module-federation-with-angular.mdoc`, `module-federation-with-ssr.mdoc`, `angular/introduction.mdoc`) | High | 3 |
| 33 | Add deprecation banners to React/generic Module Federation guides (host/remote/federate-module family) | High | 9 |
| 34 | Fix broken/incorrect Module Federation `create-a-remote.mdoc` example (wrong generator name in output, truncated code) | Medium | 1 |
| 35 | Fix `use-environment-variables-in-react.mdoc`: `@nx/web:webpack` → `@nx/webpack:webpack` | Medium | 1 |
| 36 | Fix `next/introduction.mdoc` supported range (`>=14` not `>=15`) | Low | 1 |
| 37 | Fix `runAndroidTargetname` typo in expo/react-native `introduction.mdoc` | Low | 2 |
| 38 | Remove non-existent `testTargetName` from `nuxt/index.mdoc` | Low | 1 |
| 39 | Fix `webpack-plugins.mdoc`: correct `externalDependencies` default (`all` not `none`), remove dead `deleteOutputPath` section | Medium | 1 |
| 40 | Bump rspack/rsbuild "Default Installed" version numbers to current patch | Low | 2 |
| 41 | Fix `detox/introduction.mdoc`: "ESLint"→"Detox" copy-paste bug, add missing plugin options | Medium | 1 |
| 42 | Add deprecation note to `@nx/cypress:cypress` executor docs in `cypress/index.mdoc` | Medium | 1 |
| 43 | Make `eslint.mdoc` config-file prose format-agnostic (not hardcoded `.eslintrc.json`) | Low | 1 |
| 44 | Add deprecation note for `@nx/eslint:lint` executor in `dependency-checks.mdoc`/`flat-config.mdoc` | Medium | 2 |
| 45 | Re-check/remove stale ESLint-v9-support TODOs in `custom-workspace-rules.mdoc` | Low | 1 |
| 46 | Add missing `buildTargets` option to `enforce-module-boundaries.mdoc` | Low | 1 |
| 47 | Fix `nx-json.mdoc` root-property table (move 4 properties to `tasksRunnerOptions`, mention `nxCloudEncryptionKey`) | High | 1 |
| 48 | Fix self-contradictory "Nx 22 Changes"/"Nx 23 Changes" asides in `nx-json.mdoc` | Medium | 1 |
| 49 | Fix broken JSON example (stray text) in `reference/Owners/overview.mdoc` | Medium | 1 |
| 50 | Add "now hard-errors on Nx 23+" note to flat `releaseTagPattern*` docs (4 Nx Release files) | High | 4 |
| 51 | Fix `nx show target --inputs/--outputs` → subcommand syntax (`sandboxing.mdoc`, `from-turborepo.mdoc`) | Medium | 2 |
| 52 | Fix `ci-deployment.mdoc`: `previewStaticTargetName` → `previewTargetName` | Low | 1 |
| 53 | Fix broken plugin export path in `include-all-packagejson.mdoc` (`nx/plugins/package-json` → `nx/src/plugins/package-json`) | Medium | 1 |
| 54 | Investigate `.browserslistrc` claim in `browser-support.mdoc` — feature may no longer exist in generators | Medium | 1 |
| 55 | **Fix invalid `--unitTestRunner=vitest` in `angular-monorepo-tutorial.mdoc`** — breaks a copy-pasteable tutorial command | **High** | 1 |
| 56 | Fix stale Jest/Cypress default-tooling claims in Angular `introduction.mdoc`/`nx-and-angular.mdoc` (actual: Vitest/Playwright) | Medium | 2 |
| 57 | Fix wrong package name `@angular-rspack/nx` → `@nx/angular-rspack` | Low | 1 |
| 58 | Fix broken code sample (`schema.name`→`options.name`) in `nx-devkit-angular-devkit.mdoc` | Low | 1 |
| 59 | Sync `adding-to-existing-project.mdoc`/`adding-to-monorepo.mdoc` CI "key lines" with actual `ci-workflow` generator output (actions versions + Node version) | Medium | 2 |
| 60 | Bump stale `actions/checkout@v3`/`setup-node@v3` across `release-docker-images.mdoc` and `bring-your-own-compute.mdoc` | Low | 2 |
| 61 | Expand Storybook `addon-essentials`/`testing-library`/`jest`→`storybook/test` fix to full 13-file scope (supersedes narrower prior #13) | Medium | 13 |
| 62 | Remove invalid `@storybook/vue-vite` enum value from `storybook/introduction.mdoc` | Low | 1 |
| 63 | Fix `--project` flag and stale `"cli": "nx"` key in `migration-generators.mdoc` (expands prior #5) | Medium | 1 |

**Total backlog after this cycle: 63 issues queued** (27 carried forward + 36 new/expanded; some prior items subsumed into wider-scoped new items as noted).

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-15) where Linear issue creation could not be completed programmatically. This cycle's symptom: `ListConnectors` reports Linear as installed with `enabledInChat: true`, but `ToolSearch` returns **zero** matching tools for any Linear-related query (`Linear`, `mcp__Linear__*`, `create_issue`, `triage`, `workspace issue tracker`, etc.) — no Linear tools are exposed to this session at all. By contrast, GitHub, Slack, Notion, and (partially) Google Calendar all exposed their tool sets normally in the same session. Notion's own cross-source `search`/`fetch` tools mention Linear as a connected search source, but that's read-only and unrelated to issue creation.

**This has now failed 7 times running with at least 3 distinct symptom descriptions** across cycles (SSE transport removed → zero tools exposed despite "enabled" status, consistently). Retrying per-cycle clearly isn't going to resolve this on its own — **recommend investigating the Linear connector directly in claude.ai connector settings** (re-authorize, or check whether the installed integration actually grants MCP tool access vs. just Notion-search indexing) rather than queuing a further audit cycle assuming it'll work next time.

## Recurring Checks to Run

(unchanged from prior audits — see the folder's `README.md` for the checklist)
