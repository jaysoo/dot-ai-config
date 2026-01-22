# Summary - 2026-01-14

## CLAUDE.md: Auto-load Architecture Files

Updated `dot_claude/CLAUDE.md` to instruct Claude Code to automatically load architecture context files when working in key repositories.

**Changes:**
- Added "Architecture Context Loading (AUTO-LOAD ON START)" section to Critical Setup
- Claude now checks for `.ai/para/resources/architectures/<repo>-architecture.md` when starting work
- Hardcoded table for known repos: nx, ocean, console, nx-labs
- Also searches dynamically for any `<repo>-architecture.md` file

**Files changed:**
- `dot_claude/CLAUDE.md`

---

## DOC-376: GA Scroll Depth Tracking for Marketing Pages

**Linear:** https://linear.app/nxdev/issue/DOC-376

Added Google Analytics scroll depth tracking to the homepage and marketing pages in nx-dev. Previously, only docs pages had this tracking via a container div scroll listener, but marketing pages scroll via the window and had no tracking.

**Implementation:**
- Created `useWindowScrollDepth` hook in `@nx/nx-dev-feature-analytics`
- Hook listens to window scroll events (throttled via `requestAnimationFrame`)
- Calculates scroll percentage and fires `scroll_0`, `scroll_25`, `scroll_50`, `scroll_75`, `scroll_90` events
- Only fires when depth increases (not on scroll back up)
- Resets on route change
- Called directly in `DefaultLayout` component

**Files changed:**
- `nx-dev/feature-analytics/src/lib/use-window-scroll-depth.ts` (new)
- `nx-dev/feature-analytics/src/index.ts` (added export)
- `nx-dev/ui-common/src/lib/default-layout.tsx` (added `'use client'` and hook call)

**Pages affected:** All pages using `DefaultLayout` including `/`, `/react`, `/java`, `/angular`, etc.

**Commit:** `897b528155` - feat(nx-dev): add scroll depth tracking for marketing pages

---

## NXC-3628: Remove Cloud Prompt from CNW for Variant 1

**Linear:** https://linear.app/nxdev/issue/NXC-3628
**Branch:** NXC-3628

Implemented A/B testing variant 1 for Create Nx Workspace (CNW) that removes the cloud prompt and always shows the platform link.

**Behavior Changes:**
- **Variant 0** (unchanged): Shows cloud prompt, connects to cloud, generates URL with token
- **Variant 1** (new):
  - Skips "Try the full Nx platform?" prompt → `nxCloud = 'yes'` automatically
  - Skips `connectToNxCloudForTemplate()` → no `nxCloudId` in nx.json
  - Skips `readNxCloudToken()` → no misleading "Checking Nx Cloud setup" spinner
  - Generates URL using GitHub flow (`accessToken: null`)
  - Shows `(https://github.com/new)` link in completion message when user hasn't pushed

**Bug Fixes:**
- Fixed expired cache file bug in ab-testing.ts where after 1-week expiry, every run would do 50-50 instead of locking to a new variant. Now expired files are deleted with `unlinkSync()`.
- Added `variant-0` or `variant-1` to the short URL meta property for cloud analytics tracking.

**Files changed:**
- `packages/create-nx-workspace/src/utils/git/git.ts` - Added `isGhCliAvailable()` function
- `packages/create-nx-workspace/bin/create-nx-workspace.ts` - Variant 1 conditional logic, GH tracking
- `packages/create-nx-workspace/src/utils/nx/ab-testing.ts` - Added `ghAvailable` to telemetry, fixed expired cache bug
- `packages/create-nx-workspace/src/create-workspace.ts` - Skip cloud connection for variant 1
- `packages/create-nx-workspace/src/create-workspace-options.ts` - Added `skipCloudConnect`, `ghAvailable` options
- `packages/create-nx-workspace/src/utils/nx/nx-cloud.ts` - Made `token` parameter optional
- `packages/create-nx-workspace/src/utils/nx/messages.ts` - Added github.com/new link to push message
- `packages/create-nx-workspace/src/utils/nx/messages.spec.ts` - Updated 8 snapshots
