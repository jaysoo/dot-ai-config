# Blog Post Ideas

Content ideas for blog posts about AI-assisted development workflows, Nx + AI, and developer productivity.

## Evaluation Criteria

| Signal | Weight | Notes |
|--------|--------|-------|
| Audience appetite | High | Based on trending topics in AI dev space |
| Unique angle | High | What we do differently vs what everyone writes about |
| Concrete examples | Medium | Can we show real workflows, not just theory? |
| Nx tie-in | Medium | Does it reinforce Nx's position in AI-assisted dev? |

## Ideas

### 1. Building a Self-Improving AI Workflow: Skills, Reflection, and Feedback Loops
- **Appetite:** Very High
- **Core hook:** Most "custom instructions" articles are static. Ours *evolve*. The `/reflect` -> detect repeatable patterns -> create skill -> track with USAGE.md -> prune unused skills loop is novel.
- **Key insight:** USAGE.md invocation tracking as a pruning signal -- if a skill isn't getting invoked, either the trigger instructions are wrong or it's not useful.
- **Audience:** Developers using Claude Code, Cursor, or any AI coding tool
- **Status:** Idea

### 2. How We Use Nx + AI Agents to Triage 450+ Issues Without Burning Out
- **Appetite:** Very High
- **Core hook:** Monorepo + AI is "the topic of 2026." The scan-and-audit pipeline (12 parallel scans, pre-fetched GitHub data to avoid 40 auth prompts, delta tracking, graceful degradation) is production-grade.
- **Key insight:** Full loop from scan -> triage -> auto-fix candidates -> human reviews design decisions only. `/identify-closeable-issues` and `/nx-easy-issues` as concrete examples.
- **Audience:** OSS maintainers, engineering managers, monorepo teams
- **Status:** Idea

### 3. CLAUDE.md as Project Governance: Why Your AI Config Belongs in Version Control
- **Appetite:** Very High
- **Core hook:** The dot-ai-config pattern (single source of truth, git-synced, auto-sync hooks, guard skill to prevent direct edits). Most devs dump instructions into a chat window. This is versioned, reviewable, PR-able.
- **Key insight:** Treat AI instructions like infrastructure code. Dual CLAUDE.md/CODEX.md for different tools adds depth.
- **Audience:** Any developer using AI tools, broadest reach
- **Status:** Idea

### 4. Living Architecture Docs That Actually Stay Current
- **Appetite:** High
- **Core hook:** Architecture files that update incrementally via `/reflect` after each session. Captures not just *what* code does but *why* (design decisions, workarounds, gotchas).
- **Key insight:** Loading architecture context at session start means every AI interaction starts with accurate context. Solves "docs are always stale."
- **Audience:** Tech leads, staff engineers, anyone who writes (or avoids writing) architecture docs
- **Status:** Idea

### 5. Parallel Intelligence Pipelines: Scanning Competitors, Dependencies, and Community Sentiment with AI Agents
- **Appetite:** High
- **Core hook:** Director/staff-level audience. Scan-and-audit orchestrator running 8 external + 3 internal audits + monthly digest in parallel, with delta tracking.
- **Key insight:** Pre-fetching pattern (one 1Password auth -> cached JSON -> subagents read cache). "Building your own CI for market intelligence."
- **Audience:** Engineering directors, heads of platform, OSS maintainers
- **Status:** Idea

### 6. From Voice Notes to Structured Knowledge: The Dictation-to-Action Pipeline
- **Appetite:** Medium-High
- **Core hook:** `/dictate` auto-detects sync meetings, routes to correct team file, updates personnel notes, feeds into weekly planning.
- **Key insight:** "I talk, Claude organizes" -- but the substance is routing logic and structured output via PARA.
- **Audience:** Engineering managers, anyone managing multiple teams/meetings
- **Status:** Idea

### 7. Measuring What Matters: Tracking AI Skill Effectiveness Without a Dashboard
- **Appetite:** Medium-High
- **Core hook:** Lightweight approach (USAGE.md counts, COMPLETED.md archives, daily SUMMARY.md, feedback memory loop) vs heavyweight metrics platforms.
- **Key insight:** "You don't need DORA dashboards if you have a text file that tracks what shipped and which AI skills contributed." Controversial enough to get engagement.
- **Audience:** Engineering managers, productivity nerds, DORA skeptics
- **Status:** Idea

### 8. The Task Planning Pattern: Why AI Should Plan Before It Codes
- **Appetite:** Medium
- **Core hook:** Counter-narrative to "just vibe code it." Plan-task -> approve -> execute -> reflect cycle with explicit separation of planning from execution.
- **Key insight:** `.ai/yyyy-mm-dd/tasks/` convention with alternatives explored, expected outcomes, one-commit-per-step granularity produces better outcomes than yolo prompting.
- **Audience:** Developers learning to work with AI agents effectively
- **Status:** Idea

### 9. MCP as Your Personal Knowledge Layer: Building a MyNotes Server for AI Context
- **Appetite:** Medium
- **Core hook:** Most MCP content focuses on external APIs (Slack, GitHub). MyNotes indexes `.ai/` content for semantic search over your own task history, specs, TODOs.
- **Key insight:** MCP as *personal* infrastructure. The "ALWAYS use MyNotes MCP first" priority rule shows how to compose MCP servers with clear precedence.
- **Audience:** Developers building MCP servers, Claude Code power users
- **Status:** Idea

### 10. Encoding Team Knowledge into AI Skills: From 1:1 Prep to Kudos to Capacity Audits
- **Appetite:** Medium
- **Core hook:** `/1-on-1-prep` pulls from personnel notes + Linear + recent PRs. `/kudos` captures recognition. `/audit-capacity` detects overloaded individuals. Management practices as executable AI skills.
- **Key insight:** "What if your management playbook was executable?" Audience is engineering managers who want to be intentional but don't have time.
- **Audience:** Engineering managers, directors
- **Status:** Idea

## Meta-Narrative

The common thread: **AI workflows that compound over time** rather than one-shot interactions. If doing a series, this is the unifying theme.

### Recommended Sequencing
1. Start with **#1 or #3** -- broadest audience, directly what devs are searching for
2. Follow with **#2** -- strongest differentiator (Nx-specific, production-grade), also works as conference talk
3. **#5** for "wow factor" with technical audience
4. Remaining posts based on feedback from first few

## Trend Context (as of 2026-03)

- Claude Code: 46% "most loved" among devs, 41% usage (surpassed Copilot's 38%)
- 95% of developers use AI tools at least weekly; 56% report 70%+ of engineering work with AI
- MCP hit production maturity; TypeScript SDK has 34,700+ dependent projects
- Monorepo + AI is a dominant narrative ("2026 is the year of the monorepo")
- METR redesigned their developer productivity study -- measurement is an active debate
- Custom instructions / skills emerging as a major best practice category
