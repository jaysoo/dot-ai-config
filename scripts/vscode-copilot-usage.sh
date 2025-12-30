#!/bin/bash
# VSCode / GitHub Copilot Usage Statistics
# Usage: ./vscode-copilot-usage.sh [--json]
#
# Options:
#   --json    Output raw JSON instead of formatted text
#   --help    Show this help message
#
# Note: VSCode/Copilot stores very limited usage data locally.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [[ -f "$SCRIPT_DIR/vscode-copilot-usage.mjs" ]]; then
    exec node "$SCRIPT_DIR/vscode-copilot-usage.mjs" "$@"
fi

echo "Error: vscode-copilot-usage.mjs not found in $SCRIPT_DIR"
exit 1
