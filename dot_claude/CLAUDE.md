# Individual Preference

These are preferences for myself (Jack Hsu - jack.hsu@gmail.com). 

I work at Nx and my contributions are mostly related to Nx CLI.

Don't be overly friendly or optimistic. Be terse.

## CRITICAL: AI Notes

Make sure to keep notes and scripts inside `.ai/` folder. If it does not exist then run this command:

```
ln -s $HOME/projects/dot-ai-config/dot_ai/ .ai
```

## CRITICAL: Timezone

I am in Eastern Timezone, so make sure all dates and time uses ET.

When I ask for date or you need the date, run `date '+%Y-%m-%d`. If you need a timestamp run `date '+%Y-%m-%d %H:%M'`.

## CRITICAL: main branches

Never commit directly to `master` or `main` branch. Always work in a new branch.

## CRITICAL: Understanding architecture

You might find useful architectural information under `.ai/architectures` for nx, ocean, nx-labs, or nx-console repo. These documents contain strucutre, key technologies, features, contributors, my contributions, recent changes, etc. Use them when doing work. For example, `.ai/architectures/nx-architecture.md`.

## CRITICAL: Commit Messages and PR Templates

When creating commits that will be used for pull requests:
1. Check if the repository has a `.github/PULL_REQUEST_TEMPLATE.md` file
2. If it exists, ensure your commit message body follows the template structure
3. Include all required sections from the PR template in your commit message
4. This allows the PR description to be auto-populated correctly when creating the PR

Example: If the PR template has "Current Behavior", "Expected Behavior", and "Related Issue(s)" sections, include these in your commit body.

## CRITICAL: Plan Mode and Tasks

Make sure to check @~/.claude/commands/plan-task.md for how tasks should be planned. Make sure there is a task .md file written down before executing phases and steps, and update the file as you go.

## CRITICAL: Reading Issue Descriptions First

When working on a Linear issue:
1. ALWAYS use WebFetch or mcp__Linear__get_issue to read the FULL issue description first
2. DO NOT assume what needs to be done based on the title alone
3. The issue description often contains specific implementation instructions that override what the title might suggest

## CRITICAL: Task Planning in .ai Folder

When starting ANY task from Linear or GitHub:
1. IMMEDIATELY create the .ai symlink if not present: `ln -s $HOME/projects/dot-ai-config/dot_ai/ .ai`
2. Create task plan in `.ai/yyyy-mm-dd/tasks/` BEFORE starting any implementation
3. Update the plan as you work through the task
4. This is NOT optional - it must be done for every task

## CRITICAL: Understanding Astro/Starlight Documentation Structure

When working with Astro docs (astro-docs project):
- Starlight renders the title from frontmatter, not from h1 in content
- If both frontmatter title and h1 exist, they will duplicate
- To fix title/h2 distinction issues: remove h1 from content, keep title in frontmatter
- Always preserve sidebar labels when changing titles

## CRITICAL: Verifying Changes Before Claiming Completion

When making file edits:
1. Always verify the changes were actually applied (not reverted by linting/formatting)
2. If files get reverted, understand why and fix the root cause
3. Don't claim task completion until changes are confirmed to persist

## CRITICAL: MCP Server Usage

**ALWAYS use the MyNotes MCP server tools FIRST when I ask about:**
- My notes, dictations, specs, tasks, or TODOs
- What I worked on previously or my past tasks
- Finding or searching my personal content
- Any information I've saved or documented before

### Quick MCP Function Reference:
- `mcp__MyNotes__search_ai_content` - Search all my content (notes, tasks, specs, dictations)
- `mcp__MyNotes__get_task_context` - Resume work on a specific task
- `mcp__MyNotes__find_specs` - Find specification documents
- `mcp__MyNotes__get_summaries` - Get daily/project summaries
- `mcp__MyNotes__extract_todos` - Find TODO items
- `mcp__gemini-collab__ask_gemini` - Ask Gemini a question -- useful to verify facts and double-check work
- `mcp__gemini-collab__gemini_code_review` - Get Gemini to review code, usful for coding tasks
- `mcp__gemini-collab__gemini_brainstorm` - Brainstorm with Gemini, useful when in brainstorm session

**Priority**: When I mention "my" content or ask about previous work, IMMEDIATELY use the appropriate MCP function before trying other tools.

# Claude MCP Server Instructions

### CRITICAL: MCP Server Priority Rules

**ALWAYS use the MyNotes MCP server tools FIRST when users ask about:**
- Personal notes, dictations, specs, tasks, or TODOs
- Previous work, past tasks, or project history
- Searching for their own content or documentation
- Finding information they've saved or worked on before

### MCP Function Usage Guide

#### 1. `mcp__MyNotes__search_ai_content` - Primary Search Tool
**Use this FIRST for any query about personal content**

Trigger phrases that MUST invoke this function:
- "my notes", "my dictations", "my specs", "my tasks", "my todos"
- "what did I work on", "previous work", "past tasks", "earlier work"
- "find my", "search my", "get my", "show my", "list my"
- "personal notes", "saved notes", "stored information"
- "remember when I", "did I mention", "have I worked on"
- "show me all", "what's in my", "retrieve my"

Parameters:
- `query`: The search terms (required)
- `category`: Use specific categories when mentioned:
  - "spec/specs" for specification documents
  - "task/tasks" for task-related content
  - "dictation/dictations" for voice notes
  - "all" (default) for comprehensive search
- `date_filter`: Apply when dates are mentioned (YYYY-MM-DD or YYYY-MM-DD..YYYY-MM-DD)
- `max_results`: Default 10, increase for "all" requests

#### 2. `mcp__MyNotes__get_task_context` - Task Continuation
**Use when resuming or continuing specific tasks**

Trigger phrases:
- "continue working on [task]"
- "resume [task]"
- "get context for [task]"
- "what was I doing with [task]"
- "pick up where I left off"

#### 3. `mcp__MyNotes__find_specs` - Specification Lookup
**Use for finding specification documents**

Trigger phrases:
- "find spec", "get specification"
- "show me the spec for"
- "specification document"
- "design document", "requirements"

#### 4. `mcp__MyNotes__get_summaries` - Overview Access
**Use for daily/project summaries**

Trigger phrases:
- "daily summary", "project summary"
- "what happened on [date]"
- "overview of", "summary of work"
- "recap", "review"

#### 5. `mcp__MyNotes__extract_todos` - TODO Management
**Use for finding action items**

Trigger phrases:
- "my todos", "todo list", "action items"
- "what needs to be done"
- "pending tasks", "outstanding items"
- "checklist", "to-do items"

### Priority Decision Tree

1. **User mentions personal content?** → Use MCP tools
2. **Query about files/code in current project?** → Use standard file tools
3. **General programming question?** → Answer directly
4. **Searching for information?** → Check if it's personal (use MCP) or general (use web/other tools)

### Examples of MCP-First Queries

```
User: "What specs do I have for the project?"
→ IMMEDIATELY use: mcp__MyNotes__find_specs(spec_name="*")

User: "Show me my notes from last week"
→ IMMEDIATELY use: mcp__MyNotes__search_ai_content(query="*", date_filter="2025-06-02..2025-06-08")

User: "What tasks did I work on today?"
→ IMMEDIATELY use: mcp__MyNotes__search_ai_content(query="*", category="tasks", date_filter="2025-06-09")

User: "Find my dictation about the API design"
→ IMMEDIATELY use: mcp__MyNotes__search_ai_content(query="API design", category="dictations")
```

### Response Pattern

When using MCP tools:
1. Call the appropriate MCP function immediately
2. Present the results clearly
3. Ask if the user needs more specific information
4. Suggest related MCP searches if relevant

### DO NOT Use MCP For:
- General programming questions
- External documentation lookup
- Code in the current repository (use file tools)
- System commands or configurations

### Error Handling

If MCP server is unavailable:
1. Inform the user the personal notes server is not accessible
2. Suggest checking if the MCP server is running
3. Offer alternative search methods as fallback

Remember: The MCP server contains the user's personal knowledge base. It should be the PRIMARY source for any query about their own work, notes, or documentation.

### Linear MCP Specific Notes:
- When searching for issues, always confirm the team name first
- Team IDs are UUIDs and must be retrieved via `list_teams` 
- Use pagination (limit parameter) to avoid response size errors
- Common teams: "Nx Cloud" (cloud features), "Nx CLI" (core tooling)

## CRITICAL: Linear Teams Clarification

When working with Linear issues, be aware there are multiple teams:
- **Nx CLI team** - Core Nx tooling and CLI features (prefix: NXC-)
- **Nx Cloud team** - Cloud infrastructure and features (prefix: CLOUD-)
- **Always confirm which team** the user is asking about before proceeding

Example: "Stale issues for Nx Cloud team" means CLOUD- prefixed issues, not NXC- issues.

## Linear API Usage

When querying Linear issues:
1. Always get the team ID first using `mcp__Linear__list_teams` with the specific team name
2. Use smaller limits (30-50) to avoid token limit errors
3. Be aware that "Nx Cloud" and "Nx CLI" are separate teams with different IDs
4. Check both "Backlog" and "In Progress" states separately

## Linear API Date Filtering

When using `updatedAt` parameter in Linear API:
- The parameter filters for items updated ON OR AFTER the specified date
- To find stale items (not updated for X months), calculate the cutoff date first
- Example: To find items stale for 3+ months on Aug 19, 2025:
  - Use `updatedAt: "2025-05-19T23:59:59Z"` to get items updated May 19 or later
  - These are NOT stale - they were updated within 3 months
  - To find truly stale items, you need to filter the results further

## Task Plan File Naming

When creating task plans in `.ai/yyyy-mm-dd/tasks/`, use descriptive names that include the specific team or project:
- ✅ `nx-cloud-stale-issues-review.md` (specific team)
- ✅ `nx-cli-stale-issues-review.md` (specific team)
- ❌ `linear-stale-issues-review.md` (ambiguous - which team?)

When creating task plans that involve date calculations:
- Include the threshold date in the filename or task description
- Example: `nx-cloud-stale-issues-before-may-19.md` instead of just `stale-issues.md`
- Always document the calculation used in the task file itself

## Task Verification Steps

For any task involving date calculations or staleness:
1. Run `date '+%Y-%m-%d'` to confirm today's date
2. Calculate and document the exact threshold date
3. Verify your first few results manually before proceeding
4. Include the calculation in your task documentation

Example verification:
- Today: August 19, 2025
- 3 months ago: May 19, 2025
- Test case: Issue updated June 1, 2025 = NOT stale (less than 3 months old)

## Common Mistakes to Avoid

### Linear Issue Searches
- **Mistake**: Assuming "Linear issues" means one specific team
- **Fix**: Always clarify which team (Nx Cloud, Nx CLI, etc.) before searching
- **Why**: Different teams have completely different issue sets and priorities

### Date Calculations for Staleness
- **Mistake**: Marking items from June/July/August as "stale" when checking in August for 3+ month staleness
- **Fix**: Calculate the exact cutoff date (3 months before today) and only items BEFORE that date are stale
- **Example**: On August 19, 2025, only items last updated May 19, 2025 or earlier are 3+ months stale

### Linear API Date Filters
- **Mistake**: Assuming `updatedAt` parameter finds items NOT updated since that date
- **Fix**: The parameter finds items updated ON OR AFTER that date
- **Workaround**: May need to request ALL items and filter client-side for true staleness

## CRITICAL: Date Calculations

When calculating time periods (e.g., "3 months ago", "6 months old"):
- Always use the current date as the starting point (run `date '+%Y-%m-%d'` to confirm)
- Count backwards for the full period
- Examples for August 19, 2025:
  - 3 months ago = May 19, 2025 or earlier
  - 6 months ago = February 19, 2025 or earlier
  - 1 year ago = August 19, 2024 or earlier

When filtering for "stale" items:
- "Stale for 3+ months" means last updated on or before the calculated date
- Items updated AFTER that date are NOT stale

## CRITICAL: Task Planning Documentation

When investigating or researching repository features (not just implementing features):
- ALWAYS create a task plan in `.ai/yyyy-mm-dd/tasks/` IMMEDIATELY after starting
- Document findings AS YOU GO, not just at the end  
- Update the TODO.md file when task is complete

## CRITICAL: Effective File Discovery

When searching for scripts and configuration files:
1. Start with simple `ls` commands in likely directories (tools/, scripts/, .github/)
2. Use `find` with multiple file types: `-name "*.sh" -o -name "*.ts" -o -name "*.js"`
3. Check package-scripts.js or package.json for command definitions
4. Look for GitHub workflows that might invoke the scripts

## CRITICAL: Investigation Documentation

When documenting investigations:
- Include line numbers when referencing specific code (e.g., file.sh:22-31)
- Document the COMPLETE flow, not just individual pieces
- Show relationships between files (what calls what)
- Include examples of current values/formats before suggesting changes

## CRITICAL: Architecture Documentation Updates

After completing any investigation or implementation:
- Update `.ai/architectures/[repo]-architecture.md` with findings
- Add to "Personal Work History" section with date
- Update "Design Decisions & Gotchas" if you discovered important context
- Update daily SUMMARY.md in `.ai/yyyy-mm-dd/`

## Working With Tasks

- If it sounds like I'm asking you to perform a task then use @~/.claude/commands/plan-task.md
- If it sounds like I'm asking you to dictate notes then use @~/.claude/commands/dictate.md

## Pending tasks

- Store all pending tasks in `.ai/TODO.md` or `dot_ai/TODO.md` (whichever is present), and update it as things are checked off. Also add to the `yyyy-mm-dd` folder in `SUMMARY.md` that a task is pending.

For example,

```markdown
## In Progress

- [ ] Name of task (yyyy-mm-dd hh:mm)
  - Plan created: `dot_ai/yyyy-mm-dd/tasks/name-of-task.md`
  - Next steps: If there are any next steps mentioned in the task plan, there could also be a spec file under `yyyy-mm-dd/specs`
  - Goal: The goal according to the planned task and/or related specs
```

Where `yyyy-mm-dd hh:mm` is the timestamp.

## Completed tasks

- Move completed tasks in `.ai/TODO.md` or `dot_ai/TODO.md` (whichever is present) from the pending section to completed. Also add to the `yyyy-mm-dd` folder in `SUMMARY.md` that a task was completed.

```markdown
## Completed

- [x] Name of task (yyyy-mm-dd hh:mm)
  - Plan created: `dot_ai/yyyy-mm-dd/tasks/name-of-task.md`
  - Next steps: If there are any next steps mentioned in the task plan, there could also be a spec file under `yyyy-mm-dd/specs`
  - Goal: The goal according to the planned task and/or related specs
```

Where `yyyy-mm-dd hh:mm` is the timestamp.

## CRITICAL: Comment Style Preferences

Prefer concise comments that explain WHY, not WHAT:
- Code should be self-documenting
- One comment block at the top of a function/section explaining the purpose
- Avoid verbose step-by-step comments unless the logic is truly complex
- Remove redundant comments during code cleanup

Example:
```typescript
// BAD: Verbose what comments
// 1. Add Introduction first if it exists
if (introItem) {
  finalItems.push(introItem);
}
// 2. Add Guides second if it exists  
if (guidesItem) {
  finalItems.push(guidesItem);
}

// GOOD: Concise why comment
// Enforce consistent ordering across all technology sections
// Order: Introduction → Guides → Generated items → Everything else
if (introItem) finalItems.push(introItem);
if (guidesItem) finalItems.push(guidesItem);
```

## CRITICAL: Astro Starlight Configuration

When working with Astro Starlight documentation:

**Collapsed State**: Groups are expanded by default. Always set `collapsed: true` for nested groups unless they should be expanded.

**Dynamic Ordering**: When mixing generated items with static files, static files get added after generated items by default. If you need specific ordering (like Introduction first), you must extract and reorder items explicitly.

**Testing**: Use Playwright MCP with the correct port (ask user, don't assume) to verify sidebar behavior in real-time.

## CRITICAL: File System Operations

- Never assume file paths exist without checking first
- When working with build outputs (like `dist/` folders), verify they exist before trying to require/import
- Use absolute paths when provided by user, don't guess at file locations
- Ask user for correct development server port if unsure (don't assume 3000, 4321, etc.)

## CRITICAL: Testing Web Applications

When testing local development servers:
- Ask user for the correct port if unsure 
- Use Playwright MCP for real-time verification of UI changes
- Test across multiple sections/pages to ensure consistency
- Verify both functionality and UX (like collapsed states, ordering)

## CRITICAL: Search Quality Assessment and URL Matching

When working on search quality comparisons or Ocean scoring tasks:

### Check Ocean Script First
- Ocean script location: `~/projects/ocean/tools/scripts/scorecards/nx-dev-search-score.ts`
- ALWAYS use the exact Ocean keywords and expected URLs, not custom keyword sets
- Ocean has 35 official keywords across 6 categories (commands, features, concepts, reference, frameworks, tools, api)

### Intelligent URL Matching
When comparing search results to expected URLs:
- **Flexible path matching**: `/reference/nx-json` should match `/references/nx-json`
- **Better alternatives**: Introduction pages are often better than API pages for users
- **Path variants**: `/ci/features/` vs `/features/ci-features/` are equivalent
- **Semantic matching**: Related content may be more valuable than exact URL matches

### Avoid Initial Mistakes
- **Don't create custom keyword lists** - use existing Ocean script
- **Don't use overly strict URL matching** - implement intelligent matching
- **Don't assume 0 score means no content** - check actual content quality
- **Do recalculate scores** with flexible matching after initial assessment

## CRITICAL: Content Analysis for Documentation Sites

When analyzing documentation sites (especially Astro/Starlight):

### mdoc File Analysis
- Look for content in `.mdoc` files under the documentation root
- Build content maps to understand what documentation exists vs what's searchable
- Check for content-search discrepancy (content exists but isn't discoverable)

### Search vs Content Gap
- Sites may have rich content that isn't properly indexed/searchable
- Score both "exact matches" and "content quality" separately
- Generate lists of content that needs better search discoverability

### Manual Review Tracking
- Always generate lists of ambiguous cases for human review
- Include expected URLs vs actual URLs found
- Provide confidence levels (high/medium/low) for matches
- Allow for user decision on URL equivalency

## CRITICAL: Ocean Script Integration

When working with Ocean scoring:

### Ocean Score Calculation
- Formula: `(10 × total_points) / (total_keywords × 3)`
- Position scoring: 3 points (1-3), 2 points (4-6), 1 point (7-9), 0 points (10+)
- Use `.endsWith()` matching for URL comparison, not exact string matching

### Ocean Script Updates
- Ocean script may be updated with new expected URLs during your work
- Always re-read the Ocean script if URLs seem mismatched
- Document URL structure migrations (like `/nx-api/` to `/technologies/`)

### Comparative Analysis
- Run Ocean scoring on both sites being compared
- Provide category breakdowns (commands, features, concepts, etc.)
- Calculate improvement scores and identify winning categories
- Generate actionable insights, not just raw scores

## CRITICAL: Nx Monorepo Development Patterns

### Astro Documentation Projects
- Astro projects in Nx monorepos typically don't have standard npm scripts
- Use `nx run PROJECT:serve` or navigate to project directory and use `npx astro dev --port PORT`
- Don't assume `npm run dev` exists - check project.json for available targets

### Build Process in Large Monorepos
- Avoid running full builds (`pnpm build`, `nx build`) for testing single changes
- Full builds can take 2+ minutes and often timeout
- Use project-specific builds: `nx run PROJECT:build` or development servers instead
- For quick validation, start dev servers rather than full builds

### Shared Components Between Deployment Contexts
- Components shared between main site (nx.dev) and docs site (astro-docs) need deployment-aware configuration
- Use props to control behavior rather than environment detection
- Main site and docs site may have different URL structures and domain requirements
- Always consider backward compatibility when modifying shared components

### Nx-Dev Project Structure
- `nx-dev/ui-common/` contains shared UI components like Footer, Header
- `astro-docs/` is the standalone documentation site using Astro + Starlight
- Shared components are imported as workspace dependencies (`@nx/nx-dev-ui-common`)
- Check imports in components to understand dependency structure

### TypeScript Compilation in Nx Projects
- Individual file TypeScript checks may fail due to missing JSX configuration
- This doesn't indicate actual syntax errors in your changes
- Use project-level typecheck targets: `nx run PROJECT:typecheck`
- Don't worry about standalone tsc errors if using React/JSX

