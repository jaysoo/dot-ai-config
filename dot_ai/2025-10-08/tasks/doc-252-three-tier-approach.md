# Three-Tier Astro Content Source Strategy

## The Problem

Astro docs can be sourced from multiple places, each with different trade-offs:
1. `.mdoc`/`.md` source files - original but may contain Markdoc/Astro syntax
2. Built `dist/` HTML files - accurate but requires HTML→markdown conversion
3. `.astro/data-store.json` - cached parsed content with optional raw body

## The Solution: Priority Fallback

```typescript
// Priority order (best to fallback):
Tier 1: .astro/data-store.json → body field (raw markdown) ✅ BEST
Tier 2: astro-docs/dist/        → HTML → markdown conversion
Tier 3: Legacy mode              → Direct .md file reading
```

## Implementation

### getAstroPaths()

```typescript
async function getAstroPaths() {
  // Try data-store.json first
  try {
    const dataStore = await readDataStore();
    return getPathsFromDataStore(dataStore);  // Has body field!
  } catch {
    // Fall back to dist/ HTML files
    return getPathsFromDist();
  }
}
```

### Data Store Structure

The `.astro/data-store.json` may contain:

```json
{
  "collections": {
    "docs": {
      "getting-started": {
        "id": "getting-started",
        "slug": "getting-started",
        "body": "# Getting Started\n\nThis is raw markdown...",
        "data": { /* frontmatter */ },
        "filePath": "src/content/docs/getting-started.mdoc",
        "rendered": {
          "html": "<h1>Getting Started</h1>...",
          "metadata": {}
        }
      }
    }
  }
}
```

**We use the `body` field** which contains raw markdown/Markdoc before rendering.

### MarkdownEmbeddingSource.load()

```typescript
async load() {
  let markdown: string;

  if (this.fileContent) {
    // Tier 1: Use data-store body (passed via constructor)
    markdown = this.fileContent;
  } else if (filePath.endsWith('.html')) {
    // Tier 2: Convert HTML to markdown
    markdown = await htmlToMarkdown(contents);
  } else {
    // Tier 3: Direct markdown file
    markdown = contents;
  }

  return processMdxForSearch(markdown);
}
```

## Benefits by Tier

### Tier 1: data-store.json body
✅ **Raw markdown** - exactly what was authored
✅ **No conversion needed** - fastest
✅ **Most accurate** - no HTML parsing artifacts
✅ **Includes frontmatter** in data field

### Tier 2: dist/ HTML
✅ **Always available** after build
✅ **Represents final output** - what users see
⚠️ Requires HTML→markdown conversion
⚠️ May lose some formatting nuances

### Tier 3: Legacy .md files
✅ **Direct reading** - no processing
✅ **Original source** - no build artifacts
⚠️ Requires manifests to map files
⚠️ Not applicable for Astro mode

## Detection Logic

```typescript
// In constructor
if (filePath.includes('astro-docs/dist') && filePath.endsWith('.html')) {
  // Tier 2: HTML file from dist/
  path = 'dist/concepts/mental-model/index.html';
}

// In load()
if (this.fileContent) {
  // Tier 1: data-store body was provided
  markdown = this.fileContent;
} else if (filePath.endsWith('.html')) {
  // Tier 2: Read and convert HTML
  markdown = await htmlToMarkdown(contents);
}
```

## Data Store Handling

The `getPathsFromDataStore()` function handles multiple possible structures:

1. **Nested collections**: `dataStore.collections.docs[id]`
2. **Array format**: `dataStore[]`
3. **Flat object**: `dataStore[id]`

It passes the `dataStoreEntry` through to the constructor for body extraction.

## Testing

```bash
# With data-store.json (Tier 1)
node --import tsx src/main.mts --local --mode=astro
# Output: "Using Astro mode - reading from .astro/data-store.json"

# Without data-store.json (Tier 2)
rm astro-docs/.astro/data-store.json
node --import tsx src/main.mts --local --mode=astro
# Output: "Using Astro mode - reading from astro-docs/dist (data-store.json not found)"

# Legacy mode (Tier 3)
node --import tsx src/main.mts --local --mode=legacy
# Output: "Using legacy mode - reading from docs/ and manifests"
```

## Future Considerations

If `data-store.json` only has `rendered.html` but not `body`:
- Could add fallback to convert `rendered.html` to markdown
- Currently we only use `body` field for best quality

The three-tier approach ensures we always get the best available source while maintaining robust fallbacks.
