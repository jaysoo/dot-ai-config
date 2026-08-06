# Gaps, verdicts and decisions

Companion to `keywords-add.csv`, `keywords-monitor.csv`, `prompts-add.csv`,
`brand-radar-import.txt`, and `../phase0-audit/audit-final.csv`.

---

## 1. Top 10 content gaps (competitor organic diff)

Ranked by size of the opening, not by ease. Every figure is US volume from Ahrefs.

**1. Nx does not own the caching category vocabulary at any level.**
turborepo.dev holds position 1 on `remote cache` - the exact term nx.dev sits at position 9
on. rushjs.io holds position 5 on `build cache`. gradle.com owns the Gradle cache terms.
depot.dev ranks on `github actions cache` (500) and position 3 on `gradle remote build cache`
with nothing but blog posts about *other tools'* caches. Nx ships the product and ranks on
one 20-volume term. The competitor pattern is cheap and consistent: a docs page named after
the generic concept, plus vendor-blog content aimed at other tools' cache pain.

**2. The definitional CI/CD corpus is entirely CircleCI's.**
`ci/cd pipeline` (9,000, and a *separate keyword* from the tracked `ci cd pipeline` at
4,800/KD 0), `continuous integration` (7,900), `what is ci cd` (1,700). CircleCI holds them
off two evergreen pages. Filtering nx.dev's US organic set to CI vocabulary returns 13 rows,
all `nx `-branded.

**3. Monorepo definition and synonym surface.**
monorepo.tools ranks 1-5 across ~20 spelling and definitional variants (`mono repo`,
`monorepository`, `define monorepo`, `monorepo benefits`, `why monorepo`) where nx.dev is
absent. Nx owns monorepo.tools, so this is an internal-cannibalisation question as much as a
gap. One glossary page covers most of it.

**4. The flaky-test explainer corpus is a clean shutout.**
Trunk.io and Datadog own the whole neighbourhood - definition, meaning, and per-framework
(`playwright flaky`, `cypress flaky`, `vitest flaky`) at KD 0-2. Nx Cloud ships flaky-task
detection *and owns the Playwright/Cypress/Jest plugins*, and ranks for none of it. The blind
prompt screen confirms this at the AI layer: three separate flaky-test prompts named
competitors and **no monorepo build system at all**.

**5. Test-selection vocabulary belongs to Gradle and Launchable.**
`test impact analysis` (150, KD 3) and `predictive test selection` (100, KD 3) are the
established names for what `nx affected` does. gradle.com holds position 1 with a dedicated
product page. Nx has no page using either phrase.

**6. Cost and pricing calculator assets.**
depot.dev ranks position 1 for `github actions cost` off a **price-calculator tool page**,
not a blog post, and Blacksmith holds position 1 on `github actions free tier` from one post.
`github actions pricing` is 1,200/KD 45, `github actions cost` 450. Nx Cloud has the stronger
cost story and no comparable asset.

**7. Repo consolidation is unowned by anyone.**
~180 volume across the merge-repos family (`merge two git repositories`, `how to merge two
repositories in github`, `git subtree merge`) at KD 0-7. The SERP is Stack Overflow, GitHub
Discussions, personal blogs and a Bitbucket KB page. No build tool ranks. `nx import` is a
direct answer. The blind screen scored the head term a **gap** - the generic phrasing pulls a
pure-git answer, while the same intent phrased with "monorepo" names four build tools.

**8. Package-manager comparison content.**
`pnpm vs npm` (1,500, KD 3), `npm vs pnpm` (300, KD 2), `pnpm vs yarn` (250), `npm workspaces`
(500, KD 5). rushjs.io ranks top-10 across ~10 of these off one docs page. This is where teams
stand immediately before they need a task runner.

**9. MCP and llms.txt.**
`mcp server` 38,000, `what is an mcp server` 5,900/KD 24, `build mcp server` 800/KD 12,
`llms.txt` 2,800, `what is llms.txt` 1,900/TP 4,500. Nx ships an MCP server and publishes
llms.txt, and tracks none of it. turborepo.dev has **zero** AI footprint - all 52 of its
ranking keywords contain no ai/mcp/agent/llm term. This is an uncontested differentiator
against the main competitor that neither side is currently ranking for.

**10. Error-string and support-deflection terms.**
`command not found: nx` (150), `nx cannot find configuration for task` (150), `nx missing
platform dependency` (150), `nx not found` (150), `nx command not found` (100) - roughly 750
combined volume at KD 0-1 where nx.dev already ranks 2-4. Cheap to defend, high support-cost
relief, entirely untracked.

---

## 2. The ci-observability bet: verdict

Full grid in `../phase3-qualitative/00-ci-observability-verdict.md`.

**Of the 21 terms in the bet: keep 5, replace 4, prune 12.**

**The category was right; the vocabulary was wrong.** CI performance pain is well evidenced -
45 qualitative items tied to specific terms. What does not exist is anyone calling it
"observability". People describe symptoms and search the established vocabularies:
`ci cd monitoring` (200/KD 6), `continuous integration metrics` (150/KD 2), `devops metrics`
(700/KD 8), `engineering metrics dashboard` (200/KD 2).

Two findings that should change how the next audit is run:

- **`ci analytics` is a lab-equipment company.** SERP positions 1, 3, 5 and 6 belong to
  C.I. Analytics, a process-analyzer manufacturer. Phase 0 graded it a keep on volume and
  difficulty alone. Overturned to prune. Volume plus KD without a SERP check is not evidence.
- **Unfiltered GitHub issue search is now ~90% AI-generated tickets in one-person repos.**
  Without excluding those, **all 17 terms would have passed** the evidence threshold and the
  validation would have rubber-stamped the bet it was meant to test.

The unoccupied position worth taking: the `ci cd monitoring` SERP is 100% observability
vendors - Splunk, Datadog, Grafana, InfluxData, Dynatrace - with zero build-tool presence.
Nobody is arguing that CI slowness is a build-graph problem rather than a tracing problem.

---

## 3. Does the ci-competitors cluster deserve dedicated comparison content?

**No - and the existing nx-vs-blacksmith page should be repointed.** This was the plan's
explicit question, and the evidence is one-sided:

- nx.dev ranks for **zero** US top-100 keywords containing "blacksmith" and **zero**
  containing "github actions". The nx-vs-blacksmith page does not rank.
- It is not targeting anything that exists. `blacksmith alternative` = **0** US volume.
  `depot alternative` = **0**. `depot vs blacksmith` = 20. `depot pricing` = 20.
  `develocity pricing` = 10. `buildkite alternative`, `buildbuddy alternative` and
  `develocity alternative` have no Ahrefs record at all - despite `buildkite` itself
  at 3,200 volume. **Vendor-alternative intent in this category effectively does not exist.**
- The Develocity evidence points the wrong way for an "alternative" page: teams in the
  qualitative set are *adopting* Develocity, not looking to leave it.

Where the demand actually is, in the same cluster: the problem/cost/incumbent tier.
`github actions pricing` 1,200, `github actions cache` 500, `jenkins vs github actions` 450,
`alternatives to jenkins` 350/KD 1, `github actions alternatives` 200/KD 3,
`docker build cache` 150/KD 5. Depot, Blacksmith and WarpBuild each built one pricing post
and now rank across ~15 cost keywords worth 2,500+ combined volume.

**Salvage:** repoint the existing page at `blacksmith ci` (250 volume), or fold it into a
GitHub-Actions-cost page.

**One caveat on this cluster, flagged rather than decided.** Several ci-competitors terms
score high (`alternatives to jenkins`, `jenkins alternatives`, `jenkins vs github actions`)
on volume, low difficulty and an open SERP. But Nx Cloud is not a CI platform - it plugs into
one. Ranking for "alternatives to jenkins" would attract replace-my-CI intent that Nx does
not serve. I have left them in `keywords-add.csv` at their computed score with this note
rather than silently dropping them; the strategic-fit call is yours.

**Counter-evidence worth weighing before dismissing the cluster entirely:**
`nx.dev/docs/kb/nx-vs-depot` earns citations in ChatGPT answers **unprompted** - no tracked
prompt names Depot. These pages appear to work at the AI layer even with no search volume
behind them. That is an argument for keeping a small number of them as GEO assets, judged on
citation share rather than on rankings.

---

## 4. Structural findings outside the keyword set

These came out of the Brand Radar citation data and are not fixable by tracking more terms.
Detail in `../phase4-prompts/00-brand-radar-baseline.md`.

1. **nx.dev splits its own AI citations across three URLs for nx-vs-turborepo** (8 + 7 + 4
   responses), and a *fourth* path is what actually ranks organically. The URL dedupe flagged
   as action H1 in the July tracker is still open and is now measurably costing citations.
2. **Versioned doc subdomains are training the answers.**
   `22.nx.dev/docs/guides/adopting-nx/nx-vs-turborepo` is the **second-most-cited page in the
   entire set**. `19.nx.dev` and `20.nx.dev` pages also appear.
3. **A deprecated page** (`/docs/reference/deprecated/integrated-vs-package-based`) and a
   **third-party Mintlify mirror of Nx docs** both take citations that belong to nx.dev.
4. **The answer layer is dominated by AI-generated listicle farms** - pkgpulse.com (3 pages,
   11 responses), devtools.cloud, thesoftwarescout.com, trybuildpilot.com, devtoolhq.com,
   algoroq.io and others - plus `monorepovspolyrepo.com/tools/` at 6 responses. These sites,
   not vendor docs, are what ChatGPT reads for "best monorepo tool". Listicle outreach is a
   different lever from writing more nx.dev pages, and on this evidence a higher-yield one.
5. **The rug-pull narrative has a single canonical artifact.** It is no longer the r/node
   thread; it has consolidated into `salvozappa.com`'s "How Nx pulled the rug on us"
   (2025-12-29). That is the citable source models are most likely to pull. A sentiment prompt
   for it is in the import file.

---

## 5. Decisions that need you

**a. Prompt cost.** The proposed set is 41 prompts. Tier 1 (30) on four models plus Tier 2
(11) on ChatGPT = **131 daily runs against the current 13**. That is roughly a 10x increase
and I have no visibility into Brand Radar per-run pricing. Options: import Tier 1 only
(120 runs), import Tier 1 on ChatGPT + Claude only (71 runs), or import everything on ChatGPT
only (41 runs) and lose the multi-model signal that motivated the expansion.

**b. Keyword cut line.** `keywords-add.csv` has 844 scored rank targets, tiered 100 / 150 /
594. The Ahrefs plan is nowhere near its cap (147 tracked across both projects today), so the
real constraint is attention, not licence. Tier 1 = 100 adds against 40 freed slots takes the
Nx project from 99 to 159 keywords. Say if you want that smaller.

**c. Two things to raise outside this project.**
- **The Rank Tracker positions for project `Nx` are wrong.** Desktop, mobile and Site Explorer
  disagree on head terms (`monorepo`: not-ranking / 1 / 8). Same `serp_updated` on both
  devices, so it is not staleness. Everything here uses Site Explorer instead, but the
  dashboard Jeff and others look at is showing bad numbers.
- **Brand Radar's global prompt corpus needs an addon this subscription lacks**
  (`Missing addon: Brand Radar ["Chatgpt"]`), so the planned "find prompts competitors win
  where Nx is absent" analysis could not run from Ahrefs data. The blind-model screen in
  `../phase4-prompts/claude-baseline.json` substitutes for it, on one model only.

---

## 6. Method caveats

- **Reddit was fully blocked** from the research environment. Qualitative evidence is GitHub-
  and Hacker News-weighted. Evidence counts in the ci-observability verdict are a **floor**.
- **The winnability screen is one model.** It is a genuine blind Claude baseline - run by an
  agent with no access to this project's files, precisely so it would not be contaminated -
  but it is Claude only. ChatGPT, Perplexity and Gemini are unmeasured. Do not read
  `winnability` as cross-model truth; re-run it as the DIY battery described in
  `dot_ai/2026-07-27/tasks/geo-seo-keyword-prompt-tracker.md`.
- **`best_position` includes AI-overview sitelinks.** Two agents independently reported that
  "lerna.js.org ranks #1 for `nx cloud`". A SERP pull disproved it - the lerna URL is an
  AI-overview sitelink, and nx.dev's own best organic position is 2, not 1. Any position claim
  driving a decision needs a `serp-overview` check. Corrections logged in
  `../phase2-ahrefs/00-orchestrator-verifications.md`.
- **`nx cloud` is a contested brand term.** Network Optix sells a VMS product of the same name
  and holds organic 3 and 6.
- 109 of the 844 rank-target rows are `synthetic` - phrasings with no Ahrefs record. They are
  labeled, and they are hypotheses, not demand.
