function tx
    tmux attach -t $argv[1] 2>/dev/null; or tmux new -s $argv[1]
end
