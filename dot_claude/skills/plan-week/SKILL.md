---
name: plan-week
description: >
  Weekly planning assistant. Reviews all PARA areas by priority, pulls Linear
  backlog, checks active experiments, and produces a prioritized action plan.
  Use when user says "plan my week", "weekly plan", "what should I focus on",
  "Monday planning", "plan the week", "weekly priorities", or starts the week
  and wants to get organized. Also triggers on "mid-week refresh" or
  "end of week review".
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - WebFetch
  - Agent
  - mcp__Linear__list_issues
  - mcp__Linear__list_teams
  - mcp__Linear__list_projects
  - mcp__Linear__list_cycles
  - mcp__Linear__get_issue
  - mcp__Linear__get_project
  - mcp__MyNotes__extract_todos
  - mcp__MyNotes__search_ai_content
---

# Plan Week Skill

This skill wraps the `/plan-week` command for natural language invocation.

When triggered, determine the mode from context:

| User says | Mode |
|-----------|------|
| "plan my week", "weekly plan", "Monday planning" | Full plan (default) |
| "refresh the plan", "update weekly plan", "mid-week check" | `refresh` |
| "how'd the week go", "weekly review", "end of week" | `review` |

Then execute the full `/plan-week` command logic as documented in
`~/.claude/commands/plan-week.md`.

## Key Behaviors

1. **Always start by reading the last weekly plan** to establish continuity.
2. **Gather context in parallel** — don't sequentially read every area.
3. **Be opinionated about priorities** — the area registry has explicit H/M/L
   ratings. Don't let the user skip H items without acknowledging the skip.
4. **CNW experiments and supply chain security are non-negotiable weekly items.**
5. **Keep the plan concise** — 5-7 Must Do items max. This is a focusing tool,
   not a dump of everything possible.
6. **Reference existing commands** — suggest running `/cnw-stats-analyzer`,
   `/metrics-review`, `/kudos check` etc. rather than inlining their logic.

## Arguments

$ARGUMENTS
