// Generates raw/monthly-segments.json from the verified scrape array.
// Run: node _gen-monthly.mjs   (writes monthly-segments.json next to this file)
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { raw } from '../../ga-monthly-traffic.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = {
  metric_note: 'Views = GA4 screenPageViews (client page_view). server_page_view = custom event count via Measurement Protocol. au = Active users.',
  source: {
    '2025-01..2025-04': 'GA4 standard Reports > Engagement > Pages and screens (Page path dim); Explore capped at ~14mo retention.',
    '2025-05..2026-06': 'GA4 Explore free-form, Nth month dim.',
  },
  scraped_at: '2026-06-19',
  rows: raw.map((r) => ({
    month: r.month,
    all_views: r.views,
    all_active_users: r.au,
    home_views: r.homeViews,
    home_active_users: r.homeAu,
    docs_views: r.docsViews,
    docs_active_users: r.docsAu,
    non_docs_views: r.views - r.docsViews,
    server_page_view: r.serverPv,
    partial: r.partial,
  })),
};
writeFileSync(join(here, 'monthly-segments.json'), JSON.stringify(out, null, 2) + '\n');
console.error('wrote monthly-segments.json with', out.rows.length, 'rows');
