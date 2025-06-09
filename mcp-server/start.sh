#!/bin/bash

# MCP AI Content Server Start Script

# Check if we're in the right directory
if [ ! -f "pyproject.toml" ] || [ ! -d "mcp_ai_content_server" ]; then
    echo "Error: Please run this script from the mcp-server directory"
    exit 1
fi

# Add the current directory to Python path so we can import the module
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Run the server directly using Python module execution
python -m mcp_ai_content_server.server