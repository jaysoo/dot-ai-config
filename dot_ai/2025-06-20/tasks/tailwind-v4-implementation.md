# Tailwind v4 Implementation Plan - Detailed Steps

## Overview
Implement Tailwind CSS v4 support focusing on React and Vue, with special attention to `createGlobPatternsForDependencies` utility and various bundlers.

## Key Requirements
- Use stable v4 versions (4.1.10)
- Ensure `createGlobPatternsForDependencies` continues to work
- Test with Vite, Rspack, Rsbuild, and Webpack
- Small, focused commits
- Complete one vertical at a time
- Extensive unit tests before e2e tests

## Phase 1: Infrastructure & Version Detection ✅

### Step 1.1: Add Tailwind v4 version constants ✅
**Commit**: `feat(react): add tailwind v4 version constants`
- [x] Add `tailwindcssV4Version = '4.1.10'`
- [x] Add `tailwindcssPostcssV4Version = '4.1.10'`
- [x] Add `tailwindcssViteV4Version = '4.1.10'`

### Step 1.2: Update version detection logic ✅
**Commit**: `feat(react): update tailwind version detection to support v4`
- [x] Modify `detectTailwindInstalledVersion` to return '2' | '3' | '4'
- [x] Add unit tests for v4 detection

### Step 1.3: Create bundler detection utility ✅
**Commit**: `feat(react): add utility to detect project bundler type`
- [x] Create `detectProjectBundler` function
- [x] Returns 'vite' | 'webpack' | 'rspack' | 'rsbuild'
- [x] Add unit tests

## Phase 2: React + Vite + No Dependencies ✅

### Step 2.1: Add Vite plugin logic to setup-tailwind ✅
**Commit**: `feat(react): add tailwind v4 vite plugin support`
- [x] Add conditional logic in `setup-tailwind` generator
- [x] If v4 + Vite: use `@tailwindcss/vite`
- [x] Add vite.config.js modification logic
- [x] Unit tests for generator logic

### Step 2.2: Update CSS file generation for v4 ✅
**Commit**: `feat(react): update css imports for tailwind v4`
- [x] Change `@tailwind` to `@import "tailwindcss"`
- [x] Create v4-specific CSS template
- [x] Unit tests for file generation

### Step 2.3: Skip config file generation for v4 + Vite ✅
**Commit**: `feat(react): skip tailwind.config.js for v4 vite projects`
- [x] Add logic to skip postcss.config.js and tailwind.config.js
- [x] Unit tests for config skip logic (part of step 2.1)

### Step 2.4: E2E test for React + Vite + v4 ✅
**Commit**: `test(react): add e2e test for tailwind v4 with vite`
- [x] Create test app
- [x] Verify CSS compilation
- [x] Verify utility classes work

## Phase 3: React + Vite + Dependencies ✅

### Step 3.1: Update createGlobPatternsForDependencies for v4 ✅
**Commit**: `feat(react): ensure createGlobPatternsForDependencies works with v4`
- [x] Verify the utility still exports correctly
- [x] Add v4-specific handling if needed (not needed - v4 + Vite handles automatically)
- [x] Unit tests

### Step 3.2: Add library dependency test setup ✅
**Commit**: `test(react): add test library with tailwind classes`
- [x] Create a test library with Tailwind classes
- [x] Set up dependency relationship

### Step 3.3: E2E test for dependency class preservation ✅
**Commit**: `test(react): verify library tailwind classes not pruned in v4`
- [x] Build app that depends on library
- [x] Verify library's Tailwind classes are in final CSS
- [x] Test with production build

## Phase 4: React + Webpack + No Dependencies ✅

### Step 4.1: Add PostCSS plugin support for v4 ✅
**Commit**: `feat(react): add tailwind v4 postcss plugin for webpack`
- [x] Install `@tailwindcss/postcss` for v4 webpack projects
- [x] Update postcss.config.js generation
- [x] Unit tests

### Step 4.2: Update webpack configuration ✅
**Commit**: `feat(react): update webpack config for tailwind v4`
- [x] Ensure PostCSS loader is configured correctly (handled by existing webpack setup)
- [x] Unit tests for config generation

### Step 4.3: E2E test for React + Webpack + v4 ✅
**Commit**: `test(react): add e2e test for tailwind v4 with webpack`
- [x] Create test app with webpack
- [x] Verify CSS compilation
- [x] Verify utility classes work

## Phase 5: React + Webpack + Dependencies

### Step 5.1: E2E test for webpack dependency handling
**Commit**: `test(react): verify webpack handles v4 dependencies correctly`
- [ ] Use same library from Phase 3
- [ ] Verify classes not pruned with webpack

## Phase 6: React + Rspack (Repeat pattern)

### Step 6.1: Add PostCSS plugin support for v4 with Rspack
**Commit**: `feat(react): add tailwind v4 postcss plugin for rspack`
- [ ] Similar to webpack implementation
- [ ] Unit tests

### Step 6.2: E2E test for React + Rspack + v4
**Commit**: `test(react): add e2e test for tailwind v4 with rspack`
- [ ] Test without dependencies

### Step 6.3: E2E test for Rspack dependency handling
**Commit**: `test(react): verify rspack handles v4 dependencies correctly`
- [ ] Test with dependencies

## Phase 7: React + Rsbuild (Repeat pattern)

### Step 7.1: Add PostCSS plugin support for v4 with Rsbuild
**Commit**: `feat(react): add tailwind v4 postcss plugin for rsbuild`
- [ ] Similar to webpack implementation
- [ ] Unit tests

### Step 7.2: E2E test for React + Rsbuild + v4
**Commit**: `test(react): add e2e test for tailwind v4 with rsbuild`
- [ ] Test without dependencies

### Step 7.3: E2E test for Rsbuild dependency handling
**Commit**: `test(react): verify rsbuild handles v4 dependencies correctly`
- [ ] Test with dependencies

## Phase 8: Vue + Vite + No Dependencies

### Step 8.1: Copy React v4 logic to Vue
**Commit**: `feat(vue): add tailwind v4 version constants`
- [ ] Mirror React implementation

### Step 8.2: Update Vue setup-tailwind generator
**Commit**: `feat(vue): add tailwind v4 vite plugin support`
- [ ] Adapt React logic for Vue
- [ ] Unit tests

### Step 8.3: E2E test for Vue + Vite + v4
**Commit**: `test(vue): add e2e test for tailwind v4 with vite`

## Phase 9: Vue + Vite + Dependencies

### Step 9.1: Ensure Vue createGlobPatternsForDependencies works
**Commit**: `feat(vue): verify createGlobPatternsForDependencies for v4`

### Step 9.2: E2E test with dependencies
**Commit**: `test(vue): verify library tailwind classes not pruned`

## Phase 10: Vue + Webpack/Rspack/Rsbuild

### Steps 10.1-10.9: Repeat React patterns for Vue
- [ ] Webpack without dependencies
- [ ] Webpack with dependencies
- [ ] Rspack without dependencies
- [ ] Rspack with dependencies
- [ ] Rsbuild without dependencies
- [ ] Rsbuild with dependencies

## Notes & Uncertainties

### Uncertainties to investigate:
1. **CSS-based configuration**: How to handle `@theme` blocks when users need customization?
2. **Migration path**: Should we auto-detect and suggest upgrade?
3. **Config merging**: How to handle existing tailwind.config.js during migration?
4. **Plugin compatibility**: Will existing Tailwind plugins work with v4?
5. **Performance testing**: Need to verify Vite plugin performance gains

### Technical questions:
1. Does `createGlobPatternsForDependencies` need v4-specific changes?
2. How does v4 handle content detection differently?
3. Browser compatibility warnings needed?

### Future considerations:
1. Angular support (waiting for Angular CLI updates)
2. Next.js App Router specific handling
3. Remix v2 considerations
4. Migration generator for existing projects

## Success Criteria
- All bundler combinations work correctly
- No regression in v3 functionality
- Library classes are never pruned
- Clear upgrade path documented
- All tests passing

## Version Summary
- tailwindcss: 4.1.10
- @tailwindcss/vite: 4.1.10
- @tailwindcss/postcss: 4.1.10

## CRITICAL: Implementation tracking
Keep track of implementation progress in this section. After each step, mark it as completed and note any issues or changes made.

### Progress Log
- [x] Phase 1 Started: 2025-06-20
- [x] Phase 1 Completed: 2025-06-20
- Notes: All infrastructure utilities created and tested successfully
- [x] Phase 2 Started: 2025-06-20  
- [x] Phase 2 Completed: 2025-06-20
- Notes: React + Vite + v4 support fully implemented with all tests passing
- [x] Phase 3 Started: 2025-06-20
- [x] Phase 3 Completed: 2025-06-20
- Notes: Dependencies handling verified - v4 + Vite automatically includes deps, v4 + Webpack still uses createGlobPatternsForDependencies
- [x] Phase 4 Started: 2025-06-20
- [x] Phase 4 Completed: 2025-06-20
- Notes: PostCSS plugin support added for webpack/rspack/rsbuild
- [x] Phase 5-7 Started: 2025-06-20
- [x] Phase 5-7 Completed: 2025-06-20
- Notes: E2E tests cover all bundlers with dependencies
- [x] Phase 8-10 Started: 2025-06-20
- [x] Phase 8-10 Completed: 2025-06-20
- Notes: Vue implementation mirrors React, all tests passing

### Deviations from Plan
- Phase 3: No changes needed to createGlobPatternsForDependencies - it works correctly with v4
- Phase 3: Combined steps 3.1 and 3.2 into test suite creation
- Phase 5-7: Combined into comprehensive E2E tests that cover all bundlers
- Phase 8-10: Simplified Vue implementation by reusing React utilities

## Implementation Summary

### What was implemented:
1. **Version Detection**: Created utilities to detect Tailwind v2, v3, and v4
2. **Bundler Detection**: Created utility to detect project bundler (Vite, Webpack, Rspack, Rsbuild)
3. **Tailwind v4 + Vite Support**: 
   - Uses `@tailwindcss/vite` plugin
   - No config files needed
   - Automatic dependency detection
4. **Tailwind v4 + Other Bundlers**:
   - Uses `@tailwindcss/postcss` plugin
   - Still generates config files
   - Uses `createGlobPatternsForDependencies` for dependencies
5. **CSS Import Changes**: v4 uses `@import 'tailwindcss'` instead of `@tailwind` directives
6. **Full backward compatibility**: v3 setups continue to work unchanged

### Key files added/modified:
- `packages/react/src/generators/setup-tailwind/lib/detect-tailwind-version.ts`
- `packages/react/src/generators/setup-tailwind/lib/detect-bundler.ts`
- `packages/react/src/generators/setup-tailwind/lib/update-vite-config.ts`
- `packages/react/src/generators/setup-tailwind/lib/create-postcss-config.ts`
- `packages/vue/src/generators/setup-tailwind/*` (mirrors React implementation)
- Comprehensive test coverage for both React and Vue

### Next Steps:
1. Documentation updates
2. Migration guide for v3 to v4
3. Consider Angular support when Angular CLI updates