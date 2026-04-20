# NXC-4262: Common `nx init` Issues — Fixes & Repros

**Linear:** https://linear.app/nxdev/issue/NXC-4262/common-init-issues
**Branch:** `NXC-4262`
**Plan:** `.ai/2026-04-20/tasks/init-error-investigation.md`

Implements the five fixes from the `init-error-investigation.md` plan, driven
by the `nx init` error telemetry for 2026-04-01 → 2026-04-20 (26.2% error
rate, ~24% of starts concentrated in 6 buckets).

## Changes

| #   | Fix                                                                  | Files                                                                                                                       |
| --- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1   | Capture stderr on child-process failures + include tail in telemetry | `implementation/utils.ts`, `implementation/angular/legacy-angular-versions.ts`, `configure-plugins.ts`, `command-object.ts` |
| 2   | Make `./nx --version` warm-up non-fatal                              | `implementation/dot-nx/add-nx-scripts.ts`, `init-v1.ts`                                                                     |
| 3   | Angular version detection warns + falls through instead of throwing  | `implementation/angular/legacy-angular-versions.ts`                                                                         |
| 4   | Bail with friendly message if `cwd` is a system dir                  | `command-object.ts`                                                                                                         |
| 5   | Friendly error for invalid `package.json`                            | `init-v2.ts`, `init-v1.ts`                                                                                                  |

Unit tests added:

- `implementation/utils.spec.ts` — `runCapturingStderr` success + failure paths
- `command-object.spec.ts` — `detectSystemDirectory` (win32 + posix)

## Repro Steps

All repros assume a linked local build of the `nx` package. From this
worktree:

```bash
pnpm install && pnpm nx build nx
# creates packages/nx/dist; link or copy to repro fixture as needed
```

For quick repros, you can run the compiled CLI directly:

```bash
NODE=packages/nx/dist/bin/nx.js
```

---

### Fix 1 — stderr capture on child-process failures

**Telemetry buckets covered:** `UNKNOWN` "bare `./nx --version` fail, no
stderr" (397), `UNKNOWN` empty errorMessage (217), `PACKAGE_INSTALL_ERROR`
bare `{npm,pnpm,yarn} install` fail (287 combined). ~22% of starts.

**Root cause:** `runInstall` and related child-process helpers used
`execSync` with `stdio: ['ignore', 'ignore', 'inherit']`. Node's
`child_process` only captures `error.stderr` / `error.stdout` when the
respective stream is `'pipe'` — with `'inherit'` they stream directly to the
terminal and are not available on the thrown error. Telemetry therefore
received `Command failed: npm install` with no context.

**Repro (before fix):**

```bash
mkdir /tmp/init-repro-fix1 && cd /tmp/init-repro-fix1
echo '{"name":"demo","dependencies":{"definitely-not-a-real-package-xyzqwe":"99.99.99"}}' > package.json
# Run init with the OLD code path:
git stash && node $NODE init --no-interactive
# Observed: process crashes with "Failed to install dependencies:" and no stderr body;
# telemetry receives errorMessage="Command failed: npm install" with no diagnostic.
git stash pop
```

**Repro (after fix):**

```bash
node $NODE init --no-interactive
# Observed: the bogus-package install error from npm/pnpm/yarn is emitted to
# stderr AND included in the thrown error message. Telemetry receives
# errorMessage="Failed to install dependencies (exit code N): <cmd> | stderr: ...npm ERR! 404 Not Found ...".
```

**Unit test:** `utils.spec.ts > runCapturingStderr > attaches stderr, stdout, and exit code to the thrown error`.

---

### Fix 2 — `./nx --version` warm-up is now non-fatal

**Telemetry bucket covered:** `UNKNOWN` "bare `./nx --version` fail, no
stderr" — 9.8% of all starts by itself.

**Root cause:** Two call sites bootstrap the dot-nx wrapper by invoking
`./nx --version` (or `runNxSync('--version')`) right after writing the
wrapper files. If that bootstrap fails (network blip, missing shell on
Windows elevated cmd, sandboxed FS), the whole `nx init` aborts with a
useless `Command failed: ./nx --version` error even though the wrapper is
already on disk and would bootstrap fine on next invocation.

Sites:

- `implementation/dot-nx/add-nx-scripts.ts:68`
- `init-v1.ts:116`

**Repro (before fix):**

```bash
mkdir /tmp/init-repro-fix2 && cd /tmp/init-repro-fix2
# Simulate a failing warm-up: make node unavailable to the child (shell on
# Unix will refuse to exec `./nx`). Use an empty PATH so `command -v node`
# fails in the generated shell script:
PATH= node $NODE init --no-interactive --useDotNxInstallation
# Before: init crashes near the end with "Command failed: ./nx --version"
# and telemetry records UNKNOWN.
```

**Repro (after fix):**

```bash
PATH= node $NODE init --no-interactive --useDotNxInstallation
# After: init finishes successfully, wrapper files are on disk,
# next `./nx` invocation bootstraps `.nx/installation`. No telemetry error.
# With NX_VERBOSE_LOGGING=true, a single warning line is printed.
```

---

### Fix 3 — Angular version detection warns instead of throwing

**Telemetry bucket covered:** `UNKNOWN` "Could not determine the existing
Angular version" — 82 events / 2.0% of starts.

**Root cause:** `getLegacyMigrationFunctionIfApplicable` throws if
`@angular/core` cannot be resolved from the workspace root. This is the
common case for `ng new` projects where `npm install` has not run yet. The
throw aborts `nx init` even though the modern Nx flow would work fine.

**Repro (before fix):**

```bash
mkdir /tmp/init-repro-fix3 && cd /tmp/init-repro-fix3
cat > angular.json <<'JSON'
{ "$schema": "./node_modules/@angular/cli/lib/config/schema.json", "version": 1, "projects": {} }
JSON
cat > package.json <<'JSON'
{ "name": "ng-demo", "dependencies": { "@angular/core": "^19.0.0" } }
JSON
# No node_modules — @angular/core isn't resolvable.
node $NODE init --no-interactive
# Before: crashes with "Could not determine the existing Angular version" → UNKNOWN telemetry.
```

**Repro (after fix):**

```bash
node $NODE init --no-interactive
# After: prints a warning and continues with the latest Nx flow.
# A user with an older Angular can still run `npm install && nx init`
# if they want the legacy path.
```

---

### Fix 4 — Windows system dir guard

**Telemetry bucket covered:** `EPERM` on `C:\Windows\nx.json` — 12 events.

**Root cause:** An elevated `cmd`/PowerShell starts in `C:\Windows\System32`.
`npx nx init` then tries to write `nx.json` there and crashes with EPERM.
Same issue on macOS/Linux when a shell opens at `/` or `/System`.

**Repro (before fix) — macOS/Linux analogue:**

```bash
# Simulate running init at filesystem root
cd / && node $NODE init --no-interactive || echo "exit $?"
# Before: crashes writing nx.json with EACCES/EPERM deep inside the stack
# and telemetry records UNKNOWN with a stack-trace-ish message.
```

**Repro (after fix):**

```bash
cd / && node $NODE init --no-interactive
# After: bails immediately with:
#   nx init: refusing to initialize an Nx workspace inside /.
#   Please change into your project directory first (e.g. `cd path/to/your/project`) and re-run `nx init`.
```

**Unit test:** `command-object.spec.ts > detectSystemDirectory` covers
`C:\Windows`, `C:\Program Files`, `/`, `/System`, plus happy paths.

---

### Fix 5 — Friendly error for invalid `package.json`

**Telemetry bucket covered:** `ValueExpected` / `CommaExpected` JSON parse
errors on existing `package.json` — ~17 events / 0.3% of starts.

**Root cause:** `readJsonFile('package.json')` throws a raw parser error
when the file is empty or malformed. The user sees e.g.
`ValueExpected in JSON at 0:0` with no indication of which file or how to
fix it.

**Repro (before fix):**

```bash
mkdir /tmp/init-repro-fix5 && cd /tmp/init-repro-fix5
: > package.json   # zero-byte package.json
node $NODE init --no-interactive
# Before: crashes with "ValueExpected at 0:0" or similar; telemetry: UNKNOWN.
```

**Repro (after fix):**

```bash
node $NODE init --no-interactive
# After:
#   Your `package.json` is not valid JSON and cannot be parsed.
#     <parser message>
#   Fix the syntax errors in `package.json` and re-run `nx init`.
```

Telemetry errorMessage now includes `is not valid JSON and cannot be parsed`
so the bucket is identifiable.

---

## Execution plan mapping

Following the `init-error-investigation.md` execution order:

1. **Fix 1** — ships biggest telemetry win; stderr on every failure path.
2. **Fix 2 + Fix 3** — paired graceful-degradation changes (UNKNOWN bucket).
3. **Fix 4 + Fix 5** — low-priority user-facing polish for long-tail errors.

All five are bundled together here because the diffs are small, touch the
same files, and share regression coverage.

## Verification

- `pnpm nx run-many -t build,lint -p nx` — green.
- `pnpm nx test nx -- --testPathPatterns='(init/implementation/utils.spec|command-line/init/command-object.spec|init/init-v2.spec)'` — 30/30 pass, includes 2 new tests for `runCapturingStderr` and 6 parameterised cases for `detectSystemDirectory`.

Post-release, re-run the `cnw-stats-analyzer` skill after 7 and 14 days and
check:

- Bucket #1 (bare `./nx --version`) disappears entirely.
- Bucket #4 (Angular version) disappears (Fix 3).
- Buckets #2, #3, #5, #6 either shrink or reveal new patterns through the
  newly-captured stderr tails, which will inform the next wave.
