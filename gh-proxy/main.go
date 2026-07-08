// gh-proxy: thin wrapper around the real Homebrew `gh`.
// Blocks `gh auth token` so generated tokens can't be printed, forwards
// everything else transparently (exec replaces this process).
package main

import (
	"fmt"
	"os"
	"path/filepath"
	"syscall"
)

// Candidate locations for the real gh, in priority order. The proxy itself
// lives in ~/.local/bin, so these never point back at us.
var realGHCandidates = []string{
	"/opt/homebrew/bin/gh", // Apple Silicon Homebrew
	"/usr/local/bin/gh",    // Intel Homebrew
}

func main() {
	if blocked(os.Args[1:]) {
		fmt.Fprintln(os.Stderr, "gh auth token is blocked by gh-proxy: printing auth tokens is disabled.")
		fmt.Fprintln(os.Stderr, "Use `gh auth status` to check auth, or 1Password for credentials.")
		os.Exit(1)
	}

	realGH := findRealGH()
	if realGH == "" {
		fmt.Fprintln(os.Stderr, "gh-proxy: could not locate the real gh binary (checked Homebrew paths).")
		os.Exit(127)
	}

	// Replace this process with the real gh: exact exit code, tty, signals.
	argv := append([]string{realGH}, os.Args[1:]...)
	if err := syscall.Exec(realGH, argv, os.Environ()); err != nil {
		fmt.Fprintf(os.Stderr, "gh-proxy: failed to exec %s: %v\n", realGH, err)
		os.Exit(126)
	}
}

// blocked reports whether the first two positional (non-flag) args are
// "auth" "token". gh's global flags don't take confusable values, so scanning
// for the first two non-dash tokens is sufficient.
func blocked(args []string) bool {
	var pos []string
	for _, a := range args {
		if len(a) > 0 && a[0] == '-' {
			continue
		}
		pos = append(pos, a)
		if len(pos) == 2 {
			break
		}
	}
	return len(pos) == 2 && pos[0] == "auth" && pos[1] == "token"
}

func findRealGH() string {
	self, _ := os.Executable()
	self, _ = filepath.EvalSymlinks(self)
	for _, c := range realGHCandidates {
		resolved, err := filepath.EvalSymlinks(c)
		if err != nil {
			continue
		}
		if resolved == self { // never recurse into ourselves
			continue
		}
		return c
	}
	return ""
}
