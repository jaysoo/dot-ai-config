# Spec: Cloud Adoption — Top-of-Funnel Push

**Date:** 2026-04-20
**Owner:** Jack Hsu
**Timeline:** 30 days (measured weekly)
**Budget:** $5K planned, $10K ceiling
**Related:** [Turborepo Vercel bundling evidence](../tasks/turborepo-vercel-bundling-evidence.md)

## 1. Goal

Reach **600 claimed Nx Cloud workspaces per week** within 30 days.

Approach: grow the _top of funnel_ — the number of developers who run `nx init` or CNW in the first place — targeting the persona most likely to claim. Prior work on conversion (A/B testing Cloud prompt messaging, error fixes, docs) has already squeezed the conversion rate. The remaining headroom is volume.

## 2. Constraints

- **Budget:** $5K planned, $10K ceiling. Dev labor is free (salaried engineers).
- **Timeline:** 30 days to goal; weekly signal check; daily monitoring for adjustment.
- **Ownership:** all workstreams owned by Jack Hsu. CLI team will fix issues surfaced by benchmark work.
- **Persona priority:**
  - **B (primary):** Developers with existing repos feeling CI/build pain. Entry point: `nx init`.
  - **C (secondary):** Developers at companies on a competitor (Turbo, Lerna, Yarn/pnpm workspaces) weighing a switch. Entry point: `nx import` or `nx init`.
  - **D (tertiary):** AI-assisted developers whose tooling (Claude Code, Cursor, Copilot) suggests a monorepo tool. Make Nx agent-ready.
  - **A (deprioritized):** Greenfield. CNW volume (~1,500/day) matters less than init volume (~250/day) because init users convert higher.

## 3. Baseline (as of 2026-04-20)

- CNW completions: **~1,500/day** (~10,500/week)
- `nx init` completions: **~250/day** (~1,750/week), plausibly 300/day after fixing obvious errors
- Current claim rate from init vs CNW: **unknown — pull in week 0** (via cnw-stats-analyzer skill + Cloud telemetry)
- Target: **600 claimed workspaces/week**

**Sizing the lift (week-0 work):** the shape of the 30-day plan depends on the current claim rate.

- If current claims are ~3–4% of creations (~360–480/week), the target is a ~30–65% lift — tractable.
- If current claims are ~1–2% (~120–240/week), the target is a 2.5–5× lift — very hard in 30 days; plan may need to reframe as "movement + infrastructure for Q3."
- Pull the actual number before week 1 so tactics can be sized honestly.

## 4. Target scenarios (4 locked)

Each scenario drives one landing page (workstream #1), one Cursor-rules/AGENTS.md variant (workstream #3), and optionally one starter (workstream #5).

| #   | Scenario                                            | Persona | Primary CTA                        |
| --- | --------------------------------------------------- | ------- | ---------------------------------- |
| S1  | **Slow GitHub Actions / CI** (generic pain)         | B       | `nx init` → Cloud connect          |
| S2  | **Vite + React workspace needs task orchestration** | B       | `create-nx-workspace` Vite preset  |
| S3  | **Mixed front+back (React + Node services)**        | B       | `nx init` or `create-nx-workspace` |
| S4  | **Vite+ / Void Zero ecosystem — scale story**       | B + C   | `nx init` for existing Vite repo   |

### S4 positioning angle (locked)

**Scale story (Flavor A):** Vite+ is free and MIT as of March 2026, so the pitch is feature-driven, not pricing:

> Nx is the production monorepo for Vite teams. Keep Vite, Rolldown, Vitest, Oxc — Nx adds remote caching, affected detection, plugin ecosystem, and polyglot support that Vite+ does not have today.

Supporting pillars: remote cache + DTE (Nx Cloud), affected graph, plugin/generator ecosystem, production track record, polyglot (Go/Rust/Python), AI/MCP story.

## 5. Workstreams

### W1 — "Slow CI" SEO + landing page cluster (detailed)

**Purpose:** Capture high-intent search traffic and social traffic from dev communities, funnel to `nx init` / `nx import`.

**Deliverables:**

- 4 landing pages on nx.dev, one per scenario (S1–S4).
- Each page structure:
  - H1 framed as the user's pain ("Your GitHub Actions build is slow. Here's why, and how to fix it in 10 minutes.")
  - Reproducible before/after numbers sourced from **W6 benchmarks** (blocker — cannot ship until W6 numbers are in)
  - Code/CLI snippet the reader can paste immediately
  - CTA button with scenario-specific UTM (e.g. `?utm_source=nxdev&utm_campaign=slow-ci-gha&utm_content=cta_primary`)
  - Footer link to the benchmark repo (W6) for reproducibility
- Syndication calendar:
  - Week 2: publish S1 (Slow GHA) — syndicate to r/javascript, r/node, r/webdev, dev.to, Hacker News (Show HN if framed as a tool/repo), Twitter/X, LinkedIn.
  - Week 3: publish S2 (Vite + React) and S4 (Vite+ scale story) — syndicate as above + Vue/Vite communities (Vite Discord, r/vuejs), Evan You's adjacent audience.
  - Week 4: publish S3 (Mixed front+back) — syndicate focusing on full-stack JS/TS channels, backend subreddits.

**Acceptance criteria per page:**

- Loads on nx.dev with correct Markdoc/Starlight formatting
- Benchmark numbers match W6 repo
- UTM links confirmed flowing into attribution dashboard
- `nx init` / CNW CTA works end-to-end
- Page passes nx-docs-style-check skill

**Measurement hooks needed (Jack to set up — week-0 blocker, see §6):**

- Referrer tracking from landing page → `nx init` telemetry (verify it's wired; if not, ship the fix before W1 pages launch)
- UTM → Cloud connect attribution
- Weekly cohort view: clicks → inits → claims per landing page

**Content guardrails for the Vite+ scenario (S4):**

- Frame as "Nx extends the Vite stack at production scale." Do **not** frame as "Vite+ is missing features."
- No feature-gap comparison tables in the main landing page body. If a comparison is needed, put it in an appendix or a separate follow-up blog post.
- Lead with what Nx adds (remote cache, affected, polyglot, plugin ecosystem). Mention Vite+ only to establish context.
- Avoid any tone that reads as targeting Evan You / the Void Zero team personally.
- Pre-publish, have a second reader confirm the piece reads as collegial, not combative.

**Risks:**

- SEO will not peak within 30 days — organic impact of these pages is a longer tail. The 30-day signal comes from **social syndication**, not SEO ranking. If a page doesn't land well in its syndication cycle, little to salvage.
- HN is a lottery; don't budget on it.
- Vite community is Evan You-adjacent — content that reads as "Nx bashes Vite+" will backfire. Guardrails above are the mitigation.

### W3 — AI-corpus penetration sprint (detailed)

**Purpose:** Get Nx into the defaults that AI coding tools recommend for "set up a monorepo" prompts. Persona D primary; seeds B and C by capturing dev flow earlier.

**Deliverables:**

- **Official Nx Cursor rules** — one base rule set per scenario (S1–S4), published at `nrwl/nx-cursor-rules` (or equivalent) and submitted to [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules).
- **Official `AGENTS.md` template** for Nx workspaces — included in `create-nx-workspace` output; documented at nx.dev; submitted to `awesome-agents-md`-style indexes.
- **Nx `CLAUDE.md` template** — mirrors AGENTS.md; included in CNW output under a flag or by default.
- **`awesome-*` PR wave:** submit Nx entries to
  - `awesome-cursorrules`
  - `awesome-claude-code`
  - `awesome-nextjs` (add Nx section under "Monorepo" if missing)
  - `awesome-monorepo`
  - `awesome-vite` (for S4 positioning)
- **"Nx is the AI-native monorepo" blog post** on nx.dev positioning the Nx MCP server as the differentiated AI story. Link from each Cursor rules / AGENTS.md README.
- **AI-defaults baseline experiment:** run 20 prompts each against Claude, Cursor, Copilot, ChatGPT asking "set up a monorepo for my Next.js project" and "add monorepo to my Vite project" — log which tool is recommended. Repeat every 2 weeks during the experiment to detect movement.

**Acceptance criteria:**

- Nx Cursor rules repo published, starred, and linked from nx.dev
- AGENTS.md / CLAUDE.md shipped in latest `create-nx-workspace`
- At least 4 awesome-\* PRs submitted (merged is a stretch; 2 merged in 30 days is success)
- Blog post published and syndicated with W1 social calendar
- AI-defaults baseline documented

**Measurement hooks:**

- **Primary:** every Cursor rule and AGENTS.md template embeds a UTM-tagged install link (e.g. `npx nx init --source=cursor-rule-s1`). When an AI agent follows the rule and runs init, the install attributes back to the rule. This ties the workstream to the claims metric rather than vanity counts.
- **Secondary:** GitHub stars / forks / clones on Cursor rules repo (weekly) — useful for trend but not for the primary goal
- Referrer traffic from awesome-\* repos to nx.dev
- AI-defaults prompt survey comparison week 1 vs week 4

**Risks:**

- AI training data does not update in a 30-day window. Cursor rules and AGENTS.md are immediate-effect (users download and use them now), but model defaults shift over months. The 30-day win is in the indexes and Cursor rules traffic, not in AI-recommendation rates.
- PRs to awesome-\* lists may be rejected or ignored — pacing matters.

### W6 — Benchmark refresh + extension (prerequisite)

**Purpose:** Provide reproducible head-to-head numbers that W1 landing pages and W3 content pieces reference. Without this, the Vite+ scale-story and all "compelling migration" content reads as vibes.

**Deliverables:**

- **Refresh:** update the existing large-TS-repo Nx vs Turbo benchmark to current versions of both tools. Verify numbers. Fix any Nx issues surfaced (CLI team picks up).
- **Extend:** add Nx vs Vite+ `vp run` benchmark on a representative Vite/Vitest workspace:
  - Cold cache
  - Warm cache (local)
  - Warm cache (remote — Nx Cloud)
  - Affected subset (Nx only; Vite+ has no affected detection, so note "Vite+ re-runs everything")
- **Publish:** canonical benchmark repo at `github.com/nrwl/monorepo-benchmarks` (or existing location if one exists) + a single nx.dev landing page summarizing results. Refresh quarterly going forward.
- **Methodology transparency:** every benchmark lists hardware, versions, workload size, commands run, raw timing output. No cherry-picking.

**Acceptance criteria:**

- Benchmark repo runnable by a third party in one command
- nx.dev benchmark page published with both Turbo and Vite+ comparisons
- W1 landing pages link to specific benchmark scenarios

**Risks (highest-risk workstream):**

- **Results may not favor Nx in all scenarios.** If Vite+'s `vp run` local cache with "automated input tracking" beats Nx local cache on small workloads, we need to honestly report it and lead with the scenarios where Nx wins (remote cache, affected, polyglot, scale).
- Turbo refresh may surface a regression that requires CLI-team fix before publishing — adds time.
- **Ship honest numbers.** Cherry-picked benchmarks get torn apart on HN and set the campaign back further than no benchmarks would.

**Sequencing:** W6 is the critical path. Must land **in week 1** (or very early week 2) for W1 pages to ship with real numbers.

### W5 — Starter ecosystem seeding (idea list only)

**Status:** Deferred / low-maintenance filter applied. Spec-level entry is a living idea list rather than a committed deliverable.

**Candidate starters to evaluate (ranked by leverage × maintainability):**

1. **`create-nx-next`** — an Nx-flavored sibling to `create-next-app` monorepo templates. High leverage, moderate maintenance. Nx already has Next.js plugin; this is packaging, not new surface.
2. **`next-forge`-shaped Nx starter** — production-grade Nx-based SaaS starter. High leverage but high maintenance (next-forge updates weekly).
3. **`shadcn/ui` monorepo examples** — contribute Nx variant to official shadcn/ui examples directory. Medium leverage, low maintenance once accepted.
4. **Supabase / AppWrite / Convex example repos** — contribute Nx monorepo examples to their example galleries. Low per-repo effort; compounds via their traffic.
5. **T3-stack variant** (`create-t3-nx`) — community integration. Low maintenance if forked from t3 and kept lightly in sync.
6. **Bun-specific monorepo starter** — Bun ecosystem growing, little incumbent. Small segment but trendy.

**Decision gate:** pick at most 1–2 if time allows during weeks 3–4. Do not block 600-claim goal on these.

### W2 — Before/after case-study content (parked / optional)

**Status:** on the idea list, not in the 30-day critical path. Reopen if W1 syndication underperforms in week 2.

**Summary:** produce 2–3 concrete "fork this OSS repo, run `nx init`, show CI time drop" videos or blog posts. Cheaper Fireship-in-miniature. Costs ~$500 for video editing if outsourced; otherwise dev time.

**Decision gate:** review after week-2 signal. If W1 social syndication lands strong, skip. If weak, activate.

### W4 — Mid-tier YouTube sponsorship (parked pending prior-experiment review)

**Status:** parked. Jack to review prior sponsorship results before committing budget.

**Summary:** 2 sponsored videos on mid-tier JS/TS channels (50K–200K subs, e.g. Jack Herrington, Cosden, Joshtriedcoding). $3K–6K of budget. Jack Herrington has prior Nx relationship — warmest path.

**Decision gate:** review prior-sponsorship ROI by end of week 1. If positive signal, book 2 videos for week 3–4 publish.

## 6. Sequencing (Week 0 + 30-day weekly plan)

### Week 0 — prerequisite tasks (this week, before W1 pages draft)

Complete these before week 1 to avoid burning the 30-day window on blockers:

- [ ] **Pull current claim-rate baseline** from CNW stats + Cloud telemetry — use cnw-stats-analyzer skill to get claims/week split by init vs CNW source. This sizes the actual lift needed.
- [ ] **Verify `nx init` referrer/source capture** — check whether telemetry includes a `--source=` or equivalent field. If not, wire it (CLI team) so W1 attribution works from day 1. Blocks W1.
- [ ] **Confirm benchmark-repo target location** — new `nrwl/monorepo-benchmarks` or existing location? Decide and create the repo skeleton in week 0 so W6 can start cleanly.
- [ ] **Write Vite+ content-guardrails doc** — 2 paragraphs codifying the "complement, not compete" tone rules for S4 content. Paste into the repo drafts folder so every contributor reads it before drafting S4.
- [ ] **Review prior YouTube sponsorship ROI** (W4 go/no-go input) — pull what you have on Jack Herrington-era sponsorships: views, click-through, attributable inits/claims. Decide by end of week 0 whether to book W4 videos.

### 30-day weekly plan

| Week | W6 Benchmarks                                                            | W1 Landing pages                                                            | W3 AI corpus                                                                                                         | W2/W4/W5                                                |
| ---- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 1    | Refresh Turbo benchmark; start Vite+ benchmark; fix issues with CLI team | Drafting S1 + S4; set up UTM/attribution dashboard                          | Baseline AI-defaults experiment (20 prompts × 4 tools); draft Cursor rules for S1 + S4 with UTM-tagged install links | Week 0 outputs reviewed; W4 booking if greenlit         |
| 2    | Publish benchmark repo + nx.dev page; extend to all 4 scenarios          | Publish S1 (Slow GHA); syndicate                                            | Submit first awesome-\* PRs; publish Cursor rules repo                                                               | —                                                       |
| 3    | Quality pass / fix any community-raised issues                           | Publish S2 (Vite + React) and S4 (Vite+ scale); syndicate                   | Ship AGENTS.md/CLAUDE.md in `create-nx-workspace`; blog "Nx is the AI-native monorepo"                               | W4 videos publish if booked; W2 case study if activated |
| 4    | Ongoing                                                                  | Publish S3 (Mixed front+back); syndicate; retrospective on traffic + claims | Re-run AI-defaults experiment; submit remaining awesome-\* PRs                                                       | W5 if slack capacity; continuation decision per §12     |

## 7. Measurement

**Owner:** Jack (will set up attribution).

**Weekly dashboard (minimum):**

- Claimed workspaces/week (primary metric — goal 600)
- `nx init` completions/day, by source (referrer where known)
- CNW completions/day, by source
- Landing-page traffic per page (UTM-tagged)
- Conversion rate: landing page click → init → claim (per scenario)
- Cursor rules repo clones/stars/forks
- AI-defaults prompt-survey score (measured at week 1 and week 4)

**Attribution setup (Jack to wire):**

- UTM parameters on every CTA from W1 pages → nx.dev install docs → telemetry tags
- Referrer capture in `nx init` telemetry (if not already present)
- Campaign attribution in Cloud claim event (scenario tag from install source)

**Weekly check cadence:** Monday review, daily spot-checks for anomalies.

## 8. Risks

| Risk                                                | Mitigation                                                                                                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Benchmark numbers don't favor Nx in some scenarios  | Ship honestly; lead with scenarios where Nx wins; frame others as roadmap. Cherry-picking = HN backlash.                                               |
| SEO doesn't peak in 30 days                         | Rely on social syndication for short-term signal; treat SEO as the long tail, not the hero.                                                            |
| AI-defaults don't shift in 30 days                  | Measure baseline → week-4 movement; accept this as a 6-month play where the 30-day win is the artifacts (Cursor rules, AGENTS.md) themselves.          |
| Vite+ iterates fast and closes scale gap            | Ship the scale-story content early (week 2–3); revisit positioning in ~3 months.                                                                       |
| Syndication reads as marketing spam                 | Keep a credible technical voice; lead with reproducible numbers and code, not messaging.                                                               |
| 600/week goal is arithmetically hard given baseline | Accept that the real 30-day win may be "movement in the right direction + infrastructure for Q3." Be honest with leadership if the math doesn't close. |
| Vercel political backlash (Vite+ positioning)       | Frame as complement, not competitor. Evan You has been publicly collegial about Nx; don't torch the relationship.                                      |

## 9. Explicitly NOT in scope

- Paid Google Ads on "slow CI" keywords (high CPC, muddy intent)
- Fireship-tier sponsorships (out of budget)
- Conference sponsorships (wrong lead time for 30-day window)
- Platform partnerships with Netlify/Cloudflare/Render (longer deal cycles)
- Angular-specific content (already a stronghold; diminishing returns)
- Greenfield-developer-first campaigns (persona A deprioritized)
- Rewriting `nx init` / CNW flows themselves (prior conversion work already covered)

## 10. Ideas list (future / post-30-day)

Carry these forward for Q3 planning if any of the 30-day experiments succeed:

- W5 starters (see section W5 above)
- Platform partnership outreach (Netlify, Cloudflare, Render)
- A Fireship-scale sponsored video once we can build a case from 30-day results
- Conference talk circuit targeting persona B ("We shaved 40 min off CI" case studies)
- Existing-customer referral program
- Discord / Twitter/X content calendar owned by DevRel
- Paid Reddit experiment ($1K) on high-intent subreddits
- "Fix my CI" free diagnostic tool (point at a GitHub repo → get an Nx savings estimate with shareable result card)

## 11. Open questions

Most blocker-class questions are moved to **Week 0 tasks (§6)**. Remaining:

- Which contact at each target community has the lowest-friction intro for syndication? (Jack Herrington is already warm for W4; who else for Vite community, Reddit mods, HN trusted posters?)
- Should the "Nx is the AI-native monorepo" blog post (W3, week 3) target developer audiences or stakeholder/enterprise-buyer audiences? Two different voices; pick before drafting.
- Is there an existing Nx benchmark repo/URL we should consolidate rather than create new?

## 12. Continuation plan (decision tree for end of 30-day window)

At end of week 4, three outcomes — and what each triggers for month 2:

### Outcome A — Hit or near-hit (≥ 550 claims/week by week 4)

- **Scale up what worked.** Identify the top-performing landing page + syndication combo; double down with 2 more landing pages in adjacent scenarios (e.g. NestJS, Remix, specific framework monorepos).
- Commit budget to **one Fireship-scale sponsored video** ($10K+) in month 2 — we now have 30-day evidence to target effectively.
- Activate **W5 starter seeding** at low priority (1 starter in month 2).
- Continue W3 AI-corpus work; re-run AI-defaults experiment monthly.

### Outcome B — Partial signal (350–550 claims/week)

- **Prune what didn't work, keep what did.** Drop underperforming landing pages from syndication calendar; keep them published for SEO tail.
- Reopen **W2 case studies** if W1 syndication was the weak link.
- Reopen **W4 YouTube** if attribution data from W1 made the prior-ROI picture clearer.
- Extend timeline by 30 days with adjusted tactics. Report honestly to leadership: "movement in right direction + infrastructure for next cycle."

### Outcome C — Miss (< 350 claims/week)

- **Diagnostic mode.** The 30-day data should reveal whether the bottleneck was top-of-funnel volume, referrer attribution breaking, or conversion-rate issues reappearing.
- Escalate to leadership: goal may need reframing. The claimed-workspace goal may not be primarily moveable via top-of-funnel content in a short window; may require product/conversion work.
- Keep infrastructure (benchmark repo, Cursor rules, landing pages, attribution plumbing) — these are the durable assets regardless of 30-day outcome.

**Review date:** end of week 4 (~30 days from spec date). Jack to convene review; decide A/B/C path within 2 working days.
