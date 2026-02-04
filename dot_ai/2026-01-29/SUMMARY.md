# Summary - 2026-01-29

## Specs Created

### L4 to L5 Strategic Thinking Guidance

**File**: `.ai/2026-01-29/specs/l4-to-l5-strategic-thinking-guidance.md`

Brainstormed and created a self-assessment guide for L4 engineers to understand and demonstrate L5-level strategic thinking.

**Key insights captured:**
- Core mindset shift: "L4s deliver success when guided. L5s ensure success independently."
- L5s propose projects based on research, customer feedback, and data analysis
- L5s own the full lifecycle: ship → instrument → monitor weekly → iterate
- SME status is earned organically through sustained work and solving hard problems
- Anti-patterns: ship and forget, waiting to be told, buggy/incomplete delivery

**Concrete example included**: Engineer who noticed pipeline issues via Grafana → talked to customers → proposed Docker layer caching and registry mirroring → delivered dual impact (faster pipelines + lower infra costs).

**Format**: Self-assessment questions for each L5 expectation, designed for L4s to identify gaps and have informed EM conversations. Explicitly not a checkbox formula to avoid gaming.

## NXC-3783: Add Nx Cloud Connect URL to Template README (Continued)

Extended the README update functionality to handle edge cases around git commit state.

### Changes Made

1. **Moved `amendInitialCommit` to `update-readme.ts`**
   - Relocated function from `git.ts` to `update-readme.ts` for better cohesion
   - All README-related operations now in one module

2. **Renamed to `amendOrCommitReadme` with smart commit handling**
   - Added `alreadyPushed` parameter to handle two scenarios:
     - **Not pushed**: Amends the initial commit (cleaner single-commit history)
     - **Already pushed**: Creates a new commit + pushes to origin (avoids force push requirement)
   - Commit message for new commit: `"chore: add Nx Cloud setup link to README"`

3. **Updated `create-workspace.ts` usages**
   - Both cloud and skip-cloud paths now use the new function
   - Uses `VcsPushStatus.PushedToVcs` to determine `alreadyPushed` state

### Files Modified

- `packages/create-nx-workspace/src/utils/template/update-readme.ts` - Added `amendOrCommitReadme` function
- `packages/create-nx-workspace/src/create-workspace.ts` - Updated imports and usages

### Testing

All 58 tests in `create-nx-workspace` package pass.

## DOC-385: Fix Failing Internal Link Checks After /launch-nx URL Removal

**Linear**: https://linear.app/nxdev/issue/DOC-385
**PR**: https://github.com/nrwl/nx/pull/34255
**Commit**: `f46c029cac`

Fixed broken `/launch-nx` links and discovered why the link validator wasn't catching them.

### Root Cause Analysis

1. **Why wasn't `validate-links.ts` catching the broken link?**
   - `/launch-nx` was already in the ignore list since September 2025 (commit 8a75564c57)
   - I (Jack) added the ignore entry when creating `release-notes.mdoc` file

2. **Cache input bug discovered**
   - `check-links` task inputs only included `sitemap.xml` (248 bytes index file)
   - Actual URLs are in `sitemap-0.xml` (~40KB)
   - Changes to sitemap content weren't invalidating the cache

### Fixes Applied

1. **Fixed remaining `/launch-nx` link** in `release-notes.mdoc`
   - Changed to `/blog/launch-nx-week-recap`

2. **Removed `/launch-nx` from ignore list** in `validate-links.ts`

3. **Fixed cache inputs** in `nx-dev/nx-dev/project.json`
   - Changed `sitemap.xml` → `sitemap*.xml` (glob pattern)
   - Changed `sitemap-index.xml` → `sitemap*.xml`

### Files Modified

- `astro-docs/src/content/docs/reference/Nx Cloud/release-notes.mdoc` - Link fix
- `astro-docs/validate-links.ts` - Removed ignore entry
- `nx-dev/nx-dev/project.json` - Fixed cache inputs

### Note

`astro-docs:validate-links` has pre-existing failures (8 broken header links to `/blog`, `/community`, etc.) unrelated to this change.
