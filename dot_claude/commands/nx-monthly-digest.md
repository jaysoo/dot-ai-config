---
name: nx-monthly-digest
description: >
  Generate a monthly cross-functional digest and unified changelog for Nx.
  Pulls from Nx GitHub releases, Nx Cloud changelog, cloud-infrastructure
  repo, and Linear project updates. Use when user says "monthly digest",
  "monthly update", "cross-functional update", "unified changelog",
  "what shipped this month", "prepare the monthly summary", or any request
  to compile changes across Nx CLI, Cloud, and Infrastructure for a given
  month. Also use when preparing updates for Sales, CS, Marketing, or
  leadership. Use this skill even for partial requests like "pull the cloud
  changes this month" or "what did we release".
allowed-tools:
  - Read
  - Bash
  - WebFetch
  - Grep
  - Glob
  - Write
  - Task
---

# Nx Monthly Digest

Generate a unified monthly digest that serves two audiences:
1. **Cross-functional teams** (Sales, CS, Marketing, Leadership): customer-facing
   summary of what changed, why it matters, who to contact for details.
2. **Engineering**: comprehensive changelog across all products.

## Inputs

- **Month**: User may specify "January 2026", "this month", "last month", etc.
  Default to the current month if not specified.
- **Output format**: Default is markdown. User may request other formats.

## Data Sources

Collect data from ALL four sources. If any source is unavailable, note it
and continue with what you have. Never block the entire digest on one source.

---

### Source 1: Nx CLI — GitHub Releases

The Nx CLI publishes releases to `https://github.com/nrwl/nx/releases`.

```bash
# List releases for the target month
# Adjust date range as needed
gh release list --repo nrwl/nx --limit 50 \
  | grep -i "<month-abbreviation>"
```

For each relevant release, fetch the full body:
```bash
gh release view <tag> --repo nrwl/nx --json tagName,body,publishedAt
```

Releases use conventional commit format with sections:
- 🚀 Features
- 🩹 Fixes
- ⚠️ Breaking Changes

**Key fields to extract**: tag, date, features, fixes, breaking changes.

---

### Source 2: Nx Cloud — Public Changelog

Nx Cloud changelog lives at: `https://nrwl.github.io/nx-cloud-changelog/public/`

Version format is `YYMM.DD.N` (e.g., `2602.26.2` = 2026, Feb 26, build 2).

1. Fetch the changelog index page to get the list of all version links.
2. Filter versions that match the target month's `YYMM` prefix.
   - For February 2026: prefix is `2602`
   - For January 2026: prefix is `2601`
3. For each matching version, fetch its page and extract Features / Bug Fixes.

```bash
# Fetch the index and extract version links
curl -s "https://nrwl.github.io/nx-cloud-changelog/public/" \
  | grep -oP 'href="[^"]*"' \
  | grep "<YYMM_PREFIX>"
```

If `curl` is not available, use `WebFetch` on the index URL, then parse.

**Key fields to extract**: version, date (from version string), features, fixes.

---

### Source 3: Cloud Infrastructure — Private Repo

The infrastructure team maintains `https://github.com/nrwl/cloud-infrastructure`.

```bash
# Check if we have access
gh repo view nrwl/cloud-infrastructure --json name 2>/dev/null

# If accessible, pull recent changes
gh release list --repo nrwl/cloud-infrastructure --limit 20

# Or if no formal releases, use commit log
gh api repos/nrwl/cloud-infrastructure/commits \
  --jq '.[] | select(.commit.author.date >= "<START_DATE>") | {
    sha: .sha[:8],
    message: .commit.message,
    date: .commit.author.date,
    author: .commit.author.name
  }'
```

If the repo is not accessible (permissions error), note this clearly:
> "Infrastructure changes not included — no access to nrwl/cloud-infrastructure.
> Contact the Infrastructure team lead for this month's updates."

**Key fields to extract**: whatever is available — releases, tags, or commit summaries.

---

### Source 4: Linear — Projects and Issues

Use the Linear MCP to pull:

1. **Project updates** for the target month across all teams:
   - CLI team
   - Cloud team
   - Infrastructure team
   - Red Panda team
   
   Look for project status changes, milestone completions, and project updates.

2. **Completed issues** grouped by team for the target month.
   - Filter by `completedAt` within the month's date range.
   - Group by team/project.
   - Note any issues tagged with customer-facing labels or linked to support tickets.

3. **Notable in-progress work** that stakeholders should be aware of
   (large initiatives, things that affect customers, upcoming breaking changes).

If Linear MCP is not available, skip and note it.

---

## Synthesis and Categorization

After collecting raw data from all sources, categorize every change into:

| Category | Description | Audience |
|----------|-------------|----------|
| **New Features** | New user-facing capabilities | Everyone |
| **Improvements** | Enhancements to existing features | Everyone |
| **Bug Fixes (Customer-Facing)** | Fixes users would notice | Sales, CS |
| **Bug Fixes (Internal)** | Internal fixes, perf improvements | Engineering |
| **Breaking Changes** | Anything requiring user action | Everyone (urgent) |
| **Infrastructure** | Infra, reliability, scaling changes | Engineering, Ops |
| **Security** | Security patches, dependency updates | Everyone |
| **Deprecations** | Features being phased out | Sales, CS |

### Cross-referencing

- If a GitHub release commit references a Linear issue ID (e.g., `#NX-1234`),
  link them together.
- If a cloud changelog entry maps to a Linear project, note the connection.
- If a Pylon/support ticket is referenced in any Linear issue, flag the
  change as **customer-escalated** and note which customer or ticket.

---

## Output: Two Documents

### Document 1: Cross-Functional Digest

This is the version for Sales, CS, Marketing, and Leadership.

```markdown
# Nx Monthly Update — {Month Year}

## TL;DR
{3-5 bullet summary of the most impactful changes this month. Lead with
what matters to customers.}

## What's New for Customers

### Nx CLI {version range}
{Plain-language summary of features. No commit hashes, no jargon.
Focus on: what does this let customers DO that they couldn't before?}

### Nx Cloud
{Same treatment. Focus on: faster CI? new dashboard features?
better DX? cost savings?}

## What Got Fixed
{Customer-facing bug fixes in plain language. Group by product.
Skip internal-only fixes.}

## ⚠️ Breaking Changes / Action Required
{Anything customers need to act on. Migration steps if applicable.
If nothing, say "None this month."}

## Coming Soon
{Notable in-progress work from Linear that stakeholders should preview
in conversations with customers.}

## Questions? Contact
{Map each product area to a team or person:}
- **Nx CLI**: {team/person}
- **Nx Cloud**: {team/person}
- **Infrastructure**: {team/person}
- **AI/MCP**: {team/person}

_Generated on {date}. For the full technical changelog, see Document 2._
```

### Document 2: Unified Technical Changelog

This is the engineering-complete version.

```markdown
# Nx Unified Changelog — {Month Year}

## Nx CLI

### {version} ({date})

#### Features
- {scope}: {description} ({PR link})

#### Fixes
- {scope}: {description} ({PR link})

#### Breaking Changes
- {description}

{Repeat for each release in the month}

## Nx Cloud

### {version} ({date})

#### Features
- {description}

#### Fixes
- {description}

{Repeat for each cloud version in the month}

## Infrastructure
{Whatever level of detail is available from Source 3}

## Linear Project Updates
{Summary of project status changes, milestone completions}
```

---

## File Output

Save both documents to the working directory:

```
nx-digest-{YYYY-MM}-crossfunctional.md
nx-digest-{YYYY-MM}-changelog.md
```

Tell the user where the files are saved and offer to adjust tone,
add/remove sections, or reformat for a specific channel (e.g., Slack post,
email, Notion page).

## Important Notes

- **Do NOT invent changes.** Every item must trace back to a source.
- **Dates matter.** Only include changes within the target month.
  The Nx Cloud version format encodes the date: `YYMM.DD.N`.
- **The cross-functional digest should be readable by someone who has
  never seen a terminal.** No commit SHAs, no CLI flags, no code snippets.
- **Flag gaps.** If a source was unavailable, say so prominently at the top
  of both documents so the reader knows the digest is incomplete.
- **Err on the side of inclusion** for the technical changelog. Err on the
  side of exclusion (customer-relevant only) for the cross-functional digest.
