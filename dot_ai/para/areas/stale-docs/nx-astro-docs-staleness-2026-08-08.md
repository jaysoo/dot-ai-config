# Nx Astro Docs Staleness Audit — 2026-08-08

**Scope note:** targeted pass across the 4 smells requested this cycle: (1) old Nx major version mentions, (2) old Node/npm/framework version mentions, (3) documented CLI/generator/plugin options that no longer match source, (4) Ocean feature changes that need docs updates (GitHub App permissions, `nx-cloud` CLI commands). This is the **first cycle to explicitly cross-check against `nrwl/ocean`** in addition to `nrwl/nx` — prior audits (2026-06-11 through 2026-07-10, see [README](./README.md)) were nx-only. Not a full re-sweep of all 478 `.mdoc` files; the [2026-06-29 audit](./nx-astro-docs-staleness-2026-06-29.md) remains the last exhaustive full-file pass.

Current Nx: **23.2.0-beta.4** (read live from this checkout's root `nx.json` / `packages/nx/migrations.json`, not training data). Node current: Active/Maintenance LTS lines per `technologies/node/introduction.mdoc`, which is itself current and not flagged. React current: 19.x, also current in docs. No drift found on the baseline-version front this cycle — the specific stale spots found are all inside example code blocks and troubleshooting prose, not the compatibility tables.

**Linear MCP unavailable again — 7th consecutive audit cycle.** `ListConnectors` reports Linear `installState: connected` at the org level but `enabledInChat: false` for this chat session; `ToolSearch` surfaces zero Linear tools. All findings below are queued as ready-to-file issues, merged into the running backlog from prior audits. See escalation note at the bottom — this has now failed every single cycle since tracking started and needs a human to check the connector setting directly rather than another automated retry.

---

## Summary

| Category | Confirmed (new) | Re-verified (still open, already queued) | Needs Input |
|---|---|---|---|
| Old Nx version reference | 1 (new) | 0 | 0 |
| Old Node/npm/framework version | 0 new | 2 (`bundling-node-projects.mdoc` = queued #16; `launch-template-examples.mdoc` = NI-5) | 0 |
| Mismatched CLI/feature vs. source | 4 (new — `nx-cloud-cli.mdoc` gaps, 4 sub-issues in `webpack-plugins.mdoc`) | 0 | 1 (complete-ci-run/stop-all-agents behavioral framing) |
| Ocean feature drift (new scope this cycle) | 1 (new — GitHub App permissions cross-repo contradiction) | — | 1 (full permission/webhook-event list unverifiable from either repo checkout) |
| **Total** | **6** | **2** | **2** |

---

## Confirmed Findings

### C-1 — `kb/unknown-local-cache.mdoc` recommends a dead environment-variable workaround (new)
**File:** `astro-docs/src/content/docs/kb/unknown-local-cache.mdoc` (line 53)
**Category:** old-nx-version / mismatched-feature
**Issue:** Live troubleshooting guidance (not historical/migration content) tells users sharing a network-drive cache to run:
> "you can prefix any Nx command with `NX_REJECT_UNKNOWN_LOCAL_CACHE=0` to ignore the errors (e.g., `NX_REJECT_UNKNOWN_LOCAL_CACHE=0 nx run-many -t build test`)"

This only ever applied to the legacy file-system cache, which was deprecated in Nx 20 and had its `useLegacyCache` option fully removed by the `update-21-0-0/remove-legacy-cache.ts` migration. `packages/nx/src/tasks-runner/cache.ts` now explicitly throws `"NX_REJECT_UNKNOWN_LOCAL_CACHE=0 is not supported with the new database cache"` — the flag has been dead on any Nx 21+ workspace for two majors. A reader following this doc's advice today gets an error telling them the flag doesn't work.
**Fix suggestion:** rewrite the section to explain the workaround only applied to the now-removed legacy cache, and point to the current mitigation this same page already documents (Nx Cloud remote cache / self-hosted caching server).
**Link:** [github.com/nrwl/nx/blob/master/astro-docs/src/content/docs/kb/unknown-local-cache.mdoc#L53](https://github.com/nrwl/nx/blob/master/astro-docs/src/content/docs/kb/unknown-local-cache.mdoc)

---

### C-2 — `reference/nx-cloud-cli.mdoc` is missing 6 live commands (new)
**File:** `astro-docs/src/content/docs/reference/nx-cloud-cli.mdoc`
**Category:** mismatched-feature
**Issue:** The page bills itself as "Complete reference for all Nx Cloud CLI commands" and is hand-written (no auto-generation mechanism ties it to source — confirmed via `astro-docs/README.md`'s content-types section and the absence of any generator script referencing it). `packages/nx/src/command-line/nx-commands.ts` registers these live, working commands that the page never mentions:

- **`connect`** (alias `connect-to-nx-cloud`) — `packages/nx/src/command-line/nx-cloud/connect/command-object.ts:6-19`
- **`view-logs`** — same file, lines 29-37
- **`download-cloud-client`** — `packages/nx/src/command-line/nx-cloud/download-cloud-client/command-object.ts:5-16`
- **`record`** — `packages/nx/src/command-line/nx-cloud/record/command-object.ts:5-22`; documented instead on `features/CI Features/distribute-task-execution.mdoc` but absent from the "complete" CLI reference
- **`fix-ci`** — `packages/nx/src/command-line/nx-cloud/fix-ci/command-object.ts:5-19`; documented on `features/CI Features/self-healing-ci.mdoc` but absent here
- **`apply-locally`** — `packages/nx/src/command-line/nx-cloud/apply-locally/command-object.ts:5-21`; same situation

`fix-ci` and `apply-locally` are the newest additions (same commit, `ea0d6113` on 2026-07-29, that last touched this reference page — the page was edited without picking them up).
**Secondary issue:** the page documents `nx-cloud complete-ci-run` (lines 654-672) and `nx-cloud stop-all-agents` (lines 640-652) as two distinct behaviors ("explicitly complete a CI run" vs. "terminate all agents"), but in this repo `complete-ci-run` is registered as a literal alias resolving to the same handler as `stop-all-agents` (`.../complete-run/command-object.ts:6-8`). See Needs Input NI-1 below — can't fully confirm from this repo whether the closed-source client differentiates behavior by alias.
**Fix suggestion:** add the 6 missing commands (or cross-link to `self-healing-ci.mdoc` / `distribute-task-execution.mdoc` and soften the "complete reference" claim), and clarify or correct the complete-ci-run/stop-all-agents framing.
**Link:** [github.com/nrwl/nx/blob/master/astro-docs/src/content/docs/reference/nx-cloud-cli.mdoc](https://github.com/nrwl/nx/blob/master/astro-docs/src/content/docs/reference/nx-cloud-cli.mdoc)

---

### C-3 — `kb/webpack-plugins.mdoc`: wrong default + removed option + 5 undocumented options (new)
**File:** `astro-docs/src/content/docs/kb/webpack-plugins.mdoc`
**Category:** mismatched-feature
Four distinct drift points in this hand-written, prose-per-option reference:

1. **Wrong documented default — `externalDependencies`** (lines 110-115): doc says `"Default is none."`; actual default is `'all'` (`packages/webpack/src/plugins/nx-webpack-plugin/lib/apply-base-config.ts:48`, confirmed by the JSDoc in `nx-app-webpack-plugin-options.ts:97`). A reader could believe third-party deps are bundled by default when they're actually externalized by default.
2. **Removed option still documented — `deleteOutputPath`** (lines 94-102): doc lists it as a currently-usable, merely-deprecated option ("Use `output.clean` instead"). The field no longer exists in `NxAppWebpackPluginOptions` at all — it was hard-removed by the `update-22-0-0/remove-deprecated-options.ts` migration (`packages/webpack/migrations.json:13`), same migration that correctly removed the neighboring `sassImplementation` option from this doc. `deleteOutputPath` was left behind by mistake.
3. **New `NxAppWebpackPlugin` options undocumented**: `cache` (`nx-app-webpack-plugin-options.ts:256` — configurable webpack cache, affects rebuild speed/behavior), `publicPath` (line 260), `rebaseRootRelative` (line 264), `useTsconfigPaths` (line 240).
4. **New `withModuleFederation` option undocumented**: `disableNxRuntimeLibraryControlPlugin` (`packages/module-federation/src/utils/models/index.ts:43-56`) — an escape hatch for shared-library resolution issues, not mentioned anywhere in the doc's option list.

**Fix suggestion:** correct the `externalDependencies` default, remove or clearly re-label `deleteOutputPath` as fully removed (v22+) rather than "deprecated," and add the five missing option entries.
**Link:** [github.com/nrwl/nx/blob/master/astro-docs/src/content/docs/kb/webpack-plugins.mdoc](https://github.com/nrwl/nx/blob/master/astro-docs/src/content/docs/kb/webpack-plugins.mdoc)

---

### C-4 — GitHub App permissions doc contradicts Ocean's own in-product remediation copy (new, cross-repo)
**Files:**
- Docs: `astro-docs/src/content/docs/kb/github-app-permissions.mdoc` (nrwl/nx)
- Product: `libs/nx-packages/client-bundle/src/lib/core/commands/onboarding/onboarding-remediation.ts:75-77` (nrwl/ocean)

**Category:** ocean-feature-drift
**Issue:** The docs page has a callout stating: *"The Nx Cloud GitHub App no longer requests the `Administration` (read & write) permission. It was previously required to generate new workspaces from the browser; that feature has since been removed, so we've dropped the permission..."* and its current permission list has only `Administration: Read Only` (organization-scoped).

But `nx-cloud`'s own CLI remediation text, shown to users on a 403/permission error, still says:
> `'Ensure the Nx Cloud GitHub App has "Contents: Read & Write" and "Administration: Read & Write" permissions, then re-run the command.'`

One of these two live, user-facing surfaces is wrong. Either the docs are ahead of reality (the App still needs `Administration: Read & Write` for some code paths, and the docs callout is premature/incorrect), or the CLI remediation copy is stale (still telling users to grant a permission that was intentionally dropped, which would actively confuse a user debugging a permissions error by pointing them at a scope that no longer exists to grant). Could not confirm which side is correct from either repo checkout alone — no GitHub App manifest file exists in the ocean repo (permissions are configured through the GitHub App settings UI, not versioned code); this needs someone with access to that UI, or the Ocean team, to confirm the actual live permission set and fix whichever surface is wrong.
**Link (docs):** [github.com/nrwl/nx/blob/master/astro-docs/src/content/docs/kb/github-app-permissions.mdoc](https://github.com/nrwl/nx/blob/master/astro-docs/src/content/docs/kb/github-app-permissions.mdoc)

---

## Needs Input

### NI-1 — `nx-cloud-cli.mdoc` complete-ci-run/stop-all-agents behavioral framing (see C-2)
Can't confirm from the nx repo alone whether the closed-source `nx-cloud` client actually differentiates `complete-ci-run` behavior from `stop-all-agents` despite sharing one yargs alias in this repo, or whether the docs' two-paragraph framing is simply wrong. Docs team judgment call, possibly needs an Ocean engineer to confirm.

### NI-2 — Full GitHub App permission/webhook-event list can't be independently verified (see C-4)
Beyond the `Administration` contradiction above, the rest of `kb/github-app-permissions.mdoc`'s permission table (`Checks`, `Contents`, `Commit Statuses`, `Issues`, `Metadata`, `Pull requests`, `Workflows`, `Actions`, `Members`) could not be checked against a canonical source — no manifest file exists in `nrwl/ocean`. Partial runtime evidence found: `apps/nx-api/src/main/kotlin/integrations/github/GithubClient.kt:226-244` requests `contents:read, metadata:read` for read-only tokens; webhook handlers in `CIWebhookHandlers.kt` and `PolygraphWebhookHandlers.kt` act on `pull_request`, `push`, `organization`, `github_app_authorization`, and `pull_request_review` events (a strict lower bound — other subscribed-but-unhandled events aren't ruled out). This is consistent with, but doesn't fully confirm or refute, the docs table. Recommend the Docs/Ocean team cross-check directly against the GitHub App's settings page (the actual source of truth) rather than the codebase.

---

## Re-verified — Still Open (already queued, not re-numbered)

- **`kb/bundling-node-projects.mdoc`** `target: 'node18'` in a Vite/esbuild config example (Node 18 EOL since April 2025) — still present, matches queued item **#16** from the 2026-06-29 backlog below.
- **`reference/Nx Cloud/launch-template-examples.mdoc`** uses Node 21 (never LTS, EOL since mid-2024) throughout its "custom node version" walkthrough — still present, matches **NI-5** from the 2026-07-10 audit. Contradicts the project's own stated guidance in `technologies/node/introduction.mdoc` against odd-numbered Node releases.
- **`reference/Deprecated/*`** future/present tense about already-passed Nx 20/21 milestones — general pattern already tracked as **NI-4** (2026-07-10); `legacy-cache.mdoc` specifically still reads oddly given it's the cross-reference target of new finding C-1 above.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Group into these issues for the **Docs** team, status **Triage**, labeled **"Good for AI agents"**, assignee **Linear agent if available, else unassigned**. Items 1–27 carried forward unchanged from prior audits (see [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) and [2026-07-10](./nx-astro-docs-staleness-2026-07-10.md)). Items 28–33 are new this cycle.

| # | Title | Severity | Files | Team |
|---|---|---|---|---|
| 1–27 | *(unchanged — see 2026-07-10 audit for full list)* | — | — | Docs |
| **28** | **Fix `kb/unknown-local-cache.mdoc`: `NX_REJECT_UNKNOWN_LOCAL_CACHE=0` workaround is dead code since the Nx 21 database-cache migration; rewrite to point at current remote-cache mitigation** | High | 1 file | Docs |
| **29** | **Add 6 missing commands to `reference/nx-cloud-cli.mdoc` (`connect`, `view-logs`, `download-cloud-client`, `record`, `fix-ci`, `apply-locally`) and clarify the `complete-ci-run` vs `stop-all-agents` relationship** | High | 1 file | Docs |
| **30** | **Fix `kb/webpack-plugins.mdoc`: correct `externalDependencies` default (`none`→`all`), remove/relabel fully-removed `deleteOutputPath`, document 5 missing options (`cache`, `publicPath`, `rebaseRootRelative`, `useTsconfigPaths`, `disableNxRuntimeLibraryControlPlugin`)** | Medium | 1 file | Docs |
| **31** | **Reconcile `kb/github-app-permissions.mdoc` vs. Ocean's `onboarding-remediation.ts` CLI copy — one still references `Administration: Read & Write`, which the docs say was removed** | High | 1 file (docs) + 1 file (ocean, needs Ocean team input) | Docs |

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 08-08) where Linear issue creation could not be completed programmatically. Every cycle has failed with a slightly different symptom (SSE transport removed → tools not exposed despite `enabledInChat: true` → now `enabledInChat: false` at the org-connected level). This cycle: `ListConnectors({keywords:["linear"]})` returns `installState: "connected"`, `enabledInChat: false`. The connector is authenticated at the org level but simply isn't toggled on for scheduled/automated sessions — this is not something an agent can fix mid-run (there's no live user to click the per-chat enable toggle). **Recommend Jack either (a) enable the Linear connector specifically for whatever chat/session context this scheduled routine runs under, or (b) batch-create the now ~33-item backlog manually from this file and the prior 6 audit files, then reset this tracker.** Continuing to accumulate an ever-growing "queued" backlog without any of it landing in Linear defeats the purpose of the audit.

## Recurring Checks to Run

(unchanged from prior audits — see [README](./README.md) for the checklist and the "Preventing False Positives" verification rules used to produce this audit)
