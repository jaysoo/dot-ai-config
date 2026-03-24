# SPACE Metrics & Engineering Productivity

**Priority: MEDIUM** | Cadence: Monthly check, quarterly deep-dive

Combined SPACE framework tracking and engineering productivity metrics.

## SPACE Dashboard

| Dimension             | Status                                                              | Last Updated |
| --------------------- | ------------------------------------------------------------------- | ------------ |
| **S** - Satisfaction  | Surveyed 2026-02                                                    | 2026-02-26   |
| **P** - Performance   | https://lighthouse.ops.cloud.nx.app/engineering-tools/space-metrics | (evergreen)  |
| **A** - Activity      | https://lighthouse.ops.cloud.nx.app/engineering-tools/space-metrics | (evergreen)  |
| **C** - Communication | https://lighthouse.ops.cloud.nx.app/engineering-tools/space-metrics | (evergreen)  |
| **E** - Efficiency    | https://lighthouse.ops.cloud.nx.app/engineering-tools/space-metrics | (evergreen)  |

## Metrics Framework (SPACE-aligned)

| # | Metric | Dimension | Source | Target |
|---|--------|-----------|--------|--------|
| 1 | PR Throughput Trend | Activity | GitHub API | Maintain or exceed Q4 2025 averages |
| 2 | AI Amplification Index | Efficiency | Claude/Copilot API logs | Track ratio improvement |
| 3 | Planning Accuracy | Performance | Linear (planned vs unplanned) | ≤15% deviation |
| 4 | Review Cycle Time (TTFR) | Efficiency + Collaboration | GitHub API | <4h median |
| 5 | Code Health Ratio | Performance | GitHub API | Deletion ratio >0.25 |
| 6 | Developer Satisfaction | Satisfaction | Quarterly pulse survey | ≥4.0 avg, no team below 3.5 |
| 7 | Stakeholder Satisfaction | Performance | Quarterly survey | ≥4.0 avg |

## Key Findings (2024 vs 2025)

| Metric | Pre-AI (Jan-May 2025) | Post-AI (Jun-Dec 2025) | Change |
|--------|----------------------|----------------------|--------|
| PR Volume | 518.6/mo | 636.1/mo | +23% |
| Reviews/PR | 1.19 | 1.50 | +26% |
| Deletions | ~74K/mo | ~174K/mo | +135% |
| Median PR Size | ~40 LOC | ~49 LOC | +24% |

## AI Usage Tracking

**Location:** `ai-usage/` (merged from productivity area)

| Collection Date | Status | Summary |
|-----------------|--------|---------|
| [2025-01-21](./ai-usage/2025-01-21/SUMMARY.md) | Complete | 11/18 team members, 3 tools |

**Collection cadence:** Every 30 days (~21st). Quick ref:
- **Claude Code:** `claude "/stats"` → screenshot
- **Cursor:** Admin exports team CSV
- **Open Code:** `opencode stats --days 7` → screenshot

## Files

- `satisfaction-2026-02.md` — Feb 2026 satisfaction survey analysis
- `engineering-satisfaction-2026-02.csv` — Raw engineering survey responses
- `stakeholder-satisfaction-2026-02.csv` — Raw stakeholder survey responses
- `ai-usage/` — Individual AI tool usage stats (30-day collections)

## Key Scripts (in collect-github-stats/)

| File | Purpose |
|------|---------|
| `collect-productivity-baselines.mjs` | Collect PR/review metrics from GitHub |
| `generate-productivity-report.mjs` | Generate HTML productivity reports |
| `analyze-yoy.mjs` | YoY comparison analysis |
| `scripts/ai-usage.mjs` | Track AI tool usage |
| `data/2024-baselines.json` | 2024 baseline data |
| `data/2025-baselines.json` | 2025 baseline data |

## Q1 2026 Tasks

- [x] Establish baseline metrics with 2024-2025 data
- [x] Create developer satisfaction survey template
- [x] Create stakeholder satisfaction survey template
- [x] Set up AI usage tracking scripts
- [x] Add planning accuracy to productivity report
- [x] Establish AI token usage baseline
- [ ] Deploy on Lighthouse
- [ ] Deploy Q1 developer pulse survey
- [ ] Deploy Q1 stakeholder satisfaction survey
