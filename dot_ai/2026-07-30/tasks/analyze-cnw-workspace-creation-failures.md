# Analyze CNW workspace creation failures

## Goal

Analyze `~/Desktop/cnw-errors.json`, identify common
`WORKSPACE_CREATION_FAILED` signatures, distinguish actionable Nx defects from
environmental/repeated-user noise, and recommend easy fixes.

## Scope and evidence

- Source: `~/Desktop/cnw-errors.json`
- The export contains aggregated error codes with truncated sample messages.
- Treat counts as event counts, not unique users or independent failures.
- Strip npm notice/deprecation noise before classification.
- Keep generic package-manager wrapper failures separate from samples that
  expose a concrete root cause.

## Step 1: Validate and isolate the data

- [x] Confirm the JSON structure and locate `WORKSPACE_CREATION_FAILED`.
- [x] Record total, human/AI split, sample count, date range, and version mix.

## Step 2: Classify common signatures

- [x] Normalize ANSI, npm noise, paths, and repeated wrapper text.
- [x] Group concrete root causes and generic/truncated failures.
- [x] Check concentration by Nx version and repeated machine/path signatures.

## Step 3: Assess fixability

- [x] Map high-frequency concrete signatures to the relevant CNW/Nx source.
- [x] Separate likely Nx fixes, telemetry improvements, upstream issues, and
      local environment problems.
- [x] Rank easy fixes by likely impact and confidence.

## Step 4: Report

- [x] Summarize common errors with counts and caveats.
- [x] Recommend specific next actions and focused validation.
- [x] Keep track of implementation/execution progress in this plan.

## Findings

- Aggregate: 507 failures, 438 human and 69 AI. The file does not include the
  aggregate date range.
- Detail is capped at the 100 newest samples (2026-07-29 04:57 ET through
  2026-07-30 08:21 ET). Seventy-nine are Nx 23.1.0.
- The sample message field is capped at 300 characters. Fifty-four samples hit
  the cap.
- Opaque output dominates: 48 generic pnpm install wrappers plus 21 samples
  whose first 300 characters contain only npm warnings/no usable cause.
- Concrete recurring signatures:
  - 7 `ts.readConfigFile is not a function` events from two apparent
    environments. Fixed on master by merged PR #36497.
  - 7 npm `ERESOLVE` warning prefixes across four apparent environments, but
    the actual terminal error is beyond the export cutoff.
  - 3 plugin-worker timeouts across two apparent environments.
  - 3 unsupported Node/npm/Angular engine failures.
  - Single occurrences of `nx/bin/nx` missing, `WorkspaceContext is not a
    constructor`, ignored pnpm install scripts, a local registry refusal, and
    a nested duplicate-project-name failure.
- Retry concentration is material: several paths repeat four or five times.
- Prior NXC-4571 evidence found pnpm no-TTY accounted for about 13% of 442 WCF
  events. Its tested `CI=true` child-env fix exists in local commit
  `5e63fc7cb8` but is not on master.
- `execAndWait` keeps stdout and stderr in `error.log`, but chooses stderr alone
  for the thrown/telemetry message whenever stderr is non-empty. This explains
  why package-manager details can disappear behind the Nx command wrapper.

## Ranked next actions

1. Ship the already-tested pnpm no-TTY fix after confirming the current opaque
   samples contain `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`.
2. Fix observability: capture a bounded, noise-stripped stderr+stdout tail or a
   structured package-manager cause. Update the export to include the tail plus
   preset, package manager, Node version, and AI flag.
3. Ensure the merged TypeScript 7 preset pin reaches the next 23.1 patch or
   current release channel.
4. Add a clearer preset-specific Node compatibility error for Angular engine
   failures; lower impact than the pnpm/TypeScript clusters.

## Expected outcome

A concise, evidence-backed shortlist of common failure causes and the easiest
high-value fixes, without overstating conclusions from truncated telemetry.
