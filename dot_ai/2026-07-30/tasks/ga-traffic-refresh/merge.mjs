// Merges the 2026-07-30 GA4/GSC scrape (Jun 19 - Jul 29) into the ga-traffic raw files.
// Run: node merge.mjs   (idempotent - keyed by date)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const RAW = join(here, '../../../2026-06-19/tasks/ga-traffic/raw');
const ga = JSON.parse(readFileSync(join(here, 'ga4-scrape-2026-07-30.json')));
const gsc = JSON.parse(readFileSync(join(here, 'gsc-scrape-2026-07-30.json')));

const TODAY = '2026-07-30';
const END = '2026-07-29';
const diffs = [];

const iso = (d) => `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
// series name -> Map(date -> metric[0])
const S = {};
for (const [k, rows] of Object.entries(ga)) {
  S[k] = new Map(rows.map((r) => [r.d[0].length === 8 ? iso(r.d[0]) : r.d[0], r.m]));
}

function load(f) { return JSON.parse(readFileSync(join(RAW, f))); }
function save(f, j) { writeFileSync(join(RAW, f), JSON.stringify(j, null, 2) + '\n'); }

function upsert(fileRows, date, fresh, buildRow) {
  const i = fileRows.findIndex((r) => r.date === date);
  if (i >= 0) {
    const oldViews = fileRows[i].views ?? fileRows[i].server_page_view ?? fileRows[i].all ?? fileRows[i].total;
    const newViews = fresh.views ?? fresh.server_page_view ?? fresh.all ?? fresh.total;
    if (oldViews !== newViews) diffs.push(`${date}: ${oldViews} -> ${newViews} (${buildRow})`);
    fileRows[i] = { ...fileRows[i], ...fresh };
  } else {
    fileRows.push(fresh);
  }
}

const dates = [...S.all.keys()].sort(); // 2026-06-19 .. 2026-07-29

// --- daily-all / daily-home / daily-docs (rows have views/AU[/event_count_all]) ---
for (const [file, key, extra] of [
  ['daily-all.json', 'all', { event_count_all: null }],
  ['daily-home.json', 'home', {}],
  ['daily-docs.json', 'docs', {}],
  ['daily-blog.json', 'blog', {}],
  ['daily-marketing.json', 'marketing', {}],
]) {
  const j = load(file);
  for (const d of dates) {
    upsert(j.rows, d, { date: d, views: S[key].get(d)[0], active_users: null, ...extra }, file);
  }
  j.rows.sort((a, b) => a.date.localeCompare(b.date));
  j.count = j.rows.length;
  j.date_range = j.date_range.replace(/\.\.[0-9-]+/, '..' + END);
  j.scraped_at = j.scraped_at ? TODAY : undefined;
  j.refresh_note = (j.refresh_note ? j.refresh_note + ' ' : '') +
    `Jun 28 - Jul 29 appended ${TODAY} (Jun 19-27 overlap re-verified; views only, AU/event_count null). July stays consent-suppressed (Cookiebot).`;
  save(file, j);
}

// --- daily-nxdev-by-category ---
{
  const j = load('daily-nxdev-by-category.json');
  for (const d of dates) {
    const all = S.allN.get(d)[0], home = S.homeN.get(d)[0], docs = S.docsN.get(d)[0],
      blog = S.blogN.get(d)[0], marketing = S.mktN.get(d)[0];
    upsert(j.rows, d, { date: d, all, home, docs, blog, marketing, others: all - home - docs - blog - marketing }, 'nxdev');
  }
  j.rows.sort((a, b) => a.date.localeCompare(b.date));
  j.count = j.rows.length;
  j.date_range = j.date_range.replace(/\.\.[0-9-]+/, '..' + END);
  j.scraped_at = TODAY;
  save('daily-nxdev-by-category.json', j);
}

// --- daily-server ---
{
  const j = load('daily-server.json');
  for (const d of dates) {
    upsert(j.rows, d, { date: d, server_page_view: S.server.get(d)[0], active_users: null, views_should_be_0: 0 }, 'server');
  }
  j.rows.sort((a, b) => a.date.localeCompare(b.date));
  j.count = j.rows.length;
  j.date_range = j.date_range.replace(/\.\.[0-9-]+/, '..' + END);
  j.refresh_note = (j.refresh_note ? j.refresh_note + ' ' : '') +
    `Jun 28 - Jul 29 appended ${TODAY} (overlap Jun 19-27 re-verified).`;
  save('daily-server.json', j);
}

// --- daily-server-by-category ---
{
  const j = load('daily-server-by-category.json');
  for (const d of dates) {
    upsert(j.rows, d, {
      date: d,
      home: S.srv_home.get(d)[0], docs: S.srv_docs.get(d)[0], blog: S.srv_blog.get(d)[0],
      marketing: S.srv_mkt.get(d)[0], total: S.server.get(d)[0],
      home_bf: S.srv_home_bf.get(d)[0], docs_bf: S.srv_docs_bf.get(d)[0], blog_bf: S.srv_blog_bf.get(d)[0],
      marketing_bf: S.srv_mkt_bf.get(d)[0], total_bf: S.srv_total_bf.get(d)[0],
    }, 'server-by-cat');
  }
  j.rows.sort((a, b) => a.date.localeCompare(b.date));
  j.count = j.rows.length;
  j.date_range = j.date_range.replace(/\.\.[0-9-]+/, '..' + END);
  j.scraped_at = TODAY;
  save('daily-server-by-category.json', j);
}

// --- gsc-daily ---
{
  const j = load('gsc-daily.json');
  for (const row of gsc.days) {
    const i = j.days.findIndex((r) => r.date === row.date);
    if (i >= 0) {
      if (j.days[i].clicks !== row.clicks || j.days[i].impressions !== row.impressions)
        diffs.push(`gsc ${row.date}: ${j.days[i].clicks}/${j.days[i].impressions} -> ${row.clicks}/${row.impressions}`);
      j.days[i] = row;
    } else j.days.push(row);
  }
  j.days.sort((a, b) => a.date.localeCompare(b.date));
  j.last_recorded = END;
  j.scraped_at = TODAY;
  j.note = j.note.replace(/refreshed through [0-9-]+/i, 'refreshed through ' + END);
  if (!/refreshed through/.test(j.note)) j.note += ` Refreshed through ${END} on ${TODAY}.`;
  save('gsc-daily.json', j);
}

// --- channels-by-month ---
{
  const j = load('channels-by-month.json');
  const TOP = { organic_search: 'Organic Search', direct: 'Direct', referral: 'Referral', unassigned: 'Unassigned' };
  const build = (rows, ym) => {
    const inMonth = rows.filter((r) => r.d[0] === ym.slice(5));
    const byCh = Object.fromEntries(inMonth.map((r) => [r.d[1], r.m[0]]));
    const out = { month: ym };
    let used = 0;
    for (const [k, label] of Object.entries(TOP)) { out[k] = byCh[label] || 0; used += out[k]; }
    out.other = inMonth.reduce((s, r) => s + r.m[0], 0) - used;
    return out;
  };
  const secs = { home: 'ch_home', docs: 'ch_docs', others: 'ch_others', homeNxdev: 'ch_homeN', docsNxdev: 'ch_docsN', othersNxdev: 'ch_othersN' };
  for (const [sec, key] of Object.entries(secs)) {
    for (const ym of ['2026-06', '2026-07']) {
      const row = build(ga[key], ym);
      const i = j[sec].findIndex((r) => r.month === ym);
      if (i >= 0) j[sec][i] = row; else j[sec].push(row);
    }
  }
  j.scraped_at = TODAY;
  save('channels-by-month.json', j);
}

console.log('merged through ' + END);
console.log(diffs.length ? 'OVERLAP DIFFS:\n' + diffs.join('\n') : 'no overlap diffs');
