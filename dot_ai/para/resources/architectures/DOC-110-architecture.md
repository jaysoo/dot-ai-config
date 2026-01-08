# DOC-110 Architecture

## Repository Overview
Nx worktree branch for documentation migration work. This branch focuses on converting the Nx documentation from the old site to the new Astro-based documentation system.

## Directory Structure

### Key Directories
- `astro-docs/` - New Astro-based documentation site
  - `src/content/docs/` - Main documentation content in .mdoc format
  - `src/components/markdoc/` - Custom Markdoc components (Callout, Cards, etc.)
  - `markdoc.config.mjs` - Markdoc configuration with custom tags
- `docs/` - Original documentation site (being migrated from)
  - `shared/` - Shared documentation content
  - `nx-cloud/` - Nx Cloud specific docs
  - `blog/` - Blog posts
  - `external-generated/` - Auto-generated package docs
- `nx-dev/` - Original Nx documentation site components

## Features & Critical Paths

### Documentation Migration System
**Last Updated:** 2025-08-12
**Branch:** DOC-110

#### Quick Start
Converting docs from old format to new Astro format, particularly focusing on proper Markdoc component usage.

#### Files Involved
- `astro-docs/markdoc.config.mjs` - Defines custom tags including `callout` with `deepdive` type
- `astro-docs/src/components/markdoc/Callout.astro` - Callout component implementation
- `docs/**/*.md` - Source documentation files
- `astro-docs/src/content/docs/**/*.mdoc` - Migrated documentation files

#### Key Components
- **Callout Types:** announcement, caution, check, note, warning, deepdive
- **Deepdive Callouts:** Collapsible by default to save screen space

## Personal Work History

### 2025-08-12: Deepdive Callout Restoration
**Branch:** DOC-110
**Task:** Revert aside tags back to deepdive callouts

#### Files Modified
- `astro-docs/src/content/docs/getting-started/intro.mdoc` - Reverted "What do you mean by 'running NPM scripts'?"
- `astro-docs/src/content/docs/features/CI Features/dynamic-agents.mdoc` - Reverted "How is the size of the PR determined?"
- `astro-docs/src/content/docs/enterprise/Powerpack Features/licenses-and-trials.mdoc` - Reverted "Looking for self-hosted caching?"
- `astro-docs/src/content/docs/concepts/CI Concepts/reduce-waste.mdoc` - Reverted "The Math Behind the Expected Number of Affected Projects"
- `astro-docs/src/content/docs/enterprise/activate-powerpack.mdoc` - Reverted "Looking for self-hosted caching?" and "Need a trial?"

#### Context
During the migration from the old docs site to Astro, some `{% callout type="deepdive" %}` tags were incorrectly converted to `{% aside type="note" %}` or similar. Deepdive callouts are special as they're collapsible by default to save screen space. Identified and fixed 6 instances across 5 files.

#### Original Deepdive Locations (from /docs folder)
Total: 14 files with 19 deepdive callouts identified, but only some were migrated to astro-docs:
- Cache plugin files (azure, s3, gcs, shared-fs) - not yet migrated
- Various shared and nx-cloud documentation - partially migrated

## Design Decisions & Gotchas

### Markdoc vs Aside
- **Decision:** Use `{% callout %}` for all special content blocks, not `{% aside %}`
- **Reason:** Callout supports the `deepdive` type which provides collapsible functionality
- **Gotcha:** Astro's built-in aside component doesn't support deepdive type

### Documentation Structure
- **Decision:** Keep blog posts separate from main documentation
- **Note:** Blog posts use deepdive callouts extensively but were not part of this migration

## Technology Stack

### Documentation System
- **Astro** - Static site generator
- **Markdoc** - Markdown parser with custom components
- **Custom Components:** Callout, Cards, Graph, Youtube, etc.

### Build Tools
- **Nx** - Monorepo build system
- **TypeScript** - Type checking
- **Git Worktrees** - Branch management (DOC-110 is a worktree)

## Dependencies & Limitations

### Markdoc Configuration
- Must maintain compatibility with existing callout types
- `deepdive` type must remain in the allowed types list
- Closing tags must match opening tags (callout/callout, not aside/callout)

### Migration Status
- Not all documentation has been migrated from /docs to /astro-docs
- Some auto-generated package documentation remains unmigrated
- Blog posts remain in original format (not migrated)