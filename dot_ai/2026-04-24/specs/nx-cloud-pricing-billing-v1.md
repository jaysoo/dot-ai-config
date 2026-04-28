# Nx Cloud Pricing & Billing: Dedicated Compute Tier + Enterprise Migration

**Status**: Draft spec, developer-ready. Open items flagged for Steve and Joe.
**Author**: Jack Hsu (Product Lead, Quark-A team)
**Date**: 2026-04-24
**Target delivery**: Jun 15, 2026 (first public milestone, manual ops OK). Sep 15, 2026 (full self-serve automation).
**Revenue target**: +$10M ARR by Jan 31, 2027 (100% growth). Dedicated tier should add roughly $100K ARR in year one (~$8K/mo run-rate by EoY). The rest comes from enterprise migration (disk + add-ons), seat and credit expansion, and new enterprise deals.

---

## 1. Goals & non-goals

### Goals

1. **Stop the margin bleed** on existing Enterprise customers who get npm read-through, Docker read-through, Docker layer caching, sandboxing, dedicated compute, and disk storage for free today.
2. **Open a self-serve path** from Team tier to a new **Dedicated Compute** tier for non-enterprise customers. This unlocks +$10M new ARR.
3. **Decompose pricing** so capabilities are billed individually (flat access + metered overage) instead of hidden inside a flat Enterprise contract.
4. **Protect Enterprise revenue** with feature gates (SSO/SAML/audit/SLA) so high-value customers can't down-sell to Dedicated.
5. **Land by Jun 15, 2026** with manual provisioning and billing. Full self-serve automation by **Sep 15, 2026**.

### Non-goals

- Multi-region (EU, west). Post-launch.
- Automated cluster provisioning. Sep 15+, manual is OK at Jun 15.
- Commit-to-Consume billing for the _Dedicated_ tier. Line-item overage is fine for self-serve.
- Team stays as-is. Dedicated is a parallel offering.

---

## 2. Positioning & messaging

### Value proposition hierarchy for Dedicated Compute tier

1. **Reliability ("registry-outage resilience")**. "Your builds don't care when npm or Docker Hub goes down."
2. **Correctness via sandboxing guarantees**. Unique Nx angle, no competitor uses this framing.
3. **"No noisy neighbors"**. Dedicated GKE namespace and node pool, predictable performance. Borrowed from the Supabase Team tier.
4. **Credit overage savings**. Secondary upsell lever (10x Team allotment, cheaper overage rate).

### Closest competitor analogue

Supabase Team ($599/mo) is the only self-serve dedicated-infra tier in the market at mid-market price. Everyone else (Heroku Private Spaces, CircleCI Scale, Vercel/Netlify Enterprise, Railway Enterprise) is sales-led. Self-serve plus dedicated infra together is the differentiated position.

### Marketing frame

- Highlight features missing from Hobby and Team. "Enable via Dedicated" is the single CTA.
- Build in-product demos and guides for add-on features so buyers can self-educate before checkout.
- Landing page and pricing page should surface all three value props above, not just the "bigger tier" framing.

**Cross-functional**: marketing asset production, landing page copy, and sales enablement materials need an owner. Coordinate with Joe.

---

## 3. Tier structure (post-launch)

| Tier                                       | Price                                  | Seats                                  | Credits/mo       | Notes                                                                                                                  |
| ------------------------------------------ | -------------------------------------- | -------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Hobby**                                  | $0                                     | unlimited                              | 50k              | Unchanged                                                                                                              |
| **Team**                                   | $19/contributor/mo (5 free)            | 50 max                                 | 50k              | Seat expansion: $19/contributor/mo above 50.                                                                           |
| **Dedicated Compute** (new)                | **$499/mo per org** _(proposed, TBD)_  | 125 included, $15/extra contributor/mo | 500k             | Dedicated GKE namespace and node pool. Flat per-org access fee.                                                        |
| **Enterprise 2026** (new standardized SKU) | Starts $X/yr (volume-priced)           | Higher caps                            | Higher allotment | Same SKU list as Dedicated, with volume discounts and higher limits. SSO/SAML/audit/SLA/white-glove onboarding only here. |
| **Enterprise (legacy)**                    | Existing custom contracts              | Existing                               | Existing         | Migrated to Enterprise 2026 at renewal or via Red Zone mechanism.                                                      |

> **Sync with Joe**: final pricing anchor. $499 proposed. Alternatives: $399 floor, $599 Supabase match, up to ~$700 per Steve's bundle mid.
> **Sync with Steve**: validate 500k credit allotment, 125-seat cap, and 100 GB disk baseline are feasible and profitable at scale.

### What the Dedicated tier includes (bundled)

- Access to the dedicated GKE cluster (tenant-isolated namespace plus per-customer node pool).
- **npm read-through cache**: unlimited, bundled. Positioned as reliability, not perf.
- **Sandboxing**: 10,000 sandboxed CIPE runs/mo included. Overage charged per run. _Surcharge and limit TBD with Steve._
- **Disk storage baseline**: 25 GB included. Flat fee for extra disk (e.g. a 100 GB tier). _Baseline TBD with Steve, anchored to existing enterprise usage data._
- **Concurrent CI connections**: 30 included. Overage $2/connection/mo.
- **Credits**: 500k/mo included. Overage $5/10k.

### Add-ons sold on top of Dedicated (and Enterprise 2026)

| Add-on                        | Flat $/mo | Notes                                                                                                                       |
| ----------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Docker read-through cache** | $99       | Near-cost SKU. Sold as an upsell-to-Dedicated lever, not for margin. See Steve's open Q1 (mandatory vs. sold). **Sync with Steve.** |
| **Docker layer caching**      | $199      | High-margin (~70%+). Pure product value.                                                                                    |
| **Extra regions (EU, west)**  | TBD       | Post-launch, per Steve's delivery scope.                                                                                    |

### Credit surcharge on Dedicated-cluster workflows

Premium credit-rate on runs executed on the Dedicated cluster, applied as a credit multiplier rather than a dollar surcharge. Example: a CIPE that costs 10 credits on the shared cluster costs 11 credits on Dedicated (10% surcharge).

> **Sync with Joe**: multiplier rate (10% is illustrative). Calibrate against CircleCI credit rates for resource-class upgrades. Aligns with Steve's doc §4 "credits-per-minute premium" lever.

---

## 4. Seat overage paths

| Current tier    | Seats          | Overage path                                                                        |
| --------------- | -------------- | ----------------------------------------------------------------------------------- |
| Team            | 5 free, 50 max | $19/extra contributor up to 100, then force Dedicated at 100+                       |
| Dedicated       | 125 included   | $15/extra contributor/mo (below Team's $19 to prevent inversion at high seat count) |
| Enterprise 2026 | TBD            | Volume-priced per contract                                                          |

**Active contributor definition**: unchanged from current. "Any person or actor that has triggered a CI Pipeline Execution within the current billing cycle."

---

## 5. Enterprise migration strategy

### Grandfathering matrix (for existing Enterprise contracts)

| Feature                       | Bill existing enterprise? | Notes                                                                                                 |
| ----------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Disk storage**              | ✅ Bill                   | Biggest margin bleed. Move to overage billing at renewal or via Red Zone.                             |
| **Docker layer caching**      | ✅ Bill                   | High-margin SKU. Expect pushback. Respond with a one-time credit if the customer genuinely wasn't using it. |
| **Sandboxing runs**           | ✅ Bill with baseline     | Grandfather a 10k runs/mo baseline (matches Dedicated). Bill overage.                                 |
| **npm read-through cache**    | ❌ Grandfather            | Cheap to provide and saves Nx egress. Free forever.                                                   |
| **Docker read-through cache** | ❌ Grandfather            | Same logic as npm.                                                                                    |
| **Dedicated cluster access**  | ❌ Grandfather access     | They already have it. New bill lines come from consumables on top.                                    |
| **Compute credits**           | Status quo                | At negotiated rate.                                                                                   |

### Red Zone: mandatory-migration trigger (margin-based)

Margin threshold that flags enterprise contracts losing money in real time. Overrides the "wait until renewal" default.

| Band         | Threshold (COGS / contract $) | Action                                                |
| ------------ | ----------------------------- | ----------------------------------------------------- |
| **Green**    | < 50%                         | Auto-update at renewal, no outreach                   |
| **Amber**    | 50-85%                        | Proactive CSM outreach 60 days before renewal         |
| **Red**      | 85-100%                       | 90-day notice, mid-contract addendum with new billing |
| **Deep Red** | ≥ 100%                        | Emergency renegotiation                               |

> **Sync with Joe**: final threshold percentage bands. Coordinate with finance on the escalation workflow.
> **Sync with Steve**: per-customer COGS rollup pipeline (currently theoretical, see §7).

### Enterprise 2026 SKU (new standardized offering)

For new Enterprise sign-ups post-launch:

- Same SKU list as Dedicated (flat base + add-ons + overage rates) with volume discounts and higher included limits.
- Feature gates (Enterprise-only): SSO/SAML, audit logs, regional/on-prem deploy, SLAs, white-glove onboarding, priority support.
- Billing: annual commit, prepaid (see §7 commit-to-consume).
- No bespoke "everything is free" contracts. All line items are visible, even if volume-discounted.

### Down-sell protection (feature gate, not dollar floor)

Customers can't downgrade from Enterprise to Dedicated without losing SSO/SAML/audit/SLA. Compliance and operational features are the floor, not price.

- A $10K legacy contract down-selling to Dedicated is acceptable. The customer wasn't getting Enterprise value anyway.
- A $30K+ contract is protected. The feature gate prevents downgrade without material compliance and support loss.

### Communication plan

| Band           | Channel                       | Timeline                                        |
| -------------- | ----------------------------- | ----------------------------------------------- |
| Red / Deep Red | CSM + AE joint call           | Within 30 days of identification, 90-day notice |
| Amber          | Email + CSM touch             | 60 days before renewal                          |
| Green          | Renewal email with new terms  | Standard renewal flow                           |
| All            | Executive letter from CPO/CRO | Announcement wave at Jun 15 launch              |

> **Sync with Joe**: comm templates, CSM playbook, announcement letter drafting.

### Sales comp alignment

Account Executives need to be comped on usage and overage revenue, not just flat ACV. Otherwise they'll negotiate overage away to close deals.

> **Sync with Joe**: comp plan revisions. Product owns platform support. CRO owns revenue targets and sales handling.

---

## 6. Customer UX

### Awareness triggers (in-product signals that drive upgrade)

Ordered by confidence (hard data today to speculative):

| Trigger                                                 | Data source                                     | Pitch                                         | Jun 15?                              | Sep 15?                       |
| ------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------- | ------------------------------------ | ----------------------------- |
| Credit exhaustion (overage 2+ months)                   | Existing metering                               | "10x credits, cheaper overage"                | ✓ banner                             | ✓ banner + direct upgrade CTA |
| Approaching seat cap (40+/50)                           | Existing data                                   | "Grow to 125 seats, dedicated infra"          | ✓ banner                             | ✓ direct CTA                  |
| Registry errors in runs (npm 503, Docker pull failures) | Runner logs (confirm backend has this)          | "Registry-outage resilience"                  | ✓ if data exists                     | ✓                             |
| Cache correctness anomalies                             | Nx engine signal (confirm backend has this)     | "Sandboxing guarantees correctness"           | defer to Sep 15                      | ✓                             |
| Large cache or disk growth                              | Existing metering                               | "Cheaper disk, larger baseline on Dedicated"  | ✓                                    | ✓                             |
| Cluster contention or queue times                       | Hard to surface (leaks neighbor data)           | "No noisy neighbors"                          | skip self-serve, sales-assisted only | skip                          |
| Support tickets re: CI reliability                      | Pylon                                           | Sales-assisted nudge only                     | CSM-driven                           | CSM-driven                    |

### Upgrade and checkout flow

1. **Entry points**: contextual banner (triggered by the signals above), billing settings "Compare plans" CTA, marketing site `/pricing` to "Start Dedicated" button.
2. **Tier summary page**: what's included (checklist), limits, add-ons sidebar with a clear "add later" affordance.
3. **Configuration step**:
   - Seat count (default 125, stepper, shows $15/extra/mo above the cap).
   - Add-on toggles (Docker read-through $99, Docker layer caching $199) with "enable now" or "add later" buttons.
   - Workspace scope: whole org (no per-workspace config).
4. **Billing confirmation**: prorated line items for the current cycle, full monthly from the next cycle.
5. **Stripe checkout**: standard Stripe Subscriptions plus Metered Billing.
6. **Activation state**:
   - Pre-Sep 15: charge on checkout. Show "Provisioning your dedicated cluster, ready within 72h. You'll get an email when ready." No manual sales inquiry flow.
   - Post-Sep 15: automated provisioning, activation within minutes, status widget.
7. **Add-on enable/disable**: config-only (no infra provisioning delay assumed). Day-level proration.

### Downgrade flow

- Self-serve, one-click from billing settings.
- Immediate prorated refund for the current billing cycle. Overage already consumed is still billed.
- Tenant namespace deleted post-grace-period (24-48h?), cached data flushed, future workloads routed to the shared cluster.
- No 30-day notice. A fast off-ramp reduces buyer hesitation on upgrade. Transparent off-ramps raise upgrade conversion.
- Make the cancel button obvious in the UI. Don't hide it.

### Settings page and in-product surfaces

- Usage dashboard per billing cycle: current usage per metered dimension, projected bill, cycle-to-date overage.
- Add-on manager: list of add-ons, toggles, enable/disable with immediate effect and proration.
- Cancel/downgrade button, prominent.
- No hard-cap option in v1, alerts only. Breaking CI mid-build is unacceptable. Revisit with Steve if certain features (sandboxing, npm cache) can be throttled infra-side without breaking CI.

---

## 7. Metering requirements (backend handoff)

### Dimensions to meter

| Dimension                            | Unit                                                | Purpose                                | Cadence                | Aggregation   | New?                                                         |
| ------------------------------------ | --------------------------------------------------- | -------------------------------------- | ---------------------- | ------------- | ------------------------------------------------------------ |
| Active contributors                  | distinct user count                                 | Team + Dedicated seat overage          | Daily recount          | Billing cycle | Existing                                                     |
| Credits consumed                     | credits per run (with Dedicated multiplier applied) | All tiers                              | Per-run at completion  | Billing cycle | Existing + Dedicated multiplier (new logic)                  |
| Concurrent CI connections            | peak concurrent count                               | Team + Dedicated overage               | Real-time sample → max | Billing cycle | Existing                                                     |
| Cache disk GB-month                  | GB × hours / 720                                    | Dedicated + Enterprise disk overage    | Hourly sample          | Billing cycle | New, confirm with Steve                                      |
| Sandboxing runs                      | count of sandboxed CIPEs (one workflow / CI run)    | Dedicated + Enterprise sandbox overage | Per-CIPE at start      | Billing cycle | New                                                          |
| Docker layer cache I/O               | bytes served                                        | COGS attribution only (not billed)     | Per-request            | Monthly       | New                                                          |
| npm cache bytes served               | bytes                                               | COGS attribution only                  | Per-request            | Monthly       | New                                                          |
| Egress bytes (cross-zone + internet) | bytes                                               | COGS attribution, silent bleeder       | Continuous             | Monthly       | New, needs GCP network tags + attribution pipeline           |
| Compute node-hours (Dedicated)       | node-hours per customer pool                        | COGS attribution                       | Hourly                 | Monthly       | Derived from GKE scheduling, per-customer pool maps cleanly  |

> **Sync with Steve**: confirm per-customer egress attribution is feasible (GCP network tags on per-customer node pools plus processing pipeline). Confirm the dimension list is complete.

### Billing surface requirements

- Stripe Metered Billing emits usage records per dimension per customer per cycle.
- Stripe Subscriptions handles tier base and add-on subscriptions with native day-level proration on enable and cancel.
- Idempotency key: every usage record uses a `customer_id + dimension + window + source_event_id` composite key. Replayable without double-billing.
- Customer-facing usage dashboard: current cycle, projected bill, historical.
- Audit log: full charge history per customer, per dimension, per event. Required for enterprise billing disputes and SOC2.

### Commit-to-Consume billing (Enterprise 2026 only)

- Annual prepaid commit. Customer buys $X of credits/usage up front.
- Draw-down: usage accrues against the commit pool.
- True-up: at commit expiry, excess usage is billed at the contracted overage rate.
- Implementation: Stripe `credit_grants` if sufficient, otherwise a custom invoicing pipeline. Engineering commitment needed, probably Sep 15 rather than Jun 15.

> **Sync with Steve / backend team**: capacity to build commit-to-consume by Jun 15 (unlikely) vs. Sep 15 (plausible). Dedicated tier self-serve is line-item from day one. Enterprise 2026 uses commit.

### Red Zone detection

- Per-customer COGS rollup: monthly batch (Jun 15), live dashboard (Sep 15+).
- Alert when a customer enters Red or Deep Red. Email or Slack to CSM + CRO.
- Data inputs: GCP billing export tagged by customer + the metered dimensions above.

> **Sync with Steve**: per-customer COGS rollup pipeline design. Net-new work or building on existing finance attribution?

### Hard caps vs alerts

v1: alerts only, no hard caps. Breaking a customer's CI mid-build over a $50 overage is unacceptable.

Revisit with Steve. Features that can be throttled without breaking CI (e.g. npm cache pass-through with cache-miss fallback to public registry) are candidates for hard caps in v2.

---

## 8. Architecture & integration points

### Facade routing (no change needed at launch)

Per Steve's doc §2, the Dedicated cluster registers as another downstream controller behind the existing facade. Capability-based routing (Valkey sorted sets keyed by resource class) already supports the new cluster as a downstream. No net-new facade work needed for launch.

### Stripe integration

- Subscriptions for tier base and add-ons (flat monthly, day-level prorated).
- Metered Billing for overage (credits, disk, sandboxing, concurrent connections, seats).
- Customer portal for invoices, payment methods, downgrade.
- Webhooks for subscription lifecycle to the internal state machine (provisioning trigger, entitlement grant/revoke).

### Internal entitlement service

- Central source of truth for which customer has which tier, add-ons, and limits.
- Called by the facade and cluster controllers to enforce feature access (for example, "is Docker layer caching enabled on this workflow?").
- Updated by Stripe webhook handlers on subscription events.

### Provisioning (cluster onboarding)

- Jun 15: manual. Ops runbook, 72h SLA to the customer.
- Sep 15: automated. Terraform module + ArgoCD generator per Steve's doc §6 "not in scope for Jun 15" list.

---

## 9. Rollout plan

### Phase 1: Jun 15, 2026 (first public milestone)

**Must ship**:

- Dedicated Compute tier listed publicly with final price and feature list.
- Stripe subscription + metered billing for base, seats, credits, disk, sandboxing, and concurrent connections.
- Metering emission for all billing dimensions plus idempotency keys.
- In-app awareness triggers for credit exhaustion, seat cap (hard data), and registry errors (if the data pipeline exists).
- Checkout flow with the 72h manual-provisioning SLA state post-payment.
- Downgrade flow (self-serve, immediate prorated refund).
- Usage dashboard (per-cycle usage and projected bill).
- Enterprise Red Zone detection (monthly batch is OK).
- Executive announcement letter to existing Enterprise customers.
- Grandfathering matrix applied. Start billing disk, sandboxing, and Docker layer caching at renewal for legacy Enterprise. Immediate for Red Zone accounts.
- Credit multiplier applied to Dedicated-cluster workflow runs.

**Can defer to Sep 15**:

- Automated cluster provisioning.
- Commit-to-Consume billing for Enterprise 2026.
- Live (vs batch) Red Zone dashboard.
- Advanced awareness triggers (cache correctness signals, cluster contention).

### Phase 2: Sep 15, 2026 (full self-serve automation)

Ships:

- Automated cluster provisioning (Terraform + ArgoCD).
- Commit-to-Consume billing for Enterprise 2026.
- Live per-customer COGS dashboard.
- Cache correctness and sandboxing upsell triggers.
- In-app demos and guides for add-on features.

### Phase 3: Jan 31, 2027 checkpoint

Target: +$10M ARR (100% growth). Dedicated tier contribution roughly $100K ARR (~$8K/mo run-rate). The rest comes from Enterprise migration revenue capture, new Enterprise 2026 deals, and seat/credit expansion.

Minimum success: 3-5 Dedicated signups by the end of Phase 1. The first customer is expected to be a loss-leader per Steve's break-even math. The cluster scales to profitability past customer 5 on the mid-bundle scenario.

---

## 10. Success metrics

### Primary KPIs

- New Dedicated tier signups (count, monthly). Target 3-5 by Sep 15, 20+ by Jan 31.
- Dedicated tier ARR run-rate. Target $8K/mo by Jan 31.
- Enterprise COGS recovery $: dollar amount of previously-absorbed infra cost now billed at renewal or via Red Zone migrations.
- Net ARR growth toward the $10M target (broader than just Dedicated).
- Enterprise retention through migration: percentage of legacy Enterprise contracts that renewed post-migration without churn.

### Secondary KPIs

- Team to Dedicated conversion rate (percentage of Team customers exposed to upgrade triggers who convert).
- Self-serve checkout completion rate (upgrade page views to successful Stripe checkout).
- Add-on attach rate at Dedicated signup (percentage buying Docker layer caching or Docker read-through at purchase time).
- Time to activation (checkout to cluster ready). Track against the 72h SLA pre-Sep 15, under 5 minutes post-Sep 15.
- Overage revenue as a percentage of tier base revenue. Healthy ratio is 20-40%.
- Downgrade rate (percentage of Dedicated customers downgrading within 90 days). If above 15%, flag a pricing or value mismatch.

### Per-customer COGS dashboard (internal)

- Every Enterprise and Dedicated customer, monthly COGS attributed, flag bands (Green/Amber/Red/Deep Red).
- Alert on any account crossing into Red Zone.

---

## 11. Failure modes & mitigations

| Failure mode                                             | Likelihood      | Mitigation                                                                                                |
| -------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------- |
| Dedicated tier uptake < projected (< 3 signups by Sep 15) | Medium          | More in-app demos and guides. Bundle more add-ons into base. Consider a price cut with CRO. Ramp marketing. |
| Enterprise migration causes churn on $30K+ contracts     | Medium          | Feature gate prevents downgrade. CSM-led comms. One-time credits for goodwill.                            |
| Checkout self-serve completion < 30%                     | Medium          | A/B test checkout copy. Reduce configuration-step friction. Default more add-ons to "off."                |
| Docker layer caching billing startle (Enterprise)        | High (per user) | One-time credit policy documented and applied on request.                                                 |
| 72h provisioning SLA missed pre-Sep 15                   | High            | Automated provisioning ships Sep 15. Runbook staffing for the first 90 days.                              |
| Sandboxing 10k/mo limit abused                           | Unknown         | Infra can throttle (Steve input needed). Overage cost deters.                                             |
| Per-customer COGS attribution pipeline delays            | Medium          | Ship a monthly batch at Jun 15. Live dashboard at Sep 15 is OK.                                           |
| Hard-cap demand from customers                           | Medium          | v1 is alert-only. Revisit in v2 with Steve for throttleable features.                                     |

**Point of no return**: too many features sit behind free Enterprise grants today. Free-forever doesn't scale. Migration only fails if zero non-Enterprise prospects pay for Dedicated, which is implausible given Team-tier volume and the credit-limit and reliability complaints we already see.

---

## 12. Testing & verification plan

### Billing correctness

- Unit tests for every overage rate calculation (credits, disk, sandboxing, seats, concurrent connections).
- Integration tests: mocked Stripe to metering emission to invoice generation. Assert line items match expected.
- Idempotency tests: replay the same usage event, assert no double-billing.
- Proration tests: mid-cycle enable, disable, and downgrade at day 1, 15, and 30. Assert correct charge or refund.

### Entitlement enforcement

- Customer with Docker layer caching add-on: verify layer cache is enabled on their runs.
- Customer without Docker layer caching: verify the cache is disabled and not incurring COGS.
- Customer downgraded from Dedicated to Team: verify cluster resources are deprovisioned and workloads rerouted.

### Awareness triggers

- Synthetic customer hitting credit overage. Verify the banner appears in the UI.
- Synthetic customer hitting 40/50 seats. Verify the upgrade CTA.
- Ensure no false positives (customer below threshold sees no banner).

### Red Zone detection

- Synthetic customer with COGS > contract. Verify the alert fires to the CSM/CRO channel.
- Synthetic customer in the Green band. No alert.

### UX flows

- End-to-end Stripe checkout for the Dedicated tier. Automated Playwright test.
- Add-on enable mid-cycle. Verify immediate effect and prorated charge.
- Downgrade. Verify immediate refund and tenant cleanup scheduled.
- Verify no hard-caps fire in v1 (alerts only).

### Migration

- Dry-run migration tooling against staging fixtures: Green / Amber / Red / Deep Red test accounts.
- Verify the correct notice-period is triggered and the correct comms template is selected.

---

## 13. Cross-functional dependencies (aggregated checklist)

### Sync with Steve

- [ ] Validate metering dimension list is complete (§7).
- [ ] Feasibility of warm namespace pool for under 4h activation SLA at Jun 15 (§15.1).
- [ ] Per-customer GCP Network Topology labels on node pools from day one (§15.4).
- [ ] Quantifiable perf guarantees on Dedicated vs. shared (§15.7).
- [ ] Mid-run downgrade graceful completion behavior (§15.6).
- [ ] Confirm 10k sandbox runs/mo baseline (too high invites abuse, too low triggers overage complaints).
- [ ] Confirm 100 GB disk baseline, anchored to real enterprise usage data.
- [ ] Confirm 500k credits, 125-seat cap, and 30 concurrent CI connections are feasible and profitable at scale.
- [ ] Steve's doc open Q1: mandatory Docker read-through at $0 vs. sold add-on.
- [ ] Steve's doc open Q3: CI node-pool lifecycle (per-job ephemeral vs. capped-age).
- [ ] Steve's doc open Q5: hostname anti-affinity on core-infra (day-1 vs. deferred).
- [ ] Per-customer egress attribution feasibility (GCP network tags + pipeline).
- [ ] Per-customer COGS rollup pipeline (monthly batch by Jun 15, live by Sep 15).
- [ ] Throttleable features for future hard-cap support (sandboxing, npm cache).
- [ ] Backend capacity for commit-to-consume billing. Jun 15 or Sep 15?
- [ ] Provisioning runbook plus 72h SLA staffing pre-Sep 15.

### Sync with Joe

- [ ] Final Dedicated tier base price. $499 proposed, alternatives $399 / $599 / ~$700.
- [ ] Credit multiplier semantics on failed or retried CIPEs. Per-attempt vs. per-run (§15.2).
- [ ] Opaque multiplier vs. explicit resource-class publishing (§15.3).
- [ ] Credit multiplier rate on Dedicated cluster workflows (10% illustrative, calibrate vs. CircleCI and competitors).
- [ ] Red Zone threshold percentage bands (50% / 85% / 100% proposed).
- [ ] Sales comp plan revisions for usage and overage revenue.
- [ ] Enterprise 2026 volume discount bands and higher-limit targets.
- [ ] Enterprise contract floor messaging (feature-gate framing: SSO/SAML/audit/SLA only on Enterprise).
- [ ] Commit-to-Consume billing approval for Enterprise 2026.
- [ ] Docker layer caching billing pushback. One-time credit policy details.
- [ ] CSM playbook for Amber, Red, and Deep Red migrations.
- [ ] Executive announcement letter drafting.
- [ ] Marketing asset owner (landing page, in-product demos, sales enablement).

### Research / open items

- [ ] Market research for pricing anchor finalization (before Jun 15).
- [ ] Competitor credit-surcharge rates for dedicated/premium-compute workflows (Depot, CircleCI resource classes).
- [ ] Existing enterprise usage data to anchor disk baseline, credit allotment, and seat cap.
- [ ] Sandboxing cost input from Infra to validate the 10k run baseline.
- [ ] Dedicated tier final naming ("Dedicated" / "Pro" / "Scale" / other).

---

## 14. Open decisions

1. **Dedicated tier base price**. $499 proposed, final TBD with CRO and market research.
2. **Dedicated-cluster credit surcharge multiplier**. 10% illustrative, TBD with CRO and competitor research.
3. **Disk baseline**. 100 GB placeholder, TBD with Steve and enterprise usage data.
4. **Sandboxing baseline**. 10k CIPEs/mo placeholder, TBD with Steve.
5. **Credit allotment on Dedicated**. 500k placeholder, TBD with Steve.
6. **Docker read-through mandatory at $0 vs. sold at $99**. Steve's open Q1.
7. **Commit-to-Consume readiness**. Jun 15 or Sep 15 ship date, backend capacity dependent.
8. **Red Zone threshold bands**. 50% / 85% / 100% proposed, final with CRO and finance.
9. **Dedicated tier final name**. TBD.
10. **Enterprise 2026 volume-discount bands**. TBD with CRO.
11. **Downgrade refund policy**. Immediate-prorate (current choice, fraud risk per §15.6) vs. end-of-cycle default with optional immediate (safer). Jack call.

---

## 15. Additional notes

### 15.1 Provisioning SLA: "warm pool" to shorten 72h

- **Issue**: 72h provisioning feels enterprise-ish and undermines self-serve positioning. A customer who paid $499 at checkout expects activation in hours, not days.
- **Proposal**: maintain a warm pool of pre-provisioned empty namespaces and node pool templates. On checkout, bind the customer to a pre-warmed slot, live in under 4 hours.
- **Cost**: small baseline spend on idle namespaces.
- **Action**: **Sync with Steve**. Is a warm pool feasible for Jun 15? If so, update the §6 SLA copy to "within 4 hours" and update materials accordingly.

### 15.2 Credit multiplier semantics on failures and retries

- **Issue**: if a CIPE fails and retries on the Dedicated cluster, is the surcharge applied once (per logical run) or every time (per physical execution)?
- **Proposal**: apply per-task-attempt, matching how credits work today. Document explicitly, otherwise customers will call it double-billing.
- **Action**: **Sync with Joe + Steve** to confirm and document in the billing reference.

### 15.3 Credit multiplier vs. explicit resource-class pricing

- **Issue**: credit multipliers (10% surcharge via extra credits/CIPE) are opaque. The CircleCI model ("m5.xlarge = 20 credits/min, m5.4xlarge = 80 credits/min") is more legible.
- **Proposal**: consider publishing an explicit Dedicated-cluster resource class table mapping to GKE machine types (e.g. `dedicated-standard`, `dedicated-highmem`). The customer sees machine type and rate, not an opaque surcharge.
- **Tradeoff**: more transparent, but ties billing to specific machine types that may shift as Infra rotates SKUs (Steve's "re-price quarterly" note).
- **Action**: **Sync with Joe**. Is explicit resource-class pricing or opaque multiplier the preferred UX?

### 15.4 Egress attribution must start now

- **Issue**: GCP egress between zones and to the internet is a silent margin killer. Per-customer attribution requires GCP Network Topology labels on per-customer node pools today. If we don't tag at node-pool creation, the Sep 15 dashboard is retroactively blind.
- **Proposal**: Steve's cluster provisioning work should include per-customer network labels from day one, even if the attribution pipeline ships at Sep 15.
- **Action**: **Sync with Steve**. Confirm the labels are on the Jun 15 provisioning runbook.

### 15.5 Entitlement service in the hot path

- **Issue**: every CI run-start calls the entitlement service to check "does this customer have Docker layer caching enabled?". If latency is over 100ms, CI startup feels sluggish.
- **Proposal**: cache entitlements in Valkey (already present in the cluster architecture) with a 5-10 minute TTL. DB writes on subscription change invalidate the cache.
- **Action**: engineering detail. Note in the backend spec as a non-functional requirement. Not blocking spec sign-off.

### 15.6 Downgrade mid-run race plus refund-exploit risk

- **Issues**:
  1. A customer downgrades mid-CIPE. Does the in-flight workflow complete on the Dedicated cluster, or get rerouted mid-execution? Deleting the namespace on downgrade with long-running PR builds in flight is risky.
  2. "Immediate prorated refund on downgrade" is an exploit vector. A customer upgrades for a 2-hour usage spike, downgrades, and gets 28 days refunded. The standard SaaS pattern is end-of-billing-cycle downgrade (access stays until the end of the paid period, no refund).
- **Conflict with earlier decision**: user chose immediate-prorate to reduce buyer hesitation on upgrade. Fraud risk flagged in review.
- **Proposals**:
  - Mid-run: in-flight CIPEs on Dedicated at downgrade time finish on Dedicated. New CIPEs route to shared. 24-48h grace on namespace deletion.
  - Refund: offer two options in the UI. "Downgrade at end of cycle (keep access, no refund)" as default, "downgrade immediately (prorated refund, terminate now)" as the power-user flow. The default protects against the exploit. The immediate option stays available.
- **Action**: **Decision needed from Jack**. Accept the immediate-refund exploit risk (fast off-ramp for conversion wins) or switch to end-of-cycle default?

### 15.7 Dedicated must be _faster_, not only _isolated_

- **Issue**: Depot pitches raw speed. If Dedicated runs the same workflows in the same time as Team tier, $499 is a weak ask. "No noisy neighbors" alone is too vague.
- **Proposal**: alongside isolation messaging, publish concrete perf guarantees or benchmarks. "X% faster cold start," "Y% higher cache hit rate," "Z GB/s throughput to NPM mirror."
- **Action**: **Sync with Steve** to identify quantifiable perf wins on the Dedicated cluster (lower queue time, cache locality, warmer nodes) that marketing can anchor to.

### 15.8 Base-fee "double-dipping" perception vs. Supabase

- **Issue**: Supabase Team at $599 includes $10 of compute credits. Our $499 base plus separate overage bills feels like paying twice ("I'm already giving you $499 and _now_ I pay overage?"). The Supabase credit allowance softens this.
- **Proposal**: reframe the 500k included credits as a dollar-denominated allowance in marketing. "Dedicated includes $275 of monthly credit usage, 100 GB storage, and 10k sandbox runs. Overage applies past those caps."
- **Note**: the change is presentational, not structural. The spec already includes 500k credits. Marketing surface only.
- **Action**: marketing copy work. Coordinate with the marketing owner TBD (§2).

---

## Source references

- Steve's Dedicated Compute Cluster Summary (Notion): https://www.notion.so/nxnrwl/Dedicated-Compute-Cluster-Summary-34b69f3c2387811ca6e1fd3dd240a26e
- Current Nx Cloud pricing page: https://nx.dev/pricing
- Competitor positioning research (closest analogues): Supabase Team ($599/mo self-serve dedicated), Depot (self-serve usage-based builds), Heroku Private Spaces (sales-led dedicated).
