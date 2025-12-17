# Nx Documentation Writer Skill

Use this skill when adding, editing, or polishing documentation for nx.dev/docs.

## Repository Structure

### nx-dev/ (Next.js Documentation Site)
The main documentation site - Next.js application with sub-packages:

- `nx-dev/feature-search/` - Algolia search integration
- `nx-dev/ui-blog/` - Blog listing and display components
- `nx-dev/ui-common/` - Shared UI components
- `nx-dev/data-access-documents/` - Document fetching and processing

### astro-docs/ (Starlight Documentation)
Standalone docs site using Astro/Starlight framework.

## Key Documentation Concepts

### Frontmatter & Titles
- **Frontmatter title = h1** - Never duplicate with content h1
- **Sidebar labels** can differ from page title
- **Code blocks are not headings** - `#` in shell scripts isn't markdown h1

### URL Generation from File Paths
- **Lowercase all segments**: `CI Features` becomes `ci-features`
- **Replace special chars with dashes**: spaces, underscores become dashes
- **Remove file extension**: `.mdoc` becomes nothing

**Examples:**
- `features/CI Features/split-e2e-tasks.mdoc` → `/docs/features/ci-features/split-e2e-tasks`
- `concepts/mental-model.mdoc` → `/docs/concepts/mental-model`

## Markdoc Syntax

### Component Names
Use underscores, not dashes: `side_by_side` not `side-by-side`

### JSON in Tags
- Use code fences (```json) for graph/project_details tags
- Never use inline JSON with escaped quotes - markdown processors strip escapes
- JSON is available in `data-code` attribute when using code fences

### Template Blocks
Never escape template blocks: `{% %}` not `\{% %\}`

## Markdoc to Starlight Migration

When converting Markdoc syntax to Starlight:

| Markdoc | Starlight |
|---------|-----------|
| `{% tabs %}...{% /tabs %}` | Convert to headers (`#### Tab Label`) |
| `{% callout type="note" %}` | `:::note` |
| `{% callout type="warning" %}` | `:::caution` |
| `{% callout type="check" %}` | `:::tip` |
| `{% callout type="error" %}` | `:::danger` |
| `{% graph %}` | Remove entirely (not supported) |

**Common Issues:**
- Missing closing tags cause regex failures
- Some files may have orphaned opening tags
- Run validation before transformation

## Testing Documentation Changes

### Build & Serve
```bash
# Build first
nx run PROJECT:build

# Serve static build (use -p not --port)
npx serve dist -p 8000
```

### Content Verification
```bash
# Check rendered HTML
curl -s http://localhost:PORT/path | grep "pattern"

# Clear cache between tests
rm -rf .astro dist

# Verify with simple grep
grep -r "^#\s" --include="*.md"
```

### Search Testing
Search only works in **production builds**, not dev server.

## Common Mistakes to Avoid

- Don't duplicate theme switcher in mobile menu
- Don't assume all UI elements are in Header.astro
- Don't use `lg:hidden` when you mean `xl:hidden`
- Don't override entire Starlight components for simple style fixes
- Don't assume markdown files are well-formed - check for missing closing tags
- Don't create complex regex to handle malformed input - fix the source
- Don't use inline JSON in Markdoc tags when it contains escaped quotes

## Best Practices

- Check what Starlight provides by default first
- Prefer CSS fixes in global.css over component overrides
- Test actual viewport widths, not just breakpoints
- Validate markdown structure before transformations
- Clear Astro cache (`.astro`) when transformations aren't reflecting
- Use code fences for JSON in graph/project_details tags
- Extract shared parsing logic to utility functions
- Test individual files with Node scripts before full integration
- After file changes, wait 5-10 seconds for rebuild before verification

## Debugging Text Transformations

When regex transformations aren't working:
1. **Check source data first** - Malformed input will cause silent failures
2. **Test regex in isolation** - Use simple Node scripts to verify patterns
3. **Count opening/closing tags** - Ensure balanced pairs before transformation
4. **Fix source files** - Better than making regex handle edge cases

Example debugging script:
```javascript
const content = fs.readFileSync('file.md', 'utf-8');
const openCount = (content.match(/\{% tabs %\}/g) || []).length;
const closeCount = (content.match(/\{% \/tabs %\}/g) || []).length;
console.log(`Open: ${openCount}, Close: ${closeCount}`);
```

## Technology Stack

- **Framework**: Next.js (nx-dev), Astro/Starlight (astro-docs)
- **Search**: Algolia DocSearch
- **Styling**: Tailwind CSS
- **Feature Flags**: `NEXT_PUBLIC_ASTRO_URL` for progressive migration

## Related Files

When making documentation changes, check these locations:
- `redirect-rules-docs-to-astro.js` - Redirect mappings
- `next.config.js` - Rewrites and redirects
- `map.json` - Routing configuration
