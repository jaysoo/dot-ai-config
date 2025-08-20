# Vite 7 Upgrade Testing Plan

## Overview
This document provides a comprehensive testing plan for the Vite 7 upgrade in Nx (PR #32422). The plan includes testing new workspace creation, migration of existing workspaces, and validation of all breaking changes.

## PR Changes Summary
The PR modifies the following:
- Updates default Vite version from ^6.0.0 to ^7.0.0
- Adds `viteV6Version` variable to support backwards compatibility
- Updates init generator to support `useViteV5` and `useViteV6` flags
- Adds migration for 21.5.0 to update Vite to ^7.1.3
- Updates peer dependencies to support Vite 7

## Vite 7 Breaking Changes to Test

### 1. Node.js Support
- **Breaking Change**: Drops Node.js v18 support (EOL April 2025)
- **Test**: Ensure Node.js v20+ is required

### 2. Sass Legacy API Removal
- **Breaking Change**: Legacy Sass JS API is removed
- **Test**: Check projects using Sass compile correctly with modern API

### 3. Browser Target Change
- **Breaking Change**: Default browser target is now 'baseline-widely-available'
- **Test**: Verify build output and browser compatibility

### 4. Removed Properties
- **Breaking Change**: Several deprecated properties removed
- **Test**: Ensure no usage of removed properties in Nx integration

## Testing Plan Execution

### Phase 1: Environment Setup

```bash
# Verify Node.js version
node --version  # Should be v20+ for Vite 7

# Clone fresh Nx repo for testing
cd ~/tmp/claude
mkdir -p vite7-testing
cd vite7-testing

# Checkout the PR branch
git clone https://github.com/nrwl/nx.git nx-vite7
cd nx-vite7
gh pr checkout 32422

# Install dependencies
pnpm install

# Build Nx packages locally
pnpm build
```

### Phase 2: Test New Workspace Creation

```bash
# Test 1: Create new React + Vite workspace
cd ~/tmp/claude/vite7-testing
npx create-nx-workspace@latest test-react-vite7 \
  --preset=react-monorepo \
  --bundler=vite \
  --e2eTestRunner=playwright \
  --style=css \
  --pm=pnpm

cd test-react-vite7

# Verify Vite 7 is installed
pnpm list vite  # Should show ^7.0.0

# Test the application
pnpm nx run test-react-vite7:serve
pnpm nx run test-react-vite7:build
pnpm nx run test-react-vite7:test
pnpm nx run test-react-vite7:lint

# Test 2: Create new Vue + Vite workspace
cd ~/tmp/claude/vite7-testing
npx create-nx-workspace@latest test-vue-vite7 \
  --preset=vue-monorepo \
  --bundler=vite \
  --e2eTestRunner=playwright \
  --style=css \
  --pm=pnpm

cd test-vue-vite7
pnpm nx run test-vue-vite7:serve
pnpm nx run test-vue-vite7:build
pnpm nx run test-vue-vite7:test

# Test 3: Create new workspace with Web + Vite
cd ~/tmp/claude/vite7-testing
npx create-nx-workspace@latest test-web-vite7 \
  --preset=web-components \
  --bundler=vite \
  --pm=pnpm

cd test-web-vite7
pnpm nx run test-web-vite7:serve
pnpm nx run test-web-vite7:build
pnpm nx run test-web-vite7:test
```

### Phase 3: Test Existing Workspace Migration

```bash
# Test migration from Vite 6 to Vite 7
cd ~/tmp/claude/vite7-testing

# Create a workspace with Vite 6 first
npx create-nx-workspace@21.4.0 test-vite6-migration \
  --preset=react-monorepo \
  --bundler=vite \
  --pm=pnpm

cd test-vite6-migration

# Verify it has Vite 6
pnpm list vite  # Should show ^6.0.0

# Run migration
pnpm nx migrate latest
pnpm install
pnpm nx migrate --run-migrations

# Verify Vite 7 is now installed
pnpm list vite  # Should show ^7.0.0

# Test everything still works
pnpm nx run-many -t test,build,lint
```

### Phase 4: Test Backwards Compatibility

```bash
# Test that useViteV6 flag works
cd ~/tmp/claude/vite7-testing
npx create-nx-workspace@latest test-vite6-compat --pm=pnpm

cd test-vite6-compat

# Add Vite with v6 flag
pnpm nx g @nx/vite:init --useViteV6

# Verify Vite 6 is installed
pnpm list vite  # Should show ^6.0.0

# Create a Vite app
pnpm nx g @nx/react:app my-app --bundler=vite

# Test it works with Vite 6
pnpm nx run my-app:serve
pnpm nx run my-app:build
```

### Phase 5: Test Breaking Changes

#### Test 5.1: Sass Modern API
```bash
cd ~/tmp/claude/vite7-testing
npx create-nx-workspace@latest test-sass-vite7 \
  --preset=react-monorepo \
  --bundler=vite \
  --style=scss \
  --pm=pnpm

cd test-sass-vite7

# Create a component with Sass
cat > apps/test-sass-vite7/src/app/test.module.scss << 'EOF'
$primary-color: #333;

.container {
  color: $primary-color;
  
  &:hover {
    color: lighten($primary-color, 20%);
  }
}

@mixin button-style {
  padding: 10px;
  border-radius: 4px;
}

.button {
  @include button-style;
}
EOF

# Import and use in component
echo "import styles from './test.module.scss';" >> apps/test-sass-vite7/src/app/app.tsx

# Build and verify Sass compiles with modern API
pnpm nx run test-sass-vite7:build
```

#### Test 5.2: Browser Target Verification
```bash
# Check the browser target in build output
cd test-react-vite7
pnpm nx run test-react-vite7:build --verbose

# Inspect the built files for ES features
# Should target baseline-widely-available features
```

#### Test 5.3: Rolldown Integration (Optional)
```bash
cd ~/tmp/claude/vite7-testing/test-react-vite7

# Replace vite with rolldown-vite
pnpm remove vite
pnpm add -D rolldown-vite

# Test build with Rolldown
pnpm nx run test-react-vite7:build

# Compare build times
```

### Phase 6: Test Framework Integrations

```bash
# Test Angular + Vite 7
cd ~/tmp/claude/vite7-testing
npx create-nx-workspace@latest test-angular-vite7 \
  --preset=angular-monorepo \
  --bundler=vite \
  --pm=pnpm

cd test-angular-vite7
pnpm nx run test-angular-vite7:serve
pnpm nx run test-angular-vite7:build
pnpm nx run test-angular-vite7:test

# Test Remix + Vite 7
cd ~/tmp/claude/vite7-testing
npx create-nx-workspace@latest test-remix-vite7 \
  --preset=@nx/remix \
  --pm=pnpm

cd test-remix-vite7
pnpm nx run test-remix-vite7:serve
pnpm nx run test-remix-vite7:build
```

### Phase 7: Comprehensive Validation

Create a validation script to run all tests:

```bash
cat > ~/tmp/claude/vite7-testing/validate-vite7.sh << 'EOF'
#!/bin/bash
set -e

echo "=== Vite 7 Upgrade Validation ==="

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Track results
PASSED=0
FAILED=0
RESULTS=()

# Function to test a workspace
test_workspace() {
  local name=$1
  local preset=$2
  local extra_args=$3
  
  echo "Testing $name..."
  
  if npx create-nx-workspace@latest $name --preset=$preset $extra_args --pm=pnpm --ci; then
    cd $name
    
    # Check Vite version
    if pnpm list vite | grep -q "^7\."; then
      echo -e "${GREEN}✓ Vite 7 installed${NC}"
    else
      echo -e "${RED}✗ Vite 7 not found${NC}"
      RESULTS+=("$name: Vite version check failed")
      ((FAILED++))
      cd ..
      return
    fi
    
    # Run basic commands
    if pnpm nx run-many -t build,test,lint --parallel=3; then
      echo -e "${GREEN}✓ $name passed${NC}"
      RESULTS+=("$name: PASSED")
      ((PASSED++))
    else
      echo -e "${RED}✗ $name failed${NC}"
      RESULTS+=("$name: Build/Test failed")
      ((FAILED++))
    fi
    
    cd ..
  else
    echo -e "${RED}✗ Failed to create $name${NC}"
    RESULTS+=("$name: Creation failed")
    ((FAILED++))
  fi
}

# Run tests
cd ~/tmp/claude/vite7-testing

test_workspace "test-react-v7" "react-monorepo" "--bundler=vite"
test_workspace "test-vue-v7" "vue-monorepo" "--bundler=vite"
test_workspace "test-web-v7" "web-components" "--bundler=vite"

# Summary
echo ""
echo "=== Test Results ==="
for result in "${RESULTS[@]}"; do
  echo "$result"
done

echo ""
echo "Passed: $PASSED"
echo "Failed: $FAILED"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed${NC}"
  exit 1
fi
EOF

chmod +x ~/tmp/claude/vite7-testing/validate-vite7.sh
```

## Verification Checklist

- [ ] Node.js v20+ requirement is enforced
- [ ] Vite 7 is installed by default in new workspaces
- [ ] Existing Vite 6 workspaces can migrate to Vite 7
- [ ] `useViteV6` flag allows staying on Vite 6
- [ ] `useViteV5` flag allows staying on Vite 5
- [ ] React + Vite 7 works (serve, build, test)
- [ ] Vue + Vite 7 works (serve, build, test)
- [ ] Angular + Vite 7 works (serve, build, test)
- [ ] Web Components + Vite 7 works
- [ ] Remix + Vite 7 works
- [ ] Sass compilation works with modern API
- [ ] Browser target uses baseline-widely-available
- [ ] No usage of removed deprecated properties
- [ ] Vitest 3 works with Vite 7
- [ ] Build times are reasonable or improved
- [ ] HMR (Hot Module Replacement) works
- [ ] Source maps are generated correctly
- [ ] Production builds are optimized

## Known Issues to Watch For

1. **Sass Legacy API**: Projects using `node-sass` or legacy Sass features may break
2. **Plugin Compatibility**: Some Vite plugins may not be compatible with v7 yet
3. **Config Changes**: Some vite.config.ts options may have changed behavior
4. **Build Output**: Different browser target may affect polyfills

## Commands Summary

```bash
# Quick test of PR changes
cd ~/projects/nx-worktrees/master
gh pr checkout 32422
pnpm install
pnpm build
pnpm nx run-many -t test,build,lint -p @nx/vite

# Full validation
~/tmp/claude/vite7-testing/validate-vite7.sh

# Test specific framework
npx create-nx-workspace@latest test-framework --preset=[react-monorepo|vue-monorepo|angular-monorepo] --bundler=vite --pm=pnpm
```

## Notes

- **CRITICAL**: Keep track of implementation progress in this document
- Update TODO sections as you proceed with testing
- Document any issues found during testing
- Note workarounds for any problems encountered