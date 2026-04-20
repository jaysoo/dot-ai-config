# 2026-04-20 Summary

## Shipped

### DOC-479: Agent-readiness improvements for nx.dev ✓
PR #35348 (merged) — responded to isitagentready.com flags:
- Link response headers (RFC 8288) on Framer-proxied pages: `describedby`→/llms.txt, `service-doc`→/llms-full.txt, `sitemap`→/sitemap.xml
- Content-Signal in robots.txt: `search=yes, ai-input=yes, ai-train=yes` (permissive — nx.dev actively wants AI agents to consume docs)
- `nx.dev/robots.txt` routed through astro-docs via Next.js `beforeFiles` rewrite (so astro is single source of truth)
- Fixed latent bug: robots.txt sitemap URL was `/sitemap-index.xml` (404) → corrected to `/sitemap.xml`
- Deferred Agent Skills Discovery index — researched, evidence of absence (RFC author admits no major deployments; all ~35 agentskills.io clients consume SKILL.md from local fs not HTTP)

Files: `.ai/2026-04-20/tasks/doc-479-agent-readiness.md`

### Sitemap regression fix (#35351) ✓
DOC-478 cleanup (#35315) removed `next-sitemap` which silently took out `/sitemap.xml` generation. Fix on `fix_nxdev_sitemap` branch:
- Restored `next-sitemap.config.js` with `generateRobotsTxt: false` (keeps astro-docs robots rewrite winning) and `exclude: ['/ai-chat', '/api/*']`
- Restored `scripts/patch-sitemap-index.mjs`
- Re-added `sitemap` target to project.json

Local verification: 3-entry index, 23-URL sitemap-0.xml (courses + lessons), no robots.txt emitted. Preview shows empty sitemap because `NEXT_PUBLIC_NO_INDEX=true` → correct behavior (cache-safe because env var is in target input hash).

## In progress

### NXC-4262: Common nx init issue fixes
Implementing five fixes from the init-error-investigation plan:
1. Capture stderr on child-process failures + include tail in telemetry
2. Make `./nx --version` warm-up non-fatal
3. Angular version detection warns + falls through instead of throwing
4. Bail with friendly message if `cwd` is a system dir
5. Friendly error for invalid `package.json`

Files: `.ai/2026-04-20/tasks/nxc-4262-init-fixes.md`

### Init error investigation (Mar/Apr CNW+init telemetry)
Pulled Mar/Apr CNW + init funnel/cloud stats via cnw-stats-analyzer. Updated skill (target 3k→2k, headline no-filter vs funnel human+AI/CI split). Wrote init error fix plan — ~22% of init starts fail with no stderr captured; `./nx --version` probe accounts for 9.8% of starts on its own.

Files: `.ai/2026-04-20/tasks/init-error-investigation.md`

## Research

### Turborepo/Vercel bundling evidence
Researched the claim that Vercel's platform integration is the single biggest distribution lever behind Turborepo's npm download growth. Conclusion: original framing was wrong — Vercel's build-image preinstall of `turbo` does not directly inflate npm downloads. Real growth driver is adoption decisions funneled through Vercel's template gallery, Next.js docs positioning, and AI-training-data presence.

Files: `.ai/2026-04-20/tasks/turborepo-vercel-bundling-evidence.md`

## Post-merge debugging notes

The DOC-479 robots.txt fix required three rounds to land in prod:
1. First merge landed on master, but `nx.dev/robots.txt` still served Framer's URL — prod deploy artifact literally had a stale `public/robots.txt` baked in from a pre-DOC-478 build.
2. The generator (`next-sitemap.config.js` with `generateRobotsTxt: true`) had been deleted in DOC-478, but prod deploy was pinned to an older deploy.
3. Fresh deploy from latest master → `beforeFiles` rewrite fires → astro-docs robots.txt with Content-Signal served correctly.

Separately, website-22 patch branch requires cherry-picking `e6e2f4bfac` (PR #35238: lib deletions) + `52c3626b67` (DOC-478) + DOC-479 commits + #35351 in that order, resolving conflicts by taking `--theirs` (cleanup side) for most files and preserving the `beforeFiles` rewrite in `next.config.js`.

## Sessions cleaned up

Removed from Active Claude Sessions:
- `nx-worktrees/DOC-478` (branch: DOC-478) — completed on 2026-04-17, merged as PR #35315
- `nx-worktrees/NXC-3345` — stale (last touched 2026-03-25, >3 weeks)
