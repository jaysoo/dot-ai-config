# Vite 7 Manual Verification Checklist

## Quick Verification Commands

### 1. ✅ Verify PR Changes Are Correct
```bash
# Currently on commit a3285becbc (feat(vite): support vite 7)

# Verify key files have Vite 7
grep "viteVersion = " packages/vite/src/utils/versions.ts
# Expected: export const viteVersion = '^7.0.0';
# ✅ CONFIRMED: Shows '^7.0.0'

# Check backwards compatibility versions
grep "viteV6Version\|viteV5Version" packages/vite/src/utils/versions.ts  
# ✅ CONFIRMED: Both viteV6Version and viteV5Version exist

# Check migration entry
grep -A5 "21.5.0" packages/vite/migrations.json
# ✅ CONFIRMED: Migration to ^7.1.3 exists
```

### 2. 🔧 Build and Test Commands
```bash
# Build the vite package
pnpm nx run vite:build

# Run unit tests
pnpm nx run vite:test

# Run specific test files
pnpm nx run vite:test -- init.spec.ts
pnpm nx run vite:test -- vitest-generator.spec.ts
```

### 3. 🧪 Test New Workspace Creation
```bash
# Create temporary test directory
mkdir -p /tmp/vite7-manual-test
cd /tmp/vite7-manual-test

# Test 1: React + Vite 7 (default)
npx create-nx-workspace@latest react-vite7 \
  --preset=react-monorepo \
  --bundler=vite \
  --style=css \
  --e2eTestRunner=none \
  --pm=pnpm \
  --ci

cd react-vite7
pnpm list vite  # Should show 7.x.x
pnpm nx serve react-vite7  # Test dev server
pnpm nx build react-vite7  # Test build

# Test 2: Vue + Vite 7
cd /tmp/vite7-manual-test
npx create-nx-workspace@latest vue-vite7 \
  --preset=vue-monorepo \
  --e2eTestRunner=none \
  --pm=pnpm \
  --ci

cd vue-vite7
pnpm list vite  # Should show 7.x.x
```

### 4. 🔄 Test Backwards Compatibility Flags
```bash
cd /tmp/vite7-manual-test

# Test Vite 6 flag
npx create-nx-workspace@latest test-vite6 --pm=pnpm --ci
cd test-vite6
pnpm nx g @nx/vite:init --useViteV6
pnpm list vite  # Should show 6.x.x

# Test Vite 5 flag  
cd /tmp/vite7-manual-test
npx create-nx-workspace@latest test-vite5 --pm=pnpm --ci
cd test-vite5
pnpm nx g @nx/vite:init --useViteV5
pnpm list vite  # Should show 5.x.x
```

### 5. 📦 Test Migration Path
```bash
cd /tmp/vite7-manual-test

# Create Vite 6 workspace with older Nx
npx create-nx-workspace@21.4.0 migrate-test \
  --preset=react-monorepo \
  --bundler=vite \
  --style=css \
  --e2eTestRunner=none \
  --pm=pnpm \
  --ci

cd migrate-test
pnpm list vite  # Should show 6.x.x

# Save app state for comparison
pnpm nx build migrate-test
cp -r dist/apps/migrate-test ../migrate-test-v6-build

# Run migration to latest (using local Nx)
pnpm nx migrate /Users/jack/projects/nx-worktrees/master
pnpm install
pnpm nx migrate --run-migrations

# Verify migration
pnpm list vite  # Should show 7.x.x
pnpm nx build migrate-test
pnpm nx serve migrate-test  # Test it still works

# Compare builds
diff -r ../migrate-test-v6-build dist/apps/migrate-test
```

### 6. 🎯 Specific Feature Tests

#### Test Sass with Vite 7 (Modern API)
```bash
cd /tmp/vite7-manual-test
npx create-nx-workspace@latest sass-test \
  --preset=react-monorepo \
  --bundler=vite \
  --style=scss \
  --pm=pnpm \
  --ci

cd sass-test
pnpm nx build sass-test  # Should compile Sass successfully
```

#### Test with Different Node Versions
```bash
# Check Node version
node --version  # Must be v20+ for Vite 7

# If you have nvm/fnm:
nvm use 20  # or fnm use 20
# Run tests

# Try with Node 18 (should fail or warn)
nvm use 18
npx create-nx-workspace@latest node18-test --preset=react-monorepo --bundler=vite
# Should warn about Node version requirement
```

### 7. 🔍 E2E Tests
```bash
# Back in Nx repo
cd /Users/jack/projects/nx-worktrees/master

# Run Vite-specific e2e tests
pnpm nx run e2e-vite:e2e --testFile="vite.test.ts"
```

## Manual Inspection Checklist

### Code Review
- [ ] Check `packages/vite/src/utils/versions.ts` - viteVersion should be '^7.0.0'
- [ ] Check `packages/vite/src/generators/init/lib/utils.ts` - version selection logic
- [ ] Check `packages/vite/src/generators/vitest/vitest-generator.ts` - version detection
- [ ] Check `packages/vite/migrations.json` - 21.5.0 migration entry
- [ ] Check `packages/vite/package.json` - peer dependencies include Vite 7

### Test Snapshots
- [ ] `packages/vite/src/generators/init/__snapshots__/init.spec.ts.snap` - shows Vite ^7.0.0
- [ ] `packages/vue/src/generators/library/__snapshots__/library.spec.ts.snap` - shows Vite ^7.0.0

### Documentation
- [ ] Check if README needs updates for Vite 7 support
- [ ] Check if migration guide needs to be created

## Expected Results

### ✅ Success Criteria
1. New workspaces get Vite 7 by default
2. `--useViteV6` flag installs Vite 6
3. `--useViteV5` flag installs Vite 5  
4. Migration from Vite 6 → 7 works smoothly
5. All framework integrations work (React, Vue, Angular)
6. Sass compilation works with modern API
7. Node.js 20+ is required/recommended
8. Build outputs are valid
9. Dev server (HMR) works correctly
10. Tests pass

### ⚠️ Known Issues/Limitations
1. Node.js 18 is EOL - Vite 7 requires Node 20+
2. Legacy Sass API removed - projects using old syntax need updates
3. Some Vite plugins may not support v7 yet
4. Browser target changed to 'baseline-widely-available'

## Summary Commands
```bash
# From Nx repo on PR commit
cd /Users/jack/projects/nx-worktrees/master

# Quick smoke test
pnpm nx run vite:test -- --testNamePattern="init"

# Full validation in temp directory
cd /tmp && rm -rf vite7-test
npx create-nx-workspace@latest vite7-test \
  --preset=react-monorepo --bundler=vite --pm=pnpm --ci
cd vite7-test && pnpm list vite
```

## Notes
- Currently on commit: a3285becbc (feat(vite): support vite 7)
- All file changes look correct for Vite 7 support
- Main changes: Default to v7, add v6 compat, maintain v5 compat
- Migration path implemented for 21.5.0