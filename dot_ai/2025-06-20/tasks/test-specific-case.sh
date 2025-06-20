#!/bin/bash

# Test the specific failing case from Issue #31572

echo "Testing create-nx-workspace with '.' directory and nest preset..."

TEST_DIR="/tmp/claude/repro-31572/test-dot"
rm -rf "$TEST_DIR"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

# Add timeout and capture output
echo "Running: npx create-nx-workspace@latest . --preset nest --appName socket-gateway"
echo "With options: --nxCloud skip --skip-git"
echo ""

timeout 60s npx create-nx-workspace@latest . --preset nest --appName socket-gateway --nxCloud skip --skip-git 2>&1 | tee create-workspace.log

EXIT_CODE=${PIPESTATUS[0]}

if [ $EXIT_CODE -eq 124 ]; then
    echo ""
    echo "❌ Command timed out after 60 seconds - this confirms the hanging issue"
    echo ""
    echo "Last output lines:"
    tail -20 create-workspace.log
elif [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo "❌ Command failed with exit code: $EXIT_CODE"
else
    echo ""
    echo "✅ Command completed successfully!"
fi

echo ""
echo "Log file saved to: $TEST_DIR/create-workspace.log"