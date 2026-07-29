# Nx Astro Docs Staleness Audit — 2026-07-29

**Scope:** Full 5-agent sweep of all 480 `.mdoc` files under `astro-docs/src/content/docs/` in `nrwl/nx`, covering the three requested smells (old Nx version mentions, old Node/npm/framework version mentions, CLI/plugin option drift vs `packages/` source), plus a full remap of the 46-item backlog carried over from 2026-06-11 → 2026-07-10.

**Big development this cycle: the docs site was restructured.** Most of `extending-nx/`, `guides/Nx Cloud/`, `guides/Tips-n-Tricks/`, `technologies/*/Guides|concepts/`, and part of `reference/Nx Cloud/` were flattened into a new `kb/` directory (184 files, flat namespace, no subfolders). `reference/Deprecated/` did **not** move. Two previously-flagged files (`use-environment-variables-in-angular.mdoc`, `technologies/angular/Migration/angular.mdoc`) were deleted outright with no replacement found — noted below as content gaps, not staleness.

**Verified-live facts used this cycle** (per this file's own anti-hallucination rules — nothing below came from training data):
- Nx: **23.1.0** (`npm view nx version`)
- Node.js: v26.x Current · v24.x "Krypton" Active LTS · v22.x "Jod" Maintenance LTS (still supported) · **v20.x "Iron" EOL as of April 2026 (already passed)** · v18.x and earlier long EOL
- React: **19.2.8** · React Compiler shipped **stable v1.0** Oct 2025 (no longer experimental)
- Angular: **22.0.8**
- TypeScript: **7.0.2**
- Cypress: **15.19.0**
- Storybook: **10.5.5**
- `actions/checkout` latest **v7.0.1**, `actions/setup-node` latest **v7.0.0**, `docker/login-action` latest **v4.6.0**
- `nrwl/nx` CircleCI orb latest **v1.7.0**
- Gradle stable **9.6.x**

**Linear MCP status: still unavailable — 7th consecutive cycle, but the cause is now diagnosed.** See bottom of this file.

---

## Summary

| Category | High | Medium | Low | Needs Input |
|---|---|---|---|---|
| Old Nx version reference | 3 | 8 | 10 | 2 |
| Old Node/npm/framework version | 3 | 4 | 3 | 0 |
| Mismatched CLI/feature vs. source | 5 | 6 | 4 | 1 |
| **Total (new + still-open, deduped)** | **11** | **18** | **17** | **3** |

Additionally: **9 previously-flagged items are now RESOLVED or FIXED** (see "Resolved / Fixed This Cycle" below — no new issue needed, existing queued Linear items for these should be dropped/closed), and **2 are GONE** (source content deleted, flagged separately).

---

## Confirmed Findings

### HIGH

**H-1 — `kb/publish-rust-crates.mdoc`** (moved from `guides/Nx Release/`) — *old-nx-version + mismatched-feature*
Still says "This will be added in a minor release of Nx v21" (unfulfilled promise, verified the live nx.dev docs mirror the same unfulfilled text) while instructing users to set `release.version.useLegacyVersioning: true`. Confirmed via `packages/nx/src/command-line/release/config/use-legacy-versioning.ts`: the flag is a dead compat shim (`@deprecated ... TODO(v23): remove`) never read by the actual version-resolution logic, and the current `NxReleaseVersionConfiguration` schema (`additionalProperties: false`) has no such property. The entire recipe's premise is broken — worse than last cycle since we've now confirmed `@monodon/rust` never shipped the `VersionActions` implementation this guide is waiting on.

**H-2 — `kb/terminal-ui.mdoc`** (moved from `guides/Tasks & Caching/`) — *mismatched-feature*
Still says "The initial Nx 21 release disables the Terminal UI on Windows. We are currently working on Windows support, so stay tuned." Confirmed via `packages/nx/src/tasks-runner/is-tui-enabled.ts` (no `win32` exclusion) and `packages/nx/src/native/tui/app.rs` (active `win32` handling) that Windows is supported today. Stale "coming soon" framing actively discourages Windows users.

**H-3 — `kb/compose-executors.mdoc`** (moved from `extending-nx/`) — *mismatched-feature*
Still uses `"builder": "@nx/cypress:cypress"` (should be `"executor"` — `packages/nx/schemas/project-schema.json` has no `builder` key) and `apps/myapp-e2e/cypress.json` (should be `cypress.config.ts`). A target configured this way will not run.

**H-4 — `kb/migration-generators.mdoc`** (moved from `extending-nx/`) — *mismatched-feature*
Still documents `--project=pluginName` on `@nx/plugin:migration`. Confirmed `packages/plugin/src/generators/migration/schema.json` has `additionalProperties: false` and no `project` property — this flag would be rejected.

**H-5 — `kb/manage-library-versions-with-module-federation.mdoc`** (moved) — *mismatched-feature*
Still imports `ModuleFederationConfig` from `'@nx/webpack'`. Confirmed `packages/webpack/index.ts` does not export that symbol — it only exists at `packages/module-federation/src/utils/public-api.ts`. Every other module-federation kb page imports it correctly, confirming this file is the stale outlier.

**H-6 — `kb/launch-template-examples.mdoc`** (moved from `reference/Nx Cloud/`) — *old-node-version*
Three tabbed examples (mise, install-node step, manual nvm) still use a template literally named `node-21` and install Node 21 (`nvm install 21.7.3`) as the "custom node version" example, despite the surrounding image already using `ubuntu22.04-node24.14-v1`. Node 21 was never LTS and has been EOL since mid-2024.

**H-7 — `reference/Deprecated/{as-provided-vs-derived,v1-nx-plugin-api,legacy-cache}.mdoc`** (path unchanged, did not move to `kb/`) — *old-nx-version*
All three still use future tense for Nx 20/21 removals that happened years ago ("will be removed in Nx 20," "In Nx 21, the legacy file system cache will be removed"). Confusing for Nx 23.1 readers.

**H-8 — `reference/nx-json.mdoc`** (new finding) — *mismatched-feature*
The "Task options" table (lines ~194–201) lists `captureStderr`, `skipNxCache`, `cacheDirectory`, `encryptionKey`, `selectivelyHashTsConfig` as settable "at the root of `nx.json`." Confirmed against `packages/nx/src/config/nx-json.ts`: only `parallel` and `cacheDirectory` are actually root properties. `captureStderr`/`skipNxCache`/`encryptionKey` only exist nested under `tasksRunnerOptions.<name>.options` (the deprecated custom-task-runner path). `selectivelyHashTsConfig` doesn't exist anywhere in `nx-json.ts` or `nx-schema.json` — it's only an internal native-hasher implementation detail (`packages/nx/src/hasher/task-hasher.ts`), not a documented/settable field at all.

**H-9 — `concepts/nx-daemon.mdoc`** (path unchanged) — *mismatched-feature*
Still says to "set `useDaemonProcess: false` in the runners options in `nx.json`." Confirmed `useDaemonProcess` is a **top-level** `NxJsonConfiguration` property (`packages/nx/src/config/nx-json.ts:984`); the Nx 20 migration (`packages/nx/src/migrations/update-20-0-0/move-use-daemon-process.md`) explicitly moved it out of `tasksRunnerOptions`. The doc describes the pre-Nx-20 location.

**H-10 — `kb/overview-react.mdoc`, `kb/overview-angular.mdoc`, `kb/storybook-interaction-tests.mdoc`** (moved from `technologies/test-tools/storybook/Guides/`) — *old-package-version*
Still `import { within } from '@storybook/testing-library'; import { expect } from '@storybook/jest';` shown as current generator output / recommended setup. Both packages are deprecated since Storybook 8, superseded by unified `storybook/test` import. Current Storybook is 10.5.5 — the same `kb/upgrading-storybook.mdoc` correctly documents the v8/9/10 migration path, making these examples internally inconsistent with the site's own upgrade guide.

**H-11 — `kb/bundling-node-projects.mdoc`** (moved from `technologies/node/Guides/`) — *old-node-version*
Vite bundling example still targets `target: 'node18'` in esbuild/Rollup config. Node 18 has been EOL for years; should target `node22` or `node24` (current Active LTS) at minimum.

---

### MEDIUM

- **`reference/nx-json.mdoc`** — `releaseTag.preferDockerVersion` documented as type `boolean`, default `false`; source (`nx-json.ts` ~line 704) types it `boolean | 'both'` with a conditional default. Missing enum value + wrong default. *(new finding, mismatched-feature)*
- **`kb/react-compiler.mdoc`** — still calls React Compiler "an experimental compiler." Confirmed stable v1.0 shipped Oct 2025. *(old-package-version, confirmed worse than last cycle)*
- **`technologies/react/introduction.mdoc`** — "Choose a Bundler" section still presents one undifferentiated bundler list for app + library `--bundler`, conflating `packages/react/src/generators/application/schema.json` (`vite/rsbuild/rspack/webpack`) with `.../library/schema.json` (`none/vite/rollup`). Flagged 2026-07-10, confirmed still unfixed in reworded form. *(mismatched-feature)*
- **`kb/access-tokens.mdoc`** (moved) — "Nx Cloud authentication is changing" caution aside still frames the Nx 19.7 `nxCloudId` transition (4 majors ago) as in-progress. *(old-nx-version)*
- **`kb/personal-access-tokens.mdoc`** (moved) — "From Nx 19.7 new workspaces are connected..." same stale anchor. *(old-nx-version)*
- **`kb/config.mdoc`** (moved from `reference/Nx Cloud/`) — tab labels still "Nx >= 19.7"/"Nx <= 19.6" and "Nx >= 17"/"Nx < 17", presenting an ancient path as an equally valid current option. *(old-nx-version)*
- **`kb/module-federation-and-nx.mdoc`** (moved) — "As of Nx 19.5, our Module Federation support is provided by @module-federation/enhanced" — still accurate, just a stale-feeling anchor 4 majors later. *(old-nx-version)*
- **`kb/setup-incremental-builds-angular.mdoc`** (moved) — executor mapping table still shows `@angular/build:browser -> @nx/angular:webpack-browser`; `@angular/build:browser` isn't a real executor name. *(mismatched-feature)*
- **`kb/create-preset.mdoc`** (moved) — `npx create-nx-plugin my-org --pluginName my-plugin` example remains confusing/likely wrong. Confirmed via `packages/create-nx-plugin/bin/create-nx-plugin.ts`: `pluginName` is the primary positional arg (aliased `name`); a scoped name is expressed as `@my-org/my-plugin` in that single argument, not a separate `--pluginName` flag alongside a positional org name. *(mismatched-feature)*
- **`concepts/inferred-tasks.mdoc`** (path unchanged) — "In Nx version 18, Nx plugins can automatically infer tasks..." opens the conceptual intro page with a 5-major-old version anchor. *(old-nx-version)*
- **`kb/angular-configuring-styles.mdoc`** (moved) — still `builder: '@storybook/builder-webpack5'` (removed in Storybook 8) plus React-only `reactDocgen`/`reactDocgenTypescriptOptions` options in an Angular config example. *(old-package-version)*
- **`kb/best-practices.mdoc`** (Storybook, moved) — still links Storybook-7-era `/docs/react/...` URLs and a "Why Storybook in 2022?" blog post. *(old-package-version)*
- **`technologies/node/introduction.mdoc`** (path unchanged) — the still-current 22.x compat row lists `^20.19.0` (Node 20, now EOL) with no EOL callout. The 23.x row correctly dropped Node 20, making the gap on the 22.x row more visible than last cycle. *(old-node-version)*
- **`guides/Nx Release/publish-in-ci-cd.mdoc`** — `actions/setup-node@v3`/`actions/checkout@v3` were fixed to v6/v7 since 06-29, but `docker/login-action@v2` (lines ~341, 400) was missed — now two majors behind current v4.6.0. *(mismatched-feature, partially fixed)*
- **`kb/bring-your-own-compute.mdoc`** (moved) — CircleCI orb still pinned `nrwl/nx@1.5.1`; current is v1.7.0 (verified live). Sibling file `kb/setup-ci.mdoc` already correctly shows 1.7.0. *(mismatched-feature)*
- **`kb/getting-started.mdoc`** (Angular Rspack, moved) — terminal sample "NX Creating your v23.0.0 workspace" is no longer *premature* (v23 shipped) but now pins a stale patch — current is 23.1.0. *(old-nx-version, new drift)*
- **`features/CI Features/self-healing-ci.mdoc`, `kb/use-bun.mdoc`** — `actions/checkout@v6`/`actions/setup-node@v6` now genuinely exist (unlike 06-29 when `@v6` didn't exist at all) but are one major behind current `@v7`. *(mismatched-feature, downgraded from High since the tags are now real)*
- **`kb/cypress-component-testing.mdoc`** (moved) — "Component testing requires Cypress v10 and above" with its primary "more info" link pointing at the v10/v11 migration guide; current Cypress is 15.19.0. Floor should likely be raised and the migration-guide link reframed as historical. *(old-package-version)*

---

### LOW

- **Storybook 7-era `/docs/{framework}/...` URLs** — still present in `kb/overview-react.mdoc`, `kb/overview-angular.mdoc`, `kb/overview-vue.mdoc`, `kb/custom-builder-configs.mdoc`, `kb/upgrading-storybook.mdoc`, and `technologies/test-tools/storybook/introduction.mdoc`. (`kb/angular-storybook-compodoc.mdoc` was fixed — no longer has these links.) *(old-package-version)*
- **`features/run-tasks.mdoc`** — "In Nx 21, task output is displayed in an interactive terminal UI..." on a current-features page. *(old-nx-version)*
- **`reference/project-configuration.mdoc`** — "In Nx 19.5.0+", "Starting from v19.5.0", "version 16 or greater" qualifiers, unchanged. *(old-nx-version)*
- **`reference/glossary.mdoc`** — "This was made possible in Nx 15.3" (two entries), unchanged. *(old-nx-version)*
- **`reference/Deprecated/rescope.mdoc`** — still future tense: "Starting in version 20, the @nrwl scoped packages will no longer be published..." *(old-nx-version)*
- **`kb/troubleshoot-nx-install-issues.mdoc`** (moved) — "for versions of Nx between 15.8 and 16.4," irrelevant to any supported version today. *(old-nx-version)*
- **`kb/include-all-packagejson.mdoc`** (moved) — "As of Nx 15.0.11, we only include any package.json file..." *(old-nx-version)*
- **`kb/pass-args-to-commands.mdoc`** (moved) — "Support for providing command args as options was added in Nx v18.1.1." *(old-nx-version)*
- **`concepts/nx-daemon.mdoc`** — uses hidden/deprecated `nx affected:test` alias (`describe: false` in `packages/nx/src/command-line/affected/command-object.ts`) instead of canonical `nx affected -t test`. *(mismatched-feature)*
- **`concepts/task-pipeline-configuration.mdoc`** — aside about `targetDependencies` removed in v16, six majors ago. *(old-nx-version)*
- **`kb/react-router.mdoc`** (moved) — hardcoded `vite v6.2.1`/`vitest v3.0.8` sample terminal output, will drift again quickly. *(mismatched-feature)*
- **`kb/create-a-remote.mdoc`** (moved) — "## Angular" section header still has no command filled in underneath. *(mismatched-feature)*
- **`getting-started/installation.mdoc`** — hardcoded sample "You should see a version number like `22.5.0`" — now more visibly wrong since current major is 23. *(old-nx-version)*
- **`getting-started/Tutorials/crafting-your-workspace.mdoc`** — tsconfig example still `"target": "ES2020"`, dated for a Node-22/24-targeting tutorial. *(old-package-version)*
- **`getting-started/Tutorials/gradle-tutorial.mdoc`** — sample output/docs link still reference Gradle 8.5; current stable is 9.6.x (verified live). *(old-package-version)*
- **`kb/enforce-module-boundaries.mdoc`** — options table omits `buildTargets`, which exists in `packages/eslint-plugin/src/rules/enforce-module-boundaries.ts`. Incomplete, not incorrect. *(mismatched-feature)*
- **GitHub Actions version inconsistency across many CI examples** — most guides now use `actions/checkout@v7`/`setup-node@v6`, but scattered pages (`kb/nx-vs-blacksmith.mdoc` still `@v5`) lag behind. Not EOL software, just inconsistent — see Needs Input below on whether this warrants per-file issues or a recurring sweep instead. *(mismatched-feature, low priority)*

---

## Resolved / Fixed This Cycle (no action needed — drop from active backlog)

| Item | What changed |
|---|---|
| Compat tables ("23.x (current)" in node/nest/typescript introductions) | **Resolved by version progress** — Nx 23.1.0 is now actually current, label is correct |
| `kb/consumer-and-provider.mdoc` (v23 Module Federation generators) | **Resolved by version progress** — v23 shipped; verified `@nx/react` generators.json matches doc exactly, including host/remote deprecation-in-v24 note |
| `kb/migrating-from-nx-vite.mdoc` ("Nx 23 removed vitest support") | **Resolved by version progress** — verified `packages/vite` has zero vitest surface today |
| v23/v24 deprecation framing (`kb/configure-vite.mdoc`, `kb/webpack-config-setup.mdoc`, `kb/webpack-plugins.mdoc`, `kb/adding-assets-react.mdoc`, `kb/next-config-setup.mdoc`) | **Resolved by version progress** — matches live `@deprecated ... Will be removed in Nx v24` JSDoc in source |
| `kb/launch-templates.mdoc` | **Fixed** — default image now `ubuntu22.04-node24.14-v1`; Node 20 entries correctly presented as historical changelog |
| `kb/flat-config.mdoc` ("Since version 16.8.0") | **Fixed** — qualifier removed entirely |
| `kb/adding-assets-react.mdoc` (no redirect after deprecation warning) | **Fixed** — now includes a caution aside redirecting to `NxAppWebpackPlugin` + `convert-to-inferred` |
| `kb/nx-and-angular.mdoc` (pre-Nx-17.3 fallback block) | **Fixed** — page substantially rewritten, no trace of the old fallback language |
| `kb/angular-storybook-compodoc.mdoc` (Storybook 7-era URLs) | **Fixed** — no `storybook.js.org` links remain |
| GH Actions `@v3` → `@v6`/`@v7` in `split-e2e-tasks.mdoc`, `adding-to-monorepo.mdoc`, `adding-to-existing-project.mdoc`, `bring-your-own-compute.mdoc` | **Fixed** (partially — `docker/login-action@v2` in `publish-in-ci-cd.mdoc` was missed, see Medium list) |
| `kb/setup-ci.mdoc` (CircleCI orb version) | **Resolved** — 1.7.0 matches current live orb version |

## Content Gone (deleted, not migrated — flag as a gap, not staleness)

- **`use-environment-variables-in-angular.mdoc`** — no replacement found anywhere in `technologies/angular/` or `kb/`. If this content (deprecated `@angular-devkit/build-angular:browser` guidance) is still relevant, it needs to be re-added; if intentionally retired, fine, but worth confirming with docs owners it wasn't lost by accident during the `kb/` restructure.
- **`technologies/angular/Migration/angular.mdoc`** — `Migration/` now contains only an auto-generated `index.mdoc` card list; the actual migration article is gone.

---

## Needs Input

**NI-1 — Legacy version-gated tabs in `reference/nx-mcp.mdoc` and `reference/nx-cloud-cli.mdoc`**
Both still carry tabs like "Nx < 21.4" / "Nx >= 14.7" / "Nx >= 18" presenting an ancient path as an equally-valid current option. The gap to current (23.1.0) keeps growing every cycle. Docs-team judgment call: keep for LTS stragglers, collapse into a footnote, or remove.

**NI-2 — "Continuous Tasks are a new feature in Nx 21" framing**
Found in `kb/nx-module-federation-technical-overview.mdoc` and `kb/module-federation-and-nx.mdoc`. This is exactly 2 majors behind current (23.1.0) — right at this audit's own "more than 2 majors" staleness threshold. Borderline; flagging rather than asserting, since the guidance itself is still accurate.

**NI-3 — Should the `kb/` restructure get a full line-by-line pass?**
The two feature-drift agents this cycle covered ~40–50 of the 184 `kb/` files plus a broad sample outside it — not exhaustive. Given `kb/` absorbed most of the previously-fragmented `extending-nx/`, `guides/Nx Cloud/`, and `guides/Tips-n-Tricks/` content, it's now the single highest-value target for a dedicated full sweep next cycle.

---

## Linear Issues to Create (queued — MCP unavailable, see status below)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**:

| # | Title | Severity | Files |
|---|---|---|---|
| 1 | Fix publish-rust-crates.mdoc: broken guide references dead `useLegacyVersioning` shim for an unfulfilled v21 promise | High | 1 file (`kb/publish-rust-crates.mdoc`) |
| 2 | Fix terminal-ui.mdoc: remove stale "Windows support coming soon" notice — Windows TUI has shipped | High | 1 file (`kb/terminal-ui.mdoc`) |
| 3 | Fix compose-executors.mdoc: `"builder"` → `"executor"`, `cypress.json` → `cypress.config.ts` | High | 1 file (`kb/compose-executors.mdoc`) |
| 4 | Fix migration-generators.mdoc: remove non-existent `--project` flag | High | 1 file (`kb/migration-generators.mdoc`) |
| 5 | Fix manage-library-versions-with-module-federation.mdoc: import `ModuleFederationConfig` from `@nx/module-federation`, not `@nx/webpack` | High | 1 file (`kb/manage-library-versions-with-module-federation.mdoc`) |
| 6 | Fix launch-template-examples.mdoc: replace EOL Node 21 example with a current LTS (22/24) | High | 1 file (`kb/launch-template-examples.mdoc`) |
| 7 | Fix reference/Deprecated pages: past-tense the Nx 20/21 removal language (as-provided-vs-derived, v1-nx-plugin-api, legacy-cache) | High | 3 files |
| 8 | Fix nx-json.mdoc: task-options table lists fields that are deprecated/nested/nonexistent at nx.json root (captureStderr, skipNxCache, encryptionKey, selectivelyHashTsConfig) | High | 1 file (`reference/nx-json.mdoc`) |
| 9 | Fix nx-daemon.mdoc: `useDaemonProcess` is top-level in nx.json, not nested under runners options | High | 1 file (`concepts/nx-daemon.mdoc`) |
| 10 | Fix Storybook overview/interaction-test pages: replace deprecated `@storybook/testing-library`/`@storybook/jest` with `storybook/test` | High | 3 files (`kb/overview-react.mdoc`, `kb/overview-angular.mdoc`, `kb/storybook-interaction-tests.mdoc`) |
| 11 | Fix bundling-node-projects.mdoc: bump EOL `target: 'node18'` to node22/node24 | High | 1 file (`kb/bundling-node-projects.mdoc`) |
| 12 | Fix nx-json.mdoc: `releaseTag.preferDockerVersion` missing `'both'` enum value and wrong default | Medium | 1 file (`reference/nx-json.mdoc`) |
| 13 | Fix react-compiler.mdoc: React Compiler is stable (v1.0, Oct 2025), not experimental | Medium | 1 file (`kb/react-compiler.mdoc`) |
| 14 | Fix react/introduction.mdoc: `--bundler` list still conflates application vs. library enums | Medium | 1 file (`technologies/react/introduction.mdoc`) |
| 15 | Fix access-tokens.mdoc / personal-access-tokens.mdoc: remove stale "authentication is changing" framing for the Nx 19.7 transition | Medium | 2 files |
| 16 | Fix Nx Cloud config.mdoc: update "Nx >= 19.7"/"Nx >= 17" tab labels | Medium | 1 file (`kb/config.mdoc`) |
| 17 | Fix setup-incremental-builds-angular.mdoc: `@angular/build:browser` is not a real executor | Medium | 1 file |
| 18 | Fix create-preset.mdoc: clarify `--pluginName`/positional-arg usage for scoped plugin names | Medium | 1 file |
| 19 | Fix Storybook angular-configuring-styles.mdoc: remove removed webpack5 builder + React-only options in Angular config | Medium | 1 file |
| 20 | Fix Storybook best-practices.mdoc: update stale URLs and 2022 blog link | Medium | 1 file |
| 21 | Add Node 20 EOL callout to technologies/node/introduction.mdoc's 22.x compatibility row | Medium | 1 file |
| 22 | Fix publish-in-ci-cd.mdoc: `docker/login-action@v2` → current v4 | Medium | 1 file |
| 23 | Fix bring-your-own-compute.mdoc: CircleCI orb 1.5.1 → 1.7.0 | Medium | 1 file (`kb/bring-your-own-compute.mdoc`) |
| 24 | Bump Angular Rspack getting-started.mdoc sample from v23.0.0 to current patch | Medium | 1 file |
| 25 | Bump cypress-component-testing.mdoc floor from v10 to a current-supported Cypress version | Medium | 1 file |
| 26 | Clean up low-value "Nx version X added this" / historical qualifiers across current reference & concept pages (features/run-tasks, project-configuration, glossary, Deprecated/rescope, troubleshoot-nx-install-issues, include-all-packagejson, pass-args-to-commands, inferred-tasks, module-federation-and-nx) | Low | 9 files |
| 27 | Fix remaining Storybook 7-era `/docs/{framework}/...` URLs (overview-react, overview-angular, overview-vue, custom-builder-configs, upgrading-storybook, storybook/introduction) | Low | 6 files |
| 28 | Fix nx-daemon.mdoc: replace deprecated `nx affected:test` example with `nx affected -t test` | Low | 1 file |
| 29 | Fix react-router.mdoc: hardcoded vite/vitest sample versions will drift | Low | 1 file |
| 30 | Fill in missing Angular command under create-a-remote.mdoc's "## Angular" header | Low | 1 file |
| 31 | Bump getting-started/installation.mdoc sample version off 22.5.0 | Low | 1 file |
| 32 | Bump crafting-your-workspace.mdoc tsconfig target off ES2020 | Low | 1 file |
| 33 | Bump gradle-tutorial.mdoc sample/link off Gradle 8.5 | Low | 1 file |
| 34 | Add missing `buildTargets` option to enforce-module-boundaries.mdoc options table | Low | 1 file |
| 35 | Investigate content gap: use-environment-variables-in-angular.mdoc and Angular Migration/angular.mdoc deleted with no replacement during kb/ restructure — confirm intentional | Low (content-gap, not staleness) | 2 files (missing) |

**Superseded/withdraw from prior backlog** (do not create Linear issues for these — resolved or fixed, see table above): old items #1, #2, #3, #6 (partial), #10, #11 (compat tables/consumer-provider/vitest/v23-v24 framing/launch-templates/flat-config), plus the storybook-compodoc and nx-and-angular fallback items.

---

## Linear MCP Status — Escalation (diagnosis found this cycle)

This is the **7th consecutive audit cycle** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-29) unable to create Linear issues programmatically. Prior cycles reported varying vague symptoms ("SSE transport removed," "zero tools exposed despite connector enabled"). **This cycle found the actual cause:**

`ListConnectors(keywords: ["Linear"])` returns:
```json
{"name":"Linear","installState":"connected","connected":true,"enabledInChat":false}
```

The Linear connector **is installed and authenticated at the org level** — the problem is purely that it's **toggled off for this specific chat/session**. This is a per-conversation setting, not a broken integration. Six prior audits couldn't have fixed this themselves (no session can toggle its own connector visibility) — **it needs Jack to enable Linear in this chat/session's connector settings** (or ensure whatever recurring-task/session config runs this audit has Linear enabled by default). Once enabled, this same audit can create all 35 queued issues above directly.

## Recurring Checks to Run

(unchanged from prior audits — see top of this file's README for the checklist)

## Notes on Audit Methodology This Cycle

Five agents ran in parallel: (1) remap the 46-item prior backlog against the restructured `kb/` layout, (2) fresh full-repo grep for old Nx version mentions, (3) fresh full-repo grep for old Node/npm/framework version mentions, (4) feature-drift sampling of the new `kb/` directory against `packages/` source, (5) feature-drift sampling of all other directories against `packages/` source. All version-staleness claims were checked against live `npm view`/GitHub-release data per this file's verification rules, not training data — see the "Verified-live facts" block at the top.
