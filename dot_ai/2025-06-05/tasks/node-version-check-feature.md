# Add Node.js Version Check to NX Debian Package

## Task Overview
Enhance the nx Debian package to detect the user's Node.js version and warn if it's below version 20, providing helpful guidance for upgrading.

## Context & Problem Statement
- Ubuntu's official Node.js packages are often outdated (e.g., Ubuntu 22.04 LTS ships with Node.js 12.x)
- NX requires Node.js 20+ for optimal functionality
- Users installing via `apt-get install nx` may have older Node.js versions
- Users need clear guidance on how to upgrade Node.js on their system

## Implementation Plan (Debian package changes only)

### Step 1: Create New Branch
**Goal**: Create a feature branch for the Node.js version check
**Commands**: 
- `git checkout -b feat/node-version-check`

**Commit**: Initial branch creation (no commit needed)

### Step 2: Enhance the nx Binary Wrapper Script
**Goal**: Add Node.js version detection and warning logic
**File**: Modify the wrapper script generation in `debian/rules`
**Changes**:
- Add Node.js version detection using `node --version`
- Parse the version and compare against minimum requirement (20.0.0)
- Display warning message if version is insufficient
- Still allow nx to run (warning only, not blocking)

**Script Logic**:
```bash
#!/bin/bash
# Check Node.js version
NODE_VERSION=$(node -v 2>/dev/null | sed 's/v//')
REQUIRED_VERSION="20.0.0"

# Version comparison function
version_gt() {
    test "$(printf '%s\n' "$@" | sort -V | head -n 1)" != "$1"
}

# Check if Node.js version is sufficient
if [ -n "$NODE_VERSION" ] && ! version_gt "$NODE_VERSION" "$REQUIRED_VERSION"; then
    echo "⚠️  Warning: NX requires Node.js 20 or higher. You have Node.js $NODE_VERSION." >&2
    echo "" >&2
    echo "To update Node.js on Ubuntu/Debian, we recommend using NodeSource:" >&2
    echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -" >&2
    echo "  sudo apt-get install -y nodejs" >&2
    echo "" >&2
    echo "Alternative methods:" >&2
    echo "  - Using nvm: https://github.com/nvm-sh/nvm" >&2
    echo "  - Using fnm: https://github.com/Schniz/fnm" >&2
    echo "  - Using snap: sudo snap install node --classic --channel=20" >&2
    echo "" >&2
fi

# Run nx with proper NODE_PATH
NODE_PATH="/usr/lib/nx/node_modules" exec node /usr/lib/nx/node_modules/nx/bin/nx.js "$@"
```

**Commit**: "feat: add Node.js version check with helpful upgrade guidance"

### Step 3: Documentation Update
**Goal**: Document the Node.js version requirement
**Files**: 
- Update README.md if needed
- Consider adding a note to debian/control description

**Commit**: "docs: document Node.js version requirements"

## Alternative Approaches Considered

1. **Block execution if Node.js < 20**
   - Pros: Ensures users have compatible version
   - Cons: Too aggressive, may break existing workflows
   - Decision: Warning-only approach is more user-friendly

2. **Auto-install newer Node.js**
   - Pros: Solves the problem automatically
   - Cons: Modifying system packages without consent is bad practice
   - Decision: Provide guidance instead

3. **Bundle Node.js with the package**
   - Pros: Guarantees correct version
   - Cons: Large package size, conflicts with system Node.js
   - Decision: Not feasible for Debian packaging standards

## Expected Outcome

1. ✅ Users with Node.js < 20 see a helpful warning with upgrade instructions
2. ✅ Warning includes multiple upgrade methods (NodeSource, nvm, fnm, snap)
3. ✅ NX still runs regardless of Node.js version (non-blocking)
4. ✅ CI continues to pass without changes
5. ✅ No impact on users with Node.js 20+

## Success Criteria

- [ ] Node.js version detection works correctly
- [ ] Warning message displays for versions < 20
- [ ] Multiple upgrade paths are clearly documented in the warning
- [ ] NX execution is not blocked
- [ ] CI passes without any workflow changes
- [ ] Feature works on fresh Ubuntu installations

## Rollback Plan

If issues arise, we can:
1. Revert to simple wrapper without version check
2. Make the check opt-in via environment variable
3. Adjust version threshold if needed

## Testing Instructions

1. Install the package on Ubuntu with old Node.js
2. Run `nx --version` and verify warning appears
3. Follow one of the upgrade methods
4. Run `nx --version` again and verify no warning
5. Ensure nx functionality works throughout