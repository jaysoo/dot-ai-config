# Summary - 2026-06-25

## SEO docs overhaul (DOC-537) - GSC-driven

Multi-day session (started 2026-06-23, concluded today) reworking nx.dev technology and key docs pages for search, driven by Google Search Console data. Polygraph session `seo-research-80058b7a`. Linear `DOC-537`.

### Analysis (foundation)
Pulled GSC (sc-domain:nx.dev) and mapped high-impression / low-click queries to ranking pages. Key finding: the head terms (`nx workspace` 4M impr, `pnpm workspace` 2.6M, `monorepo`) are AI-Overview-capped + intent-mismatched (a generated API ref / sales blog surfaces), so click opportunity lives in the mid-tail. Proven pattern (from the ranking "Nx For React" page): the title does not need "monorepo"; the description + content carry it. Full analysis: `dot_ai/2026-06-23/tasks/seo-gsc-query-analysis.md`.

### PR #36088 - MERGED (by jaysoo) - the `nx workspace` + `pnpm workspace` foundation
- Retitled `crafting-your-workspace.mdoc` to target the `nx workspace` query.
- Enriched the generated `@nx/workspace` reference page (`src/pages/reference/workspace/index.astro`) with intro content + nav cards (was a dead-end API list ranking #1).
- New Knowledge Base recipes for npm / pnpm / Yarn / Bun workspaces (lead with the package manager, then add Nx) + sidebar entries + per-tab links from the Managing Dependencies tutorial.

### PR #36105 - DRAFT (follow-up) - branch `doc-537-seo-followup`, one squashed commit `302d0a763b`
- All 33 technology introduction pages: title `<Tech> Plugin for Nx` -> **`Nx with <Tech>`**; description **"Nx scales your `<Tech>` monorepo with caching, distributed task execution, and affected-only builds"**; `technologies/<tech>` and `reference/<tech>` listing pages link to their overview.
- `<Tech> monorepo` called out in the opening of the 22 framework/language/build-tool overviews (for `<tech> monorepo` SERP).
- Standardized **"Set up CI"** section linking `/docs/getting-started/setup-ci` on every overview (32 pages; replaced 9 framework-specific CI sections, added to the rest).
- Angular overview becomes the `angular monorepo` landing; `monorepo or polyrepo` -> "Monorepo vs Polyrepo: How to Choose"; nx-vs-turborepo meta leads with the CI benchmark.
- **Module Federation overview rewritten** (research workflow + 3-judge panel): leads with the React Module Federation template (`--template nrwl/react-mfe-template`), makes the grounded Nx case (continuous tasks + `dependsOn`, affected, Nx Agents, shared-dependency versions), uses the current `consumer`/`provider` generators (the deprecated `host`/`remote` removed).
- Next.js, Express, NestJS intros now create from their CNW templates (`--template nrwl/nextjs-template` / `express-api-template` / `nestjs-template`).
- 12-agent STYLE_GUIDE audit + fixes; opening-phrasing cleanups ("scaling into a monorepo" -> "scaling your monorepo").

### Process notes
Heavy multi-agent Workflow use under ultracode: GSC opportunity scan, MF research + judge panel (accuracy guardrails: core vs Nx Cloud, consumer/provider not the v24-removed host/remote, no overclaiming for the Vite template), a 32-page parallel CI/monorepo edit, and a 12-reviewer STYLE_GUIDE audit. Deterministic scripts handled the mechanical 87-file title/description sweeps. The foundation merged mid-session and the branch was deleted, so the remaining work was rebased onto current master as a fresh draft.

## Open follow-ups (next session)
- **Next.js 14 -> 15 deprecation** (14 is EOL). Scoped, NOT started. Needs: `packages/next/src/utils/versions.ts` `minSupportedNextVersion` 14.0.0 -> 15.0.0 (and drop the `next14Version` + eslint-config-14 workaround), `packages/next/package.json` peerDep `next` `>=14.0.0 <17.0.0` -> `>=15.0.0 <17.0.0`, the doc Requirements table in `technologies/react/next/introduction.mdoc`, and `packages/next/src/utils/all-generators-enforce-floor.spec.ts`. Unrelated to the SEO PR, so do it on its own branch.
- **Angular overview** still uses the deprecated `@nx/angular:host`/`:remote` MF generators -> switch to `consumer`/`provider` (commented on DOC-537).
- DOC-537 remaining: Storybook best-practices section (`storybook best practices` 46K impr), `what is a monorepo` retitle of `why-monorepos`, `project.json` / `nx commands` reference metas, brand defense (`nx` at position 2).
