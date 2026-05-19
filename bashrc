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

export NX_E2E_SKIP_CLEANUP=true

# Package manager min-release-age supply chain defense.
# Defaults in ~/.npmrc, ~/.yarnrc.yml, ~/.bunfig.toml, pnpm global rc.
# Helpers below bypass the 24h gate for one-off urgent installs.
alias npm-now='npm_config_min_release_age=0 npm'
alias yarn-now='YARN_NPM_MINIMAL_AGE_GATE=0 yarn'
pnpm-now() { command pnpm "$@" --config.minimumReleaseAge=0; }
bun-now() { command bun "$@" --minimum-release-age=0; }
