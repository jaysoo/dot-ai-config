# MCP Server Auto-Reindexing Implementation Plan

## Task Type
**Feature Enhancement** - Implementing automatic re-indexing for the MCP server when content changes

## Problem Statement
Currently, the MCP server indexes content only once during initialization. When new content is added to the `dot_ai` folder, the server doesn't detect these changes, requiring a restart to see new files. This creates a poor user experience and missed opportunities to search recent content.

## Solution Overview
Implement a lightweight change detection mechanism using directory hashing that checks for changes before each search operation and triggers re-indexing only when needed.

## Implementation Steps

### Step 1: Create Directory Hash Utility
Create a utility function to generate a fast hash of the `dot_ai` directory structure.

**Files to create/modify:**
- Create `mcp_ai_content_server/directory_monitor.py`

**Implementation details:**
- Hash based on directory modification times and file counts
- Use cached hash to avoid repeated filesystem operations
- Consider only structural changes (new files/folders), not content changes

**TODO:**
- [ ] Create `directory_monitor.py` module
- [ ] Implement `calculate_directory_hash()` function
- [ ] Add caching mechanism for hash values
- [ ] Write tests for hash calculation

### Step 2: Add Hash Storage to Content Indexer
Modify the content indexer to store and compare directory hashes.

**Files to modify:**
- `mcp_ai_content_server/content_indexer.py`

**Implementation details:**
- Add `last_hash` attribute to ContentIndexer
- Add `needs_reindex()` method to check if hash changed
- Add `refresh()` method for incremental indexing

**TODO:**
- [ ] Add hash storage attributes
- [ ] Implement `needs_reindex()` method
- [ ] Create `refresh()` method for re-indexing
- [ ] Update `initialize()` to store initial hash

### Step 3: Integrate Auto-Reindexing into Server
Modify the server to check for changes before each operation.

**Files to modify:**
- `mcp_ai_content_server/server.py`

**Implementation details:**
- Add `check_and_refresh_index()` method
- Call before each tool operation
- Make it async to avoid blocking

**TODO:**
- [ ] Add `check_and_refresh_index()` method
- [ ] Integrate checks into each tool function
- [ ] Add logging for reindex events
- [ ] Handle errors gracefully

### Step 4: Optimize Performance
Ensure the auto-reindexing doesn't impact performance.

**Implementation details:**
- Add configurable check intervals (e.g., max once per 5 seconds)
- Implement incremental indexing for new files only
- Add option to disable auto-reindexing

**TODO:**
- [ ] Add rate limiting for reindex checks
- [ ] Implement incremental indexing logic
- [ ] Add configuration options
- [ ] Profile and optimize hot paths

### Step 5: Add Tests and Documentation
Ensure the feature is well-tested and documented.

**Files to create/modify:**
- Create `tests/test_directory_monitor.py`
- Create `tests/test_auto_reindex.py`
- Update `README.md` with auto-reindexing info

**TODO:**
- [ ] Write unit tests for directory monitoring
- [ ] Write integration tests for auto-reindexing
- [ ] Update documentation
- [ ] Add usage examples

## Alternative Approaches Considered

1. **File System Watchers (watchdog library)**
   - Pros: Real-time detection, efficient
   - Cons: Additional dependency, platform-specific issues, complexity

2. **Periodic Background Task**
   - Pros: Predictable behavior, easy to implement
   - Cons: May miss changes, wastes resources checking when no changes

3. **Hash-based Check (chosen approach)**
   - Pros: Simple, portable, on-demand
   - Cons: Slight delay on first operation after changes

## Technical Considerations

1. **Hash Algorithm**: Use modification times + file counts for speed
2. **Cache Duration**: Store hash with timestamp, invalidate after 5 seconds
3. **Incremental Updates**: Track indexed files to avoid re-reading unchanged content
4. **Thread Safety**: Ensure indexing operations are thread-safe
5. **Memory Usage**: Clear old index entries when files are deleted

## Expected Outcome

When this task is completed:

1. The MCP server will automatically detect new content in the `dot_ai` folder
2. Re-indexing will happen transparently before search operations
3. Users will see up-to-date results without restarting the server
4. Performance impact will be minimal (<100ms for typical checks)
5. The feature can be configured or disabled if needed

## Success Criteria

- [ ] New files appear in search results within 5 seconds of creation
- [ ] No noticeable performance degradation for search operations
- [ ] Server remains stable under rapid file changes
- [ ] All existing functionality continues to work correctly
- [ ] Tests pass and documentation is complete

## Next Steps

After implementing the core functionality:
1. Monitor performance in production
2. Consider adding metrics/logging for reindex frequency
3. Evaluate if more sophisticated change detection is needed
4. Consider extending to watch other directories (if needed)