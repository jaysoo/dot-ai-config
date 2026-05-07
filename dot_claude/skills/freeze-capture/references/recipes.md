# freeze recipes

Copy-paste presets. Adjust paths/commands.

## Proof: test pass

```bash
freeze --execute "pnpm test --run my-lib" \
  -o .ai/$(date +%Y-%m-%d)/proof/test-pass.png \
  -W 140 -p 20 -b "#1e1e2e" -t catppuccin-mocha
```

## Proof: nx affected

```bash
freeze --execute "nx affected -t build,lint,test --base=main" \
  -o .ai/$(date +%Y-%m-%d)/proof/nx-affected.png \
  -W 160 -p 20
```

## Proof: failing test (still capture, exit code preserved)

```bash
freeze --execute "pnpm test --run broken || true" \
  -o .ai/$(date +%Y-%m-%d)/proof/test-fail.png \
  -W 140 -p 20
```

## Demo: README hero shot

```bash
freeze --execute "my-cli --help" \
  -o docs/assets/cli-help.png \
  --window --border.radius 8 \
  --shadow.blur 20 --shadow.y 10 \
  --padding 40,60 --margin 30 \
  --font.size 16 --font.family "JetBrains Mono" \
  -t dracula -b "#0b0b1a"
```

## Demo: square format for X/LinkedIn

```bash
freeze --execute "git log --oneline -10" \
  -o demo-square.png \
  -W 80 -H 30 \
  --window --border.radius 12 \
  --shadow.blur 30 --shadow.y 15 \
  --padding 50 --margin 40 \
  --font.size 18 \
  -t tokyo-night -b "#1a1b26"
```

## Code: snippet from file with line numbers

```bash
freeze src/main.ts -o snippet.svg \
  --window --show-line-numbers \
  --padding 30 --border.radius 8 \
  -t dracula -b "#282a36"
```

## Code: only lines 20-45

```bash
freeze src/main.ts -o snippet-trimmed.svg \
  --lines 20,45 --show-line-numbers \
  --window -t github-dark
```

## TUI / colored output that strips when piped

Force color before piping:

```bash
FORCE_COLOR=1 freeze --execute "FORCE_COLOR=1 npm test" -o test.png -W 140
```

For tools that detect TTY (chalk, kleur, ora):

```bash
freeze --execute "script -q /dev/null my-cli --pretty" -o demo.png -W 140
```

`script` wraps the command in a PTY so `isatty()` returns true.

## Save reusable style

`~/.config/freeze/user.json`:

```json
{
  "background": "#1e1e2e",
  "theme": "catppuccin-mocha",
  "padding": 20,
  "font": { "family": "JetBrains Mono", "size": 14 }
}
```

Then: `freeze -c user --execute "..." -o out.png`
