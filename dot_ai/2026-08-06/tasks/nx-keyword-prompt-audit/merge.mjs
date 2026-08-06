// Phase 5: merge the 9 cluster CSVs, dedupe, score, write output/keywords-add.csv
// Usage: node merge.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = new URL('.', import.meta.url).pathname;
const P2 = path.join(ROOT, 'phase2-ahrefs');

// --- CSV parse (quoted fields, embedded commas) ---
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else q = false;
      } else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const head = rows.shift();
  return rows.filter((r) => r.length === head.length && r.some((v) => v !== '')).map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}
const num = (v) => {
  if (v === '' || v == null) return null;
  const s = String(v).toLowerCase();
  if (s === 'no_data' || s === 'null' || s === 'n/a' || s === 'synthetic') return null;
  const n = Number(String(v).replace(/[,\s]/g, ''));
  return Number.isFinite(n) ? n : null;
};

// --- load ---
const clusters = fs.readdirSync(P2).filter((f) => f.endsWith('.csv')).map((f) => f.replace('.csv', ''));
let rows = [];
for (const c of clusters) {
  const parsed = parseCsv(fs.readFileSync(path.join(P2, `${c}.csv`), 'utf8'));
  for (const r of parsed) rows.push({ ...r, cluster: c });
}
const rawCount = rows.length;

// --- drop anything already tracked (agents were told not to, verify anyway) ---
const audit = parseCsv(fs.readFileSync(path.join(ROOT, 'phase0-audit', 'audit.csv'), 'utf8'));
const tracked = new Set(audit.map((r) => r.keyword.toLowerCase()));
const collisions = rows.filter((r) => tracked.has((r.keyword || '').toLowerCase()));
rows = rows.filter((r) => !tracked.has((r.keyword || '').toLowerCase()));

// --- overturned Phase 0 verdicts (see phase2-ahrefs/00-orchestrator-verifications.md) ---
const OVERTURNED = { 'ci analytics': 'prune - SERP is C.I. Analytics, a lab-analyzer manufacturer' };

// --- dedupe across clusters, keeping the row with the most populated fields ---
const byKw = new Map();
for (const r of rows) {
  const k = (r.keyword || '').toLowerCase();
  if (!k) continue;
  const score = Object.values(r).filter((v) => v && v !== 'no_data').length;
  const prev = byKw.get(k);
  if (!prev) byKw.set(k, { r, score });
  else {
    if (score > prev.score) byKw.set(k, { r: { ...r, also_in: prev.r.cluster }, score });
    else prev.r.also_in = r.cluster;
  }
}
rows = [...byKw.values()].map((x) => x.r);

// --- junk filter: the `nx` term is heavily polluted ---
const JUNK = /\b(lexus|siemens|roblox|nxvms|network optix|cad|nx models?|star trek|nx-01|coworking|citrix|google workspace|cianalytics|oil|gas|petro)\b/i;
const junked = rows.filter((r) => JUNK.test(r.keyword) || JUNK.test(r.notes || '') || JUNK.test(r.serp_top3_domains || ''));
rows = rows.filter((r) => !junked.includes(r));

// --- scoring ---
const FIT = {
  'cli-competitors': 3, migration: 3, 'nx-cloud-features': 3, 'ci-caching': 3,
  'ci-cost': 3, 'ci-flaky': 3, branded: 3, monorepo: 2, 'ci-cd': 2,
  'ai-tooling': 2, 'module-federation': 2, 'ci-observability': 1, 'ci-competitors': 1,
};
const OPEN = /reddit|stackoverflow|stack overflow|quora|medium\.com|dev\.to|hashnode|forum|news\.ycombinator/i;

// Reachability: can nx.dev plausibly rank for this, or is it monitor-only?
// A high-volume competitor brand term scores well on volume+KD+openness and is still
// useless as a content target. Split those out rather than letting them top the list.
const VENDOR = [
  'earthly', 'buildkite', 'develocity', 'gradle enterprise', 'garnix', 'depot', 'blacksmith',
  'buildbuddy', 'namespace', 'warpbuild', 'ubicloud', 'runson', 'cirrus',
  'turborepo', 'turbo repo', 'turbo', 'lerna', 'bazel', 'moonrepo', 'moon', 'rush', 'rush stack',
  'pants', 'buck2', 'wireit', 'vite plus', 'viteplus',
  'jenkins', 'circleci', 'travis', 'semaphore', 'teamcity', 'drone',
  'cursor', 'claude code', 'copilot', 'windsurf', 'codex', 'bugbot', 'mcp inspector',
  'linearb', 'swarmia', 'jellyfish', 'faros', 'buildpulse', 'launchable', 'trunk',
];
const NX_ANGLE = /\b(monorepo|workspace|cache|caching|ci|cd|pipeline|build|test|flaky|shard|split|module federation|micro ?frontend|nx|generator|affected|task|graph|typescript|angular|react|nest|next|vue|migrat|repo)\b/i;

function reachability(r) {
  const k = (r.keyword || '').toLowerCase().trim();
  // bare vendor name, or vendor + a navigational modifier only
  const bare = VENDOR.some((v) => k === v || k === v + ' ci' || k === v + ' pricing' || k === v + ' docs' || k === v + ' login');
  if (bare) return 0;
  // vendor-vs-vendor with no Nx party and no Nx-addressable concept
  const vsMatch = k.match(/^(.+?)\s+(?:vs\.?|versus|or)\s+(.+)$/);
  if (vsMatch && !/\bnx\b/.test(k)) {
    const [, a, b] = vsMatch;
    const aV = VENDOR.some((v) => a.trim() === v);
    const bV = VENDOR.some((v) => b.trim() === v);
    if (aV && bV) return 0;
  }
  // nx.dev already ranks -> definitionally reachable
  if (num(r.nx_ranks) != null) return 2;
  return NX_ANGLE.test(k) ? 2 : 1;
}

function score(r) {
  const v = num(r.volume);
  const volScore = v == null || v === 0 ? 0 : v < 50 ? 1 : v < 200 ? 2 : v < 1000 ? 3 : 4;

  const kd = num(r.difficulty);
  const kdScore = kd == null ? 1 : kd <= 5 ? 3 : kd <= 20 ? 2 : kd <= 45 ? 1 : 0;

  const serp = r.serp_top3_domains || '';
  const openScore = !serp || serp === 'no_data' ? 1 : OPEN.test(serp) ? 2 : 0;

  const tags = (r.proposed_tags || '').split('|').map((t) => t.trim());
  const fit = Math.max(0, ...tags.map((t) => FIT[t] ?? 0));

  // evidence is filled in by apply-evidence.mjs once Phase 3 lands; default 0
  const ev = num(r.evidence_count) ?? 0;

  const reach = reachability(r);

  return { volScore, kdScore, openScore, fit, ev, reach, total: volScore + kdScore + openScore + fit + ev + reach };
}

const scored = rows.map((r) => {
  const s = score(r);
  return {
    keyword: r.keyword,
    cluster: r.cluster,
    also_in: r.also_in || '',
    volume: r.volume,
    global_volume: r.global_volume,
    difficulty: r.difficulty,
    traffic_potential: r.traffic_potential,
    parent_topic: r.parent_topic,
    intents: r.intents,
    serp_top3_domains: r.serp_top3_domains,
    nx_ranks: r.nx_ranks,
    proposed_tags: r.proposed_tags,
    source: r.source,
    vol_score: s.volScore,
    kd_score: s.kdScore,
    serp_openness: s.openScore,
    strategic_fit: s.fit,
    reachability: s.reach,
    evidence_count: s.ev,
    total_score: s.total,
    notes: r.notes,
  };
});

scored.sort((a, b) => b.total_score - a.total_score || (num(b.volume) ?? 0) - (num(a.volume) ?? 0));

// --- reject untagged rows, per the plan ---
const untagged = scored.filter((r) => !r.proposed_tags || r.proposed_tags === 'no_data');
const final = scored.filter((r) => r.proposed_tags && r.proposed_tags !== 'no_data');

// Split: rank targets vs monitor-only competitor terms
const targets = final.filter((r) => r.reachability > 0);
const monitor = final.filter((r) => r.reachability === 0);

// Budget fit. 28 slots freed by Phase 0. Tracking budget is really attention, not the
// Ahrefs plan cap (the workspace tracks 147 keywords across both projects today), so the
// cut line is set to roughly double the tracked set rather than to a hard vendor limit.
// tier1 = add now (fills the 28 freed slots + a deliberate expansion)
// tier2 = bench for the next rotation
// tier3 = keep in the file as evidence, do not track
const TIER1 = 100;
const TIER2 = 250;
targets.forEach((r, i) => { r.tier = i < TIER1 ? 1 : i < TIER2 ? 2 : 3; });
monitor.forEach((r) => { r.tier = 'monitor'; });

const cols = [...new Set([...Object.keys(final[0]), "tier"])];
const esc = (v) => (/[",\n]/.test(String(v ?? '')) ? `"${String(v ?? '').replace(/"/g, '""')}"` : String(v ?? ''));
const write = (name, arr) =>
  fs.writeFileSync(path.join(ROOT, 'output', name), [cols.join(','), ...arr.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n') + '\n');

fs.mkdirSync(path.join(ROOT, 'output'), { recursive: true });
write('keywords-add.csv', targets);
write('keywords-monitor.csv', monitor);

console.log('raw rows           ', rawCount);
console.log('collisions w/ audit', collisions.length, collisions.slice(0, 8).map((r) => r.keyword).join(' | '));
console.log('junk dropped       ', junked.length, junked.slice(0, 8).map((r) => r.keyword).join(' | '));
console.log('untagged rejected  ', untagged.length);
console.log('rank targets       ', targets.length);
console.log('monitor-only       ', monitor.length);
console.log('\ntarget score distribution:');
const dist = {};
for (const r of targets) dist[r.total_score] = (dist[r.total_score] || 0) + 1;
for (const k of Object.keys(dist).sort((a, b) => b - a)) console.log(`  ${k}: ${dist[k]}`);
console.log('\nOverturned Phase 0 verdicts applied downstream:', JSON.stringify(OVERTURNED));
console.log('\ntop 40 rank targets:');
for (const r of targets.slice(0, 40)) console.log(`  ${r.total_score}  ${String(r.volume).padStart(6)}  kd=${String(r.difficulty).padStart(4)}  ${r.keyword}  [${r.proposed_tags}]`);
console.log('\ntop 12 monitor-only:');
for (const r of monitor.slice(0, 12)) console.log(`  ${String(r.volume).padStart(6)}  ${r.keyword}`);
