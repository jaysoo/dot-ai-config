#!/bin/bash
# Cursor AI Usage Statistics
# Usage: ./cursor-usage.sh [--json] [--days N]
#
# Options:
#   --json    Output raw JSON instead of formatted text
#   --days N  Show only last N days (default: all)
#   --help    Show this help message
#
# Note: Cursor does NOT store token usage locally - only server-side.
# This script tracks AI code generation activity only.

set -e

# Use the Node.js version if available in same directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [[ -f "$SCRIPT_DIR/cursor-usage.mjs" ]]; then
    exec node "$SCRIPT_DIR/cursor-usage.mjs" "$@"
fi

echo "Error: cursor-usage.mjs not found in $SCRIPT_DIR"
echo "Please ensure cursor-usage.mjs is in the same directory as this script."
exit 1
