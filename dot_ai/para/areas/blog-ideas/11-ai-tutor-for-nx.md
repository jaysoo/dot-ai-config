# Claude Code as Your Nx Tutor: Learning a Monorepo from the Inside Out

**Status:** Draft
**Target:** nx.dev blog or dev.to
**Author voice:** First person, Nx team member
**Word count target:** 1200-1500

---

You just joined a new team. The repo has 200 projects, a maze of task pipelines, custom generators, and a `nx.json` that looks like it was written by someone who left six months ago. The README says "run `nx build my-app`" and not much else.

Sound familiar?

I work on the Nx team, and this is the most common pain point we hear about. Not "how does Nx work?" — the docs cover that. The real question is: "how does Nx work *in this specific repo*, with *these* specific projects and *this* particular setup?"

That question used to require cornering a senior engineer. Now there's another option.

## The Onboarding Problem Nobody Solves

Nx documentation teaches you how to set up a monorepo, configure caching, define task pipelines. It's thorough. But it assumes you're starting from scratch or following a standard template. Real workspaces are messier. They've accumulated years of decisions, migrations, workarounds, and tribal knowledge that lives in people's heads.

When a new developer joins a team, they face a wall of context they need to absorb before they can be productive. Which projects matter? What does the dependency graph actually look like? Why does `nx build dashboard` also trigger `build` on seven other libraries? Why is there a custom executor nobody documented?

The same problem hits developers adopting Nx for the first time. You hear that Nx can speed up your CI by 80%, but your existing repo has its own build scripts, its own conventions, and you're not sure where to start without breaking something.

Traditional documentation can't solve this because the answer depends entirely on *your* codebase.

## AI Agents as Interactive Tutors

Here's what changed: AI coding assistants like Claude Code can be dropped into any repository and asked questions about it. Not generic questions about Nx — questions about *your* workspace.

```
> Explain the structure of this Nx workspace. What are the main
  applications and how do they relate to the shared libraries?
```

Claude Code reads your `nx.json`, scans your `project.json` files, traces the dependency graph, and gives you a plain-English explanation of how your workspace is organized. It's like having a senior engineer who's read every file in the repo and has infinite patience for follow-up questions.

Unlike static docs, it answers in context. Unlike a teammate, it's available at 2am and never gets annoyed when you ask "what does `implicitDependencies` mean?" for the third time.

## Why Monorepos and AI Tutoring Are a Perfect Match

This isn't just "throw AI at a codebase and hope for the best." Nx workspaces are uniquely well-suited for AI-assisted learning because Nx *already structures the information that AI needs to reason about*.

Think about what Nx provides:

- **The project graph** is a knowledge graph. Ask "what depends on this shared library?" and the AI can give you a precise answer, not a guess.
- **Task pipelines** define explicit dependency chains. "Walk me through what happens when I run `nx build my-app`" becomes a concrete, traceable question.
- **`nx show project <name>`** gives the AI a complete picture of any project — its targets, dependencies, tags, and configuration — in a single command.
- **Tags and project boundaries** provide high-level domain context. The AI can tell you "these are your feature libraries, these are your UI components, and this is the shared data-access layer" without reading every file.

Compare that to a sprawling, unstructured repository where the AI would have to guess at boundaries, infer build relationships from scattered scripts, and piece together architecture from folder conventions alone. Nx gives AI the map.

## Nx MCP: Going Deeper Than File Reading

We've taken this a step further with the Nx MCP (Model Context Protocol) server. Instead of requiring the AI to parse configuration files manually, MCP gives it structured access to workspace data through dedicated queries.

Setting it up is one command:

```bash
npx nx-mcp
```

This configures the MCP server, installs relevant skills, and sets up guidelines so Claude Code doesn't just *read* your files — it *understands* your workspace topology. It can query the project graph, resolve task dependencies, and access workspace metadata through purpose-built tools rather than grep.

## Tutorials You Can Paste Into Your Terminal

The latest Nx documentation includes tutorial series designed around this workflow. Instead of just reading a page, you get prompts you can paste directly into Claude Code.

Want to add Nx to an existing React app? There's a prompt for that. Claude Code walks you through `nx init`, configures caching for your specific build tools, and sets up task pipelines based on what's actually in your `package.json`.

Want to understand a monorepo you just inherited? Paste a prompt. Claude Code maps out the architecture, identifies the main applications, explains how the shared libraries connect, and highlights the task pipelines that matter.

These prompts are starting points, not scripts. Ask follow-up questions. Go deeper on the parts that confuse you. That's the whole point — the learning happens in a conversation, not on a static page.

## Real Scenarios Where This Changes Everything

**New team member onboarding.** "I just joined and this repo has 200 projects. Where do I start?" The AI walks through the project graph, identifies the main applications, traces their dependencies to shared libraries, and explains the conventions the team uses. What used to take a week of context-gathering becomes an afternoon of conversation.

**Adopting Nx in an existing repo.** "I have a Next.js app with a messy build setup. Help me add Nx." The AI runs `nx init`, explains what changed and why, configures caching for your specific toolchain, and verifies everything works. No guessing at configuration flags.

**Understanding CI pipelines.** "Why did CI run these specific tests?" The AI explains `nx affected`, traces the dependency chain from the files changed in your PR, and shows exactly why each test was included. Suddenly the CI pipeline isn't a black box.

**Learning generators.** "How do I create a new library in this workspace?" The AI shows you the available generators, explains the team's conventions (including custom ones), and walks you through running the generator with the right options.

**Debugging build failures.** "This project won't build." The AI reads the error output, checks the dependency graph for missing links, identifies misconfigured targets, and suggests the fix. No more staring at a stack trace wondering which of the 200 projects is the culprit.

## Documentation Is Becoming Conversational

There's a broader shift happening here. Documentation is evolving from "read this page" to "paste this prompt and have a conversation." The best learning has always happened in context — in your codebase, with your specific setup, at the moment you need the answer.

This doesn't replace good documentation. Concepts still need to be explained. Mental models still need to be built. But the application of those concepts to your specific situation? That's where an AI tutor excels.

Every developer on every team gets a patient, knowledgeable guide that knows their codebase. That's not a gimmick. That's a fundamental change in how developers learn tools.

## Get Started

Install Claude Code:

```bash
npm install -g @anthropic-ai/claude-code
```

`cd` into your Nx workspace and try these:

- "Explain the structure of this Nx workspace"
- "What are the main applications and how do they relate to the shared libraries?"
- "Walk me through what happens when I run `nx build my-app`"
- "I want to add a new feature library. What's the convention in this workspace?"

For the Nx MCP server:

```bash
npx nx-mcp
```

For the full guided tutorial experience, visit [nx.dev/getting-started/tutorials](https://nx.dev/getting-started/tutorials).

Your monorepo doesn't have to be a mystery. Ask it questions. It'll answer.
