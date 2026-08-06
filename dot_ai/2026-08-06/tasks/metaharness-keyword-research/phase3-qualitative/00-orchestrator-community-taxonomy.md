# Orchestrator supplement: the community's own taxonomy

Gathered by the orchestrator to close a gap the Phase 3 agents were unlikely to cover: the
`agent harness` and `harness engineering` SERPs surfaced discussion venues and a community
awesome-list that were not in any mining agent's assigned source list.

Source: `github.com/walkinglabs/awesome-harness-engineering` (ranks position 9 for
`harness engineering`, DR 97) and `martinfowler.com/articles/harness-engineering.html`
(position 3, DR 88, 623 est. traffic). Fetched 2026-08-06.

## The canonical definition, verbatim

Martin Fowler:
> "The term harness has emerged as a shorthand to mean everything in an AI agent except the
> model itself - Agent = Model + Harness."

awesome-harness-engineering:
> "the practice of shaping the environment around AI agents so they can work reliably"

`Agent = Model + Harness` is the load-bearing formulation. Any positioning for a layer
*above* the harness has to be legible against that equation.

## The community's section headings, verbatim and in order

These are the closest thing that exists to a market-sanctioned taxonomy for this space.

1. Courses & Learning Resources
2. Foundations
3. **Context, Memory & Working State**
4. **Constraints, Guardrails & Safe Autonomy**
5. **Specs, Agent Files & Workflow Design** - AGENTS.md, agent.md, GitHub Spec Kit
6. **Evals & Observability** - Inspect AI, AgentOps, agenttrace
7. Benchmarks - 30+ entries (SWE-bench Verified, Terminal-Bench, GAIA, tau2-bench, OSWorld, ...)
8. **Runtimes, Harnesses & Reference Implementations** - Claude Agent SDK, SWE-agent, SWE-ReX,
   deepagents, AgentKit, browser-use/browser-harness, Citadel, Harbor, Harness Evolver,
   Ralph Wiggum pattern, skills.sh, Uni-CLI, HEAAL

## Mapping to our 9-category taxonomy

| Our category | Community slot | Status |
|---|---|---|
| `memory` | "Context, Memory & Working State" + "Specs, Agent Files & Workflow Design" | Well covered, split across two headings |
| `governance` | "Constraints, Guardrails & Safe Autonomy" | Covered |
| `observability` | "Evals & Observability" | Covered, but **merged with evals** |
| `evaluation` | "Evals & Observability" + "Benchmarks" | Heavily covered - benchmarks alone has 30+ entries |
| `orchestration` | "Runtimes, Harnesses & Reference Implementations" | Partially - framed as runtimes, not coordination |
| `portability` | "Specs, Agent Files & Workflow Design" (AGENTS.md) | Weakly - only via the agent-file angle |
| `sharing` | **NONE** | No slot exists |
| `crossrepo` | **NONE** | No slot exists |
| `cost` | **NONE** | No slot exists |

## The finding that matters

**metaharness.tools' two flagship problems have no shelf in the community taxonomy.**

The site leads with cross-repository coordination and organizational invisibility (sessions
not shared across a team). Neither `sharing` nor `crossrepo` appears anywhere in the
community's category structure, and neither does `cost`.

This cuts both ways and Phase 5 must present both edges honestly:

- **Opportunity.** Genuine whitespace. Nobody has claimed the vocabulary, so there is no
  incumbent to displace, and this is precisely the "dark demand" tier the plan asks us to
  flag - real problems with no keyword-database footprint and no competitor content.
- **Risk.** No shelf also means no existing search behaviour and no reader expectation. A
  page targeting a category the market has not named gets no traffic on day one. It is a
  content bet with a long payback, not a keyword harvest.

Corroborating detail: Fowler's article, the most authoritative piece in the space, does
**not** discuss memory loss across sessions, session sharing, multi-repo work, or
coordinating multiple agents at all. The problems metaharness.tools is built around are
absent from the canonical text of the discipline it sits inside.

One verbatim phrase from Fowler does land directly on the pitch, and is worth reusing:
> "no social accountability, no aesthetic disgust at a 300-line function, no intuition that
> 'we don't do it that way here,' and no **organisational memory**."

That is Fowler independently naming metaharness.tools' "organizational invisibility" problem,
in the highest-authority article in the category. Strong content hook - it lets the product
argument be made in the discipline's own established vocabulary rather than in a coined term.

## Also noted

- The community merges evals and observability into one heading. Our taxonomy splits them.
  Phase 5 should consider reporting them as a merged cluster to match how people actually
  look for them.
- "Benchmarks" is enormous in the community list but is an academic/leaderboard concern, not
  a buyer problem. It is unlikely to be a useful content target for this product despite its
  size - flag as high-volume, low-relevance.
- Discussion venues surfaced that the Phase 3 Reddit agent was not given: r/AI_Agents,
  r/LLMDevs, r/ClaudeCode, r/vibecoding, r/devops. Thread titles already captured from the
  SERPs, all verbatim:
  - "A lot of conversation around Harness Engineering, What does that even mean?" (r/AI_Agents, DR 95, 343 traffic)
  - "Harness engineering is the next big thing, so I started ..." (r/ClaudeCode)
  - "Why does nobody here talk about harness engineering ?" (r/vibecoding)
  - "How much attention is harness engineering getting?" (r/devops)
  - "What is Agent Harness, Code Harness and Agent SDK" (r/LLMDevs, DR 95, 147 traffic)
  The shape of these titles is itself evidence: people are asking what the term means, which
  means the term is spreading faster than its definition. That is a definitional-content
  opportunity with a short half-life.
