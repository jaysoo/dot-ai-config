# Nx MCP Demo Prompts

Copy-paste prompts for each demo segment. Organized by act.

---

## Act 1: Workspace Understanding

### Basic Architecture Query
```
What is the architecture of this workspace?
Show me how the projects are organized and what each one does.
```

### Alternative (More Specific)
```
List all projects in this monorepo.
Group them by their tags and explain the dependency relationships.
```

### Quick Version
```
What projects are in this workspace?
```

---

## Act 2: Smart Code Generation

### Main Generation Prompt
```
Create a new React library called feat-cancel-orders in the orders domain.
Follow the same patterns as feat-current-orders.
Use the appropriate Nx generator.
```

### Alternative (More Detailed)
```
I need to add a "Cancel Orders" feature to this workspace.
- Create a React library in libs/orders/feat-cancel-orders
- Use tags scope:orders and type:feature
- Use the Nx generator, don't write files manually
```

### Integration Follow-up
```
Now connect feat-cancel-orders to the shop application.
Look at how feat-current-orders is connected and follow the same pattern.
Add the same dependencies that feat-current-orders uses.
```

### Cursor-Specific (Opens Generate UI)
```
I need to add a new "Cancel Orders" feature to this workspace.
Create a React library for it in the orders domain.
Follow the same patterns as feat-current-orders.
```

---

## Act 3: Documentation-Aware Configuration

### Release Configuration
```
Configure Nx Release in nx.json for the shared UI libraries.
Use conventional commits for versioning.
Look up the correct configuration in the Nx docs.
```

### Follow-up Query
```
What changelog format options does Nx Release support?
```

### Module Boundaries
```
Set up module boundary rules so that:
- Feature libraries can only import from data-access and ui libraries
- Features cannot import from other features
- Only shared libraries can be imported across domains
```

### Caching Configuration
```
How do I configure custom caching for a target in nx.json?
Show me an example for a "deploy" target.
```

### Alternative Docs Queries
```
How do I configure Nx to use pnpm workspaces?
```

```
What's the correct way to set up affected commands with a custom base branch?
```

```
How do I add a new Nx plugin to this workspace?
```

---

## Act 4: Impact Analysis

### Basic Impact Query
```
If I change the public API of the ui-button library,
which projects would be affected?
```

### Visualization
```
Show me a visual graph of projects affected by changes to ui-button.
```

### Refactoring Analysis
```
I want to move the ui-order-detail library into a new design-system directory.
What would be affected and how should I approach this migration?
```

### Dependency Analysis
```
What libraries does the shop application depend on?
Show me the full dependency tree.
```

---

## Act 5: Architectural Reasoning

### New Feature Placement
```
I want to add a new "checkout" feature.
Based on the existing architecture, where should it go and what should it depend on?
```

### Code Ownership
```
If I need to modify the data-access-order library,
which teams should I coordinate with based on who owns the dependent projects?
```

### Architecture Recommendations
```
Are there any architectural concerns with the current workspace structure?
Any projects that might be violating the intended dependency rules?
```

---

## Lightning Demo (90 Seconds)

### Single Prompt That Shows Everything
```
I need to add a new "Cancel Orders" feature.
1. First, tell me about this workspace's architecture
2. Then create a React library for the feature in the orders domain
3. Use the Nx generator and follow existing patterns
4. Finally, tell me what configuration I'd need to publish this as an npm package
```

This single prompt will trigger:
- `nx_workspace` (architecture)
- `nx_generators` + `nx_generator_schema` (generation)
- `nx_docs` (release config)

---

## Backup Prompts (If Something Fails)

### If nx_workspace doesn't work
```
Use the nx_workspace MCP tool to show me all projects in this workspace.
```

### If generator doesn't run
```
Run this exact command:
npx nx g @nx/react:library feat-cancel-orders --directory=libs/orders/feat-cancel-orders --tags="scope:orders,type:feature" --no-interactive
```

### If docs query fails
```
Use the nx_docs MCP tool to look up "nx release configuration conventional commits"
```

### If visualization doesn't open
```
Run: npx nx graph --focus=ui-button
```

---

## Demo Closing Prompt

### Show It's Not Magic
```
What MCP tools did you use to answer my questions in this session?
```

This makes visible which tools were called, reinforcing that the AI has special access to Nx's intelligence.
