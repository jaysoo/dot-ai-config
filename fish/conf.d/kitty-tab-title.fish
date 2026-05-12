# Auto-set kitty tab title to current directory basename on cd.
# Skip inside tmux: `kitty @` writes escape sequences to the controlling TTY
# and waits for a reply, but tmux intercepts the bytes so the call blocks
# until response-timeout. That blocks fish startup and leaves a blank pane.
if set -q KITTY_WINDOW_ID; and not set -q TMUX
    function __kitty_tab_title --on-variable PWD
        string match -q '*/tmp*' $PWD; and return
        kitty @ set-tab-title (basename $PWD)
    end
    # Set initial title
    string match -q '*/tmp*' $PWD; or kitty @ set-tab-title (basename $PWD)
end
