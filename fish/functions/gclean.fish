function gclean
  git reset --hard HEAD
  git submodule foreach --recursive git clean -fd
  git submodule foreach --recursive git reset --hard HEAD
  git submodule update 
  git clean -fd
end
