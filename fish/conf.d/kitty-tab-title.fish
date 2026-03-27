# Auto-set kitty tab title to current directory basename on cd
if set -q KITTY_WINDOW_ID
    function __kitty_tab_title --on-variable PWD
        kitty @ set-tab-title (basename $PWD)
    end
    # Set initial title
    kitty @ set-tab-title (basename $PWD)
end
