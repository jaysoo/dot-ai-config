# Review ocean PR #12720

PR: https://github.com/nrwl/ocean/pull/12720

## Goal

Review the restarted-agent attempt implementation for correctness, regressions, and test coverage. Report findings inline. Do not post GitHub comments or approvals without explicit confirmation.

## Scope

- Attempt/lifecycle derivation and workflow-step matching
- Agent billing and utilization attribution
- Timeline rendering, selection state, drawer filtering, and logs
- Fixtures and regression tests across the affected Nx Cloud libraries

## Steps

### 1. Inspect the implementation

- [x] Cancel Plannotator at the user's request
- [x] Inspect the complete diff and record only actionable findings
- [x] Run targeted verification where practical

### 2. Complete the review handoff

- [x] Report findings inline without posting externally

## Progress

Keep this section updated while executing the task.

- 2026-08-05: Read the complete PR description and file list at commit `b44e3fe7a64fd17dfe4276e83c052f0702906fbb`.
- 2026-08-05: Plannotator fetched the PR into an isolated checkout and opened the interactive review; awaiting the browser result.
- 2026-08-05: User requested skipping Plannotator; canceled the session and switched to an inline review.
- 2026-08-05: Found four actionable issues: synthetic attempt ends inflate launch duration; billing collapses multiple templates into one rate; command runs spanning a restart disappear from later attempts; idle-tail billing includes unbilled restart gaps.
- 2026-08-05: Targeted model tests passed (27), billing-server tests passed (9), and billing-panel tests passed (6). Drawer tests could not be validated from the isolated checkout because its linked dependencies resolved the base branch's model package. The PR's main CI gate is green; Chromatic review remains pending.

## Expected outcome

An actionable inline review of PR #12720, with no GitHub mutation.
