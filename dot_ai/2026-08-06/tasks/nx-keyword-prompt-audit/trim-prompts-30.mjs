// Trims output/prompts-add.csv from 41 to 30, per Jack 2026-08-07.
// Drops: the AI/MCP group (gaps.md #9 "Not relevant. Skip."), the repo-merge pair
// (gaps.md #7 "Not convinced"), and four near-duplicates.
import fs from 'node:fs';

const DROP = [
  // MCP / AI agents - Jack marked the whole cluster not relevant
  ['How do I set up an MCP server for my monorepo?', 'gaps.md #9: MCP not relevant'],
  ["Why can't my AI agent find files in my monorepo?", 'gaps.md #9: MCP/AI cluster skipped (was a gap prompt - see note)'],
  ['How do I give an AI agent context about my monorepo?', 'gaps.md #9: MCP/AI cluster skipped'],
  ['How should I structure a monorepo so coding agents work well in it?', 'gaps.md #9: MCP/AI cluster skipped'],
  // repo consolidation - Jack not convinced
  ['How do I merge one repository into another without losing history?', 'gaps.md #7: not convinced (was a gap prompt - see note)'],
  ['We have eight repos and want to consolidate them into a monorepo. How should we do it?', 'gaps.md #7: not convinced; duplicate intent'],
  // near-duplicates
  ['How do I run CI/CD pipelines in a monorepo?', 'duplicate of "What is the best CI/CD setup for a monorepo?"'],
  ['How do I reduce my CI build time?', 'duplicate of "Why is my CI/CD pipeline so slow?"'],
  ['How do I reduce the cost of my GitHub Actions?', 'duplicate of the $3,500-bill prompt, which is better framed'],
  ['How do I parallelize CI builds to speed them up?', 'duplicate of "What tools split and distribute tests across CI machines?"'],
  ['How should I structure a NestJS backend monorepo?', 'weakest framework prompt; Angular and Next.js carry the group'],
];
const DROPSET = new Map(DROP);

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

const ROOT = new URL('./', import.meta.url).pathname;
const { h, rows } = parse(fs.readFileSync(ROOT + 'output/prompts-add.csv', 'utf8'));

const kept = rows.filter((r) => !DROPSET.has(r.prompt));
const dropped = rows.filter((r) => DROPSET.has(r.prompt));
if (kept.length !== 30) { console.error('expected 30, got', kept.length); process.exit(1); }

// Tier 1 is picked explicitly, not by winnability. Sorting by winnability alone buried the
// tool-selection listicles in tier 2 - and those are exactly the prompts Turborepo wins
// today, so they are the ones that most need cross-model coverage.
const TIER1 = new Set([
  // gap: competitors named, no build tool entered the answer at all
  'What are the GitHub Actions runner alternatives?',
  'How to fix flaky tests?',
  'Is this test actually broken, or just flaky? How do I tell in CI?',
  'How do I detect and quarantine flaky tests in CI?',
  // contested, high value: selection listicles + the Nx Cloud feature and cost stories
  'Top monorepo tools for 2026.',
  'Best monorepo tool for small teams',
  'How does test impact analysis speed up CI?',
  'What tools split and distribute tests across CI machines?',
  'How do I set up a shared remote build cache across CI and developer machines?',
  'Our GitHub Actions bill went up about $3,500 a month. What are our options?',
  // defend: regression detectors on the framings Nx currently wins
  'Best monorepo tool for large teams',
  'Top tools for monorepo continuous integration.',
  'What is the best CI/CD setup for a monorepo?',
  // sentiment: the two framings that actually move
  'Is Nx overkill for a small project, making Turborepo the lighter choice?',
  'Did Nx change its licensing or pull features behind a paywall?',
]);
for (const r of kept) {
  r.tier = TIER1.has(r.prompt) ? 1 : 2;
  r.models = r.tier === 1 ? 'chatgpt|claude|perplexity|google_ai_overviews' : 'chatgpt';
}
const RANK = { gap: 0, defend: 1, unscreened: 2, contested: 3 };
kept.sort((a, b) => a.tier - b.tier || RANK[a.winnability] - RANK[b.winnability]);

const esc = (v) => (/[",\n]/.test(String(v ?? '')) ? `"${String(v ?? '').replace(/"/g, '""')}"` : String(v ?? ''));
fs.writeFileSync(ROOT + 'output/prompts-add.csv', [h.join(','), ...kept.map((r) => h.map((c) => esc(r[c])).join(','))].join('\n') + '\n');
fs.writeFileSync(
  ROOT + 'output/prompts-dropped.csv',
  ['prompt,winnability,reason', ...dropped.map((r) => [r.prompt, r.winnability, DROPSET.get(r.prompt)].map(esc).join(','))].join('\n') + '\n'
);

const t1 = kept.filter((r) => r.tier === 1).length;
const t2 = kept.length - t1;
let out = `# Brand Radar prompt import - Nx (report 019f70fc-d637-7bbf..., project 8558520)
# Generated 2026-08-07 from dot_ai/2026-08-06/tasks/nx-keyword-prompt-audit/
#
# ${kept.length} prompts. Tier 1 (${t1}) on 4 models, Tier 2 (${t2}) on ChatGPT only = ${t1 * 4 + t2} daily runs.
# Current report: 13 prompts, ChatGPT only = 13 daily runs.
# Cheaper options: Tier 1 on ChatGPT + Claude only = ${t1 * 2 + t2}. Everything ChatGPT only = ${kept.length}.
#
# winnability comes from a blind Claude baseline (phase4-prompts/claude-baseline.json):
#   gap       = competitors named, NO monorepo build tool entered the answer. Highest value.
#   defend    = Nx named first today. Regression detector.
#   unscreened= names Nx in the question; measures framing, not visibility. Tagged branded.
#   contested = a build tool appears, Nx is not first.
`;
for (const t of [1, 2]) {
  out += `\n\n## TIER ${t} - models: ${t === 1 ? 'chatgpt, claude, perplexity, google_ai_overviews' : 'chatgpt'}\n`;
  for (const w of ['gap', 'defend', 'unscreened', 'contested']) {
    const sel = kept.filter((r) => r.tier === t && r.winnability === w);
    if (!sel.length) continue;
    out += `\n# --- ${w} (${sel.length}) ---\n`;
    for (const r of sel) out += `${r.prompt}\n`;
  }
}
fs.writeFileSync(ROOT + 'output/brand-radar-import.txt', out);

const tal = {};
for (const r of kept) tal[r.winnability] = (tal[r.winnability] || 0) + 1;
console.log('kept:', kept.length, tal);
console.log('dropped:', dropped.length);
console.log('daily runs:', t1 * 4 + t2, `(tier1 ${t1} x4 + tier2 ${t2} x1). Current: 13`);
