---
name: churn-analyzer
description: >
  Analyze Nx Cloud plan churn (Team/Enterprise) from the nrwl-api MongoDB plus
  Stripe invoice data: find churned orgs, quantify lost MRR, segment by value
  received (high-value leaver / wind-down / low-ROI / forced upgrade / zombie),
  compute no-Cloud counterfactuals, and produce a shareable report. Triggers on
  "churn analysis", "churned orgs", "who cancelled", "churn report", "lost MRR",
  "win-back list", "why did X cancel", "value analysis for churned customers".
---

# Churn Analyzer (Nx Cloud / ocean)

Full worked example (May-Jul 2026 Team churn): `ocean/.ai/2026-07-22/tasks/team-churn-mongo-queries.md` (queries) and `team-churn-report-2026-07.md` (report + definitions appendix). Reuse those queries; this file is the map.

## Workflow

1. **Find churn events** - `billing.billingRecords`: `plan: <PLAN>` + `organizationStatusChange.actionToTake` in `[TEAM_TO_FREE, TEAM_TO_DISABLED, PRO_TO_FREE, ...]` (older docs: deprecated `orgPlanCancellationAction`). One doc per org per period, compound `_id: {orgId, periodStart, periodEnd}`. Cross-check: `cloudOrganizations.planTransitions` (append-only `{plan, date, reason, source}`; churn = `reason: TRANSITION_ORGANIZATION_TO_FREE_PLAN`).
2. **$ impact** - Stripe. No dollar amounts in Mongo (billing records store credits only; `temp.historicalInvoices` is a stale one-off backfill). Get invoices via dashboard CSV export (Billing -> Invoices -> Export) and join on `Customer` column locally. MRR proxy = avg paid invoice over trailing 12mo per org.
3. **Value metrics** - `analytics.dailyProductUsage` (per org per day): `computationTimeSavedMs30Days`, `cacheHitRate30Days`, `avgExecutionDurationMs30Days`, counts. Export the DAILY SERIES and take the last doc BEFORE each org's churn date - a `$group/$last` snapshot reflects post-churn free-tier usage and understates value.
4. **Pipeline shape** - `ciPipelineExecutions` (BIG - tight date window, workspaceId $in): duration = `completedAt - createdAt`, compute `under2MinPct` per org. Workspaces: `workspaces.find({orgId: {$in: [...]}})`.
5. **Counterfactual (what cancelling costs them)** - `analytics.dailyTaskStatistics` per project+target: `averageDuration.cacheMissMs` vs `remoteCacheHitMs` + `cacheStatusRatio`. No-Cloud estimate: remote hits re-run at that task type's own measured miss duration; KEEP local hits (local cache is free Nx). Serial hours are the robust claim (parallelism-proof); wall time needs the parallelism caveat set (see report appendix).
6. **Join + report** - node .mjs scripts joining the JSON exports (Compass export format: `{$oid}`, `{$date}`, `{$numberLong}` wrappers - always unwrap). Report template = `team-churn-report-2026-07.md`: headline numbers, segments, feature adoption, post-churn state, action items, definitions appendix.

## Segment definitions (validated thresholds)

- **High-value leaver**: $/saved-hr < ~$2 at churn, high absolute saved hrs, no collapse. Price/competitor problem.
- **Wind-down**: >= 85% decline from 90d-peak saved hrs AND peak >= 100 hrs AND peak-era ROI < $5/hr. At-churn ROI is an artifact - they already left.
- **Genuine low-ROI**: $/saved-hr >= $5 at churn (or zero), excluding wind-downs.
- **Forced upgrade**: billing added within days of org creation = paid to pass free-tier gates (5 contributors / 50k credits, `Constants.kt`), not after seeing value.
- **Zombie**: ~zero usage AND ~zero invoices (billing scales with usage, so unused orgs pay ~$0).
- **Bill shock**: any paid invoice >= 2x trailing median (prior >= $50). Check ALL invoices, not just the final one. NOTE: spikes alone are weak churn predictors (~43% of Team customers spike 50%+ per year and stay); shock converts to churn when paired with thin value.

## Gotchas (each cost real time)

- `transitionOrgToFreePlan` NULLS `stripeCustomerId` on the org doc - take it from the billing record.
- `dailyProductUsage.agentsEnabled` is the `featureFlags.enableManagedAgents` flag, NOT usage. Agents usage = `computeCredits > 0` in billing records. Manual DTE consumes no compute credits (check `usesDTE` in `analytics.monthlyOrganizationChurn` or concurrent connections).
- `cacheHitRate` low does NOT mean "caching not configured" - caching is on for every plan; low = hits never happened for that workload (unstable inputs, everything-affected commits, few repeat runs).
- Aggregator ALREADY writes `analytics.monthlyOrganizationChurn` (est. lost revenue, usesDTE/usesVCS per churned org) - check it before hand-rolling.
- 1Password `Engineering/Stripe` item holds a TEST key (`sk_test_`) - live customers 404 with `resource_missing`. Use dashboard CSV export, or mint a restricted live key (read-only Customers+Invoices).
- Compass: dotted collection names (`billing.billingRecords`) are one collection; find bar = Filter box, Project/Sort under Options, re-click Find after edits; mongosh needs `db.getCollection('billing.billingRecords')`.
- `$percentile` in aggregations needs Mongo 7+.
- Team plan churn baseline (2026-07): ~1.4-1.5%/mo against ~1,044 active Team orgs.
- Feature-adoption stickiness is INVERTED (tested 2026-07, 972 Team orgs): sustained compute users churn at baseline (4.3% vs 4.6% per 3-cohort window); AI adopters churn 2.3x MORE (9.6% vs 4.1%, z~2.8); both-features worst (11.1%). Adoption = spend increase = bill-shock risk; only large orgs (>=3M exec credits) show compute correlating with retention. Do not claim "drive adoption for retention" without spend-preview mitigations.
- Validated signal precisions (2026-07, 615-org population, 5.9% base churn): zero saved hrs = 41%, cache hit < 20% = 14%, weak $/saved-hr (>=2) = 7%, invoice spike = 6% (228 counter-examples - spikes are NOT a churn flag, even ANDed with weak value). $/saved-hr medians: retained $2.46 vs churned $7.59. Always validate a proposed signal against the NON-churned population (precision + counter-examples) before recommending automation.
