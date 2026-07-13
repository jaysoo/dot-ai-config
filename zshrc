# Interactive zsh config. Env/functions needed by non-interactive shells
# (incl. AI tool-spawned shells) live in `zshenv` instead.

# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
export PATH="$PATH:$HOME/.rvm/bin"

export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
export PATH="$PATH:$HOME/.local/share/mise/installs/node/20.11/bin"

# yvm
export YVM_DIR=/usr/local/opt/yvm
[ -r $YVM_DIR/yvm.sh ] && . $YVM_DIR/yvm.sh

# pnpm
export PNPM_HOME="/Users/jack/Library/pnpm"
export PATH="$PNPM_HOME:$PATH"
# pnpm end

export NX_E2E_SKIP_CLEANUP=true

# Package manager min-release-age supply chain defense.
# Defaults in ~/.npmrc, ~/.yarnrc.yml, ~/.bunfig.toml, pnpm global rc.
# Helpers below bypass the 24h gate for one-off urgent installs.
alias npm-now='npm_config_min_release_age=0 npm'
alias yarn-now='YARN_NPM_MINIMAL_AGE_GATE=0 yarn'
pnpm-now() { command pnpm "$@" --config.minimumReleaseAge=0; }
bun-now() { command bun "$@" --minimum-release-age=0; }

# Oh My Zsh must load before custom helpers so the configured theme, plugins,
# completions, and their defaults are retained. The Fish-parity helpers below
# intentionally override any overlapping aliases.
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"
plugins=(git)
[[ -r "$ZSH/oh-my-zsh.sh" ]] && source "$ZSH/oh-my-zsh.sh"

# Fish parity: interactive command helpers.
alias g='git'
alias ga='git add'
alias gaa='git add .'
alias gc='git commit'
alias gcl='git clone'
# The Fish file was named gcl.fish but exposed `glc`; retain both spellings.
alias glc='git clone'
alias gco='git checkout'
alias gcob='git checkout -b'
alias gss='git status --short --ignore-submodules=dirty'
alias l='ls'

cc() { command claude --dangerously-skip-permissions "$@"; }
code() { command /Applications/Visual\ Studio\ Code.app/Contents/Resources/app/bin/code "$@"; }
foo() { print Hello; }

# Oh My Zsh's git plugin uses these names for aliases. The Fish-compatible
# helpers below are intentionally functions with different behavior.
unalias gclean gcor gp 2>/dev/null
gclean() {
  git reset --hard HEAD || return
  git submodule foreach --recursive git clean -fd || return
  git submodule foreach --recursive git reset --hard HEAD || return
  git submodule update || return
  git clean -fd
}

# Delete the current branch from origin (the legacy Fish helper's behavior).
gdb() { git push "origin:$(git branch --show-current)"; }
gp() { git push origin "$(git branch --show-current)"; }
gpb() { gp; }
gcu() {
  git fetch upstream && git checkout -b "$1" upstream/master
}
guu() {
  git checkout master && git fetch upstream && git reset --hard upstream/master && git push origin master -f
}

# Check out a branch from a GitHub fork: gcor owner:branch.
gcor() {
  local remote=${1%%:*} branch=${1#*:}
  if [[ -z $remote || -z $branch || $remote == $branch ]]; then
    print -u2 'Usage: gcor <github-owner>:<branch>'
    return 2
  fi
  if ! git remote get-url "$remote" >/dev/null 2>&1; then
    print "Adding remote $remote"
    git remote add "$remote" "git@github.com:$remote/nx.git" || return
  fi
  print "Fetching $remote $branch..."
  git fetch -q "$remote" "$branch" || return
  print "Checkout $branch"
  git checkout "$branch" && git reset --hard "$remote/$branch" && print 'Done!'
}

linkup() {
  local target="$HOME/projects/dot-ai-config/dot_ai"
  if [[ -L .ai && $(readlink .ai) == "$target" ]]; then
    return 0
  elif [[ -e .ai ]]; then
    print -u2 '.ai already exists; refusing to replace it'
    return 1
  fi
  ln -s "$target" .ai
}
setup_ai() { linkup; }

j() {
  local destination
  case "$1" in
    u|docs) destination="$HOME/projects/upstream-docs" ;;
    d) destination="$HOME/Downloads" ;;
    de) destination="$HOME/Desktop" ;;
    na) destination="$HOME/projects/nx-worktrees/master" ;;
    nt|w) destination="$HOME/projects/nx-worktrees" ;;
    n|nx) destination="$HOME/projects/nx" ;;
    a) destination="$HOME/projects/dot-ai-config" ;;
    o) destination="$HOME/projects/ocean" ;;
    c|cloud) destination="$HOME/projects/cloud-infrastructure" ;;
    claude|skills) destination="$HOME/projects/claude-skills-commands" ;;
    brew) destination="$HOME/projects/homebrew-nx" ;;
    s) destination="$HOME/projects/collect-github-stats" ;;
    nxl) destination="$HOME/projects/nx-labs" ;;
    '') print 'Which project to jump to?'; command ls "$HOME/projects"; return 0 ;;
    *) destination="$HOME/projects/$1" ;;
  esac
  builtin cd "$destination"
}

workon() {
  local destination
  case "$1" in
    console) destination="$HOME/projects/nx-console" ;;
    console-ext) destination="$HOME/projects/angular-console-nrwl-extensions" ;;
    nx) destination="$HOME/projects/nx" ;;
    nxl) destination="$HOME/projects/nx-labs" ;;
    brew) destination="$HOME/projects/homebrew-nx" ;;
    book) destination="$HOME/books/nx-react-book" ;;
    book-ex) destination="$HOME/books/nx-react-book-example" ;;
    ocean) destination="$HOME/projects/ocean" ;;
    acme) destination="$HOME/projects/acme" ;;
    challenge) destination="$HOME/projects/nrwl-challenge" ;;
    *) print -u2 'Project not found'; return 1 ;;
  esac
  builtin cd "$destination"
}

wt() {
  local branch_name=$1 main_branch=${2:-master} project=${3:-nx}
  [[ -n $branch_name ]] || { print -u2 'Usage: wt <branch> [main-branch] [project]'; return 2; }
  git fetch origin "$main_branch" && git worktree add -b "$branch_name" "$HOME/projects/$project-worktrees/$branch_name" "origin/$main_branch"
}

jwt() {
  local issue_id=$1 project=${2:-nx} main_branch worktree_path repo_path
  [[ -n $issue_id ]] || { print -u2 'Usage: jwt <issue-id> [project]'; return 2; }
  main_branch=$([[ $project == nx ]] && print master || print main)
  worktree_path="$HOME/projects/$project-worktrees/$issue_id"
  repo_path="$HOME/projects/$project"
  if [[ ! -d $worktree_path ]]; then
    builtin cd "$repo_path" || return
    wt "$issue_id" "$main_branch" "$project" || return
    builtin cd "$worktree_path" || return
    mise trust && pnpm i || return
    [[ $project != nx ]] || dotnet restore packages/dotnet/analyzer || return
    linkup || return
  else
    builtin cd "$worktree_path" || return
  fi
  touch "$worktree_path"
}

linear() {
  local url=$1 project=$2 issue_id
  issue_id=$(sed -n 's|.*/issue/\([^/]*\).*|\1|p' <<< "$url")
  [[ -n $issue_id ]] || { print -u2 'Error: Could not extract issue ID from URL'; return 1; }
  print "Extracted issue ID: $issue_id"
  jwt "$issue_id" ${project:+"$project"}
}

tx() {
  [[ -n $1 ]] || { print -u2 'Usage: tx <session>'; return 2; }
  tmux attach -t "$1" 2>/dev/null || tmux new -s "$1"
}

top25() { git log --since '2 months ago' --format='%an' | sort | uniq -c | sort -nr | head -n 25; }
pm_clear_cache() { pnpm store prune --force && rm -rf "$HOME/Library/Caches/pnpm" && npm cache clean --force && rm -rf "$HOME/.npm/_npx"; }

e2e() {
  local path=$1 project target
  local -a parts
  parts=("${(@s:/:)path}")
  (( ${#parts} >= 3 )) || { print -u2 'Usage: e2e <e2e/project/path>'; return 2; }
  project="$parts[1]-$parts[2]"
  target="${(j:/:)parts[3,-1]}"
  npx nx run "$project:e2e-ci--$target"
}

acme() {
  local version='' name='' preset=react-standalone directory=/tmp arg rc
  while (( $# )); do
    case "$1" in
      -h|--help) print 'Usage: acme --version <locally published version> [--name <name>] [--preset <preset>] [--directory <dir>]'; return 0 ;;
      -v|--version) version=$2; shift 2 ;;
      --version=*) version=${1#*=}; shift ;;
      -n|--name) name=$2; shift 2 ;;
      --name=*) name=${1#*=}; shift ;;
      -p|--preset) preset=$2; shift 2 ;;
      --preset=*) preset=${1#*=}; shift ;;
      -d|--directory) directory=$2; shift 2 ;;
      --directory=*) directory=${1#*=}; shift ;;
      *) print -u2 "Unknown option: $1"; return 2 ;;
    esac
  done
  [[ -n $version ]] || { print -u2 'acme: --version is required'; return 2; }
  name=${name:-acme$version}
  print -P "%F{white}%K{cyan}Creating workspace at $directory/$name with --preset=$preset at version $version%k%f"
  pushd "$directory" >/dev/null || return
  npx -y "create-nx-workspace@$version" "$name" --preset="$preset" --style=css --nxCloud=false --appName="acme$version"
  rc=$?
  popd >/dev/null
  if (( rc == 0 )); then print -P "%F{white}%K{green}Workspace created at $directory/$name%k%f"; else print -P '%F{white}%K{red}Failed to create workspace%k%f'; fi
  return $rc
}

cnw() {
  local version='' name='' preset=react-standalone style=css directory=/tmp bundler=vite
  local release=false update=false mf_ssr=false arg ver appname rc nx_directory=${NX_DIRECTORY:-$HOME/projects/nx}
  while (( $# )); do
    case "$1" in
      -h|--help) print 'Usage: cnw --version <published version> [--release] [--preset <preset>] [--name <appName>] [--mf-ssr]'; return 0 ;;
      -r|--release) release=true; shift ;;
      -u|--update) update=true; shift ;;
      -m|--mf-ssr) mf_ssr=true; shift ;;
      -v|--version) version=$2; shift 2 ;;
      --version=*) version=${1#*=}; shift ;;
      -n|--name) name=$2; shift 2 ;;
      --name=*) name=${1#*=}; shift ;;
      -p|--preset) preset=$2; shift 2 ;;
      --preset=*) preset=${1#*=}; shift ;;
      -s|--style) style=$2; shift 2 ;;
      --style=*) style=${1#*=}; shift ;;
      -d|--directory) directory=$2; shift 2 ;;
      --directory=*) directory=${1#*=}; shift ;;
      -b|--bundler) bundler=$2; shift 2 ;;
      --bundler=*) bundler=${1#*=}; shift ;;
      *) print -u2 "Unknown option: $1"; return 2 ;;
    esac
  done
  [[ -n $version ]] || { print -u2 'cnw: --version is required'; return 2; }
  [[ $preset != monorepo && $preset != mono ]] || preset=react-monorepo
  if [[ $release == true ]]; then
    print -P "%F{white}%K{cyan}Publishing Nx locally at version $version...%k%f"
    pushd "$nx_directory" >/dev/null || return
    yarn nx-release "$version" --local || { popd >/dev/null; return 1; }
    popd >/dev/null
  fi
  ver=${version//./-}
  local short_preset=${preset#react-}
  name=${name:-$short_preset-$ver}
  [[ $preset == *standalone ]] && appname=$name || appname=demo
  print -P "%F{white}%K{cyan}Creating workspace $name with --preset=$preset at version $version%k%f"
  if [[ $update == true ]]; then return 0; fi
  pushd "$directory" >/dev/null || return
  npx -y "create-nx-workspace@$version" "$name" --preset="$preset" --style="$style" --nxCloud=false --bundler="$bundler" --appName="$appname"
  rc=$?
  popd >/dev/null
  (( rc == 0 )) || { print -P '%F{white}%K{red}Failed to create workspace%k%f'; return $rc; }
  if [[ $mf_ssr == true ]]; then
    print 'Setting up SSR...'
    pushd "$directory/$name" >/dev/null || return
    npx nx g @nrwl/react:host shell --remotes=about --ssr --style=css
    rc=$?
    popd >/dev/null
    return $rc
  fi
  print -P "%F{white}%K{green}Workspace created at $directory/$name%k%f"
}

nx_inspect_plan() {
  local input=$1 project target
  [[ $# == 1 && $input == *:* && $input != :* && $input != *: ]] || { print -u2 'Usage: nx_inspect_plan <project:target>'; return 1; }
  project=${input%%:*}; target=${input#*:}
  NX_INSPECT_PROJECT="$project" NX_INSPECT_TARGET="$target" node -e '
const { createProjectGraphAsync } = require("@nx/devkit");
const { HashPlanInspector } = require("nx/src/hasher/hash-plan-inspector");
(async () => {
  const graph = await createProjectGraphAsync();
  const inspector = new HashPlanInspector(graph);
  await inspector.init();
  console.log(JSON.stringify(inspector.inspectTask({ project: process.env.NX_INSPECT_PROJECT, target: process.env.NX_INSPECT_TARGET }), null, 2));
})().catch((error) => { console.error(error); process.exit(1); });
' | tee /tmp/plan.json
  local rc=${pipestatus[1]}
  (( rc == 0 )) && print 'Plan written to /tmp/plan.json'
  return $rc
}

wtclean() {
  local project=nx dry_run=false age_days=21 clean_all=false arg name wt_path branch mod_date
  local -a candidates dirs
  while (( $# )); do
    case "$1" in
      -h|--help) print 'Usage: wtclean [project] [--dry-run] [--days N] [--all]'; return 0 ;;
      --dry-run) dry_run=true; shift ;;
      --days) age_days=$2; shift 2 ;;
      --all) clean_all=true; shift ;;
      *) project=$1; shift ;;
    esac
  done
  local worktree_dir="$HOME/projects/$project-worktrees" repo_dir="$HOME/projects/$project"
  [[ -d $repo_dir/.git ]] || { print -u2 "Error: $repo_dir is not a git repository"; return 1; }
  [[ -d $worktree_dir ]] || { print -u2 "Error: $worktree_dir does not exist"; return 1; }
  git -C "$repo_dir" worktree prune
  if [[ $clean_all == true ]]; then
    dirs=("$worktree_dir"/*(/N))
  else
    dirs=("${(@f)$(find "$worktree_dir" -maxdepth 1 -type d -mtime +"$age_days" -not -name '.*' -not -path "$worktree_dir")}")
  fi
  for wt_path in "${dirs[@]}"; do candidates+=("${wt_path:t}"); done
  (( ${#candidates} )) || { print 'No worktrees to clean up.'; return 0; }
  print "Found ${#candidates} worktree(s) to clean in $worktree_dir:"
  for name in "${candidates[@]}"; do
    wt_path="$worktree_dir/$name"; branch=$(git -C "$wt_path" rev-parse --abbrev-ref HEAD 2>/dev/null)
    mod_date=$(stat -f '%Sm' -t '%Y-%m-%d' "$wt_path" 2>/dev/null || stat -c '%y' "$wt_path" 2>/dev/null | cut -d' ' -f1)
    [[ -n $branch ]] && print "  $name (branch: $branch, modified: $mod_date)" || print "  $name (modified: $mod_date)"
  done
  [[ $dry_run == true ]] && { print 'Dry run — no changes made.'; return 0; }
  local confirm
  read "confirm?Delete these ${#candidates} worktree(s)? [y/N] "
  [[ $confirm == [yY] ]] || { print 'Cancelled.'; return 0; }
  for name in "${candidates[@]}"; do
    wt_path="$worktree_dir/$name"; branch=$(git -C "$wt_path" rev-parse --abbrev-ref HEAD 2>/dev/null)
    if git -C "$repo_dir" worktree remove --force "$wt_path" 2>/dev/null; then print "  ✓ removed worktree $name"; else rm -rf "$wt_path"; print "  ✓ removed folder $name (was not a registered worktree)"; fi
    if [[ -n $branch && $branch != master && $branch != main && $branch != HEAD ]]; then git -C "$repo_dir" branch -D "$branch" 2>/dev/null && print "    ✓ deleted branch $branch" || print "    · branch $branch already gone or could not delete"; fi
  done
  git -C "$repo_dir" worktree prune
  print "Done. Removed ${#candidates} worktree(s)."
}

# RVM is natively compatible with Zsh; unlike Fish it does not need an
# environment-capture wrapper.
[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"

# Keep Kitty's tab title on the current directory, unless a Polygraph session
# pins it. Do not use kitty remote control inside tmux.
__kitty_set_tab_title() {
  [[ -n ${KITTY_WINDOW_ID:-} && -z ${TMUX:-} && -z ${__kitty_pinned_title:-} && $PWD != */tmp* ]] || return
  kitty @ set-tab-title "${PWD:t}"
}
chpwd_functions+=(__kitty_set_tab_title)
__kitty_set_tab_title
kitty-title-pin() {
  [[ -n ${KITTY_WINDOW_ID:-} && -z ${TMUX:-} ]] || return
  typeset -g __kitty_pinned_title=$1
  kitty @ set-tab-title "$1"
}
kitty-title-unpin() {
  unset __kitty_pinned_title
  __kitty_set_tab_title
}

__polygraph_slug_from_args() {
  local arg skip_next=false
  for arg in "$@"; do
    if [[ $skip_next == true ]]; then skip_next=false; continue; fi
    case "$arg" in
      -s|--session) skip_next=false; continue ;;
      -m|--multiplexer|--url|--account|--acct) skip_next=true ;;
      -*) ;;
      *) print "$arg"; return 0 ;;
    esac
  done
}
polygraph() {
  local want_pin=false slug ret
  if [[ -n ${KITTY_WINDOW_ID:-} && -z ${TMUX:-} && $1 == session && ( $2 == resume || $2 == start ) ]]; then want_pin=true; fi
  if [[ $want_pin == true && $2 == resume ]]; then slug=$(__polygraph_slug_from_args "${@:3}"); [[ -n $slug ]] && kitty-title-pin "$slug"; fi
  command polygraph "$@"; ret=$?
  if [[ $want_pin == true && -z ${__kitty_pinned_title:-} ]]; then slug=$(command polygraph session show --json 2>/dev/null | jq -r '.name // empty' 2>/dev/null); [[ -n $slug ]] && kitty-title-pin "$slug"; fi
  return $ret
}
px() { polygraph session start "$@"; }
