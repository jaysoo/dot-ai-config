# April-May 2026 Lookahead

> Companion to the March 2026 monthly digest. Based on planning meeting notes cross-referenced with Linear projects and initiatives.

---

## Nx v23 Release (End of April Target)

The next major version is the central CLI milestone for this period. Multiple workstreams converge here:

- **v23 deprecations and TODOs** — 1-2 weeks of scoping/execution. The "Major Version Deprecations" project (Linear, target: Apr 10) has v23 milestone at 33% completion. Not fully scoped yet — high priority.
- **Angular v22 support** — Angular v22 releases week of May 18. Linear project created (lead: Leosvel), target May 22. Needs to land around v23 or shortly after.

---

## Dolphin (CLI) — April/May Focus

### Shipping in March → April

| Project | Linear Status | Lead | Target | Notes |
|---------|--------------|------|--------|-------|
| **Sandboxing (public launch)** | In Progress | Rares | Mar 13 (CLI) | Success = public announcement in April. UI anomaly reporting 89%, daemon uploads 45%, production hardening 38%. Cannot launch with broken core plugins. Gradle may need extra work. |
| **Worktree cache** | Planned | Jason | Mar 2–13 | 1 week effort, high impact. Turborepo parity requirement. All milestones at 0%. |
| **Surface Level Telemetry** | In Progress | Colum | Mar 6 | GA events 25%, Rust bindings 25%. Wrapping up. |

### Starting Late March → April

| Project | Linear Status | Lead | Target | Notes |
|---------|--------------|------|--------|-------|
| **Extending Target Defaults** | Planned | Craigory | Mar 30 – Apr 10 | Enable multiple build systems without conflicts. Critical for polyglot. Ocean dogfooding shows current limitations. |
| **`nx migrate` UX improvements** | Planned | Leosvel | Mar 30 – Apr 10 | Better transparency, debuggability, verbose logging. Part feeds into agentic migrations (Max). |
| **Improve generator metadata (AI-friendly)** | Planned | Leosvel | Mar 30 – Apr 3 | Better schema descriptions/examples for AI agents. Low priority but fast. |
| **Docker Multi-Arch Nx Release** | Planned → **DEFERRED** | Colum | (was Mar 30 – Apr 10) | Per planning meeting: Jack to confirm deferral. Ocean, Skyscanner, Payfit need it. James: consider programmatic API. |

### Starting Late April → May

| Project | Linear Status | Lead | Target | Notes |
|---------|--------------|------|--------|-------|
| **Plugin schema for nx.json options + hook declaration** | Backlog | Craigory | Apr 27 – May 8 | Needed for LSP, docs, AI. 1 week effort. |
| **Support Angular v22** | Backlog | Leosvel | May 22 | Angular releases May 18. |

### Paused / Deferred

- **Polyglot (Maven, Dotnet)** — PAUSED per planning meeting. Maven at 81% dogfooded, 50% client usage (RBC). Dotnet at 60% dogfooded. Waiting for DPE/customer feedback before committing more engineering time. Need Jason to escalate Maven clients with Joe.
- **`nx format`** — DEFERRED. Debate: remove entirely vs make pluggable vs leave as-is. Victor thinks we should remove it.

---

## Kraken (Infrastructure) — April/May Focus

### Active Now → Continuing into April

| Project | Linear Status | Lead | Target | Notes |
|---------|--------------|------|--------|-------|
| **GCP GKE Docker Image Pre-Loading** | In Progress | Patrick | Mar 2–27 | Pre-load popular base images on disk. Target 25% faster startup (~30s saved). Steve following up with Jeff on billing implications. AWS/Azure plan follows GCP. |
| **Multi-Cluster Agent Setups** | In Progress | Steve | Mar 2 – Apr 8 | Major effort: one app cluster + multiple agent clusters globally. Enables static IP offering, geographic distribution. |
| **Grafana Billing Alerts** | In Progress | Szymon | Mar 2 (target) | Alert on spikes, route to infra team, loop in DPEs. |

### Starting April

| Project | Linear Status | Lead | Target | Notes |
|---------|--------------|------|--------|-------|
| **K8S Gateway API + L7 Load Balancing** | Planned | Steve | Apr 3–18 | Secure agent-to-app cluster communication. Would have wanted this for sandboxing. Reduces internet egress costs. |
| **Lighthouse - Tenant MongoDB connections** | Planned | Patrick | Apr 13–17 | Proxy more services through Lighthouse. Remove direct customer DB access for DPEs. |

### Completed (Unblocking April work)

- **Lighthouse: Google Auth & Remove IaP** — Completed Feb 28. Foundation for tenant auto-registration and credit reporting.
- **IO Trace Internal Helm Chart** — Completed Mar 2. Supports sandboxing infra.

### Backlog / Mentioned in Planning but Not Scheduled

- **Azure Hosted Redis/Valkey** — Feature parity with GCP/AWS. CIBC using Azure. Scope could be large. No Linear dates yet.
- **Bring identity portal into OpenTofu** — Adding/removing instances. No Linear project found.
- **Break apart "nx-cloud-secrets" JSON** — Internal pain point, on-prem cleanup. No Linear project found.
- **Rename/Alias valkey_ envs** — Small task, prefix cleanup. No Linear project found.
- **Single Valkey/Redis for multiple agent clusters** — Backlog, related to multi-cluster work.
- **Europe-Provider Single Tenant Setup** (OVH/Hetzner) — Backlog, Medium priority. Responds to EU sovereignty movement.

---

## Red Panda (Cloud Frontend + AI) — April/May Focus

### Self-Healing CI

Self-Healing is a long-running project (since May 2025, lead: James Henry). All historical milestones at 100%. April focus per planning meeting:

- **Pricing/billing**: Enterprise cost ~$11-12K total. Meeting with Madeline/Joe/Jeff to move from trial to paid.
- **Adoption targets**: Enterprise 50% usage (currently 30%), Teams 100 orgs (currently 21 of ~500).
- **Remove "experimental" labeling** across platform.
- **Dedicated email campaign** for re-engagement.
- **Value optimization**: Target 40% platform value rate.
- **Eliminate execution errors** for fix completion.

### Polygraph (AI)

The "Polygraph AI" project (lead: Jonathan Cammisuli) is Planned. Per planning meeting breakdown:

| Phase | Estimated Effort | Notes |
|-------|-----------------|-------|
| Non-Nx workspace support | 2 weeks | Expand beyond Nx-only |
| Billing implementation | 2 weeks | — |
| Simplify onboarding | 1 week | — |
| Core functionality | 2 weeks | — |
| Teams + Hobby tier | 2 weeks | — |
| Other agent support | 2 weeks | Beyond Claude Code |

### AX (Agentic Experience)

Project (lead: Max Kless) is In Progress. "Major Coding Agents supported" milestone at 100%. "Agentic onboarding seamless" at 63%.

April/May focus:
- **Agentic migrations** — Big feature, needs specs, marketing coordination.
- **Init/CNW, skills, tech-specific improvements** — Lots of misc tasks.

### Orca (Cloud Frontend)

| Project | Linear Status | Lead | Target | Notes |
|---------|--------------|------|--------|-------|
| **Feature activation guides** | Planned | Nicole | Mar 2 – Apr 24 | Enterprise vs SaaS guides, contextual setup instructions. Growth + Revenue labeled. |
| **Feature demos** | Planned | Nicole | Mar 2 – Mar 31 | Dummy data storytelling. Dillon building the mechanism. |
| **In-Progress Agent Waterfall Visualization** | Planned | Ben | Mar 30 – Apr 30 | Timeline/waterfall view replacing agent pills. Growth + Revenue labeled. Ben's 3-week March absence may impact timeline. |
| **600 workspaces connected** | In Progress | Nicole | Mar 13 | Carryover. 53% on app messaging, 75% on CTAs, 46% on CNW boost. |

---

## Quokka (Cloud Backend) — April/May Focus

| Project | Linear Status | Lead | Priority | Notes |
|---------|--------------|------|----------|-------|
| **Resource-based parallel task assignment** | Planned | — | High | Replace assignment rules with historical data. 6+ customers requesting. |
| **Task Analytics Percentiles** | Planned | — | High | Average not good enough. 6 customers requesting. |
| **Improve manual agent metrics upload DX** | Planned | — | Medium | No UI changes needed, use existing infrastructure. |
| **Enterprise Analytics API Cleanup (Prometheus)** | Planned | — | Medium | Original work done Dec. Talk to Caleb/Miro for customer feedback first. |
| **CIPE Configuration Rework** | Planned | — | Low | Reduce start-ci-run complexity. Should be able to get to it. |
| **March-April 2026 Misc** | In Progress | Altan | — | Catch-all for smaller items. |
| **Continuous assignment of tasks** | In Progress | Altan | High | Carryover from Jan-Feb. |

---

## Website / Marketing

- **Framer migration** — Completed in Linear (all milestones 100%). Blog posts moving off Nx repo but keeping Markdown flow. Ben's 3-week March absence impacts remaining blog migration timeline.

---

## Key Cross-Team Dependencies & Risks

### Critical Path Items
1. **Sandboxing → Public Announcement (April)**: CLI (production hardening 38%) + Cloud (UI anomaly reporting 89%) + Infra (IO trace helm chart done). Cannot launch with broken core plugins — Gradle may be the long pole.
2. **v23 Release (End of April)**: Deprecations not fully scoped. Sandboxing needs to ship before or with v23 for marketing impact.
3. **Multi-Cluster Agents (Apr 8) → K8S Gateway API (Apr 3-18)**: Gateway API would have been ideal for sandboxing but comes after. Sequential dependency.

### Staffing / Availability Risks
- **Ben Cabanes** — 3-week absence in March. Impacts Agent Waterfall Visualization (his prototype, starts Mar 30) and Framer blog migration timeline.
- **Polyglot paused** — Frees up Craigory for Target Defaults and Plugin Schema, but Maven/Dotnet customer momentum may cool.

### External Dependencies
- **Angular v22** (May 18) — Must have support ready within days of release.
- **Self-Healing pricing** — Dependent on Madeline/Joe/Jeff meeting outcome.
- **Maven client pipeline** — Jason needs to escalate with Joe for additional clients beyond RBC.

---

## May-June Initiative

The "2026 May - June" initiative exists in Linear (status: Planned) but has **no projects assigned yet**. Based on planning meeting context, likely candidates:

- Angular v22 support (already created, target May 22)
- Plugin schema for nx.json (target extends to May 8)
- Polygraph phases (multi-week effort extending through May)
- AX agentic migrations (big feature, likely multi-month)
- Self-Healing paid model rollout
- Multi-cluster follow-ups (multi-region investigation is in backlog)
- Azure Redis/Valkey (if scoping completes in April)
