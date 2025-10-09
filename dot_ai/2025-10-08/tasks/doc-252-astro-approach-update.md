# DOC-252: Updated Astro Approach

## Changes Made

Switched from reading source `.mdoc`/`.md` files to reading built HTML from `dist/` folder.

### Old Approach (Discarded)
- ❌ Read `.mdoc`/`.md` from `astro-docs/src/content/docs`
- ❌ Parse markdown directly
- ❌ Generate URLs from file names

### New Approach (Implemented)
- ✅ Read `index.html` files from `astro-docs/dist`
- ✅ Convert HTML to markdown using `htmlToMarkdown()` function
- ✅ Derive URLs from directory structure

## Implementation Details

### 1. getAstroPaths()
```typescript
// Scans astro-docs/dist for index.html files
// dist/getting-started/index.html → {
//   path: '/full/path/to/astro-docs/dist/getting-started/index.html',
//   url_partial: '/docs/getting-started'
// }
```

**URL Derivation:**
- Root: `dist/index.html` → `/docs`
- Nested: `dist/concepts/mental-model/index.html` → `/docs/concepts/mental-model`

### 2. MarkdownEmbeddingSource Constructor
```typescript
// Detects Astro HTML files by checking:
// - filePath contains 'astro-docs/dist'
// - filePath ends with '.html'

// Stores path relative to astro-docs root:
// '/full/path/astro-docs/dist/concepts/index.html'
//   → 'dist/concepts/index.html'
```

### 3. MarkdownEmbeddingSource.load()
```typescript
// 1. Read file content
// 2. If HTML file: convert to markdown with htmlToMarkdown()
// 3. If markdown file: use directly (legacy behavior)
// 4. Process markdown with processMdxForSearch()
```

## Data Flow Comparison

### Legacy Mode
```
Manifests → File paths (docs/*.md) → Read markdown → Process → Store
```

### Astro Mode
```
dist/ scan → HTML files → htmlToMarkdown() → Process → Store
```

## Database/JSON Storage

Both modes produce the same structure:

**nods_page:**
```json
{
  "id": 1,
  "path": "dist/getting-started/index.html",  // Astro
  // "path": "/shared/getting-started/intro",   // Legacy
  "url_partial": "/docs/getting-started",
  "type": "markdown",
  "source": "guide",
  "checksum": "..."
}
```

**nods_page_section:**
```json
{
  "id": 1,
  "page_id": 1,
  "slug": "installation",
  "heading": "Installation",
  "content": "...",
  "url_partial": "/docs/getting-started",
  "embedding": []
}
```

## Key Files Modified

1. **getAstroPaths()** - Changed to scan dist/ for index.html
2. **MarkdownEmbeddingSource constructor** - Added Astro path handling
3. **MarkdownEmbeddingSource.load()** - Added HTML to markdown conversion

## Testing

To test the new approach:
```bash
# Requires astro-docs/dist to exist
node --import tsx src/main.mts --local --mode=astro

# Check output
cat tmp/nods_page_astro.json | jq '.[0]'
cat tmp/nods_page_section_astro.json | jq '.[0]'
```

## Benefits

1. **Accurate content**: Reads exactly what users see (built HTML)
2. **Handles Astro components**: HTML conversion handles all Astro features
3. **Simpler**: No need to parse Markdoc or handle Astro-specific syntax
4. **Consistent**: Same preprocessing as what's shown on the site
