# Summary - November 13, 2025

## NXC-3464: Template Support for create-nx-workspace

### Overview
Completed critical bug fixes and feature additions for the template flow in create-nx-workspace, enabling users to clone GitHub template repositories and connect them to Nx Cloud with proper GitHub integration.

### Key Accomplishments

#### 1. Template Flow Implementation
- Added support for `--template` flag to clone GitHub repositories
- Implemented automatic dependency installation after template cloning
- Integrated Nx Cloud connection for template flow using dynamic require pattern

#### 2. Critical Bug Fixes

**nxCloudId Generation (Multiple iterations)**
- **Problem**: `nxCloudId` was showing as `undefined` in Cloud connection URL for template flow
- **Root Cause**: Template flow never called `connectToNxCloud` generator, which generates the Cloud workspace ID
- **Solution**: Created `connectToNxCloudForTemplate` function using dynamic `require.resolve` with `paths` option
- **Key Technical Details**:
  - Cannot use direct imports from `nx` package (no dependency in create-nx-workspace)
  - Must use `require.resolve` to load from workspace's installed nx packages
  - FsTree virtual file system requires `flushChanges()` to persist changes to disk
  - Directory parameter must be empty string `''` (FsTree root is already absolute)
- **Files Modified**: `packages/create-nx-workspace/src/utils/nx/nx-cloud.ts`, `packages/create-nx-workspace/src/create-workspace.ts`
- **Testing**: Published versions 23.0.20-23.0.24 locally, verified `nxCloudId` generation

**Template Flag Support in Non-Interactive Mode**
- **Problem**: `--template` flag was ignored in non-interactive mode
- **Root Cause**: `determineTemplate` didn't check CLI flag before checking interactive mode
- **Solution**: Added `if (parsedArgs.template) return parsedArgs.template;` at start of function
- **Files Modified**: `packages/create-nx-workspace/src/internal-utils/prompts.ts`
- **Testing**: Published version 23.0.21, verified template flag works

**Windows Path Compatibility**
- **Problem**: Used relative path string concatenation instead of absolute paths
- **Solution**: Changed to `join(workingDir, name)` for cross-platform compatibility
- **Files Modified**: `packages/create-nx-workspace/src/create-workspace.ts`

#### 3. GitHub Push Prompt Integration
- **Feature**: Added GitHub push prompt for template flow with Nx Cloud
- **Implementation**: Updated condition to include `(nxCloud === 'github' || (isTemplate && nxCloud === 'yes'))`
- **Result**: Template users now get prompted "Would you like to push this workspace to Github?" matching preset flow behavior
- **Files Modified**: `packages/create-nx-workspace/src/create-workspace.ts`
- **Testing**: Published version 23.0.25, verified prompt appears correctly
- **Commit**: `8ad6194d2a` - feat(core): add GitHub push prompt for template flow with Nx Cloud

#### 4. Custom Starter Option
- **Feature**: Added "Custom" option to starter selection menu
- **Description**: "More options for framework, test runners, etc."
- **Behavior**: Returns `'skip'` which triggers the original preset-based flow
- **Purpose**: Gives users access to full configuration options when templates don't fit their needs
- **Files Modified**: `packages/create-nx-workspace/src/internal-utils/prompts.ts`
- **Commit**: `7ba12c83a3` - feat(core): add Custom starter option to access preset flow
- **Future Consideration**: Consider updating the preset flow's Cloud prompts to use simplified messaging like the template flow (lower priority)

#### 5. Naming and Messaging Updates
- Renamed `determineNxCloudSimple` to `determineNxCloudV2`
- Updated message keys from `setupNxCloudSimple` to `setupNxCloudV2`
- Updated A/B testing codes with `cloud-v2-` prefix
- Changed "stack" terminology to "starter" in user-facing messages

### Technical Learnings

**Dynamic Module Loading Pattern**
```typescript
const { connectToNxCloud } = require(require.resolve(
  'nx/src/nx-cloud/generators/connect-to-nx-cloud/connect-to-nx-cloud',
  { paths: [directory] }
));
```

**FsTree Virtual File System**
- Must call `flushChanges(directory, tree.listChanges())` to persist changes
- Directory parameter should be empty string when tree root is already absolute
- Changes are in-memory until explicitly flushed

**Cross-Platform Path Handling**
- Use `path.join()` instead of string concatenation
- Use `.replace(/\\/g, '/')` for Windows backslash normalization

### Commits (in chronological order)
1. `4e3f475f63` - fix(vite): support vitest v4
2. `f7bf7c7dbd` - feat(core): add template support to create-nx-workspace
3. `abe324dfcc` - feat(core): track simplified Cloud prompt variants in templates
4. `05c5f70986` - chore(misc): update messages for cnw
5. `b027f4625a` - cleanup(core): rename determineNxCloudSimple to determineNxCloudV2
6. `0cd5398525` - chore(misc): cleanup
7. `6bcee00066` - fix(core): generate nxCloudId for template flow (includes fixes for dynamic require, FsTree, path handling)
8. `4bf3126d5a` - chore(misc): remove unused arg
9. `8ad6194d2a` - feat(core): add GitHub push prompt for template flow with Nx Cloud
10. `7ba12c83a3` - feat(core): add Custom starter option to access preset flow

### Files Modified
- `packages/create-nx-workspace/src/create-workspace.ts`
- `packages/create-nx-workspace/src/utils/nx/nx-cloud.ts`
- `packages/create-nx-workspace/src/internal-utils/prompts.ts`
- `packages/create-nx-workspace/bin/create-nx-workspace.ts`
- `packages/create-nx-workspace/src/utils/nx/ab-testing.ts`

### Testing Strategy
- Published 6 local versions (23.0.20-23.0.25) for iterative testing
- Verified nxCloudId generation in nx.json
- Tested GitHub push prompt appears correctly
- Confirmed end-to-end flow: template clone → install → Cloud connection → git init → GitHub push prompt

### Impact
Users can now use `npx create-nx-workspace --template org/repo` to clone templates and get seamless Nx Cloud integration with GitHub push capabilities, matching the experience of the preset flow.

---

## Nx 2026 Roadmap Draft

### Overview
Drafted comprehensive roadmap for Nx 2026 with 7 major strategic themes.

### Key Accomplishments

#### 1. Research & Planning
- Analyzed 2025 roadmap structure (7 themes, narrative prose format, high-level directions)
- Researched 50+ Linear projects and issues from Nx CLI and Nx Cloud teams
- Identified major themes from customer-driven projects and strategic initiatives
- Gathered input on priorities via user questions (polyglot support, AI-native development, modern JS/TS tooling)

#### 2. CI Improvements Research
- Investigated Linear for CI enhancement projects beyond target-level affected logic
- Found 5 key areas: test atomization expansion, CPU/memory tracking, AI-powered insights, flaky test reduction, cost visibility
- Identified specific projects: CI Watchdog (AI-powered monitoring), CIPE credit usage view, test atomization for Cypress/Gradle

#### 3. Roadmap Sections
**Final 7 Themes:**
1. **Polyglot Monorepos** - .NET (`@nx/dotnet`), Java/Maven, experimental PHP, Python discussion
2. **Modern JavaScript and TypeScript** - Node 24, ESM migration, oxc/Biome/oxlint integration
3. **AI-Native Development Experience** - AI-assisted migrations, enhanced metadata for Claude Code/Cursor/Copilot
4. **Performance and Developer Observability** - Rust migration (task orchestrator), CPU/memory tracking
5. **Smarter CI Pipelines** - Target-level affected logic, test atomization expansion, AI-powered insights
6. **Nx Release for Apps** - Docker release evolution, polyglot deployment support
7. **Integration with Modern Tooling** - Knip, Crystal plugins (SWC/esbuild), voidZero ecosystem

#### 4. Iterative Refinement
- Trimmed roadmap by 30% per user request
- Removed "Developer Experience and Onboarding" section
- Split "CI/CD and Deployment" into two focused sections
- Removed customer names (Lemonade, Hilton)
- Updated deployment section title and messaging per user feedback
- Emphasized Nx Release for Docker is already in use internally

### Technical Details
- Format: Narrative prose (no bullet points within sections)
- Length: Concise, ~3-5 sentences per section
- Tone: High-level strategic direction, not tied to specific releases
- Location: `.ai/2025-11-13/tasks/2026-roadmap-draft.md`

### Impact
Created concise, strategic roadmap that balances polyglot expansion, modern tooling adoption, AI integration, and CI/CD improvements - ready for final review and publication.
