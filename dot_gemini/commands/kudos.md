---
description: >
  Capture value-aligned kudos for team members. Supports manual entry
  and automated discovery from Linear, Pylon, and Notion. Use when
  "kudos", "shoutout", "recognition", "brag doc", or "who did great work".
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - WebFetch
  - mcp__Linear__list_issues
  - mcp__Linear__list_teams
  - mcp__Linear__list_projects
  - mcp__Linear__get_issue
  - mcp__Linear__list_cycles
  - mcp__pylon__search_issues
  - mcp__pylon__get_issue
  - mcp__Notion__API-post-search
  - mcp__Notion__API-retrieve-a-page
---

# Kudos

Capture and discover value-aligned recognition for team members.

## Org Values

| Value | Short Key | What it looks like |
|-------|-----------|-------------------|
| Camaraderie | `camaraderie` | Pride without ego, owning mistakes, believing in mission |
| Truth over Comfort | `truth` | Speaking up, honest disagreement, respectful candor |
| Tackling Impossible Problems | `tackling` | Bold ideas, building what others won't try, seeing the future |
| Highly Aligned Efforts | `aligned` | Clear commitments, ownership, keeping info accessible |
| A Powerful & Easy Product | `product` | Frictionless defaults, simple config, anticipating customer needs |

## Arguments

$ARGUMENTS

### Manual Entry
```
/kudos <name> <value> <what they did>
```
Example: `/kudos altan tackling Built the sandboxing system from scratch when everyone said it was impossible`

### Automated Discovery
```
/kudos discover                    # Scan Linear/Pylon/Notion for last 14 days
/kudos discover since=2026-03-01   # Custom date range
/kudos discover <name>             # Discover for a specific person
```

### Checklist
```
/kudos check <name>                # Quick yes/no checklist for one person
```

### Review
```
/kudos list                        # All kudos, grouped by person
/kudos list <name>                 # Kudos for one person
/kudos summary                     # Summary grouped by value, useful for reviews
```

## Checklist Flow (`/kudos check <name>`)

Quick structured prompts to jog memory. Print the checklist, wait for answers.

Read the person's personnel file first to get their team, role, and recent 1:1
notes for context. Then present:

```
## Kudos Check — {Name} ({Team})

Think about the last 2-4 weeks. Quick y/n for each:

### Camaraderie
 [ ] Helped a teammate who was stuck or overloaded?
 [ ] Owned a mistake openly and course-corrected?
 [ ] Volunteered for unglamorous work (reviews, on-call, docs)?
 [ ] Made someone new feel welcome or supported onboarding?

### Truth over Comfort
 [ ] Pushed back on a plan or decision they disagreed with?
 [ ] Raised a risk or concern that others were avoiding?
 [ ] Gave direct, constructive feedback to a peer or lead?
 [ ] Flagged scope creep, unrealistic timelines, or tech debt honestly?

### Tackling Impossible Problems
 [ ] Took on something ambitious nobody else would try?
 [ ] Prototyped or spiked a novel approach?
 [ ] Shipped a complex feature under tight constraints?
 [ ] Explored a "crazy" idea that turned out to have legs?

### Highly Aligned Efforts
 [ ] Delivered a commitment on time or ahead of schedule?
 [ ] Proactively communicated a blocker or plan change?
 [ ] Kept docs/specs/Linear up to date so others weren't blocked?
 [ ] Coordinated across teams to unblock shared work?

### Powerful & Easy Product
 [ ] Fixed a customer pain point or UX friction?
 [ ] Simplified configuration or reduced setup steps?
 [ ] Anticipated a user need before it was reported?
 [ ] Improved defaults or DX for the 80% case?
```

After the user responds (e.g., "y/n/y/y/n/..."), ask for a one-liner on each
"yes" and save them as kudos entries using the Manual Entry Flow.

## Manual Entry Flow

1. Parse the person name, value key, and description from arguments.
2. Resolve the person to their personnel file in `.ai/para/areas/personnel/`.
3. Add an entry under their `## Kudos` section:
   ```
   - **2026-03-24** | **Tackling Impossible Problems** | Built the sandboxing system from scratch when everyone said it was impossible
   ```
4. If the person's file has no `## Kudos` section, add one before `## 1:1 Notes`.
5. Confirm what was saved.

## Automated Discovery Flow

Scan recent activity across Linear, Pylon, and Notion for kudos-worthy work.
Look for signals that map to org values.

### Linear Signals

Query recent completed issues across all teams Jack manages (use OVERVIEW.md
to get the team/person list).

**What to look for:**

| Signal | Likely Value |
|--------|-------------|
| Issue completed well ahead of estimate | `aligned` — delivered on commitments |
| High-priority bug fixed same day | `product` — frictionless experience |
| Issue with lots of comments/collaboration | `camaraderie` — teamwork |
| Issue tagged "tech-debt" or "refactor" that nobody asked for | `tackling` — building the future |
| Issue where someone took over from blocked teammate | `camaraderie` — no ego |
| Customer-reported issue fixed quickly | `product` — customer-first |
| Issue with honest "this approach won't work" comments | `truth` — speaking up |
| Complex infrastructure or DX improvement | `tackling` — what others wouldn't try |

**How to query:**
1. Get team IDs from `mcp__Linear__list_teams`
2. For each team, query completed issues in the date range:
   `mcp__Linear__list_issues` with `state: "completed"`, `team: "<team>"`,
   `updatedAt: { gte: "<start_date>" }`, `limit: 50`
3. Look at assignees, cycle times, labels, and comment counts
4. Cross-reference assignees with OVERVIEW.md to get person names

### Pylon Signals

Query recent resolved support issues for customer-facing wins.

| Signal | Likely Value |
|--------|-------------|
| Quick resolution of customer pain point | `product` |
| Engineer jumped in to help CS directly | `camaraderie` |
| Honest "this is a known limitation" response | `truth` |
| Built a workaround or fix same-day | `tackling` |

**How to query:**
- `mcp__pylon__search_issues` with status "resolved" in date range
- Check who resolved it and what the resolution was

### Notion Signals

Search for shoutouts, retro notes, or meeting notes mentioning team members.

| Signal | Likely Value |
|--------|-------------|
| Called out in retro as helpful | `camaraderie` |
| Documented a decision or process | `aligned` — keeping info accessible |
| Wrote an RFC or design doc | `tackling` or `aligned` |

**How to query:**
- `mcp__Notion__API-post-search` for recent pages mentioning team member names
- Look for retro docs, shoutout channels, meeting notes

### Discovery Output

Present findings as a ranked list:

```markdown
## Kudos Candidates — 2026-03-10 to 2026-03-24

### Strong Signal (high confidence)
1. **Altan** | Tackling Impossible Problems | Completed sandboxing MVP (NXC-3600) in one cycle — complex infra work nobody else could own
   - Source: Linear NXC-3600, completed 2026-03-18
   - [Save? y/n]

2. **Craigory** | Powerful & Easy Product | Fixed 3 customer-reported CNW bugs same-day (NXC-3610, 3611, 3612)
   - Source: Linear, Pylon case #4521
   - [Save? y/n]

### Moderate Signal (review context)
3. **Colum** | Camaraderie | Took over PR review backlog while Jason was out
   - Source: GitHub PR activity
   - [Worth capturing? y/n]
```

Wait for user confirmation before saving any entries. For each confirmed entry,
follow the Manual Entry Flow to save it.

## Review / Summary Flow

### `/kudos list`
Read all personnel files, extract `## Kudos` sections, display consolidated.

### `/kudos list <name>`
Read that person's file, display their kudos section.

### `/kudos summary`
Group all kudos by value. Useful for quarterly reviews or all-hands:

```markdown
## Kudos Summary — Q1 2026

### Camaraderie (7 entries)
- Altan: Helped onboard new team member despite heavy sprint load (2026-01-15)
- ...

### Truth over Comfort (3 entries)
- Jason: Pushed back on rushed timeline for auth migration (2026-02-08)
- ...

### Tackling Impossible Problems (5 entries)
- ...
```

## Important Notes

- **Never fabricate kudos** — only surface what actually happened in the data.
- **Err on the side of under-claiming** — if the value alignment is a stretch, skip it.
- **Prefer specific over generic** — "fixed 3 bugs same-day" > "did good work".
- **Discovery is suggestions, not auto-saves** — always confirm with user first.
- **Check for duplicates** before saving — read existing kudos section first.
- The `/dictate` command should also watch for kudos-worthy mentions during 1:1s
  and team syncs — but that's handled by updating dictate separately.
