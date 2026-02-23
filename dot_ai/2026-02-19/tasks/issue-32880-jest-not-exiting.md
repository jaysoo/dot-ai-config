# Issue #32880: Next.js Jest Tests Don't Exit Through Nx

**Issue**: https://github.com/nrwl/nx/issues/32880
**Date**: 2026-02-19
**Status**: Fix Applied
**Assignee**: Coly010

## Problem Summary

Running Jest tests for Next.js apps via `nx test` doesn't exit properly:
```
Jest did not exit one second after the test run has completed.
```

However, running Jest directly inside the app directory works fine.

## Root Cause

The Nx daemon client socket connection is left open inside the Jest process.

### Full causal chain:

1. `nx test next-app` spawns Jest with Nx env vars (e.g. `NX_TASK_TARGET_TARGET=test`)
2. Jest uses `next/jest` which loads `next.config.js` via `getConfig(resolvedDir)`
3. `next.config.js` uses `withNx` from `@nx/next/plugins/with-nx.ts`
4. In `with-nx.ts` (line ~125), when `NX_TASK_TARGET_TARGET` is set, it enters the "complex" code path (as opposed to the simple early return when the env var is absent)
5. That code path calls `createProjectGraphAsync()` with default options (`resetDaemonClient: false`)
6. `createProjectGraphAsync` connects to the Nx daemon via a Unix socket to fetch the project graph
7. The daemon socket is never closed — it stays open as a keep-alive handle
8. Jest finishes running tests but cannot exit because the open socket keeps the Node.js event loop alive

### Why it only affects Next.js projects

Non-Next.js projects don't have a `next.config.js` that calls `withNx`, so `createProjectGraphAsync` is never called inside the Jest process. The daemon connection is only in the parent Nx process, which manages its own lifecycle.

### Key conditional in `with-nx.ts` (~line 125):

```typescript
if (
  PHASE_PRODUCTION_SERVER === phase ||
  global.NX_GRAPH_CREATION ||
  !process.env.NX_TASK_TARGET_TARGET
) {
  // Simple path — just returns basic config, no daemon connection
  return { distDir: '.next', ...validNextConfig };
} else {
  // Complex path — connects to daemon, keeps socket open
  graph = await createProjectGraphAsync();
  // ...
}
```

When running via `nx test`, `NX_TASK_TARGET_TARGET` is always set, so it always enters the `else` branch.

## Fix

In `packages/next/plugins/with-nx.ts`, pass `resetDaemonClient: true` to `createProjectGraphAsync()`:

```typescript
graph = await createProjectGraphAsync({
  exitOnError: false,
  resetDaemonClient: true,
});
```

This tells the project graph function to call `daemonClient.reset()` after fetching the graph, which closes the socket and allows Jest to exit cleanly.

### Verification

| Scenario | Before Fix | After Fix |
|----------|-----------|-----------|
| `nx test next-app` | Hangs indefinitely | Exits cleanly |
| `NX_DAEMON=false nx test next-app` | Exits cleanly | Exits cleanly |
| `npx jest` (direct) | Exits cleanly | Exits cleanly |
| Non-Next.js `nx test react-lib` | Exits cleanly | Exits cleanly |
| `nx run-many -t test,build,lint -p next` | N/A | All pass |

## Investigation Trail

### Phase 1: Reproduction (completed)
- Created workspace at `/tmp/claude/repro-32880/next-ws`
- Confirmed `nx test next-app` hangs, direct `npx jest` exits fine
- `--detectOpenHandles` showed no handles but process still hung

### Phase 2: Comparative Analysis (completed)
- Created plain React library (`react-lib`) — exits cleanly via Nx
- Confirmed issue is Next.js-specific
- Examined Jest configs — Next.js uses `next/jest` wrapper

### Phase 3: Environment Variable Isolation (completed)
- Created test to print env vars during Jest execution
- Systematically tested env vars to find the culprit
- Found: `NX_TASK_TARGET_PROJECT` + `NX_TASK_TARGET_TARGET` together cause the hang
- This triggers the complex path in `with-nx.ts`

### Phase 4: Daemon Connection (completed)
- `NX_DAEMON=false` confirmed as a workaround (no socket to keep alive)
- Read `createProjectGraphAsync` in `packages/nx/src/project-graph/project-graph.ts`
- Found `resetDaemonClient` option that calls `daemonClient.reset()` to close the socket
- Patched `node_modules/@nx/next/plugins/with-nx.js` — confirmed fix works
- Applied fix to source at `packages/next/plugins/with-nx.ts`

## Files Changed

- `packages/next/plugins/with-nx.ts` (line ~144): Added `resetDaemonClient: true` to `createProjectGraphAsync()` call
