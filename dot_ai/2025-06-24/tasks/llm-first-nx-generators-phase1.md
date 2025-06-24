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
- [ ] Analyze how current `nx generate` command works
- [ ] Study existing @nx/react and @nx/js generators structure
- [ ] Identify extension points for AI integration
- [ ] Research Claude Code headless API capabilities
- [ ] Create architecture diagram showing integration flow

**Reasoning**: Before modifying the generator system, we need to understand current implementation patterns and ensure backward compatibility.

**Alternatives**: 
- Could create entirely new command (e.g., `nx ai-generate`) but this would fragment the experience
- Could fork existing generators but this increases maintenance burden

### Step 2: Design Markdown Template Structure
**Goal**: Create standardized markdown template format for TypeScript and React generators

**TODOs**:
- [ ] Design TypeScript library template structure
- [ ] Design React app template structure (with Vite)
- [ ] Define CRITICAL vs flexible sections format
- [ ] Create variable substitution syntax (e.g., $PROJECT_NAME)
- [ ] Write template validation schema

**Reasoning**: Templates need clear structure to ensure AI generates predictable results while allowing flexibility.

### Step 3: Implement Claude Code Integration Layer
**Goal**: Create infrastructure for executing markdown templates via Claude Code headless

**TODOs**:
- [ ] Create `packages/ai-generators` package
- [ ] Implement Claude Code client/adapter
- [ ] Create markdown template executor
- [ ] Add error handling and retry logic
- [ ] Implement dry-run support
- [ ] Add logging and debugging capabilities

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