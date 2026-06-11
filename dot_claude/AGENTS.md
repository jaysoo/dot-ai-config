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
