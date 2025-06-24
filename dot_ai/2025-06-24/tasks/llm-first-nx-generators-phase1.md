# LLM-First Nx Generators - Phase 1 Implementation Plan

**Date**: 2025-06-24  
**Type**: Feature Implementation  
**Spec Reference**: `.ai/2025-06-24/specs/llm-first-nx-generators.md`  
**Phase**: 1 - MVP

## Overview

This plan implements Phase 1 of the LLM-First Nx Generators specification, which includes:
- Claude Code headless integration
- Basic TypeScript (tsconfig.json files) and React app (plain Vite, no meta framework) generators
- Simple variable substitution
- Post-generation validation

## Implementation Steps

### Step 1: Research and Analysis
**Goal**: Understand existing Nx generator architecture and identify integration points

**TODOs**:
- [x] Analyze how current `nx generate` command works
- [x] Study existing @nx/react and @nx/js generators structure
- [x] Identify extension points for AI integration
- [ ] Research Claude Code headless API capabilities
- [ ] Create architecture diagram showing integration flow

**Reasoning**: Before modifying the generator system, we need to understand current implementation patterns and ensure backward compatibility.

**Alternatives**: 
- Could create entirely new command (e.g., `nx ai-generate`) but this would fragment the experience
- Could fork existing generators but this increases maintenance burden

### Step 2: Design Markdown Template Structure
**Goal**: Create standardized markdown template format for TypeScript and React generators

**TODOs**:
- [x] Design TypeScript library template structure
- [x] Design React app template structure (with Vite)
- [x] Define CRITICAL vs flexible sections format
- [x] Create variable substitution syntax (e.g., $PROJECT_NAME)
- [ ] Write template validation schema

**Completed**: Created sample templates in `.ai/2025-06-24/tasks/templates/`

**Reasoning**: Templates need clear structure to ensure AI generates predictable results while allowing flexibility.

### Step 3: Implement Claude Code Integration Layer
**Goal**: Create infrastructure for executing markdown templates via Claude Code headless

**TODOs**:
- [x] Create PoC implementation in generate.ts
- [x] Implement basic AI execution handler
- [x] Create markdown template executor stub
- [x] Add error handling for unsupported providers
- [x] Implement dry-run support
- [x] Add logging with NX_PREFIX

**Completed**: Created PoC implementation directly in generate.ts with `handleAiGeneration` function

**Reasoning**: Separate package keeps AI functionality isolated and testable.

### Step 4: Create Basic Templates
**Goal**: Implement initial TypeScript and React app templates

**TODOs**:
- [ ] Create TypeScript tsconfig.json template at `@nx/js/ai-templates/tsconfig.md`
- [ ] Create React Vite app template at `@nx/react/ai-templates/app-vite.md`
- [ ] Implement simple variable substitution ($PROJECT_NAME, $DIRECTORY, etc.)
- [ ] Add template discovery mechanism
- [ ] Create template documentation

**Files to create**:
- `.ai/2025-06-24/tasks/templates/typescript-tsconfig.md`
- `.ai/2025-06-24/tasks/templates/react-app-vite.md`

**Reasoning**: Starting with simple, well-understood generators allows us to validate the approach.

### Step 5: Integrate with Nx CLI
**Goal**: Hook AI generators into existing `nx generate` command

**TODOs**:
- [ ] Add `--ai` flag to generate command
- [ ] Modify generator resolution to check for AI templates
- [ ] Ensure all existing flags work (--dry-run, --verbose, etc.)
- [ ] Update help text and documentation
- [ ] Add feature flag for gradual rollout

**Reasoning**: Integration with existing CLI maintains familiar developer experience.

### Step 6: Implement Post-Generation Validation
**Goal**: Automatically verify generated code meets requirements

**TODOs**:
- [ ] Create validation runner that executes after generation
- [ ] Run `nx test <project>` if tests exist
- [ ] Run `nx lint <project>` if linting configured
- [ ] Generate validation report in project README
- [ ] Handle validation failures gracefully

**Reasoning**: Validation ensures AI-generated code meets quality standards.

### Step 7: Testing and Documentation
**Goal**: Comprehensive testing and user documentation

**TODOs**:
- [ ] Unit tests for template executor
- [ ] Integration tests for full generation flow
- [ ] E2E tests for CLI integration
- [ ] Write user documentation
- [ ] Create migration guide for existing generators
- [ ] Add examples to Nx documentation

**Reasoning**: Thorough testing ensures reliability; good docs drive adoption.

### Step 8: Performance and Error Handling
**Goal**: Optimize performance and handle edge cases

**TODOs**:
- [ ] Add caching for Claude Code responses
- [ ] Implement timeout handling
- [ ] Add rollback mechanism for failed generations
- [ ] Create detailed error messages
- [ ] Add telemetry for monitoring

**Reasoning**: Production readiness requires robust error handling and performance optimization.

## Critical Implementation Notes

**IMPORTANT**: When implementing or executing on this task, keep track of progress in this plan doc by updating the TODO checkboxes.

## Implementation Summary

### What Was Completed:

1. **Core Implementation**:
   - Added `--ai` flag to `nx generate` command
   - Implemented `handleAiGeneration` function in generate.ts
   - Created template loading system with multiple search paths
   - Added variable substitution for templates
   - Created stub implementations for React and JS generators

2. **AI Templates Created**:
   - `@nx/react:application` - React Vite app template
   - `@nx/react:library` - React component library template
   - `@nx/js:library` - TypeScript library template
   - `@nx/js:init` - TypeScript configuration template

3. **Features Implemented**:
   - Template discovery from workspace and package locations
   - Variable substitution (`$NAME`, `$DIRECTORY`, etc.)
   - Dry-run support
   - Error handling for unsupported providers
   - Basic file generation (stub implementation)

### Demo Created:
- Documentation in `.ai/2025-06-24/tasks/ai-generator-demo.md`
- Example output in `ai-generator-example-output.txt`
- Templates stored in `packages/*/ai-templates/`

### Current Limitations:
- No actual Claude Code API integration (stub only)
- Templates not included in npm package build
- No post-generation validation
- No template inheritance yet

## Testing and Verification

### Test Commands for Version 22.6.24-beta.2:

```bash
# 1. Create a new workspace with the beta version
cd /tmp  # or appropriate test directory
npx -y create-nx-workspace@22.6.24-beta.2 ai-test --preset=apps --pm=npm --no-interactive

# 2. Navigate to the workspace
cd ai-test

# 3. Test React application generation with AI
npx nx g @nx/react:application my-ai-app --ai=claude --dry-run

# 4. Test React library generation with AI
npx nx g @nx/react:library my-ai-lib --ai=claude --dry-run

# 5. Test JS library generation with AI
npx nx g @nx/js:library my-utils --ai=claude --dry-run

# 6. Test JS init with AI
npx nx g @nx/js:init --ai=claude --dry-run

# 7. Check if AI flag appears in help
npx nx g @nx/react:application --help | grep -i "ai"

# 8. Verify templates are included in the package
ls -la node_modules/@nx/react/ai-templates/
ls -la node_modules/@nx/js/ai-templates/

# 9. Run actual generation (without dry-run) to test file creation
npx nx g @nx/react:application demo-app --ai=claude

# 10. Verify the generated app can be served
npx nx serve demo-app
```

## Expected Outcome

When Phase 1 is complete:

1. **Functional MVP**: Users can run `nx g @nx/react:app myapp --ai=claude` to generate a React Vite app
2. **TypeScript Support**: Basic TypeScript configuration can be generated via AI templates
3. **Validation**: Generated projects automatically validated with test/lint
4. **Documentation**: Clear docs explaining the new AI-first approach
5. **Backward Compatibility**: All existing generators continue to work unchanged
6. **Foundation**: Infrastructure in place for Phase 2 enhancements

## Success Criteria

- [ ] Can generate a working React Vite app using AI template
- [ ] Can generate TypeScript configuration using AI template
- [ ] Post-generation validation runs automatically
- [ ] All existing Nx tests pass
- [ ] Documentation updated with new feature
- [ ] Feature flag allows gradual rollout

## Technical Risks

1. **Claude Code API limitations**: May need workarounds for rate limits or capabilities
2. **Performance**: AI generation slower than traditional generators
3. **Consistency**: Ensuring AI produces identical results across runs
4. **Error handling**: Gracefully handling AI failures or unexpected outputs

## Next Steps After Phase 1

- Phase 2: Template inheritance and enhanced features
- Phase 3: Full ecosystem with community templates and migration tools