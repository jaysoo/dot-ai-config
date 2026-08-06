# Shared brief - Nx keyword & prompt expansion (Phases 1-2)

Read this fully before doing anything. You are one of several cluster agents. Do not
duplicate another cluster's work; stay inside your assigned cluster.

## Context

Nx (nx.dev) is a monorepo build system + CI platform (Nx Cloud). Ahrefs Rank Tracker
project `Nx` = id **8558520**, 99 tracked US/en keywords. Brand Radar report `Nx` =
`019f70fc-d637-7bb5-a169-c89330eb746f`, 13 ChatGPT-only prompts.

Phase 0 audit already ran against live Ahrefs data (`phase0-audit/audit.csv`). Findings you
must treat as established, not re-derive:

- nx.dev ranks (top-100 US organic) for only **26 of the 99** tracked keywords.
- Ahrefs Keywords Explorer has **no record at all** for 26 of the 99 - mostly the
  ci-observability cluster. `no_data` is a real and expected value in this space.
- 28 slots were freed by prunes/merges. Expansion should aim to fill them and then some,
  ranked, so the orchestrator can set the cut line.
- Rank Tracker desktop vs mobile positions for this project disagree badly on head terms
  (`monorepo`: desktop not-ranking, mobile pos 1, Site Explorer pos 8). **Never use
  rank-tracker-overview `position` as a position source.** Use
  `site-explorer-organic-keywords` `best_position` instead.

## Hard rules

1. **US / en only.** Do not add other markets. Do not use `country` values other than `us`.
2. **No invented numbers.** Every volume/difficulty/position comes from an Ahrefs tool
   response. If Ahrefs has no record, write `no_data`. Never estimate.
3. **Every row carries `source`** - the Ahrefs tool name that produced it, or `synthetic`
   for a seed you wrote yourself that Ahrefs had no record for. Synthetic rows are allowed
   and valuable (this space is below keyword-DB thresholds), but must be labeled.
4. **Every row carries `proposed_tags`** from the taxonomy below. Untagged rows are
   rejected at synthesis.
5. Do not propose a keyword already in `phase0-audit/audit.csv` unless its verdict was
   `prune`/`merge-into:` and you are proposing a better replacement - say so in `notes`.

## Taxonomy (use these exact tag strings)

Existing: `monorepo`, `cli-competitors`, `ci-observability`, `ci-cd`, `ci-caching`,
`ci-cost`, `ci-flaky`, `module-federation`, `branded`, `unbranded`, `monorepo-organization`

New: `ci-competitors`, `ai-tooling`, `nx-cloud-features`, `migration`

A row may carry 1-2 tags, pipe-separated (e.g. `ci-caching|unbranded`). Branded rows
(containing a product/vendor name) get `branded`; the rest get `unbranded`.

## Ahrefs MCP

Tools are deferred. Load what you need in ONE ToolSearch call, e.g.:

```
ToolSearch query: "select:mcp__claude_ai_Ahrefs__keywords-explorer-matching-terms,mcp__claude_ai_Ahrefs__keywords-explorer-search-suggestions,mcp__claude_ai_Ahrefs__keywords-explorer-related-terms,mcp__claude_ai_Ahrefs__keywords-explorer-overview,mcp__claude_ai_Ahrefs__site-explorer-organic-keywords,mcp__claude_ai_Ahrefs__serp-overview"
```

Gotchas already discovered - do not rediscover them:

- `keywords-explorer-*` select uses `difficulty`, NOT `keyword_difficulty`.
  Valid: `keyword,volume,global_volume,difficulty,cpc,clicks,traffic_potential,parent_topic,intents,serp_features`.
- `site-explorer-organic-keywords` does NOT accept `output: "csv"`. Omit `output`.
  Use `mode: "subdomains"` for a bare domain. Select:
  `keyword,volume,best_position,best_position_url,keyword_difficulty,traffic`.
- `related-terms` returns nothing for precise long-tail seeds. Seed it from the highest-volume
  head term in your cluster only.
- Filters use the `where` JSON grammar, e.g.
  `{"and":[{"field":"volume","is":["gte",10]},{"field":"best_position","is":["lte",20]}]}`.

**Unit budget: you may spend at most ~800 `site-explorer-organic-keywords` rows and ~300
`keywords-explorer-overview` rows.** (23 and 54 units/row respectively; the workspace has
~740k left and there are 9 of you.) Use `limit` and `where` filters to stay under. Prefer
one well-filtered call over five broad ones.

## What to produce

### Step 1 - seeds (30-60)

Generate seeds across these framings. Write them to `phase1-seeds/<cluster>.json` as
`[{seed, framing, rationale}]`.

- symptom: "github actions slow", "ci bill too high", "tests flaky in monorepo"
- solution: "ci build cache", "test sharding tool"
- tool-anchored: x {github actions, gitlab ci, circleci, jenkins, azure devops, buildkite}
- framework-anchored: x {angular, react, nestjs, next.js, vue, node, typescript, go, python, java, .net}
- competitor-anchored: "X alternative", "X vs Y", "X pricing"
- question framing: "how do I ...", "why is my ... slow" (these also feed the prompt set)

### Step 2 - Ahrefs expansion

1. `keywords-explorer-matching-terms` + `search-suggestions` on your seeds.
2. `keywords-explorer-related-terms` from your cluster's single highest-volume head term.
3. `site-explorer-organic-keywords` on the competitor domains listed in your task prompt.
   Diff against nx.dev's ranked set -> content gaps. **This is the highest-yield step.
   Do it even if you have to cut step 1 short.**
4. `serp-overview` on your top 5 terms -> record the top-3 domains (SERP openness) and any
   People Also Ask questions (these feed Phase 4 prompts).

### Step 3 - output

Write `phase2-ahrefs/<cluster>.csv` with exactly these columns:

```
keyword,volume,global_volume,difficulty,traffic_potential,parent_topic,intents,serp_top3_domains,nx_ranks,proposed_tags,source,notes
```

- `intents`: pipe-separated subset of informational|navigational|commercial|transactional|branded
- `serp_top3_domains`: pipe-separated, or `no_data` if you did not run serp-overview on it
- `nx_ranks`: the nx.dev best_position if you saw one, else `no` or `no_data`
- `notes`: <=15 words. Why this row matters, or what it replaces.

Cap 400 rows pre-filter. Drop obvious junk (CAD software "Siemens NX", "Lexus NX", Roblox,
math notation) - the `nx` term is heavily polluted.

Also write `phase2-ahrefs/<cluster>-paa.json` as `[{question, source_keyword}]` from step 4.

### Step 4 - report back

Your final message is the return value, not a human note. Return at most 25 lines:
top 10 keywords by your judgment (keyword + volume + why), the 3 biggest content gaps vs
competitors, and anything that contradicts the brief.
