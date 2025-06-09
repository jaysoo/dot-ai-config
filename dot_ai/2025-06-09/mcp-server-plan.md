# MCP Server for AI Content Search Plan

## Overview

Create a Python MCP (Model Context Protocol) server that provides intelligent access to AI-generated plans, specifications, analyses, and other content stored in the `dot_ai/` directories. This server will enable seamless continuation of tasks and implementation of specifications by providing contextual search and retrieval capabilities.

## Current State Analysis

Based on the repository structure:
- `dot_ai/` contains dated folders (2025-06-02 through 2025-06-09) with AI-generated content
- Each folder contains diverse file types: markdown, JSON, JavaScript, text files
- Content includes summaries, analysis results, specifications, implementations, and research
- `dot_claude/` contains Claude-specific configurations and command templates
- Raw docs example system already implemented in `dot_ai/2025-06-09/raw-docs-example/`

## Architecture Design

### Document Categories (Filename-Based)
1. **specs**: Files starting or ending with "spec" (e.g., `raw-docs-system-spec.md`)
2. **tasks**: Files starting or ending with "task" or "implementation" (e.g., `phase-1-raw-docs-implementation.md`)
3. **dictations**: Files inside `dictations/` folders under dated directories
4. **all**: Complete file collection for comprehensive search

### Core Components
1. **MCP Server Framework**: Python-based server implementing MCP protocol
2. **Content Indexer**: Scans and indexes AI-generated content with filename-based categorization
3. **Search Engine**: Provides semantic and keyword-based search capabilities
4. **Context Extractor**: Extracts relevant context from files based on queries
5. **File Type Handlers**: Specialized parsers for different file formats

### MCP Tools to Implement
1. `search_ai_content` - Search across all AI-generated content with category filtering
2. `get_task_context` - Retrieve context for continuing specific tasks
3. `find_specs` - Locate specification files by filename patterns
4. `get_summaries` - Access summary files for quick overview
5. `extract_todos` - Find and extract TODO items from files

## Implementation Steps

### Step 1: Setup MCP Server Foundation
- Initialize Python project with MCP dependencies
- Set up basic server structure with proper MCP protocol handling
- Create configuration system for repository paths
- Implement logging and error handling

**Reasoning**: Establish solid foundation before adding complexity

### Step 2: Implement Content Discovery and Indexing
- Create file system scanner for `dot_ai/` directories (yyyy-mm-dd structure)
- Implement filename-based categorization:
  - **specs**: Files starting or ending with "spec" 
  - **tasks**: Files starting or ending with "task" or "implementation"
  - **dictations**: Files inside `dictations/` folders under dated directories
  - **all**: Complete file collection for comprehensive search
- Build metadata extraction prioritizing filename semantics over content
- Create in-memory index with file paths, categories, and filename-derived context

**Reasoning**: Filename-based categorization provides faster, more reliable classification than content analysis

### Step 3: Build Core Search Functionality
- Implement keyword-based search across file contents
- Add date-based filtering (by folder structure)
- Create category filtering (specs, tasks, dictations, all)
- Build relevance scoring prioritizing filename matches over content matches

**Reasoning**: Filename semantics are more important than content for accurate results

### Step 4: Add Semantic Search Capabilities
- Integrate text embedding for semantic similarity
- Implement context-aware search based on task continuity
- Add support for finding related content across time periods
- Create summary generation for search results

**Reasoning**: Semantic search crucial for finding relevant context when continuing tasks

### Step 5: Implement Specialized Content Extractors
- Build TODO/task item extractor
- Create specification parser for implementation guidance
- Implement summary aggregator across multiple files
- Add code snippet and example extractor

**Reasoning**: Specialized extractors provide targeted information for specific use cases

### Step 6: Create Task Continuation Support
- Implement logic to identify incomplete tasks
- Build context assembly for task continuation
- Create dependency tracking between related files
- Add progress tracking capabilities

**Reasoning**: Core value proposition is enabling task continuation

### Step 7: Add Advanced Features
- Implement content relationship mapping
- Add version tracking for evolving specifications
- Create export capabilities for found content
- Build integration points for external tools

**Reasoning**: Advanced features enhance usability and integration potential

### Step 8: Testing and Documentation
- Create comprehensive test suite
- Build integration tests with sample data
- Write API documentation
- Create usage examples and guides

**Reasoning**: Ensure reliability and usability

## Technical Considerations

### Dependencies
- `mcp` - MCP protocol implementation
- `fastapi` or similar for server framework
- `sentence-transformers` - For semantic search
- `pathlib` - File system operations
- `json`, `yaml` - Configuration and data parsing
- `markdown` - Markdown file processing
- `sqlite3` - Optional persistent indexing

### File Type Support
- **Markdown (.md)**: Parse headers, extract structured content
- **JSON (.json)**: Direct parsing for structured data
- **JavaScript (.js, .mjs)**: Extract comments and structure
- **Text (.txt)**: Full-text search
- **Shell scripts (.sh)**: Command extraction

### Performance Considerations
- Lazy loading of file contents
- Caching of search results
- Incremental indexing for large repositories
- Memory-efficient content processing

## Alternative Approaches

### Option A: SQLite-based Persistent Index
**Pros**: Faster searches, persistent across sessions
**Cons**: Additional complexity, disk space usage
**Decision**: Start with in-memory, add persistence later if needed

### Option B: External Search Engine (Elasticsearch)
**Pros**: Advanced search capabilities, scalability
**Cons**: Additional infrastructure, complexity
**Decision**: Keep simple initially, consider for future enhancement

### Option C: File Watching for Real-time Updates
**Pros**: Always up-to-date index
**Cons**: Resource usage, complexity
**Decision**: Implement manual refresh initially

## TODOs

- [ ] Set up Python MCP server project structure
- [ ] Implement basic MCP protocol handling
- [ ] Build file system scanner and filename-based categorization
- [ ] Create search functionality with keyword support and category filtering
- [ ] Add semantic search capabilities
- [ ] Implement specialized content extractors
- [ ] Build task continuation support features
- [ ] Add comprehensive testing
- [ ] Create documentation and usage examples
- [ ] Deploy and integration testing

## Expected Outcome

Upon completion, the MCP server will provide:

1. **Categorized Content Discovery**: Quickly find specs, tasks, dictations, or all content based on filename patterns
2. **Task Continuity**: Easily resume work on previous tasks with full context
3. **Specification Implementation**: Access detailed specs and implementation guidance
4. **Cross-temporal Analysis**: Understand evolution of ideas and decisions over time
5. **Efficient Context Retrieval**: Get relevant information without manual file browsing

The server will integrate with Claude Code and other AI tools, providing a centralized knowledge base of all AI-assisted work in the repository, enabling more efficient and informed development workflows.

## Success Metrics

- Ability to find relevant content in <2 seconds
- 90%+ accuracy in filename-based categorization
- Support for all major file types in the repository
- Seamless integration with existing workflows
- Minimal resource overhead (<100MB memory usage)