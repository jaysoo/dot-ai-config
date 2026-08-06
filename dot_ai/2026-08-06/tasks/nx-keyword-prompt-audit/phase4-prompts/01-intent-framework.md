# Phase 4 prompt framework

Prompt text comes from Phase 2 step 4 (People Also Ask) and Phase 3 community verbatims.
This file fixes the structure those inputs get poured into, and the rules the final set must
satisfy. Written before the inputs land so the inputs cannot bend the structure.

## Rule 1 - majority unbranded

The current set fails visibility measurement because 8 of 13 prompts name Nx in the
question, which forces share of voice to 1.00 (see `00-brand-radar-baseline.md`).

Target: **at most 1/3 of prompts may name Nx.** Every branded prompt carries a `branded`
tag so the dashboard can exclude them from any visibility metric. Branded prompts are still
worth keeping - they measure *how* Nx is framed, not *whether* it appears - but they must be
segmented, not averaged in.

## Rule 2 - intent groups

Nine groups. 2-4 prompts each, 22-30 total.

| # | Group | Tag | Branded allowed | Notes |
|---|---|---|---|---|
| 1 | Tool selection | `monorepo` | no | 4 canonical survivors from Phase 0 |
| 2 | CI performance / cost, problem-first | `ci-cost`\|`ci-caching` | no | Verbatims with real numbers preserved ("40 minutes", "$4k a month") |
| 3 | Flaky tests | `ci-flaky` | no | Highest commercial signal in the keyword set ($14 CPC) |
| 4 | Migration | `migration` | mixed | Both directions; the away-from-Nx ones are churn trackers |
| 5 | Framework-specific | `monorepo` | no | Angular / Nest / Next / React - Nx's actual acquisition paths |
| 6 | Nx Cloud feature demand | `nx-cloud-features` | no | Test splitting, distribution, self-healing CI, remote cache |
| 7 | AI / agents | `ai-tooling` | no | MCP setup, agents in large repos |
| 8 | Sentiment trackers | `sentiment` | yes | The 3 Phase 0 survivors + any negative framings Phase 3 surfaces |
| 9 | Enterprise evaluation | `nx-cloud-features`\|`branded` | no | SOC2, on-prem caching, support SLAs, air-gapped |

Groups 6, 7 and 9 have zero coverage today. Group 2 has one prompt. Groups 3, 4, 5 have none.

## Rule 3 - model coverage

Every kept prompt runs on **ChatGPT + Claude + Perplexity + Google AI Overviews** at minimum.
Today every source except ChatGPT is `off` in the report config.

Justification for Claude specifically: developer traffic skews Claude-heavy, and Nx's own
positioning (MCP server, agent workflows) targets exactly the population using it. A
ChatGPT-only reading of AI visibility is a partial reading.

This is a config change on the Brand Radar report, not a CSV deliverable - flag it for
whoever owns the Ahrefs account (jeff@nrwl.io) with the prompt import.

## Rule 4 - empirical winnability screen

Before a candidate prompt enters the final set, run it against the target models and record
which tools the answer names. Then:

- **Drop** prompts where the answer never names build tooling. The framing is unwinnable and
  the slot is wasted.
- **Prioritise** prompts where Turborepo / Depot / Develocity / Bazel are named and Nx is
  absent. Those are the winnable gaps and the whole point of the exercise.
- **Keep but tag `defend`** prompts where Nx already appears - they become regression
  detectors, not growth targets.

Record the run date and the named-tools list per prompt. Without that baseline the tracker
cannot tell a real movement from model drift.

Note: this screen is the only source of AI-answer citations in this project. Ahrefs' global
Brand Radar corpus is unavailable on this plan, so nothing in Phase 4 may cite an AI answer
that was not produced by an actual model run recorded here.

## Rule 5 - tagging parity with keywords

Prompt tags come from the same taxonomy as keywords (`monorepo`, `cli-competitors`,
`ci-competitors`, `ci-observability`, `ci-cd`, `ci-caching`, `ci-cost`, `ci-flaky`,
`module-federation`, `ai-tooling`, `nx-cloud-features`, `migration`, `branded`, `unbranded`)
plus two prompt-only tags: `sentiment` and `defend`.

Same tags on both sides means the keyword dashboard and the prompt dashboard segment
identically, which is the only way to answer "are we winning this cluster" in one look.

## Deliverables

- `output/prompts-add.csv` - `prompt,intent_group,tags,branded,models,winnability,named_tools_baseline,source`
- `output/brand-radar-import.txt` - one prompt per line, grouped by model with a header comment
