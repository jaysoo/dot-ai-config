# ci-observability bet: final verdict

The plan's exemption 2 kept the ci-observability cluster at zero volume as a deliberate
pre-positioning bet, on condition that Phase 3 find **>=3 independent qualitative evidence
items** per term within 6 months, or the term rotates out.

This is the orchestrator's combined verdict. Two independent halves fed it:

- **Quantitative** (ci-observability cluster agent): probed adjacent vocabularies for terms
  that do have volume, and pulled SERPs.
- **Qualitative** (GitHub/forums agent): 74 evidence items, 45 of them tied to a specific
  tracked term. Reddit was unreachable from the environment, so the Reddit/HN agent's
  contribution is Hacker News-weighted - noted as a coverage gap, not padded over.

## Verdict grid

| Tracked term | Qual. evidence | Quantitative finding | Verdict |
|---|---|---|---|
| `ci compute cost` | **8** | no Ahrefs record | **Keep.** Strongest qualitative signal in the cluster. |
| `ci caching` | **6** | no Ahrefs record | **Keep.** Passes; DOC-555 kb/ci-caching maps to it. |
| `speed up ci` | **4** | no Ahrefs record | **Keep.** Passes. |
| `github actions runner out of memory` | **4** | no Ahrefs record | **Keep.** Passes; real GitHub-issue vocabulary. |
| `why is my ci slow` | **3** | no Ahrefs record | **Keep.** Passes; question framing, also feeds the prompt set. |
| `github actions slow workflow` | 5 | long form has no record, but **`github actions slow` = 60 vol, KD 1** | **Replace** with `github actions slow`, and flag the intent. See note below - this demand is mostly *queue delay*, which Nx cannot fix. |
| `develocity build scan alternative` | 3, **wrong intent** | compound = zero. `develocity` 200 / KD 3, `gradle build scan` 70 / KD 9 | **Prune the "alternative" framing.** The evidence shows teams *adopting* Develocity, not looking to replace it. Track bare `develocity` as a competitive-watch term instead. |
| `circleci build insights alternative` | 0 | compound = zero. `circleci insights` = 40 / KD 2 | **Replace** with `circleci insights`. |
| `ci observability` | 0 | 30 vol, no SERP. `ci cd monitoring` = 200 / KD 6 | **Replace** with `ci cd monitoring`. |
| `ci metrics dashboard` | 1 | zero record. `engineering metrics dashboard` = 200 / KD 2 | **Replace** with `engineering metrics dashboard`. |
| `ci build time trends` | 3 | zero record. `reduce ci build time` = 50 / KD 1 | **Prune the phrasing.** Evidence supports the problem, not this wording. |
| `ci analytics` | 0 | **SERP is C.I. Analytics, a lab-analyzer manufacturer** | **Prune.** Overturns the Phase 0 `keep` - see `phase2-ahrefs/00-orchestrator-verifications.md`. |
| `build observability platform` | 4 | zero record; the "build X platform" framing does not exist in search | **Prune as a keyword, keep as a page angle.** The evidence is people describing the problem, never using the category name. |
| `github actions job duration metrics` | 3 | zero record | **Prune.** Evidence is about slow jobs generally; weaker duplicate of the OOM and slow terms already kept. |
| `monorepo ci metrics` | 0 | zero record, no adjacent form has volume | **Prune.** |
| `ci pipeline bottleneck` | 1 | zero record | **Prune.** |
| `github actions build time analytics` | 0 | zero record; `github actions analytics` also zero | **Prune.** The whole GH-Actions-plus-analytics compound is dead. |
| `ci cpu profile` / `ci cpu profiling` | 0 | zero record | **Prune** (already pruned in Phase 0 - confirmed correct). |
| `ci memory profile` / `ci memory profiling` | 0 | zero record | **Prune** (already pruned in Phase 0 - confirmed correct). |

## Net

Of the 21 terms in this bet: **keep 5, replace 4 with better vocabulary, prune 12.**

## Three intent traps the raw evidence counts hide

Passing the >=3 threshold is not sufficient. Three terms cleared it while pointing at demand
Nx cannot serve, and the qualitative agent caught all three:

1. **`github actions slow workflow` is about queue and scheduling delay**, not build
   duration. People are waiting for a runner to be assigned. Remote caching and task
   distribution do not fix that; more runner capacity does. Track the term, but as a
   competitor-adjacent signal (it belongs to Blacksmith/Depot/WarpBuild), not as an Nx
   content target.
2. **`develocity build scan alternative` has the intent backwards.** The evidence is teams
   evaluating and adopting Develocity, not looking to leave it. An "alternative" page aimed
   at that demand would meet nobody.
3. **`github actions runner out of memory` lives in self-hosted runner and ARC contexts**,
   not on GitHub-hosted runners - a narrower and more infrastructure-shaped audience than
   the term suggests.

## Methodology note that changes how much you can trust this

Unfiltered GitHub search for these terms now returns roughly **90% AI-generated tickets in
one-person repositories**. Without excluding those, **all 17 terms would have "passed" the
>=3 threshold** and this exercise would have been worthless - it would have rubber-stamped
the entire bet. The counts above are post-filter.

This is worth carrying into any future qualitative validation: on GitHub, raw issue counts
are no longer evidence of human demand.

## The honest read

**The category bet was right; the vocabulary was wrong.** CI performance pain is real and
well evidenced - 45 qualitative items tied to specific terms, plus verbatims like *"our CI
takes 8 minutes for a one-line fix, and the team's proposal is to add more runners"* and
*"for us that's close to $3.5k a month extra on our GitHub bill"*. What does not exist is
anyone calling it "observability". People describe symptoms (slow, expensive, out of memory,
flaky) and search the established vocabularies: `ci cd monitoring`, `continuous integration
metrics`, `devops metrics`, `engineering metrics dashboard`.

Total realistic US volume across genuinely CI-scoped terms in this space is roughly
1,200/mo. The adjacent engineering-metrics vocabulary (DORA, engineering effectiveness,
engineering intelligence) adds ~3,000 more at KD 0-8, currently owned by LinearB, Swarmia,
getdx and Faros with product pages rather than blog posts.

One structural observation worth more than any single keyword: **the `ci cd monitoring` SERP
is 100% observability vendors** - Splunk, Datadog, Grafana, InfluxData, Dynatrace - with
zero build-tool presence. Nobody is making the argument that CI slowness is a build-graph
problem rather than a tracing problem. That is an unoccupied position, and it is the one
Nx is uniquely able to take.

## Coverage caveat

Reddit was fully blocked from the research environment (`reddit.com/*.json`, `old.reddit.com`
and `api.reddit.com` all returned block pages; WebSearch silently dropped `site:reddit.com`).
Evidence is therefore GitHub- and Hacker News-weighted. Reddit is where a lot of this
vocabulary actually lives, so the evidence counts above are a **floor, not a measurement**.
A term at 2 items may well pass on a Reddit-inclusive re-run; none of the terms kept above
depend on that, but three of the prunes (`ci pipeline bottleneck`, `ci metrics dashboard`,
`monorepo ci metrics`) are the ones most likely to be under-counted.
