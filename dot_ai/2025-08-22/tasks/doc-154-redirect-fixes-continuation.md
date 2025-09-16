# Task: DOC-154 - Fix URL Redirects from nx.dev to Astro docs

## Context
This is a continuation of work from 2025-08-21. The redirect rules have been configured in `nx-dev/nx-dev/redirect-rules-docs-to-astro.js` but they are not working as expected.

## Problem Statement
When NEXT_PUBLIC_ASTRO_URL is set to the Astro server URL (e.g., http://localhost:9003), the nx-dev application should redirect documentation URLs to the Astro server. However, it's currently doing internal rewrites instead of actual redirects.

### Current Behavior
- nx-dev serves content locally at incorrect paths
- Pattern: `/recipes/{category}/{item}` → `/technologies/{tech}/recipes/{item}` (internal rewrite)
- Only 36% success rate (5 of 14 tested URLs working)

### Expected Behavior  
- nx-dev should redirect to Astro server
- Pattern: `/recipes/{category}/{item}` → `http://localhost:9003/technologies/{tech}/Guides/{item}`
- 100% of URLs should redirect correctly

## Work Completed (2025-08-21)

### 1. ✅ Analyzed 506 URLs from nx.dev sitemap
- Identified 167 URLs needing redirects
- Categorized into high-confidence and low-confidence mappings

### 2. ✅ Fixed redirect mappings in redirect-rules-docs-to-astro.js
Fixed 56 failed redirects across categories:
- Troubleshooting (11 URLs) → `/docs/troubleshooting`
- Module Federation (3 URLs) → `/docs/technologies/module-federation/Guides/*`
- React (9 URLs) → `/docs/technologies/react/Guides/*`
- Angular (7 URLs) → `/docs/technologies/angular/Guides/*`
- Node.js (7 URLs) → Consolidated to serverless guide
- Webpack (5 URLs) → `/docs/technologies/build-tools/webpack/*`
- Vite (1 URL) → `/docs/technologies/build-tools/vite`
- Storybook (11 URLs) → `/docs/technologies/test-tools/storybook/*`
- Tips & Tricks (2 URLs) → Technology-specific sections

### 3. ✅ Created test infrastructure
Scripts created in `.ai/2025-08-21/tasks/`:
- `test-redirects.mjs` - Initial redirect test
- `test-redirects-simple.mjs` - Simplified version without dependencies
- `test-sample-redirects.mjs` - Sample redirect verification
- `verify-redirect-updates.mjs` - Verification script
- `redirect-fixes-final.js` - Comprehensive redirect fixes
- `redirect-test-final-report.md` - Detailed test results

### 4. ❌ Discovered critical issue
The redirects are not working as expected - nx-dev is doing internal rewrites instead of cross-server redirects.

## Current Status
- **Commit**: `3e44d22b66` - docs(misc): add redirects from nx.dev to new Astro docs
- **File Modified**: `nx-dev/nx-dev/redirect-rules-docs-to-astro.js`
- **Issue**: NEXT_PUBLIC_ASTRO_URL not triggering proper cross-server redirects

## Investigation Needed

### Phase 1: Understand Current Redirect Mechanism
- [x] Check how redirect-rules.js imports and uses redirect-rules-docs-to-astro.js
- [x] Verify NEXT_PUBLIC_ASTRO_URL is being read correctly in the application
- [x] Check if Next.js rewrites are being used instead of redirects
- [x] Look for any middleware that might be intercepting redirects

### Phase 2: Fix Redirect Implementation
- [x] Determine if we need to use Next.js redirects instead of rewrites
- [ ] Check if redirects need absolute URLs when going to different servers
- [ ] Test with production build instead of development server
- [ ] Verify no conflicting redirect rules exist

### Phase 3: Re-test All Redirects
- [ ] Test with corrected implementation
- [ ] Verify all 167 redirects work correctly
- [ ] Test content parity between old and new URLs
- [ ] Document the working solution

## Test Commands

Start servers:
```bash
# Terminal 1 - Astro server
cd astro-docs
npx astro dev --port 9003

# Terminal 2 - nx-dev with redirect env var
NEXT_PUBLIC_ASTRO_URL=http://localhost:9003 nx run nx-dev:serve:development
```

Test redirects:
```bash
# Test sample redirects
node .ai/2025-08-21/tasks/test-sample-redirects.mjs

# Verify specific redirect
curl -I http://localhost:4200/getting-started
```

## Success Criteria
1. All 167 redirects should work correctly
2. Redirects should go to Astro server (port 9003), not internal rewrites
3. Content should be equivalent between old and new URLs
4. No 404 errors for configured redirects

## Notes
- The redirect rules file is correctly configured
- The issue appears to be in how nx-dev handles the NEXT_PUBLIC_ASTRO_URL environment variable
- May need to modify the nx-dev application code, not just configuration