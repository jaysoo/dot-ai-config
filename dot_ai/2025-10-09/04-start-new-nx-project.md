# How do I start a new Nx project?

There are several ways to start a new project with Nx, depending on your needs and existing setup.

## Option 1: Create a Brand New Nx Workspace

The most straightforward way to start with Nx is to create a new workspace:

```shell
npx create-nx-workspace
```

This command will:
- Guide you through an interactive setup process
- Let you choose from various presets (React, Angular, Node, etc.)
- Configure your workspace based on your technology stack
- Set up initial project structure and configuration

### Workspace Options

When creating a new workspace, you can:
- **Use presets**: Choose from predefined configurations for popular frameworks and technologies
- **Link projects with package manager workspaces**: Enable integration with npm/yarn/pnpm workspaces
- **Opt-out of workspaces**: Run with `--no-workspaces` flag if you prefer not to use workspaces

```shell
# With package manager workspaces
npx create-nx-workspace

# Without workspaces
npx create-nx-workspace --no-workspaces
```

## Option 2: Add Nx to an Existing Project

If you already have a project or monorepo, you can add Nx to it:

```shell
npx nx@latest init
```

This command will:
- Add Nx to your existing repository
- Set up caching for your existing scripts
- Configure Nx based on your current project structure
- Allow you to gradually adopt Nx features

During setup, you'll be asked to:
- Select which scripts need to be run in order
- Choose which scripts are cacheable
- Define output directories for your build scripts
- Optionally connect to Nx Cloud for remote caching

## Getting Started

Once your workspace is set up, you can:
- Use Nx generators to create new projects: `nx generate`
- Run tasks with caching: `nx run project:task`
- Visualize your project graph: `nx graph`
- Run affected commands: `nx affected -t test`

Nx provides flexibility to start from scratch or enhance your existing setup, making it easy to adopt at your own pace.
