# NXC-3215: Investigation Plan for typescript:createNodes Performance Issues

**Linear Issue**: https://linear.app/nxdev/issue/NXC-3215/investigate-performance-issues-related-to-typescriptcreatenodes-and
**Due Date**: 2025-11-06
**Assignee**: Jack Hsu
**Slack Thread**: https://nrwl.slack.com/archives/C6WJMCAB1/p1757516081427829

## Problem Statement

ProductBoard is experiencing significant slowdowns in Nx graph creation, primarily attributed to:
1. `@nx/js/typescript:createNodes` taking **11.06 seconds**
2. `nx/js/dependencies-and-lockfile:createDependencies` taking **4.78 seconds**

### Performance Comparison
- No plugins + warm cache: **1.38s**
- No plugins + cold cache: **6.74s - 10s**
- With inferred plugins + no cache: **17s - 31s**

### Key Complaint
Every CI run recreates the project graph without caching, leading to massive overhead. Customer proves that preserving cache dir and warming it with `nx show projects` dramatically improves performance.

## Scope Analysis

### Workspace Size
- **2,073 tsconfig files** being processed by typescript:createNodes
- **1.5MB pnpm-lock.yaml** (44,000 lines)
- pnpm lockfile version: 9.0
- Large monorepo with many apps and libs

### Data Files Available
- `/Users/jack/Downloads/pnpm-lock (1).yaml` - Full lockfile from customer
- `/Users/jack/Downloads/args.json` - All 2,073 tsconfig paths passed to createNodes

## Investigation Plan

### Phase 1: Environment Setup & Reproduction

#### 1.1 Create Synthetic Test Workspace
```bash
# Goal: Build a representative test case without customer code
cd /tmp
mkdir -p nxc-3215-repro
cd nxc-3215-repro

# Create workspace with similar scale
# - ~2000 projects
# - Mix of apps/libs
# - Realistic tsconfig structure
```

**Considerations:**
- Use customer's pnpm-lock.yaml if possible
- Mirror their project structure (apps/libs ratio)
- Include realistic tsconfig.json patterns (base/app/spec variants)

#### 1.2 Copy Customer Data
```bash
# Copy lockfile and args to test workspace
cp /Users/jack/Downloads/pnpm-lock\ \(1\).yaml ./pnpm-lock.yaml
```

### Phase 2: Baseline Benchmarking

#### 2.1 Measure Current Performance
```bash
# Clean benchmark - no cache
rm -rf .nx/cache
time nx show projects --verbose

# With warm cache
time nx show projects --verbose

# Profile with Node.js profiler
node --prof $(which nx) show projects
node --prof-process isolate-*.log > profile.txt
```

#### 2.2 Isolate Plugin Performance
```bash
# Test without inferred plugins
# Temporarily disable in nx.json
{
  "plugins": []
}

# Measure baseline
time nx show projects

# Enable only @nx/js plugin
{
  "plugins": ["@nx/js"]
}

# Measure impact
time nx show projects
```

### Phase 3: Profile typescript:createNodes

#### 3.1 Analyze createNodes Implementation
**File**: `packages/js/src/plugins/typescript/plugin.ts`

**Key Questions:**
1. How many times is `createNodes` called? (Once per tsconfig file = 2,073 times)
2. What work is done per invocation?
3. Is there file I/O on each call?
4. Are there synchronous operations blocking?
5. Is tsconfig parsing optimized?

#### 3.2 Profile Hotspots
```typescript
// Add performance marks to plugin code
const { performance } = require('perf_hooks');

performance.mark('createNodes-start');
// ... createNodes logic
performance.mark('createNodes-end');
performance.measure('createNodes', 'createNodes-start', 'createNodes-end');
```

**Areas to Profile:**
- File reading (`fs.readFileSync` vs `fs.promises.readFile`)
- JSON parsing of tsconfig files
- Path resolution and normalization
- Project configuration building
- Cache lookups/writes

#### 3.3 Batch Processing Analysis
**Question**: Can we process multiple tsconfig files together instead of one-by-one?

Current (suspected):
```
for each tsconfig file (2,073 times):
  - read file
  - parse JSON
  - resolve paths
  - create node
```

Potential optimization:
```
batch files together:
  - read all files in parallel
  - parse all JSON
  - resolve paths in bulk
  - create nodes in batch
```

### Phase 4: Profile dependencies-and-lockfile:createDependencies

#### 4.1 Analyze pnpm-lock.yaml Parsing
**File**: `packages/js/src/plugins/dependencies-and-lockfile/plugin.ts`

**Key Questions:**
1. How is the 1.5MB YAML parsed?
2. Is parsing synchronous or async?
3. How many times is the lockfile read? (Should be once, but verify)
4. Is the parsed result cached?
5. Are there expensive traversals of the dependency tree?

#### 4.2 pnpm v9 Format Analysis
```bash
# Check lockfile structure
head -50 /Users/jack/Downloads/pnpm-lock\ \(1\).yaml

# Count dependencies
grep -c "^  " /Users/jack/Downloads/pnpm-lock\ \(1\).yaml

# Check for performance-impacting patterns
# - Deep nesting
# - Large number of overrides
# - Workspace protocol usage
```

**pnpm v9 specifics:**
- New lockfile format (v9.0)
- Potential parsing differences from v6/v7
- Verify our parser handles v9 efficiently

#### 4.3 Dependency Resolution Performance
```typescript
// Profile dependency extraction
performance.mark('parseLockfile-start');
const deps = parsePnpmLockfile(lockfileContent);
performance.mark('parseLockfile-end');

performance.mark('buildDepGraph-start');
const graph = buildDependencyGraph(deps);
performance.mark('buildDepGraph-end');
```

### Phase 5: Cache Analysis

#### 5.1 Understand Current Cache Behavior
**Questions:**
1. What is cached by typescript:createNodes?
2. What is cached by dependencies-and-lockfile?
3. Cache key generation - what invalidates cache?
4. Are cache lookups themselves expensive?

#### 5.2 CI Cache Behavior
From issue: "Every time they run a process, the project graph is being recreated and not cached in CI"

**Investigate:**
```bash
# What's in .nx/cache?
ls -lah .nx/cache

# What files affect cache invalidation?
# - pnpm-lock.yaml hash?
# - tsconfig.json hashes?
# - plugin version?
# - nx version?
```

#### 5.3 Cache Warming Strategy
Customer proves warming cache with `nx show projects` helps.

**Document:**
- What exactly gets cached by `nx show projects`?
- Can we improve cache warming?
- Can we make cache more resilient to changes?

### Phase 6: Identify Optimization Opportunities

#### 6.1 Quick Wins
Potential optimizations to test:

1. **Parallel File Reading**
   - Read tsconfig files in parallel instead of sequentially
   - Use worker threads for large batches?

2. **Cache More Aggressively**
   - Cache parsed tsconfig contents
   - Cache lockfile parse results
   - Share cache between plugins

3. **Lazy Loading**
   - Only parse tsconfig files for affected projects
   - Defer dependency analysis until needed

4. **Reduce I/O**
   - Batch file reads
   - Use `fs.promises` instead of sync calls
   - Memory-map large files?

5. **Optimize Parsing**
   - Use faster JSON parser for tsconfig
   - Use faster YAML parser for lockfile
   - Pre-compile regexes

#### 6.2 Structural Changes
Bigger changes to consider:

1. **Plugin Architecture**
   - Can createNodes receive batches instead of single files?
   - Can we avoid calling createNodes 2,073 times?

2. **Lockfile Handling**
   - Parse lockfile once, share result
   - Incremental parsing for large lockfiles
   - Consider binary cache format

3. **Project Graph Generation**
   - Is there redundant work across plugins?
   - Can we merge plugin execution?
   - Better parallelization?

### Phase 7: Benchmarking Optimizations

For each optimization:

```bash
# Before
time nx show projects --verbose
# Record: Total time, plugin time breakdown

# After optimization
time nx show projects --verbose
# Compare: Total time, plugin time breakdown

# Verify correctness
nx run-many -t build --all
```

**Success Criteria:**
- typescript:createNodes: < 5s (from 11s)
- dependencies-and-lockfile: < 2s (from 4.78s)
- Total graph creation: < 10s (from 17-31s)

### Phase 8: Documentation & Recommendations

#### 8.1 Document Findings
Create detailed report:
- Root causes identified
- Performance bottlenecks
- Optimization results
- Trade-offs

#### 8.2 Recommendations
- Short-term fixes (patch release)
- Long-term improvements (major version)
- Customer workarounds
- CI best practices

#### 8.3 Customer Communication
- Share findings with ProductBoard
- Provide immediate workarounds
- Timeline for fixes
- Best practices for CI caching

## Tools & Scripts

### Benchmark Script
```typescript
// benchmark-plugins.ts
import { performance } from 'perf_hooks';
import { createNodes } from '@nx/js/src/plugins/typescript/plugin';

const files = require('./args.json')[0];

performance.mark('start');
for (const file of files) {
  createNodes(file);
}
performance.mark('end');
const measure = performance.measure('total', 'start', 'end');
console.log(`Total time: ${measure.duration}ms`);
console.log(`Avg per file: ${measure.duration / files.length}ms`);
```

### Profile Analysis
```bash
# Generate flame graph
node --prof $(which nx) show projects
node --prof-process --preprocess -j isolate-*.log | flamebearer

# Or use clinic.js
clinic doctor -- nx show projects
clinic bubbleprof -- nx show projects
```

### Cache Inspector
```bash
# Check cache effectiveness
NX_VERBOSE_LOGGING=true NX_CACHE_DIRECTORY=.nx/cache nx show projects 2>&1 | grep -i cache
```

## Success Metrics

### Performance Targets
- [ ] typescript:createNodes < 5s (currently 11.06s) - **55% reduction**
- [ ] dependencies-and-lockfile < 2s (currently 4.78s) - **58% reduction**
- [ ] Total graph creation < 10s (currently 17-31s) - **41-68% reduction**

### Cache Effectiveness
- [ ] Warm cache graph creation < 3s (currently 1.38s - already good!)
- [ ] CI cache hit rate > 80%
- [ ] Cache survives common scenarios (dep updates, config changes)

### Customer Satisfaction
- [ ] ProductBoard confirms improvement
- [ ] Documentation for CI caching best practices
- [ ] Workarounds for current version

## Timeline

- **Phase 1-2 (Setup & Baseline)**: 2-3 hours
- **Phase 3 (typescript:createNodes)**: 4-6 hours
- **Phase 4 (lockfile parsing)**: 3-4 hours
- **Phase 5 (Cache analysis)**: 2-3 hours
- **Phase 6 (Optimizations)**: Variable (depends on findings)
- **Phase 7 (Benchmarking)**: 2-3 hours
- **Phase 8 (Documentation)**: 2-3 hours

**Estimated Total**: 2-3 days for thorough investigation and initial optimizations

## Next Steps

1. Copy this plan to Linear issue as comment
2. Set up test environment with customer data
3. Run baseline benchmarks
4. Begin profiling typescript:createNodes
5. Report initial findings in Slack thread

## Notes

- Customer is on Nx 21.4.1 - verify behavior on latest
- pnpm lockfile v9.0 - relatively new format
- 2,073 tsconfig files is VERY large - need to handle scale
- Cache is key for CI performance - investigate thoroughly
