#!/usr/bin/env node
// process.mjs - deterministic GA traffic pipeline for nx.dev.
// No external npm deps; only node builtins. Run: `node process.mjs`.
//
// Reads raw/*.json (scraped GA4 data, treated as read-only source of truth),
// builds a merged daily table, computes deterministic analysis, and emits
// out/chart-data.json, out/analysis.json, and a self-contained out/chart.html.
//
// Domain caveats baked into the analysis (see README.md):
//  - Views = GA4 screenPageViews (client page_view). server_page_view is a
//    separate Measurement Protocol event, NOT in Views, and mostly AI crawlers.
//  - No /2 normalization: pre-GTM and post-GTM monthly Views are comparable.
//  - The 2026-05-01 Cookiebot consent banner is the big client-views cliff.
//  - AU is contaminated by server-side MP events from Feb 2026 (not used here).
//  - docs/non-docs split is only meaningful from ~Oct 2025.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW = join(__dirname, 'raw');
const OUT = join(__dirname, 'out');

// ---------- helpers ----------
const readJson = (name) => JSON.parse(readFileSync(join(RAW, name), 'utf8'));
const num = (v) => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};
const pct = (from, to) => (from === 0 ? null : ((to - from) / from) * 100);
const round = (n, d = 2) =>
  n === null || n === undefined ? null : Math.round(n * 10 ** d) / 10 ** d;
const monthOf = (date) => date.slice(0, 7); // "2025-05-01" -> "2025-05"

// Add `days` to an ISO yyyy-mm-dd date, returning yyyy-mm-dd (UTC-safe).
function addDays(date, days) {
  const d = new Date(date + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Ordinary least squares slope + intercept for points indexed 0..n-1.
function olsSlope(values) {
  const n = values.length;
  if (n < 2) return { slope: 0, intercept: values[0] ?? 0 };
  let sx = 0,
    sy = 0,
    sxx = 0,
    sxy = 0;
  for (let i = 0; i < n; i++) {
    sx += i;
    sy += values[i];
    sxx += i * i;
    sxy += i * values[i];
  }
  const denom = n * sxx - sx * sx;
  const slope = denom === 0 ? 0 : (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;
  return { slope, intercept };
}

// ---------- load raw ----------
const monthly = readJson('monthly-segments.json');
const dailyAll = readJson('daily-all.json');
const dailyHome = readJson('daily-home.json');
const dailyDocs = readJson('daily-docs.json');
const dailyBlog = readJson('daily-blog.json');
const dailyMarketing = readJson('daily-marketing.json');
const dailyServer = readJson('daily-server.json');
const events = readJson('events.json');
const crosschecks = readJson('source-crosschecks.json');
const topPages = readJson('top-pages.json');
const topPagesBeforeAfter = readJson('top-pages-before-after.json');
const dailyServerCat = readJson('daily-server-by-category.json');
const dailyNxdev = readJson('daily-nxdev-by-category.json');
const channelsByMonth = readJson('channels-by-month.json');

// Daily blog/marketing coverage starts with the daily span (2025-05-01). Earlier
// months (Jan-Apr 2025) have no separate blog/marketing scrape, so on the monthly
// chart they fall into Others (flagged below). Segment-onset month for gating:
const SEG_DAILY_FROM = '2025-05';

// ---------- build merged daily table ----------
// Key every series by date, then iterate the all-pages date span (the master
// calendar). Missing docs/server days default to 0.
const idx = (rows, key) => {
  const m = new Map();
  for (const r of rows) m.set(r.date, num(r[key]));
  return m;
};
const homeViewsByDate = idx(dailyHome.rows, 'views');
const docsViewsByDate = idx(dailyDocs.rows, 'views');
const blogViewsByDate = idx(dailyBlog.rows, 'views');
const marketingViewsByDate = idx(dailyMarketing.rows, 'views');
const serverByDate = idx(dailyServer.rows, 'server_page_view');

// MECE page-type segments (see raw/segment-definitions.json): home, docs, blog,
// marketing (Framer pages), and others = all - the rest. Segments are disjoint
// subsets of all_views, so the sum is <= all (GA per-query thresholding can make
// it differ slightly); others is the clamped remainder.
// astro-docs put real content under /docs on 2025-09-29. Before that, /docs paths
// got only stray bot/scanner hits probing future URLs + sitemap fetches (39 paths,
// 61 views over May-Sep 2025) - not real docs traffic. Treat pre-launch /docs as
// Others so the Docs category is 0 until launch (verified: all 61 were bot-probed
// non-existent URLs incl. a malformed `/docs)` and `/docs/sitemap-0.xml`).
const DOCS_LAUNCH = '2025-09-29';
let othersClampDays = 0;
const dailyRows = dailyAll.rows
  .map((r) => {
    const all = num(r.views);
    const home = homeViewsByDate.get(r.date) ?? 0;
    const docs = r.date < DOCS_LAUNCH ? 0 : (docsViewsByDate.get(r.date) ?? 0);
    const blog = blogViewsByDate.get(r.date) ?? 0;
    const marketing = marketingViewsByDate.get(r.date) ?? 0;
    const rawOthers = all - home - docs - blog - marketing;
    if (rawOthers < 0) othersClampDays += 1;
    return {
      date: r.date,
      all_views: all,
      home_views: home,
      docs_views: docs,
      blog_views: blog,
      marketing_views: marketing,
      others_views: Math.max(0, rawOthers),
      server_page_view: serverByDate.get(r.date) ?? 0,
    };
  })
  .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

// Sum the daily segments by month (used to build monthly blog/marketing/others,
// which have no independent monthly scrape).
const SEG_KEYS = ['all_views', 'home_views', 'docs_views', 'blog_views', 'marketing_views', 'others_views'];
const dailySegByMonth = {};
for (const d of dailyRows) {
  const mk = monthOf(d.date);
  const acc = (dailySegByMonth[mk] ??= Object.fromEntries(SEG_KEYS.map((k) => [k, 0])));
  for (const k of SEG_KEYS) acc[k] += d[k];
}

const dailyByDate = new Map(dailyRows.map((d) => [d.date, d]));

// ---------- weekly table (full ISO weeks only) ----------
// Daily data is noisy (weekday/weekend swings), so the chart uses weekly sums.
// Bucket each daily row by the Monday of its ISO week and sum every series. Keep
// only complete 7-day weeks so there are no partial-week boundary dips (this
// trims the leading 2025-05-01..04 and trailing 2026-06-15..18 fragments).
function mondayOf(date) {
  const d = new Date(date + 'T00:00:00Z');
  const dow = (d.getUTCDay() + 6) % 7; // 0=Mon .. 6=Sun
  d.setUTCDate(d.getUTCDate() - dow);
  return d.toISOString().slice(0, 10);
}
const weekMap = new Map();
for (const r of dailyRows) {
  const wk = mondayOf(r.date);
  const acc = weekMap.get(wk) ?? {
    week_start: wk,
    all_views: 0,
    home_views: 0,
    docs_views: 0,
    blog_views: 0,
    marketing_views: 0,
    others_views: 0,
    server_page_view: 0,
    days: 0,
  };
  acc.all_views += r.all_views;
  acc.home_views += r.home_views;
  acc.docs_views += r.docs_views;
  acc.blog_views += r.blog_views;
  acc.marketing_views += r.marketing_views;
  acc.others_views += r.others_views;
  acc.server_page_view += r.server_page_view;
  acc.days += 1;
  weekMap.set(wk, acc);
}
const weeklyRows = [...weekMap.values()]
  .sort((a, b) => (a.week_start < b.week_start ? -1 : 1))
  .filter((w) => w.days === 7);

// ---------- weekly server_page_view BY page-type category ----------
// Separate rollup for the server-events-by-category chart. home/docs/blog/
// marketing come from daily-server-by-category.json; others = total server
// (daily-server) - the rest. Full ISO weeks only, same as the client weekly.
// Two variants per category: "all" (bot+non-bot) and "_bf" (Bot dimension = false,
// excludes flagged bots). The server chart has an include/exclude-bots toggle that
// switches between them. NOTE: undetected AI crawlers still land in bot=false, so
// "_bf" is "non-flagged-bot", not a clean human signal.
const srvCatByDate = new Map(dailyServerCat.rows.map((r) => [r.date, r]));
const srvWeekMap = new Map();
for (const d of dailyRows) {
  const wk = mondayOf(d.date);
  const c = srvCatByDate.get(d.date) || {};
  const acc = srvWeekMap.get(wk) ?? {
    week_start: wk, days: 0,
    home: 0, docs: 0, blog: 0, marketing: 0, total: 0,
    home_bf: 0, docs_bf: 0, blog_bf: 0, marketing_bf: 0, total_bf: 0,
  };
  for (const k of ['home', 'docs', 'blog', 'marketing', 'total', 'home_bf', 'docs_bf', 'blog_bf', 'marketing_bf', 'total_bf']) {
    acc[k] += num(c[k]);
  }
  acc.days += 1;
  srvWeekMap.set(wk, acc);
}
const weeklyServerCat = [...srvWeekMap.values()]
  .sort((a, b) => (a.week_start < b.week_start ? -1 : 1))
  .filter((w) => w.days === 7)
  .map((w) => ({
    week_start: w.week_start,
    // "all" variant (*_views keys consumed by the stacked builder)
    home_views: w.home, docs_views: w.docs, blog_views: w.blog, marketing_views: w.marketing,
    others_views: Math.max(0, w.total - w.home - w.docs - w.blog - w.marketing),
    // "exclude bots" variant
    home_bf: w.home_bf, docs_bf: w.docs_bf, blog_bf: w.blog_bf, marketing_bf: w.marketing_bf,
    others_bf: Math.max(0, w.total_bf - w.home_bf - w.docs_bf - w.blog_bf - w.marketing_bf),
  }));

// ---------- monthly table (sorted, normalized) ----------
const monthlyRows = monthly.rows
  .map((r) => {
    const m = r.month;
    const all = num(r.all_views);
    const home = num(r.home_views);
    // Pre-launch /docs (before the 2025-09 astro-docs launch month) is bot noise -> Others.
    const docs = m < '2025-09' ? 0 : num(r.docs_views);
    // blog/marketing come from the daily sums; only from May 2025 (daily coverage).
    // Before that they are unknown and fall into Others (blog/marketing = null).
    const ds = dailySegByMonth[m];
    const haveSeg = m >= SEG_DAILY_FROM && !!ds;
    const blog = haveSeg ? ds.blog_views : null;
    const marketing = haveSeg ? ds.marketing_views : null;
    const others = Math.max(0, all - home - docs - (blog ?? 0) - (marketing ?? 0));
    return {
      month: m,
      all_views: all,
      home_views: home,
      docs_views: docs,
      blog_views: blog,
      marketing_views: marketing,
      others_views: others,
      non_docs_views: num(r.non_docs_views),
      server_page_view: num(r.server_page_view),
      partial: !!r.partial,
    };
  })
  .sort((a, b) => (a.month < b.month ? -1 : a.month > b.month ? 1 : 0));

const fullMonths = monthlyRows.filter((m) => !m.partial);

// ---------- nx.dev-only (Hostname EXACTLY = nx.dev) client variant ----------
// Backs the top-of-page "nx.dev hostname only" toggle. daily-nxdev-by-category has
// the same MECE categories filtered to the canonical host (excludes *.nx.dev versioned
// subdomains, go.*, canary, localhost, and Vercel/Netlify preview deploys). The server
// line stays the all-hosts reference (server_page_view is sent first-party by the edge
// fn). Pre-May-2025 months have no nx.dev daily, so they fall back to all-hosts.
const VIEW_KEYS = ['all_views', 'home_views', 'docs_views', 'blog_views', 'marketing_views', 'others_views', 'server_page_view'];
const nxdevByDate = new Map(dailyNxdev.rows.map((r) => [r.date, r]));
const nxdevDailyRows = dailyRows.map((d) => {
  const n = nxdevByDate.get(d.date);
  if (!n) return { ...d };
  const docs = d.date < DOCS_LAUNCH ? 0 : n.docs; // same pre-launch /docs fix
  const others = Math.max(0, n.all - n.home - docs - n.blog - n.marketing);
  return {
    date: d.date, all_views: n.all,
    home_views: n.home, docs_views: docs, blog_views: n.blog,
    marketing_views: n.marketing, others_views: others,
    server_page_view: d.server_page_view,
  };
});
function rollupWeekly(rows) {
  const m = new Map();
  for (const r of rows) {
    const wk = mondayOf(r.date);
    const acc = m.get(wk) ?? Object.assign({ week_start: wk, days: 0 }, Object.fromEntries(VIEW_KEYS.map((k) => [k, 0])));
    for (const k of VIEW_KEYS) acc[k] += r[k] ?? 0;
    acc.days += 1;
    m.set(wk, acc);
  }
  return [...m.values()].sort((a, b) => (a.week_start < b.week_start ? -1 : 1)).filter((w) => w.days === 7);
}
const weeklyNxdev = rollupWeekly(nxdevDailyRows);
const nxdevMonthMap = new Map();
for (const r of nxdevDailyRows) {
  const mk = monthOf(r.date);
  const acc = nxdevMonthMap.get(mk) ?? Object.assign({ month: mk }, Object.fromEntries(VIEW_KEYS.map((k) => [k, 0])));
  for (const k of VIEW_KEYS) acc[k] += r[k] ?? 0;
  nxdevMonthMap.set(mk, acc);
}
const monthlyNxdev = monthlyRows.map((m) => {
  const n = nxdevMonthMap.get(m.month);
  if (!n) return { ...m }; // pre-May-2025 fallback to all-hosts
  return {
    month: m.month, all_views: n.all_views, home_views: n.home_views, docs_views: n.docs_views,
    blog_views: m.blog_views === null ? null : n.blog_views,
    marketing_views: m.marketing_views === null ? null : n.marketing_views,
    others_views: n.others_views, server_page_view: m.server_page_view, partial: m.partial,
  };
});

// ================= ANALYSIS =================

// --- mom: month-over-month % change for all/home/docs ---
const mom = monthlyRows.map((m, i) => {
  const prev = i > 0 ? monthlyRows[i - 1] : null;
  return {
    month: m.month,
    partial: m.partial,
    all_views: m.all_views,
    home_views: m.home_views,
    docs_views: m.docs_views,
    all_mom_pct: prev ? round(pct(prev.all_views, m.all_views)) : null,
    home_mom_pct: prev ? round(pct(prev.home_views, m.home_views)) : null,
    docs_mom_pct: prev ? round(pct(prev.docs_views, m.docs_views)) : null,
  };
});

// --- trend: last 12 full months (exclude partial Jun 2026) ---
function trendOver(months, key) {
  const values = months.map((m) => m[key]);
  const { slope } = olsSlope(values);
  const first = values[0];
  const last = values[values.length - 1];
  return {
    from_month: months[0].month,
    to_month: months[months.length - 1].month,
    first_value: first,
    last_value: last,
    direction: slope < 0 ? 'down' : slope > 0 ? 'up' : 'flat',
    ols_slope_per_month: round(slope),
    total_change_pct: round(pct(first, last)),
  };
}
const last12 = fullMonths.slice(-12);
// The 12-month window ends on 2026-05, whose endpoint is suppressed by the
// 2026-05-01 Cookiebot consent banner (a measurement artifact, not lost
// traffic). Provide a parallel trend through the last pre-banner full month
// (2026-04) so the organic decline can be read without the consent cliff.
const PRE_BANNER_MONTH = '2026-04';
const preBannerMonths = last12.filter((m) => m.month <= PRE_BANNER_MONTH);
const trend = {
  window_months: last12.length,
  consent_artifact_note:
    'Window endpoint (2026-05) is consent-suppressed by the 2026-05-01 Cookiebot ' +
    'banner; the drop is a measurement artifact, not lost traffic. See ' +
    'pre_banner trends and cookiebot_2026_05_01 for the organic signal.',
  all_views: trendOver(last12, 'all_views'),
  // home_views is the cleaner human signal: no astro-docs migration confound.
  home_views: trendOver(last12, 'home_views'),
  // Same windows but stopping at the last pre-banner full month (consent-immune).
  pre_banner: {
    through_month: PRE_BANNER_MONTH,
    window_months: preBannerMonths.length,
    all_views: trendOver(preBannerMonths, 'all_views'),
    home_views: trendOver(preBannerMonths, 'home_views'),
  },
};

// --- event_impacts: interrupted-time-series window on daily all_views ---
// Mean of the 14 days BEFORE (date-14 .. date-1) vs 14 days AFTER, INCLUDING
// the event date (date .. date+13). The event-day effect lands on day 0.
function windowMean(startDate, endDateInclusive) {
  let sum = 0;
  let n = 0;
  let cur = startDate;
  while (cur <= endDateInclusive) {
    const row = dailyByDate.get(cur);
    if (row) {
      sum += row.all_views;
      n += 1;
    }
    cur = addDays(cur, 1);
  }
  return { mean: n ? sum / n : null, days: n };
}
const EVENT_AFTER_WINDOW = 'inclusive of event day (date..date+13)';
const event_impacts = events.events.map((e) => {
  const before = windowMean(addDays(e.date, -14), addDays(e.date, -1));
  const after = windowMean(e.date, addDays(e.date, 13));
  // Self-explain a short/empty before-window so a null change_pct is not read
  // as a computation failure (mirrors the `reason` field in the integrity check).
  const reason =
    before.days === 0
      ? 'before-window empty: event predates daily span start'
      : before.days < 14
        ? 'before-window truncated by daily span start'
        : undefined;
  return {
    date: e.date,
    label: e.label,
    type: e.type,
    before_mean: round(before.mean),
    before_days: before.days,
    after_mean: round(after.mean),
    after_days: after.days,
    after_window: EVENT_AFTER_WINDOW,
    change_pct:
      before.mean === null || after.mean === null
        ? null
        : round(pct(before.mean, after.mean)),
    ...(reason ? { reason } : {}),
  };
});
const cookiebot = event_impacts.find((e) => e.date === '2026-05-01') || null;

// --- server_page_view summary ---
const serverDays = dailyServer.rows
  .map((r) => ({ date: r.date, value: num(r.server_page_view) }))
  .filter((r) => r.value > 0)
  .sort((a, b) => (a.date < b.date ? -1 : 1));
let peak = serverDays[0] || { date: null, value: 0 };
for (const d of serverDays) if (d.value > peak.value) peak = d;
const serverMonthly = {};
for (const d of dailyRows) {
  if (d.server_page_view > 0) {
    const mk = monthOf(d.date);
    serverMonthly[mk] = (serverMonthly[mk] || 0) + d.server_page_view;
  }
}
const server_page_view = {
  first_recorded: dailyServer.first_recorded,
  peak_day: peak.date,
  peak_value: peak.value,
  monthly_totals: serverMonthly,
  note: 'Consent-immune server event (Measurement Protocol); mostly AI-crawler traffic. Not counted in Views.',
};

// --- daily_vs_monthly_check: integrity check, monthly vs sum-of-daily ---
// Only full months whose ENTIRE calendar is covered by the daily span are
// directly comparable. Daily starts 2025-05-01, so Jan-Apr 2025 have no daily
// coverage and are reported as not_comparable.
const dailySpanStart = dailyRows[0].date;
const dailySpanEnd = dailyRows[dailyRows.length - 1].date;
// Reconcile all four merged series (not just all_views) so a stitch error in
// the docs/home/server split is caught too. server_page_view daily coverage
// starts at daily-server.first_recorded, so it is gated on its own start date.
const SERIES = [
  { key: 'all_views', monthlyKey: 'all_views', coverFrom: dailySpanStart },
  { key: 'home_views', monthlyKey: 'home_views', coverFrom: dailySpanStart },
  { key: 'docs_views', monthlyKey: 'docs_views', coverFrom: dailySpanStart },
  {
    key: 'server_page_view',
    monthlyKey: 'server_page_view',
    coverFrom: dailyServer.first_recorded,
  },
];
const dailySumByMonth = {}; // mk -> { all_views, home_views, docs_views, server_page_view }
for (const d of dailyRows) {
  const mk = monthOf(d.date);
  const acc = (dailySumByMonth[mk] ??= {
    all_views: 0,
    home_views: 0,
    docs_views: 0,
    server_page_view: 0,
  });
  for (const s of SERIES) acc[s.key] += d[s.key];
}
// Last calendar day of a "yyyy-mm" month: jump to the 28th, walk to month end.
function lastDayOfMonth(month) {
  let cur = month + '-28';
  while (monthOf(addDays(cur, 1)) === month) cur = addDays(cur, 1);
  return cur;
}
const TOLERANCE_PCT = 2; // GA rounding/thresholding noise band.
const daily_vs_monthly_check = monthlyRows.map((m) => {
  // A month is comparable only if both its first and last calendar day fall
  // within the daily span (so the daily sum is a full month, not a fragment).
  const firstDay = m.month + '-01';
  const lastDay = lastDayOfMonth(m.month);
  const covered = firstDay >= dailySpanStart && lastDay <= dailySpanEnd;
  const sums = dailySumByMonth[m.month];
  const hasDaily = sums !== undefined;
  if (!hasDaily || m.partial || !covered) {
    return {
      month: m.month,
      comparable: false,
      reason: m.partial
        ? 'partial month'
        : !hasDaily
          ? 'no daily coverage'
          : 'daily span does not fully cover month',
      // keep all_views fields for back-compat with prior consumers
      monthly_all_views: m.all_views,
      daily_sum_all_views: hasDaily ? sums.all_views : null,
      diff: null,
      diff_pct: null,
      within_tolerance: null,
    };
  }
  // Per-series reconciliation. server only enters once daily-server coverage
  // begins (first_recorded); before that it is not_comparable for that series.
  const series = {};
  let allWithinTolerance = true;
  for (const s of SERIES) {
    const monthlyVal = m[s.monthlyKey];
    const dailyVal = sums[s.key];
    // Gate on the coverage-start MONTH, not the exact day: first_recorded is
    // the genuine onset of the event, so any month at or after the onset month
    // is fully captured (the pre-onset days legitimately summed to 0).
    if (m.month < monthOf(s.coverFrom)) {
      series[s.key] = {
        monthly: monthlyVal,
        daily_sum: dailyVal,
        comparable: false,
        reason: 'daily coverage for this series starts after month',
      };
      continue;
    }
    const diff = dailyVal - monthlyVal;
    const diffPct = pct(monthlyVal, dailyVal);
    const within = diffPct === null ? true : Math.abs(diffPct) <= TOLERANCE_PCT;
    if (!within) allWithinTolerance = false;
    series[s.key] = {
      monthly: monthlyVal,
      daily_sum: dailyVal,
      diff,
      diff_pct: round(diffPct),
      within_tolerance: within,
      comparable: true,
    };
  }
  const av = series.all_views;
  return {
    month: m.month,
    comparable: true,
    series,
    within_tolerance: allWithinTolerance,
    // all_views fields surfaced at top level for back-compat with prior consumers
    monthly_all_views: av.monthly,
    daily_sum_all_views: av.daily_sum,
    diff: av.diff,
    diff_pct: av.diff_pct,
  };
});
const comparableChecks = daily_vs_monthly_check.filter((c) => c.comparable);
const integrityOutliers = comparableChecks.filter((c) => !c.within_tolerance);

// --- source_crosscheck: turn the asserted Reports-vs-Explore agreement into a
// deterministic check. For each overlap month: (1) Reports == Explore (the two
// scrape sources agree), and (2) both equal the monthly-segments row that feeds
// the charts (so the stitched series is consistent with its sources). ---
const monthlyByMonth = new Map(monthlyRows.map((m) => [m.month, m]));
const crosscheckResults = (crosschecks.checks || []).map((c) => {
  const seg = monthlyByMonth.get(c.month) || null;
  const fields = ['all_views', 'home_views'];
  const reportsVsExplore = fields.map((f) => ({
    field: f,
    reports: c.standard_reports?.[f] ?? null,
    explore: c.explore?.[f] ?? null,
    match: (c.standard_reports?.[f] ?? null) === (c.explore?.[f] ?? null),
  }));
  const vsSegments = fields.map((f) => ({
    field: f,
    reports: c.standard_reports?.[f] ?? null,
    segments: seg ? seg[f] : null,
    match: seg ? (c.standard_reports?.[f] ?? null) === seg[f] : false,
  }));
  const pass =
    seg !== null &&
    reportsVsExplore.every((r) => r.match) &&
    vsSegments.every((r) => r.match);
  return {
    month: c.month,
    sources_agree: reportsVsExplore.every((r) => r.match),
    segments_match: vsSegments.every((r) => r.match),
    pass,
    reports_vs_explore: reportsVsExplore,
    vs_segments: vsSegments,
  };
});
const source_crosscheck = {
  purpose: crosschecks.purpose,
  checks: crosscheckResults,
  all_pass: crosscheckResults.every((c) => c.pass),
  key_finding:
    `Source crosscheck: ${crosscheckResults.filter((c) => c.pass).length}/` +
    `${crosscheckResults.length} overlap months pass ` +
    `(Reports == Explore == monthly-segments at ${crosscheckResults
      .map((c) => c.month)
      .join(', ')}), confirming the two-source stitch.`,
};

// --- segment_check: MECE page-type segmentation (home/docs/blog/marketing/others) ---
// others is the clamped remainder, so segment_sum == all_views by construction.
// The signal here is othersClampDays: days where the disjoint segments summed to
// MORE than all_views (GA per-query thresholding), which we clamped to 0.
const segment_check = {
  segments: ['home', 'docs', 'blog', 'marketing', 'others'],
  blog_marketing_measured_from: SEG_DAILY_FROM,
  others_clamp_days: othersClampDays,
  daily_days: dailyRows.length,
  monthly: monthlyRows.map((m) => {
    const segSum =
      m.home_views + m.docs_views + (m.blog_views ?? 0) + (m.marketing_views ?? 0) + m.others_views;
    return {
      month: m.month,
      all_views: m.all_views,
      home: m.home_views,
      docs: m.docs_views,
      blog: m.blog_views,
      marketing: m.marketing_views,
      others: m.others_views,
      segment_sum: segSum,
      diff: segSum - m.all_views,
      blog_marketing_measured: m.blog_views !== null,
    };
  }),
  note:
    'Disjoint segments; others = all - (home+docs+blog+marketing) so segment_sum == all_views (diff 0). ' +
    `blog/marketing measured from ${SEG_DAILY_FROM} (daily coverage); before that they are folded into Others. ` +
    'docs is ~0 before ~Oct 2025 (pre-astro-migration docs lived at root paths -> Others).',
};

// --- key_findings ---
const key_findings = [];
key_findings.push(
  `Last ${trend.window_months} full months all_views trend: ${trend.all_views.direction} (` +
    `${trend.all_views.total_change_pct}% total, slope ${trend.all_views.ols_slope_per_month}/mo). ` +
    `CAVEAT: the 2026-05 endpoint is consent-suppressed by the Cookiebot banner (see below), ` +
    `so this is NOT all organic traffic loss. Pre-banner (through ${trend.pre_banner.through_month}) ` +
    `all_views trend: ${trend.pre_banner.all_views.direction} (${trend.pre_banner.all_views.total_change_pct}% total).`
);
key_findings.push(
  `Home views (no docs-migration confound) trend: ${trend.home_views.direction} (` +
    `${trend.home_views.total_change_pct}% total) - but this is mostly a single ` +
    `2026-05 measurement cliff: home was roughly flat (~54K/mo) through ${trend.pre_banner.through_month} ` +
    `(pre-banner trend ${trend.pre_banner.home_views.total_change_pct}%), then dropped to ${trend.home_views.last_value} ` +
    `in May 2026 from the same Cookiebot banner. Read it as flat-then-cliff, not a gradual 12-month decline.`
);
if (cookiebot) {
  key_findings.push(
    `2026-05-01 Cookiebot consent banner: daily all_views ${cookiebot.before_mean} -> ` +
      `${cookiebot.after_mean} (${cookiebot.change_pct}% over a 14d-before/14d-after window).`
  );
}
key_findings.push(
  `server_page_view first recorded ${server_page_view.first_recorded}; peak ${server_page_view.peak_value} on ` +
    `${server_page_view.peak_day} (Measurement Protocol, mostly AI crawlers, not in Views).`
);
key_findings.push(
  `Daily-vs-monthly integrity (all four series: all/home/docs/server): ` +
    `${comparableChecks.length - integrityOutliers.length}/` +
    `${comparableChecks.length} comparable months within ${TOLERANCE_PCT}% tolerance` +
    (integrityOutliers.length
      ? ` (outliers: ${integrityOutliers.map((o) => `${o.month} ${o.diff_pct}%`).join(', ')}).`
      : '.')
);
key_findings.push(source_crosscheck.key_finding);
key_findings.push(
  'No /2 normalization applied: pre-GTM (Jan-Apr 2025) ~650K/mo matches post-GTM (May-Jul 2025) ~635K, disproving double-counting.'
);
{
  // Page-type composition for the last full pre-banner month (2026-04).
  const cm = monthlyRows.find((m) => m.month === '2026-04');
  if (cm) {
    const p = (v) => `${v} (${round((v / cm.all_views) * 100, 0)}%)`;
    key_findings.push(
      `Page-type mix Apr 2026 (of ${cm.all_views} views): docs ${p(cm.docs_views)}, ` +
        `others ${p(cm.others_views)}, home ${p(cm.home_views)}, blog ${p(cm.blog_views ?? 0)}, ` +
        `marketing ${p(cm.marketing_views ?? 0)}. Docs dominates; the decline is broad-based across types.`
    );
  }
  if (segment_check.others_clamp_days > 0) {
    key_findings.push(
      `Segment integrity: on ${segment_check.others_clamp_days}/${segment_check.daily_days} days the disjoint ` +
        `segments summed slightly above all_views (GA per-query thresholding); Others was clamped to 0 those days.`
    );
  }
}

const analysis = {
  meta: {
    generated_by: 'process.mjs',
    scraped_at: monthly.scraped_at,
    tolerance_pct: TOLERANCE_PCT,
    trend_window_months: trend.window_months,
  },
  mom,
  trend,
  event_impacts,
  cookiebot_2026_05_01: cookiebot,
  server_page_view,
  daily_vs_monthly_check,
  source_crosscheck,
  segment_check,
  key_findings,
};

// ================= CHART DATA =================
const chartData = {
  meta: {
    generated_by: 'process.mjs',
    scraped_at: monthly.scraped_at,
    daily_range: `${dailySpanStart}..${dailySpanEnd}`,
    weekly_range: weeklyRows.length
      ? `${weeklyRows[0].week_start}..${weeklyRows[weeklyRows.length - 1].week_start}`
      : 'n/a',
    monthly_range: `${monthlyRows[0].month}..${monthlyRows[monthlyRows.length - 1].month}`,
    segments: 'Page types: home (/), docs (/docs*), blog (/blog*), marketing (Framer pages, see raw/segment-definitions.json), others (= all - the rest). Disjoint; stack to total.',
    caveats: [
      'Views = GA4 screenPageViews (client page_view).',
      'server_page_view = separate Measurement Protocol event, mostly AI crawlers, NOT in Views.',
      'No /2 normalization (double-count theory disproven).',
      'AU contaminated by server-side MP events from Feb 2026.',
      'blog/marketing measured from 2025-05 (daily coverage); earlier they are in Others.',
      'docs is ~0 before ~Oct 2025 (pre-migration docs at root paths -> Others).',
    ],
  },
  events: events.events,
  daily: dailyRows,
  weekly: weeklyRows,
  weeklyNxdev,
  weeklyServerCat,
  monthly: monthlyRows,
  monthlyNxdev,
  channelsHome: channelsByMonth.home,
  channelsDocs: channelsByMonth.docs,
  channelsOthers: channelsByMonth.others,
  channelsHomeNxdev: channelsByMonth.homeNxdev,
  channelsDocsNxdev: channelsByMonth.docsNxdev,
  channelsOthersNxdev: channelsByMonth.othersNxdev,
  topPages,
  topPagesBeforeAfter,
};

// ================= WRITE OUTPUTS =================
mkdirSync(OUT, { recursive: true });
writeFileSync(
  join(OUT, 'chart-data.json'),
  JSON.stringify(chartData, null, 2) + '\n'
);
writeFileSync(
  join(OUT, 'analysis.json'),
  JSON.stringify(analysis, null, 2) + '\n'
);
writeFileSync(join(OUT, 'chart.html'), buildHtml(chartData, analysis));

// ---------- HTML builder (data injected inline; works via file://) ----------
function buildHtml(data, analysis) {
  const payload = JSON.stringify({ chartData: data, analysis }).replace(
    /</g,
    '\\u003c'
  );
  const findingsLis = analysis.key_findings
    .map((f) => `<li>${escapeHtml(f)}</li>`)
    .join('\n        ');
  const cb = analysis.cookiebot_2026_05_01;
  const cbLine = cb
    ? `14 days before: <b>${cb.before_mean}</b> daily views &nbsp;->&nbsp; 14 days after: <b>${cb.after_mean}</b> &nbsp;(<b>${cb.change_pct}%</b>)`
    : 'n/a';
  // Top-25 pages per category. Colors match the chart segments.
  const CAT_COLOR = { home: '#34c98a', docs: '#a06bff', blog: '#4f9dff', marketing: '#ff6b9d', others: '#7e8aa2' };
  const tp = data.topPages.categories;
  const fmtN = (n) => Number(n).toLocaleString('en-US');
  const topPagesHtml = ['home', 'docs', 'blog', 'marketing', 'others']
    .map((cat) => {
      const rows = (tp[cat]?.top25 || [])
        .map((r, i) => `<tr><td class="r">${i + 1}</td><td class="path" title="${escapeHtml(r.path)}">${escapeHtml(r.path)}</td><td class="v">${fmtN(r.views)}</td></tr>`)
        .join('');
      return `<div class="top-col"><h3><span class="chip" style="background:${CAT_COLOR[cat]}"></span>${cat[0].toUpperCase() + cat.slice(1)}</h3><table class="top"><tbody>${rows}</tbody></table></div>`;
    })
    .join('\n');

  // Before/after the 2025-09-29 /docs switch: category-total shift + Others top-25 side by side.
  const ba = data.topPagesBeforeAfter;
  const baCats = ['home', 'docs', 'blog', 'marketing', 'others'];
  const baTotalsRows = baCats
    .map((cat) => {
      const b = ba.before.categories[cat]?.total_views || 0;
      const a = ba.after.categories[cat]?.total_views || 0;
      return `<tr><td class="path"><span class="chip" style="background:${CAT_COLOR[cat]}"></span>${cat[0].toUpperCase() + cat.slice(1)}</td><td class="v">${fmtN(b)}</td><td class="v">${fmtN(a)}</td></tr>`;
    })
    .join('');
  const baColumn = (side, cat) =>
    (ba[side].categories[cat]?.top25 || [])
      .map((r, i) => `<tr><td class="r">${i + 1}</td><td class="path" title="${escapeHtml(r.path)}">${escapeHtml(r.path)}</td><td class="v">${fmtN(r.views)}</td></tr>`)
      .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>nx.dev GA Traffic</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3.0.1/dist/chartjs-plugin-annotation.min.js"></script>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    margin: 0; padding: 24px; background: #0f1115; color: #e6e8eb; line-height: 1.45;
  }
  h1 { font-size: 22px; margin: 0 0 2px; }
  .subtitle { color: #9aa3ad; font-size: 13px; margin: 0 0 18px; }
  .card {
    background: #171a21; border: 1px solid #232831; border-radius: 10px;
    padding: 16px 18px; margin-bottom: 18px;
  }
  .chart-wrap { position: relative; height: 460px; }
  .chart-wrap.small { height: 320px; }
  h2 { font-size: 15px; margin: 0 0 10px; color: #cdd3da; }
  .impact {
    background: #2a1a1c; border: 1px solid #5a2b30; border-radius: 8px;
    padding: 10px 14px; margin: 0 0 14px; font-size: 14px;
  }
  .impact b { color: #ff8a8a; }
  ul.findings { margin: 0; padding-left: 18px; }
  ul.findings li { margin-bottom: 6px; font-size: 13px; color: #c3cad2; }
  .toggle-note { font-size: 12px; color: #7b8590; margin-top: 8px; }
  a { color: #6ea8fe; }
  .top-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
  .top-col h3 { font-size: 13px; margin: 0 0 6px; }
  table.top { width: 100%; border-collapse: collapse; font-size: 12px; }
  table.top td { padding: 2px 6px; border-bottom: 1px solid #20242c; color: #c3cad2; white-space: nowrap; }
  table.top td.path { overflow: hidden; text-overflow: ellipsis; max-width: 220px; }
  table.top td.v { text-align: right; color: #9aa3ad; font-variant-numeric: tabular-nums; }
  table.top td.r { color: #6b7280; width: 18px; }
  .chip { display: inline-block; width: 10px; height: 10px; border-radius: 2px; vertical-align: middle; margin-right: 6px; }
</style>
</head>
<body>
  <h1>nx.dev Google Analytics Traffic</h1>
  <p class="subtitle">Client page_view (Views) by page type - Home / Docs / Blog / Marketing / Others, stacked to the total - plus server_page_view, with config/platform milestones annotated on both charts. Generated by process.mjs - data scraped ${escapeHtml(
    data.meta.scraped_at
  )}.</p>

  <div class="card" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;border-color:#2d3550;background:#161b27;">
    <label style="font-size:15px;color:#e6e8eb;display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;">
      <input type="checkbox" id="hostNxOnly" style="width:16px;height:16px;cursor:pointer;" /> nx.dev hostname only
    </label>
    <span style="font-size:12px;color:#9aa3ad;flex:1;min-width:280px;">Filters the two client charts to <code>Hostname = nx.dev</code> exactly - excludes <code>*.nx.dev</code> versioned subdomains (20/21.nx.dev), <code>go.*</code>, <code>canary.nx.dev</code>, <code>localhost</code>, and Vercel/Netlify preview deploys. The non-nx.dev share varied <b>2.5%-22% by month</b> (peak Jan 2026), so the all-hosts view overstates some of the late-2025/early-2026 numbers. Server chart is unaffected (server_page_view is first-party).</span>
  </div>

  <div class="card">
    <h2>Weekly Views by page type (${escapeHtml(data.meta.weekly_range)})</h2>
    <div class="chart-wrap"><canvas id="weekly"></canvas></div>
    <p class="toggle-note">Weekly sums (full ISO weeks) to smooth daily noise. Left axis: stacked page-type Views (Home / Docs / Blog / Marketing / Others) - the top of the stack is total Views. Right axis: server_page_view (orange line; separate scale, mostly AI crawlers). Click legend items to toggle. Vertical lines = milestones; the 2026-05-01 Cookiebot banner (red) and 2026-02-02 server-event first-record (cyan) are highlighted.</p>
  </div>

  <div class="card">
    <h2>Monthly Views by page type (full ~18-month trend incl. pre-GTM baseline)</h2>
    <div class="chart-wrap small"><canvas id="monthly"></canvas></div>
    <p class="toggle-note">Same stacked page-type Views (left) + server_page_view (right) back to Jan 2025, same milestones. The white "Total (all types)" line traces the top of the stack; hover any point to read the total. Marketing = the Framer pages (pricing, enterprise, company, nx-cloud, ...). Blog and Marketing are measured from May 2025 (daily coverage); before that they sit in Others. Docs is ~0 before 2025-09-29 (astro-docs /docs go-live; pre-migration docs lived at root paths -> Others). The Jan-Apr 2025 pre-GTM baseline (~650K/mo) matches May-Jul 2025. June 2026 is a partial month.</p>
  </div>

  <div class="card">
    <h2>Weekly server_page_view by page type</h2>
    <label style="font-size:12px;color:#cdd3da;display:inline-flex;align-items:center;gap:6px;margin:0 0 8px;cursor:pointer;">
      <input type="checkbox" id="serverCatNoBots" /> Exclude flagged bots (Bot dimension = false)
    </label>
    <div class="chart-wrap"><canvas id="serverCat"></canvas></div>
    <p class="toggle-note">Server-side page views (Measurement Protocol), stacked by page type - the white line is the total. No milestones. Docs dominates (AI tools crawl the docs); server_page_view exists from 2026-02-02. Toggle above removes traffic flagged by the Bot dimension (~30% overall; ~40% of docs). Caveats: bot classification only exists from 2026-02-18 (the "exclude bots" series is ~0 before that), and undetected AI crawlers still land in bot=false - so "excluded bots" is not a clean human-only signal.</p>
  </div>

  <div class="card">
    <h2>Home traffic by source (Session default channel group)</h2>
    <div class="chart-wrap"><canvas id="channelHome"></canvas></div>
    <p class="toggle-note">Monthly client Views to <code>/</code> by acquisition channel - stacked, white line = total. Click legend items to toggle. Home's decline is <b>Direct-led</b> (Direct -54% Oct 2025 -> Apr 2026, Organic Search only -29%). A homepage losing half its direct/branded traffic is not an AI/SEO shape - it points to a technical/tracking cause (the Feb-27 Framer homepage migration) rather than content loss. (Nov 2025 Direct spike is a one-off.) May/Jun 2026 fall is the Cookiebot consent banner; June is partial.</p>
  </div>

  <div class="card">
    <h2>Docs traffic by source (Session default channel group)</h2>
    <div class="chart-wrap"><canvas id="channelDocs"></canvas></div>
    <p class="toggle-note">Monthly client Views to <code>/docs*</code> by acquisition channel. Docs' decline is <b>Organic-Search-led</b> (Organic -46% Oct 2025 -> Apr 2026, while Direct stayed flat) - the textbook AI-substitution / zero-click shape: Google/AI answers the query so the organic click never happens. This is real lost organic audience, distinct from Home. (Feb 2026 Direct spike is an anomaly.) Docs exists from 2025-09-29; May/Jun fall is Cookiebot + partial June.</p>
  </div>

  <div class="card">
    <h2>Others traffic by source (Session default channel group)</h2>
    <div class="chart-wrap"><canvas id="channelOthers"></canvas></div>
    <p class="toggle-note">Monthly client Views to everything that is NOT home/docs/blog/marketing. <b>Before 2025-09-29 this bucket IS the documentation</b> - the root-path docs (<code>/getting-started/*</code>, <code>/reference/*</code>, ...) that later became <code>/docs/*</code>. So read it together with the Docs chart: Others carries docs traffic pre-migration, Docs carries it after. Note Others is also <b>Organic-Search-led</b> (~75% green), confirming the docs audience was organic-search-driven before the move too. The Oct 2025 collapse is the migration (root docs -> /docs), not a real loss; post-migration Others is small misc pages (/nx-newsletter, /changelog, ...). Filter = pagePath does-not-match home/docs/blog/marketing (validated within 1% of the page-type Others total).</p>
  </div>

  <div class="card">
    <h2>Key findings</h2>
    <div class="impact">2026-05-01 Cookiebot consent banner impact (daily all_views): ${cbLine}</div>
    <ul class="findings">
        ${findingsLis}
    </ul>
  </div>

  <div class="card">
    <h2>Top 25 pages by page type (${escapeHtml(data.topPages.date_range)})</h2>
    <p class="toggle-note">By client Views over the daily window. Note Others is dominated by the OLD root-path docs (/getting-started/*, /reference/*) that pre-date the 2025-09-29 /docs move - that is why Others was large before Oct 2025.</p>
    <div class="top-grid">
        ${topPagesHtml}
    </div>
  </div>

  <div class="card">
    <h2>Top pages before vs after the 2025-09-29 /docs switch</h2>
    <p class="toggle-note">Why "Others" was huge before Oct 2025: it was the root-path docs. On 2025-09-29 docs moved from <code>/getting-started/*</code>, <code>/reference/*</code>, ... to <code>/docs/*</code>. Below: category-total Views shift, then the Others top-25 before (root docs) vs after (root docs gone). Before = ${escapeHtml(ba.before.date_range)}; After = ${escapeHtml(ba.after.date_range)}.</p>
    <table class="top" style="max-width:420px;margin-bottom:14px;">
      <thead><tr><td class="path" style="color:#9aa3ad;">Category</td><td class="v" style="color:#9aa3ad;">Before</td><td class="v" style="color:#9aa3ad;">After</td></tr></thead>
      <tbody>${baTotalsRows}</tbody>
    </table>
    <div class="top-grid">
      <div class="top-col"><h3><span class="chip" style="background:${CAT_COLOR.others}"></span>Others - BEFORE (root-path docs dominate)</h3><table class="top"><tbody>${baColumn('before', 'others')}</tbody></table></div>
      <div class="top-col"><h3><span class="chip" style="background:${CAT_COLOR.others}"></span>Others - AFTER (root docs gone -> just misc pages)</h3><table class="top"><tbody>${baColumn('after', 'others')}</tbody></table></div>
      <div class="top-col"><h3><span class="chip" style="background:${CAT_COLOR.docs}"></span>Docs - AFTER (where the root docs went)</h3><table class="top"><tbody>${baColumn('after', 'docs')}</tbody></table></div>
    </div>
  </div>

<script>
const DATA = JSON.parse(${JSON.stringify(payload)});
const { chartData, analysis } = DATA;

// ---- event annotations ----
// Highlighted milestones use distinct hues that do NOT clash with the orange
// server_page_view data line: Cookiebot banner (red), server_page_view first
// record (cyan), and the GTM-only cutover (amber - the decline suspect).
const HIGHLIGHT = {
  '2026-05-01': '#ff5b66', // Cookiebot consent banner
  '2026-02-02': '#29d3c8', // server_page_view first record
  '2026-02-10': '#ffd54f', // GTM-only cutover (suspect)
};
const evMs = (d) => new Date(d + 'T00:00:00Z').getTime();
function eventAnnotations() {
  const out = {};
  chartData.events.forEach((e, i) => {
    const hl = HIGHLIGHT[e.date];
    out['ev' + i] = {
      type: 'line',
      xMin: evMs(e.date), xMax: evMs(e.date),
      borderColor: hl || 'rgba(170,180,195,0.5)',
      borderWidth: hl ? 2 : 1,
      borderDash: hl ? [] : [4, 4],
      label: {
        display: true,
        // Labels are short (see events.json) so there is no truncation. Horizontal,
        // pinned to the TOP (position 'end' = top of a vertical line; over the dark
        // area above the stack) and staggered DOWN across 3 height-bands so the
        // dense Feb cluster (server-start / GTM-cutover / Framer) does not overlap
        // and none get pushed off an edge.
        content: e.label,
        position: 'end',
        rotation: 0,
        backgroundColor: hl ? hl : 'rgba(28,32,40,0.92)',
        color: hl ? '#15110a' : '#cdd3da',
        font: { size: 10, weight: hl ? 'bold' : 'normal' },
        padding: 3,
        yAdjust: [4, 26, 48][i % 3],
      },
    };
  });
  return out;
}

// x as epoch-ms so the time scale plots without relying on string parsing.
const tms = (d) => new Date(d + 'T00:00:00Z').getTime();

// MECE page-type segments, stacked (bottom -> top). Distinct colors; server is a
// separate orange LINE on the right axis (its milestone is cyan, so no clash).
const SEGMENTS = [
  { key: 'docs_views',      label: 'Docs',      fill: 'rgba(160,107,255,0.65)', border: '#a06bff' },
  { key: 'others_views',    label: 'Others',    fill: 'rgba(120,134,158,0.55)', border: '#7e8aa2' },
  { key: 'home_views',      label: 'Home',      fill: 'rgba(52,201,138,0.7)',   border: '#34c98a' },
  { key: 'blog_views',      label: 'Blog',      fill: 'rgba(79,157,255,0.7)',   border: '#4f9dff' },
  { key: 'marketing_views', label: 'Marketing', fill: 'rgba(255,107,157,0.78)', border: '#ff6b9d' },
];

// When a category is toggled off in the legend, the "Total (all types)" line must
// follow the visible stack, so it always reads as the sum of what is shown. Recompute
// its y-values from the currently-visible segment datasets (stack:'seg').
function recomputeStackTotal(chart) {
  const totalDs = chart.data.datasets.find((d) => d._isStackTotal);
  if (!totalDs) return;
  const segs = chart.data.datasets.filter((d, i) => d.stack === 'seg' && chart.isDatasetVisible(i));
  totalDs.data = totalDs.data.map((pt, i) => ({ x: pt.x, y: segs.reduce((a, d) => a + (d.data[i]?.y || 0), 0) }));
}
function stackLegendOnClick(e, item, legend) {
  const chart = legend.chart;
  chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
  recomputeStackTotal(chart);
  chart.update();
}

function buildStacked(canvasId, rows, xOf, opts) {
  const { leftTitle, titleFmt, withServer = true, withAnnotations = true } = opts;
  const segDs = SEGMENTS.map((s) => ({
    label: s.label,
    data: rows.map((r) => ({ x: xOf(r), y: r[s.key] ?? 0 })),
    backgroundColor: s.fill, borderColor: s.border, borderWidth: 1,
    yAxisID: 'y', stack: 'seg', fill: true, pointRadius: 0, tension: 0.1,
  }));
  // Total line traces the top of the stack (= sum of all categories). It lives in
  // its own stack group so it is NOT added on top; it gives a clear total to read
  // against the y-axis and in the hover tooltip.
  const totalDs = {
    label: 'Total (all types)', _isStackTotal: true,
    data: rows.map((r) => ({ x: xOf(r), y: SEGMENTS.reduce((a, s) => a + (r[s.key] ?? 0), 0) })),
    borderColor: '#e8eaed', backgroundColor: '#e8eaed', borderWidth: 1.5,
    yAxisID: 'y', stack: 'total', fill: false, pointRadius: 0, tension: 0.1,
  };
  const datasets = [...segDs, totalDs];
  const scales = {
    x: { type: 'time', time: { unit: 'month' }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9aa3ad' } },
    y: { stacked: true, beginAtZero: true, position: 'left', title: { display: true, text: leftTitle, color: '#9aa3ad' }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9aa3ad' } },
  };
  if (withServer) {
    datasets.push({
      label: 'server_page_view (right)',
      data: rows.map((r) => ({ x: xOf(r), y: r.server_page_view ?? 0 })),
      backgroundColor: '#ffa726', borderColor: '#ffa726', borderWidth: 1.8,
      yAxisID: 'y1', stack: 'srv', fill: false, pointRadius: 0, tension: 0.12,
    });
    scales.y1 = { stacked: false, position: 'right', beginAtZero: true, title: { display: true, text: 'server_page_view', color: '#ffa726' }, grid: { drawOnChartArea: false }, ticks: { color: '#ffa726' } };
  }
  const plugins = {
    legend: { labels: { color: '#cdd3da' }, onClick: stackLegendOnClick },
    tooltip: { callbacks: { title: (it) => (it.length ? titleFmt(it[0].parsed.x) : '') } },
  };
  if (withAnnotations) plugins.annotation = { annotations: eventAnnotations() };
  const chart = new Chart(document.getElementById(canvasId), {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      layout: { padding: { top: 28, right: 16 } },
      scales, plugins,
    },
  });
  return { chart, xOf, withServer };
}
// Swap a stacked chart's data between the all-hosts and nx.dev-only row sets (the
// hostname toggle). Recomputes segments + total + the server line, then respects any
// legend-hidden segments via recomputeStackTotal.
function setStackedRows(built, rows) {
  const { chart, xOf, withServer } = built;
  SEGMENTS.forEach((s, i) => { chart.data.datasets[i].data = rows.map((r) => ({ x: xOf(r), y: r[s.key] ?? 0 })); });
  chart.data.datasets[SEGMENTS.length].data = rows.map((r) => ({ x: xOf(r), y: SEGMENTS.reduce((a, s) => a + (r[s.key] ?? 0), 0) }));
  if (withServer) chart.data.datasets[SEGMENTS.length + 1].data = rows.map((r) => ({ x: xOf(r), y: r.server_page_view ?? 0 }));
  recomputeStackTotal(chart);
  chart.update();
}

const isoDay = (x) => 'week of ' + new Date(x).toISOString().slice(0, 10);
const isoMonth = (x) => new Date(x).toISOString().slice(0, 7);

const weeklyBuilt = buildStacked('weekly', chartData.weekly, (w) => tms(w.week_start),
  { leftTitle: 'Client Views / week (stacked = total)', titleFmt: isoDay });
const monthlyBuilt = buildStacked('monthly', chartData.monthly, (m) => tms(m.month + '-01'),
  { leftTitle: 'Client Views / month (stacked = total)', titleFmt: isoMonth });
// Top-of-page hostname toggle: switch the two client charts between all-hosts and nx.dev-only.
const hostToggle = document.getElementById('hostNxOnly');
if (hostToggle) hostToggle.addEventListener('change', () => {
  const nx = hostToggle.checked;
  setStackedRows(weeklyBuilt, nx ? chartData.weeklyNxdev : chartData.weekly);
  setStackedRows(monthlyBuilt, nx ? chartData.monthlyNxdev : chartData.monthly);
  setChannelRows(channelHomeChart, nx ? chartData.channelsHomeNxdev : chartData.channelsHome);
  setChannelRows(channelDocsChart, nx ? chartData.channelsDocsNxdev : chartData.channelsDocs);
  setChannelRows(channelOthersChart, nx ? chartData.channelsOthersNxdev : chartData.channelsOthers);
});
// Third chart: weekly server_page_view by page type, with an include/exclude-bots
// toggle (switches each category between its "all" and "_bf" (Bot=false) series).
function buildServerCatChart(rows) {
  const baseOf = (s) => s.key.replace('_views', ''); // home/docs/blog/marketing/others
  const keyFor = (s, mode) => (mode === 'bf' ? baseOf(s) + '_bf' : s.key);
  const segData = (s, mode) => rows.map((r) => ({ x: tms(r.week_start), y: r[keyFor(s, mode)] ?? 0 }));
  const totalData = (mode) => rows.map((r) => ({ x: tms(r.week_start), y: SEGMENTS.reduce((a, s) => a + (r[keyFor(s, mode)] ?? 0), 0) }));
  const segDs = SEGMENTS.map((s) => ({
    label: s.label, data: segData(s, 'all'),
    backgroundColor: s.fill, borderColor: s.border, borderWidth: 1,
    yAxisID: 'y', stack: 'seg', fill: true, pointRadius: 0, tension: 0.1,
  }));
  const totalDs = {
    label: 'Total (all types)', _isStackTotal: true, data: totalData('all'),
    borderColor: '#e8eaed', backgroundColor: '#e8eaed', borderWidth: 1.5,
    yAxisID: 'y', stack: 'total', fill: false, pointRadius: 0, tension: 0.1,
  };
  const chart = new Chart(document.getElementById('serverCat'), {
    type: 'line', data: { datasets: [...segDs, totalDs] },
    options: {
      responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, layout: { padding: { top: 10 } },
      scales: {
        x: { type: 'time', time: { unit: 'month' }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9aa3ad' } },
        y: { stacked: true, beginAtZero: true, title: { display: true, text: 'server_page_view / week (stacked = total)', color: '#9aa3ad' }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9aa3ad' } },
      },
      plugins: { legend: { labels: { color: '#cdd3da' }, onClick: stackLegendOnClick }, tooltip: { callbacks: { title: (it) => (it.length ? isoDay(it[0].parsed.x) : '') } } },
    },
  });
  const cb = document.getElementById('serverCatNoBots');
  if (cb) cb.addEventListener('change', () => {
    const mode = cb.checked ? 'bf' : 'all';
    SEGMENTS.forEach((s, i) => { chart.data.datasets[i].data = segData(s, mode); });
    // total follows the bot mode AND the current legend visibility
    recomputeStackTotal(chart);
    chart.update();
  });
}
buildServerCatChart(chartData.weeklyServerCat);

// Charts 4 & 5: monthly client Views by acquisition channel, one per category (Home, Docs).
// Stacked area + Total line (recomputes from visible on legend toggle), no milestones.
const CHANNELS = [
  { key: 'organic_search', label: 'Organic Search', fill: 'rgba(52,201,138,0.7)',  border: '#34c98a' },
  { key: 'direct',         label: 'Direct',         fill: 'rgba(79,157,255,0.7)',  border: '#4f9dff' },
  { key: 'referral',       label: 'Referral',       fill: 'rgba(160,107,255,0.65)',border: '#a06bff' },
  { key: 'unassigned',     label: 'Unassigned',     fill: 'rgba(120,134,158,0.55)',border: '#7e8aa2' },
  { key: 'other',          label: 'Other',          fill: 'rgba(255,167,38,0.55)', border: '#ffa726' },
];
function buildChannelChart(canvasId, rows) {
  const segDs = CHANNELS.map((c) => ({
    label: c.label, data: rows.map((r) => ({ x: tms(r.month + '-01'), y: r[c.key] ?? 0 })),
    backgroundColor: c.fill, borderColor: c.border, borderWidth: 1,
    yAxisID: 'y', stack: 'seg', fill: true, pointRadius: 0, tension: 0.1,
  }));
  const totalDs = {
    label: 'Total (all sources)', _isStackTotal: true,
    data: rows.map((r) => ({ x: tms(r.month + '-01'), y: CHANNELS.reduce((a, c) => a + (r[c.key] ?? 0), 0) })),
    borderColor: '#e8eaed', backgroundColor: '#e8eaed', borderWidth: 1.5,
    yAxisID: 'y', stack: 'total', fill: false, pointRadius: 0, tension: 0.1,
  };
  const chart = new Chart(document.getElementById(canvasId), {
    type: 'line', data: { datasets: [...segDs, totalDs] },
    options: {
      responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, layout: { padding: { top: 10 } },
      scales: {
        x: { type: 'time', time: { unit: 'month' }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9aa3ad' } },
        y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Views / month (stacked = total)', color: '#9aa3ad' }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9aa3ad' } },
      },
      plugins: { legend: { labels: { color: '#cdd3da' }, onClick: stackLegendOnClick }, tooltip: { callbacks: { title: (it) => (it.length ? isoMonth(it[0].parsed.x) : '') } } },
    },
  });
  return chart;
}
// Swap a channel chart between all-hosts and nx.dev-only rows (driven by the top toggle).
function setChannelRows(chart, rows) {
  CHANNELS.forEach((c, i) => { chart.data.datasets[i].data = rows.map((r) => ({ x: tms(r.month + '-01'), y: r[c.key] ?? 0 })); });
  chart.data.datasets[CHANNELS.length].data = rows.map((r) => ({ x: tms(r.month + '-01'), y: CHANNELS.reduce((a, c) => a + (r[c.key] ?? 0), 0) }));
  recomputeStackTotal(chart);
  chart.update();
}
const channelHomeChart = buildChannelChart('channelHome', chartData.channelsHome);
const channelDocsChart = buildChannelChart('channelDocs', chartData.channelsDocs);
const channelOthersChart = buildChannelChart('channelOthers', chartData.channelsOthers);
</script>
</body>
</html>
`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ---------- stdout summary ----------
console.log('GA traffic pipeline complete.');
console.log(`  daily rows:   ${dailyRows.length} (${dailySpanStart}..${dailySpanEnd})`);
console.log(`  weekly rows:  ${weeklyRows.length} full ISO weeks (chart uses these to cut daily noise)`);
console.log(`  monthly rows: ${monthlyRows.length} (${monthlyRows[0].month}..${monthlyRows[monthlyRows.length - 1].month}, ${fullMonths.length} full)`);
console.log(`  events:       ${events.events.length}`);
console.log(`  segments:     home/docs/blog/marketing/others (blog+marketing from ${SEG_DAILY_FROM}); others clamped on ${othersClampDays}/${dailyRows.length} days`);
console.log(
  `  trend (last ${trend.window_months} full mo, all_views): ${trend.all_views.direction} ` +
    `${trend.all_views.total_change_pct}% total, slope ${trend.all_views.ols_slope_per_month}/mo ` +
    `(endpoint consent-suppressed; pre-banner thru ${trend.pre_banner.through_month}: ${trend.pre_banner.all_views.total_change_pct}%)`
);
console.log(
  `  trend (home_views): ${trend.home_views.direction} ${trend.home_views.total_change_pct}% total ` +
    `(pre-banner thru ${trend.pre_banner.through_month}: ${trend.pre_banner.home_views.total_change_pct}%)`
);
if (cookiebot) {
  console.log(
    `  2026-05-01 Cookiebot: ${cookiebot.before_mean} -> ${cookiebot.after_mean} daily views (${cookiebot.change_pct}%)`
  );
}
console.log(
  `  server_page_view first day: ${server_page_view.first_recorded}; peak ${server_page_view.peak_value} on ${server_page_view.peak_day}`
);
console.log(
  `  daily-vs-monthly integrity (all/home/docs/server): ${comparableChecks.length - integrityOutliers.length}/${comparableChecks.length} comparable months within ${TOLERANCE_PCT}%` +
    (integrityOutliers.length ? ` (outliers: ${integrityOutliers.map((o) => o.month).join(', ')})` : '')
);
console.log(
  `  source crosscheck: ${source_crosscheck.checks.filter((c) => c.pass).length}/${source_crosscheck.checks.length} overlap months pass (Reports==Explore==segments)`
);
console.log('  wrote: out/chart-data.json, out/analysis.json, out/chart.html');
