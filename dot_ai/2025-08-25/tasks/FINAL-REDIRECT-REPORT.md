# COMPREHENSIVE REDIRECT ANALYSIS FOR canary.nx.dev

Generated: 2025-08-25T18:49:00.524Z
Total redirect rules analyzed: 1078

## EXECUTIVE SUMMARY

| Status | Count | Percentage | Description |
|--------|-------|------------|-------------|
| ✅ **WORKING** | 1 | 0.1% | Redirects correctly to expected URL |
| ❌ **BROKEN (404)** | 1 | 0.1% | Old URL returns 404 error |
| 🔴 **NO REDIRECT** | 1064 | 98.7% | Old URL exists but doesn't redirect |
| 🟡 **PARTIAL REDIRECT** | 12 | 1.1% | Redirects to parent/intro page |
| 🟠 **WRONG REDIRECT** | 0 | 0.0% | Redirects to unexpected location |

## KEY FINDINGS

1. **Almost no redirects are working as specified** - Only 1 out of 1078 redirects work correctly
2. **Most old URLs still exist** - 1064 URLs are accessible at their old locations without any redirect
3. **Many URLs redirect to parent pages** - 12 URLs redirect to intro or parent pages instead of specific pages
4. **Major restructuring evident** - URLs like `/nx-api/*` now redirect to `/technologies/*/api`

## ✅ WORKING REDIRECTS

- `/getting-started/intro` → `/docs/getting-started/intro` ✓

## ❌ BROKEN LINKS (404)

These URLs return 404 errors:

- `/nx-api/nx/documents/affected%23skip-nx-cache` → `/docs/nx-api/nx/documents/affected%23skip-nx-cache`

## 🔴 NO REDIRECT IN PLACE (1064)

These old URLs are still accessible but DO NOT redirect. This is the most critical issue:

### /ci/* (76 URLs)

- `/ci/getting-started` should redirect to `/docs/ci/getting-started`
- `/ci/getting-started/intro` should redirect to `/docs/ci/getting-started/intro`
- `/ci/features` should redirect to `/docs/ci/features`
- `/ci/features/self-healing-ci` should redirect to `/docs/ci/features/self-healing-ci`
- `/ci/features/remote-cache` should redirect to `/docs/ci/features/remote-cache`
- `/ci/features/distribute-task-execution` should redirect to `/docs/ci/features/distribute-task-execution`
- `/ci/features/affected` should redirect to `/docs/ci/features/affected`
- `/ci/features/dynamic-agents` should redirect to `/docs/ci/features/dynamic-agents`
- `/ci/features/split-e2e-tasks` should redirect to `/docs/ci/features/split-e2e-tasks`
- `/ci/features/flaky-tasks` should redirect to `/docs/ci/features/flaky-tasks`
... and 66 more

### /concepts/* (21 URLs)

- `/concepts` should redirect to `/docs/concepts`
- `/concepts/mental-model` should redirect to `/docs/concepts/mental-model`
- `/concepts/how-caching-works` should redirect to `/docs/concepts/how-caching-works`
- `/concepts/task-pipeline-configuration` should redirect to `/docs/concepts/task-pipeline-configuration`
- `/concepts/nx-plugins` should redirect to `/docs/concepts/nx-plugins`
- `/concepts/inferred-tasks` should redirect to `/docs/concepts/inferred-tasks`
- `/concepts/types-of-configuration` should redirect to `/docs/concepts/types-of-configuration`
- `/concepts/executors-and-configurations` should redirect to `/docs/concepts/executors-and-configurations`
- `/concepts/common-tasks` should redirect to `/docs/concepts/common-tasks`
- `/concepts/nx-daemon` should redirect to `/docs/concepts/nx-daemon`
... and 11 more

### /deprecated/* (17 URLs)

- `/deprecated` should redirect to `/docs/deprecated`
- `/deprecated/affected-graph` should redirect to `/docs/deprecated/affected-graph`
- `/deprecated/print-affected` should redirect to `/docs/deprecated/print-affected`
- `/deprecated/workspace-json` should redirect to `/docs/deprecated/workspace-json`
- `/deprecated/as-provided-vs-derived` should redirect to `/docs/deprecated/as-provided-vs-derived`
- `/deprecated/workspace-generators` should redirect to `/docs/deprecated/workspace-generators`
- `/deprecated/legacy-cache` should redirect to `/docs/deprecated/legacy-cache`
- `/deprecated/custom-tasks-runner` should redirect to `/docs/deprecated/custom-tasks-runner`
- `/deprecated/workspace-executors` should redirect to `/docs/deprecated/workspace-executors`
- `/deprecated/runtime-cache-inputs` should redirect to `/docs/deprecated/runtime-cache-inputs`
... and 7 more

### /extending-nx/* (27 URLs)

- `/extending-nx` should redirect to `/docs/extending-nx`
- `/extending-nx/intro` should redirect to `/docs/extending-nx/intro`
- `/extending-nx/intro/getting-started` should redirect to `/docs/extending-nx/intro/getting-started`
- `/extending-nx/tutorials` should redirect to `/docs/extending-nx/tutorials`
- `/extending-nx/tutorials/organization-specific-plugin` should redirect to `/docs/extending-nx/tutorials/organization-specific-plugin`
- `/extending-nx/tutorials/tooling-plugin` should redirect to `/docs/extending-nx/tutorials/tooling-plugin`
- `/extending-nx/recipes` should redirect to `/docs/extending-nx/recipes`
- `/extending-nx/recipes/local-generators` should redirect to `/docs/extending-nx/recipes/local-generators`
- `/extending-nx/recipes/composing-generators` should redirect to `/docs/extending-nx/recipes/composing-generators`
- `/extending-nx/recipes/generator-options` should redirect to `/docs/extending-nx/recipes/generator-options`
... and 17 more

### /features/* (11 URLs)

- `/features` should redirect to `/docs/features`
- `/features/run-tasks` should redirect to `/docs/features/run-tasks`
- `/features/cache-task-results` should redirect to `/docs/features/cache-task-results`
- `/features/enhance-AI` should redirect to `/docs/features/enhance-AI`
- `/features/explore-graph` should redirect to `/docs/features/explore-graph`
- `/features/generate-code` should redirect to `/docs/features/generate-code`
- `/features/maintain-ts-monorepos` should redirect to `/docs/features/maintain-ts-monorepos`
- `/features/automate-updating-dependencies` should redirect to `/docs/features/automate-updating-dependencies`
- `/features/enforce-module-boundaries` should redirect to `/docs/features/enforce-module-boundaries`
- `/features/manage-releases` should redirect to `/docs/features/manage-releases`
... and 1 more

### /nx-enterprise/* (6 URLs)

- `/nx-enterprise` should redirect to `/docs/nx-enterprise`
- `/nx-enterprise/activate-powerpack` should redirect to `/docs/nx-enterprise/activate-powerpack`
- `/nx-enterprise/powerpack` should redirect to `/docs/nx-enterprise/powerpack`
- `/nx-enterprise/powerpack/licenses-and-trials` should redirect to `/docs/nx-enterprise/powerpack/licenses-and-trials`
- `/nx-enterprise/powerpack/conformance` should redirect to `/docs/nx-enterprise/powerpack/conformance`
- `/nx-enterprise/powerpack/owners` should redirect to `/docs/nx-enterprise/powerpack/owners`

### /plugin-registry/* (1 URLs)

- `/plugin-registry` should redirect to `/docs/plugin-registry`

### /recipes/* (67 URLs)

- `/recipes` should redirect to `/docs/recipes`
- `/recipes/installation` should redirect to `/docs/recipes/installation`
- `/recipes/installation/install-non-javascript` should redirect to `/docs/recipes/installation/install-non-javascript`
- `/recipes/installation/update-global-installation` should redirect to `/docs/recipes/installation/update-global-installation`
- `/recipes/running-tasks` should redirect to `/docs/recipes/running-tasks`
- `/recipes/running-tasks/configure-inputs` should redirect to `/docs/recipes/running-tasks/configure-inputs`
- `/recipes/running-tasks/configure-outputs` should redirect to `/docs/recipes/running-tasks/configure-outputs`
- `/recipes/running-tasks/defining-task-pipeline` should redirect to `/docs/recipes/running-tasks/defining-task-pipeline`
- `/recipes/running-tasks/terminal-ui` should redirect to `/docs/recipes/running-tasks/terminal-ui`
- `/recipes/running-tasks/run-commands-executor` should redirect to `/docs/recipes/running-tasks/run-commands-executor`
... and 57 more

### /reference/* (290 URLs)

- `/reference` should redirect to `/docs/reference`
- `/reference/nx-commands` should redirect to `/docs/reference/nx-commands`
- `/reference/nx-json` should redirect to `/docs/reference/nx-json`
- `/reference/project-configuration` should redirect to `/docs/reference/project-configuration`
- `/reference/inputs` should redirect to `/docs/reference/inputs`
- `/reference/nxignore` should redirect to `/docs/reference/nxignore`
- `/reference/environment-variables` should redirect to `/docs/reference/environment-variables`
- `/reference/glossary` should redirect to `/docs/reference/glossary`
- `/reference/releases` should redirect to `/docs/reference/releases`
- `/reference/core-api` should redirect to `/docs/reference/core-api`
... and 280 more

### /see-also/* (2 URLs)

- `/see-also` should redirect to `/docs/see-also`
- `/see-also/sitemap` should redirect to `/docs/see-also/sitemap`

### /showcase/* (22 URLs)

- `/showcase` should redirect to `/docs/showcase`
- `/showcase/example-repos` should redirect to `/docs/showcase/example-repos`
- `/showcase/example-repos/add-express` should redirect to `/docs/showcase/example-repos/add-express`
- `/showcase/example-repos/add-lit` should redirect to `/docs/showcase/example-repos/add-lit`
- `/showcase/example-repos/add-solid` should redirect to `/docs/showcase/example-repos/add-solid`
- `/showcase/example-repos/add-qwik` should redirect to `/docs/showcase/example-repos/add-qwik`
- `/showcase/example-repos/add-rust` should redirect to `/docs/showcase/example-repos/add-rust`
- `/showcase/example-repos/add-dotnet` should redirect to `/docs/showcase/example-repos/add-dotnet`
- `/showcase/example-repos/add-astro` should redirect to `/docs/showcase/example-repos/add-astro`
- `/showcase/example-repos/add-svelte` should redirect to `/docs/showcase/example-repos/add-svelte`
... and 12 more

### /technologies/* (517 URLs)

- `/technologies` should redirect to `/docs/technologies`
- `/technologies/typescript` should redirect to `/docs/technologies/typescript`
- `/technologies/typescript/introduction` should redirect to `/docs/technologies/typescript/introduction`
- `/technologies/typescript/recipes` should redirect to `/docs/technologies/typescript/recipes`
- `/technologies/typescript/recipes/switch-to-workspaces-project-references` should redirect to `/docs/technologies/typescript/recipes/switch-to-workspaces-project-references`
- `/technologies/typescript/recipes/enable-tsc-batch-mode` should redirect to `/docs/technologies/typescript/recipes/enable-tsc-batch-mode`
- `/technologies/typescript/recipes/define-secondary-entrypoints` should redirect to `/docs/technologies/typescript/recipes/define-secondary-entrypoints`
- `/technologies/typescript/recipes/compile-multiple-formats` should redirect to `/docs/technologies/typescript/recipes/compile-multiple-formats`
- `/technologies/typescript/recipes/js-and-ts` should redirect to `/docs/technologies/typescript/recipes/js-and-ts`
- `/technologies/typescript/api` should redirect to `/docs/technologies/typescript/api`
... and 507 more

### /troubleshooting/* (7 URLs)

- `/troubleshooting` should redirect to `/docs/troubleshooting`
- `/troubleshooting/resolve-circular-dependencies` should redirect to `/docs/troubleshooting/resolve-circular-dependencies`
- `/troubleshooting/troubleshoot-nx-install-issues` should redirect to `/docs/troubleshooting/troubleshoot-nx-install-issues`
- `/troubleshooting/troubleshoot-cache-misses` should redirect to `/docs/troubleshooting/troubleshoot-cache-misses`
- `/troubleshooting/unknown-local-cache` should redirect to `/docs/troubleshooting/unknown-local-cache`
- `/troubleshooting/performance-profiling` should redirect to `/docs/troubleshooting/performance-profiling`
- `/troubleshooting/convert-to-inferred` should redirect to `/docs/troubleshooting/convert-to-inferred`

## 🟡 PARTIAL REDIRECTS (12)

These URLs redirect to parent or intro pages instead of the specific page:

- `/ci`
  - Expected: `/docs/ci`
  - Actual: `/ci/getting-started/intro`
- `/getting-started`
  - Expected: `/docs/getting-started`
  - Actual: `/docs/getting-started/intro`
- `/getting-started/installation`
  - Expected: `/docs/getting-started/installation`
  - Actual: `/docs/getting-started/intro`
- `/getting-started/start-new-project`
  - Expected: `/docs/getting-started/start-new-project`
  - Actual: `/docs/getting-started/intro`
- `/getting-started/adding-to-existing`
  - Expected: `/docs/getting-started/adding-to-existing`
  - Actual: `/docs/getting-started/intro`
- `/getting-started/editor-setup`
  - Expected: `/docs/getting-started/editor-setup`
  - Actual: `/docs/getting-started/intro`
- `/getting-started/ai-integration`
  - Expected: `/docs/getting-started/ai-integration`
  - Actual: `/docs/getting-started/intro`
- `/getting-started/tutorials`
  - Expected: `/docs/getting-started/tutorials`
  - Actual: `/docs/getting-started/intro`
- `/getting-started/tutorials/typescript-packages-tutorial`
  - Expected: `/docs/getting-started/tutorials/typescript-packages-tutorial`
  - Actual: `/docs/getting-started/intro`
- `/getting-started/tutorials/react-monorepo-tutorial`
  - Expected: `/docs/getting-started/tutorials/react-monorepo-tutorial`
  - Actual: `/docs/getting-started/intro`
- `/getting-started/tutorials/angular-monorepo-tutorial`
  - Expected: `/docs/getting-started/tutorials/angular-monorepo-tutorial`
  - Actual: `/docs/getting-started/intro`
- `/getting-started/tutorials/gradle-tutorial`
  - Expected: `/docs/getting-started/tutorials/gradle-tutorial`
  - Actual: `/docs/getting-started/intro`

## 🟠 WRONG REDIRECTS (0)

These URLs redirect to completely different locations:

## ACTION ITEMS

### CRITICAL - Fix No-Redirect URLs

1064 URLs need redirects implemented. Priority sections:

- **/technologies/*** - 517 URLs need redirects
- **/reference/*** - 290 URLs need redirects
- **/ci/*** - 76 URLs need redirects
- **/recipes/*** - 67 URLs need redirects
- **/extending-nx/*** - 27 URLs need redirects

### HIGH PRIORITY - Review Partial Redirects

12 URLs redirect to parent/intro pages. Verify if this is intentional.

### MEDIUM PRIORITY - Fix Wrong Redirects

0 URLs redirect to unexpected locations. Major patterns:
- /nx-api/* URLs now go to /technologies/*/api
- /recipes/TECH/* URLs now go to /technologies/TECH/recipes/*

## RECOMMENDATIONS

1. **Implement missing redirects** - The redirect rules exist but are not active on the server
2. **Review URL restructuring** - Many URLs follow new patterns (technologies-based organization)
3. **Update redirect rules** - Align the redirect-rules-docs-to-astro.js with actual site structure
4. **Consider catch-all patterns** - Use pattern-based redirects for common transformations
