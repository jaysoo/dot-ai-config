# List Active Sessions

Show all active/resumable Claude sessions from `dot_ai/TODO.md` (or `.ai/TODO.md`).

## Steps

1. Read the **Active Claude Sessions** section from `dot_ai/TODO.md`
2. Parse each entry: `- /path/to/dir — description (date)`
3. For each entry, display a resumable command:

```
Active Claude Sessions:

1. NXC-4143: cycle reminder (2026-03-25)
   cd /Users/jack/projects/nx-worktrees/NXC-4143 && claude -r

2. DOC-452: tutorial rewrite (2026-03-25)
   cd /Users/jack/projects/nx-worktrees/DOC-452 && claude -r
```

4. If no sessions found, say "No active sessions."

## Triggers

Invoke when the user asks:
- "which sessions are live", "active sessions", "list sessions"
- "what was I working on", "resume sessions", "open sessions"
- "where can I resume"
