---
name: nx-docs-qa
description: QA documentation pages by testing content accuracy, link validity, code example consistency, and cross-page coherence. Spawns subagents to validate across multiple dimensions.
triggers:
  - "docs qa"
  - "qa docs"
  - "validate tutorials"
  - "test docs"
  - "docs quality"
---

# Nx Docs QA

Run a comprehensive quality check on documentation pages. Goes beyond style checking (Vale) to validate content accuracy, code examples, cross-references, and consistency.

## When to Use

- After writing or significantly editing docs pages
- Before merging a docs PR
- When a set of pages should work together (e.g., tutorial series)

## Process

### 1. Identify Pages to Check

If user specifies pages, use those. Otherwise, find changed docs files:

```bash
git diff --name-only HEAD~1 -- 'astro-docs/src/content/**/*.mdoc' 'astro-docs/src/content/**/*.mdx'
```

### 2. Run Checks (spawn subagents in parallel where possible)

#### Check A: Content Consistency
For each page, verify:
- Project names are consistent across examples (e.g., `my-app` everywhere, not `web-app` in some places)
- Package manager tab ordering is consistent (npm, pnpm, yarn, bun - or pnpm first when npm lacks support)
- Code block filenames use `// filename` comments (not `title=` attributes)
- Markdoc tag attributes use correct types (e.g., `cols=2` not `cols="2"`)
- No `--web` flag on `nx show project` (it's the default)
- Terminology: "workspace" not "repo", "task" consistently, no product possessives

#### Check B: Cross-Page Coherence
For pages that form a sequence (like tutorials):
- Prev/next navigation cards match actual page order
- Tutorial numbering in `llm_copy_prompt` is correct (N/total)
- Progressive disclosure: concepts aren't introduced before their dedicated page
- Prerequisites link to the correct earlier page
- No duplicate content between pages

#### Check C: Link Validation
- All internal links resolve to existing pages
- No links to deleted/moved pages
- External links are to official docs (not blog posts when docs exist)
- Check for links to old tutorial paths that may have been redirected

#### Check D: Code Example Validation
- JSON examples are valid (no syntax errors)
- `package.json` and `project.json` tabs both shown where applicable
- Examples use current Nx conventions (not deprecated patterns)
- No `tsconfig.base.json` path aliases recommended for new workspaces
- `workspace:*` protocol shown correctly per package manager

#### Check E: AI Agent Readiness
- `llm_copy_prompt` present on tutorial/guide pages
- Prompts include scoping constraint ("Stay on-topic")
- `llm_only` blocks don't contain outdated instructions
- `{pageUrl}` placeholder is present in prompts

### 3. Report

```
## Docs QA Report

### Pages checked: N

### Issues found:

#### Critical (blocks merge)
- [file:line] description

#### Warning (should fix)
- [file:line] description

#### Info (nice to have)
- [file:line] description

### Passed checks: N/N
```

## Notes

- This complements `nx-docs-style-check` (Vale) which handles prose style
- This skill focuses on structural/content accuracy that Vale can't catch
- For tutorial series, always check the full sequence even if only one page changed
- Run `nx vale astro-docs` separately for prose style validation
