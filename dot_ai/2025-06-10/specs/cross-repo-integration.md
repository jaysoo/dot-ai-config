# Cross-Repository Raw Docs Integration Specification

## Overview

This specification outlines the integration system between the raw-docs repository and multiple monorepos (NX, Ocean) to provide automated documentation reminders and AI-assisted documentation updates during the development workflow.

## Objectives

1. **Seamless Integration**: Enable monorepos to leverage raw-docs without submodules
2. **Developer-Friendly**: Non-blocking reminders with opt-in AI assistance
3. **Multi-Repo Support**: Single raw-docs instance serves multiple monorepos
4. **AI-Powered Analysis**: Leverage Claude Code for intelligent documentation suggestions
5. **Preserve Existing Workflows**: Respect existing git hooks (e.g., husky)

## Architecture

### Repository Structure
```
~/projects/
├── raw-docs/                   # Central documentation repository
│   ├── features/               # All feature documentation (unified)
│   ├── scripts/
│   │   ├── install-hook.mjs     # Hook installer for monorepos
│   │   ├── analyze-changes.mjs  # AI analysis orchestrator
│   │   └── check-docs.mjs       # Pre-push check script
│   └── TEMPLATE.md
├── nx/                        # NX monorepo
│   ├── .rawdocsrc             # Config file (gitignored)
│   └── .husky/                # Existing hooks
└── ocean/                     # Ocean monorepo
    └── .rawdocsrc             # Config file (gitignored)
```

### Configuration System

Each monorepo will have a `.rawdocsrc` file (gitignored) containing:
```json
{
  "rawDocsPath": "/absolute/path/to/raw-docs",
  "repoType": "nx",
  "installedVersion": "1.0.0"
}
```

## Installation Flow

### 1. Initial Setup
```bash
# From monorepo root (e.g., nx/)
node /path/to/raw-docs/scripts/install-hook.js
```

### 2. Interactive Configuration
```
🔧 Raw Docs Hook Installer

Detecting repository type... ✓ NX repository
Checking for existing hooks... ✓ Husky detected

Where is your raw-docs repository located?
> Path: ~/projects/raw-docs

Installing pre-push hook... ✓
Configuration saved to .rawdocsrc

✅ Installation complete! 
   Raw docs checks will run before each push.
```

### 3. Hook Detection Logic
- Detects husky: Prepends to `.husky/pre-push`
- Detects simple-git-hooks: Prepends or adds to `"pre-push"` entry in root `package.json` of monorepo
- Regular git hooks: Modifies `.git/hooks/pre-push`
- No existing hooks: Creates new pre-push hook

## Pre-Push Workflow

### 1. Change Detection
When developer runs `git push`:
```
📝 Detected changes that may require documentation updates:
   - Modified: packages/nx/src/generators/library/library.ts
   - Modified: packages/nx/src/utils/module-federation.ts

Analyze changes for documentation needs? (Y/n)
```

### 2. AI Analysis Preparation
If user selects yes, the system:
1. Collects git diff: `git diff origin/main...HEAD`
2. Identifies committer: `git config user.email`
3. Lists existing feature docs in raw-docs
4. Loads TEMPLATE.md structure
5. Prepares context file

### 3. Claude Code Integration
```bash
# Execute Claude Code with prepared context
claude --output /tmp/raw-docs-analysis.md --file /tmp/raw-docs-context.md \
  "Analyze these code changes and update or create documentation as needed..."
```

Make sure that `CLAUDE.md` has the right instructions and context for the analysis to be useful.

Research and verify that `--output` and `--file` actually are supported. There should be some tests to ensure correctness.

### 4. Results Processing
```
📝 Documentation updates complete:
   ✓ Updated: features/library-generator.md
   ✓ Created: features/module-federation.md
   
Review changes in raw-docs repository before committing.
Push proceeding...
```

## Error Handling

### Graceful Degradation
If any step fails (Claude Code not found, raw-docs unavailable, etc.):
```
⚠️  Raw-docs check failed: Claude Code not found
   
To run documentation analysis manually later:
   node ~/projects/raw-docs/scripts/analyze-changes.js --repo nx

Continuing with push...
```

### No Configuration
If `.rawdocsrc` doesn't exist:
```
Raw docs not configured. Configure now? (y/N)
> y
Enter path to raw-docs repo: ~/projects/raw-docs
[continues with setup...]
```

## AI Context Structure

The prepared context for Claude Code includes:

```markdown
# Documentation Analysis Request

## Repository Information
- Repository: nx
- Committer: jack.hsu@gmail.com

## Code Changes
\`\`\`diff
[git diff content]
\`\`\`

## Existing Documentation
- features/library-generator.md (last updated: 2024-01-10)
- features/workspace-generators.md (last updated: 2024-01-05)
[... all feature docs listed]

## Documentation Template
[Contents of TEMPLATE.md]

## Task
1. Analyze the code changes to identify feature impacts
2. For existing features: Update the relevant documentation files
3. For new features: Create new documentation using TEMPLATE.md
4. Focus on documenting the "why" and user-facing impacts
5. Update the developers field with the committer information
```

## Implementation Phases

### Phase 1: Core Integration (MVP)
1. ✅ Install script with husky awareness
2. ✅ Pre-push hook with change detection
3. ✅ Basic Claude Code integration
4. ✅ Error handling and graceful degradation

### Phase 2: Enhanced Analysis
1. CODEOWNERS integration for developer mapping
2. Smart feature matching based on file patterns
3. Batch analysis for multiple features
4. Integration with existing check-developers.js script

### Phase 3: Advanced Features
1. MCP server option for centralized analysis
2. CI/CD integration for automated checks
3. Metrics and reporting
4. Multi-AI tool support (Cursor, GitHub Copilot)

## Testing Strategy

### Manual Testing
1. Fresh installation in monorepo
2. Installation with existing husky setup
3. Push with no changes
4. Push with documentation-relevant changes
5. Error scenarios (missing Claude Code, etc.)

### Automated Tests
1. Hook installation logic
2. Configuration management
3. Change detection patterns
4. Context preparation

## Security Considerations

1. **No Credentials**: System doesn't store API keys or credentials
2. **Local Execution**: All analysis happens on developer machines
3. **Gitignored Config**: Paths are local to each developer
4. **No Automatic Commits**: Changes require manual review

## Success Metrics

1. **Adoption**: Percentage of developers using the system
2. **Documentation Coverage**: Features with up-to-date docs
3. **Time to Document**: Reduced time from feature → documentation
4. **Developer Satisfaction**: Non-intrusive, helpful reminders

## Future Enhancements

1. **Multiple AI Tools**: Support for Cursor, GitHub Copilot
2. **Smart Triggers**: Only prompt for significant changes
3. **Documentation Quality Checks**: Validate completeness
4. **Team Dashboards**: Documentation coverage metrics
5. **IDE Integration**: VS Code extension for inline updates

## Dependencies

- Node.js 20+ (for scripts)
- Git 2.0+ (for hooks)
- Claude Code CLI (for AI analysis)
- Existing raw-docs repository setup

## Migration Path

For teams already using raw-docs:
1. No changes needed to existing documentation
2. Install hooks in each monorepo
3. Developers opt-in to AI assistance
4. Gradual adoption without disruption