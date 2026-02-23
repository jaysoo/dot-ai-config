# DOC-405: Apply AX Improvements to Getting Started Pages

**Based on**: `.ai/2026-02-11/tasks/DOC-405-ax-getting-started.md`
**Date**: 2026-02-12
**Status**: Planning

## Overview

Apply the AX (Agentic Experience) spec improvements to the 5 remaining Getting Started pages (intro.mdoc already done).

**Key principle**: Each page should be focused. No duplication across pages. Follow Turborepo's clean separation.

---

## 1. installation.mdoc

**Current Issues**:
- Page tries to cover too much (global install, `nx init`, CNW, updating)
- Mentions `create-nx-workspace` which belongs on start-new-project page
- No verification step

**New Focus**: ONLY installation (global + local). Nothing about new projects.

**Changes**:

### Restructure page to have two clear sections:
1. **Global Installation** (recommended) - npm/brew/choco/apt tabs
2. **Install in a Repository** - `nx init` to add Nx to an existing workspace

### Remove these sections (they belong elsewhere):
- "Starter Repository" section mentioning `create-nx-workspace` → belongs on start-new-project.mdoc
- "Tutorials" section → belongs on intro.mdoc or tutorials index
- "More Documentation" section → trim or remove

### Add verification step
```markdown
## Verify Installation

\`\`\`shell
nx --version
\`\`\`

You should see a version number like `20.3.0`.
```

### Keep Update section (it's relevant to installation)

---

## 2. editor-setup.mdoc

**Current Issues**:
- Missing problem hook - why should users bother?
- Neovim disclaimer may confuse AI about what's official

**Changes**:

### Add problem hook at top (after frontmatter)
```markdown
Running CLI commands manually and discovering available tasks is tedious. You lose context switching between terminal and editor, and it's easy to forget which commands are available for each project.

Nx Console brings Nx directly into your editor with a visual UI, task discovery, and AI assistance.
```

### Clarify Neovim section
Change from:
> This plugin is **NOT** built or maintained by the Nx team.

To:
> **Community Plugin**: This plugin is maintained by independent community contributors, not the Nx team.

---

## 3. ai-setup.mdoc

**Current Issues**:
- Missing problem hook
- "MCP server" mentioned without explanation
- "Ralph Wiggum loop" is insider jargon
- Skills installation unclear about what it does

**Changes**:

### Add problem hook at top (after frontmatter)
```markdown
AI coding assistants often hallucinate outdated Nx commands and lack context about your workspace structure. Without workspace awareness, they suggest commands that don't exist or miss project relationships.

Nx's AI integration gives assistants accurate, real-time information about your workspace, projects, and available commands.
```

### Explain MCP briefly where first mentioned
Change line ~27 to add context:
> ...set up the [Nx MCP server](/docs/features/enhance-ai) (Model Context Protocol - a standard for giving AI assistants tool access), AI agent configuration files...

### Clarify "Ralph Wiggum loop" reference
Change:
> Enables "Ralph Wiggum loop" patterns where you review the final PR, not every CI hiccup.

To:
> Enables autonomous CI workflows where the agent iterates on failures until CI passes ("Ralph Wiggum loop")—you review the final PR, not every intermediate fix.

### Add AI prompt callout after "Automatic AI Setup" section
```markdown
{% callout type="tip" title="AI Prompt" %}
Copy this prompt to your AI assistant:

> Set up the Nx MCP server so you have access to my workspace context and up-to-date Nx documentation.
{% /callout %}
```

---

## 4. start-new-project.mdoc

**Current Issues**:
- Option 1 (manual setup with `nx init`) doesn't belong here - that's for existing projects
- Option 2 says "presets" but CNW now uses "templates"
- No clear decision criteria between options

**New Focus**: Creating NEW workspaces only. No `nx init` (that's for existing projects).

**Changes**:

### Remove Option 1 (Manual setup)
The manual setup with `nx init` belongs on "Add to Existing Project" page, not here. This page is for NEW projects.

### Restructure to two options:
1. **Create locally with templates** (`create-nx-workspace`) - quick starters with predefined projects
2. **Create via Nx Cloud** - browser-based setup with CI pre-configured

### Update terminology
- "Presets" → "Templates" throughout

### Add decision criteria
```markdown
**Which option should I choose?**
- **Option 1 (Local)**: You want to create a new monorepo on your machine with starter templates
- **Option 2 (Nx Cloud)**: You want to create your workspace in the browser with CI/CD pre-configured
```

### Add AI prompt callout
```markdown
{% callout type="tip" title="AI Prompt" %}
Copy this prompt to your AI assistant:

> Create a new Nx workspace for me. Ask me what tech stack I want to use.
{% /callout %}
```

---

## 5. start-with-existing-project.mdoc

**Current Issues**:
- Page is bloated with content that belongs elsewhere
- Duplicates: editor setup, CI examples, Nx Cloud walkthrough
- `nx@latest init` command needs `npx`

**New Focus**: Just the core flow: `nx init` → run a task → see caching → explore with `nx graph`. Link to other pages for everything else.

**Changes**:

### Keep these sections:
- Intro paragraph about incremental adoption
- Video embed
- `nx init` command (fix to `npx nx@latest init`)
- Brief "Next Steps" with commands (`nx build`, `nx graph`, `nx show projects`)

### Remove these sections (link instead):
- **"Update CI Configurations"** → Replace with single link: "See [CI Setup Guide](/docs/guides/nx-cloud/setup-ci)"
- **"Nx Cloud"** section → Replace with single line: "Enable remote caching with `nx connect`. [Learn more](/docs/features/ci-features/remote-cache)"
- **"Empower Your Editor"** → Remove entirely (there's already an Editor Setup page in the sidebar)

### Keep "In-depth Guides" links at bottom (they're useful)

### Add AI prompt callout
```markdown
{% callout type="tip" title="AI Prompt" %}
Copy this prompt to your AI assistant:

> Add Nx to this project. After setup, run `nx graph` to explore the structure and show me how caching works.
{% /callout %}
```

---

## Verification

After making changes:

1. Run `nx serve astro-docs` and check each page renders correctly
2. Verify all links work
3. Check that code blocks are properly formatted
4. Review in browser for readability

## Files to Modify

- `astro-docs/src/content/docs/getting-started/installation.mdoc`
- `astro-docs/src/content/docs/getting-started/editor-setup.mdoc`
- `astro-docs/src/content/docs/getting-started/ai-setup.mdoc`
- `astro-docs/src/content/docs/getting-started/start-new-project.mdoc`
- `astro-docs/src/content/docs/getting-started/start-with-existing-project.mdoc`
