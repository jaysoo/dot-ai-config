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

## In Progress

### PR #33822 Review - Allow Copying Prisma Client from node_modules

**PR**: https://github.com/nrwl/nx/pull/33822
**Plan**: `.ai/2025-12-16/tasks/pr-33822-prisma-node-modules-verification.md`

Critical finding: The PR only fixes ONE of TWO locations:
- `processAllAssetsOnce()` (async) at line 143 - Fixed
- `processAllAssetsOnceSync()` (sync) at line 160 - NOT Fixed

Action required: The sync method also needs the same fix.

### CNW User Re-creation Investigation

- Issue: Users try to create a workspace again even though one was just created successfully
- Root cause likely: NPM warnings returned as errors confuse users
- The "something failed but workspace exists" messaging doesn't seem to be working
