# Nx Astro Docs Staleness Audit — 2026-07-21

**Scope note:** targeted 3-agent audit scoped to the three staleness smells requested this cycle: (1) old Nx major version mentions, (2) old Node/npm/framework version mentions, (3) documented CLI/nx.json/generator options that no longer match source. Re-verified two previously-flagged issues (still unfixed) and surfaced **four new findings** this cycle — the best haul of new confirmed issues since 2026-06-29. Not a full re-sweep of all 506 `.mdoc` files — treat the [2026-06-29 audit](./nx-astro-docs-staleness-2026-06-29.md)'s backlog as still the authoritative full list until another exhaustive pass runs.

Current Nx: **23.2.0-beta.1** (verified live from git log `chore(repo): migrate to nx 23.2.0-beta.1`, cross-checked against `astro-docs/src/content/docs/technologies/typescript/introduction.mdoc` and `technologies/angular/introduction.mdoc`, both of which correctly say "23.x (current)"). Node current: Node 26 (Current track, LTS Oct 2026), Node 24/22 (LTS) — matches `technologies/node/introduction.mdoc`'s compatibility table, which is accurate and was **not** flagged this cycle. React, Angular, TypeScript, ESLint, Vite, Webpack, Jest/Vitest, Cypress, Playwright, Storybook, Next.js, Remix, NestJS, Express, Java/Gradle/Maven requirement tables were all checked and found current — no drift.

**Linear MCP unavailable again (7th consecutive audit cycle)** — see escalation note at the bottom. This cycle has a *new, more specific* diagnosis: `ListConnectors` shows Linear as `installState: "connected"` (i.e., authenticated at the org level) but **`enabledInChat: false`** — the connector is simply toggled off for this chat session. This is a cleaner signal than prior cycles' symptoms ("SSE transport removed", "zero tools despite enabledInChat: true") and points at a fixable per-session toggle rather than a broken integration. All issues below are queued for manual creation, merged into the running backlog.

---

## Summary

| Category | Confirmed (new or re-verified) | Needs Input |
|---|---|---|
| Old Nx version reference | 2 (1 new: releases.mdoc table; 1 re-verified: terminal-ui.mdoc) | 1 |
| Old Node/npm/framework version | 1 re-verified (bundling-node-projects.mdoc, 5th cycle open) | 1 (new: yarn-pnp.mdoc) |
| Mismatched CLI/feature vs. source | 3 new (nx-json.mdoc task options, nx-json.mdoc TUI gap, unknown-local-cache.mdoc contradiction) | 2 (new) |
| **Total** | **6** | **4** |

---

## Confirmed Findings

### C-1 — `reference/releases.mdoc` "Supported versions" table doesn't reflect Nx 23 (**new finding**)
**File:** `astro-docs/src/content/docs/reference/releases.mdoc` (lines 36-38, "Supported versions" table)
**Category:** old-nx-version
**Issue:** The table reads:
```
|   v22   |   Current    |  2025-10-22  |
|   v21   |     LTS      |  2025-05-05  |
|   v20   |     LTS      |  2024-10-06  |
```
Current Nx is 23.2.0-beta.1 — v23 should be "Current" and v22 should have moved to LTS. Worse, per the page's own stated policy ("18 total months of support from when it is first released"), v20 (released 2024-10-06) should have fallen out of support around 2026-04 and shouldn't still be listed as LTS by 2026-07-21. This is the single highest-visibility page for "what Nx version is current" and it's wrong on both the current-version label and the retention window. Corroborated independently by two of the three research agents run this cycle.
**Excerpt:** `v22 | Current | 2025-10-22`
**Suggested fix:** add a v23 row marked Current, move v22 to LTS, drop v20 (or explicitly note it as newly out-of-support with an end date).

---

### C-2 — `reference/nx-json.mdoc` "Task options" table wrongly claims 4 properties live at the nx.json root (**new finding**)
**File:** `astro-docs/src/content/docs/reference/nx-json.mdoc` (lines 190-201)
**Category:** mismatched-feature
**Issue:** Line 192 states "The following properties affect the way Nx runs tasks and can be set **at the root of `nx.json`**," and the table below it includes `captureStderr`, `skipNxCache`, `encryptionKey`, and `selectivelyHashTsConfig` alongside legitimately root-level properties (`parallel`, `cacheDirectory`).
- `packages/nx/schemas/nx-schema.json` (lines 831, 850, 854) places `captureStderr`, `skipNxCache`, and `encryptionKey` under `tasksRunnerOptions.<name>.options`, not the document root.
- `packages/nx/src/tasks-runner/run-command.ts` (`getRunnerOptions()`, ~lines 1280-1324) only copies `parallel`, `cacheDirectory`, and `useDaemonProcess` from the nx.json root — confirming the other four are not read from root at all.
- `selectivelyHashTsConfig` isn't in `nx-schema.json` as a root property either; it's consumed via the runner options object in `packages/nx/src/hasher/task-hasher.ts:197`.
- The root-level encryption property is actually `nxCloudEncryptionKey` (see `run-command.ts:1307-1308`), a *different* name from the `encryptionKey` shown in the table.

**Impact:** a reader who sets `"skipNxCache": true` or `"encryptionKey": "..."` at the nx.json root (following this table) has it silently ignored — it must be nested under `tasksRunnerOptions.default.options`, or (for the encryption key specifically) named `nxCloudEncryptionKey` at the root instead.
**Excerpt:** `The following properties affect the way Nx runs tasks and can be set at the root of nx.json`
**Suggested fix:** split the table into "root-level" (`parallel`, `cacheDirectory`) vs. "per-task-runner options" (`captureStderr`, `skipNxCache`, `encryptionKey`/`nxCloudEncryptionKey`, `selectivelyHashTsConfig`), each with a correct location example.

---

### C-3 — `reference/nx-json.mdoc` TUI section is missing the `suppressHints` property (**new finding**)
**File:** `astro-docs/src/content/docs/reference/nx-json.mdoc` (~lines 1082-1097, "TUI" section)
**Category:** mismatched-feature
**Issue:** The doc documents only `tui.enabled` and `tui.autoExit`. `packages/nx/src/config/nx-json.ts` (lines 1019-1037, `NxJsonConfiguration.tui`) and `packages/nx/schemas/nx-schema.json` (lines 111-115) both also define `tui.suppressHints` (boolean, default `false`, "Whether to suppress hint popups that provide guidance for unhandled keys"). No page in astro-docs mentions it.
**Excerpt:** (absence) — only `enabled`/`autoExit` shown at nx-json.mdoc:88 and :1094.
**Suggested fix:** add a row for `suppressHints` to the TUI options table.

---

### C-4 — `guides/Tasks & Caching/terminal-ui.mdoc` Windows caveat still stale (re-verified, = prior backlog item #8)
**File:** `astro-docs/src/content/docs/guides/Tasks & Caching/terminal-ui.mdoc` (line 14)
**Category:** old-nx-version
**Issue:** "The initial Nx 21 release disables the Terminal UI on Windows. We are currently working on Windows support, so stay tuned." Two of today's three research agents independently flagged this again. Still unfixed since first flagged in the 2026-06-29 audit (queued as backlog item #8).
**Excerpt:** `We are currently working on Windows support, so stay tuned.`

---

### C-5 — `troubleshooting/unknown-local-cache.mdoc` documents a workaround that its own sibling page says doesn't work (**new finding**)
**File:** `astro-docs/src/content/docs/troubleshooting/unknown-local-cache.mdoc` (line 51)
**Category:** mismatched-feature
**Issue:** "When using the legacy file system cache (deprecated in Nx 20), you can prefix any Nx command with `NX_REJECT_UNKNOWN_LOCAL_CACHE=0` to ignore the errors..." But `reference/Deprecated/legacy-cache.mdoc` states that `NX_REJECT_UNKNOWN_LOCAL_CACHE` "does not work with the new database cache." Since the legacy cache was removed by default in Nx 21 and the workspace is now on 23.x, virtually every reader landing on this troubleshooting page today is on the new database cache, so the documented fix is presented as currently functional when it's actually a dead end for the current cache system.
**Excerpt:** `NX_REJECT_UNKNOWN_LOCAL_CACHE=0 to ignore the errors`
**Suggested fix:** update the troubleshooting page to point at the database-cache-appropriate remedy (or clarify the env var only applies if a reader has explicitly opted back into the legacy cache).

---

### C-6 — `technologies/node/Guides/bundling-node-projects.mdoc` still targets EOL Node 18 (re-verified, 5th consecutive cycle open, = backlog item #16)
**File:** `astro-docs/src/content/docs/technologies/node/Guides/bundling-node-projects.mdoc` (line 113)
**Category:** old-node-version
**Issue:** Vite bundling config example still uses `target: 'node18'`. First flagged 2026-06-11, confirmed every cycle since (06-11, 06-12, 06-29, 07-10, now 07-21). Independently re-confirmed by this cycle's framework/tooling-version agent.
**Excerpt:** `target: 'node18',`

---

## Needs Input

### NI-1 — `guides/Tips-n-Tricks/yarn-pnp.mdoc`: sample output shows Yarn 3.6.1, likely stale (**new**)
**File:** `astro-docs/src/content/docs/guides/Tips-n-Tricks/yarn-pnp.mdoc` (line 38)
**Issue:** Shown as the result of running `yarn set version stable`: `"packageManager": "yarn@3.6.1"`. Running that command today resolves to a Yarn 4.x release, not 3.6.1. Yarn 3 isn't dangerous/EOL the way Node 18 is, so this is lower severity than C-6, but the illustrated output no longer matches what a reader following the steps will actually see. Docs-team judgment call on whether to bump the example version or genericize it (e.g. `yarn@<version>`).

### NI-2 — `technologies/module-federation/concepts/nx-module-federation-technical-overview.mdoc:37`: stale "new feature" framing
**Issue:** "Continuous Tasks are a new feature in Nx 21." Factually accurate but reads oddly two majors later, especially next to the better-worded parallel sentence in `module-federation-and-nx.mdoc:115` ("With the introduction of Continuous Tasks in Nx 21..."). Same pattern as the already-tracked NI-1/NI-2/NI-3 "as of Nx X" footnote items from the 07-10 audit — folding this into that existing policy question (prune version footnotes after a feature has been default for 3+ majors?) rather than a new one-off fix.

### NI-3 — `reference/project-configuration.mdoc`: `dependsOn` docs don't mention the `options: 'ignore'|'forward'` field (**new**)
**Issue:** The doc documents `dependsOn[].params: 'ignore'|'forward'` (forwarding CLI params) but `TargetDependencyConfig` in `packages/nx/src/config/workspace-json-project-json.ts` (lines 201-204) also defines a separate `options?: 'ignore'|'forward'` field (forwarding task *options*, not CLI params). Not confirmed whether this is an intentional omission (maybe the field is legacy/unused) or a genuine gap — needs a source-control archaeology pass or a ping to whoever owns `TargetDependencyConfig` before filing as a straight doc fix.

### NI-4 — `nx.json` properties `installation` and `cli`/`defaultProjectName` may be undocumented anywhere in astro-docs (**new**)
**Issue:** `NxJsonConfiguration` in `packages/nx/src/config/nx-json.ts` defines `installation` and `cli`/`defaultProjectName`, and a grep across all of `astro-docs/src/content/docs` turned up no page documenting either. Other similarly "internal-feeling" properties (`workspaceLayout`, `neverConnectToCloud`, `useInferencePlugins`, `pluginsConfig`) *are* documented elsewhere, so this looks like it could be a genuine gap rather than an intentional omission — but needs a docs-team decision on whether these are meant to be user-facing before treating it as a bug.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**. Items 1–27 carried forward unchanged from prior audits (see [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) and [2026-07-10](./nx-astro-docs-staleness-2026-07-10.md) — items 8 and 16 re-verified again this cycle via C-4/C-6 above). Items 28–31 are new this cycle.

| # | Title | Severity | Files |
|---|---|---|---|
| 28 | Update reference/releases.mdoc: Supported-versions table still shows v22 as Current, doesn't list v23, retains out-of-window v20 as LTS | High | 1 file |
| 29 | Fix nx-json.mdoc Task options table: captureStderr/skipNxCache/encryptionKey/selectivelyHashTsConfig incorrectly documented as nx.json-root properties; belong under tasksRunnerOptions.<name>.options, and encryptionKey's actual root name is nxCloudEncryptionKey | High | 1 file |
| 30 | Fix troubleshooting/unknown-local-cache.mdoc: NX_REJECT_UNKNOWN_LOCAL_CACHE workaround contradicts reference/Deprecated/legacy-cache.mdoc, which says it doesn't work with the new database cache | Medium | 1 file |
| 31 | Add missing `tui.suppressHints` property to nx-json.mdoc TUI options table | Low | 1 file |

(Items 1–27 from prior cycles are unchanged; see the linked files above for their full text.)

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-21) where Linear issue creation could not be completed programmatically. Unlike prior cycles, this run has a precise, actionable diagnosis rather than an ambiguous one:

- `ListConnectors({keywords:["linear"]})` returns: `installState: "connected"`, `connected: true`, but **`enabledInChat: false`**.
- `ToolSearch` for any Linear-related query (`Linear issue create`, `linear ticket triage assign agent label`, `linear create issue`) surfaces zero Linear tools — only GitHub/TaskCreate/TaskList/etc.

This reads as: **the Linear connector is authenticated at the org level, but simply toggled off for this specific chat session** — a one-click fix in this chat's connector settings (enable Linear for this chat), not a broken integration or auth problem. This is a materially different (and more hopeful) diagnosis than prior cycles' "SSE transport removed" (06-17) or "tools not exposed despite enabledInChat: true" (07-10) — worth trying the toggle before assuming this needs deeper investigation.

**All 31 backlog issues (27 carried forward + 4 new this cycle) remain queued for manual creation** until either the connector is enabled for this chat or a future cycle runs with it already on.

## Recurring Checks to Run

(unchanged from prior audits — see the [stale-docs README](./README.md) for the full checklist)
