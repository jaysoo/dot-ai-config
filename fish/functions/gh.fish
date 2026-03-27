function gh
    set -l pending_file /tmp/op-gh-pending
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

    # Build pending entry
    set -l entry (date '+%H:%M:%S')" "(pwd)" gh $gh_args"
    if test -n "$reason"
        set entry "$entry  # $reason"
    end

    # Append to pending file
    echo $entry >>$pending_file

    # Run gh via op plugin
    op plugin run -- gh $gh_args
    set -l exit_code $status

    # Remove our entry from pending file
    if test -f $pending_file
        set -l escaped (string escape --style=regex -- $entry)
        string match -v -- $entry (cat $pending_file) >$pending_file.tmp
        mv $pending_file.tmp $pending_file
        # Clean up empty file
        if test ! -s $pending_file
            rm -f $pending_file
        end
    end

    return $exit_code
end
