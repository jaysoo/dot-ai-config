#!/bin/bash

# Test create-nx-workspace in non-interactive mode with all options specified

echo "Testing create-nx-workspace with all options specified (non-interactive)..."

TEST_DIR="/tmp/claude/repro-31572/test-non-interactive"
rm -rf "$TEST_DIR"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo "Running with all options:"
echo "npx create-nx-workspace@latest . --preset nest --appName socket-gateway --docker false --unitTestRunner jest --interactive false --nxCloud skip --skip-git"
echo ""

timeout 60s npx create-nx-workspace@latest . \
  --preset nest \
  --appName socket-gateway \
  --docker false \
  --unitTestRunner jest \
  --interactive false \
  --nxCloud skip \
  --skip-git \
  2>&1 | tee create-workspace-non-interactive.log

EXIT_CODE=${PIPESTATUS[0]}

if [ $EXIT_CODE -eq 124 ]; then
    echo ""
    echo "❌ Command timed out after 60 seconds"
elif [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo "❌ Command failed with exit code: $EXIT_CODE"
else
    echo ""
    echo "✅ Command completed successfully!"
    echo ""
    echo "Created workspace structure:"
    ls -la
fi