# Embeddings Script Refactoring Summary

## What Changed

### 1. Environment Variables Made Optional
- Added `--debug` flag for local testing without Supabase/OpenAI credentials
- Script now only requires env vars in production mode
- Debug mode writes output to `tmp/embeddings-output.json` (gitignored)

### 2. Astro Docs Support
- **Replaced**: Reading from Next.js JSON manifests (`docs/map.json`, `docs/generated/manifests/*.json`)
- **With**: Direct reading from Astro mdoc source files in `astro-docs/src/content/docs/`
- New `getAllAstroDocFiles()` function recursively finds all `.mdoc` and `.md` files

### 3. Dual Mode Support
- `--mode=astro` (default): Read from Astro docs
- `--mode=nextjs`: Read from legacy Next.js JSON manifests (for comparison)
- Both modes can run with `--debug` flag

### 4. Fixed URL Path Generation
- **Old**: Absolute file paths like `/Users/jack/projects/nx/astro-docs/src/content/docs/concepts/CI Concepts/ai-features.mdoc`
- **New**: Proper `url_partial` format like `/docs/concepts/ci-concepts/ai-features`
- Converts to lowercase, replaces spaces/underscores with dashes

## CLI Options

```bash
# Debug mode - no env vars required (default: astro mode)
node --import tsx src/main.mts --debug

# Next.js mode (legacy, for comparison)
node --import tsx src/main.mts --debug --mode=nextjs

# Specify custom Astro dist path
node --import tsx src/main.mts --debug --astro-dist=/path/to/astro-docs/dist

# Production mode (requires env vars)
node --import tsx src/main.mts
node --import tsx src/main.mts --mode=nextjs --refresh
```

## Test Results

### Astro Mode (Current)
- ✅ **504 pages** discovered (all .mdoc/.md files in astro-docs)
- ✅ **3,100 sections** generated
- ✅ **Community plugins included** (106 plugins)
- ✅ **URL format correct**: `/docs/concepts/ci-concepts/ai-features`
- ✅ Output: `tmp/embeddings-astro.json` (895KB)

### Next.js Mode (Legacy - For Reference)
- ⚠️ **106 pages** (only community plugins succeeded)
- ⚠️ Most doc files failed with `ENOENT` (files moved to Astro)
- ❌ Many files no longer exist in `docs/` folder
- 📝 This mode is kept only for historical comparison

### Comparison

```
                Astro    Next.js
Pages:          504      106 (mostly failures)
Sections:       3,100    106
Sample URLs:    
  Astro:        /docs/concepts/ci-concepts/ai-features
  Next.js:      (mostly ENOENT errors for docs)
```

## What's Still Missing

### 1. API Documentation Pages
The dynamically generated API docs are **NOT included** yet:
- `/docs/api/nx-cli/*`
- `/docs/api/nx-cloud-cli/*`  
- `/docs/api/create-nx-workspace/*`
- `/docs/api/plugins/*` (TypeDoc generated)

These are generated during Astro build via loaders in:
- `astro-docs/src/plugins/plugin.loader.ts`
- `astro-docs/src/plugins/nx-reference-packages.loader.ts`

### 2. How AI Chat Uses url_partial

From `nx-dev/util-ai/src/lib/utils.ts`:
```typescript
export interface PageSection {
  id: number;
  page_id: number;
  content: string;
  heading: string;
  longer_heading: string;
  similarity: number;
  slug: string;
  url_partial: string | null;  // e.g., "/docs/concepts/ci-concepts/ai-features"
}
```

From `nx-dev/util-ai/src/lib/chat-utils.ts`:
```typescript
const url = new URL('https://nx.dev');
if (section.url_partial) {
  url.pathname = section.url_partial as string;
  if (section.slug) {
    url.hash = section.slug;  // e.g., "#enable-nx-cloud-ai-features"
  }
}
// Result: https://nx.dev/docs/concepts/ci-concepts/ai-features#enable-nx-cloud-ai-features
```

**url_partial** = the pathname portion of the full URL on nx.dev

### 3. Two Approaches for API Docs

#### Option A: Parse Built HTML (Simpler)
- Build astro-docs first: `nx run astro-docs:build`
- Parse HTML files from `astro-docs/dist/api/**/*.html`
- Extract text content from rendered pages
- **Pros**: Works with current build output
- **Cons**: HTML parsing, may miss some context

#### Option B: Use Astro Loaders Directly (Better)
- Import loader functions from `astro-docs/src/plugins/*.loader.ts`
- Generate markdown content programmatically  
- Use same logic as Astro build
- **Pros**: Clean markdown, consistent with source
- **Cons**: More complex, needs to replicate loader logic

## Recommended Next Steps

1. **Verify current output** - Check if the 504 pages and content look correct ✅
2. **Decide on API docs approach** - Option A (HTML) or Option B (loaders)
3. **Build astro-docs** - Required for either approach: `nx run astro-docs:build`
4. **Implement API docs parsing** - Based on chosen approach
5. **Test with full dataset** - Run debug mode again with API docs included
6. **Production test** - Run with real credentials once verified

## Files Modified

- `tools/documentation/create-embeddings/src/main.mts` - Main script
  - Added dual mode support (astro/nextjs)
  - Fixed URL path generation
  - Added debug mode
- `tools/documentation/create-embeddings/.gitignore` - Added tmp/ folder

## Usage Examples

```bash
cd tools/documentation/create-embeddings

# Test Astro mode (current docs)
node --import tsx src/main.mts --debug --mode=astro
cat tmp/embeddings-astro.json | jq '.[0:3]'

# Test Next.js mode (legacy, for comparison)
node --import tsx src/main.mts --debug --mode=nextjs
cat tmp/embeddings-nextjs.json | jq '.[0:3]'

# Compare modes
cd tmp && bash compare.sh

# Count pages and sections
cat tmp/embeddings-astro.json | jq 'length'
cat tmp/embeddings-astro.json | jq '[.[].sections | length] | add'

# Check URL format
cat tmp/embeddings-astro.json | jq -r '.[0:10] | .[] | .url_partial'
```

## Key Findings

1. **Astro migration is complete** - Most docs have moved from Next.js to Astro
2. **URL format is correct** - Properly generates `/docs/path/to/page` format
3. **Next.js mode mostly fails** - Files no longer exist in `docs/` folder
4. **Path normalization works** - Converts "CI Concepts" → "ci-concepts" correctly
5. **Community plugins work** - Included in both modes
6. **API docs still missing** - Need separate implementation for dynamically generated pages
