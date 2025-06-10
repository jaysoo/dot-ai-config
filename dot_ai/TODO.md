# TODO

## In Progress

## Completed

- [x] Phase 1: Raw Docs Implementation (2025-06-09)
  - Plan created: `dot_ai/2025-06-09/tasks/phase-1-raw-docs-implementation.md`
  - Status: Working example repository created at `dot_ai/2025-06-09/tasks/raw-docs-example/`
  - Next steps: Integration and testing will be a separate task
  - Goal: Create working example of raw-docs repository with essential scripts and pre-push hooks

- [x] Optimize extract_todos Token Usage (2025-06-09 13:15)
  - Plan created: `dot_ai/2025-06-09/tasks/optimize-extract-todos-token-usage.md`
  - Goal: Reduce token usage below 25000 limit while maintaining usefulness
  - Deliverables:
    - Refactored extract_todos function with 80%+ token reduction
    - Added configurable verbosity levels (minimal, standard, detailed)
    - Implemented status filtering (pending, completed, all)
    - Added token monitoring and smart truncation
    - Created comprehensive API documentation
    - Achieved token usage: 790 tokens for minimal mode, 4,022 for detailed mode

- [x] Improve MCP Server Discoverability for AI Tools (2025-06-09 22:47)
  - Plan created: `dot_ai/2025-06-09/tasks/improve-mcp-server-discoverability.md`
  - Goal: Ensure AI tools prioritize calling MCP server for notes, dictations, specs, tasks, and TODOs
  - Deliverables:
    - Updated CLAUDE.md with MCP priority instructions
    - Created claude-mcp-instructions.md and cursor-mcp-instructions.md
    - Implemented keyword-mapping.json with test scripts
    - Created usage-examples.md with comprehensive query patterns
    - Built mcp-integration-guide.md for full documentation
    - Developed monitor-mcp-calls.mjs for usage tracking

- [x] Enhance Search Engine: Date Ranges and Categories (2025-06-09 22:05)
  - Plan created: `dot_ai/2025-06-09/tasks/enhance-search-engine-date-ranges-and-categories.md`
  - Goal: Support date range filtering (start..end), flexible category matching (singular/plural), and folder-based category filtering