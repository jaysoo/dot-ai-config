# NX CLI Heap Usage Logging - Phase 1 Implementation Plan

## Overview

This plan implements Phase 1 of the heap usage logging feature as specified in `dot_ai/2025-06-11/specs/heap-usage-logging.md`. The goal is to add memory tracking functionality to NX CLI that displays peak RSS (Resident Set Size) for each task during execution, activated via the `NX_LOG_HEAP_USAGE=true` environment variable.

## Prerequisites

- [ ] Verify NX repository is available and buildable
- [ ] Ensure local npm registry is running on port 4873
- [ ] Have Node.js and pnpm installed

## Implementation Steps

### Step 1: Add pidusage dependency

**Goal**: Add the cross-platform memory tracking library

**TODO**:
- [ ] Add `pidusage` to `packages/nx/package.json`
- [ ] Run `pnpm install` to update lockfile

**Files to modify**:
- `packages/nx/package.json`

**Reasoning**: We need pidusage for cross-platform process memory tracking. Version ^3.0.0 is specified in the spec.

### Step 2: Enhance Task interface with memory tracking

**Goal**: Add memory tracking fields to the Task interface

**TODO**:
- [ ] Add `peakRss?: number` field to Task interface
- [ ] Verify TypeScript compilation passes

**Files to modify**:
- `packages/nx/src/config/task-graph.ts`

**Reasoning**: We need to store peak memory usage in the task metadata to pass it through the task lifecycle.

### Step 3: Create memory tracking service

**Goal**: Implement a service that tracks memory usage for a process and its children

**TODO**:
- [ ] Create new file `packages/nx/src/executors/run-commands/memory-tracker.ts`
- [ ] Implement MemoryTracker class with:
  - `startTracking(pid: number): void`
  - `stopTracking(pid: number): number`
  - Private polling mechanism
  - Process tree tracking
- [ ] Add memory formatting utility function
- [ ] Add unit tests for memory tracker

**Files to create**:
- `packages/nx/src/executors/run-commands/memory-tracker.ts`
- `packages/nx/src/executors/run-commands/memory-tracker.spec.ts`

**Reasoning**: Centralizing memory tracking logic makes it reusable and testable. The 500ms polling interval is specified in requirements.

### Step 4: Integrate memory tracking into process execution

**Goal**: Track memory during task execution

**TODO**:
- [ ] Modify run-commands executor to check `NX_LOG_HEAP_USAGE` environment variable
- [ ] Start memory tracking when process spawns
- [ ] Stop tracking and store peak RSS when process completes
- [ ] Handle both success and failure cases
- [ ] Ensure tracking works for parent + child processes

**Files to modify**:
- `packages/nx/src/executors/run-commands/run-commands.impl.ts` (or similar)
- Related process execution files in the run-commands directory

**Reasoning**: We need to hook into the process lifecycle to track memory usage from start to finish.

### Step 5: Update terminal output formatting

**Goal**: Display memory information in task completion output

**TODO**:
- [ ] Modify `printTaskResult()` or equivalent method
- [ ] Add memory info to success output (e.g., `✓ my-app:build [local cache] 2.5s (peak: 512MB)`)
- [ ] Add memory info to failure output
- [ ] Support both TUI-disabled and TUI-enabled modes
- [ ] Test formatting with different memory sizes (KB, MB, GB)

**Files to modify**:
- `packages/nx/src/tasks-runner/life-cycles/dynamic-run-many-terminal-output-life-cycle.ts`
- Other terminal output related files

**Reasoning**: Users need to see memory usage inline with task results as specified.

### Step 6: Build and publish canary version

**Goal**: Create a testable version of NX with our changes

**TODO**:
- [ ] Run `nx build nx` and ensure it succeeds
- [ ] Run `pnpm nx-release 22.0.0-canary.{timestamp} --local`
- [ ] Verify canary version is published to local registry

**Reasoning**: We need a built version to test our implementation end-to-end.

### Step 7: End-to-end testing

**Goal**: Verify the feature works as expected

**TODO**:
- [ ] Create test workspace: `npx -y create-nx-workspace@22.0.0-canary.{timestamp} mytest-{timestamp} --preset=ts --formatter=none --nx-cloud=skip`
- [ ] Generate test library: `nx g @nx/js:lib libs/foo --no-interactive`
- [ ] Run with memory logging: `NX_LOG_HEAP_USAGE=true NX_TUI=false nx run-many -t build`
- [ ] Capture output to file: `/tmp/nx-run-output-{timestamp}.txt`
- [ ] Verify memory information appears in output
- [ ] Test with different task types and sizes
- [ ] Test with parallel tasks

**Reasoning**: Following the critical verification steps from the spec ensures our implementation works correctly.

### Step 8: Error handling and edge cases

**Goal**: Ensure robustness

**TODO**:
- [ ] Add graceful degradation if pidusage fails
- [ ] Handle platform-specific issues
- [ ] Ensure no performance impact when feature is disabled
- [ ] Add circuit breaker for polling if needed
- [ ] Test with tasks that fail or get killed

**Reasoning**: The feature should never cause tasks to fail and should degrade gracefully.

## Alternatives to Consider

1. **Memory tracking granularity**: We could track memory per executor instead of per process, but this would miss child processes
2. **Polling interval**: 500ms is specified, but we could make it configurable if performance issues arise
3. **Memory metric**: Using VSZ (Virtual Size) instead of RSS, but RSS is more meaningful for actual memory pressure

## Expected Outcome

When Phase 1 is complete:

1. Running `NX_LOG_HEAP_USAGE=true nx run-many -t build` will display memory usage inline with each task result
2. Memory will be formatted appropriately (MB for <1GB, GB for ≥1GB)
3. Memory tracking will work for both successful and failed tasks
4. The feature will have no impact when disabled (default behavior)
5. Cross-platform support (Linux, macOS, Windows) will be functional
6. All verification steps from the spec will pass

## Next Steps

After Phase 1 completion:
- Phase 2: Add CLI flag support (`--log-heap-usage`)
- Phase 3: Integrate with Rust TUI
- Phase 4: Enhanced features (OOM detection, thresholds, analytics)

## Notes

- Keep changes minimal and focused on Phase 1 requirements
- Ensure backward compatibility
- Follow NX coding conventions and patterns
- Write comprehensive tests for new functionality
- Document any assumptions or deviations from the spec