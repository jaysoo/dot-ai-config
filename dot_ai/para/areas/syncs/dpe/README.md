# DPE Sync Tracker

Tracking document for Developer Productivity Engineering (DPE) sync meetings.

## Active Accounts

| Account      | DPE       | Key Issues                                              | Status |
| ------------ | --------- | ------------------------------------------------------- | ------ |
| Microsoft    | -         | Inferred plugins perf blocking enterprise features      | ⚠️     |
| ProductBoard | Miro, JVA | Inferred plugins perf, semi-risky state                 | ⚠️     |
| Island       | -         | 15-20s slowdown, prev 23min graph creation              | 🔄     |
| Emeria       | -         | Blocked on continuous task architecture (Docker health) | ⚠️     |
| Crezco       | -         | POV failed - continuous tasks limitation                | ❌     |
| Paylocity    | JVA       | Can't access Claude directly (AI migration concerns)    | 🔄     |
| ADP          | -         | DTE failures - Gradle daemon locks                      | ⚠️     |
| ClickUp      | -         | IPO prep, cost cutting pressure, 10-25% churn risk      | ⚠️     |
| Gong         | -         | Using Turborepo, slow Vercel + Remote Cache             | 🆕     |

## Action Items

### From 2026-02-23 Sync

- **Team**: Validate Prometheus endpoint with customers — PayFit as starting point (already on production)
- **Team**: Fix plugin bugs before sandboxing customer rollout
- **Team**: Infrastructure setup for sandboxing (Raj documented in Notion)
- **Jason**: Explore benchmarking suite options for graph performance regression detection
- **Miro**: Get sync generator PR approved by Leo; splitting Picocli replacement PR
- **JVA**: Continue Paylocity upgrade analysis; AI migration documentation needed

### From 2026-02-09 Sync

- **Jack**: Ping Zack about ADP contract details and support strategy
- **Jack**: Follow up with Raj on metrics API completion status and documentation needs
- **Jack**: Create issue for Celonis transitive outputs performance problem
- **Jack**: Talk to planning team about DTE simulation tooling prioritization
- **Steven**: Add Jack to Atlas and Pilon demo calls
- **JVA**: Ping Jack about Paylocity environment variable issue for assignment
- **Miro**: Investigate Skyscanner TypeScript references sync issue
- **Zack**: Get config diff from ADP (month ago vs. current) to identify changes

### From 2026-01-26 Sync (Carryover)

- **Steven**: Create Linear issue for continuous tasks with customer requests
- **Zack**: Create reproduction and Loom for graph inconsistency issue

### Topics for Next Meeting

- JVA connectivity status after farm move (Verizon 5G)
- Tracing deployment status - Alton update follow-up
- ClickUp scaling limits - what's safe before infrastructure breaks?
- DTE simulation tooling prioritization (planning team discussion)
- Support tool update?
- How to communicate value (Caleb)
- Sandboxing: Gradle daemon process capture — any progress?
- Prometheus: PayFit validation results

### Upcoming Sync

---

## Meeting Notes

### 2026-02-23

**Attendees:** Miroslav Jonas, Austin Fahsl, Joshua VanAllen, Steven Nance, Caleb Ukle, Zack DeRose

**Sandboxing Feature Update:**

- Testing phase underway on Ocean and staging environments
- UI showing warnings for sandbox violations with task-level badges
- Go-to-market planning targeting March launch
  - Requires battle testing on both Ocean and NX first
  - Need to fix plugin bugs before customer rollout
  - Infrastructure setup required (documented by Raj in Notion)
- Technical limitations:
  - Requires latest NX beta (NX22 minimum for PID reporting)
  - Gradle daemon processes not currently captured
  - Works well for JS tooling, other tools may have issues
- Miro feedback: Would be valuable to detect external dependencies used by executors beyond just file I/O

**Prometheus Metrics Initiative:**

- Three potential customers identified: Casework, ClickUp, PayFit
- Major uncertainty: Unknown if customers can actually use current Prometheus solution
- Next steps require validation before additional development
  - Need to test if customers can consume the endpoint
  - PayFit suggested as starting point (already on production)
  - Amir interested, uses DataDog setup with post-task execution hooks
- Alternative considered: Raw endpoint data (rejected as too expensive/noisy)

**Performance & Development Updates:**

- Graph performance regression concerns
  - Jason exploring benchmarking suite options (synthetic testing)
  - Proposed: Cloud-side analysis tracking graph timings across CI runs
  - Steven emphasized need for percentage-based performance tracking vs absolute times
- Team updates:
  - Miro: Sync generator PR ready for Leo's approval, splitting Picocli replacement PR
  - Joshua: Paylocity upgrade analysis progressing, AI migration documentation needed
  - Playwright executor now supports cache directory specification for parallelization
  - Steven: Documentation updates ongoing

[Granola transcript](https://notes.granola.ai/t/61d6f2c3-06be-4638-b394-cc11b3b00465-00demib2)

---

### 2026-02-09

**Attendees:** Miroslav Jonas, Austin Fahsl, Joshua VanAllen, Steven Nance, Caleb Ukle, Zack DeRose, Jordan Powell

**Technical Issues & Hardware Setup:**

- JVA moving to Central PA farm this weekend
  - Verizon 5G network only internet option
  - May impact meeting attendance quality
- General hardware/driver frustrations discussed
  - Mac USB-C docking issues with cameras
  - Windows handles peripherals more reliably

**ADP Contract & Support Strategy:**

- Current contract: $183K → $225K renewal (225 people)
  - Renewal not until September
- Support approach: balanced effort vs. contract size
  - Help enough to avoid blocking/unhappiness
  - Don't over-invest given contract limitations
- Louis working on Gradle plugin issues for them
  - Few PRs here and there, not drop-everything priority

**Tracing Implementation Update:**

- Raj got tracing data flowing last week
- CPU/memory usage monitoring looks acceptable
- Plan to enable in NX Cloud and NX soon
- Latest beta includes all required components
- Alton providing update later today

**Support Tools Evaluation:**

- Steven leading demos with Atlas and Pilon this week
- Jack added to demo calls (30-minute intro sessions)
- Key requirement: Current tools like Waypoint lack APIs, causing workflow issues

**Customer Issues & Performance:**

- **Paylocity environment variable issue**
  - Testing environment variable fix for transpile/SWC errors
  - Multiple processes causing conflicts with Playwright directories
  - JVA hit "object object" error - needs investigation
- **Celonis transitive outputs CPU spike**
  - Massive CPU pressure when using transitive dependencies as inputs
  - 18 cores → 180 cores usage spike
  - Issue resolved by disabling transitive inputs
  - Leo investigating root cause
  - Only known customer using transitive outputs feature
- **Block Square socket closure PR**
  - Breaking Build Kite integration
  - Gregory approved, waiting on Jason review
  - Meeting with them today about enterprise value

**Strategic Initiatives & Scaling:**

- **Prometheus integration (Rares)**
  - Documentation and related work in progress
- **Metrics API endpoint status**
  - Supposedly wrapped up by Raj
  - Need clarification on completion status and documentation
  - Multiple clients interested in using it
- **ClickUp scaling challenges**
  - Requesting 10-minute CI with unlimited agents
  - Current bottlenecks identified:
    1. ~70-100 agent limit per cluster (workflow controller)
    2. Kubernetes disk provisioning can't keep up
    3. Docker hub proxy cache CPU spikes under load
  - Need to determine safe scaling limits before infrastructure breaks
- **DTE simulation capabilities**
  - Caseware burning 17 hours compute per PR in 10 minutes
  - 90% compute reduction achieved with DTE subset
  - Need tooling to simulate DTE impact before implementation
  - Could unlock revenue opportunities and reduce support cycles

**Development & Customer Work:**

- **UKG migration project (Zack)**
  - Stuck on NX15, requires custom patching for NX Cloud
  - Dependencies severely outdated (5+ years)
  - Working toward full migration in coming months
- **ADP cache integrity investigation**
  - Claims missing outputs in DTE runs
  - Sonar reports missing coverage dependencies
  - Using end-to-end encryption, limiting diagnostics
  - Leo/Jason working on potential NX fix
  - Started failing ~2 weeks ago, need config diff analysis
- **Skyscanner sync expectations**
  - Expected TypeScript references auto-addition
  - Current sync functionality not meeting expectations
- **Maven/Gradle polyglot testing**
  - JVA dogfooding real-world Syncster example app
  - Angular + Maven/Gradle integration issues discovered
  - Not customer-blocking, potential Polish Week candidate

[Granola transcript](https://notes.granola.ai/t/d3cde347-2113-4b4e-a147-132957497d37-00demib2)

---

### 2026-01-26

**Attendees:** Miroslav Jonas, Austin Fahsl, Joshua VanAllen, Steven Nance, Caleb Ukle, Zack DeRose, Jordan Powell

**Support & Communication Gap Solutions:**

- Jack & Nicole owning initiative to bridge communication gap between teams
- Need end-to-end traceability: Salesforce IDs → Linear tickets → deployment → customer follow-up
- Miroslav's 3-4 month support tool research ready - tools will hook into email + Linear for SLA tracking
- Issue prioritization: Medium priority needs due dates, earlier communication on won't-fix decisions

**Performance Issues with Inferred Plugins:**

- Critical customer impact blocking enterprise features
- Microsoft, ProductBoard in semi-risky state
- Island: 15-20s slowdown, previously 23min graph creation with multiple NX commands
- Miroslav proposing mixed performance team (CLI + core + DPEs)
- Need customer repo access for real-world testing - issues only surface at enterprise scale
- CodeSpeed initiative needs revival with baseline benchmarks and regression prevention
- **Action:** Jack to get answer from Jason this week

**Customer Migration Challenges:**

- Paylocity (JVA): Can't access Claude directly, only through Microsoft Copilot
- Year-over-year perception that migrations getting more difficult
- Clarification: Base migrations will never go away, AI enhances complex cases (Vitest, Storybook)
- Consider separating core NX migrations from framework-specific migrations

**Docker Compose & Continuous Tasks:**

- Multiple customers blocked on Docker health check support
- Amiria ready but blocked on continuous task architecture
- Crezco POV failed after multiple weeks due to this limitation
- Current architecture requires consumers to check task readiness
- Ready-when logic exists for other executors (parsing output)
- Customers unwilling to port Docker health checks to JavaScript
- **Action:** Steven to create Linear issue with customer requests attached

**Input/Output Tracing & Graph Inconsistencies:**

- Raj has working eBPF program for I/O tracing
- CI work needs completion by mid-week for snapshot/staging testing
- Graph visualization doesn't match affected command behavior (Zack)
- Workspace root inputs causing implicit affected logic not shown in graph
  - Crexi: TW .html being inputs to everything causing affected to mark everything as affected
  - FICO hit this problem as well
  - Things starting workspaceRoot marked as "global" files causing weird behavior
    https://github.com/nrwl/nx/blob/0137ea2dc918ed669caa08ec39347891afb2c880/packages/nx/src/project-graph/affected/locators/workspace-projects.ts#L95-L98
- Need better comparison of hash details of tasks to identify what went wrong (Legora, Island, etc.)
- **Action:** Zack to create reproduction and Loom demonstration
- ADP: DTE failures due to Gradle daemon locks, multiple Gradle processes on same agent
  - May need to prevent multiple Gradle processes on same agent
- **Action:** Zack to create Linear issue for Gradle plugin with customer context

[Granola transcript](https://notes.granola.ai/t/177b50cd-8cf9-48cb-9594-cbdade64feb9-00demib2)

---

### 2026-01-21 (from Docs sync - Caleb)

**ClickUp Account Issues:**

- Kyle (Principal Architect) pushing for credit forgiveness after causing system outage
  - Load tested agents, found limits, crashed control plane
  - Kept retriggering failed CI jobs on test branch
  - Wants refund for $10 spent during self-caused failure
- Context: ClickUp preparing for IPO, cutting costs aggressively
  - Kyle under pressure from VPs/directors to reduce spending
  - Different expectations between Kyle and his management
- Similar to GitHub outages but Microsoft can't be pushed around
- ClickUp doubled compute usage since February 2025
  - Still using old cost projections in calculations
  - Risk of switching away from agents (10-25% chance)
  - Would revert to self-hosted GitHub runners with manual DTE

**Value Communication Strategy:**

- Show time saved and cost saved as much as possible throughout product
  - GitHub comments after CI completion
  - Dashboard metrics showing concrete savings
  - Similar to Amazon Prime, Instacart, Uber Eats value messaging
- Survey teammates on if they understand value of Nx Cloud
  - Target people without high-touch support interactions
  - Understand if non-technical stakeholders grasp the value proposition
- Challenge: People forget pre-Nx Cloud performance once it becomes normal
  - DSG doesn't remember life before Nx Cloud
  - Need constant reinforcement of baseline comparisons
- Potential features:
  - Performance comparisons week-over-week
  - Leaderboards showing CI improvements
  - Early shutdown savings tracking

### 2026-01-12

- PRs to remind (Leo):
  - Block (talk to Jason)
    - https://github.com/nrwl/nx/pull/33562
    - https://github.com/nrwl/nx/pull/33572
- Talk to Jason about logging native logs
- ProductBoard
  - Miro's lockfile PR helps, but it's still slow
  - `package.json` name and version is being checked (Craigory)
- CPU tracking, rather than combined, also show per-core
  - Talk to Leo to see if we can get some data immediate
  - UI and backend changes might be needed
- ClickUp
  - Merging configs (Juri and Craigory)
- Fidelity asking about generator analytics
  - Likely relevant to out own effort
- Island not able to get cache hits locally
  - Lockfiles, git diff changes, etc.
  - ProductBoard as well
  - People are confused with cache misses
  - nxignore vs gitignore
  - Idea: maybe a brief explanation of why a cache is missed
  - Altan usually can help, auth is Chau
- Paylocity postcss
  - Annual success plan for this week (JVA)
- 7-11
  - Conformance is slow to run (30 seconds) -- appears to do nothing
- Gong using Turborepo (Miro)
  - Raise with Victor
  - Creating a document for Turbo vs Nx
  - Slow Vercel + Remote Cache

### 2025-12-15

**Updates:**

- PowerBI blockers are gone ✅
- ProductBoard (Miro and JVA)
  - Optimizations for lockfile needed
  - Affected graph output is slow
- Codspeed needs to be integrated for Ocean and CLI
- ClickUp
  - Gradle attached to root, and always busts cache
  - Need to improve cache hit rates
- Input tracing for January
  - The opposite of unused inputs or overly declared inputs
- Lockfile parsing has slowed down
  - Consider conformance rules for bad performance patterns
- Gong using Turborepo (Miro)
  - Creating a document for Turbo vs Nx
  - Slow Vercel + Remote Cache
- MailChimp average CIPE 2-4 minutes

**PR Reminders:**

- https://github.com/nrwl/nx/pull/33551
- https://github.com/nrwl/nx/pull/33562
- https://github.com/nrwl/nx/pull/33572
