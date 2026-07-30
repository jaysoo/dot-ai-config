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
