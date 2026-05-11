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

# Wrap `op` to log AI-agent auth requests to /private/tmp/op_requests.txt.
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
    # Audit log: append PENDING line, then rewrite to APPROVED/DENIED based on
    # op's exit code. Lines are kept (never deleted) so the file is a rolling
    # audit trail for the day/week.
    local uid="$$-$RANDOM" log=/private/tmp/op_requests.txt tab=$'\t'
    printf 'PENDING\t%s\t%s\t%s\t%s\top %s\n' \
        "$uid" "$(date '+%Y-%m-%dT%H:%M:%S%z')" "$PWD" "$OP_REQUEST_REASON" "$*" >>"$log"
    command op "$@"; local rc=$?
    # Note: do NOT name this `status` — it's a read-only special var in zsh
    # (mirrors $?), and assigning to it aborts the function so the sed below
    # never runs. Bash doesn't have this issue but keep the name aligned.
    local outcome; [ $rc -eq 0 ] && outcome=APPROVED || outcome=DENIED
    if [ -f "$log" ]; then
        local tmp; tmp=$(mktemp)
        sed "s|^PENDING${tab}${uid}${tab}|${outcome}${tab}${uid}${tab}|" "$log" >"$tmp" 2>/dev/null
        mv "$tmp" "$log"
    fi
    return $rc
}

# Re-point `gh` alias from plugins.sh (which hardcodes /opt/homebrew/bin/op,
# bypassing the function wrapper above) to the bare `op` name so the wrapper
# fires and logs the request.
alias gh='op plugin run -- gh'

export NX_E2E_SKIP_CLEANUP=true
