#!/bin/bash

# Test what create-nx-workspace creates that makes it think directory is not empty

echo "Testing directory creation issue..."

TEST_DIR="/tmp/claude/repro-31572/test-dir-$(date +%s)"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo "Initial directory state:"
ls -la
echo ""

# First, let's see what npx does
echo "Running npx to download create-nx-workspace..."
npx --yes create-nx-workspace@latest --version 2>&1 || true

echo ""
echo "Directory after npx download:"
ls -la
echo ""

# Now let's try with a custom workspace name instead of "."
TEST_DIR2="/tmp/claude/repro-31572/test-custom-$(date +%s)"
mkdir -p "$TEST_DIR2"
cd "$TEST_DIR2"

echo "Testing with custom workspace name instead of '.'"
echo "Running: npx create-nx-workspace@latest my-workspace --preset nest --appName socket-gateway --docker false --unitTestRunner jest --interactive false --nxCloud skip --skip-git"
echo ""

timeout 120s npx create-nx-workspace@latest my-workspace \
  --preset nest \
  --appName socket-gateway \
  --docker false \
  --unitTestRunner jest \
  --interactive false \
  --nxCloud skip \
  --skip-git \
  2>&1 | tee create-workspace-custom.log

EXIT_CODE=${PIPESTATUS[0]}

if [ $EXIT_CODE -eq 124 ]; then
    echo ""
    echo "❌ Command timed out - HANGING CONFIRMED"
    echo "Last output:"
    tail -20 create-workspace-custom.log
elif [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo "❌ Command failed with exit code: $EXIT_CODE"
else
    echo ""
    echo "✅ Success with custom workspace name!"
    echo "Created:"
    ls -la
fi