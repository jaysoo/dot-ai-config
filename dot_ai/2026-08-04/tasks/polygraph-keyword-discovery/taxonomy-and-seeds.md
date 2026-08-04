# Phase 0/1 — Taxonomy & Seed Inventory (Polygraph keyword discovery)

Product context (validated against repo evidence 2026-08-04): Polygraph is the Nx
"meta-harness" — one session in which a parent agent orchestrates child AI coding
agents (Claude Code) across every connected repo (public or private), links and
tracks PRs + CI across the whole graph, records per-session logs, and exposes
sessions by stable IDs (e.g. `doc-549-0ca12dc9`). Positioning terms in use:
"meta-harness" (metaharness.tools), "synthetic monorepo". Category language, NOT
user language — all research below is problem-language-first.

Schema for all downstream output rows:
- Quantitative: `{keyword, volume, difficulty, global_volume, parent_topic, intents, source_report, category}`
- Qualitative:  `{category, source, verbatim_phrase, url, engagement_metric, date}`

Categories (canonical keys used in every output file):

## 1. memory-context — Memory & context persistence
Symptoms: "claude code forgets everything between sessions"; "agent loses context after compaction"; "have to re-explain my codebase every session"
Solutions: "persistent memory for AI agents"; "share CLAUDE.md / rules files across projects"; "long-term memory layer for coding agents"
Seeds (symptom): claude code memory | claude code forgets | claude code lose context | ai agent forgets | agent context loss | claude code compact | context window full | cursor loses context | claude code context limit | agent forgets previous conversation
Seeds (solution): ai agent memory | persistent memory ai | agent long term memory | llm memory layer | claude code memory bank | memory mcp server | claude md file | rules file ai | agent memory tools | cross session memory
Seeds (tool-anchored): claude code claude.md | cursor rules | cursor memory | copilot instructions | windsurf rules | aider conventions | agents.md | mcp memory
Seeds (competitor): mem0 alternative | zep alternative | letta alternative | mem0 vs zep | memgpt | openmemory
Seeds (question): how to give claude code memory | how to persist context between claude sessions | best way to give agents long term memory | why does claude code forget

## 2. observability — Observability & tracing
Symptoms: "what did my agent actually do"; "can't debug why the agent made that change"; "no visibility into tool calls"
Solutions: "agent tracing"; "session replay for coding agents"; "tool-call logs"
Seeds (symptom): debug ai agent | agent doing wrong thing | claude code logs | agent tool calls | what did my agent do | ai agent behavior
Seeds (solution): llm observability | agent observability | ai agent monitoring | agent tracing | llm tracing | agent session replay | ai agent logs | agent telemetry | llm logging | agent debugging tools | opentelemetry llm | claude code hooks logging
Seeds (tool-anchored): claude code observability | claude code tracing | cursor logs | langfuse claude code | otel genai
Seeds (competitor): langfuse alternative | langsmith alternative | helicone alternative | agentops alternative | arize phoenix | braintrust vs langsmith | langfuse vs langsmith | weave wandb | portkey alternative
Seeds (question): how to see what claude code did | how to trace ai agent tool calls | how to debug an ai coding agent

## 3. session-sharing — Session sharing & collaboration
Symptoms: "can't show teammate what the agent did"; "no way to hand off an agent session"; "reviewing AI-generated work is a black box"
Solutions: "share claude code session"; "agent session transcripts"; "team visibility into agent runs"
Seeds (symptom): share claude code session | claude code transcript | export claude conversation | claude code session history | resume claude code session | claude code teams
Seeds (solution): agent session sharing | share ai chat with team | ai pair programming session | session transcript ai | share cursor chat | agent work review
Seeds (tool-anchored): claude code resume | claude code continue | cursor share chat | copilot session | claude code session id
Seeds (question): how do i share a claude code session | how to review ai agent work | how to hand off an agent session to a teammate

## 4. multi-agent — Multi-agent / subagent orchestration
Symptoms: "running multiple claude code instances"; "agents stepping on each other"; "managing parallel agents is chaos"
Solutions: "agent orchestration"; "subagents"; "background agents"; "agent fleet management"
Seeds (symptom): multiple claude code | parallel claude code | run agents in parallel | agents conflict | manage multiple agents
Seeds (solution): ai agent orchestration | multi agent framework | subagents | claude code subagents | background agents | agent swarm | agent fleet | orchestrate coding agents | parallel ai agents | agent task queue | headless claude code
Seeds (tool-anchored): claude code parallel | claude agent sdk | cursor background agents | codex parallel tasks | git worktree claude | claude squad
Seeds (competitor): crewai alternative | autogen alternative | langgraph alternative | crewai vs autogen | openai swarm
Seeds (question): how to run multiple claude code agents at once | how to orchestrate coding agents | how to run claude code in parallel on one repo

## 5. evals — Evaluation & reliability
Symptoms: "agent got worse after update"; "same prompt different results"; "can't tell if my prompt change helped"
Solutions: "agent evals"; "llm regression testing"; "eval harness"
Seeds (symptom): claude code worse | ai agent inconsistent | agent regression | llm nondeterministic | claude got dumber
Seeds (solution): llm evals | agent evals | ai evals | llm evaluation framework | eval harness | llm regression testing | prompt testing | agent benchmark | swe bench | llm as judge
Seeds (tool-anchored): claude code evals | evaluate ai agents | test ai agents
Seeds (competitor): braintrust alternative | promptfoo | langsmith evals | openai evals | deepeval | ragas
Seeds (question): how to evaluate ai agents | how to test llm prompts | why did my agent get worse

## 6. cost — Cost & usage tracking
Symptoms: "claude code burning through tokens"; "hit usage limits"; "no idea what agents cost per repo"
Solutions: "token usage tracking"; "llm cost monitoring"; "usage limits per team"
Seeds (symptom): claude code token usage | claude code cost | claude code usage limit | claude max limits | token burn | api costs high | cursor pricing usage
Seeds (solution): llm cost tracking | ai cost monitoring | token usage dashboard | llm spend management | ai gateway | track claude api usage | ccusage
Seeds (tool-anchored): claude code usage | claude token counter | anthropic api cost | copilot premium requests
Seeds (competitor): helicone cost | portkey gateway | litellm | openrouter
Seeds (question): how much does claude code cost per month | how to track ai token spend per team | how to limit agent api costs

## 7. governance — Governance, audit & security
Symptoms: "what did the agent touch"; "agent ran a destructive command"; "no audit trail for AI changes"
Solutions: "agent audit trail"; "agent permissions"; "ai governance for code"
Seeds (symptom): ai agent security | agent deleted files | claude code permissions | agent access control | ai code compliance | agent ran rm
Seeds (solution): ai audit trail | agent audit log | llm guardrails | agent sandbox | ai governance | agent permission management | mcp security | ai code review policy | shadow ai
Seeds (tool-anchored): claude code allowedTools | claude code sandbox | claude code yolo mode | dangerously skip permissions | enterprise ai coding policy
Seeds (question): how to audit what an ai agent changed | how to restrict what claude code can do | is claude code safe for enterprise

## 8. portability — Cross-tool portability
Symptoms: "different rules files for every tool"; "switching between cursor and claude code loses everything"; "team uses different AI tools"
Solutions: "one config for all ai tools"; "portable agent context"; "agents.md standard"
Seeds (symptom): cursor vs claude code | claude code vs codex | copilot vs cursor | switch from cursor | rules file duplication
Seeds (solution): agents.md | ai config portability | universal rules file | cursor rules to claude md | dotfiles ai tools | ai coding assistant comparison
Seeds (tool-anchored): claude.md vs agents.md vs cursorrules | convert cursorrules | windsurf rules format | codex agents.md
Seeds (question): how to share one config across claude code and cursor | is there a standard for ai agent rules files

## 9. cross-repo — Cross-repo / multi-repo agent workflows (ADDED — Polygraph core)
Symptoms: "change spans multiple repos"; "agent only sees one repo"; "coordinating PRs across repositories"; "CI breaks downstream repo"
Solutions: "run agents across multiple repos"; "cross-repo refactoring with AI"; "track PRs across repos"; "synthetic monorepo"
Seeds (symptom): multiple repositories changes | cross repo changes | coordinate prs across repos | polyrepo problems | dependent repositories ci | multi repo refactoring | agent multiple repos
Seeds (solution): cross repo refactoring | multi repo automation | ai agent multiple repositories | polyrepo management tools | multi repo pull requests | cross repository dependencies | monorepo vs polyrepo | synthetic monorepo | multi repo ci cd | manage many repositories
Seeds (tool-anchored): claude code multiple repos | claude code monorepo | cursor multi root workspace | codex multiple repos | mcp github multiple repos
Seeds (competitor): meta repo tool | git meta | mu-repo | ossum | sourcegraph batch changes | turborepo vs nx
Seeds (question): how to make ai changes across multiple repos | how to run claude code across several repositories | how to keep prs in sync across repos
