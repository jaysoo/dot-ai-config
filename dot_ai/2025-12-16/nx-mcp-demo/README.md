# Nx MCP Demo Kit

Demonstrate how Nx MCP transforms AI assistants from generic code helpers into architecturally-aware collaborators.

---

## Quick Start

```bash
# 1. Run setup (creates demo workspace)
chmod +x setup.sh
./setup.sh

# 2. Choose your tool:

# For Cursor:
cursor /tmp/nx-mcp-demo/nx-store-demo
# Then: Install Nx Console → Accept MCP prompt

# For Claude Code:
cd /tmp/nx-mcp-demo/nx-store-demo
claude mcp add nx-mcp -- npx nx-mcp@latest
claude
```

---

## Contents

| File | Purpose |
|------|---------|
| `setup.sh` | Creates fully configured demo workspace |
| `demo-cursor.md` | Step-by-step script for Cursor (GUI-focused) |
| `demo-claude-code.md` | Step-by-step script for Claude Code (terminal-focused) |
| `prompts.md` | Copy-paste prompts for each demo segment |
| `cheat-sheet.md` | Quick reference card for presenters |

---

## The Story

**Narrative:** Follow "Alex," a developer adding a "Cancel Orders" feature to an e-commerce monorepo.

**Three Acts:**
1. **Smart Code Generation** - AI uses Nx generators + adds intelligent integration
2. **Architectural Reasoning** - AI understands project graph and dependencies
3. **Documentation-Aware Config** - AI queries official Nx docs (no hallucination)

**Key Message:**
> "Nx MCP transforms your AI from a generic helper into an architecturally-aware collaborator that understands your workspace structure, uses your generators, and references official documentation."

---

## Demo Duration Options

| Version | Duration | Acts Included |
|---------|----------|---------------|
| Full | 7-10 min | All acts + closing |
| Standard | 5 min | Acts 1-3, skip impact analysis details |
| Quick | 3 min | Act 1 (generation) + Act 3 (docs) only |
| Lightning | 90 sec | Single "create feature" prompt |

---

## What You're Showing

### Without Nx MCP (Generic AI)
- Sees individual files, not architecture
- Generates code from scratch (inconsistent)
- Hallucinates configuration options
- Can't analyze cross-project impact

### With Nx MCP (Architecturally-Aware)
- Understands full project graph and relationships
- Uses vetted Nx generators (predictable scaffolding)
- Queries official Nx documentation (accurate config)
- Analyzes dependencies and impact across workspace

---

## Workspace Structure (After Setup)

```
nx-store-demo/
├── apps/
│   └── shop/                    # Main e-commerce app
├── libs/
│   ├── orders/
│   │   └── feat-current-orders/ # scope:orders, type:feature
│   ├── products/
│   │   └── feat-product-list/   # scope:products, type:feature
│   └── shared/
│       ├── ui-order-detail/     # scope:shared, type:ui
│       ├── ui-button/           # scope:shared, type:ui
│       └── data-access-order/   # scope:shared, type:data-access
└── docs/
    └── blog/                    # For CI failure scenario
```

---

## MCP Tools Demonstrated

| Tool | Demo Moment | What It Shows |
|------|-------------|---------------|
| `nx_workspace` | "What's the architecture?" | Full project graph understanding |
| `nx_generators` | "Create a new library" | Generator discovery |
| `nx_generator_schema` | Before generation | Understanding options |
| `nx_run_generator` | Cursor Generate UI | Human-in-the-loop flow |
| `nx_project_details` | "What depends on X?" | Single project deep-dive |
| `nx_docs` | Config questions | Documentation-backed answers |
| `nx_visualize_graph` | "Show me the graph" | Visual dependency map |

---

## Key Phrases (Messaging)

| Instead of... | Say... |
|---------------|--------|
| "AI writes code" | "AI uses vetted generators + intelligent integration" |
| "Faster coding" | "Eliminates context switching and architectural drift" |
| "Autocomplete" | "Architecturally-aware collaborator" |
| "Smart AI" | "AI that sees your project graph, not just files" |
| "No hallucination" | "Documentation-backed configuration" |

---

## Troubleshooting

**Cursor: MCP not activating**
- Ensure Nx Console extension is installed and active
- `Cmd+Shift+P` → "Nx: Configure MCP Server"
- Restart Cursor

**Claude Code: Tools not found**
```bash
claude mcp list              # Verify nx-mcp is registered
claude mcp remove nx-mcp     # Remove if broken
claude mcp add nx-mcp -- npx nx-mcp@latest  # Re-add
```

**Both: Slow first response**
- First MCP call builds the project graph (normal)
- Subsequent calls are faster
- Run `npx nx reset` if graph seems stale
