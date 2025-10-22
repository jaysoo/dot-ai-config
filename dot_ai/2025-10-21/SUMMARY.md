# Daily Summary - October 21, 2025

## Documentation Updates

### DOC-269: Updated GitLab Source Control Integration Guide

**Issue**: https://linear.app/nxdev/issue/DOC-269

Updated the GitLab integration documentation to reflect UI changes in GitLab's interface for locating project IDs.

**Changes Made**:
- Updated text instructions in `astro-docs/src/content/docs/guides/Nx Cloud/source-control-integration.mdoc`
  - Old: "The value can be found underneath the name of your project"
  - New: "Click the three-dot menu button in the upper right corner and select 'Copy project ID'"
- Replaced screenshot with updated UI showing the new location
  - Deleted old WebP format image (`find-gitlab-project-id.webp`)
  - Added new AVIF format image (`find-gitlab-project-id.avif`) for better quality and compression

**Commit**: `71b0d76400` - "docs(misc): update GitLab project ID location in integration guide"

**Files Modified**:
- `astro-docs/src/content/docs/guides/Nx Cloud/source-control-integration.mdoc`
- `astro-docs/src/assets/nx-cloud/set-up/find-gitlab-project-id.avif` (added)
- `astro-docs/src/assets/nx-cloud/set-up/find-gitlab-project-id.webp` (deleted)

**Status**: Ready for push and PR

### DOC-302: PNPM Catalog Support
**Status**: ✅ Complete
**Commit**: 366535f8c2

Added documentation about PNPM catalogs to the dependency management page. Users can now learn how to use PNPM's catalog feature to maintain single version policy in Nx 22+ workspaces.

**Changes**:
- Added concise tip aside in "Single Version Policy" section
- Explained catalog syntax: `"<package>": "catalog:"`
- Linked to PNPM catalog documentation
- File: `astro-docs/src/content/docs/concepts/Decisions/dependency-management.mdoc:48-50`

### DOC-301: Java Introduction Page Update
**Status**: ✅ Complete

Restructured the Java introduction page to improve onboarding and quick start visibility.

**Changes**:
- Moved Requirements section first (right after intro)
- Added Quick Start section with `nx init` and global install
- Marked Maven as experimental (requires Nx 22+)
- Added link to Gradle tutorial
- Streamlined structure by removing redundant sections
- File: `astro-docs/src/content/docs/technologies/java/introduction.mdoc:1-58`

### Framer Migration URL Inventory
**Status**: ✅ Complete

Created comprehensive URL inventory for Framer migration planning.

**Output**:
- Total URLs analyzed: 1,307
- Marketing pages: 73 (categorized into 6 groups)
- Blog posts: 168
- Documentation pages: excluded from migration
- Strategy: Phased approach with separate Linear tasks per category
- File: `.ai/2025-10-21/tasks/framer-migration-urls.md`

## Key Accomplishments

1. **PNPM Catalog Documentation**: Delivered concise, actionable documentation for PNPM catalog feature
2. **Java Docs Improvement**: Enhanced Java onboarding experience with clearer quick start flow
3. **Migration Planning**: Established structured approach for Framer migration with complete URL inventory

## Files Modified

- `astro-docs/src/content/docs/concepts/Decisions/dependency-management.mdoc`
- `astro-docs/src/content/docs/technologies/java/introduction.mdoc`

## Next Steps

- Push DOC-302 branch and create PR
- Continue with other documentation improvements as needed
