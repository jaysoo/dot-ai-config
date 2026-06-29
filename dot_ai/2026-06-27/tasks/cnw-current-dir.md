# CNW: scaffold into the current directory (functionally-empty cwd)

Date: 2026-06-27
Branch: cwn-skip-normalization (off origin/master; one unrelated already-merged commit will be dropped/rebased)
Polygraph session: cnw-cwd-a6a02cfd

## Baseline (verified, contradicts task framing)

`npx create-nx-workspace .` ALREADY scaffolds in place on master (PRs #35083, #35281)
via `resolveSpecialFolderName('.')` -> {name: basename(cwd), workingDir: dirname(cwd)}.
Real gap: it requires a STRICTLY empty dir (`readdirSync(cwd).length > 0` -> throw).
A fresh GitHub repo has `.git` + README + LICENSE + .gitignore -> fails. That is the bug.

Two empty-dir guards block non-empty in-place:
1. CNW: `resolveSpecialFolderName` (bin/create-nx-workspace.ts:861)
2. `@nx/workspace:new` generator: `validateOptions` (packages/workspace/.../new/new.ts:128-136)

## Decisions (from Jack)

1. Tarball replaces git clone for ALL template usage (not just in-place).
   - Node built-in `fetch` (follows github -> codeload redirect) + `Readable.fromWeb`
     -> `createGunzip` (zlib) -> `tar-stream` extract, strip top-level `<repo>-<branch>/`.
   - NO axios (so axios can be dropped later). Only new dep: `tar-stream` (already root dep ~2.2.0).
   - URL: https://github.com/<org>/<repo>/archive/refs/heads/main.tar.gz ; fallback master on 404.
   - All 4 nrwl templates default to `main` (verified via API).
   - Benefits: no git needed, no `.git` collision in place, fixes fresh-machine/no-user/Copilot.
2. "Functionally empty" = every entry starts with `.` OR matches README* OR LICENSE/LICENCE*
   (any case/ext). Anything else (src/, package.json) -> error -> nx init.
3. Interactive: no-name + functionally-empty cwd -> prompt "Create in current directory?"
   Yes = in place; No = existing name prompt. Explicit `.`/`./` proceeds (no extra confirm).
   AI/CI: explicit `.` -> functionally-empty check -> in place (no prompt; AI forces interactive=false).

## Implementation

CNW (packages/create-nx-workspace):
- bin/create-nx-workspace.ts
  - add `isFunctionallyEmpty(dir)` helper (@visibleForTesting)
  - resolveSpecialFolderName: replace strict empty check with `!isFunctionallyEmpty(cwd)` throw
  - determineFolder: set `parsedArgs.useCurrentDir = true` for the `.` case (and the new prompt path);
    no-name interactive + functionally-empty -> `promptCreateInCurrentDir` (autocomplete Yes/No);
    Yes -> set workingDir=dirname(cwd), useCurrentDir=true, return basename(cwd) (only if basename valid).
- create-workspace-options.ts: add `useCurrentDir?: boolean`
- create-empty-workspace.ts (preset flow): strip useCurrentDir from nx-new args; when useCurrentDir,
  pass `skipEmptyDirCheck: true` to `nx new` (relaxes the generator guard).
- utils/template/clone-template.ts -> rewrite as tarball downloader (downloadTemplate):
  build tar.gz URL from `nrwl/<repo>`, fetch (main, fallback master), gunzip + tar-stream extract
  into target directory, strip top dir, overwrite files (README incl.). Drop existsSync guard
  (extract into existing cwd for in-place). No `.git` in tarball.
- create-workspace.ts: call downloadTemplate(options.template, directory); remove the post-clone
  `.git` removal (no longer needed).
- package.json: add `tar-stream` dep (+ @types/tar-stream dev at root if needed).

@nx/workspace new generator (packages/workspace/src/generators/new):
- schema.json + schema.d.ts: add internal `skipEmptyDirCheck` boolean.
- new.ts validateOptions: gate the "is not an empty directory" throw on `!options.skipEmptyDirCheck`.

## Tests
- bin spec: isFunctionallyEmpty; resolveSpecialFolderName (functionally-empty resolves, truly non-empty throws);
  determineFolder name='.' sets workingDir + useCurrentDir.
- new generator: skipEmptyDirCheck skips the empty-dir guard.
- downloadTemplate: unit test with in-memory tar-stream fixture + mocked fetch (offline).
- e2e/workspace-create: new current-dir test (non-interactive, empty + functionally-empty tmp dir).

## Review outcome (adversarial workflow, 11 confirmed -> all addressed)

- HIGH: stream errors bypassed CnwError (uncaught crash + hung promise on corrupt/truncated
  download). Fixed: extractTarball uses `node:stream/promises` pipeline; writeStream error
  destroys extract. + corrupt-gzip test.
- HIGH: e2e negative test asserted regex on execSync .message (stderr only) but CNW writes to
  stdout. Fixed: capture stdout/stderr + assert nx.json not created.
- LOW: isFunctionallyEmpty admitted a DIR named README/LICENSE. Fixed: withFileTypes + isFile().
- LOW: AI progress said "Cloning". Fixed: stage 'cloning' -> 'downloading'.
- Bonus regression found + fixed: removed obsolete `isGitAvailable` gate in determineTemplate
  (templates no longer need git).
- Added tests: corrupt gzip, zip-slip, symlink skip, fetch-reject->master fallback, interactive
  promptCreateInCurrentDir (Yes/No/not-empty), dir-named-README.
- Refuted (no action): symlink-skip is intended; non-ok response body unconsumed is moot for a
  one-shot CLI.

Final: build + test (CNW 134) + lint green; lockfile frozen OK; real GitHub smoke OK.

## Open / follow-ups
- AI messaging (ai-output.ts buildTemplateRequiredResult) could tell agents to pass `.` for in-place. (follow-up)
- master-branch fallback only; future templates with other default branches need the API tarball endpoint.
