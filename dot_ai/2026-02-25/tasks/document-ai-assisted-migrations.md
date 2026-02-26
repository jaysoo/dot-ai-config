# Plan: Document AI-Assisted Migrations Feature

## Context

Nx migrations can now generate markdown instruction files (in `tools/ai-migrations/`) that AI agents can use to complete migration steps that can't be fully automated. Five plugins already ship these: Storybook 10, Vitest 4, Next.js 16, Nuxt 4, and Expo 54. The only existing documentation is 4 lines in the Storybook upgrade guide. There's no general explanation of the pattern, how to use it, or how plugin authors can add their own.

## Approach

Add an "AI-Assisted Migrations" section to `enhance-AI.mdoc` and a brief cross-reference from `automate-updating-dependencies.mdoc`. This keeps AI features consolidated on the AI hub page while making migration users aware the feature exists.

### 1. Add section to `astro-docs/src/content/docs/features/enhance-AI.mdoc`

Add a new `### AI-Assisted Migrations` subsection under "What This Enables" (after "Predictable, Fast Code Generation"). Content:

- Explain the concept: some breaking changes can't be fully automated by codemods, so Nx migrations generate structured markdown files with instructions for AI agents
- Where they appear: `tools/ai-migrations/` directory after running `nx migrate --run-migrations`
- How to use them: point your AI agent at the file, it follows the step-by-step instructions
- Current plugins that generate them (Storybook, Vitest, Next.js, Nuxt, Expo)
- Link to migration-generators page for plugin authors who want to add their own

### 2. Add aside to `astro-docs/src/content/docs/features/automate-updating-dependencies.mdoc`

After Step 2 (Run Migrations), add a brief aside mentioning that some migrations generate AI instruction files, linking to the enhance-AI page for details.

### 3. Add brief section to `astro-docs/src/content/docs/extending-nx/migration-generators.mdoc`

Add a section at the end for plugin authors explaining how to create a migration that generates AI instruction files, with the pattern used by existing plugins (read template MD, write to `tools/ai-migrations/`, return message strings).

## Files to modify

1. `astro-docs/src/content/docs/features/enhance-AI.mdoc` — new subsection
2. `astro-docs/src/content/docs/features/automate-updating-dependencies.mdoc` — aside
3. `astro-docs/src/content/docs/extending-nx/migration-generators.mdoc` — new section

## Verification

- `nx serve astro-docs` and check all three pages render correctly
- Verify internal links resolve
