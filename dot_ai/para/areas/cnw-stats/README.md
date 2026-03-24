# CNW Stats Tracking

**Priority: HIGH** | Cadence: Weekly (experiments + stats review)

Ongoing tracking of create-nx-workspace (CNW) telemetry from the `commandStats` MongoDB collection.

## Purpose

Monitor CNW funnel health, error rates, cloud adoption, and regressions across Nx versions.

## Key Metrics

| Metric | What to Watch |
|--------|---------------|
| **Funnel conversion** | start → precreate → complete rates |
| **Error rate** | % of starts that hit errors, by error code |
| **Cloud adoption** | % of completions choosing cloud (yes/CI provider) vs skip/never |
| **Version adoption** | How quickly users move to new Nx versions |

## Standard Filters

All queries exclude CI runs, AI agent runs, and @contentful/nx preset (see `/cnw-stats-analyzer` skill for details).

## Baseline Metrics (22.5.4, as of Mar 17 2026)

- **Start → Precreate**: ~78%
- **Precreate → Complete**: ~87%
- **Error rate**: ~7-8%
- **Cloud adoption**: ~41% (when CI provider prompt was shown)

## Known Changes

### 22.6.0 (released Mar 18, 2026)

**Cloud prompt change (intentional):**
- Removed the CI provider prompt — it was misleading users into connecting to Cloud by asking about CI rather than Cloud directly
- Now users only see a direct "connect to Nx Cloud?" prompt (yes/skip/never)
- Cloud adoption dropped from ~41% → ~12%
- **Target**: 20% cloud adoption rate
- **Plan**: A/B test different messaging to improve the rate from ~12% toward the 20% goal

**Workspace name validation (regression):**
- New validation rejects names starting with non-letters
- `INVALID_WORKSPACE_NAME` errors went from 0 → 87/day
- Most common rejection: `.` (users wanting to scaffold in current directory via `npx create-nx-workspace .`)
- Also rejects: `./`, numeric-prefixed names (`2030`), dot-prefixed (`.myapp`)
- Error rate tripled: 7.8% (22.5.4) → 20.8% (22.6.0)

**New error: `DIRECTORY_EXISTS`:**
- ~18-29/day on 22.6.0, was 0 on 22.5.4
- Related to the `.` / `./` name handling change

### 22.6.1 (released Mar 20, 2026)

- Did NOT fix the workspace name validation regression
- Error rate: 21.8% (same as 22.6.0)
- `INVALID_WORKSPACE_NAME` and `DIRECTORY_EXISTS` persist

## Reports

| Date | File | Summary |
|------|------|---------|
| 2026-03-21 | `reports/2026-03-21-funnel.md` | Initial funnel analysis, identified 22.6.0 regressions |
