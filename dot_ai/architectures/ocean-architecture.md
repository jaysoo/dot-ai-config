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