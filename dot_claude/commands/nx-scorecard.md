---
description: >
  Compute Nx CLI scorecard metrics for the current month. Fetches GitHub issues/PRs,
  Linear high-priority misc issues, and npm download data. Outputs a markdown table
  ready to paste into Notion.
allowed-tools:
  - Bash
  - WebFetch
  - mcp__Linear__list_issues
  - mcp__Linear__list_teams
---

# Nx CLI Scorecard

Compute all scorecard metrics for the **Nx CLI** team for the current month (or the month specified in $ARGUMENTS).

## Determine Target Month

- If $ARGUMENTS contains a month (e.g., "March", "2026-03", "Feb 2026"), use that month.
- Otherwise, use the current month based on today's date.
- Derive: `YEAR`, `MONTH_NUM` (zero-padded), `MONTH_NAME`, `FIRST_DAY` (YYYY-MM-01), `LAST_DAY` (YYYY-MM-last day of month).
- For partial months (current month not yet ended), use today's date as the end date for closed issues.

## Data Collection

Run these queries in parallel where possible:

### 1. GitHub Issues (nrwl/nx)

Use `gh` CLI for all GitHub queries. The repo is `nrwl/nx`.

**Open issues (snapshot):**
```bash
gh api "search/issues?q=repo:nrwl/nx+is:issue+state:open+created:2017-09-01..{LAST_DAY}&per_page=1" --jq '.total_count'
```

**Open high-priority issues (snapshot):**
```bash
gh api 'search/issues?q=repo:nrwl/nx+is:issue+state:open+created:2017-09-01..{LAST_DAY}+label:"priority: high"&per_page=1' --jq '.total_count'
```

**Closed issues (during target month):**
```bash
gh api "search/issues?q=repo:nrwl/nx+is:issue+state:closed+closed:{FIRST_DAY}..{LAST_DAY}&per_page=1" --jq '.total_count'
```

**Closed high-priority issues (during target month):**
```bash
gh api 'search/issues?q=repo:nrwl/nx+is:issue+state:closed+closed:{FIRST_DAY}..{LAST_DAY}+label:"priority: high"&per_page=1' --jq '.total_count'
```

### 2. GitHub PRs (nrwl/nx)

**Total open PRs (snapshot):**
```bash
gh api "search/issues?q=repo:nrwl/nx+is:pr+state:open&per_page=1" --jq '.total_count'
```

### 3. Linear High-Priority Misc Issues

These are Nx CLI team issues in the **"Miscellaneous" project OR no project**, with **Urgent** (priority=1) or **High** (priority=2) priority, in an active state (not Done/Cancelled).

**Strategy:** Query ALL open Nx CLI urgent+high issues, then filter in post-processing. This is more reliable than trying to query "no project" directly.

Run these 4 queries in parallel via `mcp__Linear__list_issues`:
1. `team: "Nx CLI", priority: 1, state: "started", limit: 250`
2. `team: "Nx CLI", priority: 2, state: "started", limit: 250`
3. `team: "Nx CLI", priority: 1, state: "unstarted", limit: 250`
4. `team: "Nx CLI", priority: 2, state: "unstarted", limit: 250`

Then from the combined results, **keep only** issues where:
- `project` is `"Miscellaneous"`, OR
- `project` is `null` / empty / missing

Deduplicate by issue `id` and count the total unique issues.

### 4. npm Downloads

Use the npm registry API to fetch monthly download counts:

**Current month downloads:**
```bash
curl -s "https://api.npmjs.org/downloads/point/{FIRST_DAY}:{LAST_DAY}/nx" | jq '.downloads'
```

**Same month last year (for YoY):**
```bash
curl -s "https://api.npmjs.org/downloads/point/{LAST_YEAR_FIRST_DAY}:{LAST_YEAR_LAST_DAY}/nx" | jq '.downloads'
```

**YoY Growth calculation:**
```
yoy = (downloads_this_month - downloads_same_month_last_year) / downloads_same_month_last_year * 100
```

Round to nearest whole percent. If the current month is incomplete, note that the YoY comparison is partial.

## Output Format

Print a clean markdown table with the results:

```markdown
## Nx CLI Scorecard — {MONTH_NAME} {YEAR}

| Metric | Value |
|--------|-------|
| Open issues | {count} |
| Open high-priority issues | {count} |
| Closed issues | {count} |
| Closed high-priority issues | {count} |
| Open Linear high-priority misc issues | {count} |
| Total PRs (open) | {count} |
| Total monthly downloads | {formatted, e.g. 36.0M} |
| YoY growth (monthly downloads) | {percent}% |
```

Format downloads in millions with one decimal (e.g., 33.2M, 36.0M).

If the month is not yet complete, add a note: `*Data as of {TODAY}. Month in progress.*`

## Important Notes

- GitHub search API has rate limits. If you hit a rate limit, wait and retry once.
- For the "open issues" snapshot: if running mid-month, use today's date as the upper bound instead of LAST_DAY.
- The creation date floor of 2017-09-01 filters out ancient issues from before the Nx repo was actively used.
- Do NOT include pull requests in issue counts (use `is:issue` in all issue queries).
