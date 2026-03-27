---
name: dot-claude-guard
description: >
  Intercepts edits to ~/.claude/ and ~/.config/ synced files and redirects to ~/projects/dot-ai-config/.
  Triggers when modifying CLAUDE.md, skills, commands, settings, or dotfiles (kitty, fish, nvim, mise, git).
  Also logs skill/command invocations to the usage tracker.
---

# dot-claude-guard

`~/.claude/` and select `~/.config/` directories are **synced copies** — the source of truth is `~/projects/dot-ai-config/`.

## When this skill triggers

Activate whenever you are about to:
- Edit, write, or create files under `~/.claude/` (CLAUDE.md, skills/*, commands/*, settings.json, settings.local.json)
- Edit, write, or create files under `~/.config/kitty/`, `~/.config/fish/`, `~/.config/nvim/`, `~/.config/mise/`
- Edit `~/.gitconfig`, `~/.gitignore_global`, or `~/.tmux.conf`
- Modify any skill or command content

## What to do

1. **Redirect the edit** to the equivalent path under `~/projects/dot-ai-config/`:

   | Instead of | Edit this |
   |-----------|-----------|
   | `~/.claude/CLAUDE.md` | `~/projects/dot-ai-config/dot_claude/CLAUDE.md` |
   | `~/.claude/skills/<name>/SKILL.md` | `~/projects/dot-ai-config/dot_claude/skills/<name>/SKILL.md` |
   | `~/.claude/commands/<name>.md` | `~/projects/dot-ai-config/dot_claude/commands/<name>.md` |
   | `~/.claude/settings.json` | `~/projects/dot-ai-config/dot_claude/settings.json` |
   | `~/.claude/settings.local.json` | `~/projects/dot-ai-config/dot_claude/settings.local.json` |
   | `~/.config/kitty/*` | `~/projects/dot-ai-config/kitty/*` |
   | `~/.config/fish/config.fish` | `~/projects/dot-ai-config/fish/config.fish` |
   | `~/.config/fish/conf.d/*` | `~/projects/dot-ai-config/fish/conf.d/*` |
   | `~/.config/fish/functions/*` | `~/projects/dot-ai-config/fish/functions/*` |
   | `~/.config/nvim/*` | `~/projects/dot-ai-config/nvim/*` |
   | `~/.config/mise/config.toml` | `~/projects/dot-ai-config/mise.toml` |
   | `~/.gitconfig` | `~/projects/dot-ai-config/gitconfig` |
   | `~/.gitignore_global` | `~/projects/dot-ai-config/gitignore_global` |
   | `~/.tmux.conf` | `~/projects/dot-ai-config/tmux.conf` |

2. **Immediately after editing**, run the sync script so changes take effect right away (don't wait for git push):
   ```bash
   ~/projects/dot-ai-config/sync.sh
   ```
   This copies the edited files to their active locations (`~/.claude/`, `~/.config/`, etc.).

3. **Log the invocation** — update the usage tracker (see below).

## Usage Tracker

After any skill or command is invoked (not just this guard — ALL skills and commands), append/update an entry in `~/projects/dot-ai-config/USAGE.md`.

Format:
```markdown
| Name | Type | Last Invoked | Count |
```

- If the skill/command already has a row, update `Last Invoked` to today and increment `Count`
- If it's new, add a row with count 1
- Keep the table sorted by `Last Invoked` descending (most recent first)

This file lives in the dot-ai-config repo so it's version-controlled and reviewable.
