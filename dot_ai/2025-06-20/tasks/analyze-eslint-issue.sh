#!/bin/bash

echo "Analyzing ESLint Plugin Performance Issue #27849"
echo "================================================"
echo ""

cd /Users/jack/projects/nx

# Test 1: Graph generation with cache
echo "Test 1: Graph generation WITH cache"
echo "-----------------------------------"
time nx graph --file=/tmp/graph-with-cache.json

echo ""
echo "Test 2: Graph generation WITHOUT cache"
echo "--------------------------------------"
export NX_DAEMON=false
export NX_PROJECT_GRAPH_CACHE=false
nx reset
time nx graph --file=/tmp/graph-without-cache.json

echo ""
echo "Test 3: Lint a single project with timing"
echo "-----------------------------------------"
echo "Running with verbose output to see timing..."
NX_VERBOSE_LOGGING=true nx lint angular --skip-nx-cache 2>&1 | grep -E "(ESLint Plugin|Creating Nodes|Performance)" | head -20

echo ""
echo "Analysis complete. Check if ESLint plugin logs appear above."