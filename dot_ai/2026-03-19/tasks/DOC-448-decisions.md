# DOC-448: Docs Homepage Changes — Decision Log

## "Nx Cloud" moved from Getting Started to Orchestration & CI overview

**Decision:** Moved Nx Cloud content from Getting Started sidebar into the Orchestration & CI index page (overview). Added "Overview" as first child in the sidebar group since Starlight doesn't support clickable group headers.

**Why:** "Nx Cloud" in Getting Started didn't map to what a new user is trying to learn or do in their first 30 minutes. The content gets ~1,747 views/30 days though, so it has value. Moving it to the Orchestration & CI section puts it where users will find it when they're ready for CI — the intro page still links to it. Redirect added for old URL.

## Sidebar "Overview" pattern for group index pages

**Decision:** Add an "Overview" link as the first child of sidebar groups that have an index page (e.g. Orchestration & CI).

**Why:** Starlight doesn't support groups that are both clickable and collapsible — the schema enforces mutual exclusivity via `.strict()` validation. Adding "Overview" as the first child is the standard workaround used by Astro's own docs and others.

## Tutorials expanded by default in sidebar

**Decision:** Changed tutorials sidebar group from `collapsed: true` to `collapsed: false`.

**Why:** Tutorials are a primary entry point for new users. Hiding them behind a collapsed toggle means users might not notice them. Expanding by default makes them immediately visible in the Getting Started section.

## Topic-based tutorial restructure (replacing framework-based)

**Decision:** Replaced framework-specific tutorial sidebar entries (React Monorepo, Angular Monorepo, TypeScript Monorepo) with topic-based entries: Crafting your workspace, Managing dependencies, Creating local libraries, Configuring tasks, Explore your workspace, Setting up CI.

**Why:** Each topic is focused and framework-agnostic. Users can progressively go through them, or point AI like Claude Code at one topic to learn about it regardless of starting framework. AI can follow each tutorial from beginning to end, and any tutorial can be dropped into a random workspace. Old framework tutorials stay accessible via direct URL but are hidden from sidebar.

## Gradle tutorial kept at end of Learn Nx

**Decision:** Gradle monorepo tutorial placed last in Learn Nx group, after Setting up CI.

**Why:** Barely any traffic. Keeping it in the sidebar for now until we figure out what to do with it, but not prominently positioned.

## Tutorials group renamed to "Learn Nx"

**Decision:** Renamed "Tutorials" sidebar group to "Learn Nx".

**Why:** Better communicates the progressive learning path. "Tutorials" is generic; "Learn Nx" signals intent.

## Sentence case applied to all sidebar labels

**Decision:** Applied sentence case to every sidebar label across the entire file.

**Why:** Style guide requires sentence case for headings. Only proper nouns (Nx, Nx Cloud, Nx Console, GitHub, TypeScript, etc.) and acronyms (CI, API, LLM, DTE, E2E) stay capitalized.

## AI integrations moved before Editor setup

**Decision:** Swapped AI integrations and Editor setup order in Getting Started sidebar.

**Why:** AI integrations has higher traffic (4K vs 3K in 30 days) and is more important to surface early.

## start-new-project.mdoc: two-option layout restored

**Decision:** Kept both Option 1 (local templates) and Option 2 (Nx Cloud) as equal sections.

**Why:** Don't want to make changes too drastically without careful measurements. Updated Option 1 content (removed package manager/additional options prompts, renamed "Template" to "Starter template", used `--template=nrwl/empty-template` for minimal setup) but kept both options visible.

## Tutorial CTAs kept for browser-based experience

**Decision:** Replaced aside notes with `call_to_action` components linking to cloud.nx.app for each framework tutorial.

**Why:** CTAs are more visible and actionable than aside text. Keeps the cloud onboarding option discoverable without making it the primary path.

---

## Cloud CTA → CNW command in tutorials

**Decision:** Replace cloud.nx.app CTAs with `npx create-nx-workspace` commands as the primary onboarding path.

**Why:** Cloud onboarding required GitHub account + full verification before the tutorial even starts. CNW and cloud onboarding use the same templates, so file trees and app names are identical. Reduced CNW starts (~1800/day weekday vs ~2700 target) suggest the cloud-first path was a friction point.

**How:** Each tutorial now starts with a CNW command. Cloud link is preserved as a secondary aside ("Want a browser-based setup?").

## Self-healing CI extracted to standalone tutorial

**Decision:** Move CI/self-healing content from each framework tutorial into a single "Setting Up CI" tutorial.

**Why:** Scroll-to-bottom rates on the framework tutorials are 15-20%. The CI content was buried at the end where most users never reached it. A standalone tutorial with a clear topic makes CI discoverable from the sidebar and gives it a proper entry point.

## Removed Quickstart card from intro page

**Decision:** Removed the Quickstart linkcard (and all cards) from the intro page's "Where to Go from here" section.

**Why:** Traffic to Quickstart is low. The sidebar already surfaces Getting Started content prominently. Cards for Concepts, Features, and Plugins added clutter without clear user intent — progressive disclosure says these belong later in the journey.

## Gradle tutorial de-emphasized in sidebar

**Decision:** Moved Gradle tutorial to the bottom of the Tutorials list, just before the CI tutorial.

**Why:** Gradle tutorial has barely any traffic compared to React, Angular, and TypeScript. Keeping it near the top gives it unearned prominence. Users looking for Gradle will still find it, but it won't push more popular tutorials down.

## Removed .nx folder and .github/ci.yml from tutorial file trees

**Decision:** Removed `.nx` folder callout and `.github/workflows/ci.yml` bullet from the "Explore workspace" sections.

**Why:** `.nx` isn't created on first CNW run — it's an internal cache directory like Vite's or Jest's. Progressive disclosure: users learn about it when they need it. `.github/ci.yml` is no longer generated by the template via CNW (that was cloud onboarding). CI setup is now covered in the dedicated CI tutorial.

## Node.js v20.19 prerequisite

**Decision:** Changed Node.js prerequisite from v18 to v20.19 or later.

**Why:** Aligns with current Nx minimum supported Node.js version.

## Workspace naming: my-nx-repo, @org scope

**Decision:** Use `my-nx-repo` as the workspace name and `@org` as the package scope in tutorials.

**Why:** `myorg` was confusingly close to a scope name. `my-nx-repo` is clearly a directory name. `@org` as scope reflects what CNW actually generates (scope is independent of folder name).

## start-new-project.mdoc: cloud option demoted

**Decision:** Converted cloud onboarding from an equal-weight "Option 2" section to a brief aside note.

**Why:** Consistent with the overall direction of making CNW the primary path. Cloud is still mentioned but doesn't compete for attention with the local setup.

## Task terminology over target

**Decision:** Use "task" instead of "target" in tutorial prose where possible.

**Why:** "Task" is the user-facing concept ("run a task"). "Target" is the configuration-level term. Using "task" consistently in tutorials reduces jargon and aligns with how we describe `nx run <project>:<task>`.
