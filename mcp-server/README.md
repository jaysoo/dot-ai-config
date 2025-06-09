# MCP AI Content Server

An MCP (Model Context Protocol) server that provides intelligent access to AI-generated content stored in `dot_ai/` directories.

## Features

- Search across AI-generated plans, specs, tasks, and dictations
- Filename-based content categorization
- Semantic search capabilities
- Task continuation support
- HTTP and stdio transport support

## Document Categories

- **specs**: Files starting or ending with "spec"
- **tasks**: Files starting or ending with "task" or "implementation"
- **dictations**: Files inside `dictations/` folders
- **all**: Complete file collection

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

## Development

```bash
pip install -e ".[dev]"
pytest
```
