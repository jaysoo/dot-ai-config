#!/bin/bash
set -e

# Get git repository root
GIT_ROOT=$HOME/projects/dot-ai-config

TARGET_DIR="$HOME/.claude"

mkdir -p "$TARGET_DIR"

cp "$GIT_ROOT/dot_claude/settings.json" "$TARGET_DIR/settings.json"
cp "$GIT_ROOT/dot_claude/CLAUDE.md" "$TARGET_DIR/CLAUDE.md"
mkdir -p "$TARGET_DIR/commands"
cp -r "$GIT_ROOT/dot_claude/commands/"* "$TARGET_DIR/commands/"

# Sync skills if the directory exists
if [ -d "$GIT_ROOT/dot_claude/skills" ]; then
    mkdir -p "$TARGET_DIR/skills"
    cp -r "$GIT_ROOT/dot_claude/skills/"* "$TARGET_DIR/skills/"
fi

# Sync tmux config
cp "$GIT_ROOT/tmux.conf" "$HOME/.tmux.conf"

# Sync kitty config
mkdir -p "$HOME/.config/kitty"
cp "$GIT_ROOT/kitty/"* "$HOME/.config/kitty/"

# Sync fish config (excludes fish_variables and nxcloud.fish — sensitive)
mkdir -p "$HOME/.config/fish/conf.d" "$HOME/.config/fish/functions"
cp "$GIT_ROOT/fish/config.fish" "$HOME/.config/fish/config.fish"
cp "$GIT_ROOT/fish/conf.d/"* "$HOME/.config/fish/conf.d/"
cp "$GIT_ROOT/fish/functions/"* "$HOME/.config/fish/functions/"

# Sync nvim config
mkdir -p "$HOME/.config/nvim"
cp "$GIT_ROOT/nvim/"* "$HOME/.config/nvim/"

# Sync mise config
mkdir -p "$HOME/.config/mise"
cp "$GIT_ROOT/mise.toml" "$HOME/.config/mise/config.toml"

# Sync gh-dash config
mkdir -p "$HOME/.config/gh-dash"
cp "$GIT_ROOT/gh-dash/config.yml" "$HOME/.config/gh-dash/config.yml"

# Sync bash config
cp "$GIT_ROOT/bashrc" "$HOME/.bashrc"

# Sync git config
cp "$GIT_ROOT/gitconfig" "$HOME/.gitconfig"
cp "$GIT_ROOT/gitignore_global" "$HOME/.gitignore_global"

echo "✅ Claude global config synced from $GIT_ROOT"
