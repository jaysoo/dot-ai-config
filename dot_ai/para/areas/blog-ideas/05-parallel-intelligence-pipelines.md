# Parallel Intelligence Pipelines: How We Scan the Ecosystem with AI Agents

*Draft - 2026-03-28*

---

As an open-source platform team, the Nx CLI group has a surface area problem. We ship plugins for Angular, React, Vue, Next.js, Vite, Rspack, and Rolldown. We run on Node, monitor Bun and Deno for compatibility. We compete with Turborepo, Moon, Bazel, Gradle, and Pants. We track TC39 proposals that could affect our runtime assumptions. We watch the AI tooling landscape because MCP and agentic development are reshaping how developers interact with build systems. And we do all of this with a small team.

Staying current on the ecosystem used to mean a rotating cast of "go read the changelogs" tasks that nobody enjoyed and everyone deprioritized. The information was stale by the time it reached a planning meeting. We needed something structural.

So we built an intelligence pipeline. It runs weekly, orchestrated entirely by AI agents, and produces a single unified report that tells us what changed, what matters, and what to do about it.

## The Architecture

The entry point is a single orchestrator skill (`/scan-and-audit`) that launches 12 scans in parallel using Claude Code's subagent spawning. Each scan is its own skill with a focused domain:

**8 external scans:**
- **Competitors** -- Turborepo, Moon, Bazel, Gradle, Pants. Changelog entries, release notes, feature announcements.
- **Frameworks** -- Angular, React, Vue, Next.js, Vite, Rspack, Rolldown. Breaking changes, new APIs, plugin-relevant shifts.
- **Runtimes** -- Node.js, Bun, Deno, TC39. Compatibility risks, new APIs to leverage, deprecations to handle.
- **AI landscape** -- MCP ecosystem, Claude Code, Cursor, Copilot, Codex. Relevant to our own AI roadmap.
- **Dependencies** -- Health audit of deps across Nx CLI and Cloud packages. Unmaintained, deprecated, or at-risk libraries.
- **Supply chain** -- npm audit, 2FA enforcement, trusted publishing, token hygiene. We learned the hard way that package compromise is a real threat.
- **API surface** -- Drift between our public API and our documentation. Undocumented exports, stale docs, mismatched signatures.
- **Community** -- GitHub issues, discussions, Stack Overflow, npm download trends, plus Pylon support data from paid customers.

**3 internal scans:**
- **Team capacity** -- Overloaded individuals, overlapping project leads, overdue items, unassigned work. Pulls from Linear.
- **Project health** -- Long-running projects without exit criteria, zombie projects with completed milestones but open issues.
- **Customer dependencies** -- Concentration risk where key features depend on a small number of validation customers.

**1 monthly addition:**
- **Cross-functional digest** -- Unified changelog pulling from Nx GitHub releases, Cloud changelog, infrastructure repo, and Linear project updates. Runs on the first scan of each month.

The scans execute concurrently. A full run takes 8-12 minutes depending on API response times, compared to the 4-6 hours of manual work it replaced.

## The Pre-Fetching Pattern

The first version of this pipeline had a brutal UX problem. Each subagent independently called the GitHub API via the `gh` CLI, which authenticates through 1Password. Twelve parallel agents, each hitting multiple GitHub repos, meant 40+ 1Password authentication prompts appearing on screen in rapid succession. It was unusable.

The fix was a pre-fetching layer in the orchestrator. Before spawning any subagents, the orchestrator fetches ALL GitHub data -- releases, issues, PRs across 21 repositories -- in a single authenticated session. One 1Password prompt. The data lands as JSON files in `/tmp/scan-data-*/`, keyed by repo and data type.

Subagents read from cache first. They only fall back to live API calls if their specific data is missing from the cache (which happens when we add a new repo to track mid-cycle). This reduced auth friction from 40+ prompts to exactly 1.

The pattern is generalizable: whenever you have N parallel agents that share an authenticated data source, pre-fetch into a shared cache and let agents read locally. The orchestrator pays the auth cost once; workers stay stateless and fast.

## Delta Tracking

Raw scan output is noisy. "You have 5 critical dependency issues" is not actionable if you had 5 last week too. What's actionable is "you have 2 NEW critical dependency issues since last week."

Each scan writes its findings alongside a `state.json` file that records counts and hashes from the previous run. On the next execution, the scan compares current state against stored state and annotates the delta. The unified report surfaces these deltas prominently:

```
Dependencies: 7 critical (was 5) [+2 new]
Supply Chain: 3 warnings (unchanged) [no action needed]
Community: GitHub issue volume up 18% vs. 30-day average [investigate]
```

This prevents alarm fatigue. The team only reacts to what changed. Stable findings fade into the background. New findings get flagged with urgency ranking.

## The 60-Day Lookback Window

An early version scanned the current calendar month. This created a blind spot: a release published on January 30th would appear in the January scan, disappear from February's scan on February 1st, and never get acted on if nobody checked that specific week.

We switched to a rolling 60-day lookback. Every scan examines the prior 60 days of activity. This means events near month boundaries get at least 4-5 weeks of visibility in subsequent reports. The delta tracking ensures we don't re-alert on items that were already surfaced and acknowledged.

## Graceful Degradation

External dependencies fail. npm registries go slow. GitHub rate-limits kick in. The Ocean (Nx Cloud) repo sometimes can't clone in CI-like environments. We designed every scan to degrade gracefully:

- If a GitHub repo is unreachable, the scan reports what it can from cache and flags the gap.
- If npm audit times out, the dependency scan skips that check and notes it in the report.
- If Linear's API is paginating slowly, the capacity scan works with partial data rather than hanging.

No single failure takes down the pipeline. The unified report includes a "Data Gaps" section that lists anything that couldn't be fetched, so the reader knows where coverage was incomplete.

## The Output

The unified report follows a consistent structure:

1. **TL;DR** -- 5-10 bullets ranked by urgency. This is what gets read in standup.
2. **Status dashboard** -- One-line status for each scan domain. Green/yellow/red with delta indicators.
3. **Detailed findings** -- Grouped by domain, with links to source material.
4. **Action items** -- Triaged into three buckets:
   - **This Week**: Blocking or time-sensitive. Assigned to specific people.
   - **Soon**: Important but not urgent. Goes into next sprint planning.
   - **Watching**: Trends to monitor. No action yet.

The report writes to `.ai/` and gets referenced in weekly planning. Over time, the action item history becomes a useful record of how we responded to ecosystem changes.

## Real Impact

The pipeline paid for itself in week two. Our community scan flagged a cluster of GitHub issues reporting lockfile parsing failures when using Bun as a package manager. The scan identified the pattern before it hit our own issue tracker at volume: Bun was generating a lockfile that claimed to be Yarn format but contained structural deviations that broke every tool that parsed it ([oven-sh/bun#16252](https://github.com/oven-sh/bun/issues/16252)).

Without the scan, we would have spent hours debugging our own lockfile parser before discovering it was an upstream bug. Instead, we had the root cause identified, a workaround documented, and a tracking issue linked -- all before the first customer escalation.

Other catches: a Turborepo release that quietly added a feature we'd been asked about (let us update our comparison docs proactively), a Node.js deprecation that would break a test utility in 6 months (filed and fixed in the same sprint), and a pattern of support tickets around a specific Cloud feature that indicated a documentation gap rather than a code bug.

## What We Learned

**Orchestration matters more than individual agent quality.** Any single scan could be run manually. The value is in running all of them concurrently, with shared context, delta tracking, and a unified output format. The orchestrator is where the design effort goes.

**Cache everything stateful.** Authentication, API responses, previous run state. Agents should be stateless workers that read from shared context and write structured output. This makes them independently testable and replaceable.

**Humans set thresholds, agents surface signals.** We don't let the pipeline auto-file issues or send alerts. It produces a report. A human reads the TL;DR, decides what matters this week, and takes action. The pipeline's job is to make sure nothing gets missed, not to make decisions.

**Start with the output format.** We designed the unified report structure first, then worked backward to what each scan needed to produce. This kept the scans focused and the output consistent.

The pipeline runs every Monday morning. By the time the team opens their laptops, the ecosystem state is already summarized and waiting. It's not magic -- it's twelve focused agents, good caching, and a well-designed orchestrator. But it's replaced a class of work that was important, tedious, and perpetually deprioritized. That's exactly where AI agents should live.
