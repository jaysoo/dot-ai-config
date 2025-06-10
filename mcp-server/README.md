# MCP AI Content Server

An MCP (Model Context Protocol) server that provides intelligent access to AI-generated content stored in `dot_ai/` directories.

## Features

- Search across AI-generated plans, specs, tasks, and dictations
- Folder-based content categorization with filename fallback
- Date range filtering for search queries
- Flexible category names (singular/plural support)
- Semantic search capabilities
- Task continuation support
- HTTP and stdio transport support
- **Auto-reindexing**: Automatically detects and indexes new content without server restart

## Document Categories

The server supports flexible category naming with automatic normalization:

- **specs** / **spec**: Files in `specs/` folders or with "spec" in filename
- **tasks** / **task**: Files in `tasks/` folders or with "task"/"implementation" in filename
- **dictations** / **dictation**: Files in `dictations/` folders
- **all**: Complete file collection

## Search Syntax

### Date Filtering

Search supports both exact dates and date ranges:

```
# Exact date
date_filter="2025-06-09"

# Date range (inclusive)
date_filter="2025-06-01..2025-06-30"
```

### Category Filtering

Use either singular or plural forms:

```
# These are equivalent
category="spec"
category="specs"

# These are equivalent
category="task"
category="tasks"

# These are equivalent
category="dictation"
category="dictations"
```

### Example Searches

```python
# Search for API specs in June 2025
search_ai_content(query="API", category="spec", date_filter="2025-06-01..2025-06-30")

# Find all tasks from a specific date
search_ai_content(query="implementation", category="tasks", date_filter="2025-06-09")

# Search dictations with flexible naming
search_ai_content(query="meeting", category="dictation")
```

## Installation

```bash
pip install -e .
```

## Usage

### HTTP Transport (Default)

```bash
./start.sh
```

The server will start on `http://localhost:8888` by default.

### Custom Port

```bash
PORT=9000 ./start.sh
```

### stdio Transport

```bash
TRANSPORT=stdio ./start.sh
```

### Environment Variables

- `PORT`: HTTP server port (default: 8888)
- `TRANSPORT`: Transport protocol - `streamable-http` or `stdio` (default: streamable-http)

## HTTP Endpoints

When running with HTTP transport, the server provides endpoints for:
- Tool calls via POST requests
- Server-sent events for streaming responses
- Connection management and resumability

## Auto-Reindexing

The server automatically detects changes in the `dot_ai/` directory structure and reindexes content as needed. This happens transparently before each search operation:

- Uses lightweight directory hashing to detect changes
- Only reindexes when files are added, removed, or modified
- Minimal performance impact (< 100ms for typical checks)
- No server restart required when adding new content

## Development

```bash
pip install -e ".[dev]"
pytest
```
