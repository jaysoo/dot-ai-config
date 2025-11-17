# Nx 2026 Roadmap

In 2026, we're expanding beyond the JavaScript ecosystem while continuing to push forward within it. As always, these are high-level directions—not commitments to specific versions or timelines.

## Polyglot Monorepos

We're doubling down on polyglot support. First-class .NET support is now available through `@nx/dotnet`, so you can build mixed or standalone .NET monorepos. Our Java support keeps getting better with continued work on `@nx/maven`. We're also experimenting with `@nx/php`, and we've had conversations about Python support. What we work on here is largely driven by what you all need, so we'd love to hear your thoughts on polyglot support.

## Native Toolchains

This is related to polyglot repos. We want to better support monorepos using `mise` or similar tools to manage their environments. We want to look into partial graph support when running tasks, such at a JavaScript developer does not need to have Java or .NET set up locally to run their tasks in the monorepo. For example, using `MISE_ENABLE_TOOLS=node` locally or in CI means that `@nx/gradle` or `@nx/donet` will not work, thus a only a partial graph for Node.js can be generated.

## Modern JavaScript and TypeScript

We've already added support for Node.js 24 (now in LTS). In 2026, we're keeping up with the next wave of JavaScript tooling. We're watching the oxc ecosystem closely—oxlint, oxfmt, and friends—along with Biome. These tools are fast, and we're figuring out how to bring them into Nx workspaces. We're also dealing with the growing number of ESM-only tools, making sure Nx stays aligned with where the ecosystem is headed.

## Nx Release for Apps

We're evolving Nx Release to handle Docker better—versioning, building, and publishing images in monorepos. We're using it ourselves and working with early adopters to refine it. In 2026, we'll add support for polyglot scenarios, so you can manage .NET, Java, and JavaScript services the same way. Whether you're deploying to Kubernetes, cloud platforms, or container registries, Nx Release will handle the coordination.

## AI-Native Development

We're making Nx work better with AI tools. That means improving AI-assisted migrations for upgrading dependencies and refactoring code. We're also exploring better metadata for plugins to make them more AI-friendly, and other improvements to our MCP tools. The cool thing is that Nx's explicit project graph gives AI tools like Claude Code, Cursor, and Copilot solid structure to work. We'll keep experimenting here.

## Performance and Observability

We're moving more of Nx to Rust, including the task orchestrator, to make things faster. We're also adding CPU and memory tracking for tasks through Nx Cloud, so you can see what's actually consuming resources in your monorepo. And of course, we'll keep making our core and plugins faster throughout the year.
