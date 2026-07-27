# Churn signals validation + competitor cost model

2026-07-24. Follow-on from `../2026-07-22/tasks/team-churn-report-2026-07.md`. Two workstreams from Jack/Joe sync.

## Workstream 1: validate signals for in-product implementation

### Candidate set and status

| # | Signal | Definition | Status | Precision |
| --- | --- | --- | --- | --- |
| S1 | Zero value | paid org, 0 saved hrs over 30d | snapshot-validated | 41% (10 counter-examples) |
| S2 | Never matched | paid org, cacheHitRate30d < 20% after 30d | snapshot-validated | 14% (49 counter-examples) |
| S3 | Wind-down | savedHrs30d decline >= 85% from trailing peak while still paying | case-validated (accrual-dev, Dispel, AgriWebb); population test pending | - |
| S4 | Early tenure + no value | first 3 billing cycles AND (S1 or S2) | untested | - |
| - | REJECTED: invoice-spike anything | flag 6.2%; AND weak-value 6.5%; timing on large accts 10.9% vs 8.8% baseline; >= $1k accts below baseline | falsified in 4 cuts | - |

Side-finding from spike-timing run: accounts with median invoice >= $500 churn at 8.8-9.1% per window vs 5.9% overall - spend size itself is a risk factor (links to Joe's revenue-GRR 65-70% vs our ~83% logo number).

### Backtest design (the proper validation)

Snapshot-based validation is biased (churned orgs' at-churn values are definitionally low for wind-downs). Prospective test: compute signals as of Apr 1, measure churn May-Jul.

**Query A - Apr 1 snapshot, all orgs** (`analytics.dailyProductUsage`, Compass aggregation):

```js
[
  { $match: { date: { $gte: ISODate('2026-04-01T00:00:00Z'), $lt: ISODate('2026-04-04T00:00:00Z') } } },
  { $sort: { date: 1 } },
  { $group: {
      _id: '$organizationId',
      date: { $last: '$date' },
      savedMs30: { $last: '$computationTimeSavedMs30Days' },
      savedMs7: { $last: '$computationTimeSavedMs7Days' },
      hit30: { $last: '$cacheHitRate30Days' },
      exec30: { $last: '$executionCount30Days' },
      runs30: { $last: '$runCount30Days' }
  } }
]
```

Combined with the July snapshot (`data-usage-all.json`) this also gives the S3 trend (Apr -> Jul decline) for every retained org.

**Query B - tenure** (`cloudOrganizations`, for S4):

```js
// Filter: { plan: 'TEAM' }   Project: { name: 1, planActivationDate: 1, createdAt: 1 }
// churned orgs' activation dates already available via planTransitions in data-2.json
```

Analysis then: precision/recall per signal + combinations, prospective (fired Apr 1 -> churned by Jul 1). Ship the winners.

### Backtest results (2026-07-24, signals at Apr 1 -> churn May-Jul, base 2.5%)

| Signal | Fires | Churned | Precision | Recall | Lift |
| --- | --- | --- | --- | --- | --- |
| S2 hit < 20% | 59 | 6 | 10.2% | 24% | 4.1x |
| early tenure alone (<= 3mo) | 144 | 13 | 9.0% | 52% | 3.6x |
| S4 early AND (S1\|S2) | 48 | 4 | 8.3% | 16% | 3.4x |
| S1 zero-saved (incl. no usage doc) | 394 | 2 | 0.5% | 8% | 0.2x |

- **S1 falsified as leading indicator** - inactive orgs mostly keep paying near-$0 (usage-scaled billing self-corrects; snapshot 41% precision was the wind-down ENDPOINT, survivorship artifact).
- **Early tenure dominates**: 22/47 churned orgs joined Team after Apr 1 (outside backtest) + 13 more were <= 3mo old at Apr 1 -> ~75% of churn within first months.
- **S2 survives** prospectively.

### Refinements (same day)

- **Early tenure x bill size** (joined since 2026-01): <$100/mo bands churn 2.5-6.4% and carry ~$235 total MRR (ignore); **>= $100/mo churns 12.7-13.0% and carries 97% of early-churn MRR**. Established orgs >= $500: 0/118 churned - accounts that survive onboarding are solid.
- **Dormancy correction**: "no Apr doc" misclassified late joiners (Multiplier-Holdings et al are NEW + very active). True dormant-and-still-billed set (tenured, no July usage, latest invoice >= $50): **7 orgs, $2,344/mo**. Because invoices bill the prior month, this set = wind-downs that started weeks ago - S3 without any trend computation.

### Final production tiers

1. **Early + real money**: <= 3 billing cycles AND invoice >= $100/mo -> high-touch CS. ~13% churn risk (5x base), carries the dollars.
2. **Cache-hit campaign**: hit < 20% in weeks 1-2 -> automated hit-rate resources; CS follow-up at 30d. 4.1x lift, prospectively validated.
3. **Billing-usage divergence** (= wind-down detector): latest invoice >= $50 AND ~zero usage in current 30d -> save play before the churn record lands (accrual-dev pattern). Currently fires on 7 orgs.

Rejected: all invoice-spike variants (4 cuts incl. timing on large accounts); standalone zero-value/dormancy (self-correcting billing makes it low-stakes).

### Implementation sketch (post-validation)

Aggregator already computes `dailyProductUsage` daily - a signals pass over it is cheap: new op emitting per-org signal states -> CS alert (email template infra exists) + admin dashboard flag. Wind-down needs trailing-peak state; either compute from the daily series in the op or store a rolling max.

## Workstream 2: competitor-comparable cost model

### Internal rates (from code)

- Compute billing: `cost(minutes) = minutes * creditMultiplier` (`ResourceClasses.kt:134`), multipliers: small 5, medium 10, medium+ 15, large 20, large+ 30, extra_large 40, extra_large+ 60 credits/min.
- $/credit: `PRICE_PER_CREDIT_PRO = 0.00055` (`Constants.kt:114`). **VERIFY: Team overage $/credit lives in Stripe price objects, not code - confirm from Stripe dashboard.**
- CIPE cost: 500 credits = $0.275 per pipeline execution (PRO rate).

### Per-minute comparison (agent compute)

Assuming published specs (VERIFY against nx.dev launch-template docs: small 1vCPU/2GB, medium 2vCPU/4GB, large 4vCPU/8GB, extra_large 8vCPU/16GB):

| Runner | $/min | vCPU | $/vCPU-min |
| --- | --- | --- | --- |
| GHA Linux 2-core | $0.006 | 2 | $0.0030 |
| GHA Linux 1-core slim | $0.002 | 1 | $0.0020 |
| Blacksmith 2vCPU | $0.004 | 2 | $0.0020 (claims 2x faster hw) |
| Depot Linux | $0.004 | 2 (VERIFY) | $0.0020 |
| Nx Agents medium | $0.0055 | 2 (VERIFY) | $0.00275 |
| Nx Agents large | $0.0110 | 4 (VERIFY) | $0.00275 |

Read: at PRO credit price our compute is ~8% under GHA and ~37% ABOVE Blacksmith/Depot on raw per-vCPU rate. **We cannot win on rate alone - the pitch must be total minutes consumed** (cache + affected + bin-packed DTE mean fewer minutes for the same work) plus zero idle/queue waste.

### Proposed metrics

1. **Cache-only (shipping-ready)**: `$/saved-min = avg monthly invoice / saved minutes` - denominated in minutes so GHA ($0.006/min) and Blacksmith/Depot ($0.004/min) rates are literal band boundaries. Distribution (579 retained + 36 churned):

| $/saved-min | Retained | Churned | Churn rate |
| --- | --- | --- | --- |
| < $0.004 (beats Blacksmith/Depot) | 37 | 0 | 0.0% |
| $0.004-0.006 (beats GHA) | 29 | 1 | 3.3% |
| $0.006-0.012 (1-2x GHA) | 52 | 3 | 5.5% |
| $0.012-0.06 (2-10x GHA) | 239 | 8 | 3.2% |
| $0.06-0.30 (10-50x GHA) | 115 | 8 | 6.5% |
| >= $0.30 (50x+) | 97 | 9 | 8.5% |
| no savings | 10 | 7 | 41.2% |

Medians: retained $0.041/saved-min (~7x GHA), churned $0.127 (~21x). Health framing: "you pay N-times the GHA rate per saved minute" - risk rises with the multiple; sub-Blacksmith orgs churned 0/37.

**UNIT CAVEAT (2026-07-24, caught by Jack)**: saved minutes are TASK-minutes; runners execute ~2+ tasks per machine-minute (parallel execution). Comparing $/task-min against machine-minute runner rates flatters us ~2x. Conservative benchmark = per-CORE rates: GHA $0.003, Blacksmith $0.002. Under that reading the "beats GHA" boundary halves and only the < $0.002 band is a bulletproof "cheaper than anyone" claim - qawolf ($0.0042/task-min) is break-even-to-2x a GHA rerun, ABOVE a Blacksmith rerun ($918-1,835 vs $2,725 invoice). Consequence: cache pricing cannot generally be sold as "cheaper than re-running" - the defensible pitch is wall-time/dev-wait, with compute substitution as a per-customer bonus where it holds. Customer-facing inversion (**GHA-equivalent $ avoided = savedMin x rate**) must state which rate and present the range.
2. **Mixed cache + compute**:
   `GHA-equivalent spend = (computeMin x vCPU-normalized GHA rate) + (savedCacheMin x GHA rate)`
   `Nx spend = actual invoice`
   Health ratio = Nx spend / GHA-equivalent spend. < 1.0 = ammunition ("your $X on Nx replaces $Y on GHA"); > 1.0 = churn-risk flag and pricing pressure signal.
3. Optional upper bound: + wall-clock reduction x loaded dev cost (the real value, but disputable - keep separate from the floor math).

### To verify before anything customer-facing (CLAUDE.md rule: verify third-party claims)

- Team overage $/credit (Stripe dashboard)
- Resource class vCPU/RAM specs (nx.dev docs)
- Depot runner core count at $0.004/min; Depot per-second billing detail
- Buildkite hosted-agent rates (not yet researched)
- GHA larger-runner rates (4/8/16-core) for the large-class comparisons
- Blacksmith "2x faster hardware" claim (affects effective $/work-unit, not just $/min)

### Sources

- GHA rates: Jack's screenshot of [GitHub Actions billing docs](https://docs.github.com/en/billing/concepts/product-billing/github-actions); [Actions runner pricing](https://docs.github.com/en/billing/reference/actions-runner-pricing)
- Blacksmith: [pricing page](https://www.blacksmith.sh/pricing), [toolradar summary](https://toolradar.com/tools/blacksmith-ci/pricing) ($0.004/min, 3k free min/mo, configs scale proportionally)
- Depot: [GH Actions runners docs](https://depot.dev/docs/github-actions/overview), [price calculator](https://depot.dev/github-actions-price-calculator) ($0.004/min Linux, per-second tracking)
- Context: [GHA 2026 pricing changes + self-hosted charge walked back](https://github.blog/changelog/2025-12-16-coming-soon-simpler-pricing-and-a-better-experience-for-github-actions/)
