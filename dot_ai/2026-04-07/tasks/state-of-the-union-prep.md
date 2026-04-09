# Engineering Day Morning Session

Prep doc for the State of the Union portion of Day 2 in Montreal.

---

## 1. Numbers that matter

From Lighthouse SPACE dashboard, 2026-04-07.

| Metric | Value | Trend |
|--------|-------|-------|
| PR throughput (Q1) | 2,215 across all repos | +50% YoY (was 1,475) |
| PR cycle time (nx) | 2.9h median, 11.6h P75 | P75 down 71% (was 40.6h) |
| Planning accuracy | 4 of 5 teams above budget | Red Panda 100%, Kraken +23.5% |
| P0/P1 resolution | Kraken 0.1d, Dolphin 5.1d | Most teams within target |
| npm downloads | 10.5M/week | +17% MoM |
| Self-Healing CI | 8 production customers | Enterprise billing launched |
| CNW cloud conversion | A/B Variant 1 won | +63% lift |

50% more PRs with the same team, merging faster, staying predictable, product growing.

---

## 2. What we shipped

### Platform

| Feature | Where it is | What it means |
|---------|------------|---------------|
| Task Sandboxing (eBPF) | Production: ClickUp, Legora, Island, Wix | Cloud UI with file-level violation analysis |
| Self-Healing CI | 8 customers, all 4 VCS providers | Setup wizard, enterprise billing, `.nx/SELF_HEALING.md` context |
| Polygraph Standalone | Own product, own frontend | Kotlin backend, GitHub App, Azure DevOps OAuth |
| AI-Native DX | GA | `nx configure-ai-agents` detects Claude Code, Cursor, Codex, Gemini |
| Surface Level Telemetry | GA | Rust pipeline, GA4, opt-out during workspace creation |
| CNW Cloud Conversion | A/B testing live | "Remote cache" prompt won with 63% lift, new variants designed |

### CLI and ecosystem (since 21.3, July 2025)

Five new plugins: @nx/dotnet, @nx/maven, @nx/docker, @nx/angular-rspack, @nx/vitest (standalone).

Framework support across the board: Vite 7 through 8, Angular 20 through 21.2, Next 16, Nuxt 4, Expo 54, Storybook 10, Cypress 15, Node 24, ESLint v10, Prettier 3.

TUI grew up: live durations, estimated times, inline view mode, Windows support by default, hints and status messages, scroll replacing pagination.

AI integration from the ground up: `nx mcp` command, `nx configure-ai-agents`, AI files generated in CNW by default, AI migration instructions for Next 16.

Build system: pnpm catalogs, tsgo compiler support, Yarn Berry catalogs, batch task hashing, Bun lockfile parser.

Performance: jemalloc cut memory fragmentation 81%, glob caching hit 95.6%, optimized pnpm lockfile parsing, macOS switched to recursive FSEvents.

Testing: Playwright report merging for atomized tasks, Cypress component atomization, Vitest atomizer, ESLint bulk suppression.

Release system: graph-aware filtering, changelog renderer API, version plan aliases, `resolveVersionPlans`.

22.0 major: cleaned up v1 APIs, overhauled the release system, shipped .NET and Maven plugins, added pnpm catalogs.

### Cloud and infrastructure

Self-Healing CI arc: AI fix badges → draft PR support → Azure DevOps → setup wizard → Bitbucket → context files → enterprise billing.

Onboarding: plan selection (Hobby/Team), `nx-cloud onboard` CLI, recommended access control, template preview, GitHub dual auth.

Infrastructure: multi-cluster agent facade (22 issues), K8s Gateway API, IO Trace Helm, EU Provider research, PrivateLink research, Istio started.

Enterprise: SCIM/SSO, artifact encryption, workspace-repository access syncing, VCS org access policies.

Security: 5 pentest findings remediated, 4 critical CVEs resolved, GH Actions SHA-pinned across 5 repos, 3 CLI CVEs fixed in under 3 days.

### Docs

Blog extracted to standalone Astro site. 1,064 images converted to WebP. 8 tutorials rewritten. 1,231 redirect rules migrated. Task sandboxing documented with SVG diagrams. LGPL licensing addressed in 5 days.

---

## 3. Progression stories (2025 → now)

Self-Healing CI went from launch to Azure DevOps and Bitbucket support, then the setup wizard, then 8 production customers, then enterprise billing.

Polygraph went from a conformance tool to a standalone product with its own frontend, CLI, GitHub App, and Azure DevOps OAuth.

Task Sandboxing went from concept to eBPF I/O tracing to 4 production customers with a full Cloud UI.

AI integration went from AI code gen to `nx mcp` to `nx configure-ai-agents` to AI agent detection in CNW to the MCP ecosystem play.

Infrastructure went from SOC2 to multi-cluster facade to K8s Gateway API to EU provider to Istio.

---

## 4. Product timeline (July 2025 → April 2026)

### CLI releases

| Version | Date | Highlights |
|---------|------|------------|
| 21.3 | Jul 2025 | TUI improvements, `nx watch --initialRun`, fix-ci command, GitHub repo creation in CNW |
| 21.4 | Aug 2025 | @nx/angular-rspack, @nx/docker, `nx mcp`, Bun lockfile parser |
| 21.5 | Sep 2025 | Vite 7, Angular 20.2, platform cert trust, Module Federation alignment |
| 21.6 | Sep 2025 | `nx configure-ai-agents`, AI files in CNW, Playwright report merging, Cypress atomization |
| 22.0 | Oct 2025 | Major: @nx/dotnet, @nx/maven, pnpm catalogs, release overhaul, v1 API cleanup |
| 22.1 | Nov 2025 | Next 16, Storybook 10, Cypress 15, Vitest 4 standalone, TUI on Windows |
| 22.2 | Dec 2025 | Nuxt 4, Expo 54, CNW template support, Next 16 AI migration instructions |
| 22.3 | Dec 2025 | Angular 21, tsgo compiler, Prettier 3, TUI hints, pnpm lockfile optimization |
| 22.4 | Jan 2026 | Angular 21.1, ngrx 21, inline TUI, ESLint bulk suppression, Maven batch executor |
| 22.5 | Feb 2026 | Surface Level Telemetry, IO trace daemon, jemalloc, glob caching |
| 22.6 | Mar 2026 | Vite 8, Angular 21.2, task sandboxing shipped, Self-Healing git hooks, AI-native DX GA |

### Cloud releases (Nov 2025 → Apr 2026)

Cloud changelog starts Nov 14, 2025. Earlier months aren't publicly archived.

| Month | Count | Highlights |
|-------|-------|------------|
| Nov 2025 | 19 | AI fix badges, Azure DevOps Self-Healing, CIPE credit summary |
| Dec 2025 | 24 | Self-Healing Setup Wizard, workspace data cache control, GitHub dual auth |
| Jan 2026 | 27 | Self-Healing for Bitbucket (all 4 VCS done), `.nx/SELF_HEALING.md`, `--no-interactive` for agents |
| Feb 2026 | 24 | Workspace access syncing, artifact encryption, sandbox analysis UI |
| Mar 2026 | 17 | Task sandboxing Cloud UI, VCS org access policies, `nx-cloud onboard`, multi-cluster facade |
| Apr 2026 | 4 | Agent image validation, SCIM/SSO, Polygraph standalone (24 issues), Self-Healing billing |

### Infrastructure milestones

2025 H2: Docker Layer Caching, Azure Single Tenant, Distributed Tracing, Grafana, Helm Chart v1, SOC2, MongoDB upgrade, Valkey migration.

Feb 2026: IO trace daemon on GCP and AWS, jemalloc (81% less fragmentation), secrets management split.

Mar 2026: Multi-cluster agent facade (22 issues), K8s Gateway API, GH Actions SHA-pinned across 5 repos, PrivateLink research, new deployments for Caseware, CIBC, Legora, Mimecast, Cloudinary.

Apr 2026: EU Provider research done, Istio started, FE Pod limits bumped for Enterprise Azure.

---

## 5. SPACE metrics (detailed)

### PR throughput by repo (Q1 YoY)

| Repo | Q1 2026 | Q1 2025 | Delta |
|------|---------|---------|-------|
| cloud-infrastructure | 532 | 449 | +18% |
| nx | 630 | 485 | +30% |
| nx-console | 137 | 47 | +191% |
| ocean | 916 | 494 | +85% |
| Total | 2,215 | 1,475 | +50% |

Q2 has 105 PRs in 7 days. At Q1 pace, 2026 would hit ~8,860 total, up 19% over 2025's 7,443.

### Planning accuracy (planned % vs budget)

| Team | Budget | Q1 Actual | Dev | Q2* |
|------|--------|-----------|-----|-----|
| Red Panda | 80% | 88.8% | +8.8% | 100.0% |
| Quokka | 75% | 93.2% | +18.2% | — |
| Kraken | 50% | 73.5% | +23.5% | 80.0% |
| Dolphin | 50% | 70.3% | +20.3% | 77.8% |
| Orca | 75% | 60.2% | -14.8% | 16.7% |

Four of five teams above budget. Orca is the outlier. Q2 at 16.7% is either heavy unplanned work or a classification issue.

### PR cycle time (hours)

| Repo | Q1 Median | Q2* Median | Q1 P75 | Q2* P75 |
|------|-----------|------------|--------|---------|
| cloud-infrastructure | 0.1 | 0.2 | 0.7 | 0.9 |
| nx | 6.5 | 2.9 | 40.6 | 11.6 |
| ocean | 3.3 | 2.3 | 26.7 | 22.8 |
| nx-console | 2.1 | — | 15.9 | — |

The nx repo P75 dropped from 40.6h to 11.6h. Worth investigating: smaller PRs from AI, faster CI, fewer reviewers needed, or just early Q2 sample size.

### P0/P1 resolution time (days)

| Team | Q1 Count | Median | P75 |
|------|----------|--------|-----|
| Kraken | 54 | 0.1 | 1.1 |
| Quokka | 2 | 2.5 | 2.5 |
| Dolphin | 48 | 5.1 | 21.1 |
| Orca | 25 | 6.4 | 37.1 |
| Red Panda | 2 | 285.1 | 285.1 |

Kraken resolves same-day. Red Panda's 285d is 1-2 ancient issues finally closed, not representative. Orca P75 at 37.1d needs attention (target is 7d).

---

## 6. Competitive landscape

### Turborepo (high threat)

| Area | Turbo | Nx |
|------|-------|-----|
| Speed | v2.9.0: 96% faster TTFT | Daemon + task graph faster at scale |
| CI | Basic remote cache | DTE, task sandboxing, self-healing |
| Migration | None | `nx migrate` unmatched |
| Observability | OpenTelemetry (experimental) | CIPE input comparison, cache debugging |
| Incremental caching | v2.9.4 `incrementalTasks` | Not yet |
| Local cache | Eviction controls shipped | Gap |

Turborepo is competing credibly. Nx dominates on CI intelligence, migration tooling, and enterprise features.

### Others

Moon v2.0 shipped WASM plugins, MCP integration, and explicit Nx migration extensions. Low-medium threat, but they're targeting our users directly.

Rspack 2.0 RC is approaching stable. High compatibility priority for Nx plugins.

Gradle and Bazel remain low threat, enterprise-only.

### Framework risks

| Risk | Severity | Timeline |
|------|----------|----------|
| Vite 8 + Rolldown breaking changes | High | Now |
| Angular 22 drops Node 20 | High | ~May 2026 |
| Rspack 2.0 stable | High | Imminent |
| Node 20 EOL | High | 23 days (April 30) |

---

## 7. AI impact

### What's working

We ship AI integration to customers (`nx configure-ai-agents`, Self-Healing CI) and use AI heavily internally. Claude Code handles scan-and-audit automation, monthly digests, task planning, code review prep, and PR analysis. 1,064 blog images were optimized with AI assistance. Three CVEs were resolved in under 3 days with AI-assisted triage.

### What to watch

PR review is becoming the bottleneck. AI generates PRs faster than humans review them. We need data on review queue depth and time-to-review trends.

The industry is shifting from "AI generates code fast" to "AI-generated code needs governance." We need to figure out where we stand on this for our own repo.

Copilot now signs agent-authored commits. Nx Cloud needs a strategy for CI attribution: do agent commits get the same trust level as human ones?

Cursor 3 runs agents in parallel with worktree isolation. If contributors use this on our repo, we need to understand the concurrency implications.

We're shipping at ~2 Claude Code releases per day. Amazon Kiro has had 3 confirmed AI-caused outages. We should think about tool dependency risk.

### Industry context

Agent management is replacing code editing as the primary developer activity. Cursor 3 shipped a dedicated Agents Window. Copilot's cloud agent dropped the PR-only constraint.

No AI guardrail tool is monorepo-aware. A 450K-file polyglot monorepo evaluation found no tool handled it without layered guardrails. That's our opportunity.

As developers manage fleets of AI agents, dependency-aware scheduling becomes the coordination layer they're missing. Nx already does this.

MCP ecosystem passed 10,000 indexed servers. Enterprise registries are forming. Our MCP strategy is validated.

### SPACE signals to investigate

The nx repo P75 dropped 71% (40.6h to 11.6h). Is that AI-driven? Total PRs up 50% YoY without headcount growth. The ocean repo P75 is still at 22.8h, so whatever's driving the nx improvement isn't happening everywhere.

Research to do before presenting:
- Pull Co-authored-by trailer counts from GitHub to quantify AI contribution
- Check if Lighthouse /data breaks out time-to-first-review vs time-to-merge
- Look at PR size trends (`gh pr list --json additions,deletions`)
- Check review load distribution across the team
- Get Self-Healing CI fix commit counts across customer orgs

### Questions for the team

- The nx repo went from 40.6h P75 to 11.6h. What changed?
- We're shipping 50% more PRs with the same team. Is that sustainable?
- Should AI-generated PRs have different review expectations?
- How do we dogfood `nx configure-ai-agents` and self-healing CI in our own workflow?

---

## 8. How we work

### Shape Up

Six-week cycles with cooldown weeks. Work is shaped before it's built: appetite is set, risks are identified, rabbit holes are called out. Teams have autonomy within the shaped scope. Cooldown is for bug fixes, tech debt, exploration, and recovery.

### Success means adoption, not shipping

We don't measure success by "did we ship code." We measure whether the metric moved.

CNW A/B test: success is cloud conversion rate improvement, not "we shipped the prompt change." Self-Healing CI: success is 8 paying customers, not "we added Bitbucket support."

Every project needs a success metric at kickoff. If you can't define what success looks like in numbers, you're not ready to build.

Features that launch and nobody adopts are failures. The question isn't "did marketing promote it?" It's "did the product make the value obvious? Did we instrument it? Did we create a path from discovery to upgrade?" Engineering owns that gap.

### Planned work has expectations

Planning accuracy budgets already account for unplanned work (Kraken 50%, Dolphin 50%, Orca 75%, Red Panda 80%). The point isn't eliminating unplanned work. It's making sure the planned portion is intentional, funnel-aligned, and measurable.

Reviews should move fast. Target is ≤24h median TTM, ≤72h P75. A PR sitting for 3 days blocks the team.

P0/P1 issues should resolve within the team's target window. Long P75 tails mean things are getting stuck.

### Incident and security response

We have an IR process and we've used it. The March 2026 org-access-leakage incident, the pentest findings, and the CVE cluster all went through it. The process works when we follow it. What we need to reinforce:

Response time matters and we're good at it. Three CVEs resolved in under 3 days. Five pentest findings remediated. Four critical Red Panda CVEs (including a CVSS 10.0) patched. Customer supply chain inquiries closed same-day. This is a strength worth protecting.

Security is unplanned work that serves the funnel. Every CVE fix is retention. Every pentest remediation is enterprise trust. This is the kind of unplanned work that planning accuracy budgets exist for — it can't be predicted, but it's high-value.

What still needs attention: the IR process doc in Notion needs the scope statement and severities outline added. The Security IR Plan draft exists but hasn't been published as a sibling page. The March org-access-leakage postmortem needs to go into the Postmortems DB. These are open items from April 2.

Going forward, every security incident should have a postmortem in the DB within 7 days of resolution. Not just "what happened" but "what do we change." The IR process should be something every team lead can run without checking with Jack first.

### Connecting to PLG

Heidi and Joe are running PLG exercises on Day 2: Acquisition → Activation → Adoption → Conversion. This section is the engineering side of the same conversation.

The big picture: enterprise sales alone can't get to $25M. $6M comes from enterprise, $9M needs to come from product. We're not PLG yet, but we have proof it works.

PLG proof points we already have:

| What | Funnel stage | Result |
|------|-------------|--------|
| CNW A/B testing | Acquisition → Activation | 63% lift in cloud signups |
| `nx configure-ai-agents` | Acquisition | Agentic onboarding, no docs needed |
| Self-Healing CI | Adoption → Conversion | 8 customers, enterprise billing |
| Task Sandboxing | Adoption | 4 production customers with Cloud UI |
| Surface Level Telemetry | Activation | Cache hit rate shown in terminal immediately |
| Self-Healing Setup Wizard | Activation | One-button setup, auto-detects CI provider |
| Plan selection in onboarding | Conversion | Self-serve upgrade without sales |

We've been doing PLG-shaped things without calling them PLG. The shift is making it intentional and measurable.

### Planned work should have three things

1. A funnel stage. Which of Acquisition/Activation/Adoption/Conversion does this serve?
2. A success metric. Not "we shipped it" but "conversion increased X%."
3. A measurement plan. Do the signals exist today, or do we need to build them?

Heidi and Joe's exercise has a "None of the above" pile for work that doesn't serve any funnel stage. Our planning accuracy gap is the time-allocation version of the same thing: if a team budgets 75% planned work but lands at 60%, that 15% delta probably isn't funnel-aligned.

### Competitive work is funnel defense

Competitive analysis doesn't map neatly to Acquisition → Conversion, but it prevents leakage.

| Threat | What bleeds |
|--------|------------|
| Turbo ships a feature we lack | Acquisition (evaluators pick Turbo) and Adoption (existing users feel left behind) |
| Moon targets Nx users with migration extensions | Acquisition (explicit poaching) |
| Rspack/Vite 8 breaking changes | Adoption (plugins break, users lose trust) |
| Pricing perception | Conversion (users hit paywall and compare alternatives) |

The question: "If we don't do this, which funnel stage bleeds?"

### Infrastructure we built but don't sell

| Capability | Status | Could serve |
|------------|--------|-------------|
| Docker Layer Caching | In production | Activation/Adoption |
| NPM Registry Read-Through | Infrastructure exists | Activation |
| Multi-cluster agent facade | Done (22 issues) | Enterprise Conversion |
| PrivateLink | Researched | Enterprise Conversion |
| Artifact Encryption | Shipped | Adoption/Conversion |
| EU Provider | Research done | Conversion |

Every capability here is engineering effort that should either drive PLG metrics or be packaged and sold. If it does neither, we need to ask why we built it.

### Shipping is 40% of the work

The old model: engineering builds, marketing sells, sales closes. In PLG, shipping the code is maybe 40% of the job. The rest:

- Can we measure if anyone uses it? If not, we shipped blind.
- Does the user discover it naturally, or is it buried behind clicks and docs?
- Does the product tell the user what it did for them? ("Saved 4m 32s" vs. silent cache hit)
- If this drives upgrade intent, where's the nudge?

| Feature | What we did | What PLG also needs |
|---------|------------|---------------------|
| Docker Layer Caching | Built and deployed | Surface time saved in CI output, add to pricing, track adoption |
| Task Sandboxing | eBPF tracing + Cloud UI | Do users who see violations come back? Do they upgrade? |
| `nx configure-ai-agents` | Auto-configures 4 tools | How many workspaces activate through agentic setup vs. manual? |
| Self-Healing CI | 8 customers, billing | What's the free → paid conversion rate? Is there a self-serve path? |
| Surface Level Telemetry | Cache hit rate in terminal | Is this the aha moment that correlates with activation? |

### Docs in PLG

Docs are the fallback, not the primary path. If someone needs docs to get started, the product has a gap.

CLI team: `nx init` and `nx connect` should work without docs. If the terminal output is confusing, fix the output.

Cloud team: onboarding wizard, setup wizard, error remediation — all in-product. Docs are for advanced configuration.

Docs team: shift from "how to get started" to "how to get more value." Getting started should be zero-docs.

DPE/Support: every "how do I set up X" Pylon ticket is a product gap, not a docs gap.

Test for any feature: if you deleted the docs page, would users still find and use it? If no, the product needs work.

### Discussion topics

- Are we instrumenting new features for product signals, or shipping and hoping?
- CNW A/B testing is the model. Should all planned work follow hypothesis → experiment → measurement → iterate?
- What are we giving away that should be behind a paywall? What's behind a paywall that should be free to drive activation?

---

## 9. Prep checklist

Done:
- [x] SPACE metrics from Lighthouse
- [x] Shipped features from digests and archives
- [x] Competitive landscape from scan-and-audit
- [x] AI impact with SPACE-backed data
- [x] PLG connection and proof points

Remaining (~45 min):
- [ ] Pick 3-5 wins to spotlight with one-sentence talking points (10 min)
- [ ] Investigate the nx repo P75 TTM drop — pull Co-authored-by counts and PR sizes (15 min)
- [ ] Check Lighthouse /data for time-to-first-review breakdown (5 min)
- [ ] Pull Self-Healing CI fix commit counts from customer orgs (10 min, optional)
- [ ] Compile into slides or talking point cards (15 min)
