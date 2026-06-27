# Review PR 12084

Date: 2026-06-25
PR: https://github.com/nrwl/ocean/pull/12084

## Goal

Review PR #12084 for correctness, regressions, missing tests, and actionable feedback.

## Step 1: Gather PR context

Reasoning: read the full PR description and changed files before judging the implementation.

TODO:
- [x] Fetch PR metadata and diff
- [x] Identify changed projects and affected behavior

## Step 2: Review implementation

Reasoning: prioritize bugs, behavioral regressions, risky state changes, settings persistence rules, and missing coverage.

TODO:
- [x] Inspect modified files in context
- [x] Check related tests and existing patterns
- [x] Verify any shared-setting UI follows staged-save requirements

Findings:
- Developer time saved sends Rewind's exclusive period end date to the inclusive `/time-to-green` endpoint, so the headline can include the first day of the next period and today's incomplete day.
- `hasActivity` treats contributor count alone as enough signal, so no-cache / no-feature periods can render a zero-value card instead of the setup-docs empty state.
- Task distribution detection sums cumulative `billing.workspaceCreditUsage` rows as if they were daily deltas, causing false positives.

## Step 3: Produce review feedback

Reasoning: use Plannotator for review comments so feedback can be applied in the PR UI.

TODO:
- [x] Run Plannotator review for the PR
- [x] Summarize outcome concisely in chat

Note: Plannotator could not open because local `gh` is unauthenticated, so the review used the GitHub connector plus a fetched temporary worktree.

## Tracking

Keep track of review status and findings in this plan doc while working.

## Expected Outcome

PR #12084 has concrete review feedback with residual risks and verification noted.
