# How We Use Nx + AI Agents to Triage 450+ Issues Without Burning Out

Nx has over 450 open issues spread across multiple repositories. At any given time, some of those are stale, some are duplicates, some were fixed months ago but never closed, and some are genuinely important bugs that need attention. Manual triage of this backlog is soul-crushing work. You open an issue, read the thread, cross-reference PRs, check if the reporter's Nx version predates a fix, decide whether to close or escalate, and then do it 449 more times. Nobody on the team wants to do it, which means it doesn't get done, which means the backlog grows, which means nobody wants to do it even more.

We decided to throw AI agents at the problem. Not in the "let an LLM auto-close issues and hope for the best" sense. In the "build a pipeline that does the tedious legwork so humans only review what matters" sense. Here's how it works.

## The Scan-and-Audit Pipeline

Every week, we run an orchestrator that kicks off 12 parallel AI agent scans. Eight are external-facing, three are internal audits, and one is a monthly cross-functional digest. The whole thing takes about 10-15 minutes, bounded by the slowest scan.

**External scans (8):**

- **Competitors** — Turborepo, Moon, Bazel, Gradle, Pants. What shipped this month? Any features we should respond to?
- **Frameworks** — Angular, React, Next.js, Remix, Nuxt, Vue, Vite, Rspack, Rolldown, esbuild, SWC. Breaking changes? New APIs that affect our plugins?
- **Runtimes** — Node.js, Bun, Deno. Deprecations, new APIs, compatibility risks.
- **AI landscape** — MCP ecosystem, Claude Code, Cursor, Copilot, Codex. Relevant to our own AI roadmap.
- **Dependencies** — Unmaintained, deprecated, or at-risk dependencies across all Nx packages.
- **Supply chain** — npm audit, 2FA enforcement, OIDC/SLSA provenance, typosquat monitoring across 39 publishable packages. This one runs weekly without exception.
- **API surface drift** — Undocumented exports, stale docs, mismatched signatures between our public API and documentation.
- **Community sentiment** — GitHub issues, discussions, Stack Overflow, npm download trends. What are people struggling with? What are they praising?

**Internal audits (3), all pulling from Linear:**

- **Team capacity** — Who's overloaded? Overlapping project leads? Overdue items?
- **Project health** — Zombie projects with completed milestones but still "In Progress." Scope creep. Missing exit criteria.
- **Customer dependencies** — Which strategic features have concentration risk on a single validation customer?

**Monthly digest:**

- Cross-functional changelog covering all 6 engineering teams, synthesized from GitHub releases, Linear projects, and cloud infrastructure changes.

Each scan writes a structured markdown report. The orchestrator reads all 12 reports and synthesizes a unified weekly briefing with a TL;DR, a dashboard table, and prioritized action items.

## The Pre-Fetch Problem (and Solution)

Here's a detail that took us a while to figure out. Our `gh` CLI wraps 1Password for authentication. Every `gh` invocation in a separate process triggers a 1Password auth prompt. When you launch 8 parallel AI agent subagents and each one makes 5+ GitHub API calls, that's 40+ auth prompts popping up on your screen. It makes the pipeline unusable.

The fix: pre-fetch everything in a single auth session before launching subagents. The orchestrator runs about 30 sequential `gh` calls up front, covering 21 repositories:

```bash
SCAN_DATA_DIR="/tmp/scan-data-$(date +%s)"
mkdir -p "$SCAN_DATA_DIR"/{releases,issues,api}

# Releases for 21 repos (competitors, frameworks, runtimes, AI tools)
for repo in vercel/turborepo moonrepo/moon bazelbuild/bazel \
  nodejs/node oven-sh/bun denoland/deno angular/angular \
  vitejs/vite ...; do
  slug="${repo//\//-}"
  gh release list --repo "$repo" --limit 15 \
    --json tagName,publishedAt,body \
    > "$SCAN_DATA_DIR/releases/$slug.json"
done

# Issue data, discussions, top-reaction issues, search results...
```

The result is a `/tmp/scan-data-*/` directory full of JSON files. Subagents read from this cache instead of hitting the GitHub API directly. One auth prompt instead of forty. The JSON format matches `gh --json` output, so existing filters in the subagent commands work unchanged.

This takes about 60-90 seconds. Totally worth it.

## Delta Tracking: What Changed, Not What Is

Nobody wants to read a full inventory of 450 issues every week. The useful signal is _what changed since last time_.

We maintain a `state.json` file that records finding counts from each scan:

```json
{
  "lastRun": "2026-03-21T10:00:00Z",
  "lastWeeklyReport": "2026-W12",
  "findings": {
    "dependencies": { "critical": 2, "warning": 5 },
    "supply-chain": { "status": "clear" },
    "competitors": { "highlights": 4 },
    "capacity": { "high-risk-people": 2, "overdue-items": 8 }
  }
}
```

Each weekly report computes deltas against the previous state. The dashboard shows "+2 critical deps" or "-3 overdue items," not absolute numbers. The TL;DR section is 5-10 bullets ranked by urgency, each actionable enough to decide whether to dig deeper:

> - **[Security]** New CVE in `minimatch` affects nx@22.5.2. Already patched in 22.5.3. FYI only.
> - **[Competitors]** Turborepo shipped remote caching v2 with content-addressable storage. Review implications for Nx Cloud positioning.
> - **[Dependencies]** `chalk` hasn't published in 14 months. We already migrated to picocolors -- can remove.

## Graceful Degradation

If one scan fails (rate limit, clone fails, npm is slow), the others continue. The weekly report notes which scans failed and moves on. We never block the whole pipeline because one GitHub API call timed out. The report's dashboard uses a simple status system: green for no action needed, yellow for items to review, red for action required, blank for scans that didn't run.

The ocean (Nx Cloud) repository clone sometimes fails due to SSH key issues. The orchestrator catches this and runs the remaining scans with Nx-only scope. You get 90% of the intelligence rather than 0%.

## Identifying Closeable Issues

The weekly scan gives us the landscape. But the real time-saver is the `identify-closeable-issues` command. This takes an assignee's open issues and analyzes each one against five closure categories:

1. **Already fixed by a merged PR** -- checks for "Fixes #" references and version-matched PRs
2. **Underlying tooling issue** -- the bug is in webpack/esbuild/TypeScript, not Nx
3. **User configuration** -- reporter resolved it themselves or root cause is documented
4. **Likely fixed by a related PR** -- no explicit link, but a PR clearly addresses the same component
5. **Workaround available** -- community confirmed a working solution

Each issue gets a confidence score starting at 50%, with evidence adding or subtracting points. Only issues at 75%+ confidence make the "recommended for closure" list. The output is a markdown report with evidence links, confidence breakdowns, and draft response templates.

The critical constraint: **it never closes anything**. It only uses read-only `gh` commands. The output is a report for human review. A 75% threshold means roughly 1 in 4 recommendations might be wrong, and that's fine because a human is making the final call.

## Ranking Issues for AI-Suitable Fixes

The `nx-easy-issues` command goes the other direction. Instead of identifying issues to close, it identifies issues that AI agents could reasonably fix. It scores issues on:

- **Core contributor involvement** -- if a maintainer already commented with guidance, the path forward is clear
- **Reproduction clarity** -- well-documented bugs with reproduction steps score higher
- **Isolation** -- simple doc fixes and deprecation tasks beat architectural changes
- **AI suitability** -- explicit HIGH/MEDIUM/LOW ratings based on whether the fix requires design decisions

Issues where an architect needs to weigh in on approach score low. Issues where someone said "this string should say X instead of Y" score high. The output is a ranked list with specific next steps for each issue.

## The Full Loop

Here's how these pieces fit together in practice:

1. **Weekly scan** runs on Monday morning. Takes 10-15 minutes. Produces a unified briefing.
2. **Review the TL;DR** and dashboard. Takes 2 minutes. Most weeks, there are 0-3 action items.
3. **Run `identify-closeable-issues`** for each team member's assigned issues. The AI reads every thread, cross-references PRs, and produces a prioritized closure report.
4. **Human reviews the closure report.** Skims the high-confidence ones (85%+), scrutinizes the medium ones (75-84%), ignores the rest. Closes what makes sense, adds a comment where needed.
5. **Run `nx-easy-issues`** to find candidates for AI-assisted fixes. Issues with clear reproduction steps and maintainer guidance get queued.
6. **AI agents draft fixes** for the easy issues. A human reviews the PR.

The tedious work -- reading 100 issue threads, checking version numbers, cross-referencing PRs, scanning competitor changelogs -- is fully automated. Humans focus on the parts that actually require judgment: deciding whether to close a borderline issue, choosing an architectural approach, reviewing a PR for correctness.

## What We Learned

**Cache aggressively, auth once.** The 1Password/GitHub auth problem nearly killed the whole approach. Pre-fetching all external data in a single session and writing it to temp files was the fix. If your AI agents need authenticated API access, solve this problem first.

**Delta over absolute.** Nobody reads a 50-page report. Everyone reads "3 new things changed." State tracking transforms the output from noise into signal.

**Report, don't act.** The temptation to have AI auto-close issues is strong. Resist it. The false positive rate at scale is too high, and the community trust cost of incorrectly closing someone's issue is not worth the time savings. AI does the analysis. Humans make the decisions.

**Graceful degradation is not optional.** When you're running 12 parallel agents against external APIs, something will fail every single week. Design for partial results from day one.

**Confidence scoring builds trust.** Showing "85% confidence: PR #12345 fixes this, reporter's version predates the fix, no follow-up comments" is fundamentally different from "AI thinks this should be closed." Transparency in reasoning makes the reports actually useful instead of anxiety-inducing.

The result: a team of 6 people manages 450+ issues across multiple repos without anyone spending their Friday afternoon in triage hell. The boring work is automated. The interesting work -- the design decisions, the architecture discussions, the community interactions that require empathy -- stays with humans. That's the trade we wanted to make.
