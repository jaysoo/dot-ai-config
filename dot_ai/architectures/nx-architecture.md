# Nx Repository Architecture

Last Updated: 2025-09-19

## Directory Overview

### nx-dev/
The Nx documentation site (docs.nrwl.io) - Next.js application with multiple sub-packages

- `nx-dev/feature-search/` - Algolia search integration
- `nx-dev/ui-blog/` - Blog listing and display components
- `nx-dev/ui-common/` - Shared UI components
- `nx-dev/data-access-documents/` - Document fetching and processing

## Features & Critical Paths

### Blog Search Integration (2025-09-19)
**Branch**: DOC-221
**Status**: Implemented, not yet merged

Adds dedicated blog search functionality when Astro docs migration is enabled.

**Files Involved**:
- `nx-dev/feature-search/src/lib/algolia-search.tsx` - Core Algolia search component with blog filtering
- `nx-dev/ui-blog/src/lib/blog-container.tsx` - Blog index page with integrated search
- `nx-dev/ui-blog/src/lib/filters.tsx` - Blog category filters
- `nx-dev/ui-blog/package.json` - Package dependencies

**Key Implementation Details**:
- Uses Algolia facet filter `hierarchy.lvl0:Nx | Blog` to restrict results
- Conditionally renders based on `NEXT_PUBLIC_ASTRO_URL` environment variable
- Search box positioned right of filters for better UX
- Custom placeholder text "Search blog posts" for clarity

**Dependencies**:
- `@nx/nx-dev-feature-search` package
- Algolia DocSearch Modal component
- Environment variable `NEXT_PUBLIC_ASTRO_URL` for feature flag

## Personal Work History

### 2025-09-19 - Blog Search During Astro Migration
- **Task**: DOC-221 - Add blog search when Astro docs are enabled
- **Commit**: 901e3a8b5e (amended with nx sync)
- **Purpose**: Preserve blog search functionality during docs migration to Astro

## Design Decisions & Gotchas

### Nx Sync Requirement
- **Issue**: When adding dependencies to package.json in Nx monorepo
- **Solution**: Must run `nx sync` before committing to update inferred targets
- **Impact**: Ensures workspace configuration stays consistent

### Astro Migration Pattern
- Using `NEXT_PUBLIC_ASTRO_URL` as feature flag for progressive migration
- Blog remains in Next.js while docs move to Astro
- Search needs special handling to work across both platforms

## Technology Stack

### Documentation Site (nx-dev)
- **Framework**: Next.js
- **Search**: Algolia DocSearch
- **Styling**: Tailwind CSS
- **Migration Target**: Astro/Starlight (in progress)
