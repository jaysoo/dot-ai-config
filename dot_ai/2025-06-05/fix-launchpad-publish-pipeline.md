# Fix Launchpad Publish Pipeline

## Problem Analysis

The publish workflow is failing with error: `dpkg-checkbuilddeps: error: Unmet build dependencies: nodejs npm`

**Key Issue**: 
- The publish workflow builds a **source package** (`debuild -S -sa`) for upload to Launchpad PPA
- Source packages check build dependencies but don't actually run the build
- The GitHub Actions environment doesn't have nodejs/npm installed when building source packages
- Launchpad build servers will handle the actual building

**Current Build-Depends**: `debhelper (>= 10), nodejs, npm, curl`

## Solution Approach

For PPA source packages, we need to reconsider our build dependencies:
- `npm` is NOT needed since we use `curl` to download the tarball
- `nodejs` might not be needed at build time either (only at runtime)
- `curl` is still needed for downloading nx tarball

## Implementation Plan (Direct to main branch)

### Step 1: Remove npm from Build-Depends
**Change**: Remove `npm` from debian/control Build-Depends
**Reasoning**: We use curl to download nx, not npm
**Expected**: This should fix most of the build dependency issues

**Commit**: "fix: remove npm from build dependencies - use curl instead"

### Step 2: Evaluate nodejs as Build Dependency
**Analysis**: Check if nodejs is actually needed during build
- The wrapper script needs node at runtime, not build time
- Building doesn't execute any JavaScript
**Change**: Consider removing nodejs from Build-Depends if not needed
**Alternative**: Keep it if Launchpad requires it for some reason

**Commit**: "fix: remove nodejs from build deps - only needed at runtime"

### Step 3: Update Package Version
**Change**: Update rules file to use nx version 20.8.0 as requested
**File**: debian/rules - change `NX_VERSION := 21.0.4` to `NX_VERSION := 20.8.0`

**Commit**: "chore: update nx version to 20.8.0"

### Step 4: Test and Iterate
**Process**:
1. Push each change to main
2. Check publish workflow
3. If it fails, analyze logs and adjust
4. Repeat until workflow succeeds

## Build Dependency Analysis

### What's Actually Needed at Build Time:
- `debhelper`: Required for Debian packaging tools
- `curl`: Required to download nx tarball in override_dh_auto_build

### What's NOT Needed at Build Time:
- `npm`: We don't use npm pack anymore, we use curl
- `nodejs`: Only needed at runtime when users run nx

### Runtime Dependencies (unchanged):
- `nodejs`: Required when users actually run nx

## Expected Final State

```
Build-Depends: debhelper (>= 10), curl
Depends: nodejs
```

## Alternative If Issues Persist

If removing nodejs causes issues on Launchpad build servers:
1. Add `-d` flag to override dependency checks in source build
2. OR use `dpkg-buildpackage` directly with `-d` flag
3. OR investigate if we can skip the local dependency check for source packages

## Success Criteria

- [ ] Publish workflow builds source packages successfully
- [ ] Source packages upload to Launchpad PPA
- [ ] Launchpad successfully builds the binary packages
- [ ] End users can install and run nx from the PPA