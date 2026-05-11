# Sourced by zsh for ALL shells (login, interactive, non-interactive).
# Keep this file restricted to env/PATH/functions that must be available
# to scripts and tool-spawned shells (e.g. Claude Code's Bash tool).

[ -f "$HOME/.cargo/env" ] && . "$HOME/.cargo/env"

# 1Password CLI plugin aliases (e.g. gh -> op plugin run -- gh).
[ -f "$HOME/.config/op/plugins.sh" ] && source "$HOME/.config/op/plugins.sh"

# Wrap `op` to log AI-agent auth requests to /tmp/op_requests.txt.
# Lives in zshenv (not zshrc) so non-interactive shells spawned by AI tools
# also enforce the OP_REQUEST_REASON gate.
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
