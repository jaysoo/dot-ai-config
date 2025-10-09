# I only want to update Nx core, how do I do that?

While Nx typically updates both the core and related plugins together, there are scenarios where you might want to update just the Nx core packages.

## Standard Update Process

The standard way to update Nx is:

```shell
nx migrate latest
```

This creates a `migrations.json` file with update scripts. Run them with:

```shell
nx migrate --run-migrations
```

## How Nx Updates Work

The Nx update process happens in three steps:

1. **Update Dependencies**: The `package.json` and `node_modules` are updated
2. **Generate Migrations**: Nx produces a `migrations.json` file with migrations to run based on your workspace configuration
3. **Run Migrations**: Execute the migrations to update configuration files and source code

### Automatic Plugin Updates

When you update Nx, it will **automatically update your dependencies** if you have an Nx plugin installed for that dependency. This ensures compatibility between Nx and the tools it integrates with.

## Advanced Update Scenarios

For more control over the update process, you can:

### 1. Update One Major Version at a Time

It's recommended to update one major version at a time to avoid potential issues:

```shell
# Instead of jumping to latest, update incrementally
nx migrate 19.0.0  # If you're on 18.x
```

### 2. Review migrations.json

After running `nx migrate`, you can inspect and modify the `migrations.json` file before running migrations. This gives you control over what gets updated.

### 3. Selective Package Updates

If you want to update only specific packages, you can:

1. Manually update the package versions in `package.json`
2. Run `npm install` or your package manager's install command
3. Skip the migration process if no code changes are needed

However, this approach is not recommended as it may cause version mismatches between Nx core and plugins.

## Best Practices

1. **Update Regularly**: Keep Nx up to date to get bug fixes and new features
2. **Test After Updates**: Run your full test suite after updating
3. **Read Release Notes**: Check the [Nx changelog](https://github.com/nrwl/nx/releases) for breaking changes
4. **One Major Version at a Time**: Avoid skipping major versions when updating
5. **Use Migrations**: Let Nx migrations handle code updates automatically

## Why Update Nx and Plugins Together?

Nx core and plugins are designed to work together. Updating them together ensures:
- Compatible versions across your workspace
- Automated migrations handle breaking changes
- New features work as expected
- No version mismatch issues

## Additional Resources

For more details on the update process, see:
- [Advanced Update Process Documentation](/recipes/tips-n-tricks/advanced-update)
- [Automate Updating Dependencies](/features/automate-updating-dependencies)
