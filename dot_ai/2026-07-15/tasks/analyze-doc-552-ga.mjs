import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const csvPath = process.argv[2] ?? '/Users/jack/Downloads/download.csv';
const sitemapPath = process.argv[3] ?? '/private/tmp/doc-552-sitemap.xml';
const workspaceRoot = process.cwd();
const netlifyConfigPath = `${workspaceRoot}/astro-docs/netlify.toml`;

function parseCsvLine(line) {
  const fields = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      fields.push(field);
      field = '';
    } else {
      field += character;
    }
  }

  fields.push(field);
  return fields;
}

function normalizePath(value) {
  let path = value.trim();
  if (!path) return '';

  if (/^https?:\/\//i.test(path)) {
    try {
      path = new URL(path).pathname;
    } catch {
      return '';
    }
  } else {
    path = path.split(/[?#]/, 1)[0];
  }

  if (path.length > 1) path = path.replace(/\/+$/, '');
  return path.toLowerCase();
}

function quantile(sortedValues, percentile) {
  if (sortedValues.length === 0) return 0;
  const index = (sortedValues.length - 1) * percentile;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sortedValues[lower];
  const weight = index - lower;
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

const csv = readFileSync(csvPath, 'utf8');
const lines = csv.split(/\r?\n/);
const dateRange =
  lines.find((line) => /^# \d{8}-\d{8}$/.test(line))?.slice(2) ?? null;
const [rangeStartRaw, rangeEndRaw] = dateRange?.split('-') ?? [];
const parseCompactDate = (value) =>
  value
    ? new Date(
        `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T00:00:00Z`
      )
    : null;
const rangeStart = parseCompactDate(rangeStartRaw);
const rangeEnd = parseCompactDate(rangeEndRaw);
const exportDays =
  rangeStart && rangeEnd
    ? Math.floor((rangeEnd - rangeStart) / 86_400_000) + 1
    : null;
const headerIndex = lines.findIndex(
  (line) => line.trim() === 'Page title,Event count'
);

if (headerIndex === -1) {
  throw new Error('Could not find the GA export header.');
}

const trafficByPath = new Map();
let exportTotal = 0;
let dataRows = 0;

for (const line of lines.slice(headerIndex + 1)) {
  if (!line.trim()) continue;
  const fields = parseCsvLine(line);
  const rawPath = fields[0] ?? '';
  const eventCount = Number((fields[1] ?? '').replaceAll(',', ''));

  if (!rawPath && fields[2] === 'Grand total') {
    exportTotal = eventCount;
    continue;
  }

  if (!Number.isFinite(eventCount)) continue;
  const path = normalizePath(rawPath);
  if (!path) continue;

  trafficByPath.set(path, (trafficByPath.get(path) ?? 0) + eventCount);
  dataRows += 1;
}

const sidebarInventory = JSON.parse(
  execFileSync(
    'pnpm',
    [
      'exec',
      'tsx',
      '-e',
      `import { sidebarTabs } from './astro-docs/sidebar.mts';
       const walk = (items, labels = [], output = []) => {
         for (const item of items) {
           if (typeof item === 'string') continue;
           const nextLabels = [...labels, item.label];
           const route = item.link ?? item.slug;
           if (route) output.push({ title: item.label, category: nextLabels[1] ?? 'Uncategorized', oldUrl: '/docs/' + route });
           if (Array.isArray(item.items)) walk(item.items, nextLabels, output);
         }
         return output;
       };
       const tab = sidebarTabs.find((item) => item.id === 'tab-knowledge-base');
       if (!tab) throw new Error('Knowledge Base sidebar tab not found.');
       console.log(JSON.stringify(walk(tab.groups)));`,
    ],
    { cwd: workspaceRoot, encoding: 'utf8' }
  )
);

const articles = sidebarInventory.map((article) => ({
  ...article,
  currentRouteRequests: trafficByPath.get(normalizePath(article.oldUrl)) ?? 0,
}));

const sitemap = readFileSync(sitemapPath, 'utf8');
const sitemapPaths = new Set(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname
  )
);

const legacyIndexRoutes = execFileSync(
  'rg',
  ['--files', 'astro-docs/src/content/docs/knowledge-base'],
  { cwd: workspaceRoot, encoding: 'utf8' }
)
  .trim()
  .split(/\r?\n/)
  .map((sourceFile) => {
    const route = sourceFile
      .replace(/^astro-docs\/src\/content\/docs\//, '')
      .replace(/\/index\.mdoc$/, '')
      .toLowerCase();
    const oldUrl = `/docs/${route}`;
    return {
      type: 'legacy-index',
      sourceFile,
      oldUrl,
      requests: trafficByPath.get(normalizePath(oldUrl)) ?? 0,
      inSitemap: sitemapPaths.has(oldUrl),
    };
  })
  .sort((left, right) => left.oldUrl.localeCompare(right.oldUrl));

const addedFileLog = execFileSync(
  'git',
  [
    'log',
    '--diff-filter=A',
    '--date=short',
    `--since=${rangeStartRaw?.slice(0, 4)}-${rangeStartRaw?.slice(4, 6)}-${rangeStartRaw?.slice(6, 8)}`,
    '--format=@@%ad',
    '--name-only',
    '--',
    'astro-docs/src/content/docs',
  ],
  { cwd: workspaceRoot, encoding: 'utf8' }
);

const addedDateByRoute = new Map();
let commitDate = null;
for (const line of addedFileLog.split(/\r?\n/)) {
  if (line.startsWith('@@')) {
    commitDate = line.slice(2);
    continue;
  }
  if (!commitDate || !/\.m(?:doc|dx)$/.test(line)) continue;
  let route = line
    .replace(/^astro-docs\/src\/content\/docs\//, '')
    .replace(/\.m(?:doc|dx)$/, '')
    .toLowerCase()
    .replaceAll(' ', '-');
  route = route.replace(/\/index$/, '');
  addedDateByRoute.set(`/docs/${route}`, commitDate);
}

const netlifyConfig = readFileSync(netlifyConfigPath, 'utf8');
const redirectBlocks = [
  ...netlifyConfig.matchAll(/\[\[redirects\]\]([\s\S]*?)(?=\n\[\[|$)/g),
];
const exactRedirects = redirectBlocks.flatMap((match) => {
  const from = match[1].match(/^from\s*=\s*"([^"]+)"/m)?.[1];
  const to = match[1].match(/^to\s*=\s*"([^"]+)"/m)?.[1];
  if (!from || !to || /[*:]/.test(from)) return [];
  return [{ from: normalizePath(from), to: normalizePath(to) }];
});

const sourcesByTarget = new Map();
for (const redirect of exactRedirects) {
  const sources = sourcesByTarget.get(redirect.to) ?? [];
  sources.push(redirect.from);
  sourcesByTarget.set(redirect.to, sources);
}

function findPredecessorPaths(target, seen = new Set()) {
  const normalizedTarget = normalizePath(target);
  if (seen.has(normalizedTarget)) return [];
  seen.add(normalizedTarget);

  return (sourcesByTarget.get(normalizedTarget) ?? []).flatMap((source) => [
    source,
    ...findPredecessorPaths(source, seen),
  ]);
}

for (const article of articles) {
  article.predecessorPaths = [...new Set(findPredecessorPaths(article.oldUrl))];
  article.predecessorRouteRequests = article.predecessorPaths.reduce(
    (total, path) => total + (trafficByPath.get(path) ?? 0),
    0
  );
  article.requests =
    article.currentRouteRequests + article.predecessorRouteRequests;
  article.addedDuringWindow =
    article.predecessorPaths.length === 0
      ? (addedDateByRoute.get(normalizePath(article.oldUrl)) ?? null)
      : null;
  const addedDate = article.addedDuringWindow
    ? new Date(`${article.addedDuringWindow}T00:00:00Z`)
    : rangeStart;
  article.exposureDays =
    addedDate && rangeEnd
      ? Math.max(1, Math.floor((rangeEnd - addedDate) / 86_400_000) + 1)
      : exportDays;
  article.requestsPerExposureDay =
    article.exposureDays == null
      ? null
      : article.requests / article.exposureDays;
}

const ascending = [...articles].sort(
  (left, right) =>
    left.requests - right.requests || left.oldUrl.localeCompare(right.oldUrl)
);
const descending = [...ascending].reverse();
const byDailyTraffic = [...articles].sort(
  (left, right) =>
    left.requestsPerExposureDay - right.requestsPerExposureDay ||
    left.oldUrl.localeCompare(right.oldUrl)
);
const requestValues = ascending.map((article) => article.requests);
const kbRequests = requestValues.reduce((total, value) => total + value, 0);

const categoryMap = new Map();
for (const article of articles) {
  const aggregate = categoryMap.get(article.category) ?? {
    category: article.category,
    pages: 0,
    requests: 0,
    zeroTrafficPages: 0,
  };
  aggregate.pages += 1;
  aggregate.requests += article.requests;
  if (article.requests === 0) aggregate.zeroTrafficPages += 1;
  categoryMap.set(article.category, aggregate);
}

const thresholds = [0, 10, 25, 50, 100, 250, 500, 1000].map((maximum) => {
  const pages = ascending.filter((article) => article.requests <= maximum);
  const requests = pages.reduce(
    (total, article) => total + article.requests,
    0
  );
  return {
    maximum,
    pages: pages.length,
    requests,
    shareOfKbRequests: kbRequests === 0 ? 0 : requests / kbRequests,
  };
});

const bottomCounts = [10, 25, 50, 75, 100].map((count) => {
  const pages = ascending.slice(0, count);
  const requests = pages.reduce(
    (total, article) => total + article.requests,
    0
  );
  return {
    count,
    requests,
    shareOfKbRequests: kbRequests === 0 ? 0 : requests / kbRequests,
  };
});

console.log(
  JSON.stringify(
    {
      source: {
        csvPath,
        sitemapPath,
        dateRange,
        exportTotal,
        parsedDataRows: dataRows,
        uniqueNormalizedPaths: trafficByPath.size,
        metric: 'Server Page Requests event count',
        exportDays,
      },
      knowledgeBase: {
        pages: articles.length,
        pagesWithTraffic: articles.filter((article) => article.requests > 0)
          .length,
        zeroTrafficPages: articles.filter((article) => article.requests === 0)
          .length,
        requests: kbRequests,
        shareOfExport: exportTotal === 0 ? 0 : kbRequests / exportTotal,
        quantiles: {
          minimum: requestValues[0] ?? 0,
          p10: quantile(requestValues, 0.1),
          p25: quantile(requestValues, 0.25),
          median: quantile(requestValues, 0.5),
          p75: quantile(requestValues, 0.75),
          p90: quantile(requestValues, 0.9),
          maximum: requestValues.at(-1) ?? 0,
        },
        thresholds,
        bottomCounts,
      },
      routeCoverage: {
        sitemapPages: sitemapPaths.size,
        sidebarArticles: articles.length,
        sidebarArticlesMissingFromSitemap: articles.filter(
          (article) => !sitemapPaths.has(article.oldUrl)
        ),
        legacyIndexes: legacyIndexRoutes.length,
        legacyIndexesMissingFromSitemap: legacyIndexRoutes.filter(
          (route) => !route.inSitemap
        ),
      },
      lowDirectTraffic: {
        sidebarArticlesAtMost3: articles.filter(
          (article) => article.currentRouteRequests <= 3
        ),
        sidebarArticlesAtMost3IncludingPredecessors: articles.filter(
          (article) => article.requests <= 3
        ),
        legacyIndexesAtMost3: legacyIndexRoutes.filter(
          (route) => route.requests <= 3
        ),
      },
      articlesWithPredecessorTraffic: articles
        .filter((article) => article.predecessorRouteRequests > 0)
        .sort(
          (left, right) =>
            right.predecessorRouteRequests - left.predecessorRouteRequests
        ),
      articlesAddedDuringWindow: articles
        .filter((article) => article.addedDuringWindow)
        .sort(
          (left, right) =>
            left.addedDuringWindow.localeCompare(right.addedDuringWindow) ||
            left.oldUrl.localeCompare(right.oldUrl)
        ),
      lowestDailyTraffic: byDailyTraffic.slice(0, 40),
      categories: [...categoryMap.values()].sort(
        (left, right) =>
          right.requests - left.requests ||
          left.category.localeCompare(right.category)
      ),
      topArticles: descending.slice(0, 30),
      bottomArticles: ascending.slice(0, 100),
    },
    null,
    2
  )
);
