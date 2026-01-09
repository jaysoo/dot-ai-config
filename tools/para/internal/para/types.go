package para

import "time"

// FolderType determines display behavior
type FolderType string

const (
	FolderTypeCategory   FolderType = "category"   // Shows subfolders only
	FolderTypeTopic      FolderType = "topic"      // Shows only README.md
	FolderTypeCollection FolderType = "collection" // Shows README.md + files
)

// Category represents a PARA category
type Category struct {
	Name  string
	Icon  string
	Path  string
	Color string
}

// Item represents a folder or file in the browser
type Item struct {
	Name       string
	Path       string
	IsFolder   bool
	IsTodo     bool       // True if this is a TODO item (not a file/folder)
	FolderType FolderType
	ModTime    time.Time
	GitStatus  string // M, A, ?, D, or empty
	DaysOld    int    // Age in days (for sorting/display)
	IsStale    bool   // True if older than stale threshold
}

// DefaultCategories returns the standard PARA categories
func DefaultCategories() []Category {
	return []Category{
		{Name: "Home", Icon: "󰠁", Path: "_home", Color: "#F7768E"},
		{Name: "Projects", Icon: "󰐕", Path: "para/projects", Color: "#7AA2F7"},
		{Name: "Areas", Icon: "󰑇", Path: "para/areas", Color: "#9ECE6A"},
		{Name: "Resources", Icon: "󰈙", Path: "para/resources", Color: "#BB9AF7"},
		{Name: "Archive", Icon: "󰀼", Path: "para/archive", Color: "#565F89"},
	}
}

// CollectionFolders returns paths that should be treated as collections
func CollectionFolders() []string {
	return []string{
		"para/areas/personnel",
		"para/areas/syncs",
		"para/resources/architectures",
		"para/resources/scripts",
	}
}
