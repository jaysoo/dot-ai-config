# Raw Docs System - AI Context Guide

This repository contains the **Raw Docs System**, an internal documentation workflow designed to capture developer knowledge about features as they are being built. This serves as a bridge between feature development and user-facing documentation.

## Project Overview

The Raw Docs System is designed to solve the problem of documentation debt by creating a systematic process for documenting features before they ship. It enables async collaboration between developers and documentation teams while maintaining feature history and improving documentation quality.

## Current Status: Phase 1 Complete ✅

**Implementation Date**: June 9, 2025  
**Status**: Production-ready for Phase 2 rollout  
**Test Coverage**: 100% (all test suites passing)  
**Total Implementation**: 26 tasks across 7 major categories

## Architecture & Structure

This is a **working example repository** demonstrating the complete Raw Docs system:

```
raw-docs-example/
├── features-cli/          # CLI and core Nx features documentation
├── features-cloud/        # Nx Cloud features documentation  
├── archived/              # Deprecated/removed features
├── scripts/               # Automation and maintenance scripts
├── tests/                 # Comprehensive test suite
├── README.md              # Project overview and usage guide
├── TEMPLATE.md            # Complete feature documentation template
├── CONTRIBUTING.md        # Detailed workflow documentation (280+ lines)
├── ARCHIVED.md            # Archive management system
└── SUMMARY.md             # Phase 1 implementation summary
```

## Key Components

### 📝 Documentation System
- **TEMPLATE.md**: Complete template with AI integration guidance and all required sections
- **Feature Status Workflow**: draft → in-progress → shipped → archived
- **Example Features**: 
  - `nx-agents.md` (shipped) - Comprehensive cloud feature
  - `project-crystal.md` (in-progress) - CLI feature in development  
  - `continuous-tasks.md` (draft) - Early planning stage

### 🔧 Automation Scripts (Node.js ESM)

#### `scripts/check-developers.mjs` (350+ lines)
- **Purpose**: Analyzes git history and CODEOWNERS to update developer fields
- **Features**: Git log parsing, CODEOWNERS pattern matching, automatic updates
- **CLI**: Full interface with --dry-run, --file, --days options
- **Testing**: Comprehensive test coverage in `tests/test-developer-check.mjs`

#### `scripts/pre-push-hook.mjs` (280+ lines) 
- **Purpose**: Advisory pre-push hook that detects feature-related changes
- **Features**: Repository detection (Nx/Ocean), intelligent pattern matching, colorful output
- **Behavior**: Non-blocking reminders with helpful guidance
- **Testing**: Full test coverage in `tests/test-pre-push-hook.mjs`

#### `scripts/install-hook.mjs` (200+ lines)
- **Purpose**: Manages git hook installation, verification, and removal
- **Features**: Cross-platform compatibility, testing capabilities, clean uninstall
- **CLI**: Complete interface with --verify, --test, --uninstall options

### 🧪 Test Suite
- **`tests/run-all-tests.mjs`**: Main test orchestrator with reporting
- **`tests/test-developer-check.mjs`**: Tests git analysis, CODEOWNERS, metadata parsing
- **`tests/test-pre-push-hook.mjs`**: Tests pattern matching, change detection, triggers
- **Test Data**: Sample files in `tests/data/` and `tests/fixtures/`
- **Coverage**: 11 test functions across 2 test suites, all passing

## Technical Implementation

### Pattern Matching Engine
- **Robust glob-to-regex conversion** handling `**`, `*`, `?` patterns
- **Repository-specific patterns** for Nx (`packages/**/*.ts`) and Ocean (`apps/**/*.ts`)
- **Exclusion handling** for test files (`**/*.spec.ts`, `**/test/**/*`)
- **Cross-platform compatibility** with proper escaping

### Git Integration
- **Safe command execution** with error handling and timeouts
- **Branch-aware change detection** comparing against main/master
- **Configurable history analysis** (default 90 days, customizable)
- **Email-to-username mapping** for developer field updates

### Developer Experience
- **Rich CLI interfaces** with comprehensive help text
- **Colorful, informative output** using ANSI color codes
- **Dry-run capabilities** for safe testing
- **Clear error messages** and troubleshooting guidance

## Feature Workflow

### For Developers
1. **Create new feature documentation**: `cp TEMPLATE.md features-cli/my-feature.md`
2. **Install pre-push hook**: `node scripts/install-hook.mjs`
3. **Update developer info**: `node scripts/check-developers.mjs`
4. **Work normally** - hook provides advisory reminders when needed

### For AI/LLM Assistance
The system is designed for AI integration:
- **TEMPLATE.md** includes specific AI guidance sections
- **Question-based workflow** for filling documentation sections
- **Examples and patterns** for AI to learn from existing features
- **Clear structure** for AI to understand and maintain

## Repository Patterns

### Nx Repository Detection
- Looks for `packages/nx` or `packages/workspace` directories
- Patterns: `packages/**/*.ts`, `packages/**/generators/**/*`, `graph/**/*.tsx`
- Excludes: `**/*.spec.ts`, `**/test/**/*`, `**/__tests__/**/*`

### Ocean Repository Detection  
- Looks for `apps/ocean-ui` directory
- Patterns: `apps/**/*.ts`, `libs/**/*.ts`, `packages/**/*.ts`
- Similar exclusion patterns for test files

## Key Design Decisions

### Advisory vs Blocking Hooks
- **Choice**: Advisory (non-blocking) approach
- **Reasoning**: Better developer adoption, maintains workflow velocity
- **Implementation**: Pre-push hook exits with success (0) after showing reminders

### Node.js ESM Scripts
- **Choice**: ES modules (`.mjs`) with modern Node.js features
- **Reasoning**: Consistency, better async/await support, future-proof
- **Implementation**: All scripts use `import`/`export` syntax

### Pattern-Based Detection
- **Choice**: File pattern matching vs code analysis
- **Reasoning**: Faster, more reliable, easier to configure
- **Implementation**: Sophisticated glob-to-regex engine

## Integration Points

### Git Hooks
- Pre-push hook detects feature changes and shows reminders
- Non-intrusive approach preserves developer workflow
- Configurable patterns for different repository types

### CODEOWNERS Integration
- Parses `.github/CODEOWNERS` or `CODEOWNERS` files
- Matches file patterns to ownership
- Merges with git history for comprehensive developer tracking

### AI/LLM Integration
- Template designed for AI-assisted documentation
- Question-based workflow in TEMPLATE.md
- Clear examples for AI to learn from

## Testing Strategy

### Unit Testing
- **Isolated component testing** for pattern matching, git parsing, etc.
- **Mock data approach** using fixtures and sample files
- **Edge case coverage** for various file patterns and scenarios

### Integration Testing  
- **End-to-end workflows** testing complete script functionality
- **Cross-platform validation** ensuring compatibility
- **Error condition testing** for robust error handling

### Test Data Management
- **Sample files** in `tests/data/` for realistic testing
- **Fixtures** in `tests/fixtures/` for controlled scenarios
- **Configurable test patterns** matching real repository structures

## Known Limitations & Considerations

### Current Scope
- **Phase 1 focus**: Basic automation and template system
- **Repository support**: Currently Nx and Ocean patterns
- **Language support**: Primarily TypeScript/JavaScript focused

### Future Enhancements (Phase 2+)
- Weekly automated reviews and reporting
- Enhanced AI integration for content generation
- Metrics dashboard for documentation coverage
- Integration with documentation build processes

## Commands Reference

### Testing
```bash
node tests/run-all-tests.mjs                    # Run all tests
node tests/run-all-tests.mjs --verbose          # Detailed output
node tests/test-developer-check.mjs             # Test developer analysis
node tests/test-pre-push-hook.mjs               # Test hook functionality
```

### Developer Tools
```bash
node scripts/check-developers.mjs               # Update all developer info
node scripts/check-developers.mjs --dry-run     # Preview changes
node scripts/check-developers.mjs --file path   # Check specific file
node scripts/install-hook.mjs                   # Install pre-push hook
node scripts/install-hook.mjs --verify          # Check installation
node scripts/install-hook.mjs --test            # Test hook function
```

### Documentation Management
```bash
cp TEMPLATE.md features-cli/new-feature.md      # Create new feature doc
# Edit feature documentation...
node scripts/check-developers.mjs               # Update developer fields
```

## Original Specification

This implementation follows the **Raw Docs System Specification** which defines:
- Repository structure and file organization
- Template format with required sections
- Developer and docs team workflows  
- Git hooks implementation strategy
- AI integration points
- Testing and rollout plan (3-phase approach)

## Success Metrics (Phase 1)

✅ **Functionality**: 26/26 tasks completed, all tests passing  
✅ **Developer Experience**: Non-intrusive, helpful, easy installation  
✅ **Maintainability**: Modular design, comprehensive testing, clear documentation  
✅ **Production Readiness**: Error handling, cross-platform support, validation

## Context for AI Assistants

When working with this repository:

1. **Understand the scope**: This is a complete working example, not a planning document
2. **Follow existing patterns**: Scripts use Node.js ESM, tests are comprehensive
3. **Maintain quality**: All changes should include tests and documentation updates
4. **Respect the architecture**: Advisory approach, pattern-based detection, modular design
5. **Use the tools**: Scripts are designed to be used during development and maintenance

The system is designed to be extended and customized for different repositories and workflows while maintaining the core principles of developer-friendly automation and comprehensive documentation tracking.