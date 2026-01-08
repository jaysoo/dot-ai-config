package app

import (
	"fmt"
	"os"
	"os/exec"
	"strings"

	"github.com/jack/para-tui/internal/components"
	"github.com/jack/para-tui/internal/para"

	"github.com/charmbracelet/bubbles/key"
	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

// Pane represents which pane is focused
type Pane int

const (
	PaneSidebar Pane = iota
	PaneContent
	PanePreview
)

// ViewMode represents the current view
type ViewMode int

const (
	ViewHome ViewMode = iota
	ViewBrowse
)

// Model is the main application model
type Model struct {
	// Core
	paraDir string
	loader  *para.Loader
	keys    KeyMap

	// UI State
	width       int
	height      int
	focusedPane Pane
	viewMode    ViewMode

	// Components
	sidebar   *components.Sidebar
	editInput textinput.Model

	// Content state
	currentPath  string
	pathHistory  []string // Stack of previous paths for back navigation
	items        []para.Item
	selectedIdx  int
	scrollOffset int    // Scroll offset for content pane
	previewText  string
	previewFile  string // Path to file being previewed (for editing)

	// Home dashboard
	projects        []para.ProjectItem
	completed       []para.CompletedItem
	homeSelectedIdx int

	// Edit mode
	editMode    bool
	editingFile string // Path to file being edited
	editStatus  string // Status message for edit operation

	// Flags
	showHelp bool
	quitting bool
}

// New creates a new application model
func New(paraDir string) Model {
	loader := para.NewLoader(paraDir)
	sidebar := components.NewSidebar()

	// Load initial sub-items for each category
	for i, cat := range sidebar.Categories {
		if cat.Path == "_home" {
			// Home has no sub-items
			sidebar.SubItems[i] = nil
		} else if cat.Path == "para/projects" {
			// Projects - include TODOs
			items := loader.LoadProjectItems(21)
			sidebar.SubItems[i] = items
			sidebar.Counts[i] = len(items)
		} else if cat.Path == "para/archive" {
			// Archive - show months
			sidebar.SubItems[i] = loader.LoadArchiveMonths()
		} else {
			items, _ := loader.LoadItems(cat.Path)
			sidebar.SubItems[i] = items
		}
	}

	// Initialize edit input
	ti := textinput.New()
	ti.Placeholder = "Describe the changes you want..."
	ti.CharLimit = 500
	ti.Width = 60

	// Load projects for dashboard (21 days = 3 weeks stale threshold)
	projects := loader.GetAllProjects(21)

	// Load completed items for archive
	completed := loader.GetCompletedItems()

	// Get initial content
	initialPath := sidebar.SelectedPath()
	items, _ := loader.LoadItems(initialPath)

	m := Model{
		paraDir:     paraDir,
		loader:      loader,
		keys:        DefaultKeyMap(),
		sidebar:     sidebar,
		editInput:   ti,
		focusedPane: PaneSidebar,
		viewMode:    ViewHome, // Start in home mode
		projects:    projects,
		completed:   completed,
		currentPath: initialPath,
		items:       items,
	}

	return m
}

// editResultMsg is sent when Claude edit completes
type editResultMsg struct {
	content string
	err     error
}

// Init initializes the model
func (m Model) Init() tea.Cmd {
	return nil
}

// Update handles messages
func (m Model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	// Handle edit result
	if msg, ok := msg.(editResultMsg); ok {
		if msg.err != nil {
			m.editStatus = fmt.Sprintf("Error: %v", msg.err)
		} else {
			// Write the updated content to file
			fullPath := m.loader.RootDir + "/" + m.editingFile
			err := writeFile(fullPath, msg.content)
			if err != nil {
				m.editStatus = fmt.Sprintf("Error saving: %v", err)
			} else {
				m.editStatus = "File updated successfully!"
				m.updatePreview() // Refresh preview
			}
		}
		m.editMode = false
		m.editInput.Reset()
		return m, nil
	}

	// Handle edit mode input
	if m.editMode {
		switch msg := msg.(type) {
		case tea.KeyMsg:
			switch msg.String() {
			case "enter":
				// Execute Claude edit
				prompt := m.editInput.Value()
				if prompt != "" {
					m.editStatus = "Calling Claude..."
					return m, m.executeClaudeEdit(prompt)
				}
			case "esc":
				// Cancel edit mode
				m.editMode = false
				m.editInput.Reset()
				m.editStatus = ""
				return m, nil
			}
		}
		// Update text input
		var cmd tea.Cmd
		m.editInput, cmd = m.editInput.Update(msg)
		return m, cmd
	}

	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height

		// Distribute width: sidebar 20%, content 40%, preview 40%
		sidebarWidth := m.width / 5
		if sidebarWidth < 20 {
			sidebarWidth = 20
		}
		if sidebarWidth > 30 {
			sidebarWidth = 30
		}
		m.sidebar.SetSize(sidebarWidth, m.height-4)

		return m, nil

	case tea.KeyMsg:
		// Global keys
		switch {
		case key.Matches(msg, m.keys.Quit):
			m.quitting = true
			return m, tea.Quit

		case key.Matches(msg, m.keys.Help):
			m.showHelp = !m.showHelp
			return m, nil

		case key.Matches(msg, m.keys.Tab):
			// Cycle forward through panes
			m.focusedPane = (m.focusedPane + 1) % 3
			m.sidebar.Focused = m.focusedPane == PaneSidebar
			return m, nil

		case key.Matches(msg, m.keys.ShiftTab):
			// Cycle backward through panes
			m.focusedPane = (m.focusedPane + 2) % 3 // +2 is same as -1 mod 3
			m.sidebar.Focused = m.focusedPane == PaneSidebar
			return m, nil

		case key.Matches(msg, m.keys.Home):
			// Go to home dashboard
			m.viewMode = ViewHome
			m.projects = m.loader.GetAllProjects(21)
			m.homeSelectedIdx = 0
			return m, nil

		case key.Matches(msg, m.keys.JumpProjects):
			m.viewMode = ViewBrowse
			m.sidebar.JumpTo(1) // Index 1 = Projects (Home is 0)
			m.updateContent()
			return m, nil

		case key.Matches(msg, m.keys.JumpAreas):
			m.viewMode = ViewBrowse
			m.sidebar.JumpTo(2) // Index 2 = Areas
			m.updateContent()
			return m, nil

		case key.Matches(msg, m.keys.JumpResources):
			m.viewMode = ViewBrowse
			m.sidebar.JumpTo(3) // Index 3 = Resources
			m.updateContent()
			return m, nil

		case key.Matches(msg, m.keys.JumpArchive):
			m.viewMode = ViewBrowse
			m.sidebar.JumpTo(4) // Index 4 = Archive
			m.updateContent()
			return m, nil
		}

		// Pane-specific keys
		if m.focusedPane == PaneSidebar {
			switch {
			case key.Matches(msg, m.keys.Up):
				m.sidebar.MoveUp()
				m.viewMode = ViewBrowse // Switch to browse when navigating sidebar
				m.updateContent()
				return m, nil

			case key.Matches(msg, m.keys.Down):
				m.sidebar.MoveDown()
				m.viewMode = ViewBrowse // Switch to browse when navigating sidebar
				m.updateContent()
				return m, nil

			case key.Matches(msg, m.keys.Enter):
				// Check if Home is selected
				if m.sidebar.SelectedCategory().Path == "_home" && !m.sidebar.InSubMenu {
					m.viewMode = ViewHome
					m.projects = m.loader.GetAllProjects(21)
					m.homeSelectedIdx = 0
					m.focusedPane = PaneContent
					m.sidebar.Focused = false
					return m, nil
				}
				// Toggle expand/collapse on category, or focus content pane if on sub-item
				if !m.sidebar.InSubMenu {
					m.sidebar.Toggle()
					m.updateContent()
				} else {
					// On sub-item - focus content pane
					m.focusedPane = PaneContent
					m.sidebar.Focused = false
				}
				return m, nil

			case key.Matches(msg, m.keys.Right):
				// Right arrow - focus content pane
				m.focusedPane = PaneContent
				m.sidebar.Focused = false
				return m, nil

			case key.Matches(msg, m.keys.Left), key.Matches(msg, m.keys.Back):
				if m.sidebar.InSubMenu {
					m.sidebar.InSubMenu = false
				} else if m.sidebar.Expanded[m.sidebar.Selected] {
					m.sidebar.Expanded[m.sidebar.Selected] = false
				}
				m.updateContent()
				return m, nil
			}
		} else if m.focusedPane == PaneContent {
			// Home view content navigation
			if m.viewMode == ViewHome {
				switch {
				case key.Matches(msg, m.keys.Up):
					if m.homeSelectedIdx > 0 {
						m.homeSelectedIdx--
					}
					return m, nil

				case key.Matches(msg, m.keys.Down):
					if m.homeSelectedIdx < len(m.projects)-1 {
						m.homeSelectedIdx++
					}
					return m, nil

				case key.Matches(msg, m.keys.Left), key.Matches(msg, m.keys.Back):
					m.focusedPane = PaneSidebar
					m.sidebar.Focused = true
					return m, nil

				case key.Matches(msg, m.keys.Enter):
					// Jump to selected project if it's a folder
					if m.homeSelectedIdx < len(m.projects) {
						proj := m.projects[m.homeSelectedIdx]
						if proj.IsFolder && proj.Path != "" {
							// Navigate to the project folder
							m.sidebar.JumpTo(1) // Projects category (index 1, Home is 0)
							m.sidebar.Expanded[1] = true
							m.sidebar.InSubMenu = true
							for i, subItem := range m.sidebar.SubItems[1] {
								if subItem.Path == proj.Path {
									m.sidebar.SelectedSub[1] = i
									break
								}
							}
							m.viewMode = ViewBrowse
							m.updateContent()
						}
						// TODO items just show details in preview
					}
					return m, nil

				case key.Matches(msg, m.keys.Archive):
					// Archive the selected project
					if m.homeSelectedIdx < len(m.projects) {
						proj := m.projects[m.homeSelectedIdx]
						var err error
						if proj.IsFolder {
							err = m.loader.ArchiveProjectFolder(proj.Path)
						} else {
							err = m.loader.ArchiveTodoItem(proj.Name)
						}
						if err != nil {
							m.editStatus = fmt.Sprintf("Archive error: %v", err)
						} else {
							m.editStatus = "Archived!"
							// Refresh projects list
							m.projects = m.loader.GetAllProjects(21)
							// Refresh sidebar counts
							m.updateSidebarCounts()
							if m.homeSelectedIdx >= len(m.projects) {
								m.homeSelectedIdx = len(m.projects) - 1
							}
							if m.homeSelectedIdx < 0 {
								m.homeSelectedIdx = 0
							}
						}
					}
					return m, nil

				case key.Matches(msg, m.keys.Edit):
					// Edit the selected project
					if m.homeSelectedIdx < len(m.projects) {
						proj := m.projects[m.homeSelectedIdx]
						m.editMode = true
						if proj.IsFolder {
							m.editingFile = proj.Path + "/README.md"
						} else {
							m.editingFile = "TODO.md" // Edit entire TODO.md for TODO items
						}
						m.editInput.Focus()
						m.editStatus = ""
						return m, textinput.Blink
					}
					return m, nil
				}
				return m, nil
			}

			// Browse view content navigation
			switch {
			case key.Matches(msg, m.keys.Up):
				if m.selectedIdx > 0 {
					m.selectedIdx--
					m.ensureSelectedVisible()
					m.updatePreview()
				}
				return m, nil

			case key.Matches(msg, m.keys.Down):
				if m.selectedIdx < len(m.items)-1 {
					m.selectedIdx++
					m.ensureSelectedVisible()
					m.updatePreview()
				}
				return m, nil

			case key.Matches(msg, m.keys.Left), key.Matches(msg, m.keys.Back):
				// If we have path history, go back up
				if len(m.pathHistory) > 0 {
					// Pop from history
					prevPath := m.pathHistory[len(m.pathHistory)-1]
					m.pathHistory = m.pathHistory[:len(m.pathHistory)-1]
					m.currentPath = prevPath

					// Reload items for the previous path
					if prevPath == "_home" {
						m.items = m.loader.LoadProjectItems(21)
					} else if strings.HasPrefix(prevPath, "ARCHIVE_MONTH:") {
						month := strings.TrimPrefix(prevPath, "ARCHIVE_MONTH:")
						m.items = m.loader.LoadArchiveItemsForMonth(month)
					} else if prevPath == "para/archive" {
						m.items = m.loader.LoadArchiveMonths()
					} else {
						items, err := m.loader.LoadItems(prevPath)
						if err == nil {
							m.items = items
						}
					}
					m.selectedIdx = 0
					m.scrollOffset = 0
					m.updatePreview()
					return m, nil
				}
				// No history - go to sidebar
				m.focusedPane = PaneSidebar
				m.sidebar.Focused = true
				return m, nil

			case key.Matches(msg, m.keys.Right):
				// Right arrow always moves to preview pane
				m.focusedPane = PanePreview
				return m, nil

			case key.Matches(msg, m.keys.Enter):
				// Enter drills into expandable items, or focuses preview for leaf items
				if len(m.items) > 0 && m.selectedIdx < len(m.items) {
					item := m.items[m.selectedIdx]

					// Check if this is an expandable item
					if item.IsFolder || strings.HasPrefix(item.Path, "ARCHIVE_MONTH:") {
						// Push current path to history before drilling in
						m.pathHistory = append(m.pathHistory, m.currentPath)

						// Drill into the folder/month
						if strings.HasPrefix(item.Path, "ARCHIVE_MONTH:") {
							// Load items for this archive month
							month := strings.TrimPrefix(item.Path, "ARCHIVE_MONTH:")
							m.currentPath = item.Path
							m.items = m.loader.LoadArchiveItemsForMonth(month)
							m.selectedIdx = 0
							m.scrollOffset = 0
							m.updatePreview()
						} else {
							// Navigate into the folder
							m.currentPath = item.Path
							items, err := m.loader.LoadItems(item.Path)
							if err == nil {
								m.items = items
								m.selectedIdx = 0
								m.scrollOffset = 0
								m.updatePreview()
							}
						}
						return m, nil
					}
				}
				// Leaf item - focus preview pane
				m.focusedPane = PanePreview
				return m, nil

			case key.Matches(msg, m.keys.Edit):
				// Enter edit mode if there's a file being previewed (not in archive)
				if m.previewFile != "" && !m.isArchiveContext() {
					m.editMode = true
					m.editingFile = m.previewFile
					m.editInput.Focus()
					m.editStatus = ""
					return m, textinput.Blink
				}
				return m, nil

			case key.Matches(msg, m.keys.Restore):
				// Restore archived item back to projects/TODO
				if m.isArchiveContext() && len(m.items) > 0 && m.selectedIdx < len(m.items) {
					item := m.items[m.selectedIdx]
					var err error
					if strings.HasPrefix(item.Path, "COMPLETED:") {
						// Restore to TODO.md
						completedText := strings.TrimPrefix(item.Path, "COMPLETED:")
						err = m.loader.RestoreCompletedItem(completedText)
					} else if item.IsFolder && strings.HasPrefix(item.Path, "para/archive/") {
						// Restore folder to para/projects
						err = m.loader.RestoreArchivedFolder(item.Path)
					}

					if err != nil {
						m.editStatus = fmt.Sprintf("Restore failed: %v", err)
					} else {
						m.editStatus = "Item restored!"
						// Refresh the view
						m.updateSidebarCounts()
						m.updateContent()
					}
				}
				return m, nil
			}
		} else if m.focusedPane == PanePreview {
			switch {
			case key.Matches(msg, m.keys.Left), key.Matches(msg, m.keys.Back):
				m.focusedPane = PaneContent
				return m, nil

			case key.Matches(msg, m.keys.Edit):
				// Enter edit mode if there's a file being previewed (not in archive)
				if m.previewFile != "" && !m.isArchiveContext() {
					m.editMode = true
					m.editingFile = m.previewFile
					m.editInput.Focus()
					m.editStatus = ""
					return m, textinput.Blink
				}
				return m, nil
			}
		}
	}

	return m, nil
}

// executeClaudeEdit runs claude to edit the file
func (m *Model) executeClaudeEdit(prompt string) tea.Cmd {
	return func() tea.Msg {
		// Read current file content
		content, err := m.loader.ReadFile(m.editingFile)
		if err != nil {
			return editResultMsg{err: err}
		}

		// Build the prompt for Claude
		fullPrompt := fmt.Sprintf(`Given this markdown file content:

<file>
%s
</file>

Make these changes: %s

Output ONLY the updated file content, no explanation or markdown code blocks. Just the raw updated content.`, content, prompt)

		// Execute claude command
		cmd := exec.Command("claude", "-p", fullPrompt)
		output, err := cmd.Output()
		if err != nil {
			return editResultMsg{err: fmt.Errorf("claude error: %w", err)}
		}

		return editResultMsg{content: string(output)}
	}
}

// writeFile writes content to a file
func writeFile(path string, content string) error {
	return os.WriteFile(path, []byte(content), 0644)
}

// updateContent updates the content pane based on sidebar selection
func (m *Model) updateContent() {
	path := m.sidebar.SelectedPath()
	m.currentPath = path
	m.pathHistory = nil // Clear history when navigating from sidebar

	// Check if this is the Home category
	if path == "_home" {
		// Home shows projects (TODOs + project folders) in content pane
		m.items = m.loader.LoadProjectItems(21)
		m.selectedIdx = 0
		m.scrollOffset = 0
		m.updatePreview()
		return
	}

	// Check if this is a TODO item (path starts with "TODO:")
	if strings.HasPrefix(path, "TODO:") {
		// TODO items don't have sub-items, show the task itself
		todoText := strings.TrimPrefix(path, "TODO:")
		m.items = nil
		m.selectedIdx = 0
		// Find the TODO details from the projects list
		for _, proj := range m.projects {
			if !proj.IsFolder && proj.Name == todoText {
				var details strings.Builder
				details.WriteString("📌 Quick Task\n\n")
				details.WriteString(proj.Name)
				if len(proj.Details) > 0 {
					details.WriteString("\n\nDetails:\n")
					for _, d := range proj.Details {
						details.WriteString("  • " + d + "\n")
					}
				}
				m.previewText = details.String()
				m.previewFile = "TODO.md"
				return
			}
		}
		m.previewText = "📌 Quick Task\n\n" + todoText
		m.previewFile = "TODO.md"
		return
	}

	// Check if this is a COMPLETED item (path starts with "COMPLETED:")
	if strings.HasPrefix(path, "COMPLETED:") {
		// Completed items show the task details
		completedText := strings.TrimPrefix(path, "COMPLETED:")
		m.items = nil
		m.selectedIdx = 0
		// Find the completed details
		for _, c := range m.completed {
			if c.Text == completedText {
				var details strings.Builder
				details.WriteString("✅ Completed Task\n\n")
				details.WriteString(c.Text)
				if c.Date != "" {
					details.WriteString(fmt.Sprintf(" (%s)", c.Date))
				}
				if c.Month != "" {
					details.WriteString(fmt.Sprintf("\nMonth: %s", c.Month))
				}
				if len(c.Details) > 0 {
					details.WriteString("\n\nDetails:\n")
					for _, d := range c.Details {
						details.WriteString("  • " + d + "\n")
					}
				}
				m.previewText = details.String()
				m.previewFile = "para/archive/COMPLETED.md"
				return
			}
		}
		m.previewText = "✅ Completed Task\n\n" + completedText
		m.previewFile = "para/archive/COMPLETED.md"
		return
	}

	// Check if this is the Projects category - show TODOs + project folders
	if path == "para/projects" {
		m.items = m.loader.LoadProjectItems(21)
		m.selectedIdx = 0
		m.scrollOffset = 0
		m.updatePreview()
		return
	}

	// Check if this is the Archive category - show months
	if path == "para/archive" {
		m.items = m.loader.LoadArchiveMonths()
		m.selectedIdx = 0
		m.scrollOffset = 0
		m.updatePreview()
		return
	}

	// Check if this is an archive month - show items for that month
	if strings.HasPrefix(path, "ARCHIVE_MONTH:") {
		month := strings.TrimPrefix(path, "ARCHIVE_MONTH:")
		m.items = m.loader.LoadArchiveItemsForMonth(month)
		m.selectedIdx = 0
		m.scrollOffset = 0
		m.updatePreview()
		return
	}

	items, err := m.loader.LoadItems(path)
	if err != nil {
		m.items = nil
		m.previewText = fmt.Sprintf("Error loading: %v", err)
		return
	}

	m.items = items
	m.selectedIdx = 0
	m.scrollOffset = 0
	m.updatePreview()
}

// updatePreview updates the preview pane based on selected item
func (m *Model) updatePreview() {
	if len(m.items) == 0 {
		// Check for special paths that don't need file reading
		if m.currentPath == "_home" || strings.HasPrefix(m.currentPath, "TODO:") || strings.HasPrefix(m.currentPath, "COMPLETED:") || strings.HasPrefix(m.currentPath, "ARCHIVE_MONTH:") {
			return // Preview already set
		}
		// Try to read README from current path
		readmePath := m.currentPath + "/README.md"
		content, err := m.loader.ReadREADME(m.currentPath)
		if err != nil {
			m.previewText = "No README.md found"
			m.previewFile = ""
		} else {
			m.previewText = content
			m.previewFile = readmePath
		}
		return
	}

	item := m.items[m.selectedIdx]

	// Handle TODO items (from TODO.md)
	if item.IsTodo && strings.HasPrefix(item.Path, "TODO:") {
		todoText := item.Name
		// Find the TODO details from the projects list
		for _, proj := range m.projects {
			if !proj.IsFolder && proj.Name == todoText {
				var details strings.Builder
				details.WriteString("📌 Quick Task\n\n")
				details.WriteString(proj.Name)
				if proj.DaysOld > 0 {
					details.WriteString(fmt.Sprintf(" (%d days old)", proj.DaysOld))
				}
				if len(proj.Details) > 0 {
					details.WriteString("\n\nDetails:\n")
					for _, d := range proj.Details {
						details.WriteString("  • " + d + "\n")
					}
				}
				m.previewText = details.String()
				m.previewFile = "TODO.md"
				return
			}
		}
		m.previewText = "📌 Quick Task\n\n" + todoText
		m.previewFile = "TODO.md"
		return
	}

	// Handle COMPLETED items (from COMPLETED.md)
	if item.IsTodo && strings.HasPrefix(item.Path, "COMPLETED:") {
		completedText := item.Name
		// Find the completed details
		for _, c := range m.completed {
			if c.Text == completedText {
				var details strings.Builder
				details.WriteString("✅ Completed Task\n\n")
				details.WriteString(c.Text)
				if c.Date != "" {
					details.WriteString(fmt.Sprintf(" (%s)", c.Date))
				}
				if c.Month != "" {
					details.WriteString(fmt.Sprintf("\nMonth: %s", c.Month))
				}
				if len(c.Details) > 0 {
					details.WriteString("\n\nDetails:\n")
					for _, d := range c.Details {
						details.WriteString("  • " + d + "\n")
					}
				}
				m.previewText = details.String()
				m.previewFile = "para/archive/COMPLETED.md"
				return
			}
		}
		m.previewText = "✅ Completed Task\n\n" + completedText
		m.previewFile = "para/archive/COMPLETED.md"
		return
	}

	// Handle ARCHIVE_MONTH items (month groupings)
	if strings.HasPrefix(item.Path, "ARCHIVE_MONTH:") {
		month := strings.TrimPrefix(item.Path, "ARCHIVE_MONTH:")
		items := m.loader.LoadArchiveItemsForMonth(month)
		m.previewText = fmt.Sprintf("📅 %s\n\n%d archived items", month, len(items))
		m.previewFile = ""
		return
	}

	if item.IsFolder {
		// Read README from folder
		readmePath := item.Path + "/README.md"
		content, err := m.loader.ReadREADME(item.Path)
		if err != nil {
			m.previewText = fmt.Sprintf("No README.md in %s", item.Name)
			m.previewFile = ""
		} else {
			m.previewText = content
			m.previewFile = readmePath
		}
	} else {
		// Read file content
		content, err := m.loader.ReadFile(item.Path)
		if err != nil {
			m.previewText = fmt.Sprintf("Error reading: %v", err)
			m.previewFile = ""
		} else {
			m.previewText = content
			m.previewFile = item.Path
		}
	}
}

// ensureSelectedVisible adjusts scrollOffset to keep selected item visible
func (m *Model) ensureSelectedVisible() {
	// Estimate visible height (will be refined during render)
	visibleHeight := m.height - 10 // Rough estimate accounting for borders, header, etc.
	if visibleHeight < 5 {
		visibleHeight = 5
	}

	// If selected is above visible area, scroll up
	if m.selectedIdx < m.scrollOffset {
		m.scrollOffset = m.selectedIdx
	}

	// If selected is below visible area, scroll down
	if m.selectedIdx >= m.scrollOffset+visibleHeight {
		m.scrollOffset = m.selectedIdx - visibleHeight + 1
	}

	// Ensure scrollOffset is not negative
	if m.scrollOffset < 0 {
		m.scrollOffset = 0
	}
}

// isArchiveContext returns true if currently viewing archive content (not editable/archivable)
func (m *Model) isArchiveContext() bool {
	return strings.HasPrefix(m.currentPath, "para/archive") ||
		strings.HasPrefix(m.currentPath, "ARCHIVE_MONTH:") ||
		strings.HasPrefix(m.currentPath, "COMPLETED:")
}

// updateSidebarCounts refreshes the project count in sidebar
func (m *Model) updateSidebarCounts() {
	// Update Projects count (index 1)
	for i, cat := range m.sidebar.Categories {
		if cat.Path == "para/projects" {
			items := m.loader.LoadProjectItems(21)
			m.sidebar.SubItems[i] = items
			m.sidebar.Counts[i] = len(items)
			break
		}
	}
}

// View renders the UI
func (m Model) View() string {
	if m.quitting {
		return ""
	}

	// Calculate pane widths
	sidebarWidth := m.sidebar.Width
	remainingWidth := m.width - sidebarWidth - 4 // 4 for borders
	contentWidth := remainingWidth / 2
	previewWidth := remainingWidth - contentWidth

	// Styles
	borderColor := lipgloss.Color("#444444")
	focusBorderColor := lipgloss.Color("#7AA2F7")

	sidebarBorder := borderColor
	contentBorder := borderColor
	previewBorder := borderColor

	switch m.focusedPane {
	case PaneSidebar:
		sidebarBorder = focusBorderColor
	case PaneContent:
		contentBorder = focusBorderColor
	case PanePreview:
		previewBorder = focusBorderColor
	}

	paneHeight := m.height - 4
	if paneHeight < 3 {
		paneHeight = 3
	}
	innerHeight := paneHeight - 2 // Account for border
	if innerHeight < 1 {
		innerHeight = 1
	}

	// Calculate inner widths (accounting for borders)
	sidebarInnerWidth := sidebarWidth - 2
	if sidebarInnerWidth < 1 {
		sidebarInnerWidth = 1
	}
	contentInnerWidth := contentWidth - 2
	if contentInnerWidth < 1 {
		contentInnerWidth = 1
	}
	previewInnerWidth := previewWidth - 2
	if previewInnerWidth < 1 {
		previewInnerWidth = 1
	}

	// Render content for each pane
	sidebarContent := m.sidebar.View()
	var contentView, previewView string
	if m.viewMode == ViewHome {
		contentView = m.renderHomeContent(contentInnerWidth, innerHeight)
		previewView = m.renderHomePreview(previewInnerWidth, innerHeight)
	} else {
		contentView = m.renderContent(contentInnerWidth, innerHeight)
		previewView = m.renderPreview(previewInnerWidth, innerHeight)
	}

	// Normalize all panes to same height by truncating/padding
	sidebarPlaced := normalizeHeight(sidebarContent, innerHeight, sidebarInnerWidth)
	contentPlaced := normalizeHeight(contentView, innerHeight, contentInnerWidth)
	previewPlaced := normalizeHeight(previewView, innerHeight, previewInnerWidth)

	sidebarStyle := lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(sidebarBorder)

	contentStyle := lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(contentBorder)

	previewStyle := lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(previewBorder)

	// Compose panes horizontally
	panes := lipgloss.JoinHorizontal(
		lipgloss.Top,
		sidebarStyle.Render(sidebarPlaced),
		contentStyle.Render(contentPlaced),
		previewStyle.Render(previewPlaced),
	)

	// Header
	headerStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#7AA2F7")).
		Bold(true)

	pathStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#888888"))

	var header string
	if m.viewMode == ViewHome {
		header = headerStyle.Render("PARA Manager") + pathStyle.Render(" > Home")
	} else {
		header = headerStyle.Render("PARA Manager")
		if m.currentPath != "" {
			header += pathStyle.Render(" > " + m.currentPath)
		}
	}

	// Footer with keybindings
	footerStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#666666"))

	var footer string
	if m.isArchiveContext() {
		// Show restore option for archived items
		footer = footerStyle.Render("j/k:move  Enter:open  R:restore  tab:pane  1-4:jump  H:home  q:quit")
	} else if m.viewMode == ViewHome {
		footer = footerStyle.Render("j/k:move  Enter:open  e:edit  a:archive  1-4:jump  H:home  q:quit")
	} else {
		footer = footerStyle.Render("j/k:move  Enter:open  e:edit  a:archive  tab:pane  1-4:jump  H:home  q:quit")
	}

	// Compose full view
	mainView := lipgloss.JoinVertical(
		lipgloss.Left,
		header,
		panes,
		footer,
	)

	// If in edit mode, overlay the edit modal
	if m.editMode {
		modalStyle := lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(lipgloss.Color("#7AA2F7")).
			Padding(1, 2).
			Width(70)

		titleStyle := lipgloss.NewStyle().
			Bold(true).
			Foreground(lipgloss.Color("#7AA2F7")).
			MarginBottom(1)

		statusStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#9ECE6A")).
			MarginTop(1)

		modalContent := titleStyle.Render("Edit: "+m.editingFile) + "\n\n" +
			m.editInput.View() + "\n" +
			statusStyle.Render(m.editStatus) + "\n\n" +
			lipgloss.NewStyle().Foreground(lipgloss.Color("#666666")).Render("Enter: submit  Esc: cancel")

		modal := modalStyle.Render(modalContent)

		// Center the modal
		modalPlaced := lipgloss.Place(
			m.width,
			m.height,
			lipgloss.Center,
			lipgloss.Center,
			modal,
		)

		return modalPlaced
	}

	return mainView
}

// renderContent renders the content pane
func (m Model) renderContent(width, height int) string {
	// Check if this is a TODO item
	if strings.HasPrefix(m.currentPath, "TODO:") {
		todoText := strings.TrimPrefix(m.currentPath, "TODO:")
		titleStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#9ECE6A")).
			Bold(true)
		taskStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#CCCCCC"))
		detailStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#888888"))

		var b strings.Builder
		b.WriteString(titleStyle.Render("📌 Quick Task"))
		b.WriteString("\n\n")
		b.WriteString(taskStyle.Render(todoText))
		b.WriteString("\n")

		// Find and show details
		for _, proj := range m.projects {
			if !proj.IsFolder && proj.Name == todoText && len(proj.Details) > 0 {
				b.WriteString("\n")
				b.WriteString(detailStyle.Render("Details:"))
				b.WriteString("\n")
				for _, d := range proj.Details {
					b.WriteString(detailStyle.Render("  • " + d))
					b.WriteString("\n")
				}
				break
			}
		}
		return b.String()
	}

	// Check if this is a COMPLETED item
	if strings.HasPrefix(m.currentPath, "COMPLETED:") {
		completedText := strings.TrimPrefix(m.currentPath, "COMPLETED:")
		titleStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#9ECE6A")).
			Bold(true)
		taskStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#CCCCCC"))
		detailStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#888888"))

		var b strings.Builder
		b.WriteString(titleStyle.Render("✅ Completed Task"))
		b.WriteString("\n\n")
		b.WriteString(taskStyle.Render(completedText))
		b.WriteString("\n")

		// Find and show details
		for _, c := range m.completed {
			if c.Text == completedText {
				if c.Date != "" {
					b.WriteString(detailStyle.Render(fmt.Sprintf("\nCompleted: %s", c.Date)))
					b.WriteString("\n")
				}
				if c.Month != "" {
					b.WriteString(detailStyle.Render(fmt.Sprintf("Month: %s", c.Month)))
					b.WriteString("\n")
				}
				if len(c.Details) > 0 {
					b.WriteString("\n")
					b.WriteString(detailStyle.Render("Details:"))
					b.WriteString("\n")
					for _, d := range c.Details {
						b.WriteString(detailStyle.Render("  • " + d))
						b.WriteString("\n")
					}
				}
				break
			}
		}
		return b.String()
	}

	if len(m.items) == 0 {
		emptyStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#666666")).
			Italic(true)
		return emptyStyle.Render("No items")
	}

	var b strings.Builder
	itemStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#888888"))
	selectedStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#FFFFFF")).Bold(true)
	focusedStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#7AA2F7")).Bold(true)
	scrollIndicatorStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#565F89"))
	fileIcon := "󰈙 "

	// Calculate visible range with scrolling
	visibleHeight := height - 2 // Leave room for scroll indicators
	startIdx := m.scrollOffset
	endIdx := startIdx + visibleHeight
	if endIdx > len(m.items) {
		endIdx = len(m.items)
	}

	// Show "more above" indicator
	if startIdx > 0 {
		b.WriteString(scrollIndicatorStyle.Render(fmt.Sprintf("  ↑ %d more above", startIdx)))
		b.WriteString("\n")
		visibleHeight-- // One less line for items
	}

	for i := startIdx; i < endIdx && i-startIdx < visibleHeight; i++ {
		item := m.items[i]

		prefix := "  "
		style := itemStyle
		if i == m.selectedIdx {
			prefix = "▸ "
			if m.focusedPane == PaneContent {
				style = focusedStyle
			} else {
				style = selectedStyle
			}
		}

		icon := fileIcon
		suffix := ""
		staleIndicator := ""
		if item.IsTodo {
			// Distinguish between TODO items and COMPLETED items
			if strings.HasPrefix(item.Path, "COMPLETED:") {
				icon = "✅ "
			} else {
				icon = "📌 "
			}
			if item.IsStale {
				staleIndicator = " ⚠"
			}
		} else if item.IsFolder {
			// Archive months get calendar icon
			if strings.HasPrefix(item.Path, "ARCHIVE_MONTH:") {
				icon = "📅 "
			} else {
				icon = "📁 "
				suffix = "/"
			}
			if item.IsStale {
				staleIndicator = " ⚠"
			}
		}

		name := item.Name + suffix + staleIndicator
		// Truncate long names
		maxLen := width - 8
		if len(name) > maxLen && maxLen > 1 {
			name = name[:maxLen-1] + "…"
		}

		line := fmt.Sprintf("%s%s%s", prefix, icon, name)
		b.WriteString(style.Render(line))
		b.WriteString("\n")
	}

	// Show "more below" indicator
	remaining := len(m.items) - endIdx
	if remaining > 0 {
		b.WriteString(scrollIndicatorStyle.Render(fmt.Sprintf("  ↓ %d more below", remaining)))
		b.WriteString("\n")
	}

	return b.String()
}

// normalizeHeight ensures content has exactly the specified number of lines
func normalizeHeight(content string, height, width int) string {
	// Guard against invalid dimensions
	if height <= 0 {
		height = 1
	}
	if width <= 0 {
		width = 1
	}

	lines := strings.Split(content, "\n")

	// Truncate if too many lines
	if len(lines) > height {
		lines = lines[:height]
	}

	// Pad if too few lines
	emptyLine := strings.Repeat(" ", width)
	for len(lines) < height {
		lines = append(lines, emptyLine)
	}

	return strings.Join(lines, "\n")
}

// renderPreview renders the preview pane (plain text for now)
func (m Model) renderPreview(width, height int) string {
	if m.previewText == "" {
		emptyStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#666666")).
			Italic(true)
		return emptyStyle.Render("Select an item to preview")
	}

	// Ensure valid dimensions
	maxLines := height - 2
	if maxLines < 1 {
		maxLines = 1
	}

	// Simple plain text preview (glamour disabled for debugging)
	previewStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#CCCCCC")).
		Width(width - 2)

	lines := strings.Split(m.previewText, "\n")
	if len(lines) > maxLines {
		lines = lines[:maxLines]
		lines = append(lines, "...")
	}

	return previewStyle.Render(strings.Join(lines, "\n"))
}

// ASCII art raccoon coder ready to get stuff done
const homeBanner = `    ╭─────────────────────────╮
    │   ∧_∧  LET'S GO!       │
    │  (◕‿◕)っ               │
    │  /    つ☕              │
    │ (  /  )                │
    ╰─────────────────────────╯`

// renderHomeContent renders the home dashboard content pane (unified projects list)
func (m Model) renderHomeContent(width, height int) string {
	var b strings.Builder

	itemStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#888888"))
	selectedStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#7AA2F7")).Bold(true)
	focusedStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#7AA2F7")).Bold(true)
	titleStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#9ECE6A")).Bold(true)
	staleStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#F7768E"))
	freshStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#666666"))
	bannerStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#7AA2F7"))

	// Banner
	b.WriteString(bannerStyle.Render(homeBanner))
	b.WriteString("\n\n")
	b.WriteString(titleStyle.Render("Projects"))
	b.WriteString("\n\n")

	if len(m.projects) == 0 {
		emptyStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#666666")).
			Italic(true)
		b.WriteString(emptyStyle.Render("No projects"))
		b.WriteString("\n")
		return b.String()
	}

	for i, proj := range m.projects {
		if i >= height-4 {
			b.WriteString(itemStyle.Render(fmt.Sprintf("... +%d more", len(m.projects)-i)))
			break
		}

		prefix := "  "
		style := itemStyle
		if i == m.homeSelectedIdx {
			prefix = "▸ "
			if m.focusedPane == PaneContent {
				style = focusedStyle
			} else {
				style = selectedStyle
			}
		}

		// Icon: 📌 for quick tasks (TODOs), 📁 for project folders
		icon := "📌 "
		if proj.IsFolder {
			icon = "📁 "
		}

		name := proj.Name
		maxLen := width - 12
		if maxLen > 0 && len(name) > maxLen {
			name = name[:maxLen-1] + "…"
		}

		// Age indicator
		var ageStr string
		if proj.DaysOld == 0 {
			ageStr = freshStyle.Render("today")
		} else if proj.IsStale {
			ageStr = staleStyle.Render(fmt.Sprintf("%dd ⚠", proj.DaysOld))
		} else {
			ageStr = freshStyle.Render(fmt.Sprintf("%dd", proj.DaysOld))
		}

		line := fmt.Sprintf("%s%s%s %s", prefix, icon, name, ageStr)
		b.WriteString(style.Render(line))
		b.WriteString("\n")
	}

	return b.String()
}

// renderHomePreview renders preview for selected project
func (m Model) renderHomePreview(width, height int) string {
	if len(m.projects) == 0 || m.homeSelectedIdx >= len(m.projects) {
		emptyStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color("#666666")).
			Italic(true)
		return emptyStyle.Render("No projects")
	}

	proj := m.projects[m.homeSelectedIdx]

	var content string
	if proj.IsFolder {
		// Read the README for project folder
		var err error
		content, err = m.loader.ReadREADME(proj.Path)
		if err != nil {
			return fmt.Sprintf("No README in %s", proj.Name)
		}
	} else {
		// Show TODO details
		var b strings.Builder
		b.WriteString(fmt.Sprintf("Task: %s\n\n", proj.Name))
		if len(proj.Details) > 0 {
			b.WriteString("Details:\n")
			for _, d := range proj.Details {
				b.WriteString(fmt.Sprintf("  • %s\n", d))
			}
		}
		content = b.String()
	}

	// Ensure valid dimensions
	maxLines := height - 2
	if maxLines < 1 {
		maxLines = 1
	}

	// Simple plain text preview
	lines := strings.Split(content, "\n")
	if len(lines) > maxLines {
		lines = lines[:maxLines]
		lines = append(lines, "...")
	}

	return strings.Join(lines, "\n")
}
