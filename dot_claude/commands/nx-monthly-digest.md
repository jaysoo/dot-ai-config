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
  - mcp__pylon__search_issues
  - mcp__pylon__search_accounts
  - mcp__pylon__get_issue
  - mcp__pylon__get_account
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

## Execution Strategy: Two-Pass Pipeline

This digest uses a **2-pass pipeline**. Prefer thoroughness over speed —
use many tokens and subagents to get a precise picture, then synthesize
into the final output.

### Pass 1: Broad Data Collection (parallel)

Collect raw data from all five sources **in parallel**:

- **Sources 1 and 3** (GitHub repos): Use Bash `gh` commands directly (fast).
- **Source 2** (Cloud changelog): **Launch a background Agent** — there are
  often 20+ version pages to fetch individually via WebFetch.
- **Source 4** (Linear): **Launch a background Agent** — multiple paginated
  API calls are needed across teams. This agent should pull ALL completed
  issues (not just counts), all project updates, and all status changes.
- **Source 5** (Pylon): Pull support tickets for enterprise/PoV customers
  directly via Pylon MCP (fast — no agent needed).

Additionally, check for **blog posts** published during the target month:

- Fetch `https://nx.dev/blog` via WebFetch and look for posts from the month.
- Check the nx repo for blog-related commits if applicable.

Do NOT wait for one source before starting another. Launch background agents
for Sources 2 and 4 immediately, then collect Sources 1, 3, and 5 via
Bash/MCP while the agents work in the background.

### Pass 2: Theme Detection & Writing

Once Pass 1 data is collected (including background agent results):

1. Identify 5-10 cross-cutting **themes** from the raw data (see
   "Theme Detection" below).
2. Rank themes by customer impact (most impactful first).
3. Write both documents directly from the collected data — the Pass 1
   data is comprehensive enough to write without additional deep dives.
4. Cross-reference to ensure nothing was dropped.

## Data Sources

Collect data from ALL five sources. If any source is unavailable, note it
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

Nx Cloud changelog lives at: `https://changelog.nx.app/public/`

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
   `https://changelog.nx.app/public/{VERSION}/`

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
   - Docs team (DOC-) — **Team members: Jack, Caleb only** (not Ben)

   For each team: pull ALL completed issues (filter by `completedAt` within
   the month). Read titles AND descriptions — titles alone miss context.
   Group by project/label. Note customer-facing labels or support ticket links.

2. **Project updates** for the target month across all teams:
   Look for project status changes, milestone completions, and updates.
   Read project descriptions to understand goals and scope.
   **Extract any screenshots** from project updates and project details —
   these will be embedded in the cross-functional digest.

3. **Notable in-progress work** that stakeholders should be aware of
   (large initiatives, things that affect customers, upcoming breaking changes).

**Important:** Use pagination (limit: 50) and pull multiple pages if needed.
It's better to spend tokens reading everything than to miss important context.

**Known limitation:** `list_projects` with milestones hits Linear's query
complexity limit (~10,000). Instead of listing projects directly, derive
project information from the `project` and `projectMilestone` fields on
completed issues. This gives you project names, leads, and milestone status
without hitting the complexity cap.

If Linear MCP is not available, skip and note it.

---

### Source 5: Pylon — Customer Support Tickets

Use the Pylon MCP to pull support tickets for enterprise and PoV customers.
This surfaces real customer friction that should be flagged in the digest.

1. **Identify customer accounts to query.** Pull from:
   - Enterprise PoV customers found in Linear projects (e.g., Anaplan, CIBC,
     MNP.ca, Rocket Mortgage, Cisco, McGraw Hill, Caseware)
   - Major enterprise customers (e.g., SiriusXM, ClickUp, Moderna, Cloudinary,
     Mimecast, Mailchimp)
   - Any customer names mentioned in Linear issues during the month

2. **For each customer**, search for issues created during the target month:
   ```
   mcp__pylon__search_issues(account: "<name>", created_after: "<month-start>")
   ```
   Run these searches **in parallel** — one call per customer.

3. **For any customer with tickets**, fetch full issue details using
   `mcp__pylon__get_issue` for each ticket. Extract:
   - Title and description (what the customer is struggling with)
   - Priority (High/Medium/Low)
   - State (open, closed, waiting on customer, etc.)
   - Linked Linear issues or GitHub issues (cross-reference with other sources)
   - Tags (e.g., "Bug", "Feature Request")

4. **Surface in the digest:**
   - In the **cross-functional digest**: Add a "Support activity" subsection
     under the Enterprise section. Flag high-priority tickets, open bugs,
     and feature requests. This is critical context for Sales and CS.
   - In the **technical changelog**: Link Pylon tickets to related Linear
     issues or PRs where applicable.
   - In **"By the Numbers"**: Include total Pylon tickets across enterprise
     customers.

**Key fields to extract**: customer name, ticket count, priority, state,
linked Linear/GitHub issues, themes (what are customers asking about?).

If Pylon MCP is not available, skip and note it.

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
- If a Pylon ticket is linked to a Linear issue (check `external_issues`
  field in Pylon response), flag the change as **customer-escalated** and
  note which customer and ticket.
- If a Pylon ticket describes a problem that maps to a fix in the CLI
  releases or Cloud changelog, connect them even if not formally linked.

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

{1-2 sentence narrative intro for the theme. No commit hashes, no jargon.
Focus on: what can customers DO now that they couldn't before?}

**CLI:**
- {bullet points for CLI changes in this theme}

**Cloud:**
- {bullet points for Cloud changes in this theme}

**Infrastructure:**
- {bullet points for Infra changes in this theme}

**Docs:**
- {bullet points for Docs changes in this theme}

{Only include component sub-headers that have items. Include where applicable:}

- **Blog posts**: Link to any published blog posts related to this theme
- **Docs**: Link to new or updated documentation pages (from nx repo commits or Linear tasks)
- **Screenshots**: Embed screenshots from Linear project updates or project details
  that help readers quickly understand the change visually

**Who to contact:** {first names}

## {Theme 2: e.g., "Self-Healing CI"}

{Same treatment — group by CLI/Cloud/Infrastructure/Docs within the theme.}

## {Theme N}

...

## Breaking Changes / Action Required

{Anything customers need to act on. If nothing, say "None this month."}

## Coming Soon

{Notable in-progress work from Linear that stakeholders should preview.}

## By the Numbers

| Metric                  | Count            |
| ----------------------- | ---------------- |
| CLI releases            | N                |
| Cloud releases          | N                |
| Linear issues completed | N across M teams |
| Pylon support tickets   | N across M customers |

## Questions? Contact

{Map each THEME to the relevant leads — not each product. Use first names only:}

- **Task Sandboxing / IO Tracing**: {first names from Linear project}
- **Self-Healing CI / AI**: {first names}
- **Onboarding & Cloud**: {first names}
- **CLI Core**: {first names}
- **Infrastructure**: {first names}

_Generated on {date}. For the full technical changelog, see Document 2._
```

### Document 2: Unified Technical Changelog

Engineering-complete version, also organized by **theme**. Within each
theme, use `### CLI` / `### Cloud` / `### Infrastructure` sub-headers
with PR-level detail.

```markdown
# Nx Platform Changelog — {Month Year}

> **Sources:** Nx CLI GitHub releases, Nx Cloud public changelog,
> nrwl/cloud-infrastructure commits, Linear, Pylon support tickets.

## {Theme 1: e.g., "Task Sandboxing & Hermetic Builds"}

### CLI

- {description} ([#NNNN](github-pr-link)) — {version}
- ...

### Cloud

- {description} ({cloud version})
- ...

### Linear

- {description} ([NXC-NNNN](https://linear.app/nxdev/issue/NXC-NNNN))
- ...

### Infrastructure

- {description}
- ...

## {Theme 2}

...

## Linear Project Status

### Completed in {Month}

| Project | Lead         | Link                                           |
| ------- | ------------ | ---------------------------------------------- |
| {name}  | {first name} | [View](https://linear.app/nxdev/project/{slug}) |

### Active

| Project | Lead         | Target | Link                                           |
| ------- | ------------ | ------ | ---------------------------------------------- |
| {name}  | {first name} | {date} | [View](https://linear.app/nxdev/project/{slug}) |

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
  as top-level sections. Group by theme, then within each theme use
  **CLI:** / **Cloud:** / **Infrastructure:** / **Docs:** bold headers
  to sub-group bullet points by component. Only include component
  sub-headers that have items for that theme.
- **The cross-functional digest should be readable by someone who has
  never seen a terminal.** No commit SHAs, no CLI flags, no code snippets.
- **Flag gaps.** If a source was unavailable, say so prominently at the top
  of both documents so the reader knows the digest is incomplete.
- **Err on the side of inclusion** for the technical changelog. Err on the
  side of exclusion (customer-relevant only) for the cross-functional digest.
- **First names only.** Everyone knows each other — use "Jason" not
  "Jason Powers" or "Jason P." throughout both documents.
- **Linear issues MUST have URLs.** Every Linear issue referenced in the
  changelog must include a clickable link: `[NXC-123](https://linear.app/nxdev/issue/NXC-123)`.
  Same format for CLOUD-, INF-, DOC-, NXA-, Q- prefixes.
- **Linear projects MUST have URLs.** Where projects are listed (status
  tables, theme narratives), link to them:
  `[Project Name](https://linear.app/nxdev/project/{slug})`.
- **Include supporting content.** For the cross-functional digest, actively
  look for and include:
  - **Blog posts**: Check nx.dev blog and Nx social channels for posts
    related to themes in this month's work.
  - **Docs pages**: If nx repo commits or Linear tasks reference new/updated
    docs, link them (e.g., `https://nx.dev/docs/...`).
  - **Screenshots**: Extract and embed screenshots from Linear project
    updates, project descriptions, and issue attachments that help readers
    visually understand changes at a glance.
    The goal: a reader can quickly scan the digest and understand what's
    interesting to them, then drill into the changelog for details.

### Team Composition Reference

Use these team assignments (do NOT deviate):

- **Docs**: Jack, Caleb
- Other teams: derive from Linear project/issue assignments

### CRITICAL: Be Thorough

Err on the side of reading and including too much rather than missing important. I don't care how long this
task takes, it can be 30-60 mins as long as it has as much detail as possibel in changelog, which is then filtered
and distilled in a digestable format in the cross-functional digest. The more thorough the data collection and theme deep dives, the richer and more accurate the final output will be.
