// Command polygraph is a simplified clone of the Polygraph multi-repo session
// picker. `polygraph session start` opens a TUI to choose which known repos to
// pull into the current session; the chosen repos are printed on confirm.
package main

import (
	"fmt"
	"os"

	tea "github.com/charmbracelet/bubbletea"

	"github.com/jack/polygraph/internal/app"
	"github.com/jack/polygraph/internal/data"
)

func main() {
	initiator := "ocean"
	args := os.Args[1:]

	// Skip the `session start` verb if present so both `polygraph` and
	// `polygraph session start` work.
	if len(args) >= 1 && args[0] == "session" {
		args = args[1:]
	}
	if len(args) >= 1 && args[0] == "start" {
		args = args[1:]
	}

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "-h", "--help":
			usage()
			return
		case "-i", "--initiator":
			if i+1 < len(args) {
				initiator = args[i+1]
				i++
			}
		}
	}

	repos := data.Sample()
	if data.Find(repos, initiator) == nil {
		fmt.Fprintf(os.Stderr, "polygraph: unknown initiator repo %q\n", initiator)
		os.Exit(1)
	}

	final, err := tea.NewProgram(app.New(repos, initiator), tea.WithAltScreen()).Run()
	if err != nil {
		fmt.Fprintln(os.Stderr, "polygraph:", err)
		os.Exit(1)
	}

	m := final.(app.Model)
	if !m.Confirmed() {
		fmt.Println("Session cancelled.")
		return
	}

	chosen := m.SelectedRepos()
	fmt.Printf("Session started with %d repo(s):\n", len(chosen))
	for _, name := range chosen {
		fmt.Printf("  • %s\n", name)
	}
}

func usage() {
	fmt.Print(`polygraph — simplified multi-repo session picker

Usage:
  polygraph session start [flags]
  polygraph [flags]

Flags:
  -i, --initiator <repo>   repo to start the session from (default "ocean")
  -h, --help               show this help

Keys (in picker):
  up/k, down/j   move        <space>  toggle repo
  /              filter      <enter>  confirm
  <esc>          cancel
`)
}
