function workon
  switch $argv
    case 'console'
      cd ~/projects/nx-console
    case 'console-ext'
      cd ~/projects/angular-console-nrwl-extensions 
    case 'nx'
      cd ~/projects/nx
    case 'nxl'
      cd ~/projects/nx-labs
    case 'brew'
      cd ~/projects/homebrew-nx
    case 'book'
      cd ~/books/nx-react-book
    case 'book-ex'
      cd ~/books/nx-react-book-example
    case 'ocean'
      cd ~/projects/ocean
    case 'acme'
      cd ~/projects/acme
    case 'challenge'
      cd ~/projects/nrwl-challenge
    case '*'
      echo 'Project not found'
  end
end
