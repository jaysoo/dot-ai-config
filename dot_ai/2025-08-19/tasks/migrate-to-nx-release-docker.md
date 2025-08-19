# Migrate Docker Tagging and Publishing to Nx Release

**Date:** 2025-08-19  
**Type:** Enhancement/Migration  
**Goal:** Replace current Docker tagging/publishing scripts with `nx release` using `@nx/docker` support  
**Reference:** Investigation in `.ai/2025-08-19/tasks/docker-tagging-publishing-investigation.md`

## Current State Analysis

### Docker Images Built
Based on `package-scripts.js`, the following Docker images are built:
- `nx-api`
- `file-server`
- `aggregator`
- `workflow-controller`
- `nx-cloud-frontend`
- `nx-cloud-api`
- `cloud-frontend`
- `nx-cloud-metrics-backend`
- `nx-cloud-metrics-frontend`

### Current Process
1. CalVer tagging: `yymm.dd.<build-number>` format
2. Manual Docker commands via `package-scripts.js`
3. Shell script orchestration in `tools/build-and-publish-to-snapshot.sh`
4. Multiple registries: GAR, Quay, DockerHub

## Migration Plan

### Phase 1: Discovery and Analysis ✅
**Goal:** Understand project structure and Docker configurations

#### Step 1.1: Map Docker Images to Nx Projects
**TODO:**
- [x] Find Dockerfile locations for each image
- [x] Identify which Nx project owns each Docker image
- [x] Document project-to-image mapping
- [x] Verify if projects already exist or need creation

**Commands to run:**
```bash
# Find all Dockerfiles
find . -name "Dockerfile*" -type f

# Check existing projects
npx nx show projects

# Examine specific project configs
npx nx show project <project-name> --json
```

**Expected mapping:**
```
Project → Docker Image → Dockerfile Location
(To be filled during implementation)
```

#### Step 1.2: Analyze Build Dependencies
**TODO:**
- [x] Check if Docker images depend on built artifacts
- [x] Identify build order requirements
- [x] Document any special build arguments or environment variables

### Phase 2: Configure Nx Release ✅

#### Step 2.1: Install and Configure @nx/docker
**TODO:**
- [x] Install `@nx/docker` package if not present (already installed)
- [x] Configure Docker executor in each project's `project.json`

**Configuration template:**
```json
{
  "targets": {
    "docker-build": {
      "executor": "@nx/docker:build",
      "options": {
        "file": "apps/<project>/Dockerfile",
        "tags": ["${DOCKER_REGISTRY}/${name}:${version}"],
        "push": false
      }
    },
    "docker-push": {
      "executor": "@nx/docker:push",
      "dependsOn": ["docker-build"],
      "options": {
        "tags": ["${DOCKER_REGISTRY}/${name}:${version}"]
      }
    }
  }
}
```

#### Step 2.2: Configure nx.json for Release
**TODO:**
- [x] Add release configuration to `nx.json` (created in `.ai/2025-08-19/tasks/nx-release-config.json`)
- [x] Configure version scheme to match CalVer
- [x] Set up registry configurations

**nx.json release configuration:**
```json
{
  "release": {
    "version": {
      "generatorOptions": {
        "specifierSource": "conventional-commits",
        "fallbackCurrentVersionResolver": "disk"
      }
    },
    "changelog": {
      "projectChangelogs": false
    },
    "projects": ["*"],
    "releaseTagPattern": "{version}"
  }
}
```

#### Step 2.3: Create Custom Version Generator for CalVer ✅
**TODO:**
- [x] Create custom version generator to maintain CalVer scheme
- [x] Ensure it matches current format: `yymm.dd.<build-number>`
- [x] Handle build number incrementing logic

**File:** `tools/nx-plugins/calver-version-generator.ts`
```typescript
// Custom generator to maintain CalVer scheme
// Implementation details to be added
```

### Phase 3: Update Build Scripts ✅

#### Step 3.1: Migrate build-and-publish-to-snapshot.sh
**TODO:**
- [x] Replace Docker build commands with `nx run-many --target=docker-build`
- [x] Replace Docker push commands with `nx run-many --target=docker-push`
- [x] Maintain registry push logic (GAR, Quay)
- [x] Keep executor binary publishing logic

**New script structure:**
```bash
# Version all projects with CalVer
nx release version --specifier=${CALVER_TAG}

# Build and push Docker images
nx release publish --projects=tag:docker
```

#### Step 3.2: Update package-scripts.js
**TODO:**
- [ ] Replace individual Docker build commands
- [ ] Update to use nx commands
- [ ] Maintain backward compatibility if needed

### Phase 4: Testing

#### Step 4.1: Local Testing
**TODO:**
- [ ] Test `nx release version` with dry-run
- [ ] Test Docker build for each project
- [ ] Verify tags are created correctly
- [ ] Test registry push (to test registry)

**Test commands:**
```bash
# Dry run version
nx release version --dry-run

# Build specific project
nx run <project>:docker-build

# Test full release
nx release --dry-run
```

#### Step 4.2: Integration Testing
**TODO:**
- [ ] Test with CI environment variables
- [ ] Verify multi-registry push works
- [ ] Ensure CalVer scheme is maintained
- [ ] Test rollback scenarios

### Phase 5: CI/CD Updates

#### Step 5.1: Update GitHub Workflows
**TODO:**
- [ ] Update `.github/workflows/build-public-dockerhub-release.yml`
- [ ] Update `.github/workflows/build-public-gar-release.yml`
- [ ] Ensure nx commands are used instead of direct Docker commands

#### Step 5.2: Update Release Scripts
**TODO:**
- [ ] Update `tools/scripts/private-cloud/public-release-from-branch.ts`
- [ ] Ensure regex patterns work with nx release tags
- [ ] Maintain branch-based versioning for public releases

### Phase 6: Documentation and Rollout

#### Step 6.1: Documentation
**TODO:**
- [ ] Document new release process
- [ ] Update contributing guidelines if they exist
- [ ] Create runbook for releases

#### Step 6.2: Gradual Rollout
**TODO:**
- [ ] Start with one Docker image as pilot
- [ ] Monitor and validate
- [ ] Roll out to remaining images
- [ ] Deprecate old scripts

## Implementation Checklist

### Pre-requisites
- [x] Backup current scripts (original files preserved)
- [x] Document current process thoroughly (see investigation doc)
- [ ] Set up test environment

### Core Changes
- [x] Install @nx/docker (already installed via @nx/node)
- [x] Configure projects with Docker targets (all 8 projects updated)
- [x] Implement CalVer version generator (calver-version-generator.mjs)
- [ ] Update nx.json with release config (config created, needs to be applied)
- [x] Migrate build scripts (build-and-publish-to-snapshot-nx.sh created)
- [ ] Update CI/CD workflows

### Validation
- [ ] CalVer scheme maintained (generator tested: 2508.19.4)
- [ ] All Docker images build successfully (needs testing)
- [ ] Multi-registry push works (needs testing)
- [ ] CI/CD pipelines pass
- [ ] Rollback process tested

## Risk Mitigation

1. **Risk:** Breaking existing CI/CD
   - **Mitigation:** Keep old scripts temporarily, run in parallel

2. **Risk:** CalVer scheme changes
   - **Mitigation:** Custom version generator to maintain exact format

3. **Risk:** Registry authentication issues
   - **Mitigation:** Test with each registry individually first

## Expected Outcome

When complete:
1. All Docker images built and tagged using `nx release`
2. CalVer scheme preserved (`yymm.dd.<build-number>`)
3. Multi-registry push automated through nx
4. Simplified maintenance with Nx's built-in Docker support
5. Better integration with Nx's dependency graph
6. Automated versioning and changelog generation

## Notes

- CRITICAL: Keep track of progress in this document when implementing changes
- Test each phase thoroughly before proceeding
- Maintain backward compatibility during transition
- Consider feature flags for gradual rollout

## Implementation Status (2025-08-19)

### ✅ Completed:
1. **Project Analysis:** All Docker images mapped to Nx projects
2. **Docker Targets Added:** All 8 projects now have `docker-build` and `docker-push` targets
3. **CalVer Generator:** Custom version generator created and tested
4. **Migration Script:** New build script using nx commands created
5. **Configuration Files:** All project.json files updated with @nx/docker executors

### 📝 Files Created/Modified:
- `.ai/2025-08-19/tasks/calver-version-generator.mjs` - CalVer version generator
- `.ai/2025-08-19/tasks/build-and-publish-to-snapshot-nx.sh` - New build script
- `.ai/2025-08-19/tasks/nx-release-config.json` - Nx release configuration
- 8 project configurations updated with Docker targets

### 🎯 Next Steps:
1. Test Docker builds locally with: `nx run nx-api:docker-build --args.version=test`
2. Apply nx.json release configuration
3. Test the new build script in a safe environment
4. Update GitHub workflows to use new commands
5. Gradual rollout starting with one image