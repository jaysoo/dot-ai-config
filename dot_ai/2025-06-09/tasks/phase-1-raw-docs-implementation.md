# Phase 1: Raw Docs Implementation Plan

## Overview

This plan breaks down Phase 1 of the Raw Docs System into small, actionable tasks. Each task represents a logical git commit that can be executed independently. The goal is to create a working example of the raw-docs repository with essential scripts for testing the initial workflow.

## TODOs

### Task 1: Create Basic Repository Structure
- [x] 1.1: Create root directory and basic folder structure
- [x] 1.2: Create minimal README.md with project overview
- [x] 1.3: Create empty ARCHIVED.md with structure
- [x] 1.4: Create placeholder TEMPLATE.md
- [x] 1.5: Create basic CONTRIBUTING.md

### Task 2: Implement Feature Documentation Template
- [x] 2.1: Add complete TEMPLATE.md with all sections from spec
- [x] 2.2: Add inline examples and guidance comments
- [x] 2.3: Add AI integration instructions

### Task 3: Create Example Feature Documentation
- [x] 3.1: Create nx-docker-integration.md (draft status)

### Task 4: Implement Developer Check Script
- [x] 4.1: Create basic script structure with CLI interface
- [x] 4.2: Add git history analysis functionality
- [x] 4.3: Add CODEOWNERS parsing logic
- [x] 4.4: Add developer field update mechanism

### Task 5: Create Pre-Push Hook Script
- [x] 5.1: Create pre-push hook detection logic
- [x] 5.2: Add file pattern matching for features
- [x] 5.3: Create install-hook script
- [x] 5.4: Add user interaction and prompts

### Task 6: Add Documentation and Usage Guide
- [x] 6.1: Update README.md with features table and usage
- [x] 6.2: Complete CONTRIBUTING.md with detailed guidelines
- [x] 6.3: Add examples and best practices

### Task 7: Create Integration Test Suite
- [x] 7.1: Create test data structure
- [x] 7.2: Add tests for developer check script
- [x] 7.3: Add tests for pre-push hook
- [x] 7.4: Create main test runner

## Task Breakdown

### Task 1: Create Basic Repository Structure

#### 1.1: Create root directory and basic folder structure
**Commit Message**: `feat(raw-docs): initialize directory structure`

- Create `.ai/2025-06-09/raw-docs-example/` directory
- Add folders: `features-cli/`, `features-cloud/`, `archived/`, `scripts/`
- Create `.gitkeep` files in empty directories

#### 1.2: Create minimal README.md with project overview  
**Commit Message**: `feat(raw-docs): add basic README with project overview`

- Create basic README.md with project description
- Add placeholder for features table
- Include basic usage instructions

#### 1.3: Create empty ARCHIVED.md with structure
**Commit Message**: `feat(raw-docs): add ARCHIVED.md structure`

- Create ARCHIVED.md with header structure
- Add sections for archived features by year
- Include maintenance guidelines

#### 1.4: Create placeholder TEMPLATE.md
**Commit Message**: `feat(raw-docs): add placeholder TEMPLATE.md`

- Create basic TEMPLATE.md structure
- Add metadata section headers
- Include brief instructions

#### 1.5: Create basic CONTRIBUTING.md
**Commit Message**: `feat(raw-docs): add basic CONTRIBUTING.md`

- Create basic contribution guidelines
- Add workflow overview
- Include placeholder for detailed instructions

### Task 2: Implement Feature Documentation Template

#### 2.1: Add complete TEMPLATE.md with all sections from spec
**Commit Message**: `feat(raw-docs): complete TEMPLATE.md with all required sections`

- Add all sections from the specification
- Include proper markdown formatting
- Add field descriptions

#### 2.2: Add inline examples and guidance comments
**Commit Message**: `feat(raw-docs): add examples and guidance to TEMPLATE.md`

- Add example content for each section
- Include formatting guidelines
- Add tips for developers

#### 2.3: Add AI integration instructions
**Commit Message**: `feat(raw-docs): add AI integration instructions to TEMPLATE.md`

- Add instructions for AI-assisted documentation
- Include question-based workflow
- Add best practices for AI usage

### Task 3: Create Example Feature Documentation

#### 3.1: Create nx-agents.md (shipped status)
**Commit Message**: `feat(raw-docs): add nx-agents example documentation (shipped)`

- Create comprehensive nx-agents documentation
- Demonstrate shipped feature format
- Include real examples and code references

#### 3.2: Create project-crystal.md (in-progress status)  
**Commit Message**: `feat(raw-docs): add project-crystal example documentation (in-progress)`

- Create project-crystal documentation
- Show in-progress feature format
- Include partial information and TODOs

#### 3.3: Create continuous-tasks.md (draft status)
**Commit Message**: `feat(raw-docs): add continuous-tasks example documentation (draft)`

- Create continuous-tasks documentation
- Demonstrate draft feature format
- Show early-stage documentation

### Task 4: Implement Developer Check Script

#### 4.1: Create basic script structure with CLI interface
**Commit Message**: `feat(raw-docs): add developer check script structure`

- Create basic Node.js script with CLI
- Add help text and usage instructions
- Include error handling framework

#### 4.2: Add git history analysis functionality
**Commit Message**: `feat(raw-docs): add git history analysis to developer check`

- Implement git log parsing
- Extract contributor information
- Handle file path analysis

#### 4.3: Add CODEOWNERS parsing logic
**Commit Message**: `feat(raw-docs): add CODEOWNERS parsing to developer check`

- Parse CODEOWNERS file format
- Match file patterns to owners
- Merge with git history data

#### 4.4: Add developer field update mechanism
**Commit Message**: `feat(raw-docs): add developer field update functionality`

- Parse markdown metadata
- Update developer fields
- Preserve file formatting

### Task 5: Create Pre-Push Hook Script

#### 5.1: Create pre-push hook detection logic
**Commit Message**: `feat(raw-docs): add pre-push hook file detection logic`

- Implement git diff parsing
- Detect new and modified files
- Filter for feature-related changes

#### 5.2: Add file pattern matching for features
**Commit Message**: `feat(raw-docs): add feature file pattern matching`

- Define patterns for Nx repository
- Define patterns for Ocean repository
- Add configurable pattern matching

#### 5.3: Create install-hook script
**Commit Message**: `feat(raw-docs): add hook installation script`

- Create installation helper script
- Handle different repository types
- Add verification and testing

#### 5.4: Add user interaction and prompts
**Commit Message**: `feat(raw-docs): add user prompts to pre-push hook`

- Implement interactive prompts
- Add colored output for clarity
- Include helpful instructions

### Task 6: Add Documentation and Usage Guide

#### 6.1: Update README.md with features table and usage
**Commit Message**: `docs(raw-docs): update README with features table and usage`

- Add active features table
- Include usage instructions
- Add links to examples

#### 6.2: Complete CONTRIBUTING.md with detailed guidelines
**Commit Message**: `docs(raw-docs): complete CONTRIBUTING.md with detailed guidelines`

- Add detailed workflow documentation
- Include best practices
- Add troubleshooting section

#### 6.3: Add examples and best practices
**Commit Message**: `docs(raw-docs): add examples and best practices documentation`

- Include real-world examples
- Add common patterns
- Document edge cases

### Task 7: Create Integration Test Suite

#### 7.1: Create test data structure
**Commit Message**: `test(raw-docs): add test data structure`

- Create sample feature documentation
- Add mock git history data
- Include test CODEOWNERS file

#### 7.2: Add tests for developer check script
**Commit Message**: `test(raw-docs): add tests for developer check script`

- Test git history parsing
- Test CODEOWNERS integration
- Test developer field updates

#### 7.3: Add tests for pre-push hook
**Commit Message**: `test(raw-docs): add tests for pre-push hook`

- Test file detection logic
- Test pattern matching
- Mock user interactions

#### 7.4: Create main test runner
**Commit Message**: `test(raw-docs): add main test runner`

- Create test orchestration script
- Add test reporting
- Include cleanup utilities

## Implementation Notes

### Pre-Push Hook Strategy
- Hook implemented in Node.js with `.mjs` extension for consistency
- Advisory (not blocking) in Phase 1
- Focus on awareness and gentle reminders
- Provide clear instructions for updating raw docs
- Generic implementation that works for both Nx and Ocean repos

### Script Architecture
- All scripts use Node.js with ESM (`.mjs` extension)
- Minimal dependencies (use Node.js built-ins where possible)
- Clear error messages and help text
- Idempotent operations (safe to run multiple times)

### Testing Approach
1. Create example feature with documentation
2. Test developer check script with sample data
3. Install pre-push hook in test scenario
4. Verify all scripts work as expected
5. Document any edge cases or limitations

## Alternatives Considered

1. **Blocking vs Non-blocking Hooks**: Decided on non-blocking for Phase 1 to encourage adoption without disrupting workflow
2. **Separate Repo vs Monorepo**: Separate repo chosen for clear ownership and simpler access control
3. **Bash vs Node.js for Hooks**: Node.js chosen for consistency and easier maintenance

## Expected Outcomes

After completing Phase 1:
- Working example of raw-docs repository under `.ai/2025-06-09/raw-docs-example/`
- Installable Node.js pre-push hook that works for both Nx and Ocean repositories
- Essential scripts functional and tested
- Clear documentation for developers and docs team
- Foundation ready for Phase 2 developer onboarding

## Next Steps

1. Review this plan and provide feedback
2. Execute tasks sequentially, committing after each
3. Test the system with a real feature documentation
4. Gather feedback from docs team
5. Prepare for Phase 2 rollout
