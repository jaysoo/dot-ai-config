package components

import (
	"fmt"
	"strings"

	"github.com/jack/para-tui/internal/para"

	"github.com/charmbracelet/lipgloss"
)

// Sidebar represents the category sidebar
type Sidebar struct {
	Categories  []para.Category
	Selected    int
	Expanded    map[int]bool        // Track which categories are expanded
	Width       int
	Height      int
	Focused     bool
	SubItems    map[int][]para.Item // Cached sub-items for expanded categories
	SelectedSub map[int]int         // Selected sub-item index per category
	InSubMenu   bool                // Whether we're navigating sub-items
}

// NewSidebar creates a new sidebar
func NewSidebar() *Sidebar {
	return &Sidebar{
		Categories:  para.DefaultCategories(),
		Selected:    0,
		Expanded:    make(map[int]bool),
		Width:       20,
		Height:      20,
		Focused:     true,
		SubItems:    make(map[int][]para.Item),
		SelectedSub: make(map[int]int),
		InSubMenu:   false,
	}
}

// SetSize sets the sidebar dimensions
func (s *Sidebar) SetSize(width, height int) {
	s.Width = width
	s.Height = height
}

// MoveUp moves selection up through the flattened list
func (s *Sidebar) MoveUp() {
	if s.InSubMenu {
		if s.SelectedSub[s.Selected] > 0 {
			// Move to previous sub-item
			s.SelectedSub[s.Selected]--
		} else {
			// At first sub-item, go back to category header
			s.InSubMenu = false
		}
	} else {
		if s.Selected > 0 {
			// Move to previous category
			s.Selected--
			// If that category is expanded, jump to its last sub-item
			if s.Expanded[s.Selected] && len(s.SubItems[s.Selected]) > 0 {
				s.InSubMenu = true
				s.SelectedSub[s.Selected] = len(s.SubItems[s.Selected]) - 1
			}
		}
	}
}

// MoveDown moves selection down through the flattened list
func (s *Sidebar) MoveDown() {
	if s.InSubMenu {
		items := s.SubItems[s.Selected]
		if s.SelectedSub[s.Selected] < len(items)-1 {
			// Move to next sub-item
			s.SelectedSub[s.Selected]++
		} else {
			// At last sub-item, move to next category
			s.InSubMenu = false
			if s.Selected < len(s.Categories)-1 {
				s.Selected++
			}
		}
	} else {
		// On a category header
		if s.Expanded[s.Selected] && len(s.SubItems[s.Selected]) > 0 {
			// Category is expanded, enter its sub-items
			s.InSubMenu = true
			s.SelectedSub[s.Selected] = 0
		} else if s.Selected < len(s.Categories)-1 {
			// Move to next category
			s.Selected++
		}
	}
}

// Toggle expands/collapses the current category
func (s *Sidebar) Toggle() {
	s.Expanded[s.Selected] = !s.Expanded[s.Selected]
	if !s.Expanded[s.Selected] {
		s.InSubMenu = false
	}
}

// JumpTo jumps to a specific category (0-indexed)
func (s *Sidebar) JumpTo(index int) {
	if index >= 0 && index < len(s.Categories) {
		s.Selected = index
		s.InSubMenu = false
	}
}

// SelectedCategory returns the currently selected category
func (s *Sidebar) SelectedCategory() para.Category {
	return s.Categories[s.Selected]
}

// SelectedPath returns the path of the currently selected item
func (s *Sidebar) SelectedPath() string {
	cat := s.Categories[s.Selected]
	if s.InSubMenu {
		items := s.SubItems[s.Selected]
		if len(items) > 0 && s.SelectedSub[s.Selected] < len(items) {
			return items[s.SelectedSub[s.Selected]].Path
		}
	}
	return cat.Path
}

// View renders the sidebar
func (s *Sidebar) View() string {
	var b strings.Builder

	// Styles
	titleStyle := lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("#FFFFFF"))

	categoryStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#888888"))

	selectedStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#FFFFFF")).
		Bold(true)

	focusedStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#7AA2F7")).
		Bold(true)

	subItemStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#666666")).
		PaddingLeft(2)

	subSelectedStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#9ECE6A")).
		PaddingLeft(2)

	// Title - always at top
	b.WriteString(titleStyle.Render("PARA"))
	b.WriteString("\n\n")

	// Render all categories and their sub-items
	for i, cat := range s.Categories {
		prefix := "  "
		style := categoryStyle

		if i == s.Selected && !s.InSubMenu {
			prefix = "▸ "
			if s.Focused {
				style = focusedStyle
			} else {
				style = selectedStyle
			}
		}

		// Show expand indicator
		expandIcon := ""
		if s.Expanded[i] {
			expandIcon = " ▼"
		}

		line := fmt.Sprintf("%s%s %s%s", prefix, cat.Icon, cat.Name, expandIcon)
		b.WriteString(style.Render(line))
		b.WriteString("\n")

		// Show sub-items if expanded
		if s.Expanded[i] {
			items := s.SubItems[i]
			for j, item := range items {
				subPrefix := "  "
				subStyle := subItemStyle

				if s.InSubMenu && i == s.Selected && j == s.SelectedSub[i] {
					subPrefix = "▸ "
					if s.Focused {
						subStyle = subSelectedStyle
					}
				}

				// Icon based on type
				icon := ""
				if item.IsTodo {
					icon = "📌 "
				} else if item.IsFolder {
					icon = "📁 "
				}

				name := item.Name
				// Truncate long names
				maxLen := s.Width - 8
				if len(name) > maxLen && maxLen > 1 {
					name = name[:maxLen-1] + "…"
				}

				// Show stale indicator
				staleIndicator := ""
				if item.IsStale {
					staleIndicator = " ⚠"
				}

				b.WriteString(subStyle.Render(fmt.Sprintf("%s%s%s%s", subPrefix, icon, name, staleIndicator)))
				b.WriteString("\n")
			}
		}
	}

	return b.String()
}
