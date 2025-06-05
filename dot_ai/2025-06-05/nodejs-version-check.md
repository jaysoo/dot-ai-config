# Plan: Modify Node.js Version Requirements and Add Runtime Warning

**Date:** 2025-06-05  
**Type:** Enhancement  
**Goal:** Remove strict Node.js >= 18 dependency requirement for better compatibility with Ubuntu 22.04 and other distributions, while adding a runtime warning for Node.js versions < 20

## Background

Currently, the nx Debian package has a hard dependency on `nodejs (>= 18.0.0)` in the `debian/control` file. This prevents installation on systems with older Node.js versions, particularly Ubuntu 22.04 which ships with Node.js 12.x by default.

## Requirements

1. Remove the version constraint from the Debian package dependencies
2. Add a runtime check that warns users if Node.js < 20 but allows execution
3. The warning should guide users to install a newer version if needed
4. The package should still work with older Node.js versions (with warning)

## Implementation Steps

### Step 1: Modify Debian Control File
**File:** `debian/control`
- Change `Depends: nodejs (>= 18.0.0)` to `Depends: nodejs`
- This allows installation on any system with Node.js installed

**Reasoning:** Removing the version constraint makes the package installable on more systems, particularly Ubuntu 22.04 LTS.

### Step 2: Create Version Check Script
**File:** `.ai/2025-06-05/check-node-version.mjs` (prototype)
- Create a Node.js script that:
  - Checks the current Node.js version
  - Returns structured data about version compatibility
  - Can be integrated into the nx wrapper script

### Step 3: Modify the nx Wrapper Script
**File:** `debian/rules` (generates the wrapper script)
- Update the wrapper script generation to include:
  - Node.js version check before executing nx
  - Warning message for Node.js < 20
  - Guidance on upgrading Node.js
  - Continue execution after warning

**Warning message should include:**
```
WARNING: You are using Node.js version X.X.X
Node.js >= 20 is recommended for optimal compatibility with nx.
Your current version may work but could encounter issues.

To upgrade Node.js, visit: https://nodejs.org/en/download/
Or use NodeSource repository: https://github.com/nodesource/distributions
```

### Step 4: Test the Changes
**File:** `.ai/2025-06-05/test-version-check.sh`
- Create test script to verify:
  - Package installs on systems with various Node.js versions
  - Warning appears for Node.js < 20
  - No warning for Node.js >= 20
  - nx still executes after warning

## Alternative Approaches Considered

1. **Using a postinstall script**: Could check version during installation, but wouldn't help with Node.js upgrades after package installation
2. **Creating a separate compatibility package**: Too complex for this use case
3. **Using Recommends instead of Depends**: Still wouldn't provide runtime guidance

## Expected Outcome

After implementation:
- The nx Debian package will install on Ubuntu 22.04 and other systems with older Node.js
- Users with Node.js < 20 will see a clear warning with upgrade instructions
- The package will continue to work (with potential compatibility issues)
- Users can upgrade Node.js at their convenience without reinstalling nx

## Potential Risks

1. **Compatibility Issues**: nx may not work correctly with very old Node.js versions
   - Mitigation: Clear warning message sets expectations
   
2. **Support Burden**: Users may report issues when using unsupported Node.js versions
   - Mitigation: Warning message clearly states recommended version

3. **Performance**: Adding version check to every nx invocation adds overhead
   - Mitigation: Check should be minimal, can cache result if needed

## Next Steps

1. Review this plan
2. Implement the changes in order
3. Test on various Ubuntu/Debian versions
4. Update documentation if needed