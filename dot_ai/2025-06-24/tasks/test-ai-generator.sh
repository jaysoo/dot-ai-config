#!/bin/bash

# Test script for AI generator functionality

echo "Testing LLM-First Nx Generators - Phase 1"
echo "========================================"

# Create test workspace
TEST_DIR="/tmp/nx-ai-test-$(date +%s)"
mkdir -p $TEST_DIR
cd $TEST_DIR

echo "Creating test workspace at $TEST_DIR"
npx -y create-nx-workspace@22.0.0-beta.1 test-workspace --preset=apps --pm=npm --no-interactive

cd test-workspace

echo ""
echo "Testing 1: React app generation with AI"
echo "---------------------------------------"
npx nx g @nx/react:application test-app --ai=claude --dry-run

echo ""
echo "Testing 2: TypeScript config generation with AI"
echo "-----------------------------------------------"
npx nx g @nx/js:init --ai=claude --dry-run

echo ""
echo "Testing 3: Help output"
echo "----------------------"
npx nx g @nx/react:application --help | grep -A 2 "ai"

echo ""
echo "Done! Test workspace at: $TEST_DIR"