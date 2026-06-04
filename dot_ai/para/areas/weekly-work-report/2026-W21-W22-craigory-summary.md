# Craigory Coppola (@AgentEnder) — Two-Week Summary
**May 18–31, 2026 · nrwl/nx**

11 PRs merged. No single large feature — a sustained quality-and-correctness sweep across documentation, sandbox compliance, and technical debt cleanup.

---

## W21: May 18–24

### Documentation sprint (3 PRs, all May 21)

**[#35752](https://github.com/nrwl/nx/pull/35752) — docs: document the `convert-target-defaults-to-array` migration**

The most substantial PR of the two weeks. Two problems addressed in one go:

1. The `23-0-0-convert-target-defaults-to-array` migration had no companion docs, so the docs site rendered only a bare heading for it.
2. Several first-party packages (`nx`, `@nx/devkit`, `@nx/eslint`, `@nx/jest`, `@nx/js`) build in-place to a local `dist/` but their `assets.json` never copied migration `.md` files there — so the docs loader silently dropped example bodies for 13 existing migration docs across those packages.

Fix: wrote the migration doc, then added `src/migrations/**/*.md` asset globs to all five affected packages. Systemic infrastructure fix disguised as a docs task.

**[#35760](https://github.com/nrwl/nx/pull/35760) — docs: document spread token in `nx.json` target defaults reference** (fixes NXC-4438)

The spread token (`"..."`) was only documented on the project configuration reference page, not on `nx.json` — where users actually set `targetDefaults`. Added a new subsection with array- and object-form examples, plus a cross-link back to the full reference. No duplication; single source of truth.

**[#35759](https://github.com/nrwl/nx/pull/35759) — docs: note task-specific env vars are not loaded in batch mode** (NXC-4251 docs portion)

`batchEnv` never calls `getTaskSpecificEnv()`, so `.env.[target-name]` files are silently ignored for batched tasks (`--batch` / `NX_BATCH_MODE=true`). Added a caution callout and documented the workaround (set vars in the shell before invoking Nx). Only the docs half of NXC-4251 — the runtime warning is out of scope here.

---

### Repo cleanup (2 PRs, May 19)

**[#35729](https://github.com/nrwl/nx/pull/35729) — cleanup: remove deprecated non-native scanner and `stripSourceCode`**

Completes the Nx 20 deprecation cycle. `strip-source-code.ts` and `typescript-import-locator.ts` were marked `@deprecated "will be removed in Nx 20"` — we're now on v23. The native Rust import scanner replaced them entirely; zero callers remained. Deleted.

**[#35730](https://github.com/nrwl/nx/pull/35730) — cleanup: drop stale `@nrwl` dedup TODO in `nx report`** (NXC-4300)

The dedup logic referenced by a `TODO (v20)` comment had already been removed in #30840. Only the orphaned comment remained. Removed.

---

### Sandbox-driven correctness fixes (3 PRs, May 21–22)

**[#35754](https://github.com/nrwl/nx/pull/35754) — chore(repo): preserve preset dist ignore in graph jest configs**

Caught via an Nx Cloud sandbox report: `graph/migrate:test` was generating 15 undeclared-input reads of `dist/src/**/*.d.ts`. Root cause: `jest.config.cts` in two graph packages spread `nxPreset` and then re-declared `modulePathIgnorePatterns` as a plain array, silently replacing the preset's `dist/` and `out-tsc/` ignore patterns (object spread is a shallow merge). Fix: spread the preset's patterns ahead of the project-specific one. Verified no behavior change; both configs now include all three patterns.

**[#35738](https://github.com/nrwl/nx/pull/35738) — fix(dotnet): include `Directory.*.*` files in inputs**

`Directory.Build.props`, `Directory.Build.targets`, etc. were producing sandbox violations because the dotnet plugin didn't declare them as inputs. Fixed.

**[#35755](https://github.com/nrwl/nx/pull/35755) — fix(nx-plugin): plugin lint checks should use `dependentTasksOutputFiles`**

Lint check target was not correctly declaring its input dependency on task output files. Fixed to use `dependentTasksOutputFiles` instead.

---

## W22: May 25–31

### Multi-version compliance sweep (2 PRs, May 30–31)

**[#35845](https://github.com/nrwl/nx/pull/35845) — fix(vue): multi-version support compliance for `@nx/vue` and `@nx/nuxt`**

Same compliance pattern applied in W21 to eslint/angular/storybook (via bot), done here by hand for the Vue and Nuxt plugins.

**[#35758](https://github.com/nrwl/nx/pull/35758) — fix(testing): enforce jest 29-30 multi-version compliance for `@nx/jest`**

Jest-specific version floor enforcement, covering the jest 29–30 support window.

---

### Repo fix (1 PR, May 30)

**[#35849](https://github.com/nrwl/nx/pull/35849) — fix(repo): rename publish `VERSION` env var to avoid MSBuild leak**

The `VERSION` env var name collided with MSBuild's own `VERSION` property, causing unexpected behavior in dotnet publish workflows. Renamed to a scoped name.

---

## Summary

| Area | PRs | Character |
|------|-----|-----------|
| Documentation | 3 | Thorough; #35752 fixed a systemic pipeline bug affecting 5 packages |
| Sandbox-driven fixes | 3 | All triggered by sandbox violation reports — active use of the tooling |
| Deprecation / cleanup | 2 | Completing overdue Nx 20 cycles |
| Multi-version compliance | 2 | Continuation of the cross-team v23 compliance sweep |
| Repo hygiene | 1 | Small, unrelated |

No single large feature. The docs work is unusually thorough — #35752 in particular went deeper than the surface ask and fixed a build-pipeline gap affecting 13 existing migration docs. The sandbox fixes show active use of Nx Cloud's own tooling to find correctness issues in the repo itself.

---

_Source: GitHub API + git log · nrwl/nx · PRs merged 2026-05-18 to 2026-05-31_
