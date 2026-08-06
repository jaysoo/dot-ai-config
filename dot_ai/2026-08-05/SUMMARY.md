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

## GitHub App organization permissions: docs accuracy + stale CLI hint - MERGED #36581

PR https://github.com/nrwl/nx/pull/36581 merged as `378526cd7f`. Plan: `dot_ai/2026-08-05/tasks/github-app-org-permissions-docs.md`. No Polygraph session.

- Accuracy fix: the `Administration` entry claimed it covered "listing every repository in the organization" for setup. Verified in ocean that repo listing goes through `GET /orgs/{org}/repos` and `GET /user/installations/{id}/repositories` - both `Metadata: read`. Only `GET /orgs/{org}/installations` needs org `Administration`. Moved the clause to the `Metadata` entry.
- Stale CLI hint (nrwl/ocean): `onboarding-remediation.ts:77` told users to grant `"Administration: Read & Write"`, which the GitHub App stopped requesting - dead end in app settings, then a support ticket. Now names `Contents: Read & Write` only. Fires on any 403 containing "permission" plus the 502 create-repository branch. Version plan added (remediation shipped 2026-04-01 #10587, so it's a fix against released prod code).
- STYLE_GUIDE pass caught four things vale can't see: a semicolon, the re-grant claim duplicated in two sections, a balanced-contrast + restatement closer in `Members`, and `org` vs `organization`. Each `When it's used:` line rewritten to add a fact rather than restate `Used for:`.
- Jack rejected two intro drafts. The AI tell he flagged: `claim because abstraction: list, list` - the reason clause says nothing alone and the colon dumps the real content after it. Final version leads with GitHub as the actor and ends on "organization permissions" so it hands off to the list below.
- PR merged mid-session, so master carries the v1 intro wording. Remaining 2-line delta committed on a fresh branch off `origin/master`: `docs/github-app-permissions-intro-wording` `61c35a9305`, unpushed. Ocean fix on `fix/onboarding-permission-hint` `b4faebb334`, unpushed, no PR.

## Other sessions today (see their task files)

- **Review PR #36567** (minimatch -> picomatch, `dot_ai/2026-08-05/tasks/review-pr-36567.md`): two merge-blocking negative-glob regressions found (tree-aware glob includes created files outside positive patterns; Jest plugin infers projects outside PM workspaces).
- **Review PR #36562** (`dot_ai/2026-08-05/tasks/review-pr-36562.md`): four actionable findings (docs-only gate, stale skill frontmatter name, shallow-sandbox merge-base command, conflicting severity mappings). Nothing posted to GitHub.
- **DOC-571: Update migration from Turborepo** (`dot_ai/2026-08-05/tasks/doc-571-update-migration-from-turbo.md`, Polygraph `shiny-finch-d0837b3c`): live-verified rewrite of the from-turborepo guide; found the old page documented `nx init` output that never existed (`continuous: true`), `#`-tasks skipped, per-package turbo.json ignored.
