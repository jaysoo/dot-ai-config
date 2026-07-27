# DOC-555: SEO page plan (Ahrefs US export, Jul 2026)

Linear: DOC-555 (https://linear.app/nxdev/issue/DOC-555)
Worktree: ~/projects/nx-worktrees/DOC-555 (branch DOC-555)
Source CSV: ~/Downloads/nx.dev-organic-keywords-domain-us--actual_2026-07-18_12-58-42.csv
Prior analysis: dot_ai/2026-07-18/tasks/ahrefs-keyword-opportunities.md

Status: IMPLEMENTED 2026-07-24 on branch DOC-555 (6 commits, validate-links pending). esbuild excluded per Jack.
Jack decisions: all of A (+ from-lerna migration guide, lerna tone "direct but softer"); B React+Angular only + MF prune; C6 = section on what-is-a-monorepo (own monorepo.tools, no dupe page); C7 yes; D full refreshes; all in one go; title "Nx vs Rush Stack".
Deferred follow-ups: (1) faster-builds-with-module-federation full v23 rewrite - needs docs-live-test, legacy aside added meanwhile; (2) bun catalogs mention in dependency-management - blocked until nx 23.2 ships (commit a772157828 unreleased); (3) nx-blog: link lerna-is-dead post -> /docs/kb/nx-vs-lerna (separate repo); (4) using-tailwind-css-with-module-federation terminology touch-up (skipped, low value).

## Current state (verified in repo)

- Comparison pages live flat in `astro-docs/src/content/docs/kb/` as `nx-vs-*.mdoc`, frontmatter `topics: ['Comparisons']`, `filter: 'type:Guides'`. Existing: turborepo, bazel, vite-plus, blacksmith, buildkite, depot, develocity. KB sidebar is filter-driven - new kb pages need NO sidebar.mts change.
- No Lerna docs page. `lerna` (1800v, KD54) ranks pos 10 and `lerna vs nx` pos 4 - both via blog `/blog/lerna-is-dead-long-live-lerna`. Old `/guides/lerna-and-nx` redirects OFF-SITE to lerna.js.org (nx-dev/_redirects).
- Zero Rush/rushstack content anywhere. Pure gap.
- MFE: one concept page `kb/micro-frontend-architecture.mdoc` catches ~30 keyword variants (pos 4-11, ~1,700/mo aggregate). Framework guides that exist are advanced/SSR-only (angular dynamic MF, angular SSR, react SSR, vite MF). No entry-level React/Angular/Next.js MFE landing pages. No Next.js MFE guide at all.
- Remote cache: `/remote-cache` redirects to `features/CI Features/remote-cache.mdoc` (Nx Replay). CI features pages exist (distribute-task-execution, flaky-tasks, etc.) but no page targets "build cache" / "ci caching" / "speed up ci" query language.
- DOC-549 (#36307, merged 2026-07-15) already shipped what-is-a-monorepo, monorepo-vs-polyrepo, npm/yarn/pnpm/bun workspaces, MFE/rspack refreshes. Export positions predate it - DO NOT touch those pages until mid-Aug Ahrefs re-pull.

## A. New comparison pages (required by Jack)

### 1. kb/nx-vs-lerna.mdoc - "Nx vs Lerna"
- FULL DRAFT ALREADY EXISTS: `dot_ai/2026-07-11/tasks/nx-vs-lerna-draft-shelved.mdoc` (written in DOC-549, pulled pre-merge). Shelved reason (2026-07-15 SUMMARY): Jack rethinking positioning - "compel existing Lerna users toward Nx, steer new users away". Revive + reposition rather than write from scratch.
- Positioning rework: draft's current tone is "complements more than competitors / Lerna covers coordinated releases". New tone per Jack: Lerna fine where it is, but decision guidance points new projects at Nx and gives existing Lerna users a concrete upgrade path (nx release parity, caching/affected/CI they don't have). Keep the "we maintain both" credibility + "Is Lerna dead?" FAQ (captures that query).
- Targets: `lerna` 1800v pos 10 (blog), `lerna vs nx` pos 4 (defend), is-lerna-dead long-tail.
- Slug change from draft: draft used /docs/guides/comparisons/nx-vs-lerna; comparisons now live at /docs/kb/ - fix internal links (draft links /docs/guides/comparisons/nx-vs-turborepo, /docs/concepts/decisions/why-monorepos etc. may be stale post-KB-rework).
- Internal links: from blog lerna-is-dead post -> new page; from what-is-a-monorepo Lerna mention; from adopting-nx guides. Note nx-dev/_redirects sends /guides/lerna-and-nx -> lerna.js.org (leave; different intent).

### 2. kb/nx-vs-rush-stack.mdoc - "Nx vs Rush Stack" (Jack chose Rush Stack title)
- Targets: `rush monorepo`, `rush vs nx`, `rushjs`, `rush stack` - zero ranking URLs today, greenfield.
- VERIFIED facts (subagent, 2026-07-24, sources rushjs.io/rushstack.io/npm/GitHub):
  - Rush Stack umbrella: Rush (orchestrator) + Heft + API Extractor/Documenter + Lockfile Explorer + eslint tooling. Microsoft-maintained, active (5.178.0 pub 2026-07-20, 36 commits/30d), still v5 since 2018.
  - Config-heavy: rush.json + common/config/rush/ many files; every project manually registered in projects array; docs recommend restructuring into category folders; per-project build script required.
  - pnpm-first in practice (npm/yarn support carries doc warnings); subspaces pnpm-only.
  - Task model: project-level scheduling by default; phased builds (_phase:build/test) for task-level - docs say "still under development". Watch mode graph-aware. No inferred tasks; BYO toolchain or Heft.
  - Caching: build cache EXPERIMENTAL per docs; BYO storage only (Azure Blob/S3/HTTP plugins); no hosted service; per-project rush-project.json output declarations.
  - CI distribution: cobuilds EXPERIMENTAL - clone-the-pipeline + shared cache + user-provisioned Redis lock provider; docs admit "nontrivial maintenance". No hosted orchestration, no flaky-test handling (absence verified in docs).
  - Versioning: rush change change-files + version policies (lockStep/individual) + rush publish. This is Rush's mature strength - comparable to nx release.
  - No code generators (rush init = repo config only). No import/module boundaries (approvedPackagesPolicy gates npm deps, not imports; eslint-plugin-packlets folder-level only). Plugin system still "(experimental)".
  - JS/TS only. MCP server exists (@rushstack/mcp-server, 2025+).
  - Users (self-reported): Microsoft (Azure SDK/OneDrive/SharePoint/O365), HBO Max, Wix, Telia. No comparison page on rushjs.io.
- Angle: respectful - Rush solves large-repo policy/determinism (Microsoft-scale pnpm rigor, dependency review policies, change-file discipline); Nx covers same orchestration ground with far less config (inferred tasks vs manual registration), first-party remote cache + CI distribution (vs experimental BYO-storage/Redis cobuilds), generators/migrations, boundaries, polyglot. Comparison table mirrors nx-vs-turborepo structure.
- Careful phrasing: "experimental" labels are Rush docs' OWN words - cite as such. UNVERIFIED items (roadmap, community plugins) stay out of the page.

Both pages: no sidebar change, no redirects needed (new URLs). Style pass via nx-docs-style-check + STYLE_GUIDE structural pass.

## B. Tier 2 - MFE cluster split (biggest aggregate win, ~1,700/mo)

New entry-level framework landing pages in kb/ (concept page keeps head terms):

1. `kb/react-micro-frontends.mdoc` - "Micro Frontends with React" (or "React Micro Frontends: ..."). Targets: micro frontend react (100v pos 10), react mfe, react module federation, module federation react (70v pos 9), microfrontend react. Largest sub-cluster.
2. `kb/angular-micro-frontends.mdoc` - "Micro Frontends with Angular". Targets: angular module federation (100v pos 7), micro frontend angular (50v pos 6), angular mfe, mfe angular. Links down to existing advanced guides (dynamic MF, SSR).
3. `kb/nextjs-micro-frontends.mdoc` - "Micro Frontends with Next.js". Targets: next js micro frontend (100v, KD3, pos 10). HYPOTHESIS NEEDS VERIFICATION: Nx's Next.js Module Federation support status (withModuleFederation for Next deprecated?). If MF-for-Next is dead, page angle = honest approaches guide (multi-zones vs MF vs Nx monorepo of Next apps). Verify before writing.

Cross-linking: concept page gets a "By framework" section linking all three; each guide links back to concept for head terms.

## B2. MF content prune (audit findings, 2026-07-24)

Jack: only React + Angular MFE landing pages (no Next.js); prune out-of-date/duplicate MF content.

Audit verdicts (subagent, verified against v23 consumer/provider direction):
- CURRENT/KEEP: kb/micro-frontend-architecture (baseline), kb/consumer-and-provider (canonical generators), kb/vite-module-federation, technologies/module-federation/introduction (canonical why-Nx+MF), kb/using-tailwind-css-with-module-federation (terminology touch-up only), kb/nx-module-federation-plugin (KEEP as legacy rspack ref + legacy banner).
- DELETE + redirect -> kb/consumer-and-provider: create-a-host, create-a-remote (60% terminal dumps, broken ending), federate-a-module (all teach @nx/react:host etc. - deprecated v23, removed v24), react-module-federation-with-ssr + angular-module-federation-with-ssr (literally same page twice; consumer-and-provider#ssr is honest replacement).
- DELETE + redirect -> technologies/module-federation/introduction: module-federation-and-nx (webpack-era overview; useful bits already in baseline/faster-builds).
- DELETE + redirect -> new Angular MF landing: dynamic-module-federation-with-angular (579 lines teaching deprecated @nx/angular:host --dynamic; contradicts baseline "Angular MF unsupported, use native-federation").
- MERGE: nx-module-federation-dev-server-plugin -> nx-module-federation-plugin (identical ~80-line Deployment section duplicated); nx-module-federation-technical-overview -> fold into plugin legacy page or label Legacy.
- REFRESH: faster-builds-with-module-federation (most-linked legacy page; era-neutral caching/DTE argument; rewrite commands to consumer/provider), manage-library-versions-with-module-federation (Shared API concept era-neutral; stale @nx/webpack import; rewrite examples to @module-federation/vite shared config).
- DELETE: technologies/module-federation/concepts/index.mdoc + Guides/index.mdoc (empty dirs, dead index cards).
- New React landing = thin hub (link baseline/consumer-provider/vite/introduction + react-mfe-template quickstart; do NOT restate federation({...}) config a 4th time). New Angular landing = owns native-federation story, redirect target for the 2 deleted Angular pages.
- All deletes need netlify.toml + astro.config.mjs redirects (both files, before /docs/* catch-all).

## C. Tier 3 - gap pages

1. `kb/monorepo-tools.mdoc` - "Monorepo Tools" comparison/overview. Targets: monorepo tools, best monorepo tools, turborepo alternative(s). Hub page: honest tool landscape (Nx, Turborepo, Lerna, Rush, Bazel, moon, Pants...) with links to every nx-vs-* page. Doubles as internal-link hub boosting all comparison pages.
2. `turborepo alternative` - cover via monorepo-tools page + possibly an H2 on nx-vs-turborepo. No dedicated page (thin/doorway risk).
3. Nx Cloud funnel (`build cache`, `ci caching`, `speed up ci`, `monorepo ci`): one strong concept page (e.g. `kb/ci-caching.mdoc` "CI Caching: Speed Up CI with a Build Cache") rather than several thin ones. Links to remote-cache feature page, DTE, flaky tasks. Second wave.
4. `react monorepo` / `vite monorepo` / `nestjs monorepo` setup guides - mirror workspaces-pages pattern. Third wave, after re-pull.

## D. Striking-distance page refreshes (audit findings 2026-07-24; Jack: refresh especially org-of-monorepo pages)

Structural: kb rework #36414 (2026-07-23) moved ALL concepts/decisions pages to kb/ with redirects. kb/folder-structure IS the page (no dupe). No #anchor deep-links inbound anywhere - headings free to restructure. concepts/Decisions/index.mdoc = 9-line dead stub (empty card index) - delete + redirect.

| Page | Scope | Notes |
|---|---|---|
| kb/folder-structure | FULL-REWRITE | 61 lines, 2019-era Acme Airlines example, featured. Missing: "monorepo structure" wording, packages/ flat vs apps+libs grouped layouts, library-type taxonomy (feature/ui/data-access/util shown but never explained), naming conventions, domain vs type organization, nx g move. Keep July "change it later" section. Target: monorepo structure 150v KD3 pos 9 |
| guides/Nx Release/configure-custom-registries | LIGHT | Untouched ~1.5y. Scope-per-registry section is right content, buried. Add npmrc/scoped-packages to headings+desc, npm v10->v11 links, concrete registry names (GitHub Packages/Artifactory/Azure Artifacts), local-registry-testing aside. project.json-only examples need nx.json variant |
| kb/project-size | LIGHT+ | Untouched since 2025. Lowercase-i headings, raw help.github.com link, blockquote-not-aside. Add granularity heuristics + ts-solution angle. Consider retitle toward "project granularity" query |
| kb/code-ownership | LIGHT | Freshen happynrwlapp example, non-GitHub hosts, heading tighten |
| kb/dependency-management | LIGHT | Add bun catalogs to catalog aside (a772157828 just shipped) |
| kb/nx-and-angular | NITS | Refreshed #36276 2026-07-08. Casing ("Why should i use"), Twitter link, table pruning. Don't rewrite. angular cli 1700v KD69 |
| what-is-a-monorepo, monorepo-vs-polyrepo | NO ACTION | DOC-549 rewrote 07-15 (except C6 tools section on what-is-a-monorepo) |

Inbound-link map captured in audit (no orphan risk).

HOLD until mid-Aug re-pull (DOC-549 already refreshed): homepage/what-is-a-monorepo (`monorepo` 6400v), pnpm/npm/yarn workspaces, rspack, MFE concept-page content itself (framework guides in B are additive, OK to build now).

## E. CTR mechanics (applies to all above)

- Frontmatter `description` = meta description: keyword-first, benefit phrasing, <=155 chars.
- Titles keyword-first ("Nx vs Lerna", "Micro Frontends with React").
- GEO heading structure (most head terms show AI Overview) - question-form H2s, definition-first paragraphs, per Caleb's GEO pattern.

## Proposed execution order

1. A: nx-vs-lerna + nx-vs-rush (required, greenfield, no DOC-549 overlap).
2. B: MFE React + Angular guides; verify Next.js MF status, then Next.js guide.
3. C1: monorepo-tools hub page.
4. D: title/desc tuning of 4 striking-distance pages.
5. C3: CI-caching concept page (Nx Cloud funnel).
6. Mid-Aug: re-pull Ahrefs, then decide on DOC-549 page follow-ups + C4.

Each wave = own PR. Style: nx-docs-style-check skill mandatory after edits; validate-links before push; redirects only needed if anything moves (nothing moves in this plan).
