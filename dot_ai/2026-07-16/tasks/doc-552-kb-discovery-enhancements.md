# DOC-552: Knowledge Base discovery enhancements

## Status

Completed on 2026-07-16. Changes remain uncommitted and unpushed.

## Goal

Turn `/docs/kb` into a curated discovery hub with featured topics and articles, contextual Pagefind search, index pages for every tag, Git-backed last-modified dates, and responsive article lists.

## Confirmed decisions

- Featured topics:
  - Installation and updates
  - Organizational decisions
  - Comparisons
- Feature the top six articles by GA Server Page Requests, including exact predecessor routes:
  1. Angular and Nx Version Matrix
  2. What is a monorepo
  3. Nx vs Turborepo
  4. Setup CI
  5. Folder structure
  6. Switch to Workspaces and TS Project References
- Add `Next.js` as a new tag for:
  - Deploying Next.js Applications to Vercel
  - How to configure Next.js plugins
- Use `/docs/kb/<tag-id>` for tag index pages.
- Resolve tag/article route collisions by renaming:
  - Article `/docs/kb/angular` to `/docs/kb/migrate-angular-cli-to-nx`
  - Article `/docs/kb/eslint` to `/docs/kb/configuring-eslint-with-typescript`
- Use one Pagefind index. On KB routes, boost KB results while retaining docs fallback; on other docs routes, boost docs while retaining KB fallback.
- Only featured articles use cards.
- Non-featured articles use a responsive list with `Title | Last modified | Tags`.
- Use the same list pattern on tag pages.
- Sort the main and tag article lists by title.
- Show six recent non-featured articles at the bottom of the KB hub.

## Implementation plan

### 1. Metadata and routes

- Add a central KB configuration for featured tags, featured article order, and recent article count.
- Add the Next.js tag and apply it to the two approved articles.
- Rename the Angular and ESLint collision articles.
- Generate static `/docs/kb/<tag-id>` pages for all tags.
- Make tag chips and labels link to their tag pages.

### 2. Last modified

- Calculate dates from Git commit history, not filesystem timestamps.
- Preserve each article's latest pre-migration date from its original source path.
- Ignore broad bulk commits when determining article recency so the KB migration does not make every article look new.
- Use the resolved date in the KB hub, tag pages, recent section, and Starlight article footer.

### 3. Search

- Add `section:kb` and `section:docs` Pagefind filters automatically.
- Replace the stock search behavior with two filtered searches against the same physical index.
- Apply a 1.5x score boost to the current section and merge the results.
- Label each result as Knowledge Base or Documentation.

### 4. UI

- Render featured topics as compact links.
- Render the six featured articles as cards.
- Render remaining articles as accessible responsive rows with title, last modified date, and linked tags.
- Add a recent-articles section with the same row treatment.
- Use the same hero and list treatment for tag pages.

### 5. Redirects and validation

- Update old Angular and ESLint source redirects to the renamed article URLs.
- Update retained internal links to the renamed articles.
- Redirect the 26 old KB category indexes to their new tag pages.
- Extend the KB validator for featured configuration, tag routes, route collisions, Next.js tagging, last-modified coverage, and redirect targets.
- Update the `validate-kb` Nx inputs and run the cache-alignment check.

### 6. Verification

- Run Prettier and the KB validator.
- Run the docs style structural pass and Vale.
- Run build, lint, and link validation.
- Test contextual Pagefind ranking from KB and non-KB routes.
- Test tag pages, list sorting, featured exclusions, recent articles, redirects, breadcrumbs, responsive widths, keyboard focus, and dark mode.

## Constraints

- Generated docs, package schemas, CLI-emitted URLs, and Pylon integration remain out of scope.
- Do not commit, push, or create a PR without explicit approval.

## Result

- Added three featured topic links and the six GA-selected featured article cards.
- Added 26 static tag index pages, including `/docs/kb/nextjs`.
- Added the `Next.js` tag to the two approved articles.
- Renamed the Angular and ESLint articles to avoid tag route collisions.
- Added responsive article tables with title, Git-backed last-modified date, and linked tags.
- Added six recently updated articles to the bottom of the KB hub.
- Added Git-derived last-updated dates to KB article footers while preserving pre-migration history.
- Added one-index contextual Pagefind search with a 1.5x current-section boost and cross-section fallback.
- Updated redirects, retained links, validation, and Nx cache inputs.

## Verification

- `pnpm nx run astro-docs:build` passed: 780 pages, 653 Pagefind pages, 2 section filters.
- `pnpm nx run astro-docs:lint` passed.
- `pnpm nx run astro-docs:validate-links` passed.
- `pnpm nx run astro-docs:validate-kb` passed: 187 articles, 26 tags, 6 featured articles, 213 redirects.
- `pnpm nx run astro-docs:format` passed.
- `git diff --check` passed.
- Production browser checks passed for contextual search, article counts, tag pages, Git dates, dark mode, and widths from 320px through 1536px with no horizontal overflow.
- Vale reports the unchanged moved-content baseline: 112 errors, 71 warnings, and 214 suggestions across 483 files.
