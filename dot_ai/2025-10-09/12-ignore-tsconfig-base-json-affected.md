# How can I ignore `tsconfig.base.json` changes when using `nx show projects --affected`?

When working with the affected command in Nx, you may want to exclude certain files like `tsconfig.base.json` from triggering projects as affected.

## Understanding Affected Detection

By default, Nx determines which projects are affected by analyzing:
- File changes between two Git commits
- Project dependencies defined in the project graph
- Configuration files that impact multiple projects

Changes to `tsconfig.base.json` typically affect many or all projects since it's a shared configuration file at the workspace root.

## Configuration Options

While the documentation snippets provided don't show a direct configuration for ignoring specific files in affected calculations, there are several approaches you can consider:

### 1. Use Specific File Filters

When running affected commands, you can specify which files to consider:

```shell
nx affected:graph --files=libs/mylib/src/index.ts
```

This explicitly limits the affected calculation to specific files.

### 2. Leverage .nxignore

Nx supports a `.nxignore` file (similar to `.gitignore`) that can be used to exclude files from Nx's file watching and change detection.

### 3. Custom Base and Head References

You can control which changes are considered by specifying base and head commits:

```shell
# Only consider changes between main and current branch
nx affected -t test --base=main --head=HEAD

# Exclude the last commit (if it only modified tsconfig.base.json)
nx affected -t test --base=main~1 --head=main
```

### 4. Exclude Projects

If you want to run affected commands but exclude certain projects:

```shell
nx affected:graph --exclude=project-one,project-two
```

## Best Practices

1. **Commit Configuration Changes Separately**: Keep `tsconfig.base.json` changes in separate commits from feature work
2. **Use CI Strategies**: In CI, you might want to run full builds when shared configuration changes
3. **Review Project Graph**: Use `nx graph --affected` to understand why projects are marked as affected

## Additional Context

The `tsconfig.base.json` file is essential for Nx workspaces as it defines TypeScript path mappings for all libraries. Changes to this file often indicate new libraries or changed import paths, which legitimately affect multiple projects.

For more specific configuration options, consult the [Nx affected documentation](https://nx.dev/concepts/affected) or run:

```shell
nx affected --help
```
