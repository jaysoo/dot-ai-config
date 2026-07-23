# DOC-552: Resolve master conflicts

## Goal

Rebase the DOC-552 Knowledge Base restructuring onto current `origin/master`, preserving newer master changes while keeping the new `/docs/kb` information architecture.

## Plan

- [x] Fetch current `origin/master` and inspect branch divergence.
- [x] Rebase the single DOC-552 commit onto `origin/master`.
- [x] Resolve config, sidebar, and content move conflicts deliberately.
- [x] Verify updated content exists at the new KB paths and old duplicates are removed.
- [x] Format and run targeted docs validation plus pre-push validation.
- [x] Confirm the result remains one local commit and update Polygraph context.

## Results

Rebased `DOC-552` onto `origin/master` at `1839d32913` and resolved all conflicts in the rewritten local commit `4d48ee1f7f`. Preserved master's consolidated environment-variable reference page and removed the three superseded KB copies. The KB inventory, redirects, topics, and last-modified data remain internally consistent at 184 articles.

Prettier, ESLint, the production Astro build, redirect audit, `git diff --check`, and the repository pre-push gate pass. Vale remains at the known moved-content baseline. Link validation reaches the new master environment-variable page and reports its two unchanged upstream stale links; neither link is introduced by DOC-552.
