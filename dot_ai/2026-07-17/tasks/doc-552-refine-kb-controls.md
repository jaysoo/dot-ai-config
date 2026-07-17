# DOC-552: Refine Knowledge Base controls

## Status

Complete. Changes remain uncommitted and unpushed.

## Goal

Keep the active topic filter visually consistent with the other topic chips, move Knowledge Base search above the featured article section, and surface article topics in the right sidebar.

## Plan

1. Compare computed styles for active and inactive topic controls.
2. Apply the smallest component-scoped CSS correction.
3. Move the search trigger directly below the Knowledge Base introduction.
4. Render linked topics below Copy page in the right sidebar for KB articles only.
5. Format, build, and verify the resulting desktop and mobile layout.

## Constraints

- Preserve topic-filter behavior, URL state, and accessibility.
- Preserve the contextual Pagefind search behavior.
- Do not add the topic panel to the KB landing page, topic indexes, or non-KB docs.
- Do not commit, push, or create a PR without explicit approval.

## Result

- Reset component-scoped topic-button margins so the selected chip has the same dimensions as every inactive chip.
- Moved the Knowledge Base search block directly below the introductory copy and above Featured articles.
- Added linked topic chips below Copy page in the right sidebar for KB articles only.
- Kept topic filtering, URL state, Pagefind behavior, and article table-of-contents behavior unchanged.

## Verification

- `npx prettier --plugin=prettier-plugin-astro --write astro-docs/src/components/layout/TableOfContents.astro astro-docs/src/components/kb/KnowledgeBaseArticleList.astro astro-docs/src/pages/kb/index.astro`
- `pnpm nx run astro-docs:validate-kb`
- `pnpm nx build astro-docs`
- Production-browser checks at 390, 640, 768, 1000, 1100, 1200, 1300, 1400, and 1536 pixels
- Verified selected and inactive topic chips remain 30px high in dark and light themes
- Verified search precedes Featured articles, topic filtering still updates the URL and visible rows, and no tested width overflows
- Verified the TypeScript topic appears below Copy page on the TypeScript 7.0 article and links to `/docs/kb/typescript`
- Verified no topic panel appears on the KB landing page, topic index, or a regular documentation article
- `git diff --check`
