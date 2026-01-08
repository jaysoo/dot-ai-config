export interface PageData {
  path: string;
  views: number;
  activeUsers: number;
  viewsPerUser: number;
  eventCount: number;
  bounceRate: number;
  entrances: number;
  exits: number;
}

export interface PathSegment {
  segment: string;
  fullPath: string;
  depth: number;
  pages: PageData[];
  children: Map<string, PathSegment>;
  // Aggregated metrics
  totalViews: number;
  totalActiveUsers: number;
  avgBounceRate: number;
  avgViewsPerUser: number;
  totalEntrances: number;
  totalExits: number;
  pageCount: number;
}

export interface AnalysisSummary {
  topPages: PageData[];
  lowEngagementPages: PageData[];
  highBounceExitPages: PageData[];
  pathBreakdown: PathSegment;
}
