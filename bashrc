# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
export PATH="$PATH:$HOME/.rvm/bin"


export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
export PATH="$PATH:$HOME/.local/share/mise/installs/node/20.11/bin"

#### END FIG ENV VARIABLES ####

# pnpm
export PNPM_HOME="/Users/jack/Library/pnpm"
export PATH="$PNPM_HOME:$PATH"
# pnpm end

# eval "$(starship init bash)"
. "$HOME/.cargo/env"

source /Users/jack/.config/op/plugins.sh

export NX_E2E_SKIP_CLEANUP=true
