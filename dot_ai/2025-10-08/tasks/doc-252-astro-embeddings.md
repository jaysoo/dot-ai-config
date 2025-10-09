# DOC-252: AI Embeddings Support for Astro Docs

## Goal
Update the embeddings generation script to support both local JSON output and Astro docs as a source.

## Three Phases

### Phase 1: Add --local flag
- Add `--local` flag to skip Supabase and write to JSON files instead
- Skip all validation of API keys (OpenAI, Supabase) when --local is set
- Skip all Supabase queries (checking existing pages)
- Accumulate data in memory arrays
- Write to `tmp/nods_page.json` and `tmp/nods_page_section.json` at the end

### Phase 2: Add --mode flag (astro/legacy)
- Add `--mode` flag with values: `astro` or `legacy`
- Legacy mode: current behavior (use mapJson, manifestCI, etc.)
- Astro mode: read from `astro-docs/dist/` folder
- Borrow from commit 15e3ed53f5 for Astro reading logic

### Phase 3: Verification
- Generate embeddings using both modes (--local --mode=legacy and --local --mode=astro)
- Compare entry counts to ensure they're relatively similar
- Create a simple comparison script

## Implementation Notes
- For --local: no queries, just accumulate and write at end
- Generate unique IDs for pages/sections (simple incrementing numbers)
- Maintain same data structure as Supabase tables

## Implementation Status

### Phase 1: ✅ Complete
- Added `--local` flag to skip Supabase validation and write to JSON
- Modified main loop to accumulate data in memory arrays
- Write to `tmp/nods_page.json` and `tmp/nods_page_section.json` at end

### Phase 2: ✅ Complete (Final Approach)
- Added `--mode` flag with choices: `astro` or `legacy`
- Implemented `getAstroPaths()` function to read from `astro-docs/dist`
- **Astro mode approach**:
  - Scans for `index.html` files in `dist/` folder (generated after `astro build`)
  - Derives URLs from directory structure (e.g., `dist/getting-started/index.html` → `/docs/getting-started`)
  - Converts HTML to markdown using `htmlToMarkdown()` function
  - Stores full file paths in database (e.g., `/full/path/astro-docs/dist/concepts/mental-model/index.html`)
- **Legacy mode**: Uses existing manifest-based logic for `.md` files
- Updated `MarkdownEmbeddingSource` to detect and convert HTML files automatically
- **Note**: `.astro/data-store.json` only exists during dev, not after builds, so we use dist/ HTML files

### Phase 3: ✅ Complete
- Created verification script: `verify-modes.sh`
- Script runs both modes and compares output counts
- Generates comparison report with page/section statistics

## Usage

```bash
# Test locally with legacy mode
node --import tsx src/main.mts --local --mode=legacy

# Test locally with astro mode
node --import tsx src/main.mts --local --mode=astro

# Run verification (both modes + comparison)
./verify-modes.sh

# Production use with Supabase (legacy)
node --import tsx src/main.mts --mode=legacy

# Production use with Supabase (astro)
node --import tsx src/main.mts --mode=astro
```

## GitHub Workflow

The workflow file `.github/workflows/generate-embeddings.yml` has been updated to support manual triggering with mode selection:

1. **Manual Trigger**: Go to Actions → Generate embeddings → Run workflow
2. **Select Mode**: Choose between "legacy" or "astro" from dropdown
3. **Scheduled Runs**: Automatically uses "legacy" mode (can be changed in workflow file)

The workflow passes the mode to the script via: `--args="--mode=${{ inputs.mode || 'legacy' }}"`
