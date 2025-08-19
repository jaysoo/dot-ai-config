# Fix Open Graph Image 404s (DOC-98)

## Problem Statement
The Open Graph image generation is broken on nx.dev. Pages are referencing og:image URLs that return 404 errors.

Example:
- Page: https://nx.dev/getting-started/tutorials/typescript-packages-tutorial#code-sharing-with-local-libraries
- OG Image URL: https://nx.dev/images/open-graph/technologies-angular-recipes-angular-nx-version-matrix#nx-and-angular-version-compatibility-matrix.jpg
- Status: 404

## Implementation Plan

### Phase 1: Analysis & Discovery
**Goal**: Identify scope of the issue and affected pages

#### Step 1.1: Analyze Sitemap for 404s
- [ ] Fetch sitemap from https://nx.dev/sitemap-0.xml
- [ ] Extract all page URLs
- [ ] Check each page's og:image tag
- [ ] Test if og:image URLs return 404
- [ ] Document all broken URLs

#### Step 1.2: Create Analysis Script
- [ ] Write Node.js script to automate checking
- [ ] Store results in structured format
- [ ] Generate report of affected pages

### Phase 2: Root Cause Investigation
**Goal**: Understand why images are not being generated

#### Step 2.1: Analyze Image Generation Script
- [ ] Review scripts/documentation/open-graph/generate-images.ts
- [ ] Understand current generation logic
- [ ] Identify why certain images are missing

#### Step 2.2: Investigate nx-dev App
- [ ] Review nx-dev/nx-dev app structure
- [ ] Check how og:image URLs are constructed
- [ ] Examine routing and page metadata
- [ ] Review libs under @nx-dev for OG image handling

#### Step 2.3: Check Fallback Logic
- [ ] Verify scripts/documentation/open-graph/media.jpg exists
- [ ] Review fallback implementation
- [ ] Test if fallback is working correctly

### Phase 3: Implementation
**Goal**: Fix the broken og:image generation

#### Step 3.1: Fix Generation Script
- [ ] Update generate-images.ts to handle missing cases
- [ ] Ensure all pages have corresponding images
- [ ] Fix URL construction logic if needed

#### Step 3.2: Fix Fallback Logic
- [ ] Implement proper fallback when specific image doesn't exist
- [ ] Ensure fallback image is served correctly
- [ ] Update nx-dev app to handle fallback properly

#### Step 3.3: Verification
- [ ] Run updated generation script
- [ ] Verify all og:images are generated
- [ ] Test previously broken URLs
- [ ] Ensure no 404s remain

## Expected Outcome
- All pages on nx.dev have working og:image URLs
- Proper fallback mechanism when specific images don't exist
- Generation script correctly creates images for all pages
- No 404 errors for Open Graph images

## Notes
- Keep track of progress in each step
- Update this document as implementation progresses
- Document any blockers or issues encountered

## CRITICAL: Implementation Tracking
As we execute this task, keep updating the checkboxes above to track progress.