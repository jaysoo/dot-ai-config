# Sourced by zsh for ALL shells (login, interactive, non-interactive).
# Keep this file restricted to env/PATH/functions that must be available
# to scripts and tool-spawned shells (e.g. Claude Code's Bash tool).

[ -f "$HOME/.cargo/env" ] && . "$HOME/.cargo/env"

# 1Password CLI plugin aliases (e.g. gh -> op plugin run -- gh).
[ -f "$HOME/.config/op/plugins.sh" ] && source "$HOME/.config/op/plugins.sh"
