# Orchestrator baseline (Phase 0/2 pre-work)

Run by the orchestrator before Phase 2 fan-out, to (a) test the plan's core premise against
hard data and (b) find the highest-volume term per cluster so Phase 2 agents seed
`related-terms` correctly. The plan warns that `related-terms` returns empty for low-volume
seeds, so seeding with the head term rather than the precise term is load-bearing.

Source: `keywords-explorer-overview` and `serp-overview`, country=us, 2026-08-06.
All numbers below are returned by the API. Keywords absent from a response are recorded as
`no_data`, never estimated.

## Finding 1 - the plan's premise is HALF right, and the half that is wrong matters

The plan asserts "meta-harness has ~zero search volume". Confirmed for the compound term.
But it also led the team to track `agent harness` variants as if they were the same dead
category language. They are not.

| Keyword | US vol | Global vol | KD | Verdict |
|---|---|---|---|---|
| `agent harness` | 1300 | 5200 | 16 | REAL, contested head term |
| `claude code harness` | 400 | 1300 | 3 | Real, KD 3 - best ratio in the tracked set |
| `ai agent harness` | 200 | 600 | no_data | Real |
| `meta harness` | 300 | 400 | no_data | **Empty SERP** - see Finding 2 |
| `metaharness` | 0 | 0 | no_data | Zero |
| `meta harness ai` | 0 | 0 | no_data | Zero |
| `meta-harness` | 40 | 70 | no_data | Thin |

24 of the 41 tracked keywords queried returned NO DATA at all: every `meta harness <x>`
long-tail, every `polygraph <x>` term except `polygraph nx` (10), and every cross-repo and
memory phrasing the team wrote by hand.

## Finding 2 - `meta harness` has an empty SERP

`serp-overview` for `meta harness` returns `{"positions": []}`. Ahrefs has no result set for
it. So the reported 300 US volume has nothing behind it and should not be treated as
addressable. HYPOTHESIS (not yet verified): the residual volume is the ML-research sense
(harness optimization) plus "Meta" the company colliding with "harness". Worth one check
before anyone writes a page targeting it.

`agent harness`, by contrast, has a full SERP with an AI Overview and 10 organic results.

## Finding 3 - who owns `agent harness` today

AI Overview cites, and organic ranks: LangChain (DR 87, pos 2, 279 traffic), Microsoft Learn
(DR 96, pos 3), Databricks (DR 88, pos 4, 856 traffic), Reddit r/LLMDevs + r/AI_Agents
(DR 95, pos 5), Medium (pos 6), YouTube (pos 7), Addy Osmani (DR 79, pos 9), Salesforce
(DR 92, pos 10), plus O'Reilly Radar, MindStudio, and github.com/HKUDS/OpenHarness in the
AI Overview sitelinks.

KD is only 16 despite those domain ratings, because the term is new and the specific pages
have few backlinks. This is a winnable SERP for a credible technical page, and it is where
the category conversation is actually happening.

People Also Ask, captured verbatim (these are ready-made prompt/heading targets):
- "What is an agent harness?"
- "Is Claude Code an agent harness?"
- "What are examples of agent harnesses?"

## Finding 4 - the real head terms, by cluster

These are the seeds Phase 2 should hand to `related-terms`, instead of the precise
long-tail phrasings.

| Keyword | US | Global | KD | Category |
|---|---|---|---|---|
| `context engineering` | 2900 | 18000 | 54 | memory |
| `claude code subagents` | 1800 | 5900 | 26 | orchestration |
| `claude.md` | 1100 | 6300 | 43 | memory |
| `llm observability` | 1100 | 3400 | 13 | observability |
| `harness engineering` | 1100 | 18000 | 51 | landscape - SENSE UNVERIFIED, see below |
| `agent harness` | 1300 | 5200 | 16 | landscape |
| `claude code memory` | 1000 | 3900 | **9** | memory |
| `ai agent orchestration` | 1000 | 3200 | **8** | orchestration |
| `agent orchestration` | 1000 | 3200 | 30 | orchestration |
| `agents.md` | 900 | 4100 | 39 | memory / portability |
| `ai coding agents` | 700 | 1900 | 30 | landscape |
| `agent memory` | 600 | 2600 | 60 | memory |
| `agent observability` | 500 | 900 | 23 | observability |
| `claude code harness` | 400 | 1300 | **3** | landscape |
| `ai agent governance` | 400 | 700 | 12 | governance |
| `ai agent memory` | 400 | 1400 | 19 | memory |
| `coding agents` | 350 | 2200 | 23 | landscape |
| `git worktree claude code` | 300 | 1200 | no_data | orchestration / crossrepo |
| `agent sandbox` | 250 | 900 | no_data | governance |
| `agent control plane` | 200 | 300 | no_data | orchestration |
| `subagents` | 200 | 1400 | 17 | orchestration |
| `claude code context` | 200 | 900 | no_data | memory |
| `background agents` | 150 | 250 | 26 | orchestration |
| `agent infrastructure` | 100 | 200 | 7 | orchestration |
| `claude code token usage` | 100 | 700 | no_data | cost |
| `agent harness engineering` | 80 | 250 | no_data | landscape |
| `resume claude code session` | 80 | 200 | no_data | sharing / portability |
| `claude code session` | 60 | 300 | no_data | sharing |
| `share claude code session` | 30 | 70 | no_data | sharing |
| `multi repo` | 10 | 60 | 5 | crossrepo - effectively dead, parent is `what is a monorepo` |

## Reads for Phase 5

1. **Demand is tool-anchored, not category-anchored.** `claude code memory` (1000, KD 9)
   outperforms `agent memory` (600, KD 60) on both volume and difficulty. The Claude Code
   prefix is the single most productive modifier found. Phase 2 should weight the
   `tool_anchored` framing heavily.
2. **Lowest-difficulty real terms:** `claude code harness` (KD 3), `agent infrastructure`
   (KD 7), `ai agent orchestration` (KD 8), `claude code memory` (KD 9), `ai agent
   governance` (KD 12), `llm observability` (KD 13).
3. **`multi repo` is dead as a keyword** (10 US, parent topic `what is a monorepo`) even
   though cross-repo coordination is metaharness.tools' stated #1 problem. Strong early
   candidate for the dark-demand tier: the problem is real, the search vocabulary is not
   there yet. Phase 3 must carry this category.
4. **`harness engineering` sense check: RESOLVED, and it is the headline finding.**
   See Finding 5. Not contaminated. It is the term winning organically.
5. **Subreddit gap found.** The `agent harness` SERP surfaces r/LLMDevs and r/AI_Agents as
   ranking discussion sources. Neither was in the Phase 3 Reddit agent's subreddit list.
   The `harness engineering` SERP adds r/ClaudeCode, r/vibecoding, and r/devops.
   Must be covered by a supplementary pass.

## Finding 5 - `harness engineering` is the term that is organically winning

I ran `serp-overview` on `harness engineering` specifically to test whether its 18000 global
volume was contaminated by Harness.io (the CI/CD vendor) or automotive wire harnesses.
It is not. Every result on page 1 is the AI-coding-agent sense.

| Pos | Result | DR | Traffic |
|---|---|---|---|
| 2 | **openai.com/index/harness-engineering/** - "leveraging Codex in an agent-first..." | 93 | 573 |
| 3 | **martinfowler.com/articles/harness-engineering.html** - "for coding agent users" | 88 | 623 |
| 4 | reddit.com/r/AI_Agents - "A lot of conversation around Harness Engineering, what does that even mean?" | 95 | 343 |
| 6 | addyosmani.com/blog/agent-harness-engineering/ | 79 | 32 |
| 7 | YouTube - "Harness Engineering: How to Build Software When Humans..." | 99 | 89 |
| 8 | developers.redhat.com - "Structured workflows for AI-assisted development" | 91 | 57 |
| 9 | **github.com/walkinglabs/awesome-harness-engineering** | 97 | - |
| 10 | Dex Horthy (HumanLayer) - "Harness Engineering is not Enough: Why Software Factories Fail" | - | - |

AI Overview additionally cites Lilian Weng's Lil'Log ("Harness Engineering for
Self-Improvement", 2026-07-04), Milvus, MindStudio, LinkedIn, and nxcode.io (unrelated to Nx,
name collision only).

Also in the news block: Ken Huang's substack "Harness Engineering as the **Umbrella
Discipline**", a Medium piece "Harness Engineering vs Agentic Engineering: The Hidden Divide",
and arXiv 2607.28802 organizing 41 agent failure modes across the model/harness/user/tools/
memory/environment seams.

People Also Ask, verbatim:
- "What is harness engineering?"
- "Is Claude code harness engineering?"
- "What is the difference between harness engineering and agent engineering?"
- "Why is it called harness engineering?"

An X thread in the results names the whole term ladder explicitly:
"from prompt -> context -> harness -> loop -> graph engineering ... each layer wraps the one
before it".

### Why this is the most consequential finding so far

OpenAI, Martin Fowler, Lilian Weng, Red Hat, and Addy Osmani have all published under
`harness engineering` inside the last year, and there is already an `awesome-` list, which
is the clearest available signal that a community taxonomy has formed. Community awesome-list
category headings were exactly what the Phase 3 blogs agent was told to hunt for; the SERP
surfaced one before that agent reported.

This reframes the central positioning question for Phase 5. It is no longer "does
meta-harness have volume" - it plainly does not. It is: **can "meta-harness" survive as a
sub-term inside "harness engineering" discourse, or should the layer-above-the-harness idea
be expressed in harness-engineering vocabulary instead?** Note that Ken Huang is already
using "umbrella discipline" for harness engineering - the umbrella slot that "meta-harness"
wants may already be occupied.

Do NOT treat this as settled. It is one SERP. Phase 3 must corroborate with independent
qualitative evidence before Phase 5 recommends a terminology bet.
