# Summary - 2026-08-05

## NXC-4687: CNW `--preset empty` escape hatch + template download errors - MERGED #36508

PR https://github.com/nrwl/nx/pull/36508 merged as `4a63dc82af` (23.1.0 sandbox-egress regression, high priority).

Polygraph session `zesty-eagle-2a40a186`, single repo nrwl/nx - https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/zesty-eagle-2a40a186

- Bug fix: `invalidPresetToTemplateMap` coerced `--preset empty` INTO the `nrwl/empty-template` github download. Now aliases to the `ts` preset (npm-only `nx new`) via exported `applyEmptyPresetAlias`, and wins over `--template` so agents appending the flag to a failed command escape the download. Ordering-safe by construction: alias mutates only argv, the AI legacy-preset map reads rawArgs.
- Error taxonomy: 404 = missing repo/branch (TEMPLATE_CLONE_FAILED), everything else (thrown fetch, 403 sandbox proxies, 407/429/5xx) = NETWORK_ERROR, with `--preset=empty` guidance in the message, AI hints, and the pre-flight template-required output.
- Security: strict `^nrwl\/[\w.-]+$` slug check closed a pre-existing traversal (`nrwl/../evil` reached an arbitrary org's tarball and ran its install scripts).
- Evidence base: create-* CLI survey (vite/next/t3/sv/vue bundle templates; expo/CRA publish npm packages; turbo/astro/remix hard-fail on github), 7-day error export (55 download errors/week, 403s = sandbox proxies), and root-cause history (pre-23.1.0 `git clone` honored HTTPS_PROXY, Node fetch does not - proxy-allowlist sandboxes broke at the client swap, 0 -> 87 NETWORK_ERROR/day).
- Process: v1 auto-fallback (template -> preset + telemetry) rejected by Jack - presets and templates generate different things. Two deep review rounds; all required findings fixed (hint dead-end with --template, reachability overclaim, 403-only classification, alias extraction after a deletion-mutation would have routed `empty` to third-party npm install of `empty@0.10.1`, spec typecheck TS2345). Not in scope: the non-interactive no-flag default still requires github.com (fails with guidance now); noted in PR body.

Removed from Active Claude Sessions: `/Users/jack/projects/nx-worktrees/NXC-4687` (merged today).

## Other sessions today (see their task files)

- **Review PR #36567** (minimatch -> picomatch, `dot_ai/2026-08-05/tasks/review-pr-36567.md`): two merge-blocking negative-glob regressions found (tree-aware glob includes created files outside positive patterns; Jest plugin infers projects outside PM workspaces).
- **Review PR #36562** (`dot_ai/2026-08-05/tasks/review-pr-36562.md`): four actionable findings (docs-only gate, stale skill frontmatter name, shallow-sandbox merge-base command, conflicting severity mappings). Nothing posted to GitHub.
- **DOC-571: Update migration from Turborepo** (`dot_ai/2026-08-05/tasks/doc-571-update-migration-from-turbo.md`, Polygraph `shiny-finch-d0837b3c`): live-verified rewrite of the from-turborepo guide; found the old page documented `nx init` output that never existed (`continuous: true`), `#`-tasks skipped, per-package turbo.json ignored.
