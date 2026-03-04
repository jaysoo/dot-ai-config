# Summary — 2026-03-04

## DOC-429: Task Sandboxing Documentation

Drafted, iterated, and pushed the new Task Sandboxing feature documentation page for Nx Cloud Enterprise. Multiple rounds of feedback from Rareș incorporated.

**PR:** https://github.com/nrwl/nx/pull/34686 (draft, CI green)

**What was created:**
- New doc page at `astro-docs/src/content/docs/features/CI Features/sandboxing.mdoc`
- SVG diagram (`sandboxing-cache-flow.svg`) showing declared inputs → build → declared outputs → cache key flow
- 6 screenshots: CIPE violations, task violations, sandbox analysis, raw report, cloud settings, settings sidebar
- Cross-reference added to remote caching page (`remote-cache.mdoc`)
- Sidebar entry with "New" badge under Orchestration & CI

**Key sections:**
- Why hermeticity matters (with `app.yaml` undeclared input + `vite-plugin-dts` undeclared output examples)
- How sandboxing works (Warning vs Strict modes)
- Investigating violations (CIPE → task details → sandbox analysis → raw report flow)
- Inspecting inputs and outputs (`nx show target`, `nx show project`, project details widget)
- Enabling sandboxing (Enterprise, single-tenant, Nx Agents required, not manual DTE)
- Excluding paths (global + `task-exclusions` per project/target)
- Cloud settings (Strict / Warning / Off enforcement modes)

**Feedback incorporated from Rareș:**
- Don't reference `@nx/vite` plugin specifically (avoid implying plugin defaults are wrong)
- Use `app.yaml` instead of `.env` for undeclared input example (`.env` env input syntax not supported)
- Remove `NX_CLOUD_IO_TRACING_DIRECTORY` (will be enabled by default on agents soon, NXC-3973)
- Updated exclude config to show actual format with `task-exclusions` support (from ocean PR #10053)
- Don't show node_modules/.nx/.pnpm-store in excludes (auto-excluded)
- Requires Nx Agents, not supported with manual DTE
- Minimum version is 22.5, not 21.5

## Other

- Generated Director of Engineering briefing (capacity/risk analysis for April/May)
- Started nx-import Next.js skill development (NXA-1075, Phase 2)
