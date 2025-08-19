# Correct Approach for Nx Release with Docker

## Current Issue
- Dockerfiles are centralized in `apps/docker-setup/dockerfiles/`
- @nx/docker plugin expects Dockerfiles in each project's root directory
- We manually added docker targets (incorrect approach)

## Correct Approach

### Option 1: Use @nx/docker Plugin with Inference
1. Add @nx/docker plugin to nx.json
2. Move/symlink Dockerfiles to each project's directory
3. Plugin will automatically infer `docker:build` targets
4. Configure `release.docker.repositoryName` in each project's config

### Option 2: Keep Centralized Dockerfiles with Custom Targets
1. Use nx:run-commands executor (not @nx/docker:build)
2. Configure release to use custom targets
3. Still configure `release.docker.repositoryName`

## Required Configuration

### 1. Add @nx/docker Plugin to nx.json
```json
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

### 2. Configure Release in nx.json
```json
{
  "release": {
    "releaseTagPattern": "{version}",
    "groups": {
      "docker-images": {
        "projects": [
          "nx-api",
          "file-server",
          "aggregator",
          "nx-cloud-workflow-controller",
          "nx-ai",
          "nx-background-worker",
          "activemq"
        ],
        "projectsRelationship": "fixed",
        "version": {
          "generator": "@nx/release:version",
          "generatorOptions": {
            "specifierSource": "conventional-commits"
          }
        },
        "docker": {
          "registryUrl": "us-east1-docker.pkg.dev/nxcloudoperations/nx-cloud",
          "skipVersionActions": false
        }
      }
    }
  }
}
```

### 3. Add Repository Names to Each Project

For each project's `project.json` or `package.json`:
```json
{
  "release": {
    "docker": {
      "repositoryName": "nx-cloud-nx-api"
    }
  }
}
```

### 4. CalVer Integration
To maintain CalVer scheme (yymm.dd.build):
- Use custom version generator
- Or use `--dockerVersionScheme=calver` flag

## Implementation Steps

1. **Remove manually added docker targets** from all project.json files
2. **Add @nx/docker plugin** to nx.json
3. **Configure release groups** in nx.json with docker settings
4. **Add repositoryName** to each Docker project
5. **Either:**
   - Move Dockerfiles to project directories for inference
   - OR keep centralized and use custom targets

## Commands to Use

```bash
# Version all Docker images
nx release version --group=docker-images

# Build and push Docker images
nx release publish --group=docker-images

# Full release (version + publish)
nx release --group=docker-images
```

## Key Differences from Current Implementation
1. ❌ We added explicit docker-build/docker-push targets
   ✅ Should use inferred targets from @nx/docker plugin

2. ❌ Missing release.docker configuration in nx.json
   ✅ Need release.groups.docker-images.docker settings

3. ❌ Missing repositoryName in project configurations
   ✅ Each project needs release.docker.repositoryName

4. ❌ Using custom scripts for versioning
   ✅ Should use nx release version with CalVer scheme