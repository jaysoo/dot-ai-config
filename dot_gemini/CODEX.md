# Jack Hsu's Codex CLI Configuration
Jack Hsu (jack.hsu@gmail.com) | Nx CLI Contributor | Eastern Timezone | Be terse, not overly friendly

## 🔴 Critical Setup & Verification

### .ai Folder Symlink (MUST CHECK FIRST)
```bash
# Verify symlink (not directory!)
file .ai  # Must show "symbolic link"

# Fix if needed:
[ -d .ai ] && cp -r .ai /tmp/backup-ai-$(date +%Y-%m-%d) && rm -rf .ai
ln -s $HOME/projects/dot-ai-config/dot_ai/ .ai
```

### Git Workflow
- **Never commit to main/master** - always use feature branches
- **Always squash commits** before pushing: `git reset --soft HEAD~n && git commit`
- **Commit format must match PR template** (check `.github/PULL_REQUEST_TEMPLATE.md`)
- **NEVER push branches or create PRs unless explicitly asked** - User will handle push and PR creation
- Linear issues: Use `DOC-125` format (no # prefix)
- GitHub issues: Use `Fixes #123` format

Example commit:
```bash
git commit -m "fix(scope): brief description

## Current Behavior
...
## Expected Behavior
...
## Related Issue(s)
Fixes DOC-125"
```

### Handling Commit Message Rejections
When commit message is rejected:
- Use `docs(misc)` for documentation-only changes across multiple packages
- Don't use project-specific scopes like `docs(astro-docs)` for cross-cutting concerns
- If you need to fix commit message: use `--amend` to avoid multiple commits
- Common scopes: `docs(misc)`, `test(misc)`, `chore(misc)` for multi-project changes

### Date & Time
- Always use ET timezone: `date '+%Y-%m-%d'` or `date '+%Y-%m-%d %H:%M'`
- Task files go in `.ai/yyyy-mm-dd/tasks/` with current date

## 📋 Task Management

### Starting Tasks
1. Create .ai symlink if missing
2. Read full issue description (Linear/GitHub) - never assume from title
3. Create task plan: `.ai/yyyy-mm-dd/tasks/descriptive-name.md`
4. Update plan as you work
5. Track in `.ai/TODO.md` with timestamps

### Task Files & Workflow
- Plan tasks: Follow `~/.codex/commands/plan-task.md`
- Dictation: Follow `~/.codex/commands/dictate.md`
- Architecture docs: `.ai/architectures/[repo]-architecture.md`
- Daily summaries: `.ai/yyyy-mm-dd/SUMMARY.md`

**Complete Workflow**: Verify → Stage (`git add`) → Check count → Squash → Commit with template → Verify

### Task TODO Format

The `dot_ai/TODO.md` file tracks **In Progress** tasks only. When a task is completed, move it to `.ai/para/archive/COMPLETED.md` instead of keeping it in TODO.md.

**TODO.md format:**
```markdown
## In Progress
- [ ] Name of task (yyyy-mm-dd hh:mm)
  - Plan: `dot_ai/yyyy-mm-dd/tasks/name-of-task.md`
  - Goal: The goal according to planned task
```

**COMPLETED.md format** (organized by month):
```markdown
## Completed

### January 2026

- [x] Name of task (yyyy-mm-dd)
  - Plan: `dot_ai/yyyy-mm-dd/tasks/name-of-task.md`
  - Summary: Brief description of what was accomplished

### December 2025
...
```

**When completing a task:**
1. Remove the task from `dot_ai/TODO.md`
2. Add it to `.ai/para/archive/COMPLETED.md` under the appropriate month section

## 🔍 MCP Server Usage (Priority)

**ALWAYS use MyNotes MCP first for:**
- Personal content: notes, tasks, specs, TODOs
- Previous work history
- Searching saved documentation

### Quick Reference
- `mcp__MyNotes__search_ai_content` - Search all content
- `mcp__MyNotes__get_task_context` - Resume specific task
- `mcp__MyNotes__find_specs` - Find specifications
- `mcp__MyNotes__extract_todos` - Find TODO items

**Gemini collaboration**: Use the `gemini-collab` skill (shells out to the `gemini` CLI in headless mode) for fact-checking, code review, and deep research. The old `mcp__gemini-*` MCP tools have been retired — use the skill instead.

### MCP Trigger Phrases
**MyNotes triggers**: "my notes", "my tasks", "previous work", "what did I work on", "find my", "search my"

**Priority**: Personal content → MCP tools | Project files → File tools | General → Answer directly

### Linear MCP
- Always confirm team: "Nx CLI" (NXC-) vs "Nx Cloud" (CLOUD-)
- Get team ID first: `mcp__Linear__list_teams`
- Use pagination (limit: 30-50) to avoid token errors
- Date calculations: "3 months ago from Aug 19" = May 19 or earlier

### Common Mistakes
- Assuming "Linear issues" = one team (always clarify)
- Wrong staleness calc (Aug 19 - 3mo = May 19 or earlier is stale)
- `updatedAt` filters ON/AFTER date (not before)
- For documentation-only changes, use `docs(misc)` scope, not project-specific scopes like `docs(astro-docs)`

## 💻 Development Preferences

### Philosophy
- **Simple > Complex** - Try Tailwind/CSS before JavaScript
- **Debug first, fix second** - Understand the actual problem before implementing
- **One property > Many hacks** - Check if single CSS property solves the issue
- **Ask before assuming** - Multiple approaches? Ask preference
- **Iterate, don't defend** - Change based on feedback
- **Code > Comments** - Self-documenting code, minimal comments

### Component Development Order
1. Simple Tailwind classes (Grid/Flexbox)
1.5. Check if CSS in global stylesheets can solve the problem
1.6. For alignment issues, try basic flexbox properties first (align-items, justify-content)
2. Get feedback before complexity
3. JavaScript only if CSS fails
3.5. Component overrides only as last resort (especially for third-party components like Starlight)
4. Listen to user preferences

### Common Pitfalls
- Arbitrary Tailwind selectors (`[&>*:first-child]:`) unreliable
- Don't default to JavaScript for CSS-solvable problems
- Tab/list alignment issues: Try `align-items: end` before complex margin/border hacks
- Avoid creating horizontal scrolling when vertical alignment is the actual issue
- Always verify file paths exist before using
- Ask for dev server port (don't assume 4200, 3000, etc.)
- Transformation functions appear to work partially: Check for malformed source files
- Regex patterns failing silently: Validate input structure first
- Cache issues with Astro: Always clear `.astro` folder when debugging transformations

## 📚 Documentation Sites (Astro/Starlight)

### Key Concepts
- **Frontmatter title = h1** (never duplicate with content h1)
- **Sidebar labels** can differ from page title
- **Search only in production** builds (not dev server)
- **Code blocks ≠ headings** (# in shell scripts isn't markdown h1)

### Testing
- Build first: `nx run PROJECT:build`
- Serve static: `npx serve dist -p 8000` (use `-p` not `--port`)
- Use Playwright MCP for UI verification

### Testing Content Transformations
- Use `curl -s URL | grep "pattern"` to check rendered HTML
- Clear cache between tests: `rm -rf .astro dist`
- Test individual files with Node scripts before full integration
- Check for both presence and absence of patterns

### Markdoc Components
- Use underscores: `side_by_side` not `side-by-side`
- Inline JSON directly (no code block wrappers)
- Never escape template blocks: `{% %}` not `\{% %\}`

### Astro/Markdoc JSON Handling
- **JSON in graph/project_details tags**: Use code fences (```json) not inline JSON
- **Escaped quotes issue**: Markdown processors strip escape characters before reaching React
- **Data-code attribute**: When using code fences, JSON is available in `data-code` attribute
- **HTML entity decoding**: Handle all variations (named: &quot;, decimal: &#34;, hexadecimal: &#x22;)
- **SSR compatibility**: Use regex to extract data-code, not DOM parsing
- **Test both client and server**: Different HTML entity encodings may be used

### Markdoc to Starlight Migration
When converting Markdoc syntax to Starlight:
- `{% tabs %}...{% /tabs %}` → Convert to headers (#### Tab Label)
- `{% callout type="X" %}` → Map to Starlight asides (:::note, :::tip, :::caution, :::danger)
- `{% graph %}` → Remove entirely (not supported in Starlight)

**Common Issues:**
- Missing closing tags cause regex failures
- Some files may have orphaned opening tags
- Run validation before transformation

### Header Component Structure
- Main header: `src/components/layout/Header.astro`
- Mobile menu sidebar: `src/components/layout/PageFrame.astro`
- Theme switcher in mobile handled by Starlight - DO NOT duplicate
- Import Starlight components: `import Component from 'virtual:starlight/components/ComponentName'`

### Responsive Design Best Practices
- **Element priority for overflow prevention:**
  1. Visibility priority (what stays visible first): Theme > CTAs > Social
  2. Visual order (left to right): Can differ from visibility priority
- **Tailwind breakpoints:**
  - `md`: 768px, `lg`: 1024px, `xl`: 1280px, `2xl`: 1536px
- **Testing:** Check all intermediate breakpoints (1000px, 1100px, 1200px, 1300px, 1400px)
- **Mobile menu:** CTAs at bottom, don't duplicate desktop elements

### Tab Component Fixes
- **Tab alignment issues**: Use `align-items: end` on `[role="tablist"]`
- **Don't overcomplicate**: Single CSS property often beats 40+ lines of "fixes"
- **Test without media queries first**: Many fixes work across all screen sizes

### Common Astro/Starlight Mistakes
- ❌ Don't duplicate theme switcher in mobile menu
- ❌ Don't assume all UI elements are in Header.astro
- ❌ Don't use lg:hidden when you mean xl:hidden
- ❌ Don't override entire Starlight components for simple style fixes
- ❌ Don't add complex horizontal scrolling for simple vertical alignment issues
- ❌ Don't use !important in global.css to override Starlight styles
- ❌ Don't assume markdown files are well-formed - check for missing closing tags
- ❌ Don't create complex regex to handle malformed input - fix the source
- ❌ Don't use inline JSON in Markdoc tags when it contains escaped quotes
- ❌ Don't try to escape quotes in JSON - markdown processors strip escapes
- ✅ Check what Starlight provides by default first
- ✅ Test actual viewport widths user mentions, not just breakpoints
- ✅ Prefer CSS fixes in global.css over component overrides
- ✅ Use CSS selectors like `starlight-menu-button button` for third-party component styling
- ✅ Use `[data-theme='dark']` selector for dark mode specific styles
- ✅ Use Tailwind theme colors `theme('colors.slate.600')` for consistency
- ✅ Validate markdown structure before transformations
- ✅ Clear Astro cache (`.astro`) when transformations aren't reflecting
- ✅ Use code fences for JSON in graph/project_details tags
- ✅ Extract shared parsing logic to utility functions

## 🏗️ Nx Monorepo Patterns

When starting any work, ALWAYS use a subagent to run `pnpm install` and `pnpm build` in the 
background because subsequent commands will need those so it's better to get it out of the way in parallel.

### Commands
- Use `nx run PROJECT:target` not `npm run`
- Avoid full builds for testing (use dev servers)
- Project-specific typecheck: `nx run PROJECT:typecheck`

### Adding Dependencies in Nx Projects
- **ALWAYS run `nx sync` after modifying any package.json** - This updates inferred targets and workspace configuration
- Sequence:
  1. Modify package.json
  2. Run `nx sync`
  3. Stage and commit changes
- Missing `nx sync` will cause workspace inconsistencies

### Nx Testing Conventions
- **Use `.spec.ts` extension** - Not `.test.ts` for test files
- **Vitest configuration**: Create `vitest.config.ts` in project root
- **Nx Vite plugin**: Add project to nx.json's Vite plugin includes for inferred targets
- **Don't hardcode test targets**: Let Nx Vite plugin infer from vitest.config.ts
- **Test target behavior**: Nx may auto-add test targets with dependencies
- **Component parsing tests**: Test all HTML entity variations (&quot;, &#34;, &#x22;)
- **SSR compatibility tests**: Verify functions work without DOM access

Example vitest.config.ts:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  }
});
```

### Project Structure
- `nx-dev/ui-common/` - shared components
- `astro-docs/` - standalone docs site
- Check `project.json` for available targets

### Common Issues
- TSC errors in isolation normal (use project-level checks)
- Stuck processes: `lsof -i :PORT` then `kill PID`
- File reversions = linting/formatting (verify with `git diff`)

### Nx Docker Plugin (@nx/docker)
- **Target Naming**: Use `docker:build` not `docker-build`
- **Dockerfile Requirements**:
  - MUST be named exactly `Dockerfile` (not `*.dockerfile`)
  - Located in project root directory
  - For sub-projects, create separate project.json files
- **Docker Build Configuration** - minimal needed:
  ```json
  "docker:build": {
    "options": {
      "cwd": "",  // Build from workspace root
      "file": "apps/myapp/Dockerfile"
    }
  }
  ```
  - No executor needed - inferred by plugin
  - No command needed - handled by plugin
  - `nx-release-publish` target is auto-inferred
- **Java/Kotlin Projects**:
  - Add `skipVersionActions: true` in release config
  - These projects don't have package.json files
  - Create temporary package.json for testing if needed

### Creating Sub-Projects
- For apps with multiple Docker images (like workflow-controller):
  - Create sub-directories with own project.json
  - Use descriptive names (e.g., nx-cloud-workflow-executor)
  - Each needs minimal project.json with docker:build target

### Docker/Nx Common Mistakes
- ❌ Using `docker-build` instead of `docker:build`
- ❌ Keeping `.dockerfile` extension instead of `Dockerfile`
- ❌ Forgetting to update buildAndPush when updating build paths
- ❌ Using full executor config when only options are needed
- ❌ Not checking if Docker builds from project vs workspace root
- ❌ Using `.test.ts` extension - use `.spec.ts` for consistency
- ❌ Installing test dependencies in project package.json if already in root
- ❌ Hardcoding test targets when Nx plugins can infer them
- ❌ Forgetting to run `nx sync` after adding/removing dependencies in package.json
- ✅ Configure Nx Vite plugin in nx.json for projects using Vitest
- ✅ Let Nx manage test target dependencies automatically
- ✅ Always run `nx sync` immediately after package.json changes, before committing

## ✅ Verification

### Before Claiming Complete
1. Verify changes applied: `git status && git diff`
2. Check ALL file types (`.md`, `.mdx`, `.mdoc`) - don't assume scope
3. Run verification scripts + simple grep: `grep -r "^#\s" --include="*.md"`
4. Verify actual count matches expectations
5. For date tasks: Document calculation, test examples

### Easy Tasks (Skip Heavy Verification)
- Simple markdown edits
- Typo fixes
- Content updates
→ Use bash/node scripts without dependencies

## 🚀 Quick Fixes

### Git Worktrees
- `.ai` symlink still points to main config
- Branch names match issue IDs
- Separate checkout from main repo
- `.ai` folder should be in worktree root (e.g., `/Users/jack/projects/nx-worktrees/DOC-184/.ai/`)
- Architecture files use main repo name: `nx-architecture.md` not `DOC-184-architecture.md`
- When reflecting, recognize worktree structure: `nx-worktrees/BRANCH-NAME/`

### Next.js Issues
- Env vars replaced at BUILD time, not runtime
- Redirects execute before rewrites
- Link components use client routing (update href directly)
- After file changes, wait 5-10 seconds for rebuild before verification
- Check build output in background processes for errors
- Fast Refresh may require full reload for environment variable changes

### URL Migration Patterns (Nx Docs)
- Use conditional rendering for documentation links during migration:
  ```tsx
  href={process.env.NEXT_PUBLIC_ASTRO_URL ? "/docs/new-path" : "/old-path"}
  ```
- This prevents 308 redirects while maintaining backward compatibility
- Apply to TextLink, Link, and ButtonLink components
- Always verify with script checking all non-doc pages
- Check redirect-rules-docs-to-astro.js for correct new paths

### Ocean Scoring
- Location: `~/projects/ocean/tools/scripts/scorecards/nx-dev-search-score.ts`
- Use official keywords (35 across 6 categories)
- Formula: `(10 × points) / (keywords × 3)`
- Flexible URL matching (path variants OK)

## 📝 Script Development & Investigation

### Script Development & File Discovery
1. Test on 1-2 files first
2. Handle edge cases (code blocks, escaping)
3. Create verification scripts
4. Avoid external dependencies initially
5. Store in `.ai/yyyy-mm-dd/tasks/`
6. File discovery: Start with `ls` in likely dirs → `find -name "*.sh" -o -name "*.ts"`

### Debugging Text Transformations
When regex transformations aren't working:
1. **Check source data first** - Malformed input will cause silent failures
2. **Test regex in isolation** - Use simple Node scripts to verify patterns
3. **Count opening/closing tags** - Ensure balanced pairs before transformation
4. **Fix source files** - Better than making regex handle edge cases

Example debugging script:
```javascript
const content = fs.readFileSync('file.md', 'utf-8');
const openCount = (content.match(/\{% tabs %\}/g) || []).length;
const closeCount = (content.match(/\{% \/tabs %\}/g) || []).length;
console.log(`Open: ${openCount}, Close: ${closeCount}`);
```

### Verification Scripts Best Practice
- Always create verification scripts for systematic changes
- Check localhost directly, not production URLs
- Filter out expected pages (e.g., documentation pages when checking non-doc pages)
- Use Node.js scripts for cross-platform compatibility
- Clean up temporary scripts after verification
- Store scripts in `.ai/yyyy-mm-dd/tasks/` for future reference

### Moving Files in Monorepos
- When moving Dockerfiles or similar files, update ALL references:
  - package-scripts.js (all build AND buildAndPush commands)
  - GitHub workflows
  - Documentation
- Use `grep` to find all occurrences before moving
- Check both `build` and `buildAndPush` sections separately

### Investigation Documentation
- Include line numbers (e.g., file.sh:22-31)
- Document complete flow (what calls what)
- Show relationships between files
- Include current values/formats before changes
- Update `.ai/architectures/[repo]-architecture.md` after

### URL Generation from File Paths
- **Lowercase all segments**: `CI Features` → `ci-features`
- **Replace special chars with dashes**: spaces, underscores → dashes
- **Remove file extension**: `.mdoc` → (nothing)
- **Examples**:
  - `features/CI Features/split-e2e-tasks.mdoc` → `/docs/features/ci-features/split-e2e-tasks`
  - `concepts/mental-model.mdoc` → `/docs/concepts/mental-model`

## 🔧 Debugging Tips

### URL Redirect Testing
- Test with `curl -I -L http://localhost:PORT/path`
- Check both relative and absolute paths
- Verify with real browser (Playwright)
- Document working vs failing cases

### Common Issues
- Search issues: Must use production build
- Component hrefs: Update for Link navigation
- Conflicting rules: Check `redirect-rules.js` + `next.config.js`
- File reversions: Usually linting/formatting (check `git diff`)
- Stuck nx-dev processes: `lsof -i :4200 | grep LISTEN` then `kill PID`
- Client vs Server nav: Link components use client routing, not server redirects

### Content Migration Analysis
- Check map.json or routing config first
- Content reorganizes: `/recipes/*` → `/docs/technologies/{tech}/Guides/*`
- Multiple old pages may merge into single new pages
- Verify file existence before assuming 404s

