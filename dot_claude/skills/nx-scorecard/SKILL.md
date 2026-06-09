---
name: nx-scorecard
description: >
  Compute Nx CLI scorecard metrics for a month: GitHub issues/PRs (nrwl/nx),
  Linear high-priority misc issues, and npm download counts with YoY growth.
  Outputs a Notion-ready markdown table. Use when user says "scorecard",
  "nx scorecard", "cli scorecard", "monthly scorecard", or asks for the Nx CLI
  team's monthly issue/PR/download metrics.
allowed-tools:
  - Bash
  - WebFetch
  - mcp__linear-server__list_issues
  - mcp__linear-server__list_teams
---

# Nx CLI Scorecard

Compute all scorecard metrics for the **Nx CLI** team for the current month (or the month specified in the user's request / `$ARGUMENTS`).

## Determine Target Month

- If the request contains a month (e.g., "March", "2026-03", "Feb 2026"), use that month.
- Otherwise, use the current month based on today's date.
- Derive: `YEAR`, `MONTH_NUM` (zero-padded), `MONTH_NAME`, `FIRST_DAY` (YYYY-MM-01), `LAST_DAY` (YYYY-MM-last day of month).
- For partial months (current month not yet ended), use today's date as the end date for closed issues.

## GitHub Auth (no `gh` CLI)

The `gh` CLI is banned on this machine. Use `curl` against `https://api.github.com` with a bearer token.

Get the token from 1Password (invoke the `op-request-reason` skill first, since `op` triggers a 1P prompt):

```bash
export GITHUB_TOKEN="$(op read 'op://Employee/API Keys/github_token')"
```

Reusable curl helper for the GitHub search API (returns `total_count`):

```bash
gh_count() {  # $1 = url-encoded q value
  curl -sS --fail \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "https://api.github.com/search/issues?q=$1&per_page=1" | jq '.total_count'
}
```

GitHub's search `q` must be URL-encoded (spaces -> `+` is fine in a query, but `:` and quotes in label filters need encoding). Build each query string and pass it to `gh_count`.

## Data Collection

Run queries in parallel where possible.

### 1. GitHub Issues (nrwl/nx)

All use `is:issue`. Replace `{FIRST_DAY}`/`{LAST_DAY}` with the target month bounds.

- **Open issues (snapshot):** `repo:nrwl/nx is:issue state:open created:2017-09-01..{LAST_DAY}`
- **Open issues created this month:** `repo:nrwl/nx is:issue state:open created:{FIRST_DAY}..{LAST_DAY}`
- **Open high-priority (snapshot):** `repo:nrwl/nx is:issue state:open created:2017-09-01..{LAST_DAY} label:"priority: high"`
- **Open high-priority created this month:** `repo:nrwl/nx is:issue state:open created:{FIRST_DAY}..{LAST_DAY} label:"priority: high"`
- **Closed issues (during month):** `repo:nrwl/nx is:issue state:closed closed:{FIRST_DAY}..{LAST_DAY}`
- **Closed high-priority (during month):** `repo:nrwl/nx is:issue state:closed closed:{FIRST_DAY}..{LAST_DAY} label:"priority: high"`

### 2. GitHub PRs (nrwl/nx)

Count only **non-draft** PRs (`draft:false`).

- **Open non-draft PRs (snapshot):** `repo:nrwl/nx is:pr state:open draft:false`
- **Open non-draft PRs created this month:** `repo:nrwl/nx is:pr state:open draft:false created:{FIRST_DAY}..{LAST_DAY}`

### 3. Linear High-Priority Misc Issues

Nx CLI team issues in the **"Miscellaneous" project OR no project**, with **Urgent** (priority=1) or **High** (priority=2) priority, in an active state (not Done/Cancelled).

**Strategy:** Query ALL open Nx CLI urgent+high issues, then filter in post-processing. More reliable than querying "no project" directly.

Confirm the team first (`mcp__linear-server__list_teams` -> "Nx CLI"). Then run these 4 queries in parallel via `mcp__linear-server__list_issues`:
1. `team: "Nx CLI", priority: 1, state: "started", limit: 250`
2. `team: "Nx CLI", priority: 2, state: "started", limit: 250`
3. `team: "Nx CLI", priority: 1, state: "unstarted", limit: 250`
4. `team: "Nx CLI", priority: 2, state: "unstarted", limit: 250`

From the combined results, **keep only** issues where `project` is `"Miscellaneous"` OR `project` is null/empty/missing. Deduplicate by issue `id` and count unique issues.

### 4. npm Downloads

```bash
# Current month
curl -s "https://api.npmjs.org/downloads/point/{FIRST_DAY}:{LAST_DAY}/nx" | jq '.downloads'
# Same month last year (YoY)
curl -s "https://api.npmjs.org/downloads/point/{LAST_YEAR_FIRST_DAY}:{LAST_YEAR_LAST_DAY}/nx" | jq '.downloads'
```

**YoY growth:** `(this_month - same_month_last_year) / same_month_last_year * 100`, rounded to nearest whole percent. If the current month is incomplete, note the YoY comparison is partial.

## Output Format

```markdown
## Nx CLI Scorecard — {MONTH_NAME} {YEAR}

| Metric | Value |
|--------|-------|
| Open issues | {total} ({this_month} this month) |
| Open high-priority issues | {total} ({this_month} this month) |
| Closed issues | {count} |
| Closed high-priority issues | {count} |
| Open Linear high-priority misc issues | {count} |
| Non-draft PRs (open) | {total} ({this_month} this month) |
| Total monthly downloads | {formatted, e.g. 36.0M} |
| YoY growth (monthly downloads) | {percent}% |
```

Format downloads in millions with one decimal (e.g., 33.2M, 36.0M).

If the month is not yet complete, add a note: `*Data as of {TODAY}. Month in progress.*`

## Important Notes

- GitHub search API has rate limits. On a rate-limit response, wait and retry once.
- "Open issues" snapshot: if running mid-month, use today's date as the upper bound instead of LAST_DAY.
- The creation floor `2017-09-01` filters out ancient pre-active issues.
- Do NOT include PRs in issue counts (`is:issue` in all issue queries).
