# How does caching work?

Nx has the most sophisticated and battle-tested computation caching system to ensure it never rebuilds the same code twice. When you run a task, Nx checks whether that exact task has been executed before, and if so, it can restore the cached results instead of rerunning it.

## Core Concepts

### Local Caching
By default, Nx stores computation cache locally on your machine. When you run a command like `nx build myapp`, Nx:

1. Creates a hash based on the task inputs (source code, dependencies, configuration, etc.)
2. Checks if this hash exists in the cache
3. If found, restores the outputs instantly from cache
4. If not found, runs the task and stores the outputs in cache for future use

### Remote Caching with Nx Cloud
Nx Cloud extends this capability by allowing you to **share the computation cache across everyone in your team and CI**. This means:

- When a teammate or CI builds a project, the cache is available to everyone
- You can pull cached results from previous CI runs
- No redundant work across your entire development team

## Cache Effectiveness

### More Projects = More Value
The caching system provides more value when there are:

- **More projects in the workspace**: If there's only one project, the cache breaks on 100% of changes. With multiple projects, changing one project allows you to use the cache for the others.
- **Flatter dependency structure**: Modifying a project breaks the cache for all projects that depend on it, similar to how it makes them "affected"

### Example
If you have 4 unconnected projects and modify one, you can use the cache for the other 3 projects. This dramatically reduces build times as your workspace grows.

## Benefits

- **Faster development cycles**: Avoid waiting for tasks that have already been completed
- **Consistent results**: Cached outputs are guaranteed to be the same as if you ran the task
- **CI optimization**: Share cache between local development and CI, and across all team members
