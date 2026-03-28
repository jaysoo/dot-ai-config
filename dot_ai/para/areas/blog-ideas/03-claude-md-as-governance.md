# CLAUDE.md as Project Governance: Why Your AI Config Belongs in Version Control

Every developer I talk to has some version of the same story. They spent twenty minutes crafting the perfect system prompt. They pasted it into a settings UI or a chat window. They got great results for a week. Then they switched machines, or the tool updated, or they just forgot what they'd written. Gone.

I work on the Nx team, where I use Claude Code daily across multiple repositories -- the open-source Nx CLI, Nx Cloud, our documentation site, internal tooling. Over the past year, my CLAUDE.md file has grown from a few lines of "be terse" into a 2,000-line operational manual that encodes months of hard-won lessons. Losing that would be like losing my `.gitconfig` and `.zshrc` simultaneously, except worse, because those files don't contain institutional knowledge about why we never use `git checkout --theirs` on `pnpm-lock.yaml`.

The idea that AI configuration is disposable -- something you tweak in a settings panel and move on -- is wrong. It's infrastructure. And infrastructure belongs in version control.

## The dot-ai-config Pattern

Here's the setup. I have a dedicated git repository called `dot-ai-config`. It's the single source of truth for all AI-related configuration:

```
~/projects/dot-ai-config/
  dot_claude/
    CLAUDE.md          # Claude Code instructions
    CODEX.md           # OpenAI Codex instructions
    settings.json      # Claude Code settings
    commands/          # Slash commands (/dictate, /plan-task, etc.)
    skills/            # Reusable skill definitions
  dot_ai/              # Symlinked into each project as .ai/
  hooks/
    pre-push           # Runs sync on every push
  sync.sh              # Copies everything to ~/.claude/, ~/.config/, etc.
```

A `sync.sh` script copies files to where the tools expect them -- `~/.claude/CLAUDE.md`, `~/.claude/commands/`, and so on. A git `pre-push` hook runs this sync automatically. Push to the repo, everything updates.

The critical rule, enforced in the CLAUDE.md itself: **never edit the synced copies directly**. Always edit in `dot-ai-config`, then sync. To make this stick, I built a `dot-claude-guard` skill -- a Claude Code skill that intercepts any attempt to modify files in `~/.claude/` and redirects the edit to the source repository. The AI enforces its own governance.

## Why Version Control Changes Everything

When your AI instructions live in git, you get capabilities that a settings UI will never provide.

**Git blame tells you why a rule exists.** My CLAUDE.md has a section that reads: "NEVER use `git checkout --theirs pnpm-lock.yaml`." Without context, that looks paranoid. But `git blame` on that line points to a commit from three months ago, right after we spent half a day debugging a corrupted lockfile that broke CI for the entire team. The correct approach -- `git checkout origin/master -- pnpm-lock.yaml && pnpm install --no-frozen-lockfile` -- is right there in the instruction, born from a real incident.

**History shows how instructions evolved.** My CNW (Create Nx Workspace) A/B testing section has been rewritten four times. The first version was wrong about environment variable handling. The second overcorrected by suggesting separate env vars for each concern. The third got the `PromptMessages.getPrompt(key)` pattern right but missed the caching behavior. Each revision was a commit. Each commit was a lesson. New team members can read the history and understand not just the current rule, but the mistakes that led to it.

**Branching lets you experiment safely.** Trying a different approach to task planning? Branch your CLAUDE.md, test it for a week, merge if it works, discard if it doesn't. You can't do that with instructions pasted into a chat window.

**PRs let teammates review changes.** When I add a new rule like "always run `nx affected -t build-base,lint,test` locally before pushing," that can go through a pull request. A colleague might point out that the rule should specify which repo it applies to, or that the target list is incomplete. AI instructions benefit from code review exactly as much as application code does.

## Rules Written in Scar Tissue

The most valuable lines in my CLAUDE.md are the ones that encode past failures. A few examples from working on Nx:

**"Never commit to main/master -- use feature branches."** This one seems obvious, but it's in the config because Claude Code, left to its defaults, will happily commit directly to whatever branch you're on. One accidental push to main on a Friday afternoon, and now it's a rule. The AI reads it on every session start. The mistake can't repeat.

**"ALWAYS run `nx affected -t build-base,lint,test` locally before pushing."** This exists because Nx is open source. Community contributors submit PRs from forks, and fork PRs require a maintainer to manually approve each CI workflow run. Every failed push means someone has to click "approve" again, review the failure, and wait for the contributor to fix it. A 30-second local check saves 15 minutes of back-and-forth. We encoded this in the AI config so that Claude Code itself reminds me (and stops me) before pushing untested changes.

**The pnpm-lock.yaml rule.** During a rebase, `git checkout --theirs pnpm-lock.yaml` seems like a reasonable way to resolve conflicts in a generated file. It isn't. The lockfile from "theirs" may reference dependency versions that don't match your `package.json`. The correct resolution is to take the lockfile from the target branch and regenerate it. This is exactly the kind of nuanced, context-dependent knowledge that evaporates when instructions live outside version control.

**CNW A/B testing: "NEVER add a separate env var for prompt selection."** This rule took multiple iterations to get right. The `NX_CNW_FLOW_VARIANT` environment variable controls both flow behavior and prompt copy variant. On three separate occasions, Claude Code suggested adding a second env var to handle prompt selection independently. Each time, it broke the variant caching mechanism. The rule is now explicit, with enough context that the AI understands *why* not just *what*.

## Dual Config: CLAUDE.md and CODEX.md

Different AI tools have different strengths, different failure modes, and different instruction formats. My `dot-ai-config` repo contains both `CLAUDE.md` (for Claude Code) and `CODEX.md` (for OpenAI's Codex). They share the same foundational rules -- git workflow, commit format, the "never edit synced copies" constraint -- but diverge on tool-specific patterns.

Claude Code gets detailed skill definitions and MCP server configuration. Codex gets different guardrails around autonomy (it has a stronger tendency to push branches without being asked). Same source of truth, same review process, different tool-specific adaptations. When a rule applies universally -- like the lockfile resolution approach -- I update both files in the same commit.

## The Guard Skill Pattern

The weakest link in any "don't do X" system is human memory. Telling people "don't edit `~/.claude/` directly" works for about a week. After that, someone (usually me, at 11 PM, debugging something) edits the file directly, forgets to back-port the change, and the next sync overwrites it.

The guard skill fixes this. It's a Claude Code skill that triggers whenever the AI is about to modify any file in `~/.claude/`, `~/.config/kitty/`, `~/.config/fish/`, `~/.config/nvim/`, or any other synced location. Instead of making the edit, it redirects to the corresponding source file in `~/projects/dot-ai-config/`. The AI enforces the policy. You don't have to remember the policy. You just have to have written it down once.

This is a pattern worth generalizing: **use the AI to enforce the rules you've written for the AI.** It's self-referential in a way that actually works. CLAUDE.md says "invoke dot-claude-guard before editing synced files." Claude Code reads CLAUDE.md. Claude Code invokes the guard. The loop closes.

## The Auto-Sync Hook

The `pre-push` git hook is three lines:

```bash
#!/bin/bash
./sync.sh
exit $?
```

`sync.sh` handles the rest -- copying CLAUDE.md, commands, skills, settings, and also non-AI dotfiles (kitty, fish, nvim, mise, gitconfig, tmux) to their expected locations. One repo, one sync, everything stays consistent.

This means my entire development environment configuration -- AI instructions, terminal config, editor settings, shell functions -- lives in a single reviewable, branchable, blameable repository. When I set up a new machine, it's `git clone` and `./sync.sh`. Done.

## Start Simple

You don't need all of this on day one. Start with one thing: move your AI instructions out of whatever settings panel they're in and into a file that's tracked by git. Put it in your project repo or a dedicated config repo. Commit it.

Then, the next time something goes wrong -- the AI makes a mistake you've seen before, a teammate asks "why does it do that," you switch machines and lose your setup -- you'll have a place to write down the fix, a history that explains why, and a process that keeps it from happening again.

AI configuration isn't a settings panel. It's institutional knowledge. Treat it accordingly.
