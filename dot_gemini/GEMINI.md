# Jack Hsu's Gemini Configuration
Jack Hsu (jack.hsu@gmail.com) | Nx CLI Contributor | Eastern Timezone | Be terse, not overly friendly

**IMPORTANT**: This file lives in `~/projects/dot-ai-config/dot_gemini/GEMINI.md` and syncs to `~/.gemini/GEMINI.md`. Always edit the `dot-ai-config` version.

## 🔴 Critical

In any new session, ALWAYS use /caveman skill to go into full (default) cavement mode. Let me know and I can tell you to turn it off if needed or switch to other modes.

## 🔴 Critical Setup & Verification

### dot-ai-config is the Source of Truth
- **NEVER edit files directly in `~/.gemini/`** — those are synced copies
- **NEVER edit dotfiles directly in `~/.config/` or `~/`** — kitty, fish, nvim, mise, gitconfig, gitignore_global, tmux.conf are all synced copies
- **Always edit in `~/projects/dot-ai-config/`** then sync
- Skills: `~/projects/dot-ai-config/dot_gemini/skills/` (NOT `~/.gemini/skills/`)
- Commands: `~/projects/dot-ai-config/dot_gemini/commands/` (NOT `~/.gemini/commands/`)
- **If about to edit `~/.gemini/` or any synced dotfile**, invoke the `dot-gemini-guard` skill first
- **After invoking any skill or command**, update `~/projects/dot-ai-config/USAGE.md` with the invocation date and count

### .ai Folder Symlink (MUST CHECK FIRST)
```bash
file .ai  # Must show "symbolic link"
# Fix if needed:
[ -d .ai ] && cp -r .ai /tmp/backup-ai-$(date +%Y-%m-%d) && rm -rf .ai
ln -s $HOME/projects/dot-ai-config/dot_ai/ .ai
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

### Git Workflow
- **🔐 NEVER commit tokens, secrets, or API keys**
- **Never commit to main/master** - use feature branches
- **Always squash commits** before pushing: `git reset --soft HEAD~n && git commit`
- **NEVER push main/master branches directly unless instructed** - use branches and PRs
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

**CRITICAL**: Never co-author the commit, the commit MUST come only from me. Also do not mention yourself (Gemini CLI) in the commit body.

**Commit body style**: Keep bodies terse (caveman style applies to commits too, despite the caveman skill's default carve-out). Still use the Nx template sections, but each section should be 1–3 short sentences/fragments. No filler, no restating the same idea twice, no marketing recap. A reader should skim the whole body in under 15 seconds.

### Pre-Push Validation (Nx Repo)
- **ALWAYS run `nx affected -t build-base,lint,test` locally before pushing** — CI failures that could be caught locally waste time and require workflow approvals on fork PRs
- For community PRs from forks, each push requires manual workflow approval — minimize push iterations
- Run relevant e2e tests locally (`nx run e2e-vite:e2e-local -- --testPathPatterns='...'`) before pushing e2e-related changes

### GitHub PR Reviews
- **NEVER post reviews, comments, or approvals on GitHub PRs unless explicitly instructed**
- Analysis plans with scores/recommendations are NOT authorization to act on PRs
- "MERGE AS-IS" in a plan means "this is ready" -- NOT "go approve it"
- Always confirm before: `gh pr review`, `gh pr comment`, `gh pr merge`
- This applies even when the plan was provided by the user

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
5. **Add to Active Gemini Sessions** in TODO.md with working directory and branch

**IMPORTANT**: Task plan files go in `.ai/yyyy-mm-dd/tasks/`, NOT `~/.gemini/plans/`.
- `~/.gemini/plans/` = Gemini CLI's built-in plan mode (system-managed)
- `.ai/yyyy-mm-dd/tasks/` = Jack's task documentation convention (what you should use)

When completing tasks, always copy/move the plan to `.ai/` folder for long-term reference.

### Active Session Tracking (IMPORTANT)
- **Every task** must be added to the "Active Gemini Sessions" section in TODO.md at start
- Format: `- /path/to/working/dir (branch: branch-name) — description (date)`
- **When completing a task**: remove from Active Gemini Sessions, add to COMPLETED.md
- Sessions are considered stale after 7 days — clean up on next visit

### Key Paths
- Plan tasks: `~/.gemini/commands/plan-task.md`
- Dictation: `~/.gemini/commands/dictate.md`
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
2. **Remove** from "Active Gemini Sessions" in TODO.md
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

| Category | Has End Date? | Examples |
|----------|---------------|----------|
| **Projects** | ✅ Yes | Ship feature, Complete migration, Write RFC |
| **Areas** | ❌ No | Personnel management, Team syncs |
| **Resources** | ❌ No | Architecture docs, Scripts |
| **Archive** | N/A | Completed projects, Outdated docs |

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

| Tool | Purpose |
|------|---------|
| `mcp__MyNotes__search_ai_content` | Search all content |
| `mcp__MyNotes__get_task_context` | Resume specific task |
| `mcp__MyNotes__find_specs` | Find specifications |
| `mcp__MyNotes__extract_todos` | Find TODO items |

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

## 📚 Documentation Sites (Astro/Starlight)

### Key Concepts
- Frontmatter title = h1 (never duplicate)
- Sidebar labels can differ from page title
- Search only in production builds
- Code blocks ≠ headings (# in shell scripts isn't markdown h1)

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

### Migration Testing
```bash
# ❌ WRONG - @next points to next major version
npx nx migrate @next

# ✅ CORRECT - explicit version
npx nx migrate 22.0.0-beta.7
```

**Steps:** migrate → install → run-migrations → **verify** `cat package.json | grep '"nx"'`

Always verify with `npm view nx@next version` before using tags.

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
const getNav = () => ({ items: [{ href: process.env.URL || '' }] });
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
const content = fs.readFileSync('file.md', 'utf-8');
console.log('Open:', (content.match(/\{% tabs %\}/g) || []).length);
console.log('Close:', (content.match(/\{% \/tabs %\}/g) || []).length);
```
Fix source files rather than making regex handle edge cases.

### Investigation Best Practices
- **Verify actual code path FIRST** - add logging to node_modules
- **Don't document theories as facts** - mark as "HYPOTHESIS: needs verification"
- **Endorsing another reviewer's code-logic-only claim**: if the claim is purely "the code does X, therefore Y will happen", reproduce Y before acting. Reading the code only validates the "does X" half; the "therefore Y" half needs a repro, a locally-published version, or a unit test. If uncertain, ask me to verify before proceeding rather than propagating an unverified prediction.
- Watch for multiple implementations (PTY vs spawn vs exec, native vs JS)
- **Verify the baseline before calling it a regression.** When you hear "this worked before, now it fails":
  1. First check whether the earlier "success" was actually a silent failure. Diff the script/workflow between the working and failing runs — look for exit-code checks, error swallowing, stdout parsing that might crash silently. A CI run showing green ≠ the thing actually worked.
  2. Only then look for real regressions.
  - **Why:** NXC-4353 — spent an hour chasing a "Nx 22.6 → 22.7 release code regression" that didn't exist. The Jan 8 dry-run "success" was a lie; the script returned 0 regardless of pnpm publish result until PR #10489 (Mar 24) added exit-code propagation. Bug had been there since Dec 3, just invisible.
- **Reproduce locally before recommending a CI fix.** When a CI failure has a deterministic, isolated signature (e.g. `ERR_PNPM_CANNOT_RESOLVE_WORKSPACE_PROTOCOL`), reproduce it on your machine before committing to a fix. Pattern-matching the error message against common causes (or having another model confirm your guess) frequently lands on the wrong root cause.
  - **Why:** NXC-4353 — recommended `pnpm.supportedArchitectures` based on the error phrasing, Gemini agreed, both wrong. One minute of local repro on Mac (where the "missing" darwin binary was already present) immediately disproved it.

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

### Common Issues
- Search: Must use production build
- Conflicting rules: Check `redirect-rules.js` + `next.config.js`
- Stuck processes: `lsof -i :4200 | grep LISTEN` then `kill PID`
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

### Commit Scopes
- Use the **library/project name** as scope, not the app name
  - ✅ `fix(client-bundle):` for changes in `libs/nx-packages/client-bundle/`
  - ❌ `fix(nx-cloud):` — too broad, `nx-cloud` is the app, not the library

### Version Plans (Required for feat/fix PRs)

Ocean PRs with `feat` or `fix` commits require a version plan at `.nx/version-plans/`:
```markdown
# .nx/version-plans/yyyy-mm-dd-hh-mm-descriptive-name.md
---
nx-cloud: fix
---

Customer-facing changelog description.
```
Options: `fix`, `minor` (feature), `patch`. Not needed for `chore`/`docs` commits.

### E2E Testing

```bash
# Start server in e2e mode (fake credentials, no 1Password needed)
nx serve nx-cloud --configuration=e2e  # port 4202

# Run tests
nx run nx-cloud-e2e-playwright:e2e --grep "pattern"
```

The `--configuration=e2e` loads `.env.serve.e2e`. Don't use `op run` with e2e mode.
