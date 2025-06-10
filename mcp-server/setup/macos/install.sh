#!/bin/bash
#
# MCP AI Content Server - macOS LaunchAgent Installer
#
# This script installs the MCP AI Content Server as a LaunchAgent
# that automatically starts when you log in to your Mac.
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

# Get the absolute path to the mcp-server directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MCP_SERVER_PATH="$( cd "${SCRIPT_DIR}/../.." && pwd )"

echo "MCP AI Content Server - macOS LaunchAgent Installer"
echo "=================================================="
echo ""
echo "This will install the MCP server to start automatically at login."
echo "Installation path: ${MCP_SERVER_PATH}"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: python3 not found in PATH${NC}"
    echo "Please install Python 3 or ensure it's in your PATH"
    exit 1
fi

PYTHON_PATH=$(dirname $(which python3))
echo "Python found at: ${PYTHON_PATH}"

# Check if the MCP server is installed
if [ ! -f "${MCP_SERVER_PATH}/pyproject.toml" ]; then
    echo -e "${RED}Error: MCP server not found at ${MCP_SERVER_PATH}${NC}"
    echo "Please run this script from the setup/macos directory"
    exit 1
fi

# Check if already installed
if [ -f "$PLIST_PATH" ]; then
    echo -e "${YELLOW}LaunchAgent already exists at: $PLIST_PATH${NC}"
    read -p "Do you want to reinstall? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Installation cancelled"
        exit 0
    fi
    
    # Unload existing agent
    echo "Unloading existing LaunchAgent..."
    launchctl unload "$PLIST_PATH" 2>/dev/null || true
fi

# Create LaunchAgents directory if it doesn't exist
mkdir -p "$AGENT_DIR"

# Copy and process the plist template
echo "Creating LaunchAgent plist..."
sed -e "s|__MCP_SERVER_PATH__|${MCP_SERVER_PATH}|g" \
    -e "s|__HOME__|${HOME}|g" \
    -e "s|__PYTHON_PATH__|${PYTHON_PATH}|g" \
    "${SCRIPT_DIR}/${PLIST_NAME}" > "$PLIST_PATH"

# Set correct permissions
chmod 644 "$PLIST_PATH"

# Load the LaunchAgent
echo "Loading LaunchAgent..."
launchctl load "$PLIST_PATH"

# Wait a moment for the service to start
sleep 2

# Check status
if launchctl list | grep -q "$SERVICE_NAME"; then
    PID=$(launchctl list | grep "$SERVICE_NAME" | awk '{print $1}')
    if [ "$PID" != "-" ]; then
        echo -e "${GREEN}✓ MCP server is running (PID: $PID)${NC}"
        echo ""
        echo "The server is now installed and running on port 8888"
        echo "It will automatically start when you log in."
        echo ""
        echo "To check logs:"
        echo "  tail -f ~/Library/Logs/mcp-ai-content-server.log"
        echo ""
        echo "To manage the service:"
        echo "  Stop:    launchctl unload ~/Library/LaunchAgents/${PLIST_NAME}"
        echo "  Start:   launchctl load ~/Library/LaunchAgents/${PLIST_NAME}"
        echo "  Status:  launchctl list | grep ${SERVICE_NAME}"
    else
        echo -e "${RED}✗ Service loaded but not running${NC}"
        echo "Check error logs at: ~/Library/Logs/mcp-ai-content-server.error.log"
        exit 1
    fi
else
    echo -e "${RED}✗ Failed to load LaunchAgent${NC}"
    exit 1
fi