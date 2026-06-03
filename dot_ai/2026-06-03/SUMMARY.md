# Summary - 2026-06-03

## PR #11598 review: restrict manual DTE to Enterprise (review only)

Thermo-nuclear code-quality review of `nrwl/ocean` PR #11598 (branch `restrict-manual-dte`,
author Louie Weng), driven from Polygraph session `restrict-manual-dte-419e3eec`. No code
written by me - findings only.

### What the PR does
Adds a guard in the `create-run-group` handler so new (post-cutoff) non-enterprise workspaces
cannot run manual DTE. New helper `isManualDteAllowed(workspaceCreatedAt)` +
`MANUAL_DTE_ENTERPRISE_CUTOFF = 2026-06-05` in `CloudOrganization.kt`, and `isManual()` on
`DistributeOnInput`.

### Blocker surfaced
The guard `if (!isNxAgents && !isManualDteAllowed) -> 403 Forbidden` over-blocks two paths that
must keep working:

1. **`--no-distribution`** (inline CIPE run, no agents, GHA-style) is 403'd. It sends the same
   wire payload as manual DTE (`distributeOn: undefined`), so the server cannot distinguish them.
   The mode is decided purely client-side via the DTE marker file. Fix needs the CLI to send an
   explicit no-distribution signal.
2. **First run on a new unconnected workspace requesting `--distribute-on "<template>"`** (incl
   `.yaml`) is 403'd, because `isUnconnected` forces `isNxAgents=false` -> misclassified as manual
   DTE. The guard also runs before the `distributionRequested && isUnconnected` 202 claim flow, so
   it preempts onboarding. Fix: remove `!isUnconnected` from `isNxAgents` (safe - the claim branch
   intercepts that case before `isNxAgents` is used downstream).

Confirmed with Jack: blocking bare `start-ci-run` / `--distribute-on manual` (true manual DTE) is
intended. `--no-distribution` and Nx Agents (any template) must keep working.

Secondary: the 403 returns a raw string body but the CLI reads `e.response.data.message` (object),
so users would see a bare `Request failed with status code 403` with no explanation.

### Durable knowledge captured
Added "CI Run Group Creation / Distribution Mode Classification" to the ocean architecture file
(three distribution modes, wire payloads, and the manual-vs-no-distribution indistinguishability
gotcha).

## Notes / housekeeping
- `.ai` in this repo is a real directory (not the symlink my global setup expects). It holds the
  dated folders + architecture file. Did NOT run the global "fix" (which is `rm -rf .ai`).
