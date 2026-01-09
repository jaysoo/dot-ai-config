package components

import (
	"strings"

	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

// ModalResult is sent when modal is closed
type ModalResult struct {
	Cancelled bool
	Title     string
	Category  string
	Notes     string
}

// Modal represents a quick capture modal dialog
type Modal struct {
	Width      int
	Height     int
	Visible    bool
	titleInput textinput.Model
	notesInput textinput.Model
	categories []string
	selected   int
	focused    int // 0=title, 1=category, 2=notes, 3=buttons
}

// NewModal creates a new modal
func NewModal() *Modal {
	ti := textinput.New()
	ti.Placeholder = "Enter title..."
	ti.CharLimit = 100
	ti.Width = 40

	ni := textinput.New()
	ni.Placeholder = "Optional notes..."
	ni.CharLimit = 500
	ni.Width = 40

	return &Modal{
		Width:      50,
		Height:     15,
		Visible:    false,
		titleInput: ti,
		notesInput: ni,
		categories: []string{"Projects", "Areas", "Resources"},
		selected:   0,
		focused:    0,
	}
}

// Show displays the modal and focuses the title input
func (m *Modal) Show() tea.Cmd {
	m.Visible = true
	m.titleInput.Reset()
	m.notesInput.Reset()
	m.selected = 0
	m.focused = 0
	m.titleInput.Focus()
	return textinput.Blink
}

// Hide hides the modal
func (m *Modal) Hide() {
	m.Visible = false
	m.titleInput.Blur()
	m.notesInput.Blur()
}

// Update handles input for the modal
func (m *Modal) Update(msg tea.Msg) (*Modal, tea.Cmd) {
	if !m.Visible {
		return m, nil
	}

	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "esc":
			m.Hide()
			return m, func() tea.Msg {
				return ModalResult{Cancelled: true}
			}

		case "tab", "down":
			m.focused = (m.focused + 1) % 4
			m.updateFocus()
			return m, nil

		case "shift+tab", "up":
			m.focused = (m.focused + 3) % 4
			m.updateFocus()
			return m, nil

		case "left":
			if m.focused == 1 && m.selected > 0 {
				m.selected--
			}
			return m, nil

		case "right":
			if m.focused == 1 && m.selected < len(m.categories)-1 {
				m.selected++
			}
			return m, nil

		case "enter":
			if m.focused == 3 || m.titleInput.Value() != "" {
				// Submit
				m.Hide()
				return m, func() tea.Msg {
					return ModalResult{
						Cancelled: false,
						Title:     m.titleInput.Value(),
						Category:  m.categories[m.selected],
						Notes:     m.notesInput.Value(),
					}
				}
			}
			return m, nil
		}
	}

	// Update the focused input
	var cmd tea.Cmd
	if m.focused == 0 {
		m.titleInput, cmd = m.titleInput.Update(msg)
	} else if m.focused == 2 {
		m.notesInput, cmd = m.notesInput.Update(msg)
	}

	return m, cmd
}

func (m *Modal) updateFocus() {
	m.titleInput.Blur()
	m.notesInput.Blur()

	switch m.focused {
	case 0:
		m.titleInput.Focus()
	case 2:
		m.notesInput.Focus()
	}
}

// View renders the modal
func (m *Modal) View() string {
	if !m.Visible {
		return ""
	}

	// Styles
	modalStyle := lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(lipgloss.Color("#7AA2F7")).
		Padding(1, 2).
		Width(m.Width)

	titleStyle := lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("#FFFFFF")).
		MarginBottom(1)

	labelStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#888888"))

	selectedStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#7AA2F7")).
		Bold(true)

	unselectedStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#666666"))

	buttonStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#888888")).
		Padding(0, 2)

	activeButtonStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#000000")).
		Background(lipgloss.Color("#7AA2F7")).
		Padding(0, 2)

	var b strings.Builder

	// Title
	b.WriteString(titleStyle.Render("󰐕 New Item"))
	b.WriteString("\n\n")

	// Title input
	focusIndicator := " "
	if m.focused == 0 {
		focusIndicator = "▸"
	}
	b.WriteString(labelStyle.Render(focusIndicator + " Title:"))
	b.WriteString("\n")
	b.WriteString("  " + m.titleInput.View())
	b.WriteString("\n\n")

	// Category selector
	focusIndicator = " "
	if m.focused == 1 {
		focusIndicator = "▸"
	}
	b.WriteString(labelStyle.Render(focusIndicator + " Category:"))
	b.WriteString("\n  ")
	for i, cat := range m.categories {
		style := unselectedStyle
		prefix := "○ "
		if i == m.selected {
			style = selectedStyle
			prefix = "● "
		}
		b.WriteString(style.Render(prefix + cat))
		if i < len(m.categories)-1 {
			b.WriteString("  ")
		}
	}
	b.WriteString("\n\n")

	// Notes input
	focusIndicator = " "
	if m.focused == 2 {
		focusIndicator = "▸"
	}
	b.WriteString(labelStyle.Render(focusIndicator + " Notes (optional):"))
	b.WriteString("\n")
	b.WriteString("  " + m.notesInput.View())
	b.WriteString("\n\n")

	// Buttons
	cancelBtn := buttonStyle.Render("[Esc] Cancel")
	createBtn := buttonStyle.Render("[Enter] Create")
	if m.focused == 3 {
		createBtn = activeButtonStyle.Render("[Enter] Create")
	}
	b.WriteString("  " + cancelBtn + "  " + createBtn)

	return modalStyle.Render(b.String())
}
