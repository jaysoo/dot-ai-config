# 2026-04-21 Summary

## DOC-486: Blog sitemap in root nx.dev sitemap index

Shipped both sides of the sitemap wiring so nx-blog posts are advertised through the root nx.dev sitemap.

### nx repo (branch `DOC-486`, commit `c0085fcebb`)

- New consolidated edge function `netlify/edge-functions/additional-sitemaps.ts` mapped to `/sitemap-1.xml` (Framer) and `/sitemap-2.xml` (nx-blog), rewriting upstream origins → `https://nx.dev`. Replaces `framer-sitemap.ts` (and an initial `blog-sitemap.ts`) with one table-driven proxy whose name matches `additionalSitemaps` in `next-sitemap.config.js`.
- `scripts/patch-sitemap-index.mjs` now includes `/sitemap-2.xml` alongside `/sitemap-1.xml` and `/docs/sitemap-index.xml`.
- Docs updated: `netlify/edge-functions/README.md`, `nx-dev/nx-dev/DEPLOYMENT.md`.

### nx-blog repo (branch `feature/doc-486-publish-sitemap`, commit `09531fd`)

- New `blog/scripts/generate-sitemap.mjs` reads `src/content/blog/*.mdoc` (respecting `published: false` / `draft`) and `src/content/changelog/*.mdoc`; writes `dist/client/blog/sitemap.xml` (196 URLs on first run, valid XML).
- Full build refactor into Nx targets:
  - `scripts` pared to `dev`, `build`, `preview` (removed `start`).
  - All build steps are `nx:run-commands` targets with explicit `cwd`, `inputs`, `outputs`, and `cache` flags: `generate-banner` (renamed from `prebuild`), `optimize-images`, `vite-build`, `generate-feeds`, `generate-sitemap`, `pagefind`.
  - `build` is `nx:noop` fanning out to `generate-feeds`, `generate-sitemap`, `pagefind` (all depend on `vite-build` — parallel after that).
  - Warm build restores 5/8 tasks from cache.

### E2E flow (pending deploy)

1. nx-blog build emits `dist/client/blog/sitemap.xml` → served at `<BLOG_URL>/blog/sitemap.xml`.
2. nx.dev edge function proxies it at `/sitemap-2.xml`, rewriting URLs.
3. Root `sitemap.xml` index references `/sitemap-2.xml`.

Task file: `.ai/2026-04-21/tasks/doc-486-blog-sitemap.md`.
