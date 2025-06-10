# Optimize extract_todos Token Usage

## Task Type
Enhancement to existing feature

## Problem Statement
The `extract_todos` function in the MCP server is returning too much content, exceeding the 25000 token limit. This makes it inefficient for AI consumption and limits the usefulness of the function.

## Objective
Optimize the `extract_todos` function to:
1. Return only actual TODO list items
2. Group them by the task files they belong to
3. Implement token-efficient compression strategies for AI consumption

## Analysis & Investigation

### Step 1: Analyze Current Implementation
- [x] Review `mcp-server/mcp_ai_content_server/content_extractors.py` to understand current extraction logic
- [x] Identify what extra content is being included beyond TODO items
- [x] Measure current token usage patterns

### Step 2: Research Token Optimization Strategies
- [x] Investigate JSON vs. other formats for token efficiency
- [x] Research compression techniques suitable for AI consumption
- [x] Analyze how grouping affects token usage

## Implementation Plan

### Step 3: Refactor extract_todos Function
- [x] Modify extraction logic to capture only TODO list items
- [x] Implement grouping by source task file
- [x] Remove unnecessary metadata and verbose content
- [x] Add token counting mechanism for monitoring

**Implementation details:**
- Extract only lines/blocks that match TODO patterns:
  - `- [ ]` or `- [x]` markdown checkboxes
  - `TODO:`, `FIXME:`, `NOTE:` prefixed comments
  - Numbered TODO lists
- Group by file path with minimal path representation
- Strip excessive whitespace and formatting

### Step 4: Implement Compression Strategies
- [x] Design concise output format optimized for AI
- [x] Implement configurable verbosity levels
- [x] Add summary statistics instead of full content where appropriate
- [x] Create abbreviated file path representation

**Compression strategies to implement:**
1. **Hierarchical grouping**: Group by date folder first, then by task file
2. **Abbreviated paths**: Use relative paths from base directory
3. **Compact JSON**: Minimize key names while maintaining clarity
4. **Content summarization**: For completed TODOs, optionally return only counts
5. **Smart truncation**: Limit TODO text to essential information

### Step 5: Add Configuration Options
- [x] Add parameters for verbosity level (minimal, standard, detailed)
- [x] Add option to filter by status (pending only, completed only, all)
- [x] Add option to limit results by date range
- [x] Add token limit parameter with smart truncation

### Step 6: Testing & Validation
- [x] Create test cases with large TODO datasets
- [x] Measure token usage before and after optimization
- [x] Validate grouping logic works correctly
- [x] Test all configuration options
- [ ] Ensure backward compatibility (API returns dict instead of list)

## Proposed Output Format

```json
{
  "summary": {
    "total_todos": 150,
    "pending": 45,
    "completed": 105,
    "files": 12
  },
  "todos_by_file": {
    "2025-06-09/tasks/task1.md": {
      "pending": [
        {"line": 15, "text": "Implement feature X"},
        {"line": 22, "text": "Write tests for Y"}
      ],
      "completed": 3  // Just count for completed
    },
    "2025-06-08/tasks/task2.md": {
      "pending": [
        {"line": 8, "text": "Review PR #123"}
      ]
    }
  },
  "token_usage": {
    "current": 2450,
    "limit": 25000
  }
}
```

## Alternative Approaches

1. **Streaming approach**: Return TODOs in chunks if exceeding token limit
2. **Priority-based filtering**: Return only high-priority TODOs by default
3. **AI-optimized encoding**: Use special encoding that AI models can decode efficiently
4. **Incremental updates**: Cache previous results and return only changes

## Expected Outcome

When completed, the `extract_todos` function will:
- Return content that consistently stays under 25000 tokens
- Provide only essential TODO information grouped logically
- Offer configuration options for different use cases
- Include token usage metrics for monitoring
- Maintain or improve usability while drastically reducing token consumption

## Next Steps

1. Begin with analyzing the current implementation in content_extractors.py
2. Create a benchmark script to measure current token usage
3. Implement the optimizations incrementally, testing after each change
4. Document the new API parameters and usage examples