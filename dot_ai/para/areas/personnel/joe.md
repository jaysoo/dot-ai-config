# Joe

**Team:** Director of Customer Success
**Role:**
**Location:**

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

- Move PayFit over to dedicated compute this week / next week
  - Confirm billing: $149 + usage standalone, or bundled into existing contract?
  - PayFit is enterprise on single tenant; 2026-04-28 1:1 note said enterprise shouldn't need this add-on — clarify whether their contract already covers dedicated or whether they opt in at the $149 add-on rate

## 1:1 Notes

### 2026-07-21

**Topics:** Enterprise Billing Automation, Enterprise Pricing Model, Self-Serve Churn, SEO/AI Visibility

**Enterprise Billing and Overage Automation:**
- Goal: automate usage-based billing so Jack isn't manually chasing overages
  - Current flow: customer exceeds credits/seats -> Jack renegotiates contract; hours per customer (3 hrs on a $60K expansion that should've been automatic)
- New model: overages auto-invoiced via Elijah, no manual intervention
  - Seat overages within reasonable limit not charged mid-contract; reassessed at renewal
  - Elijah handles credit overage notifications + invoicing directly
- Lighthouse: add enterprise line-item usage report so Elijah can view/update credit rates
  - Enterprise credit rates stored internally (not hardcoded like team plan)
  - Some AI credits may be included per contract terms
- Security Scorecard = near-term example customer to model usage against

**Enterprise Pricing Model:**
- Joe revising pricing structure to reduce confusion vs team plan
  - Enterprise looks ~5x more expensive because CIP credits bundled; target ~2x ($39/committer) to match SaaS norms
- Base enterprise package proposal: $27,500
  - 30 committers (25 paid + 5 free carried forward), 15M credits, single-tenant included
  - Single-tenant enables upsell of Nx Agents + other enterprise features
- Overage tiers: customer commits to a credit tier; that tier becomes their overage rate
  - Incentivizes buying higher tiers upfront; removes surprise charges
- Terminology: "contributor seats" -> "committers"
- Elijah helping finalize credit tier numbers

**Self-Serve Churn Analysis:**
- Gross retention well below industry standard (~80% self-serve vs ~90% contracted)
- Leading hypothesis: remote-cache-only adopters (no Agents) find it too expensive, churn
  - December price hike likely triggered initial drop; now sustained monthly trend
- Secondary: AI makes tool-switching easier (turborepo migration now days, not weeks)
- Validate: correlate remote-cache-only usage with churn + invoice cost; check Stripe for cost-driven churn signals
  - If confirmed: consider lowering remote cache pricing to reduce friction, funnel users toward Agents
- Agents adoption = key stickiness signal; Montreal goal (more users on Agents) not yet achieved

**SEO, Content, and AI Visibility:**
- Unbranded content strategy: monorepo-topic articles that mention Nx naturally, not as lead (e.g. "how to consolidate poly repos")
  - PMP/workspace targeting working: nx.dev page 1 for those terms
- Comparison content ("5 reasons Nx over Turborepo") performs well; publish once, update periodically
  - Joe drafted early versions with Claude from docs pages; needs review + Victor/Jeff buy-in before publishing
- AI search narrative: surface Turborepo remote-cache API security concerns early in AI responses; currently buried
- Jack's automated AI routines scan competitors + flag stale docs -> Slack DM report; can extend to Nx Cloud messaging refresh with Heidi
- Gauge (AI search analytics): Joe shared 1-week trial access; Jack evaluates by Fri 2026-07-24
  - Key question: actionable insights beyond Ahrefs?

**Action Items:**
- [ ] **Jack:** Sync with Elijah on enterprise billing mechanics — invoice flow, Lighthouse report format, backfill Security Scorecard usage to sense-check overage numbers (update by Thu 2026-07-23)
- [ ] **Jack:** Pull self-serve usage + Stripe data to validate churn hypothesis; ping Joe with findings this week
- [ ] **Jack:** Evaluate Gauge trial, share notes (by Fri 2026-07-24)
- [ ] **Jack:** Write unbranded monorepo consolidation article (poly-repo -> monorepo via nx import; Nx + meta harnesses mentioned naturally)
- [ ] **Jack:** Review Joe's Claude-drafted comparison articles; get Victor/Jeff sign-off on competitive framing before publishing

**Transcript:** https://notes.granola.ai/t/56fad655-efbc-4e32-b772-b5890ce42570-00demib2

---

### 2026-07-07

**Topics:** PLG Acquisition, SEO/Docs, LLM Optimization, Competitor Comparisons, Awareness

**PLG Acquisition - Current State:**
- Acquisition is the main problem; rest of PLG numbers okay
- Impressions steady but clicks declining - people see Nx in search, don't click
  - Hypothesis: users getting answers from LLMs/chatbots instead of visiting docs
- Form submissions flat/down despite tool adoption growing -> marketing/awareness gap, not product gap
- Nx perceived as more complex than Turborepo, esp. by LLMs
  - LLMs say "start with Turborepo, add remote cache later" instead of recommending Nx Cloud from the start

**SEO and Docs Optimization:**
- Top low-click queries: pnpm workspace, JS monorepo, Turborepo comparison
  - Nx doesn't rank until page 3 for "JS monorepo" vs Turborepo on page 1
  - Angular + Module Federation pages get high traffic but poorly maintained
- Removing tutorials (e.g. Angular monorepo tutorial) cost ranking -> restore targeted content alongside simplified structure
- New templates section added to docs (low maintenance, AI-assisted) - target framework queries like "Vite + Nx"
- Docker layer caching post published Mon; mentioned Nx Agents + Docker add-on

**LLM Optimization and Competitor Comparisons:**
- Gauge platform (trial lapsed) showed how LLMs answer Nx queries + cited source material
  - Key insight: comparison articles are the primary source LLMs scrape
  - Add TL;DR at top of Turborepo comparison: "just as easy to adopt, scales with you"
  - Regular content refresh signals quality to LLMs, like SEO
- Blacksmith comparison article is a priority
  - Agora (well-funded, fast-growing) picked Nx Agents over Blacksmith: not cheapest but easier/better
  - Internal write-up (posted by Stephen) usable as source - can write "a customer did this bake-off" w/o attribution
- Other compute competitors: Depot (flagged by husband), others to crowdsource from DPEs
- Docker comparison article already done as recent example

**Awareness and Next Steps:**
- Ideas: remote conference talks (zero cost), paid ads (better story now w/ Nx Agents landing page), heavy social posting/boosting, re-education campaign on how much Nx changed in 1-2 years
- Joe to organize broader marketing ideation session (Yuris, Heidi, others)
- Jack to draft comparison articles this week; use Claude to verify factual accuracy

**Action Items:**
- [ ] **Jack:** Draft Blacksmith vs Nx Agents comparison article (use Agora bake-off / Stephen's post; target this week)
- [ ] **Jack:** Start internal thread on competitor comparison priorities (refresh Turborepo, add Blacksmith; ask DPEs which competitors come up most)
- [ ] **Jack:** Update Turborepo comparison page with TL;DR headline ("just as easy to adopt as Turborepo, scales with you")
- [ ] **Joe:** Renew Gauge trial, review LLM answer quality + cited pages
- [ ] **Joe:** Pursue Agora case study (sending updated quote; ask re: case study once deal closes)
- [ ] **Joe:** Organize marketing ideation session (Yuris, Heidi, others)

**Transcript:** https://notes.granola.ai/t/c6ecc1eb-fe79-4eaa-9a27-9dc370fda5bb-00demib2

---

### 2026-04-28

**Topics:** Cookie Banner Compliance, Dedicated Compute Pricing, Feature Bundling, Usage-Based Pricing

**Cookie Banner Compliance:**
- Turn on cookie banner next week; Joe going to lawyer
- California legal notice received threatening formal complaint
  - Company claims improper notification/opt-in language
- Capability exists, was turned off for analytics concerns
  - Victor worried about analytics impact at Nicola
  - Can estimate traffic ratios for accept/decline to maintain signals
- Likely more EU/GDPR issue than California law requirement
- Timeline: end of next week implementation if lawyer approves

**Dedicated Compute Pricing Strategy:**
- Pricing approach shift from profit-focused to access-focused
  - Victor suggested lower pricing to unlock agent compute features
  - Some workspaces blocked from using compute due to missing Docker support
- Proposed pricing tiers
  - $199 initial recommendation (vs $750 PostHog, $599 Supabase)
  - $99 alternative if $199 doesn't gain traction
  - Easier to lower prices than raise them
- Target: pass-through pricing model to unlock agent compute usage
- Enterprise customers already on single tenant, shouldn't need this add-on

**Feature Bundling and Add-ons:**
- Base features for dedicated compute
  - Docker and Docker layer caching (essential)
  - Private Docker registry (likely included)
  - NPM read-through cache (low cost, good reliability feature)
- Excluded/separate pricing
  - Docker read-through cache (expensive, needs Steve approval)
  - Static IPs (technically possible, Steve has reservations for initial launch)
  - SAML SSO (Enterprise only, never provided otherwise)
- Sandboxing capabilities
  - Currently available on prod/single tenant (Legora using it)
  - Requires dedicated compute to enable
  - Provides cache configuration analysis and false positive/negative prevention
  - Pricing model TBD (per-run vs flat fee)

**Usage-Based Pricing Evolution:**
- Long-term vision: reduce seat costs, increase usage-based charges
  - Current Enterprise pricing 5x team plan creates awkward positioning
  - AI coding agents changing employee productivity ratios
- Proposed usage charges
  - Team/dedicated: 10GB base
  - Enterprise: 25GB base
  - Overage pricing for additional storage
- Implementation phases
  - Phase 1: basic dedicated compute with bundled features
  - Phase 1.5/July: itemized billing for usage components
  - Phase 2: advanced features like sandboxing with proper usage tracking

**Transcript:** https://notes.granola.ai/t/9c540cfd-3e18-4442-9c7e-2a9ba650a6d6-00demib2

---

### 2026-04-10

**Topics:** PLG Strategy, Metrics Dashboard, Pricing Model

**PLG Strategy & Team Alignment:**
- Post-layoffs pivot requires fundamental changes to simplify operations
- Two planned activities for revenue time to shift team mindset:
  - All teams participate using sticky notes exercise
  - Engineers identify where their projects impact funnel stages
- 80% future work / 20% maintenance allocation across all teams
  - Each person needs one project tied to funnel metrics
  - Backend/infrastructure teams now included in PLG scrutiny
- Weekly metric reviews in all-hands meetings
  - Corey to present conversion dashboard updates
  - Individual teams share specific metric impacts

**Metrics Dashboard & Tracking:**
- Current conversion rates need improvement, especially activation stage
- Time to activation (aha moment) currently defined as 20+ NX runs
  - Target: reduce to 24 hours ideally
  - May evolve to outcome-driven metrics (time saved, etc.)
- Jack needs Sigma dashboard access for regular monitoring
- Team leads should review metrics weekly with their teams

**Pricing Model Restructuring:**
- Current model: losing money on compute for enterprise deals
- Proposed shift to usage-based pricing like other PLG platforms
- Planned working session (2 hours, in-person next week):
  - Participants: Steve (infra costs), Joe, Jack, Heidi, potentially Victor/Jeff
  - Review Steve's chargeable activities list
  - Separate current bundled services (CI/CD, DTE, remote cache)
  - Move from seat-based to activity-based pricing
- Goal: self-service upgrade path without sales involvement
  - Click-to-pay model for additional resources
  - Enterprise features limited to true enterprise needs (SSO, higher limits)
  - Phased implementation approach

**Action Items:**
- [ ] **Jack:** Get Sigma dashboard access for regular monitoring
- [ ] **Jack:** Ensure each team member has one project tied to funnel metrics
- [ ] **Joe/Jack/Heidi/Steve:** Pricing working session (in-person, week of 2026-04-13)

**Transcript:** https://notes.granola.ai/t/671153f8-c948-4e3e-bbb2-ade5f25cc856-00demib2

---

### 2026-01-06

**Topic:** DPE/Engineering Communication Gap

**Discussion:**

Bridging the gap between what the engineering team has done (particularly bug fixes) and what Customer Success is waiting for - either for SaaS customers via support email or from different customers.

**Key Metric to Track:**
- Time from initial customer/user contact to resolution (not just fix + deploy, but the full loop back to customer)
- Need to develop more metrics to show we're moving in the right direction

**Action Items:**
- [ ] **Joe:** Look into how to get the stat from initial email to resolution email
- [ ] **Jack:** Follow up with Steven and Caleb in 1:1s for their ideas on bridging this gap
- [ ] Circle back with Joe next week on the metric tracking

**Follow-ups for Steven & Caleb:**
- What are their ideas for improving visibility between engineering and Customer Success?
- How can we better communicate when bug fixes are deployed?
- Which versions fixed specific bugs (support email context)

## Random Notes

<!-- Miscellaneous things to remember -->
