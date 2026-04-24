---
name: nx-docs-style-check
description: Check modified Nx documentation pages against the astro-docs style guide. Auto-trigger after writing or editing docs content in the nx repo. Also trigger on "check style", "style guide", "docs review", "validate docs". Should run as a final step whenever docs files are modified.
---

# Nx Docs Style Guide Check

Validate modified documentation pages against `astro-docs/STYLE_GUIDE.md`.

## When to Run

- After writing or editing any docs page in the nx repo
- Before committing docs changes
- When asked to check style or validate content

## Process

### 1. Identify Modified Files

Find changed docs files in the current repo/worktree:

```bash
git diff --name-only HEAD -- 'astro-docs/src/content/**/*.md' 'astro-docs/src/content/**/*.mdx'
git diff --cached --name-only -- 'astro-docs/src/content/**/*.md' 'astro-docs/src/content/**/*.mdx'
git ls-files --others --exclude-standard -- 'astro-docs/src/content/**/*.md' 'astro-docs/src/content/**/*.mdx'
```

If user specifies files, use those instead.

### 2. Load the Style Guide

Read `astro-docs/STYLE_GUIDE.md` from the nx repo root (or current worktree).

### 3. Check Each File Against the Guide

Common checks:

- **Frontmatter** — required fields, title format
- **Headings** — no duplicate h1 (frontmatter title is h1), proper hierarchy
- **Code blocks** — language tag specified
- **Links** — relative for internal pages
- **Callouts** — correct Starlight syntax (:::note, :::tip, :::caution, :::danger)
- **Terminology** — "Nx" not "NX", "monorepo" not "mono-repo"
- **Tone** — direct, second person ("you"), active voice
- **Leftover Markdoc** — no `{% %}` tags remaining after migration

### 4. Report

Per file:

```
### path/to/file.md
✅ Passes / ⚠️ Issues:
- Line N: [rule] — description — suggested fix
```

If clean: "Style guide check passed for N files."

## Notes

- Only flag rules from the style guide, not personal preferences
- Focus on actionable issues
- For ambiguous rules, note but don't flag as error
