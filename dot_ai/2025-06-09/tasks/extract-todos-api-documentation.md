# Optimized extract_todos API Documentation

## Overview

The `extract_todos` function has been optimized to significantly reduce token usage while maintaining usefulness. The function now returns structured data with configurable verbosity levels and intelligent filtering.

## API Parameters

### Required Parameters
- `category` (str): Category to search in
  - Options: `"spec"`, `"specs"`, `"task"`, `"tasks"`, `"dictation"`, `"dictations"`, `"all"`
  - Default: `"all"`

### Optional Parameters
- `date_filter` (str): Filter by date or date range
  - Format: `"YYYY-MM-DD"` for exact date or `"YYYY-MM-DD..YYYY-MM-DD"` for range
  - Default: `None` (no date filtering)

- `verbosity` (str): Output detail level
  - Options: `"minimal"`, `"standard"`, `"detailed"`
  - Default: `"minimal"`

- `status_filter` (str): Filter by TODO status
  - Options: `"pending"`, `"completed"`, `"all"`
  - Default: `"pending"`

- `max_tokens` (int): Maximum token limit for response
  - Default: `20000` (stays well under the 25000 limit)

## Response Structure

```json
{
  "summary": {
    "total": 125,      // Total number of TODOs found
    "pending": 100,    // Number of pending TODOs
    "completed": 25,   // Number of completed TODOs
    "files": 10        // Number of files containing TODOs
  },
  "todos": {
    // File path -> TODO items mapping (format varies by verbosity)
  },
  "meta": {
    "verbosity": "minimal",
    "status_filter": "pending",
    "category": "tasks",
    "date_filter": null,
    "truncated": false,
    "estimated_tokens": 611
  }
}
```

## Verbosity Levels

### Minimal (`verbosity="minimal"`)
Most compact format, ideal for AI consumption:
```json
{
  "2025-06-09/tasks/file.md": {
    "p": ["TODO text 1", "TODO text 2"],  // Pending items (up to 5)
    "c": 3                                  // Completed count
  }
}
```

### Standard (`verbosity="standard"`)
Includes line numbers for better navigation:
```json
{
  "2025-06-09/tasks/file.md": {
    "pending": [
      {"l": 15, "t": "TODO text 1"},
      {"l": 22, "t": "TODO text 2"}
    ],
    "completed_count": 3
  }
}
```

### Detailed (`verbosity="detailed"`)
Full information including status and stats:
```json
{
  "2025-06-09/tasks/file.md": {
    "pending": [
      {"line": 15, "text": "TODO text 1", "status": "pending"},
      {"line": 22, "text": "TODO text 2", "status": "pending"}
    ],
    "completed": [
      {"line": 30, "text": "Completed task", "status": "completed"}
    ],
    "stats": {
      "total": 5,
      "pending": 2,
      "completed": 3
    }
  }
}
```

## Token Usage Examples

Based on testing with real data:

| Scenario | Files | TODOs | Verbosity | Tokens | % of Limit |
|----------|-------|-------|-----------|--------|------------|
| Tasks only, pending | 9 | 123 | minimal | 790 | 3.2% |
| All categories, one day | 5 | 62 | standard | 804 | 3.2% |
| Date range, all TODOs | 11 | 151 | detailed | 4,022 | 16.1% |

## Usage Examples

### Get pending tasks with minimal output
```python
result = await mcp__MyNotes__extract_todos(
    category="tasks",
    verbosity="minimal",
    status_filter="pending"
)
```

### Get all TODOs for today with line numbers
```python
result = await mcp__MyNotes__extract_todos(
    category="all",
    date_filter="2025-06-09",
    verbosity="standard",
    status_filter="all"
)
```

### Get detailed TODO report for date range
```python
result = await mcp__MyNotes__extract_todos(
    category="all",
    date_filter="2025-06-01..2025-06-09",
    verbosity="detailed",
    status_filter="all"
)
```

## Key Optimizations

1. **Abbreviated Paths**: Paths are shortened to start from the date folder
2. **Smart Truncation**: TODO text is limited to 100 characters
3. **Selective Loading**: Only requested information is included
4. **Compact JSON**: Minimal key names in minimal mode ("p", "c", "l", "t")
5. **Intelligent Limits**: Items per file are capped based on verbosity
6. **Token Monitoring**: Response includes token usage estimate

## Error Handling

The function returns error objects for invalid parameters:
```json
{
  "error": "category must be one of: spec, specs, task, tasks, dictation, dictations, all"
}
```

## Migration Guide

For existing code using the old API:
```python
# Old API (returns list)
todos = await extract_todos(category="all")

# New API (returns structured dict)
result = await extract_todos(category="all", verbosity="minimal")
todos_by_file = result["todos"]
```