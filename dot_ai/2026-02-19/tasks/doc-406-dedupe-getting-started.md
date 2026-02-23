# DOC-406: Dedupe Content Across Getting Started Pages (Concepts + Features)

**Linear:** https://linear.app/nxdev/issue/DOC-406
**Branch:** DOC-406
**Status:** In Progress
**Started:** 2026-02-19 12:22

## Goal

Reduce duplicated content across How Nx Works (concepts/) and Platform Features (features/) pages using two approaches:

1. Extract shared components for identical blocks appearing 3+ times
2. Consolidate & cross-reference prose that repeats the same concept with different wording
3. Add missing first-mention cross-reference links

Key rules:

- Use `sidebar.mts` as source of truth for page inventory, not directory structure
- Max ~3 topics per page; extras should be mentioned+linked or removed
- Cross-reference links only at first mention per page

---

## Part 1a: Component Extraction — `{% connect_to_cloud /%}`

The "connect to Nx Cloud" block appears in 7 pages with nearly identical structure (intro sentence + `npx nx@latest connect` code block + link to setup-ci recipe).

### Files Changed

| File                                                     | Change                                                   |
| -------------------------------------------------------- | -------------------------------------------------------- |
| `astro-docs/src/components/markdoc/ConnectToCloud.astro` | **Created** — renders intro + code block + setup-ci link |
| `astro-docs/markdoc.config.mjs`                          | Registered `connect_to_cloud` tag                        |
| `features/cache-task-results.mdoc`                       | Replaced connect block with `{% connect_to_cloud /%}`    |
| `features/CI Features/remote-cache.mdoc`                 | Replaced connect block with tag                          |
| `features/CI Features/distribute-task-execution.mdoc`    | Replaced connect block with tag                          |
| `features/CI Features/split-e2e-tasks.mdoc`              | Replaced connect block with tag                          |
| `features/CI Features/flaky-tasks.mdoc`                  | Replaced connect block with tag                          |
| `features/CI Features/self-healing-ci.mdoc`              | Replaced connect block with tag                          |
| `guides/Nx Cloud/optimize-your-ttg.mdoc`                 | Replaced connect block with tag                          |

### Not Changed (reviewed)

- `getting-started/tutorials/react-monorepo-tutorial.mdoc` — Richer tutorial context, not just a connect block
- `guides/Nx Cloud/adding-to-existing-project.mdoc` — Has GitHub setup steps + screenshots
- `guides/Nx Cloud/adding-to-monorepo.mdoc` — Has CI workflow generation steps
- `guides/Nx Cloud/angular-migration.mdoc` — Has CI workflow generation steps
- 9 technology intro pages have `nx connect` (not `npx nx@latest connect`) in CI Considerations — different pattern, not worth replacing

---

## Part 1b: Component Extraction — `{% view_inferred_tasks /%}`

The "View Inferred Tasks" boilerplate appears in 19+ technology introduction pages with the same structure (view inferred tasks text + `nx show project` command).

### Files Changed

| File                                                        | Change                                                                     |
| ----------------------------------------------------------- | -------------------------------------------------------------------------- |
| `astro-docs/src/components/markdoc/ViewInferredTasks.astro` | **Created** — accepts optional `project` attribute (default: `my-project`) |
| `astro-docs/markdoc.config.mjs`                             | Registered `view_inferred_tasks` tag                                       |

**Pattern 1 — Identical text (10 files):**

- `technologies/vue/nuxt/introduction.mdoc`
- `technologies/react/react-native/introduction.mdoc`
- `technologies/build-tools/rspack/introduction.mdoc`
- `technologies/build-tools/webpack/introduction.mdoc`
- `technologies/eslint/introduction.mdoc`
- `technologies/test-tools/playwright/introduction.mdoc`
- `technologies/test-tools/storybook/introduction.mdoc`
- `technologies/test-tools/cypress/introduction.mdoc`
- `technologies/react/expo/introduction.mdoc`
- `technologies/test-tools/detox/introduction.mdoc`

**Pattern 2 — Slight variations normalized (2 files):**

- `technologies/build-tools/docker/introduction.mdoc`
- `technologies/dotnet/introduction.mdoc`

**Pattern 3 — Multi-line variants with project attribute (7 files):**

- `technologies/build-tools/vite/introduction.mdoc` — `project="my-app"`
- `technologies/react/remix/introduction.mdoc` — `project="my-app"`
- `technologies/react/next/introduction.mdoc` — `project="my-app"`
- `technologies/typescript/introduction.mdoc`
- `technologies/java/gradle/introduction.mdoc` — `project="my-app"`
- `technologies/test-tools/jest/introduction.mdoc` — `project="my-app"`
- `technologies/java/maven/introduction.mdoc`

---

## Part 2: Content Consolidation & Cross-Referencing

### 2a. Caching intro — `remote-cache.mdoc` duplicates `cache-task-results.mdoc`

**Done.** Replaced redundant caching explanation in `remote-cache.mdoc` with:

> Nx [caches task results locally](/docs/features/cache-task-results) to avoid rebuilding the same code twice. Remote caching extends this by **sharing the cache across your team and CI**.

### 2b. Inferred tasks re-explanations

**Done.** Shortened explanatory paragraphs in:

- `cache-task-results.mdoc` — "Configure Caching Automatically" section now references concepts page
- `maintain-typescript-monorepos.mdoc` — Shortened to reference concepts page

### 2c. Conformance intro dedup

**Done.** `publish-conformance-rules-to-nx-cloud.mdoc` had verbatim identical intro paragraph as `configure-conformance-rules-in-nx-cloud.mdoc`. Shortened to a brief sentence referencing the canonical page.

### 2d. mental-model.mdoc — Major trim (-85 lines)

**Done.** Three sections were significantly trimmed:

1. **Caching section (L305-374 → ~11 lines):** Removed duplicated hash input list, "Optimizations" bullet points (verbatim from how-caching-works.mdoc), and "As your workspace grows" graph JSON (also verbatim). Kept both SVG images and core concept. Added link to [How Caching Works](/docs/concepts/how-caching-works).

2. **DTE section (L376-395 → ~3 lines):** Replaced lengthy explanation with concise sentence linking to [Nx Agents](/docs/features/ci-features/distribute-task-execution) and [remote caching](/docs/features/ci-features/remote-cache). Removed external blog link (canonical feature page is better). Kept SVG image.

3. **Summary section:** Added missing link: "computation caching" → `/docs/features/cache-task-results`.

---

## Part 3: Missing Cross-Reference Links

### Added

| File                                        | Link Added                                                                        |
| ------------------------------------------- | --------------------------------------------------------------------------------- |
| `concepts/mental-model.mdoc`                | `affected` command → `/docs/features/ci-features/affected` (first mention, L290)  |
| `concepts/mental-model.mdoc`                | `remote cache` → `/docs/features/ci-features/remote-cache` (first mention, L311)  |
| `concepts/mental-model.mdoc`                | `computation caching` → `/docs/features/cache-task-results` (summary section)     |
| `concepts/mental-model.mdoc`                | Task Pipeline Configuration → `/docs/concepts/task-pipeline-configuration` (L270) |
| `features/CI Features/self-healing-ci.mdoc` | `project graph` → `/docs/features/explore-graph` (first mention, L19)             |

---

## Part 4: Sidebar Changes

| File                     | Change                                                                     |
| ------------------------ | -------------------------------------------------------------------------- |
| `astro-docs/sidebar.mts` | Added `Cache Task Results` entry after `Run Tasks` under Platform Features |
| `astro-docs/sidebar.mts` | Moved `Maintain TypeScript Monorepos` to first position in KB > TypeScript |

---

## Critical Pass: Reviewed But NOT Changed

### CI Considerations in 9 tech intro pages

Files: react, next, remix, typescript, angular, jest, vitest, maven, gradle introduction pages.

Each has `## CI Considerations` with `nx affected` + `nx connect` + Set Up CI link, plus tool-specific subsections (Jest parallelization, Maven batch mode, Next.js static export, etc.). Too varied for a shared component — the overhead of configurable attributes would exceed the dedup benefit.

### `nx connect` blocks in tech pages

10 files have simple `nx connect` code blocks (not `npx nx@latest connect`). These are 3-line code blocks within CI sections, not the full "connect to cloud" explanation pattern. Not worth replacing with the component.

### flaky-tasks.mdoc analytics section

Product-specific documentation for Nx Cloud Enterprise. Topic sprawl concern is valid but this is unique content not duplicated elsewhere. Removing would lose information.

### mental-model.mdoc topic count

Page covers 6 topics (project graph, metadata, task graph, affected, caching, DTE). Although this exceeds the ~3 topic guideline, this is the "Mental Model" overview page — its purpose is to provide a high-level map of all concepts. Sections were trimmed significantly to be brief overviews rather than deep dives.

### "What gets stored?" in remote-cache.mdoc

`remote-cache.mdoc` has a "What gets stored?" section listing terminal output, task artifacts, and hash. `how-caching-works.mdoc` has a similar "What is Cached" section. Both are appropriate — `remote-cache.mdoc` is specifically about what's stored remotely, and links to the canonical page.

### Tutorial CI sections (React, Angular, TypeScript, Gradle tutorials)

Tutorials have self-healing CI flow with step-by-step instructions and screenshots. These are richer tutorial content, not simple boilerplate.

### Adoption guide CI sections (adding-to-existing-project, adding-to-monorepo, angular migration)

Have GitHub setup steps, CI workflow generation, and PR screenshots. Richer context not suitable for component extraction.

---

## All Files Changed (Complete List)

### Created (2 files)

1. `astro-docs/src/components/markdoc/ConnectToCloud.astro`
2. `astro-docs/src/components/markdoc/ViewInferredTasks.astro`

### Modified (31 files)

1. `astro-docs/markdoc.config.mjs` — registered both tags
2. `astro-docs/sidebar.mts` — sidebar changes
3. `concepts/mental-model.mdoc` — caching/DTE trim, cross-reference links
4. `enterprise/publish-conformance-rules-to-nx-cloud.mdoc` — shortened duplicate intro
5. `features/cache-task-results.mdoc` — connect_to_cloud tag + shortened inferred tasks
6. `features/CI Features/remote-cache.mdoc` — connect_to_cloud tag + caching intro consolidation
7. `features/CI Features/distribute-task-execution.mdoc` — connect_to_cloud tag
8. `features/CI Features/split-e2e-tasks.mdoc` — connect_to_cloud tag
9. `features/CI Features/flaky-tasks.mdoc` — connect_to_cloud tag
10. `features/CI Features/self-healing-ci.mdoc` — connect_to_cloud tag + missing link
11. `features/maintain-typescript-monorepos.mdoc` — shortened inferred tasks
12. `guides/Nx Cloud/optimize-your-ttg.mdoc` — connect_to_cloud tag
    13-31. 19 technology introduction pages — view_inferred_tasks tag

### Build Result

- 729 pages built successfully
- All files formatted with prettier

---

## Verification

- [x] `nx build astro-docs` — 729 pages, passes
- [x] connect_to_cloud component renders correctly
- [x] view_inferred_tasks component renders correctly
- [x] Cross-reference links verified
- [x] All files formatted with prettier
- [ ] Final review before commit

---

## Side-by-Side Review URLs

All content pages touched, with local dev server and production URLs.

### Concepts & Features

| Page                          | Local                                                                     | Production                                                         |
| ----------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Mental Model                  | http://localhost:4321/docs/concepts/mental-model                          | https://canary.nx.dev/docs/concepts/mental-model                          |
| Cache Task Results            | http://localhost:4321/docs/features/cache-task-results                    | https://canary.nx.dev/docs/features/cache-task-results                    |
| Maintain TypeScript Monorepos | http://localhost:4321/docs/features/maintain-typescript-monorepos         | https://canary.nx.dev/docs/features/maintain-typescript-monorepos         |
| Remote Cache                  | http://localhost:4321/docs/features/ci-features/remote-cache              | https://canary.nx.dev/docs/features/ci-features/remote-cache              |
| Distribute Task Execution     | http://localhost:4321/docs/features/ci-features/distribute-task-execution | https://canary.nx.dev/docs/features/ci-features/distribute-task-execution |
| Split E2E Tasks               | http://localhost:4321/docs/features/ci-features/split-e2e-tasks           | https://canary.nx.dev/docs/features/ci-features/split-e2e-tasks           |
| Flaky Tasks                   | http://localhost:4321/docs/features/ci-features/flaky-tasks               | https://canary.nx.dev/docs/features/ci-features/flaky-tasks               |
| Self-Healing CI               | http://localhost:4321/docs/features/ci-features/self-healing-ci           | https://canary.nx.dev/docs/features/ci-features/self-healing-ci           |

### Guides & Enterprise

| Page                      | Local                                                                       | Production                                                           |
| ------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Optimize Your TTG         | http://localhost:4321/docs/guides/nx-cloud/optimize-your-ttg                | https://canary.nx.dev/docs/guides/nx-cloud/optimize-your-ttg                |
| Publish Conformance Rules | http://localhost:4321/docs/enterprise/publish-conformance-rules-to-nx-cloud | https://canary.nx.dev/docs/enterprise/publish-conformance-rules-to-nx-cloud |

### Technology Introductions (view_inferred_tasks tag)

| Page         | Local                                                                      | Production                                                          |
| ------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Vite         | http://localhost:4321/docs/technologies/build-tools/vite/introduction      | https://canary.nx.dev/docs/technologies/build-tools/vite/introduction      |
| Webpack      | http://localhost:4321/docs/technologies/build-tools/webpack/introduction   | https://canary.nx.dev/docs/technologies/build-tools/webpack/introduction   |
| Rspack       | http://localhost:4321/docs/technologies/build-tools/rspack/introduction    | https://canary.nx.dev/docs/technologies/build-tools/rspack/introduction    |
| Docker       | http://localhost:4321/docs/technologies/build-tools/docker/introduction    | https://canary.nx.dev/docs/technologies/build-tools/docker/introduction    |
| Next.js      | http://localhost:4321/docs/technologies/react/next/introduction            | https://canary.nx.dev/docs/technologies/react/next/introduction            |
| Remix        | http://localhost:4321/docs/technologies/react/remix/introduction           | https://canary.nx.dev/docs/technologies/react/remix/introduction           |
| React Native | http://localhost:4321/docs/technologies/react/react-native/introduction    | https://canary.nx.dev/docs/technologies/react/react-native/introduction    |
| Expo         | http://localhost:4321/docs/technologies/react/expo/introduction            | https://canary.nx.dev/docs/technologies/react/expo/introduction            |
| Nuxt         | http://localhost:4321/docs/technologies/vue/nuxt/introduction              | https://canary.nx.dev/docs/technologies/vue/nuxt/introduction              |
| TypeScript   | http://localhost:4321/docs/technologies/typescript/introduction            | https://canary.nx.dev/docs/technologies/typescript/introduction            |
| .NET         | http://localhost:4321/docs/technologies/dotnet/introduction                | https://canary.nx.dev/docs/technologies/dotnet/introduction                |
| ESLint       | http://localhost:4321/docs/technologies/eslint/introduction                | https://canary.nx.dev/docs/technologies/eslint/introduction                |
| Jest         | http://localhost:4321/docs/technologies/test-tools/jest/introduction       | https://canary.nx.dev/docs/technologies/test-tools/jest/introduction       |
| Playwright   | http://localhost:4321/docs/technologies/test-tools/playwright/introduction | https://canary.nx.dev/docs/technologies/test-tools/playwright/introduction |
| Cypress      | http://localhost:4321/docs/technologies/test-tools/cypress/introduction    | https://canary.nx.dev/docs/technologies/test-tools/cypress/introduction    |
| Storybook    | http://localhost:4321/docs/technologies/test-tools/storybook/introduction  | https://canary.nx.dev/docs/technologies/test-tools/storybook/introduction  |
| Detox        | http://localhost:4321/docs/technologies/test-tools/detox/introduction      | https://canary.nx.dev/docs/technologies/test-tools/detox/introduction      |
| Gradle       | http://localhost:4321/docs/technologies/java/gradle/introduction           | https://canary.nx.dev/docs/technologies/java/gradle/introduction           |
| Maven        | http://localhost:4321/docs/technologies/java/maven/introduction            | https://canary.nx.dev/docs/technologies/java/maven/introduction            |
