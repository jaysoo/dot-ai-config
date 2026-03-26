function gcor
  set parts (string split -- ":" $argv)

  git remote get-url $parts[1] > /dev/null 2>&1

  if test $status -ne 0
    echo "Adding remote $parts[1]"
    git remote add $parts[1] git@github.com:$parts[1]/nx.git
  end

  echo "Fetching $parts[1] $parts[2]..."
  git fetch -q $parts[1] $parts[2] > /dev/null

  echo "Checkout $parts[2]"
  git checkout $parts[2] > /dev/null
  git reset --hard $parts[1]/$parts[2] > /dev/null

  echo "Done!"
end
