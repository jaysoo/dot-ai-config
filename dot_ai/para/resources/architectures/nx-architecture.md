# Nx Repository Architecture

Last Updated: 2026-03-28

## Directory Overview

### packages/eslint/
ESLint plugin and generators for Nx workspaces

- `packages/eslint/src/generators/utils/flat-config/` - AST utilities for ESLint flat config manipulation
  - `ast-utils.ts` - Core functions for parsing and modifying flat configs
  - `ast-utils.spec.ts` - Test suite for AST utilities

### packages/js/
JavaScript/TypeScript build and execution tools

- `packages/js/src/generators/library/` - JS/TS library generator
  - `library.ts` - Main generator; delegates to vitest/jest config generators. When `unitTestRunner === 'vitest'` and `bundler !== 'vite'`, calls `@nx/vitest` configurationGenerator (which handles vite config creation internally).
  - `library.spec.ts` - Tests for library generator
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
- `packages/nx/src/plugins/js/lock-file/` - Lockfile parsers for npm, yarn, pnpm, bun
  - `npm-parser.ts` / `npm-parser.spec.ts` - NPM lockfile parser (v1/v2/v3 formats)
  - `project-graph-pruning.ts` - Prunes dependency graph to subset for a given package.json
  - `__fixtures__/` - Test fixture lockfiles. Package names use `@nx-testing/*` scoped fakes to avoid Dependabot false positives. Tests use `jest.mock('fs')` with memfs — `require('fs')` and `node:fs` are intercepted.

### packages/plugin/
Nx plugin generator for creating custom Nx plugins

- `packages/plugin/src/generators/plugin/` - Plugin generator
  - `plugin.ts` - Delegates to `@nx/js` library generator with `useTscExecutor: true`
  - `plugin.spec.ts` - Tests including vitest/jest config generation

### packages/vite/
Vite build tool integration (supports Vite 5-8)

- `packages/vite/src/utils/versions.ts` - Version constants; `viteVersion` is the default (^8.0.0), `viteV7/V6/V5Version` for backward compat
  - `vitePluginReactVersion` (^6.0.0) for Vite 8, `vitePluginReactV4Version` (^4.2.0) for Vite <=7
- `packages/vite/src/utils/version-utils.ts` - `getInstalledViteVersion()`, `getInstalledViteMajorVersion()` — detect installed vite from package.json using semver
- `packages/vite/src/utils/ensure-dependencies.ts` - Installs framework-specific deps; detects vite major version to pick correct `@vitejs/plugin-react` version
- `packages/vite/src/utils/generator-utils.ts` - Vite config generation utilities
  - `createOrEditViteConfig()` - Creates `vite.config.*` files; always uses `root: import.meta.dirname`
  - **Important**: This is a DIFFERENT function from the one in `packages/vitest/`
- `packages/vite/src/generators/init/lib/utils.ts` - `checkDependenciesInstalled()` preserves existing vite version; only installs latest for new workspaces
- `packages/vite/src/plugins/plugin.ts` - Plugin detection checks both `rollupOptions.input` (Vite <8) and `rolldownOptions.input` (Vite >=8)
- `packages/vite/src/executors/build/build.impl.ts` - Build executor; skips env config overwrite when `useEnvironmentsApi` is true (Vite 8 builder API)
- **Vite 8 type workaround**: ESM-only `.d.mts` types not resolvable under `moduleResolution: "node"`. Uses `as any` casts with `TODO(jack)` comments across vite, vitest, cypress, react, angular, remix packages. Remove when switching to `moduleResolution: "nodenext"`.

### packages/cypress/
Cypress test runner integration

- `packages/cypress/src/utils/versions.ts` - Version constants and detection utilities
  - `cypressVersion` (^15.8.0), `cypressViteDevServerVersion` (^7.0.1), `viteVersion` (^6.0.0)
  - Version map for Cypress 13/14 compat; `versions(tree)` returns correct versions based on installed Cypress
  - `getInstalledCypressVersion()`, `getInstalledCypressMajorVersion()`, `assertMinimumCypressVersion()`
- `packages/cypress/src/generators/component-configuration/component-configuration.ts` - Component testing setup
  - **Vite 8 guard** (added in beta.5): `getDependencyVersionFromPackageJson(tree, 'vite')` — throws if vite major >= 8
  - Cypress CT doesn't support Vite 8 yet (`@cypress/vite-dev-server` peer dep is `^5 || ^6 || ^7`)
  - Upstream issue: https://github.com/cypress-io/cypress/issues/33078
- `packages/cypress/src/plugins/preprocessor-vite.ts` - Vite 8 ESM type workaround (dynamic import)
- `packages/cypress/plugins/cypress-preset.ts` - Shared preset for Angular/React CT

**Angular CT**: `packages/angular/src/generators/cypress-component-configuration/` — uses webpack bundler for CT (hardcoded). Calls `ensurePackage('@nx/cypress')` → `baseCyCTConfig()`.

**React CT**: `packages/react/src/generators/cypress-component-configuration/` — supports both vite and webpack. `packages/react/src/utils/ct-utils.ts` has `configureCypressCT()` and bundler detection.

**Test workaround**: Both Angular/React CT test files use `useVite7ForCypressCT(tree)` helper to downgrade vite to ^7.0.0 in the tree before calling cypress config generator. Must be called AFTER app generators (which add vite 8) but BEFORE cypress config generator. Cannot go in `beforeEach` because app generators run after it.

### packages/vitest/
Vitest test runner integration

- `packages/vitest/src/generators/configuration/` - Vitest configuration generator
  - `configuration.ts` - Sets up vitest for a project; `shouldUseVitestConfig()` determines whether to create `vitest.config.mts` (for non-framework projects) vs `vite.config.mts`
- `packages/vitest/src/utils/generator-utils.ts` - Vitest-specific config generation
  - `createOrEditViteConfig()` - Separate copy from `@nx/vite`; supports `vitestFileName` option, uses `root: __dirname`

### packages/create-nx-workspace/ (CNW)
CLI tool for creating new Nx workspaces. Two separate code paths: preset flow (default) and template flow (`--template`).

**Last Updated**: 2026-03-27
**Related Issues**: NXC-4153 (non-interactive fix + template shorthands), NXC-4113 (A/B test cloud prompt copy), NXC-4141 (push timeout/error handling), NXC-4112 (auto-open browser), NXC-4020 (restored v22.1.3 flow), NXC-3628, NXC-3624
**Status**: NXC-4153 PR #35045 (non-interactive fix + shorthands). NXC-4113 branch pushed. NXC-4020 merged (PR #34671). NXC-4112 in review (PR #35014).

**Key Files**:
- `bin/create-nx-workspace.ts` - CLI entry point; preset flow uses simple `determineNxCloud` → `determineIfGitHubWillBeUsed` (v22.1.3 pattern)
- `src/create-workspace.ts` - Workspace creation; preset and template flows are **completely separate code paths**; `resolveTemplateShorthand()` maps shorthand names (angular, react, typescript, empty) to `nrwl/*-template` format
- `src/create-workspace-options.ts` - TypeScript interfaces
- `src/internal-utils/prompts.ts` - `determineTemplate()` returns template name or `'custom'`; non-interactive/CI defaults to `'nrwl/empty-template'` (fixed in NXC-4153, was returning `'custom'` causing crashes)
- `src/utils/nx/ab-testing.ts` - A/B testing infrastructure. `getFlowVariant()` returns `'0'`/`'1'`/`'2'` (cached, overridable via `NX_CNW_FLOW_VARIANT`). Flow variant controls BOTH which prompt copy is shown (via `PromptMessages.getPrompt()`) AND tracking. `setupNxCloudV2` has 3 copy variants. `shouldShowCloudPrompt()` removed (prompt always shown).
- `src/utils/nx/nx-cloud.ts` - Cloud connection, URL generation, browser auto-open; `getNxCloudInfo(nxCloud, url, pushStatus, rawNxCloud?)` uses `rawNxCloud` to hide URL when user passed `--nxCloud` explicitly; `openCloudSetupUrl()` opens browser (skips CI, fails gracefully)
- `src/utils/nx/messages.ts` - Completion messages (no github.com/new URLs)
- `src/utils/git/git.ts` - Git utilities; `GitHubPushError` class with `reason` field for telemetry; `pushToGitHub()` throws on failure (caller handles gracefully); tiered timeouts: `GH_CLI_TIMEOUT_MS` (1s), `GH_LIST_TIMEOUT_MS` (10s), `GH_PUSH_TIMEOUT_MS` (30s)
- `src/utils/child-process-utils.ts` - `execAndWait()` and `spawnAndWait()` with optional `timeout` param; `silenceErrors` mode passes `{timedOut: true}` on timeout kills
- `src/internal-utils/yargs-options.ts` - CLI options (`--nxCloud` alias `--ci`)

**Preset Flow (v22.1.3 behavior)**:
```
1. determineNxCloud(argv) → CI provider prompt or "Would you like remote caching?"
2. determineIfGitHubWillBeUsed(argv)
3. createEmptyWorkspace() — passes actual nxCloud value → nxCloudId set in nx.json
4. readNxCloudToken() → reads nxCloudId back
5. setupCI() (only for specific CI providers, NOT 'yes')
6. createNxCloudOnboardingUrl(token) → short URL
7. initializeGitRepo(connectUrl) — connectUrl baked into initial commit
8. pushToGitHub() — only for nxCloud === 'github'
9. getNxCloudInfo() → completion message
```

**Template Flow** (CLI-only, `--template=nrwl/...`):
- Clones GitHub template repo, installs deps
- Cloud connection via `connectToNxCloudForTemplate()` (separate from preset)
- CI setup, URL generation, README update handled independently

**nxCloud Values**:
| Value | Source | Cloud Connected | CI Generated |
|-------|--------|----------------|--------------|
| `'github'` | CI provider prompt | Yes | Yes (GitHub) |
| `'gitlab'` | CI provider prompt | Yes | Yes (GitLab) |
| `'yes'` | Caching prompt "Yes" | Yes | No |
| `'skip'` | Skip/default | No | No |
| `'never'` | Explicit opt-out | No (neverConnectToCloud) | No |

**Key Insight (NXC-4020)**: The preset flow MUST pass the actual `nxCloud` value to `createEmptyWorkspace` — overriding to `'skip'` prevents `nxCloudId` from being set in nx.json, causing `readNxCloudToken()` to return undefined and breaking the short URL.

**Telemetry Events** (recordStat types): `start`, `precreate`, `complete`, `error`, `cancel`

### astro-docs/
The Nx documentation site (nx.dev/docs) - Astro/Starlight application

**Writing New Pages**: Before creating or reorganizing docs, review the 5 IA Principles in `.ai/para/resources/docs-information-architecture/README.md`:
1. Progressive Disclosure - Is this for First 30 Minutes, First 30 Days, or Forever?
2. Category Homogeneity - Don't mix concepts, tasks, and products in lists
3. Type-Based Navigation - Separate learning (guides) from looking up (reference)
4. Pen & Paper Test - Can explain without terminal → How Nx Works; needs terminal → Platform Capabilities
5. Universal vs Specific - Applies to everyone → Platform Capabilities; only React users → Technologies

**Key Files**:
- `astro-docs/src/pages/` - Static page endpoints
  - `llms.txt.ts` - LLM documentation index following llmstxt.org spec
  - `llms-full.txt.ts` - Concatenated full documentation for LLMs (~2.87MB, 503 pages)
  - `[...slug].md.ts` - Dynamic .md file endpoint for any docs page
- `astro-docs/netlify/edge-functions/` - Netlify Edge Functions
  - `add-link-headers.ts` - Content negotiation (Accept: text/markdown → rewrite to .md) and HTTP Link headers
  - `track-asset-requests.ts` - GA4 analytics for .txt and .md requests
- `astro-docs/src/content/docs/` - Documentation content in .mdoc format
- `astro-docs/sidebar.mts` - Sidebar structure configuration
- `astro-docs/src/content/docs/getting-started/Tutorials/` - Topic-based tutorials (DOC-452, merged 2026-03-26)
  - 8 focused tutorials: crafting-your-workspace, managing-dependencies, configuring-tasks, running-tasks, caching, understanding-your-workspace, reducing-configuration-boilerplate, self-healing-ci-tutorial
  - Each has `llm_copy_prompt` for AI agent tutoring and prev/next navigation cards
  - Old framework tutorials (react/angular/typescript) kept but hidden from sidebar for link compat
- `astro-docs/src/content/docs/getting-started/` - Getting started pages all have consistent "Next steps" bullet lists linking to tutorial series, editor setup, and CI (PR #35024, 2026-03-26)
- `astro-docs/src/assets/tutorials/` - SVG diagrams and screenshots for tutorials
- `astro-docs/markdoc.config.mjs` - Custom Markdoc tags (graph, project_details, llm_copy_prompt, llm_only, cards, tabs, etc.)
  - `cards` tag: `cols` must be Number not String (`cols=2` not `cols="2"`)
  - `graph` tag: requires inline JSON code fence (not `jsonFile` attribute for custom data)
  - Code block filenames: use `// filename` comment inside block, NOT `title=` attribute (Starlight ignores `title=`)

**Important**: Netlify Edge Function responses from `context.next()` are **immutable**. Must create new Response objects with cloned headers - cannot use `response.headers.set()`.

### nx-dev/
The marketing Nx site (nx.dev) - Next.js application with multiple sub-packages

- `nx-dev/feature-search/` - Algolia search integration
- `nx-dev/ui-blog/` - Blog listing and display components
- `nx-dev/ui-common/` - Shared UI components
- `nx-dev/data-access-documents/` - Document fetching and processing
- `nx-dev/nx-dev/next.config.js` - Rewrites to proxy to astro-docs (llms.txt, llms-full.txt)
- `nx-dev/nx-dev/_redirects` - Static 301 redirects (1300+ rules) processed by Netlify. Copied to `.next/` during build.

### netlify/ (repo root)
Netlify Edge Functions for nx-dev (must be at repo root due to Netlify base directory config).

- `netlify/edge-functions/rewrite-framer-urls.ts` - Primary routing edge function. Handles three proxy targets:
  1. **Framer proxy** (default): All paths proxied to Framer unless excluded. Rewrites `framerUrl` → `https://nx.dev` in HTML.
  2. **Blog proxy** (opt-in via `BLOG_URL` env var): `/blog/*` and `/changelog/*` proxied to standalone blog site. Rewrites `blogUrl` → `https://nx.dev`.
  3. **Next.js passthrough**: Paths in `nextjsPaths` set or `excludedPath` config fall through to Next.js.
  - `excludedPath` is static (build-time), `nextjsPaths` is dynamic (reads env vars at module load)
  - `accept: ['text/html']` — only HTML requests hit this function. CSS/JS/images bypass entirely.
  - GA4 tracking via `sendToGA4()` for both Framer and blog proxied responses
- `netlify/edge-functions/framer-sitemap.ts` - Proxies Framer sitemap at `/sitemap-1.xml`
- `netlify/edge-functions/track-page-requests.ts` - GA4 tracking for non-Framer HTML pages
- `netlify/edge-functions/track-asset-requests.ts` - Asset request tracking

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

### 2026-03-31 - NXC-4176: Force Vite 7 for React Router Framework Mode
- **Branch**: `NXC-4176`
- **PR**: https://github.com/nrwl/nx/pull/35101
- **Purpose**: Fix peer dependency conflict between Vite 8 (new default) and `@react-router/dev` when creating React workspace with React Router in framework/server mode
- **Approach**: Pass `useViteV7: true` through vite configuration generator chain when `useReactRouter` is true
- **Key insight**: Vite version selection flows through `setupViteConfiguration` → `viteConfigurationGenerator` → `initGenerator` → `checkDependenciesInstalled`. The `useViteV7` flag was already supported in `InitGeneratorSchema` but not exposed in `ViteConfigurationGeneratorSchema`.
- **Files**:
  - `packages/react/src/generators/application/lib/bundlers/add-vite.ts` — conditional `useViteV7` pass-through
  - `packages/vite/src/generators/configuration/schema.d.ts` — added `useViteV7` to type
  - `packages/react/src/generators/application/application.spec.ts` — test for vite 7 assertion

### 2026-03-28 - NXC-4169: Dependabot Fixture Noise Reduction
- **Branch**: `NXC-4169`
- **Worktree**: `/Users/jack/projects/nx-worktrees/NXC-4169`
- **Status**: Committed, pending push + PR
- **Purpose**: Rename vulnerable package names in test fixture lockfiles to `@nx-testing/*` to suppress false Dependabot security alerts
- **Impact**: Clears 44 of 83 open alerts (53%), including 25 of 44 high-severity (57%)
- **Approach**: JSON-aware rename script (`tmp/rename-fixture-packages.mjs`) that preserves key ordering, handles nested dependency paths, and processes all npm lockfile formats (v1/v2/v3)
- **Gotcha**: JS object key ordering matters — `delete + insert` moves keys to end. Must rebuild objects to preserve position. The lockfile pruning serializer depends on root lockfile key order.
- **Follow-up**: NXC-4170 for 19 remaining high-severity alerts in real deps
- **Files**: `packages/nx/src/plugins/js/lock-file/__fixtures__/` (15 files), `npm-parser.spec.ts`

### 2026-03-27 - DOC-455: Blog/Changelog Reverse Proxy in Edge Function
- **Branch**: DOC-455
- **Commit**: `a7ba2fd93c`
- **PR**: https://github.com/nrwl/nx/pull/35043
- **Status**: PR created, testing on deploy preview
- **Purpose**: Proxy `/blog/*` and `/changelog/*` to standalone blog site (`nrwl-blog.netlify.app`), toggled via `BLOG_URL` env var
- **Approach**: Modified existing Netlify edge function (`rewrite-framer-urls.ts`) instead of Next.js `beforeFiles` rewrites — edge function is already the routing decision point
- **Key Decision**: Used edge function over Next.js config because blog/changelog have local routes (`app/blog/`, `pages/changelog.tsx`) that would shadow afterFiles rewrites. Edge function runs before Next.js entirely.
- **Design**: Three-way routing: `nextjsPaths` exact match → Next.js, `isBlogPath && !blogUrl` → Next.js, `isBlogPath && blogUrl` → blog proxy, else → Framer proxy
- **Asset concern**: Edge function only handles `text/html`. Blog site assets need to be served from blog's own CDN (configured via Vite `base` in blog repo).
- **Also fixed**: `/favicon.ico` and `/favicon.svg` 404s — added redirects in `_redirects`
- **Files**: `netlify/edge-functions/rewrite-framer-urls.ts`, `nx-dev/nx-dev/_redirects`

### 2026-03-27 - NXC-4153: Fix CNW Non-Interactive Mode + Template Shorthands
- **Branch**: NXC-4153
- **Commit**: `ebc19c7785`
- **PR**: https://github.com/nrwl/nx/pull/35045
- **Status**: PR created
- **Purpose**: Fix 22.6.0 regression where non-interactive contexts crash without `--preset`, and add shorthand template names
- **Root Cause**: `determineTemplate()` returned `'custom'` in non-interactive mode, routing to preset flow which requires `--preset`. ~145 errors Mar 18-27.
- **Fix 1**: Changed non-interactive/CI fallback to `'nrwl/empty-template'` (template flow). Removed dead ternary branch (`parsedArgs.preset` check was unreachable since line 110 already handles it).
- **Fix 2**: Added `resolveTemplateShorthand()` — maps `angular`, `react`, `typescript`, `empty` to full `nrwl/*-template` paths. Updated `--help` examples.
- **Files**: `prompts.ts`, `prompts.spec.ts` (new), `create-workspace.ts`, `create-workspace.spec.ts`, `bin/create-nx-workspace.ts`

### 2026-03-27 - NXC-4152: Fix Vite 8 Cypress CT Test Failures
- **Branch**: NXC-4152
- **Status**: Complete (not yet pushed)
- **Purpose**: Fix Angular and React cypress-component-configuration unit tests that break when `@nx/cypress` is bumped to 22.7.0-beta.5
- **Root Cause**: beta.5 added a Vite 8 guard in `componentConfigurationGenerator` — reads `vite` from tree's `package.json`, throws if major >= 8. Our generators install `vite: '^8.0.0'`, so all CT tests fail.
- **Fix**: Added `useVite7ForCypressCT(tree)` helper to both test files. Downgrades vite to `^7.0.0` in tree before calling cypress config generator.
- **Key Constraint**: Cannot go in `beforeEach` — app generators run after `beforeEach` and re-add `vite: '^8.0.0'`.
- **Files**: `packages/angular/src/generators/cypress-component-configuration/cypress-component-configuration.spec.ts`, `packages/react/src/generators/cypress-component-configuration/cypress-component-configuration.spec.ts`
- **TODO**: Remove `useVite7ForCypressCT` when Cypress adds Vite 8 support (https://github.com/cypress-io/cypress/issues/33078)

### 2026-03-27 - NXC-4113: A/B Test Cloud Prompt Copy
- **Branch**: NXC-4113
- **Commit**: `50fef73acf`
- **Status**: Branch pushed, PR not yet created
- **Purpose**: Re-enable cloud prompt in CNW with 3 A/B test copy variants to increase "yes" and reduce "never" rates
- **Key Changes**:
  - Removed `shouldShowCloudPrompt()` (was returning `false`, unused)
  - `PromptMessages.getPrompt()` now uses `getFlowVariant()` to select prompt copy variant (was independent random)
  - 3 variants in `setupNxCloudV2`: baseline ("Connect to Nx Cloud?"), remote-cache-focused, CI-speed-focused
  - "No, don't ask again" dimmed via `chalk.dim()` to reduce "never" selections
  - Each variant has unique tracking code for measurement
- **Design Decision**: Prompt copy variant tied to flow variant (`NX_CNW_FLOW_VARIANT`) rather than separate randomization — single env var controls both for testing and tracking consistency
- **Files**: `packages/create-nx-workspace/src/utils/nx/ab-testing.ts`, `ab-testing.spec.ts`

### 2026-03-25 - NXC-4141: Reduce Push to GitHub Errors
- **Branch**: NXC-4141
- **Commit**: `b7bf7fba07`
- **PR**: https://github.com/nrwl/nx/pull/35011
- **Status**: In review
- **Purpose**: Fix 96.3% push failure rate in CNW by adding timeouts and graceful error handling
- **Key Changes**:
  - Tiered timeouts: 1s for `gh --version`/`gh api user`, 10s for `gh repo list`, 30s for `gh repo create --push`
  - Switched push from `spawnAndWait` (stdio:inherit) to `execAndWait` — prevents git output bleeding after CNW exits
  - All `gh` commands use `silenceErrors: true` — no more stray `error.log` in workspaces (#34482)
  - `getGitHubUsername()` returns `null` on failure (gh is optional)
  - New `GitHubPushError` class replaces `GitHubPushSkippedError` — has `reason` field for telemetry
  - `pushToGitHub()` throws `GitHubPushError` (not `CnwError`) — caller in `create-workspace.ts` catches and handles gracefully
  - Only `push-failed`/`push-timeout` show `github.com/new` hint; pre-flight failures are silent
  - `pushFailReason` added to `recordStat` telemetry
- **Design Decisions**:
  - FrozenPandaz review: throw error instead of return status — follows existing GitHub error patterns
  - Pre-flight failures (gh not installed, auth failed) are silent to user but logged in telemetry
  - CNW always succeeds — push failures are warnings, never fatal

### 2026-03-25 - NXC-4112: Auto-open Browser on Cloud "Yes"
- **Branch**: NXC-4112
- **Commit**: `a88aa249f0`
- **PR**: https://github.com/nrwl/nx/pull/35014
- **Status**: In review
- **Purpose**: Auto-open the Nx Cloud setup URL in the user's browser after selecting "yes" during CNW, reducing friction at the Cloud conversion moment
- **Key Changes**:
  - Added `open` (^8.4.0) dependency to `create-nx-workspace/package.json`
  - New `openCloudSetupUrl()` in `nx-cloud.ts` — skips in CI (`isCI()`), catches errors silently
  - Called from `create-workspace.ts` after `getNxCloudInfo()`, gated on `!skipCloudConnect`
- **Design Decisions**:
  - Reused same `open` package version as `packages/nx/` (which uses it in `nx connect`)
  - Opens after banner display so user sees URL even if browser fails
  - No spinner/delay unlike `nx connect` — keeps it lightweight

### 2026-03-02 - NXC-4020: Restore CNW Prompt Flow to v22.1.3
- **Branch**: NXC-4020
- **Commit**: `b693b01625`
- **PR**: https://github.com/nrwl/nx/pull/34671
- **Status**: Merged, CI green
- **Purpose**: Revert Jan-Feb 2026 CNW experiments — make human-visible flow identical to v22.1.3 while preserving agentic/NDJSON, `--template`, telemetry
- **Key Changes**:
  - Commented out template prompt in prompts.ts (NXC-4020 tags, not deleted)
  - Restored `setupNxCloud` to "Would you like remote caching?" wording in ab-testing.ts
  - Simplified preset flow in create-nx-workspace.ts to v22.1.3 pattern
  - Split preset/template flows completely in create-workspace.ts
  - Fixed `accessToken=undefined` bug by passing actual nxCloud to createEmptyWorkspace
  - Restored `getNxCloudInfo` v22.1.3 signature with `rawNxCloud` in nx-cloud.ts
  - Locked `getBannerVariant()` to `'0'` (plain text, not box banner)
- **Key Bug**: `nxCloud: 'skip'` override prevented nxCloudId from being written → readNxCloudToken returned undefined → manual URL with `accessToken=undefined`
- **Task Plan**: `.ai/2026-03-02/tasks/cnw-revert-prompts-to-22.1.3.md`

### 2026-02-26 - Community PR Review (24 PRs)
- **Status**: Complete
- **Purpose**: Batch review all open community PRs that close issues
- **Actions**: Approved 7, commented on 11, requested changes on 6
- **Key approvals**: #34182 (Maven pom fix), #34350 (Jest matcher surgical replace), #32282 (watch --all --initialRun), #34491 (shell metacharacter quoting), #34485 (changelog dependent tags), #34549 (Bun call stack dedup), #34480 (plugin worker startup)
- **Declined**: #33766 (VS Code Copilot detection -- false positives for all VS Code users)
- **Follow-up needed**: #34534 (ESLint v10, needs test), #31684 (SSH URL, hostname regression), #33389 (dependents feature, needs team buy-in)
- **Full report**: `.ai/2026-02-26/tasks/community-pr-review.md`

### 2026-02-25 - Fix #34399: Redundant vite.config.ts for vitest projects
- **Issue**: https://github.com/nrwl/nx/issues/34399
- **Branch**: issue-34399
- **PR**: https://github.com/nrwl/nx/pull/34603
- **Status**: PR open, CI green
- **Purpose**: Fix TS1470 error caused by redundant `vite.config.ts` with ESM-only `import.meta.dirname` when generating vitest projects
- **Root Cause**: `@nx/js` library generator called `createOrEditViteConfig` from `@nx/vite` AFTER `@nx/vitest` configurationGenerator already created the correct `vitest.config.mts`. Two different functions with the same name in different packages.
- **Key Changes**:
  - Removed redundant `createOrEditViteConfig` call and `ensurePackage('@nx/vite')` from `packages/js/src/generators/library/library.ts`
  - Updated tests in `packages/js/` and `packages/plugin/` to assert `vitest.config.mts` instead of `vite.config.ts`
- **Key Learning**: The vitest and vite packages have separate copies of `createOrEditViteConfig` with different behavior. The vitest version supports `vitestFileName` and uses `__dirname`; the vite version always uses `import.meta.dirname`.

### 2026-01-27 - DOC-389: Content Negotiation for LLM-Friendly Docs Access
- **Task**: DOC-389 - Return markdown content when Accept does not contain text/html
- **Branch**: DOC-389
- **Commit**: `56aacac256` - feat(nx-dev): content negotiation for LLM-friendly docs access
- **Status**: Complete, merged
- **Purpose**: Allow LLM tools to get markdown by requesting standard URL with `Accept: text/markdown`
- **Key Changes**:
  - Modified `astro-docs/netlify/edge-functions/add-link-headers.ts` - content negotiation via rewrite
- **Design Decisions**:
  - Explicit opt-in (`Accept: text/markdown`) rather than implicit (`!text/html`)
  - Netlify rewrite (return URL object) instead of redirect - single request, works with all HTTP clients
- **Task Plan**: `.ai/2026-01-27/SUMMARY.md`

### 2026-01-27 - DOC-236: LLM-Friendly Resource Discovery
- **Task**: DOC-236 - Support Markdown, llms.txt, and llms-full.txt
- **Branch**: DOC-236
- **Commit**: `6fb48d340d` - feat(nx-dev): add llms-full.txt and HTTP Link headers for LLM discovery
- **Status**: Complete, merged
- **Purpose**: Implement llmstxt.org spec for better LLM access to Nx documentation
- **Key Changes**:
  - Created `astro-docs/src/pages/llms-full.txt.ts` - concatenates all docs (~2.87MB, 503 pages)
  - Created `astro-docs/netlify/edge-functions/add-link-headers.ts` - HTTP Link headers for HTML pages
  - Updated `nx-dev/nx-dev/next.config.js` - rewrites for llms-full.txt with trailing slash fix
  - Fixed `track-asset-requests.ts` - immutable response issue (Graphite Agent feedback)
- **Bug Fixed**: Netlify Edge Function responses are immutable - `response.headers.set()` doesn't work; must create new Response
- **Bug Fixed**: `NEXT_PUBLIC_ASTRO_URL` trailing slash caused double slashes in rewrite destinations
- **Task Plan**: `.ai/2026-01-27/SUMMARY.md`

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

### Duplicate Utility Functions Across Nx Packages (vite vs vitest)
- **Issue**: `createOrEditViteConfig` exists in BOTH `packages/vite/src/utils/generator-utils.ts` AND `packages/vitest/src/utils/generator-utils.ts` with different behavior
- **Vite version**: Always creates `vite.config.*`, uses `root: import.meta.dirname`, no `vitestFileName` support
- **Vitest version**: Supports `vitestFileName` option (creates `vitest.config.mts`), uses `root: __dirname`, takes `extraOptions` object as 4th param
- **Trap**: When importing `createOrEditViteConfig`, the source package matters. Using `ensurePackage('@nx/vite')` gets the vite version; the vitest configurationGenerator uses its own local copy.
- **Impact**: #34399 — duplicate config file with wrong ESM syntax
- **Rule**: When the vitest configurationGenerator is called, do NOT also call `createOrEditViteConfig` from `@nx/vite` — the vitest generator handles config creation internally.

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

### CNW Push to GitHub: stdio:inherit Causes Output Bleeding (2026-03-25)
- **Issue**: `spawnAndWait` with `stdio: 'inherit'` for `gh repo create --push` causes git push output to bleed into terminal after CNW exits
- **Root Cause**: SIGTERM kills the `gh` wrapper but not the underlying `git push` subprocess; orphaned process output goes to inherited stdio
- **Solution**: Use `execAndWait` instead — output captured in buffers, Node's `exec` timeout kills entire process tree
- **Also**: `execAndWait` with `silenceErrors: true` prevents `error.log` from being written to workspace directory

### CNW Push to GitHub: Error Handling Pattern (2026-03-25)
- **Pattern**: `pushToGitHub()` throws `GitHubPushError` (not `CnwError`) on failure
- **Caller** (`create-workspace.ts`) catches `GitHubPushError` separately from other errors
- **Key**: Only `push-failed` and `push-timeout` reasons show user-facing message; pre-flight failures (gh not installed, auth failed) are silent
- **Rule**: CNW must always succeed regardless of gh push outcome — push is a nice-to-have, not a requirement

### CNW Preset Flow: nxCloud Value Must Pass Through (2026-03-02)
- **Issue**: Overriding `nxCloud: 'skip'` in `createEmptyWorkspace()` prevents `nxCloudId` from being set in nx.json
- **Impact**: `readNxCloudToken()` returns undefined → onboarding URL contains `accessToken=undefined`
- **Rule**: The preset flow MUST pass the actual `nxCloud` value so cloud connection happens during workspace creation
- **Context**: NXC-4020 fixed this by removing the override; template flow handles cloud separately via `connectToNxCloudForTemplate()`

### Netlify Edge Function Response Immutability (2026-01-27)
- **Issue**: Edge function responses from `context.next()` are immutable
- **Wrong Approach**: `response.headers.set('Header', 'value')` - silently fails
- **Correct Approach**: Create new Response with cloned headers
- **Pattern**:
  ```typescript
  const response = await context.next();
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Custom-Header', 'value');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
  ```
- **Detection**: Graphite Agent / PR review tooling can catch this
- **Files affected**: Any edge function under `astro-docs/netlify/edge-functions/`

### Netlify Edge Function Rewrites (2026-01-27)
- **Purpose**: Serve content from different URL without redirect (single request)
- **Pattern**: Return `URL` object instead of `Response`
  ```typescript
  return new URL('/path/to/serve', request.url);
  ```
- **Key**: Use `request.url` as base (not `url.origin`) per Netlify docs
- **Use Case**: Content negotiation - serve `.md` for `Accept: text/markdown` requests
- **vs Redirect**: Rewrite = single request, works with all HTTP clients; Redirect = extra round trip

### Nested node_modules Causing Stale Module Resolution (2026-01-30)
- **Symptom**: `Cannot find module` error referencing old package version path (e.g., `typescript@5.8.3` when you're on `5.9.2`)
- **Example**: `Error: Cannot find module '/path/to/nx/node_modules/.pnpm/typescript@5.8.3/node_modules/typescript/bin/tsc'`
- **Root Cause**: Nested `node_modules` folder somewhere in the repo that shouldn't exist
- **Why it happens**: pnpm/npm resolution walks up the directory tree; a nested node_modules with old dependencies can get picked up
- **What doesn't fix it**: `nx reset`, `pnpm store prune`, clearing caches - these don't touch nested node_modules
- **Solution**: Find and remove the rogue node_modules: `find . -name node_modules -type d | grep -v "^\./node_modules"`
- **Prevention**: Check for nested node_modules when encountering mysterious "old version" module resolution errors

### Astro Migration Pattern
- Using `NEXT_PUBLIC_ASTRO_URL` as feature flag for progressive migration
- Blog remains in Next.js while docs move to Astro
- Search needs special handling to work across both platforms

