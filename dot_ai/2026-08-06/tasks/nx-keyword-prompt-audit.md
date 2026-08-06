# Nx keyword & prompt audit + expansion (Ahrefs)

Date: 2026-08-06
Working dir: `dot_ai/2026-08-06/tasks/nx-keyword-prompt-audit/`
Related prior work: `dot_ai/2026-07-27/tasks/geo-seo-keyword-prompt-tracker.md` (the set being audited),
`dot_ai/2026-08-06/tasks/metaharness-keyword-research.md` (same 5-phase method, sibling run)

## Goal

Audit the 99 tracked Rank Tracker keywords and 13 Brand Radar prompts, prune what is not
earning its slot, and expand both sets to cover demand Nx competes for but does not track.

## Grounding (pulled live 2026-08-06, not from the attached export)

- Ahrefs project `Nx` = **8558520**, 99 keywords, US/en, owner jeff@nrwl.io.
  Tracked Rank Tracker competitors: turborepo.dev, viteplus.dev (only two).
- Brand Radar report `Nx` = **019f70fc-d637-7bb5-a169-c89330eb746f**, 13 prompts,
  ChatGPT daily, every other model **off**.
- Ahrefs units: 1,000,000/mo, ~253k used at start, resets 2026-08-14. Not a constraint.

## Corrections to the plan's stated baseline

1. **Tag counts were incomplete.** The real tag set also includes `unbranded` (on most
   rows), `monorepo-organization`, `cli-misc`, `ci-misc`. Any tag-based segment built from
   the plan's numbers would have been wrong.
2. **"11 of 13 prompts are Nx-vs-Turborepo variants" overstates it.** 8 of 13 name
   Turborepo; 5 are unbranded selection prompts. The set collapses to ~7 distinct intents,
   not 4, so only **2** prompt slots free up, not the ~7 the plan predicted. The real prompt
   problem is not redundancy - it is that all 13 run on ChatGPT only.
3. **Volumes in the plan do not match Ahrefs.** e.g. `monorepo` is 5,600 US (not 6,400);
   `what is a monorepo` is 4,100 US (Rank Tracker reports 164,000 for the same term - that
   figure is wrong, do not use it).

## Data-quality finding (blocks any position-based analysis)

Rank Tracker `position` for this project is **unreliable**. For `monorepo`: desktop reports
not-ranking, mobile reports position 1, Site Explorer reports position 8. For `nx`: desktop
not-ranking, mobile 1, Site Explorer 1. Desktop and mobile share the same `serp_updated`
timestamp, so this is not staleness.

**Decision: all position data comes from `site-explorer-organic-keywords`
(nx.dev, mode=subdomains, country=us).** Rank Tracker positions are not used anywhere in
this analysis. Worth raising with Jeff separately - the Rank Tracker dashboard is currently
showing wrong positions on head terms.

## Phase 0 results (complete)

Baseline: `phase0-audit/baseline.csv`, verdicts: `phase0-audit/audit.csv`,
prompts: `phase0-audit/prompts-audit.csv`.

- **nx.dev ranks (top-100 US organic) for only 26 of the 99 tracked keywords.**
- **Ahrefs has no record at all for 26 of the 99** - 15 of those are ci-observability.
  `no_data` here means below the keyword-database threshold, not zero demand.
- Verdicts: keep 48, keep-pending-evidence 20, keep-sentiment 3, prune 21, merge 7.
  **28 keyword slots freed**, inside the plan's 20-30 estimate.
- Prompts: keep 8, keep-sentiment 3, merge 2. **2 prompt slots freed.**

Biggest single gaps found in Phase 0 itself:
- `turborepo` - 14,000 US volume, difficulty 1, nx.dev does not rank at all.
- `ci cd pipeline` - 4,800 volume, difficulty 0, no nx.dev ranking. Largest open SERP tracked.
- `lerna` - 1,800 volume, no nx.dev ranking despite the lerna-is-dead blog post.
- `monorepo best practices` - traffic potential 6,000, no ranking.
- `nx cloud` (250 vol, pos 1) and `nx console` (250 vol, pos 3) rank well and are **not tracked**.

## Phases 1-3 (running)

9 cluster agents (monorepo, cli-competitors, ci-competitors, ci-performance,
ci-observability, branded, ai-tooling, nx-cloud-features, migration) + 2 qualitative agents
(GitHub/forums, Reddit/HN). Shared instructions in `BRIEF.md`.

## Scope decisions

- **US/en only.** Not expanding to DE/IN/BR this round; the agents are explicitly barred
  from other markets.
- Deliverables are CSVs and an import file. Nothing is written back into Ahrefs - the MCP
  management endpoints are read-only, and tracker changes stay Jeff's call.

## Results

Final audit: `phase0-audit/audit-final.csv`. **40 of 99 tracked keywords leave** (29 prune,
7 merge, 4 replace-with-better-phrasing); 59 survive.

Expansion: `output/keywords-add.csv` - 844 scored rank targets from 968 raw rows, tiered
100 / 150 / 594. Plus `output/keywords-monitor.csv` - 29 competitor brand terms worth
watching but not worth targeting.

Prompts: `output/prompts-add.csv` (41) + `output/brand-radar-import.txt`, with winnability
from a blind Claude baseline: 7 gap / 8+11 contested / 6 defend / 9 unscreened-branded.

Everything decision-relevant is in `output/gaps.md`.

## Corrections made to agent output

Three cluster-agent claims were wrong and would have shipped:
1. `what is a cache miss` reported at 62,000 US volume; it is **700** (77,000 global).
2. `lerna.js.org ranks #1 for "nx cloud"` - reported by two agents independently. It is an
   AI-overview sitelink, not an organic result. nx.dev's best organic is 2.
3. `github actions slow` TP of 65,000 is inherited from the `github status` parent topic.

And one of my own Phase 0 verdicts was overturned: `ci analytics` graded a keep on volume +
KD; its SERP is C.I. Analytics, a lab-analyzer manufacturer.

Logged in `phase2-ahrefs/00-orchestrator-verifications.md`.

## Status

- [x] Phase 0 audit + prune verdicts
- [x] Phase 1 seeds / Phase 2 Ahrefs expansion (9 agents)
- [x] Phase 3 qualitative validation (2 agents)
- [x] Phase 4 prompt expansion + blind single-model winnability screen
- [x] Phase 5 synthesis, scoring, budget fit
- [ ] JACK: three decisions open - see `output/gaps.md` section 5 (prompt cost 131 vs 13
      daily runs, keyword cut line, and the two items to raise with Jeff)
