# 2026-02-20 Summary

## Completed

### Fix: Prevent nxCloudId from being generated for new workspaces
- **Branch:** `cnw_custom_fix`
- **PR:** https://github.com/nrwl/nx/pull/34532
- **Changes:** Added `nxCloud: 'skip'` to the custom CNW flow in `packages/create-nx-workspace/src/create-workspace.ts` so new workspaces get a short URL for Cloud onboarding instead of having `nxCloudId` baked into `nx.json`. Updated 8 e2e test files to assert `nxCloudId` is undefined, and removed `--nxCloud=skip` from `e2e/utils/create-project-utils.ts` (now handled in source).
- **CI:** Failed on unrelated flaky Gradle e2e tests (daemon race condition). Not caused by PR changes.

## Planned (Not Yet Implemented)

### DOC-415: Move Next.js rewrites to Netlify CDN-level redirects
- **Plan:** `.ai/2026-02-20/tasks/doc-415-netlify-redirects.md`
- Addresses nx.dev outage caused by `@netlify/plugin-nextjs` adapter converting `rewrites()` into internal fetches to `*.netliedge.com`. Plan is to move `/docs` proxy rewrites from `next.config.js` to `netlify.toml` `[[redirects]]` with `status = 200` (CDN layer).
- Files to modify: `netlify.toml`, `next.config.js`, `project.json`, `agents.yaml`
