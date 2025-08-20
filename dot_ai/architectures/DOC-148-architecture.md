# DOC-148 Repository Architecture

**Last updated:** 2025-08-20  
**Repository:** nx (DOC-148 worktree branch)

## Directory Overview

### Key Directories
- **`astro-docs/`** - Astro-based documentation site using Starlight
  - `src/content/docs/` - Documentation content in .mdoc format
  - `src/components/markdoc/` - Custom Markdoc components for Astro
  - `markdoc.config.mjs` - Markdoc component registrations
- **`nx-dev/ui-markdoc/`** - Shared Markdoc components used across sites
- **`.ai/`** - Task documentation and scripts (symlinked to dot-ai-config)

## Features & Critical Paths

### Markdoc Component System
**Last updated:** 2025-08-20  
**Files:**
- `astro-docs/markdoc.config.mjs:1-50` - Component registrations and configurations
- `astro-docs/src/components/markdoc/*.astro` - Astro wrapper components
- `nx-dev/ui-markdoc/src/lib/tags/*.component.tsx` - React component implementations

**Description:** Custom component system for embedding interactive elements in documentation
**Key Patterns:**
- Component names use underscores (e.g., `side_by_side` not `side-by-side`)
- Astro wrappers import React components from nx-dev workspace
- JSON data can be inlined directly or referenced via attributes

### Graph & Project Details Components
**Last updated:** 2025-08-20  
**Files:**
- `astro-docs/src/content/docs/**/*.mdoc` - Files using `{% graph %}` and `{% project_details %}`
- `nx-dev/ui-markdoc/src/lib/tags/graph.component.tsx` - Graph visualization
- `nx-dev/ui-markdoc/src/lib/tags/project-details.component.tsx` - Project configuration display

**Description:** Interactive components for displaying project graphs and configuration details
**Requirements:**
- Expects raw JSON data, not markdown code blocks
- JSON should be inlined between component tags
- Build process required for TypeScript declaration files

## Personal Work History

### 2025-08-20 - DOC-148: Fix Broken Markdoc Components
**Branch:** DOC-148  
**Commit:** 71533fd571  
**Status:** Completed ✅

**Issues Resolved:**
1. Fixed 108 escaped template blocks (`\{% ... %\}` → `{% ... %}`)
2. Fixed 52 component name mismatches (hyphens → underscores)
3. Created missing SideBySide component and registered in markdoc.config.mjs
4. Fixed 17 graph components with JSON parsing errors
5. Inlined 10 external JSON files directly into components

**Files Modified:** 29 total across documentation content
**Scripts Created:** 6 automation scripts for systematic fixes

**Key Discovery:** Markdoc components must use underscore naming convention to match registration keys

### 2025-08-20 - Follow-up: Fix side_by_side Component Layout
**Branch:** DOC-148  
**Status:** Completed ✅

**Issue Found:** The side_by_side component was not displaying content in proper two-column layout after initial fixes
**Root Cause:** Astro component used single `<slot />` while React component uses `Children.toArray(children)` to split content

**Solution Implemented:**
- Updated `astro-docs/src/components/markdoc/SideBySide.astro` with client-side content splitting
- Added JavaScript to move first child to left column, remaining to right column  
- Applied proper CSS classes: `md:pr-6` (left), `md:pl-6 md:mt-0` (right)
- Added `md:mt-0` to override Starlight's default margins

**Component Usage:** 9 usages across 4 files (sync-generators, maintain-typescript-monorepos, explore-graph, mental-model)
**Verification:** Tested on dev server, screenshot confirmed proper side-by-side layout

## Design Decisions & Gotchas

### Markdoc Component Naming Convention
**Decision:** Use underscores in component names instead of hyphens
**Reasoning:** Markdoc.config.mjs registration keys cannot contain hyphens
**Impact:** All components must be registered as `component_name` not `component-name`

### JSON Data Embedding
**Decision:** Inline JSON directly in component blocks rather than external file references
**Reasoning:** 
- Eliminates file path resolution issues
- Improves component reliability
- Reduces build dependencies
**Trade-off:** Larger file sizes vs. reliability

### Development Server Configuration
**Decision:** Use ports 8000+ for development servers
**Reasoning:** Avoids conflicts with other services running on standard ports
**Implementation:** `npx astro dev --port 8000`

### Astro/Starlight Title Handling
**Decision:** Use frontmatter titles only, remove h1 from content
**Reasoning:** Starlight automatically renders frontmatter title as h1
**Impact:** Prevents duplicate titles in rendered pages

### Side-by-Side Component Implementation  
**Decision:** Use simple Tailwind CSS Grid layout without JavaScript
**Reasoning:**
- User preference: "should just be tailwind only, no JS involved!"
- Simple grid layouts are more maintainable than complex DOM manipulation
- CSS Grid naturally handles two-column layouts with responsive behavior
**Evolution:**
1. ❌ JavaScript DOM manipulation approach (rejected - too complex)
2. ❌ Tailwind arbitrary selectors `[&>*:first-child]:` (unreliable)  
3. ❌ CSS custom properties with `<style>` block (working but complex)
4. ✅ **Final**: Simple grid classes: `grid grid-auto-col md:grid-flow-row md:grid-cols-2 gap-4`
**Key Insight:** Prefer simple Tailwind solutions over complex CSS/JS approaches

## Technology Stack

### Core Technologies
- **Astro** - Static site generator with component islands
- **Starlight** - Documentation theme for Astro
- **Markdoc** - Markdown authoring framework
- **React** - UI components (via nx-dev workspace)
- **TypeScript** - Type safety and intellisense

### Build Requirements
- Node.js with pnpm package manager
- Build step required before dev server (generates .d.ts files)
- Port configuration flexibility for concurrent development

### Development Workflow
1. Run `pnpm build` to generate TypeScript declarations
2. Start dev server: `npx astro dev --port 8000`
3. Test component changes in real-time
4. Use automation scripts for bulk content fixes

## Dependencies & Limitations

### Shared Component Dependencies
- Components imported from `@nx/nx-dev-ui-markdoc` workspace package
- Changes to base components affect multiple documentation sites
- Version synchronization required across nx-dev and astro-docs

### Build Process Dependencies  
- TypeScript compilation required before development
- API documentation generation depends on successful build
- Component registration must match between config and implementation

### Content Format Constraints
- JSON data must be valid and properly formatted
- Component attribute names must match exact registration
- Template block syntax strictly enforced (no escaping allowed)