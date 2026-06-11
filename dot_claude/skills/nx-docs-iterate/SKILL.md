---
name: nx-docs-iterate
description: Validate-and-ship loop for nx astro-docs changes. Runs prettier, vale, the STYLE_GUIDE structural pass, an anchor sweep, then amends the squashed commit and force-pushes with 1Password op-request logging. Use after every docs edit round in the nx repo. Triggers on "docs iterate", "amend and push the docs", "ship the docs change", "docs validate and push".
---

# nx-docs-iterate

The per-iteration loop for nx astro-docs PRs that keep a single squashed commit and amend
on every review round (NXC-4453 ran this ~15 times). Run it AFTER each edit round, BEFORE
telling Jack it's pushed.

## Process

All paths relative to the nx repo root (or worktree).

### 1. Format

```bash
npx prettier --write <changed .mdoc/.mts/.mjs files>
```

Prettier may reflow Markdoc - re-check `{% aside %}` blocks with lists (blank line before
`{% /aside %}` or parsing breaks).

### 2. Vale (mechanical tier)

```bash
cd astro-docs && vale <changed files under src/content/docs/>
```

Target: 0 errors, 0 warnings. Suggestions in UNTOUCHED sections may stay; fix any in
paragraphs you added.

### 3. Structural pass (what vale can't see)

Per `astro-docs/STYLE_GUIDE.md`, on every paragraph added or rewritten:

- Claim calibration: no unsupportable absolutes ("less chance of issues", never "will not
  introduce issues").
- Terminology table: "workspace" not "monorepo"; generator not script (gloss once);
  Nx Cloud/Console capitalized.
- Bold only for UI labels and term definitions - never emphasis.
- No semicolons, no em/en dashes, ASCII only:
  `git diff master -- astro-docs/ | grep "^+" | grep -E ';|—|–|→|·'` must be empty.
- No trust words (easily/simply/just), no banned AI phrases, no list completing an intro
  sentence.
- Golden path check: feature pages show ONE command, no variants; permutations belong in
  the advanced/KB guide; converged sections get merged, not duplicated.

### 4. Anchor sweep (after any heading/section/sidebar change)

```bash
cd astro-docs
# every cross-page anchor into the changed pages must match a real heading
grep -rhoE "<changed-page-slug>#[a-z0-9-]+" src/content/docs/ | sort -u
grep -E "^#{2,4} " "src/content/docs/<changed page>"
```

- Deleted anchors can't be redirected - repoint the inbound links.
- Sidebar GROUP label renames: breadcrumbs + `sidebar_group_cards` slugify/match labels
  exactly. Move/retitle the `knowledge-base/<slug>/index.mdoc` landing page, update its
  `group=` attr, add redirects in BOTH `astro.config.mjs` and `netlify.toml` (before the
  `/docs/*` catch-all).

### 5. validate-links (when structure changed)

Works in the sandbox if `~/.m2` and `~/.gradle` are write-allowlisted (ask Jack to grant
if not):

```bash
NX_NO_CLOUD=true npx nx run astro-docs:validate-links
```

Gotchas: `nx reset` forces a cold graph (gradle wrapper re-download); `nx-dev:next:build`
is flaky on cold full rebuilds - run it alone once, then re-run validate-links. Pipe to a
file, not `| tail` (tail eats the exit code).

### 6. Amend + push (logged)

```bash
git add astro-docs/...
git commit --amend --no-edit --no-verify   # husky pre-push pnpm check fails no-TTY; docs-only is safe
```

Then force-push with the op-request-reason inline log block (see that skill - REQUIRED for
any remote git op):

```bash
git push --no-verify --force-with-lease origin <branch>
```

## Report

One line per gate: prettier / vale (errors-warnings-suggestions) / structural / anchors /
validate-links (run or skipped+why) / pushed SHA.
