# DOC-552: Simplify featured-card hover

## Status

Complete. Changes remain uncommitted and unpushed.

## Goal

Keep featured article titles visually unchanged when their card is hovered.

## Plan

1. Remove the card-hover title color override.
2. Preserve card-level hover feedback, topic-link hover, and keyboard focus styling.
3. Format, build, and verify hover behavior in light and dark themes.

## Constraints

- Keep the full-card link behavior intact.
- Do not commit, push, or create a PR without explicit approval.

## Result

- Removed the featured-card hover rule that changed article title colors.
- Preserved card lift, border and shadow feedback, topic-link interaction, keyboard focus styling, and full-card navigation.

## Verification

- `npx prettier --plugin=prettier-plugin-astro --write astro-docs/src/components/kb/KnowledgeBaseFeaturedArticles.astro`
- `pnpm nx run astro-docs:validate-kb`
- `pnpm nx build astro-docs`
- Production-browser checks in light and dark themes confirmed unchanged title colors, card-body navigation, focus styling, and no horizontal overflow from 390px through 1536px.
- `git diff --check`
