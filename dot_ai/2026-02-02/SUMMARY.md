# Summary - 2026-02-02

## Completed

### NXC-3806: Nx Worktree Cache Sharing

**Linear:** https://linear.app/nxdev/issue/NXC-3806
**Commit:** `36466fb1b0` - feat(core): share cache between git worktrees
**Branch:** NXC-3806

Implemented automatic cache sharing between git worktrees of the same repository. Worktrees now use the main repository's `.nx/cache` instead of maintaining separate caches.

**Key Implementation:**
- Detect worktrees by checking if `.git` is a file (not directory)
- Resolve main repo path via `git rev-parse --git-common-dir`
- Share cache files AND cache database between worktrees
- Keep daemon state (`workspace-data`) per-workspace to avoid output hash tracking conflicts

**Files Modified:**
- `packages/nx/src/utils/cache-directory.ts` - Worktree detection and cache path resolution
- `packages/nx/src/tasks-runner/cache.ts` - Cache DB moved to shared cache directory
- `packages/nx/src/utils/cache-directory.spec.ts` - 11 unit tests (all passing)

**Key Findings During Implementation:**
1. Cache uses SQLite database, not just filesystem - original spec only addressed file-based cache
2. Database was in `workspaceDataDirectory`, separate from cache files
3. Sharing workspace-data (daemon) broke output detection because daemon tracks output hashes in memory
4. Moving DB to cache directory caused FK constraint error with `task_details` table
5. Fixed by disabling `link_task_details` in NxCache constructor

**Documentation:** `.ai/2026-02-02/tasks/worktree-cache-sharing.md` (updated with findings)

### DOC-395: Server-Side Page View Tracking

**Linear:** https://linear.app/nxdev/issue/DOC-395
**PR #1:** https://github.com/nrwl/nx/pull/34283 (merged)
**PR #2:** https://github.com/nrwl/nx/pull/34286 (follow-up fixes)
**Branch:** DOC-395-excludepath-fix

Implemented server-side page view tracking for Nx documentation HTML pages to compare with markdown/LLM traffic.

**Initial Implementation (PR #34283):**
- Created `track-page-requests.ts` edge function for HTML pages on `/docs/*`
- Uses `server_page_view` event name to differentiate from client-side tracking
- Filters by Accept header to only track HTML requests
- Tracks AI tool detection via user-agent patterns

**Follow-up Fixes (PR #34286):**
1. **Fixed double-counting in track-asset-requests.ts**
   - Simplified path patterns from `['/*.txt', '/**/*.txt', '/*.md', '/**/*.md']` to `['/**/*.txt', '/**/*.md']`
   - The `/**/*` pattern already matches root level, so `/*` was redundant

2. **Added comprehensive excludedPath to track-page-requests.ts**
   - Images: `.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.ico`, `/images/*`, `/og/*`
   - Fonts: `/fonts/*`, `.woff`, `.woff2`
   - Search: `/pagefind/*`
   - Astro build assets: `/_*`

**Files Modified:**
- `astro-docs/netlify/edge-functions/track-page-requests.ts` - New HTML page tracking
- `astro-docs/netlify/edge-functions/track-asset-requests.ts` - Fixed double-counting

**Plan:** `.ai/2026-02-02/tasks/DOC-395-server-page-tracking.md`

## Files Created/Modified

| File | Purpose |
|------|---------|
| `.ai/2026-02-02/tasks/worktree-cache-sharing.md` | Updated spec with implementation findings |
| `.ai/2026-02-02/tasks/DOC-395-server-page-tracking.md` | Server-side page tracking plan |
| `.ai/2026-02-02/tasks/nxc-3806-poc/` | PoC files from initial investigation |
