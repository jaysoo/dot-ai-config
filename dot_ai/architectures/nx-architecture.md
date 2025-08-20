# Nx Repository Architecture

## Directory Overview

### astro-docs/
- New Astro-based documentation site using Starlight theme
- Contains all documentation content in `.mdoc` format
- Structure: `src/content/docs/` contains all documentation pages

### Documentation Content Structure (astro-docs/src/content/docs/)
- `concepts/` - Core Nx concepts and mental models
- `features/` - Feature documentation
- `guides/` - How-to guides and tutorials
- `references/` - API and configuration references
- `technologies/` - Framework-specific documentation (Angular, React, etc.)
- `troubleshooting/` - Common issues and solutions
- `enterprise/` - Enterprise features and setup
- `getting-started/` - Onboarding documentation

## Features & Critical Paths

### Astro Documentation Site
*Last updated: 2025-08-20*

**Related Linear Tasks**: DOC-125

**Quick Start**: Documentation content is in `.mdoc` files under `astro-docs/src/content/docs/`

**Files Involved**:
- `astro-docs/src/content/docs/**/*.mdoc` - All documentation content files
- Uses frontmatter for metadata (title, description, sidebar configuration)

**Key Implementation Details**:
- Starlight renders titles from frontmatter, not from h1 in content
- Sidebar labels can be customized using `sidebar.label` in frontmatter
- Content uses MDX-like syntax with custom components

## Personal Work History

### 2025-08-20: Remove Duplicate Titles from Documentation
- **Branch**: DOC-125
- **Commit**: 6b084188c5
- **Linear Issue**: [DOC-125](https://linear.app/nxdev/issue/DOC-125/remove-duplicate-titles)
- **What Was Done**:
  - Fixed duplicate title rendering in Astro/Starlight documentation
  - Removed h1 headings from 10 .mdoc files where they duplicated frontmatter titles
  - Updated `features/run-tasks.mdoc` to use "Tasks" as title with "Run Tasks" as sidebar label
  - Created verification scripts to ensure all 349 .mdoc files have proper structure
  - Squashed commits with proper PR template format for auto-population
- **Files Modified**:
  - `astro-docs/src/content/docs/features/maintain-typescript-monorepos.mdoc`
  - `astro-docs/src/content/docs/features/run-tasks.mdoc`
  - `astro-docs/src/content/docs/guides/Enforce Module Boundaries/tag-multiple-dimensions.mdoc`
  - `astro-docs/src/content/docs/guides/Nx Release/configure-custom-registries.mdoc`
  - `astro-docs/src/content/docs/guides/Nx Release/customize-conventional-commit-types.mdoc`
  - `astro-docs/src/content/docs/references/Remote Cache Plugins/azure-cache/overview.mdoc`
  - `astro-docs/src/content/docs/references/Remote Cache Plugins/gcs-cache/overview.mdoc`
  - `astro-docs/src/content/docs/references/Remote Cache Plugins/s3-cache/overview.mdoc`
  - `astro-docs/src/content/docs/troubleshooting/resolve-circular-dependencies.mdoc`
  - `astro-docs/src/content/docs/troubleshooting/troubleshoot-cache-misses.mdoc`

## Design Decisions & Gotchas

### Documentation Title Handling
- **Decision**: Use only frontmatter titles, remove h1 from content
- **Reason**: Starlight automatically renders frontmatter title as h1, having h1 in content causes duplication
- **Implementation**: 
  - All .mdoc files must have `title` in frontmatter
  - No h1 (`# Title`) should exist in content body
  - Use `sidebar.label` to customize sidebar text if different from title

### MDX Content Parsing
- **Gotcha**: When parsing .mdoc files, code blocks can contain `#` that look like h1 headings
- **Solution**: Must exclude code blocks (between ```) when searching for markdown headings
- **Example**: Comments in shell scripts (`# comment`) should not be treated as h1 headings

## Technology Stack

### Documentation Site
- **Astro** - Static site generator
- **Starlight** - Documentation theme for Astro
- **MDX/MDOC** - Content format supporting components and markdown

## Repository Structure Notes

- This is a worktree checkout at `/Users/jack/projects/nx-worktrees/DOC-125`
- Main repository is the Nx monorepo
- Documentation is being migrated to new Astro-based system