# Summary - 2026-01-07

## GitHub Issue #34010: Fix replaceOverride for Variable References

Fixed `replaceOverride` function in `packages/eslint/src/generators/utils/flat-config/ast-utils.ts` to handle ESLint flat configs with variable references (e.g., `plugins: { 'abc': abc }`).

### Problem

When a migration tried to update an ESLint flat config override that contained variable references in its properties, the entire override would be replaced with a serialized version, destroying the variable references.

### Solution

Implemented property-level AST updates instead of whole-object replacement:

1. **`extractPropertiesFromObjectLiteral`**: AST-based extraction that handles variable references by returning `undefined` for non-extractable values
2. **`findChangedProperties`**: Compares original vs updated to detect which properties changed (added, modified, or removed)
3. **`findPropertyNode`**: Locates specific property nodes in the AST for surgical updates
4. **`serializeValue`**: Converts values back to JavaScript source with proper parser handling

Key insight: Update functions (like `delete o.rules[rule]`) mutate the data object in place. Used `structuredClone(data)` before calling update to preserve original state for comparison.

### Files Changed

- `packages/eslint/src/generators/utils/flat-config/ast-utils.ts` - Core fix
- `packages/eslint/src/generators/utils/flat-config/ast-utils.spec.ts` - New tests for variable reference handling

### Tests

- 36 eslint ast-utils tests ✓
- 12 remove-angular-eslint-rules migration tests ✓
- 10 disable-angular-eslint-prefer-standalone migration tests ✓

---

## 1:1 with Jason Jean

Discussed Maven plugin paywall pushback, strategic concerns about revenue approach, and team priorities. Key takeaways:

- Strong internal opposition to gating Maven plugin (Colum, James, general team)
- Concern about arbitrary gating vs. strategic paid feature pipeline
- Jason focusing energy on revenue-generating features (CPU tracking, I/O tracing)
- Jack to discuss Maven decision with Victor for clarity on revenue path
- Zach's CLI/Nx livestream for 22.3 features - Jason attending instead of Jack

---

## Productivity Baseline Collection Script Fix

Fixed critical issue where the `collect-productivity-baselines.mjs` script was returning 0 PRs for all repositories.

### Root Cause Analysis

1. **GraphQL Node Limit Exceeded**: The `commits` field in `gh pr list --json` was causing GitHub's GraphQL API to traverse up to 1,000,000 nodes (1000 PRs x commits x authors), exceeding the 500,000 node limit.

2. **API Rate Limiting**: Without authentication, GitHub API requests were being rate limited, causing HTTP 502 errors.

### Changes Made

**`collect-productivity-baselines.mjs`**:
- Removed `commits` field from `gh pr list` query to avoid GraphQL node explosion
- Added `ensureGitHubToken()` function to fetch GitHub token from 1Password
- Added retry logic with exponential backoff for transient API errors (502/503)
- Removed `totalCommits` calculation from `calculatePRStats()`

**`generate-productivity-report.mjs`**:
- Removed commits chart HTML generation
- Removed commits chart JavaScript code

**`data/README.md`**:
- Updated SPACE Framework table to remove commits from Activity dimension
- Updated PR Metrics JSON example to remove commits field
- Updated Key Metrics table to remove commits
- Updated regeneration instructions to include `GITHUB_TOKEN` from 1Password:
  ```bash
  /bin/bash -c 'export GITHUB_TOKEN="$(op read "op://Employee/GitHub Token/credential")" && export LINEAR_API_KEY="$(op read "op://Employee/Linear Key/credential")" && node collect-productivity-baselines.mjs --year=2025 --json'
  ```

### Outcome

Script now successfully collects PR metrics from all three repositories (nx, ocean, cloud-infrastructure) along with Linear issue metrics.

---

## Monthly Data Caching

Added per-month caching to the productivity baseline script to improve performance and resilience.

### Changes Made

**`collect-productivity-baselines.mjs`**:
- Added `--force` flag to re-fetch all months (ignoring cache)
- Added `isMonthComplete()`, `loadMonthCache()`, and `saveMonthCache()` utility functions
- Modified collection loop to:
  - Load completed months from cache (`data/months/YYYY-MM.json`)
  - Always re-fetch current month (still accumulating data)
  - Save each month's data to cache after collection
- Added cache usage summary in output

**`data/README.md`**:
- Documented new `months/` directory structure
- Added "Caching" section explaining benefits and usage

### Benefits

- **Fast re-runs**: Completed months load from cache (~1s vs ~30s/month)
- **Incremental updates**: Only current month is re-fetched
- **Resilient**: Failed runs preserve already-collected months
- **Manual refresh**: Delete specific month file to re-fetch just that month

---

## Work Composition Metrics

Added new "Work Composition" metrics to the productivity report to track planning effectiveness and reactive work.

### New Metrics

| Metric | Formula | Description |
|--------|---------|-------------|
| **Planned Work %** | `planned ÷ completed` | % of completed issues that had a project assigned |
| **Unplanned Work** | Issues created without project | Count of issues created each month without a project |
| **Firefighting %** | `urgentHigh ÷ unplanned` | % of unplanned work that's urgent or high priority |

### Changes Made

**`collect-productivity-baselines.mjs`**:
- Added `getCreatedIssues()` function to fetch issues by `createdAt` date range (for unplanned work metrics)
- Updated Linear data collection to include:
  - `created.total`, `created.withProject`, `created.withoutProject`, `created.urgentHigh`
  - `planningAccuracy` (now called "Planned Work %")
  - `firefightingPct`

**`generate-productivity-report.mjs`**:
- Added data extraction for new metrics (`planningAccuracyByTeam`, `unplannedWorkByTeam`, `firefightingPctByTeam`)
- Added new insights section for Planning, Unplanned Work, and Firefighting metrics
- Added HTML "Metric Definitions" table with light theme styling
- Added three new charts in a responsive 3-column grid:
  - Planned Work % (line chart with 70% threshold)
  - Unplanned Work Created (bar chart)
  - Firefighting Rate (line chart with 20% threshold)
- Added CSS for `.charts-grid.three-col` responsive layout

### Terminology Clarification

Changed from "Planning Accuracy" to "Planned Work %" because:
- It's not measuring accuracy vs a target
- It simply shows what percentage of completed work was roadmap/project work
- Example: 72% = 72 of 100 completed issues were assigned to a project

### Regeneration Commands

```bash
# Collect new metrics
/bin/bash -c 'export GITHUB_TOKEN="$(op read "op://Employee/GitHub Token/credential")" && export LINEAR_API_KEY="$(op read "op://Employee/Linear Key/credential")" && node collect-productivity-baselines.mjs --year=2025 --force --json'

# Generate report
node generate-productivity-report.mjs --year=2025
```

---

## YoY Analysis Script

Created `analyze-yoy.mjs` to compare 2024 vs 2025 productivity data, assessing impact of:
- AI tooling adoption (June 2025)
- Layoffs (mid-August 2025)

### Key Findings

- CLI team velocity increased post-AI and post-layoff periods
- Per-dev productivity increased 254% after layoffs
- AI tooling showed positive impact on cycle times

---

## Team Timeline Notes

- **Red Panda team**: Ramped up April-May 2025, reached full velocity July 2025
- **Szymon**: Join date not found in personnel files
