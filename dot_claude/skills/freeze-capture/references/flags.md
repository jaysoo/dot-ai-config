# freeze flags reference

Full flag list for `charmbracelet/freeze`. Verified against `freeze --help` (v0.2.2).

## Modes

| Flag | Description |
|------|-------------|
| `<file>` | Read code from file. Language auto-detected from extension. |
| `-x`, `--execute "<cmd>"` | Run command, capture ANSI stdout/stderr. |
| `-i`, `--interactive` | TUI form for configuring all options. |

## Settings

| Short | Long | Default | Notes |
|-------|------|---------|-------|
| `-v` | `--version` | — | Print version. |
| `-c` | `--config` | — | Preset name (`base`, `full`, `user`) or path to JSON file. |
| `-l` | `--language` | auto | Override syntax language (`bash`, `typescript`, `haskell`, etc.). |
| `-t` | `--theme` | — | Syntax theme. See themes below. |
| `-w` | `--wrap` | — | Wrap lines at column width. |
| `-o` | `--output` | `out.svg` | `.svg`, `.png`, `.webp`. Format inferred from extension. |

## Window / layout

| Short | Long | Default | Notes |
|-------|------|---------|-------|
| `-b` | `--background` | — | CSS color (`#08163f`, `rgb(...)`, `transparent`). |
| `-m` | `--margin` | — | `N`, `V,H`, or `T,R,B,L`. Outside window. |
| `-p` | `--padding` | — | Same format. Inside window. |
| | `--window` | off | Show macOS-style traffic-light controls. |
| `-W` | `--width` | — | Terminal width in columns (or px depending on context). |
| `-H` | `--height` | — | Terminal height. |

## Border

| Long | Notes |
|------|-------|
| `-r`, `--border.radius` | Corner radius in px. |
| `--border.width` | Stroke thickness. |
| `--border.color` | CSS color. |

## Shadow

| Long | Notes |
|------|-------|
| `--shadow.blur` | Gaussian blur radius. |
| `--shadow.x` | Horizontal offset. |
| `--shadow.y` | Vertical offset. |

## Font

| Long | Default | Notes |
|------|---------|-------|
| `--font.family` | `JetBrains Mono` | Any installed font. Quote multi-word names. |
| `--font.file` | — | Path to TTF/OTF, embedded in SVG output. |
| `--font.size` | `14` | px. |
| `--font.ligatures` | off | Enable ligatures (`!=` → ≠ etc.). |
| `--line-height` | `1.2` | em. |

## Lines

| Long | Notes |
|------|-------|
| `--show-line-numbers` | Toggle gutter. |
| `--lines START,END` | Capture only that range (1-indexed, inclusive). |

## Config presets

| Preset | What you get |
|--------|--------------|
| `base` | Plain code snapshot, no chrome. |
| `full` | macOS window, padding, shadow, rounded corners. |
| `user` | Reads `~/.config/freeze/user.json`. |
| `./path.json` | Custom JSON. Keys mirror flag names. |

## Themes

Freeze uses Chroma themes. Common ones:
- Dark: `dracula`, `monokai`, `nord`, `catppuccin-mocha`, `catppuccin-frappe`, `github-dark`, `tokyo-night`, `one-dark`, `gruvbox`
- Light: `github`, `solarized-light`, `catppuccin-latte`, `monokailight`

Run `freeze --theme=?` (or any invalid name) to make freeze list available themes — output goes to stderr.

## Custom JSON config example

```json
{
  "background": "#0b0b1a",
  "theme": "dracula",
  "window": true,
  "padding": [40, 60],
  "margin": 30,
  "border": { "radius": 8 },
  "shadow": { "blur": 20, "y": 10 },
  "font": { "family": "JetBrains Mono", "size": 16 }
}
```

Use: `freeze -c ./my-style.json --execute "..." -o out.png`
