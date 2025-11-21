# Nx Repository Architecture

Last Updated: 2025-11-21

## Directory Overview

### packages/eslint/
ESLint plugin and generators for Nx workspaces

- `packages/eslint/src/generators/utils/flat-config/` - AST utilities for ESLint flat config manipulation
  - `ast-utils.ts` - Core functions for parsing and modifying flat configs
  - `ast-utils.spec.ts` - Test suite for AST utilities

### packages/js/
JavaScript/TypeScript build and execution tools

- `packages/js/src/executors/node/` - Node.js executor for running applications
  - `node.impl.ts` - Main executor implementation with signal handling
  - `lib/kill-tree.ts` - Process tree termination utility

### nx-dev/
The Nx documentation site (docs.nrwl.io) - Next.js application with multiple sub-packages

- `nx-dev/feature-search/` - Algolia search integration
- `nx-dev/ui-blog/` - Blog listing and display components
- `nx-dev/ui-common/` - Shared UI components
- `nx-dev/data-access-documents/` - Document fetching and processing

## Features & Critical Paths

### Node Executor Signal Handling (2025-11-21)
**Branch**: NXC-3510
**Issue**: https://linear.app/nxdev/issue/NXC-3510/node-executor-may-not-release-ports-on-shutdown
**Status**: Investigation complete, fix pending

Handles process lifecycle and signal propagation for Node.js applications run via the Nx executor.

**Files Involved**:
- `packages/js/src/executors/node/node.impl.ts:275-286` - Signal handlers (SIGTERM, SIGINT, SIGHUP)
- `packages/js/src/executors/node/node.impl.ts:228-251` - `stop()` function with killTree call
- `packages/js/src/executors/node/lib/kill-tree.ts:4-69` - Process tree discovery and termination

**Known Issue - Port Not Released on Shutdown**:
When SIGTERM is sent to the Nx process running `nx serve`, child server processes (e.g., Nest) may remain running and keep ports bound, causing EADDRINUSE errors.

**Root Cause**:
- Race condition: Intermediate processes die before `killTree()` completes process tree scan
- Server process becomes orphaned (re-parented to PID 1)
- Orphaned process continues running with port still bound
- Affects apps without shutdown signal handlers most

**Process Hierarchy**:
```
Nx CLI Process → fork() → intermediate process → fork() → Server Process
                 ↓                                        ↑
              SIGTERM                                (orphaned)
```

**Reproduction**:
1. Create Nest app: `npx create-nx-workspace@latest --preset=node-monorepo --appName=api --framework=nest`
2. Start: `nx serve api`
3. Send SIGTERM to Nx process
4. Result: Server remains running, port bound

**Proposed Solutions**:
1. Use process groups (`detached: true`, kill with `-pid`) - strongest guarantee
2. Fix killTree race condition (build full tree before killing)
3. Forward signals properly to all descendants
4. Document shutdown hook requirements

**Dependencies**:
- Uses `pgrep -P` on macOS to discover child processes
- Relies on Node.js `child_process.fork()` for spawning

### ESLint Flat Config AST Utilities (2025-11-19)
**Branch**: NXC-3501
**Issue**: https://github.com/nrwl/nx/issues/31796
**Status**: Implemented, pending PR

Handles parsing and modification of ESLint flat config files using TypeScript AST.

**Files Involved**:
- `packages/eslint/src/generators/utils/flat-config/ast-utils.ts` - Core AST utilities
  - `hasOverride()` - Checks if config has matching override (uses AST extraction)
  - `replaceOverride()` - Updates matching overrides (uses parseTextToJson)
  - `extractLiteralValue()` - Extracts literal values from AST nodes
  - `extractPropertiesFromObjectLiteral()` - Extracts properties from object literals

**Key Implementation Details**:
- `hasOverride` uses AST-based extraction to handle complex spread patterns gracefully
- `replaceOverride` uses original `parseTextToJson` to preserve `languageOptions.parser` during updates
- Pattern support: parenthesized expressions, function calls, element access, variable references

**Design Decision**:
- Only `hasOverride` was migrated to AST extraction
- `replaceOverride` kept original approach because it needs to preserve dynamic import expressions in output

### Blog Search Integration (2025-09-19)
**Branch**: DOC-221
**Status**: Implemented, not yet merged

Adds dedicated blog search functionality when Astro docs migration is enabled.

**Files Involved**:
- `nx-dev/feature-search/src/lib/algolia-search.tsx` - Core Algolia search component with blog filtering
- `nx-dev/ui-blog/src/lib/blog-container.tsx` - Blog index page with integrated search
- `nx-dev/ui-blog/src/lib/filters.tsx` - Blog category filters
- `nx-dev/ui-blog/package.json` - Package dependencies

**Key Implementation Details**:
- Uses Algolia facet filter `hierarchy.lvl0:Nx | Blog` to restrict results
- Conditionally renders based on `NEXT_PUBLIC_ASTRO_URL` environment variable
- Search box positioned right of filters for better UX
- Custom placeholder text "Search blog posts" for clarity

**Dependencies**:
- `@nx/nx-dev-feature-search` package
- Algolia DocSearch Modal component
- Environment variable `NEXT_PUBLIC_ASTRO_URL` for feature flag

## Personal Work History

### 2025-11-21 - Node Executor SIGTERM Investigation
- **Task**: NXC-3510 - Investigate port release issue with Node executor
- **Branch**: NXC-3510
- **Purpose**: Confirm if SIGTERM to Nx process properly kills child servers and releases ports
- **Result**: Reproduction confirmed - child processes become orphaned, ports stay bound
- **Deliverable**: Detailed analysis with 4 potential fix approaches posted to Linear issue
- **Test Setup**: Created Nest app in `tmp/claude/node1`, added process.pid logging

### 2025-11-19 - ESLint Flat Config AST Parsing Fix
- **Task**: NXC-3501 - Fix flat config JSON parsing for complex spread elements
- **Branch**: NXC-3501
- **Purpose**: Fix `InvalidSymbol in JSON` error when configs contain complex spread patterns
- **Key Learning**: When fixing a bug, only modify the specific function with the issue - don't extend "improvements" to related functions that work correctly

### 2025-09-19 - Blog Search During Astro Migration
- **Task**: DOC-221 - Add blog search when Astro docs are enabled
- **Commit**: 901e3a8b5e (amended with nx sync)
- **Purpose**: Preserve blog search functionality during docs migration to Astro

## Design Decisions & Gotchas

### Process Lifecycle Management
- **Issue**: Node executor may not properly clean up child processes on shutdown
- **Context**: When parent processes die before `killTree()` finishes scanning, descendants become orphaned
- **Impact**: Ports remain bound, causing EADDRINUSE on next start
- **Solution (Pending)**: Use process groups to ensure atomic cleanup of all descendants
- **Workaround**: Apps can implement shutdown hooks (`app.enableShutdownHooks()` in Nest)

### Bug Fix Scope Discipline
- **Issue**: When fixing a bug in one function, resist extending "improvements" to related functions
- **Example**: NXC-3501 - Only `hasOverride` had the parsing bug, but I also modified `replaceOverride` which caused a regression
- **Solution**: Fix only what's broken, test thoroughly, don't assume similar code needs the same fix

### hasOverride vs replaceOverride Design
- **Issue**: Both functions parse ESLint flat configs but have different requirements
- `hasOverride`: Only needs to check if a matching override exists (can ignore non-literal values)
- `replaceOverride`: Needs to preserve and modify full config including dynamic imports
- **Solution**: Use AST extraction for hasOverride (graceful degradation), keep parseTextToJson for replaceOverride (full text preservation)

### Nx Sync Requirement
- **Issue**: When adding dependencies to package.json in Nx monorepo
- **Solution**: Must run `nx sync` before committing to update inferred targets
- **Impact**: Ensures workspace configuration stays consistent

### Astro Migration Pattern
- Using `NEXT_PUBLIC_ASTRO_URL` as feature flag for progressive migration
- Blog remains in Next.js while docs move to Astro
- Search needs special handling to work across both platforms

## Technology Stack

### Documentation Site (nx-dev)
- **Framework**: Next.js
- **Search**: Algolia DocSearch
- **Styling**: Tailwind CSS
- **Migration Target**: Astro/Starlight (in progress)
