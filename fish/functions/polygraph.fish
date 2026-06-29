# Wrap the polygraph CLI so the kitty tab title tracks the active session.
# `session resume <slug>` / `session start` pin the tab to the session name;
# the pin survives `cd` (see conf.d/kitty-tab-title.fish) until you unpin.
function polygraph --description 'polygraph CLI; pins kitty tab title to the active session'
    set -l want_pin false
    if test "$argv[1]" = session
        switch "$argv[2]"
            case resume start
                set want_pin true
        end
    end

    # resume passes the slug explicitly (e.g. info-init-discrepancies-091e90ab)
    # - pin up front so the title is right even while resume runs.
    if test "$want_pin" = true; and test "$argv[2]" = resume
        set -l slug (__polygraph_slug_from_args $argv[3..-1])
        test -n "$slug"; and kitty-title-pin $slug
    end

    command polygraph $argv
    set -l ret $status

    # start (and resume w/o an explicit slug): ask the CLI what we landed in.
    if test "$want_pin" = true; and not set -q __kitty_pinned_title
        set -l slug (command polygraph session show --json 2>/dev/null | jq -r '.name // empty' 2>/dev/null)
        test -n "$slug"; and kitty-title-pin $slug
    end

    return $ret
end

# First positional arg, or the value of -s/--session, skipping other flags.
function __polygraph_slug_from_args
    set -l i 1
    while test $i -le (count $argv)
        switch $argv[$i]
            case -s --session
                set i (math $i + 1)
                test $i -le (count $argv); and echo $argv[$i]
                return
            case '-*'
                # other flag - skip
            case '*'
                echo $argv[$i]
                return
        end
        set i (math $i + 1)
    end
end
