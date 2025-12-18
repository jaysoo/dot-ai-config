# Task: Implement llms.txt for AI-friendly Documentation

## Overview

Add support for the [llms.txt standard](https://llmstxt.org/) to make Nx documentation more accessible to AI agents and LLMs.

## Background

- `llms.txt` is like `robots.txt` but for LLMs - helps AI systems find and understand documentation
- Vercel has implemented this at `vercel.com/llms.txt`
- Currently Nx has no `llms.txt` (404 at nx.dev/llms.txt)
- The "Copy page" button (DOC-90) helps humans copy content, but `llms.txt` helps AI agents programmatically

## Specification

### Format (Markdown)
```markdown
# Nx Documentation

> Nx is a build system with first-class monorepo support and powerful integrations.

## Getting Started

- [Introduction](/getting-started/intro.md): What is Nx and why use it
- [Installation](/getting-started/installation.md): How to install Nx

## Features

- [Run Tasks](/features/run-tasks.md): How to run and cache tasks
- [Caching](/features/cache-tasks.md): Local and remote caching

## Optional

- [API Reference](/reference): CLI and API reference documentation
```

### File Variants
1. `/llms.txt` - Index with links to markdown versions of each page
2. `/llms-full.txt` (optional) - All documentation content concatenated in one file

## Implementation Plan

### Phase 1: Generate llms.txt
1. Create a build-time script or Astro endpoint that:
   - Reads all documentation pages from content collections
   - Generates markdown index with links and descriptions
   - Outputs to `/llms.txt`

2. Structure sections by sidebar categories:
   - Getting Started
   - Features
   - Concepts
   - Recipes
   - Reference (marked as Optional)

### Phase 2: Raw Markdown Endpoints (Optional)
- Add `.md` routes for each doc page (e.g., `/features/run-tasks.md`)
- Or use query param: `/features/run-tasks?format=md`

### Phase 3: llms-full.txt (Optional)
- Generate concatenated version of all docs
- Include section headers for navigation
- Consider file size limits (context windows)

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `astro-docs/src/pages/llms.txt.ts` | Create | Dynamic endpoint generating llms.txt |
| `astro-docs/src/utils/generate-llms-txt.ts` | Create | Logic to build the index |

## References

- [llmstxt.org - Official Specification](https://llmstxt.org/)
- [Vercel's llms.txt](https://vercel.com/llms.txt)
- [Mintlify blog - What is llms.txt?](https://www.mintlify.com/blog/what-is-llms-txt)

## Related

- DOC-90: Copy page button for LLMs (completed)
