#!/bin/bash
set -e

# Get git repository root
GIT_ROOT=$HOME/projects/dot-ai-config

TARGET_DIR="$HOME/.claude"

mkdir -p "$TARGET_DIR"

cp "$GIT_ROOT/dot_claude/settings.json" "$TARGET_DIR/settings.json"
cp "$GIT_ROOT/dot_claude/CLAUDE.md" "$TARGET_DIR/CLAUDE.md"
rm -rf "$TARGET_DIR/commands"
cp -r "$GIT_ROOT/dot_claude/commands" "$TARGET_DIR"
cp -r "$GIT_ROOT/mcp-gemini" "$TARGET_DIR"

# Sync skills if the directory exists
if [ -d "$GIT_ROOT/dot_claude/skills" ]; then
    rm -rf "$TARGET_DIR/skills"
    cp -r "$GIT_ROOT/dot_claude/skills" "$TARGET_DIR"
fi

echo "✅ Claude global config synced from $GIT_ROOT"
