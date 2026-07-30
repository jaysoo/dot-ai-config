// One-off: insert GA refresh at #1 in TODO.md Recent Tasks, renumber, drop the 11th.
import { readFileSync, writeFileSync } from 'node:fs';
const f = '/Users/jack/projects/dot-ai-config/dot_ai/TODO.md';
let s = readFileSync(f, 'utf8');

const entry = `1. **ga-traffic refresh: nx.dev GA4+GSC data through 2026-07-29 (dot-ai-config)** (2026-07-30)
   - Summary: Refreshed ALL raw series in the ga-traffic pipeline (8 GA4 dailies, gsc-daily, monthly-segments Jun-final+Jul-partial, channels-by-month) via a new in-page GA4 internal-RPC replay method (XSRF header + secondary-dimension gotcha documented). Reran process.mjs (455 days, 14/14 integrity). Jul: GSC organic still falling ~-11%/mo (49.3K clicks thru Jul 29 vs Jun 59K); server_page_view flat ~5.1-5.4M/mo; AI crawlers shifted into /blog (now ~30% of server events).
   - Files: \`dot_ai/2026-07-30/tasks/ga-traffic-refresh/\` (scrapes + merge.mjs + README), pipeline at \`dot_ai/2026-06-19/tasks/ga-traffic/\`

`;

// bump existing 1..10 -> 2..11, then insert new #1, then drop #11
const lines = s.split('\n');
const out = [];
let dropping = false;
for (const line of lines) {
  const m = line.match(/^(\d+)\. \*\*/);
  if (m) {
    const n = Number(m[1]) + 1;
    dropping = n > 10;
    if (!dropping) out.push(line.replace(/^\d+\./, n + '.'));
    continue;
  }
  if (dropping) {
    if (/^\s{3}- /.test(line) || line.trim() === '') continue; // body of dropped entry
    dropping = false;
  }
  out.push(line);
}
s = out.join('\n');
s = s.replace(/(<!-- Ordered from most recent to least recent\. Used for quick context rebuilding\. -->\n\n)/, '$1' + entry);
writeFileSync(f, s);
console.log('TODO.md updated');
