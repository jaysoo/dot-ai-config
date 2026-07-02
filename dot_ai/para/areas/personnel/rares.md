# Rares

**Team:** Quokka
**Role:** L5 Engineer
**Manager:** Altan
**Location:** Scotland, UK

## Personal

- **Partner:** Mariana
- **Children:** Baby daughter (name?)
- **Pets:**
- **Hobbies:**

## Preferences

- **Food:**
- **Drinks:**
- **Restaurants:**

## Professional

- **Level:** L5 (promoted Jan 2026)
- **Current Focus:** 50/50 split between engineering and sales work; Quokka team (tracing project)
- **Goals:** Maintain fast NX repo pipelines, 70% planned / 30% unplanned work balance
- **Strengths:** Broad knowledge across app, backend, and infra; EU timezone coverage; PoV delivery; debugging enterprise issues

## 1:1 Notes

### Effy Reviews

Strengths:

- Innovative thinking for delivering PoV that sets a strong foundation for future partnerships (e.g. Skyscanner)
- Very helpful on the DPE side, and very autonomous
- Broad knowledge across the app, backend, and infra
- Only app SME in EU timezone, and helped mentor Szymon
- SME for private cloud
- Go-to for CI stability
- Skilled at debugging issues for enterprise customers, like git credential functionality
- Work is very thorough and lots of context provided
- Very responsive on Slack and emails (Andrew: most productive in EU at identifying and solving problems)

Most valuable contribution:

- Skyscanner and Legora
- Advocate for Docker Layer Caching and conducting performance analysis
- Ocean and Nx CI stability
- Enterprise Prometheus API
- Steven: EU DPE work, and partnering with Andrew to take some burden from Steven and Miro

Improvements:

- Keep making Looms, very helpful to understand different topics; very good at explaining things
- Continue with performnace improvements on the Quokka team
- Helping with some infra work/knowledge, especially since Szymon is the only person in EU

Others:

- Andrew: " Working with Rares has been one of the highlights of 2025."

### 2026-07-02

**New DP Engagements**
- Wix: setting up on-prem instance; product champion testing Nx on their main repo. Unusual setup but issue resolved quickly.
- Nedap (N-E-D-A-P), picking up this week. Already on Nx, custom billing strategy, single-tenant OK, bad CI times. Good candidate to migrate to Nx Agent using Altan's new prompt.

**ClickUp Performance**
- Restarts down ~90% since recent changes (peak was 22 restarts on June 26). Only 1 restart in 2.5 hours post this morning's deployment.
- CPU throttling still causing event drops. Daemon competes for resources with ClickUp's pods and is first to be throttled. ~2 billion eBPF events reach Go code per 30-min snapshot; these drive the spikes.
- Close events (~1/3 of all eBPF events) may be cuttable - used only to mark file descriptors closed. Rares will ask Fable to investigate.
- Broader question: diminishing returns on optimization. ClickUp may be over-resourced relative to what they're paying. Options: give daemon more CPU (costly, may still throttle), or accept degraded service. Worth tracking event volume on a normal workspace for comparison.

**Sandbox Enablement and On-Prem**
- Blog post on fixing sandbox violations on snapshot in progress (PR ready). Rares to ping people today; complements current pricing/enablement push.
- Funnel metrics look decent but conversion uptake below expectations. Friction-reduction ideas: in-app toggle to enable add-ons, go-links direct to org settings. PostHog session recordings useful for spotting user confusion.
- On-prem knowledge concentrated with Rares and JVA (helping Capital One with VM image). No smoke-test process exists for on-prem Nx Cloud binary before customer release. Worth adding a basic sanity check; no action taken for now.
- Rares off August 2-18 (wedding).

**Next Steps**
- Investigate dropping close eBPF events (Rares) - ask Fable if close events can be cut; could meaningfully reduce CPU load for ClickUp.
- Publish sandbox violations blog post (Rares) - ping reviewers today; PR is ready and supports the current enablement push.
- Track eBPF event volume on a normal workspace (Rares) - baseline comparison to understand how extreme ClickUp's load actually is.

Transcript: https://notes.granola.ai/t/352a2dc0-efdf-4c06-9a62-ad58775af219-00demib2

### 2026-04-24

**PLG Metrics & Team Structure**
- Core team expanded: Jack, Nicole, Corey, sometimes Joe and Heidi
- Focus on top-funnel: acquisition, activation
- Core team sets revenue targets, presents at all-hands
- Teams get projects tied to specific funnel stages (onboarding, activation optimization)
- No individual contributor metrics — teams track collective metrics
- Future: feature-specific activation tracking once revenue impact clearer

**Activation Rate Challenge**
- Current claim rate: 2.2–2.5%
- Target: 4.5–4.7% to hit yearly goal
- Need 550 additional claimed workspaces before next fiscal year
- High-quality orgs (5+ projects) more likely to convert and pay
- Activation up YoY, but quality-org acquisition needs work

**Feature Development & Usage Tracking**
- All new features must show actual usage + tie to revenue conversion
- Manual resource metrics upload example: Rares fixed critical UX bug (file disappeared on browser refresh) — 2hr fix with Claude after spotting it in customer support
- Track: who uses features + successful usage patterns
- Add more telemetry/PostHog to kill blind spots

**Sales Support vs Product Focus**
- Rares covering 3–4 POVs this week due to Jack's inbox chaos
- Also covering for Steven (out) on Lara and other accounts
- Transition: reduce Rares' sales support, shift focus back to Quokka team dev work
- Smoother self-serve onboarding should cut support burden
  - Surface existing knowledge/tooling (cache optimization, etc.) in user dashboards
  - Proactive suggestions when issues detected
  - More scalable than hiring more support

**Action Items**
- Jack: sync with Joe bi-weekly on work allocation
- Rares: get Sigma dashboard access (ping Corey if needed)
- Continue current sales support during transition
- Weekly top-level funnel reviews planned
- All team experiments/efforts transparent — no surprises at all-hands

---

Chat with meeting transcript: https://notes.granola.ai/t/0d7a2618-9696-4b09-855c-343fead28280-00demib2

### 2026-02-26

**eBPF Sandboxing Progress & Customer Issues**
- Past two weeks focused on eBPF sandboxing feature development
- New process tracking capability completed
  - Shows which process wrote/read specific files
  - Helps identify why certain files are accessed (e.g., project graph JSON)
  - Addresses J and Gregor's debugging requests
- Plugin configuration issues blocking customer rollout
  - Need Jason's assessment of current problems this week
  - Plan: Fix all plugins over next 1-2 weeks before external testing
  - Timeline: ASAP March launch, potentially April if issues arise
- Workflow controller cleanup planned for April
  - Too many components in same container causing permission confusion
  - Infra team to own workflow controller, separate other components
  - Duplicate shared utils rather than maintain dependencies

**Sales Pipeline & Customer Development**
- Wix POV started and showing strong promise
  - Frontend team using Bazel but nobody likes it
  - Built internal CI tool with NX-like concepts but poor performance
  - Major pain point: flaky tests requiring full job restarts
  - Interested in granular re-runs capability
  - **Deadline: Results needed by Friday next week**
  - Risk: Main contact leaving for France business trip
- Jest sharding requirement from multiple customers
  - Essent abandoned POV due to lack of sharding (Miro has utilization screenshots)
  - Wix also needs sharding for ~3,000 test files
  - Need Jason's decision on official sharding support
  - Related issue: Large task graphs causing DTE performance problems (Emeria example)
- Andrew collaboration ongoing for customer outreach and workspace analysis

**Action Items**
- Jack: Get Jason's assessment on plugin issues and Jest sharding decision
- Jack: Follow up on Prometheus metrics with customers (Stephen, Miro, Caleb)
- Rares: Continue eBPF development while remaining available for I/O tracing support
- Team: Coordinate with go-to-market team (Heidi, Madeline) before launch

---

Chat with meeting transcript: [https://notes.granola.ai/t/e9749c84-b16c-4b8c-9d34-c119a0641e89-00demib2](https://notes.granola.ai/t/e9749c84-b16c-4b8c-9d34-c119a0641e89-00demib2)

### 2026-01-29

**Performance Reviews & L5 Promotion**
- Reviews overwhelmingly positive with specific, applicable feedback
  - Reviewers knew his work well, covered major projects
  - Andrew (Skyscanner): "Working with Rares was highlight of the year"
- L5 promotion confirmed and processed
  - Updated promotion document same day
  - Expressed gratitude for Jack and Nicole's support

**2026 Role Structure & Responsibilities**
- Maintaining 50/50 split between engineering and sales work
- New ownership areas for L5+ level:
  - NX repo became slow this week, needs investigation
  - Focus on maintaining fast pipelines for team productivity
  - 70% planned work, 30% unplanned issues/requests
- Quokka team formation working well
  - Alton very supportive and efficient in new lead role
  - Good design discussions and API improvement focus
  - All three members (Rares, Louis, Alton) aligned on work

**Current Workload Balance Challenges**
- Heavy sales demands this week conflicting with engineering milestones:
  - Anna Plan POV support during EU hours
  - Miro/Essent POV finalization
  - Legora handover to Steven
  - WIX business case development with Andrea
- Tracing project delays due to:
  - Design changes and legal complications
  - Sales work taking priority over weekly engineering commitments
- Agreed approach:
  1. Prioritize sales when deals at risk or high urgency
  2. Ask key questions: What happens if not done? Who else can do this?
  3. Implement time-blocking constraints (e.g., dedicated engineering days)
  4. Maintain ~50/50 balance over time, allow short-term fluctuations
- Action items:
  - Rares to discuss capacity planning with Joe today
  - Miro taking over Essent work to free up Rares for milestone completion

## Random Notes

- (2025-12-11) Getting married to Mariana in August 2026 in Crete, Greece - Jack planning to attend
