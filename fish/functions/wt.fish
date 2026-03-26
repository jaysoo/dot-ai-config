function wt
  set -l branch_name $argv[1]
  set -l main_branch $argv[2]
  set -l project $argv[3]

  # Defaults for backwards compatibility
  if test -z "$main_branch"
    set main_branch "master"
  end
  if test -z "$project"
    set project "nx"
  end

  git fetch origin $main_branch
  git worktree add -b $branch_name $HOME/projects/$project-worktrees/$branch_name origin/$main_branch
end
