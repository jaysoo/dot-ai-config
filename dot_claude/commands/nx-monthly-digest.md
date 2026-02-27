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

Generate a unified monthly digest that presents the Nx **platform as a whole**
— not as separate CLI / Cloud / Infrastructure products. Changes that span
multiple components should be grouped by theme, not by team.

Two audiences:
1. **Cross-functional teams** (Sales, CS, Marketing, Leadership): customer-facing
   summary of what changed, why it matters, who to contact for details.
2. **Engineering**: comprehensive changelog across all components.

## Inputs

- **Month**: User may specify "January 2026", "this month", "last month", etc.
  Default to the current month if not specified.
- **Output format**: Default is markdown. User may request other formats.

## Execution Strategy: Multi-Pass Deep Dive

This digest uses a **3-pass pipeline**. Prefer thoroughness over speed —
use many tokens and subagents to get a precise picture, then progressively
summarize down to the final output.

### Pass 1: Broad Data Collection (parallel)

Collect raw data from all four sources **in parallel**:

- **Sources 1 and 3** (GitHub repos): Use Bash `gh` commands directly (fast).
- **Source 2** (Cloud changelog): **Launch a Task subagent** — there are often
  20+ version pages to fetch individually via WebFetch.
- **Source 4** (Linear): **Launch a Task subagent** — multiple paginated API
  calls are needed across teams. This subagent should pull ALL completed
  issues (not just counts), all project updates, and all status changes.

Do NOT wait for one source before starting another. Launch subagents for
Sources 2 and 4 immediately, then collect Sources 1 and 3 via Bash while
the subagents work in the background.

### Pass 2: Theme Deep Dives (parallel subagents)

After Pass 1 completes, identify 5-10 themes from the raw data (see
"Theme Detection" below). Then **launch a dedicated subagent for each
major theme** to do an exhaustive deep dive.

Each theme subagent should:
1. Read ALL related Linear issues in full (not just titles — descriptions,
   comments, linked PRs, linked issues).
2. Read full PR descriptions for key GitHub PRs in this theme.
3. Check for customer-facing impact: Pylon tickets, support mentions,
   customer names in Linear issues.
4. Identify the full story: what was the problem, what shipped, what's
   the customer impact, what's still in progress.
5. Return a **theme brief** (1-2 pages) covering:
   - **What changed** (comprehensive list of all work)
   - **Why it matters** (customer impact, business value)
   - **Who led it** (project leads, key contributors)
   - **What's next** (remaining work, upcoming milestones)
   - **Customer-facing summary** (1-2 sentences, no jargon)

Launch theme subagents **in parallel** for independent themes.

For smaller themes (< 5 related items), a subagent isn't needed — summarize
directly from the Pass 1 data.

### Pass 3: Synthesis & Writing

With all theme briefs in hand:
1. Rank themes by customer impact (most impactful first).
2. Write the cross-functional digest from the "customer-facing summary"
   and "why it matters" sections of each brief.
3. Write the technical changelog from the "what changed" sections.
4. Cross-reference to ensure nothing was dropped between passes.

## Data Sources

Collect data from ALL four sources. If any source is unavailable, note it
and continue with what you have. Never block the entire digest on one source.

---

### Source 1: Nx CLI — GitHub Releases

The Nx CLI publishes releases to `https://github.com/nrwl/nx/releases`.

```bash
# List releases for the target month
gh release list --repo nrwl/nx --limit 50
# Filter by date in the output (dates are in ISO format)
```

For each relevant release (stable + backports; skip pre-releases unless
specifically requested), fetch the full body:
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

**IMPORTANT:** The index page redirects to the latest version page. Do NOT
try to parse the index with curl. Instead:

1. Use **WebFetch** on the index URL. The page includes a sidebar/navigation
   with links to all previous versions.
2. Extract all version numbers from the navigation links.
3. Filter versions matching the target month's `YYMM` prefix.
   - For February 2026: prefix is `2602`
   - For January 2026: prefix is `2601`
4. **Launch a Task subagent** to fetch all matching version pages in parallel
   (there may be 20+ versions in a busy month). Each version page is at:
   `https://nrwl.github.io/nx-cloud-changelog/public/{VERSION}/`

**Key fields to extract**: version, date (from version string), features, fixes.

---

### Source 3: Cloud Infrastructure — Private Repo

The infrastructure team maintains `https://github.com/nrwl/cloud-infrastructure`.

```bash
# Check if we have access
gh repo view nrwl/cloud-infrastructure --json name 2>/dev/null
```

**IMPORTANT:** This repo has hundreds of automated commits daily from
`argocd-image-updater` and `Image Updater Action`. You MUST filter these
out or the output will be unusable.

```bash
# Get meaningful human-authored commits only
gh api repos/nrwl/cloud-infrastructure/commits --paginate \
  -q '.[] | select(.commit.author.date >= "<START_DATE>") |
  select((.commit.author.name | test("argocd|Image Updater")) | not) |
  select((.commit.message | test("^Merge (pull request|branch)")) | not) |
  "\(.sha[:8])|\(.commit.author.date[:10])|\(.commit.author.name)|\(.commit.message | split("\n")[0])"'
```

If the repo is not accessible (permissions error), note this clearly:
> "Infrastructure changes not included — no access to nrwl/cloud-infrastructure.
> Contact the Infrastructure team lead for this month's updates."

**Key fields to extract**: commit message (has conventional commit prefix
and scope), author, date. Group by scope/theme.

---

### Source 4: Linear — Projects and Issues

Use the Linear MCP to pull **exhaustive** data. This is the richest source
for understanding what actually happened — don't skim it.

1. **All completed issues** for the target month across ALL teams:
   - CLI team (NXC-)
   - Cloud team (CLOUD-)
   - Infrastructure team (INF-)
   - Red Panda team (NXA-)
   - Quokka team (Q-)
   - Docs team (DOC-)

   For each team: pull ALL completed issues (filter by `completedAt` within
   the month). Read titles AND descriptions — titles alone miss context.
   Group by project/label. Note customer-facing labels or support ticket links.

2. **Project updates** for the target month across all teams:
   Look for project status changes, milestone completions, and updates.
   Read project descriptions to understand goals and scope.

3. **Notable in-progress work** that stakeholders should be aware of
   (large initiatives, things that affect customers, upcoming breaking changes).

**Important:** Use pagination (limit: 50) and pull multiple pages if needed.
It's better to spend tokens reading everything than to miss important context.

If Linear MCP is not available, skip and note it.

---

## Theme Detection & Clustering

**CRITICAL:** Do NOT organize output by product (CLI / Cloud / Infra).
Instead, cluster changes into cross-cutting **themes** that present the
platform as a unified whole.

After collecting raw data from all sources:

1. **Scan all changes for keyword clusters** that indicate shared initiatives:
   - "sandbox", "io-trace", "hermetic", "signal file" → **Task Sandboxing**
   - "self-healing", "fix-ci", "auto-apply" → **Self-Healing CI**
   - "configure-ai-agents", "MCP", "CLAUDE.md", "agentic", "AX" → **AI/Agentic Experience**
   - "CNW", "onboarding", "VCS", "connect workspace" → **Onboarding**
   - "daemon", "performance", "memory", "jemalloc", "replica" → **Performance & Reliability**
   - "gradle", "maven", "batch", "pom" → **JVM Ecosystem**
   - "CVE", "injection", "IAM", "security", "encrypt" → **Security**

2. **Cross-reference Linear projects** to confirm groupings. A Linear project
   that spans CLI + Cloud teams confirms those changes belong together.

3. **For each theme**, combine CLI features, Cloud features, Infra changes,
   and relevant fixes into one narrative section. Under each theme, use
   `### CLI` / `### Cloud` / `### Infrastructure` sub-headers only when
   needed for the technical changelog — never as top-level organization.

4. Put items that don't fit a theme into **"Ecosystem & Framework Support"**
   (for toolchain/language items) or **"Miscellaneous"** (for everything else).

### Pinned Themes (always include when applicable)

These themes are **always included** in the digest when there is relevant
activity. They should never be folded into other sections or omitted:

- **Security** — MUST appear whenever there is a CVE fix, dependency
  security patch, command injection fix, IAM change, encryption feature,
  or any security-adjacent work. Sales and CS need this for customer
  conversations. Include CVE IDs, affected versions, and remediation.
- **AI-Powered Development** — Always surface as its own theme. AI/MCP/
  agentic features are a key differentiator. Include new AI commands,
  MCP plugin updates, agent integration improvements, and any AI-related
  Cloud features (e.g., Self-Healing CI's AI components).

### Cross-referencing

- If a GitHub release commit references a Linear issue ID (e.g., `#NX-1234`),
  link them together.
- If a cloud changelog entry maps to a Linear project, note the connection.
- If a Pylon/support ticket is referenced in any Linear issue, flag the
  change as **customer-escalated** and note which customer or ticket.

---

## Output: Two Documents

### Document 1: Cross-Functional Digest

For Sales, CS, Marketing, and Leadership. Organized by **theme**, not product.

```markdown
# Nx Platform Update — {Month Year}

> **Data gaps:** {List any sources that were unavailable, or "None"}

## TL;DR
{3-5 bullet summary of the most impactful changes. Lead with what
matters to customers. Each bullet should span CLI+Cloud+Infra as relevant.}

## {Theme 1: e.g., "Task Sandboxing & Hermetic Builds"}
{Plain-language narrative combining CLI, Cloud, and Infra changes into
one story. No commit hashes, no jargon. Focus on: what can customers
DO now that they couldn't before?}

## {Theme 2: e.g., "Self-Healing CI"}
{Same treatment.}

## {Theme N}
...

## Breaking Changes / Action Required
{Anything customers need to act on. If nothing, say "None this month."}

## Coming Soon
{Notable in-progress work from Linear that stakeholders should preview.}

## By the Numbers
| Metric | Count |
|--------|-------|
| CLI releases | N |
| Cloud releases | N |
| Linear issues completed | N across M teams |

## Questions? Contact
{Map each THEME to the relevant leads — not each product:}
- **Task Sandboxing / IO Tracing**: {leads from Linear project}
- **Self-Healing CI / AI**: {leads}
- **Onboarding & Cloud**: {leads}
- **CLI Core**: {leads}
- **Infrastructure**: {leads}

_Generated on {date}. For the full technical changelog, see Document 2._
```

### Document 2: Unified Technical Changelog

Engineering-complete version, also organized by **theme**. Within each
theme, use `### CLI` / `### Cloud` / `### Infrastructure` sub-headers
with PR-level detail.

```markdown
# Nx Platform Changelog — {Month Year}

> **Sources:** Nx CLI GitHub releases, Nx Cloud public changelog,
> nrwl/cloud-infrastructure commits, Linear.

## {Theme 1: e.g., "Task Sandboxing & Hermetic Builds"}

### CLI
- {description} ([#NNNN](link)) — {version}
- ...

### Cloud
- {description} ({cloud version})
- ...

### Infrastructure
- {description}
- ...

## {Theme 2}
...

## Linear Project Status

### Completed in {Month}
| Project | Lead |
|---------|------|
| ... | ... |

### Active
| Project | Lead | Target |
|---------|------|--------|
| ... | ... | ... |

### Issues Completed: {N} across {M} teams
{team} {count} · {team} {count} · ...

_Generated on {date}._
```

---

## File Output

Save both documents to the `.ai` date folder:

```
dot_ai/{YYYY-MM-DD}/tasks/nx-digest-{YYYY-MM}-crossfunctional.md
dot_ai/{YYYY-MM-DD}/tasks/nx-digest-{YYYY-MM}-changelog.md
```

Create the directory if it doesn't exist (`mkdir -p`).

Tell the user where the files are saved and offer to adjust tone,
add/remove sections, or reformat for a specific channel (e.g., Slack post,
email, Notion page).

## Important Notes

- **Do NOT invent changes.** Every item must trace back to a source.
- **Dates matter.** Only include changes within the target month.
  The Nx Cloud version format encodes the date: `YYMM.DD.N`.
- **Present the platform as a whole.** Never use "Nx CLI" or "Nx Cloud"
  as top-level sections. Group by theme and mention which component(s)
  are involved within each theme.
- **The cross-functional digest should be readable by someone who has
  never seen a terminal.** No commit SHAs, no CLI flags, no code snippets.
- **Flag gaps.** If a source was unavailable, say so prominently at the top
  of both documents so the reader knows the digest is incomplete.
- **Err on the side of inclusion** for the technical changelog. Err on the
  side of exclusion (customer-relevant only) for the cross-functional digest.
