# Fix PPA Hermetic Build - Remove Network Dependencies

## Problem Statement
The current PPA build on Launchpad fails because the `debian/rules` file uses `curl` to download the nx package from npmjs during the build process. Launchpad's build environment blocks network requests to ensure builds are hermetic and reproducible. We need to pre-package the nx package with all its dependencies in the source package instead of downloading during the build.

## Research Findings

### Current Issues
1. **debian/rules** uses `curl` on lines 14 and 67 to download nx package
2. **npm install** is also run on line 71, which requires network access
3. The build process expects to download dependencies at build time, which violates Launchpad's hermetic build requirements

### Best Practices for Debian Node.js Packages
Based on research, the standard approach is:
1. Pre-install all dependencies and include them in the source package
2. Use a `debian/vendor/` directory to store the complete node_modules tree
3. Use the pre-installed dependencies during build instead of downloading
4. Ensure the build works completely offline

## Plan

### Step 1: Modify debian/rules to use pre-installed dependencies
- Remove all `curl` commands
- Update to use nx package from `debian/vendor/node_modules/nx`
- Remove `npm install` command since we'll ship the complete package with dependencies
- Update wrapper script to use the pre-installed package

**Files to modify:**
- `debian/rules`

**Changes:**
- Replace curl download with copy from debian/vendor/node_modules/nx
- Add checks to verify pre-installed files exist
- Update paths to use vendor node_modules
- Simplify the build process

### Step 2: Update CI workflow to pre-install nx with all dependencies
- Add step to run `npm install nx@VERSION` in debian/vendor before building
- This creates a complete node_modules directory with nx and all its dependencies
- Update debian/rules to use the pre-installed node_modules

**Files to modify:**
- `.github/workflows/ci.yml`

**Changes:**
- Add step to create debian/vendor/ and run `npm install nx@VERSION` inside it
- This creates debian/vendor/node_modules/nx with all dependencies
- Ensure debian/vendor/ is included when copying files for build

### Step 3: Update publish workflow with same changes
- Apply the same pre-install approach to the publish workflow
- Ensure consistency between CI and publish workflows

**Files to modify:**
- `.github/workflows/publish.yml`

**Changes:**
- Add step to create debian/vendor/ and run `npm install nx@VERSION` inside it
- Ensure debian/vendor/ is included in the source package with all dependencies

### Step 4: Add debian/vendor to source package configuration
- Update .gitignore to exclude vendor files from git
- Create necessary debian configuration files if needed

**Files to create/modify:**
- `.gitignore` (to exclude vendor files from git)
- `debian/source/include-binaries` (if needed for binary files)

### Step 5: Test and validate
- Run CI to ensure the package builds correctly
- Verify `nx --version` works after installation
- Check that no network access is required during build

## Implementation Steps

### 1. Update debian/rules (Commit 1)
```bash
# Remove curl dependency and npm install
# Change from downloading to copying from debian/vendor/node_modules/nx
# Update wrapper script to use vendor path
```

### 2. Update .gitignore (Commit 2)
```bash
# Add debian/vendor/ to gitignore
# This directory will be populated during CI/publish
```

### 3. Update CI workflow (Commit 3)
```bash
# Add step to npm install nx@VERSION in debian/vendor/
# Ensure vendor directory with node_modules is included in build
```

### 4. Update publish workflow (Commit 4)
```bash
# Add same pre-install step as CI
# Ensure vendor directory with node_modules is included in source package
```

### 5. Add debian/source/include-binaries if needed (Commit 5)
```bash
# List any binary files that need to be included
# This ensures dpkg-source includes them properly
```

## Expected Outcome

After implementing these changes:
1. The debian package will build without requiring network access
2. CI will continue to pass, successfully installing and running `nx --version`
3. The publish workflow will create source packages that build successfully on Launchpad
4. The PPA builds will succeed in Launchpad's hermetic environment
5. The nx wrapper will use the pre-installed dependencies from debian/vendor/node_modules/

## Alternative Approaches Considered

1. **Just downloading .tgz** - Insufficient because nx has many dependencies that also need to be available
2. **Using dpkg-vendor** - More complex, not needed for this use case
3. **Embedding in nx-deb directory** - The existing nx-deb directory seems incomplete, better to use standard debian/vendor approach
4. **Using npm offline mode** - Still requires initial package download, doesn't fully solve the problem

## Risks and Mitigation

1. **Risk**: Package size increases significantly due to included dependencies
   - **Mitigation**: Only include production dependencies, exclude dev dependencies

2. **Risk**: Version mismatches between installed package and debian/rules
   - **Mitigation**: Use variable for version in both places, ensure consistency

3. **Risk**: Binary compatibility issues
   - **Mitigation**: Install and build on same architecture, test thoroughly

4. **Risk**: Node.js version compatibility
   - **Mitigation**: Use same Node.js version for install and runtime