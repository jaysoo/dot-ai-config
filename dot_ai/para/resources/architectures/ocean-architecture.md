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

**With API (full stack):**
```bash
npx nps nxCloud.serve.withApi
```
Requires: MongoDB running, 1Password authenticated to tuskteam

**Frontend only (no API):**
```bash
npx nps nxCloud.serve
```
Serves on port 4202, uses mock/hardcoded data

### E2E Testing

E2E tests bypass Auth0 by creating public organizations:
```bash
nx run nx-cloud-e2e-playwright:e2e --grep "pattern"
```

Key fixtures:
- `db.createTestOrganization({ isPublic: true })` - Creates org viewable without login
- `db.createTestCIPE()` - Creates test pipeline execution
- `auth.login('DAVID_SMITH')` - Handles Auth0 login when needed

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