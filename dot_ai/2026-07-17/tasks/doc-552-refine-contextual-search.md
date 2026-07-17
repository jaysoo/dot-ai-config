# DOC-552: Refine contextual search presentation

## Status

Complete. Changes remain uncommitted and unpushed.

## Goal

Make contextual search clearer and keep Knowledge Base article lists complete and consistently ordered.

## Plan

1. Present each result's Knowledge Base or Documentation category as a compact badge.
2. Hide the global header search trigger on Knowledge Base routes while preserving `Cmd/Ctrl+K` and the in-page KB search triggers.
3. Remove the explanatory prioritization copy from the dialog without changing contextual ranking.
4. Include featured entries in the All articles list and sort topic indexes newest to oldest.
5. Place KB article topics between the table of contents and the divided Copy page action.
6. Format, build, and verify keyboard, search, list ordering, article-rail order, and responsive behavior in production output.

## Constraints

- Keep one Pagefind index and the existing contextual ranking behavior.
- Keep the global search trigger visible on non-KB documentation routes.
- Do not commit, push, or create a PR without explicit approval.

## Result

- Rendered Knowledge Base and Documentation result categories as compact bordered badges.
- Removed the contextual-prioritization notice while preserving the existing section-weighted Pagefind searches.
- Hid the global header search trigger on KB routes; `Cmd/Ctrl+K` and in-page KB search triggers still open the KB-prioritized dialog.
- Included all 187 articles in All articles, including the six featured entries, sorted newest to oldest.
- Sorted every topic index newest to oldest.
- Moved article topics above the divided Copy page action in KB article rails.

## Verification

- `npx prettier --plugin=prettier-plugin-astro --write` on all changed Astro files.
- `pnpm nx run astro-docs:validate-kb`
- `pnpm nx build astro-docs`
- Production-browser checks confirmed KB and docs keyboard search, route-scoped header visibility, contextual result order, category badge styling in both themes, 187 complete newest-first rows, featured articles in All articles, newest-first topic rows, and the requested article-rail order.
- Responsive checks passed from 390px through 1536px without horizontal overflow.
- `git diff --check`
