---
name: cnw-templates-dep-audit
description: >
  Daily dependency-staleness audit for the CNW (Create Nx Workspace) template
  repos under ~/projects/cnw-templates/. Detects out-of-date deps (nx, @nx/*,
  AND third-party), applies safe upgrades within known compatibility
  constraints, verifies each repo (build/test/lint/typecheck/e2e), and opens
  one PR per repo that has updates. Use when "audit template deps", "check
  template dependencies", "update template deps", "template dep audit", or for a
  scheduled/daily run. Distinct from `cnw-update-templates` (which only nx-migrates
  the 4 base templates at the old flat paths).
---

# CNW Templates — Daily Dependency Audit

Check every CNW template repo for stale dependencies and open update PRs. Built
to run unattended on a daily schedule, but safe to run by hand.

## Scope

Template repos live at `~/projects/cnw-templates/<name>-template`. Push target is
`nrwl/<name>-template` `main`.

| Live on GitHub (PRs allowed) | Not yet on GitHub (audit + report only, NO push) |
| --- | --- |
| angular, astro-starlight, empty, express-api, nestjs, nextjs, react, react-mfe, remotion, tanstack-ai, tanstack-start, typescript | expo, fullstack, nuxt |

Re-derive the live set at runtime (don't trust this table): a repo is live if
`GET https://api.github.com/repos/nrwl/<name>-template/commits/main` returns a sha.

## Prerequisites

- A GitHub PAT with `repo` scope for the `nrwl` org. Read it from the environment
  (`$GH_TOKEN`) or 1Password (`op read ...`) — never hardcode, never commit. Log any
  `op`/remote-git call via the `op-request-reason` skill.
- Clean working tree per repo before starting (`git -C <repo> status --porcelain`
  empty). If dirty, skip that repo and report — do not stash/discard.
- Each repo currently builds green on `main` (this routine only proposes upgrades).

## 🚫 Hard constraints — do NOT "upgrade" these (they break the templates)

These were learned the hard way (2026-06-23). The audit must respect them or it
will reintroduce broken state:

1. **Node**: CI `node-version` stays **24**. Never 20 (EOL) or downgrade.
2. **Astro (astro-starlight)**: do NOT bump `astro` to 7+. `@astrojs/starlight`
   latest still peers `astro: ^6` — verify `npm view @astrojs/starlight peerDependencies`
   allows the target astro major BEFORE bumping astro. If Starlight still caps at 6, hold.
3. **TypeScript**: only these run on `~6.0.3` — astro-starlight, react-mfe, remotion,
   tanstack-ai, tanstack-start. Keep **`~5.9.2`** on express-api, nextjs, fullstack,
   nuxt, expo (playwright `import.meta.dirname` breaks under TS6), nestjs
   (`moduleResolution: node10` → TS5107), typescript-template (`baseUrl` → TS5101).
   Do not bump TS major on a 5.9 repo unless its blocker is independently fixed.
4. **tanstack-ai `@tanstack/ai` ecosystem**: capped by `@tanstack/ai-react-ui` (latest
   `0.8.9` anchors `@tanstack/ai` to the 0.32 line). Do NOT bump `@tanstack/ai`,
   `@tanstack/ai-anthropic`, `@tanstack/ai-react` ahead of what `ai-react-ui` resolves —
   bumping `ai-anthropic` to a version that peers `@tanstack/ai@^0.34` makes npm DROP
   `ai-anthropic` and breaks the chat. Only advance the whole set once `ai-react-ui`
   ships a release whose peers allow it. **Verify the INSTALLED version (`node_modules`),
   not the declared range** — peers can silently anchor a lower version while `npm ci` passes.
5. **@types/node**: `^24` for server/isomorphic repos only; don't add to browser-only SPAs.

When the latest of a constrained dep is newer than the cap, **log it as "held (reason)"**
in the report rather than upgrading.

## Process

### 1. Per repo, detect what's stale

```bash
cd ~/projects/cnw-templates/<repo>
npm outdated --json   # current vs wanted vs latest for every dep
npm view nx version   # latest nx (compare to installed)
```

Split findings into:
- **Nx set** (`nx`, `@nx/*`, `nx-cloud`) — upgrade together via `nx migrate`.
- **Third-party** — upgrade individually to `latest` unless a hard constraint applies.

### 2. Apply Nx upgrades (if behind)

```bash
CI=true npx nx migrate <latest-or-target>
CI=true npm install
[ -f migrations.json ] && CI=true npx nx migrate --run-migrations && rm -f migrations.json
```

### 3. Apply third-party upgrades (constraint-aware)

For each stale third-party dep NOT on the hard-constraint list, bump its range to the
new `latest` in the relevant `package.json`, then `npm install` to refresh the lockfile.
Bump peers together (e.g. a vite-plugin with its vite). For constrained deps, skip + log.

### 4. Verify (must pass before any PR)

```bash
NX_NO_CLOUD=true NX_DAEMON=false npx nx run-many -t build test lint typecheck --skip-nx-cache
# run e2e where the repo defines it
CI=true npx nx run-many -t e2e
npx prettier --write <changed package.json/lockfiles>   # keep nx format:check green
```

If verification fails, **revert that repo's changes** (`git checkout .`) and report the
failure — never open a red PR. (Note: angular's build can't be verified in the sandbox;
flag it for manual verification instead of pushing blind.)

### 5. Open one PR per repo with real, verified updates

Only if there are updates AND verification passed:

```bash
cd ~/projects/cnw-templates/<repo>
git checkout -b deps/update-<YYYY-MM-DD>
git add -A && git commit -m "chore(deps): update dependencies (<YYYY-MM-DD>)"
# log via op-request-reason, then:
git push -u origin deps/update-<YYYY-MM-DD>
# create PR via GitHub API (gh is BANNED):
curl -s -X POST -H "Authorization: Bearer $GH_TOKEN" -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/nrwl/<repo>/pulls" \
  -d '{"title":"chore(deps): update dependencies","head":"deps/update-<YYYY-MM-DD>","base":"main","body":"<the per-repo outdated table + what was upgraded vs held>"}'
```

PR body must list: deps upgraded (old → new), deps **held** (with the constraint reason),
and the verification result. For repos NOT live on GitHub, skip steps 5; just include them
in the report as "audited, not pushed (repo not created)".

### 6. Report

One summary covering all repos: per repo → upgraded / held / no-change / PR link / skipped.
Surface anything held so the owner knows an upstream is blocking (e.g. "astro 7 held —
Starlight still peers ^6").

## Scheduling it daily

This file IS the routine; trigger it once a day. Either:
- **Claude Code cron** (preferred): `/cron` a daily job whose prompt is "run the
  cnw-templates-dep-audit skill". Provide `$GH_TOKEN` in the cron environment.
- **OS scheduler**: a launchd/cron entry that runs `claude -p "run the
  cnw-templates-dep-audit skill"` headless with `GH_TOKEN` exported.

Keep it idempotent: if a `deps/update-<date>` branch/PR already exists for today, update
it instead of opening a duplicate.

## Notes / gotchas

- Inline `node -e` / `bash -c` with `!` mangles in fish — write scripts to a file and run them.
- `npm ci` passing does NOT prove the declared versions resolved — a peer can anchor a lower
  version silently. Always check `node_modules/<pkg>/package.json` for the real version.
- The 4 base templates' simpler nx-only update path also lives in `cnw-update-templates`
  (older skill, flat `~/projects/<x>` paths — superseded by this for the dep-audit use case).
