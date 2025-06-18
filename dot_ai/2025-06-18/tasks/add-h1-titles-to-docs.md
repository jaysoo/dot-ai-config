# Add H1 Titles to Documentation Files

## Task Overview
Analyze `docs/map.json` to find all documents under "technologies" and "core-api" sections with IDs matching "introduction" or "overview". For any files missing an H1 title after the front matter, add the appropriate plugin/package name as the H1.

## Plan

### Step 1: Parse and Analyze map.json
- Read the map.json file in sections (it's too large to read at once)
- Extract all entries under "technologies" and "core-api" sections
- Filter for entries with IDs containing "introduction" or "overview"
- Create a list of file paths to check

**TODO:**
- [ ] Read map.json in sections
- [ ] Extract relevant entries
- [ ] Create file list

### Step 2: Check Each Document
- For each identified file:
  - Read the file content
  - Check if it has an H1 title after the front matter
  - Record which files need updates

**TODO:**
- [ ] Read each file
- [ ] Check for H1 presence
- [ ] Create list of files needing updates

### Step 3: Add Missing H1 Titles
- For files missing H1 titles:
  - Determine the appropriate title based on the file path and context
  - Add the H1 after the front matter
  - Format: `# @nx/<package-name>` or appropriate title

**TODO:**
- [x] Determine correct titles
- [x] Add H1 to files
- [x] Verify changes

### Completed Updates:
All 29 files have been updated with appropriate H1 titles:
- Core API files: Added package names (e.g., `# @nx/azure-cache`)
- Technology introduction files: Added package names (e.g., `# @nx/angular`)
- Angular Rspack introduction: Already had appropriate title `# Introduction`

## Implementation Notes

### Title Determination Rules:
1. For package-specific docs: Use `# @nx/<package-name>` format
2. For core concepts: Use descriptive title based on context
3. Extract package name from file path when possible

### Example:
- File: `docs/shared/packages/shared-fs-cache/shared-fs-cache-plugin.md`
- Title: `# @nx/shared-fs-cache`

## Expected Outcome
All documentation files under "technologies" and "core-api" sections with "introduction" or "overview" IDs will have proper H1 titles after their front matter, improving documentation consistency and readability.

## Task Completion Summary

✅ **Task completed successfully!**

- Analyzed `docs/map.json` to find all documents with "introduction" or "overview" IDs
- Found 31 relevant files across "technologies" and "core-api" sections
- Identified 29 files missing H1 titles
- Successfully added appropriate H1 titles to all 29 files
- Each file now has a consistent H1 title format:
  - Package plugins: `# @nx/<package-name>`
  - Special cases preserved (e.g., Angular Rspack introduction kept as `# Introduction`)

The documentation is now more consistent and easier to navigate, with each introduction/overview page clearly labeled with its package or technology name.

## Progress Tracking
Keep track of implementation progress in this section:
- Files analyzed: 31
- Files needing H1: 29
- Files updated: 29

### Step 1 Progress:
- [x] Read map.json in sections
- [x] Extract relevant entries
- [x] Create file list

### Step 2 Progress:
- [x] Read each file
- [x] Check for H1 presence
- [x] Create list of files needing updates

### Files Needing Updates:
1. docs/shared/packages/azure-cache/azure-cache-plugin.md → # @nx/azure-cache
2. docs/shared/packages/conformance/conformance-plugin.md → # @nx/conformance
3. docs/shared/packages/gcs-cache/gcs-cache-plugin.md → # @nx/gcs-cache
4. docs/shared/packages/owners/owners-plugin.md → # @nx/owners
5. docs/shared/packages/s3-cache/s3-cache-plugin.md → # @nx/s3-cache
6. docs/shared/packages/shared-fs-cache/shared-fs-cache-plugin.md → # @nx/shared-fs-cache
7. docs/shared/packages/angular/angular-plugin.md → # @nx/angular
8. docs/shared/packages/esbuild/esbuild-plugin.md → # @nx/esbuild
9. docs/shared/packages/rspack/rspack-plugin.md → # @nx/rspack
10. docs/shared/packages/vite/vite-plugin.md → # @nx/vite
11. docs/shared/packages/webpack/plugin-overview.md → # @nx/webpack
12. docs/shared/packages/eslint/eslint.md → # @nx/eslint
13. docs/shared/packages/gradle/gradle-plugin.md → # @nx/gradle
14. docs/shared/packages/express/express-plugin.md → # @nx/express
15. docs/shared/packages/node/node-plugin.md → # @nx/node
16. docs/shared/packages/nest/nest-plugin.md → # @nx/nest
17. docs/shared/packages/expo/expo-plugin.md → # @nx/expo
18. docs/shared/packages/react/react-plugin.md → # @nx/react
19. docs/shared/packages/next/plugin-overview.md → # @nx/next
20. docs/shared/packages/react-native/react-native-plugin.md → # @nx/react-native
21. docs/shared/packages/remix/remix-plugin.md → # @nx/remix
22. docs/shared/packages/cypress/cypress-plugin.md → # @nx/cypress
23. docs/shared/packages/detox/detox-plugin.md → # @nx/detox
24. docs/shared/packages/jest/jest-plugin.md → # @nx/jest
25. docs/shared/packages/playwright/playwright-plugin.md → # @nx/playwright
26. docs/shared/packages/storybook/plugin-overview.md → # @nx/storybook
27. docs/shared/packages/js/js-plugin.md → # @nx/js
28. docs/shared/packages/vue/vue-plugin.md → # @nx/vue
29. docs/shared/packages/nuxt/nuxt-plugin.md → # @nx/nuxt