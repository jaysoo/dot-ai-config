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

Run all three checks: style guide, vale, and link validation. Don't skip any.

### 1. Identify Modified Files

Find changed docs files in the current repo/worktree:

```bash
git diff --name-only HEAD -- 'astro-docs/src/content/**/*.md' 'astro-docs/src/content/**/*.mdx' 'astro-docs/src/content/**/*.mdoc'
git diff --cached --name-only -- 'astro-docs/src/content/**/*.md' 'astro-docs/src/content/**/*.mdx' 'astro-docs/src/content/**/*.mdoc'
git ls-files --others --exclude-standard -- 'astro-docs/src/content/**/*.md' 'astro-docs/src/content/**/*.mdx' 'astro-docs/src/content/**/*.mdoc'
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

### 3a. Structural Anti-AI Pass (MANDATORY for new prose)

vale only covers the mechanical tier. Prose can be 0 errors / 0 warnings / 0 suggestions and still get bounced as "too AI-sounding". Read every added paragraph against these tells, which are the ones Jack has actually flagged:

- **`claim because abstraction: list, list`** — a reason clause that explains nothing on its own ("because the work they support isn't tied to a single repository"), then a colon dumping the real content as an afterthought. Put the concrete reason IN the clause and drop the colon.
- **Adjacent sentences carrying the same information**, the second re-framing the first. Merge them.
- **Leading with the enumerated subject** ("Two are scoped to the organization...") instead of the actor ("GitHub scopes your role..."). Lead with who does the thing.
- **A claim stated in both an intro and a detail section.** One canonical home; the other links or drops it.
- **A `When it's used:` / second field that restates the first** instead of adding a fact.
- **Same-page pointer links** to a section that immediately follows ("see [X](#x) below").

Also apply the STYLE_GUIDE items vale misses: no semicolons, no em dashes, balanced-contrast constructions rationed to one per section, bold only for UI labels.

### 3b. Redirect Check for Moved/Deleted Pages (MANDATORY)

Any page moved, renamed, or deleted under `astro-docs/src/content/docs/` needs a redirect
in `astro-docs/netlify.toml` in the same change. Missed on the nx-vs-turborepo move
(#36275, fixed later in #36320).

```bash
git diff master --name-status -- 'astro-docs/src/content/docs/' | grep -E '^[RD]'
```

- `R` (moved/renamed): old URL -> new URL. `D` (deleted): -> closest surviving page.
- URL from path: lowercase, spaces/underscores -> dashes, drop extension, prefix `/docs/`.
- Rule must sit BEFORE the `/docs/*` catch-all at the bottom of netlify.toml, with a short
  comment naming the ticket/PR.
- netlify.toml only - do not add to `astro.config.mjs` for plain page moves.
- Flag as an error if a rename/delete has no matching netlify.toml redirect.

### 4. Run Vale

```bash
nx run astro-docs:vale
```

Report any errors/warnings.

### 5. Run Link Validation

Always run link validation as part of the docs workflow — broken links slip past style + vale checks.

```bash
nx run astro-docs:validate-links
```

This task depends on `astro-docs:build` and `nx-dev:build`, so it will rebuild as needed. Report any broken links.

### 6. Report

Per file:

```
### path/to/file.md
✅ Passes / ⚠️ Issues:
- Line N: [rule] — description — suggested fix
```

Then summarize vale + validate-links results. If everything is clean: "Style guide, vale, and validate-links passed for N files."

## Notes

- Only flag rules from the style guide, not personal preferences
- Focus on actionable issues
- For ambiguous rules, note but don't flag as error
- All three checks (style, vale, validate-links) must run — don't skip validate-links because it's slower
