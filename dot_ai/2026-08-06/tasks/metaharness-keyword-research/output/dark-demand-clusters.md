# Dark demand clusters — metaharness.tools / Nx Polygraph

Built from 834 verbatim phrases across GitHub (212), Hacker News (152), Google/Bing/YouTube
autocomplete (150), Reddit (140), blogs and awesome-lists (~180), cross-checked against the 453
`tier == dark-demand` rows and the 1,826 measured/no-signal rows in `output/keywords.csv`.

**Qualification bar used.** A cluster is dark demand only if (a) repeated verbatim evidence,
ideally from more than one source, (b) no Ahrefs volume behind any phrasing of it, and (c) it maps
to something the product actually does. Clusters that fail (c) are listed at the bottom as noise,
not promoted.

**Verdicts on the three pre-registered questions** (details in the relevant sections):

| Question | Verdict |
|---|---|
| Compaction/context-loss is loud qualitatively, near-dead quantitatively | **CONFIRMED.** 34 phrases, 5 sources, 117 GitHub comments, 871 Reddit upvotes. `context compaction` = 100/mo; every `/compact` variant = 0. Textbook dark demand, ranked #1. |
| Cross-repo coordination is the product's stated #1 problem but the market may not feel it | **PARTIALLY REFUTED, honestly.** The pain is real and specific on GitHub trackers (Codex "Multi-repo support" = 19 comments), but ~half the prose evidence is vendor blogs selling the fix, and no user reaches for cross-repo vocabulary when searching. Ranked #8, not #1. |
| Organizational invisibility has no taxonomy slot — is anyone complaining? | **CONFIRMED, people are complaining.** Three independently filed Claude Code issues (#40981 closed as duplicate, #48828, #60082), 57 GitHub comments, plus Fowler naming "organisational memory". Ranked #3. |

Ranking is evidence strength x product fit x absence of competitor content.

---

## 1. Compaction is experienced as data loss, not summarization

- **Category:** memory
- **Evidence:** 34 phrases — github 16, hackernews 9, reddit 4, blogs 2, awesome-list 2, autocomplete 1
- **Engagement:** 117 GitHub issue comments, ~871 Reddit upvotes
- **Keyword coverage:** `context compaction` = 100 US / 250 global. `claude code context compaction` = 20. `claude code automatic context compaction`, `codex context compaction`, `claude code /compact command context compaction`, `claude agent sdk context compaction` = **all 0**. No keyword exists at all for "survive compaction", "working state continuity", "compaction data loss".

> "[BUG] Claude forgets everything in CLAUDE.md after compaction" (20 comments)
> https://github.com/anthropics/claude-code/issues/6354

> "Working-state continuity: survive compaction and /clear (the long-session "goes dumb" problem)"
> https://github.com/anthropics/claude-code/issues/70555

> "And then the context window gets exhausted. Compaction loses most of the details and degrades quality. You start a new session, but the new session has to re-learn the entire world from scratch"
> https://news.ycombinator.com/item?id=46584827

> "I agree after compaction it's like dealing with something that's developed a bad case of dementia, but you've run out what is the alternative?"
> https://news.ycombinator.com/item?id=47110366

> "Auto-compaction silently discards all conversation history since 0.145.0"
> https://github.com/openai/codex/issues/36642

> "The root cause was context window compaction dropping her safety instruction. The agent kept working. It just lost the part where it was supposed to ask first."
> https://news.ycombinator.com/item?id=47269231

**Why it matters.** This is the single loudest pain in the corpus and it has essentially no search
surface, because people do not search for it — they file bugs about it and vent on HN. The framing
gap is the opportunity: vendors write about "context management", users experience "my agent got
amnesia halfway through and I did not notice". The product's session durability and distilled
memory land exactly here, and the last quote shows compaction eating a *guardrail*, which connects
this cluster to the governance pitch for free. Content bet: name the failure ("compaction is data
loss"), not the mechanism.

---

## 2. Session handoff wants to be a primitive, and no one has named it

- **Category:** memory / sharing
- **Evidence:** 16 phrases — hackernews 6, autocomplete 6, github 2, cursor forum 1, reddit 1
- **Engagement:** thin on counters, but the autocomplete presence is the tell
- **Keyword coverage:** **zero rows in the entire 2,279-row keyword file contain "handoff", "hand off", or "handover".** Google autocomplete returns `claude code session handoff`, `claude code session handoff skill`, `codex session handoff`, `claude code context handoff`, `multi agent handoff` — five distinct suggested queries with no Ahrefs volume behind any of them.

> "I've basically never edited a skill or memory myself. I make the LLM do it as part of the /handoff skill before I clear a session."
> https://news.ycombinator.com/item?id=48623324

> "It's funny because with so many different implementations of /handoff, I wonder if anyone has benchmarked handoff-and-resume to figure out what the best performance implementation looks like."
> https://news.ycombinator.com/item?id=48623608

> "It should be a first class feature of the harness, tbh. It kind of is with the /compact [focus] parameter but this is coarse and leaves no record."
> https://news.ycombinator.com/item?id=48630851

> "[FEATURE] first-class session handoff + per-session token budgets for unattended runs"
> https://github.com/anthropics/claude-code/issues/63076

> "Write "handoff docs" between agent sessions"
> https://forum.cursor.com/t/how-are-people-handling-context-across-different-ai-coding-tools/159891

> "Async handoff where a teammate picks up exactly where you left off (richer than a shared transcript)."
> https://github.com/anthropics/claude-code/issues/60082

**Why it matters.** This is the purest dark-demand cluster in the set: autocomplete proves the
query is being typed, the keyword database has literally nothing, and everyone is hand-rolling the
same `/handoff` skill. Note the split — `claude code resume session` has 200/mo of real volume, so
*single-user resume* is a solved, contested term. The dark half is handoff **to someone or
something else**: another session, another agent, another human. That is exactly the product's
seam. Own the word "handoff" before a harness ships it as a built-in and absorbs the term.

---

## 3. Organizational invisibility — sessions are locked to the person who had them

- **Category:** sharing
- **Evidence:** 32 phrases — github 23, hackernews 6, reddit 3
- **Engagement:** 57 GitHub comments, ~748 Reddit upvotes
- **Keyword coverage:** `claude code share session` = 40, `share claude code session` = 30, `how to share claude code session` = 20, `codex share session` = 0, `ai coding team collaboration` = 0. Nothing at all for organizational agent memory. No slot in the community awesome-list taxonomy.

> "useful context from Claude Code sessions — debugging sessions, architectural decisions, code explanations — stays locked to the individual who had the conversation"
> https://github.com/anthropics/claude-code/issues/40981

> "This leads to duplicated effort, lost context during handoffs, and slower onboarding."
> https://github.com/anthropics/claude-code/issues/40981

> "Claude Code is increasingly used inside teams, but the paradigm is still 'single user + agentic delegation.'"
> https://github.com/anthropics/claude-code/issues/60082

> ""Teammates" and "peer sessions" all belong to the same account — different devices/processes, not different humans."
> https://github.com/anthropics/claude-code/issues/60082

> "The only workarounds are screen sharing (one person types) or tmux session sharing (not officially supported)."
> https://github.com/anthropics/claude-code/issues/60082

> "When I began reviewing my teammate's PRs with AI generated code in it, something started to feel weird. It took a bit, but I realized the problem: I am not reviewing the work my teammate did."
> https://news.ycombinator.com/item?id=47217963

> "Love to see people creating such projects... Have you thought on making it collaborative memory across your teammates working on the repo? how does your framework handle stale memory, when someone changes the code that breaks the memory store?"
> https://news.ycombinator.com/item?id=48626427

**Why it matters.** The orchestrator asked whether anyone is actually complaining. They are, three
times independently, on the vendor's own tracker, and #40981 was closed as a duplicate — which is
itself a demand signal. `[FEATURE] Sync conversation history between CLI and Claude Code desktop
app` carries 30 comments, the highest in the sharing set. Add Fowler independently naming
"organisational memory" in the highest-authority article in the discipline and you can make this
argument in the category's own vocabulary rather than a coined one. Perfect product fit
(multiplayer sessions, distilled org memory). The catch is the one the taxonomy doc already flagged:
there is no shelf, so day-one traffic is zero. This is a positioning bet, not a keyword harvest.

---

## 4. Rules-file sprawl and drift

- **Category:** memory / portability
- **Evidence:** 30 phrases — github 21, reddit 5, cursor forum 4
- **Engagement:** 88 GitHub comments, ~1,260 Reddit upvotes
- **Keyword coverage:** the *artifact* has volume (`claude.md best practices`, `agents.md vs claude.md` are live queries), but the *problem* has none. No keyword row anywhere for rules drift, stale AGENTS.md, duplicated instruction files, or hierarchical rules resolution.

> "[T3] AGENTS.md/CLAUDE.md rebalance — reduce 24 AGENTS.md copies"
> https://github.com/ariffazil/AAA/issues/145

> "AGENTS.md command reference drift"
> https://github.com/marcusrbrown/tokentoilet/issues/1347

> "Dynamically loading nested AGENTS.md" (24 comments — highest-discussion rules-file request in the Codex tracker)
> https://github.com/openai/codex/issues/12115

> "[FEATURE] Settings.json parent directory traversal for monorepos" (20 comments)
> https://github.com/anthropics/claude-code/issues/12962

> "Tool-specific rules diverging" / "`AGENTS.md` becoming outdated"
> https://forum.cursor.com/t/how-are-people-handling-context-across-different-ai-coding-tools/159891

> "Can someone explain the real difference between Hooks, Skills, Plugins, SKILL.md, CLAUDE.md and agents.md in Claude Code?" (772 upvotes)
> https://www.reddit.com/r/ClaudeCode/comments/1tmq9kz/can_someone_explain_the_real_difference_between/

**Why it matters.** Two failure modes stack: files multiply across repos and harnesses (24 copies
in one repo), and they go stale against the code. The community has a name for the artifact and no
name for the rot. Maps directly onto "repo knowledge and provisioning" and "organizational policy
enforcement". Also the highest-traffic entry point in the set — you can rank for the artifact query
and convert on the problem.

---

## 5. Cross-harness context portability / lock-in

- **Category:** portability
- **Evidence:** 32 phrases — hackernews 15, github 5, awesome-list 3, reddit 3, forum 2, blogs 2, autocomplete 2
- **Engagement:** 185 Reddit upvotes, one 72-point / 28-comment Show HN
- **Keyword coverage:** `migrate from cursor to claude code` = 0 US / 20 global. `switch from cursor to claude code` = 0. `how to migrate from cursor to claude code` = 0. `should i switch from cursor to claude code` = 0. Every phrasing of the migration query is dead despite a visible migration wave.

> "every tool's built-in memory is its own little walled garden. A plain text file is the one language all of them speak."
> https://forum.cursor.com/t/how-are-people-handling-context-across-different-ai-coding-tools/159891

> "the dynamic context — what Cursor learned about your project across sessions — has no export, so the migration is manual"
> https://www.memorylake.ai/en/blogs/migrate-cursor-to-claude-code

> "Cross-AI-tool context portability CLI. Switch between Claude Code, Cursor, Copilot, Codex, Windsurf, Cline, and more without losing context."
> https://github.com/himanshuskukla/ai-context-bridge

> "Vendor lock-in: Ralph was built for Claude Code. Switching to Codex or Gemini means rewriting your workflow."
> https://news.ycombinator.com/item?id=46530109

> "Tooling like this is why I really want to build my own harness that can replace Claude Code... Claude even has separate "memories" on different devices, making the experience even more inconsistent."
> https://news.ycombinator.com/item?id=47852659

> "If you use Claude Code with Codex or Cursor: ln -s AGENTS.md CLAUDE.md"
> https://news.ycombinator.com/item?id=45550965

**Why it matters.** "Swappable harnesses" is the product's lead claim and this is the qualitative
proof that people want it — including one HN commenter saying the reason he wants to *build his own
harness* is config drift across tools. The organic category name already exists in the wild:
**"context portability"**. Counter-evidence in fairness: one commenter argues switching costs are
already near zero ("They and a number of other competitors are drop in replacements for each
other", https://news.ycombinator.com/item?id=47683778), and cross-harness resume has a real
technical ceiling ("you keep the (visible) transcript but lose the reasoning",
https://news.ycombinator.com/item?id=47856529). Positioning should be portable *context and policy*,
not portable reasoning state.

---

## 6. Guardrails that are silently off

- **Category:** governance
- **Evidence:** 16 phrases — github 12, hackernews 3, blog 1
- **Engagement:** 20 GitHub comments; low counters because these are precise bug reports, not rants
- **Keyword coverage:** governance keywords that exist are all *how-to-sandbox* shaped (`claude code security audit` = 20, `agent audit log` in autocomplete only). Nothing anywhere for policy silently not applying.

> "Launching from a subdirectory silently loads ZERO project hooks — root .claude/settings.json is never read (no walk-up, no warning)"
> https://github.com/anthropics/claude-code/issues/76441

> "[BUG] Workspace sandbox config silently dropped for sessions/subagents rooted in nested project directories (sandbox escape)"
> https://github.com/anthropics/claude-code/issues/83035

> "permissions.deny Read() rules from project settings are not enforced when launched from a subdirectory"
> https://github.com/anthropics/claude-code/issues/84318

> "PreToolUse:Bash hooks fail with MODULE_NOT_FOUND (fail-open) in auto permission mode..."
> https://github.com/anthropics/claude-code/issues/82882

> "Inconsistent enforcement of financial-trade prohibition across sessions"
> https://github.com/anthropics/claude-code/issues/78131

> "Codex prints secrets from config files despite explicit AGENTS.md redaction instructions"
> https://github.com/anthropics/claude-code/issues/34233

**Why it matters.** Everyone's governance content is "how to sandbox your agent". Nobody's content
is "your policy is probably not running right now". These reports share one shape: the guardrail
fails open, silently, depending on cwd, nesting, subagent, or session. That is precisely the
argument for policy enforced at a layer *above* the harness instead of in per-repo config files,
which is what the product sells. High product fit, zero competitor content, modest volume of
evidence but unusually high evidence quality.

---

## 7. Fleet blindness — no lineage, no liveness, no identity across spawned agents

- **Category:** observability / orchestration
- **Evidence:** 21 phrases — github 13, hackernews 6, autocomplete 2
- **Engagement:** 32 GitHub comments
- **Keyword coverage:** `claude code subagents observability`, `claude code session dashboard`, `claude code subagent logs` all appear in autocomplete with no Ahrefs rows. Measured observability volume is all OTel/vendor-platform shaped, not fleet shaped.

> "[FEATURE] Let a parent session observe its spawned children — return a session id from spawn_task and/or expose spawnedBy lineage in list_sessions"
> https://github.com/anthropics/claude-code/issues/71773

> "SubagentStop hook cannot identify which specific subagent finished due to shared session IDs" (9 comments)
> https://github.com/anthropics/claude-code/issues/7881

> "No liveness primitive for dispatched background agents — silence is ambiguous, causing duplicate redispatches"
> https://github.com/anthropics/claude-code/issues/79571

> "Once you have multiple agents across multiple sessions generating code in production, you hit the same observability problems every other distributed system hits: tracing, attribution, debugging failures across runs."
> https://news.ycombinator.com/item?id=46969371

> "history feature is per agent session, a cumulative history of all my agents would be nice."
> https://news.ycombinator.com/item?id=48879774

> "Show repository/project name in the agent (background jobs) view"
> https://github.com/anthropics/claude-code/issues/77182

**Why it matters.** The community merges "evals and observability" into one heading and the vendor
market sells LLM tracing. Neither covers "which of my forty running agents is alive, in which repo,
spawned by whom". That last GitHub issue — show the repo name in the agent view — is the crossrepo
and observability pitches colliding in one line. Good fit with the product's cross-repo session
visibility. Non-trivial risk that Anthropic ships lineage natively and closes the gap.

---

## 8. Cross-repo context ceiling — real, but thinner than the product's positioning assumes

- **Category:** crossrepo
- **Evidence:** 36 phrases — blogs 17, github 9, hackernews 8, reddit 2
- **Engagement:** 53 GitHub comments, only 24 Reddit upvotes
- **Keyword coverage:** dead. `multi repo` = 10, `claude code multi repo` = 20, `cursor multi repo` = 20, `multi repo claude code` = 0, `github copilot agent multiple repositories` = 0. `monorepo vs multi repo` (70) is a 2019-era architecture query, not an agent query.

> "Multi-repo support" (19 comments — the bluntest possible statement of the ask)
> https://github.com/openai/codex/issues/11956

> "[FEATURE] Multi-repository support for remote/web sessions" (15 comments)
> https://github.com/anthropics/claude-code/issues/23627

> "they all seem to assume an agent lives in one worktree of one git repo... the repo boundary is often just not the task boundary. Some context lives next door, or two repos away, and the sandbox somehow has to know what to bring in."
> https://news.ycombinator.com/item?id=48683361

> "I'm wondering if there is a tool in the agent orchestration space that prepares multi-repository worktrees for a subagent out of the box?"
> https://news.ycombinator.com/item?id=48683361

> "agents shipping locally-correct code that breaks consumers the agent didn't know existed"
> https://riftmap.dev/blog/ai-coding-agents-need-cross-repo-context/

> "copy-pasting context between sessions, manually tracking which PR depends on which, and babysitting agents that can't see the full picture"
> https://riftmap.dev/blog/ai-coding-agents-need-cross-repo-context/ (quoting Neilos)

**Honest assessment.** The pain is real but the evidence is lopsided: 17 of 36 phrases come from two
vendor blogs (riftmap.dev, raffertyuy.com) that exist to sell the fix, and the Neilos/Mabl/Meta
quotes are vendor-sourced case studies. Strip those and you have ~19 phrases, mostly feature
requests phrased as *workspace* problems ("multi-folder workspace", "parent workspaces containing
multiple Git repositories"), not as *coordination* problems. Users are asking for a bigger folder,
not for cross-repo orchestration. Combined with genuinely dead keyword volume, the read is: the
market feels a **context** ceiling, not yet a **coordination** ceiling. Do not lead with cross-repo
coordination on the homepage; lead with something in clusters 1-4 and let cross-repo be the payoff.
Vocabulary worth borrowing if you do write here: "repo-of-repos", "context drift", "the repo
boundary is not the task boundary".

---

## 9. Paid for the tokens, lost the work

- **Category:** cost / orchestration
- **Evidence:** 11 phrases — all github
- **Engagement:** 33 GitHub comments
- **Keyword coverage:** none. No keyword row for losing work to a quota hit, partial results, or graceful shutdown.

> "[Bug] Deep-research workflow loses progress on token/spend limit, restarts from zero on resume"
> https://github.com/anthropics/claude-code/issues/79958

> "[BUG] Subagents (Task/Agent tool) die silently on spend/usage limit hit, with no partial-result handoff or wait-for-reset behavior"
> https://github.com/anthropics/claude-code/issues/83412

> "[Bug] Session limit termination loses multi-agent workflow output despite quota consumption"
> https://github.com/anthropics/claude-code/issues/83001

> "Desktop spawn_task chips can finish their work without committing it and without any notification — no end-of-life safeguard for uncommitted work in the spawned worktree"
> https://github.com/anthropics/claude-code/issues/77661

> "[BUG] Session transcript never created: new interactive sessions run for hours writing no JSONL and no history.jsonl entries (silent, unrecoverable conversation loss)"
> https://github.com/anthropics/claude-code/issues/76829

**Why it matters.** Single-source (GitHub only), so it does not clear the "more than one source"
preference — flagged as a weaker cluster. But it is the sharpest *economic* framing of session
durability available: not "memory is nice", but "you already paid for those tokens and the output
is gone". Useful as a supporting argument inside cluster 1 rather than its own page.

---

## 10. The human is the message bus

- **Category:** orchestration / sharing
- **Evidence:** 12 phrases — hackernews 6, blogs 4, reddit 2
- **Engagement:** low; this is a described-workaround cluster, not a complaint cluster
- **Keyword coverage:** none. No keyword row for agent-to-agent context routing.

> "Messaging vs. you-as-the-bus"
> https://munderdiffl.in/blog/claude-code-orchestration-tools-compared/

> "I created on Open Source skill to avoid being the message bus between multiple claude code tabs"
> https://www.reddit.com/r/ClaudeCode/comments/1v31sdx/i_created_on_open_source_skill_to_avoid_being_the/

> "No coordination. Even if you spawn helpers, they can't communicate."
> https://addyosmani.com/blog/code-agent-orchestra/

> "Agent-to-agent data flows through SQLite-structured JSON output per task, central coordinator reads and routes. Letting agents talk to each other directly was a mess."
> https://news.ycombinator.com/item?id=47687389

> "any agent can query a summary of what other agents have done/learned without needing to parse their full context"
> https://news.ycombinator.com/item?id=46753539

> "every agent invocation required a human to provide context"
> https://riftmap.dev/blog/ai-coding-agents-need-cross-repo-context/ (quoting Mabl)

**Why it matters.** Small but conceptually load-bearing: it is the mechanism behind the product's
"manual workflow overhead" claim, stated in users' own words. "You-as-the-bus" is a reusable
phrase. Too thin to carry a page alone; use it as the framing device for cluster 3 or 7.

---

## 11. Runaway spend and per-session attribution — partial product fit, be careful

- **Category:** cost
- **Evidence:** 23 phrases — blogs 7, reddit 6, github 6, hackernews 4
- **Engagement:** ~6,038 Reddit upvotes, the highest of any cluster
- **Keyword coverage:** the *head* is not dark at all — `claude pricing` = 30,000, `claude code pricing` = 20,000. The dark part is attribution and caps: `llm cost tracking by team` = 10, nothing for budget ceilings on parallel agents.

> "I accidentally burned ~$6,000 of Claude usage overnight with one command." (1.3k upvotes)
> https://www.reddit.com/r/ClaudeAI/comments/1t11mmy/i_accidentally_burned_6000_of_claude_usage/

> "Cursor charged us $1,400 in one hour because a PM asked it to tag 87 tasks."
> https://www.reddit.com/r/cursor/comments/1u1xbl8/cursor_charged_us_1400_in_one_hour_because_a_pm/

> "how do you budget-cap 100 parallel agents sharing one API key? Rate limits won't help — they're per-key, not per-agent. Spending alerts won't help — by the time the email arrives, the swarm is done."
> https://news.ycombinator.com/item?id=47061081

> "the question 'which team, which project, which agent pattern is driving spend?' is the one most organizations cannot yet answer."
> https://www.cloudzero.com/blog/claude-code-agents/

> "the real problem is running wild with token burning. With parallel agents calling subagents you can burn lots of tokens per minute. Especially with thousands of engineers."
> https://news.ycombinator.com/item?id=48308109

**Honest assessment.** Loudest cluster by raw engagement and it has no community taxonomy slot, so
it looks like prime dark demand. But product fit is only partial: metaharness enforces
organizational policy and gives session visibility, which covers *attribution* and *policy-based
caps*, and does not cover the thing people are actually angry about — Anthropic's and Cursor's
billing. Write here only in the attribution/policy register ("which team, which repo, which agent
pattern"), never in the "cut your Claude bill" register, or you inherit an audience the product
cannot serve. Ranked low despite the engagement, deliberately.

---

## 12. Worktree isolation fails open — real problem, NOT dark

- **Category:** orchestration
- **Evidence:** 16 phrases — github 9, hackernews 6, reddit 1
- **Keyword coverage:** **not dark.** `claude code worktrees` = 600 / 1,600 global, `claude code worktree` = 450 / 2,100, `git worktree claude code` = 300. This is a contested, well-indexed term.

> "Claude Code built the apparatus that consumed my project — 220k files, 136 worktrees, git rules in 4 places, 3 drive-fillings, and this morning it auto-deployed 288 uncommitted lines to my live trading engine while reporting certified:true"
> https://github.com/anthropics/claude-code/issues/84166

> "Worktree isolation binding is session-scoped: any in-process teammate's EnterWorktree/ExitWorktree silently repoints every other agent in the session"
> https://github.com/anthropics/claude-code/issues/84493

> "An agent in a worktree can reach your hooks, your config, another worktree's stash."
> https://news.ycombinator.com/item?id=49111023

**Listed for completeness and to prevent a mistake.** The *sub*-problem (isolation silently failing
open, worktree sprawl) has no keyword coverage, but any content targeting it will compete on
"claude code worktree" head terms against an established SERP. Treat as a competitive keyword play,
not a dark-demand play. The 136-worktree issue is the single most vivid artifact in the whole
corpus and is worth citing wherever agent sprawl comes up.

---

## Loud, but noise — no product fit

Called out explicitly so nobody mistakes engagement for opportunity.

- **Model-degradation / "nerf" discourse** (evaluation). Enormous: "My name is Claude Opus 4.6. I live on port 9126. I was lobotomized. Here's the data." (2.5k upvotes,
  https://www.reddit.com/r/ClaudeCode/comments/1snhyck/my_name_is_claude_opus_46_i_live_on_port_9126_i/);
  "Anthropic made Claude 67% dumber and didn't tell anyone, a developer ran 6,852 sessions to prove it" (1.9k upvotes). ~20 phrases, huge engagement, and a meta-harness cannot fix a model
  regression. There is a narrow adjacent hook — users are hand-building 71-item failure inventories
  in GitHub issues because they have no eval harness
  (https://github.com/anthropics/claude-code/issues/64991) — but the cluster as a whole is grievance
  against a model vendor, not demand for this product.
- **Refusing to review AI-generated PRs** (sharing-adjacent). "Today I announced that I won't be
  reviewing AI generated PRs at company meeting" (1.9k upvotes, 442 comments,
  https://www.reddit.com/r/ExperiencedDevs/comments/1towli9/). Real cultural pain, no product surface.
  The one usable fragment is the review-provenance framing in cluster 3.
- **Benchmarks / leaderboards** (evaluation). 30+ entries in the community awesome-list, autocomplete
  demand for `coding agent benchmark leaderboard`. Academic concern, not a buyer problem. High
  volume, near-zero relevance — same call the taxonomy supplement made.

## Could not substantiate

- **Distilled memory as a searched-for concept.** The product sells "distilled memory across
  sessions" and the corpus supports the *need* (cluster 1), but only two phrases describe distillation
  as a mechanism (Invincat's Memory Agent, https://news.ycombinator.com/item?id=47922099; Codex
  "Explicit, auditable promotion of operator feedback into Memories",
  https://github.com/openai/codex/issues/34668). Not enough to call it a cluster. Note also the loud
  skeptic wing — "Another day another "memory" system for a tool that cannot ever have memory"
  (https://news.ycombinator.com/item?id=48624861) and "turn off all agent memory, this has only ever
  caused problems for me" — so memory-product framing draws immediate pushback on HN.
- **Provisioning / environment setup as a named pain.** The product lists "repo knowledge and
  provisioning"; the corpus has only glancing evidence (node_modules per worktree,
  https://news.ycombinator.com/item?id=48355104; "flaky environments... become systemic blockers when
  forty agents hit the same flaky test simultaneously"). Two phrases. Not a cluster.
- **Cost-per-repo or per-team chargeback as user vocabulary.** Only CloudZero's vendor phrasing
  supports it. Users say "I burned $6,000", not "I need attribution".
