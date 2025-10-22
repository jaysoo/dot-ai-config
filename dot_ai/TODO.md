# TODO

## In Progress

- [ ] Module Federation Dynamic Manifest and Static Fallback Issues (2025-08-21 10:49)

  - Dictation: `.ai/2025-08-21/dictations/module-federation-dynamic-manifest-issues.md`
  - Goal: Fix URL property handling in dynamic manifests and static fallback mechanism
  - Next steps: Create reproduction repo, communicate with Colum, review on Friday

- [ ] Check on this disabled test e2e/nx-init/src/nx-init-nest.test.ts (https://github.com/nestjs/nest-cli/issues/3110)

## Completed

### October 2025

- [x] DOC-269: GitLab Source Control Integration Guide Update (2025-10-22)
  - Plan: `dot_ai/2025-10-21/SUMMARY.md`
  - Goal: Update GitLab integration documentation to reflect UI changes
  - Status: Committed locally (71b0d76400), ready for push and PR
  - Files: `astro-docs/src/content/docs/guides/Nx Cloud/source-control-integration.mdoc`

- [x] DOC-302: PNPM Catalog Support (2025-10-21 14:28)
  - Plan: `dot_ai/2025-10-21/tasks/pnpm-catalog-support.md`
  - Goal: Add documentation about PNPM catalogs for maintaining single version policy
  - Status: Complete - Added concise aside in dependency-management.mdoc
  - Commit: 366535f8c2

- [x] DOC-301: Java Introduction Page Update (2025-10-21)
  - Plan: `dot_ai/2025-10-21/SUMMARY.md`
  - Goal: Restructure Java introduction page to improve onboarding
  - Result: Moved Requirements first, added Quick Start section, marked Maven as experimental
  - File: `astro-docs/src/content/docs/technologies/java/introduction.mdoc`

- [x] Framer Migration URL Inventory (2025-10-21)
  - Plan: `dot_ai/2025-10-21/tasks/framer-migration-urls.md`
  - Goal: Create comprehensive URL inventory for Framer migration planning
  - Result: Analyzed 1,307 URLs - 73 marketing pages, 168 blog posts (docs excluded)

- [x] DOC-188: TypeDoc Module Resolution Fix (2025-10-17)
  - Issue: https://linear.app/nxdev/issue/DOC-188
  - Goal: Fix DevKit API docs to use local workspace builds instead of node_modules
  - Result: Added TypeScript path mappings to redirect module resolution to `dist/packages/`
  - Files: `astro-docs/src/plugins/utils/typedoc/typedoc.ts`, `astro-docs/project.json`

- [x] Nx v22 Migration Testing (2025-10-17)
  - Plan: `dot_ai/2025-10-17/v22-migration-test-results.md`
  - Goal: Test Nx v21.6.5 → v22.0.0-beta.7 migration across 5 workspace types
  - Result: 100% success rate (5/5) - React (3 variants), Angular, Node all passed
  - Summary: `/tmp/NX-V22-MIGRATION-SUMMARY.md`
  - Key Learning: Use explicit version `22.0.0-beta.7`, not `@next` (points to v23)

- [x] Public Changelog System Implementation (2025-10-09)
  - Plan: `dot_ai/2025-10-09/SUMMARY.md`
  - Goal: Set up git-cliff CLI tool to generate public-facing changelogs for nx-cloud and nx-api
  - Result: Created feature library `@nx-cloud/feature-changelog`, implemented `/changelog` route
  - Features: CalVer version detection, component hashtags, breaking changes section
  - Files: `libs/nx-cloud/feature-changelog/`, `tools/scripts/private-cloud/generate-changelog.ts`

- [x] DOC-260: Update TailwindCSS Guides (2025-10-08)
  - Issue: https://linear.app/nxdev/issue/DOC-260
  - Goal: Remove deprecated generator references and provide simple manual setup
  - Result: Updated React and Angular guides with v3/v4 compatible instructions
  - Files: `astro-docs/src/content/docs/technologies/angular/Guides/using-tailwind-css-with-angular-projects.mdoc`, `astro-docs/src/content/docs/technologies/react/Guides/using-tailwind-css-in-react.mdoc`

- [x] DOC-252: AI Embeddings Support for Astro Docs (2025-10-08)
  - Issue: https://linear.app/nxdev/issue/DOC-252
  - Plan: `dot_ai/2025-10-08/tasks/doc-252-astro-embeddings.md`
  - Goal: Enable AI chat to search through Astro documentation
  - Result: Implemented dual-mode system (astro/legacy), local testing flag, HTML-to-markdown conversion
  - Stats: 504 docs pages, 3,100 sections, 106 community plugins
  - Files: `tools/documentation/create-embeddings/src/main.mts`, `.github/workflows/generate-embeddings.yml`

- [x] API Documentation Integration for Embeddings (2025-10-02)
  - Plan: `dot_ai/2025-10-02/SUMMARY.md`
  - Goal: Include dynamically generated API docs in embeddings (nx-cli, nx-cloud-cli, create-nx-workspace, plugins)
  - Status: Outstanding work - need to decide between parsing built HTML or using Astro loaders
  - Options: Parse `astro-docs/dist/api/**/*.html` OR use Astro loaders from `astro-docs/src/plugins/*.loader.ts`

- [x] Embeddings Script Refactoring (2025-10-02)
  - Plan: `dot_ai/2025-10-02/tasks/embeddings-script-refactoring.md`
  - Goal: Migrate embeddings generation from Next.js to Astro documentation
  - Result: Implemented `--mode=astro` with direct source reading and URL path generation
  - Output: 504 pages, 3,100 sections, 895KB

- [x] hey just fyi - we added ai.configure-agents-check notification to GA that doesn't correspond to a feature so we should ignore it for scorecards

### September 2025

- [x] NXC-3108: Remove Deprecated Webpack Options for v22 (2025-09-23)
  - Issue: https://linear.app/nxdev/issue/NXC-3108
  - Plan: `dot_ai/2025-09-23/SUMMARY.md`
  - Goal: Remove deprecated deleteOutputPath and sassImplementation options for Nx v22
  - Result: Created migration, removed options from all interfaces/schemas, added comprehensive tests
  - Commit: 25d82d78a8 - feat(webpack)!: remove deprecated deleteOutputPath and sassImplementation options

- [x] DOC-223: Add Conditional Noindex to Old Docs Pages (2025-09-22)
  - Plan: `dot_ai/2025-09-22/SUMMARY.md`
  - Goal: Prevent search engines from indexing old documentation during Astro migration
  - Result: Added noindex meta tags when NEXT_PUBLIC_ASTRO_URL is set
  - Files: DocViewer, changelog, plugin-registry, ai-chat pages

- [x] DOC-221: Add Algolia Search to Blog Index (2025-09-19)
  - Branch: DOC-221
  - Plan: `dot_ai/2025-09-19/SUMMARY.md`
  - Goal: Add blog-only search functionality during Astro migration
  - Result: Integrated AlgoliaSearch with blogOnly prop, facet filtering for blog posts
  - Files: algolia-search.tsx, blog-container.tsx

- [x] DOC-209: Update Header Menu Items (2025-09-16)
  - Branch: DOC-209
  - Plan: `dot_ai/2025-09-16/SUMMARY.md`
  - Goal: Update header navigation and add sidebar links
  - Result: Updated tutorials link, removed Office Hours/Code examples, added Plugin Registry and Changelog to sidebar
  - Commits: 8d4b7c352c, 160b0a7cab, ef899b1a28

- [x] Sync with Colum and Leo on Component Testing (CT) for Nx 22 (2025-09-16)
  - Discuss two options for component testing configuration:
    - Option 1: Keep current defaults, no user customization
    - Option 2: Create `webpack.cy.ts` with good defaults allowing user control (requires migration)
  - Goal: Decide on approach for component testing in Nx 22

- [x] DOC-185: Add API Documentation for Core Nx Packages (2025-09-15)
  - Branch: DOC-185 (nx-worktrees)
  - Plan: `dot_ai/2025-09-15/SUMMARY.md`
  - Goal: Create API documentation pages for nx, workspace, web, plugin packages
  - Result: Created 8 new API pages, updated ~40 redirect rules, fixed broken link validation
  - Commit: 776ea2b5f2 - docs(misc): add API docs for nx, workspace, web, plugin

- [x] DOC-184 & DOC-169: Documentation URL Fixes (2025-09-12)
  - Plans: `dot_ai/2025-09-12/SUMMARY.md`
  - DOC-184: Implemented client-side routing for old documentation URLs (12 files updated)
  - DOC-169: Fixed mobile menu icon theme visibility with CSS-only approach
  - Commits: Multiple commits for DOC-184, 06d0ce43d1 for DOC-169

- [x] NXC-2493: Docker Nx Release Migration (Ocean) (2025-09-10)
  - Branch: NXC-2493
  - Plan: `dot_ai/2025-09-10/SUMMARY.md`
  - Goal: Implement nx release support for Docker images in Ocean repository
  - Result: Migrated Dockerfiles, added docker:build targets, configured release groups
  - Commit: 7a146758b (amended multiple times)

- [x] DOC-184: Client-Side Routing for Old Documentation URLs (2025-09-09)
  - Branch: DOC-184 (nx-worktrees)
  - Issue: https://linear.app/nxdev/issue/DOC-184
  - Plan: `dot_ai/2025-09-09/SUMMARY.md`
  - Goal: Prevent 404s and content flashing for old documentation links
  - Result: Created Link wrapper component with URL transformation, updated 23 files
  - Commit: 51c0936abd

- [x] DOC-185: Add Missing API Reference Pages for Core Packages (2025-09-04)
  - Branch: DOC-185
  - Plan: `dot_ai/2025-09-04/SUMMARY.md`
  - Goal: Create Astro pages for missing core package documentation (nx, workspace, plugin, web)
  - Result: Created 12 new pages with flattened URL structure, updated redirect rules
  - Commit: 57222d29ea - docs(misc): add missing API reference pages for core packages

- [x] Review Linear Stale Issues for Nx CLI Team (2025-08-19 08:50)

  - Plan created: `dot_ai/2025-08-19/tasks/linear-stale-issues-review.md`
  - Goal: Identify and review stale issues in Linear that haven't been updated in 3+ months
  - Next steps: Review with assignees, close/update stale issues

- [x] Review PR #8300 for Austin - Powerpack Conformance Allow Option (2025-08-20 15:16)

  - PR: https://github.com/nrwl/ocean/pull/8300
  - Linear Issue: NXC-2951
  - Review scheduled for: Thursday, August 21, 2025
  - Notes: `dot_ai/2025-08-20/dictations/pr-review-austin-conformance.md`
  - Goal: Review new `allow` option for Powerpack conformance, verify Mailchimp fix

- [x] Marketing & Blog Platform Requirements Gathering (2025-08-22 13:30)

  - Dictation: `.ai/2025-08-22/dictations/marketing-blog-requirements-heidi.md`
  - Goal: Evaluate platform options for migrating away from Next.js + Vercel
  - Next steps: Review requirements against platform options, get feedback from Heidi

### August 2025

- [x] Fix Astro Documentation Styling Issues (2025-08-28 13:00)

  - Plan: `.ai/2025-08-28/tasks/fix-astro-docs-styling-issues.md`
  - Branch: DOC-143
  - Goal: Fix 5 Linear styling issues for Astro docs
  - Result: Fixed active link colors, deepdive callout spacing, card styling, TOC spacing, sidebar headers
  - Screenshots: Saved in `.ai/2025-08-28/tasks/`

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
  - Result: Successfully implemented with --author CLI flag, wildcard "\*" support, and current user as default

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
    - #30649: Explained "\*" version meaning in project package.json (branch: `issue/30649`)
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
    - #30649: Explain "\*" version meaning
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
