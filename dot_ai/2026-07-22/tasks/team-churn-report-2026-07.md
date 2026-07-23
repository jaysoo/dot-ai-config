# Team Plan Churn Analysis - May-Jul 2026

Analysis of organizations that cancelled the Team plan over the last three billing cycles. Sources: prod Mongo (`billing.billingRecords`, `cloudOrganizations.planTransitions`, `analytics.dailyProductUsage`, `ciPipelineExecutions`) joined with Stripe invoice export. Query set and method: `team-churn-mongo-queries.md` (same folder).

## Headline numbers

- **47 orgs churned Team -> Free**: 17 (May 1), 18 (Jun 1), 12 (Jul 1). Steady ~15-16/month within the window, no spike month. All went TEAM_TO_FREE (none direct-to-disabled); all received a final invoice.
- **~$18k/mo churned MRR (~$215k annualized)**. $138,315 total paid by these orgs over the trailing 12 months.
- **Revenue is concentrated**: top 10 orgs = 80% of the $138k. Bottom ~25 orgs average under $50/mo. Churn count overstates the problem; dollars sit in ~10 accounts.
- **$2,775 left unpaid** (Finni $1,596, outfox-ai $779, 4 others small).
- Caveat: 3 monthly data points only. Churn RATE (vs active Team org count) and 12-month baseline not yet measured - see Open Questions.

## Churn segments

### 1. High-value leavers - price/competitor, not a value problem

Left while getting large, measurable value. Not recoverable by onboarding; these are pricing/competitive conversations.

| Org     | Avg $/mo | Saved hrs/mo at churn | $ per saved hr | Cache hit |
| ------- | -------- | --------------------- | -------------- | --------- |
| qawolf  | $2,725   | 10,895                | $0.25          | 91%       |
| talview | $1,270   | 3,051                 | $0.42          | 81%       |

qawolf saved ~10,900 compute hours in its final month and cancelled anyway. Neither ever used managed compute (0 compute credits, all periods) - cache-only, self-managed runners. (archax-org was initially in this segment; reclassified to bill shock below once its month-by-month invoices were pulled.)

**qawolf counterfactual (what cancelling costs them)**, computed from their own June cache-miss durations in `analytics.dailyTaskStatistics` (remote hits re-run at each task type's measured miss duration; local cache kept since it is free Nx): 6.15M CI tasks/mo at 91% hit rate, ~843 tasks per CIPE. With Cloud: 18.9 min serial compute per CIPE at ~4.5x observed parallelism = 4.2 min wall. Without Cloud: **81.8 min serial compute per CIPE (+7,648 compute hrs/mo, 4.3x)**.

The compute number is the robust claim - it does not shrink with parallelism (parallelizing moves it from wall time into runner count). Wall-time impact is an estimate: **~15-18 min on current infra; ~7-10 min with realistic re-parallelization (floor ~5 min from dependency-chain critical path)** - still 2x+ slower, plus a bigger runner bill.

Assumptions and caveats:

- **Parallelism**: 4.5x is observed utilization with cache, not capacity. Idle cores, a higher `--parallel`, or more matrix shards would absorb some of the extra work.
- **Runner hardware and cost unknown**: dollar figure (~$3.5-4k/mo) uses GitHub-hosted rates. On faster/cheaper runners (Blacksmith, self-hosted, etc.) the same extra hours cost less and run faster.
- **Toolchain migration**: miss durations are June's tools. A move to faster tooling (oxlint/oxfmt/oxc, vite, etc.) makes uncached tasks intrinsically faster for free and shrinks the counterfactual.
- **Behavior held constant**: without cache they would likely restructure CI (stricter affected scoping, fewer full-graph runs), reducing real impact below the naive estimate.
- **Averages**: 4.2 min is mean wall (p90 is 7.3); the counterfactual mean hides a worse tail.

Even at the generous end, cancelling trades $2,725/mo for materially slower CI or a larger runner bill - the exit interview should find out which trade they actually made (competitor cache, faster tooling, or nobody ran the numbers).

### 2. Wind-downs - migrated off, subscription was a leftover

Usage collapsed months before the cancel. The cancellation is a lagging indicator; the loss happened earlier.

| Org          | Peak saved hrs (90d pre-churn) | At churn | Contributors |
| ------------ | ------------------------------ | -------- | ------------ |
| Dispel       | 1,458                          | 0        | 40 -> 2      |
| AgriWebb     | 925                            | 3        | 37 -> 4      |
| sharethrough | 280                            | 1        | 21 -> 7      |
| contextfab   | 346                            | 0        | 14 -> 5      |

Question for these: where did they go (new CI, competitor, layoffs)? Data cannot answer; CS/exit interview can.

### 3. Price-shock / thin value - "paying Team rates for <2 minute pipelines"

High $ per saved hour, high share of sub-2-minute pipelines, often short tenure. The hypothesis holds.

| Org           | $/mo   | $ per saved hr | CIPEs <2min | Tenure    |
| ------------- | ------ | -------------- | ----------- | --------- |
| gto-wizard    | $1,782 | $13.7          | 66%         | 1 period  |
| Stirlingshire | $873   | $7.6           | 15%         | 3 periods |
| Evoluncite    | $415   | $14.5          | 21%         | 3 periods |
| outfox-ai     | $318   | $20.4          | 60%         | 3 periods |
| Hexweavers    | $188   | $29.8          | 75%         | 2 periods |
| zwizzly       | $134   | $14.7          | 65%         | 7 periods |

**Bill shock is a measurable trigger**: 8 orgs cancelled right after an invoice spike vs their own median - talview 4.0x, Finni 6.6x, zwizzly 12.6x, GebouwAssistent 16.3x, ShopVision-ai 2.5x, processfocus 2.1x, Warnerware 4.6x, qawolf 1.5x. Growth (usually contributor count) -> invoice jump -> immediate cancel. The final-vs-median detector also undercounts: archax-org's shock was mid-history (below), invisible to it.

**Case study: archax-org - feature-adoption bill shock, not a leaver.** Month by month (invoice bills prior month's usage):

| Usage month | Invoice | Contribs | Exec credits | Compute (agents) | AI credits |
| --- | --- | --- | --- | --- | --- |
| Mar | Apr 1: $512 | 18 | 585k | 0 | 0 |
| Apr | May 1: $2,708 | 23 | 1.94M | 1.48M | 604k |
| May | Jun 1: $3,120 | 27 | 2.19M | 1.62M | 583k |
| Jun (on FREE) | - | 10 | 50,000 (= free cap) | 0 | 0 |

They turned on Nx Agents AND self-healing AI in the same month; the invoice jumped 5.3x ($512 -> $2,708) with no warning, hit $3,120 the next month, and they cancelled. June on Free shows them **still active and pinned at exactly the 50k free-credit cap** - rate-limited, not gone. Top win-back: 10+ active contributors, demonstrated appetite for agents + AI, choked on a 6x bill in 60 days. Product lesson: the trigger is **feature adoption without a spend preview** - show a cost estimate when agents/AI are enabled (or default to a soft cap), not just after the invoice lands.

### 4. Forced upgrades that never saw value - cache never hit

Cache hit rate under 20% at churn: Signivo (5%), KLR-Bus (7%), GebouwAssistent (1%), Stirlingshire (19%), contextfab, Phazebreak-Coatings, Travis-Waith-Mair, Suhyl, fkdldkRhya (~0%). Caching is on for every plan, so a low rate means cache hits never happened for their workload: unstable task inputs, every-commit-affects-everything repo shape, or too few repeat runs.

Why they paid anyway: free-tier gates, not perceived value. Most added billing within DAYS of creating the org (Stirlingshire and contextfab same-day, Signivo +4d, Phazebreak +3w) - they hit the free limits (5 contributors / 50k credits), paid to unblock CI, the payoff never materialized, and they cancelled a few cycles later.

Zombies (near-zero usage AND near-zero invoices, since Team billing scales with contributors/usage): IglesiaCucuta (9 periods, all $0 invoices), YourPower ($23 total), fkdldkRhya ($9). Not revenue loss - plan-flag hygiene.

## Feature adoption among churners

- **Managed compute (Nx Agents)**: 15/47 ever consumed compute credits; only 7 in their final period. Sustained users: sharethrough (12/12 periods, 18.1M credits), nx@kenzz.com (10/12, 5.3M), archax-org (3.1M). 32/47 never used it. (Note: `dailyProductUsage.agentsEnabled` is the `enableManagedAgents` feature flag, not usage - it reads false for all 47 and is misleading.)
- **Self-healing AI**: 7/47 ever consumed AI credits.
- Majority of churners are cache-only customers. Hypothesis (needs control group): multi-feature adoption predicts retention.

## Post-churn state (as of 2026-07-22)

- 42 on Free, enabled. 2 disabled for delinquency (Finni, outfox-ai). 2 disabled for EXCEEDED_FREE_PLAN_INCLUDED_CREDITS (Evoluncite, DevPraxis) - **still heavy users, hottest win-back targets**.
- 1 already won back: EVA (orgId `6470b443632b5d000d3295ae`) churned Jun 1, re-added billing Jun 3, back on Team. Healthy profile: ~7-9 contributors, ~$179/mo, 438 saved hrs/30d at 83% cache hit, 13.5 min avg tasks. Notable: first-ever agents usage (12,420 compute credits) in the June period, immediately after the win-back - 12 prior periods had zero. Churn -> save -> feature expansion in one motion. Also a slow starter: first 3 periods (Aug-Oct 2025) had zero usage before value clicked.

## Action items

1. **Exit interviews / win-back outreach** on segment 1 (qawolf, talview) - they left with strong ROI; find out what beat us (price, competitor, platform change).
2. **Win-back now**: archax-org (bill-shocked, still active, pinned at the free-credit cap - offer capped/ramp pricing), Evoluncite + DevPraxis (disabled on free tier for exceeding credits - they still need the product), gto-wizard (high spend, 1 period, likely bill shock + misconfigured caching at 36% hit rate).
3. **CS early-warning alert**: paying org with `cacheHitRate30Days < 20%` after 30 days = intervention (inputs tuning, affected setup, repo-shape review - caching is always on, so a low rate is a workload/config-fit problem, not a missing toggle). Would have flagged ~9 of these 47 months before churn. Especially important for orgs that upgraded within days of org creation (forced by free-tier limits, no chance to see value yet).
4. **Bill-shock mitigation**: invoice-spike detection (any invoice > 2x trailing median, not just the final one - archax's spike was mid-history). Notify org admins + CS before the invoice lands; consider spend alerts/caps in product. **Show a spend estimate at feature-enable time** (agents/AI) - archax's 5.3x jump came from turning on two paid features in one month with no preview.
5. **Wind-down detection**: `computationTimeSavedMs7Days` trending to zero over 6+ weeks on a paid plan = churn-risk signal, catchable months early (Dispel, AgriWebb, sharethrough all visible by March).
6. **Pricing/packaging question** for fast-pipeline orgs (high <2min share): cache ROI is structurally low for them; what is the Team value story beyond cache (flaky tests, analytics, agents)?
7. **Capture cancellation reason** at cancel time if we don't already - nothing in Mongo records WHY (`MOrgPlanCancellationAction` is mechanics only).

## Open questions / next investigations

1. **Control group**: same value metrics on retained Team orgs. Does compute/AI adoption actually predict retention? (Denominator ANSWERED in follow-up: 1,044 active Team orgs -> ~1.4-1.5%/mo churn. Value-metric comparison still open.)
2. **12-month churn baseline**: rerun churn query with cutoff pushed to 2025-07. Is ~15/mo new or normal? Seasonality?
3. **Inflow vs outflow**: planTransitions to TEAM per month vs churn per month = net Team growth.
4. **Support-ticket correlation**: did churners file Pylon tickets first? (pylon-support skill can pull per-account history for the 47.)
5. **Trial origin**: did short-tenure churners convert from Pro trial or sign up direct? (`planTransitions` history has it.)
6. **EVA win-back story**: what brought them back in 2 days - and led them to adopt agents the same month? Repeatable motion?
7. `analytics.monthlyOrganizationChurn` already computed by aggregator (est. lost revenue + usesDTE/usesVCS flags) - reconcile this report against it; extend that job if this analysis should be recurring.

## Follow-up Q&A (2026-07-23)

### How many customers had cost spikes, and what share churned?

Population: Team-only (current `plan: TEAM` orgs with a Stripe customer + the 47 churned), >=2 paid invoice months, base >= $50: 883 customers.

| Spike | Customers | Churned | Churn rate |
| --- | --- | --- | --- |
| baseline (all Team) | 883 | 41 | 4.6% |
| 50%+ mo/mo | 379 (43% of all) | 19 | 5.0% |
| 100%+ mo/mo | 234 (26%) | 14 | 6.0% |
| 100%+ over 3 months | 259 | 13 | 5.0% |

**Spikes alone barely predict churn** (1.1-1.35x lift): 42% of customers had a 50%+ spike and most stayed - invoice growth is normal. Bill shock converts to churn when paired with thin value (archax, gto-wizard = spike + low ROI). Mitigation should target spike AND weak value metrics, not every spike.

This also settles the churn-rate denominator: **1,044 current Team orgs; 47 churns over 3 cycles = ~1.4-1.5%/mo Team churn.** (An earlier all-customer cut of this analysis used 938 customers with near-identical results - contamination from legacy Pro / Powerpack / Enterprise invoices was only 55 customers.)

### Remote-cache-only cancels: ratio and MRR

**28 of 47 (60%), $9,739 of $17,843 churned MRR (55%)** never used compute or AI credits in any billing period. Note: cache-only does not mean low value - the top cache-only payers are qawolf ($2,725/mo, $0.25 per saved hr) and talview ($1,270/mo, $0.42). Cache-only means no second-feature stickiness. Whether multi-feature adoption actually predicts retention still needs the retained-org control group.

### Low-ROI category MRR - should we care?

- Low ROI **at churn**: 31 orgs, $9,096/mo. But $4,169 of that is wind-downs (sharethrough, AgriWebb, Dispel, Finni, outfox-ai, contextfab, zwizzly) whose ROI was good before they migrated off - their at-churn ROI is an artifact of already having left.
- **Genuine low-ROI** (never got value): 24 orgs, **$4,927/mo = 28% of churned MRR**. Concentration: $3,570 sits in four orgs (gto-wizard, Stirlingshire, ShopVision-ai, Evoluncite); the other 20 average $68/mo.

Verdict: care a medium amount, cheaply. The long tail does not justify CS heads; product-led fixes (spend preview at feature-enable, low-hit-rate alert, in-app ROI surfacing) cover it and help the four larger accounts. Human attention belongs with the good-ROI leavers ($8.7k MRR) and wind-downs.

## Appendix: definitions

Every categorization in this report, with the source field so it can be re-derived and validated. Source collections: `billing.billingRecords` (one doc per org per billing period), `analytics.dailyProductUsage` (one doc per org per day), `analytics.dailyTaskStatistics` (per workspace/project/target per day), `ciPipelineExecutions`, Stripe invoice CSV export.

**Churned Team org**: has a billing record with `plan: TEAM` and `organizationStatusChange.actionToTake` in `[TEAM_TO_FREE, TEAM_TO_DISABLED]`, `_id.periodEnd` in the window (2026-05-01, 06-01, 07-01 cohorts). 47 orgs.

**Credit types** (from billing records): `executionCredits` = CI pipeline executions (the remote-cache/CI product), `computeCredits` = Nx Cloud managed compute (Nx Agents / workflows), `aiCredits` = self-healing AI.

**Remote-cache-only**: `computeCredits = 0` AND `aiCredits = 0` in EVERY available billing period for the org (up to 12 periods of history pulled), while `executionCredits > 0` in at least one. In words: they ran CI through Nx Cloud (remote cache + run analytics) and never consumed managed compute or AI. Two caveats: (1) other credit types (sandbox, resource usage, docker cache) were not checked - effectively zero for Team orgs; (2) manual DTE (self-managed agent fleets) consumes no compute credits and is NOT excluded by this definition - it would show in `maximumConcurrentConnections` or the `usesDTE` flag in `analytics.monthlyOrganizationChurn`, neither of which was checked here. 28/47 orgs.

**Saved hrs/mo at churn**: `computationTimeSavedMs30Days` from the last `analytics.dailyProductUsage` doc dated strictly before the org's churn date, converted to hours. Meaning: serial task compute time avoided by cache hits (local + remote) in the trailing 30 days. This is task time, not wall-clock.

**Peak saved hrs (90d)**: max of `computationTimeSavedMs30Days` over the 90 days before churn. **Decline %**: `1 - (at-churn / peak)`.

**Avg $/mo (proxy for MRR)**: sum of paid Stripe invoice totals over trailing 12 months / number of paid invoices, per org. **Churned MRR**: sum of avg $/mo across orgs.

**$ per saved hr**: avg $/mo divided by saved hrs/mo at churn. Undefined when saved hrs = 0.

**Cache hit rate**: `cacheHitRate30Days` = (local + remote cache hits) / all task executions across the org's workspaces, from daily task statistics. Caching is on for every plan; a low rate means hits did not happen for the workload (unstable inputs, everything-affected commits, few repeat runs), not that a feature was off.

**CIPE duration / <2m%**: `completedAt - createdAt` per `ciPipelineExecutions` doc, 2026-03-01 to 07-01, completed CIPEs only. `<2m%` = share of CIPEs under 2 minutes, weighted across the org's workspaces.

**Tenure**: number of TEAM billing periods for the org.

**Segment rules** (an org can match the bill-shock trigger in addition to its segment):

- **High-value leaver**: $ per saved hr < ~$2 at churn, high absolute saved hrs, no usage collapse.
- **Wind-down**: decline >= ~85% from 90d peak AND peak >= 100 saved hrs AND peak-era ROI good (avg $/mo / peak hrs < $5). ROI at churn is an artifact for these orgs - they had already left.
- **Genuine low-ROI**: $ per saved hr >= $5 at churn (or zero saved hrs), excluding wind-downs.
- **Zombie**: near-zero usage AND near-zero invoices for their whole tenure (Team billing scales with contributors/usage, so unused orgs pay ~$0).
- **Forced upgrade**: added billing within days/weeks of org creation, i.e. upgraded to pass free-tier gates (5 contributors / 50k credits), not after experiencing value.

**Bill-shock / spike buckets** (paid invoices only, prior month >= $50 to exclude noise): 50%+ mo/mo = invoice >= 1.5x previous month; 100%+ mo/mo = >= 2x previous month; 100%+ over 3 months = >= 2x the invoice 3 months prior. The original per-org "bill shock" flag used final invoice >= 1.5x the org's trailing median, which misses mid-history spikes (archax).

**Spike-analysis population**: current `plan: TEAM` orgs with a `stripeCustomerId` (1,044, of which 1,043 have one) plus the 47 churned orgs, restricted to customers with >= 2 paid invoice months in the trailing 12 months: 883. (Prepaid Enterprise does not invoice through Stripe; Powerpack licenses are one-time/annual and drop out of the >= 2-months rule.)

## Data files

- `data-1/2/3/3b.json` - Mongo churn exports (Desktop)
- `q5-v2.json` (daily usage series), `data6.json` (workspaces), `q7.json` (CIPE durations)
- `invoices.csv` -> `churned-team-stripe-summary.json` (per-org invoices)
- `churn-value-analysis.json` - final joined per-org table
