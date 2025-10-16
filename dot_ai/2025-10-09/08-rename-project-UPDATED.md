# How do I rename a project?

To rename a project in an Nx workspace, you use the `@nx/workspace:move` generator. Despite its name focusing on "move", this generator can both move and rename projects.

## Basic Command

Use the move generator to rename a project:

```shell
nx g @nx/workspace:move --projectName=current-name --destination=new-name
```

## What the Move Generator Does

The move generator will:

- Rename the project directory
- Update the project name in configuration files
- Update TypeScript path mappings in `tsconfig.base.json`
- Update all import statements across the workspace
- Update any references to the project in workspace configuration

## Examples

### Simple Rename (Same Location)
```shell
# Rename "old-app" to "new-app" in the same directory
nx g @nx/workspace:move --projectName=old-app --destination=new-app
```

### Move and Rename
```shell
# Move a project to a different directory and/or rename it
nx g @nx/workspace:move --projectName=mylib --destination=shared/mylib
```

## Important Notes

- The generator updates all references automatically, making it safe to rename projects
- Always commit your changes before running the move generator so you can revert if needed
- The move generator is part of the `@nx/workspace` plugin and works with all project types

## Related Operations

The `@nx/workspace` plugin also provides:

- **Remove generator**: Delete projects entirely (`nx g remove project-name`)
- **Convert generators**: Convert between different project structures

These generators help you maintain and reorganize your workspace as it evolves.
