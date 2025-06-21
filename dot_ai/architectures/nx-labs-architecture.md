# nx-labs Architecture

## Directory Overview

```
packages/
├── php/                    # PHP support for Nx
│   ├── src/
│   │   ├── composer/      # Composer plugin for dependency management
│   │   ├── phpunit/       # PHPUnit plugin for testing
│   │   ├── laravel/       # Laravel plugin for Laravel projects
│   │   └── generators/    # Generators for init and library
│   └── README.md
└── [other experimental packages]
```

## Features & Critical Paths

### PHP Support (NEW: 2025-06-20)
**Last Updated**: 2025-06-20
**Related Tasks**: Create Laravel plugin

PHP support in Nx enables monorepo management for PHP projects with automatic target detection.

**Quick Start**: `nx add @nx/php`

**Files**:
- `packages/php/src/index.ts` - Main exports
- `packages/php/src/generators/init/` - Initializes PHP support, adds all plugins
- `packages/php/src/generators/library/` - Creates PHP library projects

#### Composer Plugin
**Files**:
- `packages/php/src/composer/plugin/create-nodes.ts` - Detects composer.json, creates install/update targets
- `packages/php/src/composer/plugin/create-nodes.spec.ts` - Tests

#### PHPUnit Plugin  
**Files**:
- `packages/php/src/phpunit/plugin/create-nodes.ts` - Detects phpunit.xml, creates test targets
- `packages/php/src/phpunit/plugin/create-nodes.spec.ts` - Tests

#### Laravel Plugin (NEW: 2025-06-20)
**Files**:
- `packages/php/src/laravel/index.ts` - Exports createNodesV2
- `packages/php/src/laravel/plugin/create-nodes.ts` - Detects Laravel projects, creates artisan targets
- `packages/php/src/laravel/plugin/create-nodes.spec.ts` - Tests
- `packages/php/src/generators/init/lib/add-laravel-plugin.ts` - Adds Laravel plugin during init

**Detection**: Looks for `artisan` file + Laravel directories (bootstrap/app.php, config/app.php, routes/web.php)

**Targets Created**:
- `serve` - Development server
- `migrate` - Database migrations
- `migrate-fresh` - Fresh migration with seeding
- `tinker` - Laravel REPL
- `queue-work` - Queue workers
- `cache-clear` - Clear all caches
- `route-list` - List routes

**Dependencies**: None (follows existing patterns)

## Personal Work History

### 2025-06-20
- Created Laravel plugin for PHP package
  - Implemented automatic Laravel project detection
  - Added common artisan command targets
  - Fixed TypeScript build errors with addPlugin utility
  - Fixed test mocking issues (node:fs imports)
  - Removed unnecessary memfs dependency
- Conceptualized visual affordances for AI tools
  - Proposed integration with Nx Cloud MCP and Playwright
  - Goal: Provide visual feedback for AI-executed tasks

## Design Decisions & Gotchas

### PHP Plugin Architecture
- All PHP plugins use createNodesV2 API pattern
- Plugins are added via `addPlugin` utility from @nx/devkit
- Target names must be arrays to support multiple possibilities
- Test mocks must match exact import paths (node:fs vs fs)

### Laravel Detection
- Requires artisan file AND Laravel-specific directories
- Checks composer.json for laravel/framework if present
- Falls back gracefully if composer.json is unreadable

## Technology Stack

### Core Dependencies
- `@nx/devkit` - Nx plugin development utilities
- `minimatch` - Pattern matching for file detection
- `tslib` - TypeScript runtime helpers

### Development
- Jest for testing with mocked file system
- TypeScript with strict checking
- Nx build system integration

## Future Concepts

### Visual Affordances for AI Tools
**Proposed**: 2025-06-20

Integration of visual feedback when AI tools perform development tasks:
- Playwright for automated screenshot capture
- Nx Cloud MCP for storing visual artifacts
- Terminal output and test result visualization
- Quick visual verification without code inspection