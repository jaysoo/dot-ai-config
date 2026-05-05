# Backend Sync Tracker

Tracking document for Backend team sync meetings (Quokka).

**Attendees:** Altan, Louie, Rares

---

## Major Projects

### Billing Add-ons — ship 2026-06-01

3-week hard deadline. Resource class pricing aligned to GitHub Actions (1:4 CPU:RAM, 8-9% cheaper per compute unit). Priority order: private compute cluster ($199/mo prorated) → sandboxing reports (pay-per-use after included allocation) → resource utilization reports → agent storage allocation. Louie owns most implementation.

**Milestones:**
- **2026-05-11 (Mon)** — Testable on snapshot: interfaces wired end-to-end
- **2026-05-08 (Fri)** — All interfaces and backend wiring complete on test org
- **Week of 2026-05-22** — Billing integration testing on staging
- **2026-06-01 (Mon)** — Ship

Open: Steve/Patrick sync needed on private compute cluster notification flow (Slack/Linear/Lighthouse). Manual DTE restriction to Enterprise only — update docs and CI generators to default to agents.

---

## Meeting Notes

### Upcoming

- We may need API endpoint to check if a workspace is connected fully or not
- Enterprise customers that need metrics
  - https://linear.app/nxdev/project/enterprise-analytics-api-cleanup-73da7b8ab2e6/overview
  - Emeria is already consuming Prometheus

### 2026-05-04

**Attendees:** Altan, Louie

#### Billing Add-ons Project Overview

- 3-week hard deadline for new billing features (June 1st ship date)
- Resource class matching GitHub Actions pricing
  - Makes pricing at least competitive
  - New 1:4 CPU to RAM ratio (vs current suboptimal ratios)
  - 8-9% cheaper per compute unit than current pricing
  - GitHub charges $0.006/min, Nrwl currently $0.0055/min for equivalent RAM
- Priority features in order:
  1. Private compute cluster requests ($199/month, prorated)
  2. Sandboxing reports (pay-per-use after included allocation)
  3. Resource utilization reports (helps identify OOM issues)
  4. Agent storage allocation (small billing units, ~$200/month cost to company)

#### Implementation Details

- Private compute cluster workflow
  - User requests → webhook notification to Steve/Patrick's team
  - Manual provisioning initially, automation as fast follow
  - Need confirmation flow back to customer
  - Requires discussion with Steve/Patrick on preferred notification method (Slack, Linear, Lighthouse)
- Sandboxing reports billing
  - Easier implementation using existing data models
  - Count reports by workspace, bill after included allocation
  - PLG upselling opportunities at cache hit moments
- Resource utilization complexity
  - Decide if NX agents required or available for manual DTE users
  - No individual records currently exist (unlike sandboxing)
  - Edge cases: agent restarts count as one or two reports?
- Manual DTE restriction to Enterprise only
  - New workspaces blocked from manual DTE after rollout
  - Update docs, CI generators to default to agents
  - Docker caching should resolve main blocker for private compute

#### Next Steps

- **This week**: Sync with Steve/Patrick on private compute cluster workflow
- **By Friday (2026-05-08)**: All interfaces and backend wiring complete on test org
- **Week of May 22nd**: Billing integration testing on staging
- **Ongoing**: Weekly async Slack updates on blockers
- Louie handling most implementation work
- Test billing invoices using either NX org conversion or separate test org

[Granola transcript](https://notes.granola.ai/t/9f84cbf7-15f6-4908-8a43-830fb556e4b1-00demib2)

### 2026-02-02

**Attendees:** Altan, Louie, Rares

#### Project Updates & Status

- **Reverse Trial Billing** - Complete pending final email template in Mandrel
  - Madeline/Heidi want different experience than originally spec'd
  - Need fake live data in environment vs. what was built
  - Likely additional backend work required for March
  - Waiting on sales/CS input for customer demo experience
- **Enterprise Audit Log** - RBC received expiry notices for temp account
  - Following up this week for call/curl testing
  - Ready to close once tested
- **Continuous Task Assignment** - DTE benchmark harness showing positive results
  - 33-minute export from NX repo recreation
  - 23-25 agents tested locally with 6% variance between benchmark/reality
  - Next: Pull DTEs from larger customers for testing

#### I/O Tracing Progress

- **Current Status** - Signal file generation working on cloud runner
  - Tracking fork events through eBPF system calls
  - Generated 2000+ file access calls for Ocean package (mostly webpack/Node modules)
  - Successfully merged PR for buffer creation and task management
- **Technical Implementation**
  - Process tracking: Parent ID captured ✓
  - Inputs: Working ✓
  - Outputs: Not yet implemented (Gregory's PR needed)
  - End-to-end testing: Docker container validation successful
- **This Week's Milestone** - NX API endpoint creation
  - Analyze files and report anomalies to NX API
  - Deploy infra changes to Ocean for testing (memory impact on NX agent pods)
  - Go-to-market planning meeting scheduled

#### Blocking Items & Capacity

- **ADP Gradle Issues** - Louie pulled off effort work for pipeline fixes
  - Batch mode bugs patched, waiting for Jason's merge
  - Most issues appear self-inflicted (manual overrides)
  - Effort milestone pushed back few days
- **Gregory's Core Work** - Due tomorrow/Wednesday
  - Need outputs functionality in PR release
  - Required for full Ocean testing on all PRs
- **Team Capacity Notes**
  - Altan off last week of February (3 weeks effort work remaining)
  - Potential Wix POV starting (repo described as "mess" but good opportunity)
  - S&P POV in review stage post-security incident

[Granola transcript](https://notes.granola.ai/t/b1c43b27-8977-4854-9dd4-8ebee170d154-00demib2)

