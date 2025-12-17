# Summary - December 16, 2025

## Completed

### NXC-3624: CNW (Create Nx Workspace) Improvements

**Linear Issue**: https://linear.app/nxdev/issue/NXC-3624
**Branch**: NXC-3624

#### 1. Directory Validation
**Commit**: `2278baaab4 fix(misc): validate directory existence in create-nx-workspace`

**Problem**: When passing a directory name via CLI argument (e.g., `npx create-nx-workspace existing_dir`), there was no validation to check if that directory already existed. The error would only occur later during workspace creation with a confusing message.

**Solution**:
- **Interactive mode**: Shows a warning "Directory existing_dir already exists." and re-prompts for a new folder name
- **Non-interactive/CI mode**: Throws a clear `DIRECTORY_EXISTS` error immediately
- Added `validate` function to enquirer prompt for real-time validation in interactive mode

#### 2. Simplified Preset Flow Cloud Prompt
**Commit**: `1c11252c6c fix(misc): simplify preset flow cloud prompt to use setupNxCloudV2`

**Problem**: The preset/custom flow used the old CI provider selection prompt (`setupCI` + `setupNxCloud`) while the template flow used the simplified `setupNxCloudV2` ("Try the full Nx platform?") prompt.

**Solution**:
- When no `--nxCloud` CLI arg provided: Use simplified `setupNxCloudV2` prompt (same as template flow)
- When CLI arg provided (e.g., `--nxCloud gitlab`): Keep existing behavior (CI provider selection)
- If user selects "Yes" → Nx Cloud enabled, GitHub CI generated, push to GitHub
- Maps `nxCloud === 'yes'` to `'github'` for CI generation

**Behavior Matrix**:
| Input | nxCloud | CI Generated | Push to GitHub |
|-------|---------|--------------|----------------|
| `--nxCloud github` | `'github'` | Yes (GitHub) | Yes |
| `--nxCloud gitlab` | `'gitlab'` | Yes (GitLab) | No |
| No arg → "Yes" | `'yes'` | Yes (GitHub) | Yes |
| No arg → "Skip" | `'skip'` | No | No |

#### 3. Precreate Telemetry
**Commit**: `33cf7d17e8 chore(misc): add precreate stat after template/preset selection`

Added `precreate` stat recording after template/preset selection to track:
- `flowVariant`: Which A/B test variant (0=preset, 1=template)
- `template`: Selected template (for template flow)
- `preset`: Selected preset (for preset flow)
- `nodeVersion`, `packageManager`

#### 4. Additional Tracking
**Commit**: `fb41b6ad84 chore(misc): add more tracking`

Enhanced telemetry for better insights into CNW usage patterns.

**Files Changed**:
- `packages/create-nx-workspace/bin/create-nx-workspace.ts` - All prompt flow changes and telemetry
- `packages/create-nx-workspace/src/create-workspace.ts` - CI generation and GitHub push conditions
- `packages/create-nx-workspace/src/utils/nx/ab-testing.ts` - Added `RecordStatMetaPrecreate` interface

### Framer Sync (2025-12-16)

1. Which page for canary this week? -> /community
2. Banner JSON -> let's do this week on canary
3. Pricing and Cloud pages
   - TBD (deadline Friday for exec team for outline of pages to review next week)
   - Sync first week in January
4. Blog?
   - GitHub sync should work for local author with AI assistance
   - Custom components: embeds (videos, tweets), code blocks with highlighting/diffs
   - Could have plugin between authored and rendered content
   - More CTAs at end of blogs - Framer can do this

### Infra Sync (2025-12-16)

- Make sure Linear tasks are the source of truth, attach relevant docs, links, PRs
- ClickUp renewal concerns
- Follow-up with projects like Docker Layer Caching and Hosted Redis
- Docker, not building in images makes a lot of headaches

### CLI Sync (2025-12-16)

- Can we check with Claude what issues are related to PRs
- Follow up with Nicole on onboarding leftover items
- DPEs Sync to go over dotnet adoption

### PR #33822 Review - Allow Copying Prisma Client from node_modules

**PR**: https://github.com/nrwl/nx/pull/33822
**Plan**: `.ai/2025-12-16/tasks/pr-33822-prisma-node-modules-verification.md`
**Status**: ✅ COMPLETED with Optimization

#### Problem Analysis

The original PR only fixed one of two locations:
- `processAllAssetsOnce()` (async) at line 143 - Fixed by PR
- `processAllAssetsOnceSync()` (sync) at line 160 - Missing (fixed)

#### Critical Performance Issue Discovered

Simply removing `**/node_modules/**` from the ignore list caused a **39,000% performance regression** for broad glob patterns:
- `**/*.json`: 0.47ms/18 files → 185ms/2,280 files (before optimization)

#### Solution Implemented: Smart node_modules Filtering

Added `getIgnorePatternsForAsset()` helper method that conditionally allows node_modules traversal only when the asset input path explicitly starts with `node_modules/`:

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

#### Behavior Matrix

| Asset Input | node_modules Ignored? | Example |
|-------------|----------------------|---------|
| `node_modules/.prisma/client` | No | Prisma client copied ✅ |
| `node_modules/@prisma/client` | No | @prisma/client copied ✅ |
| `apps/api` | Yes | Performance preserved ✅ |
| `.` (root) | Yes | Performance preserved ✅ |

#### Tests Added

4 new tests in `copy-assets-handler.spec.ts`:
1. `should copy files from node_modules/.prisma using async method`
2. `should copy files from node_modules/.prisma using sync method`
3. `should copy files from node_modules/@prisma/client`
4. `should still ignore node_modules for non-node_modules patterns`

All 12 tests pass.

#### Files Modified

- `packages/js/src/utils/assets/copy-assets-handler.ts` - Added `getIgnorePatternsForAsset()` method, updated both async and sync methods
- `packages/js/src/utils/assets/copy-assets-handler.spec.ts` - Added 4 new tests (+207 lines)

### CNW pnpm/yarn/bun Workspace Protocol Fix

**Branch**: pnpm_fix

#### Problem

When CNW (Create Nx Workspace) generates workspaces with workspace dependencies, it was using `*` instead of `workspace:*` in individual package.json files. This caused issues for pnpm, yarn, and bun which require the `workspace:*` protocol for proper symlinking.

#### Solution

**Commit**: `dfce2e425b fix(core): convert * to workspace:* for pnpm/yarn/bun in CNW`

1. Created `convertStarToWorkspaceProtocol()` function that:
   - Finds all package.json files under `packages/`, `libs/`, `apps/` directories
   - Supports 2-level nesting (e.g., `libs/shared/models/package.json`)
   - Converts `*` dependencies/devDependencies to `workspace:*`
   - Only modifies files that have `*` versions (no unnecessary writes)

2. Created `findAllWorkspacePackageJsons()` with recursive search:
   - Configurable `maxDepth` parameter (defaults to 2)
   - Memory-efficient single array that accumulates results during recursion

3. Applied to pnpm, yarn, and bun (npm handles `*` natively)

**Files Changed**:
- `packages/create-nx-workspace/src/utils/package-manager.ts` - Added new functions
- `packages/create-nx-workspace/src/utils/package-manager.spec.ts` - Added tests

### CNW Template E2E Tests

**Commit**: `b646a7e3ce chore(testing): add e2e tests for CNW template flow`

Added e2e tests for the CNW template flow (`--template=nrwl/*`):

1. Tests all 4 templates:
   - `nrwl/empty-template`
   - `nrwl/typescript-template`
   - `nrwl/react-template`
   - `nrwl/angular-template`

2. Tests both npm and pnpm package managers

3. Verifies `nx run-many -t test,build` works after workspace creation

4. Updated `runCreateWorkspace` helper function:
   - Made `preset` and `template` both optional
   - Added validation: exactly one must be provided
   - Only passes `--preset` or `--template` when defined

**Files Changed**:
- `e2e/workspace-create/src/create-nx-workspace-templates.test.ts` - New test file
- `e2e/utils/create-project-utils.ts` - Updated `runCreateWorkspace` signature

## In Progress

### CNW User Re-creation Investigation

- Issue: Users try to create a workspace again even though one was just created successfully
- Root cause likely: NPM warnings returned as errors confuse users
- The "something failed but workspace exists" messaging doesn't seem to be working
