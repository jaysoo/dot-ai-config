# Summary — 2026-03-18

## Lighthouse

### SPACE Metrics: Exclude draft time from TTM calculation

TTM (Time to Merge) was previously measured from `created_at` to `merged_at`, which inflated the metric for PRs that spent time in draft state. Investigated GitHub GraphQL API options:

- `publishedAt` field is useless — always equals `createdAt` regardless of draft status
- `ReadyForReviewEvent` in `timelineItems` is the correct signal

Tested locally with `gh api graphql` against `nrwl/nx`. Found ~18% of recent merged PRs were opened as drafts. Some had significant draft time (e.g., #34813: 96.6h draft, TTM drops from 102.4h to 5.8h).

**Changes:**
- Added `ready_at` nullable column via migration
- Added `timelineItems(itemTypes: [READY_FOR_REVIEW_EVENT])` to existing GraphQL query (no extra API calls)
- `calculate_ttm/1` now uses `ready_at || created_at` as start time
- All 942 tests pass

**PR:** https://github.com/nrwl/lighthouse/pull/48
**Branch:** `space_exclude_pr_drafts`

Cleared all 4,318 GitHub PR records from local DB so data can be refetched with the new `ready_at` field populated.

## Nx Platform

### March 2026 Cross-Functional Digest

Generated monthly digest covering Nx 22.6.0 release, task sandboxing, AI-powered development, surface-level telemetry, and 6 active enterprise PoVs.
- Files: `.ai/2026-03-18/tasks/nx-digest-2026-03-crossfunctional.md`, `.ai/2026-03-18/tasks/nx-digest-2026-03-changelog.md`

### CNW: Docs — Switch preset commands to template commands

Identified docs pages still using legacy `--preset=` syntax where `--template=` is the modern equivalent. Reduces users hitting the longer preset prompt flow (25% drop-off).
- Files: `.ai/2026-03-18/tasks/cnw-docs-switch-to-templates.md`

### CNW: gh CLI timeout issue

Identified that `isGhCliAvailable()` uses `execSync('gh --version')` with no timeout, potentially causing indefinite hangs before `precreate` telemetry fires. Proposed fix: add 3s timeout and move check after precreate.
- Files: `.ai/2026-03-18/tasks/cnw-gh-cli-timeout.md`
