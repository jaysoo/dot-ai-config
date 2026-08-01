# 2026-07-30

## ga-traffic refresh (data through 2026-07-29)

Refreshed the nx.dev GA traffic pipeline (`dot_ai/2026-06-19/tasks/ga-traffic/`) end to end -
first refresh to cover ALL series, not just all/home/docs/server:

- 8 GA4 daily raw files + gsc-daily -> 2026-07-29; monthly-segments (Jun finalized 83,414 views,
  Jul partial 76,458 thru Jul 29); channels-by-month Jun+Jul; process.mjs rerun (455 days,
  14/14 integrity checks). gsc-docs-others still held at 06-24 (AI-data contamination).
- New scrape method (10x faster than UI-walking): capture + replay GA4 Explore's internal report
  RPC in-page via Chrome MCP. Gotchas documented in `tasks/ga-traffic-refresh/README.md`:
  X-GAFE4-XSRF-TOKEN header required; any filtered field must also be a secondary dimension;
  Bot dimension = `custom_dimensions_group2_slot_05`; localhost POST works on analytics.google.com
  but is CSP-blocked on search.google.com (GSC via DOM table read).
- July read: GSC organic clicks Apr 72.6K -> May 66.4K -> Jun 59.0K -> Jul ~52.7K pace -
  decline continues ~-11%/mo, no recovery signal. Client Views flat at post-banner floor.
  server_page_view ~5.1-5.4M/mo; AI crawlers shifted into /blog (0.8M Apr -> ~1.6M/mo, ~30% of
  server events; docs steady ~2.4M/mo).

## NXC-4688: Optional webpack/MF deps for @nx/react + @nx/next - MERGED #36492

PR https://github.com/nrwl/nx/pull/36492 merged (squash `820a3a6aaa`). Follows Leo's @nx/angular
#36310 pattern. Polygraph session `react-mf-cleanup-04580e9b`, single repo nrwl/nx -
https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/react-mf-cleanup-04580e9b

- `@nx/react`: `@nx/module-federation`/`express`/`http-proxy-middleware` -> optional peers
  (assert + lazy import in the 3 MF executors, `ensurePackage` in generators); `@svgr/webpack` +
  `@nx/rollup` removed outright; `@babel/preset-react` newly declared (was undeclared, resolved
  transitively via `@svgr/webpack` - broke CI run 1 until declared).
- `@nx/next`: `@nx/webpack` -> optional peer (lazy in Cypress preset); `@svgr/webpack` removed.
- `@nx/react-native`: `@nx/webpack` -> devDependencies.
- Bonus field-bug fix: `@nx/module-federation` pinned `webpack` exactly (5.105.2) while
  `@nx/webpack` installs `^5.101.3` -> two webpack copies once 5.109.x shipped (07-23/07-28),
  all webpack MF builds on released nx broke ("Cannot use 'in' operator..."). Reproduced from
  published packages; fixed as optional peer `^5.0.0` matching `@nx/webpack`'s convention.
- Migrations (23.2.0-beta.4): MF/express backfill from targets + targetDefaults + mf-config
  files; standalone `add-svgr-webpack-if-used` in react + next (v22 migrations inlined
  `require.resolve('@svgr/webpack')` into user configs without declaring it - flagged by me,
  overruled, then reinstated by Jack's review).

Plan/notes: `dot_ai/2026-07-27/tasks/nxc-4688-react-next-webpack-mf-optional-deps.md`

Also completed earlier today (separate session): CNW WORKSPACE_CREATION_FAILED error analysis
(`tasks/analyze-cnw-workspace-creation-failures.md`).

## CLOUD-4927: Frontend/Polygraph HIGH vulnerabilities - draft PR #12656

Triaged all 20 CVE sub-issues of the HIGH container and shipped the fixable set as pnpm overrides.
Polygraph session `sharp-puma-7f09fb0e`, single repo nrwl/ocean -
https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/sharp-puma-7f09fb0e

- Draft PR https://github.com/nrwl/ocean/pull/12656 (commit `ce67755bdc`, CI in progress). Overrides
  mirrored across root + `apps/nx-cloud` + `apps/polygraph`: brace-expansion 1.1.13/2.0.3/5.0.6 ->
  1.1.18/2.1.4/5.0.9, js-yaml@4 4.2.0 -> 4.3.0, undici ^6.23.0 -> ^6.27.0, plus three new
  transitive-only overrides (lodash-es 4.18.0, `path-to-regexp@<0.1.13` 0.1.13, `@grpc/grpc-js`
  ^1.14.4) and the `apps/polygraph` tar 7.5.20 -> 7.5.22 drift.
- **Method that paid off: re-verify every range against the GitHub advisory API, not the ticket.**
  CLOUD-4930 says undici is fixed in 6.26.0; the advisory and the v6.27.0 release notes both say
  6.27.0 ("v6.26.0 contains only the chunked-EOF fix"). We were on 6.26.0 and would have shipped
  still-vulnerable.
- Two scan surfaces per image, needing different fixes: app `node_modules` (pruned prod install from
  our lockfile -> overrides) and the globally installed npm, which vendors its own sigstore/tar/
  minimatch/brace-expansion/undici (-> Dockerfile npm pin, what #12614 did).
- Rebased onto `532113a400` after Nicole's OTel #12631 merged mid-session. Lockfile was the only
  conflict; resolved via `git checkout origin/main -- pnpm-lock.yaml && pnpm install --lockfile-only`.
  Force-pushed with lease since the rebase rewrote the SHA and `push_branch` pull-rebases.
- Post-rebase finding: main still resolves `@grpc/grpc-js` 1.14.3 even after the OTel bump, so the
  `^1.14.4` override is load-bearing, not redundant.
- Linear triage: 8 In Review on #12656, 2 closed Duplicate of CLOUD-4985 (Nicole's OTel work),
  9 Canceled as already patched by #12575/#12614/CLOUD-4926, parent In Review.
- Filed **CLOUD-5066** in the Remix V2 Migration project for the 4 RR7-blocked CVEs and reparented
  them under it: CLOUD-4935 (turbo-stream, from 4927) + CLOUD-4981/4982/4983 (react-router, from the
  MEDIUM container 4936). React Router **7.18.0** is the binding floor. CVE-2026-53668 reports
  `first_patched_version: null` for react-router-dom, so the 6.x line gets no backport at all.
  CLOUD-5066 carries a post-migration step to re-check every CVE across both containers.
- Known residual that will still report on rescan: npm vendors brace-expansion 5.0.7 in 11.18.0,
  11.19.0 and even 12.0.2, still inside CVE-2026-14257 (CLOUD-4932). Needs a later npm pin or a
  scoped rego ignorePolicy. Not Remix-related.

Plan/notes: `dot_ai/2026-07-30/tasks/cloud-4927-frontend-polygraph-high-vulns.md`
