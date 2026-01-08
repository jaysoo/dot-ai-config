package main

import (
	"fmt"
	"os"

	"github.com/jack/para-tui/internal/app"

	tea "github.com/charmbracelet/bubbletea"
)

func main() {
	// Default PARA directory
	paraDir := os.Getenv("PARA_DIR")
	if paraDir == "" {
		home, err := os.UserHomeDir()
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error getting home directory: %v\n", err)
			os.Exit(1)
		}
		paraDir = home + "/projects/dot-ai-config/dot_ai"
	}

	// Check if PARA directory exists
	if _, err := os.Stat(paraDir); os.IsNotExist(err) {
		fmt.Fprintf(os.Stderr, "PARA directory not found: %s\n", paraDir)
		fmt.Fprintf(os.Stderr, "Set PARA_DIR environment variable or create ~/.ai/para\n")
		os.Exit(1)
	}

	p := tea.NewProgram(
		app.New(paraDir),
		tea.WithAltScreen(),
		tea.WithMouseCellMotion(),
	)

	if _, err := p.Run(); err != nil {
		fmt.Fprintf(os.Stderr, "Error running program: %v\n", err)
		os.Exit(1)
	}
}
