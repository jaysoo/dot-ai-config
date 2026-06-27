#!/usr/bin/env node
/**
 * nx-oss-repos — Collect popular open-source GitHub repos that use Nx.
 *
 * Finds every PUBLIC repo that:
 *   1. has an `nx.json` at the repo ROOT, and
 *   2. has more than --min-stars stars (default 500),
 * and reports whether each one is connected to Nx Cloud
 * (i.e. `nxCloudId` is set in nx.json).
 *
 * ── How it works ────────────────────────────────────────────────────────────
 * Stage 1 — DISCOVER (REST code search):
 *   GitHub's code-search API (`filename:nx.json`) finds candidate repos. It
 *   searches public code globally but caps at 1,000 results per query, can't
 *   sort by stars, and only indexes the default branch + files < 384 KB. To get
 *   past the 1,000 cap we PARTITION the search by file size (`size:` buckets);
 *   each bucket stays under the cap and the union covers everything.
 *
 * Stage 2 — ENRICH (GraphQL):
 *   For each candidate repo we batch-fetch `stargazerCount` and the ROOT
 *   `nx.json` blob (`object(expression: "HEAD:nx.json")`) ~50 repos per request.
 *   Fetching `HEAD:nx.json` also confirms the file is really at the root — code
 *   search matches `nx.json` anywhere, so nested-only hits resolve to null here
 *   and get dropped.
 *
 * Stage 3 — FILTER & CLASSIFY:
 *   Keep repos with stars > min, parse nx.json, and detect the Nx Cloud
 *   connection: `nxCloudId` (modern), legacy `nxCloudAccessToken` /
 *   tasksRunnerOptions accessToken, or `neverConnectToCloud`.
 *
 * ── Usage ───────────────────────────────────────────────────────────────────
 *   export GH_TOKEN=ghp_xxx           # a PAT with public_repo / read scope
 *   ./nx-oss-repos.mjs                # writes nx-oss-repos.{json,csv,md}
 *   ./nx-oss-repos.mjs --min-stars 1000 --out ./report
 *   ./nx-oss-repos.mjs --json         # also dump full JSON to stdout
 *
 * Requires Node 18+ (global fetch). No dependencies.
 *
 * Note: GitHub code search needs auth and is rate-limited to ~10 req/min, so a
 * full run takes a few minutes. Results cover only PUBLIC repos on their default
 * branch — by design, that's the open-source population the question asks about.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

// ── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const MIN_STARS = parseInt(getArg('--min-stars', '500'), 10);
const OUT_DIR = getArg('--out', '.');
const OUT_BASE = join(OUT_DIR, 'nx-oss-repos');
const PRINT_JSON = args.includes('--json');

const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!TOKEN) {
  console.error('Error: set GH_TOKEN (or GITHUB_TOKEN) to a GitHub PAT.');
  process.exit(1);
}

const GH_API = 'https://api.github.com';
const GH_GQL = 'https://api.github.com/graphql';
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'nx-oss-repos-collector',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...m) => console.error(...m); // progress to stderr, data to files/stdout

const CODE_SEARCH_CAP = 1000; // GitHub returns at most 1,000 results per query
const MAX_NX_JSON_SIZE = 400000; // code search doesn't index files > 384 KB
const SEARCH_DELAY_MS = 6500; // ~10 code-search req/min limit

// ── Stage 1: discover candidate repos via code search ────────────────────────
async function searchCodePage(q, page) {
  const url = `${GH_API}/search/code?q=${encodeURIComponent(q)}&per_page=100&page=${page}`;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: HEADERS });
    if (res.status === 403 || res.status === 429) {
      // Secondary / primary rate limit — back off using Retry-After or reset header.
      const retryAfter = parseInt(res.headers.get('retry-after') || '0', 10);
      const reset = parseInt(res.headers.get('x-ratelimit-reset') || '0', 10);
      const waitMs = retryAfter
        ? retryAfter * 1000
        : reset
          ? Math.max(0, reset * 1000 - Date.now()) + 1000
          : Math.min(60000, 2000 * 2 ** attempt);
      log(`  rate limited, waiting ${Math.ceil(waitMs / 1000)}s…`);
      await sleep(waitMs);
      continue;
    }
    if (!res.ok) {
      throw new Error(`code search failed: ${res.status} ${await res.text()}`);
    }
    return res.json();
  }
}

function ingest(data, repos) {
  for (const item of data.items ?? []) {
    const full = item.repository?.full_name;
    if (full && !repos.has(full)) {
      const [owner, name] = full.split('/');
      repos.set(full, { owner, name });
    }
  }
}

// Recursively partition a [lo, hi] byte-size range so no query exceeds the
// 1,000-result cap. We peek total_count on page 1; if a range is over the cap
// and still splittable, bisect it; otherwise drain its pages. A single byte
// size still over the cap is irreducible (size is code search's only numeric
// axis) — we take the 1,000 we can and warn. The page-1 fetch is reused, so the
// only overhead vs. fixed buckets is one peek request per internal split node.
async function discoverRange(lo, hi, repos, irreducible) {
  const q = `filename:nx.json size:${lo}..${hi}`;
  const first = await searchCodePage(q, 1);
  const total = first.total_count ?? 0;
  log(`[discover] size:${lo}..${hi} -> ${total}`);
  if (total === 0) return;

  if (total >= CODE_SEARCH_CAP && lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    await sleep(SEARCH_DELAY_MS);
    await discoverRange(lo, mid, repos, irreducible);
    await sleep(SEARCH_DELAY_MS);
    await discoverRange(mid + 1, hi, repos, irreducible);
    return;
  }

  // Drain this range (page 1 already fetched).
  ingest(first, repos);
  const pages = Math.ceil(Math.min(total, CODE_SEARCH_CAP) / 100);
  for (let page = 2; page <= pages; page++) {
    await sleep(SEARCH_DELAY_MS);
    ingest(await searchCodePage(q, page), repos);
  }
  if (total >= CODE_SEARCH_CAP) {
    irreducible.push({ range: `${lo}..${hi}`, total });
    log(
      `  ⚠ irreducible bucket size:${lo}..${hi} still has ${total} (>= ` +
        `${CODE_SEARCH_CAP}); some repos in it are unreachable via code search.`,
    );
  }
}

async function discoverRepos() {
  const repos = new Map(); // full_name -> {owner, name}
  const irreducible = [];
  await discoverRange(0, MAX_NX_JSON_SIZE, repos, irreducible);
  if (irreducible.length) {
    log(
      `\n⚠ ${irreducible.length} size range(s) remained over the cap — coverage ` +
        `is a lower bound (size is code search's only numeric partition axis).`,
    );
  } else {
    log(`\n[discover] full coverage — every size range fit under the cap.`);
  }
  return [...repos.values()];
}

// ── Stage 2: enrich with stars + root nx.json via GraphQL ────────────────────
function buildGraphQL(batch) {
  const fields = batch
    .map(
      (r, i) => `
    r${i}: repository(owner: ${JSON.stringify(r.owner)}, name: ${JSON.stringify(r.name)}) {
      nameWithOwner
      url
      isArchived
      isFork
      stargazerCount
      pushedAt
      primaryLanguage { name }
      object(expression: "HEAD:nx.json") { ... on Blob { text byteSize isTruncated } }
    }`,
    )
    .join('\n');
  return `query {${fields}\n}`;
}

async function gqlBatch(batch) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(GH_GQL, {
      method: 'POST',
      headers: { ...HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: buildGraphQL(batch) }),
    });
    if (res.status === 403 || res.status === 429 || res.status >= 500) {
      const waitMs = Math.min(60000, 2000 * 2 ** attempt);
      log(`  graphql ${res.status}, retry in ${Math.ceil(waitMs / 1000)}s…`);
      await sleep(waitMs);
      continue;
    }
    if (!res.ok) throw new Error(`graphql failed: ${res.status} ${await res.text()}`);
    const json = await res.json();
    // GraphQL returns partial data + per-alias errors for missing repos; that's fine.
    return json.data ?? {};
  }
}

async function enrich(repos) {
  const out = [];
  const BATCH = 50;
  for (let i = 0; i < repos.length; i += BATCH) {
    const batch = repos.slice(i, i + BATCH);
    const data = await gqlBatch(batch);
    for (let j = 0; j < batch.length; j++) {
      const node = data[`r${j}`];
      if (node) out.push(node);
    }
    log(`[enrich] ${Math.min(i + BATCH, repos.length)}/${repos.length}`);
    await sleep(800);
  }
  return out;
}

// ── Stage 3: filter & classify ───────────────────────────────────────────────
function parseJsonc(text) {
  try {
    return JSON.parse(text);
  } catch {
    // tolerate JSONC-style comments just in case
    const stripped = text
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[^:])\/\/.*$/gm, '$1');
    try {
      return JSON.parse(stripped);
    } catch {
      return null;
    }
  }
}

function classifyCloud(nx) {
  if (!nx || typeof nx !== 'object') return { status: 'unparseable', nxCloudId: null };
  if (nx.nxCloudId) return { status: 'nxCloudId', nxCloudId: nx.nxCloudId };
  if (nx.nxCloudAccessToken) return { status: 'legacy-accessToken', nxCloudId: null };
  const legacyToken =
    nx.tasksRunnerOptions?.default?.options?.accessToken ||
    nx.tasksRunnerOptions?.default?.options?.nxCloudId;
  if (legacyToken) return { status: 'legacy-accessToken', nxCloudId: nx.tasksRunnerOptions?.default?.options?.nxCloudId || null };
  if (nx.neverConnectToCloud === true) return { status: 'opted-out', nxCloudId: null };
  return { status: 'not-connected', nxCloudId: null };
}

function classify(nodes) {
  const rows = [];
  for (const n of nodes) {
    if (!n?.object?.text) continue; // no ROOT nx.json -> nested-only hit, drop it
    if (n.stargazerCount <= MIN_STARS) continue;
    const nx = parseJsonc(n.object.text);
    const cloud = classifyCloud(nx);
    rows.push({
      repo: n.nameWithOwner,
      url: n.url,
      stars: n.stargazerCount,
      language: n.primaryLanguage?.name ?? '',
      archived: !!n.isArchived,
      fork: !!n.isFork,
      pushedAt: n.pushedAt ?? '',
      connectedToCloud: cloud.status === 'nxCloudId' || cloud.status === 'legacy-accessToken',
      cloudStatus: cloud.status, // nxCloudId | legacy-accessToken | opted-out | not-connected | unparseable
      nxCloudId: cloud.nxCloudId ?? '',
    });
  }
  rows.sort((a, b) => b.stars - a.stars);
  return rows;
}

// ── Output ───────────────────────────────────────────────────────────────────
function toCsv(rows) {
  const cols = [
    'repo', 'url', 'stars', 'language', 'archived', 'fork',
    'pushedAt', 'connectedToCloud', 'cloudStatus', 'nxCloudId',
  ];
  const esc = (v) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}

function toMarkdown(rows) {
  const connected = rows.filter((r) => r.connectedToCloud).length;
  const lines = [];
  lines.push(`# Popular Nx open-source repos (> ${MIN_STARS}★)`);
  lines.push('');
  lines.push(`- **Repos found:** ${rows.length}`);
  lines.push(`- **Connected to Nx Cloud:** ${connected} (${rows.length ? Math.round((connected / rows.length) * 100) : 0}%)`);
  lines.push(`- **Not connected:** ${rows.length - connected}`);
  lines.push('');
  lines.push('| Repo | Stars | Lang | Nx Cloud | nxCloudId | Status |');
  lines.push('|------|------:|------|:--------:|----------|--------|');
  for (const r of rows) {
    lines.push(
      `| [${r.repo}](${r.url}) | ${r.stars} | ${r.language} | ${r.connectedToCloud ? '✅' : '—'} | ${r.nxCloudId ? '`' + r.nxCloudId + '`' : ''} | ${r.cloudStatus} |`,
    );
  }
  return lines.join('\n') + '\n';
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  log(`Collecting public repos with a root nx.json and > ${MIN_STARS} stars…\n`);
  const candidates = await discoverRepos();
  log(`\n[discover] ${candidates.length} unique candidate repos\n`);
  const enriched = await enrich(candidates);
  const rows = classify(enriched);

  mkdirSync(dirname(OUT_BASE) === '' ? '.' : dirname(OUT_BASE), { recursive: true });
  writeFileSync(`${OUT_BASE}.json`, JSON.stringify(rows, null, 2));
  writeFileSync(`${OUT_BASE}.csv`, toCsv(rows));
  writeFileSync(`${OUT_BASE}.md`, toMarkdown(rows));

  const connected = rows.filter((r) => r.connectedToCloud).length;
  log(`\n✅ Done. ${rows.length} repos (> ${MIN_STARS}★), ${connected} on Nx Cloud.`);
  log(`   Wrote ${OUT_BASE}.{json,csv,md}`);
  if (PRINT_JSON) console.log(JSON.stringify(rows, null, 2));
}

main().catch((e) => {
  log('Fatal:', e.message);
  process.exit(1);
});
