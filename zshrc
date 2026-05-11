# Interactive zsh config. Env/functions needed by non-interactive shells
# (incl. AI tool-spawned shells) live in `zshenv` instead.

# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
export PATH="$PATH:$HOME/.rvm/bin"

export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
export PATH="$PATH:$HOME/.local/share/mise/installs/node/20.11/bin"

# yvm
export YVM_DIR=/usr/local/opt/yvm
[ -r $YVM_DIR/yvm.sh ] && . $YVM_DIR/yvm.sh

# pnpm
export PNPM_HOME="/Users/jack/Library/pnpm"
export PATH="$PNPM_HOME:$PATH"
# pnpm end

export NX_E2E_SKIP_CLEANUP=true
