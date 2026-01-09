# PARA TUI

A terminal UI for managing notes using the PARA method (Projects, Areas, Resources, Archive).

Built with [Bubble Tea](https://github.com/charmbracelet/bubbletea) and [Lip Gloss](https://github.com/charmbracelet/lipgloss).

## Features

- **Three-pane layout**: Sidebar, content list, and preview pane
- **Home dashboard**: Quick overview of projects and recently modified files
- **Quick capture**: Create new items with `n` key, optionally expand notes with Claude
- **Vim-style navigation**: `j/k`, `gg/G`, `h/l` for movement
- **Markdown preview**: Syntax-highlighted preview of README files
- **Claude integration**: Edit files with natural language using `e` key
- **Archive management**: Archive completed projects, restore from archive
- **Clipboard support**: Copy content (`y`) or file paths (`Y`)
- **Light/dark mode**: Automatically adapts to system theme

## Installation

### Personal Use

```bash
# From this directory
go install ./cmd/para

# Binary goes to $GOBIN or $GOPATH/bin
```

Or build directly:

```bash
go build -o para ./cmd/para
# Move to somewhere in your PATH
mv para ~/.local/bin/
# or
mv para /usr/local/bin/
```

### Sharing

If published to GitHub:

```bash
go install github.com/username/para/cmd/para@latest
```

Or distribute pre-built binaries:

```bash
# Build for current platform
go build -o para./cmd/para

# Cross-compile for other platforms
GOOS=linux GOARCH=amd64 go build -o para-linux-amd64 ./cmd/para
GOOS=darwin GOARCH=arm64 go build -o para-darwin-arm64 ./cmd/para
GOOS=windows GOARCH=amd64 go build -o para-windows-amd64.exe ./cmd/para
```

## Usage

```bash
para --para-dir /path/to/your/para/folder
```

The PARA directory should have this structure:

```
para/
  projects/
    project-name/
      README.md
  areas/
    area-name/
      README.md
  resources/
    resource-name/
      README.md
  archive/
    COMPLETED.md
    archived-project/
      README.md
TODO.md
```

## Keybindings

### Navigation

| Key | Action |
|-----|--------|
| `j` / `k` | Move down / up |
| `h` / `l` | Move left / right (between panes) |
| `gg` | Go to top |
| `G` | Go to bottom |
| `Tab` | Cycle through panes |
| `Enter` | Open / drill into selection |
| `Esc` | Go back |

### Quick Jumps

| Key | Action |
|-----|--------|
| `H` | Jump to Home |
| `1` | Jump to Projects |
| `2` | Jump to Areas |
| `3` | Jump to Resources |
| `4` | Jump to Archive |

### Actions

| Key | Action |
|-----|--------|
| `n` | New item (quick capture modal) |
| `e` | Edit with Claude |
| `a` | Archive item |
| `R` | Restore from archive |
| `y` | Copy content to clipboard |
| `Y` | Copy file path to clipboard |
| `q` | Quit |

## Requirements

- Go 1.21+
- `claude` CLI (optional, for AI-powered editing)

## License

MIT
