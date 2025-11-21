# NXC-3510: Node Executor Port Release Investigation

**Date:** 2025-11-21 09:05
**Linear Issue:** https://linear.app/nxdev/issue/NXC-3510/node-executor-may-not-release-ports-on-shutdown
**Goal:** Create a reproduction to verify if SIGTERM sent to the Nx process properly kills the Nest server and releases ports

## Issue Summary

Processes sometimes leave ports bound after task termination when using the Node executor.

**Context:**
- Observed after upgrading Nx from 21.2.3 to 21.6.9 (Node 22.14.0)
- Error: EADDRINUSE on port 4563 after task stop
- Repro may happen when the app does not handle shutdown signals
- Executor sends SIGTERM and uses `killTree`, which may not reliably clean up in all cases

## Investigation Plan

1. Create test workspace using `npx -y create-nx-workspace@latest node1 --preset=node-monorepo --appName=api --framework=nest --no-interactive --nx-cloud=skip`
2. Add logging to track process.pid in the Nest server main file
3. Test scenario 1: Send SIGTERM to the Nx process, verify if Nest server exits
4. Test scenario 2: Send SIGTERM directly to the Nest server process, verify shutdown behavior
5. Document findings and determine if this is a Node executor issue or app-level signal handling issue

## Findings

### Test 1: SIGTERM to Nx Process (PID 48713)
**Result:** ✗ FAILED - Server process remained running

**Observations:**
- Nx process (48713) terminated successfully
- **Nest server (48878) remained running** and port 3000 stayed bound
- Server process became orphaned (PPID changed from 48824 → 1)
- Port remained in EADDRINUSE state

**Process hierarchy:**
```
48632 (zsh)
  └─ 48637 (npm exec nx)
      └─ 48713 (node nx serve api) ← SIGTERM sent here
          └─ 48824 (intermediate process)
              └─ 48878 (nest server) ← NOT killed!
```

### Test 2: SIGTERM Directly to Nest Server (PID 48878)
**Result:** ✓ SUCCESS - Server terminated and port released

**Observations:**
- Server process terminated properly
- Port 3000 was released
- No orphaned processes

### Code Analysis

**Location:** `packages/js/src/executors/node/node.impl.ts`

**Signal Handlers (lines 275-286):**
The executor registers signal handlers on the Nx process:
```typescript
process.on('SIGTERM', async () => {
  await stopAllTasks('SIGTERM');
  process.exit(128 + 15);
});
```

**Stop Function (lines 228-251):**
Calls `killTree(task.childProcess.pid, signal)` to kill child processes.

**Issue Analysis:**
The problem appears to be in the process hierarchy and signal propagation:

1. The signal handler is registered on the Nx CLI process
2. When `nx serve api` is run, it creates a complex process tree
3. The actual Nest server is a **grandchild** (or further descendant), not a direct child
4. `killTree()` uses `pgrep -P` to find children, which should work recursively
5. **However, if intermediate processes die before `killTree()` completes building the process tree, descendant processes can become orphaned**

**Root Cause:**
There's a race condition in the shutdown sequence. When SIGTERM is sent to the Nx process:
- The intermediate processes may terminate before `killTree()` finishes scanning
- The Nest server gets orphaned (re-parented to PID 1) before it can be killed
- The orphaned process continues running, keeping the port bound

### Additional Context from Issue
- Observed after upgrade from Nx 21.2.3 → 21.6.9
- Node 22.14.0
- Apps without shutdown signal handlers are most affected
- Error: EADDRINUSE on port after task stop

## Recommendations

### Option 1: Fix killTree Race Condition
Modify `killTree()` to build the entire process tree **before** any processes are killed:

**Current behavior:** Kills processes while still discovering descendants
**Proposed:** Build complete tree first, then kill all at once

**Pros:** Prevents orphaning
**Cons:** More complex implementation

### Option 2: Forward Signals to Child Process
Register signal handlers on the forked child process itself:

```typescript
task.childProcess.on('SIGTERM', () => {
  // Let the child handle shutdown
  task.childProcess.kill('SIGTERM');
});
```

**Pros:** Simpler, more direct
**Cons:** Still doesn't handle grandchildren

### Option 3: Kill Process Group
Use process groups to ensure all descendants are killed:

```typescript
// When forking:
task.childProcess = fork(..., {
  detached: true  // Creates new process group
});

// When killing:
process.kill(-task.childProcess.pid, signal);  // Negative PID = entire group
```

**Pros:** Guaranteed to kill all descendants
**Cons:** Changes process isolation model

### Option 4: Document App-Level Handling
Document that apps should implement graceful shutdown hooks:

```typescript
// In Nest apps:
app.enableShutdownHooks();

// Or manually:
process.on('SIGTERM', async () => {
  await app.close();
  process.exit(0);
});
```

**Pros:** Most reliable, app controls own lifecycle
**Cons:** Requires user action, not automatic

## Reproduction Steps

1. Create workspace: `npx -y create-nx-workspace@latest node1 --preset=node-monorepo --appName=api --framework=nest --no-interactive --nx-cloud=skip`
2. Add logging to `apps/api/src/main.ts` to show `process.pid`
3. Start server: `nx serve api`
4. Note the server PID from logs
5. Find Nx process: `ps -ef | grep "nx serve api"`
6. Send SIGTERM to Nx process: `kill -TERM <nx-pid>`
7. Observe: Server process remains running and port stays bound
8. Verify: `lsof -i :3000` shows server still listening

## Related Files
- `packages/js/src/executors/node/node.impl.ts:275-286` - Signal handlers
- `packages/js/src/executors/node/node.impl.ts:228-251` - Stop function
- `packages/js/src/executors/node/lib/kill-tree.ts` - killTree implementation

## Next Steps

1. Discuss with team which approach to take (likely Option 3 or combination)
2. Implement fix in node executor
3. Add tests to verify child processes are properly cleaned up
4. Consider backporting to Nx 21.x if this is a regression
5. Document shutdown hook recommendations for users
