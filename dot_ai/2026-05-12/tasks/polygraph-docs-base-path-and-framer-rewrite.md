# Polygraph docs: move under `/docs` + Framer edge rewrite

**Date:** 2026-05-12
**Repos:** `nrwl/polygraph-docs` (+ inspected `nrwl/nx` for the source pattern)
**Polygraph session:** https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/polygraph-docs-marketing-pages-b439ced6
**PR:** https://github.com/nrwl/polygraph-docs/pull/4 (draft)
**Branch:** `feat/docs-base-path-framer-rewrite`

## Goal

trypolygraph.com currently serves the Astro Starlight docs at the root. We want `/` to serve the Framer marketing homepage (`https://active-startup-540669.framer.app/`) and put all docs under `/docs/...`. Port the pattern from `nrwl/nx`'s `astro-docs` + `netlify/edge-functions/rewrite-framer-urls.ts`.

## Approach

Cross-repo Polygraph session. Two read-only investigation child agents in parallel (one in `nrwl/nx` to extract the patterns verbatim, one in `nrwl/polygraph-docs` to inventory current state + identify breakage), then one implementation child in polygraph-docs.

## Final shape

1. `astro.config.mjs`:
   - `base: '/docs'`
   - `outDir: 'dist/docs'`
   - `site: 'https://trypolygraph.com'`
   - default `build.format: 'directory'` (kept; the `'file'` workaround was reverted)
2. `netlify.toml`:
   - `publish = "dist/docs"` (matches nx pattern — Netlify serves the docs tree from `dist/docs/` so the trailing-slash redirect on directory routes doesn't fire)
   - One rewrite: `[[redirects]] from = "/docs/*" to = "/:splat" status = 200`
3. `netlify/edge-functions/rewrite-framer-urls.ts` (new): simplified port of nx's edge function.
   - HTML-only (`accept: ['text/html']`)
   - `FRAMER_URL` env (default `https://active-startup-540669.framer.app`)
   - Streaming-rewrites framer origin → `CANONICAL_URL` (default `https://trypolygraph.com`)
   - `excludedPath` covers `/docs`, `/docs/*`, well-known files, asset dirs
   - Bot-probe regex returns 404 immediately
4. Content fix: 26 root-relative links in 3 `.mdoc` files re-prefixed with `/docs`. Starlight does not auto-prefix Markdown link paths inside content.
5. `src/pages/{robots,llms,llms-full}.txt.ts`: URL builders now include `import.meta.env.BASE_URL` so emitted URLs are `https://trypolygraph.com/docs/...`.

## Iteration history (3 commits on the branch)

1. `0e6bf54` — initial port: `base: '/docs'` + outDir + edge function + 6 well-known-path rewrites + content link prefixing + page URL builders. Deploy preview 301'd no-slash URLs to slash URLs because Netlify normalizes directory routes by default.
2. `d19d521` — tried `build.format: 'file'`. Fixed child pages but introduced regressions: Starlight bakes `.html` into sidebar links AND `<link rel="canonical">`. Bad for SEO.
3. `d086def` — reverted `build.format: 'file'`, switched to nx's exact pattern (`publish = "dist/docs"` + `/docs/* → /:splat` rewrite). Clean canonical URLs, no `.html` in sidebar, no trailing-slash redirect.

## Gotchas

- `outDir` is required when `base` is set. Astro's `base` only rewrites URLs in HTML; it does not relocate output files. Without `outDir: 'dist/docs'`, files land at `dist/...` but reference assets at `/docs/_astro/...` → 404.
- `trailingSlash: 'never'` only affects link generation, not on-disk layout. Netlify's directory-route 301 still fires unless the rewrite changes the request shape.
- `build.format: 'file'` is a trap. Solves trailing-slash visually but baked `.html` into canonical/og URLs.
- Edge function `accept: ['text/html']` filter saves compute on assets but doesn't bypass for `*/*` Accept headers — `excludedPath` is still needed for well-known files like `/robots.txt`, `/sitemap.xml`, `/llms.txt`.
- Streaming rewrite hardcodes `trypolygraph.com` as the canonical replacement. On Netlify deploy previews this means links in proxied Framer HTML point to production, not the preview. Acceptable trade-off; can be made preview-aware later via `context.site.url`.

## Side fix

Pre-push commitlint hook in `polygraph-docs/.husky/pre-push` has a bug: when branch has ≤20 commits and `origin/HEAD` is unset, the fallback path runs `git rev-parse <sha>~20 2>/dev/null || git rev-list ...` — the failing rev-parse prints its literal arg to stdout (stderr is swallowed), and `||` concatenates that with the rev-list output, producing a newline-joined `$from` value that crashes `commitlint`. Worked around with `git remote set-head origin main` locally to take the merge-base branch instead. Real fix needs a `|| from=""` on the rev-parse line. Flagged in the PR body.
