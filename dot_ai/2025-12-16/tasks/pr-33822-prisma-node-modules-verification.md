# PR #33822 Verification Plan: Prisma node_modules Copy Fix

## Status: ✅ COMPLETED with Optimization

## Issue Summary

PR #33822 removes `node_modules` from the ignore list in `copy-assets-handler.ts` to allow Prisma clients (generated in `node_modules`) to be copied during builds.

## Critical Finding: Incomplete Fix + Performance Issue

**The PR only fixes ONE of TWO locations:**

| Method | Line | Fixed? |
|--------|------|--------|
| `processAllAssetsOnce()` (async) | 143 | ✅ Yes |
| `processAllAssetsOnceSync()` (sync) | 160 | ❌ No (FIXED) |

**Performance Issue Discovered:** Simply removing `**/node_modules/**` from ignore causes 39,000% performance regression for broad glob patterns (e.g., `**/*.json` takes 185ms vs 0.47ms).

## Solution Implemented: Smart node_modules Filtering

Instead of unconditionally removing node_modules from ignore, we now **conditionally allow node_modules traversal only when the asset input path explicitly starts with `node_modules/`**.

### New Helper Method
```typescript
private getIgnorePatternsForAsset(ag: AssetEntry): string[] {
  const inputStartsWithNodeModules =
    ag.input.startsWith('node_modules/') || ag.input === 'node_modules';

  if (inputStartsWithNodeModules) {
    return ['**/.git/**'];
  }
  return ['**/node_modules/**', '**/.git/**'];
}
```

### Behavior
| Asset Input | node_modules Ignored? | Example |
|-------------|----------------------|---------|
| `node_modules/.prisma/client` | No | Prisma client copied ✅ |
| `node_modules/@prisma/client` | No | @prisma/client copied ✅ |
| `apps/api` | Yes | Performance preserved ✅ |
| `.` (root) | Yes | Performance preserved ✅ |

## Test Results

All 12 tests pass including 4 new node_modules-specific tests:
- ✅ should copy files from node_modules/.prisma using async method
- ✅ should copy files from node_modules/.prisma using sync method
- ✅ should copy files from node_modules/@prisma/client
- ✅ should still ignore node_modules for non-node_modules patterns

---

## Test Plan Overview

### Phase 1: Verify Prisma Fix Works
Create a workspace with Prisma and verify client files can be copied.

### Phase 2: Performance Regression Testing
Create workspaces with many dependencies to measure copy performance with/without node_modules.

### Phase 3: Optimization Analysis
If performance regression is significant, design an optimization strategy.

---

## Phase 1: Prisma Verification

### Setup Steps

```bash
# Create test workspace
cd /tmp
npx -y create-nx-workspace@latest prisma-test \
  --preset=node-monorepo \
  --appName=api \
  --framework=nest \
  --no-interactive \
  --nxCloud=skip

cd prisma-test

# Install Prisma
pnpm add prisma @prisma/client

# Initialize Prisma
npx prisma init --datasource-provider sqlite

# Create a minimal schema (schema.prisma)
# datasource db {
#   provider = "sqlite"
#   url      = "file:./dev.db"
# }
# generator client {
#   provider = "prisma-client-js"
# }
# model User {
#   id    Int     @id @default(autoincrement())
#   email String  @unique
#   name  String?
# }

# Generate Prisma client (creates files in node_modules/.prisma)
npx prisma generate
```

### Configure Asset Copying

In the app's `project.json`, add assets configuration:

```json
{
  "targets": {
    "build": {
      "executor": "@nx/esbuild:esbuild",
      "options": {
        "assets": [
          {
            "input": "node_modules/.prisma",
            "glob": "**/*",
            "output": "prisma-client"
          },
          {
            "input": "node_modules/@prisma/client",
            "glob": "**/*",
            "output": "@prisma/client"
          }
        ]
      }
    }
  }
}
```

### Verification

```bash
# Build the app
nx build api

# Check output directory for Prisma files
ls -la dist/apps/api/prisma-client/
ls -la dist/apps/api/@prisma/client/

# Expected: Prisma client files should exist in output
```

### Test Cases

1. **Async build path**: Standard `nx build` (uses `processAllAssetsOnce`)
2. **Sync build path**: Need to identify which executors use the sync method
3. **Watch mode**: Verify file changes in node_modules trigger re-copy

---

## Phase 2: Performance Regression Testing

### Concern

Removing `**/node_modules/**` from ignore could cause:
- Scanning ALL nested node_modules across ALL projects
- Significant slowdown with pnpm/npm workspaces that have project-local node_modules

### Test Strategy

Use a **single workspace** with multiple branches to test different package managers:
- `perf/pnpm` branch - pnpm with potential nested node_modules
- `perf/npm` branch - npm for comparison

This ensures controlled comparison with identical project structure.

### Workspace Setup

```bash
cd /tmp
npx -y create-nx-workspace@latest perf-test \
  --preset=ts \
  --packageManager=pnpm \
  --no-interactive \
  --nxCloud=skip

cd perf-test
git init

# Create multiple library projects with dependencies
for i in {1..10}; do
  nx g @nx/js:lib lib-$i
done

# Add heavy dependencies to root
pnpm add lodash moment axios date-fns zod yup \
  @tanstack/react-query react-hook-form \
  @trpc/client @trpc/server typescript

# Add project-specific dependencies to some libs (creates nested node_modules potential)
cd packages/lib-1 && pnpm add uuid nanoid
cd packages/lib-2 && pnpm add dayjs ms
cd ../..

# Create baseline branch
git add -A && git commit -m "baseline setup"
git checkout -b perf/pnpm

# Create npm branch
git checkout main
git checkout -b perf/npm
rm -rf node_modules pnpm-lock.yaml
npm install
git add -A && git commit -m "switch to npm"
```

### pnpm-specific Testing

Test with different `nodeLinker` settings in `.npmrc`:

```bash
# Branch: perf/pnpm-hoisted
echo "nodeLinker=hoisted" > .npmrc
pnpm install

# Branch: perf/pnpm-isolated
echo "nodeLinker=isolated" > .npmrc
pnpm install
```

The `isolated` linker creates nested `node_modules` in each project - this is the worst-case scenario for performance.

### Benchmark Script

```typescript
// benchmark-copy-assets.ts
import { CopyAssetsHandler } from '@nx/js/src/utils/assets/copy-assets-handler';

const iterations = 10;

async function benchmark(label: string, handler: CopyAssetsHandler) {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await handler.processAllAssetsOnce();
    const end = performance.now();
    times.push(end - start);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const max = Math.max(...times);
  const min = Math.min(...times);

  console.log(`${label}: avg=${avg.toFixed(2)}ms, min=${min.toFixed(2)}ms, max=${max.toFixed(2)}ms`);
}
```

### Metrics to Capture

| Branch | Package Manager | nodeLinker | With ignore | Without ignore | Delta |
|--------|-----------------|------------|-------------|----------------|-------|
| perf/npm | npm | N/A | TBD | TBD | TBD |
| perf/pnpm | pnpm | hoisted (default) | TBD | TBD | TBD |
| perf/pnpm-isolated | pnpm | isolated | TBD | TBD | TBD |

**Key scenario:** `pnpm` with `isolated` linker is worst-case (nested node_modules per project).

---

## Phase 3: Optimization Strategy

If performance regression is significant, consider these approaches:

### Option A: Smart node_modules Filtering

Only include relevant node_modules:
- Root `node_modules` (always)
- Project's own `node_modules` (if exists)
- Exclude sibling project's `node_modules`

```typescript
// Example: For project at packages/api
// Include: node_modules, packages/api/node_modules
// Exclude: packages/lib-a/node_modules, packages/lib-b/node_modules

const ignorePatterns = this.assetGlobs.flatMap(ag => {
  const projectPath = ag.input;
  // Generate ignore patterns for OTHER project's node_modules
  return getOtherProjectNodeModules(projectPath);
});
```

### Option B: Opt-in for node_modules

Keep the ignore by default, but add an option to disable it:

```json
{
  "assets": [
    {
      "input": "node_modules/.prisma",
      "glob": "**/*",
      "output": "prisma-client",
      "includeNodeModules": true  // New option
    }
  ]
}
```

### Option C: Explicit node_modules pattern

Only traverse node_modules when the pattern explicitly references it:

```typescript
// If pattern starts with 'node_modules/', don't ignore node_modules
const shouldIgnoreNodeModules = !pattern.startsWith('node_modules/');
const ignore = shouldIgnoreNodeModules
  ? ['**/node_modules/**', '**/.git/**']
  : ['**/.git/**'];
```

**Recommendation:** Option C seems most pragmatic - it's backward compatible and only enables node_modules scanning when explicitly requested.

---

## Execution Steps

### Step 1: Fix the PR (Missing sync method)
```bash
# Edit packages/js/src/utils/assets/copy-assets-handler.ts
# Line 160: Change to ignore: ['**/.git/**']
```

### Step 2: Create Prisma test workspace
```bash
# Follow Phase 1 setup - creates prisma-test workspace
```

### Step 3: Run Prisma verification
```bash
# Build and verify output contains Prisma client files
```

### Step 4: Create performance test workspace
```bash
# Single workspace: perf-test
# Multiple branches for different package managers
```

### Step 5: Run benchmarks on each branch
```bash
# For each branch (perf/npm, perf/pnpm, perf/pnpm-isolated):
git checkout <branch>
# Run benchmark with master (node_modules ignored)
# Run benchmark with PR fix (node_modules not ignored)
# Record times
```

### Step 6: Document findings
- Update metrics table with results
- Decide if optimization is needed (threshold: >20% regression)
- Implement optimization if necessary

---

## Success Criteria

1. ✅ Prisma client files are copied to output directory
2. ✅ Both async and sync methods work correctly
3. ✅ Performance regression is < 20% for typical workspaces
4. ✅ If regression > 20%, optimization is implemented

---

## Files to Modify

1. `packages/js/src/utils/assets/copy-assets-handler.ts` - Line 160 (sync method)
2. Potentially add tests in `packages/js/src/utils/assets/copy-assets-handler.spec.ts`
