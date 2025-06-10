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

### Step 2: Update debian/rules to Include Version Check in Wrapper Script
**File:** `debian/rules`

Replace the current wrapper script generation (lines 19-22) with an expanded version that includes the version check:

```bash
# Create binary wrapper with version check
mkdir -p debian/tmp/usr/bin
cat > debian/tmp/usr/bin/nx << 'EOF'
#!/bin/bash

# Check Node.js version and warn if < 20
NODE_VERSION=$(node -v 2>/dev/null | grep -oE 'v[0-9]+' | cut -c2-)

if [ -n "$NODE_VERSION" ] && [ "$NODE_VERSION" -lt 20 ]; then
    cat >&2 << 'WARNING'
╔══════════════════════════════════════════════════════════════════════╗
║                         ⚠️  NODE.JS WARNING ⚠️                         ║
╠══════════════════════════════════════════════════════════════════════╣
║ You are using Node.js version v$NODE_VERSION                                ║
║ Node.js >= 20 is recommended for optimal compatibility with nx.      ║
║                                                                      ║
║ Your current version may work but could encounter issues.            ║
║                                                                      ║
║ To upgrade Node.js:                                                  ║
║ • Visit: https://nodejs.org/en/download/                             ║
║ • Or use NodeSource: https://github.com/nodesource/distributions    ║
║                                                                      ║
║ For Ubuntu/Debian:                                                   ║
║   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - ║
║   sudo apt-get install -y nodejs                                     ║
╚══════════════════════════════════════════════════════════════════════╝

WARNING
fi

# Execute nx with proper NODE_PATH
NODE_PATH="/usr/lib/nx/node_modules" exec node /usr/lib/nx/node_modules/nx/bin/nx.js "$@"
EOF
chmod +x debian/tmp/usr/bin/nx
```

**Key changes:**
- The wrapper script now checks Node.js version before executing nx
- Uses simple bash commands to extract major version number
- Displays formatted warning box for versions < 20
- Continues execution after warning (non-blocking)
- Uses a heredoc within a heredoc for clean formatting

### Step 3: Test the Changes
Build and test the package:
1. Build the Debian package with the modifications
2. Install on systems with different Node.js versions:
   - Ubuntu 22.04 (Node.js 12.x)
   - Ubuntu 23.04 (Node.js 18.x) 
   - System with Node.js 20+
3. Verify:
   - Package installs without errors
   - Warning appears for Node.js < 20
   - No warning for Node.js >= 20
   - nx executes successfully after warning

## Expected Outcome

After implementation:
- The nx Debian package will install on Ubuntu 22.04 and other systems with older Node.js
- Users with Node.js < 20 will see a clear warning with upgrade instructions every time they run nx
- The package will continue to work (with potential compatibility issues)
- No additional files or dependencies are needed

## Advantages of This Approach

1. **Simplicity**: All logic contained in debian/rules, no extra files needed
2. **Maintainability**: Version check is part of the build process
3. **Performance**: Minimal overhead (simple bash version check)
4. **User Experience**: Clear, formatted warning with actionable steps

## Potential Considerations

1. **Warning Frequency**: Users will see the warning on every nx invocation
   - This is intentional to encourage upgrades
   - Could be mitigated with a flag file if needed later

2. **Version Parsing**: The regex approach is simple but assumes standard Node.js version format
   - Should work for all official Node.js releases

3. **Formatting**: The warning box may not display correctly in some terminals
   - ASCII box characters should work in most modern terminals