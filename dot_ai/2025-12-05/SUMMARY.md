# Summary - December 5, 2025

## Hackday: Dual CJS/ESM Compilation for Nx Packages

Investigated and implemented a proof of concept for dual CJS/ESM compilation across Nx plugin packages.

### Accomplishments

**Infrastructure Created:**
- `scripts/setup-esm-builds.js` - Generates ESM config for all packages
- `scripts/fix-esm-imports.js` - Post-processing script to add `.js` extensions to ESM imports
- Updated `nx.json` with ESM plugin registration for `@nx/js/typescript`
- Updated `targetDefaults` to include `build-esm` and `post-build-esm` in build chain

**Per-Package Changes (37 packages):**
- Created `tsconfig.esm.json` with ESM-specific compiler options (`module: "ESNext"`, `moduleResolution: "Bundler"`)
- Updated `package.json` exports with dual CJS/ESM structure (`import`, `require`, `types`, `default`)
- Added `post-build-esm` target to `project.json` files

### Results

**Successfully Building ESM (3 packages):**
- `@nx/docker`
- `@nx/gradle`
- `@nx/maven`

**Excluded from ESM (35 packages):**
Most packages use `import x = require('y')` syntax incompatible with ESM. Affected packages include: angular, cypress, eslint, jest, next, node, react, remix, storybook, vite, webpack, and others.

### Key Finding: Migration Effort

The main blocker is the `import x = require('y')` pattern used extensively (~18 packages directly). These need conversion to:
- `import * as x from 'y'` (namespace imports)
- `import x from 'y'` (default imports)
- `import { a, b } from 'y'` (named imports)

This is a systematic but significant effort affecting both direct usage and transitive dependencies through tsconfig references.

### Next Steps Plan Created

Detailed migration plan for converting `import = require` patterns: `.ai/2025-12-05/tasks/esm-import-migration-plan.md`

Key steps:
1. Enable `esModuleInterop` in `tsconfig.base.json`
2. Convert `import x = require('y')` to standard ES imports
3. Handle edge cases (dynamic requires, JSON imports)
4. Verify both CJS and ESM outputs work for each migrated package

---

## Planning

### Hackday: I/O Tracing for Misconfigured Inputs/Outputs
- Created comprehensive implementation plan for detecting misconfigured task inputs/outputs
- Plan file: `.ai/2025-12-05/tasks/hackday-io-tracing-plan.md`
- **Goal**: Trace actual file I/O during task execution and compare against declared configurations

#### Four-Phase Implementation:
1. **Nx CLI `--plan` flag** - Output task execution plan to `.nx/cache/plan.json`
   - Key files: `run.ts`, `run-many.ts`, `run-command.ts`
   - JSON schema defined for task graph, inputs/outputs, and dependencies

2. **eBPF I/O Tracing PoC** - Linux-only tracing via Docker
   - Reference: jaysoo's gist implementation
   - Syscalls: `sys_enter_openat`, `sys_exit_openat`, `sys_enter_read`, `sys_enter_write`
   - PID tracking via `pgrep -P` polling

3. **Nx Cloud API Integration** - Store I/O analysis with CPU/memory metrics
   - TypeScript models: `TaskIoAnalysis`, `AggregatedIoAnalysis`, `IoIssueSummary`
   - Kotlin API models for backend storage
   - MongoDB storage in `ciPipelineExecutions` collection

4. **Nx Cloud UI Warning** - Display warnings for I/O mismatches
   - Follow `CiPipelineExecutionAlerts` pattern
   - Show unexpected reads/writes, unused inputs, missing outputs

#### Open Questions:
- Nx Agents container capabilities (bpftrace, sudo, kernel headers)
- Scope: Nx Agents only vs local DTE agents
- plan.json consumption (CLI vs PoC script)
- Performance overhead and opt-in strategy
- False positive handling

## Maintenance

### Nx.dev Website Update (master → website-22)
- Cherry-picked documentation commits from master branch

**Successful (3 commits):**
- `7ff4f19529` - docs(misc): update blog post links to new enterprise paths (#33654)
- `3ca68887de` - docs(nx-cloud): standardize terminology to Access token (#33334)
- `e807320d74` - docs(nx-dev): add global Cmd+K search shortcut for non-docs pages (#33709)

**Skipped - Already Applied (7 commits):**
- Storybook docs for version 10
- Custom workspace ESLint rules guide
- Atomizer documentation updates
- Enterprise rename
- Powerpack docs cleanup
- CI resource usage guide update
- Nx vs DIY article

**Failed - Merge Conflicts (2 commits):**
- `081bec53cf` - 22.1 article and changelog (conflict in blog file)
- `77692feae4` - CI resource usage guide (conflicts in mdoc and env-vars files)

---

## Hackday: macOS I/O Tracing Implementation

**Repository**: `/Users/jack/projects/io-tracing`
**Plan**: `.ai/2025-12-05/tasks/macos-io-tracing-investigation.md`

Created a cross-platform Nx-aware I/O tracer that detects undeclared file dependencies in Nx projects.

### Key Accomplishments

**Files Created**:
| File | Description |
|------|-------------|
| `tracer-nx.mjs` | Main Nx-aware tracer (auto-detects platform) |
| `tracer-fsusage.mjs` | Standalone macOS fs_usage tracer |
| `libs/data-processor/` | Test Nx project with intentional I/O mismatches |
| `docker-compose.yml` | Docker setup for running Linux tracer from macOS |

**Commits**:
1. `88be64b` - chore: switch to pnpm and update Nx workspace config
2. `68cce17` - feat: add data-processor test library with intentional I/O mismatches
3. `bae592e` - feat: add cross-platform Nx-aware I/O tracer
4. `d7300a7` - chore: add .pnpm-store to gitignore

### Technical Findings

- **macOS**: `fs_usage` works well with SIP enabled (requires sudo)
- **macOS**: `dtruss` has SIP issues, doesn't capture child process I/O (not recommended)
- **Linux**: `strace -f` captures full process tree cleanly
- **Docker**: Volume isolation needed for node_modules; `NX_DAEMON=false` required

### Usage
```bash
# macOS
sudo node tracer-nx.mjs data-processor:process-data

# Linux (via Docker)
docker compose exec ebpf bash -c "pnpm install && rm -rf .nx && node tracer-nx.mjs data-processor:process-data"
```

---

## I/O Tracer: Portable Installation

Made the I/O tracer installable into any Nx workspace with a self-contained `.io-tracer/` directory.

### Key Accomplishments

**Created `install.sh`** - Portable installation script:
- Validates target is an Nx workspace (checks for nx.json)
- Copies Dockerfile, tracer-nx.mjs to `.io-tracer/` directory
- Generates tailored docker-compose.yml with isolated Docker volumes
- Creates `trace.sh` convenience script
- Adds README.md with usage instructions
- Updates workspace's .gitignore

**Isolated Docker Volumes** - Prevents host/container permission conflicts:
- `tracer_node_modules`, `tracer_pnpm_store` - Dependencies
- `tracer_nx_cache` - Nx cache (.nx)
- `tracer_dist`, `tracer_tmp`, `tracer_build`, `tracer_coverage` - Build outputs
- `tracer_cargo_target` - Rust/Cargo target

**Self-contained `.io-tracer/` Directory**:
| File | Description |
|------|-------------|
| `README.md` | Usage instructions for end users |
| `docker-compose.yml` | Container orchestration with isolated volumes |
| `Dockerfile` | Ubuntu container with strace, Node, pnpm, Java, Rust |
| `tracer-nx.mjs` | Main tracer with HashPlanInspector integration |
| `trace.sh` | Convenience wrapper for running traces |

**Tested on Fresh Workspace**:
```bash
npx create-nx-workspace@latest test-io-tracer --preset=ts
./install.sh /tmp/test-io-tracer
cd /tmp/test-io-tracer/.io-tracer
docker compose up -d && docker compose exec tracer npm install
./trace.sh @test-io-tracer/mylib:build --skip-nx-cache
# Result: All I/O matched declared inputs/outputs
```

---

## Tooling

### MyNotes MCP Server: Category Priority Boost
- Added category-based scoring to prioritize dictations in search results
- File: `mcp-server/mcp_ai_content_server/search_engine.py`

**Score Boosts:**
- Dictations: +4.0 (highest priority)
- Tasks: +2.0
- Specs: +1.0
- Other: no boost

This stacks with existing boosts (recency up to +3.0, SUMMARY.md/TODO.md +5.0), ensuring dictations appear higher in search results when relevant.
