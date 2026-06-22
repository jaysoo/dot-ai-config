import { readFileSync } from 'node:fs';

const d = JSON.parse(
  readFileSync(
    '/Users/jack/projects/dot-ai-config/dot_ai/2026-06-19/tasks/ga-traffic/out/chart-data.json',
    'utf-8'
  )
);

const CATS = [
  'all_views',
  'home_views',
  'docs_views',
  'blog_views',
  'marketing_views',
  'others_views',
];

function pct(a, b) {
  // % change from a -> b
  if (a == null || b == null || a === 0) return null;
  return ((b - a) / a) * 100;
}

function fmt(x) {
  if (x == null) return '   . ';
  const s = (x >= 0 ? '+' : '') + x.toFixed(1);
  return s.padStart(7);
}

function analyze(seriesName) {
  const rows = d[seriesName];
  console.log('\n================ ' + seriesName + ' ================');
  // MoM table
  for (const cat of CATS) {
    console.log('\n--- ' + cat + ' MoM % ---');
    let steepDecl = { pct: Infinity, month: null };
    for (let i = 1; i < rows.length; i++) {
      const prev = rows[i - 1][cat];
      const cur = rows[i][cat];
      const p = pct(prev, cur);
      const partialTag = rows[i].partial ? ' (PARTIAL)' : '';
      let pTag = '';
      if (p != null && !rows[i].partial && p < steepDecl.pct) {
        steepDecl = { pct: p, month: rows[i].month };
      }
      console.log(
        `  ${rows[i - 1].month}->${rows[i].month}  ${String(prev).padStart(7)} -> ${String(cur).padStart(7)}  ${fmt(p)}%${partialTag}`
      );
    }
    console.log(
      `  STEEPEST DECLINE (non-partial): ${steepDecl.month} = ${steepDecl.pct === Infinity ? 'n/a' : steepDecl.pct.toFixed(1) + '%'}`
    );
  }
}

function netWindow(seriesName, fromMonth, toMonth, label) {
  const rows = d[seriesName];
  const from = rows.find((r) => r.month === fromMonth);
  const to = rows.find((r) => r.month === toMonth);
  console.log(`\n### NET CHANGE ${seriesName} ${fromMonth} -> ${toMonth} (${label})`);
  for (const cat of CATS) {
    const a = from[cat];
    const b = to[cat];
    const p = pct(a, b);
    console.log(
      `  ${cat.padEnd(16)} ${String(a).padStart(8)} -> ${String(b).padStart(8)}  net ${p == null ? '   .' : (p >= 0 ? '+' : '') + p.toFixed(1) + '%'}`
    );
  }
}

for (const s of ['monthly', 'monthlyNxdev']) analyze(s);

// Net-change windows. "Organic through April" = read THROUGH April 2026 (pre-Cookiebot).
console.log('\n\n############ NET CHANGE WINDOWS ############');
// Post-docs-migration window: Oct 2025 -> Apr 2026 (docs/others valid only post-migration)
for (const s of ['monthly', 'monthlyNxdev']) {
  netWindow(s, '2025-10', '2026-04', 'post-docs-migration -> last pre-Cookiebot full month');
}
// Full comparable window for home/all/blog/marketing that don't depend on docs migration:
// May 2025 (first month with blog/mkt split) -> Apr 2026
for (const s of ['monthly', 'monthlyNxdev']) {
  netWindow(s, '2025-05', '2026-04', 'first blog/mkt split -> last pre-Cookiebot full month');
}
// Cookiebot measurement cliff: Apr -> May 2026
for (const s of ['monthly', 'monthlyNxdev']) {
  netWindow(s, '2026-04', '2026-05', 'Cookiebot consent cliff');
}

// Server page_view sanity: does it hold across the May cliff?
console.log('\n\n############ SERVER PAGE_VIEW (consent-independent) ############');
for (const r of d.monthly) {
  if (r.server_page_view > 0)
    console.log(`  ${r.month}  server_page_view=${r.server_page_view}${r.partial ? ' (PARTIAL)' : ''}`);
}
