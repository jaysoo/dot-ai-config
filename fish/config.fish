
set PATH /usr/local/Cellar/git/2.32.0/bin $HOME/bin $PATH /usr/local/bin $HOME/apache-maven-3.8.1/bin $HOME/Library/Python/3.8/bin $HOME/.cargo/bin $HOME/.local/bin $HOME/.deno/bin
set PATH $PATH "/opt/homebrew/bin"
set PATH $PATH /Users/jack/.local/bin
set PNPM_HOME "/Users/jack/Library/pnpm"
set PATH $PATH "$HOME/.claude/local/"
set PATH $PATH "$PNPM_HOME:$PATH"
set NODE_OPTIONS "--max_old_space_size=3072"
# set DOCKER_HOST 'unix:///Users/jack/.local/share/containers/podman/machine/podman-machine-default/podman.sock'
# set ANDROID_SDK_ROOT "/Users/jack/Library/Android/sdk"
# set -x C_x86_64_unknown_linux_gnu x86_64-unknown-linux-gnu-gcc
# set -x XX_x86_64_unknown_linux_gnu x86_64-unknown-linux-gnu-g++
# set -x R_x86_64_unknown_linux_gnu x86_64-unknown-linux-gnu-ar
# set -x ARGO_TARGET_X86_64_UNKNOWN_LINUX_GNU_LINKER x86_64-unknown-linux-gnu-gcc


# set -x NEXT_PUBLIC_ASTRO_URL 'https://nx-docs.netlify.app'

set -x NPM_CONFIG_LOGLEVEL 'error'

set -x NX_CLOUD_API 'https://staging.nx.app'

set -gx PHP_MEMORY_LIMIT 8G

# set -x CI 'false'
# set -x NX_DAEMON 'false'

set -x EDITOR nvim

set -x NX_E2E_RUN_E2E 'true'
set -x NX_E2E_SKIP_CLEANUP 'true'

#set -x NX_CLOUD_API 'https://snapshot.nx.app'

# set -x NEXT_PUBLIC_FARO_URL 'https://faro-collector-prod-us-east-0.grafana.net/collect/e37fb6b0c58f23b2ad73749f70bb8192'
# set -x NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA '9999' 
# set -x NEXT_PUBLIC_VERCEL_ENV 'preview'

set -x COREPACK_ENABLE_AUTO_PIN '0'
set -x COREPACK_ENABLE_DOWNLOAD_PROMPT '0'

set -x NX_SKIP_PROVENANCE_CHECK 'true'

# set -x NX_ADD_TS_PLUGIN "true"

export ANDROID_SDK_ROOT
set -x NODE_OPTIONS '--max-old-space-size=32768'

# set NX_TASKS_RUNNER_NEO_OUTPUT true

set -g theme_color_scheme light

# set -x NX_IGNORE_UNSUPPORTED_TS_SETUP true

# status --is-interactive; and source (jenv init -|psub)

# function code
#   set location "$PWD/$argv"
#   open -n -b "com.microsoft.VSCode" --args $location
# end

function code --wraps='/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code' --description 'alias code /Applications/Visual Studio Code 2.app/Contents/Resources/app/bin/code'
  /Applications/Visual\ Studio\ Code.app/Contents/Resources/app/bin/code $argv;
end

# pnpm
set -gx PNPM_HOME "/Users/jack/Library/pnpm"
if not string match -q -- $PNPM_HOME $PATH
  set -gx PATH "$PNPM_HOME" $PATH
end
# pnpm end

# The next line updates PATH for the Google Cloud SDK.
# if [ -f '/Users/jack/Downloads/google-cloud-sdk/path.fish.inc' ]; . '/Users/jack/Downloads/google-cloud-sdk/path.fish.inc'; end

# bun
set --export BUN_INSTALL "$HOME/.bun"
set --export PATH $BUN_INSTALL/bin $PATH

# /Users/jack/.local/bin/mise activate fish | source
if status is-interactive
  mise activate fish | source
else
  mise activate fish --shims | source
end

# proto
set -gx PROTO_HOME "$HOME/.proto";
set -gx PATH "$PROTO_HOME/shims" "$PROTO_HOME/bin" $PATH;

# Added by Windsurf
fish_add_path /Users/jack/.codeium/windsurf/bin

# Added by Antigravity
fish_add_path /Users/jack/.antigravity/antigravity/bin

# opencode
fish_add_path /Users/jack/.opencode/bin

# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/jack/google-cloud-sdk/path.fish.inc' ]; . '/Users/jack/google-cloud-sdk/path.fish.inc'; end
source /Users/jack/.config/op/plugins.sh

# Swap cat with bat
# Do not page when cat or bat
alias cat bat
set -Ux BAT_PAGER ""
set -Ux BAT_STYLE numbers

alias ccat bat --style=plain --color=never


