# CLOUD-4927: Frontend/Polygraph vulnerabilities - HIGH

Worktree: `~/projects/ocean-worktrees/CLOUD-4927` (branch `CLOUD-4927`)
Container issue with 20 CVE sub-issues, sourced from trivy scans of image tag `2607.27.0002`.
Draft PR: https://github.com/nrwl/ocean/pull/12656
Commit: `ce67755bdc` `fix(repo): clear high-severity npm advisories in the frontend images`
(rebased onto `532113a400`, Nicole's merged OTel PR #12631; was `6406bd3207` before the rebase)

## Method

Ticket version ranges are unreliable (predecessor session hit the same problem on CLOUD-4936).
Every range was re-verified against the GitHub advisory API:

```bash
curl -s "https://api.github.com/advisories?cve_id=CVE-2026-12151" | jq '.[0].vulnerabilities'
```

That caught one real miss: the ticket says undici is fixed in 6.26.0, the advisory and the
undici v6.27.0 release notes both say **6.27.0** ("v6.26.0 contains only the chunked-EOF fix").
We were sitting on 6.26.0 and would have shipped still-vulnerable.

Two scan surfaces exist per image, and they need different fixes:

1. **App `node_modules`** - pruned prod install from our lockfile. Fixed with `pnpm.overrides`.
2. **The globally installed npm** - `RUN npm install -g npm@11.18.0` in both Dockerfiles.
   npm vendors its own copy of sigstore/tar/minimatch/brace-expansion/undici. Only fixable by
   bumping the pinned npm version. This is why #12614 exists.

## Fixed in this commit

Mirrored into root, `apps/nx-cloud/package.json`, `apps/polygraph/package.json`.

| CVE | Package | Was | Now |
|---|---|---|---|
| CVE-2026-13149, CVE-2026-14257 | brace-expansion@1/2/5 | 1.1.13 / 2.0.3 / 5.0.6 | 1.1.18 / 2.1.4 / 5.0.9 |
| CVE-2026-59869 | js-yaml@4 | 4.2.0 | 4.3.0 |
| CVE-2026-12151 | undici | ^6.23.0 (-> 6.26.0) | ^6.27.0 (-> 6.28.0) |
| CVE-2026-4800 | lodash-es | 4.17.21 (no override) | 4.18.0 |
| CVE-2026-4867 | path-to-regexp@<0.1.13 | 0.1.12 (no override) | 0.1.13 |
| CVE-2026-48068, CVE-2026-48069 | @grpc/grpc-js | 1.14.3 (no override) | ^1.14.4 |
| - | apps/polygraph tar | 7.5.20 (drift) | 7.5.22 |

Notes:

- The three new overrides are all transitive-only, per the "no override without a transitive
  requirer" policy: `lodash-es` <- `dagre-d3-es`/`@napi-rs/cli`, `path-to-regexp@0.1` <- `express@4`,
  `@grpc/grpc-js` <- the OTel grpc exporters.
- `path-to-regexp` is scoped `@<0.1.13` so the 3.x/6.x/8.x copies (unaffected) stay put.
- `@grpc/grpc-js` uses `^1.14.4` rather than an exact pin so it does not fight the OTel bump.
  Worth noting after the rebase: #12631 merged and took OTel to stable 2.10.0 / experimental 0.221.0,
  and main *still* resolves `@grpc/grpc-js` 1.14.3. The override is doing real work, not a no-op.
- brace-expansion 1.1.18 and 2.1.4 do carry the CVE-2026-14257 `MAX_LENGTH` guard even though the
  advisory only names the 5.x line. Verified by unpacking each tarball and diffing for the guard.
  Behavior change is intentional: oversized expansions now throw instead of OOMing.
- `undici` is our only direct import of the changed set (`ProxyAgent`, `EnvHttpProxyAgent`, `fetch`
  in the two `util-external-request` libs and the polygraph CLI bundle). All stable v6 APIs, minor
  bump within the line.

## Already clear, no action

- **sigstore (CLOUD-4942)** - npm 11.18.0 vendors sigstore 4.1.1, which is the patched version.
  #12614 merged 2026-07-29, the scanned image is from 2026-07-27, so the finding predates the fix.
  `sigstore` is not in our lockfile at all.
- **picomatch, fast-xml-parser, tar, protobufjs, lodash** - already above the patched versions from
  CLOUD-4936 (#12575) and CLOUD-4926.

## Follow-ups

1. **turbo-stream 2.4.1 (CVE-2026-34077, CLOUD-4935) - Remix-blocked.** The ticket names
   `react-router 7.7.0-7.13.1`, but we are on react-router 6.30.4 and unaffected there. The advisory
   *also* covers `turbo-stream < 3.0.0`, and we resolve 2.4.1. `@remix-run/react@2.17.5` and
   `@remix-run/server-runtime@2.17.5` pin `turbo-stream` to **exactly 2.4.1**, and 3.0.0 is a
   breaking major. Clears with the Remix 2 -> React Router 7 migration, same blocker CLOUD-4936
   recorded for the react-router advisories.
2. **npm's vendored brace-expansion (CLOUD-4931/4932).** npm 11.18.0, 11.19.0, and even 12.0.2 all
   vendor brace-expansion 5.0.7, which is still vulnerable to CVE-2026-14257 (fixed 5.0.8). No npm
   release fixes this yet. Options: watch for an npm release that picks up 5.0.8+, or add a scoped
   rego ignorePolicy in cloud-infrastructure. Our own copy is fixed.
3. **OpenTelemetry (CLOUD-4944, CLOUD-4947)** - handled by Nicole's PR #12631 (OTel stable 2.10.0 /
   experimental 0.221.0), **merged 2026-07-30** and now the rebase base. Both sub-issues closed as
   Duplicate of CLOUD-4985, which is where that work is tracked under CLOUD-4936. #12631 still needs
   its manual `RUN_WITH_OTEL=true` smoke test; CI does not exercise the exporters and the failure
   mode is silent telemetry loss.
4. **Override drift in `apps/polygraph` is unguarded.** `tools/scripts/validate-pnpm-overrides.mjs`
   only compares root against `apps/nx-cloud`, yet `apps/polygraph` has its own overrides block,
   its own `nx prune` lockfile, and its own Dockerfile. That is how tar drifted to 7.5.20. Worth
   extending the validator to cover it.

## Verification

- `node tools/scripts/validate-pnpm-overrides.mjs` -> in sync (41 overrides)
- `CI=true pnpm install --frozen-lockfile --lockfile-only` -> exit 0
- `pnpm nx run-many -t typecheck -p nx-cloud,polygraph` -> 221 tasks pass
- Lockfile diff is 137 lines and touches only the intended packages, plus a `long@5.2.4` dedupe that
  grpc-js 1.14.4 brings with it.
- `THIRD_PARTY_LICENSES.txt` in `libs/nx-packages/owners` listed brace-expansion 5.0.6; version
  bumped by hand after confirming 5.0.9's LICENSE is byte-identical. `pnpm nx-cloud conformance`
  could not run locally (Nx Cloud PAT invalid in this sandbox), so CI has to confirm that gate.
  #12631 did not touch any licenses file, so this stays the only such change on the branch.

All of the above re-run clean after the rebase onto `532113a400`.

## Rebase notes

`pnpm-lock.yaml` was the only conflict; all three package.json files auto-merged. Resolved per the
CLAUDE.md rule - never `git checkout --theirs` the lockfile:

```bash
git checkout origin/main -- pnpm-lock.yaml && pnpm install --lockfile-only
```

The regenerated lockfile diff against the new main is the same 124 lines touching only the intended
packages. Pushed with `--force-with-lease` pinned to the old SHA, since `push_branch` runs
`git pull --rebase` and would have duplicated the rewritten commit. Remote tip verified by content,
not by SHA: `origin/CLOUD-4927` is `ce67755bdc`, sits directly on `532113a400`, 5 files changed.
