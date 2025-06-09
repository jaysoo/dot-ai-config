#!/bin/bash

if [ ! -f "pyproject.toml" ] || [ ! -d "mcp_ai_content_server" ]; then
  FILE="${BASH_SOURCE[0]}"
  DIR=$(dirname "$FILE")
  echo "Running from: $DIR"
  cd $DIR
fi

export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Set default transport to HTTP
export TRANSPORT="${TRANSPORT:-streamable-http}"

# Set default port
export PORT="${PORT:-8888}"

echo "Starting MCP AI Content Server..."
echo "Transport: $TRANSPORT"
if [ "$TRANSPORT" = "streamable-http" ]; then
  echo "Port: $PORT"
  echo "Server will be available at: http://localhost:$PORT"
fi
echo ""

python -m mcp_ai_content_server.server
