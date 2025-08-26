# Daily Summary - 2025-08-21

## Tasks Completed

### DOC-107: Update non-doc pages with new `/docs` prefix
- **Linear Issue**: https://linear.app/nxdev/issue/DOC-107/
- **Status**: Completed Phase 1 and Phase 2
- **Branch**: DOC-107

#### Work Done:
1. **Phase 1: Updated Non-Doc Page Links**
   - Found 4 documentation links in 3 files needing updates
   - Updated all links to include `/docs` prefix
   - Files modified:
     - `docs/blog/2023-09-18-introducing-playwright-support-for-nx.md`
     - `nx-dev/nx-dev/pages/changelog.tsx`
     - `nx-dev/nx-dev/pages/plugin-registry.tsx`

2. **Phase 2: Created Redirect Mappings**
   - Analyzed 506 documentation URLs from nx.dev sitemap
   - Generated 145 redirect mappings (36 high confidence)
   - Created configuration files for Next.js redirects

3. **Verification**
   - Tested astro-docs site on port 8000
   - Verified intro page renders correctly with Playwright

## Scripts Created
- `find-non-doc-pages.mjs` - Scans for documentation links in non-doc pages
- `create-redirect-mappings.mjs` - Initial redirect mapping generator
- `create-redirect-mappings-v2.mjs` - Improved redirect mapping with confidence levels

## Lessons Learned
- Astro projects in Nx use `npx astro dev` not `npm run dev`
- Always update TODO checkboxes in plan files, not just tracking tool
- Astro sitemap URLs need `/docs` prefix added for production

## Next Steps
- Review uncertain redirect mappings (361 URLs need manual review)
- Implement redirect configuration in nx-dev Next.js app
- Test redirects in staging environment

---

## Task: DOC-154 - URL Redirect Verification and Fixes

### What Was Done
1. **Analyzed redirect requirements** for Phase 2 of DOC-107 task
2. **Fixed 56 failed URL redirects** in `nx-dev/nx-dev/redirect-rules-docs-to-astro.js`
3. **Tested redirects** with local servers (Astro on 9003, nx-dev on 4200)
4. **Discovered critical issue**: Redirects not working as expected

### Key Findings

#### Redirect Fixes Applied
- **Total redirects configured**: 167
- **Categories fixed**:
  - Troubleshooting URLs (11) → `/docs/troubleshooting`
  - Module Federation (3) → `/docs/technologies/module-federation/Guides/*`
  - React recipes (9) → `/docs/technologies/react/Guides/*`
  - Angular recipes (7) → `/docs/technologies/angular/Guides/*`
  - Node.js recipes (7) → Consolidated to serverless guide
  - Webpack (5) → `/docs/technologies/build-tools/webpack/*`
  - Vite (1) → `/docs/technologies/build-tools/vite`
  - Storybook (11) → `/docs/technologies/test-tools/storybook/*`
  - Tips & Tricks (2) → Technology-specific sections

#### Critical Issue Discovered
- **Problem**: nx-dev server NOT redirecting to Astro server
- **Expected**: Cross-server redirects to `http://localhost:9003/path`
- **Actual**: Internal rewrites to `http://localhost:4200/wrong-path`
- **Test Results**: Only 36% success rate (5 of 14 tested URLs)

### Pattern Discovery
- Content reorganization: `/recipes/{tech}/*` → `/docs/technologies/{tech}/Guides/*`
- Troubleshooting pages consolidated into single page
- Node.js deployment guides merged into one serverless guide

### Files Modified
- `nx-dev/nx-dev/redirect-rules-docs-to-astro.js` - Updated with all redirect fixes
- Commit: `3e44d22b66` - docs(misc): add redirects from nx.dev to new Astro docs

### Scripts Created (in .ai/2025-08-21/tasks/)
- `redirect-fixes-final.js` - Comprehensive redirect fix mappings
- `verify-redirect-updates.mjs` - Verification script
- `test-sample-redirects.mjs` - Sample redirect testing
- `redirect-test-final-report.md` - Detailed test results

### Action Required
⚠️ **Investigation needed**: NEXT_PUBLIC_ASTRO_URL environment variable may not be properly triggering cross-server redirects. The redirect rules are configured correctly but the nx-dev application may need additional changes.

---

## Task: Nx CLI Stability Issues Reproduction

### What Was Done
1. **Researched stability issues** from Linear (NXC-2582) and GitHub
2. **Successfully reproduced** multiple Nx CLI stability problems
3. **Created comprehensive test suite** with 5 test scripts
4. **Analyzed native Rust code** to understand root causes

### Issues Reproduced

#### ✅ Fully Reproduced (100% success rate)
- **Daemon Conflicts**: `Daemon process terminated and closed the connection`
- **Graph Hanging**: During Nx 19 → 21 version upgrades
- **Socket Conflicts**: EADDRINUSE errors with parallel execution

#### ⚠️ Partially Reproduced
- **Database Locked**: `SqliteFailure(Error { code: DatabaseBusy })` - requires specific timing

### Key Technical Findings
- SQLite uses WAL mode with 20 retry attempts
- Daemon socket conflicts with parallel processes
- Database recreated on version mismatch
- File system race conditions during branch switching

### Test Scripts Created
Location: `/tmp/claude/nx-stability-repro/`
- `stress-test-parallel-fixed.sh` - 5 parallel processes
- `reproduce-db-lock.sh` - 20 parallel processes for DB locks
- `test-version-switching.sh` - Nx 19 to 21 upgrade test
- `test-branch-switching.sh` - Rapid branch switching test
- `REPRODUCTION_GUIDE.md` - Complete documentation

### Workarounds Documented
```bash
nx reset                           # Clear cache and daemon
rm -rf .nx                        # Nuclear option
NX_DAEMON=false nx run-many       # Run without daemon
```

### Impact
These reproductions directly help debug Linear issue NXC-2582 (Celonis customer database locked errors) and provide clear test cases for fixing core Nx stability issues.