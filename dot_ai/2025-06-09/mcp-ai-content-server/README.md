# MCP AI Content Server

An MCP (Model Context Protocol) server that provides intelligent access to AI-generated content stored in `dot_ai/` directories.

## Features

- Search across AI-generated plans, specs, tasks, and dictations
- Filename-based content categorization
- Semantic search capabilities
- Task continuation support

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

```bash
mcp-ai-content-server
```

## Development

```bash
pip install -e ".[dev]"
pytest
```