# Nx Agents

## Metadata

**Status**: shipped  
**Developers**: @AgentMarine, @FrozenPandaz, @jaysoo  
**Created**: 2024-02-15  
**Last Updated**: 2025-06-09  
**Category**: Cloud  

## Overview

Nx Agents is a dynamic task distribution system that automatically scales CI resources to match workload demands. It intelligently distributes tasks across multiple agents to minimize CI execution time while optimizing resource usage.

## Problem Statement

Traditional CI systems suffer from static resource allocation, leading to either wasted resources during low-demand periods or bottlenecks during high-demand builds. Large monorepos often have uneven task distributions where some tasks complete quickly while others take much longer, leaving agents idle.

Developers needed:
- Faster CI execution without over-provisioning resources
- Automatic scaling based on actual workload requirements
- Intelligent task distribution to minimize total execution time
- Cost optimization through dynamic resource allocation

## Solution

Nx Agents implements a dynamic task distribution system that:

1. **Analyzes Task Graph**: Examines the entire task dependency graph to understand parallelization opportunities
2. **Predicts Resource Needs**: Uses historical data and task characteristics to estimate execution requirements
3. **Scales Dynamically**: Automatically provisions the optimal number of agents based on workload
4. **Distributes Intelligently**: Assigns tasks to agents using advanced scheduling algorithms
5. **Optimizes Continuously**: Learns from execution patterns to improve future distributions

## Implementation Details

### Architecture

- **Task Coordinator**: Central service that manages task distribution and agent coordination
- **Agent Fleet**: Dynamic pool of compute resources that can be scaled up or down
- **Scheduling Engine**: Advanced algorithms for optimal task assignment
- **Monitoring System**: Real-time tracking of task progress and agent utilization

### Key Components

1. **Task Analysis**: 
   - Dependency graph parsing
   - Historical execution time analysis
   - Resource requirement estimation

2. **Agent Management**:
   - Dynamic provisioning and deprovisioning
   - Health monitoring and failover
   - Load balancing across available agents

3. **Execution Optimization**:
   - Intelligent task batching
   - Parallel execution coordination
   - Real-time rescheduling based on performance

### Performance Considerations

- Minimal overhead from coordination (<5% of total execution time)
- Sub-second task assignment decisions
- Efficient agent utilization (>90% target)
- Automatic recovery from agent failures

## Configuration

### Basic Setup

```yaml
# nx-cloud.yml
agents:
  enabled: true
  minAgents: 1
  maxAgents: 10
  targetUtilization: 0.85
```

### Advanced Configuration

```yaml
# nx-cloud.yml
agents:
  enabled: true
  minAgents: 2
  maxAgents: 20
  targetUtilization: 0.90
  
  # Custom agent specifications
  agentSpecs:
    - name: "standard"
      cpu: 4
      memory: "8GB"
      disk: "50GB"
    - name: "high-memory"
      cpu: 8
      memory: "32GB"
      disk: "100GB"
      
  # Task assignment preferences
  scheduling:
    algorithm: "balanced" # balanced, speed, cost
    batchSize: 5
    timeoutMinutes: 30
```

### Environment Variables

- `NX_CLOUD_AGENTS_ENABLED`: Enable/disable agents (default: true)
- `NX_CLOUD_MAX_AGENTS`: Override maximum agent limit
- `NX_CLOUD_AGENT_TIMEOUT`: Agent timeout in minutes

## Examples

### Basic Usage

```bash
# Agents are automatically enabled for Nx Cloud workspaces
nx run-many -t build test

# Monitor execution with agents
nx run-many -t build test --verbose
```

### CI Configuration

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Run CI with Nx Agents
        run: |
          npx nx-cloud start-ci-run --stop-agents-after="build"
          npx nx run-many -t lint test build
        env:
          NX_CLOUD_ACCESS_TOKEN: ${{ secrets.NX_CLOUD_ACCESS_TOKEN }}
```

### Custom Workflows

```bash
# Start agents for long-running tasks
npx nx-cloud start-ci-run --agents=5

# Run tasks with specific agent requirements
npx nx run-many -t e2e --parallel --maxParallel=3

# Stop agents when done
npx nx-cloud stop-all-agents
```

## Related Features

- [Nx Cloud Caching](nx-cloud-caching.md): Distributed caching that works with agents
- [Task Orchestration](task-orchestration.md): Core task scheduling system
- [CI Pipeline Integration](ci-pipeline-integration.md): Native CI/CD platform support
- [Resource Monitoring](resource-monitoring.md): Real-time performance tracking

## Resources

- GitHub Issues: [#18234](https://github.com/nrwl/nx/issues/18234), [#19456](https://github.com/nrwl/nx/issues/19456)
- Pull Requests: [#18890](https://github.com/nrwl/nx/pull/18890), [#19123](https://github.com/nrwl/nx/pull/19123)
- Documentation: [Nx Agents Guide](https://nx.dev/ci/features/dynamic-agents)
- Blog Posts: [Introducing Nx Agents](https://blog.nrwl.io/nx-agents-effortlessly-fast-ci), [Scaling CI with Dynamic Agents](https://blog.nrwl.io/scaling-ci-dynamic-agents)