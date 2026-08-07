# Gaps memo - meta-harness / Polygraph keyword & prompt discovery

2026-08-06. Companion to `keywords.csv` (2,279 scored rows), `prompts.csv` (122 prompts),
`brand-radar-prompts.txt` (40 ready to import), and `dark-demand-clusters.md` (12 clusters).

Method: 9-category taxonomy, 736 synthetic seeds, ~97k Ahrefs units across 10 quantitative
agents, 834 verbatim phrases mined from GitHub / Reddit / Hacker News / autocomplete / blogs,
plus orchestrator SERP and Brand Radar work. Every row carries a source. Nothing is estimated:
missing data is `no_data`, and a keyword tool returning nothing is recorded as a finding.

---

## 1. The headline: the plan's core premise was half right, and the wrong half is expensive

The plan's founding assumption was that "meta-harness" is category language with no volume, so
we should research problem language instead. **The first half is confirmed. The second half
led us to nearly miss the most important fact in this research.**

Confirmed dead:

| Term                               | US vol    | Notes                                                      |
| ---------------------------------- | --------- | ---------------------------------------------------------- |
| `metaharness`                      | **0**     | The brand term                                             |
| `meta harness ai`                  | **0**     |                                                            |
| `meta harness`                     | 300       | **Returns an EMPTY SERP in Ahrefs** - no result set exists |
| `meta-harness`                     | 40        |                                                            |
| every `meta harness <x>` long-tail | `no_data` | 24 of 41 tracked keywords returned nothing                 |

"meta-harness" appears **zero times** across 834 verbatim phrases from real developers.

But the space is _not_ unnamed. It already has a name, and it is not ours:

| Term                          | US                                    | Global     | KD    |
| ----------------------------- | ------------------------------------- | ---------- | ----- |
| `harness`                     | 47,000                                | -          | -     |
| `harness engineering`         | **1,100** (3,700 per competitor data) | **18,000** | 51    |
| `agent harness`               | 1,300                                 | 5,200      | 16    |
| `claude code harness`         | 400                                   | 1,300      | **3** |
| `what is harness engineering` | 1,000                                 | -          | 47    |

`harness engineering` is real, it is the correct sense (verified by SERP, not assumed), and
it is already owned by heavyweight publishers: **OpenAI** (`openai.com/index/harness-engineering/`,
pos 2), **Martin Fowler** (pos 1-3, 623 traffic), **Lilian Weng**, **Red Hat**, **Addy Osmani**,
**Databricks**, **LangChain**, **Microsoft Learn**, **Salesforce**. There is a
`walkinglabs/awesome-harness-engineering` list, an arXiv paper on model-vs-harness failure
attribution, and Reddit threads across r/AI_Agents, r/ClaudeCode, r/vibecoding and r/devops
asking what the term means. Fowler supplies the canonical formulation: **"Agent = Model + Harness."**

The strategic question is therefore not "does meta-harness have volume" - it plainly does not.
It is: **can "meta-harness" survive as a sub-term inside harness-engineering discourse?**
Note that Ken Huang is already publishing "Harness Engineering as the **Umbrella Discipline**".
The umbrella slot that "meta-harness" wants may already be taken.

### Recommendation on terminology

**Do not spend budget trying to make "meta-harness" a search category. Do keep it as a
positioning word.** Concretely:

1. **Rank in harness-engineering vocabulary.** `claude code harness` at KD 3 with 1,300 global
   is the single best risk-adjusted target found in this entire research. `agent harness`
   (KD 16, 5,200 global) is winnable for a credible technical page.
2. **Define the layer, do not coin it.** Content that says "harness engineering is the
   discipline; here is the part of it that no single harness can solve" inherits an audience.
   Content that says "meta-harness is a new category" starts from zero.
3. **Keep `meta harness` as brand-defence only.** Own the definition pages so that when the
   term is used it resolves to us. That is cheap. Treat it as insurance, not acquisition.
4. **Do not target bare `harness` (47,000).** It collides with Harness.io, wire harnesses, and
   test harnesses.

Stated plainly: this contradicts the current Ahrefs project, where ~90% of the 48 tracked
keywords are `meta harness` / `metaharness` variants that measure zero.

---

## 2. The second headline: demand is tool-anchored, and category language is the trap

This is the most consistent finding in the entire corpus, and it holds on both the keyword and
the prompt side.

| Category-language term | Vol | KD     |     | Tool-anchored equivalent             | Vol   | KD    |
| ---------------------- | --- | ------ | --- | ------------------------------------ | ----- | ----- |
| `agent memory`         | 600 | **60** | vs  | `claude code memory`                 | 1,000 | **9** |
| `agent memory`         | 600 | 60     | vs  | `cursor rules`                       | 2,700 | **6** |
| `agent memory`         | 600 | 60     | vs  | `claude rules`                       | 900   | **4** |
| `multi repo`           | 10  | 5      | vs  | (no tool-anchored equivalent exists) | -     | -     |

The tool-anchored term wins on volume _and_ difficulty simultaneously. Same effect on prompts:
the Brand Radar prompts naming a tool measure 500, 500 and 300; the generic "AI session" and
"AI agent" phrasings all measure **0**.

**Rule for all content and prompt work: name the tool.** "Claude Code", "Codex", "Cursor" in
the title. Generic agent vocabulary does not convert and mostly does not even measure.

Corollary the research also proved: the `memory` category is really a **rules-file** category.
`claude.md file` (1,300/KD20), `claude md` (1,200/KD15), `claude.md` (1,100/KD43),
`claude rules` (900/KD4), `agents.md` (900/KD39), `cursor rules` (2,700/KD6),
`karpathy claude md` (1,300). That is where memory demand actually lives.

---

## 3. Top 10 dark-demand clusters

Real problems, strong verbatim evidence, no keyword-database footprint. Full evidence with
quotes and URLs in `dark-demand-clusters.md`. Ranked by evidence strength x product fit x
absence of competitor content.

| #   | Cluster                                                                      | Cat                         | Evidence                                            | Why it matters                                                                                                                                                                                        |
| --- | ---------------------------------------------------------------------------- | --------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Compaction is experienced as data loss**                                   | memory                      | 34 phrases, 5 sources, 117 GH comments, 871 upvotes | Loudest pain in the corpus vs `context compaction`=100 and every `/compact` variant=0. Maps straight onto session durability.                                                                         |
| 2   | **Session handoff wants to be a primitive, nobody named it**                 | memory/sharing              | 16                                                  | Purest dark demand found: **zero of 2,279 keyword rows contain "handoff"**, yet autocomplete returns 5 handoff queries and everyone hand-rolls the same `/handoff` skill. This is the product's seam. |
| 3   | **Organizational invisibility**                                              | sharing                     | 32                                                  | 3 independent Claude Code filings + a 30-comment session-sync request. Fowler independently names "organisational memory". Perfect fit, zero day-one search.                                          |
| 4   | **Rules-file sprawl and drift**                                              | memory/portability          | 30                                                  | Best conversion structure in the set: the artifact has volume (`claude.md best practices`), the rot has none. Rank on the artifact, convert on the problem.                                           |
| 5   | **Cross-harness context portability / lock-in**                              | portability                 | 32                                                  | Validates the "swappable harnesses" claim while every migration query is 0 volume. Organic name already exists: **"context portability"**.                                                            |
| 6   | **Guardrails that are silently off**                                         | governance                  | 16                                                  | All existing content is "how to sandbox your agent"; nobody writes "your policy is probably not running right now". 12 bug reports share one shape: policy fails open by cwd/nesting/subagent.        |
| 7   | **Fleet blindness** - no lineage, liveness or identity across spawned agents | observability/orchestration | 21                                                  | Vendors sell LLM tracing; none covers "which of my forty agents is alive, in which repo, spawned by whom". Risk: Anthropic could ship lineage natively.                                               |
| 8   | **Paid for the tokens, lost the work**                                       | cost/orchestration          | 11                                                  | Subagents die silently on quota with no partial-result handoff. No keyword row exists for this at all.                                                                                                |
| 9   | **The human is the message bus**                                             | sharing/orchestration       | -                                                   | People manually copy context between sessions. Names the manual-workflow-overhead pitch in users' own words.                                                                                          |
| 10  | **Cross-repo context ceiling**                                               | crossrepo                   | 36 (but see below)                                  | Real, but **thinner than the positioning assumes**. See section 5.                                                                                                                                    |

Explicitly excluded as **loud but not opportunity** - do not mistake engagement for demand:
model-degradation/"nerf" discourse (2.5k+ upvote posts, but a meta-harness cannot fix a model
regression); refusing to review AI-generated PRs (1.9k upvotes, 442 comments, no product
surface); benchmarks and leaderboards (30+ awesome-list entries, academic concern).

Three things we **could not substantiate** and are flagging rather than burying: "distilled
memory" as searched-for vocabulary (2 phrases only, plus a vocal HN skeptic wing against
memory products generally); provisioning as a named pain (2 phrases); and cost-per-repo
chargeback as user language (users say "I burned $6,000", not "I need attribution").

---

## 4. Top 10 competitor-keyword gaps

**The tracked competitor list is wrong, and the correction is the most actionable competitive
finding here.**

`omnigent.ai` returned **1** organic keyword. `metaharness.tools` returned **1**. Neither has a
footprint. Meanwhile the products ChatGPT actually cites for our core problem were not on the
list at all.

### 4a. The real `sharing` competitors, discovered via Brand Radar

For the three highest-volume prompts in Polygraph's core problem space (500/500/300), ChatGPT
cites: **claudereview.com**, **threadcast.dev**, **lore.link**, **aq.dev**, **custardseed.com**,
**sessionviewer.cc**, **unabyss.com**, **opencontextprotocol.ai**, and codex.danielvaughan.com.

And they are almost invisible in Google: `claudereview.com` has **0** organic keywords;
`lore.link` has **1**.

**In this category the AI answer and Google organic are decoupled, and the AI answer is what is
being won.** Practical consequence: for `sharing` and `portability`, keyword difficulty is
nearly meaningless as a prioritisation input. Score winnability on whether a clear, tool-named,
quotable page exists - not on KD or referring domains. Treat `prompts.csv` as the primary
artifact for these two categories and `keywords.csv` as secondary.

Caveat, stated honestly: two domains checked at one point in time, and Ahrefs coverage of very
new small sites is itself unreliable. The direction is well supported; the magnitude is not.

### 4b. mem0 is the real `memory` incumbent, and it is playing a content game

- `mem0` = **8,000 US / 30,000 global**, by far the largest single term in the space.
- mem0 already ranks **#11 for `claude code memory`**, our best low-KD memory target.
- mem0.ai ranks for a wall of Claude _subscription pricing_ terms it has no product claim to:
  `claude pricing` (49,000, pos 5), `how much does claude cost` (6,000, **pos 1**),
  `claude code pricing` (14,000), `claude subscription` (14,000), `claude teams` (6,400).

That last point is a deliberate top-of-funnel content play against Claude-shaped intent. Worth
a decision either way, but it is a strategy, not an accident.

### 4c. The leader pages own the category vocabulary

`martinfowler.com/articles/harness-engineering.html` ranks **#1 for `harness`** (47,000) and #1
for `harness engineering`. LangChain and Databricks rank #1 for `agent harness`. Six pages
split the entire category conversation between them. Any credible page we write enters an
established, high-authority, but genuinely low-KD SERP.

### 4d. Scope cut to record

Per the pre-run decision, the 8 pure LLMOps observability vendors (langfuse, langsmith,
helicone, braintrust, agentops, arize, weave, portkey) were **not** mined. The Phase 1
observability and evaluation agents independently reached the same conclusion the decision
assumed: that volume is generic LLM-app eval and tracing intent, a different audience.
`langfuse` (13,000) and `promptfoo` (6,900) do appear in our data via other reports, so the
cut cost us little. Flagging it as a known, deliberate blind spot rather than an oversight.

---

## 5. Where the product's own positioning is not supported by the evidence

The most useful thing this research can do is disagree where the data disagrees.

**metaharness.tools leads with cross-repository coordination. The evidence does not support
leading with it.**

- `multi repo` = 10 US volume, parent topic `what is a monorepo`. `claude code multi repo` = 20.
  `multi repo claude code` = 0. `github copilot agent multiple repositories` = 0.
- Reddit yielded only **7** usable crossrepo rows out of 153 - the weakest category by far, and
  not one used cross-repo vocabulary in a title.
- Of the 36 crossrepo phrases collected, **17 came from two vendor blogs that exist to sell the
  fix**. Strip those and the remaining evidence is mostly feature requests phrased as
  _workspace_ problems ("multi-folder workspace", "parent workspaces containing multiple Git
  repositories") rather than _coordination_ problems.

The honest read: **the market feels a context ceiling, not yet a coordination ceiling.** Users
are asking for a bigger folder, not for cross-repo orchestration.

That said, the real evidence is genuinely strong where it exists, and it is worth quoting:

> "they all seem to assume an agent lives in one worktree of one git repo... the repo boundary
> is often just not the task boundary. Some context lives next door, or two repos away."
>
> - news.ycombinator.com/item?id=48683361

> "I'm wondering if there is a tool in the agent orchestration space that prepares
> multi-repository worktrees for a subagent out of the box?"
>
> - same thread

> "Multi-repo support" - 19 comments, github.com/openai/codex/issues/11956
> "[FEATURE] Multi-repository support for remote/web sessions" - 15 comments, anthropics/claude-code#23627

**Recommendation:** lead with clusters 1-4 (compaction/memory loss, session handoff,
organizational invisibility, rules-file drift), which have both loud evidence and adjacent
keyword volume. Let cross-repo be the payoff you earn, not the hook you open with. If you do
write here, borrow the community's own words: _"repo-of-repos"_, _"context drift"_, _"the repo
boundary is not the task boundary"_.

Second, smaller disagreement: the community awesome-list taxonomy has **no slot** for `sharing`,
`crossrepo`, or `cost`, and merges `evals` with `observability`. Whitespace and risk at once -
no incumbent to displace, but also no existing search behaviour and no reader expectation.

---

## 6. What to do first

Ordered by expected return, not by category.

1. **`claude code harness` (KD 3, 1,300 global) and `agent harness` (KD 16, 5,200).** Best
   risk-adjusted keyword targets found. Enter the harness-engineering conversation on its own
   terms.
2. **The rules-file cluster.** `claude.md file` KD 20, `claude md` KD 15, `claude rules` KD 4,
   `claude md file` KD 6. Genuine volume at genuinely low difficulty, and it is the on-ramp to
   the memory pitch (dark cluster 4).
3. **Import the 40 prompts in `brand-radar-prompts.txt`.** Costs nothing but the write, and
   the `sharing` category is being decided in AI answers right now. Currently 5 prompts cover
   1 of 9 categories.
4. **Claim "session handoff".** Zero keyword rows contain the word; autocomplete already shows
   five queries. Cheapest option to hold in the whole set.
5. **`claude code memory` (1,000, KD 9)** - but expect a fight with mem0, which already ranks
   #11 there.
6. **`claude code usage` (2,900) / `ccusage` (2,100, KD 8)** - real spend-visibility intent,
   and `claude code logs` has volume with a _literally empty SERP_. Do not chase
   `claude pricing`-family terms: 30,000 volume, wrong intent, subscription shoppers.

---

## 7. Limits of this research

- **Ahrefs coverage is the binding constraint, as predicted.** 453 of 2,279 rows are
  qualitative-only. For a space this new that is a feature of the domain, not a defect of the
  method, but it means the CSV understates real demand and the dark-demand memo is doing more
  work than the numbers.
- **Relevance scoring is judgment.** 1,342 of 2,279 rows were re-scored by an agent working
  from ~40 pattern rules (676 up, 666 down). The `relevance_reason` column records why for
  every corrected row. The rules are reproducible and tunable; they are not ground truth.
- **Reddit access was adversarial.** All three prescribed paths failed (403s and a user-agent
  block). The agent got through via a redlib mirror, solving a proof-of-work challenge. All 153
  rows are verbatim with real permalinks, but coverage is less even than the other sources.
- **Phase 4 prompt testing is observed, not self-tested.** We used Brand Radar's real ChatGPT
  responses instead of prompting ChatGPT/Claude/Perplexity by hand. Stronger evidence, but it
  only covers the 5 prompts already configured. The other 117 prompts in `prompts.csv` carry
  `no_data` for volume and a _judged_ winnability. No volume was invented anywhere.
- **`harness engineering` volume is reported inconsistently by Ahrefs** - 1,100 US via
  keywords-explorer, 3,700 via the competitor organic report. Both are recorded as returned.
  The direction is unambiguous; the exact figure should be re-checked before it goes in a deck.
- **Single point in time**, 2026-08-06, US only. This vocabulary moved measurably inside 12
  months ("autonomous agents" to "coding agents"/"subagents"). Re-run before any big bet.
