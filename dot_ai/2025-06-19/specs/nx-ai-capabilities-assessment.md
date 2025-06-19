# Nx AI Capabilities Assessment

**Date**: 2025-06-19
**Repositories Analyzed**: nx, ocean, console

## Summary

This assessment documents the current AI capabilities across the Nx ecosystem, including MCP integration, AI-powered CI/CD features, and IDE assistants.

## 1. MCP (Model Context Protocol) Integration

### Overview
- **Nx MCP Server**: Full implementation in both nx and console repos providing deep workspace context to AI assistants
- **Tools Available**: Documentation search, workspace analysis, project details, generator schemas, CI/CD context, task visualization
- **IDE Support**: VS Code, Cursor, IntelliJ (with MCP support)
- **Automatic Setup**: VS Code/Nx Console automatically configures MCP when opening Nx workspaces

### Configuration
Both repositories have `.mcp.json` files configured:
```json
{
  "mcpServers": {
    "nx": {
      "type": "stdio",
      "command": "npx",
      "args": ["nx-mcp@latest", "."],
      "env": {}
    }
  }
}
```

## 2. AI-Powered CI/CD Features

### Self-Healing CI (New Feature)
- **Location**: `ocean/libs/nx-cloud/feature-workspace-settings/src/lib/edit-workspace/edit-workspace-enable-self-healing-ci.tsx`
- **Status**: Experimental
- **Description**: Automatically fix common CI failures using AI
- **Capabilities**: Update dependencies, fix configuration issues, resolve common build errors

### CI Fix Command
- **Command**: `nx fix-ci`
- **Implementation**: Uses Claude CLI to analyze and fix CI failures
- **Process**:
  1. Retrieves AI fix suggestions from backend
  2. Downloads terminal logs from failed tasks
  3. Uses Claude to analyze and generate fixes
  4. Validates and applies fixes

### Backend Infrastructure
- **AI Fix Handlers**: `ocean/apps/nx-api/src/main/kotlin/handlers/AIFixHandlers.kt`
- **Features**:
  - Store suggested fixes with git patches
  - Track user actions (applied, rejected)
  - Cost tracking for AI API usage
  - Time-limited access tokens (30 minutes)

## 3. Error Analysis & Explanation

### AI Error Explainer
- **Location**: `ocean/libs/nx-cloud/feature-ai-error-explainer/`
- **Provider**: OpenAI integration
- **Features**:
  - Analyzes task failures
  - Provides contextual explanations
  - Processes terminal logs
  - Includes git diffs and file changes

### Anthropic Integration
- **Admin Client**: `ocean/apps/nx-api/src/main/kotlin/services/aiauth/AnthropicAdminClient.kt`
- **Capabilities**:
  - Manage API keys programmatically
  - Enable/disable keys per workspace
  - Track API usage

## 4. IDE AI Assistants

### VS Code Copilot Integration
- **Location**: `console/libs/vscode/copilot/`
- **Features**:
  - Custom prompts for Nx-specific tasks
  - Generate UI integration
  - Project graph visualization
  - CI/CD error fixing

### IntelliJ AI Assistant
- **Location**: `console/apps/intellij/src/main/kotlin/dev/nx/console/llm/FixCIPEService.kt`
- **Integration**: JetBrains AI Assistant
- **Workflow**: Automatically retrieves CI errors and suggests fixes

## 5. MCP Tools Exposed

### Workspace Tools
- `nx_docs`: Retrieves relevant Nx documentation
- `nx_workspace`: Provides project graph and nx.json configuration
- `nx_workspace_path`: Returns the workspace root path
- `nx_project_details`: Returns detailed project configurations
- `nx_generators`: Lists available generators with descriptions
- `nx_generator_schema`: Provides detailed generator schemas
- `nx_available_plugins`: Lists Nx plugins (core and local)

### Visualization Tools
- `nx_visualize_graph`: Visualizes project/task graphs
- `nx_run_generator`: Opens generate UI with AI-suggested options

### CI/CD Tools
- `nx_cloud_cipe_details`: Gets CI pipeline execution details
- `nx_cloud_fix_cipe_failure`: Retrieves failure logs and context
- `nx_current_running_tasks_details`: Shows currently running Nx tasks
- `nx_current_running_task_output`: Gets terminal output for running tasks

## 6. Security & Access Control

### Features
- **AI Auth Token Provider**: Manages Anthropic API keys securely
- **Time-limited Access**: AI fix tokens expire after 30 minutes
- **Workspace-scoped**: AI features are scoped to specific workspaces
- **Organization Controls**: AI features can be enabled/disabled at org level
- **Metadata-only Workspaces**: AI features disabled for security

## 7. Cost Tracking

### Implementation
- Tracks AI usage costs (OpenAI/Anthropic API calls)
- Stores cost information with AI-generated fixes
- Provides feedback mechanisms for AI responses
- Cost data included in fix responses

## 8. Key Files and Locations

### nx Repository
- `/docs/shared/getting-started/ai-setup.md` - AI setup documentation
- `/nx-dev/ui-icons/src/lib/ai/model-context-protocol.tsx` - MCP icon component

### ocean Repository
- `/libs/nx-packages/client-bundle/src/lib/core/commands/fix-ci/` - CI fix implementation
- `/libs/nx-cloud/feature-ai-error-explainer/` - Error explanation feature
- `/apps/nx-api/src/main/kotlin/handlers/AIFixHandlers.kt` - Backend AI handlers
- `/apps/nx-api/src/main/kotlin/services/aiauth/` - Anthropic integration

### console Repository
- `/libs/nx-mcp/nx-mcp-server/` - MCP server implementation
- `/libs/vscode/mcp/` - VS Code MCP integration
- `/libs/vscode/copilot/` - Copilot integration
- `/apps/intellij/src/main/kotlin/dev/nx/console/llm/` - IntelliJ AI features

## 9. Future Considerations

### Current Status
- Self-healing CI is marked as experimental
- AI features require explicit enablement at organization level
- Cost tracking is implemented but may need refinement
- Security measures in place with time-limited tokens

### Integration Points
- Deep integration across CLI, cloud services, and IDEs
- Unified MCP protocol for consistent AI context
- Multiple AI providers supported (OpenAI, Anthropic)
- Extensible architecture for adding new AI capabilities

---

The AI capabilities are comprehensively integrated across the Nx ecosystem, providing developers with intelligent assistance for monorepo management, CI/CD troubleshooting, and code generation tasks.