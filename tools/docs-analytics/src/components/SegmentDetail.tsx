import type { PathSegment, PageData } from '../types';
import { PageTable } from './PageTable';
import { calculateEngagementScore, calculateProblemScore } from '../utils/analytics';

interface SegmentDetailProps {
  segment: PathSegment;
  totalViews: number;
}

function getAllPages(node: PathSegment): PageData[] {
  const pages = [...node.pages];
  for (const child of node.children.values()) {
    pages.push(...getAllPages(child));
  }
  return pages;
}

export function SegmentDetail({ segment, totalViews }: SegmentDetailProps) {
  const allPages = getAllPages(segment);
  const percentage = totalViews > 0 ? ((segment.totalViews / totalViews) * 100).toFixed(1) : '0';

  // Sort by different criteria
  const byViews = [...allPages].sort((a, b) => b.views - a.views).slice(0, 20);
  const byEngagement = [...allPages]
    .filter((p) => p.views >= 50)
    .sort((a, b) => calculateEngagementScore(b) - calculateEngagementScore(a))
    .slice(0, 20);
  const problemPages = [...allPages]
    .filter((p) => p.views > 50 && p.bounceRate > 0.3)
    .sort((a, b) => calculateProblemScore(b) - calculateProblemScore(a))
    .slice(0, 20);

  // Pages that are high bounce AND high exit (users leaving docs entirely)
  const exitingPages = allPages
    .filter((p) => {
      if (p.entrances < 20) return false;
      const exitRate = p.exits / p.entrances;
      return p.bounceRate > 0.35 && exitRate > 0.7;
    })
    .sort((a, b) => {
      const aScore = a.bounceRate * (a.exits / Math.max(a.entrances, 1));
      const bScore = b.bounceRate * (b.exits / Math.max(b.entrances, 1));
      return bScore - aScore;
    })
    .slice(0, 20);

  return (
    <div className="segment-detail">
      <div className="segment-header">
        <h2>{segment.fullPath}</h2>
        <div className="segment-stats">
          <div className="stat">
            <span className="label">Total Views</span>
            <span className="value">{segment.totalViews.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="label">% of Total</span>
            <span className="value">{percentage}%</span>
          </div>
          <div className="stat">
            <span className="label">Pages</span>
            <span className="value">{segment.pageCount}</span>
          </div>
          <div className="stat">
            <span className="label">Avg Bounce</span>
            <span className="value">{(segment.avgBounceRate * 100).toFixed(1)}%</span>
          </div>
          <div className="stat">
            <span className="label">Avg Views/User</span>
            <span className="value">{segment.avgViewsPerUser.toFixed(2)}</span>
          </div>
          <div className="stat">
            <span className="label">Entrances</span>
            <span className="value">{segment.totalEntrances.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="label">Exits</span>
            <span className="value">{segment.totalExits.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="tables-grid">
        <PageTable pages={byViews} title="Top Pages by Views" showEngagement />
        <PageTable pages={byEngagement} title="Most Engaging Pages" showEngagement />
        <PageTable pages={problemPages} title="High Bounce Pages" showProblem />
        <PageTable
          pages={exitingPages}
          title="Exit Points (Users Leave Docs)"
          showProblem
        />
      </div>
    </div>
  );
}
