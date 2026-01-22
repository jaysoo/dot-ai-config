# Nx Repository Architecture

Last Updated: 2026-01-14

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

### packages/nx/
Core Nx functionality

- `packages/nx/src/executors/run-commands/` - Generic command executor with multiple spawning strategies
  - `run-commands.impl.ts` - Entry point with conditional logic for PTY vs exec spawning
  - `running-tasks.ts` - Task runners (ParallelRunningTasks, SeriallyRunningTasks, RunningNodeProcess)
- `packages/nx/src/tasks-runner/` - Task execution infrastructure
  - `pseudo-terminal.ts` - PTY wrapper for native Rust implementation
- `packages/nx/src/native/` - Rust native bindings
  - `index.d.ts` - TypeScript definitions for RustPseudoTerminal

### packages/create-nx-workspace/ (CNW)
CLI tool for creating new Nx workspaces. Uses A/B testing for cloud prompt behavior.

**Last Updated**: 2026-01-14
**Related Issues**: NXC-3628 (current), NXC-3624
**Status**: NXC-3628 implementation complete, ready for commit

**Key Files**:
- `bin/create-nx-workspace.ts:446-555` - CLI entry point, flow routing, variant conditional logic
- `src/create-workspace.ts` - Workspace creation, conditional cloud connection
- `src/create-workspace-options.ts` - TypeScript interfaces (`skipCloudConnect`, `ghAvailable`)
- `src/utils/nx/ab-testing.ts` - Variant determination, caching (1-week expiry), telemetry
- `src/utils/nx/nx-cloud.ts` - Cloud connection, URL generation with variant meta property
- `src/utils/nx/messages.ts` - Completion messages with `github.com/new` hint
- `src/utils/git/git.ts` - Git utilities (`isGitAvailable()`, `isGhCliAvailable()`)
- `src/internal-utils/yargs-options.ts` - CLI options (`--nxCloud` alias `--ci`)

**A/B Testing Variants** (preset flow removed in #33967):
- **Variant 0**: Shows cloud prompt → user chooses → connects to cloud → generates URL with token
- **Variant 1**: Skips cloud prompt → always shows platform link → uses GitHub flow (no token)

**Flow Logic (NXC-3628)**:
```
getFlowVariant() returns:
├── '0' → Variant 0 (current behavior)
│   └── determineNxCloudV2() → "Try the full Nx platform?" Yes/Skip
│   └── connectToNxCloudForTemplate() → nxCloudId in nx.json
│   └── readNxCloudToken() → spinner + read token
│   └── createNxCloudOnboardingUrl(token) → URL with token
│
└── '1' → Variant 1 (NXC-3628 - no cloud prompt)
    └── Skip cloud prompt → nxCloud = 'yes' (unless --nxCloud=skip)
    └── Skip connectToNxCloudForTemplate() → NO nxCloudId in nx.json
    └── Skip readNxCloudToken() → no misleading spinner
    └── createNxCloudOnboardingUrl(undefined) → GitHub flow (accessToken: null)
    └── Show github.com/new hint if user hasn't pushed
```

**Key Insight**: `createNxCloudOnboardingURL()` in `url-shorten.ts:38` sends `accessToken: null` for GitHub flow - no token needed.

**Flow Variant Cache**:
- Location: `os.tmpdir()/nx-cnw-flow-variant`
- Expiry: 1 week (`FLOW_VARIANT_EXPIRY_MS`)
- Bug fixed (2026-01-14): Expired files now deleted with `unlinkSync()`, otherwise new variant never written

**nxCloud Values**:
| Value | Source | CI Generated |
|-------|--------|--------------|
| `'github'` | CLI arg `--nxCloud github` | Yes (GitHub) |
| `'gitlab'` | CLI arg `--nxCloud gitlab` | Yes (GitLab) |
| `'yes'` | Simplified prompt "Yes" | Yes (GitHub) |
| `'skip'` | Any prompt "Skip" | No |

**Telemetry Events** (recordStat types): `start`, `precreate`, `complete`, `error`, `cancel`

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

### Next.js Jest Test Hanging Investigation (2025-11-21)
**Branch**: NXC-3505
**Issue**: https://linear.app/nxdev/issue/NXC-3505/nextjs-jest-tests-do-not-exit-properly
**GitHub**: https://github.com/nrwl/nx/issues/32880
**Status**: Investigation complete, workaround identified, generator fix pending

When running Jest tests for Next.js apps via `nx test`, tests pass successfully but Jest hangs and never exits. Running `npx jest` directly in the app directory works fine.

**Files Investigated**:
- `packages/nx/src/executors/run-commands/run-commands.impl.ts:130-163` - Executor routing logic
- `packages/nx/src/executors/run-commands/running-tasks.ts` - Task runner implementations
- `packages/nx/src/tasks-runner/pseudo-terminal.ts:62-91` - PTY command execution
- `packages/nx/src/native/` - Rust PTY bindings (`RustPseudoTerminal`)

**Root Cause**:
- `nx:run-commands` uses different code paths for single vs parallel commands
- For single commands: calls `runSingleCommandWithPseudoTerminal()` which uses PTY (pseudo-terminal)
- PTY spawning via Rust native bindings: `RustPseudoTerminal.runCommand()`
- Next.js's Jest config (`next/jest`) loads resources asynchronously (SWC bindings, config files, env vars)
- These async operations don't clean up properly when spawned via PTY
- Running `--detectOpenHandles` shows NO open handles, but process still hangs
- Not an issue with user test code - interaction between PTY spawning and Next.js Jest setup

**Code Path Logic** (packages/nx/src/executors/run-commands/run-commands.impl.ts:130-138):
```typescript
const isSingleCommandAndCanUsePseudoTerminal =
  isSingleCommand &&
  usePseudoTerminal &&
  process.env.NX_NATIVE_COMMAND_RUNNER !== 'false' &&
  !normalized.commands[0].prefix &&
  normalized.usePty;
```

**Workaround**:
Add `forceExit: true` to jest.config for Next.js projects:
```typescript
const config = {
  forceExit: true,  // Required for Next.js + Nx
  // ... rest of config
};
```

**Proposed Solutions**:
1. **Short-term**: Update `@nx/next` generator to add `forceExit: true` for new projects
2. **Medium-term**: Update `@nx/jest/plugin` to auto-detect Next.js and pass `--forceExit` flag
3. **Long-term**: Investigate with Next.js team (may be upstream issue with PTY)

**Key Learning**:
- Don't assume code paths - verify with logging in node_modules
- Single vs parallel commands use completely different spawning mechanisms
- PTY ≠ piped stdio ≠ inherited stdio - understand the differences

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

### Next.js Middleware for Framer Proxy (2025-12-19)
**Branch**: DOC-372
**Issue**: https://linear.app/nxdev/issue/DOC-372
**Status**: Fixed, committed

Production 500 errors on `/changelog` page due to `getServerSideProps` reading files at request time instead of build time.

**Root Cause**:
- Commit `3384b1dc91` (Dec 17) converted 25+ pages from `getStaticProps` to `getServerSideProps` for Framer proxy
- `getServerSideProps` runs at request time in serverless functions
- Serverless functions don't have access to files copied during build (`public/documentation/changelog`)
- Also increases Vercel costs (Lambda invocations vs CDN cache)

**Files Changed**:
- `nx-dev/nx-dev/middleware.ts` (NEW) - Edge middleware for Framer proxy
- `nx-dev/nx-dev/lib/framer-proxy.ts` (DELETED) - No longer needed
- 25 page files reverted from `getServerSideProps` to static

**Middleware Implementation**:
```typescript
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (framerUrl && framerPaths.has(pathname)) {
    const framerDestination = new URL(pathname, framerUrl);
    return NextResponse.rewrite(framerDestination, {
      headers: { 'Cache-Control': 'public, max-age=3600, must-revalidate' },
    });
  }
  return NextResponse.next();
}
```

**Cost Comparison**:
| Approach | Runtime | Cost |
|----------|---------|------|
| getServerSideProps | Lambda (serverless) | $0.20/million invocations |
| Middleware | Edge Runtime | Often free/included |
| Static pages | CDN cache | Essentially free |

**Key Learning**: Use middleware for conditional routing/rewrites instead of converting pages to SSR.

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

### 2026-01-14 - NXC-3628: Remove Cloud Prompt for Variant 1
- **Task**: NXC-3628 - Remove cloud prompt from CNW for A/B testing variant 1
- **Branch**: NXC-3628
- **Status**: Implementation complete, ready for commit
- **Purpose**: Test if showing platform link without prompt improves conversion
- **Key Changes**:
  - Added `isGhCliAvailable()` function to git.ts
  - Variant 1 conditional logic in create-nx-workspace.ts
  - Fixed expired cache file bug in ab-testing.ts (delete with `unlinkSync()`)
  - Made token optional in nx-cloud.ts, added `variant-X` meta property
  - Added `github.com/new` link to completion messages when user hasn't pushed
  - Updated 8 snapshot tests in messages.spec.ts
- **Bug Fixed**: After 1-week cache expiry, every run did 50-50 instead of locking to new variant
- **Key Insight**: `createNxCloudOnboardingURL()` sends `accessToken: null` for GitHub flow - no token needed
- **Task Plan**: `.ai/2026-01-14/tasks/nxc-3628-remove-cloud-prompt.md`

### 2026-01-14 - DOC-376: GA Scroll Depth Tracking for Marketing Pages
- **Task**: DOC-376 - Add scroll depth tracking to marketing pages
- **Commit**: `4816c5514a` (merged to master)
- **Purpose**: Track user engagement on marketing pages (previously only docs had this)
- **Key Changes**:
  - Created `useWindowScrollDepth` hook in `@nx/nx-dev-feature-analytics`
  - Hook fires `scroll_0`, `scroll_25`, `scroll_50`, `scroll_75`, `scroll_90` events to GA
  - Added `'use client'` directive to `default-layout.tsx`
- **Pages affected**: `/`, `/react`, `/java`, `/angular`, etc.

### 2025-12-19 - Framer Proxy Middleware Fix (DOC-372)
- **Task**: DOC-372 - nx.dev changelog page failing on prod and canary
- **Branch**: DOC-372
- **Commit**: `19feb14a80` - fix(nx-dev): use middleware for Framer proxy to keep pages static
- **Purpose**: Fix 500 errors caused by getServerSideProps reading files at runtime
- **Root Cause**: Previous commit converted 25 pages to SSR for Framer proxy, but SSR functions can't access build-time files
- **Key Changes**:
  - Created `nx-dev/nx-dev/middleware.ts` for edge-based Framer proxy
  - Reverted all 25 pages to static (getStaticProps or no data fetching)
  - Deleted `nx-dev/nx-dev/lib/framer-proxy.ts`
- **Key Learning**: Use Next.js middleware for conditional routing/rewrites instead of SSR
- **Cost Insight**: Middleware runs at edge (cheap), SSR runs as Lambda (expensive per-request)
- **Task Plan**: `.ai/2025-12-19/SUMMARY.md`

### 2025-12-16 - CNW Simplified Cloud Prompt & Telemetry (NXC-3624)
- **Task**: NXC-3624 - Simplify preset flow cloud prompt and add telemetry
- **Branch**: NXC-3624
- **Commits**:
  - `2278baaab4` - Directory validation with re-prompt
  - `fb41b6ad84` - Additional tracking fields
  - `1c11252c6c` - Simplify preset flow to use setupNxCloudV2
  - `33cf7d17e8` - Add precreate stat after template/preset selection
- **Purpose**: Unify the cloud prompt experience between template and preset flows
- **Key Changes**:
  - Preset flow now uses `setupNxCloudV2` ("Try the full Nx platform?") when no CLI arg provided
  - `nxCloud === 'yes'` maps to `'github'` for CI generation in preset flow
  - Added `RecordStatMetaPrecreate` interface for telemetry
  - Fixed TypeScript error: made error interface fields required (not optional) to satisfy index signature
- **Key Learning**: `--nxCloud` and `--ci` are aliases (defined in yargs-options.ts line 10)
- **Task Plan**: `.ai/2025-12-16/tasks/nxc-3624-simplify-custom-cloud-prompt.md`

### 2025-11-21 - Next.js Jest Hanging Investigation (NXC-3505)
- **Task**: NXC-3505 - Investigate Jest tests not exiting properly in Next.js apps
- **Branch**: NXC-3505
- **Purpose**: Understand why `nx test` hangs but `npx jest` works fine
- **Key Discovery**: `nx:run-commands` uses PTY for single commands, not piped stdio as initially assumed
- **Critical Mistake**: Initially investigated wrong code path (`exec()` with pipes), had to backtrack and verify actual execution
- **Methodology**: Added logs to node_modules to confirm actual code path taken
- **Result**: Identified PTY interaction issue, documented workaround (`forceExit: true`), proposed generator fix
- **Lesson**: Don't assume code paths - always verify with logging when dealing with conditional executors
- **Investigation Doc**: `.ai/2025-11-21/tasks/nxc-3505-nextjs-jest-hanging-investigation.md`

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

### getStaticProps vs getServerSideProps for File-Reading Pages
- **Issue**: Pages that read from filesystem work in dev but fail in production with ENOENT
- **Root Cause**: `getServerSideProps` runs at REQUEST time in serverless functions
- **Problem**: Serverless functions are ephemeral and don't have access to files copied during build
- **Example**: `public/documentation/changelog/` exists at build time but not in Lambda runtime
- **Solution**: Use `getStaticProps` to read files at BUILD time, not REQUEST time
- **When SSR breaks**: Any page using `readdirSync`, `readFileSync`, or accessing `public/` at runtime
- **Detection**: Look for ENOENT errors in Vercel logs that reference `public/` paths

### Middleware vs SSR for Conditional Routing
- **Issue**: Need to conditionally route some paths to external service (Framer)
- **Wrong Approach**: Convert pages to `getServerSideProps` and call rewrite function
- **Problems with SSR approach**:
  1. Pages become dynamic (Lambda invocations, expensive)
  2. Lose access to build-time files
  3. Every request spawns serverless function
- **Correct Approach**: Use Next.js middleware at the edge
- **Benefits**:
  1. Pages remain static (served from CDN)
  2. Middleware is cheap (edge runtime, often free)
  3. Routing logic centralized in one file
- **Pattern**: `middleware.ts` checks paths, rewrites to external URL if matched

### Code Path Verification in Conditional Executors
- **Issue**: Nx executors often have multiple code paths based on runtime conditions
- **Example**: `nx:run-commands` uses PTY for single commands, `exec()` for parallel commands
- **Trap**: Easy to assume one path is always taken without checking conditions
- **Solution**: Add temporary logging to node_modules to verify actual execution path
- **Context**: NXC-3505 - Initially assumed piped stdio, actually was PTY spawning
- **Impact**: Spent time investigating wrong code path, creating incorrect documentation
- **Learning**: Check conditional logic (lines 130-163 in run-commands.impl.ts) before deep diving

### PTY vs Piped Stdio vs Inherited Stdio
- **PTY (Pseudo-Terminal)**: Emulates terminal device, used by `runSingleCommandWithPseudoTerminal()`
- **Piped Stdio**: Used by `exec()`, captures stdout/stderr as streams
- **Inherited Stdio**: Direct process uses parent's stdio
- **Difference Matters**: Some processes behave differently depending on spawning method
- **Example**: Next.js Jest works with inherited stdio but hangs with PTY
- **Debugging**: Can't always rely on `--detectOpenHandles` - it may not detect PTY-related issues

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

### CNW Flow Variant Cache File (2026-01-14)
- **File Location**: `os.tmpdir()/nx-cnw-flow-variant`
- **Expiry**: 1 week (locks user to same variant for consistent experience)
- **Bug**: Expired files were not deleted, so `existsSync()` returned true but value was ignored
- **Result**: 50-50 randomization on every run instead of locking to new variant
- **Fix**: Delete expired file with `unlinkSync()` so `existsSync()` returns false
- **Key Code**: `readCachedFlowVariant()` in ab-testing.ts

### Short URL Meta Property for Analytics (2026-01-14)
- **Purpose**: Track which CNW variant generated the cloud onboarding URL
- **Format**: `variant-0` or `variant-1`
- **Location**: `createNxCloudOnboardingUrl()` in nx-cloud.ts passes `getFlowVariant()` to meta
- **Cloud side**: Cloud analytics can distinguish conversion rates by variant

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
