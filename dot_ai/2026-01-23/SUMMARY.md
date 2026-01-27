# Summary - 2026-01-23

## Completed

### NXC-3718: Implement `NX_PREFER_NODE_STRIP_TYPES` Environment Variable

**Linear Issue**: https://linear.app/nxdev/issue/NXC-3718

Implemented a new environment variable `NX_PREFER_NODE_STRIP_TYPES` that allows Nx to skip swc-node/ts-node transpiler registration when Node.js 22.6+ native TypeScript type stripping is available (`process.features.typescript`).

**Files Modified**:
- `packages/nx/src/plugins/js/utils/register.ts` - Added `preferNodeStripTypes` check and early return in `registerTsProject`
- `astro-docs/src/content/docs/reference/environment-variables.mdoc` - Documented the new env var

**Key Implementation Details**:
- Opt-in via `NX_PREFER_NODE_STRIP_TYPES=true`
- Checks `process.features.typescript` for Node.js native TS support
- Still registers tsconfig-paths for path mapping support
- Affects all plugins using `loadConfigFile` (Jest, Cypress, Playwright, etc.)

**E2E Test Created**:
- `e2e/js/src/js-strip-types.test.ts` - Tests project graph computation with:
  - `jest.config.ts` (via `@nx/js:lib`)
  - `cypress.config.ts` (via `@nx/react:app`)
  - `playwright.config.ts` (via `@nx/playwright:configuration`)
- Includes conditional test suite that only runs on Node.js 22.6+

---

### DOC-386: Add Netlify Edge Function to Track .txt and .md Asset Requests in GA4

**Linear Issue**: https://linear.app/nxdev/issue/DOC-386

Added a Netlify edge function to track requests to `.txt` and `.md` files (like `llms.txt` and raw markdown docs) in Google Analytics 4 via the Measurement Protocol API.

**Files Created/Modified**:
- `astro-docs/netlify/edge-functions/track-asset-requests.ts` - Edge function that sends page_view events to GA4
- `astro-docs/netlify.toml` - Added `[[edge_functions]]` configuration for `/*.txt` and `/*.md` paths

**Key Implementation Details**:
- Runs on all `.txt` and `.md` requests via Netlify Edge Functions
- Detects AI tools from user-agent (Claude, GPT, Perplexity, etc.)
- Sends custom GA4 dimensions: `content_type`, `file_extension`, `is_ai_tool`, `user_agent_category`
- Uses `context.waitUntil()` for non-blocking analytics
- Extracts GA client ID from cookie or generates session-based ID

**Required Environment Variables** (to be set in Netlify):
- `GA_MEASUREMENT_ID` - GA4 measurement ID (G-XXXXXXXXXX format)
- `GA_API_SECRET` - GA4 Measurement Protocol API secret

**Note**: Current repo only has Universal Analytics ID (`UA-88380372-10`). GA4 property needed for this to work.

**Debugging**: Added `x-nx-edge-function` response header to verify edge function execution. Test with:
```bash
curl -v https://deploy-preview-34203--nx-docs.netlify.app/llms.txt 2>&1 | grep -i "x-nx-edge"
```

---

### NXC-3754: Clean up CNW GitHub URL Messaging When gh Push Fails

**Linear Issue**: https://linear.app/nxdev/issue/NXC-3754
**Commit**: `2d91f52580`

Consolidated two redundant GitHub URL messages when `gh repo create` fails into a single, helpful message with the `?name=...` parameter.

**Problem**: When pushing to GitHub fails, users saw two messages:
1. Error handler: "Could not push. Push repo to complete setup. Go to https://github.com/new?name=myworkspace..."
2. Completion message: "Push your repo, then go to Nx Cloud..." (without GitHub URL)

**Solution**: Single consolidated message with workspace name parameter:
> "Push your repo (https://github.com/new?name=myworkspace), then go to Nx Cloud and finish the setup..."

**Files Modified (6 files, +76/-46)**:
- `packages/create-nx-workspace/src/utils/git/git.ts` - Simplified error handler to remove redundant URL message
- `packages/create-nx-workspace/src/utils/nx/messages.ts` - Added `workspaceName` parameter to `getSetupMessage()` and `getCompletionMessage()`
- `packages/create-nx-workspace/src/utils/nx/nx-cloud.ts` - Added `workspaceName` parameter threading
- `packages/create-nx-workspace/src/create-workspace.ts` - Passes `name` to `getNxCloudInfo()`
- `packages/create-nx-workspace/bin/create-nx-workspace.ts` - Updated SIGINT handler with GitHub URL
- `packages/create-nx-workspace/src/utils/nx/messages.spec.ts` - Updated tests with new snapshot expectations

---

### NXC-3753: Update CI Workflow Generator - Replace `nx-cloud` with `nx` Commands

**Linear Issue**: https://linear.app/nxdev/issue/NXC-3753
**PR**: https://github.com/nrwl/nx/pull/34193

Made `nx record` and `nx fix-ci` work with a warning when not connected to Cloud.

**Changes Made:**

1. **CI Workflow Generator** (`packages/workspace/src/generators/ci-workflow/`):
   - Changed `nx-cloud record` → `nx record` in generated workflow comments
   - Updated `getNxCloudRecordCommand()` and `getBitbucketBranchCommands()` functions
   - Updated 95 test snapshots

2. **PR Comment Fix** - Addressed FrozenPandaz's review:
   - Removed custom `isConnectedToNxCloud()` from `utils.ts`
   - Updated 7 cloud command handlers to use `isNxCloudUsed(readNxJson())`:
     - fix-ci, record, login, logout, start-agent, start-ci-run, stop-all-agents
   - `isNxCloudUsed()` is more comprehensive - checks env vars, tokens, and runner options

**Files Modified:**
- `packages/workspace/src/generators/ci-workflow/ci-workflow.ts`
- `packages/workspace/src/generators/ci-workflow/ci-workflow.spec.ts`
- `packages/workspace/src/generators/ci-workflow/__snapshots__/ci-workflow.spec.ts.snap`
- `packages/nx/src/command-line/nx-cloud/utils.ts`
- 7 cloud command handler files

---

## Background Context (from 2026-01-22)

### NXC-3718: Deep Investigation - Slow @nx/jest Plugin with TS Configs

The implementation above follows investigation that identified tsconfig variation as the root cause of Jest plugin slowness.

**Key Experiments Conducted:**

1. **Isolated imports vs tsconfig variation** with controlled A/B/C/D tests:

   | Scenario | Imports | Varying tsconfig | Time | Factor |
   |----------|---------|------------------|------|--------|
   | A | No | No | 5.09s | 1x |
   | B | Yes | No | 5.01s | 1x |
   | C | No | Yes (paths) | 24.31s | **4.8x** |
   | D | Yes | Yes (paths) | 27.54s | **5.4x** |

2. **Tested realistic tsconfig variations:**

   | Variation | Time | Causes Slowdown? |
   |-----------|------|------------------|
   | identical | 5.16s | No |
   | rootDir | 23.87s | **YES** |
   | baseUrl | 24.55s | **YES** |
   | types (2-3 variants) | 5.30s | No |
   | jsx | 5.15s | No |
   | decorators | 5.14s | No |
   | esModuleInterop | 5.18s | No |
   | 500 unique types | 23.83s | **YES** |

**Key Findings:**

1. **Imports do NOT cause slowdown** - even deep chains work fine when tsconfig is identical
2. **Varying tsconfig is the sole cause** - specifically options that create unique registration keys
3. **Only path-related options commonly vary**: `rootDir`, `baseUrl`, `paths`

**Files:**
- Investigation results: `.ai/2026-01-22/tasks/NXC-3718-investigation-results.md`
