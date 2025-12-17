# Nx MCP Demo: Claude Code Edition

**Duration:** 7-10 minutes
**Tool:** Claude Code (CLI)
**Theme:** Terminal-focused, showing tool calls and direct code generation

---

## Pre-Flight Checklist

```bash
# Run setup script
chmod +x setup.sh
./setup.sh /tmp/nx-mcp-demo

# Navigate to workspace
cd /tmp/nx-mcp-demo/nx-store-demo

# Add Nx MCP server to Claude Code
claude mcp add nx-mcp -- npx nx-mcp@latest

# Verify it's registered
claude mcp list
# Should show: nx-mcp

# Start Claude Code
claude
```

**Verify MCP is working:**
```
What projects are in this workspace?
```
You should see Claude use the `nx_workspace` tool.

---

## Demo Flow

### Opening: The Problem (30 seconds)

**Run in terminal before starting Claude:**
```bash
tree -L 3 -d libs/
```

**Say:**
> "This is a React monorepo with multiple domains - orders, products, shared libraries. A generic AI sees individual files. It doesn't understand that `feat-current-orders` is a feature library that should only depend on data-access and UI libraries, not on other features."

**Start Claude:**
```bash
claude
```

> "Claude Code with Nx MCP changes this. The AI gets a complete map of your project architecture."

---

### Act 1: Workspace Understanding (1 minute)

**Prompt:**
```
Explain the architecture of this workspace.
What projects exist, how are they organized, and what are the dependency relationships?
```

**Expected Output:** Claude calls `nx_workspace` and returns:
```
Using nx_workspace to analyze the project structure...

This workspace follows a domain-driven structure:

**Applications:**
- `shop` - Main e-commerce application

**Libraries by Domain:**

orders/
  - feat-current-orders (scope:orders, type:feature)
    → Shows current orders, depends on shared libs

products/
  - feat-product-list (scope:products, type:feature)
    → Product catalog display

shared/
  - ui-order-detail (scope:shared, type:ui)
  - ui-button (scope:shared, type:ui)
  - data-access-order (scope:shared, type:data-access)
    → API client for order operations

**Dependency Flow:**
shop → feat-current-orders → data-access-order, ui-order-detail
shop → feat-product-list → ui-button
```

**Say:**
> "Claude now understands the complete architecture - domains, library types, and how everything connects."

---

### Act 2: Smart Code Generation (3 minutes)

#### 2.1: Natural Language Request

**Prompt:**
```
Create a new feat-cancel-orders library in the orders domain.
Follow the same patterns as feat-current-orders.
Use the Nx generator, don't write files manually.
```

**Expected:** Claude will:
1. Call `nx_generators` to list available generators
2. Call `nx_generator_schema` for `@nx/react:library` options
3. Run the generator via shell command or `nx_run_generator`

**Say:**
> "Notice Claude is using the Nx generator, not writing boilerplate from scratch. This ensures the new library follows our workspace conventions."

#### 2.2: Watch the Tool Calls

**Expected tool sequence:**
```
Using nx_generators to find available generators...
Using nx_generator_schema to get options for @nx/react:library...
Running: npx nx g @nx/react:library feat-cancel-orders --directory=libs/orders/feat-cancel-orders --tags="scope:orders,type:feature"
```

**Say:**
> "The AI discovered the right generator, figured out the correct options based on existing patterns, and ran it. This is predictable scaffolding with intelligent parameter selection."

#### 2.3: Intelligent Integration

**Prompt:**
```
Now connect feat-cancel-orders to the shop app.
Look at how feat-current-orders is connected and follow the same pattern.
```

**Expected:** Claude will:
1. Read `apps/shop/src/app/app.tsx` to see existing pattern
2. Read `libs/orders/feat-current-orders` for dependency patterns
3. Edit files to wire everything up

**Say:**
> "Claude analyzed the existing code and applied the same integration pattern. It's not guessing - it's learning from your codebase."

---

### Act 3: Documentation-Aware Configuration (2 minutes)

**Prompt:**
```
Configure Nx Release in nx.json for the shared UI libraries.
Use conventional commits for versioning.
Look up the correct configuration in the Nx docs.
```

**Expected:** Claude calls `nx_docs` and generates config:
```
Using nx_docs to look up Nx Release configuration...

Based on the official documentation, here's the configuration:
```

Then edits `nx.json` with correct release config.

**Say:**
> "Claude queried the official Nx documentation. This isn't hallucinated configuration from training data - it's the current, correct syntax."

**Follow-up prompt:**
```
What are all the changelog renderer options available?
```

**Expected:** Claude uses `nx_docs` again to return accurate information.

**Say:**
> "Any configuration question gets answered from the source. No more outdated Stack Overflow answers."

---

### Act 4: Impact Analysis (1.5 minutes)

**Prompt:**
```
I'm planning to refactor the ui-button component's API.
What projects would be affected by this change?
```

**Expected Output:**
```
Using nx_project_details and nx_workspace to analyze dependencies...

Projects affected by changes to ui-button:

Direct dependents:
- feat-product-list (uses ui-button for product cards)

Indirect dependents:
- shop (imports feat-product-list)

Recommendation: Coordinate with the products team before making breaking changes.
```

**Say:**
> "Before any breaking change, you know exactly who's affected. No surprise broken builds."

**Follow-up:**
```
Show me a visualization of the affected projects.
```

**Expected:** Claude calls `nx_visualize_graph` which opens browser with graph.

---

### Act 5: Architectural Reasoning (1 minute)

**Prompt:**
```
I want to add a new "checkout" feature.
Based on the existing architecture, where should it go and what should it depend on?
```

**Expected:** Claude analyzes the workspace and suggests:
```
Based on the workspace architecture:

Recommended structure:
  libs/checkout/feat-checkout/

Tags: scope:checkout, type:feature

Dependencies to consider:
- data-access-order (for order submission)
- ui-button (for action buttons)

This follows the pattern where:
- Each domain has its own directory
- Feature libraries depend on shared data-access and UI
- Features don't import from other feature domains
```

**Say:**
> "The AI understands your architectural patterns and applies them to new features. It's not just following rules - it's reasoning about your specific codebase."

---

### Act 6: Quick Commands (30 seconds)

**Show rapid-fire queries:**

```
What generators can create Node.js libraries?
```

```
How do I run only the affected tests?
```

```
What's the correct way to add a new Nx plugin?
```

**Say:**
> "Any Nx question gets answered instantly with accurate, documentation-backed responses."

---

### Closing (30 seconds)

**Say:**
> "What you just saw in the terminal:
>
> **Architectural awareness** - Claude understands your project graph, not just files.
>
> **Generator-first approach** - predictable scaffolding, intelligent parameters.
>
> **Documentation-backed answers** - no hallucination, just current Nx docs.
>
> **Impact analysis** - know what breaks before you break it.
>
> To set this up: `claude mcp add nx-mcp -- npx nx-mcp@latest`. That's it. Your terminal AI now understands monorepo architecture."

---

## Quick Reference: Tool Calls You'll See

| Tool | What It Does | When You'll See It |
|------|--------------|-------------------|
| `nx_workspace` | Returns full project graph | "What's in this workspace?" |
| `nx_generators` | Lists available generators | "Create a new library" |
| `nx_generator_schema` | Generator options/defaults | Before running generator |
| `nx_project_details` | Single project's full config | "What does X depend on?" |
| `nx_docs` | Queries Nx documentation | Any configuration question |
| `nx_visualize_graph` | Opens graph in browser | "Show me the graph" |

---

## Backup Prompts

**If workspace query fails:**
```
Use the nx_workspace tool to show me all projects.
```

**If generator doesn't run:**
```
Run this command: npx nx g @nx/react:library feat-cancel-orders --directory=libs/orders/feat-cancel-orders --tags="scope:orders,type:feature" --no-interactive
```

**If docs query fails:**
```
Use the nx_docs tool to look up "nx release configuration"
```

---

## Troubleshooting

**MCP not working:**
```bash
# Check if registered
claude mcp list

# Remove and re-add
claude mcp remove nx-mcp
claude mcp add nx-mcp -- npx nx-mcp@latest

# Restart Claude
exit
claude
```

**Tool calls timing out:**
- First call may be slow (building project graph)
- Ensure you're in an Nx workspace root
- Run `npx nx reset` if graph is stale

**"Cannot find nx" errors:**
```bash
# Make sure you're in the workspace
pwd  # Should be /tmp/nx-mcp-demo/nx-store-demo

# Verify nx is available
npx nx --version
```
