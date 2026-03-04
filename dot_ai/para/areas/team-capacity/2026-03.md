# Director of Engineering Briefing — April/May Risk Analysis

> Generated 2026-03-04. Cross-referenced with Linear issue-level data.

---

## 1. Capacity & Sequencing Risk

### CLI (Dolphin) — Mar 30 – Apr 10 Crunch

| Person | In Progress | Todo | Overdue | Mar 30 Starts | Risk |
|--------|------------|------|---------|---------------|------|
| **Craigory Coppola** | 9 | 23 | 5 | Extending Target Defaults, Plugin Schema | **HIGH** |
| **Leosvel Perez** | 3 | 22 | 0 | nx migrate UX, Generator Metadata (2 leads) | **MED-HIGH** |
| **Colum Ferry** | 4 | 30 | 2 | Docker Multi-Arch (if not deferred) | **MEDIUM** |
| **Jason Jean** | 5 | 6 | 2 | Worktree Cache (overdue since Feb 13), Maven | **MEDIUM** |
| **Max Kless** | 3 | 7 | 1 | AX/Agentic Experience | **MEDIUM** |
| **Rares Matei** | 0 | 3 | 0 | Sandboxing (continuing) | **LOW** |

**Key findings:**

1. **Craigory is the single biggest bottleneck.** 5 overdue items including NXC-3748 (spread operator for task config arrays) — this is the prerequisite for "Extending Target Defaults" and is overdue by a week. He also has 6 queued Sandboxing items that could pull him away. He simultaneously leads .NET Support which is actively In Progress.

2. **Leosvel has a double-booking problem.** Two project leads starting the same day (Mar 30): "nx migrate UX" and "Generator metadata." If either of his current Mar 6 items (hanging process investigation, postTasksExecution fix) slip, it cascades.

3. **Jason's Worktree Cache (NXC-3806) is overdue since Feb 13.** Three Maven issues are all due Mar 6 — heavy sprint ending. If those close on time, the window opens up.

4. **Colum's risk is conditional on Docker Multi-Arch deferral.** If deferred (as discussed in planning meeting), he has breathing room. If not, local dist migration (due Mar 13) + Docker + remaining v23 deprecation items (NXC-3711 "Remove Tailwind Support") stack up.

**Recommendation:**
- Confirm Docker Multi-Arch deferral to free Colum
- Get Craigory's overdue items resolved before Mar 30 or reassign Target Defaults lead
- Split Leosvel's Mar 30 starts — generator metadata is Low priority, push it to mid-April

### Infrastructure — Steve Pentland Overlap

| Person | In Progress | Todo | Risk |
|--------|------------|------|------|
| **Steve Pentland** | 2 | 35+ | **HIGH** |
| **Patrick Mariglia** | 2 | 2 | **LOW** |
| **Szymon** | 0 | 2 | **LOW — available capacity** |

**Steve leads Multi-Cluster Agents (37 issues, through Apr 8) AND K8S Gateway API (Apr 3-18).** That's a 6-day overlap where he leads two concurrent projects. Multi-Cluster alone has 37 issues — there is essentially zero chance all wraps up by Apr 8. Slippage extends the overlap.

**Szymon has available capacity** — just finished Grafana Billing Alerts and AL2 migration. Only 2 backlog items.

**Also: 6 unassigned CVEs** in the Workflow Controller/Log Uploader (INF-993 through INF-998) have no owner.

**Recommendation:**
- Assign Szymon to assist Steve on Multi-Cluster or pick up Gateway API
- Stagger project starts — push Gateway API to Apr 9+ (after Multi-Cluster nominal end)
- Assign CVEs to someone (likely Szymon)

---

## 2. Revenue Stream Coordination

Three new monetization tracks are launching close together:

| Revenue Track | Owner | Status | GTM Dependencies |
|---------------|-------|--------|-----------------|
| **Self-Healing CI → Paid** | James Henry | Meeting with Madeline/Joe/Jeff pending | Pricing ($11-12K), billing UI changes, remove "experimental" labels |
| **Polygraph → Billing** | Jonathan Cammisuli | Planned, ~2 weeks of billing work | New feature for Teams + Hobby tiers |
| **Static IP Premium (from Multi-Cluster)** | Steve Pentland | Engineering in progress | Premium pricing model TBD |

**Risk:** No single person owns the revenue coordination across all three. Sales/CS could get confused about what to sell when. Each involves different stakeholders.

**Recommendation:** Create a "Revenue Launches Q2 2026" tracking view in Linear or ensure Jeff/Joe have visibility into all three timelines. Align on which launches first.

---

## 3. Long-Running Projects Without Clear Exits

### Summary

| Project | Duration | Milestones Incomplete | Open Issues | Recommendation |
|---------|----------|----------------------|-------------|----------------|
| **Maven Support** | 12 months | 6 of 8 (75%) | 12 | **Redefine scope** |
| **.NET Support** | 7 months | 6 of 10 (60%) | 4 | **Redefine scope** |
| **Self-Healing CI** | 10 months | 0 of 9 (all done) | 15 | **Graduate** |
| **Gradle Plugin** | 14 months | 0 of 5 (all done) | 5 | **Graduate** |

### Detailed Findings

**Maven Support** — Target date already passed (Feb 13). Conflates technical completeness with client adoption. "Use Nx Maven with Clients" at 39% and "Polygraph supports Maven" at 0% are open-ended goals. NXC-3341 (dogfood in nx repo) is Blocked.

→ **Split into:** "Maven Plugin GA" (technical, time-boxed) + "Maven Client Adoption" (move to an area, not a project).

**.NET Support** — Target date is Mar 6 (2 days away) but "Migration path from @nx-dotnet" and "Nx Release Support" are both at 0%. Cannot land in 2 days. Core plugin work (prep, polish, import) is done. Client tracking (MECCA, Crexi) mixed with technical work.

→ **Cut 0% milestones** into a follow-up project. Extend target for remaining docs + ci-workflow work. Move client tracking to an area.

**Self-Healing CI** — All 9 milestones at 100% but project is "In Progress" with 15 open issues. The original build-out (May–Sep 2025) is complete. Remaining work is monetization (NXA-1009, NXA-953) and adoption campaigns (NXA-1103/1104/1105/1106).

→ **Mark project Completed.** Create "Self-Healing Monetization" and "Self-Healing Adoption" as separate scoped projects.

**Gradle Plugin** — All 5 milestones at 100%. 5 remaining issues are maintenance bugs. This project has been "done" for months.

→ **Mark project Completed.** Move remaining issues to NXC team backlog.

**Proposed process rule:** If all milestones are at 100% and no new milestones have been added in 60+ days, auto-close the project.

---

## 4. Competitive Pressure Points

### Most Urgent Gap: Worktree Cache Sharing

**Turborepo shipped worktree support in v2.8 (Jan 23, 2026).** It automatically detects worktrees and shares `.turbo/cache` across them with zero configuration. Moon v2.0 also has worktree compatibility. **Nx has nothing.** Jason's Worktree Cache project (NXC-3806) is overdue since Feb 13.

### New Threat Since Last Scan: Turborepo v2.8.13 (Mar 3, 2026)

Shipped yesterday with two notable developments:
1. **OpenTelemetry observability** (`experimentalObservability`) — enterprise build metrics. Directly competes with Nx Cloud task analytics.
2. **Oxc replaces SWC** for JS/TS parsing — signals Turborepo aligning with VoidZero's Rust toolchain (same team building Vite+). Ecosystem convergence risk.

### Feature-by-Feature Status

| Nx Feature (Planned) | Competitive Status | Notes |
|----------------------|-------------------|-------|
| **Task Sandboxing / IO Tracing** | **AHEAD** — Only Bazel has comparable, and it's too complex for JS teams | Ship this and own it. Biggest competitive moat opportunity. |
| **Worktree Cache** | **BEHIND** — Turbo shipped Jan 23, Moon has it | Urgent. 2-month gap already. |
| **Agentic Experience** | **MIXED** — Turbo winning narrative, Nx has deeper tooling | Need counter-messaging. Nx MCP + configure-ai-agents is more sophisticated. |
| **Task Distribution** | **AHEAD** — No JS/TS competitor has anything comparable | Continue widening lead. Resource-aware continuous feeding is unique. |
| **Polyglot** | **AHEAD** — Turbo/Vite+ are JS-only | Differentiation, not catch-up. |
| **Observability/Telemetry** | **NOW CONTESTED** — Turbo's OTel integration is new | Monitor closely. Nx Cloud's analytics is more mature but Turbo is entering the space. |

### Unassailable Moats (Not Threatened)
`nx migrate`, `nx import`, `nx release`, module federation, workspace conformance, CODEOWNERS, cache debugging, CIPE insights.

---

## 5. Customer Dependency Concentration

### Active Customer Matrix

| Customer | Feature Dependency | Open Issues | 30-Day Active? | Primary DPE | Risk |
|----------|-------------------|-------------|----------------|-------------|------|
| **RBC** | Maven | 1 | Yes (Feb 26) | Steven/Jason | Maven graph issue overdue |
| **CIBC** | Azure Redis/Valkey | 5 | Yes (Mar 4) | Steven/Austin | **PoV in progress, contracts in Triage** |
| **Entain** | .NET, On-Prem Agents | 3 | Yes (Mar 3) | Miroslav | Dotnet milestone just shipped |
| **Vattenfall** | .NET, Self-Healing CI | 3 | Yes (Mar 3) | Miroslav | Dotnet shipped; SHCI blocked by Azure DevOps |
| **Skyscanner** | Docker, TS Sync | 2 | Yes (Feb 16) | Rares | Sync gen in review |
| **PayFit** | Docker, SHCI, Conformance | 7+ | Yes (Mar 2) | James/Miroslav | **Very active — multiple workstreams** |
| **Emeria** | SHCI, Prometheus, Infra | 5+ | Yes (Mar 4) | Miroslav | Very active — SHCI + metrics |
| **Flutterint** | Hybrid Workflows | 0 | Yes (Mar 4) | Miroslav | Stable |
| **Caesars** | N/A | 0 | No | (was Caleb) | **CHURNED — ST removed Jan 2026** |

### Key Findings

1. **Caesars has churned.** ST instance deleted, did not renew. Remove from active tracking.

2. **CIBC is highest-risk.** PoV in progress with 4 Sales items in Triage. Contract finalization targeted Feb 1 — appears overdue. Azure infra work (INF-1018) actively in progress. If Azure Redis/Valkey is needed for this customer and it's not scoped yet, that's a blocker.

3. **Miroslav Jonas is DPE for 4 customers** (Entain, Vattenfall, Emeria, Flutterint). Potential capacity concern if multiple need attention simultaneously.

4. **.NET milestone achieved for both validation customers** — Entain and Vattenfall both completed "@nx/dotnet is used in CI" on Mar 3. Good timing for the planned polyglot pause, but these customers are now in a "what's next" phase. Dotnet project has 0% milestones remaining (migration path, Nx Release Support) that neither customer is likely asking for yet.

5. **PayFit is most engaged overall** — 40+ issues, 7+ open across SHCI, conformance, flaky metrics, Docker, DTE. They're the closest thing to a full-platform reference customer.

6. **Maven pause risk:** RBC is the only active Maven client validation customer. NXC-3953 (Maven graph issue) is overdue. If RBC disengages during the pause, you lose the only production feedback loop. Jason needs to escalate additional Maven clients with Joe (per planning meeting).

### Recommendations

- **CIBC:** Verify contract status — is Feb 1 target date still valid? Clarify if Azure Redis/Valkey is a PoV requirement.
- **Miroslav load:** If Emeria or Vattenfall escalate while Entain needs attention, there's no backup DPE. Consider cross-training.
- **RBC/Maven:** Don't let the overdue Maven graph issue (NXC-3953) sit during the pause. It's the difference between "paused with satisfied customer" and "paused with frustrated customer."
- **Caesars:** Clean up any remaining references in Linear/infra configs.

---

## Action Items Summary

### Immediate (This Week)

| # | Action | Owner | Why |
|---|--------|-------|-----|
| 1 | Confirm Docker Multi-Arch deferral | Jack | Frees Colum, removes sequencing pressure |
| 2 | Resolve Craigory's overdue NXC-3748 (spread operator) | Craigory/Jason | Blocks Extending Target Defaults (Mar 30 start) |
| 3 | Push Leosvel's "Generator metadata" to mid-April | Jason | Deconflicts his double-booking on Mar 30 |
| 4 | Assign Szymon to assist Steve or pick up Gateway API | Steve/Szymon | Addresses Infra overlap risk |

### This Month

| # | Action | Owner | Why |
|---|--------|-------|-----|
| 5 | Graduate Gradle Plugin and Self-Healing CI projects in Linear | Jason | 14-month and 10-month zombies with all milestones done |
| 6 | Split Maven into "GA" + "Client Adoption" projects | Jason/Jack | Clarifies exit criteria for a 12-month project |
| 7 | Verify CIBC contract status | Steven/Austin | Feb 1 target may be overdue |
| 8 | Assign INF CVEs (INF-993 through INF-998) | Steve | 6 unassigned security items |
| 9 | Get Worktree Cache (NXC-3806) unstuck | Jason | 2-month competitive gap vs Turborepo, overdue since Feb 13 |

### Before April

| # | Action | Owner | Why |
|---|--------|-------|-----|
| 10 | Create revenue coordination view for Q2 launches | Jack/Jeff | Three monetization tracks launching simultaneously |
| 11 | Populate May-June initiative in Linear | Jason | Currently empty, needs planning by mid-April |
| 12 | Resolve RBC Maven graph issue (NXC-3953) before pause | Jason | Don't lose only production Maven feedback loop |
| 13 | Establish project auto-close rule (all milestones 100% for 60+ days) | Jack | Prevents future long-running zombie projects |
