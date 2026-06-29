# Auto-set kitty tab title to current directory basename on cd.
# Skip inside tmux: `kitty @` writes escape sequences to the controlling TTY
# and waits for a reply, but tmux intercepts the bytes so the call blocks
# until response-timeout. That blocks fish startup and leaves a blank pane.
if set -q KITTY_WINDOW_ID; and not set -q TMUX
    function __kitty_tab_title --on-variable PWD
        # A pinned title (e.g. a Polygraph session) wins over cwd basename.
        set -q __kitty_pinned_title; and return
        string match -q '*/tmp*' $PWD; and return
        kitty @ set-tab-title (basename $PWD)
    end
    # Set initial title
    if not set -q __kitty_pinned_title
        string match -q '*/tmp*' $PWD; or kitty @ set-tab-title (basename $PWD)
    end
end

# Pin the tab title to a fixed string so the PWD hook above stops clobbering it.
function kitty-title-pin --description 'Pin kitty tab title; survives cd until unpinned'
    set -q KITTY_WINDOW_ID; and not set -q TMUX; or return
    set -g __kitty_pinned_title $argv[1]
    kitty @ set-tab-title $argv[1]
end

# Release the pin and revert to cwd basename.
function kitty-title-unpin --description 'Clear pinned kitty tab title; revert to cwd basename'
    set -e __kitty_pinned_title
    set -q KITTY_WINDOW_ID; and not set -q TMUX; or return
    string match -q '*/tmp*' $PWD; or kitty @ set-tab-title (basename $PWD)
end
