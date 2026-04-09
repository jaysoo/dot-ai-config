---
name: apply-nightshift
description: >
  Apply patches/fixes from night-shift worker agents. Parses session reports, presents fixable issues
  for selection, creates git worktrees with applied patches, and commits for review.
  Triggers on "apply nightshift", "nightshift fixes", "apply patches", "night shift".
---

# Apply Night Shift Fixes

Apply patches and fixes produced by the Night Shift autonomous worker agents to the Nx repo via git worktrees.

## Inputs

The user may provide:
1. **A session date** (e.g., "from Monday 2026-04-06") — looks up `~/projects/night-shift/sessions/session-YYYY-MM-DD.md`
2. **A specific `/tmp/nightshift-work-XXXXX/` path** — skip selection, apply directly
3. **Nothing** — use the latest session file

## Workflow

### Mode A: Specific Patch Path Given

If the user points to a specific `/tmp/nightshift-work-XXXXX/` directory:

1. Read `reports/final-report.md` to understand the fix
2. Read `reports/confidence.json` for confidence score
3. Check if patches exist in `patches/`
4. Create a git worktree and branch, apply the patch, commit
5. Report back — do NOT open a PR

### Mode B: Session Review (Default)

#### Step 1: Find the Session

```bash
# Latest session
ls -t ~/projects/night-shift/sessions/session-*.md | head -1

# Or specific date
cat ~/projects/night-shift/sessions/session-2026-04-08.md
```

#### Step 2: Parse and Present Fixed Issues

Read the session `.md` file. Extract all issues with `Status: fixed`. Present a table:

```
# Night Shift Session: 2026-04-09 (33 fixed / 53 total)

| # | Issue | Title | Confidence | Reports |
|---|-------|-------|------------|---------|
| 1 | [#32864](https://github.com/nrwl/nx/issues/32864) | Rspack Angular i18n Windows paths | 82/100 | `/tmp/nightshift-work-u5Nn6B/` |
| 2 | [NXC-4157](https://linear.app/nxdev/issue/NXC-4157) | Update @nx/rollup defaults | 95/100 | `/tmp/nightshift-work-RyN4Ea/` |
...
```

Include:
- Issue link (GitHub or Linear)
- Short title
- Confidence score
- Work directory path
- Peer review status if present (changes-requested, approved, etc.)

**IMPORTANT:** Skip issues with `Status: error` or `Status: rejected`. Only show `Status: fixed`.

Ask the user: "Which issues do you want to apply? (e.g., 1,3,5 or 'all')"

#### Step 3: Apply Selected Issues

For each selected issue:

1. **Read the report:** `<work-dir>/reports/final-report.md`
2. **Check for patches:** `ls <work-dir>/patches/`
3. **Determine naming:**
   - GitHub issues: `issue-NNNNN` (e.g., `issue-32864`)
   - Linear issues: `NXC-NNNN` (e.g., `NXC-4157`)
   - Specs/other: descriptive slug (e.g., `e2e-perf-optimization`)
4. **Check if worktree already exists:**
   ```bash
   git -C ~/projects/nx worktree list | grep <name>
   ```
   If it exists, warn the user and skip unless they confirm overwrite.
5. **Create worktree:**
   ```bash
   cd ~/projects/nx
   git fetch origin master
   git worktree add ~/projects/nx-worktrees/<name> -b fix/<name> origin/master
   ```
6. **Apply the patch:**
   - If `patches/fix.patch` exists:
     ```bash
     cd ~/projects/nx-worktrees/<name>
     git apply <work-dir>/patches/fix.patch
     ```
   - If patch fails, try `git apply --3way` or fall back to reading `fixed/` files and manually placing them
   - If `fixed/` directory has files but no patch, read the report to find target paths and copy files:
     ```bash
     # Compare original/ vs fixed/ to understand changes
     diff <work-dir>/original/<file> <work-dir>/fixed/<file>
     # Then apply to the worktree at the correct path from the report
     cp <work-dir>/fixed/<file> ~/projects/nx-worktrees/<name>/<target-path>
     ```
7. **Commit:**
   ```bash
   cd ~/projects/nx-worktrees/<name>
   git add -A
   git commit -m "fix(scope): brief description

   ## Current Behavior
   <from report>

   ## Expected Behavior
   <from report>

   ## Related Issue(s)
   Fixes #NNNNN"
   ```
   - **NEVER co-author the commit** — commit must come only from Jack
   - Derive the commit scope from the package being changed (e.g., `angular-rspack`, `nx`, `react`)
   - Use `fix` for bug fixes, `docs` for documentation, `chore` for cleanup/TODOs
8. **Report status** for each issue applied

#### Step 4: Summary

After all selected issues are applied, show:

```
## Applied Fixes

| Issue | Worktree | Branch | Status |
|-------|----------|--------|--------|
| #32864 | ~/projects/nx-worktrees/issue-32864 | fix/issue-32864 | Ready for review |
| NXC-4157 | ~/projects/nx-worktrees/NXC-4157 | fix/NXC-4157 | Ready for review |
```

Remind the user:
- `cd ~/projects/nx-worktrees/<name>` to review
- Run `nx affected -t build-base,lint,test` before pushing
- Do NOT open PRs automatically

## Important Notes

- The Nx repo is at `~/projects/nx`
- Worktrees go in `~/projects/nx-worktrees/`
- Night shift sessions are at `~/projects/night-shift/sessions/`
- Work directories are at `/tmp/nightshift-work-XXXXX/`
- Patches may have stale git hashes — use `git apply --3way` or manual application as fallback
- Some issues have peer reviews at `<work-dir>/reports/peer-review.md` — mention review concerns when presenting
- Always base worktrees on latest `origin/master`
- Never push or open PRs unless explicitly asked
