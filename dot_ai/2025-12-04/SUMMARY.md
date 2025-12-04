# Summary - December 4, 2025

## Completed

### CLOUD-3976: Fix CNW Missing Repository Name in Nx Cloud Onboarding URL

**Linear Issue**: https://linear.app/nxdev/issue/CLOUD-3976/for-cnw-gh-flow-nx-cloud-should-detect-the-repo-automatically

#### Problem
When running `create-nx-workspace` with GitHub push flow, the Nx Cloud onboarding URL was missing the repository name. This caused Nx Cloud to not auto-detect the repo when users clicked the connect link.

**Root Cause (Two Issues):**
1. **Timing issue**: `createNxCloudOnboardingUrl()` was called before `pushToGitHub()`, but `getVcsRemoteInfo()` needs the git remote to exist
2. **Directory issue**: `getVcsRemoteInfo()` ran `git remote -v` without a `cwd` parameter, so it executed in `process.cwd()` instead of the new workspace directory

This worked fine for `nx init` and `nx connect` because those run from inside existing workspaces with git remotes already configured.

#### Solution
1. **Reordered operations** - `createNxCloudOnboardingUrl()` now runs after `pushToGitHub()` completes
2. **Added `directory` parameter** - `getVcsRemoteInfo(directory?)` and `createNxCloudOnboardingURL(..., directory?)` now accept an optional directory so CNW can pass the workspace path
3. **Removed `connectUrl` from commit message** - No longer passing it to `initializeGitRepo()` since URL is created after git operations

#### Files Changed
- `packages/create-nx-workspace/src/create-workspace.ts` - Reorder URL creation after git push
- `packages/create-nx-workspace/src/utils/nx/nx-cloud.ts` - Pass directory to URL function
- `packages/nx/src/nx-cloud/utilities/url-shorten.ts` - Accept directory parameter
- `packages/nx/src/utils/git-utils.ts` - Add `cwd: directory` to `execSync` call

**Branch:** feat/cnw-sigint
**Commit:** `71197e8495` - `fix(core): ensure CNW detects git remote for Nx Cloud onboarding URL`

---

### DOC-314: Global Cmd+K Search Shortcut for Non-Docs Pages

**Linear Issue**: https://linear.app/nxdev/issue/DOC-314/show-docs-search-on-non-docs-pages

Implemented a Cmd+K / Ctrl+K keyboard shortcut that works on non-docs pages and opens the Pagefind search modal on the docs site.

**Key Changes:**
- Created `GlobalSearchHandler` React component in `nx-dev/ui-common/src/lib/global-search-handler.tsx`
  - Listens for Cmd+K / Ctrl+K on non-docs pages
  - Sets sessionStorage timestamp and redirects to `/docs/getting-started/intro`
  - Uses `window.location.assign()` for clean navigation with history preservation

- Updated `astro-docs/public/global-scripts.js`
  - Reads sessionStorage on page load
  - Opens search modal if timestamp exists and is within 30-second expiry
  - Focuses the search input after modal opens

- Integrated handler in both Next.js routing systems:
  - `nx-dev/nx-dev/pages/_app.tsx` (Pages Router)
  - `nx-dev/nx-dev/app/layout.tsx` (App Router)

**Implementation Details:**
- Uses sessionStorage with 30-second expiry for cross-page communication
- Browser history preserved (back button works)
- Search input auto-focuses after modal opens

**Branch:** DOC-314
**Commit:** `feat(misc): add global Cmd+K search shortcut for non-docs pages`

---

### DOC-349: Set Up Framer Rewrite on canary.nx.dev

**Linear Issue**: https://linear.app/nxdev/issue/DOC-349/set-up-rewrite-on-canarynxdev
**PR**: https://github.com/nrwl/nx/pull/33677

#### Problem
Need to enable Framer pages to be served from nx.dev domain. This allows marketing pages to be built in Framer while being accessible from the main domain (e.g., `/ai`, `/pricing`).

#### Challenge
Next.js rewrites only work for routes that don't already exist in the Next.js app. Since pages like `/ai` already exist, rewrites don't apply—Next.js serves its own page instead.

#### Solution
Implemented server-side proxying via `getServerSideProps`:

1. **Created `nx-dev/nx-dev/lib/framer-proxy.ts`** - Shared utility that:
   - Parses `NEXT_PUBLIC_FRAMER_URL` and `NEXT_PUBLIC_FRAMER_REWRITES` env vars once at module load
   - Exports `tryFramerProxy()` function to check if current path should proxy to Framer
   - Fetches HTML from Framer and writes directly to response with 1-hour cache

2. **Updated all pages** to use the utility via `getServerSideProps`:
   - 27 files modified across `pages/**/*.tsx`
   - Converted `getStaticProps` pages to `getServerSideProps` where needed

#### Usage
```bash
# Enable Framer proxy for /ai and /pricing pages
NEXT_PUBLIC_FRAMER_URL=https://example-framer.com \
NEXT_PUBLIC_FRAMER_REWRITES=/ai,/pricing \
nx serve-docs nx-dev
```

#### Files Changed
- `nx-dev/nx-dev/lib/framer-proxy.ts` (NEW)
- `nx-dev/nx-dev/pages/*.tsx` (22 files)
- `nx-dev/nx-dev/pages/advent-of-code/index.tsx`
- `nx-dev/nx-dev/pages/ai-chat/index.tsx`
- `nx-dev/nx-dev/pages/contact/*.tsx` (4 files)
- `nx-dev/nx-dev/pages/enterprise/*.tsx` (3 files)
- `nx-dev/nx-dev/pages/nx-cloud/index.tsx`
- `nx-dev/nx-dev/pages/solutions/*.tsx` (4 files)
- `nx-dev/nx-dev/pages/resources-library/index.tsx`

---

### DOC-360: Dynamic Banner JSON from URL for astro-docs and nx-dev

Implemented a system to fetch banner configuration from a remote URL for both astro-docs and nx-dev sites.

**Key Changes:**
- Created shared banner types and utilities in `nx-dev/ui-common/src/lib/banner/`:
  - `banner.types.ts` - TypeScript types for `BannerConfig`, `BannerNotification`, `BannerLink`
  - `use-banner-config.ts` - React hook to fetch banner config from URL
  - `dynamic-banner.tsx` - Floating popup banner component that consumes remote config
  - `index.ts` - Barrel export

- Updated astro-docs:
  - `PageFrame.astro` - Uses `DynamicBanner` component with `BANNER_URL` env var
  - Changed imports to use deep paths instead of barrel exports to avoid `process is not defined` error during hydration
  - Left `banner.middleware.ts` unchanged (only reads from local `notifications.json` for Starlight top banner)

- Updated nx-dev:
  - `app/layout.tsx` and `pages/_app.tsx` - Uses `DynamicBanner` with `NEXT_PUBLIC_BANNER_URL`

**Environment Variables:**
- `BANNER_URL` - For astro-docs (server-side, passed as prop to client component)
- `NEXT_PUBLIC_BANNER_URL` - For nx-dev (client-side)

**Banner JSON Schema:**
```json
{
  "notifications": [{
    "id": "unique-id",
    "title": "Event Title",
    "description": "Event description",
    "date": "2024-10-07",
    "type": "webinar" | "event" | "release",
    "status": "upcoming" | "live" | "past",
    "url": "https://example.com/register",
    "ctaText": "Register Now",
    "links": [{ "label": "Discord", "url": "...", "icon": "chat" }],
    "enabled": true
  }]
}
```

**Bug Fixes During Implementation:**
1. Fixed date filtering logic - now trusts `status` field instead of requiring future dates
2. Fixed `process is not defined` error by using deep imports in Astro components
3. Removed Starlight top banner (only kept floating popup banner per user preference)

**Branch:** DOC-360
**Commit:** `feat(misc): consume banner JSON from URL for astro-docs and nx-dev`
