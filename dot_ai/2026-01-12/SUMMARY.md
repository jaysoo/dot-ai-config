# Summary - 2026-01-12

## Completed

### SPACE Metrics Standalone Project

Created a new focused metrics collection repo at `tmp/space-metrics/` with clean separation of raw data and calculated metrics.

**Key Features:**
- **JSON-only output** - No CSV, all data in JSON format
- **Raw data storage** - All API responses saved for manual verification
- **TTM only** - Removed TTFR (Time to First Review), kept Time to Merge
- **Full Linear context** - Issues include state, labels, assignee for debugging
- **Modular design** - Separate collectors and calculators

**Files Created (14 total):**
```
tmp/space-metrics/
├── collect.mjs           # Main CLI entry point
├── config.mjs            # Repos, teams, members, bots
├── package.json
├── README.md
├── src/
│   ├── collectors/
│   │   ├── github-prs.mjs
│   │   ├── github-commits.mjs
│   │   └── linear-issues.mjs
│   ├── calculators/
│   │   ├── pr-metrics.mjs
│   │   ├── review-metrics.mjs
│   │   ├── linear-metrics.mjs
│   │   └── aggregations.mjs
│   └── utils/
│       ├── api.mjs
│       ├── stats.mjs
│       └── cache.mjs
└── data/
    ├── raw/              # Raw API responses
    └── calculated/       # Monthly/quarterly/annual
```

**Data Structure:**
- Raw GitHub PRs: `data/raw/github/prs/{repo}-{year}-{month}.json`
- Raw Linear issues: `data/raw/linear/completed/{team}-{year}-{month}.json`
- Calculated: `data/calculated/monthly/{year}-{month}.json`

**Usage:**
```bash
node collect.mjs --year=2025           # Full collection
node collect.mjs --year=2025 --month=6 # Single month
node collect.mjs --year=2025 --force   # Re-fetch all
```

**1Password Integration:**
Updated to use single "API Keys" item with `github_token` and `linear_api_Key` fields:
```bash
op read 'op://Employee/API Keys/github_token'
op read 'op://Employee/API Keys/linear_api_Key'
```

## Related Files

- Plan: `/Users/jack/.claude/plans/squishy-foraging-beaver.md`
- Project: `tmp/space-metrics/`
