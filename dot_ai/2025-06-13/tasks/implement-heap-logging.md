# Implement Heap Logging Feature - Execution Plan

## Overview
This plan details the implementation of heap usage logging for Nx tasks, allowing developers to monitor memory consumption by setting `NX_LOG_HEAP_USAGE=true`.

**Based on**: `.ai/2025-06-13/tasks/heap-logging-complete-analysis.md`

**Goal**: When running `NX_LOG_HEAP_USAGE=true nx run <project>:<target>`, display peak RSS memory usage in the terminal output.

## Implementation Steps

### Step 1: Create Memory Tracker Service
**File**: `/packages/nx/src/tasks-runner/memory-tracker.ts`

**TODO**:
- [ ] Create MemoryTracker class
- [ ] Implement startTracking(pid) method
- [ ] Implement stopTracking(pid) method that returns peak RSS
- [ ] Handle process tree tracking for child processes
- [ ] Add error handling for when tracking fails

**Implementation Details**:
```typescript
import * as pidusage from 'pidusage';

export class MemoryTracker {
  private peakRss: Map<number, number> = new Map();
  private intervals: Map<number, NodeJS.Timer> = new Map();
  
  startTracking(pid: number): void {
    // Track memory every 100ms
    // Use pidusage with tree option to track child processes
  }
  
  stopTracking(pid: number): number | undefined {
    // Clear interval, return peak RSS
  }
}
```

**Reasoning**: 
- Using `pidusage` library for cross-platform compatibility
- Polling interval of 100ms balances accuracy vs overhead
- Map structure allows tracking multiple processes in parallel execution

### Step 2: Update Task Interface
**File**: `/packages/nx/src/config/task-graph.ts`

**TODO**:
- [ ] Add `peakRss?: number` field to Task interface
- [ ] Update any TypeScript interfaces that extend Task

**Implementation**:
```typescript
export interface Task {
  // existing fields...
  peakRss?: number; // Peak RSS memory usage in bytes
}
```

### Step 3: Integrate Memory Tracking in RunningNodeProcess
**File**: `/packages/nx/src/executors/run-commands/running-tasks.ts`

**TODO**:
- [ ] Import MemoryTracker
- [ ] Add memoryTracker property
- [ ] Start tracking in constructor if NX_LOG_HEAP_USAGE=true
- [ ] Stop tracking in exit handler
- [ ] Modify getResults() to include peakRss
- [ ] Update exitCallbacks type signature

**Key Changes**:
1. Constructor: Initialize memory tracking
2. Exit handler: Capture peak RSS
3. getResults(): Return interface includes peakRss

### Step 4: Thread Memory Data Through Task Orchestrator
**File**: `/packages/nx/src/tasks-runner/task-orchestrator.ts`

**TODO**:
- [ ] Update applyFromCacheOrRun() to receive peakRss
- [ ] Store peakRss in task object
- [ ] Pass task with peakRss to lifecycle callbacks

**Lines to modify**:
- ~493: Destructure peakRss from results
- ~498-502: Include peakRss in task when creating TaskResult

### Step 5: Update Result Interfaces
**Files**: Multiple interface files

**TODO**:
- [ ] Update process result interfaces to include peakRss
- [ ] Update TaskResult interface if needed
- [ ] Ensure type safety throughout the chain

### Step 6: Display Memory Usage in Terminal Output
**Files**: 
- `/packages/nx/src/tasks-runner/life-cycles/dynamic-run-many-terminal-output-life-cycle.ts`
- `/packages/nx/src/tasks-runner/life-cycles/dynamic-run-one-terminal-output-life-cycle.ts`
- `/packages/nx/src/tasks-runner/life-cycles/static-run-many-terminal-output-life-cycle.ts`

**TODO**:
- [ ] Create formatMemory() utility function
- [ ] Update printTaskResult() to display memory
- [ ] Handle case when peakRss is undefined
- [ ] Format memory in human-readable format (MB/GB)

**Display Format**:
```
✔  nx run myapp:build (2.5s) (peak: 256MB)
```

### Step 7: Handle Special Cases

#### 7.1 Pseudo-Terminal Support
**File**: `/packages/nx/src/tasks-runner/pseudo-terminal.ts`

**TODO**:
- [ ] Investigate if PseudoTtyProcess exposes PID
- [ ] Add memory tracking if possible
- [ ] Document limitations if not trackable

#### 7.2 Cached Tasks
- No action needed - cached tasks won't have peakRss
- Display logic already handles undefined gracefully

#### 7.3 Forked Process Runner
**File**: `/packages/nx/src/tasks-runner/forked-process-task-runner.ts`

**TODO**:
- [ ] Check if this runner is used
- [ ] Add memory tracking if needed

### Step 8: Add Tests
**Files**: Create new test files

**TODO**:
- [ ] Unit tests for MemoryTracker
- [ ] Integration test for RunningNodeProcess with memory
- [ ] E2E test with NX_LOG_HEAP_USAGE=true

### Step 9: Documentation
**Files**: 
- `/docs/shared/reference/environment-variables.md`
- Relevant guides

**TODO**:
- [ ] Document NX_LOG_HEAP_USAGE environment variable
- [ ] Add example output
- [ ] Note platform support

## Testing & Verification Process

### Local Testing Steps
1. Make code changes
2. Run `pnpm nx-release 23.0.0-test.1` to publish test version
3. Create test workspace:
   ```bash
   cd /tmp
   npx create-nx-workspace@23.0.0-test.1 test1 --preset=ts --no-interactive
   cd test1
   ```
4. Generate test library: `nx g @nx/js:lib libs/util`
5. Add memory-intensive task to `libs/util/project.json`:
   ```json
   {
     "targets": {
       "memory-test": {
         "executor": "@nx/js:node",
         "options": {
           "buildTarget": "util:build",
           "args": ["--memory-test"]
         }
       }
     }
   }
   ```
6. Create memory-intensive script in library
7. Run with logging: `NX_LOG_HEAP_USAGE=true nx run util:memory-test`
8. Verify peak RSS appears in output

### Iteration Process
- Increment version: test.1 → test.2 → test.3
- Fix issues found in testing
- Re-publish and re-test until working

## Expected Outcome

When complete, running:
```bash
NX_LOG_HEAP_USAGE=true nx run myapp:build
```

Should output:
```
> nx run myapp:build

✔  nx run myapp:build (2.5s) (peak: 256MB)
```

## Potential Challenges

1. **Cross-platform compatibility**: Memory tracking APIs differ between OS
   - Solution: Use `pidusage` library for abstraction

2. **Process tree tracking**: Tasks may spawn child processes
   - Solution: Use pidusage with tree option

3. **Performance overhead**: Frequent memory polling
   - Solution: Only track when explicitly enabled via env var

4. **Rust pseudo-terminal**: May not expose process info
   - Solution: Document limitation, track where possible

## Alternative Approaches

1. **Native implementation**: Use platform-specific APIs directly
   - Pro: More control
   - Con: More code, harder to maintain

2. **Post-execution analysis**: Parse process accounting data
   - Pro: No runtime overhead
   - Con: Platform-specific, requires special setup

3. **Wrapper script**: External script that tracks nx process
   - Pro: No code changes in Nx
   - Con: Less integrated, harder to use

## Decision: Proceed with pidusage integration as it provides the best balance of functionality, maintainability, and cross-platform support.

## CRITICAL: Implementation Tracking
When implementing or executing on this task, keep track of progress in this document by updating the TODO checkboxes and adding notes about any issues encountered or decisions made.