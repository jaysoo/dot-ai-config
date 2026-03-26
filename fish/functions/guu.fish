function guu
  git checkout master
  git fetch upstream
  git reset --hard upstream/master
  git push origin master -f
end
