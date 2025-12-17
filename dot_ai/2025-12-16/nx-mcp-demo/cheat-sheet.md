# Nx MCP Demo Cheat Sheet

Quick reference for presenters. Print this out or keep it on a second screen.

---

## Setup Commands

```bash
# Create demo workspace
./setup.sh /tmp/nx-mcp-demo

# Cursor
cursor /tmp/nx-mcp-demo/nx-store-demo
# → Install Nx Console → Accept MCP prompt

# Claude Code
cd /tmp/nx-mcp-demo/nx-store-demo
claude mcp add nx-mcp -- npx nx-mcp@latest
claude
```

---

## The 5 Demo Beats

| # | Beat | Prompt | Tool Called |
|---|------|--------|-------------|
| 1 | **Architecture** | "What's the architecture of this workspace?" | `nx_workspace` |
| 2 | **Generation** | "Create feat-cancel-orders in orders domain" | `nx_generators` → `nx_run_generator` |
| 3 | **Integration** | "Connect it to shop app, same pattern as feat-current-orders" | `nx_project_details` |
| 4 | **Docs** | "Configure Nx Release with conventional commits" | `nx_docs` |
| 5 | **Impact** | "What's affected if I change ui-button?" | `nx_workspace` → `nx_visualize_graph` |

---

## Key Talking Points

**Opening:**
> "AI sees files, not architecture. Like navigating a city by only looking at one building."

**After Architecture Query:**
> "The AI now sees the complete project graph - domains, library types, dependencies."

**After Generation:**
> "Predictable generators + intelligent integration. Human reviews before execution."

**After Docs Query:**
> "No hallucination - this came from official Nx documentation."

**After Impact Analysis:**
> "Know the blast radius before making breaking changes."

**Closing:**
> "Install Nx Console, open an Nx workspace, click 'Yes' to the MCP prompt. That's it."

---

## MCP Tools Quick Reference

| Tool | What It Returns |
|------|-----------------|
| `nx_workspace` | Full project graph, all projects, relationships |
| `nx_generators` | List of available generators in workspace |
| `nx_generator_schema` | Options/parameters for a specific generator |
| `nx_run_generator` | Opens Nx Console Generate UI (Cursor) |
| `nx_project_details` | Single project's full config + dependencies |
| `nx_docs` | Relevant Nx documentation sections |
| `nx_visualize_graph` | Opens graph visualization in browser |

---

## Workspace Projects (For Reference)

```
apps/shop                        → Main app
libs/orders/feat-current-orders  → scope:orders, type:feature
libs/products/feat-product-list  → scope:products, type:feature
libs/shared/ui-order-detail      → scope:shared, type:ui
libs/shared/ui-button            → scope:shared, type:ui
libs/shared/data-access-order    → scope:shared, type:data-access
```

---

## If Things Break

| Problem | Fix |
|---------|-----|
| MCP not working (Cursor) | Cmd+Shift+P → "Nx: Configure MCP Server" → Restart |
| MCP not working (Claude) | `claude mcp remove nx-mcp` → `claude mcp add nx-mcp -- npx nx-mcp@latest` |
| Slow first response | Normal - building project graph. Wait. |
| Graph seems wrong | `npx nx reset` then try again |
| Generator fails | Run manually: `npx nx g @nx/react:library ...` |

---

## Messaging Don'ts

| Don't Say | Say Instead |
|-----------|-------------|
| "AI writes your code" | "AI uses generators + adds intelligent integration" |
| "It's magic" | "It queries the project graph Nx already maintains" |
| "Faster than manual" | "Eliminates context switching and architectural drift" |
| "Smart autocomplete" | "Architecturally-aware collaborator" |

---

## Time Checkpoints

| Time | You Should Be At |
|------|------------------|
| 0:00 | Opening / Problem statement |
| 0:30 | Act 1: Architecture query |
| 1:30 | Act 2: Generation prompt |
| 3:30 | Act 3: Documentation query |
| 5:30 | Act 4: Impact analysis |
| 6:30 | Closing |

---

## Emergency Prompts

If you need to restart or something goes wrong:

**Reset Demo:**
```bash
rm -rf /tmp/nx-mcp-demo && ./setup.sh
```

**Prove MCP is Working:**
```
What MCP tools are available for this Nx workspace?
```

**Skip to Best Part:**
```
Create a feat-cancel-orders library, connect it to the shop app,
and tell me what I'd need to configure to publish it to npm.
```
