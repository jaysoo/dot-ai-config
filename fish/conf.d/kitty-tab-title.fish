# Auto-set kitty tab title to current directory basename on cd
if set -q KITTY_WINDOW_ID
    function __kitty_tab_title --on-variable PWD
        string match -q '*/tmp*' $PWD; and return
        kitty @ set-tab-title (basename $PWD)
    end
    # Set initial title
    string match -q '*/tmp*' $PWD; or kitty @ set-tab-title (basename $PWD)
end
