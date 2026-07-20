# nx.dev Ahrefs SEO errors - analysis + fix plan (2026-07-18)

Source: Ahrefs Site Audit export `~/Downloads/nx_17-jul-2026_all-issues_2026-07-18_12-57-20/` (14 error classes)
+ broken backlinks export `~/Downloads/nx.dev-broken-backlinks-domain_2026-07-18_13-05-54.csv` (1355 rows, 503 unique 404 targets).

All 404s spot-checked live 2026-07-18 - still broken.

## Ownership map

- `astro-docs/` serves `/docs/*`
- `nx-dev/nx-dev` serves only `/ai-chat`, `/api/*`, `/courses/*` (commit 52c3626b67 pared it down)
- Blog, `/changelog`, `/demo`, `/react`, `/java`, `/labs`, `/resources-library` = Framer or nx-blog repo, proxied via `netlify/edge-functions/rewrite-framer-urls.ts`
- Redirects: `nx-dev/nx-dev/_redirects` (Netlify) + `astro-docs/astro.config.mjs` redirects block
- `sitemap-0.xml` (docs) = astro sitemap integration; `sitemap-1.xml` = Framer sitemap proxied via `netlify/edge-functions/additional-sitemaps.ts`

## Fixes in nx repo (astro-docs)

1. **Broken redirect chain**: `_redirects:591` sends `/deprecated/affected-config` -> `/docs/reference/deprecated/affected-config` (404). Real page: `reference/Deprecated/affected-graph.mdoc`. Fix target to `/docs/reference/deprecated/affected-graph`.
2. **Bad link in migration md**: `packages/vite/src/migrations/update-23-0-0/ensure-vitest-package-migration.md:14` links `/technologies/...` without `/docs` prefix -> 404 on generated `/docs/technologies/build-tools/vite/migrations` page.
3. **Broken image refs**:
   - `reference/Benchmarks/tsc-batch-mode.mdoc:7` -> `/img/ts-benchmark.gif` (asset in `astro-docs/public/img/` but served under `/docs/img/` due to base path).
   - `guides/Nx Cloud/record-commands.mdoc:23` hardcodes dead `https://nx.dev/nx-cloud/set-up/record-format-check.webp`; asset exists at `src/assets/nx-cloud/set-up/record-format-check.webp` - use relative ref.
4. **Sitemap junk (docs)**: `@astrojs/sitemap` in `astro.config.mjs:~180` has no `filter` -> emits noindexed `/docs/reference/powerpack-license` + 301'd URLs (`/docs`, 3 tutorial URLs, `/docs/getting-started/nx-cloud`). Add filter. Also de-dup case-variant dirs `getting-started/Tutorials/` vs `tutorials/` (same slugs built twice).
5. **Orphan docs pages** (no internal inlinks): `/docs/quickstart`, `/docs/troubleshooting`, all `/docs/technologies/*/migrations` (technologies sidebar in `sidebar-reference-updater.middleware.ts` links overview/generators/executors but not migrations).

## Fixes in nx repo (nx-dev)

6. **Course images 404**: `courses-content/pnpm-nx-next/lessons/*.md` reference `/courses/pnpm-nx-next/images/*` and `/documentation/courses/...`; actual files at `courses-content/pnpm-nx-next/images/` not served. Add copy-to-public step or rewrite.
7. **Orphan**: `/courses/epic-nx-release` - no inlinks.

## Fixes in nx-blog repo

8. Blog `storybook-interaction-tests-in-nx`: root-relative link `/technologies/test-tools/storybook/recipes/storybook-interaction-tests` -> resolves under /blog/ -> 404. Should be `/docs/technologies/test-tools/storybook/guides/storybook-interaction-tests`.
9. Blog `react-enterprise-book` links dead `/resources-library`.
10. Blog `nx-cloud-pipelines-come-to-nx-console` image `/shared/images/nx-console/nx-console-screenshot.webp` dead.
11. Blog `nx-highlights-2024` image `/courses/pnpm-nx-next/images/e2e-splitting-anim.gif` dead.
12. 3 posts link `http://go.nx.dev/office-hours` (http not https): nx-mcp-vscode-copilot, custom-runners-and-self-hosted-caching, nx-made-cursor-smarter.
13. **Large blog images**: 16 images >1MB (62.7MB total), worst `blog/images/2022-01-25/81krRElSXV5w2T54DiCBAA.avif` = 22MB. No optimization pipeline for blog images. Also `meta-harness-framework-wars-banner.png` (2.8MB) has 209 inlinks.
14. `/changelog` page links dead `/docs/reference/core-api/nx/documents/release`.

## Fixes on Framer (marketing)

15. `/demo` links dead `/labs`; `/demo` also in sitemap while canonicalizing to `/contact/sales`.
16. Framer sitemap (proxied as sitemap-1.xml) contains `/404` and `/api/banners`. Either fix in Framer or filter in `netlify/edge-functions/additional-sitemaps.ts`.
17. Orphans: `/react` (1517 organic/mo!), `/java` - in sitemap, zero internal links. Add nav/footer links.

## Broken backlinks (redirects in `nx-dev/nx-dev/_redirects`)

503 unique 404 targets, 1355 referring pages. High-value (referring page traffic > 50):

| Dead URL | Ref traffic | Notable referrer | Suggested target (verified 200) |
|---|---|---|---|
| `/storybook/overview-react` | 23,475 | storybook.js.org homepage DR91 | `/docs/technologies/test-tools/storybook` |
| `/ci/features/self-healing` | 21,554 | github.com/nrwl/nx (our own README!) | `/docs/features/ci-features/self-healing-ci` |
| `/angular/getting-started/what-is-nx` | 1,713 | theworkshop.com | `/docs/getting-started/intro` |
| `/deprecated/as-provided-vs-derived` | 527 | velog.io DR77 | `/docs/reference/deprecated/as-provided-vs-derived` |
| `/web` | 297 | stackoverflow DR92 | `/docs` |
| `/latest/angular/*` (6 URLs) | ~227 ea | thisdot.co DR68 | `/docs/getting-started/intro` + per-page |
| `/tutorial/01-create-application` | 193 | github.com/nrwl/nx-examples | `/docs/getting-started/intro` |
| `/latest/core-concepts/computation-caching` | 193 | nrwl/nx-examples | `/docs/features/cache-task-results` |
| `/deprecated/integrated-vs-package-based` | 163 | earthly.dev DR67 | `/docs/reference/deprecated/integrated-vs-package-based` |
| `/latest/angular/cli/overview` + `/l/a/tutorial/01-...` | 157 | stackoverflow DR92 | `/docs/getting-started/intro` |
| `/cypress/overview` | 87 | docs.cypress.io DR82 | `/docs/technologies/test-tools/cypress` |
| `/nx/reset` | 86 | stackoverflow DR92 | `/docs/reference/nx-commands` |
| `/core-concepts/computation-caching` | 86 | stackoverflow DR92 | `/docs/features/cache-task-results` |
| `/angular-tutorial/1-code-generation` | 63 | stories.fylehq.com | `/docs/getting-started/intro` |
| `/deprecated/rescope` | 59 | medium DR94 | `/docs/reference/deprecated/rescope` |

High-ref-count (low traffic but many links): `/angular` (76 refs), `/conf` (37), `/react-tutorial/1-code-generation` (34), `/nx-community` (24), `/nx-console` (23).

Also: fix `nrwl/nx` README self-healing link directly at source.

## Priority

- P1: backlink redirects table above (external link equity, DR91-97 referrers); `_redirects` fix for affected-config; nrwl/nx README link.
- P2: sitemap filter + noindex/301 cleanup (astro-docs); broken images/links in docs; blog broken links.
- P3: orphans, image size pipeline, http->https blog links, Framer items.

## Ahrefs note

`/docs/concepts/decisions/why-monorepos` 301s to `what-is-a-monorepo` and gets 1,178 organic/mo - fine (redirect works), just noise until Google re-indexes.
