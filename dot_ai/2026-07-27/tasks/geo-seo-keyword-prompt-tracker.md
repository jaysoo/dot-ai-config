# Acquisition tracker: SEO keywords + AI prompts (GEO)

**Date:** 2026-07-27
**Target:** Notion "Nx Cloud Acquisition & Activation Initiatives" -> Acquisition section
(https://app.notion.com/p/3a569f3c238780cca5f0d3374cd89de9)
**Eval tools:** Ahrefs (SEO positions/volume) + Gauge (AI visibility/citations)

## Sources

- `dot_ai/2026-07-18/tasks/ahrefs-keyword-opportunities.md` - Ahrefs US organic export 2026-07-18 (251 kw)
- `dot_ai/2026-06-23/tasks/seo-gsc-query-analysis.md` - GSC 3-month, 208K clicks / 16M impr
- `dot_ai/2026-07-22/tasks/gauge-ai-sentiment-nx-docs-action-items.md` - Gauge trial, prompt-set baselines
- `dot_ai/2026-07-24/tasks/doc-555-seo-page-plan.md` - page plan already in flight (DOC-555)
- `dot_ai/2026-07-24/tasks/gauge-usefulness-writeup.md` - Gauge subscription verdict

## Caveats to carry into the Notion page

1. **Ahrefs positions predate DOC-549** (#36307, merged 2026-07-15). Re-pull mid-August before judging any monorepo/workspaces page.
2. **Gauge is $599/mo, 6x over the $100 cap - not subscribing.** Baselines below were captured during trial. After trial, same prompts run as a DIY monthly battery (logged-out ChatGPT/Claude/Perplexity/Gemini).
3. **Gauge percentages are synthetic** (its own prompts, logged-out, stochastic). Track relative deltas on a fixed prompt set. Never quote prompt-volume numbers.
4. Head terms (`monorepo`, `nx workspace`, `pnpm workspace`) are AI-Overview-capped - chase citations, not clicks.

---

## A. SEO keywords (Ahrefs)

Baseline = Ahrefs US export 2026-07-18 unless marked GSC. "Gap" = no ranking nx.dev URL.

### A1. Unbranded CI + caching (the stated focus - weakest coverage)

| Keyword | Vol | KD | Pos | Current URL | Status |
|---|---|---|---|---|---|
| build cache | - | - | Gap | none | Planned: kb/ci-caching (DOC-555 C3) |
| ci caching | - | - | Gap | none | Planned: kb/ci-caching |
| speed up ci | - | - | Gap | none | Planned: kb/ci-caching |
| monorepo ci | - | - | Gap | none | Planned: kb/ci-caching |
| monorepo ci/cd | - | - | Gap | none | Planned: CI/CD best-practices KB (H2) |
| distributed task execution | - | - | Gap | none | Feature docs exist, not query-shaped |
| flaky tests ci | - | - | Gap | none | Feature page exists, not query-shaped |
| remote cache | 20 | 25 | 9 | /remote-cache -> features/remote-cache | Live, weak volume |
| reduce ci costs / ci compute cost | - | - | Gap | none | Cost framing (H4) |

### A2. CI observability (NO baseline - needs its own Ahrefs pull)

Not in the 2026-07-18 export. Candidate set to seed the next pull:
`ci observability`, `build observability`, `ci analytics`, `ci metrics dashboard`,
`ci pipeline monitoring`, `build performance monitoring`, `flaky test detection`,
`test flakiness detection`, `ci insights`, `developer productivity metrics`.

Action: pull these in Ahrefs Keywords Explorer before committing content.

### A3. Monorepo core

| Keyword | Vol | KD | Pos | Current URL |
|---|---|---|---|---|
| monorepo | 6400 | 48 | 15 | nx.dev homepage (DOC-549 shipped what-is-a-monorepo since) |
| monorepo structure | 150 | 3 | 9 | kb/folder-structure (full rewrite planned, DOC-555 D) |
| monorepo vs | 100 | 3 | 11 | concepts/decisions/overview |
| monorepo vs polyrepo | GSC 4,573 impr | - | 4.2 | kb/monorepo-vs-polyrepo |
| monorepo tools | GSC 1,175 impr | - | 5.2 | (we also own monorepo.tools) - kb/monorepo-tools planned |
| best monorepo tools | - | - | Gap | listicle gap; outreach play, not self-authored |
| turborepo alternative(s) | - | - | Gap | cover via kb/monorepo-tools |
| monorepo tutorial | - | - | Gap | none |

### A4. Workspaces

| Keyword | Vol | KD | Pos | Current URL |
|---|---|---|---|---|
| pnpm workspace | GSC 2.6M impr | - | 8.9 | blog/setup-a-monorepo-with-pnpm... |
| pnpm workspaces | 300 | 30 | 10 | same blog |
| npm workspaces | - | - | Gap* | DOC-549 shipped a page - re-pull to confirm |
| yarn workspaces | - | - | Gap* | DOC-549 shipped a page - re-pull to confirm |
| nx workspace | GSC 4.0M impr | - | 1.0 | /docs/reference/workspace (intent mismatch, AI-capped) |

### A5. Micro frontends / module federation (~1,700/mo aggregate)

| Keyword | Vol | KD | Pos | Current URL |
|---|---|---|---|---|
| micro frontend | GSC 6,502 impr | - | 6.6 | kb/micro-frontend-architecture |
| module federation | GSC 5,549 impr | - | 7.7 | same |
| micro frontend architecture | GSC 5,269 impr | - | 4.9 | same |
| microfrontend | GSC 4,345 impr | - | 7.0 | same |
| micro frontend react | 100 | - | 10 | same -> kb/react-micro-frontends planned |
| angular module federation | 100 | - | 7 | same -> kb/angular-micro-frontends planned |
| next js micro frontend | 100 | 3 | 10 | same (Next.js page dropped per Jack) |
| what is micro frontend | 90 | 5 | 11 | same |
| module federation react | 70 | 22 | 9 | module-federation-and-nx (slated for delete+redirect) |
| micro frontend angular | 50 | - | 6 | concept page |

### A6. Framework monorepo setup

| Keyword | Vol/Impr | Pos | Note |
|---|---|---|---|
| typescript monorepo | GSC 597 | 5.0 | tutorial retitle proposed |
| angular monorepo | GSC 576 | 5.9 | tutorial retitle proposed |
| react monorepo | GSC 298 | 5.0 | dedicated setup guide = gap |
| vite monorepo | - | Gap | |
| nestjs monorepo | - | Gap | |

### A7. Competitor / defensive

| Keyword | Vol | KD | Pos | Note |
|---|---|---|---|---|
| lerna | 1800 | 54 | 10 | via blog; kb/nx-vs-lerna in flight (DOC-555 A1) |
| lerna vs nx | - | - | 4 | defend |
| turbo monorepo | - | - | 4 | nx-vs-turborepo (dedupe the two URLs first - H1) |
| rush monorepo / rush vs nx / rushjs / rush stack | - | - | 0 | greenfield; kb/nx-vs-rush-stack in flight (DOC-555 A2) |
| angular cli | 1700 | 69 | 10 | kb/nx-and-angular |
| rspack | 200 | 44 | 5 | build-tools/rspack/introduction |
| npmrc registry (+2 variants) | 120 agg | 0-34 | 6-11 | nx-release/configure-custom-registries |

Excluded: `esbuild` (2700v, pos 15) - Jack dropped it. Noise excluded: Siemens NX CAD, Lexus NX, Roblox, math junk.

---

## B. AI prompts (GEO)

Baselines = Gauge, 2026-07-22, avg 30d Nx visibility across ChatGPT / Google AI Overview / Gemini / Perplexity / Copilot / AI Mode.

### B1. Weak unbranded - priority targets

| Prompt | Topic | Nx visibility |
|---|---|---|
| Best CI/CD platforms for large codebases | CI/CD Pipeline Design | 14.8% |
| Build me a list of Google Build System alternatives | Build System Optimization | 14.8% |
| Cheapest monorepo CI/CD platforms for startups | CI/CD Pipeline Design | 33.3% |
| Our engineering org is evaluating build system optimization solutions... | Build System Optimization | 33.3% |
| Build caching tools for large repositories | Build System Optimization | 35.9% |
| Build me a list of monorepo CI/CD providers | CI/CD Pipeline Design | 37.0% |
| Top continuous integration platforms for monorepos | CI/CD Pipeline Design | 40.7% |
| Best monorepo CI/CD platforms | CI/CD Pipeline Design | 40.7% |
| Which CI/CD platforms work best for monorepos | CI/CD Pipeline Design | 40.7% |
| Google build system alternatives for monorepos | Build System Optimization | 42.6% |
| (ROI-justification prompt cluster) | Build System Optimization | 41.7% |
| Best Nx alternative for managing large codebases | Competitor Comparisons | 51.9% |

Two failure modes: (1) "Google-style build system" framing hands it to Bazel; (2) short-tail "best/top **platforms**" and cost-framed queries pull from competitor pricing pages + Reddit, where Nx has no citable content.

### B2. Cost / ROI archetypes (extrapolated - add to tracked set)

- reduce CI compute costs for a monorepo
- why is our GitHub Actions bill so high
- cut CI minutes on a large repo
- is a paid remote cache worth it
- business case for a monorepo build platform
- justify build-system investment to leadership
- Nx Cloud pricing vs Turborepo remote cache
- self-hosted runners vs managed CI cost

### B3. CI observability prompts (new cluster, no baseline)

- how do I find flaky tests in CI
- tools to monitor CI pipeline performance
- how to track build times across a monorepo
- CI analytics dashboard for engineering teams
- how to measure developer productivity in CI

### B4. Defend (already strong)

| Prompt / set | Nx visibility |
|---|---|
| Best monorepo CI/CD **tools** | 74.1% |
| Competitor Comparisons topic (25 branded prompts) | 76% |
| Bazel-to-Nx migration scenario prompt | 90.7% |
| Nx vs Lerna / Nx vs Rush Stack prompt rows | 65-91% (visibility high, citations go to third parties) |

### B5. Guards / monitors

- **Terminology pair:** "best monorepo CI/CD **platforms**" (40.7%) vs "...**tools**" (74.1%). Models class Nx as a tool, not a platform. Track the gap; positive = it narrows.
- **Security/trust prompt:** malware sentiment currently 1 of ~2,164 answers. Quarterly recheck only.
- **Negative source watch:** r/node "how nx pulled the rug on us" thread appears in citation mixes.

---

## C. Measurement protocol

| Signal | Tool | Cadence |
|---|---|---|
| Keyword position + volume | Ahrefs (US organic export) | Monthly; next pull mid-Aug 2026 |
| Brand/AI mentions | Ahrefs Brand Radar (verify plan includes it) | Monthly |
| Per-URL AI citation rate | Gauge (trial) -> DIY battery after | Weekly x4 post-ship, then monthly |
| Prompt visibility on fixed set | Gauge -> DIY battery | Monthly |
| AI referral traffic (chatgpt.com, perplexity.ai) | site analytics | Monthly |
| AI crawler hits (GPTBot, ClaudeBot, PerplexityBot) | Netlify/CDN logs | Monthly |

Rules: relative deltas only on a fixed prompt set; "sustained" = 2+ consecutive reads; eval window 3-6 weeks after publish (never ~3 days); no prompt-volume numbers in any criteria.

Verdict rubric per shipped piece: **Positive** = pass criteria met AND citation/visibility up vs baseline. **Neutral** = no material move in 4 weeks. **Negative** = citation down >2pts sustained OR new incorrect/negative language in sampled answers.

## D. Already in flight (don't double-book)

DOC-555 covers: nx-vs-lerna, nx-vs-rush-stack, React + Angular MFE landing pages, monorepo-tools hub, folder-structure rewrite, ci-caching page. Gauge action items H1-H4 cover: turborepo URL dedupe, CI/CD best-practices KB, comparison cluster, cost/ROI framing on existing pages.

Genuinely uncovered by both: **CI observability cluster (A2 + B3)** - needs an Ahrefs pull and a content owner.
