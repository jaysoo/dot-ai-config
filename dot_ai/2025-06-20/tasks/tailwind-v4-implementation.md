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

## Phase 2: React + Vite + No Dependencies

### Step 2.1: Add Vite plugin logic to setup-tailwind
**Commit**: `feat(react): add tailwind v4 vite plugin support`
- [ ] Add conditional logic in `setup-tailwind` generator
- [ ] If v4 + Vite: use `@tailwindcss/vite`
- [ ] Add vite.config.js modification logic
- [ ] Unit tests for generator logic

### Step 2.2: Update CSS file generation for v4
**Commit**: `feat(react): update css imports for tailwind v4`
- [ ] Change `@tailwind` to `@import "tailwindcss"`
- [ ] Create v4-specific CSS template
- [ ] Unit tests for file generation

### Step 2.3: Skip config file generation for v4 + Vite
**Commit**: `feat(react): skip tailwind.config.js for v4 vite projects`
- [ ] Add logic to skip postcss.config.js and tailwind.config.js
- [ ] Unit tests for config skip logic

### Step 2.4: E2E test for React + Vite + v4
**Commit**: `test(react): add e2e test for tailwind v4 with vite`
- [ ] Create test app
- [ ] Verify CSS compilation
- [ ] Verify utility classes work

## Phase 3: React + Vite + Dependencies

### Step 3.1: Update createGlobPatternsForDependencies for v4
**Commit**: `feat(react): ensure createGlobPatternsForDependencies works with v4`
- [ ] Verify the utility still exports correctly
- [ ] Add v4-specific handling if needed
- [ ] Unit tests

### Step 3.2: Add library dependency test setup
**Commit**: `test(react): add test library with tailwind classes`
- [ ] Create a test library with Tailwind classes
- [ ] Set up dependency relationship

### Step 3.3: E2E test for dependency class preservation
**Commit**: `test(react): verify library tailwind classes not pruned in v4`
- [ ] Build app that depends on library
- [ ] Verify library's Tailwind classes are in final CSS
- [ ] Test with production build

## Phase 4: React + Webpack + No Dependencies

### Step 4.1: Add PostCSS plugin support for v4
**Commit**: `feat(react): add tailwind v4 postcss plugin for webpack`
- [ ] Install `@tailwindcss/postcss` for v4 webpack projects
- [ ] Update postcss.config.js generation
- [ ] Unit tests

### Step 4.2: Update webpack configuration
**Commit**: `feat(react): update webpack config for tailwind v4`
- [ ] Ensure PostCSS loader is configured correctly
- [ ] Unit tests for config generation

### Step 4.3: E2E test for React + Webpack + v4
**Commit**: `test(react): add e2e test for tailwind v4 with webpack`
- [ ] Create test app with webpack
- [ ] Verify CSS compilation
- [ ] Verify utility classes work

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

### Deviations from Plan
Document any changes made during implementation that deviate from the original plan.