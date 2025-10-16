# I only want to update Nx core, how do I do that?

While Nx typically updates both the core and related plugins together for compatibility, there are scenarios where you might want more control over the update process.

## Standard Update Process

The standard way to update Nx is:

```shell
nx migrate latest
```

This creates a `migrations.json` file with update scripts. Run them with:

```shell
nx migrate --run-migrations
```

### Important: Update One Major Version at a Time

To avoid potential issues, it is [recommended to update one major version of Nx at a time](/docs/guides/tips-n-tricks/advanced-update#one-major-version-at-a-time-small-steps).

```shell
# Instead of jumping to latest, update incrementally
nx migrate 19.0.0  # If you're on 18.x
```

## How Nx Updates Work

The Nx update process happens in three steps:

1. **Update Dependencies**: The `package.json` and `node_modules` are updated
2. **Generate Migrations**: Nx produces a `migrations.json` file with migrations to run based on your workspace configuration. You can inspect and adjust this file.
3. **Run Migrations**: Execute the migrations to update configuration files and source code

You can intervene at each step and make adjustments as needed for your specific workspace. This is especially important in large codebases where you might want to control changes more granularly.

## Automatic Plugin Updates

When you update Nx, it will **automatically update your dependencies** if you have an [Nx plugin](/docs/concepts/nx-plugins) installed for that dependency. This ensures compatibility between Nx and the tools it integrates with.

## Advanced Update Scenarios

For more control over the update process:

### 1. Review and Modify migrations.json

After running `nx migrate`, you can:
- Inspect the `migrations.json` file
- Adjust which migrations to run
- Remove migrations you don't want to apply

### 2. Selective Package Updates

If you want to update only specific packages:

1. Manually update the package versions in `package.json`
2. Run `npm install` or your package manager's install command
3. Skip the migration process if no code changes are needed

**Note**: This approach is not recommended as it may cause version mismatches between Nx core and plugins.

### 3. Keep migrations.json for Multiple Branches

Optionally, you can:
- Remove the `migrations.json` file after running migrations
- Keep it to re-run the migration in different Git branches

## Why Update Nx and Plugins Together?

Nx core and plugins are designed to work together. Updating them together ensures:

- Compatible versions across your workspace
- Automated migrations handle breaking changes
- New features work as expected
- No version mismatch issues

## Best Practices

1. **Update Regularly**: Keep Nx up to date to get bug fixes and new features
2. **Test After Updates**: Run your full test suite after updating
3. **Read Release Notes**: Check the [Nx changelog](https://github.com/nrwl/nx/releases) for breaking changes
4. **One Major Version at a Time**: Avoid skipping major versions when updating
5. **Use Migrations**: Let Nx migrations handle code updates automatically
6. **Review migrations.json**: Inspect what will change before running migrations

## Learn More

For more details on the update process, see:
- [Automate Updating Dependencies](/docs/features/automate-updating-dependencies)
- [Advanced Update Process](/docs/guides/tips-n-tricks/advanced-update)
