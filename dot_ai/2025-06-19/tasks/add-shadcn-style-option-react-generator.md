# Add shadcn Style Option to React Generator

## Task Overview
Add a new style option to the Nx React generator to support shadcn/ui, a popular component library built on top of Tailwind CSS that provides copy-and-paste components.

## Current State Analysis

### TODO - Research Phase
- [ ] Analyze current React generator structure and style options
- [ ] Understand how existing style options are implemented (CSS, SCSS, styled-components, emotion, etc.)
- [ ] Research shadcn requirements and setup process
- [ ] Identify all affected files and generators

## Implementation Plan

### Step 1: Research Current Implementation
**TODO:**
- [ ] Examine React application generator schema and implementation
- [ ] Examine React library generator schema and implementation  
- [ ] Examine React component generator schema and implementation
- [ ] Understand how style configurations are applied
- [ ] Document current style option flow

**Reasoning:** Need to understand the existing architecture before adding new functionality. This will help ensure shadcn integration follows established patterns.

### Step 2: Define shadcn Integration Requirements
**TODO:**
- [ ] Define what files/configs are needed for shadcn setup
- [ ] Determine dependencies required (tailwindcss, postcss, etc.)
- [ ] Create template files for shadcn configuration
- [ ] Plan component structure for shadcn

**Reasoning:** shadcn requires specific setup including Tailwind CSS configuration, CSS variables, and a components directory structure. Understanding these requirements upfront will guide implementation.

### Step 3: Update Generator Schemas
**TODO:**
- [ ] Add 'shadcn' to style enum in application generator schema
- [ ] Add 'shadcn' to style enum in library generator schema
- [ ] Add 'shadcn' to style enum in component generator schema
- [ ] Update schema documentation

**Reasoning:** Schema changes are the foundation - they define the API contract and enable IDE support.

### Step 4: Implement shadcn Setup Logic
**TODO:**
- [ ] Create shadcn setup function in shared utilities
- [ ] Add Tailwind CSS and PostCSS configuration templates
- [ ] Create base shadcn configuration files (components.json, etc.)
- [ ] Add CSS variables and global styles setup
- [ ] Handle dependency installation (tailwindcss, postcss, etc.)

**Reasoning:** Core setup logic should be reusable across different generators. This includes all the boilerplate needed for shadcn to function properly.

### Step 5: Update Application Generator
**TODO:**
- [ ] Add shadcn case to style option handling
- [ ] Apply shadcn setup when selected
- [ ] Update generated app structure for shadcn
- [ ] Ensure proper CSS imports in main files
- [ ] Add example shadcn component usage

**Reasoning:** Application generator is the primary entry point for new React projects and needs full shadcn support.

### Step 6: Update Library Generator
**TODO:**
- [ ] Add shadcn case to style option handling
- [ ] Configure library for shadcn component development
- [ ] Ensure proper exports for shadcn components
- [ ] Handle CSS/style exports appropriately

**Reasoning:** Libraries built with shadcn need specific configuration to properly export components and styles.

### Step 7: Update Component Generator
**TODO:**
- [ ] Add logic to generate shadcn-style components
- [ ] Create component templates following shadcn patterns
- [ ] Handle component CSS/styling appropriately
- [ ] Ensure proper imports and exports

**Reasoning:** Component generator should create components that follow shadcn conventions when the project uses shadcn.

### Step 8: Add Tests
**TODO:**
- [ ] Add unit tests for shadcn setup utilities
- [ ] Add generator tests for application with shadcn
- [ ] Add generator tests for library with shadcn
- [ ] Add generator tests for component with shadcn
- [ ] Add e2e tests for generated projects

**Reasoning:** Comprehensive testing ensures the feature works correctly and prevents regressions.

### Step 9: Update Documentation
**TODO:**
- [ ] Update React plugin documentation
- [ ] Add shadcn setup guide
- [ ] Update generator documentation
- [ ] Add examples and best practices

**Reasoning:** Good documentation is essential for users to understand and use the new feature effectively.

## Technical Considerations

### Dependencies
- tailwindcss
- postcss
- autoprefixer
- tailwindcss-animate (commonly used with shadcn)
- clsx (for className utilities)
- tailwind-merge (for merging Tailwind classes)

### File Structure
shadcn typically requires:
- `components.json` - shadcn configuration
- `lib/utils.ts` - utility functions for className handling
- `components/ui/` - directory for shadcn components
- CSS variables in global styles
- Tailwind configuration with specific settings

### Alternatives Considered
1. **Minimal Integration:** Only add style option without full setup - rejected because shadcn requires specific configuration
2. **Separate Plugin:** Create dedicated @nx/shadcn plugin - might be considered for future if shadcn support grows
3. **Post-install Script:** Use a setup script after generation - rejected in favor of integrated solution

## Expected Outcome
When complete, developers will be able to:
1. Select 'shadcn' as a style option when generating React applications, libraries, or components
2. Get a fully configured project with Tailwind CSS and shadcn setup
3. Generate components that follow shadcn patterns
4. Have all necessary dependencies and configurations in place
5. Start using shadcn components immediately after generation

## Success Criteria
- [ ] All existing tests pass
- [ ] New style option appears in generator prompts
- [ ] Generated projects with shadcn can build successfully
- [ ] shadcn components can be added to generated projects
- [ ] Documentation is clear and comprehensive
- [ ] No breaking changes to existing functionality

## CRITICAL: Implementation Tracking
**When implementing or executing on this task, keep track of progress in this section:**

### Implementation Log
<!-- Track actual implementation steps, issues encountered, and solutions here -->