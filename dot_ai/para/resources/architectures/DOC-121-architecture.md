# DOC-121 Branch Architecture

**Branch**: DOC-121  
**Repository**: nx (worktree)  
**Last Updated**: 2025-08-20  

## Branch Context

This branch represents a worktree checkout for Linear issue DOC-121, focused on documentation improvements and search quality fixes for the Nx docs site.

## Work Completed

### 1. Search Quality Improvements for CLI Commands
**Date**: 2025-08-20  
**Linear Issue**: [DOC-121](https://linear.app/nxdev/issue/DOC-121)  
**Commit**: Search weight improvements

#### Problem
- 7 priority CLI commands (init, import, build, serve, lint, affected, release) were scoring 0/3 in search results
- Commands appeared in 5th group or lower in search results instead of prominently

#### Solution
- Identified root cause: Astro Starlight's `renderMarkdown()` strips HTML attributes for security
- Implemented post-processing solution to add search weights AFTER HTML rendering
- Added `addCliSearchWeights()` function with regex patterns matching actual rendered HTML

#### Files Modified
- `astro-docs/src/plugins/nx-reference-packages.loader.ts:62-108` - Added post-processing weight logic
- `astro-docs/src/plugins/utils/generate-plugin-markdown.ts:12-109` - Added generator/executor search weights
- `astro-docs/src/content/docs/references/commands.mdoc` - Added static search weights
- `astro-docs/src/content/docs/concepts/common-tasks.mdoc` - Added task weights

#### Results
- `nx init` moved from 5th group to 2nd group in search results
- All 7 priority commands now have proper search weighting
- Verified with Playwright MCP testing

### 2. Remove Deprecated @nx/cli Package Documentation
**Date**: 2025-08-20  
**Linear Issue**: DOC-121 (continuation)  

#### Problem
- `@nx/cli` package documentation was being generated under `/references/nx-cli/`
- Package is deprecated and shouldn't be included like in original next.js nx-dev docs
- Search would return results for "@nx/cli" pointing to deprecated content

#### Solution
- Removed entire generation pipeline for @nx/cli package documentation
- Preserved `/references/commands/` static content (completely separate)
- Updated content schema to remove 'nx-cli' package type

#### Files Modified
- `astro-docs/src/pages/references/nx-cli.astro` - REMOVED (static page)
- `astro-docs/src/plugins/nx-reference-packages.loader.ts` - Removed `loadNxCliPackage()` function (~80 lines)
- `astro-docs/src/content.config.ts` - Removed 'nx-cli' from packageType enum

#### Verification Results
- ✅ `/references/nx-cli/` returns 404
- ✅ Search for "@nx/cli" returns "No results"  
- ✅ `/references/commands/` still works (verified separation)
- ✅ Build completes successfully with other packages intact

#### Technical Details
- Used production build testing: `nx run astro-docs:build` + `npx serve`
- Search functionality only available in production builds
- Pagefind integration confirmed working (552 pages indexed)

## Key Technical Insights

### Astro/Starlight Search Integration
- **Security vs Functionality**: Astro strips HTML for security, requiring post-processing for search weights
- **Production Testing Required**: Dev server shows "Search only available in production builds"
- **Pagefind Integration**: Uses `data-pagefind-weight` attributes for ranking
- **Quadratic Weight Scale**: 10.0 weight = 100x search impact

### Content Generation Pipeline
- **Loader Architecture**: Content loaders in `src/plugins/` generate documentation dynamically
- **Schema Validation**: TypeScript content collections enforce packageType constraints
- **Static vs Generated**: Clear separation between static .mdoc files and generated content
- **Consumer Identification**: Generated content requires consumer pages (like .astro files) to be accessible

### Testing Strategy
- **Playwright MCP**: Essential for real-time search verification
- **Production Builds**: Required for complete search functionality testing
- **Server Logs**: Useful for confirming 404s and request patterns
- **Build Verification**: Ensure changes don't break generation process

## Files Involved

### Content Loaders
- `astro-docs/src/plugins/nx-reference-packages.loader.ts` - Main package documentation loader
- `astro-docs/src/plugins/utils/generate-plugin-markdown.ts` - Plugin-specific markdown generation

### Configuration
- `astro-docs/src/content.config.ts` - TypeScript content collection schemas
- `astro-docs/markdoc.config.mjs` - Markdoc component and tag configuration

### Content
- `astro-docs/src/content/docs/references/commands.mdoc` - Static CLI commands documentation
- `astro-docs/src/content/docs/concepts/common-tasks.mdoc` - Common tasks documentation

### Pages (Removed)
- ~~`astro-docs/src/pages/references/nx-cli.astro`~~ - Removed consumer of generated nx-cli content

## Design Decisions

### Why Post-Processing for Search Weights
- **Security First**: Astro Starlight strips HTML attributes from `renderMarkdown()` for security
- **Workaround Required**: Post-processing adds weights after security stripping
- **Regex Precision**: Patterns must match actual rendered HTML structure including attributes like `<code dir="auto">`

### Why Complete @nx/cli Removal
- **Deprecation**: Package is deprecated and shouldn't appear in new docs
- **Consistency**: Original next.js nx-dev docs don't include @nx/cli
- **Search Quality**: Prevents deprecated content from appearing in search results
- **Clean Architecture**: Removing unused generation code reduces complexity

### Why Separate Static Commands Page
- **Different Purpose**: `/references/commands/` provides manual CLI reference
- **Editorial Control**: Static content allows for curated command selection and descriptions
- **Maintenance**: Easier to maintain focused command reference vs auto-generated comprehensive docs

## Branch Status

**Current Status**: Active development branch  
**Next Steps**: Ready for PR creation with search improvements and @nx/cli removal  
**Testing**: All functionality verified in production build  
**Dependencies**: No external dependencies or breaking changes  