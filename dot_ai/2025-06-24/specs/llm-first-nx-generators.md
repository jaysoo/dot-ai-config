# LLM-First Nx Generators Specification

**Date**: 2025-06-24  
**Type**: Feature Specification  
**Status**: Ready for Implementation

## Executive Summary

Create an LLM-first approach to Nx generators where markdown templates define the structure and requirements for generating predictable library/application structures. This system combines rigid structural requirements with natural language flexibility for additional features.

## Core Concept

Instead of hardcoding every variation into traditional generators, we provide structured markdown instructions that AI coding assistants (starting with Claude Code) can execute to generate consistent, team-approved code structures while allowing flexibility for modern best practices.

## Architecture

### 1. Template Structure

Templates use markdown with specific sections for critical vs flexible instructions:

```markdown
# CRITICAL - React Library Generator

Framework: React
Version: ^18.2.0
Structure:
```
libs/[name]/
├── src/
│   ├── index.ts         # Main export file
│   ├── lib/
│   │   └── [name].tsx   # Main component
│   └── lib/
│       └── [name].spec.tsx
├── README.md
├── project.json
└── tsconfig.json
```

Required Output: Component must render "Hello [name]"

## Additional Features

Use Tailwind CSS for styling...
Add Storybook stories for the component...
```

### 2. Template Locations

- **Built-in**: Ship with Nx plugins (e.g., `@nx/react`)
- **Custom**: Team-specific templates in `.nx/generators/`

### 3. Composition System

Templates can compose other generators:

```markdown
requires: @nx/js, @nx/eslint
calls:
  - @nx/js:tsconfig --project=$PROJECT_NAME
  - @nx/eslint:config --project=$PROJECT_NAME
```

### 4. Invocation

```bash
nx g @nx/react:app myapp --ai=claude
```

This generates the markdown and executes it via Claude Code headless.

## Key Design Decisions

### 1. Structure Requirements

- **CRITICAL sections**: Must be followed exactly
  - Framework and version
  - File structure (max 20 lines)
  - Required output behavior
- **Flexible sections**: Natural language for features
  - UI libraries (shadcn, MUI, etc.)
  - Additional tooling
  - Best practices

### 2. Version Handling

- Exact versions specified (e.g., "react": "^18.2.0")
- AI interprets semantic versioning
- Version guards for breaking changes:
  ```markdown
  if React >= 19:
    use server components pattern
  else:
    use client components
  ```

### 3. Validation

Post-generation verification runs automatically:
- `nx test <project>` must pass if tests exist
- `nx lint <project>` must pass if linting configured
- Results documented in generated README.md

### 4. Error Handling

Failed validations are documented in the project's README:
```markdown
## Generation Report

### Failed Verifications:
- `nx test mylib` - 2 tests failed
  - Suggested fix: Update test expectations for React 18 behavior
  
### Next Steps:
1. Run `nx test mylib` to see detailed errors
2. Use AI to fix: "Fix the failing tests in mylib"
3. Or manually update the test files
```

### 5. Workspace Integration

- Automatic project detection via Nx inference
- Full workspace context available to LLM via MCP
- Can reference existing libraries and patterns

### 6. Template Inheritance

Custom templates can extend built-in ones:

```markdown
extends: @nx/react:app
adds:
  - Company logging setup
  - Custom error boundaries
```

## Implementation Phases

### Phase 1: MVP
- Claude Code headless integration
- Basic Typescript (tsconfig.json files) and React app (plain vitem, no meta framework) generators
- Simple variable substitution
- Post-generation validation

### Phase 2: Enhanced Features
- Template inheritance
  - Can extend @nx/react and @nx/js AI generator templates in `.nx/generators`

### Phase 3: Ecosystem
- Full variable system with $ARGUMENTS
- Advanced composition patterns
- Multiple AI provider support
- Community template sharing
- Template testing framework
- Migration tools for existing generators

## Technical Requirements

### Generator Integration
- Hook into existing `nx generate` command
- Preserve all current Nx generator features
- Support `--dry-run` flag
- Maintain backward compatibility

### AI Execution
- Start with Claude Code headless
- Generate all files at once (no incremental)
- Full workspace access via Nx MCP tools
- Git-based rollback safety

### Discovery
- `nx list @nx/react` shows AI-ready templates
- `nx g @nx/react --help` indicates AI support
- Clear documentation of available templates

## Success Metrics

1. **Predictability**: 95%+ adherence to CRITICAL structure
2. **Flexibility**: Support for framework updates without template changes
3. **Developer Experience**: Faster than manual setup, consistent results
4. **Maintainability**: Reduced template maintenance vs traditional generators

## Security Considerations

- No secrets/keys in templates
- Templates are code-reviewed like any code
- AI runs in sandboxed environment
- Output validated before file creation

## Future Considerations

- Multi-language support beyond TypeScript/JavaScript
- Integration with Nx Cloud for template sharing
- AI-powered migration between framework versions
- Template performance optimization

## Conclusion

This LLM-first approach to Nx generators provides the perfect balance between the predictability teams need and the flexibility modern development demands. By leveraging AI's ability to understand context and follow instructions, we can dramatically reduce the maintenance burden of generators while improving the developer experience.
