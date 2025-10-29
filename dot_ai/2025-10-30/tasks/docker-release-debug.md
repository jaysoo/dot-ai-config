# Docker Release Debug - nx release with buildx

**Date**: 2025-10-30
**Issue**: CI fails with `Error response from daemon: No such image: apps-nx-api:latest` when running `nx release`

## Root Cause

The error occurs because:

1. **Ocean's CI creates a multi-platform buildx builder** (`build-and-publish-to-snapshot.sh:64`):
   ```bash
   docker buildx create --name shared-builder --driver docker-container --platform linux/amd64,linux/arm64 --use
   ```

2. **The release flow expects locally available images**:
   - `nx release version` runs `groupPreVersionCommand`: `npx nx run-many -t docker:build --configuration=ci`
   - This builds images using buildx
   - Then `nx release version` tries to tag: `docker tag apps-nx-api quay.io/nxdev/nx-cloud-nx-api:VERSION`

3. **buildx doesn't load images by default when using docker-container driver**:
   - When buildx creates images with docker-container driver, they stay in the build cache
   - They are NOT automatically loaded into the local Docker daemon
   - The `docker tag` command fails because the image doesn't exist locally

## The Fix

Add `--load` to the buildx args in `nx.json` (`/Users/jack/projects/ocean/nx.json:90-105`):

```json
{
  "plugin": "@nx/docker",
  "options": {
    "buildTarget": {
      "name": "docker:build",
      "configurations": {
        "ci": {
          "args": [
            "--load",  // <-- ADD THIS LINE
            "--cache-from type=registry,ref=$REGISTRY/{projectName}:$PREVIOUS_CALVER_TAG",
            "--cache-to type=inline"
          ]
        }
      }
    },
    "runTarget": "docker:run"
  }
}
```

## Important Notes

1. **`--load` loads the image into the local Docker daemon** after building
2. **This works even with multi-platform builders** as long as you don't specify `--platform` in the build args
3. **If you need multi-platform builds** (e.g., `--platform linux/amd64,linux/arm64` in the build args), you cannot use `--load`. In that case you need to either:
   - Build twice: once for local tagging (single platform with `--load`), once for multi-platform push
   - Use `docker buildx build --push` directly instead of the tag+push flow
   - Skip the local tagging step entirely and use environment variables to override image references

## Test Workspace

Created test workspace at `/tmp/test-docker-release` that reproduces the issue:

1. **Without `--load`** + multi-platform builder:
   ```bash
   cd /tmp/test-docker-release
   docker buildx create --name test-builder --driver docker-container --platform linux/amd64,linux/arm64 --use
   BUILDX_BUILDER=test-builder BUILD_COUNT=3 npx nx release version --dockerVersionScheme=snapshot --group apps
   # Result: Error response from daemon: No such image: apps-myapp:latest
   ```

2. **With `--load`** + multi-platform builder (no platform specified in build):
   ```bash
   # Add "--load" to nx.json buildTarget.configurations.ci.args
   BUILDX_BUILDER=test-builder BUILD_COUNT=4 npx nx release version --dockerVersionScheme=snapshot --group apps
   # Result: SUCCESS - Image is loaded and available locally
   ```

## Verification

After adding `--load`:
```bash
docker images | grep myapp
# apps-myapp  1.0.4  6330e32bd744  44 seconds ago  167MB
# apps-myapp  latest 6330e32bd744  44 seconds ago  167MB
```

## References

- Ocean CI workflow: `.github/workflows/ci.yml:212`
- Build script: `tools/build-and-publish-to-snapshot.sh:64-72`
- Docker plugin config: `nx.json:90-105`
- Nx Docker release docs: https://nx.dev/docs/guides/nx-release/release-docker-images
