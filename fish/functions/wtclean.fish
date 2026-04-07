function wtclean
    # Clean up old git worktrees (remove folder, unregister, delete branch)
    # Usage: wtclean [project] [--dry-run] [--days N] [--all]
    #   project: nx (default), ocean, nrwl-blog, etc.
    #   --dry-run: show what would be cleaned without doing it
    #   --days N: age threshold (default: 21)
    #   --all: clean ALL worktrees, not just old ones

    set -l project "nx"
    set -l dry_run false
    set -l age_days 21
    set -l clean_all false

    # Parse args
    set -l i 1
    while test $i -le (count $argv)
        switch $argv[$i]
            case --dry-run
                set dry_run true
            case --days
                set i (math $i + 1)
                set age_days $argv[$i]
            case --all
                set clean_all true
            case '*'
                set project $argv[$i]
        end
        set i (math $i + 1)
    end

    set -l worktree_dir $HOME/projects/$project-worktrees
    set -l repo_dir $HOME/projects/$project

    if not test -d $repo_dir/.git
        echo "Error: $repo_dir is not a git repository"
        return 1
    end

    if not test -d $worktree_dir
        echo "Error: $worktree_dir does not exist"
        return 1
    end

    # First, prune any already-broken worktree references
    git -C $repo_dir worktree prune

    # Find candidate folders
    set -l candidates
    if test "$clean_all" = true
        for dir in $worktree_dir/*/
            set -l name (basename $dir)
            if test "$name" != "." -a "$name" != ".."
                set -a candidates $name
            end
        end
    else
        for dir in (find $worktree_dir -maxdepth 1 -type d -mtime +$age_days -not -name '.*' -not -name (basename $worktree_dir))
            set -a candidates (basename $dir)
        end
    end

    if test (count $candidates) -eq 0
        echo "No worktrees to clean up."
        return 0
    end

    # Display candidates
    set -l label "older than $age_days days"
    if test "$clean_all" = true
        set label "all"
    end

    echo "Found "(count $candidates)" worktree(s) to clean ($label) in $worktree_dir:"
    echo ""

    for name in $candidates
        set -l wt_path $worktree_dir/$name
        set -l mod_date (stat -f "%Sm" -t "%Y-%m-%d" $wt_path 2>/dev/null; or stat -c "%y" $wt_path 2>/dev/null | cut -d' ' -f1)

        # Try to find the branch this worktree is on
        set -l branch ""
        if test -f $wt_path/.git
            set branch (git -C $wt_path rev-parse --abbrev-ref HEAD 2>/dev/null)
        end

        if test -n "$branch"
            echo "  $name (branch: $branch, modified: $mod_date)"
        else
            echo "  $name (modified: $mod_date)"
        end
    end

    echo ""

    if test "$dry_run" = true
        echo "Dry run — no changes made."
        return 0
    end

    # Confirm
    read -P "Delete these "(count $candidates)" worktree(s)? [y/N] " confirm
    if test "$confirm" != "y" -a "$confirm" != "Y"
        echo "Cancelled."
        return 0
    end

    echo ""

    set -l removed 0
    set -l failed 0

    for name in $candidates
        set -l wt_path $worktree_dir/$name

        # Detect the branch before removing
        set -l branch ""
        if test -f $wt_path/.git
            set branch (git -C $wt_path rev-parse --abbrev-ref HEAD 2>/dev/null)
        end

        # Remove worktree (--force handles dirty worktrees)
        if git -C $repo_dir worktree remove --force $wt_path 2>/dev/null
            echo "  ✓ removed worktree $name"
        else
            # Folder may not be registered as a worktree (already pruned or manually created)
            rm -rf $wt_path 2>/dev/null
            echo "  ✓ removed folder $name (was not a registered worktree)"
        end

        # Delete local branch if it exists and isn't master/main
        if test -n "$branch" -a "$branch" != "master" -a "$branch" != "main" -a "$branch" != "HEAD"
            if git -C $repo_dir branch -D $branch 2>/dev/null
                echo "    ✓ deleted branch $branch"
            else
                echo "    · branch $branch already gone or could not delete"
            end
        end

        set removed (math $removed + 1)
    end

    # Final prune to clean any remaining stale references
    git -C $repo_dir worktree prune

    echo ""
    echo "Done. Removed $removed worktree(s)."
end
