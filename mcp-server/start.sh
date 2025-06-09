#!/bin/bash

if [ ! -f "pyproject.toml" ] || [ ! -d "mcp_ai_content_server" ]; then
  FILE="${BASH_SOURCE[0]}"
  DIR=$(dirname "$FILE")
  echo "Running from: $DIR"
  cd $DIR
fi

export PYTHONPATH="${PYTHONPATH}:$(pwd)"

pwd

python -m mcp_ai_content_server.server
