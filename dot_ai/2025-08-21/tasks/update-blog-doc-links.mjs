#!/usr/bin/env node
// Auto-generated script to update blog documentation links

import { readFile, writeFile } from 'fs/promises';

const updates = [
  {
    "file": "2021-06-15-distributing-ci-binning-and-distributed-task-execution.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2021-06-15-distributing-ci-binning-and-distributed-task-execution.md",
    "links": [
      {
        "text": "example of implementing binning using Azure Pipelines",
        "url": "/ci/recipes/set-up/monorepo-ci-azure",
        "line": 20,
        "fullMatch": "[example of implementing binning using Azure Pipelines](/ci/recipes/set-up/monorepo-ci-azure)"
      },
      {
        "text": "here",
        "url": "/ci/recipes/set-up",
        "line": 164,
        "fullMatch": "[here](/ci/recipes/set-up)"
      }
    ]
  },
  {
    "file": "2021-12-17-mastering-the-project-boundaries-in-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2021-12-17-mastering-the-project-boundaries-in-nx.md",
    "links": [
      {
        "text": "our docs",
        "url": "/concepts/buildable-and-publishable-libraries",
        "line": 77,
        "fullMatch": "[our docs](/concepts/buildable-and-publishable-libraries)"
      }
    ]
  },
  {
    "file": "2021-12-23-single-file-monorepo-config-custom-workspace-presets-improved-tailwind-support-and-more-in-nx-13.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2021-12-23-single-file-monorepo-config-custom-workspace-presets-improved-tailwind-support-and-more-in-nx-13.md",
    "links": [
      {
        "text": "adding Nx to an existing workspace",
        "url": "/recipes/adopting-nx/adding-to-monorepo",
        "line": 31,
        "fullMatch": "[adding Nx to an existing workspace](/recipes/adopting-nx/adding-to-monorepo)"
      },
      {
        "text": "**nx.json**",
        "url": "/reference/project-configuration",
        "line": 31,
        "fullMatch": "[**nx.json**](/reference/project-configuration)"
      },
      {
        "text": "our new TypeScript guide",
        "url": "/getting-started/intro",
        "line": 53,
        "fullMatch": "[our new TypeScript guide](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2022-01-28-set-up-tailwind-css-with-angular-in-an-nx-workspace.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-01-28-set-up-tailwind-css-with-angular-in-an-nx-workspace.md",
    "links": [
      {
        "text": "/concepts/decisions/project-size",
        "url": "/concepts/decisions/project-size",
        "line": 36,
        "fullMatch": "[/concepts/decisions/project-size](/concepts/decisions/project-size)"
      },
      {
        "text": "/concepts/buildable-and-publishable-libraries",
        "url": "/concepts/buildable-and-publishable-libraries",
        "line": 36,
        "fullMatch": "[/concepts/buildable-and-publishable-libraries](/concepts/buildable-and-publishable-libraries)"
      },
      {
        "text": "**Nx** project graph",
        "url": "/concepts/mental-model",
        "line": 614,
        "fullMatch": "[**Nx** project graph](/concepts/mental-model)"
      }
    ]
  },
  {
    "file": "2022-02-01-share-code-between-react-web-react-native-mobile-with-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-02-01-share-code-between-react-web-react-native-mobile-with-nx.md",
    "links": [
      {
        "text": "handling environment variables",
        "url": "/reference/environment-variables",
        "line": 244,
        "fullMatch": "[handling environment variables](/reference/environment-variables)"
      }
    ]
  },
  {
    "file": "2022-03-23-introducing-expo-support-for-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-03-23-introducing-expo-support-for-nx.md",
    "links": [
      {
        "text": "our docs",
        "url": "/getting-started/intro",
        "line": 295,
        "fullMatch": "[our docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2022-03-29-the-react-cli-you-always-wanted-but-didnt-know-about.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-03-29-the-react-cli-you-always-wanted-but-didnt-know-about.md",
    "links": [
      {
        "text": "computation caching",
        "url": "/concepts/how-caching-works",
        "line": 107,
        "fullMatch": "[computation caching](/concepts/how-caching-works)"
      },
      {
        "text": "computation caching",
        "url": "/concepts/how-caching-works",
        "line": 109,
        "fullMatch": "[computation caching](/concepts/how-caching-works)"
      },
      {
        "text": "new Nx and TypeScript setup",
        "url": "/getting-started/intro",
        "line": 153,
        "fullMatch": "[new Nx and TypeScript setup](/getting-started/intro)"
      },
      {
        "text": "Nx Console extension",
        "url": "/getting-started/editor-setup",
        "line": 236,
        "fullMatch": "[Nx Console extension](/getting-started/editor-setup)"
      },
      {
        "text": "Nx applications and libraries",
        "url": "/concepts/decisions/project-size",
        "line": 249,
        "fullMatch": "[Nx applications and libraries](/concepts/decisions/project-size)"
      },
      {
        "text": "apps and libraries",
        "url": "/concepts/decisions/project-size",
        "line": 265,
        "fullMatch": "[apps and libraries](/concepts/decisions/project-size)"
      },
      {
        "text": "migrate command",
        "url": "/reference/core-api/nx/documents/migrate",
        "line": 276,
        "fullMatch": "[migrate command](/reference/core-api/nx/documents/migrate)"
      },
      {
        "text": "Nx Executor",
        "url": "/concepts/executors-and-configurations",
        "line": 349,
        "fullMatch": "[Nx Executor](/concepts/executors-and-configurations)"
      },
      {
        "text": "/reference/project-configuration",
        "url": "/reference/project-configuration",
        "line": 351,
        "fullMatch": "[/reference/project-configuration](/reference/project-configuration)"
      },
      {
        "text": "_/reference/project-configuration_",
        "url": "/reference/project-configuration",
        "line": 353,
        "fullMatch": "[_/reference/project-configuration_](/reference/project-configuration)"
      },
      {
        "text": "Custom workspace executors",
        "url": "/extending-nx/recipes/local-executors",
        "line": 357,
        "fullMatch": "[Custom workspace executors](/extending-nx/recipes/local-executors)"
      },
      {
        "text": "Custom workspace generators",
        "url": "/extending-nx/recipes/local-generators",
        "line": 358,
        "fullMatch": "[Custom workspace generators](/extending-nx/recipes/local-generators)"
      },
      {
        "text": "Create Nx plugins",
        "url": "/reference/core-api/plugin",
        "line": 359,
        "fullMatch": "[Create Nx plugins](/reference/core-api/plugin)"
      },
      {
        "text": "custom presets",
        "url": "/reference/core-api/plugin",
        "line": 360,
        "fullMatch": "[custom presets](/reference/core-api/plugin)"
      },
      {
        "text": "Nx Executor",
        "url": "/concepts/executors-and-configurations",
        "line": 364,
        "fullMatch": "[Nx Executor](/concepts/executors-and-configurations)"
      },
      {
        "text": "/concepts/decisions/project-size",
        "url": "/concepts/decisions/project-size",
        "line": 405,
        "fullMatch": "[/concepts/decisions/project-size](/concepts/decisions/project-size)"
      },
      {
        "text": "/recipes/adopting-nx/adding-to-existing-project",
        "url": "/recipes/adopting-nx/adding-to-existing-project",
        "line": 422,
        "fullMatch": "[/recipes/adopting-nx/adding-to-existing-project](/recipes/adopting-nx/adding-to-existing-project)"
      },
      {
        "text": "Nx without plugins",
        "url": "/getting-started/intro",
        "line": 426,
        "fullMatch": "[Nx without plugins](/getting-started/intro)"
      },
      {
        "text": "community plugins",
        "url": "/community",
        "line": 440,
        "fullMatch": "[community plugins](/community)"
      }
    ]
  },
  {
    "file": "2022-04-08-what-is-new-in-nx-13-10.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-04-08-what-is-new-in-nx-13-10.md",
    "links": [
      {
        "text": "adding Nx to Yarn/NPM workspaces",
        "url": "/recipes/adopting-nx/adding-to-monorepo",
        "line": 14,
        "fullMatch": "[adding Nx to Yarn/NPM workspaces](/recipes/adopting-nx/adding-to-monorepo)"
      },
      {
        "text": "affected commands",
        "url": "/ci/features/affected",
        "line": 18,
        "fullMatch": "[affected commands](/ci/features/affected)"
      },
      {
        "text": "during DTE",
        "url": "/ci/features/distribute-task-execution",
        "line": 18,
        "fullMatch": "[during DTE](/ci/features/distribute-task-execution)"
      },
      {
        "text": "/guides/nx-daemon",
        "url": "/concepts/nx-daemon",
        "line": 22,
        "fullMatch": "[/guides/nx-daemon](/concepts/nx-daemon)"
      },
      {
        "text": "Community plugins",
        "url": "/community",
        "line": 37,
        "fullMatch": "[Community plugins](/community)"
      },
      {
        "text": "Nx core without any plugins",
        "url": "/getting-started/intro",
        "line": 43,
        "fullMatch": "[Nx core without any plugins](/getting-started/intro)"
      },
      {
        "text": "fully featured Devkit and Nx Plugin package",
        "url": "/extending-nx/intro/getting-started",
        "line": 45,
        "fullMatch": "[fully featured Devkit and Nx Plugin package](/extending-nx/intro/getting-started)"
      },
      {
        "text": "all the community Nx plugins that are available out there",
        "url": "/community",
        "line": 45,
        "fullMatch": "[all the community Nx plugins that are available out there](/community)"
      },
      {
        "text": "API docs on the Nx website",
        "url": "/reference/core-api/nx/documents/create-nx-workspace",
        "line": 209,
        "fullMatch": "[API docs on the Nx website](/reference/core-api/nx/documents/create-nx-workspace)"
      }
    ]
  },
  {
    "file": "2022-05-02-nx-v14-is-out-here-is-all-you-need-to-know.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-05-02-nx-v14-is-out-here-is-all-you-need-to-know.md",
    "links": [
      {
        "text": "all the community plugins",
        "url": "/community",
        "line": 77,
        "fullMatch": "[all the community plugins](/community)"
      },
      {
        "text": "Nx core without plugins",
        "url": "/getting-started/intro",
        "line": 79,
        "fullMatch": "[Nx core without plugins](/getting-started/intro)"
      },
      {
        "text": "existing Lerna/Yarn/NPM/PNPM workspace",
        "url": "/recipes/adopting-nx/adding-to-monorepo",
        "line": 79,
        "fullMatch": "[existing Lerna/Yarn/NPM/PNPM workspace](/recipes/adopting-nx/adding-to-monorepo)"
      },
      {
        "text": "/reference/project-configuration",
        "url": "/reference/project-configuration",
        "line": 83,
        "fullMatch": "[/reference/project-configuration](/reference/project-configuration)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 136,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "Nx Cloud's distributed task execution",
        "url": "/ci/features/distribute-task-execution",
        "line": 140,
        "fullMatch": "[Nx Cloud's distributed task execution](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Nx affected commands",
        "url": "/ci/features/affected",
        "line": 164,
        "fullMatch": "[Nx affected commands](/ci/features/affected)"
      },
      {
        "text": "computation caching",
        "url": "/concepts/how-caching-works",
        "line": 164,
        "fullMatch": "[computation caching](/concepts/how-caching-works)"
      },
      {
        "text": "distributed task execution",
        "url": "/ci/features/distribute-task-execution",
        "line": 164,
        "fullMatch": "[distributed task execution](/ci/features/distribute-task-execution)"
      },
      {
        "text": "see docs",
        "url": "/reference/project-configuration",
        "line": 178,
        "fullMatch": "[see docs](/reference/project-configuration)"
      },
      {
        "text": "/getting-started/intro",
        "url": "/getting-started/intro",
        "line": 245,
        "fullMatch": "[/getting-started/intro](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2022-05-11-lerna-is-dead-long-live-lerna.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-05-11-lerna-is-dead-long-live-lerna.md",
    "links": [
      {
        "text": "Lerna/NPM/Yarn/PNPM workspaces to Nx",
        "url": "/recipes/adopting-nx/adding-to-monorepo",
        "line": 43,
        "fullMatch": "[Lerna/NPM/Yarn/PNPM workspaces to Nx](/recipes/adopting-nx/adding-to-monorepo)"
      },
      {
        "text": "Nx's powerful task scheduling capabilities",
        "url": "/getting-started/intro",
        "line": 43,
        "fullMatch": "[Nx's powerful task scheduling capabilities](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2022-05-25-lerna-used-to-walk-now-it-can-fly.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-05-25-lerna-used-to-walk-now-it-can-fly.md",
    "links": [
      {
        "text": "Nx and Lerna",
        "url": "/recipes/adopting-nx",
        "line": 15,
        "fullMatch": "[Nx and Lerna](/recipes/adopting-nx)"
      },
      {
        "text": "**Nx Project graph**",
        "url": "/features/explore-graph",
        "line": 84,
        "fullMatch": "[**Nx Project graph**](/features/explore-graph)"
      },
      {
        "text": "distributing the task execution",
        "url": "/ci/features/distribute-task-execution",
        "line": 94,
        "fullMatch": "[distributing the task execution](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Nx Cloud docs",
        "url": "/ci/features/distribute-task-execution",
        "line": 94,
        "fullMatch": "[Nx Cloud docs](/ci/features/distribute-task-execution)"
      }
    ]
  },
  {
    "file": "2022-06-09-nx-14-2-angular-v14-storybook-update-lightweight-nx-and-more.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-06-09-nx-14-2-angular-v14-storybook-update-lightweight-nx-and-more.md",
    "links": [
      {
        "text": "Nx Console VSCode extension",
        "url": "/getting-started/editor-setup",
        "line": 54,
        "fullMatch": "[Nx Console VSCode extension](/getting-started/editor-setup)"
      },
      {
        "text": "that on our guide",
        "url": "/getting-started/intro",
        "line": 71,
        "fullMatch": "[that on our guide](/getting-started/intro)"
      },
      {
        "text": "Nx Plugins",
        "url": "/community",
        "line": 115,
        "fullMatch": "[Nx Plugins](/community)"
      },
      {
        "text": "Nx community plugins page",
        "url": "/community",
        "line": 117,
        "fullMatch": "[Nx community plugins page](/community)"
      }
    ]
  },
  {
    "file": "2022-07-05-nx-14-4-inputs-optional-npm-scope-project-graph-cache-directory-and-more.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-07-05-nx-14-4-inputs-optional-npm-scope-project-graph-cache-directory-and-more.md",
    "links": [
      {
        "text": "project.json config option",
        "url": "/reference/project-configuration",
        "line": 27,
        "fullMatch": "[project.json config option](/reference/project-configuration)"
      },
      {
        "text": "package.json",
        "url": "/reference/project-configuration",
        "line": 27,
        "fullMatch": "[package.json](/reference/project-configuration)"
      },
      {
        "text": "Nx Daemon",
        "url": "/concepts/nx-daemon",
        "line": 162,
        "fullMatch": "[Nx Daemon](/concepts/nx-daemon)"
      }
    ]
  },
  {
    "file": "2022-07-14-setup-a-monorepo-with-pnpm-workspaces-and-speed-it-up-with-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-07-14-setup-a-monorepo-with-pnpm-workspaces-and-speed-it-up-with-nx.md",
    "links": [
      {
        "text": "Computation caching",
        "url": "/concepts/how-caching-works",
        "line": 448,
        "fullMatch": "[Computation caching](/concepts/how-caching-works)"
      },
      {
        "text": "Nx Cloud",
        "url": "/ci/features/remote-cache",
        "line": 495,
        "fullMatch": "[Nx Cloud](/ci/features/remote-cache)"
      },
      {
        "text": "all project-level files as an input",
        "url": "/concepts/how-caching-works",
        "line": 499,
        "fullMatch": "[all project-level files as an input](/concepts/how-caching-works)"
      },
      {
        "text": "_more here_",
        "url": "/reference/project-configuration",
        "line": 525,
        "fullMatch": "[_more here_](/reference/project-configuration)"
      },
      {
        "text": "\"affected command\"",
        "url": "/ci/features/affected",
        "line": 648,
        "fullMatch": "[\"affected command\"](/ci/features/affected)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 753,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2022-08-02-nx-14-5-cypess-v10-output-globs-linter-perf-react-tailwind-support.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-08-02-nx-14-5-cypess-v10-output-globs-linter-perf-react-tailwind-support.md",
    "links": [
      {
        "text": "Read more in our docs",
        "url": "/reference/project-configuration",
        "line": 103,
        "fullMatch": "[Read more in our docs](/reference/project-configuration)"
      },
      {
        "text": "project.json",
        "url": "/reference/project-configuration",
        "line": 107,
        "fullMatch": "[project.json](/reference/project-configuration)"
      },
      {
        "text": "package.json",
        "url": "/reference/project-configuration",
        "line": 107,
        "fullMatch": "[package.json](/reference/project-configuration)"
      },
      {
        "text": "Read more in our docs",
        "url": "/reference/project-configuration",
        "line": 158,
        "fullMatch": "[Read more in our docs](/reference/project-configuration)"
      },
      {
        "text": "Nx Module Boundary lint rule",
        "url": "/features/enforce-module-boundaries",
        "line": 170,
        "fullMatch": "[Nx Module Boundary lint rule](/features/enforce-module-boundaries)"
      },
      {
        "text": "in our docs",
        "url": "/features/enforce-module-boundaries",
        "line": 199,
        "fullMatch": "[in our docs](/features/enforce-module-boundaries)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 300,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2022-08-18-helping-the-environment-by-saving-two-centuries-of-compute-time.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-08-18-helping-the-environment-by-saving-two-centuries-of-compute-time.md",
    "links": [
      {
        "text": "Nx affected commands",
        "url": "/ci/features/affected",
        "line": 58,
        "fullMatch": "[Nx affected commands](/ci/features/affected)"
      },
      {
        "text": "computation caching",
        "url": "/concepts/how-caching-works",
        "line": 64,
        "fullMatch": "[computation caching](/concepts/how-caching-works)"
      },
      {
        "text": "More on the docs",
        "url": "/ci/features/remote-cache",
        "line": 84,
        "fullMatch": "[More on the docs](/ci/features/remote-cache)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 94,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2022-10-14-whats-new-in-nx-15.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-10-14-whats-new-in-nx-15.md",
    "links": [
      {
        "text": "/concepts/nx-daemon",
        "url": "/concepts/nx-daemon",
        "line": 30,
        "fullMatch": "[/concepts/nx-daemon](/concepts/nx-daemon)"
      },
      {
        "text": "/getting-started/tutorials/typescript-packages-tutorial",
        "url": "/getting-started/tutorials/typescript-packages-tutorial",
        "line": 53,
        "fullMatch": "[/getting-started/tutorials/typescript-packages-tutorial](/getting-started/tutorials/typescript-packages-tutorial)"
      },
      {
        "text": "/getting-started/tutorials/react-monorepo-tutorial",
        "url": "/getting-started/tutorials/react-monorepo-tutorial",
        "line": 54,
        "fullMatch": "[/getting-started/tutorials/react-monorepo-tutorial](/getting-started/tutorials/react-monorepo-tutorial)"
      },
      {
        "text": "/concepts/task-pipeline-configuration",
        "url": "/concepts/task-pipeline-configuration",
        "line": 84,
        "fullMatch": "[/concepts/task-pipeline-configuration](/concepts/task-pipeline-configuration)"
      },
      {
        "text": "/recipes/running-tasks/configure-inputs",
        "url": "/recipes/running-tasks/configure-inputs",
        "line": 144,
        "fullMatch": "[/recipes/running-tasks/configure-inputs](/recipes/running-tasks/configure-inputs)"
      },
      {
        "text": "Nx Graph",
        "url": "/features/explore-graph",
        "line": 150,
        "fullMatch": "[Nx Graph](/features/explore-graph)"
      },
      {
        "text": "package-based",
        "url": "/getting-started/tutorials/typescript-packages-tutorial",
        "line": 182,
        "fullMatch": "[package-based](/getting-started/tutorials/typescript-packages-tutorial)"
      },
      {
        "text": "integrated style tutorials",
        "url": "/getting-started/tutorials/react-monorepo-tutorial",
        "line": 182,
        "fullMatch": "[integrated style tutorials](/getting-started/tutorials/react-monorepo-tutorial)"
      },
      {
        "text": "/getting-started/tutorials",
        "url": "/getting-started/tutorials",
        "line": 184,
        "fullMatch": "[/getting-started/tutorials](/getting-started/tutorials)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 256,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2022-11-17-from-bootstrapped-to-venture-backed-nx-raises-8-6m.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-11-17-from-bootstrapped-to-venture-backed-nx-raises-8-6m.md",
    "links": [
      {
        "text": "Distributed Task Execution",
        "url": "/ci/concepts/parallelization-distribution",
        "line": 19,
        "fullMatch": "[Distributed Task Execution](/ci/concepts/parallelization-distribution)"
      }
    ]
  },
  {
    "file": "2022-12-06-nx-15-3-standalone-projects-vite-task-graph-and-more.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-12-06-nx-15-3-standalone-projects-vite-task-graph-and-more.md",
    "links": [
      {
        "text": "task pipeline",
        "url": "/concepts/task-pipeline-configuration",
        "line": 56,
        "fullMatch": "[task pipeline](/concepts/task-pipeline-configuration)"
      },
      {
        "text": "Nx community plugin",
        "url": "/community",
        "line": 148,
        "fullMatch": "[Nx community plugin](/community)"
      },
      {
        "text": "adding Nx to an existing monorepo",
        "url": "/recipes/adopting-nx/adding-to-monorepo",
        "line": 227,
        "fullMatch": "[adding Nx to an existing monorepo](/recipes/adopting-nx/adding-to-monorepo)"
      },
      {
        "text": "adding Nx to any non-monorepo setup",
        "url": "/recipes/adopting-nx/adding-to-existing-project",
        "line": 228,
        "fullMatch": "[adding Nx to any non-monorepo setup](/recipes/adopting-nx/adding-to-existing-project)"
      },
      {
        "text": "migrating your CRA project to Nx",
        "url": "/recipes/adopting-nx/adding-to-existing-project",
        "line": 229,
        "fullMatch": "[migrating your CRA project to Nx](/recipes/adopting-nx/adding-to-existing-project)"
      },
      {
        "text": "/recipes/adopting-nx/adding-to-existing-project",
        "url": "/recipes/adopting-nx/adding-to-existing-project",
        "line": 274,
        "fullMatch": "[/recipes/adopting-nx/adding-to-existing-project](/recipes/adopting-nx/adding-to-existing-project)"
      },
      {
        "text": "cacheable operations",
        "url": "/ci/reference/config",
        "line": 313,
        "fullMatch": "[cacheable operations](/ci/reference/config)"
      },
      {
        "text": "fine-tune it's cache inputs",
        "url": "/recipes/running-tasks/configure-inputs",
        "line": 313,
        "fullMatch": "[fine-tune it's cache inputs](/recipes/running-tasks/configure-inputs)"
      },
      {
        "text": "/recipes/running-tasks/root-level-scripts",
        "url": "/recipes/running-tasks/root-level-scripts",
        "line": 315,
        "fullMatch": "[/recipes/running-tasks/root-level-scripts](/recipes/running-tasks/root-level-scripts)"
      },
      {
        "text": "Nx executor",
        "url": "/extending-nx/recipes/local-executors",
        "line": 346,
        "fullMatch": "[Nx executor](/extending-nx/recipes/local-executors)"
      },
      {
        "text": "\"run-commands\"",
        "url": "/recipes/running-tasks/run-commands-executor",
        "line": 348,
        "fullMatch": "[\"run-commands\"](/recipes/running-tasks/run-commands-executor)"
      },
      {
        "text": "/recipes/running-tasks/run-commands-executor",
        "url": "/recipes/running-tasks/run-commands-executor",
        "line": 389,
        "fullMatch": "[/recipes/running-tasks/run-commands-executor](/recipes/running-tasks/run-commands-executor)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 417,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2022-12-22-nx-15-4-vite-4-support-a-new-nx-watch-command-and-more.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2022-12-22-nx-15-4-vite-4-support-a-new-nx-watch-command-and-more.md",
    "links": [
      {
        "text": "our docs",
        "url": "/recipes/running-tasks/workspace-watching",
        "line": 78,
        "fullMatch": "[our docs](/recipes/running-tasks/workspace-watching)"
      },
      {
        "text": "presets",
        "url": "/extending-nx/recipes/create-preset#create-a-custom-plugin-preset",
        "line": 123,
        "fullMatch": "[presets](/extending-nx/recipes/create-preset#create-a-custom-plugin-preset)"
      },
      {
        "text": "🧠 Nx Docs",
        "url": "/getting-started/intro",
        "line": 161,
        "fullMatch": "[🧠 Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-01-10-setting-up-module-federation-with-server-side-rendering-for-angular.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-01-10-setting-up-module-federation-with-server-side-rendering-for-angular.md",
    "links": [
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 123,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-01-12-react-vite-and-typescript-get-started-in-under-2-minutes.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-01-12-react-vite-and-typescript-get-started-in-under-2-minutes.md",
    "links": [
      {
        "text": "Nx target",
        "url": "/reference/glossary#target",
        "line": 98,
        "fullMatch": "[Nx target](/reference/glossary#target)"
      },
      {
        "text": "Nx docs",
        "url": "/concepts/executors-and-configurations",
        "line": 138,
        "fullMatch": "[Nx docs](/concepts/executors-and-configurations)"
      },
      {
        "text": "_/concepts/how-caching-works_",
        "url": "/concepts/how-caching-works",
        "line": 256,
        "fullMatch": "[_/concepts/how-caching-works_](/concepts/how-caching-works)"
      },
      {
        "text": "More on the Nx docs",
        "url": "/recipes/running-tasks/configure-inputs",
        "line": 260,
        "fullMatch": "[More on the Nx docs](/recipes/running-tasks/configure-inputs)"
      },
      {
        "text": "module boundary lint rule",
        "url": "/features/enforce-module-boundaries",
        "line": 400,
        "fullMatch": "[module boundary lint rule](/features/enforce-module-boundaries)"
      },
      {
        "text": "affected commands",
        "url": "/ci/features/affected",
        "line": 449,
        "fullMatch": "[affected commands](/ci/features/affected)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 473,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "Nx migrations work",
        "url": "/features/automate-updating-dependencies",
        "line": 503,
        "fullMatch": "[Nx migrations work](/features/automate-updating-dependencies)"
      },
      {
        "text": "/recipes/adopting-nx/adding-to-existing-project",
        "url": "/recipes/adopting-nx/adding-to-existing-project",
        "line": 515,
        "fullMatch": "[/recipes/adopting-nx/adding-to-existing-project](/recipes/adopting-nx/adding-to-existing-project)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 531,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-01-18-nx-console-meets-nx-cloud.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-01-18-nx-console-meets-nx-cloud.md",
    "links": [
      {
        "text": "advanced computation caching",
        "url": "/features/cache-task-results",
        "line": 65,
        "fullMatch": "[advanced computation caching](/features/cache-task-results)"
      },
      {
        "text": "Access Tokens Documentation",
        "url": "/ci/recipes/security/access-tokens",
        "line": 73,
        "fullMatch": "[Access Tokens Documentation](/ci/recipes/security/access-tokens)"
      },
      {
        "text": "affected analysis",
        "url": "/ci/features/affected",
        "line": 89,
        "fullMatch": "[affected analysis](/ci/features/affected)"
      },
      {
        "text": "There are different approaches to achieving this",
        "url": "/ci/concepts/parallelization-distribution",
        "line": 89,
        "fullMatch": "[There are different approaches to achieving this](/ci/concepts/parallelization-distribution)"
      },
      {
        "text": "Check out the docs",
        "url": "/ci/features/distribute-task-execution",
        "line": 95,
        "fullMatch": "[Check out the docs](/ci/features/distribute-task-execution)"
      },
      {
        "text": "learn more about the motivation for DTE",
        "url": "/ci/concepts/parallelization-distribution",
        "line": 95,
        "fullMatch": "[learn more about the motivation for DTE](/ci/concepts/parallelization-distribution)"
      },
      {
        "text": "how to test it out in your workspace",
        "url": "/ci/features/distribute-task-execution",
        "line": 95,
        "fullMatch": "[how to test it out in your workspace](/ci/features/distribute-task-execution)"
      },
      {
        "text": "full guide on connecting your workspace to",
        "url": "/ci/recipes/set-up/monorepo-ci-github-actions",
        "line": 109,
        "fullMatch": "[full guide on connecting your workspace to](/ci/recipes/set-up/monorepo-ci-github-actions)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 113,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-01-31-configuration-files-and-potholes-in-your-codebase.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-01-31-configuration-files-and-potholes-in-your-codebase.md",
    "links": [
      {
        "text": "code generators",
        "url": "/features/generate-code",
        "line": 50,
        "fullMatch": "[code generators](/features/generate-code)"
      },
      {
        "text": "migration generators",
        "url": "/features/automate-updating-dependencies",
        "line": 52,
        "fullMatch": "[migration generators](/features/automate-updating-dependencies)"
      },
      {
        "text": "nx.dev",
        "url": "/getting-started/intro",
        "line": 68,
        "fullMatch": "[nx.dev](/getting-started/intro)"
      },
      {
        "text": "🧠 Nx Docs",
        "url": "/getting-started/intro",
        "line": 72,
        "fullMatch": "[🧠 Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-02-09-setup-react-and-tailwind-the-easy-way.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-02-09-setup-react-and-tailwind-the-easy-way.md",
    "links": [
      {
        "text": "Nx docs go into more detail here",
        "url": "/recipes/adopting-nx/adding-to-existing-project",
        "line": 58,
        "fullMatch": "[Nx docs go into more detail here](/recipes/adopting-nx/adding-to-existing-project)"
      },
      {
        "text": "Nx-based React",
        "url": "/getting-started/tutorials/react-monorepo-tutorial",
        "line": 62,
        "fullMatch": "[Nx-based React](/getting-started/tutorials/react-monorepo-tutorial)"
      },
      {
        "text": "Nx docs: React Monorepo tutorial",
        "url": "/getting-started/tutorials/react-monorepo-tutorial",
        "line": 82,
        "fullMatch": "[Nx docs: React Monorepo tutorial](/getting-started/tutorials/react-monorepo-tutorial)"
      },
      {
        "text": "Nx docs: Migrate CRA to React and Vite",
        "url": "/recipes/adopting-nx/adding-to-existing-project",
        "line": 84,
        "fullMatch": "[Nx docs: Migrate CRA to React and Vite](/recipes/adopting-nx/adding-to-existing-project)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 88,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-02-16-nx-15-7-node-support-angular-lts-lockfile-pruning.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-02-16-nx-15-7-node-support-angular-lts-lockfile-pruning.md",
    "links": [
      {
        "text": "/extending-nx/tutorials/organization-specific-plugin",
        "url": "/extending-nx/tutorials/organization-specific-plugin",
        "line": 43,
        "fullMatch": "[/extending-nx/tutorials/organization-specific-plugin](/extending-nx/tutorials/organization-specific-plugin)"
      },
      {
        "text": "**affected**",
        "url": "/ci/features/affected",
        "line": 62,
        "fullMatch": "[**affected**](/ci/features/affected)"
      },
      {
        "text": "caching",
        "url": "/concepts/how-caching-works",
        "line": 62,
        "fullMatch": "[caching](/concepts/how-caching-works)"
      },
      {
        "text": "optimized CI setups",
        "url": "/ci/features/distribute-task-execution",
        "line": 62,
        "fullMatch": "[optimized CI setups](/ci/features/distribute-task-execution)"
      },
      {
        "text": "updated docs",
        "url": "/recipes/tips-n-tricks/advanced-update",
        "line": 91,
        "fullMatch": "[updated docs](/recipes/tips-n-tricks/advanced-update)"
      },
      {
        "text": "automated code migrations",
        "url": "/features/automate-updating-dependencies",
        "line": 148,
        "fullMatch": "[automated code migrations](/features/automate-updating-dependencies)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 185,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-02-21-using-ngrx-standalone-apis-with-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-02-21-using-ngrx-standalone-apis-with-nx.md",
    "links": [
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 177,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-02-28-bundling-a-node-api-with-fastify-esbuild-and-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-02-28-bundling-a-node-api-with-fastify-esbuild-and-nx.md",
    "links": [
      {
        "text": "intro page",
        "url": "/getting-started/intro",
        "line": 240,
        "fullMatch": "[intro page](/getting-started/intro)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 244,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-03-02-expanding-nx-console-to-jetbrains-ides.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-03-02-expanding-nx-console-to-jetbrains-ides.md",
    "links": [
      {
        "text": "**_Encapsulated Nx_\n**",
        "url": "/recipes/installation/install-non-javascript",
        "line": 199,
        "fullMatch": "[**_Encapsulated Nx_\n**](/recipes/installation/install-non-javascript)"
      },
      {
        "text": "`nx:run-commands`",
        "url": "/reference/core-api/nx/executors/run-commands",
        "line": 206,
        "fullMatch": "[`nx:run-commands`](/reference/core-api/nx/executors/run-commands)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 232,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-03-08-nx-15-8-rust-hasher-nx-console-for-intellij-deno-node-and-storybook.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-03-08-nx-15-8-rust-hasher-nx-console-for-intellij-deno-node-and-storybook.md",
    "links": [
      {
        "text": "computation cache",
        "url": "/features/cache-task-results",
        "line": 37,
        "fullMatch": "[computation cache](/features/cache-task-results)"
      },
      {
        "text": "Nx Daemon",
        "url": "/concepts/nx-daemon",
        "line": 67,
        "fullMatch": "[Nx Daemon](/concepts/nx-daemon)"
      },
      {
        "text": "integrating with editors",
        "url": "/getting-started/editor-setup",
        "line": 134,
        "fullMatch": "[integrating with editors](/getting-started/editor-setup)"
      },
      {
        "text": "in the doc about Customizing Generator Options",
        "url": "/extending-nx/recipes/generator-options",
        "line": 163,
        "fullMatch": "[in the doc about Customizing Generator Options](/extending-nx/recipes/generator-options)"
      },
      {
        "text": "affected commands",
        "url": "/ci/features/affected",
        "line": 169,
        "fullMatch": "[affected commands](/ci/features/affected)"
      },
      {
        "text": "caching",
        "url": "/concepts/how-caching-works",
        "line": 169,
        "fullMatch": "[caching](/concepts/how-caching-works)"
      },
      {
        "text": "optimized CI setups",
        "url": "/ci/features/distribute-task-execution",
        "line": 169,
        "fullMatch": "[optimized CI setups](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 209,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-03-10-rspack-getting-up-to-speed-with-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-03-10-rspack-getting-up-to-speed-with-nx.md",
    "links": [
      {
        "text": "affected commands",
        "url": "/ci/features/affected",
        "line": 44,
        "fullMatch": "[affected commands](/ci/features/affected)"
      },
      {
        "text": "computation caching",
        "url": "/features/cache-task-results",
        "line": 45,
        "fullMatch": "[computation caching](/features/cache-task-results)"
      },
      {
        "text": "code editor extensions",
        "url": "/getting-started/editor-setup",
        "line": 50,
        "fullMatch": "[code editor extensions](/getting-started/editor-setup)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 78,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-04-19-nx-cloud-3.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-04-19-nx-cloud-3.md",
    "links": [
      {
        "text": "Nx Daemon",
        "url": "/concepts/nx-daemon",
        "line": 45,
        "fullMatch": "[Nx Daemon](/concepts/nx-daemon)"
      },
      {
        "text": "Distributed Task Execution (short DTE)",
        "url": "/ci/features/distribute-task-execution",
        "line": 54,
        "fullMatch": "[Distributed Task Execution (short DTE)](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 118,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-05-02-nx-16-is-here.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-05-02-nx-16-is-here.md",
    "links": [
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 80,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 132,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-05-16-introducing-the-nx-champions-program.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-05-16-introducing-the-nx-champions-program.md",
    "links": [
      {
        "text": "/community",
        "url": "/community",
        "line": 18,
        "fullMatch": "[/community](/community)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 27,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-05-26-determine-your-user-location-with-netlify-edge-functions.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-05-26-determine-your-user-location-with-netlify-edge-functions.md",
    "links": [
      {
        "text": "project-configuration",
        "url": "/reference/project-configuration",
        "line": 76,
        "fullMatch": "[project-configuration](/reference/project-configuration)"
      },
      {
        "text": "here",
        "url": "/getting-started/intro",
        "line": 104,
        "fullMatch": "[here](/getting-started/intro)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 110,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-06-29-nx-console-gets-lit.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-06-29-nx-console-gets-lit.md",
    "links": [
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 330,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 666,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-07-06-nx-16-5-release.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-07-06-nx-16-5-release.md",
    "links": [
      {
        "text": "Nx Module Boundary lint rule",
        "url": "/features/enforce-module-boundaries",
        "line": 20,
        "fullMatch": "[Nx Module Boundary lint rule](/features/enforce-module-boundaries)"
      },
      {
        "text": "`nx affected`",
        "url": "/reference/core-api/nx/documents/affected",
        "line": 22,
        "fullMatch": "[`nx affected`](/reference/core-api/nx/documents/affected)"
      },
      {
        "text": "`nx run-many`",
        "url": "/reference/core-api/nx/documents/run-many",
        "line": 22,
        "fullMatch": "[`nx run-many`](/reference/core-api/nx/documents/run-many)"
      },
      {
        "text": "our docs for choosing optional packages to apply",
        "url": "/recipes/tips-n-tricks/advanced-update",
        "line": 63,
        "fullMatch": "[our docs for choosing optional packages to apply](/recipes/tips-n-tricks/advanced-update)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 225,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-07-26-evergreen-tooling-more-than-just-codemods.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-07-26-evergreen-tooling-more-than-just-codemods.md",
    "links": [
      {
        "text": "_/getting-started/intro_",
        "url": "/getting-started/intro",
        "line": 151,
        "fullMatch": "[_/getting-started/intro_](/getting-started/intro)"
      },
      {
        "text": "create your own",
        "url": "/extending-nx/intro/getting-started",
        "line": 153,
        "fullMatch": "[create your own](/extending-nx/intro/getting-started)"
      },
      {
        "text": "/features/automate-updating-dependencies",
        "url": "/features/automate-updating-dependencies",
        "line": 193,
        "fullMatch": "[/features/automate-updating-dependencies](/features/automate-updating-dependencies)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 199,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-08-03-storybook-interaction-tests-in-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-08-03-storybook-interaction-tests-in-nx.md",
    "links": [
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 70,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-08-10-create-your-own-create-react-app-cli.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-08-10-create-your-own-create-react-app-cli.md",
    "links": [
      {
        "text": "create-nx-workspace",
        "url": "/getting-started/installation",
        "line": 12,
        "fullMatch": "[create-nx-workspace](/getting-started/installation)"
      },
      {
        "text": "creating custom \"presets\"",
        "url": "/extending-nx/recipes/create-preset",
        "line": 19,
        "fullMatch": "[creating custom \"presets\"](/extending-nx/recipes/create-preset)"
      },
      {
        "text": "@nx/devkit",
        "url": "/reference/core-api/devkit/documents/nx_devkit",
        "line": 191,
        "fullMatch": "[@nx/devkit](/reference/core-api/devkit/documents/nx_devkit)"
      },
      {
        "text": "complete list of utility functions",
        "url": "/reference/core-api/devkit/documents/nx_devkit",
        "line": 191,
        "fullMatch": "[complete list of utility functions](/reference/core-api/devkit/documents/nx_devkit)"
      },
      {
        "text": "addDependenciesToPackageJson",
        "url": "/reference/core-api/devkit/documents/nx_devkit",
        "line": 314,
        "fullMatch": "[addDependenciesToPackageJson](/reference/core-api/devkit/documents/nx_devkit)"
      },
      {
        "text": "generators",
        "url": "/plugins/recipes/local-generators\\",
        "line": 634,
        "fullMatch": "[generators](/plugins/recipes/local-generators\\)"
      },
      {
        "text": "executors",
        "url": "/extending-nx/recipes/local-executors",
        "line": 636,
        "fullMatch": "[executors](/extending-nx/recipes/local-executors)"
      },
      {
        "text": "/getting-started/tutorials/react-monorepo-tutorial",
        "url": "/getting-started/tutorials/react-monorepo-tutorial",
        "line": 639,
        "fullMatch": "[/getting-started/tutorials/react-monorepo-tutorial](/getting-started/tutorials/react-monorepo-tutorial)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 643,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-08-15-qwikify-your-dev.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-08-15-qwikify-your-dev.md",
    "links": [
      {
        "text": "learn more about Nx here",
        "url": "/getting-started/intro",
        "line": 14,
        "fullMatch": "[learn more about Nx here](/getting-started/intro)"
      },
      {
        "text": "add Nx later",
        "url": "/recipes/adopting-nx/adding-to-existing-project#install-nx-on-a-nonmonorepo-project",
        "line": 18,
        "fullMatch": "[add Nx later](/recipes/adopting-nx/adding-to-existing-project#install-nx-on-a-nonmonorepo-project)"
      },
      {
        "text": "/extending-nx/recipes/create-install-package",
        "url": "/extending-nx/recipes/create-install-package",
        "line": 53,
        "fullMatch": "[/extending-nx/recipes/create-install-package](/extending-nx/recipes/create-install-package)"
      },
      {
        "text": "Learn more about defining and ensuring project boundaries in the Nx docs.",
        "url": "/features/enforce-module-boundaries",
        "line": 150,
        "fullMatch": "[Learn more about defining and ensuring project boundaries in the Nx docs.](/features/enforce-module-boundaries)"
      },
      {
        "text": "Learn more about the Project Graph.",
        "url": "/concepts/mental-model#the-project-graph",
        "line": 154,
        "fullMatch": "[Learn more about the Project Graph.](/concepts/mental-model#the-project-graph)"
      },
      {
        "text": "Enforce Module Boundaries",
        "url": "/features/enforce-module-boundaries",
        "line": 600,
        "fullMatch": "[Enforce Module Boundaries](/features/enforce-module-boundaries)"
      },
      {
        "text": "Nx Core Concepts",
        "url": "/concepts",
        "line": 601,
        "fullMatch": "[Nx Core Concepts](/concepts)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 607,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-08-24-step-by-step-guide-to-creating-an-expo-monorepo-with-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-08-24-step-by-step-guide-to-creating-an-expo-monorepo-with-nx.md",
    "links": [
      {
        "text": "single version of every dependency",
        "url": "/concepts/decisions/dependency-management",
        "line": 41,
        "fullMatch": "[single version of every dependency](/concepts/decisions/dependency-management)"
      }
    ]
  },
  {
    "file": "2023-09-06-nx-16-8-release.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-09-06-nx-16-8-release.md",
    "links": [
      {
        "text": "project graph",
        "url": "/features/explore-graph",
        "line": 201,
        "fullMatch": "[project graph](/features/explore-graph)"
      },
      {
        "text": "`convert-to-monorepo` generator",
        "url": "/reference/core-api/workspace/generators/convert-to-monorepo",
        "line": 285,
        "fullMatch": "[`convert-to-monorepo` generator](/reference/core-api/workspace/generators/convert-to-monorepo)"
      },
      {
        "text": "Docs intro page",
        "url": "/getting-started/intro",
        "line": 313,
        "fullMatch": "[Docs intro page](/getting-started/intro)"
      },
      {
        "text": "core features",
        "url": "/features",
        "line": 315,
        "fullMatch": "[core features](/features)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 363,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-09-18-introducing-playwright-support-for-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-09-18-introducing-playwright-support-for-nx.md",
    "links": [
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 307,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-09-25-nx-raises.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-09-25-nx-raises.md",
    "links": [
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 17,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-10-13-nx-conf-2023-recap.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-10-13-nx-conf-2023-recap.md",
    "links": [
      {
        "text": "much more than monorepos",
        "url": "/getting-started/intro",
        "line": 20,
        "fullMatch": "[much more than monorepos](/getting-started/intro)"
      },
      {
        "text": "Nx docs",
        "url": "/getting-started/intro",
        "line": 25,
        "fullMatch": "[Nx docs](/getting-started/intro)"
      },
      {
        "text": "recipes",
        "url": "/recipes",
        "line": 29,
        "fullMatch": "[recipes](/recipes)"
      },
      {
        "text": "tutorials",
        "url": "/getting-started/tutorials",
        "line": 29,
        "fullMatch": "[tutorials](/getting-started/tutorials)"
      },
      {
        "text": "Nx Champions",
        "url": "/community",
        "line": 38,
        "fullMatch": "[Nx Champions](/community)"
      },
      {
        "text": "DTE (Distributed Task Execution)",
        "url": "/ci/features/distribute-task-execution",
        "line": 136,
        "fullMatch": "[DTE (Distributed Task Execution)](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Nx plugins",
        "url": "/extending-nx/intro/getting-started",
        "line": 219,
        "fullMatch": "[Nx plugins](/extending-nx/intro/getting-started)"
      },
      {
        "text": "Nx affected",
        "url": "/features/run-tasks#run-tasks-on-projects-affected-by-a-pr",
        "line": 391,
        "fullMatch": "[Nx affected](/features/run-tasks#run-tasks-on-projects-affected-by-a-pr)"
      },
      {
        "text": "DTE",
        "url": "/ci/features/distribute-task-execution",
        "line": 409,
        "fullMatch": "[DTE](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Nx preset",
        "url": "/extending-nx/recipes/create-preset",
        "line": 462,
        "fullMatch": "[Nx preset](/extending-nx/recipes/create-preset)"
      },
      {
        "text": "install package",
        "url": "/extending-nx/recipes/create-install-package",
        "line": 462,
        "fullMatch": "[install package](/extending-nx/recipes/create-install-package)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 472,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 490,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-10-20-nx-17-release.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-10-20-nx-17-release.md",
    "links": [
      {
        "text": "More in the docs.",
        "url": "/features/cache-task-results",
        "line": 173,
        "fullMatch": "[More in the docs.](/features/cache-task-results)"
      },
      {
        "text": "Reduce Repetitive Configuration",
        "url": "/recipes/running-tasks/reduce-repetitive-configuration",
        "line": 175,
        "fullMatch": "[Reduce Repetitive Configuration](/recipes/running-tasks/reduce-repetitive-configuration)"
      },
      {
        "text": "checkout our API docs",
        "url": "/reference/core-api/nx/documents/release",
        "line": 229,
        "fullMatch": "[checkout our API docs](/reference/core-api/nx/documents/release)"
      },
      {
        "text": "v2 of our Project Inference API",
        "url": "/extending-nx/recipes/project-graph-plugins",
        "line": 235,
        "fullMatch": "[v2 of our Project Inference API](/extending-nx/recipes/project-graph-plugins)"
      },
      {
        "text": "v2 documentation",
        "url": "/extending-nx/recipes/project-graph-plugins",
        "line": 247,
        "fullMatch": "[v2 documentation](/extending-nx/recipes/project-graph-plugins)"
      },
      {
        "text": "help you automatically migrate",
        "url": "/features/automate-updating-dependencies",
        "line": 257,
        "fullMatch": "[help you automatically migrate](/features/automate-updating-dependencies)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 277,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-11-08-state-management.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-11-08-state-management.md",
    "links": [
      {
        "text": "Nx Console",
        "url": "/recipes/nx-console",
        "line": 118,
        "fullMatch": "[Nx Console](/recipes/nx-console)"
      },
      {
        "text": "Nx Console",
        "url": "/recipes/nx-console",
        "line": 436,
        "fullMatch": "[Nx Console](/recipes/nx-console)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 716,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-11-21-ai-assistant.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-11-21-ai-assistant.md",
    "links": [
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 311,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      },
      {
        "text": "Nx Official Discord Server",
        "url": "/community",
        "line": 314,
        "fullMatch": "[Nx Official Discord Server](/community)"
      }
    ]
  },
  {
    "file": "2023-11-22-unit-testing-expo.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-11-22-unit-testing-expo.md",
    "links": [
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 332,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-12-20-nx-17-2-release.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-12-20-nx-17-2-release.md",
    "links": [
      {
        "text": "check it out",
        "url": "/ci/features/distribute-task-execution",
        "line": 154,
        "fullMatch": "[check it out](/ci/features/distribute-task-execution)"
      },
      {
        "text": "automated migration command",
        "url": "/features/automate-updating-dependencies",
        "line": 190,
        "fullMatch": "[automated migration command](/features/automate-updating-dependencies)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 211,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2023-12-28-highlights-2023.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2023-12-28-highlights-2023.md",
    "links": [
      {
        "text": "project graph calculation",
        "url": "/features/explore-graph",
        "line": 50,
        "fullMatch": "[project graph calculation](/features/explore-graph)"
      },
      {
        "text": "migration from a CRA-based setup",
        "url": "/recipes/adopting-nx/adding-to-existing-project",
        "line": 60,
        "fullMatch": "[migration from a CRA-based setup](/recipes/adopting-nx/adding-to-existing-project)"
      },
      {
        "text": "the \"nx release\" command",
        "url": "/features/manage-releases",
        "line": 70,
        "fullMatch": "[the \"nx release\" command](/features/manage-releases)"
      },
      {
        "text": "programmatic API",
        "url": "/features/manage-releases#using-the-programmatic-api-for-nx-release",
        "line": 81,
        "fullMatch": "[programmatic API](/features/manage-releases#using-the-programmatic-api-for-nx-release)"
      },
      {
        "text": "project graph",
        "url": "/features/explore-graph",
        "line": 197,
        "fullMatch": "[project graph](/features/explore-graph)"
      },
      {
        "text": "Nx preset",
        "url": "/extending-nx/recipes/create-preset",
        "line": 233,
        "fullMatch": "[Nx preset](/extending-nx/recipes/create-preset)"
      },
      {
        "text": "Nx's DevKit",
        "url": "/extending-nx/intro/getting-started",
        "line": 286,
        "fullMatch": "[Nx's DevKit](/extending-nx/intro/getting-started)"
      },
      {
        "text": "using Nx to build your own CLI",
        "url": "/extending-nx/recipes/create-install-package",
        "line": 288,
        "fullMatch": "[using Nx to build your own CLI](/extending-nx/recipes/create-install-package)"
      },
      {
        "text": "coordinate task dependencies",
        "url": "/concepts/task-pipeline-configuration",
        "line": 290,
        "fullMatch": "[coordinate task dependencies](/concepts/task-pipeline-configuration)"
      },
      {
        "text": "Nx Champions",
        "url": "/community",
        "line": 300,
        "fullMatch": "[Nx Champions](/community)"
      },
      {
        "text": "all of our champions",
        "url": "/community",
        "line": 304,
        "fullMatch": "[all of our champions](/community)"
      },
      {
        "text": "effort into the docs",
        "url": "/getting-started/intro",
        "line": 314,
        "fullMatch": "[effort into the docs](/getting-started/intro)"
      },
      {
        "text": "**Concept docs**",
        "url": "/concepts",
        "line": 316,
        "fullMatch": "[**Concept docs**](/concepts)"
      },
      {
        "text": "how caching works",
        "url": "/concepts/how-caching-works",
        "line": 316,
        "fullMatch": "[how caching works](/concepts/how-caching-works)"
      },
      {
        "text": "**Recipes**",
        "url": "/recipes",
        "line": 317,
        "fullMatch": "[**Recipes**](/recipes)"
      },
      {
        "text": "**Tutorials**",
        "url": "/getting-started/tutorials",
        "line": 318,
        "fullMatch": "[**Tutorials**](/getting-started/tutorials)"
      },
      {
        "text": "**Reference**",
        "url": "/reference",
        "line": 319,
        "fullMatch": "[**Reference**](/reference)"
      },
      {
        "text": "**API docs**",
        "url": "/reference/core-api",
        "line": 319,
        "fullMatch": "[**API docs**](/reference/core-api)"
      },
      {
        "text": "\"Why Nx\"",
        "url": "/getting-started/intro",
        "line": 321,
        "fullMatch": "[\"Why Nx\"](/getting-started/intro)"
      },
      {
        "text": "entry pages",
        "url": "/getting-started/intro",
        "line": 323,
        "fullMatch": "[entry pages](/getting-started/intro)"
      },
      {
        "text": "migrate to a monorepo",
        "url": "/recipes/tips-n-tricks/standalone-to-monorepo",
        "line": 335,
        "fullMatch": "[migrate to a monorepo](/recipes/tips-n-tricks/standalone-to-monorepo)"
      },
      {
        "text": "Nx Agents",
        "url": "/ci/features/distribute-task-execution",
        "line": 341,
        "fullMatch": "[Nx Agents](/ci/features/distribute-task-execution)"
      },
      {
        "text": "/ci",
        "url": "/ci/recipes/set-up",
        "line": 343,
        "fullMatch": "[/ci](/ci/recipes/set-up)"
      },
      {
        "text": "**Nx Cach**",
        "url": "/ci/features/remote-cache",
        "line": 363,
        "fullMatch": "[**Nx Cach**](/ci/features/remote-cache)"
      },
      {
        "text": "**Nx Agents**",
        "url": "/ci/features/distribute-task-execution",
        "line": 364,
        "fullMatch": "[**Nx Agents**](/ci/features/distribute-task-execution)"
      },
      {
        "text": "provide automatic migrations",
        "url": "/features/automate-updating-dependencies",
        "line": 377,
        "fullMatch": "[provide automatic migrations](/features/automate-updating-dependencies)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 385,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-02-05-nx-18-project-crystal.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-02-05-nx-18-project-crystal.md",
    "links": [
      {
        "text": "task dependencies",
        "url": "/recipes/running-tasks/defining-task-pipeline",
        "line": 47,
        "fullMatch": "[task dependencies](/recipes/running-tasks/defining-task-pipeline)"
      },
      {
        "text": "infers them",
        "url": "/concepts/inferred-tasks",
        "line": 93,
        "fullMatch": "[infers them](/concepts/inferred-tasks)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 147,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 185,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-02-06-nuxt-js-support-in-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-02-06-nuxt-js-support-in-nx.md",
    "links": [
      {
        "text": "Nx Console extension",
        "url": "/getting-started/editor-setup",
        "line": 113,
        "fullMatch": "[Nx Console extension](/getting-started/editor-setup)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 192,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-02-07-fast-effortless-ci.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-02-07-fast-effortless-ci.md",
    "links": [
      {
        "text": "Nx Agents",
        "url": "/ci/features/distribute-task-execution",
        "line": 21,
        "fullMatch": "[Nx Agents](/ci/features/distribute-task-execution)"
      },
      {
        "text": "With a single yaml file",
        "url": "/ci/reference/launch-templates",
        "line": 96,
        "fullMatch": "[With a single yaml file](/ci/reference/launch-templates)"
      },
      {
        "text": "define three different classes of agent allocation configurations",
        "url": "/ci/features/dynamic-agents",
        "line": 100,
        "fullMatch": "[define three different classes of agent allocation configurations](/ci/features/dynamic-agents)"
      },
      {
        "text": "automatically create separate Cypress and Playwright tasks",
        "url": "/ci/features/split-e2e-tasks",
        "line": 106,
        "fullMatch": "[automatically create separate Cypress and Playwright tasks](/ci/features/split-e2e-tasks)"
      },
      {
        "text": "automatically re-run a flaky task if it fails",
        "url": "/ci/features/flaky-tasks",
        "line": 112,
        "fullMatch": "[automatically re-run a flaky task if it fails](/ci/features/flaky-tasks)"
      },
      {
        "text": "flag it to run directly on the main CI job",
        "url": "/ci/reference/nx-cloud-cli#enablingdisabling-distribution",
        "line": 118,
        "fullMatch": "[flag it to run directly on the main CI job](/ci/reference/nx-cloud-cli#enablingdisabling-distribution)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 124,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-02-09-versioning-and-releasing-packages.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-02-09-versioning-and-releasing-packages.md",
    "links": [
      {
        "text": "example script in our docs",
        "url": "/features/manage-releases#using-the-programmatic-api-for-nx-release",
        "line": 233,
        "fullMatch": "[example script in our docs](/features/manage-releases#using-the-programmatic-api-for-nx-release)"
      },
      {
        "text": "example script from our docs",
        "url": "/features/manage-releases#using-the-programmatic-api-for-nx-release",
        "line": 237,
        "fullMatch": "[example script from our docs](/features/manage-releases#using-the-programmatic-api-for-nx-release)"
      },
      {
        "text": "more details on how to set that up",
        "url": "/recipes/nx-release/publish-in-ci-cd",
        "line": 299,
        "fullMatch": "[more details on how to set that up](/recipes/nx-release/publish-in-ci-cd)"
      },
      {
        "text": "Managing Releases",
        "url": "/features/manage-releases",
        "line": 303,
        "fullMatch": "[Managing Releases](/features/manage-releases)"
      },
      {
        "text": "release-related recipes",
        "url": "/recipes/nx-release",
        "line": 303,
        "fullMatch": "[release-related recipes](/recipes/nx-release)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 316,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-02-15-launch-week-recap.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-02-15-launch-week-recap.md",
    "links": [
      {
        "text": "more of the details in our docs",
        "url": "/ci/features/distribute-task-execution",
        "line": 87,
        "fullMatch": "[more of the details in our docs](/ci/features/distribute-task-execution)"
      },
      {
        "text": "nx release",
        "url": "/recipes/nx-release/release-npm-packages",
        "line": 123,
        "fullMatch": "[nx release](/recipes/nx-release/release-npm-packages)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 145,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-03-20-why-speed-matters.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-03-20-why-speed-matters.md",
    "links": [
      {
        "text": "building blocks for a fast CI",
        "url": "/ci/concepts/building-blocks-fast-ci",
        "line": 12,
        "fullMatch": "[building blocks for a fast CI](/ci/concepts/building-blocks-fast-ci)"
      },
      {
        "text": "No more waiting for builds and tests to complete",
        "url": "/ci/concepts/reduce-waste",
        "line": 20,
        "fullMatch": "[No more waiting for builds and tests to complete](/ci/concepts/reduce-waste)"
      },
      {
        "text": "**Affected**",
        "url": "/ci/features/affected",
        "line": 24,
        "fullMatch": "[**Affected**](/ci/features/affected)"
      },
      {
        "text": "**Nx Replay**",
        "url": "/ci/features/remote-cache",
        "line": 25,
        "fullMatch": "[**Nx Replay**](/ci/features/remote-cache)"
      },
      {
        "text": "**Nx Agents**",
        "url": "/ci/features/distribute-task-execution",
        "line": 26,
        "fullMatch": "[**Nx Agents**](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Parallelization and Distribution",
        "url": "/ci/concepts/parallelization-distribution",
        "line": 26,
        "fullMatch": "[Parallelization and Distribution](/ci/concepts/parallelization-distribution)"
      },
      {
        "text": "Nx Agents",
        "url": "/ci/features/distribute-task-execution",
        "line": 56,
        "fullMatch": "[Nx Agents](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Easy integration with existing providers",
        "url": "/ci/recipes/set-up",
        "line": 58,
        "fullMatch": "[Easy integration with existing providers](/ci/recipes/set-up)"
      },
      {
        "text": "Efficient task distribution",
        "url": "/ci/features/dynamic-agents",
        "line": 60,
        "fullMatch": "[Efficient task distribution](/ci/features/dynamic-agents)"
      },
      {
        "text": "Atomizer",
        "url": "/ci/features/split-e2e-tasks",
        "line": 70,
        "fullMatch": "[Atomizer](/ci/features/split-e2e-tasks)"
      },
      {
        "text": "re-running only the flaky tasks",
        "url": "/ci/features/flaky-tasks",
        "line": 76,
        "fullMatch": "[re-running only the flaky tasks](/ci/features/flaky-tasks)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 100,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-03-21-reliable-ci.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-03-21-reliable-ci.md",
    "links": [
      {
        "text": "Nx Cloud knows what specific tests are flaky",
        "url": "/ci/features/flaky-tasks",
        "line": 130,
        "fullMatch": "[Nx Cloud knows what specific tests are flaky](/ci/features/flaky-tasks)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 182,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-04-19-manage-your-gradle.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-04-19-manage-your-gradle.md",
    "links": [
      {
        "text": "CI faster",
        "url": "/ci/recipes/set-up",
        "line": 14,
        "fullMatch": "[CI faster](/ci/recipes/set-up)"
      },
      {
        "text": "Cache task results",
        "url": "/features/cache-task-results",
        "line": 34,
        "fullMatch": "[Cache task results](/features/cache-task-results)"
      },
      {
        "text": "Distribute task execution",
        "url": "/ci/features/distribute-task-execution",
        "line": 35,
        "fullMatch": "[Distribute task execution](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Run only tasks affected by a PR",
        "url": "/ci/features/affected",
        "line": 36,
        "fullMatch": "[Run only tasks affected by a PR](/ci/features/affected)"
      },
      {
        "text": "Interactively explore your workspace",
        "url": "/features/explore-graph",
        "line": 37,
        "fullMatch": "[Interactively explore your workspace](/features/explore-graph)"
      },
      {
        "text": "Nx graph",
        "url": "/features/explore-graph",
        "line": 133,
        "fullMatch": "[Nx graph](/features/explore-graph)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 145,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "project details view",
        "url": "/features/explore-graph#explore-projects-in-your-workspace",
        "line": 166,
        "fullMatch": "[project details view](/features/explore-graph#explore-projects-in-your-workspace)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 214,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-05-08-nx-19-release.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-05-08-nx-19-release.md",
    "links": [
      {
        "text": "a new tutorial on using Nx with Gradle",
        "url": "/getting-started/tutorials/gradle-tutorial",
        "line": 55,
        "fullMatch": "[a new tutorial on using Nx with Gradle](/getting-started/tutorials/gradle-tutorial)"
      },
      {
        "text": "Atomizer",
        "url": "/ci/features/split-e2e-tasks",
        "line": 182,
        "fullMatch": "[Atomizer](/ci/features/split-e2e-tasks)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 234,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-07-29-explain-with-ai.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-07-29-explain-with-ai.md",
    "links": [
      {
        "text": "Explain with AI",
        "url": "/ci/features/explain-with-ai",
        "line": 15,
        "fullMatch": "[Explain with AI](/ci/features/explain-with-ai)"
      },
      {
        "text": "to check out our docs",
        "url": "/ci/features/explain-with-ai",
        "line": 25,
        "fullMatch": "[to check out our docs](/ci/features/explain-with-ai)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 50,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-08-01-nx-19-5-update.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-08-01-nx-19-5-update.md",
    "links": [
      {
        "text": "distribute your tasks with Nx Agents",
        "url": "/ci/features/distribute-task-execution",
        "line": 41,
        "fullMatch": "[distribute your tasks with Nx Agents](/ci/features/distribute-task-execution)"
      },
      {
        "text": "flaky task detection",
        "url": "/ci/features/flaky-tasks",
        "line": 77,
        "fullMatch": "[flaky task detection](/ci/features/flaky-tasks)"
      },
      {
        "text": "project Crystal",
        "url": "/concepts/inferred-tasks",
        "line": 87,
        "fullMatch": "[project Crystal](/concepts/inferred-tasks)"
      },
      {
        "text": "Nx Console IDE plugin",
        "url": "/getting-started/editor-setup",
        "line": 87,
        "fullMatch": "[Nx Console IDE plugin](/getting-started/editor-setup)"
      },
      {
        "text": "leverage the `Nx Atomizer`",
        "url": "/ci/features/split-e2e-tasks",
        "line": 97,
        "fullMatch": "[leverage the `Nx Atomizer`](/ci/features/split-e2e-tasks)"
      },
      {
        "text": "Nx Agents",
        "url": "/ci/features/distribute-task-execution#distribute-task-execution-nx-agents",
        "line": 97,
        "fullMatch": "[Nx Agents](/ci/features/distribute-task-execution#distribute-task-execution-nx-agents)"
      },
      {
        "text": "Nx Agents",
        "url": "/ci/features/distribute-task-execution",
        "line": 105,
        "fullMatch": "[Nx Agents](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Atomizer features",
        "url": "/ci/features/split-e2e-tasks",
        "line": 109,
        "fullMatch": "[Atomizer features](/ci/features/split-e2e-tasks)"
      },
      {
        "text": "reducing configuration with `targetDefaults`",
        "url": "/recipes/running-tasks/reduce-repetitive-configuration#reduce-configuration-with-targetdefaults",
        "line": 133,
        "fullMatch": "[reducing configuration with `targetDefaults`](/recipes/running-tasks/reduce-repetitive-configuration#reduce-configuration-with-targetdefaults)"
      },
      {
        "text": "how you can define task pipelines with `targetDefaults`",
        "url": "/features/run-tasks#defining-a-task-pipeline",
        "line": 133,
        "fullMatch": "[how you can define task pipelines with `targetDefaults`](/features/run-tasks#defining-a-task-pipeline)"
      },
      {
        "text": "`parallelism` property",
        "url": "/reference/project-configuration#parallelism",
        "line": 148,
        "fullMatch": "[`parallelism` property](/reference/project-configuration#parallelism)"
      },
      {
        "text": "Parallelize Tasks Across Multiple Machines Using Nx Agents",
        "url": "/ci/features/split-e2e-tasks",
        "line": 172,
        "fullMatch": "[Parallelize Tasks Across Multiple Machines Using Nx Agents](/ci/features/split-e2e-tasks)"
      },
      {
        "text": "only building packages that were affected",
        "url": "/reference/core-api/nx/documents/affected",
        "line": 181,
        "fullMatch": "[only building packages that were affected](/reference/core-api/nx/documents/affected)"
      },
      {
        "text": "Nx Replay",
        "url": "/ci/features/remote-cache",
        "line": 181,
        "fullMatch": "[Nx Replay](/ci/features/remote-cache)"
      },
      {
        "text": "Nx Agents",
        "url": "/ci/features/distribute-task-execution",
        "line": 181,
        "fullMatch": "[Nx Agents](/ci/features/distribute-task-execution)"
      },
      {
        "text": "buildable libraries and incremental builds",
        "url": "/concepts/buildable-and-publishable-libraries",
        "line": 183,
        "fullMatch": "[buildable libraries and incremental builds](/concepts/buildable-and-publishable-libraries)"
      },
      {
        "text": "Nx Project Crystal",
        "url": "/concepts/inferred-tasks",
        "line": 187,
        "fullMatch": "[Nx Project Crystal](/concepts/inferred-tasks)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 195,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "Nx Atomizer",
        "url": "/ci/features/split-e2e-tasks",
        "line": 197,
        "fullMatch": "[Nx Atomizer](/ci/features/split-e2e-tasks)"
      },
      {
        "text": "Test Atomization",
        "url": "/ci/features/split-e2e-tasks",
        "line": 220,
        "fullMatch": "[Test Atomization](/ci/features/split-e2e-tasks)"
      },
      {
        "text": "Nx release",
        "url": "/reference/core-api/nx/documents/release",
        "line": 228,
        "fullMatch": "[Nx release](/reference/core-api/nx/documents/release)"
      },
      {
        "text": "powerful programmatic API",
        "url": "/features/manage-releases#using-the-programmatic-api-for-nx-release",
        "line": 241,
        "fullMatch": "[powerful programmatic API](/features/manage-releases#using-the-programmatic-api-for-nx-release)"
      },
      {
        "text": "Nx Release in the meantime, check out our docs",
        "url": "/features/manage-releases",
        "line": 245,
        "fullMatch": "[Nx Release in the meantime, check out our docs](/features/manage-releases)"
      },
      {
        "text": "`nx migrate`",
        "url": "/reference/core-api/nx/documents/migrate",
        "line": 264,
        "fullMatch": "[`nx migrate`](/reference/core-api/nx/documents/migrate)"
      },
      {
        "text": "automated migration command",
        "url": "/features/automate-updating-dependencies",
        "line": 268,
        "fullMatch": "[automated migration command](/features/automate-updating-dependencies)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 290,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-08-28-nxcloud-improved-ci-log.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-08-28-nxcloud-improved-ci-log.md",
    "links": [
      {
        "text": "Nx on CI",
        "url": "/ci/recipes/set-up",
        "line": 43,
        "fullMatch": "[Nx on CI](/ci/recipes/set-up)"
      },
      {
        "text": "Task Distribution with Nx Agents",
        "url": "/ci/features/distribute-task-execution",
        "line": 44,
        "fullMatch": "[Task Distribution with Nx Agents](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Automated e2e Test Splitting",
        "url": "/ci/features/split-e2e-tasks",
        "line": 45,
        "fullMatch": "[Automated e2e Test Splitting](/ci/features/split-e2e-tasks)"
      }
    ]
  },
  {
    "file": "2024-09-10-personal-access-tokens.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-09-10-personal-access-tokens.md",
    "links": [
      {
        "text": "Nx Replay",
        "url": "/ci/features/remote-cache",
        "line": 12,
        "fullMatch": "[Nx Replay](/ci/features/remote-cache)"
      },
      {
        "text": "CI access tokens",
        "url": "/ci/recipes/security/access-tokens",
        "line": 34,
        "fullMatch": "[CI access tokens](/ci/recipes/security/access-tokens)"
      },
      {
        "text": "Personal access tokens",
        "url": "/ci/recipes/security/personal-access-tokens",
        "line": 41,
        "fullMatch": "[Personal access tokens](/ci/recipes/security/personal-access-tokens)"
      },
      {
        "text": "GitHub integration",
        "url": "/ci/features/github-integration",
        "line": 44,
        "fullMatch": "[GitHub integration](/ci/features/github-integration)"
      },
      {
        "text": "find more details in our docs",
        "url": "/ci/recipes/security/personal-access-tokens",
        "line": 65,
        "fullMatch": "[find more details in our docs](/ci/recipes/security/personal-access-tokens)"
      },
      {
        "text": "environment variable",
        "url": "/ci/reference/env-vars#nxcloudaccesstoken",
        "line": 77,
        "fullMatch": "[environment variable](/ci/reference/env-vars#nxcloudaccesstoken)"
      },
      {
        "text": "Learn more about using personal access tokens",
        "url": "/ci/recipes/security/personal-access-tokens",
        "line": 83,
        "fullMatch": "[Learn more about using personal access tokens](/ci/recipes/security/personal-access-tokens)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 87,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      },
      {
        "text": "Nx Cloud Cache Security",
        "url": "/ci/concepts/cache-security",
        "line": 88,
        "fullMatch": "[Nx Cloud Cache Security](/ci/concepts/cache-security)"
      },
      {
        "text": "Nx Cloud Personal Access Tokens",
        "url": "/ci/recipes/security/personal-access-tokens",
        "line": 89,
        "fullMatch": "[Nx Cloud Personal Access Tokens](/ci/recipes/security/personal-access-tokens)"
      },
      {
        "text": "Nx Cloud CI Access Tokens",
        "url": "/ci/recipes/security/access-tokens",
        "line": 90,
        "fullMatch": "[Nx Cloud CI Access Tokens](/ci/recipes/security/access-tokens)"
      }
    ]
  },
  {
    "file": "2024-09-12-next-gen-module-federation-deployments.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-09-12-next-gen-module-federation-deployments.md",
    "links": [
      {
        "text": "here",
        "url": "/features/run-tasks",
        "line": 126,
        "fullMatch": "[here](/features/run-tasks)"
      },
      {
        "text": "Nx on CI",
        "url": "/ci/recipes/set-up",
        "line": 483,
        "fullMatch": "[Nx on CI](/ci/recipes/set-up)"
      },
      {
        "text": "Task Distribution with Nx Agents",
        "url": "/ci/features/distribute-task-execution",
        "line": 484,
        "fullMatch": "[Task Distribution with Nx Agents](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Automated e2e Test Splitting",
        "url": "/ci/features/split-e2e-tasks",
        "line": 485,
        "fullMatch": "[Automated e2e Test Splitting](/ci/features/split-e2e-tasks)"
      }
    ]
  },
  {
    "file": "2024-09-20-nx-19-8.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-09-20-nx-19-8.md",
    "links": [
      {
        "text": "`nx import`",
        "url": "/reference/core-api/nx/documents/import",
        "line": 31,
        "fullMatch": "[`nx import`](/reference/core-api/nx/documents/import)"
      },
      {
        "text": "top-level command of the Nx CLI",
        "url": "/reference/nx-commands",
        "line": 33,
        "fullMatch": "[top-level command of the Nx CLI](/reference/nx-commands)"
      },
      {
        "text": "the documentation",
        "url": "/reference/core-api/nx/documents/import",
        "line": 35,
        "fullMatch": "[the documentation](/reference/core-api/nx/documents/import)"
      },
      {
        "text": "task dependencies",
        "url": "/features/run-tasks#defining-a-task-pipeline",
        "line": 39,
        "fullMatch": "[task dependencies](/features/run-tasks#defining-a-task-pipeline)"
      },
      {
        "text": "running tasks with Nx",
        "url": "/features/run-tasks",
        "line": 43,
        "fullMatch": "[running tasks with Nx](/features/run-tasks)"
      },
      {
        "text": "Project Crystal",
        "url": "/concepts/inferred-tasks",
        "line": 47,
        "fullMatch": "[Project Crystal](/concepts/inferred-tasks)"
      },
      {
        "text": "Project Crystal",
        "url": "/concepts/inferred-tasks",
        "line": 57,
        "fullMatch": "[Project Crystal](/concepts/inferred-tasks)"
      },
      {
        "text": "`infer-targets`",
        "url": "/recipes/running-tasks/convert-to-inferred#migrate-all-plugins",
        "line": 59,
        "fullMatch": "[`infer-targets`](/recipes/running-tasks/convert-to-inferred#migrate-all-plugins)"
      },
      {
        "text": "`nx release`",
        "url": "/reference/core-api/nx/documents/release",
        "line": 76,
        "fullMatch": "[`nx release`](/reference/core-api/nx/documents/release)"
      },
      {
        "text": "building before versioning",
        "url": "/recipes/nx-release/build-before-versioning",
        "line": 78,
        "fullMatch": "[building before versioning](/recipes/nx-release/build-before-versioning)"
      },
      {
        "text": "automated migration command",
        "url": "/features/automate-updating-dependencies",
        "line": 87,
        "fullMatch": "[automated migration command](/features/automate-updating-dependencies)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 109,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-09-25-evolving-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-09-25-evolving-nx.md",
    "links": [
      {
        "text": "Learn more in the docs",
        "url": "/recipes/running-tasks/self-hosted-caching",
        "line": 50,
        "fullMatch": "[Learn more in the docs](/recipes/running-tasks/self-hosted-caching)"
      },
      {
        "text": "Docs: Powerpack features",
        "url": "/getting-started/intro",
        "line": 66,
        "fullMatch": "[Docs: Powerpack features](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-09-25-introducing-nx-powerpack.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-09-25-introducing-nx-powerpack.md",
    "links": [
      {
        "text": "Nx run commands",
        "url": "/features/run-tasks",
        "line": 65,
        "fullMatch": "[Nx run commands](/features/run-tasks)"
      },
      {
        "text": "project graph",
        "url": "/features/explore-graph",
        "line": 65,
        "fullMatch": "[project graph](/features/explore-graph)"
      },
      {
        "text": "Enforce Module Boundaries",
        "url": "/reference/core-api/conformance#enforce-module-boundaries",
        "line": 133,
        "fullMatch": "[Enforce Module Boundaries](/reference/core-api/conformance#enforce-module-boundaries)"
      },
      {
        "text": "Enforce Module Boundaries rule",
        "url": "/features/enforce-module-boundaries",
        "line": 133,
        "fullMatch": "[Enforce Module Boundaries rule](/features/enforce-module-boundaries)"
      },
      {
        "text": "Ensure Owners",
        "url": "/reference/core-api/conformance#ensure-owners",
        "line": 134,
        "fullMatch": "[Ensure Owners](/reference/core-api/conformance#ensure-owners)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 198,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-10-03-nx-20-release.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-10-03-nx-20-release.md",
    "links": [
      {
        "text": "`nx sync`",
        "url": "/reference/nx-commands#sync",
        "line": 29,
        "fullMatch": "[`nx sync`](/reference/nx-commands#sync)"
      }
    ]
  },
  {
    "file": "2024-10-25-sports-retailer-success.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-10-25-sports-retailer-success.md",
    "links": [
      {
        "text": "Project size in monorepos",
        "url": "/concepts/decisions/project-size",
        "line": 101,
        "fullMatch": "[Project size in monorepos](/concepts/decisions/project-size)"
      },
      {
        "text": "Folder structure for project",
        "url": "/concepts/decisions/folder-structure",
        "line": 102,
        "fullMatch": "[Folder structure for project](/concepts/decisions/folder-structure)"
      },
      {
        "text": "Defining dependency rules between projects",
        "url": "/concepts/decisions/project-dependency-rules",
        "line": 103,
        "fullMatch": "[Defining dependency rules between projects](/concepts/decisions/project-dependency-rules)"
      }
    ]
  },
  {
    "file": "2024-10-29-nx-import.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-10-29-nx-import.md",
    "links": [
      {
        "text": "recipe for using `nx import`",
        "url": "/recipes/adopting-nx/import-project",
        "line": 81,
        "fullMatch": "[recipe for using `nx import`](/recipes/adopting-nx/import-project)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 83,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-11-19-ci-affected-graph.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-11-19-ci-affected-graph.md",
    "links": [
      {
        "text": "graph visualization",
        "url": "/features/explore-graph",
        "line": 12,
        "fullMatch": "[graph visualization](/features/explore-graph)"
      },
      {
        "text": "`affected`",
        "url": "/ci/features/affected",
        "line": 21,
        "fullMatch": "[`affected`](/ci/features/affected)"
      },
      {
        "text": "Composite Graph",
        "url": "/features/explore-graph#focusing-on-valuable-projects",
        "line": 29,
        "fullMatch": "[Composite Graph](/features/explore-graph#focusing-on-valuable-projects)"
      },
      {
        "text": "reducing the number of affected projects on CI",
        "url": "/ci/recipes/other/cipe-affected-project-graph",
        "line": 36,
        "fullMatch": "[reducing the number of affected projects on CI](/ci/recipes/other/cipe-affected-project-graph)"
      },
      {
        "text": "Recipe: Reduce the Number of Affected Projects in a CI Pipeline Execution",
        "url": "/ci/recipes/other/cipe-affected-project-graph",
        "line": 48,
        "fullMatch": "[Recipe: Reduce the Number of Affected Projects in a CI Pipeline Execution](/ci/recipes/other/cipe-affected-project-graph)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 49,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-11-30-advent-of-code-crystal.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-11-30-advent-of-code-crystal.md",
    "links": [
      {
        "text": "Nx Project Crystal",
        "url": "/concepts/inferred-tasks",
        "line": 23,
        "fullMatch": "[Nx Project Crystal](/concepts/inferred-tasks)"
      },
      {
        "text": "`nx watch`",
        "url": "/reference/core-api/nx/documents/watch",
        "line": 87,
        "fullMatch": "[`nx watch`](/reference/core-api/nx/documents/watch)"
      },
      {
        "text": "Tutorial: Creating Your Own Plugin With Inferred Tasks",
        "url": "/extending-nx/tutorials/tooling-plugin#create-an-inferred-task",
        "line": 114,
        "fullMatch": "[Tutorial: Creating Your Own Plugin With Inferred Tasks](/extending-nx/tutorials/tooling-plugin#create-an-inferred-task)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 115,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-12-03-define-the-relationship-with-monorepos.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-12-03-define-the-relationship-with-monorepos.md",
    "links": [
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 80,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2024-12-06-nx-cloud-pipelines-in-nx-console.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-12-06-nx-cloud-pipelines-in-nx-console.md",
    "links": [
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 12,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      }
    ]
  },
  {
    "file": "2024-12-10-tailoring-nx-for-your-organization.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-12-10-tailoring-nx-for-your-organization.md",
    "links": [
      {
        "text": "custom plugins",
        "url": "/extending-nx/intro/getting-started",
        "line": 12,
        "fullMatch": "[custom plugins](/extending-nx/intro/getting-started)"
      },
      {
        "text": "extensive instructions in our docs for building plugins",
        "url": "/extending-nx/intro/getting-started",
        "line": 50,
        "fullMatch": "[extensive instructions in our docs for building plugins](/extending-nx/intro/getting-started)"
      },
      {
        "text": "@nx/plugin",
        "url": "/reference/core-api/plugin",
        "line": 50,
        "fullMatch": "[@nx/plugin](/reference/core-api/plugin)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 124,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "`nx release`",
        "url": "/features/manage-releases",
        "line": 134,
        "fullMatch": "[`nx release`](/features/manage-releases)"
      },
      {
        "text": "create this same type of preset for your org",
        "url": "/extending-nx/recipes/create-preset",
        "line": 154,
        "fullMatch": "[create this same type of preset for your org](/extending-nx/recipes/create-preset)"
      },
      {
        "text": "create your own install package",
        "url": "/extending-nx/recipes/create-install-package",
        "line": 160,
        "fullMatch": "[create your own install package](/extending-nx/recipes/create-install-package)"
      },
      {
        "text": "Generators",
        "url": "/extending-nx/recipes/local-generators",
        "line": 172,
        "fullMatch": "[Generators](/extending-nx/recipes/local-generators)"
      },
      {
        "text": "Task inference",
        "url": "/extending-nx/tutorials/tooling-plugin",
        "line": 173,
        "fullMatch": "[Task inference](/extending-nx/tutorials/tooling-plugin)"
      },
      {
        "text": "Migrations",
        "url": "/extending-nx/recipes/migration-generators",
        "line": 175,
        "fullMatch": "[Migrations](/extending-nx/recipes/migration-generators)"
      },
      {
        "text": "Enforce Organizational Best Practices with a Local Plugin",
        "url": "/extending-nx/tutorials/organization-specific-plugin",
        "line": 185,
        "fullMatch": "[Enforce Organizational Best Practices with a Local Plugin](/extending-nx/tutorials/organization-specific-plugin)"
      },
      {
        "text": "Create a Tooling Plugin",
        "url": "/extending-nx/tutorials/tooling-plugin",
        "line": 186,
        "fullMatch": "[Create a Tooling Plugin](/extending-nx/tutorials/tooling-plugin)"
      }
    ]
  },
  {
    "file": "2024-12-18-dynamic-targets-with-inference.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-12-18-dynamic-targets-with-inference.md",
    "links": [
      {
        "text": "Nx Daemon",
        "url": "/concepts/nx-daemon",
        "line": 78,
        "fullMatch": "[Nx Daemon](/concepts/nx-daemon)"
      },
      {
        "text": "Enforce Organizational Best Practices with a Local Plugin",
        "url": "/extending-nx/tutorials/organization-specific-plugin",
        "line": 243,
        "fullMatch": "[Enforce Organizational Best Practices with a Local Plugin](/extending-nx/tutorials/organization-specific-plugin)"
      },
      {
        "text": "Create a Tooling Plugin",
        "url": "/extending-nx/tutorials/tooling-plugin",
        "line": 244,
        "fullMatch": "[Create a Tooling Plugin](/extending-nx/tutorials/tooling-plugin)"
      }
    ]
  },
  {
    "file": "2024-12-22-nx-highlights-2024.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2024-12-22-nx-highlights-2024.md",
    "links": [
      {
        "text": "Nx plugins",
        "url": "/concepts/nx-plugins#what-are-nx-plugins",
        "line": 27,
        "fullMatch": "[Nx plugins](/concepts/nx-plugins#what-are-nx-plugins)"
      },
      {
        "text": "documentation",
        "url": "/concepts/inferred-tasks",
        "line": 44,
        "fullMatch": "[documentation](/concepts/inferred-tasks)"
      },
      {
        "text": "Nx Agents",
        "url": "/ci/features/distribute-task-execution",
        "line": 52,
        "fullMatch": "[Nx Agents](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Atomizer",
        "url": "/ci/features/split-e2e-tasks",
        "line": 53,
        "fullMatch": "[Atomizer](/ci/features/split-e2e-tasks)"
      },
      {
        "text": "Flakiness detection",
        "url": "/ci/features/flaky-tasks",
        "line": 54,
        "fullMatch": "[Flakiness detection](/ci/features/flaky-tasks)"
      },
      {
        "text": "the docs",
        "url": "/ci/features/distribute-task-execution",
        "line": 68,
        "fullMatch": "[the docs](/ci/features/distribute-task-execution)"
      },
      {
        "text": "**Nx Release**",
        "url": "/features/manage-releases",
        "line": 82,
        "fullMatch": "[**Nx Release**](/features/manage-releases)"
      },
      {
        "text": "programmatic API",
        "url": "/features/manage-releases#using-the-programmatic-api-for-nx-release",
        "line": 88,
        "fullMatch": "[programmatic API](/features/manage-releases#using-the-programmatic-api-for-nx-release)"
      },
      {
        "text": "our docs",
        "url": "/features/manage-releases",
        "line": 92,
        "fullMatch": "[our docs](/features/manage-releases)"
      },
      {
        "text": "Nx Release recipes",
        "url": "/recipes/nx-release",
        "line": 92,
        "fullMatch": "[Nx Release recipes](/recipes/nx-release)"
      },
      {
        "text": "Gradle tutorial",
        "url": "/getting-started/tutorials/gradle-tutorial",
        "line": 106,
        "fullMatch": "[Gradle tutorial](/getting-started/tutorials/gradle-tutorial)"
      },
      {
        "text": "docs",
        "url": "/recipes/adopting-nx/import-project",
        "line": 124,
        "fullMatch": "[docs](/recipes/adopting-nx/import-project)"
      },
      {
        "text": "here",
        "url": "/ci/recipes/set-up",
        "line": 138,
        "fullMatch": "[here](/ci/recipes/set-up)"
      },
      {
        "text": "inferred tasks",
        "url": "/concepts/inferred-tasks",
        "line": 156,
        "fullMatch": "[inferred tasks](/concepts/inferred-tasks)"
      }
    ]
  },
  {
    "file": "2025-01-06-nx-update-20-3.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-01-06-nx-update-20-3.md",
    "links": [
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup#download",
        "line": 154,
        "fullMatch": "[Nx Console](/getting-started/editor-setup#download)"
      },
      {
        "text": "Assignment Rules",
        "url": "/ci/reference/assignment-rules",
        "line": 170,
        "fullMatch": "[Assignment Rules](/ci/reference/assignment-rules)"
      },
      {
        "text": "`nx migrate`",
        "url": "/features/automate-updating-dependencies",
        "line": 174,
        "fullMatch": "[`nx migrate`](/features/automate-updating-dependencies)"
      },
      {
        "text": "'inferred tasks plugins'",
        "url": "/concepts/inferred-tasks",
        "line": 186,
        "fullMatch": "['inferred tasks plugins'](/concepts/inferred-tasks)"
      },
      {
        "text": "self-hosted caching packages",
        "url": "/recipes/running-tasks/self-hosted-caching",
        "line": 198,
        "fullMatch": "[self-hosted caching packages](/recipes/running-tasks/self-hosted-caching)"
      },
      {
        "text": "Azure",
        "url": "/reference/core-api/azure-cache/overview",
        "line": 198,
        "fullMatch": "[Azure](/reference/core-api/azure-cache/overview)"
      },
      {
        "text": "Google Cloud Storage",
        "url": "/reference/core-api/gcs-cache/overview",
        "line": 198,
        "fullMatch": "[Google Cloud Storage](/reference/core-api/gcs-cache/overview)"
      },
      {
        "text": "S3",
        "url": "/reference/core-api/s3-cache/overview",
        "line": 198,
        "fullMatch": "[S3](/reference/core-api/s3-cache/overview)"
      },
      {
        "text": "simply using a shared file system",
        "url": "/reference/core-api/shared-fs-cache/overview",
        "line": 198,
        "fullMatch": "[simply using a shared file system](/reference/core-api/shared-fs-cache/overview)"
      },
      {
        "text": "added support for S3 compatible providers",
        "url": "/reference/core-api/s3-cache#s3-compatible-providers",
        "line": 200,
        "fullMatch": "[added support for S3 compatible providers](/reference/core-api/s3-cache#s3-compatible-providers)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 219,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2025-01-09-who-gave-js-a-build-step.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-01-09-who-gave-js-a-build-step.md",
    "links": [
      {
        "text": "Continuous Integration",
        "url": "/ci",
        "line": 138,
        "fullMatch": "[Continuous Integration](/ci)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 199,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2025-01-27-project-references.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-01-27-project-references.md",
    "links": [
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 200,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2025-01-28-managing-ts-pkgs-in-monorepos.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-01-28-managing-ts-pkgs-in-monorepos.md",
    "links": [
      {
        "text": "publish a package",
        "url": "/features/manage-releases",
        "line": 493,
        "fullMatch": "[publish a package](/features/manage-releases)"
      },
      {
        "text": "a task pipelines functionality",
        "url": "/concepts/task-pipeline-configuration",
        "line": 551,
        "fullMatch": "[a task pipelines functionality](/concepts/task-pipeline-configuration)"
      },
      {
        "text": "task pipeline",
        "url": "/concepts/task-pipeline-configuration",
        "line": 604,
        "fullMatch": "[task pipeline](/concepts/task-pipeline-configuration)"
      },
      {
        "text": "shown here",
        "url": "/recipes/adopting-nx/adding-to-monorepo",
        "line": 623,
        "fullMatch": "[shown here](/recipes/adopting-nx/adding-to-monorepo)"
      },
      {
        "text": "computation caching",
        "url": "/features/cache-task-results",
        "line": 638,
        "fullMatch": "[computation caching](/features/cache-task-results)"
      },
      {
        "text": "Nx release",
        "url": "/features/manage-releases",
        "line": 640,
        "fullMatch": "[Nx release](/features/manage-releases)"
      },
      {
        "text": "sync command",
        "url": "/concepts/sync-generators",
        "line": 649,
        "fullMatch": "[sync command](/concepts/sync-generators)"
      },
      {
        "text": "TypeScript Project Linking",
        "url": "/concepts/typescript-project-linking",
        "line": 665,
        "fullMatch": "[TypeScript Project Linking](/concepts/typescript-project-linking)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 672,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2025-01-29-new-nx-experience.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-01-29-new-nx-experience.md",
    "links": [
      {
        "text": "caching",
        "url": "/features/cache-task-results",
        "line": 53,
        "fullMatch": "[caching](/features/cache-task-results)"
      },
      {
        "text": "task pipelines",
        "url": "/concepts/task-pipeline-configuration",
        "line": 53,
        "fullMatch": "[task pipelines](/concepts/task-pipeline-configuration)"
      },
      {
        "text": "code generators",
        "url": "/features/generate-code",
        "line": 63,
        "fullMatch": "[code generators](/features/generate-code)"
      },
      {
        "text": "Nx plugins",
        "url": "/concepts/nx-plugins",
        "line": 63,
        "fullMatch": "[Nx plugins](/concepts/nx-plugins)"
      },
      {
        "text": "infers",
        "url": "/concepts/inferred-tasks",
        "line": 84,
        "fullMatch": "[infers](/concepts/inferred-tasks)"
      },
      {
        "text": "inferred tasks",
        "url": "/concepts/inferred-tasks",
        "line": 248,
        "fullMatch": "[inferred tasks](/concepts/inferred-tasks)"
      },
      {
        "text": "see docs",
        "url": "/reference/project-configuration",
        "line": 260,
        "fullMatch": "[see docs](/reference/project-configuration)"
      },
      {
        "text": "Nx Agents",
        "url": "/ci/features/distribute-task-execution",
        "line": 280,
        "fullMatch": "[Nx Agents](/ci/features/distribute-task-execution)"
      },
      {
        "text": "cached",
        "url": "/features/cache-task-results",
        "line": 289,
        "fullMatch": "[cached](/features/cache-task-results)"
      },
      {
        "text": "migrating multiple Angular applications",
        "url": "/recipes/adopting-nx/import-project",
        "line": 368,
        "fullMatch": "[migrating multiple Angular applications](/recipes/adopting-nx/import-project)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 380,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2025-01-31-over-the-air-updates-with-zephyr.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-01-31-over-the-air-updates-with-zephyr.md",
    "links": [
      {
        "text": "single-version policy",
        "url": "/concepts/decisions/dependency-management#single-version-policy",
        "line": 57,
        "fullMatch": "[single-version policy](/concepts/decisions/dependency-management#single-version-policy)"
      },
      {
        "text": "\"affected\"",
        "url": "/ci/features/affected",
        "line": 57,
        "fullMatch": "[\"affected\"](/ci/features/affected)"
      },
      {
        "text": "Task Caching",
        "url": "/features/cache-task-results",
        "line": 59,
        "fullMatch": "[Task Caching](/features/cache-task-results)"
      },
      {
        "text": "Task Orchestration",
        "url": "/features/run-tasks#defining-a-task-pipeline",
        "line": 59,
        "fullMatch": "[Task Orchestration](/features/run-tasks#defining-a-task-pipeline)"
      },
      {
        "text": "Nx Cloud",
        "url": "/ci/features",
        "line": 61,
        "fullMatch": "[Nx Cloud](/ci/features)"
      },
      {
        "text": "Nx Replay",
        "url": "/ci/features/remote-cache#use-remote-caching-nx-replay",
        "line": 61,
        "fullMatch": "[Nx Replay](/ci/features/remote-cache#use-remote-caching-nx-replay)"
      },
      {
        "text": "Nx Agents",
        "url": "/ci/features/distribute-task-execution",
        "line": 61,
        "fullMatch": "[Nx Agents](/ci/features/distribute-task-execution)"
      },
      {
        "text": "config files",
        "url": "/ci/recipes/set-up/monorepo-ci-github-actions",
        "line": 61,
        "fullMatch": "[config files](/ci/recipes/set-up/monorepo-ci-github-actions)"
      },
      {
        "text": "here",
        "url": "/getting-started/intro",
        "line": 63,
        "fullMatch": "[here](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2025-02-03-workspace-structure.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-02-03-workspace-structure.md",
    "links": [
      {
        "text": "Nx Champions",
        "url": "/community",
        "line": 26,
        "fullMatch": "[Nx Champions](/community)"
      },
      {
        "text": "tags",
        "url": "/features/enforce-module-boundaries#tags",
        "line": 183,
        "fullMatch": "[tags](/features/enforce-module-boundaries#tags)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 215,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2025-02-06-hetzner-cloud-success-story.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-02-06-hetzner-cloud-success-story.md",
    "links": [
      {
        "text": "module boundary rules",
        "url": "/features/enforce-module-boundaries",
        "line": 51,
        "fullMatch": "[module boundary rules](/features/enforce-module-boundaries)"
      },
      {
        "text": "conformance rules",
        "url": "/reference/core-api/conformance",
        "line": 51,
        "fullMatch": "[conformance rules](/reference/core-api/conformance)"
      },
      {
        "text": "Nx Graph",
        "url": "/features/explore-graph",
        "line": 54,
        "fullMatch": "[Nx Graph](/features/explore-graph)"
      },
      {
        "text": "Nx Cloud",
        "url": "/ci/features/remote-cache",
        "line": 63,
        "fullMatch": "[Nx Cloud](/ci/features/remote-cache)"
      },
      {
        "text": "Nx Replay feature",
        "url": "/ci/features/remote-cache",
        "line": 63,
        "fullMatch": "[Nx Replay feature](/ci/features/remote-cache)"
      },
      {
        "text": "distribute runs",
        "url": "/ci/features/distribute-task-execution",
        "line": 63,
        "fullMatch": "[distribute runs](/ci/features/distribute-task-execution)"
      },
      {
        "text": "flaky tasks automatically",
        "url": "/ci/features/flaky-tasks",
        "line": 63,
        "fullMatch": "[flaky tasks automatically](/ci/features/flaky-tasks)"
      },
      {
        "text": "Nx remote cache",
        "url": "/ci/features/remote-cache",
        "line": 65,
        "fullMatch": "[Nx remote cache](/ci/features/remote-cache)"
      },
      {
        "text": "Nx Console extension in their IDE",
        "url": "/getting-started/editor-setup",
        "line": 69,
        "fullMatch": "[Nx Console extension in their IDE](/getting-started/editor-setup)"
      }
    ]
  },
  {
    "file": "2025-02-17-monorepos-are-ai-future-proof.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-02-17-monorepos-are-ai-future-proof.md",
    "links": [
      {
        "text": "Nx Replay",
        "url": "/ci/features/remote-cache",
        "line": 66,
        "fullMatch": "[Nx Replay](/ci/features/remote-cache)"
      },
      {
        "text": "Nx Agents",
        "url": "/ci/features/distribute-task-execution",
        "line": 66,
        "fullMatch": "[Nx Agents](/ci/features/distribute-task-execution)"
      },
      {
        "text": "local repository automation",
        "url": "/extending-nx/intro/getting-started",
        "line": 66,
        "fullMatch": "[local repository automation](/extending-nx/intro/getting-started)"
      },
      {
        "text": "Nx daemon",
        "url": "/concepts/nx-daemon",
        "line": 68,
        "fullMatch": "[Nx daemon](/concepts/nx-daemon)"
      },
      {
        "text": "cache configuration",
        "url": "/features/cache-task-results#finetune-caching-with-inputs-and-outputs",
        "line": 78,
        "fullMatch": "[cache configuration](/features/cache-task-results#finetune-caching-with-inputs-and-outputs)"
      },
      {
        "text": "code generators",
        "url": "/features/generate-code",
        "line": 86,
        "fullMatch": "[code generators](/features/generate-code)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 98,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "installing Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 114,
        "fullMatch": "[installing Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "Nx generators",
        "url": "/features/generate-code",
        "line": 128,
        "fullMatch": "[Nx generators](/features/generate-code)"
      },
      {
        "text": "Nx Console's generator UI",
        "url": "/recipes/nx-console/console-generate-command",
        "line": 128,
        "fullMatch": "[Nx Console's generator UI](/recipes/nx-console/console-generate-command)"
      },
      {
        "text": "create a new Nx workspace",
        "url": "/getting-started/start-new-project",
        "line": 146,
        "fullMatch": "[create a new Nx workspace](/getting-started/start-new-project)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 146,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 156,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2025-02-21-using-apollo-graphql-with-react-in-an-nx-workspace.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-02-21-using-apollo-graphql-with-react-in-an-nx-workspace.md",
    "links": [
      {
        "text": "Caching",
        "url": "/features/cache-task-results",
        "line": 665,
        "fullMatch": "[Caching](/features/cache-task-results)"
      },
      {
        "text": "Dependent tasks",
        "url": "/concepts/task-pipeline-configuration",
        "line": 666,
        "fullMatch": "[Dependent tasks](/concepts/task-pipeline-configuration)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 716,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2025-03-06-making-cursor-smarter.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-03-06-making-cursor-smarter.md",
    "links": [
      {
        "text": "editor setup guide",
        "url": "/getting-started/editor-setup",
        "line": 57,
        "fullMatch": "[editor setup guide](/getting-started/editor-setup)"
      },
      {
        "text": "AI enhancement documentation",
        "url": "/features/enhance-AI",
        "line": 81,
        "fullMatch": "[AI enhancement documentation](/features/enhance-AI)"
      },
      {
        "text": "Nx Console extension",
        "url": "/getting-started/editor-setup",
        "line": 109,
        "fullMatch": "[Nx Console extension](/getting-started/editor-setup)"
      },
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 154,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  },
  {
    "file": "2025-03-07-nx-update-20-5.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-03-07-nx-update-20-5.md",
    "links": [
      {
        "text": "**`nx migrate`**",
        "url": "/reference/core-api/nx/documents/migrate",
        "line": 67,
        "fullMatch": "[**`nx migrate`**](/reference/core-api/nx/documents/migrate)"
      },
      {
        "text": "See our docs for more details",
        "url": "/recipes/tips-n-tricks/advanced-update#choosing-optional-package-updates-to-apply",
        "line": 71,
        "fullMatch": "[See our docs for more details](/recipes/tips-n-tricks/advanced-update#choosing-optional-package-updates-to-apply)"
      }
    ]
  },
  {
    "file": "2025-03-17-modern-angular-testing-with-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-03-17-modern-angular-testing-with-nx.md",
    "links": [
      {
        "text": "Remote Caching",
        "url": "/ci/features/remote-cache",
        "line": 59,
        "fullMatch": "[Remote Caching](/ci/features/remote-cache)"
      },
      {
        "text": "Project Details View",
        "url": "/recipes/nx-console/console-project-details",
        "line": 91,
        "fullMatch": "[Project Details View](/recipes/nx-console/console-project-details)"
      },
      {
        "text": "Automatic Test Splitting",
        "url": "/ci/features/split-e2e-tasks",
        "line": 102,
        "fullMatch": "[Automatic Test Splitting](/ci/features/split-e2e-tasks)"
      },
      {
        "text": "enable distribution",
        "url": "/ci/features/split-e2e-tasks#enable-automated-e2e-task-splitting",
        "line": 106,
        "fullMatch": "[enable distribution](/ci/features/split-e2e-tasks#enable-automated-e2e-task-splitting)"
      },
      {
        "text": "setup guides",
        "url": "/ci/recipes/set-up",
        "line": 112,
        "fullMatch": "[setup guides](/ci/recipes/set-up)"
      },
      {
        "text": "dynamically allocate agents",
        "url": "/ci/features/dynamic-agents#dynamically-allocate-agents",
        "line": 187,
        "fullMatch": "[dynamically allocate agents](/ci/features/dynamic-agents#dynamically-allocate-agents)"
      },
      {
        "text": "Re-run Flaky Tests",
        "url": "/ci/features/flaky-tasks",
        "line": 205,
        "fullMatch": "[Re-run Flaky Tests](/ci/features/flaky-tasks)"
      },
      {
        "text": "Getting Started",
        "url": "/getting-started/intro",
        "line": 385,
        "fullMatch": "[Getting Started](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2025-03-18-architecting-angular-applications.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-03-18-architecting-angular-applications.md",
    "links": [
      {
        "text": "Nx boundary rules in our documentation",
        "url": "/features/enforce-module-boundaries",
        "line": 405,
        "fullMatch": "[Nx boundary rules in our documentation](/features/enforce-module-boundaries)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 432,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "Local Generators documentation",
        "url": "/extending-nx/recipes/local-generators",
        "line": 434,
        "fullMatch": "[Local Generators documentation](/extending-nx/recipes/local-generators)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 438,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "in our documentation",
        "url": "/features/enhance-AI",
        "line": 442,
        "fullMatch": "[in our documentation](/features/enhance-AI)"
      },
      {
        "text": "Remote Caching (Nx Replay)",
        "url": "/ci/features/remote-cache",
        "line": 497,
        "fullMatch": "[Remote Caching (Nx Replay)](/ci/features/remote-cache)"
      },
      {
        "text": "Distributed Task Execution (Nx Agents)",
        "url": "/ci/features/distribute-task-execution",
        "line": 498,
        "fullMatch": "[Distributed Task Execution (Nx Agents)](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Atomizer",
        "url": "/ci/features/split-e2e-tasks",
        "line": 499,
        "fullMatch": "[Atomizer](/ci/features/split-e2e-tasks)"
      },
      {
        "text": "Flaky Task Detection",
        "url": "/ci/features/flaky-tasks",
        "line": 500,
        "fullMatch": "[Flaky Task Detection](/ci/features/flaky-tasks)"
      },
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 547,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  },
  {
    "file": "2025-03-19-using-angular-with-rspack.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-03-19-using-angular-with-rspack.md",
    "links": [
      {
        "text": "inferred",
        "url": "/concepts/inferred-tasks",
        "line": 79,
        "fullMatch": "[inferred](/concepts/inferred-tasks)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 232,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2025-03-31-custom-runners-and-self-hosted-caching.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-03-31-custom-runners-and-self-hosted-caching.md",
    "links": [
      {
        "text": "in our docs",
        "url": "/extending-nx/recipes/task-running-lifecycle",
        "line": 35,
        "fullMatch": "[in our docs](/extending-nx/recipes/task-running-lifecycle)"
      },
      {
        "text": "**Nx Champions**",
        "url": "/community",
        "line": 65,
        "fullMatch": "[**Nx Champions**](/community)"
      }
    ]
  },
  {
    "file": "2025-04-10-exploring-nx-console-with-mcp.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-04-10-exploring-nx-console-with-mcp.md",
    "links": [
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 11,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "enhance your LLM assistant",
        "url": "/features/enhance-AI",
        "line": 11,
        "fullMatch": "[enhance your LLM assistant](/features/enhance-AI)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 23,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "docs have all the details",
        "url": "/features/enhance-AI",
        "line": 31,
        "fullMatch": "[docs have all the details](/features/enhance-AI)"
      },
      {
        "text": "build pipelines",
        "url": "/features/run-tasks#defining-a-task-pipeline",
        "line": 51,
        "fullMatch": "[build pipelines](/features/run-tasks#defining-a-task-pipeline)"
      },
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 100,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  },
  {
    "file": "2025-04-14-scaffold-angular-rspack-applications.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-04-14-scaffold-angular-rspack-applications.md",
    "links": [
      {
        "text": "**Nx Docs**",
        "url": "/getting-started/intro",
        "line": 140,
        "fullMatch": "[**Nx Docs**](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2025-04-15-nx-mcp-vscode-copilot.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-04-15-nx-mcp-vscode-copilot.md",
    "links": [
      {
        "text": "Nx Console from the VS Code marketplace",
        "url": "/getting-started/editor-setup",
        "line": 121,
        "fullMatch": "[Nx Console from the VS Code marketplace](/getting-started/editor-setup)"
      },
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 127,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  },
  {
    "file": "2025-04-17-nx-and-ai-why-they-work-together.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-04-17-nx-and-ai-why-they-work-together.md",
    "links": [
      {
        "text": "coding assistants through MCP servers",
        "url": "/features/enhance-AI",
        "line": 66,
        "fullMatch": "[coding assistants through MCP servers](/features/enhance-AI)"
      },
      {
        "text": "its generators",
        "url": "/features/generate-code",
        "line": 120,
        "fullMatch": "[its generators](/features/generate-code)"
      },
      {
        "text": "Nx Migrations",
        "url": "/features/automate-updating-dependencies",
        "line": 126,
        "fullMatch": "[Nx Migrations](/features/automate-updating-dependencies)"
      },
      {
        "text": "Nx project graph visualization",
        "url": "/features/explore-graph",
        "line": 144,
        "fullMatch": "[Nx project graph visualization](/features/explore-graph)"
      },
      {
        "text": "\"migrations\" - specialized generators",
        "url": "/features/automate-updating-dependencies",
        "line": 156,
        "fullMatch": "[\"migrations\" - specialized generators](/features/automate-updating-dependencies)"
      },
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 191,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  },
  {
    "file": "2025-04-21-nx-cloud-update-april-2025.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-04-21-nx-cloud-update-april-2025.md",
    "links": [
      {
        "text": "Assignment Rules",
        "url": "/ci/reference/assignment-rules",
        "line": 21,
        "fullMatch": "[Assignment Rules](/ci/reference/assignment-rules)"
      },
      {
        "text": "Nx Agents",
        "url": "/ci/features/distribute-task-execution",
        "line": 23,
        "fullMatch": "[Nx Agents](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Agents",
        "url": "/ci/features/distribute-task-execution",
        "line": 57,
        "fullMatch": "[Agents](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Manual DTE",
        "url": "/ci/recipes/dte/github-dte",
        "line": 57,
        "fullMatch": "[Manual DTE](/ci/recipes/dte/github-dte)"
      },
      {
        "text": "check the docs",
        "url": "/ci/reference/assignment-rules",
        "line": 57,
        "fullMatch": "[check the docs](/ci/reference/assignment-rules)"
      },
      {
        "text": "Nx Cloud Docs",
        "url": "/ci",
        "line": 93,
        "fullMatch": "[Nx Cloud Docs](/ci)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 94,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2025-04-23-test-splitting-techniques.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-04-23-test-splitting-techniques.md",
    "links": [
      {
        "text": "Atomizer",
        "url": "/ci/features/split-e2e-tasks",
        "line": 51,
        "fullMatch": "[Atomizer](/ci/features/split-e2e-tasks)"
      },
      {
        "text": "this recipe",
        "url": "/extending-nx/recipes/project-graph-plugins",
        "line": 106,
        "fullMatch": "[this recipe](/extending-nx/recipes/project-graph-plugins)"
      }
    ]
  },
  {
    "file": "2025-05-01-nx-mcp-ci-fixes.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-05-01-nx-mcp-ci-fixes.md",
    "links": [
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 48,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "MCP server",
        "url": "/features/enhance-AI",
        "line": 48,
        "fullMatch": "[MCP server](/features/enhance-AI)"
      },
      {
        "text": "VS Code, Cursor, and IntelliJ",
        "url": "/getting-started/editor-setup",
        "line": 61,
        "fullMatch": "[VS Code, Cursor, and IntelliJ](/getting-started/editor-setup)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 112,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "in the docs",
        "url": "/features/enhance-AI",
        "line": 114,
        "fullMatch": "[in the docs](/features/enhance-AI)"
      },
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 122,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  },
  {
    "file": "2025-05-05-nx-21-release.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-05-05-nx-21-release.md",
    "links": [
      {
        "text": "configure a task pipeline",
        "url": "/concepts/task-pipeline-configuration",
        "line": 42,
        "fullMatch": "[configure a task pipeline](/concepts/task-pipeline-configuration)"
      },
      {
        "text": "inferred tasks",
        "url": "/concepts/inferred-tasks",
        "line": 59,
        "fullMatch": "[inferred tasks](/concepts/inferred-tasks)"
      },
      {
        "text": "Automated migrations",
        "url": "/features/automate-updating-dependencies",
        "line": 136,
        "fullMatch": "[Automated migrations](/features/automate-updating-dependencies)"
      },
      {
        "text": "Check out the docs for more details.",
        "url": "/recipes/nx-release/updating-version-references",
        "line": 156,
        "fullMatch": "[Check out the docs for more details.](/recipes/nx-release/updating-version-references)"
      },
      {
        "text": "`preTasksExecution` and `postTaskExecution` hooks",
        "url": "/recipes/nx-release/updating-version-references",
        "line": 166,
        "fullMatch": "[`preTasksExecution` and `postTaskExecution` hooks](/recipes/nx-release/updating-version-references)"
      },
      {
        "text": "self-hosted caching options",
        "url": "/recipes/running-tasks/self-hosted-caching",
        "line": 172,
        "fullMatch": "[self-hosted caching options](/recipes/running-tasks/self-hosted-caching)"
      },
      {
        "text": "creating Nx plugins that infer tasks",
        "url": "/extending-nx/recipes/project-graph-plugins",
        "line": 180,
        "fullMatch": "[creating Nx plugins that infer tasks](/extending-nx/recipes/project-graph-plugins)"
      },
      {
        "text": "socials",
        "url": "/community",
        "line": 186,
        "fullMatch": "[socials](/community)"
      },
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 190,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  },
  {
    "file": "2025-05-07-migrate-ui.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-05-07-migrate-ui.md",
    "links": [
      {
        "text": "`migrate`",
        "url": "/features/automate-updating-dependencies",
        "line": 23,
        "fullMatch": "[`migrate`](/features/automate-updating-dependencies)"
      },
      {
        "text": "very powerful and flexible tool",
        "url": "/recipes/tips-n-tricks/advanced-update",
        "line": 23,
        "fullMatch": "[very powerful and flexible tool](/recipes/tips-n-tricks/advanced-update)"
      },
      {
        "text": "**Migrate UI**",
        "url": "/recipes/nx-console/console-migrate-ui",
        "line": 25,
        "fullMatch": "[**Migrate UI**](/recipes/nx-console/console-migrate-ui)"
      },
      {
        "text": "community channels",
        "url": "/community",
        "line": 100,
        "fullMatch": "[community channels](/community)"
      }
    ]
  },
  {
    "file": "2025-05-08-improved-module-federation.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-05-08-improved-module-federation.md",
    "links": [
      {
        "text": "Continuous Tasks",
        "url": "/reference/project-configuration#continuous",
        "line": 20,
        "fullMatch": "[Continuous Tasks](/reference/project-configuration#continuous)"
      },
      {
        "text": "Inferred Tasks",
        "url": "/concepts/inferred-tasks",
        "line": 22,
        "fullMatch": "[Inferred Tasks](/concepts/inferred-tasks)"
      },
      {
        "text": "[https://nx.dev/getting-started/intro",
        "url": "/getting-started/intro",
        "line": 66,
        "fullMatch": "[[https://nx.dev/getting-started/intro](/getting-started/intro)"
      },
      {
        "text": "Terminal UI",
        "url": "/recipes/running-tasks/terminal-ui",
        "line": 132,
        "fullMatch": "[Terminal UI](/recipes/running-tasks/terminal-ui)"
      },
      {
        "text": "**Nx Docs**",
        "url": "/getting-started/intro",
        "line": 138,
        "fullMatch": "[**Nx Docs**](/getting-started/intro)"
      }
    ]
  },
  {
    "file": "2025-05-09-continuous-tasks.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-05-09-continuous-tasks.md",
    "links": [
      {
        "text": "task pipeline",
        "url": "/concepts/task-pipeline-configuration",
        "line": 37,
        "fullMatch": "[task pipeline](/concepts/task-pipeline-configuration)"
      },
      {
        "text": "check the docs",
        "url": "/recipes/running-tasks/defining-task-pipeline",
        "line": 67,
        "fullMatch": "[check the docs](/recipes/running-tasks/defining-task-pipeline)"
      },
      {
        "text": "inferred tasks",
        "url": "/concepts/inferred-tasks",
        "line": 92,
        "fullMatch": "[inferred tasks](/concepts/inferred-tasks)"
      },
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 227,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  },
  {
    "file": "2025-05-09-terminal-ui.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-05-09-terminal-ui.md",
    "links": [
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 88,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  },
  {
    "file": "2025-05-13-nx-generators-ai-integration.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-05-13-nx-generators-ai-integration.md",
    "links": [
      {
        "text": "create entirely custom ones",
        "url": "/extending-nx/recipes/local-generators",
        "line": 48,
        "fullMatch": "[create entirely custom ones](/extending-nx/recipes/local-generators)"
      },
      {
        "text": "Nx MCP",
        "url": "/features/enhance-AI",
        "line": 89,
        "fullMatch": "[Nx MCP](/features/enhance-AI)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 120,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "Nx MCP server configured",
        "url": "/features/enhance-AI",
        "line": 121,
        "fullMatch": "[Nx MCP server configured](/features/enhance-AI)"
      },
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 133,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      },
      {
        "text": "Nx Generators",
        "url": "/features/generate-code",
        "line": 134,
        "fullMatch": "[Nx Generators](/features/generate-code)"
      }
    ]
  },
  {
    "file": "2025-05-27-practical-guide-effective-ai-coding.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-05-27-practical-guide-effective-ai-coding.md",
    "links": [
      {
        "text": "Nx's AI integration",
        "url": "/features/enhance-AI",
        "line": 137,
        "fullMatch": "[Nx's AI integration](/features/enhance-AI)"
      },
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 286,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  },
  {
    "file": "2025-05-28-nx-terminal-integration-ai.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-05-28-nx-terminal-integration-ai.md",
    "links": [
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 55,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 84,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "Nx MCP server configured",
        "url": "/features/enhance-AI",
        "line": 85,
        "fullMatch": "[Nx MCP server configured](/features/enhance-AI)"
      },
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 110,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  },
  {
    "file": "2025-05-29-mcp-server-with-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-05-29-mcp-server-with-nx.md",
    "links": [
      {
        "text": "Nx MCP server",
        "url": "/features/enhance-AI",
        "line": 12,
        "fullMatch": "[Nx MCP server](/features/enhance-AI)"
      },
      {
        "text": "continuous task",
        "url": "/recipes/running-tasks/defining-task-pipeline#continuous-task-dependencies",
        "line": 158,
        "fullMatch": "[continuous task](/recipes/running-tasks/defining-task-pipeline#continuous-task-dependencies)"
      },
      {
        "text": "the comprehensive release documentation",
        "url": "/features/manage-releases",
        "line": 302,
        "fullMatch": "[the comprehensive release documentation](/features/manage-releases)"
      },
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 366,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  },
  {
    "file": "2025-06-12-cve-2025-36852-critical-cache-poisoning-vulnerability-creep.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-06-12-cve-2025-36852-critical-cache-poisoning-vulnerability-creep.md",
    "links": [
      {
        "text": "Review your settings",
        "url": "/ci/concepts/cache-security#use-scoped-tokens-in-ci",
        "line": 101,
        "fullMatch": "[Review your settings](/ci/concepts/cache-security#use-scoped-tokens-in-ci)"
      }
    ]
  },
  {
    "file": "2025-06-13-nx-21-2-release.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-06-13-nx-21-2-release.md",
    "links": [
      {
        "text": "running migration in interactive mode",
        "url": "/recipes/tips-n-tricks/advanced-update",
        "line": 24,
        "fullMatch": "[running migration in interactive mode](/recipes/tips-n-tricks/advanced-update)"
      },
      {
        "text": "Migrate UI in Nx Console",
        "url": "/recipes/nx-console/console-migrate-ui",
        "line": 24,
        "fullMatch": "[Migrate UI in Nx Console](/recipes/nx-console/console-migrate-ui)"
      },
      {
        "text": "Migrate UI",
        "url": "/recipes/nx-console/console-migrate-ui",
        "line": 70,
        "fullMatch": "[Migrate UI](/recipes/nx-console/console-migrate-ui)"
      },
      {
        "text": "Automate updating dependencies",
        "url": "/features/automate-updating-dependencies",
        "line": 74,
        "fullMatch": "[Automate updating dependencies](/features/automate-updating-dependencies)"
      }
    ]
  },
  {
    "file": "2025-06-19-setup-tailwind4-npm-workspace.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-06-19-setup-tailwind4-npm-workspace.md",
    "links": [
      {
        "text": "Nx Sync Generators",
        "url": "/concepts/sync-generators",
        "line": 103,
        "fullMatch": "[Nx Sync Generators](/concepts/sync-generators)"
      },
      {
        "text": "Nx project graph",
        "url": "/features/explore-graph",
        "line": 107,
        "fullMatch": "[Nx project graph](/features/explore-graph)"
      },
      {
        "text": "the guide on the Nx docs",
        "url": "/extending-nx/recipes/create-sync-generator",
        "line": 110,
        "fullMatch": "[the guide on the Nx docs](/extending-nx/recipes/create-sync-generator)"
      },
      {
        "text": "Nx Docs",
        "url": "/getting-started/intro",
        "line": 233,
        "fullMatch": "[Nx Docs](/getting-started/intro)"
      },
      {
        "text": "Nx Sync Generators Documentation",
        "url": "/extending-nx/recipes/create-sync-generator",
        "line": 235,
        "fullMatch": "[Nx Sync Generators Documentation](/extending-nx/recipes/create-sync-generator)"
      }
    ]
  },
  {
    "file": "2025-06-23-nx-self-healing-ci.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-06-23-nx-self-healing-ci.md",
    "links": [
      {
        "text": "flaky tasks",
        "url": "/ci/features/flaky-tasks",
        "line": 66,
        "fullMatch": "[flaky tasks](/ci/features/flaky-tasks)"
      },
      {
        "text": "Nx Console",
        "url": "/getting-started/editor-setup",
        "line": 141,
        "fullMatch": "[Nx Console](/getting-started/editor-setup)"
      },
      {
        "text": "AI integration documentation",
        "url": "/getting-started/ai-integration",
        "line": 143,
        "fullMatch": "[AI integration documentation](/getting-started/ai-integration)"
      },
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 165,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  },
  {
    "file": "2025-06-24-nx-cloud-introducing-polygraph.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-06-24-nx-cloud-introducing-polygraph.md",
    "links": [
      {
        "text": "**Workspace graph**",
        "url": "/ci/recipes/enterprise/polygraph#workspace-graph",
        "line": 42,
        "fullMatch": "[**Workspace graph**](/ci/recipes/enterprise/polygraph#workspace-graph)"
      },
      {
        "text": "**Conformance rules**",
        "url": "/ci/recipes/enterprise/polygraph#conformance",
        "line": 54,
        "fullMatch": "[**Conformance rules**](/ci/recipes/enterprise/polygraph#conformance)"
      },
      {
        "text": "**Custom Workflows**",
        "url": "/ci/recipes/enterprise/polygraph#custom-workflows",
        "line": 68,
        "fullMatch": "[**Custom Workflows**](/ci/recipes/enterprise/polygraph#custom-workflows)"
      },
      {
        "text": "**Nx Agents**",
        "url": "/ci/features/distribute-task-execution",
        "line": 75,
        "fullMatch": "[**Nx Agents**](/ci/features/distribute-task-execution)"
      },
      {
        "text": "Polygraph docs",
        "url": "/ci/recipes/enterprise/polygraph",
        "line": 104,
        "fullMatch": "[Polygraph docs](/ci/recipes/enterprise/polygraph)"
      },
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 105,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  },
  {
    "file": "2025-06-25-nx-cloud-mcp-ci-optimization.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-06-25-nx-cloud-mcp-ci-optimization.md",
    "links": [
      {
        "text": "Nx MCP",
        "url": "/getting-started/ai-integration#manual-setup-for-other-ai-clients",
        "line": 103,
        "fullMatch": "[Nx MCP](/getting-started/ai-integration#manual-setup-for-other-ai-clients)"
      },
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 149,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  },
  {
    "file": "2025-06-26-jetbrains-ci-notifications.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-06-26-jetbrains-ci-notifications.md",
    "links": [
      {
        "text": "or refer to our guide here",
        "url": "/getting-started/ai-integration#automatic-setup-with-nx-console",
        "line": 48,
        "fullMatch": "[or refer to our guide here](/getting-started/ai-integration#automatic-setup-with-nx-console)"
      }
    ]
  },
  {
    "file": "2025-07-17-polygraph-conformance.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-07-17-polygraph-conformance.md",
    "links": [
      {
        "text": "full details in our docs",
        "url": "/ci/recipes/enterprise/conformance/publish-conformance-rules-to-nx-cloud",
        "line": 62,
        "fullMatch": "[full details in our docs](/ci/recipes/enterprise/conformance/publish-conformance-rules-to-nx-cloud)"
      },
      {
        "text": "Set up a new library project",
        "url": "/ci/recipes/enterprise/conformance/publish-conformance-rules-to-nx-cloud",
        "line": 66,
        "fullMatch": "[Set up a new library project](/ci/recipes/enterprise/conformance/publish-conformance-rules-to-nx-cloud)"
      },
      {
        "text": "personal access token",
        "url": "/ci/recipes/security/personal-access-tokens",
        "line": 232,
        "fullMatch": "[personal access token](/ci/recipes/security/personal-access-tokens)"
      },
      {
        "text": "Custom Workflows",
        "url": "/ci/recipes/enterprise/custom-workflows",
        "line": 264,
        "fullMatch": "[Custom Workflows](/ci/recipes/enterprise/custom-workflows)"
      },
      {
        "text": "metadata-only workspaces",
        "url": "/ci/recipes/enterprise/metadata-only-workspace",
        "line": 270,
        "fullMatch": "[metadata-only workspaces](/ci/recipes/enterprise/metadata-only-workspace)"
      },
      {
        "text": "metadata-only workspaces",
        "url": "/ci/recipes/enterprise/metadata-only-workspace",
        "line": 275,
        "fullMatch": "[metadata-only workspaces](/ci/recipes/enterprise/metadata-only-workspace)"
      },
      {
        "text": "Conformance Documentation",
        "url": "/ci/recipes/enterprise/polygraph#conformance",
        "line": 331,
        "fullMatch": "[Conformance Documentation](/ci/recipes/enterprise/polygraph#conformance)"
      }
    ]
  },
  {
    "file": "2025-07-28-the-journey-of-the-nx-plugin-for-gradle.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-07-28-the-journey-of-the-nx-plugin-for-gradle.md",
    "links": [
      {
        "text": "Nx Plugin for Gradle Tutorial",
        "url": "/getting-started/tutorials/gradle-tutorial",
        "line": 64,
        "fullMatch": "[Nx Plugin for Gradle Tutorial](/getting-started/tutorials/gradle-tutorial)"
      }
    ]
  },
  {
    "file": "2025-07-29-spring-boot-with-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-07-29-spring-boot-with-nx.md",
    "links": [
      {
        "text": "Nx Plugin for Gradle Tutorial",
        "url": "/getting-started/tutorials/gradle-tutorial",
        "line": 145,
        "fullMatch": "[Nx Plugin for Gradle Tutorial](/getting-started/tutorials/gradle-tutorial)"
      }
    ]
  },
  {
    "file": "2025-07-30-android-and-nx.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-07-30-android-and-nx.md",
    "links": [
      {
        "text": "Nx Plugin for Gradle Tutorial",
        "url": "/getting-started/tutorials/gradle-tutorial",
        "line": 124,
        "fullMatch": "[Nx Plugin for Gradle Tutorial](/getting-started/tutorials/gradle-tutorial)"
      }
    ]
  },
  {
    "file": "2025-07-31-seamless-deploys-with-docker.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-07-31-seamless-deploys-with-docker.md",
    "links": [
      {
        "text": "Nx Plugin for Gradle Tutorial",
        "url": "/getting-started/tutorials/gradle-tutorial",
        "line": 152,
        "fullMatch": "[Nx Plugin for Gradle Tutorial](/getting-started/tutorials/gradle-tutorial)"
      },
      {
        "text": "Nx Release",
        "url": "/features/manage-releases",
        "line": 154,
        "fullMatch": "[Nx Release](/features/manage-releases)"
      }
    ]
  },
  {
    "file": "2025-08-05-polygraph-workspace-graph.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-08-05-polygraph-workspace-graph.md",
    "links": [
      {
        "text": "Workspace Graph",
        "url": "/ci/recipes/enterprise/polygraph#workspace-graph",
        "line": 29,
        "fullMatch": "[Workspace Graph](/ci/recipes/enterprise/polygraph#workspace-graph)"
      },
      {
        "text": "graph visualization",
        "url": "/features/explore-graph",
        "line": 39,
        "fullMatch": "[graph visualization](/features/explore-graph)"
      },
      {
        "text": "metadata-only workspaces",
        "url": "/ci/recipes/enterprise/metadata-only-workspace",
        "line": 57,
        "fullMatch": "[metadata-only workspaces](/ci/recipes/enterprise/metadata-only-workspace)"
      },
      {
        "text": "Connecting a metadata-only workspace",
        "url": "/ci/recipes/enterprise/metadata-only-workspace#connecting",
        "line": 59,
        "fullMatch": "[Connecting a metadata-only workspace](/ci/recipes/enterprise/metadata-only-workspace#connecting)"
      },
      {
        "text": "Applying a custom workflow",
        "url": "/ci/recipes/enterprise/metadata-only-workspace#connecting",
        "line": 59,
        "fullMatch": "[Applying a custom workflow](/ci/recipes/enterprise/metadata-only-workspace#connecting)"
      },
      {
        "text": "Workspace Graph Documentation",
        "url": "/ci/recipes/enterprise/polygraph#workspace-graph",
        "line": 93,
        "fullMatch": "[Workspace Graph Documentation](/ci/recipes/enterprise/polygraph#workspace-graph)"
      }
    ]
  },
  {
    "file": "2025-08-07-git-worktrees-ai-agents.md",
    "path": "/Users/jack/projects/nx-worktrees/DOC-107/docs/blog/2025-08-07-git-worktrees-ai-agents.md",
    "links": [
      {
        "text": "Nx AI Docs",
        "url": "/features/enhance-AI",
        "line": 164,
        "fullMatch": "[Nx AI Docs](/features/enhance-AI)"
      }
    ]
  }
];

async function updateFiles() {
  for (const fileData of updates) {
    console.log(`Updating ${fileData.file}...`);
    let content = await readFile(fileData.path, 'utf-8');
    
    // Sort links by position in reverse to avoid offset issues
    const sortedLinks = fileData.links.sort((a, b) => b.line - a.line);
    
    for (const link of fileData.links) {
      const newUrl = '/docs' + link.url;
      
      // For markdown links
      if (link.fullMatch.startsWith('[')) {
        const newMatch = link.fullMatch.replace(link.url, newUrl);
        content = content.replace(link.fullMatch, newMatch);
      }
      // For HTML links
      else if (link.fullMatch.startsWith('href=')) {
        const newMatch = link.fullMatch.replace(link.url, newUrl);
        content = content.replace(link.fullMatch, newMatch);
      }
    }
    
    await writeFile(fileData.path, content);
    console.log(`  ✅ Updated ${fileData.links.length} links`);
  }
}

updateFiles().catch(console.error);
