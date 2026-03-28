# Building a Self-Improving AI Workflow: Skills, Reflection, and Feedback Loops

Every "how I use AI" article follows the same script: paste your custom instructions, show a cool prompt, done. Static configuration. A snapshot that starts decaying the moment you write it.

I work on the Nx CLI team. I use Claude Code for several hours every day -- triaging issues, writing generators, reviewing PRs, auditing dependencies. Over the past few months I've built a workflow that doesn't just *use* AI. It *improves itself* with each session. The core idea: treat your AI configuration like a codebase, not a settings page.

## The Stack

The system has four components:

1. **CLAUDE.md** -- a markdown file of cross-cutting rules and preferences, stored in version control
2. **Skills** -- reusable markdown files in `dot_claude/skills/` that encode multi-step workflows
3. **USAGE.md** -- an invocation tracker that records every skill/command execution with dates and counts
4. **`/reflect`** -- a command that runs at the end of each session and closes the loop

None of these are novel individually. The compounding effect comes from how they connect.

## The Reflection Loop

At the end of a work session, I run `/reflect`. It does three things:

**1. Captures what happened.** It reads the session's git diff, task files, and conversation history, then updates the repo's architecture doc (`.ai/para/resources/architectures/<repo>-architecture.md`) with new file relationships, design decisions, and work history.

**2. Extracts corrections.** If I corrected Claude during the session -- "no, `NX_CNW_FLOW_VARIANT` controls *both* flow behavior and prompt copy, don't add a separate env var" -- that correction gets distilled into a rule in CLAUDE.md so it never happens again.

**3. Detects skill candidates.** This is the interesting part. Reflect looks for multi-step workflows that were repeated 2+ times, or that I explicitly asked to rerun. Signs of a skill candidate:

- A sequence of steps run multiple times ("check all pages for X, fix, validate")
- A QA/validation workflow I'll want to rerun on future work
- A process with clear inputs and outputs
- Anything where I said "can you do this again" or "run this on all pages"

When it finds a pattern, it suggests creating a skill file in `dot_claude/skills/` with trigger words, structured steps, and expected outputs.

```
dot_claude/
  skills/
    scan-and-audit.md       # Orchestrates 12 parallel scans
    dot-claude-guard.md     # Prevents editing synced files directly
    nx-docs-qa.md           # Documentation quality checks
    cnw-update-templates.md # Nx workspace template updates
  commands/
    reflect.md              # The reflection loop itself
    dictate.md              # Voice-to-structured-knowledge pipeline
    plan-task.md            # Task planning before execution
```

Skills are markdown. They're reviewable, PR-able, diffable. They live in the same repo as the rest of the configuration. Not buried in a chat UI that resets when you clear your history.

## USAGE.md: The Pruning Signal

Every time a skill or command runs, USAGE.md gets a timestamp and incremented count:

```markdown
| Name                 | Type    | Last Invoked | Count |
|----------------------|---------|-------------|-------|
| scan-and-audit       | skill   | 2026-03-27  | 4     |
| dot-claude-guard     | skill   | 2026-03-27  | 2     |
| kudos                | command | 2026-03-24  | 0     |
| plan-week            | skill   | 2026-03-24  | 0     |
```

Count zero is a signal. Either the trigger instructions are wrong (Claude doesn't know when to invoke the skill) or the skill isn't useful (prune it). Both are actionable.

`scan-and-audit` at count 4 in a single week tells a different story -- that's a skill earning its keep. The data is plain text, committed alongside the skills themselves. No analytics platform required.

## Concrete Examples

### scan-and-audit: From Manual Steps to Orchestrated Pipeline

This started as me manually running a dozen checks every week: scan competitors, audit dependencies, check community sentiment, review project health. Each scan was 3-5 steps. I'd forget some, run others twice, lose track of which I'd finished.

After `/reflect` flagged the pattern -- "you ran 8 sequential multi-step scans in the same session, each with similar structure" -- it became a skill that orchestrates all 12 scans as parallel subagents. One command, one report with delta tracking against last week's results. What used to take an afternoon of context-switching now runs while I review PRs.

### dot-claude-guard: Encoding a Recurring Mistake

My AI configuration lives in `~/projects/dot-ai-config/` and syncs to `~/.claude/`. I kept editing the synced copies directly -- `~/.claude/CLAUDE.md` instead of the source. Every time, the next sync would overwrite my changes.

After correcting Claude (and myself) three times, `/reflect` suggested a guard skill. Now `dot-claude-guard` intercepts any edit to `~/.claude/` or `~/.config/` synced files and redirects to the source repo. The mistake became impossible rather than just unlikely.

### CNW A/B Testing: Correction as Documentation

Nx's Create Nx Workspace (CNW) has an A/B testing system controlled by `NX_CNW_FLOW_VARIANT`. On three separate occasions, Claude tried to add a separate environment variable for prompt selection -- a reasonable assumption, but wrong. The single variable controls both flow behavior and prompt copy variant.

After the third correction, `/reflect` encoded the rule directly into CLAUDE.md under "CNW A/B Testing Infrastructure":

```markdown
- `NX_CNW_FLOW_VARIANT` controls BOTH flow behavior AND prompt copy variant
  -- NEVER add a separate env var for prompt selection
- `PromptMessages.getPrompt(key)` selects from the `messageOptions[key]` array
  using the flow variant index
```

That rule has prevented the same mistake across every subsequent session touching CNW code.

## Feedback Memories: Both Directions

Corrections are the obvious case for feedback. But the system also captures positive signals -- approaches that worked well.

When an investigation strategy finds the root cause quickly ("verify actual code path FIRST -- add logging to node_modules"), that gets recorded. When a debugging pattern avoids a known pitfall ("pnpm-lock.yaml rebase conflicts: NEVER use `git checkout --theirs`. Use `git checkout origin/master -- pnpm-lock.yaml && pnpm install --no-frozen-lockfile`"), it becomes a permanent rule.

The CLAUDE.md file I use today is roughly 500 lines. Every line exists because something went wrong without it or went right because of it. There's no speculative configuration.

## The Compounding Effect

Session 1: Claude doesn't know your repo's conventions. You correct it constantly.

Session 10: The common corrections are encoded. You're correcting edge cases.

Session 50: Most sessions need zero corrections for routine work. The corrections you *do* make are about genuinely novel situations -- which `/reflect` then captures for next time.

This isn't about making Claude "smarter." It's about building a persistent layer of project-specific knowledge that survives across sessions, across context windows, across the inevitable compaction that happens in long conversations.

The key insight: **your AI workflow should have the same feedback loop as your CI pipeline.** Code breaks a test, you add a test. Claude makes a mistake, you add a rule. Claude follows a good pattern, you encode it as a skill. Usage data tells you what's working and what to prune. The system converges on your actual workflow, not the workflow you imagined when you wrote the initial configuration.

## Getting Started

You don't need all of this on day one. Start with:

1. **Put your instructions in a file, in version control.** Not a chat UI text box.
2. **After each session, spend 2 minutes noting what you corrected.** Add those as rules.
3. **When you notice a repeated multi-step workflow, extract it into a named file.** Give it trigger words so the AI knows when to use it.
4. **Track usage.** Even a simple tally next to each skill name. Prune what isn't used.

The reflection loop will emerge naturally from these habits. The tooling just automates what you'd do manually if you were disciplined about it -- which, without automation, nobody is.

---

*Jack Hsu is an engineering manager on the Nx CLI team. The workflow described here is open source at [dot-ai-config](https://github.com/jaysoo/dot-ai-config) and works with Claude Code's CLAUDE.md convention.*
