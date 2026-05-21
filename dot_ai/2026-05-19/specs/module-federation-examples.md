# Spec: Module Federation Examples (React)

**Date:** 2026-05-19
**Repo:** `~/projects/mf-examples`
**Scope:** React-only (rspack + rsbuild). Angular Native Federation is a follow-up stub at the bottom.

---

## 1. Goal

Build a minimal-but-realistic Module Federation example repo containing:

- **Two parallel React example trees**: one using **Rspack** directly, one using **Rsbuild**.
- Each tree contains **1 host + 3 remotes** (producers).
- Each tree is **self-contained and runnable without Nx** — pure pnpm workspaces + bundler CLIs. No Nx executors, no Nx-specific orchestration utilities.
- Follow the patterns prescribed by [module-federation.io](https://module-federation.io) (e.g. `@module-federation/enhanced`, `mf-manifest.json`, `dts: true` types).
- Webpack is **not supported** — the Rspack tree replaces it.
- A third Angular Native Federation tree will be added later; designed to share the same shape.

---

## 2. Top-level Repo Layout

```
mf-examples/
├── package.json                 # root: pnpm workspace + orchestration scripts
├── pnpm-workspace.yaml          # globs each tree's apps as members
├── tsconfig.base.json           # shared tsconfig (already exists)
├── nx.json                      # left in place; we do NOT depend on it
├── README.md                    # top-level: explains layout + entry point per tree
└── packages/
    ├── react-rspack/
    │   ├── package.json         # tree-level scripts: dev/build for this tree's apps
    │   ├── README.md
    │   ├── host/
    │   ├── remote-1/
    │   ├── remote-2/
    │   └── remote-3/
    ├── react-rsbuild/
    │   ├── package.json
    │   ├── README.md
    │   ├── host/
    │   ├── remote-1/
    │   ├── remote-2/
    │   └── remote-3/
    └── angular-native-fed/      # (follow-up — stub only in this spec)
```

### `pnpm-workspace.yaml`

Update existing file from `packages: ['packages/*']` to:

```yaml
packages:
  - 'packages/*'           # tree-level package.json (orchestration)
  - 'packages/*/*'         # each app (host, remote-*)
```

### Root `package.json` scripts

```json
{
  "scripts": {
    "dev:rspack":   "pnpm -F './packages/react-rspack/*' --parallel dev",
    "build:rspack": "pnpm -F './packages/react-rspack/*' build",
    "dev:rsbuild":   "pnpm -F './packages/react-rsbuild/*' --parallel dev",
    "build:rsbuild": "pnpm -F './packages/react-rsbuild/*' build",
    "preview:rsbuild": "pnpm -F './packages/react-rsbuild/*' --parallel preview",
    "test:e2e": "pnpm -F './packages/react-*' test:e2e"
  }
}
```

Per-tree `package.json` provides identical scripts scoped to its own children, so you can also `cd packages/react-rspack && pnpm dev` for tree-local work.

---

## 3. Shared Conventions (apply to BOTH trees)

### Ports

| App        | Port |
|------------|------|
| host       | 3000 |
| remote-1   | 3001 |
| remote-2   | 3002 |
| remote-3   | 3003 |

### Manifest path

Every remote serves `mf-manifest.json` at the root of its built output. Host references remotes as `name@http://localhost:PORT/mf-manifest.json` (hardcoded; documented in README how to swap for prod URLs).

### Module Federation runtime

`@module-federation/enhanced` `^2.4.0` (current latest as of 2026-05-19). Both rspack and rsbuild use the same plugin import path: `@module-federation/enhanced/rspack`. (Rsbuild's `tools.rspack` hook is how you reach the underlying rspack plugin interface.)

### Shared dependencies

Each app shares these as singletons:

```ts
shared: ['react', 'react-dom', 'react-router-dom']
```

No version pinning beyond defaults; the federation runtime negotiates. All apps install the same versions at top level — see Dep Versions below.

### Dep versions (pin at top of each package.json)

| Package                          | Version |
|----------------------------------|---------|
| `react`                          | `^19.2.6` |
| `react-dom`                      | `^19.2.6` |
| `react-router-dom`               | `^7.15.1` |
| `@module-federation/enhanced`    | `^2.4.0` |
| `@rsbuild/core`                  | `^2.0.6` (rsbuild tree only) |
| `@rsbuild/plugin-react`          | `^2.0.0` (rsbuild tree only) |
| `@rspack/core`                   | `^2.0.3` (rspack tree only) |
| `@rspack/cli`                    | `^2.0.3` (rspack tree only) |
| `typescript`                     | `~5.9.2` |
| `@types/react`                   | `^19.x` |
| `@types/react-dom`               | `^19.x` |
| `@playwright/test`               | `^1.60.0` |

### TypeScript + `@mf-types`

- All apps are TypeScript (`.tsx` / `.ts`).
- Every remote's `ModuleFederationPlugin` config sets `dts: true`, which auto-generates types under `@mf-types/` in the host project.
- Host's `tsconfig.json` includes `@mf-types/*` in its paths.
- The generated `@mf-types/` folder is `.gitignore`d (and present in `.gitignore` at each host root). Reference: official `react-manifest-example` follows this pattern.

### Code parity rule

The `src/` folders for host and each remote MUST be **identical byte-for-byte** between `react-rspack/` and `react-rsbuild/`. Only `rspack.config.ts` / `rsbuild.config.ts`, `package.json` (devDeps), and possibly `index.html` differ. Enforce informally via review; consider a `pnpm parity:check` script later (out of scope for v1).

### Plain CSS

Each app imports one stylesheet from its entry. Each remote uses a distinct accent color so the reader can see which one rendered:

| App | Accent color |
|-----|--------------|
| host | `#1f2937` (slate-800) |
| remote-1 | `#dc2626` (red-600) |
| remote-2 | `#16a34a` (green-600) |
| remote-3 | `#2563eb` (blue-600) |

---

## 4. App content (identical across both trees)

### Host

- Single page app with React Router (`createBrowserRouter`).
- Routes:
  - `/` — Home page. Renders a local component listing the three remotes with `<Link>` navigation and short descriptions.
  - `/remote-1` — lazy-loads `remote-1/RoutedApp` (Counter)
  - `/remote-2` — lazy-loads `remote-2/RoutedApp` (Form)
  - `/remote-3` — lazy-loads `remote-3/RoutedApp` (List)
- Each remote route uses `React.lazy` + `<Suspense fallback={<Loading />}>` + a `<RemoteErrorBoundary>` (basic class component that catches loading failures and shows a friendly retry message).
- Top-level layout: `<nav>` with links + `<main>` for the routed content.

### remote-1 — Counter

- Exposes `./RoutedApp` (a `RoutedApp.tsx` component).
- Renders an `<h1>` "Counter", a count display, `+`/`-`/reset buttons, uses `useState`.
- Standalone mode: own `index.html` mounts `<RoutedApp />` at port 3001.

### remote-2 — Form

- Exposes `./RoutedApp`.
- Controlled inputs (name, email, message), submit button, displays the submitted payload as JSON below the form.
- Standalone mode: own `index.html` at port 3002.

### remote-3 — List

- Exposes `./RoutedApp`.
- On mount: `fetch('https://jsonplaceholder.typicode.com/users')` → renders a list of users (name + email).
- Loading state + error state.
- Standalone mode: own `index.html` at port 3003.

### Standalone-runnable structure (each remote)

```
remote-1/
├── package.json
├── rspack.config.ts (or rsbuild.config.ts)
├── tsconfig.json
├── index.html
└── src/
    ├── index.ts            # dynamic import('./bootstrap') — required for shared init
    ├── bootstrap.tsx       # ReactDOM.createRoot(...).render(<RoutedApp />)
    ├── RoutedApp.tsx       # the exposed component
    └── style.css
```

The `index.ts` → `bootstrap.tsx` indirection is required by Module Federation so that shared modules can be initialized before the app code runs. The `index.html` references `index.ts` as its entry.

---

## 5. `react-rsbuild/` tree (concrete)

### `packages/react-rsbuild/package.json`

```json
{
  "name": "react-rsbuild",
  "private": true,
  "scripts": {
    "dev":     "pnpm -F './*' --parallel dev",
    "build":   "pnpm -F './*' build",
    "preview": "pnpm -F './*' --parallel preview",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "@playwright/test": "^1.60.0",
    "playwright": "^1.60.0"
  }
}
```

### Host: `packages/react-rsbuild/host/package.json`

```json
{
  "name": "react-rsbuild-host",
  "private": true,
  "scripts": {
    "dev":     "rsbuild dev",
    "build":   "rsbuild build",
    "preview": "rsbuild preview"
  },
  "dependencies": {
    "@module-federation/enhanced": "^2.4.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-router-dom": "^7.15.1"
  },
  "devDependencies": {
    "@rsbuild/core": "^2.0.6",
    "@rsbuild/plugin-react": "^2.0.0",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "typescript": "~5.9.2"
  }
}
```

### Host: `packages/react-rsbuild/host/rsbuild.config.ts`

```ts
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

export default defineConfig({
  server: { port: 3000 },
  plugins: [pluginReact()],
  tools: {
    rspack: (_config, { appendPlugins }) => {
      appendPlugins([
        new ModuleFederationPlugin({
          name: 'host',
          remotes: {
            'remote-1': 'remote_1@http://localhost:3001/mf-manifest.json',
            'remote-2': 'remote_2@http://localhost:3002/mf-manifest.json',
            'remote-3': 'remote_3@http://localhost:3003/mf-manifest.json',
          },
          shared: ['react', 'react-dom', 'react-router-dom'],
        }),
      ]);
    },
  },
});
```

### Remote (template): `packages/react-rsbuild/remote-1/rsbuild.config.ts`

```ts
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

export default defineConfig({
  server: { port: 3001 },
  dev: {
    // required so federated chunks resolve correctly during dev
    assetPrefix: true,
    client: { port: 3001 },
  },
  plugins: [
    pluginReact({
      splitChunks: { react: false, router: false },
    }),
  ],
  tools: {
    rspack: (config, { appendPlugins }) => {
      config.output!.uniqueName = 'remote_1';
      appendPlugins([
        new ModuleFederationPlugin({
          name: 'remote_1',
          filename: 'remoteEntry.js',
          exposes: {
            './RoutedApp': './src/RoutedApp.tsx',
          },
          shared: ['react', 'react-dom', 'react-router-dom'],
          dts: true,
        }),
      ]);
    },
  },
});
```

remote-2 / remote-3 are identical except for `server.port` (3002, 3003), `dev.client.port`, `uniqueName`, `name` in the plugin config.

---

## 6. `react-rspack/` tree (concrete)

### `packages/react-rspack/package.json`

```json
{
  "name": "react-rspack",
  "private": true,
  "scripts": {
    "dev":   "pnpm -F './*' --parallel dev",
    "build": "pnpm -F './*' build",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "@playwright/test": "^1.60.0",
    "playwright": "^1.60.0"
  }
}
```

(No `preview` — per the user decision, the rspack tree is asymmetric here. README explains.)

### Host: `packages/react-rspack/host/package.json`

```json
{
  "name": "react-rspack-host",
  "private": true,
  "scripts": {
    "dev":   "rspack serve",
    "build": "rspack build"
  },
  "dependencies": {
    "@module-federation/enhanced": "^2.4.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-router-dom": "^7.15.1"
  },
  "devDependencies": {
    "@rspack/core": "^2.0.3",
    "@rspack/cli": "^2.0.3",
    "@rspack/plugin-react-refresh": "^1.x",
    "@swc/helpers": "^0.5.18",
    "html-rspack-plugin": "^5.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "typescript": "~5.9.2"
  }
}
```

> Implementation note: confirm `html-rspack-plugin` vs `@rspack/core`'s built-in `rspack.HtmlRspackPlugin` at implementation time. Latest rspack ships with HTML plugin as a built-in.

### Host: `packages/react-rspack/host/rspack.config.ts`

```ts
import { defineConfig } from '@rspack/cli';
import * as rspack from '@rspack/core';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import * as path from 'node:path';

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  entry: { main: './src/index.ts' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
    uniqueName: 'host',
    clean: true,
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript', tsx: true },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: isDev,
                  refresh: isDev,
                },
              },
            },
          },
        },
      },
      { test: /\.css$/, type: 'css' },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({ template: './index.html' }),
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        'remote-1': 'remote_1@http://localhost:3001/mf-manifest.json',
        'remote-2': 'remote_2@http://localhost:3002/mf-manifest.json',
        'remote-3': 'remote_3@http://localhost:3003/mf-manifest.json',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
    isDev && new ReactRefreshPlugin(),
  ].filter(Boolean),
  experiments: { css: true },
});
```

### Remote (template): `packages/react-rspack/remote-1/rspack.config.ts`

```ts
import { defineConfig } from '@rspack/cli';
import * as rspack from '@rspack/core';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import * as path from 'node:path';

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  entry: { main: './src/index.ts' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
    uniqueName: 'remote_1',
    clean: true,
  },
  devServer: {
    port: 3001,
    historyApiFallback: true,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  module: { rules: [/* identical to host */] },
  plugins: [
    new rspack.HtmlRspackPlugin({ template: './index.html' }),
    new ModuleFederationPlugin({
      name: 'remote_1',
      filename: 'remoteEntry.js',
      exposes: {
        './RoutedApp': './src/RoutedApp.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
      dts: true,
    }),
    isDev && new ReactRefreshPlugin(),
  ].filter(Boolean),
  experiments: { css: true },
});
```

remote-2 / remote-3: change `entry`, `output.uniqueName`, `devServer.port`, plugin `name`.

---

## 7. Source code (identical between both trees)

For each app, `src/` is shared between rspack and rsbuild. Concrete files to write once and copy.

### Host `src/`

```
host/
├── index.html              # <div id="root"></div> + <script src="/src/index.ts">
├── src/
│   ├── index.ts            # await import('./bootstrap')
│   ├── bootstrap.tsx       # ReactDOM.createRoot + RouterProvider
│   ├── App.tsx             # <RouterProvider router={router} />
│   ├── routes.tsx          # createBrowserRouter with lazy remote routes
│   ├── pages/
│   │   └── Home.tsx        # local home page
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── Loading.tsx
│   │   └── RemoteErrorBoundary.tsx
│   └── style.css
└── tsconfig.json
```

Key file: `src/routes.tsx`:

```tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Loading } from './components/Loading';
import { RemoteErrorBoundary } from './components/RemoteErrorBoundary';
import { Home } from './pages/Home';

const RemoteOne   = lazy(() => import('remote-1/RoutedApp'));
const RemoteTwo   = lazy(() => import('remote-2/RoutedApp'));
const RemoteThree = lazy(() => import('remote-3/RoutedApp'));

const remote = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <RemoteErrorBoundary>
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  </RemoteErrorBoundary>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <><Nav /><main><Outlet /></main></>,  // use Outlet
    children: [
      { index: true, element: <Home /> },
      { path: 'remote-1', element: remote(RemoteOne) },
      { path: 'remote-2', element: remote(RemoteTwo) },
      { path: 'remote-3', element: remote(RemoteThree) },
    ],
  },
]);
```

### Remote `src/` (remote-1 example)

```
remote-1/
├── index.html              # <div id="root"></div> + <script src="/src/index.ts">
├── src/
│   ├── index.ts            # await import('./bootstrap')
│   ├── bootstrap.tsx       # ReactDOM.createRoot(...).render(<RoutedApp />)
│   ├── RoutedApp.tsx       # the exposed component (Counter)
│   └── style.css
└── tsconfig.json
```

`RoutedApp.tsx`:

```tsx
import { useState } from 'react';
import './style.css';

export default function RoutedApp() {
  const [count, setCount] = useState(0);
  return (
    <section className="remote-1">
      <h1>Remote 1 — Counter</h1>
      <p className="count">{count}</p>
      <div className="controls">
        <button onClick={() => setCount(c => c - 1)}>-</button>
        <button onClick={() => setCount(0)}>reset</button>
        <button onClick={() => setCount(c => c + 1)}>+</button>
      </div>
    </section>
  );
}
```

remote-2 (Form) and remote-3 (List) follow the same shape with their respective UIs.

---

## 8. Playwright smoke tests

One playwright config per tree, at `packages/react-rspack/` and `packages/react-rsbuild/`.

### `packages/react-rsbuild/playwright.config.ts`

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:3000' },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

### `packages/react-rsbuild/e2e/host.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('home lists the three remotes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /remote.?1/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /remote.?2/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /remote.?3/i })).toBeVisible();
});

test('remote-1 renders the counter', async ({ page }) => {
  await page.goto('/remote-1');
  await expect(page.getByRole('heading', { name: /counter/i })).toBeVisible();
  await page.getByRole('button', { name: '+' }).click();
  await expect(page.getByText('1')).toBeVisible();
});

test('remote-2 renders the form', async ({ page }) => {
  await page.goto('/remote-2');
  await expect(page.getByRole('heading', { name: /form/i })).toBeVisible();
});

test('remote-3 renders the list', async ({ page }) => {
  await page.goto('/remote-3');
  await expect(page.getByRole('heading', { name: /list/i })).toBeVisible();
  // wait for first user to load
  await expect(page.locator('li').first()).toBeVisible({ timeout: 10_000 });
});
```

Rspack tree gets an identical e2e spec.

> Note: Playwright's `webServer.command` will run `pnpm dev` which parallel-launches all 4 apps. `url: http://localhost:3000` waits for the host to be ready. Individual remotes don't need explicit readiness checks here — the host's lazy import will surface failures.

---

## 9. READMEs

### Top-level `README.md`

Replace the existing Nx scaffold README with a short overview that:
- Explains the two trees and what each demonstrates.
- Lists the apps and ports.
- Tells the reader to `cd packages/react-rspack && pnpm install && pnpm dev` (or rsbuild equivalent).
- Notes that Nx is in the workspace but **not used** for these examples — they are runnable with vanilla pnpm.

### `packages/react-rspack/README.md` and `packages/react-rsbuild/README.md`

Each tree's README covers:
- Architecture diagram (host + 3 remotes, ports).
- How to run dev, build, (preview — rsbuild only), e2e.
- How federation is wired (`mf-manifest.json` URLs in host config).
- How shared deps work in this example.
- How to add a new remote.
- (Rspack-only) Why there's no `preview` script.

---

## 10. Validation checklist (manual + automated)

Per tree:

- [ ] `pnpm install` at repo root succeeds.
- [ ] `pnpm -F react-rspack dev` (or rsbuild) starts all 4 apps without port conflicts.
- [ ] `curl -sf http://localhost:3001/mf-manifest.json | jq .` returns valid JSON for each remote.
- [ ] `http://localhost:3000/` loads the home page with links to all 3 remotes.
- [ ] `http://localhost:3000/remote-1` renders the Counter and increments on click.
- [ ] `http://localhost:3000/remote-2` renders the Form and the submitted payload appears below.
- [ ] `http://localhost:3000/remote-3` renders the user list (loaded from JSONPlaceholder).
- [ ] Visiting `http://localhost:3001/` directly renders remote-1 standalone (Counter). Same for 3002, 3003.
- [ ] `pnpm -F react-rspack build` produces `dist/` for each app, with `mf-manifest.json` inside each remote's `dist/`.
- [ ] (rsbuild only) `pnpm -F react-rsbuild preview` serves built output; the host wired to built remotes still loads them.
- [ ] `pnpm -F react-rspack test:e2e` and `pnpm -F react-rsbuild test:e2e` pass.
- [ ] Type-check passes: `@mf-types/` is populated after first dev/build, host imports of `remote-N/RoutedApp` are typed (not `any`).

Cross-tree:

- [ ] `diff -r packages/react-rspack/host/src packages/react-rsbuild/host/src` shows no diff (code parity rule).
- [ ] Same for each remote's `src/`.

---

## 11. Known gotchas / decisions to revisit during implementation

1. **`@mf-types` location and gitignore**: confirm where the enhanced plugin writes types in 2.4.x. The path may have moved between versions. If types land outside the host project, may need `dts: { tsConfigPath: ..., typesFolder: '@mf-types' }`.

2. **`splitChunks` for react/router in remotes (rsbuild)**: the `react-manifest-example` disables splitting for `react` and `router` chunks in the remote (`pluginReact({ splitChunks: { react: false, router: false } })`). Reason: federated remotes are expected to share react via the federation runtime, not as their own vendor chunks. Apply the same in rspack tree if it ships separate vendor chunking. Verify behavior at impl time.

3. **`output.publicPath: 'auto'` in rspack**: required so the remote's chunks load relative to the manifest URL. Without it, federated chunks may 404.

4. **`uniqueName` in rspack output**: required to prevent collisions in the global registry. Set per app.

5. **React 19 + react-router 7**: brand-new majors as of writing (verified versions above). If any incompatibility surfaces (e.g. `react-router-dom@7` API drift), pin to the latest known-good with the enhanced plugin and document. The official `react-manifest-example` was on React 18 + react-router 6 — we are intentionally ahead.

6. **Playwright `webServer.command`**: starting 4 dev servers in parallel via `pnpm dev` works but takes 5-10s. Bump timeout if flaky.

7. **`@rspack/plugin-react-refresh` peer**: confirm it pairs with `@rspack/core` `^2.0.3`. If not, drop refresh on first cut.

8. **Existing `nx.json` and `@nx/js` plugin**: leave intact (so Nx Console still works for Jack), but the spec does NOT depend on Nx executors at any layer. The example must run as `git clone && pnpm install && pnpm dev` without ever invoking `nx`.

9. **`pnpm-workspace.yaml` glob update**: `packages/*/*` is required to register host/remote-N as workspace members. Without it, `pnpm -F react-rsbuild-host` won't match.

---

## 12. Out of scope (intentional)

- SSR / Next.js / Remix federation.
- Dynamic / runtime remote registration.
- Shared state between host and remotes (e.g. shared store).
- Production deployment story (CDN, asset prefixing for prod URLs).
- Webpack support.
- CI workflow.
- Versioned remote artifact publishing.

---

## 13. Follow-up: Angular Native Federation (stub)

When the React trees are landed and the patterns prove out, add `packages/angular-native-fed/` mirroring the same shape:

- 1 host + 3 remotes, ports 3000–3003, hardcoded URLs, manifest-based.
- Use `@angular-architects/native-federation` (the canonical Angular MF library; uses esbuild + native ESM imports instead of webpack/rspack federation).
- Each remote exposes a routed standalone component.
- Host's `app.routes.ts` lazy-loads remote routes via `loadRemoteModule(...)`.
- Same content (counter, form, list).
- Same playwright e2e shape.

Key difference: Angular Native Federation uses an `import map` model rather than a `mf-manifest.json` model, but the dev/serve/build flow is structurally identical. Spec separately when starting that work.

---

## 14. Implementation order

1. Update root `pnpm-workspace.yaml`, root `package.json` scripts.
2. Build `packages/react-rsbuild/host` + one remote → verify end-to-end (host loads remote-1 at `/remote-1`).
3. Add remote-2, remote-3 → verify all routes.
4. Duplicate to `packages/react-rspack/` (copy src/, rewrite configs).
5. Add Playwright specs + run.
6. Write READMEs.
7. Manual validation checklist pass.
8. (Later) Angular Native Federation tree.

---

## 15. Nx module federation forward plan (added 2026-05-20)

Recommendation for `@nx/module-federation` and the React/Angular MF generators, informed by what this repo proves:

1. **Deprecate all existing MF generators + executors in Nx v23, remove in v24.** Standard lifecycle. Today's `@nx/react:host` / `@nx/angular:host` and their `module-federation-dev-server` / `module-federation-ssr-dev-server` executors get a deprecation notice in v23 and are gone in v24.

2. **New consumer / producer generators target rsbuild, vite, and Angular Native Federation only.** These are the three setups this repo demonstrates as the realistic stack choices — first-class plugins, working dev/build/preview, behave correctly under dynamic federation.

3. **TypeScript-solution-style workspace setup just works.** Because the new generators target plain Vite / Rsbuild / Angular CLI (not custom Nx-wrapped bundlers), the workspace's TS project references and `paths` mappings flow through unchanged. No `NX_IGNORE_UNSUPPORTED_TS_SETUP` escape hatch needed, which the legacy `@nx/react`/`@nx/angular` MF generators required in this repo.

4. **Dynamic federation removes the need to orchestrate every remote.** Remotes registered at runtime (manifest or per-route lazy) → a missing remote is a 404 the host's error boundary handles. No need to build-and-static-serve every remote up front. `dependsOn` only needs to bring the host alongside a remote being served; siblings can be left off, started via `nx run-many` on demand, or pointed at deployed URLs.

5. **Rspack is NOT supported in the new generators.** No rspack flavor of consumer/producer ships. Existing manual rspack federation setups continue to work via `@module-federation/enhanced/rspack` upstream, but Nx-blessed generators won't include it. Collect demand via GitHub issue or RFC to decide whether to revisit.

6. **Webpack will NOT be supported — full stop.** No deprecation path back. The legacy `@nx/angular:host` (webpack MF) goes away with the v24 removal and isn't replaced. New Angular work targets Native Federation.

### What this means for `@nx/module-federation`

- Thinner package in v23+: no executors (already empty in 22.7), no Nx-shipped bundler plugin (those live in `@module-federation/enhanced` upstream).
- Remaining role: shared utilities consumed by the new generators (manifest scaffolding, type generation, dynamic-remote helpers).
- Drop the orchestration story (dev server bringing up static-served siblings). Dynamic federation makes it unnecessary, and the existing rspack/webpack-coupled implementation can't extend to vite/native-fed cleanly.

### Evidence base in this repo

- `apps/react-vite/`, `apps/react-rsbuild/` — dynamic-federation flow with cross-bundler remotes working.
- `apps/angular-native-fed/` — Native Federation's manifest-at-runtime model and graceful 404 handling.
- `apps/nx-react-vite/` — the minimum Nx wiring (`dependsOn` + `continuous` + plain `nx:run-commands`) is enough to get "serve a remote, host comes along" UX. No custom executor required.
- The dynamic e2e suites (`apps/react-{rspack,rsbuild,vite}/e2e-dynamic/`, `apps/angular-native-fed/e2e-dynamic/`) prove the host renders cleanly when only a subset of remotes is alive.
- `apps/nx-react/`, `apps/nx-angular/` (legacy generators) document the rough edges the new generators should avoid: TS project-references conflict, `tsc --emitDeclarationOnly` polluting the dist dir that the static-remote proxy reads from, hyphen-restricted project names, host-via-rspack-plugin orchestration that breaks when typecheck cache and rspack build collide.
