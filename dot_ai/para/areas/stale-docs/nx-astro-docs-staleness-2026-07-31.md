# Nx Astro Docs Staleness Audit — 2026-07-31

**Scope:** full sweep of all 478 `.mdoc` files under `astro-docs/src/content/docs/` (7 parallel agents, one per top-level folder / kb-half), scoped to exactly the three smells requested this cycle: (1) old Nx major version mentions, (2) old Node/npm/framework version mentions, (3) documented CLI/generator/executor options that no longer match source. This is the most complete file-coverage since the 2026-06-29 audit (503 files then vs. 478 now — folder reorganization/renames account for the difference, not missing content).

Current Nx: **23.2.0-beta.2** (verified live from root `package.json` `"nx"` devDependency and `git log`/`nx.json`, not from training data). Node current: **24.x Active LTS**, **26.x** now on the Current release track (per `technologies/node/introduction.mdoc`, itself accurate and up to date); **22.x Maintenance LTS**; **Node 20 EOL since April 2026** (i.e. as of today); **Node 18 long EOL**. React current: **19.x**. No drift found against this baseline in framework-version tables — the docs' own version-support tables for Node/React/Angular/Vue were, with one exception (see C-2), accurate.

**Linear MCP unavailable again — 7th consecutive audit cycle** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-31). See escalation note at the bottom. All issues below are queued for manual creation, merged into the running backlog from prior audits.

---

## Summary

| Category | Confirmed (new) | Re-verified still-open (from prior backlog) | Needs Input |
|---|---|---|---|
| Old Nx version reference | 0 new | 0 sampled this cycle | 0 |
| Old Node/npm/framework version | 0 new | 1 (bundling-node-projects.mdoc `node18` target) | 0 |
| Mismatched CLI/feature vs. source | 6 (**new**) | 2 (compose-executors.mdoc "builder", nx-daemon.mdoc `useDaemonProcess` placement) | 2 |
| **Total** | **6** | **3** | **2** |

---

## Confirmed New Findings

### C-1 — `technologies/test-tools/playwright/introduction.mdoc`: documents preset options that don't exist
**File:** `astro-docs/src/content/docs/technologies/test-tools/playwright/introduction.mdoc` (~lines 276–295)
**Category:** mismatched-feature
**Issue:** Shows `nxE2EPreset(...)` called with `includeMobileBrowsers: true` and `includeBrandedBrowsers: true`. `packages/playwright/src/utils/preset.ts`'s `NxPlaywrightOptions` interface only defines `testDir`, `openHtmlReport`, and `generateBlobReports` — there is no mobile/branded-browser option anywhere in `@nx/playwright`, and the preset no longer builds a browser-projects array at all. A reader copying this example gets silently-ignored options and never learns about the two real current options.
**Excerpt:** `includeMobileBrowsers: true, // includes mobile Chrome and Safari` / `includeBrandedBrowsers: true, // includes Google Chrome and Microsoft Edge`

---

### C-2 — `reference/releases.mdoc`: version support table stale, missing current major entirely
**File:** `astro-docs/src/content/docs/reference/releases.mdoc` (lines 34–38)
**Category:** old-nx-version
**Issue:** The "Supported versions" table:
```
| v22 | Current | 2025-10-22 |
| v21 | LTS      | 2025-05-05 |
| v20 | LTS      | 2024-10-06 |
```
Nx is already on **23.2.0-beta.2** — v23 isn't in the table at all, and v22 is still labeled "Current". By the page's own stated policy (new major every ~6 months, 18 months total support), v20 (released 2024-10-06) would have aged out around 2026-04, and v21's LTS window is also expiring right around today's date. This is presented as the live, current-as-of-today support matrix, not historical content, so it needs a routine update — likely worth flagging to Docs as a page that needs to be kept current on every major release rather than a one-off fix.
**Excerpt:** `| v22 | Current | 2025-10-22 |`

---

### C-3 — `reference/nx-json.mdoc`: "Task options" table claims tasksRunnerOptions-only properties work at nx.json root
**File:** `astro-docs/src/content/docs/reference/nx-json.mdoc` (lines ~190–201, "## Task options")
**Category:** mismatched-feature
**Issue:** Table intro says "The following properties affect the way Nx runs tasks and can be set at the root of `nx.json`," then lists `parallel`, `captureStderr`, `skipNxCache`, `cacheDirectory`, `encryptionKey`, `selectivelyHashTsConfig`. Checked `packages/nx/src/config/nx-json.ts` (`NxJsonConfiguration` interface) and `packages/nx/schemas/nx-schema.json`: only `parallel` and `cacheDirectory` are actually root nx.json properties. `captureStderr`, `skipNxCache`, `encryptionKey`, and `selectivelyHashTsConfig` only exist inside the deprecated `tasksRunnerOptions.<runner>.options` object — confirmed at runtime too, `getRunnerOptions()` in `packages/nx/src/tasks-runner/run-command.ts` reads these exclusively from `nxJson.tasksRunnerOptions?.[runner]?.options`, never from the nx.json root. Setting 4 of the 6 listed properties at the root has no effect.
**Excerpt:** `The following properties affect the way Nx runs tasks and can be set at the root of nx.json.` (followed by the table)

---

### C-4 — `features/CI Features/sandboxing.mdoc`: `nx show target --inputs --outputs` flags don't exist
**File:** `astro-docs/src/content/docs/features/CI Features/sandboxing.mdoc` (lines ~169–180)
**Category:** mismatched-feature
**Issue:** Instructs readers to run `nx show target <project>:<target> --inputs --outputs` (and with `--json`), with an aside claiming "The `--inputs` and `--outputs` flags for `nx show target` require Nx 22.6 or later." Checked `packages/nx/src/command-line/show/command-object.ts`: there is no `--inputs`/`--outputs` flag on `show target` — instead there are dedicated subcommands `nx show target inputs <project>:<target>` and `nx show target outputs <project>:<target>` (each with their own `--check`/`--json` options; see `show-target/inputs.ts`, `show-target/outputs.ts`). The documented flag-based syntax fails as written.
**Excerpt:** `nx show target <project>:<target> --inputs --outputs`

---

### C-5 — `getting-started/Tutorials/angular-monorepo-tutorial.mdoc`: invalid `--unitTestRunner=vitest` value
**File:** `astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo-tutorial.mdoc` (line 247)
**Category:** mismatched-feature
**Issue:** `npx nx g @nx/angular:library libs/ui --unitTestRunner=vitest` — `packages/angular/src/generators/library/schema.json`'s `unitTestRunner` enum is `["vitest-angular", "vitest-analog", "jest", "none"]`. Plain `"vitest"` is not (and no longer) a valid value; this command fails schema validation as written. This is a high-traffic onboarding tutorial, so worth prioritizing.
**Excerpt:** `npx nx g @nx/angular:library libs/ui --unitTestRunner=vitest`

---

### C-6 — `kb/create-server.mdoc`: documents an API that doesn't exist in `@nx/angular-rspack`
**File:** `astro-docs/src/content/docs/kb/create-server.mdoc` (whole page, ~line 12 onward)
**Category:** mismatched-feature
**Issue:** Documents `import { createServer } from '@nx/angular-rspack/ssr'` and a `createServer(...)` function returning `RsbuildAngularServer`, built around an Express server instance. Checked `packages/angular-rspack/package.json` — its `exports` map has no `./ssr` entry at all (only `.` and three `./loaders/*` entries). A repo-wide grep for `createServer`, `RspackAngularServer`, and `RsbuildAngularServer` inside `packages/angular-rspack` and `packages/angular-rspack-compiler` returns zero matches, and neither package depends on `express`. This documented feature does not appear to exist in the current codebase — likely a page written ahead of an API that was never shipped, or for one that was since removed.
**Excerpt:** `import { createServer } from '@nx/angular-rspack/ssr';`

---

## Re-verified Still-Open Findings (from prior backlog)

These came up incidentally while scanning this cycle and confirm they're still unfixed — not counted as new, already tracked in the Linear backlog below.

### R-1 — `kb/compose-executors.mdoc` still uses `"builder"` instead of `"executor"` (= backlog #4)
Line 31: `"builder": "@nx/cypress:cypress"` inside a `project.json` example with no `targets` wrapper. `"builder"` is only recognized when converting a legacy `angular.json`/old-format `workspace.json` — modern `project.json` requires `executor` inside a `targets` object. Still present, unchanged since at least the 2026-06-29 audit.

### R-2 — `kb/bundling-node-projects.mdoc` still targets EOL `node18` (= backlog #16)
Line 115: Vite/esbuild config example sets `target: 'node18'`. Node 18 has been EOL since April 2025. Still present, unchanged.

### R-3 — `concepts/nx-daemon.mdoc`: `useDaemonProcess` placement still wrong (= backlog #22)
Line 40: "set `useDaemonProcess: false` in the runners options in `nx.json`." Verified against `packages/nx/src/config/nx-json.ts` (line 984) and `packages/nx/schemas/nx-schema.json` (line 147): `useDaemonProcess` is a top-level `NxJsonConfiguration` property, not nested under `tasksRunnerOptions.<runner>.options`. Still present, unchanged.

---

## Needs Input

### NI-1 — `reference/Owners/overview.mdoc`: content corruption around line 367
A stray sentence fragment appears to have been injected mid-JSON-comment inside a code block, breaking it. Not a version-staleness issue under the three requested categories, so not counted as a formal finding, but likely worth a separate editorial cleanup pass — flagging here so it isn't lost.

### NI-2 — `enterprise/owners.mdoc`, `enterprise/conformance.mdoc`, `reference/Conformance/*`, `reference/Owners/*`, `reference/nx-mcp.mdoc`: can't verify against source
These document `@nx/owners`, `@nx/conformance`, and the separately-published `nx-mcp` package — none of which exist in this open-source repo's `packages/` tree (closed-source/Nx Cloud or separately published). Content reads as plausible and internally consistent; no concrete evidence of staleness, but genuinely unverifiable from this checkout. Same pattern as prior audits' NI-6/NI-7/NI-8 — carrying forward as a standing caveat rather than re-litigating each cycle.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Items 1–27 carried forward unchanged from the [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) / [2026-07-10](./nx-astro-docs-staleness-2026-07-10.md) audits (still unfixed; #4, #16, #22 re-verified this cycle — see R-1/R-2/R-3 above). Items 28–33 are new this cycle.

| # | Title | Severity | Files |
|---|---|---|---|
| 1 | Fix compatibility tables: Nx version labeled as (current) incorrectly in node/nest/typescript introductions | High | 3 files |
| 2 | Remove/gate version-ahead content in consumer-and-provider.mdoc and migrating-from-nx-vite.mdoc | High | 2 files |
| 3 | Fix Angular Rspack getting-started: workspace-creation version in sample output | High | 1 file |
| 4 | Fix compose-executors.mdoc: use "executor" not "builder", use cypress.config.ts not cypress.json (still open — re-verified via R-1 this cycle) | High | 1 file |
| 5 | Fix migration-generators.mdoc: remove non-existent --project flag from example | High | 1 file |
| 6 | Fix GitHub Actions versions: nonexistent action majors (self-healing-ci, use-bun) | High | 2 files |
| 7 | Archive or fix publish-rust-crates.mdoc: guide is broken (useLegacyVersioning removed, unfulfilled version promise) | High | 1 file |
| 8 | Update terminal-ui.mdoc: remove stale Windows TUI "currently working on" notice | High | 1 file |
| 9 | Add Node 20 EOL notices to Nx Cloud launch templates and examples | High | 2 files |
| 10 | Update reference/Deprecated files: change future tense to past tense for Nx 20/21 milestones | High | 3 files |
| 11 | Update version-ahead deprecation callouts across build tools and framework guides | Medium | 5 files |
| 12 | Update GitHub Actions versions to current majors across CI guides | Medium | 5+ files |
| 13 | Replace deprecated @storybook/testing-library and @storybook/jest with @storybook/test | Medium | 3 files |
| 14 | Fix Storybook angular-configuring-styles: remove webpack5 builder and React-specific options | Medium | 1 file |
| 15 | Fix Storybook best-practices: update stale Storybook URLs and old blog link | Medium | 1 file |
| 16 | Update bundling-node-projects.mdoc: bump EOL `target: 'node18'` esbuild/Rollup target (still open — re-verified via R-2 this cycle) | Medium | 1 file |
| 17 | Fix setup-incremental-builds-angular.mdoc: @angular/build:browser is not a real executor | Medium | 1 file |
| 18 | Fix use-environment-variables-in-angular.mdoc: add deprecation note for @angular-devkit/build-angular:browser | Medium | 1 file |
| 19 | Fix manage-library-versions-with-module-federation.mdoc: import from @nx/module-federation not @nx/webpack | Medium | 1 file |
| 20 | Update module-federation-and-nx.mdoc: remove "As of Nx 19.5" framing | Medium | 1 file |
| 21 | Fix react-compiler.mdoc: React Compiler is no longer experimental in React 19 | Medium | 1 file |
| 22 | Fix nx-daemon.mdoc: useDaemonProcess is top-level in nx.json, not in runners options (still open — re-verified via R-3 this cycle) | Medium | 1 file |
| 23 | Fix Nx Cloud config.mdoc: update stale version-tab labels | Medium | 1 file |
| 24 | Fix access-tokens.mdoc: remove "authentication is changing" stale aside | Medium | 1 file |
| 25 | Fix Storybook guide URLs: update old framework-prefixed doc paths | Low | 6 files |
| 26 | Clean up low-value version qualifiers: old "since version X" notes in current docs | Low | 8+ files |
| 27 | Fix react/introduction.mdoc: `--bundler` option list conflates application vs. library enums, missing `rsbuild`, wrongly includes `rollup` for applications | Medium | 1 file |
| **28** | **Fix playwright/introduction.mdoc: `includeMobileBrowsers`/`includeBrandedBrowsers` preset options don't exist in `@nx/playwright`** | **High** | **1 file** |
| **29** | **Fix reference/releases.mdoc: version support table stale — still lists v22 as Current, omits v23, v20/v21 windows likely expired** | **High** | **1 file** |
| **30** | **Fix nx-json.mdoc Task options table: `captureStderr`/`skipNxCache`/`encryptionKey`/`selectivelyHashTsConfig` only work inside `tasksRunnerOptions.<runner>.options`, not at nx.json root** | **High** | **1 file** |
| **31** | **Fix sandboxing.mdoc: `nx show target --inputs --outputs` flags don't exist — use `nx show target inputs/outputs <project:target>` subcommands** | **High** | **1 file** |
| **32** | **Fix angular-monorepo-tutorial.mdoc: `--unitTestRunner=vitest` is not a valid enum value (use vitest-angular/vitest-analog/jest/none)** | **High** | **1 file** |
| **33** | **Fix/archive kb/create-server.mdoc: documents `createServer`/`@nx/angular-rspack/ssr` API that doesn't exist in the package** | **Medium** | **1 file** |

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-31) where Linear issue creation could not be completed programmatically. This cycle's symptom: `ListConnectors` reports Linear as `connected: true` at the org level, but `enabledInChat: false` — the connector is authenticated but simply not toggled on for this chat session, so no `mcp__Linear__*` tools ever load via `ToolSearch` no matter what's searched. This is a *different* symptom than 07-10 (`enabledInChat: true` but zero tools exposed) and 06-17 ("SSE transport removed"), which suggests the failure mode itself is drifting cycle to cycle, not just persisting — worth investigating directly rather than continuing to retry per-audit. Recommend either (a) enabling the Linear connector for whatever chat/session this scheduled routine runs in, or (b) switching this routine to file issues via a stable, non-interactive path (e.g. Linear's own API with a stored key) instead of the per-session MCP toggle.

**Given 7 straight failures, this audit's new items (28–33) push the manual-creation backlog to 33 issues.** Recommend the docs team (or whoever owns this routine) do a manual bulk-import from this backlog rather than waiting for MCP access to resolve.

## Recurring Checks to Run

(unchanged from prior audits — see top of this file's README for the checklist)
