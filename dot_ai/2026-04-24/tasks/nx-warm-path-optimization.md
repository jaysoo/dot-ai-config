# Nx warm-path optimization — 5 areas to inspect

**Repo:** `~/projects/bench-monorepo-orchestrators` (branch `add_nx`)
**Nx version measured:** 20.8.4 (in node_modules)
**Prereq:** bench set up with 15 pkgs, `nx run-many -t build --parallel=3`, daemon off

## Why this exists

Warm-path wall time for `nx run-many -t build` with cache fully populated is ~830 ms.
Instrumentation (5 iterations with Gemini cross-review) showed:

- Time to cache fully restored on disk: **~466 ms**
- Cache restore itself (SQLite GET + Rust file copy): **~3 ms**
- Bootstrap (node startup → graph ready): **~440 ms**
- Nx-specific shutdown tail after work is done: **~180 ms**
- V8/native teardown after `process.on('exit')`: **~150 ms**

99%+ of time-to-restored-cache is NOT the cache — it's everything before it.

Full timeline (daemon off, cache warm, apps/\*/dist deleted):

```
t+0ms    nx.js entry
t+440ms  graph+hash complete
t+463ms  applyCachedResults entry   (+23ms orchestrator)
t+466ms  CACHE RESTORE DONE          (+3ms)
t+489ms  endCommand done             (+23ms postRunSteps)
t+655ms  process.on('exit') fires    (+165ms Nx shutdown tail)
t+830ms  kernel reaps process        (+175ms V8 teardown)
```

## Five areas (ranked by ROI)

### 1. `execSync('pnpm --version')` in getPackageManagerCommand — 170 ms

- **Hot file:** `node_modules/nx/src/utils/package-manager.js:179`
- **Called from:** lazy `packageManagerCommand ??= getPackageManagerCommand()` inside `readTargetsFromPackageJson`, triggers on first `package-json:createNodes`
- **What it does:** spawns `pnpm --version` synchronously to detect pnpm major version for `modernPnpm`/`includeDoubleDashBeforeArgs` feature flags
- **Why it's slow:** full node child-process spawn, 169 ms bare on this hardware
- **Fix sketch:** try `"packageManager"` field in root `package.json` BEFORE execSync (currently only checked in the catch branch). Corepack-era repos always have this field pinned.
- **Expected gain:** ~170 ms per cold-process invocation
- **Impact test:** `NX_PERF_LOGGING=true pnpm exec nx show project @bench/app-crew 2>&1 | grep package-json:createNodes` — should drop from ~190 ms to ~20 ms after patch

### 2. Plugin worker fork + require chain — 106 ms critical path

- **Hot file:** `node_modules/nx/src/project-graph/plugins/isolation/plugin-pool.js:261` (spawn call)
- **What it does:** spawns 3 node subprocesses, one per core plugin (`js`, `package-json`, `project-json`), each requires nx core → ~100 ms module load. Parallelized, critical path = slowest (~106 ms)
- **Why isolation exists:** error boundary for plugin crashes + dependency-version safety for third-party plugins
- **Fix sketch:** in-process loader already exists at `nx/src/project-graph/plugins/in-process-loader.js`, gated by `isIsolationEnabled()` in `plugins/isolation/enabled.js`. Add a flag (or heuristic: "plugin is under nx/" core namespace) to skip isolation for the 3 core plugins only, keep it for third-party
- **Expected gain:** ~100 ms per cold-process invocation (daemon-off case)
- **Impact test:** `NX_PERF_LOGGING=true nx show project ... 2>&1 | grep "Load Nx Plugin"` — per-plugin load times should drop from ~100 ms to <5 ms

### 3. Nx-specific process shutdown tail — ~180 ms, cause not yet pinned down

- **What:** gap between `endCommand done` (t+489 ms) and `process.on('exit')` firing (t+655 ms)
- **Known NOT to be the cause** (eliminated during iteration):
  - Plugin worker IPC sockets — `process._getActiveHandles()` showed the 2 surviving handles are fd=1 (stdout) and fd=2 (stderr), not worker sockets
  - Calling `cleanupPlugins()` from `nxCleanup` or end-of-runner had zero effect on wall time
  - `removeDbConnections()` itself is 0.09 ms
  - TaskHistoryLifeCycle `recordTaskRuns` + `getFlakyTasks` = 0.26 ms combined
- **Baseline:** `node -e ""` teardown is ~18 ms. So ~160 ms is genuinely Nx-specific
- **Candidates worth drilling:**
  - SQLite WAL / journal fsync at connection destruction (Rust `Drop` impl of `DbConnection`)
  - NxDaemonClient still opens a socket or timer even when `NX_DAEMON=false` (`nx/src/daemon/client/client.js` — check `enabled()` side effects)
  - Per-plugin-worker `setInterval` keepalive handles that weren't `unref()`'d
  - Pending microtasks from lifecycle observables (`convertObservableToPromise` in run-command.js)
- **How to drill:** add timing markers inside `nx::native::db::connection` Drop impl (Rust) and also log `process._getActiveHandles()` every 20 ms during the tail window via `setInterval` to see when handles actually go away
- **Expected gain:** up to ~150 ms if we find the culprit; some floor is unavoidable
- **Impact test:** `NX_PERF_LOGGING=true pnpm exec nx show project @bench/app-crew` — even a no-task command has the same tail; tells us it's not specific to `run-many`

### 4. "Metadata tax" — `createNodes` scaling with N projects

- **Not a problem today** (15 pkgs, <0.1 ms/pkg after JIT warmup)
- **Will be a problem at 100-500 pkgs**: linear `JSON.parse` + target-from-scripts translation in `readTargetsFromPackageJson` + `getMetadataFromPackageJson` + `getTagsFromPackageJson`
- **Fix sketch:** move these 3 functions into Rust via native binding. Native JSON parse + direct field extraction is 10-20× faster than JS round-trip. Would also let `createNodeFromPackageJson` avoid the JS object allocations per pkg.
- **Impact test:** regenerate workspace with 500 pkgs and measure `nx/core/package-json:createNodes` perf mark — should hold near-constant instead of growing linearly

### 5. SQLite `cache.get` batch opportunity — low priority today

- **Hot file:** `node_modules/nx/src/tasks-runner/cache.js:87`
- **What it does:** one `NxCache::get(hash)` native call per cached task
- **Today:** 0.1-0.6 ms per task, ~300 µs is N-API argument marshaling
- **At 100 tasks:** ~60 ms of pure overhead
- **Fix sketch:** single `SELECT ... WHERE hash IN (?, ?, ...)` batched GET, one N-API call. Rust side returns preallocated vector instead of N small allocations
- **Impact test:** `nx run-many -t lint --parallel=1` on a 500-pkg workspace and watch `cache-results` perf mark

## Dropped hypotheses (record of what we eliminated)

| Hypothesis                                                             | Verdict | Evidence                                                                                                                                                    |
| ---------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shouldCopyOutputsFromCache` mtime check is slow                       | NO      | task-orchestrator.js:454 returns `true` immediately when daemon off; the 0.02-3 ms I saw was Promise-resolve noise                                          |
| Native filesystem copy (Rust) is slow                                  | NO      | 1-2 ms for 3.4 MB. Only matters at 100 MB+ outputs                                                                                                          |
| Build-project-graph merge takes 25 ms (Gemini's claim)                 | PARTIAL | Direct instrumentation of `buildProjectGraphUsingContext` body = 6.7 ms. The 25 ms perf marker wraps caller code outside the merge                          |
| Task history SQLite writes bloat the tail (Gemini's claim)             | NO      | `recordTaskRuns` = 0.16 ms, `getFlakyTasks` = 0.10 ms. Negligible                                                                                           |
| WorkspaceContext Rust init is "Very High ROI" (Gemini's claim)         | NO      | Total init + walk + hash = ~28 ms                                                                                                                           |
| Plugin worker sockets keep process alive (my initial tail hypothesis)  | NO      | `_getActiveHandles()` showed stdout/stderr, not IPC sockets; calling `cleanupPlugins()` had no effect                                                       |
| Module load latency accounts for ~150 ms of bootstrap (Gemini's claim) | NO      | Instrumented sum (pnpm spawn + plugin load + createNodes + merge + workspace-ctx + walker) = ~363 ms; bootstrap is ~440 ms; gap ≈ 77 ms for node+V8 startup |

## Suggested day-of work order

1. (30 min) Patch #1 locally, measure delta. Low risk, highest return. Easiest confirmation.
2. (1 hr) Patch #2 — add an `NX_ISOLATE_CORE_PLUGINS=false` env escape hatch, gate in `isIsolationEnabled`. Measure delta.
3. (1-2 hr) Dig into #3. Start with native DB Drop timing (Rust `println!` in the Drop impl, or use `tracing` if already wired). If that's not it, bisect the JS event loop by adding `setInterval(_getActiveHandles, 10)` in `run-command.js` finally block.
4. Write up results in a short internal doc (or PR description) for each of #1 and #2 with before/after numbers.

## Repo + files to bring into tomorrow's session

- `node_modules/nx/src/utils/package-manager.js` (line 179, #1)
- `node_modules/nx/src/project-graph/plugins/isolation/plugin-pool.js` (#2)
- `node_modules/nx/src/project-graph/plugins/isolation/enabled.js` (#2 gating)
- `node_modules/nx/src/project-graph/plugins/in-process-loader.js` (#2 existing fallback)
- `node_modules/nx/src/utils/db-connection.js` + Rust `nx::native::db::connection` (#3 candidate)
- `node_modules/nx/src/daemon/client/client.js` (#3 candidate — daemon-off side effects)
- `node_modules/nx/src/tasks-runner/cache.js:87` (#5)

For patches, remember the nx repo is at `~/projects/nx` — can `pnpm link` for faster debug loop than editing node_modules.

## Measurement harness (copy-paste)

```bash
cd ~/projects/bench-monorepo-orchestrators
git checkout add_nx

# baseline wall
rm -rf apps/*/dist
/usr/bin/time -l env NX_DAEMON=false pnpm exec nx run-many -t build --parallel=3 > /dev/null 2>&1

# perf breakdown
rm -rf apps/*/dist
NX_DAEMON=false NX_PERF_LOGGING=true NX_NATIVE_LOGGING=nx \
  pnpm exec nx run-many -t build --parallel=3 2>&1 | grep -E "^Time for|TRACE nx::native"

# per-handle exit reason
# (requires instrumentation — see previous session notes)
```
