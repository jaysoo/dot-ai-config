# @reflect Command Specification

## Overview

The `@reflect` command is a Claude command designed to help developers maintain living architecture documentation for their repositories. It captures file relationships, design decisions, and work history from daily development activities, creating a persistent knowledge base that remains useful months or years later.

## Problem Statement

When working on large monorepos like NX or Ocean, developers face several challenges:
- File discovery relies heavily on memory, which fails after 2-3 months
- Design decisions made in Slack/Zoom conversations are lost
- Alternative approaches that were discussed but not implemented disappear
- Connections between internal task trackers (Linear) and code changes are hard to find
- Understanding why code looks "weird" or why tests are disabled requires archeological digging
- Feature parity between frameworks (React vs Angular) is undocumented

## Core Features

### 1. Auto-Detection
- Automatically detects repository based on current working directory's .git root
- Repository name derived from directory name (e.g., `/Users/jack/projects/nx` → "nx")

### 2. Initial Scan (`@reflect --initial-scan`)
- Analyzes last 3 months of commits authored by user (Jack Hsu)
- Creates skeleton structure with:
  - Directory overview
  - Inferred feature names from commit messages and PR titles
  - File groupings based on commit patterns
  - Content pulled from existing `.ai` task/planning files

### 3. Regular Reflection (`@reflect`)
- Can be run anytime during work (even 10x per day)
- Updates both:
  - Today's `SUMMARY.md` in `.ai/yyyy-mm-dd/`
  - Repository-specific architecture file in `.ai/architectures/[repo]-architecture.md`
- Quiet mode by default (use `-v` or `--verbose` for detailed output)
- Shows summary: "Updated 3 sections in nx-architecture.md: Module Federation, Generator Updates, Testing Infrastructure"

### 4. Smart Content Extraction
- Looks for file paths in `.ai` files under sections like:
  - "steps"
  - "tasks" 
  - "phases"
  - "Implementation Details"
  - "Files Modified"
- Focuses only on today's work (previous days already captured)

### 5. Duplicate Prevention
- Updates existing sections rather than creating duplicates
- New files added with marker: "NEW: needs categorization"

## Architecture File Structure

```markdown
# NX Architecture

## Directory Overview
- `packages/` - Core NX packages
  - `packages/nx/` - Main NX CLI and core functionality
  - `packages/react/` - React-specific generators and executors
- `libs/` - Shared libraries
- `tools/` - Build and development tools
- `scripts/` - Utility scripts

## Features & Critical Paths

### Module Federation
- Last updated: 2025-06-13
- Related Linear tasks: LIN-1234, LIN-5678
- Key PRs: #12345, #67890
- Quick start: To work on MF, start with packages/react/src/generators/module-federation/
- Files involved:
  - `packages/react/src/generators/module-federation/index.ts` - Main generator entry
  - `packages/react/src/executors/module-federation-dev-server/` - Dev server implementation
  - `packages/webpack/src/utils/module-federation/` - Webpack utilities
- Dependencies: Requires @nx/webpack, uses rspack for performance
- Known issues: SSR not supported for Angular MF due to Node.js compatibility

### Generator Framework
[Similar structure...]

## Personal Work History

### 2025-06-13 - Module Federation Updates
- Updated React MF to support rspack
- Files modified: [list]
- Design decision: Chose rspack over webpack for 3x faster builds
- Alternative considered: Native webpack 5 MF, rejected due to performance

### 2025-05-20 - Angular SSR Investigation
[Previous work entries...]

## Design Decisions & Gotchas

### Module Federation Limitations
- Angular MF does not support SSR in Node.js environment
- Workaround: Use client-only rendering for MF apps
- Discussed in Slack thread (2025-05-15) with team

### Performance Optimizations
[Other decisions...]

## Technology Stack
- `fast-glob` - File pattern matching (3.2.12)
- `@rspack/core` - Bundler for Module Federation
- `@nx/devkit` - Generator utilities
```

## Implementation Details

### Command Flow

1. **Repository Detection**
   ```bash
   # From /Users/jack/projects/nx/packages/react
   @reflect  # Detects "nx" repository
   ```

2. **File Discovery**
   - Scans current context from Claude session
   - Reads today's task files in `.ai/yyyy-mm-dd/`
   - Identifies mentioned file paths

3. **Content Synthesis**
   - Extracts relevant information from task/dictation files
   - Maps files to features based on patterns
   - Updates appropriate sections in architecture.md

4. **Update Process**
   - Modifies existing sections when matching features found
   - Adds new files with "NEW: needs categorization" marker
   - Updates today's SUMMARY.md with work performed

### Error Handling
- Creates architecture file if it doesn't exist
- Handles missing `.ai` directory gracefully
- Reports files that couldn't be processed

### Configuration
- No configuration file needed for basic usage
- Repository detection is automatic
- Verbosity controlled via command flags

## Usage Examples

```bash
# Initial setup for a repository
@reflect --initial-scan

# Regular usage during development
@reflect

# Verbose mode to see all changes
@reflect -v

# After working on a feature
# (Updates both SUMMARY.md and architecture.md automatically)
@reflect
```

## Future Enhancements (from Gemini review)

1. **Granular Commit Analysis**: Allow custom date ranges for initial scan
2. **Smart Categorization**: ML-based suggestions for "NEW" items
3. **Git Hooks Integration**: Auto-run on commits
4. **Diff Visualization**: Show changes being made to architecture.md
5. **Template Customization**: User-defined templates for documentation
6. **Performance Optimization**: Caching for large repositories

## Success Criteria

1. Developers can understand code they worked on months ago within minutes
2. Design decisions and alternatives are preserved beyond ephemeral channels
3. File relationships and dependencies are clearly documented
4. New team members can quickly understand project architecture
5. Daily reflection becomes a natural part of the workflow

## Technical Requirements

- Must work with monorepo structures (NX, Nx, pnpm workspaces)
- Should complete regular reflection in under 5 seconds
- Initial scan should handle 3 months of history efficiently
- Must preserve existing content and formatting in architecture.md
- Should integrate seamlessly with existing `.ai` folder structure