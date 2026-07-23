# Review ocean PR #12477

## Goal

Review https://github.com/nrwl/ocean/pull/12477 for correctness risks hidden by the large UI/test diff, dead code, and maintainability problems. Deliver actionable findings through Plannotator.

## Step 1: Establish scope and intent

- [x] Read the full PR description and commit metadata.
- [x] Inventory changed files and identify high-impact seams.
- [x] Fetch the exact head commit locally without changing the current branch.

## Step 2: Review semantic changes

- [x] Inspect loaders, route contracts, queries, and shared settings utilities first.
- [x] Trace every new/removed field and destination through producers and consumers.
- [x] Inspect UI/navigation changes for incorrect active state, broken destinations, feature-flag leakage, and legacy-layout regressions.
- [x] Search for dead exports, obsolete branches, duplicated logic, and misleading tests.

## Step 3: Verify findings

- [x] Compare suspicious changes with surrounding source and existing call sites.
- [x] Run the smallest relevant tests/static checks where they materially validate a finding.
- [x] Separate blocking defects from non-blocking smells.

## Step 4: Deliver review

- [x] Open the PR review in Plannotator with file/line-specific findings.
- [x] Record the final outcome here and move this task from `TODO.md` to `para/archive/COMPLETED.md`.

## Tracking

- Confirmed legacy-layout regression: `RunViewHandle` forwards the outer `nextItemHasLeadingDivider` into nested organization/workspace crumbs. On task-detail routes this suppresses the internal separators before the final outer divider.
- Confirmed failing e2e/coverage mismatch: the sidebar scenario was changed from TEAM to ENTERPRISE while it still asserts the Conformance upgrade fallback. Removing those assertions would also remove the intended non-Enterprise coverage; preserve it in a separate TEAM scenario.
- Non-blocking: the workspace parent loader now performs two PostHog feature-flag evaluations for every admin workspace request, contrary to the PR's stated intent to avoid flag work on every request.
- Non-blocking dead code: `RailSubRow.label` and its rendering branch have no production callers after `subNavigationLabel` was removed; only the unit test exercises them.
- Current CI has one failed e2e task matching the sidebar plan mismatch. Other reported formatting, sync, typecheck, lint, and unit-test checks passed.
- Gemini review was attempted per repository instructions but unavailable because the installed CLI account is ineligible and its sandbox could not persist OAuth credentials.

## Expected outcome

A concise, evidence-backed review of PR #12477 with critical buried changes surfaced first, plus any dead code or maintainability concerns worth acting on.
