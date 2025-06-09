# Installation and Usage Guide

## Installation

1. **Install dependencies:**
   ```bash
   cd mcp-ai-content-server
   pip install -e .
   ```

2. **Install development dependencies (optional):**
   ```bash
   pip install -e ".[dev]"
   ```

## Usage

### As a standalone server

```bash
# Run the MCP server
mcp-ai-content-server
```

### As a library

```python
from mcp_ai_content_server.server import AIContentServer
from pathlib import Path

# Initialize with your content directory
server = AIContentServer(Path("/path/to/your/project"))
await server.run()
```

## Configuration

The server automatically scans for `dot_ai/` directories in the specified base path and indexes:

- **Specs**: Files starting or ending with "spec"
- **Tasks**: Files starting or ending with "task" or "implementation"  
- **Dictations**: Files inside `dictations/` folders
- **All**: Complete file collection

## Available Tools

1. **search_ai_content** - Search across AI-generated content
2. **get_task_context** - Retrieve context for continuing tasks
3. **find_specs** - Locate specification files
4. **get_summaries** - Access summary files
5. **extract_todos** - Find TODO items

## Testing

Run the test suite:

```bash
python run_tests.py
```

Or with pytest directly:

```bash
pytest tests/ -v
```

## Semantic Search

Semantic search is automatically enabled if `sentence-transformers` is available. To install:

```bash
pip install sentence-transformers
```

Without it, the server falls back to keyword-based search only.