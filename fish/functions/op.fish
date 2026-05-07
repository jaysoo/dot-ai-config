function op --description "Wraps `op` to log AI-agent auth requests to /tmp/op_requests.txt"
    # Subcommands that don't trigger 1Password auth — pass straight through.
    switch "$argv[1]"
        case '' signin signout whoami --version --help -v -h completion
            command op $argv
            return $status
    end

    # Only enforce/log when invoked under a known AI agent. Humans pay zero friction.
    if not set -q CLAUDECODE; and not set -q AI_AGENT; and not set -q CURSOR_AGENT; and not set -q GEMINI_CLI
        command op $argv
        return $status
    end

    if not set -q OP_REQUEST_REASON; or test -z "$OP_REQUEST_REASON"
        echo "op: OP_REQUEST_REASON required when invoked by an AI agent" >&2
        echo "op: e.g. OP_REQUEST_REASON='reading github token' op read op://..." >&2
        return 2
    end

    set -l uid "$fish_pid-"(random)
    set -l log /tmp/op_requests.txt
    printf '%s\t%s\t%s\t%s\top %s\n' \
        "$uid" (date '+%Y-%m-%dT%H:%M:%S%z') (pwd) "$OP_REQUEST_REASON" "$argv" >>$log

    command op $argv
    set -l rc $status

    if test -f $log
        set -l tmp (mktemp)
        grep -v "^$uid"\t $log >$tmp 2>/dev/null; or true
        mv $tmp $log
    end

    return $rc
end
