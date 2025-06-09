# Fix MCP Server Base Path and Convert to HTTP

## Task Overview

Convert the MCP AI Content Server from using current working directory to file-relative paths, and migrate from stdio to HTTP transport.

## Current Issues

1. **Base Path Issue**: `server.py:38` uses `Path.cwd().parent` which depends on where the process is started from, not where the file is located
2. **Transport Limitation**: Currently uses stdio transport which requires specific client setup, HTTP would be more flexible

## Implementation Plan

### Step 1: Fix Base Path Resolution
**Commit Message**: `fix: use file-relative base path instead of cwd`

- **Problem**: `self.base_path = base_path or Path.cwd().parent` in `server.py:38`
- **Solution**: Replace with `Path(__file__).parent.parent` (equivalent to Node.js `path.join(__dirname, '..')`
- **Files to modify**:
  - `mcp-server/mcp_ai_content_server/server.py:38`
- **Testing**: Verify server can find dot_ai directories regardless of where it's started from

### Step 2: Research MCP HTTP Transport
**Commit Message**: `chore: research mcp http transport capabilities`

- **Action**: Check MCP library documentation and source for HTTP server capabilities
- **Files to create**: `dot_ai/2025-06-09/mcp-http-research.mjs` (research script)
- **Goal**: Understand how to replace `stdio_server()` with HTTP equivalent

### Step 3: Add HTTP Transport Dependencies
**Commit Message**: `deps: add http transport dependencies for mcp server`

- **Files to modify**:
  - `pyproject.toml` - add any required HTTP dependencies
- **Research needed**: Check if additional dependencies are required for HTTP transport

### Step 4: Implement HTTP Server Transport
**Commit Message**: `feat: convert mcp server from stdio to http transport`

- **Files to modify**:
  - `mcp-server/mcp_ai_content_server/server.py`
    - Replace `stdio_server()` import and usage
    - Add HTTP server setup with port configuration
    - Add environment variable handling for PORT (default 8888)
- **Key changes**:
  - Import HTTP server components from MCP
  - Replace `run()` method implementation
  - Add port configuration: `port = int(os.environ.get("PORT", 8888))`
  - Update server startup to use `localhost:<port>`

### Step 5: Update Start Script and Documentation
**Commit Message**: `docs: update scripts and docs for http transport`

- **Files to modify**:
  - `start.sh` - add PORT environment variable support
  - `README.md` - update usage instructions for HTTP endpoint
  - `INSTALL.md` - update installation and connection instructions

### Step 6: Update Tests for HTTP Transport
**Commit Message**: `test: update tests for http transport changes`

- **Files to modify**:
  - Tests in `tests/` directory that might be affected by transport change
  - Add integration tests for HTTP endpoint

## Technical Details

### Python __dirname Equivalent
```python
from pathlib import Path

# Current (problematic)
base_path = Path.cwd().parent

# New (file-relative)
base_path = Path(__file__).parent.parent
```

### HTTP Transport Research Points
- Check `mcp.server.http` or similar modules
- Understand how to replace stdio streams with HTTP request/response
- Verify if MCP supports HTTP transport natively

### Environment Variable Handling
```python
import os

port = int(os.environ.get("PORT", 8888))
host = "localhost"
```

## Expected Outcome

After completion:
1. ✅ Server will find dot_ai directories relative to its file location, not cwd
2. ✅ Server will run on HTTP at `localhost:<PORT>` (default 8888)
3. ✅ Environment variable `PORT` controls the listening port
4. ✅ Start script properly sets up environment
5. ✅ Documentation reflects HTTP usage
6. ✅ Tests pass with new transport method

## Risk Assessment

- **Low Risk**: Base path fix is straightforward
- **Medium Risk**: HTTP transport conversion depends on MCP library support
- **Mitigation**: Research MCP HTTP capabilities first before implementation

## Alternative Approaches

If MCP doesn't support HTTP natively:
- Consider using a lightweight HTTP wrapper around stdio
- Evaluate using FastAPI or similar to create HTTP endpoints that proxy to MCP
- Keep stdio but add HTTP proxy layer

## Dependencies

- MCP library HTTP transport capabilities (to be researched)
- Potential additional Python dependencies for HTTP handling