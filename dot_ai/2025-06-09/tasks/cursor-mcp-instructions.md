# Cursor AI MCP Integration Instructions

## Setting Up MCP in Cursor

### 1. Enable MCP Support
Cursor supports MCP (Model Context Protocol) servers. To configure the MyNotes MCP server:

1. Open Cursor Settings: `Cmd+,` (Mac) or `Ctrl+,` (Windows/Linux)
2. Navigate to: Features → Advanced → Model Context Protocol
3. Enable "Use Model Context Protocol servers"

### 2. Configure MCP Server Connection

Add the MyNotes MCP server to your Cursor configuration:

```json
{
  "mcp": {
    "servers": {
      "mynotes": {
        "command": "node",
        "args": ["/path/to/mcp-server/start.sh"],
        "env": {
          "PYTHONPATH": "/path/to/mcp-server"
        }
      }
    }
  }
}
```

### 3. Custom Instructions for Cursor

Add these instructions to your Cursor AI settings to prioritize MCP usage:

```
## MCP Server Priority

When I ask about my notes, tasks, specs, dictations, or previous work:
1. ALWAYS use the MyNotes MCP server functions first
2. Look for these keywords: "my", "I", "previous", "past", "saved"
3. Available MCP functions:
   - mcp__MyNotes__search_ai_content - Search all content
   - mcp__MyNotes__get_task_context - Resume tasks
   - mcp__MyNotes__find_specs - Find specifications
   - mcp__MyNotes__get_summaries - Get summaries
   - mcp__MyNotes__extract_todos - Find TODOs

Prioritize MCP over file search when looking for personal content.
```

## Cursor-Specific Features

### 1. Inline MCP Calls
In Cursor, you can trigger MCP functions inline:
- Type `@mynotes` to explicitly call the MCP server
- Use natural language after the mention

### 2. Context Window Integration
Cursor automatically includes MCP results in the context window. Configure max results:
```json
{
  "mcp": {
    "mynotes": {
      "maxResults": 10,
      "includeContext": true
    }
  }
}
```

### 3. Keyboard Shortcuts
Set up shortcuts for common MCP queries:
- `Cmd+Shift+N`: Search notes
- `Cmd+Shift+T`: Find tasks
- `Cmd+Shift+S`: Find specs

## Query Templates for Cursor

### Quick Search Commands
```
@mynotes find [topic]
@mynotes tasks from [date]
@mynotes spec [name]
@mynotes todos
@mynotes summary [date]
```

### Natural Language Patterns
- "Show my notes about [topic]"
- "Continue the [task name] task"
- "What specs exist for [feature]"
- "My todos for today"

## Troubleshooting in Cursor

### MCP Server Not Responding
1. Check if the server is running: `ps aux | grep mcp-server`
2. Verify the server path in settings
3. Check server logs: `tail -f ~/.mcp/logs/mynotes.log`

### Results Not Appearing
1. Ensure MCP is enabled in Cursor settings
2. Check that the server is returning valid JSON
3. Verify your query matches known patterns

### Performance Issues
1. Limit search results with `max_results` parameter
2. Use specific categories instead of "all"
3. Add date filters to narrow searches

## Best Practices for Cursor Users

1. **Use @mynotes mention** for explicit MCP calls
2. **Include context** in your queries for better results
3. **Save common queries** as snippets
4. **Review MCP logs** to understand query patterns

## Integration with Cursor Features

### Chat Mode
The MCP server works seamlessly in Cursor's chat mode. Just ask naturally:
- "What did I work on yesterday?"
- "Show me the authentication spec"
- "Continue my MCP server task"

### Command Palette
Add MCP commands to the command palette:
1. Open command palette: `Cmd+Shift+P`
2. Type "MCP" to see available commands
3. Configure custom commands in settings

### Multi-file Context
MCP results can be added to multi-file context:
1. Search with MCP
2. Click "Add to Context" on results
3. Use the combined context for coding