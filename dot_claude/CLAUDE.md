# Jack Hsu's Claude Configuration

Jack Hsu (jack.hsu@gmail.com) | Nx CLI Contributor | Eastern Timezone | Be terse, not overly friendly

**IMPORTANT**: This file lives in `~/projects/dot-ai-config/dot_claude/CLAUDE.md` and syncs to `~/.claude/CLAUDE.md`. Always edit the `dot-ai-config` version.

## 🔴 Critical

In any new session, ALWAYS use /caveman skill to go into full (default) cavement mode. Let me know and I can tell you to turn it off if needed or switch to other modes.

## 🔴 NEVER use the `gh` GitHub CLI

`gh` binary removed for security (`gh auth token` leaked too broadly). No longer installed.

- **Never invoke or suggest `gh`** anywhere (answers, scripts, skills, commands). Calls fail with "command not found".
- **Never re-add `gh`** to permission allowlists, op-plugin wrappers, or shell aliases.
- For GitHub data: GitHub MCP, `curl` against `api.github.com` with an env token, or the web UI. Ask before adding a new auth path.
- PR review/comment/merge: web UI or `curl` POST, explicit confirmation only. See PR rule below.

## 🔴 Critical Setup & Verification

### dot-ai-config is the Source of Truth

- **NEVER edit files directly in `~/.claude/`** — those are synced copies
- **NEVER edit dotfiles directly in `~/.config/` or `~/`** — kitty, fish, nvim, mise, gitconfig, gitignore_global, tmux.conf are all synced copies
- **Always edit in `~/projects/dot-ai-config/`** then sync
- Skills: `~/projects/dot-ai-config/dot_claude/skills/` (NOT `~/.claude/skills/`)
- Commands: `~/projects/dot-ai-config/dot_claude/commands/` (NOT `~/.claude/commands/`)
- **If about to edit `~/.claude/` or any synced dotfile**, invoke the `dot-claude-guard` skill first
- **After invoking any skill or command**, update `~/projects/dot-ai-config/USAGE.md` with the invocation date and count

### .ai Folder Symlink (MUST CHECK FIRST)

```bash
# Verify .ai is a symlink. Use readlink / `file -h` / `[ -L ]` — plain `file .ai`
# and `[ -d .ai ]` FOLLOW the link and report "directory" even when it's correct.
readlink .ai   # should print /Users/jack/projects/dot-ai-config/dot_ai
# Fix ONLY if it is NOT already a symlink (do not rm a working symlink!):
if [ ! -L .ai ]; then
  # rsync (not cp -r) + exclude the self-referential dot_ai symlink to avoid a cycle
  [ -e .ai ] && rsync -a --exclude dot_ai .ai/ "/tmp/backup-ai-$(date +%Y-%m-%d)/" && rm -rf .ai
  ln -s "$HOME/projects/dot-ai-config/dot_ai" .ai
fi
```

### Architecture Context Loading (AUTO-LOAD ON START)

When starting work in a repo, **immediately load** the architecture file before any other work:

1. **Get repo name** from `pwd` basename or git remote
2. **Check for** `.ai/para/resources/architectures/<repo>-architecture.md`
3. **If exists, read it first** - this primes critical context

**Known repos with architecture files:**
| Repo | Architecture File |
|------|-------------------|
| `nx` | `.ai/para/resources/architectures/nx-architecture.md` |
| `ocean` | `.ai/para/resources/architectures/ocean-architecture.md` |
| `console` | `.ai/para/resources/architectures/console-architecture.md` |
| `nx-labs` | `.ai/para/resources/architectures/nx-labs-architecture.md` |

**Always search** for `<repo>-architecture.md` even if not in table - new ones may be added.

### Session Continuation Verification (After Context Compaction)

When continuing a session from a compaction summary:

1. **Always verify git status first** - summaries may be stale about commit state
2. **Don't trust commit hashes from summary** - commits may have been amended
3. **Check actual file state** - files mentioned as "uncommitted" may already be committed
4. **Run `git status` and `git log --oneline -3`** before taking any commit-related actions

**Why**: Compaction summaries capture state at summary time, but the session may have continued and committed changes before the actual compaction point.

### Concurrent Sessions Writing .ai Files (/summarize, /reflect)

- **Re-Read each `.ai` file (SUMMARY.md, architecture.md, TODO.md, COMPLETED.md) immediately before editing, and prefer Edit over blind append (`cat >>`/Write)** - a concurrent session in a sibling worktree may have already added a richer/corrected entry, so appending from memory duplicates it.
- **Verify task status (merged vs ready vs draft) from the authoritative source (Polygraph `show_session` / GitHub), not the chat.** NXC: recorded DOC-509 as a one-page draft; it was actually a merged three-page change.
- **Re-verify `git branch --show-current` before any write/commit after a turn gap** - a concurrent session may have switched the shared checkout's branch. If it changed, move new files aside (don't contaminate the other branch) and confirm before switching back. Ocean badge session: a Write landed on `fix/sandbox-violations` mid-task.

### Git Workflow

- **🔐 NEVER commit tokens, secrets, or API keys**
- **Never commit to main/master** - use feature branches
- **Always squash commits** before pushing: `git reset --soft HEAD~n && git commit`
- **NEVER push main/master branches directly unless instructed** - use branches and PRs
- **Polygraph `push_branch` cannot take an amended commit.** It runs `git pull --rebase`, so amending an already-pushed commit conflicts and leaves a mid-rebase. For follow-up changes on an open Polygraph PR, add a **new follow-up commit** (push_branch fast-forwards) instead of `git commit --amend`. Before ANY `--amend`, confirm the tip is unpushed: `git log origin/<branch>..HEAD` must show the commit (amended a pushed commit in DOC-549; pull-rebase duplicated it). Force-push via SSH only if you truly need one commit and have a remote to the target repo: logged `git fetch origin <branch> && git push --force-with-lease`, then `create_pr`/`mark_pr_ready` work normally. Also: a push_branch call the user rejected/interrupted may have ALREADY pushed - check the remote before assuming it didn't. Recurring (CLOUD-4612, #35922, ocean #11878) - don't relearn it each session. Also: a draft Polygraph PR you're iterating on can be **squash-merged + its branch deleted by a teammate MID-SESSION** - push_branch then silently RE-CREATES the branch and still reports success (and `show_session` may show a stale `MERGED`). Verify the real PR state via GitHub (WebFetch the PR URL) before trusting it; for post-merge follow-ups, branch off current `origin/master` and `git rebase --onto origin/master <last-merged-commit>` (the squashed foundation commits aren't ancestors, so a plain rebase re-applies + conflicts), then `create_pr` a fresh draft. (DOC-537 #36088 merged mid-session, follow-up #36105.)
- `git add` of a path already removed by `git rm` errors ("fatal: pathspec did not match") and aborts the WHOLE `git add` - the other paths stay unstaged (Q-503: a commit then captured only the deletions). Don't re-list `git rm`'d files in a later `git add`.
- Linear: `DOC-125` format (no #) | GitHub: `Fixes #123` format

**Commit format:**

```bash
git commit -m "fix(scope): brief description

## Current Behavior
...
## Expected Behavior
...
## Related Issue(s)
Fixes DOC-125"
```

**Valid types (Nx)**: `feat`, `fix`, `docs`, `cleanup`, `chore` (NOT `test`, `refactor`, `perf`)

- Use `docs(misc)` or `chore(misc)` for cross-cutting changes
- Test-only: `chore(testing):` not `test(misc):`
- If commit rejected, use `--amend` to fix (avoid multiple commits)

**Nx commitlint gotchas:**

- Subject MUST be all-lowercase — it rejects API symbol names (`composePlugins`, `withNx`) in the subject. Describe instead ("webpack/rspack config compose helpers"). Only `Revert`/`Release` may lead uppercase.
- For a breaking-change `!` subject or a body with backticks, write the message to a temp file and `git commit -F <file>`. A heredoc via the Bash tool injected a stray backslash before `!` and failed the hook.

**CRITICAL**: Never co-author the commit, the commit MUST come only from me. Also do not mention yourself (Claude Code) in the commit body.

**Commit body style**: Terse (caveman applies to commits too). Use the Nx template sections, but each = 1-3 short fragments. No filler, no repeating, no marketing recap. Skimmable in under 15 seconds.

**Inline code comment style**: Same discipline. 1-2 lines max, "explain _why_, not _what_". Delete comments that recap mechanics already in the code. Bullets OK for a pipeline of transforms. JSDoc on public APIs may go longer for non-obvious contracts.

**ASCII punctuation in code/commits/committed markdown**: Use `-` and `->`. No em dashes, unicode arrows, or other unicode punctuation in code comments, commit bodies, PR descriptions, or any committed markdown (incl. `tools/ai-migrations/MIGRATE_*.md`). Reads as AI-generated. OK in user-facing chat.

**PR description style**: Minimal. 1–3 sentences for Current Behavior, 1–3 for Expected Behavior, just `NXC-XXXX` (or equivalent) for Related Issue. No test plan, no file list, no Linear details — Linear is the source of truth and the PR just links by ID. Lean even shorter for drafts. If I want a longer description, I'll ask.

### Pre-Push Validation (Nx Repo)

- **ALWAYS run `nx affected -t build-base,lint,test` locally before pushing** — CI failures that could be caught locally waste time and require workflow approvals on fork PRs
- For community PRs from forks, each push requires manual workflow approval — minimize push iterations
- Run relevant e2e tests locally (`nx run e2e-vite:e2e-local -- --testPathPatterns='...'`) before pushing e2e-related changes

### GitHub PR Reviews

- **NEVER post reviews, comments, or approvals on GitHub PRs unless explicitly instructed** — even when the plan came from me.
- Analysis plans with scores/recommendations are NOT authorization to act. "MERGE AS-IS" means "this is ready", NOT "go approve it".
- Always confirm before posting any review/comment/merge action (web UI, curl, MCP — any path).

### PR Review Process

- When asked to investigate/review a PR, **pull the branch and verify locally**
- Check that new tests actually fail without the fix (cherry-pick test onto master)
- Don't just read diffs -- run `nx test PROJECT` to confirm behavior
- Snapshot tests > spot-check assertions for code transformation migrations

### Date & Time

- Always ET timezone: `date '+%Y-%m-%d'`
- **Never guess day-of-week** — run `date -d '2026-03-29' '+%A'` (Linux) or `date -j -f '%Y-%m-%d' '2026-03-29' '+%A'` (macOS) to verify
- Task files: `.ai/yyyy-mm-dd/tasks/`

## 📋 Task Management

### Starting Tasks

1. Create .ai symlink if missing
2. Read full issue description (Linear/GitHub) - never assume from title
3. Create task plan: `.ai/yyyy-mm-dd/tasks/descriptive-name.md`
4. **Add to `.ai/TODO.md` Recent Tasks list** (bump others down, remove 11th)
5. **Add to Active Claude Sessions** in TODO.md with working directory and branch

**IMPORTANT**: Task plan files go in `.ai/yyyy-mm-dd/tasks/`, NOT `~/.claude/plans/`.

- `~/.claude/plans/` = Claude Code's built-in plan mode (system-managed)
- `.ai/yyyy-mm-dd/tasks/` = Jack's task documentation convention (what you should use)

When completing tasks, always copy/move the plan to `.ai/` folder for long-term reference.

### Active Session Tracking (IMPORTANT)

- **Every task** must be added to the "Active Claude Sessions" section in TODO.md at start
- Format: `- /path/to/working/dir (branch: branch-name) — description (date)`
- **When completing a task**: remove from Active Claude Sessions, add to COMPLETED.md
- Sessions are considered stale after 7 days — clean up on next visit

### Key Paths

- Plan tasks: `~/.claude/commands/plan-task.md`
- Dictation: `~/.claude/commands/dictate.md`
- Architecture: `.ai/para/resources/architectures/[repo]-architecture.md`
- Daily summaries: `.ai/yyyy-mm-dd/SUMMARY.md`

**Workflow**: Verify → Stage (`git add`) → Check count → Squash → Commit with template → Verify

### Task TODO Format

`dot_ai/TODO.md` tracks **In Progress** and **Pending** only. Completed tasks → `.ai/para/archive/COMPLETED.md`

**TODO.md:**

```markdown
## In Progress

- [ ] Task name (yyyy-mm-dd hh:mm)
  - Plan: `dot_ai/yyyy-mm-dd/tasks/name.md`
  - Goal: Brief goal
```

**COMPLETED.md** (by month):

```markdown
### January 2026

- [x] Task name (yyyy-mm-dd)
  - Plan: `dot_ai/yyyy-mm-dd/tasks/name.md`
  - Summary: What was accomplished
```

### Completing Tasks (IMPORTANT)

When a task is completed:

1. **Remove** the task from `TODO.md` (In Progress or Pending section)
2. **Remove** from "Active Claude Sessions" in TODO.md
3. **Add** to `.ai/para/archive/COMPLETED.md` under the current month header
4. **Create** COMPLETED.md if it doesn't exist (use PARA archive structure)
5. **Include** in daily `SUMMARY.md` if completing same day

**Quick tasks** (not in TODO.md): Still archive to COMPLETED.md with summary of what was done.

```bash
# COMPLETED.md location
.ai/para/archive/COMPLETED.md
```

### Recent Tasks List (Last 10)

At top of `TODO.md` for quick context rebuilding:

```markdown
1. **Task name** (yyyy-mm-dd)
   - Summary: 1-2 sentences
   - Files: `dot_ai/yyyy-mm-dd/tasks/file.md`
```

New tasks go at #1, bump others down, remove 11th item.

## 📁 PARA Organization

```
.ai/para/
├── projects/        # Active projects with deadlines
├── areas/           # Ongoing responsibilities (personnel/, syncs/, productivity/)
├── resources/       # Reference materials (architectures/, scripts/)
└── archive/         # Inactive items
```

**Key Rule:** Every folder has a `README.md`. No orphaned files.

| Category      | Has End Date? | Examples                                    |
| ------------- | ------------- | ------------------------------------------- |
| **Projects**  | ✅ Yes        | Ship feature, Complete migration, Write RFC |
| **Areas**     | ❌ No         | Personnel management, Team syncs            |
| **Resources** | ❌ No         | Architecture docs, Scripts                  |
| **Archive**   | N/A           | Completed projects, Outdated docs           |

**Decision:** Deadline? → projects | Ongoing? → areas | Reference? → resources | Inactive? → archive

## 👥 Personnel Notes

**Location:** `.ai/para/areas/personnel/[name].md` (lowercase, hyphenated)

**When to Update:** During `/dictate`, conversations mentioning colleagues, 1:1 meetings

**Capture:**

- Personal: Location, family, hobbies, food/drink preferences
- Professional: Team/role, projects, goals, strengths, development areas
- 1:1 Notes: Dated entries, action items, topics to revisit

**Files:** `OVERVIEW.md` (quick reference table - always update), `_template.md`, individual `[name].md`

## 📊 Team Sync Tracking

**Location:** `.ai/para/areas/syncs/[team]/README.md`
Teams: DPE, CLI, Orca, Backend, Infra, Docs, Framer

**Section Order:**

1. Topics for Next Meeting
2. **Upcoming Sync** (accumulated notes between meetings)
3. Active Accounts (optional)
4. Action Items
5. Meeting Notes (dated, reverse chronological)

**Ad-hoc additions ("add this to the infra sync", "add to my 1:1 with X"):**

- **Default destination is `## Upcoming Sync`** — for both team syncs AND 1:1 personnel files
- Do NOT add to `## Topics for Next Meeting` (that's a curated agenda)
- Do NOT add to `## Action Items` unless the user explicitly frames it as an action item
- Do NOT create a new dated `## Meeting Notes` entry — those only go in when a meeting actually happened
- For 1:1 files under `.ai/para/areas/personnel/[name].md`, create an `## Upcoming Sync` section directly above `## 1:1 Notes` if it doesn't exist

**Workflow - When updating "today's" sync (actual meeting happened):**

1. Move "Upcoming Sync" content into today's dated meeting notes
2. Clear "Upcoming Sync" section (keep header, remove content)
3. Add new action items, mark completed ones
4. Clear discussed items from "Topics for Next Meeting"

**Important:** Never delete "Upcoming Sync" section - just clear it after moving content.

### Meeting Notes Processing

- **Don't blindly copy meeting notes** - AI transcription tools (Granola, etc.) sometimes misattribute statements to wrong attendees
- When processing meeting notes, cross-reference with context (who is it logical for?)
- If user corrects attribution, update ALL instances (topics, action items, meeting notes)

### Clearing Upcoming Sync Section

- **Don't remove items unless explicitly addressed** in meeting notes
- Items in "Upcoming Sync" should be preserved or moved to meeting notes - not deleted
- Ask user about items that appear in Upcoming Sync but not in provided meeting notes
- Better to include something brief than to lose context entirely

The `/dictate` command auto-detects sync meetings and updates the right file.

## 🔍 MCP Server Usage

**ALWAYS use MyNotes MCP first for:** personal content, tasks, specs, TODOs, work history

| Tool                              | Purpose              |
| --------------------------------- | -------------------- |
| `mcp__MyNotes__search_ai_content` | Search all content   |
| `mcp__MyNotes__get_task_context`  | Resume specific task |
| `mcp__MyNotes__find_specs`        | Find specifications  |
| `mcp__MyNotes__extract_todos`     | Find TODO items      |

**Triggers**: "my notes", "my tasks", "previous work", "what did I work on"

**Gemini collaboration**: Use the `gemini-collab` skill (shells out to the `gemini` CLI in headless mode) for fact-checking, code review, and deep research. Do **not** use any `mcp__gemini-*` MCP tools — they've been replaced by the skill.

**Linear MCP:**

- Confirm team: "Nx CLI" (NXC-) vs "Nx Cloud" (CLOUD-)
- Get team ID first: `mcp__Linear__list_teams`
- Use pagination (limit: 30-50) to avoid token errors
- `updatedAt` filters ON/AFTER date (not before)

## 💻 Development Preferences

### Philosophy

- **Simple > Complex** - CSS before JavaScript
- **Debug first, fix second** - Understand the problem first
- **One property > Many hacks** - Check if single CSS property works
- **Ask before assuming** - Multiple approaches? Ask.
- **Iterate, don't defend** - Change based on feedback
- **Inline small local type unions; don't name them.** Prefer an inline string-literal union (`'yes' | 'no' | 'unset'`) over a named type alias when it's small and used in one module. Only extract a named alias when it's reused across modules. (#35922 - dropped an `AnalyticsPromptAnswer` alias at Jack's request.)
- **Prefer additive over in-place when extending shared code.** New caller should just _use_ the existing function (even slightly wastefully): call it with the args you need, extract a private helper, or add a sibling fn. **Avoid refactoring the existing fn** unless its behavior changes or duplication >20 lines (drift risk). Reviewer cost of "this PR also touches existing code" is high. If you must extract, make it a separate commit so it reads as a no-op move.
  - **Why:** Q-443 — refactored `getWorkspaceSandboxViolations` to share a totals query; Jack pushed back since dashboard behavior was unchanged but the diff got noisier. Fix: CIPE caller invoked it directly with `{pageSize: 1}`; dashboard fn = 0 diff.
- **Realistic examples > hypothetical edge cases** - Before coding for an edge case, find a concrete test fixture that hits it in a real workspace. No defensive branching, retries, fallback paths, or generalized loops for scenarios that never occur. Tempted to write a loop? Ask "is there a real file with multiple matches?" Tempted by a fallback? Ask "what test exercises it?" If it's just defensiveness, delete it and ask.
  - **Why:** NXC-4157 — tsquery migration with reverse-walk loop + leading-comma fallback + whitespace nibble. Stripped to ~5 lines after two pushbacks on hypothetical-only complexity.
- **Verify third-party support claims before committing them in user-facing docs.** Any compat/support claim shipping in a committed file (AI migration md, generator output, README) must be verified against upstream first — grep the changelog or run `npm view <pkg> versions`. The doc ships into user repos and ages. (PR descriptions are exempt — ephemeral.)
  - **Why:** NXC-4448 — wrote "Cypress CT does not support Vite 8 yet"; Cypress 15.14.0 had shipped it 3 weeks earlier. Reviewer caught it.

### Component Order

1. Tailwind/CSS (try `align-items`, `justify-content` first)
2. Check if global stylesheet CSS solves it
3. Get feedback before complexity
4. JavaScript only if CSS fails
5. Component overrides as last resort (especially Starlight)

### Common Pitfalls

- Arbitrary Tailwind selectors (`[&>*:first-child]:`) unreliable
- Tab alignment: Try `align-items: end` before complex hacks
- Verify file paths exist before using
- Ask for dev server port (don't assume 4200, 3000, etc.)
- Regex failing? Validate input structure first, check for malformed source
- Astro cache issues: Clear `.astro` folder
- Class-string codemods must scope to JSX `className=`/`class=` attrs and known utility-fn calls (`clsx`/`cn`/`twMerge`/`cva`/`classnames`). Bare `\b` word boundaries also match TS prop names (`rounded?:` becomes `rounded-sm?:`) and CSS function calls inside template literals (`blur(${x})` becomes `blur-sm(${x})`). Use lookbehind on `[\s:"'\`!]`boundaries; never run rename across raw string literals indiscriminately. After codemodding source under a pnpm`file:`dep (e.g.,`nx-dev/ui-_`, `graph/ui-_`), run `pnpm install --force`so`node_modules/.pnpm/.../node_modules/<pkg>/` refreshes - otherwise the consumer build sees the stale pre-codemod copy.
- Tailwind v4 `@source` does NOT support extglob (`!(*.stories|*.spec)`); patterns silently match zero files and utilities never make it into the bundle. Use plain dir paths + `@source not '**/*.{spec,test,stories}.*'`. Same trap if porting any v3 `content` array verbatim.
- **Shell is fish**: inline `bash -c` / `python3 -c` / `node -e` strings mangle `!` and `!=` (history expansion + line-continuation), silently breaking comparisons (`r['status'] != 'done'` becomes a syntax error or no-op). Single-quoted heredocs (`python3 - <<'EOF'`) are NOT safe either - `\!=` still arrives mangled. Always write the script to a file (Write tool) and run the file. Alternatively `not in (...)` / `<>`. A background CI poller using `!=` polled blindly for 90 min and reported nothing - always confirm a long-running poller emits a real signal before trusting it. Also: `$status` after a pipeline reflects only the LAST stage - `git push ... | tail` reports `tail`'s exit (0) and masks a failed push; use `$pipestatus[1]` (or run the command unpiped). Once reported a failed force-push as success (NXC-4548). Also: fish does NOT word-split variables - `set FILES "a.ts b.ts"; npx prettier $FILES` passes the whole string as ONE argument (fails "no files matching"); pass paths explicitly or use a real fish list (`set FILES a.ts b.ts`). Hit twice in Q-503. Also: fish CONTROL-FLOW breaks in the Bash tool - `test ...; and ...; or ...`, `if/else/end` inside a piped or compound command, and `mapfile` (bash-only) all error mid-command. For any loop/conditional/array work (renumbering, per-file edits, list filtering), write a Node `.mjs` script and run the file instead of inlining fish control-flow. Hit ~5x in DOC-537.

## 📚 Documentation Sites (Astro/Starlight)

### Key Concepts

- Frontmatter title = h1 (never duplicate)
- Sidebar labels can differ from page title
- Search only in production builds
- Code blocks ≠ headings (# in shell scripts isn't markdown h1)

### Feature pages = golden path (necessary choices only)

- Feature pages teach the default workflow: one command form (`nx migrate`, never also `nx migrate latest`). Flags appear only when the reader faces a real choice - explain it briefly (NXC-4453: why pick `--include=required` over `all`), deep-dive in the advanced/KB guide.
- Remove deprecated options from docs entirely (no deprecation asides) when a replacement exists. Same for superseded workflows (the `--from` catch-up died when `--include=optional` shipped).
- When two sections converge on the same flag/topic after a rewrite, MERGE them - don't leave both (NXC-4453: two `--include` sections).

### Sidebar group renames break label-coupled routes (nx astro-docs)

Breadcrumbs and `sidebar_group_cards` slugify/match sidebar group LABELS (exact, case-sensitive). Renaming a group in `sidebar.mts` requires: move/retitle the matching landing page (e.g. `knowledge-base/<slug>/index.mdoc`), update its `group=` attr, and add redirects in BOTH `astro.config.mjs` and `netlify.toml` (before the `/docs/*` catch-all). `validate-links` catches this - run it before pushing sidebar changes. Plain page moves between sidebar groups don't change URLs (no redirect needed); deleted ANCHORS can't be redirected - repoint inbound links instead.

### Docs style pass = vale + structural, BEFORE pushing

vale catches the mechanical tier only. Also run the STYLE_GUIDE structural pass on every paragraph added: claim calibration (no unsupportable absolutes - "less chance of issues", not "will not introduce issues"), terminology table ("workspace" not "monorepo"), bold only for UI labels/term definitions, no semicolons, no duplicate links, and an anchor sweep after restructures (`grep -rhoE "<page>#[a-z0-9-]+" src/content/docs/` vs the page's headings). Use the `nx-docs-iterate` skill for the full loop.

### Testing

```bash
nx run PROJECT:build
npx serve dist -p 8000  # use -p not --port
```

Use Playwright MCP for UI verification.

### Markdoc

- Use underscores: `side_by_side` not `side-by-side`
- JSON in graph/project_details: Use code fences (```json), not inline
- Never escape template blocks: `{% %}` not `\{% %\}`
- HTML entity decoding: Handle &quot;, &#34;, &#x22;
- Code block filenames: Use `// filename` comment as FIRST LINE inside block, NOT `title=` attribute
  - ✅ ` ```jsonc \n // nx.json`
  - ❌ ` ```json title="nx.json"`
- Markdoc tag attributes: Number types must NOT be quoted (`cols=2` not `cols="2"`)
- `{% graph %}` tag requires inline JSON code fence for custom data
- `{% aside %}` with block content (lists): blank line before `{% /aside %}` required, or prettier indents it into the list and breaks Markdoc parsing
- Prefer existing Starlight/Markdoc tags over custom components for docs content (e.g. `{% aside %}` with a list over a custom Astro component)
- package.json/project.json example pairs: use `{% tabs syncKey="project-config-file" %}` with the **package.json tab first**. The shared `syncKey` (canonical value `project-config-file`, also used by `reference/project-configuration.mdoc`) makes all such tab groups on the page switch together and persist the choice.

### Starlight Migration

- `{% tabs %}` → headers (#### Tab Label)
- `{% callout type="X" %}` → asides (:::note, :::tip, :::caution, :::danger)
- `{% graph %}` → Remove entirely
- Run validation before transformation (check for orphaned tags)

### Header/Responsive

- Main header: `src/components/layout/Header.astro`
- Mobile menu: `src/components/layout/PageFrame.astro`
- Theme switcher handled by Starlight - DO NOT duplicate
- Tailwind breakpoints: `md`: 768px, `lg`: 1024px, `xl`: 1280px

### Pixel-Matching UI to External Sites

- **Measure first, code second**: Use Playwright `page.evaluate()` to extract computed styles (color, padding, font, dimensions) from the target site BEFORE writing any CSS
- **Verify with ImageMagick**: `magick site1.png site2.png -compose difference -composite -auto-level diff.png` — do this early and often, not as an afterthought
- **Don't guess colors**: Extract exact `rgb()` values via computed styles. Tailwind color names (zinc-400 vs zinc-500) are approximations — verify the actual rendered value matches
- **SVG logo sizing**: Check the viewBox aspect ratio. `viewBox="0 0 24 24"` is square; `viewBox="0 0 40 26"` is wide. `w-auto` respects aspect ratio — don't force dimensions that distort
- **Flex gap spacing**: Separator/divider elements contribute to flex gap calculations. A 1px vs 5px separator shifts ALL downstream items cumulatively. Measure the target's separator container width
- **Line-height matters for button heights**: Tailwind's default `text-sm` line-height is 20px. If the target uses 16.8px (1.2), buttons will be 3-6px too tall without `leading-[1.2]`

### Common Mistakes

- ❌ Duplicate theme switcher in mobile menu
- ❌ Override entire Starlight components for simple fixes
- ❌ Use lg:hidden when you mean xl:hidden
- ❌ Inline JSON with escaped quotes (markdown strips escapes)
- ❌ Use !important to override Starlight styles
- ✅ Check what Starlight provides first
- ✅ Prefer CSS in global.css over component overrides
- ✅ Use `[data-theme='dark']` for dark mode styles
- ✅ Clear `.astro` cache when transformations don't reflect

## 🏗️ Nx Monorepo Patterns

Run `pnpm install && pnpm build` in background when starting work.

### Acronyms

- **CNW**: Create Nx Workspace (`packages/create-nx-workspace/`)
- **CNP**: Create Nx Plugin (`packages/create-nx-plugin/`)
- **NXC**: Nx CLI issues | **DOC**: Docs issues | **CLOUD**: Cloud issues

Always spell out on first use: "NXC-3464: CNW (Create Nx Workspace) Templates"

### Version Management in Generators

- Version constants go in `versions.ts`, never hardcoded in generator code
- Follow existing patterns: `getInstalledViteMajorVersion`, `getInstalledAngularVersion` — use `getDependencyVersionFromPackageJson` + `semver.coerce/major`
- Init generators must detect and preserve existing dependency versions — don't bump users to latest without explicit opt-in
- When adding version detection, always add unit tests for: not installed (default), existing older version (preserved), existing same version (preserved), explicit flag override

### nx release: config inheritance

When debugging `nx release version` / `nx release publish` behavior, check BOTH:

- Per-group config under `nx.json` → `release.groups.<group>.version`
- **Top-level defaults** under `nx.json` → `release.version` (e.g. `preserveLocalDependencyProtocols`, `manifestRootsToUpdate`)

Group config inherits from top-level defaults when not overridden. Easy to grep only in a group and miss the setting entirely.

### CNW A/B Testing Infrastructure

- `NX_CNW_FLOW_VARIANT` controls BOTH flow behavior AND prompt copy variant — NEVER add a separate env var for prompt selection
- `PromptMessages.getPrompt(key)` selects from the `messageOptions[key]` array using the flow variant index
- To add new A/B test variants: add entries to the relevant `messageOptions` array (e.g., `setupNxCloudV2`), each with a unique `code` for tracking
- Flow variant is cached per-user for 1 week (tmpfile) — same user sees same variant consistently
- Don't use `parseInt` on values that are already validated single-digit strings — use `Number()` or direct indexing

### Commands & Testing

- Use `nx run PROJECT:target` not `npm run`
- Use `.spec.ts` extension for tests (not `.test.ts`)
- **ALWAYS run `nx sync` after modifying package.json**
- **ALWAYS run `pnpm install` after modifying any package.json** — lockfile must be regenerated and committed
  - Peer-dependency additions DO change the lockfile (importer entries) — don't strip them as "churn." `pnpm install --lockfile-only` sometimes reports "Already up to date" falsely; confirm with `CI=true pnpm install --frozen-lockfile` (the real CI check) before pushing.

### Migration Testing

```bash
# ❌ WRONG - @next points to next major version
npx nx migrate @next

# ✅ CORRECT - explicit version
npx nx migrate 22.0.0-beta.7
```

**Steps:** migrate → install → run-migrations → **verify** `cat package.json | grep '"nx"'`

Always verify with `npm view nx@next version` before using tags.

### Migration Isolation (CRITICAL)

- Nx migrations are **self-contained**. **Never import** from a previous-major-version migration directory.
  - ❌ `import migrate from '../update-22-2-0/...'` in a `update-23-0-0/` migration
  - ✅ Duplicate the logic into the new migration file
- **Why:** Old migrations get removed at the next major bump. Cross-major imports break.
- **How to apply:** When writing a v(N+1) safety-net or follow-up migration, copy the relevant functions inline. DRY across versions does not apply here.

### Migration Version Numbers (CRITICAL)

When adding a new entry to `migrations.json`, set `version` to one above the **latest published beta tag**, never `X.0.0-beta.0`:

```bash
git tag | grep "23.0.0-beta" | sort -V | tail -1   # latest, e.g. 23.0.0-beta.8
# new migration version = 23.0.0-beta.9
```

- **Why:** NXC-4156 — a migration tagged at an already-released version won't run for users on that version or later. The `next` beta isn't cut yet, so `latest + 1` is correct. Always check the latest tag first.
- **Re-bump as new betas ship during multi-day loops.** Targeting `beta.7` while `beta.8` ships means it silently won't run for `beta.8` users. Re-check `git tag` and bump on each push. NXC-4154/NXC-4448 — bumped beta.7 -> .9 -> .10 in one day.

### packageJsonUpdates: One Gate Per Independently-Versioned Package

When a `packageJsonUpdates` entry bumps multiple packages, the `requires` gate applies to ALL of them together. If a user has only one of those packages out of date, none get bumped.

```jsonc
// ❌ Combined gate — skips dev-server bump for users who already manually upgraded cypress
"23.0.0": {
  "requires": { "cypress": ">=15.0.0 <15.14.0" },
  "packages": {
    "cypress": { "version": "^15.14.2" },
    "@cypress/vite-dev-server": { "version": "^7.3.1" }
  }
}

// ✅ Split entries — each runs independently when its own dep is stale
"23.0.0": {
  "requires": { "cypress": ">=15.0.0 <15.14.0" },
  "packages": { "cypress": { "version": "^15.14.2" } }
},
"23.0.0-vite-dev-server": {
  "requires": { "@cypress/vite-dev-server": ">=7.0.0 <7.3.1" },
  "packages": { "@cypress/vite-dev-server": { "version": "^7.3.1" } }
}
```

- **Rule:** If two packages can drift to independent versions, give each its own entry + `requires`. NXC-4448 — reviewer caught that a combined cypress gate skipped the dev-server bump for users who'd manually upgraded cypress.
- **No `x-prompt` on NEW `packageJsonUpdates`** - deprecated, superseded by `nx migrate --include=required|optional|all`. Per-package opt-in is gone: third-party deps (next/react/eslint-config-next/@types/*) are auto-classified `optional` because they are NOT in the target's `@nx/*` `packageGroup`, and the user picks the tier. Keep the `requires` gate (it still controls whether the bump applies). `"cli": "nx"` on a migration entry is inert - omit it. (NXC-4548, Leo.)

### tsquery Codemod Patterns

When writing migration codemods that match property keys or use `:has()`:

- **Property keys come in two AST forms.** `foo: 1` is `Identifier`, `'foo': 1` is `StringLiteral`. A selector like `PropertyAssignment > Identifier[name=foo]` silently misses quoted-key forms (common after JSON-style configs or some formatters). Use `:matches(...)` or two `:has(...)` selectors and filter by the matched node's `.name.text`.
- **`:has()` matches any descendant, not just direct children.** `PropertyAssignment:has(Identifier[name=foo])` will match an OUTER PropertyAssignment whose value transitively contains `foo`. Always filter by the matched node's own `name.text === target` to constrain.
- **For renames, prefer string-slice over reprint.** Reprinting via `ts.createPrinter` reformats the entire surrounding object literal. For pure identifier rewrites, slice `[node.getStart(), node.getEnd()]` and substitute — preserves user formatting; prettier handles cleanup.
- **Why:** NXC-4448 — first cut of `remove-experimental-prompt-command` only matched bare-key form, missed `'experimentalPromptCommand': true`. Reviewer caught it.

### Codemod / Bulk Comment Removal

When stripping comments that are the **only** content of an object literal, also collapse the now-empty multi-line `{\n  }` to no-args form. Prettier collapses these on save, so pre/post-conversion equality assertions in specs (`expect(updated).toBe(initial)`) will break otherwise.

- **How to apply:** Pair the comment-stripping pass with a regex pass: `withReact\(\{\s*\n[ \t]*\}\)` -> `withReact()` (and same for `new NxReactRspackPlugin({})`). Run prettier + affected specs with `-u`. NXC-4156 — left `withReact({\n })` empties broke a `convert-to-inferred` equality check.

### Nx Docker Plugin (@nx/docker)

- Target: `docker:build` (not `docker-build`)
- Dockerfile must be named exactly `Dockerfile` (not `*.dockerfile`)
- Minimal config:
  ```json
  "docker:build": { "options": { "cwd": "", "file": "apps/myapp/Dockerfile" } }
  ```

### Nx Executors: Process Spawning

**`nx:run-commands` code paths:**

- **Single commands**: `runSingleCommandWithPseudoTerminal()` via PTY (Rust native)
- **Parallel commands**: `ParallelRunningTasks` via Node's `exec()` with piped stdio
- **Serial commands**: `SeriallyRunningTasks` with PTY if supported

Debug by adding logging to `node_modules/nx/src/executors/run-commands/`. Don't assume piped stdio.

### Common Issues

- TSC errors in isolation normal (use project-level checks)
- Stuck processes: `lsof -i :PORT` then `kill PID`
- File reversions = linting/formatting (check `git diff`)
- pnpm-lock.yaml rebase conflicts: NEVER use `git checkout --theirs pnpm-lock.yaml`.
  Use: `git checkout origin/master -- pnpm-lock.yaml && pnpm install --no-frozen-lockfile`
- Sandbox `pnpm install` can corrupt `node_modules` via reflink (`ERR_PNPM_EPERM`), breaking local `nx`/`jest`/`prettier`. Use `pnpm install --lockfile-only` for lock-only work (no node_modules writes); `--package-import-method hardlink` to repair; else rely on CI for tests.
- `astro-docs:validate-links` WORKS in the sandbox once `~/.m2` and `~/.gradle` are write-allowlisted (Maven/Gradle lock files). If the graph errors after `nx reset`, that's the gradle plugin re-downloading the wrapper; `nx-dev:next:build` is flaky under cold full rebuilds - retry it alone, then re-run.
- husky pre-push runs a pnpm deps check that fails no-TTY in the sandbox (`ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`); docs-only pushes use `git push --no-verify` after prettier + vale.
- Stale Netlify deploy previews cause false alarms (missing sidebar entries, "wrong casing"). Check master / the current commit before "fixing" a preview-reported issue.

### GitHub Actions Side Effects

`setup-node` with `registry-url` sets `NODE_AUTH_TOKEN` (even dummy placeholder). When migrating to mise, this side effect is lost. CI detection should use `GITHUB_ACTIONS` env var.

## ✅ Verification

1. `git status && git diff`
2. Check ALL file types (`.md`, `.mdx`, `.mdoc`)
3. Run verification scripts + simple grep
4. Verify actual count matches expectations
5. For date tasks: Document calculation, test examples

**Easy tasks** (typos, simple edits): Use bash/node scripts without dependencies

## 🚀 Quick Fixes

### Git Worktrees

- `.ai` symlink points to main config
- Architecture files use main repo name: `nx-architecture.md` not `DOC-184-architecture.md`

### Next.js Issues

- Env vars replaced at BUILD time, not runtime
- Redirects execute before rewrites
- Wait 5-10 seconds for rebuild before verification

**Static vs Dynamic env access:**

```tsx
// ❌ Static object - undefined at runtime
const nav = { items: [{ href: process.env.URL }] };
// ✅ Function - works
const getNav = () => ({ items: [{ href: process.env.URL || "" }] });
```

**getStaticProps vs getServerSideProps:**

- `getServerSideProps` can't access `public/` files in production (ENOENT errors)
- Use `getStaticProps` for pages reading from filesystem

**Middleware vs SSR for routing:**

- Middleware: Edge Runtime (cheap/free)
- SSR: Lambda invocations (~$0.20/million)
- Static: CDN cache (essentially free)

### Environment Variable Cleanup

When removing env checks: keep the **truthy** branch (first value in ternary).

- `env ? <New /> : <Old />` → Keep `<New />`
- `!!env` for boolean → Keep `true`

### URL Migration (Nx Docs)

```tsx
href={process.env.NEXT_PUBLIC_ASTRO_URL ? "/docs/new-path" : "/old-path"}
```

## 📝 Script Development

1. Test on 1-2 files first
2. Handle edge cases (code blocks, escaping)
3. Store in `.ai/yyyy-mm-dd/tasks/`
4. Use Node.js scripts (.mjs) for cross-platform

### Debugging Transformations

```javascript
const content = fs.readFileSync("file.md", "utf-8");
console.log("Open:", (content.match(/\{% tabs %\}/g) || []).length);
console.log("Close:", (content.match(/\{% \/tabs %\}/g) || []).length);
```

Fix source files rather than making regex handle edge cases.

### Investigation Best Practices

- **Verify actual code path FIRST** - add logging to node_modules. Watch for multiple impls (PTY vs spawn vs exec, native vs JS).
- **Multi-agent Workflow sizing/prompts**: long-running max-effort agents (30-40+ min, unbounded reads/web searches) die with "API Error: Connection closed mid-response" and retry from scratch - cap effort (medium for review/judgment), cap file reads + searches, target <15 min per agent. Pass large payloads (findings JSON) to agents via files, and build prompts with plain string concatenation - a `${'...'}`+replace placeholder trick in a workflow script shipped the literal placeholder to 8 fixers (DOC-549).
- **Don't document theories as facts** - mark as "HYPOTHESIS: needs verification"
- **When reviewing/verifying dependency changes, check the INSTALLED version (`node_modules/<pkg>/package.json`), not the declared range.** A peer dep can silently anchor a lower version while `npm ci` passes without error — so package.json saying `^0.34` while `0.32` is actually installed looks "green" but is wrong.
  - **Why:** NXC-3464 — an agent's `@tanstack/ai` 0.34 bump resolved to 0.32 (anchored by `ai-react-ui@0.8.9`) and dropped `@tanstack/ai-anthropic`, breaking the chat; build/typecheck/`npm ci` all passed.
- **Endorsing another reviewer's code-logic-only claim**: "code does X, therefore Y" — reading the code only proves X. Reproduce Y (repro, local publish, or unit test) before acting; if uncertain, ask me rather than propagate an unverified prediction.
- **Verify the baseline before calling it a regression.** "Worked before, now fails": first check the earlier "success" wasn't a silent failure — diff the script for exit-code checks / error swallowing / fragile stdout parsing (green CI ≠ it worked). Only then look for real regressions.
  - **Why:** NXC-4353 — chased a non-existent "22.6 -> 22.7 regression" for an hour; the script returned 0 regardless of pnpm publish until PR #10489 added exit-code propagation. Bug was invisible since Dec 3.
- **Reproduce locally before recommending a CI fix.** Deterministic, isolated signatures (e.g. `ERR_PNPM_CANNOT_RESOLVE_WORKSPACE_PROTOCOL`) — repro on your machine first. Pattern-matching the error message (or another model agreeing) frequently lands on the wrong root cause.
  - **Why:** NXC-4353 — recommended `pnpm.supportedArchitectures` from the error phrasing, Gemini agreed, both wrong; one minute of local repro disproved it.

**Example (NXC-3505):** Assumed `exec()` with piped stdio, but single commands use PTY.

### URL Generation from Paths

`CI Features/split-e2e-tasks.mdoc` → `/docs/ci-features/split-e2e-tasks`
(lowercase, spaces/underscores → dashes, remove extension)

## 🔧 Debugging

### URL Redirect Testing

```bash
curl -I -L http://localhost:PORT/path
```

Verify with real browser (Playwright). Document working vs failing cases.

- **Verifying many URLs via WebFetch: batch in small groups (≤8).** Firing ~20+ parallel WebFetch calls triggers rate-limiting that returns **false 404s**. Re-verify any suspected 404 in a small batch before "fixing" it. (NXC-3464 — a 22-call batch falsely flagged `import-project`/`affected` as 404; both exist.)

### Common Issues

- Search: Must use production build
- Conflicting rules: Check `redirect-rules.js` + `next.config.js`
- Client nav: Link components use client routing, not server redirects

### Content Migration

- Check map.json or routing config first
- `/recipes/*` → `/docs/technologies/{tech}/Guides/*`
- Verify file existence before assuming 404s

## 🐛 Third-Party Integration Issues

1. **Check code logic first** - trace paths, verify with logging
2. **If correct AND can't reproduce** → check third-party issue tracker
3. **Red flags:** Error mentions third-party parser, intermittent, works in test but fails for reporter

**Example (NXC-3514):** Spent hours on Nx lockfile parsing when Bun outputs malformed Yarn format (https://github.com/oven-sh/bun/issues/16252).

## 🔐 1Password CLI

### Always log auth requests via the `op-request-reason` skill

Before **any** command that triggers a 1Password prompt — `op` (any auth subcommand) or remote `git` ops (`push`/`pull`/`fetch`/`clone`/`ls-remote`/`remote update`, which pull the SSH key from 1P's agent) — invoke the `op-request-reason` skill. It's SKILL.md only (no script): write the inline log block before the command, patch the line after, every time. Skip it and nothing logs, so Raycast won't show Jack the pending request.

Local-only git ops (`status`, `log`, `diff`, `add`, `commit`, `branch`, `checkout`, `reset`, `stash`) do NOT need logging.

```bash
# Vault error: "Engineering" isn't a vault
op signin  # Select: tuskteam.1password.com
op account list  # Check current account
```

### Environment Variable Load Order

The `op run --env-file=FILE` flag loads env files AFTER shell vars, meaning they OVERRIDE:

```bash
# ❌ WRONG - env.base's E2E_TEST_MODE=false overrides shell var
E2E_TEST_MODE=true op run --env-file=env.base -- npx nx serve

# ✅ CORRECT - Put overrides AFTER the -- separator
op run --env-file=env.base -- E2E_TEST_MODE=true npx nx serve
```

**CRITICAL**: Use Nx MCP's nx_workspace or nx_docs tools for workspace/project info.

## 🌊 Ocean (Nx Cloud) Specifics

### Branch & PR Base

- **Ocean PRs target `main`, NOT `master`.** The harness session gitStatus hint says "Main branch: master" and `origin/HEAD` -> `master`, but `master` is long-divergent (a PR against it shows ~2900 commits / 3000+ files). `origin/main` is the real integration tip; feature branches are cut from it.
  - **Why:** Q-503 - opened draft PR #11962 against `master` from the bad hint; Jack caught the 2919-commit diff. Fix: GitHub UI Edit base -> main (no GH token in sandbox, `gh` removed; or `PATCH /repos/nrwl/ocean/pulls/<n>` `{"base":"main"}`). Also saved as memory `feedback-ocean-pr-base-is-main`.

### Commit Scopes

- Use the **library/project name** as scope, not the app name
  - ✅ `fix(client-bundle):` for changes in `libs/nx-packages/client-bundle/`
  - ❌ `fix(nx-cloud):` — too broad, `nx-cloud` is the app, not the library

### Version Plans (feat/fix PRs)

Ocean PRs with `feat` or `fix` commits **may** require a version plan at `.nx/version-plans/`:

```markdown
# .nx/version-plans/yyyy-mm-dd-hh-mm-descriptive-name.md

---

## nx-cloud: fix

Customer-facing changelog description.
```

Options: `fix`, `minor` (feature), `patch`. Not needed for `chore`/`docs` commits.

**Skip the version plan when the related feature already has a plan in the same unreleased cycle.** Run `ls .nx/version-plans/ | grep -i <feature>` first. If the feature hasn't shipped to prod, the fix is part of that unreleased work — a second plan just adds a noise changelog entry. Only add a `fix:` plan against an already-released prod feature.

- **Why:** Q-443 — added two `fix:` plans for sandbox-violation polish on top of the unreleased feature plan (PR #11249). Both got removed.

### E2E Testing

```bash
# Start server in e2e mode (fake credentials, no 1Password needed)
nx serve nx-cloud --configuration=e2e  # port 4202

# Run tests
nx run nx-cloud-e2e-playwright:e2e --grep "pattern"
```

The `--configuration=e2e` loads `.env.serve.e2e`. Don't use `op run` with e2e mode.

### Design Conformance (CRITICAL for any Ocean UI work)

- A design mock / Claude Design bundle is **NOT** authoritative over the committed `DESIGN.md` gates. Mocks can request what `DESIGN.md` bans (gradient text/fill, glassmorphism backdrop, modal-as-default).
- Before marking ANY Ocean UI done, run the `DESIGN.md` §7 Pre-Ship checklist. Common misses: #8 (colors must resolve to declared tokens - no ad-hoc oklch), #9 (no gradient text), #5 (no backdrop blur), "modals are last resort".
- Surface intentional deviations in chat up front, not in a code comment. Default to the token-based, calm treatment unless I approve the override.
  - **Why:** Q-484 - built add-on callouts with gradients + blur modal from the mock; had to rework to bordered token cards.

### Local manual testing of flag-gated features

- Many Ocean features gate on an env-fallback flag set ONLY in `apps/nx-cloud/.env.serve.e2e` (e.g. `NX_CLOUD_ADD_ONS_ENABLED`, `NX_CLOUD_SANDBOXING_ANALYTICS_ENABLED`). A normal local serve leaves them unset (PostHog flag off) so the feature stays hidden on any plan.
- To test locally: add the flag(s) to `env.override` (gitignored) and **restart the serve** (env is read at startup). Also check `NX_CLOUD_MODE` is not `private-enterprise`.

### Typecheck when nx is unavailable

- The `@nx/gradle` plugin needs `gradlew`; if Gradle/Java isn't available the nx project graph fails and ALL `nx` commands break. Fall back to `npx tsc -b libs/.../tsconfig.lib.json` (build mode builds project refs + gives real errors) per touched project.
  - **Run `tsc -b` (and prettier) from the repo root with full `libs/...` paths.** The args are cwd-relative, so chaining after a `cd libs/X` (e.g. `cd libs/X && jest ...; npx tsc -b libs/X/...`) doubles the path -> `error TS5083: Cannot read file '.../libs/X/libs/X/tsconfig.lib.json'`. The Bash-tool cwd also resets between calls, so don't rely on a prior `cd`. Run jest-in-lib and tsc-from-root as separate commands.
- For rendering/screenshotting a single Ocean component in isolation, use the `ocean-component-shot` skill.
