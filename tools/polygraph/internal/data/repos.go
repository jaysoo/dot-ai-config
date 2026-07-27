// Package data holds the in-memory repo graph that Polygraph reads when a
// session is started. In the real tool this comes from a registry; here it's a
// small hand-curated sample that mirrors the screenshots.
package data

// Repo is a single known repository and the repos it directly depends on.
type Repo struct {
	Name      string
	DependsOn []string
}

// Sample returns the demo repo graph in display order (matches the TUI list).
func Sample() []Repo {
	return []Repo{
		{Name: "nx", DependsOn: []string{"polygraph-mcp", "nx-console"}},
		{Name: "dpe-tools", DependsOn: []string{"nx"}},
		{Name: "react-template", DependsOn: []string{"nx"}},
		{Name: "angular-template", DependsOn: []string{"nx"}},
		{Name: "typescript-template", DependsOn: []string{"nx"}},
		{Name: "empty-template", DependsOn: []string{"nx"}},
		{Name: "ai-benchmarks", DependsOn: []string{"nx"}},
		{Name: "nx-examples", DependsOn: []string{"nx"}},
		{Name: "nx-ai-agents-config", DependsOn: []string{"polygraph-mcp"}},
		{Name: "exec-briefing", DependsOn: nil},
		{Name: "polygraph-mcp", DependsOn: nil},
		{Name: "polygraph-skills", DependsOn: []string{"polygraph-mcp"}},
		{Name: "nx-blog", DependsOn: []string{"nx", "polygraph-docs"}},
		{Name: "nx-node-monorepo-deploy-tests", DependsOn: []string{"nx"}},
		{Name: "polygraph-docs", DependsOn: []string{"nx"}},
		{Name: "nx-console", DependsOn: nil},
		{Name: "ocean", DependsOn: []string{"nx", "nx-console", "nx-cloud-workflows"}},
		{Name: "monorepo.tools", DependsOn: []string{"nx"}},
		{Name: "nx-labs", DependsOn: []string{"nx"}},
		{Name: "cloud-infrastructure", DependsOn: nil},
		{Name: "nx-cloud-workflows", DependsOn: []string{"cloud-infrastructure"}},
	}
}

// Find returns a pointer to the named repo, or nil if it isn't known.
func Find(repos []Repo, name string) *Repo {
	for i := range repos {
		if repos[i].Name == name {
			return &repos[i]
		}
	}
	return nil
}
