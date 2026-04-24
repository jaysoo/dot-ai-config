# Callout → aside/deep_dive migration (astro-docs)

## Context

Ran across in `~/projects/nx-worktrees/issue-33331/REVIEW_REPORT.md`: reviewer called out `{% callout %}` vs `{% aside %}` concern, then dismissed it because astro-docs' Markdoc config still registers both. Correct take: `{% callout %}` should be banned. Use `{% aside %}` for inline notices, `{% deep_dive %}` (new) for expandable tangential content. Only legit old use of `callout type="deepdive"` becomes `deep_dive`.

## Scope

Work location: `~/projects/nx-worktrees/issue-33331/astro-docs/`

1. Add `{% deep_dive %}` Markdoc tag (transform injects `type: 'deepdive'`, reuses existing `Callout.astro`).
2. Remove `callout` tag from `markdoc.config.mjs` — build hard-errors on reuse.
3. Migrate 8 existing callout usages.
4. Update `STYLE_GUIDE.md` with Markdoc tags section + old→new mapping table.
5. Add `.vale/styles/Nx/MarkdocCallout.yml` — error-level Vale rule.

## Migrations performed

| File                                                             | Old                  | New                          |
| ---------------------------------------------------------------- | -------------------- | ---------------------------- |
| `reference/Deprecated/as-provided-vs-derived.mdoc`               | `callout type=note`  | `aside type="note"`          |
| `reference/Nx Cloud/release-notes.mdoc`                          | `callout type=caution` | `aside type="caution"`     |
| `technologies/typescript/Guides/compile-multiple-formats.mdoc`   | `callout type=warning` | `aside type="caution"` (no warning in Starlight) |
| `concepts/CI Concepts/reduce-waste.mdoc`                         | `callout type=deepdive` | `deep_dive`               |
| `features/CI Features/dynamic-agents.mdoc`                       | `callout type=deepdive` | `deep_dive`               |
| `enterprise/activate-license.mdoc`                               | `callout type=deepdive` | `deep_dive`               |
| `getting-started/intro.mdoc` (×2)                                | `callout type=deepdive` | `deep_dive`               |

Total: 8 callouts → 5 deep_dive + 3 aside.

## Vale rule

`.vale/styles/Nx/MarkdocCallout.yml`:

```yaml
extends: existence
message: "Do not use the Markdoc callout tag. Use the aside tag for inline notices (note, tip, caution, danger) or the deep_dive tag for expandable tangential content. See STYLE_GUIDE.md."
level: error
scope: raw
tokens:
  - 'callout\s+(type|title)'
```

### Why this pattern

Vale's `TokenIgnores = (\{%.*?%\})` in `.vale.ini` blocks regex containing `{`, `%`, `/` from matching Markdoc tag syntax — tried ~15 variants with/without `scope: raw`, none of `\{%`, `{%`, `[{][%]`, `/callout` match even in raw scope. `callout\s+(type|title)` works because every real callout opener is followed by `type=` or `title=`. URLs like `utm_medium=callout&...` don't match (no `type|title` after). Misses the closer `{% /callout %}` but any opener violation guarantees an author fix that includes the closer.

### Verified

- Positive: test file with `{% callout type="note" ... %}` → fires.
- Negative: `utm_medium=callout` URL → no match.
- Negative: `{% aside type="note" %}` → no match.
- Full docs run (498 files): 0 errors for `Nx.MarkdocCallout`.

## Not verified

Full `nx run astro-docs:build` — worktree has no `node_modules`. `node --check markdoc.config.mjs` passes syntax. Build verification needs `pnpm install` first.

## Branch

`~/projects/nx-worktrees/issue-33331` (branch: `fix/issue-33331`). Changes NOT yet committed — layered on top of the existing DOC fix for #33331.
