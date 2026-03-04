---
description: >
  Audit project health across Linear. Identifies long-running projects without
  clear exit criteria, zombie projects with completed milestones but open issues,
  and revenue stream coordination gaps. Run monthly.
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - WebFetch
  - Task
---

# Project Health & Exit Criteria Audit

Identify projects that have outlived their useful scope, need to be graduated,
split, or killed. Also tracks revenue-impacting projects to ensure coordination.

## Scope

$ARGUMENTS

If no arguments: audit all In Progress projects across all teams, plus any
Planned projects starting within 30 days. If arguments provided (e.g.,
"CLI only", "revenue projects"): scope accordingly.

## File Management

Area directory: `.ai/para/areas/project-health/`

1. Current month as `YYYY-MM` (for report naming).
2. If `.ai/para/areas/project-health/YYYY-MM.md` exists, read it and
   **update in place**. Preserve lines starting with `> NOTE:`.
3. If not, create new. Ensure README.md exists and links this report.

### README.md structure

```markdown
# Project Health

Monthly audit of Linear project health. Identifies zombie projects, scope creep,
missing exit criteria, and revenue coordination gaps.

## Reports

- [YYYY-MM](./YYYY-MM.md) — {one-line highlight}
```

## Data Collection

### Step 1: Get All Active Projects

Use Linear MCP:

1. **All In Progress projects** — `list_projects` with state "started"
2. **All Planned projects** — `list_projects` with state "planned"
3. For each project, get full details with `get_project` including milestones

### Step 2: Get Initiative Context

1. **Current and upcoming initiatives** — `list_initiatives` with status
   "Active" or "Planned", include projects
2. Map projects to initiatives to understand planning cycle membership

### Step 3: Per-Project Deep Dive

For each In Progress project:

1. **Milestone completion** — What % of milestones are at 100%?
2. **Open issues** — `list_issues` with project={id}, state != "Done"
3. **Duration** — How many months since `startDate`?
4. **Target date status** — Is `targetDate` in the past?
5. **Initiative span** — How many consecutive initiatives has this appeared in?

## Analysis Framework

### Zombie Detection Rules

A project is a **zombie** if ANY of these apply:

1. **All milestones at 100%** but project status is still "In Progress"
   - These should be graduated (marked Completed)
   - Remaining open issues should be moved to team backlog

2. **No new milestones added in 60+ days** and all existing ones are complete
   - The project's scope has been fulfilled but nobody closed it

3. **Target date is 30+ days in the past** with no updated target
   - Either extend with justification or close

### Scope Creep Detection

A project has **scope creep** if:

1. **Technical work mixed with client adoption tracking**
   - Client adoption has no natural end date → should be an PARA area
   - Split into: "{Feature} GA" (project) + "{Feature} Adoption" (area)

2. **Milestones keep being added** while others complete
   - The finish line keeps moving

3. **Open issues are maintenance/bugs**, not feature milestones
   - These should be standalone backlog items, not gating project completion

### Long-Running Project Thresholds

| Duration | Action |
|----------|--------|
| 0-3 months | Normal |
| 3-6 months | Review scope — is it still the same project? |
| 6-9 months | Requires justification for continued "project" status |
| 9-12 months | Must split, graduate, or kill |
| 12+ months | **RED FLAG** — almost certainly needs restructuring |

### Revenue Stream Coordination

Identify all projects with revenue/monetization implications:

- Projects with "billing", "pricing", "paid", "enterprise", "monetization"
  in their description or issue titles
- Projects labeled "Revenue" or "Growth"
- Projects with customer pricing discussions in comments

For each revenue project, track:
- Who owns GTM coordination
- What's the launch timeline
- Are multiple revenue launches happening simultaneously
- Is Sales/CS aware

## Write the Report

```markdown
# Project Health Audit — {Month Year}

_Last updated: {datetime}_
_Projects analyzed: {N}_

## Executive Summary

{3-5 bullets: most critical findings and recommendations}

## Zombie Projects (Graduate or Kill)

Projects where all milestones are complete but project is still open.

| Project | Duration | Team | All Milestones Done? | Open Issues | Recommendation |
|---------|----------|------|---------------------|-------------|----------------|
| ... | ... | ... | ... | ... | ... |

### {Project Name}

**Duration:** {N months} (since {start date})
**Milestones:** {N/N complete}
**Open issues:** {N}
**Last milestone activity:** {date}

**What's left:**
- {list remaining open issues with IDs}

**Recommendation:** {Graduate / Kill / Split / Extend with justification}
**Action:** {specific steps to take}

## Scope Creep Projects

Projects mixing technical delivery with open-ended adoption/client work.

### {Project Name}

**Problem:** {description of scope mix}
**Proposed split:**
1. "{Feature} GA" — {time-boxed technical milestones}
2. "{Feature} Adoption" — {move to PARA area, ongoing}

## Overdue Projects

Projects past their target date.

| Project | Target Date | Days Overdue | Lead | Status |
|---------|-------------|--------------|------|--------|
| ... | ... | ... | ... | ... |

## Revenue Stream Coordination

### Active Revenue Tracks

| Track | Owner | Status | Launch Timeline | GTM Dependencies |
|-------|-------|--------|-----------------|-----------------|
| ... | ... | ... | ... | ... |

### Coordination Gaps
{Any risks from multiple revenue launches overlapping without coordination}

## Proposed Process Rule

If all milestones are at 100% and no new milestones have been added in 60+
days, auto-flag the project for graduation review.

## Action Items

| # | Action | Owner | Priority |
|---|--------|-------|----------|
| ... | ... | ... | ... |
```

Save to `.ai/para/areas/project-health/YYYY-MM.md` and update README.md.
