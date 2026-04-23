# Steve Pentland

**Team:** Kraken
**Role:** L6 Engineer
**Manager:** Jack
**Location:** Welland(?), Ontario, Canada

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

### Upcoming Topics

**Reference: Infra Pricing / Chargeable Components (captured 2026-03-27)**
- Not to bring up directly, just context for future discussions
- Components to charge for (pricing page): CPU, Memory, Disk, Networking, Cache storage
- Other non-agent hosting costs (harder to align): Cluster charges, IP addresses, Certs, Buckets, Image repositories, Gateway uptime, Load balancers
- Value-Add Features: Docker Hub Read-Through Mirror, NPM Read-Through, Docker Layer Caching, Static IP Addresses via NAT, Private Network Connections, In-Project Custom Image Repositories (specifically custom agent images)
- Stability Additions: In-project Application Image Mirroring, Dedicated Infrastructure
- Note: pretty much every feature/stability addition is single-tenant focused


### 2026-04-23

**Dedicated Compute Cluster Project Update**
- Steve completed comprehensive documentation for dedicated compute clusters
  - Summary document: https://notion.so/nxnrwl/Dedicated-Compute-Cluster-Summary-34b69f3c2387811ca6e1fd3dd240a26e?source=copy_link
  - Consolidates 5 separate documents covering pricing, security, planning
  - Targeting delivery by June 1st
- Infrastructure components mostly ready
  - Small API changes needed in controller for org ID routing
  - Will use "compute routing key" instead of org ID terminology
  - Leverages existing multi-downstream work with minor edits
- Revenue projections per cluster
  - 55 total customers maximum capacity
  - $30-40k monthly margin even without usage billing
  - Additional usage charges when billing decomposition implemented

**Missing Components & Ownership Gaps**
- Billing automation and customer onboarding flow undefined
  - No mechanism for customers to opt into clusters
  - Temporary solution: manual process via support/email
  - Full automation deferred until after June 1st launch
- Project ownership unclear across teams
  - No single person responsible end-to-end
  - Victor focused on Polygraph until July 1st
  - Jack concerned about project falling to him given other commitments
- Need product team member to bridge infra and business requirements
  - Nicole potential candidate for ownership role
  - Someone must coordinate between Steve's infra work and app integration

**Strategic Context & Prioritization**
- Polygraph vs NX Cloud platform trade-offs discussed
  - Polygraph high-risk, high-reward (potential $10M+ ARR)
  - NX Cloud more predictable revenue stream with known customer base
  - Even 1% of user base paying would significantly improve company position
- Resource allocation challenges
  - Louis pulled in multiple directions between teams
  - Need clearer boundaries on unplanned CI work
  - Focus on delivering core billing functionality over feature work

**Next Steps**
- Jack will review documentation and provide feedback via Slack
- Steve sending summary to executives: Joe, Victor, Jeff, others
- Project ownership decision needed within next week
- Infrastructure team starting implementation tasks by end of month
- Patrick finishing sandboxing/AWS work before transitioning to cluster project

[Transcript](https://notes.granola.ai/t/1aebde9c-3080-48bb-9e22-b2b38f1b8f0a-00demib2)

### 2026-03-26

**Infrastructure Cost Management Challenges**
- Amir disk space issue escalated to Steve - customer expects free resolution
- Steve perceived Steve's response as hostile when asking "did something change?"
- Pattern: customers claim "nothing changed" then reveal changes after investigation
  - Wastes days of engineering time ($2-3k in labor costs)
  - Erodes margins on existing contracts
- Current reality: money no longer free, need actual profitability
  - Japan raised interest rates - free money era over
  - Must transition from "burn money" to conventional business management

**Pricing Strategy & Contract Issues**
- Need baseline pricing for Enterprise features on new pricing page
- Current gravy train contracts (ClickUp example):
  - Extremely cheap compute pricing - bad reference point
  - Every freebie becomes new baseline for contract renegotiations
  - Customers don't account for free additions when negotiating
- Steve to provide list of chargeable features:
  - Private networking, static IPs
  - NPM cache ($100/month)
  - Docker layer caching ($100/month)
  - Storage (customizable per resource class)
  - Multi-cluster capabilities

**Operational Boundaries & Expectations**
- Steve's role: keep systems running 24/7 + cost-effective operations
- Cannot authorize contract modifications or margin degradation
- Escalation path: pricing/contract decisions go to Jeff/Joe
- DPEs need to investigate before escalating:
  - Check recent changes in customer environment
  - Review logs with Claude/AI assistance
  - Traditional troubleshooting before assuming infrastructure issue

**Pentest Status & Security**
- Pentest fixes still pending completion this week
- Outstanding items mostly low severity - can accept some through pentest process
- Waiting on Nicole (returns next week) for final review
- Security email volume manageable after Microsoft false positive cleanup
  - Generic template now handles low-value submissions
  - Fixed DNS/header issues to reduce noise

**Technical Architecture Considerations**
- Current Kubernetes model showing limitations:
  - Can't offer true 4/16 runners (overhead reduces to 3/14)
  - Complex charging model due to resource sharing
  - $75/month cluster costs for limited actual usage
- VM-based architecture would provide:
  - Better resource visibility and charging granularity
  - Cleaner customer experience matching GitHub runners
  - Reduced operational complexity
- Gradual transition pieces already in development

**Customer Relationship Dynamics**
- Learned behavior: customers expect free solutions vs. self-investigation
- Need to incentivize proper diagnosis before escalation
- Current model creates unlimited downside risk with known upside (contract value)
- Goal: more harmonious relationships while maintaining fiscal responsibility

**Vacation Debrief**
- Jack's Galapagos trip successful despite severe sunburn
- Ecuador mainland stopover helped with flight connections

**Action Items**
- Steve: Provide Enterprise feature pricing list by end of week
- Jack: Update pricing page with new feature information
- Jack: Discuss cost management mandate with Victor/Jeff
- Steve: Complete remaining pentest fixes this week
- Ongoing: Establish clearer escalation expectations with DPEs

[Transcript](https://notes.granola.ai/t/e0726a29-49a8-4b86-a13b-a1561ba93a3f-00demib2)

### 2026-02-26

**Grafana Synthetic Monitoring Setup**
- NX Dev site migration from Vercel to Netlify causing regional access issues
  - Problems in California and other west coast regions
  - Edge node CDN timeout issues suspected
  - Redeployment on Netlify temporarily fixes problems
- Adding synthetic checks for better monitoring
  - California and Paris probes to be added for both nx.dev and docs sites
  - Cost impact minimal: $4 total for 2 additional probes per site
  - Alerting configured but needs verification for proper routing
- Jack's Grafana UI displaying incorrect metrics (5000% uptime, 12-minute latency)
  - Steve's interface shows normal 100% uptime and proper metrics
  - Browser/cache issue suspected on Jack's end
  - Will escalate to Grafana support team if clearing storage doesn't resolve

**Workflow Controller Refactoring Timeline**
- Library separation project remains in backlog, not scheduled for next cycle
- Steve predicts frustration-driven implementation
  - Likely to happen mid-next month when multi-cluster work becomes challenging
  - Pattern: research → implementation → roadblocks → late-night complete rewrite
- Backend team impact minimal
  - Won't require significant time allocation in March
  - Changes will be unilateral with clear ownership boundaries
- Motivation: separate ownership of log uploader and IO tracing components from core controller

**Infrastructure Improvements Shipped**
- Audit log enhancements now live
  - Larger display format for better visibility
  - Secret copying tracked via WebSocket (never enters page source)
  - Force logout functionality for all user sessions
- Security improvements
  - Secrets no longer appear in browser page source
  - Copy operations audited and logged
  - Addresses DPE security concerns
- Additional filters coming: user-based and action-based filtering

**Pylon Integration for Customer Success**
- DPE team adopted Pylon tool for support ticket management
- Linear integration maintains bidirectional sync
  - Engineering work stays in Linear
  - Customer issues filtered through Pylon first
  - Only engineering-required items escalate to Linear
- Knowledge base capability available but not yet implemented
  - Could reduce repetitive support questions (especially SLA inquiries)
  - Internal and customer-facing documentation possible
- Response time tracking now possible end-to-end
  - From customer email to issue resolution and follow-up
  - Addresses previous gap in support metrics

**Action Items**
- Jack: Debug Grafana UI issues, contact support if needed
- Steve: Configure California and Paris synthetic monitoring probes
- Steve: Create project for adding synthetic monitoring to new tenants
- Team: Begin using Pylon for customer support triage

[Transcript](https://notes.granola.ai/t/983b3a04-a55f-4ce2-bed1-6444167388bc-00demib2)

### 2026-02-05 (previous - Patrick L5 Promotion)
- **Patrick L5 Promotion:** Review and discuss Patrick's promotion justification doc
  - Key contributions: Grafana Cloud migration, cache poisoning vulnerability fix, cost analysis system, single-tenant operations
  - Observability SME for company
  - 20+ single-tenant deployments with near 100% uptime

## Random Notes
