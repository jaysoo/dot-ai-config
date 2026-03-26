function cnw
  # Options
  argparse 'h/help' 'r/release' 'n/name=' 'v/version=' 'p/preset=' 's/style=' 'd/directory' 'u/update' 'b/bundler' 'm/mf-ssr' -- $argv

  # For --release flag, need to know where Nx project is located
  set -q NX_DIRECTORY; or set NX_DIRECTORY "$HOME/projects/nx"

  if test $_flag_help; or test -z $_flag_version
    echo "Usage:"
    echo "  cnw --version <published version>                                       Create workspace"
    echo "  cnw --version <published version> --release                             Release then create workspace"
    echo "  cnw --version <published version> --preset=<preset>                     Create workspace using specified preset"
    echo "  cnw --version <published version> --preset=<preset> --name=<appName>    Create workspace using specified preset"
    echo "  cnw --version <published version> --preset=<preset> --mf-ssr            Create workspace with Module Federation + SSR setup"
    echo ""
    echo "Examples:"
    echo "  cnw -v 999.0.0 -r -p mono                         # release version 999.0.0 then create react-monorepo workspace"
    echo "  cnw -v 999.0.0 -p mono -n my-app                  # create workspace with custom appName"
    echo "  cnw -v 999.0.0 -p mono -m                         # create workspace with Module Federation + SSR in React"
    return
  end

  switch $_flag_preset
    case "monorepo"
      set _flag_preset "react-monorepo"
    case "mono"
      set _flag_preset "react-monorepo"
  end

  if test $_flag_release
    echo (set_color -o white -b cyan) "Publishing a Nx locally at version $_flag_version..." (set_color normal)
    cd $NX_DIRECTORY
    yarn nx-release $_flag_version --local
    cd -
  end

  # Defaults
  set -q _flag_preset; or set _flag_preset 'react-standalone'
  set -q _flag_style; or set _flag_style 'css'
  set ver (string replace -a '.' '-' $_flag_version)
  set preset (string replace -a '^react-' '' $_flag_preset)
  set -q _flag_name; or set _flag_name "$preset-$ver"
  set -q _flag_directory; or set _flag_directory '/tmp'
  set -q _flag_bundler; or set _flag_bundler 'vite'

  switch $_flag_preset
    case "*standalone"
      set appname $_flag_name
    case "*"
      set appname "demo"
  end

  echo (set_color -o white -b cyan) "Creating workspace $_flag_name with --preset=$_flag_preset at version $_flag_version" (set_color normal)

  cd "$_flag_directory"

  if test $_flag_update
    # nothing
  else
    npx -y create-nx-workspace@$_flag_version $_flag_name \
    --preset=$_flag_preset \
    --style=$_flag_style \
    --nxCloud=false \
    --bundler=$_flag_bundler \
    --appName=$appname
  end

  if test $_flag_mf_ssr
    echo "Setting up SSR..."
    cd $_flag_directory/$_flag_name
    npx nx g @nrwl/react:host shell --remotes=about --ssr --style=css
  end

  if test $status -eq 0
    echo (set_color -o white -b green) "Workspace created at $_flag_directory/$_flag_name" (set_color normal)
  else
    echo (set_color -o white -b red) "Failed to create workspace" (set_color normal)
  end
end
