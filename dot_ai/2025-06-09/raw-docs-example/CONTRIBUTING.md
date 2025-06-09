# Contributing to Raw Docs

This guide explains how to contribute to the Raw Docs repository and maintain accurate feature documentation.

## Overview

The Raw Docs system helps track features from conception to completion, providing essential information for documentation teams. This repository serves as the authoritative source for feature status, ownership, and implementation details.

## Quick Workflow

1. **New Feature**: Copy `TEMPLATE.md` to appropriate directory (`features-cli/` or `features-cloud/`)
2. **Fill Template**: Complete all sections with accurate information
3. **Set Status**: Choose appropriate status (draft, in-progress, shipped, archived)
4. **Update Regularly**: Keep documentation current as feature develops
5. **Update Developers**: Run the developer check script periodically

## Detailed Workflow

### Starting a New Feature

1. **Choose the right directory:**
   - `features-cli/` - Core Nx features, CLI commands, generators, executors
   - `features-cloud/` - Nx Cloud features, agents, caching, analytics

2. **Copy and rename the template:**
   ```bash
   cp TEMPLATE.md features-cli/my-feature-name.md
   ```

3. **Fill in metadata:**
   - Set status to `draft` initially
   - Add your GitHub username to developers
   - Set created date to today
   - Choose appropriate category (CLI, Cloud, Core)

4. **Complete the sections:**
   - **Overview**: 1-3 sentences explaining what the feature does
   - **Problem Statement**: What user pain points does this solve?
   - **Solution**: High-level approach to solving the problem
   - **Implementation Details**: Technical details as they become available
   - **Configuration**: Any settings or options (can be TBD initially)
   - **Examples**: Usage examples (can be planned examples initially)
   - **Related Features**: Link to dependencies or related features
   - **Resources**: Link to issues, PRs, docs as they become available

### Updating Existing Features

1. **Status Progression:**
   - `draft` → `in-progress` when development starts
   - `in-progress` → `shipped` when feature is released
   - Any status → `archived` when feature is deprecated/removed

2. **Regular Updates:**
   - Add implementation details as they're developed
   - Include configuration options and examples
   - Link to PRs and issues as they're created
   - Update the "Last Updated" date

3. **Developer Information:**
   ```bash
   # Update developer info based on git history and CODEOWNERS
   node scripts/check-developers.mjs
   
   # Check specific file
   node scripts/check-developers.mjs --file features-cli/my-feature.md
   
   # See what would change without making changes
   node scripts/check-developers.mjs --dry-run
   ```

### Archive Workflow

When a feature is deprecated or removed:

1. **Update the feature file:**
   - Change status to `archived`
   - Add deprecation details in Implementation Details
   - Note replacement features if applicable

2. **Move to archive:**
   ```bash
   mv features-cli/old-feature.md archived/old-feature.md
   ```

3. **Update ARCHIVED.md:**
   - Add entry with archive date and reason
   - Link to replacement features
   - Include link to archived documentation

## File Naming Conventions

Use kebab-case for file names:
- ✅ `nx-agents.md`
- ✅ `project-crystal.md`
- ✅ `continuous-tasks.md`
- ❌ `NxAgents.md`
- ❌ `project_crystal.md`
- ❌ `ProjectCrystal.md`

File names should be:
- Descriptive of the feature
- Consistent with how the feature is commonly referenced
- Not too long (prefer abbreviations for well-known terms)

## Status Guidelines

### Draft
- Feature is in early planning/design phase
- Problem statement is clear but solution may be evolving
- Implementation details are minimal or TBD
- No code has been written yet

### In-Progress
- Feature is actively being developed
- Solution approach is settled
- Implementation details are being added as development progresses
- Code exists but feature is not yet complete

### Shipped
- Feature is complete and available to users
- All documentation sections should be complete
- Examples should be real, working examples
- Configuration options should be fully documented

### Archived
- Feature has been deprecated, removed, or superseded
- Documentation is moved to `archived/` directory
- ARCHIVED.md is updated with entry
- Original documentation is preserved for historical reference

## Developer Information

The `Developers` field should list GitHub usernames of people actively working on or maintaining the feature.

### Automatic Updates

Use the developer check script to keep this information current:

```bash
# Check all feature files
node scripts/check-developers.mjs

# Check specific file
node scripts/check-developers.mjs --file features-cli/project-crystal.md

# Preview changes without applying them
node scripts/check-developers.mjs --dry-run

# Look back further in git history
node scripts/check-developers.mjs --days 180
```

The script analyzes:
- Git commit history for the past 90 days (configurable)
- CODEOWNERS file patterns
- Current developer list in the file

### Manual Updates

You can also manually update the developers field:
- Add new contributors as they join the feature development
- Remove developers who are no longer actively involved
- Maintain 2-4 active developers for most features

## Automation and Hooks

### Pre-Push Hook

Install the pre-push hook to get friendly reminders about updating documentation:

```bash
# Install the hook
node scripts/install-hook.mjs

# Verify it's working
node scripts/install-hook.mjs --verify

# Test the hook functionality
node scripts/install-hook.mjs --test

# Remove the hook
node scripts/install-hook.mjs --uninstall
```

The hook will:
- Detect when you're pushing feature-related changes
- Provide friendly reminders about updating raw docs
- Give you links and instructions for quick updates
- Never block your push (advisory only)

### Skip the Hook

If you need to skip the hook temporarily:
```bash
git push --no-verify
```

## Quality Guidelines

### Documentation Quality

- **Be Accurate**: All information should be correct and up-to-date
- **Be Concise**: Clear and direct without unnecessary verbosity
- **Be Complete**: All relevant sections should be filled in
- **Be Consistent**: Follow the template structure and style

### Technical Details

- **Include Context**: Explain why decisions were made, not just what was implemented
- **Link Resources**: Always link to relevant issues, PRs, and documentation
- **Provide Examples**: Real, working examples are better than theoretical ones
- **Note Limitations**: Document known limitations, constraints, or edge cases

### Status Accuracy

- **Update Promptly**: Change status when feature development stage changes
- **Be Realistic**: Status should reflect actual development state, not aspirational state
- **Communicate Changes**: Major status changes should be communicated to docs team

## Best Practices

### Writing Style

- Use present tense for current capabilities
- Use future tense for planned features (in draft/in-progress)
- Write for technical readers (developers and docs team)
- Include code examples with proper syntax highlighting

### Maintenance

- Review and update documentation monthly for active features
- Run developer check script before major releases
- Update last modified date when making significant changes
- Keep related features links current

### Team Coordination

- Notify docs team when shipping new features
- Coordinate with related feature owners for cross-references
- Update features table in README.md when adding new features
- Use consistent terminology across related features

## Troubleshooting

### Common Issues

**Developer check script not finding contributors:**
- Verify git history exists for the file paths
- Check that CODEOWNERS file exists and has correct patterns
- Ensure email-to-username mapping is accurate

**Pre-push hook not triggering:**
- Verify hook is installed: `node scripts/install-hook.mjs --verify`
- Check that you're making feature-related changes
- Ensure Node.js is available in your PATH

**Template sections unclear:**
- Review existing feature documentation for examples
- Use AI integration guide for assistance
- Ask docs team for clarification

### Getting Help

- Review existing feature documentation for examples
- Check the AI integration guide in TEMPLATE.md
- Run scripts with `--help` flag for usage information
- Contact the docs team for guidance on complex features

## Tools and Scripts

### Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `check-developers.mjs` | Update developer information | `node scripts/check-developers.mjs` |
| `install-hook.mjs` | Install/manage pre-push hook | `node scripts/install-hook.mjs` |
| `pre-push-hook.mjs` | Pre-push reminder hook | Runs automatically on push |

### Script Options

All scripts support `--help` for detailed usage information. Common options:
- `--dry-run` - Preview changes without applying them
- `--force` - Force operation even if checks fail
- `--verify` - Check current state without making changes