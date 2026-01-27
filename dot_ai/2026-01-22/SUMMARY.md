# Summary - 2026-01-22

## Completed Tasks

### NXC-3753: Make Nx Cloud CLI commands noop with warning
- **Linear**: https://linear.app/nxdev/issue/NXC-3753
- **Goal**: Prevent errors when running Nx Cloud commands without `nxCloudId` configured
- **Changes**:
  - Added `isConnectedToNxCloud()` and `warnNotConnectedToCloud()` helpers to `utils.ts`
  - Updated all Nx Cloud CLI command handlers to check for cloud connection first
  - Commands now show warning and exit gracefully instead of erroring
  - Special handling for `nx record`: still runs the command after `--`, just shows warning about recording
- **Files modified**:
  - `packages/nx/src/command-line/nx-cloud/utils.ts` - Added helper functions
  - `packages/nx/src/command-line/nx-cloud/fix-ci/fix-ci.ts`
  - `packages/nx/src/command-line/nx-cloud/record/record.ts` - Uses yargs `populate--` and `spawnSync`
  - `packages/nx/src/command-line/nx-cloud/record/command-object.ts` - Added `populate--` parser config
  - `packages/nx/src/command-line/nx-cloud/login/login.ts`
  - `packages/nx/src/command-line/nx-cloud/logout/logout.ts`
  - `packages/nx/src/command-line/nx-cloud/start-agent/start-agent.ts`
  - `packages/nx/src/command-line/nx-cloud/start-ci-run/start-ci-run.ts`
  - `packages/nx/src/command-line/nx-cloud/complete-run/stop-all-agents.ts`
- **Branch**: `NXC-3753`

### DOC-381: Clean up banner.json and add to gitignore
- **Linear**: https://linear.app/nxdev/issue/DOC-381
- **Goal**: Remove generated banner.json files from repo and gitignore them
- **Changes**:
  - Removed `astro-docs/src/content/banner.json` from git tracking
  - Removed `nx-dev/nx-dev/lib/banner.json` from git tracking
  - Added both paths to `.gitignore` with explanatory comment
- **Context**: These files are generated during static builds and were only needed temporarily for dev server during webinar banner testing
- **Commit**: `b35d2a720a chore(misc): remove banner.json files and add to gitignore`

### Lighthouse Architecture Documentation
- **Goal**: Create comprehensive architecture documentation for the lighthouse internal app
- **File**: `.ai/para/resources/architectures/lighthouse-architecture.md`
- **Summary**: Documented the Phoenix 1.8 application for tenant management and engineering metrics

**Key domains captured:**
- **Expected State**: Tenant feature management, YAML sync, audit trail
- **Space Metrics**: GitHub/Linear metrics (PRs, commits, issues, cycle time)
- **Emails**: Transactional email via Mandrill with domain allowlist

**Technical stack:**
- Phoenix 1.8 / LiveView, PostgreSQL (binary UUIDs)
- External APIs: GitHub (REST + GraphQL), Linear (GraphQL), Mandrill
- Background workers: DailyFetchWorker (02:00 UTC), FetchRunner
- No authentication (internal employee app)

**Documentation includes:** Domain contexts, schemas, LiveView routes, external integrations, env vars, background workers, configuration, asset pipeline, testing patterns, file structure

## Setup
- Created `.ai` symlink to `~/projects/dot-ai-config/dot_ai/`
- Created architectures directory at `.ai/para/resources/architectures/`
