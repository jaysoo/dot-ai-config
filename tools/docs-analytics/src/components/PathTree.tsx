import { useState } from 'react';
import type { PathSegment } from '../types';

interface PathTreeProps {
  node: PathSegment;
  totalViews: number;
  onSelect: (node: PathSegment) => void;
  selectedPath: string | null;
  baseDepth?: number;
}

export function PathTree({ node, totalViews, onSelect, selectedPath, baseDepth = 0 }: PathTreeProps) {
  const displayDepth = node.depth - baseDepth;
  const [expanded, setExpanded] = useState(displayDepth < 2);
  const hasChildren = node.children.size > 0;
  const percentage = totalViews > 0 ? ((node.totalViews / totalViews) * 100).toFixed(1) : '0';
  const isSelected = selectedPath === node.fullPath;

  // Filter out low-traffic segments (< 50 views) to reduce noise
  const children = Array.from(node.children.values())
    .filter((child) => child.totalViews >= 50)
    .sort((a, b) => b.totalViews - a.totalViews);

  return (
    <div className="path-tree-node" style={{ marginLeft: displayDepth * 16 }}>
      <div
        className={`path-row ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelect(node)}
      >
        {hasChildren && (
          <button
            className="expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? '▼' : '▶'}
          </button>
        )}
        {!hasChildren && <span className="expand-placeholder" />}
        <span className="segment-name">{node.segment}</span>
        <span className="metrics">
          <span className="views">{node.totalViews.toLocaleString()} views</span>
          <span className="percentage">{percentage}%</span>
          <span className="bounce" title="Avg Bounce Rate">
            {(node.avgBounceRate * 100).toFixed(1)}% bounce
          </span>
        </span>
      </div>
      {expanded && hasChildren && (
        <div className="children">
          {children.map((child) => (
            <PathTree
              key={child.fullPath}
              node={child}
              totalViews={totalViews}
              onSelect={onSelect}
              selectedPath={selectedPath}
              baseDepth={baseDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
}
