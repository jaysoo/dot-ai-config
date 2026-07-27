# Sourced by zsh for ALL shells (login, interactive, non-interactive).
# Keep this file restricted to env/PATH/functions that must be available
# to scripts and tool-spawned shells (e.g. Claude Code's Bash tool).

[ -f "$HOME/.cargo/env" ] && . "$HOME/.cargo/env"

# 1Password CLI plugin aliases removed. `gh` was the only plugin and the
# binary has been uninstalled for security reasons.

# `gh` and `op` are wrapped by auth-proxy in ~/.local/bin (built by sync.sh).
# It handles the request logging and blocks `gh auth token`, so no shell
# function is needed here -- and the wrapper applies to every shell, not just zsh.
