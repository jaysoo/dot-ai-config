# What is Nx Cloud?

Nx Cloud is a companion app for your CI system that extends Nx's capabilities to provide enhanced performance and collaboration features.

## Core Capabilities

### Distributed Task Execution
Nx partitions a command into smaller tasks and runs them in parallel, in the correct order. **Nx Cloud takes it one step further and runs any command across multiple machines**, while giving you a consolidated view of the command as if it ran locally.

### Remote Caching
Nx caches the output of any previously run command such as testing and building, so it can replay the cached results instead of rerunning it. **Nx Cloud allows you to share the computation cache across everyone in your team and CI**.

## Benefits

- **Faster CI Builds**: By distributing tasks across multiple machines, Nx Cloud dramatically improves worst-case CI build times
- **Shared Cache**: Team members and CI agents can share computation results, avoiding redundant work
- **Quick Setup**: Takes approximately five minutes to set up

## Getting Started

To connect to Nx Cloud:

1. Commit and push your changes to GitHub
2. Go to [https://cloud.nx.app](https://cloud.nx.app), create an account, and connect your repository
3. Nx Cloud will send a PR to your repository enabling the integration
4. Once merged, caching, distribution, and other features will start working automatically

You'll then be able to see CI pipeline runs appearing in the Nx Cloud dashboard, providing visibility into your build performance and cache usage.
