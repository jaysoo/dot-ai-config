# Daily Summary - 2025-06-21

## Work Performed

### Deprecated simpleName Option in Library Generators
- **Task**: Deprecate simpleName option across multiple library generators
- **Issue**: #29508
- **Status**: Completed
- **Branch**: feat/issue-29508-angular-deprecation

#### Implementation Details:
1. **Angular Library Generator**:
   - Added deprecation warning to schema.json
   - Updated generator code to show runtime warning
   - Target removal: Nx 22

2. **JS Library Generator**:
   - Applied same deprecation pattern
   - Consistent warning message across all generators
   - Generated documentation updated

3. **Commits**:
   - a4a849d12c: feat(js): deprecate simpleName option in library generators
   - 74c7c34d25: feat(angular): deprecate simpleName option in library generator

#### Key Changes:
- Added `x-deprecated` property in schema.json files
- Runtime warning: "The '--simpleName' option is deprecated and will be removed in Nx 22. Please use the '--name' option to provide the exact name you want for the library."
- Updated generated documentation to reflect deprecation

## In Progress Tasks

### Generator Migration to TS Solution
- **Owner**: Hilton, Norark (Steven)
- **Status**: Ongoing
- **Jira**: AXO-19
- **Goal**: Extract TS solution migrator from Ocean repo into public package

### Slow ESLint Graph Calculation
- **Issue**: #27849
- **Status**: Investigation ongoing

### Raw-docs Trial Implementation
- **Components**:
  - Node.js backend (merged)
  - Java PR pending review
  - MCP integration
- **Status**: Iterating on implementation

### Nx CLI Heap Usage Logging - Phase 1
- **Status**: Core implementation complete
- **Remaining**: Tests, documentation, ForkedProcessTaskRunner support

## Key Decisions
- Consistent deprecation messaging across all library generators
- Clear migration path to using `--name` option
- Target removal in Nx 22 to give users time to migrate

## Next Steps
- Monitor for any issues with deprecation warnings
- Complete triage during cooldown week (June 23rd)
- Continue investigation of ESLint performance issue
- Ensure Nicholas' PRs are merged for Migrate UI

## Notes
- Working on clean branch structure with focused commits
- Deprecation approach follows established Nx patterns for backward compatibility