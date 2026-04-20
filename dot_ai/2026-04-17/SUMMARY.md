# Summary — 2026-04-17

## DOC-478: Clean up nx-dev to ai-chat, api, courses only

**PR**: https://github.com/nrwl/nx/pull/35315

Massively stripped `nx-dev` from a monolithic Next.js app down to just four routes:
- `/ai-chat` — AI chat UI
- `/api/query-ai-handler` — streaming chat endpoint
- `/api/query-ai-embeddings` — doc-search endpoint (MCP tool backend)
- `/courses` — video courses landing, detail, and lesson pages

### Key changes

1. **Deleted pages/routes**: blog, podcast, pricing, changelog, resources-library, whitepaper, brands, and all other non-essential pages.

2. **Deleted nx-dev/* libraries** no longer reachable: `feature-feedback`, `ui-podcast`, `ui-pricing`, `ui-resources`, `ui-video-courses` (then restored `ui-video-courses` for courses).

3. **Simplified feature-ai**: removed deps on `feature-analytics`, `ui-common`, and `ui-markdoc`. Built a minimal inline markdown renderer using `@markdoc/markdoc` core. Replaced `Button` from `ui-common` with plain `<button>` elements.

4. **Simplified app chrome**: `_app.tsx` stripped of GTM, banners, GlobalSearchHandler, FrontendObservability. `/ai-chat` has a minimal inline header (logo + "Back to Docs" link). `app/layout.tsx` (for courses) simplified similarly.

5. **Moved docs/courses → nx-dev/nx-dev/courses-content/**: Updated `CoursesApi` to accept configurable `authorsPath`. Copied Juri's author image to `nx-dev/nx-dev/public/images/authors/`.

6. **Deleted top-level `docs/` folder** (~333MB, ~2000 files): Blog posts, changelog, shared docs, nx-cloud docs — all stale content already in astro-docs or nx-blog repo.

7. **Updated consumers of `docs/`**:
   - Removed `blog-description` + `blog-cover-image` conformance rules from `nx.json` and `tools/workspace-plugin/`
   - Removed `scripts/documentation/{map-link-checker,internal-link-checker}.ts`
   - Removed `check-documentation-map` npm script
   - Removed `validateCrossSiteLinks` from `astro-docs/validate-links.ts`
   - Updated `create-embeddings` tsconfig and default mode to `astro`

8. **CI fixes** (two follow-up commits):
   - Restored `scripts/documentation/prebuild-banner.mjs` — was also used by `astro-docs:prebuild-banner` target
   - Removed unused `js-yaml` from `tools/workspace-plugin/package.json` — lockfile mismatch broke frozen-lockfile install on Netlify

### Build verification
- `nx build nx-dev` ✅ — all 4 routes generated
- `nx build astro-docs` ✅ — 744 pages built locally
- Net: **~148,000 lines deleted** across 2010 files
