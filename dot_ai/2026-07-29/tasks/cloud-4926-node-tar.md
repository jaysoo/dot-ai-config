# CLOUD-4926: Critical node-tar vulnerability

## Goal

Determine how CVE-2026-59873 reaches the Polygraph frontend, identify the
smallest safe remediation, and define proportionate verification for CLOUD-4926.

## Constraints

- Read the full Linear issue and primary vulnerability/advisory sources.
- Confirm the installed and resolved dependency paths; do not infer exposure
  from a scanner title alone.
- Prefer the narrowest dependency update that removes every vulnerable path.
- Keep track of implementation progress in this plan.
- Do not change product code or dependencies unless explicitly requested.

## Step 1: Establish advisory and issue facts

Reasoning: remediation depends on the affected version range, fixed release,
exploit preconditions, and whether the frontend actually exercises the
vulnerable API.

TODO:

- [x] Read CLOUD-4926 and confirm the Nx Cloud team/context.
- [x] Read NVD plus upstream npm/GitHub/node-tar advisories.
- [x] Record affected/fixed versions and exploit conditions.

## Step 2: Trace the dependency in this workspace

Reasoning: distinguish direct, production-transitive, build-only, and stale
lockfile occurrences before choosing an update mechanism.

TODO:

- [x] Locate all `tar` declarations and lockfile resolutions.
- [x] Use the installed image and Trivy to explain the vulnerable path.
- [x] Map the path to the Polygraph and Nx Cloud runtime images.
- [x] Check current branch changes to avoid confusing user work with baseline.

## Step 3: Select the remediation

Reasoning: prefer updating the nearest responsible direct dependency; use a
root package-manager override only when upstream constraints prevent a clean
resolution and compatibility has been checked.

TODO:

- [x] Compare base npm upgrade/removal with an application dependency change.
- [x] Check the upstream advisory and fixed release.
- [x] Define the runtime-image-only change required.

## Step 4: Define verification and rollout

Reasoning: security scans prove resolution, while targeted Nx tasks prove the
updated dependency does not break affected build/runtime paths.

TODO:

- [x] Define dependency-tree and image-scan assertions.
- [x] Identify the affected Nx package and Docker build targets.
- [x] Determine whether a focused extraction regression test is necessary.
      reachable in Nx-owned code.
- [x] Note deployment urgency and contextual exploitability.

## Findings

- GitHub's CNA rates this CVSS v4 9.2 Critical; NVD's CVSS v3.1 score is
  7.5 High. The vulnerable range is `tar <= 7.5.18`; `7.5.19` is fixed.
- The workspace and pruned application trees resolve `tar@7.5.20`, so no
  manifest or lockfile update is needed.
- `node:22-alpine3.23` currently contains
  `/usr/local/lib/node_modules/npm/node_modules/tar@7.5.11`. A local Trivy scan
  reproduces exactly one Critical CVE-2026-59873 finding in the base image.
- npm is unused in both final runtime stages. The branch's single commit
  `e7e4deed41` removes npm/npmx from both final images and replaces
  `npm run start` with the equivalent direct Node command.
- The direct command preserves `NODE_ENV`, `TZ`, and the SIGUSR2 heap-snapshot
  flag. A group-writable diagnostics directory makes that existing operation
  work for the fixed UID and OpenShift arbitrary-UID/root-group model.
- Preferred verification:
  1. `pnpm nx run nx-cloud:docker:build`
  2. `pnpm nx run polygraph:docker:build`
  3. scan `apps-nx-cloud` and `apps-polygraph` with Trivy and assert no
     CVE-2026-59873;
  4. assert npm/npx are absent, `node` starts the server, readiness succeeds,
     and SIGUSR2 can write a heap snapshot.
- Do not downgrade this as a false positive: the vulnerable package is present
  in the old image. Contextual exploitability is low because npm is not invoked
  by a request path, but removal and rapid redeployment are cheaper and safer
  than accepting the finding.

## Decision update

After review with Jack, prefer a contextual `not_affected` exception over the
Dockerfile change:

- The old image invokes `npm run start`, but that operation does not call
  node-tar's extraction/parsing paths.
- No attacker-controlled archive reaches npm's bundled
  `usr/local/lib/node_modules/npm/node_modules/tar`.
- The application's reachable node-tar installation is already `7.5.20`.
- Therefore the scanner correctly inventories a vulnerable package, but the CVE
  is not exploitable in this product. This is a VEX-style `not_affected`
  determination, not a claim that the package is absent.
- Preferred long-term expression: a VEX statement with justification
  `vulnerable_code_not_in_execute_path`.
- Practical Trivy expression: `.trivyignore.yaml` scoped to both the exact path
  and `pkg:npm/tar@7.5.11`, with a written statement and expiration date. A
  local Trivy run confirmed this suppresses only the intended finding and
  records it under `ExperimentalModifiedFindings`.
- The repository contains no Trivy configuration, so the exception must be
  installed where the production image scan is actually invoked; merely adding
  an unused ignore file here would not affect the reported scan.

## Expected outcome

A concise, evidence-backed recommendation for fixing CLOUD-4926, including the
preferred dependency change, fallback option, affected projects, verification
commands, and rollout risk.
