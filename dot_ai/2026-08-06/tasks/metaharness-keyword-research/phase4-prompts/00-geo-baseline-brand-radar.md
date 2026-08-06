# Phase 4 GEO baseline - real ChatGPT answers (Brand Radar)

Pulled by the orchestrator from the existing "Metaharness" Brand Radar report
(id `019fd75e-6374-7bbf-b6f0-caceba879e34`, chatgpt/daily, created 2026-08-06 by Juri).
Tool: `brand-radar-ai-responses-entities`. **Cost: 0 API units.** Data as of 2026-08-06 14:06Z.

This is exactly what Phase 4 asks for - which products actually get cited per prompt - except
it is observed rather than self-tested, so it is stronger evidence than us prompting ChatGPT
by hand.

## Prompt volumes (Ahrefs' estimate of how often the prompt is asked)

| Prompt | Volume |
|---|---|
| "How do I share my Codex session with Claude Code?" | **500** |
| "How do I share my Claude Code session with Codex?" | **500** |
| "Can I share my Claude Code session with someone else?" | **300** |
| "Can I resume another person's Copilot session?" | 20 |
| "Can I share my AI session with someone else?" | 0 |
| "How do I share sessions between different AI agents?" | 0 |
| "Can I share my Copilot session with someone else?" | 0 |
| "Can I resume another person's Codex session?" | 0 |
| "Can I share my ChatGPT session with someone else?" | 0 |
| "Can I share my Codex session with someone else?" | 0 |
| "Can I resume a session I started on one machine on another machine?" | 0 |

Read: the volume concentrates hard on **tool-named, cross-tool** phrasings. Generic "AI
session" phrasings are zero. This is the same tool-anchoring effect the keyword baseline
found, now confirmed on the prompt side. Any prompt that says "AI agent" instead of naming
Claude Code or Codex is dead.

## THE FINDING: the real competitor set is not the one being tracked

ChatGPT already answers these prompts by citing a cluster of small, purpose-built
session-sharing products. **None of them is omnigent.ai, mem0, zep, or letta** - the four
domains currently configured as competitors.

| Product | Cited as | Appears in |
|---|---|---|
| **claudereview.com** | "claudereview - Share Claude Code, Codex & Gemini Sessions" | both 500-volume prompts |
| **threadcast.dev** | "ThreadCast - Share Claude Code and Codex Sessions" | both 500-volume prompts |
| **lore.link** | "The best ways to share a Claude Code session (2026)"; "Share Your Claude Code, Cowork, and Codex Sessions With Your Team" | both 500-volume prompts |
| **aq.dev** | "Share a Claude Code Session With Your Team" | all three top prompts |
| **custardseed.com** | "CustardSeed - Publish Claude Code Sessions" | the 300-volume prompt |
| **sessionviewer.cc** | "Codex Session Viewer for JSONL Logs" | 500-volume prompt |
| **unabyss.com** | "Can Codex and Claude Code Share Context?" | 500-volume prompt |
| **opencontextprotocol.ai** | "OCP - Open Context Protocol for AI Agents" | "share sessions between different AI agents" |
| **codex.danielvaughan.com** | "Claude Code <-> Codex CLI in Practice: Session Handoffs, Community Bridges and Known Gotchas" | 500-volume prompt |

Two implications:

1. **The tracked competitor list is wrong for the `sharing` and `portability` categories.**
   omnigent.ai is a reasonable direct competitor on positioning, but it is invisible in the
   AI answers for the highest-volume prompts in this space. The incumbents in the answer are
   nine small tools nobody listed. Phase 2's competitor agent is querying the wrong domains
   for these two categories; this file is the correction.

2. **These prompts are winnable but not empty.** The plan asks whether an incumbent is
   entrenched. Answer: no single entrenched incumbent, but a crowded field of ~9 small
   players plus Anthropic's own docs. `code.claude.com/docs/en/sessions` and the Claude Help
   Center appear in nearly every answer - first-party docs are the hardest citation to
   displace, and they cap how much of the answer any vendor can own.

## Also surfaced: GitHub issues confirming the demand is real and unmet

These came free in the citation lists and are exactly what the Phase 3 GitHub agent was sent
to find. All verbatim titles:

- `openai/codex#146` - "feat: session persistence"
- `openai/codex#14722` - "Sync CLI and app-server sessions"
- `openai/codex#32061` - "Resume sessions with their previously used model and reasoning effort"
- `openai/codex` discussion #13251 - "Ability to share conversations from Codex App, Codex extension and Codex CLI"
- `openai/codex` discussion #1076 - "Resuming a previous session"
- `github/copilot-cli#1635` - "Feature Request: Cross-environment session resume (local <-> Codespace)"
- `github/copilot-cli#442` - "Start a new session in programmatic mode"
- r/ClaudeCode - "How do you get two claude code sessions to talk to each other?"
- OpenAI community - "Suggesting a feature: sharing conversation by link"

Cross-environment and cross-tool session resume is an open, upvoted feature request against
both Codex and Copilot CLI. That is unmet demand at the harness layer, which is precisely
the gap a meta-harness claims to fill.

## The cited competitors have almost no Google organic footprint

Checked directly (`site-explorer-organic-keywords`, mode=subdomains, 2026-08-06):

| Domain | Organic keywords | Traffic |
|---|---|---|
| `claudereview.com` | **0** | 0 |
| `lore.link` | **1** (`lore ai`, vol 250, KD 55, pos 9) | 12 |

So the products ChatGPT names for the 500-volume session-sharing prompts are effectively
invisible in classic Google organic search.

This is the sharpest strategic read in the research so far: **in this category, AI answers
and Google organic are decoupled, and the AI answer is the one that is being won.** A tool
with no backlinks, no domain rating, and no ranking keywords is still the cited answer,
because ChatGPT is resolving these prompts from page content and freshness rather than from
classic authority signals.

Practical consequence for Phase 5 scoring: for the `sharing` and `portability` categories,
keyword difficulty is close to meaningless as a prioritisation input. Winnability should be
scored on whether a clear, well-structured, tool-named page exists that an assistant can
quote - not on KD or referring domains. The two deliverables should be weighted accordingly,
with `prompts.csv` treated as the primary artifact for these categories and `keywords.csv`
as secondary.

Caveat, stated plainly: this is two domains checked at one point in time, and Ahrefs coverage
of very new small sites is itself unreliable. The direction is well supported by the citation
data; the magnitude is not something to bank on without a wider sample.

## Standards watch

`opencontextprotocol.ai` ("Open Context Protocol for AI Agents") is the only citation for
"How do I share sessions between different AI agents?" - a prompt with 0 measured volume but
directly on Polygraph's thesis. A protocol play in the portability slot is a strategic
consideration well beyond keyword choice; flagging it for Phase 5 rather than burying it in
a CSV.

## Recommended follow-up (needs Jack's go-ahead - writes to an external service)

The Brand Radar report currently tracks 5 prompts, all in the `sharing` category. Eight of
the nine categories have no prompt coverage at all. The `brand-radar-prompts.txt` deliverable
will propose a full set. Adding them to the report is a write to Ahrefs, so it stays a
recommendation until approved.
