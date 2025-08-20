#!/bin/bash

# Quick Vite 7 Testing Script for PR #32422
# This script performs quick validation of the Vite 7 upgrade changes

set -e

echo "================================================"
echo "🚀 Quick Vite 7 Upgrade Test (PR #32422)"
echo "================================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get current directory
REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

echo -e "\n${BLUE}📍 Repository root: $REPO_ROOT${NC}"

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}🌿 Current branch: $CURRENT_BRANCH${NC}"

if [ "$CURRENT_BRANCH" != "vite-seven-support" ]; then
  echo -e "${YELLOW}⚠️  Not on PR branch. Checking out vite-seven-support...${NC}"
  gh pr checkout 32422
fi

# Step 1: Verify changed files
echo -e "\n${BLUE}1️⃣ Verifying PR changes...${NC}"

echo "  Checking packages/vite/src/utils/versions.ts..."
if grep -q "viteVersion = '\^7\.0\.0'" packages/vite/src/utils/versions.ts; then
  echo -e "  ${GREEN}✅ Vite 7 version found${NC}"
else
  echo -e "  ${RED}❌ Vite 7 version not found${NC}"
  exit 1
fi

echo "  Checking for viteV6Version..."
if grep -q "viteV6Version = '\^6\.0\.0'" packages/vite/src/utils/versions.ts; then
  echo -e "  ${GREEN}✅ Vite 6 compatibility version found${NC}"
else
  echo -e "  ${RED}❌ Vite 6 compatibility version not found${NC}"
fi

echo "  Checking migration file..."
if grep -q '"21.5.0"' packages/vite/migrations.json; then
  echo -e "  ${GREEN}✅ Migration for 21.5.0 found${NC}"
else
  echo -e "  ${RED}❌ Migration for 21.5.0 not found${NC}"
fi

# Step 2: Build Nx packages
echo -e "\n${BLUE}2️⃣ Building Nx packages...${NC}"
echo "  Installing dependencies..."
pnpm install --frozen-lockfile

echo "  Building @nx/vite package..."
pnpm nx run @nx/vite:build

# Step 3: Test @nx/vite package
echo -e "\n${BLUE}3️⃣ Testing @nx/vite package...${NC}"
pnpm nx run @nx/vite:test --skip-nx-cache

# Step 4: Create test workspace
echo -e "\n${BLUE}4️⃣ Creating test workspace with Vite 7...${NC}"

TEST_DIR="/tmp/vite7-quick-test-$(date +%s)"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo "  Test directory: $TEST_DIR"

# Use local Nx to create workspace
echo "  Creating React + Vite workspace..."
npx --yes create-nx-workspace@latest test-vite7 \
  --preset=react-monorepo \
  --bundler=vite \
  --style=css \
  --e2eTestRunner=none \
  --pm=pnpm \
  --ci \
  --nxCloud=skip

cd test-vite7

# Step 5: Verify Vite 7 installation
echo -e "\n${BLUE}5️⃣ Verifying Vite 7 installation...${NC}"

VITE_VERSION=$(pnpm list vite --depth=0 --json | jq -r '.[] | .devDependencies.vite.version // .dependencies.vite.version // "not found"')
echo "  Installed Vite version: $VITE_VERSION"

if [[ "$VITE_VERSION" == 7.* ]]; then
  echo -e "  ${GREEN}✅ Vite 7 is installed${NC}"
else
  echo -e "  ${RED}❌ Vite 7 not installed (found: $VITE_VERSION)${NC}"
  exit 1
fi

# Step 6: Test basic commands
echo -e "\n${BLUE}6️⃣ Testing workspace commands...${NC}"

echo "  Running build..."
if pnpm nx run test-vite7:build; then
  echo -e "  ${GREEN}✅ Build successful${NC}"
else
  echo -e "  ${RED}❌ Build failed${NC}"
  exit 1
fi

echo "  Running lint..."
if pnpm nx run test-vite7:lint; then
  echo -e "  ${GREEN}✅ Lint successful${NC}"
else
  echo -e "  ${RED}❌ Lint failed${NC}"
fi

# Step 7: Test backwards compatibility
echo -e "\n${BLUE}7️⃣ Testing backwards compatibility...${NC}"

cd "$TEST_DIR"
npx --yes create-nx-workspace@latest test-vite6 --pm=pnpm --ci --nxCloud=skip
cd test-vite6

echo "  Adding Vite with v6 flag..."
pnpm nx g @nx/vite:init --useViteV6

VITE6_VERSION=$(pnpm list vite --depth=0 --json 2>/dev/null | jq -r '.[] | .devDependencies.vite.version // .dependencies.vite.version // "not found"')
echo "  Installed Vite version: $VITE6_VERSION"

if [[ "$VITE6_VERSION" == 6.* ]]; then
  echo -e "  ${GREEN}✅ Vite 6 compatibility works${NC}"
else
  echo -e "  ${YELLOW}⚠️  Vite 6 flag may not be working (found: $VITE6_VERSION)${NC}"
fi

# Summary
echo -e "\n================================================"
echo -e "${GREEN}✨ Quick Vite 7 Test Complete!${NC}"
echo -e "================================================"
echo ""
echo "Test workspace created at: $TEST_DIR/test-vite7"
echo ""
echo "Next steps to test thoroughly:"
echo "1. cd $TEST_DIR/test-vite7"
echo "2. pnpm nx serve test-vite7  # Test dev server"
echo "3. pnpm nx test test-vite7   # Run tests"
echo ""
echo "To test migration from Vite 6:"
echo "1. Create a workspace with Nx 21.4.0 (has Vite 6)"
echo "2. Run: pnpm nx migrate latest"
echo "3. Run: pnpm nx migrate --run-migrations"
echo "4. Verify Vite 7 is installed"
echo ""
echo -e "${BLUE}Full testing plan available at:${NC}"
echo "$REPO_ROOT/.ai/2025-08-20/tasks/vite7-upgrade-testing-plan.md"