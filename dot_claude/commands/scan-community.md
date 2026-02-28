---
description: >
  Analyze community and customer sentiment across the Nx platform.
  Covers OSS community (GitHub issues, discussions, Stack Overflow, npm)
  AND paid customer sentiment (Pylon support data). Identifies what users
  are struggling with, praising, and requesting. Run monthly/weekly.
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - WebFetch
  - Task
---

# Community & Customer Sentiment Analysis

Scan public community channels AND customer support data to understand
what Nx users (both OSS and paid) are experiencing. Surfaces recurring
pain points, popular feature requests, praise signals, and emerging use
patterns. This is market research that nobody has time to do manually.

## Scope

$ARGUMENTS

Default: full scan of all sources across **nrwl/nx**, **nrwl/nx-cloud**
GitHub repos, AND **Pylon customer support data**.

Can scope to: "issues only", "discussions", "stack overflow", "pylon only",
"oss only", "cloud only", or a specific topic like "module federation sentiment".

### Coverage

| Segment | Sources | What it captures |
|---------|---------|------------------|
| **OSS Community** | GitHub (nrwl/nx, nrwl/nx-cloud), SO, npm | Public pain points, feature requests, adoption trends |
| **Paid Customers** | Pylon (Slack, email, Discord, Teams) | Support volume, customer friction, churn signals, feature demand |

### Multi-repo support

- **nrwl/nx** — Primary OSS community hub. Issues, discussions, reactions.
- **nrwl/nx-cloud** — Cloud-specific issues (if public). May have separate
  issue patterns (auth, billing, DTE, caching).

When scanning both, keep findings separate by repo in the analysis but
merge them for cross-cutting themes (e.g., "caching" issues may span
both CLI cache misses and Cloud remote cache problems).

## File Management

Area directory: `.ai/para/areas/community-sentiment/`

1. Current month as `YYYY-MM`.
2. If report exists, **update in place**. Preserve `> NOTE:` / `<!-- manual -->`.
3. If not, create new. Ensure README.md links it.

### README.md structure

```markdown
# Community Sentiment

Monthly analysis of Nx community signals across GitHub, Stack Overflow,
and social platforms. Surfaces pain points, feature requests, and adoption
patterns for product and roadmap decisions.

## Reports

- [YYYY-MM](./YYYY-MM.md) — {one-line: top theme}
```

## Source 1: GitHub Issues (nrwl/nx + nrwl/nx-cloud)

Run the following for **both** `nrwl/nx` and `nrwl/nx-cloud` (if accessible).
If `nrwl/nx-cloud` is private and inaccessible, note it and continue with
`nrwl/nx` only.

### Unresponded issues

```bash
# For each repo: nrwl/nx and nrwl/nx-cloud
for REPO in nrwl/nx nrwl/nx-cloud; do
  echo "=== $REPO ==="
  gh issue list --repo "$REPO" --state open \
    --json number,title,createdAt,comments,labels,reactions \
    --jq '[.[] | select(.comments == 0)] | length' 2>/dev/null \
    || echo "No access to $REPO"
done

# Get details on unresponded issues
gh issue list --repo nrwl/nx --state open \
  --json number,title,createdAt,comments,labels,reactions \
  --jq '[.[] | select(.comments == 0 and (.createdAt >= "<MONTH_START>"))]'
```

### High-signal issues (by reactions)

```bash
# Check both repos
for REPO in nrwl/nx nrwl/nx-cloud; do
  gh api "repos/$REPO/issues?state=open&sort=reactions-+1&direction=desc&per_page=20" \
    --jq '.[] | {number, title, reactions: .reactions["+1"], comments, created_at}' 2>/dev/null
done
```

### Recurring themes

```bash
# Most common words in issue titles this month
gh issue list --repo nrwl/nx --state all --limit 100 \
  --json title,createdAt \
  --jq '[.[] | select(.createdAt >= "<MONTH_START>")] | .[].title'
```

Cluster these into themes. Look for patterns like:
- Same error message appearing in multiple issues
- Same package/plugin being reported repeatedly
- Configuration confusion patterns
- Migration pain points

### Issue resolution health

```bash
# Issues opened vs closed this month
gh issue list --repo nrwl/nx --state all --json state,createdAt,closedAt \
  --jq '{
    opened: [.[] | select(.createdAt >= "<MONTH_START>")] | length,
    closed: [.[] | select(.closedAt != null and .closedAt >= "<MONTH_START>")] | length
  }'
```

### Stale issues

```bash
# Open issues >90 days old with >5 reactions (high community interest, no resolution)
gh api "repos/nrwl/nx/issues?state=open&sort=reactions-+1&direction=desc&per_page=50" \
  --jq '[.[] | select(.reactions["+1"] >= 5)] | .[0:20] | .[] | {number, title, reactions: .reactions["+1"], age_days: ((now - (.created_at | fromdateiso8601)) / 86400 | floor)}'
```

## Source 2: GitHub Discussions (nrwl/nx)

```bash
# Recent discussions
gh api "repos/nrwl/nx/discussions?per_page=30" 2>/dev/null \
  || echo "Discussions API may need GraphQL — fall back to web scraping"
```

If the REST API doesn't work for discussions, use:
```bash
gh api graphql -f query='
{
  repository(owner: "nrwl", name: "nx") {
    discussions(first: 30, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes {
        title
        createdAt
        upvoteCount
        comments { totalCount }
        category { name }
      }
    }
  }
}'
```

Categorize discussions by:
- Questions (user confusion — signals docs gaps)
- Feature requests (what users want)
- Show and tell (adoption signals — what people build with Nx)
- Bug-adjacent (issues filed as discussions)

## Source 3: Stack Overflow

```bash
# Recent Nx questions
WebFetch "https://api.stackexchange.com/2.3/questions?order=desc&sort=activity&tagged=nrwl-nx&site=stackoverflow&pagesize=30&filter=withbody"
```

Also check `nx-workspace` and `nx-monorepo` tags.

Look for:
- Questions with high views but no accepted answer (pain points)
- Recurring topics (same confusion appearing monthly)
- New topics appearing (emerging use cases)

## Source 4: npm Download Trends

```bash
# Core package downloads (weekly trend)
WebFetch "https://api.npmjs.org/downloads/range/last-month/nx"

# Plugin download comparison
for pkg in @nx/react @nx/angular @nx/next @nx/vite @nx/jest @nx/webpack @nx/rspack @nx/playwright; do
  WebFetch "https://api.npmjs.org/downloads/point/last-month/$pkg" 2>/dev/null
done
```

Compare with previous month to spot:
- Overall growth/decline
- Plugins gaining or losing traction
- Framework adoption shifts (React vs Angular vs Next)

## Source 5: Pylon — Customer Support Sentiment (Nx Cloud)

Pylon aggregates all customer support channels (Slack Connect, email,
Discord, Teams) into a unified dashboard. It provides AI-powered
sentiment analysis, feature request aggregation, and knowledge base
gap detection.

### Access

Pylon dashboard: https://app.usepylon.com/
Pylon API docs: https://docs.usepylon.com/

**If a Pylon MCP server is configured**, use it directly. Otherwise,
use the Pylon REST API or manually review the dashboard.

### What to extract from Pylon

1. **Support ticket volume** — How many tickets this period? Trend vs last period?
2. **Top ticket categories** — What are customers asking about most?
   - Auth/SSO issues
   - Remote caching problems
   - DTE/distribution configuration
   - Billing/licensing questions
   - Onboarding friction
3. **Sentiment signals** — Are customers frustrated or satisfied?
   - Pylon flags at-risk accounts automatically via sentiment analysis
   - Look for patterns in negative sentiment (same feature? same config?)
4. **Feature requests** — Pylon aggregates customer requests across channels
   - AI groups similar requests with evidence
   - Cross-reference with GitHub feature requests for signal amplification
5. **Knowledge base gaps** — What questions come up repeatedly without articles?
   - These are direct inputs for docs team priorities
6. **Account health** — Any accounts flagged as at-risk?
   - Don't include specific customer names in the report — use anonymized
     patterns like "2 enterprise accounts reported DTE config issues"
7. **Response times** — Are SLAs being met? Trending better or worse?

### Pylon data in the report

Keep Pylon data in a separate "Customer Sentiment" section. Do NOT mix
specific customer data into the public OSS analysis. The customer section
should focus on **patterns and themes**, not individual accounts.

If Pylon is inaccessible (no API key, not yet configured), note it as
"Pylon: Not available — customer sentiment data not included" and continue
with OSS-only analysis.

## Analysis

### CRITICAL: Verify Issue State Before Reporting

**Before listing any issue as a pain point, action item, or finding,
verify it is still OPEN.** Many issues get resolved quickly. Reporting
closed issues as active pain points produces misleading reports.

```bash
# For every issue number you plan to reference, check its state:
gh issue view <NUMBER> --repo nrwl/nx --json state,closedAt \
  --jq '{state, closedAt}'
```

- If CLOSED: Note it as "resolved" — do NOT list as an active pain point
- If OPEN: Include in the report with (OPEN) tag
- For pain point rankings, only count OPEN issues

### Pain Point Ranking

Across all sources, identify the top 5-10 pain points by frequency
and severity. **Only include issues that are currently OPEN.** For each:
- What's the problem?
- How many signals point to it? (N issues + N discussions + N SO questions)
- Is it getting better or worse vs. last month?
- Is there a known fix or workaround?
- Should this affect roadmap priority?

### Feature Request Ranking

Top requested features by reaction count and mention frequency.
Cross-reference with the Nx roadmap — are we already planning these?

### Positive Signals

What are people praising? Which features get positive mentions?
This is useful for marketing and for knowing what NOT to break.

### Emerging Use Patterns

New ways people are using Nx that we didn't expect. Could inform
new plugin ideas, docs content, or conference talks.

## Compare with last month

- Pain points that improved or worsened
- Feature requests that were addressed
- New themes that appeared
- Download trend direction

## Write the report

```markdown
# Community & Customer Sentiment — {Month Year}

_Last updated: {datetime}_
_Sources: GitHub Issues, Discussions, Stack Overflow, npm downloads, Pylon_

## Key Takeaways
{3-5 bullets: most important signals for product decisions}
{Include both OSS and customer signals}

## Download Trends
- **nx** (core): {N/month} ({+/-N% vs last month})
- **Top plugins by downloads**:
  | Plugin | Downloads | Trend |
  |--------|-----------|-------|

## Top Pain Points — OSS Community (by signal frequency)

### 1. {Pain point title}
- **Signals**: {N issues, N discussions, N SO questions}
- **Trend**: {↑ getting worse / → stable / ↓ improving}
- **Example**: {link to representative issue}
- **Recommendation**: {what we should do about it}

### 2. {Next pain point}
{Same structure}

## Customer Sentiment — Nx Cloud (from Pylon)

### Support Volume
- Tickets this period: {N} ({+/-N% vs last period})
- Average response time: {N hours}

### Top Customer Issues
{Themed categories — NOT individual account names}
1. {Category}: {N tickets} — {pattern description}
2. {Category}: {N tickets} — {pattern description}

### Feature Demand (from customers)
{Aggregated feature requests from Pylon}
- Cross-reference with OSS feature requests above

### Knowledge Base Gaps
{Top questions without docs coverage}

### Account Health Signals
- Accounts flagged at-risk: {N}
- Common friction pattern: {description}

_If Pylon unavailable: "Pylon data not included — API not configured"_

## Top Feature Requests (by community votes)

| Rank | Feature | Votes/Reactions | Customer Signal? | On Roadmap? |
|------|---------|----------------|------------------|-------------|

## What Users Are Praising
{Specific features or experiences getting positive feedback}

## Unresponded Issues
- Total open with 0 maintainer comments: {N}
- Oldest unresponded: {link} ({N days old})
- **Recommendation**: {which ones to prioritize responding to}

## Stale High-Interest Issues
| Issue | Reactions | Age | Topic |
|-------|-----------|-----|-------|

## Emerging Patterns
{New use cases, unexpected adoption, interesting community projects}
```

Save to `.ai/para/areas/community-sentiment/YYYY-MM.md` and update README.md.
