# Task: Visualize Filename in Header of Code Snippets (DOC-137)

## Issue Reference
- Linear Issue: DOC-137
- https://linear.app/nxdev/issue/DOC-137/visualize-the-filename-in-header-of-code-snippet

## Goal
Convert legacy code snippet attributes (`fileName` and `highlightLines`) from Nx's custom format to Astro Starlight's native format to properly display filenames in code snippet headers and highlight lines.

## Background
Currently, code snippets in astro-docs use custom attributes like:
```
```ts {% fileName="packages/animal/src/lib/animal.ts" highlightLines=["5-18"] %}
```

These need to be converted to Astro Starlight's format:
- File names: Use a comment at the top like `// packages/animal/src/lib/animal.ts`
- Highlights: Use meta attribute like `{% meta="{5-18}" %}`

## Implementation Plan

### Phase 1: Discovery
- [ ] Search for all .md and .mdoc files in astro-docs directory
- [ ] Find files using `fileName` attribute in code blocks
- [ ] Find files using `highlightLines` attribute in code blocks
- [ ] Create list of affected files with counts

### Phase 2: Conversion Script
- [ ] Create Node.js script to parse and convert code blocks
- [ ] Handle fileName conversion to top comment
- [ ] Handle highlightLines conversion to meta attribute
- [ ] Handle edge cases (multiple attributes, different formats)

### Phase 3: Execution
- [ ] Run conversion script on all affected files
- [ ] Track files modified
- [ ] Create verification script to ensure all conversions successful

### Phase 4: Verification
- [ ] Scan all files to ensure no remaining fileName attributes
- [ ] Scan all files to ensure no remaining highlightLines attributes
- [ ] List any files with unconverted patterns for manual review

## Technical Details

### Starlight Code Block Format
Reference: https://starlight.astro.build/guides/authoring-content/#expressive-code-features

#### File Names
```ts
// my-file.ts
const example = true;
```

#### Highlighting Lines
```ts {2-3}
// or
```ts {% meta="{2-3}" %}
```

## Expected Outcome
- All code snippets in astro-docs properly display filenames in headers
- All line highlighting works with Starlight's native format
- No legacy fileName or highlightLines attributes remain
- Better user experience following tutorials/guides with clear file context

## TODO Tracking
- Keep track of progress in each phase
- Update this document as implementation proceeds
- Document any edge cases or issues encountered

## Implementation Summary

### Phase 1: Discovery ✅
- Found 4 files with legacy attributes
- 27 fileName attributes total
- 9 highlightLines attributes total
- Files affected:
  - angular-monorepo.md
  - gradle.md
  - react-monorepo.md
  - typescript-packages.md

### Phase 2: Conversion Script ✅
- Created conversion script handling both attributes
- Properly handled different comment styles for different languages
- Converted highlight line formats correctly

### Phase 3: Execution ✅
- Successfully converted all 27 code blocks
- All fileName attributes converted to top comments
- All highlightLines converted to inline meta format

### Phase 4: Verification ✅
- Verified no remaining legacy attributes
- All code blocks now use Starlight format
- Conversion complete and successful