# The Task Planning Pattern: Why AI Should Plan Before It Codes

"Vibe coding" is the new hotness. Give Claude a prompt, let it write code, ship it. The demos are impressive. Someone builds a full app in 20 minutes. Twitter loves it.

I work on the Nx CLI team. I use Claude Code daily for production work -- generators, migrations, PR reviews, dependency audits. Vibe coding works fine for prototypes and throwaway scripts. It falls apart the moment you're working in a codebase that other people maintain, that has conventions, that needs to not break.

The failure mode is predictable. You give the AI a task. It starts writing code immediately. It makes assumptions about architecture that seem reasonable but are wrong. You catch the problem in code review -- or worse, you don't catch it and it ships. The AI was productive. It was also wrong. Those two things are not contradictory.

## The Pattern: Separate Planning from Execution

The fix is boring. It's the same thing you'd do with a junior engineer: require a design doc before writing code.

Here's the workflow I use:

**Step 1: Plan.** I run `/plan-task`, which creates a file at `.ai/yyyy-mm-dd/tasks/descriptive-name.md`. The AI reads the issue, explores the codebase, and writes a structured plan. It does not write any code.

**Step 2: Review.** I read the plan. I ask questions. "Why this approach instead of X?" "Did you check if there's an existing pattern for this?" "What about the edge case where the dependency isn't installed?" The AI revises. This takes 5 minutes.

**Step 3: Execute.** Once I approve, the AI works through the plan step by step. Each step maps to one logical git commit. If step 3 goes sideways, I know exactly where the plan diverged from reality.

**Step 4: Reflect.** `/reflect` captures what worked and what didn't, feeding improvements back into future planning.

That's it. No framework. No special tooling beyond markdown files in a directory.

## What Goes in a Task Plan

A plan file is not a todo list. It's a thinking artifact. Here's what matters:

- **Numbered steps**, each scoped to one logical commit. "Add version detection utility" is a step. "Implement the feature" is not.
- **Alternatives considered** and why they were rejected. This is where the AI demonstrates it actually understands the problem space rather than grabbing the first solution that compiles.
- **Expected outcome** for each step. What should `nx test` show? What should `git diff` look like?
- **A checklist** to track progress through execution.

The plan file becomes documentation. Six months later, when someone asks "why does version detection work this way?", the answer is in `.ai/2026-01-15/tasks/add-vite-version-detection.md`. Not buried in a Slack thread or lost in a chat history that got compacted.

## Why This Beats Yolo Prompting

**It forces architectural thinking before code exists.** Without a planning step, the AI pattern-matches against its training data and starts typing. With a planning step, it has to articulate *why* it's choosing an approach. This is where you catch the bad assumptions -- before they're embedded in 300 lines of code.

**Humans catch problems earlier.** Reviewing a 20-line plan takes 5 minutes. Reviewing a 500-line diff takes an hour. The plan surfaces wrong assumptions at the point where they're cheapest to fix. "Actually, we don't use `getDependencyVersion` there, we use `getDependencyVersionFromPackageJson`" is a trivial correction in a plan. In code, it's a rewrite.

**Each step is independently reviewable.** When you commit per step, `git bisect` works. When something breaks, you know it was step 3, not "somewhere in the 47 files Claude touched." This isn't theoretical -- I've used it to identify exactly where a migration generator started producing incorrect output.

**The plan is the documentation.** Code comments explain *what*. Commit messages explain *what changed*. The plan explains *why this approach, why not the alternatives, what we expected to happen*. This context is the first thing that gets lost and the hardest to reconstruct.

## Real Examples from Nx

### CNW Template Updates

Create Nx Workspace has four template repos (Angular, React, TypeScript, empty) that need to stay in sync with Nx releases. Without a plan, Claude tries to update all four simultaneously, misses edge cases in the Angular template's migration path, and produces a diff that's impossible to review.

With a plan: step 1 identifies which repos need updating. Step 2 runs `nx migrate` on the first repo and documents what changed. Step 3 verifies the result. Steps 4-6 repeat for each remaining repo, adapting based on what step 2 revealed. Each repo gets its own commit. When the React template needs a different migration path than TypeScript, that's a known deviation captured in the plan, not a surprise in code review.

### Version Detection Patterns

Adding version detection for a new dependency in Nx (say, Vite) has a specific shape: check if `getDependencyVersionFromPackageJson` exists, follow the pattern from `getInstalledViteMajorVersion`, use `semver.coerce` and `major`, write unit tests for four cases (not installed, older version, same version, explicit flag override).

Each of those is a distinct concern. The plan makes them explicit. Without it, Claude writes the utility function and maybe one test. The plan says: "Step 4: Add unit test for 'not installed' case. Step 5: Add unit test for 'existing older version preserved.' Step 6: Add unit test for 'explicit flag override.'" Every case gets covered because it was specified before any code was written.

### PR Reviews

The most underrated use of planning is for code review. When I ask Claude to review a PR, the plan says: "1. Pull the branch locally. 2. Cherry-pick the test commit onto master to verify the test fails without the fix. 3. Run `nx test PROJECT` to confirm. 4. Check if the fix handles the edge case from issue #X."

Without that plan, Claude reads the diff and gives surface-level feedback -- "looks good, consider adding a test for edge case Y." With the plan, it actually *verifies* whether the test works. The difference between reading code and running code is the difference between a useful review and a rubber stamp.

## Task Tracking: The Plans Need a Home

Plans need to be findable. I use a simple system:

**TODO.md** tracks in-progress and pending tasks. Each links to its plan file:

```markdown
## In Progress
- [ ] Add Docker plugin version detection (2026-03-28 09:30)
  - Plan: `dot_ai/2026-03-28/tasks/docker-version-detection.md`
  - Goal: Detect installed Docker plugin version, preserve existing
```

**COMPLETED.md** archives finished tasks by month, with one-line summaries.

**Recent Tasks** (last 10) sits at the top of TODO.md. This is the context-rebuilding section. When Claude starts a new session and needs to understand what I've been working on, it reads the last 10 tasks and instantly has working context. No "what are we doing again?" lag.

## The Session Continuation Problem

Here's a problem that planning solves which most people don't think about: context compaction.

Long Claude Code sessions hit the context window limit. The AI compacts the conversation into a summary. That summary can be stale -- it might say "changes are uncommitted" when you actually committed them after the summary was captured. If you trust the summary and run `git commit`, you might amend the wrong commit or create a duplicate.

This is why the plan file exists as an external artifact. After compaction, I don't trust Claude's memory of what happened. I trust `git status`, `git log --oneline -3`, and the plan file. The plan is ground truth. The AI's memory is a convenience that might be wrong.

The rule: always verify git status after context compaction. Don't trust commit hashes from the summary. The plan file tells you where you are in the sequence of steps. Git tells you what's actually been committed. Between the two, you can reconstruct the full state without relying on the AI's compressed recollection.

## The Meta-Point

AI is most useful when you treat it like a junior engineer who happens to type at 200 words per second.

You wouldn't let a junior push code without reviewing a design doc. You wouldn't let them make architectural decisions without explaining their reasoning. You wouldn't let them skip tests because "it works on my machine." The speed of the output doesn't change the need for the process.

Vibe coding removes the process to maximize speed. For a prototype, that's the right tradeoff. For a production codebase with 500+ contributors, it's a liability.

The task planning pattern is slower on any individual task. But it's faster across a project, because you don't spend time unwinding bad assumptions, debugging architectural mistakes, or reconstructing context that was lost to compaction. The 5 minutes you spend reviewing a plan saves the 45 minutes you'd spend reviewing a bad diff -- or the 3 hours you'd spend debugging the code that the bad diff introduced.

Plan first. Code second. It's not exciting. It works.

---

*Jack Hsu is an engineering manager on the Nx CLI team. The task planning workflow described here is part of an open-source AI configuration at [dot-ai-config](https://github.com/jaysoo/dot-ai-config).*
