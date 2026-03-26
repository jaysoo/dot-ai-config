function acme
  # Options
  argparse 'h/help' 'n/name=' 'v/version=' 'p/preset=' 'd/directory' -- $argv

  if test $_flag_help
    echo "Usage: acme --version <locally published version>"
    return
  end

  # Defaults
  set -q _flag_preset; or set _flag_preset 'react-standalone'
  set -q _flag_name; or set _flag_name "acme$_flag_version"
  set -q _flag_directory; or set _flag_directory '/tmp'

  echo (set_color -o white -b cyan) "Creating workspace at $_flag_directory/$_flag_name with --preset=$_flag_preset at version $_flag_version" (set_color normal)

  cd "$_flag_directory"

  npx -y create-nx-workspace@$_flag_version \
    $_flag_name \
    --preset=$_flag_preset \
    --style=css \
    --nxCloud=false \
    --appName=acme$_flag_version

  if test $status -eq 0
    echo (set_color -o white -b green) "Workspace created at $_flag_directory$_flag_name" (set_color normal)
  else
    echo (set_color -o white -b red) "Failed to create workspace" (set_color normal)
  end
end
