# Heap Logging Implementation - Complete File Analysis

## End-to-End Execution Flow

### 1. CLI Entry Point
**File**: `/packages/nx/src/command-line/run/run-one.ts`
- Function: `runOne()` (line 25)
- Calls: `runCommand()` (line 84) from `run-command.ts`
- Purpose: Parses CLI arguments, determines project/target to run

### 2. Main Orchestration Entry
**File**: `/packages/nx/src/tasks-runner/run-command.ts`
- Function: `runCommand()` (line 423)
- Calls: `runCommandForTasks()` (line 440)
- Then: `invokeTasksRunner()` (line 908)
- Purpose: Sets up environment, handles pre/post execution hooks

### 3. Task Runner Invocation
**File**: `/packages/nx/src/tasks-runner/run-command.ts`
- Function: `invokeTasksRunner()` (line 908)
- Creates: `TasksRunner` instance (line 957)
- Passes: Task graph, lifecycle, hasher to runner
- Purpose: Initializes task execution infrastructure

### 4. Task Orchestration
**File**: `/packages/nx/src/tasks-runner/task-orchestrator.ts`
- Class: `TaskOrchestrator`
- Key methods:
  - `init()` - Initializes orchestrator
  - `executeNextBatchOfTasksUsingTaskSchedule()` - Schedules tasks
  - `applyFromCacheOrRun()` (line 420) - Executes or caches
  - `runTask()` (line 506) - Runs individual task
- Calls: `runCommands()` from run-commands executor (line 555)

### 5. Executor Implementation
**File**: `/packages/nx/src/executors/run-commands/run-commands.impl.ts`
- Function: `runCommands()` (line 98)
- Creates: Either `ParallelRunningTasks` or `SeriallyRunningTasks`
- Purpose: Determines execution strategy (parallel vs serial)

### 6. Process Management
**File**: `/packages/nx/src/executors/run-commands/running-tasks.ts`
- Classes:
  - `ParallelRunningTasks` (line 24) - Manages parallel execution
  - `SeriallyRunningTasks` (line 169) - Manages serial execution
  - `RunningNodeProcess` (line 307) - Wraps child process
- Process spawn: `exec()` call (line 330)
- Key: This is where we need to add memory tracking

### 7. Terminal Output
**File**: `/packages/nx/src/tasks-runner/life-cycles/dynamic-run-many-terminal-output-life-cycle.ts`
- Function: `createRunManyDynamicOutputRenderer()` (line 27)
- Method: `printTaskResult()` (line 117) - Formats and displays results
- Key: This is where we display memory usage

## Supporting Files (Used in Flow)

### 8. Task Scheduling
**File**: `/packages/nx/src/tasks-runner/tasks-schedule.ts`
- Class: `TasksSchedule`
- Purpose: Determines task execution order based on dependencies

### 9. Lifecycle Management
**File**: `/packages/nx/src/tasks-runner/life-cycle.ts`
- Interface: `LifeCycle` - Defines lifecycle hooks
- Class: `CompositeLifeCycle` - Combines multiple lifecycles
- Key methods: `startTasks()`, `endTasks()`, `printTaskTerminalOutput()`

### 10. Task Graph Definition
**File**: `/packages/nx/src/config/task-graph.ts`
- Interface: `Task` - Defines task structure
- Key: Need to add `peakRss?: number` field here

## Miscellaneous Files (Researched but not in main flow)

### 11. Alternative Entry Point
**File**: `/packages/nx/src/command-line/run/run.ts`
- Function: `runExecutor()` - Direct executor invocation
- Not used in typical `nx run` flow

### 12. Process Task Runner
**File**: `/packages/nx/src/tasks-runner/forked-process-task-runner.ts`
- Class: `ForkedProcessTaskRunner`
- Alternative task runner implementation

### 13. Pseudo Terminal
**File**: `/packages/nx/src/tasks-runner/pseudo-terminal.ts`
- Class: `PseudoTerminal`
- Rust-based terminal emulation for better output

### 14. Node Child Process
**File**: `/packages/nx/src/tasks-runner/running-tasks/node-child-process.ts`
- Class: `NodeChildProcess`
- Another process wrapper implementation

### 15. Running Task Interface
**File**: `/packages/nx/src/tasks-runner/running-tasks/running-task.ts`
- Interface: `RunningTask`
- Base interface for all running task implementations

## Flow Summary

```
CLI Input (nx run project:target)
    ↓
run-one.ts: runOne()
    ↓
run-command.ts: runCommand() → runCommandForTasks() → invokeTasksRunner()
    ↓
task-orchestrator.ts: TaskOrchestrator.init() → applyFromCacheOrRun() → runTask()
    ↓
run-commands.impl.ts: runCommands()
    ↓
running-tasks.ts: RunningNodeProcess (spawns process)
    ↓
[Task Execution with Memory Polling]
    ↓
Process exits → Results collected
    ↓
life-cycle.ts: endTasks() called
    ↓
dynamic-run-many-terminal-output-life-cycle.ts: printTaskResult()
    ↓
Terminal Output (with memory info)
```

## Key Integration Points for Memory Tracking

1. **Add field**: `task-graph.ts` - Add `peakRss?: number` to Task interface
2. **Start tracking**: `running-tasks.ts:RunningNodeProcess` - After `exec()` call
3. **Poll memory**: New `memory-tracker.ts` service using pidusage
4. **Stop & collect**: `running-tasks.ts` - In process exit handler
5. **Pass data**: Through task results to orchestrator
6. **Display**: `dynamic-run-many-terminal-output-life-cycle.ts:printTaskResult()`

## Questions for Verification

1. Are there other process spawning mechanisms we missed?
2. Is the data flow from process to output correct?
3. Are there other lifecycle hooks we should consider?
4. Should we also track memory for cached tasks?
5. How do we handle the Rust pseudo-terminal path?