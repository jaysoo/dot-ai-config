# Astro Docs Migration - Redirect Analysis (Docs Prefix Only)

Generated: 2025-08-25T19:23:46.626Z
Total redirect rules: 1078

## CRITICAL FINDING

**For Astro docs migration, only URLs that redirect to `/docs/*` are relevant.**

## Summary

| Category | Count | Percentage | Description |
|----------|-------|------------|-------------|
| ✅ **Valid /docs/* URLs** | 123 | 11.4% | Target is /docs/* and exists |
| ❌ **Broken /docs/* URLs** | 955 | 88.6% | Target is /docs/* but doesn't exist |
| ⚠️ **Non-docs URLs** | 0 | 0.0% | Target is NOT /docs/* (incorrect for Astro) |

## ✅ VALID /docs/* REDIRECTS (123)

These redirects correctly point to existing `/docs/*` URLs:

### /docs/concepts/* (20 working)
- `/concepts` → `/docs/concepts` ✓
- `/concepts/mental-model` → `/docs/concepts/mental-model` ✓
- `/concepts/how-caching-works` → `/docs/concepts/how-caching-works` ✓
- `/concepts/task-pipeline-configuration` → `/docs/concepts/task-pipeline-configuration` ✓
- `/concepts/nx-plugins` → `/docs/concepts/nx-plugins` ✓
... and 15 more

### /docs/features/* (10 working)
- `/features` → `/docs/features` ✓
- `/features/run-tasks` → `/docs/features/run-tasks` ✓
- `/features/cache-task-results` → `/docs/features/cache-task-results` ✓
- `/features/enhance-AI` → `/docs/features/enhance-AI` ✓
- `/features/explore-graph` → `/docs/features/explore-graph` ✓
... and 5 more

### /docs/getting-started/* (6 working)
- `/getting-started` → `/docs/getting-started` ✓
- `/getting-started/intro` → `/docs/getting-started/intro` ✓
- `/getting-started/installation` → `/docs/getting-started/installation` ✓
- `/getting-started/start-new-project` → `/docs/getting-started/start-new-project` ✓
- `/getting-started/editor-setup` → `/docs/getting-started/editor-setup` ✓
... and 1 more

### /docs/plugin-registry/* (1 working)
- `/plugin-registry` → `/docs/plugin-registry` ✓

### /docs/reference/* (13 working)
- `/reference` → `/docs/reference` ✓
- `/reference/nx-commands` → `/docs/reference/nx-commands` ✓
- `/reference/nx-json` → `/docs/reference/nx-json` ✓
- `/reference/project-configuration` → `/docs/reference/project-configuration` ✓
- `/reference/inputs` → `/docs/reference/inputs` ✓
... and 8 more

### /docs/technologies/* (67 working)
- `/technologies` → `/docs/technologies` ✓
- `/technologies/typescript` → `/docs/technologies/typescript` ✓
- `/technologies/typescript/introduction` → `/docs/technologies/typescript/introduction` ✓
- `/technologies/angular` → `/docs/technologies/angular` ✓
- `/technologies/angular/introduction` → `/docs/technologies/angular/introduction` ✓
... and 62 more

### /docs/troubleshooting/* (6 working)
- `/troubleshooting` → `/docs/troubleshooting` ✓
- `/troubleshooting/resolve-circular-dependencies` → `/docs/troubleshooting/resolve-circular-dependencies` ✓
- `/troubleshooting/troubleshoot-nx-install-issues` → `/docs/troubleshooting/troubleshoot-nx-install-issues` ✓
- `/troubleshooting/troubleshoot-cache-misses` → `/docs/troubleshooting/troubleshoot-cache-misses` ✓
- `/troubleshooting/unknown-local-cache` → `/docs/troubleshooting/unknown-local-cache` ✓
... and 1 more


## ❌ BROKEN /docs/* URLs (955)

These correctly target `/docs/*` but the pages don't exist:

### /docs/ci/* (77 broken)
- `/ci` → `/docs/ci` (404)
- `/ci/getting-started` → `/docs/ci/getting-started` (404)
- `/ci/getting-started/intro` → `/docs/ci/getting-started/intro` (404)
- `/ci/features` → `/docs/ci/features` (404)
- `/ci/features/self-healing-ci` → `/docs/ci/features/self-healing-ci` (404)
- `/ci/features/remote-cache` → `/docs/ci/features/remote-cache` (404)
- `/ci/features/distribute-task-execution` → `/docs/ci/features/distribute-task-execution` (404)
- `/ci/features/affected` → `/docs/ci/features/affected` (404)
- `/ci/features/dynamic-agents` → `/docs/ci/features/dynamic-agents` (404)
- `/ci/features/split-e2e-tasks` → `/docs/ci/features/split-e2e-tasks` (404)
... and 67 more

### /docs/concepts/* (1 broken)
- `/concepts/nx-daemon` → `/docs/concepts/nx-daemon` (404)

### /docs/deprecated/* (17 broken)
- `/deprecated` → `/docs/deprecated` (404)
- `/deprecated/affected-graph` → `/docs/deprecated/affected-graph` (404)
- `/deprecated/print-affected` → `/docs/deprecated/print-affected` (404)
- `/deprecated/workspace-json` → `/docs/deprecated/workspace-json` (404)
- `/deprecated/as-provided-vs-derived` → `/docs/deprecated/as-provided-vs-derived` (404)
- `/deprecated/workspace-generators` → `/docs/deprecated/workspace-generators` (404)
- `/deprecated/legacy-cache` → `/docs/deprecated/legacy-cache` (404)
- `/deprecated/custom-tasks-runner` → `/docs/deprecated/custom-tasks-runner` (404)
- `/deprecated/workspace-executors` → `/docs/deprecated/workspace-executors` (404)
- `/deprecated/runtime-cache-inputs` → `/docs/deprecated/runtime-cache-inputs` (404)
... and 7 more

### /docs/extending-nx/* (27 broken)
- `/extending-nx` → `/docs/extending-nx` (404)
- `/extending-nx/intro` → `/docs/extending-nx/intro` (404)
- `/extending-nx/intro/getting-started` → `/docs/extending-nx/intro/getting-started` (404)
- `/extending-nx/tutorials` → `/docs/extending-nx/tutorials` (404)
- `/extending-nx/tutorials/organization-specific-plugin` → `/docs/extending-nx/tutorials/organization-specific-plugin` (404)
- `/extending-nx/tutorials/tooling-plugin` → `/docs/extending-nx/tutorials/tooling-plugin` (404)
- `/extending-nx/recipes` → `/docs/extending-nx/recipes` (404)
- `/extending-nx/recipes/local-generators` → `/docs/extending-nx/recipes/local-generators` (404)
- `/extending-nx/recipes/composing-generators` → `/docs/extending-nx/recipes/composing-generators` (404)
- `/extending-nx/recipes/generator-options` → `/docs/extending-nx/recipes/generator-options` (404)
... and 17 more

### /docs/features/* (1 broken)
- `/features/maintain-ts-monorepos` → `/docs/features/maintain-ts-monorepos` (404)

### /docs/getting-started/* (6 broken)
- `/getting-started/adding-to-existing` → `/docs/getting-started/adding-to-existing` (404)
- `/getting-started/ai-integration` → `/docs/getting-started/ai-integration` (404)
- `/getting-started/tutorials/typescript-packages-tutorial` → `/docs/getting-started/tutorials/typescript-packages-tutorial` (404)
- `/getting-started/tutorials/react-monorepo-tutorial` → `/docs/getting-started/tutorials/react-monorepo-tutorial` (404)
- `/getting-started/tutorials/angular-monorepo-tutorial` → `/docs/getting-started/tutorials/angular-monorepo-tutorial` (404)
- `/getting-started/tutorials/gradle-tutorial` → `/docs/getting-started/tutorials/gradle-tutorial` (404)

### /docs/nx-api/* (1 broken)
- `/nx-api/nx/documents/affected%23skip-nx-cache` → `/docs/nx-api/nx/documents/affected%23skip-nx-cache` (404)

### /docs/nx-enterprise/* (6 broken)
- `/nx-enterprise` → `/docs/nx-enterprise` (404)
- `/nx-enterprise/activate-powerpack` → `/docs/nx-enterprise/activate-powerpack` (404)
- `/nx-enterprise/powerpack` → `/docs/nx-enterprise/powerpack` (404)
- `/nx-enterprise/powerpack/licenses-and-trials` → `/docs/nx-enterprise/powerpack/licenses-and-trials` (404)
- `/nx-enterprise/powerpack/conformance` → `/docs/nx-enterprise/powerpack/conformance` (404)
- `/nx-enterprise/powerpack/owners` → `/docs/nx-enterprise/powerpack/owners` (404)

### /docs/recipes/* (67 broken)
- `/recipes` → `/docs/recipes` (404)
- `/recipes/installation` → `/docs/recipes/installation` (404)
- `/recipes/installation/install-non-javascript` → `/docs/recipes/installation/install-non-javascript` (404)
- `/recipes/installation/update-global-installation` → `/docs/recipes/installation/update-global-installation` (404)
- `/recipes/running-tasks` → `/docs/recipes/running-tasks` (404)
- `/recipes/running-tasks/configure-inputs` → `/docs/recipes/running-tasks/configure-inputs` (404)
- `/recipes/running-tasks/configure-outputs` → `/docs/recipes/running-tasks/configure-outputs` (404)
- `/recipes/running-tasks/defining-task-pipeline` → `/docs/recipes/running-tasks/defining-task-pipeline` (404)
- `/recipes/running-tasks/terminal-ui` → `/docs/recipes/running-tasks/terminal-ui` (404)
- `/recipes/running-tasks/run-commands-executor` → `/docs/recipes/running-tasks/run-commands-executor` (404)
... and 57 more

### /docs/reference/* (277 broken)
- `/reference/core-api` → `/docs/reference/core-api` (404)
- `/reference/core-api/nx` → `/docs/reference/core-api/nx` (404)
- `/reference/core-api/workspace` → `/docs/reference/core-api/workspace` (404)
- `/reference/core-api/owners` → `/docs/reference/core-api/owners` (404)
- `/reference/core-api/owners/overview` → `/docs/reference/core-api/owners/overview` (404)
- `/reference/core-api/conformance` → `/docs/reference/core-api/conformance` (404)
- `/reference/core-api/conformance/overview` → `/docs/reference/core-api/conformance/overview` (404)
- `/reference/core-api/conformance/create-conformance-rule` → `/docs/reference/core-api/conformance/create-conformance-rule` (404)
- `/reference/core-api/azure-cache` → `/docs/reference/core-api/azure-cache` (404)
- `/reference/core-api/azure-cache/overview` → `/docs/reference/core-api/azure-cache/overview` (404)
... and 267 more

### /docs/see-also/* (2 broken)
- `/see-also` → `/docs/see-also` (404)
- `/see-also/sitemap` → `/docs/see-also/sitemap` (404)

### /docs/showcase/* (22 broken)
- `/showcase` → `/docs/showcase` (404)
- `/showcase/example-repos` → `/docs/showcase/example-repos` (404)
- `/showcase/example-repos/add-express` → `/docs/showcase/example-repos/add-express` (404)
- `/showcase/example-repos/add-lit` → `/docs/showcase/example-repos/add-lit` (404)
- `/showcase/example-repos/add-solid` → `/docs/showcase/example-repos/add-solid` (404)
- `/showcase/example-repos/add-qwik` → `/docs/showcase/example-repos/add-qwik` (404)
- `/showcase/example-repos/add-rust` → `/docs/showcase/example-repos/add-rust` (404)
- `/showcase/example-repos/add-dotnet` → `/docs/showcase/example-repos/add-dotnet` (404)
- `/showcase/example-repos/add-astro` → `/docs/showcase/example-repos/add-astro` (404)
- `/showcase/example-repos/add-svelte` → `/docs/showcase/example-repos/add-svelte` (404)
... and 12 more

### /docs/technologies/* (450 broken)
- `/technologies/typescript/recipes` → `/docs/technologies/typescript/recipes` (404)
- `/technologies/typescript/recipes/switch-to-workspaces-project-references` → `/docs/technologies/typescript/recipes/switch-to-workspaces-project-references` (404)
- `/technologies/typescript/recipes/enable-tsc-batch-mode` → `/docs/technologies/typescript/recipes/enable-tsc-batch-mode` (404)
- `/technologies/typescript/recipes/define-secondary-entrypoints` → `/docs/technologies/typescript/recipes/define-secondary-entrypoints` (404)
- `/technologies/typescript/recipes/compile-multiple-formats` → `/docs/technologies/typescript/recipes/compile-multiple-formats` (404)
- `/technologies/typescript/recipes/js-and-ts` → `/docs/technologies/typescript/recipes/js-and-ts` (404)
- `/technologies/typescript/api` → `/docs/technologies/typescript/api` (404)
- `/technologies/angular/recipes` → `/docs/technologies/angular/recipes` (404)
- `/technologies/angular/recipes/use-environment-variables-in-angular` → `/docs/technologies/angular/recipes/use-environment-variables-in-angular` (404)
- `/technologies/angular/recipes/using-tailwind-css-with-angular-projects` → `/docs/technologies/angular/recipes/using-tailwind-css-with-angular-projects` (404)
... and 440 more

### /docs/troubleshooting/* (1 broken)
- `/troubleshooting/convert-to-inferred` → `/docs/troubleshooting/convert-to-inferred` (404)

## KEY INSIGHT

Only **123 out of 1078 (11.4%)** redirect rules are correctly configured for the Astro docs migration.

The remaining 955 rules either:
- Point to non-/docs/* URLs (0 rules)
- Point to /docs/* URLs that don't exist (955 rules)

## RECOMMENDATION

1. Fix the 0 redirects that don't point to `/docs/*`
2. Create the missing content for 955 broken `/docs/*` URLs
3. Or update these redirects to point to existing `/docs/*` pages
