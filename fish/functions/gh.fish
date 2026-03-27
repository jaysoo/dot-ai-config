function gh
    set -l pending_dir /tmp/op-gh-pending
    set -l reason ""
    set -l gh_args

    # Extract --reason flag before passing to gh
    set -l i 1
    while test $i -le (count $argv)
        if string match -q -- '--reason' $argv[$i]
            set i (math $i + 1)
            if test $i -le (count $argv)
                set reason $argv[$i]
            end
        else if string match -q -- '--reason=*' $argv[$i]
            set reason (string replace -- '--reason=' '' $argv[$i])
        else
            set -a gh_args $argv[$i]
        end
        set i (math $i + 1)
    end

    # Each invocation gets its own file, named by PID
    mkdir -p $pending_dir
    set -l entry_file $pending_dir/$fish_pid

    # Build entry
    set -l entry (date '+%H:%M:%S')" "(pwd)" gh $gh_args"
    if test -n "$reason"
        set entry "$entry  # $reason"
    end
    echo $entry >$entry_file

    # Run gh via op plugin
    op plugin run -- gh $gh_args
    set -l exit_code $status

    rm -f $entry_file

    return $exit_code
end
