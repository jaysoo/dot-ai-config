# Port Fish functions to Zsh

## Goal

Make the established Fish command workflow available in Zsh from this repository's synchronized `zshrc`/`zshenv` sources.

## Plan

1. [x] Add portable interactive aliases, navigation helpers, Git/worktree utilities, Nx helpers, Kitty title handling, and Polygraph support to `zshrc`.
2. [x] Add the AI-agent-aware `op` guard to `zshenv`, where non-interactive Zsh invocations can use it.
3. [x] Restore the live Oh My Zsh initialization before the custom helpers, preserving the configured `robbyrussell` theme and `git` plugin.
4. [x] Synchronize the sources and verify Zsh parses both files and exposes the expected functions.
5. [x] Record completion in the task tracker.

## Implementation Notes

- Preserve Fish command names and behavior where it is safe and meaningful in Zsh.
- Correct known portability defects: idempotent `.ai` linking, duplicate `j` cases, and command-status reporting in workspace creators.
- Keep destructive commands explicit functions; they only run when intentionally invoked.
- Load Oh My Zsh before the custom helpers, so its initialization is not replaced and custom aliases can still take precedence.

## Expected Outcome

Interactive and non-interactive Zsh sessions receive the same useful shell workflow as Fish without editing synchronized destination files directly.
