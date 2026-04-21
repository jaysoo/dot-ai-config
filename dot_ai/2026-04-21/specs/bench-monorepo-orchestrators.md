# Spec: `bench-monorepo-orchestrators`

**Goal:** a reproducible benchmark repo comparing four monorepo task orchestrators — **Nx, Turborepo, Vite+, and pnpm -r (no orchestrator)** — running an identical underlying tool suite (oxlint, oxfmt, vitest, vite) on identical source code.

**Author:** Jack Hsu
**Date:** 2026-04-21
**Status:** Ready for implementation

---

## 1. Context and goals

### Why build this

- `vsavkin/large-monorepo` (the current canonical Nx-vs-Turbo benchmark) is 5 years old — Next.js 12, React 17, npm workspaces. It compares Nx / Turbo / Lage and uses Next.js app builds as the benchmark workload.
- `meeroslav/pnpm-workspace-baseline` has no published benchmark methodology.
- **Vite+** (commercial Vite distribution bundling oxlint, oxfmt, vitest, vite, rolldown, tsgo) ships `vp run` for dependency-aware, cached workspace execution. No public benchmark compares it to Nx/Turbo.
- The `nx.dev/docs/guides/adopting-nx/nx-vs-turborepo` page needs fresh, reproducible data.

### Goals

1. A single pnpm-workspace repo with four branches (`main`, `add_nx`, `add_turbo`, `add_vp`) that differ **only in orchestrator configuration**.
2. Identical underlying tool suite across branches → isolate orchestration overhead as the measured variable.
3. A hyperfine-based methodology anyone can clone and reproduce.
4. Results published in the README alongside system specs.

### Non-goals (v1)

- Typecheck benchmarks
- Affected / incremental runs
- Remote caching (Nx Cloud, Turbo Remote Cache)
- Dev-server startup time
- SSR/RSC workloads
- Cross-platform testing (macOS reference only for v1)

---

## 2. Repo structure

```
bench-monorepo-orchestrators/
├── packages/
│   ├── shared/
│   │   ├── alerts/
│   │   ├── buttons/
│   │   ├── components/
│   │   ├── dialogs/
│   │   └── icons/
│   ├── crew/
│   │   ├── important-feature-0/       # layer 1 primitive
│   │   ├── ...
│   │   └── important-feature-19/      # layer 3 composite
│   ├── flight-simulator/              # same 20-pkg layered shape
│   ├── navigation/                    # same
│   ├── ticket-booking/                # same
│   └── warp-drive-manager/            # same
├── apps/
│   ├── crew/                          # TanStack Router + Vite SPA
│   ├── flight-simulator/
│   ├── navigation/
│   ├── ticket-booking/
│   └── warp-drive-manager/
├── bench/
│   ├── run.sh                         # single: bench/run.sh <branch> <task> <cold|warm>
│   ├── run-all.sh                     # full 32-measurement matrix
│   ├── clean-caches.sh                # --prepare hook for cold runs
│   └── results/                       # committed output from reference runs
├── scripts/
│   └── generate-repo.mjs              # deterministic generator (rerunnable)
├── pnpm-workspace.yaml
├── package.json                        # root
├── tsconfig.base.json
├── .gitignore
└── README.md
```

**Counts:** 105 packages (5 × 20 domain + 5 shared), 5 apps. Matches `vsavkin/large-monorepo` exactly.

---

## 3. Package graph (layered, Option B)

Per domain (20 packages):

| Layer | Packages | Imports from |
|---|---|---|
| L1 — primitives | `important-feature-0..4` (5 pkgs) | only `shared/*` |
| L2 — mid-tier | `important-feature-5..14` (10 pkgs) | 2–3 L1 packages + 1 shared |
| L3 — composites | `important-feature-15..19` (5 pkgs) | 2–3 L2 packages |
| App | `apps/<domain>` | all 5 L3 composites of its domain |

**No cross-domain edges.** Graph depth from app → shared: 4 hops. Every dep is declared both in `package.json` (`"workspace:*"`) and as a real TypeScript import — this exercises Nx's TS-import graph analysis in addition to `package.json`-based analysis.

Shared packages (`shared/alerts`, `shared/buttons`, `shared/components`, `shared/dialogs`, `shared/icons`) are leaves with no workspace deps.

---

## 4. Per-package content

### Domain packages

Each `packages/<domain>/important-feature-N/` contains:

```
package.json
tsconfig.json                 # extends ../../../tsconfig.base.json
src/
  index.ts                    # re-exports all 250 components
  lib/
    component-0.tsx           # ~20 LOC React FC
    component-0.module.css
    component-0.spec.tsx      # vitest + @testing-library/react render test
    ...
    component-249.spec.tsx
```

**Per component** (generated from template):
- React functional component importing 1–5 workspace deps (depends on layer)
- One CSS module (small)
- One `.spec.tsx` rendering the component + asserting one prop/text

**Per package:** ~5,000 LOC source + 250 spec files.
**Repo-wide:** ~26,250 components, ~525k LOC — matches `vsavkin/large-monorepo` scale so oxlint/tsc/vitest have meaningful work.

### Shared packages

Each of the 5 `packages/shared/<name>/` contains:
- 50 small components or util functions
- No workspace deps

### Apps

Each `apps/<domain>/`:

```
package.json
tsconfig.json
vite.config.ts                # minimal: React plugin only
index.html
src/
  main.tsx                    # TanStack Router bootstrap
  router.tsx                  # code-based route definitions
  routes/
    index.tsx                 # renders all 5 L3 composites from its domain
```

Minimal deps: `react@19`, `react-dom@19`, `@tanstack/react-router@^1.168`, `vite@^8`, `@vitejs/plugin-react@^4`, `typescript`.

**No file-based routing** (skip `@tanstack/router-vite-plugin`) — keeps build semantics simple and timings predictable.

---

## 5. Task scripts (identical across all branches)

Every package's `package.json`:

```jsonc
{
  "scripts": {
    "lint":   "oxlint src",
    "format": "oxfmt --check src",
    "test":   "vitest run"
  }
}
```

Every app's `package.json` adds:

```jsonc
{
  "scripts": {
    "build":  "vite build"
  }
}
```

**Task inventory:**

| Task | Target level | Count |
|---|---|---|
| `build` | apps only | 5 |
| `lint` | packages + apps | 110 |
| `format` | packages + apps | 110 |
| `test` | packages + apps | 110 |

`build` transitively processes packages as Vite bundles them from TS source — packages themselves have no `build` target.

---

## 6. Branch strategy

All branches fork from `main` and carry only orchestrator deltas. No divergence in source code, tool versions, or `pnpm-workspace.yaml`.

### `main`
- Root `package.json` scripts:
  ```jsonc
  {
    "scripts": {
      "bench:build":  "pnpm -r --filter='./apps/*' run build",
      "bench:lint":   "pnpm -r run lint",
      "bench:format": "pnpm -r run format",
      "bench:test":   "pnpm -r run test"
    }
  }
  ```
- No orchestrator devDep, no orchestrator config files.

### `add_nx`
- Add `nx` devDep + `nx.json` at root.
- **Use `package.json` `"nx"` field per package — NOT `project.json`. NO inferred plugins.**
- Each package's `package.json` gets an explicit `nx` block:
  ```jsonc
  {
    "name": "@bench/crew-important-feature-0",
    "nx": {
      "targets": {
        "lint":   { "cache": true, "inputs": ["default"], "outputs": [] },
        "format": { "cache": true, "inputs": ["default"], "outputs": [] },
        "test":   { "cache": true, "inputs": ["default", "^default"], "outputs": [] }
      }
    },
    "scripts": { ... }
  }
  ```
- Apps additionally declare `build` with `"outputs": ["{projectRoot}/dist"]`.
- `nx.json` defines `targetDefaults`, `namedInputs`, and leaves `plugins: []` empty.
- Root scripts:
  ```jsonc
  {
    "bench:build":  "nx run-many -t build",
    "bench:lint":   "nx run-many -t lint",
    "bench:format": "nx run-many -t format",
    "bench:test":   "nx run-many -t test"
  }
  ```

### `add_turbo`
- Add `turbo` devDep + `turbo.json` at root.
- Minimal `turbo.json`:
  ```jsonc
  {
    "$schema": "https://turbo.build/schema.json",
    "tasks": {
      "build":  { "outputs": ["dist/**"] },
      "lint":   { },
      "format": { },
      "test":   { "dependsOn": ["^build"] }
    }
  }
  ```
- Root scripts: `turbo run <task>`.

### `add_vp`
- Add `vite-plus` devDep + `vp` CLI.
- Vite+ config file at root (exact filename TBD during implementation — `vp.config.ts` is the working guess; verify from https://viteplus.dev).
- Root scripts: `vp run <task>`.

Per-package and per-app `package.json` scripts are identical across all four branches. Only root scripts and orchestrator config differ.

---

## 7. Benchmark methodology

**Matrix:** 4 branches × 4 tasks × 2 cache states = **32 measurements**.

### Hyperfine invocation

**Cold:**
```bash
hyperfine \
  --prepare './bench/clean-caches.sh <branch>' \
  --warmup 2 \
  --runs 10 \
  --export-markdown bench/results/<branch>-<task>-cold.md \
  --export-json     bench/results/<branch>-<task>-cold.json \
  '<orchestrator-command>'
```

**Warm:**
```bash
hyperfine \
  --warmup 3 \
  --runs 10 \
  --export-markdown bench/results/<branch>-<task>-warm.md \
  --export-json     bench/results/<branch>-<task>-warm.json \
  '<orchestrator-command>'
```

`--prepare` runs before every measurement → cold means *always cold*. Warm has no `--prepare`; first 3 runs warm the cache, measured runs are all warm.

### `bench/clean-caches.sh <branch>`

Always clears (cross-branch):
- `node_modules/.cache`
- all `dist/` under `packages/*/*` and `apps/*`
- all `*.tsbuildinfo`
- all `.vite/` caches

Per branch:
- `main`: nothing extra
- `add_nx`: `.nx/cache`, `.nx/workspace-data`
- `add_turbo`: `.turbo/`
- `add_vp`: Vite+ cache path (TBD — inspect after first `vp run`; document in README once known)

**Never** deletes `node_modules/` — install time is out of scope and would dominate cold numbers.

### Commands

| Branch | build | lint | format | test |
|---|---|---|---|---|
| `main` | `pnpm -r --filter='./apps/*' run build` | `pnpm -r run lint` | `pnpm -r run format` | `pnpm -r run test` |
| `add_nx` | `nx run-many -t build` | `nx run-many -t lint` | `nx run-many -t format` | `nx run-many -t test` |
| `add_turbo` | `turbo run build` | `turbo run lint` | `turbo run format` | `turbo run test` |
| `add_vp` | `vp run build` | `vp run lint` | `vp run format` | `vp run test` |

### `bench/run.sh` usage

```bash
bench/run.sh <branch> <task> <cold|warm>
# e.g.
bench/run.sh add_nx lint cold
```

Script checks out the branch, runs the right hyperfine invocation, writes results to `bench/results/<branch>-<task>-<state>.{md,json}`.

### `bench/run-all.sh`

Iterates the full 32-measurement matrix sequentially (never in parallel — parallelism would corrupt measurements). Produces a summary `bench/results/SUMMARY.md` with a combined table.

---

## 8. Generator script (`scripts/generate-repo.mjs`)

Deterministic Node ESM script. Inputs:

- Domain names: `['crew', 'flight-simulator', 'navigation', 'ticket-booking', 'warp-drive-manager']`
- Shared names: `['alerts', 'buttons', 'components', 'dialogs', 'icons']`
- Components per package: `250`
- Layered graph topology described in §3

Outputs (commits the full tree):
- 105 package directories under `packages/`, each with `package.json`, `tsconfig.json`, `src/index.ts`, 250 `*.tsx` + `*.module.css` + `*.spec.tsx` triplets
- 5 app directories under `apps/`
- `pnpm-workspace.yaml`, `package.json`, `tsconfig.base.json`

**Re-runnable:** running the generator on a clean checkout produces byte-identical output (deterministic ordering, no timestamps, no random IDs). Same random seed across runs — use numeric index from loop counters, not `Math.random()`.

**Why re-runnable matters:** makes it trivial to tune scale later (e.g. bump to 500 components/pkg) with `pnpm run regenerate && git add -A && git commit`.

Generator is on `main`; the other three branches just layer orchestrator files on top of the generated tree.

---

## 9. Pinned tool versions

All branches share the same pins (declared in root `package.json` devDeps or per-package deps where appropriate). Lock at implementation time:

| Tool | Expected version |
|---|---|
| Node | 22 LTS (document exact minor in README) |
| pnpm | 9.x |
| `oxlint` | latest stable (≥1.61 per research) |
| `oxfmt` | latest stable (≥0.46 per research) |
| `vitest` | latest stable compatible with Vite 8 |
| `vite` | 8.x |
| `@vitejs/plugin-react` | 4.x |
| `react`, `react-dom` | 19.x |
| `@tanstack/react-router` | 1.168.x |
| `typescript` | 6.x |
| `@testing-library/react` | latest compatible with React 19 |
| `nx` | latest stable (add_nx only) |
| `turbo` | 2.x (add_turbo only) |
| `vite-plus` | latest alpha (add_vp only — pin exactly; it's alpha) |
| `hyperfine` | installed via brew, any recent version |

---

## 10. README outline

Sections:
1. **What this benchmarks** — 4-way orchestrator comparison with identical underlying tools
2. **Prerequisites** — pnpm 9+, Node 22+, hyperfine, ~5 GB disk
3. **Setup** — `git clone && pnpm install`, branch switching
4. **Quickstart** — single measurement via `bench/run.sh add_nx lint cold`
5. **Full matrix** — `bench/run-all.sh`, writes 32 result files
6. **Results table** — summary of published numbers on reference hardware
7. **Interpreting results** — cold vs warm semantics per tool; what each orchestrator skips on warm
8. **Reproducing on your machine** — disclaimer about hardware, how to report
9. **Methodology details** — hyperfine flags, cache-clearing strategy, why no `rm -rf node_modules`
10. **Caveats**
   - Vite+ is alpha (date-stamped)
   - TanStack Router SPA, not Next.js (differs from `vsavkin/large-monorepo`)
   - Layered graph (differs from `vsavkin/large-monorepo`'s flat graph)
   - No remote cache, no affected, no typecheck
   - Single-machine, no CI parallelism
11. **Related work** — links to `vsavkin/large-monorepo`, `meeroslav/pnpm-workspace-baseline`, Vite+ docs

---

## 11. Verification / acceptance criteria

1. **Sanity per branch:** on each of the 4 branches, `pnpm install && pnpm run bench:lint && pnpm run bench:format && pnpm run bench:test && pnpm run bench:build` completes without error.
2. **Cache-clear correctness:** after `bench/clean-caches.sh add_nx`, `.nx/cache` is absent; first `nx run-many -t lint` logs zero cache hits.
3. **Warm correctness:** second consecutive `nx run-many -t lint` reports all 110 tasks replayed from cache.
4. **Nx package.json config:** no `project.json` files exist on `add_nx`; every package's `package.json` has an `nx` block; `nx.json` has empty `plugins`.
5. **Full matrix:** `bench/run-all.sh` produces 32 non-empty result files; hyperfine stddev <20% of mean on each measurement.
6. **Graph sanity:** `nx graph --file=graph.json` on `add_nx` shows 110 nodes, correct layered edges, no cross-domain edges.
7. **Reference publication:** a results table is committed to `bench/results/SUMMARY.md` reflecting a reference Mac M-series run, with system specs documented.

---

## 12. Testing plan

No automated test suite — this repo *is* a test suite. Manual verification per §11.

Smoke test checklist before publishing numbers:
- [ ] `pnpm install` succeeds on clean checkout on all 4 branches
- [ ] `pnpm run bench:build` produces `dist/` in each app on all 4 branches
- [ ] Vitest tests all pass (26,250 spec files)
- [ ] oxlint clean (no warnings; generator produces lint-clean code)
- [ ] oxfmt `--check` clean (generator produces pre-formatted code)
- [ ] hyperfine output stddev <20% of mean on a dedicated, quiescent machine
- [ ] Results tables render correctly in GitHub markdown

---

## 13. Risks and open items

| Risk | Mitigation |
|---|---|
| Vite+ alpha breaks between runs | Pin exact version; re-run full matrix when bumping |
| 26k test files slow warm-cache too aggressively (warm runs <10ms, noise-dominated) | Measure during implementation; scale down component count to 100/pkg if warm runs are unreliable |
| Generator drift between branches | Generator lives only on `main`; other branches rebase from `main`; never run generator on non-`main` branches |
| `pnpm -r` parallelism default differs from orchestrator defaults | Document `pnpm -r --workspace-concurrency` setting used; fix across all branches |
| Nx package.json config not well-documented | Reference `nx.dev/docs/reference/project-configuration` during implementation |
| Vite+ cache path unknown | Inspect filesystem after first `vp run`; document in README |

**Open for implementation phase:**
- Exact Vite+ config filename
- Exact Vite+ cache directory
- Whether `test` should declare `"dependsOn": ["^build"]` on Nx/Turbo (mirrors how vitest transitively needs TS-resolved deps — but vite resolves TS inline, so probably not needed; verify)
- Reference hardware: which machine for the canonical run?

---

## 14. Critical files to create

| Path | Purpose |
|---|---|
| `pnpm-workspace.yaml` | declares `apps/*`, `packages/*/*` |
| `package.json` (root) | top-level scripts, shared devDeps |
| `tsconfig.base.json` | shared TS config for all packages |
| `bench/run.sh`, `bench/run-all.sh`, `bench/clean-caches.sh` | benchmark drivers |
| `scripts/generate-repo.mjs` | deterministic generator |
| `packages/*/*/package.json` × 105 | per-pkg deps + scripts (plus `nx` block on `add_nx`) |
| `packages/*/*/src/index.ts`, `src/lib/component-N.{tsx,module.css,spec.tsx}` × 26,250 | code + tests |
| `apps/*/package.json` × 5 | app deps + scripts |
| `apps/*/vite.config.ts`, `src/main.tsx`, `src/router.tsx`, `src/routes/index.tsx` × 5 | app layer |
| `nx.json` (on `add_nx`) | targetDefaults, namedInputs, empty plugins |
| `turbo.json` (on `add_turbo`) | task definitions |
| Vite+ config (on `add_vp`) | filename TBD |
| `README.md` | end-user docs |
| `.gitignore` | `node_modules`, `dist`, `.nx`, `.turbo`, Vite+ cache dir, `bench/results/*.tmp` |

---

## 15. Implementation order (suggested)

1. Scaffold `main`: root config, `pnpm-workspace.yaml`, `tsconfig.base.json`, `.gitignore`
2. Write `scripts/generate-repo.mjs` and generate the 105 packages + 5 apps
3. Verify `pnpm install && pnpm -r run lint|format|test` works and `pnpm -r --filter='./apps/*' run build` works
4. Write `bench/clean-caches.sh`, `bench/run.sh`, `bench/run-all.sh`
5. Commit and push `main`
6. Branch `add_nx`: add `nx` devDep, `nx.json`, `nx` blocks in every `package.json`, update root scripts. Verify `nx run-many` works.
7. Branch `add_turbo` off `main`: add `turbo.json`, update root scripts. Verify.
8. Branch `add_vp` off `main`: add Vite+ config and cache path. Verify.
9. Run full matrix on reference hardware, commit results, update README.
