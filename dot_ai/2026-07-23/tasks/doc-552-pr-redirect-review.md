# DOC-552: Pull request redirect and blocker review

## Goal

Verify that every documentation URL moved into `astro-docs/src/content/docs/kb` has a working redirect to its new `/docs/kb/<slug>` route, compare the production sitemap with the local documentation site, and identify merge-blocking code smells in PR #36414.

## Plan

- [x] Inspect the Polygraph session, PR metadata, branch diff, and redirect configuration.
- [x] Build a complete old-path-to-new-path inventory from Git rename records and compare it with Netlify redirects.
- [x] Compare production sitemap URLs with local routes and exercise redirects against `http://localhost:9006`.
- [x] Run targeted validation and inspect the implementation for correctness, maintainability, and merge blockers.
- [x] Present the review in Plannotator and record the final audit result.

## Scope

Only DOC-552 Knowledge Base moves and the code supporting the `/docs/kb` experience. Generated reference documentation and unrelated existing redirects are out of scope.
