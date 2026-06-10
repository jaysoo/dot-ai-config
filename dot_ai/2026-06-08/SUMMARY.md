# 2026-06-08 Summary

## Q-491: Scope CIPE sandbox violations banner to current CIPE, remove total (Nx Cloud / ocean) — draft PR #11733

**Problem:** The CIPE page sandbox violations banner counted violations over a rolling 7-day branch window (the same `getWorkspaceSandboxViolations(latestOnly: true)` query the dashboard uses), so its "X of Y tasks" could disagree with what actually ran in the CIPE being viewed. Surfaced by Jason in Slack ("where is the sandbox violation?"). The "total" task count also confused users.

**Fix (single-repo, ocean):**
- Data layer: added `getSandboxViolationTaskCountForRunGroup(workspaceId, runGroup)` in `get-sandbox-violations-for-run-group.server.ts` — counts distinct violating `taskId`s for the current run group, reusing the same indexed `runGroup` filter as the existing `getSandboxViolationRunIds` (no duplicate aggregation).
- `ci-pipeline-execution-run-group-details.server.ts`: swapped the shared dashboard-window query for the run-group-scoped count; dropped `sandboxTotalTaskCount` from the `RunGroupDetailsResponse` interface + return; removed the now-dead 7-day window constant, the keep-in-sync comment, unused imports (`convertToUTC`/`startOfToday`/`subDays`/`getWorkspaceSandboxViolations`), and the unused `branch` param.
- UI: `cipe-alerts.tsx` dropped the `sandboxTotalTaskCount` prop everywhere; banner reworded to **"N task(s) in this run has/have sandbox violations. Cache may be unreliable."** Removed the prop pass-through from both containers (`...details-container.tsx`, `...execution-timeline-container.tsx`) and the timeline spec.
- Removed the now-false "keep CIPE and dashboard counts in sync" comment in `sandbox-violations-loader.server.ts` — the two surfaces intentionally answer different questions now.

**Verification:** tsc clean on data-access-api, ui-ci-pipeline-executions, feature-ci-pipeline-executions (build mode, since `nx` is blocked by the `@nx/gradle` plugin in this worktree); `execution-timeline-container` spec 6/6; `run-group-details` spec 18/18.

**Notes:**
- No version plan added — the banner is covered by unreleased `sandbox-warning` and `task-sandboxing` feat plans (same cycle).
- 7 files, single commit `2ecfc54930`, pushed via Polygraph, draft PR opened.
- Polygraph `push_branch` reported a description-persist failure: the MCP shells out to `polygraph session update-description` but this CLI version expects `polygraph session update`. Branch/PR fine; worth flagging to the Polygraph team.
- Lint not run locally (nx affected broken by gradle sandbox); CI covers it.

**Files:** PR https://github.com/nrwl/ocean/pull/11733, Polygraph session `fix-sandbox-3cce39e3`
