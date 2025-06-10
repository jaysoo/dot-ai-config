#!/bin/bash
#
# MCP AI Content Server - macOS LaunchAgent Uninstaller
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVICE_NAME="ca.jaysoo.mcp-ai-content-server"
PLIST_NAME="${SERVICE_NAME}.plist"
AGENT_DIR="$HOME/Library/LaunchAgents"
PLIST_PATH="${AGENT_DIR}/${PLIST_NAME}"

echo "MCP AI Content Server - macOS LaunchAgent Uninstaller"
echo "===================================================="
echo ""

# Check if installed
if [ ! -f "$PLIST_PATH" ]; then
    echo -e "${YELLOW}LaunchAgent not found at: $PLIST_PATH${NC}"
    echo "Nothing to uninstall"
    exit 0
fi

echo "This will stop and remove the MCP server LaunchAgent."
read -p "Are you sure you want to uninstall? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Uninstall cancelled"
    exit 0
fi

# Unload the LaunchAgent
echo "Stopping and unloading LaunchAgent..."
if launchctl list | grep -q "$SERVICE_NAME"; then
    launchctl unload "$PLIST_PATH" 2>/dev/null || {
        echo -e "${YELLOW}Warning: Failed to unload service (it may not be running)${NC}"
    }
fi

# Remove the plist file
echo "Removing LaunchAgent plist..."
rm -f "$PLIST_PATH"

# Optional: Ask about logs
echo ""
read -p "Do you want to remove log files? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f ~/Library/Logs/mcp-ai-content-server.log
    rm -f ~/Library/Logs/mcp-ai-content-server.error.log
    echo "Log files removed"
fi

echo ""
echo -e "${GREEN}✓ MCP server LaunchAgent has been uninstalled${NC}"
echo ""
echo "The MCP server files are still available at their original location."
echo "To reinstall, run: setup/macos/install.sh"