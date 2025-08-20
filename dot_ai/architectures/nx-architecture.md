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

### Nx-Dev Next.js to Astro Docs Rewrite
*Last updated: 2025-08-20*

**Related Linear Tasks**: DOC-134

**Quick Start**: Set `NEXT_PUBLIC_ASTRO_URL` environment variable to enable rewrites

**Files Involved**:
- `nx-dev/nx-dev/next.config.js` - Contains rewrite configuration

**Key Implementation Details**:
- Rewrites `/docs` and `/docs/*` paths to Astro documentation site
- Only active when `NEXT_PUBLIC_ASTRO_URL` environment variable is set
- Maintains backward compatibility - no rewrites when env var not set
- Allows gradual migration from Next.js docs to Astro docs

### Astro Documentation Site
*Last updated: 2025-08-20*

**Related Linear Tasks**: DOC-125, DOC-137

**Quick Start**: Documentation content is in `.mdoc` files under `astro-docs/src/content/docs/`

**Files Involved**:
- `astro-docs/src/content/docs/**/*.mdoc` - All documentation content files
- `astro-docs/src/content/docs/getting-started/Tutorials/*.md` - Tutorial files with code snippets
- Uses frontmatter for metadata (title, description, sidebar configuration)

**Key Implementation Details**:
- Starlight renders titles from frontmatter, not from h1 in content
- Code snippets use Starlight's native format:
  - Filenames shown as comments at top of code blocks (e.g., `// filename.ts`)
  - Line highlighting uses curly brace syntax (e.g., `{1,3-5}`)
- **Critical**: When adding filename comments to code blocks, highlight line numbers must be offset by +1
- Sidebar labels can be customized using `sidebar.label` in frontmatter
- Content uses MDX-like syntax with custom components

## Personal Work History

### 2025-08-20: Configure Next.js to Rewrite to Astro Docs
- **Branch**: DOC-134
- **Commit**: f74f4dcbc4
- **Linear Issue**: [DOC-134](https://linear.app/nxdev/issue/DOC-134/configure-docs-to-rewrite-to-astro-docs)
- **What Was Done**:
  - Added rewrite configuration to nx-dev Next.js app for `/docs` routes
  - Configured rewrites to only activate when `NEXT_PUBLIC_ASTRO_URL` environment variable is set
  - Maintains backward compatibility - no rewrites when env var is not set
  - Initially included console.log for debugging, removed per user feedback
- **Files Modified**:
  - `nx-dev/nx-dev/next.config.js` - Added async rewrites() function with conditional logic
- **Implementation**:
  - Rewrite rules: `/docs` → `${astroDocsUrl}/`, `/docs/:path*` → `${astroDocsUrl}/:path*`
  - Environment variable controlled activation for flexible deployment

### 2025-08-20: Remove Duplicate Titles from Documentation
- **Branch**: DOC-125
- **Commit**: 52e55c4cc6 (amended to include all fixes)
- **Linear Issue**: [DOC-125](https://linear.app/nxdev/issue/DOC-125/remove-duplicate-titles)
- **What Was Done**:
  - Fixed duplicate title rendering in Astro/Starlight documentation
  - Initially fixed 10 .mdoc files, then found 3 additional .md files needing fixes
  - Total of 13 files fixed across all markdown formats (.md, .mdx, .mdoc)
  - Updated tutorial files to use descriptive h1s as titles with original names as sidebar labels
  - Created comprehensive verification scripts ensuring all 353 markdown files are clean
  - Squashed commits with proper PR template format for auto-population
- **Files Modified**:
  - 10 .mdoc files (features, guides, references, troubleshooting)
  - 3 .md tutorial files with h1 headings
- **Key Learning**: Always verify all markdown file types (.md, .mdx, .mdoc) not just one format
- **Scripts Created**: Comprehensive verification and fixing scripts in `.ai/2025-08-20/tasks/`

### 2025-08-20: Convert Code Snippets to Starlight Format
- **Branch**: DOC-137
- **Commit**: 58ff399021
- **Linear Issue**: [DOC-137](https://linear.app/nxdev/issue/DOC-137/visualize-the-filename-in-header-of-code-snippet)
- **What Was Done**:
  - Converted all code snippets in tutorial files from legacy Nx format to Starlight's native format
  - Fixed critical line offset bug where filename comments shifted highlight line numbers
  - Repaired broken code blocks where initial conversion removed closing triple backticks
  - Converted 27 fileName attributes and 9 highlightLines attributes across 4 tutorial files
- **Files Modified**:
  - `astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo.md`
  - `astro-docs/src/content/docs/getting-started/Tutorials/gradle.md`
  - `astro-docs/src/content/docs/getting-started/Tutorials/react-monorepo.md`
  - `astro-docs/src/content/docs/getting-started/Tutorials/typescript-packages.md`
- **Critical Bug Found**: When adding filename comments to code blocks, all highlight line numbers need +1 offset
- **Scripts Created**: Conversion, verification, and fix scripts in `.ai/2025-08-20/tasks/`
- **Impact**: Proper filename display in code snippet headers and accurate line highlighting

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

### Code Snippet Conversion (Starlight)
- **Decision**: Use Starlight's native code block format instead of custom attributes
- **Critical Gotcha**: When adding filename comments to code blocks, highlight line numbers must be offset by +1
- **Format**: 
  ```ts {2,4-6}  // Line numbers account for filename comment
  // filename.ts
  const code = true;
  ```
- **Conversion Process**:
  - `fileName="path/file.ts"` → Comment at top: `// path/file.ts`
  - `highlightLines=["5-18"]` → Curly braces: `{6-19}` (note +1 offset)
- **Common Mistake**: Forgetting to adjust highlight line numbers causes wrong lines to be highlighted

## Technology Stack

### Documentation Site
- **Astro** - Static site generator
- **Starlight** - Documentation theme for Astro
- **MDX/MDOC** - Content format supporting components and markdown

## Repository Structure Notes

- This is a worktree checkout at `/Users/jack/projects/nx-worktrees/DOC-125`
- Main repository is the Nx monorepo
- Documentation is being migrated to new Astro-based system