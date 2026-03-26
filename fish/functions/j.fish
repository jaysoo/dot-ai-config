function j
  switch $argv
    case 'u'
      cd ~/projects/upstream-docs
    case 'docs'
      cd ~/projects/upstream-docs
    case 'd'
      cd ~/Downloads
    case 'de'
      cd ~/Desktop
    case 'na'
      cd ~/projects/nx-worktrees/master
    case 'nt'
      cd ~/projects/nx-worktrees
    case 'n'
      cd ~/projects/nx
    case 'c'
      cd ~/projects/claude-skills-commands/
    case 'a'
      cd ~/projects/dot-ai-config
    case 'n'
      cd ~/projects/nx
    case 'w'
      cd ~/projects/nx-worktrees
    case 'nx'
      cd ~/projects/nx
    case 'o'
      cd ~/projects/ocean
    case 'c'
      cd ~/projects/cloud-infrastructure
    case 'brew'
      cd ~/projects/homebrew-nx
    case 's'
      cd ~/projects/collect-github-stats
    case 'nxl'
      cd ~/projects/nx-labs
    case '*'
      if test $argv; 
        cd ~/projects/$argv
      else
        echo 'Which project to jump to?'
        ls ~/projects
      end
  end
end

complete --command j --no-files --arguments='(ls ~/projects)'

