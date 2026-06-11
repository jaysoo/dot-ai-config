#!/bin/bash
set -e

# Get git repository root
GIT_ROOT=$HOME/projects/dot-ai-config

CLAUDE_TARGET_DIR="$HOME/.claude"
CODEX_TARGET_DIR="$HOME/.Codex"

mkdir -p "$CLAUDE_TARGET_DIR" "$CODEX_TARGET_DIR"

cp "$GIT_ROOT/dot_claude/settings.json" "$CLAUDE_TARGET_DIR/settings.json"
cp "$GIT_ROOT/dot_claude/CLAUDE.md" "$CLAUDE_TARGET_DIR/CLAUDE.md"
mkdir -p "$CLAUDE_TARGET_DIR/commands"
cp -r "$GIT_ROOT/dot_claude/commands/"* "$CLAUDE_TARGET_DIR/commands/"

cp "$GIT_ROOT/dot_claude/settings.json" "$CODEX_TARGET_DIR/settings.json"
cp "$GIT_ROOT/dot_claude/AGENTS.md" "$CODEX_TARGET_DIR/AGENTS.md"
cp "$GIT_ROOT/dot_claude/CODEX.md" "$CODEX_TARGET_DIR/CODEX.md"
mkdir -p "$CODEX_TARGET_DIR/commands"
cp -r "$GIT_ROOT/dot_claude/commands/"* "$CODEX_TARGET_DIR/commands/"

# Sync skills if the directory exists
if [ -d "$GIT_ROOT/dot_claude/skills" ]; then
    mkdir -p "$CLAUDE_TARGET_DIR/skills" "$CODEX_TARGET_DIR/skills"
    cp -r "$GIT_ROOT/dot_claude/skills/"* "$CLAUDE_TARGET_DIR/skills/"
    cp -r "$GIT_ROOT/dot_claude/skills/"* "$CODEX_TARGET_DIR/skills/"
fi

# Sync Gemini CLI config
GEMINI_TARGET_DIR="$HOME/.gemini"
mkdir -p "$GEMINI_TARGET_DIR"

if [ -f "$GIT_ROOT/dot_gemini/GEMINI.md" ]; then
    cp "$GIT_ROOT/dot_gemini/GEMINI.md" "$GEMINI_TARGET_DIR/GEMINI.md"
fi

if [ -d "$GIT_ROOT/dot_gemini/commands" ]; then
    mkdir -p "$GEMINI_TARGET_DIR/commands"
    cp -r "$GIT_ROOT/dot_gemini/commands/"* "$GEMINI_TARGET_DIR/commands/" 2>/dev/null || true
fi

if [ -d "$GIT_ROOT/dot_gemini/skills" ]; then
    mkdir -p "$GEMINI_TARGET_DIR/skills"
    cp -r "$GIT_ROOT/dot_gemini/skills/"* "$GEMINI_TARGET_DIR/skills/" 2>/dev/null || true
fi

if [ -d "$GIT_ROOT/dot_gemini/policies" ]; then
    mkdir -p "$GEMINI_TARGET_DIR/policies"
    cp -r "$GIT_ROOT/dot_gemini/policies/"* "$GEMINI_TARGET_DIR/policies/" 2>/dev/null || true
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

# Sync zsh config
cp "$GIT_ROOT/zshrc" "$HOME/.zshrc"
cp "$GIT_ROOT/zshenv" "$HOME/.zshenv"

# Sync git config
cp "$GIT_ROOT/gitconfig" "$HOME/.gitconfig"
cp "$GIT_ROOT/gitignore_global" "$HOME/.gitignore_global"

echo "✅ Claude, Codex, and Gemini global config synced from $GIT_ROOT"
