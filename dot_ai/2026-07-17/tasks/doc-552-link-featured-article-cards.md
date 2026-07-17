# DOC-552: Fix featured cards and restore topic filtering

## Status

Complete. Changes remain uncommitted and unpushed.

## Goal

Make the entire featured article card on `/docs/kb` navigate to its article, update the featured selection, and restore filtering of the article list by topic.

## Plan

1. Extend the article title link across the full card without nesting the existing topic links.
2. Keep topic badges independently clickable above the stretched article link.
3. Give keyboard focus a visible card-level outline.
4. Replace Nx vs Turborepo and Switch to Workspaces with Monorepo vs Polyrepo and the TypeScript 7.0 guide.
5. Add wrapping topic-filter controls to the article list with URL state and a live visible-article count.
6. Format, validate, build, and test card navigation, topic links, and filtering.

## Result

- Made the full featured article card clickable while preserving independent topic links.
- Featured Monorepo vs Polyrepo and the TypeScript 7.0 guide in place of Nx vs Turborepo and Switch to Workspaces.
- Restored wrapping topic filters with accessible pressed state, URL-backed selection, and a live visible-article count.
- Confirmed filtering remains correct without horizontal overflow at mobile widths.

## Verification

- `npx prettier --plugin=prettier-plugin-astro --write astro-docs/src/components/kb/KnowledgeBaseFeaturedArticles.astro astro-docs/src/components/kb/KnowledgeBaseArticleList.astro astro-docs/src/pages/kb/index.astro`
- `npx prettier --write astro-docs/src/data/knowledge-base-config.json`
- `pnpm nx run astro-docs:validate-kb`
- `pnpm nx build astro-docs`
- Production-browser checks for full-card navigation, direct topic links, keyboard focus, URL-restored topic filtering, live counts, and mobile overflow
- `git diff --check`

## Constraints

- Preserve the existing card content and visual hierarchy.
- Do not change the regular article table.
- Do not commit, push, or create a PR without explicit approval.
