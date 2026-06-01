# Polygraph (simplified)

A pared-down clone of the Polygraph multi-repo session picker. Running
`polygraph session start` opens a TUI where you pick which known repos to pull
into the current session; on confirm it prints the selected set.

Built with [Bubble Tea](https://github.com/charmbracelet/bubbletea) and
[Lip Gloss](https://github.com/charmbracelet/lipgloss).

This is a learning/demo reimplementation of the screens shown in the original
tool — it does not clone repos or start real sessions.

## What it shows

- **Left:** a checklist of known repositories. The initiator repo is
  pre-selected and cannot be removed.
- **Right:** a live dependency graph of the current selection, in three bands:
  - `dependents` — repos that depend on something you've selected
  - `selected repos` — your current selection
  - `dependencies` — repos your selection depends on

  Selected nodes and their up-edges are orange; edges down to dependencies are
  blue. The graph recomputes every time you toggle a repo.

## Run

```bash
# from this directory
go run ./cmd/polygraph session start

# or build a binary
go build -o polygraph ./cmd/polygraph
./polygraph session start --initiator nx
```

`session start` is optional — plain `polygraph` opens the same picker.

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `-i`, `--initiator <repo>` | repo to start the session from | `ocean` |
| `-h`, `--help` | show help | |

## Keys

| Key | Action |
|-----|--------|
| `up`/`k`, `down`/`j` | move cursor |
| `<space>` | toggle repo in/out of the session |
| `/` | filter the list (type to narrow, `enter`/`esc` to finish) |
| `<enter>` | confirm and print the selected repos |
| `<esc>` / `ctrl+c` | cancel |

## Layout

```
cmd/polygraph/      entry point + arg parsing
internal/data/      sample repo graph
internal/app/       Bubble Tea model (picker, filtering, band computation)
internal/graph/     styled-rune canvas that draws the three-band graph
```

The repo graph is hand-curated sample data in `internal/data/repos.go` — edit
that to change the repos and their `DependsOn` edges.

## Tests

```bash
go test ./...
```
