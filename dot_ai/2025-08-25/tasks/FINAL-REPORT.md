# COMPREHENSIVE REDIRECT VERIFICATION REPORT
Generated: 2025-08-25T20:03:19.115Z
Source: nx-dev/nx-dev/redirect-rules-docs-to-astro.js
Target: https://canary.nx.dev

================================================================================

## EXECUTIVE SUMMARY

Total redirect rules analyzed: 1078
- ✅ Working redirects (200 OK): 123 (11.4%)
- ❌ Broken redirects: 955 (88.6%)
- 🔄 Redirected URLs: 0 (0%)

================================================================================

## WORKING REDIRECTS (123 URLs)

These redirects are functioning correctly with new URLs returning 200 OK:


### CONCEPTS Section (20 working)

✅ /concepts/how-caching-works -> /docs/concepts/how-caching-works
✅ /concepts/types-of-configuration -> /docs/concepts/types-of-configuration
✅ /concepts -> /docs/concepts
✅ /concepts/nx-plugins -> /docs/concepts/nx-plugins
✅ /concepts/inferred-tasks -> /docs/concepts/inferred-tasks
✅ /concepts/mental-model -> /docs/concepts/mental-model
✅ /concepts/task-pipeline-configuration -> /docs/concepts/task-pipeline-configuration
✅ /concepts/decisions -> /docs/concepts/decisions
✅ /concepts/decisions/dependency-management -> /docs/concepts/decisions/dependency-management
✅ /concepts/common-tasks -> /docs/concepts/common-tasks
... and 10 more

### FEATURES Section (10 working)

✅ /features -> /docs/features
✅ /features/explore-graph -> /docs/features/explore-graph
✅ /features/enhance-AI -> /docs/features/enhance-AI
✅ /features/cache-task-results -> /docs/features/cache-task-results
✅ /features/run-tasks -> /docs/features/run-tasks
✅ /features/manage-releases -> /docs/features/manage-releases
✅ /features/generate-code -> /docs/features/generate-code
✅ /features/enforce-module-boundaries -> /docs/features/enforce-module-boundaries
✅ /features/ci-features -> /docs/features/ci-features
✅ /features/automate-updating-dependencies -> /docs/features/automate-updating-dependencies

### GETTING-STARTED Section (6 working)

✅ /getting-started/installation -> /docs/getting-started/installation
✅ /getting-started/start-new-project -> /docs/getting-started/start-new-project
✅ /getting-started/intro -> /docs/getting-started/intro
✅ /getting-started/editor-setup -> /docs/getting-started/editor-setup
✅ /getting-started -> /docs/getting-started
✅ /getting-started/tutorials -> /docs/getting-started/tutorials

### PLUGIN-REGISTRY Section (1 working)

✅ /plugin-registry -> /docs/plugin-registry

### REFERENCE Section (13 working)

✅ /reference/glossary -> /docs/reference/glossary
✅ /reference -> /docs/reference
✅ /reference/environment-variables -> /docs/reference/environment-variables
✅ /reference/nx-commands -> /docs/reference/nx-commands
✅ /reference/inputs -> /docs/reference/inputs
✅ /reference/nxignore -> /docs/reference/nxignore
✅ /reference/nx-json -> /docs/reference/nx-json
✅ /reference/project-configuration -> /docs/reference/project-configuration
✅ /reference/releases -> /docs/reference/releases
✅ /reference/nx-json%23inputs-namedinputs -> /docs/reference/nx-json%23inputs-namedinputs
... and 3 more

### TECHNOLOGIES Section (67 working)

✅ /technologies/typescript -> /docs/technologies/typescript
✅ /technologies/typescript/introduction -> /docs/technologies/typescript/introduction
✅ /technologies -> /docs/technologies
✅ /technologies/angular/introduction -> /docs/technologies/angular/introduction
✅ /technologies/angular/migration -> /docs/technologies/angular/migration
✅ /technologies/angular/migration/angular -> /docs/technologies/angular/migration/angular
✅ /technologies/angular -> /docs/technologies/angular
✅ /technologies/angular/migration/angular-multiple -> /docs/technologies/angular/migration/angular-multiple
✅ /technologies/angular/angular-rspack -> /docs/technologies/angular/angular-rspack
✅ /technologies/angular/angular-rspack/introduction -> /docs/technologies/angular/angular-rspack/introduction
... and 57 more

### TROUBLESHOOTING Section (6 working)

✅ /troubleshooting/resolve-circular-dependencies -> /docs/troubleshooting/resolve-circular-dependencies
✅ /troubleshooting/performance-profiling -> /docs/troubleshooting/performance-profiling
✅ /troubleshooting -> /docs/troubleshooting
✅ /troubleshooting/troubleshoot-nx-install-issues -> /docs/troubleshooting/troubleshoot-nx-install-issues
✅ /troubleshooting/troubleshoot-cache-misses -> /docs/troubleshooting/troubleshoot-cache-misses
✅ /troubleshooting/unknown-local-cache -> /docs/troubleshooting/unknown-local-cache

================================================================================

## BROKEN REDIRECTS ANALYSIS (955 URLs)

### Phase 2: Content File Matching

Searched astro-docs/src/content for matching content files:
- 📁 Total content files found: 354
- ✅ Exact path matches: 0
- 🔄 Partial/relocated matches: 866
- ❌ No content matches: 89

#### Sample Partial Matches (content exists at different path):

Original: /getting-started/adding-to-existing
Expected: /docs/getting-started/adding-to-existing
Found at: /docs/getting-started/Tutorials/angular-monorepo
File: astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo.mdoc

Original: /getting-started/ai-integration
Expected: /docs/getting-started/ai-integration
Found at: /docs/getting-started/Tutorials/angular-monorepo
File: astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo.mdoc

Original: /getting-started/tutorials/react-monorepo-tutorial
Expected: /docs/getting-started/tutorials/react-monorepo-tutorial
Found at: /docs/getting-started/Tutorials/angular-monorepo
File: astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo.mdoc

Original: /getting-started/tutorials/gradle-tutorial
Expected: /docs/getting-started/tutorials/gradle-tutorial
Found at: /docs/getting-started/Tutorials/angular-monorepo
File: astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo.mdoc

Original: /getting-started/tutorials/angular-monorepo-tutorial
Expected: /docs/getting-started/tutorials/angular-monorepo-tutorial
Found at: /docs/getting-started/Tutorials/angular-monorepo
File: astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo.mdoc

Original: /getting-started/tutorials/typescript-packages-tutorial
Expected: /docs/getting-started/tutorials/typescript-packages-tutorial
Found at: /docs/getting-started/Tutorials/angular-monorepo
File: astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo.mdoc

Original: /features/maintain-ts-monorepos
Expected: /docs/features/maintain-ts-monorepos
Found at: /docs/features/CI Features/affected
File: astro-docs/src/content/docs/features/CI Features/affected.mdoc

Original: /recipes/installation
Expected: /docs/recipes/installation
Found at: /docs/getting-started/installation
File: astro-docs/src/content/docs/getting-started/installation.mdoc

Original: /recipes/installation/install-non-javascript
Expected: /docs/recipes/installation/install-non-javascript
Found at: /docs/guides/Installation/install-non-javascript
File: astro-docs/src/content/docs/guides/Installation/install-non-javascript.mdoc

Original: /recipes/installation/update-global-installation
Expected: /docs/recipes/installation/update-global-installation
Found at: /docs/guides/Installation/update-global-installation
File: astro-docs/src/content/docs/guides/Installation/update-global-installation.mdoc


### Phase 3: Sitemap Matching

Checked https://canary.nx.dev/docs/sitemap-0.xml for remaining 89 URLs:
- 🌐 Total URLs in sitemap: 555
- ✅ Found in sitemap: 6
- ❌ Not found in sitemap: 83

#### Sample Sitemap Matches:

/recipes/adopting-nx -> /docs/guides/adopting-nx (partial match)
/recipes/nx-release -> /docs/guides/nx-release (partial match)
/recipes/nx-console -> /docs/guides/nx-console (partial match)
/nx-enterprise/powerpack -> /docs/reference/powerpack (partial match)
/showcase/benchmarks -> /docs/reference/benchmarks (partial match)
/extending-nx/tutorials -> /docs/getting-started/tutorials (partial match)

================================================================================

## BROKEN LINKS LIST

The following categories of broken redirects were identified:

### 1. Content Exists but URL Structure Changed (866 URLs)
These can be fixed by updating the redirect target to the new location.

### 2. Content Not Found Anywhere (83 URLs)
These may require content migration or should be removed from redirects.

### 3. Requires Manual Review (0 URLs)
Content appears to exist at the expected path but URL returns 404.


### DETAILED BROKEN LINKS LIST

#### FIXABLE (872 URLs) - Update redirect target

"/getting-started/adding-to-existing": "/docs/getting-started/Tutorials/angular-monorepo",
"/getting-started/ai-integration": "/docs/getting-started/Tutorials/angular-monorepo",
"/getting-started/tutorials/react-monorepo-tutorial": "/docs/getting-started/Tutorials/angular-monorepo",
"/getting-started/tutorials/gradle-tutorial": "/docs/getting-started/Tutorials/angular-monorepo",
"/getting-started/tutorials/angular-monorepo-tutorial": "/docs/getting-started/Tutorials/angular-monorepo",
"/getting-started/tutorials/typescript-packages-tutorial": "/docs/getting-started/Tutorials/angular-monorepo",
"/features/maintain-ts-monorepos": "/docs/features/CI Features/affected",
"/recipes/installation": "/docs/getting-started/installation",
"/recipes/installation/install-non-javascript": "/docs/guides/Installation/install-non-javascript",
"/recipes/installation/update-global-installation": "/docs/guides/Installation/update-global-installation",
"/recipes/running-tasks/root-level-scripts": "/docs/guides/Tasks & Caching/root-level-scripts",
"/recipes/running-tasks/defining-task-pipeline": "/docs/guides/Tasks & Caching/defining-task-pipeline",
"/recipes/running-tasks/run-tasks-in-parallel": "/docs/guides/Tasks & Caching/run-tasks-in-parallel",
"/recipes/running-tasks/configure-outputs": "/docs/guides/Tasks & Caching/configure-outputs",
"/recipes/running-tasks/pass-args-to-commands": "/docs/guides/Tasks & Caching/pass-args-to-commands",
"/recipes/running-tasks/run-commands-executor": "/docs/guides/Tasks & Caching/run-commands-executor",
"/recipes/running-tasks/terminal-ui": "/docs/guides/Tasks & Caching/terminal-ui",
"/recipes/running-tasks/workspace-watching": "/docs/guides/Tasks & Caching/workspace-watching",
"/recipes/running-tasks/configure-inputs": "/docs/guides/Tasks & Caching/configure-inputs",
"/recipes/adopting-nx/import-project": "/docs/guides/Adopting Nx/import-project",
"/recipes/running-tasks/reduce-repetitive-configuration": "/docs/guides/Tasks & Caching/reduce-repetitive-configuration",
"/recipes/running-tasks/convert-to-inferred": "/docs/guides/Tasks & Caching/convert-to-inferred",
"/recipes/adopting-nx/from-turborepo": "/docs/guides/Adopting Nx/from-turborepo",
"/recipes/adopting-nx/adding-to-monorepo": "/docs/guides/Adopting Nx/adding-to-monorepo",
"/recipes/running-tasks/self-hosted-caching": "/docs/guides/Tasks & Caching/self-hosted-caching",
"/recipes/adopting-nx": "/docs/guides/adopting-nx",
"/recipes/running-tasks/skipping-cache": "/docs/guides/Tasks & Caching/skipping-cache",
"/recipes/running-tasks/change-cache-location": "/docs/guides/Tasks & Caching/change-cache-location",
"/recipes/adopting-nx/adding-to-existing-project": "/docs/guides/Adopting Nx/adding-to-existing-project",
"/recipes/nx-release/publish-rust-crates": "/docs/guides/Nx Release/publish-rust-crates",
"/recipes/adopting-nx/manual": "/docs/guides/Adopting Nx/manual",
"/recipes/nx-release/release-npm-packages": "/docs/guides/Nx Release/release-npm-packages",
"/recipes/nx-release/updating-version-references": "/docs/guides/Nx Release/updating-version-references",
"/recipes/nx-release/customize-conventional-commit-types": "/docs/guides/Nx Release/customize-conventional-commit-types",
"/recipes/nx-release/automatically-version-with-conventional-commits": "/docs/guides/Nx Release/automatically-version-with-conventional-commits",
"/recipes/nx-release/release-docker-images": "/docs/guides/Nx Release/release-docker-images",
"/recipes/nx-release": "/docs/guides/nx-release",
"/recipes/nx-release/release-projects-independently": "/docs/guides/Nx Release/release-projects-independently",
"/recipes/adopting-nx/preserving-git-histories": "/docs/guides/Adopting Nx/preserving-git-histories",
"/recipes/nx-release/automate-gitlab-releases": "/docs/guides/Nx Release/automate-gitlab-releases",
"/recipes/nx-release/file-based-versioning-version-plans": "/docs/guides/Nx Release/file-based-versioning-version-plans",
"/recipes/nx-release/configure-changelog-format": "/docs/guides/Nx Release/configure-changelog-format",
"/recipes/nx-release/configuration-version-prefix": "/docs/guides/Nx Release/configuration-version-prefix",
"/recipes/nx-console": "/docs/guides/nx-console",
"/recipes/nx-release/build-before-versioning": "/docs/guides/Nx Release/build-before-versioning",
"/recipes/nx-release/automate-github-releases": "/docs/guides/Nx Release/automate-github-releases",
"/recipes/nx-release/update-local-registry-setup": "/docs/guides/Nx Release/update-local-registry-setup",
"/recipes/nx-release/configure-custom-registries": "/docs/guides/Nx Release/configure-custom-registries",
"/recipes/nx-release/publish-in-ci-cd": "/docs/guides/Nx Release/publish-in-ci-cd",
"/recipes/nx-console/console-generate-command": "/docs/guides/Nx Console/console-generate-command",

... and 822 more fixable redirects

#### NEEDS CONTENT MIGRATION (83 URLs)


/extending-nx (1 URLs):
  /extending-nx -> /docs/extending-nx

/ci (1 URLs):
  /ci -> /docs/ci

/recipes (1 URLs):
  /recipes -> /docs/recipes

/recipes/running-tasks (1 URLs):
  /recipes/running-tasks -> /docs/recipes/running-tasks

/recipes/tips-n-tricks (1 URLs):
  /recipes/tips-n-tricks -> /docs/recipes/tips-n-tricks

/nx-enterprise (1 URLs):
  /nx-enterprise -> /docs/nx-enterprise

/showcase/example-repos (17 URLs):
  /showcase/example-repos -> /docs/showcase/example-repos
  /showcase/example-repos/add-astro -> /docs/showcase/example-repos/add-astro
  /showcase/example-repos/add-dotnet -> /docs/showcase/example-repos/add-dotnet
  /showcase/example-repos/add-lit -> /docs/showcase/example-repos/add-lit
  /showcase/example-repos/add-solid -> /docs/showcase/example-repos/add-solid
  ... and 12 more

/showcase (1 URLs):
  /showcase -> /docs/showcase

/deprecated/affected-graph (1 URLs):
  /deprecated/affected-graph -> /docs/deprecated/affected-graph

/deprecated (1 URLs):
  /deprecated -> /docs/deprecated

/deprecated/print-affected (1 URLs):
  /deprecated/print-affected -> /docs/deprecated/print-affected

/deprecated/legacy-cache (1 URLs):
  /deprecated/legacy-cache -> /docs/deprecated/legacy-cache

/deprecated/workspace-generators (1 URLs):
  /deprecated/workspace-generators -> /docs/deprecated/workspace-generators

/deprecated/workspace-executors (1 URLs):
  /deprecated/workspace-executors -> /docs/deprecated/workspace-executors

/deprecated/npm-scope (1 URLs):
  /deprecated/npm-scope -> /docs/deprecated/npm-scope

/deprecated/as-provided-vs-derived (1 URLs):
  /deprecated/as-provided-vs-derived -> /docs/deprecated/as-provided-vs-derived

/deprecated/cacheable-operations (1 URLs):
  /deprecated/cacheable-operations -> /docs/deprecated/cacheable-operations

/deprecated/runtime-cache-inputs (1 URLs):
  /deprecated/runtime-cache-inputs -> /docs/deprecated/runtime-cache-inputs

/deprecated/workspace-json (1 URLs):
  /deprecated/workspace-json -> /docs/deprecated/workspace-json

/deprecated/custom-tasks-runner (1 URLs):
  /deprecated/custom-tasks-runner -> /docs/deprecated/custom-tasks-runner

#### REQUIRES INVESTIGATION (0 URLs)
These have content files but URLs return 404:


================================================================================

## RECOMMENDATIONS

1. **Immediate Actions:**
   - Apply the 872 fixable redirects by updating targets
   - Investigate the 0 URLs that have content but return 404

2. **Content Migration:**
   - Review 83 URLs that need content migration
   - Priority sections: /extending-nx, /ci, /recipes, /recipes/running-tasks, /recipes/tips-n-tricks

3. **Validation:**
   - After fixes, re-run verification to ensure all redirects work
   - Consider adding automated tests for critical redirects

================================================================================

## FILES GENERATED

1. url-verification-report.json - Detailed URL verification results
2. content-match-report.json - Content file matching analysis
3. sitemap-match-report.json - Sitemap matching results
4. working-redirects.txt - List of working redirects
5. broken-urls.txt - List of broken URLs
6. suggested-redirect-fixes.txt - Suggested fixes from content matching
7. sitemap-suggested-fixes.txt - Suggested fixes from sitemap matching
8. FINAL-REPORT.md - This comprehensive report

================================================================================
