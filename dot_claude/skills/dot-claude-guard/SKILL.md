---
name: dot-claude-guard
description: >
  Intercepts edits to ~/.claude/ files and redirects to ~/projects/dot-ai-config/dot_claude/.
  Triggers when modifying CLAUDE.md, skills, commands, or settings under ~/.claude.
  Also logs skill/command invocations to the usage tracker.
---

# dot-claude-guard

`~/.claude/` is a **synced copy** — the source of truth is `~/projects/dot-ai-config/dot_claude/`.

## When this skill triggers

Activate whenever you are about to:
- Edit, write, or create files under `~/.claude/` (CLAUDE.md, skills/*, commands/*, settings.json, settings.local.json)
- Modify any skill or command content

## What to do

1. **Redirect the edit** to the equivalent path under `~/projects/dot-ai-config/dot_claude/`:

   | Instead of | Edit this |
   |-----------|-----------|
   | `~/.claude/CLAUDE.md` | `~/projects/dot-ai-config/dot_claude/CLAUDE.md` |
   | `~/.claude/skills/<name>/SKILL.md` | `~/projects/dot-ai-config/dot_claude/skills/<name>/SKILL.md` |
   | `~/.claude/commands/<name>.md` | `~/projects/dot-ai-config/dot_claude/commands/<name>.md` |
   | `~/.claude/settings.json` | `~/projects/dot-ai-config/dot_claude/settings.json` |
   | `~/.claude/settings.local.json` | `~/projects/dot-ai-config/dot_claude/settings.local.json` |

2. **After editing**, run the sync script to propagate changes:
   ```bash
   ~/projects/dot-ai-config/sync.sh
   ```

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
