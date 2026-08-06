# Lighthouse Architecture

Phoenix 1.8 internal application for tenant management and engineering metrics (SPACE framework).

## Quick Reference

| Item | Value |
|------|-------|
| Framework | Phoenix 1.8 / LiveView |
| Elixir | See `.tool-versions` |
| Database | PostgreSQL (binary UUIDs) |
| Auth | Google OAuth via Ueberauth (`user_session_controller.ex`, `LighthouseWeb.UserAuth`) |
| Mailer | Mandrill (prod) / Local (dev) |
| HTTP Client | Req |
| GraphQL Client | Neuron (Linear API) |

## Domain Contexts

### Expected State (`lib/lighthouse/expected_state.ex`)
Tenant feature management and reporting.
- Tracks which features are enabled per tenant
- Syncs tenants from YAML config files
- Audit trail via Reports + ReportFeatures join

### Space Metrics (`lib/lighthouse/space_metrics.ex`)
Engineering productivity metrics collection and calculation.
- GitHub: PRs, commits, cycle time, review participation
- Linear: Issues, planning accuracy, completion rates
- Monthly/quarterly/custom date range queries
- Database-backed config with runtime updates

### Emails (`lib/lighthouse/emails.ex`)
Transactional email with domain allowlist (nrwl.io, nx.dev).
- Tracks sent/blocked emails
- Mandrill adapter for production

### Credit Usage & Billing (`lib/lighthouse/billing_records.ex`, `lib/lighthouse/credit_usage.ex`)
Enterprise credit consumption pulled from each tenant's Mongo instance. Two collections,
two tables, two purposes - do not mix them up:

- **`Lighthouse.BillingRecords`** reads Mongo `billing.billingRecords` into
  `billing_record_snapshots`. Per org, per billing period. **Source of truth for
  consumption**; what `/dpe-tools/credit-usage-report` reads for invoicing. Each record
  embeds its own `planLimits`, so a month keeps the allowance it had at the time.
- **`Lighthouse.CreditUsage`** reads Mongo `billing.workspaceCreditUsage` into
  `credit_usage_snapshots`. Per workspace, per ISO week. Serves the customer portal's
  recent-weeks and workspace-breakdown views only - billing records have no workspace or
  week dimension.

### Customer Portal (`lib/lighthouse/customer_portal.ex`)
Per-org enterprise views at `/dpe-tools/portal/:instance_slug/:org_id`. Org snapshots carry
the license window and `base_included_credits` + `additional_credits` (the licensed
allowance, summed by `licensed_credits/1`). Collection is gated on an **org allowlist**
(`CustomerPortal.AllowedOrgs`).

## Key Schemas

```
tenants
  id (binary_id PK)
  name (unique)
  cloud (aws | gcp | azure | on_prem)
  cloud_provider_target, url_prefix, region, status
  └── reports (1:N)
        └── report_features (join to features)

features
  id (binary_id PK)
  name (unique)
  description

billing_record_snapshots            # source of truth for invoicing
  unique (tenant_id, org_id, period_start)
  period_start/period_end, billing_year, billing_month
  execution_credits, compute_credits, ai_credits (bigint)
  resource_usage_credits, sandbox_credits, docker_*, npm_* (collected, unused)
  execution_count
  base_included_credits, additional_credits   # allowance as of that period

credit_usage_snapshots              # portal weekly/workspace views only
  unique (tenant_id, workspace_id, billing_year, billing_month, iso_week, year)
  week_start/week_end = raw slice dates, NOT the ISO week range

customer_portal_org_snapshots
  unique (tenant_id, org_id)
  license_start_date, license_end_date
  base_included_credits, additional_credits

space_metrics_* (11 tables)
  - github_prs: PR metadata, reviewers, merged_at
  - github_commits: commit data
  - linear_issues: issues with state/assignee
  - fetch_log: fetch operation history
  - linear_teams: configured teams
  - github_repos: configured repos
  - team_members: member mapping
  - bot_accounts: exclusion list
  - pr_baselines: trend baselines
```

## Web Layer

### LiveViews (`lib/lighthouse_web/live/`)

| Path | Module | Purpose |
|------|--------|---------|
| `/` | `HomeLive` | Dashboard with quick access cards |
| `/tenants` | `TenantLive.Index` | List active tenants |
| `/tenants/:id` | `TenantLive.Show` | View/edit tenant |
| `/dpe-tools` | `DpeToolsLive.Index` | Sales/dev productivity tools |
| `/infra-tools` | `InfraToolsLive.Index` | Infrastructure hub |
| `/infra-tools/features` | `TenantFeaturesLive` | View feature assignments |
| `/infra-tools/features/manage` | `ManageFeaturesLive` | Create/edit features |
| `/engineering-tools` | `EngineeringToolsLive.Index` | Engineering hub |
| `/engineering-tools/space-metrics` | `SpaceMetricsLive` | Metrics visualization |
| `/engineering-tools/space-metrics/data/*` | `SpaceMetricsData.*` | Data fetching, logs, raw data |
| `/engineering-tools/space-metrics/settings/*` | `SpaceMetricsSettings.*` | Config (teams, repos, members) |

### Router Structure (`lib/lighthouse_web/router.ex`)
- Health check: `GET /health`
- Dev routes: LiveDashboard, Mailbox preview
- Main app: All LiveViews under `/` browser pipeline

## External Integrations

### GitHub API (`lib/lighthouse/space_metrics/github/`)
- `client.ex`: HTTP wrapper (Req)
- `pr_collector.ex`: PR data fetching
- `commit_collector.ex`: Commit data fetching
- GraphQL + REST API support
- Exponential backoff retry

### Linear API (`lib/lighthouse/space_metrics/linear/`)
- `client.ex`: GraphQL via Neuron
- `issue_collector.ex`: Issue fetching
- Service account: `lighthouse-linear-bot@nrwl.io`

### Required Environment Variables
```bash
GITHUB_TOKEN        # Fine-grained PAT
LINEAR_API_KEY      # Linear service account
MANDRILL_API_KEY    # Email delivery (prod)
DATABASE_URL        # PostgreSQL connection
SECRET_KEY_BASE     # Phoenix secret (prod)
```

## Background Workers

**Supervision Tree** (`lib/lighthouse/application.ex`):
1. `Lighthouse.Repo` - Ecto
2. `Lighthouse.PubSub` - Phoenix PubSub
3. `Lighthouse.SpaceMetrics.FetchRunner` - Background fetcher
4. `Lighthouse.SpaceMetrics.DailyFetchWorker` - Scheduled fetch (02:00 UTC)

**Oban crons** (`config/config.exs`, `Oban.Plugins.Cron`):
- `CreditUsageWorker` - Mon 03:00. **Rejects shared instances by design** (unscoped, it
  would enumerate every customer we host).
- `CustomerPortalRefreshWorker` - daily 04:00. Phases: organizations, credit_usage
  (`customer_portal: true`), billing_records, metrics, alerts. This is the **only** path
  that collects shared-instance (ProdNA/ProdEU) orgs, and it is allowlist-scoped.

## Configuration

### Static (`config/config.exs`)
- GitHub org: "nrwl"
- Quarter definitions (Q1-Q4)
- Daily fetch: 02:00 UTC
- Asset pipeline (Tailwind v4, esbuild)

### Runtime (`config/runtime.exs`)
- All API keys from env vars
- DATABASE_URL (with dev/test override)
- PHX_HOST, PORT

### Database Config (`space_metrics/config.ex`)
- Priority: DB tables > Application config
- Runtime updates without restart

## Asset Pipeline

**Tailwind v4** - No tailwind.config.js
```css
@import "tailwindcss" source(none);
@source "../css";
@source "../js";
@source "../../lib/lighthouse_web";
```

**esbuild** - ES2022 target, outputs to `priv/static/assets/`

## Testing

- `Phoenix.LiveViewTest` for LiveViews
- `Bypass` for API mocking
- `LazyHTML` for HTML assertions
- Element ID-based selectors (avoid brittle HTML)
- `start_supervised!` for process cleanup

## Development Commands

```bash
# Setup
mix setup

# Run server
mix phx.server

# Tests
mix test
mix test test/path_test.exs --trace

# Migrations
mix ecto.migrate
mix ecto.rollback

# Pre-commit (ALWAYS run before commit)
mix precommit
```

## Release

```bash
# Run migrations in production
bin/lighthouse eval "Lighthouse.Release.migrate()"

# Rollback
bin/lighthouse eval "Lighthouse.Release.rollback(Lighthouse.Repo, version)"
```

## File Structure

```
lib/
├── lighthouse/
│   ├── application.ex          # OTP supervisor
│   ├── repo.ex                 # Ecto repo
│   ├── expected_state.ex       # Tenant reporting context
│   ├── space_metrics.ex        # Metrics context
│   ├── space_metrics/          # Metrics submodules
│   │   ├── github/             # GitHub API
│   │   ├── linear/             # Linear API
│   │   ├── calculators/        # Metric calculations
│   │   └── workers/            # Background jobs
│   ├── emails.ex               # Email context
│   ├── tenant.ex               # Tenant schema
│   ├── feature.ex              # Feature schema
│   └── release.ex              # Release tasks
├── lighthouse_web/
│   ├── router.ex
│   ├── layouts/
│   ├── live/                   # All LiveViews
│   └── components/
config/
├── config.exs                  # Static config
├── dev.exs
├── test.exs
├── prod.exs
└── runtime.exs                 # Runtime env config
priv/
├── repo/migrations/            # Ecto migrations
└── static/                     # Compiled assets
```

## Design Decisions & Gotchas

### Credit usage
- **`billing.workspaceCreditUsage` docs are cumulative month-to-date, not deltas.** Keyed
  `(workspaceId, date at UTC midnight)`, upserted with `$set` not `$inc`, over
  `[periodStart, dataAsOf)` where `periodStart` is the 1st of the **calendar** month. Never
  sum across dates - sum across workspaces at one date. Reset is the calendar month, not the
  license anniversary.
- **It is not the source of truth.** It can miss the tail of a month (last aggregator run
  before midnight), so a whole-month figure is unreliable. Use `billing.billingRecords`.
- **A shared-instance customer is an org, not a tenant.** PayFit is org `PayFit` on tenant
  `ProdNA`. Searching by tenant will not find them; that is why the report searches by org.
- **Execution credits DO count against the allowance** per ocean (invoice discount math,
  invoice eligibility, enterprise cap, license audit, notifications - five sites), and are
  nonzero on 53.7% of prod NA usage docs. Both the report and the portal nonetheless
  **exclude** them, deliberately, so the two agree.
  `BillingRecords.credits_against_allowance/1` is the single flip point. Unresolved as of
  2026-08-06.
- **Two unequal denominators in ocean.** Invoicing uses `baseIncludedCredits +
  additionalCredits`; enforcement uses a `CreditPool` of base + active modifiers and ignores
  `additionalCredits`. The report's Total is the invoicing allowance, not an enforcement cap.
- `runCount` is cache-enabled Nx runs, CI **and local** - not CIPEs, not task executions.
- No `executionCount` on `workspaceCreditUsage` (verified by prod key census); it lives on
  `MBillingRecord`.
- Lighthouse collects 4 of 9 charged credit fields. The add-on types are gated to
  PRO/TEAM/OSS so they rarely touch enterprise figures.

### Seeds
`priv/repo/seeds/` scripts are **local dev only and guarded** - they delete rows keyed on
real production org ids, and `priv/` ships inside releases. `priv/repo/seeds.exs` (the
`ecto.setup` one) is unrelated.

## Personal Work History

### 2026-08-06 - Credit usage report to billing records (lighthouse PR #83, `00e7369`)
Switched `/dpe-tools/credit-usage-report` off `workspaceCreditUsage`. Added
`billing_record_snapshots`, `Lighthouse.BillingRecords`, `BillingRecords.Collector` (daily
portal refresh, rolling 3-month window - invoicing starts 2026-08-15), and
`Queries.CreditUsageBillingRecords`. Report became one row per org per billing month with
allowance and remaining balance; granularity/grouping toggles and the workspace dimension
removed. Fixed a portal bug double-counting boundary ISO weeks in
`recent_customer_weekly_usage/3`, `customer_workspace_usage/4`,
`latest_weekly_usage_summaries/1`. Removed 537 lines left dead by the switch.
Plan: `dot_ai/2026-08-06/tasks/credit-usage-report-billing-records.md`.

### 2026-07-30 - CLOUD-4878 credit usage report for invoicing (lighthouse PR #77)
ISO week range display, Org ID + workspace_id columns, tenant->org sort, and the
`planLimits.additionalCredits` map-read fix (was stored as 0, understating allowances).
Plan: `dot_ai/2026-07-21/tasks/tenant-usage-charges-invoice-report.md`.

### 2026-04 - Original credit usage report (pmariglia)
Report page with workspace/org selection + CSV export, and the Oban weekly cron. Also the
shared-instance allowlist scoping (2026-07-24). Worth their review on changes to this area.

## Notable Patterns

1. **Contexts** separate business logic from web
2. **Collectors** abstract external API calls
3. **Calculators** perform metrics computation
4. **Binary UUIDs** for all primary keys
5. **UTC timestamps** throughout
7. **Req** for HTTP (not HTTPoison/Tesla)
8. **Rustler** for native secrets (NIF)
