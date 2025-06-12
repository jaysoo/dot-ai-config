# Changelog

## [1.1.0] - 2025-06-12

### Security
- **BREAKING**: Removed hardcoded API key placeholder - server now requires GEMINI_API_KEY environment variable
- Added comprehensive input validation for all parameters
- Implemented proper error handling to prevent information leakage

### Added
- Comprehensive logging throughout the application
- Input validation with proper error messages
- Parameter length limits to prevent abuse
- Focus area validation for code review tool
- Better error messages with available tools listed

### Changed
- Refactored handle_tool_call into smaller, modular functions
- Improved error handling in main loop (fixed request_id scope issue)
- Updated error responses to be more informative
- Better separation of concerns with dedicated handler functions

### Improved
- Code maintainability through modularization
- Error messages now include helpful context
- Logging provides better debugging capabilities
- More robust exception handling

## [1.0.0] - Initial Release

### Added
- Basic MCP server implementation
- Three tools: ask_gemini, gemini_code_review, gemini_brainstorm
- JSON-RPC protocol support
- Basic error handling