#!/bin/bash
set -e

# Get git repository root
GIT_ROOT=$HOME/projects/dot-ai-config

TARGET_DIR="$HOME/.claude"

mkdir -p "$TARGET_DIR"

cp "$GIT_ROOT/dot_claude/CLAUDE.md" "$TARGET_DIR/CLAUDE.md"
rm -rf "$TARGET_DIR/commands"
cp -r "$GIT_ROOT/dot_claude/commands" "$TARGET_DIR"
cp -r "$GIT_ROOT/mcp-gemini" "$TARGET_DIR"
echo "✅ Claude global config synced from $GIT_ROOT"
