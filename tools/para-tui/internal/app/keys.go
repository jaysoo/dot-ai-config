package app

import "github.com/charmbracelet/bubbles/key"

// KeyMap defines all keybindings for the application
type KeyMap struct {
	// Navigation
	Up       key.Binding
	Down     key.Binding
	Left     key.Binding
	Right    key.Binding
	Top      key.Binding
	Bottom   key.Binding
	PageUp   key.Binding
	PageDown key.Binding

	// Actions
	Enter    key.Binding
	Edit     key.Binding
	New      key.Binding
	Archive  key.Binding
	Restore  key.Binding
	Delete   key.Binding
	Refresh  key.Binding
	Yank     key.Binding
	YankPath key.Binding
	Search   key.Binding
	Back     key.Binding

	// Category jumps
	JumpProjects  key.Binding
	JumpAreas     key.Binding
	JumpResources key.Binding
	JumpArchive   key.Binding

	// Global
	Help     key.Binding
	Quit     key.Binding
	Tab      key.Binding
	ShiftTab key.Binding
	Home     key.Binding
}

// DefaultKeyMap returns the default keybindings
func DefaultKeyMap() KeyMap {
	return KeyMap{
		Up: key.NewBinding(
			key.WithKeys("k", "up"),
			key.WithHelp("k/↑", "up"),
		),
		Down: key.NewBinding(
			key.WithKeys("j", "down"),
			key.WithHelp("j/↓", "down"),
		),
		Left: key.NewBinding(
			key.WithKeys("h", "left"),
			key.WithHelp("h/←", "left"),
		),
		Right: key.NewBinding(
			key.WithKeys("l", "right"),
			key.WithHelp("l/→", "right"),
		),
		Top: key.NewBinding(
			key.WithKeys("g", "home"),
			key.WithHelp("g", "top"),
		),
		Bottom: key.NewBinding(
			key.WithKeys("G", "end"),
			key.WithHelp("G", "bottom"),
		),
		PageUp: key.NewBinding(
			key.WithKeys("ctrl+u", "pgup"),
			key.WithHelp("ctrl+u", "page up"),
		),
		PageDown: key.NewBinding(
			key.WithKeys("ctrl+d", "pgdown"),
			key.WithHelp("ctrl+d", "page down"),
		),
		Enter: key.NewBinding(
			key.WithKeys("enter"),
			key.WithHelp("enter", "open"),
		),
		Edit: key.NewBinding(
			key.WithKeys("e"),
			key.WithHelp("e", "edit"),
		),
		New: key.NewBinding(
			key.WithKeys("n"),
			key.WithHelp("n", "new"),
		),
		Archive: key.NewBinding(
			key.WithKeys("a"),
			key.WithHelp("a", "archive"),
		),
		Restore: key.NewBinding(
			key.WithKeys("R"),
			key.WithHelp("R", "restore"),
		),
		Delete: key.NewBinding(
			key.WithKeys("d"),
			key.WithHelp("d", "delete"),
		),
		Refresh: key.NewBinding(
			key.WithKeys("r"),
			key.WithHelp("r", "refresh"),
		),
		Yank: key.NewBinding(
			key.WithKeys("y"),
			key.WithHelp("y", "copy"),
		),
		YankPath: key.NewBinding(
			key.WithKeys("Y"),
			key.WithHelp("Y", "copy path"),
		),
		Search: key.NewBinding(
			key.WithKeys("/"),
			key.WithHelp("/", "search"),
		),
		Back: key.NewBinding(
			key.WithKeys("esc"),
			key.WithHelp("esc", "back"),
		),
		JumpProjects: key.NewBinding(
			key.WithKeys("1"),
			key.WithHelp("1", "projects"),
		),
		JumpAreas: key.NewBinding(
			key.WithKeys("2"),
			key.WithHelp("2", "areas"),
		),
		JumpResources: key.NewBinding(
			key.WithKeys("3"),
			key.WithHelp("3", "resources"),
		),
		JumpArchive: key.NewBinding(
			key.WithKeys("4"),
			key.WithHelp("4", "archive"),
		),
		Help: key.NewBinding(
			key.WithKeys("?"),
			key.WithHelp("?", "help"),
		),
		Quit: key.NewBinding(
			key.WithKeys("q", "ctrl+c"),
			key.WithHelp("q", "quit"),
		),
		Tab: key.NewBinding(
			key.WithKeys("tab"),
			key.WithHelp("tab", "next pane"),
		),
		ShiftTab: key.NewBinding(
			key.WithKeys("shift+tab"),
			key.WithHelp("S-tab", "prev pane"),
		),
		Home: key.NewBinding(
			key.WithKeys("H"),
			key.WithHelp("H", "home"),
		),
	}
}
