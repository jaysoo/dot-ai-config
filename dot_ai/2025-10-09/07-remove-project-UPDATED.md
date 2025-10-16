# How can I remove a project from a workspace?

When you no longer need a project in your Nx workspace, you can safely remove it using the `@nx/workspace:remove` generator.

## Basic Command

```shell
nx generate @nx/workspace:remove <projectName>
```

Replace `<projectName>` with the name of the project you want to remove.

### Command Alias

The remove generator has an alias `rm` for convenience:

```shell
nx generate @nx/workspace:remove myproject
# or
nx g @nx/workspace:rm myproject
```

## What the Remove Generator Does

The remove generator will:

- Delete the project directory and all its files
- Remove the project configuration from workspace configuration files
- Update any TypeScript path mappings in `tsconfig.base.json`
- Clean up any references to the project in workspace configuration

## Important Considerations

Before removing a project, consider:

1. **Check Dependencies**: Make sure no other projects depend on the one you're removing. You can visualize dependencies with:
   ```shell
   nx graph
   ```

2. **Backup If Needed**: If you might need the project later, consider creating a branch or backing up the code before removal

3. **Update Imports**: If other projects import from the removed project, you'll need to update those imports manually

## Related: Moving and Reorganizing Projects

If you need to reorganize rather than remove projects, Nx provides other generators:

- **Move generator**: Relocate or rename a project
  ```shell
  nx g @nx/workspace:move --projectName=old-name --destination=new-location
  ```

The `@nx/workspace` plugin provides both `move` and `remove` generators to help you reorganize your workspace as your needs evolve.
