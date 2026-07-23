# Tenant usage charges (invoice-ready) report

Date: 2026-07-21
Repo: nrwl/lighthouse
Status: IMPLEMENTED on `feature/cloud-4878-usage-charges` (5 commits, not pushed).
Linear: CLOUD-4878. Bucket slug note: `sandboxing` became `sandbox_report` in code to
match the `<slug>_credits` column convention.

## Goal

On each tenant page (`/tenants/:id`), show exactly what a customer owes in credit usage
charges for a chosen period, so an AE can copy-paste into an invoice. Every input to the
calculation lives in lighthouse, is editable, and has a default. The output is a real
number, not an estimate. A banner asks the AE to confirm it matches the contract/license.

## Decisions (confirmed with Jack 2026-07-21)

1. **Do not read the rate from the ocean license.** It is inside the encrypted license key
   and is often `0` anyway. The AE fills it in on the tenant page. Ocean constants supply
   only the seeded default.
2. **No "estimate" disclaimer.** Any input lighthouse is missing must be storable in
   lighthouse with a default. Then show a warning to confirm against contract/license.
3. **Rates are per credit bucket, per tenant.** A bucket negotiated as "included" gets rate
   `0`, so 15K AI credits at $0/credit contributes $0. No separate include/exclude flag.
4. **Latest-wins rates, audit trail.** No `effective_from` history.
5. **Match ocean's billing logic**, substituting our own rate and included-credit values.
6. **Dedicated compute cluster is included - never charged.** Do not model the committed-spend
   floor at all.
7. **Invoicing is per tenant.** Included credits and modifiers stay per-org, so charges compute
   per org and roll up to one tenant total.
8. **Backfill the last pay period** after the add-on buckets ship, for sanity checks against a
   real invoice.

## Ocean's actual invoice formula (verified in source)

`calculateInvoiceCreditDiscountQuantities` -
`apps/aggregator/src/main/kotlin/operations/billing/BillingUtils.kt:292`

```
# bucket-specific grants consumed first
executionDiscount = min(executionCredits, pool.executionCreditQuantity)
computeDiscount   = min(computeCredits,   pool.computeCreditQuantity)

# add-on usage, each net of its own EXCLUDE_*_ADD_ON_UNIT_RATE modifier
netAddOn = sum over 5 add-on buckets of max(0, raw - includedAddOnModifierCredits(bucket))

eligibleForUniversal = (executionCredits - executionDiscount)
                     + (computeCredits   - computeDiscount)
                     + aiCredits
                     + netAddOn

# ALL_CREDITS modifier grants, over and above the base allotment
bonusUniversal    = max(0, pool.universalCreditQuantity - baseIncludedCredits)
universalDiscount = min(eligibleForUniversal, bonusUniversal)

eligibleForIncluded = eligibleForUniversal - universalDiscount
includedDiscount    = min(eligibleForIncluded, totalIncludedCredits)

billableCredits = eligibleForIncluded - includedDiscount
```

Supporting definitions:

- `CreditPool` (`libs/shared/db-schema-kotlin/src/main/kotlin/Plan.kt:133`), built by
  `getCreditPoolForDateRange` (`Plan.kt:247`) from **active plan modifiers**:
  - `computeCreditQuantity` = sum of active `COMPUTE_CREDITS` modifiers
  - `executionCreditQuantity` = sum of active `EXECUTION_CREDITS` modifiers
  - `universalCreditQuantity` = `baseIncludedCredits` + sum of active `ALL_CREDITS` modifiers
- `totalIncludedCredits` (`Plan.kt:229`) = `baseIncludedCredits + sum(additionalCredits.values)`.
  **`additionalCredits` is a `Map<String, Long>`, not a scalar.**
- `netAddOnUsageCredits` / `includedAddOnPlanModifierCredits` -
  `PlanAddOnBillingUtils.kt:109` and `:147`
- Percentage plan modifiers per bucket are in flight (ocean PR #12129, still draft). Not
  modeled in v1; revisit once merged.

**Deliberately not modeled:** dedicated compute committed spend
(`shortfall = max(0, floor - committedSpendCredits)`, `StripeClient.kt` / PR #12132). Per
decision 6 the add-on is included and never charged. `DEDICATED_COMPUTE_CLUSTER` has no
`creditUsageField` either, so it contributes no usage credits - dropping it removes the only
path where the invoice could exceed usage x rate. State this in the module doc so nobody
"fixes" it later.

Then dollars. Ocean uses one `PRICE_PER_CREDIT_PRO`; **we use our per-bucket rates**, which
is the only intentional divergence:

```
amount_cents = sum over buckets of (billable_credits_in_bucket * rate_cents_per_1k / 1000)
```

Note: ocean's formula collapses everything into a single `billableCredits` scalar because it
has one price. With per-bucket rates we must keep the attribution. See "Bucket attribution"
below.

## Good news: almost nothing needs hand-entry

Only the license `key` string is encrypted. `planLimits` (including `modifiers`) and
`planAddOns` are **plaintext fields on `cloudOrganizations`** - lighthouse's existing
aggregation already reads `$planLimits.baseIncludedCredits`, it just does not project the
rest. Likewise the 5 add-on credit buckets live on the same
`billing.workspaceCreditUsage` documents the collector already queries.

| Formula input | Ocean source | Lighthouse today | How to close |
|---|---|---|---|
| execution / compute / AI credits | `billing.workspaceCreditUsage` | have it | - |
| resourceUsageCredits, sandboxReportCredits, dockerLayerCachingCredits, dockerReadThroughCacheCredits, npmReadThroughCacheCredits | same docs (`plan-add-on-metadata.ts:20-64`) | **not projected** | extend `MongoQuery.Queries.CreditUsage` pipeline + 5 columns on `credit_usage_snapshots` |
| `baseIncludedCredits` | `planLimits.baseIncludedCredits` | have it | - |
| `additionalCredits` | `planLimits.additionalCredits` (a Map) | **silently always 0 - bug** | sum the map values, see below |
| plan modifiers (`COMPUTE_CREDITS`, `EXECUTION_CREDITS`, `ALL_CREDITS`, `EXCLUDE_*_ADD_ON_UNIT_RATE`) | `planLimits.modifiers`, plaintext | not projected | project + persist on org snapshot |
| active plan add-ons | `planAddOns`, plaintext | not projected | project + persist on org snapshot (display only - drives the "which add-ons are on" detail row, not pricing) |
| $/credit per bucket | contract, not in Mongo | none | AE enters on tenant page, defaults from ocean constants |

So the only genuinely AE-supplied input is the rate table. Everything else gets synced, with
an AE override available on top for the cases where Mongo and the contract disagree.

### Bug: `additional_credits` is always 0

`lib/lighthouse/customer_portal/mongo.ex:99` does
`additional_credits: to_integer(doc["additionalCredits"])`. In Mongo that field is a
`Map<String, Long>` (`Plan.kt:210`), so it hits the `to_integer(_value), do: 0` catch-all at
`mongo.ex:139` and yields `0`. `CustomerPortal.licensed_credits/1`
(`lib/lighthouse/customer_portal.ex:69`) therefore understates included credits for every
org with promo or add-on credits, which would directly overstate the invoice.

Fix: sum the map values in the aggregation (`$sum: {$objectToArray: ...}`) or in
`format_org/1`. Worth shipping on its own regardless of this feature, since the customer
portal already displays the wrong number.

## Bucket attribution

Ocean's discount waterfall consumes grants across buckets in a fixed order and then prices
the remainder at one rate. With per-bucket rates we need to know which bucket each remaining
credit came from. Keep the waterfall order identical to ocean and track the residual per
bucket:

1. `EXCLUDE_*_ADD_ON_UNIT_RATE` modifiers reduce their own add-on bucket only.
2. `COMPUTE_CREDITS` / `EXECUTION_CREDITS` grants reduce their own bucket only.
3. `ALL_CREDITS` bonus, then `totalIncludedCredits`, are shared pools. Allocate in ocean's
   stable order: **execution, then compute, then AI, then add-on buckets**.
4. Price each bucket's residual at that bucket's rate.

Document the order in the module doc and pin it with tests. It is arbitrary but must be
deterministic and must match ocean, otherwise a tenant with different rates per bucket gets
a different total than the invoice.

## Data model

### `tenant_billing_profiles` (one row per tenant)

| column | type | notes |
|---|---|---|
| id | binary_id | |
| tenant_id | binary_id fk, unique | |
| rates | jsonb | bucket slug -> integer cents per 1000 credits. Missing key = use default. `0` = negotiated as included |
| included_credits_override | bigint, nullable | null = use synced org snapshot value |
| notes | text | "per MSA 2026-03, compute $0.45/1k, AI included" |
| confirmed_against_contract_at | utc_datetime, nullable | |
| confirmed_by_user_id | binary_id fk, nullable | |
| timestamps | | |

Bucket slugs (a `@buckets` module list, validated in the changeset):
`execution`, `compute`, `ai`, `resource_usage`, `sandboxing`, `docker_layer_caching`,
`docker_read_through_cache`, `npm_read_through_cache`.

jsonb rather than 8 columns so a new ocean bucket does not need a migration. Integer cents
per 1000 credits, mirroring ocean's `overageCreditCost` unit exactly. Never floats.

Per-tenant, per decisions 3 and 7. Multi-org tenants share the rate table; included credits
and modifiers stay per-org, so charges compute per org and roll up to one tenant total. The
per-org rows stay visible as a breakdown so a discrepancy is traceable, but the copyable
number is the tenant total.

Rate resolution: tenant profile value -> vendored ocean default. Every edit writes a
`Lighthouse.Audit` event (actor, tenant, bucket, old, new).

### Ocean-sourced defaults

```
libs/shared/db-schema-kotlin/src/main/kotlin/Constants.kt:114
const val PRICE_PER_CREDIT_PRO = 0.00055          # 55 cents per 1k credits
const val PRICE_PER_CREDIT_PRO_STARTUP = 0.000165 # 16.5 cents per 1k (rounds; store 17 or 165 per 10k)
```

Vendor `55` as the default for every bucket, in a module attribute with a comment citing that
file and line. Do not sync live.

### `customer_portal_org_snapshots` additions

`plan_modifiers` jsonb, `plan_add_ons` jsonb, and a fixed `additional_credits`. Keeps the
sync surface in one place and lets the charge calc run entirely off Postgres.

## Proposed modules

1. `Lighthouse.Billing.Rates` - profile CRUD, `resolve(tenant_id)` returning
   `%{bucket => %{cents_per_1k: 55, source: :tenant | :default}}`, audit on write.
2. `Lighthouse.Billing.UsageCharges` - direct port of
   `calculateInvoiceCreditDiscountQuantities` plus per-bucket attribution and pricing.
   Pure functions, integer arithmetic. Returns gross per bucket, discounts applied per
   bucket, billable per bucket, rate per bucket, amount per bucket, tenant total, plus
   per-month and per-workspace breakdowns.
3. `LighthouseWeb.TenantLive.Show` - "Usage Charges" card.

Port the ocean test cases directly:
`apps/aggregator/src/test/kotlin/operations/billing/InvoiceCreditDiscountQuantitiesTests.kt`
and `NetBillableCreditsTests`. Same inputs, same expected `billableCredits`. That is the
proof we match, and it will catch drift if ocean changes.

## Time range semantics

`billing.workspaceCreditUsage` rows are cumulative running totals within a billing month.
`MongoQuery.Queries.CreditUsage` takes `$last` per ISO week, so weekly rows within a month
are NOT additive. `CreditUsage.period_latest_monthly_rows/2` already handles this: latest
row per `{workspace_id, billing_year, billing_month}`, then sum across months. Any new math
must reuse it.

Consequence: range granularity is **billing month**, not arbitrary dates. Presets:

- License period to date (default - matches how enterprise overage is billed)
- Last full billing month
- Custom: start month -> end month

Included credits apply to the whole license period, not per month. The license-period figure
is the invoice-relevant one; the monthly table is supporting detail and must not subtract
included credits per month.

## UI sketch - tenant page card

```
Usage Charges                                    [Confirm against contract]
---------------------------------------------------------------------------
! Rates not confirmed since license renewed 2026-03-01. Verify before invoicing.

Period: [License period to date v]   Mar 1 - Jul 21, 2026

  Bucket        Gross        Included     Billable      Rate/1k     Amount
  Execution     4,100,000    4,100,000            0     $0.00        $0.00   [included]
  Compute       7,200,000    5,900,000    1,300,000     $0.55      $715.00
  AI            1,130,000            0    1,130,000     $0.00        $0.00   [included]
  Sandboxing       40,000       40,000            0     $0.55        $0.00
  ---------------------------------------------------------------------------
  Tenant total                                                      $715.00   [copy]

  Included credits: 10,000,000  (synced 2026-07-20)  [override]
  > By org (2)   > Monthly breakdown   > By workspace   > Applied modifiers

  [Edit rates]  [Copy for invoice]  [Export CSV]
```

- Every row shows a provenance chip: `synced` / `tenant override` / `default`.
- Banner states: red "rates never set", amber "not confirmed since <license start>", green
  "confirmed <date> by <user>".
- "Confirm against contract" stamps `confirmed_against_contract_at` + user, audited.
- CSV export reuses the `{:reply, %{content: csv, filename: ...}}` hook pattern already in
  `credit_usage_report_live.ex`.

## Phases

1. **Sync fixes** - fix `additionalCredits` map bug; project `planLimits.modifiers` and
   `planAddOns` in `customer_portal/mongo.ex`; add the two jsonb columns to
   `customer_portal_org_snapshots`. Ships value on its own (portal numbers get correct).
2. **Add-on usage** - extend the `MongoQuery.Queries.CreditUsage` pipeline with the 5 add-on
   credit fields; add 5 columns to `credit_usage_snapshots`; update the collector upsert.
   Then backfill (below).
3. **Rates** - `tenant_billing_profiles` migration, `Lighthouse.Billing.Rates`, ocean default
   constant, audit logging.
4. **Calc** - `Lighthouse.Billing.UsageCharges`, ported from ocean with its test cases.
5. **UI** - tenant page card, org + period selectors, rate editor, confirm flow, copy + CSV.

Later: add the same card to the customer portal Show page (it already has org context);
revisit percentage plan modifiers once ocean PR #12129 merges.

### Backfill (phase 2)

No new code needed. `Collector.refresh_all(customer_portal: true)` already re-queries **every
billing month of each org's license period** (`billing_periods_for_snapshot/2` ->
`month_periods/2` in `lib/lighthouse/credit_usage/collector.ex:151`) and upserts, and
`upsert_snapshot/2` replaces the credit columns on conflict. So once the pipeline projects
the 5 add-on fields, one manual run refills history for every portal-tracked org.

    # bin/lighthouse rpc (NOT eval - eval starts a node without Oban)
    Lighthouse.CreditUsage.Collector.refresh_all(customer_portal: true)

That covers more than the last pay period, at the cost of one pass over each tenant's Mongo.
If that is too heavy, cap it by passing `today:` set inside the target month. Sanity check:
pick one tenant, compare the last completed billing month against its real invoice, before
touching the rate table.

Caveat: this only refills orgs that have a `customer_portal_org_snapshots` row. Tenants
outside the portal set keep whatever the weekly cron collected. Confirm the invoicing set is
a subset of the portal set, or widen `refreshable_tenants/1` for the backfill run.

## Risks / gotchas

- Cumulative counters. Never sum weekly rows within a billing month.
- Bucket attribution order must match ocean exactly or per-bucket rates produce a different
  total than the invoice. Pin with tests.
- Integer money only. Cents per 1000 credits, divide last, round at the end.
- Multi-org tenants: compute per org (included credits and modifiers are per-org), then sum.
  Do not pool credits across orgs and subtract one included number.
- Modifier date windows: `isActiveInDateRange` is evaluated per billing period. A modifier
  active for part of a multi-month range applies only to the months it covers.
- Ocean drift. The ported test cases are the tripwire. Note in the module doc that the source
  of truth is `BillingUtils.kt` + `PlanAddOnBillingUtils.kt`.

## Resolved

- Dedicated compute committed spend: **not modeled**, add-on is included (decision 6).
- Invoice granularity: **per tenant**, org rows shown as a breakdown (decision 7).
- Backfill: **last pay period minimum**, via the existing customer-portal refresh path
  (decision 8).

## Still to verify during phase 1

- Is the invoicing tenant set a subset of the customer-portal tenant set? Drives whether the
  backfill path reaches every tenant that needs a charge report.
- Confirm `additionalCredits` really is a document in production data (the Kotlin model says
  `Map<String, Long>`; check one live org before writing the `$objectToArray` fix).
