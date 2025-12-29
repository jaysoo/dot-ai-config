# Summary - December 19, 2025

## Completed Tasks

### DOC-330: Add Netlify Configuration for nx-dev Deployment

**Issue:** nx-dev is deployed only to Vercel. Goal is to migrate to Netlify to consolidate hosting with astro-docs.

**Solution Implemented:**
1. Created `nx-dev/nx-dev/netlify.toml` with Netlify build configuration
2. Build command: `pnpm nx run nx-dev:build`
3. Publish directory: `dist/nx-dev/nx-dev`
4. Added security headers matching existing Next.js configuration
5. Documented migration plan and Netlify UI setup instructions

**Migration Plan:**
1. Deploy nx-dev to Netlify alongside existing Vercel deployment
2. Test and validate Netlify deployment
3. Update DNS to point to Netlify
4. Remove Vercel deployment after 2 weeks

**Files Changed:**
- Added: `nx-dev/nx-dev/netlify.toml` (40 lines)

**Commit:** `75313598d8` - docs(misc): add Netlify configuration for nx-dev deployment

---

### DOC-368: Support .md URLs that Return Raw Markdown

**Issue:** AI agents and tools needed a way to fetch raw markdown content from Nx documentation pages.

**Solution Implemented:**
1. Created `src/pages/[...slug].md.ts` endpoint that generates `.md` URLs returning raw markdown
2. Created `src/pages/llms.txt.ts` dynamic endpoint following the [llms.txt specification](https://llmstxt.org/)
3. Added rewrite in `nx-dev/nx-dev/next.config.js` to proxy `/llms.txt` to Astro

**Features:**
- Append `.md` to any doc URL to get raw markdown (e.g., `/docs/getting-started/intro.md`)
- Supports all content collections: `docs`, `plugin-docs`, `nx-reference-packages`
- Proper URL construction for reference docs based on `packageType` (e.g., `/docs/reference/devkit/...`)
- Dynamic `llms.txt` generation with:
  - Fully qualified URLs using Astro site config
  - Grouped sections (Getting Started, Core Concepts, Features, etc.)
  - Sanitized descriptions (collapsed newlines, truncated to 150 chars)
  - Dedicated Devkit API Reference section with explanatory text

**Files Changed:**
- Added: `astro-docs/src/pages/[...slug].md.ts` (128 lines)
- Added: `astro-docs/src/pages/llms.txt.ts` (197 lines)
- Modified: `nx-dev/nx-dev/next.config.js` (+4 lines for llms.txt rewrite)

**Commit:** `04226e544e` - docs(nx-dev): support .md URLs and llms.txt for AI agents

---

### DOC-372: nx.dev Changelog Page Failing on Prod and Canary

**Issue:** The `/changelog` page was returning 500 errors on production and canary with `ENOENT: no such file or directory, scandir 'public/documentation/changelog'`.

**Root Cause:** Commit `3384b1dc91` (Dec 17) changed the changelog page from `getStaticProps` to `getServerSideProps` to support Framer proxy. This caused:
1. Files read at **request time** instead of **build time**
2. Serverless functions don't have access to `public/documentation/changelog/` (only copied at build time)
3. All pages using the Framer proxy pattern became dynamic, increasing Vercel costs

**Solution Implemented:**
1. Created `middleware.ts` to handle Framer proxy at the edge using `NextResponse.rewrite()`
2. Reverted 25 pages back to static (removed `getServerSideProps` + `tryFramerProxy`)
3. Fixed changelog to use `getStaticProps` (reads files at build time)
4. Deleted `framer-proxy.ts` (no longer needed)

**Benefits:**
- Pages are now static (`○`) instead of dynamic (`ƒ`)
- No serverless function costs for every page request
- Middleware runs at the edge (cheap and fast)
- Framer proxy still works via `NextResponse.rewrite()`

**Files Changed:**
- Added: `nx-dev/nx-dev/middleware.ts`
- Deleted: `nx-dev/nx-dev/lib/framer-proxy.ts`
- Modified: 25 page files reverted to static

**Commit:** `19feb14a80` - fix(nx-dev): use middleware for Framer proxy to keep pages static

## Key Learnings

1. **`getServerSideProps` vs `getStaticProps`**: SSR functions can't access files that are only copied during build
2. **Middleware is better for routing logic**: Use Next.js middleware for conditional routing/rewrites instead of converting pages to SSR
3. **Cost implications**: Converting static pages to SSR increases serverless function invocations on Vercel
