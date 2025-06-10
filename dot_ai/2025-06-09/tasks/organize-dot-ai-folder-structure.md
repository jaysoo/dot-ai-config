# Organize dot_ai Folder Structure

## Task Description
Reorganize the dot_ai folder so that each yyyy-mm-dd folder contains three nested folders:
- `tasks/` - Files created after running plan-task.md
- `specs/` - Files created after running brainstorm.md (contain "spec" in filename)
- `dictations/` - Files created after running dictate.md

**Special case**: SUMMARY.md files stay in the parent yyyy-mm-dd folder

## File Categorization Summary

### Total Files: 97 (excluding subdirectories)
- **Stay in parent folder**: 7 SUMMARY.md files
- **To specs/**: 1 file
- **To dictations/**: 3 files (already in correct location)
- **To tasks/**: 86 files

## Detailed File Mapping

### 2025-06-02 (25 files: 1 stays, 24 to tasks/)
```
dot_ai/2025-06-02/SUMMARY.md → (STAYS IN PLACE)
dot_ai/2025-06-02/analysis-results.json → dot_ai/2025-06-02/tasks/analysis-results.json
dot_ai/2025-06-02/compare-redirects.js → dot_ai/2025-06-02/tasks/compare-redirects.js
dot_ai/2025-06-02/final-comparison.js → dot_ai/2025-06-02/tasks/final-comparison.js
dot_ai/2025-06-02/generate-redirects.js → dot_ai/2025-06-02/tasks/generate-redirects.js
dot_ai/2025-06-02/migration-report.md → dot_ai/2025-06-02/tasks/migration-report.md
dot_ai/2025-06-02/parse-sitemap.js → dot_ai/2025-06-02/tasks/parse-sitemap.js
dot_ai/2025-06-02/redirects-apache.htaccess → dot_ai/2025-06-02/tasks/redirects-apache.htaccess
dot_ai/2025-06-02/redirects-cloudflare.json → dot_ai/2025-06-02/tasks/redirects-cloudflare.json
dot_ai/2025-06-02/redirects-final.js → dot_ai/2025-06-02/tasks/redirects-final.js
dot_ai/2025-06-02/redirects-nextjs.json → dot_ai/2025-06-02/tasks/redirects-nextjs.json
dot_ai/2025-06-02/redirects-nginx.conf → dot_ai/2025-06-02/tasks/redirects-nginx.conf
dot_ai/2025-06-02/redirects-optimized.js → dot_ai/2025-06-02/tasks/redirects-optimized.js
dot_ai/2025-06-02/redirects-simple.js → dot_ai/2025-06-02/tasks/redirects-simple.js
dot_ai/2025-06-02/redirects.js → dot_ai/2025-06-02/tasks/redirects.js
dot_ai/2025-06-02/redirects.md → dot_ai/2025-06-02/tasks/redirects.md
dot_ai/2025-06-02/run-analysis.js → dot_ai/2025-06-02/tasks/run-analysis.js
dot_ai/2025-06-02/sitemap-analyzer.js → dot_ai/2025-06-02/tasks/sitemap-analyzer.js
dot_ai/2025-06-02/sitemap-canary.xml → dot_ai/2025-06-02/tasks/sitemap-canary.xml
dot_ai/2025-06-02/sitemap-latest.xml → dot_ai/2025-06-02/tasks/sitemap-latest.xml
dot_ai/2025-06-02/url-matcher.js → dot_ai/2025-06-02/tasks/url-matcher.js
dot_ai/2025-06-02/url-matches.json → dot_ai/2025-06-02/tasks/url-matches.json
dot_ai/2025-06-02/usage-example.js → dot_ai/2025-06-02/tasks/usage-example.js
dot_ai/2025-06-02/validate-urls.js → dot_ai/2025-06-02/tasks/validate-urls.js
dot_ai/2025-06-02/validate-urls.zip → dot_ai/2025-06-02/tasks/validate-urls.zip
```

### 2025-06-03 (4 files: 1 stays, 3 to tasks/)
```
dot_ai/2025-06-03/SUMMARY.md → (STAYS IN PLACE)
dot_ai/2025-06-03/check-sitemap-urls.js → dot_ai/2025-06-03/tasks/check-sitemap-urls.js
dot_ai/2025-06-03/failed_url.txt → dot_ai/2025-06-03/tasks/failed_url.txt
dot_ai/2025-06-03/urls-to-check.txt → dot_ai/2025-06-03/tasks/urls-to-check.txt
```

### 2025-06-04 (28 files: 1 stays, 25 to tasks/, 2 dictations stay in place)
```
# Files that stay in place
dot_ai/2025-06-04/SUMMARY.md → (STAYS IN PLACE)
dot_ai/2025-06-04/dictations/nx-getting-started-improvement.md → (NO CHANGE)
dot_ai/2025-06-04/dictations/simplifying-nx-getting-started-experience.md → (NO CHANGE)

# Files to move to tasks/
dot_ai/2025-06-04/analyze-intro-page.mjs → dot_ai/2025-06-04/tasks/analyze-intro-page.mjs
dot_ai/2025-06-04/bad-urls.txt → dot_ai/2025-06-04/tasks/bad-urls.txt
dot_ai/2025-06-04/check-nx-urls.sh → dot_ai/2025-06-04/tasks/check-nx-urls.sh
dot_ai/2025-06-04/content-migration-map.md → dot_ai/2025-06-04/tasks/content-migration-map.md
dot_ai/2025-06-04/extract-canary-nx-urls.md → dot_ai/2025-06-04/tasks/extract-canary-nx-urls.md
dot_ai/2025-06-04/extract-urls.mjs → dot_ai/2025-06-04/tasks/extract-urls.mjs
dot_ai/2025-06-04/intro-page-wireframe.md → dot_ai/2025-06-04/tasks/intro-page-wireframe.md
dot_ai/2025-06-04/intro-simplified-draft.md → dot_ai/2025-06-04/tasks/intro-simplified-draft.md
dot_ai/2025-06-04/invalid-urls.md → dot_ai/2025-06-04/tasks/invalid-urls.md
dot_ai/2025-06-04/nx-sitemap-urls.txt → dot_ai/2025-06-04/tasks/nx-sitemap-urls.txt
dot_ai/2025-06-04/package-lock.json → dot_ai/2025-06-04/tasks/package-lock.json
dot_ai/2025-06-04/package.json → dot_ai/2025-06-04/tasks/package.json
dot_ai/2025-06-04/phase-1-deliverables.md → dot_ai/2025-06-04/tasks/phase-1-deliverables.md
dot_ai/2025-06-04/phase-1-recommendations-summary.md → dot_ai/2025-06-04/tasks/phase-1-recommendations-summary.md
dot_ai/2025-06-04/phase-1-simplify-intro-page.md → dot_ai/2025-06-04/tasks/phase-1-simplify-intro-page.md
dot_ai/2025-06-04/redirect-urls.txt → dot_ai/2025-06-04/tasks/redirect-urls.txt
dot_ai/2025-06-04/remap.md → dot_ai/2025-06-04/tasks/remap.md
dot_ai/2025-06-04/update-docs-redirects.md → dot_ai/2025-06-04/tasks/update-docs-redirects.md
dot_ai/2025-06-04/update-docs-urls.js → dot_ai/2025-06-04/tasks/update-docs-urls.js
dot_ai/2025-06-04/updated-docs.json → dot_ai/2025-06-04/tasks/updated-docs.json
dot_ai/2025-06-04/url-verification-report.md → dot_ai/2025-06-04/tasks/url-verification-report.md
dot_ai/2025-06-04/v0-mockup-prompt.md → dot_ai/2025-06-04/tasks/v0-mockup-prompt.md
dot_ai/2025-06-04/verified-urls.md → dot_ai/2025-06-04/tasks/verified-urls.md
dot_ai/2025-06-04/verify-updated-urls.js → dot_ai/2025-06-04/tasks/verify-updated-urls.js
dot_ai/2025-06-04/verify-updated-urls.sh → dot_ai/2025-06-04/tasks/verify-updated-urls.sh
dot_ai/2025-06-04/working-urls.txt → dot_ai/2025-06-04/tasks/working-urls.txt
```

### 2025-06-05 (19 files: 1 stays, 17 to tasks/, 1 dictation stays in place)
```
# Files that stay in place
dot_ai/2025-06-05/SUMMARY.md → (STAYS IN PLACE)
dot_ai/2025-06-05/dictations/raw-docs-system-concept.md → (NO CHANGE)

# Files to move to tasks/
dot_ai/2025-06-05/ai-docs-research-analysis.mjs → dot_ai/2025-06-05/tasks/ai-docs-research-analysis.mjs
dot_ai/2025-06-05/analyze-competitor-docs.mjs → dot_ai/2025-06-05/tasks/analyze-competitor-docs.mjs
dot_ai/2025-06-05/automated-docs-management-plan.md → dot_ai/2025-06-05/tasks/automated-docs-management-plan.md
dot_ai/2025-06-05/change-detection-prototype.mjs → dot_ai/2025-06-05/tasks/change-detection-prototype.mjs
dot_ai/2025-06-05/check-node-version.mjs → dot_ai/2025-06-05/tasks/check-node-version.mjs
dot_ai/2025-06-05/check-npm-package.mjs → dot_ai/2025-06-05/tasks/check-npm-package.mjs
dot_ai/2025-06-05/create-ci-workflow-for-deb-testing.md → dot_ai/2025-06-05/tasks/create-ci-workflow-for-deb-testing.md
dot_ai/2025-06-05/fix-debian-npm-dependency.md → dot_ai/2025-06-05/tasks/fix-debian-npm-dependency.md
dot_ai/2025-06-05/fix-launchpad-publish-pipeline.md → dot_ai/2025-06-05/tasks/fix-launchpad-publish-pipeline.md
dot_ai/2025-06-05/getting-started-mockup.html → dot_ai/2025-06-05/tasks/getting-started-mockup.html
dot_ai/2025-06-05/node-version-check-feature.md → dot_ai/2025-06-05/tasks/node-version-check-feature.md
dot_ai/2025-06-05/nodejs-version-check.md → dot_ai/2025-06-05/tasks/nodejs-version-check.md
dot_ai/2025-06-05/nx-getting-started-experience-improvement.md → dot_ai/2025-06-05/tasks/nx-getting-started-experience-improvement.md
dot_ai/2025-06-05/nx-wrapper-example.sh → dot_ai/2025-06-05/tasks/nx-wrapper-example.sh
dot_ai/2025-06-05/nx-wrapper-with-version-check.sh → dot_ai/2025-06-05/tasks/nx-wrapper-with-version-check.sh
dot_ai/2025-06-05/sync-engine-prototype.mjs → dot_ai/2025-06-05/tasks/sync-engine-prototype.mjs
dot_ai/2025-06-05/test-version-check.sh → dot_ai/2025-06-05/tasks/test-version-check.sh
dot_ai/2025-06-05/todays-analysis-checklist.md → dot_ai/2025-06-05/tasks/todays-analysis-checklist.md
```

### 2025-06-06 (7 files: 1 stays, 6 to tasks/)
```
dot_ai/2025-06-06/SUMMARY.md → (STAYS IN PLACE)
dot_ai/2025-06-06/extract-nx-prerelease-versions.md → dot_ai/2025-06-06/tasks/extract-nx-prerelease-versions.md
dot_ai/2025-06-06/extract-versions.mjs → dot_ai/2025-06-06/tasks/extract-versions.mjs
dot_ai/2025-06-06/fix-launchpad-publish-pipeline.md → dot_ai/2025-06-06/tasks/fix-launchpad-publish-pipeline.md
dot_ai/2025-06-06/fix-ppa-hermetic-build.md → dot_ai/2025-06-06/tasks/fix-ppa-hermetic-build.md
dot_ai/2025-06-06/implementation-summary.md → dot_ai/2025-06-06/tasks/implementation-summary.md
dot_ai/2025-06-06/nx-versions.txt → dot_ai/2025-06-06/tasks/nx-versions.txt
```

### 2025-06-07 (2 files: 1 stays, 1 to tasks/)
```
dot_ai/2025-06-07/SUMMARY.md → (STAYS IN PLACE)
dot_ai/2025-06-07/nx_21_1_versions.txt → dot_ai/2025-06-07/tasks/nx_21_1_versions.txt
```

### 2025-06-09 (8 files: 1 stays, 6 to tasks/, 1 to specs/)
```
# Files that stay in place
dot_ai/2025-06-09/SUMMARY-raw-docs-phase-1.md → (STAYS IN PLACE - note: this is a special SUMMARY file)

# Files to move to tasks/
dot_ai/2025-06-09/fix-mcp-server-base-path-and-http.md → dot_ai/2025-06-09/tasks/fix-mcp-server-base-path-and-http.md
dot_ai/2025-06-09/mcp-http-research.mjs → dot_ai/2025-06-09/tasks/mcp-http-research.mjs
dot_ai/2025-06-09/mcp-server-plan.md → dot_ai/2025-06-09/tasks/mcp-server-plan.md
dot_ai/2025-06-09/organize-dot-ai-folder-structure.md → dot_ai/2025-06-09/tasks/organize-dot-ai-folder-structure.md
dot_ai/2025-06-09/phase-1-raw-docs-implementation.md → dot_ai/2025-06-09/tasks/phase-1-raw-docs-implementation.md
dot_ai/2025-06-09/raw-docs-example/ → dot_ai/2025-06-09/tasks/raw-docs-example/ (entire directory)

# File to move to specs/
dot_ai/2025-06-09/raw-docs-system-spec.md → dot_ai/2025-06-09/specs/raw-docs-system-spec.md
```

## Implementation Steps

1. Create the three subdirectories (tasks/, specs/, dictations/) in each yyyy-mm-dd folder
2. Move files according to the mapping above, keeping SUMMARY.md files in place
3. Verify all files have been moved correctly
4. Update any references to moved files if necessary

## Special Notes

- **SUMMARY.md files**: All SUMMARY.md files (including SUMMARY-raw-docs-phase-1.md) stay in the parent yyyy-mm-dd folder
- **Existing dictations**: The dictations folders in 2025-06-04 and 2025-06-05 are already correctly placed
- **raw-docs-example**: This entire directory in 2025-06-09 should be moved as a unit to the tasks folder

## Expected Outcome
- Each yyyy-mm-dd folder will have:
  - SUMMARY.md file(s) at the root level
  - Three subdirectories: tasks/, specs/, dictations/
- Files will be organized based on their creation context
- No files will be lost during reorganization
- Better organization for future reference and understanding