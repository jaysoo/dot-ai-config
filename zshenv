# Sourced by zsh for ALL shells (login, interactive, non-interactive).
# Keep this file restricted to env/PATH/functions that must be available
# to scripts and tool-spawned shells (e.g. Claude Code's Bash tool).

[ -f "$HOME/.cargo/env" ] && . "$HOME/.cargo/env"

# 1Password CLI plugin aliases (e.g. gh -> op plugin run -- gh).
[ -f "$HOME/.config/op/plugins.sh" ] && source "$HOME/.config/op/plugins.sh"

# Wrap `op` to log AI-agent auth requests to /private/tmp/op_requests.txt.
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
    # Audit log: append PENDING line, then rewrite to APPROVED/DENIED based on
    # op's exit code. Lines are kept (never deleted) so the file is a rolling
    # audit trail for the day/week.
    local uid="$$-$RANDOM" log=/private/tmp/op_requests.txt tab=$'\t'
    printf 'PENDING\t%s\t%s\t%s\t%s\top %s\n' \
        "$uid" "$(date '+%Y-%m-%dT%H:%M:%S%z')" "$PWD" "$OP_REQUEST_REASON" "$*" >>"$log"
    command op "$@"; local rc=$?
    local status; [ $rc -eq 0 ] && status=APPROVED || status=DENIED
    if [ -f "$log" ]; then
        local tmp; tmp=$(mktemp)
        sed "s|^PENDING${tab}${uid}${tab}|${status}${tab}${uid}${tab}|" "$log" >"$tmp" 2>/dev/null
        mv "$tmp" "$log"
    fi
    return $rc
}

# Re-point `gh` alias from plugins.sh (which hardcodes /opt/homebrew/bin/op,
# bypassing the function wrapper above) to the bare `op` name so the wrapper
# fires and logs the request.
alias gh='op plugin run -- gh'
