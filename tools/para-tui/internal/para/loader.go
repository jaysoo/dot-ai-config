package para

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

// Loader handles loading PARA structure from disk
type Loader struct {
	RootDir           string
	collectionFolders map[string]bool
}

// NewLoader creates a new PARA loader
func NewLoader(rootDir string) *Loader {
	// Build collection folders lookup
	collections := make(map[string]bool)
	for _, path := range CollectionFolders() {
		collections[path] = true
	}

	return &Loader{
		RootDir:           rootDir,
		collectionFolders: collections,
	}
}

// GetFolderType determines the type of a folder
func (l *Loader) GetFolderType(relativePath string) FolderType {
	// Top-level PARA categories
	categories := []string{"para/projects", "para/areas", "para/resources", "para/archive"}
	for _, cat := range categories {
		if relativePath == cat {
			return FolderTypeCategory
		}
	}

	// Check if it's a collection folder
	if l.collectionFolders[relativePath] {
		return FolderTypeCollection
	}

	// Default to topic
	return FolderTypeTopic
}

// LoadItems loads items from a given path
func (l *Loader) LoadItems(relativePath string) ([]Item, error) {
	fullPath := filepath.Join(l.RootDir, relativePath)

	entries, err := os.ReadDir(fullPath)
	if err != nil {
		return nil, err
	}

	folderType := l.GetFolderType(relativePath)
	var items []Item

	for _, entry := range entries {
		name := entry.Name()

		// Skip hidden files
		if strings.HasPrefix(name, ".") {
			continue
		}

		// Skip _template.md in listings (it's a template, not content)
		if name == "_template.md" {
			continue
		}

		info, err := entry.Info()
		if err != nil {
			continue
		}

		itemPath := filepath.Join(relativePath, name)

		item := Item{
			Name:    name,
			Path:    itemPath,
			ModTime: info.ModTime(),
		}

		if entry.IsDir() {
			item.IsFolder = true
			item.FolderType = l.GetFolderType(itemPath)

			// For category folders, always include subfolders
			if folderType == FolderTypeCategory {
				items = append(items, item)
			} else if folderType == FolderTypeCollection {
				// Collections can have subfolders (like syncs/)
				items = append(items, item)
			}
			// Topic folders don't show subfolders in their listing
		} else {
			item.IsFolder = false

			// For category folders, don't show files (only README.md matters)
			if folderType == FolderTypeCategory {
				// Skip files at category level (except README which we handle separately)
				continue
			}

			// For collection folders, show all .md files
			if folderType == FolderTypeCollection {
				if strings.HasSuffix(name, ".md") {
					items = append(items, item)
				}
			}

			// Topic folders only show README.md
			if folderType == FolderTypeTopic {
				if name == "README.md" {
					items = append(items, item)
				}
			}
		}
	}

	// Sort items: README.md first, then folders, then files alphabetically
	sort.Slice(items, func(i, j int) bool {
		// README.md always comes first
		if items[i].Name == "README.md" {
			return true
		}
		if items[j].Name == "README.md" {
			return false
		}
		// Folders before files
		if items[i].IsFolder != items[j].IsFolder {
			return items[i].IsFolder
		}
		// Alphabetical within same type
		return items[i].Name < items[j].Name
	})

	return items, nil
}

// ReadREADME reads the README.md content from a folder
func (l *Loader) ReadREADME(relativePath string) (string, error) {
	readmePath := filepath.Join(l.RootDir, relativePath, "README.md")
	content, err := os.ReadFile(readmePath)
	if err != nil {
		return "", err
	}
	return string(content), nil
}

// ReadFile reads any file content
func (l *Loader) ReadFile(relativePath string) (string, error) {
	fullPath := filepath.Join(l.RootDir, relativePath)
	content, err := os.ReadFile(fullPath)
	if err != nil {
		return "", err
	}
	return string(content), nil
}

// StaleItem represents an item that hasn't been updated recently
type StaleItem struct {
	Item     Item
	Category string
	DaysOld  int
}

// TodoItem represents a parsed TODO item from TODO.md
type TodoItem struct {
	Text     string
	Status   string // "pending", "in_progress"
	Date     string
	DaysOld  int
	Details  []string
}

// ProjectItem represents a unified project (either TODO or folder)
type ProjectItem struct {
	Name     string
	Path     string   // Empty for TODOs
	IsFolder bool     // true = para/projects folder, false = TODO item
	DaysOld  int
	IsStale  bool     // > 21 days old
	Details  []string // For TODOs
}

// GetStaleItems finds items across all categories that haven't been updated in the given days
func (l *Loader) GetStaleItems(staleDays int) []StaleItem {
	var staleItems []StaleItem
	cutoff := time.Now().AddDate(0, 0, -staleDays)
	categories := []string{"para/projects", "para/areas", "para/resources"}

	for _, cat := range categories {
		items, err := l.LoadItems(cat)
		if err != nil {
			continue
		}

		for _, item := range items {
			if item.IsFolder {
				// Check the folder's README.md modification time
				readmePath := filepath.Join(l.RootDir, item.Path, "README.md")
				info, err := os.Stat(readmePath)
				if err != nil {
					continue
				}
				modTime := info.ModTime()
				if modTime.Before(cutoff) {
					daysOld := int(time.Since(modTime).Hours() / 24)
					staleItems = append(staleItems, StaleItem{
						Item:     item,
						Category: cat,
						DaysOld:  daysOld,
					})
				}
			}
		}
	}

	// Sort by oldest first
	sort.Slice(staleItems, func(i, j int) bool {
		return staleItems[i].DaysOld > staleItems[j].DaysOld
	})

	return staleItems
}

// GetTodoItems parses TODO.md and returns pending/in-progress items
func (l *Loader) GetTodoItems() []TodoItem {
	todoPath := filepath.Join(l.RootDir, "TODO.md")
	content, err := os.ReadFile(todoPath)
	if err != nil {
		return nil
	}

	var items []TodoItem
	lines := strings.Split(string(content), "\n")

	currentSection := ""
	var currentItem *TodoItem

	for _, line := range lines {
		trimmed := strings.TrimSpace(line)

		// Detect section headers
		if strings.HasPrefix(trimmed, "## In Progress") {
			currentSection = "in_progress"
			continue
		}
		if strings.HasPrefix(trimmed, "## Pending") || strings.HasPrefix(trimmed, "## Todo") {
			currentSection = "pending"
			continue
		}
		if strings.HasPrefix(trimmed, "## Completed") || strings.HasPrefix(trimmed, "## Recent Tasks") {
			currentSection = "" // Skip completed/recent
			continue
		}
		if strings.HasPrefix(trimmed, "## ") {
			currentSection = "" // Unknown section
			continue
		}

		// Only parse items in relevant sections
		if currentSection == "" {
			continue
		}

		// Parse checkbox items: - [ ] or - [x]
		if strings.HasPrefix(trimmed, "- [ ]") {
			// Save previous item if exists
			if currentItem != nil {
				items = append(items, *currentItem)
			}

			text := strings.TrimPrefix(trimmed, "- [ ]")
			text = strings.TrimSpace(text)

			// Extract date if present (yyyy-mm-dd)
			date := ""
			daysOld := 0
			if idx := strings.Index(text, "("); idx != -1 {
				if endIdx := strings.Index(text[idx:], ")"); endIdx != -1 {
					date = text[idx+1 : idx+endIdx]
					text = strings.TrimSpace(text[:idx])
					// Parse date and calculate days old
					if parsed, err := time.Parse("2006-01-02", date); err == nil {
						daysOld = int(time.Since(parsed).Hours() / 24)
					}
				}
			}

			currentItem = &TodoItem{
				Text:    text,
				Status:  currentSection,
				Date:    date,
				DaysOld: daysOld,
			}
		} else if strings.HasPrefix(trimmed, "- ") && currentItem != nil {
			// Detail line for current item
			detail := strings.TrimPrefix(trimmed, "- ")
			currentItem.Details = append(currentItem.Details, detail)
		}
	}

	// Don't forget the last item
	if currentItem != nil {
		items = append(items, *currentItem)
	}

	return items
}

// CompletedItem represents a parsed completed item from COMPLETED.md
type CompletedItem struct {
	Text    string
	Date    string
	Month   string // e.g., "January 2026"
	Details []string
}

// GetCompletedItems parses COMPLETED.md and returns completed items
func (l *Loader) GetCompletedItems() []CompletedItem {
	completedPath := filepath.Join(l.RootDir, "para", "archive", "COMPLETED.md")
	content, err := os.ReadFile(completedPath)
	if err != nil {
		return nil
	}

	var items []CompletedItem
	lines := strings.Split(string(content), "\n")

	currentMonth := ""
	var currentItem *CompletedItem

	for _, line := range lines {
		trimmed := strings.TrimSpace(line)

		// Detect month headers like "### January 2026"
		if strings.HasPrefix(trimmed, "### ") {
			// Save previous item if exists
			if currentItem != nil {
				items = append(items, *currentItem)
				currentItem = nil
			}
			currentMonth = strings.TrimPrefix(trimmed, "### ")
			continue
		}

		// Parse completed items: - [x] Text (date)
		if strings.HasPrefix(trimmed, "- [x]") {
			// Save previous item if exists
			if currentItem != nil {
				items = append(items, *currentItem)
			}

			text := strings.TrimPrefix(trimmed, "- [x]")
			text = strings.TrimSpace(text)

			// Extract date if present (yyyy-mm-dd)
			date := ""
			if idx := strings.LastIndex(text, "("); idx != -1 {
				if endIdx := strings.LastIndex(text, ")"); endIdx > idx {
					date = text[idx+1 : endIdx]
					text = strings.TrimSpace(text[:idx])
				}
			}

			currentItem = &CompletedItem{
				Text:  text,
				Date:  date,
				Month: currentMonth,
			}
		} else if strings.HasPrefix(trimmed, "- ") && currentItem != nil {
			// Detail line for current item
			detail := strings.TrimPrefix(trimmed, "- ")
			currentItem.Details = append(currentItem.Details, detail)
		}
	}

	// Don't forget the last item
	if currentItem != nil {
		items = append(items, *currentItem)
	}

	return items
}

// ArchiveMonth represents a month grouping in the archive
type ArchiveMonth struct {
	Name      string // e.g., "January 2026"
	SortKey   string // e.g., "2026-01" for sorting
	ItemCount int
}

// LoadArchiveMonths returns list of months that have archived items
func (l *Loader) LoadArchiveMonths() []Item {
	monthMap := make(map[string]*ArchiveMonth)

	// Get months from COMPLETED.md
	completed := l.GetCompletedItems()
	for _, c := range completed {
		month := c.Month
		if month == "" {
			month = "Unknown"
		}
		if _, exists := monthMap[month]; !exists {
			// Parse month to get sort key (e.g., "January 2026" -> "2026-01")
			sortKey := parseMonthSortKey(month)
			monthMap[month] = &ArchiveMonth{Name: month, SortKey: sortKey}
		}
		monthMap[month].ItemCount++
	}

	// Get months from archived project folders (yyyy-mm-dd-name format)
	archivePath := filepath.Join(l.RootDir, "para", "archive")
	entries, err := os.ReadDir(archivePath)
	if err == nil {
		for _, entry := range entries {
			if !entry.IsDir() || strings.HasPrefix(entry.Name(), ".") {
				continue
			}
			// Parse date from folder name (yyyy-mm-dd-name)
			if len(entry.Name()) >= 10 {
				dateStr := entry.Name()[:10]
				if t, err := time.Parse("2006-01-02", dateStr); err == nil {
					month := t.Format("January 2006")
					sortKey := t.Format("2006-01")
					if _, exists := monthMap[month]; !exists {
						monthMap[month] = &ArchiveMonth{Name: month, SortKey: sortKey}
					}
					monthMap[month].ItemCount++
				}
			}
		}
	}

	// Convert to sorted slice (most recent first)
	var months []*ArchiveMonth
	for _, m := range monthMap {
		months = append(months, m)
	}
	sort.Slice(months, func(i, j int) bool {
		return months[i].SortKey > months[j].SortKey // Descending
	})

	// Convert to Items
	var items []Item
	for _, m := range months {
		items = append(items, Item{
			Name:       m.Name,
			Path:       "ARCHIVE_MONTH:" + m.Name,
			IsFolder:   true,
			FolderType: FolderTypeCollection,
		})
	}

	return items
}

// parseMonthSortKey converts "January 2026" to "2026-01"
func parseMonthSortKey(month string) string {
	// Try parsing "January 2006" format
	t, err := time.Parse("January 2006", month)
	if err != nil {
		return "0000-00" // Unknown sorts last
	}
	return t.Format("2006-01")
}

// LoadArchiveItemsForMonth returns items for a specific month
func (l *Loader) LoadArchiveItemsForMonth(month string) []Item {
	var items []Item

	// Get completed items for this month
	completed := l.GetCompletedItems()
	for _, c := range completed {
		itemMonth := c.Month
		if itemMonth == "" {
			itemMonth = "Unknown"
		}
		if itemMonth == month {
			items = append(items, Item{
				Name:   c.Text,
				Path:   "COMPLETED:" + c.Text,
				IsTodo: true,
			})
		}
	}

	// Get archived project folders for this month
	archivePath := filepath.Join(l.RootDir, "para", "archive")
	entries, err := os.ReadDir(archivePath)
	if err == nil {
		for _, entry := range entries {
			if !entry.IsDir() || strings.HasPrefix(entry.Name(), ".") {
				continue
			}
			// Parse date from folder name (yyyy-mm-dd-name)
			if len(entry.Name()) >= 10 {
				dateStr := entry.Name()[:10]
				if t, err := time.Parse("2006-01-02", dateStr); err == nil {
					folderMonth := t.Format("January 2006")
					if folderMonth == month {
						info, _ := entry.Info()
						modTime := time.Time{}
						if info != nil {
							modTime = info.ModTime()
						}
						items = append(items, Item{
							Name:     entry.Name(),
							Path:     filepath.Join("para", "archive", entry.Name()),
							IsFolder: true,
							ModTime:  modTime,
						})
					}
				}
			}
		}
	}

	return items
}

// ArchiveTodoItem moves a TODO item to archive/COMPLETED.md
func (l *Loader) ArchiveTodoItem(todoText string) error {
	// Read current TODO.md
	todoPath := filepath.Join(l.RootDir, "TODO.md")
	content, err := os.ReadFile(todoPath)
	if err != nil {
		return err
	}

	// Find and remove the item from TODO.md
	lines := strings.Split(string(content), "\n")
	var newLines []string
	var removedItem string
	var removedDetails []string
	inRemovedItem := false

	for _, line := range lines {
		trimmed := strings.TrimSpace(line)

		// Check if this is the item to remove
		if strings.HasPrefix(trimmed, "- [ ]") && strings.Contains(trimmed, todoText) {
			inRemovedItem = true
			removedItem = trimmed
			continue
		}

		// If we're in the removed item, capture details
		if inRemovedItem {
			if strings.HasPrefix(trimmed, "- ") && !strings.HasPrefix(trimmed, "- [ ]") && !strings.HasPrefix(trimmed, "- [x]") {
				removedDetails = append(removedDetails, line)
				continue
			} else {
				inRemovedItem = false
			}
		}

		newLines = append(newLines, line)
	}

	// Write updated TODO.md
	err = os.WriteFile(todoPath, []byte(strings.Join(newLines, "\n")), 0644)
	if err != nil {
		return err
	}

	// Add to COMPLETED.md
	completedPath := filepath.Join(l.RootDir, "para", "archive", "COMPLETED.md")

	// Read existing COMPLETED.md or create new
	var completedContent string
	if existing, err := os.ReadFile(completedPath); err == nil {
		completedContent = string(existing)
	} else {
		completedContent = "# Completed Tasks\n\n"
	}

	// Create completed entry with date
	today := time.Now().Format("2006-01-02")
	// Change - [ ] to - [x] and add completion date
	completedEntry := strings.Replace(removedItem, "- [ ]", "- [x]", 1)
	if !strings.Contains(completedEntry, today) {
		// Add completion date if not already dated
		completedEntry = completedEntry + " ✓ " + today
	}

	// Insert after header (most recent first)
	headerEnd := strings.Index(completedContent, "\n\n")
	if headerEnd == -1 {
		headerEnd = len(completedContent)
	}

	var newCompleted strings.Builder
	newCompleted.WriteString(completedContent[:headerEnd+2])
	newCompleted.WriteString(completedEntry + "\n")
	for _, detail := range removedDetails {
		newCompleted.WriteString(detail + "\n")
	}
	if headerEnd+2 < len(completedContent) {
		newCompleted.WriteString(completedContent[headerEnd+2:])
	}

	return os.WriteFile(completedPath, []byte(newCompleted.String()), 0644)
}

// ArchiveProjectFolder moves a project folder to archive with date prefix
func (l *Loader) ArchiveProjectFolder(projectPath string) error {
	srcPath := filepath.Join(l.RootDir, projectPath)
	projectName := filepath.Base(projectPath)
	today := time.Now().Format("2006-01-02")
	archiveName := fmt.Sprintf("%s-%s", today, projectName)
	dstPath := filepath.Join(l.RootDir, "para", "archive", archiveName)

	return os.Rename(srcPath, dstPath)
}

// GetAllProjects returns unified list of projects (TODOs + para/projects folders)
func (l *Loader) GetAllProjects(staleDays int) []ProjectItem {
	var projects []ProjectItem

	// Get TODO items
	todos := l.GetTodoItems()
	for _, todo := range todos {
		projects = append(projects, ProjectItem{
			Name:     todo.Text,
			Path:     "", // No path for TODOs
			IsFolder: false,
			DaysOld:  todo.DaysOld,
			IsStale:  todo.DaysOld > staleDays,
			Details:  todo.Details,
		})
	}

	// Get project folders from para/projects
	projectsPath := filepath.Join(l.RootDir, "para", "projects")
	entries, err := os.ReadDir(projectsPath)
	if err == nil {
		for _, entry := range entries {
			if !entry.IsDir() || strings.HasPrefix(entry.Name(), ".") {
				continue
			}

			// Check README.md modification time
			readmePath := filepath.Join(projectsPath, entry.Name(), "README.md")
			info, err := os.Stat(readmePath)
			if err != nil {
				continue
			}

			daysOld := int(time.Since(info.ModTime()).Hours() / 24)
			projects = append(projects, ProjectItem{
				Name:     entry.Name(),
				Path:     filepath.Join("para", "projects", entry.Name()),
				IsFolder: true,
				DaysOld:  daysOld,
				IsStale:  daysOld > staleDays,
			})
		}
	}

	// Sort by days old (stalest first)
	sort.Slice(projects, func(i, j int) bool {
		return projects[i].DaysOld > projects[j].DaysOld
	})

	return projects
}

// RestoreCompletedItem moves a completed item back to TODO.md
func (l *Loader) RestoreCompletedItem(completedText string) error {
	// Read current COMPLETED.md
	completedPath := filepath.Join(l.RootDir, "para", "archive", "COMPLETED.md")
	content, err := os.ReadFile(completedPath)
	if err != nil {
		return err
	}

	// Find and remove the item from COMPLETED.md
	lines := strings.Split(string(content), "\n")
	var newLines []string
	var removedItem string
	var removedDetails []string
	inRemovedItem := false

	for _, line := range lines {
		trimmed := strings.TrimSpace(line)

		// Check if this is the item to remove
		if strings.HasPrefix(trimmed, "- [x]") && strings.Contains(trimmed, completedText) {
			inRemovedItem = true
			removedItem = trimmed
			continue
		}

		// If we're in the removed item, capture details
		if inRemovedItem {
			if strings.HasPrefix(trimmed, "- ") && !strings.HasPrefix(trimmed, "- [ ]") && !strings.HasPrefix(trimmed, "- [x]") {
				removedDetails = append(removedDetails, line)
				continue
			} else {
				inRemovedItem = false
			}
		}

		newLines = append(newLines, line)
	}

	if removedItem == "" {
		return fmt.Errorf("completed item not found: %s", completedText)
	}

	// Write updated COMPLETED.md
	err = os.WriteFile(completedPath, []byte(strings.Join(newLines, "\n")), 0644)
	if err != nil {
		return err
	}

	// Add back to TODO.md
	todoPath := filepath.Join(l.RootDir, "TODO.md")

	// Read existing TODO.md
	todoContent, err := os.ReadFile(todoPath)
	if err != nil {
		return err
	}

	// Convert - [x] back to - [ ] and strip completion marker
	restoredItem := strings.Replace(removedItem, "- [x]", "- [ ]", 1)
	// Remove completion date marker (✓ yyyy-mm-dd)
	if idx := strings.Index(restoredItem, " ✓ "); idx != -1 {
		restoredItem = restoredItem[:idx]
	}

	// Find "## In Progress" or "## Pending" section and insert there
	todoLines := strings.Split(string(todoContent), "\n")
	var newTodoLines []string
	inserted := false

	for i, line := range todoLines {
		newTodoLines = append(newTodoLines, line)

		// Insert after "## In Progress" or "## Pending" header
		if !inserted && (strings.HasPrefix(line, "## In Progress") || strings.HasPrefix(line, "## Pending")) {
			// Find next non-empty line or end of section
			insertIdx := i + 1
			for insertIdx < len(todoLines) && strings.TrimSpace(todoLines[insertIdx]) == "" {
				newTodoLines = append(newTodoLines, todoLines[insertIdx])
				insertIdx++
			}
			// Insert restored item
			newTodoLines = append(newTodoLines, restoredItem)
			for _, detail := range removedDetails {
				newTodoLines = append(newTodoLines, detail)
			}
			inserted = true
		}
	}

	// If no section found, append at end
	if !inserted {
		newTodoLines = append(newTodoLines, "", "## Pending", "", restoredItem)
		for _, detail := range removedDetails {
			newTodoLines = append(newTodoLines, detail)
		}
	}

	return os.WriteFile(todoPath, []byte(strings.Join(newTodoLines, "\n")), 0644)
}

// RestoreArchivedFolder moves an archived folder back to para/projects
func (l *Loader) RestoreArchivedFolder(archivePath string) error {
	srcPath := filepath.Join(l.RootDir, archivePath)
	folderName := filepath.Base(archivePath)

	// Remove the date prefix (yyyy-mm-dd-) from folder name
	originalName := folderName
	if len(folderName) > 11 && folderName[10] == '-' {
		// Check if it starts with a date
		if _, err := time.Parse("2006-01-02", folderName[:10]); err == nil {
			originalName = folderName[11:]
		}
	}

	dstPath := filepath.Join(l.RootDir, "para", "projects", originalName)

	// Check if destination already exists
	if _, err := os.Stat(dstPath); err == nil {
		return fmt.Errorf("project folder already exists: %s", originalName)
	}

	return os.Rename(srcPath, dstPath)
}

// LoadProjectItems returns Items for sidebar (TODOs + project folders)
func (l *Loader) LoadProjectItems(staleDays int) []Item {
	var items []Item

	// Get TODO items first
	todos := l.GetTodoItems()
	for _, todo := range todos {
		items = append(items, Item{
			Name:    todo.Text,
			Path:    "TODO:" + todo.Text, // Special marker for TODOs
			IsTodo:  true,
			DaysOld: todo.DaysOld,
			IsStale: todo.DaysOld > staleDays,
		})
	}

	// Get project folders
	projectsPath := filepath.Join(l.RootDir, "para", "projects")
	entries, err := os.ReadDir(projectsPath)
	if err == nil {
		for _, entry := range entries {
			if !entry.IsDir() || strings.HasPrefix(entry.Name(), ".") {
				continue
			}

			readmePath := filepath.Join(projectsPath, entry.Name(), "README.md")
			info, err := os.Stat(readmePath)
			if err != nil {
				continue
			}

			daysOld := int(time.Since(info.ModTime()).Hours() / 24)
			items = append(items, Item{
				Name:     entry.Name(),
				Path:     filepath.Join("para", "projects", entry.Name()),
				IsFolder: true,
				DaysOld:  daysOld,
				IsStale:  daysOld > staleDays,
				ModTime:  info.ModTime(),
			})
		}
	}

	// Sort: TODOs first (by staleness), then folders (by staleness)
	sort.Slice(items, func(i, j int) bool {
		// TODOs before folders
		if items[i].IsTodo != items[j].IsTodo {
			return items[i].IsTodo
		}
		// Within same type, sort by days old (stalest first)
		return items[i].DaysOld > items[j].DaysOld
	})

	return items
}
