# Nx Astro Docs Staleness Audit — 2026-08-03

**Scope note:** targeted 3-smell pass (old Nx versions / old Node-npm-framework versions / docs-vs-code option drift), same scope as 2026-07-10 — not a full re-sweep of all 478 `.mdoc` files. Re-verified 3 previously-flagged, still-unfixed issues with sharper source evidence this cycle, and surfaced 3 new findings (all in `reference/nx-json.mdoc` / `reference/environment-variables.mdoc`, none previously queued). Treat the [2026-06-29 audit](./nx-astro-docs-staleness-2026-06-29.md)'s backlog as still the authoritative full list for anything not touched this cycle.

**Live version verification** (per this file's own anti-false-positive rules — training data not used):
- `npm view nx version` → **23.1.1** published; this repo's dev branch pins `23.2.0-beta.4` in `packages/nx/package.json` — current major is **23**, consistent with the 07-10 audit.
- `npm view node dist-tags` → `latest: 26.5.1`. Combined with `technologies/node/introduction.mdoc` (already confirmed accurate on 07-10: Node 24.x Active LTS, 22.x Maintenance, 20 EOL April 2026 — already passed as of today, 18 long EOL).
- `npm view react version` → **19.2.8** — current major React 19.

No drift found between these live numbers and what the docs already assert on the pages checked this cycle.

**Linear MCP unavailable again (7th consecutive audit cycle)** — symptom changed again this time, see escalation section at the bottom. All issues below are queued for manual creation, merged into the running backlog from prior audits.

---

## Summary

| Category | Confirmed (new or re-verified) | Needs Input |
|---|---|---|
| Old Nx version reference | 2 (re-verified, previously known: backlog #8, #10) | 2 |
| Old Node/npm/framework version | 1 (re-verified, previously known: backlog #16) | 0 |
| Mismatched CLI/feature vs. source | 3 (**all new**) | 2 |
| **Total** | **6** | **4** |

---

## Confirmed Findings

### C-1 — `reference/Deprecated/v1-nx-plugin-api.mdoc` gives the wrong removal version, not just wrong tense (re-verified, = prior C-1/H-13, sharper evidence)
**File:** `astro-docs/src/content/docs/reference/Deprecated/v1-nx-plugin-api.mdoc` (line 11)
**Category:** old-nx-version
**Issue:** "This API has been superceded by the v2 API and **will be removed in Nx 20**." Prior audits flagged this as stale future-tense phrasing. This cycle I cross-checked it against the same doc set's own `kb/createnodes-compatibility.mdoc` compatibility table, which states the v1 `createNodes` signature was still called as a fallback through Nx 20.x ("19.2.x - 20.x → Yes (fallback) / Yes (preferred)") and was only fully dropped starting **Nx 21.x** ("21.x → No / Yes → Only v2 supported"). Verified against current source (`packages/nx/src/project-graph/plugins/loaded-nx-plugin.ts`), which only supports the v2-signature `createNodes`/`createNodesV2` today. So this isn't just stale tense — **the version number itself is off by one major** (should say "removed in Nx 21", not "Nx 20").
**Excerpt:** `will be removed in Nx 20`

---

### C-2 — `kb/terminal-ui.mdoc` Windows compatibility note is confirmed stale, not just old (re-verified, = prior backlog #8, sharper evidence)
**File:** `astro-docs/src/content/docs/kb/terminal-ui.mdoc` (lines 15–16)
**Category:** old-nx-version / feature-drift
**Issue:** Aside "Windows Compatibility": "The initial Nx 21 release disables the Terminal UI on Windows. We are currently working on Windows support, so stay tuned." Prior audits flagged this as stale by inference. This cycle I read `packages/nx/src/tasks-runner/is-tui-enabled.ts` directly: there is no blanket `win32` disable anywhere in `shouldUseTui()`. Windows is gated the same way as other platforms, through `isUnicodeSupported()`, which has explicit Windows-terminal-capability detection (Windows Terminal via `WT_SESSION`, VS Code integrated terminal, ConEmu/cmder, Terminus). Windows support has shipped; the "stay tuned" framing actively misleads current readers into thinking the TUI is unavailable on Windows.
**Excerpt:** `The initial Nx 21 release disables the Terminal UI on Windows... stay tuned`

---

### C-3 — `kb/bundling-node-projects.mdoc` still targets EOL Node 18 (re-verified, = prior backlog #16)
**File:** `astro-docs/src/content/docs/kb/bundling-node-projects.mdoc` (line 115)
**Category:** old-node-version
**Issue:** Vite bundling example: `target: 'node18'`. Node 18 has been EOL since April 2025; Node 20 is now also EOL as of April 2026 (per live `npm view node dist-tags` check above — today is 2026-08-03). Should target `node22` at minimum, ideally `node24` to match current Active LTS.
**Excerpt:** `target: 'node18',`

---

### C-4 — `reference/nx-json.mdoc` "Task options" table lists deprecated-runner-only properties as root `nx.json` properties (**new**)
**File:** `astro-docs/src/content/docs/reference/nx-json.mdoc` (lines 188–201, "Task options" section)
**Category:** mismatched-feature
**Issue:** The section header says: "The following properties affect the way Nx runs tasks and can be set at the root of `nx.json`," followed by a table listing `parallel`, `captureStderr`, `skipNxCache`, `cacheDirectory`, `encryptionKey`, `selectivelyHashTsConfig`. Verified directly against `packages/nx/schemas/nx-schema.json` and `packages/nx/src/config/nx-json.ts`: only **`parallel`** and **`cacheDirectory`** are actually root properties. `captureStderr`, `skipNxCache`, `encryptionKey`, and `selectivelyHashTsConfig` only exist nested under `tasksRunnerOptions.<name>.options` — the deprecated custom-task-runner config block (`tasksRunnerOptions` itself carries a `@deprecated` JSDoc tag: "Custom task runners will be replaced by a new API starting with Nx 21"). A reader following this table and putting `captureStderr` at the root of `nx.json` today would have it silently do nothing.
**Excerpt:** `The following properties affect the way Nx runs tasks and can be set at the root of nx.json`
**Suggested fix:** split the table into "root properties" (`parallel`, `cacheDirectory`) and a clearly-marked "legacy `tasksRunnerOptions.*.options` properties (deprecated)" group, or drop the deprecated ones from this page entirely and point to `reference/deprecated/custom-tasks-runner`.

---

### C-5 — `reference/environment-variables.mdoc` is missing `NX_MULTI_MAJOR_MODE` (**new**)
**File:** `astro-docs/src/content/docs/reference/environment-variables.mdoc`
**Category:** mismatched-feature
**Issue:** `NX_MULTI_MAJOR_MODE` is a real, current env var — it's referenced from `nx-json.mdoc` itself ("The `NX_MULTI_MAJOR_MODE` environment variable takes precedence over this value," line 1002), from the `nx migrate` CLI help text (`packages/nx/src/command-line/migrate/command-object.ts:163`), and consumed in `packages/nx/src/command-line/migrate/migrate-config.ts`. It does not appear anywhere in the canonical `environment-variables.mdoc` reference table, which is where a user would normally look it up.
**Suggested fix:** add a row for `NX_MULTI_MAJOR_MODE` (`direct` | `gradual`) to the migrate-related section of the env-vars table.

---

### C-6 — `reference/nx-json.mdoc` omits 9 current root properties entirely (**new**)
**File:** `astro-docs/src/content/docs/reference/nx-json.mdoc`
**Category:** mismatched-feature
**Issue:** Grepped the whole page for each root property defined (and not marked `@deprecated`) in `packages/nx/src/config/nx-json.ts`. Sibling properties like `defaultBase`, `nxCloudId`, and `nxCloudUrl` are documented elsewhere on the page (lines 209, 1029–1044), but the following are **not mentioned anywhere** on the page: `workspaceLayout`, `cli` (`packageManager`/`defaultProjectName`), `defaultProject`, `nxCloudAccessToken`, `nxCloudEncryptionKey`, `useDaemonProcess`, `useInferencePlugins`, `neverConnectToCloud`, `installation`. This is related to, but distinct from, still-open backlog item #22 ("`nx-daemon.mdoc` says `useDaemonProcess` lives in runner options, not top-level") — that's a different file giving actively wrong info about one of these properties; this finding is that the canonical `nx-json.mdoc` reference doesn't document any of these 9 at all.
**Suggested fix:** add these to the appropriate sections of `nx-json.mdoc` (or confirm with a docs owner whether any are intentionally undocumented, e.g. as legacy/internal-only).

---

## Needs Input

### NI-1 — `kb/createnodes-compatibility.mdoc`: "Future deprecation timeline" section is describing the present (new this cycle)
**File:** `astro-docs/src/content/docs/kb/createnodes-compatibility.mdoc` (~lines 165–171)
Section header "## Future deprecation timeline" lists "**Nx 23**: The `createNodesV2` export will be marked as deprecated in TypeScript types" as a future milestone. Current major is already 23.x (live-verified above), and the compatibility table earlier on the *same page* (line 21) already correctly shows `23.x+` as current, with `createNodesV2` as "a deprecated alias." The rename has already shipped as an automated migration in `23.0.0` for nearly every first-party plugin (`packages/*/src/migrations/update-23-0-0/migrate-create-nodes-v2-to-create-nodes.md`). Only this section's framing is behind. Docs-team call on rewording to "as of Nx 23" and/or adding a forward-looking Nx 24+ line.

### NI-2 — `kb/createnodes-compatibility.mdoc`: plugin-support lookup table stops at "Nx 22+" (new this cycle)
**File:** same page, plugin-author lookup table (~line 29)
Columns run "Nx 17-19.1 | Nx 19.2-20 | Nx 21-21.x | Nx 22+" — no explicit Nx 23 column, even though the page's other table (line 21) already has a distinct `23.x+` row with different behavior (createNodes preferred over createNodesV2). A plugin author checking Nx 23 support has to infer it falls under "22+." Possibly an intentional simplification since support status is unchanged between 22 and 23, but reads as behind current major at a glance — confirm with docs owner.

### NI-3 — `kb/angular-nx-version-matrix.mdoc`: very long historical compatibility table (carried forward from 07-10 observation, still just a judgment call)
Table goes back to Angular 8; current rows at the top are accurate and not flagged as wrong, just long. Not a firm finding, restating for visibility in case the docs team wants to trim old rows on a future pass.

### NI-4 — Schema-level drift noticed incidentally, not a docs bug (new this cycle, flag for engineering not Docs)
`packages/nx/schemas/nx-schema.json`'s `NxReleaseVersionConfiguration.updateDependents` still declares `"default": "auto"` in the JSON Schema, but the actual runtime default is `'always'` (`packages/nx/src/command-line/release/utils/release-graph.ts:239-242`, confirmed by `release-version.spec.ts`). `nx-json.mdoc` itself already correctly documents the default as `"always"` (see its Nx 22 changelog note) — so **the doc is right and the JSON Schema's default annotation is what's stale**, which could mislead IDE autocomplete users. Not a Docs-team issue; noting for whoever owns `packages/nx/schemas/nx-schema.json` to fix the annotation, not filing a Linear issue against Docs for it.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**, assignee **Linear agent if available, else unassigned**. Items 1–27 carried forward unchanged from the [2026-07-10 audit](./nx-astro-docs-staleness-2026-07-10.md) (all still open — items 8, 10, 16 re-verified with sharper evidence this cycle, see C-1/C-2/C-3 above; consider updating item 10's description to say "wrong removal version (Nx 21, not Nx 20)" rather than just "future tense"). Items 28–30 are new this cycle.

| # | Title | Severity | Files |
|---|---|---|---|
| 1 | Fix compatibility tables: Nx version labeled as (current) incorrectly in node/nest/typescript introductions | High | 3 files |
| 2 | Remove/gate version-ahead content in consumer-and-provider.mdoc and migrating-from-nx-vite.mdoc | High | 2 files |
| 3 | Fix Angular Rspack getting-started: workspace-creation version in sample output | High | 1 file |
| 4 | Fix compose-executors.mdoc: use "executor" not "builder", use cypress.config.ts not cypress.json | High | 1 file |
| 5 | Fix migration-generators.mdoc: remove non-existent --project flag from example | High | 1 file |
| 6 | Fix GitHub Actions versions: nonexistent action majors (self-healing-ci, use-bun) | High | 2 files |
| 7 | Archive or fix publish-rust-crates.mdoc: guide is broken (useLegacyVersioning removed, unfulfilled version promise) | High | 1 file |
| 8 | Update terminal-ui.mdoc: remove stale Windows TUI "currently working on" notice (re-verified via C-2 this cycle — confirmed no win32 gate exists in source) | High | 1 file |
| 9 | Add Node 20 EOL notices to Nx Cloud launch templates and examples | High | 2 files |
| 10 | Update reference/Deprecated files: fix wrong removal version for Nx 20/21 milestones (re-verified via C-1 this cycle — v1-nx-plugin-api.mdoc says "Nx 20" but source + createnodes-compatibility.mdoc's own table confirm removal landed in Nx 21) | High | 3 files |
| 11 | Update version-ahead deprecation callouts across build tools and framework guides | Medium | 5 files |
| 12 | Update GitHub Actions versions to current majors across CI guides | Medium | 5+ files |
| 13 | Replace deprecated @storybook/testing-library and @storybook/jest with @storybook/test | Medium | 3 files |
| 14 | Fix Storybook angular-configuring-styles: remove webpack5 builder and React-specific options | Medium | 1 file |
| 15 | Fix Storybook best-practices: update stale Storybook URLs and old blog link | Medium | 1 file |
| 16 | Update bundling-node-projects.mdoc: bump EOL `target: 'node18'` esbuild/Rollup target (re-verified via C-3 this cycle — Node 20 also now EOL as of Apr 2026, recommend node22/node24) | Medium | 1 file |
| 17 | Fix setup-incremental-builds-angular.mdoc: @angular/build:browser is not a real executor | Medium | 1 file |
| 18 | Fix use-environment-variables-in-angular.mdoc: add deprecation note for @angular-devkit/build-angular:browser | Medium | 1 file |
| 19 | Fix manage-library-versions-with-module-federation.mdoc: import from @nx/module-federation not @nx/webpack | Medium | 1 file |
| 20 | Update module-federation-and-nx.mdoc: remove "As of Nx 19.5" framing | Medium | 1 file |
| 21 | Fix react-compiler.mdoc: React Compiler is no longer experimental in React 19 | Medium | 1 file |
| 22 | Fix nx-daemon.mdoc: useDaemonProcess is top-level in nx.json, not in runners options | Medium | 1 file |
| 23 | Fix Nx Cloud config.mdoc: update stale version-tab labels | Medium | 1 file |
| 24 | Fix access-tokens.mdoc: remove "authentication is changing" stale aside | Medium | 1 file |
| 25 | Fix Storybook guide URLs: update old framework-prefixed doc paths | Low | 6 files |
| 26 | Clean up low-value version qualifiers: old "since version X" notes in current docs | Low | 8+ files |
| 27 | Fix react/introduction.mdoc: `--bundler` option list conflates application vs. library enums, missing `rsbuild`, wrongly includes `rollup` for applications | Medium | 1 file |
| **28** | **Fix nx-json.mdoc "Task options" table: captureStderr/skipNxCache/encryptionKey/selectivelyHashTsConfig documented as root properties but only valid nested under deprecated tasksRunnerOptions.\*.options** | **High** | **1 file** |
| **29** | **Document 9 missing current root nx.json properties: workspaceLayout, cli, defaultProject, nxCloudAccessToken, nxCloudEncryptionKey, useDaemonProcess, useInferencePlugins, neverConnectToCloud, installation** | **Medium** | **1 file** |
| **30** | **Add missing NX_MULTI_MAJOR_MODE row to environment-variables.mdoc reference table** | **Low** | **1 file** |

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 08-03) where Linear issue creation could not be completed programmatically, and the failure symptom has now changed for the **second time**:
- 06-17: "SSE transport removed"
- 07-10: `ListConnectors` showed `enabledInChat: true` but `ToolSearch` returned zero Linear tools for any query
- **08-03 (this cycle): `ListConnectors` now reports Linear as `connected: true` at the org level but `enabledInChat: false`** — a step further back than 07-10's symptom. `ToolSearch` confirms no Linear tools are loaded.

Three different symptoms across seven attempts, on a connector that shows as authenticated/connected at the org level every time, strongly suggests this is a per-session/per-chat toggle problem rather than an auth problem — worth checking whether Linear is being enabled for the chat/session this scheduled routine runs in, not just connected at the org level. Recommend a human check the routine's session connector settings directly rather than retrying again next cycle.

## Recurring Checks to Run

(unchanged from prior audits — see top of this file's README for the checklist)
