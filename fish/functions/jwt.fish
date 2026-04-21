function jwt
  set -l issue_id $argv[1]
  set -l project $argv[2]

  # Default to nx if no project specified
  if test -z "$project"
    set project "nx"
  end

  # Determine main branch: nx uses master, others use main
  if test "$project" = "nx"
    set main_branch "master"
  else
    set main_branch "main"
  end

  set -l worktree_path $HOME/projects/$project-worktrees/$issue_id
  set -l repo_path $HOME/projects/$project

  if not test -d $worktree_path
    cd $repo_path
    wt $issue_id $main_branch $project
    cd $worktree_path
    mise trust
    pnpm i
    ln -s $HOME/projects/dot-ai-config/dot_ai .ai
  else
    cd $worktree_path
  end

  touch $worktree_path
end
