# DOC-405: Improve AX for Getting Started / Intro Pages

**Linear Issue**: https://linear.app/nxdev/issue/DOC-405/improve-ax-for-getting-started-intro-pages
**Created**: 2026-02-11
**Status**: Planning

## Goal

Improve the Agentic Experience (AX) of Nx's Getting Started documentation pages so they work well with AI agents/assistants. By optimizing for AI readability, we also improve human readability.

## Scope

### In Scope (Phase 1)
Non-tutorial intro pages:
1. `intro.mdoc` - What is Nx? (combine with nx-cloud content)
2. `installation.mdoc` - Installation
3. `start-new-project.mdoc` - Start a new project
4. `start-with-existing-project.mdoc` - Add to existing project
5. `editor-setup.mdoc` - Editor Integration
6. `ai-setup.mdoc` - AI Integration

**Note**: `nx-cloud.mdoc` is NOT in the sidebar (orphaned page). Content should be merged into `intro.mdoc` as part of the comprehensive intro experience.

### Out of Scope (Phase 2+ - separate tasks)
- Tutorial pages (angular-monorepo, react-monorepo, typescript-packages, gradle)
  - These are longer (~700 lines) and have different AX requirements (AI-as-tutor use case)
- Concepts pages (mental-model, how-caching-works, task-pipeline-configuration, etc.)

**Note for future phases**:
- **Mermaid diagrams**: Replace prose-heavy explanations with diagrams (e.g., `affected` flow, caching, task pipelines). Text-based source for agents, visual for humans.
- **Glossary page**: Create `/docs/reference/glossary` for jargon definitions (monorepo, workspace, project graph, etc.). Link terms on first use.
- **`{% llms-only %}` blocks**: Hidden content for AI agents (success indicators, verification steps) not rendered on page.
- **Terminology decision**: Evaluate whether to use "Nx CLI" (user-facing product) instead of "Nx Core" (internal jargon). Current docs use Nx Core, but CLI/Console/Cloud/Plugins may be clearer product categories.

## Key AX Principle: User Journey Prioritization

Structure content by user journey stage, not arbitrary time periods.

### Stage 1: First Session - "Getting Started" (explain thoroughly)
What do I need to run my first successful Nx command?
- Install Nx
- Run a task (`nx build myapp`)
- See caching work (run again, see "cache hit")
- Explore project graph (`nx graph`)

### Stage 2: Daily Workflow - "Local Dev" (explain thoroughly)
What makes my local development experience better?
- Run tasks across projects (`nx run-many -t build test`)
- Generate code (`nx generate @nx/react:component`)
- Add plugins for my tech stack
- Editor integration (Nx Console)

### Stage 3: Team & CI Scaling (mention + link)
What do I need when working with a team?
- Remote caching (share cache across team/CI)
- `nx affected` (only run what changed in CI)
- Task pipelines (dependsOn configuration)
- Self-healing CI

### Stage 4: Advanced (skip or link only when contextually relevant)
What do I need to extend Nx?
- DTEs / Nx Agents
- Module boundaries
- Custom generators/executors
- Sync generators
- Conformance rules

---

**Content Ratio for Intro Pages:**
- **90%** - Stage 1 & 2 content (thoroughly explained)
- **10%** - Stage 3 content (mentioned with links)
- **0%** - Stage 4 content (users find it when they need it)

## Key AX Principle: Problem Hook / Motivation

Each page should establish **why the reader should care** before diving into features. Don't assume motivation.

### Pattern: Problem → Solution → Value

1. **State the problem** - What pain point does this solve?
2. **Present the solution** - How does Nx address it?
3. **Show the value** - What does the reader gain?

### Examples by Page

| Page | Problem Hook |
|------|--------------|
| **intro.mdoc** | "As codebases grow, builds slow down, CI becomes flaky, and code sharing gets complex." + AI hook: "Monorepos are ideal for AI, but assistants hallucinate without workspace context." |
| **editor-setup.mdoc** | "Running CLI commands manually is slow. Discovering available tasks is hard." |
| **ai-setup.mdoc** | "AI assistants hallucinate outdated Nx commands. They lack workspace context." |
| **installation.mdoc** | (Action page - hook less critical, but can mention "get started in 30 seconds") |

### AI-First Positioning

Since Nx positions itself as "AI-first", relevant pages should include an AI angle:
- **intro.mdoc**: Why monorepos + AI need Nx (context, accuracy, workspace understanding)
- **editor-setup.mdoc**: AI assistance through Nx Console MCP integration
- **ai-setup.mdoc**: Deep dive on AI integration (this page IS the AI hook)

### Contrast: Turborepo's Approach
Turborepo's intro page leads with "The monorepo problem" section before presenting solutions. This creates immediate reader buy-in.

**Nx should do the same** - frame the problem before the solution, especially on the intro page.

## Key AX Principle: Always Link Features

Every time a feature/capability is mentioned:
- **Always** include a link to its dedicated page
- Human readers can click to learn more
- AI agents can follow links to get deeper context

Example:
- ❌ "Nx provides remote caching to speed up CI"
- ✅ "Nx provides [remote caching](/docs/features/ci-features/remote-cache) to speed up CI"

## Key AX Principle: Copyable AI Prompts

For action-oriented pages (installation, setup, migration), provide a copyable prompt that users can give to their AI assistant (e.g., Claude Code) to accomplish the task.

### Why This Helps
- Users don't have to figure out how to phrase their request
- The prompt includes context the AI needs (commands, verification steps, success criteria)
- Reduces hallucination by giving the AI a well-formed starting point

### Pattern

```markdown
{% callout type="tip" title="AI Prompt" %}
Copy this prompt to your AI assistant:

> Add Nx to this project using `nx init`. After initialization, run `nx graph` to explore the project structure and show me how to run tasks with caching.
{% /callout %}
```

### Examples by Page

| Page | Suggested Prompt |
|------|------------------|
| **start-with-existing-project** | "Add Nx to this project using `nx init`. After initialization, run `nx graph` to explore the project structure and show me how to run tasks." |
| **installation** | "Install Nx globally and verify it's working with `nx --version`." |
| **editor-setup** | "Help me set up Nx Console in my editor and show me how to use it to run tasks." |
| **ai-setup** | "Set up the Nx MCP server so you have access to my workspace context and up-to-date Nx documentation." |

### Guidelines
- Keep prompts concise (1-2 sentences)
- Include the key command(s) the AI should use
- Mention verification/success criteria when applicable
- Don't over-specify - let the AI adapt to the user's context

## Use Cases to Optimize For

### 1. Information Retrieval
User asks agent: "What is Nx?" / "How do I install Nx?" / "What's the difference between Nx and Nx Cloud?"
- Agent should get accurate, concise answers from docs
- No hallucination of outdated information
- Clear when to recommend which approach

### 2. Task Execution
User asks agent: "Set up Nx in my project" / "Add Nx Cloud to my workspace"
- Agent should find correct commands
- Clear prerequisites and order of operations
- Success criteria should be explicit

### 3. Tutoring (Phase 2)
User points agent to tutorial: "Walk me through this tutorial step by step"
- Agent guides user through terminal like vimtutor
- Each step has clear inputs/outputs
- Agent can verify user completed step before proceeding

## AX Checklist

### Structure & Chunking
- [ ] **Descriptive headings** - Replace vague ("Overview") with specific ("How Nx Caches Task Results")
- [ ] **Short paragraphs** - 3-5 lines max, one concept per paragraph
- [ ] **Explicit hierarchy** - H2 for major sections, H3 for subsections
- [ ] **Front-loaded key info** - Most important info in first sentence of each section

### Clarity & Precision
- [ ] **Consistent terminology** - Same term for same concept throughout
- [ ] **Define jargon on first use** - Don't assume reader knows "inferred tasks", "workspace", etc.
- [ ] **Explicit over implicit** - State prerequisites, don't assume context
- [ ] **Concrete examples** - Show don't tell when possible

### Commands & Actions
- [ ] **Copy-pasteable commands** - No placeholders without explanation
- [ ] **Expected output** - What should user see after running command?
- [ ] **Error scenarios** - Common failures and how to resolve
- [ ] **Success criteria** - How does user know it worked?

### Navigation & Context
- [ ] **Clear page purpose** - First paragraph explains what page covers and who it's for
- [ ] **Logical flow** - Steps in order, dependencies explicit
- [ ] **Link every feature** - Every capability mentioned links to its dedicated page (AI/humans can follow)
- [ ] **Cross-references** - Link to related pages for deep dives, don't duplicate content
- [ ] **"What's next"** - Clear path forward at end of page

### AI-Specific Considerations
- [ ] **Factual accuracy** - No outdated information that conflicts with current behavior
- [ ] **Unambiguous recommendations** - When multiple options exist, recommend one for common case
- [ ] **Scannable structure** - Lists, tables, code blocks over prose where appropriate
- [ ] **Metadata accuracy** - Title, description match content
- [ ] **Copyable AI prompt** - For action pages, provide a prompt users can give to their AI assistant

## Page-by-Page Analysis

### 1. intro.mdoc (What is Nx?) + nx-cloud.mdoc merge
**Current State**: intro.mdoc is a good overview but verbose; nx-cloud.mdoc is orphaned (not in sidebar)
**Issues**:
- Callout "deepdives" are long - may confuse AI about main content vs supplementary
- "Where to go from here" section is just links - no guidance on which to choose
- YouTube embed - AI can't watch videos
- nx-cloud.mdoc is not discoverable, content should be part of intro
- Features mentioned without links (remote caching, self-healing CI, etc.)

**Recommendations**:
- **Add "The Monorepo Challenge" section at top** - frame the problem before presenting Nx as the solution (like Turborepo does)
- Add TL;DR after problem statement: "Nx is a build system for monorepos. It runs tasks fast through caching and parallelization."
- **Link every feature mentioned** to its dedicated page
- Structure by user journey (90/10 rule):
  - **90% content** - Stage 1 & 2: task running, caching, generators, plugins, project graph, Nx Console
  - **10% content** - Stage 3: remote caching, affected, self-healing CI (mention + link)
  - **Skip** - Stage 4: DTEs, module boundaries, custom executors (too niche for intro)
- Merge remote caching content from nx-cloud.mdoc (it's Stage 3 - mention + link)
- Delete or redirect nx-cloud.mdoc after merge
- Add decision tree for "where to go" (new project vs existing, JS vs non-JS)
- Remove or shorten "deepdive" callouts - they bloat the intro with Stage 3/4 content

### 2. installation.mdoc
**Current State**: Clean, tabbed interface
**Issues**:
- No verification step ("How do I know Nx is installed?")
- "Adding Nx to Your Repository" jumps to `nx init` without explaining when to use this vs create-nx-workspace
- Update section assumes user has Nx plugin

**Recommendations**:
- Add verification: `nx --version` or `which nx`
- Clarify: "Use `nx init` for existing repos, `create-nx-workspace` for new ones"
- Add troubleshooting for common install issues

### 3. start-new-project.mdoc
**Current State**: Three options presented
**Issues**:
- Option 1 (manual) uses bare `nx@latest init` - should be `npx nx@latest init` for non-global
- No clear recommendation for which option to use
- Option 3 (Nx Cloud) is really about full platform, not just "new project"

**Recommendations**:
- Lead with recommendation: "For most users, Option 2 is the fastest way to start"
- Fix command inconsistency
- Add decision criteria: "Choose Option 1 if..., Option 2 if..., Option 3 if..."

### 4. start-with-existing-project.mdoc
**Current State**: Good flow, practical
**Issues**:
- `nx@latest init` command (line 19) - same issue, needs `npx` for non-global
- "Next Steps" assumes JavaScript/npm workflow
- CI configuration examples only show GitHub Actions

**Recommendations**:
- Fix command
- Add note about non-JS repos
- Either add other CI providers or link to CI setup guide more prominently

### 5. editor-setup.mdoc
**Current State**: Clean, focused
**Issues**:
- Very short - almost too short for standalone page
- No setup/verification steps
- Neovim disclaimer may confuse AI about what's official
- **Missing problem hook** - why should users bother with Nx Console?

**Recommendations**:
- **Add problem hook**: "Manually running CLI commands and discovering available tasks is slow. You lose context switching between terminal and editor."
- Add brief "After installing" section with what to expect
- Clarify official vs community plugins more explicitly
- Add verification: "You'll know it's working when..."

### 6. ai-setup.mdoc
**Current State**: Good, but assumes familiarity with MCP
**Issues**:
- "MCP server" mentioned without explaining what MCP is
- Skills installation via npx unclear - what does it actually do?
- "Ralph Wiggum loop" reference - insider jargon
- **Missing problem hook** - why integrate AI with Nx?

**Recommendations**:
- **Add problem hook**: "AI coding assistants often hallucinate outdated Nx commands and lack context about your workspace structure. Nx's AI integration gives assistants accurate, up-to-date information."
- Add one-sentence MCP explanation with link
- Clarify what skills installation does to the filesystem
- Remove or explain cultural references

### 7. nx-cloud.mdoc → MERGE INTO intro.mdoc
**Current State**: Orphaned page (not in sidebar), marketing-focused
**Action**: Merge useful content into intro.mdoc, then delete or redirect this page

**Content to preserve**:
- What Nx Cloud IS (remote caching + distributed CI)
- How to connect (`nx connect` command)
- Link to detailed CI setup guide

**Content to drop**:
- Marketing statistics without context
- Video as primary content (keep as supplementary)

## Benchmarks / Evals

### Manual Testing with Claude Code
For each page, test these queries:
1. "What does [page topic] do?" - Should get accurate summary
2. "How do I [main action from page]?" - Should get correct steps
3. "What's the difference between [option A] and [option B]?" - Should get accurate comparison
4. "I tried [command] and got [error]" - Should get troubleshooting help

### Automated Evals (Future)
Create eval set with:
- 10-15 questions per page
- Expected answer patterns
- Run against Claude/GPT with MCP context
- Track accuracy over time

## Implementation Plan

1. **Audit** - Review each page against checklist, document specific issues
2. **Prioritize** - Rank changes by impact (factual errors > structure > polish)
3. **Edit** - Make changes, one page at a time
4. **Test** - Manual verification with Claude Code
5. **Iterate** - Refine based on testing results

## Success Criteria

- [ ] All checklist items addressed for each page
- [ ] Manual testing shows accurate responses for common queries
- [ ] No regression in human readability (peer review)
- [ ] Benchmark scores established for future comparison
