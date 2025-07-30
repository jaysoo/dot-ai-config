# Test Plan: Nx Docker Release Feature

**Created**: 2025-07-30  
**Purpose**: Test Nx workspace creation with Docker support and release functionality  
**Test Version Pattern**: `0.0.0-pr-{PR_NUMBER}-{COMMIT_HASH}`

## Overview

This test plan validates the following features in Nx PR builds:
1. Node monorepo workspace creation with Express API
2. Docker build support
3. Release management with Docker version scheme

## Prerequisites

- Node.js and npm installed
- Docker daemon running
- Clean test directory

## Test Variables

Replace these variables when running the test:
- `{NX_VERSION}`: The Nx version to test (e.g., `0.0.0-pr-32120-1cb4170`)
- `{TEST_DIR}`: Unique directory name for the test workspace

## Test Steps

### Phase 1: Workspace Creation

**Command**:
```bash
npx -y create-nx-workspace@{NX_VERSION} {TEST_DIR} \
  --preset=node-monorepo \
  --appName=api \
  --docker \
  --framework=express \
  --nx-cloud=skip \
  --unitTestRunner=none \
  --linter=none \
  --formatter=none \
  --no-interactive
```

**Expected Result**:
- Workspace created successfully
- No errors during installation
- Directory structure includes `apps/api` with Docker configuration

**Validation**:
- [ ] Check workspace created at `{TEST_DIR}`
- [ ] Verify `apps/api/Dockerfile` exists
- [ ] Verify `nx.json` contains Docker plugin configuration

### Phase 2: Build API Application

**Command**:
```bash
cd {TEST_DIR}
nx build api
```

**Expected Result**:
- Build completes successfully
- Output indicates `Successfully ran target build for project @{TEST_DIR}/api`

**Validation**:
- [ ] Build artifacts created in `dist/apps/api`
- [ ] No build errors

### Phase 3: Docker Build

**Command**:
```bash
nx docker:build api
```

**Expected Result**:
- Docker build runs successfully
- Image created with tag `apps-api`
- Output shows all Docker build steps completed

**Validation**:
- [ ] Docker image created (verify with `docker images | grep apps-api`)
- [ ] No Docker build errors
- [ ] Build includes dependency installation steps

### Phase 4: Configure Release

**Update `nx.json`** by adding this configuration:
```json
{
  "release": {
    "releaseTagPattern": {
      "pattern": "release/{projectName}/{version}"
    },
    "groups": {
      "apps": {
        "projects": ["api"],
        "projectsRelationship": "independent",
        "docker": {
          "skipVersionActions": true
        },
        "changelog": {
          "projectChangelogs": true
        }
      }
    }
  }
}
```

**Validation**:
- [ ] Configuration added to `nx.json`
- [ ] JSON is valid

### Phase 5: Test Release with Docker

**Command**:
```bash
nx release --dockerVersionScheme=production --first-release --dry-run
```

**Expected Result**:
- Release command runs successfully
- Docker image tagged with production version scheme
- Changelog preview generated
- Warning about experimental Docker support is shown

**Validation**:
- [ ] Version generated in format `YYMM.DD.{hash}` (e.g., `2507.30.a4bdd12`)
- [ ] Docker image tagged with new version
- [ ] Changelog entry created for `apps/api`
- [ ] Dry run completes without errors

## Success Criteria

All tests pass when:
1. ✅ Workspace creation completes without errors
2. ✅ `nx build api` executes successfully
3. ✅ `nx docker:build api` creates Docker image
4. ✅ Release configuration is accepted
5. ✅ `nx release` command runs with Docker version scheme

## Common Issues & Troubleshooting

### Docker Daemon Not Running
**Error**: "Cannot connect to Docker daemon"  
**Solution**: Start Docker Desktop or Docker daemon

### Permission Errors
**Error**: "Permission denied" during Docker build  
**Solution**: Ensure user has Docker permissions

### Version Not Found
**Error**: "404 Not Found" for Nx version  
**Solution**: Verify the PR build version exists

## Cleanup

After testing:
```bash
cd ..
rm -rf {TEST_DIR}
```

## Notes

- **IMPORTANT**: Do NOT run `nx add @nx/docker` - it's already included
- The Docker support warning is expected as it's experimental
- Release tag pattern follows `release/{projectName}/{version}` format

## Example Usage

To run this test plan:
```bash
# Set variables
NX_VERSION="0.0.0-pr-32120-1cb4170"
TEST_DIR="test-nx-pr-32120"

# Follow the test steps above with these values
```

## Test Execution Tracking

When implementing or executing this task:
- [ ] Phase 1: Workspace Creation - Status: 
- [ ] Phase 2: Build API - Status: 
- [ ] Phase 3: Docker Build - Status: 
- [ ] Phase 4: Configure Release - Status: 
- [ ] Phase 5: Test Release - Status: 

**CRITICAL**: Keep track of test execution in this section when running the tests!