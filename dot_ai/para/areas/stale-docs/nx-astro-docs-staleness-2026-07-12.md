# Nx Astro Docs Staleness Audit — 2026-07-12

**Scope note:** targeted 3-agent audit scoped to exactly the three staleness smells requested this cycle: (1) old Nx major version mentions, (2) old Node/npm/framework version mentions, (3) documented CLI/config/generator options that no longer match source. This is the **second cycle in a row** using this targeted approach rather than a full line-by-line sweep of all `.mdoc` files (see [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) for the last exhaustive pass). Unlike 2026-07-10, this cycle's category-3 agent went deep — it read `packages/nx/src/config/nx-json.ts`, `packages/nx/src/tasks-runner/*`, `packages/nx/src/hasher/task-hasher.ts`, and `packages/react/src/utils/module-federation-deprecation.ts` directly, and turned up four solid, previously-undetected drift findings (see Confirmed Findings below) — the highest-value haul of any cycle so far.

**Live version verification (per this file's own rules — not training data):**
- `npm view nx version` → **23.0.2** (stable). Repo's own `packages/nx/migrations.json` shows active dev on `23.0.0-beta.x`/`23.1.0-beta.x` branches — consistent, current major is **23**.
- `npm view node dist-tags` → `latest: 26.5.0`, no `lts` tag published yet for 26.x. Cross-referenced with the 07-10 audit's finding (still holds): Node 24.x is Active LTS, 22.x is Maintenance LTS, **Node 20 is EOL** (April 2026, i.e. already passed), Node 18 long EOL.
- These match what `technologies/node/introduction.mdoc`'s compatibility table already states for current Nx — no drift on the baseline table itself.

---

## Summary

| Category | Confirmed (new) | Re-verified (already in backlog) | Needs Input (new) |
|---|---|---|---|
| Old Nx version reference | 1 | 4 | 1 |
| Old Node/npm/framework version | 0 | 2 | 0 |
| Mismatched CLI/feature vs. source | 4 | 1 | 3 |
| **Total** | **5** | **7** | **4** |

---

## Confirmed Findings (new this cycle)

### C-1 — `reference/nx-json.mdoc` "Task options" table documents four properties that are not valid root `nx.json` keys
**File:** `astro-docs/src/content/docs/reference/nx-json.mdoc` (lines 191–201)
**Category:** mismatched-feature
**Severity:** High
**Issue:** The table under "## Task options" says these "can be set at the root of `nx.json`": `captureStderr`, `skipNxCache`, `cacheDirectory`, `encryptionKey`, `selectivelyHashTsConfig`. Verified against `packages/nx/src/config/nx-json.ts` (full `NxJsonConfiguration` interface) and `packages/nx/schemas/nx-schema.json` (the doc's own linked schema) — only `cacheDirectory` is actually a root property.
- `encryptionKey` doesn't exist as a root key at all; the real mechanism is `nxCloudEncryptionKey`, which `packages/nx/src/tasks-runner/run-command.ts:1275-1318` maps internally to `result.encryptionKey` — an implementation detail, not something a user sets under that name at the root.
- `captureStderr` and `selectivelyHashTsConfig` are only ever read from the **deprecated** `tasksRunnerOptions.<runner>.options` bag (`nx-json.ts:876`), not the root.
- `skipNxCache` isn't read from `nx.json` anywhere — only from CLI args/env.
- A user following this table to set `encryptionKey: "..."` at nx.json's root would have it silently do nothing.
**Suggested fix:** rewrite the table to list only true root properties (`parallel`, `cacheDirectory`), and separately document `nxCloudEncryptionKey`, plus either remove `captureStderr`/`selectivelyHashTsConfig` or clearly mark them as deprecated/legacy `tasksRunnerOptions` keys.

### C-2 — Module Federation React guides document three generators deprecated for removal in the very next major (Nx v24), with zero deprecation notice
**Files:**
- `astro-docs/src/content/docs/technologies/module-federation/Guides/create-a-host.mdoc`
- `astro-docs/src/content/docs/technologies/module-federation/Guides/create-a-remote.mdoc`
- `astro-docs/src/content/docs/technologies/module-federation/Guides/federate-a-module.mdoc`
**Category:** mismatched-feature
**Severity:** High
**Issue:** All three present `@nx/react:host`, `@nx/react:remote`, and `@nx/react:federate-module` as the current recommended generators — confirmed zero occurrences of "deprecat" (case-insensitive) in any of the three files. Source (`packages/react/src/utils/module-federation-deprecation.ts:8-12`) hard-codes: *"The `@nx/react:host` generator is deprecated and will be removed in Nx v24. Use `nx g @nx/react:consumer`..."* (same pattern for `:remote` → `@nx/react:provider`, `:federate-module` → `@nx/react:provider`). Current Nx is 23.x, so v24 removal is one major away — this is not a stale historical footnote, it's an active gap that will actively mislead readers into building on generators about to disappear. The replacement generators already have their own doc page (`module-federation/consumer-and-provider.mdoc`), which correctly mentions the deprecation — the three older guides just weren't updated when it shipped.
**Suggested fix:** add a deprecation `{% aside %}` to all three pages pointing at `consumer-and-provider.mdoc`, matching the pattern already used elsewhere in the deprecated-executor call-outs (e.g. `@nx/webpack:webpack`, `@nx/rollup:rollup`).

### C-3 — `reference/inputs.mdoc` misstates the default tsconfig-hashing behavior
**File:** `astro-docs/src/content/docs/reference/inputs.mdoc` (lines 218–220)
**Category:** mismatched-feature
**Severity:** Medium-High
**Issue:** Doc states: *"When a root `tsconfig.json` or `tsconfig.base.json` is present, Nx will **always** consider parts of the file which apply to the project of a task being run... This allows Nx to not invalidate every single task when a path mapping is added or removed."* This describes the *selective* hashing behavior — but per `packages/nx/src/hasher/task-hasher.ts:197` and `packages/nx/src/plugins/js/hasher/hasher.ts:31-44`, selective hashing only happens when `selectivelyHashTsConfig` is explicitly set to `true`. The actual default (`false`) hashes the **entire** `tsConfigJson` via `JSON.stringify` for every project — meaning by default, adding/removing an unrelated path mapping in the base tsconfig *does* invalidate every task's cache, the opposite of what the doc says. (Note: this is the same `selectivelyHashTsConfig` flag incorrectly listed as a root nx.json property in C-1 — the two findings are related; fixing C-1's table should link back to this page.)
**Suggested fix:** clarify that full-file hashing is the default, and selective/project-scoped hashing is opt-in via `selectivelyHashTsConfig: true` (once C-1 also documents where that flag actually lives).

### C-4 — `concepts/how-caching-works.mdoc` states the wrong default `outputs` fallback paths
**File:** `astro-docs/src/content/docs/concepts/how-caching-works.mdoc` (line 126)
**Category:** mismatched-feature
**Severity:** Medium
**Issue:** Doc says: *"If neither is defined, Nx defaults to caching `dist` and `build` at the root of the repository."* Source (`packages/nx/src/tasks-runner/utils.ts:349-407`, `getOutputsForTargetAndConfiguration`) shows the actual fallback (for `build`/`prepare` targets only) is project-scoped, not root-scoped: `dist/${projectRoot}`, `${projectRoot}/dist`, `${projectRoot}/build`, and `${projectRoot}/public` — four candidate paths, not two, and none of them are simple root-level folders. A reader relying on the doc's description to reason about why a task's build artifacts weren't cached (e.g. a root-level `dist/` that never gets populated because their project lives in `apps/foo`) would be debugging against a wrong mental model.
**Suggested fix:** replace with the actual fallback list and note it's scoped to `build`/`prepare` targets specifically.

### C-5 — `guides/Nx Cloud/personal-access-tokens.mdoc` still anchors current default behavior to "Nx 19.7" (new file, same pattern as known access-tokens.mdoc issue)
**File:** `astro-docs/src/content/docs/guides/Nx Cloud/personal-access-tokens.mdoc` (line 11)
**Category:** old-nx-version
**Severity:** Low
**Issue:** *"From Nx 19.7 repositories are connected to Nx Cloud via a property in `nx.json` called `nxCloudId`."* Same stale-anchor pattern already tracked for `access-tokens.mdoc` (queued backlog item #24) and `module-federation-and-nx.mdoc` (#20), but this is a **different file** not previously listed in the backlog — it was missed in prior cycles because earlier scans apparently only sampled `access-tokens.mdoc` from this directory, not its sibling `personal-access-tokens.mdoc`.
**Suggested fix:** same as #24 — drop the version anchor, state as current behavior, or fold into the general "prune stale version footnotes" cleanup (#26).

---

## Re-verified (already tracked in the running backlog, unchanged status)

- `reference/Deprecated/v1-nx-plugin-api.mdoc` future tense re: Nx 20 removal — still open (backlog #10 / prior C-1).
- `guides/Nx Cloud/access-tokens.mdoc` "authentication is changing" framing — still open (backlog #24 / prior C-2).
- `technologies/module-federation/concepts/module-federation-and-nx.mdoc` "As of Nx 19.5" — still open (backlog #20 / prior NI-1).
- `technologies/node/Guides/bundling-node-projects.mdoc` EOL `target: 'node18'` — still open (backlog #16).
- `reference/Nx Cloud/launch-template-examples.mdoc` Node 21 illustrative example — still open (backlog NI-5/#H-12).
- `concepts/nx-daemon.mdoc:40` "set `useDaemonProcess: false` in the runners options" — still open (backlog #22). Re-confirmed this cycle with a direct source read: `packages/nx/src/config/nx-json.ts:982` has it as a top-level property, and `packages/nx/src/migrations/update-20-0-0/move-use-daemon-process.ts` is the migration that moved it out of `tasksRunnerOptions.default.options` — so this doc has been wrong since Nx 20.0.0, three majors ago.
- Scattered "as of Nx X.Y" footnotes (`project-configuration.mdoc`, `self-hosted-caching.mdoc`, `task-running-lifecycle.mdoc`, `typescript/introduction.mdoc`, `ci-deployment.mdoc`, `deploying-node-projects.mdoc`) — unchanged, still part of the pruning-policy question in NI-2/#26.

## Needs Input

### NI-1 — `extending-nx/createnodes-compatibility.mdoc`: compatibility table's newest bucket is "Nx 22+", no explicit Nx 23 column
**File:** `astro-docs/src/content/docs/extending-nx/createnodes-compatibility.mdoc` (line 27, table header: `Nx 17-19.1 | Nx 19.2-20 | Nx 21-21.x | Nx 22+`)
The prose elsewhere on the same page *does* call out Nx 23 specifically (line 168: `createNodesV2` export marked deprecated in TS types as of Nx 23), so this isn't pure neglect — but the table itself hasn't been extended with a dedicated Nx 23 row/column. Judgment call for docs team: is "Nx 22+" still accurate as a bucket (i.e., does Nx 23 behave identically to 22 for this table's purposes), or does it need its own column given the page already flags an Nx-23-specific behavior change in prose?

### NI-2 — `reference/inputs.mdoc`: undocumented `json` input type
Source (`packages/nx/src/native/index.d.ts:526-530`) defines a `{ json: string, fields?, excludeFields? }` input type that isn't mentioned anywhere on the page. This is an omission rather than incorrect content — worth adding, lower priority than C-1/C-3 which actively mislead.

### NI-3 — `technologies/module-federation/Guides/create-a-remote.mdoc`: example omits the schema's only required field
The example command `nx g @nx/react:remote --name=myremote` doesn't pass `--directory`, which per the generator's schema is the sole required option. It's plausible devkit's `determineProjectNameAndRootOptions` fills in a sane default from `--name` alone, but this wasn't confirmed end-to-end (would need to actually run the generator). Flagging for a docs-team member with a local repro to verify rather than asserting it's broken.

### NI-4 — Carried forward, unchanged: `reference/nx-mcp.mdoc` and Nx Cloud CLI flag pages can't be verified from this repo
`reference/nx-mcp.mdoc` flags depend on the separately-published `nx-mcp` package; `features/CI Features/self-healing-ci.mdoc`, `distribute-task-execution.mdoc`, `reference/nx-cloud-cli.mdoc`, and `reference/environment-variables.mdoc`'s `NX_CLOUD_*`/`NX_AGENT_*` vars depend on the closed-source `nx-cloud` binary/Cloud stack. Same limitation noted in the 07-10 audit (NI-6/NI-7/NI-8) — no new information this cycle.

---

## Linear Issues to Create (queued — MCP unavailable again, see escalation below)

Running backlog, items 1–27 carried forward unchanged from prior audits (see [2026-07-10](./nx-astro-docs-staleness-2026-07-10.md) for the full list through #27). New items this cycle:

| # | Title | Severity | Files |
|---|---|---|---|
| 28 | Fix reference/nx-json.mdoc "Task options" table: captureStderr/skipNxCache/encryptionKey/selectivelyHashTsConfig are not valid root nx.json properties | **High** | 1 file |
| 29 | Add deprecation notices to Module Federation React guides (create-a-host, create-a-remote, federate-a-module) — generators removed in Nx v24 | **High** | 3 files |
| 30 | Fix reference/inputs.mdoc: default tsconfig hashing is full-file, not selective — doc has it backwards | Medium-High | 1 file |
| 31 | Fix concepts/how-caching-works.mdoc: default output fallback paths are project-scoped (dist/{root}, {root}/dist, {root}/build, {root}/public), not root-level dist/build | Medium | 1 file |
| 32 | Fix guides/Nx Cloud/personal-access-tokens.mdoc: remove stale "From Nx 19.7" anchor (sibling issue to #24) | Low | 1 file |

**Recommended priority order for the Docs team if working through the backlog fresh:** #28, #29 first (both High, both can actively mislead a user into broken or soon-broken config), then #30/#31 (accuracy issues around caching semantics — a popular support-question topic), then the rest of the pre-existing backlog.

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-12) where Linear issue creation could not be completed programmatically. Verified fresh this cycle, not just copied from the last note:
- `ListConnectors({keywords: ["Linear"]})` → `{"name":"Linear","installState":"unknown","enabledInChat":true}` — same shape as 07-10.
- `ToolSearch("select:Linear")` and `ToolSearch("Linear create issue")` → **zero matching tools**, even though `enabledInChat: true`.
- By contrast, GitHub, Slack, Google Calendar, and Notion tools all loaded normally and are usable this session — this isn't a general MCP outage, it's specific to Linear.
- Notion's `search` tool description mentions it *can* reach "connected sources (Slack, Google Drive, GitHub, Jira, Teams, SharePoint, OneDrive, Linear)" — meaning Linear is visibly connected at the account level from Notion's side — but that only offers read-only cross-search, not issue creation, and wasn't tried as a workaround since it can't create/triage/label issues.

Given 7 straight cycles with the connector reporting `enabledInChat: true` / `installState: unknown` but exposing 0 tools, this is not a transient blip — it needs direct attention in claude.ai connector settings (disconnect/reconnect the Linear integration, or check if the OAuth token has expired silently). Recommend Jack verify this outside of an automated audit cycle, since the audit has now confirmed the same symptom 4 cycles running (07-10 through 07-12 all show the identical `installState: "unknown"` signature) with no self-recovery.

**Until this is fixed, this recurring routine will keep growing an ever-larger unexecuted backlog** (now 32 items across 7 cycles) instead of actually filing anything. Consider pausing the audit cadence until Linear is confirmed working, to avoid further backlog growth with no throughput.

## Recurring Checks to Run

(unchanged from prior audits — see top-level README.md for the checklist)
