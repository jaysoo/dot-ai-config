# nx import Testing Playbook

Reusable process for iteratively testing `nx import` with a specific technology/plugin and building a skill reference file. Based on the Vite testing cycle (13 iterations, 6 validation scenarios).

## Prerequisites

- Read `SKILL.md` and any existing `references/*.md` files first
- Identify the technology: what Nx plugin(s), what frameworks, what build tools
- Identify scenario axes: Nx source vs non-Nx source, single vs multi-project, mixed frameworks

## Phase 1: Scenario Design

Define 4-6 scenarios covering:

| #   | Source Type                   | Complexity | Notes                                            |
| --- | ----------------------------- | ---------- | ------------------------------------------------ |
| 1   | Nx monorepo, single framework | Basic      | Baseline — apps + libs                           |
| 2   | Nx monorepo, multi-project    | Medium     | Extra generators, shared libs                    |
| 3   | Non-Nx (plain npm/pnpm)       | Medium     | No nx.json, raw package.json scripts             |
| 4   | Non-Nx, alternate tooling     | Medium     | e.g., create-vite, create-react-app, Angular CLI |
| 5   | Mixed sources (two imports)   | Complex    | Name collisions, dep conflicts, mixed configs    |
| 6   | Version mismatch              | Complex    | Source uses older/newer major versions           |

Adapt to the technology. Not all axes apply to every plugin.

## Phase 2: Iterative Testing

### Per Iteration

1. **Create workspaces in `/tmp`**

   ```bash
   # Dest — always a fresh TS preset workspace
   cd /tmp && npx create-nx-workspace@latest dest-N --preset=nrwl/empty --pm=pnpm --no-interactive

   # Source — varies per scenario
   npx create-nx-workspace@latest source-N --template=TEMPLATE --pm=pnpm --no-interactive
   # OR: non-Nx scaffolding (create-vite, ng new, etc.)
   ```

   Note: Can use `--preset` intead of `--template` but make sure to unset `CLAUDECODE` environment variable so we skip args normalization for AI agents.

2. **Add projects to source** (generators, manual files, whatever the scenario needs)

3. **Run `nx import`** from dest workspace

   ```bash
   cd /tmp/dest-N
   npx nx import /tmp/source-N DEST_DIR --ref=main --source=SOURCE_DIR --no-interactive
   ```

4. **Verify**: `nx run-many -t typecheck build test lint`

5. **Capture every error** — exact message, file, root cause, fix applied

6. **Update the reference file** with findings before next iteration

### Iteration Strategy

- Start simple (scenario 1), get it green, then increase complexity
- Each iteration should test ONE new axis — don't combine unknowns
- If an iteration surfaces a generic issue (applies to any technology), add it to `SKILL.md`, not the reference file
- Stop iterating on a scenario once it's green with no new findings

## Phase 3: Consolidation

After all iterations pass:

1. **Deduplicate** — remove repeated information across sections
2. **Separate concerns** — generic issues → `SKILL.md`, tech-specific → `references/TECH.md`
3. **Frame instructions as verification, not prescription** — say "ensure X exists in dest root tsconfig" not "the TS preset generates Y, change it to Z"
4. **Add a Fix Order** — numbered steps for Nx source and non-Nx source
5. **Add a Quick Reference** — comparison table if multiple frameworks/variants exist

## Phase 4: Validation Pass

Run all scenarios in parallel one final time against the finished reference file. Document each scenario with:

- Config file snapshots (tsconfig.base.json, nx.json, eslint.config.mjs, etc.)
- Full `nx run-many` output
- Any manual fixes applied and which reference file section covers them

Store results in a markdown report.

## Lessons Learned (from Vite cycle)

### Process

- **Start with one reference file per technology area**, not per-framework. We started with separate VITE-REACT.md and VITE-VUE.md then had to merge them — wasted effort.
- **Separate generic vs tech-specific early.** Generic import issues (pnpm globs, root deps, project references) kept getting mixed into the Vite file. Required a later restructuring pass.
- **Frame as "carry over" not "change from default."** CNW-specific language like "The TS preset generates X" crept in everywhere. The skill should describe what Vite/React/etc. projects _need_, not what a specific preset _doesn't provide_. The dest workspace could be anything.

### Agent execution

- **Sandboxed agents don't persist filesystem changes.** If running scenarios via agents, all meaningful output (errors, configs, fix steps) must be captured in the agent's text response. Don't rely on reading files from `/tmp` after the agent finishes.
- **Run scenario + extraction in the same agent.** Splitting "run import" and "extract configs" into separate agents failed because the first agent's fixes weren't visible to the second.
- **Capture configs BEFORE and AFTER fixes.** The "before" state shows the problem; the "after" state shows the solution. Both are needed for the reference file.

### Content quality

- **The gotcha is more valuable than the fix.** "TypeScript does NOT merge `lib` arrays" is more useful than "add `dom` to `lib`". Prioritize documenting _why_ something breaks.
- **Known issues with workarounds belong in the reference.** e.g., "@nx/eslint init crashes if Vue deps aren't installed first" — this saves hours of debugging.
- **Version-specific breakage has a shelf life.** Note the versions involved (e.g., "Vite 6→7 type mismatch") so the guidance can be removed when no longer relevant.
