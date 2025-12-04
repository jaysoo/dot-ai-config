# Summary - 2025-12-01

## Completed

### DOC-349: Set up Framer rewrite on canary.nx.dev

Implemented Framer page proxying for the nx-dev Next.js application, allowing specific pages to be served from a Framer site instead of the Next.js app.

**Changes:**
- **`nx-dev/nx-dev/next.config.js`**: Added `NEXT_PUBLIC_FRAMER_URL` and `NEXT_PUBLIC_FRAMER_REWRITES` environment variable support for proxying new pages that don't exist in the Next.js app
- **`nx-dev/nx-dev/pages/ai.tsx`**: Added `getServerSideProps` that proxies to Framer when `NEXT_PUBLIC_FRAMER_URL` is set, with 1-hour cache revalidation
- **`nx-dev/nx-dev/project.json`**: Added new env vars as build inputs for cache invalidation

**Key Implementation Details:**
- For existing pages (like `/ai`): Uses `getServerSideProps` to fetch Framer HTML and write directly to response
- For new pages: Uses Next.js rewrites in `next.config.js` (via `NEXT_PUBLIC_FRAMER_REWRITES`)
- Cache-Control header set to revalidate every hour for smooth env var changes

**Usage:**
```bash
NEXT_PUBLIC_FRAMER_URL=https://your-framer-site.com nx serve nx-dev
```

**Commit:** `feat(misc): add Framer rewrite support for nx-dev`
