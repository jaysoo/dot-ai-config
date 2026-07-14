# DOC-549: Refresh/create high-impact pages - FINAL SPEC (post SEO panel)

Linear: https://linear.app/nxdev/issue/DOC-549/refreshcreate-high-impact-pages
Branch: DOC-549 (worktree /Users/jack/projects/nx-worktrees/DOC-549)
Polygraph session: doc-549-0ca12dc9
Panel: 4 SEO experts (intent/CTR, structure/cannibalization, competition, AI-search/GEO) reviewed v1 plan 2026-07-11; this spec incorporates their findings.

## Goals

1. Monorepo searchers MUST see Nx first; content compelling to users who don't know Nx.
2. pnpm/npm/yarn/bun workspace searchers MUST see Nx first; content useful even if they never adopt Nx.
3. All pages current: Nx v23, Nx Cloud (sandboxing, resource usage, self-healing CI), AI/agents. No stale screenshots.
4. Surface Nx Cloud where CI is relevant (low priority).

## GSC data (key queries)

| Query | Impressions | CTR | Avg pos |
| --- | --- | --- | --- |
| pnpm workspace | 450,058 | <0.01% | 9.12 |
| yarn workspaces | 63,824 | <0.01% | 9.92 |
| what is a monorepo | 58,896 | 0.02% | 6.67 |
| learn pnpm free | 19,919 | 0% | 6.03 |
| pnpm tutorial | 9,157 | 0% | 10.41 |
| monorepo | 8,471 | 0.86% | 5.33 |
| pnpm best practices | 5,731 | 0% | 10.93 |
| lerna monorepo | 5,622 | 0% | 3.11 |
| micro frontend (all variants) | ~6,000 | ~1% | 4-7 |
| lerna | 1,426 | 0% | 6.97 |
| monorepo vs polyrepo | 1,404 | 1.42% | 3.76 |
| rspack | 1,677 | 0.36% | 6.18 |
| eslint flat config migration (variants) | ~4,700 | ~0% | 5-10 |
| how to read root env in monorepo | 1,765 | 0% | 9.73 |

DROPPED as unwinnable (navigational): "pnpm workspaces official docs" (pnpm.io), "nx github" (repo lookup), bare "rspack" position 1 (rspack.rs). Do not shape content for these; one trust-building link to the official property instead.

## Verified facts (2026-07-11) - use these, date volatile claims inline

- lerna latest: 9.0.7. Nx team stewards Lerna since May 2022. `lerna run` delegates to Nx task runner (VERIFY exact version this began - useNx added ~5.1, default since 6; check lerna.js.org before committing).
- eslint latest: 10.7.0. Flat config default since ESLint v9 (2024). VERIFY v10 removed eslintrc support (eslint.org blog) before claiming.
- VERIFY: eslint-config-next may now ship native flat config exports (no FlatCompat needed on new versions); next lint removed in Next.js 16. Lead Next.js section with the native path if true; FlatCompat for older versions.
- @module-federation/vite: 1.16.16. @rspack/core: 2.1.3 (@nx/rspack supports ^1 || ^2). pnpm: 11.11.0. pnpm catalogs shipped in pnpm 9.5 (VERIFY).
- Nx v23: MF `host`/`remote` generators DEPRECATED -> `@nx/react:consumer` / `@nx/react:provider` (vite default, @module-federation/vite, dynamic federation via PROVIDERS in src/mf.ts). Angular MF no longer supported -> @angular-architects/native-federation. See technologies/module-federation/consumer-and-provider.mdoc.
- Polygraph link: https://trypolygraph.com/ . New Cloud onboarding: /docs/getting-started/nx-cloud .
- Cloud feature pages under "features/CI Features/": sandboxing, resource-usage, self-healing-ci, flaky-tasks, remote-cache, distribute-task-execution, split-e2e-tasks.
- GHA workflow canonical shape: see packages/workspace/src/generators/ci-workflow/files/github/ template + getting-started/setup-ci.mdoc snippets (checkout fetch-depth:0, nrwl/nx-set-shas@v5, `npx nx affected -t lint test build`, optional `npx nx start-ci-run --distribute-on="3 linux-medium-js"`, `npx nx fix-ci` if:always()).
- Starlight lastUpdated: true (freshness renders). Sidebar labels are explicit in sidebar.mts for: github-integration ("GitHub integration"), workspace pages ("Use pnpm workspaces with Nx" etc. - UPDATE these 4 labels), why-monorepos ("Why monorepos"), overview ("Monorepo or polyrepo").

## Cross-cutting rules (ALL drafts)

1. CANONICAL DEFINITION, verbatim wherever a monorepo is defined: "A monorepo is a single repository containing multiple distinct projects, with well-defined relationships between them." (matches monorepo.tools, which Nx maintains). Full treatment ONLY on why-monorepos; other pages use one sentence + link.
2. First 40-60 words of every page = self-contained answer to the target query, quotable out of context. No "this page covers", no "Nx provides" as opening subject.
3. Exactly one 40-60 word direct-answer block per key question H2. Question-phrased H2s where they match query language. How-to content = numbered steps, not prose.
4. Meta description: exact query phrase in first ~60 chars, differentiator at the end, ~150-160 chars.
5. Date volatile claims inline: "as of Nx v23", "since May 2022", "pnpm catalogs (pnpm 9.5+)", "default since ESLint v9 (2024)".
6. Comparison tables: plain-text one-line cells, no glyphs/checkmarks, <= 8 rows, one-sentence verdict directly above the table.
7. Nx-free-until-the-end rule for capture pages (workspace pages, flat-config general section): full standalone value first; Nx appears in ONE clearly-labeled final section framed as the limits of the current tool, plus the Nx-automation section on flat-config. No mid-page upsells.
8. Honest counter-content is the differentiator: "when NOT to use X" sections on why-monorepos, overview, mfe-architecture.
9. Anchor stability: overview + mfe rank already. Keep existing H2 text where feasible; when renaming, repoint all internal links (final anchor sweep). Treat heading renames as breaking.
10. ASCII punctuation only (- and ->). Follow astro-docs/STYLE_GUIDE.md (voice, anti-AI rules, no banned phrases). Markdoc conventions: code-fence filename = first-line comment; tabs/asides syntax; blank line before {% /aside %} when it contains lists.
11. No unverifiable absolutes. Verify third-party claims before committing (npm view, official changelogs/blogs). NEVER guess CLI flags.
12. FAQ section (3-4 questions, 1-3 sentence self-contained answers) ONLY on: why-monorepos, workspace pages, nx-vs-lerna, flat-config. Use plain H2 "Frequently asked questions" + H3 questions.
13. No new screenshots. Existing stale screenshots get removed; replace their information with declarative text lists (LLM-citable).

## Internal-link map (mandatory, keep symmetric)

- why-monorepos (hub): -> overview (one sentence for vs-polyrepo, NO table here), -> monorepo.tools (tool landscape), -> workspace pages (FAQ "Do I need special tooling"), -> enhance-AI / getting-started/ai-setup (AI section).
- overview: -> why-monorepos (definition; do NOT duplicate full definition), -> trypolygraph.com (one attributed sentence), keep existing links.
- each workspace page: -> other 3 siblings (identical compact end-of-page block), -> why-monorepos, -> /docs/guides/adopting-nx/adding-to-monorepo (canonical adoption deep-dive; do NOT replicate its content), Nx section -> cache-task-results/affected/setup-ci as today.
- nx-vs-lerna: -> lerna.js.org/docs/lerna-and-nx (how they work together; we own "which to choose"), -> nx-vs-turborepo (one sentence, no 3-way table), -> /docs/features/manage-releases, -> adding-to-monorepo.
- github-integration: -> guides/nx-cloud/source-control-integration/github (app-install mechanics live THERE), -> getting-started/nx-cloud (onboarding), -> setup-ci, self-healing-ci, flaky-tasks, remote-cache, distribute-task-execution.
- mfe-architecture: -> module-federation intro + vite-module-federation + consumer-and-provider, -> github.com/nrwl/mf-examples, Angular H2 -> @angular-architects/native-federation.
- rspack-intro: -> rspack.rs (official), keep existing tech links.
- flat-config: -> eslint.org migration guide (compact checklist links out), -> @nx/eslint pages.

## Per-page spec

### 1. why-monorepos.mdoc - title: "What is a Monorepo?"

description: "A monorepo is a single repository containing multiple projects. Learn the benefits, how it differs from a monolith, and why AI agents work better in one."
Opening: canonical definition verbatim, term bolded, + one sentence on what it is NOT (a monolith). Differentiate wording beyond the shared first sentence from monorepo.tools' page (avoid duplicate first paragraph).
H2 skeleton:
- "What are the benefits of a monorepo?" (keep/tighten existing 4 benefits)
- "Is a monorepo the same as a monolith?" (2-3 sentence direct answer; top PAA)
- "Monorepo examples" (Google, Meta, Microsoft one-liner facts)
- "Why isn't code collocation enough?" (modernize existing section; REMOVE dead blog.nrwl.io lerna link; mention Lerna/workspaces solve installs not scale, link nx-vs-lerna + workspace pages)
- "When is a monorepo the wrong choice?" (honest 3-4 bullets: VCS scale, forced tooling investment, access control - answers Matt Klein-style objections)
- "Why do AI coding agents work better in monorepos?" (first sentence standalone claim: full dependency graph + atomic cross-project changes; guardrails: module boundaries, generators; self-healing CI; link enhance-AI + ai-setup)
- "How Nx makes a monorepo scale" (replaces "Nx + code collocation = monorepo"; current features: affected, caching, boundaries, generators, Nx Cloud + sandboxing; REMOVE "Nrwl" naming)
- "Frequently asked questions": Is a monorepo the same as a monolith? -> short cross-ref; What companies use monorepos?; Do I need special tooling for a monorepo? (workspaces for linking + build system for scale, links workspace pages)
Also: link monorepo.tools for tool landscape. NO vs-polyrepo table (one sentence -> overview).

### 2. overview.mdoc - title unchanged "Monorepo vs Polyrepo: How to Choose"

description: "Monorepo vs polyrepo: a side-by-side comparison of code sharing, CI, and ownership tradeoffs, plus a framework for choosing the right repo strategy."
Keep decision-framed opening (do NOT add a competing full definition - link why-monorepos). Add one-sentence verdict + tradeoffs table high on page:
- Verdict sentence: "Monorepos optimize for atomic changes and shared tooling; polyrepos optimize for team isolation and independent release cadence." (or similar)
- H2 "Monorepo vs polyrepo at a glance": <= 8 rows, dimensions: code sharing, atomic changes, CI cost, access control, dependency versions, tooling overhead, team autonomy. Plain text cells.
- H2 "When should you choose a polyrepo?" honest 40-60 word answer (steelman: VCS scale, permissions, tooling investment).
- H2 "Can AI agents work across polyrepos?" answer-first; ONE attributed sentence: "Polygraph, from the Nx team, gives AI agents cross-repository context in polyrepo setups" + link. No more than that (vendor-bias risk).
- Keep organizational-decisions framework + "How many repositories?" section (preserve those H2 anchors).

### 3. workspace pages (4 files, ONE agent) - titles: "<tool> Workspaces Tutorial: Setup, Commands, and Best Practices"

- pnpm desc: "Learn pnpm workspaces: pnpm-workspace.yaml setup, the workspace: protocol, running scripts with --filter, catalogs, and best practices that scale."
- npm desc: "Learn npm workspaces: the workspaces field, installing and linking local packages, running scripts with --workspace flags, and best practices that scale."
- yarn desc: "Learn Yarn workspaces: setup, linking packages, running scripts with yarn workspaces foreach, hoisting behavior, and best practices for growing monorepos."
- bun desc: "Learn Bun workspaces: setup, linking packages with workspace:*, running scripts with --filter, and best practices for fast monorepos."
Rules:
- Opening = citable definition of THAT tool's workspaces feature (40-60 words, tool-native terminology).
- Setup as numbered-step headings ("1. Create pnpm-workspace.yaml", "2. Add packages", "3. Link them with workspace:").
- NO H2 string repeats verbatim across the 4 pages except the shared comparison-table H2 and FAQ H2.
- pnpm-unique: "Run scripts across packages with --filter" (cookbook: changed-since, dependents), "Share dependency versions with pnpm catalogs" (pnpm 9.5+), "Share environment variables across packages" (root .env - ONLY on pnpm page; targets "how to read root env in monorepo"), workspace:^ vs workspace:* semantics.
- npm-unique: --workspace/-w and --workspaces flags, lack of built-in filtering (and what to do), install/dedupe behavior.
- yarn-unique: "yarn workspaces foreach", hoisting behavior Q ("Do Yarn workspaces hoist dependencies?"), constraints, keep Yarn PnP aside.
- bun-unique: bun install speed, --filter, maturity caveats (honest).
- Shared on all 4: ONE cross-tool command comparison table (install all / add dep to one package / run script everywhere / filter to one package - pnpm vs npm vs Yarn vs Bun) under identical H2 "Compare workspace commands across package managers" (stable anchor); identical end-of-page "other package managers" links block + why-monorepos link.
- One trust link to the official docs (pnpm.io/workspaces etc.) near the top.
- Nx section: single final H2, question-phrased: "Do <tool> workspaces replace a monorepo tool?" - honest 2-sentence answer (workspaces = linking; no task graph, caching, or affected), then `npx nx@latest init` preserving scripts + link adding-to-monorepo + setup-ci. NOTHING Nx-flavored above this section.
- FAQ (per tool, 3 questions max): e.g. pnpm: "What does workspace:* mean?", "pnpm workspaces vs npm workspaces", "Can I use pnpm workspaces without a monorepo tool?".
- Update the 4 sidebar.mts labels to: "pnpm workspaces", "npm workspaces", "Yarn workspaces", "Bun workspaces".
- Keep existing course/adding-to-monorepo links.

### 4. NEW nx-vs-lerna.mdoc - title: "Nx vs Lerna: Which Monorepo Tool Should You Use?"

description: "Nx vs Lerna compared by the team that maintains both: task running, caching, versioning and publishing with nx release, and when to use each."
Model on nx-vs-turborepo.mdoc structure. First sentence leads with "the Nx team maintains both tools".
H2 skeleton:
- "What is Nx?" / "What is Lerna?" (short)
- "Nx vs Lerna at a glance" (verdict sentence: "Lerna focuses on versioning and publishing npm packages; Nx is a full build platform - and modern Lerna runs tasks through Nx." + table)
- "Is Lerna still maintained?" (first sentence: "Yes - the Nx team has maintained Lerna since May 2022, and Lerna 9 is actively released." - captures "is lerna dead")
- "How modern Lerna uses Nx" (lerna run delegates to Nx; verify version claim)
- "When Lerna is enough" (existing lerna repos, version/publish-centric workflows) + compact "Lerna quickstart" code block (init/run/publish - tutorial-intent spillover)
- "When to use Nx directly" (nx release covers versioning/publishing; caching/affected/CI/plugins)
- "Migrate from Lerna to Nx" (hook: modern Lerna users already run Nx under the hood; mostly adopting nx release)
- "Frequently asked questions": Is Lerna dead?; Can Lerna and Nx be used together?; Should I migrate from Lerna to Nx?
One sentence + link to nx-vs-turborepo near top (3-way intent). Link lerna.js.org/docs/lerna-and-nx.
Sidebar: Comparisons group, right after "Nx vs Turborepo" + card in knowledge-base/comparisons/index.mdoc (same style).
NOTE: "lerna monorepo" (pos 3.11) is tutorial intent owned by lerna.js.org (ours) - this page targets decision intent; don't chase the tutorial query.

### 5. micro-frontend-architecture.mdoc - title: "What is Micro Frontend Architecture?"

description: "Micro frontends split a web app into independently deployed modules. Learn when to use them, when not to, and how to build them with Module Federation."
Add frontmatter sidebar.label: "Micro Frontend Architecture" (keep sidebar stable).
Opening definition, framework-neutral, both spellings in first 60 words: "Micro frontend (also written microfrontend) architecture splits a web application's frontend into smaller applications that separate teams develop, test, and deploy independently."
Early sentence: "this page shows a working implementation, not just diagrams".
H2 skeleton:
- "When should you use micro frontends?" (keep existing honest guidance)
- "When should you avoid micro frontends?" (bullet list - most citable asset)
- Benefits/tradeoffs table (independent deploys, team autonomy vs bundle duplication, version skew, testing complexity)
- "Micro frontends with Module Federation" - architecture overview (consumer/provider naming), dated supersession sentence: "As of Nx v23, the host and remote generators are replaced by consumer and provider." Generation examples: `nx g @nx/react:consumer` / `:provider` with --bundler=vite; @module-federation/vite vite.config.ts federation plugin example + shared-libraries strategy shown with the Vite plugin (NOT our deprecated wrapper/module-federation.config.ts).
- Composition-approach table (Module Federation vs build-time packages vs iframes: independent deploys, shared deps, runtime cost).
- "Why build micro frontends in a monorepo?" (answers MFE's top pain: shared dependency version drift + integration testing across independent deploys; affected-based deploys; boundaries)
- "How do you deploy micro frontends?" (keep existing deployment strategies; link distribute-task-execution)
- "Micro frontends with Angular" (own H2: Nx MF for Angular retired; @angular-architects/native-federation is the path)
- Keep "Strategic collaboration over micro frontend anarchy" (tighten).
Links: vite-module-federation guide, consumer-and-provider page, mf-examples repo. Update/keep mfe-dep-graph.png only if still accurate (consumer/provider naming); else drop.

### 6. github-integration.mdoc - title: "GitHub Actions CI for Monorepos with Nx"

description: "Speed up GitHub Actions for your monorepo with Nx: run only affected projects, share a remote cache, and add PR insights and self-healing CI with Nx Cloud."
Sidebar label stays "GitHub integration" (explicit in sidebar.mts - no change needed).
DEDUP: guides/Nx Cloud/Source Control Integration/github.mdoc is ALSO titled "GitHub Integration" - this feature page owns "GHA + monorepo speed" intent; the guide owns app-install/setup mechanics. MOVE the three "Connect ... initial setup" H2 flows to a short paragraph linking that guide. ALSO retitle the guide to "Nx Cloud GitHub App" (frontmatter title + description only, slug unchanged, sidebar label "GitHub" stays).
H2 skeleton:
- "How does Nx speed up GitHub Actions?" (40-60 word answer: affected + remote cache + distribution; concrete sourced number only if one exists on-site - do not invent)
- "Run Nx on GitHub Actions" - caption sentence "A complete GitHub Actions workflow for an Nx monorepo:" + full copy-pasteable YAML that works WITHOUT Nx Cloud (checkout fetch-depth:0, setup-node, install, nrwl/nx-set-shas@v5, `npx nx affected -t lint test build`), verified against ci-workflow generator template.
- "Run only affected projects in GitHub Actions" (nx affected + nx-set-shas explanation, NX_BASE/NX_HEAD)
- "Add remote caching and task distribution" (Nx Cloud delta: connect via /docs/getting-started/nx-cloud, `nx connect`, start-ci-run --distribute-on, sandboxing/resource-usage links where natural)
- "What the Nx Cloud GitHub app adds to your PRs" (text list replacing screenshots: inline task statuses, links to structured logs, Nx Replay, self-healing CI fix comments; link self-healing-ci + flaky-tasks)
- "Connect your repository" (short: link source-control-integration guide + getting-started/nx-cloud + keep the two call_to_action blocks if useful; org access control one paragraph + link)
REMOVE all 3 stale .avif screenshots (github-onboarding, github-pr-bot, github-user-management) + delete asset files if unreferenced elsewhere.
Risk checked: setup-ci page targets "set up CI" intent (tutorial); this page targets GHA+monorepo feature intent - complementary, cross-link, don't duplicate the full onboarding narrative.

### 7. rspack introduction.mdoc - title unchanged "Nx with Rspack"

description: "Rspack is a Rust-based bundler with a webpack-compatible API. Learn how to use Rspack in an Nx monorepo with caching, affected builds, and fast CI."
First paragraph (replaces the meaningless plugin blurb; THIS becomes the SERP snippet): first sentence <= 25 words: "Rspack is a Rust-based JavaScript bundler with a webpack-compatible API, built as a drop-in replacement for webpack with much faster builds." Then 1-2 sentences: who it's for + what this page covers (Rspack at monorepo scale with Nx).
- H2 "What is Rspack?" - 2-3 verified sentences + link rspack.rs; speed claims attributed ("per the Rspack team's benchmarks") with version; pivot to monorepo scale within 3-4 sentences.
- H3 "Is Rspack a drop-in replacement for webpack?" honest 2-sentence answer (most loaders/plugins work; some webpack plugins do not).
- Keep Requirements/Installation/inferred-tasks sections as-is (reference value). State version window as data: "@nx/rspack supports Rspack 1 and 2 (as of Nx v23)".
- Rename CI section H2 to "Why use Rspack in a monorepo?" (caching Rspack builds, affected, migrating many webpack configs; link setup-ci).

### 8. flat-config.mdoc - title: "Migrate from .eslintrc to ESLint Flat Config"

description: "Migrate .eslintrc to ESLint flat config step by step: eslint.config.mjs setup, FlatCompat for legacy configs, Next.js gotchas, and Nx automation."
sidebar.label: "Migrate to flat config"
H2 skeleton:
- "What is ESLint flat config?" (2-sentence self-contained answer + dated status: default since ESLint v9 (2024); v10 status VERIFIED before claiming - if true, "ESLint 10 no longer reads .eslintrc" is the CTR hook for intro + description)
- "How do I migrate to flat config?" - compact numbered steps (1. Create eslint.config.mjs, 2. Convert env/parser to languageOptions, 3. Replace overrides with config objects, 4. Bridge legacy shareable configs with FlatCompat) - keep tight, link eslint.org migration guide for exhaustive mapping (don't compete with it).
- "Migrate a Next.js project to flat config" (own H2 - the top query cluster): VERIFY eslint-config-next native flat exports; lead with native path, FlatCompat for older versions; note next lint removal in Next 16 if verified.
  - H3 with literal error text: "Fix: TypeError: Converting circular structure to JSON with FlatCompat and next/core-web-vitals" (paste-the-error retrieval hook) + the actual fix.
- "Automate the migration with Nx" (`nx g @nx/eslint:convert-to-flat-config` - automation is what eslint.org can't offer; keep correctness/FlatCompat caveat)
- Keep the 3-tab Flat/JSON/JS comparison (good asset).
- "Frequently asked questions": Can I keep using .eslintrc?; How do I use next/core-web-vitals with flat config?; Is flat config required in ESLint 10? (all pending verification)
Update intro to be tool-agnostic (searchers are generic ESLint users; Nx enters at the automation section).

## Process

1. [x] Research current pages
2. [x] SEO panel review (workflow wf_dbcef87d-880, 4/4)
3. [x] Synthesized final spec (this file)
4. [x] Drafting agents (8 groups, parallel, edit in place) - wf_37e19f17-bf6, 8/8
5. [x] Review round 1 (3 lenses x 8 groups, 117 findings: 9 must / 56 should / 52 nit) -> fixes applied (wf_745f32bf-8bc + wf_89ba54c7-cee; first fixer pass no-op'd on an interpolation bug, redone via findings files)
6. [x] Review round 2 (fresh eyes + cross-page consistency + reader sim; 4 groups clean) -> fixes (wf_9ffcea6a-aad)
7. [x] prettier + vale (0/0/0) + nx-docs-style-check skill + markdoc tag balance + anchor sweep + validate-links (all pass)
8. [x] Commit deee41f65e (squashed, docs(misc)), pushed via Polygraph, draft PR https://github.com/nrwl/nx/pull/36307

## Assumptions (flagged to Jack)

- One PR, single squashed commit on DOC-549.
- Screenshots removed, not replaced.
- URLs unchanged; titles/h1s change on why-monorepos, workspace pages, mfe, github-integration, flat-config (+ source-control github guide dedup retitle). Sidebar labels stable except 4 workspace labels.
- New slug: /docs/guides/comparisons/nx-vs-lerna.
- Out of scope: "nx workspace" 855K-impression anomaly; FAQPage JSON-LD (future).
