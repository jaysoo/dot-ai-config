# Sourced by zsh for ALL shells (login, interactive, non-interactive).
# Keep this file restricted to env/PATH/functions that must be available
# to scripts and tool-spawned shells (e.g. Claude Code's Bash tool).

[ -f "$HOME/.cargo/env" ] && . "$HOME/.cargo/env"

# 1Password CLI plugin aliases removed. `gh` was the only plugin and the
# binary has been uninstalled for security reasons.

# Require AI agents to state why an `op` command needs authentication, and
# surface the pending request in Raycast via /tmp/op_requests.txt.
op() {
  case "$1" in
    ''|signin|signout|whoami|--version|--help|-v|-h|completion)
      command op "$@"
      return $?
      ;;
  esac

  if [[ -z ${CLAUDECODE:-} && -z ${AI_AGENT:-} && -z ${CURSOR_AGENT:-} && -z ${GEMINI_CLI:-} ]]; then
    command op "$@"
    return $?
  fi

  if [[ -z ${OP_REQUEST_REASON:-} ]]; then
    print -u2 'op: OP_REQUEST_REASON required when invoked by an AI agent'
    print -u2 "op: e.g. OP_REQUEST_REASON='reading github token' op read op://..."
    return 2
  fi

  local uid="$$-$RANDOM" log=/tmp/op_requests.txt tmp rc
  printf '%s\t%s\t%s\t%s\top %s\n' \
    "$uid" "$(date '+%Y-%m-%dT%H:%M:%S%z')" "$PWD" "$OP_REQUEST_REASON" "$*" >> "$log"

  command op "$@"
  rc=$?

  if [[ -f $log ]]; then
    tmp=$(mktemp)
    grep -v "^${uid}"$'\t' "$log" > "$tmp" 2>/dev/null || true
    mv "$tmp" "$log"
  fi

  return $rc
}
