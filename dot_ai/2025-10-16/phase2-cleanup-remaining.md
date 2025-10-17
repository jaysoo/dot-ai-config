# Phase 2 - Remaining Cleanup Tasks

## Current Status
✅ Build works
✅ Docs pages removed from nx-dev
✅ Docs-related API modules removed from nx-dev/nx-dev/lib

## Still To Remove

### 1. Unused Data-Access Packages (entire directories)
These are only used by removed docs pages:

- `nx-dev/data-access-menu/` - Only used by removed docs pages
- `nx-dev/data-access-packages/` - Only used by feature-package-schema-viewer
- `nx-dev/feature-package-schema-viewer/` - Only used by removed docs pages
- `nx-dev/feature-doc-viewer/` - Only used by removed docs pages

**Keep**: `nx-dev/data-access-documents/` - Still used by blog, changelog, podcast, webinar

### 2. Unused Model Packages (entire directories)
- `nx-dev/models-document/` - Only used by removed docs pages
- `nx-dev/models-package/` - Only used by rspack/pkg.ts which is unused
- `nx-dev/models-menu/` - Only used by removed docs pages

### 3. Unused Files in data-access-documents
Within the `nx-dev/data-access-documents/src/lib/` directory:

- `documents.api.ts` - Only exported, never imported
- `tags.api.ts` - Only used by documents.api.ts and packages.api.ts (both unused)

**Keep**: blog.api.ts, changelog.api.ts, podcast.api.ts, webinar.api.ts and their models/utils

### 4. Unused Files in nx-dev/nx-dev/lib
- `nx-dev/nx-dev/lib/rspack/pkg.ts` - Not imported anywhere

### 5. Update Exports
After removing files, update:
- `nx-dev/data-access-documents/src/node.index.ts` - Remove exports for documents.api and tags.api

## Validation Plan
After removal:
1. Run `nx sync`
2. Run `pnpm install`
3. Build nx-dev: `NEXT_PUBLIC_ASTRO_URL=https://nx-docs.netlify.app nx run nx-dev:build`
4. Verify no broken imports

## Notes
- This is safe to do as a follow-up since the build currently works
- All removed items were only used by the docs pages we already removed
- Blog, changelog, podcast, and webinar functionality remains intact
