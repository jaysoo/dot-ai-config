#!/bin/bash
# Test script for Node.js version check functionality

set -e

echo "=== Node.js Version Check Test Script ==="
echo

# Test 1: Check current Node.js version
echo "Test 1: Current Node.js version"
node_version=$(node -v 2>/dev/null || echo "Node.js not found")
echo "Current version: $node_version"
echo

# Test 2: Test the check-node-version.mjs script
echo "Test 2: Testing check-node-version.mjs"
if [ -f ".ai/2025-06-05/check-node-version.mjs" ]; then
    node .ai/2025-06-05/check-node-version.mjs
else
    echo "Script not found"
fi
echo

# Test 3: Test the wrapper script
echo "Test 3: Testing nx-wrapper-example.sh"
if [ -f ".ai/2025-06-05/nx-wrapper-example.sh" ]; then
    # Make it executable
    chmod +x .ai/2025-06-05/nx-wrapper-example.sh
    # Run just the version check part (comment out the exec line for testing)
    sed 's/^NODE_PATH=.*exec.*$/# &/' .ai/2025-06-05/nx-wrapper-example.sh | bash
else
    echo "Wrapper script not found"
fi
echo

# Test 4: Simulate different Node.js versions
echo "Test 4: Simulating version check for different Node.js versions"
for version in 16 18 20 22; do
    echo -n "Node.js v$version: "
    if [ "$version" -lt 20 ]; then
        echo "Should show warning"
    else
        echo "Should pass without warning"
    fi
done
echo

# Test 5: Check debian/control changes
echo "Test 5: Current debian/control Node.js dependency"
if [ -f "debian/control" ]; then
    grep -n "nodejs" debian/control || echo "No nodejs dependency found"
else
    echo "debian/control not found"
fi
echo

echo "=== Test Complete ==="
echo
echo "Next steps:"
echo "1. Review the test results above"
echo "2. Implement the changes according to the plan"
echo "3. Build and test the Debian package with various Node.js versions"