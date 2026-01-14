# Summary - 2026-01-14

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
