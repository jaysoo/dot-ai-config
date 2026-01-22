# Daily Summary - 2026-01-21

## Tasks Completed

### DOC-382: Update Releases Page for Nx 22 Details

**Linear**: https://linear.app/nxdev/issue/DOC-382
**Status**: Completed

Updated the releases page to reflect Nx 22 as the current version:

- **Supported Versions table updated**:
  - v22 → Current (released 2025-10-22)
  - v21 → LTS (released 2025-05-05)
  - v20 → LTS (released 2024-10-06)
  - Removed expired versions: v19, v18*, v17

- **Updated examples to use current versions**:
  - Version lockstep example: `nx@22.2.0` / `@nx/js@22.2.0`
  - Deprecation policy example: v21.1.0 → removed in v23.0.0

**Files Changed**:
- `astro-docs/src/content/docs/reference/releases.mdoc`

---

### AI Usage Stats Baseline Collection

**Status**: Completed
**Location**: `dot_ai/para/areas/productivity/ai-usage/2025-01-21/`

Collected and analyzed AI tool usage statistics for the engineering team to establish baseline for the AI Amplification Index metric.

**Data Collected**:
- 11 team members with data (7 pending)
- 3 tools tracked: Claude Code, Cursor, Open Code
- Sources: `/stats` screenshots, team CSV export, local stats scripts

**Key Outputs**:
- `SUMMARY.md` - Rankings and comparison tables
- `ai-usage-stats.json` - Structured data with normalized metrics
- `README.md` - Detailed methodology documentation
- 18 individual markdown files (11 with data, 7 placeholders)

**Key Metrics Established**:
- **I+O/Day** (Input+Output per Day) - Primary apples-to-apples comparison metric
- Excludes cache reads for fair cross-tool comparison
- Cursor ~90% cache reads inflate raw totals

**Rankings by I+O/Day**:
1. Ben - 662k/day (Cursor)
2. Mark - 449k/day (Cursor)
3. Leo - 266k/day (Cursor)
4. Rares - 262k/day (CC + Cursor)
5. Craigory - 161k/day (Claude Code, #1 CC)

**Key Finding**: Cursor vs Claude Code is 3.4x ratio (not 50-100x) when comparing apples-to-apples.

**Collection Schedule**: Every 30 days (next: 2025-02-21)

**Files Changed**:
- `dot_ai/para/areas/productivity/ai-usage/2025-01-21/` (20 files)
- `dot_ai/para/areas/productivity/README.md` (added AI usage tracking section)

---

## Notes

- AI usage baseline now complete - can calculate AI Amplification Index (tokens/PR)
- Established 30-day collection cadence for trend tracking
- Updated productivity README with links to AI usage data
