# DOC-552: Consistent Knowledge Base shell

## Status

Complete. Changes remain uncommitted and unpushed.

## Goal

Make the Knowledge Base landing page, topic indexes, and articles use one sidebar-free shell with a consistent centered content frame.

## Final decisions

- Every `/docs/kb/*` route omits the primary documentation sidebar.
- Articles retain their right-side table of contents when headings require it.
- The combined article content and table of contents uses the same maximum width as the KB and topic indexes.
- Featured topic cards and topic cover images are removed for now.
- Topic metadata and `/docs/kb/<topic>` index routes remain.
- Featured article cards remain.

## Implementation

- Added route middleware that marks all Knowledge Base routes as sidebar-free.
- Constrained KB article content and its right table of contents to the shared Starlight content width.
- Kept topic indexes at the full shared content width when no table of contents is present.
- Removed the featured-topic section, configuration, cover metadata, cover validation, custom social-image handling, cache input, and image assets.

## Verification

- `pnpm nx run astro-docs:validate-kb` passes: 187 flat articles, 26 topics, 6 featured articles, and 213 redirects.
- `pnpm nx build astro-docs` passes: 780 pages built and 653 pages indexed by Pagefind.
- Production-browser measurement at 1920px confirms the KB landing page, Next.js topic index, and article frame are each 1080px wide and centered from 420px to 1500px.
- The article has no left sidebar and keeps its right table of contents inside the 1080px frame.
- The KB landing page contains no featured-topic section or topic cover images.

## Constraints

- Non-KB documentation layouts are unchanged.
- Generated docs and the separate Pylon integration remain out of scope.
- Do not commit, push, or create a PR without explicit approval.
