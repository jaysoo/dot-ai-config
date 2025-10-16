# How do I start a new Nx project?

When you start a new project with Nx, you have two main options: creating a brand new workspace or adding Nx to an existing project.

## Option 1: Create a Brand New Nx Workspace

### Guided Setup
The simplest approach is to use the interactive setup:

```shell
npx create-nx-workspace
```

This command will guide you through creating a new workspace with:
- Choice of presets for various technology stacks and configurations
- Option to use your favorite CLI
- Configuration options based on your requirements

### Manual Setup
You can also create a workspace manually if you prefer more control over the initial setup.

## Option 2: Add Nx to an Existing Project

In many situations, you have an existing codebase and want to improve it with Nx using an **incremental adoption approach**.

```shell
nx@latest init
```

### Global Installs Note
Make sure you have [Nx installed globally](/docs/getting-started/installation) or use `npx` if you're in a JavaScript environment.

### Benefits of Incremental Adoption

Thanks to [Nx's modular architecture](/docs/getting-started/intro), you can:
- Start with just **Nx Core**
- Gradually add [technology-specific plugins](/docs/technologies)
- Add [CI integrations](/docs/getting-started/nx-cloud) as needed
- Evolve capabilities based on your requirements

### What `nx init` Does

Whether you have a monorepo, single project, or something in between, `nx init` walks you through:
- Adding Nx to your project
- Configuring Nx for your setup
- Choosing between minimal or detailed guided setup
- Creating an Nx workspace ready for anything

## Getting Started Resources

Nx works with any technology stack and can be adopted incrementally. Choose your path based on your current setup and requirements:

- [Start a new project](/docs/getting-started/start-new-project)
- [Start with an existing project](/docs/getting-started/start-existing-project)
