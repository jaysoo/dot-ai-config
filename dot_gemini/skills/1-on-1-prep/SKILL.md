---
name: one-on-one-prep
description: >
  Prepare for 1:1 meetings with direct reports. Use when user says "prep for
  1:1 with <name>", "prepare for my meeting with <name>", "what should I
  discuss with <name>", or any variation of 1:1/one-on-one preparation.
  Also use when user asks about a report's recent work, status, or talking
  points for an upcoming conversation. Always use this skill even if the
  user just says "1:1 <name>" or "<name> 1:1".
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Task
---

# 1:1 Prep

Prepare a focused 1:1 prep document for a meeting with a direct report.

## Inputs

The user will provide a name (first name, full name, or handle). Use this to
locate the relevant files and Linear data.

## Step 1: Resolve the person

Search for the person across the `.ai/` directory structure:

```
.ai/
  TODO.md
  para/
    areas/
      syncs/<team-name>.md
      personel/<name-of-report>.md
```

1. `Glob` for files matching the name under `.ai/para/areas/personel/`.
   - Try lowercase, title case, and partial matches.
   - If multiple matches, ask the user to clarify.
2. Note which team sync file(s) mention this person (grep across
   `.ai/para/areas/syncs/*.md`).

If no personnel file exists, tell the user and proceed with whatever data
is available (Linear, TODO, sync files).

## Step 2: Gather local context

Run these in parallel where possible:

### 2a. Personnel file
Read the person's file under `.ai/para/areas/personel/<name>.md`.
Extract:
- Any open action items or follow-ups from previous 1:1s
- Notes on goals, growth areas, or ongoing themes
- Any flags (performance concerns, role changes, personal context)

### 2b. TODO.md
Grep `.ai/TODO.md` for the person's name (and common abbreviations).
Surface any items that are relevant to or blocked by this person.

### 2c. Team sync files
Read the relevant team sync file(s) from `.ai/para/areas/syncs/`.
Extract:
- Recent decisions or updates that affect this person
- Items where this person was mentioned or assigned
- Upcoming deadlines or deliverables involving them

## Step 3: Pull Linear activity (via MCP)

Use the Linear MCP to retrieve:

1. **Issues completed** by this person in the last 14 days.
   - Group by project or team.
   - Note any that were customer-escalated or tied to support tickets.
2. **Issues currently assigned** to this person that are in progress.
   - Flag anything that's been in progress for >7 days without update.
3. **Issues assigned but not started** — potential blockers or deprioritized work.

If Linear MCP is not available, skip this step and note that Linear data
was not pulled. Do NOT error out.

### Linear query guidance

When using the Linear MCP, search for issues assigned to the person.
Use their full name or email to identify them. Filter by:
- `completedAt` in the last 14 days for completed work
- `state.type: started` for in-progress work
- `state.type: unstarted` for backlog items assigned to them

## Step 4: Compose the prep document

Output a markdown document with this structure:

```markdown
# 1:1 Prep: {Name} — {Date}

## Quick Context
{1-2 sentences: their role, team, anything top-of-mind from personnel file}

## Follow-ups from Last Time
{Bullet list of open action items from personnel file. If none, say "None recorded."}

## Their Recent Work (Last 2 Weeks)
{Summarize Linear activity: what shipped, what's in flight, anything stalled.
If no Linear data, say "Linear data not available — ask them directly."}

### Shipped
- {issue title} — {brief context}

### In Progress
- {issue title} — {days in progress, any flags}

### Potential Concerns
- {stalled items, overdue work, or nothing}

## From Team Syncs
{Relevant items from sync files that involve or affect this person}

## From TODO
{Any TODO items related to this person}

## Suggested Talking Points
{3-5 suggested topics based on ALL of the above. Be specific, not generic.
Example: "Follow up on the Node 24 compat fix — it's been in progress 10 days"
NOT: "Ask about their current work"}
```

## Important Notes

- **Do NOT fabricate data.** If a section has no data, say so explicitly.
- **Be concise.** This is a prep doc, not a report. Bullet points are fine.
- **Prioritize flags.** If something looks off (stalled work, missing
  follow-ups, items at risk), call it out clearly in Suggested Talking Points.
- **Respect the personnel file.** These may contain sensitive context about
  performance or personal situations. Do not summarize this content in a way
  that would be inappropriate if seen on screen during a meeting.
