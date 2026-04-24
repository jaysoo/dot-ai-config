---
description: >
  Analyze team capacity and sequencing risk across all engineering teams.
  Checks for overloaded individuals, overlapping project leads, overdue items,
  and unassigned work. Uses Linear issue-level data. Run monthly.
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - WebFetch
  - Task
---

# Team Capacity & Sequencing Risk Audit

Analyze individual engineer workloads across all active teams to identify
capacity bottlenecks, sequencing conflicts, and staffing risks for the
upcoming 4-6 week window.

## Scope

$ARGUMENTS

If no arguments: analyze all active teams (Nx CLI, Infrastructure, Nx Cloud,
RedPanda, Quokka) for the next 4-6 weeks. If arguments provided (e.g.,
"CLI only", "next 2 weeks"): scope accordingly.

## File Management

Area directory: `.ai/para/areas/team-capacity/`

1. Current month as `YYYY-MM` (for report naming).
2. If `.ai/para/areas/team-capacity/YYYY-MM.md` exists, read it and
   **update in place**. Preserve lines starting with `> NOTE:`.
3. If not, create new. Ensure README.md exists and links this report.

### README.md structure

```markdown
# Team Capacity Analysis

Monthly analysis of engineering team capacity, sequencing risks, and
workload distribution. Used for sprint planning and resource allocation.

## Reports

- [YYYY-MM](./YYYY-MM.md) — {one-line highlight}
```

## Data Collection

### Step 1: Get Active Teams and Projects

Use Linear MCP to pull:

1. **All active teams** — `list_teams`
2. **All started projects** — `list_projects` with state "started"
3. **All planned projects** starting within the next 6 weeks — `list_projects`
   with state "planned", filter by `startDate`

### Step 2: Per-Person Issue Load

For each team member who leads a project or has significant assignments:

1. **In Progress issues** — `list_issues` with assignee={name}, state="In Progress"
2. **Todo issues** — `list_issues` with assignee={name}, state="Todo"
3. **Overdue items** — From In Progress issues, check for due dates that have passed
4. **Project lead responsibilities** — Cross-reference with project data

### Step 3: Identify Conflicts

Look for:

- **Double-booked project leads**: Same person leading 2+ projects with
  overlapping date ranges
- **Overdue prerequisites**: Issues that block planned projects but are
  past their due date
- **Capacity imbalance**: Team members with 0-1 items vs. team members
  with 10+ items on the same team
- **Unassigned work**: Issues in Todo/In Progress with no assignee,
  particularly in active projects
- **Cross-team commitments**: People assigned issues across multiple teams

### Step 4: Unassigned Issue Audit

For each active team, check for:
- Unassigned issues in "Todo" or "In Progress" state
- Unassigned issues with High or Urgent priority
- Security-related issues (CVEs, vulnerabilities) without owners

## Analysis Framework

### Per-Person Assessment

For each person with significant workload:

| Metric | What to Check |
|--------|---------------|
| **In Progress count** | How many concurrent items? >5 is a flag |
| **Overdue count** | Items past their due date |
| **Project lead count** | How many projects they lead |
| **Date conflicts** | Overlapping project windows |
| **Cross-team load** | Issues across multiple teams |

### Risk Rating

- **HIGH**: 5+ overdue items, OR 2+ overlapping project leads, OR critical
  path blocker is overdue
- **MEDIUM-HIGH**: 2+ project leads starting same week, OR 3+ overdue items
- **MEDIUM**: Some overdue items but manageable, OR conditional on deferral
- **LOW**: Light load, no overdue items, single project focus

### Team-Level Assessment

For each team:
- Total In Progress / Todo / Overdue across all members
- Available capacity (members with light loads)
- Unassigned work queue size
- Whether planned project start dates are realistic given current load

## Write the Report

```markdown
# Team Capacity & Sequencing Risk — {Month Year}

_Last updated: {datetime}_
_Window analyzed: {date range}_

## Executive Summary

{3-5 bullets: most critical capacity risks and recommendations}

## Risk Dashboard

| Person | Team | In Progress | Todo | Overdue | Upcoming Projects | Risk |
|--------|------|-------------|------|---------|-------------------|------|
| ... | ... | ... | ... | ... | ... | ... |

## Team: {Team Name}

### {Person Name} — {RISK LEVEL}

**Active work:**
- {issue ID}: {title} (due: {date}, status)
- ...

**Upcoming project leads:**
- {project name} ({date range})
- ...

**Conflicts:**
- {description of sequencing conflict}

**Recommendation:**
- {specific actionable recommendation}

{Repeat for each person with MEDIUM or higher risk}

### Available Capacity
- {Person}: {current load summary, why they have bandwidth}

### Unassigned Work
| Issue | Priority | Project | Notes |
|-------|----------|---------|-------|
| ... | ... | ... | ... |

{Repeat for each team}

## Cross-Team Risks

{Issues that span multiple teams or where one team blocks another}

## Action Items

| # | Action | Owner | Priority | Why |
|---|--------|-------|----------|-----|
| 1 | ... | ... | ... | ... |
```

Save to `.ai/para/areas/team-capacity/YYYY-MM.md` and update README.md.
