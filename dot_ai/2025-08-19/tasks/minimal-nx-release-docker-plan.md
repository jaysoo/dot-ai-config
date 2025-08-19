# Minimal Nx Release Docker Integration Plan

**Date:** 2025-08-19  
**Type:** Enhancement  
**Goal:** Use `nx release` for Docker tagging and pushing with MINIMAL changes  
**Principle:** Keep everything as-is, just replace docker commands with nx release

## Current State (DO NOT CHANGE)
- Dockerfiles stay in `apps/docker-setup/dockerfiles/`
- CalVer scheme: `yymm.dd.<build-number>`
- Build script: `tools/build-and-publish-to-snapshot.sh`
- Registries: GAR and Quay

## Phase 1: Analysis
**Goal:** Understand how to make @nx/docker work with centralized Dockerfiles

### Step 1.1: Determine Docker Target Strategy
**TODO:**
- [ ] Check if @nx/docker can use custom dockerfile paths
- [ ] OR create custom targets that point to centralized Dockerfiles
- [ ] Decide: inference vs explicit targets

**Key Question:** Can @nx/docker infer from non-standard Dockerfile locations?

### Step 1.2: Map Existing Docker Build Commands
**TODO:**
- [ ] List all docker build commands from package-scripts.js
- [ ] Map each to a project
- [ ] Note build args and platforms

## Phase 2: Minimal Configuration

### Step 2.1: Configure @nx/docker Plugin
**TODO:**
- [ ] Add @nx/docker plugin to nx.json
- [ ] Configure to use existing Dockerfile locations if possible
- [ ] OR create minimal custom targets

**Option A: Custom Targets (if inference won't work)**
```json
{
  "targets": {
    "docker:build": {
      "executor": "nx:run-commands",
      "options": {
        "command": "docker buildx build --platform linux/amd64 -t {projectName}:{args.version} -f ./apps/docker-setup/dockerfiles/{projectName}.dockerfile ."
      }
    }
  }
}
```

### Step 2.2: Add Release Configuration
**TODO:**
- [ ] Add docker-images release group to nx.json
- [ ] Configure registries
- [ ] Use CalVer generator

```json
{
  "release": {
    "groups": {
      "docker-images": {
        "projects": ["nx-api", "file-server", ...],
        "version": {
          "generator": "./.ai/2025-08-19/tasks/calver-version-generator.mjs"
        },
        "docker": {
          "registryUrl": "us-east1-docker.pkg.dev/nxcloudoperations/nx-cloud",
          "additionalRegistryUrls": ["quay.io/nxdev"]
        }
      }
    }
  }
}
```

### Step 2.3: Add Repository Names
**TODO:**
- [ ] Add release.docker.repositoryName to each project
- [ ] Use exact image names from current setup

## Phase 3: Script Migration

### Step 3.1: Update Build Script
**TODO:**
- [ ] Keep all existing logic
- [ ] Replace only the docker build/tag/push commands
- [ ] Use nx release commands instead

**Before:**
```bash
docker buildx build ... 
docker tag ...
docker push ...
```

**After:**
```bash
nx release --group=docker-images
```

## Phase 4: Testing

### Step 4.1: Verify No Structural Changes
**TODO:**
- [ ] Confirm NO new Dockerfiles created
- [ ] Confirm existing Dockerfiles still used
- [ ] Confirm same images built

### Step 4.2: Test Release Process
**TODO:**
- [ ] Test with --dry-run
- [ ] Verify CalVer versioning works
- [ ] Verify multi-registry push

## Implementation Checklist

### Must NOT Do:
- ❌ Create new Dockerfiles
- ❌ Move existing Dockerfiles
- ❌ Create symlinks
- ❌ Change project structure
- ❌ Change CalVer scheme

### Must Do:
- ✅ Keep Dockerfiles in `apps/docker-setup/dockerfiles/`
- ✅ Use existing build process
- ✅ Maintain CalVer versioning
- ✅ Push to same registries
- ✅ Minimal changes only

## Key Files to Modify

1. **nx.json**
   - Add @nx/docker plugin
   - Add release.groups.docker-images

2. **Project configs** (project.json/package.json)
   - Add release.docker.repositoryName
   - Maybe add custom docker:build target if needed

3. **Build script**
   - Replace docker commands with nx release

## Success Criteria

1. `nx release --group=docker-images` builds all Docker images
2. Images tagged with CalVer (yymm.dd.build)
3. Images pushed to GAR and Quay
4. NO new Dockerfiles anywhere
5. Existing Dockerfiles still in `apps/docker-setup/dockerfiles/`

## Notes

- CRITICAL: Keep track of progress in this document when implementing
- If @nx/docker can't handle centralized Dockerfiles, use custom targets
- The goal is to change commands, not structure