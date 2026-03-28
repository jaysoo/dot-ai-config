# MCP as Your Personal Knowledge Layer: Building a MyNotes Server for AI Context

Most MCP content follows the same pattern: connect Claude to Slack, wire up GitHub, query your Stripe dashboard. External APIs, external data. The Model Context Protocol has become the standard way to give AI assistants access to services you already use.

But there's an underexplored use case that I think matters more for day-to-day work: MCP as personal infrastructure. Not connecting to someone else's API -- building a knowledge layer over your own work history.

## The Memory Gap

I work on the Nx CLI team. I use Claude Code for several hours every day. And every session starts the same way: Claude knows nothing about what I did yesterday.

CLAUDE.md helps. It gives Claude project rules, commit conventions, debugging patterns, common pitfalls. But it's governance, not memory. It says "never add a separate env var for CNW prompt selection" -- it doesn't say "you spent three hours on NXC-3464 yesterday and got stuck on the template generation step."

That gap -- between rules and work history -- is where I kept losing time. Re-explaining context. Re-discovering decisions I'd already made. Re-reading specs I'd already summarized.

## MyNotes: An MCP Server Over Your Own Work

I built a MyNotes MCP server that indexes everything in my `.ai/` directory. Five tools:

- **`search_ai_content`** -- semantic search across all notes, tasks, specs, and summaries
- **`get_task_context`** -- pull the full context for a specific previous task, including the plan, progress, and any blockers
- **`find_specs`** -- locate specifications and design documents
- **`get_summaries`** -- access daily work summaries by date range
- **`extract_todos`** -- find all pending action items across every file

The `.ai/` directory it indexes follows a PARA structure:

```
.ai/
  2026-03-27/
    tasks/
      cnw-template-fix.md
    SUMMARY.md
  2026-03-26/
    tasks/
      vite-version-detection.md
    SUMMARY.md
  para/
    projects/        # Active work with deadlines
    areas/           # Ongoing responsibilities
    resources/       # Architecture docs, scripts
    archive/         # Completed work
```

Daily task files capture what I worked on, what decisions were made, what's still open. Daily summaries capture the session-level view. Architecture files capture the structural knowledge about each repo. Personnel notes, sync meeting history, specs -- it's all there, all indexed.

The server watches for file changes and reindexes automatically. No restart needed when I add a new task file or update a summary.

## The Priority Rule

The critical piece isn't the MCP server itself -- it's how it's integrated into Claude's decision-making. In my CLAUDE.md:

```markdown
**ALWAYS use MyNotes MCP first for:** personal content, tasks, specs,
TODOs, work history
```

This single line changes Claude's behavior fundamentally. When I ask "what was I working on yesterday?" Claude checks MyNotes before doing anything else. When I say "what did the spec say about the migration API?" it searches my notes before grepping the codebase.

Without this rule, Claude would do what any AI assistant does -- search the code, make reasonable guesses, ask me to re-explain. With it, Claude has access to the same context I have, without me restating it.

The practical effect: I stopped re-solving problems I'd already solved. Last week I picked up a task I'd paused three days earlier. Claude pulled the task plan, saw that I'd already explored two approaches and rejected them with reasons, and continued from where I left off. No "let me look at the code and suggest some approaches" preamble.

## Composing MCP Servers with Clear Precedence

MyNotes isn't my only MCP server. I run several, each with a distinct role and documented trigger words:

| MCP Server | Role | Triggers |
|---|---|---|
| **MyNotes** | Personal knowledge (highest priority) | "my notes", "my tasks", "previous work", "what did I work on" |
| **Linear** | Project management | Team backlogs, issue details, sprint data |
| **Gemini** | Fact verification, code review | "verify", "double-check", second opinions |
| **Playwright** | Browser automation | UI testing, visual verification |
| **Chrome DevTools** | Performance analysis | Lighthouse audits, runtime profiling |

The precedence matters. For any query about my work, tasks, or prior decisions, MyNotes comes first. Linear provides the canonical issue description and status. Gemini provides an independent check when I want to verify a technical claim. Playwright and Chrome DevTools handle the browser layer.

Each server's trigger words are documented in CLAUDE.md so Claude knows when to reach for which tool. There's no ambiguity about "should I search your notes or search Linear?" -- the triggers make it explicit.

## A Real Workflow

Here's how a typical session looks when I'm working on an Nx CLI issue:

**1. Session start.** Claude checks MyNotes for yesterday's summary and any in-progress tasks. It finds that I was working on NXC-3464 (CNW template updates) and had a task plan with three remaining steps.

**2. Issue context.** Linear MCP pulls the full issue description for NXC-3464 -- acceptance criteria, linked discussions, priority. MyNotes already has my notes on the issue, but Linear has the canonical requirements.

**3. Technical work.** I'm writing a version detection function. I ask Claude to check how we handle this pattern elsewhere. MyNotes finds that I documented the `getInstalledViteMajorVersion` pattern two weeks ago when working on a similar task. The note includes the gotcha about `semver.coerce` returning null for pre-release versions.

**4. Fact check.** I need to confirm whether Vite 8 changed its config export format. Gemini MCP cross-references the Vite changelog and migration guide.

**5. Validation.** After updating the docs site, Playwright MCP runs a visual check to confirm the new page renders correctly and navigation works.

**6. Session end.** `/reflect` updates the daily summary, captures any new patterns or corrections, and MyNotes indexes the new content for tomorrow's session.

No step in this workflow is extraordinary. The compound effect is that each session starts with context and ends by preserving it. The knowledge accumulates rather than evaporating when the context window resets.

## Building Your Own

The MyNotes server is straightforward to build. The `.ai/` directory is just markdown files. The server needs to:

1. **Walk the directory tree** and index file contents
2. **Expose search** -- even basic substring matching is useful; semantic search via embeddings is better
3. **Expose structured queries** -- "give me all TODO items" is a grep over known patterns, not an AI problem
4. **Watch for changes** -- `fs.watch` or similar, reindex on modification
5. **Register as an MCP server** in your Claude Code config

The harder part is the discipline of writing things down. MyNotes is only as good as the `.ai/` directory it indexes. The `/reflect` command helps by auto-generating summaries and updating architecture docs at the end of each session. But the task plans, the decision logs, the "I tried X and it didn't work because Y" notes -- those require intentional capture during the session.

The payoff compounds. A month of daily summaries and task plans means Claude can answer "when did we last change the CNW flow?" or "what was the conclusion on the Docker plugin approach?" without me remembering the answer myself.

## The Broader Point

MCP's killer feature isn't connecting to SaaS products. Any API wrapper can do that. The real value is building personal infrastructure that makes AI assistants context-aware about *your* work, *your* decisions, *your* history.

External MCP servers give Claude access to what the world knows. A personal MCP server gives Claude access to what *you* know -- and more importantly, what you knew last Tuesday but have since forgotten.

The protocol is the same. The tools are the same. The difference is pointing them inward instead of outward. For developers who use AI assistants daily, that inward-facing layer might be the highest-leverage MCP server you build.

---

*Jack Hsu is an engineering manager on the Nx CLI team. The workflow described here is open source at [dot-ai-config](https://github.com/jaysoo/dot-ai-config) and works with Claude Code's MCP server configuration.*
