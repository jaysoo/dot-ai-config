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
**Last Updated**: 2025-08-21
**Description**: Dual documentation system with migration in progress

**Files**:
- `astro-docs/` - New Starlight-based docs (serves at /docs)
- `nx-dev/nx-dev/pages/[...segments].tsx` - Legacy doc viewer
- `nx-dev/nx-dev/redirect-rules.js` - URL redirects configuration
- `nx-dev/nx-dev/next.config.js` - Next.js config with rewrites to Astro

**Key Points**:
- Astro docs use Starlight framework
- Legacy docs being migrated to new `/docs` prefix
- Blog and marketing pages remain in nx-dev Next.js app
- Redirects needed from old URLs to new `/docs` structure

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

## Technology Stack
- **Documentation**: Astro + Starlight
- **Main Site**: Next.js (App Router + Pages Router)
- **Build System**: Nx
- **Languages**: TypeScript, JavaScript
- **Styling**: Tailwind CSS