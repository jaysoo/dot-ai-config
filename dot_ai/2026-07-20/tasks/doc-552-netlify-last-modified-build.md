# DOC-552: Fix Netlify last-modified build failure

## Status

Completed.

## Goal

Make Git-backed Knowledge Base last-modified dates resolve reliably in Netlify's deploy-preview checkout while preserving accurate dates and newest-first sorting.

## Plan

- [x] Inspect the resolved `astro-docs` build target and last-modified implementation.
- [x] Reproduce the failure under CI-like Git-history conditions.
- [x] Implement the smallest deterministic fallback or history fix.
- [x] Verify all Knowledge Base articles receive dates and remain sorted newest first.
- [x] Run formatting, focused build/lint checks, and the repository pre-push gate.
- [x] Amend the existing squashed DOC-552 commit locally.

## Results

- Reproduced Netlify's depth-1 Git checkout and confirmed the fixed history base commit was unavailable.
- Added a checked-in baseline containing the Git-derived last-modified timestamp for all 187 KB articles.
- Kept full-history and small post-migration Git dates as newer overrides.
- Confirmed a shallow checkout resolves 187 of 187 dates, including `access-tokens`.
- Passed the forced Astro build, Pagefind indexing, ESLint, Prettier, and the repository pre-push gate.
- Amended the local squashed commit to `8c08e2d685`. The draft PR must be updated before Netlify can verify the fix.
