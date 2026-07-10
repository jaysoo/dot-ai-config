# nx-typescript-7 benchmark repo (2026-07-09)

## Goal

New repo `~/projects/nx-typescript-7`, modeled on /tmp/tsdual (jaysoo/nx-ts7), but:

- 100 generated packages (lib001..lib100), 10 layers x 10, each layer-L pkg depends on 2 pkgs from layer L-1
- Every package gets BOTH compiler variants via double `@nx/js/typescript` plugin registration (no include/exclude split):
  - `build` / `typecheck` -> TS7 native (`tsc` bin, `typescript@7` via `@typescript/native` alias)
  - `build-tsc6` / `typecheck-tsc6` -> TS6 (`tsc6` bin, `typescript` aliased to `@typescript/typescript6`)
- hyperfine: `nx run-many -t build` vs `build-tsc6`, `typecheck` vs `typecheck-tsc6`

## Key mechanics (from tsdual README)

- `typescript` alias MUST stay on `@typescript/typescript6` (tools need JS API; TS7 ships none)
- `@typescript/native` alias exists only to supply the TS7 `tsc` binary
- npm hoisting hazard: `@typescript/old` can claim `.bin/tsc` on incremental installs; fresh install fine; verify `tsc --version` = 7
- Both variants share tsconfig.lib.json/dist, so clean `packages/*/dist` in hyperfine `--prepare`; benches use `--skipNxCache`
- `typecheck` dependsOn `build` (plugin default), so typecheck bench includes builds - symmetric for both variants

## Status: DONE (2026-07-09)

- Repo scaffolded, 100 pkgs generated (tools/generate-packages.mjs), all 4 targets pass, nx sync clean
- Committed cc1d8bd on main (local only, no remote)

## Results (M-series, warm daemon, clean dist, --skipNxCache, hyperfine)

- v1 (100 tiny pkgs, npm): build 2.98x, typecheck 2.06x. Jack asked why not 8-10x like MS numbers.
- pnpm swap fix (afa9060): pnpm ignores npm workspaces field -> pnpm-workspace.yaml + workspace:*.
- v2 (04370e9): 25-pkg CHAIN, checker-heavy (120 files x 48-kind unions, ~69k lines/pkg) -> 9.95x on `nx run-many -t build` (33.3s vs 331.9s). Typecheck bench dropped per Jack.
- v3 (215a21a): trimmed to 10-pkg chain so TS6 run fits ~2 min: **9.97x** (13.1s vs 130.7s). Ratio is per-package; count only scales wall time.

## Key learnings (reusable for TS7 content/marketing)

- Wall ratio = CPU ratio x core-utilization ratio. tsgo CPU-for-CPU only ~2.4-2.8x on this workload; the rest is multi-core.
- Wide task graph + nx parallel=3 gives single-threaded tsc6 free multi-core scaling -> compresses to ~3-4x. Deep chain isolates per-project compiler speed.
- Checker-heavy code (wide discriminated unions/mapped types) -> ~10x per pkg; parse/emit-heavy plateaus ~7x; tiny pkgs measure startup/orchestration (~4x single-proc, 3x via nx).
- tsgo per-process parallelism plateaus ~4.5-4.8 cores (475% CPU) on this code.
