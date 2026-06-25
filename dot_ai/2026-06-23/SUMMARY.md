# 2026-06-23 Summary

## CNW Templates (NXC-3464) — hardening pass across the 15 template repos

Worktree: `~/projects/nx-worktrees/cnw-templates` (nx, branch `cnw-templates`). Template repos live at `~/projects/cnw-templates/<name>-template` and are pushed to `nrwl/<name>-template` `main` as a single "Initial commit" (force-push via SSH + a PAT). 12 repos are live on GitHub; **expo, fullstack, nuxt are committed locally but their `nrwl/*` repos do not exist yet** (can't push).

### Work done (spans the recent session, 2026-06-22 → 06-23)

- **CI workflows (all 15):** `node-version: 20 → 24` (20 is EOL); playwright templates use `npx playwright install --with-deps` (was `--only-shell`, which doesn't install browser system libs). Fixed real e2e breakages: stale default specs (`example.spec.ts` asserted "Welcome"; api-e2e asserted `{message:'Hello API'}`), express api-e2e port mismatch (API serves 3333, e2e waited on 3000) + IPv4, nestjs `tsdown` needed `unrun` dep under `npm ci`.
- **TypeScript split:** `~6.0.3` where clean (astro-starlight, react-mfe, remotion, tanstack-ai, tanstack-start); `~5.9.2` where TS 6 breaks (express, nextjs, fullstack, nuxt, expo via playwright `import.meta.dirname`; nestjs `moduleResolution: node10` TS5107; typescript-template `baseUrl` TS5101). `@types/node@^24` added to server/isomorphic repos.
- **Astro 7:** NOT upgraded — `@astrojs/starlight@0.40.0` (latest) peers `astro: ^6`; npm keeps astro at 6.4.8 even when 7 requested. Wait for Starlight to support Astro 7.
- **Doc-link fixes + 404 audit:** swept stale `nx.dev` links to `/docs/*` and `/nx-cloud`; verified every unique nx.dev URL via WebFetch (curl to `nx.dev` is blocked — only `*.nx.dev` is allowlisted, not the apex). Fixed 6 real 404s (e.g. `/docs/guides/vite` → `/docs/technologies/build-tools/vite`, playwright `…/introduction` → `…/playwright`). Caught false 404s from batching 22 WebFetch at once (rate-limited) — re-verified in small batches.
- **Executors:** removed all executor mentions from READMEs (legacy; run-commands excepted, no mention needed).
- **`packages/.gitkeep`** added to empty-template (only repo declaring `packages/*` with no dir).
- **PR opened (nx repo):** https://github.com/nrwl/nx/pull/36085 — remove empty SaaS/Mobile filters from the templates gallery (`astro-docs/src/data/templates.ts`), base `master`.
- **project.json → package.json conversion** (one config file, fully scoped project names): converted express-api, nextjs, tanstack-ai, astro-starlight, remotion, tanstack-start, **react-mfe** (react was already package.json-based). **Left on project.json: nestjs (user call) + angular** (nested path aliases `@org/shop/data` aren't valid npm package names → can't be workspace packages without churn). Learned: `nx.name` in package.json is honored only when the project is discovered via npm workspaces.
- **Reviewed another agent's `fix/template-audit-findings`:** kept the tanstack-ai + tanstack-start README "TypeScript 6.0" fixes and the angular `**` route `Prerender → Server` fix (removes build-time API dependency for the prerendered products list). **Reverted the tanstack-ai dep bump to 0.34** — it breaks the chat: `ai-react-ui@0.8.9` anchors `@tanstack/ai` to 0.32, but `ai-anthropic@^0.15.7` needs `@tanstack/ai@^0.34`, so a fresh install drops `@tanstack/ai-anthropic` and the `anthropicText` import fails. All three pushed to `main`.

### Deliverable created
- New skill `dot_claude/skills/cnw-templates-dep-audit/SKILL.md` — daily dependency-staleness audit + per-repo PRs for the template repos (encodes the upgrade constraints above).

## NXC-4590 — nx migrate crash with `--include=optional` (PR #36087 MERGED)

Surfaced while migrating the ocean repo to latest Nx. `nx migrate` with `--include=optional` crashed: `Cannot read properties of undefined (reading 'version')` in `generateMigrationsJsonAndUpdatePackageJson` (`packages/nx/src/command-line/migrate/migrate.ts`).

- **Root cause:** the 4th arg to `writePromptMigrationFiles` read `packageUpdates[walkedTargetPackage].version` unguarded. Under optional, `Migrator.applyIncludeFilter()` deletes every required-closure member from `packageUpdates`, and `resolveRequiredPackages()` always seeds the set with the target package itself, so that entry is deterministically `undefined`. Not ocean-specific - any workspace hitting that line with `--include=optional`. Existing tests missed it because they drive the `Migrator` class directly and never reach the orchestration seam.
- **Fix:** hoisted the already-safe `packageUpdates[walkedTargetPackage]?.version ?? opts.targetVersion` (previously used only by completion analytics, 18 lines below) above the call and reused it. Net +8/-4.
- **Verification:** exported the fn + added a regression test on the orchestration seam (fails against pre-fix code with the exact reported `TypeError`). `build-base`, `lint`, `migrate.spec.ts` (210/210) green. Adversarial scan of the full optional flow found no sibling unguarded accesses.
- Polygraph session `migrate-error-c1c6a147` (nrwl/nx + nrwl/ocean); Linear NXC-4590 linked. Plan: `dot_ai/2026-06-23/tasks/nxc-4590-migrate-optional-crash.md`.
