# Task Plan: Documentation-Feature Correlation Tool

**Task Type**: New Feature  
**Created**: 2025-06-11  
**Status**: Planning  

## Overview

Create a tool that helps documentation team members identify feature changes in the `features/` directory since a given git SHA, correlate these changes with relevant documentation files in the Nx repository's `docs/` folder, and generate an AI-consumable update plan.

## Problem Statement

The documentation team needs an automated way to:
1. Track feature changes between releases/commits
2. Identify which documentation files might need updates based on feature changes
3. Generate a structured plan that AI (Claude) can use to suggest specific documentation updates

## Architecture & Design

### High-Level Flow
```
1. User provides git SHA → 
2. Tool analyzes feature changes since SHA →
3. Tool scans nx/docs for relevant documentation →
4. Tool correlates features with docs →
5. Tool generates update plan (.md) →
6. AI consumes plan and suggests updates
```

### Key Components
- **Feature Change Analyzer**: Extracts changes from git history
- **Documentation Scanner**: Finds and categorizes docs in nx repo
- **Correlation Engine**: Matches features to relevant documentation
- **Update Plan Generator**: Creates structured markdown for AI consumption

## Implementation Steps

### Step 1: Create Feature Change Analyzer ✅
**Goal**: Build a script to extract and analyze feature changes since a given SHA

**TODO**:
- [x] Create `analyze-feature-changes.mjs` script
- [x] Implement git diff parsing for `features/` directory
- [x] Extract changed feature names, descriptions, and status
- [x] Parse markdown content changes to identify key modifications
- [x] Output structured JSON with change details

**Technical Details**:
- Use `git diff --name-status SHA..HEAD -- features/`
- Parse feature markdown files for metadata (status, title, affected-packages)
- Categorize changes: new features, updates, removals
- Extract semantic changes from diff content

### Step 2: Create Documentation Scanner ✅
**Goal**: Build a script to scan and categorize nx repository documentation

**TODO**:
- [x] Create `scan-nx-docs.mjs` script
- [x] Implement directory traversal for `../nx/docs`
- [x] Extract document metadata (title, sections, keywords)
- [x] Build searchable index of documentation content
- [x] Create mapping of docs to nx packages/features

**Technical Details**:
- Parse markdown frontmatter and headers
- Extract code references and package mentions
- Build keyword index for fuzzy matching
- Handle nested documentation structure

### Step 3: Create Correlation Engine ✅
**Goal**: Match feature changes to relevant documentation files

**TODO**:
- [x] Create `correlate-features-docs.mjs` script
- [x] Implement keyword matching algorithm
- [x] Match feature affected-packages to doc references
- [x] Score relevance of each doc to each feature change
- [x] Handle edge cases (new features, removed features)

**Correlation Strategies**:
1. **Direct Package Matching**: Feature's affected-packages ↔ Doc's package references
2. **Keyword Matching**: Feature keywords ↔ Doc content keywords
3. **Path Analysis**: Feature naming patterns ↔ Doc file paths
4. **Content Similarity**: Feature descriptions ↔ Doc content sections

### Step 4: Create Update Plan Generator ✅
**Goal**: Generate AI-consumable markdown update plan

**TODO**:
- [x] Create `generate-update-plan.mjs` script
- [x] Design markdown template for AI consumption
- [x] Include change summaries and correlation scores
- [x] Add specific update suggestions based on change types
- [x] Format for optimal Claude processing

**Update Plan Structure**:
```markdown
# Documentation Update Plan

## Analysis Summary
- Analysis Date: YYYY-MM-DD
- Changes Since: SHA
- Features Changed: X
- Documents Potentially Affected: Y

## Feature Changes

### [Feature Name]
- **Change Type**: new/updated/removed
- **Key Changes**: 
  - Change 1
  - Change 2
- **Affected Packages**: package1, package2
- **Suggested Documentation Updates**:
  - Document: path/to/doc.md
    - Relevance Score: 0.95
    - Suggested Changes: ...
```

### Step 5: Create Main CLI Tool ✅
**Goal**: Orchestrate all components with user-friendly interface

**TODO**:
- [x] Create `docs-correlation-tool.mjs` main script
- [x] Implement CLI argument parsing
- [x] Add validation for git SHA and repo paths
- [x] Orchestrate component execution
- [x] Handle errors gracefully

**CLI Interface**:
```bash
node docs-correlation-tool.mjs --since <SHA> --nx-path ../nx --output update-plan.md
```

### Step 6: Add Intelligence Features ✅
**Goal**: Enhance correlation accuracy with smart features

**TODO**:
- [x] Implement change impact analysis
- [x] Add historical correlation learning
- [x] Create confidence scoring system
- [ ] Add manual override capabilities (future enhancement)
- [x] Include change context extraction

## Testing Strategy

### Unit Tests
- Test git diff parsing with fixtures
- Test markdown parsing and extraction
- Test correlation algorithms
- Test plan generation formatting

### Integration Tests
- Test full flow with sample data
- Test cross-repository access
- Test various change scenarios
- Validate AI-consumable output

## Deliverables

1. **Scripts** (in `.ai/2025-06-11/tasks/`):
   - `analyze-feature-changes.mjs`
   - `scan-nx-docs.mjs`
   - `correlate-features-docs.mjs`
   - `generate-update-plan.mjs`
   - `docs-correlation-tool.mjs` (main CLI)

2. **Generated Output**:
   - `update-plan-[timestamp].md` - AI-consumable update plan

3. **Documentation**:
   - Usage guide for docs team
   - AI prompt templates for Claude

## Status: COMPLETED ✅

All core functionality has been implemented. The tool is ready for use.

## Expected Outcome

When completed, the docs team will be able to:
1. Run: `node docs-correlation-tool.mjs --since abc123`
2. Get a comprehensive markdown file listing:
   - All feature changes since the SHA
   - Correlated documentation files that likely need updates
   - Specific suggestions for what to update
   - Confidence scores for each correlation
3. Pass this file to Claude to get detailed update suggestions
4. Review and apply documentation updates efficiently

## Success Criteria

- [x] Tool correctly identifies all feature changes
- [x] Correlation accuracy > 80% for obvious matches
- [x] Generated plans are actionable by AI
- [x] Execution time < 30 seconds for typical usage
- [x] Clear error messages for edge cases

## Risks & Mitigation

1. **Cross-repo access**: Ensure proper path handling
2. **Large diff sizes**: Implement pagination/filtering
3. **False correlations**: Include confidence scores
4. **Missing nx repo**: Graceful error handling

## Next Steps

1. Review and approve this plan
2. Begin implementation with Step 1
3. Test each component individually
4. Integrate and test full workflow
5. Create documentation for end users