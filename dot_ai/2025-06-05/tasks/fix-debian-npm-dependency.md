# Fix Debian Package Build - NPM Dependency Error

## Problem Analysis

The Debian package build is failing with error `npm: No such file or directory` during the `override_dh_auto_build` step in `debian/rules`.

**Root Cause**: 
- The CI workflow installs Node.js and npm using GitHub Actions
- However, when `debuild -us -uc -b` runs, it creates a clean build environment 
- This clean environment doesn't inherit the npm installation from the CI setup
- `debian/control` declares `nodejs` as a runtime dependency but npm is not available during build

**Error Location**: `debian/rules:11` - `npm pack nx@$(NX_VERSION)`

## Current State Analysis

1. **CI Workflow** (`.github/workflows/ci.yml`):
   - ✅ Installs Node.js 20 and npm via `actions/setup-node@v4`
   - ✅ Verifies npm is available before build
   - ❌ npm not available in debuild's clean environment

2. **Debian Control** (`debian/control`):
   - ✅ Declares `nodejs` as runtime dependency
   - ❌ Missing npm as build dependency

3. **Build Process** (`debian/rules`):
   - ❌ Uses `npm pack` and `npm install` without ensuring npm availability
   - ❌ No fallback or alternative approach

## Solution Plan

### Step 1: Add npm as Build Dependency
**Goal**: Ensure npm is available during package build process
**Files**: `debian/control`
**Changes**: 
- Add `npm` to `Build-Depends` field alongside `debhelper`
- This ensures npm is installed in the clean build environment

**Commit**: "fix: add npm as build dependency for Debian package"

### Step 2: Verify Build Dependencies
**Goal**: Ensure the dependency change works in our CI environment
**Files**: Potentially `debian/control` (if Ubuntu package name differs)
**Reasoning**: 
- Ubuntu/Debian might package npm differently
- May need `nodejs-npm` or similar package name
- Alternative: Could use `curl` + `tar` to download instead of `npm pack`

**Commit**: "fix: adjust npm build dependency package name if needed"

### Step 3: Add Build Environment Validation
**Goal**: Add early failure detection for missing dependencies
**Files**: `debian/rules`
**Changes**:
- Add dependency check at start of `override_dh_auto_build`
- Provide clear error message if npm is not available

**Commit**: "feat: add build dependency validation in debian/rules"

### Step 4: Test and Iterate
**Goal**: Ensure CI passes completely
**Process**:
- Push changes to ci branch
- Monitor CI build results
- Make additional adjustments if needed

## Expected Outcome

1. ✅ `debuild -us -uc -b` completes successfully
2. ✅ nx package is built without npm-related errors  
3. ✅ Package installs correctly (`sudo apt-get install -y ./nx_*.deb`)
4. ✅ `nx --version` command works after installation
5. ✅ All CI checks pass

## Alternative Approaches (if primary solution fails)

1. **Download without npm**: Replace `npm pack` with direct tarball download from npm registry
2. **Static bundling**: Pre-bundle nx dependencies and include in source
3. **Docker build**: Use containerized build with guaranteed npm availability

## Risk Assessment

- **Low Risk**: Adding npm build dependency is standard practice
- **Medium Risk**: Ubuntu package name for npm might differ from expectation
- **Mitigation**: Have fallback approaches ready

## Success Criteria

- [ ] CI build passes without npm-related errors
- [ ] Debian package builds successfully
- [ ] Package installation works
- [ ] nx command functions correctly post-install