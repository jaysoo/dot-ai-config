# Improve MCP Server Discoverability for AI Tools

## Task Type
**Enhancement** - Making the MyNotes MCP server more discoverable and frequently used by AI tools

## Problem Statement
The MyNotes MCP server provides access to personal notes, dictations, specs, tasks, and TODOs, but AI tools like Claude and Cursor don't automatically prioritize using it when relevant queries are made. We need to establish patterns and configurations that ensure AI tools call the MCP server first for these types of requests.

## Plan

### Step 1: Analyze Current MCP Server Integration
- Review how the MCP server is currently configured in Claude and other AI tools
- Document the available MCP functions and their current usage patterns
- Identify specific keywords that should trigger MCP server calls

**Reasoning**: Understanding the current state helps identify gaps and opportunities for improvement.

### Step 2: Create AI Tool Instructions
- Develop a comprehensive CLAUDE.md file or similar instructions that explicitly direct AI tools to use the MCP server
- Include specific trigger phrases and patterns that should invoke MCP functions
- Create templates for common queries that route through the MCP server

**Reasoning**: Clear, explicit instructions are the most direct way to influence AI behavior.

### Step 3: Implement Keyword Mapping System
- Create a keyword/phrase mapping that links user queries to specific MCP functions
- Define priority rules for when to use MCP vs. other tools
- Include fuzzy matching for variations of common requests

**Keywords to map**:
- "my notes", "my dictations", "my specs", "my tasks", "my TODOs"
- "what did I work on", "previous work", "past tasks"
- "find my", "search my", "get my"
- "personal notes", "saved notes", "stored information"

### Step 4: Create MCP Server Usage Examples
- Develop a library of example queries and their expected MCP server calls
- Create test cases that verify AI tools are using the MCP server appropriately
- Document best practices for phrasing queries to trigger MCP usage

**Reasoning**: Examples help train both users and AI tools on proper usage patterns.

### Step 5: Configure Tool Priority Settings
- Investigate if AI tools support priority configuration for MCP servers
- Create configuration files that set MyNotes as high priority for specific query types
- Document any API or configuration options available

**Alternatives**:
- If direct priority configuration isn't available, use instruction engineering
- Consider creating wrapper commands that force MCP usage
- Implement prompt templates that explicitly mention MCP server

### Step 6: Create Integration Documentation
- Write clear documentation for each AI tool (Claude, Cursor, etc.)
- Include installation steps, configuration, and usage patterns
- Create troubleshooting guide for common issues

### Step 7: Implement Monitoring and Feedback
- Create a system to track when MCP server is called vs. when it should have been called
- Develop metrics for successful MCP server usage
- Implement feedback loop to improve instructions over time

## Technical Implementation Details

### File Structure
```
dot_ai/2025-06-09/tasks/
├── improve-mcp-server-discoverability.md (this file)
├── claude-mcp-instructions.md
├── cursor-mcp-instructions.md
├── keyword-mapping.json
├── usage-examples.md
├── test-mcp-usage.mjs
└── monitor-mcp-calls.mjs
```

### Key Configuration Files to Create/Update
1. `~/.claude/CLAUDE.md` - Global Claude instructions
2. `~/.cursor/settings.json` - Cursor configuration
3. Project-specific `CLAUDE.md` files
4. MCP server configuration updates

## Expected Outcomes

1. **Increased MCP Usage**: AI tools should call the MyNotes MCP server 90%+ of the time when users ask for notes, dictations, specs, tasks, or TODOs
2. **Consistent Behavior**: All AI tools should behave similarly when given the same queries
3. **User Transparency**: Users should see clear indication when MCP server is being used
4. **Reduced Manual Intervention**: Users shouldn't need to explicitly mention "use MCP" in their queries
5. **Better Context Retrieval**: AI tools should have access to the most relevant personal information through the MCP server

## Success Metrics
- MCP server call rate for relevant queries (target: >90%)
- User satisfaction with AI tool responses
- Reduction in repeated questions about past work
- Time saved by automatic MCP server usage

## Risks and Mitigation
- **Risk**: AI tools might over-use MCP server for irrelevant queries
  - **Mitigation**: Create explicit exclusion patterns
- **Risk**: Instructions might conflict with other configurations
  - **Mitigation**: Test thoroughly and document precedence rules
- **Risk**: Different AI tools might interpret instructions differently
  - **Mitigation**: Create tool-specific instructions and test each individually