# MCP Server Usage Examples

This document provides comprehensive examples of queries that should trigger MCP server usage, along with the expected function calls and responses.

## Search Examples (mcp__MyNotes__search_ai_content)

### Basic Content Search
```
User: "Show me my notes about authentication"
Expected MCP Call: mcp__MyNotes__search_ai_content(query="authentication", category="notes")
```

```
User: "Find all my dictations from last week"
Expected MCP Call: mcp__MyNotes__search_ai_content(query="*", category="dictations", date_filter="2025-06-02..2025-06-08")
```

```
User: "What tasks did I work on yesterday?"
Expected MCP Call: mcp__MyNotes__search_ai_content(query="*", category="tasks", date_filter="2025-06-08")
```

### Memory and History Queries
```
User: "Did I mention anything about API design in my notes?"
Expected MCP Call: mcp__MyNotes__search_ai_content(query="API design")
```

```
User: "What have I worked on related to the MCP server?"
Expected MCP Call: mcp__MyNotes__search_ai_content(query="MCP server")
```

### Date-Based Searches
```
User: "Show me all my content from June 5th"
Expected MCP Call: mcp__MyNotes__search_ai_content(query="*", date_filter="2025-06-05")
```

```
User: "What did I save this week?"
Expected MCP Call: mcp__MyNotes__search_ai_content(query="*", date_filter="2025-06-03..2025-06-09")
```

## Specification Lookup (mcp__MyNotes__find_specs)

```
User: "What specs do I have for the raw docs system?"
Expected MCP Call: mcp__MyNotes__find_specs(spec_name="raw docs")
```

```
User: "Find the specification for authentication"
Expected MCP Call: mcp__MyNotes__find_specs(spec_name="authentication")
```

```
User: "Show me all my specification documents"
Expected MCP Call: mcp__MyNotes__find_specs(spec_name="*")
```

## Task Context Retrieval (mcp__MyNotes__get_task_context)

```
User: "Continue working on the MCP server enhancement"
Expected MCP Call: mcp__MyNotes__get_task_context(task_name="MCP server enhancement", include_related=true)
```

```
User: "Resume the authentication implementation"
Expected MCP Call: mcp__MyNotes__get_task_context(task_name="authentication implementation", include_related=true)
```

```
User: "Where did I leave off with the API redesign?"
Expected MCP Call: mcp__MyNotes__get_task_context(task_name="API redesign", include_related=true)
```

## Summary Access (mcp__MyNotes__get_summaries)

```
User: "Give me today's summary"
Expected MCP Call: mcp__MyNotes__get_summaries(date_filter="2025-06-09")
```

```
User: "Show me summaries from this week"
Expected MCP Call: mcp__MyNotes__get_summaries(date_filter="2025-06-03..2025-06-09")
```

```
User: "What's the latest project summary?"
Expected MCP Call: mcp__MyNotes__get_summaries(max_results=1)
```

## TODO Extraction (mcp__MyNotes__extract_todos)

```
User: "What are my pending todos?"
Expected MCP Call: mcp__MyNotes__extract_todos()
```

```
User: "Show me todos from my task files"
Expected MCP Call: mcp__MyNotes__extract_todos(category="tasks")
```

```
User: "What action items do I have from today?"
Expected MCP Call: mcp__MyNotes__extract_todos(date_filter="2025-06-09")
```

## Complex Query Examples

### Multi-Category Search
```
User: "Find everything I have about the database migration"
Expected MCP Call: mcp__MyNotes__search_ai_content(query="database migration", category="all")
Note: This searches across all categories (specs, tasks, dictations, notes)
```

### Date Range with Specific Content
```
User: "What specs did I create last month?"
Expected MCP Call: mcp__MyNotes__find_specs(spec_name="*", date_filter="2025-05-01..2025-05-31")
```

### Fuzzy Task Continuation
```
User: "I was working on something related to authentication, help me continue"
Expected Flow:
1. mcp__MyNotes__search_ai_content(query="authentication", category="tasks")
2. Based on results, use mcp__MyNotes__get_task_context(task_name="[found task name]")
```

## Query Patterns That Should NOT Use MCP

These examples show queries that should use other tools instead:

```
User: "How do I use React hooks?"
→ General programming question - use web search or answer directly

User: "Show me the package.json file"
→ Current project file - use Read tool

User: "What's the Python syntax for list comprehension?"
→ Programming reference - answer directly

User: "Search GitHub for authentication libraries"
→ External search - use web search

User: "Read the official Node.js documentation"
→ External documentation - use web fetch or provide link
```

## Best Practices for Users

1. **Use possessive language**: "my notes", "my tasks", "my work"
2. **Be specific about timeframes**: "yesterday", "last week", "June 5th"
3. **Mention content types**: "dictation", "spec", "task", "todo"
4. **Use action verbs**: "find", "show", "get", "search", "continue"

## Response Templates for AI

When MCP functions return results:

### Found Content
```
I found [X] items matching your query in your [category]:

1. **[Title/Date]**: [Brief preview]
2. **[Title/Date]**: [Brief preview]

Would you like me to show more details about any of these?
```

### No Results
```
I couldn't find any [category] matching "[query]" in your personal notes. 
Would you like me to:
- Search with different keywords?
- Look in a different category?
- Check a different date range?
```

### Task Continuation
```
I found the context for "[task name]":

**Last worked on**: [date]
**Status**: [from context]
**Related files**: [list]

[Show relevant context]

Shall I help you continue from where you left off?
```