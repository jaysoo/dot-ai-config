---
name: freeze-capture
description: Capture terminal output or code as a static image (PNG/SVG/WebP) using charmbracelet/freeze. Use for proof-of-work screenshots when an agent finishes a task ("here's the green test run"), or for polished CLI/TUI demo stills for blog posts/social. NOT for animated demos — use terminal-demo-recorder (VHS) for those. Triggers on "freeze", "screenshot the output", "capture this command", "proof of work image", "make an image of", "snapshot the terminal".
---

# Freeze Capture

Static image of terminal output or code file. Two modes, same tool.

## Decide mode first

| Goal | Mode | Output |
|------|------|--------|
| Agent prove task worked (test passed, build succeeded, command ran) | **proof** | PNG, plain, no chrome |
| Demo for blog/social/README | **demo** | PNG/SVG, window chrome, theme, shadow |
| Code snippet from file (no execution) | **code** | SVG, syntax-highlighted |

## Proof-of-work (default for agents)

Goal: cheap, readable image showing command + output. Drop in task folder.

```bash
freeze --execute "<COMMAND>" \
  --output ".ai/$(date +%Y-%m-%d)/proof/<descriptive-name>.png" \
  --width 120 \
  --padding 20 \
  --background "#1e1e2e" \
  --theme "catppuccin-mocha"
```

Rules:
- Path: `.ai/YYYY-MM-DD/proof/` — create dir if missing.
- Name: describe what's proven (`pnpm-test-pass.png`, `nx-affected-build.png`). No timestamps in name (date already in path).
- Width 120 cols handles most CLI output without wrapping. Bump to 160 for wide tables.
- PNG, not SVG — proof images get embedded in PR descriptions / pasted into Slack. PNG renders everywhere.
- If command exits non-zero, **still capture it**. Failure proof is also proof.
- Reference the file path back to the user so they can open it.

Example flow when agent wraps task:

```bash
mkdir -p .ai/$(date +%Y-%m-%d)/proof
freeze --execute "nx test my-lib" -o .ai/$(date +%Y-%m-%d)/proof/my-lib-test.png -W 140 -p 20
```

## Demo (CLI/TUI showcase)

Goal: polished image for README, blog, X post. Window chrome on, shadow, generous padding.

```bash
freeze --execute "<COMMAND>" \
  --output demo.png \
  --window \
  --background "#0b0b1a" \
  --theme "dracula" \
  --padding 40,60 \
  --margin 30 \
  --border.radius 8 \
  --shadow.blur 20 --shadow.x 0 --shadow.y 10 \
  --font.family "JetBrains Mono" --font.size 16
```

Tune:
- Bigger font (16-20) for social where image gets downsized.
- `--width` and `--height` to enforce 16:9 or square aspect for X/LinkedIn.
- Strip ANSI cursor codes if TUI leaves artifacts: pipe through `sed -r "s/\x1B\[[0-9;]*[a-zA-Z]//g"` before capture, or use `script` for full PTY.

## Code-from-file

```bash
freeze src/lib/foo.ts --output foo.svg --window --show-line-numbers --theme dracula
freeze src/lib/foo.ts --output foo.png --lines 12,40   # only lines 12-40
```

SVG preferred for code — scales crisp, embeds in docs.

## Caveats

- **TUI capture is finicky.** Programs that redraw (htop, vim, nx graph) won't render their final state via `--execute`. For TUIs use VHS (terminal-demo-recorder skill) instead.
- **PNG file size**: a 120-col x ~30-row capture is ~5-8 MB at default settings. Drop `--font.size` to 12 or use SVG to shrink.
- **Color**: freeze respects ANSI in `--execute` output. If a CLI suppresses color when stdout isn't a TTY, force it (`FORCE_COLOR=1`, `--color always`, etc.) before piping into `--execute`.
- **No animation.** Single frame only. If user asks for "a recording" or "GIF", redirect to terminal-demo-recorder.
- **Exit code is preserved** by `--execute` — image still produced.

## After capture

1. Print the absolute path of the output file so the user can open it.
2. Bump `~/projects/dot-ai-config/USAGE.md` row for `freeze-capture` (date + count).

## More flags

See [references/flags.md](./references/flags.md) for the full list and [references/recipes.md](./references/recipes.md) for copy-paste presets.
