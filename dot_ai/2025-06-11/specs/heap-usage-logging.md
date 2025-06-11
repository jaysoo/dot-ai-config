# NX CLI Heap Usage Logging Specification

## Overview

Add heap usage logging functionality to the NX CLI to display peak memory consumption (RSS - Resident Set Size) for each task during execution. This feature will help users identify memory-intensive tasks and diagnose out-of-memory issues in their builds.

## Requirements

### Functional Requirements

1. **Memory Metric**: Track peak RSS (Resident Set Size) - the maximum physical memory used during task execution
2. **Process Coverage**: Track aggregate memory usage of parent task process + all child processes
3. **Display Location**: Show peak RSS inline with task completion output (e.g., `✓ my-app:build [local cache] 2.5s (peak: 512MB)`)
4. **Memory Formatting**: Auto-scale units (MB for <1GB, GB for ≥1GB with one decimal place)
5. **Activation**: Enable via environment variable `NX_LOG_HEAP_USAGE=true` (phase 1), CLI flag later (phase 2)
6. **Polling Frequency**: Sample memory usage every 500ms while task is running

### Non-Functional Requirements

1. Cross-platform support (Linux, macOS, Windows)
2. Minimal performance overhead
3. No impact on existing functionality when disabled
4. Memory tracking must work for both success and failure cases

## Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User Input                           │
│                    (NX_LOG_HEAP_USAGE=true)                 │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Task Orchestrator                       │
│              (packages/nx/src/tasks-runner/)                │
│  • Creates tasks with memory tracking metadata               │
│  • Starts memory polling when task spawns                    │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Process Execution                        │
│            (packages/nx/src/executors/run-commands/)        │
│  • Spawns child processes                                    │
│  • Tracks process tree PIDs                                  │
│  • Polls memory usage every 500ms                           │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Terminal Output Layer                     │
│         (Node.js: dynamic-run-many-terminal-output-         │
│                    life-cycle.ts)                           │
│         (Rust TUI: tasks_list.rs - future phase)           │
│  • Formats and displays task results with memory info       │
└─────────────────────────────────────────────────────────────┘
```

### Key Files to Modify

1. **Task Definition** (`packages/nx/src/config/task-graph.ts`)
   - Add `peakRss?: number` field to Task interface

2. **Process Execution** (`packages/nx/src/executors/run-commands/`)
   - Implement memory tracking during process execution
   - Use `pidusage` package to track parent + child processes

3. **Terminal Output** (`packages/nx/src/tasks-runner/life-cycles/dynamic-run-many-terminal-output-life-cycle.ts`)
   - Modify `printTaskResult()` to include memory information
   - Update success/failure output formatting

4. **Task Runner** (`packages/nx/src/tasks-runner/`)
   - Initialize memory tracking when task starts
   - Store peak RSS in task metadata when task completes

## Implementation Phases

### Phase 1: Basic Node.js Implementation

1. **Environment Variable Support**
   - Check `process.env.NX_LOG_HEAP_USAGE`
   - Enable memory tracking when set to "true"

2. **Memory Tracking**
   - Add `pidusage` npm dependency
   - Implement memory polling service
   - Track process tree (parent + children)
   - Calculate peak RSS during execution

3. **Task Metadata Enhancement**
   - Add `peakRss` field to Task interface
   - Pass memory data through task lifecycle

4. **Terminal Output Integration**
   - Modify output formatting to include peak RSS
   - Support both TUI-disabled and TUI-enabled modes

#### CRITICAL: Verification

A few things need to be verified before marking Phase 1 as completed.

1. `nx build nx` must succeed
2. `pnpm nx-release 22.0.0-canary.i --local` must succeed (where i is currrent timestamp)
  a) Make sure local registry is running by checking `lsof -i tcp:4873`
  b) if local registry is not runnign on port 4873 then start it using `nx local-registry` (it will not exit as it is a long-running process)
3. If 1 & 2 fail, DO NOT CONTINUE, otherwise
  a) go to `/tmp` and run `npx -y create-nx-workspace@22.0.0-canary.i mytest-j --preset=ts --formatter=none --nx-cloud=skip` where i is the timestamp used previously in (2) and j is the latest timestamp that is recalculated
  b) Run `nx g @nx/js:lib libs/foo --no-interactive`
  c) Run `NX_LOG_HEAP_USAGE=true NX_TUI=false nx run-many -t build` and record output to a file under `/tmp` like `/tmp/nx-run-output-j.txt`
  d) check that the nx run output file has memory info as expected, like either KB, MB, GB, etc. -- it'll likely be MB

If any step or substep fails, go back an fix the implementation then try again from the beginning of verification steps (1).

### Phase 2: CLI Flag Support

1. Add `--log-heap-usage` command line flag
2. Implement flag parsing and precedence logic
3. Update help documentation

### Phase 3: Rust TUI Integration

1. Pass memory metadata to Rust TUI component
2. Update `tasks_list.rs` to display memory information
3. Ensure consistent formatting between Node.js and Rust outputs

### Phase 4: Enhanced Features (Future)

1. OOM detection and special formatting
2. Memory threshold warnings
3. Memory usage trends/analytics
4. Per-process breakdown option

## Technical Implementation Details

### Memory Tracking Service

```typescript
interface MemoryTracker {
  startTracking(pid: number): void;
  stopTracking(pid: number): number; // returns peak RSS
  private pollMemory(pid: number): void;
  private getProcessTree(pid: number): number[];
}
```

### Data Flow

1. Task starts → Create memory tracker with main process PID
2. Every 500ms → Poll RSS for process tree
3. Track maximum RSS value
4. Task completes → Stop tracking, store peak RSS in task
5. Output formatting → Read peak RSS from task, format for display

### Memory Formatting Function

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

## Testing Strategy

### Unit Tests

1. Memory formatting function tests
2. Process tree tracking tests
3. Peak RSS calculation tests
4. Environment variable parsing tests

### Integration Tests

1. E2E test with memory tracking enabled
2. Verify output format matches specification
3. Test with tasks that spawn multiple child processes
4. Test memory tracking for failed tasks

### Manual Testing Scenarios

1. Run with `NX_LOG_HEAP_USAGE=true nx build`
2. Run multiple tasks in parallel
3. Test with memory-intensive tasks
4. Verify cross-platform compatibility
5. Test with both `NX_TUI=true` and `NX_TUI=false`

## Error Handling

1. **pidusage failures**: Log warning but don't fail the task
2. **Platform-specific issues**: Gracefully degrade if memory tracking unavailable
3. **Performance impact**: Add circuit breaker if polling affects performance

## Success Criteria

1. Memory usage displayed accurately for all tasks when enabled
2. No performance regression when feature is disabled
3. Works consistently across all supported platforms
4. Helps users identify memory-intensive tasks
5. Provides useful information for debugging OOM failures

## Dependencies

- `pidusage` npm package (^3.0.0) - Cross-platform process memory tracking

## Configuration

```bash
# Enable heap usage logging
export NX_LOG_HEAP_USAGE=true
nx run-many -t build

# Output example:
# ✓ my-app:build [local cache] 2.5s (peak: 512MB)
# ✓ my-lib:build 10.3s (peak: 1.2GB)
# ✗ my-e2e:test 45.2s (peak: 3.8GB)
```

## Open Questions (Resolved)

1. ✓ Memory metric: Peak RSS confirmed
2. ✓ Process coverage: Parent + all children
3. ✓ Display format: Inline with task result
4. ✓ Implementation approach: Node.js first, then Rust
5. ✓ Configuration: Environment variable for phase 1
