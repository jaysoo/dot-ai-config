# 2026-02-19 Summary

## Completed

### Fix #32880: Next.js Jest Tests Don't Exit Through Nx

- **PR**: https://github.com/nrwl/nx/pull/34518
- **Issue**: https://github.com/nrwl/nx/issues/32880
- **Root Cause**: When `nx test` runs Jest for Next.js apps, `next/jest` loads `next.config.js` which calls `withNx`. Because Nx sets `NX_TASK_TARGET_TARGET`, `withNx` enters a code path that calls `createProjectGraphAsync()` — this opens a Unix socket to the Nx daemon. The socket is never closed, keeping the Node.js event loop alive and preventing Jest from exiting.
- **Fix**: One-line change in `packages/next/plugins/with-nx.ts` — pass `resetDaemonClient: true` to `createProjectGraphAsync()` so the daemon socket is closed after fetching the project graph.
- **Verification**: Reproduced in fresh workspace (`/tmp/claude/repro-32880/next-ws`), confirmed fix works, confirmed non-Next.js projects unaffected, all `next` package tests/build/lint pass.
- **File**: `.ai/2026-02-19/tasks/issue-32880-jest-not-exiting.md`

### DOC-406: Dedupe Content & Style Guide Fixes for Getting Started / How Nx Works

- **Branch**: `DOC-406` (2 commits, ready for PR)
- **Commit 1** (`f28fa6b7cb`): Content deduplication
  - Trimmed `mental-model.mdoc` caching section from ~70 lines to ~11 lines (removed verbatim-duplicated content already covered in `how-caching-works.mdoc`)
  - Trimmed `mental-model.mdoc` DTE section from ~20 lines to ~3 lines (deferred to feature page)
  - Added cross-reference links for `affected`, `remote cache`, `computation caching`, `task pipeline configuration`
  - Consolidated `remote-cache.mdoc` intro to avoid re-explaining local caching
  - Added missing `project graph` link in `self-healing-ci.mdoc`
  - Shortened conformance intro in `publish-conformance-rules-to-nx-cloud.mdoc`
  - Shortened inferred tasks re-explanation in `maintain-typescript-monorepos.mdoc`
- **Commit 2** (`72f5604dab`): Style guide compliance + initial `STYLE_GUIDE.md`
  - Created `astro-docs/STYLE_GUIDE.md` with rules for anti-AI patterns, trust-undermining words, product possessives, capitalization
  - Fixed 18+ violations across 10 pages in Getting Started and How Nx Works sections
- **Reverted**: Initially created `ConnectToCloud.astro` and `ViewInferredTasks.astro` Markdoc components, but reverted both — custom tags are opaque to AI agents consuming raw markdown
- **File**: `.ai/2026-02-19/tasks/doc-406-dedupe-getting-started.md`
