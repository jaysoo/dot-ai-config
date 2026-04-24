# End Session

Remove the current working directory from the **Active Gemini Sessions** section in `dot_ai/TODO.md` (or `.ai/TODO.md`, whichever exists).

## Steps

1. Read `dot_ai/TODO.md` (fallback to `.ai/TODO.md`)
2. Find the "Active Gemini Sessions" section
3. Remove any line containing the current working directory (`$CWD`)
4. If the section is now empty (no `- /` lines remaining), leave just the section header and comments
5. Confirm removal to the user

## Triggers

Invoke this when the user says any of:
- "end session", "wrap up", "we're done", "done for now"
- "forget this session", "close session", "finish up"
- "that's all", "thanks, done"
