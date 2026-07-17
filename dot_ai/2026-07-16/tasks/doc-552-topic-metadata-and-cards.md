# DOC-552: Knowledge Base topic metadata and cards

## Status

Completed on 2026-07-16. Changes remain uncommitted and unpushed.

## Goal

Make Knowledge Base topics a first-class taxonomy with centralized metadata, topic index descriptions, featured topic cards, and optional cover artwork that can also serve as each topic page's social image.

## Confirmed decisions

- Rename the taxonomy completely from tags to topics:
  - `topics` in all Knowledge Base article frontmatter
  - topic terminology in TypeScript, components, routes, validation, and user-facing labels
- Require every topic to define:
  - `id`
  - `label`
  - `description`
- Keep `coverImage` optional.
- Create temporary Nx-styled cover images for the three featured topics:
  - Installation and updates
  - Organizational decisions
  - Comparisons
- Use each featured topic's cover image on its card and as the topic page's `og:image` and Twitter image.
- Preserve the existing `/docs/kb/<topic-id>` URL structure.
- Remove the separate recent-articles section.
- Sort the non-featured article table by last modified, newest first.

## Implementation plan

### 1. Taxonomy and article metadata

- Rename `knowledge-base-tags.json` to `knowledge-base-topics.json`.
- Add a description to every topic, reusing the previous category landing-page descriptions where appropriate.
- Rename `featuredTagIds` to `featuredTopicIds`.
- Rename all 187 Knowledge Base article frontmatter fields from `tags` to `topics`.
- Update the docs content schema and Knowledge Base data model.

### 2. Topic routes and components

- Rename the dynamic route implementation from tag terminology to topic terminology without changing URLs.
- Use the centralized topic description in each topic page's metadata and hero copy.
- Rename table headers, mobile labels, accessible names, helpers, and internal properties from tags to topics.
- Keep article topic pills linked to `/docs/kb/<topic-id>`.

### 3. Featured topic cards and artwork

- Replace the compact featured-topic links with three responsive cards.
- Show cover artwork, topic label, description, and article count.
- Create three temporary SVG cover images under `public/kb-media/topics`.
- Ensure the cards work in light and dark themes and collapse cleanly on narrow screens.

### 4. Social metadata

- Resolve topic routes against the centralized topic metadata in the OG middleware.
- Use `coverImage` for `og:image` and `twitter:image` when present.
- Preserve the existing generated documentation image and default fallback behavior for topics without artwork.

### 5. Validation and verification

- Extend the Knowledge Base validator to require topic descriptions, validate optional cover paths, verify featured topics have covers, and reject legacy `tags` frontmatter.
- Update Nx target inputs for the renamed data file and cover assets.
- Run Prettier, Knowledge Base validation, build, lint, link validation, docs style checks, and responsive visual checks.

## Constraints

- Cover artwork is temporary and expected to receive editorial review.
- Featured-topic cover artwork must be abstract and contain no text.
- Images are not required for non-featured topics.
- Generated docs and the separate Pylon integration remain out of scope.
- Do not commit, push, or create a PR without explicit approval.

## Result

- Renamed the Knowledge Base taxonomy from tags to topics across all 187 article frontmatter files, TypeScript models, components, routes, accessible labels, and validation.
- Added required descriptions for all 26 topics in `knowledge-base-topics.json`.
- Added optional `coverImage` metadata and 1200 by 750 PNG covers for the three featured topics.
- Replaced the initial text-heavy diagram covers with text-free abstract artwork:
  - Installation and updates uses layered cyan-to-violet planes that expand and evolve.
  - Organizational decisions uses four modular clusters coordinated through a shared center.
  - Comparisons uses opposing magenta and cyan forms that converge without implying a winner.
- Removed the stale diagram-style SVG sources after installing the generated raster artwork.
- Replaced the compact featured-topic links with responsive cards containing artwork, descriptions, and article counts.
- Used the same PNG cover for each featured topic card, `og:image`, and Twitter image.
- Kept the default Nx social image for topics without custom artwork.
- Used each topic's centralized description on its `/docs/kb/<topic-id>` index page.
- Removed the separate recently updated section.
- Sorted the 181 non-featured article rows by Git-backed last modified date, newest first, with title as the tie-breaker.
- Prevented topic index pages from rendering the KB article last-updated footer.

## Verification

- `pnpm nx run astro-docs:validate-kb --skipNxCache` passed: 187 articles, 26 topics, 6 featured articles, and 213 redirects.
- `pnpm nx run astro-docs:build` passed: 780 pages, 653 Pagefind pages, and 2 section filters.
- `pnpm nx run astro-docs:lint` passed.
- `pnpm nx run astro-docs:validate-links` passed.
- `pnpm nx run astro-docs:format` passed.
- `git diff --check` passed.
- All 187 KB articles use `topics`; none retain the legacy `tags` field.
- Emitted social metadata uses the featured topic PNGs at 1200 by 750 and the default 1200 by 630 image for topics without covers.
- The replacement covers contain no text, logos, interface elements, or literal labels.
- The featured cards render correctly in light and dark themes; all three images load at their native dimensions.
- Responsive browser checks passed at 320, 640, 1000, 1200, and 1536 pixels without horizontal overflow.
- The article table contains 181 rows, has no separate recent section, and is sorted newest to oldest.
- Responsive production checks passed at 320, 640, 768, 1000, 1100, 1200, 1300, 1400, and 1536 pixels in dark mode, plus light mode at 1200 pixels, without horizontal overflow.
- Vale remains at the moved-content baseline: 112 errors, 71 warnings, and 214 suggestions across 483 files.

## Cover generation

Generated with the built-in image generation tool using three separate abstract editorial prompts:

- Installation and updates: layered geometric planes transforming from compact cyan forms into larger indigo forms.
- Organizational decisions: balanced modular clusters connected through a calm shared structure.
- Comparisons: contrasting magenta curves and cyan crystalline planes interweaving around a neutral center.

All prompts required a dark Nx-like palette and prohibited text, letters, numbers, logos, icons, charts, UI panels, and watermarks.
