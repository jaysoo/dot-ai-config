# Claude MCP Server Instructions

## CRITICAL: MCP Server Priority Rules

**ALWAYS use the MyNotes MCP server tools FIRST when users ask about:**
- Personal notes, dictations, specs, tasks, or TODOs
- Previous work, past tasks, or project history
- Searching for their own content or documentation
- Finding information they've saved or worked on before

## MCP Function Usage Guide

### 1. `mcp__MyNotes__search_ai_content` - Primary Search Tool
**Use this FIRST for any query about personal content**

Trigger phrases that MUST invoke this function:
- "my notes", "my dictations", "my specs", "my tasks", "my todos"
- "what did I work on", "previous work", "past tasks", "earlier work"
- "find my", "search my", "get my", "show my", "list my"
- "personal notes", "saved notes", "stored information"
- "remember when I", "did I mention", "have I worked on"
- "show me all", "what's in my", "retrieve my"

Parameters:
- `query`: The search terms (required)
- `category`: Use specific categories when mentioned:
  - "spec/specs" for specification documents
  - "task/tasks" for task-related content
  - "dictation/dictations" for voice notes
  - "all" (default) for comprehensive search
- `date_filter`: Apply when dates are mentioned (YYYY-MM-DD or YYYY-MM-DD..YYYY-MM-DD)
- `max_results`: Default 10, increase for "all" requests

### 2. `mcp__MyNotes__get_task_context` - Task Continuation
**Use when resuming or continuing specific tasks**

Trigger phrases:
- "continue working on [task]"
- "resume [task]"
- "get context for [task]"
- "what was I doing with [task]"
- "pick up where I left off"

### 3. `mcp__MyNotes__find_specs` - Specification Lookup
**Use for finding specification documents**

Trigger phrases:
- "find spec", "get specification"
- "show me the spec for"
- "specification document"
- "design document", "requirements"

### 4. `mcp__MyNotes__get_summaries` - Overview Access
**Use for daily/project summaries**

Trigger phrases:
- "daily summary", "project summary"
- "what happened on [date]"
- "overview of", "summary of work"
- "recap", "review"

### 5. `mcp__MyNotes__extract_todos` - TODO Management
**Use for finding action items**

Trigger phrases:
- "my todos", "todo list", "action items"
- "what needs to be done"
- "pending tasks", "outstanding items"
- "checklist", "to-do items"

## Priority Decision Tree

1. **User mentions personal content?** → Use MCP tools
2. **Query about files/code in current project?** → Use standard file tools
3. **General programming question?** → Answer directly
4. **Searching for information?** → Check if it's personal (use MCP) or general (use web/other tools)

## Examples of MCP-First Queries

```
User: "What specs do I have for the project?"
→ IMMEDIATELY use: mcp__MyNotes__find_specs(spec_name="*")

User: "Show me my notes from last week"
→ IMMEDIATELY use: mcp__MyNotes__search_ai_content(query="*", date_filter="2025-06-02..2025-06-08")

User: "What tasks did I work on today?"
→ IMMEDIATELY use: mcp__MyNotes__search_ai_content(query="*", category="tasks", date_filter="2025-06-09")

User: "Find my dictation about the API design"
→ IMMEDIATELY use: mcp__MyNotes__search_ai_content(query="API design", category="dictations")
```

## Response Pattern

When using MCP tools:
1. Call the appropriate MCP function immediately
2. Present the results clearly
3. Ask if the user needs more specific information
4. Suggest related MCP searches if relevant

## DO NOT Use MCP For:
- General programming questions
- External documentation lookup
- Code in the current repository (use file tools)
- System commands or configurations

## Error Handling

If MCP server is unavailable:
1. Inform the user the personal notes server is not accessible
2. Suggest checking if the MCP server is running
3. Offer alternative search methods as fallback

Remember: The MCP server contains the user's personal knowledge base. It should be the PRIMARY source for any query about their own work, notes, or documentation.