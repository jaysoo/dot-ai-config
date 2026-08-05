---
name: cnw-dist-smoke
description: 'Smoke-test the locally built create-nx-workspace CLI end-to-end against the real npm registry, optionally simulating blocked github.com egress (sandboxed AI agents). Packs the built package, pins its version to a published nx so the sandbox install works, and runs scenario commands with a fetch shim + diverted telemetry. Use when changing CNW download/preset/error flows and needing live proof beyond unit tests. Triggers: "smoke test CNW", "run the CNW dist smoke", "test create-nx-workspace locally", "simulate blocked github", "verify the CNW error path live".'
---

# CNW dist smoke test

Live end-to-end run of the locally built `create-nx-workspace` against the real npm registry, with optional blocked-github simulation. Proven on NXC-4687 (egress fallback + error taxonomy).

## Why each step exists

- `npm install <repo>/packages/create-nx-workspace` fails on pnpm `catalog:` deps - must `pnpm pack` from the package dir (resolves catalogs at pack time).
- The built package's version is `0.0.1`; `createSandbox`/`nx new` would try to install `nx@0.0.1` from the registry and fail - pin the INSTALLED copy's package.json to a real published version (e.g. latest stable).
- Node fetch ignores HTTPS_PROXY, so blocking github is simulated with a `--require` shim that rejects github.com fetches - this matches the real sandbox failure signature (thrown fetch).
- `NX_CLOUD_API=http://127.0.0.1:9` diverts `recordStat` so smoke runs never pollute prod CNW telemetry (it fails silently, 400ms timeout).

## Steps

1. Build: `pnpm nx build create-nx-workspace` (output: `packages/create-nx-workspace/dist/`).
2. Pack: `cd packages/create-nx-workspace && pnpm pack --out <scratch>/cnw.tgz`.
3. Install into a scratch dir: `mkdir smoke && cd smoke && npm install ../cnw.tgz`.
4. Pin version (pick a published nx version, `npm view nx dist-tags.latest`):

   ```bash
   node -e 'const f="./node_modules/create-nx-workspace/package.json"; const p=require(f); p.version="<PUBLISHED_VERSION>"; require("fs").writeFileSync(f, JSON.stringify(p,null,2));'
   ```

5. Fetch shim (`shim.cjs` in the smoke dir) - write with the Write tool, not heredocs:

   ```js
   const orig = globalThis.fetch;
   globalThis.fetch = (url, ...args) => {
     if (String(url).includes('github.com')) {
       return Promise.reject(new TypeError('fetch failed: blocked egress (smoke shim)'));
     }
     return orig(url, ...args);
   };
   ```

6. Run scenarios (AI mode is auto-on under Claude Code via CLAUDECODE env; output is NDJSON):

   ```bash
   # blocked egress - expect NETWORK_ERROR + hints, exit 1
   NODE_OPTIONS="--require $PWD/shim.cjs" NX_CLOUD_API=http://127.0.0.1:9 \
     node node_modules/create-nx-workspace/dist/bin/index.js proj \
     --template=nrwl/empty-template --nxCloud=skip --skipGit --interactive=false

   # escape hatch - expect success via npm-only preset flow, exit 0
   NODE_OPTIONS="--require $PWD/shim.cjs" NX_CLOUD_API=http://127.0.0.1:9 \
     node node_modules/create-nx-workspace/dist/bin/index.js proj2 \
     --preset=empty --nxCloud=skip --skipGit --interactive=false

   # control - no shim, template path must still work
   NX_CLOUD_API=http://127.0.0.1:9 \
     node node_modules/create-nx-workspace/dist/bin/index.js proj3 \
     --template=nrwl/empty-template --nxCloud=skip --skipGit --interactive=false
   ```

7. Verify: exit codes, NDJSON error payload (`errorCode`, `hints`), and generated workspace shape (`package.json` workspaces + devDependencies, `nx.json` plugins).

## Gotchas

- Rebuilt code? Re-pack AND re-install - the smoke dir holds a copy, not a link. Confirm with `grep <new-string> node_modules/create-nx-workspace/dist/...`.
- NODE_OPTIONS propagates to child processes (npm install, nx new); the shim only touches `globalThis.fetch`, so npm's own registry client is unaffected.
- Preset-flow scenarios really install from npm (sandbox + nx new) - expect 1-3 min each.
- Run `git push` and long commands unpiped; check `$status` (fish `$pipestatus` trap).
