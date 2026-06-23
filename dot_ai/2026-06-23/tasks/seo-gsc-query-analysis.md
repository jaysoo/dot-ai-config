# SEO: GSC Query Analysis - High-Impression / Low-Click Queries

- Date: 2026-06-23
- Source: Google Search Console, sc-domain:nx.dev, last 3 months
- Totals: 208K clicks, 16M impressions, avg CTR 1.3%, avg position 6.5
- Raw export: scratchpad gsc/ (Queries.csv 1000 rows, Pages.csv 1000 rows)
- Polygraph session: seo-research-80058b7a

## Goal

Find queries with high impressions but poor clicks, check our SERP position + the
preview shown, judge intent match, and decide where to spend effort to drive traffic.

## The big reframe

The monster-impression / near-zero-click queries are NOT simple title fixes. Mapped
each to the ranking page:

| Query (impr) | Ranking page | Pos | CTR |
|---|---|---|---|
| `nx workspace` (4.0M) | /docs/reference/workspace (@nx/workspace API ref) | 1.0 | 0.01% |
| `monorepo`-class (4.7M agg) | /docs/concepts/decisions/why-monorepos | 2.2 | 0.0% |
| intro terms (4.7M) | /docs/getting-started/intro | 2.2 | 0.1% |
| `pnpm workspace` (2.6M) | /blog/setup-a-monorepo-with-pnpm... | 8.9 | 0.0% |
| tutorial terms (2.8M) | /tutorials/crafting-your-workspace | 1.2 | 0.0% |

Two causes, neither is "bad title":

1. AI Overviews eat the clicks. Head terms (`nx workspace`, `monorepo`,
   `pnpm workspace`) trigger Google AI Overviews. We rank #1-2 but the answer renders
   in the SERP -> no click. GSC's "generative AI features" banner confirms. These
   clicks are structurally capped. Do not chase with title tweaks.
2. Intent mismatch on `nx workspace`: ranking page is the dry @nx/workspace plugin API
   reference, not a "what is / how to create a workspace" page. Real mismatch, but the
   4M is so AI-suppressed the upside is modest. Low ROI.

Takeaway: stop optimizing vanity head terms for clicks. The clicks live in the mid-tail.

## Real opportunities (ranked by winnable clicks)

### 1. Module Federation / Micro-Frontend cluster (biggest pool)

We are the Nx authority but stuck at position 5-8 (page 1 bottom / page 2).

| Query | Impr | Pos | CTR |
|---|---|---|---|
| micro frontend | 6,502 | 6.6 | 0.8% |
| module federation | 5,549 | 7.7 | 0.5% |
| micro frontend architecture | 5,269 | 4.9 | 1.2% |
| microfrontend | 4,345 | 7.0 | 0.8% |
| +10 more variants | ~10K | 5-9 | <1.5% |

Page /docs/technologies/module-federation/concepts/micro-frontend-architecture =
112K impr at pos 7.7. Push these to top 3 -> 5-10x clicks. ~30K+ combined impressions,
clear intent, we own the topic. Headline play.

### 2. The `nx <feature>` winner pattern (systematize)

Already convert 40-65% at position 1-3:
nx affected 55.7%, nx mcp 59.6%, nx migrate 59.9%, nx changelog 62.9%,
nx playwright 65.5%, nx nestjs 62.1%, nx release, nx generators, nx vitest, nx cli...

Move: audit every feature / tech / plugin for a dedicated well-titled landing page.
Cheapest, highest-CTR traffic. Gaps = free clicks.

### 3. Mid-tail intent terms in striking distance (pos 4-8)

| Query | Impr | Pos | Note |
|---|---|---|---|
| nxvideo + nx video + nx videos | ~54K | 3.9-6.5 | want Nx videos; no strong hub page |
| project.json | 5,514 | 4.6 | reference ranks, snippet weak |
| monorepo vs polyrepo | 4,573 | 4.2 | have the page, push to top 3 |
| pnpm monorepo | 2,387 | 7.7 | ideal Nx user, not brand-locked |
| monorepo tools | 1,175 | 5.2 | 4.8% already; we own monorepo.tools |

### 4. Brand defense

`nx` sits at position 2.0 (homepage 1.9) on our own name - something outranks us
(GitHub / npm / AI Overview). Brand variants `n x`, `nx.`, `www.nx`, `nx.com` all
pos 2-8, low CTR. High-value clicks leaking. Needs investigation.

### 5. Cheap retitles (small but low-risk)

Real volumes modest: angular monorepo 576 impr (pos 5.9), typescript monorepo 597
(pos 5.0), react monorepo 298 (pos 5.0). Front-load keyword in title, unique
descriptions, and fix the prod typo `Nx.gradient`. Bundle into one PR.

Proposed frontmatter changes (astro-docs):

| File | Current title | Proposed title |
|---|---|---|
| getting-started/Tutorials/angular-monorepo-tutorial.mdoc | Building and Testing Angular Apps in Nx | Angular Monorepo Tutorial |
| getting-started/Tutorials/react-monorepo-tutorial.mdoc | Building and Testing React Apps in Nx | React Monorepo Tutorial |
| getting-started/Tutorials/typescript-packages-tutorial.mdoc | Building and Testing TypeScript Packages in Nx | TypeScript Monorepo Tutorial |
| getting-started/Tutorials/crafting-your-workspace.mdoc | Crafting Your Workspace | Crafting Your Nx Workspace |
| concepts/Decisions/why-monorepos.mdoc | Monorepos | What Is a Monorepo? (keep sidebar label "Monorepos") |

Description rewrites:
- angular: Build and test a frontend-focused Angular monorepo with Nx - apps, libraries, caching, and CI.
- react: Build and test a frontend-focused React monorepo with Nx - apps, shared libraries, caching, and CI.
- typescript: Build and test a TypeScript monorepo with Nx - packages, project references, and publishing. (fixes Nx.gradient typo)
- technologies/react/index.mdoc: Build React apps and monorepos with Nx - generators, caching, module federation, and CI.

## Per-page optimization plan: nx workspace + pnpm workspace

Even AI-capped, these two are the biggest impression surfaces on the site. Two wins
regardless of CTR ceiling: (a) useful content for people who land there, (b) AI Overview
citation - Google cites the page that answers, so a genuinely useful page is how we show
up inside the AI Overview eating the clicks (GEO play).

### nx workspace (4M impr, pos 1.0)

What surfaces: /docs/reference/workspace - a generated plugin reference. Its intro comes
from packages/workspace/readme-template.md, which is generic boilerplate ("Smart
Monorepos - Fast Builds. Get to green PRs...") plus an auto-generated generators/executors
list. A searcher wanting "what is / how to create an Nx workspace" lands on an API index.

Catch: that template doubles as the @nx/workspace npm README, so do not bloat it for SEO.

Lever - make the real intent page win:
- getting-started/Tutorials/crafting-your-workspace.mdoc already has the right H1
  ("What is an Nx workspace?"); it is just out-competed by the reference page.
- Retitle to echo the query, add a short FAQ-style what/why/how-to-create block
  (AI-Overview-citable), and point internal links with "Nx workspace" anchor text at it
  from high-authority pages (homepage, intro).
- Optional low-risk: one helpful line + link at top of the generated overview ("New to Nx?
  Learn what an Nx workspace is and how to create one ->") so even if the reference keeps
  #1, the surfaced result is useful.
- Honest: Google may keep the ref at #1; biggest realistic lift = useful + AI-citable.

### pnpm workspace (2.6M impr, pos 8.9)

What surfaces: blog setup-a-monorepo-with-pnpm-workspaces-and-speed-it-up-with-nx at
pos ~9 - leads with Nx instead of explaining pnpm workspaces.

Useful assets we already have: guide "Adding Nx to NPM/Yarn/PNPM Workspace" and course
"From PNPM Workspaces to Distributed CI".

Lever - one page that leads with pnpm-workspace value (what it is, pnpm-workspace.yaml,
workspace commands) then positions Nx as the speed-up. Answer the literal question first =
earns the click + the AI Overview citation. Repoint "pnpm workspace(s)" internal anchors
at it. Honest ceiling: pnpm.io owns the brand term; realistic target is page-1 + winning
the AI-Overview citation, not the #1 blue link.

## What drives traffic today (defend)

Top click pages: homepage (48K), reference/nx-commands (6.4K), guides/nx-console
(5.2K, 14.8% CTR), installation (4.3K), intro (4K), courses (3.1K), nx-cloud (2.7K).
Reference docs + getting-started + console + cloud are the workhorses.

## Recommended sequence

1. Module Federation SEO push - retitle / strengthen the MF cluster into top 3.
2. `nx <feature>` coverage audit - find missing feature landing pages.
3. Apply the cheap retitles (framework tutorials + typo fix).
4. Brand-defense investigation - why is `nx` position 2.
5. Skip AI-suppressed head terms for clicks; revisit as a GEO / AI-citation effort.

## Notes / method

- jack.hsu@gmail.com has no GSC access to nx.dev; data pulled via jack@nrwl.io (/u/1/).
- Live SERP scans (WebSearch) confirmed competitors: monorepo.tools (we built it) #1
  for `monorepo` head terms, Turborepo owns `best monorepo tool` narrative, pnpm.io
  owns `pnpm workspace`.
