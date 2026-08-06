# Meta-Harness / Polygraph: Keyword & Prompt Discovery

Date: 2026-08-06
Working dir: `dot_ai/2026-08-06/tasks/metaharness-keyword-research/`

## Goal

Evidence-backed inventory of search keywords + AI-assistant prompts people actually use
when they hit the problems Polygraph / metaharness.tools solves. Organized by problem
category and funnel stage. Quantitative data where it exists, qualitative demand evidence
where it does not.

## Core constraint

"Meta-harness" is category language, not user language. Near-zero search volume, near-zero
prompt frequency. Research problem-language-first. "Meta-harness" is an OUTPUT label, never
an input seed.

Second constraint: most of this space is below keyword-DB thresholds. Zero volume != zero
demand. Qualitative mining (Reddit, GitHub, HN, autocomplete) weighted equally with Ahrefs.

## Pre-run grounding (done)

- Ahrefs project `metaharness.tools` (id 10155048), owner juri@nrwl.io, 48 tracked keywords.
  Existing bets are ~90% category language (`meta harness`, `metaharness`, `agent harness`).
  Tag clusters: target/brand/definition/comparison/landscape/orchestration/polygraph/
  optimization-sense/watch/adjacent.
- Only tracked competitor: `omnigent.ai` ("a common layer over Claude Code, Codex, Pi").
- Brand Radar report "Metaharness" (id 019fd75e-6374-7bbf-b6f0-caceba879e34), chatgpt daily,
  5 prompts, all session-sharing / cross-tool-portability framing.
- metaharness.tools states 4 problems: cross-repo coordination, session memory loss,
  organizational invisibility, manual workflow overhead. 8 capabilities: swappable harnesses,
  repo knowledge/provisioning, parallel work, session durability, multiplayer, distilled
  memory, policy enforcement, feedback loops.
- Namespace collision: "meta harness" in ML research (Stanford paper) means harness
  *optimization*, not orchestration. Already tagged `optimization-sense` in the project.
- Ahrefs budget: 813k units remaining, resets 2026-08-14. Not a constraint.

## Decisions (Jack, 2026-08-06)

1. **Taxonomy = plan's 8 + cross-repo coordination as a 9th.** Cross-repo was buried inside
   orchestration + portability but is metaharness.tools' #1 problem and Polygraph's core.
2. **Competitors tiered.** Tier 1 direct: omnigent.ai + whatever Phase 3 surfaces.
   Tier 2 memory/context: mem0, zep, letta. Pure LLMOps observability vendors (langfuse,
   langsmith, helicone, braintrust, agentops, arize, weave, portkey) DROPPED from Phase 2
   step 5 - they sell LLM app observability to AI-app builders, not agent coordination to
   dev teams. Their keyword sets are `llm tracing` / `prompt eval` traffic that will not
   convert. Note as an explicit scope cut in gaps.md.

## Taxonomy (9 categories)

| # | Key | Canonical name |
|---|-----|----------------|
| 1 | `memory` | Memory & context persistence |
| 2 | `observability` | Observability & tracing |
| 3 | `sharing` | Session sharing & collaboration |
| 4 | `orchestration` | Multi-agent / subagent orchestration |
| 5 | `evaluation` | Evaluation & reliability |
| 6 | `cost` | Cost & usage tracking |
| 7 | `governance` | Governance, audit & security |
| 8 | `portability` | Cross-tool portability |
| 9 | `crossrepo` | Cross-repo coordination |

## Phases

- **Phase 1** - seed generation, 1 agent per category, 40-80 seeds across 5 framings
  (symptom / solution / tool-anchored / competitor-adjacent / question).
- **Phase 2** - Ahrefs quantitative expansion, 1 agent per category. matching-terms,
  related-terms, search-suggestions, serp-overview, competitor organic keywords (tiered set).
- **Phase 3** - qualitative demand mining, 1 agent per source: GitHub issues, Reddit, HN,
  autocomplete, X. Verbatim phrasings only, last 12 months.
- **Phase 4** - AI-prompt inventory + empirical testing of top ~50 prompts.
- **Phase 5** - synthesis, dedupe, scoring, dark-demand tier.

## Deliverables

- `output/keywords.csv` - full scored matrix
- `output/prompts.csv` - prompt inventory + funnel stage + AI-answer citation baseline
- `output/brand-radar-prompts.txt` - ready-to-import custom prompt list
- `output/gaps.md` - top 10 dark-demand clusters, top 10 competitor gaps, terminology bets,
  honest call on whether "meta-harness" is worth pushing as category language

## Anti-hallucination rule

Every phrase in final output carries a `source` field: an Ahrefs report name, a URL, or
`synthetic`. Synthetic phrasings allowed but labeled - hypotheses, not evidence. Never
invent volume/difficulty numbers; missing data is `no_data`.

## Status - COMPLETE (2026-08-06)

- [x] Phase 0 grounding + taxonomy validation
- [x] Phase 1 seeds - 9 agents, 736 seeds, 0 meta-harness contamination
- [x] Phase 2 Ahrefs - 10 agents, ~97k units, 1,876 rows + competitors
- [x] Phase 3 qualitative - 5 sources, 834 verbatim phrases
- [x] Phase 4 prompts - 122 prompts, GEO baseline from real ChatGPT responses
- [x] Phase 5 synthesis - 2,279 scored keywords, 12 dark-demand clusters

27 agents across 3 workflows, 0 errors. ~97k of 813k Ahrefs units used.

## Headline results

1. **"meta-harness" is dead as a search term AND the space already has a name.**
   `metaharness`=0, `meta harness` returns an EMPTY SERP, and the term appears 0 times in 834
   verbatim developer phrases. But `harness engineering` (18k global) is winning organically -
   OpenAI, Martin Fowler, Lilian Weng, Red Hat, Addy Osmani all publish under it, plus an
   awesome-list. Fowler's formulation: "Agent = Model + Harness". Recommendation: rank in
   harness-engineering vocabulary, keep meta-harness as brand defence only.
2. **Demand is tool-anchored.** `claude code memory` (1000/KD9) beats `agent memory` (600/KD60)
   on volume AND difficulty. Prompts naming a tool measure 500; generic "AI agent" phrasings
   measure 0. Best target found: `claude code harness`, KD 3.
3. **The tracked competitors are wrong.** omnigent.ai has 1 organic keyword. ChatGPT instead
   cites claudereview.com, threadcast.dev, lore.link, aq.dev, custardseed.com for the
   500-volume session-sharing prompts - and those have ~0 Google organic. In `sharing`, AI
   answers and Google organic are decoupled.
4. **mem0 is the real memory incumbent** (8k US / 30k global) and already ranks #11 for
   `claude code memory`.
5. **Cross-repo coordination is not supported as the lead.** `multi repo`=10, Reddit yielded 7
   rows, and 17 of 36 crossrepo phrases came from vendor blogs selling the fix. The market
   feels a context ceiling, not a coordination ceiling. Lead with compaction/handoff/
   invisibility/rules-drift instead.
6. **Purest dark demand: "session handoff".** Zero of 2,279 keyword rows contain the word;
   autocomplete already returns 5 handoff queries.

## Deliverables

All under `dot_ai/2026-08-06/tasks/metaharness-keyword-research/output/`:

- `keywords.csv` - 2,279 scored rows (category, funnel stage, volume, KD, evidence count,
  relevance 0-3 + reason, tier). 1,342 relevance scores agent-corrected.
- `prompts.csv` - 122 prompts x 9 categories x 3 funnel stages, winnability + incumbents
- `brand-radar-prompts.txt` - 40 ready to import, no overlap with the existing 5
- `gaps.md` - the strategic memo (terminology bet, 10 dark clusters, 10 competitor gaps,
  where the product's own positioning is unsupported, what to do first, limits)
- `dark-demand-clusters.md` - 12 clusters with verbatim quotes + URLs, plus explicit
  "loud but noise" and "could not substantiate" sections

Validated: 0 malformed rows, 0 rows missing a source, 0 invented volume figures.
