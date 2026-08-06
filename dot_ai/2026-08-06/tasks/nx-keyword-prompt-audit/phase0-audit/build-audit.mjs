// Phase 0: apply audit criteria to baseline.csv -> audit.csv
import fs from 'node:fs';

const base = fs
  .readFileSync(new URL('./baseline.csv', import.meta.url), 'utf8')
  .trim()
  .split('\n')
  .slice(1)
  .map((l) => {
    // naive split is safe here: only nx_url can contain commas, and it does not
    const p = l.split(',');
    return { keyword: p[0].replace(/^"|"$/g, ''), tags: p[1], volume_us: p[2], global_volume: p[3], difficulty: p[4], traffic_potential: p[5], parent_topic: p[6], nx_position: p[7], nx_url: p[8] || '' };
  });

// verdict: keep | keep-sentiment | keep-pending-evidence | prune | merge-into:X
const V = {
  // --- head + core monorepo: earning their slot ---
  monorepo: ['keep', '5.6k vol, nx.dev pos 8, the category head term'],
  'what is a monorepo': ['keep', '4.1k vol, pos 1, top informational entry point'],
  nx: ['keep', '19k vol, pos 1, brand head term'],
  'monorepo vs polyrepo': ['keep', '400 vol, pos 1, defend'],
  'monorepo structure': ['keep', '150 vol, pos 9, TP 2400 - biggest upside/position gap in the set'],
  'monorepo best practices': ['keep', '70 vol, TP 6000, not ranking - highest traffic-potential gap tracked'],
  'monorepo vs': ['keep', '150 vol, pos 8'],
  'poly repo': ['keep', '150 vol, pos 2'],
  'best monorepo tools': ['keep', '30 vol, commercial intent, listicle gap (not ranking)'],
  'micro frontend': ['keep', '800 vol, pos 4'],
  'module federation': ['keep', '700 vol, pos 9'],
  'angular module federation': ['keep', '100 vol, pos 7'],
  'angular micro frontends': ['keep', '50 vol, pos 5'],
  'yarn workspaces': ['keep', '600 vol, pos 7'],
  'pnpm workspaces': ['keep', '300 vol, pos 10, distinct SERP+URL from singular'],
  'pnpm workspace': ['keep', '80 vol, pos 5 on a different URL (kb) than the plural (blog) - genuinely divergent'],
  'npm workspace': ['keep', '100 vol, not ranking; only npm-workspaces slot. Add plural variant in expansion'],
  'typescript monorepo': ['keep', '70 vol, pos 3'],
  'circular dependency': ['keep', '300 vol, not ranking, KD 1 - open SERP, real gap'],
  'eslint flat config': ['keep', '150 vol, pos 10'],
  'nx github': ['keep', '250 vol, pos 4, TP 450'],
  'react monorepo': ['keep', '30 vol, pos 2, framework acquisition path'],
  'vite monorepo': ['keep', '50 vol, not ranking, parent topic of react monorepo'],
  'nestjs monorepo': ['keep', '30 vol, not ranking'],
  'python monorepo': ['keep', '30 vol, not ranking - non-JS expansion signal'],
  'gradle monorepo': ['keep', '50 vol, not ranking - JVM signal, pairs with the Develocity threat'],
  'java monorepo': ['keep', '20 vol, not ranking - JVM signal'],
  'javascript monorepo': ['keep', '10 vol, pos 6'],
  'turbo monorepo': ['keep', '70 vol, pos 4, TP 4600 - navigational leak from Turborepo'],
  'monorepo ci/cd': ['keep', '60 vol, not ranking, core Nx Cloud surface'],
  'ci cd pipeline': ['keep', '4.8k vol, KD 0, not ranking - largest open SERP in the set'],
  'ci cd best practices': ['keep', '400 vol, TP 1300, not ranking'],
  'ci cd pipeline best practices': ['keep', '150 vol, TP 1300, not ranking'],
  'flaky tests': ['keep', '400 vol, CPC $14 - highest commercial signal in the CI clusters'],
  'flaky test detection': ['keep', '40 vol, product-shaped, not ranking'],
  'github actions cost': ['keep', '450 vol, TP 1200, KD 42 - the cost cluster anchor'],
  'build cache': ['keep', '80 vol, TP 200, not ranking'],
  'remote cache': ['keep', '20 vol, pos 9, revenue surface'],
  lerna: ['keep', '1.8k vol, not ranking despite the lerna-is-dead blog - real gap'],
  turborepo: ['keep', '14k vol, KD 1, not ranking - the single biggest competitor gap'],
  'nx vs turborepo': ['keep', '200 vol, pos 1, commercial intent'],
  'turborepo vs nx': ['keep', '150 vol, pos 2 - separate SERP from the reversed form, both rank'],
  'turborepo alternatives': ['keep', '30 vol, not ranking, commercial'],
  'nx vs bazel': ['keep', '50 vol, pos 10 - comparison page exists'],
  'nx vs lerna': ['keep', '20 vol, pos 3'],
  'rush stack': ['keep', '10 vol, branded competitor head; kb/nx-vs-rush-stack in flight (DOC-555 A2)'],
  'monorepo tutorial': ['keep', '0 US / 20 global vol, but tutorial intent is a stated content gap'],

  // --- explicit 0-volume exemptions ---
  'migrate turborepo to nx': ['keep-sentiment', 'plan exemption 3: churn-direction pair, keep with its mirror'],
  'migrate nx to turborepo': ['keep-sentiment', 'plan exemption 3: churn-direction pair, keep with its mirror'],
  'rush stack vs nx': ['keep-sentiment', 'plan exemption 4: defends the in-flight kb/nx-vs-rush-stack page'],

  // --- the deliberate 0-volume CI bet: survives Phase 0, Phase 3 decides ---
  'ci observability': ['keep-pending-evidence', 'cluster anchor, 30 vol; needs >=3 qualitative evidence items in Phase 3'],
  'ci analytics': ['keep-pending-evidence', '50 vol, KD 0 - strongest term in the cluster; Phase 3 confirms'],
  'ci caching': ['keep-pending-evidence', 'no Ahrefs record; DOC-555 kb/ci-caching maps to it'],
  'speed up ci': ['keep-pending-evidence', 'no Ahrefs record; symptom framing, DOC-555 kb/ci-caching'],
  'why is my ci slow': ['keep-pending-evidence', 'no Ahrefs record; question framing, feeds prompt set'],
  'ci compute cost': ['keep-pending-evidence', 'no Ahrefs record; cost framing, revenue-adjacent'],
  'reduce ci costs': ['keep-pending-evidence', '20 vol; cost framing'],
  'monorepo ci': ['keep-pending-evidence', '10 vol; overlaps monorepo ci/cd but distinct SERP'],
  'flaky tests ci': ['keep-pending-evidence', '0 vol; retained as the Nx-Cloud-shaped variant of flaky tests'],
  'ci metrics dashboard': ['keep-pending-evidence', 'no Ahrefs record; solution framing'],
  'monorepo ci metrics': ['keep-pending-evidence', 'no Ahrefs record; the Nx-specific observability wedge'],
  'ci build time trends': ['keep-pending-evidence', 'no Ahrefs record; solution framing'],
  'build observability platform': ['keep-pending-evidence', 'no Ahrefs record; category-language bet, weakest of the cluster'],
  'ci pipeline bottleneck': ['keep-pending-evidence', 'no Ahrefs record; symptom framing'],
  'github actions slow workflow': ['keep-pending-evidence', 'no Ahrefs record; strongest symptom phrasing in the cluster'],
  'github actions runner out of memory': ['keep-pending-evidence', 'no Ahrefs record; OOM is a real GitHub-issue vocabulary item'],
  'github actions build time analytics': ['keep-pending-evidence', 'no Ahrefs record; tool-anchored solution framing'],
  'github actions job duration metrics': ['keep-pending-evidence', 'no Ahrefs record; overlaps build time analytics, weaker'],
  'develocity build scan alternative': ['keep-pending-evidence', 'no Ahrefs record; only ci-competitors-generation term tracked - keep as the beachhead'],
  'circleci build insights alternative': ['keep-pending-evidence', 'no Ahrefs record; competitor-anchored, weaker than Develocity'],

  // --- prunes ---
  'gradle monoreop': ['prune', 'typo, no Ahrefs record, no misspelling tag to justify the slot'],
  'ci cpu profile': ['prune', 'no Ahrefs record + morphological dupe of ci cpu profiling; neither is real CI vocabulary'],
  'ci cpu profiling': ['prune', 'no Ahrefs record + morphological dupe of ci cpu profile'],
  'ci memory profile': ['prune', 'no Ahrefs record + morphological dupe of ci memory profiling'],
  'ci memory profiling': ['prune', 'no Ahrefs record + morphological dupe of ci memory profile'],
  'yarn workspace': ['merge-into:yarn workspaces', '10 vol vs 600, same parent topic, singular does not rank'],
  'dotnet monorepo': ['merge-into:.net monorepo', '0 vol vs 10, same intent'],
  '.net monorepo': ['keep', '10 vol, canonical form of the .NET pair'],
  'ts monorepo': ['prune', '0 US vol, abbreviation dupe of typescript monorepo (70 vol, pos 3)'],
  'js monorepo': ['prune', '0 US vol, abbreviation dupe of javascript monorepo'],
  'maven monorepo': ['prune', '0 US / 10 global vol, no ranking, no content; gradle monorepo covers JVM'],
  'bun workspace': ['prune', '0 US vol, no ranking, no content'],
  'turborepo alternative': ['merge-into:turborepo alternatives', '10 vol vs 30, same SERP intent'],
  'nx vs turbo': ['merge-into:nx vs turborepo', '10 vol abbreviation variant, same page'],
  'turbo vs nx': ['merge-into:turborepo vs nx', '20 vol abbreviation variant, same page'],
  'bazel vs nx': ['merge-into:nx vs bazel', 'same 50 vol, same page; reversed form does not rank'],
  'lerna vs nx': ['merge-into:nx vs lerna', 'same 20 vol, same blog page'],
  'bazel vs': ['prune', '10 vol truncated fragment, ambiguous intent, no ranking'],
  'turborepo vs': ['prune', '10 vol truncated fragment, ambiguous intent, no ranking'],
  'rush stack vs': ['prune', 'no Ahrefs record, truncated fragment'],
  'rush stack alternative': ['prune', 'no Ahrefs record; rush stack + rush stack vs nx already cover it'],
  'bazel alternative': ['prune', '0 US / 10 global vol, no ranking'],
  'lerna alternative': ['prune', '0 US / 10 global vol; lerna (1.8k) carries the cluster'],
  'google build system alternative': ['prune', 'no Ahrefs record. The framing is real but is a PROMPT problem (it hands the answer to Bazel), not a keyword - moves to the prompt set'],
  'pnpm workspace vs nx': ['prune', '0 US AND 0 global vol - synthetic comparison, nobody searches it'],
  'npm workspace vs nx': ['prune', '0 US AND 0 global vol - synthetic comparison'],
  'yarn workspace vs nx': ['prune', '0 US AND 0 global vol - synthetic comparison'],
  'bun workspace vs nx': ['prune', 'no Ahrefs record - synthetic comparison'],
  'angular cli vs nx': ['prune', '0 US AND 0 global vol. Angular migration matters; replace with a real-volume term (angular monorepo) in expansion'],
};

const rows = base.map((r) => {
  const v = V[r.keyword];
  if (!v) throw new Error('no verdict for ' + r.keyword);
  return { ...r, verdict: v[0], rationale: v[1] };
});

const cols = ['keyword', 'tags', 'volume_us', 'global_volume', 'difficulty', 'traffic_potential', 'nx_position', 'verdict', 'rationale', 'nx_url'];
const esc = (v) => (/[",]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
fs.writeFileSync(
  new URL('./audit.csv', import.meta.url),
  [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n') + '\n'
);

const tally = {};
for (const r of rows) {
  const k = r.verdict.startsWith('merge-into') ? 'merge' : r.verdict;
  tally[k] = (tally[k] || 0) + 1;
}
console.log(tally);
console.log('slots freed (prune+merge):', (tally.prune || 0) + (tally.merge || 0));
