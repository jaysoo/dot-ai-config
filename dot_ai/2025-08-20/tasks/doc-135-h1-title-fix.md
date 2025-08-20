# Task Plan: DOC-135 - Fix H1 and Frontmatter Title Mismatch

**Linear Issue**: [DOC-135](https://linear.app/nxdev/issue/DOC-135/style-main-title-and-h2-title-are-almost-not-distinguishable)
**Date**: 2025-08-20
**Branch**: DOC-135

## Problem
Main title (h1) and h2 titles are too similar in style, making them hard to distinguish visually.

## Solution Approach
Remove h1 headings from mdoc files since Starlight will display the title from frontmatter, creating better visual distinction.

## Implementation Steps

### Phase 1: Analysis ✅
- [x] Find all mdoc files with h1 headings
- [x] Create list of pages with their h1 headings
- [x] Identify which files need updating

### Phase 2: Update Frontmatter ✅
- [x] Update frontmatter titles to match h1 headings where needed
- [x] Add sidebar labels to preserve sidebar appearance

### Phase 3: Remove H1 Headings ✅
- [x] Remove h1 from features/run-tasks.mdoc
- [x] Remove h1 from features/maintain-typescript-monorepos.mdoc
- [x] Remove h1 from guides/Enforce Module Boundaries/tag-multiple-dimensions.mdoc
- [x] Remove h1 from guides/Nx Release/configure-custom-registries.mdoc
- [x] Remove h1 from guides/Nx Release/customize-conventional-commit-types.mdoc
- [x] Remove h1 from troubleshooting/resolve-circular-dependencies.mdoc
- [x] Remove h1 from troubleshooting/troubleshoot-cache-misses.mdoc

### Phase 4: Verification ✅
- [x] Verify all changes are correct
- [x] Document changes made

## Files Modified

1. **features/run-tasks.mdoc**
   - Updated title: "Run Tasks" → "Tasks"
   - Added sidebar label: "Run Tasks"
   - Removed h1 heading

2. **features/maintain-typescript-monorepos.mdoc**
   - Removed h1 heading

3. **guides/Enforce Module Boundaries/tag-multiple-dimensions.mdoc**
   - Removed h1 heading

4. **guides/Nx Release/configure-custom-registries.mdoc**
   - Removed h1 heading

5. **guides/Nx Release/customize-conventional-commit-types.mdoc**
   - Removed h1 heading

6. **troubleshooting/resolve-circular-dependencies.mdoc**
   - Removed h1 heading

7. **troubleshooting/troubleshoot-cache-misses.mdoc**
   - Removed h1 heading

## Expected Outcome
- Starlight will display titles from frontmatter only (no duplicate h1)
- Better visual distinction between page titles and h2 sections
- Sidebar labels preserved where needed

## Status: COMPLETED ✅

All h1 headings have been successfully removed from the 7 identified mdoc files.