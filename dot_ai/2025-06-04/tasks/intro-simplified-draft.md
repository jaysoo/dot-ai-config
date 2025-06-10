---
title: Intro to Nx
description: Make your builds 10x faster with Nx - a build system that understands your code and only runs what's needed.
---

# Make Your Builds 10x Faster

Nx understands your code and only runs what's needed.

{% cta-buttons %}
{% cta-button title="Install Nx" url="#get-started" type="primary" /%}
{% cta-button title="Watch Demo (2 min)" url="#demo" type="secondary" /%}
{% /cta-buttons %}

## See It In Action

{% terminal-demo %}
```bash
# Before Nx
$ npm run build
Building project... ████████████████████ 100% (45 seconds)

# After Nx  
$ npm run build
Building project... ████ 100% (4 seconds - cached)
```
{% /terminal-demo %}

## Get Started in 3 Steps

```bash
# 1. Install Nx
brew install nx

# 2. Add to your project
nx init

# 3. Run your first cached build
nx build
```

✨ **That's it!** Your builds are now cached and will run up to 10x faster.

## What Just Happened?

Nx analyzed your project and:
- ⚡ Created a task graph of your dependencies
- 💾 Cached the results of your build
- 🚀 Will skip unchanged work on future runs

{% visual-explanation type="task-graph" /%}

## Ready for More?

Choose your next step based on what you need:

{% next-steps %}
{% step-card 
  title="Advanced Caching" 
  description="Configure remote caching and fine-tune cache behavior"
  url="/features/cache-task-results" 
  icon="cache" 
/%}
{% step-card 
  title="New Project" 
  description="Start a new project with Nx from scratch"
  url="/getting-started/create-workspace" 
  icon="plus" 
/%}
{% step-card 
  title="CI Optimization" 
  description="Make your CI pipeline 10x faster too"
  url="/ci/intro" 
  icon="ci" 
/%}
{% step-card 
  title="Framework Guides" 
  description="Specific guides for React, Angular, Vue, and more"
  url="/getting-started/frameworks" 
  icon="code" 
/%}
{% /next-steps %}

---

{% github-repository title="Star Nx on GitHub" url="https://github.com/nrwl/nx" compact="true" /%}