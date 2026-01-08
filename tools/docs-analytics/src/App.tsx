import { useState, useEffect } from 'react';
import type { PageData, PathSegment } from './types';
import { loadAllData } from './utils/parser';
import {
  createPathTree,
  getTopPages,
  getHighBounceExitPages,
  getUnderusedPages,
} from './utils/analytics';
import { PathTree } from './components/PathTree';
import { SegmentDetail } from './components/SegmentDetail';
import { PageTable } from './components/PageTable';
import './App.css';

type ViewMode = 'tree' | 'top' | 'problem' | 'unused';

function App() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [tree, setTree] = useState<PathSegment | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<PathSegment | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllData()
      .then((data) => {
        setPages(data);
        const pathTree = createPathTree(data);
        setTree(pathTree);
        // Select the largest section by default
        const docsNode = pathTree.children.get('docs');
        if (docsNode && docsNode.children.size > 0) {
          const topSection = Array.from(docsNode.children.values())
            .sort((a, b) => b.totalViews - a.totalViews)[0];
          setSelectedSegment(topSection);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading analytics data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!tree) {
    return <div className="error">No data available</div>;
  }

  // Use docs node as root since we only care about /docs paths
  const docsNode = tree.children.get('docs');
  if (!docsNode) {
    return <div className="error">No /docs data found</div>;
  }

  const totalViews = docsNode.totalViews;
  const topPages = getTopPages(pages, 50);
  const problemPages = getHighBounceExitPages(pages, 30, 0.35);
  const unusedPages = getUnderusedPages(pages, 30);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Nx.dev Docs Analytics</h1>
        <div className="header-stats">
          <span>{pages.length} pages</span>
          <span>{totalViews.toLocaleString()} total views</span>
        </div>
      </header>

      <nav className="view-nav">
        <button
          className={viewMode === 'tree' ? 'active' : ''}
          onClick={() => setViewMode('tree')}
        >
          Path Explorer
        </button>
        <button
          className={viewMode === 'top' ? 'active' : ''}
          onClick={() => setViewMode('top')}
        >
          Top Pages
        </button>
        <button
          className={viewMode === 'problem' ? 'active' : ''}
          onClick={() => setViewMode('problem')}
        >
          Problem Pages ({problemPages.length})
        </button>
        <button
          className={viewMode === 'unused' ? 'active' : ''}
          onClick={() => setViewMode('unused')}
        >
          Unused Pages ({unusedPages.length})
        </button>
      </nav>

      <main className="main-content">
        {viewMode === 'tree' && (
          <div className="tree-view">
            <aside className="sidebar">
              <h2>Path Segments</h2>
              <div className="tree-container">
                {Array.from(docsNode.children.values())
                  .filter((child) => child.totalViews >= 50)
                  .sort((a, b) => b.totalViews - a.totalViews)
                  .map((child) => (
                    <PathTree
                      key={child.fullPath}
                      node={child}
                      totalViews={totalViews}
                      onSelect={setSelectedSegment}
                      selectedPath={selectedSegment?.fullPath ?? null}
                      baseDepth={2}
                    />
                  ))}
              </div>
            </aside>
            <section className="detail-panel">
              {selectedSegment ? (
                <SegmentDetail segment={selectedSegment} totalViews={totalViews} />
              ) : (
                <div className="no-selection">
                  Select a path segment to see details
                </div>
              )}
            </section>
          </div>
        )}

        {viewMode === 'top' && (
          <div className="list-view">
            <PageTable pages={topPages} title="Top 50 Pages by Views" showEngagement />
          </div>
        )}

        {viewMode === 'problem' && (
          <div className="list-view">
            <div className="view-description">
              <p>
                <strong>Problem pages:</strong> High bounce rate (&gt;35%) + high exit rate
                (&gt;80%), meaning users land on these pages and leave the docs entirely.
              </p>
            </div>
            <PageTable
              pages={problemPages}
              title="High Bounce + Exit Pages"
              showProblem
            />
          </div>
        )}

        {viewMode === 'unused' && (
          <div className="list-view">
            <div className="view-description">
              <p>
                <strong>Unused pages:</strong> Pages with fewer than 30 views. Consider
                consolidating, improving discoverability, or removing.
              </p>
            </div>
            <PageTable pages={unusedPages} title="Low-Traffic Pages" showEngagement />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
