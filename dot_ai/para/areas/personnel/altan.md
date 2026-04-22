# Altan Stalker

**Team:** Quokka
**Role:** Team Lead, AI Czar
**Level:** L5
**Manager:** Jack
**Location:** Atlanta, USA
**Reports:** Louie, Rares
**Expertise:** Tracing, sandboxing, metrics, resource allocation

## Personal

- **Partner:**
- **Children:**
- **Pets:**
- **Hobbies:**

## Preferences

- **Food:**
- **Drinks:**
- **Restaurants:**

## Professional

- **Current Focus:**
- **Goals:**
- **Strengths:**

## Upcoming Sync

- Delivery of criticism around our onboarding focus — the recent framing was a bit harsh; worth softening the tone without losing the urgency
- Progress on DTE onboarding improvements

## 1:1 Notes

### Upcoming Topics

- Promotion to L6 in June — vsavkin will communicate to Altan first, follow up on how it went
- Follow up on Prometheus communication with Raresh and Caleb
- Sandboxing progress check (top priority)
- Ocean setup improvements - Rares as potential owner
- March cycle planning for Ocean dev setup
- **SPACE: Review Quokka planned/unplanned classification rules** — Current Quokka-specific rules inflate planning accuracy (93.2% vs 77.3% under standard rules). Two issues:
  1. Most misc-project issues lack DPE/Support labels so they count as planned. These should be unplanned:
     - https://linear.app/nxdev/issue/Q-318 — Gate heartbeat behind real CI detection
     - https://linear.app/nxdev/issue/Q-253 — Pentest: CI API Error Messages Expose Internal Class Names
     - https://linear.app/nxdev/issue/Q-282 — WaitingAgents should be backed by valkey
     - https://linear.app/nxdev/issue/Q-212 — Redisson + Netty Upgrade increased direct memory use
     - https://linear.app/nxdev/issue/Q-176 — Snapshot aggregator restarting
     - https://linear.app/nxdev/issue/Q-171 — nx-api memory leak investigation
     - https://linear.app/nxdev/issue/Q-112 — Concurrent modification bug with dteMap
     - https://linear.app/nxdev/issue/Q-102 — Heavy CPU workloads cause contention
     - https://linear.app/nxdev/issue/Q-98 — Empty transformed task graph (P2/High!)
     - https://linear.app/nxdev/issue/Q-35 — Aggregator hangs when mongo client fails
  2. No-project issues treated as planned. Some are clearly reactive/unplanned:
     - https://linear.app/nxdev/issue/Q-192 — Enterprise usage page blocks Clickup re-up (P2/High, DPE)
     - https://linear.app/nxdev/issue/Q-104 — Investigate agent idleness for Essent (P2/High)
     - https://linear.app/nxdev/issue/Q-43 — Mongo timeouts causing restarts (P2/High)
  - **Ask:** Should we simplify to standard rules (no project or misc = unplanned)? Or enforce labeling discipline? Also, many issues have no priority set — should that change?

### 2026-02-19

**CI/Scheduling Issues**

- 3 tasks not starting despite being ready, most agents shut down with only 2 remaining
- Tasks not running on extra large agent
- Recent whack-a-mole issues mostly resolved, fixes coming in upcoming PRs
- Ocean repo performing better than main repo
- NPM audit endpoint was down this morning, caused Ocean Sea breakage (NPM didn't report outage)

**Unplanned Work Review**

- Two high priority unplanned items identified this quarter
- Lighter load than September complaints
- DPE and support labeled issues should be marked high priority
- Items causing customer problems get escalated
- Need to mark additional DPE/support issues as high priority

**Prometheus Metrics Work**

- Engineering paused until customer feedback received
- Caleb already provided list of desired metrics from ClickUp and PayFit
- Two-part effort:
  1. January start - Raresh investigating if Prometheus is preferred channel
  2. Need commitment from customers to actually use the solution
- Current exposed metrics not final exhaustive list
- Service account integration needed (~1 day of work)
  - Change endpoint authorization method
  - Manual service account generation currently
  - Postman collection available for DPEs
  - Built functionality works but not productized
- Next steps: Follow up with Raresh and Caleb for communication effort

**Ocean Setup Improvements**

- Victor's feedback after returning from year off dev work
- Nicole has no time to fix everything (shouldn't be solely responsible)
- Nicole created pre-task execution hook for 1Password loading
- Victor wants: configuration-based runs, automatic snapshot pointing, clean switching between local/staging/snapshot environments
- Proposal: Dedicate couple days at start of March cycle
- Potential owner: Raw (less sales work than expected, fits DX improvement focus)
- Dependencies: Sandboxing needs to reach acceptable state first

**Planning & Project Focus Discussion**

- Jeff's email about engineering direction and company goals
- Need better connection between projects and revenue/customer impact
- Engineering team historically shielded from sales/revenue concerns
- 2025 project work generally had value but lacked outcome validation
- Required improvements:
  1. Tie projects back to measurable customer outcomes
  2. Connect work to POV pain points and feedback
  3. Validate intuition-based projects with success metrics
  4. Be ready to kill projects quickly if not working
- 10-20% of work can remain unscrutinized (technical/QoL improvements)
- CLI discussion dominated last planning meeting
- Future planning meetings need more fleshed-out proposals
- Customer requests and POV ties make stronger arguments for projects

**Action Items**

- [ ] Jack: Follow up on Prometheus communication with Raresh and Caleb
- [ ] Altan: Coordinate with Raresh and Jason on sandboxing (Altan out next week)
- [ ] Sandboxing remains top priority
- PayFit successfully using continuous assignment despite current issues

**Source**: [Granola notes](https://notes.granola.ai/t/381dcf69-52f4-4ac1-8aee-c6c5bfb496f4-00demib2)

### 2026-02-12

- Reporting structure and 1:1s
- Continue AI Czar discussion after Jack returns from Cancun
- Review progress on 2-3 key metrics identification
- Add misc board for quokka https://linear.app/nxdev/project/jan-feb-2026-misc-ba06f74d18a0/issues?layout=list&ordering=priority&grouping=workflowState&subGrouping=none&showCompletedIssues=all&showSubIssues=true&showTriageIssues=true
- Do the planning meeting before Altan is off

### 2026-02-05

**Tracing Feature Progress**

- Raj got tracing working on Snapshot
  - Successfully writing reads and writes
  - Infrastructure running properly
- Sharing example with Jason of all reads/writes being tracked
- Concerns about dogfooding due to poor repo state vs reality
  - Solution: Show off test files without permanent storage
  - Don't need 5,000 examples, just enough to understand patterns
- Moving forward on anomaly detection portion
- Expect high noise initially, will need trimming
  - Plan to warn properly first, then determine what to ignore by default
  - Users can configure ignoring of temp files from their own tools
- NX behavior showing interesting cache writes in child processes
- Feature naming settled on "sandbox" despite technical differences from Bazel
  - Go-to-market positioning: "eventually consistent sandboxing" vs Bazel's "strongly consistent"
  - Advantage: Won't kill process immediately on offending file read, allowing more iterations to debug

**Team Metrics & Project Management**

- Creating PR for metrics dashboard
  - Blue/cold data should be correct
  - Everything showing red due to Q1 comparison vs last year
- Miscellaneous board updated with support/DPE tags for proper tracking
- Need to add Cluster repo to tracking
- Allocation may need adjustment for Quolka and Orca to reflect reality
- Survey responses highlighting engineering pain points:
  1. Lack of clear expectations for performance reviews
  2. Confusion about priority changes (e.g., effective command work dropped)
  3. Gap in communicating what engineering is working on and its value
- Proposed solutions:
  - Quick wins and early validation before 3-month development cycles
  - Better communication when priorities change
  - Find customers using shipped features for feedback
  - Use AI to categorize Linear tasks by effort (5-minute vs 1-week tasks)

**Resource Allocation & Planning**

- Gradle plugin maintenance discussion
  - Currently unplanned work consuming significant time
  - Louie spending too much time on non-critical Gradle issues
  - New approach: Louie limited to 25% time on unplanned work including Gradle
  - Critical issues only, otherwise defer to CLI team
  - Consider dedicated "Polish week" if backlog builds up
- Planning meeting needed before end of February
  - Altan off last week of February, prefer scheduling in 2 weeks
  - Quolka team (Altan, Louie, Raj) to align on priorities and capacity before larger meeting

**Action Items**

- [ ] Add Cluster repo to metrics tracking
- [ ] Schedule planning meeting (before end of Feb, ideally in 2 weeks)
- [ ] Quolka team alignment on priorities before larger meeting
- [ ] Review allocation adjustments for Quolka and Orca

**Source**: [Granola notes](https://notes.granola.ai/t/dc1868c1-7293-4c25-8075-b858293cfc14-00demib2)

### 2026-01-12

- Script to produce weekly team updates
  https://github.com/nrwl/WeekInReview

### 2026-01-08

**Quoka Team Status:**

- Team performing well, kickoffs completed for all first projects
- Declaring bankruptcy on leftover Orca projects (reprioritized or changing hands)
- Real efforts begin next week; no major fires with new releases

**Tracing Project:**

- Key coordination between Rares, Craigory, and Jason
- Need 80% certainty on approach; deadline June 15-20th
- Milestones established, Craigory's team already started

**Team Performance Metrics (2026):**

- Five core metrics using SPACE framework:
  1. PR Throughput (monitoring post-layoff regression)
  2. AI Usage Efficiency (tokens vs output)
  3. Work Allocation (75% planned / 25% unplanned target)
  4. PR Cycle Time (P75 < 24 hours)
  5. P1 Issue Resolution (continue Linear tracking)

**Action Items:**

- [ ] Altan & Louis: Identify 2-3 key metrics for team (end of January)
- [ ] Add Jack and Victor to Quoka channel

### 2025-12-12

- Working on continuous non-cacheable DTE
- Ship these things but dogfood is slow
- Generally okay with Red Panda work but feels like he doesn't add much value beyond execution
- Would like some time to do team multiplier work

## Random Notes
