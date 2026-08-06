// Phase 5 merge: combine Phase 2 (Ahrefs) + Phase 3 (qualitative) + Phase 1 (seeds)
// into a single scored matrix. Heuristic scoring only - a judgment agent refines relevance
// on the top slice afterwards. Every row keeps a source; nothing is invented.
import fs from 'fs';
import path from 'path';

const DIR = path.dirname(new URL(import.meta.url).pathname);
const out = (p) => path.join(DIR, p);

// ---------- csv ----------
function parseCSV(t) {
  const rows = []; let f = [], c = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) { if (ch === '"') { if (t[i + 1] === '"') { c += '"'; i++; } else q = false; } else c += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { f.push(c); c = ''; }
    else if (ch === '\n') { f.push(c); rows.push(f); f = []; c = ''; }
    else if (ch !== '\r') c += ch;
  }
  if (c || f.length) { f.push(c); rows.push(f); }
  return rows.filter(r => r.length > 1);
}
const esc = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};
const num = (v) => { const n = parseInt(String(v).replace(/[^0-9-]/g, ''), 10); return isNaN(n) ? null : n; };

// ---------- vocab ----------
const TOOLS = ['claude code', 'claude.md', 'claude md', 'claude', 'codex', 'cursor', 'aider',
  'windsurf', 'opencode', 'copilot', 'agents.md', 'agents md', 'cline', 'roo', 'goose', 'gemini cli', 'amp'];
const CONCEPT = {
  memory: ['memory', 'context', 'forget', 'remember', 'persist', 'compact', 'rules', 'claude.md', 'agents.md', 'instructions', 'recall', 'knowledge'],
  observability: ['observab', 'trace', 'tracing', 'log', 'monitor', 'telemetry', 'dashboard', 'debug', 'visibility', 'replay', 'transcript'],
  sharing: ['share', 'sharing', 'shared', 'collaborat', 'team', 'handoff', 'multiplayer', 'review', 'export', 'publish', 'transcript', 'resume'],
  orchestration: ['orchestrat', 'subagent', 'sub-agent', 'parallel', 'fleet', 'swarm', 'multi agent', 'multi-agent', 'background agent', 'worktree', 'coordinate', 'delegate'],
  evaluation: ['eval', 'benchmark', 'regression', 'reliab', 'verif', 'test', 'quality', 'accuracy', 'judge'],
  cost: ['cost', 'token', 'usage', 'spend', 'pricing', 'budget', 'limit', 'quota', 'bill', 'credit'],
  governance: ['governance', 'audit', 'permission', 'sandbox', 'polic', 'complian', 'security', 'guardrail', 'approval', 'access control'],
  portability: ['portab', 'migrate', 'switch', 'vs ', ' vs', 'alternative', 'interop', 'standard', 'protocol', 'agnostic', 'swap'],
  crossrepo: ['cross repo', 'cross-repo', 'multi repo', 'multi-repo', 'monorepo', 'polyrepo', 'repositor', 'submodule', 'across repo'],
};
// terms that mean the row drifted off-topic; scored 0 and flagged
const NOISE = ['version control systems', 'azure monitor', 'root cause', 'incident management',
  'ci cd', 'trunk based development', 'git submodule', 'working memory', 'prompt engineering',
  'feedback loop', 'regression testing', 'observability', 'monitoring', 'repository', 'dependencies',
  'agentic ai', 'ai agents', 'claude code', 'nx', 'sourcegraph', 'ai assistants', 'context window',
  'the division', 'insurance', 'trojan'];
const BRANDS = ['mem0', 'zep', 'letta', 'langfuse', 'langsmith', 'helicone', 'braintrust', 'agentops',
  'arize', 'phoenix', 'weave', 'portkey', 'omnigent', 'polygraph', 'metaharness', 'promptfoo',
  'litellm', 'datadog', 'ccusage', 'threadcast', 'claudereview', 'lore.link', 'custardseed', 'sessionviewer'];

const has = (s, arr) => arr.some(t => s.includes(t));

function funnelStage(k) {
  const s = k.toLowerCase();
  if (/\bvs\b|\balternative\b|\bcompare\b|\bcomparison\b/.test(s)) return 'competitor-comparison';
  if (has(s, BRANDS)) return 'product-aware';
  if (/\b(not working|doesn't|does not|cant|can't|fail|error|problem|issue|forget|forgets|lost|losing|lose|why|slow|broken|too much|keeps)\b/.test(s)) return 'problem-aware';
  return 'solution-aware';
}

function relevance(k, cat) {
  const s = k.toLowerCase().trim();
  if (NOISE.includes(s)) return 0;
  if (s.split(/\s+/).length === 1 && !has(s, BRANDS)) return 0;
  const tool = has(s, TOOLS);
  const concept = has(s, CONCEPT[cat] || []);
  const anyConcept = Object.values(CONCEPT).some(c => has(s, c));
  const agenty = /\bagent|\bai\b|\bllm\b|coding agent/.test(s);
  if (tool && concept) return 3;
  if (tool && anyConcept) return 3;
  if (concept && agenty) return 2;
  if (has(s, BRANDS) && anyConcept) return 2;
  if (anyConcept && agenty) return 2;
  if (concept || has(s, BRANDS)) return 1;
  return 0;
}

// ---------- load phase 2 ----------
const kw = new Map(); // key -> row
const p2dir = out('phase2-ahrefs');
for (const f of fs.readdirSync(p2dir).filter(x => x.endsWith('.csv') && x !== 'competitors.csv')) {
  const rows = parseCSV(fs.readFileSync(path.join(p2dir, f), 'utf8'));
  const hdr = rows[0].map(h => h.trim());
  for (const r of rows.slice(1)) {
    const o = {}; hdr.forEach((h, i) => o[h] = (r[i] || '').trim());
    const k = (o.keyword || '').toLowerCase().trim();
    if (!k) continue;
    const prev = kw.get(k);
    const v = num(o.volume);
    if (!prev || (num(prev.volume) ?? -1) < (v ?? -1)) {
      kw.set(k, { category: o.category || f.replace('.csv', ''), keyword: o.keyword,
        volume: o.volume || 'no_data', global_volume: o.global_volume || 'no_data',
        difficulty: o.difficulty || 'no_data', parent_topic: o.parent_topic || '',
        intents: o.intents || '', source: 'ahrefs:' + (o.source_report || 'unknown'),
        seed_used: o.seed_used || '', evidence: [], });
    }
  }
}
// competitors file
if (fs.existsSync(out('phase2-ahrefs/competitors.csv'))) {
  const rows = parseCSV(fs.readFileSync(out('phase2-ahrefs/competitors.csv'), 'utf8'));
  const hdr = rows[0].map(h => h.trim());
  for (const r of rows.slice(1)) {
    const o = {}; hdr.forEach((h, i) => o[h] = (r[i] || '').trim());
    const k = (o.keyword || '').toLowerCase().trim();
    if (!k) continue;
    if (!kw.has(k)) {
      kw.set(k, { category: o.mapped_category || 'landscape', keyword: o.keyword,
        volume: o.volume || 'no_data', global_volume: 'no_data', difficulty: o.difficulty || 'no_data',
        parent_topic: '', intents: '', source: 'ahrefs:competitor-organic:' + (o.target || ''),
        seed_used: o.target || '', evidence: [] });
    } else {
      kw.get(k).source += '; competitor:' + (o.target || '');
    }
  }
}

// ---------- load phase 3 qualitative as evidence ----------
const p3dir = out('phase3-qualitative');
const qual = [];
for (const f of fs.readdirSync(p3dir).filter(x => x.endsWith('.json'))) {
  let d; try { d = JSON.parse(fs.readFileSync(path.join(p3dir, f), 'utf8')); } catch { continue; }
  for (const p of (d.phrases || [])) qual.push({ ...p, _file: f });
}
// attach evidence to matching keywords; keep unmatched as dark-demand candidates
const darkCandidates = [];
for (const q of qual) {
  const ph = (q.verbatim_phrase || '').toLowerCase().trim();
  if (!ph) continue;
  if (kw.has(ph)) { kw.get(ph).evidence.push(q); continue; }
  // substring match against known keywords
  let hit = null;
  for (const k of kw.keys()) { if (k.length > 8 && (ph.includes(k) || k.includes(ph))) { hit = k; break; } }
  if (hit) kw.get(hit).evidence.push(q);
  else darkCandidates.push(q);
}

// ---------- emit keywords.csv ----------
const HDR = ['category', 'keyword', 'funnel_stage', 'volume', 'global_volume', 'difficulty',
  'evidence_count', 'evidence_sources', 'relevance', 'tier', 'source', 'seed_used'];
const rows = [];
for (const r of kw.values()) {
  const rel = relevance(r.keyword, r.category);
  const v = num(r.volume);
  const ec = r.evidence.length;
  const tier = (v === null || v === 0) && ec > 0 ? 'dark-demand'
    : (v !== null && v > 0) ? 'measured'
    : 'no-signal';
  rows.push({ category: r.category, keyword: r.keyword, funnel_stage: funnelStage(r.keyword),
    volume: r.volume || 'no_data', global_volume: r.global_volume || 'no_data',
    difficulty: r.difficulty || 'no_data', evidence_count: ec,
    evidence_sources: [...new Set(r.evidence.map(e => e.source))].join('|'),
    relevance: rel, tier, source: r.source, seed_used: r.seed_used });
}
// dark-demand rows: qualitative-only phrases with no Ahrefs row at all
for (const q of darkCandidates) {
  rows.push({ category: q.category || 'unknown', keyword: q.verbatim_phrase,
    funnel_stage: funnelStage(q.verbatim_phrase || ''), volume: 'no_data', global_volume: 'no_data',
    difficulty: 'no_data', evidence_count: 1, evidence_sources: q.source || q._file,
    relevance: relevance(q.verbatim_phrase || '', q.category || 'memory'),
    tier: 'dark-demand', source: q.url || q.source || q._file, seed_used: '' });
}
rows.sort((a, b) => (b.relevance - a.relevance) || ((num(b.volume) ?? -1) - (num(a.volume) ?? -1)));
fs.writeFileSync(out('output/keywords.csv'),
  HDR.join(',') + '\n' + rows.map(r => HDR.map(h => esc(r[h])).join(',')).join('\n') + '\n');

// ---------- stats ----------
const stat = (f) => rows.reduce((m, r) => (m[f(r)] = (m[f(r)] || 0) + 1, m), {});
console.log('keywords.csv rows:', rows.length);
console.log('by tier:', stat(r => r.tier));
console.log('by relevance:', stat(r => r.relevance));
console.log('by funnel:', stat(r => r.funnel_stage));
console.log('by category:', stat(r => r.category));
console.log('qualitative phrases loaded:', qual.length, '| unmatched (dark candidates):', darkCandidates.length);
console.log('sources present:', fs.readdirSync(p3dir).filter(x => x.endsWith('.json')).join(', '));
const rel3 = rows.filter(r => r.relevance === 3);
console.log('\nrelevance-3 count:', rel3.length);
console.log('top 30 relevance-3 by volume:');
for (const r of rel3.filter(r => num(r.volume) > 0).sort((a, b) => num(b.volume) - num(a.volume)).slice(0, 30))
  console.log('  ', String(num(r.volume)).padStart(5), 'KD' + String(r.difficulty).padStart(5), r.category.padEnd(14), r.keyword);
console.log('\ndark-demand w/ relevance>=2:', rows.filter(r => r.tier === 'dark-demand' && r.relevance >= 2).length);
