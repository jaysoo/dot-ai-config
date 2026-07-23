# Remove DOC-552 Search Customization

## Goal

Keep DOC-552 scoped to the `/docs/kb` restructure and leave Starlight/Pagefind search behavior unchanged.

## Plan

- [x] Inventory every branch-owned search/indexing change.
- [x] Remove the custom Starlight Search override and KB Pagefind adapter.
- [x] Remove KB-only section filters, weighting configuration, and duplicate in-page search triggers.
- [x] Preserve the existing `type:Guides` metadata on Knowledge Base articles.
- [x] Verify the branch no longer changes search rendering, indexing, or ranking.
- [x] Run Prettier, targeted lint, production build, and pre-push validation.
- [x] Amend the single squashed branch commit without pushing.

## Acceptance Criteria

- Starlight's built-in Search component is used on every route.
- DOC-552 contains no custom Pagefind bundle, contextual boost, or KB/docs section filter.
- Knowledge Base articles remain classified with `filter: 'type:Guides'`.
- `/docs/kb` landing, topic, and article routes build successfully.

## Notes

A rendered `Docs`/`Guide` badge is intentionally deferred if it requires overriding Starlight's Search component; that would reintroduce the same out-of-scope search ownership this cleanup removes.

## Result

- Removed the Search component override, KB Pagefind adapter, section filter, contextual boost, and duplicate KB search triggers.
- Classified all 187 Knowledge Base articles with the existing `type:Guides` Pagefind filter.
- Confirmed the final branch has no diff from `master` in the Search component, Pagefind adapter, search trigger, or PageFrame search integration.
- Passed formatting, lint, a forced production build, link validation, and `pnpm nx prepush`.
- Vale still reports the branch's pre-existing moved-content baseline: 112 errors, 71 warnings, and 213 suggestions across 483 files. This follow-up only changes frontmatter classification and adds no prose violations.
- Amended the single commit locally to `4b03eac735`; not pushed.
