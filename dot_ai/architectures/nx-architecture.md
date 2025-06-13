# Nx Repository Architecture

## Overview

The Nx repository is a monorepo containing the core Nx build system, CLI tools, plugins for various frameworks, documentation website, and supporting infrastructure. It uses PNPM workspaces for package management and is primarily written in TypeScript with Rust components for performance-critical operations.

## Core Components

### 1. Nx Core (`packages/nx`)
- **Purpose**: Core functionality including project graph, task orchestration, and CLI commands
- **Technologies**: TypeScript, Rust (for native performance-critical components)
- **Key Features**:
  - Project graph construction and analysis
  - Task scheduling and execution
  - Caching mechanisms
  - Daemon for improved performance
  - Native packages for different platforms (darwin, linux, windows)

### 2. Framework Plugins (`packages/*`)
The repository contains official plugins for major frameworks:

#### Frontend Frameworks
- **@nx/angular**: Angular support with generators, executors, and module federation
- **@nx/react**: React applications and libraries with various bundler support
- **@nx/vue**: Vue.js applications with Vite integration
- **@nx/next**: Next.js applications with custom server support

#### Backend Frameworks
- **@nx/node**: Node.js applications and libraries
- **@nx/nest**: NestJS API applications
- **@nx/express**: Express server applications

#### Build Tools & Bundlers
- **@nx/webpack**: Webpack configuration and build support
- **@nx/vite**: Vite build tool integration
- **@nx/rspack**: Rspack bundler support
- **@nx/rsbuild**: Rsbuild integration
- **@nx/rollup**: Rollup bundler support
- **@nx/esbuild**: ESBuild integration

#### Testing & Quality
- **@nx/jest**: Jest testing framework integration
- **@nx/cypress**: Cypress E2E and component testing
- **@nx/playwright**: Playwright testing support
- **@nx/detox**: React Native testing with Detox
- **@nx/eslint**: ESLint linting with custom rules
- **@nx/storybook**: Storybook integration

#### Mobile & Native
- **@nx/react-native**: React Native application support
- **@nx/expo**: Expo framework integration

### 3. Development Tools
- **@nx/devkit**: SDK for building Nx plugins
- **@nx/plugin**: Generator for creating custom Nx plugins
- **@nx/workspace**: Core workspace utilities and generators

### 4. Documentation & Website (`nx-dev/`)
- **Technology**: Next.js application
- **Components**:
  - Documentation viewer with markdown support
  - AI-powered features and chat
  - Package schema viewer
  - Tutorial system
  - Blog and community content

### 5. Graph Visualization (`graph/`)
- **Technology**: React with Tailwind CSS
- **Purpose**: Interactive project graph visualization
- **Features**:
  - Project dependency visualization
  - Task graph display
  - Migration UI

### 6. Testing Infrastructure (`e2e/`)
Comprehensive E2E test suites for each plugin and major feature:
- Individual test projects for each plugin
- Test utilities and helpers
- Integration tests for cross-plugin functionality

## Architecture Patterns

### Plugin Architecture
Each plugin follows a consistent structure:
- `generators/`: Code generators for scaffolding
- `executors/`: Task executors for build, test, serve operations
- `migrations/`: Automated code migrations
- `src/utils/`: Shared utilities
- Schema definitions for configuration

### Monorepo Management
- Uses Nx's own tools for development (dogfooding)
- PNPM workspace for package management
- Shared configurations and dependencies
- Consistent versioning across packages

### Performance Optimizations
- Rust-based components for CPU-intensive operations
- Native binaries for different platforms
- Daemon process for persistent caching
- Incremental builds and affected commands

## Recent Development Focus (Last 3 Months)

Based on commit history from jack.hsu@gmail.com:

### Documentation Improvements
- Updated installation documentation to prefer global installs
- Fixed broken URLs and redirects across documentation (550+ URLs validated)
- Added missing API documentation for angular-rspack and angular-rsbuild
- Improved blog content and navigation
- Simplified getting started experience (60% complexity reduction)
- Created comprehensive URL redirect mapping for documentation migration

### Feature Development
- Node.js Docker multi-stage builds for better layer caching
- Terminal UI (TUI) options in nx.json
- Continuous task support
- Improved Windows process handling
- Migration UI enhancements
- Port configuration support for React application generator across all bundlers
- E2E test runner port configuration fixes

### Bug Fixes & Maintenance
- Fixed npm scope matching issues
- Improved fork task runner signal propagation
- React babel configuration updates
- Playwright and testing output improvements
- Fixed critical Debian package publishing pipeline
- Hardened PPA build environment with Node.js version checking

### Active Development (In Progress)
- **Heap Usage Logging**: Adding memory tracking to display peak RSS for each task (NX_LOG_HEAP_USAGE)
- **AI-MCP Integration**: Exploring Model Context Protocol integration for enhanced AI tool support
- **Incident Response Documentation**: Auditing and improving incident response processes

## Key Technologies

- **Languages**: TypeScript, JavaScript, Rust
- **Package Manager**: PNPM
- **Build Tools**: Nx (self-hosted), Webpack, Vite, Rollup, ESBuild
- **Testing**: Jest, Cypress, Playwright
- **Documentation**: Next.js, Markdown, Tailwind CSS
- **Native Development**: Rust with NAPI bindings

## Module Federation Support
Special emphasis on module federation across multiple bundlers:
- Webpack module federation
- Rspack module federation
- Dynamic remotes and host configuration
- SSR support

## Cloud Integration
- Nx Cloud integration for distributed caching
- Remote cache configuration
- CI/CD optimizations

## Community & Ecosystem
- Plugin system for extensibility
- Community plugins support
- Extensive documentation and examples
- Active development with frequent releases

## Internal Development Practices

### Repository Organization
- **.ai/**: AI-assisted development artifacts and task tracking
  - Date-organized folders (yyyy-mm-dd) containing tasks, specs, and dictations
  - TODO.md for active and completed task tracking
  - Architecture documentation in .ai/architectures/

### Development Workflow
- Comprehensive E2E testing before releases
- Automated migration support for breaking changes
- Self-hosting (Nx builds itself)
- Pre-push validation with `nx prepush` command
- Cross-repository integration for documentation

### Key Scripts and Commands
- `nx prepush`: Full validation suite before commits
- `nx affected`: Run commands only on affected projects
- `nx graph`: Visualize project dependencies
- Local registry support for E2E testing

### External Integrations
- **Gradle**: Java/Kotlin project support with custom plugins
- **Rust Toolchain**: Native performance optimizations
- **@monodon/rust**: Rust compilation within Nx workspace
- **Nx Cloud**: Distributed caching and CI optimization

---

*Generated on: 2025-06-13*
*Based on analysis of repository structure and recent commits*