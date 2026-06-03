---
name: ocean-component-shot
description: Render a single Ocean (Nx Cloud) React component in isolation with the real design tokens and capture a screenshot (light + dark), without booting the full Remix app/DB. Use when you need to visually verify or proof-of-work a component you built/changed in the ocean repo, especially when nx/serve is unavailable. Triggers on "screenshot this component", "render it in isolation", "show me what it looks like", "component shot", "preview the component", "verify the design", "check light and dark".
---

# Ocean component screenshot harness

Render one component with real `@ocean/ui-design` tokens via a tiny Vite app, then screenshot it through the chrome-devtools (or playwright) MCP browser. No full app, DB, or auth needed.

## Why this exists / hard constraints

- **Sandboxed Chromium cannot launch** from a Bash command (`chrome-headless-shell` dies with a Mach-port `Permission denied` error). You MUST drive the **chrome-devtools / playwright MCP** browser instead of a node Playwright script.
- **nx is often broken in the sandbox** (the `@nx/gradle` plugin needs `gradlew`), so `nx serve` won't work. This harness sidesteps it with plain Vite.
- Workspace libs resolve as **pnpm workspace packages** (node_modules symlinks), so `@ocean/...`, `@nx-cloud/...` imports just work in Vite with no path-alias config.

## Setup (modeled on the existing `.oom-shot/` dir)

Create a scratch dir at the repo root, e.g. `.preview-shots/` (gitignored class, like `.oom-shot/`). **Use the Write tool for every file** - fish heredocs corrupt `<!doctype` into `<\!doctype`.

Files:

1. `vite.config.mts`
   ```ts
   import tailwindcss from '@tailwindcss/vite';
   import { dirname, resolve } from 'node:path';
   import { fileURLToPath } from 'node:url';
   import { defineConfig } from 'vite';
   const __dirname = dirname(fileURLToPath(import.meta.url));
   const repoRoot = resolve(__dirname, '..');
   export default defineConfig({
     root: __dirname,
     plugins: [tailwindcss()],
     esbuild: { jsx: 'automatic', jsxImportSource: 'react' },
     // Components import Link/useNavigate from @remix-run/react; map to react-router-dom
     // so a MemoryRouter supplies the context.
     resolve: { alias: { '@remix-run/react': resolve(__dirname, 'remix-shim.ts') } },
     server: { port: 5599, strictPort: true, fs: { allow: [repoRoot] } },
   });
   ```
2. `remix-shim.ts` -> `export * from 'react-router-dom';`
3. `styles.css` -> `@import '../apps/nx-cloud/app/main.css';` (pulls the real design tokens + Tailwind `@source` scan)
4. `index.html` -> standard doctype + `<div id="root">` + `<script type="module" src="/main.tsx">`
5. `main.tsx` -> import the component **directly by file path** (avoid barrels with server-only siblings), wrap in `<MemoryRouter>` + `<div className="bg-background text-typography p-8">`. Switch view/theme by query param so each navigation is a full reload:
   ```ts
   const params = new URLSearchParams(location.search);
   if (params.get('theme') === 'dark') document.documentElement.classList.add('dark');
   const view = params.get('view'); // pick which component to render
   ```
   (`.dark` class triggers dark tokens; `main.css` defines `@custom-variant dark (&:where(.dark, .dark *))`.)

## Run + screenshot

1. Start Vite in the background: `npx --no-install vite --config .preview-shots/vite.config.mts --force`. Wait for "ready".
2. Drive the MCP browser: `mcp__chrome-devtools__resize_page` -> `navigate_page` to `http://localhost:<port>/?view=<x>&theme=<light|dark>` -> `take_screenshot` (save to `.preview-shots/out/`). Read the PNG to verify.
3. To debug invisible/contrast issues, use `mcp__chrome-devtools__evaluate_script` to read `getComputedStyle(el).color` / `.backgroundColor`.

## Gotchas

- **Use a query param (`?view=`), not a hash** - browsers don't reload the document on a hash-only change, so the page keeps the previous view.
- **Vite HMR serves stale modules on deep component edits.** After editing a component, if the screenshot doesn't change, **restart Vite on a fresh port** (killing the old port is unreliable in the sandbox). A new port = new module URLs = no browser/HMR cache.
- The MCP browser profile can be locked ("Browser is already in use") - use chrome-devtools if playwright is busy, or vice versa.
- The scratch dir is for proof-of-work only; do not commit it (mirror `.oom-shot/`).

## When NOT to use

- For routing/loader/data-driven behavior, or anything needing auth/DB, use the real e2e harness (`nx serve nx-cloud --configuration=e2e`) instead.
