import type { PageData, PathSegment } from '../types';

export function createPathTree(pages: PageData[]): PathSegment {
  const root: PathSegment = {
    segment: '/',
    fullPath: '/',
    depth: 0,
    pages: [],
    children: new Map(),
    totalViews: 0,
    totalActiveUsers: 0,
    avgBounceRate: 0,
    avgViewsPerUser: 0,
    totalEntrances: 0,
    totalExits: 0,
    pageCount: 0,
  };

  for (const page of pages) {
    const segments = page.path.split('/').filter(Boolean);
    let current = root;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const fullPath = '/' + segments.slice(0, i + 1).join('/');

      if (!current.children.has(segment)) {
        current.children.set(segment, {
          segment,
          fullPath,
          depth: i + 1,
          pages: [],
          children: new Map(),
          totalViews: 0,
          totalActiveUsers: 0,
          avgBounceRate: 0,
          avgViewsPerUser: 0,
          totalEntrances: 0,
          totalExits: 0,
          pageCount: 0,
        });
      }

      current = current.children.get(segment)!;
    }

    // Add page to its final segment
    current.pages.push(page);
  }

  // Calculate aggregated metrics bottom-up
  calculateAggregates(root);

  return root;
}

function calculateAggregates(node: PathSegment): void {
  // First, recursively calculate children
  for (const child of node.children.values()) {
    calculateAggregates(child);
  }

  // Aggregate from direct pages
  let totalViews = 0;
  let totalActiveUsers = 0;
  let totalBounceWeighted = 0;
  let totalViewsPerUserWeighted = 0;
  let totalEntrances = 0;
  let totalExits = 0;
  let pageCount = 0;

  for (const page of node.pages) {
    totalViews += page.views;
    totalActiveUsers += page.activeUsers;
    totalBounceWeighted += page.bounceRate * page.views;
    totalViewsPerUserWeighted += page.viewsPerUser * page.views;
    totalEntrances += page.entrances;
    totalExits += page.exits;
    pageCount++;
  }

  // Add from children
  for (const child of node.children.values()) {
    totalViews += child.totalViews;
    totalActiveUsers += child.totalActiveUsers;
    totalBounceWeighted += child.avgBounceRate * child.totalViews;
    totalViewsPerUserWeighted += child.avgViewsPerUser * child.totalViews;
    totalEntrances += child.totalEntrances;
    totalExits += child.totalExits;
    pageCount += child.pageCount;
  }

  node.totalViews = totalViews;
  node.totalActiveUsers = totalActiveUsers;
  node.avgBounceRate = totalViews > 0 ? totalBounceWeighted / totalViews : 0;
  node.avgViewsPerUser = totalViews > 0 ? totalViewsPerUserWeighted / totalViews : 0;
  node.totalEntrances = totalEntrances;
  node.totalExits = totalExits;
  node.pageCount = pageCount;
}

export function getTopPages(pages: PageData[], limit = 50): PageData[] {
  return [...pages].sort((a, b) => b.views - a.views).slice(0, limit);
}

export function getLowEngagementPages(pages: PageData[], minViews = 100): PageData[] {
  return pages
    .filter((p) => p.views >= minViews && p.viewsPerUser < 1.2)
    .sort((a, b) => a.viewsPerUser - b.viewsPerUser);
}

export function getHighBounceExitPages(
  pages: PageData[],
  minEntrances = 50,
  bounceThreshold = 0.4
): PageData[] {
  return pages
    .filter((p) => {
      const exitRate = p.entrances > 0 ? p.exits / p.entrances : 0;
      return (
        p.entrances >= minEntrances &&
        p.bounceRate >= bounceThreshold &&
        exitRate > 0.8
      );
    })
    .sort((a, b) => {
      // Sort by bounce rate * exit rate combined
      const aScore = a.bounceRate * (a.exits / Math.max(a.entrances, 1));
      const bScore = b.bounceRate * (b.exits / Math.max(b.entrances, 1));
      return bScore - aScore;
    });
}

export function getUnderusedPages(pages: PageData[], viewsThreshold = 50): PageData[] {
  return pages.filter((p) => p.views <= viewsThreshold).sort((a, b) => a.views - b.views);
}

export function calculateEngagementScore(page: PageData): number {
  // Higher is better
  // Factors: views per user (engagement), low bounce rate, high exit ratio (they read fully)
  const bounceScore = 1 - page.bounceRate;
  const engagementScore = Math.min(page.viewsPerUser / 2, 1); // Cap at 2 views/user = perfect
  return (bounceScore * 0.4 + engagementScore * 0.6) * 100;
}

export function calculateProblemScore(page: PageData): number {
  // Higher is worse
  // High bounce + high exit rate + low views per user
  const exitRate = page.entrances > 0 ? page.exits / page.entrances : 0;
  const bounceScore = page.bounceRate;
  const lowEngagement = Math.max(0, 1 - page.viewsPerUser / 2);
  return (bounceScore * 0.4 + exitRate * 0.4 + lowEngagement * 0.2) * 100;
}
