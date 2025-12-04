# eBPF I/O Tracing for Misconfigured Inputs/Outputs

## Goal
Add eBPF-based file I/O tracing to detect potentially misconfigured task inputs/outputs. When a task reads or writes files that aren't declared in its configuration, surface this as analysis data in Nx Cloud's CIPE UI.

## Prior Art: CPU/Memory Metrics Collection
Reference implementation for metrics collection pattern:
- `libs/nx-packages/client-bundle/src/lib/core/models/distributed-agent/agent-instance-metadata.model.ts` - Metrics model
- `libs/nx-packages/client-bundle/src/lib/core/runners/distributed-agent/v3/execute-tasks-v3.ts` - Where metrics are collected during task execution
- `apps/nx-api/src/main/kotlin/persistence/CIPipelineExecutions.kt` - API persistence
- `libs/nx-cloud/feature-ci-pipeline-executions/src/lib/analysis/resource-usage/` - UI components

## eBPF POC Reference
POC implementation: https://gist.github.com/jaysoo/0fb0d2cf5796a41908ae0b934092a64f

Key patterns from POC:
- Uses `bpftrace` spawned via `sudo -E`
- Traces `sys_enter_openat`, `sys_exit_openat`, `sys_enter_read` syscalls
- Maintains PID tree to track Nx process and all child processes
- Filters by workspace root and ignores `node_modules`, `.nx`, `.angular`
- Polls for child processes every 100-200ms using `pgrep -P`

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Nx CLI (Agent)                                  │
│  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────────┐ │
│  │ eBPF Tracer     │───▶│ I/O Event        │───▶│ Compare vs Declared     │ │
│  │ (file reads/    │    │ Collector        │    │ inputs/outputs          │ │
│  │  writes)        │    │                  │    │                         │ │
│  └─────────────────┘    └──────────────────┘    └───────────┬─────────────┘ │
│                                                              │               │
│                                              ┌───────────────▼─────────────┐ │
│                                              │ IoTracingAnalysis           │ │
│                                              │ - unexpectedReads[]         │ │
│                                              │ - unexpectedWrites[]        │ │
│                                              │ - missingInputs[]           │ │
│                                              └───────────────┬─────────────┘ │
└──────────────────────────────────────────────────────────────┼───────────────┘
                                                               │
                                                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Nx API (Kotlin)                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ Store IoTracingAnalysis per task in MTask / or per run group            │ │
│  │ Aggregate across CIPE for summary view                                  │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┼───────────────┘
                                                               │
                                                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Nx Cloud UI                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ CIPE Analysis Page: Warning/Info Alert                                  │ │
│  │ "X tasks may have misconfigured inputs/outputs"                         │ │
│  │  - Task A: reads `dist/lib-b` but doesn't declare dependency on lib-b   │ │
│  │  - Task B: writes to `tmp/` but doesn't declare it as output            │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: CLI - eBPF Tracer Integration (POC exists)

See POC: https://gist.github.com/jaysoo/0fb0d2cf5796a41908ae0b934092a64f

---

## Phase 2: CLI Integration (Detailed)

### 2.1 New Model Files

**File**: `libs/nx-packages/client-bundle/src/lib/core/models/distributed-agent/io-tracing.model.ts`

```typescript
/**
 * Configuration for I/O tracing during task execution
 */
export interface IoTracingConfig {
  enabled: boolean;
  workspaceRoot: string;
  ignoredDirs: string[];  // e.g., ['node_modules', '.nx', '.angular', '.git']
}

/**
 * Raw file I/O event captured by eBPF tracer
 */
export interface FileIoEvent {
  pid: number;
  operation: 'read' | 'write';
  path: string;
  timestamp: number;
}

/**
 * Analysis result for a single task's I/O behavior
 */
export interface TaskIoTracingResult {
  taskId: string;
  projectName: string;
  target: string;

  /** Files read that weren't in declared inputs */
  unexpectedReads: IoIssue[];

  /** Files written that weren't in declared outputs */
  unexpectedWrites: IoIssue[];

  /** Declared inputs that were never actually read */
  missingDeclaredInputs: string[];

  /** Declared outputs that were never actually written */
  missingDeclaredOutputs: string[];

  /** Whether tracing was successfully enabled for this task */
  tracingEnabled: boolean;

  /** Error message if tracing failed */
  tracingError?: string;
}

/**
 * Individual I/O issue detected
 */
export interface IoIssue {
  /** Absolute path to the file */
  path: string;

  /** Path relative to workspace root */
  relativePath: string;

  /** Suggested glob pattern to add to inputs/outputs */
  suggestedGlob?: string;

  /** Project that owns this file path (if determinable) */
  relatedProject?: string;

  /** Issue severity */
  severity: 'warning' | 'info';

  /** Human-readable description */
  message: string;
}

/**
 * Aggregated I/O analysis for the entire agent session
 * Sent to API as part of AgentInstanceMetadata
 */
export interface AggregatedIoTracingAnalysis {
  /** Whether I/O tracing was enabled */
  enabled: boolean;

  /** Total tasks analyzed */
  tasksAnalyzed: number;

  /** Tasks with at least one I/O issue */
  tasksWithIssues: number;

  /** Top N most significant issues (for alert display) */
  topIssues: IoIssueSummary[];

  /** Artifact ID for detailed per-task data (if stored separately) */
  detailsArtifactId?: string;
}

/**
 * Summary of an I/O issue for aggregated view
 */
export interface IoIssueSummary {
  taskId: string;
  issueType: 'unexpected_read' | 'unexpected_write' | 'missing_input' | 'missing_output';
  path: string;
  relatedProject?: string;
  severity: 'warning' | 'info';
}
```

### 2.2 I/O Tracer Class

**File**: `libs/nx-packages/client-bundle/src/lib/core/metrics/io-tracer.ts`

```typescript
import { spawn, execSync, ChildProcess } from 'child_process';
import { FileIoEvent, IoTracingConfig } from '../models/distributed-agent/io-tracing.model';

/**
 * Manages eBPF-based file I/O tracing for task execution.
 *
 * Pattern follows ProcessMetricsAggregator but for file I/O instead of CPU/memory.
 *
 * Usage:
 *   const tracer = new IoTracer(config);
 *   await tracer.start();
 *   // ... execute task ...
 *   const events = await tracer.stop();
 */
export class IoTracer {
  private bpfProcess: ChildProcess | null = null;
  private trackedPids = new Set<number>();
  private fileReads = new Set<string>();
  private fileWrites = new Set<string>();
  private isRunning = false;
  private pidPollingInterval: NodeJS.Timeout | null = null;

  constructor(private config: IoTracingConfig) {}

  /**
   * Check if eBPF tracing is available on this system.
   * Returns false if bpftrace not installed or insufficient permissions.
   */
  static isAvailable(): boolean {
    try {
      execSync('which bpftrace', { encoding: 'utf-8', stdio: 'pipe' });
      // TODO: Also check for CAP_BPF capability or root access
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Start the eBPF tracer. Must be called before task execution begins.
   */
  async start(): Promise<void> {
    if (!this.config.enabled || !IoTracer.isAvailable()) {
      return;
    }

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
    printf("read pid=%d file=%s\\n", pid, @files[pid, args->fd]);
}

tracepoint:syscalls:sys_enter_write
/ @files[pid, args->fd] != "" / {
    printf("write pid=%d file=%s\\n", pid, @files[pid, args->fd]);
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
        const stderr = data.toString();
        // bpftrace prints "Attaching X probes..." to stderr on startup
        if (stderr.includes('Attaching')) {
          this.isRunning = true;
          resolve();
        }
      });

      this.bpfProcess.on('error', (err) => {
        reject(err);
      });

      // Timeout if bpftrace doesn't start within 5 seconds
      setTimeout(() => {
        if (!this.isRunning) {
          this.cleanup();
          reject(new Error('bpftrace startup timeout'));
        }
      }, 5000);
    });
  }

  /**
   * Register a root PID to track. All descendants will also be tracked.
   */
  trackPid(rootPid: number): void {
    this.trackedPids.add(rootPid);

    // Start polling for child processes
    if (!this.pidPollingInterval) {
      this.pidPollingInterval = setInterval(() => {
        this.updateTrackedPids();
      }, 100);
    }
  }

  /**
   * Stop the tracer and return collected events.
   */
  async stop(): Promise<{ reads: string[]; writes: string[] }> {
    this.cleanup();

    return {
      reads: Array.from(this.fileReads).sort(),
      writes: Array.from(this.fileWrites).sort(),
    };
  }

  private processOutput(output: string): void {
    const lines = output.split('\n');

    for (const line of lines) {
      const match = line.match(/(read|write) pid=(\d+) file=(.+?)(?:\s|$)/);
      if (!match) continue;

      const [, operation, pidStr, filePath] = match;
      const pid = parseInt(pidStr, 10);

      // Only track I/O from tracked PIDs
      if (!this.trackedPids.has(pid)) continue;

      // Filter by workspace root
      if (!filePath.startsWith(this.config.workspaceRoot)) continue;

      // Filter out ignored directories
      const isIgnored = this.config.ignoredDirs.some(
        (dir) => filePath.includes(`/${dir}/`) || filePath.endsWith(`/${dir}`)
      );
      if (isIgnored) continue;

      // Record the event
      if (operation === 'read') {
        this.fileReads.add(filePath);
      } else {
        this.fileWrites.add(filePath);
      }
    }
  }

  private updateTrackedPids(): void {
    const newPids = new Set<number>();

    for (const rootPid of this.trackedPids) {
      try {
        const children = execSync(`pgrep -P ${rootPid}`, { encoding: 'utf-8' })
          .trim()
          .split('\n')
          .filter((p) => p)
          .map((p) => parseInt(p, 10));

        for (const childPid of children) {
          if (!this.trackedPids.has(childPid)) {
            newPids.add(childPid);
          }
        }
      } catch {
        // Process has no children or has exited
      }
    }

    // Add new PIDs to tracked set
    for (const pid of newPids) {
      this.trackedPids.add(pid);
    }
  }

  private cleanup(): void {
    if (this.pidPollingInterval) {
      clearInterval(this.pidPollingInterval);
      this.pidPollingInterval = null;
    }

    if (this.bpfProcess && !this.bpfProcess.killed) {
      this.bpfProcess.kill('SIGINT');
      this.bpfProcess = null;
    }

    this.isRunning = false;
  }
}
```

### 2.3 I/O Analyzer Class

**File**: `libs/nx-packages/client-bundle/src/lib/core/metrics/io-analyzer.ts`

```typescript
import { Task } from '../models/run-context.model';
import { IoIssue, TaskIoTracingResult } from '../models/distributed-agent/io-tracing.model';

interface ProjectGraphNode {
  name: string;
  root: string;
}

/**
 * Analyzes traced I/O against declared task inputs/outputs.
 *
 * Compares actual file reads/writes captured by IoTracer against
 * the inputs/outputs declared in the task's configuration.
 */
export class IoAnalyzer {
  constructor(
    private workspaceRoot: string,
    private projectNodes: Map<string, ProjectGraphNode>
  ) {}

  /**
   * Analyze traced I/O for a task and produce analysis results.
   */
  analyze(
    task: Task,
    tracedReads: string[],
    tracedWrites: string[]
  ): TaskIoTracingResult {
    const declaredInputs = this.normalizePaths(task.inputs || []);
    const declaredOutputs = this.normalizePaths(task.outputs || []);

    const unexpectedReads = this.findUnexpectedIo(
      tracedReads,
      declaredInputs,
      'read'
    );

    const unexpectedWrites = this.findUnexpectedIo(
      tracedWrites,
      declaredOutputs,
      'write'
    );

    const missingDeclaredInputs = this.findMissingDeclared(
      declaredInputs,
      tracedReads
    );

    const missingDeclaredOutputs = this.findMissingDeclared(
      declaredOutputs,
      tracedWrites
    );

    return {
      taskId: task.id,
      projectName: task.target.project,
      target: task.target.target,
      unexpectedReads,
      unexpectedWrites,
      missingDeclaredInputs,
      missingDeclaredOutputs,
      tracingEnabled: true,
    };
  }

  private findUnexpectedIo(
    traced: string[],
    declared: string[],
    operation: 'read' | 'write'
  ): IoIssue[] {
    const issues: IoIssue[] = [];

    for (const path of traced) {
      const relativePath = path.replace(this.workspaceRoot, '').replace(/^\//, '');

      // Check if path matches any declared pattern
      const isExpected = declared.some((pattern) =>
        this.pathMatchesPattern(relativePath, pattern)
      );

      if (!isExpected) {
        const relatedProject = this.findProjectForPath(relativePath);
        const suggestedGlob = this.suggestGlob(relativePath);

        issues.push({
          path,
          relativePath,
          suggestedGlob,
          relatedProject,
          severity: relatedProject ? 'warning' : 'info',
          message: operation === 'read'
            ? `File read but not declared in inputs: ${relativePath}`
            : `File written but not declared in outputs: ${relativePath}`,
        });
      }
    }

    return issues;
  }

  private findMissingDeclared(declared: string[], traced: string[]): string[] {
    const tracedRelative = traced.map((p) =>
      p.replace(this.workspaceRoot, '').replace(/^\//, '')
    );

    return declared.filter((pattern) => {
      // Check if any traced path matches this declared pattern
      return !tracedRelative.some((path) =>
        this.pathMatchesPattern(path, pattern)
      );
    });
  }

  private pathMatchesPattern(path: string, pattern: string): boolean {
    // Simple glob matching - can be enhanced with minimatch/micromatch
    if (pattern.includes('**')) {
      const prefix = pattern.split('**')[0];
      return path.startsWith(prefix);
    }
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return regex.test(path);
    }
    return path === pattern || path.startsWith(pattern + '/');
  }

  private findProjectForPath(relativePath: string): string | undefined {
    for (const [name, node] of this.projectNodes) {
      if (relativePath.startsWith(node.root + '/')) {
        return name;
      }
    }
    return undefined;
  }

  private suggestGlob(relativePath: string): string {
    // Extract the directory and suggest a glob pattern
    const parts = relativePath.split('/');
    if (parts.length >= 2) {
      // Suggest pattern like "libs/my-lib/**/*" or "apps/my-app/src/**/*"
      return parts.slice(0, 2).join('/') + '/**/*';
    }
    return relativePath;
  }

  private normalizePaths(patterns: string[]): string[] {
    return patterns.map((p) => p.replace(/^{workspaceRoot}\//, ''));
  }
}
```

### 2.4 I/O Tracing Aggregator

**File**: `libs/nx-packages/client-bundle/src/lib/core/metrics/io-tracing-aggregator.ts`

```typescript
import {
  AggregatedIoTracingAnalysis,
  IoIssueSummary,
  TaskIoTracingResult,
} from '../models/distributed-agent/io-tracing.model';

/**
 * Aggregates I/O tracing results across multiple tasks.
 *
 * Pattern follows ProcessMetricsAggregator but for I/O analysis.
 * Used to build summary data sent to API.
 */
export class IoTracingAggregator {
  private taskResults: TaskIoTracingResult[] = [];
  private enabled = false;

  /**
   * Add a task's I/O tracing result to the aggregation.
   */
  addTaskResult(result: TaskIoTracingResult): void {
    this.taskResults.push(result);
    if (result.tracingEnabled) {
      this.enabled = true;
    }
  }

  /**
   * Get aggregated analysis summary for API submission.
   */
  getAggregatedAnalysis(): AggregatedIoTracingAnalysis {
    const tasksWithIssues = this.taskResults.filter(
      (r) =>
        r.unexpectedReads.length > 0 ||
        r.unexpectedWrites.length > 0 ||
        r.missingDeclaredInputs.length > 0 ||
        r.missingDeclaredOutputs.length > 0
    );

    // Collect top issues (warnings first, then by count)
    const allIssues: IoIssueSummary[] = [];

    for (const result of this.taskResults) {
      for (const issue of result.unexpectedReads) {
        allIssues.push({
          taskId: result.taskId,
          issueType: 'unexpected_read',
          path: issue.relativePath,
          relatedProject: issue.relatedProject,
          severity: issue.severity,
        });
      }
      for (const issue of result.unexpectedWrites) {
        allIssues.push({
          taskId: result.taskId,
          issueType: 'unexpected_write',
          path: issue.relativePath,
          relatedProject: issue.relatedProject,
          severity: issue.severity,
        });
      }
    }

    // Sort: warnings first, then by task
    allIssues.sort((a, b) => {
      if (a.severity === 'warning' && b.severity !== 'warning') return -1;
      if (a.severity !== 'warning' && b.severity === 'warning') return 1;
      return a.taskId.localeCompare(b.taskId);
    });

    return {
      enabled: this.enabled,
      tasksAnalyzed: this.taskResults.length,
      tasksWithIssues: tasksWithIssues.length,
      topIssues: allIssues.slice(0, 10), // Top 10 issues for alert display
    };
  }

  /**
   * Get all detailed results (for artifact storage).
   */
  getAllResults(): TaskIoTracingResult[] {
    return this.taskResults;
  }

  /**
   * Reset the aggregator for a new session.
   */
  reset(): void {
    this.taskResults = [];
    this.enabled = false;
  }
}
```

### 2.5 Integration in execute-tasks-v3.ts

**File**: `libs/nx-packages/client-bundle/src/lib/core/runners/distributed-agent/v3/execute-tasks-v3.ts`

Key integration points (following ProcessMetricsAggregator pattern):

```typescript
// Add imports
import { IoTracer } from '../../../metrics/io-tracer';
import { IoAnalyzer } from '../../../metrics/io-analyzer';
import { IoTracingAggregator } from '../../../metrics/io-tracing-aggregator';

// Add environment variable check
const NX_CLOUD_IO_TRACING = process.env.NX_CLOUD_IO_TRACING === 'true';

// In executeTasksV3 function signature, add parameter:
export async function executeTasksV3(
  api: DistributedAgentApi,
  targets?: string[],
  agentInstanceMetadata?: AgentInstanceMetadata,
  processMetricsAggregator?: ProcessMetricsAggregator,
  ioTracingAggregator?: IoTracingAggregator,  // NEW
): Promise<void> {
  // ...
}

// Create IoAnalyzer early in the function:
const ioAnalyzer = NX_CLOUD_IO_TRACING
  ? new IoAnalyzer(
      process.cwd(),
      new Map(Object.entries(projectGraph.nodes).map(([k, v]) => [k, { name: k, root: v.data.root }]))
    )
  : undefined;

// Before task execution (in batch execution loop):
let ioTracer: IoTracer | undefined;
if (NX_CLOUD_IO_TRACING && IoTracer.isAvailable()) {
  ioTracer = new IoTracer({
    enabled: true,
    workspaceRoot: process.cwd(),
    ignoredDirs: ['node_modules', '.nx', '.angular', '.git', 'tmp'],
  });
  await ioTracer.start();
  ioTracer.trackPid(process.pid);
}

// After task execution completes:
if (ioTracer && ioAnalyzer) {
  const { reads, writes } = await ioTracer.stop();

  for (const task of completedTasks) {
    const result = ioAnalyzer.analyze(task, reads, writes);
    ioTracingAggregator?.addTaskResult(result);
  }
}

// In updateMetadataWithAggregatedMetrics (or create new function):
function updateMetadataWithIoTracing(
  agentInstanceMetadata: AgentInstanceMetadata | undefined,
  ioTracingAggregator: IoTracingAggregator | undefined,
): AgentInstanceMetadata | undefined {
  if (!ioTracingAggregator || !agentInstanceMetadata) {
    return agentInstanceMetadata;
  }

  const ioAnalysis = ioTracingAggregator.getAggregatedAnalysis();
  return {
    ...agentInstanceMetadata,
    ioTracingAnalysis: ioAnalysis,
  };
}
```

### 2.6 Update AgentInstanceMetadata Model

**File**: `libs/nx-packages/client-bundle/src/lib/core/models/distributed-agent/agent-instance-metadata.model.ts`

```typescript
import { AggregatedIoTracingAnalysis } from './io-tracing.model';

export interface AgentInstanceMetadata {
  agentInstanceName: string;
  metricsArtifactId: string | null;
  systemInfo: AgentSystemInfo | null;
  aggregatedMetrics: AggregatedMetrics | null;
  isMetricsCollectionEnabled: boolean;

  // NEW: I/O tracing analysis
  ioTracingAnalysis?: AggregatedIoTracingAnalysis | null;
}
```

---

## Phase 3: Data Model & Storage (Detailed)

### 3.1 TypeScript Model (Nx Cloud)

**File**: `libs/nx-cloud/model-db/src/lib/ci-pipeline-executions.ts`

Add to existing interfaces:

```typescript
/**
 * I/O tracing analysis summary stored at run group level.
 * Detailed per-task data can be stored separately as an artifact.
 */
export interface MongoIoTracingAnalysis {
  /** Whether I/O tracing was enabled for this run group */
  enabled: boolean;

  /** Total tasks that were analyzed */
  tasksAnalyzed: number;

  /** Number of tasks with at least one I/O issue */
  tasksWithIssues: number;

  /** Top issues for alert display (limited to keep document size small) */
  topIssues: MongoIoIssueSummary[];

  /** Artifact ID containing detailed per-task analysis (optional) */
  detailsArtifactId?: string | null;

  /** Timestamp when analysis was last updated */
  updatedAt: Date;
}

export interface MongoIoIssueSummary {
  taskId: string;
  issueType: 'unexpected_read' | 'unexpected_write' | 'missing_input' | 'missing_output';
  path: string;
  relatedProject?: string | null;
  severity: 'warning' | 'info';
}

// Update MongoCiPipelineExecutionRunGroup interface:
export interface MongoCiPipelineExecutionRunGroup {
  // ... existing fields ...

  /** I/O tracing analysis for this run group */
  ioTracingAnalysis?: MongoIoTracingAnalysis | null;
}
```

### 3.2 Kotlin Model

**File**: `libs/shared/db-schema-kotlin/src/main/kotlin/Db.kt`

Add data classes:

```kotlin
@Serializable
data class IoTracingAnalysis(
    val enabled: Boolean,
    val tasksAnalyzed: Int,
    val tasksWithIssues: Int,
    val topIssues: List<IoIssueSummary>,
    val detailsArtifactId: String? = null,
    @Serializable(with = DateSerializer::class)
    val updatedAt: Date? = null,
)

@Serializable
data class IoIssueSummary(
    val taskId: String,
    val issueType: String,  // "unexpected_read", "unexpected_write", "missing_input", "missing_output"
    val path: String,
    val relatedProject: String? = null,
    val severity: String,  // "warning", "info"
)

// Update MCiPipelineExecutionRunGroup:
data class MCiPipelineExecutionRunGroup(
    // ... existing fields ...

    val ioTracingAnalysis: IoTracingAnalysis? = null,
)
```

**File**: `apps/nx-api/src/main/kotlin/tasks/Messages.kt`

Update AgentInstanceMetadata:

```kotlin
@Serializable
data class AgentInstanceMetadata(
    val agentInstanceName: String,
    val metricsArtifactId: String?,
    val systemInfo: AgentSystemInfo? = null,
    val aggregatedMetrics: AggregatedMetrics? = null,
    val isMetricsCollectionEnabled: Boolean? = null,

    // NEW: I/O tracing analysis
    val ioTracingAnalysis: IoTracingAnalysis? = null,
)
```

### 3.3 Storage Strategy

**Recommended: Hybrid Approach**

1. **Summary in run group document** (`MCiPipelineExecutionRunGroup.ioTracingAnalysis`)
   - Store `enabled`, `tasksAnalyzed`, `tasksWithIssues`, `topIssues` (top 10)
   - Quick access for alerts without additional queries
   - Small footprint (~1-2KB)

2. **Detailed data as artifact** (optional, for drill-down)
   - Store full `TaskIoTracingResult[]` as JSON artifact
   - Reference via `detailsArtifactId`
   - Only fetch when user clicks "View Details"
   - Uses existing artifact storage infrastructure (same as metrics)

**Document Size Considerations**:
- MongoDB document limit: 16MB
- Run group already contains agent metadata, workflows, etc.
- Keep `topIssues` limited (10 items max)
- Don't store raw file paths in run group - aggregate counts only

---

## Phase 4: API Endpoints (Detailed)

### 4.1 Update Agent Status Update Handler

**File**: `apps/nx-api/src/main/kotlin/handlers/DistributedExecutionV2Handlers.kt`

The `AgentStatusUpdateRequest` already includes `agentInstanceMetadata`. The ioTracingAnalysis will flow through automatically once the Kotlin model is updated.

No new endpoint needed - data flows through existing `/nx-cloud/v2/executions/tasks` endpoint.

### 4.2 Update ProcessAgentStatusUpdate Operation

**File**: `apps/nx-api/src/main/kotlin/services/dteV2/operations/ProcessAgentStatusUpdate.kt`

Add logic to persist I/O tracing analysis:

```kotlin
// In the execute function, after handling agent instance metadata:

// Persist I/O tracing analysis if present
agentInstanceMetadata?.ioTracingAnalysis?.let { ioAnalysis ->
    if (ioAnalysis.enabled && ioAnalysis.tasksWithIssues > 0) {
        updateRunGroupIoTracingAnalysis(
            workspaceId = workspaceId,
            runGroup = runGroup,
            analysis = ioAnalysis,
        )
    }
}
```

### 4.3 Add Persistence Function

**File**: `apps/nx-api/src/main/kotlin/persistence/CIPipelineExecutions.kt`

```kotlin
/**
 * Updates or creates the I/O tracing analysis for a run group.
 * Merges with existing analysis if present (accumulates issues from multiple agents).
 */
suspend fun updateRunGroupIoTracingAnalysis(
    workspaceId: ObjectId,
    runGroup: String,
    analysis: IoTracingAnalysis,
) {
    val (cipe, rg) = findRunGroup(workspaceId, runGroup) ?: return

    val existingAnalysis = rg.ioTracingAnalysis

    val mergedAnalysis = if (existingAnalysis != null) {
        // Merge with existing analysis
        IoTracingAnalysis(
            enabled = existingAnalysis.enabled || analysis.enabled,
            tasksAnalyzed = existingAnalysis.tasksAnalyzed + analysis.tasksAnalyzed,
            tasksWithIssues = existingAnalysis.tasksWithIssues + analysis.tasksWithIssues,
            topIssues = mergeTopIssues(existingAnalysis.topIssues, analysis.topIssues),
            detailsArtifactId = analysis.detailsArtifactId ?: existingAnalysis.detailsArtifactId,
            updatedAt = Date(),
        )
    } else {
        analysis.copy(updatedAt = Date())
    }

    rg.ioTracingAnalysis = mergedAnalysis
    saveCiPipelineExecution(cipe)
}

/**
 * Merge two lists of top issues, keeping highest severity and limiting to 10.
 */
private fun mergeTopIssues(
    existing: List<IoIssueSummary>,
    new: List<IoIssueSummary>,
): List<IoIssueSummary> {
    return (existing + new)
        .distinctBy { "${it.taskId}:${it.issueType}:${it.path}" }
        .sortedWith(compareBy(
            { if (it.severity == "warning") 0 else 1 },
            { it.taskId }
        ))
        .take(10)
}
```

### 4.4 Optional: Detailed Analysis Artifact Endpoint

If storing detailed per-task analysis as an artifact:

**File**: `apps/nx-api/src/main/kotlin/handlers/DistributedExecutionV2Handlers.kt`

```kotlin
// New endpoint for storing detailed I/O analysis
post("/nx-cloud/v2/io-tracing/details") {
    val workspace = call.workspaceOrThrow
    val request = call.receive<IoTracingDetailsRequest>()

    // Store as artifact (similar to metrics artifact)
    val artifactId = storeIoTracingArtifact(
        workspaceId = workspace._id,
        runGroup = request.runGroup,
        details = request.taskResults,
    )

    call.respond(IoTracingDetailsResponse(artifactId = artifactId))
}

@Serializable
data class IoTracingDetailsRequest(
    val runGroup: String,
    val ciExecutionId: String,
    val taskResults: List<TaskIoTracingResult>,
)

@Serializable
data class IoTracingDetailsResponse(
    val artifactId: String,
)
```

### 4.5 Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ CLI Agent                                                                    │
│                                                                              │
│  1. IoTracer captures file reads/writes during task execution               │
│  2. IoAnalyzer compares against declared inputs/outputs                     │
│  3. IoTracingAggregator builds summary across all tasks                     │
│  4. Summary added to AgentInstanceMetadata.ioTracingAnalysis                │
│                                                                              │
│  POST /nx-cloud/v2/executions/tasks                                         │
│  {                                                                           │
│    "agentInstanceMetadata": {                                               │
│      "agentInstanceName": "...",                                            │
│      "ioTracingAnalysis": {                                                 │
│        "enabled": true,                                                     │
│        "tasksAnalyzed": 15,                                                 │
│        "tasksWithIssues": 3,                                                │
│        "topIssues": [...]                                                   │
│      }                                                                       │
│    }                                                                         │
│  }                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Nx API (Kotlin)                                                              │
│                                                                              │
│  1. DistributedExecutionV2Handlers receives request                         │
│  2. ProcessAgentStatusUpdate processes agentInstanceMetadata                │
│  3. Calls updateRunGroupIoTracingAnalysis() in CIPipelineExecutions         │
│  4. Merges with existing analysis, saves to MongoDB                         │
│                                                                              │
│  MongoDB: ciPipelineExecutions collection                                   │
│  {                                                                           │
│    "runGroups": [{                                                          │
│      "ioTracingAnalysis": {                                                 │
│        "enabled": true,                                                     │
│        "tasksAnalyzed": 45,                                                 │
│        "tasksWithIssues": 8,                                                │
│        "topIssues": [...],                                                  │
│        "updatedAt": "2024-..."                                              │
│      }                                                                       │
│    }]                                                                        │
│  }                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Nx Cloud UI                                                                  │
│                                                                              │
│  1. Data loader fetches runGroupDetails including ioTracingAnalysis         │
│  2. CiPipelineExecutionAlerts renders warning if tasksWithIssues > 0        │
│  3. (Future) Detailed view shows full issue breakdown                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## File Checklist

### CLI (client-bundle)
- [ ] `libs/nx-packages/client-bundle/src/lib/core/models/distributed-agent/io-tracing.model.ts` - TypeScript interfaces
- [ ] `libs/nx-packages/client-bundle/src/lib/core/metrics/io-tracer.ts` - eBPF tracer wrapper
- [ ] `libs/nx-packages/client-bundle/src/lib/core/metrics/io-analyzer.ts` - Analysis logic
- [ ] `libs/nx-packages/client-bundle/src/lib/core/metrics/io-tracing-aggregator.ts` - Aggregation
- [ ] `libs/nx-packages/client-bundle/src/lib/core/models/distributed-agent/agent-instance-metadata.model.ts` - Add ioTracingAnalysis field
- [ ] `libs/nx-packages/client-bundle/src/lib/core/runners/distributed-agent/v3/execute-tasks-v3.ts` - Integration

### API (Kotlin)
- [ ] `libs/shared/db-schema-kotlin/src/main/kotlin/Db.kt` - IoTracingAnalysis, IoIssueSummary classes
- [ ] `apps/nx-api/src/main/kotlin/tasks/Messages.kt` - Update AgentInstanceMetadata
- [ ] `apps/nx-api/src/main/kotlin/persistence/CIPipelineExecutions.kt` - updateRunGroupIoTracingAnalysis()
- [ ] `apps/nx-api/src/main/kotlin/services/dteV2/operations/ProcessAgentStatusUpdate.kt` - Handle ioTracingAnalysis

### Model (TypeScript - Nx Cloud)
- [ ] `libs/nx-cloud/model-db/src/lib/ci-pipeline-executions.ts` - MongoIoTracingAnalysis, MongoIoIssueSummary

### Data Loaders (Future - UI)
- [ ] `libs/nx-cloud/data-access-ci-pipeline-execution/src/lib/ci-pipeline-executions-details-container-loader.server.ts`

### UI (Future)
- [ ] `libs/nx-cloud/ui-ci-pipeline-executions/src/lib/cipe-alerts.tsx`
- [ ] `libs/nx-cloud/feature-ci-pipeline-executions/src/lib/ci-pipeline-executions-details-container.tsx`

---

## Open Questions

1. **eBPF Permissions**: POC uses `sudo -E bpftrace`. In Nx Agents environment, is sudo available? Need to verify container/VM setup.

2. **Performance Impact**: What's the overhead of eBPF tracing? Should it be sampled or always-on?

3. **Write Tracing**: POC only traces reads. Do we need write tracing too? (Added in tracer but may need tuning)

4. **Scope**: Start with Nx Agents only, or also support local DTE agents?

5. **Noise Filtering**: Current ignored dirs: `node_modules`, `.nx`, `.angular`, `.git`. What else?

6. **Cross-platform**: eBPF is Linux-only. macOS/Windows agents will have `tracingEnabled: false`.

7. **Artifact Storage**: Store detailed per-task data? If so, how long to retain?

---

## Related Linear Issues
- (To be created)

## References
- eBPF POC: https://gist.github.com/jaysoo/0fb0d2cf5796a41908ae0b934092a64f
- CPU/Memory metrics implementation: `libs/nx-cloud/feature-ci-pipeline-executions/src/lib/analysis/resource-usage/`
- Existing alert patterns: `libs/nx-cloud/ui-ci-pipeline-executions/src/lib/cipe-alerts.tsx`
- Agent instance metadata: `libs/nx-packages/client-bundle/src/lib/core/models/distributed-agent/agent-instance-metadata.model.ts`
- ProcessMetricsAggregator pattern: `libs/nx-packages/client-bundle/src/lib/core/metrics/process-metrics-aggregator.ts`
