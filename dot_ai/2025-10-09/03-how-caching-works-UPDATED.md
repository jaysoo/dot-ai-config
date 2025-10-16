# How does caching work?

Nx uses a sophisticated caching mechanism to save the output of calculations so they can be replayed later without actually performing the calculation again. This is one of Nx's most powerful features for improving build performance.

## What is a Cache?

A cache is a mechanism for saving the output of a calculation so it can be replayed later without actually performing the calculation again. When you run a task, Nx:

1. Creates a hash based on the task inputs (source code, dependencies, configuration, etc.)
2. Checks if this hash exists in the cache
3. If found, restores the outputs instantly from cache
4. If not found, runs the task and stores the outputs in cache for future use

## Cache Effectiveness

### More Projects = More Value

Caching provides more value when there are more projects and a flatter structure:

- **Single project**: The cache will be broken on 100% of changes
- **Multiple unconnected projects**: Changing one project allows you to use the cache for the other projects

For example, if there are 4 unconnected projects and you modify one, you can still use the cache for the other 3 projects.

### Dependency Impact

Just as modifying a project makes projects that depend on it be `affected`, modifying a project also breaks the cache for projects that depend on it. This is why a flatter dependency structure provides better caching benefits.

## Learn More

For a detailed explanation of how caching works, including:
- What factors determine cache validity
- How local and remote caches work together
- Computation hashing strategies

See the [How Caching Works](/docs/concepts/how-caching-works) documentation.

For information on using the cache feature, see [Cache Task Results](/docs/features/cache-task-results).
