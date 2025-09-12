# Nx Repository Architecture

## Repository Overview
Nx monorepo containing the Nx build system, documentation, and related tooling.

## Directory Structure
- `astro-docs/` - New Astro-based documentation site (Starlight framework)
- `nx-dev/` - Main Nx website and legacy documentation (Next.js)
  - `nx-dev/nx-dev/` - Next.js application
  - `nx-dev/nx-dev/pages/` - Pages router pages
  - `nx-dev/nx-dev/app/` - App router pages
- `docs/` - Documentation content source
  - `docs/blog/` - Blog posts in markdown
- `packages/` - Nx packages and plugins
- `e2e/` - End-to-end tests

## Personal Work History

### 2025-09-12: DOC-184 - Client-Side Routing URL Fixes
- **Branch**: DOC-184 (worktree)
- **Linear Issue**: DOC-184
- **Files Modified**:
  - `nx-dev/ui-home/src/lib/features/features-while-coding.tsx` - 6 link updates with conditional logic
  - `nx-dev/ui-home/src/lib/features/features-while-running-ci.tsx` - 3 link updates with conditional logic
  - `nx-dev/ui-enterprise/src/lib/scale-your-organization.tsx` - 2 conformance link updates
  - `nx-dev/ui-home/src/lib/features/features.tsx` - 1 monorepos link update
  - `nx-dev/ui-ai-landing-page/src/lib/call-to-action.tsx` - 1 enhance-AI link update
  - `nx-dev/ui-ai-landing-page/src/lib/hero.tsx` - 1 enhance-AI link update
- **Purpose**: Fix remaining old documentation URLs on non-doc pages to use `/docs/` prefix when ASTRO_URL is set
- **Key Implementation Details**:
  - Pattern: `href={process.env.NEXT_PUBLIC_ASTRO_URL ? "/docs/..." : "/old/path"}`
  - Created verification script to systematically check all non-doc pages
  - Ensures client-side routing avoids 308 redirects
  - Maintains backward compatibility when ASTRO_URL not set

### 2025-09-12: DOC-169 - Mobile Menu Icon Theme Fix
- **Branch**: DOC-169 (worktree)
- **Linear Issue**: DOC-169
- **Commit**: `06d0ce43d1 docs(misc): mobile menu icon respects theme color`
- **Files Modified**:
  - `astro-docs/src/styles/global.css` - Added CSS styles for mobile menu button theme handling
- **Purpose**: Fix mobile menu icon visibility in dark mode
- **Key Implementation Details**:
  - CSS-only approach (avoided component override which was overkill)
  - Icon colors: slate-600 (light), slate-200 (dark)
  - Background: transparent normally, white/slate-900 when expanded
  - Removed box shadow for all states
  - Used Tailwind theme colors for consistency

### 2025-09-10: DOC-142 - Add CTA Buttons to Astro Docs Header
- **Branch**: DOC-142 (worktree)
- **Linear Issue**: DOC-142
- **Commit**: `ec573bf497 docs(misc): add CTA buttons to header matching Next.js implementation`
- **Files Modified**:
  - `astro-docs/src/components/layout/Header.astro` - Added Contact and Login CTA buttons with responsive breakpoints
  - `astro-docs/src/components/layout/PageFrame.astro` - Added CTA buttons to mobile menu sidebar at bottom
- **Purpose**: Match Next.js site functionality by adding CTA buttons (Contact, Login) to documentation header
- **Key Implementation Details**:
  - Responsive breakpoints: CTAs visible at xl (1280px)+, social at 2xl (1536px)+
  - Visual order: CTA buttons → Social icons → Divider → Theme switcher
  - Mobile menu shows CTAs at bottom when screen < 1280px
  - Theme switcher always visible (highest priority element)

### 2025-09-09: DOC-184 - Client-Side Routing for Old Documentation URLs
- **Branch**: DOC-184
- **Linear Issue**: DOC-184
- **Commit**: `51c0936abd feat(nx-dev): add client-side routing for old documentation URLs`
- **Files Created**:
  - `nx-dev/ui-common/src/lib/link/` - Link wrapper component directory
  - `nx-dev/ui-common/src/lib/link/link.tsx` - Link component that transforms URLs
  - `nx-dev/ui-common/src/lib/link/redirect-utils.ts` - URL transformation logic
  - `nx-dev/ui-common/src/lib/link/index.ts` - Module exports
- **Files Modified**:
  - 23 component files updated to use new Link wrapper
  - All ui-markdoc components (link.component.tsx, heading.component.tsx, cards.component.tsx, etc.)
  - All ui-common header and navigation components
- **Purpose**: Prevent 404s by transforming old documentation URLs to new ones before navigation

### 2025-09-04: DOC-185 - Add Missing API Reference Pages
- **Branch**: DOC-185
- **Linear Issue**: DOC-185
- **Commit**: `57222d29ea docs(misc): add missing API reference pages for core packages`
- **Files Created**:
  - `astro-docs/src/pages/reference/nx/` - nx package reference pages (index, generators, executors)
  - `astro-docs/src/pages/reference/workspace/` - workspace package reference pages
  - `astro-docs/src/pages/reference/plugin/` - plugin package reference pages
  - `astro-docs/src/pages/reference/web/` - web package reference pages
- **Files Modified**:
  - `nx-dev/nx-dev/redirect-rules-docs-to-astro.js` - Updated redirects for core packages
- **Purpose**: Fix 98.7% of failing redirect rules by creating missing API documentation pages

### 2025-08-21: DOC-107 - Documentation Migration to Astro
- **Branch**: DOC-107
- **Linear Issue**: DOC-107
- **Files Modified**:
  - `docs/blog/2023-09-18-introducing-playwright-support-for-nx.md` - Updated doc link
  - `nx-dev/nx-dev/pages/changelog.tsx` - Updated reference link
  - `nx-dev/nx-dev/pages/plugin-registry.tsx` - Updated extending-nx link
- **Scripts Created**:
  - `.ai/2025-08-21/tasks/find-non-doc-pages.mjs` - Scan for doc links
  - `.ai/2025-08-21/tasks/create-redirect-mappings.mjs` - Generate redirects
  - `.ai/2025-08-21/tasks/create-redirect-mappings-v2.mjs` - Improved redirect logic
- **Purpose**: Update non-doc pages to link to new Astro docs with `/docs` prefix

## Features & Critical Paths

### Documentation System
**Last Updated**: 2025-09-12
**Description**: Dual documentation system with migration in progress

**Files**:
- `astro-docs/` - New Starlight-based docs (serves at /docs)
- `astro-docs/src/pages/reference/` - API reference pages for core packages
- `astro-docs/src/plugins/nx-reference-packages.loader.ts` - Loads API docs for nx, workspace, plugin, web packages
- `nx-dev/nx-dev/pages/[...segments].tsx` - Legacy doc viewer
- `nx-dev/nx-dev/redirect-rules.js` - URL redirects configuration (server-side)
- `nx-dev/nx-dev/redirect-rules-docs-to-astro.js` - Redirects from old docs to Astro

**Client-Side Routing Pattern** (NEW: 2025-09-12):
- All Link/TextLink components now use conditional logic: `href={process.env.NEXT_PUBLIC_ASTRO_URL ? "/docs/..." : "/old/path"}`
- Prevents 308 redirects by transforming URLs before navigation
- Affects homepage sections, AI page, enterprise page
- Maintains backward compatibility when environment variable not set
- `nx-dev/nx-dev/next.config.js` - Next.js config with rewrites to Astro
- `nx-dev/ui-common/src/lib/link/` - Client-side URL transformation (NEW: 2025-09-09)

**Key Points**:
- Astro docs use Starlight framework
- Legacy docs being migrated to new `/docs` prefix
- Blog and marketing pages remain in nx-dev Next.js app
- Redirects handled both server-side (Next.js redirects) and client-side (Link wrapper)
- Client-side Link wrapper transforms URLs before navigation to prevent 404s
- API reference pages dynamically loaded from nx-reference-packages collection
- Core packages (nx, workspace, plugin, web) now have flattened URLs without `/core-api`

## Design Decisions & Gotchas

### Astro Documentation Site
- Uses `npx astro dev` not `npm run dev` (no package.json scripts)
- Starlight renders title from frontmatter, not h1 in content
- Dev server doesn't have `/docs` prefix but production does
- Sitemap URLs need `/docs` prefix added for production mapping

### Documentation URL Structure
- Old: `/getting-started/intro`
- New: `/docs/getting-started/intro`
- All doc links in non-doc pages need `/docs` prefix
- Redirects use 301 permanent status

### Client-Side URL Transformation (2025-09-09)
- Link wrapper component in ui-common to avoid circular dependencies
- Dynamic import of redirect rules to prevent compile-time circular deps
- Transforms URLs BEFORE navigation (not after) to prevent 404 flashes
- Handles exact matches, wildcard patterns (:path*, :slug*), and regex patterns
- Preserves query parameters and hash fragments

## Technology Stack
- **Documentation**: Astro + Starlight
- **Main Site**: Next.js (App Router + Pages Router)
- **Build System**: Nx
- **Languages**: TypeScript, JavaScript
- **Styling**: Tailwind CSS