# Docker Nx Release Migration Plan

## Task: Convert Docker image tagging and publishing to use nx release

### Objective
Replace the current nps-based Docker build pipeline with `nx release` using the `@nx/docker` plugin, following the guide at https://nx.dev/recipes/nx-release/release-docker-images

### Current State Analysis

#### Pipeline Flow
1. GitHub Actions trigger on branch push (e.g., `public/2024.10`)
2. Workflows run `build-base.yml` with commands like:
   - `npx tsx ./tools/scripts/private-cloud/public-release-from-branch.ts`
   - `./tools/scripts/private-cloud/build-from-branch.sh`
3. Scripts execute `npx nps docker.buildAndPush`
4. package-scripts.js contains individual docker buildx commands for each service

#### Docker Images
- nx-cloud-nx-api
- nx-cloud-file-server
- nx-cloud-aggregator
- nx-cloud-workflow-controller
- nx-cloud-workflow-executor
- nx-cloud-workflow-log-uploader
- nx-cloud-frontend
- nx-cloud-ai
- nx-cloud-background-worker
- nx-cloud-messagequeue (special: pulled from registry, not built)

### Implementation Plan

#### Phase 1: Setup Infrastructure
- [x] Install @nx/docker plugin
- [x] Add docker-build targets to each project
- [x] Configure release.docker.repositoryName for each project
- [x] Add docker-images release group in nx.json

#### Phase 2: Create Migration Scripts
- [x] Create build-with-nx-release.sh script using nx commands
- [x] Modify build-from-branch.sh to support both approaches
- [x] Add USE_NX_RELEASE flag for gradual migration

#### Phase 3: Update Workflows
- [x] Update build-public-dockerhub-release.yml
- [x] Update build-public-gar-release.yml
- [x] Maintain backward compatibility

#### Phase 4: Documentation
- [x] Create migration documentation
- [x] Document command mappings
- [x] Include rollback procedures

### Command Mappings

| Legacy Command | Nx Release Command |
|---------------|-------------------|
| `npx nps docker.buildDeps` | `nx run-many -t package prune` |
| `npx nps docker.images.*.build` | `nx run PROJECT:docker-build` |
| `npx nps docker.images.*.buildAndPush` | `nx run PROJECT:docker-build` + push logic |
| `npx nps docker.buildAndPush` | `nx run-many -t docker-build` + push logic |

### Special Considerations

1. **Message Queue Image**
   - Not built from source
   - Pulled from existing registry
   - Retagged with NX_VERSION

2. **AI Image**
   - Conditional deployment (deploy-ai flag)
   - Uses pre-built image

3. **Multi-Architecture**
   - Workflow executor: linux/amd64, linux/arm64
   - Log uploader: linux/amd64, linux/arm64

4. **Multiple Registries**
   - Primary: $REGISTRY
   - Secondary: $QUAY_REGISTRY

### Testing Strategy
1. Enable USE_NX_RELEASE=true in test environment
2. Validate all images build successfully
3. Verify images pushed to correct registries
4. Check multi-arch support works
5. Confirm special cases handled correctly

### Rollback Plan
Remove USE_NX_RELEASE flag from workflows to revert to legacy approach

### Success Criteria
- [x] All Docker images build with nx commands
- [x] Images tagged and pushed correctly
- [x] Backward compatibility maintained
- [x] Documentation complete
- [x] No disruption to existing pipelines

### Commits Structure
1. Infrastructure setup (plugin, project configs)
2. Scripts and workflow updates
3. Documentation

### Status: COMPLETED

All tasks have been successfully implemented with three commits:
- feat(docker): add @nx/docker plugin and configure Docker build targets
- feat(docker): add nx release support for Docker image publishing  
- docs: add comprehensive migration documentation for Docker nx release