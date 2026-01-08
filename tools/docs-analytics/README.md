# Nx.dev Docs Analytics Dashboard

A local analytics dashboard for analyzing Google Analytics data for Nx documentation pages.

## Quick Start

```bash
cd tools/docs-analytics
pnpm install
pnpm dev
```

Open http://localhost:5173

## Updating Data

### 1. Export from Google Analytics

1. Go to [Google Analytics](https://analytics.google.com)
2. Navigate to **Reports > Engagement > Pages and screens**
3. Set your desired date range
4. Click **Share this report** (top right) > **Download file** > **Download CSV**

### 2. Replace CSV Files

Copy the downloaded CSV file(s) to:

```
tools/docs-analytics/public/data/
```

**File naming:**
- `pages-main.csv` - Primary/recent data (higher priority when merging)
- `pages-extended.csv` - Extended/historical data (lower priority)

If you only have one export, name it `pages-main.csv`.

### 3. Refresh the Dashboard

Either:
- Click the **Refresh Data** button in the app header
- Or refresh your browser

## CSV Format

The app expects Google Analytics 4 CSV exports with these columns:

| Column | Description |
|--------|-------------|
| Page path | URL path (e.g., `/docs/getting-started/intro`) |
| Views | Total page views |
| Active users | Unique users |
| Views per user | Engagement metric |
| Event count | Total events |
| Key events | Conversion events |
| Total revenue | Revenue (usually 0) |
| Bounce rate | Single-page session rate |
| Entrances | Sessions starting on this page |
| Exits | Sessions ending on this page |

## Features

### Path Explorer
- Hierarchical view of documentation sections
- Click sections to drill down
- Shows views, traffic %, and bounce rate per section

### Top Pages
- Sortable table of highest-traffic pages
- Engagement score based on views/user and bounce rate

### Problem Pages
- High bounce rate (>35%) AND high exit rate (>80%)
- These pages may need content improvements

### Unused Pages
- Pages with <30 views
- Candidates for consolidation or removal

## Metrics Explained

**Engagement Score**: `(1 - bounceRate) * 50 + viewsPerUser * 20`
- Higher is better
- Combines low bounce with high repeat views

**Problem Score**: `bounceRate * 100 + (exits/entrances) * 50`
- Higher means more problematic
- Pages where users leave the docs entirely

## Development

```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm preview  # Preview production build
```
