# DOC-552: Rework the Knowledge Base section

## Status

Implementation complete and validated locally. Changes remain uncommitted and unpushed for review.

Keep implementation progress in this document. Update the TODOs as each step is completed.

## Goal

Rework the nx.dev Knowledge Base so KB content has a clear source location and canonical `/docs/kb/...` URLs, no longer depends on the current KB sidebar hierarchy, carries explicit tag metadata, and preserves SEO through permanent redirects.

## Source

- Linear: https://linear.app/nxdev/issue/DOC-552/rework-kb-section
- Related but out of scope: https://linear.app/nxdev/issue/DOC-542/investigate-pylon-kb-integration-with-docs-search

## Repository findings

- The current KB is defined by `knowledgeBaseGroups` in `astro-docs/sidebar.mts`.
- It contains 187 unique articles across 25 categories. None appear in another sidebar tab.
- Article sources are scattered across `troubleshooting/`, `guides/`, `concepts/`, `extending-nx/`, `reference/`, and `technologies/`.
- `astro-docs/src/content/docs/knowledge-base/` contains 26 navigation-only index pages (root plus 25 category pages), not the article bodies.
- No current KB article has `tags` frontmatter. `astro-docs/src/content.config.ts` does not extend the Starlight schema with tags.
- A flat `/docs/kb/<basename>` route has two collisions:
  - `troubleshooting/console-troubleshooting` and `guides/nx-console/console-troubleshooting`
  - Angular and React each have `module-federation-with-ssr`
- Current KB URLs have 643 tracked internal references across 276 files: 525 occurrences in `astro-docs`, 109 in `packages/*`, and 9 in `nx-dev/*`.
- Redirects are currently duplicated between `astro-docs/astro.config.mjs` and `astro-docs/netlify.toml`.
- The related Pylon work needs a stable docs URL and metadata contract but is not currently part of this repository implementation.

## Confirmed decisions

- Remove the Knowledge Base sidebar tree and make the Knowledge Base tab a direct `/docs/kb` link, following the Templates navigation pattern.
- Use flat canonical article routes: `/docs/kb/<article-slug>`.
- Non-colliding articles use the existing basename. Collision slugs retain the original contextual prefix:
  - `/docs/kb/troubleshooting-console-troubleshooting`
  - `/docs/kb/nx-console-troubleshooting`
  - `/docs/kb/angular-module-federation-with-ssr`
  - `/docs/kb/react-module-federation-with-ssr`
- Add user-facing tag filtering plus a search field. Use `/docs/templates` as the interaction and responsive-layout reference.
- Prune before moving content using the full GA export period, April 1–July 15, 2026 (106 days). Do not spend migration effort on pages approved for removal.
- Generated docs, package-schema links, and CLI-emitted links are out of scope. They continue to resolve through permanent redirects. Update links inside the retained static docs and KB UI only.
- Pylon synchronization is separate. DOC-552 improves the KB experience and metadata but does not implement the DOC-542 sync.
- Use `tags: string[]` with normalized controlled values. Multiple tags are allowed so one article can appear under more than one relevant filter.
- Preserve the 25 current sidebar category labels as the initial user-facing tag vocabulary. Jack will inspect and adjust the taxonomy later if needed.

## GA audit result

Source: `/Users/jack/Downloads/download.csv`, GA4 “Server Page Requests-Free form 1,” April 1–July 15, 2026 inclusive (106 days). The export contains the `Server Page Requests` event count, not page views, users, or engagement metrics.

Route coverage source: `https://nx.dev/docs/sitemap-0.xml`, joined to the sidebar because KB membership is defined by the sidebar rather than the current URL structure.

Audit method:

1. Parse all 99,999 data rows and normalize paths by stripping query strings, fragments, and trailing slashes.
2. Match the 187 routes in the current Knowledge Base sidebar and the 26 legacy KB index routes against all 778 sitemap pages.
3. Recursively add request counts from exact historical redirect sources to the current route so recent renames are not treated as low-traffic pages.
4. Detect articles added during the export window and compare requests per day of route exposure. Pages with fewer than 30 days of exposure are ineligible for pruning from this export.
5. Treat any route absent from the CSV as zero rather than limiting the audit to rows present in the export.

Findings:

- All 187 current KB articles and all 26 legacy KB index routes exist in the sitemap and matched a CSV row. None had zero requests.
- No sidebar article or legacy KB index had three or fewer direct requests. The minimum sidebar-article count was four.
- Current and exact predecessor routes account for 2,046,775 requests, 13.49% of the 15,175,972 requests in the export.
- Median article traffic is 10,149 requests. The 10th percentile is 7,098 and the 25th percentile is 8,562.
- Seven pages are below 1,000 requests, but all seven were added on July 10 and only had six days of exposure. They are six new comparison pages and the TypeScript 7 guide, so they are not prune candidates.
- Recent route renames would have produced false positives without predecessor aggregation: “What is a monorepo” has 4 requests on its new route and 33,348 on its predecessor; “Monorepo or polyrepo” has 37 plus 17,448; “Nx vs Turborepo” has 728 plus 26,936.
- The next low cumulative pages were also published during the window: workspace-package-manager recipes on June 24, a project-graph performance guide on June 12, Vite Module Federation on June 4, and Consumer/Provider on May 29.
- Mature pages at the bottom of the distribution still have roughly 6,800–7,400 requests for the window. The explicitly deprecated AWS Lambda guide has 7,374 requests and remains a useful deprecation destination. The Cypress 11 guide has 7,109 requests and still documents a shipped generator.

Recommendation: do not delete or merge any article solely from this export. The data has no defensible mature-page cutoff, and pruning the apparent bottom seven would delete pages published less than a week ago. Retain all 187 articles for the move, remove the 26 navigation-only index pages as part of the structural cleanup, and revisit article pruning with at least 90 days of exposure plus page-view/user/engagement metrics. Jack approved this disposition before implementation.

## Implementation plan

### Step 1: Prune the current KB from GA traffic before restructuring

Parse the full April 1–July 15, 2026 GA export, normalize page paths, and match the data against all 187 current KB article URLs. Record the available Server Page Requests event count. Aggregate exact predecessor URLs and normalize for route exposure time before ranking.

Rank the KB by cumulative and per-exposure-day traffic. Exclude pages with less than 30 days of exposure from traffic-based pruning. The completed audit does not support an article-removal threshold, so the proposed disposition is to keep all articles and prune only navigation-only index pages.

Create a reviewed inventory for the surviving articles and all 26 legacy index routes. Each row records the current source file, old URL, GA metrics, proposed source file, new canonical URL, tags, collision-safe slug, internal static-doc reference count, disposition, rationale, and redirect target. Removed or merged pages must point to the closest useful surviving destination; do not redirect unrelated content to the KB home page.

TODO:

- [x] Obtain the GA CSV at a readable path.
- [x] Match GA rows to all 187 current article routes and identify unmatched/no-traffic pages.
- [x] Aggregate predecessor URLs and adjust comparisons for route age.
- [x] Propose a data-driven disposition from the traffic distribution.
- [x] Review apparent low-traffic articles for uniqueness, freshness, and obsolescence.
- [x] Get Jack's approval on the prune/merge list before moving files.
- [x] Record mappings for all retained articles.
- [x] Record redirects for the root and 25 category index routes.
- [x] Confirm that no article redirects are needed for pruning or merging.

### Step 2: Add a first-class KB metadata contract

Extend `astro-docs/src/content.config.ts` with `tags: z.array(z.string()).optional()` for docs. Add a KB-specific validator that requires non-empty normalized tags for files under `src/content/docs/kb`, rejects duplicate route slugs, and verifies every migrated page exists in the redirect inventory.

Use the same `tags` field name as the blog model. Keep values stable and presentation-independent. Allow multiple tags per article. Preserve the 25 current user-facing category labels as the initial vocabulary so the migration remains mechanical and every old category index can redirect to its equivalent tag filter.

TODO:

- [x] Add tags to the docs schema.
- [x] Add KB metadata/slug/redirect validation.
- [x] Add the validator as an Nx target and dependency of the existing `astro-docs:test` workflow.
- [x] Validate Nx cache inputs after changing project target configuration.

### Step 3: Move and annotate the content

Move approved article sources into the flat `astro-docs/src/content/docs/kb/` directory. Preserve file history with moves, retain titles/descriptions, add tags, and avoid editorial rewrites during the mechanical migration unless Step 1 explicitly marks a page for refresh or merge.

Delete or replace the 26 `knowledge-base/**/index.mdoc` navigation-only pages after their redirect targets are defined.

TODO:

- [x] Move every approved article to `kb/`.
- [x] Add reviewed tags to every moved article.
- [x] Apply collision-safe slugs.
- [x] Remove obsolete navigation-only index files.
- [x] Run the KB validator and inspect the move diff for accidental content changes.

### Step 4: Replace sidebar-driven discovery

Update `astro-docs/sidebar.mts` to remove `knowledgeBaseGroups` and make “Knowledge Base” a direct navigation link to `kb`, matching the Templates tab behavior.

Replace `knowledge-base/index.mdoc` with `src/pages/kb/index.astro`, using `StarlightPage` with the Templates splash-page pattern. Read retained KB entries from `getCollection('docs')`, then pass only title, description, href, and tags to a focused React gallery island.

Adapt the `/docs/templates` gallery interaction rather than reusing its template-specific components. Add wrapping tag chips, a search field, a live result count, a responsive article-card grid, an accessible empty state, and URL query state so category index redirects can land on a selected tag. Search matches title, description, and tags; selecting a tag and entering text combine as filters. Order cards alphabetically by title for stable scanning rather than by current sidebar position or traffic.

TODO:

- [x] Remove the KB sidebar tree.
- [x] Add the `/docs/kb` landing page.
- [x] Add tag chips, search, result count, and combined filtering.
- [x] Preserve filter/search state in the URL.
- [x] Verify breadcrumbs and navigation for index and article pages.
- [x] Verify responsive, keyboard, screen-reader, and dark-mode presentation.

### Step 5: Preserve URLs and update canonical references

Add permanent redirects for every old article URL and all 26 legacy KB index/category URLs. Keep Astro and Netlify behavior synchronized from the reviewed migration inventory, and add a validation check that catches missing or divergent redirect coverage.

Mechanically rewrite references within the retained static documentation to the new canonical URLs. Do not change generated docs, package schemas, CLI-emitted URLs, or their tests in this task; permanent redirects preserve those callers.

TODO:

- [x] Add complete 301 redirect coverage.
- [x] Update links inside retained static docs and the KB UI.
- [x] Leave generated/package/CLI URL sources unchanged and verify they resolve through redirects.
- [x] Verify no retained static doc points at a moved URL.
- [x] Verify removed pages redirect to a relevant destination.

### Step 6: Validate the built site and SEO behavior

Run focused validation first, then affected and full pre-push validation. Search is only testable from a production build.

Planned commands:

```bash
pnpm nx run astro-docs:format
pnpm nx run astro-docs:vale
pnpm nx run astro-docs:build
pnpm nx run astro-docs:validate-links
pnpm nx run-many -t test,build,lint -p astro-docs
pnpm nx affected -t build,test,lint
pnpm nx affected -t e2e-local
pnpm nx prepush
```

Also inspect the built output to confirm:

- each retained article has exactly one canonical `/docs/kb/...` URL;
- old URLs return/emit permanent redirects and are absent from the sitemap;
- `/docs/kb` and retained articles appear in Pagefind as intended;
- tag filters/grouping include every retained article exactly once in the primary listing;
- search matches titles, descriptions, and tags and composes with the active tag;
- canonical, Open Graph, edit, breadcrumb, and internal links point to the new route;
- generated/package/CLI callers still reach the intended content through redirects.

TODO:

- [x] Run focused formatting, Vale, build, lint, and link validation.
- [x] Test representative redirects from every old category plus both collision cases through the redirect validator.
- [x] Test the production-built gallery search and filters.
- [ ] Run affected targets and affected e2e if requested before commit.
- [ ] Run `pnpm nx prepush` before committing.

## Implementation result

- Moved all 187 approved articles to flat `src/content/docs/kb/` sources and assigned each one of the 25 preserved category tags.
- Removed the 26 navigation-only legacy KB indexes and added 213 permanent redirects: 187 articles plus 26 indexes.
- Replaced the KB sidebar tree with a direct navigation link and added a Templates-style landing page with tag chips, text search, combined filters, URL query state, result counts, cards, and an empty state.
- Rewrote retained static-doc links to canonical KB URLs. Generated docs, package schemas, and CLI-emitted URLs remain intentionally unchanged and rely on redirects.
- Added `astro-docs:validate-kb` to enforce flat sources, allowed tags, collision-free slugs, and redirect coverage.

## Validation result

Passed:

- `pnpm nx run astro-docs:validate-kb` — 187 articles, 25 tags, 213 redirects.
- `pnpm nx run astro-docs:format`.
- explicit Prettier checks for changed Astro, TypeScript, JSON, and configuration files.
- `pnpm nx run astro-docs:build` — 754 pages.
- `pnpm nx run astro-docs:lint`.
- `pnpm nx run astro-docs:validate-links`.
- `git diff --check` and retained-doc search for `/docs/knowledge-base`.
- production-build browser checks for tag/search composition, query restoration, empty state, card navigation, breadcrumbs, light/dark presentation, console errors, and responsive overflow from 320px through 1536px.

`pnpm nx run astro-docs:vale` reports 112 errors, 71 warnings, and 214 suggestions because the source move causes Vale to re-evaluate pre-existing prose in the 187 legacy article bodies. The new landing-page copy is clean; article-body editorial cleanup is intentionally outside this information-architecture migration.

## Logical review/commit boundaries

1. Approved structural prune and migration inventory.
2. KB metadata contract, validator, and `/docs/kb` discovery UI.
3. Retained content moves, tags, and static-doc canonical-link updates.
4. Redirect coverage and migration regression checks.

Before pushing, follow the repository workflow and squash to the required final commit shape. Documentation-only cross-cutting changes should use `docs(misc)`.

## Expected outcome

Every retained KB article lives under a predictable `kb` source path, has validated tags, uses one canonical `/docs/kb/...` URL, is discoverable without the old sidebar hierarchy, and preserves existing traffic through complete permanent redirects. Internal sources no longer depend on legacy URLs, and the resulting metadata is stable enough for the separate docs-to-Pylon sync.
