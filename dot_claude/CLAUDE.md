# Individual Preference

These are preferences for myself (Jack Hsu - jack.hsu@gmail.com).

## IMPORTANT

- If it sounds like I'm asking you to perform a task then use @~/.claude/commands/plan-task.md
- If it sounds like I'm asking you to dictate notes then use @~/.claude/commands/dictate.md

## Pending tasks

- Store all pending tasks in `.ai/TODO.md` or `dot_ai/TODO.md` (whichever is present), and update it as things are checked off. Also add to the `yyyy-mm-dd` folder in `SUMMARY.md` that a task is pending.

For example,

```markdown
## In Progress

- [ ] Name of task (yyyy-mm-dd hh:mm)
  - Plan created: `dot_ai/yyyy-mm-dd/tasks/name-of-task.md`
  - Next steps: If there are any next steps mentioned in the task plan, there could also be a spec file under `yyyy-mm-dd/specs`
  - Goal: The goal according to the planned task and/or related specs
```

Where `yyyy-mm-dd hh:mm` is the timestamp.

## Completed tasks

- Move completed tasks in `.ai/TODO.md` or `dot_ai/TODO.md` (whichever is present) from the pending section to completed. Also add to the `yyyy-mm-dd` folder in `SUMMARY.md` that a task was completed.

```markdown
## Completed

- [x] Name of task (yyyy-mm-dd hh:mm)
  - Plan created: `dot_ai/yyyy-mm-dd/tasks/name-of-task.md`
  - Next steps: If there are any next steps mentioned in the task plan, there could also be a spec file under `yyyy-mm-dd/specs`
  - Goal: The goal according to the planned task and/or related specs
```

Where `yyyy-mm-dd hh:mm` is the timestamp.
