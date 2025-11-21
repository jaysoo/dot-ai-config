# Summary - November 21, 2025

## NXC-3464: CNW Templates - Implementation Feedback Round

### Overview
Implemented comprehensive feedback from Victor and Nicole on the CNW templates feature, focusing on UX improvements, message consistency, and error handling polish.

### Key Changes Implemented

#### 1. Cloud Prompt Variants (A/B Testing)
- **Updated to 4 variants** (was 3):
  1. **remote-cache**: "Enable remote caching with Nx Cloud?" - baseline/performance messaging
  2. **fast-ci**: "Speed up CI and reduce compute costs with Nx Cloud?" - cost/efficiency focused
  3. **full-platform**: "Try the full Nx platform?" - platform positioning
  4. **green-prs**: "Get to green PRs faster with Nx Cloud?" - developer productivity (NEW)
- Updated all footers to use current URLs (nx.dev/nx-cloud, nx.dev/ci/features/remote-cache)
- Changed copy from "automated test healing" → "Automatically fix broken PRs"
- Simplified metadata system: removed `metaCode` field, now using single `code` field for tracking

#### 2. Error Message Improvements
**Template Cloning:**
- Added directory conflict check before clone attempt
- Changed "Failed to clone template" → "Failed to create starter workspace" (hides implementation details)
- Provides clear, actionable error messages

**GitHub Push:**
- Updated error title: "Could not push. Push repo to complete setup." (acknowledges failure, concise)
- Simplified body message: "Go to <url> and push this workspace." (removed repetition of "create"/"push")

**Git Repository:**
- Ensured "Could not initialize git repository" has no period (title consistency)

#### 3. Analytics Integration
**recordStat Function Enhancement:**
- Added `directory` parameter (required)
- Dynamic loading of `getCloudUrl` from workspace's nx package using `require.resolve` with paths array
- Enables support for custom Nx Cloud instances
- Falls back to default cloud.nx.app if workspace nx package unavailable
- Updated all call sites in create-nx-workspace and create-nx-plugin

**Early Stat Recording:**
- Moved early recordStat call to after `determineFolder()` so workspace directory is available
- Constructed directory path using same pattern as main flow: `join(process.cwd().replace(/\\/g, '/'), argv.name)`

#### 4. Message Punctuation Consistency
Established and enforced punctuation rules across all user-facing messages:
- **Titles**: No periods at end (e.g., "Directory already exists")
- **Body lines**: Period at end (e.g., "Go to <url> and push this workspace.")
- **Hints**: Period at end (e.g., "(can be disabled any time).")
- Applied consistently across git.ts, clone-template.ts, ab-testing.ts, create-workspace.ts

### Files Modified
- `packages/create-nx-workspace/src/utils/nx/ab-testing.ts` - Cloud variants, recordStat, metadata
- `packages/create-nx-workspace/bin/create-nx-workspace.ts` - recordStat calls, directory parameter
- `packages/create-nx-plugin/bin/create-nx-plugin.ts` - recordStat directory parameter
- `packages/create-nx-workspace/src/utils/git/git.ts` - GitHub push error messages
- `packages/create-nx-workspace/src/utils/template/clone-template.ts` - Directory conflict check (simplified by linter)
- `packages/create-nx-workspace/src/create-workspace.ts` - Git error punctuation

### Technical Patterns
- **Dynamic module loading**: Using `require.resolve('nx/src/nx-cloud/utilities/get-cloud-options', { paths: [directory] })` for workspace-specific nx package access
- **Error message UX**: Hide implementation details, provide actionable guidance, acknowledge failures
- **Metadata simplification**: Single tracking field instead of dual system (code vs metaCode)

### Build Status
✅ All TypeScript compilation passing
✅ All parameter requirements satisfied across call sites
✅ Message punctuation consistency enforced

### Related Tasks
- Main task: `.ai/2025-11-12/tasks/nxc-3464-pr-release-cnw-templates.md` (from TODO.md)
- Branch: NXC-3464
- Status: Implementation feedback incorporated, ready for next review cycle

## Other Tasks

### NXC-3510: Node Executor Port Release Investigation (Completed)
- **Goal**: Create reproduction to verify if Node executor properly releases ports when sending SIGTERM
- **Status**: ✅ Reproduction confirmed, root cause identified, recommendations provided
- **Branch**: NXC-3510 (feature/nxc-3510-node-executor-may-not-release-ports-on-shutdown)
- **Linear**: https://linear.app/nxdev/issue/NXC-3510/node-executor-may-not-release-ports-on-shutdown
- **Plan**: `.ai/2025-11-21/tasks/nxc-3510-node-executor-port-release.md`

#### Key Findings
- ❌ **Bug confirmed**: SIGTERM to Nx process leaves Nest server running and port bound
- **Root cause**: Race condition in shutdown - server becomes orphaned (PPID → 1) when intermediate processes die
- **Files affected**:
  - `packages/js/src/executors/node/node.impl.ts` (signal handlers, stop function)
  - `packages/js/src/executors/node/lib/kill-tree.ts` (killTree implementation)
- **Recommended fix**: Use process groups with `detached: true` and kill entire group with `-pid`

#### Test Results
```
Nx CLI Process (48713) → SIGTERM → Terminated ✓
  └─ Nest Server (48878) → Still Running ✗ → Port 3000 bound ✗

Direct SIGTERM to Server (48878) → Terminated ✓ → Port Released ✓
```

#### Documentation
- Posted detailed reproduction steps and analysis on Linear issue
- Created test workspace: `tmp/claude/node1` with Nest app
- Added process.pid logging to verify behavior
