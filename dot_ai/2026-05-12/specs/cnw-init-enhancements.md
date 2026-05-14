# Spec: `nx init` Cloud + CI Augmentation Enhancements

**Date:** 2026-05-12
**Author:** Jack Hsu
**Linear tickets covered (single PR):**

- [NXC-4311](https://linear.app/nxdev/issue/NXC-4311) — Augment CI during init so it uses Nx (without Cloud)
- [DOC-492](https://linear.app/nxdev/issue/DOC-492) — Agents should more strongly suggest Cloud when init is run
- [NXC-4367](https://linear.app/nxdev/issue/NXC-4367) — Don't hardcode `nxCloud=false` default for AI agents in init

**Polygraph session:** https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/cnw-init-enhancements-198c0f4a

---

## 1. Goal

Move the AI-driven `nx init` cloud yes-rate from 0% (Apr 2026 baseline: 0/377) toward CNW's 85% AI yes-rate, while also planting seeds for Nx-aware CI even when users don't connect Cloud. Delivery vehicle is a single new artifact written by `nx init`: `NEXT_STEPS.md` at repo root.

Estimated upside (NXC-4367): ~916 additional Cloud opt-ins/month from init at parity with CNW.

## 2. Scope

In scope:

- New `NEXT_STEPS.md` written at repo root by `nx init` (existing-repo path).
- CI platform detection driving NEXT_STEPS.md content.
- Removal of the AI-mode `nxCloud=false` hardcode in `init-v2.ts`.
- CLI banner pointing to the file with an agent-ready prompt.
- Init telemetry additions (N1-N4).

Out of scope (follow-ups):

- `create-nx-workspace` (CNW) does NOT emit `NEXT_STEPS.md`. CNW already controls its `README.md` generation and ships cloud guidance there.
- Touching the user's `CLAUDE.md`, `.cursor/`, or any pre-existing agent rule files (same rationale as not touching user's `README.md`).
- Funnel attribution telemetry (N5: `nx connect` correlated to a prior init session). Separate ticket.
- Net-new CI generators beyond the existing `@nx/workspace:ci-workflow`.

## 3. Artifact: `NEXT_STEPS.md`

### 3.1. Location + lifecycle

- Written to **repo root** as `./NEXT_STEPS.md`.
- First line of the file is a marker HTML comment: `<!-- nx-init-artifact -->`. This is the ownership signal used by rerun logic (3.2) and by the agent's housekeeping step.
- Persists. The CLI banner AND the file's footer instruct the user/agent to delete when done. The banner directive is the load-bearing cue — agents follow stdout-borne instructions more reliably than file footers (Gemini #6).
- Not gitignored. If the user commits it, that is the user's choice.
- README is NOT touched (teams craft README intentionally; same rationale for not appending to user-authored agent rule files).

### 3.2. Rerun behavior

Marker-based overwrite policy (revises original E1):

1. If no `NEXT_STEPS.md` exists at repo root → write fresh.
2. If `NEXT_STEPS.md` exists AND first line is `<!-- nx-init-artifact -->` → overwrite (it's ours, freshest guidance wins).
3. If `NEXT_STEPS.md` exists AND first line is NOT the marker → assume user authored it. Write to `NEXT_STEPS_NX.md` instead and emit a warning in stdout naming both files. Apply the same marker policy to `NEXT_STEPS_NX.md` on subsequent reruns.

Generic filename + non-gitignored = risk of nuking user-authored docs; the marker check is the safety belt (Codex #10, Gemini #1).

### 3.3. Audience

Primary audience is an AI agent that the user hands the file to. Secondary audience is a human reading the file directly. Content must be machine-friendly (clear headings, copy-pasteable shell commands, no decorative prose) while remaining readable.

### 3.4. File structure (umbrella model — option A)

```markdown
<!-- nx-init-artifact -->

# Next Steps

Detected: <platform-list-or-"no CI workflow detected">

## 1. Speed up CI with Nx commands

<platform-specific run-many patterns; one subsection per detected platform>

## 2. Add Nx Cloud for remote cache + agents (Recommended)

Connect to Nx Cloud to speed up CI further:

- Remote cache: reuse task results across your team and CI runs
- Nx Agents: distribute tasks across multiple machines in parallel

Run: `<pm-exec> nx connect`

---

Delete this file once you've completed the steps above.
```

`<pm-exec>` is rendered using `getPackageManagerCommand()` so pnpm users see `pnpm exec`, yarn users see `yarn`, npm users see `npx`, bun users see `bunx`. Applies to every `nx ...` command in the file (Codex #7).

### 3.5. Section 1 — CI augmentation

Goal: get users running CI commands through `nx run-many` so Nx is on the critical path even before Cloud is connected. **Use `nx run-many` not `nx affected`** — affected requires `nrwl/nx-set-shas` (or equivalent) wiring, which adds setup friction the agent shouldn't be asked to handle in a first pass.

Section 1 includes a short caveat line above the per-platform subsections (Gemini #5):

> `run-many` runs every project on every CI run. Once you've wired SHA tracking (e.g. `nrwl/nx-set-shas` for GitHub Actions), switch to `nx affected` for faster CI.

Section 1 also includes a verification line above the subsections (Codex #8):

> Before adopting these commands, confirm the target names (`test`, `lint`, `build`, etc.) exist in your project graph by running `<pm-exec> nx show projects --target=test`.

Detected platforms are emitted as subsections in this priority order:

1. GitHub Actions
2. GitLab CI
3. Azure Pipelines
4. Bitbucket Pipelines
5. CircleCI
6. Jenkins

**Multi-platform handling:** if two or more platforms are detected, emit a subsection for each (M1). Agent reads both and reconciles against the user's actual CI usage.

**Detection paths (scanned at repo root only, no recursion):**

| Platform        | Paths                                                                       |
| --------------- | --------------------------------------------------------------------------- |
| GitHub Actions  | `.github/workflows/*.yml`, `.github/workflows/*.yaml`                       |
| GitLab CI       | `.gitlab-ci.yml`                                                            |
| Azure Pipelines | `azure-pipelines.yml`, `.azure-pipelines.yml`, `azure-pipelines/*.yml`      |
| Bitbucket       | `bitbucket-pipelines.yml`                                                   |
| CircleCI        | `.circleci/config.yml`                                                      |
| Jenkins         | `Jenkinsfile` (case-insensitive)                                            |

If any matching file is found, the platform counts as detected.

**Per-platform subsection template (example for GitHub Actions):**

````markdown
### GitHub Actions (`.github/workflows/<file>.yml`)

Replace direct script invocations with `nx run-many` so Nx runs and caches your tasks.

Before:

```yaml
- run: npm test
- run: npm run lint
- run: npm run build
```

After:

```yaml
- run: <pm-exec> nx run-many -t test
- run: <pm-exec> nx run-many -t lint
- run: <pm-exec> nx run-many -t build
```
````

Same template for the other platforms with platform-appropriate syntax (GitLab job script, Azure steps, Bitbucket step script, CircleCI job steps, Jenkinsfile stage).

**Jenkins note (Codex #6):** Jenkins is detected and gets an augmentation subsection like the others, but the `@nx/workspace:ci-workflow` generator does NOT support Jenkins (see `packages/workspace/src/generators/ci-workflow/schema.json`). The greenfield branch (see below) cannot generate Jenkins; if Jenkins is the only platform user wants and detection finds nothing, the greenfield section instead points the agent at the generator's supported list (`github`, `circleci`, `azure`, `bitbucket-pipelines`, `gitlab`) and notes Jenkins users must hand-author.

**Greenfield branch (no platforms detected):** section 1 collapses to:

```markdown
## 1. Generate a CI workflow

No CI workflow detected. Generate one with:

`<pm-exec> nx g @nx/workspace:ci-workflow --ci=github --name=ci --useRunMany=true`

Supported `--ci` values: `github`, `circleci`, `azure`, `bitbucket-pipelines`, `gitlab`. Pass `--ci=<your-platform>` to match your provider. Jenkins is not supported by this generator; hand-author a `Jenkinsfile` using the same `nx run-many` pattern.
```

The generator's `schema.json` requires `--ci` and `--name`; bare `nx g @nx/workspace:ci-workflow` hangs/fails in non-interactive AI mode (Codex #5). `--useRunMany=true` keeps generated workflows aligned with the run-many recommendation in this spec.

### 3.6. Section 2 — Cloud

Variant selection is driven by **cloud connection state**, not just by the `--nxCloud` flag. Detection logic (Codex #4, Gemini #4):

1. Read `nx.json` after init completes. If `nxCloudId` or `nxCloudAccessToken` is present → workspace is connected (covers both `--nxCloud yes` on this run and pre-existing connection from a prior run).
2. Otherwise → not connected.

Variants:

**Not connected (the common case after NXC-4367 lands):**

```markdown
## 2. Add Nx Cloud for remote cache + agents (Recommended)

Connect to Nx Cloud to speed up CI further:

- Remote cache: reuse task results across your team and CI runs
- Nx Agents: distribute tasks across multiple machines in parallel

Run: `<pm-exec> nx connect`
```

**Connected:**

```markdown
## 2. Nx Cloud connected

Your workspace is connected to Nx Cloud. Next:

- Invite your team at the Nx Cloud workspace URL printed during `nx connect`
- Add `NX_CLOUD_ACCESS_TOKEN` to your CI environment so CI runs benefit from remote cache and agents
```

We **do not** template a specific `<cloud-workspace-url>` here. Sourcing it reliably would require either changing `initCloud()` in `packages/nx/src/command-line/init/implementation/utils.ts` to return URL/token metadata to callers, or re-reading and parsing it from `nx.json` post-connect. Both add scope; the connect command already prints the URL to stdout during init. Spec defers URL templating to a follow-up.

(C3 — two variants, no dead "you're already connected" wall of text.)

### 3.7. No section 3

Decision: drop the "agent rules" section (S3). DOC-492's "stronger suggestion" surface is `NEXT_STEPS.md` itself + the CLI banner pointing the agent at it. We do not touch the user's `CLAUDE.md` / `.cursor/` / existing rules (R3).

Rule template updates for CNW-generated rules are out of scope here — separate ticket if needed.

## 4. CLI banner

At the end of a successful `nx init` run that wrote `NEXT_STEPS.md`, print:

```
📋 Next steps written to NEXT_STEPS.md

Copy this prompt to your AI agent:
  Read NEXT_STEPS.md and help me set up my CI with Nx. Delete NEXT_STEPS.md when done.
```

If the rerun-policy fallback fired (existing user file detected, wrote `NEXT_STEPS_NX.md` instead), substitute the filename in both lines and add a leading line: `⚠️  NEXT_STEPS.md already exists and was not authored by nx init. Writing to NEXT_STEPS_NX.md instead.`

Banner appears in both interactive and non-interactive (AI agent) modes. It is the discovery mechanism — agents reading stdout see both the file path and the suggested prompt. The explicit delete directive in the prompt is load-bearing (Gemini #6): agents follow stdout instructions more reliably than file footers, so housekeeping needs to be in the prompt the user copies, not just inside the file.

## 5. NXC-4367 code change

This change has TWO call sites, not one. Both must land together (Codex #1).

### 5.1. Remove AI-mode `nxCloud` default

**File:** `packages/nx/src/command-line/init/init-v2.ts` (current location lines 169-173).

**Before:**

```ts
const aiMode = isAiAgent();
if (aiMode) {
  options.interactive = false;
  if (options.nxCloud === undefined) {
    options.nxCloud = false; // Default to skip Nx Cloud
  }
}
```

**After:**

```ts
const aiMode = isAiAgent();
if (aiMode) {
  options.interactive = false;
}
```

Per NXC-4367: do not force `true` either.

### 5.2. Fix `writeNxCloudRules` gate (CRITICAL companion change)

**File:** `packages/nx/src/command-line/init/init-v2.ts` (current location around line 431, inside `setupAiAgentsGenerator` call).

**Current code:**

```ts
setupAiAgentsGenerator(tree, {
  // ...
  writeNxCloudRules: options.nxCloud !== false,
});
```

**Problem:** Once 5.1 lands, AI mode without `--nxCloud` leaves `options.nxCloud === undefined`. `undefined !== false` is `true`, so cloud rules get written to the user's workspace. This directly contradicts R3 / section 7.6 (no touching agent rules).

**Fix:**

```ts
setupAiAgentsGenerator(tree, {
  // ...
  writeNxCloudRules: options.nxCloud === true,
});
```

Now cloud rules are only written when the user/agent explicitly opted in via `--nxCloud yes`. NEXT_STEPS.md remains the sole user-repo write surface for the "not connected" path.

### 5.3. Combined effect

In AI mode:

- `--nxCloud yes` passed → cloud connects, `writeNxCloudRules` true (matches CNW behavior).
- `--nxCloud no` passed → no cloud, no rules written, NEXT_STEPS.md emitted with "not connected" section 2.
- No flag → no cloud (non-interactive skips prompt), no rules written, NEXT_STEPS.md emitted with "not connected" section 2.

The third row is what unblocks the conversion funnel: agent reads NEXT_STEPS.md, runs `nx connect`, gets cloud.

## 6. Telemetry

Extend the existing init telemetry payload with:

| Key                              | Type       | Description                                                                                                                                |
| -------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `nextStepsEmitted`               | `boolean`  | True iff the file (`NEXT_STEPS.md` or the `NEXT_STEPS_NX.md` fallback) was successfully written to disk. False on render failure, write failure, or any early-return path that bypassed emission (Codex #3). |
| `nextStepsFallbackPath`          | `boolean`  | True if the rerun-policy fallback fired (existing user file detected, wrote `NEXT_STEPS_NX.md` instead).                                  |
| `ciPlatformsDetected`            | `string[]` | Detected CI platforms (subset of `github`, `gitlab`, `azure`, `bitbucket`, `circleci`, `jenkins`).                                       |
| `ciGreenfield`                   | `boolean`  | True if zero platforms detected.                                                                                                          |
| `nextStepsCloudSectionShown`     | `boolean`  | True if section 2 was emitted in the "not connected" variant (i.e. `nx.json` had neither `nxCloudId` nor `nxCloudAccessToken` post-init). |

Funnel attribution (N5 — correlate later `nx connect` to a prior init session) is **not** in this PR.

## 7. Implementation notes

### 7.1. Where to write the file

Emission must cover ALL `nx init` exit paths, not just the bottom of the JS/TS flow (Codex #2). `init-v2.ts` has early returns for Angular (current location ~line 199) and Turborepo (current location ~line 278). Adding emission at the very end of the function misses both.

**Approach:** extract emission into a helper `emitNextSteps(repoRoot, options)` and call it from EACH success-exit path:

- After Angular init completes (before its `return`).
- After Turborepo init completes (before its `return`).
- After the JS/TS path completes (current "end of function" location).
- Any other early-return success path discovered during implementation (audit `init-v2.ts` for all `return` statements inside the main `initHandler` body and confirm coverage).

If init throws or returns due to a failure, do NOT emit. `emitNextSteps` should be the last thing run on each success path; if it itself throws, swallow + warn (see 7.5).

### 7.2. Detection helper

New helper, e.g. `detectCIPlatforms(repoRoot: string): CIPlatform[]`, returning the platforms in priority order. Pure filesystem check, no parsing of file contents — existence is enough.

- Use synchronous `fs.existsSync` for the single-file paths.
- Use a single glob pass for `.github/workflows/*.{yml,yaml}` and `azure-pipelines/*.yml`.
- **Jenkinsfile case-insensitive match (Gemini #2):** `fs.existsSync('Jenkinsfile')` is case-sensitive on Linux. Implement with `fs.readdirSync(repoRoot)` + `.find(name => name.toLowerCase() === 'jenkinsfile')`. Do not rely on `existsSync` for Jenkins.
- Scope: repo root only, no recursion. Confirmed in section 3.5; Gemini #3 (subdir CI like `./ci/`) is intentionally out of scope — the agent can be told to look elsewhere if detection misses.

### 7.3. File rendering

A single function:

```ts
renderNextSteps(input: {
  detectedPlatforms: CIPlatform[];
  cloudConnected: boolean;
  packageManagerExec: string; // "npx" | "pnpm exec" | "yarn" | "bunx"
}): string
```

Pure — no I/O. Snapshot-testable.

Sections are conditionally concatenated. Output begins with the `<!-- nx-init-artifact -->` marker line, then a blank line, then the body. Trailing horizontal rule + delete-when-done footer.

`packageManagerExec` is derived from `getPackageManagerCommand()` and substituted everywhere `<pm-exec>` appears in section 3 templates.

### 7.4. Banner

Reuse existing CLI output helper (`output.log` / `output.success` — match existing init exit copy style). Banner block is single emit; do not split across multiple log calls.

### 7.5. Error handling

- Detection: any filesystem error during platform detection falls through to "no platforms detected" (greenfield branch). Do not throw — emitting a slightly-less-tailored NEXT_STEPS.md is strictly better than failing init.
- Cloud-state read: if `nx.json` is missing or unreadable post-init, fall through to "not connected" variant. Same rationale.
- Rerun-policy file read: if reading the first line of an existing `NEXT_STEPS.md` fails, treat as "not our marker" and use the `NEXT_STEPS_NX.md` fallback path. Be conservative — never clobber.
- Write: if neither `NEXT_STEPS.md` nor `NEXT_STEPS_NX.md` can be written (e.g., readonly FS), log a warning, set telemetry `nextStepsEmitted=false`, and continue. Init success does not hinge on the file being written.

### 7.6. No agent-rules writes

This PR does not write or modify `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/`, `nxCloudRules`, or any other agent rule file in the user's repo — UNLESS `--nxCloud yes` was explicitly passed, in which case `setupAiAgentsGenerator` writes its standard cloud rule set (see 5.2). The default no-flag and `--nxCloud no` paths write zero agent rule files. NEXT_STEPS.md remains the only artifact written by `nx init` in the no-cloud path.

## 8. Test plan

### 8.1. Unit tests

`renderNextSteps` snapshot tests covering:

1. GitHub Actions only, cloud not connected.
2. GitHub Actions only, cloud connected.
3. GitLab CI only, cloud not connected.
4. GitHub Actions + GitLab CI (verify priority ordering: GH section first).
5. All six platforms detected (verify all subsections emit in priority order).
6. Greenfield (no platforms), cloud not connected — verify section 1 is the `nx g ci-workflow` hint.
7. Greenfield, cloud connected.

`detectCIPlatforms` unit tests covering:

1. Each platform's canonical path in isolation.
2. Each platform's alternate path (Azure: `.azure-pipelines.yml` and `azure-pipelines/<file>.yml`).
3. `Jenkinsfile` case-insensitive match (`Jenkinsfile`, `jenkinsfile`, `JENKINSFILE`).
4. Empty `.github/workflows/` directory → not detected.
5. No CI files → empty array.
6. Filesystem error path (mocked `fs.existsSync` throwing) → returns empty array, does not throw.

### 8.2. Integration tests (init-v2)

1. `nx init` on a fixture with `.github/workflows/ci.yml` writes `NEXT_STEPS.md` containing the GitHub Actions subsection.
2. `nx init` on a fixture with no CI files writes the greenfield variant with `--ci=github --name=ci --useRunMany=true` in the generator command (Codex #5 regression guard).
3. `nx init --nxCloud yes` writes the "connected" variant of section 2 AND `setupAiAgentsGenerator` runs with `writeNxCloudRules: true` (Codex #1 regression guard).
4. `nx init` rerun where existing `NEXT_STEPS.md` starts with the marker comment → overwritten.
5. `nx init` rerun where existing `NEXT_STEPS.md` does NOT start with the marker → original file preserved, `NEXT_STEPS_NX.md` written instead, warning printed (Codex #10, Gemini #1).
6. AI-agent-detected run (set the env var `isAiAgent()` reads) WITHOUT `--nxCloud` flag → cloud is NOT auto-set to false anymore. Verify `options.nxCloud === undefined`, that NEXT_STEPS.md is emitted with the "not connected" section 2 variant, AND that `setupAiAgentsGenerator` runs with `writeNxCloudRules: false` (no `CLAUDE.md` / `.cursor/` writes — Codex #1 + Codex #9 regression guard).
7. Pre-existing cloud connection: fixture has `nx.json` with `nxCloudId` set; `nx init` run again without `--nxCloud` → section 2 emits the "connected" variant despite no flag (Codex #4 / Gemini #4 regression guard).
8. CLI banner appears in stdout with the expected copy-pasteable agent prompt line including the "Delete NEXT_STEPS.md when done" directive (Gemini #6).
9. Angular `nx init` path: fixture with Angular workspace marker → init takes the Angular early-return branch and STILL emits NEXT_STEPS.md (Codex #2 regression guard).
10. Turborepo `nx init` path: same, for the Turborepo early-return branch.
11. Package-manager-aware commands: fixture with `pnpm-lock.yaml` → emitted file uses `pnpm exec nx ...`, not `npx nx ...` (Codex #7 regression guard).

### 8.3. Telemetry tests

Verify `nextStepsEmitted`, `nextStepsFallbackPath`, `ciPlatformsDetected`, `ciGreenfield`, `nextStepsCloudSectionShown` are correctly populated for each of the scenarios in 8.2. Specifically:

- Scenario 5 (fallback path): `nextStepsEmitted=true`, `nextStepsFallbackPath=true`.
- Write-failure scenario (mock `fs.writeFileSync` to throw): `nextStepsEmitted=false`.
- Scenario 9/10 (Angular/Turborepo): `nextStepsEmitted=true` (regression guard for early-return coverage).

### 8.4. Manual verification

1. Run `nx init` in a fresh fixture repo with a GitHub Actions workflow. Open `NEXT_STEPS.md`. Hand the suggested prompt to Claude Code in that repo. Verify the agent reads the file and produces a sensible CI edit + `nx connect` suggestion, then deletes the file.
2. Repeat with no CI workflow. Verify agent runs the fully-flagged generator command (`nx g @nx/workspace:ci-workflow --ci=github --name=ci --useRunMany=true`) without hanging on prompts.
3. Repeat with `--nxCloud yes`. Verify section 2 is the connected variant AND no extra cloud rule files appear if they weren't already present (or are the expected `setupAiAgentsGenerator` output when they are).
4. Repeat with a fixture pre-connected to Nx Cloud (existing `nx.json` with `nxCloudId`) and no `--nxCloud` flag. Verify the connected variant is emitted (covers Gemini #4 in real flow).
5. Repeat on a pnpm workspace. Verify commands in `NEXT_STEPS.md` use `pnpm exec nx ...`.

## 9. Rollout / risk

- **Blast radius:** writes one new file to the user's repo root (or the `_NX` fallback). No existing files modified unless `--nxCloud yes` was passed (in which case `setupAiAgentsGenerator` writes its standard cloud rule set, same as today).
- **Reversibility:** user deletes the file. Behavior change in `init-v2.ts` is two small edits (drop AI-mode default + change `writeNxCloudRules` predicate); both can be reverted in a follow-up if AI yes-rate doesn't move.
- **Migration:** none needed — pure additive behavior plus a default removal.
- **Version target:** check `git tag | grep "<next-major>-beta" | sort -V | tail -1` at PR time and target latest beta + 1 for any migrations (there are none planned in this spec; if any get added during implementation, follow the standard migration-version rule).
- **Risk if shipped without agent rule updates:** AI init still defaults to skip cloud (same path as humans). NEXT_STEPS.md is the conversion lever; if the file is good enough, agents will pick up the section 2 nudge and propose `nx connect`. If it isn't, follow-up is a copy iteration on section 2.
- **Risk if the `writeNxCloudRules` gate change (5.2) is missed:** AI init writes cloud rule files into user repos without consent, contradicting R3 and likely triggering user complaints. Both 5.1 and 5.2 must land in the same PR.

## 10. Open follow-ups (not in this PR)

- Funnel attribution telemetry (N5).
- Update CNW-generated agent rule templates to recommend `--nxCloud yes` for greenfield work (NXC-4367 mentions this; CNW path is out of scope here).
- Consider a similar NEXT_STEPS.md (or equivalent inline README section) for CNW once this lands and we measure impact.
- Surface the Nx Cloud workspace URL in the "connected" section 2 variant — requires either changing `initCloud()` to return URL/token metadata or re-reading `nx.json` post-connect.
- Consider an L3.5 enhancement: actually parse the user's detected CI file and emit a tailored diff suggestion in section 1, not just a generic before/after pattern. Out of scope for v1.
- Shallow subdir CI detection (e.g. `./ci/`, `./scripts/ci/`) for legacy monorepos that hide pipeline logic outside the canonical locations (Gemini #3).

## 11. Commit / PR notes

- Single PR covering all three tickets. PR description references `NXC-4311`, `DOC-492`, `NXC-4367`.
- Commit scope: `feat(core)` or `feat(misc)` for the init-v2 changes; if the work splits cleanly, separate commits for (a) NEXT_STEPS rendering + CI detection, (b) init-v2 hardcode removal + `writeNxCloudRules` gate fix, (c) telemetry.
- Linear tickets stay the source of truth for context — PR body is minimal per Jack's PR style.
- Pre-push: `nx affected -t build-base,lint,test` covering `nx`, `workspace`, and any init-spec packages. Run targeted init integration specs first (`pnpm nx test nx -- --testPathPatterns=init`) before the broader affected run.
