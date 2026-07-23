# Team Plan Churn - Mongo Compass Queries

Data model notes (ocean, `nrwl-api` db):

- `billing.billingRecords` - one doc per org per billing period. Compound `_id: {orgId, periodStart, periodEnd}`. Final TEAM-period record carries `organizationStatusChange.actionToTake: "TEAM_TO_FREE" | "TEAM_TO_DISABLED"` (older docs used deprecated `orgPlanCancellationAction`).
- `cloudOrganizations.planTransitions` - append-only array `{id, plan, date, reason, source}`. Churn pushes `{plan: "FREE", reason: "TRANSITION_ORGANIZATION_TO_FREE_PLAN", source: "aggregator"}`.
- GOTCHA: `transitionOrgToFreePlan` nulls `stripeCustomerId` on the org doc (`HandleUnprocessedBillingRecords.kt:1030`). Take Stripe customer ID from the billing record, not the org.
- No invoice dollar amounts in Mongo. Stripe computes totals. Mongo has usage inputs only (credits, contributor counts). See "Dollar amounts" at bottom.

Cutoff used below: last 90 days from 2026-07-22 -> `2026-04-23`. Adjust as needed.

---

## 1. Churned-from-Team orgs (find)

Collection: `billing.billingRecords`

**Filter**

```js
{
  plan: 'TEAM',
  '_id.periodEnd': { $gte: ISODate('2026-04-23T00:00:00Z') },
  $or: [
    { 'organizationStatusChange.actionToTake': { $in: ['TEAM_TO_FREE', 'TEAM_TO_DISABLED'] } },
    { orgPlanCancellationAction: { $in: ['TEAM_TO_FREE', 'TEAM_TO_DISABLED'] } }
  ]
}
```

**Project**

```js
{
  orgName: 1,
  stripeCustomerId: 1,
  'organizationStatusChange.actionToTake': 1,
  processed: 1,
  messages: 1,
  contributorCount: 1,
  executionCredits: 1,
  computeCredits: 1,
  aiCredits: 1,
  hasDiscount: 1,
  sendInvoice: 1
}
```

**Sort**

```js
{ '_id.periodEnd': -1 }
```

---

## 2. Churned orgs + 12-month billing history + current org state (aggregation)

Collection: `billing.billingRecords`. Paste into Compass aggregation "raw pipeline" text mode:

```js
[
  {
    $match: {
      plan: 'TEAM',
      '_id.periodEnd': { $gte: ISODate('2026-04-23T00:00:00Z') },
      $or: [
        { 'organizationStatusChange.actionToTake': { $in: ['TEAM_TO_FREE', 'TEAM_TO_DISABLED'] } },
        { orgPlanCancellationAction: { $in: ['TEAM_TO_FREE', 'TEAM_TO_DISABLED'] } }
      ]
    }
  },
  {
    $lookup: {
      from: 'billing.billingRecords',
      localField: '_id.orgId',
      foreignField: '_id.orgId',
      as: 'history',
      pipeline: [
        { $sort: { '_id.periodEnd': -1 } },
        { $limit: 12 },
        {
          $project: {
            _id: 0,
            periodStart: '$_id.periodStart',
            periodEnd: '$_id.periodEnd',
            plan: 1,
            processed: 1,
            sendInvoice: 1,
            messages: 1,
            contributorCount: 1,
            executionCredits: 1,
            computeCredits: 1,
            aiCredits: 1,
            flatPricePercentage: 1,
            hasDiscount: 1
          }
        }
      ]
    }
  },
  {
    $lookup: {
      from: 'cloudOrganizations',
      localField: '_id.orgId',
      foreignField: '_id',
      as: 'org',
      pipeline: [
        {
          $project: {
            name: 1,
            plan: 1,
            enabled: 1,
            disabledReason: 1,
            planTransitions: 1,
            createdAt: 1
          }
        }
      ]
    }
  },
  { $unwind: '$org' },
  {
    $project: {
      _id: 0,
      orgId: '$_id.orgId',
      churnPeriodEnd: '$_id.periodEnd',
      orgName: 1,
      action: '$organizationStatusChange.actionToTake',
      stripeCustomerId: 1,
      currentPlan: '$org.plan',
      enabled: '$org.enabled',
      disabledReason: '$org.disabledReason',
      planTransitions: '$org.planTransitions',
      history: 1
    }
  },
  { $sort: { churnPeriodEnd: -1 } }
]
```

`stripeCustomerId` here comes from the billing record (org doc's is nulled on churn).

---

## 3. Cross-check via planTransitions (find)

Catches any churn path incl. manual/admin transitions. Collection: `cloudOrganizations`

**Filter**

```js
{
  planTransitions: {
    $elemMatch: {
      plan: 'FREE',
      date: { $gte: ISODate('2026-04-23T00:00:00Z') },
      reason: 'TRANSITION_ORGANIZATION_TO_FREE_PLAN'
    }
  }
}
```

**Project**

```js
{ name: 1, plan: 1, planTransitions: 1 }
```

Then eyeball: the transition entry BEFORE the FREE one must be `plan: 'TEAM'` (array is chronological). Aggregation variant doing that check server-side:

```js
[
  {
    $match: {
      planTransitions: {
        $elemMatch: {
          plan: 'FREE',
          date: { $gte: ISODate('2026-04-23T00:00:00Z') },
          reason: 'TRANSITION_ORGANIZATION_TO_FREE_PLAN'
        }
      }
    }
  },
  {
    $addFields: {
      churnIdx: {
        $indexOfArray: [
          '$planTransitions.reason',
          'TRANSITION_ORGANIZATION_TO_FREE_PLAN'
        ]
      }
    }
  },
  {
    $addFields: {
      priorTransition: {
        $arrayElemAt: ['$planTransitions', { $subtract: ['$churnIdx', 1] }]
      }
    }
  },
  { $match: { 'priorTransition.plan': 'TEAM' } },
  {
    $project: {
      name: 1,
      plan: 1,
      churnedFrom: '$priorTransition.plan',
      churnDate: { $arrayElemAt: ['$planTransitions.date', '$churnIdx'] },
      planTransitions: 1
    }
  }
]
```

Caveat: `$indexOfArray` finds the FIRST matching transition. An org that churned twice shows its first churn only.

---

## 4. Historical invoice dollar amounts (probably stale)

`temp.historicalInvoices` (`MHistoricalInvoice`: `organizationId`, `periodStart/End`, `invoiceDollarAmount`, `stripeCustomerId`). Populated only by an adhoc CSV backfill (`UploadStripeInvoicesFromCsv.kt`). Check freshness first:

**Filter** (empty) / **Sort**

```js
{ periodEnd: -1 }
```

If latest `periodEnd` is old, ignore this collection.

---

## Results (2026-07-22 run)

- 47 orgs churned TEAM -> FREE over May/Jun/Jul cycles (17/18/12). All TEAM_TO_FREE, all invoiced.
- Stripe (dashboard CSV export joined locally): $138,315 paid last 12mo, ~$18k/mo churned MRR (~$215k ARR). Top 10 orgs = 80% of $. Unpaid left behind: $2,775.
- Big-spend sudden cancels: qawolf ($2.7k/mo), talview, archax-org (usage GROWING at churn), gto-wizard (1 period, $1.8k).
- Wind-downs (usage collapsed pre-cancel): sharethrough, AgriWebb, Dispel.
- Short-tenure (1-3 periods, low value): ~15 orgs. Zombies (paid, zero usage): IglesiaCucuta, Suhyl, YourPower, fkdldkRhya.
- Post-churn: 42 FREE enabled, 2 delinquent-disabled (Finni, outfox-ai), 2 disabled EXCEEDED_FREE_PLAN_INCLUDED_CREDITS (Evoluncite, DevPraxis = win-back targets), EVA already won back.
- Per-org invoice detail: `/Users/jack/Desktop/churned-team-stripe-summary.json`
- NOTE: Engineering/Stripe 1P item only has sk_test key. Live data via dashboard CSV export (Billing -> Invoices -> Export).

---

## Follow-up: usage/value investigation (churn reasons)

Aggregator ALREADY computes churn analytics monthly: `analytics.monthlyOrganizationChurn` (`MonthlyOrganizationChurn.kt`) - `totalEstimatedLostRevenue` + per-org `usesDTE`/`usesVCS`/`usesAllowedEmailDomains`/`billedExecutionsDuringCancellationPeriod`. Check before hand-rolling:

```js
// collection: analytics.monthlyOrganizationChurn - filter {} sort { periodEnd: -1 }
```

The 47 churned orgIds (from data-1):

```js
// ORG_IDS - paste into $in below
[ObjectId('6a202003d30e0a000ebf2579'), ObjectId('69ed2d71453df8557a746239'), ObjectId('69e432820680f8c80c4202b4'), ObjectId('69dbe71bd10ae19324cfafbb'), ObjectId('69d89d8fd10ae19324cfae64'), ObjectId('68e12f2167af86a2c0c23b7a'), ObjectId('69251aa32d086f788ea6fc5e'), ObjectId('67982f6d0ca9e6bbe458f1ae'), ObjectId('63d8eac0789732000ea65208'), ObjectId('648931b727bebb000dd23cc8'), ObjectId('638fa49cf22350000e46dccf'), ObjectId('64887959a9a686000dd31183'), ObjectId('6a0f819037660d51b980cb94'), ObjectId('69d53c03277f918d9c100ffb'), ObjectId('69c840dee0bfe2a5fbde22f5'), ObjectId('69c10e0430200b2111e62e1c'), ObjectId('637368e1de1eee000eb58612'), ObjectId('66fc2df0e701a83caf24f5b9'), ObjectId('67b1256a3144a5e46b28acfd'), ObjectId('6924d41e1c9b79799b8cc1f2'), ObjectId('64089c909dd79c000e4b9352'), ObjectId('62e1bab43ae53d0005f36d58'), ObjectId('681760031b6283edd08d358c'), ObjectId('6470b443632b5d000d3295ae'), ObjectId('672e8400e7535d520b298dbd'), ObjectId('6668d4b67b80ef937933b0b4'), ObjectId('65a30aa3434a7aacfb615ef6'), ObjectId('64d649ad07dd44004a174d74'), ObjectId('649516bdd6ddc3000d6ff361'), ObjectId('61415eb7aaa00c000553b05a'), ObjectId('69ec78f499218476b593585d'), ObjectId('69bd18b72768fa3ceac2f837'), ObjectId('69bd3246d90141e4edf552b5'), ObjectId('69a7563e8dc0617bb3b4525e'), ObjectId('69b495177439c2ff065a7dfd'), ObjectId('6989283e2465087bc8c015fb'), ObjectId('66ace98ac3f994e3434e9ac2'), ObjectId('69827028fd732623c9dde7e5'), ObjectId('6983cc93bf0f4264d6059312'), ObjectId('696220b3131c1b679696c862'), ObjectId('68a21e34208cf06ccafc8fab'), ObjectId('682d17590aaaaa6e8848abfb'), ObjectId('671d132e708e87939df86598'), ObjectId('6788d126143bdb4f7ecbfa6e'), ObjectId('66d8c958f54fb357c8b3ac98'), ObjectId('675373aa2be89466ff1627af'), ObjectId('648745c727bebb000dd23645')]
```

### Q5. Value snapshot per org (analytics.dailyProductUsage)

One doc per org per day: `avgExecutionDurationMs30Days`, `computationTimeSavedMs30Days`, `cacheHitRate30Days`, `agentsEnabled`, run/execution counts, credits, member counts. Last doc per org (state at churn) - aggregation on `analytics.dailyProductUsage`:

```js
[
  { $match: { organizationId: { $in: /* ORG_IDS */ [] }, date: { $gte: ISODate('2026-01-01T00:00:00Z') } } },
  { $sort: { date: 1 } },
  {
    $group: {
      _id: '$organizationId',
      lastDate: { $last: '$date' },
      avgExecDurationMs30d: { $last: '$avgExecutionDurationMs30Days' },
      timeSavedMs30d: { $last: '$computationTimeSavedMs30Days' },
      cacheHitRate30d: { $last: '$cacheHitRate30Days' },
      agentsEnabled: { $last: '$agentsEnabled' },
      execCount30d: { $last: '$executionCount30Days' },
      runCount30d: { $last: '$runCount30Days' },
      workflowCount30d: { $last: '$workflowCount30Days' },
      members: { $last: '$memberAccountsCount' }
    }
  },
  {
    $lookup: { from: 'cloudOrganizations', localField: '_id', foreignField: '_id', as: 'org',
      pipeline: [{ $project: { name: 1 } }] }
  },
  { $unwind: '$org' },
  { $project: { orgName: '$org.name', lastDate: 1, avgExecDurationMs30d: 1, timeSavedMs30d: 1,
      timeSavedHours30d: { $divide: ['$timeSavedMs30d', 3600000] },
      cacheHitRate30d: 1, agentsEnabled: 1, execCount30d: 1, runCount30d: 1, workflowCount30d: 1, members: 1 } },
  { $sort: { timeSavedHours30d: -1 } }
]
```

Interpretation: high $/mo + low `timeSavedHours30d` + short `avgExecDurationMs30d` = paying for cache on already-fast tasks (price-shock churn). High time saved + churned anyway = price/competitor problem, different conversation.

For the trend version (wind-down vs price-shock): drop the $group, keep `{ organizationId, date, computationTimeSavedMs7Days, executionCount7Days }`, export, plot per org.

### Q6. Workspaces for the churned orgs

```js
// collection: workspaces
// Filter:
{ orgId: { $in: /* ORG_IDS */ [] } }
// Project:
{ orgId: 1, name: 1, createdAt: 1 }
```

### Q7. CIPE durations pre-churn (ciPipelineExecutions - BIG collection, keep window tight)

All 66 workspace IDs from Q6 inlined (if it runs slow, split date window in half):

```js
[
  {
    $match: {
      workspaceId: { $in: [ObjectId('6140323e95c5a42eae48bfb9'), ObjectId('63cf18e52d1a5b3171c3883d'), ObjectId('63647846510d372802e23854'), ObjectId('643ed6bdcfcd382350a5a782'), ObjectId('69426d9077c10e4fc6a90882'), ObjectId('638fa4647758723ea968a077'), ObjectId('6695423ea917eb56cb698d30'), ObjectId('63d90a8fd7e6fe2c26d39df4'), ObjectId('65a78f8e0779e73f1c7ac240'), ObjectId('65acca4a7f99a318462cbc33'), ObjectId('65ad4ddad3ef5934de4c4a03'), ObjectId('642d589653bcdb606a49903d'), ObjectId('6411acb9df78795db6b66e40'), ObjectId('648748696d869c50f961f934'), ObjectId('64887c786d869c50f9943efd'), ObjectId('64a780a46076e12694ead541'), ObjectId('648fb8e919a559205f8e37b3'), ObjectId('64d649bfe0c4630d343add3e'), ObjectId('67fcecf20afee6727a0dfeb7'), ObjectId('65a30bafa94b8f44bf4bae4d'), ObjectId('6668d527b947870256a2df3e'), ObjectId('69a0d11f82ff6648172af55f'), ObjectId('66902e9dc090265e4be9a474'), ObjectId('66fc2e259fb700eb0f226f59'), ObjectId('6747d6b916a73d0f654febe7'), ObjectId('672e8194c001b020b59e2d46'), ObjectId('6774ac0b5f5bc034e80654a7'), ObjectId('67537298c663744591de7d2f'), ObjectId('676e09a3df2f9b1dfedd0f7a'), ObjectId('67982f846e6d27be153f4002'), ObjectId('679a8268a64c944fef1e2d15'), ObjectId('675f539cb8ebfd314203a1bb'), ObjectId('67b11f84fd2afb07f5e715d9'), ObjectId('6816a02a288e1b196ec3a00c'), ObjectId('681805901b6283edd08d35e7'), ObjectId('681763a86be424df03706f44'), ObjectId('697886889ab868fb823beef3'), ObjectId('682d1775f4b89e409c43e2c1'), ObjectId('689c5b913f8fa9251b4e6750'), ObjectId('68beb4a51178a4abfe4620a1'), ObjectId('68e13322b3d9b2316c1ef7ac'), ObjectId('68f123c9e2ac117d7d820de4'), ObjectId('696f849ce5b04fb9eb7a8040'), ObjectId('69cfb5fbf78e31ce71994e18'), ObjectId('6924d44c3791f3524e974dad'), ObjectId('69251b845b108989c1859022'), ObjectId('69622aa44e47d7e73405d7bf'), ObjectId('6982702ab86b3bcdcc99b0ff'), ObjectId('698928929cc8c6c43ef9991c'), ObjectId('69a756438dc0617bb3b45263'), ObjectId('69b49518583897506a91d526'), ObjectId('69b8da49c2539c0816368fd6'), ObjectId('69bd32486296be89b3120ee1'), ObjectId('69c10e0696a7812389311bb2'), ObjectId('69c840df00e689469358f404'), ObjectId('69d53c058a682a0cbfcd5517'), ObjectId('69eaab21aba3b23f7caeadd0'), ObjectId('69d89d533bc962653410ba48'), ObjectId('6a02c368e1e4291bd9040675'), ObjectId('69dbe747d10ae19324cfafc0'), ObjectId('69eae10b0048fe6cc456c12c'), ObjectId('69e432a90a385e1f9dc98166'), ObjectId('69ec78f799218476b5935862'), ObjectId('69ed2d73a7de77ee74ec2ba5'), ObjectId('6a0f819176998022d5730ff8'), ObjectId('6a202005d30e0a000ebf257e')] },
      createdAt: { $gte: ISODate('2026-03-01T00:00:00Z'), $lt: ISODate('2026-07-01T00:00:00Z') },
      completedAt: { $ne: null }
    }
  },
  { $project: { workspaceId: 1, durationMin: { $divide: [{ $subtract: ['$completedAt', '$createdAt'] }, 60000] } } },
  {
    $group: {
      _id: '$workspaceId',
      cipeCount: { $sum: 1 },
      avgDurationMin: { $avg: '$durationMin' },
      p50DurationMin: { $percentile: { input: '$durationMin', p: [0.5], method: 'approximate' } },
      p90DurationMin: { $percentile: { input: '$durationMin', p: [0.9], method: 'approximate' } },
      under2MinPct: { $avg: { $cond: [{ $lt: ['$durationMin', 2] }, 1, 0] } }
    }
  },
  { $sort: { cipeCount: -1 } }
]
```

`$percentile` needs Mongo 7.0+; drop those two lines on older. `under2MinPct` directly answers "are they paying $1k+ for <2min pipelines".

### Q8. Feature adoption (already in exports)

- Nx Agents: `computeCredits > 0` in billing records (data-1/2) or `agentsEnabled` in Q5
- Self-healing AI: `aiCredits > 0` - only 7 of 47 ever used it
- Manual DTE: `usesDTE` flag in `analytics.monthlyOrganizationChurn`, or dte-analyzer skill for deep cut
- Flaky tests / sandboxing: `flakinessMetrics` / `sandboxReports` by workspaceId if needed

### Segment interpretation grid

| Segment | Test | Data |
| --- | --- | --- |
| 1. Big-spend sudden cancel | value received vs invoice: timeSaved hours, agent usage, CIPE durations | Q5 + Q7 + Stripe summary |
| 2. Wind-down | same as 1 but check trend: usage fell BEFORE cancel (migrated off) | Q5 trend variant |
| 3. Short-tenure / no value | onboarding depth: agentsEnabled ever? VCS connected? cacheHitRate? workflows? | Q5 + monthlyOrganizationChurn flags |

## Value analysis findings (2026-07-22, q5-v2 + q7 joined)

Full table: `/Users/jack/Desktop/churn-value-analysis.json`. Metrics: savedH@churn = computationTimeSavedMs30Days at last pre-churn snapshot; $/savedH = avg monthly invoice / saved hours; <2m% = CIPEs under 2 min (Mar-Jul window).

1. **High-value leavers (price/competitor, NOT value problem)**: qawolf ($2.7k/mo, 10,895 saved hrs/mo, $0.25/hr, 91% hit), talview ($0.42/hr, 81% hit), archax-org ($1.73/hr, usage growing), EVA/processfocus/lockdownmedia similar profile at smaller $. Left despite huge ROI -> exit interviews, win-back.
2. **Wind-downs (migrated off, cost cut)**: Dispel (peak 1,458 hrs -> 0 at churn), AgriWebb (925 -> 3, avg CIPE 65 min!), sharethrough (280 -> 1), contextfab (346 -> 0), nx@kenzz (84% decline). Got real value once; find where they went.
3. **Price-shock / thin value**: gto-wizard ($1,782/mo for 130 hrs = $13.7/hr, 66% CIPEs <2min, 1 period), Stirlingshire ($7.6/hr, 19% hit), Evoluncite, Agora, Finni, outfox-ai, Hexweavers, zwizzly ($9-30/hr). Jack's "paying $1k for <2min pipelines" hypothesis CONFIRMED for this bucket.
4. **Never onboarded (cache hit <20% at churn)**: Signivo 5%, KLR-Bus 7%, GebouwAssistent 1%, contextfab 0%, Phazebreak 0%, Travis-Waith-Mair 1%, Suhyl 0%, fkdldkRhya 0%, Stirlingshire 19%. Paid without ever configuring caching properly.
5. **Cross-cutting: agentsEnabled=false for ALL 47. AI credits: 7/47. Churners are cache-only customers.** Zero adoption of agents/AI/workflows among churned Team orgs. Retention lever hypothesis: multi-feature orgs stick (needs control comparison vs retained Team orgs).

Actionable:
- CS alert: paying org with cacheHitRate30Days < 20% after 30 days = onboarding intervention.
- Price-shock bucket: fast-pipeline orgs (high <2m%) get low cache ROI; packaging/positioning question.
- Win-back list: qawolf, talview, archax-org, Evoluncite (already blowing free tier), DevPraxis (same).
- Next: same value metrics on RETAINED Team orgs as control - does agents/AI adoption predict retention?

## Dollar amounts - Stripe needed

Real invoice totals require Stripe. Per `stripeCustomerId` from query 1/2:

```bash
stripe invoices list --customer cus_XXXX --limit 24
```

Rough proxy without Stripe: Team = per-contributor flat + credit overage, so `contributorCount` + credit fields in `history` (query 2) show whether usage was shrinking before churn.
