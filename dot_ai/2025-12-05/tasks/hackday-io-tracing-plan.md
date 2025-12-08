# Hackday: I/O Tracing for Misconfigured Inputs/Outputs

**Date**: 2025-12-05
**Goal**: Detect misconfigured task inputs/outputs by tracing actual file I/O and comparing against declared configurations.

## Quick Status

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1: `--plan` flag | ✅ Complete | Published to local registry as `22.1.3-plan-test` |
| Phase 2: I/O Tracing PoC | ✅ Complete | strace-based tracer working in Docker |
| Phase 3: Nx Cloud API | ✅ Complete | TS models, Kotlin models, aggregator all done |
| Phase 4: Nx Cloud UI | ✅ Complete | Alert component with mock data working |

### Phase 3-4 Progress (2025-12-05)

**Completed:**
- ✅ Created `io-tracing.model.ts` with TypeScript types
- ✅ Updated `agent-instance-metadata.model.ts` to include `ioTracingAnalysis`
- ✅ Created `IoTracingAggregator` class following ProcessMetricsAggregator pattern
- ✅ Added Kotlin models in `Db.kt` (IoIssueSummary, IoTracingAnalysis)
- ✅ Updated `MAgentInstance` in Db.kt with `ioTracingAnalysis` field
- ✅ Updated `AgentInstanceMetadata` in Messages.kt with `ioTracingAnalysis` field
- ✅ Verified Kotlin compiles successfully
- ✅ Added `MongoIoTracingAnalysis` and related types to `model-db/ci-pipeline-executions.ts`
- ✅ Added `ioTracingAnalysis` field to `MongoAgentInstance`
- ✅ Added UI alert component in `cipe-alerts.tsx` with:
  - Warning alert when `tasksWithIssues > 0`
  - Displays top 5 issues with task ID, issue type, and file path
  - Links to documentation for configuring inputs/outputs
- ✅ Wired up mock data in container for testing
- ✅ Seeded MongoDB with test data (users, orgs, workspaces, CIPEs)
- ✅ Created admin-members.json and members.json for data seeder

**Deferred (for later/production):**
- ⏳ Replace mock data with real `runGroupDetails.ioTracingAnalysis` data
- ⏳ Update `execute-tasks-v3.ts` to integrate I/O tracing aggregator
- ✅ Screenshot of UI captured via E2E test (see `/tmp/io-tracing-alert.png`)

**Commits Made:**
1. `feat(client-bundle): add I/O tracing models and aggregator`
2. `feat(nx-api): add Kotlin models for I/O tracing`
3. `feat(nx-cloud): add UI alert for I/O tracing issues`
4. `feat(nx-cloud): wire up I/O tracing alert with mock data`

**Local Auth Notes:**
- Auth0 staging is used for local dev authentication
- Test user: `david.smith@example.com` / password from 1Password: `op://Engineering/Auth0/E2E/david_smith`
- 401 error occurs because Auth0 staging creates users with `auth0Id` that must match local MongoDB
- Data seeded to `nrwl-api` database (API default)

**How to View UI Locally (Follow-up):**

The best approach is to use the **E2E test infrastructure** which handles auth automatically:

1. **Option A: Run E2E Tests (Recommended)**
   ```bash
   # E2E tests handle auth.login() and data seeding automatically
   nx run nx-cloud-e2e-playwright:e2e --grep "CIPE"
   ```
   - See `apps/nx-cloud-e2e-playwright/README.md` for details
   - Uses `auth.login('DAVID_SMITH')` fixture which handles auth0Id mapping
   - Uses `db.createTestOrganization()` to seed test data

2. **Option B: Manual Data Seeder Setup**
   - Copy your real user document from staging/production MongoDB to:
     `apps/nx-cloud-data-seeder/src/admin-members.json`
   - The user MUST have matching `auth0Id` from Auth0 staging
   - Run: `nx run nx-cloud-data-seeder:generate-data`
   - Run: `nx run nx-cloud-data-seeder:seed`
   - Then start: `npx nps nxCloud.serve.withApi`

3. **Option C: Directly inject mock data into MongoDB**
   ```javascript
   // Connect to MongoDB and update a CIPE document:
   db.ciPipelineExecutions.updateOne(
     { _id: ObjectId("...") },
     { $set: { "runGroups.0.ioTracingAnalysis": {
       enabled: true,
       tasksAnalyzed: 12,
       tasksWithIssues: 3,
       topIssues: [
         { taskId: "myapp:build", issueType: "unexpected_read", path: "config.json" }
       ]
     }}}
   );
   ```

**Separate I/O Tracing Work:**
- See `/Users/jack/projects/io-tracing` for standalone tracer implementation
- Supports macOS (fs_usage) and Linux (strace)
- Ready to be integrated into Nx Agents

## Repositories

- **Nx CLI changes**: `~/projects/nx-worktrees/hackday_trace` (branch: `hackday_trace`)
- **PoC files**: `~/projects/nx-worktrees/hackday_trace/poc/io-tracing/`
- **Nx Cloud (Ocean)**: `~/projects/ocean` (for Phases 3-4)

## Overview

This plan covers:
1. Nx CLI `--plan` flag to output task plan JSON
2. eBPF-based file I/O tracing (Linux/Docker)
3. Nx Cloud API integration for storing I/O analysis
4. Nx Cloud UI warning display

## Prerequisites & Constraints

### eBPF/bpftrace Requirements

eBPF is **Linux-only**. For macOS development, use Docker.

**Docker Requirements**:
```bash
docker run -ti \
  -v /usr/src:/usr/src:ro \
  -v /lib/modules/:/lib/modules:ro \
  -v /sys/kernel/debug/:/sys/kernel/debug:rw \
  --net=host --pid=host --privileged \
  quay.io/iovisor/bpftrace:latest
```

**Simplified Setup** (for Docker Desktop on Mac/Windows):
```bash
docker run --rm -ti \
  -v /var/run/docker.sock:/var/run/docker.sock \
  ghcr.io/hemslo/docker-bpf:latest
```

**Kernel Requirements** (Linux 4.9+):
- CONFIG_BPF=y, CONFIG_BPF_SYSCALL=y, CONFIG_BPF_JIT=y
- CONFIG_KPROBES=y, CONFIG_KPROBE_EVENTS=y
- CONFIG_UPROBES=y, CONFIG_UPROBE_EVENTS=y

**References**:
- [docker-bpf](https://github.com/hemslo/docker-bpf)
- [Running eBPF in Docker](https://hemslo.io/run-ebpf-programs-in-docker-using-docker-bpf/)
- [bpftrace Install Guide](https://github.com/bpftrace/bpftrace/blob/master/INSTALL.md)

---

## Phase 1: Nx CLI `--plan` Flag ✅ COMPLETED

**Repository**: `~/projects/nx-worktrees/hackday_trace`
**Branch**: `hackday_trace`
**Goal**: Output task execution plan to `.nx/cache/plan.json` before running tasks.

### 1.0 Implementation Status

**Completed:**
- ✅ Added `plan: boolean` to `RunOptions` interface in `shared-options.ts:46`
- ✅ Added `--plan` option to `withRunOptions()` function in `shared-options.ts:159-164`
- ✅ Added `plan?: boolean` to `NxArgs` interface in `command-line-utils.ts:48`
- ✅ Added `generatePlan()` and `writePlanToFile()` functions in `run-command.ts:433-497`
- ✅ Added plan generation logic in `runCommandForTasks()` in `run-command.ts:584-599`

**Verified Working:**
- ✅ `nx build myapp --plan` - Generates plan, does NOT run task
- ✅ `nx run-many -t build --plan` - Works with run-many
- ✅ Plan written to `.nx/cache/plan.json`
- ✅ Plan includes task inputs, outputs, project root, and dependencies

**Final Architecture:**
- Plan generation happens in `runCommandForTasks()` AFTER task graph is created
- When `--plan` is passed, generates plan and returns early without running tasks
- Uses existing `getInputs()` and `extractPatternsFromFileSets()` from task hasher

**Cleanup TODO:**
- Remove debug `console.log` statements from `run-one.ts` and `run-command.ts`

### 1.1 Actual Generated plan.json Example

```json
{
  "tasks": [
    {
      "id": "@test-plan-workspace/myapp:build",
      "target": {
        "project": "@test-plan-workspace/myapp",
        "target": "build"
      },
      "inputs": [
        "apps/myapp/**/*",
        "!apps/myapp/.eslintrc.json",
        "!apps/myapp/eslint.config.mjs",
        "!apps/myapp/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
        "!apps/myapp/tsconfig.spec.json",
        "!apps/myapp/src/test-setup.[jt]s"
      ],
      "outputs": [
        "apps/myapp/dist"
      ],
      "projectRoot": "apps/myapp",
      "dependencies": []
    }
  ]
}
```

### 1.2 How to Test

```bash
# Create workspace with local registry
cd /tmp
npm_config_registry=http://localhost:4873 npx -y create-nx-workspace@22.1.3-plan-test test-workspace \
  --preset=react-monorepo --appName=myapp --style=css --bundler=vite \
  --e2eTestRunner=none --no-interactive --nxCloud=skip

# Test --plan flag
cd /tmp/test-workspace
npm_config_registry=http://localhost:4873 npx nx build myapp --plan

# Verify output
cat .nx/cache/plan.json
```

### 1.3 Implementation Location

Key files modified:
- `packages/nx/src/command-line/yargs-utils/shared-options.ts` - Added --plan flag option and RunOptions interface
- `packages/nx/src/utils/command-line-utils.ts` - Added plan to NxArgs interface
- `packages/nx/src/tasks-runner/run-command.ts` - Added generatePlan(), writePlanToFile(), and plan handling logic
- `packages/nx/src/command-line/run/run-one.ts` - Debug logging (to be removed)

### 1.2 Plan JSON Schema

```typescript
interface TaskPlan {
  // Metadata
  version: 1;
  generatedAt: string; // ISO timestamp
  workspaceRoot: string;

  // Task graph
  tasks: TaskPlanEntry[];

  // Execution order
  executionOrder: string[]; // Task IDs in execution order
}

interface TaskPlanEntry {
  id: string; // e.g., "mylib:build"
  target: {
    project: string;
    target: string;
    configuration?: string;
  };

  // Project info
  projectRoot: string;

  // Declared inputs/outputs (resolved)
  inputs: ResolvedInput[];
  outputs: string[]; // Glob patterns

  // Dependencies
  dependencies: string[]; // Task IDs this depends on

  // Cache info
  hash: string;
  hashDetails: {
    command: string;
    nodes: Record<string, string>;
    runtime: Record<string, string>;
  };
}

interface ResolvedInput {
  type: 'file' | 'runtime' | 'env' | 'external';
  value: string; // File path, env var name, etc.
  hash?: string;
}
```

### 1.3 Implementation Steps

1. **Add `--plan` flag** to run/run-many commands:
   ```typescript
   // In command options
   plan: {
     type: 'boolean',
     description: 'Output task plan to .nx/cache/plan.json',
     default: false,
   }
   ```

2. **Generate plan before execution** in `runCommand()`:
   ```typescript
   if (nxArgs.plan) {
     const plan = generateTaskPlan(taskGraph, projectGraph);
     const planPath = join(workspaceRoot, '.nx', 'cache', 'plan.json');
     writeJsonFile(planPath, plan);
     output.note({ title: `Task plan written to ${planPath}` });
   }
   ```

3. **Log plan location after execution**:
   ```typescript
   // After task runner completes
   if (nxArgs.plan) {
     output.note({ title: `Task plan: ${planPath}` });
   }
   ```

### 1.4 Testing

```bash
# Generate plan only (no execution)
nx build mylib --plan

# Generate plan and execute
nx run-many -t build --plan

# Verify output
cat .nx/cache/plan.json | jq '.tasks[0].inputs'
```

---

## Phase 2: I/O Tracing PoC ✅ COMPLETED

**Goal**: Standalone PoC to trace file I/O during Nx task execution.
**Status**: ✅ Completed on 2025-12-05

### 2.1 PoC Results

**Successfully tested strace-based I/O tracing in Docker:**

```
============================================================
TRACING RESULTS
============================================================

FILES READ:
  - input.txt
  - test-script.mjs

FILES WRITTEN:
  - output/output.txt

JSON OUTPUT:
{
  "reads": ["input.txt", "test-script.mjs"],
  "writes": ["output/output.txt"]
}
```

### 2.2 Key Findings

1. **bpftrace requires kernel headers** - Docker Desktop VM doesn't have them
2. **strace works as fallback** - More portable, works on Docker Desktop
3. **Both capture file I/O** - Based on `openat()` syscall with flags analysis

### 2.3 Implementation Decision

| Environment | Tool | Notes |
|-------------|------|-------|
| Linux (Nx Agents) | `bpftrace` | Lower overhead, requires CAP_BPF |
| Docker Desktop | `strace` | Fallback, slightly higher overhead |
| macOS native | Not supported | Must use Docker |

### 2.4 PoC Files Created

```
poc/io-tracing/
├── Dockerfile              # Ubuntu 22.04 + bpftrace + Node.js
├── docker-compose.yml      # Privileged container setup
├── tracer-strace.mjs       # strace-based tracer (works on Docker Desktop)
├── tracer.mjs              # bpftrace-based tracer (for Linux)
├── trace.bt                # bpftrace script
├── test-script.mjs         # Simple read/write test
├── input.txt               # Test input
└── README.md               # Instructions
```

### 2.5 Usage

```bash
cd poc/io-tracing
docker compose build
docker compose up -d
docker compose exec ebpf node tracer-strace.mjs node test-script.mjs
```

### 2.6 Reference Implementation

From [jaysoo's gist](https://gist.github.com/jaysoo/0fb0d2cf5796a41908ae0b934092a64f):

**Syscalls Traced**:
- `sys_enter_openat` / `sys_exit_openat` - File open operations
- `sys_enter_read` - File read operations
- `sys_enter_write` - File write operations

**PID Tracking**:
- Polls `pgrep -P {pid}` every 100-200ms
- BFS traversal to find all descendants of Nx process
- Only records I/O from tracked PIDs

---

### 2.3 PoC Implementation

**File**: `poc/io-tracer.mts`

```typescript
import { spawn, execSync, ChildProcess } from 'child_process';
import { resolve, relative } from 'path';

interface IoTracerConfig {
  workspaceRoot: string;
  ignoredDirs: string[];
  pollIntervalMs: number;
}

interface IoTraceResult {
  reads: string[];
  writes: string[];
  tracingSuccess: boolean;
  error?: string;
}

export class IoTracer {
  private bpfProcess: ChildProcess | null = null;
  private trackedPids = new Set<number>();
  private fileReads = new Set<string>();
  private fileWrites = new Set<string>();
  private pollInterval: NodeJS.Timeout | null = null;

  constructor(private config: IoTracerConfig) {}

  static isAvailable(): boolean {
    try {
      execSync('which bpftrace', { encoding: 'utf-8', stdio: 'pipe' });
      return true;
    } catch {
      return false;
    }
  }

  async start(rootPid: number): Promise<void> {
    this.trackedPids.add(rootPid);

    const bpfProgram = `
tracepoint:syscalls:sys_enter_openat {
    @filename[pid] = str(args->filename);
    @flags[pid] = args->flags;
}

tracepoint:syscalls:sys_exit_openat
/ @filename[pid] != "" / {
    @files[pid, args->ret] = @filename[pid];
    @file_flags[pid, args->ret] = @flags[pid];
    delete(@filename[pid]);
    delete(@flags[pid]);
}

tracepoint:syscalls:sys_enter_read
/ @files[pid, args->fd] != "" / {
    printf("R %d %s\\n", pid, @files[pid, args->fd]);
}

tracepoint:syscalls:sys_enter_write
/ @files[pid, args->fd] != "" / {
    printf("W %d %s\\n", pid, @files[pid, args->fd]);
}
`;

    return new Promise((resolve, reject) => {
      this.bpfProcess = spawn('sudo', ['-E', 'bpftrace', '-e', bpfProgram], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      this.bpfProcess.stdout?.on('data', (data: Buffer) => {
        this.processOutput(data.toString());
      });

      this.bpfProcess.stderr?.on('data', (data: Buffer) => {
        if (data.toString().includes('Attaching')) {
          this.startPidPolling();
          resolve();
        }
      });

      this.bpfProcess.on('error', reject);

      setTimeout(() => {
        if (!this.pollInterval) {
          this.cleanup();
          reject(new Error('bpftrace startup timeout'));
        }
      }, 5000);
    });
  }

  async stop(): Promise<IoTraceResult> {
    this.cleanup();

    return {
      reads: this.filterAndNormalize(this.fileReads),
      writes: this.filterAndNormalize(this.fileWrites),
      tracingSuccess: true,
    };
  }

  private processOutput(output: string): void {
    for (const line of output.split('\n')) {
      const match = line.match(/^([RW]) (\d+) (.+)$/);
      if (!match) continue;

      const [, op, pidStr, path] = match;
      const pid = parseInt(pidStr, 10);

      if (!this.trackedPids.has(pid)) continue;
      if (!path.startsWith(this.config.workspaceRoot)) continue;

      const isIgnored = this.config.ignoredDirs.some(
        dir => path.includes(`/${dir}/`)
      );
      if (isIgnored) continue;

      if (op === 'R') {
        this.fileReads.add(path);
      } else {
        this.fileWrites.add(path);
      }
    }
  }

  private startPidPolling(): void {
    this.pollInterval = setInterval(() => {
      this.updateTrackedPids();
    }, this.config.pollIntervalMs);
  }

  private updateTrackedPids(): void {
    for (const pid of this.trackedPids) {
      try {
        const children = execSync(`pgrep -P ${pid}`, { encoding: 'utf-8' })
          .trim()
          .split('\n')
          .filter(Boolean)
          .map(Number);

        children.forEach(child => this.trackedPids.add(child));
      } catch {
        // No children or process exited
      }
    }
  }

  private filterAndNormalize(paths: Set<string>): string[] {
    return Array.from(paths)
      .map(p => relative(this.config.workspaceRoot, p))
      .sort();
  }

  private cleanup(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    if (this.bpfProcess && !this.bpfProcess.killed) {
      this.bpfProcess.kill('SIGINT');
      this.bpfProcess = null;
    }
  }
}
```

### 2.4 PoC Test Script

**File**: `poc/test-tracer.mts`

```typescript
import { IoTracer } from './io-tracer.mts';
import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

async function main() {
  const workspaceRoot = process.cwd();

  // 1. Check if bpftrace available
  if (!IoTracer.isAvailable()) {
    console.error('bpftrace not available. Run in Docker with --privileged');
    process.exit(1);
  }

  // 2. Start tracer
  const tracer = new IoTracer({
    workspaceRoot,
    ignoredDirs: ['node_modules', '.nx', '.angular', '.git', 'tmp'],
    pollIntervalMs: 100,
  });

  // 3. Run nx build command
  const nxProcess = spawn('npx', ['nx', 'build', 'mylib'], {
    cwd: workspaceRoot,
    stdio: 'inherit',
  });

  await tracer.start(nxProcess.pid!);

  // 4. Wait for nx to complete
  await new Promise<void>((resolve) => {
    nxProcess.on('close', resolve);
  });

  // 5. Stop tracer and get results
  const result = await tracer.stop();

  // 6. Load plan.json and compare
  const planPath = join(workspaceRoot, '.nx', 'cache', 'plan.json');
  const plan = JSON.parse(readFileSync(planPath, 'utf-8'));

  const task = plan.tasks.find(t => t.id === 'mylib:build');
  const declaredInputs = task.inputs
    .filter(i => i.type === 'file')
    .map(i => i.value);
  const declaredOutputs = task.outputs;

  // 7. Find mismatches
  const unexpectedReads = result.reads.filter(
    r => !declaredInputs.some(input => r.startsWith(input) || matchGlob(r, input))
  );
  const unexpectedWrites = result.writes.filter(
    w => !declaredOutputs.some(output => matchGlob(w, output))
  );

  console.log('\n=== I/O Tracing Results ===');
  console.log(`\nFiles Read: ${result.reads.length}`);
  console.log(`Files Written: ${result.writes.length}`);

  if (unexpectedReads.length > 0) {
    console.log('\n⚠️  Unexpected Reads (not in declared inputs):');
    unexpectedReads.forEach(r => console.log(`  - ${r}`));
  }

  if (unexpectedWrites.length > 0) {
    console.log('\n⚠️  Unexpected Writes (not in declared outputs):');
    unexpectedWrites.forEach(w => console.log(`  - ${w}`));
  }
}

main().catch(console.error);
```

---

## Phase 3: Nx Cloud API Integration

**Repository**: `~/projects/ocean`
**Goal**: Store I/O tracing analysis alongside existing CPU/memory metrics.

### 3.1 Pattern Reference (CPU/Memory)

Follow the existing metrics pattern:

| Layer | CPU/Memory File | I/O Tracing Equivalent |
|-------|----------------|----------------------|
| **Model** | `agent-instance-metadata.model.ts` | Same file, add `ioTracingAnalysis` |
| **Aggregator** | `process-metrics-aggregator.ts` | `io-tracing-aggregator.ts` |
| **Integration** | `execute-tasks-v3.ts` | Same file, add I/O calls |
| **API Handler** | `DistributedExecutionV2Handlers.kt` | Same file, handle new field |
| **Persistence** | `DistributedExecutions.kt` | Same file, add store function |
| **DB Schema** | `Db.kt` | Same file, add data classes |

### 3.2 TypeScript Models

**File**: `libs/nx-packages/client-bundle/src/lib/core/models/distributed-agent/io-tracing.model.ts`

```typescript
/**
 * I/O tracing analysis result for a single task
 */
export interface TaskIoAnalysis {
  taskId: string;
  projectName: string;
  target: string;

  /** Files read but not declared in inputs */
  unexpectedReads: string[];

  /** Files written but not declared in outputs */
  unexpectedWrites: string[];

  /** Declared inputs that were never read */
  unusedInputs: string[];

  /** Declared outputs that were never written */
  missingOutputs: string[];
}

/**
 * Aggregated I/O analysis for an agent session
 */
export interface AggregatedIoAnalysis {
  /** Was tracing enabled and successful? */
  enabled: boolean;

  /** Total tasks analyzed */
  tasksAnalyzed: number;

  /** Tasks with at least one issue */
  tasksWithIssues: number;

  /** Top issues (limited to 10 for storage) */
  topIssues: IoIssueSummary[];
}

export interface IoIssueSummary {
  taskId: string;
  issueType: 'unexpected_read' | 'unexpected_write' | 'unused_input' | 'missing_output';
  path: string;
  severity: 'warning' | 'info';
}
```

**Update**: `libs/nx-packages/client-bundle/src/lib/core/models/distributed-agent/agent-instance-metadata.model.ts`

```typescript
export interface AgentInstanceMetadata {
  agentInstanceName: string;
  metricsArtifactId: string | null;
  systemInfo: AgentSystemInfo | null;
  aggregatedMetrics: AggregatedMetrics | null;
  isMetricsCollectionEnabled: boolean;

  // NEW: I/O tracing
  ioTracingAnalysis?: AggregatedIoAnalysis | null;
}
```

### 3.3 Aggregator Class

**File**: `libs/nx-packages/client-bundle/src/lib/core/metrics/io-tracing-aggregator.ts`

```typescript
import {
  TaskIoAnalysis,
  AggregatedIoAnalysis,
  IoIssueSummary
} from '../models/distributed-agent/io-tracing.model';

export class IoTracingAggregator {
  private taskResults: TaskIoAnalysis[] = [];
  private enabled = false;

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  addTaskResult(result: TaskIoAnalysis): void {
    this.taskResults.push(result);
  }

  getAggregatedAnalysis(): AggregatedIoAnalysis {
    const tasksWithIssues = this.taskResults.filter(
      r => r.unexpectedReads.length > 0 ||
           r.unexpectedWrites.length > 0 ||
           r.unusedInputs.length > 0 ||
           r.missingOutputs.length > 0
    );

    const allIssues: IoIssueSummary[] = [];

    for (const result of this.taskResults) {
      for (const path of result.unexpectedReads) {
        allIssues.push({
          taskId: result.taskId,
          issueType: 'unexpected_read',
          path,
          severity: 'warning',
        });
      }
      for (const path of result.unexpectedWrites) {
        allIssues.push({
          taskId: result.taskId,
          issueType: 'unexpected_write',
          path,
          severity: 'warning',
        });
      }
    }

    // Sort: warnings first, then by task
    allIssues.sort((a, b) => {
      if (a.severity !== b.severity) {
        return a.severity === 'warning' ? -1 : 1;
      }
      return a.taskId.localeCompare(b.taskId);
    });

    return {
      enabled: this.enabled,
      tasksAnalyzed: this.taskResults.length,
      tasksWithIssues: tasksWithIssues.length,
      topIssues: allIssues.slice(0, 10),
    };
  }

  reset(): void {
    this.taskResults = [];
    this.enabled = false;
  }
}
```

### 3.4 Kotlin API Models

**File**: `libs/shared/db-schema-kotlin/src/main/kotlin/Db.kt`

Add:

```kotlin
@Serializable
data class IoTracingAnalysis(
    val enabled: Boolean,
    val tasksAnalyzed: Int,
    val tasksWithIssues: Int,
    val topIssues: List<IoIssueSummary>,
)

@Serializable
data class IoIssueSummary(
    val taskId: String,
    val issueType: String, // "unexpected_read", "unexpected_write", etc.
    val path: String,
    val severity: String, // "warning", "info"
)
```

**File**: `apps/nx-api/src/main/kotlin/tasks/Messages.kt`

Update `AgentInstanceMetadata`:

```kotlin
@Serializable
data class AgentInstanceMetadata(
    val agentInstanceName: String,
    val metricsArtifactId: String?,
    val systemInfo: AgentSystemInfo? = null,
    val aggregatedMetrics: AggregatedMetrics? = null,
    val isMetricsCollectionEnabled: Boolean? = null,
    // NEW
    val ioTracingAnalysis: IoTracingAnalysis? = null,
)
```

### 3.5 Data Flow

```
CLI Agent (execute-tasks-v3.ts)
  │
  ├── IoTracer captures file reads/writes
  ├── IoAnalyzer compares vs plan.json inputs/outputs
  ├── IoTracingAggregator builds summary
  │
  ▼
POST /nx-cloud/v2/executions/tasks
{
  "agentInstanceMetadata": {
    "ioTracingAnalysis": {
      "enabled": true,
      "tasksAnalyzed": 15,
      "tasksWithIssues": 3,
      "topIssues": [...]
    }
  }
}
  │
  ▼
Kotlin API (ProcessAgentStatusUpdate.kt)
  │
  ├── Extract ioTracingAnalysis from metadata
  ├── Store in run group document
  │
  ▼
MongoDB: ciPipelineExecutions collection
{
  "runGroups": [{
    "ioTracingAnalysis": { ... }
  }]
}
```

---

## Phase 4: Nx Cloud UI Warning

**Repository**: `~/projects/ocean`
**Goal**: Display warning when I/O mismatches detected.

### 4.1 Pattern Reference (OOM Warning)

Follow existing `CiPipelineExecutionAlerts` pattern:

**Key Files**:
- `libs/nx-cloud/ui-ci-pipeline-executions/src/lib/cipe-alerts.tsx` - Alert component
- `libs/nx-cloud/feature-ci-pipeline-executions/src/lib/ci-pipeline-executions-details-container.tsx` - Container
- `libs/nx-cloud/data-access-ci-pipeline-execution/src/lib/ci-pipeline-executions-details-container-loader.server.ts` - Data loader

### 4.2 Update Data Loader

**File**: `libs/nx-cloud/data-access-ci-pipeline-execution/src/lib/ci-pipeline-executions-details-container-loader.server.ts`

Add to returned data:

```typescript
const hasIoTracingIssues =
  ciPipelineExecutionDetails.runGroup.ioTracingAnalysis?.tasksWithIssues > 0;

return {
  // ... existing fields
  hasIoTracingIssues,
  ioTracingAnalysis: ciPipelineExecutionDetails.runGroup.ioTracingAnalysis,
};
```

### 4.3 Update Alert Component

**File**: `libs/nx-cloud/ui-ci-pipeline-executions/src/lib/cipe-alerts.tsx`

Add new alert type:

```tsx
interface CiPipelineExecutionAlertsProps {
  // ... existing props
  ioTracingAnalysis?: IoTracingAnalysis | null;
}

export function CiPipelineExecutionAlerts({
  // ... existing props
  ioTracingAnalysis,
}: CiPipelineExecutionAlertsProps) {
  return (
    <>
      {/* Existing alerts... */}

      {/* NEW: I/O Tracing Warning */}
      {ioTracingAnalysis && ioTracingAnalysis.tasksWithIssues > 0 && (
        <Alert
          className="my-4"
          title="Potential input/output misconfiguration detected"
          type="warning"
          data-testid="cipe-io-tracing-warning"
        >
          <p className="mb-2">
            {ioTracingAnalysis.tasksWithIssues} of {ioTracingAnalysis.tasksAnalyzed} tasks
            accessed files not declared in their inputs/outputs configuration.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            {ioTracingAnalysis.topIssues.slice(0, 5).map((issue, i) => (
              <li key={i} className="text-sm">
                <code>{issue.taskId}</code>: {formatIssueType(issue.issueType)}
                <code className="ml-1">{issue.path}</code>
              </li>
            ))}
          </ul>
          {ioTracingAnalysis.topIssues.length > 5 && (
            <p className="mt-2 text-sm text-gray-500">
              And {ioTracingAnalysis.topIssues.length - 5} more issues...
            </p>
          )}
        </Alert>
      )}
    </>
  );
}

function formatIssueType(type: string): string {
  switch (type) {
    case 'unexpected_read': return 'read file not in inputs:';
    case 'unexpected_write': return 'wrote file not in outputs:';
    case 'unused_input': return 'declared input never read:';
    case 'missing_output': return 'declared output never written:';
    default: return type;
  }
}
```

### 4.4 Update Container

**File**: `libs/nx-cloud/feature-ci-pipeline-executions/src/lib/ci-pipeline-executions-details-container.tsx`

Pass new props:

```tsx
<CiPipelineExecutionAlerts
  // ... existing props
  ioTracingAnalysis={runGroupDetails.ioTracingAnalysis}
/>
```

---

## Implementation Order

### Recommended Order (as user requested):

1. **Phase 1**: Nx CLI `--plan` flag (standalone, no dependencies)
2. **Phase 2**: eBPF PoC in Docker (understand tracing before integration)
3. **Phase 3**: Nx Cloud API (after PoC works)
4. **Phase 4**: Nx Cloud UI (after API is done)

### Alternative: Parallel Streams

If multiple people working:
- **Stream A**: Phase 1 + Phase 2 (CLI/PoC)
- **Stream B**: Phase 3 + Phase 4 (Cloud integration) - can stub data initially

---

## Open Questions / Clarifications Needed

1. **Nx Agents Environment**: Does the Nx Agents container have:
   - `bpftrace` installed?
   - `sudo` access or CAP_BPF capability?
   - Kernel headers available?

2. **Scope**:
   - Start with Nx Agents only, or also local DTE agents?
   - Should `--plan` flag also work without DTE (local runs)?

3. **plan.json Consumption**:
   - Does the CLI read plan.json, or does the PoC script read it?
   - Should plan.json be uploaded as an artifact to Nx Cloud?

4. **Performance**:
   - What's acceptable overhead for eBPF tracing?
   - Should tracing be opt-in via env var (e.g., `NX_IO_TRACING=true`)?

5. **False Positives**:
   - How to handle temp files, intermediate build artifacts?
   - Should certain patterns be auto-ignored?

6. **Retention**:
   - How long to keep I/O tracing data?
   - Store per-task details as artifact or only aggregates?

---

## Files to Create/Modify

### Nx CLI (`~/projects/nx-worktrees/hackday_trace`) ✅ DONE
- [x] `packages/nx/src/command-line/yargs-utils/shared-options.ts` - Added --plan flag
- [x] `packages/nx/src/utils/command-line-utils.ts` - Added plan to NxArgs
- [x] `packages/nx/src/tasks-runner/run-command.ts` - Generate plan.json
- [x] `packages/nx/src/command-line/run/run-one.ts` - Debug logging (remove before merge)

### PoC (`~/projects/nx-worktrees/hackday_trace/poc/io-tracing/`) ✅ DONE
- [x] `Dockerfile` - Ubuntu 22.04 + bpftrace + strace + Node.js
- [x] `docker-compose.yml` - Privileged container setup
- [x] `tracer-strace.mjs` - strace-based tracer (recommended)
- [x] `tracer.mjs` - bpftrace-based tracer (Linux native only)
- [x] `trace.bt` - bpftrace script
- [x] `test-script.mjs` - Simple read/write test
- [x] `input.txt` - Test input
- [x] `README.md` - Updated instructions

### Nx Cloud API (`~/projects/ocean`) 🔄 Phase 3 In Progress
- [x] `libs/nx-packages/client-bundle/src/lib/core/models/distributed-agent/io-tracing.model.ts` - NEW ✅
- [x] `libs/nx-packages/client-bundle/src/lib/core/models/distributed-agent/agent-instance-metadata.model.ts` - Update ✅
- [x] `libs/nx-packages/client-bundle/src/lib/core/metrics/io-tracing-aggregator.ts` - NEW ✅
- [ ] `libs/nx-packages/client-bundle/src/lib/core/runners/distributed-agent/v3/execute-tasks-v3.ts` - Update (pending)
- [x] `libs/shared/db-schema-kotlin/src/main/kotlin/Db.kt` - Add Kotlin models ✅
- [x] `apps/nx-api/src/main/kotlin/tasks/Messages.kt` - Update AgentInstanceMetadata ✅

### Nx Cloud UI (`~/projects/ocean`) 🔄 Phase 4 In Progress
- [x] `libs/nx-cloud/model-db/src/lib/ci-pipeline-executions.ts` - Add UI types ✅
- [x] `libs/nx-cloud/ui-ci-pipeline-executions/src/lib/cipe-alerts.tsx` - Add I/O warning ✅
- [x] `libs/nx-cloud/feature-ci-pipeline-executions/src/lib/ci-pipeline-executions-details-container.tsx` - Pass props (with mock data) ✅
- [ ] `libs/nx-cloud/data-access-ci-pipeline-execution/src/lib/ci-pipeline-executions-details-container-loader.server.ts` - Load real data (optional)

---

## Next Steps (as of 2025-12-05)

### Immediate (UI Alert - Phase 4)
1. **Add UI alert component** in `cipe-alerts.tsx`:
   - Add `ioTracingAnalysis` prop to `CiPipelineExecutionAlerts`
   - Add Alert component with warning when `tasksWithIssues > 0`
   - Follow existing pattern from `restartedInstances` alert

2. **Wire up in container** (`ci-pipeline-executions-details-container.tsx`):
   - Pass `ioTracingAnalysis` to `CiPipelineExecutionAlerts`

3. **Wire up in loader** (`ci-pipeline-executions-details-container-loader.server.ts`):
   - Extract `ioTracingAnalysis` from run group data
   - Add to returned data

### Later (Integration - Phase 3 completion)
4. **Update execute-tasks-v3.ts** to integrate I/O tracing aggregator:
   - Import and instantiate `IoTracingAggregator`
   - Call `addTaskResult()` for each task
   - Include in `AgentInstanceMetadata` sent to API

### Testing
5. **Test end-to-end with mock data**:
   - Manually add mock `ioTracingAnalysis` to a CIPE document in MongoDB
   - Verify UI alert displays correctly
