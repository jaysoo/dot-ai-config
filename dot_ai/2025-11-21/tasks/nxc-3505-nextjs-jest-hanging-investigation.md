# NXC-3505: Next.js Jest Tests Do Not Exit Properly - Investigation Report

**Date**: 2025-11-21
**Issue**: [NXC-3505](https://linear.app/nxdev/issue/NXC-3505/nextjs-jest-tests-do-not-exit-properly)
**GitHub Issue**: [#32880](https://github.com/nrwl/nx/issues/32880)

## Problem Summary

When running Jest tests for Next.js apps via `nx test`, the tests complete successfully but Jest hangs and does not exit cleanly, showing the warning:

```
Jest did not exit one second after the test run has completed.

'This usually means that there are asynchronous operations that weren't stopped in your tests.
Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
```

However, running Jest directly in the app directory (`npx jest`) works fine and exits cleanly.

## Quick Answer for Users

**Why does this happen?**
- When running `nx test`, Jest tests pass but Jest doesn't exit cleanly
- The root cause is still being investigated (related to PTY/terminal emulation)
- This is **not a bug in your test code** - it's an interaction between Nx's process spawning and Next.js's Jest setup
- Running `npx jest` directly works fine

**Solution (Workaround):**
Add `forceExit: true` to your `jest.config` file:

```typescript
// apps/my-next-app/jest.config.cts
const config = {
  displayName: '@my-workspace/my-next-app',
  preset: '../../jest.preset.js',
  forceExit: true,  // ← Add this line
  // ... rest of config
};
```

This forces Jest to exit immediately after tests complete.

## Reproduction

Successfully reproduced the issue in `/tmp/next-ws`:

```bash
# Create workspace
npx -y create-nx-workspace@latest next-ws \
  --preset=next \
  --appName=next-app \
  --nextAppDir=true \
  --nextSrcDir=true \
  --unitTestRunner=jest \
  --no-interactive \
  --nx-cloud=skip

# Fails - hangs after tests pass
cd next-ws
npx nx test next-app

# Success - exits cleanly
cd apps/next-app
npx jest
```

## Root Cause Analysis - IN PROGRESS

### What We Know

**Behavior**: Tests pass successfully, but Jest hangs and doesn't exit when run via `nx test`

**Current Investigation Status**:
- ✅ Confirmed: Issue only occurs with `nx test`, not with direct `npx jest`
- ✅ Confirmed: `forceExit: true` workaround resolves the issue
- ⚠️ **CORRECTION NEEDED**: Initial analysis about "piped stdio" was WRONG

### Actual Code Path Used

The `nx:run-commands` executor uses **DIFFERENT code paths** depending on the command:

**For single commands** (which is the case for `nx test`):
- Location: `packages/nx/src/executors/run-commands/run-commands.impl.ts:150-155`
- Uses: `runSingleCommandWithPseudoTerminal()`
- This creates a **PTY (pseudo-terminal)** via Rust native bindings
- NOT using `exec()` with piped stdio as initially thought

**Code Logic** (line 130-138):
```typescript
const isSingleCommandAndCanUsePseudoTerminal =
  isSingleCommand &&
  usePseudoTerminal &&
  process.env.NX_NATIVE_COMMAND_RUNNER !== 'false' &&
  !normalized.commands[0].prefix &&
  normalized.usePty;
```

### PTY vs Piped Stdio

**PTY (Pseudo-Terminal)**:
- Emulates a real terminal device
- Makes the process think it's running interactively
- Used by: `runSingleCommandWithPseudoTerminal()` → Rust `RustPseudoTerminal.runCommand()`
- Location: `packages/nx/src/tasks-runner/pseudo-terminal.ts`

**Piped Stdio** (NOT used for single commands):
- Only used by `ParallelRunningTasks` (multiple commands)
- Uses Node's `exec()` function
- Location: `packages/nx/src/executors/run-commands/running-tasks.ts:400`

### TODO: Need to Investigate

1. **Why does Jest hang with PTY but not when run directly?**
   - What's different about PTY vs regular terminal?
   - What resources does Next.js/Jest leave open in PTY mode?

2. **Can we reproduce the PTY issue outside of Nx?**
   - Try using node-pty directly
   - Isolate whether it's PTY-specific or something else

3. **Check Rust implementation**
   - Look at `RustPseudoTerminal.runCommand()` in native Rust code
   - See how it spawns the process

### Evidence Collected

**What Works**:
- ✅ `npx jest` (direct) = Exits cleanly
- ✅ `npx jest --detectOpenHandles` (direct) = NO open handles reported, exits cleanly
- ✅ Adding `forceExit: true` to jest.config = Works with `nx test`

**What Hangs**:
- ❌ `nx test` (via PTY) = Hangs after tests pass
- ❌ `nx test -- --detectOpenHandles` = Still hangs (can't detect the handles causing issue)

## Testing Results

| Method | Working Directory | Result |
|--------|------------------|---------|
| `npx jest` (direct) | `apps/next-app/` | ✅ Exits cleanly |
| `nx test` (inferred target via `nx:run-commands`) | `apps/next-app/` (via cwd option) | ❌ Hangs after tests pass |
| Programmatic `runCLI` from app dir | `apps/next-app/` | ✅ Exits cleanly |
| Programmatic `runCLI` from app dir with `exec()` | `apps/next-app/` | ❌ Hangs (same as nx:run-commands) |

## Potential Solutions

### Solution 1: Use `forceExit` Option (Workaround)

**Pros**:
- Simple immediate fix
- Users can add to their jest.config.cts
- Already documented in Linear issue as workaround

**Cons**:
- Not a true fix - just forces exit
- Could mask real issues with open handles
- Jest documentation warns against using this

**Implementation**:
```typescript
// apps/next-app/jest.config.cts
const config = {
  displayName: '@next-ws/next-app',
  preset: '../../jest.preset.js',
  forceExit: true,  // ← Add this
  // ... other config
};
```

### Solution 2: Configure Jest to Use `--forceExit` via Inferred Target

**Pros**:
- Applies fix automatically for all users
- No user action required
- Centralized solution

**Cons**:
- Still a workaround, not a true fix
- Applies to all Next.js projects even if not needed

**Implementation**:
Update `@nx/jest/plugin` to detect Next.js projects and add `forceExit` to the inferred Jest command

### Solution 3: Modify `nx:run-commands` stdio Handling

**Pros**:
- Could fix the hanging issue at the root
- Benefits all executors, not just Jest

**Cons**:
- Risky - could break other use cases
- May have performance implications
- Complex change with wide-reaching effects

**Implementation**:
In packages/nx/src/executors/run-commands/running-tasks.ts:400:
```typescript
this.childProcess = exec(commandConfig.command, {
  maxBuffer: LARGE_BUFFER,
  env,
  cwd,
  windowsHide: false,
  stdio: 'inherit',  // ← Add this option
});
```

**Risk**: This changes behavior for all `nx:run-commands` usage.

### Solution 4: Investigate and Fix Root Cause in Next.js

**Pros**:
- True fix, not a workaround
- Benefits all tools/frameworks using Next.js with Jest

**Cons**:
- Requires collaboration with Next.js team
- May take longer to implement
- Outside of Nx's direct control

**Implementation**:
1. Create minimal reproduction showing the open handles issue
2. Report to Next.js team
3. Work with them to identify which resources aren't being cleaned up
4. Implement fix in `next/jest`

## Recommended Approach

**Immediate** (for Nx 22.x patch):
1. **Solution 1**: Update `@nx/next` generator to add `forceExit: true` to jest.config for new projects
2. Update documentation to recommend adding `forceExit: true` for existing projects
3. Add clear explanation in docs/migration guide:

**Documentation Text** (draft):
```markdown
### Next.js Jest Tests Not Exiting

When running `nx test` for Next.js applications, Jest tests may complete successfully but hang indefinitely without exiting.

**Workaround**: Add `forceExit: true` to your jest.config file:

```typescript
// apps/my-next-app/jest.config.cts
const config = {
  displayName: '@my-workspace/my-next-app',
  preset: '../../jest.preset.js',
  forceExit: true,  // Required for Next.js projects
  // ... rest of config
};
```

**Why this happens**: Jest doesn't exit cleanly when run through Nx's process runner (PTY) with Next.js's Jest configuration. Running `npx jest` directly works fine. This is not a bug in your test code, but an interaction between Nx's process spawning and Next.js's async resource loading.

**Links**:
- GitHub Issue: #32880
- Jest forceExit docs: https://jestjs.io/docs/configuration#forceexit-boolean
```

**Medium-term** (for Nx 23.x):
1. **Solution 2**: Update `@nx/jest/plugin` to automatically detect Next.js projects and pass `--forceExit` flag
2. This makes the workaround automatic and invisible to users

**Long-term**:
1. **Solution 4**: Investigate root cause with Next.js team
2. Create minimal reproduction showing how `next/jest` leaves handles open when run with piped stdio
3. Work with Next.js team to fix upstream
4. Once fixed in Next.js, remove automatic `--forceExit` from Nx

## Additional Context

- Related issues with `nx:run-commands` and stdio pipes:
  - [#21779](https://github.com/nrwl/nx/issues/21779) - nx:run-commands hangs with sequential commands
  - [#26346](https://github.com/nrwl/nx/issues/26346) - Default plugin tests hang in NX 19
  - [#22313](https://github.com/nrwl/nx/issues/22313) - Windows hangs with multiple commands

- Jest stdio handling issues:
  - [jest#3176](https://github.com/jestjs/jest/issues/3176) - Tests hang on Windows with PIPE stdin

## Next Steps

1. ✅ Investigate and document root cause
2. ⏳ Discuss with team which solution to pursue
3. ⏳ Implement chosen solution
4. ⏳ Add e2e tests to prevent regression
5. ⏳ Update documentation and migration guide
