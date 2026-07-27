// Package graph renders the simplified dependency view shown to the right of
// the repo picker: three horizontal bands (dependents / selected / dependencies)
// with dotted connector lines between related repos.
package graph

import (
	"strings"

	"github.com/charmbracelet/lipgloss"
)

// Palette indices stored per canvas cell.
const (
	colNone = iota // unset / space
	colDim         // gray — labels and band separators
	colSel         // orange — selected nodes and their up-edges
	colDep         // blue — edges down to dependencies
)

var styles = map[int]lipgloss.Style{
	colDim: lipgloss.NewStyle().Foreground(lipgloss.Color("245")),
	colSel: lipgloss.NewStyle().Foreground(lipgloss.Color("215")),
	colDep: lipgloss.NewStyle().Foreground(lipgloss.Color("110")),
}

// Edge connects a selected repo to a node in an adjacent band.
type Edge struct {
	From string // selected repo name
	To   string // dependent or dependency name
}

// Render draws the graph into a width x height block of styled text.
//
// dependents are repos that depend on something in selected; dependencies are
// repos that something in selected depends on. up/down edges carry the
// connections that justify each outer node's presence.
func Render(width, height int, dependents, selected, dependencies []string, up, down []Edge) string {
	if width < 20 {
		width = 20
	}
	if height < 12 {
		height = 12
	}
	c := newCanvas(width, height)

	const margin = 16 // leaves room for the left-hand band labels
	depY := 2
	selY := height / 2
	depcY := height - 3

	depX := spread(dependents, margin, width, depY)
	selX := spread(selected, margin, width, selY)
	depcX := spread(dependencies, margin, width, depcY)

	// Dashed band separators.
	c.dashes(height/3, margin)
	c.dashes(2*height/3, margin)

	// Connector lines first, so node markers draw on top of them.
	for _, e := range up {
		if sx, ok := selX[e.From]; ok {
			if dx, ok := depX[e.To]; ok {
				c.line(sx, selY, dx, depY, colSel)
			}
		}
	}
	for _, e := range down {
		if sx, ok := selX[e.From]; ok {
			if dx, ok := depcX[e.To]; ok {
				c.line(sx, selY, dx, depcY, colDep)
			}
		}
	}

	// Nodes + labels. Outer bands stagger labels across two rows so dense
	// fans stay legible; the selected band keeps a single label row.
	slot := (width - margin - 2) / max(len(dependents), 1)
	drawBand(c, dependents, depX, depY, colDim, bandTop, slot)
	drawBand(c, selected, selX, selY, colSel, bandMid, 0)
	slot = (width - margin - 2) / max(len(dependencies), 1)
	drawBand(c, dependencies, depcX, depcY, colDim, bandBottom, slot)

	// Left-hand band captions.
	c.text(0, height/3, "dependents", colDim)
	c.text(0, selY-1, "selected repos", colDim)
	c.text(0, 2*height/3, "dependencies", colDim)

	return c.string()
}

type band int

const (
	bandTop band = iota
	bandMid
	bandBottom
)

// drawBand places a marker for each node and a label near it. The selected band
// uses a heavier marker and a single label row; the outer bands stagger labels
// across two rows (and trim them to the slot width) so dense fans stay legible.
func drawBand(c *canvas, names []string, xs map[string]int, y, col int, b band, slot int) {
	marker := '○'
	if b == bandMid {
		marker = '●'
	}
	maxLen := slot - 1
	if maxLen < 6 {
		maxLen = 6
	}
	for i, n := range names {
		x := xs[n]
		c.set(x, y, marker, col)

		label := trim(n, maxLen)
		switch b {
		case bandMid:
			c.textCentered(x, y+1, label, col)
		case bandTop: // labels above the marker, staggered
			if i%2 == 0 {
				c.textCenteredIfFree(x, y-1, label, col)
			} else {
				c.textCenteredIfFree(x, y-2, label, col)
			}
		case bandBottom: // labels below the marker, staggered
			if i%2 == 0 {
				c.textCenteredIfFree(x, y+1, label, col)
			} else {
				c.textCenteredIfFree(x, y+2, label, col)
			}
		}
	}
}

func trim(s string, max int) string {
	r := []rune(s)
	if len(r) <= max {
		return s
	}
	if max <= 1 {
		return string(r[:max])
	}
	return string(r[:max-1]) + "…"
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

// spread evenly distributes node x-positions across the usable width and
// returns a name->x map. The y argument is unused for layout but documents the
// band the positions belong to.
func spread(names []string, margin, width, _ int) map[string]int {
	out := make(map[string]int, len(names))
	n := len(names)
	if n == 0 {
		return out
	}
	usable := width - margin - 2
	if usable < 1 {
		usable = 1
	}
	for i, name := range names {
		out[name] = margin + (usable*(2*i+1))/(2*n)
	}
	return out
}

// --- styled rune canvas ---------------------------------------------------

type canvas struct {
	w, h  int
	runes [][]rune
	cols  [][]int
}

func newCanvas(w, h int) *canvas {
	runes := make([][]rune, h)
	cols := make([][]int, h)
	for y := 0; y < h; y++ {
		runes[y] = make([]rune, w)
		cols[y] = make([]int, w)
		for x := 0; x < w; x++ {
			runes[y][x] = ' '
		}
	}
	return &canvas{w: w, h: h, runes: runes, cols: cols}
}

func (c *canvas) set(x, y int, r rune, col int) {
	if x < 0 || y < 0 || x >= c.w || y >= c.h {
		return
	}
	c.runes[y][x] = r
	c.cols[y][x] = col
}

// setEmpty writes only when the target cell is still blank, used for connector
// lines so they never paint over a node marker or label.
func (c *canvas) setEmpty(x, y int, r rune, col int) {
	if x < 0 || y < 0 || x >= c.w || y >= c.h {
		return
	}
	if c.runes[y][x] == ' ' {
		c.runes[y][x] = r
		c.cols[y][x] = col
	}
}

func (c *canvas) text(x, y int, s string, col int) {
	for i, r := range []rune(s) {
		c.set(x+i, y, r, col)
	}
}

func (c *canvas) textCentered(cx, y int, s string, col int) {
	r := []rune(s)
	start := cx - len(r)/2
	if start < 0 {
		start = 0
	}
	for i, ch := range r {
		c.set(start+i, y, ch, col)
	}
}

// textCenteredIfFree writes a centered label only if its span is blank,
// returning whether it was placed. Used for staggered outer-band labels so
// neighbours don't overwrite each other.
func (c *canvas) textCenteredIfFree(cx, y int, s string, col int) bool {
	r := []rune(s)
	start := cx - len(r)/2
	if start < 0 {
		start = 0
	}
	for i := -1; i <= len(r); i++ { // require a blank cell of padding each side
		x := start + i
		if x < 0 || x >= c.w {
			continue
		}
		if y < 0 || y >= c.h {
			return false
		}
		if c.runes[y][x] != ' ' {
			return false
		}
	}
	for i, ch := range r {
		c.set(start+i, y, ch, col)
	}
	return true
}

func (c *canvas) dashes(y, fromX int) {
	for x := fromX; x < c.w-1; x += 2 {
		c.setEmpty(x, y, '╌', colDim)
	}
}

// line draws a dotted segment between two points (Bresenham), without
// clobbering existing content.
func (c *canvas) line(x0, y0, x1, y1, col int) {
	dx := abs(x1 - x0)
	dy := -abs(y1 - y0)
	sx := sign(x1 - x0)
	sy := sign(y1 - y0)
	err := dx + dy
	for {
		c.setEmpty(x0, y0, '·', col)
		if x0 == x1 && y0 == y1 {
			break
		}
		e2 := 2 * err
		if e2 >= dy {
			err += dy
			x0 += sx
		}
		if e2 <= dx {
			err += dx
			y0 += sy
		}
	}
}

func (c *canvas) string() string {
	var b strings.Builder
	for y := 0; y < c.h; y++ {
		// Emit runs of identical color so each segment is styled once.
		x := 0
		for x < c.w {
			col := c.cols[y][x]
			j := x
			for j < c.w && c.cols[y][j] == col {
				j++
			}
			seg := string(c.runes[y][x:j])
			if st, ok := styles[col]; ok && strings.TrimSpace(seg) != "" {
				b.WriteString(st.Render(seg))
			} else {
				b.WriteString(seg)
			}
			x = j
		}
		if y < c.h-1 {
			b.WriteByte('\n')
		}
	}
	return b.String()
}

func abs(n int) int {
	if n < 0 {
		return -n
	}
	return n
}

func sign(n int) int {
	switch {
	case n > 0:
		return 1
	case n < 0:
		return -1
	default:
		return 0
	}
}
