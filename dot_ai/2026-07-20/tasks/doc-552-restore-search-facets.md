# DOC-552: Restore the production search UI

## Status

Completed.

## Goal

Restore the production Starlight search experience, including its existing filters, while prioritizing Knowledge Base results only when search opens from a `/docs/kb` route. Preserve production ranking everywhere else in the documentation site.

## Plan

- [x] Compare the DOC-552 search override with the production component and Pagefind integration.
- [x] Identify the smallest KB-route-only ranking extension.
- [x] Restore the production search UI and filters.
- [x] Verify KB routes prioritize KB results while non-KB routes retain production ordering.
- [x] Run formatting, build, lint, tests, and pre-push validation.
- [x] Amend the existing squashed DOC-552 commit locally.

## Results

- Restored Starlight's production Pagefind UI and Type filters.
- Added a KB-route-only Pagefind adapter that softly boosts Knowledge Base results.
- Kept the standard Pagefind bundle and unchanged result ordering on every non-KB documentation route.
- Preserved the hidden KB header trigger, in-page search control, and `Cmd/Ctrl+K` behavior.
- Verified KB and normal documentation behavior in a production browser build.
- Passed Prettier, JavaScript syntax checks, `astro-docs` build/lint checks, and the repository pre-push gate.
- Amended the local squashed commit to `c57f978123`. Draft PR #36414 remains at `040191bf88` pending explicit push approval.
