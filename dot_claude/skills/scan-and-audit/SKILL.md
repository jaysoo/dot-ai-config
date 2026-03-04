---
name: scan-and-audit
description: >
  Weekly scan and audit orchestrator for Nx platform intelligence. Runs all
  11 scan/audit commands plus the monthly digest via parallel subagents, then
  synthesizes a unified report with delta tracking. Use when user says
  "run scans", "weekly scan", "scan and audit", "run audits", "weekly report",
  "what's new this week", or any variation. Also use for "monthly scan" or
  "full audit".
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - WebFetch
  - WebSearch
  - Task
---

# Scan & Audit Orchestrator

Run all Nx platform intelligence scans in parallel, then produce a unified
weekly report with delta tracking. Designed to be run at the start of the
week (or day) to give Jack a quick picture of what changed.

## Arguments

$ARGUMENTS

- No arguments: run all 12 scans (8 external + 3 internal audits + monthly
  digest) for the current week.
- `monthly only`: skip scans, just run the monthly digest.
- `scans only`: skip the monthly digest, just run scans/audits.
- `quick`: skip slow scans (community, dependencies, supply-chain, api-surface,
  capacity, project-health, customer-deps).
  Only run web-research scans (competitors, frameworks, runtimes, ai-landscape).
- `internal`: run only the 3 internal management audits (capacity, project-health,
  customer-deps). These use Linear MCP — no GitHub cloning needed.
- `briefing`: run internal audits + competitors + monthly digest. Produces
  the full director-level monthly briefing.
- Specific scan names: `competitors`, `frameworks`, `runtimes`, `ai-landscape`,
  `community`, `dependencies`, `supply-chain`, `api-surface`, `capacity`,
  `project-health`, `customer-deps`, `digest`.
- `lookback=N`: override the lookback window to N days (default: 60).

## Directory Structure

All orchestrator output goes to `.ai/para/areas/scan-audit/`.

```
.ai/para/areas/scan-audit/
├── README.md
├── state.json              # Last run metadata + finding counts
├── weekly/
│   ├── 2026-W09.md         # Unified weekly report
│   └── ...
└── monthly-digests/        # Monthly digest cross-functional + changelog
    └── ...
```

Individual scan reports live in their own PARA areas (managed by each command):

**External scans (GitHub, npm, web):**
- `.ai/para/areas/dependency-health/`
- `.ai/para/areas/competitor-intel/`
- `.ai/para/areas/api-surface-audit/`
- `.ai/para/areas/supply-chain-security/`
- `.ai/para/areas/community-sentiment/`
- `.ai/para/areas/framework-ecosystem/`
- `.ai/para/areas/runtime-tracking/`
- `.ai/para/areas/ai-dev-landscape/`

**Internal audits (Linear MCP):**
- `.ai/para/areas/team-capacity/`
- `.ai/para/areas/project-health/`
- `.ai/para/areas/customer-deps/`

## Step 0: Setup & State

### 0a. Ensure directory structure exists

```bash
mkdir -p .ai/para/areas/scan-audit/weekly
mkdir -p .ai/para/areas/scan-audit/monthly-digests
```

### 0b. Read previous state

Read `.ai/para/areas/scan-audit/state.json` if it exists. Structure:

```json
{
  "lastRun": "2026-02-20T10:00:00Z",
  "lastWeeklyReport": "2026-W08",
  "lastMonthlyDigest": "2026-01",
  "findings": {
    "dependencies": { "critical": 2, "warning": 5 },
    "supply-chain": { "status": "clear" },
    "api-surface": { "high": 3, "medium": 8 },
    "competitors": { "highlights": 4 },
    "frameworks": { "compat-risks": 1 },
    "runtimes": { "action-items": 0 },
    "ai-landscape": { "highlights": 6 },
    "community": { "top-pain-points": 5 },
    "capacity": { "high-risk-people": 2, "overdue-items": 8 },
    "project-health": { "zombies": 2, "overdue-projects": 3 },
    "customer-deps": { "churned": 1, "cooling": 0, "concentration-risks": 2 }
  }
}
```

This lets us compute deltas ("2 new critical deps since last week").

### 0c. Compute current week number and lookback window

```bash
date '+%Y-W%V'

# Lookback window (default: 60 days, override with lookback=N argument)
LOOKBACK_DAYS=60
LOOKBACK_START=$(date -v-${LOOKBACK_DAYS}d '+%Y-%m-%d')
echo "Lookback window: $LOOKBACK_START to today"
```

The `LOOKBACK_START` date is passed to every subagent so they scan data
going back 60 days (not just the current calendar month). This ensures
coverage of events that happened in the prior month as well.

### 0d. Determine what to run

- If `lastMonthlyDigest` < current month AND we're past the 25th of the
  month, include the monthly digest.
- Otherwise only include it if explicitly requested or if arguments say so.
- All 8 scans run by default unless scoped by arguments.

## Step 1: Clone Repos (if needed for audit commands)

Four commands need local repo access: `audit-api-surface`, `audit-dependencies`,
`audit-supply-chain`, and `scan-community` (for issue data, though community
mostly uses `gh` API).

```bash
# Clone nx repo (shallow, fast)
NX_TMP="/tmp/nx-scan-$(date +%s)"
git clone --depth 1 https://github.com/nrwl/nx.git "$NX_TMP" 2>/dev/null

# Clone ocean repo (shallow, fast)
OCEAN_TMP="/tmp/ocean-scan-$(date +%s)"
git clone --depth 1 git@github.com:nrwl/nx-cloud.git "$OCEAN_TMP" 2>/dev/null \
  || echo "OCEAN_CLONE_FAILED"
```

If ocean clone fails (permissions, SSH keys), note it and continue with
nx-only scans. Never block on ocean access.

Store paths for subagents:
- `NX_REPO_PATH=$NX_TMP`
- `OCEAN_REPO_PATH=$OCEAN_TMP` (or empty if failed)

## Step 1.5: Pre-fetch GitHub Data

**Why**: Jack's `gh` wraps `op` (1Password CLI). Each `gh` invocation in a
separate subagent triggers a 1Password auth prompt. 8 parallel agents × 5+
`gh` calls = 40+ auth interruptions. Instead, run ALL `gh` calls here in the
orchestrator (single auth session) and cache results for subagents.

```bash
SCAN_DATA_DIR="/tmp/scan-data-$(date +%s)"
mkdir -p "$SCAN_DATA_DIR"/{releases,issues,api}
```

### Release lists (21 repos)

Fetch releases for every repo any scan command needs. Include `body` so
subagents don't need separate `gh release view` calls.

```bash
for repo in \
  vercel/turborepo moonrepo/moon bazelbuild/bazel pantsbuild/pants \
  nodejs/node oven-sh/bun denoland/deno \
  anthropics/claude-code modelcontextprotocol/specification \
  angular/angular facebook/react vercel/next.js remix-run/remix \
  nuxt/nuxt vuejs/core vitejs/vite webpack/webpack \
  web-infra-dev/rspack rolldown/rolldown evanw/esbuild swc-project/swc; do
  slug="${repo//\//-}"
  gh release list --repo "$repo" --limit 15 --json tagName,publishedAt,body \
    > "$SCAN_DATA_DIR/releases/$slug.json" 2>/dev/null \
    || echo "[]" > "$SCAN_DATA_DIR/releases/$slug.json"
done
```

### Issue data (nrwl/nx + nrwl/nx-cloud)

```bash
# Open issues with metadata (community scan needs this)
gh issue list --repo nrwl/nx --state open --limit 200 \
  --json number,title,createdAt,comments,labels,reactions \
  > "$SCAN_DATA_DIR/issues/nrwl-nx-open.json"

# All issues — for resolution health + state verification
gh issue list --repo nrwl/nx --state all --limit 200 \
  --json number,title,state,createdAt,closedAt \
  > "$SCAN_DATA_DIR/issues/nrwl-nx-all.json"

# nx-cloud open issues
gh issue list --repo nrwl/nx-cloud --state open --limit 100 \
  --json number,title,createdAt,comments,labels,reactions \
  > "$SCAN_DATA_DIR/issues/nrwl-nx-cloud-open.json" 2>/dev/null \
  || echo "[]" > "$SCAN_DATA_DIR/issues/nrwl-nx-cloud-open.json"
```

### REST API + GraphQL

```bash
# High-reaction issues (sorted by thumbs-up)
gh api "repos/nrwl/nx/issues?state=open&sort=reactions-+1&direction=desc&per_page=50" \
  > "$SCAN_DATA_DIR/api/nrwl-nx-top-reactions.json" 2>/dev/null \
  || echo "[]" > "$SCAN_DATA_DIR/api/nrwl-nx-top-reactions.json"

gh api "repos/nrwl/nx-cloud/issues?state=open&sort=reactions-+1&direction=desc&per_page=20" \
  > "$SCAN_DATA_DIR/api/nrwl-nx-cloud-top-reactions.json" 2>/dev/null \
  || echo "[]" > "$SCAN_DATA_DIR/api/nrwl-nx-cloud-top-reactions.json"

# Discussions
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
}' > "$SCAN_DATA_DIR/api/nrwl-nx-discussions.json" 2>/dev/null \
  || echo "{}" > "$SCAN_DATA_DIR/api/nrwl-nx-discussions.json"
```

### Search queries

```bash
gh search repos "ai agent developer tools" --sort=stars --limit=10 \
  --json name,description,stargazersCount,updatedAt \
  > "$SCAN_DATA_DIR/api/ai-agent-repos.json" 2>/dev/null \
  || echo "[]" > "$SCAN_DATA_DIR/api/ai-agent-repos.json"
```

**Total**: ~30 sequential `gh` calls, single `op` auth session, ~60-90 seconds.
All files are JSON matching the same format `gh --json` outputs, so existing
`jq` filters in subagents work unchanged.

## Step 2: Launch All Scans in Parallel

Launch each scan as a **background Task subagent**. Each subagent receives:
1. The command file content (its full instructions)
2. The repo path(s) to scan
3. The current month (YYYY-MM) for report file naming
4. The previous report path (if exists) for delta computation

### Scan Groups

**Group A — Repo-dependent audits** (need cloned repos):

1. **audit-dependencies** — Audit dependency health across nx + ocean
   - Subagent instruction: "Run the dependency health audit. Scan both
     `$NX_REPO_PATH/packages/` and `$OCEAN_REPO_PATH/` (if available).
     Write report to `.ai/para/areas/dependency-health/YYYY-MM.md`."

2. **audit-api-surface** — Detect API vs docs drift
   - Subagent instruction: "Run the API surface audit on `$NX_REPO_PATH`.
     Also check ocean's public npm packages if `$OCEAN_REPO_PATH` is available.
     Write report to `.ai/para/areas/api-surface-audit/YYYY-MM.md`."

3. **audit-supply-chain** — Supply chain security review
   - Subagent instruction: "Run the supply chain audit. Check both `@nx/*`
     and `@nx-cloud/*` scoped packages on npm. Use `$NX_REPO_PATH` for
     workflow inspection. Write report to
     `.ai/para/areas/supply-chain-security/YYYY-MM.md`."

4. **scan-community** — Community sentiment analysis
   - Subagent instruction: "Run the community sentiment scan. Cover both
     `nrwl/nx` and `nrwl/nx-cloud` (if public) GitHub issues and discussions.
     Write report to `.ai/para/areas/community-sentiment/YYYY-MM.md`."

**Group B — Web research scans** (no repo access needed):

5. **scan-competitors** — Competitor changelog analysis
6. **scan-frameworks** — Framework & bundler ecosystem tracking
7. **scan-runtimes** — Node.js & runtime tracking
8. **scan-ai-landscape** — AI dev tools landscape scan

Each writes to its own `.ai/para/areas/` directory.

**Group C — Internal management audits** (Linear MCP, no repo access needed):

9. **audit-capacity** — Team capacity & sequencing risk analysis
   - Subagent instruction: "Run the team capacity audit. Use Linear MCP to
     pull issue assignments, project leads, and due dates across all active
     teams. Analyze the next 4-6 week window for conflicts. Write report
     to `.ai/para/areas/team-capacity/YYYY-MM.md`."

10. **audit-project-health** — Long-running project & exit criteria audit
    - Subagent instruction: "Run the project health audit. Use Linear MCP to
      pull all In Progress projects, check milestone completion, identify
      zombies (all milestones done, project still open), flag overdue target
      dates and scope creep. Track revenue projects. Write report to
      `.ai/para/areas/project-health/YYYY-MM.md`."

11. **audit-customer-deps** — Customer dependency concentration mapping
    - Subagent instruction: "Run the customer dependency audit. Use Linear MCP
      to search for known strategic customers across all teams. Map customer
      to feature dependencies, check engagement recency, assess DPE capacity.
      Write report to `.ai/para/areas/customer-deps/YYYY-MM.md`."

**Group D — Monthly digest** (only if needed):

12. **nx-monthly-digest** — Cross-functional digest + technical changelog
    - Only runs if: current month > lastMonthlyDigest, OR explicitly requested.
    - Uses the full `/nx-monthly-digest` skill instructions.
    - Writes to `.ai/para/areas/scan-audit/monthly-digests/`.

### Launching

Launch ALL scans simultaneously as background Task subagents. Use
`run_in_background: true` for all of them. Do NOT wait for one before
starting another.

For each subagent, provide:
- The full command file content (read from `dot_claude/commands/<name>.md`)
- Any repo paths
- Current date/month
- The `LOOKBACK_START` date (e.g., `2025-12-29` for a 60-day window)
- The `SCAN_DATA_DIR` path (e.g., `/tmp/scan-data-1772253563`) for cached GitHub data
- Path to previous report(s) within the lookback window (for delta comparison)

## Step 3: Wait for All Scans to Complete

Wait for all background subagents to finish. As each completes, note:
- Success or failure
- Key finding counts (parse from the report it wrote)
- Any errors or access issues

If a scan fails, log the error but don't retry — note it in the report.

## Step 4: Read All Reports

After all scans complete, read each report file:

```
.ai/para/areas/dependency-health/YYYY-MM.md
.ai/para/areas/api-surface-audit/YYYY-MM.md
.ai/para/areas/supply-chain-security/YYYY-MM.md
.ai/para/areas/community-sentiment/YYYY-MM.md
.ai/para/areas/competitor-intel/YYYY-MM.md
.ai/para/areas/framework-ecosystem/YYYY-MM.md
.ai/para/areas/runtime-tracking/YYYY-MM.md
.ai/para/areas/ai-dev-landscape/YYYY-MM.md
.ai/para/areas/team-capacity/YYYY-MM.md
.ai/para/areas/project-health/YYYY-MM.md
.ai/para/areas/customer-deps/YYYY-MM.md
```

Extract from each:
- Summary / key findings
- Severity counts (critical, warning, etc.)
- Delta vs. previous report (new items, resolved items)
- Action items

## Step 5: Synthesize Unified Weekly Report

Write to `.ai/para/areas/scan-audit/weekly/YYYY-WNN.md`:

```markdown
# Nx Platform Intelligence — Week {NN}, {Year}

_Generated: {datetime}_
_Scans run: {list of scans that completed}_
_Scans failed: {list of any that failed, or "None"}_

## TL;DR — What's New Since Last Week

{5-10 bullets, ranked by urgency. Each bullet should be actionable
or informative enough to decide whether to dig deeper. Format:}

- **[AREA]** {finding}. {action needed or "FYI only"}.

Example:
- **[Security]** New CVE in `minimatch` affects nx@22.5.2. Already patched in 22.5.3. FYI only.
- **[Competitors]** Turborepo shipped remote caching v2 with content-addressable storage. Review implications for Nx Cloud positioning.
- **[Dependencies]** `chalk` hasn't published in 14 months. Now 🟠 Warning. We already migrated to picocolors — can remove.

## Dashboard

| Scan | Status | Findings | Delta |
|------|--------|----------|-------|
| Dependencies | {status emoji} | {N critical, N warning} | {+/-N vs last week} |
| Supply Chain | {status emoji} | {status} | {change} |
| API Surface | {status emoji} | {N high, N medium} | {+/-N} |
| Community | {status emoji} | {N pain points} | {+/-N} |
| Competitors | {status emoji} | {N highlights} | {new items} |
| Frameworks | {status emoji} | {N compat risks} | {+/-N} |
| Runtimes | {status emoji} | {N action items} | {+/-N} |
| AI Landscape | {status emoji} | {N highlights} | {new items} |
| **Internal Audits** | | | |
| Team Capacity | {status emoji} | {N high-risk people} | {+/-N overdue} |
| Project Health | {status emoji} | {N zombies, N overdue} | {change} |
| Customer Deps | {status emoji} | {N concentration risks} | {churned/cooling} |

Status: ✅ = no action needed, ⚠️ = items to review, 🔴 = action required

## Action Required

{Items from ANY scan that need immediate attention. Group by urgency.
If nothing, say "None this week."}

### This Week
{Must-do items}

### Soon (This Month)
{Should-do items}

### Watching
{Monitor, no action yet}

## Scan Summaries

### Dependencies
{2-3 sentence summary from dependency-health report. Link to full report.}
[Full report](.ai/para/areas/dependency-health/YYYY-MM.md)

### Supply Chain Security
{2-3 sentence summary.}
[Full report](.ai/para/areas/supply-chain-security/YYYY-MM.md)

### API Surface
{2-3 sentence summary.}
[Full report](.ai/para/areas/api-surface-audit/YYYY-MM.md)

### Community Sentiment
{2-3 sentence summary.}
[Full report](.ai/para/areas/community-sentiment/YYYY-MM.md)

### Competitors
{2-3 sentence summary.}
[Full report](.ai/para/areas/competitor-intel/YYYY-MM.md)

### Frameworks & Bundlers
{2-3 sentence summary.}
[Full report](.ai/para/areas/framework-ecosystem/YYYY-MM.md)

### Runtimes (Node.js, Bun, Deno)
{2-3 sentence summary.}
[Full report](.ai/para/areas/runtime-tracking/YYYY-MM.md)

### AI Dev Tools Landscape
{2-3 sentence summary.}
[Full report](.ai/para/areas/ai-dev-landscape/YYYY-MM.md)

### Team Capacity & Sequencing
{2-3 sentence summary: who's overloaded, what projects are at risk.}
[Full report](.ai/para/areas/team-capacity/YYYY-MM.md)

### Project Health
{2-3 sentence summary: zombie projects, overdue targets, scope creep.}
[Full report](.ai/para/areas/project-health/YYYY-MM.md)

### Customer Dependencies
{2-3 sentence summary: concentration risks, engagement changes, DPE load.}
[Full report](.ai/para/areas/customer-deps/YYYY-MM.md)

## Monthly Digest
{If digest ran this cycle, include TL;DR + link. Otherwise:
"Last digest: {month}. Next scheduled: {month}."}
```

## Step 6: Update State

Write updated `.ai/para/areas/scan-audit/state.json` with:
- Current run timestamp
- Current week number
- Updated finding counts from each scan
- Monthly digest month (if it ran)

## Step 7: Update README

Ensure `.ai/para/areas/scan-audit/README.md` exists and is current:

```markdown
# Scan & Audit

Weekly intelligence scans across the Nx platform. Covers dependency health,
supply chain security, API drift, community sentiment, competitor activity,
framework ecosystem, runtime changes, and AI tool landscape.

## How to Run

```
/scan-and-audit           # Full weekly scan (all 9)
/scan-and-audit quick     # Web-research scans only (fast, ~5 min)
/scan-and-audit digest    # Monthly digest only
/scan-and-audit competitors frameworks  # Specific scans
```

## Latest Reports

### Weekly
- [{latest week}](./weekly/{latest}.md)

### Monthly Digests
- [{latest month}](./monthly-digests/{latest}.md)

## Individual Scan Areas
- [Dependency Health](../dependency-health/)
- [Supply Chain Security](../supply-chain-security/)
- [API Surface Audit](../api-surface-audit/)
- [Community Sentiment](../community-sentiment/)
- [Competitor Intel](../competitor-intel/)
- [Framework Ecosystem](../framework-ecosystem/)
- [Runtime Tracking](../runtime-tracking/)
- [AI Dev Landscape](../ai-dev-landscape/)
```

## Step 8: Cleanup

```bash
# Remove cloned repos and cached GitHub data
rm -rf "$NX_TMP" "$OCEAN_TMP" "$SCAN_DATA_DIR" 2>/dev/null
```

## Step 9: Present Results

Print the TL;DR section and Dashboard table directly to the user.
Tell them where the full report is saved. Offer to:
- Dive deeper into any specific scan
- Re-run a specific scan with different scope
- Create Linear issues for action items

## Important Notes

- **Parallelism**: Launch ALL subagents at once. The skill should take
  ~10-15 minutes total (bounded by the slowest scan), not 60+ minutes
  running sequentially.
- **Idempotent**: Running twice in the same week updates the existing
  weekly report rather than creating a duplicate.
- **Graceful degradation**: If ocean can't be cloned, if npm is slow, if
  a GitHub API rate-limits — note it and continue. Never fail the whole
  run because one scan had issues.
- **Delta focus**: The weekly report should emphasize WHAT CHANGED since
  last run. The individual reports have the full picture.
- **No invention**: Every finding must trace to a source. Don't speculate
  about risks that aren't evidenced by the data.
- **LIVE DATA OVER TRAINING DATA**: This is the #1 quality rule. For
  every factual claim (version numbers, release status, issue state,
  EOL dates, download counts), verify against a live source BEFORE
  writing it. Training data is stale by definition. Use:
  - `npm view <pkg> version` for package versions
  - `$SCAN_DATA_DIR/releases/*.json` for release data (pre-fetched)
  - `$SCAN_DATA_DIR/issues/*.json` for issue data (pre-fetched)
  - `WebFetch` for changelogs, blogs, and EOL dates
  - `npm view <pkg> time.modified` for last-publish dates
  If a live API is unavailable, explicitly mark the claim as
  "unverified (from training data)" in the report.
- **Verify issue state**: Before listing any GitHub issue as an active
  pain point or action item, verify it is still OPEN using
  `gh issue view <N> --json state`. Closed issues should be noted as
  resolved, not listed as current problems. This applies to ALL scans
  that reference GitHub issues (community, dependencies, supply-chain).
- **Thoroughness over speed**: Use many tokens and subagent passes. It's
  better to spend 15 minutes and catch everything than to skim in 5
  minutes and miss a CVE or a competitor launch.
