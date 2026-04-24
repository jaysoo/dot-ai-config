---
name: nx-config-cache-check
description: Validate Nx project config changes for cache input/output misalignments. Auto-trigger when project.json, package.json targets, or nx.json targetDefaults/namedInputs are modified. Also trigger on "check cache config", "validate inputs outputs".
---

# Nx Config Cache Alignment Check

Validate that changes to Nx project configurations don't introduce cache input/output misalignments.

## When to Run

- After modifying `project.json`, `package.json` (targets section), or `nx.json` (targetDefaults, namedInputs)
- During PR review when config files are in the diff
- When asked to check cache configuration

## Background: The Stale Cache Bug

A cacheable target's `inputs` control when the cache hash changes. Its `outputs` control what gets restored on a cache hit. If a target:

1. Declares an output file that is ALSO produced by a dependency task (e.g., `build` declares a `.js` file that `build-base` compiles)
2. Has inputs too narrow to detect source changes

Then on a false cache hit, Nx restores the stale output file OVER the fresh one produced by the dependency. The dependency ran correctly, but the parent's cache restore overwrites its work.

This is only a problem when ALL of these are true:

- The target has `"cache": true` (explicitly or via targetDefaults)
- The target's `inputs` are too narrow (missing source files that affect its outputs)
- The target's `outputs` overlap with a dependency target's outputs

If the target's outputs DON'T overlap with dependency outputs (e.g., only a README.md), narrow inputs are harmless -- the cache restore won't overwrite anything important.

## Process

### 1. Identify Changed Config Files

```bash
git diff --name-only HEAD -- '**/project.json' '**/package.json' 'nx.json'
git diff --cached --name-only -- '**/project.json' '**/package.json' 'nx.json'
```

### 2. For Each Target With Custom `inputs`

Check for this dangerous pattern:

a. **Is the target cacheable?** Check for explicit `"cache": true` on the target, or inherited from `targetDefaults` in `nx.json`.

b. **Do the outputs overlap with a dependency's outputs?** Look at `dependsOn` (on the target or in `targetDefaults`). If a dependency produces files that this target also lists in `outputs`, there's overlap risk.

c. **Do the inputs cover all source files that affect the overlapping outputs?** If the target lists a compiled `.js` file as output, the inputs must include the `.ts` source that produces it (and any scripts that modify it like `replace-versions.js`).

### 3. Using `dependentTasksOutputFiles` for Dependency Outputs

When a target reads files produced by a dependency task (e.g., `build` reads compiled `.js` from `build-base`), use `dependentTasksOutputFiles` as the input — NOT the original source file. This is semantically correct: the target reads the compiled output, not the source.

```json
"inputs": [
  "copyReadme",
  { "dependentTasksOutputFiles": "**/bin/create-nx-workspace.js" },
  "{workspaceRoot}/scripts/replace-versions.js"
]
```

This also resolves sandbox violations ("unexpected read") since the dependency output is now declared as an input.

Key points:

- Use `"transitive": true` if the dependency output itself depends on further upstream outputs
- The glob pattern should be specific enough to match only the relevant files
- This is the ONLY correct way to declare inputs from dependency outputs — don't use the `.ts` source path as a proxy

### 4. Specific Checks

For each target with custom inputs:

- **Narrow inputs + broad outputs = danger**: If `inputs` only watch config/metadata files but `outputs` include compiled code, flag it.
- **`run-commands` targets that modify compiled output**: Targets using `replace-versions.js`, `chmod`, or similar post-processing that list the processed file as output MUST use `dependentTasksOutputFiles` to track the compiled file they read/modify.
- **namedInput overrides**: If a target uses a namedInput (e.g., `"copyReadme"`) that doesn't include source files, but the target's outputs include compiled source, flag the mismatch.
- **targetDefaults changes**: If `inputs` or `outputs` are changed in `targetDefaults`, check ALL projects that inherit those defaults for new misalignments.
- **Sandbox violations**: If sandbox analysis shows "unexpected read" of a file in `dist/`, the target needs a `dependentTasksOutputFiles` input for that file.

### 4. Validate Dependency Chains

For targets with `dependsOn`:

- List what each dependency produces (its outputs)
- List what this target claims as outputs
- Flag any overlap where the parent's inputs wouldn't detect changes to the overlapping files

### 5. Report

```
## Cache Config Check

### [project:target]
- Cacheable: yes/no
- Inputs: [list]
- Outputs: [list]
- Dependencies: [list with their outputs]
- Output overlap: [which files are produced by both this target and a dependency]
- Input coverage: OK / MISSING [list of source files not covered]

### Issues Found
1. [project:target] - outputs overlap with [dep:target] on [file], but inputs don't track [source file]
```

## Real-World Example

`create-nx-workspace:build` had:

- `inputs: ["copyReadme"]` (only README files and copy scripts)
- `outputs: ["dist/.../bin/create-nx-workspace.js", "dist/.../README.md"]`
- Dependency `build-base` also produces `dist/.../bin/create-nx-workspace.js` via tsc

Result: source changes didn't invalidate `build`'s cache. On cache hit, the stale `.js` was restored over `build-base`'s fresh compile.

Fix: use `dependentTasksOutputFiles` to track the compiled `.js` from `build-base`, plus the post-processing scripts:

```json
"inputs": [
  "copyReadme",
  { "dependentTasksOutputFiles": "**/bin/create-nx-workspace.js" },
  "{workspaceRoot}/scripts/replace-versions.js",
  "{workspaceRoot}/scripts/chmod.js"
]
```
