# Nx Astro Docs Staleness Audit — 2026-07-10

**Scope note:** unlike the exhaustive line-by-line sweeps on 2026-06-11 through 2026-06-29, this pass was a **targeted 3-agent audit** scoped to exactly the three staleness smells requested this cycle: (1) old Nx major version mentions, (2) old Node/npm/framework version mentions, (3) documented CLI/generator options that no longer match source. It re-verified a sample of previously-flagged issues (still unfixed) and surfaced one new finding. It is **not** a full re-sweep of all 503 `.mdoc` files — treat the [2026-06-29 audit](./nx-astro-docs-staleness-2026-06-29.md)'s backlog as still the authoritative full list until another exhaustive pass runs.

Current Nx: **23.1.0-beta.7** (verified live from root `package.json` "nx" devDependency and `nx.json`, per this file's own verification rules — training data was not used). Node current LTS: **24.x** (Active), **22.x** (Maintenance); Node 20 EOL April 2026, Node 18 long EOL. React current: **19.x**. These matched what the docs already state in `technologies/node/introduction.mdoc` — no drift found on that front this cycle.

**Linear MCP unavailable again** (6th consecutive audit cycle) — see note at the bottom. All issues below are queued for manual creation, merged into the running backlog from prior audits.

---

## Summary

| Category | Confirmed (new or re-verified) | Needs Input |
|---|---|---|
| Old Nx version reference | 2 (both re-verified, previously known: H-13/M-19 from 06-29 audit) | 4 |
| Old Node/npm/framework version | 0 new | 1 |
| Mismatched CLI/feature vs. source | 1 (**new**) | 3 |
| **Total** | **3** | **8** |

---

## Confirmed Findings

### C-1 — `reference/Deprecated/v1-nx-plugin-api.mdoc` still uses future tense for Nx 20 (re-verified, = prior H-13)
**File:** `astro-docs/src/content/docs/reference/Deprecated/v1-nx-plugin-api.mdoc` (line 11)
**Category:** old-nx-version
**Issue:** "This API has been superceded by the v2 API and **will be removed in Nx 20**. If targeting Nx version 16.7 or higher, please use the v2 API instead." Current Nx is 23.x — Nx 20 shipped and passed several majors ago, so the removal has already happened; future tense is factually stale. Still unfixed since the 06-29 audit flagged this as H-13.
**Excerpt:** `will be removed in Nx 20`

---

### C-2 — `guides/Nx Cloud/access-tokens.mdoc` still frames a completed transition as "changing" (re-verified, = prior M-19)
**File:** `astro-docs/src/content/docs/guides/Nx Cloud/access-tokens.mdoc` (lines 276–277)
**Category:** old-nx-version
**Issue:** Aside titled "Nx Cloud authentication is changing": "From Nx 19.7 new workspaces are connected to Nx Cloud with a property called `nxCloudId` instead...". Nx 19.7 is 4+ majors behind current Nx 23 — this has long been the standard, not an in-flight change. The present-progressive title is misleading. Still unfixed since the 06-29 audit flagged this as M-19.
**Excerpt:** `Nx Cloud authentication is changing`

---

### C-3 — `technologies/react/introduction.mdoc` conflates application and library `--bundler` enums (**new finding**)
**File:** `astro-docs/src/content/docs/technologies/react/introduction.mdoc` (lines 79–86, "Choose a Bundler" section)
**Category:** mismatched-feature
**Issue:** Text says "The `--bundler` option selects the build tool for your application **or buildable library**" and then lists one combined set of choices: Vite, Webpack, Rspack, Rollup. The actual schemas diverge:
- `packages/react/src/generators/application/schema.json`: `"bundler": { "enum": ["vite", "rsbuild", "rspack", "webpack"] }` — no `rollup`, but does have `rsbuild` (missing from the doc).
- `packages/react/src/generators/library/schema.json`: `"bundler": { "enum": ["none", "vite", "rollup"] }` — no `rspack`/`webpack`/`rsbuild`.

A reader following the doc's list for an application and picking "Rollup" would pass an invalid enum value to `@nx/react:app`. Conversely, `rsbuild` (valid for apps) is missing entirely.
**Excerpt:** `The --bundler option selects the build tool for your application or buildable library... Vite / Webpack / Rspack / Rollup`
**Suggested fix:** split into two separate lists (Application: Vite, Rsbuild, Rspack, Webpack; Library: Vite, Rollup, or none).

---

## Needs Input

### NI-1 — `technologies/module-federation/concepts/module-federation-and-nx.mdoc`: "As of Nx 19.5" framing (re-verified, = prior M-13)
**File:** same as prior audit. Still says "As of Nx 19.5, our Module Federation support is provided by `@module-federation/enhanced`." Statement remains factually accurate (not wrong), just a stale-feeling version anchor 4 majors later. Docs team judgment call on whether to strip the version number.

### NI-2 — Scattered "as of Nx X.Y" attribution footnotes in current (non-deprecated) reference pages
**Files:** `reference/project-configuration.mdoc` (~line 233, "Nx 19.5.0+"), `guides/Tasks & Caching/self-hosted-caching.mdoc` (~line 53, "Nx 20.8+"), `extending-nx/task-running-lifecycle.mdoc` (~line 12, "since Nx 20.4+"), `technologies/typescript/introduction.mdoc` (~line 98, "as of Nx 20"). These overlap with prior audit's L-3, M-18, M-21. All accurate, none phrased as "new/latest," but numerous enough that it's worth a policy decision: prune version footnotes once a feature has been default for 3+ majors, or leave them for historical clarity?

### NI-3 — `guides/Tips-n-Tricks/include-all-packagejson.mdoc` and `reference/glossary.mdoc`: "As of Nx 15.0.11" / "Nx 15.3" (re-verified, = prior L-4, L-7)
Still present, still accurate, still very old anchors (Nx 15 is 8 majors back). Same policy question as NI-2.

### NI-4 — `reference/Deprecated/*` pages: present/future tense about Nx 20 milestones, beyond v1-nx-plugin-api.mdoc
Pages like `as-provided-vs-derived.mdoc` ("will be the only option in Nx 20", "will not be available in Nx 20") have the same tense problem as C-1 but are in a `sidebar: hidden: true` section. Since they're still crawlable/indexable, worth a decision on whether hidden-deprecated pages get a blanket "this describes a past transition" banner instead of per-page tense fixes.

### NI-5 — `reference/Nx Cloud/launch-template-examples.mdoc`: Node 21 used as the illustrative override example (re-verified, = prior H-12, still open)
Lines ~194–241, "Custom node version" section uses `node=21` / `node_version: '21'` / template key `node-21`. Node 21 was never LTS and has been EOL since mid-2024. Plausibly just an arbitrary placeholder (the surrounding image example correctly uses `ubuntu22.04-node24.14-v1`), but an odd, long-dead version number as the example is confusing. Confirm with docs owners whether to swap for a current LTS number.

### NI-6 — `reference/nx-mcp.mdoc` CLI flags can't be verified against source in this repo
Flags like `--transport`, `--port`, `--tools`, `--minimal`, `--disableTelemetry`, `--debugLogs` are documented, but `packages/nx/src/command-line/mcp/mcp.ts` shows `nx mcp` is a thin passthrough to the separately-published `nx-mcp` package (not in this repo). Can't confirm currency without that package's source.

### NI-7 — CI Features / Nx Cloud CLI flags reference the closed-source `nx-cloud` binary
`features/CI Features/self-healing-ci.mdoc`, `distribute-task-execution.mdoc`, `reference/nx-cloud-cli.mdoc` document flags (`--fix-tasks`, `--auto-apply-fixes`, `--with-env-vars`, `--stop-agents-after`, `--stop-agents-on-failure`, `--require-explicit-completion`) that `packages/nx/src/command-line/nx-cloud/start-ci-run/command-object.ts` confirms are just shelled out to the closed-source `nx-cloud` binary. Can't verify from this repo.

### NI-8 — `reference/environment-variables.mdoc`: several `NX_CLOUD_*`/`NX_AGENT_*` vars have zero references in this repo
Vars like `NX_RUN_GROUP`, `NX_WORKING_DIRECTORY`, `NX_NO_OUTPUT_TIMEOUT` aren't referenced anywhere in `.ts`/`.js`/`.rs` source outside the doc itself. The doc's own text says these are for Nx Cloud Agents/launch templates, so they likely live in the closed-source Cloud stack — can't confirm currency without access to it.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**. Items 1–26 carried forward unchanged from the [2026-06-29 audit](./nx-astro-docs-staleness-2026-06-29.md) (still unfixed, re-verified where sampled this cycle — see C-1/C-2 above). Item 27 is new this cycle.

| # | Title | Severity | Files |
|---|---|---|---|
| 1 | Fix compatibility tables: Nx version labeled as (current) incorrectly in node/nest/typescript introductions | High | 3 files |
| 2 | Remove/gate version-ahead content in consumer-and-provider.mdoc and migrating-from-nx-vite.mdoc | High | 2 files |
| 3 | Fix Angular Rspack getting-started: workspace-creation version in sample output | High | 1 file |
| 4 | Fix compose-executors.mdoc: use "executor" not "builder", use cypress.config.ts not cypress.json | High | 1 file |
| 5 | Fix migration-generators.mdoc: remove non-existent --project flag from example | High | 1 file |
| 6 | Fix GitHub Actions versions: nonexistent action majors (self-healing-ci, use-bun) | High | 2 files |
| 7 | Archive or fix publish-rust-crates.mdoc: guide is broken (useLegacyVersioning removed, unfulfilled version promise) | High | 1 file |
| 8 | Update terminal-ui.mdoc: remove stale Windows TUI "currently working on" notice | High | 1 file |
| 9 | Add Node 20 EOL notices to Nx Cloud launch templates and examples | High | 2 files |
| 10 | Update reference/Deprecated files: change future tense to past tense for Nx 20/21 milestones (still open — re-verified via C-1 this cycle) | High | 3 files |
| 11 | Update version-ahead deprecation callouts across build tools and framework guides | Medium | 5 files |
| 12 | Update GitHub Actions versions to current majors across CI guides | Medium | 5+ files |
| 13 | Replace deprecated @storybook/testing-library and @storybook/jest with @storybook/test | Medium | 3 files |
| 14 | Fix Storybook angular-configuring-styles: remove webpack5 builder and React-specific options | Medium | 1 file |
| 15 | Fix Storybook best-practices: update stale Storybook URLs and old blog link | Medium | 1 file |
| 16 | Update bundling-node-projects.mdoc: bump EOL `target: 'node18'` esbuild/Rollup target | Medium | 1 file |
| 17 | Fix setup-incremental-builds-angular.mdoc: @angular/build:browser is not a real executor | Medium | 1 file |
| 18 | Fix use-environment-variables-in-angular.mdoc: add deprecation note for @angular-devkit/build-angular:browser | Medium | 1 file |
| 19 | Fix manage-library-versions-with-module-federation.mdoc: import from @nx/module-federation not @nx/webpack | Medium | 1 file |
| 20 | Update module-federation-and-nx.mdoc: remove "As of Nx 19.5" framing (still open — re-verified via NI-1 this cycle) | Medium | 1 file |
| 21 | Fix react-compiler.mdoc: React Compiler is no longer experimental in React 19 | Medium | 1 file |
| 22 | Fix nx-daemon.mdoc: useDaemonProcess is top-level in nx.json, not in runners options | Medium | 1 file |
| 23 | Fix Nx Cloud config.mdoc: update stale version-tab labels | Medium | 1 file |
| 24 | Fix access-tokens.mdoc: remove "authentication is changing" stale aside (still open — re-verified via C-2 this cycle) | Medium | 1 file |
| 25 | Fix Storybook guide URLs: update old framework-prefixed doc paths | Low | 6 files |
| 26 | Clean up low-value version qualifiers: old "since version X" notes in current docs | Low | 8+ files |
| **27** | **Fix react/introduction.mdoc: `--bundler` option list conflates application vs. library enums, missing `rsbuild`, wrongly includes `rollup` for applications** | **Medium** | **1 file** |

---

## Linear MCP Status — Escalation

This is the **6th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10) where Linear issue creation could not be completed programmatically. This cycle's specific symptom differs slightly from prior ones ("SSE transport removed" was cited on 06-17): `ListConnectors` reports Linear as `enabledInChat: true`, but `ToolSearch` returns zero matching tools for any Linear-related query (`Linear`, `mcp__Linear`, `create_issue`, `triage`, etc.) — no Linear tools are exposed to this session at all, unlike GitHub/Slack/Notion/Google Calendar which are all reachable. Given this has now failed five times running with varying symptoms, this looks like a persistent connector/auth problem rather than a transient one — worth investigating directly in claude.ai connector settings rather than continuing to retry per-audit.

## Recurring Checks to Run

(unchanged from prior audits — see top of this file's README for the checklist)
