# Team Plan Churn Analysis - May-Jul 2026

Last updated 2026-07-23. Sources: prod Mongo (`billing.billingRecords`, `cloudOrganizations.planTransitions`, `analytics.dailyProductUsage`, `analytics.dailyTaskStatistics`, `ciPipelineExecutions`) + Stripe invoice export. Queries: `team-churn-mongo-queries.md` (same folder). Definitions for every metric and category: Appendix A.

## TL;DR

- 47 orgs churned Team -> Free over 3 cycles = **1.4-1.5%/mo churn** against 1,044 active Team orgs. **$18k/mo MRR lost ($215k ARR)**, 80% of it in 10 orgs.
- True loss is higher: churn records lag reality. One $6k/mo account (accrual-dev) is mid-wind-down with no cancellation record yet (+33% on the MRR figure).
- Why they leave, by dollars: good-ROI orgs leaving over price/competitor ($4k/mo), wind-downs that migrated off months earlier ($4.2k/mo), genuine low-ROI ($4.9k/mo), the rest small/zombies.
- **Stickiness is feature-specific**: agents-only orgs are the lowest-churn bucket (2.4% vs 4.4% cache-only; suggestive, small n) - but **AI adopters churn 2.3x more** (solid, z = 2.8) and compute+AI together is the worst bucket (11.1%). The heaviest-compute case study (accrual-dev, 20M credits) still churned to Depot+Turbo.
- **$/saved-hr separates the groups**: median retained $2.46 vs churned $7.59. The cliff is zero value: orgs saving nothing churn at 41%.
- **Validated churn signals**: zero saved hrs (41% precision), cache hit <20% (14%). Invoice spikes are NOT a usable flag (6% precision, 228 counter-examples) - but spike timing on large accounts keeps appearing right before departure (untested formally).
- Bill-shock product gap is real regardless: archax and accrual-dev both left immediately after 2.5-5x invoice jumps; feature adoption has no spend preview.

## 1. Headline numbers

- 47 churn events: 17 (May 1), 18 (Jun 1), 12 (Jul 1). All TEAM_TO_FREE, all invoiced. No spike month.
- $138,315 paid by these orgs in trailing 12 months; $18k/mo churned MRR; $2,775 left unpaid (Finni $1,596, outfox-ai $779).
- Concentration: top 10 orgs = 80% of the $138k; bottom 25 average under $50/mo.
- Post-churn: 42 on Free (enabled), 2 delinquent-disabled (Finni, outfox-ai), 2 disabled for exceeding free credits (Evoluncite, DevPraxis - still-active win-back targets), 1 won back (EVA).

## 2. Churn segments

### 2a. High-value leavers - price/competitor, not value

| Org | Avg $/mo | Saved hrs/mo | $/saved-hr | Cache hit |
| --- | --- | --- | --- | --- |
| qawolf | $2,725 | 10,895 | $0.25 | 91% |
| talview | $1,270 | 3,051 | $0.42 | 81% |

Cache-only (zero compute/AI credits all periods), excellent ROI, left anyway. Exit-interview material - see qawolf counterfactual (3a).

### 2b. Wind-downs - migrated off months before cancelling

| Org | Peak saved hrs (90d) | At churn | Contributors |
| --- | --- | --- | --- |
| Dispel | 1,458 | 0 | 40 -> 2 |
| AgriWebb | 925 | 3 | 37 -> 4 |
| contextfab | 346 | 0 | 14 -> 5 |
| sharethrough | 280 | 1 | 21 -> 7 |

Cancellation is a lagging indicator here; the loss happened earlier. $4.2k/mo. Where they went needs CS/exit interviews.

### 2c. Bill shock / thin value

| Org | $/mo | $/saved-hr | CIPEs <2min | Tenure |
| --- | --- | --- | --- | --- |
| gto-wizard | $1,782 | $13.7 | 66% | 1 period |
| Stirlingshire | $873 | $7.6 | 15% | 3 periods |
| Evoluncite | $415 | $14.5 | 21% | 3 periods |
| outfox-ai | $318 | $20.4 | 60% | 3 periods |
| Hexweavers | $188 | $29.8 | 75% | 2 periods |
| zwizzly | $134 | $14.7 | 65% | 7 periods |

Paying Team rates for fast pipelines the cache cannot help much. 8 of the 47 cancelled right after an invoice >= 1.5x their own median. archax-org is the case study (3b).

### 2d. Forced upgrades that never saw value + zombies

Cache hit <20% at churn: Signivo (5%), KLR-Bus (7%), GebouwAssistent (1%), Stirlingshire (19%), contextfab, Phazebreak, Travis-Waith-Mair, Suhyl, fkdldkRhya (0%). Caching is on for every plan - low hit means the workload never matched (unstable inputs, everything-affected commits, few repeat runs). Most added billing within DAYS of org creation: they paid to pass the free-tier gates (5 contributors / 50k credits), never saw payoff, left. Zombies (IglesiaCucuta, YourPower, fkdldkRhya) paid $0 - plan-flag hygiene, not revenue.

## 3. Case studies

### 3a. qawolf - what cancelling costs them

From their own June cache-miss durations (`dailyTaskStatistics`; remote hits re-run at each task type's measured miss duration, local cache kept): 6.15M CI tasks/mo, 91% hit, 843 tasks/CIPE. With Cloud: 4.2 min wall per CIPE. Without: **81.8 min serial task-compute per CIPE = +7,648 task-hrs/mo (4.3x)**. Wall estimate: 15-18 min on current infra, 7-10 min re-parallelized (floor 5 min from critical path). Cross-check: remote 7,648 + local 2,723 = 10,371 task-hrs, within 5% of `dailyProductUsage`'s independently-computed 10,895.

**Dollar comparison**: saved time is TASK-time, and a 2-core `actions_linux` runner ($0.006/min) executes 2 tasks concurrently, so 458,862 saved task-min = 229,431 machine-min = **$1,377/mo on GHA**; Blacksmith at $0.004/min = $918. **Their $2,725 cache fee is 2x the GHA rerun cost and 3x Blacksmith.** On pure compute substitution we are not the cheap option; the value that justified the fee is WALL TIME (4.2 -> 15-18 min per CIPE without Cloud) and dev wait, not compute dollars. Caveats: runner hardware unknown; faster tooling (oxlint/vite) shrinks miss durations; behavior would adapt without cache; means hide tails.

### 3b. archax-org - feature-adoption bill shock

| Usage month | Invoice | Contribs | Exec | Compute | AI |
| --- | --- | --- | --- | --- | --- |
| Mar | $512 | 18 | 585k | 0 | 0 |
| Apr | $2,708 | 23 | 1.94M | 1.48M | 604k |
| May | $3,120 | 27 | 2.19M | 1.62M | 583k |
| Jun (FREE) | - | 10 | 50k (= free cap) | 0 | 0 |

Enabled Agents AND self-healing AI in one month; invoice jumped 5.3x with no warning; cancelled. Still active on Free, pinned at the credit cap. Top win-back. Product lesson: **feature adoption without a spend preview**.

### 3c. accrual-dev - churn in progress our detection cannot see (added 2026-07-23)

Org `670c094fc0c313acbf9edfb2`, 2yr customer, 41 contributors, heaviest agents user examined (20.2M compute credits, compute in 7/7 periods). Invoices: $507 (2025-08) -> $2,600 (spring) -> **$6,490 (Jun 1, 2.5x jump)** -> $5,870 (Jul 1). Per CS: one bad support ticket in June, migrated to Depot + Turbo. July usage: **7 executions/30d, 0 saved hrs** - fully wound down, yet NOT in the churned-47 because no cancellation record exists yet (will appear around Aug 1 or as delinquency).

Implications: (1) billing-record churn detection lags reality by 1-2 cycles - the wind-down trend is the leading indicator and is flashing now; (2) reported churned MRR understates - this org alone adds $6k/mo; (3) strongest counter-example to compute-stickiness; (4) support tickets on $5k+/mo accounts deserve escalation regardless of content; (5) win-back window is BEFORE the cancellation record, i.e. now.

### 3d. EVA - win-back with feature expansion

Churned Jun 1, re-added billing Jun 3. Healthy (438 saved hrs/30d, 83% hit, 13.5 min tasks, $179/mo) and adopted agents for the first time the same month (12,420 compute credits after 12 zero periods). Slow starter originally (3 zero-usage periods before value clicked). Whatever drove the re-add produced save + expansion - worth finding and repeating.

## 4. What predicts churn (tested against all Team orgs)

### 4a. Feature adoption and stickiness: agents mildly help, AI correlates with churn

972 Team orgs with Jan-Jul billing records, mutually exclusive buckets:

| Bucket | n | Churned | Rate |
| --- | --- | --- | --- |
| cache-only (no compute, no AI) | 709 | 31 | 4.4% |
| compute-only (agents, no AI) | 127 | 3 | **2.4%** |
| AI-only (no compute) | 55 | 4 | 7.3% |
| both compute + AI | 81 | 9 | **11.1%** |

- **Agents-only orgs are the lowest-churn bucket** - the stickiness hypothesis holds directionally for compute, though at 3 churns of 127 it is suggestive, not proven.
- **AI is the churn-correlated feature**: any bucket containing AI is elevated; AI adopters overall churn 2.3x non-adopters (13/136 vs 34/836, z = 2.8 - statistically solid). Plausible confound: self-healing adopters may be orgs whose CI is already painful (flaky, failing) - AI use may mark distressed accounts rather than cause churn.
- Dabbled compute (1-2 periods, mixed AI) churns above sustained (3+ periods) - the danger zone is right after adoption, when spend jumps (archax pattern).
- Large orgs (>= 3M exec credits) with compute churn 5.3% vs 8.1% without. Adoption base rates: 21% compute, 14% AI.
- **Practical read**: an agents adoption push is defensible for retention IF paired with spend preview / ramp pricing; an AI push is not, until the AI-churn correlation is understood.

### 4b. $/saved-hr separates retained from churned

579 retained + 36 churned orgs (>= $10/mo, with usage data). Benchmark: saved time is task-time and a 2-core `actions_linux` runner ($0.006/min) executes 2 tasks concurrently, so re-buying a saved task-hour costs $0.18 on GHA (60 task-min = 30 machine-min x $0.006), $0.12 on Blacksmith ($0.004/min). Orgs below $0.18/saved-hr genuinely pay less than re-running; most pay a multiple of it, so the customer-facing value story is wall time, with compute substitution as a bonus where it holds.

| $/saved-hr band | Retained | Churned | Churn rate |
| --- | --- | --- | --- |
| < $0.50 | 87 | 2 | 2.2% |
| $0.50 - $2 | 163 | 9 | 5.2% |
| $2 - $5 | 137 | 2 | 1.4% |
| $5 - $20 | 90 | 9 | 9.1% |
| >= $20 | 92 | 7 | 7.1% |
| no saved hrs | 10 | 7 | **41.2%** |

**Median: retained $2.46 vs churned $7.59.** A gradient, not a cliff - except zero value, which is a cliff. Caveat: retained values are current-snapshot vs churned at-churn; a survival analysis would strengthen it.

### 4c. Signal validation (precision + counter-examples, 615-org population, 5.9% base)

| Signal | Fires | Churned | Precision | Counter-examples |
| --- | --- | --- | --- | --- |
| zero saved hrs | 17 | 7 | **41.2%** | 10 |
| cache hit < 20% | 57 | 8 | **14.0%** | 49 |
| weak value ($/hr >= 2 or none) | 354 | 25 | 7.1% | 329 |
| invoice spike (>= 2x trailing median) | 243 | 15 | 6.2% | 228 |
| spike AND weak value | 124 | 8 | 6.5% | 116 |

Automate on **value-absence** (zero saved hrs, low hit rate); do not automate on spend (43% of Team customers spike 50%+ per year and stay - spend alerts flag healthy growers). Untested: spike TIMING on large accounts (archax, gto-wizard, accrual-dev all left within 1 cycle of a 2.5x+ jump - needs time-to-churn analysis) and wind-down trend at population level (needs daily-series export; accrual-dev shows it works case-wise).

## 5. Action items

1. **Win-back now**: accrual-dev (before the cancellation record lands), archax-org (active, credit-capped - offer ramp/capped pricing), Evoluncite + DevPraxis (disabled on free for exceeding credits), gto-wizard.
2. **Exit interviews**: qawolf, talview (good ROI, left anyway - what beat us?); wind-downs (where did they go?).
3. **Automated value-absence alerts**: paid org with cache hit <20% after 30 days, or zero saved hrs -> CS intervention (inputs tuning, affected setup). Highest-precision signals we have.
4. **Wind-down detector**: `computationTimeSavedMs7Days` trending to 0 over 6+ weeks on a paid plan. Leading indicator (catches accrual-dev-type churn 1-2 cycles before the record); validate at population level.
5. **Spend preview at feature-enable + soft caps**: archax and accrual-dev both left right after multi-x invoice jumps. Prerequisite before any agents/AI adoption push (see 4a).
6. **Support-ticket escalation for high-spend accounts**: one ticket lost accrual-dev ($6k/mo). Wire Pylon -> CS alert for accounts above a spend threshold.
7. **Capture cancellation reason** in the cancel flow - nothing in Mongo records WHY.
8. **Pricing/packaging** for fast-pipeline orgs (high <2min share): cache ROI is structurally low; what is the Team value story for them?

## 6. Open questions

1. Value-metric survival analysis (proper cohort version of 4b) + spike-timing test on large accounts.
2. Why does AI adoption correlate with churn? Test the distress confound: do AI adopters have worse pre-adoption CI health (failure rates, flakiness) than non-adopters?
3. 12-month churn baseline and seasonality (rerun churn query with 2025-07 cutoff).
4. Team inflow vs outflow per month = net growth.
5. Pylon ticket correlation for the 47 + accrual-dev (support friction as trigger).
6. GRR reconciliation: our 1.4-1.5%/mo logo churn is about 83-84% GRR annualized vs Joe's 65-70% figure - definitions need aligning (revenue-weighted? all plans?).
7. EVA win-back mechanics - repeatable?
8. Reconcile with `analytics.monthlyOrganizationChurn` (aggregator's own churn job) and extend it if this should be recurring.

## Appendix A: definitions

Source collections: `billing.billingRecords` (per org per period, compound `_id {orgId, periodStart, periodEnd}`), `analytics.dailyProductUsage` (per org per day), `analytics.dailyTaskStatistics` (per workspace/project/target per day), `ciPipelineExecutions`, Stripe invoice CSV.

- **Churned Team org**: billing record with `plan: TEAM` + `organizationStatusChange.actionToTake` in [TEAM_TO_FREE, TEAM_TO_DISABLED], periodEnd in window. (Older records: deprecated `orgPlanCancellationAction`.)
- **Credit types**: `executionCredits` = CI pipeline executions (remote-cache/CI product); `computeCredits` = managed compute (Nx Agents/workflows); `aiCredits` = self-healing AI.
- **Remote-cache-only**: computeCredits = 0 AND aiCredits = 0 in every available period, executionCredits > 0 in at least one. Does not exclude manual DTE (self-managed agents consume no compute credits; check `usesDTE` in `analytics.monthlyOrganizationChurn`).
- **Saved hrs/mo**: `computationTimeSavedMs30Days` -> hours; serial task compute avoided by cache hits. Taken from the last daily doc BEFORE the churn date (a latest-doc snapshot reflects post-churn usage).
- **$/saved-hr**: avg paid Stripe invoice (12mo) / saved hrs/mo. Undefined at zero saved hrs.
- **Cache hit rate**: (local + remote hits) / all task executions, org-wide. On for every plan; low = workload never matched, not a disabled feature.
- **Peak/decline**: peak = max saved-hrs-30d in 90d pre-churn; decline = 1 - at-churn/peak.
- **CIPE duration / <2m%**: `completedAt - createdAt`, completed CIPEs, Mar-Jul window.
- **Segments**: high-value leaver = $/hr < $2, high saved hrs, no collapse. Wind-down = decline >= 85%, peak >= 100 hrs, peak-era ROI < $5/hr. Genuine low-ROI = $/hr >= $5 (or zero), excluding wind-downs. Forced upgrade = billing added within days of org creation (free gates: 5 contributors / 50k credits). Zombie = near-zero usage and $0 invoices.
- **Spike**: paid invoice >= 2x trailing median (prior >= $50), any point in history.
- **Populations**: churn cohorts = periodEnds 2026-05/06/07-01. Spike/stickiness populations: current TEAM orgs (1,044) + churned 47, with >= 2 paid invoice months (883 for spikes; 972 with billing records for stickiness; 615 with >= $10/mo + usage data for value metric).

## Appendix B: data files

- Desktop: `data-1/2/3/3b.json` (churn exports), `q5-v2.json` (daily usage series), `data6.json` (workspaces), `q7.json` (CIPE durations), `avg-cipe.json` (task stats), `data-team.json` (current Team orgs), `data-all-teams.json` (all-Team billing), `data-usage-all.json` (all-org usage snapshot)
- `invoices.csv` -> `churned-team-stripe-summary.json`, `churn-value-analysis.json`, `value-metric-validation.json`
- Queries: `team-churn-mongo-queries.md`
