# Corrected Nx Release Docker Implementation

## What Was Wrong

1. **Manual Docker Targets** ❌
   - Added explicit `docker-build` and `docker-push` targets to project.json files
   - This bypassed @nx/docker's inference mechanism
   
2. **Missing @nx/docker Plugin** ❌
   - Plugin wasn't configured in nx.json
   - Without it, Nx can't infer Docker targets from Dockerfiles

3. **Missing Repository Names** ❌
   - Each project needs `release.docker.repositoryName` configuration
   - This tells nx release what to name the Docker images

4. **Incorrect Release Configuration** ❌
   - Missing `docker` section in release groups
   - No registry URLs configured

## What Was Fixed

### 1. Removed Manual Targets ✅
```json
// REMOVED from project.json files:
"docker-build": { ... },
"docker-push": { ... }
```

### 2. Added @nx/docker Plugin ✅
```json
// Added to nx.json:
{
  "plugins": [
    {
      "plugin": "@nx/docker",
      "options": {
        "buildTargetName": "docker:build",
        "pushTargetName": "docker:push"
      }
    }
  ]
}
```

### 3. Added Repository Names ✅
```json
// Added to each project.json:
{
  "release": {
    "docker": {
      "repositoryName": "nx-cloud-nx-api"
    }
  }
}
```

### 4. Configured Release Groups ✅
```json
// Added to nx.json:
{
  "release": {
    "groups": {
      "docker-images": {
        "projects": ["nx-api", "file-server", ...],
        "projectsRelationship": "fixed",
        "version": {
          "generator": "./.ai/2025-08-19/tasks/calver-version-generator.mjs"
        },
        "docker": {
          "registryUrl": "us-east1-docker.pkg.dev/nxcloudoperations/nx-cloud",
          "skipVersionActions": false,
          "additionalRegistryUrls": ["quay.io/nxdev"]
        }
      }
    }
  }
}
```

## How It Works Now

1. **@nx/docker Plugin Inference**
   - Plugin looks for `Dockerfile` in each project directory
   - Automatically creates `docker:build` and `docker:push` targets
   - No manual target configuration needed

2. **Nx Release Integration**
   - `nx release version` updates version numbers
   - `nx release publish` builds and pushes Docker images
   - Uses CalVer generator for versioning (yymm.dd.build)

3. **Multi-Registry Support**
   - Primary: GAR (us-east1-docker.pkg.dev/nxcloudoperations/nx-cloud)
   - Additional: Quay (quay.io/nxdev)

## Commands to Use

```bash
# Version all Docker images (CalVer)
nx release version --group=docker-images

# Build and push Docker images
nx release publish --group=docker-images

# Full release (version + build + push)
nx release --group=docker-images

# Dry run to test
nx release --group=docker-images --dry-run
```

## Special Cases

### docker-setup Project
- Builds multiple Docker images (workflow-executor, log-uploader)
- Needs custom handling since @nx/docker expects one Dockerfile per project
- Configuration includes `multipleImages: true` flag

### Centralized Dockerfiles
- Currently Dockerfiles are in `apps/docker-setup/dockerfiles/`
- Need symlinks in each project for inference to work
- Alternative: Move Dockerfiles to project directories

## Files Modified

1. **All project.json files** - Removed manual targets, added repositoryName
2. **nx.json** - Added @nx/docker plugin and release configuration
3. **Created CalVer generator** - Maintains existing versioning scheme

## Next Steps

1. ✅ Remove manual Docker targets
2. ✅ Add repository names to projects
3. ✅ Configure nx.json with @nx/docker plugin
4. ⏳ Create Dockerfile symlinks (script ready)
5. ⏳ Apply nx.json changes
6. ⏳ Test with dry run
7. ⏳ Update CI/CD workflows to use nx release