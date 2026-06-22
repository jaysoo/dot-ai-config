#!/usr/bin/env node
// nx.dev GA4 monthly traffic - normalized trend builder
//
// Why this exists: every month since ~mid-2025 a code/config change landed that
// altered HOW page views are counted, so raw month-over-month numbers are not
// apples-to-apples. This script holds the raw numbers scraped from GA4 (there is
// no GA reporting API available to us) and emits a normalized monthly table plus
// per-month annotations so we can read real trends.
//
// Source: GA4 property "Nx.dev - GA4" (a88380372p309633468).
//   - May 2025 - Jun 2026: Explore free-form, dim "Nth month", metric "Views"
//     (screenPageViews = client page_view) + "Active users" + "Event count"
//     filtered to event_name = server_page_view.
//   - Jan 2025 - Apr 2025: GA4 Explore is capped at ~14 months retention, so these
//     baseline months came from the standard Reports "Pages and screens: Page path
//     and screen class" report (Totals row = all; row "/" = home; /docs absent).
//
// Scraped 2026-06-19 by Jack. Run: `node ga-monthly-traffic.mjs`
//
// KEY: the Jan-Apr 2025 baseline (pre-GTM, single count) averages ~650K/mo, which
// is essentially IDENTICAL to May-Jul 2025 (~635K, GTM live). So the GTM
// "double-count" did NOT double the Views/page_view metric. We therefore do NOT
// apply any /2 adjustment - raw Views are comparable Jan 2025 -> Apr 2026. The only
// hard measurement break is the May 2026 consent banner (client views consent-gated).

// raw[] index aligns with GA "Nth month" 0000..0013 (0000 = May 2025).
// views/au = client page_view "Views" and "Active users".
// docsViews/docsAu = pagePath begins-with /docs.
// homeViews/homeAu = pagePath exactly "/".
// serverPv = event_count for event_name = server_page_view (0 before it shipped).
const raw = [
  // --- baseline from standard Reports (Explore can't reach this far back) ---
  { month: '2025-01', label: 'Jan 2025', views: 642659, au: 110491, docsViews: 0,      docsAu: 0,      homeViews: 53912, homeAu: 34611, serverPv: 0,       partial: false },
  { month: '2025-02', label: 'Feb 2025', views: 604377, au: 96753,  docsViews: 0,      docsAu: 0,      homeViews: 52718, homeAu: 33703, serverPv: 0,       partial: false },
  { month: '2025-03', label: 'Mar 2025', views: 682239, au: 109880, docsViews: 0,      docsAu: 0,      homeViews: 57917, homeAu: 37271, serverPv: 0,       partial: false },
  { month: '2025-04', label: 'Apr 2025', views: 665851, au: 103518, docsViews: 0,      docsAu: 0,      homeViews: 57401, homeAu: 36450, serverPv: 0,       partial: false },
  // --- from Explore (Nth month) ---
  { month: '2025-05', label: 'May 2025', views: 639476, au: 100623, docsViews: 2,      docsAu: 2,      homeViews: 56349, homeAu: 35639, serverPv: 0,       partial: false },
  { month: '2025-06', label: 'Jun 2025', views: 622307, au: 111513, docsViews: 4,      docsAu: 4,      homeViews: 54198, homeAu: 35153, serverPv: 0,       partial: false },
  { month: '2025-07', label: 'Jul 2025', views: 639134, au: 124802, docsViews: 4,      docsAu: 3,      homeViews: 58459, homeAu: 38532, serverPv: 0,       partial: false },
  { month: '2025-08', label: 'Aug 2025', views: 406972, au: 84165,  docsViews: 0,      docsAu: 0,      homeViews: 47105, homeAu: 33259, serverPv: 0,       partial: false },
  { month: '2025-09', label: 'Sep 2025', views: 530731, au: 111390, docsViews: 19084,  docsAu: 5167,   homeViews: 59194, homeAu: 39774, serverPv: 0,       partial: false },
  { month: '2025-10', label: 'Oct 2025', views: 521391, au: 133075, docsViews: 367229, docsAu: 61787,  homeViews: 57398, homeAu: 39680, serverPv: 0,       partial: false },
  { month: '2025-11', label: 'Nov 2025', views: 538355, au: 183025, docsViews: 341762, docsAu: 61254,  homeViews: 75499, homeAu: 60118, serverPv: 0,       partial: false },
  { month: '2025-12', label: 'Dec 2025', views: 425089, au: 116247, docsViews: 298518, docsAu: 56167,  homeViews: 59767, homeAu: 45824, serverPv: 0,       partial: false },
  { month: '2026-01', label: 'Jan 2026', views: 502735, au: 95965,  docsViews: 403073, docsAu: 61609,  homeViews: 49193, homeAu: 35281, serverPv: 0,       partial: false },
  { month: '2026-02', label: 'Feb 2026', views: 544268, au: 259793, docsViews: 448565, docsAu: 220817, homeViews: 49020, homeAu: 36890, serverPv: 2613475, partial: false },
  { month: '2026-03', label: 'Mar 2026', views: 388465, au: 169813, docsViews: 281899, docsAu: 122135, homeViews: 49556, homeAu: 37282, serverPv: 3341956, partial: false },
  { month: '2026-04', label: 'Apr 2026', views: 296525, au: 90842,  docsViews: 216101, docsAu: 59346,  homeViews: 36428, homeAu: 27148, serverPv: 5471799, partial: false },
  { month: '2026-05', label: 'May 2026', views: 94774,  au: 19641,  docsViews: 71525,  docsAu: 13005,  homeViews: 9388,  homeAu: 6921,  serverPv: 5119810, partial: false },
  { month: '2026-06', label: 'Jun 2026', views: 51667,  au: 10773,  docsViews: 37757,  docsAu: 7323,   homeViews: 5339,  homeAu: 3812,  serverPv: 3228509, partial: true  }, // through Jun 18 (18 of 30 days)
];

// Per-month "what changed" annotations. Keep these in sync with git history / PRs.
const events = {
  '2025-01': 'Clean pre-GTM baseline (single count). ~650K/mo - matches May-Jul 2025, so GTM added no visible doubling.',
  '2025-05': 'GTM added alongside direct GA (PRs #30977/#31090). NOTE: no doubling visible in Views vs the Jan-Apr baseline.',
  '2025-09': 'astro-docs goes live at /docs (docsViews starts ramping; older docs were at root paths and counted as non-docs).',
  '2025-10': 'astro-docs fully at /docs.',
  '2026-02': 'Feb 10: removed Cookiebot + direct GA, consolidated via GTM (#34384). Double-count window ENDS. server_page_view data also appears this month (Measurement Protocol; research dated the PR #34883 ~Mar 17 - GA shows events from Feb). AU is inflated from here by server-side MP events.',
  '2026-02b': 'Feb 27: Framer migration - homepage + marketing pages move to Framer (proxied via Netlify edge fn).',
  '2026-04': 'Apr 30: bot-probe short-circuit (#35527) + /pricing routing (#35467). Minor on client views.',
  '2026-05': 'May 1: Cookiebot CONSENT BANNER enabled -> client-side page_view is consent-gated. Largest client-views drop.',
};

const fmt = (n) => n == null ? '' : n.toLocaleString('en-US');
const pct = (cur, prev) => prev ? `${(((cur - prev) / prev) * 100).toFixed(0)}%` : '';

// Comparability note per month. Raw Views ARE comparable Jan 2025 -> Apr 2026
// (no doubling found). Breaks: docs/non-docs split only meaningful from Oct 2025
// (astro-docs moved to /docs); May 2026+ client views are consent-gated; AU is
// inflated by server-side MP events from Feb 2026.
function note(r) {
  const n = [];
  if (r.month <= '2025-09') n.push('docs at root (not /docs)');
  if (r.month >= '2026-02') n.push('AU incl. server MP');
  if (r.month >= '2026-05') n.push('client views CONSENT-GATED');
  if (r.partial) n.push('partial month');
  return n.join('; ');
}

// ---- emit markdown ----
let prev = null;
const rows = raw.map((r) => {
  const out = {
    label: r.label + (r.partial ? ' *' : ''),
    all: r.views, allMoM: pct(r.views, prev?.views),
    home: r.homeViews,
    docs: r.docsViews,
    nonDocs: r.views - r.docsViews,
    au: r.au,
    serverPv: r.serverPv,
    note: note(r),
  };
  prev = r;
  return out;
});

const H = ['Month', 'All Views', 'MoM', 'Home', 'Docs', 'Non-docs', 'Active users', 'server_page_view', 'Note'];
const md = [
  '| ' + H.join(' | ') + ' |',
  '| ' + H.map(() => '---').join(' | ') + ' |',
  ...rows.map((r) => `| ${r.label} | ${fmt(r.all)} | ${r.allMoM} | ${fmt(r.home)} | ${fmt(r.docs)} | ${fmt(r.nonDocs)} | ${fmt(r.au)} | ${fmt(r.serverPv)} | ${r.note} |`),
].join('\n');

// ---- emit CSV ----
const csv = [
  'month,all_views,home_views,docs_views,non_docs_views,active_users,server_page_view,partial,note',
  ...raw.map((r) => [r.month, r.views, r.homeViews, r.docsViews, r.views - r.docsViews, r.au, r.serverPv, r.partial, `"${note(r)}"`].join(',')),
].join('\n');

console.log('# nx.dev GA4 monthly page views (raw - no /2 applied; baseline shows no doubling)\n');
console.log(md);
console.log('\n* Jun 2026 is partial (through the 18th, ~18/30 days).\n');
console.log('--- CSV ---\n');
console.log(csv);

export { raw, events, note };
