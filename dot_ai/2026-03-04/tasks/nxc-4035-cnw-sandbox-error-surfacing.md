# NXC-4035: Surface Clearer Error When CNW Hits SANDBOX_FAILED

**Linear Issue**: https://linear.app/nxdev/issue/NXC-4035/surface-clearer-error-when-cnw-hits-sandbox-failed
**Branch**: `NXC-4035`
**Worktree**: `/Users/jack/projects/nx-worktrees/NXC-4035`
**Started**: 2026-03-04
**Status**: Implementation complete, needs build/test validation

## Problem

Nicole ran CNW at 22.5.4 and hit SANDBOX_FAILED with zero useful output. The error said "Failed to install dependencies:" with nothing after it. Root cause was `~/.npm` permission issues (exit code 243), but users had no way to know that.

Two compounding issues:
1. `--silent` flag on install commands suppresses ALL output including errors — and since `execAndWait` uses `exec()` (captures output in memory, never shown to terminal), `--silent` provides zero UX benefit while hiding errors
2. When both stdout and stderr are empty, the error message is just an empty string

## Investigation

- Nicole's npm config: `strict-peer-deps=false`, `engine-strict=false` (not the cause)
- Manual sandbox reproduction: `npm install --silent --ignore-scripts` in temp dir → exit 243, empty stderr, no node_modules created
- Root cause: `~/.npm` cache permission issue (confirmed via Linear screenshots)

## Changes Made (3 files)

### 1. `packages/create-nx-workspace/src/utils/package-manager.ts`
- Removed `--silent` from ALL package manager install commands (npm, pnpm, yarn, bun)
- Rationale: `exec()` captures output in memory, never pipes to terminal — `--silent` just loses error info for no benefit

### 2. `packages/create-nx-workspace/src/utils/child-process-utils.ts`
- Increased `maxBuffer` from default 1MB to 10MB (prevents process being killed when PMs emit verbose warnings)
- Added fallback error message when both stderr and stdout are empty: includes exit code and log file path

### 3. `packages/create-nx-workspace/src/create-sandbox.ts`
- Structured error with: actual PM error message, exit code, log file path, actionable hint ("Please verify that `{install command}` runs successfully in a temporary directory")

## Expected Result

With Nicole's `~/.npm` permission issue, user would now see:
```
Failed to install dependencies
npm error Error: EACCES: permission denied, mkdir '/Users/nicole/.npm/_cacache'
Exit code: 243
Log file: /tmp/xxx/error.log

Please verify that "npm install --ignore-scripts" runs successfully in a temporary directory.
```

## Validation

- [ ] TypeScript compilation passes (verified ✅)
- [ ] `nx run-many -t test,build,lint -p create-nx-workspace` (blocked by disk space)
- [ ] `nx affected -t e2e-local`
- [ ] Manual test: corrupt `~/.npm` permissions and run CNW, verify error output
