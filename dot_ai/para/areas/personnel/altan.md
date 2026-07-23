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
- L6 promotion follow-up — did vsavkin's communication land? (slated June)

## 1:1 Notes

### 2026-07-23

**Enterprise Billing (Lighthouse)**

- Lighthouse view: line-item billing with editable credit rates (compute, CI credits, additional features)
  - Rates save to DB; zero-rate for unused items like sandboxing
  - Elijah needs monthly credit usage reports: credits used per month + cumulative since contract start
  - Existing credit usage report in Mongo may already cover this; needs alignment
- Altan: Lighthouse looks fine for the month-to-month overage billing use case

**AI Usage and Team Sentiment**

- General sentiment: clear value recognized, especially for work that would never get prioritized otherwise
- Concern: blurring of work/off-work boundaries as tools become always-accessible (SSH sessions, phone access)
- Altan's framing: effort-to-output ratio has shifted, which can make a productive day feel unearned
  - Large AI-generated PRs are hard to review; creates false confidence and nitpick-heavy back-and-forths (Nicole and Ben flagged)
  - Cloud team of 4 shipping more than the 8-9 person team in 2023
- Opportunity: reframe AI as an empowering tool for bolder ambitions, not just faster ticket throughput
  - POC-quality throwaway code is now cheap to produce; encourages exploration
  - Jason working with CRA team on AI-assisted code review at scale (Polygraph)
- Altan's idea: use Claude/Codex computer use on company Macs to seed test scenarios and record agent walkthroughs
  - Target: paper-cut issues that don't need full human code review
  - Screenshots and recordings attached to PRs; preview deployments for faster visual QA
  - Iterative, not a big project; create tasks to track

**Churn Analysis**

- Reviewed 47 churned orgs over the last ~2 months: usage patterns, features used, invoice trends
- Key churn signals identified:
  - Remote cache-only users or very fast pipelines (under 2 min, ~65% of runs) with high billing
  - Declining platform usage over time (likely already migrating off)
  - Very short tenure (only a few months on platform)
- Accrual case study: moved from Pro to Team, bill spiked, two support tickets (one unresolved hang with no logs), then churned
  - Altan found out only via proactive outreach; customer had asked an LLM to migrate them to Turborepo and Depot
  - Takeaway: compute is less of a lock-in than assumed; need earlier visibility into these issues
- Proposed interventions:
  - Triggered emails: low usage during onboarding, anomalous credit acceleration before invoice hits
  - Proactive support outreach when usage spikes detected, potentially offering free credits to investigate
- Altan: map every customer to a dollar-saved-per-hour ratio to expose where current pricing fails
  - CIPE unit cost flagged as the biggest PLG blocker: too easy to get a $300 bill for little value
  - Execution credits ~25% of ARR; cutting rates would hurt short-term but could reduce churn and drive uptake
  - Need to build the case (data + projections) before acting, to avoid paralysis but also avoid a blind cut
- Exit survey: Nicole already working on this (onboarding + exit survey questions, likely via Pylon)

**Action Items**

- [ ] Jack: Share churn analysis doc with Altan and Joe; flag signals that need counter-examples before deciding actions
- [ ] Develop dollar-saved-per-hour mapping across customer base to build the case for CIPE pricing changes
- [ ] Define churn-signal triggers for automated emails (low usage, billing spikes), then engineering implements cron-based outreach
- [ ] Altan: align Lighthouse billing report with Elijah's monthly + cumulative credit usage need (check existing Mongo report)
- [ ] Altan: create tasks for AI computer-use test-seeding / visual-QA experiment (iterative)

**Source**: [Granola notes](https://notes.granola.ai/t/21b122e6-d7bc-49cf-9c5b-40cf285e3763-00demib2)

### 2026-04-30

**Health Check & Team Dynamics**

- Jack recovering from illness, first clear-thinking day in a while
- DayQuil made symptoms worse instead of helping
- Chow moved near Altan's hometown (one exit away)

**Nicole's Concerns About Team Frustration**

- Nicole noticed Altan seemed frustrated during recent sync
- Worried it might be criticism of her work or Orca team
- Altan clarified frustration is systemic, not personal:
  - Team works "too safely" despite tremendous talent
  - Same conservative ideas after laying off 20% of company
  - Ambition should be much greater given team capabilities
  - Not blocked by people/talent, possibly by capacity
- Altan will reach out to Nicole to clarify and avoid misunderstanding

**Orca Experiments & Measurement**

- Current experiments section empty, waiting for concrete plans
- Jeff and Altan discussed yesterday, data pull needed in next 1-2 days
- Need more aggressive approach to failed experiments
  - Stop sunk cost fallacy of continuing failed initiatives
  - Abandon quickly when things don't work
- Sync meetings feel disorganized due to multiple departments
- Surprising lack of alignment on:
  - Current product state
  - How things currently work
  - Customer pain points
- Focus should be getting numbers up vs. over-measuring
  - Little historical tracking means no baseline for what influences metrics
  - Need to experiment first, learn quickly

**Billing Implementation Timeline**

- Lower landing page: simple button click, Steve provisions within 1 hour
- June 1st target date for billing changes
  - Mix of Altan and Louie handling backend work
  - Altan pushing more to Louie for his development
- Itemized billing considerations:
  - Must be part of June 1st design even if fast-follow
  - Metered storage will be easy to implement
  - Networking billing more complex, unclear how Steve wants to track
  - Disk usage straightforward (shows up like resource classes)
- UI work minimal, all handled by Orca team
  - Simple banners in app for opt-in
  - No cross-team coordination needed

**Pricing Strategy & Team Transitions**

- Dedicated computing as enterprise add-on:
  - Enterprise gets it bundled
  - Team plan users pay flat fee ($99-199, TBD)
  - Don't care about margins initially — focus on adoption
- NPM/cache likely free (low cost to provide)
- Rares bandwidth discussion with Joe about folding back into engineering
  - Transition planned after May (Caleb on leave/busy)
  - Will help with PLG motion and reduce back-and-forth on POVs

**Action Items**

- [ ] Altan: Create Linear tickets for billing work (tomorrow/weekend)
- [ ] Altan: Pull data for Orca experiments (next 1-2 days)
- [ ] Altan: Reach out to Nicole to clarify frustration context
- [ ] Team: More concrete deliverables needed for weekly syncs

**Source**: [Granola notes](https://notes.granola.ai/t/542007a6-a3fd-40ef-80a0-dddd56d35045-00demib2)

**Carry-over from prep topics:**

- Promotion to L6 in June — vsavkin will communicate to Altan first, follow up on how it went
- Follow up on Prometheus communication with Raresh and Caleb
- Sandboxing progress check (top priority)
- Ocean setup improvements - Rares as potential owner
- **SPACE: Review Quokka planned/unplanned classification rules** — Current Quokka-specific rules inflate planning accuracy (93.2% vs 77.3% under standard rules). Two issues:
  1. Most misc-project issues lack DPE/Support labels so they count as planned. These should be unplanned: Q-318, Q-253, Q-282, Q-212, Q-176, Q-171, Q-112, Q-102, Q-98, Q-35
  2. No-project issues treated as planned. Some clearly reactive/unplanned: Q-192, Q-104, Q-43
  - Ask: simplify to standard rules (no project or misc = unplanned), or enforce labeling discipline? Many issues have no priority set — should that change?

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
