---
name: DOC-486 Blog sitemap
description: Add nx-blog sitemap to root nx.dev sitemap index + Nx-ify nx-blog build
type: project
---

# DOC-486: Sitemap needs to include blog

**Linear:** https://linear.app/nxdev/issue/DOC-486/sitemap-needs-to-include-blog
**Branches:**
- nx: `DOC-486` (commit `c0085fcebb`)
- nx-blog: `feature/doc-486-publish-sitemap` (commit `09531fd`)

## Problem

Root `nx.dev/sitemap.xml` index referenced only `/sitemap-1.xml` (Framer proxy) and `/docs/sitemap-index.xml` (astro-docs). Blog posts published by nx-blog (standalone site behind `BLOG_URL`) were not advertised to crawlers.

## Solution

### nx repo
- New consolidated edge function `netlify/edge-functions/additional-sitemaps.ts`:
  - `/sitemap-1.xml` → `<NEXT_PUBLIC_FRAMER_URL>/sitemap.xml`
  - `/sitemap-2.xml` → `<BLOG_URL>/blog/sitemap.xml`
  - URLs in upstream XML rewritten from source origin → `https://nx.dev`
- Deleted `framer-sitemap.ts` and the initial `blog-sitemap.ts` in favor of the single function. Naming matches `additionalSitemaps` in `next-sitemap.config.js`.
- Updated `scripts/patch-sitemap-index.mjs` to include `/sitemap-2.xml`.
- Documentation updates in `netlify/edge-functions/README.md` and `nx-dev/nx-dev/DEPLOYMENT.md`.

### nx-blog repo
- New `blog/scripts/generate-sitemap.mjs` — reads `src/content/blog/*.mdoc` (respects `published: false` / `draft`) and `src/content/changelog/*.mdoc`, outputs `dist/client/blog/sitemap.xml` with `/blog`, `/changelog`, and `/blog/<slug>` entries (196 URLs on first run).
- **Build refactor**: moved all scripts into Nx targets.
  - `scripts` pared down to `dev`, `build`, `preview` only (removed `start`).
  - All build-step targets use `nx:run-commands` executor with explicit `cwd: {projectRoot}` and proper `inputs`/`outputs`/`cache` config: `generate-banner` (renamed from `prebuild`), `optimize-images`, `vite-build`, `generate-feeds`, `generate-sitemap`, `pagefind`.
  - `build` is `nx:noop` with `dependsOn: [generate-feeds, generate-sitemap, pagefind]` — the three fan out in parallel after `vite-build`.
  - Cold build: 8 tasks. Warm build: 5/8 cached (generate-banner + 1 noop don't cache).

## E2E flow (after both PRs merge + Netlify redeploy with BLOG_URL set)

1. nx-blog build writes `dist/client/blog/sitemap.xml` → served at `<BLOG_URL>/blog/sitemap.xml`.
2. nx.dev edge function `additional-sitemaps.ts` proxies it at `/sitemap-2.xml`, rewriting `BLOG_URL` → `https://nx.dev`.
3. Root `sitemap.xml` index (patched by `patch-sitemap-index.mjs`) references `/sitemap-2.xml`.

## Status

- [x] nx repo committed (`c0085fcebb`)
- [x] nx-blog committed (`09531fd`, by user)
- [ ] PRs opened
- [ ] Merged + deployed
