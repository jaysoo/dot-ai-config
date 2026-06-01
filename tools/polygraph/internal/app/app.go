// Package app implements the Polygraph repo picker shown by
// `polygraph session start`: a checklist of known repos on the left and a live
// dependency graph of the current selection on the right.
package app

import (
	"sort"
	"strings"

	"github.com/charmbracelet/bubbles/key"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"

	"github.com/jack/polygraph/internal/data"
	"github.com/jack/polygraph/internal/graph"
)

// Model is the Bubble Tea model for the picker.
type Model struct {
	repos     []data.Repo
	initiator string
	selected  map[string]bool

	cursor    int      // index into the visible (filtered) list
	filtering bool     // true while typing a filter
	filter    string   // current filter text
	keys      keyMap
	width     int
	height    int

	confirmed bool // user pressed enter
	quit      bool // user pressed esc / ctrl+c
}

// New builds the initial model with the initiator repo pre-selected.
func New(repos []data.Repo, initiator string) Model {
	return Model{
		repos:     repos,
		initiator: initiator,
		selected:  map[string]bool{initiator: true},
		keys:      defaultKeys(),
	}
}

// Confirmed reports whether the user accepted the selection.
func (m Model) Confirmed() bool { return m.confirmed }

// SelectedRepos returns the chosen repo names in display order.
func (m Model) SelectedRepos() []string {
	var out []string
	for _, r := range m.repos {
		if m.selected[r.Name] {
			out = append(out, r.Name)
		}
	}
	return out
}

func (m Model) Init() tea.Cmd { return nil }

// visible returns the repo names that match the current filter, in display order.
func (m Model) visible() []string {
	var out []string
	f := strings.ToLower(m.filter)
	for _, r := range m.repos {
		if f == "" || strings.Contains(strings.ToLower(r.Name), f) {
			out = append(out, r.Name)
		}
	}
	return out
}

func (m Model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.width, m.height = msg.Width, msg.Height
		return m, nil

	case tea.KeyMsg:
		if m.filtering {
			return m.updateFiltering(msg)
		}
		return m.updateNormal(msg)
	}
	return m, nil
}

func (m Model) updateFiltering(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	switch msg.Type {
	case tea.KeyEnter, tea.KeyEsc:
		m.filtering = false
		m.cursor = 0
	case tea.KeyBackspace:
		if len(m.filter) > 0 {
			m.filter = m.filter[:len(m.filter)-1]
		}
	case tea.KeyRunes, tea.KeySpace:
		m.filter += string(msg.Runes)
	}
	return m, nil
}

func (m Model) updateNormal(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	vis := m.visible()
	switch {
	case key.Matches(msg, m.keys.Up):
		if m.cursor > 0 {
			m.cursor--
		}
	case key.Matches(msg, m.keys.Down):
		if m.cursor < len(vis)-1 {
			m.cursor++
		}
	case key.Matches(msg, m.keys.Toggle):
		if m.cursor < len(vis) {
			name := vis[m.cursor]
			if name != m.initiator { // initiator can't be removed
				m.selected[name] = !m.selected[name]
			}
		}
	case key.Matches(msg, m.keys.Filter):
		m.filtering = true
	case key.Matches(msg, m.keys.Confirm):
		m.confirmed = true
		return m, tea.Quit
	case key.Matches(msg, m.keys.Cancel):
		m.quit = true
		return m, tea.Quit
	}
	if msg.Type == tea.KeyCtrlC {
		m.quit = true
		return m, tea.Quit
	}
	return m, nil
}

// bands computes the dependents/selected/dependencies node sets and the edges
// between them for the current selection.
func (m Model) bands() (dependents, selected, dependencies []string, up, down []graph.Edge) {
	sel := map[string]bool{}
	for _, r := range m.repos {
		if m.selected[r.Name] {
			selected = append(selected, r.Name)
			sel[r.Name] = true
		}
	}

	depSet := map[string]bool{}
	depcSet := map[string]bool{}
	for _, r := range m.repos {
		for _, dep := range r.DependsOn {
			// r depends on dep.
			if sel[dep] && !sel[r.Name] {
				// r is a dependent of a selected repo.
				up = append(up, graph.Edge{From: dep, To: r.Name})
				depSet[r.Name] = true
			}
			if sel[r.Name] && !sel[dep] {
				// dep is a dependency of a selected repo.
				down = append(down, graph.Edge{From: r.Name, To: dep})
				depcSet[dep] = true
			}
		}
	}
	dependents = keys(depSet)
	dependencies = keys(depcSet)
	return
}

func keys(m map[string]bool) []string {
	out := make([]string, 0, len(m))
	for k := range m {
		out = append(out, k)
	}
	sort.Strings(out)
	return out
}

// --- view -----------------------------------------------------------------

var (
	titleStyle    = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("231"))
	cursorStyle   = lipgloss.NewStyle().Foreground(lipgloss.Color("215"))
	selRowStyle   = lipgloss.NewStyle().Foreground(lipgloss.Color("215")).Bold(true)
	dimStyle      = lipgloss.NewStyle().Foreground(lipgloss.Color("245"))
	hintStyle     = lipgloss.NewStyle().Foreground(lipgloss.Color("244"))
	sidebarBorder = lipgloss.NewStyle().Border(lipgloss.NormalBorder(), false, true, false, false).
			BorderForeground(lipgloss.Color("238")).Padding(0, 2, 0, 1)
)

func (m Model) View() string {
	if m.confirmed || m.quit {
		return ""
	}
	w, h := m.width, m.height
	if w == 0 {
		w, h = 110, 32
	}

	sidebarW := 34
	graphW := w - sidebarW - 4

	sidebar := m.renderSidebar(h - 4)
	body := lipgloss.JoinHorizontal(lipgloss.Top,
		sidebarBorder.Height(h-4).Render(sidebar),
		m.renderGraph(graphW, h-4),
	)

	footer := m.renderFooter(w)
	return lipgloss.JoinVertical(lipgloss.Left, body, footer)
}

func (m Model) renderSidebar(height int) string {
	var b strings.Builder
	b.WriteString(titleStyle.Render("Select repositories"))
	b.WriteString("\n\n")

	vis := m.visible()
	for i, name := range vis {
		check := "[ ]"
		if m.selected[name] {
			check = "[x]"
		}
		label := name
		if name == m.initiator {
			label += " (initiator)"
		}

		row := check + " " + label
		switch {
		case i == m.cursor:
			b.WriteString(cursorStyle.Render("❯ " + row))
		case m.selected[name]:
			b.WriteString("  " + selRowStyle.Render(row))
		default:
			b.WriteString("  " + dimStyle.Render(row))
		}
		b.WriteString("\n")
	}

	if m.filtering || m.filter != "" {
		b.WriteString("\n")
		b.WriteString(hintStyle.Render("filter: " + m.filter + cursorIf(m.filtering)))
	}
	return b.String()
}

func cursorIf(on bool) string {
	if on {
		return "▏"
	}
	return ""
}

func (m Model) renderGraph(width, height int) string {
	dependents, selected, dependencies, up, down := m.bands()
	return graph.Render(width, height, dependents, selected, dependencies, up, down)
}

func (m Model) renderFooter(width int) string {
	help := strings.Join([]string{
		m.keys.Up.Help().Key + " " + m.keys.Up.Help().Desc,
		m.keys.Down.Help().Key + " " + m.keys.Down.Help().Desc,
		m.keys.Toggle.Help().Key + " " + m.keys.Toggle.Help().Desc,
		m.keys.Confirm.Help().Key + " " + m.keys.Confirm.Help().Desc,
		m.keys.Filter.Help().Key + " " + m.keys.Filter.Help().Desc,
		m.keys.Cancel.Help().Key + " " + m.keys.Cancel.Help().Desc,
	}, ", ")

	note := "Initiator repo is pre-selected and cannot be removed."
	return "\n" + hintStyle.Render(help+".") + "\n" + hintStyle.Render(note)
}
