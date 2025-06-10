# dot-ai-config

Setup:

```
# From this repo
ln -s ../../hooks/pre-push .git/hooks/pre-push

# From other work repos
ln -s $HOME/projects/dot-ai-config/dot_ai .ai
```

Any pushes will sync up local AI preferences, and all dictations, plans, scripts, etc. will be in this repo and tracked in git.

## MCP Server

The MCP server is running on port 8888.

To install use it run:

```
claude mcp add MyNotes -t sse http://127.0.0.1:8888/sse
```

