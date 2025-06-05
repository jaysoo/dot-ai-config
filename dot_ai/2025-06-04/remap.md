# URL Remap Plan: nx-api/documents to new structure

## Overview
This document contains the mapping plan for redirecting all `/nx-api/:tech/documents/:doc` URLs from `https://nx.dev` to the new preview structure. **Note: Overview pages are excluded as they will be handled separately.**

## Mapping Pattern
- **Old Pattern**: `/nx-api/:tech/documents/:doc`
- **New Pattern**: `/technologies/:tech/recipes/:doc` (needs verification)

## URL Verification Status

⚠️ **IMPORTANT**: The following URL was reported as 404:
- `https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/eslint/eslint-plugin/recipes/overview`

This suggests the URL pattern assumptions may be incorrect. **Manual verification needed** for all mappings.

## Complete URL Mappings (Excluding Overview Pages)

### Angular
- `https://nx.dev/nx-api/angular/documents/nx-and-angular` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/angular/documents/nx-and-angular) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/angular/recipes/nx-and-angular)
- `https://nx.dev/nx-api/angular/documents/nx-devkit-angular-devkit` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/angular/documents/nx-devkit-angular-devkit) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/angular/recipes/nx-devkit-angular-devkit)
- `https://nx.dev/nx-api/angular/documents/angular-nx-version-matrix` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/angular/documents/angular-nx-version-matrix) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/angular/recipes/angular-nx-version-matrix)

### Angular-rspack & Angular-rsbuild
- `https://nx.dev/nx-api/angular-rspack/documents/create-config` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/angular-rspack/documents/create-config) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/angular-rspack/recipes/create-config)
- `https://nx.dev/nx-api/angular-rspack/documents/create-server` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/angular-rspack/documents/create-server) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/angular-rspack/recipes/create-server)
- `https://nx.dev/nx-api/angular-rsbuild/documents/create-config` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/angular-rsbuild/documents/create-config) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/angular-rsbuild/recipes/create-config)
- `https://nx.dev/nx-api/angular-rsbuild/documents/create-server` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/angular-rsbuild/documents/create-server) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/angular-rsbuild/recipes/create-server)

### ESLint Plugin
- `https://nx.dev/nx-api/eslint-plugin/documents/enforce-module-boundaries` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/eslint-plugin/documents/enforce-module-boundaries) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/eslint-plugin/recipes/enforce-module-boundaries)
- `https://nx.dev/nx-api/eslint-plugin/documents/dependency-checks` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/eslint-plugin/documents/dependency-checks) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/eslint-plugin/recipes/dependency-checks)

### Module Federation
- `https://nx.dev/nx-api/module-federation/documents/nx-module-federation-plugin` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/module-federation/documents/nx-module-federation-plugin) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/module-federation/recipes/nx-module-federation-plugin)
- `https://nx.dev/nx-api/module-federation/documents/nx-module-federation-dev-server-plugin` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/module-federation/documents/nx-module-federation-dev-server-plugin) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/module-federation/recipes/nx-module-federation-dev-server-plugin)

### Storybook
- `https://nx.dev/nx-api/storybook/documents/best-practices` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/storybook/documents/best-practices) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/storybook/recipes/best-practices)
- `https://nx.dev/nx-api/storybook/documents/storybook-7-setup` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/storybook/documents/storybook-7-setup) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/storybook/recipes/storybook-7-setup)

### Workspace
- `https://nx.dev/nx-api/workspace/documents/nx-nodejs-typescript-version-matrix` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/workspace/documents/nx-nodejs-typescript-version-matrix) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/workspace/recipes/nx-nodejs-typescript-version-matrix)

### Conformance
- `https://nx.dev/nx-api/conformance/documents/create-conformance-rule` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/conformance/documents/create-conformance-rule) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/conformance/recipes/create-conformance-rule)

### Core Nx Commands (Special handling may be required)
- `https://nx.dev/reference/core-api/nx/documents/add` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/add) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/add)
- `https://nx.dev/reference/core-api/nx/documents/affected` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/affected) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/affected)
- `https://nx.dev/reference/core-api/nx/documents/connect-to-nx-cloud` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/connect-to-nx-cloud) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/connect-to-nx-cloud)
- `https://nx.dev/reference/core-api/nx/documents/create-nx-workspace` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/create-nx-workspace) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/create-nx-workspace)
- `https://nx.dev/reference/core-api/nx/documents/daemon` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/daemon) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/daemon)
- `https://nx.dev/reference/core-api/nx/documents/dep-graph` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/dep-graph) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/dep-graph)
- `https://nx.dev/reference/core-api/nx/documents/exec` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/exec) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/exec)
- `https://nx.dev/reference/core-api/nx/documents/format-check` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/format-check) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/format-check)
- `https://nx.dev/reference/core-api/nx/documents/format-write` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/format-write) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/format-write)
- `https://nx.dev/reference/core-api/nx/documents/generate` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/generate) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/generate)
- `https://nx.dev/reference/core-api/nx/documents/import` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/import) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/import)
- `https://nx.dev/reference/core-api/nx/documents/init` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/init) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/init)
- `https://nx.dev/reference/core-api/nx/documents/list` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/list) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/list)
- `https://nx.dev/reference/core-api/nx/documents/login` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/login) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/login)
- `https://nx.dev/reference/core-api/nx/documents/logout` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/logout) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/logout)
- `https://nx.dev/reference/core-api/nx/documents/migrate` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/migrate) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/migrate)
- `https://nx.dev/reference/core-api/nx/documents/release` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/release) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/release)
- `https://nx.dev/reference/core-api/nx/documents/repair` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/repair) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/repair)
- `https://nx.dev/reference/core-api/nx/documents/report` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/report) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/report)
- `https://nx.dev/reference/core-api/nx/documents/reset` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/reset) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/reset)
- `https://nx.dev/reference/core-api/nx/documents/run` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/run) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/run)
- `https://nx.dev/reference/core-api/nx/documents/run-many` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/run-many) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/run-many)
- `https://nx.dev/reference/core-api/nx/documents/show` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/show) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/show)
- `https://nx.dev/reference/core-api/nx/documents/sync` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/sync) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/sync)
- `https://nx.dev/reference/core-api/nx/documents/sync-check` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/sync-check) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/sync-check)
- `https://nx.dev/reference/core-api/nx/documents/view-logs` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/view-logs) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/view-logs)
- `https://nx.dev/reference/core-api/nx/documents/watch` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/reference/core-api/nx/documents/watch) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/nx/recipes/watch)

## DevKit API References (Special Consideration)

### Core DevKit Documents
- `https://nx.dev/nx-api/devkit/documents/nx_devkit` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/devkit/documents/nx_devkit) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/devkit/recipes/nx_devkit)
- `https://nx.dev/nx-api/devkit/documents/ngcli_adapter` → [Test Preview](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/nx-api/devkit/documents/ngcli_adapter) | [New Structure](https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/devkit/recipes/ngcli_adapter)

**Note**: 169 additional DevKit API reference pages exist but may need different handling as API documentation rather than "recipes".

## Action Items

1. **✅ VERIFIED 404**: `https://nx-dev-git-nx-dev-move-docs-to-guides-nrwl.vercel.app/technologies/eslint/eslint-plugin/recipes/overview` returns 404
2. **🔍 NEXT**: Test "Test Preview" links to see if old URLs work on preview domain
3. **🔍 NEXT**: Test "New Structure" links to verify correct new URL patterns  
4. **📝 DOCUMENT**: Record which URLs work vs 404 for final redirect plan
5. **🎯 PLAN**: Create redirect rules based on actual working patterns

## Summary

- **Total Non-Overview URLs**: ~35 document URLs (overview pages excluded)
- **Status**: URL pattern verification in progress
- **Known Issue**: Assumed `/technologies/:tech/recipes/:doc` pattern may be incorrect
- **Next Step**: Manual testing of both old and new URL patterns

---

# ⚠️ REDIRECT STATUS: VERIFICATION NEEDED

**🔍 URL PATTERN VERIFICATION REQUIRED**

❌ **Known 404**: `/technologies/eslint/eslint-plugin/recipes/overview`  
🔍 **Testing Required**: Both old URL structure and new URL patterns  
📝 **Documentation**: Need to record working vs 404 URLs  
🎯 **Goal**: Establish correct redirect mapping based on actual site structure  

**Action Required**: Test both "Test Preview" and "New Structure" links to determine correct patterns! 
