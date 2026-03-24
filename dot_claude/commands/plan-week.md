---
description: >
  Plan the week by reviewing all PARA areas, Linear backlog, active experiments,
  and upcoming syncs. Produces a prioritized weekly plan with concrete actions
  for each area. Use on Monday mornings or when "plan week", "weekly plan",
  "what should I focus on this week".
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

# Plan Week

Generate a prioritized weekly plan by scanning all responsibility areas, pulling
in Linear work, and ensuring high-priority areas have concrete actions scheduled.

## Arguments

$ARGUMENTS

- No arguments: full weekly plan for the current week.
- `refresh`: re-run mid-week to update priorities based on what's changed.
- `review`: end-of-week review — what got done, what carried over.

## Area Registry

Each area has a priority level that determines how it's handled in weekly planning.

**Priority levels:**
- **H (High)**: MUST have at least one concrete action this week. Flagged red if missing.
- **M (Medium)**: Should have an action OR a conscious "nothing needed this week" decision.
- **L (Low)**: Quick glance — only escalate if something is on fire.

### High Priority

| Area | Path | Weekly Action Required |
|------|------|----------------------|
| CNW Stats & Experiments | `cnw-stats/` | Run `/cnw-stats-analyzer`, review experiment results, check targets (200 Cloud yes/day, 2K starts/day). Plan or adjust experiments. |
| Supply Chain Security | `scan-audit/scans/supply-chain-security/` | Ensure `/scan-and-audit` ran this week with supply-chain included. Review findings. Weekly cadence — don't let this slip. |

### Medium Priority

| Area | Path | Weekly Check |
|------|------|-------------|
| Metrics Review | `metrics-review/` | Check npm trends, docs traffic direction. Run `/metrics-review npm` at minimum. |
| Project Health | `project-health/` | Scan for blocked/zombie projects in Linear. Any project overdue? |
| Competitor Intel | `competitor-intel/` | Glance at latest scan. Anything requiring a response this week? |
| SPACE / Productivity | `space-metrics/` | Engineering productivity concerns? Cycle times trending wrong? Blocked work? |

### Low Priority

| Area | Path | When to Escalate |
|------|------|-----------------|
| Personnel | `personnel/` | Escalate if: review cycle approaching, someone flagged concerns in 1:1 |
| Syncs | `syncs/` | Prep happens naturally before each sync — no weekly action unless topics accumulating |
| Team Capacity | `team-capacity/` | Escalate if: someone overloaded, key person OOO, hiring gap |
| Promotions | `promotions/` | Escalate if: promo cycle deadline approaching |
| Customer Deps | `customer-deps/` | Escalate if: key customer escalation or churn risk |
| Community Sentiment | `community-sentiment/` | Escalate if: viral negative thread, major complaint pattern |
| Scan & Audit | `scan-audit/` | Runs weekly — just verify it ran. Supply chain findings bubble up to H. Sub-scans: AI landscape, frameworks, runtimes, API surface, dependency health. |
| TOIL | `time-off-in-lieu/` | Annual — December only |

## Planning Flow

### Step 1: Context Gathering (parallel)

Run these in parallel to gather state:

1. **Last week's plan**: Read `.ai/para/areas/weekly-plans/` for the most recent plan.
   Check what was planned vs what got done.

2. **TODO.md**: Read `.ai/TODO.md` for in-progress and pending items.

3. **Linear current cycle**: Query active cycles for Nx CLI and related teams.
   Pull issues assigned to Jack or his direct reports that are in-progress or
   planned for this week.

4. **CNW experiment status**: Read `.ai/para/areas/cnw-stats/` for active
   experiments and latest stats. Are we hitting targets?

5. **Scan-audit state**: Read `.ai/para/areas/scan-audit/state.json` — when did
   scans last run? Any overdue?

6. **Upcoming syncs**: Check `.ai/para/areas/syncs/` for topics accumulating
   across team syncs.

7. **1:1 action items**: Scan `.ai/para/areas/personnel/*.md` for open action
   items from recent 1:1s.

8. **Promotions/reviews**: Check if any review cycle deadlines are within 4 weeks.

### Step 2: Area-by-Area Assessment

For each area in the registry, produce a one-line status and proposed action:

```
### [AREA NAME] — [H/M/L] — [STATUS EMOJI]

**Status**: One-line summary of current state.
**Last touched**: When this area was last reviewed/actioned.
**This week**: Proposed action OR "No action needed — [reason]".
```

Status emojis:
- `on-track` — healthy, no concerns
- `needs-attention` — something to address this week
- `at-risk` — overdue or trending wrong, must act
- `blocked` — can't progress without external input

### Step 3: Compile Weekly Plan

Group actions by day preference (not strict time-blocking, just suggested flow):

```markdown
# Weekly Plan — {WEEK_START} to {WEEK_END}

## Carry-Over from Last Week
- [ ] Items that didn't get done (with reason)

## This Week's Focus

### Must Do (from H areas + escalated items)
- [ ] CNW: [specific action — e.g., "Review experiment X results, decide on next variant"]
- [ ] CNW: [specific action — e.g., "Check daily starts and Cloud opt-in against targets"]
- [ ] Supply Chain: [specific action — e.g., "Verify scan-audit ran, review supply-chain findings"]
- [ ] [Any escalated items from M/L areas]

### Should Do (from M areas)
- [ ] Metrics: [specific action]
- [ ] Project Health: [specific action]
- [ ] Competitor Intel: [specific action]
- [ ] SPACE: [specific action]

### If Time Permits (from L areas with pending items)
- [ ] [Only items that are actually pending, not routine]

## Syncs & 1:1s This Week
- [ ] [Day]: [Sync name] — Topics: [from upcoming sync sections]
- [ ] [Day]: 1:1 with [name] — Follow up: [from action items]

## Active Experiments
| Experiment | Area | Status | Action This Week |
|-----------|------|--------|-----------------|
| [name] | CNW | [running/paused/needs decision] | [what to do] |

## Decisions Needed
- [ ] [Any pending decisions surfaced from Linear, syncs, or area reviews]

## End-of-Week Checklist
- [ ] CNW targets checked (starts/day, Cloud opt-in/day)
- [ ] Supply chain scan verified
- [ ] Weekly plan items marked done or carried over
- [ ] Any kudos to capture? (`/kudos check`)
```

### Step 4: Save & Confirm

1. Save the plan to `.ai/para/areas/weekly-plans/{WEEK_START}.md`
2. Create the directory if it doesn't exist.
3. Update `TODO.md` with any new action items from the plan.
4. Print a concise summary to the console.

## End-of-Week Review (`/plan-week review`)

1. Read this week's plan.
2. For each item, check if it's done (from TODO.md, git log, Linear state).
3. Produce a scorecard:

```markdown
## Week Review — {WEEK_START}

### Scorecard
- Must Do: 4/5 completed
- Should Do: 2/4 completed
- Experiments: 1 decision made, 1 still running

### Carried Over
- [ ] [Items moving to next week with reason]

### Wins
- [Notable accomplishments worth remembering]

### Misses
- [What didn't happen and why]
```

4. Save to `.ai/para/areas/weekly-plans/{WEEK_START}-review.md`
5. Feed carry-over items into next week's plan.

## Mid-Week Refresh (`/plan-week refresh`)

1. Read current plan.
2. Check what's done, what's blocked, what's new.
3. Re-prioritize remaining items.
4. Update the plan file in place.

## Important Notes

- **CNW experiments are non-negotiable** — every week must have at least one
  experiment-related action (launch, review, decide, iterate).
- **Supply chain is non-negotiable** — weekly verification that scans ran and
  findings reviewed. This is the one scan-audit sub-report that must not slip.
- **Don't overload the plan** — 5-7 "Must Do" items max. If more, force-rank.
- **"No action needed" is a valid answer** for M/L areas — but it must be a
  conscious decision, not a skip.
- **Pull from Linear, don't duplicate** — reference Linear issue IDs, don't
  rewrite descriptions.
- **The plan is a living doc** — update it mid-week via `refresh`, don't let
  it go stale.
