# Individual Preference

These are preferences for myself (Jack Hsu - jack.hsu@gmail.com). 

I work at Nx and my contributions are mostly related to Nx CLI.

Don't be overly friendly or optimistic. Be terse.

## CRITICAL: Timezone

I am in Eastern Timezone, so make sure all dates and time uses ET.

## CRITICAL: Plan Mode and Tasks

Make sure to check @~/.claude/commands/plan-task.md for how tasks should be planned. Make sure there is a task .md file written down before executing phases and steps, and update the file as you go.

## CRITICAL: MCP Server Usage

**ALWAYS use the MyNotes MCP server tools FIRST when I ask about:**
- My notes, dictations, specs, tasks, or TODOs
- What I worked on previously or my past tasks
- Finding or searching my personal content
- Any information I've saved or documented before

### Quick MCP Function Reference:
- `mcp__MyNotes__search_ai_content` - Search all my content (notes, tasks, specs, dictations)
- `mcp__MyNotes__get_task_context` - Resume work on a specific task
- `mcp__MyNotes__find_specs` - Find specification documents
- `mcp__MyNotes__get_summaries` - Get daily/project summaries
- `mcp__MyNotes__extract_todos` - Find TODO items
- `mcp__gemini-collab__ask_gemini` - Ask Gemini a question -- useful to verify facts and double-check work
- `mcp__gemini-collab__gemini_code_review` - Get Gemini to review code, usful for coding tasks
- `mcp__gemini-collab__gemini_brainstorm` - Brainstorm with Gemini, useful when in brainstorm session

**Priority**: When I mention "my" content or ask about previous work, IMMEDIATELY use the appropriate MCP function before trying other tools.

# Claude MCP Server Instructions

### CRITICAL: MCP Server Priority Rules

**ALWAYS use the MyNotes MCP server tools FIRST when users ask about:**
- Personal notes, dictations, specs, tasks, or TODOs
- Previous work, past tasks, or project history
- Searching for their own content or documentation
- Finding information they've saved or worked on before

### MCP Function Usage Guide

#### 1. `mcp__MyNotes__search_ai_content` - Primary Search Tool
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

#### 2. `mcp__MyNotes__get_task_context` - Task Continuation
**Use when resuming or continuing specific tasks**

Trigger phrases:
- "continue working on [task]"
- "resume [task]"
- "get context for [task]"
- "what was I doing with [task]"
- "pick up where I left off"

#### 3. `mcp__MyNotes__find_specs` - Specification Lookup
**Use for finding specification documents**

Trigger phrases:
- "find spec", "get specification"
- "show me the spec for"
- "specification document"
- "design document", "requirements"

#### 4. `mcp__MyNotes__get_summaries` - Overview Access
**Use for daily/project summaries**

Trigger phrases:
- "daily summary", "project summary"
- "what happened on [date]"
- "overview of", "summary of work"
- "recap", "review"

#### 5. `mcp__MyNotes__extract_todos` - TODO Management
**Use for finding action items**

Trigger phrases:
- "my todos", "todo list", "action items"
- "what needs to be done"
- "pending tasks", "outstanding items"
- "checklist", "to-do items"

### Priority Decision Tree

1. **User mentions personal content?** → Use MCP tools
2. **Query about files/code in current project?** → Use standard file tools
3. **General programming question?** → Answer directly
4. **Searching for information?** → Check if it's personal (use MCP) or general (use web/other tools)

### Examples of MCP-First Queries

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

### Response Pattern

When using MCP tools:
1. Call the appropriate MCP function immediately
2. Present the results clearly
3. Ask if the user needs more specific information
4. Suggest related MCP searches if relevant

### DO NOT Use MCP For:
- General programming questions
- External documentation lookup
- Code in the current repository (use file tools)
- System commands or configurations

### Error Handling

If MCP server is unavailable:
1. Inform the user the personal notes server is not accessible
2. Suggest checking if the MCP server is running
3. Offer alternative search methods as fallback

Remember: The MCP server contains the user's personal knowledge base. It should be the PRIMARY source for any query about their own work, notes, or documentation.

## Working With Tasks

- If it sounds like I'm asking you to perform a task then use @~/.claude/commands/plan-task.md
- If it sounds like I'm asking you to dictate notes then use @~/.claude/commands/dictate.md

## Pending tasks

- Store all pending tasks in `.ai/TODO.md` or `dot_ai/TODO.md` (whichever is present), and update it as things are checked off. Also add to the `yyyy-mm-dd` folder in `SUMMARY.md` that a task is pending.

For example,

```markdown
## In Progress

- [ ] Name of task (yyyy-mm-dd hh:mm)
  - Plan created: `dot_ai/yyyy-mm-dd/tasks/name-of-task.md`
  - Next steps: If there are any next steps mentioned in the task plan, there could also be a spec file under `yyyy-mm-dd/specs`
  - Goal: The goal according to the planned task and/or related specs
```

Where `yyyy-mm-dd hh:mm` is the timestamp.

## Completed tasks

- Move completed tasks in `.ai/TODO.md` or `dot_ai/TODO.md` (whichever is present) from the pending section to completed. Also add to the `yyyy-mm-dd` folder in `SUMMARY.md` that a task was completed.

```markdown
## Completed

- [x] Name of task (yyyy-mm-dd hh:mm)
  - Plan created: `dot_ai/yyyy-mm-dd/tasks/name-of-task.md`
  - Next steps: If there are any next steps mentioned in the task plan, there could also be a spec file under `yyyy-mm-dd/specs`
  - Goal: The goal according to the planned task and/or related specs
```

Where `yyyy-mm-dd hh:mm` is the timestamp.

