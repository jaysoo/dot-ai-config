#!/bin/bash

# Vite 7 Migration Testing Script
# Tests migration from Vite 6 to Vite 7 in existing Nx workspaces

set -e

echo "================================================"
echo "📦 Vite 6 to 7 Migration Test"
echo "================================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create test directory
TEST_DIR="/tmp/vite-migration-test-$(date +%s)"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo -e "\n${BLUE}📂 Test directory: $TEST_DIR${NC}"

# Step 1: Create workspace with older Nx version (Vite 6)
echo -e "\n${BLUE}1️⃣ Creating workspace with Nx 21.4.0 (Vite 6)...${NC}"

npx --yes create-nx-workspace@21.4.0 migration-test \
  --preset=react-monorepo \
  --bundler=vite \
  --style=css \
  --e2eTestRunner=none \
  --pm=pnpm \
  --ci \
  --nxCloud=skip

cd migration-test

# Verify Vite 6 is installed
echo -e "\n${BLUE}2️⃣ Verifying initial Vite version...${NC}"

INITIAL_VITE=$(pnpm list vite --depth=0 --json | jq -r '.[] | .devDependencies.vite.version // .dependencies.vite.version')
echo "  Initial Vite version: $INITIAL_VITE"

if [[ "$INITIAL_VITE" == 6.* ]]; then
  echo -e "  ${GREEN}✅ Vite 6 confirmed${NC}"
else
  echo -e "  ${YELLOW}⚠️  Expected Vite 6, got: $INITIAL_VITE${NC}"
fi

# Step 2: Test that the app works with Vite 6
echo -e "\n${BLUE}3️⃣ Testing app with Vite 6...${NC}"

echo "  Building with Vite 6..."
if pnpm nx run migration-test:build; then
  echo -e "  ${GREEN}✅ Build successful with Vite 6${NC}"
else
  echo -e "  ${RED}❌ Build failed with Vite 6${NC}"
  exit 1
fi

# Step 3: Run migration to latest
echo -e "\n${BLUE}4️⃣ Running Nx migration to latest...${NC}"

echo "  Generating migrations..."
pnpm nx migrate latest --from=@nx/workspace@21.4.0

# Check if migrations.json was created
if [ -f migrations.json ]; then
  echo -e "  ${GREEN}✅ migrations.json created${NC}"
  echo "  Migration contents:"
  cat migrations.json | jq '.'
else
  echo -e "  ${RED}❌ migrations.json not created${NC}"
  exit 1
fi

# Step 4: Install new dependencies
echo -e "\n${BLUE}5️⃣ Installing new dependencies...${NC}"
pnpm install

# Step 5: Run migrations
echo -e "\n${BLUE}6️⃣ Running migrations...${NC}"
pnpm nx migrate --run-migrations

# Step 6: Verify Vite 7 is installed
echo -e "\n${BLUE}7️⃣ Verifying Vite 7 installation after migration...${NC}"

MIGRATED_VITE=$(pnpm list vite --depth=0 --json | jq -r '.[] | .devDependencies.vite.version // .dependencies.vite.version')
echo "  Migrated Vite version: $MIGRATED_VITE"

if [[ "$MIGRATED_VITE" == 7.* ]]; then
  echo -e "  ${GREEN}✅ Successfully migrated to Vite 7${NC}"
else
  echo -e "  ${RED}❌ Migration failed - Vite 7 not installed (found: $MIGRATED_VITE)${NC}"
  exit 1
fi

# Step 7: Test that the app still works with Vite 7
echo -e "\n${BLUE}8️⃣ Testing app with Vite 7...${NC}"

echo "  Building with Vite 7..."
if pnpm nx run migration-test:build; then
  echo -e "  ${GREEN}✅ Build successful with Vite 7${NC}"
else
  echo -e "  ${RED}❌ Build failed with Vite 7${NC}"
  exit 1
fi

echo "  Running tests..."
if pnpm nx run migration-test:test --passWithNoTests; then
  echo -e "  ${GREEN}✅ Tests pass with Vite 7${NC}"
else
  echo -e "  ${YELLOW}⚠️  Tests failed (may need adjustments)${NC}"
fi

# Step 8: Check for breaking changes
echo -e "\n${BLUE}9️⃣ Checking for potential breaking changes...${NC}"

# Check Node version requirement
NODE_VERSION=$(node --version)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1 | sed 's/v//')

if [ "$NODE_MAJOR" -ge 20 ]; then
  echo -e "  ${GREEN}✅ Node.js $NODE_VERSION meets Vite 7 requirements${NC}"
else
  echo -e "  ${YELLOW}⚠️  Node.js $NODE_VERSION - Vite 7 requires Node.js 20+${NC}"
fi

# Check for Sass usage
if grep -q "sass\|scss" package.json; then
  echo -e "  ${YELLOW}⚠️  Sass detected - ensure modern API is used${NC}"
else
  echo -e "  ${GREEN}✅ No Sass detected${NC}"
fi

# Check vite.config files for deprecated options
VITE_CONFIGS=$(find . -name "vite.config.*" -type f)
if [ -n "$VITE_CONFIGS" ]; then
  echo "  Checking vite.config files for deprecated options..."
  for config in $VITE_CONFIGS; do
    if grep -q "legacy\." "$config"; then
      echo -e "  ${YELLOW}⚠️  Legacy options found in $config${NC}"
    else
      echo -e "  ${GREEN}✅ No legacy options in $config${NC}"
    fi
  done
fi

# Summary
echo -e "\n================================================"
echo -e "${GREEN}✨ Migration Test Complete!${NC}"
echo -e "================================================"
echo ""
echo "Migration Summary:"
echo "  • Initial version: Vite $INITIAL_VITE"
echo "  • Final version: Vite $MIGRATED_VITE"
echo "  • Workspace location: $TEST_DIR/migration-test"
echo ""
echo "Manual verification steps:"
echo "1. cd $TEST_DIR/migration-test"
echo "2. pnpm nx serve migration-test  # Test dev server"
echo "3. Check browser console for errors"
echo "4. Verify HMR (Hot Module Replacement) works"
echo "5. Test production build: pnpm nx preview migration-test"
echo ""

if [[ "$MIGRATED_VITE" == 7.* ]]; then
  echo -e "${GREEN}✅ Migration successful!${NC}"
  exit 0
else
  echo -e "${RED}❌ Migration failed${NC}"
  exit 1
fi