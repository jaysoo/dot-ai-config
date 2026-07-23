# DOC-552: Fix CI failures

## Goal

Diagnose and fix the `astro-docs:vale` and `astro-docs:validate-links` failures for the rebased DOC-552 Knowledge Base pull request without expanding the search scope.

## Plan

- [x] Inspect the latest Nx Cloud pipeline and resolved Astro docs targets.
- [x] Reproduce the failing checks locally and identify branch-owned causes.
- [x] Make the smallest content or redirect fixes required for CI.
- [x] Run formatting, Vale, link validation, build, and pre-push validation.
- [x] Confirm a clean branch and update the Polygraph session context.

## Results

The moved Knowledge Base pages lost 15 path-specific `Nx.Headings` exemptions in `.vale.ini`, which caused 112 Vale errors. Moved those existing exemptions to the new `/kb` source paths. Updated two stale links in the environment variables reference to their canonical `/docs/kb` destinations.

Rebased the single squashed commit onto `origin/master` at `2cbf400fe6`; the resulting local commit is `6b9ff9feb5`. Vale, link validation, formatting, lint, the Astro docs test/build chain, `git diff --check`, and the full pre-push gate pass. The branch is clean and one commit ahead of current master. It has not been pushed.
