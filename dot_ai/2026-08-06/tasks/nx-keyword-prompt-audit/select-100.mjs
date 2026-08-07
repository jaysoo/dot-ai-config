// Curated cut of keywords-add.csv down to 100, per Jack 2026-08-07:
//   - mostly unbranded; branded only where it names a real Nx CLI / Nx Cloud feature
//     or a language surface (nx java, nx affected). No nx meaning / nx getting started.
//   - no error / debugging strings (command not found: nx, ...)
//   - skip micro-frontend and module-federation entirely
//   - skip MCP / llms.txt (gaps.md #9), generic CI/CD definitional (#2), error strings (#10)
//   - every row must map to something Nx CLI or Nx Cloud actually does
import fs from 'node:fs';

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
  return rows.filter((r) => r.length === h.length).map((r) => Object.fromEntries(h.map((x, i) => [x.trim(), (r[i] ?? '').trim()])));
};

const pool = new Map(parse(fs.readFileSync(new URL('./output/keywords-add.csv', import.meta.url), 'utf8')).map((r) => [r.keyword.toLowerCase(), r]));

// Metrics pulled directly by the orchestrator on 2026-08-07 for terms absent from the pool.
// source: keywords-explorer-overview / matching-terms, country=us
const SUPP = {
  'nx affected': [150, 800, 1, 250, 'nx affected'],
  'nx release': [100, 600, 2, 20, 'nx release'],
  'nx generators': [80, 250, 0, 60, 'nx generators'],
  'nx cloud pricing': [50, 200, 4, 40, 'nx cloud'],
  'benefits of monorepo': [30, 50, 9, 150, 'monorepos'],
  'monorepo benefits': [20, 50, 7, 150, 'monorepos'],
  monorepository: [20, 150, 30, 900, 'what is a monorepo'],
  'monorepo vs monolith': [30, 'no_data', 0, 20, 'monorepo vs monolith'],
  'eslint monorepo': [20, 'no_data', 1, 10, 'eslint monorepo'],
  'what is monorepo architecture': [100, 'no_data', 4, 9600, 'what is a monorepo'],
};

// [keyword, feature it maps to]. Order = the shipping order of the deliverable.
const PICK = [
  // --- A. Caching: Nx CLI local cache + Nx Replay remote cache (15)
  ['what is a cache miss', 'cache', 'nx.dev already pos 43 on troubleshoot-cache-misses'],
  ['cache hit rate', 'cache', 'Nx Cloud reports this metric directly'],
  ['github actions cache', 'cache', 'largest cache-demand term; Depot ranks off a blog post'],
  ['docker build cache', 'cache', 'biggest uncontested caching gap in ci-competitors'],
  ['docker layer caching', 'cache', 'Blacksmith/Depot own it'],
  ['gradle build cache', 'cache', 'Nx has a Gradle plugin and no page'],
  ['gradle remote build cache', 'cache', 'Depot ranks pos 3 off a blog post'],
  ['gradle remote cache', 'cache', 'same slot, second phrasing'],
  ['maven build cache', 'cache', 'Nx has a Maven plugin'],
  ['bazel remote cache', 'cache', 'migration bridge from Bazel'],
  ['bazel cache', 'cache', 'migration bridge from Bazel'],
  ['gitlab ci cache', 'cache', 'KD 0, tool-anchored'],
  ['remote build cache', 'cache', 'generic category term Nx should own'],
  ['shared build cache', 'cache', 'generic category term; synthetic, no Ahrefs record'],
  ['monorepo build cache', 'cache', 'the Nx-shaped form of the category term'],

  // --- B. Flaky tests: Nx Cloud flaky task detection + retries (12)
  ['flaky test', 'flaky', 'singular is KD 4 vs KD 6 for the tracked plural'],
  ['what is a flaky test', 'flaky', 'definitional entry point'],
  ['what are flaky tests', 'flaky', 'definitional entry point'],
  ['how to fix flaky tests', 'flaky', 'solution intent'],
  ['flaky tests meaning', 'flaky', 'parent topic of the tracked head term'],
  ['flaky test management', 'flaky', 'commercial framing above the tracked detection term'],
  ['flaky test best practices', 'flaky', 'guide intent'],
  ['flaky test detection tool', 'flaky', 'product intent'],
  ['flaky test tools', 'flaky', 'product intent, listicle'],
  ['playwright flaky tests', 'flaky', 'Nx owns the Playwright plugin - JACK: KB article'],
  ['cypress flaky tests', 'flaky', 'Nx owns the Cypress plugin - JACK: KB article'],
  ['circleci flaky tests', 'flaky', 'tool-anchored, KD 3'],

  // --- C. Affected / test distribution: nx affected, Atomizer, Nx Agents (12)
  ['test impact analysis', 'affected', 'JACK: target this - it is what nx affected does'],
  ['test impact analysis ci', 'affected', 'CI-qualified form'],
  ['test impact analysis tools', 'affected', 'product intent'],
  ['predictive test selection', 'affected', 'Gradle/Launchable category term, KD 3'],
  ['test sharding', 'atomizer', 'Atomizer splits at file level'],
  ['jest shard', 'atomizer', 'Nx owns the Jest plugin'],
  ['cypress parallelization', 'atomizer', 'Nx owns the Cypress plugin'],
  ['jest parallel tests', 'atomizer', 'Nx owns the Jest plugin'],
  ['parallel ci builds', 'agents', 'Nx Agents demand vocabulary'],
  ['test splitting ci', 'atomizer', 'synthetic; the literal Atomizer description'],
  ['distributed task execution', 'agents', 'Nx name for the capability; 0 vol, tracked as a category bet'],
  ['ci parallelization', 'agents', 'synthetic; generic form of the Agents pitch'],

  // --- D. CI cost: the Nx Cloud cost story (8)
  ['github actions pricing', 'ci-cost', 'JACK: KB article on GHA costs'],
  ['github actions billing', 'ci-cost', 'JACK: KB article on GHA costs'],
  ['github actions minutes', 'ci-cost', 'the unit customers actually count'],
  ['github actions free tier', 'ci-cost', 'Blacksmith holds pos 1 off one post'],
  ['github actions free limits', 'ci-cost', 'KD 7, cheapest term in the cost cluster'],
  ['github actions limitations', 'ci-cost', 'problem-first framing'],
  ['ci pipeline minutes', 'ci-cost', 'KD 1'],
  ['github actions self hosted runner', 'ci-cost', 'the DIY cost fix Nx can reframe'],

  // --- E. CI speed in a monorepo (9)
  ['reduce ci build time', 'ci-speed', 'replaces the pruned `ci build time trends`'],
  ['github actions slow', 'ci-speed', 'replaces the pruned `github actions slow workflow`'],
  ['how to speed up github actions', 'ci-speed', 'question framing'],
  ['monorepo continuous integration', 'ci-speed', 'the core Nx Cloud surface, unqualified'],
  ['monorepo ci pipeline', 'ci-speed', 'same intent, pipeline framing'],
  ['gitlab ci monorepo', 'ci-speed', 'KD 0, tool-anchored'],
  ['github monorepo', 'ci-speed', 'KD 9'],
  ['incremental builds ci', 'ci-speed', 'synthetic; what the task graph actually delivers'],
  ['github merge queue', 'ci-speed', 'KD 4, 1000 vol; Nx affected feeds merge-queue efficiency'],

  // --- F. Monorepo concepts (16)
  ['monorepo architecture', 'monorepo', 'KD 2'],
  ['what is monorepo architecture', 'monorepo', 'TP 9600 - highest of any term in this cut'],
  ['monorepo tools', 'monorepo', 'TP 6000, nx.dev pos 3, monorepo.tools also ours'],
  ['monorepo build tools', 'monorepo', 'commercial variant'],
  ['monorepo vs multi repo', 'monorepo', 'decision-stage'],
  ['monorepo pros and cons', 'monorepo', 'decision-stage'],
  ['monorepo vs microservices', 'monorepo', 'KD 0, common confusion'],
  ['monorepo vs monolith', 'monorepo', 'KD 0, common confusion'],
  ['benefits of monorepo', 'monorepo', 'JACK: should match nx.dev'],
  ['monorepo benefits', 'monorepo', 'JACK: should match nx.dev'],
  ['monorepository', 'monorepo', 'JACK: should match nx.dev; TP 900'],
  ['mono repo', 'monorepo', 'nx.dev pos 1, spelling variant, 500 vol'],
  ['monorepos', 'monorepo', 'nx.dev pos 1, plural head'],
  ['what is monorepo', 'monorepo', 'nx.dev pos 1, article-less variant of the 4.1k head'],
  ['monorepo meaning', 'monorepo', 'definitional'],
  ['project graph', 'graph', 'the Nx CLI primitive; Lerna and moonrepo currently rank'],

  // --- G. Language / framework surfaces = the Nx plugin roster (12)
  ['pnpm monorepo', 'plugins', 'the phrasing the tracked set misses (tracks "workspace" only)'],
  ['npm monorepo', 'plugins', 'same'],
  ['bun monorepo', 'plugins', 'same'],
  ['nextjs monorepo', 'plugins', 'turborepo.dev pos 7, nx.dev absent'],
  ['angular monorepo', 'plugins', 'KD 0; replaces the pruned zero-volume `angular cli vs nx`'],
  ['expo monorepo', 'plugins', 'nx.dev already pos 7'],
  ['storybook monorepo', 'plugins', 'nx.dev already pos 8'],
  ['eslint monorepo', 'plugins', 'Nx owns the ESLint plugin'],
  ['terraform monorepo', 'plugins', 'KD 0, non-JS signal'],
  ['bazel monorepo', 'plugins', 'TP 3200 at KD 5'],
  ['go monorepo', 'plugins', 'non-JS signal'],
  ['git monorepo', 'plugins', 'infrastructure-side monorepo intent'],

  // --- H. Workspace structure / TS project references = nx sync (3)
  ['typescript project references', 'ts-sync', 'moonrepo owns it; nx sync manages exactly this'],
  ['tsconfig composite', 'ts-sync', 'nx.dev already pos 5'],
  ['npm workspaces', 'ts-sync', '500 vol KD 5; where teams stand before a task runner'],

  // --- I. Package-manager comparison (4) - JACK: low-effort, should do
  ['pnpm vs npm', 'pkg-mgr', 'JACK: Rush cannot be the one to own this'],
  ['npm vs pnpm', 'pkg-mgr', 'reversed form, separate SERP'],
  ['pnpm vs yarn', 'pkg-mgr', 'third leg of the comparison set'],
  ['npm workspaces monorepo', 'pkg-mgr', 'the bridge term into a task runner'],

  // --- J. Adoption / migration into Nx (5)
  ['migrate to nx', 'migration', 'generic adoption intent'],
  ['add nx to existing monorepo', 'migration', 'the nx init path'],
  ['turborepo to nx', 'migration', 'higher-volume phrasing than the tracked churn pair'],
  ['angular cli to nx', 'migration', 'the Angular acquisition path'],
  ['is lerna deprecated', 'migration', 'Lerna is 1.8k vol and nx.dev does not rank'],

  // --- K. Branded, feature-mapped only (4)
  ['nx affected', 'affected', 'the CLI feature behind test impact analysis'],
  ['nx release', 'release', 'nx release versioning/publishing'],
  ['nx generators', 'generators', 'code-generation surface'],
  ['nx cloud pricing', 'ci-cost', 'only bottom-funnel Nx Cloud commercial term worth tracking'],
];

const TAGS = {
  cache: 'ci-caching|unbranded', flaky: 'ci-flaky|unbranded', affected: 'nx-cloud-features|unbranded',
  atomizer: 'nx-cloud-features|unbranded', agents: 'nx-cloud-features|unbranded',
  'ci-cost': 'ci-cost|unbranded', 'ci-speed': 'ci-cd|unbranded', monorepo: 'monorepo|unbranded',
  graph: 'monorepo-organization|unbranded', plugins: 'monorepo|unbranded', 'ts-sync': 'monorepo-organization|unbranded',
  'pkg-mgr': 'cli-competitors|unbranded', migration: 'migration|branded', release: 'branded|cli-misc',
  generators: 'branded|cli-misc',
};
const BRANDED = /^(nx |.* to nx$|migrate to nx|add nx to|is lerna deprecated)/i;

const out = [];
const missing = [];
for (const [kw, feature, why] of PICK) {
  const p = pool.get(kw.toLowerCase());
  const s = SUPP[kw.toLowerCase()];
  if (!p && !s) { missing.push(kw); continue; }
  let tags = TAGS[feature] || 'monorepo|unbranded';
  const hasTag = (t, x) => t.split('|').includes(x);
  if (BRANDED.test(kw) && !hasTag(tags, 'branded')) tags = tags.replace('unbranded', 'branded');
  out.push({
    keyword: kw,
    feature,
    proposed_tags: tags,
    volume: s ? s[0] : p.volume,
    global_volume: s ? s[1] : p.global_volume,
    difficulty: s ? s[2] : p.difficulty,
    traffic_potential: s ? s[3] : p.traffic_potential,
    parent_topic: s ? s[4] : p.parent_topic,
    nx_ranks: p ? p.nx_ranks : 'no_data',
    source: s ? 'keywords-explorer-overview (2026-08-07)' : p.source,
    why,
  });
}

if (missing.length) { console.error('NOT FOUND in pool or supplement:', missing.join(' | ')); process.exit(1); }

const cols = Object.keys(out[0]);
const esc = (v) => (/[",\n]/.test(String(v ?? '')) ? `"${String(v ?? '').replace(/"/g, '""')}"` : String(v ?? ''));
fs.writeFileSync(new URL('./output/keywords-add-100.csv', import.meta.url), [cols.join(','), ...out.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n') + '\n');

const branded = out.filter((r) => r.proposed_tags.split('|').includes('branded'));
const byFeature = {};
for (const r of out) byFeature[r.feature] = (byFeature[r.feature] || 0) + 1;
console.log('rows:', out.length);
console.log('branded:', branded.length, `(${Math.round((branded.length / out.length) * 100)}%) ->`, branded.map((r) => r.keyword).join(' | '));
console.log('by feature:', byFeature);
console.log('zero/no-data volume:', out.filter((r) => r.volume === '0' || r.volume === 'no_data' || r.volume === 0).length);
