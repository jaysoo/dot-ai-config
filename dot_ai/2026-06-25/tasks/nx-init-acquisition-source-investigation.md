# nx-init Installation Source: Acquisition Investigation (Handoff)

Date: 2026-06-25
Repos involved: `ocean` (Nx Cloud app + nx-api + aggregator), `nx` (CLI)
Status: open questions remain, see "Open Questions / Next Steps"
Update 2026-06-25 (session info-init-discrepancies): leading hypothesis CORRECTED via code+git. See "## UPDATE: hypothesis correction" below. Decisive Mongo query still pending (needs Atlas IP whitelist + gcloud).
RESOLVED 2026-06-26: root cause is the dashboard querying the WRONG COLUMN. See "## RESOLUTION" below. Both code PRs (nx#36121, ocean#12123) CLOSED - no code change needed; fix is Metabase-side.

## Goal

Figure out why the **Acquisition Diagnostics** dashboard ("Weekly Acquired Orgs by Installation Source") shows `nx-init` performing poorly (~3 orgs/week) when CLI telemetry shows ~82-209 users saying "yes" to Nx Cloud during `nx init` over comparable windows.

Started as a separate question about `template-repository` (resolved, see Appendix A), pivoted to `nx-init`.

## How `installationSource` works end to end

1. **CLI sets it.** `nx init` (default path = init-v2) → on "yes" calls `initCloud('nx-init')` → `connectWorkspaceToCloud` → generator `connectToNxCloud` → `createNxCloudWorkspaceV2(workspaceName, installationSource, nxInitDate)`.
   - File: `nx` repo `packages/nx/src/command-line/init/init-v2.ts:463-464` (`initCloud('nx-init')`).
   - File: `nx` repo `packages/nx/src/nx-cloud/generators/connect-to-nx-cloud/connect-to-nx-cloud.ts:72-92` (`createNxCloudWorkspaceV2` POSTs `/nx-cloud/v2/create-org-and-workspace` with raw `installationSource`).
2. **nx-api persists it verbatim.** Inserts a `workspaces` doc with `installationSource` straight from the request body, no override, no `claimedAt`.
   - File: `ocean` `apps/nx-api/src/main/kotlin/handlers/CreateOrgAndWorkspaceHandlers.kt:61-75` (V2 endpoint), `:78-135` (`createWorkspace`, line 99 = `installationSource = createOrgRequest.installationSource`).
   - This create returns `nxCloudId`, which the CLI writes into `nx.json`. So **the workspace doc exists immediately on "yes"** (no browser step needed for the doc to exist).
3. **Dashboard buckets by exact `installationSource` string** keyed on `claimedAt` week. "Acquired" = claimed orgs. Field is stored under its full name `installationSource` (string, default `"unknown"`).
   - Kotlin model: `ocean` `libs/shared/db-schema-kotlin/src/main/kotlin/Workspace.kt:98` (`installationSource`), `:104` (`claimedAt`), `:95` (`createdAt`).
   - TS model: `ocean` `libs/nx-cloud/model-db/src/lib/workspaces.ts:195` (string, no enum).

## Key finding 1: live source fragmentation (dashboard undercounts nx-init)

`nx init` does NOT always emit `nx-init`. It routes by repo type and several variants are **live**, but the dashboard's exact-match `nx-init` filter misses them.

Mongo (`nrwl-api-prod` > `nrwl-api` > `workspaces`), `installationSource: /^nx-init/`, `createdAt` >= 2026-06-01:

| installationSource | count | status |
|---|---|---|
| `nx-init` | 386 | live (generic init-v2 path) |
| `nx-init-angular` | 54 | **LIVE** - not dead v1 |
| `nx-init-npm-repo` | 6 | trickle |
| `nx-init-monorepo` | 1 | dead v1 |

- `nx-init-angular` is live: `init-v2.ts:204-215` - if `angular.json` exists, routes to `addNxToAngularCliRepo` → `initCloud('nx-init-angular')` then **`return`** (never hits generic `nx-init`). Has a `// TODO(jack): Remove this Angular logic once @nx/angular is compatible with inferred targets`.
- The flavored sources `nx-init-{angular,monorepo,nest,npm-repo,turborepo}` are defined in `packages/nx/src/command-line/init/implementation/utils.ts:299-312` (`initCloud` signature) and emitted from the per-flavor impls.
- init-v1 (the fully legacy flavored paths) only runs under `NX_ADD_PLUGINS=false` ("slated for removal") - `packages/nx/src/command-line/init/command-object.ts:36-39`.

### Root cause of fragmentation (a real CLI bug)

The CLI **normalizes the onboarding *session* source but NOT the *workspace* source**:
- `createNxCloudOnboardingURL` calls `getSource()` which collapses `nx-init*` → `nx-init` and `nx-connect*` → `nx-connect`. File: `nx` `packages/nx/src/nx-cloud/utilities/url-shorten.ts:31` and `:65-75`.
- But `createNxCloudWorkspaceV2` sends the **raw** `installationSource` to nx-api with no `getSource()` call. File: `connect-to-nx-cloud.ts:78-85`.

So the workspace doc keeps the flavored variant forever (claim path preserves it via `$ifNull`, see Appendix A). Result: ~14% of init acquisition (mostly Angular) is invisible to the exact-match `nx-init` dashboard filter.

**Two candidate fixes:**
- CLI-side: normalize via `getSource()` inside `createNxCloudWorkspaceV2` (and V1) before POST. Matches what the URL path already does.
- Dashboard-side: bucket by `^nx-init` prefix instead of exact match.
(Probably do both. CLI fix only affects new workspaces going forward.)

Note: `nx connect` hardcodes `'nx-connect'` for its onboarding URL (`packages/nx/src/command-line/nx-cloud/connect/connect-to-nx-cloud.ts:198-199`). User confirmed nx-connect is fine and out of scope here.

## Key finding 2: commandStats "yes" does NOT equal workspaces created

CLI telemetry "yes" count is larger than the count of `nx-init` workspace docs in the same window, AND it excludes Angular entirely.

commandStats query (last 2 days) returned: `completions: 340, yes: 82, skip: 218, never: 38, yes_rate: 24.12`.
workspaces query (same 2 days, `/^nx-init/`): `nx-init: 40`, `nx-init-angular: 3`.

So **82 generic "yes" vs 40 `nx-init` workspace docs** = ~50% gap, created-vs-yes (claiming NOT involved - the workspaces query has no `claimedAt` filter).

### Why commandStats "yes" is not a clean denominator

- **Angular is uninstrumented in commandStats.** The Angular init branch `return`s at `init-v2.ts:214` BEFORE the `recordStat({command:'init', meta:{type:'complete', nxCloudArg}})` at `init-v2.ts:474-489`. The flavored impls (angular/npm-repo/monorepo) contain **zero `recordStat` calls** (grep confirmed). So `nx-init-angular` workspaces are created but emit **no init/complete event**. The 82 "yes" is generic-path only.
- In current/local code, `recordStat('complete')` runs AFTER an awaited `initCloud('nx-init')`, so a counted yes SHOULD imply a created doc. The ~50% prod gap therefore points elsewhere.

### Leading hypothesis for the 82→40 gap: CLI version skew

Prod telemetry spans many shipped nx versions. Older `nx init` used the **browser-deferred** onboarding (workspace created later by the remix app, not inline via V2). That is exactly why `getLatestInstallationSource` exists - see its doc comment: "With the new VCS onboarding flow, the workspace is created much later by the remix app, and the installationSource is passed via URL params, which can be unreliable/lost." File: `ocean` `libs/nx-cloud/data-access-api/src/lib/queries/user/latest-installation-source.server.ts:5-26`.

Consequences for old versions:
- "yes" emits a complete-stat but **no immediate `nx-init` workspace doc**.
- If the user finishes the browser step >24h later (or with a newer CLI session), `getLatestInstallationSource` falls back to its default `'vcs-repository'` (line 25) - so the doc, if created at all, may land in the `vcs-repository` bucket, NOT `nx-init`.

Other (less likely) candidates: duplicate `type:complete` events inflating the 82; window/clock skew between collections (won't explain 2x).

## Open Questions / Next Steps for investigating agent

1. **Confirm version skew.** Group the "yes" events by `nxVersion` and compare against the nx version where inline `createNxCloudWorkspaceV2` (V2 endpoint) shipped. If the "yes" mass sits on older versions, skew explains 82→40. Query in Appendix B.
2. **Find the exact nx version** where `nx init` switched from browser-deferred onboarding to inline V2 workspace create. (Read `connect-to-nx-cloud.ts` / `createNxCloudWorkspaceV2` git history in the `nx` repo.)
3. **Quantify the Angular blind spot** properly - it has no commandStats coverage at all. Decide whether to add a `recordStat` to the Angular/npm-repo branches or accept workspaces-collection as the source of truth.
4. **Decide the fix(es):** CLI `getSource()` normalization in `createNxCloudWorkspaceV2`/V1, and/or dashboard `^nx-init` prefix bucketing.
5. **Re-baseline "init performance"** off the `workspaces` collection (created docs by `/^nx-init/`), not commandStats "yes", since the latter overcounts vs real docs and omits Angular.
6. (Stretch) Quantify the created→claimed conversion for `nx-init` (the original "poor performance" symptom on the dashboard, which counts CLAIMED orgs). Query in Appendix C.

## RESOLUTION (2026-06-26): wrong-column bug, fix is Metabase-side

The undercount is NOT a code bug. `analytics.newlyClaimedWorkspaces` stores BOTH a raw `installationSource` (verbatim: `nx-init`, `nx-init-angular`, `create-nx-workspace`, ...) AND a derived `claimSource` enum. The "Weekly Acquired Orgs by Installation Source" Metabase panel groups on `claimSource`, but that enum is a CLAIM-MECHANISM axis (`NX_API_ONBOARDING`, `NX_CLOUD_CONNECT_WORKSPACE`, `NX_CLOUD_METADATA_ONLY`, `NX_CLOUD_VCS_REPOSITORY`, `RECONCILED_FROM_WORKSPACES`), not an install-source axis. CNW + init + migrate all claim via the connect-workspace token flow -> all correctly bucket to `NX_CLOUD_CONNECT_WORKSPACE`. So the catch-all is fine; the panel is just reading the wrong column.

Confirmed in prod (Compass, `analytics.newlyClaimedWorkspaces`): docs with `installationSource: "nx-init"` / `"nx-init-angular"` all have `claimSource: "NX_CLOUD_CONNECT_WORKSPACE"`.

Fix (no code, no backfill, no DB write): repoint the Metabase question at the raw `installationSource` field and normalize flavors in the query, e.g. `CASE WHEN installationSource LIKE 'nx-init%' THEN 'nx-init' ELSE installationSource END`. Retroactively correct for all ~3.7k rows because the raw field was always right. Keeps `nx-init-angular` granularity on disk (normalize on read, not on write - preserves the only place Angular inits are recorded).

Both code PRs CLOSED:
- nx#36121 (CLI normalize source on create) - unnecessary AND lossy (would erase the Angular flavor at the source). Closed.
- ocean#12123 (NX_INIT enum + deriveClaimSource prefix bucket) - solved at the wrong layer; only fixed forward and needed a backfill. Closed.

Optional follow-up cleanup (separate, not required): `template-repository` is dead for NEW workspaces (in-app template CNW removed 2026-05-21, CLOUD-4507), so its `deriveClaimSource` case is dead-for-new. Removing it would reclassify late-claimed legacy template workspaces `VCS_REPOSITORY` -> `CONNECT_WORKSPACE` (low volume, draining). Cosmetic only.

## UPDATE: hypothesis correction (session info-init-discrepancies, 2026-06-25)

Reinvestigated the CLI create path (nx git history) and re-confirmed the ocean side (delegated). The original "version-skew via browser-deferred creation" framing is wrong. Corrected picture:

### The CLI creates the workspace doc INLINE on "yes" in every version

- The doc is created synchronously by the `connectToNxCloud` generator inside the "yes" path - V1 endpoint since ~2023-10 (`d62acecec6`, nx ~17), V2 endpoint since `fbecedce0f` "#27197 add nxCloudId field for auth" (2024-08-06) which first shipped in **nx 19.6.0** (2024-08-15; mapped via npm release dates).
- `#26262` "new cloud onboarding flow" (`f8239debd0`, 2024-06-05, ~nx 19.4) did NOT remove inline create. Its init/generator diff only changed the **success message** (the browser CLAIM URL via `shortenedCloudUrl`), behind `NX_NEW_CLOUD_ONBOARDING` then unhidden `92be32c1a8` (2024-06-21). `r.url`/`r.token` still come from the inline `createNxCloudWorkspace`. So "yes" -> doc exists immediately, with the raw `nx-init*` source, in all versions.
- Therefore `getLatestInstallationSource` -> `vcs-repository` default is for a **browser-initiated VCS onboarding flow** (no CLI), NOT for `nx init`. CLI inits do not get re-attributed to `vcs-repository` via that path.

### Current CLI: a counted "yes" implies a created nx-init doc (failures throw before the stat)

`init-v2.ts:463-489`: `await initCloud('nx-init')` (464) is NOT wrapped in try/catch here; `recordStat({type:'complete', nxCloudArg})` is at 474, AFTER it.
`connect-to-nx-cloud.ts:169-248` (generator): for `installationSource==='nx-init'` the early-return at 199-205 does NOT apply (that branch is only `nx-connect`/`nx-console` + github). Non-404 create errors are rethrown (221); "nothing created" throws (246). Any failure propagates above `recordStat`, so it does not emit a "yes".
=> In current code yes ~= docs (re-running init even creates a SECOND nx-init doc - no existing-nxCloudId guard). The observed prod **82 yes vs 40 nx-init docs** gap is only explainable by OLD shipped versions whose stat/create ordering differed (recorded `complete/yes` without an awaited successful create), i.e. real version skew but on the STAT side, not browser-deferred creation.

### Ocean side (delegated, re-confirmed + extended)

- `latest-installation-source.server.ts:25` default is `'vcs-repository'` (confirmed), strict 24h window.
- nx-api V2 DTO default is `"unknown"` (not `nx-init`) when the field is omitted - a CLI hitting V2 without the field lands in `unknown`.
- **Aggregator `deriveClaimSource` (`TrackNewlyClaimedWorkspaces.kt:185-191`) is exact-match and has NO `nx-init` case.** Every `nx-init`, `nx-init-angular`, `nx-init-npm-repo`, `nx-init-monorepo` falls through `else` -> `NX_CLOUD_CONNECT_WORKSPACE`. No prefix/`startsWith` collapsing anywhere. (Buckets: `onboarding-api`/`onboarding-api-template`->NX_API_ONBOARDING, `manual`->METADATA_ONLY, `template-repository`->VCS_REPOSITORY, else->CONNECT_WORKSPACE.)
- `connect-workspace-using-token.server.ts:225-230` `$ifNull` preserves an existing source on claim - but ONLY on the repository-claim branch (line 217 guard); non-repository / new-org claim branches don't touch `installationSource`.

### Two INDEPENDENT undercount mechanisms (both real)

1. **Stat-side version skew (timing):** old CLI versions emit `complete/yes` without a matching live `nx-init` doc in-window. Quantify with Appendix B (yes-by-`nxVersion`). This is the 82->40 gap.
2. **Flavor fragmentation + aggregator bucketing (mapping):** even when docs exist, the dashboard's claim-source mapping never has an `nx-init` bucket; all init flavors collapse to `CONNECT_WORKSPACE`, and any exact-string `installationSource == "nx-init"` query also drops `nx-init-angular` etc. This depresses the "Acquired by nx-init" number independent of skew. **Verify the dashboard's actual source field/query** (claimSource enum vs raw installationSource string) - the two paths bucket differently.

### Revised fixes

- CLI: normalize via `getSource()` inside `createNxCloudWorkspaceV2`/V1 before POST (collapse `nx-init*` -> `nx-init`), matching the URL path. New workspaces only, going forward.
- Dashboard/aggregator: add an explicit `nx-init` claim-source bucket (prefix `^nx-init`) in `deriveClaimSource`, OR switch the dashboard query to `^nx-init` prefix. Without this, the CLI normalization alone still won't surface init in the claim-source dashboard.
- Re-baseline "init performance" off the `workspaces` collection (`/^nx-init/` created docs), not commandStats "yes".

### Still needs live Mongo (Atlas IP whitelist + gcloud secret; see dte-analyzer SKILL.md "Connection")

- Appendix B: group the 82 "yes" by `nxVersion`; compare against the 19.6.0 inline-V2 boundary and earlier. If the yes-mass sits on old versions -> stat-side skew confirmed.
- Confirm the dashboard's exact source field (claimSource enum vs raw `installationSource`) to size mechanism #2.

## Appendix A: template-repository (resolved earlier, context only)

- `template-repository` set ONLY at `create-workspace-from-vcs-repository-without-token.server.ts:102-104` when `isNewlyCreated: true`. That flag came only from the in-app template-based CNW flow.
- That flow was removed in `ocean` commit `c041388854` "chore(nx-cloud): remove in-app template-based CNW (#11281)" (merged 2026-05-21, CLOUD-4507). No current caller passes `isNewlyCreated: true` → branch is dead code.
- Recent `template-repository` dashboard entries = old workspaces (created pre-05-21, stamped then) being claimed late. Claim path preserves the old source via `$ifNull`: `connect-workspace-using-token.server.ts:225-230`. Dashboard buckets by `claimedAt`, so old source + recent claim = looks recent. User confirmed these were stale weeks. Draining out of the rolling window. No action needed.
- Aggregator that feeds the dashboard: `apps/aggregator/src/main/kotlin/operations/analytics/TrackNewlyClaimedWorkspaces.kt` (reconciles `workspaces` by `claimedAt` into `MNewlyClaimedWorkspace`; `deriveClaimSource` at :185-191 maps installationSource → claimSource).
- Latent bug noted (not pursued): `connect-workspace-using-token.server.ts:228` passes an un-awaited `getLatestInstallationSource(currentUser)` Promise into the `$ifNull` aggregation expression. Harmless when existing source is non-null (short-circuits), but would serialize a Promise for the genuine-null case.

## Appendix B: yes-by-version query (commandStats)

```js
[
  { $match: {
      command: "init", isCI: false,
      meta: { $regex: '"type":"complete"', $not: { $regex: '"aiAgent":true' } },
      $expr: { $gte: ["$createdAt", { $dateSubtract: { startDate: "$$NOW", unit: "day", amount: 2 } }] }
  }},
  { $addFields: { argMatch: { $regexFind: { input: "$meta", regex: /"nxCloudArg":"([^"]+)"/ } } } },
  { $match: { "argMatch.captures.0": "yes" } },
  { $group: { _id: "$nxVersion", yes: { $sum: 1 } } },
  { $sort: { yes: -1 } }
]
```

## Appendix C: created-vs-claimed for nx-init (workspaces collection)

```js
[
  { $match: { installationSource: /^nx-init/, createdAt: { $gte: ISODate("2026-06-01") } } },
  { $group: {
      _id: null,
      created: { $sum: 1 },
      claimed: { $sum: { $cond: [{ $ifNull: ["$claimedAt", false] }, 1, 0] } }
  }},
  { $addFields: { claim_rate: { $round: [{ $multiply: [{ $divide: ["$claimed", "$created"] }, 100] }, 1] } } }
]
```

## Appendix D: the working commandStats "yes during init" query (validated)

This is correct for "said yes during init, non-CI, non-AI-agent", but remember it is generic-path only (no Angular) and counts events not workspaces.

```js
[
  { $match: {
      command: "init", isCI: false,
      meta: { $regex: '"type":"complete"' },
      $and: [ { meta: { $not: { $regex: '"aiAgent":true' } } } ],
      $expr: { $gte: ["$createdAt", { $dateSubtract: { startDate: "$$NOW", unit: "day", amount: 2 } }] }
  }},
  { $addFields: { argMatch: { $regexFind: { input: "$meta", regex: /"nxCloudArg":"([^"]+)"/ } } } },
  { $addFields: { nxCloudArg: { $ifNull: [ { $arrayElemAt: ["$argMatch.captures", 0] }, "missing" ] } } },
  { $group: { _id: null,
      completions: { $sum: 1 },
      yes:   { $sum: { $cond: [{ $eq: ["$nxCloudArg", "yes"] }, 1, 0] } },
      skip:  { $sum: { $cond: [{ $eq: ["$nxCloudArg", "skip"] }, 1, 0] } },
      never: { $sum: { $cond: [{ $eq: ["$nxCloudArg", "never"] }, 1, 0] } }
  }},
  { $addFields: { yes_rate: { $round: [{ $multiply: [{ $divide: ["$yes", "$completions"] }, 100] }, 2] } } }
]
```

## File reference index

- `nx` `packages/nx/src/command-line/init/init-v2.ts` - init dispatch; angular early-return (:204-215); generic `initCloud('nx-init')` (:463-464); `recordStat` complete (:474-489)
- `nx` `packages/nx/src/command-line/init/command-object.ts:36-39` - v1/v2 dispatch (v1 gated on `NX_ADD_PLUGINS=false`)
- `nx` `packages/nx/src/command-line/init/implementation/utils.ts:299-312` - `initCloud` flavored source union
- `nx` `packages/nx/src/nx-cloud/generators/connect-to-nx-cloud/connect-to-nx-cloud.ts:72-92` - `createNxCloudWorkspaceV2` (raw source, NOT normalized)
- `nx` `packages/nx/src/nx-cloud/utilities/url-shorten.ts:31,65-75` - `getSource()` normalization (session only)
- `nx` `packages/nx/src/command-line/nx-cloud/connect/connect-to-nx-cloud.ts:198-199` - nx-connect URL hardcoded source
- `ocean` `apps/nx-api/src/main/kotlin/handlers/CreateOrgAndWorkspaceHandlers.kt` - V2 endpoint + verbatim persist (:99)
- `ocean` `libs/nx-cloud/data-access-api/src/lib/queries/user/latest-installation-source.server.ts` - 24h CLI-session lookup + `vcs-repository` default
- `ocean` `libs/nx-cloud/data-access-api/src/lib/mutations/connect-workspace-using-token.server.ts:207-279` - claim path, `$ifNull` source preservation, sets `claimedAt`
- `ocean` `apps/aggregator/src/main/kotlin/operations/analytics/TrackNewlyClaimedWorkspaces.kt` - dashboard feed
- `ocean` `libs/shared/db-schema-kotlin/src/main/kotlin/Workspace.kt` - workspace schema
- Mongo: `nrwl-api-prod` cluster > `nrwl-api` db > `workspaces` and `commandStats` collections
