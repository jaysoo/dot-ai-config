# Summary - 2026-08-06

## Credit usage report: billing records, org rollup, licensed allowance - MERGED lighthouse #83

PR https://github.com/nrwl/lighthouse/pull/83 merged as `00e7369`. Plan:
`dot_ai/2026-08-06/tasks/credit-usage-report-billing-records.md`. Follow-up to CLOUD-4878
(already Done since 2026-07-30) with no ticket of its own - driven by Slack with Miro and
Altan.

Polygraph session `credit-usage-lighthouse-follow-up-405aebca` - nrwl/lighthouse +
nrwl/ocean -
https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/credit-usage-lighthouse-follow-up-405aebca

- **Data source switched to `billing.billingRecords`.** Altan: `workspaceCreditUsage` is a
  daily month-to-date snapshot that can miss the last minutes of a month, so it is not the
  source of truth for a whole-month invoice figure. New `billing_record_snapshots` table,
  projecting Mongo query, and a collector on the daily portal refresh scoped to the current
  month plus two prior full months (usage invoicing starts 2026-08-15). Records already exist
  in Mongo for past periods, so one run backfills the window.
- **Report is one row per org per billing month** with Credits Consumed, Remaining and Total
  against the licensed allowance, plus Execution Count read from the record rather than
  derived from credits / 500. Granularity and grouping toggles and the whole workspace
  dimension were removed once invoicing only needed org-months. Allowance now comes from the
  `planLimits` embedded on each record, so a month keeps the denominator it had at the time.
- **Portal boundary-week bug fixed.** Weekly credit figures double-counted an ISO week
  straddling a billing month, adding two months' running totals together (Celonis week 27 read
  4.5M between week 26's 3.9M and week 28's 1.2M). Differenced per billing month first, then
  merged.
- **Org is now the primary lookup.** A shared-instance customer is an org, not a tenant -
  PayFit is org `PayFit` on tenant `ProdNA`, which is why it looked missing from the report.
  Findable by its own name now.
- **Execution credits verified to count against the allowance** across five ocean sites, and
  nonzero on 53.7% of production NA usage docs, so the portal's long-standing exclusion is
  wrong and not harmless. Kept excluded in both surfaces by Jack's decision so they agree;
  `BillingRecords.credits_against_allowance/1` is the single flip point. Pending sync with Joe.
- Other verified findings: `additionalCredits` is a grant not overage (empty across prod NA);
  `runCount` is cache-enabled Nx runs including local, not CIPEs; no `executionCount` on
  `workspaceCreditUsage` (2000-doc key census) - it is on `MBillingRecord`; `aiCredits` absent
  on ~60% of docs and one collector path stored NULL where the other stored 0 (fixed);
  lighthouse collects 4 of 9 charged credit fields.
- Process: two Polygraph delegations to ocean deadlocked on permission gates (~200k subagent
  tokens, no result); Jack's own permissioned agent answered five questions in one pass. The
  `billingRecords` schema turned out to be discoverable from lighthouse's own pre-existing
  catalog query module. Final pass removed 537 lines of code left dead by the switch and
  trimmed seven over-long or stale comments.

Removed from Active Claude Sessions: `/Users/jack/projects/lighthouse`
(`feature/cloud-4878-usage-charges`) - CLOUD-4878 Done since 2026-07-30 and this follow-up
merged today.

## In flight (see task files)

- **Meta-harness / Polygraph keyword + prompt discovery** (`dot_ai/2026-08-06/tasks/metaharness-keyword-research.md`):
  multi-phase research run, outputs under that folder's `output/`.
