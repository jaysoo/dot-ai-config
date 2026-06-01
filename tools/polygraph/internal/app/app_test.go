package app

import (
	"strings"
	"testing"

	tea "github.com/charmbracelet/bubbletea"

	"github.com/jack/polygraph/internal/data"
)

func newSized(t *testing.T) Model {
	t.Helper()
	m := New(data.Sample(), "ocean")
	next, _ := m.Update(tea.WindowSizeMsg{Width: 120, Height: 34})
	return next.(Model)
}

func TestInitiatorPreselected(t *testing.T) {
	m := New(data.Sample(), "ocean")
	if !m.selected["ocean"] {
		t.Fatal("initiator should be pre-selected")
	}
	if got := m.SelectedRepos(); len(got) != 1 || got[0] != "ocean" {
		t.Fatalf("expected [ocean], got %v", got)
	}
}

func TestInitiatorCannotBeRemoved(t *testing.T) {
	m := newSized(t) // cursor at index 0 == "nx"
	// Move cursor to the initiator row.
	for m.visible()[m.cursor] != "ocean" {
		next, _ := m.Update(tea.KeyMsg{Type: tea.KeyDown})
		m = next.(Model)
	}
	next, _ := m.Update(tea.KeyMsg{Type: tea.KeySpace, Runes: []rune{' '}})
	m = next.(Model)
	if !m.selected["ocean"] {
		t.Fatal("toggling initiator must not deselect it")
	}
}

func TestToggleAndBands(t *testing.T) {
	m := newSized(t) // cursor on "nx"
	next, _ := m.Update(tea.KeyMsg{Type: tea.KeySpace, Runes: []rune{' '}})
	m = next.(Model)
	if !m.selected["nx"] {
		t.Fatal("nx should be selected after toggle")
	}
	dependents, selected, dependencies, up, down := m.bands()
	if !contains(selected, "nx") || !contains(selected, "ocean") {
		t.Fatalf("selected band missing repos: %v", selected)
	}
	// Many repos depend on nx, so it should have dependents and dependencies.
	if len(dependents) == 0 || len(dependencies) == 0 {
		t.Fatalf("expected non-empty bands, got deps=%v depc=%v", dependents, dependencies)
	}
	if len(up) == 0 || len(down) == 0 {
		t.Fatalf("expected edges, got up=%d down=%d", len(up), len(down))
	}
}

func TestFilter(t *testing.T) {
	m := newSized(t)
	next, _ := m.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune("/")}) // enter filter via the binding
	m = next.(Model)
	if !m.filtering {
		t.Fatal("expected filtering mode")
	}
	for _, r := range "template" {
		next, _ := m.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune{r}})
		m = next.(Model)
	}
	vis := m.visible()
	if len(vis) == 0 {
		t.Fatal("filter matched nothing")
	}
	for _, name := range vis {
		if !strings.Contains(name, "template") {
			t.Fatalf("filter leaked non-matching repo: %s", name)
		}
	}
}

func contains(s []string, v string) bool {
	for _, x := range s {
		if x == v {
			return true
		}
	}
	return false
}

// TestRenderSmoke makes sure View produces output with the key chrome.
func TestRenderSmoke(t *testing.T) {
	m := newSized(t)
	out := m.View()
	for _, want := range []string{"Select repositories", "dependents", "selected repos", "dependencies", "cannot be removed"} {
		if !strings.Contains(out, want) {
			t.Errorf("view missing %q", want)
		}
	}
}
