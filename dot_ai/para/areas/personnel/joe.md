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

## 1:1 Notes

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
