# MyNotes MCP Server Integration Guide

## Overview

The MyNotes MCP (Model Context Protocol) server provides AI tools with direct access to your personal notes, tasks, specifications, dictations, and TODOs. This guide covers installation, configuration, and best practices for integrating the server with various AI tools.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [AI Tool Integration](#ai-tool-integration)
4. [Usage Patterns](#usage-patterns)
5. [Troubleshooting](#troubleshooting)
6. [Best Practices](#best-practices)

## Installation

### Prerequisites
- Python 3.8+ or Node.js 16+
- The MCP server package installed
- AI tool with MCP support (Claude, Cursor, etc.)

### Quick Start
```bash
# Clone the repository
git clone [repository-url]
cd mcp-server

# Install dependencies
pip install -r requirements.txt

# Start the server
./start.sh
```

### Verify Installation
```bash
# Check if server is running
curl http://localhost:8888/health

# Test a simple query
curl -X POST http://localhost:8888/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

## Configuration

### Server Configuration

The MCP server can be configured via environment variables:

```bash
# Port configuration
export MCP_PORT=8888

# Base path (where to search for content)
export MCP_BASE_PATH=/path/to/your/notes

# Enable semantic search (optional)
export MCP_ENABLE_SEMANTIC=true
```

### AI Tool Configuration

#### Claude Desktop
1. Update your `~/.claude/CLAUDE.md` file with MCP instructions
2. The updated file now includes MCP priority rules
3. No additional configuration needed - Claude will automatically use MCP functions

#### Cursor
1. Add MCP server to Cursor settings
2. See `cursor-mcp-instructions.md` for detailed setup
3. Configure keyboard shortcuts for quick access

#### Other Tools
Most MCP-compatible tools follow similar patterns:
1. Add server endpoint configuration
2. Include custom instructions for MCP priority
3. Set up authentication if required

## AI Tool Integration

### Available MCP Functions

1. **search_ai_content**
   - Purpose: Search across all content types
   - Parameters: query, category, date_filter, max_results
   - Use for: General searches, finding specific content

2. **get_task_context**
   - Purpose: Resume work on specific tasks
   - Parameters: task_name, include_related
   - Use for: Task continuation, context retrieval

3. **find_specs**
   - Purpose: Locate specification documents
   - Parameters: spec_name, date_filter
   - Use for: Finding design docs, requirements

4. **get_summaries**
   - Purpose: Access daily/project summaries
   - Parameters: date_filter, max_results
   - Use for: Reviews, status checks

5. **extract_todos**
   - Purpose: Find TODO items across content
   - Parameters: category, date_filter
   - Use for: Task management, pending items

### Integration Patterns

#### Pattern 1: Keyword-Based Routing
```javascript
if (query.includes("my") && query.includes(["notes", "tasks", "specs"])) {
  useMCPServer();
} else {
  useStandardTools();
}
```

#### Pattern 2: Priority Instructions
```markdown
ALWAYS check MCP server FIRST for:
- Personal content queries
- Previous work references
- Task continuations
```

#### Pattern 3: Explicit Mentions
```
@mynotes find authentication spec
@mcp search "API design"
```

## Usage Patterns

### Effective Query Patterns

#### Personal Content
✅ Good: "Show me my notes about authentication"
❌ Poor: "Show notes about authentication" (ambiguous ownership)

#### Temporal Queries
✅ Good: "What did I work on yesterday?"
❌ Poor: "Recent work" (too vague)

#### Task Continuation
✅ Good: "Continue working on the API redesign task"
❌ Poor: "API work" (unclear intent)

### Query Optimization

1. **Be Specific**
   - Include content type (notes, tasks, specs)
   - Add time references when relevant
   - Use personal pronouns (my, I)

2. **Use Categories**
   - Specify category to narrow results
   - Combine with date filters for precision
   - Default to "all" for broad searches

3. **Leverage Context**
   - Reference previous searches
   - Build on returned results
   - Use task names from search results

## Troubleshooting

### Common Issues

#### Server Not Responding
```bash
# Check server status
systemctl status mcp-server

# View logs
tail -f /var/log/mcp-server.log

# Restart server
./start.sh --restart
```

#### No Results Found
1. Verify content exists in the base path
2. Check date filter format (YYYY-MM-DD)
3. Try broader search terms
4. Ensure category matches content type

#### Slow Performance
1. Enable caching in server config
2. Limit max_results parameter
3. Use specific categories vs "all"
4. Check semantic search performance

### Debug Mode
```bash
# Enable debug logging
export MCP_DEBUG=true
./start.sh

# View detailed query analysis
curl http://localhost:8888/debug/last-query
```

## Best Practices

### For Users

1. **Consistent Naming**
   - Use consistent task names
   - Tag content appropriately
   - Follow date conventions

2. **Query Habits**
   - Start with broad searches
   - Refine based on results
   - Save successful patterns

3. **Content Organization**
   - Keep related content together
   - Use clear file names
   - Update summaries regularly

### For Developers

1. **Instruction Engineering**
   - Place MCP instructions prominently
   - Use clear trigger patterns
   - Provide fallback options

2. **Error Handling**
   - Gracefully handle server downtime
   - Provide helpful error messages
   - Suggest alternative queries

3. **Performance**
   - Cache frequent queries
   - Batch related searches
   - Monitor response times

### Security Considerations

1. **Access Control**
   - MCP server should only be accessible locally
   - Use authentication for remote access
   - Limit exposed endpoints

2. **Content Privacy**
   - Server searches only designated paths
   - No external data transmission
   - Local processing only

3. **Audit Trail**
   - Log access patterns
   - Monitor unusual queries
   - Regular security reviews

## Advanced Configuration

### Custom Keyword Mappings
See `keyword-mapping.json` for customizing:
- Trigger phrases
- Function routing
- Confidence scoring

### Semantic Search Setup
```bash
# Install sentence-transformers
pip install sentence-transformers

# Enable in config
export MCP_SEMANTIC_MODEL="all-MiniLM-L6-v2"
```

### Multi-User Setup
```json
{
  "users": {
    "default": {
      "base_path": "~/Documents/notes",
      "categories": ["notes", "tasks", "specs"]
    }
  }
}
```

## Conclusion

The MyNotes MCP server significantly improves AI tool effectiveness by providing direct access to personal content. Following these integration guidelines ensures optimal performance and user experience.

For questions or issues:
- GitHub Issues: [repository-url]/issues
- Documentation: [repository-url]/docs
- Community: [discord/slack channel]