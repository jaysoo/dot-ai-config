# Engineering Productivity

Tracking engineering productivity initiatives and progress through 2026.

## SPACE Framework

All metrics align with the SPACE framework (Forsgren et al., GitHub/Microsoft Research):

| Letter | Dimension | Our Metrics |
|--------|-----------|-------------|
| **S** | Satisfaction & Well-being | Developer Pulse Survey |
| **P** | Performance | Stakeholder Satisfaction, Code Health Ratio, Planning Accuracy |
| **A** | Activity | PR Throughput Trend |
| **C** | Communication & Collaboration | TTFR (Review Cycle Time) |
| **E** | Efficiency & Flow | AI Amplification Index, TTFR |

## 2026 Metrics Framework

### 1. PR Throughput Trend (Activity)
- **Metric**: PR count per month per team
- **Source**: GitHub API → `collect-github-stats/data/`
- **Target**: Maintain or exceed Q4 2025 monthly averages
- **Status**: ✅ Baseline established (2024-2025 data collected)

### 2. AI Amplification Index (Efficiency)
- **Metric**: AI tokens consumed / PR merged
- **Source**: Claude/Copilot API logs, IDE telemetry
- **Target**: Establish baseline Q1 2026, track ratio improvement
- **Status**: ✅ Baseline established ([AI Usage Stats](./ai-usage/2025-01-21/SUMMARY.md))

### 3. Planning Accuracy (Performance)
- **Metric**: `|Actual planned work % - Target %| / Target %`
- **Example**: 50% target, 40% actual = 20% miss
- **Source**: Linear (planned vs unplanned labels)
- **Target**: ≤15% deviation from planned allocation
- **Status**: 🔄 Added to productivity report

### 4. Review Cycle Time / TTFR (Efficiency + Collaboration)
- **Metric**: Median Time to First Review
- **Source**: GitHub API → `collect-github-stats/data/`
- **Target**: <4h median TTFR
- **Status**: ✅ Baseline established

### 5. Code Health Ratio (Performance)
- **Metric**: Deletions / Additions ratio (monthly)
- **Source**: GitHub API → `collect-github-stats/data/`
- **Target**: Maintain deletion ratio >0.25
- **Status**: ✅ Baseline established (+135% deletions post-AI in 2025)

### 6. Developer Satisfaction (Satisfaction)
- **Metric**: Quarterly pulse survey score (1-5 scale)
- **Source**: Google Form survey
- **Target**: ≥4.0 average, no team below 3.5
- **Survey**: `collect-github-stats/data/surveys/developer-pulse-survey.md`
- **Status**: 📋 Survey template created

### 7. Stakeholder Satisfaction (Performance)
- **Metric**: Quarterly survey from Sales/Marketing/CS/Product
- **Source**: Google Form survey
- **Target**: ≥4.0 average
- **Survey**: `collect-github-stats/data/surveys/stakeholder-satisfaction-survey.md`
- **Status**: 📋 Survey template created

## AI Usage Tracking

**Location:** [`ai-usage/`](./ai-usage/)

Individual AI tool usage statistics collected from the engineering team. Used to calculate AI Amplification Index and track adoption trends.

### Current Data

| Collection Date | Status | Summary |
|-----------------|--------|---------|
| [2025-01-21](./ai-usage/2025-01-21/SUMMARY.md) | Complete | 11/18 team members, 3 tools |

### Key Metrics

- **I+O/Day** (Input+Output per Day) - Primary comparison metric (excludes cache reads)
- **Activity Rate** - Days active / tracking period
- **Tool Distribution** - Claude Code vs Cursor vs Open Code

### Collection Schedule

**Collect every 30 days** (around the 21st) to track trends over time.

| Date | Folder | Status |
|------|--------|--------|
| 2025-01-21 | `ai-usage/2025-01-21/` | Complete |
| 2025-02-21 | `ai-usage/2025-02-21/` | Scheduled |
| 2025-03-21 | `ai-usage/2025-03-21/` | Scheduled |

### How to Collect

See [AI Usage README](./ai-usage/2025-01-21/README.md) for detailed methodology.

**Quick reference:**
- **Claude Code:** `claude "/stats"` → screenshot
- **Cursor:** Admin exports team CSV from dashboard
- **Open Code:** `opencode stats --days 7` → screenshot

---

## Q1 2026 Tasks

- [x] Establish baseline metrics with 2024-2025 data
- [x] Create developer satisfaction survey template
- [x] Create stakeholder satisfaction survey template
- [x] Set up AI usage tracking scripts
- [x] Add planning accuracy to productivity report
- [x] Establish AI token usage baseline
- [ ] Deploy on Lighthouse
- [ ] Deploy Q1 developer pulse survey (January)
- [ ] Deploy Q1 stakeholder satisfaction survey (January)
- [ ] Collect February AI usage stats (2025-02-21)

## Key Files & Scripts

| File | Purpose |
|------|---------|
| `ai-usage/2025-01-21/SUMMARY.md` | AI usage comparison and rankings |
| `ai-usage/2025-01-21/ai-usage-stats.json` | Structured AI usage data |
| `ai-usage/2025-01-21/README.md` | Data collection methodology |
| `collect-github-stats/collect-productivity-baselines.mjs` | Collect PR/review metrics from GitHub |
| `collect-github-stats/generate-productivity-report.mjs` | Generate HTML productivity reports |
| `collect-github-stats/analyze-yoy.mjs` | YoY comparison analysis |
| `collect-github-stats/scripts/ai-usage.mjs` | Track AI tool usage |
| `collect-github-stats/data/2024-baselines.json` | 2024 baseline data |
| `collect-github-stats/data/2025-baselines.json` | 2025 baseline data |
| `collect-github-stats/data/yoy-2024-2025.html` | YoY comparison dashboard |
| `collect-github-stats/data/surveys/` | Survey templates |

## Key Findings (2024 vs 2025)

### YoY Changes
| Metric | 2024 | 2025 | Change |
|--------|------|------|--------|
| Total LOC | 2.29M | 4.03M | +76% |
| Q2 LOC | 454K | 1.20M | +164% (AI adoption) |

### Pre-AI vs Post-AI (2025)
| Metric | Pre-AI (Jan-May) | Post-AI (Jun-Dec) | Change |
|--------|------------------|-------------------|--------|
| PR Volume | 518.6/mo | 636.1/mo | +23% |
| Reviews/PR | 1.19 | 1.50 | +26% |
| Deletions | ~74K/mo | ~174K/mo | +135% |
| Median PR Size | ~40 LOC | ~49 LOC | +24% |

## Notes

### 2026-01-21
- Established AI usage baseline with 11/18 team members
- Primary metric: I+O/Day (Input+Output per day, excludes cache reads)
- Key finding: Cursor vs Claude Code is 3.4x ratio (not 50x) when comparing apples-to-apples
- Set 30-day collection cadence for trend tracking

### 2026-01-08
- Defined SPACE-aligned metrics framework with 7 key metrics
- Created survey templates for developer and stakeholder satisfaction
- Surveys saved to `collect-github-stats/data/surveys/`

### 2026-01-07
- Created productivity tracking area
- Added work composition metrics (planned/unplanned/firefighting %)
- Created YoY analysis script
- Backfilled 2024-2025 baseline data

### Key Insights
- CLI team started 2025 below 2024 but trended up → validates restructuring
- Q2 2025 +164% LOC spike correlates with AI tool adoption
- +135% code deletions post-AI suggests healthy refactoring culture
