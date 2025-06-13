# Heap Logging Implementation - Complete Analysis & Verification

## Overview
This document provides a complete analysis of the Nx task execution flow and identifies all integration points for adding heap usage logging functionality.

## Complete File Inventory

### A. Main Execution Flow Files (15 files)

1. **CLI Entry Points**
   - `/packages/nx/src/command-line/run/run-one.ts` - Main CLI entry for `nx run`
   - `/packages/nx/src/command-line/run/run.ts` - Alternative executor entry (researched)

2. **Task Orchestration Core**
   - `/packages/nx/src/tasks-runner/run-command.ts` - Main command orchestration
   - `/packages/nx/src/tasks-runner/task-orchestrator.ts` - Core task execution logic
   - `/packages/nx/src/tasks-runner/tasks-schedule.ts` - Task scheduling logic

3. **Process Execution**
   - `/packages/nx/src/executors/run-commands/run-commands.impl.ts` - Run commands executor
   - `/packages/nx/src/executors/run-commands/running-tasks.ts` - Process management classes
   - `/packages/nx/src/tasks-runner/forked-process-task-runner.ts` - Fork-based runner

4. **Running Task Abstractions**
   - `/packages/nx/src/tasks-runner/running-tasks/running-task.ts` - Base interface
   - `/packages/nx/src/tasks-runner/running-tasks/node-child-process.ts` - Node process wrapper
   - `/packages/nx/src/tasks-runner/pseudo-terminal.ts` - Rust PTY support

5. **Lifecycle & Output**
   - `/packages/nx/src/tasks-runner/life-cycle.ts` - Lifecycle interface & composite
   - `/packages/nx/src/tasks-runner/life-cycles/dynamic-run-many-terminal-output-life-cycle.ts` - Terminal output
   - `/packages/nx/src/tasks-runner/life-cycles/dynamic-run-one-terminal-output-life-cycle.ts` - Single task output
   - `/packages/nx/src/tasks-runner/life-cycles/static-run-many-terminal-output-life-cycle.ts` - Static output

6. **Configuration**
   - `/packages/nx/src/config/task-graph.ts` - Task interface definition

### B. Detailed Execution Flow with Line Numbers

```
1. CLI ENTRY
   run-one.ts:25 runOne()
      ↓
   run-one.ts:84 calls runCommand()
      ↓
2. COMMAND ORCHESTRATION
   run-command.ts:423 runCommand()
      ↓
   run-command.ts:440 runCommandForTasks()
      ↓
   run-command.ts:523 invokeTasksRunner()
      ↓
3. TASK RUNNER SETUP
   run-command.ts:957 creates TasksRunner
      ↓
   (Default runner creates TaskOrchestrator)
      ↓
4. TASK EXECUTION
   task-orchestrator.ts:init()
      ↓
   task-orchestrator.ts:420 applyFromCacheOrRun()
      ↓
   task-orchestrator.ts:506 runTask()
      ↓
   task-orchestrator.ts:555 calls runCommands()
      ↓
5. EXECUTOR
   run-commands.impl.ts:98 runCommands()
      ↓
   Creates ParallelRunningTasks or SeriallyRunningTasks
      ↓
6. PROCESS SPAWNING
   running-tasks.ts:330 new RunningNodeProcess()
      - exec() spawns child process
      - THIS IS WHERE MEMORY TRACKING STARTS
      ↓
7. PROCESS MONITORING
   running-tasks.ts:384-437 addListeners()
      - stdout/stderr handlers
      - exit handler (WHERE MEMORY TRACKING STOPS)
      ↓
8. RESULT COLLECTION
   running-tasks.ts:340 getResults() Promise
      ↓
   task-orchestrator.ts:493 receives results
      ↓
9. LIFECYCLE CALLBACKS
   life-cycle.ts:56 endTasks() called
      ↓
10. OUTPUT DISPLAY
    dynamic-run-many-terminal-output-life-cycle.ts:117 printTaskResult()
    - FORMATS AND DISPLAYS OUTPUT WITH MEMORY
```

## Critical Integration Points

### 1. Task Interface Enhancement
```typescript
// task-graph.ts
export interface Task {
  id: string;
  target: Target;
  projectRoot: string;
  overrides: any;
  outputs: string[];
  cache?: boolean;
  dependsOn?: string[];
  inputs?: string[];
  hash?: string;
  hashDetails?: HashDetails;
  peakRss?: number; // NEW FIELD
}
```

### 2. Memory Tracking Start Point
```typescript
// running-tasks.ts:RunningNodeProcess constructor
constructor(...) {
  this.childProcess = exec(commandConfig.command, {...});
  
  // NEW: Start memory tracking
  if (process.env.NX_LOG_HEAP_USAGE === 'true') {
    this.memoryTracker = new MemoryTracker();
    this.memoryTracker.startTracking(this.childProcess.pid);
  }
}
```

### 3. Memory Tracking Stop Point
```typescript
// running-tasks.ts:addListeners()
this.childProcess.on('exit', (code) => {
  // NEW: Stop tracking and get peak RSS
  let peakRss;
  if (this.memoryTracker) {
    peakRss = this.memoryTracker.stopTracking(this.childProcess.pid);
  }
  
  // Pass peakRss through callback
  for (const cb of this.exitCallbacks) {
    cb(code, this.terminalOutput, peakRss); // MODIFIED
  }
});
```

### 4. Data Flow Through System
```typescript
// 1. RunningNodeProcess → getResults()
getResults(): Promise<{ code: number; terminalOutput: string; peakRss?: number }> {
  // Return includes peakRss
}

// 2. task-orchestrator.ts → applyFromCacheOrRun()
const { code, terminalOutput, peakRss } = await childProcess.getResults();
results.push({
  task: { ...task, peakRss }, // Store in task
  code,
  status: code === 0 ? 'success' : 'failure',
  terminalOutput,
});

// 3. TaskResult includes task with peakRss
export interface TaskResult {
  task: Task; // Now includes peakRss
  status: TaskStatus;
  code: number;
  terminalOutput?: string;
}
```

### 5. Display Integration
```typescript
// dynamic-run-many-terminal-output-life-cycle.ts:printTaskResult()
const printTaskResult = (task: Task, status: TaskStatus) => {
  switch (status) {
    case 'success': {
      const timeTakenText = prettyTime(...);
      const memoryText = task.peakRss ? ` (peak: ${formatMemory(task.peakRss)})` : '';
      writeCompletedTaskResultLine(
        output.colors.green(figures.tick) +
        SPACER +
        output.formatCommand(task.id) +
        output.dim(` (${timeTakenText})`) +
        output.dim(memoryText) // NEW
      );
      break;
    }
  }
};
```

## Special Considerations

### 1. Pseudo-Terminal Path
When using Rust pseudo-terminal (`task-orchestrator.ts:565`):
- Memory tracking needs to work with `PseudoTtyProcess`
- May need different PID access method
- Consider native Rust memory tracking integration

### 2. Parallel Execution
In `ParallelRunningTasks`:
- Multiple processes running simultaneously
- Each needs independent memory tracking
- Aggregate results properly

### 3. Cached Tasks
- Cached tasks don't spawn processes
- No memory to track
- Display logic should handle missing peakRss gracefully

### 4. Process Tree Tracking
- Tasks may spawn child processes
- Need to track entire process tree
- `pidusage` library handles this with tree option

### 5. Error Handling
- Memory tracking failures shouldn't fail task
- Graceful degradation if tracking unavailable
- Log warnings but continue execution

## Verification Checklist

- [x] Identified all process spawning points
- [x] Found where start/end times are recorded
- [x] Traced data flow from process to output
- [x] Located all terminal output formatters
- [x] Understood lifecycle callback system
- [x] Identified Task interface location
- [x] Found environment variable check points
- [x] Understood parallel vs serial execution
- [x] Located cache handling logic
- [x] Identified pseudo-terminal integration

## Implementation Order

1. Create `memory-tracker.ts` service
2. Add `peakRss` to Task interface
3. Integrate tracking in `RunningNodeProcess`
4. Modify result interfaces to include memory
5. Thread memory data through orchestrator
6. Update terminal output formatters
7. Add environment variable checks
8. Handle pseudo-terminal case
9. Write tests
10. Run verification steps from spec