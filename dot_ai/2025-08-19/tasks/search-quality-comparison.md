# Search Quality Comparison: Production vs Astro Preview Site

## Task Overview

Compare the quality of search results between the current production Nx documentation site (nx.dev) and the new Astro preview site to evaluate how keyword improvements impact search discoverability and user experience.

## Context

### Current Production Site (nx.dev)
- Uses Algolia for search (found in `nx-dev/feature-search/src/lib/algolia-search.tsx`)
- Search index: `process.env.NEXT_PUBLIC_SEARCH_INDEX`
- Search parameters: `facetFilters: ['language:en']`, `hitsPerPage: 100`, `distinct: true`
- Limited keyword coverage: Only 13 out of 1,055 docs have keywords in frontmatter

### Astro Preview Site 
- New documentation platform being evaluated
- Potentially different search implementation
- Opportunity to implement comprehensive keyword strategy from the start
- Need to determine URLs and search functionality

## Ocean Search Test Suite (30 Keywords)

**Extracted from:** `~/projects/ocean/tools/scripts/scorecards/nx-dev-search-score.ts`

### Nx Commands (8 keywords)
1. **`init`** → Expected: `/nx-api/nx/documents/init`
2. **`import`** → Expected: `/nx-api/nx/documents/import`
3. **`build`** → Expected: `/concepts/common-tasks`
4. **`serve`** → Expected: `/concepts/common-tasks`
5. **`lint`** → Expected: `/concepts/common-tasks`
6. **`affected`** → Expected: `/nx-api/nx/documents/affected`
7. **`release`** → Expected: `/nx-api/nx/documents/release`, `/features/manage-releases`
8. **`migrate`** → Expected: `/nx-api/nx/documents/migrate`, `/features/automate-updating-dependencies`

### Features (5 keywords)
9. **`atomizer`** → Expected: `/ci/features/split-e2e-tasks`
10. **`split tasks`** → Expected: `/ci/features/split-e2e-tasks`
11. **`distributed tasks`** → Expected: `/ci/features/distribute-task-execution`
12. **`nx agents`** → Expected: `/ci/features/distribute-task-execution`
13. **`task pipeline`** → Expected: `/features/run-tasks`, `/concepts/task-pipeline-configuration`

### Concepts (4 keywords)
14. **`inferred tasks`** → Expected: `/concepts/inferred-tasks`
15. **`nx plugins`** → Expected: `/concepts/nx-plugins`, `/plugin-registry`
16. **`update`** → Expected: `/features/automate-updating-dependencies`, `/nx-api/nx/documents/migrate`
17. **`library`** → Expected: `/concepts/decisions/project-size`

### Reference (2 keywords)
18. **`nx.json`** → Expected: `/reference/nx-json`
19. **`project.json`** → Expected: `/reference/project-configuration`

### Frameworks (6 keywords)
20. **`angular`** → Expected: `/nx-api/angular`
21. **`angular matrix`** → Expected: `/nx-api/angular/documents/angular-nx-version-matrix`
22. **`react`** → Expected: `/nx-api/react`
23. **`nestjs`** → Expected: `/nx-api/nest`
24. **`nest`** → Expected: `/nx-api/nest`
25. **`next`** → Expected: `/nx-api/next`

### Tools (3 keywords)
26. **`storybook`** → Expected: `/nx-api/storybook`
27. **`eslint`** → Expected: `/nx-api/eslint`
28. **`jest`** → Expected: `/nx-api/jest`
29. **`vite`** → Expected: `/nx-api/vite`
30. **`docker`** → Expected: (no specific expectation - empty array)

### Additional Tools/Recipes (2 keywords)
31. **`tailwind`** → Expected: `/recipes/react/using-tailwind-css-in-react`, `/recipes/angular/using-tailwind-css-with-angular-projects`
32. **`pnpm`** → Expected: `/recipes/adopting-nx/adding-to-monorepo`

### Code Snippets/API (2 keywords)
33. **`onlyDependOnLibsWithTags`** → Expected: `/nx-api/eslint-plugin/documents/enforce-module-boundaries`
34. **`addProjectConfiguration`** → Expected: `/nx-api/devkit/documents/addProjectConfiguration`
35. **`dependsOn`** → Expected: `/reference/project-configuration`

## Ocean Scoring System

**Ocean uses a ranking-based scoring system:**
- Each keyword should return one or more specific expected URLs
- Score based on position of expected URL in search results:
  - **Position 1-3**: 3 points  
  - **Position 4-6**: 2 points
  - **Position 7-9**: 1 point
  - **Position 10+**: 0 points
  - **Not found**: 0 points

**Final Score**: `(10 × total points) / (total keywords × 3)`  
**Perfect Score**: 10.0 (all expected URLs in top 3 results)

## Site Comparison Framework

### Production Site Testing (nx.dev)
**URL**: `https://nx.dev`
**Search Method**: Algolia search interface
**Test Approach**:
1. Navigate to nx.dev
2. Use search box (Cmd+K) to test each keyword
3. Record top 5 results for each query
4. Score relevance of results (1-5 scale)
5. Note missing or irrelevant results

### Astro Preview Site Testing
**URL**: [To be determined - need preview site URL]
**Search Method**: [To be determined based on Astro implementation]
**Test Approach**:
1. Navigate to preview site
2. Test same keyword set using available search
3. Record and compare results with production
4. Identify improvements or regressions

## Quality Metrics & Scoring

### Relevance Scoring (1-5 scale)
- **5 = Perfect**: Exactly what user needs, comprehensive
- **4 = Very Good**: Relevant and helpful, minor gaps  
- **3 = Good**: Somewhat relevant, but not ideal
- **2 = Poor**: Tangentially related, not very helpful
- **1 = Irrelevant**: Not related to search query

### Success Criteria Per Keyword
- **Top Result Score**: ≥4 (Very Good or Perfect)
- **Top 3 Average Score**: ≥3.5 
- **Top 5 Coverage**: At least 3 relevant results (score ≥3)
- **Zero Results**: Automatic failure for that keyword

### Category Performance Targets
- **Framework Keywords**: 90%+ success rate (critical for user onboarding)
- **Tool Integration**: 85%+ success rate (important for development workflow)
- **Core Concepts**: 95%+ success rate (fundamental to understanding Nx)
- **Features & Commands**: 90%+ success rate (daily usage items)
- **Getting Started**: 100%+ success rate (critical for adoption)
- **Advanced Features**: 75%+ success rate (specialized use cases)

## Implementation Plan

### Phase 1: Comprehensive Site Testing & Comparison

#### Step 1: Production Site Baseline Testing  
- **TODO:**
  - [x] Create comprehensive keyword test suite (75 keywords across 6 categories)
  - [x] Analyze current keyword coverage in documentation files
  - [ ] Test all 75 keywords on production nx.dev site using Playwright
  - [ ] Record search results, ranking, and relevance scores
  - [ ] Identify critical gaps in current search functionality

**Scripts:**
- `extract-keywords.mjs` ✅ (completed - found 285 files missing keywords)
- `production-site-tester.mjs` (to be created)

#### Step 2: Astro Preview Site Testing
- **TODO:**
  - [ ] Determine Astro preview site URL and search implementation
  - [ ] Test same 75 keywords on preview site using Playwright  
  - [ ] Record and score results using same criteria
  - [ ] Document search interface differences between sites

**Scripts:**
- `astro-site-tester.mjs` (to be created)
- `site-comparison-analyzer.mjs` (to be created)

#### Step 3: Detailed Performance Analysis
- **TODO:**
  - [x] Simulate keyword improvements impact (completed)
  - [ ] Compare actual results vs simulated projections
  - [ ] Identify discrepancies between sites
  - [ ] Generate detailed comparison matrix

**Deliverables:**
- Side-by-side comparison table for all 75 keywords
- Category performance breakdown (Framework, Tools, Concepts, etc.)
- Specific recommendations for each site

### Phase 2: Real-Time Testing Implementation

#### Step 4: Automated Site Testing Framework
- **TODO:**
  - [ ] Build Playwright-based testing for both sites
  - [ ] Create automated scoring and comparison
  - [ ] Generate visual reports with screenshots
  - [ ] Set up CI-friendly testing for ongoing monitoring

**Features:**
- Parallel testing of both sites
- Search result screenshots for documentation
- Automated relevance scoring based on result content
- Export to multiple formats (JSON, CSV, HTML report)

#### Step 5: Keyword Impact Validation
- **TODO:**
  - [ ] Test before/after keyword addition impact
  - [ ] Validate that keyword improvements actually improve search
  - [ ] Measure search performance improvements quantitatively
  - [ ] Document which keywords provide highest ROI

### Phase 3: Optimization & Recommendations

#### Step 6: Site-Specific Optimization Strategy
- **TODO:**
  - [ ] Create site-specific keyword strategies
  - [ ] Identify which platform performs better for each keyword category  
  - [ ] Recommend search implementation improvements
  - [ ] Create migration/improvement roadmap

#### Step 7: Ongoing Monitoring Setup
- **TODO:**
  - [ ] Set up automated weekly testing of both sites
  - [ ] Create alerting for search quality regressions
  - [ ] Build dashboard for tracking improvements over time
  - [ ] Document testing methodology for team use

## Detailed Testing Methodology

### Keyword Testing Protocol

**For Each of the 75 Keywords:**

1. **Search Execution**:
   - Navigate to site (nx.dev or preview)
   - Open search interface (Cmd+K for nx.dev)
   - Enter exact keyword
   - Wait for results to load completely
   - Take screenshot of results

2. **Result Analysis**:
   - Record top 5 results (title, URL, snippet)
   - Score each result 1-5 for relevance
   - Calculate average relevance score
   - Note if zero results returned
   - Check for expected result types (guides, references, examples)

3. **Performance Tracking**:
   - Measure search response time
   - Note any search interface issues
   - Track result consistency across multiple tests
   - Document user experience issues

### Site Comparison Metrics

**Quantitative Metrics:**
- **Coverage Rate**: % of keywords returning ≥1 relevant result
- **Excellence Rate**: % of keywords with top result scoring ≥4
- **Average Relevance**: Mean score across all top results  
- **Category Performance**: Performance breakdown by keyword category
- **Search Speed**: Average response time per query

**Qualitative Metrics:**
- **User Experience**: Search interface usability and intuitiveness
- **Result Presentation**: How results are displayed and organized
- **Mobile Experience**: Search functionality on mobile devices
- **Search Features**: Advanced filtering, sorting, or search options

### Expected Test Results Structure

```json
{
  "testDate": "2025-08-19",
  "sites": {
    "production": {
      "url": "https://nx.dev",
      "totalKeywords": 75,
      "coverageRate": "38.2%",
      "excellenceRate": "18.7%", 
      "avgRelevance": 2.31,
      "categoryBreakdown": {
        "frameworks": { "coverage": "80%", "avgScore": 3.2 },
        "tools": { "coverage": "10%", "avgScore": 1.1 },
        "concepts": { "coverage": "33%", "avgScore": 2.1 }
      }
    },
    "astro_preview": {
      "url": "TBD",
      "totalKeywords": 75,
      "coverageRate": "TBD%",
      "excellenceRate": "TBD%",
      "avgRelevance": 0.0,
      "categoryBreakdown": { }
    }
  },
  "comparison": {
    "improvement": "+XX%",
    "winningCategories": ["frameworks", "concepts"],
    "regressionCategories": []
  }
}

## Technical Approach

### 1. Keyword Extraction Script
```javascript
// Extract all keywords from docs
// Group by frequency and document type
// Identify gaps in keyword coverage
```

### 2. Search Quality Tester
```javascript
// Test searches for each important keyword
// Measure relevance of results
// Compare rankings
// Generate quality scores
```

### 3. Comparison Framework
```javascript
// Before/after comparison of search results
// Visual diff of result rankings
// Statistical analysis of improvements
```

## Key Considerations

1. **Search Index Configuration**: Review Algolia index settings for optimization opportunities
2. **Keyword Consistency**: Ensure similar concepts use consistent keywords
3. **User Intent**: Map keywords to user intentions and journey stages
4. **Performance**: Balance keyword density with readability
5. **Maintenance**: Create sustainable process for keyword management

## Success Criteria

- [ ] All critical documentation pages have appropriate keywords
- [ ] Search precision improves by at least 20%
- [ ] Top 5 results for important queries are always relevant
- [ ] Reduced user complaints about search functionality
- [ ] Established monitoring for ongoing search quality

## Next Steps

1. Start with Step 1: Create keyword extraction script
2. Analyze current keyword coverage
3. Define specific quality metrics based on findings
4. Implement testing framework
5. Run comparisons and iterate

## References

- Algolia Search Component: `nx-dev/feature-search/src/lib/algolia-search.tsx`
- Example Keyword Usage: `docs/shared/packages/angular/angular-plugin.md`
- Search Environment Variables: `NEXT_PUBLIC_SEARCH_INDEX`, `NEXT_PUBLIC_SEARCH_API_KEY`, `NEXT_PUBLIC_SEARCH_APP_ID`

## CRITICAL: Implementation Tracking

Keep track of all implementation steps in this document as we progress through the phases. Update TODOs as completed and add notes about findings and decisions.