import { useState } from 'react';
import type { PageData } from '../types';
import { calculateEngagementScore, calculateProblemScore } from '../utils/analytics';

interface PageTableProps {
  pages: PageData[];
  title: string;
  showEngagement?: boolean;
  showProblem?: boolean;
}

type SortKey = 'path' | 'views' | 'activeUsers' | 'viewsPerUser' | 'bounceRate' | 'entrances' | 'exits' | 'engagement' | 'problem';
type SortDir = 'asc' | 'desc';

export function PageTable({ pages, title, showEngagement, showProblem }: PageTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('views');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  if (pages.length === 0) {
    return (
      <div className="page-table">
        <h3>{title}</h3>
        <p className="empty">No pages match criteria</p>
      </div>
    );
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'path' ? 'asc' : 'desc');
    }
  };

  const sortedPages = [...pages].sort((a, b) => {
    let aVal: number | string;
    let bVal: number | string;

    switch (sortKey) {
      case 'path':
        aVal = a.path;
        bVal = b.path;
        break;
      case 'views':
        aVal = a.views;
        bVal = b.views;
        break;
      case 'activeUsers':
        aVal = a.activeUsers;
        bVal = b.activeUsers;
        break;
      case 'viewsPerUser':
        aVal = a.viewsPerUser;
        bVal = b.viewsPerUser;
        break;
      case 'bounceRate':
        aVal = a.bounceRate;
        bVal = b.bounceRate;
        break;
      case 'entrances':
        aVal = a.entrances;
        bVal = b.entrances;
        break;
      case 'exits':
        aVal = a.exits;
        bVal = b.exits;
        break;
      case 'engagement':
        aVal = calculateEngagementScore(a);
        bVal = calculateEngagementScore(b);
        break;
      case 'problem':
        aVal = calculateProblemScore(a);
        bVal = calculateProblemScore(b);
        break;
      default:
        return 0;
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <th onClick={() => handleSort(sortKeyName)} className="sortable">
      {label}
      {sortKey === sortKeyName && (
        <span className="sort-indicator">{sortDir === 'asc' ? ' ▲' : ' ▼'}</span>
      )}
    </th>
  );

  return (
    <div className="page-table">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <SortHeader label="Page" sortKeyName="path" />
            <SortHeader label="Views" sortKeyName="views" />
            <SortHeader label="Users" sortKeyName="activeUsers" />
            <SortHeader label="Views/User" sortKeyName="viewsPerUser" />
            <SortHeader label="Bounce" sortKeyName="bounceRate" />
            <SortHeader label="Entrances" sortKeyName="entrances" />
            <SortHeader label="Exits" sortKeyName="exits" />
            {showEngagement && <SortHeader label="Engagement" sortKeyName="engagement" />}
            {showProblem && <SortHeader label="Problem" sortKeyName="problem" />}
          </tr>
        </thead>
        <tbody>
          {sortedPages.map((page) => {
            const exitRate =
              page.entrances > 0 ? ((page.exits / page.entrances) * 100).toFixed(0) : '-';
            return (
              <tr key={page.path}>
                <td className="path" title={page.path}>
                  {page.path.length > 60 ? '...' + page.path.slice(-57) : page.path}
                </td>
                <td>{page.views.toLocaleString()}</td>
                <td>{page.activeUsers.toLocaleString()}</td>
                <td>{page.viewsPerUser.toFixed(2)}</td>
                <td className={page.bounceRate > 0.4 ? 'high-bounce' : ''}>
                  {(page.bounceRate * 100).toFixed(1)}%
                </td>
                <td>{page.entrances.toLocaleString()}</td>
                <td title={`Exit rate: ${exitRate}%`}>{page.exits.toLocaleString()}</td>
                {showEngagement && (
                  <td className="score engagement">
                    {calculateEngagementScore(page).toFixed(0)}
                  </td>
                )}
                {showProblem && (
                  <td className="score problem">{calculateProblemScore(page).toFixed(0)}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
