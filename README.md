# dot-ai-config

Setup:

```
# From this repo
ln -s ../../hooks/pre-push .git/hooks/pre-push

# From other work repos
ln -s $HOME/projects/dot-ai-config/dot_ai .ai
```

Any pushes will sync up local AI preferences, and all dictations, plans, scripts, etc. will be in this repo and tracked in git.

## Claude Commands

The `dot_claude/commands/` directory contains specialized AI assistant commands:

- **brainstorm.md** - Triggers creative brainstorming sessions
- **dictate.md** - Records and organizes voice notes/dictations
- **plan-task.md** - Creates structured task plans with goals and steps
- **summarize.md** - Generates concise summaries of work or content

These commands help organize AI interactions into specific workflows. When you ask Claude to help with a task, dictate notes, or brainstorm ideas, it will automatically use the appropriate command template.

## MCP Server - MyNotes

The MCP (Model Context Protocol) server in `mcp-server/` provides a personal knowledge base for searching and retrieving your AI-generated content. It indexes all notes, tasks, specs, and dictations stored in the `dot_ai/` directory.

### Installation

```bash
# Install the MCP server (from mcp-server directory)
cd mcp-server
./setup/macos/install.sh  # For macOS

# Add to Claude
claude mcp add MyNotes -t sse http://127.0.0.1:8888/sse
```

### Features

The MyNotes server provides five main functions:

1. **Search Content** - Find any notes, tasks, specs, or dictations
2. **Get Task Context** - Resume previous work with full context
3. **Find Specs** - Locate specification documents
4. **Get Summaries** - Access daily work summaries
5. **Extract TODOs** - List all pending action items

### Example Prompts

Trigger the MCP server with phrases like:

- "Show me my notes about [topic]"
- "What tasks did I work on yesterday?"
- "Find my dictation about the API design"
- "Get the spec for [project]"
- "What's in my todo list?"
- "Resume working on [task name]"
- "Show me today's summary"

The server automatically categorizes content by type (tasks, specs, dictations) and supports date filtering. It runs continuously in the background, indexing new content as it's created.

