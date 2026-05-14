# 2026-05-12 Summary

## Accomplished

### Polygraph docs site: move under `/docs`, route `/` to Framer homepage

Multi-repo Polygraph session (`polygraph-docs-marketing-pages-b439ced6`) porting `nrwl/nx`'s astro-docs + framer-edge pattern to `nrwl/polygraph-docs`. trypolygraph.com now serves the Astro Starlight docs under `/docs/*` and proxies everything else to `https://active-startup-540669.framer.app/<path>` via a Netlify edge function, with the framer origin streaming-rewritten back to `trypolygraph.com` so internal navigation stays on-domain.

Workflow:

1. Added `nrwl/nx` to the Polygraph session.
2. Spawned two read-only child agents in parallel — one in nx to extract the edge function + astro-docs base-path config verbatim, one in polygraph-docs to inventory the current setup and identify breakage under `base: '/docs'` (29 root-relative content links, 3 page route URL builders, stale `site` config).
3. Delegated the port to a polygraph-docs child agent with the exact diff: astro.config (`base`, `outDir`, `site`), new edge function, netlify.toml well-known rewrites, content link prefixing, page URL builders.
4. Pushed branch → opened draft PR #4.
5. Iterated twice on trailing-slash behavior:
   - Tried `build.format: 'file'` — fixed child pages but Starlight baked `.html` into sidebar links and canonical URLs (SEO regression).
   - Reverted and adopted nx's exact pattern: `publish = "dist/docs"` + `/docs/* → /:splat` rewrite. Netlify serves the directory tree without the trailing-slash redirect, canonical URLs stay clean.

PR: https://github.com/nrwl/polygraph-docs/pull/4 (draft). 3 commits: `0e6bf54` → `d19d521` → `d086def`.

Side fix: polygraph-docs pre-push commitlint hook crashes when branch has ≤20 commits and `origin/HEAD` is unset (failed `git rev-parse <sha>~20` prints literal arg, gets concatenated with rev-list fallback into a newline-joined `$from`). Worked around with `git remote set-head origin main`. Real one-line hook fix flagged in PR body.

Files: `dot_ai/2026-05-12/tasks/polygraph-docs-base-path-and-framer-rewrite.md`, PR #4

## Other

- Earlier session spec checked in but not advanced today: `dot_ai/2026-05-12/specs/cnw-init-enhancements.md` (NXC-4311 + DOC-492 + NXC-4367 single-PR plan for `nx init` Cloud + CI augmentation).
