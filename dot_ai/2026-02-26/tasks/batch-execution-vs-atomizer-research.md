# Batch Execution vs Atomizer: Deep Research

**Date**: 2026-02-26
**Status**: Research only — no implementation
**Problem**: Atomizer creates 1 task per spec file. With 3000 e2e files → 3000 tasks. Agent utilization suffers from inter-task latency, and task graph grows huge.

---

## Table of Contents

1. [How the Atomizer Works](#1-how-the-atomizer-works)
2. [How Nx Batch Execution Works](#2-how-nx-batch-execution-works)
3. [How Nx Cloud Distributes Tasks to Agents](#3-how-nx-cloud-distributes-tasks-to-agents)
4. [Why Batch Execution Cannot Directly Replace Sharding Today](#4-why-batch-execution-cannot-directly-replace-sharding-today)
5. [Solution Options](#5-solution-options)
6. [Recommendation](#6-recommendation)
7. [Key File Reference](#7-key-file-reference)

---

## 1. How the Atomizer Works

### Playwright (`packages/playwright/src/plugins/plugin.ts`)

When `ciTargetName` is set in plugin options, the plugin:

1. Reads `playwright.config.ts` to get `testDir`, `testMatch`, `testIgnore`
2. Discovers all test files via `getAllTestFiles()` (glob match)
3. Creates **one target per file**:

```
e2e-ci--tests/foo.spec.ts    → command: "playwright test tests/foo.spec.ts --output=..."
e2e-ci--tests/bar.spec.ts    → command: "playwright test tests/bar.spec.ts --output=..."
...
e2e-ci                        → executor: "nx:noop", dependsOn: [all atomized targets]
e2e-ci--merge-reports         → executor: "@nx/playwright:merge-reports"
```

Key details (lines 246-311 in plugin.ts):
- Each atomized target uses `command:` property (NOT `executor:`)
- `command:` property resolves to `nx:run-commands` executor (`project-configuration-utils.ts:1281`)
- Each target gets unique env vars for report output isolation (via `getAtomizedTaskEnvVars()`)
- Each target gets unique `outputs` for cache isolation
- Parent `e2e-ci` uses `dependsOn` with `params: 'forward'` and `options: 'forward'`
- Targets are grouped under `metadata.targetGroups['E2E (CI)']` for UI

### Jest (`packages/jest/src/plugins/plugin.ts`)

Same pattern (lines 296-397):

```
test-ci--src/unit.spec.ts     → command: "jest src/unit.spec.ts"
test-ci--src/int.spec.ts      → command: "jest src/int.spec.ts"
...
test-ci                        → executor: "nx:noop", dependsOn: [all atomized targets]
```

- Also uses `command:` syntax → resolves to `nx:run-commands`
- No merge-reports equivalent

### Critical Detail: Executor Resolution

**ALL atomized tasks resolve to `nx:run-commands`** because they use `command:` property, not `executor:`.

This means:
- `getExecutorNameForTask()` returns `"nx:run-commands"` for every atomized task
- `getExecutorForTask()` returns `nx:run-commands` config
- `nx:run-commands` has **NO `batchImplementation`** (see `packages/nx/executors.json`)

---

## 2. How Nx Batch Execution Works

### Overview

Batch execution groups multiple tasks (of the same executor) and runs them in a **single forked process** via IPC.

### Flow

```
TasksSchedule.scheduleBatches()
  → processTaskForBatches(): group root tasks by executor name into Batch objects
  → scheduleBatch(): remove from notScheduledTaskGraph, push to scheduledBatches

TaskOrchestrator.executeNextBatchOfTasksUsingTaskSchedule()
  → nextBatch(): pop from scheduledBatches
  → applyFromCacheOrRunBatch():
      → applyCachedResults(): try cache for all tasks
      → runBatch(): for uncached tasks
          → ForkedProcessTaskRunner.forkProcessForBatch()
              → fork(workerPath): spawn child process with batch/run-batch.js
              → BatchProcess IPC: send RunTasks message
              → Worker: loads executor's batchImplementationFactory()
              → Worker: calls batchImpl(taskGraph, inputs, overrides, context)
              → Worker: streams CompleteTask messages as tasks finish
              → Worker: sends CompleteBatchExecution when done
```

### Batch Scheduling Logic (`tasks-schedule.ts:215-286`)

A task is eligible for batching when ALL of these are true:
1. `--batch !== false` and `NX_BATCH_MODE !== 'false'` (line 120)
2. Executor has `batchImplementationFactory` (line 240)
3. Either `--batch === true` / `NX_BATCH_MODE === 'true'`, OR executor has `preferBatch: true` (line 248-252)
4. `task.parallelism === true` (line 294)
5. All dependencies are completed OR in the same batch (line 296-298)
6. Executor name matches the root task's executor (line 236)

### Batch Interface (`config/misc-interfaces.ts:41-48`)

```typescript
interface ExecutorJsonEntryConfig {
  schema: string;
  implementation: string;
  batchImplementation?: string;   // Path to batch executor
  preferBatch?: boolean;           // Auto-batch when --batch not explicit
  description?: string;
  hasher?: string;
}
```

### Batch Executor Signature

```typescript
type TaskGraphExecutor<T = any> = (
  taskGraph: TaskGraph,                    // Sub-graph of tasks to run
  inputs: Record<string, T>,              // Per-task options (keyed by task ID)
  overrides: T,                           // CLI overrides
  context: ExecutorContext
) => Promise<BatchResults | AsyncIterableIterator<BatchTaskResult>>;
```

Can return either:
- `BatchResults`: all results at once (`Record<taskId, TaskResult>`)
- `AsyncIterableIterator<BatchTaskResult>`: stream results as they complete

### IPC Protocol (`batch/batch-messages.ts`)

```
Parent → Child:  RunTasks { executorName, projectGraph, batchTaskGraph, fullTaskGraph }
Child → Parent:  CompleteTask { task, result }        (streamed, per-task)
Child → Parent:  CompleteBatchExecution { results }   (final)
```

### Existing Batch Implementations

**Jest** (`packages/jest/executors.json:5`):
```json
"batchImplementation": "./src/executors/jest/jest.impl#batchJest"
```

`batchJest()` (jest.impl.ts:164-263):
- Extracts `displayName` from each project's `jest.config`
- Calls `runCLI({ selectProjects: [...names] }, [workspaceRoot])` — single Jest process
- Attributes test results to projects by matching `testFilePath` against `projectRoot`
- **Limitation**: Only works across projects (different jest configs), NOT for atomized file-level tasks within a project

**Playwright**: No batch implementation. `executors.json` has no `batchImplementation` field.

**nx:run-commands**: No batch implementation. Generic command runner — can't know how to combine arbitrary commands.

---

## 3. How Nx Cloud Distributes Tasks to Agents

### Agent Polling Loop (Ocean: `execute-tasks-v3.ts`)

```
while (true) {
  response = api.tasksV2(executionId, completedTasks, ...)

  if (response.status === 'RUN_GROUP_COMPLETED') → exit
  if (!response.executionId) → wait 5s, continue

  // Download dependency artifacts
  downloadArtifacts(response.taskDependencies)

  // Execute ALL tasks from this batch
  results = runDiscreteTasks(tasks, projectGraph, ...)

  // Report completion → next iteration
  completedTasks = results
}
```

### Two Distribution Algorithms (Ocean: `AssignTasksToAgent.kt`)

**Algorithm 1: Traditional** (`useTaskSets=false`, default):
- `pickBatchOfTasksFromEligibleTasks()` (lines 862-909)
- Tries two strategies, picks best:
  - Strategy A: Match tasks with same parallelism config
  - Strategy B: Greedily pick tasks by path weight up to parallelism limit
- Returns whichever has higher total path weight
- `maxParallel` returned = number of tasks in batch

**Algorithm 2: Task Sets** (`NX_CLOUD_USE_TASK_SETS=true`):
- `pickTasksUsingBatching()` (lines 792-860)
- Duration categories: SHORT (<5s), MEDIUM (5-20s), LONG (>20s)
- First task determines category; only same-category tasks grouped
- Round-robin into N buckets (N = defaultParallelism)
- Each bucket fills to `NX_API_DEFAULT_BATCH_DURATION` (default 20s)
- Hard limit: `NX_API_BATCH_TASK_COUNT_LIMIT` (default 150 tasks)
- `maxParallel` returned = configured parallelism (stays fixed)

### Agent-Side Execution (V3 path)

`runDiscreteTasks()` (`init-tasks-runner.ts:165-209`):
1. Creates `TaskOrchestrator` with `parallel = tasks.length`
2. Checks for batch-eligible tasks → runs them via `applyFromCacheOrRunBatch()`
3. Remaining tasks → individual `applyFromCacheOrRunTask()`
4. Returns array of promises

**Critical**: `runDiscreteTasks` DOES check for batch-eligible tasks. If the executor has a `batchImplementation`, tasks WILL be batched on the agent side.

### Latency Between Batches

- No artificial delay between batches — agent polls immediately after completion
- 5s wait only when no execution is available
- 20s wait only on rerun scenarios
- **Main latency sources**: HTTP round-trip + cloud scheduling + artifact download

### No Task Affinity

Cloud has NO concept of "these atomized tasks belong to the same project". Distribution is based on:
- Duration estimates (task sets)
- Path weight / parallelism (traditional)
- Assignment rules (target pattern matching)

---

## 4. Why Batch Execution Cannot Directly Replace Sharding Today

### Blocker 1: Executor Mismatch

Atomized tasks use `command:` syntax → resolves to `nx:run-commands` executor.

`nx:run-commands` has **no `batchImplementation`** and **cannot have a generic one** because it runs arbitrary shell commands. It doesn't know that `playwright test file1.spec.ts` and `playwright test file2.spec.ts` can be combined into `playwright test file1.spec.ts file2.spec.ts`.

Even if you added a `batchImplementation` to `nx:run-commands`, it would need framework-specific knowledge to merge commands. You can't just concatenate `playwright test A` + `playwright test B` → `playwright test A B` generically.

### Blocker 2: Batch Grouping Dimension

Current batch execution groups tasks **by executor name across projects**:
- Project A `build` + Project B `build` → batch (same executor)

Atomizer creates tasks **within a single project**:
- Project A `e2e-ci--file1` + Project A `e2e-ci--file2` → should batch

Both use `nx:run-commands`, so technically they'd group together. But `nx:run-commands` doesn't have batch support, and even if it did, you wouldn't want to batch unrelated `nx:run-commands` tasks from different projects.

### Blocker 3: Jest Batch Is Wrong Abstraction

Jest's `batchJest()` uses `--selectProjects` to run multiple **projects** in one Jest instance. It:
- Requires `displayName` in each project's jest config
- Attributes results by matching `testFilePath.startsWith(projectRoot)`
- Groups by project, not by file

For atomized tasks, all files are from the **same project**. The current Jest batch impl doesn't help here.

### Blocker 4: Cache Granularity

Batch execution runs tasks together but caches individually (each task gets its own cache entry). If atomized tasks were batched, we'd need to either:
- Cache the batch as a whole (loses per-file granularity)
- Cache per-file (requires the batch executor to produce per-task outputs)

The current batch infrastructure handles per-task caching correctly (tasks are cached individually after batch completes), so this isn't a hard blocker — but the batch executor needs to report per-task results.

---

## 5. Solution Options

### Option A: Plugin-Level Grouping ("Static Sharding")

**Change atomizer plugins** to group files into shards instead of creating one task per file.

```
# Before: 3000 files → 3000 tasks
e2e-ci--tests/foo.spec.ts
e2e-ci--tests/bar.spec.ts
...

# After: 3000 files → 100 shards of 30 files
e2e-ci--shard-001    → command: "playwright test file1 file2 ... file30 --output=..."
e2e-ci--shard-002    → command: "playwright test file31 file32 ... file60 --output=..."
...
```

**Plugin config**:
```json
{
  "plugin": "@nx/playwright/plugin",
  "options": {
    "ciTargetName": "e2e-ci",
    "ciMaxTasks": 100,       // or "ciShardSize": 30
  }
}
```

**Implementation**:
- After discovering all test files, group into N shards
- Each shard command lists all files: `playwright test f1 f2 f3 --output=shard-001/`
- Each shard gets combined outputs for cache
- Parent `e2e-ci` depends on all shards

**Pros**:
- Simplest change — only plugin code changes
- No cloud/Nx core changes needed
- Reduces task count immediately (3000 → 100)
- Playwright/Jest natively support running multiple files
- Works with existing cache infrastructure

**Cons**:
- Loses per-file cache granularity (1 file changes → entire shard re-runs)
- Static grouping — not duration-aware (fast + slow files might end up in same shard)
- Users need to pick a shard count/size
- Can't leverage cloud timing data for balanced shards

### Option B: Executor-Level Batch Implementation

**Add `batchImplementation` to `@nx/playwright` and modify atomized tasks to use the executor instead of `command:`**.

1. Change atomized targets from `command: "playwright test file.spec.ts"` to `executor: "@nx/playwright:playwright"` with `options: { testFiles: ["file.spec.ts"] }`
2. Add `batchImplementation` to `@nx/playwright` executor that:
   - Receives task graph of multiple file-level tasks
   - Extracts all file paths
   - Runs single `playwright test file1 file2 file3 ...`
   - Parses results per-file
   - Returns per-task results

**Playwright batch implementation sketch**:
```typescript
export async function* batchPlaywright(
  taskGraph: TaskGraph,
  inputs: Record<string, PlaywrightExecutorSchema>,
  overrides: PlaywrightExecutorSchema,
  context: ExecutorContext
): AsyncIterableIterator<BatchTaskResult> {
  const allFiles = Object.entries(inputs).map(([taskId, opts]) => ({
    taskId,
    file: opts.testFiles?.[0],
  }));

  // Run single playwright process with all files
  const result = await runPlaywright(allFiles.map(f => f.file), overrides);

  // Yield per-task results
  for (const { taskId, file } of allFiles) {
    yield {
      task: taskId,
      result: {
        success: result.perFile[file].passed,
        terminalOutput: result.perFile[file].output,
      },
    };
  }
}
```

3. Set `preferBatch: true` in executors.json so batching is automatic
4. Enable `NX_BATCH_MODE` on cloud agents

**Interaction with Cloud**:
- Cloud Task Sets assigns N atomized tasks to agent
- Agent's `runDiscreteTasks()` detects batch-eligible tasks (all use `@nx/playwright:playwright`)
- Creates batch → forks process → runs batch implementation → single Playwright process
- Reports per-task results back

**Pros**:
- Keeps per-file cache granularity
- Cloud provides duration-balanced grouping (Task Sets)
- Dynamic — batch size adapts to agent capacity
- Single Playwright process = shared browser context, faster startup
- No user config needed

**Cons**:
- Requires changing atomized targets from `command:` to `executor:` (breaking change in plugin output)
- Need to parse Playwright's per-file results (non-trivial)
- Playwright's reporting might not cleanly separate per-file
- Need same for Jest (but Jest already has batch, would need adaptation)
- Changes span Nx core awareness + plugin + cloud

### Option C: Cloud-Side Virtual Sharding

**Cloud groups atomized tasks into "virtual shards" before assigning to agents**.

Instead of assigning 30 individual tasks, cloud creates a "shard" descriptor:
```json
{
  "type": "shard",
  "project": "app-e2e",
  "files": ["file1.spec.ts", "file2.spec.ts", ...],
  "executor": "@nx/playwright:playwright"
}
```

Agent receives shard descriptor and runs all files in one process.

**Pros**:
- Cloud has timing data for optimal grouping
- Clean abstraction — agent just runs shards
- Works across frameworks

**Cons**:
- New concept in cloud API (shard vs task)
- Agent needs to understand shard descriptors
- Breaks task-level caching, tracking, status reporting
- Most invasive change across cloud + client + Nx

### Option D: Hybrid — Task Sets + Agent-Side Merging

**Cloud assigns batches of atomized tasks (already does this). Agent merges them into single invocations.**

1. Cloud Task Sets groups 30 `e2e-ci--file*.spec.ts` tasks into one batch (already works)
2. Agent receives 30 tasks, all `nx:run-commands` with `playwright test file*.spec.ts`
3. **New**: Agent-side logic detects atomized tasks from same project+framework
4. **New**: Merges commands: extract file paths from commands, run `playwright test f1 f2 f3 ...`
5. Reports per-task results by parsing output

**Implementation**: New "atomized task merger" in the client bundle that:
- Detects tasks with `nonAtomizedTarget` metadata (already exists in parent target)
- Extracts file paths from commands
- Runs merged command
- Parses results per file

**Pros**:
- Leverages existing Cloud Task Sets (no cloud backend changes)
- Duration-balanced by cloud
- Fewer processes on agent

**Cons**:
- Fragile — parsing commands to extract file paths is brittle
- Framework-specific merging logic needed (playwright vs jest vs cypress)
- `nonAtomizedTarget` metadata is on the parent, not on atomized tasks themselves
- Results parsing is non-trivial

### Option E: Run-Commands Batch with Framework Detection

**Add a `batchImplementation` to `nx:run-commands` that detects framework-specific commands and merges them.**

When batch mode is enabled and multiple `nx:run-commands` tasks have similar commands:
- Detect pattern: `playwright test <file>` → merge files into single invocation
- Detect pattern: `jest <file>` → merge files into single invocation
- Unknown commands: run individually (fallback)

**Pros**:
- No change to atomized target structure
- Works with existing `command:` syntax

**Cons**:
- Extremely fragile — command parsing is unreliable
- What about custom flags, env vars, different configs?
- Essentially reimplements framework knowledge in run-commands
- Not a good engineering approach

---

## 6. Recommendation

### Short Term: Option A (Plugin-Level Grouping)

**Why**: Simplest, no cross-cutting changes, solves the immediate problem.

Add `ciMaxTasks` option to `@nx/playwright/plugin` and `@nx/jest/plugin`. When set, group test files into that many shards instead of creating individual tasks.

**Changes required**:
- `packages/playwright/src/plugins/plugin.ts` — group files, create shard targets
- `packages/jest/src/plugins/plugin.ts` — same
- Documentation

**Trade-off**: Loses per-file caching. But for e2e tests that rarely cache-hit individually anyway, this is acceptable. The reduction from 3000 → 100 tasks is worth it.

### Medium Term: Option B (Executor-Level Batch)

**Why**: Preserves per-file cache granularity, leverages cloud timing data, cleanest long-term architecture.

This is a larger change:
1. Change atomized targets to use `executor:` instead of `command:`
2. Add `batchImplementation` to `@nx/playwright:playwright`
3. Adapt `batchJest` for file-level (not just project-level) batching
4. Enable batch mode on cloud agents

This makes atomizer + batch execution + cloud task sets a complete pipeline:
```
Plugin atomizes files → Cloud groups by duration → Agent batches into single process
```

### What "Replaces Sharding"

The answer to customers: **Nx's approach is better than sharding because**:
1. Cloud has historical timing data for optimal grouping (sharding is static/random)
2. Per-file caching means unchanged files skip entirely (sharding re-runs everything in shard)
3. Dynamic allocation adapts to agent count/speed (sharding is fixed N-of-M)

**But today's implementation creates too many tasks when file count is high.** The fix is either:
- Static grouping at plugin level (short term, simple)
- Batch execution with cloud-informed grouping (medium term, optimal)

---

## 7. Key File Reference

### Nx Core — Batch Execution
| File | Purpose |
|------|---------|
| `packages/nx/src/tasks-runner/tasks-schedule.ts` | Batch creation logic, `processTaskForBatches()` |
| `packages/nx/src/tasks-runner/task-orchestrator.ts:369-556` | Batch execution orchestration |
| `packages/nx/src/tasks-runner/forked-process-task-runner.ts:48-99` | Fork child process for batch |
| `packages/nx/src/tasks-runner/batch/run-batch.ts` | Worker process, calls batchImplementationFactory |
| `packages/nx/src/tasks-runner/batch/batch-messages.ts` | IPC protocol (RunTasks, CompleteTask, CompleteBatchExecution) |
| `packages/nx/src/tasks-runner/running-tasks/batch-process.ts` | IPC wrapper around child process |
| `packages/nx/src/tasks-runner/init-tasks-runner.ts:165-209` | `runDiscreteTasks()` — used by cloud agents |
| `packages/nx/src/config/misc-interfaces.ts:41-48` | `ExecutorJsonEntryConfig` — batchImplementation field |
| `packages/nx/executors.json` | nx:run-commands — NO batchImplementation |
| `packages/nx/src/tasks-runner/utils.ts:431-448` | `getExecutorForTask()` — resolves executor config |

### Nx Core — Atomizer
| File | Purpose |
|------|---------|
| `packages/nx/src/project-graph/utils/project-configuration-utils.ts:1279-1286` | `command:` → `nx:run-commands` resolution |
| `packages/nx/src/config/workspace-json-project-json.ts:166` | `nonAtomizedTarget` metadata field |

### Playwright Plugin — Atomizer
| File | Purpose |
|------|---------|
| `packages/playwright/src/plugins/plugin.ts:200-340` | Atomized target creation |
| `packages/playwright/src/plugins/plugin.ts:246-311` | Per-file target generation loop |
| `packages/playwright/src/plugins/plugin.ts:580-612` | `getAtomizedTaskEnvVars()` — report output isolation |
| `packages/playwright/src/executors/playwright/playwright.impl.ts` | Executor (no batch) |
| `packages/playwright/executors.json` | NO batchImplementation |

### Jest Plugin — Atomizer + Batch
| File | Purpose |
|------|---------|
| `packages/jest/src/plugins/plugin.ts:296-397` | Atomized target creation |
| `packages/jest/src/executors/jest/jest.impl.ts:164-263` | `batchJest()` — multi-project batch (NOT file-level) |
| `packages/jest/executors.json:5` | Has batchImplementation |

### Ocean — Cloud Distribution
| File | Purpose |
|------|---------|
| `apps/nx-api/.../AssignTasksToAgent.kt` | Task assignment to agents |
| `apps/nx-api/.../AssignTasksToAgent.kt:792-860` | `pickTasksUsingBatching()` — Task Sets algorithm |
| `apps/nx-api/.../AssignTasksToAgent.kt:862-909` | `pickBatchOfTasksFromEligibleTasks()` — traditional |
| `apps/nx-api/.../AssignTasksToAgent.kt:758-773` | `TaskBucket` — duration bucketing |
| `apps/nx-api/.../AssignTasksToAgent.kt:775-790` | `BucketDurationType` — SHORT/MEDIUM/LONG |
| `libs/nx-packages/client-bundle/.../execute-tasks-v3.ts` | Agent polling + execution loop |
| `libs/nx-packages/client-bundle/.../distributed-agent.api.ts:93` | `NX_CLOUD_USE_TASK_SETS` flag |

### Environment Variables
| Variable | Default | Purpose |
|----------|---------|---------|
| `NX_BATCH_MODE` | unset | Enable Nx batch execution on agent |
| `NX_CLOUD_USE_TASK_SETS` | unset | Enable duration-based cloud batching |
| `NX_API_DEFAULT_BATCH_DURATION` | 20000ms | Max duration per cloud bucket |
| `NX_API_BATCH_TASK_COUNT_LIMIT` | 150 | Max tasks per cloud batch |
