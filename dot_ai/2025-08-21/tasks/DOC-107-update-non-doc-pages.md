# DOC-107: Update non-doc pages with new `/docs` or `docs.nx.dev`

**Linear Issue**: https://linear.app/nxdev/issue/DOC-107/update-non-doc-pages-with-new-docs-or-docsnxdev
**Date**: 2025-08-21
**Assignee**: Jack Hsu

## Overview

This task involves updating non-documentation pages (blog and marketing/landing pages) in the nx-dev Next.js app to properly link to documentation pages that have moved to the new Astro documentation site. Additionally, we need to create redirects for the old URLs to the new structure.

## Definitions

- **Blog pages**: Located in `docs/blog` in the Nx repo
- **Marketing/Landing pages**: Located in `nx-dev/nx-dev/app` or `nx-dev/nx-dev/pages` folder (excluding `[…segments].tsx` dynamic route files)
- **Doc pages**: Content in the `docs/` folder that is now served by the Astro site (`astro-docs`)

## Phase 1: Update Links in Non-Doc Pages

### Step 1: Compile List of Non-Docs Pages
**TODO**:
- [x] List all blog pages in `docs/blog`
- [x] List all marketing/landing pages in `nx-dev/nx-dev/app` and `nx-dev/nx-dev/pages`
- [x] Exclude dynamic route files like `[...segments].tsx`
- [x] Create a script to scan and list these files

**Reasoning**: We need to identify all pages that might contain links to documentation pages.

### Step 2: Check for Doc Links
**TODO**:
- [x] Create a script to scan all non-doc pages for links to `/` paths that point to docs
- [x] Identify patterns like `/getting-started`, `/features`, `/reference`, etc.
- [x] Generate a report of all found doc links

**Reasoning**: We need to find all instances where non-doc pages link to documentation content.

### Step 3: Update Links to Prefix with `/docs`
**TODO**:
- [x] Create a script to update all identified doc links to prefix with `/docs`
- [x] Ensure relative links are properly handled
- [x] Verify that external links are not affected
- [x] Run tests to ensure no broken links

**Reasoning**: All documentation links need to route to the new Astro site at `/docs` path.

## Phase 2: Create Redirects

### Step 1: List All URLs from nx.dev Sitemap
**TODO**:
- [x] Fetch and parse `https://nx.dev/sitemap-0.xml`
- [x] Categorize URLs into docs, blog, and marketing pages
- [x] Create a list of all documentation URLs

**Reasoning**: We need a complete inventory of existing documentation URLs.

### Step 2: Match Old URLs to New Astro-Docs URLs
**TODO**:
- [x] Fetch and parse the Astro site sitemap (https://nx-docs.netlify.app/sitemap-0.xml or local)
- [x] Create mapping logic to match old paths to new paths
- [x] Handle edge cases where paths have changed structure
- [x] List uncertain mappings for manual review

**Reasoning**: We need to create accurate mappings between old and new URL structures.

### Step 3: Create Redirect Mapping File
**TODO**:
- [x] Generate a markdown file with old -> new URL mappings
- [x] Format: `/getting-started/intro` -> `/docs/getting-started/intro`
- [x] Include a section for uncertain/manual review items
- [x] Validate mappings by checking content similarity

**Reasoning**: Documentation of all redirects needed for smooth migration.

### Step 4: Create Redirect Entries
**TODO**:
- [x] Implement redirect configuration in nx-dev Next.js app
- [x] Test redirects locally
- [x] Ensure proper HTTP status codes (301 permanent redirects)
- [x] Verify no redirect loops

**Reasoning**: Actual implementation of redirects to prevent broken links.

## Implementation Tracking

**CRITICAL**: Keep track of progress in this section as we implement each step.

### Current Progress:
- Plan created: 2025-08-21
- Task completed: 2025-08-21
- All phases successfully implemented

### Scripts Created:
- `.ai/2025-08-21/tasks/find-non-doc-pages.mjs` - Scans for documentation links in non-doc pages
- `.ai/2025-08-21/tasks/create-redirect-mappings-v2.mjs` - Generates redirect configurations
- `.ai/2025-08-21/tasks/check-blog-doc-links.mjs` - Checks blog posts for documentation links
- `.ai/2025-08-21/tasks/update-blog-doc-links.mjs` - Updates blog documentation links

### Files Modified:
- `docs/blog/2023-09-18-introducing-playwright-support-for-nx.md` - Updated documentation link
- `nx-dev/nx-dev/pages/changelog.tsx` - Updated reference link
- `nx-dev/nx-dev/pages/plugin-registry.tsx` - Updated extending-nx link  
- `nx-dev/nx-dev/redirect-rules.js` - Added import for new redirects
- `nx-dev/nx-dev/redirect-rules-docs-to-astro.js` - Created with 145 redirect mappings
- `nx-dev/nx-dev/next.config.js` - Updated to include redirects
- 125 blog posts in `docs/blog/` - Updated 600+ documentation links with `/docs` prefix

## Expected Outcome

When this task is complete:
1. All non-documentation pages (blog, marketing) will have updated links that properly route to the new Astro documentation site at `/docs` paths
2. A comprehensive redirect mapping will be created and implemented
3. No broken links will exist when navigating from non-doc pages to documentation
4. Users visiting old documentation URLs will be automatically redirected to the new structure
5. The migration will be seamless for end users

## Notes

- The Astro documentation site is at `astro-docs/` in the repository
- The nx-dev Next.js app handles blog and marketing pages
- Care must be taken to not affect external links or non-documentation internal links
- Manual review will be needed for ambiguous URL mappings