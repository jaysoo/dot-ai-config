---
name: metrics-review
description: >
  Director-level metrics review across Nx platform: nx.dev engagement, AI traffic
  rates, npm download trends, docs traffic/page performance, CNW funnel stats,
  and SPACE engineering productivity. Use when user says "check metrics",
  "metrics review", "how are our numbers", "dashboard check", "KPI review",
  "important metrics", or asks about engagement, traffic, downloads, or
  productivity trends.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - WebFetch
  - WebSearch
  - Agent
  - mcp__Linear__list_issues
  - mcp__Linear__list_teams
  - mcp__Linear__list_projects
---

# Metrics Review

Comprehensive director-level metrics review for the Nx platform. Gathers data
from multiple sources and produces a single actionable report.

## Arguments

$ARGUMENTS

- No arguments: run all metric sections.
- `quick`: skip slow sections (docs traffic deep-dive, SPACE audit). Just do
  npm downloads, CNW stats, and landing page engagement.
- Specific section names: `landing`, `ai-traffic`, `npm`, `docs-traffic`,
  `docs-cleanup`, `cnw`, `space`, `scorecard`.
- `since=YYYY-MM-DD`: override lookback start date (default: 30 days).
- `compare`: include month-over-month and year-over-year comparisons where available.

## Metric Sections

### 1. nx.dev Landing Page Engagement (`landing`)

**Goal:** Understand if visitors engage with the landing page content.

**Data sources:**
- Netlify Analytics (if accessible via API) or ask user to paste data from
  Netlify dashboard / Google Analytics
- Check for any analytics instrumentation in the nx-dev repo (scroll tracking,
  event handlers)

**What to report:**
- Total landing page views (last 30 days, with trend vs prior 30 days)
- Scroll depth distribution (if scroll events are instrumented)
- Bounce rate
- Top entry paths that lead to landing page
- CTA click-through rates (e.g., "Get Started", "Try Nx Cloud")

**If data is not programmatically accessible:** Tell the user which specific
reports to pull from their analytics tool and offer to analyze the data once
pasted. Be specific about which dashboard/view/date range.

### 2. AI Traffic Rate (`ai-traffic`)

**Goal:** Quantify how much traffic comes from AI crawlers/tools vs humans.

**Data sources:**
- Server logs or Netlify analytics (bot filtering)
- Cloudflare bot analytics (if available)
- User-agent analysis from access logs

**What to report:**
- Overall AI bot traffic as % of total (docs + marketing)
- AI traffic specifically on getting-started pages (`/getting-started/*`,
  `/docs/getting-started/*`, `/recipes/getting-started/*`)
- Trend: is AI traffic increasing month over month?
- Top AI user agents (GPTBot, ClaudeBot, Bytespider, etc.)
- Breakdown: AI training crawlers vs AI-assisted search (Perplexity, SearchGPT)

**If data not accessible:** Suggest checking Cloudflare/Netlify bot analytics
and specify which filters to apply. Offer to analyze exported CSV/JSON.

### 3. Nx npm Download Trends (`npm`)

**Goal:** Track adoption momentum.

**Data sources:**
- npm registry API: `https://api.npmjs.org/downloads/point/{start}:{end}/nx`
- npm weekly range API for trend lines: `https://api.npmjs.org/downloads/range/{start}:{end}/nx`

**What to report:**
- Current month downloads (formatted as M, e.g., "36.2M")
- Month-over-month growth %
- Year-over-year growth %
- Weekly trend for last 12 weeks (spot anomalies, holidays)
- Compare with key competitors if `compare` flag set:
  - `turbo` (Turborepo)
  - `@angular/cli`
  - `vite`

**Implementation:**
```bash
# Monthly total
curl -s "https://api.npmjs.org/downloads/point/{FIRST}:{LAST}/nx" | jq '.downloads'

# Weekly trend
curl -s "https://api.npmjs.org/downloads/range/{12_WEEKS_AGO}:{TODAY}/nx"

# YoY
curl -s "https://api.npmjs.org/downloads/point/{LAST_YEAR_FIRST}:{LAST_YEAR_LAST}/nx"
```

### 4. Nx Docs Traffic Analysis (`docs-traffic`)

**Goal:** Understand docs traffic trajectory and which content drives visits.

**Data sources:**
- Netlify Analytics API or user-provided analytics export
- Google Search Console data (if user provides)

**What to report:**
- Total docs traffic last 30 days vs prior 30 days (trend)
- Total docs traffic last 12 months — monthly breakdown, is it growing?
- Top 20 most visited docs pages
- Top 20 fastest growing pages (by % increase)
- Top 20 pages with biggest traffic decline
- Traffic by docs section/category breakdown
- Search terms driving docs traffic (if GSC data available)

### 5. Docs Page Cleanup Candidates (`docs-cleanup`)

**Goal:** Identify pages that should be removed, merged, or rewritten.

**Data sources:**
- Analytics data (low-traffic pages)
- Git blame/log (stale content)
- Page content analysis

**What to report:**
- Pages with <100 views/month that aren't core reference
- Pages not updated in >12 months with low traffic
- Duplicate/overlapping content candidates for merging
- Pages with high bounce rate + low time-on-page (content not helpful)
- Broken or outdated code examples (check for deprecated APIs)

**Implementation approach:**
1. Get traffic data (from analytics or user)
2. Cross-reference with `git log` to find last-modified dates
3. Read low-traffic pages to assess if content is still relevant
4. Produce a ranked list: remove, merge, or rewrite

### 6. CNW Stats Review (`cnw`)

**Goal:** Track CNW funnel against targets: 200+ "yes" to Cloud, 2K+ starts/day.

**How to gather:** Invoke the `cnw-stats-analyzer` skill/command logic directly,
or tell the user to run `/cnw-stats-analyzer` if this skill can't access MongoDB.

**What to report:**
- Daily starts (target: 2,000+/day)
- Daily Cloud opt-in count and rate (target: 200+ "yes" per day)
- Cloud opt-in trend: is it moving toward the goal?
- Completion rate (completes / starts)
- Error rate and top errors
- Active experiments and their impact on Cloud adoption
- Week-over-week trends for starts and Cloud opt-in

**Thresholds (flag as warning if below):**
| Metric | Target | Warning |
|--------|--------|---------|
| Daily starts | 2,000 | <1,800 |
| Daily Cloud "yes" | 200 | <150 |
| Completion rate | >70% | <60% |
| Error rate | <5% | >8% |

### 7. SPACE Metrics — Engineering Productivity (`space`)

**Goal:** Holistic engineering productivity health check using the SPACE framework.

SPACE dimensions to assess:
- **S**atisfaction & well-being
- **P**erformance
- **A**ctivity
- **C**ommunication & collaboration
- **E**fficiency & flow

**Data sources:**
- Linear: cycle times, throughput, blocked issues
- GitHub: PR review times, merge frequency, CI pass rates
- Team capacity audit (from `/audit-capacity`)
- Qualitative signals from 1:1 notes and team syncs

**What to report:**

| Dimension | Metrics | Source |
|-----------|---------|--------|
| Satisfaction | Recent sentiment from 1:1s, any flagged concerns | `.ai/para/areas/personnel/` |
| Performance | Issues completed vs planned per cycle, bug escape rate | Linear |
| Activity | PRs merged/week, commits/week, releases shipped | GitHub |
| Communication | PR review turnaround time, blocked issue count | GitHub + Linear |
| Efficiency | Cycle time (issue created to done), CI build times | Linear + GitHub Actions |

**Implementation:**
1. Pull Linear cycle data for active teams (Nx CLI, DPE, Orca, etc.)
2. Pull GitHub PR stats: `gh api` for merge times, review counts
3. Check `.ai/para/areas/personnel/` for recent sentiment signals
4. Check `.ai/para/areas/syncs/` for recurring blockers mentioned in syncs
5. Produce a per-team summary with trend arrows

### 8. CLI Scorecard (`scorecard`)

**Goal:** Quick snapshot of Nx CLI health metrics (delegates to existing command).

Tell the user to run `/nx-scorecard` or inline the scorecard logic:
- Open/closed issues on GitHub
- Open high-priority Linear issues
- npm downloads + YoY
- Open PRs

## Output Format

Produce a single markdown report structured as:

```markdown
# Nx Platform Metrics Review — {DATE}

## Executive Summary
- 3-5 bullet points: what's good, what needs attention, what changed
- Use trend indicators: up-arrow, down-arrow, flat, or NEW for new signals

## 1. Landing Page Engagement
{data or "DATA NEEDED: paste from [specific dashboard]"}

## 2. AI Traffic
{data or instructions}

## 3. npm Downloads
{always available via API}

## 4. Docs Traffic
{data or instructions}

## 5. Docs Cleanup Candidates
{analysis}

## 6. CNW Funnel
{data from MongoDB or instructions}

## 7. SPACE Productivity
{analysis}

## 8. CLI Scorecard
{data from GitHub + Linear + npm}

## Action Items
- Prioritized list of things that need attention based on the data
- Each item tagged: [urgent], [this-week], [this-month], [monitor]
```

## Running the Review

1. **Always start with npm downloads and CLI scorecard** — these are fully
   automated and give immediate value.
2. **Check what data is accessible** before attempting analytics sections.
   Don't waste time on APIs that need credentials.
3. **For sections needing manual data**, produce specific instructions:
   "Go to [dashboard URL], select [date range], export [format], paste here."
4. **Flag missing data clearly** — don't skip sections silently.
5. **Compare against prior review** if one exists at
   `.ai/para/areas/metrics-review/` — call out deltas.

## State & History

Save each review to `.ai/para/areas/metrics-review/`:
```
.ai/para/areas/metrics-review/
  README.md
  2026-03-24.md
  2026-02-24.md
  ...
```

This allows delta tracking between reviews. When a prior review exists,
include a "Changes Since Last Review" callout in the executive summary.
