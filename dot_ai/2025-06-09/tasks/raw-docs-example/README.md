# Raw Docs Repository

This repository contains raw feature documentation for Nx and Nx Cloud features. It serves as the single source of truth for feature information before it gets processed into user-facing documentation.

## Purpose

The Raw Docs system tracks features from conception to completion, capturing essential information that helps:
- Documentation teams understand what features exist and their status
- Developers maintain accurate feature records
- Product teams track feature progress and relationships

## Repository Structure

```
├── features-cli/          # CLI and core Nx features
├── features-cloud/        # Nx Cloud features  
├── archived/             # Deprecated or removed features
├── scripts/              # Automation and maintenance scripts
├── tests/                # Test data and validation scripts
├── TEMPLATE.md           # Template for new feature documentation
├── ARCHIVED.md           # Index of archived features
└── CONTRIBUTING.md       # Guidelines for contributors
```

## Quick Start

1. **Document a new feature**: Copy `TEMPLATE.md` to the appropriate directory
2. **Update developer info**: Run `node scripts/check-developers.mjs`
3. **Install pre-push hook**: Run `node scripts/install-hook.mjs`

## Features Table

| Feature | Status | Developers | Last Updated |
|---------|--------|------------|--------------|
| [Nx Agents](features-cloud/nx-agents.md) | shipped | @AgentMarine, @FrozenPandaz, @jaysoo | 2025-06-09 |
| [Project Crystal](features-cli/project-crystal.md) | in-progress | @vsavkin, @FrozenPandaz, @AgentMarine | 2025-06-09 |
| [Continuous Tasks](features-cli/continuous-tasks.md) | draft | @jaysoo, @FrozenPandaz | 2025-06-09 |

## Usage

### For Developers

**Adding a new feature:**
```bash
# 1. Copy the template
cp TEMPLATE.md features-cli/my-new-feature.md

# 2. Fill in the details
# Edit the file with feature information

# 3. Update developer info automatically
node scripts/check-developers.mjs
```

**Installing the pre-push hook:**
```bash
# Install hook to get reminders
node scripts/install-hook.mjs

# Verify installation
node scripts/install-hook.mjs --verify

# Test hook functionality
node scripts/install-hook.mjs --test
```

**Updating existing documentation:**
```bash
# Check all feature docs for outdated developer info
node scripts/check-developers.mjs

# Check specific file
node scripts/check-developers.mjs --file features-cli/project-crystal.md

# Dry run to see what would change
node scripts/check-developers.mjs --dry-run
```

### Automation

This repository is designed to work with automated scripts that:
- Detect when features are added/modified in the main codebase
- Remind developers to update raw documentation via pre-push hooks
- Keep developer information current based on git history and CODEOWNERS
- Generate features table and maintain documentation consistency

See `CONTRIBUTING.md` for detailed workflow information.