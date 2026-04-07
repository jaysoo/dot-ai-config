# State of the Union — Montreal Off-site Day 2

**Session:** Morning session, Day 2
**Prep time:** ~1-2 hours
**Sources:** Monthly digests (April 2026), scan-and-audit reports, COMPLETED.md, eng-wrapped 2025 data, Lighthouse SPACE dashboard (live)

---

## 1. Hero Numbers (Open With These)

| Metric                       | Value                          | Trend    |
| ---------------------------- | ------------------------------ | -------- |
| npm downloads (nx core)      | 78M over 61 days (~10.5M/week) | +17% MoM |
| CLI stable releases (March)  | 5 (22.5.4, 22.6.0–22.6.3)      | —        |
| Cloud releases (March)       | 17                             | —        |
| Linear issues closed (March) | 328 across 6 teams             | —        |
| Projects completed (March)   | 8                              | —        |
| Current stable               | v22.6.4                        | —        |

**TODO:** Pull latest numbers from Lighthouse SPACE dashboard to verify/update these.

---

## 2. Wins to Celebrate

### Flagship Features Shipped

**Task Sandboxing & Hermetic Builds (eBPF)**

- In production with ClickUp, Legora, Island, Wix
- Cloud UI shows file-level violation analysis with filtering and timeline views
- 50+ issues completed across the feature

**AI-Native Developer Experience**

- `nx configure-ai-agents` auto-detects Claude Code, Cursor, Codex, Gemini
- Nx init/import work in AI sandbox environments
- `.agents` skills directory now standard

**Surface Level Telemetry GA**

- Analytics pipeline rewritten in Rust, integrated with GA4
- Dogfooded across repos
- Users prompted during workspace creation with opt-out

**Self-Healing CI Enhancements**

- Now runs workspace git hooks before committing AI fixes
- Access expanded to all users with allowed email domains
- 8 customers across adoption stages: PayFit, Emeria, ClickUp, CREXi, Island, Celonis, Hilton, Vattenfall

**Polygraph Standalone Launch**

- Extracted as independent product
- New frontend, Kotlin backend, GitHub App, Azure DevOps OAuth
- 21 issues shipped this cycle

**Infrastructure Completions**

- Multi-cluster agent facade controller (22 issues)
- K8s Gateway API replacing nginx ingress
- All GitHub Actions across 5 repos SHA-pinned for supply chain security
- IO Trace Helm Chart, Europe-Provider setup, PrivateLink Service, Bucket access bindings

### Ecosystem & Framework Support

| Framework/Tool | What Shipped                                          |
| -------------- | ----------------------------------------------------- |
| Vite 8         | Full support (22.6.2), Rolldown as production bundler |
| Angular 21.2   | Signal forms support                                  |
| ESLint v10     | Support added                                         |
| Yarn Berry     | Catalog support                                       |
| Bun            | Environment fixes                                     |
| Maven          | External deps now in project graph                    |

### CNW Onboarding Recovery

- Funnel restored to v22.1.3 conversion baseline after **30% drop**
- Cloud prompts brought back with explicit opt-out
- Template shorthand names for non-interactive mode
- A/B testing cloud prompt copy (3 variants) underway

### Security & Hardening

- **5 pentest findings remediated:** Rollbar token injection, email verification, unauthenticated achievements endpoint, sensitive session cookie data, arbitrary URL as org
- **Supply chain:** All GH Actions SHA-pinned across 5 repos
- **3 CVEs resolved in <3 days each:** Picomatch, yaml@1.x, Axios
- **LGPL licensing** proactively addressed with 2 fix PRs within 5 days of community report

### Docs & DX

- Blog extracted to standalone Astro site (nx-blog)
- 1,064 blog images optimized to responsive WebP (640w, 1280w, original)
- 8 tutorial pages rewritten (topic-focused, replacing monolithic guides)
- 1,231 Netlify redirect rules migrated from Next.js to edge
- Search dialog improvements, cross-site link checks
- Task sandboxing docs with SVG diagrams & 6 screenshots

---

## 3. From Engineering Wrapped 2025 (Reference — What We Celebrated Last Time)

Use this as a comparison point — "here's where we were, here's where we are now."

**2025 Stats:**

- 20 engineers, 80 projects (Infra: 40, CLI: 19, Orca: 17, Red Panda: 4)
- 4.45M lines changed (2.77M insertions, 1.68M deletions)
- 8 major framework versions supported (Angular 21, Next 16, Expo 54, Nuxt 4, Vitest 4, Storybook 10, Cypress 15, Node 24)

**2025 Feature Highlights by Team:**

- **CLI:** Terminal UI, Migrate UI, 8 framework plugins, Pnpm Catalog, AI Code Gen, Angular Rspack, .NET Plugin
- **Cloud/Orca:** Onboarding Flow, Enterprise Usage UI, Flaky Task Analytics, Graph UX, Artifact Downloads, EU Pro, CI Stability, PostHog Real-Time
- **Infrastructure:** Docker Layer Caching, Azure Single Tenant, Distributed Tracing, Grafana Dashboards, Helm Chart v1, SOC2 Compliance, MongoDB Upgrade, Valkey Migration
- **Red Panda:** Self-Healing CI, GitHub/GitLab/Azure DevOps integrations, Time-to-Green, Polygraph

**TODO:** Decide which 2025→2026 progressions to highlight (e.g. "Self-Healing CI went from launch → 8 production customers", "Task Sandboxing went from prototype → 4 production customers with eBPF").

---

## 4. SPACE Metrics (Fill In From Lighthouse)

**TODO:** Pull these from the Lighthouse page with live data during prep.

### Satisfaction & Well-being

- _Notes:_

### Performance

- _Notes:_

### Activity

- npm download trends: 10.5M/week (+17%)
- 328 issues closed in March
- _Other activity metrics from Lighthouse:_

### Communication & Collaboration

- _Notes:_

### Efficiency

- Security response: 3 CVEs in <3 days
- CNW funnel recovery after 30% drop
- _Other efficiency metrics from Lighthouse:_

---

## 5. Competitive Landscape

### Turborepo (HIGH threat)

| Area                | Turbo                        | Nx Advantage                                     |
| ------------------- | ---------------------------- | ------------------------------------------------ |
| Speed               | v2.9.0: 96% faster TTFT      | Nx daemon + task graph still faster at scale     |
| CI Distribution     | Basic remote cache           | Full DTE, task sandboxing, self-healing          |
| Migration           | None                         | `nx migrate` unmatched                           |
| Observability       | OpenTelemetry (experimental) | CIPE input comparison, cache debugging           |
| Incremental caching | v2.9.4 `incrementalTasks`    | Not yet — evaluate if Nx should offer equivalent |
| Local cache         | Eviction controls shipped    | Gap — Nx doesn't have this yet                   |

**Key narrative:** Turborepo competing credibly now, but Nx dominates on CI intelligence, migration tooling, and enterprise features.

### Other Competitors

- **Moon v2.0 "Phobos"**: WASM plugins, MCP integration, explicit Nx migration extensions (targeting our users). Low-Medium threat.
- **Rspack 2.0 RC**: Approaching stable. HIGH compatibility priority for Nx plugins.
- **Gradle/Bazel**: Low threat, enterprise-only.

### Framework Risks to Track

| Risk                               | Severity | Timeline           |
| ---------------------------------- | -------- | ------------------ |
| Vite 8 + Rolldown breaking changes | HIGH     | Now                |
| Angular 22 drops Node 20           | HIGH     | ~May 2026          |
| Rspack 2.0 stable                  | HIGH     | Imminent           |
| Node 20 EOL                        | HIGH     | 23 days (April 30) |

---

## 6. Team Health & Risks (Talk Track)

### Capacity Concerns to Address

- **Nicole Oliver**: 8+ in-progress items, 7+ project leads, 3 overdue — highest risk of burnout/bottleneck
- **Craigory Coppola**: 3 deeply overdue items (53d, 46d) — needs unblocking or scope reduction
- **Leosvel Perez Espinosa**: Leading nx migrate Revamp + Task Sandboxing simultaneously, 18d overdue on Celonis CPU issue

### Process Issues

- **4 zombie projects persist for 9th consecutive audit cycle** — Gradle Plugin, Self-Healing CI core, Capybara team, Template-based onboarding. Need leadership decision to formally close.
- **12 overdue items** across teams (down from ~20, improving)
- **Customer risks:** Medianet Maven 46d overdue, Capital One S3 cross-account blocking, Skyscanner cooling (50+ days no update)

### Bright Spots

- Infrastructure team shipping consistently (5 completions this cycle)
- Security response is exemplary (3 CVEs in <3 days, 5 pentest findings remediated)
- Community issue health improving (99 open / 101 closed ratio)
- Self-Healing CI expanding to 8 customers

---

## 7. AI Impact on Us (Positives & Downsides)

### How We're Using AI Internally

**Positives:**

- **AI-native DX is now a shipped product** — `nx configure-ai-agents` auto-detects Claude Code, Cursor, Codex, Gemini. We're not just using AI, we're shipping AI integration to customers.
- **Self-Healing CI** — our own AI-powered feature is in production with 8 customers. We're both producer and consumer of AI in CI.
- **Development velocity** — Claude Code used extensively for scan-and-audit automation, monthly digests, task planning, code review prep, PR analysis. One-person force multiplier.
- **Content generation** — blog image optimization (1,064 images), docs rewrites, tutorial redesigns all accelerated with AI assistance.
- **Security response** — AI-assisted triage contributed to 3 CVEs resolved in <3 days each.

**Downsides / Challenges:**

- **PR review volume** — AI makes it easy to generate PRs faster than they can be reviewed. Risk of review bottleneck becoming the new constraint. **TODO:** Do we have data on PR review queue depth / time-to-review trends?
- **Quality governance** — industry is shifting from "AI generates code fast" to "AI-generated code needs governance." Are we ahead or behind on this for our own repo?
- **Agent-authored commits** — Copilot now signs commits. We need to think about CI attribution: do agent commits get the same trust level as human commits in Nx Cloud?
- **Multi-agent concurrency risk** — Cursor 3 runs many agents in parallel with worktree isolation. If contributors use this on our repo, does our task graph handle concurrent agent modifications?
- **Dependency on AI tooling** — Claude Code releasing at ~2/day pace. Are we too coupled to a specific tool's workflow? What's our fallback if a tool has an outage (like Kiro's 3 confirmed outages)?

### Industry Context (Talking Points)

- **The shift is real:** "Agent management is replacing code editing as the primary developer activity." Cursor 3 shipped a dedicated Agents Window. Copilot cloud agent dropped PR-only constraint.
- **Monorepo advantage:** No AI guardrail tool is monorepo-aware. The "450K-file polyglot monorepo testing" evaluation found no tool handled it without layered guardrails. Nx is uniquely positioned.
- **Nx as coordination layer:** As developers manage fleets of AI agents, dependency-aware scheduling (what Nx already provides) becomes the missing coordination layer. "Nx tells your AI agents what's safe to touch in parallel."
- **Cautionary tale:** Amazon Kiro — 3 AI-caused outages, 1,500 engineers protesting internally. Validates structured CI with guardrails.
- **MCP ecosystem explosion:** 10,000+ servers indexed. Enterprise registries forming. Nx Cloud MCP strategy is validated by market direction.

### Questions to Pose to the Team

- How do we measure AI's impact on our own engineering productivity? (DORA metrics? SPACE?)
- Are we tracking time-to-review separately from time-to-merge? If AI accelerates creation but not review, the bottleneck just shifted.
- Should we have a policy on AI-generated PRs (labeling, review expectations, testing requirements)?
- What's our strategy for agent-authored commits in Nx Cloud CI attribution?
- How do we dogfood our own AI-native features (nx configure-ai-agents, self-healing CI) in our workflow?

---

## 8. Prep Checklist

- [ ] Pull SPACE metrics from Lighthouse dashboard (15 min)
- [ ] Pick 3-5 top wins to spotlight and draft 1-sentence talking points (15 min)
- [ ] Review eng-wrapped 2025 for "then vs now" progression stories (10 min)
- [ ] Screenshot competitive landscape data points (10 min)
- [ ] Decide framing for team health/risks — celebratory but honest (10 min)
- [ ] Optional: Pull customer impact anecdotes from Pylon (15 min)
- [ ] Compile into slides or talking points doc (15 min)
