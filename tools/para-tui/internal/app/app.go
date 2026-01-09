package app

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/jack/para-tui/internal/components"
	"github.com/jack/para-tui/internal/para"

	"github.com/atotto/clipboard"
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
	modal     *components.Modal
	editInput textinput.Model

	// Content state
	currentPath         string
	pathHistory         []string // Stack of previous paths for back navigation
	items               []para.Item
	selectedIdx         int
	scrollOffset        int    // Scroll offset for content pane
	previewText         string
	previewFile         string // Path to file being previewed (for editing)
	previewScrollOffset int    // Scroll offset for preview pane

	// Home dashboard
	projects         []para.ProjectItem
	recentFiles      []para.RecentFile
	completed        []para.CompletedItem
	homeSelectedIdx  int
	homeSection      int // 0 = projects, 1 = recent files
	homeScrollOffset int // Scroll offset for home content

	// Edit mode
	editMode        bool
	editingFile     string // Path to file being edited
	editingTodoItem string // For TODO items, the specific item text being edited
	editStatus      string // Status message for edit operation

	// Vim-style gg tracking
	lastKeyG    bool  // Was the last key 'g'?

	// Claude expansion state
	claudeWorking     bool
	editClaudeWorking bool              // For edit mode Claude calls
	claudeStatusChan  chan claudeUpdate // Channel for real-time Claude updates
	pendingCategory   string
	pendingTitle      string
	pendingNotes      string

	// Flags
	showHelp bool
	quitting bool
}

// ClaudeResultMsg is sent when Claude finishes expanding notes
type ClaudeResultMsg struct {
	ExpandedNotes string
	Error         error
}

// New creates a new application model
func New(paraDir string) Model {
	loader := para.NewLoader(paraDir)
	sidebar := components.NewSidebar()
	modal := components.NewModal()

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

	// Load recent files (top 10)
	recentFiles := loader.GetRecentFiles(10)

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
		modal:       modal,
		editInput:   ti,
		focusedPane: PaneSidebar,
		viewMode:    ViewHome, // Start in home mode
		projects:    projects,
		recentFiles: recentFiles,
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

// claudeUpdate is sent through the channel for real-time updates
type claudeUpdate struct {
	Status string // Status message to display
	Done   bool   // True when Claude is finished
	Result string // Final result (only when Done=true)
	Error  error  // Error if any (only when Done=true)
}

// claudeStatusMsg is sent for Claude status updates (from channel listener)
type claudeStatusMsg struct {
	update claudeUpdate
}

// claudeStreamResult represents the final result from Claude's stream-json output
type claudeStreamResult struct {
	Type    string `json:"type"`
	Subtype string `json:"subtype"`
	Result  string `json:"result"`
	IsError bool   `json:"is_error"`
}

// claudeSystemMessage represents the init message
type claudeSystemMessage struct {
	Type    string `json:"type"`
	Subtype string `json:"subtype"`
	Model   string `json:"model"`
}

// claudeStreamMessage represents assistant messages
type claudeStreamMessage struct {
	Type    string `json:"type"`
	Message struct {
		Model   string `json:"model"`
		Content []struct {
			Type  string `json:"type"`
			Text  string `json:"text"`
			Name  string `json:"name"`  // for tool_use
			Input any    `json:"input"` // for tool_use
		} `json:"content"`
	} `json:"message"`
}

// Init initializes the model
func (m Model) Init() tea.Cmd {
	return nil
}

// Update handles messages
func (m Model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	// Handle Claude status updates (real-time)
	if msg, ok := msg.(claudeStatusMsg); ok {
		if msg.update.Done {
			// Claude finished - send result
			if msg.update.Error != nil {
				return m, func() tea.Msg {
					return editResultMsg{err: msg.update.Error}
				}
			}
			return m, func() tea.Msg {
				return editResultMsg{content: msg.update.Result}
			}
		}
		// Update status and listen for more
		m.editStatus = msg.update.Status
		return m, listenForClaudeStatus(m.claudeStatusChan)
	}

	// Handle edit result
	if msg, ok := msg.(editResultMsg); ok {
		m.editClaudeWorking = false
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
				// Refresh all content after any edit
				m.updatePreview()
				m.projects = m.loader.GetAllProjects(21)
				m.updateContent()
				m.updateSidebarCounts()
			}
		}
		m.editMode = false
		m.editInput.Reset()
		m.editingTodoItem = "" // Clear TODO item context
		return m, nil
	}

	// Handle modal result
	if result, ok := msg.(components.ModalResult); ok {
		if !result.Cancelled && result.Title != "" {
			// Expand notes using Claude if enabled and notes exist
			if result.UseClaude && result.Notes != "" {
				m.claudeWorking = true
				m.pendingCategory = result.Category
				m.pendingTitle = result.Title
				m.pendingNotes = result.Notes
				m.editStatus = "Expanding with Claude..."

				// Run Claude async with streaming JSON
				return m, func() tea.Msg {
					prompt := fmt.Sprintf("Expand this brief note into a clear, actionable description (2-3 sentences max, no markdown headers): %s", result.Notes)
					cmd := exec.Command("claude", "-p", prompt, "--output-format", "stream-json", "--verbose")
					stdout, err := cmd.StdoutPipe()
					if err != nil {
						return ClaudeResultMsg{Error: err}
					}

					if err := cmd.Start(); err != nil {
						return ClaudeResultMsg{Error: err}
					}

					scanner := bufio.NewScanner(stdout)
					var finalResult string

					for scanner.Scan() {
						line := scanner.Text()
						var result claudeStreamResult
						if err := json.Unmarshal([]byte(line), &result); err == nil {
							if result.Type == "result" {
								if result.IsError {
									return ClaudeResultMsg{Error: fmt.Errorf("%s", result.Result)}
								}
								finalResult = result.Result
							}
						}
					}

					if err := cmd.Wait(); err != nil {
						return ClaudeResultMsg{Error: err}
					}

					return ClaudeResultMsg{ExpandedNotes: strings.TrimSpace(finalResult)}
				}
			}

			// No Claude needed, create immediately
			err := m.createNewItem(result.Category, result.Title, result.Notes)
			if err != nil {
				m.editStatus = fmt.Sprintf("Error creating: %v", err)
			} else {
				m.editStatus = "Created!"
				m.updateSidebarCounts()
				m.projects = m.loader.GetAllProjects(21)
				m.updateContent()
			}
		}
		return m, nil
	}

	// Handle Claude completion
	if result, ok := msg.(ClaudeResultMsg); ok {
		m.claudeWorking = false
		notes := m.pendingNotes
		if result.Error != nil {
			m.editStatus = fmt.Sprintf("Claude error: %v (using original notes)", result.Error)
		} else {
			notes = result.ExpandedNotes
		}

		// Create the item with expanded notes
		err := m.createNewItem(m.pendingCategory, m.pendingTitle, notes)
		if err != nil {
			m.editStatus = fmt.Sprintf("Error creating: %v", err)
		} else {
			m.editStatus = "Created!"
			m.updateSidebarCounts()
			m.projects = m.loader.GetAllProjects(21)
			m.updateContent()
		}

		// Clear pending state
		m.pendingCategory = ""
		m.pendingTitle = ""
		m.pendingNotes = ""
		return m, nil
	}

	// Handle modal input when visible
	if m.modal != nil && m.modal.Visible {
		var cmd tea.Cmd
		m.modal, cmd = m.modal.Update(msg)
		return m, cmd
	}

	// Handle edit mode input
	if m.editMode {
		// Block all input while Claude is working
		if m.editClaudeWorking {
			return m, nil
		}

		switch msg := msg.(type) {
		case tea.KeyMsg:
			switch msg.String() {
			case "enter":
				// Execute Claude edit with real-time status updates
				prompt := m.editInput.Value()
				if prompt != "" {
					m.editClaudeWorking = true
					m.editStatus = "Starting..."
					// Create channel for status updates
					m.claudeStatusChan = make(chan claudeUpdate, 10)
					// Start Claude in goroutine
					go m.runClaudeEdit(prompt, m.claudeStatusChan)
					// Return listener command
					return m, listenForClaudeStatus(m.claudeStatusChan)
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
			m.recentFiles = m.loader.GetRecentFiles(10)
			m.homeSelectedIdx = 0
			m.homeSection = 0
			m.homeScrollOffset = 0
			// Sync sidebar to Home
			m.sidebar.JumpTo(0) // Home is index 0
			m.sidebar.InSubMenu = false
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

		case key.Matches(msg, m.keys.New):
			// Show quick capture modal
			cmd := m.modal.Show()
			return m, cmd
		}

		// Pane-specific keys
		if m.focusedPane == PaneSidebar {
			switch {
			case key.Matches(msg, m.keys.Up):
				m.sidebar.MoveUp()
				// Check if we landed on Home
				if m.sidebar.SelectedCategory().Path == "_home" && !m.sidebar.InSubMenu {
					m.viewMode = ViewHome
					m.projects = m.loader.GetAllProjects(21)
					m.recentFiles = m.loader.GetRecentFiles(10)
					m.homeSelectedIdx = 0
					m.homeSection = 0
					m.homeScrollOffset = 0
				} else {
					m.viewMode = ViewBrowse
					m.updateContent()
				}
				return m, nil

			case key.Matches(msg, m.keys.Down):
				m.sidebar.MoveDown()
				// Check if we landed on Home
				if m.sidebar.SelectedCategory().Path == "_home" && !m.sidebar.InSubMenu {
					m.viewMode = ViewHome
					m.projects = m.loader.GetAllProjects(21)
					m.recentFiles = m.loader.GetRecentFiles(10)
					m.homeSelectedIdx = 0
					m.homeSection = 0
					m.homeScrollOffset = 0
				} else {
					m.viewMode = ViewBrowse
					m.updateContent()
				}
				return m, nil

			case key.Matches(msg, m.keys.Enter):
				// Check if Home is selected - just focus content pane
				if m.sidebar.SelectedCategory().Path == "_home" && !m.sidebar.InSubMenu {
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

			case key.Matches(msg, m.keys.Yank):
				// Copy selected item content
				if m.sidebar.InSubMenu {
					items := m.sidebar.SubItems[m.sidebar.Selected]
					if len(items) > 0 {
						idx := m.sidebar.SelectedSub[m.sidebar.Selected]
						if idx < len(items) {
							item := items[idx]
							var textToCopy string
							if item.IsTodo {
								textToCopy = item.Name
							} else {
								// Read file content
								content, err := m.loader.ReadFile(item.Path)
								if err != nil {
									content, _ = m.loader.ReadREADME(item.Path)
								}
								textToCopy = content
							}
							if textToCopy != "" {
								if err := clipboard.WriteAll(textToCopy); err != nil {
									m.editStatus = fmt.Sprintf("Copy failed: %v", err)
								} else {
									m.editStatus = "Content copied!"
								}
							}
						}
					}
				}
				return m, nil

			case key.Matches(msg, m.keys.YankPath):
				// Copy selected item path
				if m.sidebar.InSubMenu {
					items := m.sidebar.SubItems[m.sidebar.Selected]
					if len(items) > 0 {
						idx := m.sidebar.SelectedSub[m.sidebar.Selected]
						if idx < len(items) {
							item := items[idx]
							if !item.IsTodo {
								textToCopy := m.loader.RootDir + "/" + item.Path
								if err := clipboard.WriteAll(textToCopy); err != nil {
									m.editStatus = fmt.Sprintf("Copy failed: %v", err)
								} else {
									m.editStatus = "Path copied!"
								}
							}
						}
					}
				}
				return m, nil

			case key.Matches(msg, m.keys.Archive):
				// Archive selected sub-item
				if m.sidebar.InSubMenu {
					items := m.sidebar.SubItems[m.sidebar.Selected]
					if len(items) > 0 {
						idx := m.sidebar.SelectedSub[m.sidebar.Selected]
						if idx < len(items) {
							item := items[idx]
							var err error
							if item.IsTodo {
								err = m.loader.ArchiveTodoItem(item.Name)
							} else if item.IsFolder {
								err = m.loader.ArchiveProjectFolder(item.Path)
							}
							if err != nil {
								m.editStatus = fmt.Sprintf("Archive error: %v", err)
							} else {
								m.editStatus = "Archived!"
								m.updateSidebarCounts()
								m.projects = m.loader.GetAllProjects(21)
								m.updateContent()
							}
						}
					}
				}
				return m, nil
			}
		} else if m.focusedPane == PaneContent {
			// Home view content navigation
			if m.viewMode == ViewHome {
				// Calculate max indices for each section
				maxProjectIdx := len(m.projects) - 1
				if maxProjectIdx < 0 {
					maxProjectIdx = 0
				}
				maxRecentIdx := len(m.recentFiles) - 1
				if maxRecentIdx < 0 {
					maxRecentIdx = 0
				}

				switch {
				case key.Matches(msg, m.keys.Up):
					if m.homeSection == 0 {
						// In projects section
						if m.homeSelectedIdx > 0 {
							m.homeSelectedIdx--
						}
					} else {
						// In recent files section
						if m.homeSelectedIdx > 0 {
							m.homeSelectedIdx--
						} else if len(m.projects) > 0 {
							// Move to projects section
							m.homeSection = 0
							m.homeSelectedIdx = maxProjectIdx
						}
					}
					m.ensureHomeSelectedVisible()
					return m, nil

				case key.Matches(msg, m.keys.Down):
					if m.homeSection == 0 {
						// In projects section
						if m.homeSelectedIdx < maxProjectIdx {
							m.homeSelectedIdx++
						} else if len(m.recentFiles) > 0 {
							// Move to recent files section
							m.homeSection = 1
							m.homeSelectedIdx = 0
						}
					} else {
						// In recent files section
						if m.homeSelectedIdx < maxRecentIdx {
							m.homeSelectedIdx++
						}
					}
					m.ensureHomeSelectedVisible()
					return m, nil

				case key.Matches(msg, m.keys.Bottom):
					// G - go to bottom of current section or jump to last item overall
					if m.homeSection == 0 && len(m.recentFiles) > 0 {
						// Jump to last recent file
						m.homeSection = 1
						m.homeSelectedIdx = maxRecentIdx
					} else if m.homeSection == 1 {
						m.homeSelectedIdx = maxRecentIdx
					} else {
						m.homeSelectedIdx = maxProjectIdx
					}
					m.ensureHomeSelectedVisible()
					m.lastKeyG = false
					return m, nil

				case key.Matches(msg, m.keys.Left), key.Matches(msg, m.keys.Back):
					m.focusedPane = PaneSidebar
					m.sidebar.Focused = true
					return m, nil

				case key.Matches(msg, m.keys.Enter):
					if m.homeSection == 0 {
						// Projects section - jump to selected project if it's a folder
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
					} else {
						// Recent files section - navigate to the recent file
						if m.homeSelectedIdx < len(m.recentFiles) {
							rf := m.recentFiles[m.homeSelectedIdx]
							// Determine sidebar category index based on rf.Category
							categoryIdx := 1 // Default to projects
							switch rf.Category {
							case "projects":
								categoryIdx = 1
							case "areas":
								categoryIdx = 2
							case "resources":
								categoryIdx = 3
							}
							// Navigate to the folder
							m.sidebar.JumpTo(categoryIdx)
							m.sidebar.Expanded[categoryIdx] = true
							m.sidebar.InSubMenu = true
							// Find the item in sidebar
							for i, subItem := range m.sidebar.SubItems[categoryIdx] {
								if subItem.Path == rf.Path {
									m.sidebar.SelectedSub[categoryIdx] = i
									break
								}
							}
							m.viewMode = ViewBrowse
							m.updateContent()
						}
					}
					return m, nil

				case key.Matches(msg, m.keys.Archive):
					// Archive only works for projects section
					if m.homeSection == 0 && m.homeSelectedIdx < len(m.projects) {
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
							// Refresh projects list and recent files
							m.projects = m.loader.GetAllProjects(21)
							m.recentFiles = m.loader.GetRecentFiles(10)
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
					// Edit the selected item
					if m.homeSection == 0 {
						// Projects section
						if m.homeSelectedIdx < len(m.projects) {
							proj := m.projects[m.homeSelectedIdx]
							m.editMode = true
							if proj.IsFolder {
								m.editingFile = proj.Path + "/README.md"
								m.editingTodoItem = ""
							} else {
								// TODO item - store the item text for context
								m.editingFile = "TODO.md"
								m.editingTodoItem = proj.Name
							}
							m.editInput.Focus()
							m.editStatus = ""
							return m, textinput.Blink
						}
					} else {
						// Recent files section
						if m.homeSelectedIdx < len(m.recentFiles) {
							rf := m.recentFiles[m.homeSelectedIdx]
							m.editMode = true
							m.editingFile = rf.Path + "/README.md"
							m.editingTodoItem = ""
							m.editInput.Focus()
							m.editStatus = ""
							return m, textinput.Blink
						}
					}
					return m, nil

				case key.Matches(msg, m.keys.Yank):
					// Copy content to clipboard
					var textToCopy string
					if m.homeSection == 0 {
						// Projects section
						if m.homeSelectedIdx < len(m.projects) {
							proj := m.projects[m.homeSelectedIdx]
							if proj.IsFolder && proj.Path != "" {
								content, err := m.loader.ReadREADME(proj.Path)
								if err == nil {
									textToCopy = content
								}
							} else {
								textToCopy = proj.Name
							}
						}
					} else {
						// Recent files section
						if m.homeSelectedIdx < len(m.recentFiles) {
							rf := m.recentFiles[m.homeSelectedIdx]
							content, err := m.loader.ReadREADME(rf.Path)
							if err == nil {
								textToCopy = content
							}
						}
					}
					if textToCopy != "" {
						if err := clipboard.WriteAll(textToCopy); err != nil {
							m.editStatus = fmt.Sprintf("Copy failed: %v", err)
						} else {
							m.editStatus = "Content copied!"
						}
					}
					return m, nil

				case key.Matches(msg, m.keys.YankPath):
					// Copy path to clipboard
					var textToCopy string
					if m.homeSection == 0 {
						// Projects section
						if m.homeSelectedIdx < len(m.projects) {
							proj := m.projects[m.homeSelectedIdx]
							if proj.IsFolder && proj.Path != "" {
								textToCopy = m.loader.RootDir + "/" + proj.Path
							}
						}
					} else {
						// Recent files section
						if m.homeSelectedIdx < len(m.recentFiles) {
							rf := m.recentFiles[m.homeSelectedIdx]
							textToCopy = m.loader.RootDir + "/" + rf.Path
						}
					}
					if textToCopy != "" {
						if err := clipboard.WriteAll(textToCopy); err != nil {
							m.editStatus = fmt.Sprintf("Copy failed: %v", err)
						} else {
							m.editStatus = "Path copied!"
						}
					}
					return m, nil
				}

				// Handle gg (go to top) - must be outside switch to track state
				if msg.String() == "g" {
					if m.lastKeyG {
						// gg - go to top of all sections
						m.homeSection = 0
						m.homeSelectedIdx = 0
						m.homeScrollOffset = 0
						m.lastKeyG = false
					} else {
						m.lastKeyG = true
					}
					return m, nil
				}
				m.lastKeyG = false // Reset for any other key
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

			case key.Matches(msg, m.keys.Bottom):
				// G - go to bottom
				if len(m.items) > 0 {
					m.selectedIdx = len(m.items) - 1
					m.ensureSelectedVisible()
					m.updatePreview()
				}
				m.lastKeyG = false
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

			case key.Matches(msg, m.keys.Yank):
				// Copy item content to clipboard
				if len(m.items) > 0 && m.selectedIdx < len(m.items) {
					item := m.items[m.selectedIdx]
					var textToCopy string

					if strings.HasPrefix(item.Path, "TODO:") || strings.HasPrefix(item.Path, "COMPLETED:") {
						// Copy task text
						textToCopy = item.Name
					} else if strings.HasPrefix(item.Path, "ARCHIVE_MONTH:") {
						// Skip month headers
						return m, nil
					} else if item.IsFolder {
						// Copy README content
						content, err := m.loader.ReadREADME(item.Path)
						if err == nil {
							textToCopy = content
						}
					} else {
						// Copy file content
						content, err := m.loader.ReadFile(item.Path)
						if err == nil {
							textToCopy = content
						}
					}

					if textToCopy != "" {
						if err := clipboard.WriteAll(textToCopy); err != nil {
							m.editStatus = fmt.Sprintf("Copy failed: %v", err)
						} else {
							m.editStatus = "Content copied!"
						}
					}
				}
				return m, nil

			case key.Matches(msg, m.keys.YankPath):
				// Copy item path to clipboard
				if len(m.items) > 0 && m.selectedIdx < len(m.items) {
					item := m.items[m.selectedIdx]
					if !strings.HasPrefix(item.Path, "TODO:") && !strings.HasPrefix(item.Path, "COMPLETED:") && !strings.HasPrefix(item.Path, "ARCHIVE_MONTH:") {
						textToCopy := m.loader.RootDir + "/" + item.Path
						if err := clipboard.WriteAll(textToCopy); err != nil {
							m.editStatus = fmt.Sprintf("Copy failed: %v", err)
						} else {
							m.editStatus = "Path copied!"
						}
					}
				}
				return m, nil

			case key.Matches(msg, m.keys.Archive):
				// Archive selected item (not in archive context)
				if !m.isArchiveContext() && len(m.items) > 0 && m.selectedIdx < len(m.items) {
					item := m.items[m.selectedIdx]
					var err error
					if item.IsTodo {
						err = m.loader.ArchiveTodoItem(item.Name)
					} else if item.IsFolder {
						err = m.loader.ArchiveProjectFolder(item.Path)
					}
					if err != nil {
						m.editStatus = fmt.Sprintf("Archive error: %v", err)
					} else {
						m.editStatus = "Archived!"
						m.updateSidebarCounts()
						m.projects = m.loader.GetAllProjects(21)
						m.updateContent()
					}
				}
				return m, nil
			}

			// Handle gg (go to top) - must be outside switch to track state
			if msg.String() == "g" {
				if m.lastKeyG {
					// gg - go to top
					m.selectedIdx = 0
					m.scrollOffset = 0
					m.updatePreview()
					m.lastKeyG = false
				} else {
					m.lastKeyG = true
				}
				return m, nil
			}
			m.lastKeyG = false // Reset for any other key
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

			case key.Matches(msg, m.keys.Yank):
				// Copy the preview content
				if m.previewText != "" {
					if err := clipboard.WriteAll(m.previewText); err != nil {
						m.editStatus = fmt.Sprintf("Copy failed: %v", err)
					} else {
						m.editStatus = "Content copied!"
					}
				}
				return m, nil

			case key.Matches(msg, m.keys.YankPath):
				// Copy the previewed file path
				if m.previewFile != "" {
					textToCopy := m.loader.RootDir + "/" + m.previewFile
					if err := clipboard.WriteAll(textToCopy); err != nil {
						m.editStatus = fmt.Sprintf("Copy failed: %v", err)
					} else {
						m.editStatus = "Path copied!"
					}
				}
				return m, nil

			case key.Matches(msg, m.keys.Archive):
				// Archive from preview - use the selected content item
				if !m.isArchiveContext() && len(m.items) > 0 && m.selectedIdx < len(m.items) {
					item := m.items[m.selectedIdx]
					var err error
					if item.IsTodo {
						err = m.loader.ArchiveTodoItem(item.Name)
					} else if item.IsFolder {
						err = m.loader.ArchiveProjectFolder(item.Path)
					}
					if err != nil {
						m.editStatus = fmt.Sprintf("Archive error: %v", err)
					} else {
						m.editStatus = "Archived!"
						m.updateSidebarCounts()
						m.projects = m.loader.GetAllProjects(21)
						m.updateContent()
					}
				}
				return m, nil

			case key.Matches(msg, m.keys.Up):
				// Scroll preview up
				if m.previewScrollOffset > 0 {
					m.previewScrollOffset--
				}
				return m, nil

			case key.Matches(msg, m.keys.Down):
				// Scroll preview down (respect max scroll)
				lines := strings.Split(m.previewText, "\n")
				visibleLines := m.previewVisibleLines()
				maxScroll := len(lines) - visibleLines
				if maxScroll < 0 {
					maxScroll = 0
				}
				if m.previewScrollOffset < maxScroll {
					m.previewScrollOffset++
				}
				return m, nil

			case key.Matches(msg, m.keys.Bottom):
				// G - scroll to show last page of content
				lines := strings.Split(m.previewText, "\n")
				visibleLines := m.previewVisibleLines()
				maxScroll := len(lines) - visibleLines
				if maxScroll < 0 {
					maxScroll = 0
				}
				m.previewScrollOffset = maxScroll
				m.lastKeyG = false
				return m, nil
			}

			// Handle gg (scroll to top of preview)
			if msg.String() == "g" {
				if m.lastKeyG {
					// gg - scroll to top
					m.previewScrollOffset = 0
					m.lastKeyG = false
				} else {
					m.lastKeyG = true
				}
				return m, nil
			}
			m.lastKeyG = false // Reset for any other key
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

		var fullPrompt string

		// Special handling for TODO items
		if m.editingTodoItem != "" {
			fullPrompt = fmt.Sprintf(`Given this TODO.md file:

<file>
%s
</file>

I want to edit ONLY this specific TODO item: "%s"

My edit request: %s

Output the ENTIRE updated TODO.md file with ONLY that one item modified. Keep all other items exactly as they are. No explanation or markdown code blocks - just the raw file content.`, content, m.editingTodoItem, prompt)
		} else {
			// Regular file edit
			fullPrompt = fmt.Sprintf(`Given this markdown file content:

<file>
%s
</file>

Make these changes: %s

Output ONLY the updated file content, no explanation or markdown code blocks. Just the raw updated content.`, content, prompt)
		}

		// Execute claude command with streaming JSON output
		cmd := exec.Command("claude", "-p", fullPrompt, "--output-format", "stream-json", "--verbose")
		stdout, err := cmd.StdoutPipe()
		if err != nil {
			return editResultMsg{err: fmt.Errorf("failed to get stdout: %w", err)}
		}

		if err := cmd.Start(); err != nil {
			return editResultMsg{err: fmt.Errorf("failed to start claude: %w", err)}
		}

		// Read and parse streaming JSON output
		scanner := bufio.NewScanner(stdout)
		var finalResult string
		var lastStatus string

		for scanner.Scan() {
			line := scanner.Text()

			// Try to parse as result message
			var result claudeStreamResult
			if err := json.Unmarshal([]byte(line), &result); err == nil {
				if result.Type == "result" {
					if result.IsError {
						return editResultMsg{err: fmt.Errorf("claude error: %s", result.Result)}
					}
					finalResult = result.Result
					continue
				}
			}

			// Try to parse as assistant message for status
			var msg claudeStreamMessage
			if err := json.Unmarshal([]byte(line), &msg); err == nil {
				if msg.Type == "assistant" && len(msg.Message.Content) > 0 {
					for _, c := range msg.Message.Content {
						if c.Type == "tool_use" && c.Name != "" {
							lastStatus = fmt.Sprintf("Using: %s", c.Name)
						} else if c.Type == "text" && c.Text != "" {
							// Truncate long text
							text := c.Text
							if len(text) > 50 {
								text = text[:47] + "..."
							}
							lastStatus = text
						}
					}
				}
			}
			_ = lastStatus // Status could be used for real-time updates with subscriptions
		}

		if err := cmd.Wait(); err != nil {
			return editResultMsg{err: fmt.Errorf("claude failed: %w", err)}
		}

		if finalResult == "" {
			return editResultMsg{err: fmt.Errorf("no result from claude")}
		}

		return editResultMsg{content: finalResult}
	}
}

// writeFile writes content to a file
func writeFile(path string, content string) error {
	return os.WriteFile(path, []byte(content), 0644)
}

// runClaudeEdit runs claude to edit the file and sends status updates via channel
func (m *Model) runClaudeEdit(prompt string, ch chan claudeUpdate) {
	defer close(ch)

	ch <- claudeUpdate{Status: "Reading file..."}

	// Read current file content
	content, err := m.loader.ReadFile(m.editingFile)
	if err != nil {
		ch <- claudeUpdate{Done: true, Error: err}
		return
	}

	var fullPrompt string

	// Special handling for TODO items
	if m.editingTodoItem != "" {
		fullPrompt = fmt.Sprintf(`Given this TODO.md file:

<file>
%s
</file>

I want to edit ONLY this specific TODO item: "%s"

My edit request: %s

Output the ENTIRE updated TODO.md file with ONLY that one item modified. Keep all other items exactly as they are. No explanation or markdown code blocks - just the raw file content.`, content, m.editingTodoItem, prompt)
	} else {
		// Regular file edit
		fullPrompt = fmt.Sprintf(`Given this markdown file content:

<file>
%s
</file>

Make these changes: %s

Output ONLY the updated file content, no explanation or markdown code blocks. Just the raw updated content.`, content, prompt)
	}

	ch <- claudeUpdate{Status: "Calling Claude..."}

	// Execute claude command with streaming JSON output
	cmd := exec.Command("claude", "-p", fullPrompt, "--output-format", "stream-json", "--verbose")
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		ch <- claudeUpdate{Done: true, Error: fmt.Errorf("failed to get stdout: %w", err)}
		return
	}

	if err := cmd.Start(); err != nil {
		ch <- claudeUpdate{Done: true, Error: fmt.Errorf("failed to start claude: %w", err)}
		return
	}

	ch <- claudeUpdate{Status: "Waiting for response..."}

	// Read and parse streaming JSON output
	scanner := bufio.NewScanner(stdout)
	// Increase scanner buffer for large JSON lines
	buf := make([]byte, 0, 64*1024)
	scanner.Buffer(buf, 1024*1024)

	var finalResult string
	messageCount := 0

	for scanner.Scan() {
		line := scanner.Text()
		messageCount++

		// Try to parse the type first
		var baseMsg struct {
			Type string `json:"type"`
		}
		if err := json.Unmarshal([]byte(line), &baseMsg); err != nil {
			continue
		}

		switch baseMsg.Type {
		case "system":
			// Init message
			var sysMsg claudeSystemMessage
			if err := json.Unmarshal([]byte(line), &sysMsg); err == nil {
				if sysMsg.Subtype == "init" {
					ch <- claudeUpdate{Status: "Claude connected..."}
				}
			}

		case "assistant":
			// Assistant response - check for tool use or text
			var msg claudeStreamMessage
			if err := json.Unmarshal([]byte(line), &msg); err == nil {
				for _, c := range msg.Message.Content {
					if c.Type == "tool_use" && c.Name != "" {
						ch <- claudeUpdate{Status: fmt.Sprintf("Using: %s", c.Name)}
					} else if c.Type == "text" && c.Text != "" {
						// Show first part of response
						text := c.Text
						if len(text) > 40 {
							text = text[:37] + "..."
						}
						ch <- claudeUpdate{Status: fmt.Sprintf("Writing: %s", text)}
					}
				}
			}

		case "result":
			// Final result
			var result claudeStreamResult
			if err := json.Unmarshal([]byte(line), &result); err == nil {
				if result.IsError {
					ch <- claudeUpdate{Done: true, Error: fmt.Errorf("claude error: %s", result.Result)}
					cmd.Wait()
					return
				}
				finalResult = result.Result
			}
		}
	}

	if err := cmd.Wait(); err != nil {
		ch <- claudeUpdate{Done: true, Error: fmt.Errorf("claude failed: %w", err)}
		return
	}

	if finalResult == "" {
		ch <- claudeUpdate{Done: true, Error: fmt.Errorf("no result from claude")}
		return
	}

	ch <- claudeUpdate{Done: true, Result: finalResult}
}

// listenForClaudeStatus returns a command that listens for Claude status updates
func listenForClaudeStatus(ch chan claudeUpdate) tea.Cmd {
	return func() tea.Msg {
		update, ok := <-ch
		if !ok {
			// Channel closed
			return claudeStatusMsg{update: claudeUpdate{Done: true, Error: fmt.Errorf("channel closed unexpectedly")}}
		}
		return claudeStatusMsg{update: update}
	}
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
	// Reset scroll when preview changes
	m.previewScrollOffset = 0

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

// ensureHomeSelectedVisible adjusts homeScrollOffset to keep selected item visible
func (m *Model) ensureHomeSelectedVisible() {
	// Calculate the line number of the selected item
	// Banner takes ~6 lines, plus 1 empty, plus "Projects" header, plus 1 empty = ~9 lines before projects
	bannerLines := 6
	headerLines := 3 // "Projects" + empty line after banner + empty line after header

	var selectedLine int
	if m.homeSection == 0 {
		// In projects section
		selectedLine = bannerLines + headerLines + m.homeSelectedIdx
	} else {
		// In recent files section
		// After projects: 1 empty + "Recent Files" header + 1 empty = 3 lines
		projectsLines := len(m.projects)
		if projectsLines == 0 {
			projectsLines = 1 // "No projects" line
		}
		recentHeaderLines := 3
		selectedLine = bannerLines + headerLines + projectsLines + recentHeaderLines + m.homeSelectedIdx
	}

	// Estimate visible height
	visibleHeight := m.height - 10
	if visibleHeight < 5 {
		visibleHeight = 5
	}

	// If selected is above visible area, scroll up
	if selectedLine < m.homeScrollOffset {
		m.homeScrollOffset = selectedLine
	}

	// If selected is below visible area, scroll down
	if selectedLine >= m.homeScrollOffset+visibleHeight {
		m.homeScrollOffset = selectedLine - visibleHeight + 1
	}

	// Ensure scrollOffset is not negative
	if m.homeScrollOffset < 0 {
		m.homeScrollOffset = 0
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

// createNewItem creates a new item based on category
func (m *Model) createNewItem(category, title, notes string) error {
	switch category {
	case "TODO":
		// Add to TODO.md
		return m.loader.CreateTodo(title, notes)
	case "Projects":
		// Create a new project folder with README
		return m.loader.CreateProject(title, notes)
	case "Areas":
		// Create a new area folder with README
		return m.loader.CreateArea(title, notes)
	case "Resources":
		// Create a new resource file
		return m.loader.CreateResource(title, notes)
	default:
		return fmt.Errorf("unknown category: %s", category)
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
		footer = footerStyle.Render("j/k:move  Enter:open  R:restore  n:new  y:copy Y:path  tab:pane  1-4:jump  q:quit")
	} else if m.viewMode == ViewHome {
		footer = footerStyle.Render("j/k:move  Enter:open  e:edit  a:archive  n:new  y:copy Y:path  1-4:jump  q:quit")
	} else {
		footer = footerStyle.Render("j/k:move  Enter:open  e:edit  a:archive  n:new  y:copy Y:path  tab:pane  1-4:jump  q:quit")
	}

	// Show status message
	if m.editStatus != "" {
		statusStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#9ECE6A"))
		footer = footer + "  " + statusStyle.Render(m.editStatus)
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

		var modalContent string
		if m.editClaudeWorking {
			// Show working indicator - hide input, show spinner
			workingStyle := lipgloss.NewStyle().
				Foreground(lipgloss.Color("#F7C67A")).
				Bold(true)
			statusText := m.editStatus
			if statusText == "" {
				statusText = "Initializing..."
			}
			modalContent = titleStyle.Render("Edit: "+m.editingFile) + "\n\n" +
				workingStyle.Render("⏳ "+statusText) + "\n\n" +
				lipgloss.NewStyle().Foreground(lipgloss.Color("#666666")).Render("Please wait...")
		} else {
			modalContent = titleStyle.Render("Edit: "+m.editingFile) + "\n\n" +
				m.editInput.View() + "\n" +
				statusStyle.Render(m.editStatus) + "\n\n" +
				lipgloss.NewStyle().Foreground(lipgloss.Color("#666666")).Render("Enter: submit  Esc: cancel")
		}

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

	// If Claude is working, show a working indicator
	if m.claudeWorking {
		workingStyle := lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(lipgloss.Color("#7AA2F7")).
			Padding(2, 4).
			Foreground(lipgloss.Color("#7AA2F7"))

		workingContent := workingStyle.Render(fmt.Sprintf("⏳ Expanding with Claude...\n\n  Creating: %s", m.pendingTitle))
		workingPlaced := lipgloss.Place(
			m.width,
			m.height,
			lipgloss.Center,
			lipgloss.Center,
			workingContent,
		)
		return workingPlaced
	}

	// If quick capture modal is visible, overlay it
	if m.modal != nil && m.modal.Visible {
		modalContent := m.modal.View()
		modalPlaced := lipgloss.Place(
			m.width,
			m.height,
			lipgloss.Center,
			lipgloss.Center,
			modalContent,
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

// previewVisibleLines calculates how many lines can be shown in preview pane
func (m Model) previewVisibleLines() int {
	paneHeight := m.height - 4
	if paneHeight < 3 {
		paneHeight = 3
	}
	innerHeight := paneHeight - 2
	if innerHeight < 1 {
		innerHeight = 1
	}
	// renderPreview uses height - 2 for maxLines
	maxLines := innerHeight - 2
	if maxLines < 1 {
		maxLines = 1
	}
	return maxLines
}

// renderPreview renders the preview pane with markdown syntax highlighting
func (m Model) renderPreview(width, height int) string {
	if m.previewText == "" {
		emptyStyle := lipgloss.NewStyle().
			Foreground(lipgloss.AdaptiveColor{Light: "#6E7781", Dark: "#666666"}).
			Italic(true)
		return emptyStyle.Render("Select an item to preview")
	}

	// Ensure valid dimensions
	maxLines := height - 2
	if maxLines < 1 {
		maxLines = 1
	}

	lines := strings.Split(m.previewText, "\n")

	// Apply scroll offset
	startLine := m.previewScrollOffset
	if startLine >= len(lines) {
		startLine = len(lines) - 1
	}
	if startLine < 0 {
		startLine = 0
	}

	endLine := startLine + maxLines
	if endLine > len(lines) {
		endLine = len(lines)
	}

	visibleLines := lines[startLine:endLine]

	// Syntax highlight each line
	var highlightedLines []string
	inCodeBlock := false

	for _, line := range visibleLines {
		highlighted := highlightMarkdownLine(line, &inCodeBlock, width-2)
		highlightedLines = append(highlightedLines, highlighted)
	}

	// Show scroll indicator if there's more content
	scrollStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#6E7781", Dark: "#666666"}).Italic(true)
	if endLine < len(lines) {
		highlightedLines = append(highlightedLines, scrollStyle.Render(fmt.Sprintf("↓ %d more lines", len(lines)-endLine)))
	}
	if startLine > 0 {
		highlightedLines = append([]string{scrollStyle.Render(fmt.Sprintf("↑ %d lines above", startLine))}, highlightedLines...)
	}

	return strings.Join(highlightedLines, "\n")
}

// highlightMarkdownLine applies syntax highlighting to a single markdown line
func highlightMarkdownLine(line string, inCodeBlock *bool, width int) string {
	trimmed := strings.TrimSpace(line)

	// Adaptive colors: {Light, Dark}
	h1Style := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#C41A16", Dark: "#F7768E"}).Bold(true)
	h2Style := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#C45500", Dark: "#FF9E64"}).Bold(true)
	h3Style := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#786000", Dark: "#E0AF68"}).Bold(true)
	h4Style := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#177500", Dark: "#9ECE6A"})
	codeBlockStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#0E6FBF", Dark: "#7DCFFF"})
	codeStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#0E6FBF", Dark: "#7DCFFF"})
	linkStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#0550AE", Dark: "#7AA2F7"}).Underline(true)
	listStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#177500", Dark: "#9ECE6A"})
	checkboxStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#6F42C1", Dark: "#BB9AF7"})
	blockquoteStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#6E7781", Dark: "#565F89"}).Italic(true)
	boldStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#000000", Dark: "#FFFFFF"}).Bold(true)
	normalStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#24292F", Dark: "#A9B1D6"})

	// Code block toggle
	if strings.HasPrefix(trimmed, "```") {
		*inCodeBlock = !*inCodeBlock
		return codeBlockStyle.Render(line)
	}

	// Inside code block
	if *inCodeBlock {
		return codeBlockStyle.Render(line)
	}

	// Headers
	if strings.HasPrefix(trimmed, "#### ") {
		return h4Style.Render(line)
	}
	if strings.HasPrefix(trimmed, "### ") {
		return h3Style.Render(line)
	}
	if strings.HasPrefix(trimmed, "## ") {
		return h2Style.Render(line)
	}
	if strings.HasPrefix(trimmed, "# ") {
		return h1Style.Render(line)
	}

	// Blockquotes
	if strings.HasPrefix(trimmed, ">") {
		return blockquoteStyle.Render(line)
	}

	// Checkboxes
	if strings.Contains(trimmed, "- [ ]") || strings.Contains(trimmed, "- [x]") || strings.Contains(trimmed, "- [X]") {
		return checkboxStyle.Render(line)
	}

	// List items
	if strings.HasPrefix(trimmed, "- ") || strings.HasPrefix(trimmed, "* ") || strings.HasPrefix(trimmed, "+ ") {
		return listStyle.Render(line)
	}

	// Numbered lists
	if len(trimmed) > 2 && trimmed[0] >= '0' && trimmed[0] <= '9' && strings.Contains(trimmed[:3], ".") {
		return listStyle.Render(line)
	}

	// Inline formatting (simplified - just highlight the whole line if it contains these)
	// For links [text](url)
	if strings.Contains(line, "](") && strings.Contains(line, "[") {
		return linkStyle.Render(line)
	}

	// Bold **text**
	if strings.Contains(line, "**") {
		return boldStyle.Render(line)
	}

	// Inline code `code`
	if strings.Contains(line, "`") {
		return codeStyle.Render(line)
	}

	return normalStyle.Render(line)
}

// ASCII art raccoon coder ready to get stuff done
const homeBanner = `    ╭─────────────────────────╮
    │   ∧_∧  LET'S GO!       │
    │  (◕‿◕)っ               │
    │  /    つ☕              │
    │ (  /  )                │
    ╰─────────────────────────╯`

// renderHomeContent renders the home dashboard content pane (projects + recent files)
func (m Model) renderHomeContent(width, height int) string {
	// Adaptive colors
	itemStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#57606A", Dark: "#888888"})
	selectedStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#0550AE", Dark: "#7AA2F7"}).Bold(true)
	focusedStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#0550AE", Dark: "#7AA2F7"}).Bold(true)
	titleStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#177500", Dark: "#9ECE6A"}).Bold(true)
	staleStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#CF222E", Dark: "#F7768E"})
	freshStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#6E7781", Dark: "#666666"})
	bannerStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#0550AE", Dark: "#7AA2F7"})
	categoryStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#6E7781", Dark: "#565F89"})
	scrollStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#6E7781", Dark: "#565F89"})

	// Build all content lines
	var allLines []string

	// Banner
	bannerLines := strings.Split(bannerStyle.Render(homeBanner), "\n")
	allLines = append(allLines, bannerLines...)
	allLines = append(allLines, "")

	// Projects section header
	allLines = append(allLines, titleStyle.Render("Projects"))
	allLines = append(allLines, "")

	if len(m.projects) == 0 {
		emptyStyle := lipgloss.NewStyle().
			Foreground(lipgloss.AdaptiveColor{Light: "#6E7781", Dark: "#666666"}).
			Italic(true)
		allLines = append(allLines, emptyStyle.Render("  No projects"))
	} else {
		for i, proj := range m.projects {
			prefix := "  "
			style := itemStyle
			if m.homeSection == 0 && i == m.homeSelectedIdx {
				prefix = "▸ "
				if m.focusedPane == PaneContent {
					style = focusedStyle
				} else {
					style = selectedStyle
				}
			}

			icon := "📌 "
			if proj.IsFolder {
				icon = "📁 "
			}

			name := proj.Name
			maxLen := width - 16
			if maxLen > 0 && len(name) > maxLen {
				name = name[:maxLen-1] + "…"
			}

			var ageStr string
			if proj.DaysOld == 0 {
				ageStr = freshStyle.Render("today")
			} else if proj.IsStale {
				ageStr = staleStyle.Render(fmt.Sprintf("%dd ⚠", proj.DaysOld))
			} else {
				ageStr = freshStyle.Render(fmt.Sprintf("%dd", proj.DaysOld))
			}

			line := fmt.Sprintf("%s%s%s %s", prefix, icon, name, ageStr)
			allLines = append(allLines, style.Render(line))
		}
	}

	// Recent Files section
	allLines = append(allLines, "")
	allLines = append(allLines, titleStyle.Render("Recent Files"))
	allLines = append(allLines, "")

	if len(m.recentFiles) == 0 {
		emptyStyle := lipgloss.NewStyle().
			Foreground(lipgloss.AdaptiveColor{Light: "#6E7781", Dark: "#666666"}).
			Italic(true)
		allLines = append(allLines, emptyStyle.Render("  No recent files"))
	} else {
		for i, rf := range m.recentFiles {
			prefix := "  "
			style := itemStyle
			if m.homeSection == 1 && i == m.homeSelectedIdx {
				prefix = "▸ "
				if m.focusedPane == PaneContent {
					style = focusedStyle
				} else {
					style = selectedStyle
				}
			}

			icon := "📄 "

			name := rf.Name
			maxLen := width - 20
			if maxLen > 0 && len(name) > maxLen {
				name = name[:maxLen-1] + "…"
			}

			timeAgo := formatTimeAgo(rf.ModTime)
			catLabel := categoryStyle.Render(rf.Category)

			line := fmt.Sprintf("%s%s%s %s %s", prefix, icon, name, catLabel, freshStyle.Render(timeAgo))
			allLines = append(allLines, style.Render(line))
		}
	}

	// Apply scroll offset
	visibleHeight := height - 2
	if visibleHeight < 1 {
		visibleHeight = 1
	}

	startLine := m.homeScrollOffset
	if startLine >= len(allLines) {
		startLine = len(allLines) - 1
	}
	if startLine < 0 {
		startLine = 0
	}

	endLine := startLine + visibleHeight
	if endLine > len(allLines) {
		endLine = len(allLines)
	}

	var result []string

	// Show "more above" indicator
	if startLine > 0 {
		result = append(result, scrollStyle.Render(fmt.Sprintf("  ↑ %d lines above", startLine)))
		visibleHeight--
		endLine = startLine + visibleHeight
		if endLine > len(allLines) {
			endLine = len(allLines)
		}
	}

	result = append(result, allLines[startLine:endLine]...)

	// Show "more below" indicator
	remaining := len(allLines) - endLine
	if remaining > 0 {
		result = append(result, scrollStyle.Render(fmt.Sprintf("  ↓ %d lines below", remaining)))
	}

	return strings.Join(result, "\n")
}

// formatTimeAgo returns human-readable time difference
func formatTimeAgo(t time.Time) string {
	d := time.Since(t)
	if d < time.Minute {
		return "just now"
	} else if d < time.Hour {
		mins := int(d.Minutes())
		return fmt.Sprintf("%dm ago", mins)
	} else if d < 24*time.Hour {
		hours := int(d.Hours())
		return fmt.Sprintf("%dh ago", hours)
	} else {
		days := int(d.Hours() / 24)
		if days == 1 {
			return "yesterday"
		}
		return fmt.Sprintf("%dd ago", days)
	}
}

// renderHomePreview renders preview for selected project or recent file
func (m Model) renderHomePreview(width, height int) string {
	emptyStyle := lipgloss.NewStyle().
		Foreground(lipgloss.AdaptiveColor{Light: "#6E7781", Dark: "#666666"}).
		Italic(true)

	var content string

	if m.homeSection == 0 {
		// Projects section
		if len(m.projects) == 0 || m.homeSelectedIdx >= len(m.projects) {
			return emptyStyle.Render("No projects")
		}

		proj := m.projects[m.homeSelectedIdx]

		if proj.IsFolder {
			// Read the README for project folder
			var err error
			content, err = m.loader.ReadREADME(proj.Path)
			if err != nil {
				return emptyStyle.Render(fmt.Sprintf("No README in %s", proj.Name))
			}
		} else {
			// Show TODO details
			var b strings.Builder
			b.WriteString(fmt.Sprintf("📌 Task: %s\n\n", proj.Name))
			if len(proj.Details) > 0 {
				b.WriteString("Details:\n")
				for _, d := range proj.Details {
					b.WriteString(fmt.Sprintf("  • %s\n", d))
				}
			}
			content = b.String()
		}
	} else {
		// Recent files section
		if len(m.recentFiles) == 0 || m.homeSelectedIdx >= len(m.recentFiles) {
			return emptyStyle.Render("No recent files")
		}

		rf := m.recentFiles[m.homeSelectedIdx]

		// Read the README for the recent file's folder
		var err error
		content, err = m.loader.ReadREADME(rf.Path)
		if err != nil {
			return emptyStyle.Render(fmt.Sprintf("No README in %s", rf.Name))
		}
	}

	// Ensure valid dimensions
	maxLines := height - 2
	if maxLines < 1 {
		maxLines = 1
	}

	lines := strings.Split(content, "\n")

	// Syntax highlight each line
	var highlightedLines []string
	inCodeBlock := false

	visibleLines := lines
	if len(visibleLines) > maxLines {
		visibleLines = visibleLines[:maxLines]
	}

	for _, line := range visibleLines {
		highlighted := highlightMarkdownLine(line, &inCodeBlock, width-2)
		highlightedLines = append(highlightedLines, highlighted)
	}

	// Show scroll indicator if there's more content
	if len(lines) > maxLines {
		scrollStyle := lipgloss.NewStyle().Foreground(lipgloss.AdaptiveColor{Light: "#6E7781", Dark: "#666666"}).Italic(true)
		highlightedLines = append(highlightedLines, scrollStyle.Render(fmt.Sprintf("↓ %d more lines", len(lines)-maxLines)))
	}

	return strings.Join(highlightedLines, "\n")
}
