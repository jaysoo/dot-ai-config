# DOC-569: Refresh "Extending Nx" pages (create one feature page)

Linear: https://linear.app/nxdev/issue/DOC-569 (High, due 2026-08-07)
Branch: DOC-569 (worktree /Users/jack/projects/nx-worktrees/DOC-569, currently == master)
Polygraph session: brisk-penguin-af6d8609

## Goal

One feature page `Platform features > Multi-language support` so someone can point AI at it
and produce a usable plugin in under an hour (10 min scan).

Structure (from issue):

1. Intro: Nx is polyglot, works with any language/framework
2. Anatomy of a plugin (glob config files, create nodes, create deps)
3. What to glob (e.g. pyproject.toml / uv.toml for python+uv)
4. How to create projects + tasks
5. How to create dependencies (members/dependencies entries, AST parsing if relevant)
6. Testing
7. (Maybe) Advanced: task splitting - or separate KB article

Internal APIs our plugins use: call out that paths may change but migrations provided.
Keep relevant for 80% of plugins, skip niche cases.

## Plan

- [x] Debrief prior sessions (no duplicate work; reuse absorb-and-redirect + validation loop)
- [x] Research first-party plugin patterns (gradle/maven/dotnet: manifest = project marker,
      whole-workspace toolchain spawn -> JSON report shared by createNodes/createDependencies,
      devkit/internal caching helpers, atomizer shape `${ciTargetName}--${file}` + nx:noop)
- [x] Write `astro-docs/src/content/docs/features/multi-language-support.mdoc` (python+uv example)
- [x] Sidebar: added under Platform features after "Enhance your coding agent"
- [x] Removed `kb/project-graph-plugins.mdoc` + redirects (netlify.toml new + repointed chain,
      astro.config.mjs) + all inbound links fixed
- [x] KB deep-dives linked (performant, createnodes-compat, tooling-plugin, publish, devkit ref)
- [x] Validation: prettier, vale 0 errors, structural pass (fixed one "which is what makes"),
      validate-links green, screenshot verified
- [x] Commit cd6aa58059, pushed, draft PR https://github.com/nrwl/nx/pull/36601

## Status: draft PR awaiting Jack review + CI

## Restructure (Jack feedback rounds, 2026-08-07)

- Round 1: glob table drops gradle/maven (first-party exists), adds PHP+Composer; intro links
  first-party tech intros (gradle/maven/dotnet) + community plugins (@nxlv/python, @nx-go/nx-go,
  @monodon/rust) + registry. Commit 01f486cae2.
- Round 2 (rejected tutorial move): keep in Platform features; tutorials wrong place.
- Round 3 (713f95964a): feature page = high-level only (inferred projects/tasks/deps, links
  mental-model#inferred-tasks). Full python+uv walkthrough -> new `kb/create-a-plugin`, which
  REPLACES kb/intro + kb/tooling-plugin (+ earlier kb/project-graph-plugins). Redirects for all
  three in netlify.toml + astro.config.mjs; ~20 inbound links repointed (incl. create-preset's
  publish link fixed to kb/publish-plugin, nx-vs-turborepo devkit link to reference/devkit).
  performant-project-graph-plugins updated for Nx 22+ (createNodesV2 aside removed).
- Nx 22+ assumed everywhere; createNodesV2 only in kb/createnodes-compatibility.

## Notes

- Feature page = golden path only; deep dives stay in KB and get linked.
- KB "Extending Nx" topic has 18 articles; only project-graph-plugins fully overlaps.
- Debrief gotchas: vale via mise not npx; serve screenshots via symlinked /docs dir.
