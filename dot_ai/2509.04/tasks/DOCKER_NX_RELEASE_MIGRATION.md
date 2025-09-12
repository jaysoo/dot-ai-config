# Docker Image Build & Publishing Migration to Nx Release

## Overview

This document describes the migration from the legacy nps-based Docker build system to the new `nx release` approach for Docker image management.

## Changes Made

### 1. Infrastructure Changes

#### Added @nx/docker Plugin

- Installed `@nx/docker` v21.4.0 plugin
- Provides native Docker support within Nx workspace
- Enables use of `nx release` for Docker image management

#### Project Configurations

Added `docker-build` targets and release configurations to the following projects:

| Project                      | Docker Image Name              | Dockerfile Location                                                     |
| ---------------------------- | ------------------------------ | ----------------------------------------------------------------------- |
| nx-api                       | nx-cloud-nx-api                | apps/docker-setup/dockerfiles/nx-api.dockerfile                         |
| aggregator                   | nx-cloud-aggregator            | apps/docker-setup/dockerfiles/aggregator.dockerfile                     |
| file-server                  | nx-cloud-file-server           | apps/docker-setup/dockerfiles/file-server.dockerfile                    |
| nx-cloud                     | nx-cloud-frontend              | apps/docker-setup/dockerfiles/nx-cloud-frontend.dockerfile              |
| nx-cloud-workflow-controller | nx-cloud-workflow-controller   | apps/docker-setup/dockerfiles/nx-cloud-workflow-controller.dockerfile   |
| nx-cloud-workflow-controller | nx-cloud-workflow-executor     | apps/docker-setup/dockerfiles/nx-cloud-workflow-executor.dockerfile     |
| nx-cloud-workflow-controller | nx-cloud-workflow-log-uploader | apps/docker-setup/dockerfiles/nx-cloud-workflow-log-uploader.dockerfile |
| nx-ai                        | nx-cloud-ai                    | apps/docker-setup/dockerfiles/nx-ai.dockerfile                          |
| nx-background-worker         | nx-cloud-background-worker     | apps/docker-setup/dockerfiles/nx-background-worker.dockerfile           |

### 2. Configuration Changes

#### nx.json Release Group

Added new release group `docker-images` with the following configuration:

```json
{
  "docker-images": {
    "projects": ["nx-api", "file-server", "aggregator", "nx-cloud-workflow-controller", "nx-cloud", "nx-ai", "nx-background-worker"],
    "projectsRelationship": "fixed",
    "docker": {
      "skipVersionActions": true
    }
  }
}
```

- `projectsRelationship: "fixed"` - All images use the same version
- `skipVersionActions: true` - Version is controlled externally via `NX_VERSION`

### 3. Script Changes

#### New Script: build-with-nx-release.sh

- Uses `nx release version` to tag images with version
- Uses `nx release publish` to build and push images
- Nx automatically handles dependencies and parallel builds
- Maintains support for special cases (messagequeue, AI image)
- Publishes executor binaries
- Creates git tags

#### Modified Script: build-from-branch.sh

- Added `USE_NX_RELEASE` flag to toggle between old and new approaches
- When `USE_NX_RELEASE=true`, delegates to `build-with-nx-release.sh`
- Maintains backward compatibility with legacy nps approach

### 4. GitHub Workflow Updates

Updated workflows to use nx release approach:

- `.github/workflows/build-public-dockerhub-release.yml`
- `.github/workflows/build-public-gar-release.yml`

Added `USE_NX_RELEASE=true` to environment variables in workflow commands.

## Command Mapping

### Before (Legacy NPS Approach)

```bash
# Build dependencies
nx run-many -t package prune --projects=...

# Build and push images
npx nps docker.buildAndPush

# Individual image build
docker buildx build --platform linux/amd64 \
  ${PREVIOUS_CALVER_TAG:+--cache-from ${REGISTRY}/nx-cloud-nx-api:${PREVIOUS_CALVER_TAG}} \
  --cache-to type=inline \
  -t ${REGISTRY}/nx-cloud-nx-api:${NX_VERSION} \
  --build-arg NX_VERSION=${NX_VERSION} \
  --push \
  -f ./apps/docker-setup/dockerfiles/nx-api.dockerfile .
```

### After (Nx Release Approach)

```bash
# Set up environment
export NX_DOCKER_REGISTRY="$REGISTRY"
export NX_DOCKER_ADDITIONAL_REGISTRIES="$QUAY_REGISTRY"

# Tag Docker images with version
nx release version $NX_VERSION --group=docker-images

# Build and push Docker images (handles dependencies automatically)
nx release publish --group=docker-images
```

## Pipeline Flow Comparison

### Before

1. GitHub Actions trigger on branch push
2. Workflow runs `npx tsx ./tools/scripts/private-cloud/public-release-from-branch.ts`
3. Script calls `./tools/scripts/private-cloud/build-from-branch.sh`
4. Shell script runs `npx nps docker.buildAndPush`
5. package-scripts.js executes individual docker buildx commands

### After

1. GitHub Actions trigger on branch push
2. Workflow runs same scripts with `USE_NX_RELEASE=true`
3. Script calls `./tools/scripts/private-cloud/build-with-nx-release.sh`
4. Shell script runs `nx release version` and `nx release publish`
5. Nx handles dependencies, builds, tags, and pushes all images

## Benefits

1. **Unified Build System**: All Docker builds now managed through Nx
2. **Better Caching**: Nx's built-in caching and dependency management
3. **Simplified Configuration**: Docker settings centralized in project configurations
4. **Improved Parallelization**: Nx handles parallel builds automatically
5. **Consistent Versioning**: Release group ensures all images use same version
6. **Future-Ready**: Prepared for full nx release adoption including changelogs

## Migration Strategy

### Phase 1: Dual Support (Current)

- Both approaches work side-by-side
- Controlled by `USE_NX_RELEASE` environment variable
- Allows testing and validation

### Phase 2: Default to Nx Release

- Change default behavior to use nx release
- Keep legacy as fallback option

### Phase 3: Remove Legacy

- Remove nps docker commands from package-scripts.js
- Remove conditional logic from build-from-branch.sh
- Full migration complete

## Testing

### Verification Script

Run the verification script to check the setup:

```bash
./tools/scripts/private-cloud/verify-nx-docker-setup.sh
```

### Local Testing

To test the new approach locally:

```bash
# 1. Start a local Docker registry (if not already running)
docker run -d -p 5000:5000 --name registry registry:2

# 2. Set environment variables
export USE_NX_RELEASE=true
export NX_VERSION=test-$(date +%Y%m%d-%H%M%S)
export REGISTRY=localhost:5000

# 3. Run build with nx release
./tools/scripts/private-cloud/build-with-nx-release.sh

# 4. Verify images were built and tagged
docker images | grep localhost:5000

# 5. Test legacy approach for comparison (optional)
unset USE_NX_RELEASE
npx nps docker.buildAndPush
```

## Rollback Plan

If issues arise, simply remove `USE_NX_RELEASE=true` from workflow files to revert to legacy approach.

## Special Considerations

### Message Queue Image

- Not built from source
- Pulled from existing registry and retagged
- Handled separately in both approaches

### AI Image

- Conditionally deployed based on `deploy-ai` parameter
- Uses pre-built image from registry
- Special handling maintained

### Multi-Architecture Images

- Workflow executor and log uploader support linux/amd64 and linux/arm64
- Handled via separate docker-build targets

## Next Steps

1. Monitor builds with new approach enabled
2. Validate all images are correctly built and pushed
3. Update remaining workflows and scripts
4. Plan removal of legacy nps commands
5. Consider enabling version management and changelogs
