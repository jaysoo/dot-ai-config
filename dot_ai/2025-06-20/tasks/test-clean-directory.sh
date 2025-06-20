#!/bin/bash

# Test create-nx-workspace with a truly clean directory

echo "Testing create-nx-workspace with clean '.' directory..."

TEST_DIR="/tmp/claude/repro-31572/test-clean-$(date +%s)"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo "Current directory: $(pwd)"
echo "Directory contents before:"
ls -la
echo ""

echo "Running: npx create-nx-workspace@latest . --preset nest --appName socket-gateway --docker false --unitTestRunner jest --interactive false --nxCloud skip --skip-git"
echo ""

timeout 120s npx create-nx-workspace@latest . \
  --preset nest \
  --appName socket-gateway \
  --docker false \
  --unitTestRunner jest \
  --interactive false \
  --nxCloud skip \
  --skip-git \
  2>&1 | tee create-workspace.log

EXIT_CODE=${PIPESTATUS[0]}

if [ $EXIT_CODE -eq 124 ]; then
    echo ""
    echo "❌ Command timed out after 120 seconds - HANGING BUG CONFIRMED"
    echo ""
    echo "Last 50 lines of output:"
    tail -50 create-workspace.log
elif [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo "❌ Command failed with exit code: $EXIT_CODE"
    echo "Error output:"
    grep -E "(Error|NX|Failed)" create-workspace.log
else
    echo ""
    echo "✅ Command completed successfully!"
    echo ""
    echo "Created workspace structure:"
    ls -la
fi

echo ""
echo "Full log saved to: $TEST_DIR/create-workspace.log"