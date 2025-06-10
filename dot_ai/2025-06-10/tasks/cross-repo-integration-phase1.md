# Cross-Repository Raw Docs Integration - Phase 1 Implementation Plan

**Spec Reference**: `.ai/2025-06-10/specs/cross-repo-integration.md`  
**Phase**: 1 - Core Integration (MVP)  
**Created**: 2025-06-10  
**Status**: Planning

## Overview

This plan implements Phase 1 of the cross-repository integration system that allows monorepos (like NX) to leverage raw-docs without submodules. The system provides automated documentation reminders and AI-assisted documentation updates during the development workflow.

## Phase 1 Objectives

1. ✅ Install script with husky awareness
2. ✅ Pre-push hook with change detection  
3. ✅ Basic Claude Code integration
4. ✅ Error handling and graceful degradation

## Implementation Steps

### Step 1: Create Cross-Repo Install Script

**Files to create/modify**:
- `scripts/install-cross-repo.mjs` - New installer script for monorepos

**Tasks**:
- [ ] Create interactive installer script using Node.js ESM
- [ ] Implement repository type detection (NX, Ocean, generic)
- [ ] Add hook system detection (husky, simple-git-hooks, regular git)
- [ ] Create `.rawdocsrc` configuration file generator
- [ ] Add path validation and resolution logic
- [ ] Implement error handling for common issues

**Reasoning**: The installer needs to be smart enough to work with existing hook systems without breaking them. Interactive approach ensures proper configuration.

**TODO**:
- [ ] Research husky hook modification best practices
- [ ] Test with different Node.js versions (20+)
- [ ] Handle edge cases (permissions, symlinks, etc.)

### Step 2: Implement Pre-Push Check Script

**Files to create/modify**:
- `scripts/check-docs.mjs` - Pre-push documentation check script

**Tasks**:
- [ ] Create script that runs from monorepo context
- [ ] Load `.rawdocsrc` configuration safely
- [ ] Implement change detection against main/master branch
- [ ] Add pattern matching for relevant file changes
- [ ] Create interactive prompt for AI analysis
- [ ] Implement graceful degradation if raw-docs unavailable

**Reasoning**: This script needs to be fast and non-blocking. It should only prompt when relevant changes are detected.

**TODO**:
- [ ] Define file patterns for each repo type
- [ ] Optimize performance for large diffs
- [ ] Test with various git states

### Step 3: Build AI Analysis Orchestrator

**Files to create/modify**:
- `scripts/analyze-changes.mjs` - AI analysis coordination script

**Tasks**:
- [ ] Create context preparation logic
- [ ] Implement git diff collection
- [ ] Add existing documentation listing
- [ ] Create Claude Code CLI invocation
- [ ] Parse and process AI responses
- [ ] Handle output file management
- [ ] Add CLAUDE.md context integration

**Reasoning**: The orchestrator needs to prepare comprehensive context for Claude Code to make intelligent documentation suggestions.

**TODO**:
- [ ] Verify Claude Code CLI flags (--output, --file)
- [ ] Create test fixtures for AI context
- [ ] Research optimal prompt engineering

### Step 4: Update Existing Scripts for Cross-Repo Support

**Files to modify**:
- `scripts/check-developers.mjs` - Add cross-repo awareness
- `scripts/pre-push-hook.mjs` - Potentially deprecate or adapt

**Tasks**:
- [ ] Add support for external repository paths in check-developers
- [ ] Update pattern matching to handle cross-repo scenarios
- [ ] Ensure backward compatibility with existing workflows
- [ ] Add configuration loading from `.rawdocsrc`

**TODO**:
- [ ] Test with existing raw-docs workflows
- [ ] Document migration path

### Step 5: Create Installation and Testing Documentation

**Files to create/modify**:
- `README.md` - Add cross-repo installation section
- `.ai/2025-06-10/tasks/installation-guide.md` - Detailed guide

**Tasks**:
- [ ] Write step-by-step installation instructions
- [ ] Create troubleshooting guide
- [ ] Document configuration options
- [ ] Add examples for different scenarios
- [ ] Create quick-start guide for NX users

**TODO**:
- [ ] Test instructions on fresh systems
- [ ] Get feedback from potential users

### Step 6: Implement Comprehensive Tests

**Files to create**:
- `tests/test-install-cross-repo.mjs`
- `tests/test-check-docs.mjs`
- `tests/test-analyze-changes.mjs`

**Tasks**:
- [ ] Create unit tests for all new functions
- [ ] Add integration tests for complete workflows
- [ ] Test various repository configurations
- [ ] Mock Claude Code CLI interactions
- [ ] Test error scenarios

**TODO**:
- [ ] Define test coverage targets
- [ ] Create CI/CD test scenarios

## Installation Instructions (for README)

### Prerequisites
- Node.js 20 or higher
- Git 2.0 or higher  
- Claude Code CLI installed (`npm install -g @anthropic-ai/claude-code`)
- Access to raw-docs repository

### Quick Start for NX Monorepo

1. **Clone raw-docs repository** (if not already available):
   ```bash
   git clone https://github.com/your-org/raw-docs.git ~/projects/raw-docs
   ```

2. **Navigate to your NX monorepo**:
   ```bash
   cd ~/projects/nx
   ```

3. **Run the installer**:
   ```bash
   node ~/projects/raw-docs/scripts/install-cross-repo.mjs
   ```

4. **Follow the interactive prompts**:
   - Confirm repository type (should auto-detect as NX)
   - Verify raw-docs location
   - Confirm hook installation

5. **Verify installation**:
   ```bash
   # Check configuration
   cat .rawdocsrc
   
   # Test the hook (dry-run)
   node ~/projects/raw-docs/scripts/check-docs.mjs --test
   ```

### Configuration

The `.rawdocsrc` file (gitignored) contains:
```json
{
  "rawDocsPath": "/absolute/path/to/raw-docs",
  "repoType": "nx",
  "installedVersion": "1.0.0",
  "enableAI": true,
  "patterns": {
    "include": ["packages/**/*.ts", "apps/**/*.ts"],
    "exclude": ["**/*.spec.ts", "**/test/**/*"]
  }
}
```

### Usage

After installation, the system works automatically:

1. Make code changes in your monorepo
2. Commit your changes
3. Run `git push`
4. If relevant changes detected, you'll see:
   ```
   📝 Detected changes that may require documentation updates:
      - Modified: packages/nx/src/generators/library/library.ts
   
   Analyze changes for documentation needs? (Y/n)
   ```
5. Select `Y` to run AI analysis
6. Review suggested documentation updates in raw-docs repo
7. Commit documentation changes separately

### Troubleshooting

**Hook not triggering?**
- Verify `.rawdocsrc` exists and has correct paths
- Check hook installation: `cat .git/hooks/pre-push` or `.husky/pre-push`
- Run manual test: `node ~/projects/raw-docs/scripts/check-docs.mjs`

**Claude Code errors?**
- Ensure Claude Code CLI is installed: `claude --version`
- Check if `CLAUDE.md` exists in raw-docs with proper context
- Try manual analysis: `node ~/projects/raw-docs/scripts/analyze-changes.mjs`

**Permission issues?**
- Ensure raw-docs directory is accessible
- Check git hook permissions: `ls -la .git/hooks/`

## Expected Outcomes

### For Developers
- Zero-friction documentation reminders during normal workflow
- Optional AI assistance for documentation updates
- No breaking changes to existing git workflows
- Clear instructions for troubleshooting

### For Documentation Team
- Increased documentation coverage for new features
- More timely documentation updates
- Better developer attribution in docs
- Consistent documentation quality

### Technical Achievements
- Seamless integration with multiple hook systems
- Robust error handling and graceful degradation
- Fast performance with minimal overhead
- Cross-platform compatibility

## Success Criteria

1. **Installation Success Rate**: >95% successful installations
2. **Performance Impact**: <1 second added to push workflow
3. **AI Analysis Quality**: Useful suggestions in >80% of cases
4. **Developer Adoption**: >50% opt-in to AI analysis when prompted

## Risks and Mitigations

### Risk: Claude Code CLI changes
**Mitigation**: Version check and compatibility layer

### Risk: Hook conflicts with existing tools
**Mitigation**: Careful hook prepending, not replacement

### Risk: Performance issues with large repos
**Mitigation**: Smart pattern matching and caching

### Risk: AI hallucinations in documentation
**Mitigation**: Always require human review before committing

## Next Steps

1. Review this plan with stakeholders
2. Set up test NX repository for development
3. Begin implementation with Step 1
4. Create progress tracking in `.ai/TODO.md`
5. Schedule testing sessions with volunteer developers

## Alternative Approaches Considered

1. **Git Submodules**: Rejected due to complexity and developer friction
2. **NPM Package**: Would require versioning and publishing overhead
3. **GitHub Actions Only**: Misses the interactive development flow
4. **Copy Scripts**: Would lead to version drift and maintenance issues

The chosen approach (centralized scripts with local config) provides the best balance of maintainability and developer experience.