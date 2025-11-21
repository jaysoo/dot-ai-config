# NXC-3508: Build fails with exit code 129 for nx 20.3.0

**Linear Issue**: https://linear.app/nxdev/issue/NXC-3508/build-fails-with-exit-code-129-for-nx-2030
**GitHub Issue**: https://github.com/nrwl/nx/issues/29481

## Problem Summary

Users experience intermittent build failures with exit code 129 when installing nx (particularly version 20.3.0) via Yarn 4 in CI/CD environments (GitHub Actions, GitLab CI). The error message:

```
➤ YN0009: nx@npm:20.3.0 [78682] couldn't be built successfully (exit code 129, logs can be found here: /tmp/xfs-557bb8a4/build.log)
```

### Key Characteristics
- **Intermittent**: Happens in ~100% of some repos, sporadic in others
- **Environment-specific**: Only occurs in CI/CD, never locally
- **No detailed logs**: Just exit code 129, no stack traces
- **Requires retries**: Usually succeeds after 1-2 retries

## Root Cause Analysis

### 1. Multiple Nx Versions in Dependency Tree

The primary cause is **multiple versions of nx installed in the same workspace**. This happens when:

- Direct dependency on nx 21.x while lerna brings in nx 20.x
- Direct dependency on nx 20.x while another package brings in nx 19.x
- Any scenario where `yarn why nx` shows multiple versions

Example from GitHub issue #29481:
```bash
% yarn why nx -R
└─ grafana@workspace:.
   ├─ lerna@npm:8.2.3 (via npm:8.2.3)
   │  ├─ @lerna/create@npm:8.2.3 (via npm:8.2.3)
   │  │  └─ nx@npm:20.7.1 [7006a]
   │  └─ nx@npm:20.7.1 [7006a]
   └─ nx@npm:21.3.11 [655a6]  # Two different versions!
```

### 2. Postinstall Script Behavior

The nx postinstall script (`packages/nx/bin/post-install.ts`) performs several operations:

```typescript
// packages/nx/bin/post-install.ts:24-29
if (isMainNxPackage() && fileExists(join(workspaceRoot, 'nx.json'))) {
  assertSupportedPlatform();

  if (isNxCloudUsed(readNxJson())) {
    await verifyOrUpdateNxCloudClient(getCloudOptions());
  }
}
```

**What it does:**
1. Checks if this is the main nx package (`isMainNxPackage()`)
2. Verifies platform support (`assertSupportedPlatform()`)
3. Checks/updates Nx Cloud client if configured
4. Has a 30-second timeout safety mechanism
5. Catches all exceptions and exits gracefully with code 0

**The function `isMainNxPackage()` is critical:**
```typescript
// packages/nx/bin/post-install.ts:44-50
function isMainNxPackage() {
  const mainNxPath = require.resolve('nx', {
    paths: [workspaceRoot],
  });
  const thisNxPath = require.resolve('nx');
  return mainNxPath === thisNxPath;
}
```

This tries to determine if the currently installing nx package is the "main" one that should run.

### 3. Why Exit Code 129?

Exit code 129 typically indicates:
- **SIGHUP (Signal 1 + 128 = 129)**: Process received hangup signal
- **Segmentation fault**: Process crashed due to memory access violation
- **Resource exhaustion**: OOM killer or CPU throttling

### 4. Why Multiple Versions Cause Issues

When Yarn 4 installs packages with multiple nx versions:

1. **Parallel execution**: Yarn 4 runs postinstall scripts in parallel
2. **Resource contention**: Multiple nx postinstalls compete for:
   - CPU cycles (limited in CI environments)
   - Memory (building project graphs, reading files)
   - File system access (reading nx.json, package.json, etc.)
3. **Race conditions**: Multiple processes trying to:
   - Resolve the "main" nx package
   - Read/write to the same workspace files
   - Access node_modules structure simultaneously
4. **Process limits**: CI runners often have strict process/resource limits

### 5. Why CI/CD Only?

- **Limited resources**: CI runners typically have 1-2 CPUs, 2-4GB RAM
- **Strict limits**: Container resource limits, process limits
- **No interactive shell**: Different signal handling
- **Clean environment**: No cached files, everything runs from scratch
- **Concurrent builds**: Multiple projects/shards running simultaneously

## How Users Can Run Into This

### Scenario 1: Using Lerna with Nx
```json
// package.json
{
  "dependencies": {
    "lerna": "^8.2.3",  // Brings nx 20.x as dependency
    "nx": "^21.3.0"      // Latest nx
  }
}
```

### Scenario 2: Transitive Dependencies
```
workspace
├── package-a (depends on tool-x which depends on nx@19.x)
└── package-b (depends on nx@20.x)
```

### Scenario 3: Monorepo with Mixed Versions
```
root: nx@21.x
└── apps/legacy-app
    └── package.json with nx@19.x (not cleaned up)
```

### Scenario 4: After Nx Upgrade
- Upgraded main nx version
- Forgot to update other packages that depend on nx
- Now have old + new versions in tree

## Confirmed Solutions

### Solution 1: Ensure Single Nx Version (Recommended)
**Status**: ✅ Confirmed working by multiple users

Clean up dependency tree to have only one nx version:

```bash
# 1. Check current state
yarn why nx -R

# 2. Identify packages bringing in old nx versions
# Common culprits: lerna, @lerna/create, nx plugins

# 3. Update those packages or add resolutions
# Option A: Update lerna/other packages to latest
yarn upgrade lerna --latest

# Option B: Use package.json resolutions
{
  "resolutions": {
    "nx": "21.3.11"  // Force single version
  }
}

# 4. Verify
yarn install
yarn why nx -R  # Should show single version
```

**Evidence**: From GitHub issue comments:
- @sir-captainmorgan21: "We got all ours in sync and are watching it... since doing that, the issue has cleared up"
- @mmuenker: "I can confirm that after cleaning up the dependencies and ensuring that only one version of nx is installed, the error no longer appears"

### Solution 2: Disable Postinstall Scripts
**Status**: ✅ Working workaround

Use Yarn's `dependenciesMeta` to disable nx postinstall:

```json
// package.json
{
  "dependenciesMeta": {
    "nx": {
      "built": false
    }
  }
}
```

**Pros**:
- Quick workaround
- No dependency tree changes needed
- Postinstall script is non-critical (just validation/setup)

**Cons**:
- Disables Nx Cloud client updates
- May miss future critical postinstall steps
- Doesn't fix root cause

**Evidence**:
- @joshhunt: "We've worked around this issue with yarn by using the dependenciesMeta property... For now this seems fine"
- Reference: https://github.com/grafana/grafana/pull/109508/files

### Solution 3: Increase CI Resources
**Status**: ⚠️ May help but not guaranteed

Some teams report testing with more CPU/memory:
- Upgrade from n1-standard-1 (1 vCPU, 3.75GB) to higher tier
- Allocate more resources per job

**Effectiveness**: Unknown, needs more data

## Potential Code Fixes

### Option 1: Improve `isMainNxPackage()` Detection

**Current issue**: The resolution logic might fail or race when multiple versions exist

```typescript
// Current implementation (packages/nx/bin/post-install.ts:44-50)
function isMainNxPackage() {
  const mainNxPath = require.resolve('nx', {
    paths: [workspaceRoot],
  });
  const thisNxPath = require.resolve('nx');
  return mainNxPath === thisNxPath;
}
```

**Potential improvements**:
1. Add better error handling for resolution failures
2. Use file-based locking to ensure only one postinstall runs
3. Add retry logic with exponential backoff
4. Short-circuit earlier if not main package

### Option 2: Add Process Coordination

Use a lock file to coordinate multiple postinstall processes:

```typescript
import { existsSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

function acquireLock(): boolean {
  const lockFile = join(workspaceRoot, '.nx-postinstall.lock');
  try {
    if (existsSync(lockFile)) {
      // Check if lock is stale (> 30 seconds old)
      const stats = statSync(lockFile);
      if (Date.now() - stats.mtimeMs > 30000) {
        unlinkSync(lockFile);
      } else {
        return false; // Another process has the lock
      }
    }
    writeFileSync(lockFile, process.pid.toString());
    return true;
  } catch {
    return false;
  }
}
```

### Option 3: Warn About Multiple Versions

Add detection and warning when multiple nx versions are installed:

```typescript
function checkForMultipleNxVersions() {
  try {
    // Use yarn/pnpm/npm to detect multiple versions
    // Log warning if detected
  } catch {
    // Non-critical, ignore
  }
}
```

### Option 4: Make Postinstall Even More Resilient

- Reduce operations performed in postinstall
- Move more work to first actual nx command execution
- Add better timeout handling per operation
- Improve logging for debugging

## Testing Plan

### 1. Local Reproduction (if possible)

Create a test repository with multiple nx versions:

```bash
cd /tmp
mkdir nx-exit-129-test
cd nx-exit-129-test

# Initialize with Yarn 4
yarn init -y
yarn set version berry

# Add multiple nx versions via lerna + direct dep
yarn add lerna@8.2.3 nx@21.3.11

# Check versions
yarn why nx -R

# Try to reproduce with resource limits
# (docker with limited CPU/memory)
```

### 2. CI/CD Reproduction

Use GitHub Actions with minimal resources:

```yaml
# .github/workflows/test-nx-postinstall.yml
name: Test Nx Postinstall
on: [push]
jobs:
  test-limited-resources:
    runs-on: ubuntu-latest
    container:
      image: node:20
      options: --cpus 1 --memory 1g
    steps:
      - uses: actions/checkout@v4
      - run: yarn install
```

### 3. Verify Fixes

For each potential fix:
1. Apply the change
2. Create test repo with multiple nx versions
3. Run install 50-100 times in CI
4. Measure success rate before/after

### 4. Monitor Existing Repos

Check with affected users (Redwood, Grafana) if they can test:
- Potential fixes
- Verify single-version solution continues to work
- Benchmark performance impact

## Next Steps

1. **Immediate**: Document workarounds for users
   - [ ] Update GitHub issue with findings
   - [ ] Add to Nx docs troubleshooting section
   - [ ] Create error message improvement

2. **Short-term**: Improve resilience
   - [ ] Add better error handling in postinstall
   - [ ] Add detection/warning for multiple versions
   - [ ] Improve logging for debugging

3. **Long-term**: Consider postinstall necessity
   - [ ] Evaluate if postinstall is needed at all
   - [ ] Move operations to first command execution
   - [ ] Simplify postinstall to absolute minimum

## Additional Resources

- Exit code 129 discussion: https://github.com/akeneo/pim-community-dev/issues/9462
- Yarn 4 postinstall behavior: https://yarnpkg.com/advanced/lifecycle-scripts
- Yarn dependenciesMeta: https://yarnpkg.com/configuration/manifest#dependenciesMeta

## Investigation Questions

- [ ] Can we reproduce locally with Docker + resource limits?
- [ ] What is the actual signal/error causing exit 129?
- [ ] Can we get strace/debug logs from failing CI runs?
- [ ] How often does `isMainNxPackage()` return false for secondary versions?
- [ ] Are there other packages with similar issues?
- [ ] What percentage of users have multiple nx versions in their tree?

## Notes

- The postinstall script already has good error handling (try/catch, process event handlers)
- The `|| exit 0` in package.json should make failures non-fatal, but yarn still reports them
- The 30-second timeout suggests some operations might be hanging, not just failing fast
- Exit code 129 is unusual - most postinstall failures use 1 or 2
