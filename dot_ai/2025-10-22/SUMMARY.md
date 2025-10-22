# Summary - October 22, 2025

## Documentation Fixes

### Fixed Codeblock Line Highlighting Syntax in Astro Docs

**Problem**: Multiple `.mdoc` files in the astro-docs were using incorrect syntax for codeblock line highlighting. The old syntax was `{numbers}` directly after the language identifier (e.g., ````yaml {32,33}`), which doesn't work properly with the Markdoc/Astro rendering system.

**Solution**: Updated all instances to use the correct Markdoc meta syntax: `{% meta="{numbers}" %}` (e.g., ````yaml {% meta="{32,33}" %}`).

**Files Modified** (7 total instances across 4 files):
- `getting-started/Tutorials/react-monorepo-tutorial.mdoc` (1 instance)
- `getting-started/Tutorials/angular-monorepo-tutorial.mdoc` (1 instance)
- `getting-started/Tutorials/gradle-tutorial.mdoc` (1 instance)
- `technologies/react/next/introduction.mdoc` (4 instances)

**Impact**: Line highlighting in code examples now renders correctly in the documentation, improving code readability for tutorial readers.

**Commit**: `5ab470ec74` - "docs(misc): fix bad line higlighting in docs"

## Related Branch
Working in worktree branch: `DOC-270`

