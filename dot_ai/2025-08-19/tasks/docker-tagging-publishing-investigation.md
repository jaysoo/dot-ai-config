# Docker Tagging and Publishing Investigation

**Date:** 2025-08-19  
**Type:** Research/SPIKE  
**Goal:** Understand the complete Docker tagging, pushing, and publishing flow in the Ocean repository, focusing on the CalVer scheme implementation

## Investigation Summary

### Phase 1: Discovery of Key Files ✅

**Completed Steps:**
- [x] Located main build script: `tools/build-and-publish-to-snapshot.sh`
- [x] Found Docker build configurations in `package-scripts.js`
- [x] Identified GitHub workflows for publishing
- [x] Found supporting scripts for public releases and executor binaries

### Phase 2: CalVer Scheme Analysis ✅

**Current Implementation:**
- Format: `yymm.dd.<build-number>` (e.g., 2508.19.1)
- Location: `tools/build-and-publish-to-snapshot.sh` lines 22-31
- Build number: Increments based on existing tags for the same day

**Key Code:**
```bash
CALVER_PREFIX=$(date '+%y%m.%d')
EXISTING_BUILD_COUNT=$(git tag | grep -c "$CALVER_PREFIX")
CALVER_TAG="$CALVER_PREFIX.$((EXISTING_BUILD_COUNT + 1))"
```

### Phase 3: Complete Flow Documentation ✅

**Main Components:**

1. **Snapshot Builds** (Daily builds)
   - Entry: `tools/build-and-publish-to-snapshot.sh`
   - Uses CalVer tagging
   - Pushes to GAR and Quay registries
   - Publishes executor binaries to GCS

2. **Public Releases**
   - DockerHub: `.github/workflows/build-public-dockerhub-release.yml`
   - GAR Enterprise: `.github/workflows/build-public-gar-release.yml`
   - Uses branch-based versioning (e.g., 2024.10)

3. **Docker Image Building**
   - Defined in `package-scripts.js` under `docker.images.*`
   - Main command: `npx nps docker.buildAndPush`
   - Builds multiple images: nx-api, file-server, aggregator, workflow-controller, etc.

4. **Registries Used:**
   - Google Artifact Registry: `us-east1-docker.pkg.dev/nxcloudoperations/nx-cloud`
   - Quay.io: `quay.io/nxdev`
   - DockerHub: `nxprivatecloud` (for public releases)

## How to Change the CalVer Scheme

### Option 1: Change Date Format
**File:** `tools/build-and-publish-to-snapshot.sh:22`

Current:
```bash
CALVER_PREFIX=$(date '+%y%m.%d')  # yymm.dd
```

Examples of alternatives:
```bash
CALVER_PREFIX=$(date '+%Y.%m.%d')   # yyyy.mm.dd (2025.08.19)
CALVER_PREFIX=$(date '+%Y%m%d')     # yyyymmdd (20250819)
CALVER_PREFIX=$(date '+%y.%m.%d')   # yy.mm.dd (25.08.19)
```

### Option 2: Change Build Number Logic
**File:** `tools/build-and-publish-to-snapshot.sh:28-30`

Current logic counts existing tags for the day. Could be changed to:
- Use git commit count
- Use time-based suffix (HHMM)
- Use sequential global counter

### Required Updates for CalVer Changes

1. **Update tag fetching pattern** (line 26):
   ```bash
   git fetch origin 'refs/tags/$CALVER_PREFIX.*:refs/tags/$CALVER_PREFIX.*'
   ```

2. **Update public release regex** in `tools/scripts/private-cloud/public-release-from-branch.ts:42`:
   ```typescript
   new RegExp(`^${baseTag.replace('.', '\\.')}(\\.\\d+)?$`).test(ref)
   ```

3. **Consider updating** tag pattern in line 55 of the same file

## Next Steps (for using `nx release` to tag/push docker images)

- [x] Figure out how Dockerfiles are stored, which project they belong to
- [x] Configure `nx.json` and `project.json` according to https://nx.dev/recipes/nx-release/release-docker-images
- [x] Ensure that `nx show project <project-that-has-dockerfile> --json` contains the `docker:build` target from `@nx/docker`
- [x] Update `tools/build-and-publish-to-snapshot.sh` and other scripts that use `docker build` or `docker push` or tagging to use `nx release version` and `nx release publish` instead
- [ ] Update regex patterns in TypeScript files as noted previously
- [ ] Manual test locally using `nx release` commands
- [ ] Update documentation (if applicable)

## Notes

- CRITICAL: Keep track of progress in this document when implementing changes
- The system automatically handles build number incrementing
- Build numbers reset daily (or based on your date prefix)
- All Docker images share the same version tag for consistency
