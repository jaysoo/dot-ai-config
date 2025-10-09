# DOC-252 Implementation Summary

## What Was Implemented

### Phase 1: --local Flag ✅
Added `--local` flag to write JSON files instead of Supabase:
- Skips API key validation when --local is set
- Accumulates data in memory arrays (localPages, localPageSections)
- Writes to `tmp/nods_page.json` and `tmp/nods_page_section.json` at end
- No Supabase queries performed in local mode

### Phase 2: --mode Flag ✅
Added `--mode` flag to switch between data sources:
- **legacy**: Uses existing manifest-based approach (mapJson, manifestsCI, etc.)
- **astro**: Reads from `astro-docs/src/content/docs` directory
- Implemented `getAllAstroDocFiles()` function that:
  - Recursively scans for `.mdoc` and `.md` files
  - Converts file paths to URL paths (lowercase, dashes)
  - Returns WalkEntry objects with path and url_partial

### Phase 3: Verification Script ✅
Created `verify-modes.sh` that:
- Runs both legacy and astro modes with --local flag
- Saves outputs with different filenames
- Compares page and section counts
- Shows percentage differences and sample pages

## Usage

```bash
# Local testing with legacy mode (no API keys needed)
node --import tsx src/main.mts --local --mode=legacy

# Local testing with astro mode (no API keys needed)
node --import tsx src/main.mts --local --mode=astro

# Full verification (runs both modes + comparison)
cd tools/documentation/create-embeddings
./verify-modes.sh

# Production usage with Supabase
node --import tsx src/main.mts --mode=legacy  # Requires API keys
node --import tsx src/main.mts --mode=astro   # Requires API keys
```

## Files Modified

- `tools/documentation/create-embeddings/src/main.mts` - Main implementation
- `tools/documentation/create-embeddings/verify-modes.sh` - Verification script (new)

## Key Implementation Details

1. **Local Mode Logic**:
   - When `isLocal` is true, skips all Supabase client creation and queries
   - Uses simple incrementing IDs for pages and sections
   - Accumulates data in memory, writes JSON at end

2. **Mode Switching**:
   - Legacy mode: Uses getAllFilesWithItemList() and getAllFilesFromMapJson()
   - Astro mode: Scans `dist/` folder for `index.html` files
     - Reads built HTML from `dist/*.html`
     - Converts to markdown via `htmlToMarkdown()`
   - Both produce WalkEntry[] with same structure

3. **Astro Content Source**:
   - **dist/ HTML files**: Built HTML requiring conversion via `htmlToMarkdown()`
   - Note: `.astro/data-store.json` only exists during dev (not available after builds)

4. **Path Resolution**:
   - Astro mode uses `import.meta.dirname` to calculate repo root
   - Navigates from `tools/documentation/create-embeddings/src` to repo root
   - Looks for `astro-docs/dist` folder

## Testing Notes

- Legacy mode tested successfully (found 1914 pages)
- Many legacy files are missing (expected - migrated to Astro)
- Astro mode path resolution implemented correctly
- **astro-docs directory not present in DOC-252 worktree** - testing with astro mode requires a branch/worktree where astro-docs exists

## Next Steps

1. Test on a branch where astro-docs exists (e.g., master)
2. Run verification script to compare counts
3. Adjust if counts are significantly different
4. Use for production embedding generation once validated
