# AI Usage Stats - 2025-01-21

This folder contains AI coding tool usage statistics collected from the team on January 21, 2025.

## Quick Links

- [SUMMARY.md](./SUMMARY.md) - Comparison tables, rankings, and insights
- [ai-usage-stats.json](./ai-usage-stats.json) - Structured data for programmatic access

---

## Data Collection Methodology

### Sources

| Source | Tool | Data Type | Period |
|--------|------|-----------|--------|
| `/stats` screenshots | Claude Code | Tokens, sessions, streaks | All time |
| `stats --days 7` output | Open Code | Tokens, tool usage | 7 days |
| Team CSV export | Cursor | Tokens by type, model usage | Oct 2025 - Jan 2026 |
| Local stats script | Cursor | Lines of code metrics | Since May 2025 |

### How to Collect Stats

**Claude Code:**
```bash
claude "/stats"
# Screenshot the overview tab (shows "All time" stats)
# Save as {yourname}_claudecode.png
```

**Cursor (Token Usage):**
- Admin exports team CSV from Cursor dashboard
- File: `team-usage-events-{org-id}-{date}.csv`
- Contains: timestamps, user, model, token breakdown per request

**Cursor (Lines of Code):**
- Run [cursor-stats script](https://gist.github.com/jaysoo/bc22340ce3178b95f8d243e04ae0c192)
- Or: Settings > AI Usage Statistics > Screenshot

**Open Code:**
```bash
opencode stats --days 7
# Screenshot the output
# Save as {yourname}_opencode.png
```

---

## Calculation Methodology

### Primary Metric: I+O/Day (Input+Output per Day)

This is the **apples-to-apples comparison metric** across all tools.

**Why this metric?**
- Cursor reports ~90% of "total tokens" as cache reads
- Cache reads are a cost optimization (cheaper than re-processing), not actual work
- Claude Code `/stats` does NOT include cache reads in its totals
- Comparing raw totals is misleading (50-100x difference vs actual 3.4x)

**Calculation:**

```
I+O/Day = (Input Tokens + Output Tokens) / Tracking Days
```

| Tool | Formula |
|------|---------|
| Claude Code | `totalTokens / trackingDays` (no cache overhead) |
| Cursor | `(inputWithCache + output - cacheRead) / trackingDays` |
| Open Code | `(inputTokens + outputTokens) / trackingDays` |

**Example (Ben - Cursor):**
```
Total Tokens:     816.2m
Cache Read:       740.6m  (90.7%)
Input (w/ cache): 45.1m
Output:           5.9m
I+O Total:        51.0m   (816.2m - 740.6m - cache write overhead)
Tracking Days:    77
I+O/Day:          662k    (51.0m / 77)
```

### Tracking Days Calculation

**Claude Code:** Extracted from "Active Days" field (format: `X/Y` where Y = tracking days)

**Cursor:** Calculated from CSV date range
```
trackingDays = (lastDate - firstDate) + 1
```

**Open Code:** Fixed 7-day sample period

### Activity Rate

```
Activity Rate = Active Days / Tracking Days
```

Only calculated for Claude Code users (Open Code sample too short, Cursor CSV doesn't track daily activity).

### Cache Read Percentage

```
Cache % = Cache Read Tokens / Total Tokens * 100
```

Indicates how much of reported "usage" is actually prompt caching. Higher % = more cache utilization (good for cost, but inflates raw totals).

---

## Metrics Reference

### Claude Code

| Metric | Source | Description |
|--------|--------|-------------|
| Total Tokens | Screenshot | Input + output tokens (no cache) |
| Sessions | Screenshot | Coding sessions started |
| Active Days | Screenshot | Days with usage (X/Y format) |
| Activity Rate | Calculated | Active / tracking days |
| Favorite Model | Screenshot | Most-used model |
| Longest Session | Screenshot | Max session duration |
| Streaks | Screenshot | Consecutive usage days |

### Cursor

**Token Metrics (from team CSV):**

| Metric | CSV Column | Description |
|--------|------------|-------------|
| Input (w/ cache) | `input_tokens` | Input including cache writes |
| Input (w/o cache) | `input_tokens_without_cache_write` | Fresh input only |
| Cache Read | `cache_read` | Tokens from prompt cache |
| Output | `output_tokens` | Generated tokens |
| Total | Sum of above | All token types |

**Lines of Code (from local script):**

| Metric | Description |
|--------|-------------|
| Tab Autocomplete | Inline completions (Tab to accept) |
| Composer/Chat | Code from chat interface |
| Suggested | Lines AI proposed |
| Accepted | Lines user kept |
| Acceptance Rate | Accepted / Suggested |

### Open Code

| Metric | Description |
|--------|-------------|
| Sessions | Coding sessions |
| Messages | Total exchanges |
| Input/Output Tokens | Token breakdown |
| Cache Read/Write | Prompt caching |
| Tool Usage % | Which tools AI used (read, edit, bash, etc.) |

---

## File Structure

```
2025-01-21/
├── README.md                    # This file (methodology)
├── SUMMARY.md                   # Rankings and insights
├── ai-usage-stats.json          # Structured data
├── {name}.md                    # Individual stats (11 with data, 7 placeholders)
├── {name}_{tool}.png            # Source screenshots
└── team-usage-events-*.csv      # Cursor team export
```

## Team Coverage

| Status | Count | Names |
|--------|-------|-------|
| Data collected | 11 | Ben, Chau, Colum, Craigory, Dillon, Jack, James, Leo, Mark, Max, Rares |
| Pending | 7 | Altan, Jason, Jon, Nicole, Patrick, Steve, Szymon |

---

## Collection Schedule

**Frequency: Every 30 days**

Collect stats on or around the 21st of each month to track trends over time.

| Collection | Folder | Status |
|------------|--------|--------|
| 2025-01-21 | `ai-usage/2025-01-21/` | Complete |
| 2025-02-21 | `ai-usage/2025-02-21/` | Scheduled |
| 2025-03-21 | `ai-usage/2025-03-21/` | Scheduled |

### Trend Analysis

After multiple collections, compare JSON files:

```javascript
const jan = require('./2025-01-21/ai-usage-stats.json');
const feb = require('./2025-02-21/ai-usage-stats.json');

// Compare I+O/Day growth
const jackGrowth = feb.normalizedMetrics.jack.inputOutputPerDay
                 / jan.normalizedMetrics.jack.inputOutputPerDay;
console.log(`Jack's I+O/Day growth: ${((jackGrowth - 1) * 100).toFixed(1)}%`);
```

---

## Using the JSON Data

```javascript
const data = require('./ai-usage-stats.json');

// Get I+O/Day rankings (apples-to-apples)
const rankings = Object.entries(data.normalizedMetrics)
  .filter(([k]) => !k.startsWith('_'))
  .sort((a, b) => b[1].inputOutputPerDay - a[1].inputOutputPerDay)
  .map(([name, m]) => `${name}: ${(m.inputOutputPerDay/1000).toFixed(0)}k/day`);

// Get Claude Code users
const ccUsers = data.toolBreakdown.claudeCode.users;

// Get specific user's normalized metrics
const benMetrics = data.normalizedMetrics.ben;
// { totalTokensPerDay: 10600000, inputOutputPerDay: 662000, cacheReadPercent: 90.7 }
```

---

## Key Insights

### Cursor vs Claude Code (Apples-to-Apples)

| Metric | Cursor Avg | Claude Code Avg | Ratio |
|--------|------------|-----------------|-------|
| Raw Tokens/Day | ~4.6m | ~87k | 53x |
| **I+O/Day** | ~300k | ~87k | **3.4x** |

The 3.4x ratio (not 50x) reflects actual usage difference when cache reads are excluded.

### Why Cache Reads Are High

Cursor's prompt caching stores:
- System prompts
- File contents already in context
- Conversation history

Cache reads are **cheaper than fresh input** ($0.30 vs $3.00 per 1M tokens for Claude). High cache % is good for cost efficiency but shouldn't be compared to tools that don't report cache.

---

## Questions?

Contact Jack or check individual `{name}.md` files for per-person details.
