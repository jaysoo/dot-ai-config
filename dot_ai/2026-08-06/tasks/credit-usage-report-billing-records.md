# Credit usage report: billing records, org rollup, licensed allowance

Follow-up to CLOUD-4878 / lighthouse PR #77. No Linear ticket - driven by Slack
threads with Miro and Altan. **MERGED: lighthouse PR #83 (`00e7369`), 2026-08-06.**

Polygraph session `credit-usage-lighthouse-follow-up-405aebca` - nrwl/lighthouse +
nrwl/ocean -
https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/credit-usage-lighthouse-follow-up-405aebca

## What shipped

`/dpe-tools/credit-usage-report` now reads `billing.billingRecords` instead of
`billing.workspaceCreditUsage`. One row per org per billing month, with the licensed
allowance and a remaining balance. New `billing_record_snapshots` table, projecting Mongo
query, and a collector on the daily portal refresh scoped to the current month plus two
prior full months (usage invoicing starts 2026-08-15).

Also: execution count read from the record rather than derived; organization is the primary
lookup so a shared-instance customer is findable by name; tenant cell links to the org's
portal page; the granularity/grouping toggles and the workspace dimension were removed
entirely once invoicing only needed org-months.

Portal bug fixed on the way: weekly credit figures double-counted an ISO week straddling a
billing month, adding two months' running totals. Differenced per billing month first, then
merged. Celonis week 27 read 4.5M between week 26's 3.9M and week 28's 1.2M.

## Findings worth keeping

**`billing.workspaceCreditUsage` is a daily month-to-date snapshot, not a delta.** Verified
in ocean's writer (`CalculateCreditUsageByWorkspace.kt`): keyed `(workspaceId, date at UTC
midnight)`, upserted with `$set` not `$inc`, computed over `[periodStart, dataAsOf)` where
`periodStart` is the 1st of the **calendar** month. So the reset is the calendar month, not
the license anniversary. Never sum across dates - ocean says so itself at
`organization-billing-usage.server.ts:328-331`.

**Altan: it is not the source of truth.** It can miss the last minutes of a month, so a
whole-month figure cannot be trusted for invoicing. `billing.billingRecords` is written once
per billing period and is what invoices are built from. That is why the report moved.

**Execution credits DO count against the allowance** - five independent ocean sites (invoice
discount math, invoice eligibility gate, enterprise cap enforcement, license audit, usage
notifications). No execution-excluding path exists anywhere. The portal's comment claiming
enterprise justifies omitting them has no support in ocean. Prod census: execution credits
nonzero on 172,835 of 322,123 NA usage docs (53.7%), and PayFit alone carries ~72M/year
against 39.6M compute. **Still excluded in both surfaces by Jack's decision** so they agree
rather than disagree; `BillingRecords.credits_against_allowance/1` is the single flip point.
Pending sync with Joe.

**Two unequal denominators in ocean.** Invoice discount uses `baseIncludedCredits +
additionalCredits`; enforcement uses a `CreditPool` of `baseIncludedCredits + active
modifiers` and ignores `additionalCredits` entirely. The report's Total is the **invoicing**
allowance, not the enforcement threshold.

**`additionalCredits` is a grant, not overage.** No writer of a non-empty map in the current
tree; one key ever in git history (`"Promotional Signup Credits"`, since migrated to
modifiers). Confirmed empty across production NA.

**`runCount` is cache-enabled Nx runs, CI and local** - from
`analytics.dailyWorkspaceRunCounts`. Neither CIPEs nor task executions, so it does not
answer "execution count".

**No `executionCount` on `workspaceCreditUsage`** - confirmed by a 2000-doc prod key census
(only count fields are `runCount`, `sandboxReports`, `workflowMetricsUploads`). It lives on
`MBillingRecord` in `billing.billingRecords`, per billing period. Altan was right the field
exists, wrong about which collection.

**`aiCredits` is absent on ~60% of usage docs** (808 of 2000 sampled). The portal pipeline
guarded it with `$ifNull`; the per-workspace one did not, so the same workspace stored NULL
via one collector path and 0 via the other. Fixed.

**Lighthouse collects 4 of 9 charged credit fields.** `resourceUsageCredits`,
`sandboxReportCredits` and three caching-add-on fields are in `invoiceEligibilityCredits`
and uncollected. Narrow in practice: present on ~8.5% of sampled docs, nonzero on ~0.3%, and
gated to PRO/TEAM/OSS, so they likely never touch the enterprise-only allowance columns.

**A shared-instance customer is an org, not a tenant.** PayFit shows as tenant `ProdNA`, org
`PayFit`. The weekly `CreditUsageWorker` rejects shared instances by design (an unscoped
query would enumerate every customer we host); they are collected only through the
allowlist-scoped portal path. This is why PayFit looked "missing" from the report - it was
there, filed under ProdNA.

## Process notes

- Two Polygraph delegations to nrwl/ocean deadlocked on permission gates, ~200k subagent
  tokens for nothing. Jack's own permissioned agent answered five questions thoroughly in
  one pass. Prefer that route for ocean source questions.
- `rg -r` is `--replace`, not recursive. A child agent burned its budget on
  `rg -rn "executionCount" apps libs`, which searches for "apps" in `libs/`.
- The schema for `billingRecords` was discoverable from lighthouse itself - a pre-existing
  `Queries.BillingRecords` catalog module does an unprojected `find` and revealed the
  composite `_id.orgId` / `_id.periodStart` key. Asked ocean for it three times first.

## Local dev

Seeds under `priv/repo/seeds/`, all dev/test-guarded (they delete rows keyed on real prod
org ids and `priv/` ships in releases):

- `credit_usage_demo.exs` - island + emeria fixtures, Jun/Jul 2026
- `import_credit_usage_csv.exs` - loads a report CSV export; reconstructs the missing billing
  month from cumulative monotonicity and verifies it. Used to load real PayFit/ProdNA data
  (700 rows -> 9 org-months) without instance credentials.
- `set_license_credits.exs` - adjusts one org's allowance and license window

PayFit reconciles: monthly rows sum to 48,198,851, matching the portal's 48.2M/81.6M bar.

## Open

- Execution-credit basis decision with Joe. Flip both surfaces together if it changes -
  including the portal, where it moves `Warnings.credit_percent/2` and can fire usage
  notifications for orgs never previously warned.
- First prod run of the new collector: projection field names came from ocean source, not a
  live document. The collector logs fields empty across every record, so drift warns rather
  than storing zeros.
- Compute vs AI credit meaning unverified (Jack's guess: Nx Agents / self-healing). AI may be
  the aggregate of all AI-billed features rather than self-healing specifically, so no
  footnote was written for either.
- Unbounded-ish: the collector re-fetches its whole window daily. Fine at a few dozen periods
  per org.
- pmariglia wrote the original report (Apr 2026) and the shared-instance allowlist scoping;
  worth their review since this replaces their data source.
