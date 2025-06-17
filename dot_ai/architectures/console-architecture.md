# Nx Console Architecture

Last updated: 2025-06-13

## Repository Overview

Nx Console is a VS Code and IntelliJ IDEA extension that provides a graphical interface for working with Nx workspaces. This repository contains the source code for both IDE integrations and their shared libraries.

## Directory Structure

```
console/
├── apps/                    # Application projects
│   ├── vscode/             # VS Code extension entry point
│   ├── intellij/           # IntelliJ IDEA plugin
│   └── generate-ui-v2/     # New UI generation interface
├── libs/                    # Shared libraries
│   ├── vscode/             # VS Code specific libraries
│   │   ├── migrate/        # Migration UI functionality
│   │   ├── graph/          # Nx graph integration
│   │   └── ...
│   ├── intellij/           # IntelliJ specific libraries
│   └── shared/             # Code shared between IDEs
├── tools/                   # Build and development tools
└── .ai/                    # AI-generated documentation
```

## Features & Critical Paths

### 1. Migrate UI (VS Code)
*Last updated: 2025-06-13*
- Related Linear Tasks: [Not specified]
- Related PRs: #2483

**Quick Start**: The migrate UI provides a graphical interface for managing Nx workspace migrations directly within VS Code.

**Files**:
- `libs/vscode/migrate/src/lib/migrate-webview.ts` - Main webview panel for full migrate UI
- `libs/vscode/migrate/src/lib/migrate-sidebar-view-provider.ts` - Sidebar view for quick migration status
- `libs/vscode/migrate/src/lib/commands/migrate-commands.ts` - Command handlers for migration actions
- `libs/vscode/migrate/src/lib/migrate-state-machine.ts` - XState machine managing migration flow
- `libs/vscode/migrate/src/lib/commands/run-migration.ts` - Execute individual migrations
- `libs/vscode/migrate/src/lib/commands/finish-migration.ts` - Complete migration process
- `libs/vscode/migrate/src/lib/commands/start-migration.ts` - Initialize migration process

**Dependencies**:
- XState for state management
- VS Code Webview API
- Nx migrate CLI commands
- @vscode-elements/elements for UI components

**Recent Enhancements**:
- Added undo-migration functionality (2025-04-25) - Allows reverting specific migrations
- Automatic refresh when migrate view opens (2025-06-03)
- Removed legacy migrate commands (2025-05-08)
- Fixed module resolution for Angular migrations (2025-06-17) - Migrations now run with proper working directory context

### 2. Nx Graph Integration
*Last updated: 2025-06-13*
- NEW: needs categorization

**Files**:
- `libs/vscode/graph/` - Graph visualization components

### 3. Task Execution
*Last updated: 2025-06-13*
- NEW: needs categorization

**Files**:
- `libs/vscode/tasks/` - Task running functionality

### 4. IntelliJ Integration
*Last updated: 2025-06-13*
- NEW: needs categorization

**Files**:
- `apps/intellij/` - IntelliJ IDEA plugin implementation
- `libs/intellij/` - IntelliJ specific libraries

## Personal Work History

### 2025-06-17
**Feature**: Angular Migration Module Resolution Fix
- Fixed module resolution errors when running Angular migrations through VS Code Migrate UI
  - Modified `libs/vscode/migrate/src/lib/commands/run-migration.ts` to change working directory
  - Single fix resolved both "Cannot find module '@angular/core'" and file path issues
  - Simple solution: `process.chdir(workspacePath)` with proper restoration
- Related task: `.ai/2025-06-17/tasks/fix-angular-module-resolution-migrate-ui.md`

### 2025-04-25 to 2025-04-28
**Feature**: Migration UI Improvements
- Added undo-migration action when approving current migration (#2483)
  - Modified `migrate-commands.ts` to support undo functionality
  - Updated `migrate-webview.ts` to expose undo button in UI
- Upgraded Nx and removed gradle workaround (#2484)

## Design Decisions & Gotchas

### State Management
- Uses XState for managing complex migration flow states
- State machine pattern ensures predictable transitions between migration phases

### Webview Architecture
- Reuses Nx's graph UI infrastructure for consistency
- Messages passed between webview and extension for all actions
- Auto-refresh on file changes (migrations.json)

### Git Integration
- Migrations can be auto-committed
- Cancel functionality includes git reset capabilities
- Diff viewing integrated with VS Code's git extension

### Migration Execution Context
- Migrations run in VS Code's extension host process, not in the workspace directory
- Must explicitly set working directory with `process.chdir()` for proper module resolution
- Angular migrations specifically require correct cwd to find project files
- Always restore original cwd in finally block to avoid side effects

## Technology Stack

### Core Dependencies
- **Nx**: Monorepo build system and CLI
- **TypeScript**: Primary language
- **XState**: State machine library for migration flow
- **Lit Element**: Web components for sidebar UI
- **VS Code Extension API**: IDE integration
- **IntelliJ Platform SDK**: JetBrains IDE integration

### Build Tools
- **pnpm**: Package manager
- **Nx**: Build orchestration
- **Jest**: Testing framework
- **Gradle**: IntelliJ plugin builds

### UI Technologies
- **@vscode-elements/elements**: VS Code native UI components
- **Codicons**: VS Code icon library
- **Nx Graph UI**: Reused for migration visualization

## Development Notes

### Running the Extension
```bash
# Install dependencies
pnpm install

# Build VS Code extension
pnpm nx run vscode:build

# Run VS Code extension in development
pnpm nx run vscode:serve
```

### Testing
```bash
# Run tests
pnpm nx test vscode-migrate

# Run linting
pnpm nx lint vscode-migrate
```

### Code Formatting
- Run `yarn nx format --fix` before committing
- For Kotlin files: `yarn nx ktfmtFormat intellij`

## Architecture Patterns

### Message Passing
All communication between webviews and extension host uses structured messages:
```typescript
interface MigrateMessage {
  type: 'run-migration' | 'skip-migration' | 'undo-migration' | ...
  payload: any
}
```

### State Machine States
- `default`: No updates available
- `update-available`: New Nx version detected
- `in-progress`: Migration running
  - Sub-states for different migration phases

### File Watching
- Watches `migrations.json` for changes
- Auto-refreshes UI on file modifications
- Debounced to prevent excessive updates