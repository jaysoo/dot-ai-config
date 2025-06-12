# TODO

## In Progress

- [ ] NX CLI Heap Usage Logging - Phase 1 (2025-06-11 18:35)
  - Plan created: `dot_ai/2025-06-11/tasks/nx-heap-usage-logging-phase1.md`
  - Spec reference: `dot_ai/2025-06-11/specs/heap-usage-logging.md`
  - Goal: Implement memory tracking to display peak RSS for each task via NX_LOG_HEAP_USAGE environment variable
  - Next steps: Add pidusage dependency, enhance Task interface, create memory tracking service

## Completed

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

- [x] Create Curl-based Installation Script for Raw Docs (2025-06-11 1:05)
  - Plan created: `.ai/2025-06-11/tasks/curl-install-script.md`
  - Status: All 7 steps complete (Step 6 manually verified)
  - Goal: Enable one-line installation via GitHub CLI
  - Result: Fully functional install.sh script with GitHub CLI integration

- [x] MCP Server Auto-Reindexing (2025-06-10 10:45)
  - Plan created: `dot_ai/2025-06-10/tasks/mcp-server-auto-reindex.md`
  - Goal: Implement automatic re-indexing when content changes in dot_ai folder
  - Approach: Hash-based change detection before search operations
  - Implementation complete: Directory monitor, content indexer integration, server integration
  - Tests passing, documentation updated

- [x] Phase 1: Raw Docs Implementation (2025-06-09 12:30)
  - Plan created: `dot_ai/2025-06-09/tasks/phase-1-raw-docs-implementation.md`
  - Status: Working example repository created at `dot_ai/2025-06-09/tasks/raw-docs-example/`
  - Next steps: Integration and testing will be a separate task
  - Goal: Create working example of raw-docs repository with essential scripts and pre-push hooks

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

- [x] Reorganize dot_ai Folder Structure (2025-06-09 12:00)
  - Plan created: `dot_ai/2025-06-09/tasks/organize-dot-ai-folder-structure.md`
  - Goal: Restructure all yyyy-mm-dd folders to have consistent subdirectories (tasks/, specs/, dictations/)
  - Result: Successfully moved 86 files to appropriate locations while preserving SUMMARY.md files

- [x] Cross-Repository Raw Docs Integration - Phase 1 (2025-06-10 09:00)
  - Plan created: `dot_ai/2025-06-10/tasks/cross-repo-integration-phase1.md`
  - Spec reference: `dot_ai/2025-06-10/specs/cross-repo-integration.md`
  - Goal: Implement core integration system for monorepos to leverage raw-docs without submodules
  - Result: Created 3 new scripts, updated check-developers.mjs, built comprehensive test suite

- [x] Nx Easy Issues Analysis - Stale & Low Engagement (2025-06-10 14:00)
  - Plan created: `dot_ai/2025-06-10/tasks/nx-easy-issues-stale-issues.md`
  - Goal: Analyze nrwl/nx repository for easy-to-close issues
  - Result: Found 221 issues that could be closed, created bulk closure scripts

- [x] Documentation-Feature Correlation Tool (2025-06-11 12:00)
  - Plan created: `dot_ai/2025-06-11/tasks/docs-feature-correlation-tool.md`
  - Goal: Build tool to analyze feature changes and correlate with documentation needing updates
  - Result: Created 5-component system with AI-optimized output format

- [x] Fix E2E Port Configuration for React App Generator (2025-06-12 00:00)
  - Plan created: `dot_ai/2025-06-12/tasks/fix-e2e-port-configuration.md`
  - Goal: Ensure all E2E test runners respect the --port option from React app generator
  - Result: Fixed across all bundlers (Vite, Webpack, Rspack, Rsbuild), all 96 tests passing

- [x] Nx Documentation URL Redirect Analysis (2025-06-02 09:00)
  - Plan created: Various scripts in `dot_ai/2025-06-02/tasks/`
  - Goal: Analyze and create redirects for Nx documentation migration
  - Result: 100% redirect coverage achieved with high confidence scores

- [x] URL Validation and Testing (2025-06-03 09:00)
  - Plan created: `dot_ai/2025-06-03/tasks/check-sitemap-urls.js`
  - Goal: Validate all documentation URLs for health check
  - Result: Systematic testing with categorized failure report

- [x] Nx Getting Started Experience Improvement - Phase 1 (2025-06-04 08:00)
  - Plan created: `dot_ai/2025-06-04/tasks/phase-1-simplify-intro-page.md`
  - Goal: Simplify intro page to get users to "wow moment" in under 2 minutes
  - Result: Reduced intro page complexity by 60%, created 60-second onboarding path

- [x] Documentation Research & Debian Package Pipeline Fixes (2025-06-05 08:00)
  - Plan created: Multiple tasks in `dot_ai/2025-06-05/tasks/`
  - Goal: Research competitor docs and fix Debian package publishing
  - Result: Fixed critical pipeline, implemented Node.js version checking, created HTML mockup

- [x] Nx Version Extraction & PPA Build Fixes (2025-06-06 09:00)
  - Plan created: `dot_ai/2025-06-06/tasks/extract-nx-prerelease-versions.md`
  - Goal: Extract all Nx 21.1.x versions and fix PPA build environment
  - Result: Successfully extracted 21 prereleases, hardened Launchpad pipeline
