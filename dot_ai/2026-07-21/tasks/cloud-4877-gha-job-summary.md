# CLOUD-4877: DTE summary table + Nx Cloud link to GitHub Actions job summary

- Linear: https://linear.app/nxdev/issue/CLOUD-4877
- Repo: `~/projects/ocean` (client-bundle), branch off `origin/main`
- Date: 2026-07-21

## Goal

GitHub renders markdown appended to `$GITHUB_STEP_SUMMARY` on the workflow run page. Today the DTE
summary tables and the Nx Cloud link exist only in the raw job log. Write them to the job summary so
users see run status + Cloud link without opening the log.

## Research findings (2026-07-21)

### nx OSS side — already has a writer, does not help DTE

- `packages/nx/src/tasks-runner/life-cycles/performance-life-cycle.ts:198`
  `writePerformanceReportToGitHubActions()` is the ONLY `$GITHUB_STEP_SUMMARY` writer in nx.
  Guards: `GITHUB_ACTIONS === 'true'` + path set + no `NX_TASK_TARGET_PROJECT` (top-level only).
- Markdown from `performance-report.ts:437` `formatReportMarkdown` — bullet lists, no tables
  (deliberate, see `performance-report.ts:53`: HTML collapses space runs).
- Dispatched from `run-command.ts:618` `finally { flushPerformanceReport() }`.
- Shipped in #36077, refined #36127 / #36394. No `@nx/gha` package exists. Only other
  GHA-aware code in nx is `::group::` wrapping at `output.ts:276`.
- `PerformanceLifeCycle` is unconditionally in `constructLifeCycles` (`run-command.ts:1131`), and the
  cloud runner wraps `options.lifeCycle`, so NON-DTE cloud runs already emit a bare "Nx Run Report"
  to the job summary today (no Cloud link in it).
- DTE main job emits NOTHING: `distributed-execution/runner.ts` calls `process.exit(r.commandStatus)`
  (`:210`, and `:179` on the no-summary path) before nx's `finally` runs.
- nx never prints the CIPE link. Verified: no `cipeUrl` / run-URL construction in `packages/nx/src`.

### ocean side — everything in the screenshot

All under `libs/nx-packages/client-bundle/src/lib/core/`:

| Terminal output | Source |
| --- | --- |
| `Distributed Execution Started` + `View the progress of your run at .../runs/<id>` | `runners/distributed-execution/runner.ts:275,278` |
| `Distributed Execution Completed` + `Command "..." is now finished.` | `runners/distributed-execution/runner.ts:153-156` |
| `Tasks run for command:` table (Status/Task/Duration/Cache Status) | `print-distributed-execution-summary.ts:132` `buildTaskTable`, columns at `:95-100` |
| `Distributed Execution Summary Report` + `Number of Agents` | `print-distributed-execution-summary.ts:232` `buildDteSummaryTable`, title `:257`, agent row `:305-310` |
| `See more details at: <summaryUrl>` | `print-distributed-execution-summary.ts:326` |
| CIPE link at pipeline start | `commands/start-ci-run.ts:367` (`cipeUrl` set at `:361`) |

- Rendering: `utilities/table-builder.ts` (`TableBuilder`, `tableChars`) writes box-drawing chars to stdout.
- Stats: `print-distributed-execution-summary.ts:44` `calculateDteSummaryStats` — already pure, reusable.
- `printDistributedExecutionSummary` has exactly ONE call site: `runner.ts:200`. Main job only —
  agents go through `distributed-agent/v4/execute-tasks-v4.ts` and never reach it.
- `DistributedExecutionSummaryResponse` (`distributed-execution.api.ts:122-127`) =
  `{ completedTasks, partialTasks?, agentCount, summaryUrl }`. No `cipeUrl`.
- `cipeUrl` exists only in `start-ci-run.ts:269` (local, printed then discarded) and
  `cloud-enabled.runner.ts:262` (non-DTE run-end response). Not plumbed to the DTE printer.
- Nothing in the client bundle writes `$GITHUB_STEP_SUMMARY` (only this repo's own CI yaml does).
- CI/GHA detection available: `utilities/get-vcs-context.ts:213` `detectGithubActions()`,
  `utilities/is-ci.ts:5`, `utilities/environment.ts:189-191`.

### Server-side markdown generator (port reference, not shareable)

`apps/nx-api/src/main/kotlin/integrations/utils/CommentBuilder.kt` — the PR-comment generator:

- `:302` `createSummaryTable` emits `| Command | Status | Duration | Result |`, 9-row cap with an
  `Additional runs (N)` overflow row linking to `/cipes/<id>` (`:353`)
- `:376` `formatCommand` — escapes `|`, picks a backtick delimiter longer than any run in the
  command, truncates at 50 chars
- `:394` `formatStatus` — `✅ Succeeded` / `⏳ In Progress` / `⛔ Cancelled` / `❌ Failed`
- `:445` `buildActionButtonsAndLinks` is already dual-mode (`"comment"` -> HTML, `"check-run"` ->
  markdown). Precedent for a `"step-summary"` mode.

Kotlin, server-side. No cross-language markdown module exists. Port the logic, do not try to share.

### GHA job summary constraints (verified against GitHub docs 2026-07-21)

- Env var `GITHUB_STEP_SUMMARY`, append with `>>`.
- 1MiB per step. Overflow = failed upload + error annotation; step/job status unaffected.
- Max 20 step summaries displayed per job.
- GitHub Flavored Markdown. Isolated between steps, grouped per job, jobs ordered by completion time.

## Key insight

`start-ci-run` and `nx run-many` are separate STEPS of the SAME GHA job, and GitHub concatenates step
summaries per job. So the CIPE link and the tables can be two independent one-file writes with zero
plumbing and zero server change — they render as one page in step order.

`appendFileSync` is synchronous and runs before `runner.ts`'s `process.exit`, so the exit is a
non-issue. No need to touch `runner.ts` at all.

## Plan

1. Shared markdown emitter in `client-bundle/src/lib/utilities/` (sibling to `table-builder.ts`):
   GFM table builder + `$GITHUB_STEP_SUMMARY` append. Gate on `detectGithubActions()` +
   `GITHUB_STEP_SUMMARY` present. Escape `|` in task ids. Cap rows + overflow link.
2. Call from `print-distributed-execution-summary.ts:92` — reuse `reportableTasks` and
   `calculateDteSummaryStats`, no recompute.
3. Call from `start-ci-run.ts:367` — append heading + CIPE link.
4. Kill switch env var, matching existing `NX_CLOUD_DISABLE_LOCAL_SUMMARY_TABLE`
   (`end-of-run-message.ts:36`).
5. Snapshot specs — `print-distributed-execution-summary.spec.ts:497-592` already snapshots the
   rendered terminal output; add a markdown counterpart.

## Out of scope

- CIPE link inside the table block — needs `cipeUrl` added to `DistributedExecutionSummaryResponse`,
  a Kotlin change to the summary endpoint.
- Non-DTE cloud runs: `terminal-output/end-of-run-message.ts:30` `printEndOfRunMessage` already
  receives `runEndUrl` + `cipeUrl` and is already `isCI()`-gated (`:36`). Follow-up, same emitter.
  Note `printSummaryTables:50` bails for agents via `agentRunningInDistributedExecution` — mirror it.
- nx OSS: `PerformanceLifeCycle` could implement the existing optional `LifeCycle.setCloudLink`
  (`life-cycle.ts:102`, fanned out by `CompositeLifeCycle` at `:266`, already called by
  `cloud-enabled.runner.ts:424`) to get the Cloud link into the "Nx Run Report" for non-DTE runs.
  Separate NXC ticket if wanted. Does nothing for DTE.

## Verification

- Ocean version plan: check `ls .nx/version-plans/ | grep -i summary` first — skip if the feature
  already has an unreleased plan.
- Ocean PRs target `main`, NOT `master`.
- Commit scope = library name (`client-bundle`), not the app.
