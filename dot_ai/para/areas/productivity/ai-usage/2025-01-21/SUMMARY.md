# AI Usage Stats Summary

**Date Collected:** 2025-01-21

## Overview

| Name | Tools | Days | Total Tokens | Tokens/Day | I+O Only* | I+O/Day* |
|------|-------|------|--------------|------------|-----------|----------|
| Ben | Cursor | 77 | 816.2m | 10.60m | 51.0m | **662k** |
| Mark | Cursor | 113 | 654.9m | 5.80m | 50.7m | **449k** |
| Leo | Cursor | 100 | 253.2m | 2.53m | 26.6m | **266k** |
| Rares | CC + Cursor | 76 | 275.5m | 3.63m | 19.9m | **262k** |
| Craigory | Claude Code | 69 | 11.1m | 161k | 11.1m | **161k** |
| James | CC + Cursor | 108 | 209.0m | 1.94m | 13.6m | **125k** |
| Dillon | Cursor | 112 | 146.8m | 1.31m | 11.9m | **106k** |
| Jack | Claude Code | 78 | 7.8m | 100k | 7.8m | **100k** |
| Colum | Claude Code | 72 | 7.2m | 100k | 7.2m | **100k** |
| Max | Claude Code | 73 | 6.9m | 95k | 6.9m | **95k** |
| Chau | CC + Open Code | 72 | 3.9m+ | 54k | 3.9m | **54k** |

**CC = Claude Code** | Sorted by I+O/Day

*\*I+O Only = Input + Output tokens, excluding cache reads. This is the apples-to-apples comparison metric since Claude Code doesn't count cache reads in its totals.*

## Rankings

### By Input+Output/Day (Apples-to-Apples - Primary Metric)
*Excludes cache reads for fair cross-tool comparison*

1. **Ben** - 662k/day (Cursor, 77 days)
2. **Mark** - 449k/day (Cursor, 113 days)
3. **Leo** - 266k/day (Cursor, 100 days)
4. **Rares** - 262k/day (CC + Cursor, 76 days)
5. **Craigory** - 161k/day (Claude Code, 69 days)
6. **James** - 125k/day (CC + Cursor, 108 days)
7. **Dillon** - 106k/day (Cursor, 112 days)
8. **Jack** - 100k/day (Claude Code, 78 days)
9. **Colum** - 100k/day (Claude Code, 72 days)
10. **Max** - 95k/day (Claude Code, 73 days)
11. **Chau** - 54k/day (CC + Open Code, 72 days)

### By Total Tokens (Raw - includes cache reads)
1. **Ben** - 816.2m (Cursor) - 91% cache
2. **Mark** - 654.9m (Cursor) - 91% cache
3. **Rares** - 275.5m (CC + Cursor) - 89% cache
4. **Leo** - 253.2m (Cursor) - 89% cache
5. **James** - 209.0m (CC + Cursor) - 94% cache
6. **Dillon** - 146.8m (Cursor) - 91% cache
7. **Craigory** - 11.1m (Claude Code)
8. **Jack** - 7.8m (Claude Code)
9. **Colum** - 7.2m (Claude Code)
10. **Max** - 6.9m (Claude Code)
11. **Chau** - 3.9m+ (CC + Open Code)

### By Claude Code Tokens/Day
1. **Craigory** - 161k/day (11.1m / 69 days)
2. **Jack** - 100k/day (7.8m / 78 days)
3. **Colum** - 100k/day (7.2m / 72 days)
4. **Max** - 95k/day (6.9m / 73 days)
5. **James** - 63k/day (4.4m / 70 days)
6. **Chau** - 54k/day (3.9m / 72 days)
7. **Rares** - 40k/day (2.2m / 55 days)

### By Cursor Input+Output/Day (excluding cache)
1. **Ben** - 662k/day (51.0m I+O / 77 days)
2. **Mark** - 449k/day (50.7m I+O / 113 days)
3. **Leo** - 266k/day (26.6m I+O / 100 days)
4. **Rares** - 233k/day (17.7m I+O / 76 days)
5. **Dillon** - 106k/day (11.9m I+O / 112 days)
6. **James** - 85k/day (9.2m I+O / 108 days)

### By Cursor Requests
1. **Ben** - 9,081 requests
2. **James** - 5,095 requests
3. **Mark** - 1,914 requests
4. **Leo** - 940 requests
5. **Rares** - 740 requests
6. **Dillon** - 435 requests

### By Claude Code Activity Rate
1. **Craigory** - 76.8%
2. **Chau** - 66.7%
3. **James** - 58.6%
4. **Jack** - 56.4%
5. **Colum** - 54.2%
6. **Max** - 52.1%
7. **Rares** - 47.3%

## Tool Breakdown

### Claude Code (7 users)
- **Users:** Chau, Colum, Craigory, Jack, James, Max, Rares
- **Total tokens:** ~43.5m
- **Model preference:** 5 Opus, 2 Sonnet
- **Avg activity rate:** 58.9%

### Cursor (6 users)
- **Users:** Ben, Dillon, James, Leo, Mark, Rares
- **Total tokens:** ~2.35 billion
- **Total requests:** 18,205
- **Popular models:** claude-4.5-sonnet-thinking, claude-4.5-opus-high-thinking, auto

### Open Code (1 user)
- **Users:** Chau
- **Sessions (7 days):** 206
- **Top tools:** read (36%), edit (18%), bash (17%)

### Multi-Tool Users
| User | Tools |
|------|-------|
| James | Claude Code + Cursor |
| Rares | Claude Code + Cursor |
| Chau | Claude Code + Open Code |

## Cursor Model Popularity

| Model | Users | Total Requests |
|-------|-------|----------------|
| claude-4.5-sonnet-thinking | 5 | 1,851 |
| claude-4.5-opus-high-thinking | 5 | 1,050 |
| auto | 6 | 391 |
| gpt-5.1-codex | 2 | 174 |
| claude-4.5-sonnet | 4 | 235 |
| gpt-5-codex | 2 | 99 |
| gpt-5 | 4 | 75 |

## Interesting Insights

### Cursor vs Claude Code - Apples-to-Apples
When comparing **Input+Output only** (excluding cache reads):
- **Cursor avg:** ~300k tokens/day
- **Claude Code avg:** ~87k tokens/day
- **Ratio:** 3.4x (NOT 50-100x as raw totals suggest)

The ~90% cache read overhead in Cursor inflates raw totals but doesn't represent actual new work.

### Why Cache Reads Are So High
Cursor's prompt caching stores context (system prompts, file contents, conversation history) so it doesn't need to reprocess on every request. This is a **cost optimization**, not overhead - cache reads are cheaper than fresh input.

### Power Users (by I+O/Day)
- **Ben** - 662k/day (#1 overall)
- **Mark** - 449k/day (#2 overall)
- **Craigory** - 161k/day (#1 Claude Code, #5 overall)

### Most Consistent (Active Days / Tracking Days)
- **Craigory** - 76.8% activity rate (53/69 days)
- **Chau** - 66.7% activity rate (48/72 days)

### Model Preferences
- **Cursor:** claude-4.5-sonnet-thinking dominates (thinking models popular)
- **Claude Code:** Opus 4.5 (5 users) vs Sonnet 4.5 (2 users)

## Data Sources

| Source | Period | Users Covered |
|--------|--------|---------------|
| Claude Code `/stats` screenshots | All time | 7 |
| Open Code `stats --days 7` | 7 days | 1 |
| Cursor local stats script | Since May 2025 | 1 (Mark) |
| Team Cursor CSV export | Oct 2025 - Jan 2026 | 6 |

## Missing Data

The following team members have not yet submitted usage stats:

- Jon (data missing for some reason)
- Altan
- Jason
- Nicole
- Patrick
- Steve
- Szymon

## Data Files

- Individual stats: `{name}.md` (18 files)
- Structured data: `ai-usage-stats.json`
- Screenshots: `{name}_{tool}.png`
- Team CSV: `team-usage-events-8886457-2026-01-22.csv`
