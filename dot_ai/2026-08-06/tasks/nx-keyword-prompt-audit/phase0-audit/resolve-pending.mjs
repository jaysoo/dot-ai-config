// Resolves the 20 `keep-pending-evidence` verdicts and the one overturned verdict,
// using phase3-qualitative/00-ci-observability-verdict.md. Writes audit-final.csv.
import fs from 'node:fs';

const RESOLVE = {
  // survived the >=3 qualitative-evidence bar
  'ci compute cost': ['keep', 'PASS: 8 qualitative evidence items, strongest in the cluster'],
  'ci caching': ['keep', 'PASS: 6 evidence items; DOC-555 kb/ci-caching maps to it'],
  'speed up ci': ['keep', 'PASS: 4 evidence items'],
  'why is my ci slow': ['keep', 'PASS: 3 evidence items (rephrased); question framing, feeds the prompt set'],
  'github actions runner out of memory': ['keep', 'PASS: 4 evidence items. Caveat: demand sits in self-hosted/ARC contexts, not hosted runners'],

  // real demand, wrong wording -> swap for the phrasing that has volume
  'github actions slow workflow': ['replace-with:github actions slow', 'long form has no Ahrefs record; `github actions slow` = 60 vol KD 1. Intent is queue delay, so treat as competitor-adjacent, not an Nx content target'],
  'ci observability': ['replace-with:ci cd monitoring', 'cluster anchor has 30 vol and no SERP; `ci cd monitoring` = 200 vol KD 6'],
  'ci metrics dashboard': ['replace-with:engineering metrics dashboard', 'zero record; `engineering metrics dashboard` = 200 vol KD 2'],
  'circleci build insights alternative': ['replace-with:circleci insights', 'compound is zero; `circleci insights` = 40 vol KD 2'],

  // fail
  'ci analytics': ['prune', 'OVERTURNS Phase 0 keep. SERP positions 1/3/5/6 are C.I. Analytics, a lab-analyzer manufacturer. Not a CI term'],
  'ci build time trends': ['prune', '3 evidence items support the problem but never this phrasing; `reduce ci build time` (50, KD 1) is the real form'],
  'build observability platform': ['prune', '4 evidence items describe the problem; the word "platform" appears nowhere. Keep as a page angle, not a tracked term'],
  'develocity build scan alternative': ['prune', 'FAIL on intent: evidence shows teams adopting Develocity, not replacing it. Track bare `develocity` (200, KD 3) as competitive watch instead'],
  'github actions job duration metrics': ['prune', '3 evidence items, but they are the same items backing `github actions slow`; adds no distinct signal and has zero Ahrefs record'],
  'github actions build time analytics': ['prune', 'FAIL: 0 net-new evidence; nobody uses the word "analytics" here'],
  'monorepo ci metrics': ['prune', 'FAIL: 0 evidence, zero Ahrefs record, no adjacent form with volume'],
  'ci pipeline bottleneck': ['prune', 'FAIL: 1 evidence item, zero Ahrefs record'],

  // kept but reclassified
  'monorepo ci': ['keep', 'resolved: 10 vol, distinct SERP from monorepo ci/cd'],
  'flaky tests ci': ['keep', 'resolved: 0 vol but sits inside the well-evidenced flaky cluster; `flaky test` singular (400, KD 4) added as the real head'],
  'reduce ci costs': ['keep', 'resolved: 20 vol, inside the best-evidenced problem area (ci compute cost, 8 items)'],
};

const parse = (t) => {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else if (c !== '\r') f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const h = rows.shift();
  return { h, rows: rows.filter((r) => r.length === h.length).map((r) => Object.fromEntries(h.map((x, i) => [x, r[i]]))) };
};

const { h, rows } = parse(fs.readFileSync(new URL('./audit.csv', import.meta.url), 'utf8'));
let changed = 0;
for (const r of rows) {
  const res = RESOLVE[r.keyword];
  if (!res) continue;
  if (r.verdict !== res[0]) changed++;
  r.verdict = res[0];
  r.rationale = res[1];
}
const esc = (v) => (/[",]/.test(String(v ?? '')) ? `"${String(v ?? '').replace(/"/g, '""')}"` : String(v ?? ''));
fs.writeFileSync(new URL('./audit-final.csv', import.meta.url), [h.join(','), ...rows.map((r) => h.map((c) => esc(r[c])).join(','))].join('\n') + '\n');

const tally = {};
for (const r of rows) {
  const k = r.verdict.startsWith('merge-into') ? 'merge' : r.verdict.startsWith('replace-with') ? 'replace' : r.verdict;
  tally[k] = (tally[k] || 0) + 1;
}
console.log('verdicts changed:', changed);
console.log(tally);
const freed = (tally.prune || 0) + (tally.merge || 0) + (tally.replace || 0);
console.log('slots freed (prune + merge + replace):', freed);
console.log('surviving tracked keywords:', rows.length - freed);
