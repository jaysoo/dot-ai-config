# NXC-4687: CNW template download vs sandboxed envs (23.1.0 regression)

Date: 2026-07-29
Branch: `NXC-4687` (worktree `~/projects/nx-worktrees/NXC-4687`)
PR: https://github.com/nrwl/nx/pull/36508 (draft, commit `7f8fc9ace3`)
Polygraph: `zesty-eagle-2a40a186`

## Problem

23.1.0 made github.com egress a hard requirement for CNW:

- #35045: non-interactive default became `nrwl/empty-template`
- #36134: template download switched git clone -> fetch tarball, removed the `isGitAvailable()` escape hatch to the preset flow

Sandboxed AI agents (npm-only egress) hard-fail with NETWORK_ERROR: 87/day spike on 07-14, ~91% of 23.1.0 create errors, 88% AI agents, pure blocked egress. Full data in NXC-4649.

## Approach history

v1 (REJECTED by Jack): auto-fallback template -> preset equivalent + `templateFallbackPreset` telemetry. Rejected because presets and templates generate different things and presets are slated for removal; no silent switcheroo.

v2 (SHIPPED in PR): hint-driven, per Jack:

1. Bug fix: `normalizeArgsMiddleware`'s `invalidPresetToTemplateMap` coerced `--preset empty` INTO the `nrwl/empty-template` github download (the exact bug Jack remembered). Now `empty` normalizes to the `ts` preset (`nx new`, npm-only). Placement matters: AFTER the AI `legacyPresetToTemplateMap` block, else `ts` gets re-coerced to the template.
2. NETWORK_ERROR message (download-template.ts) + AI hints (ai-output.ts): github.com is not reachable, check network and sandbox configuration and try again, or run with `--preset=empty` and build on top. HTTP errors (404) keep old message, no hint.
3. HTTP 403 -> NETWORK_ERROR: 7-day data (`~/Desktop/cnw-errors.json`) showed TEMPLATE_CLONE_FAILED samples were all HTTP 403 (8/10 AI) = sandbox proxy refusing the host, not a missing repo. 403 now classified as blocked egress with the hint. Week totals: 1025 errors, 45 NETWORK_ERROR (4.4%) + 10 TEMPLATE_CLONE_FAILED (1.0%) = 5.4% download errors, ~31% AI.
4. Prior mechanism history (Jack asked): pre-23.1.0 was `git clone --depth 1` over HTTPS (never SSH), since 22.5.0 for AI agents. git honors HTTPS_PROXY; Node fetch does not - proxy-allowlist sandboxes worked under git, broke under fetch (0 -> 87/day on GA day). Possible follow-up: fetch tarball via axios (already a CNW dep, reads proxy env) for full git-era parity.

## Research: how other create-* CLIs source templates

- Bundled in npm package: create-vite (237/242 files), create-next-app default (235/238), create-t3-app (130/136), sv (57/69), create-vue (133/142).
- Templates as npm packages: create-expo-app (`expo-template-blank` etc.), CRA (`cra-template-*`).
- Runtime github fetch, hard fail offline, no fallback: create-turbo (pkg = 4 files), create-astro (giget), create-remix, create-next-app `--example`.
- giget has disk cache + offline/preferOffline but empty in fresh sandboxes; no proxy support.
- Takeaway: sandbox-safe tools ship templates via npm (bundled or published packages). Nobody does github-at-runtime gracefully.

## Verification

- `download-template.spec.ts`: NETWORK_ERROR (fetch throws) carries `--preset=empty` hint; TEMPLATE_CLONE_FAILED (HTTP 404) does not.
- Live negative control (packed CLI, fetch shim rejecting github.com, version pinned 23.1.0, `NX_CLOUD_API=http://127.0.0.1:9`): template flow -> NDJSON error with hints, exit 1; `--preset=empty` -> full `@proj/source` ts workspace, exit 0.
- `nx affected -t build-base,lint,test` green.
- Replaced pushed commit via `git fetch origin NXC-4687` + `git push --force-with-lease` (push_branch pull-rebase would conflict with amended history).

## Open follow-ups

- AI `legacyPresetToTemplateMap` still coerces explicit `ts`/`apps`/`react`/... presets to github templates; sandboxed agents need the error round-trip once. Remove?
- Long term: bundle default template in the package (create-vite/next pattern), or drop presets and make templates npm-distributed.
