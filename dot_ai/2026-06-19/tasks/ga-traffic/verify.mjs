import { readFileSync } from 'node:fs';
const d = JSON.parse(
  readFileSync(
    '/Users/jack/projects/dot-ai-config/dot_ai/2026-06-19/tasks/ga-traffic/out/chart-data.json',
    'utf-8'
  )
);
const pct = (a, b) => (a == null || b == null || a === 0 ? null : ((b - a) / a) * 100);

// Prior-finding check: Oct 2025 -> Apr 2026, home/docs/blog clustered ~33-43% decline, marketing +.
console.log('PRIOR-FINDING CHECK: Oct 2025 -> Apr 2026 net %');
for (const s of ['monthly', 'monthlyNxdev']) {
  const o = d[s].find((r) => r.month === '2025-10');
  const a = d[s].find((r) => r.month === '2026-04');
  console.log(' ', s);
  for (const c of ['home_views', 'docs_views', 'blog_views', 'marketing_views']) {
    console.log('    ', c.padEnd(16), pct(o[c], a[c]).toFixed(1) + '%');
  }
}

// How tight is the home/docs/blog cluster (stdev) vs marketing as outlier?
console.log('\nCLUSTER TIGHTNESS (Oct->Apr, monthly all-hosts):');
const o = d.monthly.find((r) => r.month === '2025-10');
const a = d.monthly.find((r) => r.month === '2026-04');
const cluster = ['home_views', 'docs_views', 'blog_views'].map((c) => pct(o[c], a[c]));
const mean = cluster.reduce((x, y) => x + y, 0) / cluster.length;
const sd = Math.sqrt(cluster.reduce((x, y) => x + (y - mean) ** 2, 0) / cluster.length);
console.log('  home/docs/blog:', cluster.map((x) => x.toFixed(1)).join(', '), '| mean', mean.toFixed(1), '| sd', sd.toFixed(1));
console.log('  marketing:', pct(o.marketing_views, a.marketing_views).toFixed(1));

// Server page_view across the Apr->May Cookiebot cliff (consent-independent)
console.log('\nSERVER PAGE_VIEW around Cookiebot (Apr->May 2026):');
const sa = d.monthly.find((r) => r.month === '2026-04').server_page_view;
const sm = d.monthly.find((r) => r.month === '2026-05').server_page_view;
console.log('  Apr', sa, '-> May', sm, '=', pct(sa, sm).toFixed(1) + '% (server, consent-independent)');
console.log('  client all_views same window:', pct(296525, 94774).toFixed(1) + '%');

// Seasonality check: Aug dip and Dec dip, YoY-ish within series
console.log('\nSEASONALITY (all_views MoM):');
for (const [from, to, lbl] of [
  ['2025-07', '2025-08', 'summer Aug dip'],
  ['2025-11', '2025-12', 'Dec holiday dip'],
]) {
  const f = d.monthly.find((r) => r.month === from);
  const t = d.monthly.find((r) => r.month === to);
  console.log('  ', lbl, pct(f.all_views, t.all_views).toFixed(1) + '%');
}

// Marketing absolute: did it actually GROW in raw counts through Apr? (real new-page growth)
console.log('\nMARKETING raw trajectory Dec25->Apr26 (monthly):');
for (const m of ['2025-12', '2026-01', '2026-02', '2026-03', '2026-04']) {
  console.log('  ', m, d.monthly.find((r) => r.month === m).marketing_views);
}

// Docs: Feb 2026 peak then decline. Confirm Feb peak.
console.log('\nDOCS peak + decline onset (monthly):');
for (const m of ['2026-01', '2026-02', '2026-03', '2026-04']) {
  const r = d.monthly.find((x) => x.month === m);
  console.log('  ', m, r.docs_views);
}
