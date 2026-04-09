# Spec: Nx E2E Test Performance Optimization

**Date:** 2026-04-08
**Status:** Ready for implementation
**Author:** Jack Hsu (brainstorm) + Claude (spec)

## Goal

Reduce per-file e2e test execution time by **>=30%**, which compounds to **>=40% suite-level improvement** since CI uses task splitting (one file per agent).

## Verification Targets

| Target | Command | Current | Goal |
|--------|---------|---------|------|
| Single file | `nx run e2e-release:e2e-ci--src/version-plans-only-touched.test.ts` | ~3 min | <=2 min |
| Full suite | `nx run e2e-react` | ~17.5 min | <=10.5 min |

## Constraints

- **Verdaccio stays** — must simulate real npm/yarn/pnpm installs for e2e confidence
- **No language switches** — TypeScript and Rust stay as-is
- **CI model** — each agent starts Verdaccio once, packages pre-published, runs 1+ test files sequentially
- **maxWorkers: 1** — by design, not changeable (tests share filesystem state within a file)
- **Test runner changeable** — Jest -> Vitest, ts-jest -> @swc/jest both valid
- **No parallelizing test files** — CI already handles this via task splitting

## Current E2E Lifecycle (per test file)

```
[Jest boot + ts-jest transform]  ~5-15s
         |
[Global Setup: Verdaccio wait + registry config]  ~5-30s
         |
[newProject(): copy backup + pnpm install]  ~30-90s  <-- suspected dominant cost
         |
[Test logic: runCLI() x N, git ops, assertions]  ~30-60s
         |
[Cleanup: cleanupProject()]  ~1-5s
```

### Key Files

| File | Role |
|------|------|
| `e2e/utils/create-project-utils.ts` | `newProject()`, workspace backup/restore, `runCreateWorkspace()` |
| `e2e/utils/command-utils.ts` | `runCLI()`, `runCommand()`, `runCommandAsync()`, package manager abstraction |
| `e2e/utils/global-setup.ts` | Verdaccio wait, registry config, auth tokens |
| `e2e/utils/global-teardown.ts` | Verdaccio shutdown |
| `e2e/jest.preset.e2e.js` | Shared Jest config for all e2e projects |
| Per-project `jest.config.cts` | testTimeout: 120000, maxWorkers: 1, ts-jest transform |

### newProject() Internals (create-project-utils.ts)

1. **First call (no backup exists):**
   - `runCreateWorkspace()` — creates full Nx workspace
   - Installs specified packages from Verdaccio
   - Runs `nx reset` to stop daemon
   - Moves workspace to backup dir: `{e2eCwd}/proj-backup/{packageManager}/`

2. **Subsequent calls (backup exists):**
   - `copySync(backupPath, projectDir)` — full directory copy
   - **pnpm special case:** runs full `pnpm install` to recreate broken symlinks
   - Installs any missing packages not in backup

### e2e-react Suite Profile

- 31 test files, 122 test cases, ~310 runCLI() calls
- ~23 `newProject()` invocations (one per file's `beforeAll`)
- Module federation: 19 files (61% of suite)
- Runs sequentially in single Jest process locally

### version-plans-only-touched.test.ts Profile

- 1 `newProject()` call (beforeEach)
- 5 `runCLI('generate ...')` + 5 `runCLI('release plan ...')`
- ~15 git operations via `runCommandAsync()`
- 1 test case in 1 describe block

## Hypotheses (ranked by expected impact)

### H1: newProject() pnpm reinstall is the #1 bottleneck (HIGH)

**Problem:** Every test file copies a cached workspace backup, then runs full `pnpm install` just to recreate symlinks that broke during the copy. This hits Verdaccio for every package resolution even though packages haven't changed.

**Potential optimizations:**
- `pnpm install --offline` or `--prefer-offline` to skip registry resolution
- Use hardlinks (`cp -al`) instead of regular copy to preserve pnpm store links
- Copy the pnpm store directory along with the workspace
- Use `pnpm deploy` to create a self-contained directory
- Tar archive with symlinks preserved instead of `copySync()`
- Investigate if `rsync -a` preserves the relevant symlink structure

### H2: runCLI() Nx startup overhead accumulates (MEDIUM)

**Problem:** Each `runCLI()` spawns a new Node process with Nx. Startup includes loading workspace config, checking daemon status, etc. With 5-15 calls per test file, even 2-3s per call adds up to 10-45s.

**Potential optimizations:**
- Ensure Nx daemon stays warm between `runCLI()` calls (verify it does)
- Profile `runCLI()` to separate Nx startup from actual command execution
- Reduce overhead in e2e mode (skip cloud checks, telemetry, etc.)
- Investigate if `NX_DAEMON=false` is faster for short commands (skip IPC overhead)

### H3: Jest + ts-jest transform overhead (LOW-MEDIUM)

**Problem:** ts-jest compiles TypeScript on every Jest invocation. The e2e utils module is ~17 files of shared infrastructure.

**Potential optimizations:**
- Switch to `@swc/jest` — drop-in replacement, 10-50x faster TypeScript transform
- Switch to Vitest with esbuild/SWC transform
- Pre-compile e2e utils to JavaScript (skip transform entirely at test time)
- Use Jest's `transformIgnorePatterns` to skip already-compiled code

### H4: Global setup Verdaccio polling (LOW)

**Problem:** Global setup polls Verdaccio with an unknown interval. If registry is already running, may still incur unnecessary wait.

**Potential optimizations:**
- Reduce poll interval
- Single quick check instead of polling loop when registry is already up
- Write a ready-flag file that global setup can check instantly

## Implementation Plan

### Step 1: Instrument & Measure

Add `fs.appendFileSync('/tmp/nx-e2e-timing.log', ...)` timing instrumentation to:

```
global-setup.ts:
  - Total global setup time
  - Verdaccio wait loop duration
  - Registry config setup duration

create-project-utils.ts:
  - Total newProject() time
  - Backup copy (copySync) duration
  - pnpm install duration (the symlink recreation)
  - packageInstall() for missing packages
  - runCreateWorkspace() (first-time only)

command-utils.ts:
  - Each runCLI() call with command string and duration
  - Separate process spawn overhead from command execution

Test file level:
  - beforeAll/afterAll boundaries
  - Per it() block timing
```

**Run both verification targets, collect logs, parse into timing breakdown.**

### Step 2: Analyze & Rank

- Parse `/tmp/nx-e2e-timing.log` into a table
- Calculate % of total time per phase
- Confirm or refute H1-H4 with data
- Identify any unexpected bottlenecks missed in hypotheses

### Step 3: Optimize Top Bottlenecks

Attack in measured-impact order. For each optimization:

1. Implement the change
2. Re-run the same test target
3. Measure wall-clock delta
4. Keep if improvement is real, revert if not

**Likely attack order (pending measurement):**
1. Optimize pnpm reinstall in newProject() (H1)
2. Reduce runCLI() overhead if significant (H2)
3. Swap ts-jest for @swc/jest (H3)
4. Optimize global setup polling (H4)

### Step 4: Verify Targets Met

- Re-run both verification targets with all optimizations
- Confirm >=30% single-file improvement
- Confirm >=40% suite improvement
- Run full e2e-react suite to check for flakiness (3x runs)

## Success Criteria

- [ ] Single test file: >=30% wall-clock reduction
- [ ] Full suite: >=40% wall-clock reduction
- [ ] All existing tests still pass (no assertion changes)
- [ ] No flakiness introduced (3x clean runs)
- [ ] Instrumentation removed from final changes
- [ ] Changes are clean and committable

## Out of Scope

- Parallelizing test files (CI task splitting handles this)
- Replacing Verdaccio with a different registry approach
- Language switches (TS/Rust to something else)
- Reducing test coverage or removing assertions
- Changing the CI pipeline architecture

## Open Questions (to resolve during measurement)

1. What % of newProject() time is the copy vs the pnpm install?
2. Does Nx daemon stay alive between runCLI() calls within a test?
3. Is the Jest transform cache effective across runs, or cold every time?
4. Are there any unexpected I/O bottlenecks (e.g., Verdaccio disk access)?
5. How much time does each `runCLI('generate ...')` spend vs `runCLI('release plan ...')`?
