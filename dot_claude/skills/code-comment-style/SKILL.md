---
name: code-comment-style
description: >-
  Audit inline code comments against Jack's terse "why not what" discipline and
  trim the offenders. Use on demand for a dedicated comment pass over recent
  changes. Triggers on "check comment style", "review comments", "comment
  audit", "are these comments ok", "trim comments", "audit my comments". Also
  run as a final self-check after writing a chunk of code. NOT a substitute for
  the always-on CLAUDE.md inline-comment rule (that governs writing; this is for
  auditing).
---

# code-comment-style

Enforce Jack's inline-comment discipline: a comment earns its place only by
saying *why*, briefly. Everything else is noise the reader has to skim past.

## The rule (from CLAUDE.md)

- **1-2 lines max.** More than that, the comment is doing the commit body's job.
- **Explain _why_, not _what_.** The code already says what it does.
- **Delete mechanic-recaps.** If a comment restates the line below it (loop,
  assignment, flag list, function signature/type), cut it.
- **Just solved something subtle?** The investigation narrative belongs in the
  commit body / PR description, NOT an inline block. The comment keeps only the
  1-2 line why.

### Exceptions (leave these alone)

- **Pipeline of transforms:** a short bullet per step is fine.
- **Public-API JSDoc:** may go longer for a non-obvious contract (invariants,
  units, ownership, gotchas a caller can't see).

## Process

1. **Scope the comments.** Default to added/changed comment lines in
   `git diff` (unstaged) and `git diff --cached`. If the user names files or a
   commit, use those. Look only at comments, not the code.
2. **Flag each comment** against the checklist:
   - Over 2 lines (and not a JSDoc/pipeline exception).
   - What-not-why: recaps the mechanics of the line(s) below.
   - Investigation dump: narrates how the problem was diagnosed/proven.
   - Restates the signature, type, or an obvious name.
   - Dead / obvious / stale (contradicts the code).
3. **Propose the trim** inline for each flagged comment: show the current
   comment and the 1-2 line replacement (or deletion). Where the cut reasoning
   is genuinely worth keeping, note "move to commit body/PR" rather than
   discarding silently.
4. **Apply on confirmation.** Then re-run prettier/formatter on touched files if
   the project uses one.

## Report format

Per flagged comment:

```
file:line - <reason flag>
  before: <the offending comment, elided if long>
  after:  <trimmed 1-2 line why, or "delete", or "move to commit body">
```

If nothing is flagged: "Comments pass - terse and why-focused."

## Worked example (DOC-557)

An 8-line block narrating a git `--follow` investigation, over a helper:

```ts
// getNewestCommitDate reads the file's newest commit without following renames,
// so after a bulk file move (e.g. the DOC-552 KB rework) it returns the move
// date for every article. Walk the --follow log and skip commits that rename
// the file (status R*), which a reorg is even when it also rewrites frontmatter
// or links. The newest remaining commit is the real last content change. This
// stays correct for any future move without a hardcoded commit to maintain.
// Falls back to the starlight date when git history is unavailable (e.g. a
// shallow production clone).
```

Trimmed to the why (the R088 discovery and the proof went in the commit body):

```ts
// Plain newest-commit date follows bulk file moves (e.g. the KB rework), so
// skip rename commits (R*) and take the newest real edit. Falls back to the
// starlight date when history is unavailable (shallow clone).
```

## Style notes

- ASCII punctuation in comments: `-` and `->`, no em dashes or unicode arrows
  (reads as AI-generated).
- Keep the audit itself terse - flag and fix, don't lecture.
