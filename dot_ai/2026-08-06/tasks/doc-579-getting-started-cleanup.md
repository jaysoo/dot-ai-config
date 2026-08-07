# DOC-579: Docs cleanup - intro, Start a New Project, Add to Existing Project

- Linear: https://linear.app/nxdev/issue/DOC-579
- PR: https://github.com/nrwl/nx/pull/36595 - MERGED as `130727796c`
- Branch: `DOC-579` (worktree `/Users/jack/projects/nx-worktrees/DOC-579`)
- Polygraph: `noble-osprey-dd3ebfa3`, single repo nrwl/nx

## Goal

De-emphasize Nx Cloud onboarding across the three getting-started entry points. First-time
users pick create-nx-workspace (CNW) or `nx init`; Cloud stays on the pages where it is the
subject (CI setup). Borrow the sample run timings and the copyable agent prompt from
cloud.nx.app/get-started before that page goes away.

## What shipped

- **`getting-started/start-new-project.mdoc`** - CNW only. Removed the "Option 2: Create via
  Nx Cloud" section and its screenshot asset. Opens with an `llm_copy_prompt` agent prompt,
  then one terminal block holding the command and its sample run. Template section no longer
  enumerates the four prompt starters (users see them in the prompt); it points at the gallery
  and shows `--template=nrwl/tanstack-start-template` as the skip-the-prompt example.
- **`getting-started/start-with-existing-project.mdoc`** - same shape for `nx init`. Dropped
  the "In-depth guides" section; the adoption guides survive as one bullet under Next steps.
- Both pages end with matching `## Next steps` (commands, then caching + plugins) and
  `## Keep learning` (tutorials, AI integrations, CI setup, video). Editor setup was swapped
  out for AI integrations + CI setup.
- **`getting-started/intro.mdoc`** - both `callout type="deepdive"` blocks folded into a
  single sentence each. Jack additionally trimmed the Nx Console table row, the task-runner
  code block, and several "Where to go from here" bullets, and reworded the Nx Plugins row to
  "generators, auto-configured projects and tasks, dependency detection" (no "executors").
- **`kb/nx-and-angular.mdoc`** - fixed two pre-existing dangling anchors
  (`#start-small-extend-as-you-grow` -> `#start-small-grow-as-needed`).
- **NEW `astro-docs/ec.config.mjs`** + 2 rules in `global.css` - Expressive Code plugin for
  prompt blocks.

## The prompt-block plugin

A fence marked ```` ```shell {% meta="prompt=true" %} ```` can hold a command and its output
in one block:

- `preprocessCode` strips the `$ ` prefixes before shiki runs, so the command is syntax
  highlighted exactly like any other `shell` block.
- `postprocessRenderedLine` re-adds the prompt as a `.shell-prompt` span and tags every other
  line `.is-output`. Both are muted to `--sl-color-gray-3` by two rules in `global.css`.
- `postprocessRenderedBlock` rewrites the copy button's `dataCode` to the commands alone, so
  Copy never hands over sample output.

## Gotchas hit (in order)

1. **EC options cannot live in `astro.config.mjs`.** The `<Code>` component used by
   `src/pages/templates/[slug].astro` requires them JSON-serializable, and a plugin is not.
   Build fails with an explicit "create a separate config file called `ec.config.mjs`".
2. **`ec.config.mjs` cannot import a `.ts` module.** Node loads it as plain ESM;
   astro-expressive-code catches the module-not-found, `continue`s, and returns `{}`. The
   config silently disappears with no error. Keep that file self-contained.
3. **hast normalizes `data-code` to `dataCode`.** Matching on the dashed name finds nothing.
4. **EC colors tokens via `span[style^='--']:not([class])`.** Adding a class to a span drops
   its syntax color - useful for the prompt span, and the reason output muting needs a real
   color rule rather than a class alone.
5. **`addStyles` from `postprocessRenderedLine` never reached the CSS bundle.** Moved the two
   rules to `src/styles/global.css`, where `:where()`-based EC selectors (zero specificity)
   lose cleanly.
6. **Markdoc validates fence attributes.** A bare `{% prompt=true %}` fails with "Invalid
   attribute: 'prompt'". The starlight-markdoc preset exposes a passthrough `meta` attribute,
   so `{% meta="prompt=true" %}` is the way in without touching `markdoc.config.mjs`.
7. **Opt-in, not auto-detect.** `kb/root-level-scripts.mdoc` has a captured transcript whose
   `$ node ./generateDocsSite.js` line is yarn echoing, not something to run. Auto-detecting
   `$ ` would have mangled it.

## Source material

The timings and both agent prompts came off the live cloud.nx.app/get-started page. The AI
prompt sits behind the "Set up with an AI agent" modal with separate tabs for init and CNW -
not in the page's initial DOM, so it needed a click. The Cloud prompts end in `nx connect` +
`nx-cloud onboard connect-workspace`; those steps were dropped for the docs versions since
these pages no longer push Cloud onboarding.

## Verification

- `nx run astro-docs:build` and `astro-docs:validate-links` green.
- vale 0 errors on all three pages (remaining suggestions sit on pre-existing lines).
- Copy payloads confirmed in the built HTML: `npx create-nx-workspace@latest` and
  `npx nx@latest init`, output excluded.
- Light and dark screenshots of both pages.
