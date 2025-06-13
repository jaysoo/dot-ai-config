# Heap Logging Research Notes

## Executive Summary

This document captures research on implementing heap usage logging in Nx CLI to track peak RSS (Resident Set Size) memory consumption for each task during execution.

## End-to-End Task Execution Flow

### 1. Entry Points
- **CLI Command**: `nx run <project>:<target>` enters via `/packages/nx/src/command-line/run/run-one.ts`
- **Key Flow**: `runOne()` → `runCommand()` → `runCommandForTasks()` → `invokeTasksRunner()`

### 2. Task Orchestration Layer
- **Main Orchestrator**: `/packages/nx/src/tasks-runner/task-orchestrator.ts`
  - Manages task execution lifecycle
  - Handles parallel execution based on thread count
  - Coordinates caching and batch execution
  - **Key Methods**:
    - `init()`: Initializes the orchestrator
    - `executeNextBatchOfTasksUsingTaskSchedule()`: Determines next tasks to run
    - `runTask()`: Executes individual tasks
    - `applyFromCacheOrRun()`: Checks cache before running

### 3. Process Spawning
- **Run Commands Executor**: `/packages/nx/src/executors/run-commands/`
  - `run-commands.impl.ts`: Main executor entry point
  - `running-tasks.ts`: Process management classes
    - `ParallelRunningTasks`: Manages parallel execution
    - `SeriallyRunningTasks`: Manages serial execution
    - `RunningNodeProcess`: Wraps Node.js child process

### 4. Process Execution Details
- **Node.js Process Spawning**:
  ```typescript
  // In running-tasks.ts:RunningNodeProcess
  this.childProcess = exec(commandConfig.command, {
    maxBuffer: LARGE_BUFFER,
    env,
    cwd,
    windowsHide: false,
  });
  ```
- **Pseudo-Terminal Support**:
  - Uses Rust-based pseudo-terminal for better output handling
  - Provides native terminal experience
  - Handles ANSI escape codes properly

### 5. Terminal Output & Lifecycle
- **Dynamic Output Renderer**: `/packages/nx/src/tasks-runner/life-cycles/dynamic-run-many-terminal-output-life-cycle.ts`
  - `printTaskResult()`: Displays task completion with timing
  - **Current Output Format**: `✓ my-app:build [local cache] 2.5s`
  - **Target Format**: `✓ my-app:build [local cache] 2.5s (peak: 512MB)`

## Key Integration Points for Memory Tracking

### 1. Task Interface Enhancement
**Location**: `/packages/nx/src/config/task-graph.ts`
```typescript
export interface Task {
  // ... existing fields
  peakRss?: number; // NEW: Peak RSS in bytes
}
```

### 2. Process Start/End Tracking
**Current State**:
- Start times tracked in `dynamic-run-many-terminal-output-life-cycle.ts`:
  ```typescript
  lifeCycle.startTasks = (tasks: Task[]) => {
    for (const task of tasks) {
      tasksToProcessStartTimes[task.id] = process.hrtime();
    }
  };
  ```
- End times calculated on task completion

**Memory Tracking Integration**:
- Start memory tracking when process spawns in `running-tasks.ts`
- Poll memory every 500ms using `pidusage` library
- Track process tree (parent + children)
- Store peak RSS when process completes

### 3. Memory Tracking Service Architecture
```typescript
// New file: packages/nx/src/executors/run-commands/memory-tracker.ts
interface MemoryTracker {
  startTracking(pid: number): void;
  stopTracking(pid: number): number; // returns peak RSS
  private pollMemory(pid: number): void;
  private getProcessTree(pid: number): number[];
}
```

### 4. Integration Points

#### A. Process Spawning (running-tasks.ts)
- In `RunningNodeProcess` constructor:
  - Get process PID after spawn
  - Start memory tracking if `NX_LOG_HEAP_USAGE=true`
  - Store memory tracker instance

#### B. Process Completion
- In `RunningNodeProcess.addListeners()`:
  - On 'exit' event, stop memory tracking
  - Get peak RSS value
  - Pass value through task result

#### C. Task Orchestrator
- In `task-orchestrator.ts`:
  - Receive peak RSS from process runner
  - Store in task metadata
  - Pass to lifecycle for display

#### D. Terminal Output
- In `dynamic-run-many-terminal-output-life-cycle.ts`:
  - Modify `printTaskResult()` to include memory info
  - Format memory using helper function

## Memory Tracking Implementation Details

### Process Tree Tracking
- Must track parent process + all child processes
- Use `pidusage` library for cross-platform support
- Aggregate RSS across process tree

### Polling Strategy
- Poll every 500ms (configurable)
- Track maximum RSS value seen
- Stop polling on process exit

### Memory Formatting
```typescript
function formatMemory(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb < 1024) {
    return `${mb.toFixed(0)}MB`;
  } else {
    const gb = mb / 1024;
    return `${gb.toFixed(1)}GB`;
  }
}
```

## Data Flow Summary

1. **Task Start**:
   - `task-orchestrator.ts` calls `runTask()`
   - `run-commands.impl.ts` processes options
   - `running-tasks.ts` spawns child process
   - Memory tracker starts polling (if enabled)

2. **Task Execution**:
   - Process runs with memory polling every 500ms
   - Peak RSS tracked across process tree
   - Output streamed to terminal (if enabled)

3. **Task Completion**:
   - Process exits
   - Memory tracking stops, peak RSS calculated
   - Result passed through:
     - `RunningNodeProcess` → `getResults()`
     - `task-orchestrator.ts` → task result
     - `life-cycle` → `endTasks()`
     - `dynamic-run-many-terminal-output-life-cycle.ts` → display

## Critical Considerations

1. **Performance Impact**:
   - Memory polling must be lightweight
   - Consider circuit breaker if performance degrades
   - Only active when `NX_LOG_HEAP_USAGE=true`

2. **Cross-Platform Support**:
   - `pidusage` handles Windows/macOS/Linux differences
   - Graceful degradation if memory tracking fails

3. **Process Tree Complexity**:
   - Some tasks spawn many child processes
   - Must track entire process tree for accurate RSS
   - Handle process cleanup properly

4. **Integration with Existing Features**:
   - Works with both Node.js and Rust pseudo-terminal
   - Compatible with parallel/serial execution
   - Supports cached/non-cached tasks

## Next Steps

1. Implement `memory-tracker.ts` with pidusage
2. Integrate into `RunningNodeProcess` class
3. Thread memory data through task results
4. Update terminal output formatting
5. Add environment variable check
6. Write comprehensive tests
7. Verify with Phase 1 verification steps