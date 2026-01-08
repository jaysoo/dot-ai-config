import type { PageData } from '../types';

export function parseCSV(csvText: string): PageData[] {
  const lines = csvText.trim().split('\n');
  const pages: PageData[] = [];

  // Skip header lines (comments and column names)
  let dataStartIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#') || line === '' || line.startsWith('Page path')) {
      dataStartIndex = i + 1;
    } else {
      break;
    }
  }

  // Parse data rows
  for (let i = dataStartIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle CSV parsing (simple split, assumes no commas in values)
    const parts = line.split(',');
    if (parts.length < 10) continue;

    const path = parts[0];
    // Skip grand total row, empty paths, and malformed paths
    if (!path || parts[9]?.includes('Grand total')) continue;
    // Only include paths that start with /docs (exclude weird paths like "docs, /docs', etc.)
    if (!path.startsWith('/docs/') && path !== '/docs') continue;

    const views = parseFloat(parts[1]) || 0;
    const activeUsers = parseFloat(parts[2]) || 0;
    const viewsPerUser = parseFloat(parts[3]) || 0;
    const eventCount = parseFloat(parts[4]) || 0;
    const bounceRate = parseFloat(parts[7]) || 0;
    const entrances = parseFloat(parts[8]) || 0;
    const exits = parseFloat(parts[9]) || 0;

    pages.push({
      path,
      views,
      activeUsers,
      viewsPerUser,
      eventCount,
      bounceRate,
      entrances,
      exits,
    });
  }

  return pages;
}

export async function loadAllData(): Promise<PageData[]> {
  const [mainResponse, extendedResponse] = await Promise.all([
    fetch('/data/pages-main.csv'),
    fetch('/data/pages-extended.csv'),
  ]);

  const [mainText, extendedText] = await Promise.all([
    mainResponse.text(),
    extendedResponse.text(),
  ]);

  const mainPages = parseCSV(mainText);
  const extendedPages = parseCSV(extendedText);

  // Merge and dedupe by path (prefer main data as it's more recent/accurate)
  const pageMap = new Map<string, PageData>();

  // Add extended first (lower priority)
  for (const page of extendedPages) {
    pageMap.set(page.path, page);
  }

  // Override with main (higher priority)
  for (const page of mainPages) {
    pageMap.set(page.path, page);
  }

  return Array.from(pageMap.values());
}
