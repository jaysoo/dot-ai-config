function gh-pending --description "Show pending gh commands waiting for 1Password auth"
    set -l pending_dir /tmp/op-gh-pending
    if not test -d $pending_dir
        echo "No pending gh requests."
        return
    end

    set -l files $pending_dir/*
    if test (count $files) -eq 0
        echo "No pending gh requests."
        return
    end

    # Show entries, cleaning up stale ones (dead PIDs)
    set -l found 0
    for f in $files
        set -l pid (basename $f)
        if kill -0 $pid 2>/dev/null
            set found (math $found + 1)
            cat $f
        else
            # Stale entry from killed process — clean up
            rm -f $f
        end
    end

    if test $found -eq 0
        echo "No pending gh requests (cleaned up stale entries)."
        rmdir $pending_dir 2>/dev/null
    end
end
