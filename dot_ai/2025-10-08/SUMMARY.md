# Summary - October 8, 2025

## Completed Tasks

### DOC-252: AI Embeddings Support for Astro Docs (2025-10-08)

**Linear Issue**: https://linear.app/nxdev/issue/DOC-252/ai-embeddings-should-support-astro-docs

Implemented comprehensive support for generating AI embeddings from Astro documentation, enabling the AI chat feature to work with the new Astro-based docs site.

**Implementation Summary**:

Completed three-phase implementation:

1. **Phase 1: Local Mode (`--local` flag)**
   - Added flag to skip Supabase and write embeddings to local JSON files
   - Skips API key validation (OpenAI, Supabase) when using `--local`
   - Accumulates data in memory and writes to `tmp/nods_page_{mode}.json` and `tmp/nods_page_section_{mode}.json`
   - Enables testing without production credentials

2. **Phase 2: Astro Mode (`--mode=astro`)**
   - Added mode flag with options: `astro` or `legacy`
   - Astro mode scans `astro-docs/dist/` for built `index.html` files
   - Derives URLs from directory structure (e.g., `dist/getting-started/index.html` → `/docs/getting-started`)
   - Converts HTML to markdown using `htmlToMarkdown()` function
   - Legacy mode continues to use manifest-based approach for `.md` files
   - Note: Initially explored `.astro/data-store.json` but discovered it only exists during dev, not after builds

3. **Phase 3: Verification**
   - Created `verify-modes.sh` script to compare outputs between modes
   - Generates comparison reports with page/section counts and statistics
   - User verified embeddings are working correctly

**Key Technical Details**:

- **Section Generation**: Each page is automatically split into sections based on markdown headings, allowing precise search results
- **Database Schema**: Maintains compatibility with existing Supabase tables (`nods_page` and `nods_page_section`)
- **Path Storage**: Full file paths stored for Astro mode (e.g., `/full/path/astro-docs/dist/concepts/index.html`)
- **URL Mapping**: `match_page_sections_2` RPC function performs vector similarity search on embedded sections

**Files Modified**:
- `tools/documentation/create-embeddings/src/main.mts` - Core implementation with mode switching and local storage
- `.github/workflows/generate-embeddings.yml` - Simplified workflow to always use `--mode=astro`
- `tools/documentation/create-embeddings/verify-modes.sh` - New verification script

**Workflow Changes**:
- Removed manual trigger inputs from GitHub workflow
- Hardcoded `--mode=astro` for production runs
- Added build steps: `npx nx documentation && npx nx build astro-docs` before embeddings generation
- Scheduled runs continue on Sunday & Thursday at 5AM

**Benefits**:
- AI chat can now search through Astro documentation
- Same output structure for both legacy and Astro modes
- Local testing capability without production credentials
- Automatic section splitting for granular search results
- Production-ready with simplified deployment workflow

**Documentation Created**:
- `.ai/2025-10-08/tasks/doc-252-astro-embeddings.md` - Implementation plan
- `.ai/2025-10-08/tasks/doc-252-summary.md` - Technical summary
- `.ai/2025-10-08/tasks/doc-252-astro-approach-update.md` - Architecture details

---

### DOC-260: Update TailwindCSS Guides (2025-10-07)

**Linear Issue**: https://linear.app/nxdev/issue/DOC-260/update-tailwindcss-guides

Updated Tailwind CSS documentation to remove deprecated generator references and provide simple manual setup instructions compatible with both Tailwind v3 and v4.

**Files Modified**:
- `astro-docs/src/content/docs/technologies/angular/Guides/using-tailwind-css-with-angular-projects.mdoc`
- `astro-docs/src/content/docs/technologies/react/Guides/using-tailwind-css-in-react.mdoc`

**Key Changes**:
- Removed all references to `setup-tailwind` generators and `--add-tailwind` flags
- Removed dependency on `createGlobPatternsForDependencies` utility
- Added manual 5-step setup instructions
- Provided configurations for both Tailwind v3 and v4
- Used simple glob patterns (e.g., `join(__dirname, '../../libs/**/*.{ts,html}')`)
- Added Tailwind v4 specific configuration using `@tailwindcss/postcss` plugin

**Benefits**:
- Version agnostic - users can adopt Tailwind v4 immediately
- Simpler setup (~2 minutes)
- More flexible and customizable
- Better understanding of how Tailwind integrates with their project

**Verification**: Created test workspace with Tailwind v4 and verified installation, configuration, and build process.

## Notes

- DOC-252 was the primary focus for October 8, involving deep integration work with Astro docs and embeddings infrastructure
- Explored multiple approaches (data-store.json, source files, dist HTML) before settling on the production-ready dist/ HTML approach
- User feedback was incorporated throughout to ensure the implementation met production requirements
