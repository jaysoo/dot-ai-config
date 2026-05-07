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

# Wrap `op` to log AI-agent auth requests to /tmp/op_requests.txt.
# Pass-through for humans and for subcommands that don't trigger auth.
op() {
    case "$1" in
        ""|signin|signout|whoami|--version|--help|-v|-h|completion)
            command op "$@"; return $? ;;
    esac
    if [ -z "$CLAUDECODE" ] && [ -z "$AI_AGENT" ] && [ -z "$CURSOR_AGENT" ] && [ -z "$GEMINI_CLI" ]; then
        command op "$@"; return $?
    fi
    if [ -z "$OP_REQUEST_REASON" ]; then
        printf 'op: OP_REQUEST_REASON required when invoked by an AI agent\n' >&2
        printf "op: e.g. OP_REQUEST_REASON='reading github token' op read op://...\n" >&2
        return 2
    fi
    local uid="$$-$RANDOM" log=/tmp/op_requests.txt
    printf '%s\t%s\t%s\t%s\top %s\n' \
        "$uid" "$(date '+%Y-%m-%dT%H:%M:%S%z')" "$PWD" "$OP_REQUEST_REASON" "$*" >>"$log"
    command op "$@"; local rc=$?
    if [ -f "$log" ]; then
        local tmp; tmp=$(mktemp)
        grep -v "^${uid}"$'\t' "$log" >"$tmp" 2>/dev/null || true
        mv "$tmp" "$log"
    fi
    return $rc
}

export NX_E2E_SKIP_CLEANUP=true
