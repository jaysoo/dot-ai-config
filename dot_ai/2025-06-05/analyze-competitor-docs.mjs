#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Script to analyze competitor documentation sites
 * Outputs a comparison matrix for getting started experiences
 */

const competitors = [
  {
    name: 'TurboRepo',
    url: 'https://turbo.build/repo/docs',
    gettingStartedUrl: 'https://turbo.build/repo/docs/getting-started',
  },
  {
    name: 'Moon',
    url: 'https://moonrepo.dev/docs',
    gettingStartedUrl: 'https://moonrepo.dev/docs/intro',
  },
  {
    name: 'SST',
    url: 'https://sst.dev/docs',
    gettingStartedUrl: 'https://sst.dev/docs/quickstart',
  },
  {
    name: 'Vite',
    url: 'https://vitejs.dev/guide/',
    gettingStartedUrl: 'https://vitejs.dev/guide/',
  },
  {
    name: 'Next.js',
    url: 'https://nextjs.org/docs',
    gettingStartedUrl: 'https://nextjs.org/docs/getting-started',
  },
  {
    name: 'Remix',
    url: 'https://remix.run/docs',
    gettingStartedUrl: 'https://remix.run/docs/en/main/start/quickstart',
  },
  {
    name: 'Astro',
    url: 'https://docs.astro.build',
    gettingStartedUrl: 'https://docs.astro.build/en/getting-started/',
  }
];

const analysisCategories = [
  'First Impression',
  'Time to First Success',
  'Visual Elements',
  'Interactive Examples',
  'Learning Paths',
  'Command Clarity',
  'Framework Support',
  'Migration Path',
  'Community Links',
  'Mobile Experience'
];

// Create analysis template
function createAnalysisTemplate(competitor) {
  return `
## ${competitor.name}

**URL**: ${competitor.url}
**Getting Started**: ${competitor.gettingStartedUrl}

### Analysis:

#### 1. First Impression (Hero Section)
- **Value Proposition**: 
- **Primary CTA**: 
- **Time Estimate**: 
- **Visual Hook**: 

#### 2. Onboarding Flow
- **Steps to First Success**: 
- **Prerequisites Listed**: 
- **Error Handling**: 
- **Progress Indicators**: 

#### 3. Content Structure
- **Information Architecture**: 
- **Progressive Disclosure**: 
- **Code-to-Text Ratio**: 
- **Example Quality**: 

#### 4. Interactive Elements
- **Live Code Examples**: 
- **Playground/Sandbox**: 
- **Copy Button**: 
- **Syntax Highlighting**: 

#### 5. Unique Features
- **Standout Elements**: 
- **Innovation**: 
- **User Delight**: 

#### 6. Areas of Excellence
1. 
2. 
3. 

#### 7. Potential Improvements
1. 
2. 
3. 

#### 8. Key Takeaways for Nx
- 
- 
- 

---
`;
}

// Create comparison matrix
function createComparisonMatrix() {
  let matrix = `# Competitor Documentation Analysis Matrix

Generated: ${new Date().toISOString()}

## Quick Comparison

| Feature | ${competitors.map(c => c.name).join(' | ')} | Nx Current |
|---------|${competitors.map(() => '---').join('|')}|---|
`;

  analysisCategories.forEach(category => {
    matrix += `| ${category} | ${competitors.map(() => '⭐️ ?/5').join(' | ')} | ⭐️ ?/5 |\n`;
  });

  return matrix;
}

// Main execution
async function main() {
  const outputDir = path.join(process.cwd(), 'competitor-analysis');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Create individual analysis files
  competitors.forEach(competitor => {
    const fileName = `${competitor.name.toLowerCase().replace(/\s+/g, '-')}-analysis.md`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, createAnalysisTemplate(competitor));
    console.log(`✅ Created analysis template: ${fileName}`);
  });

  // Create comparison matrix
  const matrixPath = path.join(outputDir, 'comparison-matrix.md');
  fs.writeFileSync(matrixPath, createComparisonMatrix());
  console.log(`✅ Created comparison matrix: comparison-matrix.md`);

  // Create insights summary
  const insightsContent = `# Documentation Insights Summary

## Best Practices Observed

### 1. Immediate Value Demonstration
- 
- 
- 

### 2. Progressive Disclosure Patterns
- 
- 
- 

### 3. Interactive Learning
- 
- 
- 

### 4. Visual Communication
- 
- 
- 

### 5. Developer Experience Optimizations
- 
- 
- 

## Recommendations for Nx

### High Priority
1. 
2. 
3. 

### Medium Priority
1. 
2. 
3. 

### Nice to Have
1. 
2. 
3. 

## Implementation Effort vs Impact Matrix

\`\`\`
High Impact │ Quick Wins    │ Major Projects
           │               │
           │               │
           │───────────────┼───────────────
           │               │
           │ Fill Later    │ Consider Later
Low Impact │               │
           └───────────────┴───────────────
           Low Effort      High Effort
\`\`\`

## Next Steps
1. Review and fill in analysis templates
2. Visit each site and document findings
3. Create mockups based on best practices
4. Prioritize improvements for implementation
`;

  const insightsPath = path.join(outputDir, 'insights-summary.md');
  fs.writeFileSync(insightsPath, insightsContent);
  console.log(`✅ Created insights summary: insights-summary.md`);

  console.log(`
📊 Analysis templates created successfully!

Next steps:
1. Visit each competitor site and fill in the analysis templates
2. Update the comparison matrix with ratings
3. Document key insights in the summary
4. Use findings to inform Nx improvements

Output directory: ${outputDir}
`);
}

main().catch(console.error);