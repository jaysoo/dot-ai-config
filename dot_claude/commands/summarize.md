# Summarize

Given today's date in `.ai/yyyy-mm-dd` folder or `dot_ai/yyyy-mm-dd` folder, whichever is found first, go through files under specs, dictations, and plans folder and summarize what was accomplished today (where `yyyy-mm-dd` is today's date). Call it `SUMMARY.md`.

Also review the `.ai/TODO.md` or `dot_ai/TODO.md` file to find any completed tasks for the day and mention them in the summary. Note that the completed task may already be in the existing summary file.

## Update Recent Tasks List

After creating/updating the summary, also update the **"Recent Tasks (Last 10)"** section at the top of `dot_ai/TODO.md`:

1. Add any newly completed or in-progress tasks from today to the top of the list
2. Bump existing items down (item 1 → 2, 2 → 3, etc.)
3. Remove items beyond position 10 to keep only the last 10
4. Each entry should have:
   - **Task name** (date)
   - Summary: 1-2 sentence description
   - Files: path to relevant task/spec/sync file

Example entry:
```markdown
1. **Task name** (2025-12-16)
   - Summary: Brief description of what was accomplished
   - Files: `dot_ai/2025-12-16/tasks/task-file.md`
```

## IMPORTANT

This file should be concise, but offer a good high-level view of accomplishments for today. It will be used by:
- Me in the future to review notes and figure out what I did on certain days
- AI (like YOU) to build context around daily accomplishments in case I need to look for information on relevant tasks, specs, etc.
- My manager so I can quickly summarize what I've accomplished

The `SUMMARY.md` file may already exist. In that case, make sure the content is respected, in that existing info should be included in the updated summary without repeating information.

