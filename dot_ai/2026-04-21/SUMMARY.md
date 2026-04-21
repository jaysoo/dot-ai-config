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

## NXC-4182: React Router Vite 8 support

`@react-router/dev` 7.14.2 expanded its Vite peer dep to include `^8.0.0`, so all the Vite 7 workarounds across #35101, #35110, and this branch's prior commits are gone.

### PR #35365 (branch `NXC-4182`, squashed commit `4ff192abc7`)

- `reactRouterVersion` bumped ^7.12.0 → ^7.14.2
- New 22.7.0 migration (version tag `22.7.0-beta.16`) pinning all `@react-router/*` packages to `7.14.2`
- Removed `useViteV7: true` force-flag in React app generator's `add-vite.ts`
- Removed dead `useViteV7?: boolean` from `ViteConfigurationGeneratorSchema` (never wired into the configuration generator body)
- Removed the obsolete "should use Vite 7" unit test
- Removed the pre-generate downgrade/`pnpm install` block in `e2e/react/src/react-router-ts-solution.test.ts` (typecheck test already un-skipped in prior branch commit)

Diff: 6 files, +43/-20. Three commits squashed before force-push-with-lease per PR review feedback.

Task file: `.ai/2026-04-21/tasks/nxc-4182-react-router-vite-8.md`.
