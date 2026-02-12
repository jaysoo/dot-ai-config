# Summary - 2026-02-11

## Completed

### NXC-3898: Clarify Security Email Usage in SECURITY.md

- **Linear:** https://linear.app/nxdev/issue/NXC-3898
- **PR:** https://github.com/nrwl/nx/pull/34411

Updated SECURITY.md to clarify that the security email is for demonstrable, verified vulnerabilities within the Nx codebase itself.

**Changes:**

- Added "What Should Be Reported" section
- Clarified that security email should NOT be used for:
  - Reports about outdated dependencies
  - Dependencies with CVEs that don't directly affect Nx
  - General vulnerability scanner output
- Added link to GitHub issues for outdated dependency concerns

### CLOUD-4246: Add Confirmation Dialog for Access Control Settings

- **Linear:** https://linear.app/nxdev/issue/CLOUD-4246
- **PR:** https://github.com/nrwl/ocean/pull/9985
- **CI:** https://snapshot.nx.app/cipes/698ba2d52ce2bd86dd1e2082

Implemented modal confirmation dialogs for access control settings to prevent accidental changes from trackpad gestures or misclicks.

**Changes:**
- Created `ChangeAccessLevelConfirmationDialog` component using existing `ConfirmationDialog` with `variant="blue"`
- Replaced inline "Save changes" / "Cancel" buttons with immediate confirmation modal on radio selection change
- Updated both `workspace-id-access-level.tsx` and `workspace-pat-access-level.tsx`
- Updated e2e tests in `access-control.spec.ts` (3 test locations)
- Added version plan for changelog

**Behavior:**
- Clicking a different radio option immediately shows confirmation modal
- Radio selection doesn't change until user confirms in dialog
- Existing `EnableNxReplayConfirmationDialog` (NO_CACHE → enabled) still takes precedence

**Status:** Merged (2026-02-10)

### CLOUD-3924: Show Cache Origin on Compare Tasks Without Comparison Selection

- **Linear**: https://linear.app/nxdev/issue/CLOUD-3924
- **PR**: https://github.com/nrwl/ocean/pull/9992 (merged)
- **Branch**: `CLOUD-3924`
- **Commit**: `cf26010355`

**Issue**: The "Compare Tasks" page's "Investigate" section didn't show the "Originated from: Run XXXX" link unless the user clicked "Check for task" to select a comparison task. This made it difficult for DPE/customers to quickly identify where a remote cache hit originated from.

**Root Cause**: In `compare-tasks-loader.server.ts`, the `getCacheCreationRun` calls were wrapped in a condition requiring BOTH `baseTask` AND `comparorTask` to exist.

**Fix**: Changed to fetch cache origin independently for each task based only on their own `remote-cache-hit` status.

**Files Changed**:
- `libs/nx-cloud/feature-compare-tasks/src/lib/compare-tasks-loader.server.ts` - Fixed conditional logic
- `apps/nx-cloud-e2e-playwright/e2e/tasks/compare-tasks.spec.ts` - Added E2E test

**Verification**: Manually verified on local dev server with staging data - task with `remote-cache-hit` now shows "Originated from" link immediately.

**Note**: The "Originated from" feature requires a previous run with the same `taskId` and `projectName` that had `cache-miss` status. If no cache origin exists in the database, the link won't appear.
