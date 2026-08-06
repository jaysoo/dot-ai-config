# NXC-4762: Replace minimatch with picomatch in core package

Date: 2026-08-04. Branch: NXC-4762 (worktree). Polygraph session: lucid-ocelot-5a65ca7d.
Trigger: brace-expansion CVE GHSA-rgw5-rvv9-x895 (CVE-2026-69152, DoS; patched 5.0.9).
Prior research: `dot_ai/2026-07-29/tasks/nxc-4739-remove-axios-brace-expansion-research.md`.

## What was done

- Swapped minimatch -> picomatch at every import site (20 files, 7 packages: nx, devkit, jest, playwright, react, rsbuild + eslint/nx spec-only usages).
  - `minimatch(f, p, o)` -> `picomatch.isMatch(f, p, o)`
  - `new Minimatch(p, o)` + `.match(f)` -> `picomatch(p, o)` matcher fn
  - `minimatch.makeRe(p, o)` -> `picomatch.makeRe(p, o)` (try/catch: picomatch throws where minimatch returned null)
  - `minimatch.filter(p)` -> `picomatch(p)`
- package.json: swapped `minimatch: catalog:` -> `picomatch: catalog:` (4.0.4, at/above CVE-2026-33672 floor) in the 6 packages; dropped root devDep (picomatch already present).
- pnpm-workspace.yaml: removed minimatch from catalog; KEPT overrides `minimatch: ^10.2.5` + `brace-expansion` (bumped 5.0.8 -> 5.0.9 = GHSA-rgw5-rvv9-x895 patch) for the ~50 transitive dev-tree dependents (eslint, glob, verdaccio, typedoc, published nx betas...).

## Divergences found + handled (not pure 1:1)

1. **`{**/a,**/b}` combined globs miss root-level files.** picomatch only gives leading `**/` zero-segment treatment in standalone patterns, not inside brace alternation. `combineGlobPatterns` wraps plugin createNodes globs exactly this way. Caught by 17 eslint plugin spec failures. Fix: new `splitGlobPatterns()` in `packages/nx/src/utils/globs.ts` (+ local copy in devkit for +/-1 major nx compat); jest plugin + project-glob-changes now pass pattern ARRAYS to picomatch (arrays get standalone semantics per element).
2. **Empty pattern throws** (minimatch: false). Guards: jest plugin (empty array -> matches nothing), project-glob-changes (no plugins -> []), generators/glob.ts (preserves 'Invalid glob pattern' throw), makeRe sites (try/catch).
3. **`makeRe` returns regex or throws** vs minimatch's null return: try/catch at repository-git-tags, find-matching-projects, generators/glob.

## Divergences accepted (behavior change, deemed fine/better)

- `a/**` now matches `a` (zero segments) at former minimatch-fn sites. minimatch's OWN makeRe already behaved this way, so makeRe-based sites are unchanged; fn-based sites (hasher filesets, graph) gain the zero-segment match. Standard bash/micromatch semantics.
- `!(x)` extglob: minimatch parsed leading `!` as negation-of-literal; picomatch treats as real extglob (micromatch semantics). Improves min-release-age yarn.ts fidelity (comment updated - old "residual" note removed).
- `#pattern` no longer treated as comment (matches literally). Comment handling was a minimatch quirk.
- Backslash-escape edge cases differ; nx normalizes paths to `/` so low risk.

## Verification

- Differential test corpus (45 cases) minimatch 10.2.5 vs picomatch 4.0.4.
- Unit tests green: nx targeted suites (156+743+68+14), devkit 601, jest 345, eslint 426, playwright 540, rsbuild 96, react 68. nx full suite via CI/background.
- `nx affected -t build-base`: 42 projects green. Lint (dependency-checks) green.
- Runtime dep closure check from lockfile: minimatch/brace-expansion/balanced-match NONE in nx, devkit, playwright, react, rsbuild closures. @nx/jest still has them via jest upstream (jest-config -> glob) - unavoidable.
- `CI=true pnpm install --frozen-lockfile` passes.

## Lockfile answer (brace-expansion)

- Cannot be fully removed from pnpm-lock.yaml: ~50 dev-tree transitives require minimatch (eslint, glob@6-13, verdaccio, typedoc, @types/glob...). It remains ONCE, pinned safe: brace-expansion@5.0.9 (patched). No `@isaacs/brace-expansion`.
- The CVE-relevant surface (published `nx` runtime closure, expand-deps flattened) is now clean: -3 packages (minimatch, brace-expansion, balanced-match), +0 (picomatch already shipped via other plugins... actually nx gains picomatch, net -2).

## Review round (2026-08-05, all fixed)

- filterUsingGlobPatterns: `libs/a/{**/*.ts,**/*.tsx}` dropped `libs/a/index.ts` (prefixed brace, splitter can't help) -> new `expandGlobPatternBraces()` + precompiled matchers. Callers: create-package-json, find-npm-dependencies, graph (NOT task hashing - Rust owns that; splitGlobPatterns = faithful port of Rust `potential_glob_split`).
- Mixed pos/neg pattern arrays passed to one picomatch call made EVERYTHING match ("not excluded" semantics): fixed in generators/glob.ts + jest workspaces matcher with split positive/negative matchers + tests. Real bug fix: negated workspaces entries now actually exclude.
- repository-git-tags: try/catch swallowed non-string errors minimatch used to throw -> only guard empty string. Same at find-matching-projects.
- Perf spec strawman: `items.filter(picomatch(p))` passes filter's index into picomatch's returnObject param -> everything matches (@types/picomatch@3.0.2 omits the param so the bug typechecks). Use arrow.
- task-hasher './'-comment was inverted (picomatch handles ./ fine; minimatch didn't); "invalid pattern" comments wrong (only '' throws; `[`, `{a`, `!(` compile fine in both).
- Rebased onto master (jest plugin imports moved to @nx/devkit/internal barrel; combineGlobPatterns dropped from its import list).

## Follow-ups for Jack

- @nx/jest runtime closure still pulls minimatch/brace-expansion via jest's own deps (user installs resolve per jest's ranges, not our overrides). Upstream, not fixable here.
- Overrides `minimatch: ^10.2.5` + `brace-expansion: 5.0.9` must stay while dev-tree transitives exist; revisit if repo drops eslint/glob-based tooling.
- Windows backslash-escape semantics differ slightly (minimatch escape vs picomatch literal); nx normalizes to `/` everywhere we could find - flag if a Windows glob regression appears.
- Consider adding the `no-restricted-imports` minimatch ban (like js/vite/vue/rollup eslint configs) to the migrated packages to prevent regression.
