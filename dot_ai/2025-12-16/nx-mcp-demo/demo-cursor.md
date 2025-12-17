# Nx MCP Demo: Cursor Edition

**Duration:** 7-10 minutes
**Tool:** Cursor with Nx Console extension
**Theme:** Visual, GUI-focused demo showing Generate UI and inline suggestions

---

## Pre-Flight Checklist

```bash
# Run setup script
chmod +x setup.sh
./setup.sh /tmp/nx-mcp-demo

# Open in Cursor
cursor /tmp/nx-mcp-demo/nx-store-demo
```

**In Cursor:**
1. Install Nx Console extension (if not installed)
2. Look for notification: "Improve Copilot/AI agent with Nx-specific context"
3. Click "Yes" to enable MCP
4. Alternative: `Cmd+Shift+P` → "Nx: Configure MCP Server"

**Verify MCP is working:**
Open Cursor Chat (`Cmd+L`) and ask:
```
What projects are in this workspace?
```
You should see the AI call `nx_workspace` tool.

---

## Demo Flow

### Opening: The Problem (30 seconds)

**Show:** File explorer with all the libs expanded

**Say:**
> "This is a typical React monorepo - an e-commerce app with shared libraries, feature modules, and domain boundaries. When you ask a generic AI assistant for help, it sees files. It doesn't see that `feat-current-orders` is a feature library in the orders domain, or that it depends on `data-access-order` for API calls."

**Show:** Hover over a library to show its tags in Nx Console

> "Nx already knows all of this - the project graph, the tags, the dependencies. Nx MCP lets your AI see it too."

---

### Act 1: Workspace Understanding (1 minute)

**Open Cursor Chat** (`Cmd+L`)

**Prompt:**
```
What is the architecture of this workspace?
Show me how the projects are organized and what each one does.
```

**Expected:** AI uses `nx_workspace` and returns:
- Apps: `shop` (main application)
- Libs organized by domain: `orders/`, `products/`, `shared/`
- Tags explaining types: `type:feature`, `type:ui`, `type:data-access`
- Dependency relationships

**Say:**
> "The AI now sees the complete architectural picture. It understands that feature libraries depend on shared libraries, and it knows the domain boundaries."

---

### Act 2: Smart Code Generation (3 minutes)

#### 2.1: Natural Language Request

**Prompt:**
```
I need to add a new "Cancel Orders" feature to this workspace.
Create a React library for it in the orders domain.
Follow the same patterns as feat-current-orders.
```

**Expected Flow:**
1. AI calls `nx_generators` to find available generators
2. AI calls `nx_generator_schema` to understand `@nx/react:library` options
3. AI calls `nx_run_generator` → **Nx Console Generate UI opens**

**Say:**
> "Watch what happens. The AI doesn't just generate code - it opens the Nx Console Generate UI with pre-filled options."

#### 2.2: Human in the Loop

**Show:** The Generate UI with pre-filled values:
- Name: `feat-cancel-orders`
- Directory: `libs/orders/feat-cancel-orders`
- Tags: `scope:orders,type:feature`

**Say:**
> "This is the key philosophy: human in the loop. The AI accelerated the work, but you make the final decision. You can change the bundler, adjust the directory, or modify any option."

**Action:** Review options, click "Generate"

#### 2.3: Intelligent Integration

**After generation, prompt:**
```
Now connect the new feat-cancel-orders library to the shop application,
and add the same dependencies that feat-current-orders uses.
```

**Expected:** AI will:
1. Query project graph to see feat-current-orders dependencies
2. Add imports to feat-cancel-orders
3. Wire it into `apps/shop/src/app/app.tsx`
4. May add appropriate barrel exports

**Say:**
> "The AI analyzed the existing patterns. It saw that feat-current-orders depends on data-access-order and ui-order-detail, and it applied the same pattern to our new library. This is predictability plus intelligence."

---

### Act 3: Documentation-Aware Configuration (2 minutes)

**Prompt:**
```
I want to set up Nx Release to publish the shared UI libraries to npm.
Configure nx.json with conventional commits for versioning.
```

**Expected:**
1. AI calls `nx_docs` to query official Nx release documentation
2. AI understands current workspace structure
3. AI generates correct `nx.json` release configuration

**Say:**
> "Notice the AI is querying the official Nx documentation. It's not hallucinating configuration options from stale training data - it's getting the current, correct syntax."

**Show:** The generated configuration in `nx.json`

**Prompt (follow-up):**
```
What changelog format options does Nx Release support?
```

**Expected:** AI uses `nx_docs` again to return accurate documentation about changelog configuration.

**Say:**
> "Any time you're unsure about Nx configuration, the AI can look it up directly in the docs. No more guessing or Stack Overflow hunting."

---

### Act 4: Impact Analysis (1.5 minutes)

**Prompt:**
```
If I change the public API of the ui-button library,
which projects would be affected?
```

**Expected:** AI queries project graph and returns:
- Direct dependents
- Indirect dependents (transitive)
- May offer to visualize with `nx_visualize_graph`

**Say:**
> "Before making breaking changes, you instantly know the blast radius. The AI tells you exactly which teams need to be notified."

**Prompt (follow-up):**
```
Show me a visual graph of projects affected by changes to ui-button.
```

**Expected:** `nx_visualize_graph` opens the Nx graph visualization in browser

**Say:**
> "And you can visualize it directly. This is the project graph that powers all of Nx's intelligence - now your AI can see it too."

---

### Act 5: Module Boundary Enforcement (1 minute)

**Prompt:**
```
Set up module boundary rules so that:
- Feature libraries can only import from data-access and ui libraries
- Features cannot import from other features
- Only shared libraries can be imported across domains
```

**Expected:** AI uses `nx_docs` to look up `@nx/enforce-module-boundaries` and generates eslint configuration.

**Say:**
> "The AI understands architectural constraints. It can set up module boundaries that prevent architectural drift - ensuring your feature libraries stay decoupled."

---

### Closing (30 seconds)

**Say:**
> "What you just saw:
>
> **Workspace understanding** - the AI sees your architecture, not just files.
>
> **Smart generation** - predictable Nx generators plus intelligent integration, with human review before execution.
>
> **Documentation-aware config** - no hallucination, just current, accurate guidance.
>
> **Impact analysis** - know what breaks before you break it.
>
> To try this: install Nx Console in Cursor, open an Nx workspace, and click 'Yes' when it asks to improve your AI agent. That's it."

---

## Backup Prompts

If something doesn't work as expected, use these alternatives:

**Workspace Understanding:**
```
List all projects in this monorepo and explain their purpose based on their tags.
```

**Generator Discovery:**
```
What Nx generators are available for creating new React libraries?
```

**Dependency Analysis:**
```
What libraries does the shop application depend on?
```

**Documentation Query:**
```
How do I configure caching for custom targets in nx.json?
```

---

## Troubleshooting

**MCP tools not being called:**
- Check Nx Console is active (look for Nx icon in sidebar)
- Restart Cursor
- Re-run: `Cmd+Shift+P` → "Nx: Configure MCP Server"

**Generate UI not opening:**
- Ensure you're in the workspace root
- Check Nx Console output panel for errors
- Try: `Cmd+Shift+P` → "Nx: Generate"

**Slow responses:**
- First MCP call may be slow (building project graph)
- Subsequent calls should be faster
