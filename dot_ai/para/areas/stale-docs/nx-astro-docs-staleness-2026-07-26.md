# Nx Astro Docs Staleness Audit — 2026-07-26

**Scope:** full exhaustive sweep of all 480 `.mdoc` files under `astro-docs/src/content/docs/` (and `quickstart.mdoc`), split across 13 parallel read-only agents by folder (concepts, enterprise/platform-features, features, getting-started/tutorials, guides ×2, reference ×2, technologies/angular+react+vue, remaining technologies, kb ×3). This is the first full re-sweep since the [2026-06-29 audit](./nx-astro-docs-staleness-2026-06-29.md) — the 2026-07-10 pass was intentionally narrow (3 agents).

**Verification baseline (live, not training data):**
- Current Nx: **23.1.0** (`https://registry.npmjs.org/nx/latest`)
- Node.js: `latest` dist-tag is **26.5.0**. Per Node's release cadence, Node 26 is Current, Node 24 is Active LTS, Node 22 is Maintenance LTS, and **Node 20 is EOL (April 2026, already passed as of today)**, Node 18/16 long EOL.
- Cypress: latest is **15.19.0**; `@nx/cypress` peer range is `>=13 <16`.
- GitHub Actions `actions/checkout` / `actions/setup-node` latest majors could **not** be verified this cycle (API calls to `api.github.com` returned empty — likely proxy/network restriction for that host). Any checkout/setup-node version findings below are filed under Needs Input rather than asserted.

Every finding below that cites source (schema.json, generators.json, migration files) was independently re-verified by me against `/home/user/nx/packages/` after the scanning agents reported it — not taken on the agents' word alone.

**Linear MCP unavailable again** — see status note at the bottom. This is the **7th consecutive audit cycle** without programmatic Linear access. All issues below are queued for manual creation, merged into the running backlog from prior audits.

---

## Summary

| Category | Re-verified (still open from prior audits) | New this cycle | Needs Input |
|---|---|---|---|
| Old Nx version reference | 3 | 4 | 1 |
| Old/EOL Node or package version | 2 | 3 | 1 |
| Mismatched CLI/feature vs. source | 4 | 9 (incl. 6-page Module Federation cluster) | 2 |
| **Total** | **9** | **16** | **4** |

---

## Re-verified Findings (still open, unfixed since prior audits)

### R-1 — `concepts/nx-daemon.mdoc`: `useDaemonProcess` location is wrong (= prior backlog item 22)
**File:** `astro-docs/src/content/docs/concepts/nx-daemon.mdoc` (~line 40)
**Issue:** Tells readers to disable the daemon by setting `useDaemonProcess: false` "in the runners options in `nx.json`" (i.e. nested under `tasksRunnerOptions.default.options`). That location was migrated away by `packages/nx/src/migrations/update-20-0-0/move-use-daemon-process.ts` — the field has been a **top-level** `nx.json` property (`NxJsonConfiguration.useDaemonProcess`, `packages/nx/src/config/nx-json.ts:984`) since Nx 20. Current Nx is 23.1.0, so this has been wrong for 3 majors.
**Confidence:** High

### R-2 — `kb/module-federation-and-nx.mdoc`: "As of Nx 19.5" framing (≈ prior NI-1 / backlog item 20)
**File:** `astro-docs/src/content/docs/kb/module-federation-and-nx.mdoc` (line 12)
**Issue:** "As of Nx 19.5, our Module Federation support is provided by the `@module-federation/enhanced` package." Still accurate, still a stale-feeling anchor 4 majors later.
**Confidence:** Low (cosmetic — see also the much bigger new finding on this same file, C-9 below)

### R-3 — `kb/include-all-packagejson.mdoc`: "As of Nx 15.0.11" (= prior NI-3)
**File:** `astro-docs/src/content/docs/kb/include-all-packagejson.mdoc`
**Issue:** "As of Nx 15.0.11, we only include any `package.json` file that is referenced in the `workspaces` property..." Mechanism still checks out against `nx/plugins/package-json` source, but Nx 15 is 8 majors back.
**Confidence:** Low

### R-4 — `kb/launch-template-examples.mdoc`: Node 21 illustrative example (= prior NI-5 / backlog item 9 area)
**File:** `astro-docs/src/content/docs/kb/launch-template-examples.mdoc`
**Issue:** The "custom node version" walkthrough is built entirely around Node 21 (`node-21` template key, `nvm install 21.7.3`) — never an LTS release, EOL since mid-2024 — while the rest of the page's launch template images default to `node24.14`.
**Confidence:** Low-medium

### R-5 — `kb/bundling-node-projects.mdoc`: `target: 'node18'` (= prior backlog item 16)
**File:** `astro-docs/src/content/docs/kb/bundling-node-projects.mdoc`
**Issue:** Vite bundling example config targets `node18` in `vite.config.ts`. Node 18 is long past EOL; current LTS lines are 22/24.
**Confidence:** Medium

### R-6 — Deprecated Storybook test packages still shown as current (expanded from prior backlog item 13 — now 4 files, was 3)
**Files:**
- `kb/storybook-interaction-tests.mdoc`
- `kb/overview-react.mdoc`
- `kb/overview-angular.mdoc`
- `kb/storybook-composition-setup.mdoc` (new page not previously flagged — lists `@storybook/addon-essentials`)

**Issue:** All still show `import { within, userEvent } from '@storybook/testing-library'; import { expect } from '@storybook/jest';` and/or `addons: ['@storybook/addon-essentials']`. `packages/storybook/src/migrations/update-21-2-0/remove-addon-dependencies.ts` confirms these are "no longer needed in Storybook 9+" — current generator output imports from `storybook/test` instead.
**Confidence:** High

### R-7 — `kb/publish-rust-crates.mdoc`: guide requires a removed option (= prior backlog item 7)
**File:** `astro-docs/src/content/docs/kb/publish-rust-crates.mdoc`
**Issue:** States `release.version.useLegacyVersioning: true` is "currently required," while the page's own caution box says legacy versioning "has been removed entirely" in v22. Source confirms: `packages/nx/src/command-line/release/config/use-legacy-versioning.ts` — `// TODO(v23): remove — kept only so @nx/js@21's library generator can load via ensurePackage` / `@deprecated Compat shim for @nx/js@21`. Current Nx is 23.1.0 — this shim is due for removal in the version readers are on *right now*. The recipe's core instructions are likely already broken for most readers.
**Confidence:** High

### R-8 — `kb/terminal-ui.mdoc`: stale Windows caveat (= prior backlog item 8)
**File:** `astro-docs/src/content/docs/kb/terminal-ui.mdoc`
**Issue:** "The initial Nx 21 release disables the Terminal UI on Windows. We are currently working on Windows support, so stay tuned." `packages/nx/src/tasks-runner/is-tui-enabled.ts` has no Windows-specific disable and includes Windows-Terminal-aware unicode detection — Windows TUI support appears to have shipped since.
**Confidence:** Medium

### R-9 — `kb/manage-library-versions-with-module-federation.mdoc`: host/remote + `@nx/webpack` import (= prior backlog item 19)
**File:** `astro-docs/src/content/docs/kb/manage-library-versions-with-module-federation.mdoc`
**Issue:** `remote/module-federation.config.ts` example imports `ModuleFederationConfig` from `@nx/webpack` and is built on the host/remote pattern — see the much larger C-9 cluster below for why that pattern itself is now deprecated.
**Confidence:** Medium

---

## New Confirmed Findings

### C-1 — `reference/releases.mdoc`: "Supported versions" table one major behind (NEW — high value, recurring-by-design)
**File:** `astro-docs/src/content/docs/reference/releases.mdoc` (lines 36-38)
**Issue:** Table lists `v22 | Current`, `v21 | LTS`, `v20 | LTS`. Actual current is **v23** (23.1.0). Per the page's own stated policy ("18 total months of support"), v20 (released 2024-10-06) should already have fallen out of support entirely, not be listed as LTS.
**Snippet:** `| v22 | Current | 2025-10-22 | | v21 | LTS | 2025-05-05 | | v20 | LTS | 2024-10-06 |`
**Confidence:** High
**Note:** flagged independently by two separate scanning agents (reference part 1 and part 2).

### C-2 — `reference/Deprecated/legacy-cache.mdoc`: present/future tense about a 2-major-old transition (NEW, fits the same pattern as prior NI-4)
**File:** `astro-docs/src/content/docs/reference/Deprecated/legacy-cache.mdoc`
**Issue:** "In Nx 21, the legacy file system cache will be removed... The legacy file system cache can still be used in Nx 20 by setting `useLegacyCache: true`" — `useLegacyCache` no longer exists anywhere in `packages/nx/src/config/nx-json.ts`. Reads as still-pending rather than 2 majors done.
**Confidence:** Low (expected historical-context page, but tense is misleading)

### C-3 — `features/run-tasks.mdoc`: "In Nx 21" version anchor (NEW)
**File:** `astro-docs/src/content/docs/features/run-tasks.mdoc` (~line 109)
**Issue:** "In Nx 21, task output is displayed in an interactive terminal UI..." with no signal this remains default behavior in Nx 23.
**Confidence:** Low

### C-4 — `kb/adding-assets-react.mdoc`: SVGR removal in future tense (NEW)
**File:** `astro-docs/src/content/docs/kb/adding-assets-react.mdoc`
**Issue:** "As of Nx 22, SVGR is removed for Webpack and Next.js, and deprecated for Rspack (will be removed in Nx 23)." Current published Nx is already 23.1.0 and `packages/.../update-23-0-0/add-svgr-to-rspack-config` migration exists — the removal already happened.
**Confidence:** Low (directionally correct, just wrong tense)

### C-5 — Cypress migration guides point to an unsupported floor (NEW — smell-2 category not caught in prior audits)
**Files:**
- `kb/cypress-v11-migration.mdoc` — instructs `nx g @nx/cypress:migrate-to-cypress-11` as the on-ramp from Cypress v8/v9 to v10/v11.
- `kb/cypress-component-testing.mdoc` — "Component testing requires Cypress v10 and above. See our guide... to migrate to Cypress v10."

**Issue:** `@nx/cypress`'s current peerDependency floor is Cypress `>=13 <16` (verified against `packages/cypress/package.json`; npm shows Cypress latest is 15.19.0). Following either guide today migrates onto an already-unsupported Cypress version.
**Confidence:** High (v11-migration), Medium (component-testing)

### C-6 — `kb/browser-support.mdoc`: browserslist sample output is ~2020-era (NEW, low value)
**File:** `astro-docs/src/content/docs/kb/browser-support.mdoc`
**Issue:** Illustrative `npx browserslist` output shows Chrome 83, Firefox 78/68, IE 11, Safari 12/13 — and lists `ie 11` despite the sample query excluding IE, so it's internally inconsistent as well as dated.
**Confidence:** Low (illustrative, not a hard recommendation)

### C-7 — `createNodes`/`createNodesV2` guidance is inverted in 3 places (NEW)
**Files:**
- `concepts/inferred-tasks.mdoc` (~line 50) — presents `createNodes`/`createNodesV2` as equally valid, current hooks.
- `kb/project-graph-plugins.mdoc` — presents `createNodesV2`/`CreateNodesV2` as the primary, current plugin API throughout.
- `kb/tooling-plugin.mdoc` — full plugin tutorial exports `createNodesV2` and frames it as needed "if you need to support Nx versions before 21" — backwards, since `createNodes` is now canonical.

**Issue:** `packages/nx/src/project-graph/plugins/public-api.ts` marks `CreateNodesV2`/`createNodesV2` `@deprecated` (`Prefer createNodes for new plugins`), and `packages/devkit/src/migrations/update-23-0-0/rename-create-nodes-v2-types.ts` exists specifically to migrate plugin authors off it in the version that's current today.
**Confidence:** High (kb pages), Medium (concepts page)

### C-8 — `getting-started/Tutorials/angular-monorepo-tutorial.mdoc`: invalid generator flag (NEW — breaks the onboarding tutorial)
**File:** `astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo-tutorial.mdoc`
**Issue:** `npx nx g @nx/angular:library libs/ui --unitTestRunner=vitest` — verified against `packages/angular/src/generators/library/schema.json`, whose `unitTestRunner` enum is `["vitest-angular", "vitest-analog", "jest", "none"]`. Plain `"vitest"` is not a valid value and fails schema validation. This is a first-run tutorial command — a new user following it verbatim hits an error.
**Confidence:** High

### C-9 — Module Federation host/remote generators are deprecated/unsupported but taught as current across 8 KB pages (NEW — biggest cluster this cycle)
**Files:**
- `kb/create-a-host.mdoc` — "Nx includes first-class support for helping you to scaffold a Module Federation Architecture for your React and Angular application(s)" — no deprecation note.
- `kb/create-a-remote.mdoc` — same pattern for `:remote`.
- `kb/federate-a-module.mdoc` — teaches `@nx/react:federate-module` / `@nx/angular:federate-module`.
- `kb/faster-builds-with-module-federation.mdoc` — `nx g @nx/react:host` / `@nx/angular:host` as the current setup path.
- `kb/angular-module-federation-with-ssr.mdoc` — full `@nx/angular:host --ssr` + `serve-ssr` tutorial.
- `kb/dynamic-module-federation-with-angular.mdoc` — full multi-step tutorial built on `@nx/angular:host`/`:remote`.
- `kb/module-federation-and-nx.mdoc` — hub/overview page defines `host`/`remote` as *the* current terminology (see R-2 for this file's other, smaller issue).
- `kb/manage-library-versions-with-module-federation.mdoc` — same pattern (see R-9).

**Issue:** Verified directly in source:
- `packages/react/generators.json`: `"host": { ..., "x-deprecated": "Use \`@nx/react:consumer\` instead (dynamic federation, no static-serve orchestration). Removed in Nx v24." }`
- `packages/angular/generators.json`: `"host": { ... }` under an `x-deprecated` entry reading **"Angular Module Federation in Nx is no longer supported. Use `@angular-architects/native-federation` instead... Removed in Nx v24."**
- `packages/react/src/generators/` has `consumer/` and `provider/` generators (the React replacement); `packages/angular/src/generators/` has no equivalent — Angular MF has no in-Nx replacement at all.
- One correct, current reference page already exists — `kb/consumer-and-provider.mdoc` ("... (v23+)") — which explicitly states this deprecation. The 8 pages above simply don't link to it or mention it, so a reader landing on any of them via search has no way to know the workflow is being phased out.

**Confidence:** High across all 8 files — this is the single most actionable finding this cycle given how many entry points funnel into the deprecated path with zero warning.

### C-10 — `technologies/vue/nuxt/introduction.mdoc`: `testTargetName` belongs to a different plugin (NEW)
**File:** `astro-docs/src/content/docs/technologies/vue/nuxt/introduction.mdoc` (lines 67-87)
**Issue:** "The `buildTargetName`, `testTargetName` and `serveTargetName` options control the names of the inferred Nuxt tasks." `NuxtPluginOptions` in `packages/nuxt/src/plugins/plugin.ts` only defines `buildTargetName`, `serveTargetName`, `serveStaticTargetName`, `buildStaticTargetName`, `buildDepsTargetName`, `watchDepsTargetName` — no `testTargetName`. That option is real, but belongs to `@nx/vite:plugin` (registered alongside `@nx/nuxt/plugin` by the Nuxt init generator), not the Nuxt plugin itself.
**Confidence:** High

### C-11 — `technologies/test-tools/storybook/introduction.mdoc`: option name typo (NEW)
**File:** `astro-docs/src/content/docs/technologies/test-tools/storybook/introduction.mdoc` (line 76)
**Issue:** "The `builtStorybookTargetName`, `serveStorybookTargetName`, `testStorybookTargetName` and `staticStorybookTargetName` options..." — verified against `packages/storybook/src/plugins/plugin.ts`: the real option is `buildStorybookTargetName`, not `builtStorybookTargetName`.
**Confidence:** High

### C-12 — `technologies/test-tools/detox/introduction.mdoc`: copy-paste error (NEW, low severity but unambiguous)
**File:** `astro-docs/src/content/docs/technologies/test-tools/detox/introduction.mdoc` (line 63)
**Issue:** "The `@nx/detox` plugin will create a task for any project that has an ESLint configuration file present." Should reference Detox config files (`.detoxrc.js`, `detox.config.js`, etc.) — looks copy-pasted from the ESLint plugin doc.
**Confidence:** High (nature of the bug), flagged Low severity

### C-13 — `reference/nx-json.mdoc`: task options documented as root-level that aren't (NEW)
**File:** `astro-docs/src/content/docs/reference/nx-json.mdoc` (~line 194, "Task options" table)
**Issue:** Documents `captureStderr`, `skipNxCache`, `encryptionKey`, `selectivelyHashTsConfig` as configurable "at the root of `nx.json`." `getRunnerOptions()` in `packages/nx/src/tasks-runner/run-command.ts` only pulls `parallel`, `cacheDirectory`, and `nxCloud*` fields from the nx.json root; the other four are only wired up under `tasksRunnerOptions.<runner>.options` per `nx-schema.json`.
**Confidence:** Medium

### C-14 — `getting-started/installation.mdoc`: stale example version output (NEW, cosmetic)
**File:** `astro-docs/src/content/docs/getting-started/installation.mdoc`
**Issue:** "Verify installation" sample shows `nx --version` output pinned to `22.5.0` — one major behind current 23.1.0. Illustrative, not a hard requirement, but reads as implying v22 is roughly current.
**Confidence:** Low

---

## Needs Input

### NI-1 — `features/CI Features/self-healing-ci.mdoc`: `actions/checkout@v6`/`setup-node@v6` vs. sibling pages' `@v7`
Three sibling pages (`github-integration.mdoc`, `distribute-task-execution.mdoc`, `split-e2e-tasks.mdoc`) use `actions/checkout@v7` / `actions/setup-node@v6`, while `self-healing-ci.mdoc` uses `@v6` for both. Could not verify the true latest majors for `actions/checkout` / `actions/setup-node` this cycle — `api.github.com` calls returned empty (likely a proxy restriction on that host in this environment). Docs team should confirm current majors and align all four pages before filing as a hard bug.

### NI-2 — `guides/Nx Cloud/record-commands.mdoc`: "Nx Cloud 13.3 and above"
Still gates command recording behind "Nx Cloud 13.3 and above." This is Nx Cloud's own separate version scheme (not Nx core, so it doesn't cleanly match this audit's "Nx ≤20" smell), but the number reads old enough to confuse readers. Docs team judgment call on whether to keep or strip the version gate now that it's presumably long satisfied.

### NI-3 — `kb/manage-library-versions-with-module-federation.mdoc`: `@nx/webpack` import path
The scanning agent flagged the `ModuleFederationConfig` import from `@nx/webpack` as possibly stale (should perhaps be `@nx/module-federation`), consistent with a similar item already in the running backlog (item 19 from 2026-06-12). I did not independently re-verify the correct current import path this cycle — fold into C-9's Module Federation cluster fix rather than treating as separate.

### NI-4 — `reference/Owners/overview.mdoc`: malformed JSON example (content bug, not a staleness smell)
Around line 366-367 there's a stray duplicated comment fragment injected mid-line inside a JSON code block, producing invalid JSON in the example. Worth a quick fix but doesn't fit any of the three smells this audit tracks — flagging for the docs team's general-quality backlog rather than the Linear list below.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Carrying forward unresolved items from the [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) / [2026-07-10](./nx-astro-docs-staleness-2026-07-10.md) audits where re-verified this cycle (marked *carried*), plus new items from this full sweep.

| # | Title | Severity | Files | Status |
|---|---|---|---|---|
| 1 | Fix nx-daemon.mdoc: `useDaemonProcess` is top-level in nx.json, not nested in runners options | Medium | 1 | *carried, re-verified (R-1)* |
| 2 | Fix module-federation-and-nx.mdoc: strip stale "As of Nx 19.5" framing | Low | 1 | *carried, re-verified (R-2)* |
| 3 | Fix include-all-packagejson.mdoc: strip stale "As of Nx 15.0.11" anchor | Low | 1 | *carried, re-verified (R-3)* |
| 4 | Swap Node 21 for a current LTS in launch-template-examples.mdoc's custom-node-version example | Medium | 1 | *carried, re-verified (R-4)* |
| 5 | Bump EOL `target: 'node18'` in bundling-node-projects.mdoc | Medium | 1 | *carried, re-verified (R-5)* |
| 6 | Replace deprecated `@storybook/testing-library`/`@storybook/jest` with `storybook/test` and drop `@storybook/addon-essentials` | Medium | 4 (expanded from 3) | *carried, re-verified + expanded (R-6)* |
| 7 | Fix or archive publish-rust-crates.mdoc — `useLegacyVersioning` is a deprecated `@nx/js@21`-only shim, due for removal in v23 | High | 1 | *carried, re-verified (R-7)* |
| 8 | Update terminal-ui.mdoc: remove stale "Windows support coming" notice | Medium | 1 | *carried, re-verified (R-8)* |
| 9 | Fix manage-library-versions-with-module-federation.mdoc import + host/remote pattern | High | 1 | *carried, re-verified + superseded by #16 below (R-9)* |
| 10 | Fix reference/releases.mdoc "Supported versions" table — v23 is current, not v22; v20 should be out of support | High | 1 | **new (C-1)** |
| 11 | Fix reference/Deprecated/legacy-cache.mdoc: past-tense the Nx 20/21 cache transition | Low | 1 | **new (C-2)** |
| 12 | Strip stale "In Nx 21" version anchor from features/run-tasks.mdoc TUI note | Low | 1 | **new (C-3)** |
| 13 | Past-tense the SVGR/Rspack removal note in kb/adding-assets-react.mdoc (already shipped in v23) | Low | 1 | **new (C-4)** |
| 14 | Update Cypress migration guides — floor is now v13+, not v10/v11 | High | 2 | **new (C-5)** |
| 15 | Refresh stale/inconsistent browserslist sample output in kb/browser-support.mdoc | Low | 1 | **new (C-6)** |
| 16 | Fix createNodes/createNodesV2 guidance — createNodes is canonical, createNodesV2 is deprecated (docs currently say the opposite) | High | 3 | **new (C-7)** |
| 17 | Fix invalid `--unitTestRunner=vitest` flag in angular-monorepo-tutorial.mdoc (breaks the onboarding tutorial) | High | 1 | **new (C-8)** |
| 18 | Add deprecation notices (or rewrite) across the Module Federation host/remote KB cluster — generators are deprecated/unsupported, removed in Nx v24 | High | 8 (incl. R-9/#9 above — merge) | **new (C-9), largest cluster this cycle** |
| 19 | Fix @nx/nuxt/plugin docs: `testTargetName` belongs to @nx/vite:plugin, not Nuxt's plugin | Medium | 1 | **new (C-10)** |
| 20 | Fix Storybook plugin option typo: `builtStorybookTargetName` → `buildStorybookTargetName` | Medium | 1 | **new (C-11)** |
| 21 | Fix copy-paste error in technologies/test-tools/detox/introduction.mdoc ("ESLint configuration file" → Detox config file) | Low | 1 | **new (C-12)** |
| 22 | Fix reference/nx-json.mdoc: 4 task options documented as root-level actually only work under tasksRunnerOptions.\<runner\>.options | Medium | 1 | **new (C-13)** |
| 23 | Refresh stale example version output (22.5.0) in getting-started/installation.mdoc | Low | 1 | **new (C-14)** |

Items 1–27 from the 2026-06-29/07-10 audits that were **not** re-sampled this cycle (targeted-scope pages not covered by this sweep's file lists, e.g. compose-executors.mdoc, migration-generators.mdoc, react-compiler.mdoc, use-bun.mdoc, Angular Rspack getting-started) remain presumed open — carry them forward unchanged; they were out of scope for verification this cycle but nothing indicates they've been fixed.

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-26) where Linear issue creation could not be completed programmatically. This cycle's symptom: `ListConnectors` reports Linear as `connected: true` at the org level but **`enabledInChat: false`** for this session — unlike the 07-10 cycle where it showed `enabledInChat: true` with zero tools exposed. The symptom keeps shifting cycle to cycle (SSE transport removed → enabled-but-no-tools → now explicitly disabled-for-chat), which continues to point at something wrong with how the Linear connector gets attached to scheduled/automated sessions specifically, rather than a one-off blip. Recommend enabling the Linear connector explicitly for whatever session/environment runs this scheduled audit, or switching this routine to file issues via a different path (e.g. GitHub issues on a docs-tracking repo) if Linear access can't be made reliable for automated runs.

## Recurring Checks to Run

(unchanged from prior audits — see top of this file's README for the checklist)
