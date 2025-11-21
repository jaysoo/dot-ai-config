# Summary - November 18, 2025

## Tasks Completed

### Angular Support Trends Analysis

Conducted comprehensive GitHub issues research to identify trends and complaints about Angular support in Nx. Key findings:

**Critical Pain Points Identified:**

1. **Module Federation Issues** (Critical)
   - Multiple open issues (#32465, #32285, #32641, #32447, #33316)
   - Angular Material components breaking with shared library conflicts
   - Users resorting to workarounds like importing unused modules
   - Angular 18→19→20 migrations breaking MFE platforms

2. **TypeScript Project References Incompatibility** (#29940)
   - 26 comments, blocks users from creating Angular apps in integrated Nx workspaces
   - Users with multi-framework monorepos must downgrade to Nx 20.2.0
   - Root cause: Angular CLI limitation

3. **Rspack/Angular Integration Issues**
   - 7+ open issues from June 2025, still unresolved (168+ days old)
   - Basic features broken: fileReplacements, cssFilename, redundant rebuilds

4. **Build Performance Regressions** (#32962)
   - Angular 20.2.x builds taking 4+ hours on Windows
   - Karma tests timing out

5. **ng-packagr / Library Issues**
   - Secondary entrypoints broken with ng-packagr v20
   - Module boundaries recommendations break builds

**Issue Volume Trends:**
- September 2025 spike: 15 issues (Angular 20 / Nx 21 integration)
- 40 issues currently labeled `scope: angular`
- Oldest unresolved: 239 days

**Conclusion:** The sentiment appears valid - Angular support has critical gaps blocking common enterprise workflows, particularly Module Federation, TypeScript project references, and Rspack integration.

## Tasks In Progress

### NXC-3240: Custom ESLint Rules Directory Support

**Linear Issue:** https://linear.app/nxdev/issue/NXC-3240
**Branch:** `feat/issue-32668`
**Due Date:** 2025-11-21

**Current Status:**
- Initial implementation done with `loadWorkspaceRules()` function
- CJS loading works
- ESM loading NOT working - needs directory-to-file resolution fix

**Issue:** `loadConfigFile()` expects file paths but receives directory paths. CJS `require()` resolves directories automatically, but ESM `import()` requires explicit file paths.

**Next Steps:**
1. Implement `resolveDirectoryEntryFile()` to find index.ts/index.js
2. Add comprehensive tests
3. Export from public API
4. Update documentation with usage examples

**Plan:** `.ai/2025-11-18/tasks/nxc-3240-custom-eslint-rules-directory.md`

### GitHub Issue #33258: Fix "Compile TypeScript Libraries to Multiple Formats" Documentation

**GitHub Issue:** https://github.com/nrwl/nx/issues/33258
**Branch:** `docs/33258`
**Priority:** High

**Problem:** The documentation article produces invalid packages because the generated `package.json` exports are missing proper `types` entries for both ESM and CJS formats. TypeScript 4.7+ requires explicit type declarations for each export condition.

**Changes Made:**
1. Restructured article to feature `@nx/rollup/plugin` approach first (modern default)
2. Moved executor approach to aside block as alternative
3. Updated filetree to show correct dist output structure
4. Added "Configure Package Exports" section with proper nested `types` entries
5. Added warning callout explaining TypeScript 4.7+ requirements
6. Added "Verify Your Package" section with [arethetypeswrong.github.io](https://arethetypeswrong.github.io/) links

**File:** `astro-docs/src/content/docs/technologies/typescript/Guides/compile-multiple-formats.mdoc`

## Key Insights

- Angular enterprise users facing multiple critical blockers
- Module Federation with Angular Material is particularly problematic
- New build tools (Rspack) have fundamental feature gaps
- Performance regressions on Windows affecting Angular 20.x
