# Lighthouse Architecture

Phoenix 1.8 internal application for tenant management and engineering metrics (SPACE framework).

## Quick Reference

| Item | Value |
|------|-------|
| Framework | Phoenix 1.8 / LiveView |
| Elixir | See `.tool-versions` |
| Database | PostgreSQL (binary UUIDs) |
| Auth | None (internal app) |
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

## Notable Patterns

1. **Contexts** separate business logic from web
2. **Collectors** abstract external API calls
3. **Calculators** perform metrics computation
4. **Binary UUIDs** for all primary keys
5. **UTC timestamps** throughout
6. **No auth** - internal employee app
7. **Req** for HTTP (not HTTPoison/Tesla)
8. **Rustler** for native secrets (NIF)
