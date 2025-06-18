# TODO

## In Progress

- [ ] Review PR for Nicholas for Migrate UI
  - https://github.com/nrwl/nx/pull/31626
  - https://github.com/nrwl/nx-console/pull/2567
  - https://www.loom.com/share/843154739c5d40b2b1554d097314977a
  - https://nrwl.slack.com/archives/C04J01JPC4Q/p1750193240507379

- [ ] Investigate Docker + Nx + cache

- [ ] Sync with Caleb on docs rework
  - https://linear.app/nxdev/issue/NXC-2781/propose-frameworks-and-solutions

- [ ] Record RawDocs Tool Loom Video for Team (2025-06-17 15:30)
  - Plan created: Notes saved at `/Users/jack/Downloads/rawdocs-developer-guide.md`
  - Goal: Create a short Loom video (5-7 minutes) explaining the RawDocs tool workflow
  - Key points to cover:
    - 2-3 minute developer workflow
    - Demo of git push → AI analysis → doc update
    - Show the feature-docs structure
    - Emphasize non-blocking nature and time savings

- [ ] NX CLI Heap Usage Logging - Phase 1 (2025-06-11 18:35)
  - Plan created: `dot_ai/2025-06-11/tasks/nx-heap-usage-logging-phase1.md`
  - Spec reference: `dot_ai/2025-06-11/specs/heap-usage-logging.md`
  - Goal: Implement memory tracking to display peak RSS for each task via NX_LOG_HEAP_USAGE environment variable
  - Next steps: Add pidusage dependency, enhance Task interface, create memory tracking service

## Completed

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
