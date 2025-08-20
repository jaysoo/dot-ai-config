# TODO

## In Progress

- [ ] Review PR #8300 for Austin - Powerpack Conformance Allow Option (2025-08-20 15:16)
  - PR: https://github.com/nrwl/ocean/pull/8300
  - Linear Issue: NXC-2951
  - Review scheduled for: Thursday, August 21, 2025
  - Notes: `dot_ai/2025-08-20/dictations/pr-review-austin-conformance.md`
  - Goal: Review new `allow` option for Powerpack conformance, verify Mailchimp fix
- [ ] Review Linear Stale Issues for Nx CLI Team (2025-08-19 08:50)
  - Plan created: `dot_ai/2025-08-19/tasks/linear-stale-issues-review.md`
  - Goal: Identify and review stale issues in Linear that haven't been updated in 3+ months
  - Next steps: Review with assignees, close/update stale issues
- [ ] Check on this disabled test e2e/nx-init/src/nx-init-nest.test.ts (https://github.com/nestjs/nest-cli/issues/3110)

## Completed

### August 2025

- [x] DOC-135: Fix H1 and Frontmatter Title Mismatch (2025-08-20 09:12)
  - Plan created: `.ai/2025-08-20/tasks/doc-135-h1-title-fix.md`
  - Goal: Remove h1 headings from mdoc files to improve visual distinction between titles and h2
  - Result: Updated 7 files - removed h1 headings, preserved sidebar labels

- [x] Docker Tagging and Publishing Investigation (2025-08-19 11:13)
  - Plan created: `.ai/2025-08-19/tasks/docker-tagging-publishing-investigation.md`
  - Goal: Understand complete Docker tagging, pushing, and publishing flow with CalVer scheme
  - Result: Documented complete flow, identified CalVer implementation in build-and-publish-to-snapshot.sh

- [x] DOC-111: Update Astro Docs Header to Match Production (2025-08-13)
  - Plan created: Work completed in nx-worktrees/DOC-111 branch
  - Goal: Update Astro docs site header to match production nx.dev header
  - Result: Successfully created custom header with version switcher, resources dropdown, proper navigation
  - Commit: 4e276a8c74 - docs(nx-dev): make header more consistent with prod headers

- [x] DOC-110: Create Index Pages for All Astro Docs Guides (2025-08-13)
  - Goal: Create comprehensive index pages for all Astro docs sections
  - Result: Created 21 new index pages across the guides section
  - Status: All files created with proper frontmatter and navigation integration

- [x] Documentation Callout Migration Fix (2025-08-12)
  - Branch: DOC-110
  - Goal: Revert aside tags back to deepdive callout format
  - Result: Successfully reverted 6 deepdive callouts across 5 files

- [x] Add All Markdoc Tags to Astro Docs Site (2025-08-08)
  - Plan created: `dot_ai/2025-08-08/tasks/add-markdoc-tags.md`
  - Branch: DOC-68
  - Goal: Add support for all markdoc custom tags from nx-dev/ui-markdoc
  - Result: Successfully integrated all 27 tags with Astro wrapper components

- [x] Fix Astro Component Children Props (2025-08-08)
  - Goal: Update Astro components to pass <slot/> as children to React components
  - Result: Updated 5 components (Personas, Cards, Testimonial, etc.)
  - Commit: 9b896d6314 - docs(misc): pass children as props from Astro to React

- [x] Debug Cookie Prompt Not Rendering (2025-08-01)
  - Plan created: `dot_ai/2025-08-01/tasks/cookie-prompt-not-rendering.md`
  - Goal: Fix issue where Cookiebot script is not rendering in nx-dev website HTML source
  - Result: Created custom Cookiebot templates and styling solutions

- [x] PTO Calendar Analysis (2025-08-01)
  - Goal: Analyze PTO data from Google Calendar for engineering team
  - Result: Complete analysis with 341 total PTO days across 8 months
  - Deliverables: Analysis scripts, JSON data, executive summary

### July 2025

- [x] Patch Release Automation for Nx (2025-07-30)
  - Plan created: `dot_ai/2025-07-30/tasks/nx-patch-release.mjs`
  - Goal: Streamline patch release process with automated cherry-picking
  - Result: Created automation script for branch 21.3.x

- [x] Address CRITICAL(AI) sections in Docker documentation (2025-07-30)
  - Plan created: `dot_ai/2025-07-30/tasks/address-docker-docs-critical-sections.md`
  - Goal: Improve Docker release documentation by addressing three CRITICAL(AI) sections
  - Result: Enhanced production/hotfix releases, added Nx Cloud Agents warnings, updated nx-json reference

- [x] Test nx@0.0.0-pr-32120-1cb4170 Docker release functionality (2025-07-30)
  - Plan created: `dot_ai/2025-07-30/tasks/test-nx-docker-release.md`
  - Goal: Validate Nx workspace creation with Docker support for PR builds
  - Result: All tests passed successfully

- [x] Update Nx commands to use @latest in documentation (2025-07-29)
  - Plan created: `dot_ai/2025-07-29/tasks/update-nx-commands-to-latest.md`
  - Goal: Update all docs to use `npx nx@latest` commands
  - Result: Successfully updated 27 occurrences across 23 files

- [x] Fix Astro Docs Markdown Error (2025-07-22)
  - Plan created: `dot_ai/2025-07-22/tasks/fix-astro-docs-markdown-error.md`
  - Goal: Fix TypeError when building astro-docs after rebase with master
  - Result: Build completes successfully on branch `jack/astro-docs-fix-entry-metadata`
  - Solution: Skipped renderMarkdown calls in custom loaders

- [x] Remove unused Nx Cloud tutorial images (2025-07-21)
  - Plan created: `dot_ai/2025-07-21/tasks/remove-unused-nx-cloud-tutorial-images.md`
  - Goal: Clean up orphaned images from docs/nx-cloud/tutorial directory
  - Result: Analyzed all images, removed 16 unused files

- [x] Improve nx init output (2025-07-21)
  - Plan created: `dot_ai/2025-07-21/tasks/improve-nx-init-output.md`
  - Goal: Remove generic post-init messages and provide actionable, context-specific next steps
  - Result: Removed generic messages, added context-aware next steps, created "After Running nx init" guide

### June 2025

- [x] Ocean Feature Documentation Analysis (2025-06-26)
  - Plan created: `dot_ai/2025-06-26/tasks/ocean-feature-documentation-analysis.md`
  - Raw docs update plan: `dot_ai/2025-06-26/tasks/raw-docs-update-plan.md`
  - Goal: Identify key features needing documentation and create implementation plan
  - Result: Identified 6 major features, created prioritized implementation plan

- [x] Refactor Nx Cloud Error Handling (2025-06-25)
  - Plan created: `dot_ai/2025-06-25/tasks/refactor-nx-cloud-error-handling.md`
  - Goal: Improve error handling and user experience in Nx Cloud
  - Status: Completed planning and implementation

- [x] Fix Next.js Jest JSX Transform Warning (2025-06-24)
  - Plan created: `dot_ai/2025-06-24/tasks/fix-nextjs-jest-jsx-transform.md`
  - Goal: Update Next.js generators to use next/jest.js configuration with modern JSX transform
  - Issue: https://github.com/nrwl/nx/issues/27900
  - Result: Successfully updated both app and library generators to use next/jest.js
  - Commits: f1a2dd8a5e (initial), 008d254dc4 (improvements), 752737f11e (code consolidation)

- [x] Nx Easy Issues Analysis (2025-06-24)
  - Summary: `dot_ai/2025-06-24/tasks/nx-easy-issues-summary.md`
  - Goal: Analyze nrwl/nx repository for easy-to-close issues  
  - Result: Found 524 actionable issues from 535 open issues, 230 highly suitable for AI assistance

- [x] Fix PTO Data Issues (2025-08-01 15:10)
  - Goal: Correct Patrick M.'s missing May vacation and remove Victor R. who is not an employee
  - Result: Successfully added Patrick M.'s 20-day May vacation and removed Victor R. from all data
  - Updated totals: 332 PTO days (was 324), May is now peak month with 64 days

- [x] Update Nx documentation to use npx nx@latest (2025-07-29)
  - Updated docs to use `npx nx@latest` for init and connect commands
  - Commit: 9b0fb37eb6 docs(misc): make sure "npx nx@latest" is used when calling init or coonnect (#32128)
  - Goal: Ensure users always get the latest version when setting up Nx

- [x] Address CRITICAL(AI) sections in Docker documentation (2025-07-30 14:30)
  - Plan created: `.ai/2025-07-30/tasks/address-docker-docs-critical-sections.md`
  - Goal: Improve Docker release documentation by addressing three CRITICAL(AI) sections
  - Changes made:
    - Enhanced Production and Hotfix Releases section with customization examples
    - Added Nx Cloud Agents compatibility warnings in two locations
    - Updated nx-json reference docs with complete pattern documentation

- [x] Test nx@0.0.0-pr-32120-1cb4170 Docker release functionality (2025-07-30 14:35)
  - Plan created: `.ai/2025-07-30/tasks/test-nx-docker-release.md`
  - Goal: Validate Nx workspace creation with Docker support and release functionality for PR builds
  - Result: All tests passed successfully

- [x] Update Nx commands to use @latest in documentation (2025-07-29 12:41)
  - Plan created: `.ai/2025-07-29/tasks/update-nx-commands-to-latest.md`
  - Goal: Update all docs to use `npx nx@latest` commands to ensure users get latest version
  - Result: Successfully updated 27 occurrences across 23 files and formatted with prettier



- [x] Remove unused Nx Cloud tutorial images (2025-07-21)
  - Plan created: `.ai/2025-07-21/tasks/remove-unused-nx-cloud-tutorial-images.md`
  - Implementation: Analyzed all images, removed 16 unused files
  - Goal: Clean up orphaned images from docs/nx-cloud/tutorial directory

- [x] Improve nx init output (2025-07-21 13:41)
  - Plan created: `.ai/2025-07-21/tasks/improve-nx-init-output.md`
  - Implementation: Removed generic messages, added context-aware next steps
  - Documentation: Created "After Running nx init" guide
  - Goal: Remove generic post-init messages and provide actionable, context-specific next steps



- [x] MCP Server Improvements (2025-06-12) 
  - Plan created: `dot_ai/2025-06-12/tasks/mcp-server-improvements.md`
  - Goal: Implement architecture and performance improvements to MCP AI Content Server
  - Next Steps: Fix race conditions, add error handling, implement incremental indexing

- [x] Debug Migrate UI Module Resolution Issue (2025-06-13 17:05) (migrated)
  - Plan created: `dot_ai/2025-06-13/tasks/debug-migrate-ui-module-resolution.md`
  - Status: Active debugging
  - Issue: Migrations fail with "module not found" in UI but work in terminal
  - Note: Fix was implemented on 2025-06-17 but awaiting verification
  - Needed to set chdir or use exec/spawn with cwd set to workspace root

- [x] Fix Top 10 Easy Issues (2025-06-17 08:00) (migrated)
  - Plan created: `dot_ai/2025-06-17/tasks/fix-top-10-easy-issues-plan.md`
  - Status: 4 issues fixed, 6 skipped, awaiting user review
  - Next steps: User to manually review and push branches

- [x] Incident Management Consolidation Documentation (2025-06-17 17:30)
  - Status: In Progress
  - Location: `dot_ai/2025-06-17/tasks/incident-management-consolidation-summary.md`
  - Goal: Documented the comprehensive consolidation of Notion incident management pages from June 13

- [x] Enhance nx-easy-issues Command with AI Feedback (2025-06-17 16:30) 
  - Status: In Progress
  - Location: Modified `/Users/jack/.claude/commands/nx-easy-issues.md`
  - Goal: Enhanced the nx-easy-issues.md command file based on comprehensive feedback from Gemini AI review
  - Key enhancements: automated scoring system, dry run mode, parallel processing

- [x] SKIPPED Add ShadCN Style Option to React Generator (2025-06-19) (migrated)
  - Plan created: `dot_ai/2025-06-19/tasks/add-shadcn-style-option-react-generator.md`
  - Status: Planning phase complete
  - Goal: Add 'shadcn' as a new style option alongside existing options
  - Note: Will integrate Tailwind CSS, PostCSS, and shadcn-specific configurations
  - 9-step implementation plan defined
  - Skipped this because it's just a demo

- [x] Provide Johan with @nx/php/laravel initial implementation

- [x] Tailwind stylesheet (025-06-20 15:00)

- [x] Review Tailwind v4 support changes (2025-01-20 15:00)
  - Plan created: `.ai/2025-01-20/tasks/review-tailwind-v4-support.md`
  - Goal: Review feat/tailwind-4 branch changes for React and Vue bundler support
  - Result: Implementation is solid and production-ready, createGlobPatternsForDependencies works correctly

- [x] Implement Tailwind v4 support for React and Vue (2025-06-20 17:23)
  - Plan created: `.ai/2025-06-20/tasks/tailwind-v4-implementation.md`
  - Next steps: Documentation updates and migration guide
  - Goal: Support Tailwind v4 with Vite plugin while maintaining backward compatibility
  - Result: Successfully implemented v4 support with version detection, bundler detection, and full backward compatibility

- [x] Investigate Docker + Nx + cache (2025-06-19 8:52)
  - Using `--cache-to` and `--cache-from` might help https://docs.docker.com/build/cache/backends/gha/

- [x] Review Nx AI Strategy Document (2025-06-19 9:30)
  - Spec created: `dot_ai/2025-06-19/specs/nx-ai-strategy.md`
  - Goal: Review strategic suggestions for Nx's AI-first platform
  - Topics: Business growth, user experience, operationalization, and 1-3-6 month strategy

- [x] Fix React Generator Tailwind Styles Filename Mismatch (2025-06-19 16:45)
  - Plan created: `.ai/2025-06-19/tasks/fix-react-tailwind-styles-filename.md`
  - Goal: Fix bug where project.json references styles.tailwind but generated file is styles.css
  - Result: Fixed in add-project.ts for both webpack and rspack, added tests
  - Commit: 8f15779d65

- [x] Create Nx AI Strategy Session brainstorm spec (2025-06-18 17:45)
  - Plan created: `dot_ai/2025-06-18/specs/nx-ai-strategy-session-agenda.md`
  - Goal: Develop comprehensive agenda for two-day AI strategy session
  - Result: Created detailed spec covering current state, user workflows, documentation strategy, partnerships, and session agenda

- [x] Verify and push AI fixes for Nx CLI (2025-06-18 16:05)
  ```
  1. Branch: issues/30914 - ✅ Fixed
    - Added documentation for setting target defaults on inferred tasks
    - Clarified how to use plugin-specific identifiers vs general target names
    - Test: View updated docs at docs/shared/reference/nx-json.md

  2. Branch: issues/29143 - ⏭️ Skipped (Jest-specific)
    - passWithNoTests configuration issue (Jest limitation)

  3. Branch: issues/28715 - ✅ Fixed
    - Clarified package.json vs project.json usage
    - Documented that both support executors through the 'nx' property
    - Test: View updated docs at docs/shared/reference/project-configuration.md

  4. Branch: issues/30589 - ✅ Fixed
    - Updated dependency-checks rule to detect pre-release to stable upgrades
    - Test: Run eslint with @nx/dependency-checks rule on projects with pre-release deps

  5. Branch: issues/30163 - ✅ Fixed
    - Created comprehensive nx release/verdaccio documentation
    - Added guide at docs/shared/recipes/nx-release/publish-with-verdaccio.md
    - Test: View new documentation and check navigation in docs site
  ```

- [x] Sync with Caleb and Ben on docs rework (2025-06-18 3:06)
  - https://linear.app/nxdev/issue/NXC-2781/propose-frameworks-and-solutions

- [x] Record RawDocs Tool Loom Video for Team (2025-06-18 14:45)
  - Plan created: Notes saved at `/Users/jack/Downloads/rawdocs-developer-guide.md`
  - Goal: Create a short Loom video (5-7 minutes) explaining the RawDocs tool workflow
  - Key points to cover:
    - 2-3 minute developer workflow
    - Demo of git push → AI analysis → doc update
    - Show the feature-docs structure
    - Emphasize non-blocking nature and time savings

- [x] Review PR for Nicholas for Migrate UI (2025-06-18 10:48)
  - https://github.com/nrwl/nx/pull/31626
  - https://github.com/nrwl/nx-console/pull/2567
  - https://www.loom.com/share/843154739c5d40b2b1554d097314977a
  - https://nrwl.slack.com/archives/C04J01JPC4Q/p1750193240507379

- [x] Add author filtering to analyze-changes.mjs (2025-06-18 10:30)
  - Plan created: `.ai/2025-06-18/tasks/add-author-filter-to-analyze-changes.md`
  - Goal: Filter commits by author with default showing only current user's commits
  - Result: Successfully implemented with --author CLI flag, wildcard "*" support, and current user as default

- [x] Retrieve Notion Incident Response Pages (2025-06-13 15:30)
  - Plan created: `dot_ai/2025-06-13/tasks/retrieve-notion-incident-pages.md`
  - Related to: Incident Response Documentation Cleanup Plan
  - Goal: Retrieve and store locally the content of 19 Notion pages related to incident response documentation

- [x] Debug Migrate UI Module Resolution Issue (2025-06-13 17:05)
  - Plan created: `.ai/2025-06-13/tasks/debug-migrate-ui-module-resolution.md`
  - Goal: Fix module resolution failures when migrations import packages from node_modules
  - Solution: Simple `process.chdir(workspacePath)` fix implemented on 2025-06-17
  - Final task documentation: `.ai/2025-06-17/tasks/fix-angular-module-resolution-migrate-ui.md`
  - Result: Both module resolution and Angular file path issues resolved with single change

- [x] Track Nx Docs Restructure Issue (2025-06-13 14:30)
  - GitHub Issue: https://github.com/nrwl/nx/issues/31546
  - Status: Intentional change, user already answered
  - Goal: Monitor for a few days to see if addressed or new ideas emerge
  - Notes: `.ai/2025-06-13/dictations/nx-docs-restructure-tracking.md`
  - Completed: 2025-06-14 (Last Friday)

- [x] Fix GitHub Issues Batch (2025-06-17 11:00)
  - Plan created: `.ai/2025-06-17/tasks/fix-github-issues-batch.md`
  - Goal: Fix up to 10 GitHub documentation issues identified in previous analysis
  - Result: Successfully fixed 3 documentation issues:
    - #31431: Added Bun to CI deployment docs (branch: `issue/31431`)
    - #31111: Documented NX_TUI environment variables (branch: `issue/31111`)
    - #30649: Explained "*" version meaning in project package.json (branch: `issue/30649`)
  - Skipped 1 issue (#30831) and reverted 1 issue (#30137) per user request

- [x] Find 5 More Easy GitHub Issues (< 100 LOC) (2025-06-17 10:45)
  - Plan created: `.ai/2025-06-17/tasks/find-5-more-easy-issues.md`
  - Goal: Find 5 additional GitHub issues beyond the first batch
  - Result: Successfully identified 5 more documentation issues totaling 85-135 LOC:
    - #30137: Fix --dryRun flag documentation
    - #30810: Add E2E encryption verification guide
    - #31398: Clarify ciMode enablement
    - #30058: Add Homebrew troubleshooting
    - #30008: Update Tailwind v4 docs
  - Deliverables: `5-more-easy-github-issues-summary.md`

- [x] Find 5 Easy GitHub Issues (< 100 LOC) (2025-06-17 10:30)
  - Plan created: `.ai/2025-06-17/tasks/find-easy-github-issues.md`
  - Goal: Identify 5 GitHub issues that can be fixed with minimal code changes
  - Result: Successfully identified 5 documentation issues totaling 50-80 LOC:
    - #31431: Add Bun to CI deployment docs
    - #30649: Explain "*" version meaning
    - #30768: Standardize plugin location guidance
    - #30831: Fix indexHtmlTransformer docs
    - #31111: Document NX_TUI environment variables
  - Deliverables: `5-easy-github-issues-summary.md`

- [x] Implement heap usage logging feature (2025-06-13 16:00)
  - Plan created: `.ai/2025-06-13/tasks/implement-heap-logging.md`
  - Goal: Enable `NX_LOG_HEAP_USAGE=true nx run <project>:<target>` to display peak RSS memory usage
  - Result: Core feature implemented with pidusage library
  - Displays memory in format: `✔  nx run myapp:build (2.5s) (peak: 256MB)`
  - Deferred: Tests, documentation, ForkedProcessTaskRunner support

- [x] Incident Response Documentation Audit (2025-06-13 09:30)
  - Plan created: `.ai/2025-06-13/tasks/incident-response-audit.md`
  - Result: Created comprehensive inventory in `incident_response_pages.md`
  - Goal: Audit all Notion pages/databases for incident response content to identify inconsistencies, duplicates, and gaps
  - Findings: 26 pages/databases documented, maturity level 2/5, critical gaps in IRP and communication protocols
  - Deliverables:
    - Comprehensive inventory with 23 pages and 3 databases
    - Deep-dive analysis of 15 key resources
    - Maturity assessment (Level 2/5 - Repeatable)
    - Gap analysis identifying missing IRP, communication protocols, and severity classification
    - Gemini expert review with industry benchmarks
    - Detailed recommendations for reaching Level 3 maturity

- [x] Create Nx AI MCP Integration Summary Document (2025-06-12 11:15)
  - Plan created: Consolidated ideas from multiple dictations
  - Goal: Make Nx CLI invaluable for AI tools and drive npm package growth
  - Deliverables:
    - Comprehensive strategy document: `dot_ai/2025-06-12/nx-ai-mcp-integration-summary.md`
    - 11 repository intelligence MCP functions defined
    - Leveraged existing Nx features: tagging system, Polygraph
    - Growth hacking features: AI Workspace Report, gamification
    - Zero-configuration approach with built-in MCP server

- [x] MCP-Gemini Code Review and Improvement (2025-06-12 10:30)
  - Plan created: `dot_ai/2025-06-12/tasks/mcp-gemini-improvements.md`
  - Next steps: Fix critical security issues, improve error handling, add validation
  - Goal: Make the mcp-gemini server production-ready with proper security and best practices

- [x] Fix E2E Port Configuration for React App Generator (2025-06-12 00:00)
  - Plan created: `dot_ai/2025-06-12/tasks/fix-e2e-port-configuration.md`
  - Goal: Ensure all E2E test runners respect the --port option from React app generator
  - Result: Fixed across all bundlers (Vite, Webpack, Rspack, Rsbuild), all 96 tests passing

- [x] Documentation-Feature Correlation Tool (2025-06-11 12:00)
  - Plan created: `dot_ai/2025-06-11/tasks/docs-feature-correlation-tool.md`
  - Goal: Build tool to analyze feature changes and correlate with documentation needing updates
  - Result: Created 5-component system with AI-optimized output format

- [x] Create Curl-based Installation Script for Raw Docs (2025-06-11 01:05)
  - Plan created: `.ai/2025-06-11/tasks/curl-install-script.md`
  - Status: All 7 steps complete (Step 6 manually verified)
  - Goal: Enable one-line installation via GitHub CLI
  - Result: Fully functional install.sh script with GitHub CLI integration

- [x] Add Port Option to @nx/react:application Generator (2025-06-11 00:00)
  - Plan created: `dot_ai/2025-06-11/tasks/add-port-option-react-generator.md`
  - Goal: Add a --port option to the React application generator for custom dev server ports
  - Result: Implemented port option for all bundlers (Vite, Webpack, Rspack)

- [x] Nx Easy Issues Analysis - Stale & Low Engagement (2025-06-10 14:00)
  - Plan created: `dot_ai/2025-06-10/tasks/nx-easy-issues-stale-issues.md`
  - Goal: Analyze nrwl/nx repository for easy-to-close issues
  - Result: Found 221 issues that could be closed, created bulk closure scripts

- [x] MCP Server Auto-Reindexing (2025-06-10 10:45)
  - Plan created: `dot_ai/2025-06-10/tasks/mcp-server-auto-reindex.md`
  - Goal: Implement automatic re-indexing when content changes in dot_ai folder
  - Approach: Hash-based change detection before search operations
  - Implementation complete: Directory monitor, content indexer integration, server integration
  - Tests passing, documentation updated

- [x] Cross-Repository Raw Docs Integration - Phase 1 (2025-06-10 09:00)
  - Plan created: `dot_ai/2025-06-10/tasks/cross-repo-integration-phase1.md`
  - Spec reference: `dot_ai/2025-06-10/specs/cross-repo-integration.md`
  - Goal: Implement core integration system for monorepos to leverage raw-docs without submodules
  - Result: Created 3 new scripts, updated check-developers.mjs, built comprehensive test suite

- [x] Improve MCP Server Discoverability for AI Tools (2025-06-09 22:47)
  - Plan created: `dot_ai/2025-06-09/tasks/improve-mcp-server-discoverability.md`
  - Goal: Ensure AI tools prioritize calling MCP server for notes, dictations, specs, tasks, and TODOs
  - Deliverables:
    - Updated CLAUDE.md with MCP priority instructions
    - Created claude-mcp-instructions.md and cursor-mcp-instructions.md
    - Implemented keyword-mapping.json with test scripts
    - Created usage-examples.md with comprehensive query patterns
    - Built mcp-integration-guide.md for full documentation
    - Developed monitor-mcp-calls.mjs for usage tracking

- [x] Enhance Search Engine: Date Ranges and Categories (2025-06-09 22:05)
  - Plan created: `dot_ai/2025-06-09/tasks/enhance-search-engine-date-ranges-and-categories.md`
  - Goal: Support date range filtering (start..end), flexible category matching (singular/plural), and folder-based category filtering

- [x] Optimize extract_todos Token Usage (2025-06-09 13:15)
  - Plan created: `dot_ai/2025-06-09/tasks/optimize-extract-todos-token-usage.md`
  - Goal: Reduce token usage below 25000 limit while maintaining usefulness
  - Deliverables:
    - Refactored extract_todos function with 80%+ token reduction
    - Added configurable verbosity levels (minimal, standard, detailed)
    - Implemented status filtering (pending, completed, all)
    - Added token monitoring and smart truncation
    - Created comprehensive API documentation
    - Achieved token usage: 790 tokens for minimal mode, 4,022 for detailed mode

- [x] Phase 1: Raw Docs Implementation (2025-06-09 12:30)
  - Plan created: `dot_ai/2025-06-09/tasks/phase-1-raw-docs-implementation.md`
  - Status: Working example repository created at `dot_ai/2025-06-09/tasks/raw-docs-example/`
  - Next steps: Integration and testing will be a separate task
  - Goal: Create working example of raw-docs repository with essential scripts and pre-push hooks

- [x] Reorganize dot_ai Folder Structure (2025-06-09 12:00)
  - Plan created: `dot_ai/2025-06-09/tasks/organize-dot-ai-folder-structure.md`
  - Goal: Restructure all yyyy-mm-dd folders to have consistent subdirectories (tasks/, specs/, dictations/)
  - Result: Successfully moved 86 files to appropriate locations while preserving SUMMARY.md files

- [x] Nx Version Extraction & PPA Build Fixes (2025-06-06 09:00)
  - Plan created: `dot_ai/2025-06-06/tasks/extract-nx-prerelease-versions.md`
  - Goal: Extract all Nx 21.1.x versions and fix PPA build environment
  - Result: Successfully extracted 21 prereleases, hardened Launchpad pipeline

- [x] Documentation Research & Debian Package Pipeline Fixes (2025-06-05 08:00)
  - Plan created: Multiple tasks in `dot_ai/2025-06-05/tasks/`
  - Goal: Research competitor docs and fix Debian package publishing
  - Result: Fixed critical pipeline, implemented Node.js version checking, created HTML mockup

- [x] Nx Getting Started Experience Improvement - Phase 1 (2025-06-04 08:00)
  - Plan created: `dot_ai/2025-06-04/tasks/phase-1-simplify-intro-page.md`
  - Goal: Simplify intro page to get users to "wow moment" in under 2 minutes
  - Result: Reduced intro page complexity by 60%, created 60-second onboarding path

- [x] URL Validation and Testing (2025-06-03 09:00)
  - Plan created: `dot_ai/2025-06-03/tasks/check-sitemap-urls.js`
  - Goal: Validate all documentation URLs for health check
  - Result: Systematic testing with categorized failure report

- [x] Nx Documentation URL Redirect Analysis (2025-06-02 09:00)
  - Plan created: Various scripts in `dot_ai/2025-06-02/tasks/`
  - Goal: Analyze and create redirects for Nx documentation migration
  - Result: 100% redirect coverage achieved with high confidence scores

### January 2025

- [x] Add Tailwind CSS to Astro-Docs Website (2025-01-23)
  - Plan created: `dot_ai/2025-01-23/tasks/add-tailwind-to-astro-docs.md`
  - Goal: Integrate Tailwind CSS into the astro-docs website for enhanced styling capabilities
  - Result: Successfully installed Tailwind v3.4.4 with Starlight compatibility and Vite plugin configuration

- [x] Review Tailwind v4 Support Changes (2025-01-20)
  - Plan created: `dot_ai/2025-01-20/tasks/review-tailwind-v4-support.md`
  - Goal: Review feat/tailwind-4 branch changes for React and Vue bundler support
  - Result: Implementation is solid and production-ready, createGlobPatternsForDependencies works correctly

## Next Actions

1. Create Self-Healing CI documentation in raw-docs
2. Create Cache Isolation documentation in raw-docs  
3. Update SAML + SCIM documentation with latest changes
4. Create GTM migration guide
5. Set up regular documentation update process
