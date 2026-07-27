// auth-proxy: one binary installed under ~/.local/bin as both `gh` and `op`.
//
// It exists so credential use is auditable without asking agents (or humans) to
// remember anything: every auth-relevant invocation is appended to the Raycast
// log, then the real Homebrew binary takes over via exec. `gh auth token` is
// refused outright so a token can never be printed.
package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"syscall"
	"time"
)

// Raycast reads this path (scripts/raycast/op-requests.sh).
const logPath = "/private/tmp/op_requests.txt"

// Where the real binaries live. The proxy sits in ~/.local/bin, which precedes
// these on PATH, so they never point back at us.
var realDirs = []string{
	"/opt/homebrew/bin", // Apple Silicon Homebrew
	"/usr/local/bin",    // Intel Homebrew
}

// Subcommands that never reach a vault or mint a credential. Logging these
// would bury the entries that matter.
// Matched against args[0] verbatim, so a flag's value can never be mistaken for
// a subcommand and silence the log.
var quiet = map[string]bool{
	"": true, "help": true, "completion": true, "version": true,
	"signin": true, "signout": true, "whoami": true,
	"--version": true, "-v": true, "--help": true, "-h": true,
}

func main() {
	tool := filepath.Base(os.Args[0])
	args := os.Args[1:]

	if tool == "gh" && isAuthToken(args) {
		// Record the attempt: a refused exfiltration is the most interesting
		// thing this log can hold, so it must not vanish silently.
		logRequest("BLOCKED "+tool, args)
		fmt.Fprintln(os.Stderr, "gh auth token is blocked: printing auth tokens is disabled.")
		fmt.Fprintln(os.Stderr, "Use `gh auth status` to check auth, or 1Password for credentials.")
		os.Exit(1)
	}

	if !quiet[subcommand(args)] {
		logRequest(tool, args)
	}

	real := findReal(tool)
	if real == "" {
		fmt.Fprintf(os.Stderr, "auth-proxy: could not locate the real %s binary.\n", tool)
		os.Exit(127)
	}

	// Hand off completely: exact exit code, tty, and signal behavior.
	if err := syscall.Exec(real, append([]string{real}, args...), os.Environ()); err != nil {
		fmt.Fprintf(os.Stderr, "auth-proxy: failed to exec %s: %v\n", real, err)
		os.Exit(126)
	}
}

// logRequest appends one tab-separated line: timestamp, cwd, command. Logging
// is best-effort — a broken log must never block the underlying command.
func logRequest(tool string, args []string) {
	f, err := os.OpenFile(logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o600)
	if err != nil {
		return
	}
	defer f.Close()

	cwd, _ := os.Getwd()
	cmd := tool
	if len(args) > 0 {
		cmd += " " + strings.Join(args, " ")
	}
	// Keep the record on one line so the reader can split on tabs.
	fmt.Fprintf(f, "%s\t%s\t%s\n",
		time.Now().Format("2006-01-02T15:04:05-0700"), cwd, sanitize(cmd))
}

// sanitize flattens anything that would break the one-record-per-line format.
func sanitize(s string) string {
	return strings.NewReplacer("\t", " ", "\n", " ", "\r", " ").Replace(s)
}

// subcommand returns args[0] verbatim. It deliberately does not scan past a
// flag: a flag's value (`op --account personal read ...`) would otherwise be
// read as the subcommand and could silence the log.
func subcommand(args []string) string {
	if len(args) == 0 {
		return ""
	}
	return args[0]
}

// isAuthToken reports whether this invocation could make gh print a token.
//
// It fails closed: a bare `auth` followed anywhere by a bare `token` is refused.
// Pairing the first two positionals looks tighter but is not — in
// `gh auth --hostname github.com token` the flag's value lands in the second
// positional slot, so that check passes the command through while real gh still
// parses it as `auth token` and prints the credential. Matching whole words also
// keeps `gh auth login --with-token` working, since `--with-token` is not `token`.
func isAuthToken(args []string) bool {
	seenAuth := false
	for _, a := range args {
		switch {
		case a == "auth":
			seenAuth = true
		case a == "token" && seenAuth:
			return true
		}
	}
	return false
}

// findReal locates the genuine binary, skipping any candidate that resolves
// back to this proxy.
func findReal(tool string) string {
	self, _ := os.Executable()
	self, _ = filepath.EvalSymlinks(self)
	for _, dir := range realDirs {
		c := filepath.Join(dir, tool)
		resolved, err := filepath.EvalSymlinks(c)
		if err != nil {
			continue
		}
		if resolved == self {
			continue
		}
		return c
	}
	return ""
}
