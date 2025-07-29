# Update Nx Commands to Use @latest

## Task Type
Enhancement - Update documentation to use latest Nx version

## Goal
Ensure all markdown files in the docs directory that reference `npx nx connect` or `npx nx init` are updated to use `npx nx@latest` to ensure users always get the latest version.

## Plan

### Phase 1: Discovery
- [x] Search for all occurrences of `npx nx connect` and `npx nx init` in docs directory
- [x] Identify all files that need updating

### Phase 2: Implementation
- [x] Update `npx nx init` to `npx nx@latest init`
- [x] Update `npx nx connect` to `npx nx@latest connect`  
- [x] Update `npx nx connect-to-nx-cloud` to `npx nx@latest connect-to-nx-cloud`
- [x] Format all modified files with prettier

### Phase 3: Verification
- [x] Ensure all occurrences have been updated
- [x] Run prettier formatting on all modified files

## Files Modified

### npx nx init → npx nx@latest init (10 occurrences)
1. docs/blog/2025-03-18-architecting-angular-applications.md
2. docs/blog/2022-06-09-nx-14-2-angular-v14-storybook-update-lightweight-nx-and-more.md
3. docs/shared/migration/migration-angular.md
4. docs/blog/2025-03-19-using-angular-with-rspack.md
5. docs/shared/guides/react-router.md
6. docs/blog/2023-01-12-react-vite-and-typescript-get-started-in-under-2-minutes.md
7. docs/blog/2024-02-06-nuxt-js-support-in-nx.md
8. docs/blog/2022-05-25-lerna-used-to-walk-now-it-can-fly.md
9. docs/shared/getting-started/quick-start.md

### npx nx connect → npx nx@latest connect (16 occurrences)
1. docs/nx-cloud/features/split-e2e-tasks.md
2. docs/nx-cloud/features/flaky-tasks.md
3. docs/shared/migration/adding-to-existing-project.md
4. docs/shared/features/distribute-task-execution.md
5. docs/shared/migration/migration-angular.md
6. docs/shared/features/remote-cache.md
7. docs/shared/migration/adding-to-monorepo.md
8. docs/shared/features/self-healing-ci.md
9. docs/shared/features/cache-task-results.md
10. docs/nx-cloud/intro/ci-with-nx.md
11. docs/nx-cloud/intro/connect-to-cloud.md
12. docs/blog/2024-08-28-nxcloud-improved-ci-log.md
13. docs/blog/2025-03-17-modern-angular-testing-with-nx.md
14. docs/blog/2025-06-25-nx-cloud-mcp-ci-optimization.md
15. docs/blog/2025-06-23-nx-self-healing-ci.md (2 occurrences)

### npx nx connect-to-nx-cloud → npx nx@latest connect-to-nx-cloud (1 occurrence)
1. docs/blog/2022-05-25-lerna-used-to-walk-now-it-can-fly.md

## Expected Outcome
All documentation now correctly instructs users to use `npx nx@latest` commands, ensuring they always get the latest version of Nx when running these commands. This prevents potential issues from using outdated cached versions.

## Status
✅ Completed on 2025-07-29