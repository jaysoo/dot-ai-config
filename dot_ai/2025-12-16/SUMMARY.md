# Summary - December 16, 2025

## Completed

### NXC-3624: Handle Directory Validation for CNW (Create Nx Workspace)

**Linear Issue**: https://linear.app/nxdev/issue/NXC-3624
**Branch**: NXC-3624
**Commit**: `2278baaab4 fix(misc): validate directory existence in create-nx-workspace`

**Problem**: When passing a directory name via CLI argument (e.g., `npx create-nx-workspace existing_dir`), there was no validation to check if that directory already existed. The error would only occur later during workspace creation with a confusing message.

**Solution**:
- **Interactive mode**: Shows a warning "Directory existing_dir already exists." and re-prompts for a new folder name
- **Non-interactive/CI mode**: Throws a clear `DIRECTORY_EXISTS` error immediately
- Added `validate` function to enquirer prompt for real-time validation in interactive mode
- Kept fallback `invariant` checks for CI/non-interactive mode as safety guards

**Files Changed**:
- `packages/create-nx-workspace/bin/create-nx-workspace.ts` - Added directory validation with re-prompt flow
- `packages/create-nx-workspace/src/utils/template/clone-template.ts` - Minor error message cleanup

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
