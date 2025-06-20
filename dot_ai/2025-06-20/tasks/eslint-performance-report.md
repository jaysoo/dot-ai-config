# ESLint Plugin Performance Report

Generated at: 2025-06-20T17:58:58.207Z

## With Cache

Environment:
```json
{
  "NX_DAEMON": "true",
  "NX_PROJECT_GRAPH_CACHE": "true"
}
```

| Project | Duration (s) | Status | Notes |
|---------|-------------|--------|-------|
| nx | 5.91 | ✅ | Has timing logs |
| nx-dev | 3.34 | ✅ | Has timing logs |
| graph-client | 4.37 | ✅ | Has timing logs |
| workspace | 4.28 | ✅ | Has timing logs |
| angular | 5.03 | ✅ | Has timing logs |

**Total Duration:** 22.91s

### Timing Log Details

## Without Cache (as reported in issue)

Environment:
```json
{
  "NX_DAEMON": "false",
  "NX_PROJECT_GRAPH_CACHE": "false"
}
```

| Project | Duration (s) | Status | Notes |
|---------|-------------|--------|-------|
| nx | 9.85 | ✅ | Has timing logs |
| nx-dev | 5.14 | ✅ | Has timing logs |
| graph-client | 6.11 | ✅ | Has timing logs |
| workspace | 5.99 | ✅ | Has timing logs |
| angular | 6.79 | ✅ | Has timing logs |

**Total Duration:** 33.87s

### Timing Log Details

## Performance Comparison

| Project | With Cache (s) | Without Cache (s) | Difference (s) | Slowdown Factor |
|---------|---------------|------------------|----------------|----------------|
| nx | 5.91 | 9.85 | 3.94 | 1.67x |
| nx-dev | 3.34 | 5.14 | 1.80 | 1.54x |
| graph-client | 4.37 | 6.11 | 1.75 | 1.40x |
| workspace | 4.28 | 5.99 | 1.71 | 1.40x |
| angular | 5.03 | 6.79 | 1.76 | 1.35x |
