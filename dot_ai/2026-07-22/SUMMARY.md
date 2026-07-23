# 2026-07-22 Summary

## Team plan churn analysis (main, no commits - data analysis)

Built the full Team-churn picture for May-Jul 2026 from prod Mongo + Stripe:

- 47 orgs churned TEAM -> FREE (17/18/12 per cycle). ~$18k/mo churned MRR (~$215k ARR), 80% of $ in top 10 orgs.
- Mongo queries: `billing.billingRecords` (churn = `organizationStatusChange.actionToTake`), `cloudOrganizations.planTransitions`, `analytics.dailyProductUsage` (value), `ciPipelineExecutions` (durations), `analytics.dailyTaskStatistics` (counterfactual).
- Stripe: 1P Engineering/Stripe key is sk_test (all live customers 404) - used dashboard CSV export joined locally instead.
- Segmented churn: high-value leavers (qawolf/talview), wind-downs (Dispel/AgriWebb/sharethrough), bill shock + low ROI (gto-wizard, archax-org 5.3x invoice jump after enabling agents+AI same month), forced upgrades that never saw value (cache hit <20%), zombies.
- qawolf counterfactual from their own miss durations: 4.2 min CIPE wall -> ~15-18 min without Cloud (+7,648 compute hrs/mo), caveats documented.
- Artifacts: `tasks/team-churn-mongo-queries.md` (all queries), `tasks/team-churn-report-2026-07.md` (shareable report), Desktop JSON exports + `churn-value-analysis.json`.
