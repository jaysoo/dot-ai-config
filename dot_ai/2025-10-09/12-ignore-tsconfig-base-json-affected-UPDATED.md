# How can I ignore `tsconfig.base.json` changes when using `nx show projects --affected`?

When working with the affected command in Nx, you may want to control how certain files like `tsconfig.base.json` impact affected project detection.

## Understanding Affected Detection

By default, Nx determines which projects are affected by analyzing:
- File changes between two Git commits
- Project dependencies defined in the project graph
- Configuration files that impact multiple projects

Changes to `tsconfig.base.json` typically affect many or all projects since it's a shared configuration file at the workspace root.

## Strategies for Managing Affected Detection

### 1. Use Specific File Filters

When running affected commands, you can specify which files to consider:

```shell
nx affected:graph --files=libs/mylib/src/index.ts
```

This explicitly limits the affected calculation to specific files.

### 2. Control Base and Head References

You can control which changes are considered by specifying base and head commits:

```shell
# Only consider changes between main and current branch
nx affected:graph --base=main --head=HEAD

# Save affected graph to file
nx affected:graph --base=main --head=HEAD --file=output.json

# Generate static HTML with affected projects
nx affected:graph --base=main --head=HEAD --file=output.html

# Consider only the last commit
nx affected:graph --base=main~1 --head=main
```

### 3. Exclude Specific Projects

If you want to run affected commands but exclude certain projects:

```shell
nx affected:graph --exclude=project-one,project-two
```

### 4. Configure Dependency Update Behavior

By default, Nx marks all projects as affected when package manager lock files change. You can opt into smarter behavior:

```json
{
  "pluginsConfig": {
    "@nx/js": {
      "projectsAffectedByDependencyUpdates": "auto"
    }
  }
}
```

The `projectsAffectedByDependencyUpdates` flag can be set to:
- `"auto"` - Only mark projects that actually depend on updated packages
- `"all"` - Mark all projects (default, failsafe behavior)
- An array with project specifiers

## Best Practices

1. **Commit Configuration Changes Separately**: Keep `tsconfig.base.json` changes in separate commits from feature work
2. **Use CI Strategies**: In CI, you might want to run full builds when shared configuration changes
3. **Review Project Graph**: Use `nx graph --affected` to understand why projects are marked as affected
4. **Leverage nx-ignore in CI**: For platforms like Vercel, use `npx nx-ignore <app-name>` to only build affected apps

## Additional Context

The `tsconfig.base.json` file is essential for Nx workspaces as it defines TypeScript path mappings for all libraries. Changes to this file often indicate:
- New libraries being added
- Changed import paths
- TypeScript configuration updates

These changes legitimately affect multiple projects, which is why Nx marks them as affected by default.

## Learn More

For more specific configuration options, consult:
- [Nx affected documentation](https://nx.dev/concepts/affected)
- Run `nx affected --help` for command-line options
