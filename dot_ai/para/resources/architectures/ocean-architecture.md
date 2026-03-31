# Ocean Repository Architecture

## Overview

Ocean is the monorepo for Nx Cloud and related services. It uses Nx for workspace management and contains multiple applications, libraries, and services.

## Directory Structure

### Key Directories

- **apps/** - Application projects including:
  - `nx-cloud/` - Main Nx Cloud web application (Remix-based)
  - `nx-api/` - API services (Java/Kotlin)
  - `nx-background-worker/` - Background job processing
  - `aggregator/` - Data aggregation services
  - `file-server/` - File serving for artifacts
  - `machine-agent/` - Agent for distributed execution (Go)

- **libs/** - Shared libraries organized by:
  - `nx-packages/` - NPM packages published to registry
  - `nx-cloud/` - UI and feature libraries for the web app
  - `shared/` - Common utilities and models

- **tools/** - Development and deployment tooling
- **docker-setup/** - Docker configurations and scripts

## Features & Critical Paths

### Docker Release with Nx (2025-09-10)
**Last Updated:** 2025-09-10
**Branch:** NXC-2493
**Linear Task:** NXC-2493
**Commit:** 7a146758b
**Status:** In Progress

Implementing nx release support for Docker images to dogfood @nx/docker plugin while maintaining backward compatibility with existing pipeline.

#### Quick Start
Enable nx release for Docker builds by setting NX_RELEASE_DOCKER=true environment variable or using workflow_dispatch input in CI.

#### Files Involved
- `nx.json` - Added "apps" release group with Docker configuration
- `tools/build-and-publish-to-snapshot.sh` - Added NX_RELEASE_DOCKER conditional logic
- `.github/workflows/ci.yml` - Added workflow_dispatch input for use_nx_release
- `apps/*/Dockerfile` - Moved from apps/docker-setup/dockerfiles/ to respective projects
- `apps/*/project.json` - Added docker:build targets with minimal configuration
- `apps/nx-cloud-workflow-controller/cmd/*/project.json` - NEW: Separate projects for executor and log-uploader
- `package-scripts.js` - Updated all Docker build paths to new locations

#### Implementation Details
- All Docker projects use `docker:build` target (not docker-build)
- Target only needs `cwd: ""` and `file` options - no executor or command
- `nx-release-publish` target is inferred by @nx/docker plugin
- Repository names scoped to jaysoo83/ for testing
- Dockerfiles must be named exactly `Dockerfile` (not *.dockerfile)
- Workflow controller has 3 separate Docker images with sub-projects in cmd/

#### Dependencies
- @nx/docker plugin (21.5.0-beta.1)
- Docker buildx for multi-platform builds

### Docker Tagging and Publishing System (2025-08-19)
**Last Updated**: 2025-08-19
**Type**: Research/Investigation

#### Quick Start
Ocean uses a CalVer-based tagging system (yymm.dd.build-number) for Docker images, with automated publishing to multiple registries.

#### Files Involved
- `tools/build-and-publish-to-snapshot.sh` - Main snapshot build script with CalVer implementation
- `package-scripts.js` - Docker build commands for all images (docker.buildAndPush)
- `.github/workflows/build-public-dockerhub-release.yml` - DockerHub public release workflow
- `.github/workflows/build-public-gar-release.yml` - Google Artifact Registry public release workflow
- `.github/workflows/build-base.yml` - Base workflow for building images
- `tools/scripts/private-cloud/public-release-from-branch.ts` - TypeScript script for public releases
- `tools/scripts/private-cloud/build-from-branch.sh` - Shell script for branch builds
- `tools/scripts/private-cloud/publish-executor-binaries.sh` - Publishes executor binaries to GCS

#### Design Decisions
- CalVer format: `yymm.dd.<build-number>` (e.g., 2508.19.1)
- Build number increments based on existing tags for the same day
- All Docker images share the same version tag for consistency
- Images pushed to three registries: GAR, Quay.io, and DockerHub (for public releases)
- Build numbers reset daily to maintain readability

## Features & Critical Paths

### DTE Exit Code / Run Status Flow
**Last Updated:** 2026-03-25
**Related:** CLOUD-4390, ocean#10513

How DTE run status codes flow from task execution to UI display.

#### Key Files
- `apps/nx-api/src/main/kotlin/services/dtes/operations/MarkTasksAsCompleted.kt:155-170` — Sets `de.statusCode` from task codes. Uses `maxOf(task.code)` for partial batches (can leak raw exit codes like tsc's 2)
- `apps/nx-api/src/main/kotlin/services/dtes/operations/CreateRunFromDistributedExecution.kt:179` — Creates MRun with `status = e.statusCode.toInt()`
- `apps/nx-api/src/main/kotlin/handlers/DistributedExecutionV2Handlers.kt:560-585` — Returns `commandStatus` = `r.statusCode` to DTE client
- `apps/nx-api/src/main/kotlin/handlers/RunHandlers.kt:628-629` — Non-DTE: normalizes `null` task status → `2`
- `libs/nx-cloud/data-access-api/src/lib/make-uniform-cipe-runs.server.ts:292-314` — `getNamedStatus()`: maps numeric status to UI string
- `libs/nx-packages/client-bundle/src/lib/core/runners/distributed-execution/runner.ts:169` — DTE client: `process.exit(r.commandStatus)`
- `libs/nx-packages/client-bundle/src/lib/core/runners/distributed-agent/v4/execute-tasks-v4.ts:317,1140` — Agent: raw `code = r.code`, normalized `statusCode = some(code !== 0) ? 1 : 0`

#### Status Code Meanings (MongoRun.status)
- `0` = Success (COMPLETED in UI)
- `1` = Failure (FAILED in UI)
- `130` = SIGINT cancel (CANCELED in UI)
- Any other non-zero = now mapped to FAILED (post CLOUD-4390 fix)

#### Gotchas
- DTE agents send **raw** task exit codes (e.g., tsc=2, eslint=2) but normalize overall `statusCode` to 0/1
- `MarkTasksAsCompleted` uses `maxOf(task.code)` for partial batches, which can leak raw codes to `de.statusCode`
- Once `de.statusCode != 0`, it's **never overwritten** by subsequent batches (guard: `de.statusCode == 0L`)
- `RunHandlers.kt` defaults null task status to `2` — ancient code (2021), affects non-DTE runs

### Nx Cloud Binary Module Resolution (2025-01-09)
**Branch**: chore/rename-upstream-docs
**Last Updated**: 2025-01-09

#### Quick Start
The nx-cloud binary now properly handles alternative node_modules locations (`.nx/installation/node_modules`).

#### Files Involved
- `libs/nx-packages/nx-cloud/bin/nx-cloud.ts` - Main binary entry point
- `libs/nx-packages/nx-cloud/lib/utilities/custom-require.ts` - NEW: Custom require implementation for alternative module resolution
- `libs/nx-packages/nx-cloud/lib/utilities/nx-imports.ts` - Module imports for nx dependencies, updated to use customRequire
- `libs/nx-packages/nx-cloud/lib/utilities/nx-imports-light.ts` - Lightweight imports, updated to use customRequire
- `libs/nx-packages/nx-cloud/lib/light-client/resolution-helpers.ts` - Helper for finding node_modules in ancestor directories
- `libs/nx-packages/client-bundle/src/lib/utilities/light-client-require.ts` - Existing pattern for custom module resolution in client bundle

#### Design Decisions
- Used a simple customRequire function instead of modifying NODE_PATH to avoid side effects
- Maintained backward compatibility by trying standard require first
- Pattern already existed in client-bundle but couldn't be reused due to circular dependency concerns

## Personal Work History

### 2026-03-30
- **CLOUD-4401: Ctrl+C during onboarding prints readline stacktrace** (branch: CLOUD-4401, PR: #10568, merged)
  - Fixed enquirer prompt cancellation in `onboarding-interactive.ts`
  - Key finding: enquirer throws `ERR_USE_AFTER_CLOSE` from an internal keypress event handler — a separate async call chain that `try/catch` around `await prompt()` cannot catch
  - Fix: `process.on('uncaughtException'/'unhandledRejection')` handlers using existing `isPromptCancelledError` utility
  - Related: `libs/nx-packages/client-bundle/src/lib/utilities/prompt-utils.ts` has the shared utility

- **CLOUD-4400: Suppress url.parse() deprecation warning** (branch: CLOUD-4400, PR: #10569)
  - Monkey-patched `process.emitWarning` in client-bundle entry point to suppress DEP0169

- **DOC-451: Cloud bundle local testing tooling** (branch: main, uncommitted)
  - Created `tools/scripts/nx-cloud-local.sh` — multi-environment wrapper for running locally-built client-bundle commands
  - Created `cloud-bundle-tester` Claude Code skill
  - Discovered top-level `--help` side-effect bug in client-bundle (module-scope `process.argv` checks)

### 2026-03-25
- **CLOUD-4390: ClickUp Exit Code 2 Investigation** (PR: #10513, by Caleb)
  - Investigation only (no code changes by me). ClickUp DTE runs showed `status: 2` after Nx 22.3.3 → 22.6.1 upgrade.
  - Root cause: latent `maxOf(task.code)` bug in `MarkTasksAsCompleted.kt` + tsc exit code 2 + continuous assignments changing batch timing
  - Fix: UI patch in `getNamedStatus()` to treat non-zero/non-130 as FAILED
  - Also found separate Nx CLI SIGTERM exit code regression (1 → 130 in 22.6.x) — not yet filed

### 2026-02-11
- **CLOUD-4246: Access Control Confirmation Dialog** (branch: CLOUD-4246, PR: #9985)
  - Task: Replace inline Save/Cancel buttons with modal confirmation for access control settings
  - Created `change-access-level-confirmation-dialog.tsx` using existing `ConfirmationDialog` with `variant="blue"`
  - Modified `workspace-id-access-level.tsx` and `workspace-pat-access-level.tsx` to show modal on radio change
  - Updated e2e tests in `access-control.spec.ts` (3 locations)
  - Key pattern: Use `pendingAccessLevel` state to track selection before confirmation

- **CLOUD-3924: Compare Tasks Cache Origin Fix** (branch: CLOUD-3924, commit: 009a28ff77)
  - Task: Show "Originated from" link on Compare Tasks page without requiring comparison task selection
  - Fixed `compare-tasks-loader.server.ts` to fetch cache origin independently for each task
  - Added e2e test for cache origin display

### 2025-09-10
- **Docker Nx Release Migration** (branch: NXC-2493, commit: 7a146758b)
  - Task: Enable nx release for Docker images per NXC-2493
  - Migrated all Dockerfiles from apps/docker-setup/dockerfiles/ to project directories
  - Created separate projects for workflow-executor and log-uploader
  - Updated package-scripts.js to reference new paths
  - Configured release group "apps" with all Docker projects
  - Added workflow_dispatch input to CI for toggling between pipelines

### 2025-08-19
- **Docker Tagging and Publishing Investigation**
  - Task: Understand complete Docker tagging, pushing, and publishing flow
  - Discovery: CalVer scheme implemented in build-and-publish-to-snapshot.sh (yymm.dd.build-number)
  - Key finding: Build numbers increment per day, reset daily
  - Documentation: Created comprehensive flow documentation and modification guide

### 2025-01-09
- **Fix nx-cloud binary module resolution** (branch: chore/rename-upstream-docs)
  - Problem: nx-cloud binary failed in workspaces without root node_modules
  - Solution: Added customRequire helper to check .nx/installation/node_modules
  - Files: custom-require.ts (new), nx-imports.ts, nx-imports-light.ts

## UI Patterns

### Confirmation Dialogs (2026-02-11)

For destructive or significant settings changes, use the `ConfirmationDialog` component from `@nx-cloud/ui-primitives`:

```tsx
import {
  ConfirmationDialog,
  ConfirmationDialogContent,
  ConfirmationDialogTitle,
} from '@nx-cloud/ui-primitives';

<ConfirmationDialog
  isOpen={isOpen}
  handleConfirm={handleConfirm}
  handleCancel={handleCancel}
  handleClose={handleCancel}
  confirmText="Save changes"
  variant="blue"  // or "red" for destructive actions
>
  <ConfirmationDialogTitle>Title</ConfirmationDialogTitle>
  <ConfirmationDialogContent>Message</ConfirmationDialogContent>
</ConfirmationDialog>
```

**Pattern for settings changes:**
1. Use `pendingValue` state to track the new selection before confirmation
2. On change event, set `pendingValue` and open dialog (don't update actual value yet)
3. On confirm: call mutation with `pendingValue`, clear `pendingValue`
4. On cancel: just clear `pendingValue`

**Examples:**
- `EnableNxReplayConfirmationDialog` - Red variant for enabling cache from NO_CACHE
- `ChangeAccessLevelConfirmationDialog` - Blue variant for access level changes

## PR Requirements

### Version Plans (Required for feat/fix PRs)

Most PRs with `feat` or `fix` commits require a version plan for changelog generation. Create one at `.nx/version-plans/`:

```bash
# Naming convention: yyyy-mm-dd-hh-mm-descriptive-name.md
.nx/version-plans/2026-02-10-16-26-confirming-access-levels.md
```

**Format:**
```markdown
---
nx-cloud: fix
---

Customer-facing description of the change. This becomes the changelog entry.
```

**Frontmatter options:**
- `nx-cloud: fix` - Bug fix
- `nx-cloud: minor` - New feature
- `nx-cloud: patch` - Small improvement

**When NOT needed:**
- `chore` commits (internal tooling, CI changes)
- `docs` commits
- Test-only changes

## Design Decisions & Gotchas

### Docker Build Context (2025-09-10)
- @nx/docker plugin builds from project directory by default
- Our Dockerfiles expect workspace root context (e.g., dist/apps/nx-api/)
- Solution: Override with manual command in docker:build target with cwd: ""
- Cannot use inferred targets due to this context requirement

### Dockerfile Naming Convention (2025-09-10)
- Must be named exactly `Dockerfile` for nx/docker plugin to work
- Cannot use *.dockerfile extension
- Located in project root (except workflow sub-projects in cmd/)
- This was a key discovery - initially tried keeping .dockerfile extension

### Java/Kotlin Apps and Package.json (2025-09-10)
- Apps like nx-api don't have package.json in dist/
- Use skipVersionActions: true in nx.json Docker config
- Create temporary package.json for testing if needed
- This prevents nx release version from failing on non-JS projects

### Workflow Controller Special Case (2025-09-10)
- Three separate Docker images from one project
- Created sub-projects in cmd/ directory with own project.json files
- Each has its own Dockerfile and repository name
- Projects named: nx-cloud-workflow-controller-main, nx-cloud-workflow-executor, nx-cloud-workflow-log-uploader

### Docker Versioning
- CalVer chosen over SemVer for predictable, time-based releases
- Format includes build number to handle multiple builds per day
- All images in a release share the same version for consistency
- Public releases use branch-based versioning (e.g., 2024.10) with patch numbers

### Module Resolution
- The nx-cloud package has two different require patterns:
  1. Direct `require()` calls in nx-imports files
  2. `lightClientRequire()` pattern in client-bundle using environment variables
- Cannot reuse lightClientRequire due to circular dependencies between packages

### Nx Installation Modes
- Nx can be installed in different ways:
  1. Traditional: node_modules in workspace root
  2. Global/Standalone: modules in `.nx/installation/node_modules`
- nx-cloud binary must support both modes

## Local Development Setup

### 1Password CLI (op)

The nx-api uses 1Password CLI to fetch secrets at runtime. If you see errors like:
```
"Engineering" isn't a vault in this account
```

**Fix:** Re-authenticate to the correct 1Password account:
```bash
# Check current account
op account list

# Sign in to Tusk team account
op signin
# Select: tuskteam.1password.com
```

### Running Nx Cloud Locally

**With API (full stack, recommended):**
```bash
TARGET_ENV=Staging op run --env-file=env.base --env-file=env.override -- npx nx serve nx-cloud --configuration=development
```
Requires: MongoDB running, 1Password authenticated to tuskteam

`TARGET_ENV` options: `Base`, `Staging`, `Snapshot` (determines which 1Password secrets to use)

**Legacy commands (may have stale env setup):**
```bash
npx nps nxCloud.serve.withApi  # Full stack
npx nps nxCloud.serve          # Frontend only, port 4202
```

**E2E mode (fake credentials, no 1Password needed):**
```bash
nx serve nx-cloud --configuration=e2e
```
Uses `.env.serve.e2e` with fake GitHub/GitLab credentials. Good for UI testing.

### E2E Testing

E2E tests bypass Auth0 by creating public organizations:
```bash
nx run nx-cloud-e2e-playwright:e2e --grep "pattern"
```

**Running e2e tests locally:**
```bash
# Start server in e2e mode first (uses fake credentials, no 1Password needed)
nx serve nx-cloud --configuration=e2e

# In another terminal, run tests
nx run nx-cloud-e2e-playwright:e2e --grep "pattern"
```

**Important:** The `E2E_TEST_MODE` environment variable controls e2e mode:
- Set in `.env.serve.e2e` which is loaded by `--configuration=e2e`
- `env.base` has `E2E_TEST_MODE=false` hardcoded
- 1Password `op run --env-file` loads env files AFTER shell vars, overriding them
- To override when using 1Password: `op run --env-file=env.base -- E2E_TEST_MODE=true npx nx serve...`

Key fixtures:
- `db.createTestOrganization({ isPublic: true })` - Creates org viewable without login
- `db.createTestCIPE()` - Creates test pipeline execution
- `auth.login('DAVID_SMITH')` - Handles Auth0 login when needed

### Client Bundle CLI Commands (2026-03-30)
**Last Updated:** 2026-03-30

The client-bundle (`libs/nx-packages/client-bundle/`) is the npm-distributed binary that runs `npx nx-cloud <command>`. It's built as a single JS bundle.

#### Testing Locally

Use `tools/scripts/nx-cloud-local.sh` to run commands from the locally-built bundle against any environment:

```bash
# Build first
nx build nx-packages-client-bundle

# Configure PAT (one-time per environment)
npx nx-cloud configure --personal-access-token=<PAT> --nx-cloud-url=https://snapshot.nx.app

# Run commands (defaults to snapshot if env omitted)
./tools/scripts/nx-cloud-local.sh onboard
./tools/scripts/nx-cloud-local.sh staging onboard status --json
./tools/scripts/nx-cloud-local.sh local validate
```

#### Key Files
- `libs/nx-packages/client-bundle/src/index.ts` — command map (lazy `require()` per command)
- `libs/nx-packages/client-bundle/src/lib/core/commands/` — individual command implementations
- `libs/nx-packages/client-bundle/src/lib/core/commands/onboarding/` — onboard subcommands
- `dist/libs/nx-packages/client-bundle/src/index.js` — built output

#### Known Issue: Top-Level `--help` Side Effects
Many command files (e.g., `convert-to-nx-cloud-id.ts`, `configure.ts`, `login.ts`) have `process.argv.includes('--help')` checks **at module scope** (outside exported functions). When another command imports from these files, the `--help` check fires at import time and prints the wrong help. Example: `onboard --help` shows `convert-to-nx-cloud-id` help because `onboarding-utils.ts` imports `updateNxJsonWithNxCloudId` from `convert-to-nx-cloud-id.ts`.

## Technology Stack

### Core Technologies
- **Nx** - Monorepo management and build system
- **TypeScript** - Primary language for frontend/tooling
- **Remix** - Web framework for nx-cloud app
- **Java/Kotlin** - Backend API services
- **Go** - Machine agents and performance-critical services
- **MongoDB** - Primary database
- **Docker** - Containerization for services

### Key Dependencies
- Node.js ecosystem for frontend and tooling
- JVM ecosystem for backend services
- Various cloud provider SDKs