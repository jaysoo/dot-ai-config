# Nx Astro Docs Staleness Audit — 2026-07-04

Scanned all 503 `.mdoc` files under `astro-docs/src/content/docs/` in `nrwl/nx` (8 parallel agents, one per subtree, plus one agent re-verifying every item from the 2026-06-29 report against current source).

**Verified baseline (do not trust training-data assumptions — verified live this run):**

- Nx: `npm view nx dist-tags` → `latest: 23.0.1`, `previous: 22.7.6`. **Nx 23.x is genuinely current.**
- Node.js: v24 (Krypton) and v22 (Jod) are the two current LTS lines. **Node 20 went EOL ~March/April 2026 — it is EOL as of today.** Node 18 EOL'd March 2025. Node 26 is "Current" (pre-LTS, enters LTS Oct 2026).
- GitHub Actions: `actions/checkout` latest is `v7.0.0`. `actions/setup-node` latest is `v6.4.0`.
- React 19.2.7, Angular 22.0.5, TypeScript 6.0.3, ESLint 10.6.0, Cypress 15.18.0, Storybook 10.4.6, Vite 8.1.3, Webpack 5.108.3, Jest 30.4.2 are current per npm.

Linear MCP tool is unavailable again (6th run in a row — see `ListConnectors`/`ToolSearch`, connector shows `installState: unknown`). All issues below are queued for manual creation, same as every prior run in this log.

---

## Correcting the 2026-06-29 report's own baseline error

The prior report assumed Nx 22.x was current and flagged pages describing Nx 23.x as "(current)" or describing v23 changes as already-shipped. **That assumption was wrong even on 2026-06-29** — Nx 23 had already become the real `latest`. The following 5 items from that report are **false positives** and should NOT become Linear issues; no doc changes needed:

| Prior ID | File(s) | Why it's actually correct |
|---|---|---|
| H-1 | `technologies/node/introduction.mdoc`, `technologies/node/nest/introduction.mdoc`, `technologies/typescript/introduction.mdoc` | "23.x (current)" is accurate — 23.0.1 is the real published `latest`. |
| H-2 | `technologies/module-federation/consumer-and-provider.mdoc` | Describes real, shipped `@nx/react:consumer`/`:provider` v23 generators and real v23/v24 deprecations (confirmed against `packages/react/src/utils/module-federation-deprecation.ts` this run). |
| H-3 | `technologies/test-tools/vitest/Guides/migrating-from-nx-vite.mdoc` | "Nx 23 removed vitest support from `@nx/vite`" is a true statement now. |
| H-4 | `technologies/angular/angular-rspack/Guides/getting-started.mdoc` | Sample output `v23.0.0` — v23 is real; the exact patch shown (23.0.0 vs current 23.0.1) is the same class of trivial drift as other patch-version examples, not worth a ticket. |
| M-1 | 5 files with "deprecated, removed in v24, still works in v23" callouts (vite/configure-vite, webpack/webpack-config-setup, webpack/webpack-plugins, react/adding-assets-react, react/next/next-config-setup) | Literally true now that v23 shipped. |

**Two items the 06-29 report flagged as possibly-resolved-by-v23 are NOT resolved** — re-verify before retracting anything on version grounds alone:
- M-11 (angular-rspack guides citing "Nx 20.6" as a minimum) — now 3 majors stale, still open.
- M-13 (module-federation-and-nx.mdoc "As of Nx 19.5" framing) — now 4 majors stale, still open.

---

## Summary

| Category | High | Medium | Low | Needs Input |
|---|---|---|---|---|
| Old Nx version reference | 1 | 4 | 12 | 2 |
| Old Node/package version | 2 | 2 | 0 | 1 |
| Mismatched CLI/feature | 9 | 9 | 5 | 4 |
| **Total (this run + still-open carryover)** | **12** | **15** | **17** | **7** |

Carryover detail (full excerpts/quotes) for every still-open item lives in the 2026-06-29 report; this report doesn't re-paste unchanged excerpts, only status + anything new about them.

---

## HIGH Severity

### H-A — Module Federation docs (Angular + React) don't mention the v23 deprecation of host/remote/federate-module — NEW
**Files:**
- `technologies/module-federation/Guides/create-a-host.mdoc`
- `technologies/module-federation/Guides/create-a-remote.mdoc`
- `technologies/module-federation/Guides/federate-a-module.mdoc`
- `technologies/module-federation/concepts/faster-builds-with-module-federation.mdoc`
- `technologies/module-federation/concepts/micro-frontend-architecture.mdoc`
- `technologies/module-federation/concepts/module-federation-and-nx.mdoc`
- `technologies/module-federation/concepts/nx-module-federation-technical-overview.mdoc`
- `technologies/angular/Guides/dynamic-module-federation-with-angular.mdoc`
- `technologies/angular/Guides/module-federation-with-ssr.mdoc` (Angular tab)
- `technologies/react/Guides/module-federation-with-ssr.mdoc` (React tab)
- `technologies/angular/introduction.mdoc` (Module Federation section)

**Issue:** All 11 files teach `nx g @nx/react:host`/`:remote`, `@nx/angular:host`/`:remote`, `--devRemotes`, and the `module-federation-dev-server`/`module-federation-ssr-dev-server` executors as the current, only way to do Module Federation. Verified this run: `packages/react/src/utils/module-federation-deprecation.ts` and the Angular equivalent both emit real runtime deprecation warnings — "deprecated and will be removed in Nx v24" — pointing readers to `@nx/react:consumer`/`:provider` (already documented in `consumer-and-provider.mdoc`, itself real/current, see retraction above). None of these 11 files are in a Deprecated folder and none mention the replacement.
**Confidence:** high (cross-verified by two independent agents + source code this run)

---

### H-B — `nx-json.mdoc` "Task options" table lists properties that don't actually work at nx.json's root — NEW
**File:** `reference/nx-json.mdoc` (lines 190-201)
**Issue:** States "The following properties... can be set at the root of `nx.json`" then lists `parallel`, `captureStderr`, `skipNxCache`, `cacheDirectory`, `encryptionKey`, `selectivelyHashTsConfig`. Verified this run against `packages/nx/schemas/nx-schema.json` and `getRunnerOptions()` in `packages/nx/src/tasks-runner/run-command.ts`: only `parallel` and `cacheDirectory` are real root-level nx.json properties. `captureStderr`/`skipNxCache` only work nested under the deprecated `tasksRunnerOptions.<name>.options`. `encryptionKey` isn't a real property at all — the actual root-level Nx Cloud property is `nxCloudEncryptionKey`. `selectivelyHashTsConfig` doesn't appear anywhere in `nx-schema.json`.
**Confidence:** high

---

### H-C — `environment-variables.mdoc` documents a dead env var (`NX_RUNNER`) — NEW
**File:** `reference/environment-variables.mdoc` (line 74)
**Issue:** `NX_RUNNER` is documented as controlling which task runner Nx uses. Grepping `packages/nx/src` shows it is never read by any implementation code — only `NX_TASKS_RUNNER` is consumed (`packages/nx/src/utils/command-line-utils.ts:211`), and the one place `NX_RUNNER` appears in the codebase is a spec asserting it should be *ignored*.
**Confidence:** high

---

### H-D — Storybook docs reference deprecated packages/addons across 10 files — expands prior M-3
**Files (testing-library/jest imports):** `technologies/test-tools/storybook/Guides/overview-react.mdoc`, `overview-angular.mdoc`, `storybook-interaction-tests.mdoc`
**Files (default addon-essentials/addon-interactions no longer added by generator):** `technologies/test-tools/storybook/introduction.mdoc`, `storybook-composition-setup.mdoc`, `one-storybook-for-all.mdoc`, `one-storybook-per-scope.mdoc`, `one-storybook-with-composition.mdoc`, `angular-storybook-compodoc.mdoc`, `angular-configuring-styles.mdoc`
**Issue:** `@storybook/testing-library`/`@storybook/jest` are deprecated since Storybook 8 (replacement: `storybook/test`); current templates in `packages/react/src/generators/component-story/files/...` confirm this. Separately, `packages/storybook/src/migrations/update-21-2-0/remove-addon-dependencies.ts` explicitly calls `@storybook/addon-essentials`/`@storybook/addon-interactions` "deprecated Storybook addon dependencies that are no longer needed in Storybook 9+," yet multiple guides present installing them as the current setup step.
**Confidence:** high

---

### H-5 through H-13 (carried from 2026-06-29, still open, unchanged)
| ID | File | Status |
|---|---|---|
| H-5 | `extending-nx/compose-executors.mdoc` | still open — `"builder"` and `cypress.json` unchanged |
| H-6 | `extending-nx/migration-generators.mdoc` | still open — non-existent `--project` flag unchanged |
| H-7 | `features/CI Features/self-healing-ci.mdoc` | **revised**: `actions/checkout@v6` is now 1 major behind (latest v7); `actions/setup-node@v6` in this file is now actually correct/current (v6.4.0 latest) — only the checkout line needs a fix |
| H-8 | `guides/Nx Cloud/use-bun.mdoc` | **revised**: `actions/checkout@v6` still 1 major behind current v7 |
| H-9 | `guides/Nx Release/publish-rust-crates.mdoc` | still open, **confirmed worse**: `@monodon/rust@3.0.0` (released 2026-06-01) now ships `packages/rust/src/release/version-actions.ts` implementing `VersionActions` — the guide's excuse for `useLegacyVersioning: true` no longer holds; fix is unblocked |
| H-10 | `guides/Tasks & Caching/terminal-ui.mdoc` | still open — verified `is-tui-enabled.ts` supports Windows Terminal/VSCode/ConEmu/alacritty via env-var checks; reword (not delete) since plain cmd.exe/legacy PowerShell may still lack support |
| H-11 | `reference/Nx Cloud/launch-templates.mdoc` | still open — Node 20 images listed with no EOL callout |
| H-12 | `reference/Nx Cloud/launch-template-examples.mdoc` | still open — EOL `node-21` example unchanged |
| H-13 | `reference/Deprecated/as-provided-vs-derived.mdoc`, `v1-nx-plugin-api.mdoc`, `legacy-cache.mdoc` | still open — future tense for Nx 20/21 milestones that shipped years ago |

---

## MEDIUM Severity

### M-A — webpack-plugins.mdoc: removed option still documented, wrong default, 6 real options undocumented — NEW
**File:** `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc`
**Issues (verified against `packages/webpack/src` this run):**
1. `deleteOutputPath` is documented (marked "Deprecated, use output.clean") but was fully removed in Nx 22 (`packages/webpack/src/migrations/update-22-0-0/remove-deprecated-options.ts` strips it; not in the current `NxAppWebpackPluginOptions` type at all).
2. `externalDependencies` default is documented as `none`; actual default (`apply-base-config.ts:53`) is `all` — backwards.
3. Six current options are undocumented: `commonChunk`, `mergeExternals`, `useTsconfigPaths`, `cache`, `publicPath`, `rebaseRootRelative`.

### M-B — webpack/rspack introduction pages missing `buildDepsTargetName`/`watchDepsTargetName` — NEW
**Files:** `technologies/build-tools/webpack/introduction.mdoc`, `technologies/build-tools/rspack/introduction.mdoc`
**Issue:** Both plugin-options interfaces define these two options; the sibling Vite doc documents them, these two don't.

### M-C — rsbuild/introduction.mdoc missing its entire options section — NEW
**File:** `technologies/build-tools/rsbuild/introduction.mdoc`
**Issue:** `RsbuildPluginOptions` exposes 7 real options (`buildTargetName`, `devTargetName`, `previewTargetName`, `inspectTargetName`, `typecheckTargetName`, `buildDepsTargetName`, `watchDepsTargetName`) — none documented, unlike webpack/vite/rspack siblings.

### M-D — Angular introduction.mdoc states wrong test-runner defaults — NEW
**File:** `technologies/angular/introduction.mdoc` (lines 67, 83)
**Issue:** Says Nx defaults to "Jest for unit tests, and Cypress for e2e tests." Verified against `packages/angular/src/generators/application/schema.json`: `e2eTestRunner` defaults to `"playwright"`; `unitTestRunner` defaults to `vitest-angular`/`vitest-analog` for Angular ≥21, only falling back to `jest` on older Angular.

### M-E — `@nx/rollup:rollup` executor recommended without noting it's deprecated — NEW
**Files:** `technologies/typescript/Guides/compile-multiple-formats.mdoc`, `define-secondary-entrypoints.mdoc`
**Issue:** `packages/rollup/src/executors/rollup/schema.json` marks this executor `x-deprecated`: "removed in Nx v24, run `nx g @nx/rollup:convert-to-inferred` to migrate" — both docs present it as a normal current alternative.

### M-F — `enforce-module-boundaries.mdoc` missing documented `buildTargets` option — NEW
**File:** `technologies/eslint/eslint-plugin/Guides/enforce-module-boundaries.mdoc`
**Issue:** `packages/eslint-plugin/src/rules/enforce-module-boundaries.ts` defines a real, functioning `buildTargets` option (default `['build']`) — absent from the doc's options table.

### M-G — cypress-component-testing.mdoc floor is 3 majors stale (was Needs Input, now confirmed) — resolves prior NI-9
**File:** `technologies/test-tools/cypress/Guides/cypress-component-testing.mdoc`
**Issue:** States "Component testing requires Cypress v10 and above." Verified this run: `packages/cypress/package.json` peer dep is `>= 13 < 16`. Floor should read v13.

### M-2, M-4 through M-21 (carried from 2026-06-29, still open except M-1/M-11-status-note above)
All unchanged in the repo as of this run — full detail in the 06-29 report, only worth re-stating the ones with new information:
- **M-2** (stale GH Actions `@v3` across 5 CI guides) — now worse: `@v3` is 3-4 majors behind current `checkout@v7`/`setup-node@v6.4.0`, not 1.
- **M-11** (angular-rspack "Nx 20.6" floor) — confirmed NOT resolved by v23 shipping, now 3 majors stale.
- **M-13** (module-federation-and-nx.mdoc "As of Nx 19.5") — confirmed NOT resolved by v23 shipping, now 4 majors stale.
- M-4, M-5, M-6, M-7, M-8, M-9, M-10, M-12, M-14 through M-21 — all still open, unchanged.

---

## LOW Severity

### L-A — `custom-workspace-rules.mdoc` stale TODO gating content on ESLint v9 support — NEW
**File:** `technologies/eslint/Guides/custom-workspace-rules.mdoc` (lines 11, 270)
**Issue:** TODO comment says a "Quick Start with the Generator" section will be added "once `@nx/eslint:workspace-rule` supports ESLint v9." Verified: `packages/eslint/src/generators/workspace-rule/workspace-rule.ts` already fully supports ESLint v9 (explicitly wires up `@typescript-eslint/rule-tester` because "ESLint v9 dropped the eslintrc-style RuleTester API"). The premise is already false.

### L-B — `browser-support.mdoc` sample browserslist output is ~2020-era — NEW
**File:** `guides/Tips-n-Tricks/browser-support.mdoc` (lines 33-51)
**Issue:** Sample `npx browserslist` output shows `chrome 83`, `firefox 78`, `ie 11`, etc. — circa 2020, undercuts the doc's own point about "aggressively modern" default output.

### L-1 through L-17 (carried from 2026-06-29, all still open, unchanged)
Full detail in the 06-29 report. No new information this run beyond confirming each is unchanged. Worth flagging: **L-16** (`getting-started/installation.mdoc` sample version `22.5.0`) is now doubly stale since current is `23.0.1`, not just a 22.x patch.

---

## Needs Input

New this run:
- **`technologies/react/next/introduction.mdoc`** — docs state Next.js floor `>=15.0.0 <17.0.0`; `packages/next/package.json` peerDependency is `>=14.0.0 <17.0.0`. Could be an intentional recommendation (skip 14) rather than a bug — needs a Next/React team call.
- **`technologies/angular/Guides/angular-nx-version-matrix.mdoc`** — row `~22.0.0 | latest | >=23.1.0 <=latest`: current published Nx is 23.0.1, not yet 23.1.0, so this row is forward-looking to an unreleased minor. Plausible/intentional but worth confirming with the Angular team.

Carried, still unresolved (tool access blocked or genuine docs-team judgment call — detail in 06-29 report):
- CircleCI `nrwl/nx` orb version claims (`setup-ci.mdoc` vs `bring-your-own-compute.mdoc` disagree, 1.7.0 vs 1.5.1) — CircleCI's API/orb repo aren't in this session's GitHub scope (`nrwl/nx` and `jaysoo/dot-ai-config` only); needs a human or a session with broader access to check the orb registry.
- `guides/Nx Console/console-nx-cloud.mdoc` — has the JetBrains Nx Cloud CI pipeline view actually shipped yet?
- `reference/nx-mcp.mdoc` / `reference/nx-cloud-cli.mdoc` — keep, collapse, or remove legacy version-gated tabs (`Nx < 21.4`, `Nx >= 14.7`/`18`)? Docs-team call on how much LTS-user support to keep visible.
- `getting-started/Tutorials/gradle-tutorial.mdoc` — Gradle 8.5 sample output; is this worth re-running with a newer Gradle?

---

## Linear Issues to Create (queued — MCP still unavailable, 6th run in a row)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**. Numbering restarts this run to reflect the corrected/updated set — see retraction table above for what's dropped from 06-29's queue.

| # | Title | Severity | Files |
|---|---|---|---|
| 1 | Add deprecation notices/migration links to 11 Module Federation guides still teaching host/remote/federate-module | High | 11 files |
| 2 | Fix nx-json.mdoc "Task options" table: only parallel/cacheDirectory are root-level; fix encryptionKey→nxCloudEncryptionKey, document tui.suppressHints and NX_MULTI_MAJOR_MODE, remove dead NX_RUNNER from environment-variables.mdoc | High | 2 files |
| 3 | Replace deprecated @storybook/testing-library/@storybook/jest and default addon-essentials/addon-interactions across 10 Storybook guides | High | 10 files |
| 4 | Fix compose-executors.mdoc: use "executor" not "builder", cypress.config.ts not cypress.json | High | 1 file |
| 5 | Fix migration-generators.mdoc: remove non-existent --project flag from example | High | 1 file |
| 6 | Fix publish-rust-crates.mdoc: @monodon/rust 3.0.0 now ships VersionActions — remove useLegacyVersioning instructions | High | 1 file |
| 7 | Reword terminal-ui.mdoc Windows TUI notice (shipped for Windows Terminal/VSCode/ConEmu/alacritty; verify remaining gaps) | High | 1 file |
| 8 | Add Node 20 EOL notices to Nx Cloud launch templates/examples; replace EOL node-21 example | High | 2 files |
| 9 | Fix reference/Deprecated files: change future tense to past tense for Nx 20/21 milestones | High | 3 files |
| 10 | Bump actions/checkout@v6→v7 in self-healing-ci.mdoc and use-bun.mdoc | High | 2 files |
| 11 | Fix webpack-plugins.mdoc: remove deleteOutputPath (removed Nx 22), fix externalDependencies default (all, not none), document 6 missing options | Medium | 1 file |
| 12 | Document missing buildDepsTargetName/watchDepsTargetName in webpack/rspack introduction pages | Medium | 2 files |
| 13 | Add missing options/configuration section to rsbuild/introduction.mdoc | Medium | 1 file |
| 14 | Fix angular/introduction.mdoc: correct default test runners (Playwright/Vitest, not Jest/Cypress) | Medium | 1 file |
| 15 | Add deprecation note to @nx/rollup:rollup executor mentions in typescript guides | Medium | 2 files |
| 16 | Document missing buildTargets option in enforce-module-boundaries.mdoc | Medium | 1 file |
| 17 | Update cypress-component-testing.mdoc floor from v10 to v13 | Medium | 1 file |
| 18 | Update remaining @v3 GitHub Actions references to current majors across 5 CI guides | Medium | 5 files |
| 19 | Fix Storybook angular-configuring-styles.mdoc: remove removed webpack5 builder + React-only docgen options | Medium | 1 file |
| 20 | Fix Storybook best-practices.mdoc: update 7-era URLs and 2022 blog link | Medium | 1 file |
| 21 | Update bundling-node-projects.mdoc target from node18 to node22+ | Medium | 1 file |
| 22 | Add explicit Node 20 EOL callout to the 22.x compatibility-table row in node/introduction.mdoc | Medium | 1 file |
| 23 | Fix setup-incremental-builds-angular.mdoc: @angular/build:browser is not a real executor | Medium | 1 file |
| 24 | Add deprecation note to use-environment-variables-in-angular.mdoc for @angular-devkit/build-angular:browser | Medium | 1 file |
| 25 | Fix manage-library-versions-with-module-federation.mdoc: import from @nx/module-federation not @nx/webpack | Medium | 1 file |
| 26 | Remove "As of Nx 19.5" framing from module-federation-and-nx.mdoc | Medium | 1 file |
| 27 | Fix react-compiler.mdoc: React Compiler is no longer experimental in React 19 | Medium | 1 file |
| 28 | Fix nx-daemon.mdoc: useDaemonProcess is top-level not under runners options; replace `nx affected:test` example with `nx affected -t test` | Medium | 1 file |
| 29 | Fix Nx Cloud config.mdoc: update stale "Nx >= 17"/"Nx >= 19.7" tab labels | Medium | 1 file |
| 30 | Fix access-tokens.mdoc: remove "authentication is changing" stale aside | Medium | 1 file |
| 31 | Fix custom-workspace-rules.mdoc: remove stale "once ESLint v9 is supported" TODO — it already is | Low | 1 file |
| 32 | Fix Storybook guide URLs: update 7-era /docs/{framework}/... paths | Low | 7 files |
| 33 | Update browser-support.mdoc sample browserslist output (currently ~2020-era) | Low | 1 file |
| 34 | Clean up low-value "since Nx X" qualifiers referencing Nx 15-20 in current-state docs | Low | 10+ files |
| 35 | Update getting-started/installation.mdoc sample version from 22.5.0 to current | Low | 1 file |

---

## Recurring Checks (unchanged from README, still holding up)

Ground-truth commands used this run — re-run these every time, never trust a prior scan's baseline or training-data version knowledge:

```bash
npm view nx dist-tags
npm view node dist-tags
npm view react version && npm view @angular/core version && npm view typescript version \
  && npm view eslint version && npm view cypress version && npm view storybook version \
  && npm view vite version && npm view webpack version && npm view jest version
```

For GitHub Actions versions, fetch `https://api.github.com/repos/<owner>/<action>/releases/latest` per action referenced in docs.
