// Applies the Claude blind-baseline screen (claude-baseline.json) to output/prompts-add.csv,
// filling winnability + first_named, then tiering. Also emits brand-radar-import.txt.
import fs from 'node:fs';

const ROOT = new URL('../', import.meta.url).pathname;

// winnability from the blind screen:
//   gap       = competing products named, NO monorepo build system entered the answer
//   contested = a build tool appears but Nx is not first
//   defend    = Nx / Nx Cloud named first
//   unscreened= sentiment prompts (they name Nx in the question, so the screen is meaningless)
const SCREEN = {
  'What is the best CI/CD setup for a monorepo?': ['defend', 'Nx'],
  'How do I run CI/CD pipelines in a monorepo?': ['contested', 'GitHub Actions'],
  'Why is my CI/CD pipeline so slow?': ['contested', 'GitHub Actions'],
  'How do I reduce my CI build time?': ['contested', 'actions/cache'],
  'Our CI takes 40 minutes for a one-line fix and the team wants to add more runners. Is that the right call?': ['defend', 'Nx'],
  'How do I parallelize CI builds to speed them up?': ['contested', 'GitHub Actions'],
  'How do I reduce the cost of my GitHub Actions?': ['contested', 'actions/cache'],
  'Our GitHub Actions bill went up about $3,500 a month. What are our options?': ['contested', 'runner vendors'],
  'What are the GitHub Actions runner alternatives?': ['gap', 'Depot/Blacksmith/WarpBuild'],
  'How to fix flaky tests?': ['gap', 'Trunk/BuildPulse/Datadog'],
  'Is this test actually broken, or just flaky? How do I tell in CI?': ['gap', 'Trunk/BuildPulse/Datadog'],
  'How do I detect and quarantine flaky tests in CI?': ['gap', 'Trunk/BuildPulse/Datadog'],
  'How does test impact analysis speed up CI?': ['contested', 'Bazel'],
  'What tools split and distribute tests across CI machines?': ['contested', 'CI-platform sharding'],
  'How do I set up a shared remote build cache across CI and developer machines?': ['contested', 'Turborepo'],
  'How do I merge one repository into another without losing history?': ['gap', 'git-filter-repo'],
  'We have eight repos and want to consolidate them into a monorepo. How should we do it?': ['contested', 'git-filter-repo'],
  'Is Lerna still maintained, and what should I move to?': ['contested', 'Lerna'],
  'We are outgrowing pnpm workspaces. What is the next step up?': ['contested', 'Turborepo'],
  'Best way to structure an Angular monorepo?': ['defend', 'Nx'],
  'How do I set up a Next.js monorepo with shared packages?': ['contested', 'Turborepo'],
  'How should I structure a NestJS backend monorepo?': ['contested', 'NestJS CLI'],
  'How do I give an AI agent context about my monorepo?': ['contested', 'CLAUDE.md/agents.md'],
  "Why can't my AI agent find files in my monorepo?": ['gap', 'editor/agent config'],
  'How do I set up an MCP server for my monorepo?': ['gap', 'MCP SDK'],
  'How should I structure a monorepo so coding agents work well in it?': ['contested', 'agents.md'],
  'We need a monorepo build platform with SOC 2, on-prem or self-hosted caching, and a support SLA. What are the options?': ['defend', 'Nx Cloud'],
  'Top monorepo tools for 2026.': ['contested', 'Turborepo'],
  'Best monorepo tool for large teams': ['defend', 'Nx'],
  'Best monorepo tool for small teams': ['contested', 'pnpm'],
  'Top tools for monorepo continuous integration.': ['defend', 'Nx'],
  'I need a monorepo CI/CD solution that integrates with GitHub and provides build caching for our Node.js and Go services. What are the top options available?': ['contested', 'GitHub Actions'],
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

const { h, rows } = parse(fs.readFileSync(ROOT + 'output/prompts-add.csv', 'utf8'));

const RANK = { gap: 0, defend: 1, contested: 2, unscreened: 3 };
for (const r of rows) {
  const s = SCREEN[r.prompt];
  if (s) { r.winnability = s[0]; r.named_tools_baseline = s[1]; }
  else { r.winnability = 'unscreened'; r.named_tools_baseline = 'names Nx in the question - screen not meaningful'; }
}

// Tier 1 = every gap, every sentiment tracker, every defend (regression detectors),
// and the contested prompts in the clusters Nx sells into.
const T1_CONTESTED = new Set([
  'How do I set up a shared remote build cache across CI and developer machines?',
  'What tools split and distribute tests across CI machines?',
  'How does test impact analysis speed up CI?',
  'Our GitHub Actions bill went up about $3,500 a month. What are our options?',
  'We are outgrowing pnpm workspaces. What is the next step up?',
  'Top monorepo tools for 2026.',
  'Best monorepo tool for small teams',
  'How do I set up a Next.js monorepo with shared packages?',
]);
for (const r of rows) {
  r.tier = r.winnability === 'gap' || r.winnability === 'unscreened' || r.winnability === 'defend' || T1_CONTESTED.has(r.prompt) ? 1 : 2;
  // Tier 2 rides ChatGPT only, to keep the daily run count affordable.
  if (r.tier === 2) r.models = 'chatgpt';
}

const cols = [...h, 'tier'].filter((c, i, a) => a.indexOf(c) === i);
const esc = (v) => (/[",\n]/.test(String(v ?? '')) ? `"${String(v ?? '').replace(/"/g, '""')}"` : String(v ?? ''));
rows.sort((a, b) => a.tier - b.tier || RANK[a.winnability] - RANK[b.winnability]);
fs.writeFileSync(ROOT + 'output/prompts-add.csv', [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n') + '\n');

// --- Brand Radar import file ---
const MODELS = ['chatgpt', 'claude', 'perplexity', 'google_ai_overviews'];
let out = `# Brand Radar prompt import - Nx (report 019f70fc-d637-7bbf... project 8558520)
# Generated 2026-08-06 from dot_ai/2026-08-06/tasks/nx-keyword-prompt-audit/
#
# Tier 1 (${rows.filter((r) => r.tier === 1).length} prompts): track on ChatGPT + Claude + Perplexity + Google AI Overviews.
# Tier 2 (${rows.filter((r) => r.tier === 2).length} prompts): ChatGPT only, to hold the daily run count down.
#
# Current report runs 13 prompts on ChatGPT only = 13 daily runs.
# This set = ${rows.filter((r) => r.tier === 1).length * 4 + rows.filter((r) => r.tier === 2).length} daily runs. Confirm the cost before importing.
#
# winnability comes from a blind Claude baseline (phase4-prompts/claude-baseline.json):
#   gap       = competitors named, NO monorepo build tool entered the answer. Highest value.
#   contested = a build tool appears, Nx is not first.
#   defend    = Nx named first today. Regression detector.
#   unscreened= names Nx in the question; measures framing, not visibility. Tag as branded.
`;
for (const t of [1, 2]) {
  out += `\n\n## TIER ${t} - models: ${t === 1 ? MODELS.join(', ') : 'chatgpt'}\n`;
  for (const w of ['gap', 'contested', 'defend', 'unscreened']) {
    const sel = rows.filter((r) => r.tier === t && r.winnability === w);
    if (!sel.length) continue;
    out += `\n# --- ${w} (${sel.length}) ---\n`;
    for (const r of sel) out += `${r.prompt}\n`;
  }
}
fs.writeFileSync(ROOT + 'output/brand-radar-import.txt', out);

const tal = {};
for (const r of rows) tal[`t${r.tier}-${r.winnability}`] = (tal[`t${r.tier}-${r.winnability}`] || 0) + 1;
console.log('prompts:', rows.length, tal);
console.log('daily runs:', rows.filter((r) => r.tier === 1).length * 4 + rows.filter((r) => r.tier === 2).length, '(current: 13)');
