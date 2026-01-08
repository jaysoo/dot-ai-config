# PARA TUI App Specification

**Created**: 2026-01-08
**Status**: Draft - Awaiting Review
**Author**: Jack Hsu + Claude

## Overview

A terminal user interface (TUI) application for managing personal knowledge using the PARA method (Projects, Areas, Resources, Archive). Built with Go and the Charmbracelet Bubbletea framework.

## Technology Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Language | Go 1.21+ | Fast compilation, excellent TUI ecosystem |
| TUI Framework | [Bubbletea](https://github.com/charmbracelet/bubbletea) | Elm architecture, active community |
| UI Components | [Bubbles](https://github.com/charmbracelet/bubbles) | Pre-built components (list, textinput, viewport) |
| Styling | [Lipgloss](https://github.com/charmbracelet/lipgloss) | CSS-like terminal styling |
| Markdown | [Glamour](https://github.com/charmbracelet/glamour) | Beautiful markdown rendering |
| Search | [Bleve](https://blevesearch.com/) | Full-text search indexing |

## Data Source

```
~/.ai/ (symlinked from ~/projects/dot-ai-config/dot_ai/)
└── para/
    ├── README.md              # PARA overview & AI instructions
    ├── projects/              # Active projects with deadlines
    │   ├── README.md          # Projects index
    │   └── my-project/        # Each project is a folder
    │       └── README.md      # Project content
    ├── areas/                 # Ongoing responsibilities
    │   ├── README.md          # Areas index
    │   ├── personnel/         # Team member notes
    │   │   ├── README.md      # Team overview table
    │   │   └── alice.md       # Individual files OK
    │   ├── syncs/             # Team sync meetings
    │   │   ├── README.md      # Syncs overview
    │   │   └── cli/           # Each team folder
    │   │       └── README.md  # CLI team notes
    │   └── productivity/      # Engineering metrics
    │       └── README.md      # Productivity content
    ├── resources/             # Reference materials
    │   ├── README.md          # Resources index
    │   ├── architectures/     # Repo architecture docs
    │   │   ├── README.md      # Architectures index
    │   │   └── nx-architecture.md
    │   └── scripts/           # Utility scripts
    │       ├── README.md      # Scripts index
    │       └── my-script.sh
    └── archive/               # Inactive items
        └── README.md          # Archive index
```

### Folder Structure Convention

**Key Rules:**
1. **Every folder has a README.md** - serves as overview, index, and instructions
2. **No orphaned files at category level** - create folder + README instead
3. **README.md is the primary content** - for single-document topics
4. **Sub-files only for collections** - personnel/, architectures/, scripts/

### Folder Types

The TUI needs to understand three folder types to display content correctly:

| Type | Description | Display Behavior | Examples |
|------|-------------|------------------|----------|
| **Category** | Top-level PARA folders | Show subfolders only | `projects/`, `areas/`, `resources/`, `archive/` |
| **Topic** | Single-document folders | Show only README.md (the content) | `areas/productivity/`, `projects/q1-planning/` |
| **Collection** | Folders with multiple similar items | Show README.md + all contents (files or subfolders) | `areas/personnel/`, `areas/syncs/` |

**Detection Logic:**
1. Check if path is a top-level PARA category → **Category**
2. Check if path is in `collection_folders` config → **Collection**
3. Otherwise → **Topic** (default)

**Special Case - Nested Collections:**
The `areas/syncs/` folder is a collection of team folders, where each team folder (cli/, dpe/, etc.) is a **Topic** containing only README.md:

```
areas/syncs/           # Collection - shows team folders
├── README.md
├── cli/               # Topic - shows only README.md
│   └── README.md
├── dpe/               # Topic - shows only README.md
│   └── README.md
└── ...
```

## User Interface Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PARA Manager                                          [?] Help  [q] Quit│
├──────────────┬──────────────────────────────────────────────────────────┤
│              │                                                          │
│  󰐕 Projects  │   INBOX - Items Needing Attention                        │
│  󰑇 Areas     │  ─────────────────────────────────────────────────────── │
│  󰈙 Resources │                                                          │
│  󰀼 Archive   │   STALE (7+ days)                                        │
│              │   ┌────────────────────────────────────────────────────┐ │
│  ───────────  │   │ ● NXC-3641: Template Updater          14d  [P]   │ │
│              │   │ ○ Fix #33047 file-server crash         73d  [P]   │ │
│  Quick       │   │ ○ Multiple Nx daemons issue            ~2mo [P]   │ │
│  [n] New     │   └────────────────────────────────────────────────────┘ │
│  [/] Search  │                                                          │
│  [e] Edit    │   IN PROGRESS (from TODO.md)                             │
│  [a] Archive │   ┌────────────────────────────────────────────────────┐ │
│              │   │ ● Cut patch release PR #34026          1d   [P]   │ │
│              │   │ ● Discuss Maven paywall w/ Victor      1d   [A]   │ │
│              │   └────────────────────────────────────────────────────┘ │
│              │                                                          │
│              │   RECENT ACTIVITY                                        │
│              │   ┌────────────────────────────────────────────────────┐ │
│              │   │ M productivity/README.md               2h   [A]   │ │
│              │   │   personnel/jason.md                   1d   [A]   │ │
│              │   │   personnel/README.md                  1d   [A]   │ │
│              │   └────────────────────────────────────────────────────┘ │
│              │                                                          │
├──────────────┴──────────────────────────────────────────────────────────┤
│ j/k:move  Enter:open  n:new  /:search  e:edit  a:archive  ?:help        │
└─────────────────────────────────────────────────────────────────────────┘
```

## Navigation & Keybindings

### Global Keys
| Key | Action |
|-----|--------|
| `q` / `Ctrl+C` | Quit application |
| `?` | Toggle help overlay |
| `Tab` / `Shift+Tab` | Switch between sidebar and main panel |
| `/` | Open search (fuzzy finder) |
| `Esc` | Close modal/search, return to previous view |

### List Navigation (vim-style)
| Key | Action |
|-----|--------|
| `j` / `↓` | Move down |
| `k` / `↑` | Move up |
| `g` / `Home` | Jump to top |
| `G` / `End` | Jump to bottom |
| `Ctrl+d` | Page down |
| `Ctrl+u` | Page up |

### Sidebar Navigation
| Key | Action |
|-----|--------|
| `h` / `←` | Focus sidebar |
| `l` / `→` / `Enter` | Expand category / Focus main panel |
| `1` | Jump to Projects |
| `2` | Jump to Areas |
| `3` | Jump to Resources |
| `4` | Jump to Archive |

### Actions
| Key | Action |
|-----|--------|
| `Enter` | Open item in preview pane |
| `e` | Open item in $EDITOR |
| `n` | New item (opens modal) |
| `a` | Archive selected item |
| `d` | Delete (with confirmation) |
| `r` | Refresh / Reload |
| `y` | Copy file path to clipboard |

## Features

### 1. Home Dashboard (Action-Focused Inbox)

The home view shows items needing attention, prioritized by staleness:

**Stale Items (7+ days without modification)**
- Sorted by days since last modified (oldest first)
- Shows: title, age, category badge
- Visual indicator: yellow/orange for 7-14d, red for 14d+

**In Progress (from TODO.md)**
- Parses `## In Progress` section from `dot_ai/TODO.md`
- Shows tasks with their linked plan files
- Checkmark indicators for subtasks

**Recent Activity**
- Files modified in last 48 hours
- Git status indicators (M=modified, A=added, ?=untracked)
- Grouped by time: "just now", "1h ago", "yesterday"

### 2. Category Browser

When selecting a PARA category from sidebar:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PARA Manager > Areas                                 [?] Help  [q] Quit│
├──────────────┬────────────────────────────┬─────────────────────────────┤
│              │                            │                             │
│  󰐕 Projects  │  󰉋 personnel/         2d  │  # Areas                    │
│  󰑇 Areas ▼   │  󰉋 syncs/             1d  │                             │
│    personnel │  󰉋 productivity/      2h  │  Ongoing responsibilities   │
│    syncs     │                            │  requiring regular          │
│    product…  │                            │  attention.                 │
│  󰈙 Resources │                            │                             │
│  󰀼 Archive   │                            │  ## Contents                │
│              │                            │  | Folder | Description |   │
│              │                            │  | personnel/ | Team... |   │
│              │                            │                             │
├──────────────┴────────────────────────────┴─────────────────────────────┤
│ j/k:move  Enter:open  n:new  e:edit  a:archive  /:search  Esc:back      │
└─────────────────────────────────────────────────────────────────────────┘
```

When drilling into a **collection folder** (like personnel/):

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PARA Manager > Areas > Personnel                     [?] Help  [q] Quit│
├──────────────┬────────────────────────────┬─────────────────────────────┤
│              │                            │                             │
│  󰐕 Projects  │  󰈙 README.md          2d  │  # Team Overview            │
│  󰑇 Areas ▼   │  󰈙 _template.md      30d  │                             │
│    personnel │  󰈙 altan.md           3d  │  Quick reference for team   │
│    syncs     │ ● 󰈙 andrew.md         1d  │  members.                   │
│    product…  │  󰈙 ben.md             7d  │                             │
│  󰈙 Resources │  󰈙 caleb.md           2h  │  | Name | Location | Notes ||
│  󰀼 Archive   │  󰈙 chau.md           14d  │  |------|----------|-------||
│              │  ...                      │  | Altan| Atlanta  | Quoka ||
│              │                            │  | Andrew| Barcelona| ...  ||
│              │                            │                             │
├──────────────┴────────────────────────────┴─────────────────────────────┤
│ j/k:move  Enter:open  n:new  e:edit  a:archive  /:search  Esc:back      │
└─────────────────────────────────────────────────────────────────────────┘
```

**Three-pane layout:**
1. **Sidebar** (left): PARA categories with expand/collapse
2. **Item List** (center): Folders or files depending on context
3. **Preview** (right): README.md content for folders, file content for files

**Display Logic:**
- **Category level** (projects/, areas/, resources/): Show subfolders
- **Collection folders** (personnel/, architectures/): Show README.md + individual files
- **Topic folders** (productivity/, my-project/): Show just README.md (the content)
- **Selecting a folder**: Preview shows its README.md

### 3. Quick Capture Modal

Triggered by pressing `n`:

```
┌────────────────────────────────────────────┐
│  New Item                                  │
├────────────────────────────────────────────┤
│                                            │
│  Title: [                               ]  │
│                                            │
│  Category: [Projects        ▼]             │
│            ┌─────────────────┐             │
│            │ 󰐕 Projects      │             │
│            │ 󰑇 Areas         │             │
│            │   └ personnel   │             │
│            │   └ syncs       │             │
│            │ 󰈙 Resources     │             │
│            └─────────────────┘             │
│                                            │
│  Notes (optional):                         │
│  ┌────────────────────────────────────┐    │
│  │                                    │    │
│  │                                    │    │
│  └────────────────────────────────────┘    │
│                                            │
│       [Cancel]           [Create]          │
│         Esc               Enter            │
└────────────────────────────────────────────┘
```

**Behavior:**
- Creates `folder/README.md` structure (not orphaned files)
- Uses template from `_template.md` if exists in target category
- Generates folder name: `lowercase-hyphenated/`
- If notes provided: passes to Claude for structured README generation
- Opens README.md in $EDITOR after creation
- For projects: auto-adds to TODO.md "In Progress" section

**Claude Integration for Notes:**

When the user provides notes (especially via speech-to-text like Superwhisper), the TUI can invoke Claude to generate a properly structured README.md:

```bash
# TUI executes this when notes are provided:
claude -p "Create a README.md for a new [category] called '[title]'.
Template: [contents of _template.md]
User notes: [user's notes/speech-to-text input]
Output only the markdown content, no explanation."
```

This enables natural language input like:
> "New project for the Q1 roadmap planning, need to coordinate with Victor on priorities, deadline is end of January"

To become a structured README.md with goal, tasks, and deadline filled in.

**Created Structure:**
```
# Creating "Q1 Planning" in projects/
para/projects/q1-planning/
└── README.md    # Generated by Claude from notes + template

# Creating "Alice" in areas/personnel/ (collection folder)
para/areas/personnel/alice.md    # Individual file OK in collections
```

### 4. Full-Text Search

Triggered by pressing `/`:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Search: productivity metrics_                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  󰑇 areas/productivity/README.md                              Score: 95 │
│    ...SPACE Framework with 7 key **metrics**: PR throughput...          │
│                                                                         │
│  󰈙 resources/architectures/ocean-architecture.md             Score: 72 │
│    ...tracking **productivity** and performance **metrics**...          │
│                                                                         │
│  󰐕 projects/eng-report/README.md                             Score: 68 │
│    ...Engineering **Productivity** Report for Victor...                 │
│                                                                         │
│  ───────────────────────────────────────────────────────────────────── │
│  [Tab] to filter: [All] [Projects] [Areas] [Resources] [Archive]        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Real-time fuzzy matching as you type
- Highlights matched terms in context
- Relevance scoring
- Category filtering with Tab
- Results sorted by score, then recency

### 5. Integrations

#### Linear Integration
- Detects Linear issue IDs in filenames (e.g., `NXC-3641-template-updater.md`)
- Shows clickable link in preview: `Linear: NXC-3641 ↗`
- URL format: `https://linear.app/nxdev/issue/{ISSUE-ID}`
- Also parses `Linear:` field from file frontmatter/content

#### Git Status Overlay
- Shows file status indicators:
  - `M` (yellow) = Modified
  - `A` (green) = Added/Staged
  - `?` (gray) = Untracked
  - `D` (red) = Deleted
- Respects `.gitignore`

#### Markdown Preview
- Renders markdown with Glamour
- Supports:
  - Headers, bold, italic
  - Code blocks with syntax highlighting
  - Tables
  - Checkboxes (for TODOs)
  - Links (clickable with $BROWSER)

## Configuration

Config file: `~/.config/para-tui/config.yaml`

```yaml
# PARA directory location
para_dir: "~/.ai/para"

# Editor to use (defaults to $EDITOR)
editor: "nvim"

# Theme (dark/light/auto)
theme: "dark"

# Stale threshold in days
stale_days: 7

# Icons (nerd/unicode/ascii)
icons: "nerd"

# Categories to show in sidebar
categories:
  - name: "Projects"
    icon: "󰐕"
    path: "projects"
    color: "#7AA2F7"
    type: "category"  # Shows subfolders only
  - name: "Areas"
    icon: "󰑇"
    path: "areas"
    color: "#9ECE6A"
    type: "category"
  - name: "Resources"
    icon: "󰈙"
    path: "resources"
    color: "#BB9AF7"
    type: "category"
  - name: "Archive"
    icon: "󰀼"
    path: "archive"
    color: "#565F89"
    type: "category"

# Folder type overrides (default: "topic" which shows only README.md)
# "collection" folders show README.md + all contents (files or subfolders)
collection_folders:
  - "areas/personnel"      # Shows README.md + person files (alice.md, bob.md)
  - "areas/syncs"          # Shows README.md + team folders (cli/, dpe/)
  - "resources/architectures"  # Shows README.md + architecture files
  - "resources/scripts"    # Shows README.md + script files

# TODO.md location for inbox integration
todo_file: "~/.ai/TODO.md"

# Search index location
search_index: "~/.cache/para-tui/search.bleve"

# Linear workspace for generating issue URLs
linear_workspace: "nxdev"
linear_url_template: "https://linear.app/{{workspace}}/issue/{{issue_id}}"

# Claude CLI for generating README content from notes
# Set to empty string to disable Claude integration
claude_command: "claude"
claude_prompt_template: |
  Create a README.md for a new {{category}} called '{{title}}'.
  Use this template structure:
  {{template}}

  User's notes (may be from speech-to-text):
  {{notes}}

  Output only the markdown content. Fill in relevant sections based on the notes.
  Keep sections empty if no relevant information was provided.
```

## Folder & File Templates

### Project Template (`para/projects/_template.md`)

Used when creating a new project folder. Content goes in `my-project/README.md`:

```markdown
# {{title}}

**Created**: {{date}}
**Status**: Active
**Deadline**:
**Linear**:

## Goal

[What does success look like?]

## Tasks

- [ ] Task 1
- [ ] Task 2

## Notes

```

### Area Template (`para/areas/_template.md`)

Used when creating a new area folder. Content goes in `my-area/README.md`:

```markdown
# {{title}}

**Created**: {{date}}
**Owner**: Jack Hsu

## Purpose

[What is this area about?]

## Current Focus

[What's the priority right now?]

## Notes

```

### Collection Item Template (`para/areas/personnel/_template.md`)

Used when adding items to a collection folder (creates individual file, not subfolder):

```markdown
# {{title}}

## Personal

- Location:
- Partner:
- Children:

## Professional

- Team:
- Role:
- Focus:

## 1:1 Notes

### {{date}}

- Topics discussed
```

## Implementation Phases

### Phase 1: Core Navigation (MVP)
- [ ] Basic Bubbletea app structure
- [ ] Sidebar with PARA categories
- [ ] Folder type detection (category/topic/collection)
- [ ] Folder/file list view with correct display logic
- [ ] Vim-style keybindings (hjkl, gg, G)
- [ ] Open README.md or files in $EDITOR

### Phase 2: Home Dashboard
- [ ] Stale items detection (folders by README.md mtime)
- [ ] TODO.md parsing for "In Progress" section
- [ ] Recent activity from git (README.md changes)
- [ ] Three-column layout with sections

### Phase 3: Preview & Search
- [ ] Markdown preview with Glamour
- [ ] Bleve full-text search indexing
- [ ] Fuzzy filtering by title/content
- [ ] Search result highlighting
- [ ] Category filtering

### Phase 4: Quick Capture
- [ ] Modal dialog component (title, category, notes)
- [ ] Template system (per-category _template.md)
- [ ] Folder creation for topics, file creation for collections
- [ ] Auto-naming: `lowercase-hyphenated`
- [ ] Claude CLI integration for notes → README generation
- [ ] Fallback to template-only if Claude unavailable
- [ ] TODO.md integration for projects

### Phase 5: Integrations
- [ ] Linear ID detection in filenames and content
- [ ] Git status overlay (M/A/?/D indicators)
- [ ] Clickable links (open in $BROWSER)
- [ ] Clipboard support (copy path with `y`)

### Phase 6: Polish
- [ ] Configuration file (~/.config/para-tui/config.yaml)
- [ ] Custom themes (dark/light/auto)
- [ ] Error handling and edge cases
- [ ] Help overlay and documentation

## Project Structure

```
para-tui/
├── cmd/
│   └── para-tui/
│       └── main.go              # Entry point
├── internal/
│   ├── app/
│   │   ├── app.go               # Main Bubbletea model
│   │   ├── keys.go              # Keybindings
│   │   └── messages.go          # Custom messages
│   ├── components/
│   │   ├── sidebar.go           # Category sidebar with expand/collapse
│   │   ├── browser.go           # Folder/file browser (handles all 3 types)
│   │   ├── preview.go           # Markdown preview pane
│   │   ├── inbox.go             # Home dashboard (stale, in-progress, recent)
│   │   ├── modal.go             # Quick capture modal dialog
│   │   └── search.go            # Full-text search interface
│   ├── para/
│   │   ├── loader.go            # Load PARA structure from disk
│   │   ├── folder.go            # Folder model with type detection
│   │   ├── item.go              # Item model (folder or file)
│   │   ├── templates.go         # Template loading and rendering
│   │   ├── create.go            # Create new folders/files
│   │   └── claude.go            # Claude CLI integration for README generation
│   ├── search/
│   │   ├── index.go             # Bleve indexing
│   │   └── query.go             # Search queries
│   ├── git/
│   │   └── status.go            # Git status integration
│   └── config/
│       └── config.go            # Configuration loading
├── go.mod
├── go.sum
└── README.md
```

### Key Types

```go
// FolderType determines display behavior
type FolderType string

const (
    FolderTypeCategory   FolderType = "category"   // Shows subfolders only
    FolderTypeTopic      FolderType = "topic"      // Shows only README.md
    FolderTypeCollection FolderType = "collection" // Shows README.md + files
)

// Item represents a folder or file in the browser
type Item struct {
    Name       string
    Path       string
    IsFolder   bool
    FolderType FolderType  // Only set if IsFolder
    ModTime    time.Time
    GitStatus  string      // M, A, ?, D, or empty
}
```

## Open Questions

1. **Archive workflow**: Should archiving prompt for reason/date, or just move?
2. **Sync integration**: Should we show sync meeting dates from the files?
3. **Personnel features**: Special view for upcoming events (weddings, etc.)?
4. **Mobile/SSH**: Need to work over SSH? (affects some styling choices)
5. **Notifications**: Any system notifications for stale items?

## References

- [PARA Method](https://fortelabs.com/blog/para/) - Tiago Forte
- [Bubbletea](https://github.com/charmbracelet/bubbletea) - TUI framework
- [Lazygit](https://github.com/jesseduffield/lazygit) - UI inspiration
- [awesome-tuis](https://github.com/rothgar/awesome-tuis) - TUI examples
